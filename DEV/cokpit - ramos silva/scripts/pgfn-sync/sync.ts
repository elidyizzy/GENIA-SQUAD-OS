import { listarArquivosPgfn, downloadStream, Categoria } from './pgfn-downloader.js'
import { parseCsvStream, LeadRow } from './csv-parser.js'
import {
  upsertAcumulado,
  criarSyncLog,
  atualizarSyncLog,
  AccumulatedLead,
} from './supabase-upsert.js'
import unzipper from 'unzipper'
import { createWriteStream, unlink } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { pipeline } from 'stream/promises'

const DIVIDA_MINIMA = parseInt(process.env.PGFN_DIVIDA_MINIMA ?? '1000000', 10)

async function downloadToTemp(url: string, nome: string): Promise<string> {
  const tmpPath = join(tmpdir(), `pgfn-${Date.now()}-${nome}`)
  console.log(`  Salvando em ${tmpPath}...`)
  const stream = await downloadStream(url)
  const file = createWriteStream(tmpPath)
  let downloaded = 0
  stream.on('data', (chunk: Buffer) => {
    downloaded += chunk.length
    process.stdout.write(`\r  Baixado: ${Math.round(downloaded / 1024 / 1024)}MB`)
  })
  await pipeline(stream, file)
  console.log(`\n  Download completo: ${Math.round(downloaded / 1024 / 1024)}MB`)
  return tmpPath
}

function acumularRow(acumulador: Map<string, AccumulatedLead>, row: LeadRow): void {
  const existing = acumulador.get(row.cnpj)
  if (!existing) {
    acumulador.set(row.cnpj, {
      cnpj: row.cnpj,
      nome_empresa: row.nome_empresa,
      uf: row.uf,
      categorias: { [row.categoria]: row.valor_divida },
    })
  } else {
    existing.nome_empresa = row.nome_empresa
    if (existing.uf === null) existing.uf = row.uf
    existing.categorias[row.categoria] =
      (existing.categorias[row.categoria] ?? 0) + row.valor_divida
  }
}

async function processarArquivo(
  url: string,
  nome: string,
  categoria: Categoria,
  acumulador: Map<string, AccumulatedLead>
): Promise<{ processados: number; ignorados: number }> {
  console.log(`\n[PGFN] Processando: ${nome} (${categoria})`)
  const isZip = nome.toLowerCase().endsWith('.zip')

  const onBatch = async (batch: LeadRow[]) => {
    for (const row of batch) acumularRow(acumulador, row)
    process.stdout.write(`\r  → ${acumulador.size} CNPJs acumulados`)
  }

  let processados: number
  let ignorados: number

  if (!isZip) {
    const rawStream = await downloadStream(url)
    ;({ processados, ignorados } = await parseCsvStream(rawStream, DIVIDA_MINIMA, categoria, onBatch))
  } else {
    const tmpPath = await downloadToTemp(url, nome)
    processados = 0
    ignorados = 0
    try {
      const directory = await unzipper.Open.file(tmpPath)
      const csvEntries = directory.files.filter((f) => f.path.toLowerCase().endsWith('.csv'))
      if (csvEntries.length === 0) throw new Error('Nenhum CSV encontrado dentro do ZIP')
      console.log(`  ${csvEntries.length} arquivo(s) CSV no ZIP`)
      for (const csvEntry of csvEntries) {
        console.log(`\n  Parseando: ${csvEntry.path} (${Math.round(csvEntry.uncompressedSize / 1024 / 1024)}MB)`)
        const result = await parseCsvStream(csvEntry.stream(), DIVIDA_MINIMA, categoria, onBatch)
        processados += result.processados
        ignorados += result.ignorados
      }
    } finally {
      unlink(tmpPath, () => {})
    }
  }

  console.log(
    `\n[PGFN] ${nome} concluído: ${processados} processados, ${ignorados} ignorados (abaixo de R$${DIVIDA_MINIMA.toLocaleString('pt-BR')})`
  )

  return { processados, ignorados }
}

async function main() {
  console.log('[PGFN Sync] Iniciando...')
  console.log(`[PGFN Sync] Valor mínimo de dívida: R$ ${DIVIDA_MINIMA.toLocaleString('pt-BR')}`)

  const syncLogId = await criarSyncLog()
  console.log(`[PGFN Sync] Log ID: ${syncLogId}`)

  let arquivos
  try {
    arquivos = await listarArquivosPgfn()
    console.log(`[PGFN Sync] ${arquivos.length} arquivo(s) encontrado(s)`)
    for (const a of arquivos) console.log(`  • ${a.nome} → categoria: ${a.categoria}`)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`[PGFN Sync] Falha ao listar arquivos: ${msg}`)
    await atualizarSyncLog(syncLogId, 'falha', { qtd_novos: 0, qtd_atualizados: 0, qtd_ignorados: 0 }, msg)
    process.exit(1)
  }

  // Acumulador global: um registro por CNPJ com todas as categorias
  const acumulador = new Map<string, AccumulatedLead>()

  let totalProcessados = 0
  let totalIgnorados = 0
  const erros: string[] = []

  for (const arquivo of arquivos) {
    try {
      const resultado = await processarArquivo(arquivo.url, arquivo.nome, arquivo.categoria, acumulador)
      totalProcessados += resultado.processados
      totalIgnorados += resultado.ignorados
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`\n[PGFN Sync] ERRO em ${arquivo.nome}: ${msg}`)
      erros.push(`${arquivo.nome}: ${msg}`)
    }
  }

  console.log(`\n[PGFN Sync] Acumulador: ${acumulador.size} CNPJs únicos com dívida >= R$${DIVIDA_MINIMA.toLocaleString('pt-BR')}`)
  console.log('[PGFN Sync] Executando upsert final no banco...')

  let totalNovos = 0
  let totalAtualizados = 0

  try {
    const resultado = await upsertAcumulado(acumulador)
    totalNovos = resultado.novos
    totalAtualizados = resultado.atualizados
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`[PGFN Sync] ERRO no upsert final: ${msg}`)
    erros.push(`upsert_final: ${msg}`)
  }

  const status = erros.length > 0 && totalNovos + totalAtualizados === 0 ? 'falha' : 'sucesso'
  const erroTexto = erros.length > 0 ? erros.join('\n') : undefined

  await atualizarSyncLog(
    syncLogId,
    status,
    { qtd_novos: totalNovos, qtd_atualizados: totalAtualizados, qtd_ignorados: totalIgnorados },
    erroTexto
  )

  console.log('\n[PGFN Sync] Concluído!')
  console.log(`  Status: ${status}`)
  console.log(`  Novos: ${totalNovos}`)
  console.log(`  Atualizados: ${totalAtualizados}`)
  console.log(`  Ignorados: ${totalIgnorados}`)
  if (erros.length > 0) console.log(`  Erros: ${erros.length}`)

  process.exit(status === 'falha' ? 1 : 0)
}

main().catch((err) => {
  console.error('[PGFN Sync] Erro fatal:', err)
  process.exit(1)
})
