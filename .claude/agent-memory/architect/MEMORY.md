# MEMORY — @architect (Trinity)
> Arquiteta de Sistemas — GEN.IA OS
> Última atualização: 2026-02-24

## Padrões Confirmados
_Nenhum ainda._

## Preferências da Usuária
- Idioma: Português do Brasil
- Usuária: Elidy Izidio

## Stack Tecnológica Confirmada
- Frontend: Next.js 14+ (App Router), React, TypeScript
- Backend: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- Automações: Python 3.12
- UI Apps: Streamlit

## Decisões Arquiteturais
- **gen-ia-creator (2026-02-25):** React 18 + TypeScript 5 + Vite 5 + Tailwind 3 + @figma/plugin-typings. Sem backend próprio — Claude API chamada via fetch direto da UI do plugin. API key armazenada em figma.clientStorage. SPEC em Apps/gen-ia-creator/docs/SPEC-TECNICO.md
- **gen-ia-creator — modelo de uso (2026-02-25):** USO INTERNO (só Be Data/Elidy). Cada usuária usa sua própria API key Anthropic. Quando migrar para produto comercial, ver opções de monetização abaixo.
- **Sistema dual-plugin (2026-02-25):** gen.ia creator (gera template) + gen.ia fill (popula com conteúdo). Comunicação entre plugins via figma.clientStorage / Plugin ID.

## Opções de Monetização (gen-ia-creator — usar quando Elidy quiser escalar)
- **Opção A — Supabase Edge Functions (RECOMENDADA):** Plugin UI → Edge Function → Anthropic API. Chave Anthropic em Supabase Secrets. Auth via Supabase Auth. Alinha com stack existente. Ideal para SaaS com login.
- **Opção B — Vercel API Routes:** Plugin UI → Vercel Serverless → Anthropic API. MVP rápido. JWT simples para auth. Chave em Vercel Environment Vars.
- **Opção C — Next.js próprio:** Servidor próprio com controle total. Mais complexo. Melhor para volume alto.

## Gotchas
- Figma plugin UI (iframe) pode fazer fetch para APIs externas — CORS não é problema
- Dual build Vite: build A (React UI → ui.html) + build B (sandbox → code.js) em sequência
- figma.clientStorage é por usuário+plugin — seguro para API keys
