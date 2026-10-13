import { Link } from 'react-router-dom'
import AdSlot from '../components/AdSlot.jsx'

const tools = [
  {
    to: '/juros-compostos',
    icon: '📈',
    title: 'Juros compostos',
    description: 'Veja quanto seu dinheiro pode render com aportes mensais ao longo do tempo.',
  },
  {
    to: '/financiamento',
    icon: '🏠',
    title: 'Financiamento',
    description: 'Compare as tabelas SAC e Price e descubra quanto você pagará de juros.',
  },
  {
    to: '/investimentos',
    icon: '⚖️',
    title: 'Comparador de investimentos',
    description: 'Compare poupança, CDB, Tesouro Selic e LCI considerando o imposto de renda.',
  },
]

export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>Decisões financeiras mais claras, em poucos cliques.</h1>
        <p>
          O SimulaFácil reúne simuladores gratuitos e fáceis de usar para você planejar
          investimentos, comparar financiamentos e entender o efeito dos juros no seu bolso.
        </p>
        <Link to="/juros-compostos" className="btn btn-light">
          Começar uma simulação
        </Link>
      </section>

      <h2>Ferramentas</h2>
      <div className="tools-grid">
        {tools.map((tool) => (
          <Link key={tool.to} to={tool.to} className="card tool-card">
            <div className="icon" aria-hidden="true">
              {tool.icon}
            </div>
            <h3>{tool.title}</h3>
            <p>{tool.description}</p>
          </Link>
        ))}
      </div>

      <AdSlot />
    </>
  )
}
