import { Panel, GaugeRing, FactorDots } from './ui'

export default function DecisionPanel({ stocks, advisor, focusTicker, onFocus }) {
  const ranked = [...stocks].sort((a, b) => (a.riskScore ?? 50) - (b.riskScore ?? 50))
  const top = ranked[0]
  const pick = focusTicker || top?.ticker
  const adv = advisor || {}
  const factors = adv.factors || { momentum: 4, valuation: 3, quality: 5, risk: 4, timing: 4 }

  return (
    <Panel title="Explainable Decision Engine" className="h-full flex flex-col">
      <div className="space-y-4">
        <div className="text-center p-3 rounded-lg bg-slate-900/60 border border-cyan-500/20">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Top Pick</p>
          <p className="text-2xl font-mono font-bold text-cyan-300 mt-1">{pick}</p>
          <div className="mt-2">
            <GaugeRing value={adv.confidence ?? 86} stroke="#22d3ee" size={72} />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">{adv.confidence ?? 86}% confidence</p>
        </div>

        <div>
          <p className="text-[10px] text-slate-500 uppercase mb-2">Ranking</p>
          <table className="w-full text-[11px]">
            <thead>
              <tr className="text-slate-500">
                <th className="text-left py-1">#</th>
                <th className="text-left">Ticker</th>
                <th className="text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((s, i) => (
                <tr
                  key={s.ticker}
                  className={`border-t border-slate-800 cursor-pointer hover:bg-slate-800/40 ${pick === s.ticker ? 'text-cyan-300' : 'text-slate-300'}`}
                  onClick={() => onFocus?.(s.ticker)}
                >
                  <td className="py-1.5">{i + 1}</td>
                  <td className="font-mono font-bold">{s.ticker}</td>
                  <td className="text-right font-mono">{100 - (s.riskScore ?? 40)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <p className="text-[10px] text-cyan-400 uppercase mb-2">Why {pick}?</p>
          {Object.entries(factors).map(([k, v]) => (
            <div key={k} className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-xs text-slate-400 capitalize">{k}</span>
              <FactorDots value={v} />
            </div>
          ))}
        </div>

        {adv.action && (
          <div className="text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500 text-white text-sm font-bold">
              {adv.action}
            </span>
          </div>
        )}
      </div>
    </Panel>
  )
}
