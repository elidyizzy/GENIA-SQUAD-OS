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
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const lead = await queryOne<LeadRow>(
    'SELECT id, cnpj, nome_empresa, valor_divida, uf, classificacao, status FROM leads WHERE id = $1',
    [id]
  )
  if (!lead) return NextResponse.json({ error: 'Lead não encontrado' }, { status: 404 })

  const isValidCnpj = /^\d{14}$/.test(lead.cnpj)
  if (!isValidCnpj) {
    return NextResponse.json({ lead, pgfn: null, reason: 'masked_cpf' })
  }

  try {
    const res = await fetch(
      `https://www.regularize.pgfn.gov.br/api/v1/devedores/${lead.cnpj}/inscricoes-agrupadas`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          Accept: 'application/json',
          Referer: 'https://www.regularize.pgfn.gov.br/',
        },
        signal: AbortSignal.timeout(8000),
      }
    )
    if (!res.ok) {
      return NextResponse.json({ lead, pgfn: null, reason: 'api_unavailable' })
    }
    const pgfn = await res.json()
    return NextResponse.json({ lead, pgfn })
  } catch {
    return NextResponse.json({ lead, pgfn: null, reason: 'api_error' })
  }
}
