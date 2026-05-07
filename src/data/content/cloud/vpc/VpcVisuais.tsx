'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'

// ── Paleta VPC ────────────────────────────────────────────────────────────────
const C      = '#4A90E2'   // azul VPC
const SEC    = '#2c6ec0'
const BG     = '#0f172a'
const CARD   = '#1e293b'
const CARD2  = '#243044'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#4ade80'
const RED    = '#ef4444'
const SKY    = '#38bdf8'
const PRP    = '#a78bfa'
const AMB    = '#f59e0b'
const PINK   = '#ec4899'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — VPC Architecture Explorer (custom interactive)
// Justificativa: VPC é hierárquica (VPC → AZ → Subnet → Route Table → recursos).
// Ver os componentes vivos, clicáveis, com fluxos de tráfego destacados é o que
// fixa o modelo mental — texto de keypoints não consegue mostrar a relação.
// ═══════════════════════════════════════════════════════════════════════════════

type VpcResource = {
  id: string
  type: 'igw' | 'subnet-pub' | 'subnet-app' | 'subnet-db' | 'nat' | 'alb' | 'ec2' | 'rds' | 'endpoint'
  label: string
  cidr?: string
  az?: string
  description: string
  trafficFlow?: string
}

const VPC_RESOURCES: VpcResource[] = [
  { id: 'igw', type: 'igw', label: 'Internet Gateway', description: 'Borda da VPC com a internet. Bidirecional, gerenciado pela AWS, gratuito. Necessário para subnets públicas — instâncias com IP público alcançam internet via IGW.', trafficFlow: 'Bidirecional Internet ↔ VPC' },
  { id: 'pub-1a', type: 'subnet-pub', label: 'Pública 1a', cidr: '10.0.0.0/24', az: 'us-east-1a', description: 'Subnet pública na AZ-A. Route table aponta 0.0.0.0/0 → IGW. Hospeda apenas ALB e NAT GW (sem instâncias de aplicação).', trafficFlow: 'Internet ↔ ALB · NAT GW → Internet' },
  { id: 'pub-1b', type: 'subnet-pub', label: 'Pública 1b', cidr: '10.0.1.0/24', az: 'us-east-1b', description: 'Subnet pública na AZ-B (HA). Mesma estrutura da 1a, em AZ diferente — falha de uma AZ não derruba a outra.', trafficFlow: 'Internet ↔ ALB · NAT GW → Internet' },
  { id: 'nat-a', type: 'nat', label: 'NAT GW (1a)', az: 'us-east-1a', description: 'NAT Gateway na subnet pública 1a. Permite instâncias privadas iniciarem conexões para internet (apt update, APIs externas). Internet NÃO inicia conexão para elas. ~$0.045/h + $/GB.' },
  { id: 'nat-b', type: 'nat', label: 'NAT GW (1b)', az: 'us-east-1b', description: 'Segundo NAT (1 por AZ). HA + economia: subnet privada de cada AZ usa o NAT da própria AZ, evitando custo cross-AZ ($0.01/GB).' },
  { id: 'alb', type: 'alb', label: 'Application Load Balancer', description: 'ALB público recebe HTTPS, distribui entre EC2/ECS em subnets privadas via SG referencing (sg-app source = sg-alb).', trafficFlow: 'Internet → ALB → App tier' },
  { id: 'app-1a', type: 'subnet-app', label: 'App 1a', cidr: '10.0.10.0/24', az: 'us-east-1a', description: 'Subnet privada de aplicação. Route table: 0.0.0.0/0 → NAT GW (1a). Sem IP público. Recebe tráfego apenas do ALB (SG).', trafficFlow: 'ALB → EC2 · EC2 → NAT GW → Internet' },
  { id: 'app-1b', type: 'subnet-app', label: 'App 1b', cidr: '10.0.11.0/24', az: 'us-east-1b', description: 'Mesma estrutura da app 1a, em AZ-B. Auto Scaling Group espalha instâncias entre 1a e 1b.', trafficFlow: 'ALB → EC2 · EC2 → NAT GW (1b) → Internet' },
  { id: 'ec2', type: 'ec2', label: 'EC2 / ECS tasks', description: 'Instâncias da aplicação. SG inbound: porta 8080 com source = sg-alb (não CIDR). SG outbound: porta 5432 para sg-rds + 443 internet via NAT.' },
  { id: 'db-1a', type: 'subnet-db', label: 'DB 1a (isolada)', cidr: '10.0.20.0/24', az: 'us-east-1a', description: 'Subnet de banco TOTALMENTE isolada. SEM rota para NAT — só comunicação interna via 10.0.0.0/16. Camada extra de defesa: mesmo se aplicação for comprometida, banco não exfiltra para internet.', trafficFlow: 'App tier → RDS · RDS sem saída' },
  { id: 'db-1b', type: 'subnet-db', label: 'DB 1b (isolada)', cidr: '10.0.21.0/24', az: 'us-east-1b', description: 'RDS Multi-AZ standby. Replicação síncrona com primary em 1a — failover automático em caso de falha.' },
  { id: 'rds', type: 'rds', label: 'RDS PostgreSQL', description: 'Multi-AZ deployment. SG inbound: 5432 com source = sg-app (apenas aplicação). Tentativa de conexão da internet falha por: (1) sem rota da subnet, (2) SG bloqueia, (3) sem IP público.' },
  { id: 's3-endpoint', type: 'endpoint', label: 'Gateway Endpoint S3', description: 'Tráfego para S3 não passa pela internet. Gratuito. Adiciona rota implícita pl-63a5400a → vpce-s3-xxx em todas as route tables privadas. Endpoint Policy restringe quais buckets podem ser acessados.', trafficFlow: 'EC2 → S3 sem passar por NAT/Internet' },
]

function VpcArchitectureExplorer() {
  const [sel, setSel] = useState<string>('alb')
  const active = VPC_RESOURCES.find(r => r.id === sel)!

  function getColor(type: VpcResource['type']) {
    switch (type) {
      case 'igw': return GRN
      case 'subnet-pub': return GRN
      case 'subnet-app': return PRP
      case 'subnet-db': return RED
      case 'nat': return AMB
      case 'alb': return SKY
      case 'ec2': return C
      case 'rds': return RED
      case 'endpoint': return PINK
    }
  }

  function ResourceCell({ r, w = 110 }: { r: VpcResource; w?: number }) {
    const isSel = r.id === sel
    const color = getColor(r.type)
    return (
      <button
        onClick={() => setSel(r.id)}
        style={{
          width: w,
          background: isSel ? `${color}30` : CARD,
          border: `2px solid ${isSel ? color : LINE}`,
          borderRadius: 8,
          padding: '8px 10px',
          cursor: 'pointer',
          fontFamily: "'JetBrains Mono', monospace",
          textAlign: 'center',
          transition: 'all .2s',
          color: isSel ? color : FG,
          boxShadow: isSel ? `0 0 18px ${color}50` : 'none',
        }}
      >
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase' }}>{r.label}</div>
        {r.cidr && <div style={{ fontSize: 8, color: FGMUTE, marginTop: 2 }}>{r.cidr}</div>}
      </button>
    )
  }

  const activeColor = getColor(active.type)

  return (
    <div style={{ background: BG, border: `1px solid ${LINE}`, borderRadius: 14, padding: 24, fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ marginBottom: 18 }}>
        <h3 style={{ color: FG, margin: 0, fontSize: 16, fontWeight: 800 }}>Arquitetura VPC 3-tier multi-AZ</h3>
        <p style={{ color: FGMUTE, fontSize: 12, margin: '4px 0 0' }}>Clique em qualquer componente para ver detalhes técnicos e fluxo de tráfego.</p>
      </div>

      {/* Diagrama */}
      <div style={{ background: CARD, border: `2px dashed ${LINE}`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
        {/* Internet + IGW */}
        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div style={{ background: BG, border: `1px solid ${LINE}`, borderRadius: 6, padding: '6px 18px', fontSize: 10, color: FGMUTE }}>Internet</div>
          <div style={{ color: FGMUTE, fontSize: 16 }}>↕</div>
          <ResourceCell r={VPC_RESOURCES[0]} w={170} />
        </div>

        {/* VPC border */}
        <div style={{ border: `2px solid ${C}40`, borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 9, color: C, letterSpacing: '.1em', fontWeight: 700, marginBottom: 12, textTransform: 'uppercase' }}>VPC 10.0.0.0/16</div>

          {/* AZs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {/* AZ-1a */}
            <div style={{ background: BG, border: `1.5px solid ${LINE}`, borderRadius: 8, padding: 10 }}>
              <div style={{ fontSize: 8, color: SKY, letterSpacing: '.1em', fontWeight: 700, marginBottom: 8 }}>AZ — us-east-1a</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
                <ResourceCell r={VPC_RESOURCES[1]} w={140} />
                <div style={{ display: 'flex', gap: 4 }}>
                  <ResourceCell r={VPC_RESOURCES[3]} w={68} />
                  <ResourceCell r={VPC_RESOURCES[5]} w={68} />
                </div>
                <div style={{ color: FGMUTE, fontSize: 12 }}>↕</div>
                <ResourceCell r={VPC_RESOURCES[6]} w={140} />
                <ResourceCell r={VPC_RESOURCES[8]} w={140} />
                <div style={{ color: FGMUTE, fontSize: 12 }}>↕</div>
                <ResourceCell r={VPC_RESOURCES[9]} w={140} />
                <ResourceCell r={VPC_RESOURCES[11]} w={140} />
              </div>
            </div>

            {/* AZ-1b */}
            <div style={{ background: BG, border: `1.5px solid ${LINE}`, borderRadius: 8, padding: 10 }}>
              <div style={{ fontSize: 8, color: SKY, letterSpacing: '.1em', fontWeight: 700, marginBottom: 8 }}>AZ — us-east-1b</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
                <ResourceCell r={VPC_RESOURCES[2]} w={140} />
                <ResourceCell r={VPC_RESOURCES[4]} w={140} />
                <div style={{ color: FGMUTE, fontSize: 12 }}>↕</div>
                <ResourceCell r={VPC_RESOURCES[7]} w={140} />
                <div style={{ color: FGMUTE, fontSize: 12 }}>↕</div>
                <ResourceCell r={VPC_RESOURCES[10]} w={140} />
              </div>
            </div>
          </div>

          {/* Endpoint */}
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center' }}>
            <ResourceCell r={VPC_RESOURCES[12]} w={220} />
          </div>
        </div>
      </div>

      {/* Detalhes */}
      <div style={{ background: CARD, border: `2px solid ${activeColor}40`, borderRadius: 12, padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: `${activeColor}25`,
            border: `2px solid ${activeColor}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: activeColor,
            fontSize: 14, fontWeight: 800,
          }}>
            {active.label[0]}
          </div>
          <div>
            <div style={{ color: activeColor, fontSize: 14, fontWeight: 800 }}>{active.label}</div>
            {active.az && <div style={{ color: FGMUTE, fontSize: 10 }}>{active.az}{active.cidr && ` · ${active.cidr}`}</div>}
          </div>
        </div>
        <div style={{ color: FG, fontSize: 12, lineHeight: 1.7, marginBottom: 10, fontFamily: "'Space Grotesk', sans-serif" }}>
          {active.description}
        </div>
        {active.trafficFlow && (
          <div style={{
            background: BG,
            borderLeft: `3px solid ${activeColor}`,
            borderRadius: 4,
            padding: '8px 12px',
            fontSize: 11,
            color: FGMUTE,
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            <span style={{ color: activeColor, fontWeight: 700, marginRight: 6 }}>Fluxo:</span>
            {active.trafficFlow}
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Security Group vs NACL (custom side-by-side)
// Justificativa: a diferença stateful vs stateless é abstrata em texto. Animar
// pacote indo + pacote voltando, mostrando onde cada firewall avalia, fixa que
// SG libera resposta automática mas NACL exige regra explícita.
// ═══════════════════════════════════════════════════════════════════════════════

type FlowStage = 'idle' | 'inbound' | 'processing' | 'outbound' | 'done'

function SgVsNaclFlow() {
  const [stage, setStage] = useState<FlowStage>('idle')

  function play() {
    setStage('inbound')
    setTimeout(() => setStage('processing'), 800)
    setTimeout(() => setStage('outbound'), 1600)
    setTimeout(() => setStage('done'), 2400)
  }

  function reset() {
    setStage('idle')
  }

  function FlowCard({
    title, accent, isStateful, label, items,
  }: {
    title: string; accent: string; isStateful: boolean; label: string; items: { label: string; status: 'allow' | 'auto-allow' | 'need-allow' | 'block' }[]
  }) {
    return (
      <div style={{
        background: CARD,
        border: `2px solid ${accent}40`,
        borderRadius: 12,
        padding: 18,
        position: 'relative',
      }}>
        <div style={{ position: 'absolute', top: -12, left: 14, background: BG, padding: '2px 10px', fontSize: 9, fontWeight: 700, color: accent, letterSpacing: '.1em' }}>
          {label}
        </div>
        <div style={{ color: accent, fontSize: 13, fontWeight: 800, marginBottom: 4 }}>{title}</div>
        <div style={{ color: FGMUTE, fontSize: 10, marginBottom: 14 }}>
          {isStateful ? '✓ Resposta automática (track conexão)' : '⚠ Resposta exige regra explícita'}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map((it, i) => {
            const isActive = (
              (i === 0 && (stage === 'inbound' || stage === 'processing' || stage === 'outbound' || stage === 'done')) ||
              (i === 1 && (stage === 'processing' || stage === 'outbound' || stage === 'done')) ||
              (i === 2 && (stage === 'outbound' || stage === 'done'))
            )

            const colors: Record<string, [string, string]> = {
              'allow': [GRN, 'INBOUND ALLOW'],
              'auto-allow': [GRN, 'AUTO ALLOW (stateful)'],
              'need-allow': [AMB, 'PRECISA OUTBOUND ALLOW'],
              'block': [RED, 'BLOQUEADO'],
            }
            const [color, label] = colors[it.status]

            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: isActive ? `${color}15` : BG,
                  border: `1.5px solid ${isActive ? color : LINE}`,
                  borderRadius: 6,
                  padding: '8px 12px',
                  fontSize: 10.5,
                  color: isActive ? FG : FGMUTE,
                  transition: 'all .3s',
                  fontFamily: "'JetBrains Mono', monospace",
                  boxShadow: isActive ? `0 0 12px ${color}40` : 'none',
                }}
              >
                <span>{it.label}</span>
                <span style={{
                  fontSize: 8,
                  fontWeight: 700,
                  letterSpacing: '.05em',
                  padding: '2px 6px',
                  background: isActive ? `${color}30` : 'transparent',
                  borderRadius: 3,
                  color: isActive ? color : FGMUTE,
                }}>
                  {label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: BG, border: `1px solid ${LINE}`, borderRadius: 14, padding: 24, fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ marginBottom: 18 }}>
        <h3 style={{ color: FG, margin: 0, fontSize: 16, fontWeight: 800 }}>Security Group (stateful) vs NACL (stateless)</h3>
        <p style={{ color: FGMUTE, fontSize: 12, margin: '4px 0 0' }}>Clique para simular um request HTTPS e ver onde cada firewall avalia o pacote. A diferença prática aparece na resposta.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
        <FlowCard
          title="Security Group"
          accent={GRN}
          isStateful={true}
          label="STATEFUL · ENI"
          items={[
            { label: '1. Cliente → Server (TCP 443)', status: 'allow' },
            { label: '2. App processa request', status: 'allow' },
            { label: '3. Server → Cliente (resposta)', status: 'auto-allow' },
          ]}
        />
        <FlowCard
          title="Network ACL (NACL)"
          accent={AMB}
          isStateful={false}
          label="STATELESS · SUBNET"
          items={[
            { label: '1. Cliente → Server (TCP 443)', status: 'allow' },
            { label: '2. App processa request', status: 'allow' },
            { label: '3. Server → Cliente (porta 1024-65535)', status: 'need-allow' },
          ]}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
        <button
          onClick={play}
          disabled={stage !== 'idle' && stage !== 'done'}
          style={{
            background: (stage === 'idle' || stage === 'done') ? C : LINE,
            color: (stage === 'idle' || stage === 'done') ? '#fff' : FGMUTE,
            border: 'none',
            borderRadius: 8,
            padding: '10px 22px',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '.05em',
            cursor: (stage === 'idle' || stage === 'done') ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit',
          }}
        >
          {stage === 'idle' ? '▶ SIMULAR REQUEST HTTPS' : stage === 'done' ? '✓ REPETIR' : 'EXECUTANDO...'}
        </button>
        <button
          onClick={reset}
          style={{
            background: 'transparent',
            color: FG,
            border: `1px solid ${LINE}`,
            borderRadius: 8,
            padding: '10px 22px',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          RESET
        </button>
      </div>

      <div style={{
        background: CARD2,
        borderLeft: `3px solid ${C}`,
        borderRadius: 6,
        padding: '12px 14px',
        fontSize: 11,
        color: FGMUTE,
        lineHeight: 1.7,
        fontFamily: "'Space Grotesk', sans-serif",
      }}>
        <strong style={{ color: C }}>Por que importa:</strong> a fonte #1 de "EC2 não responde" depois de configurar NACL custom é esquecer outbound 1024-65535 (portas efêmeras de resposta). Stateful Security Groups eliminam essa preocupação — para 99% dos casos, deixe NACL default (allow all) e configure tudo no SG.
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Connectivity Options (ComparisonTable)
// Justificativa: VPC Peering, Transit Gateway, VPN e Direct Connect têm
// trade-offs em 6+ dimensões (custo, latência, transitivity, escala, complexidade).
// Tabela é o formato natural — comparar em texto perde a estrutura.
// ═══════════════════════════════════════════════════════════════════════════════

const CONNECTIVITY_OPTIONS: ComparisonOption[] = [
  { id: 'peering', label: 'VPC Peering', sublabel: 'Conexão direta 2 VPCs', color: SKY },
  { id: 'tgw', label: 'Transit Gateway', sublabel: 'Hub central transitivo', color: PRP },
  { id: 'vpn', label: 'Site-to-Site VPN', sublabel: 'IPsec sobre internet', color: AMB },
  { id: 'dx', label: 'Direct Connect', sublabel: 'Link físico dedicado', color: GRN },
]

const CONNECTIVITY_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'cost',
    label: 'Custo',
    category: 'Custo',
    description: 'Custo aproximado de operação',
    values: {
      peering: { rating: 'excellent', note: 'Sem custo por hora, só $/GB transferido' },
      tgw: { rating: 'fair', note: '$0.05/h por attachment + $0.02/GB' },
      vpn: { rating: 'good', note: '$0.05/h por túnel + $/GB' },
      dx: { rating: 'poor', note: '$0.30/h por porta 1Gbps + $/GB. Hardware dedicado caro.' },
    },
  },
  {
    id: 'latency',
    label: 'Latência',
    category: 'Performance',
    description: 'Latência adicional na conexão',
    values: {
      peering: { rating: 'excellent', note: 'Tráfego pelo backbone AWS, sub-ms' },
      tgw: { rating: 'good', note: 'Hop adicional pelo TGW, +1-2ms' },
      vpn: { rating: 'fair', note: 'Variável (internet pública), 10-100ms' },
      dx: { rating: 'excellent', note: 'Sub-ms, fibra dedicada' },
    },
  },
  {
    id: 'bandwidth',
    label: 'Bandwidth máximo',
    category: 'Performance',
    description: 'Capacidade máxima de transferência',
    values: {
      peering: { rating: 'excellent', note: 'Até 25 Gbps por flow, ilimitado agregado' },
      tgw: { rating: 'good', note: '50 Gbps por attachment, agregação ilimitada' },
      vpn: { rating: 'poor', note: '~1.25 Gbps por túnel (use ECMP para mais)' },
      dx: { rating: 'excellent', note: '1, 10, 100 Gbps disponíveis' },
    },
  },
  {
    id: 'transitivity',
    label: 'Transitividade',
    category: 'Topologia',
    description: 'A↔B + B↔C cria A↔C?',
    values: {
      peering: { rating: 'poor', note: 'NÃO transitivo — cresce N×(N-1)/2' },
      tgw: { rating: 'excellent', note: 'Transitivo nativo via route tables' },
      vpn: { rating: 'fair', note: 'Depende — TGW + VPN é transitivo' },
      dx: { rating: 'fair', note: 'Via DX Gateway pode ser, com TGW' },
    },
  },
  {
    id: 'scale',
    label: 'Escala (# VPCs)',
    category: 'Topologia',
    description: 'Recomendado até quantas VPCs',
    values: {
      peering: { rating: 'fair', note: 'Bom até 5 VPCs. Acima fica inviável.' },
      tgw: { rating: 'excellent', note: 'Centenas de VPCs sem problema' },
      vpn: { rating: 'good', note: 'Conecta on-premises, não inter-VPC' },
      dx: { rating: 'good', note: 'On-premises com TGW/VGW' },
    },
  },
  {
    id: 'cross-region',
    label: 'Cross-region',
    category: 'Topologia',
    description: 'Suporta conexão entre regiões',
    values: {
      peering: { rating: 'good', note: 'Inter-region peering disponível' },
      tgw: { rating: 'good', note: 'TGW peering entre regiões' },
      vpn: { rating: 'fair', note: 'Sim, mas latência variável' },
      dx: { rating: 'good', note: 'DX Gateway suporta cross-region' },
    },
  },
  {
    id: 'use-case',
    label: 'Caso de uso ideal',
    category: 'Decisão',
    description: 'Quando escolher esta opção',
    values: {
      peering: { rating: 'good', note: '2-5 VPCs da mesma org sem complexidade' },
      tgw: { rating: 'excellent', note: '5+ VPCs, multi-conta, segmentação por ambiente' },
      vpn: { rating: 'good', note: 'Conectividade rápida com on-premises sem investir em fibra' },
      dx: { rating: 'good', note: 'Workloads com volume alto e latência crítica para on-prem' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — VPC Endpoints — antes/depois (custom)
// Justificativa: o conceito de "tráfego não passa mais pela internet" é abstrato.
// Ver visualmente o caminho ANTES (EC2 → NAT → IGW → Internet → S3) e DEPOIS
// (EC2 → Gateway Endpoint → S3) ancora o ganho de custo + segurança.
// ═══════════════════════════════════════════════════════════════════════════════

function VpcEndpointsVisual() {
  const [mode, setMode] = useState<'before' | 'after'>('before')

  return (
    <div style={{ background: BG, border: `1px solid ${LINE}`, borderRadius: 14, padding: 24, fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ marginBottom: 18 }}>
        <h3 style={{ color: FG, margin: 0, fontSize: 16, fontWeight: 800 }}>VPC Endpoints — eliminar tráfego pela internet</h3>
        <p style={{ color: FGMUTE, fontSize: 12, margin: '4px 0 0' }}>Compare o caminho de uma chamada de EC2 privada para S3 antes e depois de configurar Gateway Endpoint.</p>
      </div>

      {/* Toggle */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 0, marginBottom: 20 }}>
        <button
          onClick={() => setMode('before')}
          style={{
            background: mode === 'before' ? `${RED}25` : CARD,
            border: `2px solid ${mode === 'before' ? RED : LINE}`,
            borderRadius: '8px 0 0 8px',
            padding: '10px 22px',
            color: mode === 'before' ? RED : FG,
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          ANTES (sem endpoint)
        </button>
        <button
          onClick={() => setMode('after')}
          style={{
            background: mode === 'after' ? `${GRN}25` : CARD,
            border: `2px solid ${mode === 'after' ? GRN : LINE}`,
            borderLeft: 'none',
            borderRadius: '0 8px 8px 0',
            padding: '10px 22px',
            color: mode === 'after' ? GRN : FG,
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          DEPOIS (Gateway Endpoint)
        </button>
      </div>

      {/* Diagrama */}
      <div style={{
        background: CARD,
        border: `2px solid ${mode === 'before' ? RED : GRN}40`,
        borderRadius: 12,
        padding: 20,
        marginBottom: 14,
      }}>
        {mode === 'before' ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <Box label="EC2 privado" color={C} sub="subnet 10.0.10.0/24" />
              <Arrow color={RED} label="$0.045/GB" />
              <Box label="NAT GW" color={AMB} sub="subnet pública" />
              <Arrow color={RED} label="$0.045/GB" />
              <Box label="IGW" color={GRN} sub="$0" />
              <Arrow color={RED} label="latência variável" />
              <Box label="Internet" color={FGMUTE} sub="público" />
              <Arrow color={RED} label="" />
              <Box label="S3" color={AMB} sub="bucket público" />
            </div>
            <div style={{
              marginTop: 16,
              background: BG,
              borderLeft: `3px solid ${RED}`,
              borderRadius: 6,
              padding: '12px 14px',
              fontSize: 11,
              color: FGMUTE,
              lineHeight: 1.7,
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              <strong style={{ color: RED }}>Problemas:</strong> custo de NAT (ida + volta = $0.09/GB), tráfego pela internet pública (mesmo o S3 é endpoint público), credenciais que vazam podem ser usadas FORA da VPC.
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: 18 }}>
              <Box label="EC2 privado" color={C} sub="subnet 10.0.10.0/24" />
              <Arrow color={GRN} label="rede AWS" />
              <Box label="Gateway Endpoint" color={PINK} sub="vpce-s3-xxx · $0" big />
              <Arrow color={GRN} label="dentro da AWS" />
              <Box label="S3" color={AMB} sub="restrito por policy" />
            </div>
            <div style={{
              marginTop: 16,
              background: BG,
              borderLeft: `3px solid ${GRN}`,
              borderRadius: 6,
              padding: '12px 14px',
              fontSize: 11,
              color: FGMUTE,
              lineHeight: 1.7,
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              <strong style={{ color: GRN }}>Ganhos:</strong> Gateway Endpoint é gratuito. Tráfego não passa pela internet. Endpoint Policy + bucket policy com aws:SourceVpce limitam acesso aos buckets aprovados — defense in depth contra exfiltration mesmo com credenciais vazadas. Bonus: economia direta de NAT processing fees.
            </div>
          </div>
        )}
      </div>

      {/* Comparativo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        <Metric label="Custo NAT" before="$0.09/GB" after="$0" delta="-100%" />
        <Metric label="Latência" before="variável" after="sub-ms" delta="−" />
        <Metric label="Visibilidade pública" before="sim" after="não" delta="−" />
        <Metric label="Endpoint Policy" before="N/A" after="sim" delta="+" />
      </div>
    </div>
  )

  function Box({ label, color, sub, big = false }: { label: string; color: string; sub: string; big?: boolean }) {
    return (
      <div style={{
        background: BG,
        border: `2px solid ${color}`,
        borderRadius: 8,
        padding: big ? '12px 14px' : '10px 12px',
        textAlign: 'center',
        minWidth: big ? 130 : 90,
      }}>
        <div style={{ color, fontSize: big ? 11 : 10, fontWeight: 700, letterSpacing: '.05em' }}>{label}</div>
        <div style={{ color: FGMUTE, fontSize: 8, marginTop: 3 }}>{sub}</div>
      </div>
    )
  }

  function Arrow({ color, label }: { color: string; label: string }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 60 }}>
        <div style={{ color, fontSize: 18 }}>→</div>
        {label && <div style={{ color, fontSize: 8, marginTop: 2, fontWeight: 600 }}>{label}</div>}
      </div>
    )
  }

  function Metric({ label, before, after, delta }: { label: string; before: string; after: string; delta: string }) {
    return (
      <div style={{
        background: CARD,
        border: `1px solid ${LINE}`,
        borderRadius: 8,
        padding: 10,
        textAlign: 'center',
      }}>
        <div style={{ color: FGMUTE, fontSize: 9, letterSpacing: '.05em', marginBottom: 6 }}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 10, color: FG }}>
          <span style={{ color: RED, textDecoration: 'line-through' }}>{before}</span>
          <span style={{ color: FGMUTE }}>→</span>
          <span style={{ color: GRN, fontWeight: 700 }}>{after}</span>
        </div>
        <div style={{ color: PINK, fontSize: 12, fontWeight: 700, marginTop: 4 }}>{delta}</div>
      </div>
    )
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — VPC Networking Layers (LayerStack)
// Justificativa: a hierarquia "IGW → VPC → Subnet → RT → NACL → SG" é onde
// nascem 70% dos casos de "EC2 não responde". Cada camada pode bloquear, e
// entender a ordem de avaliação evita debugging de horas.
// ═══════════════════════════════════════════════════════════════════════════════

const NETWORKING_LAYERS: Layer[] = [
  {
    id: 'sg',
    label: 'Camada 6 — Security Group',
    sublabel: 'Stateful firewall por ENI',
    description: 'Avaliado por último, no nível da Elastic Network Interface da instância. Stateful: resposta de conexão autorizada entra automaticamente sem regra de retorno. Apenas Allow (sem Deny). Pode referenciar outros SGs (source = sg-alb em vez de CIDR). É a porta da instância.',
    code: 'aws ec2 authorize-security-group-ingress \\\n  --group-id sg-app \\\n  --protocol tcp --port 8080 \\\n  --source-group sg-alb',
    color: GRN,
    examples: ['Stateful (1 regra cobre ida + volta)', 'Allow only', 'Pode referenciar SGs', 'Default: deny tudo de entrada'],
  },
  {
    id: 'nacl',
    label: 'Camada 5 — Network ACL',
    sublabel: 'Stateless firewall por subnet',
    description: 'Avaliado antes do SG, no nível da subnet. Stateless — regra explícita Allow para entrada E saída (incluindo respostas em portas efêmeras 1024-65535). Suporta Allow E Deny avaliados em ordem numérica. Use somente para bloqueio amplo (range de IPs maliciosos). Para 99% dos casos, deixe NACL default e configure tudo no SG.',
    code: 'inbound  rule #100  allow tcp 443  0.0.0.0/0\noutbound rule #100  allow tcp 1024-65535 0.0.0.0/0',
    color: AMB,
    examples: ['Stateless (precisa allow ida e volta)', 'Allow OU Deny', 'Avaliada em ordem numérica', 'Por subnet'],
  },
  {
    id: 'rt',
    label: 'Camada 4 — Route Table',
    sublabel: 'Para onde vai o tráfego',
    description: 'Cada subnet tem UMA Route Table associada. Define próximo salto baseado em CIDR de destino. Se rota leva a IGW, subnet é pública. Se leva a NAT GW, é privada com saída via NAT. Se leva a VPC Endpoint, tráfego para S3/DynamoDB nunca sai para internet. Rota mais específica vence (longest prefix match).',
    code: '0.0.0.0/0     → igw-xxx     (subnet pública)\n0.0.0.0/0     → nat-xxx     (subnet privada)\npl-63a5400a   → vpce-s3-xxx (S3 Gateway Endpoint)',
    color: SKY,
    examples: ['Pública: 0.0.0.0/0 → IGW', 'Privada: 0.0.0.0/0 → NAT', 'Endpoint: tráfego sem internet', 'Longest prefix match'],
  },
  {
    id: 'subnet',
    label: 'Camada 3 — Subnet',
    sublabel: 'Range de IPs em uma única AZ',
    description: 'Subdivisão da VPC em uma única Availability Zone. Pública (rota IGW) hospeda ALB, NAT GW. Privada (rota via NAT) hospeda EC2/ECS. Pelo menos 2 subnets em AZs diferentes para HA. Cada ENI vive em UMA subnet — instância herda o CIDR. AWS reserva 5 IPs por subnet (network, VPC router, DNS resolver, futuro, broadcast).',
    code: 'VPC  10.0.0.0/16\n├── subnet-pub-a  10.0.0.0/24  (us-east-1a)\n├── subnet-pub-b  10.0.1.0/24  (us-east-1b)\n├── subnet-app-a  10.0.10.0/24 (us-east-1a)\n└── subnet-app-b  10.0.11.0/24 (us-east-1b)',
    color: PRP,
    examples: ['1 subnet = 1 AZ', 'AWS reserva 5 IPs', 'Pública vs privada = rota', 'Multi-AZ = multi-subnet'],
  },
  {
    id: 'vpc',
    label: 'Camada 2 — VPC',
    sublabel: 'Rede virtual isolada',
    description: 'Container superior da rede. Define CIDR principal (ex: 10.0.0.0/16). Por padrão, instâncias dentro da mesma VPC se comunicam via rotas locais. Cross-VPC exige Peering ou Transit Gateway. VPC Endpoints para serviços AWS sem internet. Habilite enableDnsHostnames + enableDnsSupport para DNS interno.',
    code: 'aws ec2 create-vpc --cidr-block 10.0.0.0/16 \\\n  --tag-specifications "ResourceType=vpc,Tags=[{Key=Name,Value=prod}]"',
    color: '#60a5fa',
    examples: ['CIDR /16 típico', 'Peering / TGW para cross-VPC', 'VPC Endpoints sem IGW', 'DNS interno via .compute.internal'],
  },
  {
    id: 'gateway',
    label: 'Camada 1 — IGW / NAT',
    sublabel: 'Borda da VPC',
    description: 'Internet Gateway: habilita IPv4/IPv6 público bidirecional para subnets públicas. Sem custo. Sem IGW, VPC não tem internet. NAT Gateway: permite saída de subnets privadas (apt update, APIs externas) — internet NÃO inicia conexão. Cobra ~$0.045/h + $/GB. Egress-Only IGW: equivalente NAT para IPv6, gratuito.',
    code: 'aws ec2 create-internet-gateway\naws ec2 attach-internet-gateway \\\n  --vpc-id vpc-xxx --internet-gateway-id igw-xxx\n\naws ec2 create-nat-gateway --subnet-id subnet-pub-a \\\n  --allocation-id eipalloc-xxx',
    color: PINK,
    examples: ['IGW = grátis', 'NAT GW ~$0.045/h + $/GB', 'NAT por AZ para HA', 'Egress-Only IGW = NAT IPv6'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default function VpcVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'architecture',
      title: 'Arquitetura 3-tier',
      subtitle: 'VPC multi-AZ com pub/app/db — clique nos componentes para detalhes',
      accent: C,
      component: <VpcArchitectureExplorer />,
    },
    {
      id: 'sg-vs-nacl',
      title: 'SG vs NACL',
      subtitle: 'Stateful vs stateless em request HTTPS — onde cada um avalia',
      accent: C,
      component: <SgVsNaclFlow />,
    },
    {
      id: 'connectivity',
      title: 'Conectividade entre VPCs',
      subtitle: 'Peering vs Transit Gateway vs VPN vs Direct Connect — 7 critérios',
      accent: C,
      component: (
        <ComparisonTable
          options={CONNECTIVITY_OPTIONS}
          criteria={CONNECTIVITY_CRITERIA}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="Opções de conectividade VPC"
          description="Peering para 2-5 VPCs simples. TGW acima de 5 VPCs ou multi-conta. VPN para on-prem rápido. Direct Connect quando volume e latência exigem fibra dedicada."
        />
      ),
    },
    {
      id: 'endpoints',
      title: 'VPC Endpoints',
      subtitle: 'Antes / depois de Gateway Endpoint — eliminar tráfego pela internet',
      accent: C,
      component: <VpcEndpointsVisual />,
    },
    {
      id: 'layers',
      title: 'Hierarquia de rede',
      subtitle: 'IGW → VPC → Subnet → RT → NACL → SG em 6 camadas — fonte de "EC2 não responde"',
      accent: C,
      component: (
        <LayerStack
          layers={NETWORKING_LAYERS}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="VPC Networking — onde tráfego é avaliado"
          description="A ordem importa: IGW/NAT é a borda. VPC e Subnet definem o espaço de IPs. Route Table decide o caminho. NACL é stateless por subnet. Security Group é stateful por ENI. Entender a ordem evita 70% dos casos de 'EC2 não responde'."
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
