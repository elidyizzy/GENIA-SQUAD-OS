# Task: QA Review

> Tarefa executada por @qa. Verifica qualidade e conformidade do código com os ACs.
> Pré-requisito: @dev declarou implementação concluída (story em InQA).

---

## Objetivo

Verificar sistematicamente que o código implementado por @dev satisfaz todos os Acceptance Criteria da story, atende aos padrões de qualidade técnica e não introduz regressões. Emitir veredicto formal: APROVADO ou REPROVADO com bugs documentados.

---

## Pré-requisitos

Antes de iniciar, confirme:

- [ ] Story tem status `InQA`
- [ ] @dev comunicou que a implementação está pronta
- [ ] Arquivo da story está em `docs/stories/STORY-XXX.md`
- [ ] Branch do @dev está disponível para checkout

---

## Passos de Execução

### Passo 1 — Preparação
1. Leia a story completa: User Story, todos os ACs, não-escopo
2. Faça checkout do branch:
   ```bash
   git checkout feat/STORY-XXX-descricao
   ```
3. Instale dependências se necessário:
   ```bash
   npm install
   ```
4. Configure variáveis de ambiente para testes

### Passo 2 — Execução de Verificações Automáticas

```bash
# 1. Lint — deve estar limpo
npm run lint

# 2. TypeScript — zero erros
npm run typecheck

# 3. Testes unitários — todos devem passar
npm run test

# 4. Cobertura — deve ser >= 80%
npm run coverage
```

Documente os resultados de cada comando.

### Passo 3 — Verificação dos Acceptance Criteria

Para CADA AC da story:

1. Leia o AC
2. Execute o cenário descrito
3. Verifique se o resultado corresponde ao esperado
4. Documente o resultado: ✅ VERIFICADO ou ❌ FALHOU

**Para cada AC, Quinn verifica também:**
- Happy path funciona como descrito?
- Edge cases tratados corretamente?
- Mensagens de erro claras e úteis para o usuário?
- Estados de loading/empty/error presentes (se aplicável)?

### Passo 4 — Verificação de Qualidade Adicional

Além dos ACs, @qa verifica:

**Interface (se aplicável):**
- [ ] Responsividade em diferentes tamanhos de tela
- [ ] Acessibilidade básica (contraste, labels, keyboard navigation)
- [ ] Sem quebras visuais óbvias
- [ ] Textos sem erros de ortografia

**Performance básica:**
- [ ] Requests desnecessariamente lentos identificados?
- [ ] Sem re-renders infinitos (React)
- [ ] Sem memory leaks óbvios

**Segurança básica:**
- [ ] Inputs validados e sanitizados
- [ ] Dados sensíveis não expostos em logs
- [ ] Autenticação verificada nos endpoints protegidos

### Passo 5 — Documentação de Bugs

Para cada problema encontrado, use o template:

```markdown
### BUG-QA-[STORY-XXX]-[número]

**Iteração:** X/5
**Severidade:** CRÍTICO | ALTO | MÉDIO | BAIXO
**AC relacionado:** AC-XX | Qualidade Geral | Regressão
**Tipo:** Funcional | Visual | Performance | Segurança | Acessibilidade

#### Comportamento Esperado
[Descrição clara do que deveria acontecer]

#### Comportamento Atual
[Descrição clara do que está acontecendo]

#### Passos para Reproduzir
1. [Passo 1]
2. [Passo 2]
3. [Resultado obtido]

#### Evidência
```
[Log de erro, mensagem de falha, ou descrição detalhada]
```

#### Critério de Resolução
[Como @qa saberá que o bug foi corrigido]
```

### Passo 6 — Emissão do Veredicto

**APROVADO** se:
- Zero bugs CRÍTICOS
- Máximo 2 bugs ALTOS (documentados para backlog futuro)
- Todos os ACs verificados e passando
- Testes unitários passando com coverage >= 80%
- Lint e typecheck limpos

**REPROVADO** se:
- Qualquer bug CRÍTICO presente
- Mais de 2 bugs ALTOS
- Qualquer AC não-atendido
- Testes falhando
- Lint com erros

### Passo 7 — Comunicação do Resultado

**Se APROVADO:**
1. Atualize status da story para `InReview`
2. Notifique @reviewer com:
   - Branch name
   - Story ID
   - Relatório de QA resumido
   - "Pronto para code review"

**Se REPROVADO:**
1. Mantenha status como `InQA`
2. Notifique @dev com:
   - Lista de bugs ordenados por severidade
   - Orientações claras sobre o que corrigir
   - Pedido de re-notificação após correções
3. Registre a iteração (1ª, 2ª, 3ª...)
4. Se 5ª iteração e ainda reprovado: escalar para @architect + @pm

---

## Relatório Final de QA

Ao aprovar, gerar relatório:

```markdown
# Relatório QA — STORY-XXX
Data: YYYY-MM-DD | QA: Quinn (@qa)
Iterações utilizadas: X/5

## Veredicto: ✅ APROVADO

## Resultados de Testes Automáticos
- Lint: ✅ Limpo
- TypeScript: ✅ Zero erros
- Testes unitários: ✅ XX/XX passando
- Cobertura: ✅ XX%

## Acceptance Criteria
| AC | Descrição resumida | Resultado |
|----|-------------------|---------|
| AC-01 | ... | ✅ VERIFICADO |
| AC-02 | ... | ✅ VERIFICADO |
| AC-03 | ... | ✅ VERIFICADO |

## Bugs Encontrados
| ID | Título | Severidade | Disposição |
|----|--------|-----------|-----------|
| BUG-001 | ... | MÉDIO | Documentado para backlog |

## Observações
[Pontos de atenção ou sugestões não-bloqueantes]

Aprovado por Quinn (@qa) em YYYY-MM-DD.
Próximo passo: code review por @reviewer.
```

---

## Classificação de Bugs (Referência)

| Severidade | Definição | Exemplos |
|-----------|----------|---------|
| CRÍTICO | Sistema quebra, perda de dados, falha de segurança | Crash, SQL injection, dados corrompidos |
| ALTO | Funcionalidade principal comprometida | AC não-atendido, workflow quebrado |
| MÉDIO | Funcionalidade parcialmente afetada | Mensagem de erro incorreta, visual quebrado em caso específico |
| BAIXO | Cosmético, menor, alternativa disponível | Texto levemente diferente, UI pixel imperfect |

---

## Critérios de Saída

A task QA Review está concluída quando:

- [ ] Todos os ACs verificados e documentados
- [ ] Testes automáticos executados e resultados documentados
- [ ] Bugs (se houver) documentados com severidade e passos de reprodução
- [ ] Veredicto formal emitido (APROVADO ou REPROVADO)
- [ ] Status da story atualizado (InReview ou InQA)
- [ ] Agente correto notificado (@reviewer ou @dev)
- [ ] Relatório QA salvo em `docs/qa/RELATORIO-QA-STORY-XXX.md`

---

*GEN.IA OS v1.0 — Be Data — Elidy Izidio*
