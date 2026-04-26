import { NextResponse } from 'next/server'
import { queryOne, query } from '@/lib/db'

interface GeoapifyFeature {
  properties: {
    formatted?: string
    name?: string
    lat?: number
    lon?: number
    result_type?: string
  }
}

interface GeoapifyResponse {
  features: GeoapifyFeature[]
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const apiKey = process.env.GEOAPIFY_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Geoapify API key não configurada. Configure GEOAPIFY_API_KEY nas variáveis de ambiente.' },
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
    const queryText = [razaoSocial, municipio, uf, 'Brasil'].filter(Boolean).join(' ')

    let enrichStatus: 'sucesso' | 'erro' = 'sucesso'
    let dados: Record<string, unknown> = {}
    let erro: string | null = null

    try {
      const url = new URL('https://api.geoapify.com/v1/geocode/search')
      url.searchParams.set('text', queryText)
      url.searchParams.set('lang', 'pt')
      url.searchParams.set('limit', '1')
      url.searchParams.set('filter', 'countrycode:br')
      url.searchParams.set('apiKey', apiKey)

      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10_000)
      const res = await fetch(url.toString(), { signal: controller.signal })
      clearTimeout(timeout)

      if (!res.ok) {
        enrichStatus = 'erro'; erro = `Geoapify retornou status ${res.status}`
      } else {
        const raw = await res.json() as GeoapifyResponse
        if (!raw.features || raw.features.length === 0) {
          enrichStatus = 'erro'; erro = 'Empresa não encontrada via Geoapify'
        } else {
          const place = raw.features[0].properties
          const lat = place.lat
          const lon = place.lon
          dados = {
            nome: place.name ?? razaoSocial,
            endereco: place.formatted ?? queryText,
            maps_url: lat && lon
              ? `https://www.google.com/maps?q=${lat},${lon}`
              : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryText)}`,
            business_status: 'OPERATIONAL',
            query_usado: queryText,
          }
        }
      }
    } catch (e) {
      enrichStatus = 'erro'; erro = e instanceof Error ? e.message : 'Erro ao consultar Geoapify'
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
