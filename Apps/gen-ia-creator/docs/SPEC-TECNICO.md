# SPEC-TECNICO — gen.ia creator

**Agente:** @architect (Trinity)
**Data:** 2026-02-25
**Status:** APROVADA por @po — 2026-02-25

---

## Visão do Sistema

Ecossistema de dois plugins complementares para o Figma:

```
┌──────────────────────────────────────────────────────────────┐
│  Plugin 1: gen.ia creator  (este repositório)                │
│  Usuária envia foto OU descreve formato → Claude gera layout │
│  Plugin cria template no Figma (frames + layers nomeados)    │
└───────────────────────────┬──────────────────────────────────┘
                            │ Figma clientStorage / Plugin ID
┌───────────────────────────▼──────────────────────────────────┐
│  Plugin 2: gen.ia fill  (repositório futuro)                 │
│  Usuária insere conteúdo (textos, imagens) via prompt        │
│  Plugin popula layers do template criado pelo Plugin 1       │
└──────────────────────────────────────────────────────────────┘
```

---

## Stack Tecnológica — Decisão Arquitetural

| Camada | Tecnologia | Versão | Justificativa |
|--------|-----------|--------|---------------|
| UI Framework | React | 18 | Alinha com stack GEN.IA OS; componentes reutilizáveis |
| Linguagem | TypeScript | 5 | Strict mode; tipos para Figma API e Claude API |
| Bundler | Vite | 5 | Dual build (sandbox + UI); HMR rápido no dev |
| Estilo | Tailwind CSS | 3 | Design tokens GEN.IA OS via CSS vars |
| Figma Types | @figma/plugin-typings | latest | IntelliSense completo |
| IA | Claude API (Anthropic) | claude-sonnet-4-6 | Vision + JSON output para layout |

**Sem backend próprio** — a UI do plugin chama a API da Anthropic diretamente.

---

## Arquitetura de Pastas

```
gen-ia-creator/
├── manifest.json                  ← main: dist/code.js, ui: dist/ui.html
├── package.json
├── tsconfig.json                  ← strict, paths: @/*→src/*
├── tsconfig.node.json
├── vite.config.ts                 ← dual build
├── tailwind.config.ts             ← tokens GEN.IA OS
├── src/
│   ├── main.ts                    ← SANDBOX: Figma API, cria elementos
│   ├── types.ts                   ← msgs compartilhadas Plugin↔UI
│   └── ui/
│       ├── main.tsx               ← React entry
│       ├── App.tsx                ← Root + telas (Setup | Create | Result)
│       ├── index.css              ← Tailwind + vars GEN.IA
│       ├── lib/
│       │   ├── claude.ts          ← chamada Claude API (vision + json)
│       │   └── figma-bridge.ts    ← helpers postMessage
│       └── components/
│           ├── ApiKeySetup.tsx    ← input + storage da API key
│           ├── ImageUpload.tsx    ← upload/preview de foto
│           ├── FormatDescriber.tsx← campo de texto livre
│           └── GenerateButton.tsx ← aciona geração
├── dist/                          ← output build (gitignored)
│   ├── code.js
│   └── ui.html
└── docs/
    ├── SPEC-TECNICO.md            ← este arquivo
    └── stories/
```

---

## Fluxo Principal (Happy Path)

```
1. Usuária abre plugin → tela de Setup (API key)
2. Salva API key → figma.clientStorage.setAsync('apiKey', key)
3. Tela Create:
   a. Faz upload de imagem OU digita descrição do formato
   b. Clica "Gerar Template"
4. UI chama claude.ts:
   - modelo: claude-sonnet-4-6
   - input: imagem (base64) + prompt de sistema
   - resposta esperada: JSON com layout spec
5. UI envia spec via postMessage para o sandbox (main.ts)
6. Sandbox (main.ts) executa Figma API:
   - Cria Frame principal
   - Cria layers nomeados: title, subtitle, body, image-placeholder, etc.
   - Aplica tipografia e dimensões do JSON recebido
7. UI mostra confirmação + nome do template criado
```

---

## Protocolo de Mensagens (Plugin ↔ UI)

```typescript
// src/types.ts

export type PluginToUI =
  | { type: 'template-created'; templateName: string }
  | { type: 'error'; message: string }

export type UIToPlugin =
  | { type: 'create-template'; layout: LayoutSpec }
  | { type: 'ui-ready' }

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
  fillColor?: string        // hex, ex: "#6366f1" — fundo de retângulos
  textColor?: string        // hex, ex: "#ffffff" — cor do texto
  cornerRadius?: number     // px — bordas arredondadas
  opacity?: number          // 0-1
}
```

---

## Formatos Suportados — Instagram

Todos os formatos do ecossistema Instagram:

| Formato | Dimensões (px) | Uso |
|---------|---------------|-----|
| Feed Quadrado | 1080 × 1080 | Post padrão |
| Feed Retrato | 1080 × 1350 | Post vertical (maior visibilidade) |
| Feed Paisagem | 1080 × 566 | Post horizontal |
| Stories / Reels | 1080 × 1920 | Story e Reels vertical |
| Carrossel | 1080 × 1080 | Múltiplos slides (mesmo frame replicado) |
| Capa de Destaque | 1080 × 1080 | Cover dos Highlights |
| Foto de Perfil | 320 × 320 | Avatar circular |

A UI deve exibir um seletor de formato **antes** do campo de imagem/descrição.
O formato selecionado define `width` e `height` do `LayoutSpec` enviado ao Claude.

---

## Prompt de Sistema — Claude

```
Você é um assistente de layout para Figma especializado em conteúdo para Instagram.
Analise a imagem ou descrição fornecida e retorne SOMENTE um JSON válido
no formato LayoutSpec (definido abaixo), sem texto adicional.
Crie um template limpo, moderno e profissional para o formato informado.
Use as dimensões exatas do formato recebido — não altere width/height do frame.
Inclua fillColor nos retângulos de fundo e textColor nos textos.
Use cores em hex (#RRGGBB). Retorne apenas o JSON, sem markdown, sem explicação.
```

---

## API Key — Armazenamento

```typescript
// Salvar
await figma.clientStorage.setAsync('geniaCreatorApiKey', apiKey)

// Ler
const key = await figma.clientStorage.getAsync('geniaCreatorApiKey')
```

Armazenamento local por usuário/plugin. Nunca exposta no código-fonte.

---

## Dependências (package.json)

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  },
  "devDependencies": {
    "@figma/plugin-typings": "latest",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.4.0",
    "vite": "^5.4.0",
    "@vitejs/plugin-react": "^4.3.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

> Claude API: chamada via `fetch` nativo (sem SDK), para manter bundle leve.

---

## Vite Config — Dual Build

```typescript
// vite.config.ts
// Build A: src/ui/main.tsx → dist/ui.html  (React app)
// Build B: src/main.ts    → dist/code.js   (Figma sandbox, sem DOM)
```

Dois builds em sequência via `npm run build`.

---

## Design Tokens GEN.IA OS

```css
/* src/ui/index.css */
:root {
  --bg:      #08090f;
  --primary: #6366f1;
  --accent:  #06b6d4;
  --text:    #f0f0f0;
  --muted:   #888;
}
```

---

## Riscos e Mitigações

| Risco | Mitigação |
|-------|-----------|
| Claude retorna JSON inválido | Validar schema antes de enviar ao sandbox; retry com instrução corretiva |
| API key vazia | Bloquear tela Create até configurar; validar no Setup |
| Figma API muda | Usar `@figma/plugin-typings` sempre na versão latest |
| Bundle grande | Code splitting; lazy load componentes pesados |
| CORS na chamada Claude | Figma UI roda em iframe com acesso a fetch externo — permitido |

---

## Convenção de Nomenclatura de Layers (CRÍTICO para integração com Plugin 2)

O Plugin 1 deve nomear as layers criadas com a convenção abaixo para que o Plugin 2
consiga detectá-las automaticamente via algoritmo de spatial detection:

```
Frame principal (nome do template)
├── "title"        ← layer de texto principal
├── "body"         ← layer de texto secundário / corpo
├── "subtitle"     ← layer de texto terciário (opcional)
├── "#img"         ← placeholder de imagem (prioridade máxima de detecção)
├── "avatar"       ← frame/ellipse para foto de perfil
└── "@handle"      ← text layer para @arroba
```

Regra: o Claude deve incluir esses nomes exatos no JSON de LayoutSpec retornado.

---

## Plugin 2 — gen.ia fill (Referência)

**Inspiração:** Marketing Insider OS v1.4 (plugin existente — referência de arquitetura)

**Responsabilidade:** Popula layers do template criado pelo Plugin 1 com conteúdo real.

```
Tab "Conteúdo":
  ├── Texto em lote: título + corpo por slide (separado por linha em branco)
  ├── Perfil: nome, @arroba, avatar → sincroniza todos os slides
  └── Imagens: upload múltiplo com drag-to-reorder

Tab "Design":
  └── Cores de título e corpo (color picker + hex)

Exportação: PNG por slide → ZIP
```

**Algoritmos a adaptar do plugin de referência:**
- `Magnetic Profile Detection`: detecta avatar/nome/@handle por score espacial
- `Footer Shield`: ignora textos abaixo de 85% do slide altura
- `loadFontSafe`: fallback Inter Regular em caso de fonte ausente
- `findImageTarget`: prioridade `#img` > regex > maior retângulo

**Stack do Plugin 2:** React 18 + TypeScript 5 + Vite 5 (mesma stack do Plugin 1 para consistência).
Repositório futuro: `Apps/gen-ia-fill/`

---

## Próximos Passos

```
@architect → @po  (validar esta SPEC)
@po → @sm         (criar stories: STORY-001 setup projeto, STORY-002 geração, etc.)
@sm → @dev        (implementar)
```
