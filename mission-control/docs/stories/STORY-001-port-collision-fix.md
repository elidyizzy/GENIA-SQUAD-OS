# STORY-001 — Tratar colisão de porta no boot do servidor

**Status:** Done
**Agente:** @po (Oracle) — aprovado
**Criado:** 2026-03-28
**Estimativa:** P

**Empresa:** GEN.IA SQUAD
**Projeto:** mission-control
**Responsável:** Elidy Izidio

---

## Descrição

Como desenvolvedora que roda o Mission Control localmente, quero que o servidor trate automaticamente a porta ocupada para que eu não precise matar processos manualmente sempre que esquecer o servidor aberto.

## Acceptance Criteria

- [ ] AC1: Se a porta 3001 estiver ocupada, o servidor tenta a próxima porta automaticamente
- [ ] AC2: O servidor exibe aviso claro no console indicando a troca de porta
- [ ] AC3: O servidor NÃO crasha com `EADDRINUSE` — trata o erro graciosamente
- [ ] AC4: O banner de boot exibe a porta real em uso (não hardcoded)

## Tasks Técnicas

- [x] Task 1: Extrair `printBanner` em função que recebe a porta como parâmetro
- [x] Task 2: Adicionar handler `server.on('error')` para `EADDRINUSE`
- [x] Task 3: Função `tryListen(port)` com fallback para `port + 1`
- [x] Task 4: Aplicar fix também na cópia instalada em `C:\Users\elidy\teste-mc`

## Branch

`fix/STORY-001-port-collision-fix`

## Arquivos Envolvidos

- `mission-control/server.js` (repo principal)
- `C:\Users\elidy\teste-mc\teste-missioncontrol\mission-control\server.js` (instalação de teste)

## Dependências

Nenhuma.

## Riscos

- Fix de porta incremental pode eventualmente acumular portas se o servidor for reiniciado muitas vezes sem fechar o anterior — aceitável para uso local
