import { NextResponse } from 'next/server'
import { query, queryCount, queryOne } from '@/lib/db'

function getStartDate(periodo: string): string | null {
  if (periodo === 'all') return null
  const dias = parseInt(periodo) || 30
  const d = new Date()
  d.setDate(d.getDate() - dias)
  return d.toISOString()
}

function getISOWeek(date: Date): string {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
  const week1 = new Date(d.getFullYear(), 0, 4)
  const weekNum = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const periodo = searchParams.get('periodo') ?? '30'
  const startDate = getStartDate(periodo)

  const [
    totalLeads,
    leadsNovos,
    porEstagioRows,
    porClassifRows,
    leadsGanhos,
    top10Rows,
    semanaRows,
  ] = await Promise.all([
    queryCount('SELECT COUNT(*) FROM leads'),
    queryCount(
      startDate ? 'SELECT COUNT(*) FROM leads WHERE data_entrada >= $1' : 'SELECT COUNT(*) FROM leads',
      startDate ? [startDate] : []
    ),
    query<{ estagio: string; valor_divida: string }>(
      "SELECT pl.estagio, l.valor_divida FROM pipeline_leads pl JOIN leads l ON l.id = pl.lead_id WHERE pl.estagio != 'fechado'"
    ),
    query<{ classificacao: string }>(
      "SELECT l.classificacao FROM pipeline_leads pl JOIN leads l ON l.id = pl.lead_id WHERE pl.estagio != 'fechado'"
    ),
    queryCount(
      startDate
        ? "SELECT COUNT(*) FROM pipeline_leads WHERE estagio = 'fechado' AND resultado = 'ganho' AND updated_at >= $1"
        : "SELECT COUNT(*) FROM pipeline_leads WHERE estagio = 'fechado' AND resultado = 'ganho'",
      startDate ? [startDate] : []
    ),
    query<{ id: string; estagio: string; lead_id: string; nome_empresa: string; cnpj: string; valor_divida: string; classificacao: string }>(
      'SELECT pl.id, pl.estagio, l.id AS lead_id, l.nome_empresa, l.cnpj, l.valor_divida, l.classificacao FROM pipeline_leads pl JOIN leads l ON l.id = pl.lead_id ORDER BY l.valor_divida DESC LIMIT 10'
    ),
    query<{ data_entrada: string }>(
      'SELECT data_entrada FROM leads WHERE data_entrada >= $1 ORDER BY data_entrada ASC',
      [(() => { const d = new Date(); d.setDate(d.getDate() - 84); return d.toISOString() })()]
    ),
  ])

  const ESTAGIOS = ['lead_bruto', 'enriquecido', 'qualificado', 'contato', 'diagnostico', 'proposta']
  const porEstagioMap: Record<string, { count: number; volume: number }> = Object.fromEntries(
    ESTAGIOS.map((s) => [s, { count: 0, volume: 0 }])
  )
  for (const item of porEstagioRows) {
    if (porEstagioMap[item.estagio]) {
      porEstagioMap[item.estagio].count++
      porEstagioMap[item.estagio].volume += parseFloat(item.valor_divida) || 0
    }
  }
  const porEstagio = ESTAGIOS.map((s) => ({ estagio: s, count: porEstagioMap[s].count, volume: porEstagioMap[s].volume }))

  const classifMap: Record<string, number> = { A: 0, B: 0, C: 0 }
  for (const item of porClassifRows) {
    if (item.classificacao && classifMap[item.classificacao] !== undefined) classifMap[item.classificacao]++
  }
  const porClassificacao = Object.entries(classifMap).map(([name, value]) => ({ name, value }))

  const volumeTotal = Object.values(porEstagioMap).reduce((sum, v) => sum + v.volume, 0)
  const totalNosPipeline = Object.values(porEstagioMap).reduce((sum, v) => sum + v.count, 0)
  const taxaConversao = totalLeads > 0 ? (leadsGanhos / totalLeads) * 100 : 0

  const semanaMap: Record<string, number> = {}
  const now = new Date()
  for (let w = 11; w >= 0; w--) {
    const d = new Date(now)
    d.setDate(d.getDate() - w * 7)
    semanaMap[getISOWeek(d)] = 0
  }
  for (const item of semanaRows) {
    const semana = getISOWeek(new Date(item.data_entrada))
    if (semanaMap[semana] !== undefined) semanaMap[semana]++
  }
  const leadsPorSemana = Object.entries(semanaMap).map(([semana, total]) => ({ semana, total }))

  const top10 = top10Rows.map((r) => ({
    pipeline_lead_id: r.id,
    estagio: r.estagio,
    id: r.lead_id,
    nome_empresa: r.nome_empresa,
    cnpj: r.cnpj,
    valor_divida: parseFloat(r.valor_divida),
    classificacao: r.classificacao,
  }))

  return NextResponse.json({
    kpis: {
      totalLeads,
      leadsNovos,
      totalNosPipeline,
      volumeTotal,
      leadsGanhos,
      taxaConversao: Math.round(taxaConversao * 10) / 10,
    },
    porEstagio,
    porClassificacao,
    leadsPorSemana,
    top10,
  })
}
