import { useEffect, useRef } from 'react'

const EXCHANGE_BY_TICKER = {
  AAPL: 'NASDAQ',
  MSFT: 'NASDAQ',
  GOOGL: 'NASDAQ',
  AMZN: 'NASDAQ',
  NVDA: 'NASDAQ',
  TSLA: 'NASDAQ',
  META: 'NASDAQ',
  NFLX: 'NASDAQ',
  JPM: 'NYSE',
  BAC: 'NYSE',
  V: 'NYSE',
}

/** Map UI timeframe labels to TradingView interval codes */
export const TIMEFRAME_TO_INTERVAL = {
  '1D': '15',
  '5D': '60',
  '1M': 'D',
  '3M': 'D',
  '6M': 'D',
  YTD: 'D',
  '1Y': 'W',
  '5Y': 'M',
  '1m': '1',
  '5m': '5',
  '15m': '15',
  '1H': '60',
  '4H': '240',
  D: 'D',
  W: 'W',
  M: 'M',
}

const DEFAULT_STUDIES = [
  'RSI@tv-basicstudies',
  'MASimple@tv-basicstudies',
  'MACD@tv-basicstudies',
  'BB@tv-basicstudies',
]

export function toTradingViewSymbol(ticker) {
  const t = ticker?.toUpperCase()
  if (!t) return 'NASDAQ:AAPL'
  if (t.includes(':')) return t
  const exchange = EXCHANGE_BY_TICKER[t] || 'NASDAQ'
  return `${exchange}:${t}`
}

/**
 * TradingView Advanced Chart embed (free widget).
 * @see https://www.tradingview.com/widget-docs/widgets/charts/advanced-chart/
 */
export default function TradingViewChart({
  ticker,
  symbol,
  interval = 'D',
  height = 520,
  studies = DEFAULT_STUDIES,
}) {
  const containerRef = useRef(null)
  const tvSymbol = symbol || toTradingViewSymbol(ticker)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: tvSymbol,
      interval,
      timezone: 'America/New_York',
      theme: 'dark',
      style: '1',
      locale: 'en',
      backgroundColor: 'rgba(10, 14, 23, 1)',
      gridColor: 'rgba(30, 40, 55, 0.5)',
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: true,
      save_image: false,
      calendar: false,
      support_host: 'https://www.tradingview.com',
      studies,
    })

    const wrapper = document.createElement('div')
    wrapper.className = 'tradingview-widget-container__widget'
    wrapper.style.height = '100%'
    wrapper.style.width = '100%'

    el.appendChild(wrapper)
    el.appendChild(script)

    return () => {
      el.innerHTML = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- studies use DEFAULT_STUDIES unless customized
  }, [tvSymbol, interval])

  return (
    <div
      className="tradingview-widget-container rounded-lg overflow-hidden bg-[#0a0e17]"
      ref={containerRef}
      style={{ height, width: '100%', minHeight: height }}
    />
  )
}
