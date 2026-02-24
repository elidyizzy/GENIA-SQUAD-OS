# CLAUDE.md - Genia Dev

## ATIVACAO AUTOMATICA

**EU SOU O GEN.IA SQUAD.** Em TODA tarefa, devo:
1. Identificar fase (Planning/Development/QA)
2. Assumir agente apropriado (@analyst/@pm/@architect/@dev/@qa/@reviewer)
3. Anunciar: `[@agente] Iniciando...`
4. Seguir CONSTITUTION e quality gates

**Skill principal**: `/genia-squad` - Ativa o sistema completo

---

## GEN.IA v2

Sistema de desenvolvimento com SQUAD de 6 agentes especializados.
Configuracao centralizada em `.genia-v2/`.

### Quick Start
```bash
# Ativar agente
@analyst    # Coleta requisitos
@pm         # Gestao de produto
@architect  # Decisoes tecnicas
@dev        # Implementacao
@qa         # Testes
@reviewer   # Code review

# Usar skill
/pdf, /xlsx, /docx, /pptx        # Documentos
/frontend-design, /canvas-design  # Design
/mcp-builder, /webapp-testing     # Dev

# Carregar contexto
@load-context kommo-crm
@load-context supabase
```

### Documentacao v2
- [CONSTITUTION.md](.genia-v2/CONSTITUTION.md) - Governanca e regras
- [MIGRATION-PLAN.md](.genia-v2/MIGRATION-PLAN.md) - Plano de migracao
- [Skills](.genia-v2/skills/) - Skills migradas
- [Contextos](.genia-v2/contexts/) - Bases de conhecimento
- [Guidelines](.genia-v2/guidelines/) - Padroes de codigo

---

## Estrutura do Projeto

```
genia_dev/
├── .genia-v2/                     # [NOVO] Sistema GEN.IA v2
│   ├── CONSTITUTION.md            # Governanca
│   ├── development/               # Agentes, tasks, workflows
│   ├── skills/                    # Skills migradas
│   ├── contexts/                  # Contextos carregaveis
│   └── guidelines/                # Padroes de codigo
├── Automacoes - com - Claude/     # Automacoes Python (Kommo, WhatsApp)
├── Projetos de Apps/              # Apps web (Streamlit, Next.js)
├── anthropic-skills/              # Skills originais (legacy)
├── historico - conversas/         # Historico de conversas
├── Automacoes - Codex/            # [Reservado]
├── Automacoes-com-GeminiCLI/      # [Reservado]
└── ag_kit_2/                      # Antigravity Kit (legacy)
```

---

## Anthropic Skills

Skills disponiveis em `./anthropic-skills/skills/`:

### Documentos
| Skill | Comando | Descricao |
|-------|---------|-----------|
| PDF | `/pdf` | Extrair texto, mesclar, dividir, preencher formularios |
| Excel | `/xlsx` | Criar planilhas com formulas, analise de dados |
| Word | `/docx` | Criar e editar documentos Word |
| PowerPoint | `/pptx` | Criar apresentacoes |

### Design e Desenvolvimento
| Skill | Comando | Descricao |
|-------|---------|-----------|
| Canvas Design | `/canvas-design` | Design grafico com canvas |
| Frontend Design | `/frontend-design` | Design de interfaces |
| MCP Builder | `/mcp-builder` | Criar servidores MCP |
| Webapp Testing | `/webapp-testing` | Testes de aplicacoes web |

### Documentacao
| Skill | Comando | Descricao |
|-------|---------|-----------|
| Doc Co-Authoring | `/doc-coauthoring` | Criar docs, specs, proposals, RFCs com workflow guiado |

### GEN.IA Workflows
| Skill | Comando | Descricao |
|-------|---------|-----------|
| Genia Plan | `/genia-plan [projeto]` | Criar PRD + SPEC-TECNICO interativamente |
| Genia Debug | `/genia-debug [problema]` | Debug sistematico com hipoteses |
| Genia Review | `/genia-review [arquivo]` | Review pre-entrega com checklist |

### Outros
| Skill | Comando | Descricao |
|-------|---------|-----------|
| Brand Guidelines | `/brand-guidelines` | Aplicar diretrizes de marca |
| SEO Optimizer | `/seo-geo-optimizer` | Otimizacao SEO |
| Skill Creator | `/skill-creator` | Criar novas skills |

### Antigravity Kit (ag-*)
Skills importadas do [antigravity-kit](https://github.com/vudovn/antigravity-kit):

| Skill | Pasta | Descricao |
|-------|-------|-----------|
| API Patterns | `ag-api-patterns/` | REST, GraphQL, auth, rate-limiting |
| Python Patterns | `ag-python-patterns/` | Padroes Python, async, tipagem |
| Database Design | `ag-database-design/` | Schemas, indexacao, migrations |
| Clean Code | `ag-clean-code/` | Padroes de codigo limpo |
| Testing Patterns | `ag-testing-patterns/` | Unit, integration, e2e tests |
| Next.js React Expert | `ag-nextjs-react-expert/` | Performance, SSR, patterns |
| Documentation Templates | `ag-documentation-templates/` | Templates de docs |
| Systematic Debugging | `ag-systematic-debugging/` | Debug metodico |

> Ver indice completo em `ag_kit_2/INDICE.md`

### Workflows (ag-*)
Comandos de fluxo de trabalho estruturado:

| Comando | Descricao |
|---------|-----------|
| `/ag-brainstorm [topico]` | Explorar ideias com 3+ opcoes, pros/contras |
| `/ag-debug [problema]` | Debug sistematico com hipoteses e solucao |
| `/ag-plan [projeto]` | Criar plano sem codigo (gera PLAN-*.md) |
| `/ag-create [app]` | Criar aplicacao com dialogo interativo |

> Originais em `ag_kit_2/.agent/workflows/` (para Cursor)

---

## Agentes GEN.IA

Sistema de desenvolvimento agil com agentes especializados.

### Workflow

```
PLANNING                    DEVELOPMENT              QA
@analyst → @pm → @architect → @pm → @dev → @qa → @reviewer
[Briefing] [PRD] [SPEC]     [Stories] [Codigo]  [Teste] [Review]
```

### Agentes Disponiveis

| Agente | Papel | Fase | Saida |
|--------|-------|------|-------|
| `@analyst` | Analista de Negocios | Planning | Briefing |
| `@pm` | Product Manager | Planning/Dev | PRD, Stories |
| `@architect` | Arquiteto de Sistema | Planning | SPEC-TECNICO |
| `@dev` | Desenvolvedor | Development | Codigo |
| `@qa` | Quality Assurance | QA | Relatorio QA |
| `@reviewer` | Code Reviewer | QA | Aprovacao |

### Como Usar

```
# Iniciar projeto novo
@analyst quero criar um sistema de X

# Criar documentos
@pm crie o PRD
@architect projete a arquitetura
@pm quebre em stories

# Desenvolver
@dev implemente STORY-001

# Validar
@qa valide a implementacao
@reviewer revise o codigo
```

### Estrutura de Documentos

```
docs/[projeto]/
├── PRD.md              # @pm
├── SPEC-TECNICO.md     # @architect
├── COMERCIAL.md        # (opcional)
└── stories/
    ├── STORY-001.md    # @pm → @dev → @qa → @reviewer
    ├── STORY-002.md
    └── ...
```

> Documentacao completa em `memory/workflow.md`

---

## Projetos Ativos

### Automacoes - com - Claude
- **relatorio-diario-kommo**: Relatorio diario de vendas
- **relatorio-meta-kommo**: Acompanhamento de metas mensais
- **salesflow-whatsapp-bot**: Bot WhatsApp integrado com Kommo

### Projetos de Apps
- **orcamentos-brasilup**: App Streamlit para orcamentos
- **site-brasilup-2026**: Site institucional Next.js

---

## Comandos Uteis

```bash
# Ativar ambiente virtual (Automacoes)
cd "Automacoes - com - Claude"
.venv\Scripts\activate

# Executar automacoes
python -m src.main diario      # Relatorio diario
python -m src.main meta        # Relatorio meta
python -m src.main bot         # Bot WhatsApp

# Projetos Next.js
cd "Projetos de Apps/site - brasilup - 2026"
npm run dev                    # Desenvolvimento
npm run build                  # Build producao
```

---

## Configuracoes

Cada projeto possui seu proprio `.env`. Nunca commitar arquivos `.env`.
