#!/usr/bin/env node
/**
 * GEN.IA OS — Synapse Engine v1.1
 * Trigger: UserPromptSubmit
 *
 * Pipeline de 3 camadas de injeção de contexto em cada prompt:
 *   L0: Constituição (sempre ativa, não-negociável)
 *   L1: Global + Contexto (sempre ativa)
 *   L2: Agente específico (quando @agente detectado no prompt)
 *
 * Detecções adicionais:
 *   Session Start: injeta aviso de skill session-start no primeiro prompt
 *   Session End:   injeta aviso de skill session-end ao detectar palavras-chave
 *
 * Timeout: 100ms — NUNCA bloqueia o usuário
 * Inspirado no AIOS Synapse Engine (MIT License, SynkraAI)
 * Adaptado e reescrito para GEN.IA OS — GEN.IA SQUAD — Elidy Izidio
 */

'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const TIMEOUT_MS = 100;
const SYNAPSE_DIR = '.synapse';
const SESSION_FLAG = path.join('.genia', 'session', 'session-active');

// Palavras-chave que indicam encerramento de sessão
const SESSION_END_KEYWORDS = [
  'encerrar sessão', 'fechar sessão', 'pode fechar',
  'boa noite', 'até amanhã', 'vou parar por hoje',
  'session end', 'end session',
];

// Mapeamento de @agente → domínio synapse
const AGENT_DOMAINS = {
  '@analyst': 'agent-analyst',
  '@pm': 'agent-pm',
  '@architect': 'agent-architect',
  '@dev': 'agent-dev',
  '@devops': 'agent-devops',
  '@qa': 'agent-qa',
  '@reviewer': 'agent-reviewer',
  '@po': 'agent-po',
  '@sm': 'agent-sm',
};

function readDomain(cwd, domainName) {
  try {
    const domainPath = path.join(cwd, SYNAPSE_DIR, domainName);
    if (fs.existsSync(domainPath)) {
      return fs.readFileSync(domainPath, 'utf8').trim();
    }
  } catch (_) {
    // Falha silenciosa — Synapse nunca quebra o fluxo
  }
  return null;
}

function detectSessionEnd(prompt) {
  if (!prompt) return false;
  const lower = prompt.toLowerCase();
  return SESSION_END_KEYWORDS.some((kw) => lower.includes(kw));
}

function detectSessionStart(cwd) {
  try {
    const flagPath = path.join(cwd, SESSION_FLAG);
    return !fs.existsSync(flagPath);
  } catch (_) {
    return false;
  }
}

function createSessionFlag(cwd) {
  try {
    const flagPath = path.join(cwd, SESSION_FLAG);
    fs.mkdirSync(path.dirname(flagPath), { recursive: true });
    fs.writeFileSync(flagPath, new Date().toISOString(), 'utf8');
  } catch (_) {
    // Falha silenciosa
  }
}

function removeSessionFlag(cwd) {
  try {
    const flagPath = path.join(cwd, SESSION_FLAG);
    if (fs.existsSync(flagPath)) fs.unlinkSync(flagPath);
  } catch (_) {
    // Falha silenciosa
  }
}

function detectActiveAgent(prompt) {
  if (!prompt) return null;
  const lower = prompt.toLowerCase();
  for (const [mention, domain] of Object.entries(AGENT_DOMAINS)) {
    if (lower.includes(mention)) {
      return domain;
    }
  }
  return null;
}

async function run() {
  let inputData = '';
  try {
    const rl = readline.createInterface({ input: process.stdin, terminal: false });
    for await (const line of rl) {
      inputData += line + '\n';
    }
  } catch (_) {
    return '';
  }

  let data = {};
  try {
    data = JSON.parse(inputData);
  } catch (_) {
    return '';
  }

  const cwd = data.cwd || process.cwd();
  const prompt = data.prompt || '';
  const layers = [];

  // L0 — Constituição (sempre)
  const constitution = readDomain(cwd, 'constitution');
  if (constitution) layers.push(constitution);

  // L1 — Global (sempre)
  const global = readDomain(cwd, 'global');
  if (global) layers.push(global);

  // L1 — Contexto (sempre)
  const context = readDomain(cwd, 'context');
  if (context) layers.push(context);

  // L2 — Agente específico (se detectado)
  const agentDomain = detectActiveAgent(prompt);
  if (agentDomain) {
    const agentRules = readDomain(cwd, agentDomain);
    if (agentRules) layers.push(agentRules);
  }

  // Session End — detectar antes do Start para prioridade correta
  const isEnding = detectSessionEnd(prompt);
  if (isEnding) {
    removeSessionFlag(cwd);
    layers.push(
      'ATENÇÃO: Encerramento detectado. Tank (@devops) deve ' +
      'executar a skill session-end ANTES de encerrar.\n' +
      'Arquivo: .claude/skills/session-end/SKILL.md'
    );
  }

  // Session Start — apenas se não for encerramento
  if (!isEnding && detectSessionStart(cwd)) {
    createSessionFlag(cwd);
    layers.push(
      'ATENÇÃO: Sessão iniciada. Execute a skill session-start ' +
      'ANTES de qualquer outra ação.\n' +
      'Arquivo: .claude/skills/session-start/SKILL.md'
    );
  }

  if (layers.length === 0) return '';

  return `<synapse-rules>\n${layers.join('\n\n')}\n</synapse-rules>`;
}

async function main() {
  // Timer de segurança — garante timeout de 100ms
  const timeoutPromise = new Promise((resolve) =>
    setTimeout(() => resolve(''), TIMEOUT_MS)
  );

  const result = await Promise.race([run(), timeoutPromise]);

  process.stdout.write(JSON.stringify({ hookSpecificOutput: result || '' }));
  process.exit(0);
}

main().catch(() => {
  process.stdout.write(JSON.stringify({ hookSpecificOutput: '' }));
  process.exit(0);
});
