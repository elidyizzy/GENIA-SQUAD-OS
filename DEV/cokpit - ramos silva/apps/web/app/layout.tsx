import type { Metadata } from 'next'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { QueryProvider } from '@/components/layout/QueryProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'LEADFLOWAI — BRY · GENIA SQUAD',
  description: 'Cockpit de prospecção automatizado para Ramos Silva Advogados',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="h-full" style={{ backgroundColor: '#f4f7f9' }}>
        <Sidebar />
        <Header />
        <QueryProvider>
          <main className="ml-[260px] pt-16">
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  )
}
