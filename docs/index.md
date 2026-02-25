---
layout: home
title: GEN.IA OS
---

# GEN.IA OS

**Sistema operacional de desenvolvimento com IA para Claude Code.**

Transforme o Claude Code em um time completo de 9 especialistas — com memória persistente, governança automática e qualidade enterprise.

```bash
npx create-genia-os meu-projeto
```

[Ver no GitHub](https://github.com/elidyizzy/GENIA-SQUAD-OS){: .btn} &nbsp; [Ver no npm](https://www.npmjs.com/package/create-genia-os){: .btn}

---

## O que é o GEN.IA OS

Ao invés de um assistente genérico, você tem um **SQUAD de 9 agentes especializados** que colaboram em um fluxo estruturado — do briefing ao deploy — com regras de autoridade, memória persistente e enforcement automático via hooks.

| Sem GEN.IA OS | Com GEN.IA OS |
|---------------|---------------|
| Assistente genérico | 9 especialistas com papéis definidos |
| Regras esquecidas entre prompts | Synapse Engine injeta contexto em cada prompt |
| Push sem controle | Hooks bloqueiam push não-autorizado automaticamente |
| Histórico perdido | Session Digest preserva memória antes de compactar |

---

## Os 9 Agentes Matrix

Cada agente tem persona, autoridade e restrições únicas. Ative mencionando `@agente` no Claude Code.

| Agente | Persona | Papel |
|--------|---------|-------|
| `@analyst` | **Cypher** | Analista de Negócios — requisitos e briefing |
| `@pm` | **Morpheus** | Product Manager — PRD, épicos, escopo |
| `@architect` | **Trinity** | Arquiteta — arquitetura e veto técnico |
| `@po` | **Oracle** | Product Owner — aprovação de stories |
| `@sm` | **Mouse** | Scrum Master — criação de stories |
| `@dev` | **Neo** | Desenvolvedor Full Stack — implementação |
| `@qa` | **Smith** | QA Engineer — qualidade e testes |
| `@reviewer` | **Switch** | Code Reviewer — aprovação de código |
| `@devops` | **Tank** | DevOps — git push, PR, releases |

---

## O Synapse Engine

O coração do sistema. Um hook JavaScript que roda automaticamente em **cada prompt** e injeta o contexto correto do agente ativo antes de enviar ao Claude.

```
Você digita: "@dev implemente o login"
                  │
    synapse-engine.cjs detecta @dev
                  │
    Injeta 3 camadas:
    L0 — Constituição (sempre)
    L1 — Global + Contexto
    L2 — Domínio de @dev
                  │
    Claude responde como Neo, Full Stack Dev
```

Timeout: 100ms. Graceful degradation se falhar.

---

## Governança Automática

5 hooks que rodam automaticamente — sem você precisar lembrar de nada:

- **enforce-git-push-authority** — Bloqueia push de qualquer agente que não seja `@devops`
- **sql-governance** — Bloqueia `DROP TABLE`, `TRUNCATE`, `DELETE` sem WHERE
- **write-path-validation** — Avisa sobre documentos criados fora do path padrão
- **precompact-session-digest** — Salva resumo da sessão antes de compactar contexto
- **synapse-engine** — Injeta contexto em cada prompt

---

## Instalar em 60 segundos

**Pré-requisitos:** Node.js ≥18, Claude Code, Python 3.8+, Git

```bash
# 1. Criar projeto com o wizard
npx create-genia-os meu-projeto

# 2. Abrir no VS Code
cd meu-projeto && code .

# 3. Começar
"@analyst quero criar [descreva seu projeto]"
```

O wizard configura tudo: nome, equipe, GitHub, idioma e stack.

---

## Documentação

A documentação completa está no repositório GitHub, incluindo:

- Constituição (6 artigos de governança)
- 8 workflows documentados
- 7 tasks reutilizáveis
- 5 checklists de qualidade
- 5 contextos de integração (Kommo, Supabase, WhatsApp, Next.js, API)
- 8 skills especializadas (PDF, Excel, Word, PowerPoint, Design, MCP, Testes)

[Ver documentação completa →](https://github.com/elidyizzy/GENIA-SQUAD-OS)

---

*GEN.IA OS v1.0 · [Be Data](https://github.com/elidyizzy) · Elidy Izidio · 2026*
