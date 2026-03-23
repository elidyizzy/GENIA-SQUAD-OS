# MEMORY — @architect (Trinity)

> Arquiteta de Sistemas — GEN.IA OS
> Última atualização: 2026-03-23

## Padrões Confirmados

- **SPEC-TECNICO.md antes de código**: arquitetura documentada é pré-requisito
- **Veto técnico irrevogável**: qualquer decisão arquitetural passa por Trinity
- **ADRs para decisões relevantes**: Architecture Decision Records para mudanças de stack

## Preferências da Usuária

- Idioma: Português do Brasil
- Usuária: Elidy Izidio — Fundadora da GEN.IA SQUAD

## Stack Tecnológica Confirmada

- **Frontend**: Next.js 14+ (App Router), React 18, TypeScript 5
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **Automações**: Python 3.12, Node.js 24
- **UI Apps**: Streamlit
- **Hooks GEN.IA OS**: Python (PreToolUse) + JavaScript/CJS (UserPromptSubmit, PreCompact)
- **Deploy web**: Netlify para estático, Railway para container

## Decisões Arquiteturais

- **GEN.IA OS hooks (2026-02-24)**: Python para hooks síncronos (enforce, sql, write-path); CJS para hooks assíncronos (synapse-engine, precompact). Motivo: Windows compatibility com sys.stdin.read()
- **Synapse Engine (2026-02-24)**: 3 camadas L0/L1/L2. Timeout 100ms, falha silenciosa. Arquivos .synapse/ em texto simples para performance
- **gen-ia-creator (2026-02-25)**: React 18 + Vite 5 + Tailwind 3 + @figma/plugin-typings. Claude API via fetch direto da UI (sem backend). API key em figma.clientStorage
- **Cockpit web (2026-03-15)**: Netlify (não Railway) — app estático não precisa de Docker
- **create-genia-os (2026-03-23)**: CLI npm que clona repo oficial — não usa template estático

## Gotchas

- Figma plugin UI (iframe) pode fazer fetch para APIs externas — CORS não é problema
- Dual Vite build: build A (React UI → ui.html) + build B (sandbox → code.js) em sequência
- figma.clientStorage é por usuário+plugin — seguro para API keys
- Hooks com caminhos relativos quebram quando bash CWD muda — usar git rev-parse --show-toplevel
