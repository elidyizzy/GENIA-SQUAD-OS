import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

interface ApolloPersonResult {
  id: string
  name: string
  title?: string
  email?: string
  linkedin_url?: string
  organization?: { name: string }
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createServerClient()

  const apolloApiKey = process.env.APOLLO_API_KEY
  if (!apolloApiKey) {
    return NextResponse.json(
      { error: 'Apollo API Key não configurada. Acesse Configurações para adicionar.' },
      { status: 503 }
    )
  }

  // Get enrichment cadastral for QSA
  const { data: pl } = await supabase
    .from('pipeline_leads')
    .select(`
      leads(nome_empresa),
      enrichments(tipo, status, dados)
    `)
    .eq('id', id)
    .single()

  if (!pl) {
    return NextResponse.json({ error: 'Pipeline lead não encontrado' }, { status: 404 })
  }

  const plData = pl as unknown as {
    leads: Array<{ nome_empresa: string }>
    enrichments: Array<{ tipo: string; status: string; dados: Record<string, unknown> | null }>
  }

  const lead = Array.isArray(plData.leads) ? plData.leads[0] : plData.leads
  const cadastralEnrich = plData.enrichments.find((e) => e.tipo === 'cadastral' && e.status === 'sucesso')

  if (!cadastralEnrich?.dados) {
    return NextResponse.json(
      { error: 'Enriquecimento cadastral necessário. Faça o enriquecimento cadastral primeiro.' },
      { status: 422 }
    )
  }

  const qsa = (cadastralEnrich.dados.qsa as Array<{ nome_socio?: string }>) ?? []
  if (qsa.length === 0) {
    return NextResponse.json(
      { error: 'QSA não disponível nos dados cadastrais' },
      { status: 422 }
    )
  }

  const nomEmpresa = lead.nome_empresa
  const decisores: ApolloPersonResult[] = []

  for (const socio of qsa.slice(0, 5)) {
    if (!socio.nome_socio) continue

    try {
      const res = await fetch('https://api.apollo.io/api/v1/people/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': apolloApiKey,
        },
        body: JSON.stringify({
          name: socio.nome_socio,
          organization_name: nomEmpresa,
          reveal_personal_emails: false,
          reveal_phone_number: false,
        }),
      })

      if (res.ok) {
        const data = await res.json() as { person?: ApolloPersonResult }
        if (data.person?.id) {
          decisores.push({
            id: data.person.id,
            name: data.person.name ?? socio.nome_socio,
            title: data.person.title,
            email: data.person.email,
            linkedin_url: data.person.linkedin_url,
            organization: data.person.organization,
          })
        }
      }
    } catch {
      // Skip failed lookups, continue with others
    }
  }

  const dados = { decisores, empresa: nomEmpresa }

  const { error: upsertError } = await supabase
    .from('enrichments')
    .upsert(
      {
        pipeline_lead_id: id,
        tipo: 'decisores',
        status: decisores.length > 0 ? 'sucesso' : 'erro',
        dados,
        erro: decisores.length === 0 ? 'Nenhum decisor encontrado no Apollo' : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'pipeline_lead_id,tipo' }
    )

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, dados })
}
