#!/usr/bin/env node
'use strict';

/**
 * create-genia-os v2.0.0
 * Instala o GEN.IA OS diretamente do repositório oficial.
 * Cross-platform: Windows, macOS, Linux.
 * Uso: npx create-genia-os [pasta-destino]
 */

const { execSync } = require('child_process');
const path = require('path');
const os = require('os');
const fse = require('fs-extra');

// ─── Cores no terminal ───────────────────────────────────────────────────────
const c = {
  reset:   '\x1b[0m',
  bold:    '\x1b[1m',
  cyan:    '\x1b[36m',
  green:   '\x1b[32m',
  yellow:  '\x1b[33m',
  red:     '\x1b[31m',
  gray:    '\x1b[90m',
};

const ok   = (msg) => console.log(`${c.green}✅ ${msg}${c.reset}`);
const info = (msg) => console.log(`${c.cyan}   ${msg}${c.reset}`);
const fail = (msg) => { console.error(`${c.red}❌ ${msg}${c.reset}`); process.exit(1); };
const warn = (msg) => console.log(`${c.yellow}⚠  ${msg}${c.reset}`);

// ─── Banner ──────────────────────────────────────────────────────────────────
function banner() {
  console.log('');
  console.log(`${c.cyan}${c.bold}╔════════════════════════════════════════════╗${c.reset}`);
  console.log(`${c.cyan}${c.bold}║     GEN.IA OS v2.0 — Instalador Oficial    ║${c.reset}`);
  console.log(`${c.cyan}${c.bold}║  9 agentes • Synapse Engine • Governança    ║${c.reset}`);
  console.log(`${c.cyan}${c.bold}╚════════════════════════════════════════════╝${c.reset}`);
  console.log('');
}

// ─── Verificar git disponível ────────────────────────────────────────────────
function checkGit() {
  try {
    execSync('git --version', { stdio: 'ignore' });
  } catch {
    fail('git não encontrado. Instale o Git e tente novamente: https://git-scm.com');
  }
}

// ─── Clonar repositório ──────────────────────────────────────────────────────
function cloneRepo(repo, tempDir) {
  info(`Clonando ${repo}...`);
  if (fse.existsSync(tempDir)) {
    fse.removeSync(tempDir);
  }
  try {
    execSync(`git clone --depth=1 ${repo} "${tempDir}"`, { stdio: 'inherit' });
  } catch {
    fail(`Falha ao clonar ${repo}. Verifique sua conexão e se o repositório é público.`);
  }
}

// ─── Copiar pastas do GEN.IA OS ──────────────────────────────────────────────
function copyFolders(tempDir, destDir) {
  const folders = ['.claude', '.genia', '.synapse', '.business'];
  let copied = 0;

  for (const folder of folders) {
    const src = path.join(tempDir, folder);
    const dst = path.join(destDir, folder);

    if (fse.existsSync(src)) {
      fse.copySync(src, dst, { overwrite: true });
      ok(`${folder} instalado`);
      copied++;
    } else {
      warn(`${folder} não encontrado no repositório — ignorando`);
    }
  }

  if (copied === 0) {
    fail('Nenhuma pasta do GEN.IA OS encontrada. Repositório pode estar incorreto.');
  }
}

// ─── Verificar instalação ────────────────────────────────────────────────────
function verify(destDir) {
  const claudeMd = path.join(destDir, '.claude', 'CLAUDE.md');

  if (!fse.existsSync(claudeMd)) {
    fail('Instalação falhou: .claude/CLAUDE.md não encontrado.');
  }

  const content = fse.readFileSync(claudeMd, 'utf-8');
  const agentes = ['Cypher', 'Morpheus', 'Trinity', 'Neo', 'Tank', 'Oracle', 'Mouse', 'Smith', 'Switch'];
  const found   = agentes.filter((a) => content.includes(a));

  if (found.length === agentes.length) {
    ok('GEN.IA OS v2.0 instalado com sucesso!');
    ok('Agentes verificados: ' + found.join(', '));
  } else {
    const missing = agentes.filter((a) => !content.includes(a));
    fail(`Agentes ausentes no CLAUDE.md: ${missing.join(', ')}. Reinstale.`);
  }
}

// ─── Resumo final ────────────────────────────────────────────────────────────
function summary(destDir) {
  console.log('');
  console.log(`${c.green}${c.bold}╔════════════════════════════════════════════╗${c.reset}`);
  console.log(`${c.green}${c.bold}║         GEN.IA OS pronto para uso! 🚀      ║${c.reset}`);
  console.log(`${c.green}${c.bold}╚════════════════════════════════════════════╝${c.reset}`);
  console.log('');
  console.log(`${c.bold}Próximos passos:${c.reset}`);
  console.log('');
  console.log(`  ${c.cyan}1.${c.reset} Abra a pasta no VS Code com Claude Code:`);
  console.log(`     ${c.gray}code "${destDir}"${c.reset}`);
  console.log('');
  console.log(`  ${c.cyan}2.${c.reset} Preencha o contexto de negócio:`);
  console.log(`     ${c.gray}Edite .business/OWNER.md com suas informações${c.reset}`);
  console.log('');
  console.log(`  ${c.cyan}3.${c.reset} Inicie uma conversa e chame um agente:`);
  console.log(`     ${c.gray}"@sm crie a primeira story do projeto"${c.reset}`);
  console.log('');
  console.log(`${c.yellow}${c.bold}NOTA:${c.reset} Copie o .business/ do seu GENIA-SQUAD-OS para`);
  console.log(`este projeto para que os agentes conheçam o contexto`);
  console.log('de negócio (OWNER.md, PRIORIDADES.md, etc.).');
  console.log('');
  console.log(`${c.gray}Documentação: https://github.com/elidyizzy/GENIA-SQUAD-OS${c.reset}`);
  console.log('');
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  banner();

  const REPO = 'https://github.com/elidyizzy/GENIA-SQUAD-OS';
  const TEMP = path.join(os.tmpdir(), `genia-os-tmp-${Date.now()}`);

  const targetArg = process.argv[2] || '.';
  const dest = targetArg === '.' ? process.cwd() : path.resolve(process.cwd(), targetArg);

  // Criar destino se necessário
  if (targetArg !== '.') {
    fse.mkdirpSync(dest);
    info(`Instalando em: ${dest}`);
  } else {
    info(`Instalando no diretório atual: ${dest}`);
  }

  console.log('');
  console.log(`🚀 GEN.IA OS v2.0 — instalando do repositório oficial...`);
  console.log('');

  checkGit();
  cloneRepo(REPO, TEMP);

  console.log('');
  info('Copiando estrutura do GEN.IA OS...');
  console.log('');

  copyFolders(TEMP, dest);

  // Limpar temp
  try {
    fse.removeSync(TEMP);
  } catch {
    warn(`Não foi possível remover pasta temporária: ${TEMP}`);
  }

  console.log('');
  info('Verificando integridade da instalação...');
  verify(dest);
  summary(dest);
}

main().catch((e) => {
  console.error(`\n${c.red}Erro inesperado:${c.reset}`, e.message);
  process.exit(1);
});
