import { useState } from 'react'
import AdSlot from '../components/AdSlot.jsx'
import NumberField from '../components/NumberField.jsx'
import data from '../data/investimentos.json'
import { savingsAnnualRate, simulateInvestment } from '../lib/finance.js'
import { formatCurrency, formatPercent, parseNumber } from '../lib/format.js'

// Taxa anual efetiva de cada produto a partir dos indicadores informados.
function productAnnualRate(product, { selic, cdi }) {
  switch (product.indexador) {
    case 'poupanca':
      return savingsAnnualRate(selic)
    case 'selic':
      return (selic * product.percentual) / 100 - (product.taxaCustodia ?? 0)
    case 'cdi':
      return (cdi * product.percentual) / 100
    default:
      return 0
  }
}

export default function Investimentos() {
  const [amount, setAmount] = useState('10000')
  const [months, setMonths] = useState('24')
  const [selic, setSelic] = useState(String(data.referencia.selic))
  const [cdi, setCdi] = useState(String(data.referencia.cdi))

  const input = {
    amount: parseNumber(amount),
    months: Math.round(parseNumber(months)),
    selic: parseNumber(selic),
    cdi: parseNumber(cdi),
  }

  const isValid =
    input.amount > 0 && input.months >= 1 && input.months <= 360 && input.selic >= 0 && input.cdi >= 0

  const results = isValid
    ? data.produtos
        .map((product) => {
          const annualRate = productAnnualRate(product, input)
          return {
            product,
            annualRate,
            ...simulateInvestment({
              amount: input.amount,
              annualRate,
              months: input.months,
              taxExempt: product.isentoIR,
            }),
          }
        })
        .sort((a, b) => b.net - a.net)
    : []

  const sponsored = data.produtos.find((product) => product.patrocinado)

  return (
    <div className="layout-with-sidebar">
      <div>
        <h1 className="page-title">Comparador de investimentos</h1>
        <p className="page-subtitle">
          Compare o rendimento líquido de aplicações de renda fixa, já descontado o imposto de
          renda.
        </p>

        <section className="card">
          <div className="form-grid">
            <NumberField label="Valor aplicado" prefix="R$" value={amount} onChange={setAmount} min="0" step="1000" />
            <NumberField label="Prazo" prefix="meses" value={months} onChange={setMonths} min="1" max="360" />
            <NumberField label="Selic" prefix="% a.a." value={selic} onChange={setSelic} min="0" step="0.05" />
            <NumberField label="CDI" prefix="% a.a." value={cdi} onChange={setCdi} min="0" step="0.05" />
          </div>
          <p className="note">{data.referencia.descricao}</p>
          {!isValid && <p className="error">Preencha valores válidos (prazo entre 1 e 360 meses).</p>}
        </section>

        {isValid && (
          <section className="card">
            <h2>Ranking por rendimento líquido</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Investimento</th>
                    <th>Taxa a.a.</th>
                    <th>IR</th>
                    <th>Rendimento líquido</th>
                    <th>Valor final</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={result.product.id} className={index === 0 ? 'best' : ''}>
                      <td>
                        {result.product.nome}
                        {index === 0 && <span className="badge">Melhor opção</span>}
                      </td>
                      <td>{formatPercent(result.annualRate)}</td>
                      <td>{result.product.isentoIR ? 'Isento' : formatPercent(result.taxRate)}</td>
                      <td>{formatCurrency(result.netProfit)}</td>
                      <td>{formatCurrency(result.net)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="note">
              IR pela tabela regressiva (22,5% até 180 dias a 15% acima de 720 dias). Taxas
              constantes durante todo o período; não considera IOF nem o FGC.
            </p>
          </section>
        )}

        {sponsored && (
          <section className="card sponsored">
            <span className="sponsored-tag">Patrocinado</span>
            <h3>{sponsored.nome}</h3>
            <p>
              Oferta de <strong>{sponsored.emissor}</strong> — liquidez: {sponsored.liquidez}.
            </p>
            <p className="note">
              Espaço destinado a ofertas de instituições parceiras. Conteúdo ilustrativo.
            </p>
          </section>
        )}
      </div>

      <AdSlot format="sidebar" />
    </div>
  )
}
