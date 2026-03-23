import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export interface PeerItem {
  socketId: string;
  stream: MediaStream;
}

export function useWebRTC(roomId: string, localStream: MediaStream | null) {
  const [peers, setPeers] = useState<PeerItem[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const peerConnections = useRef<{ [socketId: string]: RTCPeerConnection }>({});

  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  useEffect(() => {
    if (!localStream) return;

    socketRef.current = io('http://localhost:3001'); // Point to backend

    socketRef.current.on('connect', () => {
      console.log('Connected to signaling server');
      socketRef.current?.emit('join-room', roomId);
    });

    socketRef.current.on('user-connected', async (userId) => {
      // New user joined, we should initiate connection and send offer
      console.log('User connected, creating offer for:', userId);
      const peerConnection = createPeerConnection(userId);
      peerConnections.current[userId] = peerConnection;

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      socketRef.current?.emit('sdp-offer', { target: userId, offer });
    });

    socketRef.current.on('sdp-offer', async ({ sender, offer }) => {
      console.log('Received offer from:', sender);
      const peerConnection = createPeerConnection(sender);
      peerConnections.current[sender] = peerConnection;

      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      socketRef.current?.emit('sdp-answer', { target: sender, answer });
    });

    socketRef.current.on('sdp-answer', async ({ sender, answer }) => {
      console.log('Received answer from:', sender);
      const peerConnection = peerConnections.current[sender];
      if (peerConnection) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    socketRef.current.on('ice-candidate', async ({ sender, candidate }) => {
      const peerConnection = peerConnections.current[sender];
      if (peerConnection) {
        try {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error('Error adding received ice candidate', e);
        }
      }
    });

    socketRef.current.on('user-disconnected', (userId) => {
      console.log('User disconnected:', userId);
      if (peerConnections.current[userId]) {
        peerConnections.current[userId].close();
        delete peerConnections.current[userId];
      }
      setPeers(prev => prev.filter(p => p.socketId !== userId));
    });

    return () => {
      Object.keys(peerConnections.current).forEach(id => {
        peerConnections.current[id].close();
      });
      peerConnections.current = {};
      socketRef.current?.disconnect();
      setPeers([]);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStream, roomId]);

  function createPeerConnection(targetId: string) {
    const peerConnection = new RTCPeerConnection(configuration);

    // Add local tracks to the connection
    if (localStream) {
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });
    }

    // Send any local ICE candidates to the target
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current?.emit('ice-candidate', {
          target: targetId,
          candidate: event.candidate
        });
      }
    };

    // Received remote stream
    peerConnection.ontrack = (event) => {
      const stream = event.streams[0];
      setPeers(prev => {
        const exists = prev.find(p => p.socketId === targetId);
        if (exists) return prev;
        return [...prev, { socketId: targetId, stream }];
      });
    };

    return peerConnection;
  }

  const replaceVideoTrack = (newVideoTrack: MediaStreamTrack) => {
    Object.values(peerConnections.current).forEach(pc => {
      const sender = pc.getSenders().find(s => s.track?.kind === 'video');
      if (sender) {
        sender.replaceTrack(newVideoTrack);
      }
    });
  };

  return { peers, socket: socketRef.current, replaceVideoTrack };
}
