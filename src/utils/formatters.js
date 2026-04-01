const currencyFmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatCurrency(value) {
  if (value == null) return '--'
  return currencyFmt.format(value)
}

export function formatPercent(value) {
  if (value == null) return '--'
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export function colorClass(value) {
  if (value == null || value === 0) return 'neutral'
  return value > 0 ? 'gain' : 'loss'
}
