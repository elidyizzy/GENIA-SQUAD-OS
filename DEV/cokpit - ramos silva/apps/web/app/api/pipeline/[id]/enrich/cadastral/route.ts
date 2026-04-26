import { NextResponse } from 'next/server'
import { queryOne, query } from '@/lib/db'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const pl = await queryOne<{ cnpj: string; nome_empresa: string }>(
      'SELECT l.cnpj, l.nome_empresa FROM pipeline_leads pl JOIN leads l ON l.id = pl.lead_id WHERE pl.id = $1',
      [id]
    )
    if (!pl) return NextResponse.json({ error: 'Pipeline lead não encontrado' }, { status: 404 })

    const cnpj = pl.cnpj.replace(/\D/g, '')
    let enrichStatus: 'sucesso' | 'erro' = 'sucesso'
    let dados: Record<string, unknown> = {}
    let erro: string | null = null

    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10_000)

      // CNPJ.ws aceita requests de datacenter; BrasilAPI bloqueia IPs de servidor
      let res = await fetch(`https://publica.cnpj.ws/cnpj/${cnpj}`, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json', 'User-Agent': 'CockpitRamosSilva/1.0' },
      })
      if (!res.ok) {
        // fallback para BrasilAPI
        res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`, {
          headers: { 'Accept': 'application/json', 'User-Agent': 'CockpitRamosSilva/1.0' },
        })
      }
      clearTimeout(timeout)

      if (res.status === 404) {
        enrichStatus = 'erro'; erro = 'CNPJ não encontrado na Receita Federal'
      } else if (!res.ok) {
        enrichStatus = 'erro'; erro = `Receita Federal indisponível (status ${res.status})`
      } else {
        const raw = await res.json()
        // CNPJ.ws tem estrutura aninhada (estabelecimento, socios); BrasilAPI é flat
        const isCnpjWs = !!raw.estabelecimento
        const est = raw.estabelecimento ?? {}
        const logradouro = est.logradouro ?? raw.logradouro ?? ''
        const numero = est.numero ?? raw.numero ?? ''
        const complemento = est.complemento ?? raw.complemento ?? ''
        const bairro = est.bairro ?? raw.bairro ?? ''
        const municipio = est.municipio?.nome ?? raw.municipio ?? ''
        const uf = est.estado?.sigla ?? raw.uf ?? ''
        const cep = est.cep ?? raw.cep ?? ''
        const situacao = est.situacao_cadastral
          ?? raw.situacao_cadastral?.descricao
          ?? raw.descricao_situacao_cadastral
          ?? String(raw.situacao_cadastral ?? '')
        const qsa = isCnpjWs
          ? (raw.socios ?? []).map((s: { nome?: string; qualificacao?: { descricao?: string } }) => ({
              nome_socio: s.nome, qualificacao_socio: s.qualificacao?.descricao ?? '',
            }))
          : (raw.qsa ?? [])
        dados = {
          razao_social: raw.razao_social,
          situacao_cadastral: situacao,
          cnae_fiscal: raw.cnae_fiscal_principal?.id ?? raw.cnae_fiscal ?? '',
          cnae_fiscal_descricao: raw.cnae_fiscal_principal?.descricao ?? raw.cnae_fiscal_descricao ?? '',
          capital_social: raw.capital_social,
          qsa,
          logradouro, numero, complemento, bairro, municipio, uf, cep,
          endereco_completo: [logradouro, numero, complemento, bairro, municipio, uf].filter(Boolean).join(', '),
        }
      }
    } catch (e) {
      enrichStatus = 'erro'; erro = e instanceof Error ? e.message : 'Erro ao consultar BrasilAPI'
    }

    await query(
      `INSERT INTO enrichments (pipeline_lead_id, tipo, status, dados, erro, updated_at)
       VALUES ($1, 'cadastral', $2, $3, $4, NOW())
       ON CONFLICT (pipeline_lead_id, tipo) DO UPDATE SET status = $2, dados = $3, erro = $4, updated_at = NOW()`,
      [id, enrichStatus, enrichStatus === 'sucesso' ? JSON.stringify(dados) : null, erro]
    )

    if (enrichStatus === 'erro') return NextResponse.json({ error: erro }, { status: 422 })
    return NextResponse.json({ ok: true, dados })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Erro interno' }, { status: 500 })
  }
}
