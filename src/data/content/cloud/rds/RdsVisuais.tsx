'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'

// ── Paleta RDS (AWS blue-purple) ─────────────────────────────────────────────
const C      = '#3b48cc'   // AWS RDS blue-purple
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'

void LINE; void FG; void FGMUTE

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Multi-AZ vs Read Replica vs Aurora (ComparisonTable)
// Ensina: comparar os 3 modos simultaneamente em múltiplas dimensões é impossível
//         de fazer com clareza em texto corrido
// ═══════════════════════════════════════════════════════════════════════════════

const HA_OPTIONS: ComparisonOption[] = [
  { id: 'multiaz', label: 'Multi-AZ', sublabel: 'Alta Disponibilidade', color: '#3b82f6' },
  { id: 'replica', label: 'Read Replica', sublabel: 'Escala de Leitura', color: '#10b981' },
  { id: 'aurora', label: 'Aurora', sublabel: 'Storage Distribuído', color: C },
]

const HA_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'replication',
    label: 'Tipo de replicação',
    values: {
      multiaz: { rating: 'excellent', note: 'Síncrona — escrita confirmada em 2 AZs' },
      replica: { rating: 'good', note: 'Assíncrona — pode ter lag em segundos' },
      aurora: { rating: 'excellent', note: '6 cópias em 3 AZs, quorum 4/6' },
    },
  },
  {
    id: 'reads',
    label: 'Serve leituras?',
    values: {
      multiaz: { rating: 'poor', note: 'Standby NÃO serve leituras — só failover' },
      replica: { rating: 'excellent', note: 'Endpoint próprio para SELECTs' },
      aurora: { rating: 'excellent', note: 'Até 15 réplicas, lag < 100 ms' },
    },
  },
  {
    id: 'failover',
    label: 'Tempo de failover',
    values: {
      multiaz: { rating: 'good', note: '30–60 s, DNS atualizado automaticamente' },
      replica: { rating: 'fair', note: 'Promoção manual, alguns minutos' },
      aurora: { rating: 'excellent', note: '< 30 s, storage compartilhado' },
    },
  },
  {
    id: 'cost',
    label: 'Custo',
    values: {
      multiaz: { rating: 'fair', note: '~2× a instância primária' },
      replica: { rating: 'fair', note: 'Instância + storage por réplica' },
      aurora: { rating: 'fair', note: '~20% maior que RDS padrão' },
    },
  },
  {
    id: 'max-replicas',
    label: 'Máx. réplicas',
    values: {
      multiaz: { rating: 'poor', note: '1 standby (não lê)' },
      replica: { rating: 'good', note: 'RDS: 5 réplicas' },
      aurora: { rating: 'excellent', note: 'Até 15 réplicas' },
    },
  },
  {
    id: 'storage',
    label: 'Max. storage',
    values: {
      multiaz: { rating: 'good', note: 'RDS: 64 TiB (gp3/io2)' },
      replica: { rating: 'good', note: 'Mesmo da primary' },
      aurora: { rating: 'excellent', note: '128 TiB, crescimento automático' },
    },
  },
  {
    id: 'serverless',
    label: 'Serverless / autoscaling',
    values: {
      multiaz: { rating: 'na', note: 'N/A' },
      replica: { rating: 'na', note: 'N/A' },
      aurora: { rating: 'excellent', note: 'Serverless v2: 0,5–128 ACUs sem downtime' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Backup e estratégias de recovery (LayerStack)
// Ensina: a hierarquia de controles de backup e quando cada um se aplica
// ═══════════════════════════════════════════════════════════════════════════════

const BACKUP_LAYERS: Layer[] = [
  {
    id: 'snapshot-manual',
    label: 'Snapshot Manual',
    sublabel: 'Retenção indefinida até deletar',
    color: '#3b82f6',
    description: 'Criado sob demanda via console ou CLI. Retido indefinidamente — sem custo após o período de retenção incluído. Útil antes de migrações, upgrades de engine ou schema changes arriscados.',
    examples: [
      'aws rds create-db-snapshot --db-instance-identifier mydb --db-snapshot-identifier pre-migration',
      'Copiável cross-region para DR',
      'Compartilhável com outras contas AWS',
      'Restaurar cria NOVA instância com NOVO endpoint',
    ],
  },
  {
    id: 'automated-backup',
    label: 'Automated Backup',
    sublabel: 'Retenção 1–35 dias, pré-requisito para PITR',
    color: '#10b981',
    description: 'RDS tira snapshot diário na janela de manutenção e armazena transaction logs continuamente. Habilita o PITR. Custo: storage gratuito até o tamanho da instância.',
    examples: [
      'Janela configurável (madrugada, baixo tráfego)',
      'Retenção padrão recomendada: 7–14 dias',
      '35 dias apenas se compliance exigir (custo proporcional)',
      'Obrigatório para habilitar PITR',
    ],
  },
  {
    id: 'pitr',
    label: 'PITR (Point-in-Time Recovery)',
    sublabel: 'Qualquer segundo dentro do período de retenção',
    color: '#a78bfa',
    description: 'Usa automated backup + transaction logs para reconstruir o banco em qualquer segundo. Indispensável para recuperar deletes acidentais ou corrupção de dados.',
    examples: [
      'Granularidade: qualquer segundo do período de retenção',
      'aws rds restore-db-instance-to-point-in-time',
      'Restaurar cria NOVA instância — não in-place',
      'Planejar atualização de DNS (Route 53) ou connection string',
    ],
  },
  {
    id: 'blue-green',
    label: 'Blue/Green Deployment',
    sublabel: 'Upgrade de engine com downtime < 1 min',
    color: C,
    description: 'Cria cópia Green sincronizada via replicação lógica. Aplica mudanças no Green enquanto Blue serve produção. Switchover com < 1 min de downtime e rollback disponível.',
    examples: [
      'Upgrade de engine major (PostgreSQL 15 → 16)',
      'Schema changes de alto risco',
      'Switchover: DNS aponta para Green',
      'Blue permanece como rollback até deletar explicitamente',
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Decision tree: qual tipo de storage/instância?
// Ensina: a decisão entre gp3, io2, Aurora, Multi-AZ tem muitas dimensões
// ═══════════════════════════════════════════════════════════════════════════════

const STORAGE_ROOT: DTNode = {
  id: 'root',
  question: 'Qual é o principal requisito do workload?',
  children: [
    { label: 'Alta disponibilidade (HA) e failover automático', nodeId: 'ha', color: '#3b82f6' },
    { label: 'Escalar leituras — muitos SELECTs', nodeId: 'reads', color: '#10b981' },
    { label: 'IOPS muito altos (OLTP intensivo)', nodeId: 'iops', color: '#ef4444' },
    { label: 'Workload variável / imprevisível', nodeId: 'variable', color: C },
  ],
}

const STORAGE_NODES: Record<string, DTNode> = {
  ha: {
    id: 'ha',
    question: 'Qual o SLA de failover necessário?',
    children: [
      { label: 'Failover < 60 s (padrão produção)', nodeId: 'ha-multiaz', color: '#3b82f6' },
      { label: 'Failover < 30 s (missão crítica)', nodeId: 'ha-aurora', color: C },
    ],
  },
  'ha-multiaz': {
    id: 'ha-multiaz',
    recommendation: 'RDS Multi-AZ com gp3',
    detail: 'Multi-AZ: standby síncrono em outra AZ, failover automático em 30–60 s. gp3: até 16.000 IOPS e 1.000 MB/s configuráveis independentemente do tamanho. Padrão para a maioria das aplicações de produção.',
    color: '#3b82f6',
    icon: '✅',
  },
  'ha-aurora': {
    id: 'ha-aurora',
    recommendation: 'Aurora Multi-AZ',
    detail: 'Aurora tem failover < 30 s pois o storage já está replicado em 6 cópias — não precisa copiar dados. Adicionar replica leitora em outra AZ dá HA + leitura distribuída.',
    color: C,
    icon: '✅',
  },
  reads: {
    id: 'reads',
    question: 'Quantas réplicas de leitura precisa?',
    children: [
      { label: 'Até 5 réplicas (uso normal)', nodeId: 'reads-rds', color: '#10b981' },
      { label: '6–15 réplicas / lag crítico', nodeId: 'reads-aurora', color: C },
    ],
  },
  'reads-rds': {
    id: 'reads-rds',
    recommendation: 'RDS + Read Replicas (até 5)',
    detail: 'Read Replicas assíncronas com endpoint próprio. Lag de segundos sob carga alta de escrita. Adequado para dashboards, relatórios, analytics que toleram dados levemente defasados.',
    color: '#10b981',
    icon: '✅',
  },
  'reads-aurora': {
    id: 'reads-aurora',
    recommendation: 'Aurora com múltiplas réplicas',
    detail: 'Aurora suporta até 15 réplicas com lag < 100 ms (storage compartilhado — réplicas leem do mesmo armazenamento físico). Adicionar réplica é instantâneo, sem copiar dados.',
    color: C,
    icon: '✅',
  },
  iops: {
    id: 'iops',
    question: 'Quantos IOPS são necessários?',
    children: [
      { label: 'Até 16.000 IOPS', nodeId: 'iops-gp3', color: '#f59e0b' },
      { label: 'Acima de 16.000 IOPS', nodeId: 'iops-io2', color: '#ef4444' },
    ],
  },
  'iops-gp3': {
    id: 'iops-gp3',
    recommendation: 'gp3 com IOPS provisionados',
    detail: 'gp3: configure IOPS (até 16.000) e throughput (até 1.000 MB/s) independentemente do tamanho do volume. 20% mais barato que gp2 com flexibilidade superior.',
    color: '#f59e0b',
    icon: '✅',
  },
  'iops-io2': {
    id: 'iops-io2',
    recommendation: 'io2 Block Express',
    detail: 'io2: até 256.000 IOPS para workloads OLTP intensivos (ERP, core banking, trading). Latência sub-milissegundo consistente. Custo significativamente maior — calcular o break-even.',
    color: '#ef4444',
    icon: '✅',
  },
  variable: {
    id: 'variable',
    recommendation: 'Aurora Serverless v2',
    detail: 'Escala de 0,5 a 128 ACUs (Aurora Capacity Units) sem downtime, em incrementos finos. Ideal para ambientes de dev/staging, SaaS multi-tenant, aplicações novas sem baseline definido. Custo por ACU-hora.',
    color: C,
    icon: '✅',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Anti-patterns RDS (AntiPatternsGallery)
// Ensina: os erros de produção mais comuns ficam claros com diff errado × certo
// ═══════════════════════════════════════════════════════════════════════════════

const RDS_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'Lambda sem RDS Proxy — conexão direta ao banco',
    wrong: [
      [{ text: '// 200 Lambdas simultâneas = 200 conexões no banco', color: '#ef4444' }],
      [{ text: 'export async function handler(event) {', color: '#e2e8f0' }],
      [{ text: '  // ❌ abre conexão a cada invocação', color: '#ef4444' }],
      [{ text: '  const client = new Client({ host: process.env.DB_HOST })', color: '#ef4444' }],
      [{ text: '  await client.connect()', color: '#ef4444' }],
      [{ text: '  const result = await client.query("SELECT ...")', color: '#e2e8f0' }],
      [{ text: '  await client.end() // max_connections saturado!', color: '#ef4444' }],
      [{ text: '}', color: '#e2e8f0' }],
    ],
    right: [
      [{ text: '// RDS Proxy: 200 Lambdas → pool de 10–20 conexões reais', color: '#4ade80' }],
      [{ text: '// Configurar endpoint do Proxy no env var', color: '#4ade80' }],
      [{ text: 'export async function handler(event) {', color: '#e2e8f0' }],
      [{ text: '  // ✅ Proxy reutiliza conexão do pool', color: '#4ade80' }],
      [{ text: '  const client = new Client({ host: process.env.PROXY_HOST })', color: '#4ade80' }],
      [{ text: '  await client.connect()', color: '#e2e8f0' }],
      [{ text: '  const result = await client.query("SELECT ...")', color: '#e2e8f0' }],
      [{ text: '  await client.end() // Proxy mantém conexão no pool', color: '#4ade80' }],
      [{ text: '}', color: '#e2e8f0' }],
    ],
    why: 'Cada invocação Lambda abre e fecha conexão diretamente. Com 200 simultâneas, o max_connections satura. RDS Proxy multiplexa centenas de clientes em poucas conexões reais.',
  },
  {
    title: 'Confundir Multi-AZ com Read Replica para escala',
    wrong: [
      [{ text: '// ❌ Tentar ler do standby Multi-AZ — não existe endpoint', color: '#ef4444' }],
      [{ text: '// O standby NÃO tem endpoint de leitura', color: '#ef4444' }],
      [{ text: 'const readConn = new Client({', color: '#e2e8f0' }],
      [{ text: '  // usando o mesmo endpoint do primary (standby não é acessível)', color: '#ef4444' }],
      [{ text: '  host: process.env.MULTI_AZ_ENDPOINT', color: '#ef4444' }],
      [{ text: '})', color: '#e2e8f0' }],
      [{ text: '// Multi-AZ é para HA — o standby NÃO serve leituras', color: '#ef4444' }],
    ],
    right: [
      [{ text: '// ✅ Read Replica tem endpoint próprio para leituras', color: '#4ade80' }],
      [{ text: 'const writeConn = new Client({', color: '#e2e8f0' }],
      [{ text: '  host: process.env.PRIMARY_ENDPOINT  // escrita', color: '#4ade80' }],
      [{ text: '})', color: '#e2e8f0' }],
      [{ text: 'const readConn = new Client({', color: '#e2e8f0' }],
      [{ text: '  host: process.env.REPLICA_ENDPOINT  // leitura', color: '#4ade80' }],
      [{ text: '})', color: '#e2e8f0' }],
      [{ text: '// Multi-AZ (HA) + Read Replica (escala) são complementares', color: '#4ade80' }],
    ],
    why: 'Multi-AZ serve apenas para HA (failover). O standby não tem endpoint público. Read Replicas têm endpoints próprios para distribuir carga de leitura. São complementares, não alternativos.',
  },
  {
    title: 'Storage autoscaling sem alarme de crescimento',
    wrong: [
      [{ text: '# Terraform — storage autoscaling habilitado sem alarme', color: '#ef4444' }],
      [{ text: 'resource "aws_db_instance" "main" {', color: '#e2e8f0' }],
      [{ text: '  allocated_storage     = 100', color: '#e2e8f0' }],
      [{ text: '  max_allocated_storage = 1000  # ❌ sem alarme', color: '#ef4444' }],
      [{ text: '  # Bug de insert loop: banco cresce 900 GiB pagando forever', color: '#ef4444' }],
      [{ text: '  # Storage só cresce, nunca diminui automaticamente', color: '#ef4444' }],
      [{ text: '}', color: '#e2e8f0' }],
    ],
    right: [
      [{ text: '# ✅ Autoscaling + alarme de FreeStorageSpace', color: '#4ade80' }],
      [{ text: 'resource "aws_db_instance" "main" {', color: '#e2e8f0' }],
      [{ text: '  allocated_storage     = 100', color: '#e2e8f0' }],
      [{ text: '  max_allocated_storage = 500', color: '#4ade80' }],
      [{ text: '}', color: '#e2e8f0' }],
      [{ text: 'resource "aws_cloudwatch_metric_alarm" "rds_storage" {', color: '#4ade80' }],
      [{ text: '  alarm_name  = "rds-free-storage-low"', color: '#4ade80' }],
      [{ text: '  metric_name = "FreeStorageSpace"', color: '#4ade80' }],
      [{ text: '  threshold   = 20000000000  # 20 GB (20% de 100 GB)', color: '#4ade80' }],
      [{ text: '}', color: '#4ade80' }],
    ],
    why: 'Storage autoscaling só cresce — nunca diminui. Um bug de insert acumula dados até o limite máximo e você paga para sempre. Alarme de FreeStorageSpace < 20% permite investigar antes do autoscaling entrar.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export default function RdsVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'ha-comparison',
      title: 'Multi-AZ vs Replica vs Aurora',
      subtitle: 'Quando usar cada abordagem de HA e escala de leitura',
      accent: C,
      component: (
        <ComparisonTable
          options={HA_OPTIONS}
          criteria={HA_CRITERIA}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'backup-layers',
      title: 'Estratégias de Backup e Recovery',
      subtitle: 'Snapshot manual, automated backup, PITR e blue/green — quando usar cada um',
      accent: C,
      component: (
        <LayerStack
          layers={BACKUP_LAYERS}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          direction="top-down"
        />
      ),
    },
    {
      id: 'storage-decision',
      title: 'Qual engine e storage usar?',
      subtitle: 'Árvore de decisão: gp3, io2, Multi-AZ, Aurora ou Serverless',
      accent: C,
      component: (
        <DecisionTree
          root={STORAGE_ROOT}
          nodes={STORAGE_NODES}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'rds-antipatterns',
      title: 'Anti-patterns RDS',
      subtitle: 'Os 3 erros mais comuns que causam incidents de produção',
      accent: C,
      component: (
        <AntiPatternsGallery
          patterns={RDS_ANTIPATTERNS}
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
