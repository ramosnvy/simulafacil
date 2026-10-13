// Funções de cálculo financeiro usadas pelos simuladores.
// Todas as taxas são recebidas em porcentagem (ex.: 12 para 12% ao ano).

export function annualToMonthlyRate(annualPercent) {
  return Math.pow(1 + annualPercent / 100, 1 / 12) - 1
}

export function simulateCompoundInterest({ initial, monthly, annualRate, months }) {
  const rate = annualToMonthlyRate(annualRate)
  const rows = []
  let balance = initial
  let invested = initial

  for (let month = 1; month <= months; month++) {
    balance = balance * (1 + rate) + monthly
    invested += monthly
    rows.push({ month, invested, balance, interest: balance - invested })
  }

  const last = rows.at(-1) ?? { invested: initial, balance: initial, interest: 0 }
  return {
    rows,
    totalInvested: last.invested,
    finalBalance: last.balance,
    totalInterest: last.interest,
  }
}

// Tabela Price: parcelas fixas.
export function simulatePrice({ principal, annualRate, months }) {
  const rate = annualToMonthlyRate(annualRate)
  const installment =
    rate === 0 ? principal / months : (principal * rate) / (1 - Math.pow(1 + rate, -months))

  const rows = []
  let balance = principal
  for (let month = 1; month <= months; month++) {
    const interest = balance * rate
    const amortization = installment - interest
    balance = Math.max(balance - amortization, 0)
    rows.push({ month, installment, interest, amortization, balance })
  }
  return summarizeFinancing(rows)
}

// Sistema de Amortização Constante: amortização fixa, parcelas decrescentes.
export function simulateSac({ principal, annualRate, months }) {
  const rate = annualToMonthlyRate(annualRate)
  const amortization = principal / months

  const rows = []
  let balance = principal
  for (let month = 1; month <= months; month++) {
    const interest = balance * rate
    balance = Math.max(balance - amortization, 0)
    rows.push({ month, installment: amortization + interest, interest, amortization, balance })
  }
  return summarizeFinancing(rows)
}

function summarizeFinancing(rows) {
  const totalPaid = rows.reduce((sum, row) => sum + row.installment, 0)
  const totalInterest = rows.reduce((sum, row) => sum + row.interest, 0)
  return {
    rows,
    firstInstallment: rows[0]?.installment ?? 0,
    lastInstallment: rows.at(-1)?.installment ?? 0,
    totalPaid,
    totalInterest,
  }
}

// Alíquota regressiva do imposto de renda sobre renda fixa, conforme o prazo em dias.
export function incomeTaxRate(days) {
  if (days <= 180) return 22.5
  if (days <= 360) return 20
  if (days <= 720) return 17.5
  return 15
}

// Rendimento anual da poupança: 0,5% a.m. quando a Selic passa de 8,5% a.a.,
// caso contrário 70% da Selic (desconsiderando a TR).
export function savingsAnnualRate(selic) {
  if (selic > 8.5) return (Math.pow(1.005, 12) - 1) * 100
  return selic * 0.7
}

// Simula um investimento de valor único por um prazo em meses.
export function simulateInvestment({ amount, annualRate, months, taxExempt }) {
  const gross = amount * Math.pow(1 + annualToMonthlyRate(annualRate), months)
  const grossProfit = gross - amount
  const taxRate = taxExempt ? 0 : incomeTaxRate(months * 30)
  const tax = (grossProfit * taxRate) / 100
  const net = gross - tax
  return { gross, grossProfit, taxRate, tax, net, netProfit: net - amount }
}
