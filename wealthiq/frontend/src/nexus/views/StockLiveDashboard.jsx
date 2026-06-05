import { useMemo, useState } from 'react'
import { Sparkline } from '../components/ui'
import {
  getLiveStockDetail,
  generateCandles,
  generateRsi,
  generateMacd,
  MOCK_ORDER_BOOK,
  MOCK_NEWS,
  MOCK_SECTORS,
  MOCK_WATCHLIST,
  CHART_TIMEFRAMES,
} from '../mock/liveStockData'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '▣' },
  { id: 'watchlist', label: 'Watchlist', icon: '★' },
  { id: 'portfolio', label: 'Portfolio', icon: '◫' },
  { id: 'markets', label: 'Markets', icon: '🌐' },
  { id: 'news', label: 'News', icon: '📰' },
  { id: 'screener', label: 'Screener', icon: '⌗' },
  { id: 'alerts', label: 'Alerts', icon: '🔔' },
  { id: 'calendar', label: 'Calendar', icon: '📅' },
  { id: 'reports', label: 'Reports', icon: '📊' },
  { id: 'settings', label: 'Settings', icon: '⚙' },
]

export default function StockLiveDashboard({
  ticker,
  stock,
  loading,
  onBack,
  onSelectStock,
  search,
  onSearch,
  onSearchSubmit,
}) {
  const [timeframe, setTimeframe] = useState('1D')
  const [chartTab, setChartTab] = useState('Indices')
  const detail = useMemo(() => (stock ? getLiveStockDetail(stock.ticker) : null), [stock])
  const candles = useMemo(() => (stock ? generateCandles(stock.ticker) : []), [stock])
  const rsi = useMemo(() => generateRsi(candles), [candles])
  const macd = useMemo(() => generateMacd(candles), [candles])
  const book = useMemo(() => MOCK_ORDER_BOOK(detail?.price ?? 192), [detail?.price])

  if (loading || !detail) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0a0e17]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 text-sm mt-3 font-mono-nexus">Loading {ticker}…</p>
        </div>
      </div>
    )
  }

  const up = detail.change >= 0
  const watchlist = MOCK_WATCHLIST()

  return (
    <div className="flex-1 flex min-h-0 bg-[#0a0e17]">
      {/* Left nav — matches live stock dashboard photo */}
      <aside className="w-[72px] shrink-0 border-r border-slate-800 bg-[#070b12] flex flex-col items-center py-4 gap-1">
        {NAV.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`w-14 py-2 rounded-lg flex flex-col items-center gap-0.5 text-[9px] transition ${
              item.id === 'dashboard' ? 'bg-blue-500/20 text-blue-400' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            <span className="leading-tight text-center">{item.label}</span>
          </button>
        ))}
        <div className="mt-auto px-1 text-center">
          <span className="inline-flex items-center gap-1 text-[9px] text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Open
          </span>
          <p className="text-[8px] text-slate-600 mt-1 font-mono-nexus">{new Date().toLocaleDateString()}</p>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 shrink-0 border-b border-slate-800 bg-[#0c1018] px-4 flex items-center gap-4">
          <button type="button" onClick={onBack} className="text-slate-400 hover:text-white text-sm shrink-0">
            ← Overview
          </button>
          <h1 className="text-sm font-semibold text-white shrink-0 hidden lg:block">
            Live Stock Market Analysis Dashboard
          </h1>
          <div className="flex-1 max-w-md mx-auto">
            <div className="relative">
              <input
                value={search ?? ticker}
                onChange={(e) => onSearch?.(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit?.()}
                className="w-full bg-[#141a28] border border-slate-700 rounded-lg pl-4 pr-10 py-2 text-sm font-mono-nexus text-white focus:outline-none focus:border-blue-500/50"
              />
              {search && (
                <button type="button" onClick={() => onSearch?.('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button type="button" className="text-slate-400 hover:text-white relative">
              🔔
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button type="button" className="text-slate-400 hover:text-white">🌙</button>
            <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600" />
              <div className="hidden sm:block">
                <p className="text-[10px] text-slate-500">Welcome,</p>
                <p className="text-xs text-white font-medium">Parth Mehta</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto nexus-scroll p-4 space-y-4">
          {/* 5 summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <SummaryCard label="Current Price" value={`$${detail.price.toFixed(2)}`} spark={[40, 42, 41, 44, 45, 46, 48]} color="#3b82f6" />
            <SummaryCard
              label="Daily Change"
              value={`${up ? '+' : ''}${detail.changeAbs}`}
              positive={up}
              spark={[44, 45, 46, 47, 48, 49, 50]}
            />
            <SummaryCard label="Change %" value={`${up ? '+' : ''}${detail.change.toFixed(2)}%`} positive={up} spark={[42, 43, 44, 45, 46, 47, 48]} />
            <SummaryCard label="Volume" value={`${detail.volume}M`} spark={[30, 50, 40, 60, 55, 70, 65]} color="#3b82f6" bar />
            <SummaryCard label="Market Cap" value={detail.marketCapDisplay} icon="🏢" />
          </div>

          {/* Chart + right column */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-4">
            <div className="nexus-panel overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-700/50 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-mono-nexus font-bold text-white">
                    {detail.ticker}{' '}
                    <span className="text-slate-400 font-normal text-sm">{detail.name}</span>
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {timeframe} · {detail.exchange} · O {detail.open} H {detail.high} L {detail.low} C {detail.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {CHART_TIMEFRAMES.map((tf) => (
                    <button
                      key={tf}
                      type="button"
                      onClick={() => setTimeframe(tf)}
                      className={`px-2 py-1 rounded text-[10px] font-mono-nexus ${
                        timeframe === tf ? 'bg-blue-500 text-white' : 'text-slate-500 hover:bg-slate-800'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-3 space-y-2">
                <CandlestickChart candles={candles} />
                <VolumeBars candles={candles} />
                <SubChart title="RSI (14)" data={rsi} color="#a855f7" height={56} />
                <MacdChart data={macd} height={56} />
              </div>
            </div>

            <div className="space-y-3">
              <RiskGauge level={detail.riskLevel} score={detail.riskScore} />
              <OrderBook book={book} />
              <DayRange low={detail.dayLow} high={detail.dayHigh} current={detail.price} />
              <KeyStats detail={detail} />
            </div>
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            <WatchlistPanel rows={watchlist} active={detail.ticker} onSelect={onSelectStock} />
            <NewsPanel items={MOCK_NEWS} />
            <MarketOverview tab={chartTab} setTab={setChartTab} />
            <SectorGrid sectors={MOCK_SECTORS} />
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ label, value, positive, spark, color = '#22c55e', bar, icon }) {
  return (
    <div className="nexus-panel p-3">
      <p className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</p>
      <p className={`text-lg font-mono-nexus font-bold mt-1 ${positive === true ? 'text-emerald-400' : positive === false ? 'text-red-400' : 'text-white'}`}>
        {value}
      </p>
      {icon && <p className="text-2xl mt-2">{icon}</p>}
      {spark && !bar && <Sparkline points={spark} color={positive ? '#22c55e' : color} width={120} height={28} filled />}
      {spark && bar && <VolumeBarsMini points={spark} />}
    </div>
  )
}

function VolumeBarsMini({ points }) {
  const max = Math.max(...points)
  return (
    <div className="flex items-end gap-0.5 h-7 mt-2">
      {points.map((p, i) => (
        <div key={i} className="flex-1 bg-blue-500/60 rounded-sm" style={{ height: `${(p / max) * 100}%` }} />
      ))}
    </div>
  )
}

function CandlestickChart({ candles }) {
  const w = 600
  const h = 200
  const pad = 8
  const prices = candles.flatMap((c) => [c.h, c.l])
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const range = max - min || 1
  const bw = (w - pad * 2) / candles.length - 2

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[200px] bg-[#080c14] rounded-lg">
      {[0.25, 0.5, 0.75].map((t) => (
        <line key={t} x1={pad} y1={pad + t * (h - pad * 2)} x2={w - pad} y2={pad + t * (h - pad * 2)} stroke="#1e293b" strokeWidth="0.5" />
      ))}
      {candles.map((c, i) => {
        const x = pad + i * (bw + 2)
        const y = (v) => h - pad - ((v - min) / range) * (h - pad * 2)
        const up = c.c >= c.o
        const col = up ? '#22c55e' : '#ef4444'
        return (
          <g key={i}>
            <line x1={x + bw / 2} y1={y(c.h)} x2={x + bw / 2} y2={y(c.l)} stroke={col} strokeWidth="1" />
            <rect x={x} y={y(Math.max(c.o, c.c))} width={bw} height={Math.max(2, Math.abs(y(c.o) - y(c.c)))} fill={col} />
          </g>
        )
      })}
      <polyline
        fill="none"
        stroke="#3b82f6"
        strokeWidth="1"
        opacity="0.6"
        points={candles.map((c, i) => `${pad + i * (bw + 2) + bw / 2},${h - pad - ((c.c - min) / range) * (h - pad * 2)}`).join(' ')}
      />
    </svg>
  )
}

function VolumeBars({ candles }) {
  const max = Math.max(...candles.map((c) => c.v))
  return (
    <div className="flex items-end gap-px h-10 px-1">
      {candles.map((c, i) => (
        <div
          key={i}
          className={`flex-1 rounded-t-sm opacity-70 ${c.c >= c.o ? 'bg-emerald-500/50' : 'bg-red-500/50'}`}
          style={{ height: `${(c.v / max) * 100}%` }}
        />
      ))}
    </div>
  )
}

function SubChart({ title, data, color, height }) {
  const w = 600
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${height - ((v - min) / range) * (height - 8)}`).join(' ')
  return (
    <div>
      <p className="text-[9px] text-slate-500 mb-1">{title}</p>
      <svg viewBox={`0 0 ${w} ${height}`} className="w-full bg-[#080c14] rounded h-14">
        <polyline fill="none" stroke={color} strokeWidth="1.5" points={pts} />
      </svg>
    </div>
  )
}

function MacdChart({ data, height }) {
  const w = 600
  return (
    <div>
      <p className="text-[9px] text-slate-500 mb-1">MACD</p>
      <svg viewBox={`0 0 ${w} ${height}`} className="w-full bg-[#080c14] rounded h-14">
        {data.map((d, i) => {
          const x = (i / data.length) * w
          const barH = Math.abs(d.hist) * 8
          return (
            <rect
              key={i}
              x={x}
              y={height / 2 - barH / 2}
              width={w / data.length - 1}
              height={barH}
              fill={d.hist >= 0 ? '#3b82f6' : '#f97316'}
              opacity="0.7"
            />
          )
        })}
      </svg>
    </div>
  )
}

function RiskGauge({ level, score }) {
  const pct = score / 100
  const angle = -90 + pct * 180
  return (
    <div className="nexus-panel p-4">
      <p className="text-[10px] text-slate-500 uppercase">Risk Level</p>
      <p className="text-xl font-bold text-amber-400 mt-1">{level}</p>
      <svg viewBox="0 0 120 70" className="w-full mt-2">
        <path d="M 15 65 A 45 45 0 0 1 105 65" fill="none" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
        <path d="M 15 65 A 45 45 0 0 1 105 65" fill="none" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${pct * 141} 141`} />
        <line
          x1="60"
          y1="65"
          x2={60 + 40 * Math.cos((angle * Math.PI) / 180)}
          y2={65 + 40 * Math.sin((angle * Math.PI) / 180)}
          stroke="white"
          strokeWidth="2"
        />
      </svg>
    </div>
  )
}

function OrderBook({ book }) {
  return (
    <div className="nexus-panel p-3">
      <p className="text-[10px] text-slate-500 uppercase mb-2">Order Book</p>
      <table className="w-full text-[10px] font-mono-nexus">
        <thead>
          <tr className="text-slate-500">
            <th className="text-left">Bid</th>
            <th className="text-center">Orders</th>
            <th className="text-right">Qty</th>
          </tr>
        </thead>
        <tbody>
          {book.bids.map((r) => (
            <tr key={r.price} className="text-blue-400">
              <td>{r.price.toFixed(2)}</td>
              <td className="text-center text-slate-500">{r.orders}</td>
              <td className="text-right">{r.qty.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <table className="w-full text-[10px] font-mono-nexus mt-2">
        <tbody>
          {book.offers.map((r) => (
            <tr key={r.price} className="text-red-400">
              <td>{r.price.toFixed(2)}</td>
              <td className="text-center text-slate-500">{r.orders}</td>
              <td className="text-right">{r.qty.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function DayRange({ low, high, current }) {
  const pct = ((current - low) / (high - low)) * 100
  return (
    <div className="nexus-panel p-3">
      <p className="text-[10px] text-slate-500 uppercase mb-2">Day&apos;s Range</p>
      <div className="relative h-2 bg-slate-800 rounded-full">
        <div className="absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-red-500/30 via-amber-500/30 to-emerald-500/30 rounded-full" />
        <div className="absolute w-2 h-2 bg-white rounded-full top-0 -translate-x-1/2" style={{ left: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-[10px] font-mono-nexus mt-2 text-slate-400">
        <span>${low}</span>
        <span>${high}</span>
      </div>
    </div>
  )
}

function KeyStats({ detail }) {
  const rows = [
    ['Open', detail.open],
    ['Prev. Close', detail.prevClose],
    ['Volume', `${detail.volume}M`],
    ['Avg. Trade Price', detail.avgTradePrice],
    ['Last Traded Qty', detail.lastQty],
    ['Last Traded At', detail.lastTradeTime],
  ]
  return (
    <div className="nexus-panel p-3">
      <p className="text-[10px] text-slate-500 uppercase mb-2">Key Statistics</p>
      <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[10px]">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <span className="text-slate-500">{k}</span>
            <span className="text-right font-mono-nexus text-white">{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function WatchlistPanel({ rows, active, onSelect }) {
  return (
    <div className="nexus-panel p-3">
      <p className="text-[10px] text-slate-500 uppercase mb-2">Watchlist</p>
      <table className="w-full text-[11px]">
        <thead>
          <tr className="text-slate-500 border-b border-slate-800">
            <th className="text-left py-1">Symbol</th>
            <th className="text-right">Price</th>
            <th className="text-right">Chg%</th>
            <th className="text-right">Mkt Cap</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.ticker}
              onClick={() => onSelect?.(r.ticker)}
              className={`border-b border-slate-800/50 cursor-pointer hover:bg-slate-800/30 ${
                active === r.ticker ? 'text-blue-400' : 'text-slate-300'
              }`}
            >
              <td className="py-2 font-mono-nexus font-bold">{r.ticker}</td>
              <td className="text-right font-mono-nexus">${r.price?.toFixed(2)}</td>
              <td className={`text-right font-mono-nexus ${r.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {r.change >= 0 ? '+' : ''}{r.change?.toFixed(2)}%
              </td>
              <td className="text-right text-slate-500">{r.marketCap}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function NewsPanel({ items }) {
  const colors = { Positive: 'text-emerald-400 bg-emerald-500/15', Negative: 'text-red-400 bg-red-500/15', Neutral: 'text-slate-400 bg-slate-500/15' }
  return (
    <div className="nexus-panel p-3">
      <p className="text-[10px] text-slate-500 uppercase mb-2">Market News</p>
      <ul className="space-y-3">
        {items.map((n) => (
          <li key={n.title} className="flex gap-2 text-xs">
            <span className="text-lg shrink-0">{n.thumb}</span>
            <div className="min-w-0">
              <p className="text-slate-200 line-clamp-2 leading-snug">{n.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-slate-500 text-[10px]">{n.source}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded ${colors[n.sentiment]}`}>{n.sentiment}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function MarketOverview({ tab, setTab }) {
  const tabs = ['Indices', 'Futures', 'Commodities', 'Bonds']
  const pts = [40, 42, 41, 44, 43, 45, 46, 48, 47, 49]
  return (
    <div className="nexus-panel p-3">
      <p className="text-[10px] text-slate-500 uppercase mb-2">Market Overview</p>
      <div className="flex gap-1 mb-2">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`text-[9px] px-2 py-0.5 rounded ${tab === t ? 'bg-blue-500/30 text-blue-300' : 'text-slate-500'}`}
          >
            {t}
          </button>
        ))}
      </div>
      <Sparkline points={pts} color="#3b82f6" width={200} height={48} filled />
    </div>
  )
}

function SectorGrid({ sectors }) {
  return (
    <div className="nexus-panel p-3">
      <p className="text-[10px] text-slate-500 uppercase mb-2">Sector Performance</p>
      <div className="grid grid-cols-3 gap-2">
        {sectors.map((s) => (
          <div
            key={s.name}
            className={`rounded-lg p-2 text-center border ${
              s.change >= 0 ? 'bg-emerald-500/10 border-emerald-500/25' : 'bg-red-500/10 border-red-500/25'
            }`}
          >
            <p className="text-[9px] text-slate-400 leading-tight">{s.name}</p>
            <p className={`text-xs font-mono-nexus font-bold mt-1 ${s.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {s.change >= 0 ? '+' : ''}{s.change}%
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
