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

/**
 * Reference UI: single scrollable dashboard matching AlphaScope Nexus mock.
 * Used for Overview + Peer Lab (4-stock) views.
 */
export default function NexusPhotoBoard({
  stocks,
  advisor,
  focusTicker,
  onFocus,
  onSelectStock,
  thesis,
  setThesis,
}) {
  const top = focusTicker || 'MSFT'
  const ordered = orderStocks(stocks)

  return (
    <div className="flex-1 overflow-y-auto nexus-scroll p-4 space-y-4">
      <KpiRow topPick={top} />

      <StockCards stocks={ordered} onSelect={onSelectStock} activeTicker={focusTicker} />

      {/* Matrix + Decision Engine — right column spans 2 rows */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4 items-start">
        <div className="space-y-4 min-w-0">
          <ScatterMatrix stocks={ordered} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ScenarioStudio ticker={top} />
            <CapitalMix stocks={ordered} />
            <PerformanceDNA stocks={ordered} />
          </div>

          <CompareTable stocks={ordered} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
            <CatalystTimeline />
            <ThesisBox value={thesis} onChange={setThesis} />
          </div>
        </div>

        <div className="xl:sticky xl:top-4">
          <DecisionPanel
            stocks={ordered}
            advisor={advisor}
            focusTicker={focusTicker}
            onFocus={onFocus}
          />
        </div>
      </div>
    </div>
  )
}

function orderStocks(stocks) {
  const order = ['AAPL', 'MSFT', 'GOOGL', 'AMZN']
  return [...stocks].sort((a, b) => order.indexOf(a.ticker) - order.indexOf(b.ticker))
}
