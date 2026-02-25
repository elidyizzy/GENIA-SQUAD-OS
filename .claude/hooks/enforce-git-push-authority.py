#!/usr/bin/env python3
"""
GEN.IA OS — Hook: enforce-git-push-authority
Trigger: PreToolUse (Bash)
Ação: Bloqueia git push por agentes não-devops.
Artigo II da Constituição GEN.IA OS — NÃO-NEGOCIÁVEL.
"""
import json
import sys
import re


PUSH_PATTERNS = [
    r"\bgit\s+push\b",
    r"\bgit\s+push\s+--force\b",
    r"\bgit\s+push\s+-f\b",
    r"\bgit\s+push\s+-u\b",
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

    for pattern in PUSH_PATTERNS:
        if re.search(pattern, command, re.IGNORECASE):
            print(
                "[GEN.IA OS] 🚫 BLOQUEADO — Artigo II: Apenas @devops pode executar git push.\n"
                "[GEN.IA OS] Delegue para Gate: '@devops por favor faça push desta branch e crie o PR.'",
                file=sys.stderr,
            )
            sys.exit(2)  # exit 2 = BLOCK no Claude Code

    sys.exit(0)


if __name__ == "__main__":
    main()
