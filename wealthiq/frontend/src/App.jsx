import { useState } from 'react'
import AlphaScopeNexus from './nexus/AlphaScopeNexus'
import PortfolioPanel from './components/PortfolioPanel'
import Terminal from './components/Terminal'
import AIAdvisor from './components/AIAdvisor'
import Discover from './components/Discover'
import StockAnalysis from './components/StockAnalysis'
import Dashboard from './components/Dashboard'
import Chart from './components/Chart'

function LegacyApp({ onBackToNexus }) {
  const [tab, setTab] = useState('dashboard')

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 min-h-screen bg-gray-50">
      <header className="flex items-center gap-3 mb-6 flex-wrap">
        <button
          type="button"
          onClick={onBackToNexus}
          className="text-sm text-cyan-600 hover:underline"
        >
          ← AlphaScope Nexus
        </button>
        <div className="w-10 h-10 rounded-lg bg-navy flex items-center justify-center">
          <span className="text-white font-bold text-lg">P</span>
        </div>
        <h1 className="text-2xl font-bold text-navy">Patel Analysis</h1>
        <span className="text-sm text-gray-500 mt-1">Classic tools</span>
      </header>

      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          ['dashboard', '🏠 Dashboard'],
          ['terminal', '⌨ Terminal'],
          ['charts', '📈 Charts'],
          ['analysis', '📊 Stock Analysis'],
          ['advisor', '🤖 AI Advisor'],
          ['discover', '🔍 Discover'],
          ['portfolio', '💼 Portfolio'],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              tab === id ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'dashboard' && <Dashboard />}
      {tab === 'terminal' && <Terminal />}
      {tab === 'charts' && <Chart />}
      {tab === 'analysis' && <StockAnalysis />}
      {tab === 'advisor' && <AIAdvisor />}
      {tab === 'discover' && <Discover />}
      {tab === 'portfolio' && <PortfolioPanel />}
    </div>
  )
}

export default function App() {
  const [mode, setMode] = useState('nexus')

  if (mode === 'nexus') {
    return <AlphaScopeNexus onOpenLegacy={() => setMode('legacy')} />
  }

  return <LegacyApp onBackToNexus={() => setMode('nexus')} />
}
