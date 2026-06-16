import { Panel, GaugeRing, SignalBadge } from '../components/ui'
import StockCards from '../components/StockCards'

/** Design 2: Client analyzes a single stock */
export default function AnalyzeView({
  ticker,
  setTicker,
  stock,
  loading,
  onSearch,
  onDeepDive,
  onAddToCompare,
  relatedStocks,
}) {
  return (
    <div className="space-y-4 p-4 overflow-y-auto flex-1 nexus-scroll bg-transparent">
      <div className="flex flex-wrap gap-2 items-end">
        <div className="flex-1 min-w-[200px] max-w-md">
          <label className="text-[10px] text-slate-500 uppercase tracking-wider">Ticker</label>
          <div className="flex gap-2 mt-1">
            <input
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && onSearch()}
              className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 font-mono text-white focus:outline-none focus:border-cyan-500/50"
              placeholder="e.g. NVDA"
            />
            <button
              type="button"
              onClick={onSearch}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-900 font-semibold text-sm hover:bg-cyan-400 disabled:opacity-50"
            >
              {loading ? '…' : 'Analyze'}
            </button>
          </div>
        </div>
        {stock && (
          <div className="flex gap-2">
            <button type="button" onClick={onDeepDive} className="px-3 py-2 text-xs rounded-lg border border-violet-500/40 text-violet-300 hover:bg-violet-500/10">
              Deep dive →
            </button>
            <button type="button" onClick={onAddToCompare} className="px-3 py-2 text-xs rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800">
              Add to Peer Lab
            </button>
          </div>
        )}
      </div>

      {loading && (
        <div className="text-center py-16 text-slate-500 text-sm font-mono">Loading analysis…</div>
      )}

      {!loading && stock && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Panel title={stock.ticker} subtitle={stock.name} className="lg:col-span-2">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-3xl font-mono font-bold text-white">${stock.price?.toFixed(2)}</p>
                  <p className={`text-lg font-mono ${stock.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change?.toFixed(2)}%
                  </p>
                </div>
                <SignalBadge signal={stock.signal} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                <Metric label="Market Cap" value={`$${stock.marketCap}B`} />
                <Metric label="P/E" value={stock.pe?.toFixed(1)} />
                <Metric label="Beta" value={stock.beta?.toFixed(2)} />
                <Metric label="52W Range" value={`$${stock.low52?.toFixed(0)} – $${stock.high52?.toFixed(0)}`} />
              </div>
            </Panel>
            <Panel title="Risk profile">
              <GaugeRing value={100 - (stock.riskScore ?? 50)} stroke="#22d3ee" size={80} />
              <p className="text-center text-sm text-white mt-2">{stock.riskLevel}</p>
              <p className="text-center text-[10px] text-slate-500">Risk score {stock.riskScore}/100</p>
            </Panel>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Panel title="Fundamentals">
              <Stat label="Revenue growth" value={`${stock.revenueGrowth?.toFixed(1)}%`} />
              <Stat label="ROIC" value={`${stock.roic?.toFixed(1)}%`} />
              <Stat label="FCF yield" value={`${stock.fcfYield?.toFixed(1)}%`} />
              <Stat label="Quality score" value={stock.quality} />
            </Panel>
            <Panel title="Technicals">
              <Stat label="RSI (14)" value={stock.rsi} />
              <Stat label="Volatility" value={`${stock.volatility}%`} />
              <Stat label="1Y return" value={`${stock.return1Y?.toFixed(1)}%`} />
              <Stat label="Conviction" value={stock.conviction} />
            </Panel>
          </div>
        </>
      )}

      {!loading && !stock && (
        <div className="text-center py-12 text-slate-500 text-sm">Enter a ticker and press Analyze</div>
      )}

      {relatedStocks?.length > 0 && (
        <div>
          <p className="text-xs text-slate-500 uppercase mb-2">Related peers</p>
          <StockCards stocks={relatedStocks} onSelect={(t) => { setTicker(t); onSearch?.(t) }} />
        </div>
      )}
    </div>
  )
}

function Metric({ label, value }) {
  return (
    <div className="bg-slate-900/50 rounded-lg p-2 border border-slate-700/40">
      <p className="text-[10px] text-slate-500">{label}</p>
      <p className="font-mono text-sm text-white">{value}</p>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="flex justify-between py-2 border-b border-slate-800 text-xs">
      <span className="text-slate-500">{label}</span>
      <span className="font-mono text-white">{value}</span>
    </div>
  )
}
