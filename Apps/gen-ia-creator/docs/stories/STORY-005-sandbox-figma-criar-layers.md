# STORY-005 — Sandbox Figma: criar template a partir do LayoutSpec

**Status:** InReview
**Agente:** @dev
**Criado:** 2026-02-25
**Estimativa:** G

---

## Descrição

Como usuária do gen.ia creator, quero que após o Claude retornar o LayoutSpec o plugin crie automaticamente um Frame no Figma com todas as layers nomeadas corretamente para que eu tenha um template pronto para usar com o gen.ia fill.

---

## Acceptance Criteria

- [ ] AC1: Ao receber mensagem `{ type: 'create-template', layout: LayoutSpec }`, `main.ts` cria um Frame no Figma com `width` e `height` do layout
- [ ] AC2: Para cada `LayerSpec` do tipo `TEXT`: cria TextNode com nome, posição, tamanho, fontSize, fontWeight, textColor aplicados
- [ ] AC3: Para cada `LayerSpec` do tipo `RECTANGLE`: cria RectangleNode com fillColor, cornerRadius e opacity aplicados
- [ ] AC4: Para cada `LayerSpec` do tipo `IMAGE_PLACEHOLDER`: cria RectangleNode cinza (`#333`) com nome `#img` para detecção pelo Plugin 2
- [ ] AC5: Layers nomeados seguem a convenção da SPEC: `"title"`, `"body"`, `"subtitle"`, `"#img"`, `"avatar"`, `"@handle"`
- [ ] AC6: Após criar, Figma faz scroll/zoom para o Frame criado (`figma.viewport.scrollAndZoomIntoView`)
- [ ] AC7: Sandbox envia `{ type: 'template-created', templateName }` para a UI após sucesso
- [ ] AC8: Erros de criação são capturados e enviados como `{ type: 'error', message }` para a UI

---

## Tasks Técnicas

- [ ] Task 1: Implementar `main.ts` completo — listener de mensagens + dispatcher para funções de criação
- [ ] Task 2: Implementar `createFrame(layout: LayoutSpec)` — cria Frame raiz com dimensões corretas
- [ ] Task 3: Implementar `createTextLayer(spec: LayerSpec, parent: FrameNode)` — cria TextNode com `loadFontSafe` + aplica estilos
- [ ] Task 4: Implementar `createRectLayer(spec: LayerSpec, parent: FrameNode)` — cria RectangleNode com fillColor (hexToRgb) + cornerRadius + opacity
- [ ] Task 5: Implementar `createImagePlaceholder(spec: LayerSpec, parent: FrameNode)` — RectangleNode cinza com nome `#img`
- [ ] Task 6: Implementar helper `hexToRgb(hex: string): RGB` — converte hex para Figma RGB (0-1 range)
- [ ] Task 7: Implementar `loadFontSafe(node: TextNode)` — tenta carregar fonte original, fallback para Inter Regular

---

## Branch

`feat/STORY-005-figma-sandbox-criar-layers`

---

## Arquivos Envolvidos

- `src/main.ts` — criar (implementação completa do sandbox)
- `src/types.ts` — usar (já criado na STORY-004)

---

## Dependências

- STORY-001 (setup — TypeScript + build)
- STORY-004 (types.ts com LayoutSpec e LayerSpec)

---

## Riscos

- `figma.loadFontAsync` pode falhar para fontes não instaladas — sempre fazer fallback para `{ family: 'Inter', style: 'Regular' }`
- `absoluteTransform` vs `x/y` — usar `node.x` e `node.y` para posicionamento relativo ao frame pai
- Criar TextNode requer `await figma.loadFontAsync()` ANTES de definir `node.characters` — ordem crítica
- Frame muito grande pode travar o Figma — validar que width/height são razoáveis (max 4096×4096)
