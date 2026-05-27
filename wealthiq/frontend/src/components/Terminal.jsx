import { useState, useRef, useEffect } from 'react'

const API = 'http://localhost:8000'

function RiskPill({ level }) {
  const color = level === 'Low' ? 'text-green-400 bg-green-400/10' : level === 'Medium' ? 'text-yellow-400 bg-yellow-400/10' : 'text-red-400 bg-red-400/10'
  return <span className={`${color} text-[10px] font-bold px-1.5 py-0.5 rounded`}>{level}</span>
}

function MarketTicker({ data }) {
  if (!data?.results?.length) return null
  return (
    <div className="flex gap-4 overflow-x-auto py-1 px-2 scrollbar-hide">
      {data.results.slice(0, 8).map((r) => (
        <div key={r.ticker} className="flex items-center gap-2 shrink-0">
          <span className="text-orange-400 font-mono text-xs font-bold">{r.ticker}</span>
          <span className="text-white font-mono text-xs">{r.price?.toFixed(2)}</span>
          <span className={`font-mono text-[10px] ${r.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {r.change >= 0 ? '▲' : '▼'}{Math.abs(r.change)?.toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  )
}

function StockRow({ stock, onSelect, isSelected }) {
  return (
    <tr
      className={`border-t border-gray-800 cursor-pointer transition ${isSelected ? 'bg-blue-900/30 border-l-2 border-l-orange-400' : 'hover:bg-blue-900/20'}`}
      onClick={(e) => { e.stopPropagation(); onSelect(stock.ticker); }}
    >
      <td className="py-2 px-3 font-mono text-orange-400 font-bold text-xs">{stock.ticker}</td>
      <td className="py-2 px-3 text-gray-300 text-xs truncate max-w-[120px]">{stock.name}</td>
      <td className="py-2 px-3 text-right font-mono text-white text-xs">{stock.price?.toFixed(2)}</td>
      <td className={`py-2 px-3 text-right font-mono text-xs ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
        {stock.change >= 0 ? '+' : ''}{stock.change?.toFixed(2)}%
      </td>
      <td className="py-2 px-3 text-right font-mono text-gray-400 text-xs">
        {stock.marketCap ? `${(stock.marketCap / 1000).toFixed(0)}B` : '—'}
      </td>
      <td className="py-2 px-3 text-right font-mono text-xs text-gray-400">
        {stock.dividendYield ? `${stock.dividendYield.toFixed(2)}%` : '—'}
      </td>
      <td className={`py-2 px-3 text-right font-mono text-xs ${(stock.return1Y || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
        {stock.return1Y != null ? `${stock.return1Y.toFixed(1)}%` : '—'}
      </td>
      <td className="py-2 px-3 text-center"><RiskPill level={stock.riskLevel} /></td>
    </tr>
  )
}

function StockDetail({ ticker }) {
  const [data, setData] = useState(null)
  const [rec, setRec] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch(`${API}/analyze/${ticker}`).then(r => r.json()),
      fetch(`${API}/advisor/${ticker}?profile=moderate`).then(r => r.json()),
    ]).then(([analysis, advice]) => {
      setData(analysis)
      setRec(advice)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [ticker])

  if (loading) return <div className="text-gray-500 text-xs p-4 text-center">Loading {ticker}...</div>
  if (!data) return null

  const actionColor = rec?.action === 'BUY' ? 'text-green-400 bg-green-400/10 border-green-400/30'
    : rec?.action === 'SELL' ? 'text-red-400 bg-red-400/10 border-red-400/30'
    : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-orange-400 font-mono text-lg font-bold">{data.ticker}</span>
          <span className="text-gray-400 text-xs ml-2">{data.name}</span>
        </div>
        {rec && (
          <div className={`${actionColor} border px-3 py-1 rounded text-xs font-bold font-mono`}>
            {rec.action} • {rec.confidence}%
          </div>
        )}
      </div>

      {/* Price + Metrics Grid */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-gray-800/50 rounded p-2">
          <div className="text-[10px] text-gray-500 uppercase">Price</div>
          <div className="text-white font-mono text-sm font-bold">${data.price?.toFixed(2)}</div>
          <div className={`text-[10px] font-mono ${data.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {data.change >= 0 ? '▲' : '▼'} {Math.abs(data.change)?.toFixed(2)}%
          </div>
        </div>
        <div className="bg-gray-800/50 rounded p-2">
          <div className="text-[10px] text-gray-500 uppercase">Mkt Cap</div>
          <div className="text-white font-mono text-sm">${(data.marketCap / 1000).toFixed(0)}B</div>
        </div>
        <div className="bg-gray-800/50 rounded p-2">
          <div className="text-[10px] text-gray-500 uppercase">P/E</div>
          <div className="text-white font-mono text-sm">{data.pe?.toFixed(1) || '—'}</div>
        </div>
        <div className="bg-gray-800/50 rounded p-2">
          <div className="text-[10px] text-gray-500 uppercase">Beta</div>
          <div className="text-white font-mono text-sm">{data.beta?.toFixed(2) || '—'}</div>
        </div>
      </div>

      {/* Risk + Range */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-800/50 rounded p-2">
          <div className="text-[10px] text-gray-500 uppercase mb-1">Risk Score</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${data.riskScore < 35 ? 'bg-green-400' : data.riskScore <= 65 ? 'bg-yellow-400' : 'bg-red-400'}`}
                style={{ width: `${data.riskScore}%` }}
              />
            </div>
            <span className="text-white font-mono text-xs">{data.riskScore}/100</span>
          </div>
        </div>
        <div className="bg-gray-800/50 rounded p-2">
          <div className="text-[10px] text-gray-500 uppercase mb-1">52W Range</div>
          <div className="flex items-center gap-1 text-[10px] font-mono">
            <span className="text-gray-500">{data.low52?.toFixed(0)}</span>
            <div className="flex-1 h-1.5 bg-gray-700 rounded-full relative">
              <div
                className="absolute top-0 h-full bg-blue-500 rounded-full"
                style={{ width: `${data.high52 && data.low52 ? ((data.price - data.low52) / (data.high52 - data.low52)) * 100 : 50}%` }}
              />
            </div>
            <span className="text-gray-500">{data.high52?.toFixed(0)}</span>
          </div>
        </div>
      </div>

      {/* AI Signals */}
      {rec?.signals?.length > 0 && (
        <div className="bg-gray-800/50 rounded p-2">
          <div className="text-[10px] text-gray-500 uppercase mb-1.5">AI Signals</div>
          <div className="space-y-1">
            {rec.signals.slice(0, 4).map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-[10px]">
                <span className={`w-1.5 h-1.5 rounded-full ${s.action === 'BUY' ? 'bg-green-400' : s.action === 'SELL' ? 'bg-red-400' : 'bg-yellow-400'}`}></span>
                <span className="text-gray-400 flex-1">{s.reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Targets */}
      {rec?.targets && (
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-gray-800/50 rounded p-1.5">
            <div className="text-[9px] text-gray-500">ENTRY</div>
            <div className="text-blue-400 font-mono text-[11px]">${rec.targets.entry}</div>
          </div>
          <div className="bg-gray-800/50 rounded p-1.5">
            <div className="text-[9px] text-gray-500">STOP</div>
            <div className="text-red-400 font-mono text-[11px]">${rec.targets.stopLoss}</div>
          </div>
          <div className="bg-gray-800/50 rounded p-1.5">
            <div className="text-[9px] text-gray-500">TARGET</div>
            <div className="text-green-400 font-mono text-[11px]">${rec.targets.target1}</div>
          </div>
          <div className="bg-gray-800/50 rounded p-1.5">
            <div className="text-[9px] text-gray-500">R:R</div>
            <div className="text-white font-mono text-[11px]">{rec.targets.riskRewardRatio}x</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Terminal() {
  const [query, setQuery] = useState('')
  const [screenData, setScreenData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedStock, setSelectedStock] = useState(null)
  const [tickerData, setTickerData] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
    runQuery('top 5 tech')
  }, [])

  const runQuery = async (q) => {
    const text = (q || query).trim()
    if (!text) return
    setQuery('')
    setLoading(true)
    setSelectedStock(null)

    try {
      const res = await fetch(`${API}/terminal/query?q=${encodeURIComponent(text)}`)
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const data = await res.json()
      setScreenData(data)
      setTickerData({ query: text, ...data })
    } catch (e) {
      setScreenData({ error: e.message })
    } finally {
      setLoading(false)
    }
  }

  const sectors = ['Tech', 'Healthcare', 'Finance', 'Energy', 'Industrial', 'Consumer']
  const regions = ['US', 'Canada']

  return (
    <div className="bg-[#0a0e17] rounded-xl border border-gray-800 overflow-hidden" style={{ minHeight: '650px' }}>
      {/* Top Bar */}
      <div className="bg-[#0f1520] border-b border-gray-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-orange-400 font-bold text-sm font-mono">PATEL ANALYSIS</span>
          <span className="text-gray-600 text-xs">|</span>
          <span className="text-gray-400 text-xs">TERMINAL</span>
        </div>
        <div className="flex items-center gap-4 text-[10px] text-gray-500">
          <span>LIVE</span>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Market Ticker Strip */}
      {tickerData?.results && (
        <div className="bg-[#0c1018] border-b border-gray-800 px-2 py-1.5">
          <MarketTicker data={tickerData} />
        </div>
      )}

      <div className="flex h-[580px]">
        {/* Left Panel - Screener */}
        <div className="flex-1 flex flex-col border-r border-gray-800">
          {/* Command Bar */}
          <div className="border-b border-gray-800 px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="text-orange-400 font-mono text-xs">{'>'}</span>
              <input
                ref={inputRef}
                className="flex-1 bg-transparent text-white text-xs font-mono placeholder-gray-600 focus:outline-none"
                placeholder="SEARCH (e.g. top 5 tech, dividend US, low risk 10% return)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runQuery()}
              />
              <button
                onClick={() => runQuery()}
                disabled={loading}
                className="text-[10px] text-orange-400 border border-orange-400/30 px-2 py-0.5 rounded font-mono hover:bg-orange-400/10 transition disabled:opacity-40"
              >
                GO
              </button>
            </div>
          </div>

          {/* Sector / Region Tabs */}
          <div className="border-b border-gray-800 px-3 py-1.5 flex items-center gap-1 overflow-x-auto">
            {sectors.map((s) => (
              <button
                key={s}
                onClick={() => runQuery(`top 5 ${s.toLowerCase()}`)}
                className="px-2 py-1 text-[10px] font-mono text-gray-400 hover:text-orange-400 hover:bg-orange-400/5 rounded transition whitespace-nowrap"
              >
                {s.toUpperCase()}
              </button>
            ))}
            <span className="text-gray-700 mx-1">|</span>
            {regions.map((r) => (
              <button
                key={r}
                onClick={() => runQuery(`top 5 ${r.toLowerCase() === 'us' ? 'tech' : r.toLowerCase()}`)}
                className="px-2 py-1 text-[10px] font-mono text-gray-400 hover:text-orange-400 hover:bg-orange-400/5 rounded transition whitespace-nowrap"
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Results Table */}
          <div className="flex-1 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-gray-500 text-[10px] mt-2 font-mono">LOADING...</p>
                </div>
              </div>
            )}

            {!loading && screenData?.results && (
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-[#0a0e17]">
                  <tr className="text-[10px] text-gray-500 uppercase font-mono">
                    <th className="text-left py-2 px-3">Sym</th>
                    <th className="text-left py-2 px-3">Name</th>
                    <th className="text-right py-2 px-3">Last</th>
                    <th className="text-right py-2 px-3">Chg%</th>
                    <th className="text-right py-2 px-3">MCap</th>
                    <th className="text-right py-2 px-3">Yield</th>
                    <th className="text-right py-2 px-3">1Y</th>
                    <th className="text-center py-2 px-3">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {screenData.results.map((stock) => (
                    <StockRow key={stock.ticker} stock={stock} onSelect={setSelectedStock} isSelected={selectedStock === stock.ticker} />
                  ))}
                </tbody>
              </table>
            )}

            {!loading && screenData?.error && (
              <div className="p-4 text-red-400 text-xs font-mono">{screenData.error}</div>
            )}

            {!loading && screenData?.message && (
              <div className="p-4">
                <p className="text-yellow-400 text-xs mb-2 font-mono">{screenData.message}</p>
                <div className="grid grid-cols-2 gap-1">
                  {screenData.examples?.map(ex => (
                    <button key={ex} onClick={() => runQuery(ex)} className="text-left text-[10px] text-gray-500 hover:text-orange-400 font-mono transition">→ {ex}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Stock Detail */}
        <div className="w-[320px] flex flex-col bg-[#0c1018]">
          <div className="border-b border-gray-800 px-3 py-2">
            <span className="text-[10px] text-gray-500 font-mono uppercase">Analysis & AI Advisory</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            {selectedStock ? (
              <StockDetail ticker={selectedStock} />
            ) : (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <div className="text-gray-700 text-2xl mb-2">◎</div>
                  <p className="text-gray-600 text-[10px] font-mono">CLICK A STOCK</p>
                  <p className="text-gray-700 text-[10px] font-mono">FOR AI ANALYSIS</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-[#0f1520] border-t border-gray-800 px-4 py-1.5 flex items-center justify-between text-[10px] text-gray-500 font-mono">
        <span>FINNHUB LIVE DATA • {screenData?.results?.length || 0} RESULTS</span>
        <span>SECTORS | GLOBAL | AI ADVISORY</span>
      </div>
    </div>
  )
}
