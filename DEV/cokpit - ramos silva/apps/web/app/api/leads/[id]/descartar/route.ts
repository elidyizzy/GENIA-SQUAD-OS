import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createServerClient()

  const body = await req.json().catch(() => ({})) as { motivo?: string }
  const motivo = body.motivo?.trim() || null

  const { data: lead, error: fetchError } = await supabase
    .from('leads')
    .select('id, status')
    .eq('id', id)
    .single()

  if (fetchError || !lead) {
    return NextResponse.json({ error: 'Lead não encontrado' }, { status: 404 })
  }

  if (lead.status === 'pipeline') {
    return NextResponse.json(
      { error: 'Lead está no pipeline — remova do pipeline antes de descartar' },
      { status: 409 }
    )
  }

  const { error: updateError } = await supabase
    .from('leads')
    .update({ status: 'descartado', motivo_descarte: motivo })
    .eq('id', id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
