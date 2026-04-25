'use client'

import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line, CartesianGrid,
} from 'recharts'
import { useDashboard, type Periodo } from '@/hooks/useDashboard'
import { formatMoeda, formatCNPJ } from '@/lib/formatters'
import { ClassificacaoBadge } from '@/components/leads/ClassificacaoBadge'

const ESTAGIO_LABELS: Record<string, string> = {
  lead_bruto: 'Lead Bruto', enriquecido: 'Enriquecido', qualificado: 'Qualificado',
  contato: 'Contato', diagnostico: 'Diagnóstico', proposta: 'Proposta',
}

const CLASSIF_COLORS: Record<string, string> = { A: '#ef4444', B: '#f59e0b', C: '#6b7280' }

const PERIODOS: { value: Periodo; label: string }[] = [
  { value: '30', label: '30 dias' },
  { value: '90', label: '90 dias' },
  { value: '180', label: '6 meses' },
  { value: 'all', label: 'Tudo' },
]

function KpiCard({ label, valor, sub }: { label: string; valor: string; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-5">
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-zinc-900 mt-1">{valor}</p>
      {sub && <p className="text-xs text-zinc-400 mt-1">{sub}</p>}
    </div>
  )
}

export function DashboardContent() {
  const [periodo, setPeriodo] = useState<Periodo>('30')
  const { data, isLoading, isError } = useDashboard(periodo)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-zinc-200 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-64 rounded-xl bg-zinc-200 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
        Falha ao carregar dashboard.
      </div>
    )
  }

  const { kpis, porEstagio, porClassificacao, leadsPorSemana, top10 } = data

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-500">Visão geral da prospecção de dívidas PGFN.</p>
        </div>
        <div className="flex gap-1 bg-zinc-100 rounded-lg p-1">
          {PERIODOS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriodo(p.value)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                periodo === p.value
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard label="Leads na Base" valor={kpis.totalLeads.toLocaleString('pt-BR')} />
        <KpiCard label="No Pipeline" valor={kpis.totalNosPipeline.toLocaleString('pt-BR')} />
        <KpiCard label="Volume Prospecção" valor={formatMoeda(kpis.volumeTotal)} />
        <KpiCard label="Ganhos" valor={kpis.leadsGanhos.toLocaleString('pt-BR')} sub={`no período selecionado`} />
        <KpiCard label="Taxa Conversão" valor={`${kpis.taxaConversao}%`} sub="lead bruto → ganho" />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funil por estágio */}
        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <h3 className="text-sm font-semibold text-zinc-700 mb-4">Funil de Conversão</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={porEstagio.map((e) => ({ ...e, label: ESTAGIO_LABELS[e.estagio] ?? e.estagio }))}
              layout="vertical"
              margin={{ left: 8, right: 16 }}
            >
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="label" type="category" width={90} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [v, 'Leads']} />
              <Bar dataKey="count" fill="#3f3f46" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribuição por classificação */}
        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <h3 className="text-sm font-semibold text-zinc-700 mb-4">Por Classificação</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={porClassificacao}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
              >
                {porClassificacao.map((entry) => (
                  <Cell key={entry.name} fill={CLASSIF_COLORS[entry.name] ?? '#6b7280'} />
                ))}
              </Pie>
              <Legend formatter={(value) => `Classe ${value}`} iconSize={10} />
              <Tooltip formatter={(v, name) => [v, `Classe ${name}`]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Captação por semana */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5">
        <h3 className="text-sm font-semibold text-zinc-700 mb-4">Novos Leads por Semana (12 semanas)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={leadsPorSemana} margin={{ left: 0, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
            <XAxis dataKey="semana" tick={{ fontSize: 10 }} tickFormatter={(v) => v.split('-W')[1] ? `Sem ${v.split('-W')[1]}` : v} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip labelFormatter={(v) => `Semana ${String(v).split('-W')[1] ?? v}`} formatter={(v) => [v, 'Leads']} />
            <Line type="monotone" dataKey="total" stroke="#3f3f46" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top 10 */}
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100">
          <h3 className="text-sm font-semibold text-zinc-700">Top 10 — Maior Dívida no Pipeline</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="text-left px-5 py-2.5 text-xs font-semibold text-zinc-500">Empresa</th>
              <th className="text-left px-5 py-2.5 text-xs font-semibold text-zinc-500">CNPJ</th>
              <th className="text-right px-5 py-2.5 text-xs font-semibold text-zinc-500">Dívida</th>
              <th className="text-left px-5 py-2.5 text-xs font-semibold text-zinc-500">Estágio</th>
              <th className="text-center px-5 py-2.5 text-xs font-semibold text-zinc-500">Class.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {top10.map((lead) => (
              <tr key={lead.pipeline_lead_id} className="hover:bg-zinc-50">
                <td className="px-5 py-3 font-medium text-zinc-900 max-w-[200px] truncate" title={lead.nome_empresa}>
                  {lead.nome_empresa}
                </td>
                <td className="px-5 py-3 font-mono text-zinc-500 text-xs">{formatCNPJ(lead.cnpj)}</td>
                <td className="px-5 py-3 font-semibold text-zinc-900 text-right">{formatMoeda(lead.valor_divida)}</td>
                <td className="px-5 py-3 text-zinc-500 text-xs">{ESTAGIO_LABELS[lead.estagio] ?? lead.estagio}</td>
                <td className="px-5 py-3 text-center">
                  <ClassificacaoBadge value={lead.classificacao} />
                </td>
              </tr>
            ))}
            {top10.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-zinc-400 text-xs">
                  Nenhum lead no pipeline ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
