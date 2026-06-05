import { Panel, Sparkline, GaugeRing } from './ui'

export default function KpiRow({ topPick = 'MSFT' }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      <Kpi title="Sector Momentum" sub="+18.6%">
        <Sparkline points={[30, 35, 38, 42, 45, 48, 52, 55, 58, 62]} color="#3b82f6" />
        <p className="text-[10px] text-emerald-400 mt-2 font-mono">Tech sector leading</p>
      </Kpi>
      <Kpi title="Relative Valuation" sub="74/100">
        <GaugeRing value={74} stroke="#f59e0b" />
        <p className="text-[10px] text-amber-400/90 text-center mt-1">Slightly overvalued</p>
      </Kpi>
      <Kpi title="Liquidity Pulse" sub="High">
        <Sparkline points={[50, 52, 55, 54, 58, 60, 62, 65, 63, 68]} color="#22c55e" />
        <p className="text-[10px] text-slate-400 mt-2 font-mono">$186B volume</p>
      </Kpi>
      <Kpi title="Best Risk-Adj. Return" sub="Sharpe 2.08">
        <p className="text-2xl font-bold text-white font-mono">{topPick}</p>
        <p className="text-[10px] text-cyan-400">Top risk-adjusted pick</p>
      </Kpi>
      <Kpi title="AI Confidence" sub="83%">
        <GaugeRing value={83} stroke="#22d3ee" />
      </Kpi>
      <Kpi title="Portfolio Fit" sub="92/100">
        <GaugeRing value={92} stroke="#a855f7" />
        <p className="text-[10px] text-emerald-400 text-center mt-1">Excellent</p>
      </Kpi>
    </div>
  )
}

function Kpi({ title, sub, children }) {
  return (
    <Panel title={title} subtitle={sub} className="!p-0">
      <div className="min-h-[72px] flex flex-col justify-center">{children}</div>
    </Panel>
  )
}
