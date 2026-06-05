import { Panel, colorFor } from './ui'

const PLOTS = [
  { title: 'Growth Quality', x: 'Revenue CAGR', y: 'ROIC' },
  { title: 'Valuation Frontier', x: 'FCF Yield', y: 'P/E' },
  { title: 'Risk vs Reward', x: 'Volatility', y: '1Y Return' },
  { title: 'Quality Score', x: 'Debt/Equity', y: 'Quality' },
]

export default function ScatterMatrix({ stocks }) {
  return (
    <Panel title="Peer Intelligence Matrix" subtitle="4-stock comparison" className="h-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PLOTS.map((plot) => (
          <ScatterPlot key={plot.title} plot={plot} stocks={stocks} />
        ))}
      </div>
    </Panel>
  )
}

function ScatterPlot({ plot, stocks }) {
  const w = 200
  const h = 120
  const pad = 20

  const points = stocks.map((s, i) => {
    const xVal = metricX(s, plot.title, i)
    const yVal = metricY(s, plot.title, i)
    return { ...s, px: pad + (xVal / 100) * (w - pad * 2), py: h - pad - (yVal / 100) * (h - pad * 2) }
  })

  return (
    <div className="bg-slate-900/50 rounded-lg border border-slate-700/40 p-3">
      <p className="text-[10px] font-semibold text-slate-300 mb-2">{plot.title}</p>
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} className="max-h-[140px]">
        <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="#334155" strokeWidth="1" />
        <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="#334155" strokeWidth="1" />
        {points.map((p) => (
          <g key={p.ticker}>
            <circle cx={p.px} cy={p.py} r="6" fill={colorFor(p.ticker)} opacity="0.9" />
            <text x={p.px + 8} y={p.py + 4} className="fill-slate-400 text-[8px] font-mono">
              {p.ticker}
            </text>
          </g>
        ))}
      </svg>
      <div className="flex justify-between text-[8px] text-slate-500 font-mono mt-1">
        <span>{plot.x}</span>
        <span>{plot.y}</span>
      </div>
    </div>
  )
}

function metricX(s, title, i) {
  if (title.includes('Growth')) return s.revenueGrowth ?? 10 + i * 3
  if (title.includes('Valuation')) return s.fcfYield ?? 3 + i
  if (title.includes('Risk')) return s.volatility ?? 20 + i * 2
  return 30 + (s.riskScore ?? 40) * 0.5
}

function metricY(s, title, i) {
  if (title.includes('Growth')) return s.roic ?? 15 + i * 2
  if (title.includes('Valuation')) return s.pe ?? 25 + i * 5
  if (title.includes('Risk')) return s.return1Y ?? s.change * 4 + 10
  return s.quality ?? 70 - i * 3
}
