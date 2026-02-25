# Checklist: Architecture Review

> Verificações que @architect executa ao revisar decisões técnicas.
> Aplicável em: SPEC-TECNICO, novos módulos, mudanças arquiteturais.

---

## Objetivo

Garantir que as decisões técnicas do projeto seguem princípios sólidos de arquitetura de software, são sustentáveis a longo prazo e não introduzem dívida técnica não-planejada. Este checklist é usado por @architect ao revisar especificações técnicas, propor arquitetura de novos componentes ou ao exercer veto técnico.

---

## Seção 1 — Fundamentos Arquiteturais

### 1.1 Clareza de Responsabilidades

- [ ] Cada componente/módulo tem uma responsabilidade única e claramente definida?
- [ ] Os boundaries de domínio estão bem delimitados?
- [ ] Não há lógica de negócio misturada com lógica de apresentação?
- [ ] Não há lógica de apresentação misturada com acesso a dados?
- [ ] A separação de camadas é clara e respeitada?

### 1.2 Simplicidade

- [ ] A solução proposta é a mais simples que resolve o problema?
- [ ] Não há over-engineering para problemas que não existem ainda?
- [ ] A complexidade adicional (se houver) está justificada com dados ou requisitos reais?
- [ ] Seria possível implementar uma versão mais simples que atende 90% dos casos?

### 1.3 Consistência

- [ ] As convenções seguem o padrão já estabelecido no SPEC-TECNICO.md?
- [ ] Nomes de arquivos, variáveis e funções seguem as convenções definidas?
- [ ] O estilo de código é consistente com o restante do codebase?
- [ ] Padrões de comunicação (REST, eventos, etc.) são usados de forma consistente?

---

## Seção 2 — Decisões de Tecnologia

### 2.1 Adequação da Stack

- [ ] As tecnologias escolhidas são adequadas para os requisitos do problema?
- [ ] Há consenso técnico no time sobre as escolhas?
- [ ] As versões de dependências são LTS ou estáveis?
- [ ] Há risco de as tecnologias se tornarem obsoletas no prazo do projeto?

### 2.2 Dependências Externas

- [ ] Cada dependência nova é realmente necessária?
- [ ] A licença da dependência é compatível com o projeto?
- [ ] A dependência tem manutenção ativa e comunidade relevante?
- [ ] Há alternativa nativa do framework/linguagem que poderia ser usada?
- [ ] O tamanho da dependência no bundle é aceitável (para frontend)?

### 2.3 ADR (Architecture Decision Records)

- [ ] Cada decisão arquitetural significativa tem um ADR correspondente?
- [ ] O ADR documenta: contexto, decisão, alternativas consideradas, consequências?
- [ ] ADRs de decisões obsoletas estão marcados como superseded?
- [ ] O time foi informado sobre novos ADRs?

---

## Seção 3 — Qualidade e Testabilidade

### 3.1 Testabilidade

- [ ] Os componentes são testáveis de forma isolada (sem dependências externas difíceis de mockar)?
- [ ] A lógica de negócio pode ser testada sem precisar de banco de dados real?
- [ ] Há separação clara entre código puro (testável) e efeitos colaterais (IO)?
- [ ] A arquitetura permite testes unitários sem configuração complexa de ambiente?

### 3.2 Observabilidade

- [ ] Há logging adequado para diagnosticar problemas em produção?
- [ ] Os logs não incluem dados sensíveis (PII, senhas, tokens)?
- [ ] Há métricas relevantes sendo coletadas?
- [ ] Erros são tratados de forma que facilitem o diagnóstico?

### 3.3 Manutenibilidade

- [ ] Um desenvolvedor novo conseguiria entender o módulo em < 30 minutos?
- [ ] Há documentação suficiente (inline ou em docs) para módulos complexos?
- [ ] O código pode ser modificado em uma área sem causar efeitos inesperados em outra?

---

## Seção 4 — Segurança

### 4.1 Princípios de Segurança

- [ ] Segurança foi considerada como parte do design (não como afterthought)?
- [ ] Principle of Least Privilege: componentes têm apenas as permissões necessárias?
- [ ] Dados sensíveis são criptografados em repouso e em trânsito?
- [ ] Autenticação e autorização estão na camada correta?

### 4.2 Vulnerabilidades Conhecidas

- [ ] A arquitetura não expõe pontos de SQL/NoSQL injection?
- [ ] Não há exposição desnecessária de endpoints internos?
- [ ] Dados de usuário são validados e sanitizados na entrada?
- [ ] CORS está configurado de forma restritiva?

### 4.3 Gestão de Secrets

- [ ] Secrets são gerenciados por variáveis de ambiente ou sistema de vault?
- [ ] Não há paths de código que poderiam expor secrets em logs ou respostas?
- [ ] Rotação de secrets é possível sem downtime?

---

## Seção 5 — Escalabilidade e Performance

### 5.1 Escalabilidade

- [ ] A arquitetura suporta o crescimento esperado de usuários/dados?
- [ ] Bottlenecks potenciais foram identificados e há plano de mitigação?
- [ ] O sistema pode ser escalado horizontalmente se necessário?
- [ ] Há estado compartilhado que impediria escalabilidade horizontal?

### 5.2 Performance

- [ ] Operações custosas (IO, cálculos pesados) são tratadas adequadamente (async, cache, queue)?
- [ ] Não há N+1 queries no design do acesso a dados?
- [ ] Caching foi considerado onde benéfico?
- [ ] Assets e dados são carregados sob demanda quando possível?

---

## Seção 6 — Evolução e Backward Compatibility

### 6.1 Contratos de API

- [ ] Mudanças em APIs públicas são backward-compatible?
- [ ] Se breaking changes são necessários: estratégia de versionamento definida?
- [ ] Contratos de integração com sistemas externos estão documentados?

### 6.2 Dívida Técnica

- [ ] Dívida técnica aceita está documentada com plano de resolução?
- [ ] Decisões temporárias têm prazo de revisão definido?
- [ ] Não há dívida técnica sendo criada sem consciência do time?

---

## Sumário de Avaliação

Após revisar todas as seções:

| Seção | Itens com Problema | Severidade | Ação |
|-------|-------------------|-----------|------|
| 1. Fundamentos | X | ... | ... |
| 2. Tecnologia | X | ... | ... |
| 3. Qualidade | X | ... | ... |
| 4. Segurança | X | ... | ... |
| 5. Performance | X | ... | ... |
| 6. Evolução | X | ... | ... |

---

## Veredicto de @architect

```markdown
## Architecture Review — [Componente/Spec]
Data: YYYY-MM-DD | Arquiteta: Arqui (@architect)

### Veredicto: APROVADO | APROVADO COM CONDIÇÕES | VETADO

### Pontos Fortes
- [O que foi bem pensado]

### Problemas Identificados
- CRÍTICO: [problema crítico — veto técnico se não resolvido]
- ALTO: [problema que deve ser resolvido antes de implementar]
- MÉDIO: [problema que deve ser resolvido neste sprint]
- SUGESTÃO: [melhoria opcional para próxima iteração]

### Decisões Arquiteturais para ADR
- [Decisão que merece ser documentada como ADR]

### Próximos Passos
[O que precisa acontecer antes de prosseguir]
```

---

*GEN.IA OS v1.0 — {{TEAM_NAME}} — {{CREATOR_NAME}}*
