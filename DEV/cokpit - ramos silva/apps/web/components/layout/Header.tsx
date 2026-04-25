'use client'

import { Search, Bell, History, Plus } from 'lucide-react'

export function Header() {
  return (
    <header className="fixed top-0 right-0 z-40 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl flex items-center justify-between px-8 h-16 ml-[260px]" style={{ left: '260px' }}>
      <div className="flex items-center gap-6">
        <h1 className="text-lg font-black text-slate-900">Command Center</h1>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" size={17} />
          <input
            type="text"
            placeholder="Buscar leads, empresas..."
            className="w-64 focus:w-80 transition-all duration-300 bg-slate-100/80 hover:bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/30 focus:bg-white placeholder-slate-400 outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-500 rounded-full transition-colors hover:bg-slate-100">
            <Bell size={18} />
          </button>
          <button className="p-2 text-slate-500 rounded-full transition-colors hover:bg-slate-100">
            <History size={18} />
          </button>
        </div>

        <div className="h-4 w-[1px] bg-slate-200 mx-1" />

        <button className="bg-blue-600 text-white px-4 py-2 flex items-center gap-2 rounded-full text-sm font-semibold hover:bg-blue-500 transition-colors shadow-md shadow-blue-600/20">
          <Plus size={16} />
          Novo Lead
        </button>

        <div className="h-8 w-8 ml-2 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xs border-2 border-white shadow-sm cursor-pointer">
          RS
        </div>
      </div>
    </header>
  )
}
