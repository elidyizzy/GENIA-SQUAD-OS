# Princípios IDS — GEN.IA OS
## Incremental Decision System

## Hierarquia de Decisão

```
REUSAR > ADAPTAR > CRIAR
```

Antes de criar qualquer artefato (componente, task, template, módulo, contexto):

**1. REUSAR** — Buscar no projeto algo que já resolve o problema
**2. ADAPTAR** — Se 70%+ compatível, adaptar o existente
**3. CRIAR** — Apenas se reutilização não é viável

## Onde Buscar Antes de Criar

| Tipo | Buscar em |
|------|-----------|
| Task | `.genia/development/tasks/` |
| Template de doc | `.claude/templates/` (se existir) |
| Contexto de API | `.genia/contexts/` |
| Skill | `.genia/skills/` |
| Guideline | `.genia/guidelines/` |
| Checklist | `.genia/development/checklists/` |

## Justificativa Obrigatória para CRIAR

Ao criar novo artefato que poderia ser reusado, documentar inline:

```
// NOVO: não foi possível reusar porque [razão]
// Adaptação de: [nada existente] | [X arquivo, mas incompatível por Y]
```

## Prevenção de Duplicação em Stories

Antes de criar `STORY-NNN`, verificar:
1. Existe story similar em `docs/stories/`?
2. Está dentro de um épico já existente?
3. Já foi implementado e mergeado?

## Circuit Breaker

Se a busca por artefato reutilizável demorar mais de 30 segundos, prosseguir com criação e documentar a tentativa de busca.

## Benefícios

- Reduz explosão de arquivos no projeto
- Mantém consistência entre implementações similares
- Facilita manutenção no longo prazo
- Evita reinventar soluções já validadas
