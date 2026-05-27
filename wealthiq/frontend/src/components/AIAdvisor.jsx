import { useState } from 'react'

const API = 'http://localhost:8000'

const PROFILES = [
  { id: 'conservative', label: 'Conservative', icon: '🛡️', desc: 'Low risk, stable returns' },
  { id: 'moderate', label: 'Moderate', icon: '⚖️', desc: 'Balanced growth & safety' },
  { id: 'aggressive', label: 'Aggressive', icon: '🚀', desc: 'High growth, higher risk' },
]

function ActionBadge({ action, size = 'md' }) {
  const colors = {
    BUY: 'bg-emerald-500 text-white',
    SELL: 'bg-red-500 text-white',
    HOLD: 'bg-amber-500 text-white',
  }
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-lg px-4 py-2 font-bold',
  }
  return (
    <span className={`${colors[action] || 'bg-gray-500 text-white'} ${sizes[size]} rounded-full font-semibold`}>
      {action === 'BUY' ? '🟢' : action === 'SELL' ? '🔴' : '🟡'} {action}
    </span>
  )
}

function ConfidenceMeter({ confidence }) {
  const color = confidence > 70 ? 'bg-emerald-500' : confidence > 50 ? 'bg-amber-500' : 'bg-gray-400'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${confidence}%` }} />
      </div>
      <span className="text-sm font-bold text-navy">{confidence}%</span>
    </div>
  )
}

function SignalRow({ signal }) {
  const icon = signal.action === 'BUY' ? '↑' : signal.action === 'SELL' ? '↓' : '→'
  const color = signal.action === 'BUY' ? 'text-emerald-600' : signal.action === 'SELL' ? 'text-red-600' : 'text-amber-600'
  return (
    <div className="flex items-start gap-2 py-1.5 border-b border-gray-50 last:border-0">
      <span className={`${color} font-bold text-sm w-5`}>{icon}</span>
      <span className="text-xs text-gray-600 flex-1">{signal.reason}</span>
      <span className="text-xs text-gray-400">{signal.strength}%</span>
    </div>
  )
}

export default function AIAdvisor() {
  const [ticker, setTicker] = useState('')
  const [profile, setProfile] = useState('moderate')
  const [loading, setLoading] = useState(false)
  const [rec, setRec] = useState(null)
  const [error, setError] = useState('')

  const getAdvice = async (t) => {
    const sym = (t || ticker).trim().toUpperCase()
    if (!sym) return
    setTicker(sym)
    setLoading(true)
    setError('')
    setRec(null)

    try {
      const res = await fetch(`${API}/advisor/${sym}?profile=${profile}`)
      if (!res.ok) throw new Error('Failed to get recommendation')
      setRec(await res.json())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy to-blue-700 rounded-xl p-5 text-white">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">🤖</span>
          <h2 className="text-xl font-bold">AI Advisor</h2>
        </div>
        <p className="text-blue-200 text-sm">Intelligent buy/sell/hold recommendations powered by multi-signal analysis</p>
      </div>

      {/* Investor Profile Selector */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Your Investor Profile</p>
        <div className="grid grid-cols-3 gap-2">
          {PROFILES.map((p) => (
            <button
              key={p.id}
              onClick={() => setProfile(p.id)}
              className={`p-3 rounded-lg border-2 text-left transition ${
                profile === p.id
                  ? 'border-navy bg-navy/5'
                  : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <span className="text-lg">{p.icon}</span>
              <p className="text-sm font-semibold text-navy mt-1">{p.label}</p>
              <p className="text-[10px] text-gray-500">{p.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <input
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-navy focus:outline-none"
          placeholder="Enter ticker for AI analysis (e.g. AAPL)"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && getAdvice()}
        />
        <button
          onClick={() => getAdvice()}
          disabled={loading}
          className="px-5 py-2.5 bg-navy text-white rounded-lg font-medium text-sm hover:bg-opacity-90 transition disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : '🤖 Get AI Advice'}
        </button>
      </div>

      {/* Quick picks */}
      <div className="flex flex-wrap gap-2">
        {['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN', 'JPM', 'JNJ', 'VTI'].map((t) => (
          <button
            key={t}
            onClick={() => { setTicker(t); getAdvice(t) }}
            className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full text-xs font-medium text-gray-700 hover:bg-navy hover:text-white transition"
          >
            {t}
          </button>
        ))}
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">{error}</div>}

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-4 border-navy border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 mt-2 text-sm">AI analyzing {ticker}...</p>
        </div>
      )}

      {/* Recommendation Result */}
      {rec && !loading && (
        <div className="space-y-4">
          {/* Main Action Card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-navy text-lg">{rec.ticker}</h3>
                <p className="text-sm text-gray-500">{rec.name} • ${rec.price?.toFixed(2)}</p>
              </div>
              <ActionBadge action={rec.action} size="lg" />
            </div>

            <p className="text-sm text-gray-700 mb-3">{rec.summary}</p>

            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">AI Confidence</p>
              <ConfidenceMeter confidence={rec.confidence} />
            </div>

            <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3 leading-relaxed">{rec.reasoning}</p>
          </div>

          {/* Price Targets */}
          {rec.targets && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h4 className="font-semibold text-navy text-sm mb-3">📊 Price Targets</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <p className="text-[10px] text-gray-500 uppercase">Entry</p>
                  <p className="font-bold text-navy">${rec.targets.entry}</p>
                </div>
                <div className="text-center p-2 bg-red-50 rounded-lg">
                  <p className="text-[10px] text-gray-500 uppercase">Stop Loss</p>
                  <p className="font-bold text-red">${rec.targets.stopLoss}</p>
                </div>
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <p className="text-[10px] text-gray-500 uppercase">Target 1</p>
                  <p className="font-bold text-teal">${rec.targets.target1}</p>
                </div>
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <p className="text-[10px] text-gray-500 uppercase">Target 2</p>
                  <p className="font-bold text-teal">${rec.targets.target2}</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-[10px] text-gray-500 uppercase">R:R Ratio</p>
                  <p className="font-bold text-navy">{rec.targets.riskRewardRatio}x</p>
                </div>
              </div>
            </div>
          )}

          {/* Signal Breakdown */}
          {rec.signals?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h4 className="font-semibold text-navy text-sm mb-3">🔍 Signal Breakdown</h4>
              <div className="divide-y divide-gray-50">
                {rec.signals.map((s, i) => (
                  <SignalRow key={i} signal={s} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
