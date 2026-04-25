'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, ArrowRightCircle, ExternalLink, Loader2, AlertCircle, Building2, FileText, Calendar, MapPin } from 'lucide-react'
import { formatCNPJ, formatMoeda, formatData } from '@/lib/formatters'
import { cn } from '@/lib/utils'

interface Lead {
  id: string
  cnpj: string
  nome_empresa: string
  valor_divida: number
  uf: string | null
  classificacao: string
  status: string
  data_entrada: string
}

interface Props {
  leadId: string
  onClose: () => void
  onMoverPipeline: (leadId: string) => Promise<void>
}

const CLASS_LABEL: Record<string, string> = { A: 'Crítico', B: 'Alto', C: 'Médio' }
const CLASS_COLOR: Record<string, string> = {
  A: 'bg-red-100 text-red-700 border-red-200',
  B: 'bg-amber-100 text-amber-700 border-amber-200',
  C: 'bg-slate-100 text-slate-600 border-slate-200',
}

export function PgfnDetailModal({ leadId, onClose, onMoverPipeline }: Props) {
  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [moving, setMoving] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/leads/${leadId}/pgfn`)
      .then((r) => r.json())
      .then((d) => setLead(d.lead ?? null))
      .catch(() => setLead(null))
      .finally(() => setLoading(false))
  }, [leadId])

  const handleMover = async () => {
    if (!lead) return
    setMoving(true)
    await onMoverPipeline(lead.id)
    setMoving(false)
    onClose()
  }

  const isValidCnpj = lead ? /^\d{14}$/.test(lead.cnpj) : false
  const pgfnUrl = isValidCnpj
    ? `https://www.regularize.pgfn.gov.br/#/consultarDebito?cnpj=${lead!.cnpj}`
    : 'https://www.regularize.pgfn.gov.br/'

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
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0 bg-blue-700">
            <div>
              <h2 className="text-sm font-black text-white tracking-wide">RELAÇÃO DE INSCRIÇÕES EM DÍVIDA ATIVA</h2>
              <p className="text-[10px] text-blue-200 mt-0.5 font-medium tracking-wider uppercase">PGFN — Procuradoria-Geral da Fazenda Nacional</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-blue-600 rounded-lg transition-colors text-white">
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 size={32} className="text-blue-600 animate-spin" />
                <p className="text-sm text-slate-500">Carregando dados...</p>
              </div>
            ) : !lead ? (
              <div className="p-6">
                <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-lg px-4 py-3 text-sm">
                  <AlertCircle size={16} />
                  Não foi possível carregar os dados do lead.
                </div>
              </div>
            ) : (
              <>
                {/* Dados Cadastrais */}
                <div className="border-b border-slate-100">
                  {[
                    { icon: Building2, label: 'Nome Empresarial', value: lead.nome_empresa },
                    { icon: FileText, label: 'CNPJ', value: formatCNPJ(lead.cnpj), mono: true },
                    { icon: MapPin, label: 'UF / Domicílio', value: lead.uf ?? '—' },
                    { icon: Calendar, label: 'Data de entrada', value: formatData(lead.data_entrada) },
                  ].map(({ icon: Icon, label, value, mono }) => (
                    <div key={label} className="grid grid-cols-[200px_1fr] text-sm border-b border-slate-50 last:border-0">
                      <div className="flex items-center gap-2 bg-slate-50 px-5 py-3 font-bold text-slate-600 border-r border-slate-100">
                        <Icon size={13} className="text-slate-400 flex-shrink-0" />
                        {label}:
                      </div>
                      <span className={cn('px-5 py-3 text-slate-800', mono && 'font-mono tracking-tight')}>{value}</span>
                    </div>
                  ))}

                  {/* Valor total — destaque */}
                  <div className="grid grid-cols-[200px_1fr] text-sm">
                    <div className="flex items-center gap-2 bg-slate-50 px-5 py-3 font-bold text-slate-600 border-r border-slate-100">
                      <FileText size={13} className="text-slate-400 flex-shrink-0" />
                      Valor Total da dívida:
                    </div>
                    <div className="px-5 py-3 flex items-center justify-between gap-3">
                      <span className="font-black text-slate-900 text-lg">{formatMoeda(lead.valor_divida)}</span>
                      <span className={cn('text-[10px] font-black px-2 py-0.5 rounded border uppercase', CLASS_COLOR[lead.classificacao] ?? CLASS_COLOR.C)}>
                        {CLASS_LABEL[lead.classificacao] ?? lead.classificacao}
                      </span>
                    </div>
                  </div>
                </div>

                {/* PGFN Portal Link */}
                <div className="px-6 py-5 space-y-4">
                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0 mt-0.5">
                        <FileText size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-blue-900">Inscrições individuais</p>
                        <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                          O detalhamento por inscrição (número, data, ente conveniado) está disponível diretamente no portal oficial da PGFN Regularize.
                        </p>
                      </div>
                    </div>
                    <a
                      href={pgfnUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg px-4 py-2.5 transition-colors"
                    >
                      <ExternalLink size={15} />
                      Ver inscrições no Regularize PGFN
                    </a>
                  </div>

                  {!isValidCnpj && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700 flex items-start gap-2">
                      <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                      <span>CNPJ mascarado — este registro pode corresponder a pessoa física (CPF). Consulte o portal para confirmar.</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {lead && (
            <div className="px-6 py-4 border-t border-slate-200 flex items-center gap-3 flex-shrink-0 bg-slate-50/60">
              {lead.status === 'novo' && (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleMover}
                  disabled={moving}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-sm rounded-xl px-4 py-3 transition-colors shadow-md shadow-blue-600/20"
                >
                  {moving ? <Loader2 size={16} className="animate-spin" /> : <ArrowRightCircle size={18} />}
                  Mover para o Pipeline
                </motion.button>
              )}
              {lead.status === 'pipeline' && (
                <div className="flex-1 flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 font-bold text-sm rounded-xl px-4 py-3 border border-emerald-200">
                  ✓ Já no Pipeline
                </div>
              )}
              {lead.status === 'descartado' && (
                <div className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-500 font-bold text-sm rounded-xl px-4 py-3 border border-slate-200">
                  Descartado
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
