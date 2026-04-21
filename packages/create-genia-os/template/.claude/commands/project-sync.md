# /project-sync

Sincroniza o `.planning/STATE.md` do projeto com o estado real após mudanças.
Executado por @dev ou @sm a cada story marcada como Done.

## Quando usar

- Após uma story ser concluída (Done)
- Ao tomar uma decisão arquitetural
- Ao encontrar ou resolver um blocker
- Ao iniciar uma nova fase ou milestone

## Execução

1. Detectar o projeto (igual ao /project-state)

2. Ler o STATE.md atual

3. Perguntar o que mudou:
   ```
   O que sincronizar?
   1. Story concluída (Done)
   2. Nova decisão arquitetural
   3. Blocker encontrado / resolvido
   4. Mudança de fase ou milestone
   5. Tudo (varredura completa)
   ```

4. Para cada opção selecionada, coletar as informações necessárias

5. Atualizar o STATE.md com:
   - Stories movidas para o estado correto
   - Decisão adicionada à tabela de decisões arquiteturais
   - Blocker adicionado ou removido
   - Fase/milestone atualizado
   - Campo "Última sincronização" atualizado com data e agente
   - Próximos passos revisados

6. Confirmar: "STATE.md sincronizado. O Synapse Engine vai injetar o contexto atualizado na próxima sessão."

## Regra

STATE.md desatualizado = Claude trabalha com contexto errado.
Sincronizar é obrigação do agente que conclui a story.
