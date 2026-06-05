import { useEffect, useState } from 'react'
import KpiRow from '../components/KpiRow'
import StockCards from '../components/StockCards'
import { Panel } from '../components/ui'
import { fetchMarketOverview, fetchTemplates } from '../api'
import { DEFAULT_COMPARE } from '../constants'

/** Design 1: First screen when client opens the site */
export default function OverviewView({ stocks, onNavigate, onAnalyzeTicker }) {
  const [market, setMarket] = useState(null)
  const [templates, setTemplates] = useState([])

  useEffect(() => {
    fetchMarketOverview().then(setMarket)
    fetchTemplates().then(setTemplates)
  }, [])

  return (
    <div className="space-y-4 p-4 overflow-y-auto flex-1">
      <div className="rounded-xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 p-5">
        <h2 className="text-lg font-bold text-white">Welcome to AlphaScope Nexus</h2>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          One dashboard for overview, stock analysis, deep dives, and 4-way peer comparison — no switching between apps.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          <ActionBtn onClick={() => onNavigate('analyze')}>Analyze a stock</ActionBtn>
          <ActionBtn onClick={() => onNavigate('deep')}>Deep dive</ActionBtn>
          <ActionBtn onClick={() => onNavigate('compare')}>Compare 4 stocks</ActionBtn>
        </div>
      </div>

      <KpiRow />

      {market?.indices?.length > 0 && (
        <Panel title="Live Market Pulse">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {market.indices.map((idx) => (
              <div key={idx.name} className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/40">
                <p className="text-[10px] text-slate-500">{idx.name}</p>
                <p className="font-mono text-lg text-white">${idx.price?.toFixed(2)}</p>
                <p className={`text-xs font-mono ${idx.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {idx.change >= 0 ? '+' : ''}{idx.change?.toFixed(2)}%
                </p>
              </div>
            ))}
          </div>
        </Panel>
      )}

      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 px-1">Featured watchlist</p>
        <StockCards
          stocks={stocks}
          onSelect={(t) => {
            onAnalyzeTicker(t)
            onNavigate('analyze')
          }}
        />
      </div>

      {templates.length > 0 && (
        <Panel title="Portfolio templates">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {templates.slice(0, 6).map((t) => (
              <div key={t.id} className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/40">
                <p className="text-sm font-semibold text-white">{t.name}</p>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{t.description}</p>
                <p className="text-[10px] text-cyan-400 mt-2">{t.stocks} stocks · {t.risk} risk</p>
              </div>
            ))}
          </div>
        </Panel>
      )}

      <Panel title="Quick start">
        <p className="text-xs text-slate-400">
          Default peer set: {DEFAULT_COMPARE.join(', ')}. Open <strong className="text-cyan-400">Peer Lab (4)</strong> for side-by-side analysis.
        </p>
      </Panel>
    </div>
  )
}

function ActionBtn({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-sm font-medium hover:bg-cyan-500/30 transition"
    >
      {children}
    </button>
  )
}
