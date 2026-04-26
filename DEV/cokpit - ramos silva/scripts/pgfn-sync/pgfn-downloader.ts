import axios from 'axios'
import { Readable } from 'stream'

const PGFN_PAGE_URL =
  'https://www.gov.br/pgfn/pt-br/assuntos/divida-ativa-da-uniao/transparencia-fiscal-1/dados-abertos'

const BASE_GOV_URL = 'https://www.gov.br'

export type Categoria = 'nao_previdenciario' | 'previdenciario' | 'fgts' | 'nao_tributario'

function detectarCategoria(nome: string): Categoria {
  const n = nome.toLowerCase()
  if (n.includes('fgts')) return 'fgts'
  if (n.includes('nao_tribut') || n.includes('nao-tribut') || n.includes('naotribut') || n.includes('multa')) return 'nao_tributario'
  // verifica nao_previdenciario ANTES de previdenciario (pois contém a mesma substring)
  if (n.includes('nao') && n.includes('previd')) return 'nao_previdenciario'
  if (n.includes('previd')) return 'previdenciario'
  return 'nao_previdenciario'
}

export interface PgfnFile {
  url: string
  nome: string
  categoria: Categoria
}

function extrairTrimestre(url: string): { ano: number; trim: number } | null {
  const m = url.match(/(\d{4})_trimestre_0?(\d)/)
  if (!m) return null
  return { ano: parseInt(m[1]), trim: parseInt(m[2]) }
}

export async function listarArquivosPgfn(): Promise<PgfnFile[]> {
  const { data: html } = await axios.get<string>(PGFN_PAGE_URL, {
    timeout: 30_000,
    headers: { 'User-Agent': 'CockpitRamosSilva/1.0 (sync@cockpit.local)' },
  })

  const hrefRegex = /href="([^"]+\.(?:csv|zip)[^"]*)"/gi
  const found = new Set<string>()
  let match: RegExpExecArray | null

  while ((match = hrefRegex.exec(html)) !== null) {
    let url = match[1]
    if (url.startsWith('/')) url = BASE_GOV_URL + url
    if (url.includes('pgfn') || url.includes('divida') || url.includes('dados')) {
      found.add(url)
    }
  }

  if (found.size === 0) {
    throw new Error('Nenhum arquivo CSV/ZIP encontrado na página PGFN. A estrutura da página pode ter mudado.')
  }

  // Filtra apenas o trimestre mais recente para evitar reprocessar histórico
  const urls = Array.from(found)
  const comTrimestre = urls.filter((u) => extrairTrimestre(u) !== null)
  const semTrimestre = urls.filter((u) => extrairTrimestre(u) === null)

  let resultado = semTrimestre

  if (comTrimestre.length > 0) {
    const maisRecente = comTrimestre.reduce((best, u) => {
      const a = extrairTrimestre(best)!
      const b = extrairTrimestre(u)!
      return b.ano > a.ano || (b.ano === a.ano && b.trim > a.trim) ? u : best
    })
    const ref = extrairTrimestre(maisRecente)!
    const doUltimoTrim = comTrimestre.filter((u) => {
      const t = extrairTrimestre(u)!
      return t.ano === ref.ano && t.trim === ref.trim
    })
    resultado = [...resultado, ...doUltimoTrim]
  }

  return resultado.map((url) => {
    const nome = url.split('/').pop() ?? url
    return { url, nome, categoria: detectarCategoria(nome) }
  })
}

export async function downloadStream(url: string): Promise<Readable> {
  const response = await axios.get(url, {
    responseType: 'stream',
    timeout: 120_000,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    headers: { 'User-Agent': 'CockpitRamosSilva/1.0 (sync@cockpit.local)' },
  })
  return response.data as Readable
}
