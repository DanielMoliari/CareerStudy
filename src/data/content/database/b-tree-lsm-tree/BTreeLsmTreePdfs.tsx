'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import type { HookItem, RuleItem } from '@/components/pdfs/CheatsheetPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'

// ── Paleta B-Tree / LSM-Tree ──────────────────────────────────────────────────
const C = '#4169E1'

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: '20 perguntas de entrevista sobre B-Tree e LSM-Tree',
    type: 'qa',
    pages: 8,
    description: 'Recuperação ativa: Por que Cassandra usa LSM-Tree, Bloom filter, write/read amplification, size-tiered vs leveled compaction, tombstones, WAL, SSDs vs HDD, RocksDB como storage engine, TimescaleDB, FILLFACTOR e HOT updates. Nível pleno e sênior.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'Tradeoffs, quando usar e tuning',
    type: 'cheatsheet',
    pages: 2,
    description: 'Referência rápida: tradeoffs B-Tree vs LSM, Bloom filter configuração, compaction strategies, bancos que usam cada estrutura, e regras de ouro para decisão arquitetural.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'RL/ES, NFP, STL — âncoras para memorizar',
    type: 'mnemonics',
    pages: 2,
    description: 'RL vs ES (B-Tree: Read/Lugar fixo vs LSM: Escrita/Sequencial), NFP (No False Negatives, False Positives ok), STL (Size-Tiered vs Leveled).',
    icon: '03',
    goal: 'Memorização cognitiva',
  },
]

// ── Dados: Q&A ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Senior',
    q: 'Por que Cassandra usa LSM-Tree?',
    a: 'Cassandra é otimizado para escrita intensiva em escala. LSM-Tree escreve sequencialmente (memtable em RAM, flush para SSTable), muito mais rápido que random write do B-Tree. SSTables imutáveis facilitam replicação e compressão. Cassandra não tem UPDATE in-place — append sempre, reconciliação na compactação com tombstones.',
    tip: 'Mencionar imutabilidade das SSTables e a relação com replicação distribuída mostra entendimento sistêmico.',
  },
  {
    level: 'Senior',
    q: 'Quando B-Tree é melhor que LSM-Tree?',
    a: 'Leitura pesada e update frequente: B-Tree tem melhor latência de leitura pontual (1 caminho vs múltiplas SSTables). Range scan: folhas doubly-linked são muito eficientes para ORDER BY + LIMIT. Em SSDs, a diferença diminui — random I/O não é tão penalizado.',
    tip: 'Mencionar SSDs mudando o cálculo (random I/O em SSD não é tão pior) demonstra profundidade além da teoria.',
  },
  {
    level: 'Senior',
    q: 'O que é write amplification e onde ocorre?',
    a: 'Write amplification é a razão bytes escritos / bytes de entrada. B-Tree: 2-5x (dado + índice). LSM leveled: 10-30x — dado escrito na memtable, flush inicial, e em cada nível de compactação. Leveled compaction tem write amp maior que size-tiered mas read amp muito menor.',
    tip: 'O número "10-30x para leveled compaction" é o detalhe concreto que diferencia quem entende de quem decorou.',
  },
  {
    level: 'Senior',
    q: 'Como Bloom filter ajuda na leitura do LSM-Tree?',
    a: 'Bloom filter responde "definitivamente não está neste SSTable" ou "provavelmente está". False negatives são impossíveis — se diz não, não precisa abrir o SSTable. Transforma read miss de O(n SSTables) para O(1). RocksDB default: 10 bits/chave → ~1% false positive rate.',
    tip: '"False negatives impossíveis" é a propriedade crítica — é o que permite skip seguro de SSTables.',
  },
  {
    level: 'Senior',
    q: 'Explique B+ Tree e por que Postgres o usa.',
    a: 'B+ Tree: dados só nas folhas, nós internos contêm apenas chaves de roteamento. Folhas doubly-linked. Range scans: encontra início do range, segue os ponteiros das folhas sem retornar ao root — scan linear muito mais eficiente que B-Tree clássico.',
    tip: '"Dados só nas folhas" + "folhas doubly-linked" são os dois pontos técnicos centrais. Quem sabe explicar isso entendeu a estrutura.',
  },
  {
    level: 'Senior',
    q: 'Como LSM-Tree trata deletes?',
    a: 'Não deleta in-place. DELETE insere tombstone — marcador especial na memtable. Tombstone propaga via flush para SSTables. Na compactação, quando tombstone é mesclado com SSTables mais antigas, o dado é fisicamente removido. Tombstones acumulam se não houver compactação suficiente.',
    tip: '"Tombstones acumulam" é o insight operacional para Cassandra com alto volume de deletes — onde a teoria encontra a prática.',
  },
  {
    level: 'Senior',
    q: 'Diferença entre size-tiered e leveled compaction?',
    a: 'Size-tiered (Cassandra default): mescla SSTables de tamanho similar. Menor write amplification, maior read amplification. Bom para write-heavy. Leveled (RocksDB default): L(n+1) é 10x maior que L(n). Write amplification ~30x, mas poucas SSTables por nível — leitura muito previsível.',
    tip: 'O número "10x entre níveis" é o detalhe do RocksDB real — mostra conhecimento além da documentação introdutória.',
  },
  {
    level: 'Senior',
    q: 'O que é memtable e como ela afeta durabilidade?',
    a: 'Memtable é a estrutura in-memory (sorted map em RAM) onde todas as escritas vão primeiro. Se crashar antes do flush, dados são perdidos. Solução: WAL — cada write vai primeiro ao WAL (append sequencial, durável) e depois à memtable. No crash, WAL é replayed para reconstruir a memtable.',
    tip: 'Sem WAL, LSM-Tree não seria um banco de dados — perderia dados no crash. WAL é o que garante a "D" do ACID.',
  },
  {
    level: 'Senior',
    q: 'Como RocksDB é usado como base para outros bancos?',
    a: 'RocksDB (LSM-Tree da Meta) é embarcável. Base de: MyRocks (MySQL + RocksDB para write-heavy), TiKV (storage de TiDB/NewSQL), CockroachDB (usa Pebble, fork do RocksDB), YugabyteDB, InfluxDB IOx. A ideia: plugar storage engine LSM otimizada embaixo de bancos que precisam de write throughput alto.',
    tip: 'Citar TiKV/TiDB mostra conhecimento de sistemas distribuídos modernos — diferencial além de "conheço RocksDB".',
  },
  {
    level: 'Senior',
    q: 'Por que SSDs mudam o tradeoff B-Tree vs LSM-Tree?',
    a: 'HDDs: random I/O é ~100x mais lento que sequencial — enorme vantagem para LSM. SSDs/NVMe: random I/O é apenas 2-5x mais lento. B-Tree perde menos terreno em escrita. Workloads de leitura em SSD ficam ainda mais favoráveis ao B-Tree. Postgres em NVMe performa muito bem mesmo sendo B-Tree.',
    tip: '"NVMe: random 2-5x mais lento que sequencial" — a especificidade muda o cálculo de forma mensurável.',
  },
  {
    level: 'Senior',
    q: 'O que é space amplification em B-Tree e como controlar?',
    a: 'B-Tree acumula fragmentação com updates — páginas com dead space (bloat no Postgres). FILLFACTOR controla espaço livre por página: default 90%. Para tabelas com muito UPDATE, 70-80% habilita HOT updates (update in-place sem index write). VACUUM ou pg_repack para recuperar espaço.',
    tip: 'FILLFACTOR e HOT updates é o detalhe de DBA — mostra que você administrou B-Tree em produção.',
  },
  {
    level: 'Senior',
    q: 'O que é read amplification em LSM-Tree e como mitigar?',
    a: 'Read amplification é o número de I/Os para uma leitura. LSM no pior caso verifica todos os SSTables. Mitigações: (1) Bloom filter — skip de SSTables com certeza. (2) Leveled compaction — poucas SSTables por nível. (3) Block cache — SSTables quentes ficam em RAM.',
    tip: 'A tríade bloom + leveled + block cache é a stack de otimização do RocksDB — mostra conhecimento do sistema completo.',
  },
  {
    level: 'Pleno',
    q: 'Como uma busca ocorre no B-Tree vs LSM-Tree passo a passo?',
    a: 'B-Tree: root → nós internos (comparar chave, ir para filho) → folha. Sempre O(log n), 1 caminho. LSM: memtable → para cada SSTable recente ao mais antigo: Bloom filter (se "não está", pula sem I/O), senão binary search no índice → lê bloco. Retorna versão mais recente encontrada.',
    tip: '"Bloom filter primeiro, depois binary search no índice" mostra que você entende a implementação real.',
  },
  {
    level: 'Pleno',
    q: 'Como escolher entre Postgres e Cassandra para um sistema de métricas?',
    a: 'Métricas: alta escrita (milhões de pontos/s), leitura por range temporal, sem updates frequentes → Cassandra (LSM) vence. Modelo de dados mapeia bem para partition key (sensor_id) + clustering key (timestamp). Alternativa inteligente: TimescaleDB (Postgres + hypertables particionadas por tempo).',
    tip: 'Mencionar TimescaleDB como meio-termo mostra que você pensa em trade-offs reais, não só na divisão binária.',
  },
  {
    level: 'Pleno',
    q: 'O que garante read-your-own-writes no LSM-Tree?',
    a: 'LSM sempre lê da memtable primeiro — a mais recente. Se você escreveu "user:1 = Alice", a memtable tem essa entrada e qualquer get("user:1") a retorna imediatamente, antes mesmo do flush para SSTable.',
    tip: '"Lê da memtable primeiro" é a implementação de read-your-own-writes — elegante e direto.',
  },
  {
    level: 'Pleno',
    q: 'Quais são as limitações do Bloom filter?',
    a: 'Não suporta delete diretamente — uma vez que bits são setados, não dá para dessetar sem risco de false negatives. Tamanho fixo — não redimensiona. False positive rate sobe com preenchimento excessivo. Solução para delete: Counting Bloom filter (bits são contadores).',
    tip: '"Não suporta delete" é a limitação menos óbvia — diferencia quem entende a estrutura profundamente.',
  },
  {
    level: 'Pleno',
    q: 'Qual a taxa ideal de bits por chave no Bloom filter?',
    a: 'Depende do trade-off memória vs I/O. RocksDB default: 10 bits/chave → ~1% FP rate. Para workloads com muita leitura de chaves ausentes (key-miss dominant): 20 bits/chave → 0.01% FP. Fórmula do k ótimo: k = (m/n) * ln(2). Com 10 bits/chave, k ≈ 7 hashes.',
    tip: 'A fórmula k = (m/n) * ln(2) e mencionar que RocksDB permite configurar bits_per_key impressiona em entrevistas de sistemas.',
  },
  {
    level: 'Pleno',
    q: 'Como o WAL difere entre B-Tree e LSM-Tree?',
    a: 'B-Tree (Postgres): WAL registra mudanças nas páginas da árvore (page before/after). LSM-Tree (RocksDB): WAL registra operações simples (key, value, op) — simples append. Ambos usam WAL para durabilidade e replicação, mas a granularidade é diferente.',
    tip: 'Comparar a granularidade do WAL mostra visão sistêmica — não só "ambos têm WAL".',
  },
  {
    level: 'Senior',
    q: 'Como monitorar compaction lag em Cassandra/RocksDB?',
    a: 'Cassandra: métricas de compaction via JMX — CompactionExecutor.PendingTaskCount, estimatedRemainingTasks. RocksDB: compaction.pending_bytes, compaction_pending. Em carga pesada, compactação compete com queries de leitura — monitorar é crítico para SLA. Alertar quando pending tasks > threshold.',
    tip: 'Saber as métricas específicas de cada banco mostra que você operou LSM-Tree em produção.',
  },
  {
    level: 'Senior',
    q: 'Diferença de MVCC entre B-Tree (Postgres) e LSM-Tree (Cassandra)?',
    a: 'Postgres (B-Tree + MVCC): versões antigas ficam na heap como dead tuples, removidas pelo VACUUM. Cassandra (LSM): deletes são tombstones, versões antigas ficam em SSTables antigas até compactação. Em ambos, leituras não bloqueiam escritas — mas o mecanismo é diferente: xmin/xmax vs timestamp + tombstone.',
    tip: 'Conectar os mecanismos de concorrência dos dois sistemas demonstra visão sistêmica de arquitetura de banco de dados.',
  },
]

// ── Dados: Cheatsheet ─────────────────────────────────────────────────────────

const CHEATSHEET_HOOKS: HookItem[] = [
  { name: 'B-Tree busca',           sig: 'O(log n) — traversal raiz → folha',                      desc: 'Sempre previsível, 1 caminho' },
  { name: 'LSM write',              sig: 'memtable (RAM) → WAL → flush → SSTable',                  desc: 'Sequencial, O(1) amortizado' },
  { name: 'Bloom filter',           sig: '10 bits/chave → ~1% FP rate (RocksDB default)',           desc: 'Skip SSTable sem I/O se "não está"' },
  { name: 'Write amplification',    sig: 'B-Tree: 2-5x. LSM leveled: 10-30x',                      desc: 'Dado escrito múltiplas vezes' },
  { name: 'Size-tiered (Cassandra)',sig: 'Mescla SSTables similares — menos write amp',             desc: 'Default Cassandra — write-heavy' },
  { name: 'Leveled (RocksDB)',       sig: 'L(n+1) = 10x L(n) — menos read amp',                    desc: 'Default RocksDB — balanced' },
  { name: 'B-Tree: Postgres',       sig: 'CREATE INDEX idx ON t (col) USING btree',                 desc: 'Default — suporta range scan' },
  { name: 'HOT update',             sig: 'ALTER TABLE t SET (fillfactor = 80)',                     desc: 'Espaço para update in-place' },
  { name: 'FILLFACTOR',             sig: '70-90 para tabelas com muito UPDATE',                     desc: 'Menos write amplification de índice' },
  { name: 'RocksDB block cache',    sig: 'NewLRUCache(size_bytes) — SSTables em RAM',               desc: 'Mitigar read amplification' },
  { name: 'LSM tombstone',          sig: 'DELETE insere tombstone, remove na compactação',           desc: 'Cuidado com acúmulo em Cassandra' },
  { name: 'Compaction monitoring',  sig: 'Cassandra: PendingTaskCount | RocksDB: pending_bytes',   desc: 'Alertar quando lag alto' },
]

const CHEATSHEET_RULES: RuleItem[] = [
  { ok: true,  t: 'B-Tree para OLTP, leitura heavy, range queries, ORDER BY com LIMIT.' },
  { ok: true,  t: 'LSM-Tree para write-heavy, time-series, IoT, logs, métricas.' },
  { ok: true,  t: 'Bloom filter: 10 bits/chave é o default RocksDB — ajustar para key-miss heavy.' },
  { ok: true,  t: 'Leveled compaction quando leitura também importa. Size-tiered quando escrita domina.' },
  { ok: true,  t: 'TimescaleDB como meio-termo: Postgres + particionamento temporal.' },
  { ok: false, t: 'Nunca: ignorar compaction lag em Cassandra/RocksDB sob carga alta.' },
  { ok: false, t: 'Nunca: muitos deletes em Cassandra sem monitorar tombstones acumulados.' },
  { ok: false, t: 'Nunca: assumir LSM é sempre mais rápido — B-Tree em SSD é muito competitivo.' },
]

// ── Dados: Mnemônicos ─────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'B-Tree vs LSM-Tree — RL vs ES',
    trick: 'R-ead L-ugar fixo (B-Tree) vs E-scrita S-equencial (LSM)',
    expansion: [
      ['B-Tree: R — Read', 'B-Tree é otimizado para leitura: traversal O(log n), 1 lookup, range scan com folhas linkadas.'],
      ['B-Tree: L — Lugar fixo (in-place)', 'UPDATE modifica in-place — random I/O, rebalanceamento. Custo de escrita vem daí.'],
      ['LSM: E — Escrita sequencial', 'LSM escreve sempre sequencialmente: memtable → flush → SSTable. Sequencial = muito rápido.'],
      ['LSM: S — SSTables imutáveis', 'SSTables nunca modificadas. Imutabilidade simplifica replicação e compressão.'],
    ],
    explanation: 'RL vs ES: B-Tree domina leitura (RL), LSM domina escrita sequencial (ES). Os tradeoffs derivam dessas duas características fundamentais.',
    example: 'Postgres (B-Tree):\n  SELECT users ORDER BY id → range scan rápido\nCassandra (LSM):\n  INSERT events (1M/s) → write throughput máximo',
    why: 'A decisão B-Tree vs LSM começa pelo padrão de acesso. RL vs ES é o atalho mental para a escolha certa.',
  },
  {
    label: 'Bloom Filter — NFP',
    trick: 'N-o False N-egatives, F-alse P-ositives ok',
    expansion: [
      ['No False Negatives', 'Se o Bloom filter diz "NÃO está aqui" — 100% verdade. Skip seguro do SSTable.'],
      ['False Positives ok', 'Se diz "PODE estar" — pode ser falso positivo. Abre o SSTable para confirmar.'],
      ['Impacto prático', 'Read miss: O(n SSTables) → O(1). 99% dos key-miss sem I/O de disco.'],
      ['Configuração', '10 bits/chave = ~1% FP. 20 bits = ~0.01%. Trade RAM vs I/O.'],
    ],
    explanation: 'NFP: a assimetria é o que torna o Bloom filter útil. A garantia de ausência permite skip seguro de SSTables sem falsa confiança.',
    example: 'Consulta user:9999 que não existe:\n→ Bloom: "definitivamente não está" → skip 5 SSTables\n→ 0 I/O em vez de 5 leituras de disco',
    why: 'Entender por que false negatives são impossíveis diferencia quem decorou a definição de quem entende a matemática.',
  },
  {
    label: 'Compactação LSM — STL',
    trick: 'S-ize-tiered vs L-eveled (two strategies)',
    expansion: [
      ['Size-Tiered (Cassandra)', 'Mescla SSTables de tamanho similar. Menos write amplification, mais read amplification.'],
      ['Leveled (RocksDB)', 'L(n+1) = 10x L(n). Write amp ~30x, mas read amp baixo — poucas SSTables por nível.'],
      ['Trade-off central', 'Você escolhe onde pagar: write amplification (leveled) ou read amplification (size-tiered).'],
      ['Decisão prática', 'Write-heavy sem leitura crítica → size-tiered. Leitura também importa → leveled.'],
    ],
    explanation: 'STL: as duas estratégias de compactação com tradeoffs opostos. Mesma estrutura LSM, custos diferentes.',
    example: 'Cassandra (size-tiered):\n  write amp: ~10x, read amp: ~10 SSTables\nRocksDB (leveled):\n  write amp: ~30x, read amp: ~2 SSTables',
    why: 'Escolher a compaction strategy errada degrada o banco. STL é o pré-requisito para tunar qualquer sistema LSM.',
  },
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'B-Tree / LSM-Tree',
    stackLabel: 'Database / Storage Engines',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'B-Tree / LSM-Tree',
    accentColor: C,
    stackLabel: 'Database / Storage Engines',
    sections: {
      hooks: CHEATSHEET_HOOKS,
      depRows: [],
      rules: CHEATSHEET_RULES,
      performanceTips: [],
      patterns: [],
      mentalModels: [],
    },
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'B-Tree / LSM-Tree',
    stackLabel: 'Database / Storage Engines',
  }),
}

// ── Componente ────────────────────────────────────────────────────────────────

export default function BTreeLsmTreePdfs() {
  const [open, setOpen] = useState<PdfCard | null>(null)
  const hero = PDF_CARDS[0]
  const rest = PDF_CARDS.slice(1)

  return (
    <>
      <HeroCard card={hero} accent={C} onOpen={() => setOpen(hero)} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 16 }}>
        {rest.map(c => (
          <CollectionCard key={c.id} card={c} accent={C} onOpen={() => setOpen(c)} />
        ))}
      </div>
      {open && (
        <PdfModal card={open} onClose={() => setOpen(null)} builders={PDF_BUILDERS} />
      )}
    </>
  )
}
