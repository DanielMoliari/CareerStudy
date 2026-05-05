'use client'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Nav from '@/components/Nav'
import { SKILL_BY_SLUG } from '@/data/skills'
import { getTechIdentity } from '@/data/tech-identity'

export default function VisuaisPage() {
  const params = useParams()
  const slug = typeof params.slug === 'string' ? params.slug : Array.isArray(params.slug) ? params.slug[0] : ''
  const skill = SKILL_BY_SLUG[slug] ?? null
  const identity = getTechIdentity(slug)

  if (!skill) {
    return (
      <>
        <Nav />
        <div className="shell">
          <p style={{ color: 'var(--fg-mute)' }}>Skill não encontrada.</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Nav />
      <div className="shell">
        <Link href={`/skill/${slug}`} className="back">← voltar para {skill.name}</Link>

        <div style={{ marginTop: 24, marginBottom: 32 }}>
          <h1 style={{ marginBottom: 6 }}>Visuais — {skill.name}</h1>
          <p style={{ color: 'var(--fg-mute)', fontSize: 15 }}>
            Diagramas, carrosséis e mapas visuais premium.
          </p>
        </div>

        {/* conteúdo a ser implementado */}
        <div style={{
          padding: 40,
          borderRadius: 12,
          border: '1px dashed var(--line)',
          textAlign: 'center',
          color: 'var(--fg-mute)',
        }}>
          <p style={{ fontSize: 18, marginBottom: 8 }}>Em construção</p>
          <p style={{ fontSize: 14 }}>Os visuais premium para {skill.name} estarão disponíveis em breve.</p>
        </div>
      </div>
    </>
  )
}
