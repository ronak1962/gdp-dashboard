import { Panel, colorFor } from './ui'
import { MOCK_CATALYSTS, MOCK_SCENARIOS } from '../mockData'

export function ScenarioStudio({ ticker }) {
  const scenarios = MOCK_SCENARIOS(ticker)
  const colors = { Bull: 'border-emerald-500/40 bg-emerald-500/5', Base: 'border-cyan-500/40 bg-cyan-500/5', Bear: 'border-red-500/40 bg-red-500/5' }
  return (
    <Panel title="Scenario Studio" subtitle="AI probabilities">
      <div className="grid grid-cols-3 gap-2">
        {scenarios.map((sc) => (
          <div key={sc.case} className={`rounded-lg border p-3 ${colors[sc.case] || ''}`}>
            <p className="text-xs font-bold text-white">{sc.case} Case</p>
            <p className="text-lg font-mono text-emerald-400 mt-1">{sc.move}</p>
            <p className="text-[10px] text-slate-400 mt-1">{sc.range}</p>
            <p className="text-[10px] text-cyan-400 mt-2">{sc.prob}% prob</p>
          </div>
        ))}
      </div>
    </Panel>
  )
}

export function CapitalMix({ stocks }) {
  const total = stocks.length || 1
  const pct = Math.floor(100 / total)
  const remainder = 100 - pct * (total - 1)
  return (
    <Panel title="Capital Allocation Mix">
      <div className="flex items-center gap-4">
        <svg viewBox="0 0 100 100" className="w-24 h-24 shrink-0">
          {stocks.map((s, i) => {
            const slice = i === stocks.length - 1 ? remainder : pct
            const offset = stocks.slice(0, i).reduce((acc) => acc + (i === stocks.length - 1 ? remainder : pct), 0)
            return (
              <circle
                key={s.ticker}
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={colorFor(s.ticker)}
                strokeWidth="12"
                strokeDasharray={`${slice * 2.51} 251`}
                strokeDashoffset={-offset * 2.51}
                transform="rotate(-90 50 50)"
              />
            )
          })}
        </svg>
        <ul className="space-y-1 text-xs">
          {stocks.map((s, i) => (
            <li key={s.ticker} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: colorFor(s.ticker) }} />
              <span className="font-mono text-white">{s.ticker}</span>
              <span className="text-slate-500">{i === stocks.length - 1 ? remainder : pct}%</span>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  )
}

export function PerformanceDNA({ stocks }) {
  const w = 400
  const h = 140
  const pad = 24
  const lines = stocks.map((s, si) => {
    const pts = Array.from({ length: 12 }, (_, i) => 50 + si * 5 + i * (s.change >= 0 ? 2 : -1) + Math.sin(i + si) * 8)
    const min = 30
    const max = 90
    const coords = pts.map((p, i) => {
      const x = pad + (i / 11) * (w - pad * 2)
      const y = h - pad - ((p - min) / (max - min)) * (h - pad * 2)
      return `${x},${y}`
    }).join(' ')
    return { ticker: s.ticker, coords, color: colorFor(s.ticker) }
  })

  return (
    <Panel title="Normalized Performance DNA" subtitle="1Y relative">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-h-[160px]">
        {lines.map((l) => (
          <polyline key={l.ticker} fill="none" stroke={l.color} strokeWidth="2" points={l.coords} />
        ))}
      </svg>
      <div className="flex flex-wrap gap-3 mt-2">
        {stocks.map((s) => (
          <span key={s.ticker} className="text-[10px] font-mono flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ background: colorFor(s.ticker) }} />
            {s.ticker}
          </span>
        ))}
      </div>
    </Panel>
  )
}

export function CompareTable({ stocks }) {
  return (
    <Panel title="Peer Comparison Table" className="overflow-x-auto">
      <table className="w-full text-[11px]">
        <thead>
          <tr className="text-slate-500 border-b border-slate-700">
            <th className="text-left py-2">Ticker</th>
            <th className="text-right">Price</th>
            <th className="text-right">Chg%</th>
            <th className="text-right">P/E</th>
            <th className="text-right">EPS</th>
            <th className="text-right">Rev Gr</th>
            <th className="text-right">Vol</th>
            <th className="text-right">RSI</th>
            <th className="text-right">Signal</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((s) => (
            <tr key={s.ticker} className="border-b border-slate-800/80 text-slate-200">
              <td className="py-2 font-mono font-bold text-cyan-300">{s.ticker}</td>
              <td className="text-right font-mono">${s.price?.toFixed(2)}</td>
              <td className={`text-right font-mono ${s.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {s.change >= 0 ? '+' : ''}{s.change?.toFixed(2)}%
              </td>
              <td className="text-right font-mono">{s.pe?.toFixed(1)}</td>
              <td className="text-right font-mono">{s.eps ?? '—'}</td>
              <td className="text-right font-mono">{s.revenueGrowth?.toFixed(1)}%</td>
              <td className="text-right font-mono">{s.volatility ?? 22}%</td>
              <td className="text-right font-mono">{s.rsi ?? 58}</td>
              <td className="text-right">
                <SignalCell signal={s.signal} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  )
}

function SignalCell({ signal }) {
  const s = (signal || 'HOLD').toUpperCase()
  const cls =
    s.includes('STRONG') ? 'bg-emerald-700' : s === 'BUY' ? 'bg-emerald-500' : 'bg-amber-500 text-slate-900'
  return <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${cls} text-white`}>{s}</span>
}

export function CatalystTimeline() {
  return (
    <Panel title="Catalyst Timeline">
      <ul className="space-y-3">
        {MOCK_CATALYSTS.map((c) => (
          <li key={c.title} className="flex gap-3 text-xs">
            <span className="text-cyan-400 font-mono shrink-0 w-20">{c.date}</span>
            <span className="text-slate-300">{c.title}</span>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

export function ThesisBox({ value, onChange, ticker }) {
  return (
    <Panel title="My Investment Thesis">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Why ${ticker || 'these picks'} fit your client portfolio...`}
        className="w-full h-24 bg-slate-900/80 border border-slate-600/50 rounded-lg p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/40 resize-none"
      />
    </Panel>
  )
}
