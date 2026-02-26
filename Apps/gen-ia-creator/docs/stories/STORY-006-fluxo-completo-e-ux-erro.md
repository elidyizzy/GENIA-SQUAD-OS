# STORY-006 — Fluxo end-to-end completo e UX de estados de erro

**Status:** InReview
**Agente:** @dev
**Criado:** 2026-02-25
**Estimativa:** M

---

## Descrição

Como usuária do gen.ia creator, quero que o plugin integre todos os componentes em um fluxo contínuo e que erros sejam exibidos de forma clara e acionável para que eu possa usar o plugin sem travar nem precisar reabri-lo.

---

## Acceptance Criteria

- [ ] AC1: Fluxo completo funciona sem erros: Selecionar formato → Upload/Descrever → Gerar → Template criado no Figma
- [ ] AC2: Durante a geração, UI exibe loading state com mensagem "Gerando template com Claude..." e spinner
- [ ] AC3: Após sucesso, UI exibe tela de resultado com nome do template criado e botão "Gerar outro"
- [ ] AC4: Se Claude falhar (JSON inválido após retry): exibe mensagem de erro específica + botão "Tentar novamente"
- [ ] AC5: Se timeout (>30s): mensagem "Tempo esgotado. Verifique sua conexão e tente novamente."
- [ ] AC6: Se erro 401 (API key inválida): mensagem "API key inválida. Verifique nas configurações." + link para tela de Setup
- [ ] AC7: Se erro 429 (rate limit): mensagem "Limite de requisições atingido. Aguarde alguns segundos."
- [ ] AC8: Botão "Gerar outro" reseta o estado da tela Create (formato e inputs limpos) sem fechar o plugin

---

## Tasks Técnicas

- [ ] Task 1: Criar `src/ui/components/LoadingState.tsx` — spinner + mensagem de progresso
- [ ] Task 2: Criar `src/ui/components/ResultState.tsx` — confirmação de sucesso + nome do template + botão "Gerar outro"
- [ ] Task 3: Criar `src/ui/components/ErrorState.tsx` — ícone de erro + mensagem específica por tipo + botão de ação (retry ou ir para Setup)
- [ ] Task 4: Atualizar `src/ui/App.tsx` — integrar estados: `'loading' | 'result' | 'error'` no roteamento
- [ ] Task 5: Conectar `GenerateButton` → `claude.ts` → `figma-bridge.ts` → listener de resposta do sandbox
- [ ] Task 6: Testar fluxo completo manualmente no Figma Desktop antes de marcar como Done

---

## Branch

`feat/STORY-006-fluxo-completo-e-ux-erro`

---

## Arquivos Envolvidos

- `src/ui/components/LoadingState.tsx` — criar
- `src/ui/components/ResultState.tsx` — criar
- `src/ui/components/ErrorState.tsx` — criar
- `src/ui/App.tsx` — atualizar (estados loading/result/error)

---

## Dependências

- STORY-002 (roteamento de telas no App.tsx)
- STORY-003 (componentes de input)
- STORY-004 (claude.ts + figma-bridge.ts)
- STORY-005 (sandbox main.ts)

---

## Riscos

- Comunicação UI ↔ sandbox é assíncrona via postMessage — garantir que o listener está montado ANTES de enviar a mensagem
- Múltiplos cliques em "Gerar" podem disparar múltiplas chamadas — desabilitar botão durante loading
- Testar com Figma Desktop real (não só build) — comportamento de clientStorage difere em ambiente de dev
