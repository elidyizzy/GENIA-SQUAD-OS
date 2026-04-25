import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { normalizarCnpj } from '@/lib/formatters'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit = Math.min(100, parseInt(searchParams.get('limit') ?? '100'))
  const uf = searchParams.get('uf')
  const classificacao = searchParams.get('classificacao')
  const status = searchParams.get('status')
  const q = searchParams.get('q')?.trim()
  const order = searchParams.get('order') === 'asc' ? 'ASC' : 'DESC'
  const offset = (page - 1) * limit

  try {
    const conditions: string[] = []
    const params: unknown[] = []
    let i = 1

    if (uf) { conditions.push(`uf = $${i++}`); params.push(uf) }
    if (classificacao) { conditions.push(`classificacao = $${i++}`); params.push(classificacao) }
    if (status) { conditions.push(`status = $${i++}`); params.push(status) }
    if (q) {
      const cnpjLimpo = normalizarCnpj(q)
      conditions.push(`(nome_empresa ILIKE $${i} OR cnpj ILIKE $${i + 1})`)
      params.push(`%${q}%`, `%${cnpjLimpo}%`)
      i += 2
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const rows = await query(
      `SELECT *, COUNT(*) OVER() AS total_count FROM leads ${where} ORDER BY valor_divida ${order} LIMIT $${i} OFFSET $${i + 1}`,
      [...params, limit, offset]
    )

    const total = rows.length > 0 ? parseInt(String(rows[0].total_count), 10) : 0
    const data = rows.map(({ total_count: _, ...r }) => r)
    return NextResponse.json({ data, total, page })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro interno'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
