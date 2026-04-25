import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST() {
  const supabase = createServerClient()
  const { data } = await supabase.from('app_config').select('value').eq('key', 'google_maps_api_key').single()
  const key = data?.value?.trim()

  if (!key) {
    return NextResponse.json({ ok: false, error: 'API Key não configurada' })
  }

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
