import { NAV_PRIMARY, NAV_SECONDARY } from '../constants'

const ICONS = {
  overview: '▣',
  compare: '◫',
  analyze: '⚡',
  deep: '◧',
}

export default function Sidebar({ view, onNavigate, onLegacy, alertCount = 3 }) {
  return (
    <aside className="w-[220px] shrink-0 flex flex-col border-r border-slate-800/80 bg-[#060a12]">
      <div className="px-4 py-5 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <span className="text-white font-bold text-lg">α</span>
          </div>
          <div>
            <p className="text-white font-bold text-[15px] leading-none tracking-tight">AlphaScope</p>
            <p className="text-[11px] font-semibold text-cyan-400 tracking-[0.2em] mt-0.5">NEXUS</p>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 mt-3 leading-relaxed">
          Private Investor Intelligence
        </p>
      </div>

      <nav className="flex-1 py-4 px-2.5 space-y-1 nexus-scroll overflow-y-auto">
        {NAV_PRIMARY.map((item) => {
          const active = view === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-[13px] transition ${
                active ? 'nexus-sidebar-active font-semibold' : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
              }`}
            >
              <span className="w-5 text-center text-slate-500">{ICONS[item.id] || '•'}</span>
              {item.label}
            </button>
          )
        })}

        <div className="pt-5 mt-3 border-t border-slate-800/80 space-y-0.5">
          {NAV_SECONDARY.map((item) => (
            <button
              key={item.id}
              type="button"
              className="w-full flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-300 text-[12px] rounded-lg hover:bg-slate-800/30"
            >
              <span className="w-5" />
              {item.label}
              {item.badge > 0 && (
                <span className="ml-auto min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {alertCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>

      <div className="p-3 border-t border-slate-800/80 space-y-2">
        <button type="button" onClick={onLegacy} className="w-full text-left text-[10px] text-slate-600 hover:text-cyan-400 px-2">
          Classic tools →
        </button>
        <div className="rounded-xl bg-slate-900/60 border border-slate-700/50 p-3">
          <p className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold">Nexus Vault</p>
          <p className="text-[11px] text-emerald-400/90 mt-1.5 flex items-center gap-1">
            <span>🔒</span> Encrypted workspace
          </p>
        </div>
      </div>
    </aside>
  )
}
