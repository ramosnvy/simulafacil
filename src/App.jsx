import { HashRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import JurosCompostos from './pages/JurosCompostos.jsx'
import Financiamento from './pages/Financiamento.jsx'
import Sobre from './pages/Sobre.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="juros-compostos" element={<JurosCompostos />} />
          <Route path="financiamento" element={<Financiamento />} />
          <Route path="sobre" element={<Sobre />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
