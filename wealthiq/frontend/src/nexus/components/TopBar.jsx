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
}) {
  return (
    <header className="border-b border-slate-800/80 bg-[#080c14]/90 backdrop-blur-md shrink-0">
      <div className="px-5 py-2.5 border-b border-slate-800/40">
        <h1 className="text-[15px] font-semibold text-white tracking-tight">
          AlphaScope Nexus
          <span className="text-slate-500 font-normal"> · Private Investor Intelligence</span>
        </h1>
      </div>
      <div className="px-5 py-3 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[240px] max-w-2xl">
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3-3" />
              </svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit?.()}
              placeholder="Search companies, sectors, metrics..."
              className="w-full bg-[#0c1220] border border-slate-700/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20"
            />
          </div>
        </div>

        <FilterSelect label="Sector" value={sector} options={SECTORS} onChange={setSector} />
        <FilterSelect label="Timeframe" value={timeframe} options={TIMEFRAMES} onChange={setTimeframe} />
        <FilterSelect label="Risk Profile" value={riskProfile} options={RISK_PROFILES} onChange={setRiskProfile} />

        <div className="ml-auto flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
            <span className="w-8 h-4 rounded-full bg-cyan-500/30 border border-cyan-500/50 relative">
              <span className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-cyan-400" />
            </span>
            Client Workspace
          </label>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 border-2 border-slate-600" />
        </div>
      </div>
    </header>
  )
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[9px] text-slate-500 uppercase tracking-wider font-medium">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[#0c1220] border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs text-slate-200 min-w-[100px] focus:outline-none focus:border-cyan-500/40"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  )
}
