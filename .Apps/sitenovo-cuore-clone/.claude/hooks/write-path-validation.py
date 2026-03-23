#!/usr/bin/env python3
"""
GEN.IA OS — Hook: write-path-validation
Trigger: PreToolUse (Write)
Ação: Avisa quando documentos são criados fora do path padrão.
"""
import json
import sys
import re
import os


# Padrões de arquivo → path recomendado
DOC_RULES = {
    r"^PRD\.md$": "docs/[projeto]/PRD.md",
    r"^SPEC-TECNICO\.md$": "docs/[projeto]/SPEC-TECNICO.md",
    r"^COMERCIAL\.md$": "docs/[projeto]/COMERCIAL.md",
    r"^BRIEFING\.md$": "docs/[projeto]/BRIEFING.md",
    r"^STORY-\d+.*\.md$": "docs/stories/STORY-NNN-slug.md",
    r"^ADR-\d+.*\.md$": "docs/[projeto]/adrs/ADR-NNN-titulo.md",
}


def main():
    try:
        raw = sys.stdin.read()
        data = json.loads(raw)
    except Exception:
        sys.exit(0)

    tool = data.get("tool_name", "")
    if tool != "Write":
        sys.exit(0)

    file_path = data.get("tool_input", {}).get("file_path", "")
    if not file_path:
        sys.exit(0)

    # Normalizar separadores
    normalized = file_path.replace("\\", "/")
    filename = os.path.basename(normalized)

    for pattern, correct_path in DOC_RULES.items():
        if re.match(pattern, filename, re.IGNORECASE):
            # Verificar se está no path correto
            if "docs/" not in normalized:
                print(
                    f"[GEN.IA OS] ⚠️  Documento '{filename}' fora do path padrão.\n"
                    f"[GEN.IA OS] Path recomendado: {correct_path}\n"
                    f"[GEN.IA OS] Criando assim mesmo — ajuste se necessário.",
                    file=sys.stderr,
                )
            break

    sys.exit(0)  # Apenas avisa, não bloqueia


if __name__ == "__main__":
    main()
