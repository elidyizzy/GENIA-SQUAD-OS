#!/usr/bin/env node
/**
 * GEN.IA OS — Synapse Engine v2.0
 * Trigger: UserPromptSubmit
 *
 * Pipeline de 3 camadas de injeção de contexto em cada prompt:
 *   L0: Constituição (sempre ativa, não-negociável)
 *   L1: Global + Contexto (sempre ativa)
 *   L2: Agente específico (quando @agente detectado no prompt)
 *   L2x: Agente Xquad (quando @xquad detectado — injeta contexto de negócio)
 *
 * Detecções adicionais:
 *   Session Start: injeta aviso de skill session-start no primeiro prompt
 *   Session End:   injeta aviso de skill session-end ao detectar palavras-chave
 *   Xquads: detecta agentes de negócio, injeta .business/ + MEMORY.md
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

// Mapeamento de @agente → domínio synapse (9 agentes do SQUAD)
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

// Agentes Xquads — recebem contexto de negócio injetado
// Estes são agentes de estratégia/negócio que RECOMENDAM (não executam código)
const XQUAD_AGENTS = new Set([
  '@ray-dalio', '@charlie-munger', '@naval-ravikant',
  '@david-ogilvy', '@dan-kennedy', '@gary-halbert',
  '@hormozi-offer',
  '@brand-chief', '@marty-neumeier',
  '@cmo-architect', '@cto-architect',
  '@avinash-kaushik', '@sean-ellis',
]);

function readFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf8').trim();
    }
  } catch (_) {
    // Falha silenciosa — Synapse nunca quebra o fluxo
  }
  return null;
}

function readDomain(cwd, domainName) {
  return readFile(path.join(cwd, SYNAPSE_DIR, domainName));
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

function detectXquadAgent(prompt) {
  if (!prompt) return null;
  const lower = prompt.toLowerCase();
  for (const mention of XQUAD_AGENTS) {
    if (lower.includes(mention)) {
      // Retorna o slug sem o '@'
      return mention.slice(1);
    }
  }
  return null;
}

function buildXquadContext(cwd, agentSlug) {
  const contextParts = [];

  // 1. Contexto da fundadora
  const owner = readFile(path.join(cwd, '.business', 'OWNER.md'));
  if (owner) contextParts.push(`## Contexto da Fundadora\n${owner}`);

  // 2. Prioridades atuais
  const prioridades = readFile(path.join(cwd, '.business', 'PRIORIDADES.md'));
  if (prioridades) contextParts.push(`## Prioridades Atuais\n${prioridades}`);

  // 3. Contexto da empresa GEN.IA (tenta dois nomes possíveis de arquivo)
  const empresa = readFile(path.join(cwd, '.business', 'GEN-IA-SQUAD', 'GEN-IA-SQUAD-EMPRESA.md'))
    || readFile(path.join(cwd, '.business', 'GEN-IA-SQUAD', 'EMPRESA.md'));
  if (empresa) contextParts.push(`## Empresa\n${empresa}`);

  // 4. MEMORY.md do agente Xquad (se existir)
  const memory = readFile(path.join(cwd, '.claude', 'agent-memory', 'squads', agentSlug, 'MEMORY.md'));
  if (memory) contextParts.push(`## Memória do Agente @${agentSlug}\n${memory}`);

  // 5. Regra de coexistência — sempre injetada
  contextParts.push(
    `## Regra Xquads — INVIOLÁVEL\n` +
    `Você é @${agentSlug}, um agente de estratégia/negócio.\n` +
    `RECOMENDA → os 9 agentes do SQUAD (Neo, Morpheus, Trinity, Tank, Mouse, Oracle, Cypher, Smith, Switch) EXECUTAM.\n` +
    `NÃO faz código. NÃO cria stories. NÃO faz git push.\n` +
    `Responda em português do Brasil como sua persona.`
  );

  return contextParts.join('\n\n');
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

  // L2 — Agente específico do SQUAD (se detectado)
  const agentDomain = detectActiveAgent(prompt);
  if (agentDomain) {
    const agentRules = readDomain(cwd, agentDomain);
    if (agentRules) layers.push(agentRules);
  }

  // L2x — Agente Xquad (se detectado — injeta contexto de negócio)
  const xquadSlug = detectXquadAgent(prompt);
  if (xquadSlug) {
    const xquadContext = buildXquadContext(cwd, xquadSlug);
    if (xquadContext) layers.push(xquadContext);
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
