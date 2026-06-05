import DecisionPanel from '../components/DecisionPanel'
import { ScenarioStudio, CatalystTimeline, ThesisBox, PerformanceDNA } from '../components/CompareExtras'
import { Panel, GaugeRing } from '../components/ui'
/** Design 3: Deep analysis of a single stock — decision engine + scenarios */
export default function DeepDiveView({
  ticker,
  setTicker,
  stock,
  advisor,
  loading,
  onSearch,
  thesis,
  setThesis,
}) {
  return (
    <div className="space-y-4 p-4 overflow-y-auto flex-1 nexus-scroll bg-transparent">
      <div className="flex flex-wrap gap-2 items-center">
        <input
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          className="w-32 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 font-mono text-white text-sm"
        />
        <button
          type="button"
          onClick={onSearch}
          className="px-4 py-2 rounded-lg bg-violet-500/80 text-white text-sm font-semibold hover:bg-violet-500"
        >
          Run deep analysis
        </button>
        {loading && <span className="text-xs text-slate-500 font-mono">Processing signals…</span>}
      </div>

      {stock && advisor && (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4">
          <div className="space-y-4">
            <Panel title={`${stock.ticker} — Deep Intelligence`} subtitle={stock.name}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] text-slate-500">Price</p>
                  <p className="text-2xl font-mono text-white">${stock.price?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">AI action</p>
                  <p className="text-xl font-bold text-emerald-400">{advisor.action}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">Price target</p>
                  <p className="text-xl font-mono text-cyan-300">${advisor.priceTarget}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">Stop loss</p>
                  <p className="text-xl font-mono text-red-400">${advisor.stopLoss}</p>
                </div>
              </div>
            </Panel>

            <ScenarioStudio ticker={stock.ticker} />
            <PerformanceDNA stocks={[stock]} />

            {advisor.signals?.length > 0 && (
              <Panel title="Signal breakdown">
                <ul className="space-y-2">
                  {advisor.signals.map((sig, i) => (
                    <li key={i} className="flex gap-2 text-xs border-b border-slate-800 pb-2">
                      <span className="font-bold text-cyan-400 w-12">{sig.action}</span>
                      <span className="text-slate-300 flex-1">{sig.reason}</span>
                      <span className="text-slate-500 font-mono">{sig.strength}%</span>
                    </li>
                  ))}
                </ul>
              </Panel>
            )}

            <Panel title="AI thesis">
              <p className="text-sm text-slate-300 leading-relaxed">{advisor.thesis}</p>
            </Panel>
          </div>

          <div className="space-y-4">
            <DecisionPanel stocks={[stock]} advisor={advisor} focusTicker={stock.ticker} />
            <Panel title="Confidence">
              <GaugeRing value={advisor.confidence ?? 80} size={90} stroke="#a855f7" />
            </Panel>
            <CatalystTimeline />
            <ThesisBox value={thesis} onChange={setThesis} ticker={stock.ticker} />
          </div>
        </div>
      )}

      {!stock && !loading && (
        <div className="text-center py-16 text-slate-500">Select a ticker for institutional-grade deep dive</div>
      )}
    </div>
  )
}
