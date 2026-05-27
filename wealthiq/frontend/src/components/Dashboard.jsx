import { useState, useEffect } from 'react'

const API = 'http://localhost:8000'

function IndexCard({ data }) {
  const isUp = data.change >= 0
  return (
    <div className={`rounded-lg p-3 border ${isUp ? 'bg-green-900/20 border-green-800/50' : 'bg-red-900/20 border-red-800/50'}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-gray-400 text-[10px] uppercase">{data.name}</span>
        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${isUp ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
          {isUp ? '▲' : '▼'} {Math.abs(data.change)?.toFixed(2)}%
        </span>
      </div>
      <p className={`font-mono text-lg font-bold ${isUp ? 'text-green-300' : 'text-red-300'}`}>${data.price?.toFixed(2)}</p>
      <div className="flex justify-between text-[10px] text-gray-500 mt-1">
        <span>H: {data.high?.toFixed(2)}</span>
        <span>L: {data.low?.toFixed(2)}</span>
      </div>
    </div>
  )
}

function MoverRow({ data }) {
  const isUp = data.change >= 0
  return (
    <div className={`flex items-center justify-between py-2 px-2 rounded mb-1 ${isUp ? 'bg-green-900/10' : 'bg-red-900/10'}`}>
      <span className="text-orange-400 font-mono text-xs font-bold w-12">{data.ticker}</span>
      <span className={`font-mono text-xs font-bold ${isUp ? 'text-green-300' : 'text-red-300'}`}>${data.price?.toFixed(2)}</span>
      <span className={`font-mono text-xs font-bold ${isUp ? 'text-green-400' : 'text-red-400'}`}>
        {isUp ? '▲' : '▼'} {Math.abs(data.change)?.toFixed(2)}%
      </span>
    </div>
  )
}

function NewsCard({ article }) {
  const time = article.datetime ? new Date(article.datetime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-[#141a24] border border-gray-800 rounded-lg p-3 hover:border-gray-600 transition"
    >
      <div className="flex gap-3">
        {article.image && (
          <img src={article.image} alt="" className="w-16 h-16 rounded object-cover shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-white text-xs font-medium leading-relaxed line-clamp-2">{article.headline}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-orange-400 text-[10px] font-bold">{article.source}</span>
            <span className="text-gray-600 text-[10px]">•</span>
            <span className="text-gray-500 text-[10px]">{time}</span>
          </div>
        </div>
      </div>
    </a>
  )
}

export default function Dashboard() {
  const [market, setMarket] = useState(null)
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(null)

  const fetchData = async () => {
    try {
      const [mktRes, newsRes] = await Promise.all([
        fetch(`${API}/market/overview`),
        fetch(`${API}/market/news?limit=12`),
      ])
      if (mktRes.ok) setMarket(await mktRes.json())
      if (newsRes.ok) setNews(await newsRes.json())
      setLastUpdate(new Date())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) return (
    <div className="bg-[#0a0e17] rounded-xl border border-gray-800 p-12 text-center">
      <div className="w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="text-gray-500 text-xs mt-3 font-mono">Loading live market data...</p>
    </div>
  )

  return (
    <div className="bg-[#0a0e17] rounded-xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="bg-[#0f1520] border-b border-gray-800 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-orange-400 font-bold text-sm font-mono">PATEL ANALYSIS</span>
          <span className="text-gray-600">|</span>
          <span className="text-gray-400 text-xs">LIVE DASHBOARD</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-gray-500 font-mono">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            LIVE
          </span>
          <span>Auto-refresh: 30s</span>
          {lastUpdate && <span>Updated: {lastUpdate.toLocaleTimeString()}</span>}
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Market Indices */}
        {market?.indices?.length > 0 && (
          <div>
            <p className="text-gray-500 text-[10px] uppercase font-semibold mb-3 font-mono">Market Indices</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {market.indices.map((idx) => (
                <IndexCard key={idx.ticker} data={idx} />
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-5">
          {/* Top Movers */}
          <div className="bg-[#141a24] border border-gray-800 rounded-lg p-4">
            <p className="text-gray-500 text-[10px] uppercase font-semibold mb-3 font-mono">Top Stocks</p>
            {market?.movers?.map((m) => (
              <MoverRow key={m.ticker} data={m} />
            ))}
          </div>

          {/* News Feed */}
          <div className="md:col-span-2 space-y-3">
            <p className="text-gray-500 text-[10px] uppercase font-semibold font-mono">Market News — Live Feed</p>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {news.map((article, i) => (
                <NewsCard key={i} article={article} />
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#141a24] border border-gray-800 rounded-lg p-4">
          <p className="text-gray-500 text-[10px] uppercase font-semibold mb-3 font-mono">Quick Actions for Managers</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="bg-[#0a0e17] border border-gray-800 rounded-lg p-3 text-center">
              <span className="text-2xl">📊</span>
              <p className="text-white text-xs mt-1 font-medium">Analyze Stock</p>
              <p className="text-gray-500 text-[10px]">Deep TradingView analysis</p>
            </div>
            <div className="bg-[#0a0e17] border border-gray-800 rounded-lg p-3 text-center">
              <span className="text-2xl">🤖</span>
              <p className="text-white text-xs mt-1 font-medium">AI Recommendation</p>
              <p className="text-gray-500 text-[10px]">Buy/sell per risk profile</p>
            </div>
            <div className="bg-[#0a0e17] border border-gray-800 rounded-lg p-3 text-center">
              <span className="text-2xl">🔍</span>
              <p className="text-white text-xs mt-1 font-medium">Screen Stocks</p>
              <p className="text-gray-500 text-[10px]">Find by sector/dividend/risk</p>
            </div>
            <div className="bg-[#0a0e17] border border-gray-800 rounded-lg p-3 text-center">
              <span className="text-2xl">📋</span>
              <p className="text-white text-xs mt-1 font-medium">Portfolio Templates</p>
              <p className="text-gray-500 text-[10px]">Pre-built diversified portfolios</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
