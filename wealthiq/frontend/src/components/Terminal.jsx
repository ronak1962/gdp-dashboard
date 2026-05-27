import { useState, useRef, useEffect } from 'react'

const API = 'http://localhost:8000'

const CATEGORIES = [
  {
    title: 'Sectors',
    queries: [
      { label: 'Tech', query: 'top 5 tech' },
      { label: 'Healthcare', query: 'top 5 healthcare' },
      { label: 'Finance', query: 'top 5 finance' },
      { label: 'Energy', query: 'top 5 energy' },
      { label: 'Industrial', query: 'top 5 industrial' },
      { label: 'Consumer', query: 'top 5 consumer' },
    ],
  },
  {
    title: 'Themes',
    queries: [
      { label: 'AI', query: 'top 5 ai' },
      { label: 'Semiconductors', query: 'top 5 semiconductors' },
      { label: 'Cloud/SaaS', query: 'top 5 cloud' },
      { label: 'Cybersecurity', query: 'top 5 cybersecurity' },
      { label: 'Biotech', query: 'top 5 biotech' },
      { label: 'Fintech', query: 'top 5 fintech' },
      { label: 'EV', query: 'top 5 ev' },
      { label: 'Crypto', query: 'top 5 crypto' },
      { label: 'Clean Energy', query: 'top 5 clean energy' },
      { label: 'Gaming', query: 'top 5 gaming' },
      { label: 'REITs', query: 'top 5 reits' },
    ],
  },
  {
    title: 'Global',
    queries: [
      { label: '🇺🇸 US', query: 'top 5 tech' },
      { label: '🇨🇦 Canada', query: 'top 5 canada' },
    ],
  },
  {
    title: 'Income',
    queries: [
      { label: 'Dividend US', query: 'top 10 dividend US' },
      { label: 'Dividend CA', query: 'top 10 dividend canadian' },
      { label: 'Aristocrats', query: 'top 10 dividend aristocrats' },
      { label: 'Income ETF', query: 'top 10 income etf' },
      { label: 'Bond ETF', query: 'top 10 bond etf' },
    ],
  },
  {
    title: 'Strategy',
    queries: [
      { label: 'Growth ETF', query: 'top 10 growth etf' },
      { label: 'Low Risk 10%', query: 'low risk 10% return' },
      { label: 'Small Cap', query: 'top 5 smallcap' },
    ],
  },
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
  if (!results.length) return <p className="text-gray-400 text-sm py-4">No results found.</p>

  const hasDividend = results.some(r => r.dividendYield)
  const hasReturn = results.some(r => r.return1Y != null)

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-800">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-gray-800/50 text-gray-400 uppercase">
            <th className="text-left py-2.5 px-3">#</th>
            <th className="text-left py-2.5 px-3">Ticker</th>
            <th className="text-left py-2.5 px-3">Name</th>
            <th className="text-right py-2.5 px-3">Price</th>
            <th className="text-right py-2.5 px-3">Change</th>
            <th className="text-right py-2.5 px-3">Mkt Cap</th>
            {hasDividend && <th className="text-right py-2.5 px-3">Yield</th>}
            {hasReturn && <th className="text-right py-2.5 px-3">1Y Ret</th>}
            <th className="text-center py-2.5 px-3">Risk</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={r.ticker} className="border-t border-gray-800/50 hover:bg-gray-800/30">
              <td className="py-2.5 px-3 text-gray-500">{i + 1}</td>
              <td className="py-2.5 px-3 font-bold text-cyan-400">{r.ticker}</td>
              <td className="py-2.5 px-3 text-gray-300 truncate max-w-[140px]">{r.name}</td>
              <td className="py-2.5 px-3 text-right font-mono text-white">${r.price?.toFixed(2)}</td>
              <td className={`py-2.5 px-3 text-right font-mono ${r.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {r.change >= 0 ? '+' : ''}{r.change?.toFixed(2)}%
              </td>
              <td className="py-2.5 px-3 text-right text-gray-300">
                {r.marketCap ? `$${(r.marketCap / 1000).toFixed(0)}B` : '—'}
              </td>
              {hasDividend && (
                <td className="py-2.5 px-3 text-right text-amber-400 font-mono">
                  {r.dividendYield ? `${r.dividendYield.toFixed(2)}%` : '—'}
                </td>
              )}
              {hasReturn && (
                <td className={`py-2.5 px-3 text-right font-mono ${(r.return1Y || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {r.return1Y != null ? `${r.return1Y.toFixed(1)}%` : '—'}
                </td>
              )}
              <td className="py-2.5 px-3 text-center">
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
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeQuery, setActiveQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const runQuery = async (q) => {
    const text = (q || query).trim()
    if (!text) return
    setQuery('')
    setActiveQuery(text)
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch(`${API}/terminal/query?q=${encodeURIComponent(text)}`)
      if (!res.ok) throw new Error(`Error: ${res.status}`)
      setResult(await res.json())
    } catch (e) {
      setResult({ error: e.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
        <div className="flex items-center gap-3">
          <div className="text-emerald-400 text-lg">$</div>
          <input
            ref={inputRef}
            className="flex-1 bg-transparent text-white text-sm font-mono placeholder-gray-500 focus:outline-none"
            placeholder="Search... (e.g. top 5 tech, dividend US, low risk 10% return)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runQuery()}
          />
          <button
            onClick={() => runQuery()}
            disabled={loading || !query.trim()}
            className="px-4 py-2 bg-cyan-600 text-white text-xs font-semibold rounded-lg hover:bg-cyan-500 transition disabled:opacity-40"
          >
            Search
          </button>
        </div>
      </div>

      {/* Category Buttons */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
        {CATEGORIES.map((cat) => (
          <div key={cat.title}>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1.5">{cat.title}</p>
            <div className="flex flex-wrap gap-1.5">
              {cat.queries.map((q) => (
                <button
                  key={q.query}
                  onClick={() => runQuery(q.query)}
                  disabled={loading}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition border
                    ${activeQuery === q.query
                      ? 'bg-navy text-white border-navy'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-navy hover:text-white hover:border-navy'
                    } disabled:opacity-40`}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-gray-900 rounded-xl p-8 border border-gray-700 text-center">
          <div className="inline-block w-6 h-6 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm mt-3">Fetching live data for: <span className="text-cyan-400 font-mono">{activeQuery}</span></p>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
          {result.error ? (
            <p className="text-red-400 text-sm">{result.error}</p>
          ) : result.results ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-400 text-xs font-mono">
                  {result.sector && <span className="text-cyan-400">{result.sector.toUpperCase()}</span>}
                  {result.country && <span className="text-cyan-400">{result.country}</span>}
                  {result.minReturn != null && <span className="text-cyan-400">Low Risk ≥{result.minReturn}% Return</span>}
                  {' • '}{result.results.length} results
                </p>
              </div>
              <ResultTable data={result} />
            </div>
          ) : result.message ? (
            <div className="text-gray-400 text-sm">
              <p className="text-amber-400 mb-2">{result.message}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
                {result.examples?.map(ex => (
                  <button
                    key={ex}
                    onClick={() => runQuery(ex)}
                    className="text-left text-xs text-gray-500 hover:text-cyan-400 font-mono transition"
                  >
                    → {ex}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Empty State */}
      {!result && !loading && (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 text-center">
          <p className="text-gray-500 text-sm">Click a category above or type a query to get started</p>
        </div>
      )}
    </div>
  )
}
