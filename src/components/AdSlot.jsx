// Espaço reservado para anúncios. Nesta versão apenas demarca
// onde a monetização por publicidade seria exibida.
export default function AdSlot({ format = 'banner' }) {
  const size = format === 'sidebar' ? '300 × 250' : '728 × 90'

  return (
    <aside className={`ad-slot ${format}`} aria-label="Espaço publicitário">
      <strong>Publicidade</strong>
      <span>Espaço para anúncio ({size})</span>
    </aside>
  )
}
