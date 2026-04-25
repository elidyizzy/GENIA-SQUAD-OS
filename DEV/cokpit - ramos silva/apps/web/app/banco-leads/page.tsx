import { Suspense } from 'react'
import { BancoLeadsContent } from './BancoLeadsContent'

export default function BancoLeadsPage() {
  return (
    <Suspense fallback={<div className="text-zinc-400 mt-8">Carregando...</div>}>
      <BancoLeadsContent />
    </Suspense>
  )
}
