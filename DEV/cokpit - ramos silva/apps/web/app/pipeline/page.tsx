import { Suspense } from 'react'
import { PipelineContent } from './PipelineContent'

export default function PipelinePage() {
  return (
    <Suspense fallback={<div className="text-zinc-400 mt-8">Carregando pipeline...</div>}>
      <PipelineContent />
    </Suspense>
  )
}
