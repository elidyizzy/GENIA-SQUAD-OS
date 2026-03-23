# STORY-004 — Quickstart no README para novos usuários

**Status:** Done
**Agente:** @dev
**Criado:** 2026-03-23
**Estimativa:** P

## Descrição
Como novo usuário que chegou ao repositório pela primeira vez, quero encontrar uma seção de Quickstart clara com no máximo 3 comandos e um exemplo de primeiro prompt, para conseguir ter o GEN.IA OS funcionando em menos de 5 minutos.

## Acceptance Criteria
- [ ] AC1: Seção "Quickstart" aparece logo após a seção "O que é o GEN.IA OS" no README
- [ ] AC2: Máximo 3 comandos para ter o sistema instalado e pronto
- [ ] AC3: Exemplo de primeiro prompt demonstrando ao menos 2 agentes diferentes
- [ ] AC4: Link direto para o `create-genia-os` no npm
- [ ] AC5: Nota clara sobre preencher `.business/OWNER.md` como primeiro passo obrigatório

## Tasks Técnicas
- [ ] Task 1: Escrever seção Quickstart com instalação via `npx create-genia-os`
- [ ] Task 2: Adicionar exemplo de primeiro prompt end-to-end (ex: @analyst → @pm)
- [ ] Task 3: Inserir a seção no ponto correto do README (após intro, antes da arquitetura)

## Branch
`docs/STORY-004-quickstart-readme`

## Arquivos Envolvidos
- `README.md`

## Dependências
- STORY-002 (create-genia-os publicado no npm) — ideal ter antes, mas pode ser escrito em paralelo

## Riscos
- Quickstart com muitas etapas derrota o propósito — manter objetivo e direto
