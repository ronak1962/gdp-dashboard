import { API } from './constants'
import { getMockStock, getMockAdvisor, MOCK_MARKET } from './mockData'

function enrich(stock) {
  const mock = getMockStock(stock.ticker)
  return {
    ...mock,
    ...stock,
    rankScore: stock.rankScore ?? mock.rankScore,
    confidence: stock.confidence ?? mock.confidence,
    conviction: stock.conviction ?? mock.conviction,
    signal: stock.signal ?? mock.signal,
    avgVolume: stock.avgVolume ?? mock.avgVolume,
    eps: stock.eps ?? mock.eps,
    revenueGrowth: stock.revenueGrowth ?? mock.revenueGrowth,
    volatility: stock.volatility ?? mock.volatility,
    rsi: stock.rsi ?? mock.rsi,
  }
}

export async function fetchStock(ticker) {
  const t = ticker.toUpperCase()
  try {
    const res = await fetch(`${API}/analyze/${t}`)
    if (res.ok) return enrich(await res.json())
  } catch {
    /* mock */
  }
  return getMockStock(t)
}

export async function fetchAdvisor(ticker, profile = 'moderate') {
  const t = ticker.toUpperCase()
  try {
    const res = await fetch(`${API}/advisor/${t}?profile=${profile}`)
    if (res.ok) return await res.json()
  } catch {
    /* mock */
  }
  return getMockAdvisor(t)
}

export async function fetchMarketOverview() {
  try {
    const res = await fetch(`${API}/market/overview`)
    if (res.ok) return await res.json()
  } catch {
    /* mock */
  }
  return MOCK_MARKET
}

export async function fetchTemplates() {
  try {
    const res = await fetch(`${API}/templates`)
    if (res.ok) return await res.json()
  } catch {
    return []
  }
  return []
}

export async function fetchStocksBatch(tickers) {
  return Promise.all(tickers.map((t) => fetchStock(t)))
}
