import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('pipeline_leads')
    .select(`
      id,
      estagio,
      resultado,
      notas,
      motivo_fechamento,
      created_at,
      updated_at,
      leads (
        id,
        cnpj,
        nome_empresa,
        valor_divida,
        uf,
        classificacao,
        status,
        data_entrada
      ),
      enrichments (
        id,
        tipo,
        status,
        dados,
        erro,
        updated_at
      ),
      estagio_historico (
        id,
        estagio_anterior,
        estagio_novo,
        created_at
      )
    `)
    .eq('id', id)
    .order('created_at', { referencedTable: 'estagio_historico', ascending: false })
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Pipeline lead não encontrado' }, { status: 404 })
  }

  return NextResponse.json(data)
}
