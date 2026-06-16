import { STOCK_COLORS } from '../constants'

export function Panel({ title, subtitle, children, className = '', bodyClass = 'p-4' }) {
  return (
    <div className={`nexus-panel ${className}`}>
      {(title || subtitle) && (
        <div className="nexus-panel-header">
          <h3 className="nexus-panel-title">{title}</h3>
          {subtitle && <span className="nexus-panel-sub">{subtitle}</span>}
        </div>
      )}
      <div className={bodyClass}>{children}</div>
    </div>
  )
}

export function colorFor(ticker) {
  return STOCK_COLORS[ticker] || '#94a3b8'
}

export function Sparkline({ points, color = '#22d3ee', width = 100, height = 40, filled = false }) {
  if (!points?.length) points = [40, 45, 42, 48, 52, 50, 55, 58, 54, 60]
  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1
  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width
    const y = height - ((p - min) / range) * (height - 6) - 3
    return [x, y]
  })
  const line = coords.map((c) => c.join(',')).join(' ')
  const area = `${coords[0][0]},${height} ${line} ${coords[coords.length - 1][0]},${height}`

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="max-h-[44px]">
      {filled && <polygon points={area} fill={color} fillOpacity="0.12" />}
      <polyline fill="none" stroke={color} strokeWidth="2" points={line} strokeLinecap="round" />
    </svg>
  )
}

export function GaugeRing({ value, max = 100, size = 72, stroke = '#22d3ee', label }) {
  const r = (size - 10) / 2
  const c = 2 * Math.PI * r
  const pct = Math.min(value / max, 1)
  return (
    <div className="relative inline-block">
      <svg width={size} height={size} className="mx-auto block">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e293b" strokeWidth="5" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth="5"
          strokeDasharray={`${c * pct} ${c}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-white text-sm font-bold font-mono-nexus">{label ?? Math.round(value)}</span>
        {!label && max === 100 && <span className="text-[8px] text-slate-500">/100</span>}
      </div>
    </div>
  )
}

export function DonutChart({ value, size = 56, color = '#22d3ee', track = '#1e293b' }) {
  const r = 20
  const c = 2 * Math.PI * r
  const pct = Math.min(value / 100, 1)
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className="mx-auto">
      <circle cx="24" cy="24" r={r} fill="none" stroke={track} strokeWidth="6" />
      <circle
        cx="24"
        cy="24"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeDasharray={`${c * pct} ${c}`}
        strokeLinecap="round"
        transform="rotate(-90 24 24)"
      />
      <text x="24" y="24" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="10" fontWeight="700">
        {value}%
      </text>
    </svg>
  )
}

export function SignalBadge({ signal }) {
  const s = (signal || 'HOLD').toUpperCase()
  const styles = {
    'STRONG BUY': 'bg-emerald-700 text-white shadow shadow-emerald-900/40',
    BUY: 'bg-emerald-500 text-white',
    HOLD: 'bg-amber-400 text-slate-900 font-bold',
    SELL: 'bg-red-500 text-white',
  }
  const key = s.includes('STRONG') ? 'STRONG BUY' : s
  return <span className={`text-[9px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide ${styles[key] || styles.HOLD}`}>{s}</span>
}

export function FactorDots({ value, max = 5 }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`w-2.5 h-2.5 rounded-full ${
            i < Math.floor(value) ? 'bg-emerald-400 shadow-sm shadow-emerald-500/50' : 'bg-slate-600'
          }`}
        />
      ))}
    </div>
  )
}
