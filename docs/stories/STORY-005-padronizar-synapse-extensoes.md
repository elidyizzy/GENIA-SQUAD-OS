# STORY-005 — Padronizar extensões dos domínios .synapse/

**Status:** Done
**Agente:** @dev
**Criado:** 2026-03-23
**Estimativa:** M

## Descrição
Como desenvolvedora mantendo o GEN.IA OS, quero que os arquivos de domínio em `.synapse/` sigam uma convenção clara de extensão e formato, para que ferramentas de busca (Grep/Glob), linters e editores os reconheçam corretamente.

## Acceptance Criteria
- [ ] AC1: Todos os arquivos de domínio em `.synapse/` têm extensão definida (`.md` ou sem extensão — decisão documentada)
- [ ] AC2: `manifest` atualizado refletindo a convenção adotada
- [ ] AC3: Synapse Engine (`synapse-engine.cjs`) continua lendo os arquivos corretamente após a mudança
- [ ] AC4: Convenção documentada em `.synapse/README.md` ou no próprio `manifest`

## Tasks Técnicas
- [ ] Task 1: Listar todos os arquivos em `.synapse/` e mapear os que estão sem extensão
- [ ] Task 2: Decidir convenção: `.md` para conteúdo narrativo, sem extensão para dados de configuração
- [ ] Task 3: Renomear arquivos conforme convenção adotada
- [ ] Task 4: Atualizar referências no `synapse-engine.cjs` se necessário
- [ ] Task 5: Testar que o hook ainda injeta contexto corretamente após renomeação
- [ ] Task 6: Documentar a convenção no `manifest`

## Branch
`refactor/STORY-005-synapse-extensoes`

## Arquivos Envolvidos
- `.synapse/manifest`
- `.synapse/constitution`
- `.synapse/global`
- `.synapse/context`
- `.synapse/agent-*` (todos os domínios L2)
- `.claude/hooks/synapse-engine.cjs`

## Dependências
- Nenhuma

## Riscos
- Renomear arquivos que o synapse-engine.cjs referencia diretamente pode quebrar a injeção de contexto — testar imediatamente após cada renomeação
