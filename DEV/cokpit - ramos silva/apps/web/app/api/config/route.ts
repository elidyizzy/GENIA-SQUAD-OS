import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

const ALLOWED_KEYS = ['google_maps_api_key', 'apollo_api_key', 'divida_minima']
const SECRET_KEYS = ['google_maps_api_key', 'apollo_api_key']

export async function GET() {
  const supabase = createServerClient()
  const { data, error } = await supabase.from('app_config').select('key, value')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const config: Record<string, unknown> = {}
  for (const row of data ?? []) {
    if (SECRET_KEYS.includes(row.key)) {
      config[row.key + '_configured'] = !!row.value && row.value.trim().length > 0
    } else {
      config[row.key] = row.value
    }
  }

  return NextResponse.json(config)
}

export async function PUT(req: Request) {
  const supabase = createServerClient()
  const body = await req.json().catch(() => ({})) as { key?: string; value?: string }

  const { key, value } = body
  if (!key || !ALLOWED_KEYS.includes(key)) {
    return NextResponse.json({ error: 'Chave de configuração inválida' }, { status: 400 })
  }
  if (value === undefined) {
    return NextResponse.json({ error: 'Valor obrigatório' }, { status: 400 })
  }

  const { error } = await supabase
    .from('app_config')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
