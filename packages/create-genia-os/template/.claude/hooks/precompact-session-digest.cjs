#!/usr/bin/env node
/**
 * GEN.IA OS — Session Digest
 * Trigger: PreCompact
 *
 * Salva um resumo da sessão antes do Claude compactar o contexto.
 * Preserva memória institucional entre sessões longas.
 * Inspirado no AIOS precompact-session-digest (MIT License, SynkraAI)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function main() {
  let inputData = '';
  try {
    const rl = readline.createInterface({ input: process.stdin, terminal: false });
    for await (const line of rl) {
      inputData += line + '\n';
    }
  } catch (_) {
    process.exit(0);
  }

  let data = {};
  try {
    data = JSON.parse(inputData);
  } catch (_) {
    process.exit(0);
  }

  const cwd = data.cwd || process.cwd();
  const sessionId = data.session_id || 'unknown';
  const timestamp = new Date()
    .toISOString()
    .slice(0, 19)
    .replace('T', '_')
    .replace(/:/g, '-');

  const digestDir = path.join(cwd, '.genia', 'session-digests');
  try {
    fs.mkdirSync(digestDir, { recursive: true });
  } catch (_) {
    process.exit(0);
  }

  const digestPath = path.join(digestDir, `digest-${timestamp}.md`);

  const content = `# Session Digest — ${timestamp}

**Session ID:** ${sessionId}
**Sistema:** GEN.IA OS — {{TEAM_NAME}}

## Contexto Compactado

O Claude Code compactou o contexto desta sessão.
Este arquivo preserva o estado para retomada.

## Como Retomar

1. Leia as stories ativas em \`docs/stories/\`
2. Verifique \`.genia/session/workflow-state.md\` para workflow em andamento
3. Consulte \`.claude/agent-memory/[agente]/MEMORY.md\` do agente ativo
4. Verifique git log para entender o que foi commitado

## Dica

Ao retomar, informe ao agente:
> "Estou retomando a sessão. [descreva o contexto brevemente]"

---
*Gerado automaticamente pelo GEN.IA OS Synapse Engine*
`;

  try {
    fs.writeFileSync(digestPath, content, 'utf8');
  } catch (_) {
    // Falha silenciosa — nunca bloquear o usuário
  }

  process.exit(0);
}

main().catch(() => process.exit(0));
