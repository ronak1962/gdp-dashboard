import { STOCK_COLORS } from '../constants'

export function Panel({ title, subtitle, children, className = '' }) {
  return (
    <div className={`nexus-panel ${className}`}>
      {(title || subtitle) && (
        <div className="px-4 py-3 border-b border-slate-700/60 flex items-baseline justify-between gap-2">
          <h3 className="text-xs font-semibold tracking-widest text-cyan-400/90 uppercase">{title}</h3>
          {subtitle && <span className="text-[10px] text-slate-500 font-mono">{subtitle}</span>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  )
}

export function colorFor(ticker) {
  return STOCK_COLORS[ticker] || '#94a3b8'
}

export function Sparkline({ points, color = '#22d3ee', width = 120, height = 36 }) {
  if (!points?.length) {
    points = [40, 45, 42, 48, 52, 50, 55, 58, 54, 60]
  }
  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1
  const coords = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * width
      const y = height - ((p - min) / range) * (height - 4) - 2
      return `${x},${y}`
    })
    .join(' ')
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline fill="none" stroke={color} strokeWidth="2" points={coords} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function GaugeRing({ value, max = 100, size = 64, stroke = '#22d3ee' }) {
  const r = (size - 8) / 2
  const c = 2 * Math.PI * r
  const pct = Math.min(value / max, 1)
  return (
    <svg width={size} height={size} className="mx-auto">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e293b" strokeWidth="6" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={stroke}
        strokeWidth="6"
        strokeDasharray={`${c * pct} ${c}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" className="fill-white text-[11px] font-bold font-mono">
        {Math.round(value)}
      </text>
    </svg>
  )
}

export function SignalBadge({ signal }) {
  const s = (signal || 'HOLD').toUpperCase()
  const styles = {
    'STRONG BUY': 'bg-emerald-600 text-white',
    BUY: 'bg-emerald-500/90 text-white',
    HOLD: 'bg-amber-500/90 text-slate-900',
    SELL: 'bg-red-500/90 text-white',
  }
  const cls = styles[s] || styles[s.includes('BUY') ? 'BUY' : 'HOLD']
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${cls}`}>{s}</span>
}

export function FactorDots({ value, max = 5 }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full ${i < value ? 'bg-emerald-400' : i < value + 0.5 ? 'bg-amber-400' : 'bg-slate-600'}`}
        />
      ))}
    </div>
  )
}
