export interface Processo {
  numero: string
  tipo: 'execucao_fiscal' | 'embargo' | 'mandado' | 'outro'
  tribunal: string
  data: string
}

export interface TRFResult {
  disponivel: boolean
  processos: Processo[]
  trf: string
}

const UF_TO_TRF: Record<string, string> = {
  // TRF1 — sede em Brasília (13 estados + DF)
  AC: 'trf1', AM: 'trf1', AP: 'trf1', BA: 'trf1', DF: 'trf1',
  GO: 'trf1', MA: 'trf1', MT: 'trf1', PA: 'trf1', PI: 'trf1',
  RO: 'trf1', RR: 'trf1', TO: 'trf1',
  // TRF2 — sede no Rio de Janeiro
  ES: 'trf2', RJ: 'trf2',
  // TRF3 — sede em São Paulo
  MS: 'trf3', SP: 'trf3',
  // TRF4 — sede em Porto Alegre
  PR: 'trf4', RS: 'trf4', SC: 'trf4',
  // TRF5 — sede em Recife
  AL: 'trf5', CE: 'trf5', PB: 'trf5', PE: 'trf5', RN: 'trf5', SE: 'trf5',
  // TRF6 — sede em Belo Horizonte
  MG: 'trf6',
}

const TRF_NOME: Record<string, string> = {
  trf1: 'TRF 1ª Região',
  trf2: 'TRF 2ª Região',
  trf3: 'TRF 3ª Região',
  trf4: 'TRF 4ª Região',
  trf5: 'TRF 5ª Região',
  trf6: 'TRF 6ª Região',
}

const DATAJUD_API_KEY = 'cDZHYzlZa0JadVREZDJCendQbXY6SkJlTzNjLV9TRENyQk1RdnFKZGRQdw=='

interface DataJudHit {
  _source: {
    numeroProcesso?: string
    tribunal?: string
    dataAjuizamento?: string
    classe?: { nome?: string }
    assuntos?: Array<{ nome?: string }>
  }
}

interface DataJudResponse {
  hits?: { hits?: DataJudHit[] }
}

export function getTRFPorUF(uf: string): string {
  return UF_TO_TRF[uf.toUpperCase()] ?? 'trf1'
}

function detectarTipo(texto: string): Processo['tipo'] {
  const t = texto.toLowerCase()
  if (t.includes('execução fiscal') || t.includes('execucao fiscal')) return 'execucao_fiscal'
  if (t.includes('embargo')) return 'embargo'
  if (t.includes('mandado') || t.includes('mandamus')) return 'mandado'
  return 'outro'
}

async function fetchComTimeout(url: string, options: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

async function buscarDataJud(trfId: string, cnpj: string): Promise<TRFResult> {
  const tribunal = TRF_NOME[trfId] ?? trfId.toUpperCase()
  const cnpjLimpo = cnpj.replace(/\D/g, '')
  const endpoint = `https://api-publica.datajud.cnj.jus.br/api_publica_${trfId}/_search`

  try {
    const res = await fetchComTimeout(
      endpoint,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `APIKey ${DATAJUD_API_KEY}`,
        },
        body: JSON.stringify({
          query: {
            nested: {
              path: 'partes',
              query: { match: { 'partes.documento': cnpjLimpo } },
            },
          },
          size: 20,
          _source: ['numeroProcesso', 'tribunal', 'dataAjuizamento', 'classe', 'assuntos'],
        }),
      },
      15_000
    )

    if (!res.ok) return { disponivel: false, processos: [], trf: tribunal }

    const data = await res.json() as DataJudResponse
    const hits = data.hits?.hits ?? []

    const processos: Processo[] = hits
      .map((hit) => {
        const src = hit._source
        const classeNome = src.classe?.nome ?? ''
        const dataRaw = src.dataAjuizamento ?? ''
        const dataFormatada = dataRaw
          ? new Date(dataRaw).toLocaleDateString('pt-BR')
          : new Date().toLocaleDateString('pt-BR')
        return {
          numero: src.numeroProcesso ?? '',
          tipo: detectarTipo(classeNome),
          tribunal: src.tribunal ?? tribunal,
          data: dataFormatada,
        }
      })
      .filter((p) => p.numero.length > 0)

    return { disponivel: true, processos, trf: tribunal }
  } catch {
    return { disponivel: false, processos: [], trf: tribunal }
  }
}

export async function buscarProcessosTRF(uf: string, cnpj: string): Promise<TRFResult> {
  const trfId = getTRFPorUF(uf)
  return buscarDataJud(trfId, cnpj)
}

export function calcularRisco(qtd: number): 'baixo' | 'medio' | 'alto' {
  if (qtd === 0) return 'baixo'
  if (qtd <= 3) return 'medio'
  return 'alto'
}
