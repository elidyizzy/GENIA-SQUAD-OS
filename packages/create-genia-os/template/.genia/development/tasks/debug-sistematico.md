# Task: Debug Sistemático

> Processo estruturado para investigar e resolver bugs complexos.
> Aplicável por @dev (com suporte de @architect quando necessário).

---

## Objetivo

Resolver bugs de forma sistemática e documentada, evitando soluções por tentativa e erro que geram mais problemas do que resolvem. Um bug resolvido sem ser compreendido é um bug que vai voltar.

---

## Quando Usar Esta Task

- Bug reportado por @qa com severidade CRÍTICO ou ALTO
- Bug intermitente que não reproduz de forma consistente
- Bug de performance ou memory leak
- Erro em produção que precisa de investigação rápida
- Bug cuja causa raiz não é óbvia na primeira análise

---

## Passos de Execução

### Passo 1 — Leitura do Bug Report

Antes de tocar no código:

1. Leia o bug report completo de @qa
2. Confirme que você consegue reproduzir o bug com os passos fornecidos
3. Se não conseguir reproduzir: notifique @qa imediatamente com evidência (screenshot, log)
4. **Reprodução é obrigatória antes de começar a debugar**

### Passo 2 — Hipótese Antes de Código

Antes de abrir qualquer arquivo:

1. Baseado na descrição do bug, qual é a sua hipótese inicial sobre a causa?
2. Anote a hipótese (não pule este passo — ajuda a manter o foco)
3. Liste os locais do código mais prováveis onde o problema pode estar
4. Estime: este bug é de lógica, de dados, de timing, de estado, de integração?

**Tipos comuns de bug:**
- **Lógica:** condição incorreta, comparação errada, operação matemática errada
- **Estado:** estado React não atualizado, variável mutada incorretamente
- **Assincronismo:** race condition, Promise não awaited, callback timing
- **Integração:** API retornando formato inesperado, erro de rede não tratado
- **Dados:** null/undefined não tratado, tipo de dado incorreto
- **Ambiente:** variável de ambiente não configurada, versão de dependência diferente

### Passo 3 — Isolamento

1. **Reduza o problema ao mínimo reproduzível:**
   - Existe um teste unitário que reproduz o bug? (crie um se não houver)
   - Você consegue remover partes do código e ainda reproduzir?
   - O bug ocorre com dados específicos? Quais?

2. **Delimite a área suspeita:**
   - Adicione logs estratégicos para entender o fluxo de execução
   - Verifique os valores das variáveis no momento do bug
   - Use o debugger (breakpoints) se disponível

```bash
# Exemplo de log estratégico (temporário, remover após debug)
console.log('[DEBUG STORY-XXX]', { variavel, estado, resultado })
```

### Passo 4 — Investigação com Ferramentas

**Para bugs de runtime:**
```bash
# Execute com mais verbosidade
NODE_DEBUG=http npm run dev

# Verifique os logs do servidor
npm run dev 2>&1 | grep ERROR

# Execute testes específicos em modo verbose
npm run test -- --verbose NomeDoTeste
```

**Para bugs de TypeScript:**
```bash
npm run typecheck -- --listFiles
npm run typecheck 2>&1 | grep -A5 "error TS"
```

**Para bugs de performance:**
- React DevTools Profiler para re-renders desnecessários
- Network tab para requests lentos
- Memory tab para memory leaks

**Para bugs de integração:**
- Verifique o contrato da API com a documentação
- Log do request e response completos (sem dados sensíveis nos logs de prod)
- Verifique se o ambiente correto está sendo usado

### Passo 5 — Causa Raiz

Após a investigação:

1. Documente a causa raiz identificada:
   ```
   Causa raiz: [descrição técnica precisa]
   Arquivo: src/[caminho]/arquivo.ts linha XX
   Por que ocorre: [explicação do mecanismo do bug]
   ```

2. Valide a causa raiz:
   - Se você corrigir isso, o bug vai sumir?
   - Há outros lugares no código com o mesmo problema?
   - Esta causa raiz explica todos os sintomas relatados?

### Passo 6 — Solução Planejada

Antes de escrever qualquer código de correção:

1. Defina a solução:
   - O que exatamente vai ser mudado?
   - A mudança tem efeitos colaterais em outros lugares?
   - Há uma solução mais simples que resolve o problema?

2. Verifique se a solução está dentro do escopo:
   - Esta correção está dentro do que foi especificado no SPEC-TECNICO?
   - Se for uma solução arquitetural maior: consultar @architect ANTES
   - Se mudança de comportamento esperado: consultar @po ANTES

### Passo 7 — Implementação da Correção

1. Crie ou use o branch da story associada
2. Implemente a correção mínima necessária (não aproveite para "melhorar outras coisas")
3. Remova todos os logs de debug temporários
4. Escreva ou atualize o teste que reproduzia o bug (agora deve passar)
5. Execute a suite completa de testes:
   ```bash
   npm run lint && npm run typecheck && npm run test
   ```
6. Verifique que o bug original não reproduz mais

### Passo 8 — Commit da Correção

```bash
git add [arquivos modificados]
git commit -m "fix(escopo): corrigir [descrição do bug]

Causa raiz: [breve descrição]
Solução: [breve descrição da correção]

Bug: BUG-QA-XXX
Story: STORY-XXX
Co-Authored-By: GEN.IA OS <genia@bedata.com.br>"
```

### Passo 9 — Documentação e Comunicação

1. Atualize o bug report com:
   - Causa raiz identificada
   - Solução implementada
   - Arquivos modificados
   - Status: Resolvido

2. Notifique @qa para re-verificar:
   - Bug resolvido
   - Como verificar que a correção funciona
   - Se há outros cenários relacionados para testar

---

## Quando Escalar para @architect

Escale imediatamente se:

- A causa raiz é um problema de arquitetura (não pode ser corrigido localmente)
- A correção requer mudança significativa na estrutura do sistema
- O bug está relacionado a segurança ou corrupção de dados
- Não há clareza sobre qual é a solução correta após 1h de investigação
- O bug afeta múltiplos módulos e a correção impacta contratos de API

**Ao escalar:**
```
@architect — encontrei bug complexo em STORY-XXX

Descrição do bug: [...]
Causa raiz suspeita: [...]
O que já investiguei: [...]
Por que estou escalando: [...]
Qual decisão preciso de você: [...]
```

---

## Registro de Bug Para Aprendizado

Bugs complexos devem ser documentados para o time:

```markdown
## Post-Mortem — BUG-XXX — [Título]
Data: YYYY-MM-DD | Investigado por: @dev

### Sintoma
[Como o bug se manifestava]

### Causa Raiz
[O que causava o bug]

### Solução Implementada
[Como foi corrigido]

### Como Prevenir No Futuro
[Mudança de processo, teste adicional, ou documentação]
```

---

## Critérios de Saída

O debug sistemático está concluído quando:

- [ ] Bug reproduzido e documentado
- [ ] Causa raiz identificada e documentada
- [ ] Correção implementada e commitada
- [ ] Testes passando (incluindo teste do cenário do bug)
- [ ] Logs de debug removidos
- [ ] @qa notificado para re-verificar
- [ ] Bug report atualizado com causa raiz e solução

---

*GEN.IA OS v1.0 — {{TEAM_NAME}} — {{CREATOR_NAME}}*
