import { Pool } from 'pg'
import { Categoria } from './pgfn-downloader.js'

export interface UpsertResult {
  novos: number
  atualizados: number
}

export interface AccumulatedLead {
  cnpj: string
  nome_empresa: string
  uf: string | null
  categorias: Partial<Record<Categoria, number>>
}

let _pool: Pool | null = null

function getPool(): Pool {
  if (!_pool) {
    const url = process.env.DATABASE_URL
    if (!url) throw new Error('DATABASE_URL é obrigatório')
    _pool = new Pool({ connectionString: url, ssl: false, max: 3 })
  }
  return _pool
}

function classificar(valor: number): 'A' | 'B' | 'C' {
  if (valor >= 3_000_000) return 'A'
  if (valor >= 1_000_000) return 'B'
  return 'C'
}

export async function upsertAcumulado(
  acumulador: Map<string, AccumulatedLead>,
  batchSize = 200
): Promise<UpsertResult> {
  const pool = getPool()
  const leads = Array.from(acumulador.values())

  if (leads.length === 0) return { novos: 0, atualizados: 0 }

  // Conta novos vs existentes
  const cnpjs = leads.map((r) => r.cnpj)
  const existentesRes = await pool.query<{ cnpj: string }>(
    'SELECT cnpj FROM leads WHERE cnpj = ANY($1)',
    [cnpjs]
  )
  const cnpjsExistentes = new Set(existentesRes.rows.map((r) => r.cnpj))
  let totalNovos = leads.filter((r) => !cnpjsExistentes.has(r.cnpj)).length
  const totalAtualizados = leads.length - totalNovos

  // Upsert em batches
  for (let i = 0; i < leads.length; i += batchSize) {
    const batch = leads.slice(i, i + batchSize)
    await upsertBatch(pool, batch)
    process.stdout.write(`\r  → ${Math.min(i + batchSize, leads.length)} / ${leads.length} upsertados`)
  }
  console.log()

  return { novos: totalNovos, atualizados: totalAtualizados }
}

async function upsertBatch(pool: Pool, rows: AccumulatedLead[]): Promise<void> {
  const values = rows.map((r) => {
    const valorTotal = Object.values(r.categorias).reduce((s, v) => s + (v ?? 0), 0)
    const pgfnRaw = JSON.stringify(r.categorias)
    const classificacao = classificar(valorTotal)
    const nomeEscapado = r.nome_empresa.replace(/'/g, "''")
    const uf = r.uf ? `'${r.uf}'` : 'NULL'
    return `('${r.cnpj}','${nomeEscapado}',${valorTotal},'${classificacao}',${uf},'${pgfnRaw}'::jsonb,NOW())`
  }).join(',')

  let lastError: Error | null = null
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await pool.query(`
        INSERT INTO leads (cnpj, nome_empresa, valor_divida, classificacao, uf, pgfn_raw, updated_at)
        VALUES ${values}
        ON CONFLICT (cnpj) DO UPDATE SET
          nome_empresa   = EXCLUDED.nome_empresa,
          valor_divida   = EXCLUDED.valor_divida,
          classificacao  = EXCLUDED.classificacao,
          uf             = EXCLUDED.uf,
          pgfn_raw       = EXCLUDED.pgfn_raw,
          updated_at     = EXCLUDED.updated_at
      `)
      return
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      if (attempt < 3) await new Promise((r) => setTimeout(r, attempt * 2000))
    }
  }
  throw lastError!
}

export async function criarSyncLog(): Promise<string> {
  const pool = getPool()
  const res = await pool.query<{ id: string }>(
    "INSERT INTO sync_logs (status) VALUES ('em_andamento') RETURNING id"
  )
  if (!res.rows[0]) throw new Error('Falha ao criar sync_log')
  return res.rows[0].id
}

export async function atualizarSyncLog(
  id: string,
  status: 'sucesso' | 'falha',
  contadores: { qtd_novos: number; qtd_atualizados: number; qtd_ignorados: number },
  erro?: string
): Promise<void> {
  const pool = getPool()
  await pool.query(
    `UPDATE sync_logs SET status = $2, concluido_em = NOW(), qtd_novos = $3, qtd_atualizados = $4, qtd_ignorados = $5, erro = $6 WHERE id = $1`,
    [id, status, contadores.qtd_novos, contadores.qtd_atualizados, contadores.qtd_ignorados, erro ?? null]
  )
}
