import { useCallback, useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import OverviewView from './views/OverviewView'
import AnalyzeView from './views/AnalyzeView'
import DeepDiveView from './views/DeepDiveView'
import CompareView from './views/CompareView'
import { DEFAULT_COMPARE } from './constants'
import { fetchStock, fetchAdvisor, fetchStocksBatch } from './api'

const VIEW_LABELS = {
  overview: 'Overview · Client home',
  analyze: 'Stock Analysis · Single ticker',
  deep: 'Deep Dive · Decision engine',
  compare: 'Peer Lab · 4-stock matrix',
}

export default function AlphaScopeNexus({ onOpenLegacy }) {
  const [view, setView] = useState('overview')
  const [search, setSearch] = useState('')
  const [sector, setSector] = useState('Technology')
  const [timeframe, setTimeframe] = useState('1Y')
  const [riskProfile, setRiskProfile] = useState('Balanced')

  const [compareTickers, setCompareTickers] = useState([...DEFAULT_COMPARE])
  const [compareStocks, setCompareStocks] = useState([])
  const [focusTicker, setFocusTicker] = useState('MSFT')
  const [advisor, setAdvisor] = useState(null)

  const [analyzeTicker, setAnalyzeTicker] = useState('AAPL')
  const [analyzeStock, setAnalyzeStock] = useState(null)
  const [deepTicker, setDeepTicker] = useState('MSFT')
  const [deepStock, setDeepStock] = useState(null)
  const [deepAdvisor, setDeepAdvisor] = useState(null)

  const [loadingAnalyze, setLoadingAnalyze] = useState(false)
  const [loadingDeep, setLoadingDeep] = useState(false)
  const [thesis, setThesis] = useState(
    'Balanced tech exposure with MSFT as core compounder; maintain diversification across mega-cap platforms.'
  )

  const loadCompare = useCallback(async (tickers) => {
    const data = await fetchStocksBatch(tickers)
    setCompareStocks(data)
    const adv = await fetchAdvisor(focusTicker || data[0]?.ticker)
    setAdvisor(adv)
  }, [focusTicker])

  useEffect(() => {
    loadCompare(compareTickers)
  }, [compareTickers, loadCompare])

  useEffect(() => {
    if (view === 'compare' && focusTicker) {
      fetchAdvisor(focusTicker).then(setAdvisor)
    }
  }, [focusTicker, view])

  const runAnalyze = useCallback(async (sym) => {
    const t = (sym || analyzeTicker).trim().toUpperCase()
    if (!t) return
    setAnalyzeTicker(t)
    setLoadingAnalyze(true)
    try {
      const s = await fetchStock(t)
      setAnalyzeStock(s)
    } finally {
      setLoadingAnalyze(false)
    }
  }, [analyzeTicker])

  const runDeep = useCallback(async (sym) => {
    const t = (sym || deepTicker).trim().toUpperCase()
    if (!t) return
    setDeepTicker(t)
    setLoadingDeep(true)
    try {
      const [s, a] = await Promise.all([fetchStock(t), fetchAdvisor(t)])
      setDeepStock(s)
      setDeepAdvisor(a)
      setFocusTicker(t)
    } finally {
      setLoadingDeep(false)
    }
  }, [deepTicker])

  useEffect(() => {
    if (view === 'analyze' && !analyzeStock) runAnalyze('AAPL')
    if (view === 'deep' && !deepStock) runDeep('MSFT')
  }, [view]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchSubmit = () => {
    const t = search.trim().toUpperCase()
    if (!t) return
    setAnalyzeTicker(t)
    setView('analyze')
    runAnalyze(t)
  }

  const navigate = (id) => {
    if (id === 'legacy') {
      onOpenLegacy?.()
      return
    }
    setView(id)
  }

  const addToCompare = (t) => {
    setCompareTickers((prev) => {
      const next = [...prev]
      if (next.includes(t)) return next
      if (next.length >= 4) next.shift()
      next.push(t)
      return next.slice(-4)
    })
    setView('compare')
  }

  return (
    <div className="nexus-root flex h-screen max-h-screen overflow-hidden bg-[#050810] text-slate-200">
      <Sidebar view={view} onNavigate={navigate} onLegacy={() => onOpenLegacy?.()} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          search={search}
          onSearch={setSearch}
          onSearchSubmit={handleSearchSubmit}
          sector={sector}
          setSector={setSector}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          riskProfile={riskProfile}
          setRiskProfile={setRiskProfile}
          viewLabel={VIEW_LABELS[view]}
        />

        {view === 'overview' && (
          <OverviewView
            stocks={compareStocks.length ? compareStocks : []}
            onNavigate={navigate}
            onAnalyzeTicker={(t) => {
              setAnalyzeTicker(t)
              runAnalyze(t)
            }}
          />
        )}

        {view === 'analyze' && (
          <AnalyzeView
            ticker={analyzeTicker}
            setTicker={setAnalyzeTicker}
            stock={analyzeStock}
            loading={loadingAnalyze}
            onSearch={(sym) => runAnalyze(sym)}
            onDeepDive={() => {
              setDeepTicker(analyzeTicker)
              setView('deep')
              runDeep(analyzeTicker)
            }}
            onAddToCompare={() => addToCompare(analyzeTicker)}
            relatedStocks={compareStocks.filter((s) => s.ticker !== analyzeTicker).slice(0, 4)}
          />
        )}

        {view === 'deep' && (
          <DeepDiveView
            ticker={deepTicker}
            setTicker={setDeepTicker}
            stock={deepStock}
            advisor={deepAdvisor}
            loading={loadingDeep}
            onSearch={() => runDeep()}
            thesis={thesis}
            setThesis={setThesis}
          />
        )}

        {view === 'compare' && (
          <CompareView
            stocks={compareStocks}
            advisor={advisor}
            focusTicker={focusTicker}
            onFocus={setFocusTicker}
            onSelectStock={(t) => {
              setFocusTicker(t)
              setAnalyzeTicker(t)
              runAnalyze(t)
              setView('analyze')
            }}
            thesis={thesis}
            setThesis={setThesis}
          />
        )}
      </div>
    </div>
  )
}
