# WealthIQ – Stock Peer Analysis

Real-time stock analysis platform that helps retail investors evaluate stocks by risk profile, compare with peers, and manage a 60/40 portfolio with drift-based rebalancing signals.

## Features

- **Stock Analysis**: Live price, market cap, P/E, beta from Finnhub API
- **Risk Scoring**: Proprietary 0–100 score based on beta, 52-week drawdown, and P/E
- **Peer Comparison**: Side-by-side view of peer stocks with relative metrics
- **Appetite Profiles**: Conservative / Moderate / Aggressive match indicators
- **Portfolio Rebalancing**: 60/40 allocation tracker with buy/sell signals

## Quick Start

### Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API available at http://localhost:8000

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

App available at http://localhost:3000

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /analyze/{ticker}` | Full stock analysis with risk score |
| `GET /peers/{ticker}` | Live quotes for peer tickers |
| `GET /portfolio` | Portfolio allocation with drift/signals |

## Tech Stack

- **Backend**: Python, FastAPI, httpx, Finnhub API
- **Frontend**: React 18, Vite, Tailwind CSS
- **Data**: Real-time from Finnhub (free tier)

## Color Scheme

| Color | Hex | Usage |
|-------|-----|-------|
| Navy | `#0D4F8B` | Primary, headers, accents |
| Teal | `#1AB87A` | Positive, low risk |
| Amber | `#E0A020` | Warning, medium risk |
| Red | `#C0392B` | Negative, high risk |
