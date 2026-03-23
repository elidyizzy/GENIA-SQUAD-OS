"use client";

import { useState } from 'react';

interface JoinScreenProps {
  onJoin: (room: string, name: string, isHost: boolean) => void;
}

export default function JoinScreen({ onJoin }: JoinScreenProps) {
  const [room, setRoom] = useState('');
  const [name, setName] = useState('');
  const [isHost, setIsHost] = useState(false);

  return (
    <div className="bg-graphite-900 p-8 rounded-xl shadow-2xl w-full max-w-md border border-graphite-700">
      <h1 className="text-3xl font-bold mb-6 text-center text-yolk-500">
        Stream Studio
      </h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">ID da Sala</label>
          <input
            type="text"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="w-full bg-graphite-950 border border-graphite-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yolk-500 focus:border-yolk-500 transition-all font-mono text-gray-200"
            placeholder="ex. geral"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Seu Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-graphite-950 border border-graphite-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yolk-500 focus:border-yolk-500 transition-all text-gray-200"
            placeholder="Como você se chama?"
          />
        </div>

        <div className="flex items-center mt-4">
          <input
            id="isHost"
            type="checkbox"
            checked={isHost}
            onChange={(e) => setIsHost(e.target.checked)}
            className="w-5 h-5 rounded border-graphite-700 bg-graphite-800 text-yolk-500 focus:ring-yolk-500 focus:ring-offset-graphite-900 accent-yolk-500"
          />
          <label htmlFor="isHost" className="ml-3 text-sm font-medium text-gray-300">
            Eu sou o Anfitrião (Transmissor/Gravador)
          </label>
        </div>

        <button
          onClick={() => onJoin(room || 'general', name || 'Convidado', isHost)}
          className="w-full bg-yolk-500 hover:bg-yolk-600 text-graphite-900 font-bold py-3 px-4 rounded-lg mt-6 shadow-[0_0_15px_rgba(234,179,8,0.2)] transition-all hover:scale-[1.02]"
        >
          Entrar no Estúdio
        </button>
      </div>
    </div>
  );
}
