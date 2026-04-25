'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronRight, LayoutGrid, List, Filter, MoreHorizontal, TrendingUp, BarChart3 } from 'lucide-react'
import { usePipeline, ESTAGIOS, type PipelineLead } from '@/hooks/usePipeline'
import { LeadModal } from '@/components/pipeline/LeadModal'
import { formatMoeda, formatCNPJ } from '@/lib/formatters'
import { cn } from '@/lib/utils'

const COLUMN_COLORS: Record<string, string> = {
  lead_bruto: 'border-slate-300',
  enriquecido: 'border-blue-400',
  qualificado: 'border-amber-400',
  contato: 'border-emerald-400',
  diagnostico: 'border-indigo-400',
  proposta: 'border-purple-400',
  fechado: 'border-rose-400',
}

const CARD_TOP_COLORS: Record<string, string> = {
  lead_bruto: 'border-slate-400',
  enriquecido: 'border-blue-500',
  qualificado: 'border-amber-500',
  contato: 'border-emerald-500',
  diagnostico: 'border-indigo-500',
  proposta: 'border-purple-500',
  fechado: 'border-rose-500',
}

export function PipelineContent() {
  const { data, isLoading, isError } = usePipeline()
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)

  const totalValue = ESTAGIOS.slice(0, 6).reduce((sum, e) => {
    const leads = data?.[e.id] ?? []
    return sum + leads.reduce((s: number, l: PipelineLead) => s + (l.leads?.valor_divida ?? 0), 0)
  }, 0)

  const totalLeads = ESTAGIOS.slice(0, 6).reduce((sum, e) => {
    return sum + (data?.[e.id]?.length ?? 0)
  }, 0)

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex gap-6 overflow-x-auto pb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="min-w-[300px] w-[300px] flex-shrink-0">
              <div className="h-6 w-24 rounded bg-slate-200 animate-pulse mb-3" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="h-28 rounded-xl bg-white border border-slate-200 animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-8">
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Falha ao carregar pipeline. Verifique a conexão com o banco de dados.
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 min-h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-1 font-bold">
            <span>Workspace</span>
            <ChevronRight size={10} />
            <span className="text-blue-600">Sales Pipeline</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Deal Flow Pipeline</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-200 p-1 rounded-lg">
            <button className="px-3 py-1 bg-white shadow-sm rounded text-xs font-black text-slate-800 flex items-center gap-1">
              <LayoutGrid size={14} />
              Board
            </button>
            <button className="px-3 py-1 text-xs font-black text-slate-500 flex items-center gap-1 hover:text-slate-800 transition-colors">
              <List size={14} />
              Table
            </button>
          </div>
          <button className="p-2 border border-slate-200 rounded-lg hover:bg-white transition-all text-slate-600 hover:shadow-sm">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-24 -mx-2 px-2 snap-x">
        {ESTAGIOS.map((estagio, colIdx) => {
          const leads = data?.[estagio.id] ?? []
          const colValue = leads.reduce((s: number, l: PipelineLead) => s + (l.leads?.valor_divida ?? 0), 0)

          return (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: colIdx * 0.08, ease: 'easeOut' }}
              key={estagio.id}
              className="min-w-[300px] w-[300px] flex-shrink-0 flex flex-col gap-4 snap-start"
            >
              {/* Column header */}
              <div className={cn('flex flex-col gap-1 border-t-[3px] pt-2 px-1', COLUMN_COLORS[estagio.id] ?? 'border-slate-300')}>
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-600 tracking-wider uppercase">{estagio.label}</h3>
                  <span className="bg-slate-200 text-slate-700 text-[10px] font-black px-1.5 py-0.5 rounded">
                    {leads.length < 10 ? `0${leads.length}` : leads.length}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                  {formatMoeda(colValue)}
                </p>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-3">
                {leads.map((card: PipelineLead, cardIdx: number) => (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (colIdx * 0.08) + (cardIdx * 0.04) }}
                    whileHover={{ y: -4, scale: 1.01, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                    key={card.id}
                    onClick={() => setSelectedLeadId(card.id)}
                    className={cn(
                      'bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer border-t-4 group',
                      CARD_TOP_COLORS[estagio.id] ?? 'border-slate-400'
                    )}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="bg-slate-100 text-slate-600 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider group-hover:bg-slate-200">
                        {card.leads?.classificacao === 'A' ? 'Crítico' : card.leads?.classificacao === 'B' ? 'Alto' : 'Médio'}
                      </span>
                      <button
                        className="text-slate-300 hover:text-slate-900 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1 leading-tight text-sm line-clamp-2">
                      {card.leads?.nome_empresa}
                    </h4>
                    <p className="text-slate-400 text-[10px] font-bold mb-3 uppercase tracking-tighter">
                      CNPJ: {card.leads?.cnpj ? formatCNPJ(card.leads.cnpj) : '—'}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                      <span className="font-black text-slate-900 text-sm">
                        {formatMoeda(card.leads?.valor_divida ?? 0)}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-600">
                          {card.leads?.uf ?? 'BR'}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {leads.length === 0 && (
                  <div className="bg-slate-50/50 p-4 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center">
                    <p className="text-xs text-slate-400 font-bold tracking-tight">Sem leads aqui</p>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Floating Summary Footer */}
      <div className="fixed bottom-8 right-8 flex gap-4 z-40">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="text-white p-6 rounded-2xl shadow-2xl flex items-center gap-8 border border-slate-700/60"
          style={{ backgroundColor: 'rgba(9,20,38,0.95)' }}
        >
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Total Pipeline Value</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black tracking-tight">{formatMoeda(totalValue)}</span>
              <span className="text-xs text-emerald-400 flex items-center font-bold">
                <TrendingUp size={12} className="mr-0.5" />
                Ativo
              </span>
            </div>
          </div>
          <div className="h-10 w-px bg-slate-700" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Leads In Process</span>
            <span className="text-2xl font-black">{totalLeads}</span>
          </div>
          <button className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95">
            <BarChart3 size={20} />
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedLeadId && (
          <LeadModal
            pipelineLeadId={selectedLeadId}
            onClose={() => setSelectedLeadId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
