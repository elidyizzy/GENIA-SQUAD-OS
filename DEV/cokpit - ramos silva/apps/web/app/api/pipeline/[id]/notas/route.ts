import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json().catch(() => ({})) as { notas?: string }

  try {
    await query('UPDATE pipeline_leads SET notas = $2 WHERE id = $1', [id, body.notas ?? ''])
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Erro interno' }, { status: 500 })
  }
}
