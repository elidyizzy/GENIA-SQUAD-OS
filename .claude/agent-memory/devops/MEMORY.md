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

### npm publish — REGRA INVIOLÁVEL (2026-04-12)

Toda alteração no GEN.IA OS deve ser publicada em DOIS lugares obrigatoriamente:
1. GitHub (`elidyizzy/GENIA-SQUAD-OS`) via git push
2. npm (`create-genia-os`) via npm publish com versão incrementada

**Nunca** atualizar um sem o outro.

- Pacote: `create-genia-os` — publicado como `gen.ia` no npm
- Versão atual: 2.2.0 (publicada em 2026-04-12)
- Diretório: `packages/create-genia-os/`
- Token de automação configurado em `~/.npmrc` (Classic Automation token)
- Comando: `cd packages/create-genia-os && npm publish`
- Sincronizar template em `packages/create-genia-os/template/` antes de publicar

## Preferências da Usuária

- Idioma: Português do Brasil
- Usuária: Elidy Izidio — Fundadora da GEN.IA SQUAD

## Regra Crítica

Único agente com autoridade para git push, PR e releases.
Nenhuma release sem aprovação de @pm.

## Infraestrutura Conhecida

- **GitHub**: elidyizzy/GENIA-SQUAD-OS (público)
- **GitHub CLI** (gh) versão 2.87.3, autenticado como elidyizzy
- **npm**: create-genia-os@2.2.0 publicado (2026-04-12)
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
- npm bin field deve ser objeto: `{"create-genia-os": "bin/index.js"}` — usar `npm pkg fix` para corrigir
- Token de automação npm: Classic Automation token (não Granular) — único que bypassa 2FA para publish
