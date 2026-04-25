import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { buscarProcessosTRF, calcularRisco } from '@/lib/services/trf'

export const maxDuration = 60

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createServerClient()

  const { data: pl } = await supabase
    .from('pipeline_leads')
    .select('leads(cnpj, uf)')
    .eq('id', id)
    .single()

  if (!pl) {
    return NextResponse.json({ error: 'Pipeline lead não encontrado' }, { status: 404 })
  }

  const leads = (pl as unknown as { leads: Array<{ cnpj: string; uf: string | null }> }).leads
  const lead = Array.isArray(leads) ? leads[0] : leads

  if (!lead?.uf) {
    return NextResponse.json({ error: 'UF do lead não disponível' }, { status: 422 })
  }

  const resultado = await buscarProcessosTRF(lead.uf, lead.cnpj)
  const risco = resultado.disponivel ? calcularRisco(resultado.processos.length) : null

  const dados = {
    disponivel: resultado.disponivel,
    trf: resultado.trf,
    processos: resultado.processos,
    risco,
    uf: lead.uf,
  }

  const enrichStatus = resultado.disponivel ? 'sucesso' : 'erro'
  const erro = resultado.disponivel ? null : `${resultado.trf} indisponível no momento`

  const { error: upsertError } = await supabase
    .from('enrichments')
    .upsert(
      {
        pipeline_lead_id: id,
        tipo: 'trf',
        status: enrichStatus,
        dados,
        erro,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'pipeline_lead_id,tipo' }
    )

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, dados })
}
