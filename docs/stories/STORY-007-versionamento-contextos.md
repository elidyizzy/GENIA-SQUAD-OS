# STORY-007 — Cabeçalhos de versão nos contextos de integração

**Status:** Done
**Agente:** @dev
**Criado:** 2026-03-23
**Estimativa:** P

## Descrição
Como agente do SQUAD carregando um contexto de API, quero que cada arquivo em `.genia/contexts/` tenha um cabeçalho com data de última atualização e versão da API documentada, para saber se o contexto está atualizado antes de usar suas informações.

## Acceptance Criteria
- [ ] AC1: Todos os 5 arquivos em `.genia/contexts/` têm cabeçalho padronizado
- [ ] AC2: Cabeçalho contém: `última_atualização`, `versão_api` e `status` (ativo/desatualizado)
- [ ] AC3: Template de cabeçalho documentado no próprio diretório ou no `.genia/README.md`
- [ ] AC4: Conteúdo existente dos contextos não foi alterado — apenas o cabeçalho foi adicionado

## Tasks Técnicas
- [ ] Task 1: Definir template padrão de cabeçalho para contextos
- [ ] Task 2: Adicionar cabeçalho em `kommo-crm.md`
- [ ] Task 3: Adicionar cabeçalho em `supabase.md`
- [ ] Task 4: Adicionar cabeçalho em `whatsapp-cloud.md`
- [ ] Task 5: Adicionar cabeçalho em `nextjs-react.md`
- [ ] Task 6: Adicionar cabeçalho em `api-patterns.md`

## Branch
`docs/STORY-007-versionamento-contextos`

## Arquivos Envolvidos
- `.genia/contexts/kommo-crm.md`
- `.genia/contexts/supabase.md`
- `.genia/contexts/whatsapp-cloud.md`
- `.genia/contexts/nextjs-react.md`
- `.genia/contexts/api-patterns.md`

## Dependências
- Nenhuma

## Riscos
- Baixo. Apenas adição de metadados — sem risco de quebrar funcionalidade
