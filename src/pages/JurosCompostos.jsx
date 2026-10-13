import { useState } from 'react'
import AdSlot from '../components/AdSlot.jsx'
import NumberField from '../components/NumberField.jsx'
import { annualToMonthlyRate, simulateCompoundInterest } from '../lib/finance.js'
import { formatCurrency, formatPercent, parseNumber } from '../lib/format.js'

export default function JurosCompostos() {
  const [initial, setInitial] = useState('1000')
  const [monthly, setMonthly] = useState('300')
  const [annualRate, setAnnualRate] = useState('10')
  const [years, setYears] = useState('10')

  const input = {
    initial: parseNumber(initial),
    monthly: parseNumber(monthly),
    annualRate: parseNumber(annualRate),
    months: Math.round(parseNumber(years) * 12),
  }

  const isValid =
    input.initial >= 0 &&
    input.monthly >= 0 &&
    input.annualRate >= 0 &&
    input.months >= 1 &&
    input.months <= 600

  const result = isValid ? simulateCompoundInterest(input) : null

  // Um ponto por ano no gráfico e na tabela.
  const yearlyRows = result
    ? result.rows.filter((row) => row.month % 12 === 0 || row.month === result.rows.length)
    : []
  const maxBalance = yearlyRows.at(-1)?.balance || 1

  return (
    <div className="layout-with-sidebar">
      <div>
        <h1 className="page-title">Simulador de juros compostos</h1>
        <p className="page-subtitle">
          Descubra quanto você acumula investindo um valor inicial e fazendo aportes mensais.
        </p>

        <section className="card">
          <div className="form-grid">
            <NumberField label="Valor inicial" prefix="R$" value={initial} onChange={setInitial} min="0" step="100" />
            <NumberField label="Aporte mensal" prefix="R$" value={monthly} onChange={setMonthly} min="0" step="50" />
            <NumberField
              label="Taxa de juros anual"
              prefix="%"
              value={annualRate}
              onChange={setAnnualRate}
              min="0"
              step="0.1"
            />
            <NumberField
              label="Período"
              prefix="anos"
              value={years}
              onChange={setYears}
              min="1"
              max="50"
              hint="Entre 1 e 50 anos"
            />
          </div>
          {!isValid && <p className="error">Preencha valores válidos para ver a simulação.</p>}
        </section>

        {result && (
          <section className="card">
            <h2>Resultado</h2>
            <div className="stats">
              <div className="stat highlight">
                <div className="label">Valor final</div>
                <div className="value">{formatCurrency(result.finalBalance)}</div>
              </div>
              <div className="stat">
                <div className="label">Total investido</div>
                <div className="value">{formatCurrency(result.totalInvested)}</div>
              </div>
              <div className="stat">
                <div className="label">Total em juros</div>
                <div className="value">{formatCurrency(result.totalInterest)}</div>
              </div>
            </div>

            <h3>Evolução do patrimônio</h3>
            <div className="chart" role="img" aria-label="Gráfico da evolução do patrimônio por ano">
              {yearlyRows.map((row) => (
                <div
                  key={row.month}
                  className="chart-bar"
                  title={`Ano ${Math.ceil(row.month / 12)}: ${formatCurrency(row.balance)}`}
                >
                  <div className="seg-interest" style={{ height: `${(Math.max(row.interest, 0) / maxBalance) * 100}%` }} />
                  <div className="seg-invested" style={{ height: `${(row.invested / maxBalance) * 100}%` }} />
                </div>
              ))}
            </div>
            <div className="legend">
              <span style={{ '--c': 'var(--brand)' }}>Valor investido</span>
              <span style={{ '--c': 'var(--accent)' }}>Juros acumulados</span>
            </div>

            <h3>Tabela anual</h3>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Ano</th>
                    <th>Total investido</th>
                    <th>Juros acumulados</th>
                    <th>Patrimônio</th>
                  </tr>
                </thead>
                <tbody>
                  {yearlyRows.map((row) => (
                    <tr key={row.month}>
                      <td>{Math.ceil(row.month / 12)}</td>
                      <td>{formatCurrency(row.invested)}</td>
                      <td>{formatCurrency(row.interest)}</td>
                      <td>{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="note">
              Taxa mensal equivalente: {formatPercent(annualToMonthlyRate(input.annualRate) * 100)} a.m.
              Valores sem descontos de impostos ou taxas.
            </p>
          </section>
        )}
      </div>

      <AdSlot format="sidebar" />
    </div>
  )
}
