require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const WebSocket = require('ws');
const ffmpeg = require('fluent-ffmpeg');

const app = express();
const server = http.createServer(app);

// 1. WebRTC Signaling Server (Mesh)
const io = new Server(server, {
  cors: { origin: '*' }
});

// room_id -> Set<socket_id>
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('Usuário conectado:', socket.id);

  socket.on('join-room', (roomId) => {
    let roomSet = rooms.get(roomId);
    if (!roomSet) {
      roomSet = new Set();
      rooms.set(roomId, roomSet);
    }

    // evita duplicatas em reconexao
    roomSet.add(socket.id);

    socket.join(roomId);
    console.log(`Socket ${socket.id} entrou na sala ${roomId}`);

    // avisa a sala que entrou novo peer
    socket.to(roomId).emit('user-connected', socket.id);
  });

  socket.on('sdp-offer', (data) => {
    io.to(data.target).emit('sdp-offer', {
      offer: data.offer,
      sender: socket.id
    });
  });

  socket.on('sdp-answer', (data) => {
    io.to(data.target).emit('sdp-answer', {
      answer: data.answer,
      sender: socket.id
    });
  });

  socket.on('ice-candidate', (data) => {
    io.to(data.target).emit('ice-candidate', {
      candidate: data.candidate,
      sender: socket.id
    });
  });

  socket.on('chat-message', (data) => {
    io.to(data.room).emit('chat-message', data);
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado:', socket.id);

    rooms.forEach((roomSet, roomId) => {
      if (roomSet.has(socket.id)) {
        roomSet.delete(socket.id);
        socket.to(roomId).emit('user-disconnected', socket.id);

        // remove sala vazia para evitar vazamento de memoria
        if (roomSet.size === 0) {
          rooms.delete(roomId);
        }
      }
    });
  });
});

// 2. RTMP Relay using WebSocket + FFmpeg
const wss = new WebSocket.Server({ server, path: '/rtmp' });

wss.on('connection', (ws) => {
  console.log('Anfitrião conectado ao Relay WebSocket RTMP');

  const streamKey = process.env.YT_STREAM_KEY;
  if (!streamKey || streamKey === 'your_youtube_stream_key_here') {
    console.warn('WARNING: YouTube Stream Key is not set in .env!');
  }

  const rtmpUrl = `rtmp://a.rtmp.youtube.com/live2/${streamKey}`;

  const ffmpegProcess = ffmpeg()
    // input do navegador via WebSocket (chunks WebM)
    .input('pipe:0')
    .inputFormat('webm')

    // Saida para YouTube: H264 + AAC em FLV
    .videoCodec('libx264')
    .audioCodec('aac')
    .outputOptions([
      '-preset veryfast',
      '-b:v 4000k',
      '-maxrate 4000k',
      '-bufsize 8000k',
      '-pix_fmt yuv420p',
      '-g 60',
      '-b:a 128k',
      '-ar 44100'
    ])
    .format('flv')
    .output(rtmpUrl)
    .on('start', (cmd) => {
      console.log('FFmpeg iniciado com o comando:', cmd);
    })
    .on('error', (err) => {
      console.error('O FFmpeg encontrou um erro:', err.message);
    })
    .on('end', () => {
      console.log('FFmpeg process finished.');
    });

  // inicia o processo
  const ffmpegCommand = ffmpegProcess.run();
  const ffmpegStdin = ffmpegProcess.ffmpegProc?.stdin;

  ws.on('message', (message) => {
    // buffer WebM recebido do MediaRecorder
    if (ffmpegStdin && !ffmpegStdin.writableEnded) {
      ffmpegStdin.write(message);
    }
  });

  ws.on('close', () => {
    console.log('Anfitrião desconectado do Relay RTMP');
    if (ffmpegStdin && !ffmpegStdin.writableEnded) {
      ffmpegStdin.end();
    }
    if (ffmpegCommand && ffmpegCommand.kill) {
      ffmpegCommand.kill('SIGINT');
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Servidor Backend rodando em http://localhost:${PORT}`);
});
