import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { normalizarCnpj } from '@/lib/formatters'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit = Math.min(100, parseInt(searchParams.get('limit') ?? '100'))
  const uf = searchParams.get('uf')
  const classificacao = searchParams.get('classificacao')
  const status = searchParams.get('status')
  const q = searchParams.get('q')?.trim()
  const order = searchParams.get('order') === 'asc' ? 'asc' : 'desc'
  const offset = (page - 1) * limit

  try {
    const supabase = createServerClient()
    let query = supabase.from('leads').select('*', { count: 'exact' })

    if (uf) query = query.eq('uf', uf)
    if (classificacao) query = query.eq('classificacao', classificacao)
    if (status) query = query.eq('status', status)
    if (q) {
      const cnpjLimpo = normalizarCnpj(q)
      query = query.or(`nome_empresa.ilike.%${q}%,cnpj.ilike.%${cnpjLimpo}%`)
    }

    query = query
      .order('valor_divida', { ascending: order === 'asc' })
      .range(offset, offset + limit - 1)

    const { data, count, error } = await query
    if (error) throw error

    return NextResponse.json({ data: data ?? [], total: count ?? 0, page })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro interno'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
