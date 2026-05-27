export default function StockCard({ label, value, sub, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-xl font-bold text-navy">{value}</p>
      {sub && <p className={`text-sm font-medium mt-1 ${color || 'text-gray-600'}`}>{sub}</p>}
    </div>
  )
}
