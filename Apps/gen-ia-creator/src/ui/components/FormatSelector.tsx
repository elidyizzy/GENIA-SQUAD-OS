import { INSTAGRAM_FORMATS, type InstagramFormat } from '@/types'

interface Props {
  selected: string
  onChange: (format: InstagramFormat) => void
}

// Proporção visual do card (mini-preview do aspect ratio)
function AspectBox({ width, height }: { width: number; height: number }) {
  const ratio = width / height
  const boxW = Math.round(Math.min(28, 28 * ratio))
  const boxH = Math.round(Math.min(28, 28 / ratio))
  return (
    <div className="flex items-center justify-center w-8 h-8">
      <div
        className="rounded-sm border border-[var(--primary)] bg-[var(--primary)]/10"
        style={{ width: boxW, height: boxH }}
      />
    </div>
  )
}

export default function FormatSelector({ selected, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[var(--text)] text-xs font-medium">Formato</label>
      <div className="grid grid-cols-2 gap-1.5">
        {INSTAGRAM_FORMATS.map((fmt) => {
          const active = fmt.id === selected
          return (
            <button
              key={fmt.id}
              onClick={() => onChange(fmt)}
              className={`
                flex items-center gap-2 px-2.5 py-2 rounded-lg text-left
                border transition-colors
                ${active
                  ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                  : 'border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--primary)]/50'}
              `}
            >
              <AspectBox width={fmt.width} height={fmt.height} />
              <div className="min-w-0">
                <p className={`text-[11px] font-medium truncate ${active ? 'text-[var(--primary)]' : 'text-[var(--text)]'}`}>
                  {fmt.label}
                </p>
                <p className="text-[10px] text-[var(--muted)] truncate">
                  {fmt.width}×{fmt.height}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
