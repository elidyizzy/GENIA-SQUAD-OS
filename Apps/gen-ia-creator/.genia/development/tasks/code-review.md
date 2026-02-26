# Task: Code Review

> Tarefa executada por @reviewer. Revisão formal de código antes do merge.
> Pré-requisito: @qa aprovou o código (story em InReview).

---

## Objetivo

Realizar revisão técnica completa do código implementado por @dev, verificando corretude, arquitetura, segurança, legibilidade e manutenibilidade. Emitir aprovação (LGTM) ou solicitar mudanças bloqueantes com feedback construtivo.

---

## Pré-requisitos

Antes de iniciar, confirme:

- [ ] Story tem status `InReview`
- [ ] @qa aprovou formalmente (relatório de QA disponível)
- [ ] Branch está disponível para checkout/análise
- [ ] @reviewer leu a story e os ACs

---

## Passos de Execução

### Passo 1 — Contexto e Preparação

1. Leia a story completa (User Story, ACs, não-escopo)
2. Leia o relatório de QA de @qa
3. Revise as seções relevantes do SPEC-TECNICO.md
4. Analise o diff completo:
   ```bash
   git diff main...feat/STORY-XXX-descricao
   ```
5. Liste mentalmente o que espera ver antes de começar a revisar

### Passo 2 — Revisão de Corretude

**O código faz o que deveria fazer?**

- [ ] A lógica implementa corretamente cada AC?
- [ ] Edge cases relevantes são tratados?
- [ ] Erros são capturados e tratados adequadamente?
- [ ] Mensagens de erro são úteis e claras?
- [ ] Não há bugs óbvios de lógica (condições invertidas, off-by-one, etc.)?
- [ ] Fluxos assíncronos são tratados corretamente (loading, error, success)?

### Passo 3 — Revisão Arquitetural

**O código está na estrutura correta?**

- [ ] Segue os padrões do SPEC-TECNICO.md?
- [ ] Imports absolutos com `@/` em todos os arquivos?
- [ ] Componentes/funções estão nas pastas corretas conforme a estrutura definida?
- [ ] Não viola separação de responsabilidades?
- [ ] Não há código de lógica de negócio em componentes de UI (e vice-versa)?
- [ ] Não há código duplicado que poderia ser extraído?
- [ ] Dependências entre módulos respeitam os boundaries definidos?

### Passo 4 — Revisão de Segurança

**O código é seguro?**

- [ ] Sem hardcoded secrets, tokens, passwords ou URLs de ambiente?
- [ ] Input validation presente onde dados externos são consumidos?
- [ ] Sem vulnerabilidades de XSS (dados de usuário inseridos no DOM sem sanitização)?
- [ ] Autenticação e autorização corretas nos endpoints/páginas protegidas?
- [ ] Dados sensíveis não aparecem em logs?
- [ ] Sem SQL injection ou query injection possível?
- [ ] Dependências externas verificadas (nenhuma suspeita adicionada)?

### Passo 5 — Revisão de Qualidade de Código

**O código é legível e manutenível?**

- [ ] Nomes de variáveis, funções e componentes são descritivos?
- [ ] Funções têm responsabilidade única (fazem uma coisa bem)?
- [ ] Complexidade cognitiva é aceitável? (se você precisar de >30 segundos para entender uma função, é complexa demais)
- [ ] Comentários existentes agregam valor (explicam o "por quê", não o "o quê")?
- [ ] Não há código morto (código comentado, imports não usados, variáveis não usadas)?
- [ ] TypeScript usado de forma efetiva (sem `any` injustificado, tipos bem definidos)?

### Passo 6 — Revisão de Testes

**Os testes são de qualidade?**

- [ ] Testes existem para a funcionalidade implementada?
- [ ] Os testes testam comportamento (o que o código faz), não implementação (como faz)?
- [ ] Testes cobrem happy path, edge cases e cenários de erro?
- [ ] Testes são legíveis? (outro dev entende o que está sendo testado sem precisar ler o código fonte)
- [ ] Não há testes que testam a implementação de terceiros (React, bibliotecas)?
- [ ] Coverage >= 80% conforme verificado por @qa?

### Passo 7 — Revisão de Performance

**O código tem problemas de performance óbvios?**

- [ ] Sem N+1 queries (buscar dados dentro de um loop)?
- [ ] Sem re-renders desnecessários (React — memoização faltando quando necessário)?
- [ ] Operações custosas fora de loops quando possível?
- [ ] Assets (imagens, fontes) otimizados se aplicável?
- [ ] Sem chamadas de API desnecessárias?

### Passo 8 — Categorização de Issues

Para cada problema encontrado, classifique:

| Categoria | Bloqueia merge? | Quando usar |
|-----------|----------------|------------|
| CRÍTICO | Sim | Segurança, dados corrompidos, crash |
| BLOQUEANTE | Sim | Violação arquitetural, lógica incorreta, AC não implementado |
| SUGESTÃO | Não | Nome melhor, refatoração opcional, documentação |
| COSMÉTICO | Não | Formatação (já coberta por linter automático) |

**Regra:** Não invente razões para reprovar. Se o código funciona, é seguro e está na arquitetura correta, aprove — mesmo que você tivesse feito diferente.

### Passo 9 — Emissão do Veredicto

**APROVADO (LGTM):**

```markdown
## ✅ Code Review — APROVADO
Story: STORY-XXX | Branch: feat/STORY-XXX-descricao
Revisor: Rev (@reviewer) | Data: YYYY-MM-DD

### Pontos Positivos
- [Algo bem feito que merece reconhecimento]
- [Boa prática identificada]

### Sugestões (Não-Bloqueantes)
- [arquivo:linha] [sugestão para o futuro]
- [arquivo:linha] [alternativa a considerar]

LGTM. @devops pode fazer push e criar o PR.
```

**MUDANÇAS SOLICITADAS:**

```markdown
## ❌ Code Review — MUDANÇAS SOLICITADAS
Story: STORY-XXX | Branch: feat/STORY-XXX-descricao
Revisor: Rev (@reviewer) | Data: YYYY-MM-DD

### Issues BLOQUEANTES (devem ser corrigidos antes do merge)

1. **[CRÍTICO]** `src/components/Login/index.tsx:45`
   Token da API hardcodado na linha 45.
   **Correção:** mover para variável de ambiente `NEXT_PUBLIC_API_TOKEN`

2. **[BLOQUEANTE]** `src/services/auth.ts:23`
   Import relativo `../../lib/api` viola o padrão de imports absolutos.
   **Correção:** mudar para `@/lib/api`

### Sugestões (Não-Bloqueantes)
1. `src/hooks/useAuth.ts:12` — considerar usar `useCallback` para o handler

@dev por favor corrija os itens BLOQUEANTES e sinalize quando pronto para re-review.
```

### Passo 10 — Comunicação

**Se APROVADO:**
- Atualize status da story para `InPR`
- Notifique @devops com: branch name, story ID, "aprovado para push e PR"

**Se MUDANÇAS SOLICITADAS:**
- Mantenha status como `InReview`
- Notifique @dev com o relatório de mudanças
- Aguarde @dev corrigir e sinalizar para re-review

---

## Re-review

Quando @dev notifica que corrigiu:

1. Verifique APENAS os itens que foram sinalizados como BLOQUEANTES
2. Se todos corrigidos: APROVAR
3. Se algum não foi corrigido adequadamente: solicitar mudança novamente com mais clareza

---

## Critérios de Saída

O code review está concluído quando:

- [ ] Diff completo lido e analisado
- [ ] Todos os itens do checklist verificados
- [ ] Issues categorizados (BLOQUEANTE vs. SUGESTÃO)
- [ ] Veredicto emitido formalmente (APROVADO ou MUDANÇAS SOLICITADAS)
- [ ] Relatório salvo em `docs/reviews/REVIEW-STORY-XXX.md`
- [ ] Agente correto notificado (@devops ou @dev)

---

*GEN.IA OS v1.0 — Be Data — Elidy Izidio*
