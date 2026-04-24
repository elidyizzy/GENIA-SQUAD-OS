export type LeadClassificacao = 'A' | 'B' | 'C'
export type LeadStatus = 'novo' | 'pipeline' | 'descartado'

export interface Lead {
  id: string
  cnpj: string
  nome_empresa: string
  valor_divida: number
  uf: string | null
  classificacao: LeadClassificacao
  status: LeadStatus
  motivo_descarte: string | null
  pgfn_raw: Record<string, unknown> | null
  data_entrada: string
  updated_at: string
}
