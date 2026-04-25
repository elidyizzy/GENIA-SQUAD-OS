import csvParser from 'csv-parser'
import iconv from 'iconv-lite'
import { Readable } from 'stream'

export interface LeadRow {
  cnpj: string
  nome_empresa: string
  valor_divida: number
  uf: string | null
  classificacao: 'A' | 'B' | 'C'
}

function classificar(valor: number): 'A' | 'B' | 'C' {
  if (valor >= 3_000_000) return 'A'
  if (valor >= 1_000_000) return 'B'
  return 'C'
}

function normalizarCnpj(raw: string): string {
  return raw.replace(/[.\-\/]/g, '').trim().padStart(14, '0')
}

function parseMoeda(raw: string): number {
  // Suporta formatos: "1.234.567,89" (BR) e "1234567.89" (US)
  const limpo = raw.trim().replace(/\./g, '').replace(',', '.')
  return parseFloat(limpo) || 0
}

// Mapeamento flexível de colunas — o PGFN pode variar nomes entre versões
const COLUNA_CNPJ = ['CNPJ_DO_DEVEDOR', 'CNPJ', 'CPF_CNPJ']
const COLUNA_NOME = ['NOME_DO_DEVEDOR', 'NOME_DEVEDOR', 'NOME', 'NOME_FANTASIA']
const COLUNA_VALOR = ['VALOR_CONSOLIDADO', 'VL_TOTAL_DIVIDA', 'VALOR_DIVIDA']
const COLUNA_UF = ['UF_UNIDADE_RESPONSAVEL', 'UF', 'UF_DEVEDOR']

function encontrarColuna(row: Record<string, string>, candidatos: string[]): string | undefined {
  const keys = Object.keys(row)
  for (const c of candidatos) {
    const found = keys.find((k) => k.toUpperCase().includes(c))
    if (found) return found
  }
  return undefined
}

export async function parseCsvStream(
  stream: Readable,
  dividaMinima: number,
  onBatch: (rows: LeadRow[]) => Promise<void>,
  batchSize = 100
): Promise<{ processados: number; ignorados: number }> {
  let processados = 0
  let ignorados = 0
  let batch: LeadRow[] = []
  let colCnpj: string | undefined
  let colNome: string | undefined
  let colValor: string | undefined
  let colUf: string | undefined
  let cabecalhoMapeado = false

  const decodedStream = stream.pipe(iconv.decodeStream('latin1'))

  return new Promise((resolve, reject) => {
    const csvStream = decodedStream.pipe(csvParser({ separator: ';', skipLines: 0 }))

    const processRow = (row: Record<string, string>) => {
      if (!cabecalhoMapeado) {
        colCnpj = encontrarColuna(row, COLUNA_CNPJ)
        colNome = encontrarColuna(row, COLUNA_NOME)
        colValor = encontrarColuna(row, COLUNA_VALOR)
        colUf = encontrarColuna(row, COLUNA_UF)
        cabecalhoMapeado = true

        if (!colCnpj || !colNome || !colValor) {
          reject(
            new Error(
              `Colunas obrigatórias não encontradas. Colunas disponíveis: ${Object.keys(row).join(', ')}`
            )
          )
          return
        }
      }

      const valorRaw = row[colValor!] ?? '0'
      const valor = parseMoeda(valorRaw)

      if (valor < dividaMinima) {
        ignorados++
        return
      }

      const cnpj = normalizarCnpj(row[colCnpj!] ?? '')
      if (cnpj.length !== 14) {
        ignorados++
        return
      }

      batch.push({
        cnpj,
        nome_empresa: (row[colNome!] ?? '').trim().substring(0, 500),
        valor_divida: valor,
        uf: colUf ? (row[colUf] ?? '').trim().substring(0, 2) || null : null,
        classificacao: classificar(valor),
      })

      if (batch.length >= batchSize) {
        const currentBatch = batch
        batch = []
        // Pausa o stream para evitar acúmulo de memória durante o upsert
        csvStream.pause()
        onBatch(currentBatch)
          .then(() => {
            processados += currentBatch.length
            csvStream.resume()
          })
          .catch(reject)
      }
    }

    csvStream
      .on('data', processRow)
      .on('end', () => {
        if (batch.length > 0) {
          onBatch(batch)
            .then(() => {
              processados += batch.length
              resolve({ processados, ignorados })
            })
            .catch(reject)
        } else {
          resolve({ processados, ignorados })
        }
      })
      .on('error', reject)
  })
}
