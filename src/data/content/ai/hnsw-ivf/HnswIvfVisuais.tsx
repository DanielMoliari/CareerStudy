'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'

// ── Paleta HNSW/IVF ───────────────────────────────────────────────────────────
const C      = '#6366f1'   // indigo — identidade HNSW/IVF
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#22c55e'
const RED    = '#ef4444'
const AMB    = '#f59e0b'
const SKY    = '#38bdf8'

// ─────────────────────────────────────────────────────────────────────────────
// Visual 1: HNSW Layer Explorer — navegar as camadas do grafo interativamente
// ─────────────────────────────────────────────────────────────────────────────

type HnswNode = { id: string; layer: number; neighbors: string[]; x: number; y: number }

const HNSW_NODES: HnswNode[] = [
  // Layer 0 — todos os pontos (y=300)
  { id: 'A', layer: 0, neighbors: ['B', 'C', 'D'], x: 60,  y: 300 },
  { id: 'B', layer: 0, neighbors: ['A', 'C'],       x: 130, y: 300 },
  { id: 'C', layer: 0, neighbors: ['A', 'B', 'D'],  x: 200, y: 300 },
  { id: 'D', layer: 0, neighbors: ['C', 'E', 'F'],  x: 270, y: 300 },
  { id: 'E', layer: 0, neighbors: ['D', 'F'],       x: 340, y: 300 },
  { id: 'F', layer: 0, neighbors: ['D', 'E', 'G'],  x: 410, y: 300 },
  { id: 'G', layer: 0, neighbors: ['F', 'H'],       x: 480, y: 300 },
  { id: 'H', layer: 0, neighbors: ['G', 'I'],       x: 550, y: 300 },
  { id: 'I', layer: 0, neighbors: ['H', 'J'],       x: 620, y: 300 },
  { id: 'J', layer: 0, neighbors: ['I'],            x: 690, y: 300 },
  // Layer 1 — subset médio (y=200)
  { id: 'A1', layer: 1, neighbors: ['D1', 'G1'],    x: 60,  y: 200 },
  { id: 'D1', layer: 1, neighbors: ['A1', 'G1'],    x: 270, y: 200 },
  { id: 'G1', layer: 1, neighbors: ['D1', 'J1'],    x: 480, y: 200 },
  { id: 'J1', layer: 1, neighbors: ['G1'],          x: 690, y: 200 },
  // Layer 2 — subset menor (y=120)
  { id: 'A2', layer: 2, neighbors: ['G2'],          x: 60,  y: 120 },
  { id: 'G2', layer: 2, neighbors: ['A2'],          x: 480, y: 120 },
]

function HnswLayerExplorer() {
  const [selectedLayer, setSelectedLayer] = useState<number | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  const layerInfo = [
    { layer: 2, color: C, count: 2, desc: 'Atalhos longos — poucos nós, saltos grandes. Ponto de entrada da busca.' },
    { layer: 1, color: SKY, count: 4, desc: 'Atalhos médios — subset balanceado. Refinamento intermediário.' },
    { layer: 0, color: GRN, count: 10, desc: 'TODOS os pontos. Conexões M densas. Refinamento final da busca.' },
  ]

  const activeNodes = selectedLayer !== null
    ? HNSW_NODES.filter(n => n.layer === selectedLayer)
    : HNSW_NODES

  const nodeColor = (n: HnswNode) => {
    if (n.layer === 2) return C
    if (n.layer === 1) return SKY
    return GRN
  }

  const getNodeById = (id: string) => HNSW_NODES.find(n => n.id === id || n.id === id + '1' || n.id === id + '2')

  const hoveredNodeObj = hoveredNode ? HNSW_NODES.find(n => n.id === hoveredNode) : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Layer selector */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          onClick={() => setSelectedLayer(null)}
          style={{
            padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
            border: `2px solid ${selectedLayer === null ? AMB : LINE}`,
            background: selectedLayer === null ? `${AMB}18` : CARD,
            color: selectedLayer === null ? AMB : FGMUTE, fontSize: 11, fontWeight: 700,
          }}
        >
          Todas as camadas
        </button>
        {layerInfo.map(li => (
          <button
            key={li.layer}
            onClick={() => setSelectedLayer(selectedLayer === li.layer ? null : li.layer)}
            style={{
              padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
              border: `2px solid ${selectedLayer === li.layer ? li.color : LINE}`,
              background: selectedLayer === li.layer ? `${li.color}18` : CARD,
              color: selectedLayer === li.layer ? li.color : FGMUTE, fontSize: 11, fontWeight: 700,
            }}
          >
            Layer {li.layer} ({li.count} nós)
          </button>
        ))}
      </div>

      {/* SVG graph */}
      <div style={{ background: CARD, borderRadius: 10, border: `1.5px solid ${LINE}`, overflow: 'hidden' }}>
        <svg width="100%" viewBox="0 60 750 270" style={{ display: 'block' }}>
          {/* Layer backgrounds */}
          <rect x="0" y="60" width="750" height="80" fill={`${C}08`} rx="4" />
          <rect x="0" y="160" width="750" height="70" fill={`${SKY}06`} rx="4" />
          <rect x="0" y="260" width="750" height="70" fill={`${GRN}05`} rx="4" />

          {/* Layer labels */}
          <text x="8" y="105" fill={`${C}80`} fontSize="10" fontFamily="JetBrains Mono, monospace">Layer 2</text>
          <text x="8" y="195" fill={`${SKY}80`} fontSize="10" fontFamily="JetBrains Mono, monospace">Layer 1</text>
          <text x="8" y="285" fill={`${GRN}80`} fontSize="10" fontFamily="JetBrains Mono, monospace">Layer 0</text>

          {/* Edges */}
          {HNSW_NODES.filter(n => selectedLayer === null || n.layer === selectedLayer).map(node =>
            node.neighbors.map(nId => {
              const target = HNSW_NODES.find(x => x.id === nId)
              if (!target) return null
              if (selectedLayer !== null && target.layer !== selectedLayer) return null
              const isHovered = hoveredNode === node.id || hoveredNode === nId
              return (
                <line
                  key={`${node.id}-${nId}`}
                  x1={node.x} y1={node.y}
                  x2={target.x} y2={target.y}
                  stroke={isHovered ? nodeColor(node) : LINE}
                  strokeWidth={isHovered ? 2 : 1}
                  strokeOpacity={isHovered ? 0.8 : 0.4}
                />
              )
            })
          )}

          {/* Vertical connections between layers (same logical node) */}
          {selectedLayer === null && [
            { from: HNSW_NODES.find(n => n.id === 'A'), to: HNSW_NODES.find(n => n.id === 'A1') },
            { from: HNSW_NODES.find(n => n.id === 'A1'), to: HNSW_NODES.find(n => n.id === 'A2') },
            { from: HNSW_NODES.find(n => n.id === 'D'), to: HNSW_NODES.find(n => n.id === 'D1') },
            { from: HNSW_NODES.find(n => n.id === 'G'), to: HNSW_NODES.find(n => n.id === 'G1') },
            { from: HNSW_NODES.find(n => n.id === 'G1'), to: HNSW_NODES.find(n => n.id === 'G2') },
            { from: HNSW_NODES.find(n => n.id === 'J'), to: HNSW_NODES.find(n => n.id === 'J1') },
          ].map((conn, i) => conn.from && conn.to ? (
            <line
              key={`vert-${i}`}
              x1={conn.from.x} y1={conn.from.y}
              x2={conn.to.x} y2={conn.to.y}
              stroke={AMB} strokeWidth={1} strokeOpacity={0.3} strokeDasharray="3,3"
            />
          ) : null)}

          {/* Nodes */}
          {activeNodes.map(node => (
            <g key={node.id}>
              <circle
                cx={node.x} cy={node.y} r={hoveredNode === node.id ? 14 : 11}
                fill={`${nodeColor(node)}20`}
                stroke={hoveredNode === node.id ? nodeColor(node) : `${nodeColor(node)}80`}
                strokeWidth={hoveredNode === node.id ? 2.5 : 1.5}
                style={{ cursor: 'pointer', transition: 'all .15s' }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              />
              <text
                x={node.x} y={node.y + 4}
                textAnchor="middle" fill={nodeColor(node)}
                fontSize="10" fontWeight="700" fontFamily="JetBrains Mono, monospace"
                style={{ pointerEvents: 'none' }}
              >
                {node.id.replace(/[12]$/, '')}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Info panel */}
      {selectedLayer !== null && (() => {
        const info = layerInfo.find(l => l.layer === selectedLayer)!
        return (
          <div style={{ padding: '12px 16px', borderRadius: 8, background: `${info.color}10`, border: `1.5px solid ${info.color}40`, fontSize: 12, color: FG, lineHeight: 1.7 }}>
            <span style={{ fontWeight: 700, color: info.color }}>Layer {info.layer}:</span> {info.desc}
          </div>
        )
      })()}

      {hoveredNodeObj && (
        <div style={{ padding: '10px 14px', borderRadius: 8, background: `${nodeColor(hoveredNodeObj)}10`, border: `1.5px solid ${nodeColor(hoveredNodeObj)}40`, fontSize: 11, color: FG }}>
          <span style={{ fontWeight: 700, color: nodeColor(hoveredNodeObj) }}>Nó {hoveredNodeObj.id.replace(/[12]$/, '')} (Layer {hoveredNodeObj.layer})</span>
          {' — '}vizinhos: {hoveredNodeObj.neighbors.map(n => n.replace(/[12]$/, '')).join(', ')}
        </div>
      )}

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, fontSize: 10, color: FGMUTE, flexWrap: 'wrap' }}>
        <span><span style={{ color: C }}>■</span> Layer 2 — atalhos longos (entry point)</span>
        <span><span style={{ color: SKY }}>■</span> Layer 1 — refinamento médio</span>
        <span><span style={{ color: GRN }}>■</span> Layer 0 — todos os pontos</span>
        <span><span style={{ color: AMB }}>---</span> mesmo nó em múltiplas camadas</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Visual 2: Tuning de parâmetros HNSW — Recall × Latência interativo
// ─────────────────────────────────────────────────────────────────────────────

type TuningPoint = { ef: number; recall: number; latMs: number; qps: number }

const TUNING_DATA: TuningPoint[] = [
  { ef: 32,  recall: 0.82, latMs: 1.2,  qps: 833 },
  { ef: 64,  recall: 0.90, latMs: 2.1,  qps: 476 },
  { ef: 100, recall: 0.95, latMs: 3.4,  qps: 294 },
  { ef: 200, recall: 0.97, latMs: 6.2,  qps: 161 },
  { ef: 400, recall: 0.99, latMs: 11.8, qps: 84  },
]

const SLA_THRESHOLD_RECALL = 0.95
const SLA_THRESHOLD_LAT = 5.0

function TuningVisual() {
  const [selected, setSelected] = useState<number>(2)  // ef=100 como padrão

  const pt = TUNING_DATA[selected]
  const isGoodRecall = pt.recall >= SLA_THRESHOLD_RECALL
  const isGoodLat = pt.latMs <= SLA_THRESHOLD_LAT

  const maxLat = Math.max(...TUNING_DATA.map(p => p.latMs))
  const maxRecall = 1.0
  const width = 520
  const height = 200
  const padL = 40, padR = 20, padT = 20, padB = 40

  const toX = (ef: number) => {
    const idx = TUNING_DATA.findIndex(p => p.ef === ef)
    return padL + (idx / (TUNING_DATA.length - 1)) * (width - padL - padR)
  }
  const toYRecall = (recall: number) => padT + (1 - recall / maxRecall) * (height - padT - padB)
  const toYLat = (lat: number) => padT + (1 - lat / maxLat) * (height - padT - padB)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* ef_search slider */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        {TUNING_DATA.map((pt, i) => (
          <button
            key={pt.ef}
            onClick={() => setSelected(i)}
            style={{
              padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace',
              border: `2px solid ${selected === i ? C : LINE}`,
              background: selected === i ? `${C}20` : CARD,
              color: selected === i ? C : FGMUTE, fontSize: 12, fontWeight: 700,
            }}
          >
            ef={pt.ef}
          </button>
        ))}
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'Recall@10', value: pt.recall.toFixed(2), color: isGoodRecall ? GRN : RED, ok: isGoodRecall },
          { label: 'Latência p99', value: `${pt.latMs}ms`, color: isGoodLat ? GRN : RED, ok: isGoodLat },
          { label: 'QPS', value: pt.qps.toString(), color: C, ok: true },
          { label: 'ef_search', value: pt.ef.toString(), color: AMB, ok: true },
        ].map(m => (
          <div key={m.label} style={{ background: CARD, border: `1.5px solid ${m.ok ? m.color + '40' : RED + '40'}`, borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: m.color, fontFamily: 'JetBrains Mono, monospace' }}>{m.value}</div>
            <div style={{ fontSize: 10, color: FGMUTE, marginTop: 3 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ background: CARD, borderRadius: 10, border: `1.5px solid ${LINE}` }}>
        <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
          {/* Axes */}
          <line x1={padL} y1={padT} x2={padL} y2={height - padB} stroke={LINE} strokeWidth={1} />
          <line x1={padL} y1={height - padB} x2={width - padR} y2={height - padB} stroke={LINE} strokeWidth={1} />

          {/* SLA lines */}
          <line x1={padL} y1={toYRecall(SLA_THRESHOLD_RECALL)} x2={width - padR} y2={toYRecall(SLA_THRESHOLD_RECALL)}
            stroke={GRN} strokeWidth={1} strokeDasharray="4,4" strokeOpacity={0.5} />
          <text x={padL + 4} y={toYRecall(SLA_THRESHOLD_RECALL) - 4} fill={GRN} fontSize="9" opacity={0.7}>recall SLA 0.95</text>
          <line x1={padL} y1={toYLat(SLA_THRESHOLD_LAT)} x2={width - padR} y2={toYLat(SLA_THRESHOLD_LAT)}
            stroke={RED} strokeWidth={1} strokeDasharray="4,4" strokeOpacity={0.5} />
          <text x={padL + 4} y={toYLat(SLA_THRESHOLD_LAT) - 4} fill={RED} fontSize="9" opacity={0.7}>lat SLA 5ms</text>

          {/* Recall line */}
          <polyline
            points={TUNING_DATA.map(p => `${toX(p.ef)},${toYRecall(p.recall)}`).join(' ')}
            fill="none" stroke={GRN} strokeWidth={2} strokeOpacity={0.8}
          />

          {/* Latency line */}
          <polyline
            points={TUNING_DATA.map(p => `${toX(p.ef)},${toYLat(p.latMs)}`).join(' ')}
            fill="none" stroke={RED} strokeWidth={2} strokeOpacity={0.8}
          />

          {/* Data points */}
          {TUNING_DATA.map((p, i) => (
            <g key={p.ef}>
              <circle cx={toX(p.ef)} cy={toYRecall(p.recall)} r={i === selected ? 7 : 4}
                fill={GRN} stroke={BG} strokeWidth={1.5} style={{ cursor: 'pointer' }}
                onClick={() => setSelected(i)}
              />
              <circle cx={toX(p.ef)} cy={toYLat(p.latMs)} r={i === selected ? 7 : 4}
                fill={RED} stroke={BG} strokeWidth={1.5} style={{ cursor: 'pointer' }}
                onClick={() => setSelected(i)}
              />
              <text x={toX(p.ef)} y={height - padB + 14} textAnchor="middle"
                fill={i === selected ? C : FGMUTE} fontSize="9" fontFamily="JetBrains Mono, monospace">
                {p.ef}
              </text>
            </g>
          ))}

          {/* Labels */}
          <text x={padL - 4} y={toYRecall(0.95)} textAnchor="end" fill={GRN} fontSize="8">0.95</text>
          <text x={padL - 4} y={toYRecall(0.90)} textAnchor="end" fill={GRN} fontSize="8" opacity={0.5}>0.90</text>
          <text x={width - padR} y={height - padB - 4} textAnchor="end" fill={FGMUTE} fontSize="9">ef_search →</text>
        </svg>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 20, fontSize: 11, color: FGMUTE, justifyContent: 'center' }}>
        <span><span style={{ color: GRN }}>■</span> Recall@10 (eixo Y esquerdo, 0-1)</span>
        <span><span style={{ color: RED }}>■</span> Latência p99 em ms (escala relativa)</span>
        <span style={{ color: FGMUTE }}>SLAs: recall ≥ 0.95, latência ≤ 5ms</span>
      </div>

      {/* Recommendation */}
      <div style={{ padding: '10px 14px', borderRadius: 8, background: `${isGoodRecall && isGoodLat ? GRN : AMB}10`, border: `1.5px solid ${isGoodRecall && isGoodLat ? GRN : AMB}40`, fontSize: 12, color: FG, lineHeight: 1.6 }}>
        {isGoodRecall && isGoodLat
          ? `ef_search=${pt.ef} atinge ambos os SLAs: recall=${pt.recall} ≥ 0.95 e latência=${pt.latMs}ms ≤ 5ms. Bom ponto de operação.`
          : isGoodRecall && !isGoodLat
          ? `ef_search=${pt.ef} atinge recall mas estoura latência (${pt.latMs}ms > 5ms). Aumentar M ou reduzir ef_search.`
          : `ef_search=${pt.ef} não atinge recall mínimo (${pt.recall} < 0.95). Aumentar ef_search.`
        }
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Visual 3: HNSW vs IVF-PQ — ComparisonTable
// ─────────────────────────────────────────────────────────────────────────────

const ANN_OPTIONS: ComparisonOption[] = [
  { id: 'hnsw', label: 'HNSW', sublabel: 'Grafo hierárquico', color: C },
  { id: 'ivfpq', label: 'IVF-PQ', sublabel: 'Clusters + quantização', color: AMB },
  { id: 'flat', label: 'Brute Force', sublabel: 'Referência exata', color: FGMUTE },
]

const ANN_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'recall',
    label: 'Recall@10',
    category: 'Qualidade',
    values: {
      hnsw: { rating: 'excellent', note: '0.95-0.99 típico' },
      ivfpq: { rating: 'good', note: '0.85-0.92 com PQ' },
      flat: { rating: 'excellent', note: '1.00 — exato' },
    },
  },
  {
    id: 'latency',
    label: 'Latência p99',
    category: 'Performance',
    values: {
      hnsw: { rating: 'excellent', note: '1-5ms (1M vetores)' },
      ivfpq: { rating: 'good', note: '5-20ms (1M vetores)' },
      flat: { rating: 'poor', note: '100ms+ (1M vetores)' },
    },
  },
  {
    id: 'ram-1m',
    label: 'RAM (1M × 768d)',
    category: 'Infraestrutura',
    values: {
      hnsw: { rating: 'fair', note: '~3-4 GB (grafo + vetores)' },
      ivfpq: { rating: 'excellent', note: '~100-200 MB (PQ comprimido)' },
      flat: { rating: 'fair', note: '~3 GB (só vetores)' },
    },
  },
  {
    id: 'ram-1b',
    label: 'RAM (1B vetores)',
    category: 'Infraestrutura',
    values: {
      hnsw: { rating: 'poor', note: '~3 TB — inviável' },
      ivfpq: { rating: 'excellent', note: '~10-20 GB — viável' },
      flat: { rating: 'poor', note: '~3 TB — inviável' },
    },
  },
  {
    id: 'build',
    label: 'Tempo de Build',
    category: 'Operação',
    values: {
      hnsw: { rating: 'good', note: 'Minutos (1M). Sem treino.' },
      ivfpq: { rating: 'fair', note: 'Treino k-means + indexação' },
      flat: { rating: 'excellent', note: 'Imediato (só adiciona)' },
    },
  },
  {
    id: 'delete',
    label: 'Delete Eficiente',
    category: 'Operação',
    values: {
      hnsw: { rating: 'poor', note: 'Soft delete. Rebuild periódico.' },
      ivfpq: { rating: 'fair', note: 'Reindexação por cluster' },
      flat: { rating: 'excellent', note: 'Simples — remove do array' },
    },
  },
  {
    id: 'filter',
    label: 'Filtros Seletivos',
    category: 'Funcionalidade',
    values: {
      hnsw: { rating: 'good', note: 'Filterable HNSW (Qdrant, Weaviate)' },
      ivfpq: { rating: 'fair', note: 'Post-filter ou rebuild' },
      flat: { rating: 'excellent', note: 'WHERE nativo — exato' },
    },
  },
  {
    id: 'usecase',
    label: 'Caso de Uso Ideal',
    category: 'Decisão',
    values: {
      hnsw: { rating: 'excellent', note: '< 50M vetores, alta qualidade' },
      ivfpq: { rating: 'excellent', note: '> 100M vetores, RAM limitada' },
      flat: { rating: 'na', note: 'Ground truth / datasets < 100K' },
    },
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Visual 4: IVF — Como funciona a busca por cluster (interativo)
// ─────────────────────────────────────────────────────────────────────────────

type Cluster = { id: string; cx: number; cy: number; color: string; points: { x: number; y: number }[] }

const CLUSTERS: Cluster[] = [
  { id: 'C1', cx: 120, cy: 100, color: C, points: [{ x: 80, y: 80 }, { x: 100, y: 120 }, { x: 150, y: 90 }, { x: 130, y: 130 }] },
  { id: 'C2', cx: 300, cy: 80,  color: GRN, points: [{ x: 260, y: 60 }, { x: 280, y: 100 }, { x: 320, y: 70 }, { x: 340, y: 100 }] },
  { id: 'C3', cx: 450, cy: 130, color: AMB, points: [{ x: 410, y: 110 }, { x: 440, y: 150 }, { x: 480, y: 110 }, { x: 490, y: 155 }] },
  { id: 'C4', cx: 180, cy: 230, color: SKY, points: [{ x: 140, y: 210 }, { x: 160, y: 250 }, { x: 200, y: 220 }, { x: 210, y: 255 }] },
  { id: 'C5', cx: 380, cy: 250, color: RED, points: [{ x: 340, y: 230 }, { x: 360, y: 270 }, { x: 400, y: 240 }, { x: 420, y: 270 }] },
]

const QUERY_POINT = { x: 310, y: 170 }

function IvfSearchVisual() {
  const [nprobe, setNprobe] = useState(2)
  const [showQuery, setShowQuery] = useState(true)

  // Calcular distância do query a cada centróide
  const dists = CLUSTERS.map(c => ({
    id: c.id,
    dist: Math.sqrt((c.cx - QUERY_POINT.x) ** 2 + (c.cy - QUERY_POINT.y) ** 2),
  })).sort((a, b) => a.dist - b.dist)

  const selectedClusters = new Set(dists.slice(0, nprobe).map(d => d.id))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, color: FGMUTE }}>nprobe =</span>
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            onClick={() => setNprobe(n)}
            style={{
              width: 36, height: 36, borderRadius: 8, cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace',
              border: `2px solid ${nprobe === n ? C : LINE}`,
              background: nprobe === n ? `${C}20` : CARD,
              color: nprobe === n ? C : FGMUTE, fontSize: 13, fontWeight: 700,
            }}
          >
            {n}
          </button>
        ))}
        <span style={{ fontSize: 11, color: FGMUTE }}>clusters inspecionados de {CLUSTERS.length}</span>
        <button
          onClick={() => setShowQuery(!showQuery)}
          style={{
            padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
            border: `1.5px solid ${showQuery ? AMB : LINE}`,
            background: showQuery ? `${AMB}15` : 'transparent',
            color: showQuery ? AMB : FGMUTE, fontSize: 11,
          }}
        >
          {showQuery ? 'Ocultar query' : 'Mostrar query'}
        </button>
      </div>

      {/* SVG visualization */}
      <div style={{ background: CARD, borderRadius: 10, border: `1.5px solid ${LINE}` }}>
        <svg width="100%" viewBox="0 0 560 320" style={{ display: 'block' }}>
          {/* Cluster regions */}
          {CLUSTERS.map(c => (
            <circle
              key={`region-${c.id}`}
              cx={c.cx} cy={c.cy} r={70}
              fill={selectedClusters.has(c.id) ? `${c.color}12` : `${FGMUTE}05`}
              stroke={selectedClusters.has(c.id) ? `${c.color}60` : `${LINE}50`}
              strokeWidth={selectedClusters.has(c.id) ? 2 : 1}
              strokeDasharray={selectedClusters.has(c.id) ? 'none' : '4,4'}
            />
          ))}

          {/* Lines from query to selected centroids */}
          {showQuery && CLUSTERS.filter(c => selectedClusters.has(c.id)).map(c => (
            <line
              key={`line-${c.id}`}
              x1={QUERY_POINT.x} y1={QUERY_POINT.y}
              x2={c.cx} y2={c.cy}
              stroke={c.color} strokeWidth={1.5} strokeOpacity={0.6} strokeDasharray="5,3"
            />
          ))}

          {/* Points in clusters */}
          {CLUSTERS.map(c =>
            c.points.map((pt, i) => (
              <circle
                key={`${c.id}-pt-${i}`}
                cx={pt.x} cy={pt.y} r={5}
                fill={selectedClusters.has(c.id) ? c.color : FGMUTE}
                fillOpacity={selectedClusters.has(c.id) ? 0.8 : 0.3}
              />
            ))
          )}

          {/* Centroids */}
          {CLUSTERS.map(c => (
            <g key={`centroid-${c.id}`}>
              <polygon
                points={`${c.cx},${c.cy - 10} ${c.cx + 9},${c.cy + 5} ${c.cx - 9},${c.cy + 5}`}
                fill={selectedClusters.has(c.id) ? c.color : FGMUTE}
                fillOpacity={selectedClusters.has(c.id) ? 1 : 0.3}
              />
              <text x={c.cx} y={c.cy - 15} textAnchor="middle" fill={selectedClusters.has(c.id) ? c.color : FGMUTE}
                fontSize="10" fontWeight="700" fontFamily="JetBrains Mono, monospace">
                {c.id}
              </text>
            </g>
          ))}

          {/* Query point */}
          {showQuery && (
            <g>
              <circle cx={QUERY_POINT.x} cy={QUERY_POINT.y} r={10} fill={AMB} fillOpacity={0.2} stroke={AMB} strokeWidth={2.5} />
              <text x={QUERY_POINT.x} y={QUERY_POINT.y + 4} textAnchor="middle" fill={AMB} fontSize="10" fontWeight="700">Q</text>
              <text x={QUERY_POINT.x} y={QUERY_POINT.y - 16} textAnchor="middle" fill={AMB} fontSize="9">query</text>
            </g>
          )}
        </svg>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        <div style={{ background: CARD, border: `1.5px solid ${LINE}`, borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: C }}>{nprobe}</div>
          <div style={{ fontSize: 10, color: FGMUTE }}>clusters inspecionados</div>
        </div>
        <div style={{ background: CARD, border: `1.5px solid ${LINE}`, borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: GRN }}>{nprobe * 4}</div>
          <div style={{ fontSize: 10, color: FGMUTE }}>vetores comparados</div>
        </div>
        <div style={{ background: CARD, border: `1.5px solid ${LINE}`, borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: AMB }}>{Math.round(nprobe / 5 * 100)}%</div>
          <div style={{ fontSize: 10, color: FGMUTE }}>cobertura do dataset</div>
        </div>
      </div>

      <div style={{ fontSize: 11, color: FGMUTE, lineHeight: 1.6, padding: '8px 12px', background: CARD, borderRadius: 8 }}>
        IVF compara a query com os {CLUSTERS.length} centroids (barato), seleciona os {nprobe} mais próximos, e busca exata só dentro desses clusters.
        nprobe alto = mais recall, mais comparações. Ponto ótimo: nprobe onde recall para de crescer significativamente.
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Visual 5: Decisão — Qual Vector DB usar?
// ─────────────────────────────────────────────────────────────────────────────

const VDB_ROOT: DTNode = {
  id: 'root',
  question: 'Qual é o tamanho do seu dataset?',
  children: [
    { label: '< 1M vetores', nodeId: 'small', color: GRN },
    { label: '1M – 100M', nodeId: 'medium', color: AMB },
    { label: '> 100M vetores', nodeId: 'large', color: RED },
  ],
}

const VDB_NODES: Record<string, DTNode> = {
  small: {
    id: 'small',
    question: 'Já usa PostgreSQL no projeto?',
    children: [
      { label: 'Sim', nodeId: 'small-pg', color: C },
      { label: 'Não', nodeId: 'small-nopg', color: GRN },
    ],
  },
  medium: {
    id: 'medium',
    question: 'Precisa de filtros dinâmicos variados?',
    children: [
      { label: 'Sim (filtros complexos)', nodeId: 'medium-filter', color: C },
      { label: 'Não (ANN puro)', nodeId: 'medium-nofilter', color: GRN },
    ],
  },
  large: {
    id: 'large',
    question: 'Infraestrutura self-hosted ou managed?',
    children: [
      { label: 'Self-hosted', nodeId: 'large-self', color: C },
      { label: 'Managed (SaaS)', nodeId: 'large-managed', color: GRN },
    ],
  },
  'small-pg': {
    id: 'small-pg',
    recommendation: 'pgvector',
    detail: 'pgvector roda dentro do PostgreSQL existente. Zero infra extra. HNSW nativo, ACID, joins com dados relacionais. Reindexação simples. Suficiente para 99% dos projetos nesse tamanho.',
    color: C,
    icon: '🐘',
  },
  'small-nopg': {
    id: 'small-nopg',
    recommendation: 'Qdrant ou pgvector',
    detail: 'Se vai usar banco de dados de qualquer forma, adicione pgvector ao PostgreSQL — economiza uma dependência. Se precisa de features avançadas (hybrid sparse+dense), Qdrant é a melhor escolha.',
    color: GRN,
    icon: '🎯',
  },
  'medium-filter': {
    id: 'medium-filter',
    recommendation: 'Qdrant',
    detail: 'Qdrant tem filterable HNSW — filtra sem degradar recall mesmo com filtros muito seletivos (<1% dos dados). Ideal para e-commerce, busca com facets, recomendação com contexto.',
    color: C,
    icon: '🔍',
  },
  'medium-nofilter': {
    id: 'medium-nofilter',
    recommendation: 'pgvector dedicado ou Qdrant',
    detail: 'Para ANN puro sem filtros complexos, pgvector em instância dedicada (com shared_buffers grande) suporta bem 1-50M vetores. Qdrant para melhor performance e features avançadas.',
    color: GRN,
    icon: '⚡',
  },
  'large-self': {
    id: 'large-self',
    recommendation: 'Faiss + sharding',
    detail: 'Faiss (Meta) com IVF-PQ para escala extrema. Sharding horizontal: divide em N shards, query em paralelo, agrega top-K. Milvus é alternativa com sharding gerenciado on-premise.',
    color: AMB,
    icon: '🏭',
  },
  'large-managed': {
    id: 'large-managed',
    recommendation: 'Pinecone ou Zilliz',
    detail: 'Pinecone é serverless, escala automático, sem gestão de índice. Zilliz é Milvus managed com escala global. Ambos têm IVF-PQ para datasets de bilhões.',
    color: GRN,
    icon: '☁️',
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Montagem dos visuais
// ─────────────────────────────────────────────────────────────────────────────

export default function HnswIvfVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'hnsw-layers',
      title: 'Estrutura do Grafo HNSW',
      subtitle: 'Selecione uma camada para explorar — a busca desce do topo até a Layer 0',
      accent: C,
      component: <HnswLayerExplorer />,
    },
    {
      id: 'tuning',
      title: 'Tuning de ef_search — Recall × Latência',
      subtitle: 'Selecione ef_search e veja o impacto em recall e latência p99',
      accent: C,
      component: <TuningVisual />,
    },
    {
      id: 'comparison',
      title: 'HNSW vs IVF-PQ vs Brute Force',
      subtitle: 'Comparação objetiva por critério — escolha o algoritmo certo para cada caso',
      accent: AMB,
      component: (
        <ComparisonTable
          options={ANN_OPTIONS}
          criteria={ANN_CRITERIA}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'ivf-search',
      title: 'IVF — Como Funciona a Busca por Cluster',
      subtitle: 'Ajuste nprobe e veja quantos clusters são inspecionados',
      accent: AMB,
      component: <IvfSearchVisual />,
    },
    {
      id: 'vector-db-decision',
      title: 'Qual Vector DB Usar?',
      subtitle: 'Árvore de decisão por tamanho de dataset e requisitos',
      accent: GRN,
      component: (
        <DecisionTree
          root={VDB_ROOT}
          nodes={VDB_NODES}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
  ]

  return (
    <VisuaisShell
      visuals={visuals}
      active={active}
      onChange={setActive}
    />
  )
}
