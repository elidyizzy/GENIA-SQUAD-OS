'use client'

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { ClassificacaoBadge } from '@/components/leads/ClassificacaoBadge'
import { formatCNPJ, formatMoeda } from '@/lib/formatters'
import type { PipelineLead } from '@/hooks/usePipeline'

const ENRICHMENT_TYPES = [
  { tipo: 'cadastral', icon: '🏢', label: 'Cadastral' },
  { tipo: 'maps',      icon: '📍', label: 'Maps' },
  { tipo: 'trf',       icon: '⚖️', label: 'TRF' },
  { tipo: 'decisores', icon: '👤', label: 'Decisores' },
]

interface Props {
  lead: PipelineLead
  onClick?: () => void
}

export function LeadCard({ lead, onClick }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id,
    data: { lead },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  const enrichedTypes = new Set(
    lead.enrichments
      .filter((e) => e.status === 'sucesso')
      .map((e) => e.tipo)
  )

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg border border-zinc-200 p-3 cursor-grab active:cursor-grabbing select-none transition-shadow ${
        isDragging ? 'opacity-40 shadow-xl' : 'hover:shadow-sm'
      }`}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        if (!isDragging && onClick) {
          e.stopPropagation()
          onClick()
        }
      }}
    >
      <p className="text-sm font-semibold text-zinc-900 leading-tight line-clamp-2 mb-1">
        {lead.leads.nome_empresa}
      </p>
      <p className="text-xs text-zinc-400 font-mono mb-2">{formatCNPJ(lead.leads.cnpj)}</p>

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-700">
          {formatMoeda(lead.leads.valor_divida)}
        </span>
        <ClassificacaoBadge value={lead.leads.classificacao} />
      </div>

      {/* Enrichment status indicators */}
      <div className="flex gap-1.5 mt-2">
        {ENRICHMENT_TYPES.map(({ tipo, icon, label }) => (
          <span
            key={tipo}
            title={`${label}: ${enrichedTypes.has(tipo) ? 'feito' : 'pendente'}`}
            className={`text-xs ${enrichedTypes.has(tipo) ? 'opacity-100' : 'opacity-25'}`}
          >
            {icon}
          </span>
        ))}
      </div>
    </div>
  )
}
