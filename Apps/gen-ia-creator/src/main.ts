// gen.ia creator — Figma Plugin Sandbox
// Roda no ambiente restrito do Figma (sem DOM, sem fetch).
// Comunica com a UI via figma.ui.onmessage / figma.ui.postMessage.

import type { UIToPlugin, PluginToUI, LayoutSpec, LayerSpec } from './types'

figma.showUI(__html__, { width: 360, height: 640, themeColors: false })

figma.ui.onmessage = async (raw: unknown) => {
  const msg = raw as UIToPlugin

  switch (msg.type) {
    case 'ui-ready':
      break

    // ── API Key ──────────────────────────────────────────────────────────
    case 'get-api-key': {
      const key = (await figma.clientStorage.getAsync('geniaCreatorApiKey')) as string | undefined
      send({ type: 'api-key-response', key: key ?? null })
      break
    }

    case 'save-api-key': {
      await figma.clientStorage.setAsync('geniaCreatorApiKey', msg.key)
      send({ type: 'api-key-saved' })
      break
    }

    // ── Template ─────────────────────────────────────────────────────────
    case 'create-template': {
      try {
        const frame = await createTemplate(msg.layout)
        figma.viewport.scrollAndZoomIntoView([frame])
        send({ type: 'template-created', templateName: frame.name })
      } catch (err) {
        send({ type: 'error', message: String(err) })
      }
      break
    }
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function send(msg: PluginToUI) {
  figma.ui.postMessage(msg)
}

function hexToRgb(hex: string): RGB {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16) / 255
  const g = parseInt(clean.slice(2, 4), 16) / 255
  const b = parseInt(clean.slice(4, 6), 16) / 255
  return { r: isNaN(r) ? 0 : r, g: isNaN(g) ? 0 : g, b: isNaN(b) ? 0 : b }
}

async function loadFontSafe(node: TextNode, weight?: string): Promise<void> {
  const style = weight ?? 'Regular'
  try {
    await figma.loadFontAsync({ family: 'Inter', style })
    node.fontName = { family: 'Inter', style }
  } catch {
    await figma.loadFontAsync({ family: 'Inter', style: 'Regular' })
    node.fontName = { family: 'Inter', style: 'Regular' }
  }
}

// ── Criação de template ───────────────────────────────────────────────────────

async function createTemplate(layout: LayoutSpec): Promise<FrameNode> {
  const frame = figma.createFrame()
  frame.name = layout.name
  frame.resize(layout.width, layout.height)
  frame.fills = [{ type: 'SOLID', color: { r: 0.03, g: 0.04, b: 0.06 } }]

  for (const spec of layout.layers) {
    if (spec.type === 'TEXT') {
      await addTextLayer(spec, frame)
    } else if (spec.type === 'IMAGE_PLACEHOLDER') {
      addImagePlaceholder(spec, frame)
    } else {
      addRectLayer(spec, frame)
    }
  }

  figma.currentPage.appendChild(frame)
  return frame
}

async function addTextLayer(spec: LayerSpec, parent: FrameNode): Promise<void> {
  const node = figma.createText()
  node.name = spec.name
  await loadFontSafe(node, spec.fontWeight)
  node.characters = spec.name.replace(/^[@#]/, '') || 'Texto'
  node.fontSize = spec.fontSize ?? 24
  node.resize(spec.width, spec.height)
  node.x = spec.x
  node.y = spec.y
  if (spec.textColor) {
    node.fills = [{ type: 'SOLID', color: hexToRgb(spec.textColor) }]
  }
  if (spec.opacity !== undefined) node.opacity = spec.opacity
  parent.appendChild(node)
}

function addRectLayer(spec: LayerSpec, parent: FrameNode): void {
  const node = figma.createRectangle()
  node.name = spec.name
  node.resize(spec.width, spec.height)
  node.x = spec.x
  node.y = spec.y
  if (spec.fillColor) {
    node.fills = [{ type: 'SOLID', color: hexToRgb(spec.fillColor) }]
  }
  if (spec.cornerRadius) node.cornerRadius = spec.cornerRadius
  if (spec.opacity !== undefined) node.opacity = spec.opacity
  parent.appendChild(node)
}

function addImagePlaceholder(spec: LayerSpec, parent: FrameNode): void {
  const node = figma.createRectangle()
  node.name = '#img'
  node.resize(spec.width, spec.height)
  node.x = spec.x
  node.y = spec.y
  node.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.2, b: 0.2 } }]
  if (spec.cornerRadius) node.cornerRadius = spec.cornerRadius
  parent.appendChild(node)
}
