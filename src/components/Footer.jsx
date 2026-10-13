export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <span>© {new Date().getFullYear()} SimulaFácil — simulações apenas educativas.</span>
        <span>Os resultados são estimativas e não constituem recomendação de investimento.</span>
      </div>
    </footer>
  )
}
