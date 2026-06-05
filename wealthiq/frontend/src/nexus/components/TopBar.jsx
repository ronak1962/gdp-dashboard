import { SECTORS, TIMEFRAMES, RISK_PROFILES } from '../constants'

export default function TopBar({
  search,
  onSearch,
  onSearchSubmit,
  sector,
  setSector,
  timeframe,
  setTimeframe,
  riskProfile,
  setRiskProfile,
  viewLabel,
}) {
  return (
    <header className="border-b border-slate-700/50 bg-[#0a0f1a]/95 backdrop-blur px-5 py-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] max-w-xl">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">⌕</span>
            <input
              type="text"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit?.()}
              placeholder="Search companies, sectors, metrics..."
              className="w-full bg-slate-900/80 border border-slate-600/50 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        </div>

        <FilterSelect label="Sector" value={sector} options={SECTORS} onChange={setSector} />
        <FilterSelect label="Timeframe" value={timeframe} options={TIMEFRAMES} onChange={setTimeframe} />
        <FilterSelect label="Risk Profile" value={riskProfile} options={RISK_PROFILES} onChange={setRiskProfile} />

        <div className="ml-auto flex items-center gap-3">
          <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">{viewLabel}</span>
          <button type="button" className="text-xs text-slate-400 border border-slate-600 rounded-lg px-3 py-1.5 hover:border-cyan-500/40">
            Client Workspace
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 border border-slate-500" title="Profile" />
        </div>
      </div>
    </header>
  )
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <label className="flex items-center gap-1.5 text-[10px] text-slate-500">
      <span className="uppercase tracking-wider">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-900 border border-slate-600/50 rounded-md px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}
