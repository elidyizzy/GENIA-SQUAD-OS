'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, ChevronDown, ChevronUp, ArrowRightCircle, ExternalLink, Loader2, AlertCircle } from 'lucide-react'
import { formatCNPJ, formatMoeda } from '@/lib/formatters'
import { cn } from '@/lib/utils'

interface Inscricao {
  numeroInscricao: string
  dataAtualizacao: string
  valorDivida: number
}

interface Ente {
  nomeEnte: string
  totalInscricoes: number
  inscricoes: Inscricao[]
}

interface Grupo {
  tipo: string
  valorTotal: number
  entes: Ente[]
}

interface PgfnData {
  nomDevedor?: string
  municipioDevedor?: string
  cnae?: string
  valorConsolidado?: number
  grupos?: Grupo[]
}

interface Lead {
  id: string
  cnpj: string
  nome_empresa: string
  valor_divida: number
  uf: string | null
  classificacao: string
  status: string
}

interface ApiResponse {
  lead: Lead
  pgfn: PgfnData | null
  reason?: string
}

interface Props {
  leadId: string
  onClose: () => void
  onMoverPipeline: (leadId: string) => Promise<void>
}

function GrupoAccordion({ grupo }: { grupo: Grupo }) {
  const [open, setOpen] = useState(false)
  const [openEntes, setOpenEntes] = useState<Set<number>>(new Set())

  const toggleEnte = (i: number) => {
    setOpenEntes((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
      >
        <div>
          <span className="text-sm font-bold text-slate-800 uppercase tracking-wide">{grupo.tipo}</span>
          <p className="text-xs text-slate-500 mt-0.5">
            Total: <span className="font-bold text-slate-700">{formatMoeda(grupo.valorTotal)}</span>
          </p>
        </div>
        {open ? <ChevronUp size={18} className="text-slate-500" /> : <ChevronDown size={18} className="text-slate-500" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-4 py-3 space-y-4 bg-white">
              {(grupo.entes ?? []).map((ente, i) => (
                <div key={i} className="border border-slate-100 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleEnte(i)}
                    className="w-full flex items-center justify-between px-3 py-2.5 bg-indigo-50/60 hover:bg-indigo-50 transition-colors text-left"
                  >
                    <span className="text-sm font-bold text-indigo-800">Ente Conveniado: {ente.nomeEnte}</span>
                    {openEntes.has(i) ? <ChevronUp size={14} className="text-indigo-400" /> : <ChevronDown size={14} className="text-indigo-400" />}
                  </button>

                  <AnimatePresence>
                    {openEntes.has(i) && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                        <div className="p-3 space-y-3">
                          <a
                            href={`https://www.regularize.pgfn.gov.br/#/consultarDebito`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline font-medium"
                          >
                            <ExternalLink size={12} />
                            Clique aqui para regularização
                          </a>
                          <p className="text-xs text-slate-500">{ente.totalInscricoes} inscrições encontradas</p>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs border-collapse">
                              <thead>
                                <tr className="border-b border-slate-200">
                                  <th className="pb-2 text-left font-bold text-slate-600">Número de Inscrição</th>
                                  <th className="pb-2 text-left font-bold text-slate-600">Atualizado em</th>
                                  <th className="pb-2 text-right font-bold text-slate-600">Valor da dívida (R$)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {(ente.inscricoes ?? []).map((ins, j) => (
                                  <tr key={j}>
                                    <td className="py-2 font-mono text-slate-700">{ins.numeroInscricao}</td>
                                    <td className="py-2 text-slate-600">{ins.dataAtualizacao}</td>
                                    <td className="py-2 text-right font-semibold text-slate-800">
                                      {typeof ins.valorDivida === 'number'
                                        ? ins.valorDivida.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                                        : ins.valorDivida}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot>
                                <tr className="border-t-2 border-slate-200 bg-indigo-50/50">
                                  <td colSpan={2} className="py-2 text-right text-xs font-bold text-slate-600 pr-4">Total:</td>
                                  <td className="py-2 text-right font-black text-slate-800">
                                    {(ente.inscricoes ?? [])
                                      .reduce((s, ins) => s + (Number(ins.valorDivida) || 0), 0)
                                      .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  </td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function PgfnDetailModal({ leadId, onClose, onMoverPipeline }: Props) {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [moving, setMoving] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/leads/${leadId}/pgfn`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [leadId])

  const handleMover = async () => {
    setMoving(true)
    await onMoverPipeline(leadId)
    setMoving(false)
    onClose()
  }

  const lead = data?.lead
  const pgfn = data?.pgfn

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          onClick={(e) => e.stopPropagation()}
          className="relative h-full w-full max-w-xl bg-white shadow-2xl flex flex-col"
        >
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="text-base font-black text-blue-700">Relação de Inscrições em Dívida Ativa</h2>
              <p className="text-xs text-slate-400 mt-0.5">Fonte: PGFN — Procuradoria-Geral da Fazenda Nacional</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 size={32} className="text-blue-600 animate-spin" />
                <p className="text-sm text-slate-500">Consultando PGFN...</p>
              </div>
            ) : !lead ? (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-lg px-4 py-3 text-sm">
                <AlertCircle size={16} />
                Não foi possível carregar os dados do lead.
              </div>
            ) : (
              <>
                {/* Basic Info Grid */}
                <div className="rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                  {[
                    { label: 'Nome Empresarial', value: pgfn?.nomDevedor ?? lead.nome_empresa },
                    { label: 'CNPJ', value: formatCNPJ(lead.cnpj), mono: true },
                    { label: 'Domicílio do Devedor', value: pgfn?.municipioDevedor ?? lead.uf ?? '—' },
                    { label: 'Atividade Econômica', value: pgfn?.cnae ?? '—' },
                  ].map(({ label, value, mono }) => (
                    <div key={label} className="grid grid-cols-[180px_1fr] text-sm">
                      <span className="bg-slate-50 px-4 py-2.5 font-bold text-slate-600 border-r border-slate-100">{label}:</span>
                      <span className={cn('px-4 py-2.5 text-slate-800', mono && 'font-mono tracking-tight')}>{value}</span>
                    </div>
                  ))}
                  <div className="grid grid-cols-[180px_1fr] text-sm">
                    <span className="bg-slate-50 px-4 py-2.5 font-bold text-slate-600 border-r border-slate-100">Valor Total da dívida:</span>
                    <div className="px-4 py-2.5 flex items-center justify-between">
                      <span className="font-black text-slate-900 text-base">
                        {formatMoeda(pgfn?.valorConsolidado ?? lead.valor_divida)}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className={cn(
                          'text-[10px] font-black px-2 py-0.5 rounded uppercase',
                          lead.classificacao === 'A' ? 'bg-red-100 text-red-700' :
                          lead.classificacao === 'B' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-600'
                        )}>
                          {lead.classificacao === 'A' ? 'Crítico' : lead.classificacao === 'B' ? 'Alto' : 'Médio'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PGFN Inscriptions */}
                {pgfn?.grupos && pgfn.grupos.length > 0 ? (
                  <div className="space-y-3">
                    {pgfn.grupos.map((grupo, i) => (
                      <GrupoAccordion key={i} grupo={grupo} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-4 text-sm text-amber-700 space-y-2">
                    <p className="font-bold">Detalhamento por inscrição indisponível</p>
                    <p className="text-xs text-amber-600">
                      {data?.reason === 'masked_cpf'
                        ? 'Este registro corresponde a pessoa física (CPF mascarado).'
                        : 'Não foi possível buscar os dados detalhados na PGFN agora.'}
                    </p>
                    <a
                      href={`https://www.regularize.pgfn.gov.br/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline font-medium"
                    >
                      <ExternalLink size={12} />
                      Consultar diretamente no Regularize PGFN
                    </a>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {lead && (
            <div className="px-6 py-4 border-t border-slate-200 flex items-center gap-3 flex-shrink-0 bg-slate-50/50">
              {lead.status === 'novo' && (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleMover}
                  disabled={moving}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-sm rounded-xl px-4 py-3 transition-colors shadow-md shadow-blue-600/20"
                >
                  {moving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <ArrowRightCircle size={18} />
                  )}
                  Mover para o Pipeline
                </motion.button>
              )}
              {lead.status === 'pipeline' && (
                <div className="flex-1 flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 font-bold text-sm rounded-xl px-4 py-3 border border-emerald-200">
                  ✓ Já no Pipeline
                </div>
              )}
              <button
                onClick={onClose}
                className="px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-bold text-slate-700 transition-colors"
              >
                Fechar
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
