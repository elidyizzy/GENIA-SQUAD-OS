'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useQueryClient } from '@tanstack/react-query'
import { useLeads, useLeadFilters } from '@/hooks/useLeads'
import { formatMoeda, formatCNPJ, formatData } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { Download, Filter, MoreVertical, TrendingUp, AlertTriangle, PieChart, ChevronLeft, ChevronRight } from 'lucide-react'

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

interface ToastMsg { id: number; message: string; type: 'success' | 'error' }

export function BancoLeadsContent() {
  const [filters, setFilters] = useLeadFilters()
  const { data, isLoading, isError } = useLeads(filters)
  const queryClient = useQueryClient()
  const [toasts, setToasts] = useState<ToastMsg[]>([])
  const toastCounter = useRef(0)

  const addToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = ++toastCounter.current
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500)
  }, [])

  const handleMoverPipeline = async (leadId: string) => {
    const res = await fetch(`/api/leads/${leadId}/pipeline`, { method: 'POST' })
    if (res.ok) {
      await queryClient.invalidateQueries({ queryKey: ['leads'] })
      addToast('Lead movido para o pipeline')
    } else {
      addToast('Não foi possível mover (já no pipeline?)', 'error')
    }
  }

  const total = data?.total ?? 0
  const leads = (data?.data ?? []) as Lead[]
  const totalPages = Math.ceil(total / 20)

  const volumeTotal = leads.reduce((s, l) => s + (l.valor_divida ?? 0), 0)
  const leadsA = leads.filter((l) => l.classificacao === 'A').length

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Banco de Leads</h1>
          <p className="text-slate-500 mt-1 font-medium">
            {total.toLocaleString('pt-BR')} empresas com dívida PGFN ≥ R$1.000.000 — atualizado semanalmente.
          </p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download size={14} />
            Exportar CSV
          </motion.button>
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Filter size={14} />
            Filtros Avançados
          </motion.button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="space-y-1.5 col-span-1 md:col-span-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nome ou Razão Social</label>
          <input
            className="w-full border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none py-2 px-3"
            placeholder="Ex: Ramos Construção"
            type="text"
            value={filters.q}
            onChange={(e) => setFilters({ q: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">UF</label>
          <select
            className="w-full border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none py-2 px-3"
            value={filters.uf}
            onChange={(e) => setFilters({ uf: e.target.value })}
          >
            <option value="">Todos</option>
            {['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map((uf) => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Classificação</label>
          <select
            className="w-full border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none py-2 px-3"
            value={filters.classificacao}
            onChange={(e) => setFilters({ classificacao: e.target.value })}
          >
            <option value="">Todas</option>
            <option value="A">A — Crítico</option>
            <option value="B">B — Alto</option>
            <option value="C">C — Médio</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
          <select
            className="w-full border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none py-2 px-3"
            value={filters.status}
            onChange={(e) => setFilters({ status: e.target.value })}
          >
            <option value="">Todos</option>
            <option value="novo">Novo</option>
            <option value="pipeline">No Pipeline</option>
            <option value="descartado">Descartado</option>
          </select>
        </div>
      </div>

      {isError && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Falha ao carregar leads. Verifique a conexão com o banco de dados.
        </div>
      )}

      {/* Leads Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Empresa</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">CNPJ</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider cursor-pointer hover:text-blue-600" onClick={() => setFilters({ order: filters.order === 'desc' ? 'asc' : 'desc' })}>
                  Dívida {filters.order === 'desc' ? '↓' : '↑'}
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">UF</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Class.</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Entrada</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-slate-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : leads.map((lead, i) => (
                <motion.tr
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  key={lead.id}
                  className="hover:bg-blue-50/40 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px] uppercase group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors shadow-inner flex-shrink-0">
                        {lead.nome_empresa.split(' ').map((n) => n[0]).join('').substring(0, 2)}
                      </div>
                      <div className="font-bold text-sm text-slate-900 truncate max-w-[180px]" title={lead.nome_empresa}>
                        {lead.nome_empresa}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono tracking-tight">{formatCNPJ(lead.cnpj)}</td>
                  <td className="px-6 py-4 font-bold text-sm text-slate-900">{formatMoeda(lead.valor_divida)}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{lead.uf ?? '—'}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase',
                      lead.classificacao === 'A' ? 'bg-red-100 text-red-700' :
                      lead.classificacao === 'B' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                    )}>
                      {lead.classificacao}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border',
                      lead.status === 'novo' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                      lead.status === 'pipeline' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      'bg-slate-100 text-slate-600 border-slate-200'
                    )}>
                      <span className={cn(
                        'w-1.5 h-1.5 rounded-full mr-1.5',
                        lead.status === 'novo' ? 'bg-blue-600' :
                        lead.status === 'pipeline' ? 'bg-emerald-600' : 'bg-slate-400'
                      )} />
                      {lead.status === 'novo' ? 'Novo' : lead.status === 'pipeline' ? 'No Pipeline' : 'Descartado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {lead.data_entrada ? formatData(lead.data_entrada) : '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ActionMenu lead={lead} onMoverPipeline={() => handleMoverPipeline(lead.id)} />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between font-medium">
          <p className="text-sm text-slate-500">
            Exibindo{' '}
            <span className="text-slate-700 font-bold">{((filters.page - 1) * 20) + 1} – {Math.min(filters.page * 20, total)}</span>
            {' '}de{' '}
            <span className="text-slate-700 font-bold">{total.toLocaleString('pt-BR')}</span> leads
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilters({ page: filters.page - 1 })}
              disabled={filters.page <= 1}
              className="p-1.5 text-slate-500 border border-slate-200 rounded-md bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-1">
              {getPageNumbers(filters.page, totalPages).map((p, i) =>
                p === '...' ? (
                  <span key={`dot-${i}`} className="px-2 self-center text-slate-400 text-sm">...</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setFilters({ page: p as number })}
                    className={cn(
                      'w-8 h-8 flex items-center justify-center rounded-md text-sm',
                      filters.page === p ? 'text-white font-bold' : 'hover:bg-slate-100'
                    )}
                    style={filters.page === p ? { backgroundColor: '#091426' } : {}}
                  >
                    {p}
                  </button>
                )
              )}
            </div>
            <button
              onClick={() => setFilters({ page: filters.page + 1 })}
              disabled={filters.page >= totalPages}
              className="p-1.5 text-slate-500 border border-slate-200 rounded-md bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total em Dívida (página)</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{formatMoeda(volumeTotal)}</h3>
            <p className="text-xs text-emerald-600 font-bold flex items-center mt-2 gap-1">
              <TrendingUp size={14} />
              {total.toLocaleString('pt-BR')} empresas na base
            </p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg flex-shrink-0">
            <PieChart size={32} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Leads Críticos (A)</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{leadsA}</h3>
            <p className="text-xs text-slate-500 font-medium mt-2 italic">Nesta página</p>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-lg flex-shrink-0">
            <AlertTriangle size={32} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total na Base</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{total.toLocaleString('pt-BR')}</h3>
            <div className="w-32 h-1.5 bg-slate-100 rounded-full mt-3">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: '100%' }} />
            </div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg flex-shrink-0">
            <TrendingUp size={32} />
          </div>
        </div>
      </div>

      {/* Toasts */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className={cn(
                'rounded-xl px-4 py-3 text-sm font-semibold shadow-lg text-white',
                t.type === 'error' ? 'bg-red-600' : 'bg-slate-900'
              )}
            >
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

function ActionMenu({ lead, onMoverPipeline }: { lead: Lead; onMoverPipeline: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
      >
        <MoreVertical size={16} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1 overflow-hidden"
          >
            {lead.status === 'novo' && (
              <button
                onClick={() => { onMoverPipeline(); setOpen(false) }}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-medium transition-colors"
              >
                Mover para Pipeline
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 font-medium transition-colors"
            >
              Ver detalhes
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '...')[] = [1]
  if (current > 3) pages.push('...')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i)
  if (current < total - 2) pages.push('...')
  pages.push(total)
  return pages
}
