import { Pool } from 'pg'
import { LeadRow } from './csv-parser.js'

export interface UpsertResult {
  novos: number
  atualizados: number
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

export async function upsertBatch(rows: LeadRow[]): Promise<UpsertResult> {
  const pool = getPool()

  // Deduplica por CNPJ somando dívidas
  const porCnpj = new Map<string, typeof rows[0]>()
  for (const r of rows) {
    const existing = porCnpj.get(r.cnpj)
    if (!existing) porCnpj.set(r.cnpj, { ...r })
    else existing.valor_divida += r.valor_divida
  }
  const reclassificar = (v: number): 'A' | 'B' | 'C' => v >= 3_000_000 ? 'A' : v >= 1_000_000 ? 'B' : 'C'
  const deduplicated = Array.from(porCnpj.values()).map((r) => ({ ...r, classificacao: reclassificar(r.valor_divida) }))

  // Conta novos vs existentes
  const cnpjs = deduplicated.map((r) => r.cnpj)
  const existentesRes = await pool.query<{ cnpj: string }>(
    'SELECT cnpj FROM leads WHERE cnpj = ANY($1)', [cnpjs]
  )
  const cnpjsExistentes = new Set(existentesRes.rows.map((r) => r.cnpj))
  const novos = deduplicated.filter((r) => !cnpjsExistentes.has(r.cnpj)).length
  const atualizados = deduplicated.length - novos

  // Upsert com retry
  const values = deduplicated.map((r) =>
    `('${r.cnpj}','${r.nome_empresa.replace(/'/g, "''")}',${r.valor_divida},'${r.uf ?? ''}','${r.classificacao}',NOW())`
  ).join(',')

  let lastError: Error | null = null
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await pool.query(`
        INSERT INTO leads (cnpj, nome_empresa, valor_divida, uf, classificacao, updated_at)
        VALUES ${values}
        ON CONFLICT (cnpj) DO UPDATE SET
          nome_empresa = EXCLUDED.nome_empresa,
          valor_divida = EXCLUDED.valor_divida,
          uf = EXCLUDED.uf,
          classificacao = EXCLUDED.classificacao,
          updated_at = EXCLUDED.updated_at
      `)
      return { novos, atualizados }
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
