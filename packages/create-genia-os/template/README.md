# {{PROJECT_NAME}}

> Powered by **GEN.IA OS** — Sistema operacional de desenvolvimento com IA

## Setup

Este projeto usa o [GEN.IA OS](https://github.com/elidyizzy/GENIA-SQUAD-OS) com Claude Code.

### Pré-requisitos

- [Claude Code](https://claude.ai/code) instalado
- Node.js 18+
- Python 3.10+
- Git

### Como usar

Abra o projeto no VS Code com Claude Code e chame um agente:

```
@sm crie a primeira story do projeto
@analyst faça um briefing sobre [funcionalidade]
@dev implemente a STORY-001
```

## Agentes disponíveis

| Agente | Nome | Papel |
|--------|------|-------|
| `@analyst` | Ana | Analista de Negócios |
| `@pm` | Marina | Product Manager |
| `@architect` | Arqui | Arquiteta de Sistemas |
| `@dev` | Dev | Desenvolvedor Full Stack |
| `@devops` | Gate | DevOps Engineer |
| `@qa` | Quinn | QA Engineer |
| `@reviewer` | Rev | Code Reviewer |
| `@po` | Pax | Product Owner |
| `@sm` | Sami | Scrum Master |

## Estrutura

```
{{PROJECT_NAME}}/
├── .claude/          ← Integração Claude Code
├── .genia/           ← Framework core
├── .synapse/         ← Runtime do Synapse Engine
├── docs/stories/     ← Stories do projeto
└── src/              ← Código-fonte
```

---

_Gerado com [create-genia-os](https://github.com/elidyizzy/GENIA-SQUAD-OS) — {{SETUP_DATE}}_
