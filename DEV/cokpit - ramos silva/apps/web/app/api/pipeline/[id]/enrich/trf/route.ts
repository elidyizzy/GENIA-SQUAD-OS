import { NextResponse } from 'next/server'
import { queryOne, query } from '@/lib/db'
import { buscarProcessosTRF, calcularRisco } from '@/lib/services/trf'

export const maxDuration = 60

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const pl = await queryOne<{ cnpj: string; uf: string | null }>(
      'SELECT l.cnpj, l.uf FROM pipeline_leads pl JOIN leads l ON l.id = pl.lead_id WHERE pl.id = $1',
      [id]
    )
    if (!pl) return NextResponse.json({ error: 'Pipeline lead não encontrado' }, { status: 404 })
    if (!pl.uf) return NextResponse.json({ error: 'UF do lead não disponível' }, { status: 422 })

    const resultado = await buscarProcessosTRF(pl.uf, pl.cnpj)
    const risco = resultado.disponivel ? calcularRisco(resultado.processos.length) : null
    const dados = { disponivel: resultado.disponivel, trf: resultado.trf, processos: resultado.processos, risco, uf: pl.uf }
    const enrichStatus = resultado.disponivel ? 'sucesso' : 'erro'
    const erro = resultado.disponivel ? null : `${resultado.trf} indisponível no momento`

    await query(
      `INSERT INTO enrichments (pipeline_lead_id, tipo, status, dados, erro, updated_at)
       VALUES ($1, 'trf', $2, $3, $4, NOW())
       ON CONFLICT (pipeline_lead_id, tipo) DO UPDATE SET status = $2, dados = $3, erro = $4, updated_at = NOW()`,
      [id, enrichStatus, JSON.stringify(dados), erro]
    )

    return NextResponse.json({ ok: true, dados })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Erro interno' }, { status: 500 })
  }
}
