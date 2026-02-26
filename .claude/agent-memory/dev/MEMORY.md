# MEMORY — @dev (Neo)
> Desenvolvedor Full Stack — GEN.IA OS
> Última atualização: 2026-02-24

## Padrões Confirmados

### Figma Plugin (gen-ia-creator)
- `figma.clientStorage` só acessível no sandbox (main.ts) — UI usa postMessage roundtrip
- `parent.postMessage({ pluginMessage: msg }, '*')` — UI → sandbox
- `window.addEventListener('message', ...)` — sandbox → UI (via event.data.pluginMessage)
- Dual Vite build: `root: src/ui` para UI build → gera `dist/index.html` direto
- `base: './'` obrigatório no vite.config para paths relativos no iframe do Figma
- `"type": "module"` no package.json elimina aviso MODULE_TYPELESS_PACKAGE_JSON
- Imagem comprimida para max 1024px via canvas antes de converter para base64

### Claude API (Anthropic)
- Chamada via `fetch` nativo (sem SDK) — mantém bundle leve
- Header obrigatório: `'anthropic-version': '2023-06-01'`
- JSON pode vir com markdown fence — usar regex `extractJson()` para limpar
- Retry automático com instrução corretiva: "Retorne apenas o JSON válido, sem markdown"
- AbortController com 30s timeout — testar erro `.name === 'AbortError'`
- Status 401 = API Key inválida | 429 = rate limit

## Preferências da Usuária
- Idioma: Português do Brasil
- Usuária: Elidy Izidio

## Regra Crítica
NUNCA fazer git push. Sempre delegar para @devops após commits locais.

## Stack Conhecida
- Next.js 14+ App Router, TypeScript, Supabase
- Python 3.12 para automações
- Streamlit para dashboards

## Gotchas
_Nenhum ainda._

## Padrões de Commit
`tipo(escopo): descrição`
Co-Authored-By: GEN.IA OS <genia@bedata.com.br>
