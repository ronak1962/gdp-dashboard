# Patel Analysis – Portfolio & Wealth Advisory Terminal

A real-time stock analysis and portfolio advisory platform built for **wealth managers, portfolio analysts, and financial advisors** to help their clients make informed investment decisions based on risk tolerance, return targets, and diversification needs.

## What It Does

Patel Analysis helps advisors answer client questions like:
- *"I want to invest in top 5 tech and top 5 healthcare companies"* → Instant screener results
- *"Show me the highest dividend-paying companies in US and Canada"* → Sorted by yield
- *"I want low risk with 10% annual return"* → Filtered ETFs and stocks matching criteria
- *"Should I buy NVDA right now?"* → AI-powered buy/sell/hold with confidence score
- *"Help me build a diversified portfolio"* → Pre-built templates with allocation breakdown

## Key Features

| Feature | Purpose |
|---------|---------|
| **Bloomberg Terminal** | Sector/global stock screener for quick client queries |
| **Stock Analysis** | TradingView-style deep analysis (stats, technicals, performance) |
| **AI Advisor** | Buy/sell/hold recommendations matched to client risk profile |
| **Discover** | Pre-built portfolio templates + screeners for diversification |

## Who It's For

- **Wealth Managers** — quickly find the best stocks for client portfolios
- **Financial Advisors** — determine risk-appropriate investments per client
- **Portfolio Analysts** — compare sectors, peers, and diversify holdings
- **Retail Brokers** — serve clients with data-driven recommendations

## How It Helps Clients

1. **Risk Assessment** — Every stock gets a 0-100 risk score (beta + drawdown + P/E)
2. **Profile Matching** — Conservative / Moderate / Aggressive client profiles
3. **Return Targeting** — Filter for specific return thresholds (e.g. "10% with low risk")
4. **Diversification** — Portfolio templates across sectors, geographies, and asset classes
5. **Entry/Exit Signals** — AI-powered price targets, stop-loss, and risk:reward ratios

## Quick Start

### Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
export FINNHUB_API_KEY=<your-finnhub-key>
uvicorn main:app --reload --port 8000
```

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:3000** in your browser.

### Access on Phone

```bash
npm run dev -- --host
```
Then open `http://<your-mac-ip>:3000` on your phone (same WiFi).

## Tech Stack

- **Backend**: Python, FastAPI, Finnhub API (real-time market data)
- **Frontend**: React 18, Vite, Tailwind CSS
- **AI Engine**: Multi-signal scoring (momentum, valuation, range position, beta, dividend yield)
- **Data**: Live from Finnhub covering all US exchanges + global ADRs

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /analyze/{ticker}` | Full stock analysis with risk score |
| `GET /quote/{ticker}` | Lightweight price/change quote for chart direction |
| `GET /advisor/{ticker}?profile=moderate` | AI buy/sell/hold recommendation |
| `GET /terminal/query?q=top 5 tech` | Natural language screener |
| `GET /templates` | Portfolio templates for diversification |
| `GET /screeners` | Available screener categories |
