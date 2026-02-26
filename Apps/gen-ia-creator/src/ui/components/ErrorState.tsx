interface Props {
  message: string
  onRetry: () => void
  onSetup?: () => void
}

export default function ErrorState({ message, onRetry, onSetup }: Props) {
  return (
    <div className="flex flex-col h-screen bg-[var(--bg)] p-5 items-center justify-center gap-4">
      <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
        <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-[var(--text)] font-semibold text-sm">Algo deu errado</p>
        <p className="text-[var(--muted)] text-xs mt-1 max-w-[220px] leading-relaxed">{message}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--bg-hover)] transition-colors"
        >
          Tentar novamente
        </button>
        {onSetup && (
          <button
            onClick={onSetup}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors"
          >
            Verificar API Key
          </button>
        )}
      </div>
    </div>
  )
}
