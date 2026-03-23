#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"

if [[ -z "${ANTHROPIC_API_KEY:-}" ]]; then
  echo "??  ANTHROPIC_API_KEY não definido. Configure antes de chamar a API real." >&2
fi

echo "[backend] Instalando dependências e fontes..."
python3 -m venv "$ROOT/backend/venv"
source "$ROOT/backend/venv/bin/activate"
pip install --upgrade pip
pip install -r "$ROOT/backend/requirements.txt"
python "$ROOT/backend/app/download_fonts.py"
deactivate

echo "[frontend] Instalando dependências..."
cd "$ROOT/frontend"
npm install

cd "$ROOT"
echo "[dev] Iniciando FastAPI e Vite em paralelo..."
npx concurrently -k -s first -n API,WEB "cd backend && source venv/bin/activate && uvicorn app.main:app --host 0.0.0.0 --port 8000" "cd frontend && npm run dev -- --host 0.0.0.0 --port 5173"

