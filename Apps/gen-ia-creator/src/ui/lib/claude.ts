import type { LayoutSpec, InstagramFormat } from '@/types'

export interface GenerateParams {
  apiKey: string
  format: InstagramFormat
  imageBase64?: string
  description?: string
}

const SYSTEM_PROMPT = `Você é um assistente de layout para Figma especializado em conteúdo para Instagram.
Analise a imagem ou descrição fornecida e retorne SOMENTE um JSON válido no formato LayoutSpec abaixo, sem texto adicional.
Crie um template limpo, moderno e profissional para o formato informado.
Use as dimensões exatas do formato recebido — não altere width/height do frame.
Inclua fillColor nos retângulos de fundo e textColor nos textos.
Use cores em hex (#RRGGBB). Retorne apenas o JSON, sem markdown, sem explicação.

Schema LayoutSpec:
{
  "name": string,
  "width": number,
  "height": number,
  "layers": [{
    "name": "title | body | subtitle | #img | avatar | @handle | outros",
    "type": "TEXT | RECTANGLE | IMAGE_PLACEHOLDER",
    "x": number, "y": number, "width": number, "height": number,
    "fontSize": number,
    "fontWeight": "Regular | Medium | Bold",
    "fillColor": "#RRGGBB",
    "textColor": "#RRGGBB",
    "cornerRadius": number,
    "opacity": number
  }]
}`

function extractJson(text: string): string {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fence) return fence[1].trim()
  const obj = text.match(/\{[\s\S]*\}/)
  if (obj) return obj[0]
  return text.trim()
}

function validateLayout(data: unknown): LayoutSpec {
  if (typeof data !== 'object' || data === null) throw new Error('Resposta não é um objeto JSON válido')
  const d = data as Record<string, unknown>
  if (typeof d.name !== 'string') throw new Error('Campo "name" ausente ou inválido')
  if (typeof d.width !== 'number') throw new Error('Campo "width" ausente ou inválido')
  if (typeof d.height !== 'number') throw new Error('Campo "height" ausente ou inválido')
  if (!Array.isArray(d.layers) || d.layers.length === 0) throw new Error('Campo "layers" ausente ou vazio')
  return data as LayoutSpec
}

async function callApi(
  apiKey: string,
  messages: unknown[],
  signal: AbortSignal,
): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    signal,
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages,
    }),
  })

  if (res.status === 401) throw new Error('API Key inválida. Verifique suas credenciais em Anthropic Console.')
  if (res.status === 429) throw new Error('Limite de requisições atingido. Aguarde alguns instantes e tente novamente.')
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Erro da API Claude (${res.status}): ${body.slice(0, 120)}`)
  }

  const json = (await res.json()) as { content?: Array<{ text?: string }> }
  return json.content?.[0]?.text ?? ''
}

export async function generateLayout(params: GenerateParams): Promise<LayoutSpec> {
  const { apiKey, format, imageBase64, description } = params
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30_000)

  try {
    const userContent: unknown[] = []

    if (imageBase64) {
      userContent.push({
        type: 'image',
        source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 },
      })
    }

    const contextText = description
      ? `Descrição: ${description}`
      : 'Analise a imagem de referência e crie um template similar.'

    userContent.push({
      type: 'text',
      text: `Formato: ${format.label} (${format.width}×${format.height}px)\n${contextText}\n\nGere o LayoutSpec JSON. width deve ser ${format.width}, height deve ser ${format.height}.`,
    })

    const messages = [{ role: 'user', content: userContent }]

    // Primeira tentativa
    let rawText: string
    try {
      rawText = await callApi(apiKey, messages, controller.signal)
    } catch (err) {
      if ((err as Error).name === 'AbortError') throw new Error('Tempo limite excedido (30s). Tente novamente.')
      throw err
    }

    // Parse + validação
    try {
      return validateLayout(JSON.parse(extractJson(rawText)))
    } catch {
      // Retry com instrução corretiva
      const retryMessages = [
        ...messages,
        { role: 'assistant', content: rawText },
        { role: 'user', content: 'Retorne apenas o JSON válido, sem markdown, sem explicação. Apenas o objeto JSON.' },
      ]

      let retryText: string
      try {
        retryText = await callApi(apiKey, retryMessages, controller.signal)
      } catch (err) {
        if ((err as Error).name === 'AbortError') throw new Error('Tempo limite excedido (30s). Tente novamente.')
        throw err
      }

      return validateLayout(JSON.parse(extractJson(retryText)))
    }
  } finally {
    clearTimeout(timeoutId)
  }
}
