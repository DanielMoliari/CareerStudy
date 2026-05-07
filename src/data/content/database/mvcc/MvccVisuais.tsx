'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { ConceptCarousel } from '@/components/visuals/ConceptCarousel'
import type { Slide } from '@/components/visuals/ConceptCarousel'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { CodeStepper } from '@/components/visuals/CodeStepper'
import type { CodeStepperScenario } from '@/components/visuals/CodeStepper'
import { ProgressionMap } from '@/components/visuals/ProgressionMap'
import type { ProgressionLevel } from '@/components/visuals/ProgressionMap'

// ── Paleta MVCC (Postgres tones) ──────────────────────────────────────────────
const C      = '#5b9bd5'   // Postgres blue (tom mais claro)
const SEC    = '#336791'
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#22c55e'
const RED    = '#ef4444'
const AMB    = '#f59e0b'
const PRP    = '#a78bfa'
const SKY    = '#38bdf8'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Versionamento de tupla (ConceptCarousel)
// ═══════════════════════════════════════════════════════════════════════════════

function TupleViz({ rows }: { rows: Array<{ xmin: string; xmax: string; data: string; status: 'live' | 'dead' | 'new' | 'incoming'; color: string; label: string }> }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontFamily: "'JetBrains Mono', monospace" }}>
      {rows.map((r, i) => (
        <div
          key={i}
          style={{
            background: r.status === 'dead' ? '#2a1a1a' : r.status === 'new' ? '#162a40' : r.status === 'incoming' ? '#1a2a16' : CARD,
            border: `1.5px solid ${r.color}`,
            borderRadius: 8,
            padding: '14px 18px',
            opacity: r.status === 'dead' ? 0.7 : 1,
            position: 'relative',
          }}
        >
          <div style={{ position: 'absolute', top: -10, left: 14, background: BG, padding: '2px 8px', fontSize: 9, color: r.color, fontWeight: 700, letterSpacing: '.06em' }}>
            {r.label}
          </div>
          <div style={{ display: 'flex', gap: 18, alignItems: 'center', marginTop: 4 }}>
            <div style={{ fontSize: 11, color: FGMUTE }}>
              <span style={{ color: r.color, fontWeight: 700 }}>xmin</span>={r.xmin}
            </div>
            <div style={{ fontSize: 11, color: FGMUTE }}>
              <span style={{ color: r.color, fontWeight: 700 }}>xmax</span>={r.xmax}
            </div>
            <div style={{ fontSize: 11, color: FG, marginLeft: 'auto' }}>{r.data}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

const TUPLE_SLIDES: Slide[] = [
  {
    title: 'INSERT — nasce uma tupla',
    paragraphs: [
      'Quando uma transação faz INSERT, o Postgres cria uma nova tupla na heap com xmin = XID da transação atual e xmax = 0 (ou null) — sinalizando que ela está viva.',
      'Após o COMMIT, a tupla se torna visível para qualquer transação cujo snapshot é posterior ao XID da inserção.',
      'Importante: até o COMMIT, outras transações NÃO veem a tupla — porque o xmin não está commitado ainda.',
    ],
    gradient: ['rgba(34,197,94,0.18)', 'rgba(15,23,42,0.95)'],
    illustration: (
      <TupleViz
        rows={[
          { xmin: 'TX#100', xmax: '0', data: "email='a@b.com'", status: 'live', color: GRN, label: 'NOVA TUPLA — VIVA' },
        ]}
      />
    ),
  },
  {
    title: 'UPDATE — versionamento, não modificação',
    paragraphs: [
      'UPDATE não modifica a tupla original. Cria uma NOVA tupla com xmin = TX atual e marca a versão antiga com xmax = TX atual.',
      'Resultado: a versão antiga permanece no disco mas marcada como "vai morrer". É chamada de "dead tuple" depois que o oldest_xmin do banco passar pelo seu xmax.',
      'Por isso readers nunca bloqueiam writers: cada leitura vê sua versão própria conforme o snapshot. O escritor cria a nova sem mexer na que os outros estão lendo.',
    ],
    gradient: ['rgba(91,155,213,0.18)', 'rgba(15,23,42,0.95)'],
    illustration: (
      <TupleViz
        rows={[
          { xmin: 'TX#100', xmax: 'TX#150', data: "email='a@b.com'  (será removida)", status: 'dead', color: RED, label: 'VERSÃO ANTIGA — DEAD TUPLE' },
          { xmin: 'TX#150', xmax: '0', data: "email='novo@b.com'  (atual)", status: 'new', color: C, label: 'NOVA VERSÃO' },
        ]}
      />
    ),
  },
  {
    title: 'DELETE — só marca xmax',
    paragraphs: [
      'DELETE não remove a tupla fisicamente. Apenas marca xmax = XID da transação que deletou.',
      'A tupla continua ocupando espaço no disco — invisível para transações com snapshot posterior ao DELETE, mas presente até o VACUUM remover.',
      'Esse design permite ROLLBACK trivial: se a transação aborta, basta marcar o xmax como inválido. A tupla volta a ser visível.',
    ],
    gradient: ['rgba(239,68,68,0.18)', 'rgba(15,23,42,0.95)'],
    illustration: (
      <TupleViz
        rows={[
          { xmin: 'TX#150', xmax: 'TX#200', data: "email='novo@b.com'  (deletada, espaço ocupado)", status: 'dead', color: RED, label: 'DELETADA — DEAD TUPLE' },
        ]}
      />
    ),
  },
  {
    title: 'VACUUM — recuperação de espaço',
    paragraphs: [
      'O VACUUM (manual ou autovacuum) varre as páginas e remove dead tuples cujo xmax é menor que o oldest_xmin do banco — ou seja, ninguém mais pode precisar daquela versão.',
      'Importante: VACUUM não devolve espaço ao OS. Marca como reutilizável dentro da tabela. Para devolver ao OS, precisa de VACUUM FULL (com lock) ou pg_repack (sem lock).',
      'Se uma transação está aberta há horas, o oldest_xmin fica congelado nesse valor antigo. VACUUM não pode remover dead tuples mais novas — bloat acumula. Por isso idle_in_transaction_session_timeout é crítico.',
    ],
    gradient: ['rgba(167,139,250,0.18)', 'rgba(15,23,42,0.95)'],
    illustration: (
      <TupleViz
        rows={[
          { xmin: 'TX#200', xmax: '0', data: "email='atual@b.com'  (única viva)", status: 'live', color: GRN, label: 'APÓS VACUUM — APENAS VIVAS' },
          { xmin: '(slot livre)', xmax: '(reutilizável)', data: 'espaço marcado para próximo INSERT', status: 'incoming', color: PRP, label: 'ESPAÇO LIVRE NA PÁGINA' },
        ]}
      />
    ),
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Isolation levels comparados (ComparisonTable)
// ═══════════════════════════════════════════════════════════════════════════════

const ISO_OPTIONS: ComparisonOption[] = [
  { id: 'rc',  label: 'Read Committed',   sublabel: 'default do Postgres',           color: C   },
  { id: 'rr',  label: 'Repeatable Read',  sublabel: 'snapshot fixo',                 color: GRN },
  { id: 'ser', label: 'Serializable',     sublabel: 'SSI — write skew protection',   color: AMB },
]

const ISO_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'snapshot',
    label: 'Quando o snapshot é capturado',
    category: 'Comportamento',
    description: 'Momento em que o estado da TX é "fotografado"',
    values: {
      rc:  { rating: 'fair',      note: 'Novo snapshot a cada statement' },
      rr:  { rating: 'excellent', note: 'Snapshot único no primeiro read' },
      ser: { rating: 'excellent', note: 'Snapshot único + tracking de dependências' },
    },
  },
  {
    id: 'dirty',
    label: 'Dirty read (lê dados não commitados)',
    category: 'Anomalia',
    description: 'Postgres nunca permite — todos os níveis previnem',
    values: {
      rc:  { rating: 'excellent', note: 'Previne (Postgres não tem Read Uncommitted)' },
      rr:  { rating: 'excellent', note: 'Previne' },
      ser: { rating: 'excellent', note: 'Previne' },
    },
  },
  {
    id: 'nonrepeat',
    label: 'Non-repeatable read',
    category: 'Anomalia',
    description: 'Mesmo SELECT retorna valores diferentes na mesma TX',
    values: {
      rc:  { rating: 'poor',      note: 'PERMITE — outras TX commitadas mudam o valor' },
      rr:  { rating: 'excellent', note: 'Previne — snapshot fixo' },
      ser: { rating: 'excellent', note: 'Previne' },
    },
  },
  {
    id: 'phantom',
    label: 'Phantom read',
    category: 'Anomalia',
    description: 'Mesma busca retorna conjunto de linhas diferente',
    values: {
      rc:  { rating: 'poor',      note: 'PERMITE — INSERTs commitados aparecem' },
      rr:  { rating: 'excellent', note: 'Previne (Postgres é mais forte que padrão SQL)' },
      ser: { rating: 'excellent', note: 'Previne' },
    },
  },
  {
    id: 'writeskew',
    label: 'Write skew (serialization anomaly)',
    category: 'Anomalia',
    description: 'Duas TX leem mesmos dados, decidem com base, ambas escrevem — produz estado impossível serial',
    values: {
      rc:  { rating: 'poor',      note: 'PERMITE' },
      rr:  { rating: 'poor',      note: 'PERMITE — snapshot não detecta dependência' },
      ser: { rating: 'excellent', note: 'Previne — SSI aborta com 40001' },
    },
  },
  {
    id: 'overhead',
    label: 'Overhead de performance',
    category: 'Performance',
    description: 'Custo de manter o nível',
    values: {
      rc:  { rating: 'excellent', note: 'Mínimo — snapshot por statement' },
      rr:  { rating: 'good',      note: 'Pequeno — manter snapshot fixo' },
      ser: { rating: 'fair',      note: 'Significativo — SSI rastreia rw-conflicts' },
    },
  },
  {
    id: 'retry',
    label: 'Risco de aborto (retry da app)',
    category: 'Operação',
    description: 'Aplicação precisa lidar com erros de serialização',
    values: {
      rc:  { rating: 'excellent', note: 'Nunca aborta por isolation' },
      rr:  { rating: 'good',      note: 'Pode abortar em conflito de UPDATE concorrente' },
      ser: { rating: 'fair',      note: 'Aborta com 40001 — app DEVE ter retry' },
    },
  },
  {
    id: 'usecase',
    label: 'Quando usar',
    category: 'Decisão',
    description: 'Caso de uso ideal',
    values: {
      rc:  { rating: 'excellent', note: 'CRUD normal (90% das aplicações)' },
      rr:  { rating: 'excellent', note: 'Relatórios, exports, agregações multi-query' },
      ser: { rating: 'good',      note: 'Lógica com write skew (plantão, contagem crítica)' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Snapshot visibility (CodeStepper)
// ═══════════════════════════════════════════════════════════════════════════════

const VISIBILITY_SCENARIO: CodeStepperScenario = {
  id: 'visibility',
  label: 'Read Committed vs Repeatable Read — visibilidade',
  language: 'sql',
  code: `-- Sessão A (Read Committed - default)
BEGIN;
SELECT preco FROM produtos WHERE id=1;
-- ?

-- Sessão B (paralela)
BEGIN;
UPDATE produtos SET preco=200 WHERE id=1;
COMMIT;

-- Sessão A continua
SELECT preco FROM produtos WHERE id=1;
-- ?
COMMIT;

-- Sessão A2 (Repeatable Read)
BEGIN ISOLATION LEVEL REPEATABLE READ;
SELECT preco FROM produtos WHERE id=1;
-- ?

-- Sessão C (paralela)
UPDATE produtos SET preco=300 WHERE id=1;

-- Sessão A2 continua
SELECT preco FROM produtos WHERE id=1;
-- ?
COMMIT;`,
  steps: [
    {
      lineStart: 1,
      lineEnd: 4,
      title: 'Sessão A (RC) — primeira leitura',
      explanation: 'TX A inicia em Read Committed. Postgres captura um NOVO snapshot para este statement. Lê preco=100 (estado inicial).',
      output: 'preco = 100',
      memory: { 'TX A snapshot': 'XIDs ativos antes deste SELECT', 'preco visível': '100' },
    },
    {
      lineStart: 6,
      lineEnd: 9,
      title: 'Sessão B — UPDATE concorrente + COMMIT',
      explanation: 'TX B em paralelo faz UPDATE para preco=200 e commita. Cria nova versão da tupla com xmin=TX_B; marca a anterior com xmax=TX_B.',
      output: 'TX B commited com novo XID',
      memory: { 'tuple v1': 'xmin=tx_inicial, xmax=TX_B (dead pendente)', 'tuple v2': 'xmin=TX_B, xmax=0 (viva)' },
    },
    {
      lineStart: 11,
      lineEnd: 13,
      title: 'Sessão A continua — segunda leitura',
      explanation: 'TX A faz outro SELECT. Em Read Committed, captura um NOVO snapshot — agora vê o commit da TX B. preco=200! Não-repetitivo: a mesma TX vê valores diferentes.',
      output: 'preco = 200  ← MUDOU!',
      memory: { 'TX A snapshot 2': 'inclui TX_B como committed', 'non-repeatable read': 'OBSERVADO' },
    },
    {
      lineStart: 16,
      lineEnd: 19,
      title: 'Sessão A2 (RR) — primeira leitura',
      explanation: 'TX A2 inicia em Repeatable Read. Captura snapshot único FIXO no primeiro statement. Lê preco=200 (estado após TX B). Esse snapshot vai durar até o COMMIT.',
      output: 'preco = 200',
      memory: { 'TX A2 snapshot': 'FIXO — não muda durante a TX', 'preco visível': '200' },
    },
    {
      lineStart: 21,
      lineEnd: 22,
      title: 'Sessão C — UPDATE concorrente',
      explanation: 'TX C faz UPDATE para preco=300 e commita. Cria nova versão. Mas TX A2 tem snapshot fixo no momento ANTES dessa nova versão.',
      output: 'TX C commited',
      memory: { 'tuple v3': 'xmin=TX_C, xmax=0', 'TX A2 snapshot': 'ainda fixo no estado anterior' },
    },
    {
      lineStart: 24,
      lineEnd: 27,
      title: 'Sessão A2 continua — segunda leitura',
      explanation: 'TX A2 faz outro SELECT. Em Repeatable Read, USA O MESMO snapshot. Não vê o commit da TX C — ainda vê preco=200. Repetível!',
      output: 'preco = 200  ← IGUAL à primeira leitura',
      memory: { 'TX A2 snapshot': 'mesmo snapshot inicial', 'consistência': 'GARANTIDA' },
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — VACUUM e bloat (ConceptCarousel)
// ═══════════════════════════════════════════════════════════════════════════════

function PageViz({
  cells,
  title,
  caption,
}: {
  cells: Array<'L' | 'D' | 'F' | 'Z'>
  title: string
  caption: string
}) {
  const colorMap = { L: GRN, D: RED, F: '#475569', Z: C }
  const labelMap = { L: 'L', D: 'D', F: '·', Z: 'Z' }
  return (
    <div>
      <div style={{ fontSize: 11, color: FGMUTE, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.08em' }}>{title}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 4, padding: 14, background: CARD, border: `1px solid ${LINE}`, borderRadius: 8 }}>
        {cells.map((c, i) => (
          <div
            key={i}
            style={{
              aspectRatio: '1',
              background: c === 'F' ? 'transparent' : 'rgba(0,0,0,0.3)',
              border: `1.5px solid ${colorMap[c]}`,
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              color: colorMap[c],
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {labelMap[c]}
          </div>
        ))}
      </div>
      <div style={{ fontSize: 10, color: FGMUTE, marginTop: 8, lineHeight: 1.5 }}>{caption}</div>
    </div>
  )
}

const VACUUM_SLIDES: Slide[] = [
  {
    title: 'Estado inicial — bloat acumulado',
    paragraphs: [
      'Após muitos UPDATEs e DELETEs, a página de dados acumula dead tuples (D) misturadas com vivas (L). O espaço total da página continua ocupado, mesmo que metade esteja "morta".',
      'Consequência: queries leem mais páginas do que deveriam. Índices apontam para tuplas que precisam ser checadas para visibilidade. Cache do shared_buffers menos eficiente.',
      'Pior: índices também acumulam entries para dead tuples. Index bloat é menos visível mas pode ser pior que table bloat.',
    ],
    gradient: ['rgba(239,68,68,0.18)', 'rgba(15,23,42,0.95)'],
    illustration: (
      <PageViz
        title="Página 1 (8KB) — antes do VACUUM"
        cells={['L', 'D', 'D', 'L', 'D', 'L', 'D', 'L', 'D', 'D', 'L', 'D', 'L', 'D', 'D', 'L']}
        caption="6 vivas / 10 dead tuples = 62% bloat. I/O 2.5x maior que o necessário."
      />
    ),
  },
  {
    title: 'VACUUM regular — espaço marcado como livre',
    paragraphs: [
      'VACUUM remove dead tuples cujo xmax é menor que oldest_xmin (o XID mais antigo ainda em execução). O espaço dessas tuplas é marcado como "free space" — disponível para próximos INSERTs ou UPDATEs.',
      'Importante: VACUUM NÃO devolve espaço ao OS. A página continua com o mesmo tamanho. Só dentro da página o espaço é reutilizável.',
      'Atualiza também o visibility map (páginas com todas as tuplas visíveis pula verificação no Index Only Scan) e pg_statistic se for VACUUM ANALYZE.',
    ],
    gradient: ['rgba(167,139,250,0.18)', 'rgba(15,23,42,0.95)'],
    illustration: (
      <PageViz
        title="Página 1 (8KB) — após VACUUM"
        cells={['L', 'F', 'F', 'L', 'F', 'L', 'F', 'L', 'F', 'F', 'L', 'F', 'L', 'F', 'F', 'L']}
        caption="6 vivas + 10 slots livres reutilizáveis. Próximo INSERT preenche os slots — sem aumentar o arquivo."
      />
    ),
  },
  {
    title: 'VACUUM FREEZE — prevenção de XID wraparound',
    paragraphs: [
      'XIDs são inteiros de 32 bits — circulam após ~4 bilhões. O Postgres usa espaço circular: ~2B "no passado" (visíveis), ~2B "no futuro" (invisíveis).',
      'Se age(datfrozenxid) chegar perto de 2B, tuplas antigas começam a parecer "no futuro" — invisíveis incorretamente. Para evitar isso, VACUUM FREEZE substitui xmin de tuplas antigas pelo FrozenXID especial — sempre visível.',
      'Tuplas congeladas (Z na visualização) não dependem mais do contador de XID. Mesmo se o contador der a volta, elas continuam visíveis.',
    ],
    gradient: ['rgba(91,155,213,0.18)', 'rgba(15,23,42,0.95)'],
    illustration: (
      <PageViz
        title="Página 1 — após VACUUM FREEZE"
        cells={['Z', 'F', 'F', 'Z', 'F', 'L', 'F', 'L', 'F', 'F', 'Z', 'F', 'L', 'F', 'F', 'Z']}
        caption="Tuplas antigas congeladas (Z) — protegidas contra XID wraparound. autovacuum aciona freeze automaticamente em vacuum_freeze_max_age (default 200M)."
      />
    ),
  },
  {
    title: 'Long-running TX bloqueia VACUUM',
    paragraphs: [
      'O VACUUM só pode remover dead tuples cujo xmax é menor que oldest_xmin. Se uma transação está aberta há 6 horas, o oldest_xmin fica congelado no XID dessa transação.',
      'Resultado: dead tuples criadas nas últimas 6 horas NÃO podem ser removidas. Em uma tabela com 1000 UPDATEs/s, isso significa ~21 milhões de dead tuples acumuladas — bloat severo, índices inflados.',
      'Prevenção: idle_in_transaction_session_timeout (encerra conexões idle in transaction) e statement_timeout (encerra queries lentas). Monitore pg_stat_activity para detectar TX longas.',
    ],
    gradient: ['rgba(245,158,11,0.18)', 'rgba(15,23,42,0.95)'],
    illustration: (
      <PageViz
        title="Página 1 — VACUUM rodou mas oldest_xmin baixo"
        cells={['L', 'D', 'D', 'L', 'D', 'L', 'D', 'L', 'D', 'D', 'L', 'D', 'L', 'D', 'D', 'L']}
        caption="Dead tuples permanecem porque a TX longa segura oldest_xmin no passado. VACUUM não pode tocar nelas."
      />
    ),
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Anti-patterns operacionais
// ═══════════════════════════════════════════════════════════════════════════════

const MVCC_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'Long-running transaction sem timeout',
    wrong: [
      [{ text: '-- Aplicação abre conexão e TX, processa por horas', color: FGMUTE }],
      [{ text: 'BEGIN;', color: RED }],
      [{ text: 'SELECT * FROM grande_tabela;  -- 30 min', color: RED }],
      [{ text: '-- ... processa em memória 6 horas ...', color: RED }],
      [{ text: 'COMMIT;  -- ou pior, conexão fica idle in TX', color: RED }],
      [{ text: '-- Resultado: oldest_xmin congelado por 6h', color: RED }],
      [{ text: '-- VACUUM não pode limpar nada nesse período', color: RED }],
    ],
    right: [
      [{ text: '-- postgresql.conf', color: GRN }],
      [{ text: "idle_in_transaction_session_timeout = '30min'", color: GRN }],
      [{ text: "statement_timeout = '5min'  -- por sessão se quiser", color: GRN }],
      [{ text: '', color: FGMUTE }],
      [{ text: '-- Aplicação: processa em batches separados', color: GRN }],
      [{ text: 'for batch in fetch_batches(1000):', color: GRN }],
      [{ text: '    BEGIN;', color: GRN }],
      [{ text: '    UPDATE ... WHERE id = ANY(batch);', color: GRN }],
      [{ text: '    COMMIT;  -- TX curta, libera oldest_xmin', color: GRN }],
    ],
    why: 'TX longa segura oldest_xmin baixo, bloqueando o VACUUM de remover dead tuples mais novas. Bloat acumula descontroladamente em tabelas de alta escrita. idle_in_transaction_session_timeout encerra conexões "idle in transaction" automaticamente.',
  },
  {
    title: 'Autovacuum padrão em tabela de alta escrita',
    wrong: [
      [{ text: '-- Configuração default do Postgres:', color: FGMUTE }],
      [{ text: 'autovacuum_vacuum_scale_factor = 0.2  -- 20%!', color: RED }],
      [{ text: '', color: FGMUTE }],
      [{ text: '-- Tabela com 100M linhas precisa acumular 20M', color: RED }],
      [{ text: '-- dead tuples antes do autovacuum rodar', color: RED }],
      [{ text: '-- Bloat severo entre execuções', color: RED }],
    ],
    right: [
      [{ text: '-- Por tabela individual (não global!)', color: GRN }],
      [{ text: 'ALTER TABLE pedidos SET (', color: GRN }],
      [{ text: '  autovacuum_vacuum_scale_factor = 0.01,  -- 1%', color: GRN }],
      [{ text: '  autovacuum_vacuum_threshold = 100,', color: GRN }],
      [{ text: '  autovacuum_vacuum_cost_delay = 2', color: GRN }],
      [{ text: ');', color: GRN }],
      [{ text: '-- VACUUM roda muito mais cedo, bloat controlado', color: GRN }],
    ],
    why: 'O default é conservador para minimizar I/O em tabelas pequenas. Para tabelas com muito UPDATE/DELETE, configure por tabela com scale_factor 0.01 (1%). Nunca altere globalmente — afeta todas as tabelas e pode degradar performance de tabelas tranquilas.',
  },
  {
    title: 'Não monitorar XID wraparound',
    wrong: [
      [{ text: '-- Sem alertas — descobre quando o banco já está', color: RED }],
      [{ text: '-- em modo de emergência (read-only)', color: RED }],
      [{ text: '', color: FGMUTE }],
      [{ text: '-- Logs do Postgres:', color: RED }],
      [{ text: 'WARNING: database "prod" must be vacuumed', color: RED }],
      [{ text: '         within 1000000 transactions', color: RED }],
      [{ text: 'ERROR: database is not accepting commands to', color: RED }],
      [{ text: '       avoid wraparound data loss', color: RED }],
    ],
    right: [
      [{ text: '-- Query de monitoramento (Prometheus, Datadog)', color: GRN }],
      [{ text: 'SELECT datname,', color: GRN }],
      [{ text: '  age(datfrozenxid) AS xid_age', color: GRN }],
      [{ text: 'FROM pg_database;', color: GRN }],
      [{ text: '', color: FGMUTE }],
      [{ text: '-- Alertas:', color: GRN }],
      [{ text: '-- > 500M  → WARNING', color: GRN }],
      [{ text: '-- > 1.5B  → CRITICAL (planejar VACUUM FREEZE)', color: GRN }],
      [{ text: '-- > 1.8B  → EMERGENCY (banco prestes a parar)', color: GRN }],
    ],
    why: 'XID wraparound é a emergência operacional mais séria do Postgres. Quando age(datfrozenxid) chega a ~2B, o banco entra em modo read-only para prevenir corrupção. A única saída é VACUUM FREEZE em single-user mode — downtime planejado. Monitore proativamente.',
  },
  {
    title: 'Read Committed em relatório com múltiplas queries',
    wrong: [
      [{ text: '-- Relatório financeiro: 3 queries na mesma TX', color: FGMUTE }],
      [{ text: 'BEGIN;  -- default Read Committed', color: RED }],
      [{ text: 'SELECT SUM(total) FROM pedidos WHERE mes=1;', color: RED }],
      [{ text: '-- retorna 1M', color: RED }],
      [{ text: 'SELECT AVG(ticket) FROM pedidos WHERE mes=1;', color: RED }],
      [{ text: '-- retorna 500 — mas baseado em outro snapshot!', color: RED }],
      [{ text: 'SELECT COUNT(*) FROM pedidos WHERE mes=1;', color: RED }],
      [{ text: '-- retorna 2010 — outro snapshot ainda', color: RED }],
      [{ text: 'COMMIT;  -- 1M / 2010 ≠ 500: relatório inconsistente!', color: RED }],
    ],
    right: [
      [{ text: '-- Relatório consistente — Repeatable Read', color: GRN }],
      [{ text: 'BEGIN ISOLATION LEVEL REPEATABLE READ;', color: GRN }],
      [{ text: 'SELECT SUM(total) FROM pedidos WHERE mes=1;', color: GRN }],
      [{ text: 'SELECT AVG(ticket) FROM pedidos WHERE mes=1;', color: GRN }],
      [{ text: 'SELECT COUNT(*) FROM pedidos WHERE mes=1;', color: GRN }],
      [{ text: '-- Todas as 3 queries veem o MESMO snapshot', color: GRN }],
      [{ text: '-- Relatório matemamente consistente', color: GRN }],
      [{ text: 'COMMIT;', color: GRN }],
    ],
    why: 'Read Committed captura novo snapshot a cada statement. Em relatórios com múltiplas queries, valores podem mudar entre uma query e outra — somas e médias ficam inconsistentes. Use Repeatable Read para qualquer transação que faz múltiplas leituras precisando de consistência interna.',
  },
  {
    title: 'Serializable sem retry na aplicação',
    wrong: [
      [{ text: '// Lógica que requer Serializable (write skew protection)', color: FGMUTE }],
      [{ text: 'await db.query("BEGIN ISOLATION LEVEL SERIALIZABLE")', color: RED }],
      [{ text: 'await operacao(db)', color: RED }],
      [{ text: 'await db.query("COMMIT")', color: RED }],
      [{ text: '// Erro 40001 não tratado — operação falha aleatoriamente', color: RED }],
      [{ text: '// Usuário recebe erro genérico em produção', color: RED }],
    ],
    right: [
      [{ text: 'async function withRetry(operation, maxRetries = 5) {', color: GRN }],
      [{ text: '  for (let i = 0; i < maxRetries; i++) {', color: GRN }],
      [{ text: '    try {', color: GRN }],
      [{ text: '      await db.query("BEGIN ISOLATION LEVEL SERIALIZABLE")', color: GRN }],
      [{ text: '      await operation(db)', color: GRN }],
      [{ text: '      await db.query("COMMIT")', color: GRN }],
      [{ text: '      return', color: GRN }],
      [{ text: '    } catch (e) {', color: GRN }],
      [{ text: '      await db.query("ROLLBACK")', color: GRN }],
      [{ text: '      if (e.code !== "40001") throw e', color: GRN }],
      [{ text: '      await sleep(Math.min(50 * 2**i, 5000))', color: GRN }],
      [{ text: '    }', color: GRN }],
      [{ text: '  }', color: GRN }],
      [{ text: '}', color: GRN }],
    ],
    why: 'Serializable usa SSI para detectar conflitos. Quando detecta, aborta uma das transações com SQLSTATE 40001 — comportamento ESPERADO, não erro. A aplicação DEVE fazer retry da transação INTEIRA com backoff exponencial. Sem retry, transações falham aleatoriamente em produção.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Jornada do iniciante ao sênior (ProgressionMap)
// ═══════════════════════════════════════════════════════════════════════════════

const MVCC_LEVELS: ProgressionLevel[] = [
  {
    id: 'iniciante',
    name: 'Iniciante',
    label: 'Conceitos fundamentais',
    emoji: 'IN',
    concepts: [
      { name: 'O que é uma transação',         tip: 'BEGIN, COMMIT, ROLLBACK — unidade atômica de trabalho' },
      { name: 'ACID',                          tip: 'Atomicity, Consistency, Isolation, Durability' },
      { name: 'Por que readers não bloqueiam', tip: 'MVCC mantém múltiplas versões — readers veem versões antigas' },
      { name: 'xmin e xmax',                   tip: 'Campos invisíveis em cada tupla — quem criou e quem deletou' },
      { name: 'O que é dead tuple',            tip: 'Versão antiga de uma linha que ainda ocupa disco' },
      { name: 'O que VACUUM faz',              tip: 'Remove dead tuples e marca espaço como reutilizável' },
    ],
  },
  {
    id: 'pleno',
    name: 'Pleno',
    label: 'Operação prática',
    emoji: 'PL',
    concepts: [
      { name: 'Read Committed (default)',      tip: 'Snapshot por statement — non-repeatable read possível' },
      { name: 'Repeatable Read',               tip: 'Snapshot fixo no BEGIN — para relatórios consistentes' },
      { name: 'Serializable + SSI',            tip: 'Detecta write skew, aborta com 40001 — requer retry' },
      { name: 'autovacuum básico',             tip: 'Roda automaticamente quando dead tuples passam % threshold' },
      { name: 'pg_stat_user_tables',           tip: 'n_live_tup, n_dead_tup, last_autovacuum por tabela' },
      { name: 'idle_in_transaction_timeout',   tip: 'Mata conexões "idle in transaction" — previne bloqueio do VACUUM' },
      { name: 'SELECT FOR UPDATE básico',      tip: 'Lock exclusivo na linha até COMMIT' },
    ],
  },
  {
    id: 'senior',
    name: 'Sênior',
    label: 'Diagnóstico e otimização',
    emoji: 'SR',
    concepts: [
      { name: 'autovacuum por tabela',         tip: 'ALTER TABLE SET (autovacuum_vacuum_scale_factor = 0.01)' },
      { name: 'XID wraparound monitoring',     tip: 'age(datfrozenxid) — alerta em 500M, crítico em 1.5B' },
      { name: 'pg_repack vs VACUUM FULL',      tip: 'pg_repack reescreve sem lock exclusivo — usar em produção' },
      { name: 'HOT updates + FILLFACTOR',      tip: 'UPDATE sem mexer em índice + espaço livre na página' },
      { name: 'pgstattuple para bloat real',   tip: 'Medição precisa de bloat com extension pgstattuple' },
      { name: 'SKIP LOCKED para fila',         tip: 'SELECT FOR UPDATE SKIP LOCKED — workers concorrentes' },
      { name: 'Retry pattern para 40001',      tip: 'Loop de retry da TX inteira com backoff exponencial' },
      { name: 'Diferenças com InnoDB/Oracle',  tip: 'Postgres tem versões na heap; InnoDB usa undo log' },
      { name: 'VACUUM FREEZE preventivo',      tip: 'Em janela de manutenção quando age > 1B' },
      { name: 'Advisory locks',                tip: 'pg_try_advisory_lock — coordenação entre apps sem tabela de locks' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// Componente principal
// ═══════════════════════════════════════════════════════════════════════════════

export default function MvccVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'tuple-versioning',
      title: 'Versionamento de tupla',
      subtitle: 'INSERT, UPDATE, DELETE e VACUUM — como xmin/xmax controlam visibilidade',
      accent: GRN,
      component: (
        <ConceptCarousel
          slides={TUPLE_SLIDES}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'isolation-levels',
      title: 'Isolation levels comparados',
      subtitle: 'Read Committed vs Repeatable Read vs Serializable — o que cada um previne',
      accent: AMB,
      component: (
        <ComparisonTable
          options={ISO_OPTIONS}
          criteria={ISO_CRITERIA}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'snapshot-visibility',
      title: 'Snapshot — RC vs RR ao vivo',
      subtitle: 'Veja exatamente quando o snapshot é capturado e o que cada TX enxerga',
      accent: SKY,
      component: (
        <CodeStepper
          scenarios={[VISIBILITY_SCENARIO]}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'vacuum-bloat',
      title: 'VACUUM, bloat e wraparound',
      subtitle: 'Visualização de página — antes e depois do VACUUM, freeze e o impacto de TX longas',
      accent: PRP,
      component: (
        <ConceptCarousel
          slides={VACUUM_SLIDES}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns operacionais',
      subtitle: 'Os 5 erros mais comuns — long-running TX, autovacuum default, sem monitoring, isolation errado, sem retry',
      accent: RED,
      component: (
        <AntiPatternsGallery
          patterns={MVCC_ANTIPATTERNS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'progression',
      title: 'Jornada — iniciante ao sênior',
      subtitle: 'Os conceitos por nível de senioridade',
      accent: GRN,
      component: (
        <ProgressionMap
          levels={MVCC_LEVELS}
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
