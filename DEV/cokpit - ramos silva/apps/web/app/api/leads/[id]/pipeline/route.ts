import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createServerClient()

  const { data: lead, error: fetchError } = await supabase
    .from('leads')
    .select('id, status')
    .eq('id', id)
    .single()

  if (fetchError || !lead) {
    return NextResponse.json({ error: 'Lead não encontrado' }, { status: 404 })
  }

  if (lead.status !== 'novo') {
    return NextResponse.json(
      { error: 'Lead já está no pipeline ou foi descartado' },
      { status: 409 }
    )
  }

  const { data: newPl, error: pipelineError } = await supabase
    .from('pipeline_leads')
    .insert({ lead_id: id, estagio: 'lead_bruto' })
    .select('id')
    .single()

  if (pipelineError) {
    if (pipelineError.code === '23505') {
      return NextResponse.json({ error: 'Lead já está no pipeline' }, { status: 409 })
    }
    return NextResponse.json({ error: pipelineError.message }, { status: 500 })
  }

  const { error: updateError } = await supabase
    .from('leads')
    .update({ status: 'pipeline' })
    .eq('id', id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  if (newPl) {
    await supabase.from('estagio_historico').insert({
      pipeline_lead_id: newPl.id,
      estagio_anterior: null,
      estagio_novo: 'lead_bruto',
    })
  }

  return NextResponse.json({ ok: true })
}
