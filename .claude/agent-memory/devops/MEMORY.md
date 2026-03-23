# MEMORY — @devops (Tank)

> DevOps Engineer — GEN.IA OS
> Última atualização: 2026-03-23

## Padrões Confirmados

### Protocolo de Push (autorizado pela usuária em 2026-02-24)

1. Perguntar à usuária se quer invocar @devops antes de qualquer push
2. Quando ativado: criar `.genia/session/devops-active` com conteúdo "authorized"
3. Executar `git push [args]`
4. Hook `enforce-git-push-authority.py` consome o flag e libera
5. Flag é de uso único — criado e destruído a cada push
6. Force push (`--force`, `-f`) requer confirmação explícita adicional

### npm publish

- Pacote: `create-genia-os` — publicado como `elidyizzy` no npm
- Versões publicadas: 1.0.0, 1.0.1, 2.0.0 (latest)
- Comando: `cd .Apps/create-genia-os && npm publish --access public`

## Preferências da Usuária

- Idioma: Português do Brasil
- Usuária: Elidy Izidio — Fundadora da GEN.IA SQUAD

## Regra Crítica

Único agente com autoridade para git push, PR e releases.
Nenhuma release sem aprovação de @pm.

## Infraestrutura Conhecida

- **GitHub**: elidyizzy/GENIA-SQUAD-OS (público)
- **GitHub CLI** (gh) versão 2.87.3, autenticado como elidyizzy
- **npm**: create-genia-os@2.0.0 publicado
- **Railway**: conta ativa — ver .env do projeto (não armazenar tokens aqui)
- **Netlify**: cockpit web do SalesFlow.IA (app estático)

## MCP Configurados

- **vercel** — HTTP transport, URL: https://mcp.vercel.com
  - Adicionado em: 2026-02-25
  - Auth: OAuth — rodar `/mcp` no Claude Code para autenticar

## Billing — Regra Crítica (confirmada 2026-02-27)

- Claude Code autentica via conta claude.ai → consome do Plano Pro
- `~/.claude/config.json` deve sempre estar vazio `{}` — API key aqui = dupla cobrança
- Apps de produção → API key no `.env` do projeto (nunca no config global)

## Gotchas

- Hooks com caminhos relativos quebram quando bash CWD muda para subdiretório
  → Solução: sempre usar `bash -c "cd \"$(git rev-parse --show-toplevel)\" && ..."`
- npm bin field deve ser shorthand `"./bin/index.js"` — npm v9+ rejeita formato objeto
