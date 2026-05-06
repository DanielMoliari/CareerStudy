'use client'
import { useState } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────────

export type Container = {
  id: string
  label: string
  image?: string
  ports?: string[]
  env?: string[]
  volumes?: string[]
  networks?: string[]
  description?: string
  color?: string
  status?: 'running' | 'stopped' | 'error'
  resources?: { cpu: string; memory: string }
}

export type ContainerNetwork = {
  id: string
  label: string
  subnet?: string
  color?: string
  containerIds: string[]
}

export type ContainerVolume = {
  id: string
  label: string
  mountPath: string
  containerIds: string[]
  type?: 'bind' | 'volume' | 'tmpfs'
}

interface ContainerDiagramProps {
  containers: Container[]
  networks?: ContainerNetwork[]
  volumes?: ContainerVolume[]
  accentColor?: string
  bgColor?: string
  cardColor?: string
  title?: string
  description?: string
}

// ── Palette ──────────────────────────────────────────────────────────────────────

const BG_DEFAULT     = '#0f172a'
const CARD_DEFAULT   = '#1e293b'
const LINE_DEFAULT   = '#334155'
const FG_DEFAULT     = '#e2e8f0'
const FGMUTE_DEFAULT = '#94a3b8'
const MONO           = "'JetBrains Mono', monospace"

const STATUS_COLOR: Record<NonNullable<Container['status']>, string> = {
  running: '#22c55e',
  stopped: '#94a3b8',
  error:   '#ef4444',
}

const VOL_TYPE_ICON: Record<NonNullable<ContainerVolume['type']>, string> = {
  bind:   '🔗',
  volume: '💾',
  tmpfs:  '⚡',
}

const NETWORK_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899']

// ── Container card ────────────────────────────────────────────────────────────────

function ContainerCard({
  container,
  accentColor,
  cardColor,
  isSelected,
  onClick,
}: {
  container: Container
  accentColor: string
  cardColor: string
  isSelected: boolean
  onClick: () => void
}) {
  const statusCol = container.status ? STATUS_COLOR[container.status] : STATUS_COLOR.running
  const col = container.color ?? accentColor

  return (
    <div
      onClick={onClick}
      style={{
        background: cardColor,
        border: `1px solid ${isSelected ? col : LINE_DEFAULT}`,
        borderRadius: 10, padding: 14, cursor: 'pointer',
        boxShadow: isSelected ? `0 0 14px ${col}30` : 'none',
        transition: 'all .2s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
        <div>
          <div style={{ color: FG_DEFAULT, fontSize: 12, fontWeight: 800, marginBottom: 2 }}>{container.label}</div>
          {container.image && (
            <div style={{ color: FGMUTE_DEFAULT, fontSize: 10 }}>📦 {container.image}</div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusCol }} />
          <span style={{ color: statusCol, fontSize: 9, fontWeight: 700, textTransform: 'capitalize' }}>
            {container.status ?? 'running'}
          </span>
        </div>
      </div>

      {container.ports && container.ports.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
          {container.ports.map(p => (
            <span key={p} style={{ background: col + '20', color: col, fontSize: 9, padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
              {p}
            </span>
          ))}
        </div>
      )}

      {container.resources && (
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <span style={{ color: FGMUTE_DEFAULT, fontSize: 9 }}>CPU: {container.resources.cpu}</span>
          <span style={{ color: FGMUTE_DEFAULT, fontSize: 9 }}>RAM: {container.resources.memory}</span>
        </div>
      )}
    </div>
  )
}

// ── Component ────────────────────────────────────────────────────────────────────

export function ContainerDiagram({
  containers,
  networks = [],
  volumes = [],
  accentColor = '#ef4444',
  bgColor = BG_DEFAULT,
  cardColor = CARD_DEFAULT,
  title,
  description,
}: ContainerDiagramProps) {
  const [selected, setSelected] = useState<Container | null>(null)
  const [activeNet, setActiveNet] = useState<string | null>(null)

  const netColorMap = Object.fromEntries(
    networks.map((n, i) => [n.id, n.color ?? NETWORK_COLORS[i % NETWORK_COLORS.length]]),
  )

  const visibleContainers = activeNet
    ? containers.filter(c => c.networks?.includes(activeNet))
    : containers

  const containerVolumes = selected
    ? volumes.filter(v => v.containerIds.includes(selected.id))
    : []

  const containerNetworks = selected
    ? networks.filter(n => n.containerIds.includes(selected.id))
    : []

  return (
    <div style={{ fontFamily: MONO }}>
      {(title || description) && (
        <div style={{ marginBottom: 16 }}>
          {title && <h3 style={{ color: FG_DEFAULT, fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>{title}</h3>}
          {description && <p style={{ color: FGMUTE_DEFAULT, fontSize: 12, margin: 0 }}>{description}</p>}
        </div>
      )}

      {/* network filter */}
      {networks.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
          <button
            onClick={() => setActiveNet(null)}
            style={{
              padding: '4px 12px', borderRadius: 20, border: `1px solid ${LINE_DEFAULT}`,
              background: activeNet === null ? accentColor : 'transparent',
              color: activeNet === null ? '#fff' : FGMUTE_DEFAULT,
              fontSize: 11, cursor: 'pointer', fontFamily: MONO,
            }}
          >
            Todos
          </button>
          {networks.map(net => {
            const col = netColorMap[net.id]
            return (
              <button
                key={net.id}
                onClick={() => setActiveNet(activeNet === net.id ? null : net.id)}
                style={{
                  padding: '4px 12px', borderRadius: 20, border: `1px solid ${col}60`,
                  background: activeNet === net.id ? col : 'transparent',
                  color: activeNet === net.id ? '#fff' : col,
                  fontSize: 11, cursor: 'pointer', fontFamily: MONO,
                }}
              >
                🌐 {net.label}
              </button>
            )
          })}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 320px' : '1fr', gap: 16 }}>
        {/* network zones + containers */}
        <div>
          {networks.length > 0 ? (
            networks
              .filter(net => activeNet === null || net.id === activeNet)
              .map(net => {
                const netContainers = containers.filter(c => net.containerIds.includes(c.id))
                const col = netColorMap[net.id]
                return (
                  <div
                    key={net.id}
                    style={{
                      border: `1px dashed ${col}60`, borderRadius: 12,
                      padding: 16, marginBottom: 12,
                      background: col + '08',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <span style={{ color: col, fontSize: 10, fontWeight: 700 }}>🌐 {net.label}</span>
                      {net.subnet && <span style={{ color: FGMUTE_DEFAULT, fontSize: 9 }}>({net.subnet})</span>}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 10 }}>
                      {netContainers.map(c => (
                        <ContainerCard
                          key={c.id}
                          container={c}
                          accentColor={accentColor}
                          cardColor={cardColor}
                          isSelected={selected?.id === c.id}
                          onClick={() => setSelected(selected?.id === c.id ? null : c)}
                        />
                      ))}
                    </div>
                  </div>
                )
              })
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {visibleContainers.map(c => (
                <ContainerCard
                  key={c.id}
                  container={c}
                  accentColor={accentColor}
                  cardColor={cardColor}
                  isSelected={selected?.id === c.id}
                  onClick={() => setSelected(selected?.id === c.id ? null : c)}
                />
              ))}
            </div>
          )}

          {/* volumes section */}
          {volumes.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ color: FGMUTE_DEFAULT, fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8 }}>Volumes</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {volumes.map(vol => (
                  <div
                    key={vol.id}
                    style={{
                      background: cardColor, border: `1px solid ${LINE_DEFAULT}`,
                      borderRadius: 8, padding: '6px 12px', fontSize: 10,
                    }}
                  >
                    <span style={{ color: accentColor, marginRight: 4 }}>{VOL_TYPE_ICON[vol.type ?? 'volume']}</span>
                    <span style={{ color: FG_DEFAULT, fontWeight: 700 }}>{vol.label}</span>
                    <span style={{ color: FGMUTE_DEFAULT, marginLeft: 6 }}>{vol.mountPath}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* detail panel */}
        {selected && (
          <div style={{ background: bgColor, border: `1px solid ${selected.color ?? accentColor}40`, borderRadius: 12, padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div style={{ color: FG_DEFAULT, fontSize: 14, fontWeight: 800 }}>{selected.label}</div>
              <button onClick={() => setSelected(null)} style={{ background: 'transparent', border: 'none', color: FGMUTE_DEFAULT, cursor: 'pointer', fontSize: 16 }}>✕</button>
            </div>

            {selected.description && <p style={{ color: FGMUTE_DEFAULT, fontSize: 11, lineHeight: 1.5, margin: '0 0 14px' }}>{selected.description}</p>}

            {selected.env && selected.env.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ color: FGMUTE_DEFAULT, fontSize: 9, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Variáveis de ambiente</div>
                {selected.env.map(e => (
                  <div key={e} style={{ color: '#86efac', fontSize: 10, lineHeight: 1.6 }}>• {e}</div>
                ))}
              </div>
            )}

            {containerNetworks.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ color: FGMUTE_DEFAULT, fontSize: 9, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Redes</div>
                {containerNetworks.map(n => (
                  <div key={n.id} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: netColorMap[n.id] }} />
                    <span style={{ color: FG_DEFAULT, fontSize: 11 }}>{n.label}</span>
                    {n.subnet && <span style={{ color: FGMUTE_DEFAULT, fontSize: 9 }}>({n.subnet})</span>}
                  </div>
                ))}
              </div>
            )}

            {containerVolumes.length > 0 && (
              <div>
                <div style={{ color: FGMUTE_DEFAULT, fontSize: 9, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Volumes montados</div>
                {containerVolumes.map(v => (
                  <div key={v.id} style={{ color: FG_DEFAULT, fontSize: 10, marginBottom: 4 }}>
                    {VOL_TYPE_ICON[v.type ?? 'volume']} <strong>{v.label}</strong> → {v.mountPath}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
