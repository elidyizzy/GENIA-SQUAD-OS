# GEN.IA OS

> **Sistema Operacional de Desenvolvimento Assistido por IA**
> Be Data · Elidy Izidio · v1.0

---

## O que é o GEN.IA OS

O GEN.IA OS é um sistema operacional de desenvolvimento com IA que transforma o Claude Code em um **time completo de 9 especialistas** que trabalham com você 24 horas, com memória persistente, governança automática e qualidade enterprise.

A ideia central é simples: ao invés de você ter um único assistente genérico, você tem um **SQUAD de agentes especializados** — cada um com papel, persona, autoridade e restrições definidas — que colaboram em um fluxo estruturado do briefing ao deploy.

**O que diferencia o GEN.IA OS de um simples CLAUDE.md:**

| Sem GEN.IA OS | Com GEN.IA OS |
|---------------|---------------|
| Assistente genérico | 9 especialistas com papéis definidos |
| Regras esquecidas entre prompts | Synapse Engine injeta contexto em **cada prompt** |
| Código vai para produção sem revisão | Hooks bloqueiam push não-autorizado automaticamente |
| Histórico perdido ao compactar contexto | Session Digest salva memória antes de compactar |
| Sem separação de responsabilidades | Artigo II: @devops é o **único** com git push |
| Documentação é opcional | Constituição obriga PRD + SPEC antes de codar |

---

## Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                     VOCÊ (Elidy)                        │
│              faz uma pergunta ou pedido                 │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              SYNAPSE ENGINE  (automático)               │
│   UserPromptSubmit hook — roda em CADA prompt           │
│                                                         │
│   L0 Constituição → L1 Global + Contexto               │
│   L2 Agente detectado (@analyst, @dev, etc.)           │
│                                                         │
│   Resultado: <synapse-rules> injetado no prompt        │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  CLAUDE OPUS (IA)                       │
│     Recebe prompt + contexto injetado + regras         │
│     Executa como o agente correto                       │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              HOOKS DE GOVERNANÇA  (automáticos)         │
│                                                         │
│   PreToolUse → enforce-git-push-authority              │
│             → sql-governance                            │
│             → write-path-validation                    │
│   PreCompact → precompact-session-digest               │
└─────────────────────────────────────────────────────────┘
```

---

## Os 9 Agentes do SQUAD

Cada agente é uma especialização do Claude com persona, autoridade e restrições únicas. Para ativar, basta mencionar `@agente` no seu prompt.

### @analyst — Ana
**Analista de Negócios** · Exploradora · Gêmeos

Responsável pela fase de descoberta. Ana coleta e estrutura requisitos, faz pesquisa de mercado, analisa viabilidade e entrega um `BRIEFING.md` completo antes de qualquer linha de código ser discutida.

```
@analyst quero criar um sistema de agendamentos online para uma clínica
```

**Entrega:** `docs/[projeto]/BRIEFING.md`
**Passa para:** @pm

---

### @pm — Marina
**Product Manager** · Estrategista · Leão

Transforma o briefing em documentação de produto. Marina cria o PRD (Product Requirements Document) com épicos, features priorizadas por MoSCoW e métricas de sucesso. Também cria o COMERCIAL.md para apresentações.

```
@pm crie o PRD para o sistema de agendamentos
```

**Entrega:** `docs/[projeto]/PRD.md` + `docs/[projeto]/COMERCIAL.md`
**Passa para:** @architect

---

### @architect — Arqui
**Arquiteta de Sistemas** · Visionária · Escorpião

A voz técnica máxima. Arqui projeta a arquitetura, escolhe o stack tecnológico, documenta decisões em ADRs e cria o SPEC-TECNICO. Tem **veto técnico irrevogável** — nenhuma decisão arquitetural passa sem ela.

```
@architect projete a arquitetura e crie o SPEC-TECNICO
```

**Entrega:** `docs/[projeto]/SPEC-TECNICO.md` + ADRs
**Autoridade especial:** Veto em qualquer decisão técnica

---

### @po — Pax
**Product Owner** · Validador · Gêmeos

Valida as stories antes de ir para desenvolvimento. Pax usa um **checklist de 10 pontos** para garantir que cada story tem acceptance criteria claros, estimativa, branch definida e testes mapeados. Story com menos de 8 pontos = rejeitada.

```
@po valide a story STORY-001
```

**Autoridade especial:** Aprovação obrigatória antes de @dev começar

---

### @sm — Sami
**Scrum Master** · Facilitador · Aquário

O **único** que cria stories. Sami quebra épicos em stories no formato correto, gerencia o sprint e remove blockers. Nenhum outro agente cria `STORY-*.md`.

```
@sm crie as stories para o módulo de agendamentos
```

**Entrega:** `docs/stories/STORY-NNN-slug.md`
**Autoridade especial:** Criação exclusiva de stories

---

### @dev — Dev
**Desenvolvedor Full Stack** · Construtor · Áries

Implementa o código conforme o SPEC aprovado. Dev faz commits locais mas **nunca push** — isso é responsabilidade exclusiva do @devops. Trabalha em branches isoladas por story.

```
@dev implemente a STORY-003
```

**Entrega:** Código + testes unitários + commits locais
**Restrição:** git push **BLOQUEADO** pelo hook de governança

---

### @qa — Quinn
**QA Engineer** · Inspector · Virgem

Responsável pela qualidade. Quinn testa os acceptance criteria, executa verificações de segurança, acessibilidade e performance. Usa o **QA Loop** (máx 5 iterações) com @dev até a story estar pronta. Nenhuma story passa para Done sem aprovação de Quinn.

```
@qa revise a implementação da STORY-003
```

**Entrega:** Relatório QA + veredicto formal (APROVADO/REJEITADO)

---

### @reviewer — Rev
**Code Reviewer** · Crítico · Libra

Revisa o código do ponto de vista técnico: clean code, padrões, segurança, performance. Emite LGTM (aprovado) ou CHANGES REQUESTED (bloqueante).

```
@reviewer faça code review da branch feat/STORY-003
```

**Entrega:** Aprovação formal ou lista de mudanças obrigatórias

---

### @devops — Gate
**DevOps Engineer** · Guardião · Capricórnio

O **único** com permissão de fazer git push, criar PRs e executar releases. Gerencia também toda a infraestrutura e configuração de MCP. Nenhum deploy acontece sem Gate.

```
@devops faça push da branch feat/STORY-003 e crie o PR
```

**Autoridade especial:** git push, PR, releases, MCP — exclusivamente

---

## O Synapse Engine

O componente mais importante do GEN.IA OS. É um hook JavaScript que roda automaticamente em **cada prompt que você digita**.

### Como funciona

```
Você digita: "@dev implemente o login"
                    │
                    ▼
        synapse-engine.cjs lê o prompt
                    │
            Detecta "@dev" no texto
                    │
                    ▼
    Carrega 3 camadas de contexto:

    L0 — Constituição (sempre)
         "ART II: @dev não pode fazer push..."

    L1 — Global + Contexto (sempre)
         "Idioma PT-BR, identidade Be Data..."

    L2 — Agente @dev (detectado)
         "Dev Full Stack, commits locais, regras de implementação..."

                    │
                    ▼
    Injeta <synapse-rules> no prompt antes de enviar ao Claude

                    │
                    ▼
    Claude recebe: prompt + contexto certo + regras certas
    Resultado: resposta precisa como @dev
```

### Por que isso importa

Sem o Synapse Engine, o Claude "esquece" quem é o agente ativo depois de alguns turnos. Com ele, **cada prompt recebe o contexto correto automaticamente**, sem você precisar repetir instruções.

**Timeout:** 100ms — nunca bloqueia o fluxo.
**Graceful degradation:** Se falhar, o prompt segue normalmente.

---

## A Constituição

O documento mais importante do sistema. Seis artigos que todos os agentes devem respeitar — dois deles com **bloqueio automático** via hooks.

| Artigo | Nome | Severidade | O que significa |
|--------|------|-----------|-----------------|
| **I** | CLI First | BLOQUEIO | O Claude Code é a fonte de verdade. Dashboards observam, não controlam. |
| **II** | Autoridade | BLOQUEIO | @devops = único com push. @sm = único cria stories. @architect tem veto. |
| **III** | Story-Driven | OBRIGATÓRIO | Zero código sem story aprovada por @po. |
| **IV** | Sem Invenção | OBRIGATÓRIO | Agentes apenas implementam o que está nos requisitos. Nada além. |
| **V** | Qualidade | OBRIGATÓRIO | Lint + testes + build devem passar antes de qualquer entrega. |
| **VI** | Imports Absolutos | INFO | Usar `@/` sempre, nunca `../../../`. |

O Artigo IV é especialmente importante: ele impede que o Claude invente features, "melhorias" ou funcionalidades não solicitadas — um dos problemas mais comuns com IA em desenvolvimento.

---

## Os Hooks de Governança

Cinco scripts que executam automaticamente, **sem você precisar lembrar de nada**.

### `synapse-engine.cjs` — UserPromptSubmit
Injeta contexto em cada prompt. O coração do sistema. Ativo em 100% dos prompts.

### `precompact-session-digest.cjs` — PreCompact
Quando o Claude Code precisar compactar o contexto (sessão longa), este hook salva automaticamente um resumo em `.genia/session-digests/`. Você não perde histórico.

### `enforce-git-push-authority.py` — PreToolUse(Bash)
**Bloqueia git push** de qualquer agente que não seja @devops. Isso foi provado em tempo real durante a própria criação do GEN.IA OS — o hook bloqueou o push do Claude durante o setup.

### `write-path-validation.py` — PreToolUse(Write)
Avisa quando documentos (`PRD.md`, `SPEC-TECNICO.md`, `STORY-*.md`) são criados fora do path padrão. Não bloqueia — apenas avisa.

### `sql-governance.py` — PreToolUse(Bash)
Bloqueia DDL SQL perigoso executado diretamente (`DROP TABLE`, `TRUNCATE`, `DELETE` sem WHERE). Permite operações via `supabase migration new` — a forma correta.

---

## Os Workflows

8 workflows para diferentes situações de desenvolvimento.

### Spec Pipeline — Do zero à spec executável
```
@analyst → @pm → @architect → @po
[Briefing] → [PRD] → [SPEC-TECNICO] → [Aprovação]
```
Quando usar: início de qualquer projeto ou feature nova.

---

### Story Development Cycle (SDC) — O ciclo core
```
@sm → @po → @dev → @qa → @reviewer → @devops
[Story] → [Valida] → [Código] → [Testa] → [Review] → [Push/PR]
```
Quando usar: desenvolvimento de qualquer story aprovada.

---

### QA Loop — Iterações de qualidade
```
@qa revisa → @dev corrige → @qa re-revisa (máx 5x)
```
Quando usar: sempre que @dev entrega código para @qa.

---

### Greenfield — Projeto novo do zero
```
Spec Pipeline → @devops setup → Stories → SDC por story
```
Quando usar: novo produto, nova aplicação, novo repositório.

---

### Brownfield — Evoluir sistema existente
```
@architect discovery → @qa audit → impacto → épico → Stories → SDC
```
Quando usar: adicionar features em sistema já em produção.

---

### Planning — Sprint planning
```
@pm alinhamento → @architect review → @po priorização → sprint
```
Quando usar: início de uma sprint.

---

### Development — Sprint ativo
```
Daily async → WIP limits → blocker management → métricas
```
Quando usar: durante a execução do sprint.

---

### Delivery — Release para produção
```
@pm decisão → @devops deploy → @pm valida → comunicação
```
Quando usar: ao concluir uma sprint ou milestone.

---

## As Skills

Capacidades especializadas que qualquer agente pode invocar.

### Documentos
| Skill | Comando | O que faz |
|-------|---------|-----------|
| PDF | `/pdf` | Extrair texto, mesclar PDFs, dividir, preencher formulários |
| Excel | `/xlsx` | Criar planilhas com fórmulas, tabelas dinâmicas, análise de dados |
| Word | `/docx` | Criar e editar documentos Word formatados |
| PowerPoint | `/pptx` | Criar apresentações profissionais |

### Design
| Skill | Comando | O que faz |
|-------|---------|-----------|
| Frontend Design | `/frontend-design` | Design de interfaces, componentes, sistemas de design |
| Canvas Design | `/canvas-design` | Design gráfico, identidade visual, assets |

### Desenvolvimento
| Skill | Comando | O que faz |
|-------|---------|-----------|
| MCP Builder | `/mcp-builder` | Criar servidores MCP em 4 fases |
| Webapp Testing | `/webapp-testing` | Estratégia e execução de testes de aplicações web |

---

## Os Contextos

Bases de conhecimento especializadas. Carregue quando for trabalhar com aquela tecnologia.

```
@load-context [nome]
```

| Contexto | O que contém |
|----------|-------------|
| `kommo-crm` | Endpoints da API Kommo, autenticação, IDs de campos, webhooks |
| `supabase` | Padrões Supabase, RLS policies, Edge Functions, tipos TypeScript |
| `whatsapp-cloud` | WhatsApp Cloud API, webhooks, templates de mensagem |
| `nextjs-react` | Next.js 14+ App Router, padrões React, Server Components |
| `api-patterns` | REST design, autenticação JWT/OAuth, rate limiting, versionamento |

---

## Como Usar — Guia Prático

### Começar um projeto do zero

```
1. @analyst quero criar [descreva o projeto]
   → Ana coleta requisitos e entrega BRIEFING.md

2. @pm crie o PRD baseado no briefing
   → Marina estrutura o produto e entrega PRD.md

3. @architect projete a arquitetura
   → Arqui define stack e entrega SPEC-TECNICO.md

4. @sm quebre o PRD em stories para o primeiro sprint
   → Sami cria STORY-001, STORY-002...

5. @po valide as stories criadas
   → Pax aprova ou rejeita cada story

6. @dev implemente STORY-001
   → Dev implementa o código

7. @qa revise a STORY-001
   → Quinn testa e aprova

8. @reviewer faça code review
   → Rev aprova o código

9. @devops faça push e crie o PR
   → Gate faz push e abre PR no GitHub
```

---

### Corrigir um bug urgente

```
@dev debug [descreva o bug]
→ Dev usa o workflow debug-sistematico
→ Identifica causa raiz, implementa fix, documenta

@qa valide o fix
→ Quinn confirma que o bug foi resolvido

@devops push do fix
→ Gate faz push para a branch de fix
```

---

### Trabalhar em um sistema legado

```
@architect faça um discovery do sistema em [pasta]
→ Arqui mapeia o sistema atual

@qa faça auditoria de riscos e dívida técnica
→ Quinn identifica pontos frágeis

@pm crie um épico de evolução baseado no discovery
→ Marina estrutura o roadmap de melhorias
```

---

### Criar um documento profissional

```
/pdf criar um relatório de vendas em PDF com os dados de [arquivo]
/xlsx criar planilha de controle financeiro com fórmulas automáticas
/pptx criar apresentação do projeto para o cliente com 10 slides
```

---

### Integrar com APIs externas

```
@load-context kommo-crm
@dev implemente a integração com a API do Kommo para buscar leads

@load-context whatsapp-cloud
@dev crie o webhook para receber mensagens do WhatsApp
```

---

## Estrutura de Arquivos do Projeto

```
GENIA - SQUAD - OS/
│
├── .claude/                          ← Integração Claude Code
│   ├── CLAUDE.md                     ← Carregado automaticamente pelo Claude Code
│   ├── hooks/                        ← 5 hooks de governança ativos
│   │   ├── synapse-engine.cjs        ← Motor de contexto (roda em cada prompt)
│   │   ├── precompact-session-digest.cjs ← Preserva memória
│   │   ├── enforce-git-push-authority.py ← Bloqueia push não-autorizado
│   │   ├── write-path-validation.py  ← Valida paths de documentos
│   │   └── sql-governance.py         ← Bloqueia DDL SQL perigoso
│   ├── rules/                        ← 7 arquivos de regras modulares
│   │   ├── agent-authority.md        ← Quem pode fazer o quê
│   │   ├── agent-handoff.md          ← Protocolo de troca de agente
│   │   ├── agent-memory.md           ← Como a memória funciona
│   │   ├── story-lifecycle.md        ← Ciclo de vida de stories
│   │   ├── workflow-execution.md     ← Quando usar cada workflow
│   │   ├── ids-principles.md         ← Reusar > Adaptar > Criar
│   │   └── mcp-usage.md              ← Prioridade de ferramentas
│   ├── agent-memory/                 ← Memória persistente por agente
│   │   ├── analyst/MEMORY.md
│   │   ├── pm/MEMORY.md
│   │   ├── architect/MEMORY.md
│   │   ├── dev/MEMORY.md
│   │   ├── devops/MEMORY.md
│   │   ├── qa/MEMORY.md
│   │   ├── reviewer/MEMORY.md
│   │   ├── po/MEMORY.md
│   │   └── sm/MEMORY.md
│   ├── settings.json                 ← Permissões e hooks registrados
│   └── settings.local.json           ← Config local e hooks ativos
│
├── .genia/                           ← Framework core
│   ├── CONSTITUTION.md               ← Os 6 artigos constitucionais
│   ├── core-config.yaml              ← Configuração central
│   ├── development/
│   │   ├── agents/                   ← 9 definições completas de agentes
│   │   ├── workflows/                ← 8 workflows documentados
│   │   ├── tasks/                    ← 7 tasks reutilizáveis
│   │   └── checklists/               ← 5 checklists de qualidade
│   ├── skills/                       ← 8 skills especializadas
│   ├── contexts/                     ← 5 bases de conhecimento
│   └── guidelines/                   ← Padrões de código e testes
│
├── .synapse/                         ← Runtime do Synapse Engine
│   ├── manifest                      ← Registry de domínios
│   ├── constitution                  ← Domínio L0 (sempre ativo)
│   ├── global                        ← Domínio L1 (sempre ativo)
│   ├── context                       ← Domínio L1 (sempre ativo)
│   └── agent-[nome]                  ← Domínios L2 (por agente)
│
├── Apps/                             ← Seus projetos de apps
├── docs/
│   └── stories/                      ← STORY-NNN-slug.md
└── .gitignore
```

---

## O que o GEN.IA OS pode fazer por você

### Desenvolvimento de Software
- Criar projetos do zero com arquitetura documentada
- Evoluir sistemas legados com segurança
- Implementar features com ciclo completo (briefing → código → teste → deploy)
- Debug sistemático com identificação de causa raiz
- Code review automatizado com critérios claros

### Documentação de Produto
- PRDs profissionais com épicos e critérios de aceite
- Especificações técnicas (SPEC-TECNICO) com ADRs
- User Stories no formato correto (INVEST)
- Documentos comerciais para apresentação a clientes

### Qualidade e Governança
- Enforcement automático de boas práticas via hooks
- Checklist de QA antes de qualquer aprovação
- Definition of Done validado por @qa e @reviewer
- Histórico de sessões preservado via session digest

### Integrações
- Kommo CRM (relatórios, leads, automações)
- WhatsApp Cloud API (bots, webhooks)
- Supabase (banco de dados, autenticação, Edge Functions)
- Next.js (sites e apps modernos)

### Documentos e Apresentações
- Relatórios em PDF formatados
- Planilhas Excel com fórmulas e análises
- Documentos Word profissionais
- Apresentações PowerPoint para clientes

---

## Princípio de Design

O GEN.IA OS foi construído em cima de três pilares:

**1. Especialização > Generalização**
Um agente que só faz uma coisa faz muito bem. @qa não distrai com código. @dev não inventa arquitetura.

**2. Enforcement automático > Confiança cega**
Regras que não são automaticamente enforced não funcionam. Os hooks garantem que o Artigo II da Constituição seja respeitado mesmo quando o Claude "quer" fazer diferente.

**3. Memória distribuída > Memória única**
Cada agente aprende o que é relevante para seu papel. O MEMORY.md do @architect guarda decisões de stack. O do @qa guarda padrões de bugs encontrados. Isso acumula conhecimento especializado ao longo do tempo.

---

## Roadmap

### v1.0 (atual)
- 9 agentes com personas completas
- Synapse Engine (3 camadas)
- 5 hooks de governança
- 8 workflows
- 7 tasks reutilizáveis
- 5 checklists de qualidade
- 5 contextos de integração
- 8 skills especializadas

### v1.1 (próximo)
- Entity Registry — rastreamento de artefatos com checksums
- Workflow Intelligence — aprendizado de padrões de execução
- Autonomous Build Loop — @dev executa `*build STORY-NNN` de forma autônoma
- CodeRabbit integration — code review em CI/CD
- Project management adapters — ClickUp, Jira nativos

### v2.0 (futuro)
- Squad System — criar squads temáticos (marketing, dados, produto)
- IDE Sync — sincronizar agentes para Cursor e Copilot
- LLM Routing — rotear para Claude Free/Max por tipo de tarefa

---

## Créditos

**GEN.IA OS** foi criado por **Elidy Izidio** / **Be Data**.

Inspirado arquiteturalmente pelo [AIOS Core](https://github.com/SynkraAI/aios-core) (MIT License, SynkraAI). O Synapse Engine, o sistema de hooks, a estrutura de domínios `.synapse/` e os padrões de governance foram adaptados e reescritos para o contexto GEN.IA OS.

---

*GEN.IA OS v1.0 · Be Data · 2026*
