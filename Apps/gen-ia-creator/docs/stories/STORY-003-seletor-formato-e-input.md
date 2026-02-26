# STORY-003 — Seletor de formato Instagram e inputs de conteúdo

**Status:** InReview
**Agente:** @dev
**Criado:** 2026-02-25
**Estimativa:** M

---

## Descrição

Como usuária do gen.ia creator, quero selecionar o formato Instagram desejado e depois enviar uma foto de referência ou descrever o layout em texto para que o Claude saiba exatamente qual tipo de template gerar com as dimensões corretas.

---

## Acceptance Criteria

- [ ] AC1: Seletor exibe os 7 formatos Instagram com nome, dimensões e ícone/preview de proporção
- [ ] AC2: Apenas um formato pode estar selecionado por vez; seleção padrão: "Feed Quadrado (1080×1080)"
- [ ] AC3: Após selecionar formato, usuária pode escolher entre dois modos de input: "Enviar Foto" OU "Descrever em texto" (tabs ou toggle)
- [ ] AC4: Upload de foto aceita PNG, JPG, WEBP; preview da imagem exibido após seleção
- [ ] AC5: Campo de texto livre com placeholder "Ex: template para post de dica, fundo escuro, título grande, imagem à direita..."
- [ ] AC6: Botão "Gerar Template" fica desabilitado até que: formato selecionado + (foto OU texto preenchido)
- [ ] AC7: Imagem convertida para base64 antes de ser enviada ao Claude

---

## Tasks Técnicas

- [ ] Task 1: Criar `src/ui/components/FormatSelector.tsx` — grid de cards com os 7 formatos (nome + dimensões + proporção visual)
- [ ] Task 2: Criar `src/ui/components/ImageUpload.tsx` — dropzone + file input + preview + conversão para base64
- [ ] Task 3: Criar `src/ui/components/FormatDescriber.tsx` — textarea com contador de caracteres
- [ ] Task 4: Criar `src/ui/components/GenerateButton.tsx` — botão com estado desabilitado + loading spinner
- [ ] Task 5: Montar a tela Create em `src/ui/App.tsx` combinando os componentes acima

---

## Branch

`feat/STORY-003-seletor-formato-e-input`

---

## Arquivos Envolvidos

- `src/ui/components/FormatSelector.tsx` — criar
- `src/ui/components/ImageUpload.tsx` — criar
- `src/ui/components/FormatDescriber.tsx` — criar
- `src/ui/components/GenerateButton.tsx` — criar
- `src/ui/App.tsx` — atualizar (montar tela Create)

---

## Dependências

- STORY-001 (setup)
- STORY-002 (App.tsx com roteamento de telas)

---

## Riscos

- Imagens grandes podem extrapolar o limite de tokens do Claude — comprimir/redimensionar para max 1024px antes de converter para base64
- Figma plugin UI tem largura limitada (~340px) — adaptar grid de formatos para colunas menores
