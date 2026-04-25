'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SyncLog {
  id: string
  iniciado_em: string
  concluido_em: string | null
  status: string
  qtd_novos: number
  qtd_atualizados: number
  qtd_ignorados: number
  erro: string | null
}

interface Config {
  divida_minima?: string
  google_maps_api_key_configured?: boolean
  apollo_api_key_configured?: boolean
}

interface TestResult { ok: boolean; error?: string }
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

function formatDuracao(iniciado: string, concluido: string | null): string {
  if (!concluido) return '—'
  const secs = Math.round((new Date(concluido).getTime() - new Date(iniciado).getTime()) / 1000)
  if (secs < 60) return `${secs}s`
  return `${Math.floor(secs / 60)}m ${secs % 60}s`
}

const STATUS_BADGE: Record<string, string> = {
  em_andamento: 'bg-blue-100 text-blue-700',
  sucesso: 'bg-green-100 text-green-700',
  falha: 'bg-red-100 text-red-600',
}

export function ConfiguracoesContent() {
  const [tab, setTab] = useState<'config' | 'logs'>('config')
  const [config, setConfig] = useState<Config>({})
  const [logs, setLogs] = useState<SyncLog[]>([])
  const [isLoadingConfig, setIsLoadingConfig] = useState(true)
  const [isLoadingLogs, setIsLoadingLogs] = useState(false)

  // Config fields
  const [mapsKey, setMapsKey] = useState('')
  const [apolloKey, setApolloKey] = useState('')
  const [dividaMin, setDividaMin] = useState('')
  const [showMaps, setShowMaps] = useState(false)
  const [showApollo, setShowApollo] = useState(false)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')

  // Test results
  const [mapsTest, setMapsTest] = useState<TestResult | null>(null)
  const [apolloTest, setApolloTest] = useState<TestResult | null>(null)
  const [testingMaps, setTestingMaps] = useState(false)
  const [testingApollo, setTestingApollo] = useState(false)

  const loadedConfig = useRef(false)

  useEffect(() => {
    if (loadedConfig.current) return
    loadedConfig.current = true
    fetch('/api/config').then((r) => r.json()).then((data: Config) => {
      setConfig(data)
      setDividaMin(data.divida_minima ?? '1000000')
    }).finally(() => setIsLoadingConfig(false))
  }, [])

  useEffect(() => {
    if (tab !== 'logs') return
    setIsLoadingLogs(true)
    fetch('/api/sync/logs').then((r) => r.json()).then(setLogs).finally(() => setIsLoadingLogs(false))
  }, [tab])

  const saveKey = async (key: string, value: string) => {
    await fetch('/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    })
  }

  const handleSave = async () => {
    setSaveStatus('saving')
    try {
      await Promise.all([
        mapsKey ? saveKey('google_maps_api_key', mapsKey) : Promise.resolve(),
        apolloKey ? saveKey('apollo_api_key', apolloKey) : Promise.resolve(),
        saveKey('divida_minima', dividaMin),
      ])
      setSaveStatus('saved')
      setMapsKey('')
      setApolloKey('')
      setTimeout(() => setSaveStatus('idle'), 2500)
    } catch {
      setSaveStatus('error')
    }
  }

  const testMaps = async () => {
    if (mapsKey) await saveKey('google_maps_api_key', mapsKey)
    setTestingMaps(true)
    const res = await fetch('/api/config/test/google_maps', { method: 'POST' })
    setMapsTest(await res.json())
    setTestingMaps(false)
  }

  const testApollo = async () => {
    if (apolloKey) await saveKey('apollo_api_key', apolloKey)
    setTestingApollo(true)
    const res = await fetch('/api/config/test/apollo', { method: 'POST' })
    setApolloTest(await res.json())
    setTestingApollo(false)
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Configurações</h1>
        <p className="mt-1 text-sm text-zinc-500">API keys e logs de sincronização.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-zinc-100 rounded-lg p-1 w-fit mb-6">
        {(['config', 'logs'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              tab === t ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            {t === 'config' ? 'Configurações' : 'Logs de Sync'}
          </button>
        ))}
      </div>

      {/* Config tab */}
      {tab === 'config' && (
        <div className="space-y-6">
          {isLoadingConfig ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-16 rounded-lg bg-zinc-200 animate-pulse" />)}
            </div>
          ) : (
            <>
              {/* Google Maps */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 flex items-center gap-2">
                  Google Maps API Key
                  {config.google_maps_api_key_configured && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Configurada</span>
                  )}
                </label>
                <div className="flex gap-2">
                  <Input
                    type={showMaps ? 'text' : 'password'}
                    value={mapsKey}
                    onChange={(e) => setMapsKey(e.target.value)}
                    placeholder={config.google_maps_api_key_configured ? '••••••••••••••• (deixe em branco para manter)' : 'AIzaSy...'}
                    className="flex-1 font-mono text-sm"
                  />
                  <Button variant="outline" size="sm" onClick={() => setShowMaps(!showMaps)}>
                    {showMaps ? 'Ocultar' : 'Mostrar'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={testMaps} disabled={testingMaps}>
                    {testingMaps ? '...' : 'Testar'}
                  </Button>
                </div>
                {mapsTest && (
                  <p className={`text-xs ${mapsTest.ok ? 'text-green-600' : 'text-red-500'}`}>
                    {mapsTest.ok ? '✓ Conexão OK' : `✗ Falha: ${mapsTest.error}`}
                  </p>
                )}
              </div>

              {/* Apollo */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 flex items-center gap-2">
                  Apollo.io API Key
                  {config.apollo_api_key_configured && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Configurada</span>
                  )}
                </label>
                <div className="flex gap-2">
                  <Input
                    type={showApollo ? 'text' : 'password'}
                    value={apolloKey}
                    onChange={(e) => setApolloKey(e.target.value)}
                    placeholder={config.apollo_api_key_configured ? '••••••••••••••• (deixe em branco para manter)' : 'apollo_key_...'}
                    className="flex-1 font-mono text-sm"
                  />
                  <Button variant="outline" size="sm" onClick={() => setShowApollo(!showApollo)}>
                    {showApollo ? 'Ocultar' : 'Mostrar'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={testApollo} disabled={testingApollo}>
                    {testingApollo ? '...' : 'Testar'}
                  </Button>
                </div>
                {apolloTest && (
                  <p className={`text-xs ${apolloTest.ok ? 'text-green-600' : 'text-red-500'}`}>
                    {apolloTest.ok ? '✓ Conexão OK' : `✗ Falha: ${apolloTest.error}`}
                  </p>
                )}
              </div>

              {/* Dívida mínima */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Dívida Mínima (R$)</label>
                <Input
                  type="number"
                  value={dividaMin}
                  onChange={(e) => setDividaMin(e.target.value)}
                  className="w-48"
                  min={0}
                  step={100000}
                />
                <p className="text-xs text-zinc-400">
                  Usado como referência. A sincronização é controlada via variável de ambiente no GitHub Actions.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button onClick={handleSave} disabled={saveStatus === 'saving'}>
                  {saveStatus === 'saving' ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
                {saveStatus === 'saved' && <span className="text-sm text-green-600">Salvo ✓</span>}
                {saveStatus === 'error' && <span className="text-sm text-red-500">Erro ao salvar</span>}
              </div>

              <div className="rounded-lg bg-zinc-50 border border-zinc-200 p-4 text-xs text-zinc-500">
                <p className="font-medium text-zinc-700 mb-1">Sincronização manual</p>
                Para executar a sincronização da PGFN manualmente, acesse o GitHub Actions no repositório e execute o workflow <code className="bg-zinc-200 px-1 rounded">pgfn-sync.yml</code> via &quot;Run workflow&quot;.
              </div>
            </>
          )}
        </div>
      )}

      {/* Logs tab */}
      {tab === 'logs' && (
        <div>
          {isLoadingLogs ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => <div key={i} className="h-12 rounded-lg bg-zinc-200 animate-pulse" />)}
            </div>
          ) : logs.length === 0 ? (
            <p className="text-sm text-zinc-400 italic">Nenhuma sincronização executada ainda.</p>
          ) : (
            <div className="rounded-xl border border-zinc-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-zinc-50">
                  <tr>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-zinc-500">Início</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-zinc-500">Duração</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-zinc-500">Status</th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-zinc-500">Novos</th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-zinc-500">Atualizados</th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-zinc-500">Ignorados</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-zinc-50">
                      <td className="px-4 py-2.5 text-zinc-600">
                        {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(log.iniciado_em))}
                      </td>
                      <td className="px-4 py-2.5 text-zinc-500">{formatDuracao(log.iniciado_em, log.concluido_em)}</td>
                      <td className="px-4 py-2.5">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_BADGE[log.status] ?? 'bg-zinc-100 text-zinc-500'}`}>
                          {log.status === 'em_andamento' ? 'Em andamento' : log.status === 'sucesso' ? 'Sucesso' : 'Falha'}
                        </span>
                        {log.erro && (
                          <p className="text-xs text-red-500 mt-0.5 max-w-xs truncate" title={log.erro}>{log.erro}</p>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right text-zinc-700 font-medium">{log.qtd_novos}</td>
                      <td className="px-4 py-2.5 text-right text-zinc-600">{log.qtd_atualizados}</td>
                      <td className="px-4 py-2.5 text-right text-zinc-400">{log.qtd_ignorados}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
