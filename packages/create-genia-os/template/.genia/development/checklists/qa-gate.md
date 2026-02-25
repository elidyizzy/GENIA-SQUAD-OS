# Checklist: QA Gate

> Verificações que @qa executa para emitir veredicto de qualidade.
> 7 verificações principais. Todas obrigatórias para aprovação.

---

## O que é o QA Gate?

O QA Gate é o checkpoint de qualidade que determina se o código pode avançar para code review e, posteriormente, para produção. @qa é a autoridade exclusiva para abrir ou fechar este gate. Um veredicto APROVADO pelo QA Gate é pré-requisito obrigatório para o code review por @reviewer.

---

## Verificação 1 — Acceptance Criteria (Funcional)

**Propósito:** Garantir que o código implementa exatamente o que foi prometido na story.

Para cada AC da story:

| AC | Cenário testado | Resultado |
|----|----------------|---------|
| AC-01 | [descrever como foi testado] | ✅ / ❌ |
| AC-02 | [descrever como foi testado] | ✅ / ❌ |
| AC-03 | [descrever como foi testado] | ✅ / ❌ |

**Critério de passagem:** Todos os ACs com resultado ✅

- [ ] Todos os ACs verificados manualmente
- [ ] Happy path de cada AC funciona conforme descrito
- [ ] Nenhum AC implementado parcialmente ou com workaround oculto
- [ ] Comportamentos descritos nos ACs correspondem ao comportamento real

**BLOQUEANTE se falhar.**

---

## Verificação 2 — Testes Automáticos

**Propósito:** Garantir que a suite de testes está saudável e cobrindo o código.

```bash
npm run test
```

- [ ] Todos os testes passando (zero falhas)
- [ ] Nenhum teste em `skip` ou `xtest` sem justificativa documentada
- [ ] Sem `test.only` que silencia outros testes

```bash
npm run coverage
```

- [ ] Coverage >= 80% nas linhas novas/modificadas
- [ ] Relatório de coverage gerado e verificado

**Resultados esperados:**
```
Test Suites: X passed, X total
Tests:       X passed, X total
Coverage:    XX% (>= 80%)
```

**BLOQUEANTE se falhar.**

---

## Verificação 3 — Qualidade Estática

**Propósito:** Garantir que o código segue os padrões de qualidade definidos.

```bash
npm run lint
```

- [ ] Zero erros de lint
- [ ] Zero warnings de lint
- [ ] Nenhuma regra desabilitada sem comentário explicativo

```bash
npm run typecheck
```

- [ ] Zero erros TypeScript
- [ ] Sem `@ts-ignore` injustificado
- [ ] Sem `any` como atalho para evitar tipagem

**BLOQUEANTE se falhar.**

---

## Verificação 4 — Cenários de Borda (Edge Cases)

**Propósito:** Garantir que o código é robusto além dos cenários principais.

Testar:

- [ ] Campos obrigatórios vazios: o sistema se comporta corretamente?
- [ ] Caracteres especiais em inputs de texto: sem injeção ou quebra?
- [ ] Valores extremos (muito longos, muito curtos, zero, negativos): tratados?
- [ ] Ações repetidas rapidamente (double-click em botões): sem efeito duplo?
- [ ] Sem conexão ou timeout de API: mensagem de erro adequada?
- [ ] Dados nulos/undefined vindos da API: sem crash?

Documente cada cenário testado e o resultado.

**ALTO se falhar em cenário relevante. BLOQUEANTE se causar crash ou corrupção de dados.**

---

## Verificação 5 — Regressão

**Propósito:** Garantir que as mudanças desta story não quebraram funcionalidades existentes.

Testar as funcionalidades RELACIONADAS ao módulo modificado:

- [ ] Funcionalidades adjacentes ainda funcionam corretamente
- [ ] Navegação entre páginas relacionadas funciona
- [ ] Integrações com outros módulos não foram quebradas
- [ ] Dados persistidos anteriormente ainda são lidos corretamente

Em projetos brownfield, a verificação de regressão é expandida e inclui teste dos fluxos críticos de produção.

**CRÍTICO se houver regressão em funcionalidade existente.**

---

## Verificação 6 — Segurança Básica

**Propósito:** Identificar vulnerabilidades de segurança óbvias antes que cheguem ao code review.

- [ ] Sem dados sensíveis expostos em respostas de API desnecessariamente
- [ ] Endpoints protegidos retornam 401/403 sem autenticação válida
- [ ] Inputs com caracteres especiais não quebram o sistema
- [ ] Sem informações de stack trace expostas em respostas de erro para o usuário
- [ ] Sem secrets visíveis em logs ou respostas de API
- [ ] Rate limiting funcionando se implementado

**CRÍTICO se encontrar vulnerabilidade de segurança.**

---

## Verificação 7 — Experiência do Usuário Básica

**Propósito:** Garantir que a entrega é usável e não causa frustração desnecessária.

Para funcionalidades com interface:

- [ ] Estados de loading presentes durante operações assíncronas?
- [ ] Estado vazio (lista sem itens) tem tratamento visual adequado?
- [ ] Mensagens de erro são compreensíveis para o usuário (não stack traces)?
- [ ] Formulários fornecem feedback claro sobre campos inválidos?
- [ ] Interface não quebra visualmente em resoluções comuns (desktop 1280px+, mobile 375px)?
- [ ] Botões não ficam habilitados após ação que deveria desabilitá-los?

Para funcionalidades de API:

- [ ] Respostas de sucesso têm estrutura consistente?
- [ ] Respostas de erro têm mensagem clara e código HTTP correto?
- [ ] Documentação da API atualizada se necessário?

**MÉDIO se falhar (não bloqueia, mas deve ser documentado).**

---

## Sumário de Verificações

| # | Verificação | Criticidade | Resultado |
|---|-------------|------------|---------|
| 1 | Acceptance Criteria atendidos | BLOQUEANTE | ✅ / ❌ |
| 2 | Testes automáticos passando | BLOQUEANTE | ✅ / ❌ |
| 3 | Lint + TypeScript limpos | BLOQUEANTE | ✅ / ❌ |
| 4 | Edge cases tratados | ALTO | ✅ / ❌ |
| 5 | Sem regressão | CRÍTICO | ✅ / ❌ |
| 6 | Segurança básica | CRÍTICO | ✅ / ❌ |
| 7 | UX básica adequada | MÉDIO | ✅ / ❌ |

---

## Veredicto

**APROVADO** quando:
- Verificações 1, 2, 3 passam (obrigatórias)
- Verificações 5, 6 passam (zero críticos)
- Verificação 4 sem bugs ALTO ou com máx 2 documentados
- Verificação 7 com issues documentados para backlog

**REPROVADO** quando:
- Qualquer verificação BLOQUEANTE falha
- Verificação 5 ou 6 identificam bug CRÍTICO
- Verificação 4 tem mais de 2 bugs ALTO

---

## Registro do Veredicto

```markdown
## QA Gate — STORY-XXX — [APROVADO | REPROVADO]
Data: YYYY-MM-DD | QA: Quinn (@qa) | Iteração: X/5

| Verificação | Status |
|-------------|--------|
| 1. ACs | ✅ PASS |
| 2. Testes | ✅ PASS |
| 3. Estática | ✅ PASS |
| 4. Edge cases | ⚠️ 1 bug MÉDIO documentado |
| 5. Regressão | ✅ PASS |
| 6. Segurança | ✅ PASS |
| 7. UX | ✅ PASS |

Veredicto: ✅ APROVADO
Próximo passo: @reviewer para code review
```

---

*GEN.IA OS v1.0 — {{TEAM_NAME}} — {{CREATOR_NAME}}*
