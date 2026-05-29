import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../config/api'
import { changePrefix, changeTextClass, riskPillClass, riskTextClass } from '../utils/marketDisplay'

function TemplateCard({ template, onSelect }) {
  const riskColor = riskTextClass(template.risk)

  return (
    <div
      className="bg-[#141a24] border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition cursor-pointer"
      onClick={() => onSelect(template)}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-bold text-sm">{template.name}</h3>
        <span className="text-gray-500 text-lg">›</span>
      </div>

      <p className="text-gray-400 text-xs leading-relaxed mb-4">{template.description}</p>

      <div className="space-y-2.5">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">1Y/5Y return</span>
          <span className="text-green-400 font-mono">{template.return1Y}%/{template.return5Y}%</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Stocks</span>
          <span className="text-white font-mono">{template.stocks}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Sectors</span>
          <span className="text-white font-mono">{template.sectors}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Risk</span>
          <span className={`${riskColor} font-mono`}>{template.risk}</span>
        </div>
      </div>

      <button className="w-full mt-4 py-2.5 bg-[#1a2332] border border-gray-700 rounded-lg text-white text-xs font-semibold hover:bg-[#1f2b3d] transition">
        Use as template
      </button>
    </div>
  )
}

function TemplateDetail({ template, onBack }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE_URL}/templates/${template.id}`)
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [template.id])

  if (loading) return (
    <div className="text-center py-12">
      <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="text-gray-500 text-xs mt-2">Loading portfolio...</p>
    </div>
  )

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="text-gray-400 text-xs hover:text-white transition">← Back to templates</button>

      <div className="bg-[#141a24] border border-gray-800 rounded-xl p-5">
        <h2 className="text-white font-bold text-lg mb-1">{template.name}</h2>
        <p className="text-gray-400 text-xs mb-4">{template.description}</p>

        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="text-center">
            <div className="text-green-400 font-mono text-sm font-bold">{data?.return1Y || template.return1Y}%</div>
            <div className="text-gray-500 text-[10px]">1Y Return</div>
          </div>
          <div className="text-center">
            <div className="text-white font-mono text-sm font-bold">{template.stocks}</div>
            <div className="text-gray-500 text-[10px]">Stocks</div>
          </div>
          <div className="text-center">
            <div className="text-white font-mono text-sm font-bold">{template.sectors}</div>
            <div className="text-gray-500 text-[10px]">Sectors</div>
          </div>
          <div className="text-center">
            <div className={`font-mono text-sm font-bold ${riskTextClass(template.risk)}`}>{template.risk}</div>
            <div className="text-gray-500 text-[10px]">Risk</div>
          </div>
        </div>

        {/* Allocation */}
        {template.allocation && (
          <div className="mb-4">
            <p className="text-gray-500 text-[10px] uppercase mb-2">Allocation</p>
            <div className="flex rounded-full overflow-hidden h-2 mb-2">
              {Object.entries(template.allocation).map(([key, val], i) => {
                const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-cyan-500']
                return <div key={key} className={`${colors[i % colors.length]}`} style={{ width: `${val}%` }} />
              })}
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {Object.entries(template.allocation).map(([key, val], i) => {
                const colors = ['text-blue-400', 'text-green-400', 'text-yellow-400', 'text-purple-400', 'text-orange-400', 'text-pink-400', 'text-cyan-400']
                return <span key={key} className={`text-[10px] ${colors[i % colors.length]}`}>● {key} {val}%</span>
              })}
            </div>
          </div>
        )}
      </div>

      {/* Holdings */}
      {data?.holdingsData?.length > 0 && (
        <div className="bg-[#141a24] border border-gray-800 rounded-xl p-4">
          <p className="text-gray-500 text-[10px] uppercase mb-3">Top Holdings (Live)</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[10px] text-gray-500 uppercase">
                <th className="text-left py-1 px-2">Ticker</th>
                <th className="text-left py-1 px-2">Name</th>
                <th className="text-right py-1 px-2">Price</th>
                <th className="text-right py-1 px-2">Change</th>
                <th className="text-center py-1 px-2">Risk</th>
              </tr>
            </thead>
            <tbody>
              {data.holdingsData.map((h) => (
                <tr key={h.ticker} className="border-t border-gray-800">
                  <td className="py-2 px-2 text-orange-400 font-mono font-bold">{h.ticker}</td>
                  <td className="py-2 px-2 text-gray-300 truncate max-w-[100px]">{h.name}</td>
                  <td className="py-2 px-2 text-right text-white font-mono">${h.price?.toFixed(2)}</td>
                  <td className={`py-2 px-2 text-right font-mono ${changeTextClass(h.change)}`}>
                    {changePrefix(h.change)}{h.change?.toFixed(2)}%
                  </td>
                  <td className="py-2 px-2 text-center">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${riskPillClass(h.riskLevel)}`}>
                      {h.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function ScreenerItem({ screener, onRun }) {
  return (
    <div
      className="flex items-center justify-between py-3 px-4 border-b border-gray-800 hover:bg-[#1a2332] cursor-pointer transition"
      onClick={() => onRun(screener.id)}
    >
      <div>
        <p className="text-white text-sm font-medium">{screener.label}</p>
        <p className="text-gray-500 text-[10px]">{screener.description}</p>
      </div>
      <span className="text-gray-600 text-lg">›</span>
    </div>
  )
}

export default function Discover() {
  const [templates, setTemplates] = useState([])
  const [screeners, setScreeners] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [tab, setTab] = useState('templates')

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/templates`).then(r => r.json()),
      fetch(`${API_BASE_URL}/screeners`).then(r => r.json()),
    ]).then(([t, s]) => {
      setTemplates(t)
      setScreeners(s)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="text-center py-12">
      <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="text-gray-500 text-xs mt-2">Loading...</p>
    </div>
  )

  return (
    <div className="bg-[#0a0e17] rounded-xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="bg-[#0f1520] border-b border-gray-800 px-5 py-3 flex items-center justify-between">
        <span className="text-white font-bold text-sm">Discover</span>
        <div className="flex gap-1">
          <button
            onClick={() => setTab('templates')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${tab === 'templates' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'text-gray-400 hover:text-white'}`}
          >
            Portfolio Templates
          </button>
          <button
            onClick={() => setTab('screeners')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${tab === 'screeners' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'text-gray-400 hover:text-white'}`}
          >
            Screeners
          </button>
        </div>
      </div>

      <div className="p-5">
        {tab === 'templates' && !selectedTemplate && (
          <div className="grid md:grid-cols-2 gap-4">
            {templates.map((t) => (
              <TemplateCard key={t.id} template={t} onSelect={setSelectedTemplate} />
            ))}
          </div>
        )}

        {tab === 'templates' && selectedTemplate && (
          <TemplateDetail template={selectedTemplate} onBack={() => setSelectedTemplate(null)} />
        )}

        {tab === 'screeners' && (
          <div className="bg-[#141a24] border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-800">
              <p className="text-gray-500 text-[10px] uppercase font-semibold">Screeners</p>
            </div>
            {screeners.map((s) => (
              <ScreenerItem key={s.id} screener={s} onRun={() => {}} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
