'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ALL_SKILLS } from '@/data/skills'
import { useProgress } from '@/hooks/useProgress'

const NAV_ITEMS = [
  { href: '/',         label: 'dashboard',  ico: '□' },
  { href: '/skills',   label: 'skills',     ico: '◇' },
  { href: '/coverage', label: 'cobertura',  ico: '▣' },
  { href: '/graph',    label: 'grafo',      ico: '○' },
  { href: '/concepts', label: 'conceitos',  ico: '◐' },
  { href: '/routine',  label: 'rotina',     ico: '◑' },
]

export default function Nav() {
  const pathname = usePathname()
  const { stats, mounted } = useProgress(ALL_SKILLS)
  const s = mounted ? stats() : null

  return (
    <nav className="topnav">
      {NAV_ITEMS.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className={pathname === item.href ? 'active' : ''}
        >
          <span style={{ fontSize: 12 }}>{item.ico}</span>
          {item.label}
        </Link>
      ))}
      <div className="spacer" />
      {s && (
        <div className="progress-mini">
          {s.pct}%
          <div className="bar">
            <div className="bar-fill" style={{ width: `${s.pct}%` }} />
          </div>
          {s.done}/{s.total}
        </div>
      )}
    </nav>
  )
}
