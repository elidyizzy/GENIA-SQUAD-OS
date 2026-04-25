'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Database, Kanban, LayoutDashboard, Settings, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const mainItems = [
  { href: '/banco-leads', label: 'Lead Bank', icon: Database },
  { href: '/pipeline', label: 'Pipeline', icon: Kanban },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
]

const bottomItems = [
  { href: '/configuracoes', label: 'Configurações', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-[260px] border-r border-slate-800 shadow-xl flex flex-col justify-between py-6 z-50 overflow-hidden"
      style={{ backgroundColor: '#091426' }}
    >
      {/* Decorative gradient blur */}
      <div
        className="absolute top-0 left-0 w-full h-64 pointer-events-none -z-0 rounded-full"
        style={{
          background: 'rgba(37,99,235,0.10)',
          filter: 'blur(80px)',
          transform: 'translateY(-50%)',
        }}
      />

      <div className="px-6 relative z-10">
        {/* Logo */}
        <div className="mb-10 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Database size={16} className="text-white" />
          </div>
          <div>
            <span className="text-base font-black tracking-tight text-white leading-none block">LEADFLOWAI</span>
            <span className="text-[9px] text-blue-400 font-bold tracking-widest uppercase mt-0.5 block">BRY · GENIA SQUAD</span>
          </div>
        </div>

        {/* Main nav */}
        <nav className="space-y-1.5">
          {mainItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <div key={item.href} className="relative">
                {isActive && (
                  <div className="absolute inset-0 rounded-lg border-l-[3px] border-blue-500" style={{ backgroundColor: 'rgba(30,41,59,0.8)' }} />
                )}
                <Link
                  href={item.href}
                  className={cn(
                    'relative z-10 w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors',
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                  )}
                >
                  <item.icon size={18} className={cn('transition-colors', isActive ? 'text-blue-400' : '')} />
                  <span className="text-sm font-semibold tracking-tight">{item.label}</span>
                </Link>
              </div>
            )
          })}
        </nav>
      </div>

      <div className="px-6 relative z-10">
        <div className="space-y-1.5 mb-8">
          {bottomItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-semibold tracking-tight',
                  isActive
                    ? 'text-white bg-slate-800/80 border-l-[3px] border-blue-500'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            )
          })}
          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-semibold tracking-tight text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
          >
            <HelpCircle size={18} />
            Suporte
          </Link>
        </div>

        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-700/50 cursor-pointer transition-all hover:bg-slate-800/60" style={{ backgroundColor: 'rgba(30,41,59,0.4)' }}>
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-sm">
            RS
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-bold text-white truncate">Ramos Silva</span>
            <span className="text-[10px] text-slate-400 truncate tracking-wide">Admin</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
