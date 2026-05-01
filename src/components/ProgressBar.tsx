'use client'
import type { ProgressState, SkillStats } from '@/types'
import { STATE_COLORS } from '@/hooks/useProgress'

interface Props {
  counts: SkillStats['counts']
  height?: number
  style?: React.CSSProperties
}

export default function ProgressBar({ counts, height = 8, style }: Props) {
  const order: ProgressState[] = ['domino', 'praticando', 'lendo', 'revisar', 'pendente']
  return (
    <div style={{
      height,
      background: 'var(--bg-elev)',
      borderRadius: height,
      overflow: 'hidden',
      display: 'flex',
      ...style,
    }}>
      {order.map(s => (
        <div
          key={s}
          style={{
            flex: counts[s],
            background: STATE_COLORS[s],
            opacity: s === 'pendente' ? 0.35 : 1,
            transition: 'flex .4s',
          }}
        />
      ))}
    </div>
  )
}
