# Checklist: Pré-Commit

> Verificações obrigatórias antes de qualquer commit.
> Executado por @dev. Automatizável via git hooks.

---

## Objetivo

Garantir que nenhum commit "sujo" entre no histórico do repositório. Um commit deve ser uma unidade de mudança coesa, funcional e segura. Esta checklist previne problemas que são muito mais custosos de corrigir depois do commit.

---

## Checklist Completo

### Bloco 1 — Qualidade de Código (Obrigatório)

```bash
npm run lint
```

- [ ] Zero erros de lint
- [ ] Zero warnings de lint (warnings são erros em potencial)
- [ ] Nenhuma regra do ESLint desabilitada com `// eslint-disable` sem comentário explicativo

```bash
npm run typecheck
```

- [ ] Zero erros TypeScript
- [ ] Nenhum `@ts-ignore` ou `@ts-expect-error` sem explicação no comentário
- [ ] Sem `any` usado como atalho — tipagem explícita ou `unknown`

---

### Bloco 2 — Testes (Obrigatório)

```bash
npm run test
```

- [ ] Todos os testes passando
- [ ] Nenhum teste em `skip` ou `xtest` que foi esquecido
- [ ] Nenhum `test.only` esquecido (faria outros testes serem ignorados no CI)

```bash
npm run coverage
```

- [ ] Coverage >= 80% nas linhas modificadas
- [ ] Se coverage caiu abaixo de 80%: adicionar testes antes de commitar

---

### Bloco 3 — Segurança (Obrigatório)

Antes de executar `git add`, verifique todos os arquivos no diff:

```bash
git diff --staged
```

- [ ] Sem passwords, tokens, API keys ou secrets hardcodados
- [ ] Sem credenciais de banco de dados no código
- [ ] Sem URLs de ambiente hardcodadas (usar variáveis de ambiente)
- [ ] Arquivo `.env` ou `.env.local` NÃO está sendo commitado
- [ ] Sem chaves privadas (`.pem`, `.key`) no staged
- [ ] Sem tokens de autenticação em nenhum arquivo

**Se encontrar qualquer desses:** remova ANTES de commitar. Secrets no histórico git são permanentes e comprometem a segurança do projeto.

---

### Bloco 4 — Limpeza de Código (Obrigatório)

Leia o diff uma vez como se fosse o reviewer:

- [ ] Sem `console.log`, `console.debug`, `console.warn` de debug esquecidos
- [ ] Sem código comentado desnecessariamente (use `git stash` se quiser salvar)
- [ ] Sem imports não utilizados
- [ ] Sem variáveis declaradas e não utilizadas
- [ ] Sem arquivos de teste manual esquecidos (`test.html`, `debug.js`, etc.)

---

### Bloco 5 — Conformidade com Padrões (Obrigatório)

- [ ] Todos os imports novos usam paths absolutos com `@/`
- [ ] Nenhum import relativo com `../../` em arquivos novos
- [ ] Nomenclatura seguindo os padrões do SPEC-TECNICO (camelCase, PascalCase)
- [ ] Arquivos criados nas pastas corretas conforme estrutura definida

---

### Bloco 6 — Formato do Commit (Obrigatório)

A mensagem de commit deve seguir o formato:

```
tipo(escopo): descrição em imperativo presente

[corpo opcional com contexto adicional]

Story: STORY-XXX
Co-Authored-By: GEN.IA OS <genia@bedata.com.br>
```

- [ ] Tipo válido: `feat`, `fix`, `refactor`, `test`, `docs`, `style`, `chore`
- [ ] Escopo relevante ao módulo modificado
- [ ] Descrição em imperativo: "adicionar", "corrigir", "implementar" (não "adicionado", "foi corrigido")
- [ ] Descrição em até 72 caracteres na primeira linha
- [ ] Story ID incluído quando aplicável
- [ ] Co-authored-by incluído

**Exemplos corretos:**
```
feat(auth): implementar formulário de login com validação de email
fix(api): corrigir erro 500 ao criar usuário sem telefone
test(payment): adicionar casos de teste para falha de pagamento
```

**Exemplos incorretos:**
```
update stuff
fixing bug
WIP
feat: fiz várias coisas no componente de login e também corrigi um bug
```

---

### Bloco 7 — Atomicidade (Boas Práticas)

- [ ] Este commit representa UMA mudança coesa e descritível em uma frase?
- [ ] Se o commit precisaria de "e também" na descrição, considere dividir em 2 commits
- [ ] Arquivos não relacionados a esta mudança NÃO estão em stage
- [ ] Arquivos de configuração pessoal (`.vscode/settings.json` pessoal, etc.) não incluídos

---

## Verificação Rápida Final

Execute a sequência completa antes de `git commit`:

```bash
npm run lint && npm run typecheck && npm run test && echo "PRÉ-COMMIT OK ✓"
```

Se este comando terminar com `PRÉ-COMMIT OK ✓`, o commit pode ser feito.

Se falhar: corrija o problema identificado antes de commitar.

---

## Automatização com Git Hooks

Para automatizar parte desta checklist, adicione o hook em `.git/hooks/pre-commit`:

```bash
#!/bin/sh
echo "Executando verificações pré-commit..."

npm run lint
if [ $? -ne 0 ]; then
  echo "BLOQUEADO: Lint falhou. Corrija os erros antes de commitar."
  exit 1
fi

npm run typecheck
if [ $? -ne 0 ]; then
  echo "BLOQUEADO: TypeScript com erros. Corrija antes de commitar."
  exit 1
fi

npm run test
if [ $? -ne 0 ]; then
  echo "BLOQUEADO: Testes falhando. Corrija antes de commitar."
  exit 1
fi

echo "Verificações pré-commit concluídas. ✓"
exit 0
```

Tornar executável:
```bash
chmod +x .git/hooks/pre-commit
```

**Nota:** @devops é responsável por configurar hooks em nível de projeto (usando Husky ou similar) para que se apliquem a todo o time.

---

## Exceções

Em situações excepcionais, @architect pode autorizar um commit que não passa em todas as verificações, com:
- Registro documentado da exceção
- Justificativa técnica
- Issue criada para resolução imediata (no mesmo sprint)

**Exceções nunca são a norma.** Se você se pega precisando de exceções frequentemente, o problema é no código ou no processo.

---

*GEN.IA OS v1.0 — {{TEAM_NAME}} — {{CREATOR_NAME}}*
