#!/usr/bin/env node
'use strict';

/**
 * GEN.IA OS — Metrics Tracker
 * Trigger: PostToolUse(Write)
 *
 * Registra eventos de story e agente em .genia/metrics/YYYY-MM.jsonl
 * Falha silenciosa — NUNCA bloqueia o fluxo principal.
 */

const fs = require('fs');
const path = require('path');

const METRICS_DIR = path.join('.genia', 'metrics');

function getMetricsPath() {
  const now = new Date();
  const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  return path.join(METRICS_DIR, `${ym}.jsonl`);
}

function appendMetric(entry) {
  fs.mkdirSync(METRICS_DIR, { recursive: true });
  fs.appendFileSync(getMetricsPath(), JSON.stringify(entry) + '\n', 'utf8');
}

function extractField(content, field) {
  const match = content.match(new RegExp(`\\*\\*${field}:\\*\\*\\s*(\\S+)`));
  return match ? match[1] : null;
}

function extractStoryNumber(filePath) {
  const match = path.basename(filePath).match(/STORY-(\d+)/i);
  return match ? `STORY-${match[1]}` : null;
}

async function main() {
  let raw = '';
  for await (const chunk of process.stdin) raw += chunk;

  const data = JSON.parse(raw);
  const filePath = (data.tool_input || {}).file_path || '';

  // Só processar STORY-*.md
  if (!filePath.match(/STORY-\d+.*\.md$/i)) return;

  const content = (data.tool_input || {}).content || '';
  const story   = extractStoryNumber(filePath);
  const status  = extractField(content, 'Status');
  const agent   = extractField(content, 'Agente');

  if (!story || !status) return;

  appendMetric({
    ts:     new Date().toISOString(),
    event:  'story_update',
    story,
    status,
    agent:  agent || 'unknown',
    file:   path.basename(filePath),
  });
}

main().catch(() => process.exit(0)); // Falha silenciosa
