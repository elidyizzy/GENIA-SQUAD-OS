interface Props {
  templateName: string
  onNew: () => void
}

export default function ResultState({ templateName, onNew }: Props) {
  return (
    <div className="flex flex-col h-screen bg-[var(--bg)] p-5 items-center justify-center gap-4">
      <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
        <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-[var(--text)] font-semibold text-sm">Template criado!</p>
        <p className="text-[var(--muted)] text-xs mt-1">{templateName}</p>
      </div>
      <button
        onClick={onNew}
        className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors"
      >
        Gerar outro
      </button>
    </div>
  )
}
