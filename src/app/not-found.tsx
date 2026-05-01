import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="shell" style={{ textAlign: 'center', paddingTop: '120px' }}>
      <p className="hdr-label"><span className="ln"></span> 404</p>
      <h1>Página <em>não encontrada</em></h1>
      <p className="desc" style={{ margin: '0 auto 32px' }}>Essa rota não existe no CareerStudy.</p>
      <Link href="/" className="btn">← voltar ao dashboard</Link>
    </div>
  )
}
