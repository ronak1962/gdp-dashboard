export function isPositiveChange(change) {
  return Number(change ?? 0) >= 0
}

export function changeArrow(change) {
  return isPositiveChange(change) ? '▲' : '▼'
}

export function changePrefix(change) {
  return isPositiveChange(change) ? '+' : ''
}

export function changeTextClass(change, variant = 'dark') {
  if (variant === 'light') return isPositiveChange(change) ? 'text-teal' : 'text-red'
  return isPositiveChange(change) ? 'text-green-400' : 'text-red-400'
}

export function riskPillClass(level, variant = 'dark') {
  if (variant === 'light') {
    return level === 'Low' ? 'bg-teal' : level === 'Medium' ? 'bg-amber' : 'bg-red'
  }
  return level === 'Low'
    ? 'text-green-400 bg-green-400/10'
    : level === 'Medium'
      ? 'text-yellow-400 bg-yellow-400/10'
      : 'text-red-400 bg-red-400/10'
}

export function riskTextClass(level) {
  return level === 'Low' ? 'text-green-400' : level === 'Medium' ? 'text-yellow-400' : 'text-red-400'
}

export function actionPillClass(action, variant = 'dark') {
  if (variant === 'light') {
    return action === 'BUY'
      ? 'bg-emerald-500 text-white'
      : action === 'SELL'
        ? 'bg-red-500 text-white'
        : 'bg-amber-500 text-white'
  }
  return action === 'BUY'
    ? 'text-green-400 bg-green-400/10'
    : action === 'SELL'
      ? 'text-red-400 bg-red-400/10'
      : 'text-yellow-400 bg-yellow-400/10'
}

export function actionBorderClass(action) {
  return action === 'BUY'
    ? 'border-green-400/30'
    : action === 'SELL'
      ? 'border-red-400/30'
      : 'border-yellow-400/30'
}

export function actionBgClass(action) {
  return action === 'BUY' ? 'bg-teal' : action === 'SELL' ? 'bg-red' : 'bg-gray-400'
}

export function actionDotClass(action) {
  return action === 'BUY' ? 'bg-green-400' : action === 'SELL' ? 'bg-red-400' : 'bg-yellow-400'
}

export function actionEmoji(action) {
  return action === 'BUY' ? '🟢' : action === 'SELL' ? '🔴' : '🟡'
}

export function signalIcon(action) {
  return action === 'BUY' ? '↑' : action === 'SELL' ? '↓' : '→'
}

export function signalTextClass(action) {
  return action === 'BUY' ? 'text-emerald-600' : action === 'SELL' ? 'text-red-600' : 'text-amber-600'
}
