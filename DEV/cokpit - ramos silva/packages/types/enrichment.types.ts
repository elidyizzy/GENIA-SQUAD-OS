export type EnrichmentTipo = 'cadastral' | 'maps' | 'trf' | 'decisores'
export type EnrichmentStatus = 'pendente' | 'sucesso' | 'erro'

export interface Enrichment {
  id: string
  pipeline_lead_id: string
  tipo: EnrichmentTipo
  status: EnrichmentStatus
  dados: Record<string, unknown> | null
  erro: string | null
  created_at: string
  updated_at: string
}

export interface CadastralDados {
  razao_social: string
  situacao_cadastral: string
  cnae_fiscal: number
  cnae_fiscal_descricao: string
  capital_social: number
  qsa: Array<{ nome_socio: string; qualificacao_socio: string }>
  logradouro: string
  numero: string
  municipio: string
  uf: string
  cep: string
}

export interface MapsDados {
  formatted_address: string
  business_status: string
  place_id: string
  maps_url: string
}

export interface TrfProcesso {
  numero: string
  tipo: 'execucao_fiscal' | 'embargo' | 'mandado' | 'outro'
  tribunal: string
  data: string
}

export interface TrfDados {
  disponivel: boolean
  processos: TrfProcesso[]
  risco: 'baixo' | 'medio' | 'alto'
}

export interface Decisor {
  nome: string
  cargo: string | null
  email: string | null
  linkedin_url: string | null
}

export interface DecisoresDados {
  decisores: Decisor[]
}
