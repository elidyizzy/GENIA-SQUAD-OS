import { listarArquivosPgfn, downloadStream } from './pgfn-downloader.js'
import { parseCsvStream } from './csv-parser.js'
import {
  upsertBatch,
  criarSyncLog,
  atualizarSyncLog,
  UpsertResult,
} from './supabase-upsert.js'

const DIVIDA_MINIMA = parseInt(process.env.PGFN_DIVIDA_MINIMA ?? '1000000', 10)

async function processarArquivo(
  url: string,
  nome: string
): Promise<{ processados: number; ignorados: number; novos: number; atualizados: number }> {
  console.log(`\n[PGFN] Baixando: ${nome}`)
  const stream = await downloadStream(url)

  let totalNovos = 0
  let totalAtualizados = 0

  const { processados, ignorados } = await parseCsvStream(
    stream,
    DIVIDA_MINIMA,
    async (batch) => {
      const resultado: UpsertResult = await upsertBatch(batch)
      totalNovos += resultado.novos
      totalAtualizados += resultado.atualizados
      process.stdout.write(
        `\r  → upsert batch: ${batch.length} registros (${totalNovos} novos, ${totalAtualizados} atualizados)`
      )
    }
  )

  console.log(
    `\n[PGFN] ${nome} concluído: ${processados} processados, ${ignorados} ignorados (abaixo do mínimo R$${DIVIDA_MINIMA.toLocaleString('pt-BR')})`
  )

  return { processados, ignorados, novos: totalNovos, atualizados: totalAtualizados }
}

async function main() {
  console.log('[PGFN Sync] Iniciando...')
  console.log(`[PGFN Sync] Valor mínimo de dívida: R$ ${DIVIDA_MINIMA.toLocaleString('pt-BR')}`)

  const syncLogId = await criarSyncLog()
  console.log(`[PGFN Sync] Log ID: ${syncLogId}`)

  let arquivos
  try {
    arquivos = await listarArquivosPgfn()
    console.log(`[PGFN Sync] ${arquivos.length} arquivo(s) encontrado(s) na página PGFN`)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`[PGFN Sync] Falha ao listar arquivos: ${msg}`)
    await atualizarSyncLog(syncLogId, 'falha', { qtd_novos: 0, qtd_atualizados: 0, qtd_ignorados: 0 }, msg)
    process.exit(1)
  }

  let totalNovos = 0
  let totalAtualizados = 0
  let totalIgnorados = 0
  const erros: string[] = []

  for (const arquivo of arquivos) {
    try {
      const resultado = await processarArquivo(arquivo.url, arquivo.nome)
      totalNovos += resultado.novos
      totalAtualizados += resultado.atualizados
      totalIgnorados += resultado.ignorados
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      const erroFormatado = `${arquivo.nome}: ${msg}`
      console.error(`\n[PGFN Sync] ERRO em ${arquivo.nome}: ${msg}`)
      erros.push(erroFormatado)
      // Continua para o próximo arquivo — falha isolada
    }
  }

  const status = erros.length === arquivos.length ? 'falha' : 'sucesso'
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
  if (erros.length > 0) console.log(`  Erros: ${erros.length} arquivo(s)`)

  process.exit(status === 'falha' ? 1 : 0)
}

main().catch((err) => {
  console.error('[PGFN Sync] Erro fatal:', err)
  process.exit(1)
})
