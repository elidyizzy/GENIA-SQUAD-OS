#!/usr/bin/env node
'use strict';

/**
 * GEN.IA OS — Metrics Summary
 * Uso: node scripts/metrics-summary.js [YYYY-MM]
 * Exibe resumo das métricas do SQUAD para o mês informado (padrão: mês atual).
 */

const fs   = require('fs');
const path = require('path');

const METRICS_DIR = path.join(__dirname, '..', '.genia', 'metrics');

function getTarget() {
  if (process.argv[2]) return process.argv[2];
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function loadEntries(month) {
  const file = path.join(METRICS_DIR, `${month}.jsonl`);
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map(line => { try { return JSON.parse(line); } catch { return null; } })
    .filter(Boolean);
}

function summarize(entries) {
  const byStory  = {};
  const byAgent  = {};
  const byStatus = {};

  for (const e of entries) {
    // Por story — registra último status
    byStory[e.story] = e.status;

    // Por agente
    if (e.agent && e.agent !== 'unknown') {
      byAgent[e.agent] = (byAgent[e.agent] || 0) + 1;
    }

    // Por status
    byStatus[e.status] = (byStatus[e.status] || 0) + 1;
  }

  return { byStory, byAgent, byStatus, total: entries.length };
}

function print(month, summary) {
  const { byStory, byAgent, byStatus, total } = summary;

  console.log(`\n GEN.IA OS — Métricas do SQUAD`);
  console.log(` Período: ${month} | Total de eventos: ${total}\n`);

  console.log(' Stories e último status:');
  for (const [story, status] of Object.entries(byStory)) {
    const icon = status === 'Done' ? '✅' : status === 'InProgress' ? '🔄' : '⏳';
    console.log(`   ${icon}  ${story} → ${status}`);
  }

  console.log('\n Eventos por agente:');
  for (const [agent, count] of Object.entries(byAgent).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${agent.padEnd(12)} ${count} evento(s)`);
  }

  console.log('\n Distribuição por status:');
  for (const [status, count] of Object.entries(byStatus)) {
    console.log(`   ${status.padEnd(14)} ${count}`);
  }

  console.log('');
}

const month   = getTarget();
const entries = loadEntries(month);

if (entries.length === 0) {
  console.log(`\n Nenhuma métrica encontrada para ${month}.`);
  console.log(` Arquivo esperado: .genia/metrics/${month}.jsonl\n`);
} else {
  print(month, summarize(entries));
}
