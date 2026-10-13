import { Link, NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Início', end: true },
  { to: '/juros-compostos', label: 'Juros compostos' },
  { to: '/financiamento', label: 'Financiamento' },
  { to: '/investimentos', label: 'Investimentos' },
  { to: '/sobre', label: 'Sobre' },
]

export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <img src="/favicon.svg" alt="" width="28" height="28" />
          <span>
            Simula<strong>Fácil</strong>
          </span>
        </Link>
        <nav className="nav" aria-label="Navegação principal">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
