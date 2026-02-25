# Uso de Ferramentas e MCP — GEN.IA OS

## Prioridade de Ferramentas

```
1. Ferramentas nativas Claude Code  (sempre preferir)
2. Ferramentas MCP configuradas     (quando necessário)
3. Bash com CLI tools               (último recurso)
```

## Ferramentas Nativas — Sempre Preferir

| Operação | Ferramenta Correta | NÃO usar |
|----------|--------------------|----------|
| Ler arquivo | Read | Bash cat/head/tail |
| Criar arquivo | Write | Bash echo/cat heredoc |
| Editar arquivo | Edit | Bash sed/awk |
| Buscar arquivo | Glob | Bash find/ls |
| Buscar conteúdo | Grep | Bash grep/rg |
| Perguntar usuário | AskUserQuestion | — |
| Tarefa complexa | Task | — |

## Gerenciamento MCP

**@devops é o ÚNICO autorizado a:**
- Adicionar servidores MCP
- Remover servidores MCP
- Configurar MCP (editar settings.json de MCP)
- Fazer upgrade de versão de servidor MCP

Outros agentes são **consumidores apenas**.

## Regra de Ouro

> "Se uma ferramenta nativa do Claude Code resolve, não use MCP."

## Servidores MCP Disponíveis

Ver configuração em `.claude/settings.json` (gerenciado por @devops).

## Quando Usar Bash

Use Bash apenas para:
- Comandos git (quando necessário)
- Executar scripts (npm, python, etc.)
- Operações de sistema que não têm ferramenta nativa
- Comandos CLI específicos (supabase, gh, etc.)

Nunca para: leitura/escrita/busca de arquivos.
