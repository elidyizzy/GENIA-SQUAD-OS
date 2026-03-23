# SKILL: memory-update
> Atualização da memória persistente dos agentes
> Todos os agentes | Executado ao final de sessões relevantes

## Trigger
Ativado quando:
- Agente descobre padrão recorrente no projeto
- Problema difícil foi resolvido (documentar solução)
- Preferência da usuária foi identificada
- Gotcha (armadilha) foi encontrado
- Decisão arquitetural relevante foi tomada
- Usuária pede explicitamente para lembrar algo

## Localização da memória

```
.claude/agent-memory/
├── analyst/MEMORY.md    ← @analyst (Cypher)
├── pm/MEMORY.md         ← @pm (Morpheus)
├── architect/MEMORY.md  ← @architect (Trinity)
├── dev/MEMORY.md        ← @dev (Neo)
├── devops/MEMORY.md     ← @devops (Tank)
├── qa/MEMORY.md         ← @qa (Smith)
├── reviewer/MEMORY.md   ← @reviewer (Switch)
├── po/MEMORY.md         ← @po (Oracle)
└── sm/MEMORY.md         ← @sm (Mouse)
```

## Protocolo de leitura (ativação do agente)
1. Identificar agente ativo
2. Ler `.claude/agent-memory/[agente]/MEMORY.md`
3. Incorporar contexto antes de responder

## Protocolo de escrita (atualização)

### Verificar duplicação primeiro
Antes de adicionar qualquer entrada:
- Checar se já existe entry similar
- Se sim: atualizar a existente (não duplicar)
- Se não: adicionar na seção correta

### Seções do MEMORY.md

```markdown
# MEMORY — @[agente] ([Nome])
> Última atualização: YYYY-MM-DD

## Padrões Confirmados
- [padrão]: [quando usar]

## Preferências da Usuária
- [preferência]: [contexto]

## Gotchas do Projeto
- [problema]: [solução]

## Decisões Importantes
- [decisão]: [justificativa] — [data]

## Stack Tecnológica Confirmada
- [tecnologia]: [versão/contexto]
```

## O que NÃO salvar em memória
- Convenções de código (estão no CLAUDE.md)
- Estrutura de pastas (derivável do projeto)
- Histórico git (usar `git log`)
- Estado temporário da conversa atual
- Credenciais ou tokens (NUNCA)

## Regras de escrita
- Máximo 200 linhas por MEMORY.md
- Comprimir entries antigas se ultrapassar o limite
- Linguagem objetiva: fatos, não opiniões
- Datas sempre no formato YYYY-MM-DD
- Remover entries desatualizadas ou incorretas

## Atualização de PRIORIDADES.md
Ao final de sessões com decisões de projeto relevantes:
```
Write → .business/PRIORIDADES.md
Adicionar: novo projeto, mudança de foco, decisão estratégica
```

## Exemplo de entrada bem formada
```
## Gotchas do Projeto
- hooks Python no Windows: usar sys.stdin.read() (não readline) — leitura de stdin falha com readline no Windows
- settings.local.json: hooks ativos aqui; settings.json: deny rules — separação importante para não conflitar
```
