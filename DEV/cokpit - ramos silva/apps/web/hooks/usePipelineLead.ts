'use client'

import { useQuery } from '@tanstack/react-query'

export interface HistoricoItem {
  id: string
  estagio_anterior: string | null
  estagio_novo: string
  created_at: string
}

export interface EnrichmentData {
  id: string
  tipo: string
  status: string
  dados: Record<string, unknown> | null
  erro: string | null
  updated_at: string
}

export interface PipelineLeadDetail {
  id: string
  estagio: string
  resultado: string | null
  notas: string | null
  motivo_fechamento: string | null
  created_at: string
  updated_at: string
  leads: {
    id: string
    cnpj: string
    nome_empresa: string
    valor_divida: number
    uf: string | null
    classificacao: string
    status: string
    data_entrada: string
  }
  enrichments: EnrichmentData[]
  estagio_historico: HistoricoItem[]
}

export function usePipelineLead(id: string | null) {
  return useQuery<PipelineLeadDetail>({
    queryKey: ['pipeline-lead', id],
    queryFn: async () => {
      const res = await fetch(`/api/pipeline/${id}`)
      if (!res.ok) throw new Error('Falha ao carregar lead')
      return res.json()
    },
    enabled: !!id,
    staleTime: 10_000,
  })
}
