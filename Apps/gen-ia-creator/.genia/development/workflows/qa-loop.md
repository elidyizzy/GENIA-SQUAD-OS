# Workflow: QA Loop

> Ciclo iterativo de revisão de qualidade e correção de bugs.
> Máximo de 5 iterações. Após o limite, escalar para @architect + @pm.

---

## Visão Geral

O QA Loop é a fase de qualidade dentro do Story Development Cycle. Ele define um processo rigoroso e limitado de revisão-correção para garantir que o código entregue atende aos acceptance criteria sem criar ciclos infinitos de revisão.

**Máximo de iterações:** 5
**Responsáveis:** @qa (revisão) + @dev (correção)
**Pré-requisito:** @dev declarou implementação concluída

---

## Fluxo do QA Loop

```
Iteração 1:
  @qa revisa o código
  → APROVADO → Fim do QA Loop → @reviewer
  → REPROVADO → @dev corrige bugs críticos e altos

Iteração 2:
  @qa re-revisa
  → APROVADO → Fim do QA Loop → @reviewer
  → REPROVADO → @dev corrige

Iteração 3:
  @qa re-revisa
  → APROVADO → Fim do QA Loop → @reviewer
  → REPROVADO → @dev corrige

Iteração 4:
  @qa re-revisa
  → APROVADO → Fim do QA Loop → @reviewer
  → REPROVADO → @dev corrige

Iteração 5 (ÚLTIMA):
  @qa re-revisa
  → APROVADO → Fim do QA Loop → @reviewer
  → REPROVADO → ESCALAR para @architect + @pm
               (decisão: refatorar, redefinir escopo ou cancelar story)
```

---

## Fase de Revisão (@qa)

### O que @qa verifica em cada iteração:

**1. Acceptance Criteria (obrigatório):**
- [ ] AC-01 verificado com evidência
- [ ] AC-02 verificado com evidência
- [ ] AC-03 verificado com evidência
- [ ] [demais ACs da story]

**2. Qualidade do código:**
- [ ] `npm run lint` — zero warnings ou erros
- [ ] `npm run typecheck` — zero erros TypeScript
- [ ] `npm run test` — todos os testes passando
- [ ] `npm run coverage` — cobertura >= 80%

**3. Cenários adicionais:**
- [ ] Cenários positivos funcionando
- [ ] Cenários negativos (edge cases) tratados
- [ ] Mensagens de erro claras e consistentes
- [ ] Estados de loading/empty/error cobertos (se UI)

**4. Segurança básica:**
- [ ] Sem dados sensíveis expostos
- [ ] Inputs validados
- [ ] Autenticação/autorização conforme spec

---

## Documentação de Bugs

Para cada bug encontrado, @qa documenta:

```markdown
### BUG-QA-XXX — [Título descritivo]

**Iteração:** X de 5
**Severidade:** CRÍTICO | ALTO | MÉDIO | BAIXO
**AC relacionado:** AC-XX (ou "Fora dos ACs — problema encontrado")
**Status:** Aberto | Em Correção | Resolvido

#### Comportamento Esperado
[Descrição precisa do que deveria acontecer]

#### Comportamento Atual
[Descrição precisa do que está acontecendo]

#### Passos para Reproduzir
1. [Passo 1]
2. [Passo 2]
3. [Passo 3]

#### Evidência
```
[Log de erro, stack trace, ou descrição da tela]
```

#### Critério de Resolução
[Como @qa saberá que o bug foi corrigido]
```

---

## Critérios de Aprovação

Para o QA Loop encerrar com APROVADO:

| Critério | Obrigatório |
|---------|------------|
| Zero bugs CRÍTICOS | Sim |
| Zero ou máximo 2 bugs ALTOS (documentados) | Sim |
| Todos os ACs verificados | Sim |
| Testes passando | Sim |
| Coverage >= 80% | Sim |
| Lint sem erros | Sim |
| Typecheck passando | Sim |

Bugs de severidade MÉDIO e BAIXO podem existir se documentados no backlog para correção futura.

---

## Escalada Após 5 Iterações

Se após 5 iterações o QA Loop não encerrar com aprovação:

1. **@qa documenta relatório completo** com todos os bugs e histórico de iterações
2. **@qa notifica @architect e @pm** com o relatório
3. **@architect analisa** se há problema arquitetural subjacente
4. **@pm e @architect decidem:**
   - Opção A: Aumentar esforço de dev (@dev faz refatoração completa — nova branch)
   - Opção B: Reduzir escopo da story (remover AC problemático para nova story)
   - Opção C: Cancelar story com documentação de impedimento técnico

**A escalada NUNCA é vista como fracasso do @dev — é informação valiosa sobre subestimação de complexidade.**

---

## Relatório Final de QA

Ao encerrar o QA Loop, @qa emite relatório:

```markdown
# Relatório QA — STORY-XXX
Data: YYYY-MM-DD | QA: Quinn (@qa)
Iterações: X/5 | Veredicto: APROVADO | REPROVADO

## Acceptance Criteria
- AC-01: ✅ VERIFICADO
- AC-02: ✅ VERIFICADO
- AC-03: ✅ VERIFICADO

## Resultados de Testes
- Unitários: XX/XX passando
- Coverage: XX%
- Lint: limpo
- Typecheck: limpo

## Bugs Encontrados
| ID | Título | Severidade | Status |
|----|--------|-----------|--------|
| BUG-QA-001 | ... | MÉDIO | Documentado para backlog |

## Conclusão
[Story aprovada / reprovada] por Quinn (@qa) em YYYY-MM-DD.
Próximo passo: [@reviewer para code review | escalar]
```

---

*GEN.IA OS v1.0 — Be Data — Elidy Izidio*
