import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

const ESTAGIOS = ['lead_bruto', 'enriquecido', 'qualificado', 'contato', 'diagnostico', 'proposta', 'fechado']

export async function GET() {
  try {
    const rows = await query(`
      SELECT
        pl.id, pl.estagio, pl.resultado, pl.created_at,
        json_build_object(
          'id', l.id, 'cnpj', l.cnpj, 'nome_empresa', l.nome_empresa,
          'valor_divida', l.valor_divida, 'uf', l.uf, 'classificacao', l.classificacao, 'status', l.status
        ) AS leads,
        COALESCE(
          (SELECT json_agg(json_build_object('tipo', e.tipo, 'status', e.status))
           FROM enrichments e WHERE e.pipeline_lead_id = pl.id),
          '[]'::json
        ) AS enrichments
      FROM pipeline_leads pl
      JOIN leads l ON l.id = pl.lead_id
      ORDER BY pl.created_at ASC
    `)

    const grouped: Record<string, unknown[]> = Object.fromEntries(ESTAGIOS.map((s) => [s, []]))
    for (const item of rows) {
      const stage = item.estagio as string
      if (!grouped[stage]) grouped[stage] = []
      grouped[stage].push(item)
    }

    return NextResponse.json(grouped)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Erro interno' }, { status: 500 })
  }
}
