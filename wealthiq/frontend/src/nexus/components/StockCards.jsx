import { Sparkline, colorFor } from './ui'
import { STOCK_LOGO_BG } from '../constants'

export default function StockCards({ stocks, onSelect, activeTicker }) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
      {stocks.map((s) => {
        const up = (s.change ?? 0) >= 0
        const accent = colorFor(s.ticker)
        const conv = s.conviction || 'High Conviction'
        const isHigh = conv.toLowerCase().includes('very') || (conv.toLowerCase().includes('high') && !conv.toLowerCase().includes('moderate'))
        return (
          <button
            key={s.ticker}
            type="button"
            onClick={() => onSelect?.(s.ticker)}
            style={{ '--stock-accent': accent }}
            className={`nexus-panel nexus-stock-card text-left w-full transition hover:scale-[1.01] ${
              activeTicker === s.ticker ? 'ring-2 ring-cyan-400/50' : ''
            }`}
          >
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-inner"
                    style={{ background: STOCK_LOGO_BG[s.ticker] || `linear-gradient(135deg, ${accent}, #1e293b)` }}
                  >
                    {s.ticker.slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-mono-nexus font-bold text-white text-base">{s.ticker}</p>
                    <p className="text-[10px] text-slate-500 max-w-[110px] truncate">{s.name}</p>
                  </div>
                </div>
                <span className={`text-sm font-mono-nexus font-bold ${up ? 'text-emerald-400' : 'text-red-400'}`}>
                  {up ? '+' : ''}{s.change?.toFixed(2)}%
                </span>
              </div>

              <p className="text-2xl font-mono-nexus font-bold text-white mt-3 tracking-tight">
                ${s.price?.toFixed(2)}
              </p>

              <div className="mt-2 -mx-1">
                <Sparkline
                  points={generateSpark(s.ticker, s.change)}
                  color={accent}
                  width={200}
                  height={44}
                  filled
                />
              </div>

              <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-700/40">
                <span className="text-[10px] text-slate-500 font-mono-nexus">${s.marketCap}B cap</span>
                <span
                  className={`text-[9px] font-semibold px-2 py-0.5 rounded-md ${
                    isHigh ? 'text-emerald-300 bg-emerald-500/15 border border-emerald-500/25' : 'text-amber-300 bg-amber-500/15 border border-amber-500/25'
                  }`}
                >
                  {conv}
                </span>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

function generateSpark(ticker, change = 0) {
  const seed = ticker.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return Array.from({ length: 14 }, (_, i) => 40 + (seed % 12) + i * (change >= 0 ? 1.5 : -0.9) + Math.sin(i * 0.8 + seed) * 5)
}
