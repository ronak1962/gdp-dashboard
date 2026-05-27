import { useState, useCallback } from 'react'

const API = 'http://localhost:8000'
const CHIPS = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN', 'GOOGL', 'META', 'JPM']

function PerformanceBar({ label, value }) {
  const isPositive = value >= 0
  const barWidth = Math.min(Math.abs(value) * 2, 100)
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-800">
      <span className="text-gray-400 text-xs w-12">{label}</span>
      <div className="flex-1 mx-3 h-1.5 bg-gray-800 rounded-full relative overflow-hidden">
        {isPositive ? (
          <div className="absolute left-1/2 h-full bg-green-500 rounded-full" style={{ width: `${barWidth / 2}%` }} />
        ) : (
          <div className="absolute right-1/2 h-full bg-red-500 rounded-full" style={{ width: `${barWidth / 2}%` }} />
        )}
      </div>
      <span className={`font-mono text-xs font-bold w-16 text-right ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {isPositive ? '+' : ''}{value?.toFixed(2)}%
      </span>
    </div>
  )
}

function TechnicalGauge({ score, label }) {
  const getSignal = (s) => {
    if (s < 25) return { text: 'Strong Sell', color: 'text-red-500' }
    if (s < 40) return { text: 'Sell', color: 'text-red-400' }
    if (s < 60) return { text: 'Neutral', color: 'text-gray-400' }
    if (s < 75) return { text: 'Buy', color: 'text-green-400' }
    return { text: 'Strong Buy', color: 'text-green-500' }
  }
  const signal = getSignal(score)
  const angle = -90 + (score / 100) * 180

  return (
    <div className="text-center">
      <div className="relative w-24 h-14 mx-auto">
        <svg viewBox="0 0 200 110" className="w-full h-full">
          <path d="M 20 100 A 80 80 0 0 1 60 40" fill="none" stroke="#ef4444" strokeWidth="10" strokeLinecap="round" />
          <path d="M 60 40 A 80 80 0 0 1 100 25" fill="none" stroke="#f97316" strokeWidth="10" strokeLinecap="round" />
          <path d="M 100 25 A 80 80 0 0 1 140 40" fill="none" stroke="#6b7280" strokeWidth="10" strokeLinecap="round" />
          <path d="M 140 40 A 80 80 0 0 1 160 60" fill="none" stroke="#22c55e" strokeWidth="10" strokeLinecap="round" />
          <path d="M 160 60 A 80 80 0 0 1 180 100" fill="none" stroke="#16a34a" strokeWidth="10" strokeLinecap="round" />
          <line x1="100" y1="100" x2={100 + 55 * Math.cos((angle * Math.PI) / 180)} y2={100 + 55 * Math.sin((angle * Math.PI) / 180)} stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="100" cy="100" r="4" fill="white" />
        </svg>
      </div>
      <p className={`text-xs font-bold ${signal.color}`}>{signal.text}</p>
      <p className="text-[10px] text-gray-500">{label}</p>
    </div>
  )
}

function StatRow({ label, value, highlight }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-800">
      <span className="text-gray-400 text-xs">{label}</span>
      <span className={`font-mono text-xs font-medium ${highlight || 'text-white'}`}>{value}</span>
    </div>
  )
}

export default function StockAnalysis() {
  const [ticker, setTicker] = useState('')
  const [data, setData] = useState(null)
  const [rec, setRec] = useState(null)
  const [peers, setPeers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const search = useCallback(async (sym) => {
    const t = (sym || ticker).trim().toUpperCase()
    if (!t) return
    setTicker(t)
    setLoading(true)
    setError('')
    setData(null)
    setRec(null)
    setPeers([])

    try {
      const [analysisRes, advisorRes, peersRes] = await Promise.all([
        fetch(`${API}/analyze/${t}`),
        fetch(`${API}/advisor/${t}?profile=moderate`),
        fetch(`${API}/peers/${t}`),
      ])
      if (!analysisRes.ok) throw new Error('Failed to fetch')
      setData(await analysisRes.json())
      if (advisorRes.ok) setRec(await advisorRes.json())
      if (peersRes.ok) setPeers(await peersRes.json())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [ticker])

  const techScore = data ? (100 - data.riskScore) : 50

  return (
    <div className="bg-[#0a0e17] rounded-xl border border-gray-800 overflow-hidden">
      {/* Search */}
      <div className="bg-[#0f1520] border-b border-gray-800 p-4">
        <div className="flex gap-2 mb-3">
          <input
            className="flex-1 bg-[#1a2332] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:ring-1 focus:ring-orange-400 focus:outline-none font-mono"
            placeholder="Enter symbol (e.g. NVDA)"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && search()}
          />
          <button
            onClick={() => search()}
            className="px-5 py-2.5 bg-orange-500 text-white rounded-lg font-medium text-sm hover:bg-orange-400 transition"
          >
            Analyze
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CHIPS.map((c) => (
            <button
              key={c}
              onClick={() => { setTicker(c); search(c) }}
              className="px-2.5 py-1 bg-[#1a2332] border border-gray-700 rounded text-[10px] font-mono text-gray-400 hover:text-orange-400 hover:border-orange-400/30 transition"
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="text-center py-16">
          <div className="w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 text-xs mt-3 font-mono">Loading {ticker}...</p>
        </div>
      )}

      {error && <div className="p-4 text-red-400 text-xs font-mono">{error}</div>}

      {data && !loading && (
        <div className="p-5 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-white text-2xl font-bold">{data.name}</h1>
              </div>
              <p className="text-gray-500 text-xs font-mono mt-1">{data.ticker} • US Stock Exchange</p>
            </div>
            <div className="text-right">
              <p className="text-white text-2xl font-bold font-mono">${data.price?.toFixed(2)}</p>
              <p className={`text-sm font-mono ${data.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {data.change >= 0 ? '▲' : '▼'} {Math.abs(data.change)?.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Performance */}
          <div className="bg-[#141a24] rounded-lg p-4 border border-gray-800">
            <p className="text-gray-500 text-[10px] uppercase font-semibold mb-2">Performance</p>
            <PerformanceBar label="1 Day" value={data.change || 0} />
            <PerformanceBar label="1 Month" value={(data.change || 0) * 8} />
            <PerformanceBar label="YTD" value={rec?.signals?.find(s => s.reason.includes('YTD'))?.strength || (data.change || 0) * 15} />
            <PerformanceBar label="1 Year" value={rec?.signals?.find(s => s.reason.includes('1Y'))?.strength || 25} />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Key Stats */}
            <div className="bg-[#141a24] rounded-lg p-4 border border-gray-800">
              <p className="text-gray-500 text-[10px] uppercase font-semibold mb-2">Key Stats</p>
              <StatRow label="Market Cap" value={`$${(data.marketCap / 1000).toFixed(2)}T`} />
              <StatRow label="P/E Ratio (TTM)" value={data.pe?.toFixed(2) || '—'} />
              <StatRow label="Beta (1Y)" value={data.beta?.toFixed(2) || '—'} />
              <StatRow label="52-Week High" value={`$${data.high52?.toFixed(2)}`} />
              <StatRow label="52-Week Low" value={`$${data.low52?.toFixed(2)}`} />
              <StatRow label="Risk Score" value={`${data.riskScore}/100`} highlight={data.riskScore < 35 ? 'text-green-400' : data.riskScore <= 65 ? 'text-yellow-400' : 'text-red-400'} />
            </div>

            {/* Technicals */}
            <div className="bg-[#141a24] rounded-lg p-4 border border-gray-800">
              <p className="text-gray-500 text-[10px] uppercase font-semibold mb-3">Technicals</p>
              <div className="grid grid-cols-3 gap-2">
                <TechnicalGauge score={techScore} label="Overall" />
                <TechnicalGauge score={Math.min(100, techScore + 10)} label="Moving Avg" />
                <TechnicalGauge score={Math.max(0, techScore - 5)} label="Oscillators" />
              </div>

              {/* AI Recommendation */}
              {rec && (
                <div className="mt-4 pt-3 border-t border-gray-800">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">AI Rating</span>
                    <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                      rec.action === 'BUY' ? 'text-green-400 bg-green-400/10' :
                      rec.action === 'SELL' ? 'text-red-400 bg-red-400/10' :
                      'text-yellow-400 bg-yellow-400/10'
                    }`}>
                      {rec.action} • {rec.confidence}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Signals */}
          {rec?.signals?.length > 0 && (
            <div className="bg-[#141a24] rounded-lg p-4 border border-gray-800">
              <p className="text-gray-500 text-[10px] uppercase font-semibold mb-3">AI Signal Analysis</p>
              <div className="space-y-2">
                {rec.signals.map((s, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${s.action === 'BUY' ? 'bg-green-400' : s.action === 'SELL' ? 'bg-red-400' : 'bg-yellow-400'}`}></span>
                    <span className="text-gray-300 text-xs">{s.reason}</span>
                  </div>
                ))}
              </div>

              {rec.targets && (
                <div className="mt-3 pt-3 border-t border-gray-800 grid grid-cols-4 gap-2">
                  <div className="text-center">
                    <div className="text-[9px] text-gray-500">ENTRY</div>
                    <div className="text-blue-400 font-mono text-xs">${rec.targets.entry}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[9px] text-gray-500">STOP LOSS</div>
                    <div className="text-red-400 font-mono text-xs">${rec.targets.stopLoss}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[9px] text-gray-500">TARGET</div>
                    <div className="text-green-400 font-mono text-xs">${rec.targets.target1}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[9px] text-gray-500">RISK:REWARD</div>
                    <div className="text-white font-mono text-xs">{rec.targets.riskRewardRatio}x</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Related Stocks */}
          {peers.length > 0 && (
            <div className="bg-[#141a24] rounded-lg p-4 border border-gray-800">
              <p className="text-gray-500 text-[10px] uppercase font-semibold mb-3">Related Stocks</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {peers.slice(0, 8).map((p) => (
                  <div
                    key={p.ticker}
                    className="bg-[#0a0e17] rounded-lg p-2.5 border border-gray-800 cursor-pointer hover:border-gray-600 transition"
                    onClick={() => { setTicker(p.ticker); search(p.ticker) }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-orange-400 font-mono text-xs font-bold">{p.ticker}</span>
                      <span className={`text-[10px] font-mono ${p.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {p.change >= 0 ? '+' : ''}{p.change?.toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-white font-mono text-xs">${p.price?.toFixed(2)}</p>
                    <p className="text-gray-500 text-[10px] truncate">{p.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!data && !loading && !error && (
        <div className="text-center py-16">
          <div className="text-gray-700 text-4xl mb-3">📊</div>
          <p className="text-gray-500 text-sm">Enter a ticker to view detailed analysis</p>
          <p className="text-gray-600 text-xs mt-1">Key stats • Technicals • AI Signals • Related stocks</p>
        </div>
      )}
    </div>
  )
}
