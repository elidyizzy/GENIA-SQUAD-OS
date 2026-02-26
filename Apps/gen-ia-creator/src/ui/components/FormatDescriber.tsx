const MAX = 400

interface Props {
  value: string
  onChange: (v: string) => void
}

export default function FormatDescriber({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[var(--text)] text-xs font-medium">
          Descreva o template
        </label>
        <span className={`text-[10px] ${value.length > MAX * 0.9 ? 'text-amber-400' : 'text-[var(--muted)]'}`}>
          {value.length}/{MAX}
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, MAX))}
        placeholder="Ex: post de dica de marketing, fundo escuro com degradê roxo, título grande em branco, ícone à esquerda, rodapé com @..."
        rows={4}
        className="
          w-full px-3 py-2.5 rounded-lg text-xs resize-none
          bg-[var(--bg-card)] border border-[var(--border)]
          text-[var(--text)] placeholder:text-[var(--muted)]
          focus:outline-none focus:border-[var(--primary)]
          transition-colors leading-relaxed
        "
      />
    </div>
  )
}
