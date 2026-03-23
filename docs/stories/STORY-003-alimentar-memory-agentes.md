# STORY-003 — Alimentar MEMORY.md dos agentes com dados reais

**Status:** InProgress
**Agente:** @dev
**Criado:** 2026-03-23
**Estimativa:** P

## Descrição
Como usuária, quero que os MEMORY.md de todos os agentes reflitam o contexto real do projeto (GEN.IA SQUAD, não "Be Data") e acumulem padrões e decisões já tomadas, para que cada agente ative com conhecimento útil desde o primeiro prompt.

## Acceptance Criteria
- [ ] AC1: Nenhum MEMORY.md contém "Be Data" — substituído por "GEN.IA SQUAD"
- [ ] AC2: Cada agente tem ao menos 2 entradas em "Padrões Confirmados" ou "Decisões Importantes"
- [ ] AC3: @analyst e @pm têm decisões de produto registradas (ex: modelo de negócio, renomeação)
- [ ] AC4: @devops tem o protocolo de push e flag documentados como padrão confirmado
- [ ] AC5: @architect tem as decisões de stack confirmadas (Synapse Engine, hooks Python, etc.)

## Tasks Técnicas
- [ ] Task 1: Corrigir referência "Be Data" → "GEN.IA SQUAD" em todos os MEMORY.md
- [ ] Task 2: Preencher @analyst/MEMORY.md com padrões de briefing e decisões de produto
- [ ] Task 3: Preencher @pm/MEMORY.md com decisões de roadmap e modelo de negócio
- [ ] Task 4: Preencher @architect/MEMORY.md com stack confirmada e decisões técnicas
- [ ] Task 5: Preencher @devops/MEMORY.md com protocolo de push e flag devops-active
- [ ] Task 6: Preencher @sm/MEMORY.md com convenções de story e numeração atual
- [ ] Task 7: Preencher @dev, @qa, @reviewer, @po com pelo menos padrões básicos

## Branch
`feat/STORY-003-memory-agentes`

## Arquivos Envolvidos
- `.claude/agent-memory/analyst/MEMORY.md`
- `.claude/agent-memory/pm/MEMORY.md`
- `.claude/agent-memory/architect/MEMORY.md`
- `.claude/agent-memory/devops/MEMORY.md`
- `.claude/agent-memory/sm/MEMORY.md`
- `.claude/agent-memory/dev/MEMORY.md`
- `.claude/agent-memory/qa/MEMORY.md`
- `.claude/agent-memory/reviewer/MEMORY.md`
- `.claude/agent-memory/po/MEMORY.md`

## Dependências
- Nenhuma

## Riscos
- Informações de memória desatualizadas podem guiar agentes errado — preferir menos e correto a mais e incorreto
