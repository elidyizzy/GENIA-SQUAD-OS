# Protocolo de Handoff — GEN.IA OS

## Quando Fazer Handoff

Handoff é obrigatório quando:
- Tarefa requer autoridade de outro agente (Artigo II)
- Fase do workflow mudou
- Blocker identificado fora do escopo atual
- Trabalho está completo e próxima etapa é de outro agente

## Formato de Handoff (≤ 400 tokens)

```
[@agente-atual → @próximo-agente]

📋 Contexto: [O que foi feito em 2-3 frases]

📌 Decisões tomadas:
- [decisão 1]
- [decisão 2]

📁 Arquivos criados/modificados:
- [path/arquivo.md]

⚠️  Pendências:
- [o que precisa ser feito]

🔗 Story atual: STORY-NNN (se aplicável)
```

## Regra de Token Budget

- Handoff DEVE ser ≤ 400 tokens
- Após 2+ trocas de agente, comprimir histórico ao essencial
- Não repassar contexto completo — apenas decisões e pendências

## Compressão de Contexto

Quando o contexto estiver saturado (muitas trocas de agente):

1. Criar `.genia/session/context-summary.md` com:
   - Decisões arquiteturais tomadas
   - Stories em andamento e seus estados
   - Blockers conhecidos
   - Stack tecnológica confirmada

2. Referenciar o arquivo no próximo handoff:
   ```
   [Contexto comprimido em .genia/session/context-summary.md]
   ```

## Exemplos de Handoff

**@dev → @devops (após implementação):**
```
[@dev → @devops]
📋 Implementei STORY-003 (autenticação JWT). Commits feitos localmente.
📌 Decisões: Usei jose library, tokens expiram em 1h, refresh em 7d.
📁 Modificados: src/auth/jwt.ts, src/middleware/auth.ts, tests/auth.test.ts
⚠️  Pendências: Push da branch feat/STORY-003-jwt-auth e criar PR para main.
🔗 Story atual: STORY-003 (status: InReview)
```

**@analyst → @pm (após briefing):**
```
[@analyst → @pm]
📋 Coletei requisitos completos do sistema de orçamentos BrasilUp.
📌 Decisões: App web (não mobile), integração com Kommo CRM, 3 usuários simultâneos.
📁 Criados: docs/brasilup/BRIEFING.md
⚠️  Pendências: Criar PRD com base no briefing. Atenção ao requisito de relatórios PDF.
```
