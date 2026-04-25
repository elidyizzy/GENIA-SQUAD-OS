import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST() {
  const supabase = createServerClient()
  const { data } = await supabase.from('app_config').select('value').eq('key', 'apollo_api_key').single()
  const key = data?.value?.trim()

  if (!key) {
    return NextResponse.json({ ok: false, error: 'API Key não configurada' })
  }

  try {
    const res = await fetch('https://api.apollo.io/api/v1/auth/health', {
      method: 'GET',
      headers: { 'X-Api-Key': key },
    })
    if (res.ok) return NextResponse.json({ ok: true })
    const text = await res.text()
    return NextResponse.json({ ok: false, error: `HTTP ${res.status}: ${text.slice(0, 100)}` })
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : 'Erro desconhecido' })
  }
}
