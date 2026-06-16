import { Panel, Sparkline, GaugeRing, DonutChart } from './ui'

export default function KpiRow({ topPick = 'MSFT' }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      <Panel title="Sector Momentum" subtitle="+18.6%" className="nexus-kpi" bodyClass="p-3 pt-2">
        <Sparkline points={[28, 32, 35, 38, 42, 45, 48, 52, 55, 58, 62]} color="#3b82f6" width={140} height={44} filled />
        <p className="text-[11px] text-emerald-400 font-semibold mt-2 font-mono-nexus">+18.6%</p>
        <p className="text-[9px] text-slate-500">Tech sector leading</p>
      </Panel>

      <Panel title="Relative Valuation Score" subtitle="74/100" className="nexus-kpi" bodyClass="p-3 flex flex-col items-center">
        <GaugeRing value={74} stroke="#f59e0b" size={64} label="74" />
        <p className="text-[10px] text-amber-400/90 mt-2 text-center">Slightly Overvalued</p>
      </Panel>

      <Panel title="Liquidity Pulse" subtitle="High" className="nexus-kpi" bodyClass="p-3 pt-2">
        <Sparkline points={[48, 50, 52, 55, 54, 58, 60, 62, 65, 63, 68]} color="#22c55e" width={140} height={44} filled />
        <p className="text-[11px] text-emerald-400 font-semibold mt-2">High</p>
        <p className="text-[9px] text-slate-500 font-mono-nexus">$186B volume</p>
      </Panel>

      <Panel title="Best Risk-Adjusted Return" subtitle="Sharpe 2.08" className="nexus-kpi" bodyClass="p-3">
        <p className="text-3xl font-bold text-white font-mono-nexus">{topPick}</p>
        <p className="text-[11px] text-cyan-400 mt-1 font-mono-nexus">Sharpe 2.08</p>
        <p className="text-[9px] text-slate-500 mt-2">Top risk-adjusted pick</p>
      </Panel>

      <Panel title="AI Confidence Index" className="nexus-kpi" bodyClass="p-3 flex flex-col items-center">
        <DonutChart value={83} color="#22d3ee" />
        <p className="text-[9px] text-slate-500 mt-2">Model consensus</p>
      </Panel>

      <Panel title="Portfolio Fit" subtitle="92/100" className="nexus-kpi" bodyClass="p-3 flex flex-col items-center">
        <DonutChart value={92} color="#a855f7" />
        <p className="text-[10px] text-emerald-400 font-semibold mt-2">Excellent</p>
      </Panel>
    </div>
  )
}
