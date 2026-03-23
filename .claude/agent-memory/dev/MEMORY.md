# MEMORY — @dev (Neo)

> Desenvolvedor Full Stack — GEN.IA OS
> Última atualização: 2026-03-23

## Padrões Confirmados

### Regra de Ouro
NUNCA fazer git push. Sempre delegar para @devops após commits locais.

### Figma Plugin (gen-ia-creator)
- `figma.clientStorage` só acessível no sandbox (main.ts) — UI usa postMessage roundtrip
- `parent.postMessage({ pluginMessage: msg }, '*')` — UI → sandbox
- Dual Vite build: `root: src/ui` para UI build → gera `dist/index.html` direto
- `base: './'` obrigatório no vite.config para paths relativos no iframe do Figma

### Claude API (Anthropic)
- Chamada via `fetch` nativo (sem SDK) — mantém bundle leve
- Header obrigatório: `'anthropic-version': '2023-06-01'`
- JSON pode vir com markdown fence — usar regex `extractJson()` para limpar
- AbortController com 30s timeout

### Hooks GEN.IA OS (Node.js/CJS)
- Hooks CJS usam `process.stdin` para receber input JSON do Claude Code
- Synapse Engine: timeout 100ms, falha silenciosa, nunca bloqueia prompt
- Flag devops-active: arquivo `.genia/session/devops-active` — uso único

## Preferências da Usuária

- Idioma: Português do Brasil
- Usuária: Elidy Izidio — Fundadora da GEN.IA SQUAD
- Sem invenção: implementar apenas o que está na story aprovada

## Stack Conhecida

- Next.js 14+ App Router, TypeScript, Supabase
- Python 3.12 para automações e hooks de governança
- Streamlit para dashboards
- Node.js 24 / npm 11

## Padrões de Commit

```
tipo(escopo): descrição

Co-Authored-By: GEN.IA OS <genia@bedata.com.br>
```

## Gotchas

- Story deve estar InProgress antes de escrever qualquer linha de código
- Imports sempre absolutos com `@/` — nunca `../../../`
- Funções: máximo 50 linhas, extrair se maior
