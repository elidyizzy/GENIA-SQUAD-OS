# GEN.IA v2

> Sistema de desenvolvimento assistido por IA com SQUAD de 6 agentes especializados.

## Estrutura

```
.genia-v2/
├── CONSTITUTION.md          # Governanca e regras
├── MIGRATION-PLAN.md        # Plano de migracao v1 -> v2
├── README.md                # Este arquivo
│
├── development/
│   ├── agents/              # Definicao dos 6 agentes
│   │   ├── analyst.md       # @analyst - Analista de Negocios
│   │   ├── pm.md            # @pm - Product Manager
│   │   ├── architect.md     # @architect - Arquiteto
│   │   ├── dev.md           # @dev - Desenvolvedor
│   │   ├── qa.md            # @qa - Quality Assurance
│   │   └── reviewer.md      # @reviewer - Code Reviewer
│   │
│   ├── tasks/               # Tasks reutilizaveis
│   │   └── [tasks aqui]
│   │
│   └── workflows/           # Workflows do sistema
│       ├── planning.md      # Fase de planejamento
│       ├── development.md   # Fase de desenvolvimento
│       └── delivery.md      # Fase de entrega
│
├── skills/                  # Capacidades especializadas
│   ├── documents/           # /pdf, /xlsx, /docx, /pptx
│   ├── design/              # /canvas-design, /frontend-design
│   └── dev/                 # /mcp-builder, /webapp-testing
│
├── contexts/                # Bases de conhecimento
│   └── [contextos aqui]
│
└── mcp/                     # Configuracoes MCP
    └── [servidores mcp]
```

## Quick Start

### 1. Ativar Agente
```
@analyst    # Para coleta de requisitos
@pm         # Para gestao de produto
@architect  # Para decisoes tecnicas
@dev        # Para implementacao
@qa         # Para testes
@reviewer   # Para code review
```

### 2. Iniciar Workflow
```
@workflow planning [projeto]      # Iniciar planejamento
@workflow dev [story-id]          # Iniciar desenvolvimento
@workflow deploy [projeto]        # Iniciar deploy
```

### 3. Usar Skill
```
/pdf [acao]           # Manipular PDFs
/xlsx [acao]          # Manipular Excel
/frontend-design      # Design de interfaces
```

### 4. Carregar Contexto
```
@load-context kommo-crm
@load-context supabase
```

## Governanca

Ver [CONSTITUTION.md](CONSTITUTION.md) para:
- Hierarquia de agentes
- Quality gates
- Regras de commit
- Documentacao obrigatoria

## Migracao

Ver [MIGRATION-PLAN.md](MIGRATION-PLAN.md) para:
- Mapeamento de skills v1 -> v2
- Cronograma de migracao
- Checklist de validacao

---

*GEN.IA v2 - Be Data*
*Criado por Elidy Izidio*
