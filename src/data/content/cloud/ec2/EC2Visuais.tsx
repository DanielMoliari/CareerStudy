'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { StateMachineExplorer } from '@/components/visuals/StateMachineExplorer'
import type { SMState, SMTransition } from '@/components/visuals/StateMachineExplorer'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { SequenceDiagram } from '@/components/visuals/SequenceDiagram'
import type { SeqActor, SeqMessage, SeqGroup } from '@/components/visuals/SequenceDiagram'

// ── Paleta EC2 (AWS) ──────────────────────────────────────────────────────────
const C      = '#FF9900'   // AWS laranja
const SEC    = '#cc7a00'
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

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Instance Lifecycle (StateMachineExplorer)
// Justificativa: o ciclo de vida pending → running → stopping → stopped → terminated
// é a fonte de erros mais comuns ao iniciar com EC2 — clicar terminate achando que é
// stop destrói o EBS root. Ver os estados como nós clicáveis com transições é o que
// fixa a diferença em memória.
// ═══════════════════════════════════════════════════════════════════════════════

const LIFECYCLE_STATES: SMState[] = [
  { id: 'pending',       label: 'pending',       description: 'AWS aloca hardware, copia AMI, inicializa rede. User Data roda aqui via cloud-init. Ainda não cobra hora de CPU.',                                            color: AMB,  isInitial: true },
  { id: 'running',       label: 'running',       description: 'Instância ativa cobrando por hora. SSH disponível, IP atribuído, EBS montado, CloudWatch ativo. É o estado de operação normal.',                            color: GRN },
  { id: 'stopping',      label: 'stopping',      description: 'Estado transitório. OS recebe ACPI shutdown e processos encerram. Hardware é desalocado em seguida.',                                                          color: FGMUTE },
  { id: 'stopped',       label: 'stopped',       description: 'Sem hardware alocado, sem cobrança de CPU. EBS persiste (cobra GB/mês). IP público dinâmico é liberado. Elastic IP permanece (cobra se não associado).',     color: SKY },
  { id: 'shutting-down', label: 'shutting-down', description: 'Estado transitório antes de terminated. EBS root é deletado se DeleteOnTermination=true (padrão). EBS extras permanecem até deletar manualmente.',           color: RED },
  { id: 'terminated',    label: 'terminated',    description: 'Instância destruída permanentemente. Visível por aproximadamente 1 hora no console. Sem cobrança. Irreversível — ative Termination Protection em produção.', color: RED, isFinal: true },
  { id: 'rebooting',     label: 'rebooting',     description: 'Reinicialização rápida sem desalocar hardware. Mais rápido que stop+start. Não muda IP público. Útil para aplicar patches de OS.',                            color: PRP },
  { id: 'hibernating',   label: 'hibernating',   description: 'Salva conteúdo da RAM no EBS root (criptografado obrigatório) e para a instância. Restauração rápida — preserva estado de aplicação em memória.',           color: '#60a5fa' },
]

const LIFECYCLE_TRANSITIONS: SMTransition[] = [
  { from: 'pending',       to: 'running',       event: 'boot completo',      code: 'aws ec2 run-instances --image-id ami-xxx' },
  { from: 'running',       to: 'stopping',      event: 'stop',                code: 'aws ec2 stop-instances --instance-ids i-xxx' },
  { from: 'stopping',      to: 'stopped',       event: 'shutdown OK' },
  { from: 'stopped',       to: 'pending',       event: 'start',               code: 'aws ec2 start-instances --instance-ids i-xxx' },
  { from: 'running',       to: 'shutting-down', event: 'terminate',           code: 'aws ec2 terminate-instances --instance-ids i-xxx' },
  { from: 'stopped',       to: 'shutting-down', event: 'terminate' },
  { from: 'shutting-down', to: 'terminated',    event: 'destruido' },
  { from: 'running',       to: 'rebooting',     event: 'reboot',              code: 'aws ec2 reboot-instances --instance-ids i-xxx' },
  { from: 'rebooting',     to: 'running',       event: 'reboot OK' },
  { from: 'running',       to: 'hibernating',   event: 'hibernate',           code: 'aws ec2 stop-instances --hibernate' },
  { from: 'hibernating',   to: 'stopped',       event: 'RAM salva' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Famílias de instância (custom interactive explorer)
// Justificativa: cada família tem proporção CPU/RAM, geração e workload alvo —
// 7 famílias × 4 atributos é difícil em texto. Explorer interativo permite ver
// relação visual entre proporção de CPU/RAM e o tipo de workload.
// ═══════════════════════════════════════════════════════════════════════════════

const FAMILIES = [
  {
    id: 't',
    name: 'T-série',
    full: 't3 / t4g',
    color: AMB,
    icon: 'T',
    ratio: 'Burstable',
    cpuRatio: 1,
    ramRatio: 4,
    examples: ['t3.micro', 't3.small', 't4g.medium'],
    workloads: ['Dev e teste', 'Sites de baixo tráfego', 'Microserviços esporádicos', 'Bastion hosts'],
    cost: 'Mais barato',
    note: 'Acumula créditos de CPU em ociosidade. Quando precisa de burst, gasta créditos. Sem créditos = 5–30% de baseline.',
  },
  {
    id: 'm',
    name: 'M-série',
    full: 'm6i / m7i / m7g',
    color: C,
    icon: 'M',
    ratio: 'Balanced',
    cpuRatio: 1,
    ramRatio: 4,
    examples: ['m7i.large', 'm6i.xlarge', 'm7g.2xlarge'],
    workloads: ['APIs REST', 'Backends de uso geral', 'Servidores de aplicação', 'Bancos de dados pequenos'],
    cost: 'Custo médio',
    note: 'Padrão para a maioria das aplicações. Comece aqui e migre para c-série ou r-série conforme o gargalo.',
  },
  {
    id: 'c',
    name: 'C-série',
    full: 'c6i / c7i / c7g',
    color: SKY,
    icon: 'C',
    ratio: 'CPU intensivo',
    cpuRatio: 1,
    ramRatio: 2,
    examples: ['c7i.xlarge', 'c6i.2xlarge', 'c7g.4xlarge'],
    workloads: ['Encoding de vídeo', 'Compilação', 'Modelos matemáticos', 'Batch CPU-bound'],
    cost: 'Custo médio',
    note: 'Mais vCPU por GB de RAM. Melhor performance por vCPU da AWS. Use para qualquer coisa que satura CPU.',
  },
  {
    id: 'r',
    name: 'R-série',
    full: 'r6i / r7i / r7g',
    color: PRP,
    icon: 'R',
    ratio: 'Memory optimized',
    cpuRatio: 1,
    ramRatio: 8,
    examples: ['r7i.large', 'r6i.2xlarge', 'r7g.4xlarge'],
    workloads: ['Redis em EC2', 'Caches in-memory', 'Análise de dados em RAM', 'Bancos de dados in-memory'],
    cost: 'Custo alto',
    note: '8 GB de RAM por vCPU. Quando o workload precisa de muita memória mas pouca CPU.',
  },
  {
    id: 'i',
    name: 'I-série',
    full: 'i3 / i4i',
    color: GRN,
    icon: 'I',
    ratio: 'Storage optimized',
    cpuRatio: 1,
    ramRatio: 6,
    examples: ['i3.xlarge', 'i4i.2xlarge'],
    workloads: ['Cassandra', 'Elasticsearch', 'MongoDB', 'Buffers de alta escrita'],
    cost: 'Custo alto',
    note: 'NVMe local soldado fisicamente. IOPS e throughput máximos da AWS. Atenção: storage é efêmero — perde no stop.',
  },
  {
    id: 'g',
    name: 'G-série',
    full: 'g4dn / g5',
    color: '#ec4899',
    icon: 'G',
    ratio: 'GPU gráfica',
    cpuRatio: 1,
    ramRatio: 4,
    examples: ['g4dn.xlarge', 'g5.2xlarge'],
    workloads: ['Inferência ML', 'Rendering 3D', 'Streaming de jogos', 'CAD/CAM'],
    cost: 'Custo muito alto',
    note: 'NVIDIA T4 (g4dn) ou A10G (g5). Otimizada para inferência e gráficos, não para treinamento pesado.',
  },
  {
    id: 'p',
    name: 'P-série',
    full: 'p3 / p4 / p5',
    color: RED,
    icon: 'P',
    ratio: 'GPU HPC',
    cpuRatio: 1,
    ramRatio: 8,
    examples: ['p3.2xlarge', 'p4d.24xlarge'],
    workloads: ['Treinamento ML', 'Deep learning', 'HPC científico', 'Simulações em larga escala'],
    cost: 'Custo extremo',
    note: 'NVIDIA V100 (p3), A100 (p4) ou H100 (p5). Para treinamento de modelos grandes. Considere Spot para reduzir custo.',
  },
]

function FamilyExplorer() {
  const [sel, setSel] = useState<string>('m')
  const active = FAMILIES.find(f => f.id === sel)!

  return (
    <div style={{ background: BG, border: `1px solid ${LINE}`, borderRadius: 14, padding: 24, fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ marginBottom: 18 }}>
        <h3 style={{ color: FG, margin: 0, fontSize: 16, fontWeight: 800 }}>Famílias de instância EC2</h3>
        <p style={{ color: FGMUTE, fontSize: 12, margin: '4px 0 0' }}>Clique em uma família para ver workloads, exemplos e proporção CPU/RAM.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginBottom: 18 }}>
        {FAMILIES.map(f => {
          const isSel = f.id === sel
          return (
            <button
              key={f.id}
              onClick={() => setSel(f.id)}
              style={{
                background: isSel ? `${f.color}25` : CARD,
                border: `2px solid ${isSel ? f.color : LINE}`,
                borderRadius: 10,
                padding: '12px 8px',
                cursor: 'pointer',
                transition: 'all .2s',
                fontFamily: 'inherit',
                color: isSel ? f.color : FG,
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>{f.icon}</div>
              <div style={{ fontSize: 9, color: isSel ? f.color : FGMUTE, fontWeight: 700, letterSpacing: '.05em' }}>{f.name}</div>
            </button>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Detalhe da família */}
        <div style={{
          background: CARD,
          border: `2px solid ${active.color}50`,
          borderRadius: 12,
          padding: 18,
          boxShadow: `0 0 30px ${active.color}10`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 10,
              background: `${active.color}25`,
              border: `2px solid ${active.color}`,
              color: active.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, fontWeight: 900,
            }}>
              {active.icon}
            </div>
            <div>
              <div style={{ color: active.color, fontSize: 16, fontWeight: 800 }}>{active.name}</div>
              <div style={{ color: FGMUTE, fontSize: 11 }}>{active.full} — {active.ratio}</div>
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ color: active.color, fontSize: 9, letterSpacing: '.15em', fontWeight: 700, marginBottom: 6 }}>PROPORCAO CPU / RAM</div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <div style={{ flex: active.cpuRatio, height: 28, background: `${active.color}40`, border: `1px solid ${active.color}`, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: FG, fontSize: 11, fontWeight: 700 }}>
                {active.cpuRatio} vCPU
              </div>
              <div style={{ color: FGMUTE, fontSize: 14 }}>:</div>
              <div style={{ flex: active.ramRatio, height: 28, background: `${SEC}30`, border: `1px solid ${SEC}`, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: FG, fontSize: 11, fontWeight: 700 }}>
                {active.ramRatio} GB RAM
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ color: active.color, fontSize: 9, letterSpacing: '.15em', fontWeight: 700, marginBottom: 6 }}>EXEMPLOS</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {active.examples.map(e => (
                <span key={e} style={{
                  background: BG,
                  border: `1px solid ${LINE}`,
                  borderRadius: 4,
                  padding: '4px 8px',
                  fontSize: 10,
                  color: FG,
                  fontFamily: "'JetBrains Mono', monospace",
                }}>{e}</span>
              ))}
            </div>
          </div>

          <div>
            <div style={{ color: active.color, fontSize: 9, letterSpacing: '.15em', fontWeight: 700, marginBottom: 6 }}>CUSTO RELATIVO</div>
            <div style={{ color: FG, fontSize: 12 }}>{active.cost}</div>
          </div>
        </div>

        {/* Workloads e nota */}
        <div style={{
          background: CARD2,
          border: `1px solid ${LINE}`,
          borderRadius: 12,
          padding: 18,
        }}>
          <div style={{ color: FG, fontSize: 9, letterSpacing: '.15em', fontWeight: 700, marginBottom: 8 }}>QUANDO USAR</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
            {active.workloads.map((w, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 10px',
                background: `${active.color}10`,
                borderLeft: `3px solid ${active.color}`,
                borderRadius: 4,
                color: FG,
                fontSize: 11.5,
              }}>
                <span style={{ color: active.color, fontWeight: 700 }}>{'>'}</span>
                {w}
              </div>
            ))}
          </div>
          <div style={{
            background: BG,
            border: `1px solid ${LINE}`,
            borderRadius: 6,
            padding: 12,
          }}>
            <div style={{ color: AMB, fontSize: 9, letterSpacing: '.15em', fontWeight: 700, marginBottom: 4 }}>OBSERVACAO</div>
            <div style={{ color: FGMUTE, fontSize: 11, lineHeight: 1.6 }}>{active.note}</div>
          </div>
        </div>
      </div>

      <div style={{
        marginTop: 16,
        background: CARD,
        border: `1px solid ${C}40`,
        borderRadius: 8,
        padding: '10px 14px',
        fontSize: 11,
        color: FGMUTE,
        lineHeight: 1.6,
      }}>
        <span style={{ color: C, fontWeight: 700 }}>Sufixo g (Graviton)</span> = ARM 64-bit da AWS. m7g, c7g, r7g — mesma performance, 20-40% mais barato. Use sempre que sua aplicação compilar para ARM.
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — EBS Storage Comparison (ComparisonTable)
// Justificativa: 5 tipos de EBS × 6 critérios. Decisao "qual disco usar" é
// frequente em entrevistas e em arquitetura. Tabela comparativa torna o
// trade-off de IOPS x throughput x custo x latencia visualmente óbvio.
// ═══════════════════════════════════════════════════════════════════════════════

const EBS_OPTIONS: ComparisonOption[] = [
  { id: 'gp3', label: 'gp3',     sublabel: 'SSD propósito geral',     color: C },
  { id: 'gp2', label: 'gp2',     sublabel: 'SSD legado',              color: FGMUTE },
  { id: 'io2', label: 'io2 BX',  sublabel: 'IOPS provisionadas',      color: PRP },
  { id: 'st1', label: 'st1',     sublabel: 'HDD throughput',          color: SKY },
  { id: 'sc1', label: 'sc1',     sublabel: 'HDD cold',                color: '#60a5fa' },
]

const EBS_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'iops', label: 'IOPS máximo', category: 'Performance',
    description: 'Operações de I/O por segundo suportadas',
    values: {
      gp3: { rating: 'good',      note: 'Até 16.000 IOPS. Baseline 3.000 grátis.' },
      gp2: { rating: 'fair',      note: '3 IOPS por GB. Burst até 3.000 IOPS.' },
      io2: { rating: 'excellent', note: 'Até 256.000 IOPS com io2 Block Express.' },
      st1: { rating: 'poor',      note: 'Otimizado para throughput, não IOPS.' },
      sc1: { rating: 'poor',      note: 'IOPS muito baixo. Não use para banco.' },
    },
  },
  {
    id: 'throughput', label: 'Throughput máximo', category: 'Performance',
    description: 'Transferência de dados em MB/s',
    values: {
      gp3: { rating: 'good',      note: 'Até 1.000 MB/s. Baseline 125 grátis.' },
      gp2: { rating: 'fair',      note: 'Até 250 MB/s.' },
      io2: { rating: 'excellent', note: 'Até 4.000 MB/s.' },
      st1: { rating: 'good',      note: 'Até 500 MB/s. Bom para sequencial.' },
      sc1: { rating: 'fair',      note: 'Até 250 MB/s.' },
    },
  },
  {
    id: 'latency', label: 'Latência', category: 'Performance',
    description: 'Tempo de resposta típico para uma operação',
    values: {
      gp3: { rating: 'excellent', note: 'Sub-milissegundo single-digit.' },
      gp2: { rating: 'good',      note: 'Single-digit milissegundo.' },
      io2: { rating: 'excellent', note: 'Sub-milissegundo garantido por SLA.' },
      st1: { rating: 'fair',      note: 'Milissegundos a dezenas de ms.' },
      sc1: { rating: 'poor',      note: 'Latência alta — disco mecânico cold.' },
    },
  },
  {
    id: 'cost', label: 'Custo por GB', category: 'Custo',
    description: 'Preço relativo por gigabyte armazenado',
    values: {
      gp3: { rating: 'good',      note: '$0.08/GB/mês. 20% mais barato que gp2.' },
      gp2: { rating: 'fair',      note: '$0.10/GB/mês.' },
      io2: { rating: 'poor',      note: '$0.125/GB + $0.065 por IOPS provisionada.' },
      st1: { rating: 'excellent', note: '$0.045/GB/mês.' },
      sc1: { rating: 'excellent', note: '$0.015/GB/mês — o mais barato.' },
    },
  },
  {
    id: 'durability', label: 'Durabilidade', category: 'Confiabilidade',
    description: 'Resistência a perda de dados',
    values: {
      gp3: { rating: 'good',      note: '99.8% – 99.9%.' },
      gp2: { rating: 'good',      note: '99.8% – 99.9%.' },
      io2: { rating: 'excellent', note: '99.999% — durabilidade enterprise.' },
      st1: { rating: 'good',      note: '99.8% – 99.9%.' },
      sc1: { rating: 'good',      note: '99.8% – 99.9%.' },
    },
  },
  {
    id: 'use', label: 'Caso de uso ideal', category: 'Decisão',
    description: 'Quando escolher este tipo',
    values: {
      gp3: { rating: 'good', note: 'Padrão para SO, apps, bancos pequenos a médios.' },
      gp2: { rating: 'fair', note: 'Não use em produção nova — migre para gp3.' },
      io2: { rating: 'good', note: 'Oracle, SQL Server, SAP HANA, bancos críticos.' },
      st1: { rating: 'good', note: 'Logs, big data sequencial, data warehouse.' },
      sc1: { rating: 'good', note: 'Backups, dados frios acessados raramente.' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Pricing Models DecisionTree
// Justificativa: a decisão On-Demand x Reserved x Savings x Spot é frequente em
// entrevistas. A árvore torna o raciocínio defensável e ensina a estrutura
// mental para responder "como reduziria custo de EC2?".
// ═══════════════════════════════════════════════════════════════════════════════

const PRICING_ROOT: DTNode = {
  id: 'root',
  question: 'Qual modelo de precificação EC2 escolher?',
  children: [
    { label: 'Workload tolera interrupção (2 min de aviso)?', nodeId: 'spot-q', color: GRN },
    { label: 'Carga estável com tipo fixo conhecido?', nodeId: 'reserved-q', color: PRP },
    { label: 'Carga estável mas tipo pode variar?', nodeId: 'savings-q', color: SKY },
    { label: 'Picos imprevisíveis ou uso esporádico?', nodeId: 'ondemand-q', color: AMB },
  ],
}

const PRICING_NODES: Record<string, DTNode> = {
  'spot-q': {
    id: 'spot-q',
    question: 'Você tem checkpoint ou estado pode ser perdido?',
    children: [
      { label: 'Sim, tem interrupt handler ou jobs idempotentes', nodeId: 'spot-yes', color: GRN },
      { label: 'Não, perda de estado seria problema', nodeId: 'mixed', color: AMB },
    ],
  },
  'spot-yes': {
    id: 'spot-yes',
    recommendation: 'Spot Instances',
    detail: 'Até 90% de desconto. Use para batch processing, CI/CD workers, ML training, rendering. Implemente SIGTERM handler que salva checkpoint (S3/DynamoDB) nos 2 minutos de aviso. Combine com diversidade de tipos (mixed instances policy) para aumentar disponibilidade.',
    color: GRN,
    icon: 'S',
  },
  mixed: {
    id: 'mixed',
    recommendation: 'Mixed Instances Policy (Spot + On-Demand)',
    detail: 'Defina base On-Demand (2-4 instâncias garantidas) e o restante em Spot. ASG com mixed_instances_policy garante que sempre exista capacidade mínima rodando, mesmo quando Spot é interrompido. Estratégia recomendada para a maioria das cargas resilientes.',
    color: AMB,
    icon: 'M',
  },
  'reserved-q': {
    id: 'reserved-q',
    question: 'Você consegue prever o tipo exato por 1-3 anos?',
    children: [
      { label: 'Sim, tipo travado em produção', nodeId: 'reserved-yes', color: PRP },
      { label: 'Não, posso querer trocar de família', nodeId: 'savings-flex', color: SKY },
    ],
  },
  'reserved-yes': {
    id: 'reserved-yes',
    recommendation: 'Reserved Instances (Standard, 1-3 anos)',
    detail: 'Até 72% de desconto. Compromisso com tipo, região, OS e tenancy específicos. All Upfront paga adiantado e tem desconto máximo. Use somente quando você tem certeza absoluta do tipo de instância pelos próximos 1-3 anos. Difícil de mudar depois.',
    color: PRP,
    icon: 'R',
  },
  'savings-flex': {
    id: 'savings-flex',
    recommendation: 'Compute Savings Plans',
    detail: 'Até 66% de desconto, mais flexível que Reserved. Você compromete um valor por hora (ex: $10/h por 1 ano) — esse desconto se aplica a qualquer instância EC2, Fargate ou Lambda. Pode trocar de família, região e OS livremente. Recomendado para a maioria das cargas baseline modernas.',
    color: SKY,
    icon: 'C',
  },
  'savings-q': {
    id: 'savings-q',
    recommendation: 'EC2 Instance Savings Plans',
    detail: 'Até 72% de desconto — quase igual a Reserved. Compromisso por família de instância e região, mas livre para trocar tamanho, OS e tenancy. Mais flexível que RI mas mais restrito que Compute Savings Plans. Bom meio-termo quando a família é estável mas o tamanho varia.',
    color: SKY,
    icon: 'I',
  },
  'ondemand-q': {
    id: 'ondemand-q',
    recommendation: 'On-Demand',
    detail: 'Sem desconto, sem compromisso. Cobra por hora ou por segundo (Linux). Use para picos imprevisíveis, dev e test, primeiros meses de produção até estabilizar baseline, ou quando o ambiente muda muito. Migre para Savings Plans quando o uso ficar previsível por mais de 1 mês.',
    color: AMB,
    icon: 'O',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Auto Scaling Architecture (custom flow)
// Justificativa: o fluxo CloudWatch alarm → ASG decisão → Launch Template → ALB
// health check é a base de elasticidade no AWS. Visualizar a sequência com
// ações simuladas é melhor que ler descrição linear.
// ═══════════════════════════════════════════════════════════════════════════════

type ASGScenario = {
  id: string
  label: string
  description: string
  trigger: string
  action: string
  detail: string
  color: string
  startInstances: number
  endInstances: number
}

const ASG_SCENARIOS: ASGScenario[] = [
  {
    id: 'scaleout',
    label: 'Scale-Out',
    description: 'Tráfego sobe — ASG provisiona instâncias',
    trigger: 'CPU > 60% por 2 min',
    action: 'Lança 1 nova instância',
    detail: 'CloudWatch publica métrica → alarme dispara → ASG consulta Launch Template → cria EC2 com user data → ALB health check (120s grace) → instância recebe tráfego.',
    color: GRN,
    startInstances: 2,
    endInstances: 3,
  },
  {
    id: 'scalein',
    label: 'Scale-In',
    description: 'Tráfego cai — ASG remove instâncias',
    trigger: 'CPU < 30% por 5 min',
    action: 'Termina 1 instância',
    detail: 'Alarme de baixa utilização dispara → ASG escolhe instância (mais antiga ou Spot interrompida) → ALB drena conexões (deregistration delay) → ASG terminate. Cooldown de 300s antes do próximo scale-in.',
    color: SKY,
    startInstances: 4,
    endInstances: 3,
  },
  {
    id: 'failure',
    label: 'Falha de instância',
    description: 'EC2 falha — ASG substitui automaticamente',
    trigger: 'ELB Health Check falha',
    action: 'Termina e cria substituta',
    detail: 'ALB detecta unhealthy via /health → desregistra → ASG marca como unhealthy → terminate → cria nova com mesmo Launch Template. Self-healing sem intervenção.',
    color: RED,
    startInstances: 3,
    endInstances: 3,
  },
  {
    id: 'refresh',
    label: 'Instance Refresh',
    description: 'Nova AMI — ASG troca instâncias gradualmente',
    trigger: 'aws autoscaling start-instance-refresh',
    action: 'Substitui instâncias em ondas',
    detail: 'ASG processa MinHealthyPercentage (ex: 90%) — cria nova instância com AMI atualizada, espera health check, termina antiga, repete. Zero downtime para deploys de imutável.',
    color: PRP,
    startInstances: 4,
    endInstances: 4,
  },
]

function ASGFlowVisual() {
  const [scenarioId, setScenarioId] = useState<string>('scaleout')
  const [phase, setPhase] = useState<'idle' | 'triggered' | 'acting' | 'done'>('idle')
  const scenario = ASG_SCENARIOS.find(s => s.id === scenarioId)!

  function play() {
    setPhase('triggered')
    setTimeout(() => setPhase('acting'), 1000)
    setTimeout(() => setPhase('done'), 2200)
  }

  function reset() {
    setPhase('idle')
  }

  const currentInstances = phase === 'done' ? scenario.endInstances : scenario.startInstances

  return (
    <div style={{ background: BG, border: `1px solid ${LINE}`, borderRadius: 14, padding: 24, fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ marginBottom: 18 }}>
        <h3 style={{ color: FG, margin: 0, fontSize: 16, fontWeight: 800 }}>Auto Scaling Group — fluxo de eventos</h3>
        <p style={{ color: FGMUTE, fontSize: 12, margin: '4px 0 0' }}>Selecione um cenário e clique em executar para ver o fluxo de scale-out, scale-in, recuperação e refresh.</p>
      </div>

      {/* Cenários */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
        {ASG_SCENARIOS.map(s => {
          const isSel = s.id === scenarioId
          return (
            <button
              key={s.id}
              onClick={() => { setScenarioId(s.id); reset() }}
              style={{
                background: isSel ? `${s.color}25` : CARD,
                border: `2px solid ${isSel ? s.color : LINE}`,
                borderRadius: 10,
                padding: '12px 14px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all .2s',
                fontFamily: 'inherit',
              }}
            >
              <div style={{ color: isSel ? s.color : FG, fontSize: 12, fontWeight: 700, marginBottom: 4 }}>{s.label}</div>
              <div style={{ color: FGMUTE, fontSize: 10, lineHeight: 1.4 }}>{s.description}</div>
            </button>
          )
        })}
      </div>

      {/* Fluxo */}
      <div style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 12, padding: 20, marginBottom: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', gap: 12, alignItems: 'center', marginBottom: 16 }}>
          {/* CloudWatch */}
          <div style={{
            background: BG, border: `2px solid ${phase === 'idle' ? LINE : (phase === 'triggered' ? scenario.color : LINE)}`,
            borderRadius: 8, padding: '12px 14px', textAlign: 'center',
            transition: 'all .3s',
            boxShadow: phase === 'triggered' ? `0 0 20px ${scenario.color}50` : 'none',
          }}>
            <div style={{ color: SKY, fontSize: 9, fontWeight: 700, letterSpacing: '.1em', marginBottom: 4 }}>CLOUDWATCH</div>
            <div style={{ color: FG, fontSize: 11, fontWeight: 600 }}>{scenario.trigger}</div>
          </div>

          <div style={{ color: phase !== 'idle' ? scenario.color : LINE, fontSize: 22, transition: 'color .3s' }}>{'→'}</div>

          {/* ASG */}
          <div style={{
            background: BG, border: `2px solid ${phase === 'acting' ? scenario.color : LINE}`,
            borderRadius: 8, padding: '12px 14px', textAlign: 'center',
            transition: 'all .3s',
            boxShadow: phase === 'acting' ? `0 0 20px ${scenario.color}50` : 'none',
          }}>
            <div style={{ color: C, fontSize: 9, fontWeight: 700, letterSpacing: '.1em', marginBottom: 4 }}>AUTO SCALING GROUP</div>
            <div style={{ color: FG, fontSize: 11, fontWeight: 600 }}>{scenario.action}</div>
          </div>

          <div style={{ color: phase === 'done' ? scenario.color : LINE, fontSize: 22, transition: 'color .3s' }}>{'→'}</div>

          {/* Instances */}
          <div style={{
            background: BG, border: `2px solid ${phase === 'done' ? scenario.color : LINE}`,
            borderRadius: 8, padding: '12px 14px', textAlign: 'center',
            transition: 'all .3s',
            boxShadow: phase === 'done' ? `0 0 20px ${scenario.color}50` : 'none',
          }}>
            <div style={{ color: GRN, fontSize: 9, fontWeight: 700, letterSpacing: '.1em', marginBottom: 4 }}>FROTA EC2</div>
            <div style={{ color: FG, fontSize: 16, fontWeight: 800 }}>
              {currentInstances} <span style={{ fontSize: 10, color: FGMUTE, fontWeight: 400 }}>instâncias</span>
            </div>
          </div>
        </div>

        {/* Visualização das instâncias */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 14, minHeight: 56 }}>
          {Array.from({ length: Math.max(scenario.startInstances, scenario.endInstances) }).map((_, i) => {
            const exists = i < currentInstances
            const isNew = phase === 'done' && scenario.id === 'scaleout' && i === scenario.endInstances - 1
            const isRemoved = phase === 'done' && scenario.id === 'scalein' && i >= scenario.endInstances
            const isReplaced = phase === 'acting' && scenario.id === 'failure' && i === 1
            return (
              <div
                key={i}
                style={{
                  width: 56, height: 56,
                  background: exists ? (isNew ? `${GRN}30` : `${C}20`) : 'transparent',
                  border: `2px ${isRemoved ? 'dashed' : 'solid'} ${isNew ? GRN : (isReplaced ? RED : (exists ? C : LINE))}`,
                  borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexDirection: 'column',
                  color: isNew ? GRN : (exists ? C : FGMUTE),
                  fontSize: 9,
                  fontWeight: 700,
                  opacity: isRemoved ? 0.3 : 1,
                  transition: 'all .4s',
                }}
              >
                <div style={{ fontSize: 16 }}>EC2</div>
                <div style={{ fontSize: 8, marginTop: 2 }}>#{i + 1}{isNew ? ' ✨' : ''}</div>
              </div>
            )
          })}
        </div>

        <div style={{
          background: BG,
          border: `1px solid ${scenario.color}40`,
          borderLeft: `3px solid ${scenario.color}`,
          borderRadius: 6,
          padding: '10px 14px',
          fontSize: 11,
          color: FGMUTE,
          lineHeight: 1.6,
        }}>
          <span style={{ color: scenario.color, fontWeight: 700, marginRight: 8 }}>{scenario.label}:</span>
          {scenario.detail}
        </div>
      </div>

      {/* Controles */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <button
          onClick={play}
          disabled={phase !== 'idle'}
          style={{
            background: phase === 'idle' ? scenario.color : LINE,
            color: phase === 'idle' ? '#000' : FGMUTE,
            border: 'none', borderRadius: 8,
            padding: '10px 22px',
            fontFamily: 'inherit', fontSize: 12, fontWeight: 700,
            cursor: phase === 'idle' ? 'pointer' : 'not-allowed',
            letterSpacing: '.05em',
          }}
        >
          {phase === 'idle' ? '▶ EXECUTAR' : phase === 'done' ? '✓ CONCLUIDO' : 'EXECUTANDO...'}
        </button>
        <button
          onClick={reset}
          style={{
            background: 'transparent', color: FG,
            border: `1px solid ${LINE}`, borderRadius: 8,
            padding: '10px 22px',
            fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          RESET
        </button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Placement Groups (custom spatial visualization)
// Justificativa: Cluster x Spread x Partition é um conceito espacial. Ver as
// instâncias em hardware fisicamente arranjado de formas diferentes torna óbvia
// a diferença que texto não consegue transmitir.
// ═══════════════════════════════════════════════════════════════════════════════

type PlacementGroup = {
  id: string
  name: string
  color: string
  description: string
  layout: 'cluster' | 'spread' | 'partition'
  useCase: string[]
  risk: string
}

const PLACEMENT_GROUPS: PlacementGroup[] = [
  {
    id: 'cluster',
    name: 'Cluster',
    color: GRN,
    description: 'Todas as instâncias no mesmo rack físico, conectadas por rede de 100 Gbps. Latência menor que 10 microssegundos entre nós.',
    layout: 'cluster',
    useCase: ['HPC e MPI', 'Bancos de dados distribuídos', 'Análise em tempo real', 'Aplicações que falam intensamente entre si'],
    risk: 'Falha do rack afeta todas as instâncias do grupo. Sem isolamento de hardware.',
  },
  {
    id: 'spread',
    name: 'Spread',
    color: SKY,
    description: 'Cada instância em rack distinto, máxima isolação. Limite de 7 instâncias por AZ.',
    layout: 'spread',
    useCase: ['Aplicações críticas com poucas instâncias', 'Cluster de banco de dados (Cassandra, MongoDB)', 'Failover ativo-passivo'],
    risk: 'Limite de 7 instâncias por AZ. Não escala para frotas grandes.',
  },
  {
    id: 'partition',
    name: 'Partition',
    color: PRP,
    description: 'Grupos isolados em hardware diferente, mas instâncias dentro do mesmo grupo compartilham hardware. Até 7 partições por AZ, sem limite de instâncias por partição.',
    layout: 'partition',
    useCase: ['Hadoop e HDFS', 'Cassandra com replicação por rack', 'Kafka com isolamento por partição', 'Sistemas distribuídos shardeados'],
    risk: 'Falha de uma partição afeta apenas o shard correspondente — outras partições continuam.',
  },
]

function PlacementGroupVisual() {
  const [sel, setSel] = useState<string>('cluster')
  const active = PLACEMENT_GROUPS.find(g => g.id === sel)!

  function renderLayout() {
    if (active.layout === 'cluster') {
      // Todos juntos em 1 rack
      return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
          <div style={{
            background: `${active.color}10`,
            border: `2px solid ${active.color}`,
            borderRadius: 10,
            padding: 16,
            display: 'inline-block',
          }}>
            <div style={{ color: active.color, fontSize: 9, fontWeight: 700, letterSpacing: '.1em', marginBottom: 8, textAlign: 'center' }}>RACK 1 — 100 Gbps interno</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{
                  width: 60, height: 50,
                  background: `${active.color}30`,
                  border: `1.5px solid ${active.color}`,
                  borderRadius: 5,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: active.color, fontSize: 10, fontWeight: 700,
                }}>
                  EC2 #{i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }

    if (active.layout === 'spread') {
      // Cada um em rack diferente
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, padding: '20px 0' }}>
          {[...Array(7)].map((_, i) => (
            <div key={i} style={{
              background: `${active.color}10`,
              border: `2px solid ${active.color}`,
              borderRadius: 8,
              padding: 8,
              textAlign: 'center',
            }}>
              <div style={{ color: active.color, fontSize: 8, fontWeight: 700, letterSpacing: '.05em', marginBottom: 6 }}>RACK {i + 1}</div>
              <div style={{
                background: `${active.color}30`,
                border: `1.5px solid ${active.color}`,
                borderRadius: 5,
                padding: '8px 4px',
                color: active.color, fontSize: 10, fontWeight: 700,
              }}>
                EC2 #{i + 1}
              </div>
            </div>
          ))}
        </div>
      )
    }

    // partition
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, padding: '12px 0' }}>
        {[1, 2, 3].map(p => (
          <div key={p} style={{
            background: `${active.color}10`,
            border: `2px solid ${active.color}`,
            borderRadius: 10,
            padding: 12,
          }}>
            <div style={{ color: active.color, fontSize: 9, fontWeight: 700, letterSpacing: '.1em', marginBottom: 8, textAlign: 'center' }}>PARTITION {p}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} style={{
                  background: `${active.color}30`,
                  border: `1.5px solid ${active.color}`,
                  borderRadius: 5,
                  padding: '6px 8px',
                  textAlign: 'center',
                  color: active.color, fontSize: 10, fontWeight: 700,
                }}>
                  EC2 #{p}.{i + 1}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div style={{ background: BG, border: `1px solid ${LINE}`, borderRadius: 14, padding: 24, fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ marginBottom: 18 }}>
        <h3 style={{ color: FG, margin: 0, fontSize: 16, fontWeight: 800 }}>Placement Groups — disposição física das instâncias</h3>
        <p style={{ color: FGMUTE, fontSize: 12, margin: '4px 0 0' }}>Cada estratégia controla a proximidade física e o isolamento de falha entre instâncias.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
        {PLACEMENT_GROUPS.map(g => {
          const isSel = g.id === sel
          return (
            <button
              key={g.id}
              onClick={() => setSel(g.id)}
              style={{
                background: isSel ? `${g.color}25` : CARD,
                border: `2px solid ${isSel ? g.color : LINE}`,
                borderRadius: 10,
                padding: '14px 16px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all .2s',
                fontFamily: 'inherit',
              }}
            >
              <div style={{ color: isSel ? g.color : FG, fontSize: 13, fontWeight: 800, marginBottom: 4 }}>{g.name}</div>
              <div style={{ color: FGMUTE, fontSize: 10, lineHeight: 1.5 }}>{g.layout === 'cluster' ? 'Latência mínima' : g.layout === 'spread' ? 'Máxima HA' : 'Isolamento por shard'}</div>
            </button>
          )
        })}
      </div>

      <div style={{
        background: CARD,
        border: `2px solid ${active.color}40`,
        borderRadius: 12,
        padding: 18,
      }}>
        <div style={{ marginBottom: 12, color: FGMUTE, fontSize: 11.5, lineHeight: 1.6 }}>
          {active.description}
        </div>

        {renderLayout()}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 16 }}>
          <div>
            <div style={{ color: GRN, fontSize: 9, letterSpacing: '.15em', fontWeight: 700, marginBottom: 8 }}>QUANDO USAR</div>
            {active.useCase.map((u, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                color: FG, fontSize: 11, lineHeight: 1.6,
                padding: '4px 0',
              }}>
                <span style={{ color: GRN, fontWeight: 700 }}>{'>'}</span>
                {u}
              </div>
            ))}
          </div>
          <div>
            <div style={{ color: AMB, fontSize: 9, letterSpacing: '.15em', fontWeight: 700, marginBottom: 8 }}>RISCO</div>
            <div style={{
              background: BG,
              border: `1px solid ${AMB}40`,
              borderLeft: `3px solid ${AMB}`,
              borderRadius: 6,
              padding: '10px 12px',
              color: FGMUTE, fontSize: 11, lineHeight: 1.6,
            }}>
              {active.risk}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — Anti-patterns
// Justificativa: ver código errado x correto fixa as armadilhas reais de EC2:
// SG aberto, sem encryption, hardcoded credentials, IMDSv1, gp2 em vez de gp3.
// ═══════════════════════════════════════════════════════════════════════════════

const EC2_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'Security Group com SSH aberto para 0.0.0.0/0',
    wrong: [
      [{ text: '# Porta 22 aberta para o mundo inteiro', color: RED }],
      [{ text: 'resource "aws_security_group" "bad" {', color: FG }],
      [{ text: '  ingress {', color: FG }],
      [{ text: '    from_port   = 22', color: FG }],
      [{ text: '    to_port     = 22', color: FG }],
      [{ text: '    protocol    = "tcp"', color: FG }],
      [{ text: '    cidr_blocks = ["0.0.0.0/0"]   # !!! qualquer IP', color: RED }],
      [{ text: '  }', color: FG }],
      [{ text: '}', color: FG }],
    ],
    right: [
      [{ text: '# Sem porta SSH aberta — use SSM Session Manager', color: GRN }],
      [{ text: 'resource "aws_security_group" "ok" {', color: FG }],
      [{ text: '  # nenhuma ingress de SSH', color: GRN }],
      [{ text: '}', color: FG }],
      [{ text: '', color: FG }],
      [{ text: '# Acesso via SSM (sem porta aberta, autenticado por IAM)', color: GRN }],
      [{ text: 'aws ssm start-session --target i-0abc123', color: SKY }],
    ],
    why: 'SSH aberto na internet é o vetor de ataque mais comum em EC2. Bots fazem brute-force 24/7 em qualquer IP elástico. SSM Session Manager substitui SSH sem nenhuma porta aberta — auditado em CloudTrail e autenticado por IAM. Mais seguro e mais rastreável.',
  },
  {
    title: 'IMDSv1 habilitado — vulnerável a SSRF',
    wrong: [
      [{ text: '# Launch Template aceita IMDSv1 (default antigo)', color: RED }],
      [{ text: 'resource "aws_launch_template" "bad" {', color: FG }],
      [{ text: '  metadata_options {', color: FG }],
      [{ text: '    http_tokens = "optional"   # aceita IMDSv1', color: RED }],
      [{ text: '  }', color: FG }],
      [{ text: '}', color: FG }],
    ],
    right: [
      [{ text: '# Forca IMDSv2 — protege contra SSRF', color: GRN }],
      [{ text: 'resource "aws_launch_template" "ok" {', color: FG }],
      [{ text: '  metadata_options {', color: FG }],
      [{ text: '    http_tokens                 = "required"', color: GRN }],
      [{ text: '    http_put_response_hop_limit = 1', color: GRN }],
      [{ text: '  }', color: FG }],
      [{ text: '}', color: FG }],
    ],
    why: 'IMDSv1 expoe credenciais da IAM Role via GET simples no 169.254.169.254. Se a aplicacao tem qualquer SSRF (faz request para URL fornecida pelo usuario), o atacante rouba as credenciais e usa fora da AWS. IMDSv2 exige token PUT que SSRF nao consegue obter.',
  },
  {
    title: 'EBS gp2 em produção nova',
    wrong: [
      [{ text: '# gp2 — IOPS atrelado ao tamanho, 20% mais caro', color: RED }],
      [{ text: 'resource "aws_ebs_volume" "bad" {', color: FG }],
      [{ text: '  size        = 100   # so 300 IOPS (3 IOPS/GB)', color: RED }],
      [{ text: '  type        = "gp2"', color: RED }],
      [{ text: '  encrypted   = false   # !!! sem encryption', color: RED }],
      [{ text: '}', color: FG }],
    ],
    right: [
      [{ text: '# gp3 — 3000 IOPS independentes do tamanho', color: GRN }],
      [{ text: 'resource "aws_ebs_volume" "ok" {', color: FG }],
      [{ text: '  size        = 100', color: FG }],
      [{ text: '  type        = "gp3"', color: GRN }],
      [{ text: '  iops        = 3000   # baseline gratis em qualquer tamanho', color: GRN }],
      [{ text: '  throughput  = 125', color: GRN }],
      [{ text: '  encrypted   = true   # KMS encryption obrigatorio', color: GRN }],
      [{ text: '}', color: FG }],
    ],
    why: 'gp3 entrega 3000 IOPS de baseline em qualquer tamanho — gp2 precisa de 1 TB para o mesmo. gp3 e ainda 20% mais barato. Migrar gp2 para gp3 nao tem downtime (Elastic Volumes). Encryption no EBS deve ser obrigatorio em todo volume — proteção contra leak de snapshot.',
  },
  {
    title: 'Credenciais AWS hardcoded em User Data',
    wrong: [
      [{ text: '#!/bin/bash', color: FG }],
      [{ text: '# Chaves AWS no User Data — vai para o Launch Template', color: RED }],
      [{ text: 'export AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE', color: RED }],
      [{ text: 'export AWS_SECRET_ACCESS_KEY=wJalrXUtn...', color: RED }],
      [{ text: 'aws s3 cp s3://bucket/code.tar.gz .', color: FG }],
    ],
    right: [
      [{ text: '#!/bin/bash', color: FG }],
      [{ text: '# IAM Instance Profile entrega credenciais via STS', color: GRN }],
      [{ text: '# SDK e CLI leem automaticamente do IMDSv2', color: GRN }],
      [{ text: 'aws s3 cp s3://bucket/code.tar.gz .   # sem credenciais!', color: GRN }],
      [{ text: '', color: FG }],
      [{ text: '# Launch Template referencia o profile:', color: FG }],
      [{ text: 'iam_instance_profile { name = "minha-app-role" }', color: SKY }],
    ],
    why: 'Credenciais em User Data ficam visiveis em DescribeLaunchTemplate (qualquer um com permissao de leitura ve). Acesso ao Launch Template e auditado mas as credenciais ja vazaram. IAM Instance Profile gera tokens temporarios via STS — sem segredo para vazar e tokens expiram em 1 hora.',
  },
  {
    title: 'Sem Termination Protection em RDS/EC2 críticos',
    wrong: [
      [{ text: '# Instancia critica sem protecao', color: RED }],
      [{ text: 'resource "aws_instance" "prod_db" {', color: FG }],
      [{ text: '  ami           = "ami-0abc123"', color: FG }],
      [{ text: '  instance_type = "r6i.4xlarge"', color: FG }],
      [{ text: '  # disable_api_termination ausente — destruivel', color: RED }],
      [{ text: '}', color: FG }],
    ],
    right: [
      [{ text: '# Producao protegida contra terminate acidental', color: GRN }],
      [{ text: 'resource "aws_instance" "prod_db" {', color: FG }],
      [{ text: '  ami                     = "ami-0abc123"', color: FG }],
      [{ text: '  instance_type           = "r6i.4xlarge"', color: FG }],
      [{ text: '  disable_api_termination = true   # bloqueia terminate', color: GRN }],
      [{ text: '  disable_api_stop        = true   # opcional — bloqueia stop', color: GRN }],
      [{ text: '}', color: FG }],
    ],
    why: 'Termination Protection bloqueia o comando aws ec2 terminate-instances no API — tem que ser desabilitado explicitamente antes. Evita o erro humano de copiar o instance ID errado e destruir produção. Para EBS, configure DeleteOnTermination=false em volumes de dados.',
  },
  {
    title: 'Conexão DB direto do ASG sem connection pooling',
    wrong: [
      [{ text: '// ASG escala para 100 instancias = 100 conexoes', color: RED }],
      [{ text: 'const pool = new Pool({', color: FG }],
      [{ text: '  host: "rds.amazonaws.com",', color: FG }],
      [{ text: '  max: 50,   // 100 inst x 50 = 5000 conexoes!', color: RED }],
      [{ text: '})', color: FG }],
    ],
    right: [
      [{ text: '// RDS Proxy faz connection pooling no nivel da rede', color: GRN }],
      [{ text: 'const pool = new Pool({', color: FG }],
      [{ text: '  host: "myproxy.proxy-xxxx.amazonaws.com",   // RDS Proxy', color: GRN }],
      [{ text: '  max: 5,   // 100 inst x 5 = 500 conexoes ao Proxy', color: GRN }],
      [{ text: '})', color: FG }],
      [{ text: '// Proxy multiplexa para o RDS — mantem conexoes saudaveis,', color: GRN }],
      [{ text: '// failover transparente, autenticacao IAM, cold starts mais rapidos', color: GRN }],
    ],
    why: 'PostgreSQL e MySQL alocam memoria por conexao (5-15 MB cada). Com ASG escalando alem de 50 instancias, voce pode estourar o limite de conexoes do RDS — todas as escritas falham. RDS Proxy faz pool de conexoes na borda, mantem o RDS abaixo do limite e suporta failover sem reconectar a aplicacao.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 8 — VPC / Networking hierarchy (LayerStack)
// Justificativa: a hierarquia de rede do EC2 (VPC → Subnet → Route Table → NACL →
// Security Group → ENI) é onde nascem 70% dos "EC2 não responde". Cada camada
// pode bloquear, e a ordem de avaliacao não é óbvia. Ver as 6 camadas empilhadas
// com o que cada uma faz e onde NÃO opera (stateful vs stateless, allow vs deny)
// torna o modelo mental concreto.
// ═══════════════════════════════════════════════════════════════════════════════

const NETWORKING_LAYERS: Layer[] = [
  {
    id: 'sg',
    label: 'Camada 6 — Security Group',
    sublabel: 'Firewall stateful no nível da ENI',
    description: 'Avaliado por último, no nível da Elastic Network Interface (ENI) da instância. Stateful — resposta de conexão permitida entra automaticamente, sem regra de retorno. Apenas Allow (não tem Deny). Pode referenciar outros SGs (allow do sg-alb em vez de CIDR). É a porta da instância.',
    code: 'aws ec2 authorize-security-group-ingress \\\n  --group-id sg-app \\\n  --protocol tcp --port 8080 \\\n  --source-group sg-alb',
    color: GRN,
    examples: ['Stateful (1 regra cobre ida + volta)', 'Só Allow', 'Referencia outros SGs', 'Default deny tudo'],
  },
  {
    id: 'nacl',
    label: 'Camada 5 — Network ACL',
    sublabel: 'Firewall stateless no nível da subnet',
    description: 'Avaliado antes do SG, no nível da subnet. Stateless — você precisa de Allow explícito para entrada E saída (incluindo respostas em portas efêmeras 1024-65535). Suporta Allow E Deny avaliados em ordem numérica (regra 100 antes da 200). Use somente para bloqueio amplo (range de IPs maliciosos, defesa em profundidade). Para 99% dos casos, deixe NACL default (allow all) e configure tudo no SG.',
    code: 'Inbound  rule #100  allow tcp 443  0.0.0.0/0\nOutbound rule #100  allow tcp 1024-65535 0.0.0.0/0  # respostas',
    color: AMB,
    examples: ['Stateless (precisa allow ida e volta)', 'Allow OU Deny', 'Avaliada em ordem', 'Por subnet'],
  },
  {
    id: 'rt',
    label: 'Camada 4 — Route Table',
    sublabel: 'Para onde vai o tráfego de saída',
    description: 'Cada subnet tem uma Route Table associada. Decide o próximo salto baseado no CIDR de destino. Se a rota leva a um Internet Gateway, a subnet é pública. Se leva a um NAT Gateway ou NAT Instance, é privada com saída via NAT. Se leva a um VPC Endpoint, o tráfego para serviços AWS (S3, DynamoDB) nunca sai para a internet. A rota mais específica vence (longest prefix match).',
    code: '0.0.0.0/0     → igw-xxx     (subnet pública)\n0.0.0.0/0     → nat-xxx     (subnet privada)\npl-63a5400a   → vpce-s3-xxx (S3 Gateway Endpoint)',
    color: SKY,
    examples: ['Pública: rota 0.0.0.0/0 → IGW', 'Privada: rota 0.0.0.0/0 → NAT', 'Endpoint: tráfego sem internet', 'Longest prefix match'],
  },
  {
    id: 'subnet',
    label: 'Camada 3 — Subnet',
    sublabel: 'Range de IPs em uma única AZ',
    description: 'Subdivisão da VPC em uma única Availability Zone. Pública (rota IGW) hospeda ALB, NAT Gateway, bastion. Privada (rota via NAT) hospeda EC2 da aplicação, RDS. Pelo menos 2 subnets em AZs diferentes para HA. Cada ENI vive em exatamente uma subnet — a instância herda o CIDR. CIDRs comuns: VPC /16 (65k IPs), subnet /24 (256 IPs, 251 utilizáveis após reservados pela AWS).',
    code: 'VPC  10.0.0.0/16\n├── subnet-pub-a  10.0.1.0/24  (us-east-1a)\n├── subnet-pub-b  10.0.2.0/24  (us-east-1b)\n├── subnet-prv-a  10.0.10.0/24 (us-east-1a)\n└── subnet-prv-b  10.0.11.0/24 (us-east-1b)',
    color: PRP,
    examples: ['1 subnet = 1 AZ', 'AWS reserva 5 IPs por subnet', 'Pública vs privada = rota', 'Multi-AZ exige multi-subnet'],
  },
  {
    id: 'vpc',
    label: 'Camada 2 — VPC',
    sublabel: 'Rede virtual isolada',
    description: 'Container superior da rede. Define o CIDR principal (ex: 10.0.0.0/16). Por padrão, instâncias dentro da mesma VPC se comunicam via rotas locais. Cross-VPC exige VPC Peering ou Transit Gateway. Para acesso a serviços AWS sem internet: VPC Endpoints (Gateway para S3/DynamoDB, Interface/PrivateLink para os demais). Habilite enableDnsHostnames + enableDnsSupport para que instâncias resolvam DNS internos.',
    code: 'aws ec2 create-vpc --cidr-block 10.0.0.0/16 \\\n  --tag-specifications "ResourceType=vpc,Tags=[{Key=Name,Value=prod}]"',
    color: '#60a5fa',
    examples: ['CIDR principal /16 típico', 'VPC Peering para cross-VPC', 'VPC Endpoints sem IGW', 'DNS interno via .compute.internal'],
  },
  {
    id: 'gateway',
    label: 'Camada 1 — Internet Gateway / NAT',
    sublabel: 'Borda da VPC com a internet',
    description: 'Internet Gateway (IGW): habilita IPv4/IPv6 público de duas vias para subnets públicas. Sem custo. Sem IGW, a VPC não tem internet. NAT Gateway: permite saída para internet de subnets privadas (instâncias podem fazer GET/POST mas a internet não pode iniciar conexão). Cobra por hora + por GB processado. NAT Instance é alternativa baseada em EC2 (mais barato em escala pequena, sem alta disponibilidade nativa). Egress-Only Internet Gateway: equivalente NAT para IPv6.',
    code: 'aws ec2 create-internet-gateway\naws ec2 attach-internet-gateway --vpc-id vpc-xxx --internet-gateway-id igw-xxx\n\naws ec2 create-nat-gateway --subnet-id subnet-pub-a \\\n  --allocation-id eipalloc-xxx',
    color: '#ec4899',
    examples: ['IGW = grátis', 'NAT Gateway ~$0.045/h + $/GB', 'NAT por AZ para HA', 'Egress-only IGW = NAT IPv6'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 9 — IAM Instance Profile + IMDSv2 (SequenceDiagram)
// Justificativa: o fluxo "como o EC2 acessa S3 sem credenciais" e a diferença
// entre IMDSv1 e IMDSv2 são abstratos. Ver a sequência exata de PUT (token) →
// GET (com header) → STS AssumeRole → API call torna o IMDSv2 concreto e mostra
// onde o SSRF era explorado no IMDSv1 (Capital One 2019).
// ═══════════════════════════════════════════════════════════════════════════════

const IMDS_ACTORS: SeqActor[] = [
  { id: 'app',     label: 'App',           color: GRN, icon: 'A' },
  { id: 'imds',    label: 'IMDS',          color: AMB, icon: 'M' },
  { id: 'sts',     label: 'STS',           color: PRP, icon: 'T' },
  { id: 'role',    label: 'IAM Role',      color: SKY, icon: 'R' },
  { id: 'aws',     label: 'AWS API',       color: C,   icon: '*' },
]

const IMDS_MESSAGES: SeqMessage[] = [
  // IMDSv2 token retrieval
  { from: 'app',   to: 'imds',   label: 'PUT /latest/api/token',                      note: 'header X-aws-ec2-metadata-token-ttl-seconds: 21600 (6h)', type: 'sync' },
  { from: 'imds',  to: 'app',    label: '200 token (string opaca)',                   note: 'token expira em 6h, não pode sair da instância',           type: 'return' },
  // Get role name from metadata
  { from: 'app',   to: 'imds',   label: 'GET /meta-data/iam/security-credentials/',   note: 'header X-aws-ec2-metadata-token: <token>',                  type: 'sync' },
  { from: 'imds',  to: 'app',    label: '200 nome-da-role',                           note: 'derivado do iam_instance_profile do Launch Template',     type: 'return' },
  // Get temporary credentials
  { from: 'app',   to: 'imds',   label: 'GET /meta-data/.../<nome-da-role>',          note: 'mesmo token no header',                                   type: 'sync' },
  { from: 'imds',  to: 'sts',    label: 'AssumeRole interno',                         note: 'IMDS chama o STS em nome da instância',                   type: 'sync' },
  { from: 'sts',   to: 'role',   label: 'lê trust policy + permissions',              note: 'verifica que ec2.amazonaws.com pode assumir',             type: 'sync' },
  { from: 'role',  to: 'sts',    label: 'políticas resolvidas',                       note: 's3:GetObject em arn:aws:s3:::bucket/*',                   type: 'return' },
  { from: 'sts',   to: 'imds',   label: 'AccessKey + Secret + Token + Expiration',    note: 'credenciais válidas por ~1h, rotação automática',         type: 'return' },
  { from: 'imds',  to: 'app',    label: '200 JSON com credenciais temporárias',       note: 'AccessKeyId, SecretAccessKey, Token, Expiration',         type: 'return' },
  // Use credentials to call AWS
  { from: 'app',   to: 'aws',    label: 'GetObject(bucket/key) + SigV4',              note: 'SDK assina request com as credenciais temporárias',       type: 'sync' },
  { from: 'aws',   to: 'role',   label: 'verifica policy do principal',               note: 'a Role tem s3:GetObject? Recurso bate?',                   type: 'sync' },
  { from: 'role',  to: 'aws',    label: 'allow',                                      note: 'avalia também SCPs, VPC endpoint policy, bucket policy',  type: 'return' },
  { from: 'aws',   to: 'app',    label: '200 OK + bytes do objeto',                   note: 'resposta entregue. SDK refresh credenciais antes de expirar', type: 'return' },
]

const IMDS_GROUPS: SeqGroup[] = [
  { label: 'Aquisição de token (IMDSv2)',     kind: 'opt', fromMsg: 0,  toMsg: 1,  color: AMB },
  { label: 'Resolução da Role + STS',         kind: 'opt', fromMsg: 2,  toMsg: 9,  color: PRP },
  { label: 'Chamada à AWS com SigV4',         kind: 'opt', fromMsg: 10, toMsg: 13, color: C   },
]

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default function EC2Visuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'lifecycle',
      title: 'Ciclo de vida',
      subtitle: 'Estados pending → running → stopped → terminated com transições clicáveis',
      accent: C,
      component: (
        <StateMachineExplorer
          states={LIFECYCLE_STATES}
          transitions={LIFECYCLE_TRANSITIONS}
          initialState="pending"
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="Ciclo de vida da instância EC2"
          description="Clique nos estados para transicionar. Stop é reversível — Terminate é definitivo e destrói o EBS root."
        />
      ),
    },
    {
      id: 'families',
      title: 'Famílias de instância',
      subtitle: 'T, M, C, R, I, G, P — quando usar cada uma e qual a proporção CPU/RAM',
      accent: C,
      component: <FamilyExplorer />,
    },
    {
      id: 'ebs',
      title: 'Tipos de EBS',
      subtitle: 'gp3 vs gp2 vs io2 vs st1 vs sc1 em IOPS, throughput, latência e custo',
      accent: C,
      component: (
        <ComparisonTable
          options={EBS_OPTIONS}
          criteria={EBS_CRITERIA}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="EBS — comparativo de tipos de volume"
          description="gp3 é o padrão moderno. io2 para bancos críticos. st1/sc1 para HDDs sequenciais. gp2 está em depreciação."
        />
      ),
    },
    {
      id: 'pricing',
      title: 'Modelos de precificação',
      subtitle: 'Árvore de decisão: On-Demand, Reserved, Savings Plans ou Spot',
      accent: C,
      component: (
        <DecisionTree
          root={PRICING_ROOT}
          nodes={PRICING_NODES}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="Qual modelo de precificação EC2 escolher?"
          description="Resposta dura por 1-3 anos. Combinar modelos (Savings + Spot + On-Demand) é a estratégia mais comum em produção."
        />
      ),
    },
    {
      id: 'asg',
      title: 'Auto Scaling Group',
      subtitle: 'Fluxo de scale-out, scale-in, recuperação de falha e instance refresh',
      accent: C,
      component: <ASGFlowVisual />,
    },
    {
      id: 'placement',
      title: 'Placement Groups',
      subtitle: 'Cluster vs Spread vs Partition — como cada estratégia distribui hardware',
      accent: C,
      component: <PlacementGroupVisual />,
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns',
      subtitle: 'Os 6 erros mais frequentes em EC2 com diff errado x correto',
      accent: C,
      component: (
        <AntiPatternsGallery
          patterns={EC2_ANTIPATTERNS}
          accentColor={C}
          bgColor={BG}
          label="EC2 — armadilhas comuns"
          heading="Os 6 erros que aparecem em code review e auditoria"
          description="Cada anti-pattern com diff de Terraform/SDK/Bash e explicação de impacto técnico."
          whyLabel="POR QUE ISSO QUEBRA"
        />
      ),
    },
    {
      id: 'networking',
      title: 'Networking VPC',
      subtitle: 'IGW → VPC → Subnet → Route Table → NACL → Security Group em 6 camadas',
      accent: C,
      component: (
        <LayerStack
          layers={NETWORKING_LAYERS}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="Hierarquia de rede do EC2"
          description="A ordem importa: IGW/NAT é a borda, VPC e Subnet são o espaço de IPs, Route Table decide o caminho, NACL é stateless por subnet, Security Group é stateful por instância. SG e NACL avaliam Allow/Deny diferente — entender essa ordem evita 70% dos casos de 'EC2 não responde'."
        />
      ),
    },
    {
      id: 'imds-flow',
      title: 'IAM Instance Profile + IMDSv2',
      subtitle: 'Como EC2 acessa S3 sem credenciais — fluxo de token, STS e SigV4',
      accent: C,
      component: (
        <SequenceDiagram
          actors={IMDS_ACTORS}
          messages={IMDS_MESSAGES}
          groups={IMDS_GROUPS}
          accentColor={C}
          bgColor={BG}
          title="Sequência de chamada à AWS API a partir da instância"
          description="IMDSv2 exige PUT inicial para obter token e GET com header. IMDSv1 (legado) era um GET direto — vulnerável a SSRF (Capital One 2019). O Instance Profile é a forma correta de dar acesso a serviços AWS sem chaves hardcoded."
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
