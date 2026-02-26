# Task: Dev — Implementar Story

> Tarefa executada por @dev. Transforma uma story validada em código funcional.
> Pré-requisito: story com status Ready (aprovada por @po).

---

## Objetivo

Implementar o código necessário para satisfazer todos os Acceptance Criteria da story, seguindo os padrões arquiteturais definidos no SPEC-TECNICO.md. Entregar código limpo, testado e commitado localmente, pronto para revisão de @qa.

---

## Pré-requisitos

Antes de iniciar, confirme:

- [ ] Story tem status `Ready` (aprovada por @po)
- [ ] SPEC-TECNICO.md lido e compreendido
- [ ] Branch `main` local está atualizado (`git pull`)
- [ ] Ambiente de desenvolvimento funcionando (dependências instaladas, env vars configuradas)
- [ ] Clareza sobre todos os Acceptance Criteria (se houver dúvida, consultar @po ANTES de começar)

---

## Passos de Execução

### Passo 1 — Leitura e Preparação
1. Leia a story completa: User Story, contexto, todos os ACs, não-escopo
2. Leia as seções relevantes do SPEC-TECNICO.md
3. Identifique todos os arquivos que precisarão ser criados ou modificados
4. Se houver qualquer dúvida sobre o comportamento esperado: perguntar para @po AGORA (não depois de implementar errado)
5. Estime internamente o tempo necessário e comunique para @sm se houver risco de não entregar no sprint

### Passo 2 — Criar Branch
```bash
git checkout main
git pull origin main
git checkout -b feat/STORY-XXX-descricao-kebab-case
```

Exemplos de nomes de branch:
- `feat/STORY-001-tela-de-login`
- `fix/STORY-015-corrigir-validacao-email`
- `refactor/STORY-022-extrair-servico-autenticacao`

### Passo 3 — Planejamento da Implementação
Antes de escrever código, faça um planejamento mental ou escrito:
1. Quais componentes/funções precisam ser criados?
2. Quais precisam ser modificados?
3. Há alguma dependência técnica (biblioteca nova, configuração)?
4. Qual a ordem lógica de implementação?

### Passo 4 — Implementação (TDD quando possível)
**Abordagem preferida (TDD):**
1. Escreva o teste primeiro (descreve o comportamento esperado)
2. Execute o teste — deve falhar (red)
3. Implemente o código mínimo para o teste passar (green)
4. Refatore o código mantendo os testes passando (refactor)

**Abordagem alternativa (test-after):**
1. Implemente a funcionalidade
2. Escreva os testes cobrindo os cenários
3. Garanta que os testes passam

**Regras de implementação:**
- Imports sempre absolutos com `@/` (nunca `../../../`)
- Tipagem TypeScript estrita (sem `any` sem justificativa)
- Funções com responsabilidade única (max 30 linhas como guia)
- Nomes descritivos (variáveis, funções, componentes)
- Comentários explicam o "por quê", não o "o quê"
- Nunca hardcodar values que deveriam ser variáveis de ambiente

### Passo 5 — Testes

Execute após cada unidade coesa de código:

```bash
# Lint (zero tolerância a erros)
npm run lint

# TypeScript (zero erros)
npm run typecheck

# Testes unitários
npm run test

# Cobertura
npm run coverage
```

**Meta de cobertura:** >= 80% nas linhas modificadas/criadas

O que testar:
- Happy path de cada AC
- Edge cases (valores nulos, strings vazias, arrays vazios)
- Cenários de erro (exceções esperadas)
- Comportamento com dados inválidos

O que NÃO testar (não agrega valor):
- Implementações de terceiros (não testa o que o React faz)
- Trivialidades óbvias (getters/setters simples sem lógica)

### Passo 6 — Self-Review (Antes do Commit Final)

Leia seu próprio código como se fosse o @reviewer:

- [ ] O código implementa EXATAMENTE os ACs? (nem mais, nem menos)
- [ ] Imports absolutos com `@/` em todos os arquivos novos?
- [ ] Sem `any` sem justificativa no TypeScript?
- [ ] Sem `console.log` de debug esquecidos?
- [ ] Sem `.env` ou secrets hardcodados?
- [ ] Sem código comentado desnecessário?
- [ ] Funções com responsabilidade única?
- [ ] Testes com cobertura >= 80%?
- [ ] Lint sem warnings?

### Passo 7 — Commits Atômicos

Commite em unidades coesas — cada commit deve descrever uma mudança em uma frase:

```bash
git add src/components/Auth/LoginForm.tsx
git add src/components/Auth/LoginForm.test.tsx
git commit -m "feat(auth): implementar formulário de login com validação

Implementa o formulário de login da STORY-001 com:
- Campos de email e senha com validação client-side
- Estado de loading durante autenticação
- Exibição de erros da API

Story: STORY-001
Co-Authored-By: GEN.IA OS <genia@bedata.com.br>"
```

Tipos de commit:
- `feat` — nova funcionalidade
- `fix` — correção de bug
- `refactor` — refatoração sem mudança de comportamento
- `test` — adição ou correção de testes
- `docs` — documentação inline

**NUNCA** fazer `git push` — exclusivo de @devops.

### Passo 8 — Verificação Final

Antes de declarar pronto para @qa:

```bash
# Garanta que tudo ainda passa com o conjunto completo
npm run lint && npm run typecheck && npm run test
```

- [ ] Todos os ACs foram implementados?
- [ ] Todos os testes passando?
- [ ] Cobertura >= 80%?
- [ ] Lint e typecheck limpos?
- [ ] Não-escopo da story foi respeitado? (não implementou nada além do escopo)

### Passo 9 — Comunicar para @qa

1. Atualize o status da story para `InQA` no arquivo `docs/stories/STORY-XXX.md`
2. Notifique @qa que o código está pronto para revisão
3. Informe:
   - Story ID e branch name
   - Quais ACs foram implementados
   - Qualquer ponto de atenção que @qa deve saber

---

## Gestão de Blockers

Se encontrar um blocker durante a implementação:

1. **Blocker técnico de arquitetura** → consultar @architect
2. **Dúvida sobre requisito/AC** → consultar @po
3. **Dependência de outra story** → comunicar @sm
4. **Blocker de ambiente/ferramenta** → comunicar @devops

Nunca inventar uma solução para um blocker sem validação — isso é violação do Artigo IV.

---

## Critérios de Saída

A implementação está pronta para @qa quando:

- [ ] Todos os ACs da story implementados
- [ ] Testes unitários com coverage >= 80%
- [ ] `npm run lint` — zero erros ou warnings
- [ ] `npm run typecheck` — zero erros
- [ ] `npm run test` — todos passando
- [ ] Código commitado localmente no branch correto
- [ ] Status da story atualizado para InQA
- [ ] @qa notificado com contexto

---

*GEN.IA OS v1.0 — Be Data — Elidy Izidio*
