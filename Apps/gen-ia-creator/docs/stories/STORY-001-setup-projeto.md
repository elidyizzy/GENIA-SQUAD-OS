# STORY-001 — Configurar projeto base (build + TypeScript + Tailwind)

**Status:** InReview
**Agente:** @dev
**Criado:** 2026-02-25
**Estimativa:** M

---

## Descrição

Como desenvolvedora do gen.ia creator, quero configurar o projeto base com TypeScript, Vite (dual build) e Tailwind CSS para ter um ambiente de desenvolvimento funcional com hot reload e build otimizado para Figma plugin.

---

## Acceptance Criteria

- [ ] AC1: `npm install` executa sem erros com todas as dependências da SPEC
- [ ] AC2: `npm run dev` inicia Vite em modo watch (UI + sandbox)
- [ ] AC3: `npm run build` gera `dist/code.js` e `dist/ui.html` sem erros
- [ ] AC4: TypeScript strict mode ativo; `npm run typecheck` passa sem erros
- [ ] AC5: Tailwind compilado com tokens GEN.IA OS (--bg, --primary, --accent, --text, --muted)
- [ ] AC6: `manifest.json` atualizado para apontar para `dist/code.js` e `dist/ui.html`

---

## Tasks Técnicas

- [ ] Task 1: Criar `package.json` com todas as deps da SPEC-TECNICO (react 18, vite 5, tailwind 3, @figma/plugin-typings, typescript 5)
- [ ] Task 2: Criar `tsconfig.json` (strict, path alias `@/*` → `src/*`) e `tsconfig.node.json`
- [ ] Task 3: Criar `vite.config.ts` com dual build — Build A: `src/ui/main.tsx` → `dist/ui.html`; Build B: `src/main.ts` → `dist/code.js`
- [ ] Task 4: Criar `tailwind.config.ts` com tokens GEN.IA OS e `postcss.config.js`
- [ ] Task 5: Criar `src/ui/index.css` com `@tailwind base/components/utilities` + variáveis CSS GEN.IA OS
- [ ] Task 6: Atualizar `manifest.json` — `main: "dist/code.js"`, `ui: "dist/ui.html"`
- [ ] Task 7: Criar stubs mínimos `src/main.ts` e `src/ui/main.tsx` para validar build

---

## Branch

`chore/STORY-001-setup-projeto`

---

## Arquivos Envolvidos

- `package.json` — atualizar
- `manifest.json` — atualizar
- `tsconfig.json` — criar
- `tsconfig.node.json` — criar
- `vite.config.ts` — criar
- `tailwind.config.ts` — criar
- `postcss.config.js` — criar
- `src/main.ts` — criar (stub)
- `src/ui/main.tsx` — criar (stub)
- `src/ui/index.css` — criar

---

## Dependências

- Nenhuma (é a base de tudo)

---

## Riscos

- Vite dual build pode exigir configuração de rollup manual — verificar exemplos de figma-plugin-vite
- `@figma/plugin-typings` e DOM types conflitam — resolver via tsconfig separado para sandbox vs UI
