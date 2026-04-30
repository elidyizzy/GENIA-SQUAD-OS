# create-genia-os

<p align="center">
  <a href="https://www.npmjs.com/package/create-genia-os"><img src="https://img.shields.io/npm/v/create-genia-os.svg?style=flat-square" /></a>
  <img src="https://img.shields.io/badge/Claude%20Code-Compatible-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/Agentes-9%20%2B%20Squads-purple?style=flat-square" />
  <img src="https://img.shields.io/node/v/create-genia-os.svg?style=flat-square" />
  <img src="https://img.shields.io/npm/l/create-genia-os.svg?style=flat-square" />
</p>

> **Transforma o Claude Code em um time completo de especialistas.**
> 9 agentes de desenvolvimento + Squads de negócio, Synapse Engine com 4 camadas de contexto, governança automática e documentação profissional — tudo em 30 segundos.

---

## Instalação

```bash
npx create-genia-os meu-projeto
cd meu-projeto
code .
```

O wizard interativo configura nome do projeto, equipe, GitHub, idioma e stack. Em seguida, chame seu primeiro agente:

```
@analyst quero criar [seu projeto em uma frase]
```

---

## O que você recebe

### Sistema 1 — 9 Agentes de Desenvolvimento

Um time completo com papéis, personas e autoridades únicas. Cada agente sabe exatamente o que pode e o que não pode fazer.

| Agente | Persona | Papel | Autoridade exclusiva |
|--------|---------|-------|---------------------|
| `@analyst` | Cypher | Analista de Negócios | Briefing, requisitos, pesquisa |
| `@pm` | Morpheus | Product Manager | PRD, épicos, roadmap |
| `@architect` | Trinity | Arquiteta de Sistemas | Arquitetura, **veto técnico** |
| `@po` | Oracle | Product Owner | **Aprovação de stories** |
| `@sm` | Mouse | Scrum Master | **Criação exclusiva de stories** |
| `@dev` | Neo | Desenvolvedor Full Stack | Implementação (sem push) |
| `@qa` | Smith | QA Engineer | Veredictos de qualidade |
| `@reviewer` | Switch | Code Reviewer | Aprovação de código |
| `@devops` | Tank | DevOps Engineer | **git push, PR, releases** |

### Sistema 2 — Squads Xquads (negócio e estratégia)

Consultores de alto nível disponíveis a qualquer momento. Recomendam — o SQUAD executa.

| Squad | Agentes |
|-------|---------|
| Advisory Board | `@ray-dalio`, `@charlie-munger`, `@naval-ravikant` |
| Copy Squad | `@dan-kennedy`, `@david-ogilvy`, `@gary-halbert` |
| Hormozi Squad | `@hormozi-offer` |
| Brand Squad | `@brand-chief`, `@marty-neumeier` |
| C-Level Squad | `@cmo-architect`, `@cto-architect` |
| Data Squad | `@avinash-kaushik`, `@sean-ellis` |

```
@dan-kennedy escreva o pitch de vendas
@ray-dalio analise os riscos desta estratégia
@hormozi-offer monte a estrutura de oferta do plano Enterprise
```

---

## Como funciona — o Synapse Engine v2.1

A cada prompt que você digita, um hook JavaScript (`synapse-engine.cjs`) roda em **menos de 100ms** e injeta o contexto certo automaticamente em **4 camadas**:

```
Você digita: "@dev implemente o login"
                    │
                    ▼
        Synapse Engine v2.1 detecta "@dev" + projeto
                    │
                    ▼
    L0 — Constituição          (SEMPRE — regras invioláveis)
    L1 — Global + Contexto     (SEMPRE — quem é você, regras gerais)
    L2 — Regras do @dev        (detectado pelo @ no prompt)
    L3 — STATE.md do projeto   (NOVO — elimina trabalho genérico)
                    │
                    ▼
    Claude sabe: stack, stories, decisões arquiteturais,
    blockers, próximos passos — sem você repetir nada.
```

### L3 — GSD Context Layer (v2.3.0)

Inspirado no [GSD (get-shit-done)](https://github.com/gsd-build/get-shit-done), o Layer 3 resolve o problema do "Claude genérico": a cada sessão, o estado real do projeto é injetado automaticamente.

O arquivo `.planning/STATE.md` registra:
- Stack confirmada
- Stories por estado (Done / InProgress / Ready / Draft)
- Decisões arquiteturais tomadas
- Blockers ativos
- Contexto técnico crítico
- Próximos passos

**Resultado:** Claude nunca começa do zero em projetos que já têm histórico.

#### Slash commands incluídos

| Comando | O que faz |
|---------|-----------|
| `/project-state` | Exibe o estado atual do projeto ativo |
| `/project-sync` | Sincroniza o STATE.md após mudanças |
| `/plan-story NNN` | Converte STORY-NNN em XML tasks atômicas |

#### XML Tasks — execução sem ambiguidade

```xml
<tasks>
  <task type="auto">
    <name>Criar endpoint de leads</name>
    <files>src/routes/leads.ts</files>
    <action>POST /leads com validação Zod, retorna 201 com o lead criado</action>
    <verify>npm test -- leads.test</verify>
    <done>Todos os testes de leads passando</done>
  </task>
</tasks>
```

Para agentes Xquads, o engine injeta também:
- Quem é você (`.business/OWNER.md`)
- Prioridades atuais (`.business/PRIORIDADES.md`)
- Contexto da empresa
- Memória do agente (`.claude/agent-memory/squads/`)

---

## Governança automática — 5 hooks

| Hook | Quando ativa | O que faz |
|------|-------------|-----------|
| `synapse-engine.cjs` | Todo prompt | Injeta contexto L0→L1→L2→L3 |
| `enforce-git-push-authority.py` | Antes de Bash | **Bloqueia** push fora do @devops |
| `sql-governance.py` | Antes de Bash | **Bloqueia** DDL perigoso |
| `write-path-validation.py` | Antes de Write | Valida paths de arquivo |
| `precompact-session-digest.cjs` | Antes de compactar | Salva memória da sessão |

---

## Estrutura criada pelo wizard

```
meu-projeto/
├── .claude/
│   ├── CLAUDE.md          ← instruções dos 9 agentes
│   ├── hooks/             ← 5 hooks de governança
│   ├── rules/             ← regras do sistema
│   ├── agent-memory/      ← MEMORY.md por agente
│   └── commands/          ← slash commands (/project-state, /project-sync, /plan-story)
│
├── .genia/                ← framework core
├── .synapse/              ← runtime do Synapse Engine
├── .business/             ← contexto de negócio
│
├── .planning/             ← GSD Context Layer (NOVO v2.3.0)
│   ├── STATE.md           ← estado cross-session injetado automaticamente
│   └── stories/           ← STORY-NNN-PLAN.md com XML tasks
│
├── docs/
│   ├── produto/           ← PRD.md, ROADMAP.md, CHANGELOG.md
│   ├── tecnico/           ← ARQUITETURA.md, STACK.md, SETUP.md, API.md, adr/
│   ├── comercial/         ← PITCH.md, PROPOSTA.md, ONBOARDING.md
│   ├── stories/           ← STORY-NNN criadas pelo @sm
│   └── handover/          ← atualizado pelo @devops a cada sessão
│
└── squads/                ← Xquads de negócio
```

---

## Documentação profissional criada automaticamente

Todo projeto novo inclui:

```
docs/
├── produto/     PRD.md · ROADMAP.md · CHANGELOG.md
├── tecnico/     ARQUITETURA.md · STACK.md · SETUP.md · API.md · DEPLOY.md · adr/
├── comercial/   PITCH.md · PROPOSTA.md · ONBOARDING.md · CASOS-DE-USO.md
├── stories/     criadas pelo @sm (Mouse)
└── handover/    atualizado pelo @devops (Tank) a cada sessão
```

---

## A Constituição — regras que não se negociam

| Artigo | Regra |
|--------|-------|
| I — CLI First | Claude Code é fonte de verdade |
| II — Autoridade | @devops = único com push; @sm = único cria stories |
| III — Story-Driven | Zero código sem story aprovada pelo @po |
| IV — Sem Invenção | Apenas features dos requisitos explícitos |
| V — Qualidade | Lint + testes + build devem passar |

---

## Workflow completo

```
PLANNING                              DEVELOPMENT                    QA / DELIVERY
@analyst → @pm → @architect → @po → @sm → @dev → @qa → @reviewer → @devops
[Briefing] [PRD]  [SPEC+STATE]  [Val] [Story] [Código] [Teste] [Review]  [Push/PR]
                       ↑
                  STATE.md inicial
                  (injetado em L3)
```

Após cada story Done:
```
@dev ou @sm → /project-sync → STATE.md atualizado → próxima sessão já tem contexto
```

---

## Requisitos

- **Node.js** ≥ 18.0.0
- **Claude Code** (CLI da Anthropic)
- **VS Code** (recomendado)
- **Python 3.8+** (para hooks de governança)
- **Git**

---

## Changelog

### v2.3.0 — GSD Context Layer
- Synapse Engine v2.1 com camada L3 (injeção do estado do projeto)
- `.planning/STATE.md` criado automaticamente no scaffold
- 3 novos slash commands: `/project-state`, `/project-sync`, `/plan-story`
- XML task format no template de stories
- Inspirado no [GSD (get-shit-done)](https://github.com/gsd-build/get-shit-done)

### v2.2.0
- Squads Xquads completos (Advisory, Copy, Hormozi, Brand, C-Level, Data)
- Synapse Engine com L2x para agentes de negócio

### v2.1.0
- Synapse Engine com L0/L1/L2
- 5 hooks de governança
- Protocolo de novo projeto obrigatório

---

## Documentação completa

[github.com/elidyizzy/GENIA-SQUAD-OS](https://github.com/elidyizzy/GENIA-SQUAD-OS)

---

*GEN.IA OS v2.3.0 · Criado por **Elidy Izidio** · Founder, GEN.IA SQUAD · 2026*
