# MEMORY — @devops (Tank)
> DevOps Engineer — GEN.IA OS
> Última atualização: 2026-02-24

## Padrões Confirmados

### Protocolo de Push (autorizado pela usuária em 2026-02-24)

1. Perguntar à usuária se quer invocar @devops antes de qualquer push
2. Quando ativado: criar `.genia/session/devops-active` com conteúdo "authorized"
3. Executar `git push [args]`
4. Hook `enforce-git-push-authority.py` consome o flag e libera
5. Flag é de uso único — criado e destruído a cada push
6. Force push (`--force`, `-f`) requer confirmação explícita adicional

## Preferências da Usuária
- Idioma: Português do Brasil
- Usuária: Elidy Izidio

## Regra Crítica
Único agente com autoridade para git push, PR e releases.
Nenhuma release sem aprovação de @pm.

## Infraestrutura Conhecida

- GitHub: elidyizzy/GENIA-SQUAD-OS (público desde 2026-02-25)
- GitHub CLI (gh) versão 2.87.3, autenticado como elidyizzy
- npm: create-genia-os@1.0.1 publicado, user gen.ia
- GitHub Pages: <https://elidyizzy.github.io/GENIA-SQUAD-OS/> (source: docs/, branch: main)
- Vercel: projeto masterclass-geniaos em Apps/masterclass-geniaos/
- **Railway**: conta ativa — token API: `233482d4-62da-48aa-b4e0-24bdf4971713`
  - Projeto: sitenovo-cuore (Express + SQLite + React)
  - Usar Railway CLI: `railway login --token <token>` para autenticar

## MCP Configurados

- **vercel** — HTTP transport, URL: <https://mcp.vercel.com>
  - Adicionado em: 2026-02-25
  - Config: C:\Users\elidy\.claude.json (project scope)
  - Auth: OAuth — rodar `/mcp` no Claude Code para autenticar
  - Capacidades: docs, deployments, logs, projetos, env vars

## Billing — Regra Crítica (confirmada 2026-02-27)

- Claude Code autentica via conta claude.ai → consome do Plano Pro (R$ 110/mês)
- `~/.claude/config.json` deve sempre estar vazio `{}` — API key aqui = dupla cobrança
- Apps de produção (Luma AI, bots, agentes) → API key no `.env` do projeto (correto)
- Verificar: `cat ~/.claude/config.json` deve retornar `{}`

## Gotchas

- hooks com caminhos relativos quebram quando bash CWD muda para subdiretório
  → Solução: sempre usar `bash -c "cd \"$(git rev-parse --show-toplevel)\" && ..."`
- npm bin field deve ser shorthand `"./bin/index.js"` — npm v9+ rejeita formato objeto
