#!/usr/bin/env python3
"""
GEN.IA OS — Hook: sql-governance
Trigger: PreToolUse (Bash)
Ação: Bloqueia DDL SQL perigoso executado diretamente.
Permite operações via supabase CLI, pg_dump e psql -f (migrations controladas).
"""
import json
import sys
import re


DANGEROUS_PATTERNS = [
    r"\bDROP\s+TABLE\b",
    r"\bDROP\s+DATABASE\b",
    r"\bDROP\s+SCHEMA\b",
    r"\bTRUNCATE\s+TABLE\b",
    r"\bTRUNCATE\b\s+\w+",
    r"\bALTER\s+TABLE\b.*\bDROP\s+COLUMN\b",
    r"DELETE\s+FROM\s+\w+\s*;?\s*$",  # DELETE sem WHERE
]

SAFE_PATTERNS = [
    r"supabase\s+(migration|db\s+push|db\s+diff)",
    r"pg_dump\b",
    r"psql\s+.*-f\s+",
    r"\.sql\s*$",  # executar arquivo .sql explícito
]


def main():
    try:
        raw = sys.stdin.read()
        data = json.loads(raw)
    except Exception:
        sys.exit(0)

    tool = data.get("tool_name", "")
    if tool != "Bash":
        sys.exit(0)

    command = data.get("tool_input", {}).get("command", "")

    # Verificar se é operação segura de migration
    for safe in SAFE_PATTERNS:
        if re.search(safe, command, re.IGNORECASE):
            sys.exit(0)

    # Verificar padrões perigosos
    cmd_upper = command.upper()
    for pattern in DANGEROUS_PATTERNS:
        if re.search(pattern, cmd_upper):
            print(
                "[GEN.IA OS] 🚫 BLOQUEADO — SQL destrutivo detectado.\n"
                "[GEN.IA OS] Use 'supabase migration new <nome>' para alterações de schema.\n"
                "[GEN.IA OS] Migrations controladas garantem rollback seguro.",
                file=sys.stderr,
            )
            sys.exit(2)

    sys.exit(0)


if __name__ == "__main__":
    main()
