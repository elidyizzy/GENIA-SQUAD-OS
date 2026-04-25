import { NextResponse } from 'next/server'
import { queryOne, query } from '@/lib/db'

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json().catch(() => ({})) as { estagio?: string; resultado?: string; motivo?: string }
  const { estagio, resultado, motivo } = body

  if (!estagio) return NextResponse.json({ error: 'Campo estagio obrigatório' }, { status: 400 })
  if (estagio === 'fechado' && !resultado) {
    return NextResponse.json({ error: 'Resultado obrigatório para fechamento (Ganho/Perdido)' }, { status: 400 })
  }

  try {
    const pl = await queryOne<{ lead_id: string; estagio: string }>(
      'SELECT lead_id, estagio FROM pipeline_leads WHERE id = $1', [id]
    )
    if (!pl) return NextResponse.json({ error: 'Pipeline lead não encontrado' }, { status: 404 })

    const setClauses = ['estagio = $2']
    const params: unknown[] = [id, estagio]
    let i = 3
    if (resultado) { setClauses.push(`resultado = $${i++}`); params.push(resultado) }
    if (motivo) { setClauses.push(`motivo_fechamento = $${i++}`); params.push(motivo) }

    await query(`UPDATE pipeline_leads SET ${setClauses.join(', ')} WHERE id = $1`, params)
    await query(
      'INSERT INTO estagio_historico (pipeline_lead_id, estagio_anterior, estagio_novo) VALUES ($1, $2, $3)',
      [id, pl.estagio, estagio]
    )

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Erro interno' }, { status: 500 })
  }
}
