# STORY-002 — Tela de configuração da API Key Anthropic

**Status:** InReview
**Agente:** @dev
**Criado:** 2026-02-25
**Estimativa:** P

---

## Descrição

Como usuária do gen.ia creator, quero configurar minha API key da Anthropic na primeira vez que abro o plugin para que o plugin possa chamar o Claude e gerar templates sem expor minha chave no código.

---

## Acceptance Criteria

- [ ] AC1: Se não há API key salva, plugin abre direto na tela de Setup (não na tela Create)
- [ ] AC2: Campo de input tipo "password" (caracteres ocultos) para a API key
- [ ] AC3: Botão "Salvar" armazena a chave em `figma.clientStorage` com a key `geniaCreatorApiKey`
- [ ] AC4: Após salvar com sucesso, plugin navega automaticamente para a tela Create
- [ ] AC5: Link "Alterar API Key" visível na tela Create para voltar ao Setup
- [ ] AC6: API key inválida (não começa com `sk-ant-`) exibe mensagem de erro inline antes de salvar

---

## Tasks Técnicas

- [ ] Task 1: Criar `src/ui/components/ApiKeySetup.tsx` — formulário com input password + validação + botão salvar
- [ ] Task 2: Criar `src/ui/App.tsx` com roteamento entre telas: `'setup' | 'create' | 'result'`
- [ ] Task 3: Implementar lógica de verificação: ao montar App, checar `figma.clientStorage.getAsync('geniaCreatorApiKey')` e redirecionar
- [ ] Task 4: Estilizar com Tailwind usando tokens GEN.IA OS (dark theme, indigo primary)

---

## Branch

`feat/STORY-002-api-key-setup`

---

## Arquivos Envolvidos

- `src/ui/App.tsx` — criar (roteamento de telas)
- `src/ui/components/ApiKeySetup.tsx` — criar

---

## Dependências

- STORY-001 (setup do projeto deve estar concluído)

---

## Riscos

- `figma.clientStorage` é async — garantir que o app não renderize a tela errada enquanto resolve a Promise
