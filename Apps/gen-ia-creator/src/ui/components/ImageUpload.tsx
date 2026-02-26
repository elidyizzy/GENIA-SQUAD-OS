import { useRef, useState } from 'react'

interface Props {
  onImage: (base64: string) => void
  onClear: () => void
  hasImage: boolean
}

/** Comprime/redimensiona imagem para max 1024px antes de converter para base64 */
async function resizeAndEncode(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const MAX = 1024
      let { width, height } = img
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round((height * MAX) / width); width = MAX }
        else { width = Math.round((width * MAX) / height); height = MAX }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)
      // Remove o prefixo "data:image/jpeg;base64," — Claude recebe só o base64
      resolve(canvas.toDataURL('image/jpeg', 0.85).split(',')[1])
    }
    img.onerror = reject
    img.src = url
  })
}

export default function ImageUpload({ onImage, onClear, hasImage }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string>('')
  const [loading, setLoading] = useState(false)

  async function handleFile(file: File) {
    if (!file.type.match(/image\/(png|jpeg|webp)/)) return
    setLoading(true)
    try {
      const b64 = await resizeAndEncode(file)
      setPreview(URL.createObjectURL(file))
      onImage(b64)
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    // Limpa o input para permitir re-upload do mesmo arquivo
    e.target.value = ''
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleClear() {
    setPreview('')
    onClear()
  }

  if (hasImage && preview) {
    return (
      <div className="relative rounded-lg overflow-hidden border border-[var(--primary)]/50">
        <img src={preview} alt="preview" className="w-full h-28 object-cover" />
        <button
          onClick={handleClear}
          className="
            absolute top-1.5 right-1.5
            w-6 h-6 rounded-full bg-black/60 flex items-center justify-center
            text-white text-xs hover:bg-black/80 transition-colors
          "
        >
          ✕
        </button>
        <div className="absolute bottom-1.5 left-2 text-[10px] text-white/70">
          Imagem pronta ✓
        </div>
      </div>
    )
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => inputRef.current?.click()}
      className="
        flex flex-col items-center justify-center gap-1.5
        h-24 rounded-lg border border-dashed border-[var(--border)]
        bg-[var(--bg-card)] cursor-pointer
        hover:border-[var(--primary)]/60 hover:bg-[var(--bg-hover)]
        transition-colors
      "
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleChange}
      />
      {loading ? (
        <div className="w-4 h-4 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin" />
      ) : (
        <>
          <svg className="w-5 h-5 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-[var(--muted)] text-[11px]">
            Clique ou arraste uma foto
          </p>
          <p className="text-[var(--muted)] text-[10px]">PNG, JPG, WEBP</p>
        </>
      )}
    </div>
  )
}
