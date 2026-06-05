import KpiRow from '../components/KpiRow'
import StockCards from '../components/StockCards'
import ScatterMatrix from '../components/ScatterMatrix'
import DecisionPanel from '../components/DecisionPanel'
import {
  ScenarioStudio,
  CapitalMix,
  PerformanceDNA,
  CompareTable,
  CatalystTimeline,
  ThesisBox,
} from '../components/CompareExtras'

/** Design 4: Compare 4 stocks at once — full AlphaScope layout */
export default function CompareView({
  stocks,
  advisor,
  focusTicker,
  onFocus,
  onSelectStock,
  thesis,
  setThesis,
}) {
  const top = stocks[0]?.ticker || 'MSFT'
  return (
    <div className="space-y-4 p-4 overflow-y-auto flex-1">
      <KpiRow topPick={focusTicker || top} />

      <StockCards stocks={stocks} onSelect={onSelectStock} activeTicker={focusTicker} />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-4">
        <ScatterMatrix stocks={stocks} />
        <DecisionPanel
          stocks={stocks}
          advisor={advisor}
          focusTicker={focusTicker}
          onFocus={onFocus}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ScenarioStudio ticker={focusTicker || top} />
        <CapitalMix stocks={stocks} />
        <PerformanceDNA stocks={stocks} />
      </div>

      <CompareTable stocks={stocks} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CatalystTimeline />
        <ThesisBox value={thesis} onChange={setThesis} ticker={focusTicker} />
      </div>
    </div>
  )
}
