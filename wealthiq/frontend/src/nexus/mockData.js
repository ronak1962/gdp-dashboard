/** Demo payloads when Finnhub is unavailable — matches reference dashboard values. */

const base = (ticker, name, price, change, extras = {}) => ({
  ticker,
  name,
  price,
  change,
  marketCap: extras.marketCap ?? 2000,
  pe: extras.pe ?? 28,
  beta: extras.beta ?? 1.1,
  high52: extras.high52 ?? price * 1.15,
  low52: extras.low52 ?? price * 0.82,
  riskScore: extras.riskScore ?? 42,
  riskLevel: extras.riskLevel ?? 'Moderate',
  eps: extras.eps ?? 6.2,
  revenueGrowth: extras.revenueGrowth ?? 12.4,
  volatility: extras.volatility ?? 22,
  rsi: extras.rsi ?? 58,
  roic: extras.roic ?? 18,
  fcfYield: extras.fcfYield ?? 3.2,
  quality: extras.quality ?? 72,
  return1Y: extras.return1Y ?? 18,
  avgVolume: extras.avgVolume ?? 52.4,
  conviction: extras.conviction ?? 'High Conviction',
  signal: extras.signal ?? 'BUY',
  rankScore: extras.rankScore ?? 78,
  confidence: extras.confidence ?? 72,
  ...extras,
})

export const MOCK_STOCKS = {
  AAPL: base('AAPL', 'Apple Inc.', 198.42, 1.24, {
    marketCap: 3050, pe: 31, beta: 1.2, riskScore: 38, rankScore: 82, confidence: 78,
    conviction: 'High Conviction', signal: 'BUY', avgVolume: 58.2,
  }),
  MSFT: base('MSFT', 'Microsoft Corp.', 428.15, 0.86, {
    marketCap: 3180, pe: 35, beta: 0.95, riskScore: 32, rankScore: 91, confidence: 86,
    conviction: 'Very High Conviction', signal: 'STRONG BUY', avgVolume: 24.1,
  }),
  GOOGL: base('GOOGL', 'Alphabet Inc.', 178.63, -0.42, {
    marketCap: 2240, pe: 26, beta: 1.05, riskScore: 45, rankScore: 74, confidence: 65,
    conviction: 'Moderate Conviction', signal: 'HOLD', avgVolume: 31.8,
  }),
  AMZN: base('AMZN', 'Amazon.com Inc.', 198.91, 2.11, {
    marketCap: 2060, pe: 42, beta: 1.18, riskScore: 48, rankScore: 80, confidence: 71,
    conviction: 'High Conviction', signal: 'BUY', avgVolume: 42.6,
  }),
  NVDA: base('NVDA', 'NVIDIA Corp.', 132.5, 3.2, { marketCap: 3250, pe: 55, beta: 1.65, riskScore: 62, signal: 'BUY' }),
  TSLA: base('TSLA', 'Tesla Inc.', 248.3, -1.8, { marketCap: 790, pe: 68, beta: 2.1, riskScore: 71, signal: 'HOLD' }),
}

export function getMockStock(ticker) {
  const t = ticker?.toUpperCase()
  if (MOCK_STOCKS[t]) return { ...MOCK_STOCKS[t] }
  return base(t, `${t} Corp.`, 100 + (t.charCodeAt(0) % 50), 0.5)
}

export function getMockAdvisor(ticker) {
  const s = getMockStock(ticker)
  return {
    ticker: s.ticker,
    action: s.signal?.includes('STRONG') ? 'BUY' : s.signal === 'HOLD' ? 'HOLD' : 'BUY',
    confidence: s.confidence ?? 86,
    priceTarget: +(s.price * 1.12).toFixed(2),
    stopLoss: +(s.price * 0.92).toFixed(2),
    factors: {
      momentum: 5,
      valuation: 4,
      quality: 5,
      risk: 4,
      timing: 4,
    },
    thesis: `${s.name} leads on quality and momentum versus mega-cap peers. Valuation is fair; risk profile suits balanced mandates.`,
    signals: [
      { action: 'BUY', reason: 'Price above 50-day average', strength: 72 },
      { action: 'HOLD', reason: 'Valuation near sector median', strength: 55 },
    ],
  }
}

export const MOCK_MARKET = {
  indices: [
    { name: 'S&P 500', ticker: 'SPY', price: 528.4, change: 0.42, high: 530, low: 524 },
    { name: 'NASDAQ', ticker: 'QQQ', price: 448.2, change: 0.68, high: 451, low: 445 },
    { name: 'DOW', ticker: 'DIA', price: 392.1, change: -0.12, high: 394, low: 390 },
  ],
  gainers: Object.values(MOCK_STOCKS).slice(0, 4).map((s) => ({ ticker: s.ticker, price: s.price, change: s.change })),
  losers: Object.values(MOCK_STOCKS).slice(2, 6).map((s) => ({ ticker: s.ticker, price: s.price, change: -Math.abs(s.change) })),
}

export const MOCK_CATALYSTS = [
  { date: 'Jun 12', title: 'AAPL — WWDC / product cycle', type: 'event' },
  { date: 'Jun 18', title: 'MSFT — Build conference', type: 'event' },
  { date: 'Jun 25', title: 'FOMC rate decision', type: 'macro' },
  { date: 'Jul 02', title: 'AMZN — Prime Day metrics', type: 'event' },
]

export const MOCK_SCENARIOS = (ticker) => {
  const s = getMockStock(ticker)
  return [
    { case: 'Bull', move: '+18%', prob: 28, range: `$${(s.price * 1.12).toFixed(0)} – $${(s.price * 1.28).toFixed(0)}` },
    { case: 'Base', move: '+6%', prob: 52, range: `$${(s.price * 0.98).toFixed(0)} – $${(s.price * 1.08).toFixed(0)}` },
    { case: 'Bear', move: '-12%', prob: 20, range: `$${(s.price * 0.82).toFixed(0)} – $${(s.price * 0.92).toFixed(0)}` },
  ]
}
