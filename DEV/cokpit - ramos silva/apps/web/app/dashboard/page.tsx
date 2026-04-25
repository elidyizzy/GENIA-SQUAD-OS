import { Suspense } from 'react'
import { DashboardContent } from './DashboardContent'

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="text-zinc-400 mt-8">Carregando dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
