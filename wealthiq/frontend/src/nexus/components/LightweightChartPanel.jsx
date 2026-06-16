import { useEffect, useRef } from 'react'
import {
  createChart,
  CandlestickSeries,
  LineSeries,
  HistogramSeries,
  ColorType,
} from 'lightweight-charts'

function toSeriesTime(i) {
  const d = new Date(2024, 5, 1)
  d.setDate(d.getDate() + i)
  return d.toISOString().slice(0, 10)
}

function baseOptions(width, height) {
  return {
    width,
    height,
    layout: {
      background: { type: ColorType.Solid, color: '#080c14' },
      textColor: '#64748b',
    },
    grid: {
      vertLines: { color: '#1e293b' },
      horzLines: { color: '#1e293b' },
    },
    rightPriceScale: { borderColor: '#334155' },
    timeScale: { borderColor: '#334155', timeVisible: true, secondsVisible: false },
    crosshair: { mode: 0 },
  }
}

/** TradingView Lightweight Charts™ panel */
export default function LightweightChartPanel({ candles, mode = 'candle', height = 220 }) {
  const ref = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (!ref.current || !candles?.length) return

    const width = ref.current.clientWidth || 400
    if (chartRef.current) {
      chartRef.current.remove()
      chartRef.current = null
    }

    const chart = createChart(ref.current, baseOptions(width, height))
    chartRef.current = chart

    if (mode === 'candle' || mode === 'sr') {
      const series = chart.addSeries(CandlestickSeries, {
        upColor: '#22c55e',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#22c55e',
        wickDownColor: '#ef4444',
      })
      series.setData(
        candles.map((c, i) => ({
          time: toSeriesTime(i),
          open: c.o,
          high: c.h,
          low: c.l,
          close: c.c,
        }))
      )
      if (mode === 'candle') {
        const ma20 = chart.addSeries(LineSeries, { color: '#3b82f6', lineWidth: 1, title: 'MA20' })
        ma20.setData(
          candles.map((c, i) => ({
            time: toSeriesTime(i),
            value: candles.slice(Math.max(0, i - 19), i + 1).reduce((a, x) => a + x.c, 0) / Math.min(20, i + 1),
          }))
        )
      }
    }

    if (mode === 'trend') {
      const line = chart.addSeries(LineSeries, { color: '#3b82f6', lineWidth: 2 })
      line.setData(candles.map((c, i) => ({ time: toSeriesTime(i), value: c.c })))
      const vol = chart.addSeries(HistogramSeries, {
        color: '#3b82f680',
        priceFormat: { type: 'volume' },
        priceScaleId: 'vol',
      })
      chart.priceScale('vol').applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } })
      vol.setData(
        candles.map((c, i) => ({
          time: toSeriesTime(i),
          value: c.v,
          color: c.c >= c.o ? '#22c55e55' : '#ef444455',
        }))
      )
    }

    if (mode === 'rsi') {
      const rsi = chart.addSeries(LineSeries, { color: '#a855f7', lineWidth: 2, title: 'RSI' })
      const rsiData = candles.map((_, i) => 35 + Math.sin(i * 0.25) * 20 + (i / candles.length) * 15)
      rsi.setData(rsiData.map((v, i) => ({ time: toSeriesTime(i), value: v })))
      rsi.createPriceLine({ price: 70, color: '#ef4444', lineWidth: 1, lineStyle: 2, axisLabelVisible: true })
      rsi.createPriceLine({ price: 30, color: '#22c55e', lineWidth: 1, lineStyle: 2, axisLabelVisible: true })
    }

    const ro = new ResizeObserver(() => {
      if (ref.current) chart.applyOptions({ width: ref.current.clientWidth })
    })
    ro.observe(ref.current)

    return () => {
      ro.disconnect()
      chart.remove()
      chartRef.current = null
    }
  }, [candles, mode, height])

  return <div ref={ref} className="w-full rounded-lg overflow-hidden" style={{ height }} />
}
