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

FINNHUB_KEY = os.getenv("FINNHUB_API_KEY", "")
BASE = "https://finnhub.io/api/v1"


async def _get(path: str, params: dict | None = None) -> dict | list:
    params = params or {}
    params["token"] = FINNHUB_KEY
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(f"{BASE}{path}", params=params)
        if r.status_code != 200:
            raise HTTPException(status_code=r.status_code, detail="Finnhub API error")
        data = r.json()
        if isinstance(data, dict) and "error" in data:
            raise HTTPException(status_code=401, detail=data["error"])
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


@app.get("/analyze/{ticker}")
async def analyze(ticker: str):
    ticker = ticker.upper()

    quote = await _get("/quote", {"symbol": ticker})
    profile = await _get("/stock/profile2", {"symbol": ticker})
    metrics_resp = await _get("/stock/metric", {"symbol": ticker, "metric": "all"})
    peers_resp = await _get("/stock/peers", {"symbol": ticker})

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
    peers_resp = await _get("/stock/peers", {"symbol": ticker})
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

    prices = {}
    for sym in targets:
        q = await _get("/quote", {"symbol": sym})
        prices[sym] = q.get("c", 0)

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
    return {"status": "ok", "api_key_set": bool(FINNHUB_KEY)}
