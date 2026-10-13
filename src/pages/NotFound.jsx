import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="card">
      <h1 className="page-title">Página não encontrada</h1>
      <p className="page-subtitle">O endereço acessado não existe.</p>
      <Link to="/" className="btn">
        Voltar ao início
      </Link>
    </div>
  )
}
