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
import { SequenceDiagram } from '@/components/visuals/SequenceDiagram'
import type { SeqActor, SeqMessage } from '@/components/visuals/SequenceDiagram'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { ConceptCarousel } from '@/components/visuals/ConceptCarousel'
import type { Slide } from '@/components/visuals/ConceptCarousel'

// ── Paleta Redis ──────────────────────────────────────────────────────────────
const C      = '#FF4438'   // Redis red
const BG     = '#0f172a'
const CARD   = '#1e293b'
const GRN    = '#4ade80'
const AMB    = '#f59e0b'
const SKY    = '#38bdf8'
const PRP    = '#a78bfa'
const MUTE   = '#475569'
const RED    = '#ef4444'
const FG     = '#e2e8f0'

void CARD; void RED; void FG

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Estruturas de Dados (ComparisonTable com rating correto)
// ═══════════════════════════════════════════════════════════════════════════════

const DS_OPTIONS: ComparisonOption[] = [
  { id: 'string',     label: 'String',     color: SKY },
  { id: 'hash',       label: 'Hash',       color: GRN },
  { id: 'list',       label: 'List',       color: AMB },
  { id: 'sorted-set', label: 'Sorted Set', color: C },
  { id: 'stream',     label: 'Stream',     color: PRP },
]

const DS_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'cache',
    label: 'Cache / Contador / Lock',
    values: {
      string:     { rating: 'excellent', note: 'SET/GET/INCR — padrão para cache e rate counter' },
      hash:       { rating: 'fair',      note: 'Possível, mas String é mais direto' },
      list:       { rating: 'poor',      note: 'Não é o caso de uso adequado' },
      'sorted-set': { rating: 'poor',   note: 'Não é o caso de uso adequado' },
      stream:     { rating: 'poor',      note: 'Não é o caso de uso adequado' },
    },
  },
  {
    id: 'objeto',
    label: 'Objeto / Perfil / Sessão',
    values: {
      string:     { rating: 'fair',      note: 'JSON serializado — sem acesso por campo' },
      hash:       { rating: 'excellent', note: 'HSET/HGET — acesso por campo, ziplist para objetos pequenos' },
      list:       { rating: 'poor',      note: 'Não é o caso de uso adequado' },
      'sorted-set': { rating: 'poor',   note: 'Não é o caso de uso adequado' },
      stream:     { rating: 'poor',      note: 'Não é o caso de uso adequado' },
    },
  },
  {
    id: 'fila',
    label: 'Fila de Jobs / Feed',
    values: {
      string:     { rating: 'poor',      note: 'Não suporta operações de fila' },
      hash:       { rating: 'poor',      note: 'Não é o caso de uso adequado' },
      list:       { rating: 'excellent', note: 'LPUSH/BRPOP — fila FIFO com blocking pop' },
      'sorted-set': { rating: 'fair',   note: 'Possível via score como prioridade ou timestamp' },
      stream:     { rating: 'excellent', note: 'XADD/XREADGROUP — fila durável com ack e consumer groups' },
    },
  },
  {
    id: 'ranking',
    label: 'Ranking / Leaderboard',
    values: {
      string:     { rating: 'poor',      note: 'Não suporta ordenação' },
      hash:       { rating: 'poor',      note: 'Não suporta ordenação por valor' },
      list:       { rating: 'poor',      note: 'Ordenação manual necessária' },
      'sorted-set': { rating: 'excellent', note: 'ZADD/ZREVRANK/ZREVRANGE — nativo, O(log N)' },
      stream:     { rating: 'poor',      note: 'Não é o caso de uso adequado' },
    },
  },
  {
    id: 'durabilidade',
    label: 'At-least-once delivery',
    values: {
      string:     { rating: 'poor',      note: 'Sem semântica de entrega' },
      hash:       { rating: 'poor',      note: 'Sem semântica de entrega' },
      list:       { rating: 'fair',      note: 'RPOP remove sem ack — mensagem perdida se consumer cair' },
      'sorted-set': { rating: 'fair',   note: 'Sem ack explícito, requer lógica manual' },
      stream:     { rating: 'excellent', note: 'XACK + PEL — rastreia mensagens não confirmadas' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Persistência RDB vs AOF vs Hybrid (LayerStack)
// ═══════════════════════════════════════════════════════════════════════════════

const PERSIST_LAYERS: Layer[] = [
  {
    id: 'hybrid',
    label: 'Hybrid (Recomendado)',
    sublabel: 'aof-use-rdb-preamble yes — melhor dos dois mundos',
    color: C,
    description: 'Arquivo AOF começa com snapshot RDB compacto, depois loga apenas as operações delta desde o snapshot. Restore rápido como RDB + durabilidade próxima de AOF. Opção padrão para produção com dados críticos.',
    examples: [
      'aof-use-rdb-preamble yes no redis.conf',
      'Restore: carrega snapshot RDB + aplica delta AOF',
      'BGREWRITEAOF compacta o arquivo mantendo o preamble RDB',
      'Arquivo menor que AOF puro com durabilidade maior que RDB puro',
    ],
  },
  {
    id: 'aof',
    label: 'AOF — Append-Only File',
    sublabel: 'appendonly yes — log de cada operação de escrita',
    color: PRP,
    description: 'Cada comando de escrita é anexado ao arquivo AOF. Configuração fsync determina durabilidade: always (zero perda, mais lento), everysec (perde ~1s, recomendado), no (SO decide).',
    examples: [
      'appendfsync everysec — perde no máximo ~1 segundo de dados',
      'appendfsync always — zero perda, latência maior (~2-3× mais lento)',
      'BGREWRITEAOF — reescreve AOF compactado em background',
      'AOF maior que RDB, mas mais durável',
    ],
  },
  {
    id: 'rdb',
    label: 'RDB — Redis Database Snapshot',
    sublabel: 'save 900 1 — snapshot periódico via fork()',
    color: GRN,
    description: 'Fork do processo cria snapshot completo em background sem bloquear Redis. Arquivo binário compacto. Restore rápido. Perde dados entre snapshots.',
    examples: [
      'save 900 1 → snapshot se 1 chave mudou em 900s',
      'save 300 10 → snapshot se 10 chaves mudaram em 300s',
      'BGSAVE — dispara snapshot manual em background',
      'Ideal para backup; não use como única persistência para dados críticos',
    ],
  },
  {
    id: 'no-persist',
    label: 'Sem Persistência',
    sublabel: 'save "" — apenas in-memory, restart perde tudo',
    color: MUTE,
    description: 'Redis como cache puro sem durabilidade. Restart ou falha perde todos os dados. Latência máxima por ausência de I/O de disco.',
    examples: [
      'save "" no redis.conf desabilita RDB',
      'appendonly no desabilita AOF',
      'Use para cache de sessão onde recarga do banco é aceitável',
      'Hit rate após restart: 0% — cold start total',
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Redis Cluster Sharding (SequenceDiagram — tipos corretos)
// ═══════════════════════════════════════════════════════════════════════════════

const CLUSTER_ACTORS: SeqActor[] = [
  { id: 'client',   label: 'Client',              color: SKY },
  { id: 'nodeA',    label: 'Node A\nslots 0–5460',    color: GRN },
  { id: 'nodeB',    label: 'Node B\nslots 5461–10922', color: AMB },
]

const CLUSTER_MESSAGES: SeqMessage[] = [
  { from: 'client', to: 'nodeA', label: 'SET user:1 "Ana"' },
  { from: 'nodeA',  to: 'client', label: 'MOVED 7638 nodeB:6379', type: 'return' },
  { from: 'client', to: 'nodeB', label: 'SET user:1 "Ana" (redirect)' },
  { from: 'nodeB',  to: 'client', label: 'OK', type: 'return' },
  { from: 'client', to: 'nodeB', label: 'SET user:1 "Bob" (slot cacheado)' },
  { from: 'nodeB',  to: 'client', label: 'OK — sem redirect', type: 'return' },
  { from: 'client', to: 'nodeB', label: 'MGET {user:1}:profile {user:1}:cart (hash tags)' },
  { from: 'nodeB',  to: 'client', label: 'OK — mesmo slot garantido', type: 'return' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Eviction Policy (DecisionTree)
// ═══════════════════════════════════════════════════════════════════════════════

const EVICT_ROOT: DTNode = {
  id: 'root',
  question: 'Como você usa o Redis?',
  children: [
    { label: 'Cache puro — todos os dados podem ser removidos', nodeId: 'cache-pure' },
    { label: 'Mix: alguns dados permanentes + cache temporário', nodeId: 'cache-mix' },
    { label: 'Dados críticos — nenhum dado pode ser perdido', nodeId: 'no-evict' },
  ],
}

const EVICT_NODES: Record<string, DTNode> = {
  'cache-pure': {
    id: 'cache-pure',
    question: 'Padrão de acesso às chaves?',
    children: [
      { label: 'Acesso recente importa (uso geral)', nodeId: 'allkeys-lru' },
      { label: 'Hot keys muito concentradas (padrão Pareto)', nodeId: 'allkeys-lfu' },
      { label: 'Acesso aleatório homogêneo', nodeId: 'allkeys-random' },
    ],
  },
  'allkeys-lru': {
    id: 'allkeys-lru',
    recommendation: 'allkeys-lru',
    detail: 'Remove a chave menos recentemente usada entre TODAS as chaves. Padrão para 90% dos casos de cache. Bom para workloads onde acesso recente é bom indicador de acesso futuro.',
  },
  'allkeys-lfu': {
    id: 'allkeys-lfu',
    recommendation: 'allkeys-lfu',
    detail: 'Remove a chave menos FREQUENTEMENTE usada. Melhor que LRU quando poucas chaves quentes concentram o tráfego. Disponível no Redis 4+. Evita remover chaves muito acessadas que ficaram ociosas brevemente.',
  },
  'allkeys-random': {
    id: 'allkeys-random',
    recommendation: 'allkeys-random',
    detail: 'Remove chave aleatória entre todas. Raramente é a melhor escolha — use apenas se você tem certeza que todos os dados têm igual probabilidade de acesso.',
  },
  'cache-mix': {
    id: 'cache-mix',
    question: 'Os dados de cache têm TTL definido?',
    children: [
      { label: 'Sim — dados de cache têm TTL, permanentes não têm', nodeId: 'volatile-lru' },
      { label: 'Não — todos os dados têm TTL', nodeId: 'allkeys-lru' },
    ],
  },
  'volatile-lru': {
    id: 'volatile-lru',
    recommendation: 'volatile-lru',
    detail: 'Aplica LRU apenas nas chaves COM TTL definido. Chaves sem TTL (dados permanentes) nunca são removidas por eviction. Perfeito para Redis com dados de sessão + dados de referência permanentes.',
  },
  'no-evict': {
    id: 'no-evict',
    recommendation: 'noeviction',
    detail: 'Retorna erro (OOM command not allowed) para escritas quando maxmemory é atingido. Leituras continuam. Use quando perder qualquer chave é inaceitável — Redis vira source of truth, não cache.',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Pub/Sub vs List vs Stream (ComparisonTable)
// ═══════════════════════════════════════════════════════════════════════════════

const MSG_OPTIONS: ComparisonOption[] = [
  { id: 'pubsub',  label: 'Pub/Sub',    color: AMB },
  { id: 'list',    label: 'List Queue', color: GRN },
  { id: 'stream',  label: 'Stream',     color: C },
]

const MSG_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'durability',
    label: 'Durabilidade de mensagens',
    values: {
      pubsub: { rating: 'poor',      note: 'Nenhuma — mensagem perdida se subscriber offline' },
      list:   { rating: 'good',      note: 'LPUSH persiste na lista até RPOP consumir' },
      stream: { rating: 'excellent', note: 'Mensagem permanece após consumo até MAXLEN ou DEL' },
    },
  },
  {
    id: 'consumers',
    label: 'Múltiplos consumidores',
    values: {
      pubsub: { rating: 'excellent', note: 'Fan-out: todos os subscribers recebem a mesma mensagem' },
      list:   { rating: 'fair',      note: 'Competitivo: BRPOP — apenas um consumer por mensagem' },
      stream: { rating: 'excellent', note: 'Consumer groups: múltiplos grupos independentes' },
    },
  },
  {
    id: 'ack',
    label: 'Confirmação de processamento',
    values: {
      pubsub: { rating: 'poor',      note: 'Não — fire and forget, sem ack' },
      list:   { rating: 'poor',      note: 'Não — RPOP remove sem possibilidade de retry' },
      stream: { rating: 'excellent', note: 'XACK + PEL rastreia mensagens pendentes por consumer' },
    },
  },
  {
    id: 'replay',
    label: 'Replay de mensagens',
    values: {
      pubsub: { rating: 'poor',      note: 'Impossível — sem histórico' },
      list:   { rating: 'poor',      note: 'Impossível — RPOP é destrutivo' },
      stream: { rating: 'excellent', note: 'XRANGE por ID ou XREVRANGE — replay completo' },
    },
  },
  {
    id: 'latency',
    label: 'Latência',
    values: {
      pubsub: { rating: 'excellent', note: 'Sub-milissegundo — memória pura sem overhead' },
      list:   { rating: 'excellent', note: 'Sub-milissegundo com BRPOP blocking' },
      stream: { rating: 'good',      note: 'Muito baixa, mas com overhead de PEL e consumer groups' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Rate Limiter Patterns (ConceptCarousel)
// ═══════════════════════════════════════════════════════════════════════════════

const RATELIMIT_SLIDES: Slide[] = [
  {
    title: 'Fixed Window',
    paragraphs: [
      'INCR key:minute → incrementa contador da janela atual',
      'EXPIRE key:minute 60 → janela expira em 60 segundos',
      'Simples e eficiente: 2 comandos, O(1)',
      'Problema: burst na virada — cliente pode usar 2× o limite nos limites da janela',
    ],
    gradient: [GRN, '#1a5c2e'],
    illustration: (
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, lineHeight: 1.8, padding: 16 }}>
        <div style={{ color: MUTE, fontSize: 9 }}>-- Fixed Window (pseudocódigo Redis)</div>
        <div><span style={{ color: SKY }}>key</span> = <span style={{ color: AMB }}>`rate:{'{userId}:{minute}'}`</span></div>
        <div><span style={{ color: SKY }}>count</span> = <span style={{ color: C }}>INCR</span> key</div>
        <div><span style={{ color: PRP }}>if</span> count == <span style={{ color: AMB }}>1</span>:</div>
        <div style={{ paddingLeft: 14 }}><span style={{ color: C }}>EXPIRE</span> key <span style={{ color: AMB }}>60</span></div>
        <div><span style={{ color: PRP }}>if</span> count {'>'} limit:</div>
        <div style={{ paddingLeft: 14 }}><span style={{ color: RED }}>return</span> <span style={{ color: AMB }}>429 Too Many Requests</span></div>
      </div>
    ),
  },
  {
    title: 'Sliding Window com Sorted Set',
    paragraphs: [
      'ZADD key now now — registra o timestamp do request como membro e score',
      'ZREMRANGEBYSCORE key 0 (now - window) — remove requests fora da janela',
      'ZCARD key — conta requests na janela deslizante atual',
      'Exato sem burst, mas usa mais memória (1 membro por request)',
    ],
    gradient: [AMB, '#6e3d00'],
    illustration: (
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, lineHeight: 1.8, padding: 16 }}>
        <div style={{ color: MUTE, fontSize: 9 }}>-- Sliding Window (Lua script atômico)</div>
        <div><span style={{ color: C }}>ZADD</span> key now now</div>
        <div><span style={{ color: C }}>ZREMRANGEBYSCORE</span> key <span style={{ color: AMB }}>0</span> <span style={{ color: AMB }}>(now-window)</span></div>
        <div><span style={{ color: SKY }}>count</span> = <span style={{ color: C }}>ZCARD</span> key</div>
        <div><span style={{ color: C }}>EXPIRE</span> key window</div>
        <div><span style={{ color: PRP }}>if</span> count {'>'} limit: <span style={{ color: RED }}>return 429</span></div>
      </div>
    ),
  },
  {
    title: 'Token Bucket (Lua Script)',
    paragraphs: [
      'Hash armazena tokens disponíveis + timestamp do último refill',
      'A cada request: calcula tokens recarregados desde último acesso',
      'Permite burst controlado: bucket acumula tokens em períodos ociosos',
      'Mais justo para tráfego em rajadas legítimas (ex: uploads em lote)',
    ],
    gradient: [C, '#6d0f25'],
    illustration: (
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, lineHeight: 1.8, padding: 16 }}>
        <div style={{ color: MUTE, fontSize: 9 }}>-- Token Bucket (Lua script)</div>
        <div><span style={{ color: SKY }}>tokens</span>, <span style={{ color: SKY }}>last</span> = <span style={{ color: C }}>HMGET</span> key <span style={{ color: AMB }}>"t" "ts"</span></div>
        <div><span style={{ color: SKY }}>refill</span> = (now - last) * rate</div>
        <div><span style={{ color: SKY }}>tokens</span> = <span style={{ color: GRN }}>min</span>(tokens + refill, capacity)</div>
        <div><span style={{ color: PRP }}>if</span> tokens {'>'} <span style={{ color: AMB }}>0</span>:</div>
        <div style={{ paddingLeft: 14 }}><span style={{ color: C }}>HSET</span> key <span style={{ color: AMB }}>"t"</span> (tokens-1)</div>
        <div style={{ paddingLeft: 14 }}><span style={{ color: GRN }}>return</span> <span style={{ color: AMB }}>200 OK</span></div>
        <div><span style={{ color: PRP }}>else</span>: <span style={{ color: RED }}>return 429</span></div>
      </div>
    ),
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — Anti-patterns Redis (AntiPatternsGallery)
// ═══════════════════════════════════════════════════════════════════════════════

const REDIS_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'KEYS * em produção',
    wrong: [
      [{ text: '-- ❌ KEYS * bloqueia Redis inteiro (O(N))', color: RED }],
      [{ text: 'const keys = await redis.keys("user:*")', color: '#ef4444' }],
      [{ text: '// Em 10M chaves: bloqueia por segundos!', color: RED }],
    ],
    right: [
      [{ text: '-- ✅ SCAN com cursor — não bloqueia', color: GRN }],
      [{ text: "let cursor = '0'", color: FG }],
      [{ text: 'do {', color: FG }],
      [{ text: "  const [next, keys] = await redis.scan(", color: FG }],
      [{ text: "    cursor, 'MATCH', 'user:*', 'COUNT', '100')", color: GRN }],
      [{ text: '  cursor = next', color: FG }],
      [{ text: "} while (cursor !== '0')", color: FG }],
    ],
    why: 'KEYS * é O(N) e single-threaded — bloqueia todo o Redis durante a varredura. SCAN distribui em múltiplas chamadas sem bloquear.',
  },
  {
    title: 'SET sem TTL para cache',
    wrong: [
      [{ text: '-- ❌ Cache sem expiração cresce sem limite', color: RED }],
      [{ text: 'await redis.set(`cache:${userId}`, data)', color: '#ef4444' }],
      [{ text: '// memória cresce até atingir maxmemory', color: RED }],
      [{ text: '// eviction remove dados inesperadamente', color: RED }],
    ],
    right: [
      [{ text: '-- ✅ Sempre defina TTL para cache', color: GRN }],
      [{ text: 'await redis.set(`cache:${userId}`, data,', color: FG }],
      [{ text: '  "EX", 300 // expira em 5 minutos', color: GRN }],
      [{ text: '// Atualizar sem resetar TTL:', color: GRN }],
      [{ text: 'await redis.set(`cache:${userId}`, newData,', color: FG }],
      [{ text: '  "KEEPTTL")', color: GRN }],
    ],
    why: 'Sem TTL, chaves de cache acumulam indefinidamente. Quando maxmemory é atingido, eviction remove chaves aleatoriamente — comportamento imprevisível.',
  },
  {
    title: 'Distributed lock sem valor único',
    wrong: [
      [{ text: '-- ❌ Lock sem UUID: race condition no release', color: RED }],
      [{ text: "await redis.set('lock', 'locked', 'NX', 'EX', 30)", color: '#ef4444' }],
      [{ text: '// ... processar (pode demorar > 30s) ...', color: MUTE }],
      [{ text: "await redis.del('lock') // ❌ deleta lock de outro!", color: '#ef4444' }],
    ],
    right: [
      [{ text: '-- ✅ UUID único + Lua para release seguro', color: GRN }],
      [{ text: 'const token = crypto.randomUUID()', color: FG }],
      [{ text: "await redis.set('lock', token, 'NX', 'EX', 30)", color: GRN }],
      [{ text: '// Lua: verifica UUID antes de deletar', color: GRN }],
      [{ text: "// if GET lock == token then DEL lock end", color: GRN }],
    ],
    why: 'Sem UUID, o processo A pode deletar o lock que o processo B adquiriu após o TTL expirar. Lua script garante check-and-delete atômico.',
  },
  {
    title: 'Multi-key em slots diferentes no Cluster',
    wrong: [
      [{ text: '-- ❌ MGET com keys em slots diferentes', color: RED }],
      [{ text: "await redis.mget('user:1:profile', 'user:2:profile')", color: '#ef4444' }],
      [{ text: "// CROSSSLOT: Keys don't hash to same slot", color: RED }],
    ],
    right: [
      [{ text: '-- ✅ Hash tags para forçar mesmo slot', color: GRN }],
      [{ text: "await redis.mget('{user:1}:profile', '{user:1}:cart')", color: GRN }],
      [{ text: '// {} define a parte que determina o slot', color: GRN }],
      [{ text: '// Ambas as keys ficam no mesmo shard', color: GRN }],
    ],
    why: 'No Redis Cluster, CRC16(key) % 16384 determina o shard. Multi-key commands falham em slots diferentes. Hash tags {tag} forçam colocação no mesmo shard.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// Componente principal
// ═══════════════════════════════════════════════════════════════════════════════

export default function RedisVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'data-structures',
      title: 'Estruturas de Dados',
      subtitle: 'String, Hash, List, Sorted Set, Stream — qual usar para cada caso',
      accent: C,
      component: (
        <ComparisonTable
          options={DS_OPTIONS}
          criteria={DS_CRITERIA}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'persistence',
      title: 'Persistência',
      subtitle: 'RDB vs AOF vs Hybrid — quando usar cada estratégia',
      accent: C,
      component: (
        <LayerStack
          layers={PERSIST_LAYERS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'cluster',
      title: 'Redis Cluster',
      subtitle: 'Roteamento por hash slot, MOVED redirect e hash tags',
      accent: C,
      component: (
        <SequenceDiagram
          actors={CLUSTER_ACTORS}
          messages={CLUSTER_MESSAGES}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'eviction',
      title: 'Eviction Policy',
      subtitle: 'Qual política usar — árvore de decisão por tipo de workload',
      accent: C,
      component: (
        <DecisionTree
          root={EVICT_ROOT}
          nodes={EVICT_NODES}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'messaging',
      title: 'Pub/Sub vs Stream',
      subtitle: 'Durabilidade, ack, consumer groups, replay e latência comparados',
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
    {
      id: 'rate-limiting',
      title: 'Rate Limiting',
      subtitle: 'Fixed window, sliding window e token bucket — trade-offs e implementação',
      accent: C,
      component: (
        <ConceptCarousel
          slides={RATELIMIT_SLIDES}
          accentColor={C}
          bgColor={BG}
          cardColor={'#1e293b'}
        />
      ),
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns',
      subtitle: 'KEYS *, sem TTL, lock sem UUID, multi-key em cluster',
      accent: C,
      component: (
        <AntiPatternsGallery
          patterns={REDIS_ANTIPATTERNS}
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
