const profiles = [
  { name: 'Conservative', range: [0, 34], desc: 'Low-volatility, dividend-focused', icon: '🛡️' },
  { name: 'Moderate', range: [35, 65], desc: 'Balanced growth and stability', icon: '⚖️' },
  { name: 'Aggressive', range: [66, 100], desc: 'High-growth, momentum-driven', icon: '🚀' },
]

export default function AppetiteProfile({ riskScore }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <h3 className="font-semibold text-navy text-sm mb-4">Analyst Appetite Profiles</h3>
      <div className="grid md:grid-cols-3 gap-3">
        {profiles.map((p) => {
          const match = riskScore >= p.range[0] && riskScore <= p.range[1]
          return (
            <div
              key={p.name}
              className={`rounded-lg p-4 border-2 transition ${
                match ? 'border-navy bg-navy/5' : 'border-gray-100 bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{p.icon}</span>
                <span className="font-semibold text-sm text-navy">{p.name}</span>
                {match && (
                  <span className="ml-auto text-[10px] bg-teal text-white font-bold px-2 py-0.5 rounded-full">
                    MATCH
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">{p.desc}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
