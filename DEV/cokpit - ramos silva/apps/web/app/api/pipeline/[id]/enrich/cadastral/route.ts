import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createServerClient()

  // Get lead CNPJ
  const { data: pl } = await supabase
    .from('pipeline_leads')
    .select('leads(cnpj, nome_empresa)')
    .eq('id', id)
    .single()

  if (!pl) {
    return NextResponse.json({ error: 'Pipeline lead não encontrado' }, { status: 404 })
  }

  const plData = pl as unknown as { leads: Array<{ cnpj: string; nome_empresa: string }> }
  const lead = Array.isArray(plData.leads) ? plData.leads[0] : plData.leads
  const cnpj = lead.cnpj.replace(/\D/g, '')

  let enrichStatus: 'sucesso' | 'erro' = 'sucesso'
  let dados: Record<string, unknown> = {}
  let erro: string | null = null

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10_000)

    const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`, {
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (res.status === 404) {
      enrichStatus = 'erro'
      erro = 'CNPJ não encontrado na Receita Federal'
    } else if (!res.ok) {
      enrichStatus = 'erro'
      erro = `BrasilAPI retornou status ${res.status}`
    } else {
      const raw = await res.json()
      dados = {
        razao_social: raw.razao_social,
        situacao_cadastral: raw.descricao_situacao_cadastral ?? raw.situacao_cadastral,
        cnae_fiscal: raw.cnae_fiscal,
        cnae_fiscal_descricao: raw.cnae_fiscal_descricao,
        capital_social: raw.capital_social,
        qsa: raw.qsa ?? [],
        logradouro: raw.logradouro,
        numero: raw.numero,
        complemento: raw.complemento,
        bairro: raw.bairro,
        municipio: raw.municipio,
        uf: raw.uf,
        cep: raw.cep,
        endereco_completo: [raw.logradouro, raw.numero, raw.complemento, raw.bairro, raw.municipio, raw.uf]
          .filter(Boolean)
          .join(', '),
      }
    }
  } catch (err) {
    enrichStatus = 'erro'
    erro = err instanceof Error ? err.message : 'Erro ao consultar BrasilAPI'
  }

  const { error: upsertError } = await supabase
    .from('enrichments')
    .upsert(
      {
        pipeline_lead_id: id,
        tipo: 'cadastral',
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
