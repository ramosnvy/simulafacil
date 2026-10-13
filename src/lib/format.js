const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const percent = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 })

export function formatCurrency(value) {
  return currency.format(value)
}

export function formatPercent(value) {
  return `${percent.format(value)}%`
}

// Converte o valor de um campo em número, aceitando vírgula como separador decimal.
export function parseNumber(text) {
  if (typeof text === 'number') return text
  const normalized = String(text).trim().replace(',', '.')
  if (normalized === '') return NaN
  return Number(normalized)
}
