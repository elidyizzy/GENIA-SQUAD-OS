import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json().catch(() => ({})) as {
    estagio?: string
    resultado?: string
    motivo?: string
  }

  const { estagio, resultado, motivo } = body

  if (!estagio) {
    return NextResponse.json({ error: 'Campo estagio obrigatório' }, { status: 400 })
  }

  if (estagio === 'fechado' && !resultado) {
    return NextResponse.json({ error: 'Resultado obrigatório para fechamento (Ganho/Perdido)' }, { status: 400 })
  }

  const supabase = createServerClient()

  const { data: pl, error: fetchError } = await supabase
    .from('pipeline_leads')
    .select('lead_id, estagio')
    .eq('id', id)
    .single()

  if (fetchError || !pl) {
    return NextResponse.json({ error: 'Pipeline lead não encontrado' }, { status: 404 })
  }

  const previousEstagio = pl.estagio as string
  const updates: Record<string, string> = { estagio }
  if (resultado) updates.resultado = resultado
  if (motivo) updates.motivo_fechamento = motivo

  const { error: updateError } = await supabase
    .from('pipeline_leads')
    .update(updates)
    .eq('id', id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  await supabase.from('estagio_historico').insert({
    pipeline_lead_id: id,
    estagio_anterior: previousEstagio,
    estagio_novo: estagio,
  })

  return NextResponse.json({ ok: true })
}
