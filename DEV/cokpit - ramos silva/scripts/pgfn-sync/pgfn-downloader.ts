import axios from 'axios'
import { Readable } from 'stream'

const PGFN_PAGE_URL =
  'https://www.gov.br/pgfn/pt-br/assuntos/divida-ativa-da-uniao/transparencia-fiscal-1/dados-abertos'

const BASE_GOV_URL = 'https://www.gov.br'

export interface PgfnFile {
  url: string
  nome: string
}

export async function listarArquivosPgfn(): Promise<PgfnFile[]> {
  const { data: html } = await axios.get<string>(PGFN_PAGE_URL, {
    timeout: 30_000,
    headers: { 'User-Agent': 'CockpitRamosSilva/1.0 (sync@cockpit.local)' },
  })

  // Extrai todos os hrefs que apontam para arquivos CSV ou ZIP da PGFN
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

  return Array.from(found).map((url) => ({
    url,
    nome: url.split('/').pop() ?? url,
  }))
}

export async function downloadStream(url: string): Promise<Readable> {
  const response = await axios.get(url, {
    responseType: 'stream',
    timeout: 30_000,
    headers: { 'User-Agent': 'CockpitRamosSilva/1.0 (sync@cockpit.local)' },
  })
  return response.data as Readable
}
