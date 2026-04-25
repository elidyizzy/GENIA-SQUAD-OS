import { NextResponse } from 'next/server'
import { queryOne } from '@/lib/db'

interface LeadRow {
  id: string
  cnpj: string
  nome_empresa: string
  valor_divida: number
  uf: string | null
  classificacao: string
  status: string
  data_entrada: string
  pgfn_raw: Record<string, number> | null
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const lead = await queryOne<LeadRow>(
    'SELECT id, cnpj, nome_empresa, valor_divida, uf, classificacao, status, data_entrada, pgfn_raw FROM leads WHERE id = $1',
    [id]
  )
  if (!lead) return NextResponse.json({ error: 'Lead não encontrado' }, { status: 404 })

  return NextResponse.json({ lead })
}
