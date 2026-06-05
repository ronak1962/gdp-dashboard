import { useEffect, useMemo, useState } from 'react'
import { Sparkline, GaugeRing } from '../components/ui'
import LightweightChartPanel from '../components/LightweightChartPanel'
import TradingViewChart from '../components/TradingViewChart'
import { getLiveStockDetail, generateCandles } from '../mock/liveStockData'
import { fetchStocksBatch } from '../api'
import { DEFAULT_COMPARE } from '../constants'

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

const TF = ['1D', '1W', '1M', '3M', '6M', '1Y']

/**
 * Design 3: Deep multi-chart analysis — 2×2 grid + AI sidebar + peer table
 */
export default function DeepAnalysisDashboard({
  ticker,
  stock,
  advisor,
  loading,
  onBack,
  onSearch,
  onSelectTicker,
  search,
  onSearchChange,
}) {
  const [chartTf, setChartTf] = useState('1D')
  const [expanded, setExpanded] = useState(null)
  const detail = useMemo(() => (stock ? getLiveStockDetail(stock.ticker) : null), [stock])
  const candles = useMemo(() => (stock ? generateCandles(stock.ticker, 60) : []), [stock])

  const peers = useMemo(() => {
    if (!stock) return []
    const list = [stock.ticker, ...DEFAULT_COMPARE.filter((t) => t !== stock.ticker)].slice(0, 5)
    return list
  }, [stock?.ticker])

  const [peerRows, setPeerRows] = useState([])

  useEffect(() => {
    if (peers.length) fetchStocksBatch(peers).then(setPeerRows)
  }, [peers])

  if (loading || !detail || !advisor) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0a0e17]">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const up = detail.change >= 0
  const action = advisor.action || 'HOLD'
  const confidence = advisor.confidence ?? 62
  const actionColor =
    action === 'BUY' ? 'text-emerald-400' : action === 'SELL' ? 'text-red-400' : 'text-amber-400'

  const keyLevels = [
    { label: 'Resistance 2', value: advisor.priceTarget ? +(advisor.priceTarget * 1.05).toFixed(2) : detail.high52 },
    { label: 'Resistance 1', value: advisor.priceTarget ?? detail.dayHigh },
    { label: 'Support 1', value: detail.dayLow },
    { label: 'Support 2', value: advisor.stopLoss ?? detail.low52 },
    { label: 'Stop Loss', value: advisor.stopLoss, highlight: 'red' },
    { label: 'Target', value: advisor.priceTarget, highlight: 'green' },
  ]

  const aiSummary =
    advisor.thesis ||
    `${detail.name} shows ${up ? 'bullish' : 'bearish'} near-term momentum. Price is ${up ? 'above' : 'below'} key moving averages. Watch resistance near $${detail.dayHigh} and support at $${detail.dayLow}.`

  return (
    <div className="flex-1 flex min-h-0 bg-[#0a0e17]">
      <aside className="w-[72px] shrink-0 border-r border-slate-800 bg-[#070b12] flex flex-col items-center py-4 gap-1">
        {NAV.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`w-14 py-2 rounded-lg flex flex-col items-center gap-0.5 text-[9px] ${
              item.id === 'dashboard' ? 'bg-violet-500/20 text-violet-300' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </button>
        ))}
        <div className="mt-auto text-center">
          <span className="text-[9px] text-emerald-400 flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Open
          </span>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 shrink-0 border-b border-slate-800 bg-[#0c1018] px-4 flex items-center gap-4">
          <button type="button" onClick={onBack} className="text-slate-400 hover:text-white text-sm">
            ← Back
          </button>
          <h1 className="text-sm font-semibold text-white hidden md:block">Deep Analysis · Multi-Chart Dashboard</h1>
          <div className="flex-1 max-w-sm mx-auto">
            <input
              value={search ?? ticker}
              onChange={(e) => onSearchChange?.(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearch?.()}
              className="w-full bg-[#141a28] border border-slate-700 rounded-lg px-4 py-2 text-sm font-mono-nexus text-white"
            />
          </div>
          <button
            type="button"
            onClick={onSearch}
            className="px-3 py-1.5 rounded-lg bg-violet-600 text-white text-xs font-semibold"
          >
            Analyze
          </button>
        </header>

        <div className="flex-1 overflow-y-auto nexus-scroll p-4 space-y-4">
          {/* KPI row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Kpi label="Current Price" value={`$${detail.price.toFixed(2)}`} spark={[40, 44, 42, 46, 48]} />
            <Kpi label="Daily Change" value={`+${detail.changeAbs}`} positive spark={[44, 46, 48, 50]} />
            <Kpi label="Change %" value={`${up ? '+' : ''}${detail.change}%`} positive={up} spark={[42, 45, 48]} />
            <Kpi label="Volume" value={`${detail.volume}M`} bar spark={[30, 55, 45, 60]} />
            <Kpi label="Market Cap" value={detail.marketCapDisplay} icon="🏢" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4">
            {/* 2×2 chart grid */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <ChartCard
                  title="Price Action"
                  subtitle="MA(20,50,200) · BB(20,2)"
                  tf={chartTf}
                  onTf={setChartTf}
                  expanded={expanded === 'price'}
                  onExpand={() => setExpanded(expanded === 'price' ? null : 'price')}
                >
                  {expanded === 'price' ? (
                    <TradingViewChart ticker={detail.ticker} interval="D" height={360} />
                  ) : (
                    <LightweightChartPanel candles={candles} mode="candle" height={200} />
                  )}
                </ChartCard>

                <ChartCard
                  title="Trend & Volume"
                  subtitle="1W view"
                  expanded={expanded === 'trend'}
                  onExpand={() => setExpanded(expanded === 'trend' ? null : 'trend')}
                >
                  <LightweightChartPanel candles={candles} mode="trend" height={200} />
                </ChartCard>

                <ChartCard
                  title="Momentum"
                  subtitle="RSI (14) · MACD (12,26,9)"
                  expanded={expanded === 'mom'}
                  onExpand={() => setExpanded(expanded === 'mom' ? null : 'mom')}
                >
                  <LightweightChartPanel candles={candles} mode="rsi" height={200} />
                  <p className="text-[9px] text-slate-600 mt-1 px-1">MACD histogram shown in expanded TradingView chart</p>
                </ChartCard>

                <ChartCard
                  title="Support / Resistance"
                  subtitle="Auto levels · signals"
                  expanded={expanded === 'sr'}
                  onExpand={() => setExpanded(expanded === 'sr' ? null : 'sr')}
                >
                  <LightweightChartPanel candles={candles} mode="sr" height={200} />
                  <div className="flex gap-2 mt-2 px-1">
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">BUY zone</span>
                    <span className="text-[9px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded">SELL zone</span>
                  </div>
                </ChartCard>
              </div>
            </div>

            {/* Right: AI + risk */}
            <div className="space-y-3">
              <div className="nexus-panel p-4">
                <p className="text-[10px] text-slate-500 uppercase">Risk Level</p>
                <p className="text-xl font-bold text-amber-400">{detail.riskLevel}</p>
                <GaugeRing value={100 - detail.riskScore} stroke="#f59e0b" size={72} />
              </div>

              <div className="nexus-panel p-4">
                <p className="text-[10px] text-violet-400 uppercase font-semibold mb-2">AI Analysis Summary</p>
                <p className="text-xs text-slate-300 leading-relaxed">{aiSummary}</p>
                {advisor.signals?.slice(0, 3).map((s, i) => (
                  <p key={i} className="text-[10px] text-slate-500 mt-2 flex gap-1">
                    <span className="text-cyan-500">•</span> {s.reason}
                  </p>
                ))}
              </div>

              <div className="nexus-panel p-4 text-center">
                <p className="text-[10px] text-slate-500 uppercase">Recommendation</p>
                <p className={`text-4xl font-black mt-2 ${actionColor}`}>{action}</p>
                <div className="mt-3 flex justify-center">
                  <GaugeRing value={confidence} stroke="#8b5cf6" size={80} label={`${confidence}%`} />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Confidence</p>
              </div>

              <div className="nexus-panel p-4">
                <p className="text-[10px] text-slate-500 uppercase mb-2">Key Levels</p>
                <ul className="space-y-2 text-xs">
                  {keyLevels.map((l) => (
                    <li key={l.label} className="flex justify-between font-mono-nexus">
                      <span className="text-slate-500">{l.label}</span>
                      <span
                        className={
                          l.highlight === 'red'
                            ? 'text-red-400'
                            : l.highlight === 'green'
                              ? 'text-emerald-400'
                              : 'text-white'
                        }
                      >
                        ${typeof l.value === 'number' ? l.value.toFixed?.(2) ?? l.value : l.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Peer comparison table */}
          <div className="nexus-panel overflow-x-auto">
            <div className="px-4 py-3 border-b border-slate-700/50 flex justify-between items-center">
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Watchlist · Peer Comparison</p>
              <button type="button" className="text-[10px] text-blue-400 border border-blue-500/30 px-2 py-1 rounded">
                + Add Symbol
              </button>
            </div>
            <table className="w-full text-[11px]">
              <thead>
                <tr className="text-slate-500 border-b border-slate-800">
                  <th className="text-left py-2 px-4">Symbol</th>
                  <th className="text-right px-2">Price</th>
                  <th className="text-right px-2">Chg</th>
                  <th className="text-right px-2">Chg%</th>
                  <th className="text-right px-2">Chart 1D</th>
                  <th className="text-right px-2">Vol</th>
                  <th className="text-right px-2">Mkt Cap</th>
                  <th className="text-right px-2">P/E</th>
                  <th className="text-right px-2">EPS</th>
                  <th className="text-right px-4">52W H/L</th>
                </tr>
              </thead>
              <tbody>
                {(peerRows.length ? peerRows : [stock]).map((r) => (
                  <tr
                    key={r.ticker}
                    className={`border-b border-slate-800/50 hover:bg-slate-800/30 cursor-pointer ${
                      r.ticker === detail.ticker ? 'bg-violet-500/5' : ''
                    }`}
                    onClick={() => onSelectTicker?.(r.ticker)}
                  >
                    <td className="py-2.5 px-4">
                      <span className="text-amber-400 mr-1">★</span>
                      <span className="font-mono-nexus font-bold text-white">{r.ticker}</span>
                      <span className="text-slate-600 ml-1 hidden sm:inline">{r.name?.slice(0, 12)}</span>
                    </td>
                    <td className="text-right font-mono-nexus px-2">${r.price?.toFixed(2)}</td>
                    <td className={`text-right font-mono-nexus px-2 ${r.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {r.change >= 0 ? '+' : ''}{(r.price * (r.change / 100)).toFixed(2)}
                    </td>
                    <td className={`text-right font-mono-nexus px-2 ${r.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {r.change >= 0 ? '+' : ''}{r.change?.toFixed(2)}%
                    </td>
                    <td className="px-2 w-24">
                      <Sparkline points={[40, 42, 44, 43, 46, 48]} color="#3b82f6" width={80} height={24} />
                    </td>
                    <td className="text-right px-2 text-slate-400">{r.avgVolume ?? detail.volume}M</td>
                    <td className="text-right px-2 text-slate-400">${r.marketCap}B</td>
                    <td className="text-right px-2 font-mono-nexus">{r.pe?.toFixed(1)}</td>
                    <td className="text-right px-2 font-mono-nexus">{r.eps?.toFixed(2)}</td>
                    <td className="text-right px-4 font-mono-nexus text-slate-500">
                      {r.high52?.toFixed(0)} / {r.low52?.toFixed(0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function Kpi({ label, value, positive, spark, bar, icon }) {
  return (
    <div className="nexus-panel p-3">
      <p className="text-[10px] text-slate-500 uppercase">{label}</p>
      <p className={`text-lg font-mono-nexus font-bold mt-1 ${positive === true ? 'text-emerald-400' : positive === false ? 'text-red-400' : 'text-white'}`}>
        {value}
      </p>
      {icon && <p className="text-xl mt-1">{icon}</p>}
      {spark && !bar && <Sparkline points={spark} color="#22c55e" width={100} height={26} filled />}
      {bar && spark && (
        <div className="flex items-end gap-0.5 h-6 mt-2">
          {spark.map((p, i) => (
            <div key={i} className="flex-1 bg-blue-500/50 rounded-sm" style={{ height: `${p}%` }} />
          ))}
        </div>
      )}
    </div>
  )
}

function ChartCard({ title, subtitle, children, tf, onTf, expanded, onExpand }) {
  return (
    <div className="nexus-panel overflow-hidden flex flex-col">
      <div className="px-3 py-2 border-b border-slate-700/50 flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-white">{title}</p>
          <p className="text-[9px] text-slate-500">{subtitle}</p>
        </div>
        <div className="flex items-center gap-1">
          {tf &&
            TF.slice(0, 3).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onTf?.(t)}
                className={`text-[8px] px-1.5 py-0.5 rounded ${tf === t ? 'bg-slate-600 text-white' : 'text-slate-600'}`}
              >
                {t}
              </button>
            ))}
          <button type="button" onClick={onExpand} className="text-slate-500 hover:text-white text-xs ml-1" title="Expand">
            {expanded ? '⊖' : '⛶'}
          </button>
        </div>
      </div>
      <div className="p-2 flex-1">{children}</div>
    </div>
  )
}
