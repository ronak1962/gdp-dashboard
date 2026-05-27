import os
import asyncio
import httpx
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from screener import SECTOR_MAP, DIVIDEND_UNIVERSE, ETF_UNIVERSE, CANADIAN_DIVIDEND
from advisor import generate_recommendation, analyze_signals

# Rate limiter: Finnhub free tier allows 30 calls/second
_rate_semaphore = asyncio.Semaphore(10)

app = FastAPI(title="WealthIQ Stock Peer Analysis & Terminal")

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
    async with _rate_semaphore:
        async with httpx.AsyncClient(timeout=15) as client:
            for attempt in range(3):
                r = await client.get(f"{BASE}{path}", params=params)
                if r.status_code == 429:
                    await asyncio.sleep(1.0 * (attempt + 1))
                    continue
                if r.status_code != 200:
                    raise HTTPException(status_code=r.status_code, detail="Finnhub API error")
                data = r.json()
                if isinstance(data, dict) and "error" in data:
                    if "limit" in data.get("error", "").lower():
                        await asyncio.sleep(1.0 * (attempt + 1))
                        continue
                    raise HTTPException(status_code=401, detail=data["error"])
                return data
            raise HTTPException(status_code=429, detail="Rate limit exceeded")


async def _fetch_stock_full(sym: str) -> dict | None:
    """Fetch quote + profile + metrics for a single ticker. Returns None on failure."""
    try:
        quote = await _get("/quote", {"symbol": sym})
        profile = await _get("/stock/profile2", {"symbol": sym})
        metrics_resp = await _get("/stock/metric", {"symbol": sym, "metric": "all"})

        metrics = metrics_resp.get("metric", {}) if isinstance(metrics_resp, dict) else {}
        price = quote.get("c", 0)
        if not price or price == 0:
            return None
        return {
            "ticker": sym,
            "name": profile.get("name", sym),
            "sector": profile.get("finnhubIndustry", ""),
            "country": profile.get("country", ""),
            "price": price,
            "change": quote.get("dp", 0),
            "marketCap": profile.get("marketCapitalization", 0),
            "pe": metrics.get("peNormalizedAnnual") or metrics.get("peTTM"),
            "beta": metrics.get("beta"),
            "high52": metrics.get("52WeekHigh", quote.get("h")),
            "low52": metrics.get("52WeekLow", quote.get("l")),
            "dividendYield": metrics.get("currentDividendYieldTTM"),
            "dividendPerShare": metrics.get("dividendPerShareAnnual"),
            "dividendGrowth5Y": metrics.get("dividendGrowthRate5Y"),
            "return1Y": metrics.get("52WeekPriceReturnDaily"),
            "returnYTD": metrics.get("yearToDatePriceReturnDaily"),
            "return3M": metrics.get("13WeekPriceReturnDaily"),
        }
    except Exception:
        return None


async def _fetch_batch(symbols: list[str], batch_size: int = 5) -> list[dict]:
    """Fetch stocks in small batches to respect rate limits."""
    results = []
    for i in range(0, len(symbols), batch_size):
        batch = symbols[i:i + batch_size]
        batch_results = await asyncio.gather(*[_fetch_stock_full(s) for s in batch])
        results.extend(batch_results)
        if i + batch_size < len(symbols):
            await asyncio.sleep(0.5)
    return [r for r in results if r is not None]


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


# ─── Original Endpoints ─────────────────────────────────────────────────────

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


# ─── Terminal / Screener Endpoints ───────────────────────────────────────────

@app.get("/terminal/sectors")
async def list_sectors():
    """List available sectors for screening."""
    return {
        "sectors": [
            {"id": "technology", "label": "Technology", "count": 30},
            {"id": "healthcare", "label": "Healthcare", "count": 30},
            {"id": "finance", "label": "Finance / Banking", "count": 20},
            {"id": "energy", "label": "Energy / Oil & Gas", "count": 20},
            {"id": "consumer", "label": "Consumer / Retail", "count": 20},
            {"id": "etf", "label": "ETFs", "count": 40},
            {"id": "dividend", "label": "Dividend Stocks", "count": 30},
            {"id": "canadian", "label": "Canadian Dividend", "count": 20},
        ]
    }


@app.get("/terminal/top-sector/{sector}")
async def top_by_sector(sector: str, limit: int = Query(default=5, ge=1, le=20)):
    """
    Get top stocks by market cap in a sector.
    Example: /terminal/top-sector/technology?limit=5
    """
    sector = sector.lower()
    universe = SECTOR_MAP.get(sector)
    if not universe:
        raise HTTPException(status_code=404, detail=f"Unknown sector: {sector}. Available: {list(SECTOR_MAP.keys())}")

    stocks = await _fetch_batch(universe[:limit * 2])

    for s in stocks:
        rs, rl = _compute_risk(s["beta"], s["high52"], s["low52"], s["price"], s["pe"])
        s["riskScore"] = rs
        s["riskLevel"] = rl

    stocks.sort(key=lambda x: x.get("marketCap") or 0, reverse=True)
    return {"sector": sector, "results": stocks[:limit]}


@app.get("/terminal/dividends")
async def top_dividends(
    country: str = Query(default="US", description="US or CA"),
    limit: int = Query(default=10, ge=1, le=20),
):
    """
    Get highest dividend-yielding stocks.
    Example: /terminal/dividends?country=US&limit=10
    """
    if country.upper() == "CA":
        universe = CANADIAN_DIVIDEND
    else:
        universe = DIVIDEND_UNIVERSE

    stocks = await _fetch_batch(universe[:limit * 2])
    stocks = [s for s in stocks if s.get("dividendYield")]

    for s in stocks:
        rs, rl = _compute_risk(s["beta"], s["high52"], s["low52"], s["price"], s["pe"])
        s["riskScore"] = rs
        s["riskLevel"] = rl

    stocks.sort(key=lambda x: x.get("dividendYield") or 0, reverse=True)
    return {"country": country.upper(), "results": stocks[:limit]}


@app.get("/terminal/low-risk")
async def low_risk_returns(
    min_return: float = Query(default=10.0, description="Minimum 1Y return %"),
    max_risk: int = Query(default=45, description="Maximum risk score (0-100)"),
    limit: int = Query(default=10, ge=1, le=20),
):
    """
    Find low-risk stocks/ETFs with target annual return.
    Example: /terminal/low-risk?min_return=10&max_risk=45&limit=10
    """
    universe = ETF_UNIVERSE + DIVIDEND_UNIVERSE
    seen = set()
    unique = []
    for s in universe:
        if s not in seen:
            seen.add(s)
            unique.append(s)

    stocks = await _fetch_batch(unique[:30])

    qualified = []
    for s in stocks:
        rs, rl = _compute_risk(s["beta"], s["high52"], s["low52"], s["price"], s["pe"])
        s["riskScore"] = rs
        s["riskLevel"] = rl

        ret_1y = s.get("return1Y")
        if rs <= max_risk and ret_1y is not None and ret_1y >= min_return:
            qualified.append(s)

    qualified.sort(key=lambda x: x.get("return1Y") or 0, reverse=True)
    return {"minReturn": min_return, "maxRisk": max_risk, "results": qualified[:limit]}


@app.get("/terminal/query")
async def natural_query(q: str = Query(..., description="Natural language query")):
    """
    Process a natural-language-style query and route to the right screener.
    Examples:
      - "top 5 tech" → top 5 technology stocks
      - "top 5 healthcare" → top 5 healthcare stocks
      - "highest dividend US" → top dividend stocks US
      - "highest dividend canadian" → top Canadian dividend stocks
      - "low risk 10% return" → low risk with 10% return
    """
    q_lower = q.lower()

    # Detect limit
    limit = 5
    for word in q_lower.split():
        if word.isdigit():
            limit = min(int(word), 20)
            break

    # Detect sector queries
    for sector_key in ["technology", "tech", "healthcare", "health", "finance",
                       "financial", "banking", "energy", "oil", "consumer", "retail", "etf"]:
        if sector_key in q_lower:
            return await top_by_sector(sector_key, limit)

    # Detect dividend queries
    if "dividend" in q_lower:
        country = "CA" if "canad" in q_lower else "US"
        return await top_dividends(country, limit)

    # Detect low risk + return queries
    if "low risk" in q_lower or "safe" in q_lower or "conservative" in q_lower:
        import re
        ret_match = re.search(r"(\d+)\s*%?\s*return", q_lower)
        min_ret = float(ret_match.group(1)) if ret_match else 10.0
        return await low_risk_returns(min_ret, 45, limit)

    # Default: treat as sector search or return help
    return {
        "message": "I understand queries like:",
        "examples": [
            "top 5 tech",
            "top 5 healthcare",
            "top 10 dividend US",
            "top 5 dividend canadian",
            "low risk 10% return",
            "top 5 energy",
            "top 5 finance",
        ]
    }


# ─── AI Advisor Endpoints ────────────────────────────────────────────────────

@app.get("/advisor/{ticker}")
async def ai_advisor(
    ticker: str,
    profile: str = Query(default="moderate", description="conservative, moderate, or aggressive"),
):
    """
    AI-powered buy/sell/hold recommendation for a stock.
    Analyzes technical + fundamental signals and matches to investor profile.
    """
    ticker = ticker.upper()
    profile = profile.lower()
    if profile not in ("conservative", "moderate", "aggressive"):
        profile = "moderate"

    # Fetch full data
    data = await _fetch_stock_full(ticker)
    if not data:
        raise HTTPException(status_code=404, detail=f"Could not fetch data for {ticker}")

    # Compute risk
    rs, rl = _compute_risk(data["beta"], data["high52"], data["low52"], data["price"], data["pe"])
    data["riskScore"] = rs
    data["riskLevel"] = rl

    # Generate recommendation
    rec = generate_recommendation(data, profile)
    rec["ticker"] = ticker
    rec["name"] = data["name"]
    rec["price"] = data["price"]
    rec["change"] = data["change"]
    rec["riskScore"] = rs
    rec["riskLevel"] = rl

    return rec


@app.get("/advisor/batch")
async def ai_advisor_batch(
    tickers: str = Query(..., description="Comma-separated tickers"),
    profile: str = Query(default="moderate"),
):
    """
    Batch AI recommendations for multiple tickers.
    Example: /advisor/batch?tickers=AAPL,MSFT,NVDA&profile=conservative
    """
    profile = profile.lower()
    if profile not in ("conservative", "moderate", "aggressive"):
        profile = "moderate"

    ticker_list = [t.strip().upper() for t in tickers.split(",") if t.strip()][:10]

    stocks = await _fetch_batch(ticker_list)
    results = []
    for data in stocks:
        rs, rl = _compute_risk(data["beta"], data["high52"], data["low52"], data["price"], data["pe"])
        data["riskScore"] = rs
        data["riskLevel"] = rl
        rec = generate_recommendation(data, profile)
        rec["ticker"] = data["ticker"]
        rec["name"] = data["name"]
        rec["price"] = data["price"]
        rec["change"] = data["change"]
        rec["riskScore"] = rs
        rec["riskLevel"] = rl
        results.append(rec)

    return {"profile": profile, "results": results}


@app.get("/health")
async def health():
    return {"status": "ok", "api_key_set": bool(FINNHUB_KEY)}
