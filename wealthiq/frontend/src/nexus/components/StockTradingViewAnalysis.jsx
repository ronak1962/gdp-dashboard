import { useState } from 'react'
import TradingViewChart, { toTradingViewSymbol } from './TradingViewChart'
import {
  TradingViewTechnicalAnalysis,
  TradingViewSymbolInfo,
  TradingViewFinancials,
} from './TradingViewWidgets'

const CHIPS = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN', 'GOOGL', 'META', 'JPM']

const INTERVALS = [
  { label: '1m', value: '1' },
  { label: '5m', value: '5' },
  { label: '15m', value: '15' },
  { label: '1H', value: '60' },
  { label: '4H', value: '240' },
  { label: '1D', value: 'D' },
  { label: '1W', value: 'W' },
  { label: '1M', value: 'M' },
]

/**
 * Full TradingView stock analysis interface — chart, technicals, symbol info.
 */
export default function StockTradingViewAnalysis({
  ticker,
  onTickerChange,
  onSearch,
  chartHeight = 560,
  showHeader = true,
  compact = false,
}) {
  const [interval, setInterval] = useState('D')
  const [tab, setTab] = useState('technicals')
  const sym = (ticker || 'AAPL').toUpperCase()

  const handleSubmit = (t) => {
    const next = (t || sym).trim().toUpperCase()
    if (!next) return
    onTickerChange?.(next)
    onSearch?.(next)
  }

  return (
    <div className={`flex flex-col gap-3 ${compact ? '' : 'min-h-0'}`}>
      {showHeader && (
        <div className="nexus-panel px-4 py-3 shrink-0">
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <div>
              <p className="text-[10px] text-blue-400 uppercase tracking-widest font-semibold">TradingView Analysis</p>
              <p className="text-white font-mono-nexus font-bold text-lg mt-0.5">{toTradingViewSymbol(sym)}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 flex-1 max-w-lg justify-end">
              <input
                value={sym}
                onChange={(e) => onTickerChange?.(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="w-28 bg-[#0c1220] border border-slate-600 rounded-lg px-3 py-1.5 text-sm font-mono-nexus text-white focus:border-blue-500/50 focus:outline-none"
                placeholder="Ticker"
              />
              <button
                type="button"
                onClick={() => handleSubmit()}
                className="px-4 py-1.5 rounded-lg bg-blue-500 text-white text-sm font-semibold hover:bg-blue-400"
              >
                Load
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {CHIPS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => handleSubmit(c)}
                className={`px-2 py-1 rounded text-[10px] font-mono-nexus border transition ${
                  sym === c
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                    : 'text-slate-500 border-slate-700 hover:border-slate-500'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-slate-700/50">
            {INTERVALS.map((i) => (
              <button
                key={i.value}
                type="button"
                onClick={() => setInterval(i.value)}
                className={`px-2 py-1 rounded text-[10px] font-mono-nexus ${
                  interval === i.value ? 'bg-slate-600 text-white' : 'text-slate-500 hover:bg-slate-800'
                }`}
              >
                {i.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Primary TradingView chart — full native toolbar & drawings */}
      <div className="nexus-panel overflow-hidden flex flex-col shrink-0">
        <div className="px-4 py-2 border-b border-slate-700/50 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Advanced Chart</span>
          <a
            href={`https://www.tradingview.com/chart/?symbol=${encodeURIComponent(toTradingViewSymbol(sym))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-blue-400 hover:text-blue-300"
          >
            Open in TradingView ↗
          </a>
        </div>
        <div className="p-1">
          <TradingViewChart ticker={sym} interval={interval} height={chartHeight} />
        </div>
      </div>

      {/* Side panels: Technical Analysis + Symbol data */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <div className="nexus-panel overflow-hidden">
          <div className="px-4 py-2 border-b border-slate-700/50 flex gap-2">
            {[
              ['technicals', 'Technical Analysis'],
              ['info', 'Symbol Info'],
              ['financials', 'Financials'],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`text-[10px] px-2 py-1 rounded ${
                  tab === id ? 'bg-blue-500/20 text-blue-300' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="p-2">
            {tab === 'technicals' && <TradingViewTechnicalAnalysis ticker={sym} height={400} />}
            {tab === 'info' && <TradingViewSymbolInfo ticker={sym} height={400} />}
            {tab === 'financials' && <TradingViewFinancials ticker={sym} height={400} />}
          </div>
        </div>

        <div className="nexus-panel p-4 text-xs text-slate-400 space-y-2">
          <p className="text-slate-300 font-semibold text-sm">Using TradingView for analysis</p>
          <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
            <li>Use the chart toolbar for indicators, drawings, and layouts</li>
            <li>Change symbol and interval directly on the chart</li>
            <li>Technical Analysis tab shows buy/sell/neutral ratings from TradingView</li>
            <li>Symbol Info shows live stats; Financials shows fundamentals</li>
          </ul>
          <p className="text-[10px] text-slate-500 pt-2 border-t border-slate-700/50">
            Data & charts © TradingView. Not investment advice.
          </p>
        </div>
      </div>
    </div>
  )
}
