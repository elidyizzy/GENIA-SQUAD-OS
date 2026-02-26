# STORY-004 — Integração com Claude API (vision + JSON output)

**Status:** InReview
**Agente:** @dev
**Criado:** 2026-02-25
**Estimativa:** M

---

## Descrição

Como usuária do gen.ia creator, quero que ao clicar em "Gerar Template" o plugin envie minha foto ou descrição para o Claude e receba de volta um JSON estruturado com o layout do template para que o Figma possa criá-lo automaticamente.

---

## Acceptance Criteria

- [ ] AC1: Função `generateLayout()` em `claude.ts` recebe `{ apiKey, format, imageBase64?, description? }` e retorna `LayoutSpec`
- [ ] AC2: Chamada usa `fetch` nativo para `https://api.anthropic.com/v1/messages` com modelo `claude-sonnet-4-6`
- [ ] AC3: Prompt de sistema conforme SPEC-TECNICO; inclui o `LayoutSpec` schema como referência
- [ ] AC4: Se Claude retornar JSON inválido: 1 retry automático com instrução corretiva no prompt; se falhar novamente, lança erro
- [ ] AC5: Timeout de 30 segundos na chamada; se exceder, lança erro com mensagem clara
- [ ] AC6: Resposta do Claude é validada contra o schema `LayoutSpec` antes de retornar (campos obrigatórios presentes)
- [ ] AC7: `src/types.ts` exporta `LayoutSpec` e `LayerSpec` com todos os campos da SPEC (incluindo fillColor, textColor, cornerRadius, opacity)

---

## Tasks Técnicas

- [ ] Task 1: Criar `src/types.ts` com interfaces `LayoutSpec`, `LayerSpec`, `PluginToUI`, `UIToPlugin` conforme SPEC
- [ ] Task 2: Criar `src/ui/lib/claude.ts` com função `generateLayout()` — fetch para Anthropic API, prompt de sistema, parse do JSON
- [ ] Task 3: Implementar retry logic (1 tentativa extra com instrução "retorne apenas JSON válido, sem markdown")
- [ ] Task 4: Implementar validação de schema da resposta (checar campos obrigatórios: name, width, height, layers)
- [ ] Task 5: Criar `src/ui/lib/figma-bridge.ts` com helper `sendToPlugin(msg: UIToPlugin)` e listener `onPluginMessage(cb)`

---

## Branch

`feat/STORY-004-integracao-claude-api`

---

## Arquivos Envolvidos

- `src/types.ts` — criar
- `src/ui/lib/claude.ts` — criar
- `src/ui/lib/figma-bridge.ts` — criar

---

## Dependências

- STORY-001 (setup)
- STORY-003 (precisa do formato e input para testar)

---

## Riscos

- Anthropic API pode retornar texto antes do JSON (markdown fence) — usar regex para extrair JSON se necessário
- Imagem em base64 pode exceder token limit — limitar imagem a 1024×1024px antes de enviar (ver STORY-003)
- Rate limit da API — exibir mensagem amigável se erro 429
