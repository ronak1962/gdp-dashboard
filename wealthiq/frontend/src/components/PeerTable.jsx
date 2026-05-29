import { changePrefix, changeTextClass, riskPillClass } from '../utils/marketDisplay'

export default function PeerTable({ peers, mainPrice }) {
  const maxPrice = Math.max(...peers.map((p) => p.price), mainPrice || 0)

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <h3 className="font-semibold text-navy text-sm mb-4">Peer Comparison</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-500 uppercase border-b">
              <th className="text-left py-2 px-2">Ticker</th>
              <th className="text-left py-2 px-2">Name</th>
              <th className="text-right py-2 px-2">Price</th>
              <th className="text-right py-2 px-2">1D Change</th>
              <th className="text-left py-2 px-2 w-32">Relative</th>
              <th className="text-center py-2 px-2">Risk</th>
            </tr>
          </thead>
          <tbody>
            {peers.map((p) => {
              const barW = maxPrice > 0 ? (p.price / maxPrice) * 100 : 0
              return (
                <tr key={p.ticker} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2 px-2 font-bold text-navy">{p.ticker}</td>
                  <td className="py-2 px-2 text-gray-600 truncate max-w-[120px]">{p.name}</td>
                  <td className="py-2 px-2 text-right font-medium">${p.price?.toFixed(2)}</td>
                  <td className={`py-2 px-2 text-right font-medium ${changeTextClass(p.change, 'light')}`}>
                    {changePrefix(p.change)}{p.change?.toFixed(2)}%
                  </td>
                  <td className="py-2 px-2">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-navy/60 rounded-full" style={{ width: `${barW}%` }} />
                    </div>
                  </td>
                  <td className="py-2 px-2 text-center">
                    <span className={`${riskPillClass(p.riskLevel, 'light')} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>
                      {p.riskLevel}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
