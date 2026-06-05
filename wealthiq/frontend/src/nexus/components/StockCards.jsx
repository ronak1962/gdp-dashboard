import { Sparkline, colorFor } from './ui'

export default function StockCards({ stocks, onSelect, activeTicker }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      {stocks.map((s) => {
        const up = (s.change ?? 0) >= 0
        const conv = s.conviction || (s.riskScore < 40 ? 'High Conviction' : 'Moderate Conviction')
        const convColor = conv.toLowerCase().includes('very') || conv.toLowerCase().includes('high')
          ? 'text-emerald-400 bg-emerald-400/10'
          : 'text-amber-400 bg-amber-400/10'
        return (
          <button
            key={s.ticker}
            type="button"
            onClick={() => onSelect?.(s.ticker)}
            className={`nexus-panel text-left transition hover:border-cyan-500/40 ${
              activeTicker === s.ticker ? 'ring-1 ring-cyan-500/50' : ''
            }`}
          >
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: `${colorFor(s.ticker)}33`, color: colorFor(s.ticker) }}
                  >
                    {s.ticker[0]}
                  </div>
                  <div>
                    <p className="font-mono font-bold text-white">{s.ticker}</p>
                    <p className="text-[10px] text-slate-500 truncate max-w-[100px]">{s.name}</p>
                  </div>
                </div>
                <span className={`text-xs font-mono font-bold ${up ? 'text-emerald-400' : 'text-red-400'}`}>
                  {up ? '+' : ''}{s.change?.toFixed(2)}%
                </span>
              </div>
              <p className="text-xl font-mono font-bold text-white mt-2">${s.price?.toFixed(2)}</p>
              <Sparkline
                points={generateSpark(s.ticker, s.change)}
                color={colorFor(s.ticker)}
                width={200}
                height={32}
              />
              <div className="flex justify-between items-center mt-2 text-[10px]">
                <span className="text-slate-500">Mkt Cap ${s.marketCap}B</span>
                <span className={`px-1.5 py-0.5 rounded ${convColor}`}>{conv}</span>
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
  return Array.from({ length: 12 }, (_, i) => 45 + (seed % 15) + i * (change >= 0 ? 1.2 : -0.8) + Math.sin(i + seed) * 4)
}
