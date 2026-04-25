'use client'

import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { ClassificacaoBadge } from '@/components/leads/ClassificacaoBadge'
import { DialogFechamento } from './DialogFechamento'
import { EnrichSection } from './EnrichSection'
import { usePipelineLead } from '@/hooks/usePipelineLead'
import { ESTAGIOS } from '@/hooks/usePipeline'
import { formatCNPJ, formatMoeda, formatData } from '@/lib/formatters'

const ESTAGIO_LABELS: Record<string, string> = Object.fromEntries(
  ESTAGIOS.map(({ id, label }) => [id, label])
)

const ENRICHMENT_SECTIONS = [
  { tipo: 'cadastral',  label: 'Dados Cadastrais',        icon: '🏢' },
  { tipo: 'maps',       label: 'Validação Operacional',    icon: '📍' },
  { tipo: 'trf',        label: 'Inteligência Jurídica',    icon: '⚖️' },
  { tipo: 'decisores',  label: 'Decisores',                icon: '👤' },
]

interface Props {
  pipelineLeadId: string | null
  onClose: () => void
}

export function LeadModal({ pipelineLeadId, onClose }: Props) {
  const queryClient = useQueryClient()
  const { data, isLoading } = usePipelineLead(pipelineLeadId)

  // Notes autosave
  const [notas, setNotas] = useState('')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const isFirstLoad = useRef(true)

  useEffect(() => {
    if (data?.notas !== undefined) {
      setNotas(data.notas ?? '')
      isFirstLoad.current = true
    }
  }, [data?.id, data?.notas])

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false
      return
    }
    setSaveStatus('saving')
    const t = setTimeout(async () => {
      await fetch(`/api/pipeline/${pipelineLeadId}/notas`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notas }),
      })
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
      queryClient.invalidateQueries({ queryKey: ['pipeline-lead', pipelineLeadId] })
    }, 1000)
    return () => clearTimeout(t)
  }, [notas, pipelineLeadId, queryClient])

  // Stage change
  const [pendingStage, setPendingStage] = useState<string | null>(null)
  const [isSavingStage, setIsSavingStage] = useState(false)

  const handleStageChange = (estagio: string) => {
    if (estagio === 'fechado') {
      setPendingStage(estagio)
    } else {
      doMoveStage(estagio)
    }
  }

  const doMoveStage = async (estagio: string, resultado?: string, motivo?: string) => {
    setIsSavingStage(true)
    await fetch(`/api/pipeline/${pipelineLeadId}/estagio`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estagio, resultado, motivo }),
    })
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['pipeline-lead', pipelineLeadId] }),
      queryClient.invalidateQueries({ queryKey: ['pipeline'] }),
    ])
    setIsSavingStage(false)
  }

  const handleFechamentoConfirm = async (resultado: 'ganho' | 'perdido', motivo: string) => {
    if (!pendingStage) return
    await doMoveStage(pendingStage, resultado, motivo)
    setPendingStage(null)
  }

  return (
    <>
      <Dialog open={pipelineLeadId !== null} onOpenChange={(o) => { if (!o) onClose() }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {isLoading || !data ? (
            <div className="space-y-3 py-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-8 rounded bg-zinc-200 animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-3 pr-8">
                  <div>
                    <DialogTitle className="text-base font-bold text-zinc-900 leading-snug">
                      {data.leads.nome_empresa}
                    </DialogTitle>
                    <p className="text-xs text-zinc-400 font-mono mt-0.5">
                      {formatCNPJ(data.leads.cnpj)}
                    </p>
                  </div>
                  <ClassificacaoBadge value={data.leads.classificacao} />
                </div>
              </DialogHeader>

              {/* Dados PGFN */}
              <section>
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">
                  Dados PGFN
                </h4>
                <div className="grid grid-cols-2 gap-3 bg-zinc-50 rounded-lg p-3 text-sm">
                  <div>
                    <p className="text-xs text-zinc-400">Dívida total</p>
                    <p className="font-semibold text-zinc-900">{formatMoeda(data.leads.valor_divida)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400">UF</p>
                    <p className="font-medium text-zinc-700">{data.leads.uf ?? '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400">CNPJ</p>
                    <p className="font-mono text-zinc-700">{formatCNPJ(data.leads.cnpj)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400">Entrada</p>
                    <p className="text-zinc-700">{formatData(data.leads.data_entrada)}</p>
                  </div>
                </div>
              </section>

              {/* Estágio */}
              <section>
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">
                  Estágio
                </h4>
                <div className="flex items-center gap-3">
                  <Select
                    value={data.estagio}
                    onValueChange={(v) => v && handleStageChange(v)}
                    disabled={isSavingStage}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ESTAGIOS.map(({ id, label }) => (
                        <SelectItem key={id} value={id}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isSavingStage && <span className="text-xs text-zinc-400">Salvando...</span>}
                  {data.resultado && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      data.resultado === 'ganho' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                    }`}>
                      {data.resultado === 'ganho' ? '✓ Ganho' : '✗ Perdido'}
                    </span>
                  )}
                </div>
              </section>

              {/* Notas */}
              <section>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Notas</h4>
                  <span className="text-xs text-zinc-400">
                    {saveStatus === 'saving' && 'Salvando...'}
                    {saveStatus === 'saved' && 'Salvo ✓'}
                  </span>
                </div>
                <textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Anotações sobre este lead..."
                  rows={4}
                  className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 resize-none"
                />
              </section>

              {/* Enriquecimento */}
              <section>
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">
                  Enriquecimento
                </h4>
                <div className="space-y-2">
                  {ENRICHMENT_SECTIONS.map(({ tipo, label, icon }) => (
                    <EnrichSection
                      key={tipo}
                      tipo={tipo as 'cadastral' | 'maps' | 'trf' | 'decisores'}
                      label={label}
                      icon={icon}
                      enrichment={data.enrichments.find((e) => e.tipo === tipo)}
                      pipelineLeadId={data.id}
                      onSuccess={() => {
                        queryClient.invalidateQueries({ queryKey: ['pipeline-lead', pipelineLeadId] })
                        queryClient.invalidateQueries({ queryKey: ['pipeline'] })
                      }}
                    />
                  ))}
                </div>
              </section>

              {/* Histórico */}
              <section>
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">
                  Histórico de Estágios
                </h4>
                {data.estagio_historico.length === 0 ? (
                  <p className="text-xs text-zinc-400 italic">Nenhuma movimentação registrada.</p>
                ) : (
                  <ol className="space-y-1.5">
                    {data.estagio_historico.map((item) => (
                      <li key={item.id} className="flex items-center gap-2 text-xs text-zinc-600">
                        <span className="w-32 shrink-0 text-zinc-400">
                          {new Intl.DateTimeFormat('pt-BR', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          }).format(new Date(item.created_at))}
                        </span>
                        {item.estagio_anterior ? (
                          <>
                            <span className="text-zinc-400">{ESTAGIO_LABELS[item.estagio_anterior] ?? item.estagio_anterior}</span>
                            <span className="text-zinc-300">→</span>
                          </>
                        ) : null}
                        <span className="font-medium text-zinc-700">
                          {ESTAGIO_LABELS[item.estagio_novo] ?? item.estagio_novo}
                        </span>
                      </li>
                    ))}
                  </ol>
                )}
              </section>
            </>
          )}
        </DialogContent>
      </Dialog>

      <DialogFechamento
        open={pendingStage === 'fechado'}
        onClose={() => setPendingStage(null)}
        onConfirm={handleFechamentoConfirm}
        isLoading={isSavingStage}
      />
    </>
  )
}
