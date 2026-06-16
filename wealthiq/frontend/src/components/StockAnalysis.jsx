import { useState } from 'react'
import StockTradingViewAnalysis from '../nexus/components/StockTradingViewAnalysis'

/** Stock analysis powered entirely by TradingView widgets */
export default function StockAnalysis() {
  const [ticker, setTicker] = useState('AAPL')

  return (
    <div className="bg-[#0a0e17] rounded-xl border border-gray-800 overflow-hidden min-h-[800px]">
      <div className="bg-[#0f1520] border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div>
          <span className="text-orange-400 font-bold text-sm font-mono">STOCK ANALYSIS</span>
          <span className="text-gray-600 mx-2">|</span>
          <span className="text-gray-400 text-xs">TradingView charts · technicals · financials</span>
        </div>
        <span className="text-[10px] text-gray-500 font-mono">Powered by TradingView</span>
      </div>
      <div className="p-4">
        <StockTradingViewAnalysis
          ticker={ticker}
          onTickerChange={setTicker}
          onSearch={setTicker}
          chartHeight={600}
        />
      </div>
    </div>
  )
}
