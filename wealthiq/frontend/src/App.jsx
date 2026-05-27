import { useState, useCallback } from 'react'
import StockCard from './components/StockCard'
import RiskGauge from './components/RiskGauge'
import PeerTable from './components/PeerTable'
import PortfolioPanel from './components/PortfolioPanel'
import RangeBar from './components/RangeBar'
import AppetiteProfile from './components/AppetiteProfile'
import Terminal from './components/Terminal'
import AIAdvisor from './components/AIAdvisor'
import Discover from './components/Discover'

const API = 'http://localhost:8000'
const CHIPS = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN', 'GOOGL', 'META', 'JPM']

export default function App() {
  const [ticker, setTicker] = useState('')
  const [data, setData] = useState(null)
  const [peers, setPeers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('terminal')

  const search = useCallback(async (sym) => {
    const t = (sym || ticker).trim().toUpperCase()
    if (!t) return
    setTicker(t)
    setLoading(true)
    setError('')
    setData(null)
    setPeers([])
    try {
      const res = await fetch(`${API}/analyze/${t}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const json = await res.json()
      setData(json)
      const pRes = await fetch(`${API}/peers/${t}`)
      if (pRes.ok) setPeers(await pRes.json())
    } catch (e) {
      setError(e.message || 'API error')
    } finally {
      setLoading(false)
    }
  }, [ticker])

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <header className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-navy flex items-center justify-center">
          <span className="text-white font-bold text-lg">W</span>
        </div>
        <h1 className="text-2xl font-bold text-navy">WealthIQ</h1>
        <span className="text-sm text-gray-500 mt-1">Stock Peer Analysis</span>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setTab('terminal')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
            tab === 'terminal' ? 'bg-gray-900 text-cyan-400 ring-1 ring-cyan-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          ⌨ Terminal
        </button>
        <button
          onClick={() => setTab('advisor')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
            tab === 'advisor' ? 'bg-gradient-to-r from-navy to-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          🤖 AI Advisor
        </button>
        <button
          onClick={() => setTab('discover')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
            tab === 'discover' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Discover
        </button>
        <button
          onClick={() => setTab('analysis')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
            tab === 'analysis' ? 'bg-navy text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Stock Analysis
        </button>
        <button
          onClick={() => setTab('portfolio')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
            tab === 'portfolio' ? 'bg-navy text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Portfolio
        </button>
      </div>

      {tab === 'analysis' && (
        <>
          {/* Search */}
          <div className="mb-4">
            <div className="flex gap-2">
              <input
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-navy focus:outline-none"
                placeholder="Enter ticker symbol (e.g. AAPL)"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && search()}
              />
              <button
                onClick={() => search()}
                className="px-5 py-2 bg-navy text-white rounded-lg font-medium text-sm hover:bg-opacity-90 transition"
              >
                Analyze
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {CHIPS.map((c) => (
                <button
                  key={c}
                  onClick={() => { setTicker(c); search(c) }}
                  className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full text-xs font-medium text-gray-700 hover:bg-navy hover:text-white transition"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-navy border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 mt-2 text-sm">Fetching real-time data…</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">{error}</div>
          )}

          {data && !loading && (
            <div className="space-y-6">
              {/* Metric cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StockCard label="Price" value={`$${data.price?.toFixed(2)}`} sub={`${data.change >= 0 ? '+' : ''}${data.change?.toFixed(2)}%`} color={data.change >= 0 ? 'text-teal' : 'text-red'} />
                <StockCard label="Market Cap" value={data.marketCap ? `$${(data.marketCap / 1000).toFixed(1)}B` : 'N/A'} />
                <StockCard label="P/E Ratio" value={data.pe ? data.pe.toFixed(2) : 'N/A'} />
                <StockCard label="Beta" value={data.beta ? data.beta.toFixed(2) : 'N/A'} />
              </div>

              {/* Risk + 52W */}
              <div className="grid md:grid-cols-2 gap-4">
                <RiskGauge score={data.riskScore} level={data.riskLevel} />
                <RangeBar high={data.high52} low={data.low52} current={data.price} />
              </div>

              {/* Appetite */}
              <AppetiteProfile riskScore={data.riskScore} riskLevel={data.riskLevel} />

              {/* Peers */}
              {peers.length > 0 && <PeerTable peers={peers} mainPrice={data.price} />}
            </div>
          )}
        </>
      )}

      {tab === 'portfolio' && <PortfolioPanel />}

      {tab === 'terminal' && <Terminal />}

      {tab === 'advisor' && <AIAdvisor />}

      {tab === 'discover' && <Discover />}
    </div>
  )
}
