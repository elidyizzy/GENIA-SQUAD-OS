import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

const ESTAGIOS = ['lead_bruto', 'enriquecido', 'qualificado', 'contato', 'diagnostico', 'proposta', 'fechado']

export async function GET() {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('pipeline_leads')
    .select(`
      id,
      estagio,
      resultado,
      created_at,
      leads (
        id,
        cnpj,
        nome_empresa,
        valor_divida,
        uf,
        classificacao,
        status
      ),
      enrichments (
        tipo,
        status
      )
    `)
    .order('created_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const grouped: Record<string, unknown[]> = Object.fromEntries(ESTAGIOS.map((s) => [s, []]))
  for (const item of data ?? []) {
    const stage = item.estagio as string
    if (!grouped[stage]) grouped[stage] = []
    grouped[stage].push(item)
  }

  return NextResponse.json(grouped)
}
