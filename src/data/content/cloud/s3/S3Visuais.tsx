'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'
import { StateMachineExplorer } from '@/components/visuals/StateMachineExplorer'
import type { SMState, SMTransition } from '@/components/visuals/StateMachineExplorer'
import { SequenceDiagram } from '@/components/visuals/SequenceDiagram'
import type { SeqActor, SeqMessage, SeqGroup } from '@/components/visuals/SequenceDiagram'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { CardCarousel } from '@/components/visuals/CardCarousel'
import type { CarouselCard } from '@/components/visuals/CardCarousel'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'

// ── Paleta S3 (AWS orange) ────────────────────────────────────────────────────
const C      = '#FF9900'
const C2     = '#cc7a00'
const BG     = '#0f172a'
const CARD   = '#1e293b'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#4ade80'
const AMB    = '#f59e0b'
const RED    = '#ef4444'
const BLU    = '#60a5fa'
const PUR    = '#a78bfa'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Storage Classes (ComparisonTable)
// Compara as 6 classes nas dimensões que importam: custo, retrieval, latência,
// duração mínima e cenários — ver tudo simultaneamente revela o trade-off real
// ═══════════════════════════════════════════════════════════════════════════════

const STORAGE_OPTIONS: ComparisonOption[] = [
  { id: 'std',  label: 'Standard',           sublabel: 'acesso frequente',           color: C },
  { id: 'ia',   label: 'Standard-IA',        sublabel: 'acesso infrequente',         color: '#fb923c' },
  { id: 'it',   label: 'Intelligent-Tiering', sublabel: 'acesso variável',           color: '#fbbf24' },
  { id: 'gir',  label: 'Glacier Instant',    sublabel: 'arquivamento rápido',        color: PUR },
  { id: 'gfl',  label: 'Glacier Flexible',   sublabel: 'arquivamento médio',         color: '#818cf8' },
  { id: 'da',   label: 'Deep Archive',       sublabel: 'arquivamento profundo',      color: '#6366F1' },
]

const STORAGE_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'cost',
    label: 'Custo de armazenamento',
    category: 'Custo',
    description: 'Custo relativo de armazenar 1 GB por mês (Standard = 100% como referência)',
    values: {
      std:  { rating: 'fair',      note: '100% — referência (us-east-1: ~$0,023/GB)' },
      ia:   { rating: 'good',      note: '~58% do Standard (~$0,0125/GB)' },
      it:   { rating: 'good',      note: 'Tier ativo ~Standard, tier acesso raro chega a ~5%' },
      gir:  { rating: 'excellent', note: '~28% (~$0,004/GB)' },
      gfl:  { rating: 'excellent', note: '~14% (~$0,0036/GB)' },
      da:   { rating: 'excellent', note: '~5% — mais barato de todos (~$0,00099/GB)' },
    },
  },
  {
    id: 'retrieval',
    label: 'Custo de retrieval',
    category: 'Custo',
    description: 'Custo extra cobrado quando você lê o objeto — paga por GB lido',
    values: {
      std:  { rating: 'excellent', note: 'Sem taxa de retrieval' },
      ia:   { rating: 'fair',      note: '~$0,01/GB lido — pode dominar custo se ler muito' },
      it:   { rating: 'excellent', note: 'Sem taxa — o monitoramento é pago à parte (~$0,0025/1k obj)' },
      gir:  { rating: 'fair',      note: '~$0,03/GB lido — pago mesmo no acesso instantâneo' },
      gfl:  { rating: 'poor',      note: 'Expedited é caro; Standard/Bulk mais barato' },
      da:   { rating: 'poor',      note: 'Mais caro que Glacier Flexible — só vale para retenção longa' },
    },
  },
  {
    id: 'latency',
    label: 'Latência de leitura',
    category: 'Operações',
    description: 'Tempo entre o GET e os primeiros bytes disponíveis',
    values: {
      std:  { rating: 'excellent', note: 'Milissegundos' },
      ia:   { rating: 'excellent', note: 'Milissegundos (mesma da Standard)' },
      it:   { rating: 'excellent', note: 'Milissegundos no tier ativo' },
      gir:  { rating: 'excellent', note: 'Milissegundos — único Glacier instantâneo' },
      gfl:  { rating: 'fair',      note: 'Expedited 1–5min, Standard 3–5h, Bulk 5–12h' },
      da:   { rating: 'poor',      note: 'Standard 12h, Bulk 48h' },
    },
  },
  {
    id: 'min',
    label: 'Duração mínima de cobrança',
    category: 'Custo',
    description: 'Mesmo se você apagar antes, é cobrado pelo período mínimo',
    values: {
      std:  { rating: 'excellent', note: 'Sem mínimo — pague pelo que usa' },
      ia:   { rating: 'fair',      note: '30 dias mínimo' },
      it:   { rating: 'excellent', note: 'Sem mínimo' },
      gir:  { rating: 'fair',      note: '90 dias mínimo' },
      gfl:  { rating: 'fair',      note: '90 dias mínimo' },
      da:   { rating: 'poor',      note: '180 dias mínimo' },
    },
  },
  {
    id: 'usecase',
    label: 'Cenário ideal',
    category: 'Operações',
    description: 'Quando essa classe é a escolha certa',
    values: {
      std:  { rating: 'excellent', note: 'Assets ativos, uploads recentes, dados quentes' },
      ia:   { rating: 'excellent', note: 'Backups, dados acessados raramente mas precisam estar disponíveis' },
      it:   { rating: 'excellent', note: 'Padrão de acesso imprevisível (ex: data lake)' },
      gir:  { rating: 'good',      note: 'Arquivos médicos, compliance com acesso ocasional' },
      gfl:  { rating: 'good',      note: 'Backups DR, retenção regulatória 1–7 anos' },
      da:   { rating: 'good',      note: 'Compliance 7+ anos, logs financeiros, dados legais' },
    },
  },
  {
    id: 'sla',
    label: 'SLA de disponibilidade',
    category: 'Operações',
    description: 'Garantia de disponibilidade documentada da classe',
    values: {
      std:  { rating: 'excellent', note: '99,99% — mais alta' },
      ia:   { rating: 'good',      note: '99,9%' },
      it:   { rating: 'excellent', note: '99,9% (tier ativo); até 99,99%' },
      gir:  { rating: 'good',      note: '99,9%' },
      gfl:  { rating: 'good',      note: '99,99% após restauração' },
      da:   { rating: 'good',      note: '99,99% após restauração' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — DecisionTree: qual storage class usar?
// Encadeia perguntas (acesso? retrieval? duração?) até a recomendação final
// ═══════════════════════════════════════════════════════════════════════════════

const STORAGE_DT_ROOT: DTNode = {
  id: 'root',
  question: 'Qual o padrão de acesso aos objetos?',
  detail: 'A primeira pergunta separa dados quentes (acessados várias vezes por mês) de dados frios (acessados raramente ou nunca).',
  children: [
    { label: 'Acesso frequente (várias vezes/mês)',     nodeId: 'frequent',  color: C },
    { label: 'Acesso imprevisível ou variável',         nodeId: 'unknown',   color: AMB },
    { label: 'Acesso raro mas latência baixa exigida',  nodeId: 'rare-fast', color: PUR },
    { label: 'Apenas arquivamento (raramente lido)',    nodeId: 'archive',   color: BLU },
  ],
}

const STORAGE_DT_NODES: Record<string, DTNode> = {
  frequent: {
    id: 'frequent',
    recommendation: 'S3 Standard',
    detail: 'Acesso múltiplas vezes por mês. Sem custo de retrieval, latência de ms, durabilidade 11 noves. Usado para assets ativos, uploads recentes, dados de produção.',
    color: C,
    icon: '★',
  },
  unknown: {
    id: 'unknown',
    question: 'Você sabe quando o padrão muda?',
    detail: 'Intelligent-Tiering cobra um pequeno custo de monitoramento e move automaticamente entre tiers. Se você consegue prever as transições, lifecycle policy direto é mais barato.',
    children: [
      { label: 'Não — quero automático',          nodeId: 'it-pick',     color: AMB },
      { label: 'Sim — sei quando arquivar',       nodeId: 'lifecycle',   color: GRN },
    ],
  },
  'it-pick': {
    id: 'it-pick',
    recommendation: 'Intelligent-Tiering',
    detail: 'Move automaticamente entre Frequent, Infrequent, Archive Instant, Archive e Deep Archive baseado em quando o objeto foi acessado. Cobra ~$0,0025 por 1.000 objetos monitorados/mês. Sem retrieval fee — ideal para data lakes.',
    color: AMB,
    icon: '⚡',
  },
  lifecycle: {
    id: 'lifecycle',
    recommendation: 'Standard com lifecycle policy',
    detail: 'Standard inicial, transições para IA → Glacier → Deep Archive em datas conhecidas. Mais barato que Intelligent-Tiering quando o padrão é determinístico (ex: logs que sempre viram frios após 90 dias).',
    color: GRN,
    icon: '⚙',
  },
  'rare-fast': {
    id: 'rare-fast',
    question: 'Quanto tempo o objeto fica armazenado antes de ser acessado?',
    detail: 'Tanto Standard-IA quanto Glacier Instant Retrieval entregam em milissegundos. A escolha depende da duração mínima de cobrança e do volume de leituras.',
    children: [
      { label: 'Mais que 30 dias, leituras esporádicas',   nodeId: 'ia-pick',  color: '#fb923c' },
      { label: 'Mais que 90 dias, raramente lido',         nodeId: 'gir-pick', color: PUR },
    ],
  },
  'ia-pick': {
    id: 'ia-pick',
    recommendation: 'Standard-IA',
    detail: '~58% do custo do Standard, latência idêntica. Cobra $0,01/GB de retrieval — calcule antes: se você lê >10% do volume todo mês, Standard sai mais barato. Mín. 30 dias de armazenamento.',
    color: '#fb923c',
    icon: '◐',
  },
  'gir-pick': {
    id: 'gir-pick',
    recommendation: 'Glacier Instant Retrieval',
    detail: 'Latência de ms como Standard, custo ~28%. Mín. 90 dias. Excelente para arquivos médicos, mídia raramente acessada, backups que ocasionalmente precisam ser servidos rápido.',
    color: PUR,
    icon: '❄',
  },
  archive: {
    id: 'archive',
    question: 'Quanto tempo de espera é aceitável para recuperar?',
    detail: 'Glacier Flexible e Deep Archive têm preços muito diferentes — escolha pela latência aceitável e duração esperada de retenção.',
    children: [
      { label: 'Minutos a poucas horas',          nodeId: 'gfl-pick', color: '#818cf8' },
      { label: 'Até 12–48h aceitáveis (anos)',   nodeId: 'da-pick',  color: '#6366F1' },
    ],
  },
  'gfl-pick': {
    id: 'gfl-pick',
    recommendation: 'Glacier Flexible Retrieval',
    detail: '~14% do custo do Standard. Expedited: 1–5min. Standard: 3–5h. Bulk: 5–12h. Mín. 90 dias. Bom para backups DR e retenção regulatória de 1–7 anos.',
    color: '#818cf8',
    icon: '🧊',
  },
  'da-pick': {
    id: 'da-pick',
    recommendation: 'Deep Archive',
    detail: 'Mais barato de todos (~5% do Standard). Standard retrieval: 12h. Bulk: 48h. Mín. 180 dias. Ideal para compliance de 7+ anos, logs financeiros (SEC 17a-4), dados legais que ninguém vai ler na prática.',
    color: '#6366F1',
    icon: '🗄',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Lifecycle StateMachine
// Mostra como um objeto transita entre classes ao longo do tempo, com regras
// ═══════════════════════════════════════════════════════════════════════════════

const LIFECYCLE_STATES: SMState[] = [
  { id: 'std',  label: 'Standard',           description: 'Objeto recém-criado, acesso frequente. Sem custo de retrieval. Latência de ms.', color: C, isInitial: true },
  { id: 'ia',   label: 'Standard-IA',        description: 'Após N dias sem acesso, transitou para IA. Mesma latência, ~58% do custo. Mín. 30 dias.', color: '#fb923c' },
  { id: 'gir',  label: 'Glacier Instant',    description: 'Arquivamento com acesso em ms. ~28% do custo. Mín. 90 dias.', color: PUR },
  { id: 'gfl',  label: 'Glacier Flexible',   description: 'Arquivamento com retrieval em min/h. ~14% do custo. Mín. 90 dias.', color: '#818cf8' },
  { id: 'da',   label: 'Deep Archive',       description: 'Arquivamento profundo com retrieval em 12–48h. ~5% do custo. Mín. 180 dias.', color: '#6366F1' },
  { id: 'expired', label: 'Expirado',        description: 'Objeto deletado pela regra de Expiration. Em buckets com versioning, vira delete marker.', color: RED, isFinal: true },
]

const LIFECYCLE_TRANSITIONS: SMTransition[] = [
  { from: 'std', to: 'ia',  event: 'após 30 dias',  code: 'Transitions: [{ Days: 30, StorageClass: STANDARD_IA }]' },
  { from: 'ia',  to: 'gir', event: 'após 90 dias',  code: 'Transitions: [{ Days: 90, StorageClass: GLACIER_IR }]' },
  { from: 'gir', to: 'gfl', event: 'após 180 dias', code: 'Transitions: [{ Days: 180, StorageClass: GLACIER }]' },
  { from: 'gfl', to: 'da',  event: 'após 365 dias', code: 'Transitions: [{ Days: 365, StorageClass: DEEP_ARCHIVE }]' },
  { from: 'da',  to: 'expired', event: 'após 2555 dias (7 anos)', code: 'Expiration: { Days: 2555 }' },
  { from: 'std', to: 'gir', event: 'salto direto (regra customizada)', guard: 'pula IA' },
  { from: 'std', to: 'da',  event: 'arquivamento imediato', guard: 'objeto criado já frio (logs antigos importados)' },
  { from: 'std', to: 'expired', event: 'expira sem transitar', guard: 'logs temporários' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Pre-signed URL: SequenceDiagram do upload direto
// Mostra a troca temporal entre Browser, Backend e S3 — o que cada um faz e quando
// ═══════════════════════════════════════════════════════════════════════════════

const PRESIGN_ACTORS: SeqActor[] = [
  { id: 'browser', label: 'Browser',  color: BLU,  icon: '🌐' },
  { id: 'backend', label: 'Backend',  color: PUR,  icon: '🖥' },
  { id: 'iam',     label: 'IAM/STS',  color: AMB,  icon: '🔑' },
  { id: 's3',      label: 'AWS S3',   color: C,    icon: '🪣' },
  { id: 'lambda',  label: 'Lambda',   color: GRN,  icon: 'λ' },
]

const PRESIGN_MESSAGES: SeqMessage[] = [
  { from: 'browser', to: 'backend', label: 'POST /api/upload-url',     note: 'envia { fileName, contentType, size }', type: 'sync' },
  { from: 'backend', to: 'backend', label: 'valida auth + quota',       note: 'JWT, rate-limit, tamanho máximo' },
  { from: 'backend', to: 'iam',     label: 'getSignedUrl(PutObject)',   note: 'usa role/credenciais do backend', type: 'sync' },
  { from: 'iam',     to: 'backend', label: 'URL assinada (HMAC + TTL)', note: 'inclui Signature, X-Amz-Date, Expires', type: 'return' },
  { from: 'backend', to: 'browser', label: '200 { uploadUrl, key }',   note: 'TTL típico: 15min para PUT', type: 'return' },
  { from: 'browser', to: 's3',      label: 'PUT uploadUrl + arquivo',   note: 'arquivo NUNCA passa pelo backend', type: 'sync' },
  { from: 's3',      to: 's3',      label: 'valida assinatura HMAC',    note: 'rejeita se TTL expirou ou Content-Type mudou' },
  { from: 's3',      to: 'browser', label: '200 OK + ETag',             note: 'arquivo salvo no bucket privado', type: 'return' },
  { from: 's3',      to: 'lambda',  label: 's3:ObjectCreated event',    note: 'Event Notification dispara handler', type: 'async' },
  { from: 'lambda',  to: 's3',      label: 'GetObject (validação)',     note: 'verifica magic bytes, antivírus, gera thumbnail', type: 'sync' },
  { from: 'lambda',  to: 'backend', label: 'webhook (objeto pronto)',   note: 'backend marca upload como concluído no DB', type: 'async' },
]

const PRESIGN_GROUPS: SeqGroup[] = [
  { label: 'Geração da URL', kind: 'opt', fromMsg: 0, toMsg: 4, color: PUR },
  { label: 'Upload direto cliente → S3', kind: 'opt', fromMsg: 5, toMsg: 7, color: C },
  { label: 'Pós-processamento assíncrono', kind: 'opt', fromMsg: 8, toMsg: 10, color: GRN },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Camadas de Segurança (LayerStack)
// Defesa em profundidade: Block Public Access → Bucket Policy → IAM → Encrypt → Audit
// ═══════════════════════════════════════════════════════════════════════════════

const SECURITY_LAYERS: Layer[] = [
  {
    id: 'audit',
    label: 'Camada 5 — Auditoria',
    sublabel: 'CloudTrail Data Events + Macie',
    description: 'Última camada — assume que algo passou. CloudTrail S3 Data Events registra cada GetObject/PutObject (custo extra mas essencial em produção). Amazon Macie usa ML para detectar PII, credenciais, dados financeiros automaticamente. CloudWatch alarms para acessos anômalos (volume incomum por IP).',
    code: 'aws cloudtrail put-event-selectors --trail-name audit \\\n  --event-selectors \'[{"DataResources":[{"Type":"AWS::S3::Object","Values":["arn:aws:s3:::bucket-prod/*"]}]}]\'',
    color: '#a855f7',
    examples: ['CloudTrail data events', 'Macie discovery jobs', 'CloudWatch anomaly alarms'],
  },
  {
    id: 'encrypt',
    label: 'Camada 4 — Criptografia',
    sublabel: 'SSE-S3 / SSE-KMS / SSE-C / client-side',
    description: 'Defesa contra acesso direto ao storage subjacente. SSE-S3 é zero-effort (AES256 gerenciado). SSE-KMS adiciona auditoria por chave (CloudTrail registra cada Decrypt) — exigido em SOC 2/HIPAA/PCI. SSE-C: cliente fornece a chave a cada request. Client-side: cripto antes de subir — AWS nunca vê plaintext.',
    code: 'PutBucketEncryption: { Rules: [{ ApplyServerSideEncryptionByDefault: { SSEAlgorithm: "aws:kms", KMSMasterKeyID: "arn:..." }, BucketKeyEnabled: true }] }',
    color: GRN,
    examples: ['Bucket Key (reduz custo KMS)', 'Customer Managed Key', 'KMS rotation anual'],
  },
  {
    id: 'iam',
    label: 'Camada 3 — IAM Policies',
    sublabel: 'Identity-based: o que a identidade pode fazer',
    description: 'Política anexada a usuário, role ou grupo. Para acesso same-account: bucket policy OU IAM allow é suficiente. Para acesso cross-account: AMBAS precisam permitir. Evite anexar políticas amplas (s3:*) — granularize por bucket e prefix.',
    code: '{ "Effect": "Allow", "Action": ["s3:GetObject"], "Resource": "arn:aws:s3:::bucket-prod/uploads/${aws:username}/*" }',
    color: BLU,
    examples: ['Permission Boundaries', 'Service Control Policies (SCPs)', 'Roles para EC2/ECS/Lambda'],
  },
  {
    id: 'bucket-policy',
    label: 'Camada 2 — Bucket Policy',
    sublabel: 'Resource-based: quem acessa o bucket',
    description: 'JSON anexado ao próprio bucket. Pode forçar HTTPS (Deny se aws:SecureTransport=false), restringir a uma VPC (Deny se aws:SourceVpc != "vpc-xxx"), exigir MFA, ou negar IPs específicos. Avaliada junto com IAM — Deny explícito sempre vence.',
    code: '{ "Effect": "Deny", "Principal": "*", "Action": "s3:*", "Condition": { "Bool": { "aws:SecureTransport": "false" } } }',
    color: AMB,
    examples: ['Force HTTPS', 'VPC-only access', 'Cross-account allow'],
  },
  {
    id: 'bpa',
    label: 'Camada 1 — Block Public Access',
    sublabel: 'Override global — primeira linha',
    description: 'Configuração no nível da conta E do bucket. Se ativada, nada (NEM bucket policy, NEM IAM, NEM ACL) consegue tornar o bucket público. É o switch master — primeira coisa que você ativa em uma conta nova. Os 4 flags devem estar TODOS em true.',
    code: 'aws s3control put-public-access-block --account-id 123456789 \\\n  --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true',
    color: RED,
    examples: ['Conta inteira (recomendado)', 'Bucket individual', 'CFN guard rail'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Encryption Types (CardCarousel)
// Quatro modos de cripto + quando usar / quando não usar
// ═══════════════════════════════════════════════════════════════════════════════

const ENCRYPTION_CARDS: CarouselCard[] = [
  {
    name: 'SSE-S3',
    signature: 'SSEAlgorithm: "AES256"',
    emoji: '🔐',
    color: GRN,
    use: [
      'Compliance básico — LGPD genérica, ISO 27001',
      'Você não tem requisito de auditoria por chave',
      'Quer zero overhead de configuração',
      'Default razoável — todo bucket novo deveria ter pelo menos isso',
    ],
    dontUse: 'Quando você precisa rastrear quem descriptografou o quê (SOC 2, HIPAA, PCI exigem auditoria de chave — use SSE-KMS).',
    difficulty: 1,
  },
  {
    name: 'SSE-KMS',
    signature: 'SSEAlgorithm: "aws:kms" + KMSMasterKeyID',
    emoji: '🗝',
    color: AMB,
    use: [
      'Compliance que exige auditoria de chave (SOC 2, HIPAA, PCI, FedRAMP)',
      'Múltiplas equipes com controle de acesso por chave',
      'Quer rotação automática anual da chave (CMK)',
      'Cross-account: chave em uma conta, dados em outra',
    ],
    dontUse: 'Quando o volume de PUT/GET é altíssimo e você não tem Bucket Key habilitado — cada operação chama o KMS e gera custo. Sempre habilite BucketKeyEnabled=true para reduzir 99% das chamadas.',
    difficulty: 2,
  },
  {
    name: 'SSE-C',
    signature: 'x-amz-server-side-encryption-customer-key (header)',
    emoji: '🛡',
    color: BLU,
    use: [
      'Você precisa controlar 100% da chave (cliente gerencia em HSM próprio)',
      'AWS não pode ter acesso à chave (compliance extremo)',
      'Caso raro — você precisa fornecer a chave a CADA request',
    ],
    dontUse: 'Praticamente sempre. Você assume toda responsabilidade — perdeu a chave, perdeu o objeto. Sem retrieve sem a chave. Não suporta integração com a maioria dos serviços AWS (Athena, Glue) que esperam SSE-S3 ou SSE-KMS.',
    difficulty: 3,
  },
  {
    name: 'Client-side (CSE)',
    signature: 'AmazonS3EncryptionClient + KMS ou chave própria',
    emoji: '🔒',
    color: PUR,
    use: [
      'Dados ultra-sensíveis (chaves privadas, segredos pessoais, dados de saúde)',
      'AWS NUNCA pode ver o plaintext — nem em memória durante upload',
      'Compliance que proíbe AWS de ter qualquer acesso aos dados',
      'Multi-cloud — a mesma chave protege dados em S3, GCS e Azure Blob',
    ],
    dontUse: 'Quando você precisa indexar/processar os dados na AWS (Athena, Glue, S3 Select). Como a AWS só vê bytes opacos, nada disso funciona. Use SSE-KMS se precisa de processamento server-side com auditoria.',
    difficulty: 3,
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — Anti-patterns (AntiPatternsGallery)
// Os erros mais destrutivos em produção S3
// ═══════════════════════════════════════════════════════════════════════════════

const S3_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'Bucket público acidentalmente — Block Public Access desabilitado',
    wrong: [
      [{ text: '# Bucket policy permite leitura pública:', color: FGMUTE }],
      [{ text: '{', color: FG }],
      [{ text: '  "Effect": "Allow",', color: RED }],
      [{ text: '  "Principal": "*",', color: RED }],
      [{ text: '  "Action": "s3:GetObject",', color: RED }],
      [{ text: '  "Resource": "arn:aws:s3:::bucket-prod/*"', color: RED }],
      [{ text: '}', color: FG }],
      [{ text: '# E Block Public Access desligado para "permitir"', color: RED }],
    ],
    right: [
      [{ text: '# 1. Block Public Access em nível de CONTA:', color: FGMUTE }],
      [{ text: 'aws s3control put-public-access-block \\', color: GRN }],
      [{ text: '  --account-id 123456789 \\', color: GRN }],
      [{ text: '  --public-access-block-configuration \\', color: GRN }],
      [{ text: '  BlockPublicAcls=true,IgnorePublicAcls=true, \\', color: GRN }],
      [{ text: '  BlockPublicPolicy=true,RestrictPublicBuckets=true', color: GRN }],
      [{ text: '# 2. Servir arquivos públicos via CloudFront + OAC', color: GRN }],
      [{ text: '#    bucket fica privado, CloudFront é o único acesso', color: GRN }],
    ],
    why: 'Bucket público é a causa #1 de data breach na AWS. Ative Block Public Access em nível de conta — bloqueia todos os buckets, atuais e futuros. Para servir conteúdo "público" (assets, imagens), use CloudFront com Origin Access Control: o bucket continua privado e só o CloudFront acessa.',
  },
  {
    title: 'Versioning ativo sem lifecycle — versões acumulando infinitamente',
    wrong: [
      [{ text: '# Versioning habilitado:', color: FGMUTE }],
      [{ text: 'PutBucketVersioning: { Status: "Enabled" }', color: FG }],
      [{ text: '' }],
      [{ text: '# Mas SEM lifecycle para versões antigas:', color: RED }],
      [{ text: '# Custo cresce linearmente — cada PUT cria nova versão', color: RED }],
      [{ text: '# 1 milhão de objetos × 30 versões = 30M de versões pagas', color: RED }],
    ],
    right: [
      [{ text: '# Lifecycle expira versões antigas, mantém últimas N:', color: FGMUTE }],
      [{ text: '{', color: FG }],
      [{ text: '  "ID": "ExpireOldVersions",', color: GRN }],
      [{ text: '  "Status": "Enabled",', color: GRN }],
      [{ text: '  "NoncurrentVersionExpiration": {', color: GRN }],
      [{ text: '    "NoncurrentDays": 30,', color: GRN }],
      [{ text: '    "NewerNoncurrentVersions": 5  // mantém 5 últimas', color: GRN }],
      [{ text: '  }', color: GRN }],
      [{ text: '}', color: FG }],
    ],
    why: 'Versioning é proteção, mas sem lifecycle vira armadilha de custo. Cada UPDATE de objeto cria uma nova versão; a antiga continua armazenada e cobrada. Defina NoncurrentVersionExpiration para limpar versões com mais de N dias e/ou manter apenas as M últimas.',
  },
  {
    title: 'Pre-signed URL com TTL muito longo (dias)',
    wrong: [
      [{ text: '# URL válida por 7 dias:', color: FGMUTE }],
      [{ text: 'getSignedUrl(s3, command, {', color: FG }],
      [{ text: '  expiresIn: 7 * 24 * 3600  // 604800 segundos', color: RED }],
      [{ text: '})', color: FG }],
      [{ text: '# Problema: a URL contém credenciais válidas', color: RED }],
      [{ text: '# Se vazar (logs, telemetria, browser history),', color: RED }],
      [{ text: '# qualquer um faz upload/download por 7 dias.', color: RED }],
    ],
    right: [
      [{ text: '# TTL curto + endpoint de geração sob demanda:', color: FGMUTE }],
      [{ text: 'getSignedUrl(s3, command, {', color: GRN }],
      [{ text: '  expiresIn: 900  // 15 minutos', color: GRN }],
      [{ text: '})', color: GRN }],
      [{ text: '# Se o usuário precisa "manter" acesso, gere nova URL.', color: GRN }],
      [{ text: '# Combine com IAM condition: aws:UserAgent, aws:SourceIp', color: GRN }],
      [{ text: '# para limitar onde a URL pode ser usada.', color: GRN }],
    ],
    why: 'Pre-signed URLs incorporam credenciais válidas. Quanto maior o TTL, maior a janela de comprometimento se a URL vazar (logs do CDN, histórico do browser, telemetria). Use 5–15 min para uploads, 1h para downloads. Se o usuário precisa de mais tempo, peça uma URL nova.',
  },
  {
    title: 'Uploads multipart abandonados — custo oculto que nunca aparece no console',
    wrong: [
      [{ text: '# Sua aplicação inicia multipart upload mas falha:', color: FGMUTE }],
      [{ text: 'aws s3api create-multipart-upload \\', color: FG }],
      [{ text: '  --bucket prod --key big-video.mp4', color: FG }],
      [{ text: '# Cliente cai antes de complete-multipart-upload', color: RED }],
      [{ text: '# As partes (até 5 GB cada) ficam armazenadas', color: RED }],
      [{ text: '# Não aparecem em ListObjects — você não vê o custo', color: RED }],
    ],
    right: [
      [{ text: '# Lifecycle aborta multipart abandonados:', color: FGMUTE }],
      [{ text: '{', color: FG }],
      [{ text: '  "ID": "AbortAbandonedUploads",', color: GRN }],
      [{ text: '  "Status": "Enabled",', color: GRN }],
      [{ text: '  "AbortIncompleteMultipartUpload": {', color: GRN }],
      [{ text: '    "DaysAfterInitiation": 7', color: GRN }],
      [{ text: '  }', color: GRN }],
      [{ text: '}', color: FG }],
      [{ text: '# Lista uploads pendentes para auditar:', color: FGMUTE }],
      [{ text: 'aws s3api list-multipart-uploads --bucket prod', color: GRN }],
    ],
    why: 'Partes de multipart upload abandonadas continuam ocupando storage cobrado, mas não aparecem no ListObjects nem no console default — só em ListMultipartUploads. Empresas descobrem GB ou TB de "lixo invisível" depois de meses. Configure AbortIncompleteMultipartUpload em TODO lifecycle policy.',
  },
  {
    title: 'CRR sem replicar delete markers — replicação que não protege',
    wrong: [
      [{ text: '# Cross-Region Replication ativada:', color: FGMUTE }],
      [{ text: '{', color: FG }],
      [{ text: '  "Rules": [{', color: FG }],
      [{ text: '    "Status": "Enabled",', color: FG }],
      [{ text: '    "Destination": { "Bucket": "arn:aws:s3:::dr-bucket" }', color: FG }],
      [{ text: '    // Delete markers NÃO são replicados por padrão', color: RED }],
      [{ text: '  }]', color: FG }],
      [{ text: '}', color: FG }],
      [{ text: '# Se ransomware deletar tudo na origem,', color: RED }],
      [{ text: '# a réplica continua com os dados — bom.', color: RED }],
      [{ text: '# Mas se você ATIVAR replicação de delete markers,', color: RED }],
      [{ text: '# o ransomware deleta tudo nos DOIS buckets.', color: RED }],
    ],
    right: [
      [{ text: '# Decisão consciente:', color: FGMUTE }],
      [{ text: '# DR contra falha regional → replicar delete markers', color: GRN }],
      [{ text: '# Proteção contra ransomware → NÃO replicar', color: GRN }],
      [{ text: '#                              + Object Lock no destino', color: GRN }],
      [{ text: '', color: FG }],
      [{ text: '"DeleteMarkerReplication": { "Status": "Disabled" },', color: GRN }],
      [{ text: '# Combinado com bucket destino com Object Lock Compliance:', color: FGMUTE }],
      [{ text: '# nem o root da conta consegue apagar.', color: GRN }],
    ],
    why: 'CRR não é backup — é cópia. Se você replica delete markers, um ransomware que apaga a origem apaga a réplica. Se não replica, a réplica fica como backup imutável. Para proteção máxima: bucket destino com Object Lock em modo Compliance — ninguém apaga, nem o root.',
  },
  {
    title: 'Listar bucket sem paginação — só pega os primeiros 1.000',
    wrong: [
      [{ text: '// Lista objetos com SDK:', color: FGMUTE }],
      [{ text: 'const resp = await s3.send(new ListObjectsV2Command({', color: FG }],
      [{ text: '  Bucket: "prod"', color: FG }],
      [{ text: '}))', color: FG }],
      [{ text: '// resp.Contents tem no MÁXIMO 1.000 objetos', color: RED }],
      [{ text: '// Bucket com 10M de objetos? Você só processa 1.000.', color: RED }],
      [{ text: '// IsTruncated: true → existem mais, mas você ignorou.', color: RED }],
    ],
    right: [
      [{ text: '// Paginator do SDK v3 itera todas as páginas:', color: FGMUTE }],
      [{ text: 'import { paginateListObjectsV2 } from "@aws-sdk/client-s3"', color: GRN }],
      [{ text: '', color: FG }],
      [{ text: 'for await (const page of paginateListObjectsV2(', color: GRN }],
      [{ text: '  { client: s3 }, { Bucket: "prod" }', color: GRN }],
      [{ text: ')) {', color: GRN }],
      [{ text: '  for (const obj of page.Contents ?? []) {', color: GRN }],
      [{ text: '    process(obj.Key)', color: GRN }],
      [{ text: '  }', color: GRN }],
      [{ text: '}', color: GRN }],
    ],
    why: 'ListObjectsV2 retorna no máximo 1.000 objetos por chamada. Se IsTruncated=true, você precisa fazer nova chamada com NextContinuationToken. O paginator do SDK v3 abstrai isso. Em buckets com milhões de objetos, esquecer paginação significa processar 0,01% e achar que terminou.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// Componente principal
// ═══════════════════════════════════════════════════════════════════════════════

export default function S3Visuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'storage-classes',
      title: 'Storage Classes',
      subtitle: 'As 6 classes lado a lado: custo, latência, retrieval e duração mínima',
      accent: C,
      component: (
        <ComparisonTable
          options={STORAGE_OPTIONS}
          criteria={STORAGE_CRITERIA}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'qual-classe',
      title: 'Qual classe usar?',
      subtitle: 'Árvore de decisão: padrão de acesso → tempo de retenção → recomendação',
      accent: AMB,
      component: (
        <DecisionTree
          root={STORAGE_DT_ROOT}
          nodes={STORAGE_DT_NODES}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'lifecycle',
      title: 'Lifecycle de objeto',
      subtitle: 'Como um objeto transita entre classes ao longo do tempo via lifecycle policy',
      accent: GRN,
      component: (
        <StateMachineExplorer
          states={LIFECYCLE_STATES}
          transitions={LIFECYCLE_TRANSITIONS}
          initialState="std"
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'pre-signed-flow',
      title: 'Pre-signed URL — fluxo completo',
      subtitle: 'Browser, Backend, IAM, S3 e Lambda no upload direto sem expor credenciais',
      accent: PUR,
      component: (
        <SequenceDiagram
          actors={PRESIGN_ACTORS}
          messages={PRESIGN_MESSAGES}
          groups={PRESIGN_GROUPS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'security-layers',
      title: 'Camadas de segurança',
      subtitle: 'Defesa em profundidade: Block Public Access → Bucket Policy → IAM → Encrypt → Audit',
      accent: RED,
      component: (
        <LayerStack
          layers={SECURITY_LAYERS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'encryption',
      title: 'Modos de criptografia',
      subtitle: 'SSE-S3, SSE-KMS, SSE-C e client-side — quando usar e quando não usar cada um',
      accent: GRN,
      component: (
        <CardCarousel
          cards={ENCRYPTION_CARDS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns',
      subtitle: 'Os 6 erros mais destrutivos em projetos S3 reais — código errado vs código correto',
      accent: RED,
      component: (
        <AntiPatternsGallery
          patterns={S3_ANTIPATTERNS}
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
