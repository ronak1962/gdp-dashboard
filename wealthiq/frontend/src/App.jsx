import { useState } from 'react'
import Terminal from './components/Terminal'
import AIAdvisor from './components/AIAdvisor'
import Discover from './components/Discover'
import StockAnalysis from './components/StockAnalysis'
import Dashboard from './components/Dashboard'
import Chart from './components/Chart'

const TABS = [
  { id: 'dashboard', label: '🏠 Dashboard', activeClass: 'bg-orange-500 text-white' },
  { id: 'terminal', label: '⌨ Terminal', activeClass: 'bg-gray-900 text-cyan-400 ring-1 ring-cyan-500' },
  { id: 'charts', label: '📈 Charts', activeClass: 'bg-blue-600 text-white' },
  { id: 'analysis', label: '📊 Stock Analysis', activeClass: 'bg-orange-500 text-white' },
  { id: 'advisor', label: '🤖 AI Advisor', activeClass: 'bg-gradient-to-r from-navy to-blue-600 text-white' },
  { id: 'discover', label: '🔍 Discover', activeClass: 'bg-green-600 text-white' },
]

export default function App() {
  const [tab, setTab] = useState('dashboard')

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <header className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-navy flex items-center justify-center">
          <span className="text-white font-bold text-lg">P</span>
        </div>
        <h1 className="text-2xl font-bold text-navy">Patel Analysis</h1>
        <span className="text-sm text-gray-500 mt-1">Portfolio & Wealth Advisory Terminal</span>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {TABS.map(({ id, label, activeClass }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              tab === id ? activeClass : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
    </div>
  )
}
