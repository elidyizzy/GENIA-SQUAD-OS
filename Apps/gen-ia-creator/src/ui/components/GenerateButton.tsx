interface Props {
  disabled: boolean
  loading: boolean
  onClick: () => void
}

export default function GenerateButton({ disabled, loading, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="
        w-full py-3 rounded-xl text-sm font-bold
        bg-[var(--primary)] text-white
        hover:bg-[var(--primary-hover)]
        disabled:opacity-40 disabled:cursor-not-allowed
        transition-all active:scale-[0.98]
        flex items-center justify-center gap-2
      "
    >
      {loading ? (
        <>
          <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
          <span>Gerando template com Claude...</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span>Gerar Template</span>
        </>
      )}
    </button>
  )
}
