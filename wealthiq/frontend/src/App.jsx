import { useState } from 'react'
import PortfolioPanel from './components/PortfolioPanel'
import Terminal from './components/Terminal'
import AIAdvisor from './components/AIAdvisor'
import Discover from './components/Discover'
import StockAnalysis from './components/StockAnalysis'

export default function App() {
  const [tab, setTab] = useState('terminal')

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
        <button
          onClick={() => setTab('terminal')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
            tab === 'terminal' ? 'bg-gray-900 text-cyan-400 ring-1 ring-cyan-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          ⌨ Terminal
        </button>
        <button
          onClick={() => setTab('analysis')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
            tab === 'analysis' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          📊 Stock Analysis
        </button>
        <button
          onClick={() => setTab('advisor')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
            tab === 'advisor' ? 'bg-gradient-to-r from-navy to-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          🤖 AI Advisor
        </button>
        <button
          onClick={() => setTab('discover')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
            tab === 'discover' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          🔍 Discover
        </button>
        <button
          onClick={() => setTab('portfolio')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
            tab === 'portfolio' ? 'bg-navy text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          💼 Portfolio
        </button>
      </div>

      {tab === 'terminal' && <Terminal />}
      {tab === 'analysis' && <StockAnalysis />}
      {tab === 'advisor' && <AIAdvisor />}
      {tab === 'discover' && <Discover />}
      {tab === 'portfolio' && <PortfolioPanel />}
    </div>
  )
}
