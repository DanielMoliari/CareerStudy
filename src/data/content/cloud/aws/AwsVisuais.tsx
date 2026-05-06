'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { SequenceDiagram } from '@/components/visuals/SequenceDiagram'
import type { SeqActor, SeqMessage } from '@/components/visuals/SequenceDiagram'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'
import { HeatMap } from '@/components/visuals/HeatMap'
import type { HeatCell } from '@/components/visuals/HeatMap'

// ── Paleta AWS ─────────────────────────────────────────────────────────────────
const C      = '#FF9900'   // AWS laranja
const SEC    = '#cc7a00'   // secondary
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#4ade80'
const RED    = '#ef4444'
const SKY    = '#38bdf8'
const PRP    = '#a78bfa'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — IAM: Users, Groups, Roles e Policies (custom explorer)
// Justificativa: hierarquia IAM é confusa sem diagrama interativo. Nenhum texto
// explica bem a diferença entre identidade de pessoa vs identidade assumível.
// ═══════════════════════════════════════════════════════════════════════════════

const IAM_CATEGORIES = [
  {
    id: 'users',
    label: 'Users',
    icon: '👤',
    color: SKY,
    desc: 'Identidades para pessoas. Têm credenciais de longo prazo (senha, access key). Nunca use root user para operações do dia a dia.',
    items: ['root user (nunca usar)', 'IAM user com MFA', 'Access key ID + Secret', 'Password policy obrigatória'],
  },
  {
    id: 'groups',
    label: 'Groups',
    icon: '👥',
    color: GRN,
    desc: 'Agrupam users para aplicar policies em conjunto. Um user pode estar em múltiplos grupos. Groups não têm credenciais próprias.',
    items: ['Developers', 'Admins', 'ReadOnly', 'Billing'],
  },
  {
    id: 'roles',
    label: 'Roles',
    icon: '🎭',
    color: C,
    desc: 'Identidades assumíveis por serviços AWS, usuários federados ou contas externas. Sem credenciais de longo prazo — geram tokens temporários via STS.',
    items: ['EC2 instance role', 'Lambda execution role', 'Cross-account role', 'SAML/OIDC federation'],
  },
  {
    id: 'policies',
    label: 'Policies',
    icon: '📋',
    color: PRP,
    desc: 'Documentos JSON que definem permissões. Identity policies (attachadas a user/group/role) e Resource policies (S3 bucket policy, KMS key policy).',
    items: ['AWS Managed Policies', 'Customer Managed Policies', 'Inline Policies', 'Resource-based Policies'],
  },
]

function IamExplorer() {
  const [sel, setSel] = useState<string | null>('roles')
  const active = IAM_CATEGORIES.find(c => c.id === sel)

  return (
    <div style={{ display: 'flex', gap: 20, height: '100%', minHeight: 360 }}>
      {/* left panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 180, flexShrink: 0 }}>
        {IAM_CATEGORIES.map(cat => (
          <div
            key={cat.id}
            onClick={() => setSel(cat.id)}
            style={{
              background: sel === cat.id ? `${cat.color}20` : CARD,
              border: `1.5px solid ${sel === cat.id ? cat.color : LINE}`,
              borderRadius: 10,
              padding: '12px 14px',
              cursor: 'pointer',
              transition: 'all .2s',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span style={{ fontSize: 22 }}>{cat.icon}</span>
            <span style={{ color: sel === cat.id ? cat.color : FG, fontWeight: sel === cat.id ? 700 : 400, fontSize: 14 }}>
              {cat.label}
            </span>
          </div>
        ))}
        <div style={{
          marginTop: 8,
          padding: '10px 12px',
          background: `${C}15`,
          border: `1px solid ${C}40`,
          borderRadius: 8,
          fontSize: 10,
          color: FGMUTE,
          lineHeight: 1.6,
        }}>
          <strong style={{ color: C, display: 'block', marginBottom: 4 }}>Least Privilege</strong>
          Conceda apenas as permissões necessárias. Nunca use AdministratorAccess em produção.
        </div>
      </div>

      {/* right panel */}
      {active && (
        <div style={{ flex: 1, background: CARD, borderRadius: 12, padding: 24, border: `1px solid ${LINE}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 32 }}>{active.icon}</span>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: active.color }}>{active.label}</div>
              <div style={{ fontSize: 12, color: FGMUTE, marginTop: 2 }}>IAM — Controle de Identidade e Acesso</div>
            </div>
          </div>
          <p style={{ fontSize: 13, color: FG, lineHeight: 1.7, marginBottom: 16 }}>{active.desc}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {active.items.map((item, i) => (
              <div key={i} style={{
                background: `${active.color}15`,
                border: `1px solid ${active.color}40`,
                borderRadius: 20,
                padding: '5px 12px',
                fontSize: 12,
                color: active.color,
              }}>
                {item}
              </div>
            ))}
          </div>
          {active.id === 'roles' && (
            <div style={{ marginTop: 20, padding: '12px 16px', background: `${GRN}10`, border: `1px solid ${GRN}30`, borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: GRN, fontWeight: 700, marginBottom: 6 }}>Regra de ouro: use Roles, não Access Keys</div>
              <div style={{ fontSize: 11, color: FGMUTE, lineHeight: 1.6 }}>
                EC2 e Lambda devem assumir uma Role — nunca configurar credenciais hardcoded. A Role gera tokens temporários via STS que expiram automaticamente.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — VPC Networking Explorer (custom)
// Justificativa: subnets públicas vs privadas, IGW, NAT GW, SG, NACL são o
// tema mais cobrado em entrevistas AWS e impossível de visualizar mentalmente
// sem um diagrama interativo. Nenhum componente genérico serve aqui.
// ═══════════════════════════════════════════════════════════════════════════════

type VpcZone = {
  id: string
  label: string
  sublabel: string
  color: string
  isPublic: boolean
  components: Array<{ name: string; icon: string; desc: string }>
  rule: string
}

const VPC_ZONES: VpcZone[] = [
  {
    id: 'public',
    label: 'Subnet Pública',
    sublabel: 'Tem rota para Internet Gateway',
    color: SKY,
    isPublic: true,
    components: [
      { name: 'Internet Gateway (IGW)', icon: '🌐', desc: 'Porta de entrada/saída da internet para a VPC. Altamente disponível, gerenciado pela AWS.' },
      { name: 'Application Load Balancer', icon: '⚖️', desc: 'Distribui tráfego entre instâncias privadas. Termina TLS. Só fica em subnet pública.' },
      { name: 'NAT Gateway', icon: '🔄', desc: 'Permite que instâncias privadas iniciem conexões para a internet (sem receber conexões entrantes). Cobra por hora + GB processado.' },
      { name: 'Bastion Host', icon: '🔐', desc: 'SSH gateway para acessar instâncias privadas. Eliminar com Session Manager (SSM) — mais seguro.' },
    ],
    rule: 'Route table: 0.0.0.0/0 → Internet Gateway. Nunca coloque bancos de dados aqui.',
  },
  {
    id: 'private-app',
    label: 'Subnet Privada — App',
    sublabel: 'Sem rota para IGW; saída via NAT GW',
    color: PRP,
    isPublic: false,
    components: [
      { name: 'EC2 / ECS Tasks', icon: '⚙️', desc: 'Instâncias de aplicação sem IP público. Recebem tráfego do ALB via Security Group.' },
      { name: 'Lambda (VPC)', icon: 'λ', desc: 'Funções Lambda conectadas à VPC para acessar RDS ou ElastiCache. Cold start maior — mitigue com Provisioned Concurrency.' },
      { name: 'EKS Worker Nodes', icon: '☸️', desc: 'Pods Kubernetes em subnet privada. Control plane gerenciado pela AWS.' },
    ],
    rule: 'Route table: 0.0.0.0/0 → NAT Gateway. Acesso à internet de saída apenas.',
  },
  {
    id: 'private-data',
    label: 'Subnet Privada — Dados',
    sublabel: 'Sem rota para internet; isolada',
    color: GRN,
    isPublic: false,
    components: [
      { name: 'RDS Multi-AZ', icon: '🗄️', desc: 'Banco de dados relacional. Primary em uma AZ, standby síncrono em outra. Failover automático em menos de 60s. Nunca expor publicamente.' },
      { name: 'ElastiCache', icon: '⚡', desc: 'Redis ou Memcached para cache de sessão, resultados de query, rate limiting. Subnet isolada impede acesso externo.' },
      { name: 'DynamoDB (VPC Endpoint)', icon: '📊', desc: 'DynamoDB é regional — acesso via VPC Endpoint evita custo de NAT Gateway e mantém tráfego dentro da AWS.' },
    ],
    rule: 'Sem rota de saída. Security Group: permite apenas tráfego da subnet de app na porta do banco.',
  },
]

type SgNaclInfo = {
  id: string
  label: string
  icon: string
  color: string
  points: string[]
  useCase: string
}

const SG_NACL: SgNaclInfo[] = [
  {
    id: 'sg',
    label: 'Security Group',
    icon: '🛡️',
    color: C,
    points: [
      'Stateful: permite resposta automaticamente',
      'Opera no nível da instância/ENI',
      'Só regras de ALLOW (sem DENY explícito)',
      'Avalia todas as regras antes de decidir',
    ],
    useCase: 'Controle granular por instância. Referência outro SG como source — elegante para tiered apps.',
  },
  {
    id: 'nacl',
    label: 'NACL (Network ACL)',
    icon: '🚧',
    color: RED,
    points: [
      'Stateless: precisa de regras de entrada E saída',
      'Opera no nível da subnet',
      'ALLOW e DENY explícitos',
      'Regras numeradas — avaliadas em ordem crescente',
    ],
    useCase: 'Bloquear IP malicioso em toda a subnet de uma vez. Mais eficiente que Security Group para blocking em massa.',
  },
]

function VpcExplorer() {
  const [selZone, setSelZone] = useState<string>('public')
  const [selSgNacl, setSelSgNacl] = useState<string>('sg')
  const [view, setView] = useState<'subnets' | 'security'>('subnets')
  const activeZone = VPC_ZONES.find(z => z.id === selZone)!
  const activeSgNacl = SG_NACL.find(s => s.id === selSgNacl)!

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%', minHeight: 400 }}>
      {/* toggle view */}
      <div style={{ display: 'flex', gap: 8 }}>
        {(['subnets', 'security'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              background: view === v ? `${C}25` : 'transparent',
              border: `1px solid ${view === v ? C : LINE}`,
              borderRadius: 8,
              padding: '6px 16px',
              fontSize: 12,
              color: view === v ? C : FGMUTE,
              cursor: 'pointer',
              fontWeight: view === v ? 700 : 400,
            }}
          >
            {v === 'subnets' ? 'Subnets Públicas vs Privadas' : 'Security Group vs NACL'}
          </button>
        ))}
      </div>

      {view === 'subnets' && (
        <div style={{ display: 'flex', gap: 16, flex: 1 }}>
          {/* zone selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 200, flexShrink: 0 }}>
            {VPC_ZONES.map(zone => (
              <div
                key={zone.id}
                onClick={() => setSelZone(zone.id)}
                style={{
                  background: selZone === zone.id ? `${zone.color}20` : CARD,
                  border: `1.5px solid ${selZone === zone.id ? zone.color : LINE}`,
                  borderRadius: 10,
                  padding: '10px 14px',
                  cursor: 'pointer',
                  transition: 'all .2s',
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: selZone === zone.id ? zone.color : FG }}>{zone.label}</div>
                <div style={{ fontSize: 10, color: FGMUTE, marginTop: 3 }}>{zone.sublabel}</div>
              </div>
            ))}
            {/* legend */}
            <div style={{ marginTop: 8, padding: '10px 12px', background: `${C}10`, border: `1px solid ${C}30`, borderRadius: 8, fontSize: 10, color: FGMUTE, lineHeight: 1.6 }}>
              <strong style={{ color: C, display: 'block', marginBottom: 4 }}>Padrão recomendado</strong>
              2 AZs mínimo. Subnet pública em cada AZ (ALB, NAT GW). Subnet privada de app. Subnet privada de dados.
            </div>
          </div>

          {/* zone detail */}
          <div style={{ flex: 1, background: CARD, borderRadius: 12, padding: 20, border: `1.5px solid ${activeZone.color}50` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: activeZone.color }}>{activeZone.label}</div>
              <span style={{
                fontSize: 10,
                padding: '2px 8px',
                borderRadius: 20,
                background: activeZone.isPublic ? `${SKY}20` : `${RED}20`,
                color: activeZone.isPublic ? SKY : RED,
                fontWeight: 700,
              }}>
                {activeZone.isPublic ? 'Pública' : 'Privada'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
              {activeZone.components.map((comp, i) => (
                <div key={i} style={{ background: `${activeZone.color}08`, border: `1px solid ${activeZone.color}25`, borderRadius: 8, padding: '8px 12px', display: 'flex', gap: 10 }}>
                  <span style={{ fontSize: 18, flexShrink: 0, lineHeight: 1.4 }}>{comp.icon}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: activeZone.color, marginBottom: 2 }}>{comp.name}</div>
                    <div style={{ fontSize: 11, color: FGMUTE, lineHeight: 1.5 }}>{comp.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: '8px 12px', background: `${GRN}08`, border: `1px solid ${GRN}25`, borderLeft: `3px solid ${GRN}`, borderRadius: 6, fontSize: 11, color: FGMUTE, lineHeight: 1.6 }}>
              <strong style={{ color: GRN }}>Route table: </strong>{activeZone.rule}
            </div>
          </div>
        </div>
      )}

      {view === 'security' && (
        <div style={{ display: 'flex', gap: 16, flex: 1 }}>
          {/* sg/nacl selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 160, flexShrink: 0 }}>
            {SG_NACL.map(item => (
              <div
                key={item.id}
                onClick={() => setSelSgNacl(item.id)}
                style={{
                  background: selSgNacl === item.id ? `${item.color}20` : CARD,
                  border: `1.5px solid ${selSgNacl === item.id ? item.color : LINE}`,
                  borderRadius: 10,
                  padding: '12px 14px',
                  cursor: 'pointer',
                  transition: 'all .2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: selSgNacl === item.id ? item.color : FG }}>{item.label}</span>
              </div>
            ))}
          </div>

          {/* detail */}
          <div style={{ flex: 1, background: CARD, borderRadius: 12, padding: 20, border: `1.5px solid ${activeSgNacl.color}50` }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: activeSgNacl.color, marginBottom: 14 }}>{activeSgNacl.label}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {activeSgNacl.points.map((pt, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 6, height: 6, borderRadius: 3, background: activeSgNacl.color, flexShrink: 0, marginTop: 5 }} />
                  <div style={{ fontSize: 12, color: FG, lineHeight: 1.6 }}>{pt}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: '10px 14px', background: `${activeSgNacl.color}10`, border: `1px solid ${activeSgNacl.color}30`, borderRadius: 8, fontSize: 11, color: FGMUTE, lineHeight: 1.6 }}>
              <strong style={{ color: activeSgNacl.color }}>Quando usar: </strong>{activeSgNacl.useCase}
            </div>

            {/* comparison hint */}
            <div style={{ marginTop: 14, padding: '10px 14px', background: `${C}08`, border: `1px solid ${C}25`, borderRadius: 8, fontSize: 11, color: FGMUTE, lineHeight: 1.6 }}>
              <strong style={{ color: C }}>Diferença-chave: </strong>
              Security Group é stateful (resposta automática) e opera por instância. NACL é stateless (precisa de regra de saída explícita) e opera por subnet. Use ambos em produção: SG como primary defense, NACL para blocking de IP em nível de subnet.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — LayerStack: serviços AWS por camada
// Justificativa: arquitetura AWS em camadas (Edge → Rede → Compute → Dados →
// Segurança) é o mental model mais útil para planejar e defender em entrevista.
// ═══════════════════════════════════════════════════════════════════════════════

const AWS_LAYERS: Layer[] = [
  {
    id: 'edge',
    label: 'Edge / CDN',
    sublabel: 'Camada 1 — Global',
    description: 'Primeira linha de contato com o usuário. Cache global, WAF, DNS com failover. Reduz latência em qualquer região do planeta.',
    code: 'Route53 → CloudFront (+ WAF) → origem',
    color: SKY,
    icon: '🌐',
    examples: ['Route 53', 'CloudFront', 'WAF', 'Shield'],
  },
  {
    id: 'network',
    label: 'Rede / VPC',
    sublabel: 'Camada 2 — Regional',
    description: 'Rede virtual isolada com subnets públicas e privadas em múltiplas AZs. Security Groups (stateful) controlam tráfego por instância; NACLs (stateless) por subnet.',
    code: 'VPC → Subnets → IGW/NAT → SG/NACL',
    color: C,
    icon: '🔒',
    examples: ['VPC', 'Subnets', 'ALB/NLB', 'NAT Gateway', 'Transit Gateway'],
  },
  {
    id: 'compute',
    label: 'Computação',
    sublabel: 'Camada 3 — Application',
    description: 'Execução do código. EC2 para controle total; ECS/Fargate para containers gerenciados; Lambda para event-driven serverless; EKS para Kubernetes.',
    code: 'EC2 | ECS/Fargate | Lambda | EKS',
    color: PRP,
    icon: '⚙️',
    examples: ['EC2', 'Lambda', 'ECS Fargate', 'EKS', 'Batch'],
  },
  {
    id: 'data',
    label: 'Dados',
    sublabel: 'Camada 4 — Persistence',
    description: 'Armazenamento durável. RDS/Aurora para relacional ACID; DynamoDB para NoSQL escala global; ElastiCache para cache; S3 para objetos; EBS/EFS para bloco/arquivo.',
    code: 'RDS Multi-AZ | DynamoDB | ElastiCache | S3',
    color: GRN,
    icon: '🗄️',
    examples: ['RDS Aurora', 'DynamoDB', 'ElastiCache', 'S3', 'Redshift'],
  },
  {
    id: 'security',
    label: 'Segurança / IAM',
    sublabel: 'Camada transversal — Cross-cutting',
    description: 'Permeia todas as camadas. IAM controla quem acessa o quê. KMS criptografa em repouso. Secrets Manager armazena credentials. GuardDuty detecta ameaças com ML.',
    code: 'IAM Roles | KMS | Secrets Manager | GuardDuty',
    color: RED,
    icon: '🛡️',
    examples: ['IAM', 'KMS', 'Secrets Manager', 'WAF', 'GuardDuty'],
  },
  {
    id: 'observability',
    label: 'Observabilidade',
    sublabel: 'Camada transversal — Monitoring',
    description: 'Visibilidade completa do sistema. CloudWatch para métricas/logs/alarmes; X-Ray para distributed tracing; CloudTrail para auditoria de cada chamada de API.',
    code: 'CloudWatch | X-Ray | CloudTrail | EventBridge',
    color: SEC,
    icon: '📊',
    examples: ['CloudWatch', 'X-Ray', 'CloudTrail', 'EventBridge'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — SequenceDiagram: request flow em AWS 3-tier
// Justificativa: o fluxo Route53 → CloudFront → ALB → ECS → Cache → RDS é
// o cenário de arquitetura mais cobrado em entrevistas. Ver a sequência com
// notas em cada seta ensina o que texto não consegue.
// ═══════════════════════════════════════════════════════════════════════════════

const SEQ_ACTORS: SeqActor[] = [
  { id: 'user',   label: 'Usuário',    color: SKY,  icon: '👤' },
  { id: 'cf',     label: 'CloudFront', color: C,    icon: '🌐' },
  { id: 'alb',    label: 'ALB',        color: PRP,  icon: '⚖️' },
  { id: 'ecs',    label: 'ECS/App',    color: GRN,  icon: '⚙️' },
  { id: 'rds',    label: 'RDS',        color: '#60a5fa', icon: '🗄️' },
  { id: 'cache',  label: 'ElastiCache',color: SEC,  icon: '⚡' },
]

const SEQ_MESSAGES: SeqMessage[] = [
  { from: 'user',  to: 'cf',    label: 'GET /api/orders',            note: 'HTTPS — TLS terminado no edge',                    type: 'sync' },
  { from: 'cf',    to: 'cf',    label: 'Cache miss → forward',       note: 'Cache-Control header decide TTL',                  type: 'sync' },
  { from: 'cf',    to: 'alb',   label: 'Forward request',            note: 'Origin request com headers X-Forwarded-For',       type: 'sync' },
  { from: 'alb',   to: 'ecs',   label: 'Route → target group',       note: 'Health check /health garante só instâncias OK',    type: 'sync' },
  { from: 'ecs',   to: 'cache', label: 'GET orders:{userId}',        note: 'Redis lookup primeiro — latência menor que 1ms',   type: 'async' },
  { from: 'cache', to: 'ecs',   label: 'Cache miss',                 note: 'TTL expirado ou primeira vez',                     type: 'return' },
  { from: 'ecs',   to: 'rds',   label: 'SELECT * FROM orders ...',   note: 'Conexão via Security Group privado. Multi-AZ.',    type: 'sync' },
  { from: 'rds',   to: 'ecs',   label: 'ResultSet',                  note: 'Leitura do standby RDS não bloqueia writes',       type: 'return' },
  { from: 'ecs',   to: 'cache', label: 'SET orders:{userId} TTL=60', note: 'Popula cache para próximas requests',              type: 'async' },
  { from: 'ecs',   to: 'alb',   label: '200 OK JSON',                note: 'Response com Cache-Control: max-age=60',           type: 'return' },
  { from: 'alb',   to: 'cf',    label: '200 OK',                     note: 'CloudFront armazena no edge cache',                type: 'return' },
  { from: 'cf',    to: 'user',  label: '200 OK (do cache na 2ª req)',note: 'Próxima request = HIT — sub-10ms globalmente',     type: 'return' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — ComparisonTable: EC2 vs Lambda vs ECS vs EKS
// Justificativa: a pergunta "qual serviço de computação usar" é a mais cobrada
// em design system interviews. Comparar 4 opções em 6 critérios simultaneamente
// é impossível de fazer em texto sem perder a visão comparativa.
// ═══════════════════════════════════════════════════════════════════════════════

const COMPUTE_OPTIONS: ComparisonOption[] = [
  { id: 'ec2',     label: 'EC2',           sublabel: 'VMs na nuvem',           color: '#f59e0b' },
  { id: 'lambda',  label: 'Lambda',         sublabel: 'Serverless functions',   color: C },
  { id: 'fargate', label: 'ECS/Fargate',    sublabel: 'Containers gerenciados', color: PRP },
  { id: 'eks',     label: 'EKS',            sublabel: 'Kubernetes gerenciado',  color: SKY },
]

const COMPUTE_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'cold-start', label: 'Cold Start', category: 'Performance',
    description: 'Tempo para primeira execução após período ocioso',
    values: {
      ec2:     { rating: 'excellent', note: 'Sem cold start (instância fica ligada)' },
      lambda:  { rating: 'fair',      note: 'De 100ms a segundos (VPC piora)' },
      fargate: { rating: 'good',      note: '~30s para iniciar novo task' },
      eks:     { rating: 'good',      note: 'Depende do node pool e HPA' },
    },
  },
  {
    id: 'scaling', label: 'Escalabilidade', category: 'Performance',
    description: 'Capacidade de escalar automaticamente sob carga',
    values: {
      ec2:     { rating: 'good',      note: 'ASG escala em minutos' },
      lambda:  { rating: 'excellent', note: 'Escala para 1000+ invocações simultâneas em segundos' },
      fargate: { rating: 'excellent', note: 'ECS Service Auto Scaling por CPU/memória/req' },
      eks:     { rating: 'excellent', note: 'HPA + Cluster Autoscaler ou Karpenter' },
    },
  },
  {
    id: 'cost', label: 'Custo', category: 'Financeiro',
    description: 'Modelo de custo e previsibilidade',
    values: {
      ec2:     { rating: 'good',      note: 'Paga por hora (Reserved = 60% off). Bom para carga constante' },
      lambda:  { rating: 'excellent', note: 'Paga por invocação + ms. Free tier 1M req/mês' },
      fargate: { rating: 'good',      note: 'Paga por vCPU/memória por segundo. Sem EC2 ocioso' },
      eks:     { rating: 'fair',      note: 'Control plane $0.10/h + worker nodes EC2/Fargate' },
    },
  },
  {
    id: 'ops', label: 'Overhead Operacional', category: 'Operações',
    description: 'Complexidade de gerenciar e operar',
    values: {
      ec2:     { rating: 'poor',      note: 'Você gerencia OS, patches, AMI, ASG, LB' },
      lambda:  { rating: 'excellent', note: 'Zero gestão de infra. Apenas o código importa' },
      fargate: { rating: 'good',      note: 'Sem EC2 para gerenciar — só definir task/service' },
      eks:     { rating: 'fair',      note: 'Control plane gerenciado, mas workers e addons são seus' },
    },
  },
  {
    id: 'duration', label: 'Duração Máxima', category: 'Limitações',
    description: 'Limite de execução contínua',
    values: {
      ec2:     { rating: 'excellent', note: 'Ilimitada' },
      lambda:  { rating: 'poor',      note: 'Máximo 15 minutos por invocação' },
      fargate: { rating: 'excellent', note: 'Ilimitada (task roda até você parar)' },
      eks:     { rating: 'excellent', note: 'Ilimitada' },
    },
  },
  {
    id: 'portability', label: 'Portabilidade', category: 'Estratégia',
    description: 'Facilidade de migrar para outro provedor',
    values: {
      ec2:     { rating: 'fair',      note: 'AMIs são proprietárias; código portável' },
      lambda:  { rating: 'poor',      note: 'API proprietária — migração exige rewrite' },
      fargate: { rating: 'good',      note: 'Containers são padrão aberto; orquestrador muda' },
      eks:     { rating: 'excellent', note: 'Kubernetes padrão — portável para GKE, AKS, on-prem' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — S3 Storage Classes HeatMap
// Justificativa: 6 classes × 5 critérios = 30 células de decisão. Heatmap
// permite scanear instantaneamente qual classe tem melhor custo vs latência
// — impossível de absorver numa tabela textual.
// ═══════════════════════════════════════════════════════════════════════════════

const S3_ROWS = [
  'S3 Standard',
  'S3 Standard-IA',
  'S3 One Zone-IA',
  'S3 Glacier Instant',
  'S3 Glacier Flexible',
  'S3 Glacier Deep Archive',
]

const S3_COLS = [
  'Custo Storage',
  'Custo Retrieval',
  'Latência Acesso',
  'Durabilidade',
  'Uso Ideal',
]

// 0 = melhor/mais barato, 10 = pior/mais caro; escala relativa
const S3_DATA: HeatCell[][] = [
  // Standard
  [{ value: 8, note: '$0.023/GB' }, { value: 0, note: 'Grátis' },        { value: 0, note: 'Milissegundos' }, { value: 10, note: '11 noves' }, { value: 10, note: 'Acesso frequente' }],
  // Standard-IA
  [{ value: 4, note: '$0.0125/GB' }, { value: 4, note: '$0.01/GB' },     { value: 0, note: 'Milissegundos' }, { value: 10, note: '11 noves' }, { value: 7, note: 'Acesso menos de 1×/mês' }],
  // One Zone-IA
  [{ value: 3, note: '$0.01/GB' },  { value: 4, note: '$0.01/GB' },      { value: 0, note: 'Milissegundos' }, { value: 7, note: '11 noves (1 AZ)' }, { value: 5, note: 'Dados reproduzíveis' }],
  // Glacier Instant
  [{ value: 2, note: '$0.004/GB' }, { value: 5, note: '$0.03/GB' },      { value: 1, note: 'Milissegundos' }, { value: 10, note: '11 noves' }, { value: 6, note: 'Arquivo acesso trimestral' }],
  // Glacier Flexible
  [{ value: 1, note: '$0.0036/GB' },{ value: 6, note: '$0.01/GB' },      { value: 6, note: '1-12 horas' },   { value: 10, note: '11 noves' }, { value: 4, note: 'Backup anual' }],
  // Deep Archive
  [{ value: 0, note: '$0.00099/GB' },{ value: 8, note: '$0.02/GB' },     { value: 9, note: '12-48 horas' },  { value: 10, note: '11 noves' }, { value: 2, note: 'Retenção 7+ anos' }],
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — AntiPatternsGallery: armadilhas comuns na AWS
// Justificativa: código errado vs correto com Terraform/SDK ensina padrões de
// segurança (IAM, S3) e confiabilidade (Multi-AZ, tags) que só ficam na memória
// quando vistos como diff real, não como regra abstrata.
// ═══════════════════════════════════════════════════════════════════════════════

const AWS_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'Credenciais hardcoded no código',
    wrong: [
      [{ text: '// NUNCA faça isso — vaza em git history', color: RED }],
      [{ text: 'const s3 = new AWS.S3({', color: FG }],
      [{ text: '  accessKeyId: "AKIAIOSFODNN7EXAMPLE",', color: RED }],
      [{ text: '  secretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"', color: RED }],
      [{ text: '})', color: FG }],
    ],
    right: [
      [{ text: '// Use IAM Role — credenciais automáticas via STS', color: GRN }],
      [{ text: '// EC2/ECS/Lambda assumem a role automaticamente', color: FGMUTE }],
      [{ text: 'const s3 = new S3Client({ region: "us-east-1" })', color: FG }],
      [{ text: '// SDK lê credenciais do instance metadata automaticamente', color: FGMUTE }],
    ],
    why: 'Credenciais hardcoded ficam no git history para sempre. Mesmo após remoção, vazaram. IAM Roles geram tokens temporários via STS que expiram. Sem segredo para gerenciar.',
  },
  {
    title: 'S3 bucket público por padrão',
    wrong: [
      [{ text: '// Bucket com acesso público — dados expostos', color: RED }],
      [{ text: 'resource "aws_s3_bucket_public_access_block" "bad" {', color: FG }],
      [{ text: '  block_public_acls   = false', color: RED }],
      [{ text: '  block_public_policy = false', color: RED }],
      [{ text: '}', color: FG }],
    ],
    right: [
      [{ text: '// Block all public access + CloudFront OAC', color: GRN }],
      [{ text: 'resource "aws_s3_bucket_public_access_block" "ok" {', color: FG }],
      [{ text: '  block_public_acls       = true', color: GRN }],
      [{ text: '  block_public_policy     = true', color: GRN }],
      [{ text: '  ignore_public_acls      = true', color: GRN }],
      [{ text: '  restrict_public_buckets = true', color: GRN }],
      [{ text: '}', color: FG }],
    ],
    why: 'Bucket público expõe dados para qualquer pessoa na internet. Use CloudFront com Origin Access Control (OAC) para servir assets estáticos de forma segura sem abrir o bucket.',
  },
  {
    title: 'Sem tags em recursos AWS',
    wrong: [
      [{ text: '// Recursos sem tags — custo impossível de rastrear', color: RED }],
      [{ text: 'resource "aws_instance" "api" {', color: FG }],
      [{ text: '  ami           = "ami-0c02fb55956c7d316"', color: FG }],
      [{ text: '  instance_type = "t3.medium"', color: FG }],
      [{ text: '  # sem tags — quem criou? qual projeto? qual ambiente?', color: RED }],
      [{ text: '}', color: FG }],
    ],
    right: [
      [{ text: '// Tags obrigatórias + AWS Cost Allocation Tags', color: GRN }],
      [{ text: 'resource "aws_instance" "api" {', color: FG }],
      [{ text: '  ami           = "ami-0c02fb55956c7d316"', color: FG }],
      [{ text: '  instance_type = "t3.medium"', color: FG }],
      [{ text: '  tags = {', color: FG }],
      [{ text: '    Name        = "api-server-prod"', color: GRN }],
      [{ text: '    Environment = "production"', color: GRN }],
      [{ text: '    Team        = "backend"', color: GRN }],
      [{ text: '    CostCenter  = "product-001"', color: GRN }],
      [{ text: '  }', color: FG }],
      [{ text: '}', color: FG }],
    ],
    why: 'Sem tags, é impossível saber qual time gastou quanto e em quê. AWS Cost Explorer usa tags para alocação de custos. Tags de Environment permitem políticas SCPs por ambiente.',
  },
  {
    title: 'Sem Multi-AZ em produção',
    wrong: [
      [{ text: '// RDS single-AZ — ponto único de falha', color: RED }],
      [{ text: 'resource "aws_db_instance" "db" {', color: FG }],
      [{ text: '  engine         = "postgres"', color: FG }],
      [{ text: '  instance_class = "db.t3.medium"', color: FG }],
      [{ text: '  multi_az       = false  // downtime durante manutenção', color: RED }],
      [{ text: '}', color: FG }],
    ],
    right: [
      [{ text: '// Multi-AZ com failover automático em menos de 60s', color: GRN }],
      [{ text: 'resource "aws_db_instance" "db" {', color: FG }],
      [{ text: '  engine         = "postgres"', color: FG }],
      [{ text: '  instance_class = "db.t3.medium"', color: FG }],
      [{ text: '  multi_az       = true   // standby em outra AZ', color: GRN }],
      [{ text: '  backup_retention_period = 7', color: GRN }],
      [{ text: '  deletion_protection     = true', color: GRN }],
      [{ text: '}', color: FG }],
    ],
    why: 'Single-AZ significa downtime durante manutenção, patches e falhas de hardware. Multi-AZ mantém replica síncrona — failover automático em menos de 60s sem intervenção manual.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 8 — DecisionTree: qual serviço de computação usar?
// Justificativa: árvore de decisão interativa torna o processo de escolha
// explícito. O entrevistador quer ouvir esse raciocínio — este visual ensina
// a estrutura mental correta para defender a escolha.
// ═══════════════════════════════════════════════════════════════════════════════

const DT_ROOT: DTNode = {
  id: 'root',
  question: 'Qual serviço de computação AWS usar?',
  children: [
    { label: 'Preciso de Kubernetes?', nodeId: 'kubernetes', color: SKY },
    { label: 'É event-driven/serverless?', nodeId: 'serverless', color: C },
    { label: 'São containers sem K8s?', nodeId: 'containers', color: PRP },
    { label: 'Preciso de controle total de OS?', nodeId: 'vm', color: '#f59e0b' },
  ],
}

const DT_NODES: Record<string, DTNode> = {
  kubernetes: {
    id: 'kubernetes',
    question: 'Time já usa Kubernetes ou precisa de portabilidade multi-cloud?',
    children: [
      { label: 'Sim, time conhece K8s', nodeId: 'eks-yes', color: GRN },
      { label: 'Não, é overhead desnecessário', nodeId: 'fargate-direct', color: C },
    ],
  },
  'eks-yes': {
    id: 'eks-yes',
    recommendation: 'EKS (Elastic Kubernetes Service)',
    detail: 'Control plane gerenciado pela AWS. Workers em EC2 ou Fargate. Use Karpenter para auto-scaling eficiente. Adicione Helm charts para monitoramento (Prometheus + Grafana).',
    color: SKY,
    icon: '☸️',
  },
  'fargate-direct': {
    id: 'fargate-direct',
    recommendation: 'ECS com Fargate',
    detail: 'Containers sem gerenciar cluster. Mais simples que EKS para maioria dos casos. ECS Service Auto Scaling por CPU/memória. Integra nativamente com ALB, CloudWatch e ECR.',
    color: PRP,
    icon: '📦',
  },
  serverless: {
    id: 'serverless',
    question: 'A execução dura menos de 15 minutos?',
    children: [
      { label: 'Sim, curta e event-driven', nodeId: 'lambda-yes', color: C },
      { label: 'Não, processamento longo', nodeId: 'fargate-batch', color: PRP },
    ],
  },
  'lambda-yes': {
    id: 'lambda-yes',
    recommendation: 'Lambda',
    detail: 'Paga por invocação + duração (ms). Escala de 0 a 1000+ simultâneas. Cold start em VPC pode ser problema — use Provisioned Concurrency se latência for crítica. Ótimo com SQS, SNS, EventBridge, API Gateway.',
    color: C,
    icon: 'λ',
  },
  'fargate-batch': {
    id: 'fargate-batch',
    recommendation: 'ECS Fargate + AWS Batch',
    detail: 'Para jobs longos: AWS Batch provisiona e gerencia instâncias automaticamente. Use Spot Instances para reduzir custo em até 90%. Integra com Step Functions para orquestração de pipeline.',
    color: PRP,
    icon: '⚙️',
  },
  containers: {
    id: 'containers',
    question: 'Você tem imagens Docker e quer simplicidade operacional?',
    children: [
      { label: 'Sim, containers com gestão simples', nodeId: 'ecs-simple', color: PRP },
      { label: 'Preciso de mais controle de rede/storage', nodeId: 'ecs-ec2', color: '#f59e0b' },
    ],
  },
  'ecs-simple': {
    id: 'ecs-simple',
    recommendation: 'ECS Fargate',
    detail: 'Sem EC2 para gerenciar — AWS provisiona o compute. Paga por vCPU e memória reservados. Service Mesh com App Mesh opcional. Perfect fit para APIs REST e microserviços.',
    color: PRP,
    icon: '🐳',
  },
  'ecs-ec2': {
    id: 'ecs-ec2',
    recommendation: 'ECS com EC2 Launch Type',
    detail: 'Você gerencia o cluster de EC2 mas AWS gerencia o orquestrador ECS. Útil para tipos de instância especializados (GPU, alta memória, NVMe) ou quando custo de Fargate é alto com grande volume.',
    color: '#f59e0b',
    icon: '🖥️',
  },
  vm: {
    id: 'vm',
    question: 'É software legado ou precisa de GPU/instâncias especializadas?',
    children: [
      { label: 'Sim, controle de OS necessário', nodeId: 'ec2-yes', color: '#f59e0b' },
      { label: 'Não, pode containerizar', nodeId: 'fargate-direct', color: PRP },
    ],
  },
  'ec2-yes': {
    id: 'ec2-yes',
    recommendation: 'EC2',
    detail: 'Controle total: escolha de OS, tipo de instância, storage (EBS gp3/io2). Use Auto Scaling Groups para escalar. Reserved Instances para carga base (60% off). Spot para workloads tolerantes a interrupção (90% off).',
    color: '#f59e0b',
    icon: '🖥️',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 9 — ComparisonTable: banco de dados AWS
// Justificativa: "qual banco usar?" é a pergunta de design mais cobrada em
// entrevistas AWS depois de computação. 5 serviços × 6 critérios não existe
// forma intuitiva de comparar em texto — a tabela torna a decisão defensável.
// ═══════════════════════════════════════════════════════════════════════════════

const DB_OPTIONS: ComparisonOption[] = [
  { id: 'rds',         label: 'RDS',           sublabel: 'Relacional gerenciado',         color: '#60a5fa' },
  { id: 'aurora',      label: 'Aurora',         sublabel: 'Relacional cloud-native',       color: C },
  { id: 'dynamodb',    label: 'DynamoDB',       sublabel: 'NoSQL chave-valor/documento',   color: GRN },
  { id: 'elasticache', label: 'ElastiCache',    sublabel: 'Cache em memória',              color: RED },
  { id: 'redshift',    label: 'Redshift',       sublabel: 'Data warehouse analítico',      color: PRP },
]

const DB_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'model', label: 'Modelo de dados', category: 'Estrutura',
    description: 'Tipo de dado e forma de acesso',
    values: {
      rds:         { rating: 'excellent', note: 'SQL completo — JOINs, transações ACID, schema rígido' },
      aurora:      { rating: 'excellent', note: 'SQL idêntico ao RDS com engine cloud-native' },
      dynamodb:    { rating: 'good',      note: 'Chave primária + sort key. Sem JOINs — acesso por chave' },
      elasticache: { rating: 'fair',      note: 'Estruturas em memória: string, hash, list, set, sorted set' },
      redshift:    { rating: 'good',      note: 'SQL analítico com colunar — JOINs em bilhões de linhas' },
    },
  },
  {
    id: 'scale', label: 'Escalabilidade', category: 'Performance',
    description: 'Capacidade de escalar sob carga crescente',
    values: {
      rds:         { rating: 'good',      note: 'Read Replicas para leitura. Write é single-AZ primary' },
      aurora:      { rating: 'excellent', note: 'Aurora Serverless v2 escala vCPU automaticamente. Até 15 read replicas' },
      dynamodb:    { rating: 'excellent', note: 'Latência single-digit ms em qualquer escala. On-demand ou provisionado' },
      elasticache: { rating: 'excellent', note: 'Cluster mode: sharding automático. Sub-milissegundo em qualquer escala' },
      redshift:    { rating: 'good',      note: 'RA3 com Redshift Managed Storage — separa compute de storage' },
    },
  },
  {
    id: 'latency', label: 'Latência de leitura', category: 'Performance',
    description: 'Tempo típico de resposta para uma query',
    values: {
      rds:         { rating: 'good',      note: '1–10ms para queries simples com índice' },
      aurora:      { rating: 'excellent', note: '&lt;1ms para leituras de read replica na mesma AZ' },
      dynamodb:    { rating: 'excellent', note: 'Single-digit ms garantido no p99. DAX reduz para microssegundos' },
      elasticache: { rating: 'excellent', note: 'Sub-milissegundo — memória, sem I/O de disco' },
      redshift:    { rating: 'poor',      note: 'Segundos a minutos para queries analíticas complexas' },
    },
  },
  {
    id: 'transactions', label: 'Transações ACID', category: 'Consistência',
    description: 'Suporte a transações atômicas multi-operação',
    values: {
      rds:         { rating: 'excellent', note: 'ACID completo. Isolation levels configuráveis' },
      aurora:      { rating: 'excellent', note: 'ACID com 6 cópias de dados em 3 AZs — mais durável que RDS padrão' },
      dynamodb:    { rating: 'good',      note: 'TransactWriteItems até 25 itens. Consistência eventual por padrão' },
      elasticache: { rating: 'poor',      note: 'Sem transações ACID — best-effort. Redis MULTI/EXEC é limitado' },
      redshift:    { rating: 'fair',      note: 'ACID para DML mas otimizado para leitura analítica, não OLTP' },
    },
  },
  {
    id: 'ops', label: 'Overhead operacional', category: 'Operações',
    description: 'Esforço de gestão, backup, patching e HA',
    values: {
      rds:         { rating: 'good',      note: 'Multi-AZ, backups, patching gerenciados. Você escolhe engine/versão' },
      aurora:      { rating: 'excellent', note: 'Zero gestão de storage. Failover em menos de 30s. Backtrack para correção de erros' },
      dynamodb:    { rating: 'excellent', note: 'Serverless total — sem cluster, sem patching, sem capacity planning manual' },
      elasticache: { rating: 'good',      note: 'Serverless mode elimina gestão de cluster. Shard gerenciado automaticamente' },
      redshift:    { rating: 'good',      note: 'Redshift Serverless elimina gestão de cluster para cargas variáveis' },
    },
  },
  {
    id: 'use-case', label: 'Caso de uso ideal', category: 'Decisão',
    description: 'Quando escolher este serviço',
    values: {
      rds:         { rating: 'good', note: 'Apps relacionais existentes, migração lift-and-shift, PostgreSQL/MySQL' },
      aurora:      { rating: 'good', note: 'Novas apps relacionais de alta performance, substituição RDS, Global Database' },
      dynamodb:    { rating: 'good', note: 'Session, carrinho, IoT, gaming, escala imprevisível, acesso por chave' },
      elasticache: { rating: 'good', note: 'Cache de sessão, resultado de query, rate limiting, leaderboards (sorted set)' },
      redshift:    { rating: 'good', note: 'BI, data warehouse, queries analíticas, integração com S3 via Redshift Spectrum' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 10 — ComparisonTable: SQS vs SNS vs EventBridge vs Kinesis
// Justificativa: "quando usar SQS vs SNS vs EventBridge?" é pergunta obrigatória
// em qualquer entrevista de arquitetura serverless ou event-driven. Os 4 serviços
// parecem similares à primeira vista — a tabela expõe as diferenças reais.
// ═══════════════════════════════════════════════════════════════════════════════

const MSG_OPTIONS: ComparisonOption[] = [
  { id: 'sqs',         label: 'SQS',         sublabel: 'Fila point-to-point',       color: '#f59e0b' },
  { id: 'sns',         label: 'SNS',         sublabel: 'Pub/Sub fan-out',           color: C },
  { id: 'eventbridge', label: 'EventBridge', sublabel: 'Event bus com roteamento',  color: PRP },
  { id: 'kinesis',     label: 'Kinesis',     sublabel: 'Streaming de dados',        color: SKY },
]

const MSG_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'pattern', label: 'Padrão', category: 'Arquitetura',
    description: 'Modelo de comunicação entre produtor e consumidor',
    values: {
      sqs:         { rating: 'good',      note: 'Point-to-point: um produtor, um consumidor (ou workers em competição)' },
      sns:         { rating: 'excellent', note: 'Fan-out: um tópico → N subscribers (SQS, Lambda, HTTP, email, SMS)' },
      eventbridge: { rating: 'excellent', note: 'Event bus: produtor publica, roteamento por conteúdo do evento para N destinos' },
      kinesis:     { rating: 'good',      note: 'Streaming: dados em ordem por shard. N consumidores leem independentemente' },
    },
  },
  {
    id: 'ordering', label: 'Ordenação', category: 'Garantias',
    description: 'Entrega em ordem de chegada',
    values: {
      sqs:         { rating: 'fair',      note: 'Standard: sem ordem. FIFO: ordenação estrita, até 300 TPS' },
      sns:         { rating: 'poor',      note: 'Sem garantia de ordem (fan-out para múltiplos subscribers)' },
      eventbridge: { rating: 'poor',      note: 'Sem garantia de ordem — event bus é best-effort' },
      kinesis:     { rating: 'excellent', note: 'Ordenação estrita por shard. Ideal para eventos sequenciais (logs, cliques)' },
    },
  },
  {
    id: 'delivery', label: 'Semântica de entrega', category: 'Garantias',
    description: 'Quantas vezes a mensagem pode ser entregue',
    values: {
      sqs:         { rating: 'good',      note: 'Standard: at-least-once. FIFO: exactly-once com deduplication ID' },
      sns:         { rating: 'fair',      note: 'At-least-once para HTTP/HTTPS. SQS subscriber adiciona durabilidade' },
      eventbridge: { rating: 'good',      note: 'At-least-once com retry automático. DLQ configurável' },
      kinesis:     { rating: 'excellent', note: 'At-least-once. Replay possível — retenção de 1 a 365 dias no stream' },
    },
  },
  {
    id: 'filtering', label: 'Filtragem/roteamento', category: 'Funcionalidade',
    description: 'Capacidade de rotear mensagens baseado em conteúdo',
    values: {
      sqs:         { rating: 'poor',      note: 'Sem filtragem — consumidor processa todas as mensagens da fila' },
      sns:         { rating: 'good',      note: 'Message Filtering: subscriber recebe só mensagens que passam no filtro (atributos)' },
      eventbridge: { rating: 'excellent', note: 'Rules com pattern matching no JSON do evento — filtragem rica por campo e valor' },
      kinesis:     { rating: 'fair',      note: 'Consumer pode filtrar no Lambda trigger, mas stream não filtra nativamente' },
    },
  },
  {
    id: 'throughput', label: 'Throughput', category: 'Performance',
    description: 'Volume de mensagens suportado por segundo',
    values: {
      sqs:         { rating: 'excellent', note: 'Praticamente ilimitado (Standard). FIFO: 300 TPS (3000 com batching)' },
      sns:         { rating: 'excellent', note: 'Praticamente ilimitado — depende dos subscribers (SQS, Lambda)' },
      eventbridge: { rating: 'good',      note: '10.000 events/s por default por conta (aumenta via quota request)' },
      kinesis:     { rating: 'excellent', note: '1 MB/s entrada e 2 MB/s saída por shard. Shards são escaláveis' },
    },
  },
  {
    id: 'use-case', label: 'Quando usar', category: 'Decisão',
    description: 'Contexto ideal de aplicação',
    values: {
      sqs:         { rating: 'good', note: 'Worker queue, desacoplamento de serviços, retry com DLQ, jobs assíncronos' },
      sns:         { rating: 'good', note: 'Fan-out para múltiplos consumidores, notificações (email/SMS/push)' },
      eventbridge: { rating: 'good', note: 'Event-driven entre serviços AWS, integração com 200+ SaaS, schema registry' },
      kinesis:     { rating: 'good', note: 'Logs em tempo real, clickstream, métricas, analytics, replay de eventos' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// Componente principal
// ═══════════════════════════════════════════════════════════════════════════════

export default function AwsVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'iam-explorer',
      title: 'IAM — Identidade e Acesso',
      subtitle: 'Users, Groups, Roles e Policies — o que cada um faz e quando usar',
      accent: C,
      component: <IamExplorer />,
    },
    {
      id: 'vpc-explorer',
      title: 'VPC — Subnets, SG e NACL',
      subtitle: 'Subnets públicas vs privadas, IGW, NAT Gateway, Security Group vs NACL',
      accent: C,
      component: <VpcExplorer />,
    },
    {
      id: 'aws-layers',
      title: 'Arquitetura em Camadas AWS',
      subtitle: 'Da borda ao dado — Edge → Rede → Compute → Data → Segurança',
      accent: C,
      component: (
        <LayerStack
          layers={AWS_LAYERS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'request-flow',
      title: 'Fluxo de Request em AWS 3-tier',
      subtitle: 'Route53 → CloudFront → ALB → ECS → ElastiCache → RDS passo a passo',
      accent: C,
      component: (
        <SequenceDiagram
          actors={SEQ_ACTORS}
          messages={SEQ_MESSAGES}
          accentColor={C}
          bgColor={BG}
          title="Request flow AWS 3-tier com cache"
          description="Clique em cada mensagem para ver detalhes do que acontece naquele passo"
        />
      ),
    },
    {
      id: 'compute-comparison',
      title: 'EC2 vs Lambda vs ECS vs EKS',
      subtitle: 'Comparação por performance, custo, operação e portabilidade',
      accent: C,
      component: (
        <ComparisonTable
          options={COMPUTE_OPTIONS}
          criteria={COMPUTE_CRITERIA}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 's3-heatmap',
      title: 'S3 Storage Classes — Custo vs Acesso',
      subtitle: 'Mapa de calor: compare classes por custo de storage, retrieval e latência',
      accent: C,
      component: (
        <HeatMap
          rows={S3_ROWS}
          cols={S3_COLS}
          data={S3_DATA}
          accentColor={C}
          bgColor={BG}
          lowColor={GRN}
          highColor={RED}
          valueFormatter={(v) => `${v}/10`}
        />
      ),
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns AWS',
      subtitle: 'Credenciais hardcoded, S3 público, sem tags, sem Multi-AZ — e como corrigir',
      accent: C,
      component: (
        <AntiPatternsGallery
          patterns={AWS_ANTIPATTERNS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'decision-tree',
      title: 'Qual serviço de computação usar?',
      subtitle: 'Árvore de decisão: Lambda vs ECS/Fargate vs EKS vs EC2',
      accent: C,
      component: (
        <DecisionTree
          root={DT_ROOT}
          nodes={DT_NODES}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'database-comparison',
      title: 'Bancos de Dados AWS — quando usar cada um',
      subtitle: 'RDS vs Aurora vs DynamoDB vs ElastiCache vs Redshift — critérios e casos de uso',
      accent: C,
      component: (
        <ComparisonTable
          options={DB_OPTIONS}
          criteria={DB_CRITERIA}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'messaging-comparison',
      title: 'Mensageria — SQS vs SNS vs EventBridge vs Kinesis',
      subtitle: 'Padrão, ordenação, semântica de entrega, filtragem e quando usar cada um',
      accent: C,
      component: (
        <ComparisonTable
          options={MSG_OPTIONS}
          criteria={MSG_CRITERIA}
          accentColor={C}
          bgColor={BG}
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
