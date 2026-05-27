import { useState, useRef, useEffect } from 'react'

const API = 'http://localhost:8000'

const QUICK_QUERIES = [
  { label: 'Top 5 Tech', query: 'top 5 tech' },
  { label: 'Top 5 Healthcare', query: 'top 5 healthcare' },
  { label: 'Top 5 Finance', query: 'top 5 finance' },
  { label: 'Top 5 Energy', query: 'top 5 energy' },
  { label: 'Highest Dividend US', query: 'top 10 dividend US' },
  { label: 'Highest Dividend Canadian', query: 'top 10 dividend canadian' },
  { label: 'Low Risk 10% Return', query: 'low risk 10% return' },
  { label: 'Top 10 ETFs', query: 'top 10 etf' },
]

function RiskPill({ level }) {
  const color = level === 'Low' ? 'bg-emerald-500' : level === 'Medium' ? 'bg-amber-500' : 'bg-red-500'
  return (
    <span className={`${color} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>
      {level}
    </span>
  )
}

function ResultTable({ data }) {
  const results = data?.results || []
  if (!results.length) return <p className="text-gray-400 text-sm py-4">No results found matching criteria.</p>

  const hasDividend = results.some(r => r.dividendYield)
  const hasReturn = results.some(r => r.return1Y != null)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-gray-400 uppercase border-b border-gray-700">
            <th className="text-left py-2 px-2">#</th>
            <th className="text-left py-2 px-2">Ticker</th>
            <th className="text-left py-2 px-2">Name</th>
            <th className="text-right py-2 px-2">Price</th>
            <th className="text-right py-2 px-2">Chg%</th>
            <th className="text-right py-2 px-2">Mkt Cap</th>
            {hasDividend && <th className="text-right py-2 px-2">Div Yield</th>}
            {hasReturn && <th className="text-right py-2 px-2">1Y Return</th>}
            <th className="text-right py-2 px-2">Beta</th>
            <th className="text-center py-2 px-2">Risk</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={r.ticker} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
              <td className="py-2 px-2 text-gray-500">{i + 1}</td>
              <td className="py-2 px-2 font-bold text-cyan-400">{r.ticker}</td>
              <td className="py-2 px-2 text-gray-300 truncate max-w-[160px]">{r.name}</td>
              <td className="py-2 px-2 text-right font-mono text-white">${r.price?.toFixed(2)}</td>
              <td className={`py-2 px-2 text-right font-mono ${r.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {r.change >= 0 ? '+' : ''}{r.change?.toFixed(2)}%
              </td>
              <td className="py-2 px-2 text-right text-gray-300">
                {r.marketCap ? `$${(r.marketCap / 1000).toFixed(0)}B` : '—'}
              </td>
              {hasDividend && (
                <td className="py-2 px-2 text-right text-amber-400 font-mono">
                  {r.dividendYield ? `${r.dividendYield.toFixed(2)}%` : '—'}
                </td>
              )}
              {hasReturn && (
                <td className={`py-2 px-2 text-right font-mono ${(r.return1Y || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {r.return1Y != null ? `${r.return1Y.toFixed(1)}%` : '—'}
                </td>
              )}
              <td className="py-2 px-2 text-right text-gray-300 font-mono">
                {r.beta ? r.beta.toFixed(2) : '—'}
              </td>
              <td className="py-2 px-2 text-center">
                <RiskPill level={r.riskLevel} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Terminal() {
  const [query, setQuery] = useState('')
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const runQuery = async (q) => {
    const text = (q || query).trim()
    if (!text) return
    setQuery('')
    setLoading(true)

    const entry = { query: text, time: new Date().toLocaleTimeString(), data: null, error: null }
    setHistory(h => [...h, entry])

    try {
      const res = await fetch(`${API}/terminal/query?q=${encodeURIComponent(text)}`)
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      const json = await res.json()
      setHistory(h => {
        const updated = [...h]
        updated[updated.length - 1] = { ...entry, data: json }
        return updated
      })
    } catch (e) {
      setHistory(h => {
        const updated = [...h]
        updated[updated.length - 1] = { ...entry, error: e.message }
        return updated
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden flex flex-col" style={{ minHeight: '600px' }}>
      {/* Terminal Header */}
      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
        </div>
        <span className="text-gray-300 text-sm font-mono">WealthIQ Terminal</span>
        <span className="text-gray-500 text-xs ml-auto">Live Market Data • Finnhub</span>
      </div>

      {/* Quick Query Buttons */}
      <div className="px-4 py-3 border-b border-gray-800 flex flex-wrap gap-2">
        {QUICK_QUERIES.map((q) => (
          <button
            key={q.query}
            onClick={() => runQuery(q.query)}
            disabled={loading}
            className="px-3 py-1.5 bg-gray-800 border border-gray-600 rounded-md text-xs font-medium text-cyan-400 hover:bg-gray-700 hover:border-cyan-500 transition disabled:opacity-50"
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Output Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 max-h-[500px]">
        {history.length === 0 && (
          <div className="text-gray-500 text-sm space-y-2 py-8">
            <p className="text-cyan-400 font-mono text-base">Welcome to WealthIQ Terminal</p>
            <p>Your mini Bloomberg for retail advisors. Ask questions like:</p>
            <ul className="space-y-1 text-gray-400 font-mono text-xs ml-4">
              <li>{'\u2192 "top 5 tech" \u2014 Top 5 tech companies by market cap'}</li>
              <li>{'\u2192 "top 5 healthcare" \u2014 Top 5 healthcare companies'}</li>
              <li>{'\u2192 "top 10 dividend US" \u2014 Highest dividend yield (US)'}</li>
              <li>{'\u2192 "top 10 dividend canadian" \u2014 Highest Canadian dividends'}</li>
              <li>{'\u2192 "low risk 10% return" \u2014 Low-risk stocks with 10%+ annual return'}</li>
              <li>{'\u2192 "top 5 energy" \u2014 Top energy sector stocks'}</li>
              <li>{'\u2192 "top 10 etf" \u2014 Top ETFs by market cap'}</li>
            </ul>
          </div>
        )}

        {history.map((entry, i) => (
          <div key={i} className="space-y-2">
            {/* Query line */}
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-mono text-xs">$</span>
              <span className="text-white font-mono text-sm">{entry.query}</span>
              <span className="text-gray-600 text-xs ml-auto">{entry.time}</span>
            </div>

            {/* Result */}
            {entry.error && (
              <div className="text-red-400 text-xs font-mono pl-4">{entry.error}</div>
            )}
            {entry.data && entry.data.results && (
              <div className="pl-2">
                <div className="text-gray-400 text-xs mb-2 font-mono">
                  {entry.data.sector && `Sector: ${entry.data.sector.toUpperCase()} • `}
                  {entry.data.country && `Country: ${entry.data.country} • `}
                  {entry.data.minReturn != null && `Min Return: ${entry.data.minReturn}% • Max Risk: ${entry.data.maxRisk} • `}
                  Found: {entry.data.results.length} results
                </div>
                <ResultTable data={entry.data} />
              </div>
            )}
            {entry.data && entry.data.message && (
              <div className="text-amber-400 text-xs font-mono pl-4">
                {entry.data.message}
                <ul className="mt-1 space-y-0.5 text-gray-400">
                  {entry.data.examples?.map(ex => <li key={ex}>→ {ex}</li>)}
                </ul>
              </div>
            )}
            {entry.data === null && !entry.error && (
              <div className="text-gray-500 text-xs font-mono pl-4 animate-pulse">Processing...</div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div className="border-t border-gray-700 px-4 py-3 bg-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-mono text-sm">$</span>
          <input
            className="flex-1 bg-transparent text-white font-mono text-sm placeholder-gray-500 focus:outline-none"
            placeholder="Type your query... (e.g. top 5 tech, highest dividend canadian)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runQuery()}
            disabled={loading}
          />
          {loading && (
            <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          )}
          <button
            onClick={() => runQuery()}
            disabled={loading || !query.trim()}
            className="px-3 py-1 bg-cyan-600 text-white text-xs font-medium rounded hover:bg-cyan-500 transition disabled:opacity-50"
          >
            Run
          </button>
        </div>
      </div>
    </div>
  )
}
