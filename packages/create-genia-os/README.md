# create-genia-os

[![npm version](https://img.shields.io/npm/v/create-genia-os.svg)](https://www.npmjs.com/package/create-genia-os)
[![node](https://img.shields.io/node/v/create-genia-os.svg)](https://nodejs.org)
[![license](https://img.shields.io/npm/l/create-genia-os.svg)](https://github.com/elidyizzy/GENIA-SQUAD-OS/blob/main/LICENSE)

> **GEN.IA OS** — Sistema operacional de desenvolvimento com IA para Claude Code.
> Configure um time completo de 9 agentes especializados, Synapse Engine e governança automática em segundos.

---

## Instalação

```bash
npx create-genia-os meu-projeto
```

O wizard interativo vai perguntar: nome do projeto, equipe, GitHub user/repo, idioma e stack. Em menos de 1 minuto você tem tudo configurado.

---

## O que você recebe

- **9 agentes Matrix** com papéis, personas e autoridades únicas (Neo, Trinity, Morpheus, Oracle, Smith, Cypher, Tank, Mouse, Switch)
- **Synapse Engine** — hook que injeta contexto correto em *cada* prompt automaticamente
- **5 hooks de governança** — enforcement automático de boas práticas (push bloqueado sem @devops, DDL SQL bloqueado, paths validados)
- **8 workflows** — do greenfield ao hotfix, com handoffs documentados
- **7 tasks reutilizáveis** — criar PRD, SPEC, story, implementar, QA, debug, code review
- **5 contextos** de integração — Kommo CRM, Supabase, WhatsApp Cloud, Next.js, API patterns
- **8 skills** especializadas — PDF, Excel, Word, PowerPoint, Frontend Design, Canvas, MCP Builder, Webapp Testing
- **Memória persistente** por agente — cada agente acumula conhecimento do projeto ao longo do tempo

---

## Os 9 Agentes

| Comando | Persona | Papel | Autoridade exclusiva |
|---------|---------|-------|---------------------|
| `@analyst` | Cypher | Analista de Negócios | Briefing, requisitos |
| `@pm` | Morpheus | Product Manager | PRD, épicos, escopo |
| `@architect` | Trinity | Arquiteta de Sistemas | Arquitetura, **veto técnico** |
| `@po` | Oracle | Product Owner | **Aprovação de stories** |
| `@sm` | Mouse | Scrum Master | **Criação de stories** |
| `@dev` | Neo | Desenvolvedor Full Stack | Implementação |
| `@qa` | Smith | QA Engineer | Veredictos de qualidade |
| `@reviewer` | Switch | Code Reviewer | Aprovação de código |
| `@devops` | Tank | DevOps Engineer | **git push, PR, releases** |

Ative qualquer agente mencionando `@agente` no seu prompt no Claude Code.

---

## Como funciona

```
Você digita: "@dev implemente o login"
                  │
                  ▼
     synapse-engine.cjs detecta "@dev"
                  │
     Carrega 3 camadas de contexto:
     L0 — Constituição (sempre)
     L1 — Global + Contexto do projeto
     L2 — Domínio específico de @dev (Neo)
                  │
                  ▼
     Claude recebe: prompt + contexto + regras
     Resultado: resposta precisa como @dev
```

O Synapse Engine roda em **cada prompt** via hook `UserPromptSubmit`. Timeout de 100ms, nunca bloqueia.

---

## Requisitos

- **Node.js** ≥ 18.0.0
- **Claude Code** (CLI da Anthropic)
- **VS Code** (recomendado)
- **Python 3.8+** (para os hooks de governança)
- **Git**

---

## Primeiros passos após instalar

```bash
# 1. Abra o projeto no VS Code com Claude Code
cd meu-projeto && code .

# 2. Inicie um projeto do zero
"@analyst quero criar [descreva seu projeto]"

# 3. Ou pule direto para uma story
"@sm crie a primeira story do projeto"
```

---

## Documentação completa

[github.com/elidyizzy/GENIA-SQUAD-OS](https://github.com/elidyizzy/GENIA-SQUAD-OS)

---

*GEN.IA OS v1.0 · Be Data · Elidy Izidio · 2026*
