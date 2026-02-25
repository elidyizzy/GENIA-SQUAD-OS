# Task: Criar SPEC-TECNICO

> Tarefa executada por @architect após PRD aprovado por @pm e @po.
> Output: `docs/[projeto]/SPEC-TECNICO.md` + ADRs iniciais

---

## Objetivo

Criar a especificação técnica completa que traduz os requisitos de negócio do PRD em decisões de arquitetura, tecnologia, estrutura de código e padrões de desenvolvimento. O SPEC-TECNICO é o guia técnico definitivo — qualquer decisão de implementação que não esteja aqui deve ser escalada para @architect antes de ser tomada.

---

## Pré-requisitos

Antes de iniciar, confirme:

- [ ] `docs/[projeto]/PRD.md` existe e está aprovado por @pm e @po
- [ ] @architect leu o PRD completamente
- [ ] Acesso ao repositório (se brownfield) ou liberdade para definir stack (se greenfield)
- [ ] Clareza sobre restrições de tecnologia (se houver imposições do cliente)

---

## Passos de Execução

### Passo 1 — Análise do PRD
1. Leia o PRD completamente e anote:
   - Requisitos funcionais por épico
   - Requisitos não-funcionais (desempenho, segurança, disponibilidade)
   - Integrações necessárias com sistemas externos
   - Restrições tecnológicas declaradas
2. Identifique perguntas técnicas abertas e resolva com @pm antes de continuar

### Passo 2 — Definição de Stack
1. Para cada camada da stack, avalie opções e registre decisão:
   - **Frontend:** React, Next.js, Vue, etc.
   - **Backend:** Node.js, Python, Go, etc.
   - **Banco de dados:** PostgreSQL, MongoDB, Supabase, etc.
   - **Autenticação:** NextAuth, Clerk, Auth0, etc.
   - **Infraestrutura:** Vercel, Railway, AWS, etc.
   - **Cache:** Redis, memória, etc. (se necessário)
2. Para cada escolha, justifique explicitamente (não apenas "é popular")
3. Registre alternativas consideradas e por que foram descartadas
4. Crie ADRs para as decisões mais relevantes

### Passo 3 — Arquitetura de Alto Nível
1. Defina os componentes principais do sistema
2. Descreva como cada componente se comunica (REST, GraphQL, WebSocket, etc.)
3. Identifique boundaries de domínio (onde uma responsabilidade termina e outra começa)
4. Documente o fluxo dos dados principais
5. Escreva um diagrama textual (ou ASCII) da arquitetura

### Passo 4 — Estrutura de Pastas
1. Defina a estrutura completa de pastas do projeto:
   ```
   src/
   ├── app/           # pages e rotas (Next.js)
   ├── components/    # componentes reutilizáveis
   │   ├── ui/        # componentes base (Button, Input, etc.)
   │   └── [domain]/  # componentes de domínio
   ├── lib/           # utilitários e helpers
   ├── hooks/         # React hooks customizados
   ├── services/      # chamadas a APIs externas
   ├── types/         # tipagens TypeScript
   ├── contexts/      # React Contexts
   └── schemas/       # validação com Zod
   ```
2. Justifique escolhas não-óbvias
3. Configure `tsconfig.json` com paths absolutos (`@/`)

### Passo 5 — Modelagem de Dados
1. Defina as entidades principais do domínio
2. Para cada entidade: campos, tipos, relacionamentos, constraints
3. Defina estratégia de migração de banco (ferramentas, convenções)
4. Documente índices importantes para performance
5. Identifique dados sensíveis e como serão protegidos (LGPD/GDPR)

### Passo 6 — APIs e Contratos
1. Para cada endpoint/operação relevante, defina:
   - Método HTTP e path
   - Request body (campos, tipos, validações)
   - Response body (campos, tipos)
   - Códigos de status e cenários de erro
2. Defina convenções de nomenclatura de API
3. Documente integrações com APIs externas (webhook, polling, SDK)

### Passo 7 — Autenticação e Autorização
1. Defina o mecanismo de autenticação escolhido
2. Mapeie os perfis/roles de usuário
3. Defina regras de autorização por role
4. Documente estratégia de sessão (JWT, cookie, etc.)

### Passo 8 — Estratégia de Testes
1. Defina a pirâmide de testes:
   - Unitários: ferramentas, o que testar, cobertura mínima
   - Integração: quais fluxos, ferramentas
   - E2E: ferramentas (Cypress, Playwright), fluxos críticos
2. Configure as ferramentas de teste no projeto
3. Defina cobertura mínima aceitável (GEN.IA OS default: 80%)

### Passo 9 — Segurança e Boas Práticas
1. Defina como secrets são gerenciados (variáveis de ambiente, Vault)
2. Liste as vulnerabilidades OWASP Top 10 relevantes e como serão mitigadas
3. Defina política de rate limiting se aplicável
4. Documente estratégia de logging (sem dados sensíveis nos logs)

### Passo 10 — ADRs de Fundação
Para cada decisão arquitetural importante, crie um ADR:
- `docs/adr/ADR-001-escolha-de-stack.md`
- `docs/adr/ADR-002-estrategia-autenticacao.md`
- `docs/adr/ADR-003-modelagem-de-dados.md`
- [etc.]

---

## Critérios de Saída

O SPEC-TECNICO está pronto quando:

- [ ] Stack definida e justificada para cada camada
- [ ] Arquitetura de alto nível documentada
- [ ] Estrutura de pastas definida
- [ ] `tsconfig.json` com paths absolutos configurado
- [ ] Modelagem de dados completa
- [ ] APIs e contratos documentados (ao menos os principais)
- [ ] Autenticação e autorização especificadas
- [ ] Estratégia de testes definida com cobertura mínima
- [ ] Considerações de segurança documentadas
- [ ] ADRs iniciais criados (mínimo 3)
- [ ] @qa revisou criticamente o spec (Fase 5 do Spec Pipeline)
- [ ] Documento salvo em `docs/[projeto]/SPEC-TECNICO.md`

---

## Output — Estrutura do SPEC-TECNICO.md

```markdown
# Especificação Técnica — [Nome do Projeto]
Versão: 1.0 | Arquiteta: Arqui (@architect) | Data: YYYY-MM-DD
Status: Rascunho | Em Revisão | Aprovado

## 1. Visão Técnica
### Objetivos Técnicos
### Princípios Guias de Arquitetura

## 2. Stack Tecnológica
| Camada | Tecnologia | Versão | Justificativa |
|--------|-----------|--------|--------------|

## 3. Arquitetura de Alto Nível
[Diagrama textual/ASCII]
[Descrição dos componentes e comunicações]

## 4. Estrutura de Pastas
[Árvore de pastas comentada]

## 5. Modelagem de Dados
[Entidades, campos e relacionamentos]

## 6. APIs e Contratos
[Endpoints, request/response, erros]

## 7. Autenticação e Autorização
[Mecanismo, roles, regras]

## 8. Integrações Externas
[APIs de terceiros, webhooks, SDKs]

## 9. Estratégia de Testes
[Pirâmide, ferramentas, cobertura]

## 10. Segurança
[Gestão de secrets, OWASP, logging]

## 11. Requisitos Não-Funcionais
| RNF | Requisito | Como Medir |
|-----|----------|-----------|

## 12. ADRs
[Links para os ADRs criados]

## 13. Histórico de Versões
```

---

*GEN.IA OS v1.0 — {{TEAM_NAME}} — {{CREATOR_NAME}}*
