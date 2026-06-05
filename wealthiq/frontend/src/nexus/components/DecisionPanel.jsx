import { Panel, GaugeRing, FactorDots } from './ui'

export default function DecisionPanel({ stocks, advisor, focusTicker, onFocus, onOpenStock, onOpenDeep }) {
  const ranked = [...stocks].sort((a, b) => (b.rankScore ?? 100 - b.riskScore) - (a.rankScore ?? 100 - a.riskScore))
  const pick = focusTicker || ranked[0]?.ticker || 'MSFT'
  const adv = advisor || {}
  const factors = adv.factors || { momentum: 5, valuation: 4, quality: 5, risk: 4, timing: 4 }
  const confidence = adv.confidence ?? stocks.find((s) => s.ticker === pick)?.confidence ?? 86

  return (
    <Panel title="Explainable Decision Engine" bodyClass="p-4 space-y-4">
      <div className="rounded-xl bg-gradient-to-b from-cyan-500/10 to-transparent border border-cyan-500/25 p-4 text-center">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Top Pick</p>
        <p className="text-3xl font-mono-nexus font-bold text-cyan-300 mt-1">{pick}</p>
        <div className="mt-3 flex justify-center">
          <GaugeRing value={confidence} stroke="#22d3ee" size={88} label={`${confidence}%`} />
        </div>
        <p className="text-[10px] text-slate-500 mt-2">AI confidence</p>
      </div>

      <div>
        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-semibold">Ranking</p>
        <table className="w-full text-[11px]">
          <thead>
            <tr className="text-slate-500 border-b border-slate-700/50">
              <th className="text-left py-1.5 font-medium">#</th>
              <th className="text-left">Ticker</th>
              <th className="text-right">Score</th>
              <th className="text-right">Conf.</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((s, i) => (
              <tr
                key={s.ticker}
                onClick={() => {
                  if (onOpenDeep) onOpenDeep(s.ticker)
                  else if (onOpenStock) onOpenStock(s.ticker)
                  else onFocus?.(s.ticker)
                }}
                className={`border-b border-slate-800/60 cursor-pointer transition hover:bg-slate-800/30 ${
                  pick === s.ticker ? 'text-cyan-300 bg-cyan-500/5' : 'text-slate-300'
                }`}
              >
                <td className="py-2 font-mono-nexus text-slate-500">{i + 1}</td>
                <td className="py-2 font-mono-nexus font-bold">{s.ticker}</td>
                <td className="py-2 text-right font-mono-nexus">{s.rankScore ?? 100 - (s.riskScore ?? 40)}</td>
                <td className="py-2 text-right font-mono-nexus text-cyan-400/80">{s.confidence ?? 70}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg bg-[#080c18]/60 border border-slate-700/40 p-3">
        <p className="text-[11px] text-cyan-400 font-semibold mb-3">Why {pick}?</p>
        {Object.entries(factors).map(([k, v]) => (
          <div key={k} className="flex items-center justify-between py-2 border-b border-slate-800/50 last:border-0">
            <span className="text-xs text-slate-400 capitalize">{k}</span>
            <FactorDots value={v} />
          </div>
        ))}
      </div>
    </Panel>
  )
}
