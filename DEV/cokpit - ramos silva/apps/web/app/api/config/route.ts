import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

const ALLOWED_KEYS = ['google_maps_api_key', 'apollo_api_key', 'divida_minima']
const SECRET_KEYS = ['google_maps_api_key', 'apollo_api_key']

export async function GET() {
  try {
    const rows = await query<{ key: string; value: string }>('SELECT key, value FROM app_config')
    const config: Record<string, unknown> = {}
    for (const row of rows) {
      if (SECRET_KEYS.includes(row.key)) {
        config[row.key + '_configured'] = !!row.value && row.value.trim().length > 0
      } else {
        config[row.key] = row.value
      }
    }
    return NextResponse.json(config)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Erro interno' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const body = await req.json().catch(() => ({})) as { key?: string; value?: string }
  const { key, value } = body

  if (!key || !ALLOWED_KEYS.includes(key)) {
    return NextResponse.json({ error: 'Chave de configuração inválida' }, { status: 400 })
  }
  if (value === undefined) {
    return NextResponse.json({ error: 'Valor obrigatório' }, { status: 400 })
  }

  try {
    await query(
      'INSERT INTO app_config (key, value, updated_at) VALUES ($1, $2, NOW()) ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()',
      [key, value]
    )
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Erro interno' }, { status: 500 })
  }
}
