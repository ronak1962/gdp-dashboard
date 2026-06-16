import { Panel, colorFor } from './ui'
import { MOCK_CATALYSTS, MOCK_SCENARIOS } from '../mockData'

export function ScenarioStudio({ ticker }) {
  const scenarios = MOCK_SCENARIOS(ticker)
  const styles = {
    Bull: 'from-emerald-500/20 to-emerald-900/5 border-emerald-500/30',
    Base: 'from-cyan-500/15 to-slate-900/5 border-cyan-500/25',
    Bear: 'from-red-500/15 to-red-900/5 border-red-500/30',
  }
  return (
    <Panel title="Scenario Studio" subtitle="AI probabilities">
      <div className="grid grid-cols-3 gap-2">
        {scenarios.map((sc) => (
          <div
            key={sc.case}
            className={`rounded-xl border bg-gradient-to-b p-3 ${styles[sc.case]}`}
          >
            <p className="text-[10px] font-bold text-slate-400 uppercase">{sc.case} Case</p>
            <p className="text-xl font-mono-nexus font-bold text-white mt-1">{sc.move}</p>
            <p className="text-[10px] text-slate-500 mt-1 font-mono-nexus">{sc.range}</p>
            <p className="text-[11px] text-cyan-400 font-semibold mt-2">{sc.prob}% probability</p>
          </div>
        ))}
      </div>
    </Panel>
  )
}

export function CapitalMix({ stocks }) {
  const weights = [28, 32, 22, 18]
  let offset = 0
  const r = 36
  const c = 2 * Math.PI * r

  return (
    <Panel title="Capital Allocation Mix">
      <div className="flex items-center gap-4">
        <svg viewBox="0 0 96 96" className="w-28 h-28 shrink-0">
          {stocks.map((s, i) => {
            const pct = weights[i] ?? 25
            const dash = (pct / 100) * c
            const el = (
              <circle
                key={s.ticker}
                cx="48"
                cy="48"
                r={r}
                fill="none"
                stroke={colorFor(s.ticker)}
                strokeWidth="10"
                strokeDasharray={`${dash} ${c - dash}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 48 48)"
              />
            )
            offset += dash
            return el
          })}
        </svg>
        <ul className="space-y-2 text-xs flex-1">
          {stocks.map((s, i) => (
            <li key={s.ticker} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: colorFor(s.ticker) }} />
              <span className="font-mono-nexus font-bold text-white w-12">{s.ticker}</span>
              <span className="text-slate-500 ml-auto font-mono-nexus">{weights[i]}%</span>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  )
}

export function PerformanceDNA({ stocks }) {
  const w = 480
  const h = 160
  const pad = 32

  return (
    <Panel title="Normalized Performance DNA" subtitle="1Y indexed">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[140px]">
        {[0.25, 0.5, 0.75].map((t) => (
          <line
            key={t}
            x1={pad}
            y1={h - pad - t * (h - pad * 2)}
            x2={w - pad}
            y2={h - pad - t * (h - pad * 2)}
            stroke="#1e293b"
            strokeWidth="1"
          />
        ))}
        {stocks.map((s, si) => {
          const pts = Array.from({ length: 24 }, (_, i) => 50 + si * 4 + i * (s.change >= 0 ? 1.2 : -0.6) + Math.sin(i * 0.4 + si) * 6)
          const min = 35
          const max = 95
          const coords = pts
            .map((p, i) => {
              const x = pad + (i / 23) * (w - pad * 2)
              const y = h - pad - ((p - min) / (max - min)) * (h - pad * 2)
              return `${x},${y}`
            })
            .join(' ')
          return (
            <polyline
              key={s.ticker}
              fill="none"
              stroke={colorFor(s.ticker)}
              strokeWidth="2.5"
              points={coords}
              strokeLinecap="round"
            />
          )
        })}
      </svg>
      <div className="flex flex-wrap gap-4 mt-2 justify-center">
        {stocks.map((s) => (
          <span key={s.ticker} className="text-[10px] font-mono-nexus flex items-center gap-1.5 text-slate-400">
            <span className="w-3 h-0.5 rounded" style={{ background: colorFor(s.ticker) }} />
            {s.ticker}
          </span>
        ))}
      </div>
    </Panel>
  )
}

export function CompareTable({ stocks }) {
  return (
    <Panel title="Peer Comparison" bodyClass="p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="text-slate-500 bg-[#080c18]/80 border-b border-slate-700/50">
              <th className="text-left py-3 px-4 font-semibold">Ticker</th>
              <th className="text-right px-2 py-3">Price</th>
              <th className="text-right px-2 py-3">Chg%</th>
              <th className="text-right px-2 py-3">P/E</th>
              <th className="text-right px-2 py-3">EPS</th>
              <th className="text-right px-2 py-3">Rev Gr</th>
              <th className="text-right px-2 py-3">Vol</th>
              <th className="text-right px-2 py-3">RSI</th>
              <th className="text-right px-2 py-3">Avg Vol</th>
              <th className="text-right px-4 py-3">Final Signal</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((s) => (
              <tr key={s.ticker} className="border-b border-slate-800/50 hover:bg-slate-800/20 text-slate-200">
                <td className="py-2.5 px-4 font-mono-nexus font-bold text-cyan-300">{s.ticker}</td>
                <td className="text-right px-2 font-mono-nexus">${s.price?.toFixed(2)}</td>
                <td className={`text-right px-2 font-mono-nexus ${s.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {s.change >= 0 ? '+' : ''}{s.change?.toFixed(2)}%
                </td>
                <td className="text-right px-2 font-mono-nexus">{s.pe?.toFixed(1)}</td>
                <td className="text-right px-2 font-mono-nexus">{s.eps?.toFixed(2)}</td>
                <td className="text-right px-2 font-mono-nexus">{s.revenueGrowth?.toFixed(1)}%</td>
                <td className="text-right px-2 font-mono-nexus">{s.volatility}%</td>
                <td className="text-right px-2 font-mono-nexus">{s.rsi}</td>
                <td className="text-right px-2 font-mono-nexus">{s.avgVolume}M</td>
                <td className="text-right px-4">
                  <SignalCell signal={s.signal} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

function SignalCell({ signal }) {
  const s = (signal || 'HOLD').toUpperCase()
  const cls = s.includes('STRONG')
    ? 'bg-emerald-800 text-white'
    : s === 'BUY'
      ? 'bg-emerald-500 text-white'
      : 'bg-amber-400 text-slate-900'
  return <span className={`text-[9px] font-bold px-2.5 py-1 rounded-md inline-block ${cls}`}>{s}</span>
}

export function CatalystTimeline() {
  return (
    <Panel title="Catalyst Timeline">
      <ul className="space-y-3">
        {MOCK_CATALYSTS.map((c) => (
          <li key={c.title} className="flex gap-3 text-xs border-l-2 border-cyan-500/40 pl-3">
            <span className="text-cyan-400 font-mono-nexus shrink-0 w-12 font-semibold">{c.date}</span>
            <span className="text-slate-300 leading-relaxed">{c.title}</span>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

export function ThesisBox({ value, onChange }) {
  return (
    <Panel title="My Investment Thesis">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Document your rationale for this allocation..."
        className="w-full h-28 bg-[#080c18] border border-slate-700/50 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/40 resize-none leading-relaxed"
      />
    </Panel>
  )
}
