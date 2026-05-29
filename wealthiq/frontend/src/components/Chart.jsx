import { useState, useEffect, useRef } from 'react'
import { DEFAULT_TICKERS } from '../constants/tickers'

function TradingViewChart({ symbol, interval }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: interval,
      timezone: "America/New_York",
      theme: "dark",
      style: "1",
      locale: "en",
      backgroundColor: "rgba(10, 14, 23, 1)",
      gridColor: "rgba(30, 40, 55, 0.5)",
      allow_symbol_change: true,
      calendar: false,
      support_host: "https://www.tradingview.com",
      studies: [
        "RSI@tv-basicstudies",
        "MASimple@tv-basicstudies",
        "MACD@tv-basicstudies"
      ],
    })

    const wrapper = document.createElement('div')
    wrapper.className = 'tradingview-widget-container__widget'
    wrapper.style.height = '100%'
    wrapper.style.width = '100%'

    containerRef.current.appendChild(wrapper)
    containerRef.current.appendChild(script)
  }, [symbol, interval])

  return (
    <div className="tradingview-widget-container" ref={containerRef} style={{ height: '100%', width: '100%' }} />
  )
}

export default function Chart() {
  const [symbol, setSymbol] = useState('NASDAQ:NVDA')
  const [ticker, setTicker] = useState('NVDA')
  const [interval, setInterval] = useState('D')

  const handleSearch = (t) => {
    const sym = (t || ticker).trim().toUpperCase()
    if (!sym) return
    setTicker(sym)
    setSymbol(`NASDAQ:${sym}`)
  }

  const intervals = [
    { label: '1m', value: '1' },
    { label: '5m', value: '5' },
    { label: '15m', value: '15' },
    { label: '1H', value: '60' },
    { label: '4H', value: '240' },
    { label: '1D', value: 'D' },
    { label: '1W', value: 'W' },
    { label: '1M', value: 'M' },
  ]

  return (
    <div className="bg-[#0a0e17] rounded-xl border border-gray-800 overflow-hidden" style={{ minHeight: '700px' }}>
      {/* Header */}
      <div className="bg-[#0f1520] border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-orange-400 font-bold text-sm font-mono">CHARTS</span>
          <span className="text-gray-600">|</span>
          <span className="text-white text-xs font-mono">{symbol}</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
          <span>RSI • MACD • SMA • Volume</span>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
          <span>LIVE</span>
        </div>
      </div>

      {/* Controls */}
      <div className="border-b border-gray-800 px-4 py-2 flex items-center gap-3 flex-wrap">
        {/* Ticker search */}
        <div className="flex items-center gap-2">
          <input
            className="bg-[#1a2332] border border-gray-700 rounded px-3 py-1.5 text-xs text-white font-mono placeholder-gray-500 focus:outline-none focus:border-orange-400 w-24"
            placeholder="TICKER"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={() => handleSearch()}
            className="px-3 py-1.5 bg-orange-500 text-white text-[10px] font-bold rounded hover:bg-orange-400 transition"
          >
            GO
          </button>
        </div>

        {/* Quick picks */}
        <div className="flex gap-1">
          {DEFAULT_TICKERS.map((c) => (
            <button
              key={c}
              onClick={() => handleSearch(c)}
              className={`px-2 py-1 text-[10px] font-mono rounded transition ${
                ticker === c ? 'bg-orange-500/20 text-orange-400 border border-orange-400/30' : 'text-gray-400 hover:text-orange-400 border border-gray-700 hover:border-orange-400/30'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Divider */}
        <span className="text-gray-700">|</span>

        {/* Timeframe */}
        <div className="flex gap-1">
          {intervals.map((i) => (
            <button
              key={i.value}
              onClick={() => setInterval(i.value)}
              className={`px-2 py-1 text-[10px] font-mono rounded transition ${
                interval === i.value ? 'bg-blue-500/20 text-blue-400 border border-blue-400/30' : 'text-gray-400 hover:text-blue-400 border border-gray-700 hover:border-blue-400/30'
              }`}
            >
              {i.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: '580px' }}>
        <TradingViewChart symbol={symbol} interval={interval} />
      </div>

      {/* Footer */}
      <div className="bg-[#0f1520] border-t border-gray-800 px-4 py-2 flex items-center justify-between text-[10px] text-gray-500 font-mono">
        <span>INDICATORS: RSI (14) • MACD (12,26,9) • SMA (20,50,200) • Volume</span>
        <span>Powered by TradingView • Free real-time data</span>
      </div>
    </div>
  )
}
