import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Sidebar } from '@/components/layout/Sidebar'
import './globals.css'

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cockpit Ramos Silva',
  description: 'Prospecção de empresas com dívida PGFN',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geist.variable} h-full antialiased`}>
      <body className="h-full flex bg-zinc-50">
        <Sidebar />
        <main className="flex-1 overflow-auto p-8">{children}</main>
      </body>
    </html>
  )
}
