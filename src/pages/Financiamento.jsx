import { useState } from 'react'
import AdSlot from '../components/AdSlot.jsx'
import NumberField from '../components/NumberField.jsx'
import { simulatePrice, simulateSac } from '../lib/finance.js'
import { formatCurrency, parseNumber } from '../lib/format.js'

const systems = {
  sac: { label: 'SAC', simulate: simulateSac },
  price: { label: 'Price', simulate: simulatePrice },
}

export default function Financiamento() {
  const [propertyValue, setPropertyValue] = useState('300000')
  const [downPayment, setDownPayment] = useState('60000')
  const [annualRate, setAnnualRate] = useState('11')
  const [years, setYears] = useState('30')
  const [tableSystem, setTableSystem] = useState('sac')

  const principal = parseNumber(propertyValue) - parseNumber(downPayment)
  const input = {
    principal,
    annualRate: parseNumber(annualRate),
    months: Math.round(parseNumber(years) * 12),
  }

  const isValid =
    principal > 0 && input.annualRate >= 0 && input.months >= 1 && input.months <= 420

  const results = isValid
    ? { sac: simulateSac(input), price: simulatePrice(input) }
    : null

  const cheaper = results && results.sac.totalPaid <= results.price.totalPaid ? 'sac' : 'price'
  const savings = results ? Math.abs(results.sac.totalPaid - results.price.totalPaid) : 0

  return (
    <div className="layout-with-sidebar">
      <div>
        <h1 className="page-title">Simulador de financiamento</h1>
        <p className="page-subtitle">
          Compare as tabelas SAC e Price e veja o custo total de um financiamento imobiliário ou
          de veículo.
        </p>

        <section className="card">
          <div className="form-grid">
            <NumberField
              label="Valor do bem"
              prefix="R$"
              value={propertyValue}
              onChange={setPropertyValue}
              min="0"
              step="1000"
            />
            <NumberField label="Entrada" prefix="R$" value={downPayment} onChange={setDownPayment} min="0" step="1000" />
            <NumberField
              label="Juros anuais"
              prefix="%"
              value={annualRate}
              onChange={setAnnualRate}
              min="0"
              step="0.1"
            />
            <NumberField label="Prazo" prefix="anos" value={years} onChange={setYears} min="1" max="35" hint="Até 35 anos" />
          </div>
          {isValid ? (
            <p className="note">Valor financiado: {formatCurrency(principal)}</p>
          ) : (
            <p className="error">A entrada deve ser menor que o valor do bem e o prazo de até 35 anos.</p>
          )}
        </section>

        {results && (
          <>
            <section className="card">
              <h2>Comparação</h2>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Sistema</th>
                      <th>1ª parcela</th>
                      <th>Última parcela</th>
                      <th>Total em juros</th>
                      <th>Total pago</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(systems).map(([key, system]) => (
                      <tr key={key} className={key === cheaper ? 'best' : ''}>
                        <td>
                          {system.label}
                          {key === cheaper && <span className="badge">Menor custo</span>}
                        </td>
                        <td>{formatCurrency(results[key].firstInstallment)}</td>
                        <td>{formatCurrency(results[key].lastInstallment)}</td>
                        <td>{formatCurrency(results[key].totalInterest)}</td>
                        <td>{formatCurrency(results[key].totalPaid)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                Escolhendo <strong>{systems[cheaper].label}</strong> você economiza{' '}
                <strong>{formatCurrency(savings)}</strong> em juros ao longo do contrato.
              </p>
              <p className="note">
                No SAC as parcelas começam mais altas e diminuem; na Price as parcelas são fixas.
                Simulação sem seguros, taxas administrativas ou correção monetária (TR/IPCA).
              </p>
            </section>

            <AdSlot />

            <section className="card">
              <h2>Parcelas mês a mês</h2>
              <div className="toggle-group" role="group" aria-label="Sistema de amortização">
                {Object.entries(systems).map(([key, system]) => (
                  <button
                    key={key}
                    type="button"
                    className={tableSystem === key ? 'active' : ''}
                    aria-pressed={tableSystem === key}
                    onClick={() => setTableSystem(key)}
                  >
                    {system.label}
                  </button>
                ))}
              </div>
              <div className="table-wrap" style={{ maxHeight: 400 }}>
                <table>
                  <thead>
                    <tr>
                      <th>Mês</th>
                      <th>Parcela</th>
                      <th>Juros</th>
                      <th>Amortização</th>
                      <th>Saldo devedor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results[tableSystem].rows.map((row) => (
                      <tr key={row.month}>
                        <td>{row.month}</td>
                        <td>{formatCurrency(row.installment)}</td>
                        <td>{formatCurrency(row.interest)}</td>
                        <td>{formatCurrency(row.amortization)}</td>
                        <td>{formatCurrency(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>

      <AdSlot format="sidebar" />
    </div>
  )
}
