export const API = 'http://localhost:8000'

/** Card order as shown in reference UI */
export const DEFAULT_COMPARE = ['AAPL', 'MSFT', 'GOOGL', 'AMZN']

export const STOCK_COLORS = {
  AAPL: '#3b82f6',
  MSFT: '#22c55e',
  GOOGL: '#f59e0b',
  AMZN: '#a855f7',
  NVDA: '#06b6d4',
  TSLA: '#ef4444',
  META: '#ec4899',
  JPM: '#64748b',
}

export const STOCK_LOGO_BG = {
  AAPL: 'linear-gradient(135deg, #374151 0%, #111827 100%)',
  MSFT: 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)',
  GOOGL: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
  AMZN: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
}

/** Sidebar matches reference mock */
export const NAV_PRIMARY = [
  { id: 'overview', label: 'Overview' },
  { id: 'compare', label: 'Peer Lab' },
  { id: 'analyze', label: 'Signal Engine' },
  { id: 'deep', label: 'Scenario Studio' },
]

export const NAV_SECONDARY = [
  { id: 'watchlists', label: 'Watchlists' },
  { id: 'notes', label: 'Notes' },
  { id: 'alerts', label: 'Alerts', badge: 3 },
  { id: 'reports', label: 'Reports' },
  { id: 'settings', label: 'Settings' },
]

export const SECTORS = ['Technology', 'Healthcare', 'Finance', 'Energy', 'Consumer']
export const TIMEFRAMES = ['1M', '3M', '6M', '1Y', '3Y']
export const RISK_PROFILES = ['Conservative', 'Balanced', 'Aggressive']
