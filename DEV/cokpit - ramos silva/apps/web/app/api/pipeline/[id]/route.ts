import { NextResponse } from 'next/server'
import { queryOne } from '@/lib/db'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const row = await queryOne(`
      SELECT
        pl.id, pl.estagio, pl.resultado, pl.notas, pl.motivo_fechamento, pl.created_at, pl.updated_at,
        json_build_object(
          'id', l.id, 'cnpj', l.cnpj, 'nome_empresa', l.nome_empresa,
          'valor_divida', l.valor_divida, 'uf', l.uf, 'classificacao', l.classificacao,
          'status', l.status, 'data_entrada', l.data_entrada
        ) AS leads,
        COALESCE(
          (SELECT json_agg(json_build_object('id', e.id, 'tipo', e.tipo, 'status', e.status, 'dados', e.dados, 'erro', e.erro, 'updated_at', e.updated_at))
           FROM enrichments e WHERE e.pipeline_lead_id = pl.id),
          '[]'::json
        ) AS enrichments,
        COALESCE(
          (SELECT json_agg(json_build_object('id', eh.id, 'estagio_anterior', eh.estagio_anterior, 'estagio_novo', eh.estagio_novo, 'created_at', eh.created_at) ORDER BY eh.created_at DESC)
           FROM estagio_historico eh WHERE eh.pipeline_lead_id = pl.id),
          '[]'::json
        ) AS estagio_historico
      FROM pipeline_leads pl
      JOIN leads l ON l.id = pl.lead_id
      WHERE pl.id = $1
    `, [id])

    if (!row) return NextResponse.json({ error: 'Pipeline lead não encontrado' }, { status: 404 })
    return NextResponse.json(row)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Erro interno' }, { status: 500 })
  }
}
