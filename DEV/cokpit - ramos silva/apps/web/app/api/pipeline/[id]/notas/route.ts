import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json().catch(() => ({})) as { notas?: string }
  const notas = body.notas ?? ''

  const supabase = createServerClient()

  const { error } = await supabase
    .from('pipeline_leads')
    .update({ notas })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
