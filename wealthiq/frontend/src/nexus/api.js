import { API } from './constants'
import { getMockStock, getMockAdvisor, MOCK_MARKET } from './mockData'

export async function fetchStock(ticker) {
  const t = ticker.toUpperCase()
  try {
    const res = await fetch(`${API}/analyze/${t}`)
    if (res.ok) return await res.json()
  } catch {
    /* use mock */
  }
  return getMockStock(t)
}

export async function fetchAdvisor(ticker, profile = 'moderate') {
  const t = ticker.toUpperCase()
  try {
    const res = await fetch(`${API}/advisor/${t}?profile=${profile}`)
    if (res.ok) return await res.json()
  } catch {
    /* use mock */
  }
  return getMockAdvisor(t)
}

export async function fetchMarketOverview() {
  try {
    const res = await fetch(`${API}/market/overview`)
    if (res.ok) return await res.json()
  } catch {
    /* use mock */
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
