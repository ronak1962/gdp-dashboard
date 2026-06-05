# AGENTS.md

## Cursor Cloud specific instructions

This repository contains two projects:

### PATH for Python CLI tools

`pip install --user` puts `streamlit`, `uvicorn`, and other scripts in `~/.local/bin`. Ensure that directory is on `PATH` before running Python apps:

```bash
export PATH="$HOME/.local/bin:$PATH"
```

### 1. Streamlit GDP Dashboard (root)

Simple single-service app. Run with:
```bash
pip install -r requirements.txt
streamlit run streamlit_app.py --server.headless true --server.port 8501
```
Health check: `curl http://localhost:8501/_stcore/health` → `ok`

### 2. WealthIQ Stock Peer Analysis (`wealthiq/`)

Full-stack app (FastAPI + React). See `wealthiq/README.md` for full details.

**Backend** (port 8000):
```bash
cd wealthiq/backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend** (port 3000):
```bash
cd wealthiq/frontend
npm install
npm run dev
```

**Lint**: `cd wealthiq/frontend && npx eslint "src/**/*.jsx"` (`npm run lint` targets `src/` and does not match `.jsx` files in this repo.)

**Build (frontend)**: `cd wealthiq/frontend && npm run build`

**Key notes**:
- Set `FINNHUB_API_KEY` for live market data on analyze/advisor/terminal endpoints. Without it, `/health` still returns `{"status":"ok","api_key_set":false}` and local endpoints work: `/templates`, `/screeners`, `/portfolio` (static/mock portfolio data).
- Backend health: `curl http://localhost:8000/health`
- Frontend talks directly to `http://localhost:8000` (no Vite proxy); start backend before exercising the UI.
- No database or Docker required.
- Python 3.11+ and Node.js 18+ required.
- No automated test suite in the repo; verify with lint, build, health checks, and manual UI smoke tests.
