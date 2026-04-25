import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createServerClient()

  const mapsApiKey = process.env.GOOGLE_MAPS_API_KEY

  if (!mapsApiKey) {
    return NextResponse.json(
      { error: 'Google Maps API key não configurada. Configure GOOGLE_MAPS_API_KEY nas variáveis de ambiente.' },
      { status: 503 }
    )
  }

  // Get lead info
  const { data: pl } = await supabase
    .from('pipeline_leads')
    .select(`
      leads(nome_empresa, uf),
      enrichments(tipo, dados)
    `)
    .eq('id', id)
    .single()

  if (!pl) {
    return NextResponse.json({ error: 'Pipeline lead não encontrado' }, { status: 404 })
  }

  const plData = pl as unknown as {
    leads: Array<{ nome_empresa: string; uf: string | null }>
    enrichments: Array<{ tipo: string; dados: Record<string, unknown> | null }>
  }

  const cadastralEnrich = plData.enrichments.find((e) => e.tipo === 'cadastral')
  const lead = Array.isArray(plData.leads) ? plData.leads[0] : plData.leads
  const municipio = (cadastralEnrich?.dados?.municipio as string) ?? ''
  const razaoSocial = (cadastralEnrich?.dados?.razao_social as string) ?? lead.nome_empresa
  const uf = (cadastralEnrich?.dados?.uf as string) ?? lead.uf ?? ''

  const query = [razaoSocial, municipio, uf, 'Brasil'].filter(Boolean).join(' ')

  let enrichStatus: 'sucesso' | 'erro' = 'sucesso'
  let dados: Record<string, unknown> = {}
  let erro: string | null = null

  try {
    const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json')
    url.searchParams.set('query', query)
    url.searchParams.set('key', mapsApiKey)
    url.searchParams.set('language', 'pt-BR')
    url.searchParams.set('region', 'br')

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10_000)
    const res = await fetch(url.toString(), { signal: controller.signal })
    clearTimeout(timeout)

    if (!res.ok) {
      enrichStatus = 'erro'
      erro = `Google Maps API retornou status ${res.status}`
    } else {
      const raw = await res.json() as { status: string; results: Array<{
        name: string
        formatted_address: string
        place_id: string
        business_status?: string
      }> }

      if (raw.status !== 'OK' || raw.results.length === 0) {
        enrichStatus = 'erro'
        erro = 'Empresa não encontrada no Google Maps'
      } else {
        const place = raw.results[0]
        dados = {
          nome: place.name,
          endereco: place.formatted_address,
          place_id: place.place_id,
          maps_url: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
          business_status: place.business_status ?? 'OPERATIONAL',
          query_usado: query,
        }
      }
    }
  } catch (err) {
    enrichStatus = 'erro'
    erro = err instanceof Error ? err.message : 'Erro ao consultar Google Maps'
  }

  const { error: upsertError } = await supabase
    .from('enrichments')
    .upsert(
      {
        pipeline_lead_id: id,
        tipo: 'maps',
        status: enrichStatus,
        dados: enrichStatus === 'sucesso' ? dados : null,
        erro,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'pipeline_lead_id,tipo' }
    )

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 })
  }

  if (enrichStatus === 'erro') {
    return NextResponse.json({ error: erro }, { status: 422 })
  }

  return NextResponse.json({ ok: true, dados })
}
