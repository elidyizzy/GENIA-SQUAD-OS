# GEN.IA OS

> **O sistema operacional de desenvolvimento com IA mais avançado para Claude Code.**
> Um time completo de especialistas trabalhando com você — do briefing ao deploy, sem perder contexto, sem perder qualidade.

<p align="center">
  <img src="https://img.shields.io/badge/Claude%20Code-Compatible-blue?style=flat-square" />
  <img src="https://img.shields.io/npm/v/create-genia-os?style=flat-square&label=npm&color=green" />
  <img src="https://img.shields.io/badge/Agentes-9%20%2B%20Squads-purple?style=flat-square" />
  <img src="https://img.shields.io/badge/Idioma-PT--BR-yellow?style=flat-square" />
  <img src="https://img.shields.io/badge/Licença-MIT-gray?style=flat-square" />
</p>

---

## O problema que o GEN.IA OS resolve

Você usa Claude Code. Ele é inteligente. Mas toda sessão começa do zero.

Ele não sabe quem você é. Não sabe o que seu produto faz. Não tem regras que se mantêm entre prompts. Faz push quando não devia. Inventa contexto. Esquece decisões importantes.

**Resultado:** você repete o mesmo contexto toda sessão, corrige os mesmos erros, e perde horas que deveria estar construindo.

O GEN.IA OS resolve isso de forma definitiva.

---

## O que é o GEN.IA OS

O GEN.IA OS é um **sistema operacional para o Claude Code** — uma infraestrutura de arquivos, hooks e regras que transforma seu assistente genérico em um time completo de especialistas com memória persistente, papéis definidos e governança automática.

Você instala uma vez. Funciona em todos os projetos. Para sempre.

**Dois sistemas coexistem:**

| Sistema | O que faz |
|---------|-----------|
| **9 Agentes de Desenvolvimento** | Cypher, Morpheus, Trinity, Neo, Smith, Switch, Oracle, Mouse, Tank — constroem seu produto do briefing ao deploy |
| **Squads Xquads** | Ray Dalio, Dan Kennedy, Alex Hormozi, David Ogilvy e mais — consultores de negócio, estratégia e marketing disponíveis a qualquer momento |

---

## Instalação

```bash
npx create-genia-os meu-projeto
cd meu-projeto
code .
```

Isso é tudo. Em 30 segundos você tem 9 agentes especializados, o Synapse Engine ativo e a estrutura de documentação profissional pronta.

### Ou instale do repositório oficial (recomendado para projetos da Elidy)

```bash
git clone https://github.com/elidyizzy/GENIA-SQUAD-OS temp-genia-os
cp -r temp-genia-os/.claude .claude
cp -r temp-genia-os/.genia .genia
cp -r temp-genia-os/.synapse .synapse
cp -r temp-genia-os/.business .business
cp -r temp-genia-os/squads squads
rm -rf temp-genia-os
```

> Verificação obrigatória após instalação:
> ```bash
> grep -i "cypher\|neo\|tank\|trinity" .claude/CLAUDE.md
> ```
> Se não retornar — reinstale. Os agentes corretos são invioláveis.

---

## Como funciona

### O Synapse Engine — o coração do sistema

Cada vez que você digita um prompt, um hook JavaScript (`synapse-engine.cjs`) roda automaticamente em **menos de 100ms** e injeta o contexto certo antes da IA processar sua mensagem.

```
Você digita: "@dev implemente o login"
                    │
                    ▼
        Synapse Engine detecta "@dev"
                    │
                    ▼
    Injeta 3 camadas de contexto:

    L0 — Constituição  (SEMPRE)
         "Artigo II: @dev não pode fazer push..."

    L1 — Global + Contexto  (SEMPRE)
         Quem é você, qual projeto, quais prioridades

    L2 — Agente @dev  (quando detectado)
         Regras específicas do Neo, o que ele pode e não pode

    L2x — Agente Xquad  (quando detectado)
         Contexto de negócio + MEMORY.md do agente
                    │
                    ▼
    Claude recebe: seu prompt + contexto completo
    e responde como Neo, com as regras certas
```

**Resultado:** o Claude nunca esquece quem é, quem é você, ou quais são as regras — em nenhum prompt.

---

### Os Hooks de Governança — segurança automática

5 hooks ativos que rodam **antes** de qualquer ação crítica:

| Hook | Quando ativa | O que faz |
|------|-------------|-----------|
| `synapse-engine.cjs` | Todo prompt | Injeta contexto em camadas |
| `enforce-git-push-authority.py` | Antes de Bash | **Bloqueia** git push fora do @devops |
| `sql-governance.py` | Antes de Bash | **Bloqueia** DDL perigoso em produção |
| `write-path-validation.py` | Antes de Write | Avisa sobre paths incorretos |
| `precompact-session-digest.cjs` | Antes de compactar | Salva digest da sessão antes de perder contexto |

---

## Os 9 Agentes do SQUAD

Ative qualquer agente mencionando `@nome` no seu prompt. O contexto é injetado automaticamente.

```
PLANNING                              DEVELOPMENT                    ENTREGA
@analyst → @pm → @architect → @po → @sm → @dev → @qa → @reviewer → @devops
[Briefing] [PRD]   [Spec]    [Val] [Story] [Código] [Teste] [Review]  [Push]
```

### @analyst — Cypher
**Analista de Negócios**

Faz as perguntas certas antes de qualquer linha de código. Entrega um `BRIEFING.md` completo com requisitos, viabilidade e contexto de mercado.

```
@analyst quero criar um cockpit de vendas com IA nativa
```

---

### @pm — Morpheus
**Product Manager**

Transforma o briefing em produto. Cria PRD com épicos, MoSCoW, métricas de sucesso e roadmap. Dono do `docs/produto/`.

```
@pm crie o PRD para o cockpit de vendas
```

---

### @architect — Trinity
**Arquiteta de Sistemas**

A voz técnica máxima. Projeta arquitetura, escolhe stack, documenta decisões em ADRs. **Veto técnico irrevogável** — nenhuma decisão arquitetural passa sem ela.

```
@architect projete a arquitetura do sistema
```

---

### @po — Oracle
**Product Owner**

Valida stories com checklist de 10 pontos. Story com menos de 8 = rejeitada. Aprovação obrigatória antes de qualquer desenvolvimento começar.

```
@po valide a STORY-001
```

---

### @sm — Mouse
**Scrum Master**

O **único** que cria stories. Quebra épicos em tasks executáveis no formato correto. Nenhum outro agente toca em `docs/stories/`.

```
@sm crie as stories para o módulo de pipeline
```

---

### @dev — Neo
**Desenvolvedor Full Stack**

Implementa com qualidade enterprise. Commits locais, imports absolutos, TypeScript tipado. **git push bloqueado pelo hook** — exclusivo do @devops.

```
@dev implemente a STORY-003
```

---

### @qa — Smith
**QA Engineer**

Testa acceptance criteria, segurança, acessibilidade e performance. QA Loop com @dev (máx. 5 iterações). Nenhuma story passa para Done sem aprovação de Smith.

```
@qa revise a STORY-003
```

---

### @reviewer — Switch
**Code Reviewer**

Revisão técnica: clean code, padrões, segurança, performance. Emite LGTM ou CHANGES REQUESTED (bloqueante).

```
@reviewer faça code review da branch feat/STORY-003
```

---

### @devops — Tank
**DevOps Engineer**

O **único** com permissão de push, PR e release. Gerencia infraestrutura, CI/CD e MCP. Também é responsável por atualizar `docs/handover/` a cada sessão encerrada.

```
@devops faça push e crie o PR para a STORY-003
```

---

## Squads Xquads — Consultores de Negócio

O GEN.IA OS v2.1 introduz os **Squads Xquads**: agentes de estratégia, copy e negócio que trabalham ao lado do SQUAD de desenvolvimento.

**Regra de coexistência:**
```
Xquads RECOMENDAM → 9 agentes do SQUAD EXECUTAM
```

Os Xquads não fazem código. Não criam stories. Não fazem push.
Eles pensam, analisam e recomendam — e o SQUAD executa.

### Advisory Board

| Agente | Persona | Especialidade |
|--------|---------|---------------|
| `@ray-dalio` | Ray Dalio | Sistemas, ciclos, princípios de negócio |
| `@charlie-munger` | Charlie Munger | Modelos mentais, inversão, decisões |
| `@naval-ravikant` | Naval Ravikant | Alavancagem, modelo de negócio, pricing |

### Copy Squad

| Agente | Persona | Especialidade |
|--------|---------|---------------|
| `@dan-kennedy` | Dan Kennedy | Direct response, funil, copy que vende |
| `@david-ogilvy` | David Ogilvy | Posicionamento, copy com pesquisa |
| `@gary-halbert` | Gary Halbert | Cartas de venda, storytelling |

### Outros Squads

| Agente | Especialidade |
|--------|---------------|
| `@hormozi-offer` | Ofertas irresistíveis, pricing, garantias |
| `@brand-chief` | Identidade de marca B2B |
| `@marty-neumeier` | Diferenciação, Zag |
| `@cmo-architect` | Go-to-market, aquisição |
| `@cto-architect` | Decisões técnicas estratégicas |
| `@avinash-kaushik` | Analytics, KPIs, dashboards |
| `@sean-ellis` | Growth, PMF, North Star Metric |

### Exemplo de uso

```
@ray-dalio analise os riscos sistêmicos da nossa estratégia de entrada no mercado B2B

@dan-kennedy escreva o pitch de vendas para o SalesFlow.IA

@hormozi-offer monte uma estrutura de oferta para o plano Enterprise
```

O Synapse Engine detecta o `@xquad` e injeta automaticamente:
- Contexto de quem é você (`.business/OWNER.md`)
- Prioridades atuais (`.business/PRIORIDADES.md`)
- Contexto da empresa (`.business/GEN-IA-SQUAD/EMPRESA.md`)
- Memória do agente (`.claude/agent-memory/squads/[agente]/MEMORY.md`)

---

## Documentação Profissional Obrigatória

Todo projeto com GEN.IA OS instalado tem esta estrutura criada automaticamente:

```
docs/
├── produto/
│   ├── PRD.md            ← @pm (Morpheus)
│   ├── ROADMAP.md        ← @pm (Morpheus)
│   └── CHANGELOG.md      ← @devops (Tank)
├── tecnico/
│   ├── ARQUITETURA.md    ← @architect (Trinity)
│   ├── STACK.md          ← @architect (Trinity)
│   ├── SETUP.md          ← @dev (Neo)
│   ├── API.md            ← @dev (Neo)
│   ├── VARIAVEIS-AMBIENTE.md ← @dev (Neo)
│   ├── DEPLOY.md         ← @devops (Tank)
│   └── adr/              ← decisões arquiteturais
├── comercial/
│   ├── PITCH.md          ← @dan-kennedy + @ray-dalio
│   ├── PROPOSTA.md       ← @hormozi-offer
│   ├── ONBOARDING.md     ← @pm + @cmo-architect
│   └── CASOS-DE-USO.md   ← @pm + @david-ogilvy
├── stories/              ← @sm (Mouse)
└── handover/             ← @devops (Tank) — a cada sessão
```

**Regras invioláveis:**
- Nenhuma story começa sem PRD existente
- Nenhum deploy sem `DEPLOY.md` atualizado
- Toda decisão arquitetural vira ADR
- `CHANGELOG.md` atualizado a cada release
- `ONBOARDING.md` pronto antes do primeiro cliente

---

## Estrutura do Repositório

```
GENIA-SQUAD-OS/
├── .business/              ← Contexto de negócio (L0)
│   ├── OWNER.md            ← Quem é você — preencha primeiro
│   ├── ACORDOS.md          ← Contrato de trabalho com os agentes
│   ├── PRIORIDADES.md      ← O que está em foco agora
│   └── [empresa]/          ← Contexto por cliente/projeto
│
├── .claude/                ← Integração Claude Code
│   ├── CLAUDE.md           ← Master instructions dos agentes
│   ├── hooks/              ← 5 hooks de governança automática
│   ├── rules/              ← Regras do sistema
│   └── agent-memory/       ← MEMORY.md por agente (persistente)
│       └── squads/         ← MEMORY.md dos Xquads
│
├── .genia/                 ← Framework core
│   ├── CONSTITUTION.md     ← 6 artigos invioláveis
│   ├── development/        ← 9 agentes + 8 workflows + checklists
│   ├── contexts/           ← Bases de conhecimento técnico
│   └── skills/             ← Capacidades especializadas
│
├── .synapse/               ← Runtime do Synapse Engine
│   ├── constitution        ← L0 sempre ativa
│   ├── global              ← L1 sempre ativa
│   ├── context             ← L1 sempre ativa
│   └── agent-*/            ← L2 por agente detectado
│
├── squads/                 ← Agentes Xquads
│   ├── advisory-board/     ← Ray Dalio, Munger, Naval
│   ├── copy-squad/         ← Kennedy, Ogilvy, Halbert
│   ├── hormozi-squad/      ← Alex Hormozi
│   ├── brand-squad/        ← Brand Chief, Neumeier
│   ├── clevel-squad/       ← CMO, CTO Architect
│   └── data-squad/         ← Kaushik, Sean Ellis
│
├── docs/                   ← Documentação profissional obrigatória
└── packages/
    └── create-genia-os/    ← CLI de instalação (npm)
```

---

## A Constituição — 6 Artigos Invioláveis

| Artigo | Severidade | Regra |
|--------|-----------|-------|
| I — CLI First | **BLOQUEIO** | Claude Code é fonte de verdade |
| II — Autoridade | **BLOQUEIO** | @devops = único com push; @sm = único cria stories |
| III — Story-Driven | **OBRIG** | Zero código sem story aprovada pelo @po |
| IV — Sem Invenção | **OBRIG** | Apenas features dos requisitos explícitos |
| V — Qualidade Primeiro | **OBRIG** | Lint + testes + build devem passar |
| VI — Imports Absolutos | INFO | Sempre `@/`, nunca `../../../` |

---

## Por que o GEN.IA OS é diferente de um CLAUDE.md normal

A maioria das pessoas cria um `CLAUDE.md` com instruções. O Claude lê uma vez e vai esquecendo conforme a sessão avança.

O GEN.IA OS funciona diferente:

**1. Contexto injetado em CADA prompt** — não só no início da sessão. O Synapse Engine garante que as regras nunca se perdem, independente de quanto a conversa cresce.

**2. Governança automática** — os hooks rodam antes de ações críticas. Um agente errado tentando fazer push? O hook bloqueia antes mesmo de executar. SQL perigoso? Bloqueado automaticamente.

**3. Memória persistente por agente** — cada agente tem seu próprio `MEMORY.md` que acumula decisões entre sessões. Neo sabe o que foi decidido na semana passada. Tank sabe quais deploys foram feitos.

**4. Separação de responsabilidades real** — não é convenção, é enforcement. @dev fisicamente não consegue fazer push. @sm é o único que cria stories. Sem exceções.

**5. Dois sistemas de agentes** — o SQUAD de dev e os Xquads de negócio coexistem com regras claras: Xquads recomendam, SQUAD executa.

---

## Casos de Uso

**Fundadores e solopreneurs B2B**
Um único desenvolvedor com o GEN.IA OS tem a produtividade de um time de 5. O SQUAD garante que nada seja esquecido: do requisito ao deploy, com documentação profissional gerada automaticamente.

**Agências de desenvolvimento**
Instale o GEN.IA OS em cada projeto cliente. Cada repositório tem seu contexto próprio (`.business/`), seus agentes e sua documentação. Padronize a entrega sem padronizar o produto.

**Startups early-stage**
Fase 0-6 meses é quando mais se perde tempo repetindo contexto e corrigindo erros que não deveriam existir. O GEN.IA OS resolve isso estruturalmente, não com disciplina — com automação.

**Consultores e freelancers**
Os Squads Xquads transformam uma sessão de desenvolvimento em uma consulta estratégica completa. `@dan-kennedy` escreve o pitch enquanto `@neo` implementa o produto. Na mesma sessão.

---

## Quickstart em 5 minutos

```bash
# 1. Instalar
npx create-genia-os meu-projeto
cd meu-projeto

# 2. Personalizar (mais importante)
# Abra .business/OWNER.md e preencha com sua realidade

# 3. Ativar no VS Code com Claude Code
code .

# 4. Chamar seu primeiro agente
# "@analyst quero criar [seu projeto em uma frase]"
```

O Cypher vai fazer 5 perguntas, entregar um BRIEFING.md e acionar o Morpheus para o PRD. O time inteiro entra em ação a partir daí.

---

## Versões

| Versão | O que trouxe |
|--------|-------------|
| v1.0 | 9 agentes + Synapse Engine + 5 hooks de governança |
| v1.1 | Memória persistente por agente + session digests |
| v2.0 | Constituição formal + regras de instalação invioláveis |
| **v2.1** | **Squads Xquads + docs/ profissional obrigatório em todo projeto** |

---

## npm

```bash
npx create-genia-os@latest meu-projeto
```

[![npm](https://img.shields.io/npm/v/create-genia-os?style=flat-square)](https://www.npmjs.com/package/create-genia-os)

---

## Licença

MIT — use, modifique, distribua.

Se usar em projetos comerciais, crédito é apreciado mas não obrigatório.

---

<p align="center">
  <strong>Criado por Elidy Izidio</strong><br>
  Founder, GEN.IA SQUAD<br>
  <a href="https://github.com/elidyizzy">github.com/elidyizzy</a>
</p>

<p align="center">
  <em>Baseado em AIOS Core (MIT License, SynkraAI) — adaptado e reescrito para o contexto GEN.IA SQUAD</em>
</p>
