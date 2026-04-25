import { NextResponse } from 'next/server'
import { queryOne, query } from '@/lib/db'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const mapsApiKey = process.env.GOOGLE_MAPS_API_KEY

  if (!mapsApiKey) {
    return NextResponse.json(
      { error: 'Google Maps API key não configurada. Configure GOOGLE_MAPS_API_KEY nas variáveis de ambiente.' },
      { status: 503 }
    )
  }

  try {
    const pl = await queryOne<{
      nome_empresa: string; uf: string | null;
      cadastral_dados: Record<string, unknown> | null
    }>(
      `SELECT l.nome_empresa, l.uf,
         (SELECT e.dados FROM enrichments e WHERE e.pipeline_lead_id = pl.id AND e.tipo = 'cadastral' AND e.status = 'sucesso' LIMIT 1) AS cadastral_dados
       FROM pipeline_leads pl JOIN leads l ON l.id = pl.lead_id WHERE pl.id = $1`,
      [id]
    )
    if (!pl) return NextResponse.json({ error: 'Pipeline lead não encontrado' }, { status: 404 })

    const municipio = (pl.cadastral_dados?.municipio as string) ?? ''
    const razaoSocial = (pl.cadastral_dados?.razao_social as string) ?? pl.nome_empresa
    const uf = (pl.cadastral_dados?.uf as string) ?? pl.uf ?? ''
    const q = [razaoSocial, municipio, uf, 'Brasil'].filter(Boolean).join(' ')

    let enrichStatus: 'sucesso' | 'erro' = 'sucesso'
    let dados: Record<string, unknown> = {}
    let erro: string | null = null

    try {
      const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json')
      url.searchParams.set('query', q)
      url.searchParams.set('key', mapsApiKey)
      url.searchParams.set('language', 'pt-BR')
      url.searchParams.set('region', 'br')

      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10_000)
      const res = await fetch(url.toString(), { signal: controller.signal })
      clearTimeout(timeout)

      if (!res.ok) {
        enrichStatus = 'erro'; erro = `Google Maps API retornou status ${res.status}`
      } else {
        const raw = await res.json() as { status: string; results: Array<{ name: string; formatted_address: string; place_id: string; business_status?: string }> }
        if (raw.status !== 'OK' || raw.results.length === 0) {
          enrichStatus = 'erro'; erro = 'Empresa não encontrada no Google Maps'
        } else {
          const place = raw.results[0]
          dados = {
            nome: place.name, endereco: place.formatted_address, place_id: place.place_id,
            maps_url: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
            business_status: place.business_status ?? 'OPERATIONAL', query_usado: q,
          }
        }
      }
    } catch (e) {
      enrichStatus = 'erro'; erro = e instanceof Error ? e.message : 'Erro ao consultar Google Maps'
    }

    await query(
      `INSERT INTO enrichments (pipeline_lead_id, tipo, status, dados, erro, updated_at)
       VALUES ($1, 'maps', $2, $3, $4, NOW())
       ON CONFLICT (pipeline_lead_id, tipo) DO UPDATE SET status = $2, dados = $3, erro = $4, updated_at = NOW()`,
      [id, enrichStatus, enrichStatus === 'sucesso' ? JSON.stringify(dados) : null, erro]
    )

    if (enrichStatus === 'erro') return NextResponse.json({ error: erro }, { status: 422 })
    return NextResponse.json({ ok: true, dados })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Erro interno' }, { status: 500 })
  }
}
