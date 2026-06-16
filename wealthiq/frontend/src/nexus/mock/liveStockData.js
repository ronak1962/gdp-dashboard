import { getMockStock, MOCK_STOCKS } from '../mockData'

export function getLiveStockDetail(ticker) {
  const s = getMockStock(ticker)
  const price = s.price ?? 192.35
  const changePct = s.change ?? 0.9
  const changeAbs = +(price * (changePct / 100)).toFixed(2)

  return {
    ...s,
    price: ticker === 'AAPL' ? 192.35 : price,
    change: ticker === 'AAPL' ? 0.9 : changePct,
    changeAbs: ticker === 'AAPL' ? 1.72 : changeAbs,
    volume: ticker === 'AAPL' ? 32.48 : s.avgVolume ?? 28,
    marketCapDisplay: ticker === 'AAPL' ? '2.94T' : `${(s.marketCap / 1000).toFixed(2)}T`,
    exchange: 'NASDAQ',
    open: +(price * 0.995).toFixed(2),
    prevClose: +(price - changeAbs).toFixed(2),
    high: +(price * 1.004).toFixed(2),
    low: +(price * 0.988).toFixed(2),
    dayHigh: 193.12,
    dayLow: 190.21,
    avgTradePrice: +(price * 0.999).toFixed(2),
    lastQty: 400,
    lastTradeTime: '15:59:45',
    riskLevel: s.riskLevel || 'Medium',
    riskScore: s.riskScore ?? 48,
  }
}

export function generateCandles(ticker, count = 48) {
  const seed = ticker.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  let p = getMockStock(ticker).price ?? 190
  const candles = []
  for (let i = 0; i < count; i++) {
    const drift = Math.sin(i * 0.35 + seed) * 1.2 + (i > count - 8 ? 0.8 : 0)
    const o = p
    const c = p + drift + (Math.random() - 0.48) * 2
    const h = Math.max(o, c) + Math.random() * 1.5
    const l = Math.min(o, c) - Math.random() * 1.5
    const v = 20 + Math.abs(Math.sin(i + seed)) * 80
    candles.push({ o, h, l, c, v })
    p = c
  }
  return candles
}

export function generateRsi(candles) {
  return candles.map((_, i) => 35 + Math.sin(i * 0.25) * 20 + (i / candles.length) * 15)
}

export function generateMacd(candles) {
  return candles.map((_, i) => ({
    hist: Math.sin(i * 0.2) * 2,
    signal: Math.sin(i * 0.2 + 0.5) * 1.5,
    macd: Math.sin(i * 0.2) * 1.8,
  }))
}

export const MOCK_ORDER_BOOK = (price) => ({
  bids: [
    { price: price - 0.05, orders: 12, qty: 2400 },
    { price: price - 0.1, orders: 8, qty: 1800 },
    { price: price - 0.15, orders: 15, qty: 3200 },
    { price: price - 0.2, orders: 6, qty: 1100 },
    { price: price - 0.25, orders: 20, qty: 4500 },
  ],
  offers: [
    { price: price + 0.05, orders: 10, qty: 2100 },
    { price: price + 0.1, orders: 14, qty: 2900 },
    { price: price + 0.15, orders: 7, qty: 1500 },
    { price: price + 0.2, orders: 18, qty: 3800 },
    { price: price + 0.25, orders: 9, qty: 2200 },
  ],
})

export const MOCK_NEWS = [
  { title: 'Apple unveils AI features across device lineup', source: 'Reuters', sentiment: 'Positive', thumb: '📱' },
  { title: 'Supply chain checks show steady iPhone demand', source: 'Bloomberg', sentiment: 'Positive', thumb: '📈' },
  { title: 'Regulators review App Store policy updates', source: 'WSJ', sentiment: 'Neutral', thumb: '⚖️' },
  { title: 'Chip lead times widen for legacy nodes', source: 'FT', sentiment: 'Negative', thumb: '🔧' },
]

export const MOCK_SECTORS = [
  { name: 'Technology', change: 1.82 },
  { name: 'Finance', change: -0.34 },
  { name: 'Health Care', change: 0.56 },
  { name: 'Energy', change: -1.12 },
  { name: 'Consumer', change: 0.91 },
  { name: 'Industrial', change: 0.22 },
  { name: 'Utilities', change: -0.18 },
  { name: 'Real Estate', change: -0.45 },
  { name: 'Materials', change: 0.38 },
]

export const MOCK_WATCHLIST = () =>
  ['MSFT', 'TSLA', 'NVDA', 'AMZN'].map((t) => {
    const s = MOCK_STOCKS[t] || getMockStock(t)
    return {
      ticker: t,
      price: s.price,
      change: s.change,
      marketCap: `${(s.marketCap / 1000).toFixed(2)}T`,
    }
  })

export const CHART_TIMEFRAMES = ['1D', '5D', '1M', '3M', '6M', 'YTD', '1Y', '5Y']
