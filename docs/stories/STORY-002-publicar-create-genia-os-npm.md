# STORY-002 — Publicar create-genia-os no npm

**Status:** Done
**Agente:** @devops
**Criado:** 2026-03-23
**Estimativa:** P

## Descrição
Como usuária da GEN.IA SQUAD, quero que o pacote `create-genia-os` esteja publicado no npm para que qualquer pessoa possa instalar o GEN.IA OS com `npx create-genia-os` sem precisar clonar o repositório manualmente.

## Acceptance Criteria
- [ ] AC1: `npx create-genia-os meu-projeto` executa sem erro em máquina limpa
- [ ] AC2: Pacote visível em `npmjs.com/package/create-genia-os`
- [ ] AC3: Versão publicada é `2.0.0` com author `Elidy Izidio`
- [ ] AC4: README do pacote no npm descreve o propósito e o uso básico

## Tasks Técnicas
- [ ] Task 1: Verificar se o nome `create-genia-os` está disponível no npm
- [ ] Task 2: Adicionar `README.md` mínimo dentro de `.Apps/create-genia-os/` para exibição no npm
- [ ] Task 3: Executar `npm publish --access public` via @devops
- [ ] Task 4: Testar `npx create-genia-os` em diretório temporário

## Branch
`feat/STORY-002-publicar-npm`

## Arquivos Envolvidos
- `.Apps/create-genia-os/package.json`
- `.Apps/create-genia-os/bin/create.js`
- `.Apps/create-genia-os/README.md` (criar)

## Dependências
- Nenhuma

## Riscos
- Nome `create-genia-os` pode já estar ocupado no npm — verificar antes de publicar
- Repo é privado: o instalador clona via HTTPS, o que exige que o repo seja público no momento do clone
