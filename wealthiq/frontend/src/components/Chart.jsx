import { useState, useEffect, useRef } from 'react'
import { API_BASE_URL } from '../config/api'
import { DEFAULT_TICKERS } from '../constants/tickers'
import { changeArrow, changePrefix, changeTextClass, isPositiveChange } from '../utils/marketDisplay'

const MARKET_COLORS = {
  positive: '#22c55e',
  negative: '#ef4444',
}

const TRADING_VIEW_SYMBOLS = {
  JPM: 'NYSE:JPM',
  JNJ: 'NYSE:JNJ',
  VTI: 'AMEX:VTI',
}

function getTradingViewSymbol(ticker) {
  return TRADING_VIEW_SYMBOLS[ticker] || `NASDAQ:${ticker}`
}

function MarketDirectionBadge({ quote }) {
  if (!quote) {
    return (
      <span className="px-3 py-1.5 rounded border border-gray-700 text-gray-400 text-[10px] font-mono">
        LOADING QUOTE...
      </span>
    )
  }

  const isPositive = isPositiveChange(quote.change)
  const color = isPositive ? MARKET_COLORS.positive : MARKET_COLORS.negative
  return (
    <span
      className="px-3 py-1.5 rounded border text-[10px] font-mono font-bold"
      style={{
        color,
        borderColor: `${color}66`,
        backgroundColor: `${color}1a`,
      }}
    >
      MARKET {isPositive ? 'POSITIVE' : 'NEGATIVE'} | ${quote.price?.toFixed(2)} {changeArrow(quote.change)} {changePrefix(quote.change)}{quote.change?.toFixed(2)}%
    </span>
  )
}

function TradingViewChart({ symbol, interval, marketColor }) {
  const containerRef = useRef(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!containerRef.current) return
    let hideLoadingTimer

    setLoading(true)
    containerRef.current.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.type = 'text/javascript'
    script.async = true
    script.onload = () => {
      hideLoadingTimer = window.setTimeout(() => setLoading(false), 600)
    }
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: interval,
      timezone: "America/New_York",
      theme: "dark",
      style: "3",
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
      overrides: {
        "mainSeriesProperties.style": 3,
        "mainSeriesProperties.lineStyle.color": marketColor,
        "mainSeriesProperties.lineStyle.linewidth": 2,
        "mainSeriesProperties.areaStyle.color1": `${marketColor}55`,
        "mainSeriesProperties.areaStyle.color2": `${marketColor}05`,
        "mainSeriesProperties.areaStyle.linecolor": marketColor,
        "mainSeriesProperties.areaStyle.linewidth": 2,
        "mainSeriesProperties.candleStyle.upColor": MARKET_COLORS.positive,
        "mainSeriesProperties.candleStyle.downColor": MARKET_COLORS.negative,
        "mainSeriesProperties.candleStyle.borderUpColor": MARKET_COLORS.positive,
        "mainSeriesProperties.candleStyle.borderDownColor": MARKET_COLORS.negative,
        "mainSeriesProperties.candleStyle.wickUpColor": MARKET_COLORS.positive,
        "mainSeriesProperties.candleStyle.wickDownColor": MARKET_COLORS.negative,
      },
    })

    const wrapper = document.createElement('div')
    wrapper.className = 'tradingview-widget-container__widget'
    wrapper.style.height = '100%'
    wrapper.style.width = '100%'

    containerRef.current.appendChild(wrapper)
    containerRef.current.appendChild(script)

    return () => {
      window.clearTimeout(hideLoadingTimer)
    }
  }, [symbol, interval, marketColor])

  return (
    <div className="relative h-full w-full bg-[#0a0e17]">
      <div className="tradingview-widget-container h-full w-full" ref={containerRef} />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0a0e17]">
          <div className="text-center">
            <div
              className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mx-auto"
              style={{ borderColor: `${marketColor}66`, borderTopColor: 'transparent' }}
            />
            <p className="text-gray-500 text-[10px] mt-2 font-mono">LOADING CHART...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Chart() {
  const [symbol, setSymbol] = useState(getTradingViewSymbol('NVDA'))
  const [ticker, setTicker] = useState('NVDA')
  const [interval, setInterval] = useState('D')
  const [quote, setQuote] = useState(null)
  const activeTicker = symbol.split(':').pop()

  useEffect(() => {
    let cancelled = false
    setQuote(null)

    fetch(`${API_BASE_URL}/quote/${activeTicker}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled) setQuote(data)
      })
      .catch(() => {
        if (!cancelled) setQuote(null)
      })

    return () => {
      cancelled = true
    }
  }, [activeTicker])

  const marketColor = isPositiveChange(quote?.change) ? MARKET_COLORS.positive : MARKET_COLORS.negative

  const handleSearch = (t) => {
    const sym = (t || ticker).trim().toUpperCase()
    if (!sym) return
    setTicker(sym)
    setSymbol(getTradingViewSymbol(sym))
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
    <div
      className="bg-[#0a0e17] rounded-xl border overflow-hidden"
      style={{
        minHeight: '700px',
        borderColor: quote ? `${marketColor}66` : 'rgb(31 41 55)',
      }}
    >
      {/* Header */}
      <div className="bg-[#0f1520] border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-orange-400 font-bold text-sm font-mono">CHARTS</span>
          <span className="text-gray-600">|</span>
          <span className="text-white text-xs font-mono">{symbol}</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
          <span>RSI • MACD • SMA • Volume</span>
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${quote ? changeTextClass(quote.change).replace('text-', 'bg-') : 'bg-green-400'}`}></span>
          <span className={quote ? changeTextClass(quote.change) : ''}>LIVE</span>
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

      <div
        className="border-b px-4 py-2 flex items-center justify-between"
        style={{
          borderColor: quote ? `${marketColor}66` : 'rgb(31 41 55)',
          backgroundColor: quote ? `${marketColor}14` : '#0c1018',
        }}
      >
        <span className="text-[10px] text-gray-500 font-mono">MARKET DIRECTION</span>
        <MarketDirectionBadge quote={quote} />
      </div>

      {/* Chart */}
      <div style={{ height: '540px' }}>
        <TradingViewChart symbol={symbol} interval={interval} marketColor={marketColor} />
      </div>

      {/* Footer */}
      <div className="bg-[#0f1520] border-t border-gray-800 px-4 py-2 flex items-center justify-between text-[10px] text-gray-500 font-mono">
        <span>INDICATORS: RSI (14) • MACD (12,26,9) • SMA (20,50,200) • Volume</span>
        <span>Powered by TradingView • Free real-time data</span>
      </div>
    </div>
  )
}
