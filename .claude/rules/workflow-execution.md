# Execução de Workflows — GEN.IA OS

## Seleção de Workflow

| Situação | Workflow |
|----------|----------|
| Projeto do zero | greenfield → spec-pipeline → SDC |
| Evoluir sistema existente | brownfield → spec-pipeline → SDC |
| Nova feature isolada | spec-pipeline → SDC |
| Corrigir bug | debug-sistematico → SDC |
| Sprint completa | planning → development → delivery |

## Chains Principais

**1. Spec Pipeline** (quando)
```
@analyst briefing → @pm PRD → @architect SPEC → @po aprovação
```

**2. Story Development Cycle (SDC)** (core do desenvolvimento)
```
@sm draft → @po valida → @dev implementa → @qa revisa → @reviewer code review → @devops push/PR
```

**3. QA Loop** (iterativo, máx 5x)
```
@qa revisa → @dev corrige → @qa re-revisa → (aprovado?) → @reviewer
```

**4. Delivery**
```
@pm decisão → @devops deploy → @pm valida → @pm comunica
```

## Princípio Task-First

Antes de executar qualquer ação, identificar qual task em `.genia/development/tasks/` se aplica:
- Criar PRD → usar `criar-prd.md`
- Criar SPEC → usar `criar-spec.md`
- Criar story → usar `criar-story.md`
- Implementar → usar `dev-implement.md`
- Revisar QA → usar `qa-review.md`
- Debug → usar `debug-sistematico.md`
- Code review → usar `code-review.md`

## Estado de Workflow

Ao iniciar workflow de múltiplas fases, criar registro em:
`.genia/session/workflow-state.md`

```markdown
# Workflow State
Workflow: spec-pipeline
Fase atual: 2 — PRD
Agente: @pm
Projeto: [nome]
Iniciado: YYYY-MM-DD
Próximo: @architect (SPEC-TECNICO)
```

## Complexidade e Estimativas

| Classe | Esforço | Uso |
|--------|---------|-----|
| P (Pequeno) | < 2h | Bug fix, texto, config |
| M (Médio) | 2-8h | Feature simples, CRUD |
| G (Grande) | 1-3 dias | Feature complexa, integração |
| XG (Extra Grande) | > 3 dias | Epic, refatoração grande |
