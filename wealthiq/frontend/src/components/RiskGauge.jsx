export default function RiskGauge({ score, level }) {
  const angle = -90 + (score / 100) * 180
  const badgeColor = level === 'Low' ? 'bg-teal' : level === 'Medium' ? 'bg-amber' : 'bg-red'

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-navy text-sm">Risk Score</h3>
        <span className={`${badgeColor} text-white text-xs font-bold px-2 py-0.5 rounded-full`}>
          {level}
        </span>
      </div>
      {/* Gauge */}
      <div className="relative w-44 h-24 mx-auto">
        <svg viewBox="0 0 200 110" className="w-full h-full">
          {/* Background arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Colored arc segments */}
          <path
            d="M 20 100 A 80 80 0 0 1 73 38"
            fill="none"
            stroke="#1AB87A"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M 73 38 A 80 80 0 0 1 127 38"
            fill="none"
            stroke="#E0A020"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M 127 38 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#C0392B"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Needle */}
          <line
            x1="100"
            y1="100"
            x2={100 + 60 * Math.cos((angle * Math.PI) / 180)}
            y2={100 + 60 * Math.sin((angle * Math.PI) / 180)}
            stroke="#0D4F8B"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="100" cy="100" r="5" fill="#0D4F8B" />
        </svg>
      </div>
      <p className="text-center text-2xl font-bold text-navy mt-1">{score}</p>
      <p className="text-center text-xs text-gray-500">out of 100</p>
    </div>
  )
}
