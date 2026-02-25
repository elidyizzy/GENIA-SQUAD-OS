# Memória Persistente dos Agentes — GEN.IA OS

## Localização

```
.claude/agent-memory/
├── analyst/MEMORY.md
├── pm/MEMORY.md
├── architect/MEMORY.md
├── dev/MEMORY.md
├── devops/MEMORY.md
├── qa/MEMORY.md
├── reviewer/MEMORY.md
├── po/MEMORY.md
└── sm/MEMORY.md
```

## Regra de Leitura

Todo agente DEVE ler seu `MEMORY.md` ao ser ativado. Esta leitura é parte do protocolo de ativação.

## Quando Atualizar

Atualizar o MEMORY.md quando:
- Descobrir padrão recorrente no projeto
- Resolver problema difícil (documentar a solução)
- Identificar preferência da usuária (Elidy)
- Encontrar um gotcha (armadilha) do projeto
- Tomar decisão arquitetural relevante

## Formato do MEMORY.md

```markdown
# MEMORY — @[agente] ([Nome])

> Memória persistente. Atualizada a cada sessão relevante.
> Última atualização: YYYY-MM-DD

## Padrões Confirmados
- [padrão]: [quando usar]

## Preferências da Usuária
- [preferência]: [contexto]

## Gotchas do Projeto
- [problema]: [solução]

## Decisões Importantes
- [decisão]: [justificativa e data]

## Stack Tecnológica Confirmada
- [tecnologia]: [versão/contexto]
```

## Regra de Escrita

- Não adicionar informações duplicadas
- Verificar se já existe entry antes de criar nova
- Remover entries desatualizadas
- Máximo 200 linhas por arquivo (comprimir se necessário)
- Usar linguagem objetiva: fatos, não opiniões
