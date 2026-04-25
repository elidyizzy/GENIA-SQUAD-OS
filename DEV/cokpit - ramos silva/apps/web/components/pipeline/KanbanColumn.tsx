'use client'

import { useDroppable } from '@dnd-kit/core'
import { LeadCard } from './LeadCard'
import { formatMoeda } from '@/lib/formatters'
import type { PipelineLead } from '@/hooks/usePipeline'

interface Props {
  id: string
  label: string
  leads: PipelineLead[]
  onCardClick: (lead: PipelineLead) => void
}

export function KanbanColumn({ id, label, leads, onCardClick }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id })

  const totalDivida = leads.reduce((sum, l) => sum + (l.leads.valor_divida ?? 0), 0)

  return (
    <div className="flex flex-col w-[220px] shrink-0">
      {/* Column header */}
      <div className="mb-2 px-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-zinc-700 uppercase tracking-wide">
            {label}
          </h3>
          <span className="text-xs font-bold text-zinc-500 bg-zinc-100 rounded-full px-2 py-0.5">
            {leads.length}
          </span>
        </div>
        {leads.length > 0 && (
          <p className="text-xs text-zinc-400 mt-0.5">{formatMoeda(totalDivida)}</p>
        )}
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`flex-1 rounded-xl p-2 space-y-2 min-h-[200px] transition-colors ${
          isOver ? 'bg-zinc-200/60' : 'bg-zinc-100/60'
        }`}
      >
        {leads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onClick={() => onCardClick(lead)}
          />
        ))}
        {leads.length === 0 && (
          <div className={`h-20 rounded-lg border-2 border-dashed flex items-center justify-center text-xs text-zinc-300 transition-colors ${isOver ? 'border-zinc-400 text-zinc-400' : 'border-zinc-200'}`}>
            Solte aqui
          </div>
        )}
      </div>
    </div>
  )
}
