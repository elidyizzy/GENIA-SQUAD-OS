'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/banco-leads', label: 'Banco de Leads', icon: '🗂️' },
  { href: '/pipeline', label: 'Pipeline', icon: '📋' },
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/configuracoes', label: 'Configurações', icon: '⚙️' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 min-h-screen bg-zinc-900 text-zinc-100 flex flex-col">
      <div className="px-5 py-6 border-b border-zinc-800">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Ramos Silva</p>
        <h1 className="text-lg font-bold mt-1">Cockpit</h1>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              pathname === item.href
                ? 'bg-zinc-700 text-white'
                : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
            )}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-zinc-800">
        <p className="text-xs text-zinc-500">Synkra AIOX</p>
      </div>
    </aside>
  )
}
