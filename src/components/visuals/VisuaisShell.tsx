'use client'
import { useState } from 'react'
import { VisuaisNav } from './VisuaisNav'
import type { VisualDef } from './VisuaisNav'

// Paleta — duplicada intencionalmente (cada arquivo mantém sua própria cópia)
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FGMUTE = '#94a3b8'

export type { VisualDef }

interface VisuaisShellProps {
  visuals: VisualDef[]
  active: number
  onChange: (i: number) => void
}

export function VisuaisShell({ visuals, active, onChange }: VisuaisShellProps) {
  const currentVisual = visuals[active]

  return (
    <div style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif", background: BG, minHeight: '100%' }}>

      {/* Nav */}
      <VisuaisNav
        visuals={visuals}
        active={active}
        onChange={onChange}
        currentAccent={currentVisual.accent}
        currentSubtitle={currentVisual.subtitle}
      />

      {/* Subtitle bar */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 3, height: 16, borderRadius: 2, background: currentVisual.accent, flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: FGMUTE, letterSpacing: '0.04em', textTransform: 'uppercase' as const, fontFamily: "'JetBrains Mono', monospace" }}>
          {currentVisual.subtitle}
        </span>
      </div>

      {/* Content */}
      <div style={{
        background: CARD,
        border: `1px solid ${LINE}`,
        borderTop: `2px solid ${currentVisual.accent}`,
        borderRadius: '0 0 14px 14px',
        padding: 32,
      }}>
        {currentVisual.component}
      </div>
    </div>
  )
}
