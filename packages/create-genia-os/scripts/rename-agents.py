#!/usr/bin/env python3
"""
rename-agents.py — Renomeia os agentes do GEN.IA OS para personagens do Matrix.
Uso: python packages/create-genia-os/scripts/rename-agents.py
     (rodar da raiz do GENIA - SQUAD - OS)
"""

import os
import re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))

# Substituições com word boundary para evitar falsos positivos
# Formato: (padrão_regex, substituto)
REPLACEMENTS = [
    # Nomes de agentes — somente palavra inteira
    (r'\bAna\b',    'Cypher'),
    (r'\bMarina\b', 'Morpheus'),
    (r'\bArqui\b',  'Trinity'),   # Não pega "Arquiteta" ou "Arquitetura"
    (r'\bDev\b(?!\s*elop|\s*Ops|\s*OPS|eloper|elopment|s\b)', 'Neo'),
    (r'\bGate\b',   'Tank'),
    (r'\bQuinn\b',  'Smith'),
    (r'\bRev\b(?!iew|iewer|ised|ision|ert)', 'Switch'),
    (r'\bPax\b',    'Oracle'),
    (r'\bSami\b',   'Mouse'),
]


def replace_in_file(filepath):
    """Aplica as substituições em um arquivo."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            original = f.read()
    except Exception as e:
        print(f'  [SKIP] {filepath}: {e}')
        return False

    content = original
    for pattern, replacement in REPLACEMENTS:
        content = re.sub(pattern, replacement, content)

    if content != original:
        rel = os.path.relpath(filepath, ROOT)
        with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
            f.write(content)
        print(f'  [OK]    {rel}')
        return True
    return False


def find_files(base_dirs):
    """Encontra todos os arquivos nas pastas especificadas."""
    files = []
    for base in base_dirs:
        full_base = os.path.join(ROOT, base)
        if not os.path.exists(full_base):
            continue
        if os.path.isfile(full_base):
            files.append(full_base)
            continue
        for dirpath, _, filenames in os.walk(full_base):
            for fname in filenames:
                if not any(fname.endswith(e) for e in ['.png', '.jpg', '.zip', '.tgz']):
                    files.append(os.path.join(dirpath, fname))
    return files


def main():
    print('\n[RENAME] Agentes -> Personagens do Matrix\n')

    targets = find_files([
        '.genia/development/agents',
        '.genia/CONSTITUTION.md',
        '.genia/core-config.yaml',
        '.claude/CLAUDE.md',
        '.claude/agent-memory',
        '.synapse',
        'README.md',
    ])

    changed = 0
    for filepath in sorted(targets):
        if replace_in_file(filepath):
            changed += 1

    print(f'\n[OK] {changed} arquivo(s) alterado(s).\n')


if __name__ == '__main__':
    main()
