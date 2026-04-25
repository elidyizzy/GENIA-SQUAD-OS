import { NextResponse } from 'next/server'
import { queryOne, query } from '@/lib/db'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json().catch(() => ({})) as { motivo?: string }
  const motivo = body.motivo?.trim() || null

  try {
    const lead = await queryOne<{ id: string; status: string }>(
      'SELECT id, status FROM leads WHERE id = $1', [id]
    )
    if (!lead) return NextResponse.json({ error: 'Lead não encontrado' }, { status: 404 })
    if (lead.status === 'pipeline') {
      return NextResponse.json(
        { error: 'Lead está no pipeline — remova do pipeline antes de descartar' },
        { status: 409 }
      )
    }

    await query('UPDATE leads SET status = $2, motivo_descarte = $3 WHERE id = $1', [id, 'descartado', motivo])
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Erro interno' }, { status: 500 })
  }
}
