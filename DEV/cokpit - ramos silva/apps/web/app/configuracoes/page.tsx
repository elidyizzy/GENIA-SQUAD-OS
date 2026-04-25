import { Suspense } from 'react'
import { ConfiguracoesContent } from './ConfiguracoesContent'

export default function ConfiguracoesPage() {
  return (
    <Suspense fallback={<div className="text-zinc-400 mt-8">Carregando...</div>}>
      <ConfiguracoesContent />
    </Suspense>
  )
}
