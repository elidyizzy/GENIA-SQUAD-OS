import { useEffect, useState } from 'react'
import { sendToPlugin, onPluginMessage } from '@/ui/lib/figma-bridge'
import { INSTAGRAM_FORMATS, type InstagramFormat } from '@/types'
import ApiKeySetup from '@/ui/components/ApiKeySetup'
import FormatSelector from '@/ui/components/FormatSelector'
import ImageUpload from '@/ui/components/ImageUpload'
import FormatDescriber from '@/ui/components/FormatDescriber'
import GenerateButton from '@/ui/components/GenerateButton'
import { generateLayout } from '@/ui/lib/claude'
import LoadingState from '@/ui/components/LoadingState'
import ResultState from '@/ui/components/ResultState'
import ErrorState from '@/ui/components/ErrorState'

type Screen = 'loading' | 'setup' | 'create' | 'result' | 'error'
type InputMode = 'image' | 'text'

export default function App() {
  const [screen, setScreen] = useState<Screen>('loading')
  const [templateName, setTemplateName] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // ── Estado da tela Create ──────────────────────────────────────────────────
  const [format, setFormat] = useState<InstagramFormat>(INSTAGRAM_FORMATS[0])
  const [inputMode, setInputMode] = useState<InputMode>('image')
  const [imageBase64, setImageBase64] = useState('')
  const [description, setDescription] = useState('')
  const [generating, setGenerating] = useState(false)
  const [apiKey, setApiKey] = useState('')

  const canGenerate = !generating && (inputMode === 'image' ? !!imageBase64 : description.trim().length > 0)

  // ── Listener global de mensagens do sandbox ────────────────────────────────
  useEffect(() => {
    const cleanup = onPluginMessage((msg) => {
      switch (msg.type) {
        case 'api-key-response':
          if (msg.key) { setApiKey(msg.key); setScreen('create') } else { setScreen('setup') }
          break
        case 'template-created':
          setGenerating(false)
          setTemplateName(msg.templateName)
          setScreen('result')
          break
        case 'error':
          setGenerating(false)
          setErrorMsg(msg.message)
          setScreen('error')
          break
      }
    })
    sendToPlugin({ type: 'get-api-key' })
    return cleanup
  }, [])

  function resetCreate() {
    setImageBase64('')
    setDescription('')
    setGenerating(false)
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (screen === 'loading') return <LoadingState />

  // ── Setup ──────────────────────────────────────────────────────────────────
  if (screen === 'setup') {
    return <ApiKeySetup onSaved={(k) => { setApiKey(k); setScreen('create') }} />
  }

  // ── Create ─────────────────────────────────────────────────────────────────
  if (screen === 'create') {
    return (
      <div className="flex flex-col h-screen bg-[var(--bg)]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-1.5">
            <span className="text-[var(--primary)] font-bold text-sm">GEN.IA</span>
            <span className="text-[var(--muted)] text-[10px]">Creator</span>
          </div>
          <button
            onClick={() => setScreen('setup')}
            className="text-[var(--muted)] text-[10px] hover:text-[var(--text)] transition-colors"
          >
            API Key
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">
          {/* Seletor de formato */}
          <FormatSelector selected={format.id} onChange={setFormat} />

          {/* Toggle image / text */}
          <div className="flex flex-col gap-2">
            <label className="text-[var(--text)] text-xs font-medium">Referência</label>
            <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
              {(['image', 'text'] as InputMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setInputMode(mode)}
                  className={`
                    flex-1 py-2 text-xs font-medium transition-colors
                    ${inputMode === mode
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-[var(--bg-card)] text-[var(--muted)] hover:text-[var(--text)]'}
                  `}
                >
                  {mode === 'image' ? '📷 Enviar foto' : '✏️ Descrever'}
                </button>
              ))}
            </div>

            {inputMode === 'image' ? (
              <ImageUpload
                hasImage={!!imageBase64}
                onImage={setImageBase64}
                onClear={() => setImageBase64('')}
              />
            ) : (
              <FormatDescriber value={description} onChange={setDescription} />
            )}
          </div>
        </div>

        {/* Footer com botão */}
        <div className="px-5 pb-5 pt-3 border-t border-[var(--border)]">
          <GenerateButton
            disabled={!canGenerate}
            loading={generating}
            onClick={() => {
              setGenerating(true)
              generateLayout({
                apiKey,
                format,
                imageBase64: inputMode === 'image' ? imageBase64 : undefined,
                description: inputMode === 'text' ? description : undefined,
              })
                .then((layout) => sendToPlugin({ type: 'create-template', layout }))
                .catch((err: Error) => {
                  setGenerating(false)
                  setErrorMsg(err.message || 'Erro desconhecido ao chamar Claude.')
                  setScreen('error')
                })
            }}
          />
        </div>
      </div>
    )
  }

  // ── Result ─────────────────────────────────────────────────────────────────
  if (screen === 'result') {
    return (
      <ResultState
        templateName={templateName}
        onNew={() => { setTemplateName(''); resetCreate(); setScreen('create') }}
      />
    )
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  return (
    <ErrorState
      message={errorMsg}
      onRetry={() => { setErrorMsg(''); resetCreate(); setScreen('create') }}
      onSetup={errorMsg.toLowerCase().includes('api key') ? () => setScreen('setup') : undefined}
    />
  )
}
