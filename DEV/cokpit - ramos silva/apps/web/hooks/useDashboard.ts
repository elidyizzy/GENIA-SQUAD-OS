'use client'

import { useQuery } from '@tanstack/react-query'

export type Periodo = '30' | '90' | '180' | 'all'

export interface DashboardData {
  kpis: {
    totalLeads: number
    leadsNovos: number
    totalNosPipeline: number
    volumeTotal: number
    leadsGanhos: number
    taxaConversao: number
  }
  porEstagio: Array<{ estagio: string; count: number; volume: number }>
  porClassificacao: Array<{ name: string; value: number }>
  leadsPorSemana: Array<{ semana: string; total: number }>
  top10: Array<{
    pipeline_lead_id: string
    estagio: string
    id: string
    nome_empresa: string
    cnpj: string
    valor_divida: number
    classificacao: string
  }>
}

export function useDashboard(periodo: Periodo) {
  return useQuery<DashboardData>({
    queryKey: ['dashboard', periodo],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard?periodo=${periodo}`)
      if (!res.ok) throw new Error('Falha ao carregar dashboard')
      return res.json()
    },
    staleTime: 60_000,
  })
}
