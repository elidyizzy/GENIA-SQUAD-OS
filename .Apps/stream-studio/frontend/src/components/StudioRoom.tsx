"use client";

import { useEffect, useRef, useState } from 'react';
import { useWebRTC } from '@/hooks/useWebRTC';

interface StudioRoomProps {
  roomName: string;
  userName: string;
  isHost: boolean;
}

// Helper component for remote videos
function RemoteVideo({ stream, name, id }: { stream: MediaStream, name: string, id: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream;
  }, [stream]);

  return (
    <div className="relative aspect-video bg-graphite-900 rounded-lg overflow-hidden border border-graphite-700">
      <video id={id} ref={ref} autoPlay playsInline className="w-full h-full object-cover" />
      <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-1 rounded text-xs backdrop-blur-sm shadow-md text-white">
        {name}
      </div>
    </div>
  );
}

export default function StudioRoom({ roomName, userName, isHost }: StudioRoomProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localScreenRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);

  const [messages, setMessages] = useState<{ sender: string, text: string, timestamp: number }[]>([]);
  const [chatInput, setChatInput] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const liveRecorderRef = useRef<MediaRecorder | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const recordedChunks = useRef<Blob[]>([]);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioDestinationRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const audioSourcesRef = useRef<Map<string, MediaStreamAudioSourceNode>>(new Map());

  // Initialize WebRTC Mesh
  const { peers, socket, replaceVideoTrack } = useWebRTC(roomName, stream);

  // Chat Effect
  useEffect(() => {
    if (!socket) return;
    const handleMessage = (data: { sender: string, text: string, timestamp: number }) => {
      setMessages(prev => [...prev, data]);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    };
    socket.on('chat-message', handleMessage);
    return () => {
      socket.off('chat-message', handleMessage);
    };
  }, [socket]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !socket) return;
    socket.emit('chat-message', { room: roomName, sender: userName, text: chatInput.trim(), timestamp: Date.now() });
    setChatInput('');
  };

  // --- Setup AudioContext + mixagem incremental ---
  useEffect(() => {
    if (!stream) return;

    const ctx = new AudioContext();
    const dest = ctx.createMediaStreamDestination();

    audioContextRef.current = ctx;
    audioDestinationRef.current = dest;

    // fonte local
    const localSource = ctx.createMediaStreamSource(stream);
    audioSourcesRef.current.set('local', localSource);
    localSource.connect(dest);

    return () => {
      audioSourcesRef.current.forEach(source => source.disconnect());
      audioSourcesRef.current.clear();
      dest.disconnect();
      ctx.close();
      audioContextRef.current = null;
      audioDestinationRef.current = null;
    };
  }, [stream]);

  // adiciona / remove audios de convidados dinamicamente
  useEffect(() => {
    if (!audioContextRef.current || !audioDestinationRef.current) return;

    peers.forEach(peer => {
      if (!audioSourcesRef.current.has(peer.socketId) && peer.stream.getAudioTracks().length > 0) {
        try {
          const source = audioContextRef.current!.createMediaStreamSource(peer.stream);
          source.connect(audioDestinationRef.current!);
          audioSourcesRef.current.set(peer.socketId, source);
        } catch (err) {
          console.error('Falha ao adicionar audio remoto', err);
        }
      }
    });

    // remove fontes de peers que sairam
    audioSourcesRef.current.forEach((source, key) => {
      if (key !== 'local' && !peers.find(p => p.socketId === key)) {
        source.disconnect();
        audioSourcesRef.current.delete(key);
      }
    });
  }, [peers]);

  // --- Audio / Video Mixing Engine ---
  const getMixedStream = () => {
    if (!canvasRef.current) return null;

    // 1. Get Video from Canvas
    const canvasStream = canvasRef.current.captureStream(30);
    const videoTrack = canvasStream.getVideoTracks()[0];

    const audioTrack = audioDestinationRef.current?.stream.getAudioTracks()[0];

    if (audioTrack) {
      return new MediaStream([videoTrack, audioTrack]);
    }

    // sem audio (fallback)
    return new MediaStream([videoTrack]);
  };

  const localRecorderStop = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      localRecorderStop();
      return;
    }

    const mixedStream = getMixedStream();
    if (!mixedStream) return alert("O estúdio não está pronto");

    recordedChunks.current = [];
    const options = { mimeType: 'video/webm;codecs=vp8,opus' };
    const recorder = new MediaRecorder(mixedStream, options);

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunks.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `Gravacao_Estudio_${new Date().getTime()}.webm`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    };

    recorder.start();
    mediaRecorderRef.current = recorder;
    setIsRecording(true);
  };

  const handleToggleStreaming = () => {
    if (isStreaming) {
      // Stop Streaming
      wsRef.current?.close();
      if (liveRecorderRef.current?.state === 'recording') {
        liveRecorderRef.current.stop();
      }
      setIsStreaming(false);
    } else {
      // Start Streaming
      const mixedStream = getMixedStream();
      if (!mixedStream) return alert("O estúdio não está pronto");

      const ws = new WebSocket('ws://localhost:3001/rtmp');
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("Conectado ao Relay do Servidor RTMP");
        const options = { mimeType: 'video/webm;codecs=vp8,opus' };
        const recorder = new MediaRecorder(mixedStream, options);

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0 && ws.readyState === WebSocket.OPEN) {
            ws.send(e.data);
          }
        };

        recorder.start(1000); // 1-second chunks for low latency streaming
        liveRecorderRef.current = recorder;
        setIsStreaming(true);
      };

      ws.onclose = () => {
        console.log("Conexão RTMP fechada");
        setIsStreaming(false);
        if (liveRecorderRef.current?.state === 'recording') {
          liveRecorderRef.current.stop();
        }
      };
    }
  };

  const stopScreenShare = () => {
    if (screenStream) {
      screenStream.getTracks().forEach(t => t.stop());
      setScreenStream(null);
    }
    setIsScreenSharing(false);

    // Restore camera track to peers
    if (stream) {
      const cameraTrack = stream.getVideoTracks()[0];
      replaceVideoTrack(cameraTrack);
    }
  };

  const startScreenShare = async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = displayStream.getVideoTracks()[0];

      screenTrack.onended = () => stopScreenShare();

      setScreenStream(displayStream);
      setIsScreenSharing(true);

      if (localScreenRef.current) {
        localScreenRef.current.srcObject = displayStream;
      }

      // Send screen track to peers
      replaceVideoTrack(screenTrack);
    } catch (err) {
      console.error("Falha ao compartilhar a tela", err);
    }
  };

  const handleToggleScreenShare = () => {
    if (isScreenSharing) {
      stopScreenShare();
    } else {
      startScreenShare();
    }
  };

  const toggleMic = () => {
    if (!stream) return;
    const next = !isMicOn;
    stream.getAudioTracks().forEach(track => {
      track.enabled = next;
    });
    setIsMicOn(next);
  };

  const toggleCamera = () => {
    if (!stream) return;
    const next = !isCamOn;
    stream.getVideoTracks().forEach(track => {
      track.enabled = next;
    });
    setIsCamOn(next);

    // atualiza track enviada para os peers (quando não está em share)
    if (!isScreenSharing) {
      const cameraTrack = stream.getVideoTracks()[0];
      if (cameraTrack) {
        replaceVideoTrack(cameraTrack);
      }
    }
  };

  // --- HTML5 Canvas Composition Loop (Host Only) ---
  useEffect(() => {
    if (!isHost || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastFrame = performance.now();
    const targetDelta = 1000 / 30; // 30fps

    const renderLoop = (now: number) => {
      if (now - lastFrame >= targetDelta) {
        lastFrame = now;

        // Background
        ctx.fillStyle = '#111111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (isScreenSharing && localScreenRef.current && localScreenRef.current.readyState >= 2) {
          // --- PiP LAYOUT (Screen Share Full, Host Camera PiP) ---
          const screenVid = localScreenRef.current;
          const sRatio = screenVid.videoWidth / screenVid.videoHeight;
          const cRatio = canvas.width / canvas.height;
          let drawW = canvas.width;
          let drawH = canvas.height;
          let drawX = 0;
          let drawY = 0;

          if (sRatio > cRatio) {
            drawH = canvas.width / sRatio;
            drawY = (canvas.height - drawH) / 2;
          } else {
            drawW = canvas.height * sRatio;
            drawX = (canvas.width - drawW) / 2;
          }
          ctx.drawImage(screenVid, drawX, drawY, drawW, drawH);

          // convidados em miniaturas laterais
          const remoteThumbs: { vid: HTMLVideoElement; label: string }[] = [];
          peers.forEach((peer, idx) => {
            const remoteVid = document.getElementById(`remote-${peer.socketId}`) as HTMLVideoElement;
            if (remoteVid && remoteVid.readyState >= 2) {
              remoteThumbs.push({ vid: remoteVid, label: `Convidado ${idx + 1}` });
            }
          });

          if (remoteThumbs.length > 0) {
            const thumbW = 200;
            const thumbH = 112;
            const gap = 14;
            const totalH = remoteThumbs.length * (thumbH + gap) - gap;
            let startY = (canvas.height - totalH) / 2;

            remoteThumbs.forEach(({ vid, label }, i) => {
              const x = 24;
              const y = startY + i * (thumbH + gap);
              ctx.drawImage(vid, x, y, thumbW, thumbH);
              ctx.fillStyle = 'rgba(0,0,0,0.55)';
              ctx.fillRect(x + 8, y + thumbH - 28, thumbW - 16, 24);
              ctx.fillStyle = 'white';
              ctx.font = '16px Arial';
              ctx.fillText(label, x + 14, y + thumbH - 11);
            });
          }

          // Draw Host Camera PiP
          const camVid = localVideoRef.current;
          if (camVid && camVid.readyState >= 2) {
            const pipWidth = 320;
            const pipHeight = 180;
            const pipX = canvas.width - pipWidth - 40;
            const pipY = canvas.height - pipHeight - 40;

            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(camVid, -pipX - pipWidth, pipY, pipWidth, pipHeight);
            ctx.restore();

            // PiP Border
            ctx.strokeStyle = '#eab308'; // yolk-500
            ctx.lineWidth = 4;
            ctx.strokeRect(pipX, pipY, pipWidth, pipHeight);

            // PiP Nameplate
            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            ctx.fillRect(pipX, pipY + pipHeight - 30, pipWidth, 30);
            ctx.fillStyle = 'white';
            ctx.font = '16px Arial';
            ctx.fillText(userName, pipX + 10, pipY + pipHeight - 10);
          }
        } else {
          // --- NORMAL GRID LAYOUT ---
          const videos: HTMLVideoElement[] = [];
          const localVid = document.getElementById('local-video') as HTMLVideoElement;
          if (localVid && localVid.readyState >= 2) videos.push(localVid);

          peers.forEach(peer => {
            const remoteVid = document.getElementById(`remote-${peer.socketId}`) as HTMLVideoElement;
            if (remoteVid && remoteVid.readyState >= 2) videos.push(remoteVid);
          });

          const count = videos.length;
          if (count > 0) {
            let cols = Math.ceil(Math.sqrt(count));
            let rows = Math.ceil(count / cols);
            let width = canvas.width / cols;
            let height = canvas.height / rows;

            videos.forEach((vid, i) => {
              const col = i % cols;
              const row = Math.floor(i / cols);
              const x = col * width;
              const y = row * height;

              if (vid.id === 'local-video') {
                ctx.save();
                ctx.scale(-1, 1);
                ctx.drawImage(vid, -x - width, y, width, height);
                ctx.restore();
              } else {
                ctx.drawImage(vid, x, y, width, height);
              }

              ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
              ctx.fillRect(x + 20, y + height - 60, 200, 40);
              ctx.fillStyle = 'white';
              ctx.font = '24px Arial';
              const nameText = vid.id === 'local-video' ? userName : `Convidado`;
              ctx.fillText(nameText, x + 30, y + height - 32);
            });
          }
        }
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop(performance.now());

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHost, peers, userName, isScreenSharing]);

  useEffect(() => {
    // 1. Get User Media
    async function startLocalMedia() {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: true
        });
        setStream(userStream);
        streamRef.current = userStream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = userStream;
        }
      } catch (err) {
        console.error("Falha ao acessar mídia local", err);
        alert("Por favor, permita o acesso à câmera e ao microfone");
      }
    }

    startLocalMedia();

    return () => {
      // Cleanup
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      localRecorderStop();
      if (liveRecorderRef.current?.state === 'recording') {
        liveRecorderRef.current.stop();
      }
      wsRef.current?.close();
    };
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-graphite-950 p-4 text-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 px-4 py-3 bg-graphite-900 rounded-xl border border-graphite-700 shadow-sm">
        <div>
          <h2 className="text-xl font-bold font-mono text-white">Sala: {roomName}</h2>
          <p className="text-sm text-gray-400">Logado como {userName} {isHost && <span className="text-yolk-500 ml-2 font-bold">(ANFITRIÃO)</span>}</p>
        </div>

        {isHost && (
          <div className="flex gap-3">
            <button
              onClick={handleToggleRecording}
              className={`px-6 py-2 rounded-md font-semibold text-sm transition-colors border ${
                isRecording
                  ? 'bg-graphite-800 border-red-500 text-red-500 animate-pulse'
                  : 'bg-graphite-800 hover:bg-graphite-700 border-graphite-700 text-gray-200'
              }`}
            >
              {isRecording ? '⏺ Gravando...' : '⏺ Gravar Localmente'}
            </button>
            <button
              onClick={handleToggleStreaming}
              className={`px-6 py-2 rounded-md font-semibold text-sm transition-colors ${
                isStreaming
                  ? 'bg-red-700 hover:bg-red-800 animate-pulse'
                  : 'bg-red-600 hover:bg-red-500'
              }`}
            >
              {isStreaming ? 'AO VIVO (Parar)' : 'Transmitir para o YouTube'}
            </button>
          </div>
        )}
      </div>

      {/* Main Studio Area */}
      <div className="flex-1 flex gap-4 overflow-hidden">

        {/* Participants Grid (The Mesh) */}
        <div className="flex-1 bg-graphite-900 rounded-xl border border-graphite-700 p-4 overflow-y-auto custom-scrollbar">
          <h3 className="text-lg text-white font-semibold mb-3">Participantes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Local User */}
            <div className={`relative aspect-video bg-black rounded-lg overflow-hidden ring-2 ${isScreenSharing ? 'ring-yolk-500' : 'ring-graphite-700 border border-graphite-700'}`}>
              <video
                id="local-video"
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-cover ${!isScreenSharing ? 'transform -scale-x-100' : ''}`}
              />
              <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-1 rounded text-xs backdrop-blur-sm shadow-md text-white">
                {userName} (Você)
              </div>
            </div>
            {/* Hidden Screen Share Video for Canvas Drawing */}
            {isScreenSharing && (
              <video
                ref={localScreenRef}
                autoPlay
                muted
                playsInline
                className="hidden"
              />
            )}

            {/* Remote Peers injected from WebRTC Hook */}
            {peers.map((peer, idx) => (
              <RemoteVideo key={peer.socketId} id={`remote-${peer.socketId}`} stream={peer.stream} name={`Convidado ${idx + 1}`} />
            ))}

          </div>
        </div>
        {/* Studio Controls / Scene Manager (Host only view logic usually) */}
        {isHost && (
          <div className="w-[300px] bg-graphite-900 rounded-xl border border-graphite-700 p-4 flex flex-col">
            <h3 className="text-lg text-white font-semibold mb-4 border-b border-graphite-700 pb-2">Painel do Estúdio</h3>
            <p className="text-xs text-gray-400 mb-4">Prévia do Canvas (1920x1080)</p>

            {/* Real Canvas element */}
            <div className="w-full aspect-video bg-graphite-800 rounded-md flex items-center justify-center border border-graphite-700 overflow-hidden relative">
              <canvas
                ref={canvasRef}
                width={1920}
                height={1080}
                className="w-full h-full object-contain"
              />
              {!isHost && (
                <div className="absolute inset-0 flex items-center justify-center bg-graphite-900/80">
                  <span className="text-gray-400 text-sm">Você é um Convidado</span>
                </div>
              )}
            </div>

            <div className="mt-4 text-xs text-yolk-500/80 space-y-2 bg-yolk-900/20 p-3 rounded border border-yolk-500/30">
              <p>💡 O Canvas acima é o que será gravado e transmitido.</p>
              <p>💡 Os convidados não podem ver esta prévia.</p>
            </div>
          </div>
        )}

        {/* Chat Panel */}
        <div className="w-[300px] bg-graphite-900 rounded-xl border border-graphite-700 p-4 flex flex-col h-full hidden md:flex shadow-sm">
          <h3 className="text-lg text-white font-semibold mb-4 border-b border-graphite-700 pb-2">Bate-papo ao vivo</h3>
          <div className="flex-1 overflow-y-auto mb-4 space-y-3 custom-scrollbar pr-2">
            {messages.length === 0 ? (
               <p className="text-sm text-gray-500 text-center mt-4 font-mono">Nenhuma mensagem ainda.</p>
            ) : (
               messages.map((msg, idx) => (
                 <div key={idx} className={`flex flex-col ${msg.sender === userName ? 'items-end' : 'items-start'}`}>
                   <span className="text-xs text-graphite-400 mb-1">{msg.sender}</span>
                   <div className={`px-3 py-2 rounded-lg text-sm shadow-sm max-w-[90%] break-words ${msg.sender === userName ? 'bg-yolk-500 text-graphite-950 font-medium' : 'bg-graphite-800 border border-graphite-700 text-gray-200'}`}>
                     {msg.text}
                   </div>
                 </div>
               ))
            )}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={sendMessage} className="mt-auto relative">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Digite uma mensagem..."
              className="w-full bg-graphite-950 border border-graphite-700 rounded-lg py-3 px-4 pr-12 text-sm focus:outline-none focus:border-yolk-500 focus:ring-1 focus:ring-yolk-500 text-gray-200 transition-all font-sans"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-yolk-500 hover:text-yolk-400 hover:bg-graphite-800 rounded-md transition-colors">
              <span className="text-lg">▶</span>
            </button>
          </form>
        </div>

      </div>

      {/* Global Media Controls (Bottom Bar) */}
      <div className="mt-4 flex justify-center items-center gap-4 bg-graphite-900 p-3 rounded-xl border border-graphite-700 shadow-sm">
        <button
          onClick={toggleMic}
          className={`px-5 py-3 rounded-lg text-sm transition-colors border font-medium ${isMicOn ? 'bg-graphite-800 hover:bg-graphite-700 border-graphite-700 text-gray-200' : 'bg-red-900/40 border-red-600 text-red-200'}`}>
          <span className="mr-2">🎤</span> {isMicOn ? 'Microfone ligado' : 'Microfone mutado'}
        </button>
        <button
          onClick={toggleCamera}
          className={`px-5 py-3 rounded-lg text-sm transition-colors border font-medium ${isCamOn ? 'bg-graphite-800 hover:bg-graphite-700 border-graphite-700 text-gray-200' : 'bg-red-900/40 border-red-600 text-red-200'}`}>
          <span className="mr-2">🎥</span> {isCamOn ? 'Câmera ligada' : 'Câmera desligada'}
        </button>
        <button
          onClick={handleToggleScreenShare}
          className={`px-5 py-3 rounded-lg text-sm transition-colors border font-medium ${isScreenSharing ? 'bg-yolk-500 text-graphite-900 border-yolk-600 hover:bg-yolk-600 shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'bg-graphite-800 border-graphite-700 hover:bg-graphite-700 text-gray-200'}`}>
          <span className="mr-2">🖥️</span> {isScreenSharing ? 'Parar Compartilhamento' : 'Compartilhar Tela'}
        </button>

        <button
          onClick={() => window.location.reload()}
          className="px-5 py-3 bg-red-900/40 hover:bg-red-900/60 text-red-400 rounded-lg text-sm transition-colors border border-red-900/50 ml-auto">
          Sair do Estúdio
        </button>
      </div>
    </div>
  );
}
