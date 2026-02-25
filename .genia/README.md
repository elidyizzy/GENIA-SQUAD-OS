# GEN.IA OS — Framework de Desenvolvimento com IA

> Sistema operacional de desenvolvimento inteligente para times ágeis.
> Be Data | Criadora: Elidy Izidio | v1.0.0 | 2026-02-24

---

## O que é o GEN.IA OS?

O GEN.IA OS é um framework de governança de desenvolvimento de software que opera dentro do Claude Code. Ele organiza o trabalho em agentes especializados com autoridades claras, workflows definidos e checklists de qualidade — transformando o desenvolvimento com IA em um processo rastreável, profissional e sustentável.

**Não é um chatbot. É um sistema operacional.**

Cada "personagem" (@analyst, @dev, @architect, etc.) é um modo de operação com responsabilidades exclusivas, restrições de ação e outputs definidos. A Constituição é a lei. As stories são os contratos. A qualidade é inegociável.

---

## Princípios Fundamentais

1. **CLI First** — o Claude Code é a fonte de verdade
2. **Autoridade exclusiva** — cada agente tem domínio próprio
3. **Story-Driven** — nenhuma linha de código sem story aprovada
4. **Sem invenção** — apenas o que foi especificado é construído
5. **Qualidade primeiro** — lint + testes + build antes de qualquer entrega

---

## Quick Start

### Ativando um Agente

Para ativar um agente, use o prefixo `@` no prompt:

```
@analyst iniciar briefing do projeto Sistema de Agendamento
@pm criar PRD a partir do briefing em docs/agendamento/BRIEFING.md
@architect criar spec técnico para o projeto de agendamento
@sm criar story para tela de login do Épico E-01
@dev implementar STORY-001
@qa revisar STORY-001
@reviewer fazer code review do branch feat/STORY-001-login
@devops fazer push e criar PR do branch feat/STORY-001-login
@po validar STORY-001
```

### Iniciando um Projeto Novo (Greenfield)

```
@analyst iniciar spec-pipeline [nome-do-projeto]
```

Isso inicia o workflow Greenfield completo:
1. @analyst faz o briefing
2. @pm cria o PRD
3. @architect cria o SPEC-TECNICO
4. @devops configura o repositório e CI/CD
5. @sm e @po criam as primeiras stories
6. @dev implementa via SDC

### Evoluindo um Sistema Existente (Brownfield)

```
@architect iniciar discovery do repositório [nome-do-projeto]
```

Inicia o workflow Brownfield:
1. @architect mapeia arquitetura atual
2. @qa faz auditoria de qualidade
3. @architect analisa impacto das mudanças
4. @pm cria épico de evolução
5. @sm cria stories com consciência brownfield
6. Time executa SDC com atenção a regressão

---

## Agentes Disponíveis

| Agente | Nome | Especialidade | Ativar com |
|--------|------|--------------|-----------|
| @analyst | Ana | Análise de negócios, briefing | `@analyst` |
| @pm | Marina | Produto, PRD, escopo | `@pm` |
| @architect | Arqui | Arquitetura, SPEC, veto técnico | `@architect` |
| @dev | Dev | Implementação de código | `@dev` |
| @devops | Gate | Push, PR, release, CI/CD | `@devops` |
| @qa | Quinn | Qualidade, testes, veredictos | `@qa` |
| @reviewer | Rev | Code review, aprovação | `@reviewer` |
| @po | Pax | Validação de stories, backlog | `@po` |
| @sm | Sami | Criação de stories, sprint | `@sm` |

**Regra de Ouro:** apenas @devops faz `git push`. Apenas @sm cria stories formais.

---

## Workflows Disponíveis

| Workflow | Quando usar | Ativar com |
|---------|------------|-----------|
| spec-pipeline | Antes de qualquer projeto | `@analyst iniciar spec-pipeline` |
| story-development-cycle | Cada story | Fluxo automático do SDC |
| qa-loop | Durante revisão de qualidade | Parte do SDC |
| greenfield | Projeto novo do zero | `@analyst iniciar spec-pipeline` |
| brownfield | Sistema existente | `@architect iniciar discovery` |
| planning | Sprint planning | `@sm sprint-planning Sprint-XX` |
| development | Sprint ativo | Fluxo automático |
| delivery | Release/deploy | `@pm autorizar release vX.X.X` |

---

## Estrutura de Arquivos

```
.genia/
├── CONSTITUTION.md              # Lei máxima do GEN.IA OS
├── core-config.yaml             # Configuração central
├── README.md                    # Este arquivo
│
├── development/
│   ├── agents/                  # Perfis dos 9 agentes
│   │   ├── analyst.md
│   │   ├── pm.md
│   │   ├── architect.md
│   │   ├── dev.md
│   │   ├── devops.md
│   │   ├── qa.md
│   │   ├── reviewer.md
│   │   ├── po.md
│   │   └── sm.md
│   │
│   ├── workflows/               # 8 workflows de processo
│   │   ├── spec-pipeline.md
│   │   ├── story-development-cycle.md
│   │   ├── qa-loop.md
│   │   ├── greenfield.md
│   │   ├── brownfield.md
│   │   ├── planning.md
│   │   ├── development.md
│   │   └── delivery.md
│   │
│   ├── tasks/                   # 7 tasks de execução
│   │   ├── criar-prd.md
│   │   ├── criar-spec.md
│   │   ├── criar-story.md
│   │   ├── dev-implement.md
│   │   ├── qa-review.md
│   │   ├── debug-sistematico.md
│   │   └── code-review.md
│   │
│   └── checklists/              # 5 checklists de qualidade
│       ├── story-dod.md
│       ├── pre-commit.md
│       ├── qa-gate.md
│       ├── architecture-review.md
│       └── pre-deploy.md
│
├── contexts/                    # Contextos de integração (a adicionar)
└── guidelines/                  # Diretrizes complementares (a adicionar)
```

---

## Estrutura de Documentação do Projeto

O GEN.IA OS organiza a documentação do projeto em:

```
docs/
├── [projeto]/
│   ├── BRIEFING.md              # @analyst
│   ├── PRD.md                   # @pm
│   └── SPEC-TECNICO.md          # @architect
│
├── adr/
│   ├── ADR-001-[título].md      # @architect
│   └── ADR-XXX-[título].md
│
├── stories/
│   ├── STORY-001.md             # @sm
│   └── STORY-XXX.md
│
├── qa/
│   ├── RELATORIO-QA-STORY-XXX.md  # @qa
│   └── BUGS-STORY-XXX.md
│
├── reviews/
│   └── REVIEW-STORY-XXX.md     # @reviewer
│
├── sprint/
│   ├── SPRINT-XX-BACKLOG.md    # @sm
│   └── SPRINT-XX-RETRO.md
│
└── backlog/
    └── BACKLOG-[projeto].md    # @po
```

---

## Hierarquia de Autoridade

```
NÍVEL 3 — Decisão Final
└── @architect — veto técnico irrevogável

NÍVEL 2 — Gestão e Validação
├── @pm      — PRD, escopo, stakeholders
├── @po      — validação de stories, backlog
└── @analyst — requisitos, briefing

NÍVEL 1 — Execução
├── @dev      — código (SEM push)
├── @devops   — push, PR, deploy (ÚNICO com push)
├── @qa       — testes, veredictos de qualidade
├── @reviewer — code review, aprovação
└── @sm       — stories, sprint (ÚNICO que cria stories)
```

---

## Fluxo Completo de uma Feature

```
NEGÓCIO → TÉCNICA → CÓDIGO → QUALIDADE → ENTREGA

1. @analyst     coleta requisitos → BRIEFING.md
2. @pm          cria PRD → PRD.md
3. @architect   especifica tecnicamente → SPEC-TECNICO.md
4. @sm          cria story → STORY-XXX.md (Draft)
5. @po          valida story → STORY-XXX.md (Ready)
6. @dev         implementa → branch feat/STORY-XXX
7. @qa          revisa qualidade → Relatório QA
8. @reviewer    revisa código → Aprovação LGTM
9. @devops      faz push + PR → merge em main
10. @po         valida entrega → Done
11. @pm         autoriza release → @devops deploy
```

---

## Governança e Constituição

A Constituição GEN.IA OS (`.genia/CONSTITUTION.md`) define as regras invioláveis do sistema. Os 6 artigos principais:

- **Art. I** — CLI First (NÃO-NEGOCIÁVEL)
- **Art. II** — Autoridade do Agente (NÃO-NEGOCIÁVEL)
- **Art. III** — Story-Driven Development (OBRIGATÓRIO)
- **Art. IV** — Sem Invenção (OBRIGATÓRIO)
- **Art. V** — Qualidade Primeiro (OBRIGATÓRIO)
- **Art. VI** — Imports Absolutos (RECOMENDADO)

Emendas à Constituição requerem aprovação de @architect + @pm.

---

## FAQ

**Posso pular a validação de @po e ir direto para o desenvolvimento?**
Não. A validação de @po é obrigatória pela Constituição (Art. III). Pulá-la é violação direta.

**@dev pode fazer `git push` se @devops não estiver disponível?**
Não. `git push` é exclusivo de @devops (Art. II). Se @devops não está disponível, aguardar ou escalar para @architect para decisão.

**Posso implementar uma feature que não está no PRD se fizer sentido de negócio?**
Não. Art. IV proíbe explicitamente funcionalidades não especificadas. A solução é: documentar a ideia, solicitar @pm para adicionar ao PRD, criar story via @sm, validar com @po e então desenvolver.

**Qual é o número máximo de iterações do QA Loop?**
5 iterações. Após a 5ª sem aprovação, escalar para @architect + @pm.

**@analyst pode criar stories?**
Não. Apenas @sm cria stories formais (Art. II). @analyst pode sugerir stories para @sm criar.

---

## Sobre o GEN.IA OS

O GEN.IA OS foi criado por Elidy Izidio para a Be Data como um sistema operacional de desenvolvimento com IA que combina governança rigorosa com agilidade real. Inspirado na filosofia de que IA não substitui processos — ela os potencializa quando bem estruturada.

**Versão:** 1.0.0
**Ratificado em:** 2026-02-24
**Criadora:** Elidy Izidio
**Organização:** Be Data

---

*GEN.IA OS v1.0 — Be Data — Elidy Izidio*
