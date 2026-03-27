# create-genia-os

<p align="center">
  <a href="https://www.npmjs.com/package/create-genia-os"><img src="https://img.shields.io/npm/v/create-genia-os.svg?style=flat-square" /></a>
  <img src="https://img.shields.io/badge/Claude%20Code-Compatible-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/Agentes-9%20%2B%20Squads-purple?style=flat-square" />
  <img src="https://img.shields.io/node/v/create-genia-os.svg?style=flat-square" />
  <img src="https://img.shields.io/npm/l/create-genia-os.svg?style=flat-square" />
</p>

> **Transforma o Claude Code em um time completo de especialistas.**
> 9 agentes de desenvolvimento + Squads de negócio, Synapse Engine, governança automática e documentação profissional — tudo em 30 segundos.

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

## Como funciona — o Synapse Engine

A cada prompt que você digita, um hook JavaScript (`synapse-engine.cjs`) roda em **menos de 100ms** e injeta o contexto certo automaticamente:

```
Você digita: "@dev implemente o login"
                    │
                    ▼
        Synapse Engine detecta "@dev"
                    │
                    ▼
    L0 — Constituição  (SEMPRE)
    L1 — Global + Contexto do projeto  (SEMPRE)
    L2 — Regras específicas do @dev  (detectado)
                    │
                    ▼
    Claude recebe prompt + contexto completo
    e responde como Neo, com as regras certas
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
| `synapse-engine.cjs` | Todo prompt | Injeta contexto em camadas |
| `enforce-git-push-authority.py` | Antes de Bash | **Bloqueia** push fora do @devops |
| `sql-governance.py` | Antes de Bash | **Bloqueia** DDL perigoso |
| `write-path-validation.py` | Antes de Write | Valida paths de arquivo |
| `precompact-session-digest.cjs` | Antes de compactar | Salva memória da sessão |

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

## Requisitos

- **Node.js** ≥ 18.0.0
- **Claude Code** (CLI da Anthropic)
- **VS Code** (recomendado)
- **Python 3.8+** (para hooks de governança)
- **Git**

---

## Documentação completa

[github.com/elidyizzy/GENIA-SQUAD-OS](https://github.com/elidyizzy/GENIA-SQUAD-OS)

---

*GEN.IA OS v2.1 · Criado por **Elidy Izidio** · Founder, GEN.IA SQUAD · 2026*
