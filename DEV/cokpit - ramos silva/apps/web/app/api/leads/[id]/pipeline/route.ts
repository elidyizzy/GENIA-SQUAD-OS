import { NextResponse } from 'next/server'
import { queryOne, query } from '@/lib/db'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const lead = await queryOne<{ id: string; status: string }>(
      'SELECT id, status FROM leads WHERE id = $1', [id]
    )
    if (!lead) return NextResponse.json({ error: 'Lead não encontrado' }, { status: 404 })
    if (lead.status !== 'novo') {
      return NextResponse.json({ error: 'Lead já está no pipeline ou foi descartado' }, { status: 409 })
    }

    let newPlId: string
    try {
      const rows = await query<{ id: string }>(
        'INSERT INTO pipeline_leads (lead_id, estagio) VALUES ($1, $2) RETURNING id',
        [id, 'lead_bruto']
      )
      newPlId = rows[0].id
    } catch (err: unknown) {
      const e = err as { code?: string }
      if (e.code === '23505') return NextResponse.json({ error: 'Lead já está no pipeline' }, { status: 409 })
      throw err
    }

    await query('UPDATE leads SET status = $2 WHERE id = $1', [id, 'pipeline'])
    await query(
      'INSERT INTO estagio_historico (pipeline_lead_id, estagio_anterior, estagio_novo) VALUES ($1, $2, $3)',
      [newPlId, null, 'lead_bruto']
    )

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Erro interno' }, { status: 500 })
  }
}
