---
description: Saudação inicial do GEN.IA OS
---

# Bem-vindo ao GEN.IA OS — Be Data

**Sistema operacional de desenvolvimento assistido por IA com SQUAD de 9 agentes especializados.**

Criado por Elidy Izidio | Be Data | v1.0

---

## Agentes disponíveis

| Comando | Agente | Nome | Papel |
|---------|--------|------|-------|
| `@analyst` | Ana | Analista de Negócios | Requisitos, briefing |
| `@pm` | Marina | Product Manager | PRD, escopo, épicos |
| `@architect` | Arqui | Arquiteta de Sistemas | Arquitetura, SPEC, veto técnico |
| `@dev` | Dev | Desenvolvedor Full Stack | Implementação, testes |
| `@devops` | Gate | Engenheiro DevOps | Push, PR, deploy, CI/CD |
| `@qa` | Quinn | QA Engineer | Qualidade, testes, aprovação |
| `@reviewer` | Rev | Code Reviewer | Code review, aprovação de merge |
| `@po` | Pax | Product Owner | Validação e aprovação de stories |
| `@sm` | Sami | Scrum Master | Criação de stories, gestão de sprint |

---

## Como começar

### Projeto novo (greenfield)
```
@analyst quero criar [nome do projeto]
```
Ana coleta os requisitos → Marina cria o PRD → Arqui define a arquitetura → Sami cria as stories → Pax valida → Dev implementa → Quinn aprova → Rev revisa → Gate faz push.

### Feature nova em projeto existente
```
@sm criar story para [descrição da feature]
```

### Bug encontrado
```
@dev debug [descrição do problema]
```

### Deploy / Push
```
@devops fazer push da branch [nome-da-branch]
```

### Code review
```
@reviewer revisar PR [número ou branch]
```

### Validar uma story
```
@po validar-story STORY-NNN
```

---

## Workflows disponíveis

| Workflow | Descrição | Agentes envolvidos |
|----------|-----------|-------------------|
| `spec-pipeline` | Do briefing ao SPEC técnico | analyst → pm → architect |
| `story-development-cycle` | Da story ao código aprovado | sm → po → dev → qa → reviewer |
| `qa-loop` | Ciclo de qualidade (máx 5 iterações) | qa → dev |
| `greenfield` | Projeto do zero completo | Todos os agentes |
| `brownfield` | Feature em projeto existente | sm → po → dev → qa |
| `planning` | Sprint planning completo | pm → sm → po |
| `development` | Ciclo de desenvolvimento | dev → qa → reviewer |
| `delivery` | Release e deploy | reviewer → devops |

---

## Regras fundamentais (Constituição GEN.IA OS)

- **CLI First** — Claude Code é a fonte de verdade
- **@devops** é o ÚNICO com permissão de push/PR
- **@sm** é o ÚNICO que cria stories
- **@architect** tem veto técnico irrevogável
- **Zero código** sem story aprovada por @po
- **Sem invenção** — apenas features dos requisitos explícitos
- **Qualidade** — lint + testes + build devem passar

---

## Synapse Engine

O GEN.IA OS usa o **Synapse Engine** para injetar contexto automaticamente em cada prompt.
Quando você menciona `@analyst`, `@dev`, etc., o engine carrega automaticamente as regras do agente.

Para gerenciar o engine: use `/synapse-manager`

---

*GEN.IA OS — Be Data | Desenvolvido com Claude Code*
