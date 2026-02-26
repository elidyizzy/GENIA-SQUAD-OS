// Helpers para comunicação UI ↔ Sandbox (Figma Plugin)
// A UI roda em um iframe e se comunica via window.parent.postMessage

import type { UIToPlugin, PluginToUI } from '@/types'

/** Envia mensagem da UI para o sandbox (main.ts) */
export function sendToPlugin(msg: UIToPlugin): void {
  parent.postMessage({ pluginMessage: msg }, '*')
}

/** Registra um listener para mensagens vindas do sandbox */
export function onPluginMessage(cb: (msg: PluginToUI) => void): () => void {
  const handler = (event: MessageEvent) => {
    if (event.data?.pluginMessage) {
      cb(event.data.pluginMessage as PluginToUI)
    }
  }
  window.addEventListener('message', handler)
  // Retorna função de cleanup para usar em useEffect
  return () => window.removeEventListener('message', handler)
}

/** Promise que aguarda uma resposta específica do sandbox */
export function waitForMessage<T extends PluginToUI>(
  type: T['type'],
  timeoutMs = 5000
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timeout aguardando ${type}`)), timeoutMs)
    const cleanup = onPluginMessage((msg) => {
      if (msg.type === type) {
        clearTimeout(timer)
        cleanup()
        resolve(msg as T)
      }
    })
  })
}
