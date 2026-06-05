import { useEffect, useRef } from 'react'
import { toTradingViewSymbol } from './TradingViewChart'

function useTradingViewEmbed(scriptSrc, config, deps) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.innerHTML = ''

    const script = document.createElement('script')
    script.src = scriptSrc
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify(config)

    const wrapper = document.createElement('div')
    wrapper.className = 'tradingview-widget-container__widget'
    wrapper.style.height = '100%'
    wrapper.style.width = '100%'

    el.appendChild(wrapper)
    el.appendChild(script)

    return () => {
      el.innerHTML = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return ref
}

/** TradingView Technical Analysis — ratings, oscillators, moving averages */
export function TradingViewTechnicalAnalysis({ ticker, height = 420 }) {
  const symbol = toTradingViewSymbol(ticker)
  const ref = useTradingViewEmbed(
    'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js',
    {
      interval: '1D',
      width: '100%',
      height: '100%',
      isTransparent: true,
      symbol,
      showIntervalTabs: true,
      displayMode: 'single',
      locale: 'en',
      colorTheme: 'dark',
    },
    [symbol]
  )

  return (
    <div
      className="tradingview-widget-container rounded-lg overflow-hidden bg-[#0a0e17] border border-slate-700/40"
      ref={ref}
      style={{ height, minHeight: height }}
    />
  )
}

/** TradingView Symbol Info — price, stats, key figures */
export function TradingViewSymbolInfo({ ticker, height = 380 }) {
  const symbol = toTradingViewSymbol(ticker)
  const ref = useTradingViewEmbed(
    'https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js',
    {
      symbol,
      width: '100%',
      height: '100%',
      locale: 'en',
      colorTheme: 'dark',
      isTransparent: true,
    },
    [symbol]
  )

  return (
    <div
      className="tradingview-widget-container rounded-lg overflow-hidden bg-[#0a0e17] border border-slate-700/40"
      ref={ref}
      style={{ height, minHeight: height }}
    />
  )
}

/** TradingView Financials / fundamentals snapshot */
export function TradingViewFinancials({ ticker, height = 400 }) {
  const symbol = toTradingViewSymbol(ticker)
  const ref = useTradingViewEmbed(
    'https://s3.tradingview.com/external-embedding/embed-widget-financials.js',
    {
      colorTheme: 'dark',
      isTransparent: true,
      largeChartUrl: '',
      displayMode: 'regular',
      width: '100%',
      height: '100%',
      symbol,
      locale: 'en',
    },
    [symbol]
  )

  return (
    <div
      className="tradingview-widget-container rounded-lg overflow-hidden bg-[#0a0e17] border border-slate-700/40"
      ref={ref}
      style={{ height, minHeight: height }}
    />
  )
}
