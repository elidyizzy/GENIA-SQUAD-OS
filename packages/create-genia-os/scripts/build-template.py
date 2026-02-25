#!/usr/bin/env python3
"""
build-template.py — Gera os template files do create-genia-os.
Copia .claude/, .genia/, .synapse/ para template/ e substitui
referências Be Data por {{VARIÁVEIS}}.

Uso: python packages/create-genia-os/scripts/build-template.py
     (rodar da raiz do GENIA - SQUAD - OS)
"""

import os
import shutil
import re

# ─── Config ─────────────────────────────────────────────────────────────────

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
TEMPLATE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'template'))

# Pastas a copiar da raiz do projeto
SOURCE_DIRS = ['.claude', '.genia', '.synapse']

# Arquivos e pastas a EXCLUIR do template
EXCLUDE = {
    # Conteúdo específico Be Data
    '.genia/contexts/kommo-crm.md',
    '.genia/session',
    '.genia/session-digests',
    '.genia/README.md',
    # Memória da sessão atual
    '.claude/agent-memory',   # será recriado genérico
    # Settings local (deve ser gerado pelo usuário)
    '.claude/settings.local.json',
}

# Substituições: (padrão regex, substituto)
REPLACEMENTS = [
    # Marca/empresa
    (r'Be Data', '{{TEAM_NAME}}'),
    # Nomes pessoais
    (r'Elidy Izidio', '{{CREATOR_NAME}}'),
    (r'elidyizidio@gmail\.com', '{{CREATOR_EMAIL}}'),
    (r'elidyizzy', '{{GITHUB_USER}}'),
    (r'GENIA-SQUAD-OS', '{{GITHUB_REPO}}'),
    # Contextos específicos (lista de contextos)
    (r'kommo-crm, supabase, whatsapp-cloud, nextjs-react, api-patterns',
     '{{CONTEXTS}}'),
    (r'    - kommo-crm\n', ''),
    # Projetos específicos da Elidy no CLAUDE.md
    (r'\n---\n\n## Projetos Ativos.*?(?=\n---\n|\Z)', '', re.DOTALL),
    # Rodapé genérico
    (r'GEN\.IA OS v1\.0 — Be Data — Elidy Izidio',
     'GEN.IA OS v1.0 — {{TEAM_NAME}} — {{CREATOR_NAME}}'),
    (r'Ratificada: 2026-02-24', 'Ratificada: {{SETUP_DATE}}'),
    (r'Última atualização: 2026-02-24', 'Última atualização: {{SETUP_DATE}}'),
]

# ─── Agent memory template genérico ─────────────────────────────────────────

AGENT_MEMORY_TEMPLATE = """# MEMORY — @{agent} ({name})
> {role} — {{PROJECT_NAME}}
> Última atualização: {{SETUP_DATE}}

## Padrões Confirmados

_Nenhum ainda._

## Preferências da Usuária

- Idioma: {{LANGUAGE}}
- Projeto: {{PROJECT_NAME}}

## Regra Crítica

{rule}

## Gotchas

_Nenhum ainda._
"""

AGENTS = {
    'analyst':  ('Ana',   'Analista de Negócios', 'Apenas briefings e requisitos. Zero código.'),
    'pm':       ('Marina','Product Manager',       'PRD aprovado por @po antes de qualquer story.'),
    'architect':('Arqui', 'Arquiteta de Sistemas', 'VETO técnico absoluto. Nenhuma decisão de arquitetura sem aprovação.'),
    'dev':      ('Dev',   'Desenvolvedor Full Stack','Implementa APENAS stories aprovadas por @po. NUNCA faz git push.'),
    'devops':   ('Gate',  'DevOps Engineer',        'Único agente com autoridade para git push, PR e releases.'),
    'qa':       ('Quinn', 'QA Engineer',            'Veredicto de qualidade é final. Aprovação obrigatória antes de @reviewer.'),
    'reviewer': ('Rev',   'Code Reviewer',          'LGTM ou CHANGES REQUESTED. Sem meio-termo.'),
    'po':       ('Pax',   'Product Owner',          'Story com menos de 8/10 pontos no checklist = REJEITADA.'),
    'sm':       ('Sami',  'Scrum Master',           'Único agente que cria STORY-*.md. Toda story vai para @po antes de @dev.'),
}

# ─── Helpers ─────────────────────────────────────────────────────────────────

def should_exclude(rel_path):
    """Verifica se o arquivo/pasta deve ser excluído."""
    normalized = rel_path.replace('\\', '/')
    for excl in EXCLUDE:
        if normalized == excl or normalized.startswith(excl + '/'):
            return True
    return False


def apply_replacements(content):
    """Aplica todas as substituições de texto."""
    for pattern_args in REPLACEMENTS:
        if len(pattern_args) == 3:
            pattern, replacement, flags = pattern_args
            content = re.sub(pattern, replacement, content, flags=flags)
        else:
            pattern, replacement = pattern_args
            content = re.sub(pattern, replacement, content)
    return content


def copy_with_replacements(src_root, src_subdir, dest_root):
    """Copia um subdiretório com substituições aplicadas."""
    src = os.path.join(src_root, src_subdir)
    if not os.path.exists(src):
        print(f'  [SKIP] {src_subdir} não encontrado')
        return

    for dirpath, dirnames, filenames in os.walk(src):
        # Calcular path relativo
        rel_dir = os.path.relpath(dirpath, src_root)

        # Filtrar dirnames para evitar recursão em pastas excluídas
        dirnames[:] = [
            d for d in dirnames
            if not should_exclude(os.path.join(rel_dir, d).replace('\\', '/'))
        ]

        for filename in filenames:
            rel_file = os.path.join(rel_dir, filename).replace('\\', '/')

            if should_exclude(rel_file):
                print(f'  [EXCL] {rel_file}')
                continue

            src_file = os.path.join(dirpath, filename)
            dest_file = os.path.join(dest_root, rel_dir, filename)

            os.makedirs(os.path.dirname(dest_file), exist_ok=True)

            try:
                with open(src_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                content = apply_replacements(content)
                with open(dest_file, 'w', encoding='utf-8', newline='\n') as f:
                    f.write(content)
                print(f'  [OK]   {rel_file}')
            except UnicodeDecodeError:
                # Arquivo binário — copiar sem modificação
                shutil.copy2(src_file, dest_file)
                print(f'  [BIN]  {rel_file}')


def create_agent_memories(dest_root):
    """Cria os 9 MEMORY.md genéricos para cada agente."""
    base = os.path.join(dest_root, '.claude', 'agent-memory')
    for agent_key, (name, role, rule) in AGENTS.items():
        agent_dir = os.path.join(base, agent_key)
        os.makedirs(agent_dir, exist_ok=True)
        content = AGENT_MEMORY_TEMPLATE.format(
            agent=agent_key, name=name, role=role, rule=rule
        )
        mem_file = os.path.join(agent_dir, 'MEMORY.md')
        with open(mem_file, 'w', encoding='utf-8', newline='\n') as f:
            f.write(content)
        print(f'  [OK]   .claude/agent-memory/{agent_key}/MEMORY.md')


def create_settings_local(dest_root):
    """Cria settings.local.json genérico."""
    content = """{
  "permissions": {
    "allow": [
      "Bash(node --version)",
      "Bash(npm --version)",
      "Bash(git*)",
      "Bash(pip --version)",
      "Bash(python*)",
      "Bash(gh*)",
      "Bash(node \\\".claude/hooks/synapse-engine.cjs\\\")",
      "Bash(node \\\".claude/hooks/precompact-session-digest.cjs\\\")"
    ]
  }
}
"""
    dest = os.path.join(dest_root, '.claude', 'settings.local.json')
    with open(dest, 'w', encoding='utf-8', newline='\n') as f:
        f.write(content)
    print('  [OK]   .claude/settings.local.json')


def create_generic_context(dest_root):
    """Cria um contexto genérico de exemplo."""
    ctx_dir = os.path.join(dest_root, '.genia', 'contexts')
    os.makedirs(ctx_dir, exist_ok=True)
    content = """# Contexto: {{PROJECT_NAME}}

> Carregue com: `@load-context {{PROJECT_NAME}}`

## Sobre o Projeto

- **Nome**: {{PROJECT_NAME}}
- **Equipe**: {{TEAM_NAME}}
- **Stack**: {{STACK}}

## Recursos Principais

_Adicione aqui as informações de contexto do seu projeto:_
_APIs, autenticação, endpoints, banco de dados, etc._

## Links Úteis

- GitHub: https://github.com/{{GITHUB_USER}}/{{GITHUB_REPO}}
"""
    ctx_file = os.path.join(ctx_dir, 'projeto.md')
    with open(ctx_file, 'w', encoding='utf-8', newline='\n') as f:
        f.write(content)
    print('  [OK]   .genia/contexts/projeto.md')


def create_gitignore(dest_root):
    """Cria .gitignore genérico."""
    content = """.env
.env.local
.env.*.local
node_modules/
__pycache__/
*.pyc
.DS_Store
Thumbs.db
.genia/session/devops-active
"""
    with open(os.path.join(dest_root, '.gitignore'), 'w', encoding='utf-8', newline='\n') as f:
        f.write(content)
    print('  [OK]   .gitignore')


def create_readme(dest_root):
    """Cria README.md genérico para o template."""
    content = """# {{PROJECT_NAME}}

> Powered by **GEN.IA OS** — Sistema operacional de desenvolvimento com IA

## Setup

Este projeto usa o [GEN.IA OS](https://github.com/elidyizzy/GENIA-SQUAD-OS) com Claude Code.

### Pré-requisitos

- [Claude Code](https://claude.ai/code) instalado
- Node.js 18+
- Python 3.10+
- Git

### Como usar

Abra o projeto no VS Code com Claude Code e chame um agente:

```
@sm crie a primeira story do projeto
@analyst faça um briefing sobre [funcionalidade]
@dev implemente a STORY-001
```

## Agentes disponíveis

| Agente | Nome | Papel |
|--------|------|-------|
| `@analyst` | Ana | Analista de Negócios |
| `@pm` | Marina | Product Manager |
| `@architect` | Arqui | Arquiteta de Sistemas |
| `@dev` | Dev | Desenvolvedor Full Stack |
| `@devops` | Gate | DevOps Engineer |
| `@qa` | Quinn | QA Engineer |
| `@reviewer` | Rev | Code Reviewer |
| `@po` | Pax | Product Owner |
| `@sm` | Sami | Scrum Master |

## Estrutura

```
{{PROJECT_NAME}}/
├── .claude/          ← Integração Claude Code
├── .genia/           ← Framework core
├── .synapse/         ← Runtime do Synapse Engine
├── docs/stories/     ← Stories do projeto
└── src/              ← Código-fonte
```

---

_Gerado com [create-genia-os](https://github.com/elidyizzy/GENIA-SQUAD-OS) — {{SETUP_DATE}}_
"""
    with open(os.path.join(dest_root, 'README.md'), 'w', encoding='utf-8', newline='\n') as f:
        f.write(content)
    print('  [OK]   README.md')


# ─── Entry point ────────────────────────────────────────────────────────────

def main():
    print(f'\n[BUILD] Gerando template em: {TEMPLATE_DIR}\n')

    # Limpar template anterior
    if os.path.exists(TEMPLATE_DIR):
        shutil.rmtree(TEMPLATE_DIR)
    os.makedirs(TEMPLATE_DIR)

    # Copiar e genericizar os diretórios principais
    for src_dir in SOURCE_DIRS:
        print(f'\n[DIR] {src_dir}/')
        copy_with_replacements(ROOT, src_dir, TEMPLATE_DIR)

    # Criar agent-memories genéricos
    print('\n[DIR] .claude/agent-memory/ (generico)')
    create_agent_memories(TEMPLATE_DIR)

    # Criar settings.local.json genérico
    print('\n[FILE] .claude/settings.local.json')
    create_settings_local(TEMPLATE_DIR)

    # Criar contexto genérico de exemplo
    print('\n[FILE] .genia/contexts/projeto.md')
    create_generic_context(TEMPLATE_DIR)

    # Criar .gitignore
    print('\n[FILE] .gitignore')
    create_gitignore(TEMPLATE_DIR)

    # Criar README.md do template
    print('\n[FILE] README.md')
    create_readme(TEMPLATE_DIR)

    print(f'\n[OK] Template gerado com sucesso!')
    print(f'     Arquivos em: {TEMPLATE_DIR}\n')


if __name__ == '__main__':
    main()
