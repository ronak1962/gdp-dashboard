"""
WealthIQ AI Advisor Engine
Generates buy/sell/hold recommendations with reasoning based on:
- Technical signals (momentum, 52-week position, trend)
- Fundamental analysis (PE, beta, dividend)
- Risk profile matching (conservative/moderate/aggressive)
"""

from dataclasses import dataclass


@dataclass
class Signal:
    action: str  # BUY, SELL, HOLD
    strength: int  # 0-100 confidence
    reason: str


def _position_in_range(current: float, low: float, high: float) -> float:
    """Where the price sits in 52-week range (0 = at low, 1 = at high)."""
    if high <= low:
        return 0.5
    return (current - low) / (high - low)


def analyze_signals(data: dict) -> list[Signal]:
    """Generate individual signals from stock data."""
    signals = []
    price = data.get("price", 0)
    high52 = data.get("high52")
    low52 = data.get("low52")
    beta = data.get("beta")
    pe = data.get("pe")
    return_1y = data.get("return1Y")
    return_3m = data.get("return3M")
    return_ytd = data.get("returnYTD")
    dividend_yield = data.get("dividendYield")
    change = data.get("change", 0)

    # 1. 52-Week Position Signal
    if high52 and low52 and price:
        pos = _position_in_range(price, low52, high52)
        if pos < 0.25:
            signals.append(Signal("BUY", 75, f"Trading near 52-week low ({pos*100:.0f}% of range) — potential value entry"))
        elif pos < 0.40:
            signals.append(Signal("BUY", 55, f"Below midpoint of 52-week range ({pos*100:.0f}%) — reasonable entry"))
        elif pos > 0.92:
            signals.append(Signal("SELL", 70, f"Near 52-week high ({pos*100:.0f}% of range) — consider taking profits"))
        elif pos > 0.80:
            signals.append(Signal("HOLD", 50, f"Near top of 52-week range ({pos*100:.0f}%) — watch for pullback"))
        else:
            signals.append(Signal("HOLD", 40, f"Mid-range in 52-week band ({pos*100:.0f}%)"))

    # 2. Momentum Signal (1Y return)
    if return_1y is not None:
        if return_1y > 50:
            signals.append(Signal("HOLD", 60, f"Strong 1Y momentum (+{return_1y:.1f}%) — but may be overextended"))
        elif return_1y > 20:
            signals.append(Signal("BUY", 65, f"Solid 1Y return (+{return_1y:.1f}%) — uptrend intact"))
        elif return_1y > 0:
            signals.append(Signal("HOLD", 45, f"Modest 1Y return (+{return_1y:.1f}%) — neutral momentum"))
        elif return_1y > -20:
            signals.append(Signal("HOLD", 40, f"Slight 1Y decline ({return_1y:.1f}%) — watch for reversal"))
        else:
            signals.append(Signal("SELL", 60, f"Significant 1Y decline ({return_1y:.1f}%) — negative trend"))

    # 3. Short-term momentum (3M)
    if return_3m is not None:
        if return_3m > 20:
            signals.append(Signal("HOLD", 55, f"Rapid 3M gain (+{return_3m:.1f}%) — may be overbought short-term"))
        elif return_3m > 8:
            signals.append(Signal("BUY", 60, f"Strong short-term momentum (+{return_3m:.1f}% in 3M)"))
        elif return_3m < -15:
            signals.append(Signal("BUY", 55, f"Significant 3M pullback ({return_3m:.1f}%) — possible dip-buy opportunity"))
        elif return_3m < -5:
            signals.append(Signal("HOLD", 45, f"Short-term weakness ({return_3m:.1f}% in 3M) — wait for stability"))

    # 4. Valuation Signal (PE)
    if pe is not None:
        if pe < 0:
            signals.append(Signal("SELL", 65, "Negative earnings — unprofitable, high risk"))
        elif pe > 100:
            signals.append(Signal("SELL", 55, f"Extreme valuation (P/E {pe:.1f}) — priced for perfection"))
        elif pe > 50:
            signals.append(Signal("HOLD", 50, f"High valuation (P/E {pe:.1f}) — growth expectations baked in"))
        elif pe > 25:
            signals.append(Signal("HOLD", 45, f"Moderate valuation (P/E {pe:.1f}) — fairly priced"))
        elif pe > 12:
            signals.append(Signal("BUY", 60, f"Reasonable valuation (P/E {pe:.1f}) — potential value"))
        else:
            signals.append(Signal("BUY", 70, f"Low P/E ({pe:.1f}) — deep value or turnaround candidate"))

    # 5. Volatility/Beta Signal
    if beta is not None:
        if beta > 2.0:
            signals.append(Signal("HOLD", 40, f"Very high beta ({beta:.2f}) — extreme volatility, size positions small"))
        elif beta > 1.5:
            signals.append(Signal("HOLD", 45, f"High beta ({beta:.2f}) — amplified market moves, use limit orders"))
        elif beta < 0.5:
            signals.append(Signal("BUY", 55, f"Low beta ({beta:.2f}) — defensive, stable returns"))
        elif beta < 0.8:
            signals.append(Signal("BUY", 50, f"Below-market beta ({beta:.2f}) — lower volatility than market"))

    # 6. Dividend Signal
    if dividend_yield is not None and dividend_yield > 0:
        if dividend_yield > 5:
            signals.append(Signal("BUY", 65, f"High dividend yield ({dividend_yield:.2f}%) — strong income"))
        elif dividend_yield > 3:
            signals.append(Signal("BUY", 55, f"Solid dividend ({dividend_yield:.2f}%) — income + growth"))
        elif dividend_yield > 1:
            signals.append(Signal("HOLD", 40, f"Modest dividend ({dividend_yield:.2f}%) — some income support"))

    return signals


def generate_recommendation(data: dict, investor_profile: str = "moderate") -> dict:
    """
    Generate an AI recommendation for a stock based on all available data.

    investor_profile: conservative, moderate, aggressive
    """
    signals = analyze_signals(data)
    if not signals:
        return {
            "action": "HOLD",
            "confidence": 30,
            "summary": "Insufficient data for a strong recommendation.",
            "signals": [],
            "reasoning": "Not enough data available to generate a clear signal.",
        }

    # Score signals
    buy_score = sum(s.strength for s in signals if s.action == "BUY")
    sell_score = sum(s.strength for s in signals if s.action == "SELL")
    hold_score = sum(s.strength for s in signals if s.action == "HOLD")
    total = buy_score + sell_score + hold_score

    # Adjust by investor profile
    risk_score = data.get("riskScore", 50)

    if investor_profile == "conservative":
        if risk_score > 60:
            sell_score += 40
        elif risk_score > 45:
            hold_score += 20
        else:
            buy_score += 15
    elif investor_profile == "aggressive":
        if risk_score < 30:
            hold_score += 20
        elif data.get("return1Y") and data["return1Y"] > 30:
            buy_score += 25

    # Determine final action
    if buy_score > sell_score and buy_score > hold_score:
        action = "BUY"
        confidence = min(90, int(buy_score / max(total, 1) * 100))
    elif sell_score > buy_score and sell_score > hold_score:
        action = "SELL"
        confidence = min(90, int(sell_score / max(total, 1) * 100))
    else:
        action = "HOLD"
        confidence = min(90, int(hold_score / max(total, 1) * 100))

    # Generate summary
    ticker = data.get("ticker", "")
    price = data.get("price", 0)

    if action == "BUY":
        summary = f"AI recommends BUYING {ticker} at ${price:.2f}. Multiple signals indicate favorable entry."
    elif action == "SELL":
        summary = f"AI recommends SELLING {ticker} at ${price:.2f}. Risk/reward unfavorable at current levels."
    else:
        summary = f"AI recommends HOLDING {ticker} at ${price:.2f}. Mixed signals — wait for clearer setup."

    # Generate target prices
    targets = _compute_targets(data, action)

    return {
        "action": action,
        "confidence": confidence,
        "summary": summary,
        "investorProfile": investor_profile,
        "signals": [{"action": s.action, "strength": s.strength, "reason": s.reason} for s in signals],
        "targets": targets,
        "reasoning": _build_reasoning(signals, action, investor_profile, data),
    }


def _compute_targets(data: dict, action: str) -> dict:
    """Compute entry/exit price targets."""
    price = data.get("price", 0)
    high52 = data.get("high52", price * 1.2)
    low52 = data.get("low52", price * 0.8)
    beta = data.get("beta", 1.0) or 1.0

    if action == "BUY":
        entry = price
        stop_loss = price * (1 - 0.05 * beta)
        target_1 = price * (1 + 0.10)
        target_2 = min(high52, price * (1 + 0.20))
    elif action == "SELL":
        entry = price
        stop_loss = price * (1 + 0.03)
        target_1 = price * (1 - 0.08)
        target_2 = max(low52, price * (1 - 0.15))
    else:
        entry = price * 0.97
        stop_loss = price * 0.92
        target_1 = price * 1.08
        target_2 = price * 1.15

    return {
        "entry": round(entry, 2),
        "stopLoss": round(stop_loss, 2),
        "target1": round(target_1, 2),
        "target2": round(target_2, 2),
        "riskRewardRatio": round(abs(target_1 - entry) / max(abs(entry - stop_loss), 0.01), 2),
    }


def _build_reasoning(signals: list[Signal], action: str, profile: str, data: dict) -> str:
    """Build a human-readable reasoning paragraph."""
    ticker = data.get("ticker", "Stock")
    buy_signals = [s for s in signals if s.action == "BUY"]
    sell_signals = [s for s in signals if s.action == "SELL"]

    parts = []
    if action == "BUY":
        parts.append(f"{ticker} shows {len(buy_signals)} bullish signal(s).")
        for s in buy_signals[:3]:
            parts.append(s.reason + ".")
        if profile == "conservative" and data.get("riskScore", 50) < 40:
            parts.append(f"Risk score ({data.get('riskScore')}/100) aligns with conservative profile.")
    elif action == "SELL":
        parts.append(f"{ticker} shows {len(sell_signals)} bearish signal(s).")
        for s in sell_signals[:3]:
            parts.append(s.reason + ".")
        if profile == "conservative" and data.get("riskScore", 50) > 60:
            parts.append(f"High risk score ({data.get('riskScore')}/100) makes this unsuitable for conservative investors.")
    else:
        parts.append(f"{ticker} shows mixed signals — {len(buy_signals)} bullish, {len(sell_signals)} bearish.")
        parts.append("Recommend waiting for a clearer trend before acting.")

    return " ".join(parts)
