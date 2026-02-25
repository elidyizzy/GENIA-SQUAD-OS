#!/usr/bin/env node
/**
 * GEN.IA OS — Synapse Engine v1.0
 * Trigger: UserPromptSubmit
 *
 * Pipeline de 3 camadas de injeção de contexto:
 * L0: Constituição (sempre ativa)
 * L1: Global + Contexto (sempre ativa)
 * L2: Agente específico (quando detectado no prompt)
 *
 * Timeout: 100ms (nunca bloqueia o usuário)
 * Baseado no AIOS Synapse Engine (MIT License, SynkraAI)
 * Adaptado para GEN.IA OS — Be Data
 */

'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const TIMEOUT_MS = 100;
const SYNAPSE_DIR = '.synapse';

// Mapeamento de @agente para domínio synapse
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
  } catch (e) {
    // Falha silenciosa
  }
  return null;
}

function detectActiveAgent(prompt) {
  if (!prompt) return null;
  for (const [mention, domain] of Object.entries(AGENT_DOMAINS)) {
    if (prompt.includes(mention)) {
      return domain;
    }
  }
  return null;
}

async function main() {
  const timer = setTimeout(() => {
    // Timeout de segurança — não bloquear nunca
    process.stdout.write(JSON.stringify({ hookSpecificOutput: '' }));
    process.exit(0);
  }, TIMEOUT_MS);

  let inputData = '';
  try {
    const rl = readline.createInterface({ input: process.stdin });
    for await (const line of rl) {
      inputData += line + '\n';
    }
  } catch (e) {
    clearTimeout(timer);
    process.stdout.write(JSON.stringify({ hookSpecificOutput: '' }));
    process.exit(0);
  }

  let data = {};
  try {
    data = JSON.parse(inputData);
  } catch (e) {
    clearTimeout(timer);
    process.stdout.write(JSON.stringify({ hookSpecificOutput: '' }));
    process.exit(0);
  }

  const cwd = data.cwd || process.cwd();
  const prompt = data.prompt || '';

  const layers = [];

  // L0: Constituição (sempre)
  const constitution = readDomain(cwd, 'constitution');
  if (constitution) layers.push(constitution);

  // L1: Global + Contexto (sempre)
  const global = readDomain(cwd, 'global');
  if (global) layers.push(global);

  const context = readDomain(cwd, 'context');
  if (context) layers.push(context);

  // L2: Agente específico (se detectado no prompt)
  const agentDomain = detectActiveAgent(prompt);
  if (agentDomain) {
    const agentRules = readDomain(cwd, agentDomain);
    if (agentRules) layers.push(agentRules);
  }

  clearTimeout(timer);

  if (layers.length === 0) {
    process.stdout.write(JSON.stringify({ hookSpecificOutput: '' }));
    process.exit(0);
  }

  const synapseOutput = `<synapse-rules>
${layers.join('\n\n')}
</synapse-rules>`;

  process.stdout.write(JSON.stringify({ hookSpecificOutput: synapseOutput }));
  process.exit(0);
}

main().catch(() => {
  process.stdout.write(JSON.stringify({ hookSpecificOutput: '' }));
  process.exit(0);
});
