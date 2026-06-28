export function formatPHP(amount) {
  return new Intl.NumberFormat('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function parsePHP(value) {
  const cleaned = value.replace(/[^\d.]/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

export function relativeTime(isoString) {
  const diff = Math.floor((Date.now() - new Date(isoString)) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return new Date(isoString).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })
}
