'use client'

import { useState } from 'react'
import { usePipeline, type PipelineLead } from '@/hooks/usePipeline'
import { KanbanBoard } from '@/components/pipeline/KanbanBoard'
import { LeadModal } from '@/components/pipeline/LeadModal'

export function PipelineContent() {
  const { data, isLoading, isError } = usePipeline()
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="flex gap-4 mt-8">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="w-[220px] shrink-0">
            <div className="h-6 w-24 rounded bg-zinc-200 animate-pulse mb-3" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="h-24 rounded-lg bg-zinc-200 animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
        Falha ao carregar pipeline. Verifique a conexão com o banco de dados.
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Pipeline</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Arraste os cards entre as colunas para avançar o estágio de prospecção.
        </p>
      </div>

      <KanbanBoard
        data={data ?? {}}
        onCardClick={(lead: PipelineLead) => setSelectedLeadId(lead.id)}
      />

      <LeadModal
        pipelineLeadId={selectedLeadId}
        onClose={() => setSelectedLeadId(null)}
      />
    </div>
  )
}
