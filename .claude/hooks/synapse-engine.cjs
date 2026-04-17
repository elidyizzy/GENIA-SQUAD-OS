#!/usr/bin/env node
/**
 * GEN.IA OS — Synapse Engine v2.1
 * Trigger: UserPromptSubmit
 *
 * Pipeline de 4 camadas de injeção de contexto em cada prompt:
 *   L0: Constituição (sempre ativa, não-negociável)
 *   L1: Global + Contexto (sempre ativa)
 *   L2: Agente específico (quando @agente detectado no prompt)
 *   L2x: Agente Xquad (quando @xquad detectado — injeta contexto de negócio)
 *   L3: Projeto ativo (STATE.md do .planning/ — elimina trabalho genérico) ← NOVO v2.1
 *
 * Detecções adicionais:
 *   Session Start: injeta aviso de skill session-start no primeiro prompt
 *   Session End:   injeta aviso de skill session-end ao detectar palavras-chave
 *   Xquads: detecta agentes de negócio, injeta .business/ + MEMORY.md
 *
 * L3 — Project Layer (v2.1):
 *   1. Se cwd contem .planning/STATE.md -> injeta diretamente
 *   2. Se cwd e o OS root -> escaneia .Apps/[projeto]/.planning/STATE.md
 *      e injeta o projeto cujo nome aparece no prompt
 *
 * Timeout: 100ms — NUNCA bloqueia o usuário
 * Inspirado no GSD (get-shit-done, MIT License) e AIOS Synapse Engine (MIT License, SynkraAI)
 * Adaptado e reescrito para GEN.IA OS — GEN.IA SQUAD — Elidy Izidio
 */

'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const TIMEOUT_MS = 100;
const SYNAPSE_DIR = '.synapse';
const SESSION_FLAG = path.join('.genia', 'session', 'session-active');
const OS_ROOT = 'C:/Users/Dell/GENIA-SQUAD-OS';
const APPS_DIR = path.join(OS_ROOT, '.Apps');

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
      return mention.slice(1);
    }
  }
  return null;
}

function buildXquadContext(cwd, agentSlug) {
  const contextParts = [];

  const owner = readFile(path.join(cwd, '.business', 'OWNER.md'));
  if (owner) contextParts.push(`## Contexto da Fundadora\n${owner}`);

  const prioridades = readFile(path.join(cwd, '.business', 'PRIORIDADES.md'));
  if (prioridades) contextParts.push(`## Prioridades Atuais\n${prioridades}`);

  const empresa = readFile(path.join(cwd, '.business', 'GEN-IA-SQUAD', 'GEN-IA-SQUAD-EMPRESA.md'))
    || readFile(path.join(cwd, '.business', 'GEN-IA-SQUAD', 'EMPRESA.md'));
  if (empresa) contextParts.push(`## Empresa\n${empresa}`);

  const memory = readFile(path.join(cwd, '.claude', 'agent-memory', 'squads', agentSlug, 'MEMORY.md'));
  if (memory) contextParts.push(`## Memória do Agente @${agentSlug}\n${memory}`);

  contextParts.push(
    `## Regra Xquads — INVIOLÁVEL\n` +
    `Você é @${agentSlug}, um agente de estratégia/negócio.\n` +
    `RECOMENDA → os 9 agentes do SQUAD (Neo, Morpheus, Trinity, Tank, Mouse, Oracle, Cypher, Smith, Switch) EXECUTAM.\n` +
    `NÃO faz código. NÃO cria stories. NÃO faz git push.\n` +
    `Responda em português do Brasil como sua persona.`
  );

  return contextParts.join('\n\n');
}

// =============================================================================
// L3 — Project Layer (v2.1)
// Injeta STATE.md do projeto ativo para eliminar trabalho genérico
// =============================================================================

/**
 * Tenta encontrar STATE.md diretamente no cwd informado.
 * Retorna o conteúdo se encontrado.
 */
function readProjectStateFromCwd(sessionCwd) {
  if (!sessionCwd) return null;
  const statePath = path.join(sessionCwd, '.planning', 'STATE.md');
  return readFile(statePath);
}

/**
 * Escaneia .Apps/ em busca de um projeto cujo nome aparece no prompt.
 * Retorna { projectName, stateContent } ou null.
 */
function detectProjectFromPrompt(prompt) {
  if (!prompt) return null;
  try {
    if (!fs.existsSync(APPS_DIR)) return null;
    const projects = fs.readdirSync(APPS_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    const lowerPrompt = prompt.toLowerCase();
    for (const project of projects) {
      // Normaliza o nome do projeto para comparação (ex: "ProspectAI" → "prospectai")
      if (lowerPrompt.includes(project.toLowerCase())) {
        const statePath = path.join(APPS_DIR, project, '.planning', 'STATE.md');
        const content = readFile(statePath);
        if (content) return { projectName: project, stateContent: content };
      }
    }
  } catch (_) {
    // Falha silenciosa
  }
  return null;
}

/**
 * Constrói o bloco L3 com o STATE.md do projeto.
 */
function buildProjectContext(projectName, stateContent) {
  return (
    `## [L3] Projeto Ativo: ${projectName}\n` +
    `> Estado cross-session injetado automaticamente pelo Synapse Engine.\n` +
    `> Leia isto antes de qualquer resposta sobre este projeto.\n\n` +
    stateContent
  );
}

// =============================================================================

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
  const constitution = readDomain(OS_ROOT, 'constitution');
  if (constitution) layers.push(constitution);

  // L1 — Global (sempre)
  const global = readDomain(OS_ROOT, 'global');
  if (global) layers.push(global);

  // L1 — Contexto (sempre)
  const context = readDomain(OS_ROOT, 'context');
  if (context) layers.push(context);

  // L2 — Agente específico do SQUAD (se detectado)
  const agentDomain = detectActiveAgent(prompt);
  if (agentDomain) {
    const agentRules = readDomain(OS_ROOT, agentDomain);
    if (agentRules) layers.push(agentRules);
  }

  // L2x — Agente Xquad (se detectado)
  const xquadSlug = detectXquadAgent(prompt);
  if (xquadSlug) {
    const xquadContext = buildXquadContext(OS_ROOT, xquadSlug);
    if (xquadContext) layers.push(xquadContext);
  }

  // L3 — Projeto ativo (STATE.md) — v2.1
  // Prioridade 1: cwd da sessão contém .planning/STATE.md (projeto aberto diretamente)
  const directState = readProjectStateFromCwd(cwd);
  if (directState) {
    const projectName = path.basename(cwd);
    layers.push(buildProjectContext(projectName, directState));
  } else {
    // Prioridade 2: detectar projeto pelo nome no prompt (trabalhando do OS root)
    const detected = detectProjectFromPrompt(prompt);
    if (detected) {
      layers.push(buildProjectContext(detected.projectName, detected.stateContent));
    }
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
