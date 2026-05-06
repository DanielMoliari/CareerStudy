'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { CodeStepper } from '@/components/visuals/CodeStepper'
import type { CodeStepperScenario } from '@/components/visuals/CodeStepper'

// ── Paleta Prisma (indigo brand) ────────────────────────────────────────────────
const C      = '#5A67D8'   // indigo Prisma
const SEC    = '#4C51BF'
const BG     = '#0f172a'
const CARD   = '#1e293b'
const CARD2  = '#243044'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#4ade80'
const AMB    = '#f59e0b'
const SKY    = '#38bdf8'
const PRP    = '#a78bfa'
const RED    = '#ef4444'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Pipeline schema → generate → migrate → client
// Justificativa: o pipeline de 4 estágios e o que cada um produz (arquivos,
// SQL, tipos) é o modelo mental que destrava todo o resto. Mostrar os artefatos
// de saída de cada estágio torna concreto o que está em jogo.
// ═══════════════════════════════════════════════════════════════════════════════

interface PipelineStage {
  id: string
  num: string
  label: string
  command: string
  inputs: { name: string; desc: string }[]
  outputs: { name: string; desc: string; color: string }[]
  detail: string
  color: string
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 'edit',
    num: '1',
    label: 'Editar schema.prisma',
    command: 'vim prisma/schema.prisma',
    inputs: [
      { name: 'requisito', desc: 'Modelagem do domínio (entidades, relações)' },
    ],
    outputs: [
      { name: 'prisma/schema.prisma', desc: 'DSL declarativa — fonte de verdade', color: C },
    ],
    detail: 'A DSL do Prisma define datasource (banco), generator (cliente) e models (tabelas). Tudo flui daqui — schema é o contrato. Em monorepo, fica em packages/database/.',
    color: C,
  },
  {
    id: 'generate',
    num: '2',
    label: 'prisma generate',
    command: 'npx prisma generate',
    inputs: [
      { name: 'schema.prisma', desc: 'Lê os models e relações' },
    ],
    outputs: [
      { name: 'node_modules/.prisma/client', desc: 'Client TypeScript com tipos gerados', color: SKY },
      { name: 'tipos inferidos', desc: 'User, Post, UserCreateInput, PostWhereInput, etc.', color: GRN },
    ],
    detail: 'NÃO toca no banco. Apenas gera o pacote @prisma/client com tipos TS completos. Roda automático no postinstall e a cada migrate dev. Em CI/build, roda explicitamente antes do build do app.',
    color: SKY,
  },
  {
    id: 'migrate',
    num: '3',
    label: 'prisma migrate',
    command: 'npx prisma migrate dev --name add_post',
    inputs: [
      { name: 'schema.prisma', desc: 'Estado desejado' },
      { name: '_prisma_migrations', desc: 'Tabela de histórico no banco' },
    ],
    outputs: [
      { name: 'prisma/migrations/{ts}_name/', desc: 'SQL versionado em pasta nova', color: AMB },
      { name: 'banco atualizado', desc: 'DDL aplicado (CREATE/ALTER)', color: PRP },
      { name: 'client regenerado', desc: 'migrate dev regenera @prisma/client', color: GRN },
    ],
    detail: 'Calcula DIFF entre schema e migrations já aplicadas (não contra o banco direto). Gera SQL idempotente em arquivo versionado. migrate dev = gera+aplica+gera client (local). migrate deploy = só aplica versionadas (CI/prod).',
    color: AMB,
  },
  {
    id: 'use',
    num: '4',
    label: 'App usa o Client',
    command: "import { prisma } from '@/lib/prisma'",
    inputs: [
      { name: '@prisma/client', desc: 'Importa do node_modules/.prisma' },
    ],
    outputs: [
      { name: 'queries tipadas', desc: 'findMany, create, update, etc.', color: GRN },
      { name: 'autocomplete', desc: 'TypeScript infere campos e relações', color: PRP },
    ],
    detail: 'O Client é singleton em produção (uma instância por processo). Em Next.js dev, use globalThis pattern para evitar exhaustion de pool com hot reload. Em scripts CLI sempre $disconnect() ao final.',
    color: GRN,
  },
]

function PipelineVisual() {
  const [active, setActive] = useState(0)
  const stage = PIPELINE_STAGES[active]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Stepper horizontal */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 8,
      }}>
        {PIPELINE_STAGES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActive(i)}
            style={{
              background: active === i ? `${s.color}15` : CARD,
              border: `2px solid ${active === i ? s.color : LINE}`,
              borderRadius: 10,
              padding: 14,
              cursor: 'pointer',
              textAlign: 'left',
              fontFamily: 'inherit',
              transition: 'all .2s',
              position: 'relative',
            }}
          >
            <div style={{
              fontSize: 26,
              color: s.color,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              marginBottom: 4,
            }}>{s.num}</div>
            <div style={{ fontSize: 13, color: active === i ? FG : FGMUTE, fontWeight: 600, marginBottom: 4 }}>
              {s.label}
            </div>
            <code style={{ fontSize: 10, color: FGMUTE, fontFamily: "'JetBrains Mono', monospace" }}>
              {s.command}
            </code>
          </button>
        ))}
      </div>

      {/* Painel input → output */}
      <div style={{
        background: CARD,
        borderRadius: 12,
        padding: 22,
        border: `1px solid ${stage.color}40`,
        borderLeft: `4px solid ${stage.color}`,
      }}>
        <div style={{ fontSize: 18, color: stage.color, fontWeight: 800, marginBottom: 14 }}>
          {stage.label}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 18, alignItems: 'stretch', marginBottom: 16 }}>
          {/* Inputs */}
          <div style={{ background: BG, borderRadius: 10, padding: 14, border: `1px solid ${LINE}` }}>
            <div style={{ fontSize: 10, color: FGMUTE, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>
              Inputs
            </div>
            {stage.inputs.map((inp, i) => (
              <div key={i} style={{ marginBottom: i < stage.inputs.length - 1 ? 10 : 0 }}>
                <code style={{ fontSize: 11, color: AMB, fontFamily: "'JetBrains Mono', monospace", display: 'block', marginBottom: 4 }}>
                  {inp.name}
                </code>
                <p style={{ fontSize: 11, color: FG, margin: 0, lineHeight: 1.5 }}>{inp.desc}</p>
              </div>
            ))}
          </div>

          {/* Arrow */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: stage.color, fontSize: 24, fontFamily: "'JetBrains Mono', monospace" }}>
            {'->'}
          </div>

          {/* Outputs */}
          <div style={{ background: BG, borderRadius: 10, padding: 14, border: `1px solid ${stage.color}30` }}>
            <div style={{ fontSize: 10, color: stage.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>
              Outputs
            </div>
            {stage.outputs.map((out, i) => (
              <div key={i} style={{ marginBottom: i < stage.outputs.length - 1 ? 10 : 0 }}>
                <code style={{ fontSize: 11, color: out.color, fontFamily: "'JetBrains Mono', monospace", display: 'block', marginBottom: 4 }}>
                  {out.name}
                </code>
                <p style={{ fontSize: 11, color: FG, margin: 0, lineHeight: 1.5 }}>{out.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: `${stage.color}10`,
          border: `1px solid ${stage.color}30`,
          borderRadius: 8,
          padding: 14,
        }}>
          <div style={{ fontSize: 10, color: stage.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>
            O que está acontecendo
          </div>
          <p style={{ fontSize: 12, color: FG, margin: 0, lineHeight: 1.6 }}>{stage.detail}</p>
        </div>
      </div>

      {/* Comandos por ambiente */}
      <div style={{ background: BG, border: `1px solid ${LINE}`, borderRadius: 10, padding: 16 }}>
        <div style={{ fontSize: 10, color: FGMUTE, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>
          Pipeline por ambiente
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <div style={{ background: CARD, borderRadius: 8, padding: 12, borderLeft: `3px solid ${C}` }}>
            <div style={{ fontSize: 11, color: C, fontWeight: 700, marginBottom: 6 }}>DEV (local)</div>
            <code style={{ fontSize: 10, color: FG, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.6, display: 'block' }}>
              prisma migrate dev --name X
            </code>
            <p style={{ fontSize: 10, color: FGMUTE, margin: '4px 0 0', lineHeight: 1.5 }}>
              Gera migration + aplica + regenera client
            </p>
          </div>
          <div style={{ background: CARD, borderRadius: 8, padding: 12, borderLeft: `3px solid ${GRN}` }}>
            <div style={{ fontSize: 11, color: GRN, fontWeight: 700, marginBottom: 6 }}>PROD / CI</div>
            <code style={{ fontSize: 10, color: FG, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.6, display: 'block' }}>
              prisma migrate deploy
            </code>
            <p style={{ fontSize: 10, color: FGMUTE, margin: '4px 0 0', lineHeight: 1.5 }}>
              Só aplica migrations versionadas — idempotente
            </p>
          </div>
          <div style={{ background: CARD, borderRadius: 8, padding: 12, borderLeft: `3px solid ${RED}` }}>
            <div style={{ fontSize: 11, color: RED, fontWeight: 700, marginBottom: 6 }}>PROTÓTIPO</div>
            <code style={{ fontSize: 10, color: FG, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.6, display: 'block' }}>
              prisma db push
            </code>
            <p style={{ fontSize: 10, color: FGMUTE, margin: '4px 0 0', lineHeight: 1.5 }}>
              Sync sem migration — NUNCA produção
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Tipos de relação (1:1, 1:N, N:N implícita, N:N explícita)
// Justificativa: a diferença entre N:N implícita (Prisma cria join table) e
// explícita (você cria com metadados) confunde devs novos. Mostrar lado a lado
// schema + tabelas geradas no banco fixa o modelo mental.
// ═══════════════════════════════════════════════════════════════════════════════

interface RelationType {
  id: string
  label: string
  cardinality: string
  color: string
  scenario: string
  schema: { line: string; tokens: { text: string; color?: string }[] }[]
  tables: string[]
  caveats: string
}

const RELATIONS: RelationType[] = [
  {
    id: 'one-one',
    label: '1 : 1 — User tem 1 Profile',
    cardinality: '1 ←→ 1',
    color: GRN,
    scenario: 'User opcionalmente tem um Profile com bio e avatar. O User existe sem Profile, mas Profile sempre pertence a um User.',
    schema: [
      { line: '1', tokens: [{ text: 'model ', color: PRP }, { text: 'User ', color: SKY }, { text: '{', color: FG }] },
      { line: '2', tokens: [{ text: '  id      ', color: FG }, { text: 'String  ', color: GRN }, { text: '@id @default(cuid())', color: AMB }] },
      { line: '3', tokens: [{ text: '  profile ', color: FG }, { text: 'Profile?', color: SKY }, { text: ' // 1:1 — opcional', color: FGMUTE }] },
      { line: '4', tokens: [{ text: '}', color: FG }] },
      { line: '', tokens: [] },
      { line: '5', tokens: [{ text: 'model ', color: PRP }, { text: 'Profile ', color: SKY }, { text: '{', color: FG }] },
      { line: '6', tokens: [{ text: '  id     ', color: FG }, { text: 'String ', color: GRN }, { text: '@id @default(cuid())', color: AMB }] },
      { line: '7', tokens: [{ text: '  bio    ', color: FG }, { text: 'String', color: GRN }] },
      { line: '8', tokens: [{ text: '  userId ', color: FG }, { text: 'String ', color: GRN }, { text: '@unique', color: AMB }, { text: '  // FK + unique = 1:1', color: FGMUTE }] },
      { line: '9', tokens: [{ text: '  user   ', color: FG }, { text: 'User   ', color: SKY }, { text: '@relation(fields: [userId], references: [id], onDelete: Cascade)', color: AMB }] },
      { line: '10', tokens: [{ text: '}', color: FG }] },
    ],
    tables: ['users (id, ...)', 'profiles (id, bio, userId UNIQUE → users.id)'],
    caveats: 'A chave do 1:1 é @unique no campo de FK. Sem o @unique, vira 1:N. onDelete Cascade no Profile garante que ele some quando o User é deletado.',
  },
  {
    id: 'one-many',
    label: '1 : N — User tem muitos Posts',
    cardinality: '1 ←→ N',
    color: SKY,
    scenario: 'Um User pode ter muitos Posts. Cada Post pertence a exatamente um User (autor). É a relação mais comum.',
    schema: [
      { line: '1', tokens: [{ text: 'model ', color: PRP }, { text: 'User ', color: SKY }, { text: '{', color: FG }] },
      { line: '2', tokens: [{ text: '  id    ', color: FG }, { text: 'String ', color: GRN }, { text: '@id @default(cuid())', color: AMB }] },
      { line: '3', tokens: [{ text: '  posts ', color: FG }, { text: 'Post[]', color: SKY }, { text: '  // virtual — 1:N', color: FGMUTE }] },
      { line: '4', tokens: [{ text: '}', color: FG }] },
      { line: '', tokens: [] },
      { line: '5', tokens: [{ text: 'model ', color: PRP }, { text: 'Post ', color: SKY }, { text: '{', color: FG }] },
      { line: '6', tokens: [{ text: '  id       ', color: FG }, { text: 'String ', color: GRN }, { text: '@id @default(cuid())', color: AMB }] },
      { line: '7', tokens: [{ text: '  title    ', color: FG }, { text: 'String', color: GRN }] },
      { line: '8', tokens: [{ text: '  authorId ', color: FG }, { text: 'String', color: GRN }, { text: '  // FK — sem @unique', color: FGMUTE }] },
      { line: '9', tokens: [{ text: '  author   ', color: FG }, { text: 'User   ', color: SKY }, { text: '@relation(fields: [authorId], references: [id])', color: AMB }] },
      { line: '10', tokens: [{ text: '  ', color: FG }, { text: '@@index([authorId])', color: AMB }, { text: '  // CRÍTICO para queries', color: FGMUTE }] },
      { line: '11', tokens: [{ text: '}', color: FG }] },
    ],
    tables: ['users (id, ...)', 'posts (id, title, authorId → users.id)'],
    caveats: 'O lado "many" tem a FK; o lado "one" tem array virtual (Post[]) — não vira coluna no banco. SEMPRE adicionar @@index([authorId]) — sem ele, queries por author fazem full scan.',
  },
  {
    id: 'many-many-implicit',
    label: 'N : N implícita — Posts e Tags',
    cardinality: 'N ←→ N',
    color: AMB,
    scenario: 'Posts têm muitas Tags, Tags estão em muitos Posts. Sem metadados extras na junção (apenas a associação).',
    schema: [
      { line: '1', tokens: [{ text: 'model ', color: PRP }, { text: 'Post ', color: SKY }, { text: '{', color: FG }] },
      { line: '2', tokens: [{ text: '  id   ', color: FG }, { text: 'String ', color: GRN }, { text: '@id @default(cuid())', color: AMB }] },
      { line: '3', tokens: [{ text: '  tags ', color: FG }, { text: 'Tag[]', color: SKY }, { text: '   // N:N implícita', color: FGMUTE }] },
      { line: '4', tokens: [{ text: '}', color: FG }] },
      { line: '', tokens: [] },
      { line: '5', tokens: [{ text: 'model ', color: PRP }, { text: 'Tag ', color: SKY }, { text: '{', color: FG }] },
      { line: '6', tokens: [{ text: '  id    ', color: FG }, { text: 'String ', color: GRN }, { text: '@id @default(cuid())', color: AMB }] },
      { line: '7', tokens: [{ text: '  name  ', color: FG }, { text: 'String ', color: GRN }, { text: '@unique', color: AMB }] },
      { line: '8', tokens: [{ text: '  posts ', color: FG }, { text: 'Post[]', color: SKY }] },
      { line: '9', tokens: [{ text: '}', color: FG }] },
      { line: '', tokens: [] },
      { line: '', tokens: [{ text: '// Prisma cria automaticamente:', color: FGMUTE }] },
      { line: '', tokens: [{ text: '// _PostToTag (A → posts.id, B → tags.id)', color: FGMUTE }] },
    ],
    tables: ['posts (id, ...)', 'tags (id, name)', '_PostToTag (A, B) — gerada automaticamente'],
    caveats: 'Sem campos extras na junção — apenas IDs. Use quando você só precisa da associação. Ganho: API simples (post.tags retorna Tag[]). Perda: sem controle sobre a tabela de junção.',
  },
  {
    id: 'many-many-explicit',
    label: 'N : N explícita — com metadados',
    cardinality: 'N ←→ N + meta',
    color: PRP,
    scenario: 'Posts têm muitas Tags, mas você precisa registrar quem associou (assignedBy) e quando (assignedAt). Junção com payload.',
    schema: [
      { line: '1', tokens: [{ text: 'model ', color: PRP }, { text: 'Post ', color: SKY }, { text: '{', color: FG }] },
      { line: '2', tokens: [{ text: '  id   ', color: FG }, { text: 'String     ', color: GRN }, { text: '@id @default(cuid())', color: AMB }] },
      { line: '3', tokens: [{ text: '  tags ', color: FG }, { text: 'PostTag[]', color: SKY }, { text: '  // via tabela explícita', color: FGMUTE }] },
      { line: '4', tokens: [{ text: '}', color: FG }] },
      { line: '', tokens: [] },
      { line: '5', tokens: [{ text: 'model ', color: PRP }, { text: 'Tag ', color: SKY }, { text: '{', color: FG }] },
      { line: '6', tokens: [{ text: '  id    ', color: FG }, { text: 'String     ', color: GRN }, { text: '@id @default(cuid())', color: AMB }] },
      { line: '7', tokens: [{ text: '  name  ', color: FG }, { text: 'String     ', color: GRN }, { text: '@unique', color: AMB }] },
      { line: '8', tokens: [{ text: '  posts ', color: FG }, { text: 'PostTag[]', color: SKY }] },
      { line: '9', tokens: [{ text: '}', color: FG }] },
      { line: '', tokens: [] },
      { line: '10', tokens: [{ text: 'model ', color: PRP }, { text: 'PostTag ', color: SKY }, { text: '{', color: FG }] },
      { line: '11', tokens: [{ text: '  postId     ', color: FG }, { text: 'String', color: GRN }] },
      { line: '12', tokens: [{ text: '  tagId      ', color: FG }, { text: 'String', color: GRN }] },
      { line: '13', tokens: [{ text: '  assignedAt ', color: FG }, { text: 'DateTime ', color: GRN }, { text: '@default(now())', color: AMB }, { text: '  // metadado', color: FGMUTE }] },
      { line: '14', tokens: [{ text: '  assignedBy ', color: FG }, { text: 'String', color: GRN }, { text: '   // metadado', color: FGMUTE }] },
      { line: '15', tokens: [{ text: '  post       ', color: FG }, { text: 'Post ', color: SKY }, { text: '@relation(fields: [postId], references: [id])', color: AMB }] },
      { line: '16', tokens: [{ text: '  tag        ', color: FG }, { text: 'Tag  ', color: SKY }, { text: '@relation(fields: [tagId], references: [id])', color: AMB }] },
      { line: '17', tokens: [{ text: '  ', color: FG }, { text: '@@id([postId, tagId])', color: AMB }, { text: '  // PK composta', color: FGMUTE }] },
      { line: '18', tokens: [{ text: '}', color: FG }] },
    ],
    tables: ['posts (id, ...)', 'tags (id, name)', 'PostTag (postId, tagId, assignedAt, assignedBy) — PK composta'],
    caveats: 'Use quando precisar de campos extras na junção (timestamps, status, quem associou). Custo: API mais verbosa (precisa fazer .tags.map(pt => pt.tag) para obter as tags).',
  },
]

function RelationsVisual() {
  const [active, setActive] = useState(0)
  const r = RELATIONS[active]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Tabs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 6,
      }}>
        {RELATIONS.map((rel, i) => (
          <button
            key={rel.id}
            onClick={() => setActive(i)}
            style={{
              background: active === i ? `${rel.color}15` : CARD,
              border: `2px solid ${active === i ? rel.color : LINE}`,
              borderRadius: 10,
              padding: '12px 10px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all .2s',
              textAlign: 'center' as const,
            }}
          >
            <div style={{
              fontSize: 14,
              color: active === i ? rel.color : FG,
              fontWeight: 700,
              fontFamily: "'JetBrains Mono', monospace",
              marginBottom: 4,
            }}>
              {rel.cardinality}
            </div>
            <div style={{ fontSize: 11, color: FGMUTE }}>{rel.label.split(' — ')[1] ?? rel.label}</div>
          </button>
        ))}
      </div>

      {/* Cenário */}
      <div style={{
        background: CARD,
        borderRadius: 10,
        padding: 16,
        borderLeft: `3px solid ${r.color}`,
      }}>
        <div style={{ fontSize: 10, color: r.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>
          Cenário
        </div>
        <p style={{ fontSize: 13, color: FG, margin: 0, lineHeight: 1.6 }}>{r.scenario}</p>
      </div>

      {/* Schema + Tabelas geradas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 }}>
        <div style={{ background: BG, borderRadius: 10, border: `1px solid ${LINE}`, padding: 16 }}>
          <div style={{ fontSize: 10, color: r.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>
            Schema Prisma
          </div>
          <pre style={{
            margin: 0,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            lineHeight: 1.7,
          }}>
            {r.schema.map((row, i) => (
              <div key={i} style={{ display: 'flex', gap: 10 }}>
                <span style={{ color: '#475569', userSelect: 'none' as const, width: 18, textAlign: 'right' as const }}>{row.line}</span>
                <span>
                  {row.tokens.map((tk, j) => (
                    <span key={j} style={{ color: tk.color || FG }}>{tk.text}</span>
                  ))}
                </span>
              </div>
            ))}
          </pre>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: CARD, borderRadius: 10, padding: 14, border: `1px solid ${LINE}` }}>
            <div style={{ fontSize: 10, color: r.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>
              Tabelas no banco
            </div>
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
              {r.tables.map((t, i) => (
                <li key={i} style={{
                  fontSize: 11,
                  color: FG,
                  fontFamily: "'JetBrains Mono', monospace",
                  background: BG,
                  padding: '6px 10px',
                  borderRadius: 6,
                  marginBottom: 6,
                  borderLeft: `3px solid ${r.color}40`,
                }}>{t}</li>
              ))}
            </ul>
          </div>
          <div style={{
            background: `${AMB}10`,
            border: `1px solid ${AMB}30`,
            borderRadius: 10,
            padding: 14,
          }}>
            <div style={{ fontSize: 10, color: AMB, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>
              Atenção
            </div>
            <p style={{ fontSize: 11, color: FG, margin: 0, lineHeight: 1.55 }}>{r.caveats}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — select vs include — type narrowing
// Justificativa: a diferença é cobrada em entrevista e os tipos retornados são
// diferentes. Mostrar input → tipo TS inferido lado a lado é a forma mais
// clara de fixar quando usar cada um.
// ═══════════════════════════════════════════════════════════════════════════════

interface QueryShape {
  id: string
  title: string
  variant: 'base' | 'select' | 'include' | 'nested'
  color: string
  description: string
  query: { line: string; tokens: { text: string; color?: string }[] }[]
  inferredType: { line: string; tokens: { text: string; color?: string }[] }[]
  payload: string
  payloadKb: string
}

const QUERY_SHAPES: QueryShape[] = [
  {
    id: 'base',
    title: 'Sem select nem include — tipo base completo',
    variant: 'base',
    color: FGMUTE,
    description: 'Sem modificadores, retorna todos os campos escalares do model — Json e Text inclusos. Não inclui relações (você não vê posts em User).',
    query: [
      { line: '1', tokens: [{ text: 'const users = ', color: FG }, { text: 'await ', color: PRP }, { text: 'prisma.', color: FG }, { text: 'user', color: SKY }, { text: '.findMany()', color: FG }] },
    ],
    inferredType: [
      { line: '1', tokens: [{ text: '// users: ', color: FGMUTE }, { text: 'User[]', color: GRN }] },
      { line: '2', tokens: [{ text: '// User = {', color: FGMUTE }] },
      { line: '3', tokens: [{ text: '//   id: ', color: FGMUTE }, { text: 'string', color: GRN }, { text: ',', color: FGMUTE }] },
      { line: '4', tokens: [{ text: '//   email: ', color: FGMUTE }, { text: 'string', color: GRN }, { text: ',', color: FGMUTE }] },
      { line: '5', tokens: [{ text: '//   name: ', color: FGMUTE }, { text: 'string | null', color: GRN }, { text: ',', color: FGMUTE }] },
      { line: '6', tokens: [{ text: '//   bio: ', color: FGMUTE }, { text: 'string | null', color: GRN }, { text: ',  // Text — pesado', color: AMB }] },
      { line: '7', tokens: [{ text: '//   metadata: ', color: FGMUTE }, { text: 'Prisma.JsonValue', color: GRN }, { text: ',', color: FGMUTE }] },
      { line: '8', tokens: [{ text: '//   createdAt: ', color: FGMUTE }, { text: 'Date', color: GRN }, { text: ',', color: FGMUTE }] },
      { line: '9', tokens: [{ text: '//   updatedAt: ', color: FGMUTE }, { text: 'Date', color: GRN }, { text: ',', color: FGMUTE }] },
      { line: '10', tokens: [{ text: '// }', color: FGMUTE }] },
    ],
    payload: 'Todos os escalares (incluindo Text e Json grandes)',
    payloadKb: '~5 KB / user',
  },
  {
    id: 'select',
    title: 'Com select — tipo estreitado para os campos pedidos',
    variant: 'select',
    color: GRN,
    description: 'select é WHITELIST. O TypeScript estreita o tipo de retorno para conter SOMENTE os campos pedidos. Reduz payload, memória e tempo de query.',
    query: [
      { line: '1', tokens: [{ text: 'const users = ', color: FG }, { text: 'await ', color: PRP }, { text: 'prisma.', color: FG }, { text: 'user', color: SKY }, { text: '.findMany({', color: FG }] },
      { line: '2', tokens: [{ text: '  select: { ', color: FG }, { text: 'id: ', color: AMB }, { text: 'true', color: GRN }, { text: ', ', color: FG }, { text: 'email: ', color: AMB }, { text: 'true', color: GRN }, { text: ' }', color: FG }] },
      { line: '3', tokens: [{ text: '})', color: FG }] },
    ],
    inferredType: [
      { line: '1', tokens: [{ text: '// users: { id: ', color: FGMUTE }, { text: 'string', color: GRN }, { text: '; email: ', color: FGMUTE }, { text: 'string', color: GRN }, { text: ' }[]', color: FGMUTE }] },
      { line: '2', tokens: [] },
      { line: '3', tokens: [{ text: '// ↑ tipo INFERIDO automaticamente', color: AMB }] },
      { line: '4', tokens: [{ text: '// Sem name, sem bio, sem metadata, sem timestamps', color: FGMUTE }] },
      { line: '5', tokens: [{ text: '// Compilador rejeita user.bio:', color: FGMUTE }] },
      { line: '6', tokens: [{ text: "//   Property 'bio' does not exist", color: RED }] },
    ],
    payload: 'Somente os campos pedidos — payload mínimo',
    payloadKb: '~80 B / user',
  },
  {
    id: 'include',
    title: 'Com include — tipo base + relações adicionadas',
    variant: 'include',
    color: SKY,
    description: 'include adiciona RELAÇÕES ao tipo base, mantendo todos os campos escalares. Use quando precisa do registro completo + relações relacionadas.',
    query: [
      { line: '1', tokens: [{ text: 'const users = ', color: FG }, { text: 'await ', color: PRP }, { text: 'prisma.', color: FG }, { text: 'user', color: SKY }, { text: '.findMany({', color: FG }] },
      { line: '2', tokens: [{ text: '  include: { ', color: FG }, { text: 'posts: ', color: AMB }, { text: 'true', color: GRN }, { text: ' }', color: FG }] },
      { line: '3', tokens: [{ text: '})', color: FG }] },
    ],
    inferredType: [
      { line: '1', tokens: [{ text: '// users: (User & { posts: Post[] })[]', color: FGMUTE }] },
      { line: '2', tokens: [] },
      { line: '3', tokens: [{ text: '// Tipo base completo + array de Post', color: AMB }] },
      { line: '4', tokens: [{ text: '// users[0].name → string | null', color: FGMUTE }] },
      { line: '5', tokens: [{ text: '// users[0].posts → Post[]  ← novo', color: GRN }] },
      { line: '6', tokens: [{ text: '// users[0].posts[0].title → string', color: FGMUTE }] },
    ],
    payload: 'Todos os campos do User + todos os campos de cada Post',
    payloadKb: '~5 KB + N × 3 KB',
  },
  {
    id: 'nested',
    title: 'select aninhado em select — para combinar limitação + relação',
    variant: 'nested',
    color: AMB,
    description: 'Não se pode usar select e include juntos no mesmo nível. Para limitar campos do pai E incluir campos da relação, use select com select aninhado.',
    query: [
      { line: '1', tokens: [{ text: 'const users = ', color: FG }, { text: 'await ', color: PRP }, { text: 'prisma.', color: FG }, { text: 'user', color: SKY }, { text: '.findMany({', color: FG }] },
      { line: '2', tokens: [{ text: '  select: {', color: FG }] },
      { line: '3', tokens: [{ text: '    ', color: FG }, { text: 'id: ', color: AMB }, { text: 'true', color: GRN }, { text: ',', color: FG }] },
      { line: '4', tokens: [{ text: '    ', color: FG }, { text: 'email: ', color: AMB }, { text: 'true', color: GRN }, { text: ',', color: FG }] },
      { line: '5', tokens: [{ text: '    ', color: FG }, { text: 'posts: ', color: AMB }, { text: '{ select: { id: ', color: FG }, { text: 'true', color: GRN }, { text: ', title: ', color: FG }, { text: 'true', color: GRN }, { text: ' } }', color: FG }] },
      { line: '6', tokens: [{ text: '  }', color: FG }] },
      { line: '7', tokens: [{ text: '})', color: FG }] },
    ],
    inferredType: [
      { line: '1', tokens: [{ text: '// users: {', color: FGMUTE }] },
      { line: '2', tokens: [{ text: '//   id: string;', color: FGMUTE }] },
      { line: '3', tokens: [{ text: '//   email: string;', color: FGMUTE }] },
      { line: '4', tokens: [{ text: '//   posts: { id: string; title: string }[]', color: FGMUTE }] },
      { line: '5', tokens: [{ text: '// }[]', color: FGMUTE }] },
      { line: '6', tokens: [] },
      { line: '7', tokens: [{ text: '// payload mínimo + relação enxuta', color: GRN }] },
    ],
    payload: 'Apenas campos pedidos no User e nos Posts',
    payloadKb: '~120 B + N × 80 B',
  },
]

function SelectIncludeVisual() {
  const [active, setActive] = useState(0)
  const q = QUERY_SHAPES[active]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
        {QUERY_SHAPES.map((qs, i) => (
          <button
            key={qs.id}
            onClick={() => setActive(i)}
            style={{
              background: active === i ? `${qs.color}15` : CARD,
              border: `2px solid ${active === i ? qs.color : LINE}`,
              borderRadius: 10,
              padding: 12,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all .2s',
              textAlign: 'left' as const,
            }}
          >
            <code style={{
              fontSize: 12,
              color: active === i ? qs.color : FG,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              display: 'block',
              marginBottom: 3,
            }}>
              {qs.variant}
            </code>
            <div style={{ fontSize: 10, color: FGMUTE, lineHeight: 1.4 }}>{qs.payloadKb}</div>
          </button>
        ))}
      </div>

      {/* Descrição */}
      <div style={{ background: CARD, borderRadius: 10, padding: 14, borderLeft: `3px solid ${q.color}` }}>
        <div style={{ fontSize: 14, color: q.color, fontWeight: 700, marginBottom: 6 }}>{q.title}</div>
        <p style={{ fontSize: 12, color: FG, margin: 0, lineHeight: 1.6 }}>{q.description}</p>
      </div>

      {/* Code + Inferred type lado a lado */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ background: BG, borderRadius: 10, border: `1px solid ${LINE}`, padding: 14 }}>
          <div style={{ fontSize: 10, color: SKY, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>
            Query
          </div>
          <pre style={{ margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, lineHeight: 1.75 }}>
            {q.query.map((row, i) => (
              <div key={i} style={{ display: 'flex', gap: 10 }}>
                <span style={{ color: '#475569', userSelect: 'none' as const, width: 14, textAlign: 'right' as const }}>{row.line}</span>
                <span>
                  {row.tokens.map((tk, j) => (
                    <span key={j} style={{ color: tk.color || FG }}>{tk.text}</span>
                  ))}
                </span>
              </div>
            ))}
          </pre>
        </div>

        <div style={{ background: BG, borderRadius: 10, border: `1px solid ${q.color}40`, padding: 14 }}>
          <div style={{ fontSize: 10, color: q.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>
            Tipo TS inferido
          </div>
          <pre style={{ margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, lineHeight: 1.75 }}>
            {q.inferredType.map((row, i) => (
              <div key={i} style={{ display: 'flex', gap: 10 }}>
                <span style={{ color: '#475569', userSelect: 'none' as const, width: 14, textAlign: 'right' as const }}>{row.line}</span>
                <span>
                  {row.tokens.map((tk, j) => (
                    <span key={j} style={{ color: tk.color || FG }}>{tk.text}</span>
                  ))}
                </span>
              </div>
            ))}
          </pre>
        </div>
      </div>

      {/* Payload */}
      <div style={{
        background: BG,
        border: `1px solid ${LINE}`,
        borderRadius: 10,
        padding: 14,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
      }}>
        <div>
          <div style={{ fontSize: 10, color: q.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>
            Payload retornado
          </div>
          <p style={{ fontSize: 12, color: FG, margin: 0, lineHeight: 1.55 }}>{q.payload}</p>
        </div>
        <div>
          <div style={{ fontSize: 10, color: q.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>
            Tamanho aproximado
          </div>
          <code style={{ fontSize: 13, color: q.color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
            {q.payloadKb}
          </code>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Decision Tree: dev vs deploy vs db push
// Justificativa: confundir os 3 comandos de migration é o erro mais comum em
// produção. Árvore de decisão por contexto (dev local, CI, prototype) deixa
// claro qual usar quando.
// ═══════════════════════════════════════════════════════════════════════════════

const MIGRATE_ROOT: DTNode = {
  id: 'root',
  question: 'Onde você está rodando o comando?',
  children: [
    { label: 'Dev local — meu laptop, banco de teste', nodeId: 'local', color: SKY },
    { label: 'CI/CD ou produção', nodeId: 'prod', color: GRN },
    { label: 'Prototipação rápida — joga fora depois', nodeId: 'proto', color: AMB },
  ],
}

const MIGRATE_NODES: Record<string, DTNode> = {
  local: {
    id: 'local',
    question: 'Você editou o schema.prisma e quer aplicar?',
    children: [
      { label: 'Sim — quero gerar a migration', nodeId: 'dev', color: SKY },
      { label: 'Não — apenas regenerar o client', nodeId: 'gen', color: PRP },
      { label: 'Banco bagunçado — quero zerar', nodeId: 'reset', color: RED },
    ],
  },
  prod: {
    id: 'prod',
    recommendation: 'prisma migrate deploy',
    detail: 'Único comando seguro em produção. Aplica migrations já versionadas em ordem cronológica, sem gerar novas. Idempotente — rodar duas vezes não causa problema. Faz lock no banco para impedir aplicações simultâneas em CI paralelo. Garante que o que rodou em staging é exatamente o que vai rodar em prod.',
    color: GRN,
    icon: 'OK',
  },
  proto: {
    id: 'proto',
    recommendation: 'prisma db push',
    detail: 'Sincroniza schema → banco SEM gerar migration. Útil para protótipos descartáveis ou desenho rápido de schema. NUNCA use em produção: pula histórico, sem rollback controlado, sem possibilidade de revisar SQL antes de aplicar. Em projetos sérios, sempre vire para migrate dev assim que o schema estabilizar.',
    color: AMB,
    icon: 'PROTO',
  },
  dev: {
    id: 'dev',
    recommendation: 'prisma migrate dev --name short_description',
    detail: 'Comando completo de desenvolvimento: (1) calcula diff entre schema atual e migrations já aplicadas; (2) gera arquivo SQL em prisma/migrations/{timestamp}_{name}/migration.sql; (3) aplica no banco local; (4) regenera @prisma/client com novos tipos. Pode pedir reset se detectar drift. Use --create-only se quiser só criar a migration sem aplicar (revisar antes).',
    color: SKY,
    icon: 'DEV',
  },
  gen: {
    id: 'gen',
    recommendation: 'prisma generate',
    detail: 'Apenas regenera o @prisma/client com tipos atualizados — não toca no banco. Útil quando você fez pull de migrations do colega e precisa atualizar o client. Roda automático no postinstall e depois de migrate dev. No CI/build, sempre execute antes do build do app.',
    color: PRP,
    icon: 'GEN',
  },
  reset: {
    id: 'reset',
    recommendation: 'prisma migrate reset',
    detail: 'DROP de todo o banco e re-aplica todas as migrations do zero. Útil quando o banco local divergiu (drift) ou está com dados de teste corrompidos. Roda automaticamente o seed (prisma/seed.ts) ao final. NUNCA em produção — apaga TUDO. Em CI de teste pode ser útil para garantir banco limpo entre runs.',
    color: RED,
    icon: 'RESET',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Transactions ($transaction sequencial, interativa, batch)
// Justificativa: 3 modos com semânticas diferentes — sequencial (array atômico),
// interativa (com lógica entre operações), e nested writes (atômicos por design).
// CodeStepper mostra cada um executando linha a linha com estado.
// ═══════════════════════════════════════════════════════════════════════════════

const TX_SCENARIOS: CodeStepperScenario[] = [
  {
    id: 'sequential',
    label: 'Sequential — array atômico',
    code: `// 1. Lê dados do form
const data = await req.json()

// 2. Cria User + Post atomicamente
const [user, post] = await prisma.$transaction([
  prisma.user.create({
    data: { email: data.email, name: data.name }
  }),
  prisma.post.create({
    data: { title: data.title, authorId: data.userId }
  })
])

// 3. Se chegou aqui, ambos commitaram juntos
return Response.json({ user, post })`,
    language: 'typescript',
    steps: [
      {
        lineStart: 2,
        lineEnd: 2,
        title: 'Lê dados do request',
        explanation: 'Antes da transação — pode falhar sem afetar o banco.',
      },
      {
        lineStart: 5,
        lineEnd: 5,
        title: '$transaction([...]) — array sequencial',
        explanation: 'Recebe array de operações Prisma (não de promises!). Prisma envia BEGIN ao banco e abre transação.',
        output: 'BEGIN TRANSACTION',
      },
      {
        lineStart: 6,
        lineEnd: 8,
        title: 'Op 1 — INSERT INTO users',
        explanation: 'Primeira operação executa dentro da transação. Se falhar (ex: email duplicado), a transação faz ROLLBACK imediato e o erro propaga.',
        output: 'INSERT INTO users (email, name) VALUES (...)',
      },
      {
        lineStart: 9,
        lineEnd: 11,
        title: 'Op 2 — INSERT INTO posts',
        explanation: 'Segunda operação. Se falhar (ex: authorId inválido), ROLLBACK reverte INCLUSIVE o INSERT do User. Tudo ou nada.',
        output: 'INSERT INTO posts (title, authorId) VALUES (...)',
      },
      {
        lineStart: 12,
        lineEnd: 12,
        title: 'COMMIT',
        explanation: 'Todas as operações sucederam. Prisma envia COMMIT — ambas as inserções viram visíveis. Retorna array com os resultados na mesma ordem.',
        output: 'COMMIT — [user, post] retornados',
        memory: { user: 'User criado', post: 'Post criado' },
      },
      {
        lineStart: 15,
        lineEnd: 15,
        title: 'Resposta ao cliente',
        explanation: 'Depois do commit, retorna ao usuário. Use sequential quando: (a) operações são INDEPENDENTES (não precisa do resultado de uma para a próxima); (b) quer atomicidade simples.',
      },
    ],
  },
  {
    id: 'interactive',
    label: 'Interactive — lógica entre operações',
    code: `// Transferência bancária — lógica entre reads e writes
const result = await prisma.$transaction(async (tx) => {
  const sender = await tx.account.findUniqueOrThrow({
    where: { id: senderId }
  })

  if (sender.balance < amount) {
    throw new InsufficientFundsError()
  }

  await tx.account.update({
    where: { id: senderId },
    data: { balance: { decrement: amount } }
  })
  await tx.account.update({
    where: { id: receiverId },
    data: { balance: { increment: amount } }
  })

  return tx.transfer.create({
    data: { senderId, receiverId, amount }
  })
}, {
  isolationLevel: 'Serializable',
  timeout: 10000
})`,
    language: 'typescript',
    steps: [
      {
        lineStart: 2,
        lineEnd: 2,
        title: '$transaction(async (tx) => {})',
        explanation: 'Recebe callback com cliente transacional tx. CRÍTICO: use sempre tx, nunca o prisma global — chamar prisma.X dentro do callback executa FORA da transação.',
        output: 'BEGIN TRANSACTION (Serializable)',
      },
      {
        lineStart: 3,
        lineEnd: 5,
        title: 'Lê saldo do sender com tx',
        explanation: 'Read dentro da transação. Em Serializable, o snapshot é consistente até o commit.',
        memory: { 'sender.balance': '500.00' },
      },
      {
        lineStart: 7,
        lineEnd: 9,
        title: 'Lógica condicional — VALIDAÇÃO',
        explanation: 'Aqui está a vantagem do interactive: você pode RAMIFICAR o fluxo baseado em dados lidos. throw faz ROLLBACK automático.',
      },
      {
        lineStart: 11,
        lineEnd: 14,
        title: 'Decrement no sender',
        explanation: 'Update atômico via { decrement: N } — operação no banco, não read-modify-write em memória.',
        output: 'UPDATE accounts SET balance = balance - 100 WHERE id = senderId',
      },
      {
        lineStart: 15,
        lineEnd: 18,
        title: 'Increment no receiver',
        explanation: 'Mesma lógica. Em Serializable, write-write contention pode causar serialization failure — você pega o erro e re-tenta com backoff.',
        output: 'UPDATE accounts SET balance = balance + 100 WHERE id = receiverId',
      },
      {
        lineStart: 20,
        lineEnd: 22,
        title: 'Audit trail na mesma transação',
        explanation: 'Cria registro de transferência no mesmo átomo — se algo falhar acima, audit trail também reverte. Consistência forte.',
        output: 'INSERT INTO transfers (senderId, receiverId, amount) VALUES (...)',
      },
      {
        lineStart: 23,
        lineEnd: 26,
        title: 'Opções: isolationLevel + timeout',
        explanation: 'Serializable previne phantom reads e write skew (mais forte). timeout: 10s — após isso, ROLLBACK automático e erro. Default é 5s — em transações longas, ajuste.',
        output: 'COMMIT (ou ROLLBACK em caso de erro)',
      },
    ],
  },
  {
    id: 'nested',
    label: 'Nested writes — atômicos por design',
    code: `// Cria User + Profile + Posts em uma única chamada
// Tudo é atômico automaticamente — sem $transaction necessário
const user = await prisma.user.create({
  data: {
    email: 'ana@example.com',
    name: 'Ana',
    profile: {
      create: { bio: 'Engineer @ acme' }
    },
    posts: {
      create: [
        { title: 'Hello world' },
        { title: 'Second post' }
      ]
    }
  },
  include: {
    profile: true,
    posts: true
  }
})

// Retorna o User completo com profile e posts já populados`,
    language: 'typescript',
    steps: [
      {
        lineStart: 3,
        lineEnd: 4,
        title: 'prisma.user.create — operação root',
        explanation: 'Cria o User. Mas data tem objetos aninhados — Prisma detecta nested writes e abre transação implícita.',
        output: 'BEGIN TRANSACTION',
      },
      {
        lineStart: 5,
        lineEnd: 6,
        title: 'INSERT INTO users',
        explanation: 'Primeiro insere o User principal — Prisma precisa do ID gerado para preencher as FKs dos filhos.',
        output: 'INSERT INTO users (email, name) RETURNING id',
        memory: { 'user.id': 'cuid_xxx' },
      },
      {
        lineStart: 7,
        lineEnd: 9,
        title: 'profile: { create: {...} }',
        explanation: 'Cria Profile com userId apontando ao User recém-criado. Tudo na mesma transação — se falhar, User é revertido também.',
        output: 'INSERT INTO profiles (bio, userId) VALUES ("Engineer", "cuid_xxx")',
      },
      {
        lineStart: 10,
        lineEnd: 15,
        title: 'posts: { create: [...] }',
        explanation: 'Array de creates — N inserts de Post com authorId apontando ao User. Todos atômicos.',
        output: 'INSERT INTO posts (title, authorId) VALUES (...) -- 2 vezes',
      },
      {
        lineStart: 16,
        lineEnd: 19,
        title: 'include retorna tudo populado',
        explanation: 'Sem precisar de outra query, o resultado já vem com profile e posts inclusos. Eficiência máxima.',
        output: 'COMMIT',
      },
      {
        lineStart: 23,
        lineEnd: 23,
        title: 'Resultado',
        explanation: 'Use nested writes quando você está criando uma árvore de objetos relacionados em uma operação. Mais limpo que $transaction com creates separados — Prisma garante atomicidade automaticamente.',
        memory: { user: '{ id, email, profile: {...}, posts: [...] }' },
      },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Anti-patterns
// Justificativa: N+1, prisma global em transação, db push em prod, query
// inline em useEffect — erros recorrentes que aparecem em code review.
// AntiPatternsGallery torna o reconhecimento de padrão visual.
// ═══════════════════════════════════════════════════════════════════════════════

const PRISMA_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'N+1 query — loop com findUnique em vez de include',
    wrong: [
      [{ text: 'const posts = await prisma.post.findMany()', color: FG }],
      [{ text: 'for (const post of posts) {', color: RED }],
      [{ text: '  // 1 query por post — N+1!', color: FGMUTE }],
      [{ text: '  post.author = await prisma.user.findUnique({', color: RED }],
      [{ text: '    where: { id: post.authorId }', color: FGMUTE }],
      [{ text: '  })', color: RED }],
      [{ text: '}', color: RED }],
      [{ text: '// 100 posts → 101 queries', color: RED }],
    ],
    right: [
      [{ text: 'const posts = await prisma.post.findMany({', color: FG }],
      [{ text: '  include: { author: true }', color: GRN }],
      [{ text: '})', color: FG }],
      [{ text: '// Prisma faz 2 queries internamente:', color: FGMUTE }],
      [{ text: '// SELECT * FROM posts;', color: GRN }],
      [{ text: '// SELECT * FROM users WHERE id IN (...);', color: GRN }],
      [{ text: '// Total: 2 queries para 100 posts', color: GRN }],
    ],
    why: 'Sem include, fazer findUnique em loop gera 1 query por iteração. Com 100 posts, 101 queries — latência multiplica. Prisma com include otimiza para no máximo 2 queries (SELECT da entidade + SELECT IN dos relacionados).',
  },
  {
    title: 'prisma global dentro de $transaction interativa',
    wrong: [
      [{ text: 'await prisma.$transaction(async (tx) => {', color: FG }],
      [{ text: '  const user = await tx.user.findUnique(...)', color: GRN }],
      [{ text: '  if (user.balance < amount) {', color: FG }],
      [{ text: '    // Usa prisma global — FORA DA TRANSAÇÃO!', color: RED }],
      [{ text: '    await prisma.audit.create({ data: ... })', color: RED }],
      [{ text: '  }', color: FG }],
      [{ text: '  await tx.user.update(...)', color: GRN }],
      [{ text: '})', color: FG }],
    ],
    right: [
      [{ text: 'await prisma.$transaction(async (tx) => {', color: FG }],
      [{ text: '  const user = await tx.user.findUnique(...)', color: GRN }],
      [{ text: '  if (user.balance < amount) {', color: FG }],
      [{ text: '    // Sempre tx — dentro da transação', color: GRN }],
      [{ text: '    await tx.audit.create({ data: ... })', color: GRN }],
      [{ text: '  }', color: FG }],
      [{ text: '  await tx.user.update(...)', color: GRN }],
      [{ text: '})', color: FG }],
    ],
    why: 'O callback recebe tx — qualquer chamada com prisma global executa em uma conexão diferente, FORA da transação. Se a transação faz rollback, o write com prisma persiste — quebra de consistência. Regra: dentro do callback, sempre tx; nunca prisma.',
  },
  {
    title: 'PrismaClient instanciado em cada request (Next.js dev)',
    wrong: [
      [{ text: '// app/api/users/route.ts', color: FGMUTE }],
      [{ text: "import { PrismaClient } from '@prisma/client'", color: FG }],
      [{ text: '', color: FG }],
      [{ text: 'export async function GET() {', color: FG }],
      [{ text: '  const prisma = new PrismaClient()', color: RED }],
      [{ text: '  // hot reload em dev → N instâncias → pool exhaust', color: FGMUTE }],
      [{ text: '  return Response.json(await prisma.user.findMany())', color: FG }],
      [{ text: '}', color: FG }],
    ],
    right: [
      [{ text: '// lib/prisma.ts', color: FGMUTE }],
      [{ text: "import { PrismaClient } from '@prisma/client'", color: FG }],
      [{ text: '', color: FG }],
      [{ text: 'const globalForPrisma = globalThis as unknown as {', color: GRN }],
      [{ text: '  prisma: PrismaClient | undefined', color: GRN }],
      [{ text: '}', color: GRN }],
      [{ text: 'export const prisma = globalForPrisma.prisma ?? new PrismaClient()', color: GRN }],
      [{ text: "if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma", color: GRN }],
      [{ text: '// Importe { prisma } onde precisar', color: FGMUTE }],
    ],
    why: 'Hot reload do Next.js em dev recarrega módulos — sem singleton, cada reload cria nova PrismaClient com seu pool. Em poucos minutos, banco recusa conexões (Postgres tem limite ~100). Em produção, build cria uma única instância naturalmente — mas o pattern globalThis é defensivo.',
  },
  {
    title: 'db push em produção',
    wrong: [
      [{ text: '# .github/workflows/deploy.yml', color: FGMUTE }],
      [{ text: '- name: Deploy', color: FG }],
      [{ text: '  run: |', color: FG }],
      [{ text: '    npx prisma db push', color: RED }],
      [{ text: '    npm run build && npm start', color: FG }],
      [{ text: '# db push pula histórico, sem rollback,', color: RED }],
      [{ text: '# sem revisão de SQL antes de aplicar', color: RED }],
    ],
    right: [
      [{ text: '# .github/workflows/deploy.yml', color: FGMUTE }],
      [{ text: '- name: Generate Prisma Client', color: FG }],
      [{ text: '  run: npx prisma generate', color: GRN }],
      [{ text: '- name: Apply migrations', color: FG }],
      [{ text: '  run: npx prisma migrate deploy', color: GRN }],
      [{ text: '- name: Build', color: FG }],
      [{ text: '  run: npm run build', color: FG }],
      [{ text: '# migrate deploy só aplica versionadas, idempotente,', color: GRN }],
      [{ text: '# SQL revisado em PR antes do merge', color: GRN }],
    ],
    why: 'db push é destrutivo em produção: pula histórico de migrations, impossibilita rollback controlado, e o SQL nunca foi revisado em PR. migrate deploy aplica apenas migrations já versionadas — você revisou o SQL gerado quando rodou migrate dev local. Idempotente = pode rodar duas vezes sem efeito colateral.',
  },
  {
    title: '$queryRawUnsafe com input do usuário',
    wrong: [
      [{ text: 'const userId = req.query.id', color: FG }],
      [{ text: '// SQL injection — interpolação direta', color: RED }],
      [{ text: 'const user = await prisma.$queryRawUnsafe(', color: RED }],
      [{ text: '  `SELECT * FROM users WHERE id = "${userId}"`', color: RED }],
      [{ text: ')', color: RED }],
      [{ text: "// userId='1; DROP TABLE users--' = catastrofe", color: RED }],
    ],
    right: [
      [{ text: 'const userId = req.query.id', color: FG }],
      [{ text: '// $queryRaw com template literal — parametrizado', color: GRN }],
      [{ text: 'const user = await prisma.$queryRaw<User[]>`', color: GRN }],
      [{ text: '  SELECT * FROM users WHERE id = ${userId}', color: GRN }],
      [{ text: '`', color: GRN }],
      [{ text: '// Prisma traduz para: WHERE id = $1, parametrizado', color: GRN }],
      [{ text: '// SQL injection impossível por design', color: GRN }],
    ],
    why: '$queryRawUnsafe interpola string — input do usuário vira SQL literal. $queryRaw com template literal converte ${var} em parâmetro $N do banco — driver escapa. Use Unsafe APENAS quando você está construindo SQL programaticamente sem input externo (ex: ORDER BY dinâmico whitelisted). Nunca com input direto.',
  },
  {
    title: 'orderBy sem tiebreaker em cursor pagination',
    wrong: [
      [{ text: '// Cursor pagination sem tiebreaker', color: FGMUTE }],
      [{ text: 'const posts = await prisma.post.findMany({', color: FG }],
      [{ text: '  take: 20,', color: FG }],
      [{ text: '  cursor: cursor ? { id: cursor } : undefined,', color: FG }],
      [{ text: "  orderBy: { createdAt: 'desc' }", color: RED }],
      [{ text: '  // Posts com mesmo createdAt → ordem indefinida', color: RED }],
      [{ text: '  // Cursor pula registros ou mostra duplicados', color: RED }],
      [{ text: '})', color: FG }],
    ],
    right: [
      [{ text: 'const posts = await prisma.post.findMany({', color: FG }],
      [{ text: '  take: 20,', color: FG }],
      [{ text: '  cursor: cursor ? { id: cursor } : undefined,', color: FG }],
      [{ text: '  skip: cursor ? 1 : 0,', color: GRN }],
      [{ text: '  orderBy: [', color: GRN }],
      [{ text: "    { createdAt: 'desc' },", color: GRN }],
      [{ text: "    { id: 'desc' }  // tiebreaker estável", color: GRN }],
      [{ text: '  ]', color: GRN }],
      [{ text: '})', color: FG }],
    ],
    why: 'Cursor pagination depende de ordem determinística. Se dois registros têm o mesmo createdAt, a ordem é indefinida no banco — cursor pode pular ou duplicar registros entre páginas. Adicione id (PK estável) como segundo critério para garantir ordem total. skip: 1 quando há cursor pula o próprio cursor.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — Prisma vs TypeORM vs Drizzle (ComparisonTable)
// Justificativa: pergunta de entrevista clássica "por que Prisma e não X?".
// Tabela multi-critério mostra trade-offs reais — devs conseguem defender a
// escolha em entrevista.
// ═══════════════════════════════════════════════════════════════════════════════

const ORM_OPTIONS: ComparisonOption[] = [
  { id: 'prisma',  label: 'Prisma',   sublabel: 'v5.x — padrão 2024-25', color: C },
  { id: 'typeorm', label: 'TypeORM',  sublabel: 'maduro mas legado',     color: '#FE0902' },
  { id: 'drizzle', label: 'Drizzle',  sublabel: 'edge-first, SQL-shaped', color: '#C5F74F' },
]

const ORM_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'dx',
    label: 'DX e autocomplete TypeScript',
    category: 'Experiência',
    description: 'Qualidade do autocomplete dos campos e mensagens de erro',
    values: {
      prisma:  { rating: 'excellent', note: 'Tipos profundos, inferência total com select/include' },
      typeorm: { rating: 'fair',      note: 'Decorators ok, mas tipos retornados muitas vezes any' },
      drizzle: { rating: 'excellent', note: 'TypeScript nativo, SQL-shaped, sem DSL extra' },
    },
  },
  {
    id: 'schema',
    label: 'Forma de definir schema',
    category: 'Arquitetura',
    description: 'DSL própria vs decorators vs TypeScript puro',
    values: {
      prisma:  { rating: 'good',      note: 'DSL .prisma — separada do código TS, fonte única' },
      typeorm: { rating: 'fair',      note: 'Decorators espalham metadata pelos models' },
      drizzle: { rating: 'excellent', note: 'TypeScript puro — schema é código' },
    },
  },
  {
    id: 'migrations',
    label: 'Sistema de migrations',
    category: 'Operação',
    description: 'Geração, versionamento e aplicação',
    values: {
      prisma:  { rating: 'excellent', note: 'Diff automático, versionadas, migrate dev/deploy claro' },
      typeorm: { rating: 'fair',      note: 'CLI manual, sync perigoso, edge cases de drop' },
      drizzle: { rating: 'good',      note: 'drizzle-kit gera, mas mais novo' },
    },
  },
  {
    id: 'edge',
    label: 'Edge runtime (Cloudflare/Vercel)',
    category: 'Infra',
    description: 'Suporte a runtimes sem TCP nativo',
    values: {
      prisma:  { rating: 'fair',      note: 'Só com Accelerate (proxy HTTP gerenciado, pago)' },
      typeorm: { rating: 'poor',      note: 'Não suporta — depende de TCP nativo' },
      drizzle: { rating: 'excellent', note: 'Nativo via HTTP drivers (Neon, PlanetScale, D1)' },
    },
  },
  {
    id: 'perf',
    label: 'Performance de query',
    category: 'Performance',
    description: 'Latência end-to-end e overhead do ORM',
    values: {
      prisma:  { rating: 'good',      note: 'Query engine em Rust, mas 1-2ms overhead por query' },
      typeorm: { rating: 'fair',      note: 'JS puro, decorators têm overhead' },
      drizzle: { rating: 'excellent', note: 'Quase raw SQL, overhead mínimo' },
    },
  },
  {
    id: 'bundle',
    label: 'Tamanho do bundle',
    category: 'Performance',
    description: 'Impacto no bundle do client/serverless',
    values: {
      prisma:  { rating: 'poor',      note: '~5MB query engine binário (Rust)' },
      typeorm: { rating: 'fair',      note: 'Médio — JS puro mas decorators metadata pesada' },
      drizzle: { rating: 'excellent', note: 'Leve — sem engine binário' },
    },
  },
  {
    id: 'mongo',
    label: 'Suporte a MongoDB',
    category: 'Bancos',
    description: 'NoSQL além de SQL relacional',
    values: {
      prisma:  { rating: 'fair',      note: 'Suporte limitado, sem todas as features' },
      typeorm: { rating: 'good',      note: 'Suporta MongoDB com mesmo ORM' },
      drizzle: { rating: 'na',        note: 'Apenas SQL — não tem suporte MongoDB' },
    },
  },
  {
    id: 'raw',
    label: 'Escape hatch para raw SQL',
    category: 'Capabilities',
    description: 'Quando o ORM não cobre — quão fácil é cair em SQL puro',
    values: {
      prisma:  { rating: 'good',      note: '$queryRaw / $executeRaw com Prisma.sql parametrizado' },
      typeorm: { rating: 'good',      note: 'QueryBuilder + raw fácil' },
      drizzle: { rating: 'excellent', note: 'sql tag template é cidadão de 1ª classe' },
    },
  },
  {
    id: 'community',
    label: 'Maturidade e ecossistema',
    category: 'Adoção',
    description: 'Tamanho da comunidade e tutoriais',
    values: {
      prisma:  { rating: 'excellent', note: 'Padrão de mercado 2024-25, milhares de tutoriais' },
      typeorm: { rating: 'good',      note: 'Maduro mas comunidade migrando para Prisma' },
      drizzle: { rating: 'good',      note: 'Crescimento explosivo, ecossistema novo' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// Main
// ═══════════════════════════════════════════════════════════════════════════════

export default function PrismaVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'pipeline',
      title: 'Pipeline schema → migrate → client',
      subtitle: 'Os 4 estágios e os artefatos que cada um produz',
      accent: C,
      component: <PipelineVisual />,
    },
    {
      id: 'relations',
      title: 'Relações 1:1, 1:N, N:N',
      subtitle: 'Schema, tabelas geradas e quando usar cada tipo',
      accent: SKY,
      component: <RelationsVisual />,
    },
    {
      id: 'select-include',
      title: 'select vs include — type narrowing',
      subtitle: 'Como o tipo TS muda conforme você modifica a query',
      accent: GRN,
      component: <SelectIncludeVisual />,
    },
    {
      id: 'migrate-decision',
      title: 'migrate dev vs deploy vs db push',
      subtitle: 'Qual comando usar em cada contexto — árvore de decisão',
      accent: AMB,
      component: (
        <DecisionTree
          root={MIGRATE_ROOT}
          nodes={MIGRATE_NODES}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'transactions',
      title: 'Transactions — sequencial, interactive, nested',
      subtitle: 'Os 3 modos passo a passo com SQL gerado e estado',
      accent: PRP,
      component: (
        <CodeStepper
          scenarios={TX_SCENARIOS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns do Prisma',
      subtitle: 'N+1, prisma global em tx, db push em prod, raw injection',
      accent: RED,
      component: (
        <AntiPatternsGallery
          patterns={PRISMA_ANTIPATTERNS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'orm-comparison',
      title: 'Prisma vs TypeORM vs Drizzle',
      subtitle: 'Comparação multi-critério para escolher o ORM certo',
      accent: SEC,
      component: (
        <ComparisonTable
          options={ORM_OPTIONS}
          criteria={ORM_CRITERIA}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD2}
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
