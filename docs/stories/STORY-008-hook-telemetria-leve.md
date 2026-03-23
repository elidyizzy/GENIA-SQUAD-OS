# STORY-008 — Hook de telemetria leve do SQUAD

**Status:** Done
**Agente:** @dev
**Criado:** 2026-03-23
**Estimativa:** G

## Descrição
Como usuária do GEN.IA OS, quero que o sistema registre automaticamente métricas leves de uso (stories criadas, agentes acionados, ciclos completos), salvas localmente em `.genia/metrics/`, para conseguir visualizar se o SQUAD está sendo usado e onde estão os gargalos.

## Acceptance Criteria
- [ ] AC1: Hook registra evento sempre que uma story muda de estado (Draft → Ready → InProgress → Done)
- [ ] AC2: Hook registra qual agente foi ativado em cada sessão
- [ ] AC3: Métricas salvas em `.genia/metrics/YYYY-MM.jsonl` (um registro por linha, formato JSON)
- [ ] AC4: Hook falha silenciosamente — nunca bloqueia o fluxo principal
- [ ] AC5: Arquivo `.genia/metrics/` adicionado ao `.gitignore` (dados locais, não versionados)
- [ ] AC6: Script de leitura simples `npm run metrics` exibe resumo no terminal

## Tasks Técnicas
- [ ] Task 1: Criar hook `metrics-tracker.cjs` em `.claude/hooks/`
- [ ] Task 2: Registrar em `settings.json` como PostToolUse (Write) — detecta criação/edição de STORY-*.md
- [ ] Task 3: Parsear estado da story no arquivo para registrar a transição
- [ ] Task 4: Detectar agente ativo via padrão `[@agente]` no prompt (UserPromptSubmit)
- [ ] Task 5: Criar script `scripts/metrics-summary.js` para exibir resumo
- [ ] Task 6: Adicionar `.genia/metrics/` ao `.gitignore`
- [ ] Task 7: Testar que falha no hook não bloqueia operação normal

## Branch
`feat/STORY-008-hook-telemetria`

## Arquivos Envolvidos
- `.claude/hooks/metrics-tracker.cjs` (criar)
- `.claude/settings.json`
- `scripts/metrics-summary.js` (criar)
- `.gitignore`

## Dependências
- Nenhuma técnica. Recomendado fazer após STORY-003 (memória dos agentes atualizada)

## Riscos
- Hook PostToolUse em Write pode ser chamado com alta frequência — manter operação O(1) sem I/O pesado
- Não expor dados de negócio nas métricas — registrar apenas metadados estruturais (tipo de evento, agente, timestamp)
