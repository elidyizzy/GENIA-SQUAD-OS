import { NextResponse } from 'next/server'
import { queryOne } from '@/lib/db'

export async function POST() {
  const row = await queryOne<{ value: string }>('SELECT value FROM app_config WHERE key = $1', ['google_maps_api_key'])
  const key = row?.value?.trim()

  if (!key) return NextResponse.json({ ok: false, error: 'API Key não configurada' })

  try {
    const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json')
    url.searchParams.set('query', 'test')
    url.searchParams.set('key', key)
    const res = await fetch(url.toString())
    const json = await res.json() as { status: string; error_message?: string }
    if (json.status === 'REQUEST_DENIED' || json.status === 'INVALID_REQUEST') {
      return NextResponse.json({ ok: false, error: json.error_message ?? json.status })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : 'Erro desconhecido' })
  }
}
