#!/usr/bin/env python3
"""
GEN.IA OS — Hook: enforce-git-push-authority
Trigger: PreToolUse (Bash)
Ação: Bloqueia git push por agentes não-devops.
      Permite push quando @devops está autorizado via flag file.
Artigo II da Constituição GEN.IA OS — NÃO-NEGOCIÁVEL.

Protocolo de autorização:
  1. Claude pergunta à usuária se quer invocar @devops
  2. Se sim, @devops cria .genia/session/devops-active
  3. Este hook lê o flag e permite o push (uma única vez)
  4. Flag é removido automaticamente após uso
"""
import json
import os
import sys
import re


PUSH_PATTERNS = [
    r"\bgit\s+push\b",
    r"\bgit\s+push\s+--force\b",
    r"\bgit\s+push\s+-f\b",
    r"\bgit\s+push\s+-u\b",
]

FLAG_FILE = ".genia/session/devops-active"


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
            # Verificar se @devops foi autorizado via flag file
            if os.path.exists(FLAG_FILE):
                try:
                    os.remove(FLAG_FILE)  # Consumir o flag (uso único)
                except Exception:
                    pass
                print(
                    "[GEN.IA OS] ✅ @devops (Gate) autorizado — executando push.",
                    file=sys.stderr,
                )
                sys.exit(0)  # Permitir

            # Sem autorização — bloquear
            print(
                "[GEN.IA OS] 🚫 BLOQUEADO — Artigo II: Apenas @devops pode executar git push.\n"
                "[GEN.IA OS] Diga: '@devops faça o push' para invocar Gate.",
                file=sys.stderr,
            )
            sys.exit(2)  # exit 2 = BLOCK no Claude Code

    sys.exit(0)


if __name__ == "__main__":
    main()
