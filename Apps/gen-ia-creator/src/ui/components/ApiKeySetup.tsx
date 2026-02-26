import { useState } from 'react'
import { sendToPlugin } from '@/ui/lib/figma-bridge'

interface Props {
  onSaved: (key: string) => void
  showBackLink?: boolean
  onBack?: () => void
}

export default function ApiKeySetup({ onSaved, showBackLink, onBack }: Props) {
  const [key, setKey] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function validate(value: string): string {
    if (!value.trim()) return 'A API key é obrigatória.'
    if (!value.trim().startsWith('sk-ant-')) return 'API key inválida. Deve começar com sk-ant-'
    return ''
  }

  async function handleSave() {
    const err = validate(key)
    if (err) { setError(err); return }

    setSaving(true)
    setError('')

    try {
      // Envia para o sandbox salvar no clientStorage
      sendToPlugin({ type: 'save-api-key', key: key.trim() })

      // Aguarda confirmação via listener no App.tsx
      // O App escuta 'api-key-saved' e chama onSaved()
      // Por segurança: timeout local de 4s
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('Timeout')), 4000)
        const handler = (event: MessageEvent) => {
          if (event.data?.pluginMessage?.type === 'api-key-saved') {
            clearTimeout(timer)
            window.removeEventListener('message', handler)
            resolve()
          }
        }
        window.addEventListener('message', handler)
      })

      onSaved(key.trim())
    } catch {
      setError('Erro ao salvar. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[var(--bg)] p-5">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[var(--primary)] font-bold text-base">GEN.IA</span>
          <span className="text-[var(--muted)] text-xs">Creator</span>
        </div>
        <h1 className="text-[var(--text)] font-semibold text-lg leading-tight">
          Configure sua API Key
        </h1>
        <p className="text-[var(--muted)] text-xs mt-1">
          Necessária para gerar templates com Claude.
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[var(--text)] text-xs font-medium">
            Anthropic API Key
          </label>
          <input
            type="password"
            value={key}
            onChange={(e) => { setKey(e.target.value); setError('') }}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder="sk-ant-api03-..."
            className="
              w-full px-3 py-2.5 rounded-lg text-sm
              bg-[var(--bg-card)] border border-[var(--border)]
              text-[var(--text)] placeholder:text-[var(--muted)]
              focus:outline-none focus:border-[var(--primary)]
              transition-colors
            "
          />
          {error && (
            <p className="text-[var(--error)] text-xs">{error}</p>
          )}
        </div>

        <a
          href="https://console.anthropic.com/keys"
          target="_blank"
          rel="noreferrer"
          className="text-[var(--accent)] text-xs hover:underline"
        >
          Obter API key no console Anthropic →
        </a>

        <button
          onClick={handleSave}
          disabled={saving || !key.trim()}
          className="
            w-full py-2.5 rounded-lg text-sm font-semibold
            bg-[var(--primary)] text-white
            hover:bg-[var(--primary-hover)]
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-colors mt-2
          "
        >
          {saving ? 'Salvando...' : 'Salvar e continuar'}
        </button>
      </div>

      {/* Back link */}
      {showBackLink && onBack && (
        <button
          onClick={onBack}
          className="text-[var(--muted)] text-xs hover:text-[var(--text)] mt-4 transition-colors"
        >
          ← Voltar
        </button>
      )}

      {/* Footer */}
      <p className="text-[var(--muted)] text-[10px] mt-6 text-center leading-relaxed">
        A chave fica salva localmente no Figma.<br />
        Nunca é enviada a servidores externos.
      </p>
    </div>
  )
}
