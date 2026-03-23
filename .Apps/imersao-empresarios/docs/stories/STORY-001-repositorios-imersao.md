# STORY-001 — Preparar Repositórios para Clone da Imersão

**Status:** Ready
**Projeto:** GEN.IA Imersão — Empresários
**Empresa:** GEN.IA SQUAD
**Agente:** @dev (implementação) → @qa (validação) → @devops (push)
**Criado:** 2026-03-13
**Estimativa:** G (1-3 dias)

---

## Descrição

Como aluna da GEN.IA Imersão, quero clonar os sistemas já criados pela Elidy e adaptá-los para o meu negócio em 2 dias — sem precisar construir nada do zero e sem travar em configurações técnicas.

---

## Contexto

Esta é a primeira tarefa técnica do projeto `imersao-empresarios`. Antes de qualquer página de vendas, conteúdo ou lançamento — os repositórios precisam existir, funcionar e serem testáveis por alguém que nunca programou.

Os sistemas já existem em produção na BrasilUp. O trabalho aqui é **organizar, genericizar e documentar** para que um empresário sem background técnico consiga clonar e adaptar em até 2 horas durante a imersão.

**Referência de estrutura:** `ESTRUTURA-TECNICA-IMERSAO.md` em `docs/`

---

## Os 4 Repositórios a Preparar

### 1. `agente-luma` — PRIORIDADE MÁXIMA
Base: agente Luma da BrasilUp (já existe)
Genericizar: remover dados específicos da BrasilUp, criar sistema de configuração

### 2. `mini-crm-kanban` — PRIORIDADE ALTA
Base: criar do zero (sistema simples, não existe ainda)
Requisito: pipeline visual, configurável por JSON, sem banco de dados externo

### 3. `landing-page-template` — PRIORIDADE ALTA
Base: `site-brasilup-2026` ou criar template limpo
Genericizar: remover identidade BrasilUp, criar sistema de config por JSON

### 4. `ors-orcamentos` — PRIORIDADE MÉDIA (bonus do Dia 1)
Base: `orcamentos-brasilup` (já existe)
Genericizar: remover dados específicos da BrasilUp

---

## Acceptance Criteria

### Para cada repositório:
- [ ] Funciona com clone limpo em máquina nova (testar do zero)
- [ ] Tem `README.md` escrito em linguagem de não-programador — sem jargão técnico
- [ ] Tem `.env.example` com todas as variáveis necessárias documentadas
- [ ] Tem `config/negocio.json` — arquivo único que o aluno preenche para personalizar
- [ ] Tem comentários no código explicando o que cada bloco faz
- [ ] Não contém dados reais da BrasilUp (CNPJ, telefones, preços, nomes)

### Para o conjunto:
- [ ] Uma pessoa sem background técnico consegue clonar e configurar em até 2h
- [ ] Os 4 repositórios funcionam integrados entre si
- [ ] Existe um repositório `genia-imersao` que agrega os 4 como submódulos ou links

---

## Tasks Técnicas

### `agente-luma`
- [ ] Copiar código da Luma para repositório novo
- [ ] Criar `config/negocio.json` com: nome, produtos/serviços, preços, perguntas de qualificação
- [ ] Criar `prompts/briefing-template.md` — template que o aluno preenche sobre o negócio dele
- [ ] Remover todos os dados hardcoded da BrasilUp
- [ ] Escrever `README.md` — instalação, configuração e teste em linguagem simples
- [ ] Testar clone do zero em máquina limpa

### `mini-crm-kanban`
- [ ] Criar interface Kanban (React ou HTML puro — decidir com @architect)
- [ ] Criar `config/pipeline.json` — colunas configuráveis pelo aluno
- [ ] Criar integração com agente-luma: lead qualificado → aparece no CRM automaticamente
- [ ] Escrever `README.md`
- [ ] Testar integração completa

### `landing-page-template`
- [ ] Criar template HTML/CSS limpo baseado no estilo da masterclass (index.html existente)
- [ ] Criar `config/empresa.json`: nome, logo, cores, headline, CTA, WhatsApp
- [ ] Script que aplica as configs no HTML automaticamente
- [ ] Deploy automático via GitHub Pages documentado
- [ ] Escrever `README.md`
- [ ] Testar deploy do zero

### `ors-orcamentos`
- [ ] Copiar código do ORS BrasilUp para repositório novo
- [ ] Criar `config/produtos.json` — tabela de produtos e preços configurável
- [ ] Remover dados hardcoded da BrasilUp
- [ ] Escrever `README.md`
- [ ] Testar clone do zero

### Repositório agregador `genia-imersao`
- [ ] Criar repositório com links para os 4 sistemas
- [ ] Criar `GUIA-RAPIDO.md` — sequência de clone e configuração dos 4 em ordem
- [ ] Criar `CHECKLIST-PRE-IMERSAO.md` — o que o aluno precisa ter antes do Dia 1

---

## Definição de Pronto

O repositório está pronto quando:
1. Elidy clona em uma máquina limpa e consegue configurar sem consultar o código
2. Uma pessoa de fora (sem contexto do projeto) lê o README e consegue rodar

---

## Riscos

- **Agente Luma depende de Evolution API** — verificar se é fácil de configurar para não-devs ou se precisamos de alternativa mais simples
- **Mini CRM** não existe ainda — pode ser maior do que parece. @architect deve avaliar escopo antes de @dev começar
- **GitHub Pages** pode ter limitações dependendo do template — testar early

---

## Próximos Passos ao Abrir Esta Story

1. `@architect` avalia escopo técnico do `mini-crm-kanban` e decide stack
2. `@architect` decide se `landing-page-template` parte do `site-brasilup-2026` ou começa do zero
3. `@sm` quebra esta story em sub-stories se `@architect` avaliar que o escopo é XG
4. `@po` (Elidy) valida antes de `@dev` começar

---

_Story criada em 2026-03-13_
_Aguardando: abertura do projeto no Claude Code_
