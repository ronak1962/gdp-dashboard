import { useCallback, useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import OverviewView from './views/OverviewView'
import StockLiveDashboard from './views/StockLiveDashboard'
import DeepAnalysisDashboard from './views/DeepAnalysisDashboard'
import { DEFAULT_COMPARE } from './constants'
import { fetchStock, fetchAdvisor, fetchStocksBatch } from './api'

export default function AlphaScopeNexus({ onOpenLegacy }) {
  const [view, setView] = useState('overview')
  const [search, setSearch] = useState('')
  const [sector, setSector] = useState('Technology')
  const [timeframe, setTimeframe] = useState('1Y')
  const [riskProfile, setRiskProfile] = useState('Balanced')

  const [compareTickers] = useState([...DEFAULT_COMPARE])
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
    if ((view === 'compare' || view === 'overview') && focusTicker) {
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

  const openStock = useCallback(
    (sym) => {
      const t = sym.trim().toUpperCase()
      if (!t) return
      setAnalyzeTicker(t)
      setSearch(t)
      setView('analyze')
      runAnalyze(t)
    },
    [runAnalyze]
  )

  const openDeep = useCallback(
    (sym) => {
      const t = (sym || deepTicker).trim().toUpperCase()
      if (!t) return
      setDeepTicker(t)
      setSearch(t)
      setView('deep')
      runDeep(t)
    },
    [deepTicker, runDeep]
  )

  useEffect(() => {
    if (view === 'deep' && !deepStock) runDeep(deepTicker || 'AAPL')
  }, [view]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchSubmit = () => {
    const t = search.trim().toUpperCase()
    if (!t) return
    if (view === 'deep') openDeep(t)
    else openStock(t)
  }

  const navigate = (id) => {
    if (id === 'legacy') {
      onOpenLegacy?.()
      return
    }
    if (id === 'analyze' && analyzeStock) {
      setView('analyze')
      return
    }
    setView(id)
  }

  const photoProps = {
    stocks: compareStocks,
    advisor,
    focusTicker,
    onFocus: setFocusTicker,
    onOpenStock: openStock,
    onOpenDeep: openDeep,
    onSelectStock: (t) => {
      setFocusTicker(t)
      fetchAdvisor(t).then(setAdvisor)
    },
    thesis,
    setThesis,
  }

  /* Full-screen deep analysis (multi-chart + AI) */
  if (view === 'deep') {
    return (
      <div className="nexus-root flex h-screen max-h-screen overflow-hidden">
        <DeepAnalysisDashboard
          ticker={deepTicker}
          stock={deepStock}
          advisor={deepAdvisor}
          loading={loadingDeep}
          onBack={() => setView('overview')}
          onSearch={() => runDeep()}
          onSelectTicker={openDeep}
          search={search}
          onSearchChange={setSearch}
        />
      </div>
    )
  }

  /* Full-screen live stock terminal */
  if (view === 'analyze') {
    return (
      <div className="nexus-root flex h-screen max-h-screen overflow-hidden">
        <StockLiveDashboard
          ticker={analyzeTicker}
          stock={analyzeStock}
          loading={loadingAnalyze}
          search={search}
          onSearch={setSearch}
          onSearchSubmit={handleSearchSubmit}
          onBack={() => setView('overview')}
          onSelectStock={openStock}
          onDeepAnalysis={() => openDeep(analyzeTicker)}
        />
      </div>
    )
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
        />

        {(view === 'overview' || view === 'compare') && <OverviewView {...photoProps} />}
      </div>
    </div>
  )
}
