import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

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

  const supabase = createServerClient()

  const [
    totalLeadsResult,
    leadsNovosResult,
    porEstagioResult,
    porClassifResult,
    ganhadosResult,
    top10Result,
    leadsPorSemanaResult,
  ] = await Promise.all([
    // Total leads na base
    supabase.from('leads').select('*', { count: 'exact', head: true }),

    // Leads novos no período
    startDate
      ? supabase.from('leads').select('*', { count: 'exact', head: true }).gte('data_entrada', startDate)
      : supabase.from('leads').select('*', { count: 'exact', head: true }),

    // Leads por estágio no pipeline
    supabase
      .from('pipeline_leads')
      .select('estagio, leads(valor_divida)')
      .neq('estagio', 'fechado'),

    // Leads por classificação (ativos no pipeline)
    supabase
      .from('pipeline_leads')
      .select('leads(classificacao)')
      .neq('estagio', 'fechado'),

    // Leads ganhos no período
    startDate
      ? supabase
          .from('pipeline_leads')
          .select('*', { count: 'exact', head: true })
          .eq('estagio', 'fechado')
          .eq('resultado', 'ganho')
          .gte('updated_at', startDate)
      : supabase
          .from('pipeline_leads')
          .select('*', { count: 'exact', head: true })
          .eq('estagio', 'fechado')
          .eq('resultado', 'ganho'),

    // Top 10 leads por valor de dívida no pipeline
    supabase
      .from('pipeline_leads')
      .select('id, estagio, leads(id, nome_empresa, cnpj, valor_divida, classificacao)')
      .order('leads(valor_divida)', { ascending: false })
      .limit(10),

    // Leads novos por semana (últimas 12 semanas)
    supabase
      .from('leads')
      .select('data_entrada')
      .gte('data_entrada', (() => { const d = new Date(); d.setDate(d.getDate() - 84); return d.toISOString() })())
      .order('data_entrada', { ascending: true }),
  ])

  // Aggregar leads por estágio
  const ESTAGIOS = ['lead_bruto', 'enriquecido', 'qualificado', 'contato', 'diagnostico', 'proposta']
  const porEstagioMap: Record<string, { count: number; volume: number }> = Object.fromEntries(
    ESTAGIOS.map((s) => [s, { count: 0, volume: 0 }])
  )
  for (const item of porEstagioResult.data ?? []) {
    const estagio = item.estagio as string
    if (porEstagioMap[estagio]) {
      porEstagioMap[estagio].count++
      const leads = Array.isArray(item.leads) ? item.leads[0] : item.leads
      porEstagioMap[estagio].volume += (leads as { valor_divida?: number })?.valor_divida ?? 0
    }
  }
  const porEstagio = ESTAGIOS.map((s) => ({
    estagio: s,
    count: porEstagioMap[s].count,
    volume: porEstagioMap[s].volume,
  }))

  // Agregação por classificação
  const classifMap: Record<string, number> = { A: 0, B: 0, C: 0 }
  for (const item of porClassifResult.data ?? []) {
    const leads = Array.isArray(item.leads) ? item.leads[0] : item.leads
    const classif = (leads as { classificacao?: string })?.classificacao
    if (classif && classifMap[classif] !== undefined) classifMap[classif]++
  }
  const porClassificacao = Object.entries(classifMap).map(([name, value]) => ({ name, value }))

  // Volume total em prospecção
  const volumeTotal = Object.values(porEstagioMap).reduce((sum, v) => sum + v.volume, 0)
  const totalNosPipeline = Object.values(porEstagioMap).reduce((sum, v) => sum + v.count, 0)

  // Taxa de conversão
  const totalLeadsBrutos = totalLeadsResult.count ?? 0
  const leadsGanhos = ganhadosResult.count ?? 0
  const taxaConversao = totalLeadsBrutos > 0 ? (leadsGanhos / totalLeadsBrutos) * 100 : 0

  // Leads por semana (últimas 12 semanas)
  const semanaMap: Record<string, number> = {}
  const now = new Date()
  for (let w = 11; w >= 0; w--) {
    const d = new Date(now)
    d.setDate(d.getDate() - w * 7)
    semanaMap[getISOWeek(d)] = 0
  }
  for (const item of leadsPorSemanaResult.data ?? []) {
    const semana = getISOWeek(new Date(item.data_entrada))
    if (semanaMap[semana] !== undefined) semanaMap[semana]++
  }
  const leadsPorSemana = Object.entries(semanaMap).map(([semana, total]) => ({ semana, total }))

  // Top 10
  const top10 = (top10Result.data ?? []).map((item) => {
    const leads = Array.isArray(item.leads) ? item.leads[0] : item.leads
    return {
      pipeline_lead_id: item.id,
      estagio: item.estagio,
      ...(leads as { id: string; nome_empresa: string; cnpj: string; valor_divida: number; classificacao: string }),
    }
  })

  return NextResponse.json({
    kpis: {
      totalLeads: totalLeadsBrutos,
      leadsNovos: leadsNovosResult.count ?? 0,
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
