import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const rows = await query('SELECT * FROM sync_logs ORDER BY iniciado_em DESC LIMIT 20')
    return NextResponse.json(rows)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Erro interno' }, { status: 500 })
  }
}
