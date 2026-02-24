# Guideline: Clean Code

> Padroes de codigo pragmaticos - conciso, direto, sem over-engineering.

## Principios Core

| Principio | Regra |
|-----------|-------|
| **SRP** | Single Responsibility - cada funcao/classe faz UMA coisa |
| **DRY** | Don't Repeat Yourself - extrair duplicatas, reusar |
| **KISS** | Keep It Simple - solucao mais simples que funciona |
| **YAGNI** | You Aren't Gonna Need It - nao construir features nao usadas |
| **Boy Scout** | Deixar codigo mais limpo do que encontrou |

## Regras de Naming

| Elemento | Convencao |
|----------|-----------|
| **Variaveis** | Revelar intencao: `userCount` nao `n` |
| **Funcoes** | Verbo + substantivo: `getUserById()` nao `user()` |
| **Booleans** | Forma de pergunta: `isActive`, `hasPermission`, `canEdit` |
| **Constantes** | SCREAMING_SNAKE: `MAX_RETRY_COUNT` |

> **Regra:** Se voce precisa de um comentario para explicar o nome, renomeie.

## Regras de Funcao

| Regra | Descricao |
|-------|-----------|
| **Pequena** | Max 20 linhas, idealmente 5-10 |
| **Uma Coisa** | Faz uma coisa, faz bem |
| **Um Nivel** | Um nivel de abstracao por funcao |
| **Poucos Args** | Max 3 argumentos, preferir 0-2 |
| **Sem Side Effects** | Nao mutar inputs inesperadamente |

## Estrutura de Codigo

| Padrao | Aplicar |
|--------|---------|
| **Guard Clauses** | Early returns para edge cases |
| **Flat > Nested** | Evitar nesting profundo (max 2 niveis) |
| **Composicao** | Funcoes pequenas compostas |
| **Colocacao** | Manter codigo relacionado proximo |

## Estilo de Codigo AI

| Situacao | Acao |
|----------|------|
| Usuario pede feature | Escrever diretamente |
| Usuario reporta bug | Corrigir, nao explicar |
| Requisito nao claro | Perguntar, nao assumir |

## Anti-Patterns

| NAO Fazer | Fazer |
|-----------|-------|
| Comentar cada linha | Deletar comentarios obvios |
| Helper para one-liner | Inline o codigo |
| Factory para 2 objetos | Instanciacao direta |
| utils.ts com 1 funcao | Colocar onde usado |
| "First we import..." | Apenas escrever codigo |
| Deep nesting | Guard clauses |
| Magic numbers | Named constants |
| God functions | Dividir por responsabilidade |

## Antes de Editar Qualquer Arquivo

| Pergunta | Por que |
|----------|---------|
| **O que importa este arquivo?** | Pode quebrar |
| **O que este arquivo importa?** | Mudanca de interface |
| **Quais testes cobrem isso?** | Testes podem falhar |
| **E um componente compartilhado?** | Multiplos lugares afetados |

> **Regra:** Editar arquivo + todos dependentes na MESMA tarefa.

## Self-Check Antes de Completar

| Check | Pergunta |
|-------|----------|
| **Objetivo alcancado?** | Fiz exatamente o que usuario pediu? |
| **Arquivos editados?** | Modifiquei todos arquivos necessarios? |
| **Codigo funciona?** | Testei/verifiquei a mudanca? |
| **Sem erros?** | Lint e TypeScript passam? |
| **Nada esquecido?** | Algum edge case perdido? |

## Resumo

| Fazer | Nao Fazer |
|-------|-----------|
| Escrever codigo direto | Escrever tutoriais |
| Deixar codigo se auto-documentar | Adicionar comentarios obvios |
| Corrigir bugs imediatamente | Explicar o fix primeiro |
| Inline coisas pequenas | Criar arquivos desnecessarios |
| Nomear coisas claramente | Usar abreviacoes |
| Manter funcoes pequenas | Escrever funcoes 100+ linhas |

> **Lembrar: O usuario quer codigo funcionando, nao uma aula de programacao.**
