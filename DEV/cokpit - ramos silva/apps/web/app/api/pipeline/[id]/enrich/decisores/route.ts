import { NextResponse } from 'next/server'
import { queryOne, query } from '@/lib/db'

interface ApolloPersonResult {
  id: string; name: string; title?: string; email?: string
  linkedin_url?: string; organization?: { name: string }
  source?: 'apollo' | 'qsa'
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const apolloApiKey = process.env.APOLLO_API_KEY

  if (!apolloApiKey) {
    return NextResponse.json(
      { error: 'Apollo API Key não configurada. Acesse Configurações para adicionar.' },
      { status: 503 }
    )
  }

  try {
    const pl = await queryOne<{ nome_empresa: string; cadastral_dados: Record<string, unknown> | null }>(
      `SELECT l.nome_empresa,
         (SELECT e.dados FROM enrichments e WHERE e.pipeline_lead_id = pl.id AND e.tipo = 'cadastral' AND e.status = 'sucesso' LIMIT 1) AS cadastral_dados
       FROM pipeline_leads pl JOIN leads l ON l.id = pl.lead_id WHERE pl.id = $1`,
      [id]
    )
    if (!pl) return NextResponse.json({ error: 'Pipeline lead não encontrado' }, { status: 404 })
    if (!pl.cadastral_dados) {
      return NextResponse.json({ error: 'Enriquecimento cadastral necessário. Faça o enriquecimento cadastral primeiro.' }, { status: 422 })
    }

    const qsa = (pl.cadastral_dados.qsa as Array<{ nome_socio?: string; qualificacao_socio?: string }>) ?? []
    if (qsa.length === 0) return NextResponse.json({ error: 'QSA não disponível nos dados cadastrais' }, { status: 422 })

    const decisores: ApolloPersonResult[] = []
    for (const socio of qsa.slice(0, 5)) {
      if (!socio.nome_socio) continue
      try {
        const res = await fetch('https://api.apollo.io/api/v1/people/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Api-Key': apolloApiKey },
          body: JSON.stringify({ name: socio.nome_socio, organization_name: pl.nome_empresa, reveal_personal_emails: false, reveal_phone_number: false }),
        })
        if (res.ok) {
          const data = await res.json() as { person?: ApolloPersonResult }
          if (data.person?.id) decisores.push({ id: data.person.id, name: data.person.name ?? socio.nome_socio, title: data.person.title, email: data.person.email, linkedin_url: data.person.linkedin_url, organization: data.person.organization, source: 'apollo' })
        }
      } catch { /* skip failed lookups */ }
    }

    // Fallback: se Apollo não encontrou ninguém, usa QSA do cadastral
    if (decisores.length === 0) {
      for (const socio of qsa.slice(0, 5)) {
        if (!socio.nome_socio) continue
        decisores.push({ id: `qsa-${socio.nome_socio}`, name: socio.nome_socio, title: socio.qualificacao_socio ?? undefined, source: 'qsa' })
      }
    }

    const dados = { decisores, empresa: pl.nome_empresa }
    const enrichStatus = decisores.length > 0 ? 'sucesso' : 'erro'
    const erro = decisores.length === 0 ? 'Nenhum decisor encontrado (Apollo + QSA)' : null

    await query(
      `INSERT INTO enrichments (pipeline_lead_id, tipo, status, dados, erro, updated_at)
       VALUES ($1, 'decisores', $2, $3, $4, NOW())
       ON CONFLICT (pipeline_lead_id, tipo) DO UPDATE SET status = $2, dados = $3, erro = $4, updated_at = NOW()`,
      [id, enrichStatus, JSON.stringify(dados), erro]
    )

    return NextResponse.json({ ok: true, dados })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Erro interno' }, { status: 500 })
  }
}
