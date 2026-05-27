# AGENTS.md

## Cursor Cloud specific instructions

This repository contains two projects:

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

**Lint**: `cd wealthiq/frontend && npx eslint "src/**/*.jsx"`

**Key notes**:
- The Finnhub API key (`FINNHUB_API_KEY` env var) may be invalid; backend auto-falls back to mock data.
- Backend health: `curl http://localhost:8000/health` returns `{"status":"ok","mode":"mock"|"live"}`
- No database or external services needed — all data comes from Finnhub API or built-in mock data.
- Python 3.11+ and Node.js 18+ required.
