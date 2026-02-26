// ── Tipos compartilhados: Sandbox ↔ UI ────────────────────────────────────────

// Mensagens que a UI envia para o Sandbox (main.ts)
export type UIToPlugin =
  | { type: 'ui-ready' }
  | { type: 'get-api-key' }
  | { type: 'save-api-key'; key: string }
  | { type: 'create-template'; layout: LayoutSpec }

// Mensagens que o Sandbox envia para a UI
export type PluginToUI =
  | { type: 'api-key-response'; key: string | null }
  | { type: 'api-key-saved' }
  | { type: 'template-created'; templateName: string }
  | { type: 'error'; message: string }

// ── Layout gerado pelo Claude ─────────────────────────────────────────────────

export interface LayoutSpec {
  name: string
  width: number
  height: number
  layers: LayerSpec[]
}

export interface LayerSpec {
  name: string
  type: 'TEXT' | 'RECTANGLE' | 'IMAGE_PLACEHOLDER'
  x: number
  y: number
  width: number
  height: number
  fontSize?: number
  fontWeight?: 'Regular' | 'Medium' | 'Bold'
  fillColor?: string    // hex, ex: "#6366f1" — fundo de retângulos
  textColor?: string    // hex, ex: "#ffffff" — cor do texto
  cornerRadius?: number // px
  opacity?: number      // 0-1
}

// ── Formatos Instagram ────────────────────────────────────────────────────────

export interface InstagramFormat {
  id: string
  label: string
  width: number
  height: number
  description: string
}

export const INSTAGRAM_FORMATS: InstagramFormat[] = [
  { id: 'feed-square',    label: 'Feed Quadrado',    width: 1080, height: 1080, description: 'Post padrão' },
  { id: 'feed-portrait',  label: 'Feed Retrato',     width: 1080, height: 1350, description: 'Maior visibilidade' },
  { id: 'feed-landscape', label: 'Feed Paisagem',    width: 1080, height:  566, description: 'Post horizontal' },
  { id: 'stories',        label: 'Stories / Reels',  width: 1080, height: 1920, description: 'Vertical 9:16' },
  { id: 'carousel',       label: 'Carrossel',        width: 1080, height: 1080, description: 'Múltiplos slides' },
  { id: 'highlight',      label: 'Capa Destaque',    width: 1080, height: 1080, description: 'Cover Highlights' },
  { id: 'profile',        label: 'Foto de Perfil',   width:  320, height:  320, description: 'Avatar circular' },
]
