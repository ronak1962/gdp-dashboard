export default function RangeBar({ high, low, current }) {
  if (!high || !low || !current) return null
  const range = high - low
  const pos = range > 0 ? ((current - low) / range) * 100 : 50

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <h3 className="font-semibold text-navy text-sm mb-4">52-Week Range</h3>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>${low?.toFixed(2)}</span>
        <span>${high?.toFixed(2)}</span>
      </div>
      <div className="relative h-3 bg-gray-200 rounded-full overflow-visible">
        <div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{
            width: `${pos}%`,
            background: 'linear-gradient(90deg, #1AB87A, #E0A020, #C0392B)',
          }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-navy rounded-full border-2 border-white shadow"
          style={{ left: `${pos}%`, transform: `translate(-50%, -50%)` }}
        />
      </div>
      <p className="text-center mt-3 text-sm font-medium text-navy">
        Current: ${current?.toFixed(2)}
      </p>
    </div>
  )
}
