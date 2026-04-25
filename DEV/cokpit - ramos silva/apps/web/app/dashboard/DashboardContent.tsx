'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Cell, PieChart, Pie,
} from 'recharts'
import { Users, Workflow, Wallet, TrendingUp, Calendar, BarChart3 } from 'lucide-react'
import { useDashboard, type Periodo } from '@/hooks/useDashboard'
import { formatMoeda, formatCNPJ } from '@/lib/formatters'
import { cn } from '@/lib/utils'

const ESTAGIO_LABELS: Record<string, string> = {
  lead_bruto: 'Lead Bruto', enriquecido: 'Enriquecido', qualificado: 'Qualificado',
  contato: 'Contato', diagnostico: 'Diagnóstico', proposta: 'Proposta',
}

const CLASSIF_COLORS: Record<string, string> = {
  A: '#0f172a', B: '#2563eb', C: '#94a3b8',
}

const PERIODOS: { value: Periodo; label: string }[] = [
  { value: '30', label: '30 dias' },
  { value: '90', label: '90 dias' },
  { value: '180', label: '6 meses' },
  { value: 'all', label: 'Tudo' },
]

export function DashboardContent() {
  const [periodo, setPeriodo] = useState<Periodo>('30')
  const { data, isLoading, isError } = useDashboard(periodo)

  if (isLoading) {
    return (
      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-36 rounded-2xl bg-white border border-slate-200 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-7 h-80 rounded-2xl bg-white border border-slate-200 animate-pulse" />
          <div className="col-span-5 h-80 rounded-2xl bg-white border border-slate-200 animate-pulse" />
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="p-8">
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Falha ao carregar dashboard.
        </div>
      </div>
    )
  }

  const { kpis, porEstagio, porClassificacao, leadsPorSemana, top10 } = data

  const funnelMax = porEstagio[0]?.count ?? 1
  const funnelData = porEstagio.map((e, i) => ({
    name: ESTAGIO_LABELS[e.estagio] ?? e.estagio,
    value: e.count,
    percentage: Math.round((e.count / funnelMax) * 100),
    color: ['#1e3a8a', '#1e40af', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'][i] ?? '#2563eb',
  }))

  const classifData = porClassificacao.map((c) => ({
    name: c.name === 'A' ? 'Hot Leads' : c.name === 'B' ? 'Warm Leads' : 'Cold Leads',
    value: c.value,
    color: CLASSIF_COLORS[c.name] ?? '#94a3b8',
  }))

  const weeklyData = leadsPorSemana.slice(-7).map((w) => ({
    name: `Sem ${w.semana.split('-W')[1] ?? w.semana}`,
    atual: w.total,
    media: Math.round(w.total * 0.8),
  }))

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Operations Overview</p>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard</h1>
        </div>
        <div className="flex items-center bg-white/70 backdrop-blur-xl rounded-xl border border-slate-200 p-1.5 shadow-sm font-semibold">
          {PERIODOS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriodo(p.value)}
              className={cn(
                'px-4 py-1.5 text-xs rounded-lg transition-colors',
                periodo === p.value
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              )}
            >
              {p.label}
            </button>
          ))}
          <div className="h-4 w-[1px] bg-slate-200 mx-2" />
          <button className="px-3 py-1.5 flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900 transition-colors">
            <Calendar size={14} />
            Custom
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard
          label="Leads na Base"
          value={kpis.totalLeads.toLocaleString('pt-BR')}
          trend="+12.4%"
          icon={Users}
          color="blue"
        />
        <MetricCard
          label="No Pipeline"
          value={kpis.totalNosPipeline.toLocaleString('pt-BR')}
          status="Ativo"
          icon={Workflow}
          color="slate"
        />
        <MetricCard
          label="Volume Prospecção"
          value={formatMoeda(kpis.volumeTotal)}
          sublabel="Valor total no pipeline"
          icon={BarChart3}
          color="orange"
        />
        <MetricCard
          label="Ganhos"
          value={kpis.leadsGanhos.toLocaleString('pt-BR')}
          trend="+8%"
          icon={Wallet}
          color="emerald"
        />
        <MetricCard
          label="Taxa Conversão"
          value={`${kpis.taxaConversao}%`}
          sublabel="Lead bruto → ganho"
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Conversion Funnel */}
        <div className="col-span-12 lg:col-span-7 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-8 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-8">Funil de Conversão</h3>
          <div className="space-y-6">
            {funnelData.map((item) => (
              <div key={item.name} className="group">
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                  <span>{item.name} ({item.value})</span>
                  <span>{item.percentage}%</span>
                </div>
                <div className="h-10 w-full bg-slate-100/80 rounded-xl overflow-hidden flex shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-[10px] uppercase text-slate-400 font-bold">Leads Novos</p>
              <p className="text-lg font-bold text-slate-900">{kpis.leadsNovos.toLocaleString('pt-BR')}</p>
            </div>
            <div className="text-center border-x border-slate-100">
              <p className="text-[10px] uppercase text-slate-400 font-bold">Conversão</p>
              <p className="text-lg font-bold text-slate-900">{kpis.taxaConversao}%</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase text-slate-400 font-bold">Ganhos</p>
              <p className="text-lg font-bold text-slate-900">{kpis.leadsGanhos}</p>
            </div>
          </div>
        </div>

        {/* Lead Classification Pie */}
        <div className="col-span-12 lg:col-span-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-900 mb-8">Classificação de Leads</h3>
          <div className="flex-1 flex items-center justify-center relative min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={classifData.length > 0 ? classifData : [{ name: 'Sem dados', value: 1, color: '#e2e8f0' }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {classifData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-slate-900">{kpis.totalLeads.toLocaleString('pt-BR')}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Total</span>
            </div>
          </div>
          <div className="mt-8 space-y-3">
            {classifData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="text-slate-900 font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Bar Chart */}
        <div className="col-span-12 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-bold text-slate-900">Tendência Semanal de Novos Leads</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Últimas 7 semanas</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <span className="w-3 h-1 bg-blue-600 rounded-full inline-block" /> Atual
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <span className="w-3 h-1 bg-slate-200 rounded-full inline-block" /> Média
              </div>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 700 }} dy={10} />
                <YAxis hide />
                <RechartsTooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="media" fill="#f1f5f9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="atual" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 10 Table */}
        <div className="col-span-12 bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-900">Top 10 — Maior Dívida no Pipeline</h3>
            <button className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all">Ver todos</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/30">
                  <th className="px-8 py-4 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Empresa</th>
                  <th className="px-8 py-4 text-[10px] uppercase tracking-wider text-slate-400 font-bold">CNPJ</th>
                  <th className="px-8 py-4 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Dívida</th>
                  <th className="px-8 py-4 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Estágio</th>
                  <th className="px-8 py-4 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Class.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {top10.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-8 text-center text-slate-400 text-xs">Nenhum lead no pipeline ainda.</td>
                  </tr>
                ) : top10.map((lead) => (
                  <tr key={lead.pipeline_lead_id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px] uppercase group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                          {lead.nome_empresa.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                        </div>
                        <span className="text-sm font-bold text-slate-900 max-w-[200px] truncate">{lead.nome_empresa}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-sm text-slate-600 font-mono tracking-tight">{formatCNPJ(lead.cnpj)}</td>
                    <td className="px-8 py-4 text-sm font-black text-slate-900">{formatMoeda(lead.valor_divida)}</td>
                    <td className="px-8 py-4 text-xs text-slate-500">{ESTAGIO_LABELS[lead.estagio] ?? lead.estagio}</td>
                    <td className="px-8 py-4">
                      <span className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase',
                        lead.classificacao === 'A' ? 'bg-red-100 text-red-700' :
                        lead.classificacao === 'B' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                      )}>
                        {lead.classificacao}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  label, value, trend, sublabel, status, icon: Icon, color,
}: {
  label: string; value: string; trend?: string; sublabel?: string; status?: string; icon: React.ElementType; color: string
}) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 border border-blue-100',
    slate: 'bg-slate-50 text-slate-600 border border-slate-100',
    orange: 'bg-orange-50 text-orange-600 border border-orange-100',
    emerald: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    purple: 'bg-purple-50 text-purple-600 border border-purple-100',
  }

  const glowMap: Record<string, string> = {
    blue: 'bg-blue-400', slate: 'bg-slate-400', orange: 'bg-orange-400',
    emerald: 'bg-emerald-400', purple: 'bg-purple-400',
  }

  const barMap: Record<string, string> = {
    blue: 'bg-blue-500', slate: 'bg-slate-400', orange: 'bg-orange-500',
    emerald: 'bg-emerald-500', purple: 'bg-purple-500',
  }

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}
      className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group"
    >
      <div className={cn('absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-700', glowMap[color])} />
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110', colorMap[color])}>
          <Icon size={20} />
        </div>
        {trend && (
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">{trend}</span>
        )}
        {status && (
          <span className={cn('text-xs font-bold px-2 py-0.5 rounded-md border', color === 'orange' ? 'text-orange-600 bg-orange-50 border-orange-100' : 'text-blue-600 bg-blue-50 border-blue-100')}>
            {status}
          </span>
        )}
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest relative z-10">{label}</p>
      <p className="text-2xl font-black tracking-tight text-slate-900 mt-0.5 relative z-10">{value}</p>
      {sublabel && <p className="text-[10px] text-slate-400 mt-2 font-medium relative z-10">{sublabel}</p>}
      <div className="mt-4 h-1 w-full bg-slate-50 rounded-full overflow-hidden relative z-10">
        <div className={cn('h-full transition-all duration-1000', barMap[color])} style={{ width: trend ? '75%' : '40%' }} />
      </div>
    </motion.div>
  )
}
