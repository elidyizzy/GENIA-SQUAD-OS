import { Pool, QueryResultRow } from 'pg'

const g = global as unknown as { _pool?: Pool }

if (!g._pool) {
  g._pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  })
}

const pool = g._pool

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const result = await pool.query<T>(text, params)
  return result.rows
}

export async function queryOne<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<T | null> {
  const result = await pool.query<T>(text, params)
  return result.rows[0] ?? null
}

export async function queryCount(text: string, params?: unknown[]): Promise<number> {
  const result = await pool.query(text, params)
  return parseInt(result.rows[0]?.count ?? '0', 10)
}
