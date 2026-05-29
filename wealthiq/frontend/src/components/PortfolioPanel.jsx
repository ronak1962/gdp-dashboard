import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../config/api'
import { actionBgClass } from '../utils/marketDisplay'

export default function PortfolioPanel() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE_URL}/portfolio`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-navy border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 mt-2 text-sm">Loading portfolio…</p>
      </div>
    )
  }

  if (!data) return <p className="text-gray-500 text-sm">Unable to load portfolio data.</p>

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-navy">60/40 Portfolio Allocation</h3>
          <span className="text-sm text-gray-500">Total: ${data.totalValue?.toLocaleString()}</span>
        </div>

        <div className="space-y-4">
          {data.allocations.map((a) => {
            const actionColor = actionBgClass(a.action)
            const driftColor = a.drift > 0 ? 'text-red' : a.drift < 0 ? 'text-teal' : 'text-gray-500'
            return (
              <div key={a.ticker} className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-bold text-navy text-lg">{a.ticker}</span>
                    <span className="text-sm text-gray-500 ml-2">${a.price?.toFixed(2)}</span>
                  </div>
                  <span className={`${actionColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                    {a.action} {a.action !== 'HOLD' && `${Math.abs(a.deltaShares).toFixed(1)} shares`}
                  </span>
                </div>

                {/* Drift bar */}
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs text-gray-500 w-16">Target {a.targetPct}%</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full relative overflow-hidden">
                    <div
                      className="absolute h-full bg-navy/30 rounded-full"
                      style={{ width: `${a.targetPct}%` }}
                    />
                    <div
                      className="absolute h-full bg-navy rounded-full"
                      style={{ width: `${Math.min(a.currentPct, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-14 text-right">{a.currentPct}%</span>
                </div>

                <div className="flex justify-between text-xs text-gray-500">
                  <span>Shares: {a.shares} → {a.targetShares}</span>
                  <span className={`font-medium ${driftColor}`}>
                    Drift: {a.drift > 0 ? '+' : ''}{a.drift}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
