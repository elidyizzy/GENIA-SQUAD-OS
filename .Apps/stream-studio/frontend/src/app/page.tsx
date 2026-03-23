"use client";

import { useState } from 'react';
import StudioRoom from '@/components/StudioRoom';
import JoinScreen from '@/components/JoinScreen';

export default function Home() {
  const [joined, setJoined] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [userName, setUserName] = useState('');
  const [isHost, setIsHost] = useState(false);

  return (
    <main className="min-h-screen bg-graphite-950 text-gray-200 font-sans flex items-center justify-center">
      {!joined ? (
        <JoinScreen
          onJoin={(room, name, hostValue) => {
            setRoomName(room);
            setUserName(name);
            setIsHost(hostValue);
            setJoined(true);
          }}
        />
      ) : (
        <StudioRoom roomName={roomName} userName={userName} isHost={isHost} />
      )}
    </main>
  );
}
