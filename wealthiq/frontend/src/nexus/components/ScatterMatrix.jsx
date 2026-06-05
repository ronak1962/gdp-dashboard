import { Panel, colorFor } from './ui'

const PLOTS = [
  { title: 'Growth Quality', x: 'Revenue CAGR', y: 'ROIC' },
  { title: 'Valuation Frontier', x: 'FCF Yield', y: 'P/E' },
  { title: 'Risk vs. Reward', x: 'Volatility', y: '1Y Return' },
  { title: 'Quality Score', x: 'Debt/Equity', y: 'Quality' },
]

export default function ScatterMatrix({ stocks }) {
  return (
    <Panel title="Peer Intelligence Matrix" subtitle="4-way comparison" bodyClass="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PLOTS.map((plot) => (
          <ScatterPlot key={plot.title} plot={plot} stocks={stocks} />
        ))}
      </div>
    </Panel>
  )
}

function ScatterPlot({ plot, stocks }) {
  const w = 220
  const h = 130
  const pad = 28

  const points = stocks.map((s, i) => {
    const xVal = metricX(s, plot.title, i)
    const yVal = metricY(s, plot.title, i)
    return {
      ...s,
      px: pad + (xVal / 100) * (w - pad * 2),
      py: h - pad - (yVal / 100) * (h - pad * 2),
    }
  })

  const gridLines = [0.25, 0.5, 0.75].map((t) => ({
    x: pad + t * (w - pad * 2),
    y: h - pad - t * (h - pad * 2),
  }))

  return (
    <div className="rounded-xl bg-[#080c18]/80 border border-slate-700/40 p-3">
      <p className="text-[11px] font-semibold text-slate-200 mb-2">{plot.title}</p>
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} className="w-full">
        {gridLines.map((g, i) => (
          <g key={i} opacity="0.35">
            <line x1={g.x} y1={pad} x2={g.x} y2={h - pad} stroke="#334155" strokeWidth="0.5" strokeDasharray="2" />
            <line x1={pad} y1={g.y} x2={w - pad} y2={g.y} stroke="#334155" strokeWidth="0.5" strokeDasharray="2" />
          </g>
        ))}
        <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="#475569" strokeWidth="1" />
        <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="#475569" strokeWidth="1" />
        {points.map((p) => (
          <g key={p.ticker}>
            <circle cx={p.px} cy={p.py} r="7" fill={colorFor(p.ticker)} opacity="0.25" />
            <circle cx={p.px} cy={p.py} r="5" fill={colorFor(p.ticker)} stroke="#0f172a" strokeWidth="1" />
            <text x={p.px + 8} y={p.py + 3} fill="#94a3b8" fontSize="9" fontFamily="monospace" fontWeight="600">
              {p.ticker}
            </text>
          </g>
        ))}
      </svg>
      <div className="flex justify-between text-[8px] text-slate-500 font-mono-nexus mt-1 px-1">
        <span>{plot.x}</span>
        <span>{plot.y}</span>
      </div>
    </div>
  )
}

function metricX(s, title, i) {
  if (title.includes('Growth')) return s.revenueGrowth ?? 12 + i * 4
  if (title.includes('Valuation')) return (s.fcfYield ?? 3) * 8 + i * 5
  if (title.includes('Risk')) return s.volatility ?? 18 + i * 3
  return 35 + (s.riskScore ?? 40) * 0.45
}

function metricY(s, title, i) {
  if (title.includes('Growth')) return s.roic ?? 14 + i * 3
  if (title.includes('Valuation')) return Math.min((s.pe ?? 30) * 1.2, 95)
  if (title.includes('Risk')) return s.return1Y ?? 15 + i * 4
  return s.quality ?? 68 + i * 2
}
