import { NAV_ITEMS } from '../constants'

export default function Sidebar({ view, onNavigate, onLegacy, alertCount = 3 }) {
  return (
    <aside className="w-52 shrink-0 flex flex-col border-r border-slate-700/50 bg-[#070b14]">
      <div className="px-4 py-5 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
            α
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">AlphaScope</p>
            <p className="text-[10px] text-cyan-400/80 tracking-wider">NEXUS</p>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 mt-2 leading-snug">Private Investor Intelligence</p>
      </div>

      <nav className="flex-1 py-3 px-2 space-y-0.5">
        {NAV_ITEMS.filter((n) => n.id !== 'legacy').map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-sm transition ${
              view === item.id
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
            }`}
          >
            <span className="text-xs opacity-70">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
            {item.id === 'compare' && (
              <span className="ml-auto text-[9px] bg-violet-500/20 text-violet-300 px-1.5 rounded">4</span>
            )}
          </button>
        ))}
        <div className="pt-4 mt-4 border-t border-slate-800">
          {['Watchlists', 'Notes', 'Alerts', 'Reports', 'Settings'].map((label) => (
            <button
              key={label}
              type="button"
              className="w-full flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-slate-300 text-xs rounded-lg hover:bg-slate-800/30"
            >
              {label}
              {label === 'Alerts' && alertCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {alertCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>

      <div className="p-3 m-2 space-y-2">
        <button
          type="button"
          onClick={onLegacy}
          className="w-full text-left text-[10px] text-slate-500 hover:text-cyan-400 px-2 py-1"
        >
          ☰ Classic Patel tools
        </button>
        <div className="rounded-lg bg-slate-900/80 border border-slate-700/50 p-2">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Nexus Vault</p>
          <p className="text-[10px] text-emerald-400/80 mt-1">🔒 Encrypted workspace</p>
        </div>
      </div>
    </aside>
  )
}
