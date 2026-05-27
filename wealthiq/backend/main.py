import os
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="WealthIQ Stock Peer Analysis")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FINNHUB_KEY = os.getenv("FINNHUB_API_KEY", "d8b0cepr01qk20sp4lbgd8b0cepr01qk20sp4lc0")
BASE = "https://finnhub.io/api/v1"

# Fallback mock data for when API key is invalid or rate-limited
MOCK_DATA = {
    "AAPL": {"c": 198.11, "dp": 1.23, "h": 199.62, "l": 196.00, "name": "Apple Inc", "mc": 3080, "pe": 32.5, "beta": 1.24, "high52": 237.49, "low52": 164.08},
    "MSFT": {"c": 430.16, "dp": 0.87, "h": 432.00, "l": 427.50, "name": "Microsoft Corp", "mc": 3200, "pe": 36.2, "beta": 0.89, "high52": 468.35, "low52": 362.90},
    "NVDA": {"c": 131.29, "dp": 2.45, "h": 133.50, "l": 128.80, "name": "NVIDIA Corp", "mc": 3230, "pe": 64.8, "beta": 1.68, "high52": 153.13, "low52": 75.61},
    "TSLA": {"c": 177.58, "dp": -1.82, "h": 181.20, "l": 175.40, "name": "Tesla Inc", "mc": 567, "pe": 68.3, "beta": 2.05, "high52": 278.98, "low52": 138.80},
    "AMZN": {"c": 186.49, "dp": 0.56, "h": 187.90, "l": 185.10, "name": "Amazon.com Inc", "mc": 1950, "pe": 58.7, "beta": 1.15, "high52": 201.20, "low52": 151.61},
    "GOOGL": {"c": 174.89, "dp": -0.34, "h": 176.20, "l": 173.50, "name": "Alphabet Inc", "mc": 2160, "pe": 25.8, "beta": 1.05, "high52": 191.75, "low52": 150.22},
    "META": {"c": 505.68, "dp": 1.67, "h": 509.00, "l": 501.20, "name": "Meta Platforms Inc", "mc": 1290, "pe": 26.3, "beta": 1.22, "high52": 542.81, "low52": 390.42},
    "JPM": {"c": 205.32, "dp": 0.42, "h": 206.80, "l": 204.00, "name": "JPMorgan Chase & Co", "mc": 590, "pe": 11.8, "beta": 1.08, "high52": 222.85, "low52": 172.08},
    "VTI": {"c": 282.45, "dp": 0.65, "h": 283.50, "l": 281.00, "name": "Vanguard Total Stock Market ETF", "mc": 400, "pe": 22.0, "beta": 1.0, "high52": 295.00, "low52": 242.00},
    "VXUS": {"c": 61.82, "dp": 0.38, "h": 62.10, "l": 61.50, "name": "Vanguard Total Intl Stock ETF", "mc": 75, "pe": 15.5, "beta": 0.85, "high52": 64.50, "low52": 52.80},
    "BND": {"c": 72.15, "dp": -0.05, "h": 72.30, "l": 72.00, "name": "Vanguard Total Bond Market ETF", "mc": 110, "pe": None, "beta": 0.05, "high52": 73.80, "low52": 69.20},
}

MOCK_PEERS = {
    "AAPL": ["MSFT", "GOOGL", "META", "AMZN", "NVDA", "TSLA"],
    "MSFT": ["AAPL", "GOOGL", "AMZN", "META", "NVDA", "JPM"],
    "NVDA": ["AMD", "INTC", "AVGO", "QCOM", "MSFT", "AAPL"],
    "TSLA": ["F", "GM", "RIVN", "NIO", "LCID", "NVDA"],
    "AMZN": ["MSFT", "GOOGL", "META", "AAPL", "NFLX", "SHOP"],
    "GOOGL": ["META", "MSFT", "AMZN", "AAPL", "NVDA", "NFLX"],
    "META": ["GOOGL", "SNAP", "PINS", "MSFT", "AMZN", "AAPL"],
    "JPM": ["BAC", "GS", "MS", "WFC", "C", "BLK"],
}

_use_mock = None


async def _check_api():
    global _use_mock
    if _use_mock is not None:
        return
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            r = await client.get(f"{BASE}/quote", params={"symbol": "AAPL", "token": FINNHUB_KEY})
            data = r.json()
            _use_mock = "error" in data or r.status_code != 200
    except Exception:
        _use_mock = True


async def _get(path: str, params: dict | None = None) -> dict | list:
    params = params or {}
    params["token"] = FINNHUB_KEY
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(f"{BASE}{path}", params=params)
        if r.status_code != 200:
            raise HTTPException(status_code=r.status_code, detail="Finnhub API error")
        data = r.json()
        if isinstance(data, dict) and "error" in data:
            raise HTTPException(status_code=401, detail="Invalid API key")
        return data


def _compute_risk(beta: float | None, high52: float | None, low52: float | None,
                  current: float | None, pe: float | None) -> tuple[int, str]:
    score = 50

    if beta is not None:
        if beta < 0.5:
            score -= 20
        elif beta < 0.8:
            score -= 10
        elif beta < 1.2:
            pass
        elif beta < 1.8:
            score += 15
        else:
            score += 28

    if high52 and current and high52 > 0:
        drawdown = ((high52 - current) / high52) * 100
        if drawdown < 20:
            score -= 8
        elif drawdown < 40:
            pass
        elif drawdown < 60:
            score += 10
        else:
            score += 18

    if pe is not None:
        if pe < 0:
            score += 15
        elif pe > 80:
            score += 12
        elif pe > 40:
            score += 6
        elif pe < 15:
            score -= 5

    score = max(0, min(100, score))
    if score < 35:
        level = "Low"
    elif score <= 65:
        level = "Medium"
    else:
        level = "High"
    return score, level


def _mock_analyze(ticker: str) -> dict:
    d = MOCK_DATA.get(ticker)
    if not d:
        d = {"c": 150.00, "dp": 0.5, "h": 155.0, "l": 148.0, "name": ticker, "mc": 100, "pe": 20.0, "beta": 1.0, "high52": 180.0, "low52": 120.0}
    risk_score, risk_level = _compute_risk(d["beta"], d["high52"], d["low52"], d["c"], d["pe"])
    peers = MOCK_PEERS.get(ticker, ["AAPL", "MSFT", "GOOGL", "AMZN"])[:8]
    return {
        "ticker": ticker,
        "name": d["name"],
        "price": d["c"],
        "change": d["dp"],
        "marketCap": d["mc"],
        "pe": d["pe"],
        "beta": d["beta"],
        "high52": d["high52"],
        "low52": d["low52"],
        "riskScore": risk_score,
        "riskLevel": risk_level,
        "peers": peers,
    }


@app.get("/analyze/{ticker}")
async def analyze(ticker: str):
    ticker = ticker.upper()
    await _check_api()

    if _use_mock:
        return _mock_analyze(ticker)

    try:
        quote = await _get("/quote", {"symbol": ticker})
        profile = await _get("/stock/profile2", {"symbol": ticker})
        metrics_resp = await _get("/stock/metric", {"symbol": ticker, "metric": "all"})
        peers_resp = await _get("/stock/peers", {"symbol": ticker})
    except HTTPException:
        return _mock_analyze(ticker)

    metrics = metrics_resp.get("metric", {}) if isinstance(metrics_resp, dict) else {}

    price = quote.get("c", 0)
    change = quote.get("dp", 0)
    high52 = metrics.get("52WeekHigh", quote.get("h"))
    low52 = metrics.get("52WeekLow", quote.get("l"))
    pe = metrics.get("peNormalizedAnnual") or metrics.get("peTTM")
    beta = metrics.get("beta")
    market_cap = profile.get("marketCapitalization", 0)

    risk_score, risk_level = _compute_risk(beta, high52, low52, price, pe)

    peers = [p for p in (peers_resp if isinstance(peers_resp, list) else []) if p != ticker][:8]

    return {
        "ticker": ticker,
        "name": profile.get("name", ticker),
        "price": price,
        "change": change,
        "marketCap": market_cap,
        "pe": pe,
        "beta": beta,
        "high52": high52,
        "low52": low52,
        "riskScore": risk_score,
        "riskLevel": risk_level,
        "peers": peers,
    }


@app.get("/peers/{ticker}")
async def peers(ticker: str):
    ticker = ticker.upper()
    await _check_api()

    if _use_mock:
        peer_list = MOCK_PEERS.get(ticker, ["AAPL", "MSFT", "GOOGL"])[:8]
        results = []
        for sym in peer_list:
            d = MOCK_DATA.get(sym)
            if not d:
                d = {"c": 100.0, "dp": 0.3, "name": sym, "mc": 50, "pe": 18.0, "beta": 1.0, "high52": 130.0, "low52": 80.0}
            rs, rl = _compute_risk(d["beta"], d["high52"], d["low52"], d["c"], d["pe"])
            results.append({
                "ticker": sym,
                "name": d["name"],
                "price": d["c"],
                "change": d["dp"],
                "marketCap": d["mc"],
                "riskScore": rs,
                "riskLevel": rl,
            })
        return results

    try:
        peers_resp = await _get("/stock/peers", {"symbol": ticker})
    except HTTPException:
        return []

    peer_list = [p for p in (peers_resp if isinstance(peers_resp, list) else []) if p != ticker][:8]

    results = []
    for sym in peer_list:
        try:
            q = await _get("/quote", {"symbol": sym})
            prof = await _get("/stock/profile2", {"symbol": sym})
            met_resp = await _get("/stock/metric", {"symbol": sym, "metric": "all"})
            met = met_resp.get("metric", {}) if isinstance(met_resp, dict) else {}

            p_price = q.get("c", 0)
            p_beta = met.get("beta")
            p_pe = met.get("peNormalizedAnnual") or met.get("peTTM")
            p_high52 = met.get("52WeekHigh", q.get("h"))
            p_low52 = met.get("52WeekLow", q.get("l"))

            rs, rl = _compute_risk(p_beta, p_high52, p_low52, p_price, p_pe)
            results.append({
                "ticker": sym,
                "name": prof.get("name", sym),
                "price": p_price,
                "change": q.get("dp", 0),
                "marketCap": prof.get("marketCapitalization", 0),
                "riskScore": rs,
                "riskLevel": rl,
            })
        except Exception:
            continue

    return results


@app.get("/portfolio")
async def portfolio():
    targets = {"VTI": 0.40, "VXUS": 0.20, "BND": 0.40}
    holdings = {"VTI": 10, "VXUS": 10, "BND": 10}

    await _check_api()

    prices = {}
    for sym in targets:
        if _use_mock:
            prices[sym] = MOCK_DATA.get(sym, {}).get("c", 100.0)
        else:
            try:
                q = await _get("/quote", {"symbol": sym})
                prices[sym] = q.get("c", 0)
            except HTTPException:
                prices[sym] = MOCK_DATA.get(sym, {}).get("c", 100.0)

    total_value = sum(prices[s] * holdings[s] for s in targets)

    allocations = []
    for sym, weight in targets.items():
        current_value = prices[sym] * holdings[sym]
        current_pct = (current_value / total_value * 100) if total_value else 0
        target_pct = weight * 100
        drift = current_pct - target_pct

        target_shares = (total_value * weight) / prices[sym] if prices[sym] else 0
        delta_shares = target_shares - holdings[sym]

        if delta_shares > 0.5:
            action = "BUY"
        elif delta_shares < -0.5:
            action = "SELL"
        else:
            action = "HOLD"

        allocations.append({
            "ticker": sym,
            "price": prices[sym],
            "shares": holdings[sym],
            "currentValue": round(current_value, 2),
            "currentPct": round(current_pct, 2),
            "targetPct": target_pct,
            "drift": round(drift, 2),
            "targetShares": round(target_shares, 2),
            "deltaShares": round(delta_shares, 2),
            "action": action,
        })

    return {
        "totalValue": round(total_value, 2),
        "allocations": allocations,
    }


@app.get("/health")
async def health():
    return {"status": "ok", "mode": "mock" if _use_mock else "live"}
