'use client'

import { useQuery } from '@tanstack/react-query'

export interface EnrichmentInfo {
  tipo: string
  status: string
}

export interface PipelineLead {
  id: string
  estagio: string
  resultado: string | null
  created_at: string
  leads: {
    id: string
    cnpj: string
    nome_empresa: string
    valor_divida: number
    uf: string | null
    classificacao: string
    status: string
  }
  enrichments: EnrichmentInfo[]
}

export type GroupedPipeline = Record<string, PipelineLead[]>

export const ESTAGIOS: { id: string; label: string }[] = [
  { id: 'lead_bruto',   label: 'Lead Bruto' },
  { id: 'enriquecido',  label: 'Enriquecido' },
  { id: 'qualificado',  label: 'Qualificado' },
  { id: 'contato',      label: 'Contato' },
  { id: 'diagnostico',  label: 'Diagnóstico' },
  { id: 'proposta',     label: 'Proposta' },
  { id: 'fechado',      label: 'Fechado/Perdido' },
]

export function usePipeline() {
  return useQuery<GroupedPipeline>({
    queryKey: ['pipeline'],
    queryFn: async () => {
      const res = await fetch('/api/pipeline')
      if (!res.ok) throw new Error('Falha ao carregar pipeline')
      return res.json()
    },
    staleTime: 30_000,
  })
}
