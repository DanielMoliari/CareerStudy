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
import { ProgressionMap } from '@/components/visuals/ProgressionMap'
import type { ProgressionLevel } from '@/components/visuals/ProgressionMap'

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
// VISUAL 1 — IAM TreeExplorer custom
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
    desc: 'Agrupam users para aplicar policies em conjunto. Um user pode estar em múltiplos grupos.',
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
// VISUAL 2 — LayerStack: serviços AWS por camada
// ═══════════════════════════════════════════════════════════════════════════════

const AWS_LAYERS: Layer[] = [
  {
    id: 'edge',
    label: 'Edge / CDN',
    sublabel: 'Camada 1 — Global',
    description: 'Primeira linha de contato com o usuário. Cache global, WAF, DNS com failover. Reduz latência em qualquer região do planeta.',
    code: 'Route53 → CloudFront (+ WAF) → origem',
    color: '#38bdf8',
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
// VISUAL 3 — SequenceDiagram: request flow em AWS 3-tier
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
  { from: 'ecs',   to: 'cache', label: 'GET orders:{userId}',        note: 'Redis lookup primeiro — latência <1ms',            type: 'async' },
  { from: 'cache', to: 'ecs',   label: 'Cache miss',                 note: 'TTL expirado ou primeira vez',                     type: 'return' },
  { from: 'ecs',   to: 'rds',   label: 'SELECT * FROM orders ...',   note: 'Conexão via Security Group privado. Multi-AZ.',    type: 'sync' },
  { from: 'rds',   to: 'ecs',   label: 'ResultSet',                  note: 'Leitura do standby RDS não bloqueia writes',       type: 'return' },
  { from: 'ecs',   to: 'cache', label: 'SET orders:{userId} TTL=60', note: 'Popula cache para próximas requests',              type: 'async' },
  { from: 'ecs',   to: 'alb',   label: '200 OK JSON',                note: 'Response com Cache-Control: max-age=60',           type: 'return' },
  { from: 'alb',   to: 'cf',    label: '200 OK',                     note: 'CloudFront armazena no edge cache',                type: 'return' },
  { from: 'cf',    to: 'user',  label: '200 OK (do cache na 2ª req)',note: 'Próxima request = HIT → sub-10ms globalmente',     type: 'return' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — ComparisonTable: EC2 vs Lambda vs ECS vs EKS
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
      lambda:  { rating: 'excellent', note: 'Escala pra 1000+ invocações simultâneas em segundos' },
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
// VISUAL 5 — S3 Storage Classes HeatMap
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
  [{ value: 4, note: '$0.0125/GB' }, { value: 4, note: '$0.01/GB' },     { value: 0, note: 'Milissegundos' }, { value: 10, note: '11 noves' }, { value: 7, note: 'Acesso < 1×/mês' }],
  // One Zone-IA
  [{ value: 3, note: '$0.01/GB' },  { value: 4, note: '$0.01/GB' },      { value: 0, note: 'Milissegundos' }, { value: 7, note: '11 noves (1 AZ)' }, { value: 5, note: 'Dados reproduzíveis' }],
  // Glacier Instant
  [{ value: 2, note: '$0.004/GB' }, { value: 5, note: '$0.03/GB' },      { value: 1, note: 'Milissegundos' }, { value: 10, note: '11 noves' }, { value: 6, note: 'Arq. acesso trimestral' }],
  // Glacier Flexible
  [{ value: 1, note: '$0.0036/GB' },{ value: 6, note: '$0.01/GB' },      { value: 6, note: '1-12 horas' },   { value: 10, note: '11 noves' }, { value: 4, note: 'Backup anual' }],
  // Deep Archive
  [{ value: 0, note: '$0.00099/GB' },{ value: 8, note: '$0.02/GB' },     { value: 9, note: '12-48 horas' },  { value: 10, note: '11 noves' }, { value: 2, note: 'Retenção 7+ anos' }],
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — AntiPatternsGallery: armadilhas comuns na AWS
// ═══════════════════════════════════════════════════════════════════════════════

const AWS_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'Credenciais hardcoded no código',
    wrong: [
      [{ text: '// ❌ NUNCA faça isso — vaza em git history', color: RED }],
      [{ text: 'const s3 = new AWS.S3({', color: FG }],
      [{ text: '  accessKeyId: "AKIAIOSFODNN7EXAMPLE",', color: RED }],
      [{ text: '  secretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"', color: RED }],
      [{ text: '})', color: FG }],
    ],
    right: [
      [{ text: '// ✅ Use IAM Role — credenciais automáticas via STS', color: GRN }],
      [{ text: '// EC2/ECS/Lambda assumem a role automaticamente', color: FGMUTE }],
      [{ text: 'const s3 = new S3Client({ region: "us-east-1" })', color: FG }],
      [{ text: '// SDK lê credenciais do instance metadata automaticamente', color: FGMUTE }],
    ],
    why: 'Credenciais hardcoded ficam no git history para sempre. Mesmo após remoção, vazaram. IAM Roles geram tokens temporários via STS que expiram. Sem segredo para gerenciar.',
  },
  {
    title: 'S3 bucket público por padrão',
    wrong: [
      [{ text: '// ❌ Bucket com acesso público — dados expostos', color: RED }],
      [{ text: 'resource "aws_s3_bucket_public_access_block" "bad" {', color: FG }],
      [{ text: '  block_public_acls   = false', color: RED }],
      [{ text: '  block_public_policy = false', color: RED }],
      [{ text: '}', color: FG }],
    ],
    right: [
      [{ text: '// ✅ Block all public access + CloudFront OAC', color: GRN }],
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
      [{ text: '// ❌ Recursos sem tags — custo impossível de rastrear', color: RED }],
      [{ text: 'resource "aws_instance" "api" {', color: FG }],
      [{ text: '  ami           = "ami-0c02fb55956c7d316"', color: FG }],
      [{ text: '  instance_type = "t3.medium"', color: FG }],
      [{ text: '  # sem tags — quem criou? qual projeto? qual ambiente?', color: RED }],
      [{ text: '}', color: FG }],
    ],
    right: [
      [{ text: '// ✅ Tags obrigatórias + AWS Cost Allocation Tags', color: GRN }],
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
      [{ text: '// ❌ RDS single-AZ — ponto único de falha', color: RED }],
      [{ text: 'resource "aws_db_instance" "db" {', color: FG }],
      [{ text: '  engine         = "postgres"', color: FG }],
      [{ text: '  instance_class = "db.t3.medium"', color: FG }],
      [{ text: '  multi_az       = false  # ❌ downtime durante manutenção', color: RED }],
      [{ text: '}', color: FG }],
    ],
    right: [
      [{ text: '// ✅ Multi-AZ com failover automático em <60s', color: GRN }],
      [{ text: 'resource "aws_db_instance" "db" {', color: FG }],
      [{ text: '  engine         = "postgres"', color: FG }],
      [{ text: '  instance_class = "db.t3.medium"', color: FG }],
      [{ text: '  multi_az       = true   # ✅ standby em outra AZ', color: GRN }],
      [{ text: '  backup_retention_period = 7', color: GRN }],
      [{ text: '  deletion_protection     = true', color: GRN }],
      [{ text: '}', color: FG }],
    ],
    why: 'Single-AZ significa downtime durante manutenção, patches e falhas de hardware. Multi-AZ mantém replica síncrona — failover automático em <60s sem intervenção manual.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — DecisionTree: qual serviço de computação usar?
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
// VISUAL 8 — ProgressionMap: jornada AWS
// ═══════════════════════════════════════════════════════════════════════════════

const AWS_LEVELS: ProgressionLevel[] = [
  {
    id: 'junior',
    name: 'Iniciante',
    label: 'Usuário de Console',
    emoji: '🌱',
    concepts: [
      { name: 'IAM básico (users, MFA)', tip: 'Nunca use root user. Crie IAM user com MFA desde o início.' },
      { name: 'EC2 (lançar instância, SSH)', tip: 'Pratique: lance um t3.micro, conecte via SSH, instale nginx.' },
      { name: 'S3 (upload, permissões básicas)', tip: 'Entenda ACLs vs bucket policies vs Block Public Access.' },
      { name: 'RDS (lançar Postgres gerenciado)', tip: 'Compare custo de RDS vs EC2+Postgres automanaged.' },
      { name: 'Free tier e billing alerts', tip: 'Configure billing alarm em $5 para evitar surpresas.' },
    ],
  },
  {
    id: 'pleno',
    name: 'Pleno',
    label: 'Arquitetura 3-tier',
    emoji: '⚡',
    concepts: [
      { name: 'VPC (subnets pub/priv, NAT GW, SG)', tip: 'Desenhe o diagrama de rede de cabeça: IGW → ALB → ECS → RDS.' },
      { name: 'ECS/Fargate (containers gerenciados)', tip: 'Task definition, Service, ALB integration, Auto Scaling.' },
      { name: 'CloudFront + S3 (CDN de assets)', tip: 'OAC vs OAI — prefira OAC (mais seguro e moderno).' },
      { name: 'Route 53 (DNS + health checks)', tip: 'Weighted routing para blue/green sem downtime.' },
      { name: 'CloudWatch (métricas, logs, alarmes)', tip: 'Configure alarme de CPU >80% e memória para todos os serviços.' },
      { name: 'Secrets Manager (não env vars!)', tip: 'RDS auto-rotation funciona out of the box.' },
    ],
  },
  {
    id: 'senior',
    name: 'Sênior',
    label: 'Arquitetura Distribuída',
    emoji: '🚀',
    concepts: [
      { name: 'Lambda (event-driven, cold start, VPC)', tip: 'SnapStart para Java, Provisioned Concurrency para latência crítica.' },
      { name: 'SQS + SNS + EventBridge (mensageria)', tip: 'Fan-out: SNS → SQS (uma fila por consumidor). DLQ para retry.' },
      { name: 'Aurora Serverless v2 (auto-pause)', tip: 'Global Database para multi-region. Comparar com DynamoDB.' },
      { name: 'X-Ray + distributed tracing', tip: 'Service map identifica gargalos. Sampling rate afeta custo.' },
      { name: 'IAM Roles + SCPs + Organizations', tip: 'SCP nega no org-level independente de policy da conta.' },
      { name: 'Cost optimization (Savings Plans, Spot)', tip: 'Compute Savings Plan cobre EC2+Fargate+Lambda. Analisar com Cost Explorer.' },
    ],
  },
  {
    id: 'especialista',
    name: 'Especialista',
    label: 'Solutions Architect',
    emoji: '🏆',
    concepts: [
      { name: 'Multi-region active-active (Route53, DynamoDB Global)', tip: 'RPO=0, RTO<1min. DynamoDB Global Tables replicam em <1s.' },
      { name: 'Landing Zone + Control Tower + AWS Organizations', tip: 'Guardrails preventivos (SCP) e detectivos (Config Rules).' },
      { name: 'EKS + Karpenter + Service Mesh', tip: 'Karpenter provisionamento em segundos vs minutos do CA.' },
      { name: 'FinOps: custo por feature, chargeback', tip: 'Tags + Cost Allocation + Budgets com ações automáticas.' },
      { name: 'Well-Architected Framework (6 pillars)', tip: 'Saiba defender cada pilar com exemplos reais do projeto.' },
    ],
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
      id: 'progression',
      title: 'Jornada AWS — Iniciante ao Especialista',
      subtitle: 'O que dominar em cada nível para entrevistas e certificações',
      accent: C,
      component: (
        <ProgressionMap
          levels={AWS_LEVELS}
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
