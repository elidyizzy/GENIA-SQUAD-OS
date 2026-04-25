import { NextResponse } from 'next/server'
import { queryOne } from '@/lib/db'

export async function POST() {
  const row = await queryOne<{ value: string }>('SELECT value FROM app_config WHERE key = $1', ['apollo_api_key'])
  const key = row?.value?.trim()

  if (!key) return NextResponse.json({ ok: false, error: 'API Key não configurada' })

  try {
    const res = await fetch('https://api.apollo.io/api/v1/auth/health', { method: 'GET', headers: { 'X-Api-Key': key } })
    if (res.ok) return NextResponse.json({ ok: true })
    const text = await res.text()
    return NextResponse.json({ ok: false, error: `HTTP ${res.status}: ${text.slice(0, 100)}` })
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : 'Erro desconhecido' })
  }
}
