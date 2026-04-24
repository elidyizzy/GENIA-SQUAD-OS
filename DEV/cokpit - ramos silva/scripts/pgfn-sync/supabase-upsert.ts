import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { LeadRow } from './csv-parser.js'

export interface UpsertResult {
  novos: number
  atualizados: number
}

let _client: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (!_client) {
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_KEY
    if (!url || !key) throw new Error('SUPABASE_URL e SUPABASE_SERVICE_KEY são obrigatórios')
    _client = createClient(url, key, { auth: { persistSession: false } })
  }
  return _client
}

export async function upsertBatch(rows: LeadRow[]): Promise<UpsertResult> {
  const supabase = getSupabaseClient()

  // Verificar quais CNPJs já existem para contar novos vs atualizados
  const cnpjs = rows.map((r) => r.cnpj)
  const { data: existentes } = await supabase
    .from('leads')
    .select('cnpj')
    .in('cnpj', cnpjs)

  const cnpjsExistentes = new Set((existentes ?? []).map((r: { cnpj: string }) => r.cnpj))
  const novos = rows.filter((r) => !cnpjsExistentes.has(r.cnpj)).length
  const atualizados = rows.length - novos

  const payload = rows.map((r) => ({
    cnpj: r.cnpj,
    nome_empresa: r.nome_empresa,
    valor_divida: r.valor_divida,
    uf: r.uf,
    classificacao: r.classificacao,
    updated_at: new Date().toISOString(),
  }))

  const { error } = await supabase
    .from('leads')
    .upsert(payload, { onConflict: 'cnpj' })

  if (error) throw new Error(`Falha no upsert: ${error.message}`)

  return { novos, atualizados }
}

export async function criarSyncLog(): Promise<string> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('sync_logs')
    .insert({ status: 'em_andamento' })
    .select('id')
    .single()

  if (error || !data) throw new Error(`Falha ao criar sync_log: ${error?.message}`)
  return data.id
}

export async function atualizarSyncLog(
  id: string,
  status: 'sucesso' | 'falha',
  contadores: { qtd_novos: number; qtd_atualizados: number; qtd_ignorados: number },
  erro?: string
): Promise<void> {
  const supabase = getSupabaseClient()
  await supabase
    .from('sync_logs')
    .update({
      status,
      concluido_em: new Date().toISOString(),
      qtd_novos: contadores.qtd_novos,
      qtd_atualizados: contadores.qtd_atualizados,
      qtd_ignorados: contadores.qtd_ignorados,
      erro: erro ?? null,
    })
    .eq('id', id)
}
