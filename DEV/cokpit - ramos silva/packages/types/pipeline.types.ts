export type Estagio =
  | 'lead_bruto'
  | 'enriquecido'
  | 'qualificado'
  | 'contato_feito'
  | 'proposta_enviada'
  | 'em_negociacao'
  | 'fechado'

export type ResultadoFechamento = 'ganho' | 'perdido'

export interface PipelineLead {
  id: string
  lead_id: string
  estagio: Estagio
  resultado: ResultadoFechamento | null
  motivo_fechamento: string | null
  notas: string | null
  created_at: string
  updated_at: string
}

export interface EstagioHistorico {
  id: string
  pipeline_lead_id: string
  estagio_anterior: Estagio | null
  estagio_novo: Estagio
  created_at: string
}

export const ESTAGIO_LABELS: Record<Estagio, string> = {
  lead_bruto: 'Lead Bruto',
  enriquecido: 'Enriquecido',
  qualificado: 'Qualificado',
  contato_feito: 'Contato Feito',
  proposta_enviada: 'Proposta Enviada',
  em_negociacao: 'Em Negociação',
  fechado: 'Fechado',
}
