import { useState } from 'react'
import StockTradingViewAnalysis from '../nexus/components/StockTradingViewAnalysis'

export default function Chart() {
  const [ticker, setTicker] = useState('NVDA')

  return (
    <div className="bg-[#0a0e17] rounded-xl border border-gray-800 overflow-hidden min-h-[700px]">
      <div className="p-4">
        <StockTradingViewAnalysis ticker={ticker} onTickerChange={setTicker} onSearch={setTicker} chartHeight={580} />
      </div>
    </div>
  )
}
