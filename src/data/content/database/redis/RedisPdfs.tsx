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
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'
import { buildQuickRefPdf } from '@/components/pdfs/QuickRefPdf'
import type { QuickRefColumn } from '@/components/pdfs/QuickRefPdf'

// ── Paleta Redis ──────────────────────────────────────────────────────────────
const C    = '#FF4438'  // Redis red — NUNCA omitir
const GRN  = '#4ade80'
const AMB  = '#f59e0b'
const SKY  = '#38bdf8'
const PRP  = '#a78bfa'
const RED  = '#ef4444'

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas sobre Redis em entrevista',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: distributed lock, rate limiting, eviction policies, Cluster vs Sentinel, Pub/Sub vs Stream, MULTI/EXEC vs Lua, HyperLogLog, pipeline, keyspace notifications, AOF vs RDB e muito mais.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'Comandos por estrutura de dados, persistência e patterns numa página',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referência densa: todos os comandos por estrutura (String, Hash, List, Set, Sorted Set, Stream), eviction policies, opções de persistência, Cluster hash slots, distributed lock pattern, rate limiting patterns.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Os truques que grudam Redis na memória',
    type: 'mnemonics',
    pages: 2,
    description: 'SCAN vs KEYS, eviction por inicial, persistência RDB+AOF=Hybrid, lock com UUID, Sorted Set para leaderboard. Truques verbais para os pontos mais cobrados em entrevistas.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'Os 6 erros mais comuns com Redis',
    type: 'antipatterns',
    pages: 3,
    description: 'KEYS * em produção, SET sem TTL, distributed lock sem UUID, multi-key em Cluster, Pub/Sub sem durabilidade, LRANGE em lista grande.',
    icon: '04',
    goal: 'Reconhecimento de padrão',
  },
  {
    id: 'quick-ref',
    title: 'Quick Ref — Comandos',
    subtitle: 'Todos os comandos Redis por estrutura de dados',
    type: 'quick-ref',
    pages: 2,
    description: 'Referência rápida: String, Hash, List, Set, Sorted Set, Stream, HyperLogLog, Bitmap, Geo. Complexidades, flags e exemplos condensados.',
    icon: '05',
    goal: 'Consulta de comandos',
  },
]

// ── Dados: Q&A ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Senior',
    q: 'Como implementaria distributed lock com Redis?',
    a: '<strong>SET lock_key unique_uuid NX EX 30</strong> — atomic check-and-set com TTL. NX garante que só um cliente adquire. EX 30 evita deadlock se o holder morrer. <strong>Release seguro:</strong> Lua script verifica valor antes de apagar: <code>if redis.call("GET",KEYS[1])==ARGV[1] then return redis.call("DEL",KEYS[1]) else return 0 end</code>. <strong>HA — Redlock:</strong> N instâncias ímpares (≥3), lock adquirido quando maioria confirma em tempo < TTL/2.',
    tip: 'Sempre gere um UUID como valor do lock — isso é o que protege contra liberação acidental por outro cliente que adquiriu após o TTL expirar.',
  },
  {
    level: 'Senior',
    q: 'Diferença entre List e Stream para fila de tarefas?',
    a: '<strong>List (LPUSH/BRPOP):</strong> simples, baixa latência, sem consumer groups, sem ack explícito, sem replay. Mensagem consumida é removida — se o consumer morrer antes de processar, mensagem perde. <strong>Stream:</strong> consumer groups com XACK explícito, pending entries list (PEL) para rastrear mensagens não confirmadas, múltiplos consumers em paralelo por group, replay de histórico via XRANGE. Para at-least-once delivery: Stream. Para tarefas simples onde perda eventual é aceitável: List.',
    tip: 'Pense em Stream como Kafka embutido no Redis: consumer groups, offsets (seq ID), ack. List é apenas um array com pop atômico.',
  },
  {
    level: 'Senior',
    q: 'Como implementar rate limiting com Redis?',
    a: '<strong>Fixed window:</strong> INCR key + EXPIRE. Simples, mas sofre burst na virada. <strong>Sliding window com Sorted Set:</strong> ZADD + ZREMRANGEBYSCORE + ZCARD em Lua script atômico. Exato, sem burst, mais memória. <strong>Token bucket (Lua):</strong> Hash armazena tokens e timestamp. Permite burst controlado — bucket acumula tokens em períodos ociosos. Executa tudo num único round-trip via EVAL.',
    tip: 'Para sliding window em Lua: KEYS[1]=chave, ARGV[1]=now, ARGV[2]=window, ARGV[3]=limit. Atomicidade garante que ZADD + ZREM + ZCARD sejam consistentes.',
  },
  {
    level: 'Senior',
    q: 'O que é Redis Cluster e quais as limitações?',
    a: 'Redis Cluster distribui <strong>16.384 hash slots</strong> entre múltiplos masters via CRC16(key) % 16384. Client usa MOVED redirect para chegar ao master correto e cacheia o mapa de slots. <strong>Limitações:</strong> Multi-key commands (MGET, MSET) exigem todas as keys no mesmo slot — use hash tags {tag}. Sem cross-slot MULTI/EXEC. SCAN itera apenas um nó. Pub/Sub não propaga entre nós. Lua scripts não cruzam slots.',
    tip: 'Hash tags: a parte entre {} define o slot. {user:123}:profile e {user:123}:cart ficam no mesmo slot — permite MGET e MULTI/EXEC com essas keys.',
  },
  {
    level: 'Pleno',
    q: 'Explique as políticas de eviction e quando usar cada uma.',
    a: '<strong>allkeys-lru:</strong> remove a menos recentemente usada entre todas — ideal para cache puro. <strong>volatile-lru:</strong> LRU apenas nas keys com TTL — para mix de dados permanentes e cache. <strong>allkeys-lfu:</strong> menos frequentemente usada — melhor que LRU quando hot keys são muito concentradas (Redis 4+). <strong>noeviction:</strong> retorna erro para escritas — quando perder qualquer dado é inaceitável. <strong>allkeys-random:</strong> raramente adequado.',
    tip: 'allkeys-lru é o padrão para 90% dos caches. Troque para allkeys-lfu se você tiver hot keys muito concentradas (padrão Pareto).',
  },
  {
    level: 'Senior',
    q: 'Diferença entre RDB e AOF e quando usar cada um?',
    a: '<strong>RDB:</strong> fork() do processo, snapshot completo. Arquivo compacto, restore rápido, perde dados entre snapshots. <strong>AOF:</strong> log de cada operação de escrita. appendfsync everysec = perde ~1s. Mais durável, arquivo maior. BGREWRITEAOF compacta. <strong>Hybrid (recomendado):</strong> aof-use-rdb-preamble yes — snapshot RDB como preamble + AOF delta. Restore rápido + alta durabilidade.',
    tip: 'Para produção com dados críticos: hybrid. Para cache puro onde perda é aceitável: RDB only ou sem persistência.',
  },
  {
    level: 'Senior',
    q: 'O que é Sentinel e quando usar em vez de Cluster?',
    a: '<strong>Sentinel:</strong> HA para Redis single-shard. Monitora master + réplicas, failover automático (elege réplica mais atualizada), service discovery (clients perguntam ao Sentinel qual é o master). <strong>Use Sentinel:</strong> dataset cabe em uma instância, precisa de HA sem complexidade de Cluster, ou usa funcionalidades incompatíveis com Cluster (Lua cross-slot, Pub/Sub global). <strong>Use Cluster:</strong> dataset excede memória, precisa de sharding horizontal.',
    tip: 'Sempre use número ímpar de Sentinels (3 ou 5) para garantir quorum sem split-brain. 2 Sentinels não têm quorum — nunca use.',
  },
  {
    level: 'Senior',
    q: 'Como funciona MULTI/EXEC e quando preferir Lua?',
    a: '<strong>MULTI/EXEC</strong> enfileira comandos no servidor, EXEC executa atomicamente. WATCH adiciona optimistic locking — se a chave for modificada entre WATCH e EXEC, transação retorna nil (cliente faz retry). <strong>Limitações:</strong> sem condicionais, WATCH requer retry, dois round-trips mínimos. <strong>Lua script:</strong> executa em round-trip único, suporta condicionais e loops, pré-carregue com SCRIPT LOAD + EVALSHA. Prefira Lua quando há lógica condicional que depende de valores lidos no mesmo bloco atômico.',
    tip: 'WATCH + MULTI/EXEC para check-and-set simples. Lua quando precisa de condicionais ou mais de 2 comandos interdependentes (ex: rate limiting, distributed lock release).',
  },
  {
    level: 'Pleno',
    q: 'Como implementar cache-aside com Redis?',
    a: '<strong>Fluxo:</strong> 1) GET cache:key — hit: retorna. 2) Miss: busca no banco. 3) SET cache:key valor EX ttl — grava com TTL. <strong>Invalidação:</strong> ao mudar no banco, DEL cache:key (não SET — evita race condition). <strong>Thundering herd:</strong> muitos requests simultâneos para key expirada — mitigue com SET NX lock enquanto um worker recarrega, outros recebem dado stale (flag stale-while-revalidate).',
    tip: 'Prefira DEL na invalidação em vez de SET imediato — evita escrever dado potencialmente desatualizado se há race entre múltiplos writers. DEL é idempotente e seguro.',
  },
  {
    level: 'Senior',
    q: 'O que é HyperLogLog e quando usar?',
    a: '<strong>HyperLogLog</strong> conta elementos únicos com memória fixa de ~12KB independente do número de elementos. Erro máximo: 0,81%. PFADD visitors ip1 ip2, PFCOUNT visitors, PFMERGE para combinar. <strong>Casos de uso:</strong> contar usuários únicos por dia, IPs únicos, eventos únicos em janelas de tempo — onde precisão exata não é necessária mas memória é limitada. Comparação: Set exato para 1M usuários = ~50MB; HyperLogLog = ~12KB.',
    tip: 'HyperLogLog não permite ver os elementos, só contar. Se precisar de intersecção exata ou listar os elementos, use Set. HLL para estimativa de cardinalidade com restrição de memória.',
  },
  {
    level: 'Pleno',
    q: 'Como implementar leaderboard com Redis?',
    a: '<strong>Sorted Set</strong> é a estrutura ideal. ZADD leaderboard score userId, ZREVRANK para posição decrescente (maior score = rank 1), ZREVRANGE 0 9 WITHSCORES para top 10, ZINCRBY para incrementar score atomicamente. Para múltiplos critérios: encode no score — score * 1e9 + timestamp_inverso para desempate por tempo. ZRANGEBYSCORE para faixas de pontuação.',
    tip: 'ZREVRANK dá o rank em ordem decrescente — é o que você quer para leaderboard onde maior score = posição mais alta. ZRANK seria crescente (menor score = rank 0).',
  },
  {
    level: 'Senior',
    q: 'Como fazer debug de performance no Redis?',
    a: '<strong>SLOWLOG GET N:</strong> lista os N comandos mais lentos acima do threshold (default 10ms). Identifica operações O(N) problemáticas. <strong>MONITOR:</strong> stream em tempo real de todos os comandos — overhead alto, nunca deixe em produção. <strong>INFO stats:</strong> keyspace_hits/misses para calcular hit rate. <strong>INFO memory:</strong> used_memory, fragmentation. <strong>redis-cli --hotkeys:</strong> scan automático de hot keys (requer LFU policy).',
    tip: 'Hit rate = keyspace_hits / (keyspace_hits + keyspace_misses). Abaixo de 90% indica problema no cache warming ou TTLs muito curtos.',
  },
]

// ── Dados: CheatSheet ─────────────────────────────────────────────────────────

const CHEATSHEET_HOOKS: HookItem[] = [
  { name: 'SET key val [EX s] [NX]', sig: 'SET key value [EX seconds] [NX] [KEEPTTL]', desc: 'Grava string. EX = TTL em segundos. NX = só grava se não existir. KEEPTTL mantém TTL anterior.' },
  { name: 'HSET / HGET / HMGET', sig: 'HSET key f1 v1 f2 v2 | HGET key f | HMGET key f1 f2', desc: 'Hash: objeto com múltiplos campos. HGETALL retorna todos — cuidado em hashes grandes (O(N)).' },
  { name: 'LPUSH / RPOP / BRPOP', sig: 'LPUSH key v1 v2 | RPOP key | BRPOP key timeout', desc: 'List como fila FIFO: LPUSH (esquerda) + RPOP (direita). BRPOP bloqueia até item disponível.' },
  { name: 'ZADD / ZREVRANK / ZINCRBY', sig: 'ZADD key score member | ZREVRANK key m | ZINCRBY key N m', desc: 'Sorted Set: ZADD adiciona com score. ZREVRANK posição decrescente (0 = maior score). ZINCRBY atômico.' },
  { name: 'XADD / XREADGROUP / XACK', sig: 'XADD stream * f v | XREADGROUP GROUP g c COUNT N STREAMS s > | XACK s g id', desc: 'Stream: XADD grava evento. XREADGROUP lê com consumer group. XACK confirma processamento.' },
  { name: 'SCAN cursor [MATCH] [COUNT]', sig: 'SCAN 0 MATCH user:* COUNT 100', desc: 'Iteração segura por todas as keys sem bloquear. Retorna cursor + batch de keys. Loop até cursor = "0".' },
  { name: 'PFADD / PFCOUNT / PFMERGE', sig: 'PFADD hll e1 e2 | PFCOUNT hll | PFMERGE dest hll1 hll2', desc: 'HyperLogLog: conta elementos únicos com erro ~0,81% e memória fixa de 12KB.' },
  { name: 'EVAL script numkeys keys args', sig: 'EVAL "script lua" 1 key1 arg1', desc: 'Executa Lua script atomicamente. Use SCRIPT LOAD + EVALSHA em produção. redis.call() vs redis.pcall().' },
  { name: 'GEOADD / GEOSEARCH', sig: 'GEOADD key lon lat name | GEOSEARCH key FROMLONLAT lon lat BYRADIUS r km ASC', desc: 'Geo indexing via Sorted Set + geohash 52-bit. GEOSEARCH substituiu GEORADIUS (deprecated).' },
]

const CHEATSHEET_RULES: RuleItem[] = [
  { ok: false, t: 'KEYS * em produção — O(N), bloqueia Redis inteiro. Use SCAN' },
  { ok: false, t: 'SET sem TTL para cache — memória cresce indefinidamente' },
  { ok: false, t: 'DEL lock sem verificar value — libera lock de outro processo' },
  { ok: false, t: 'Multi-key em Cluster sem hash tags — CROSSSLOT error' },
  { ok: false, t: 'Pub/Sub para filas duráveis — subscriber offline perde mensagens' },
  { ok: false, t: 'Lua script longo — bloqueia Redis single-threaded inteiro' },
  { ok: true, t: 'SET key val NX EX 30 + Lua release = distributed lock correto' },
  { ok: true, t: 'SCAN com cursor para varredura de keys sem bloqueio' },
  { ok: true, t: 'Hash tags {tag} para garantir mesmo slot em Redis Cluster' },
  { ok: true, t: 'allkeys-lru para cache puro; noeviction para dados críticos' },
]

// ── Dados: Mnemônicos ─────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'Eviction: "Na Vida, Raramente Algo Faz Vida Render"',
    trick: 'N-V-R-A-F-V-R → noeviction, volatile-lru, random, allkeys-lru, allkeys-lfu, volatile-random, volatile-random',
    expansion: [
      ['noeviction', 'Erro em escritas quando maxmemory é atingido'],
      ['volatile-lru', 'LRU apenas keys com TTL — mix permanentes+cache'],
      ['allkeys-lru', 'LRU em todas as keys — cache puro (uso mais comum)'],
      ['allkeys-lfu', 'LFU em todas — hot keys concentradas (Redis 4+)'],
    ],
    explanation: 'As 4 políticas mais usadas na prática. allkeys-lru é o default para cache puro.',
    example: 'Cache de API: allkeys-lru. Session store com dados permanentes: volatile-lru.',
    why: 'Eviction policy é pergunta frequente em entrevistas sênior — saber quando usar cada uma demonstra maturidade operacional.',
  },
  {
    label: 'KEYS vs SCAN: "KEYS Bloqueia, SCAN Navega"',
    trick: 'KEYS = K de Killer; SCAN = S de Safe',
    expansion: [
      ['KEYS *', 'O(N) — BLOQUEIA Redis single-threaded até completar'],
      ['SCAN cursor', 'Iteração incremental — retorna cursor para continuar'],
      ['COUNT hint', 'Sugestão de quantos elementos retornar por chamada'],
      ['loop até cursor = "0"', 'Iteração completa sem bloquear produção'],
    ],
    explanation: 'SCAN é o único modo seguro de varrer todas as keys em produção.',
    example: 'Em 10M keys: KEYS * pode bloquear por ~5 segundos. SCAN com COUNT 100 faz ~100.000 chamadas rápidas.',
    why: 'KEYS * em produção é um dos erros mais graves — pode causar timeout em cascata em toda a aplicação.',
  },
  {
    label: 'Persistência: "RDB Rápido, AOF Durável, Hybrid o Melhor"',
    trick: 'R-D-H → Rápido-Durável-Híbrido',
    expansion: [
      ['RDB', 'fork() → snapshot compacto → restore rápido → perde dados entre snapshots'],
      ['AOF', 'log de operações → mais durável (everysec = ~1s de perda) → arquivo maior'],
      ['Hybrid', 'aof-use-rdb-preamble yes → RDB + delta AOF → melhor dos dois mundos'],
    ],
    explanation: 'Para produção com dados críticos: Hybrid. Para cache puro: RDB ou sem persistência.',
    example: 'DB: 10GB de dados. RDB snapshot a cada 5min. AOF everysec. Hybrid: snapshot + delta de 5min.',
    why: 'Pergunta frequente em entrevistas — candidatos confundem RDB e AOF ou não conhecem o modo Hybrid.',
  },
  {
    label: 'Distributed Lock: "NX para Adquirir, UUID para Liberar"',
    trick: 'NX = eXclusive; UUID = identidade do holder',
    expansion: [
      ['SET key uuid NX EX 30', 'Adquire lock atomicamente — NX garante exclusividade'],
      ['uuid = crypto.randomUUID()', 'Identifica exclusivamente este processo/thread'],
      ['Lua: GET key == uuid → DEL key', 'Libera SOMENTE se o valor bater — atomic check-and-delete'],
      ['EX 30', 'TTL evita deadlock se o holder morrer antes de liberar'],
    ],
    explanation: 'Os dois passos obrigatórios: NX para adquirir e UUID+Lua para liberar com segurança.',
    example: 'Sem UUID: processo A expira, B adquire. A acorda e faz DEL — libera o lock de B. Com UUID: DEL só acontece se GET retornar o UUID correto.',
    why: 'Distributed lock sem UUID é o bug mais comum em implementações Redis. Uma linha a mais salva corridas críticas.',
  },
  {
    label: 'Sentinel vs Cluster: "Sentinel = HA Simples, Cluster = HA + Sharding"',
    trick: 'S = Single shard; C = Cluster de shards',
    expansion: [
      ['Sentinel', 'Monitora master/réplicas, failover automático, service discovery'],
      ['Cluster', '16.384 hash slots, sharding horizontal, múltiplos masters'],
      ['Sentinel: use quando', 'Dataset cabe em uma instância, HA sem complexidade'],
      ['Cluster: use quando', 'Dataset excede memória ou precisa de write scaling'],
    ],
    explanation: 'Sentinel é HA sem escala horizontal. Cluster é HA com escala horizontal.',
    example: 'App com 50GB de dados: Sentinel + instância de 64GB. App com 500GB: Cluster com 10 nós de 64GB.',
    why: 'Candidatos confundem os dois. A distinção é: Sentinel para HA, Cluster para HA + escala.',
  },
]

// ── Dados: Anti-patterns ──────────────────────────────────────────────────────

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'KEYS * em produção',
    badDesc: 'KEYS * é O(N) e bloqueia Redis single-threaded por segundos em instâncias grandes',
    badCode: [
      { t: '// ❌ KEYS * bloqueia Redis inteiro\n', c: RED },
      { t: 'const keys = await redis.keys("user:*")\n', c: '#ef4444' },
      { t: '// Em 10M chaves: bloqueia por ~5 segundos!\n', c: RED },
      { t: '// Timeouts em cascata em toda a aplicação', c: '#e2e8f0' },
    ],
    goodDesc: 'SCAN com cursor itera sem bloquear — seguro em produção',
    goodCode: [
      { t: '// ✅ SCAN — não bloqueia, seguro em produção\n', c: GRN },
      { t: "let cursor = '0'\n", c: '#e2e8f0' },
      { t: 'do {\n', c: '#e2e8f0' },
      { t: "  const [next, keys] = await redis.scan(cursor, 'MATCH', 'user:*', 'COUNT', '100')\n", c: GRN },
      { t: '  cursor = next\n', c: '#e2e8f0' },
      { t: "} while (cursor !== '0')", c: '#e2e8f0' },
    ],
    why: 'Redis é single-threaded. KEYS * bloqueia o servidor para TODOS os clientes durante a varredura completa. SCAN é incremental e não bloqueia.',
  },
  {
    title: 'SET sem TTL para cache',
    badDesc: 'Cache sem TTL cresce indefinidamente até atingir maxmemory e ativar eviction imprevisível',
    badCode: [
      { t: '// ❌ SET sem TTL — memória cresce sem limite\n', c: RED },
      { t: 'await redis.set(`cache:user:${userId}`, data)\n', c: '#ef4444' },
      { t: '// Com maxmemory atingido: eviction aleatória\n', c: RED },
      { t: '// Chaves importantes podem ser removidas', c: '#e2e8f0' },
    ],
    goodDesc: 'Sempre defina TTL. Use KEEPTTL para atualizar valor sem resetar expiração',
    goodCode: [
      { t: '// ✅ Sempre use TTL para cache\n', c: GRN },
      { t: 'await redis.set(`cache:user:${userId}`, data, { EX: 300 })\n', c: GRN },
      { t: '// Atualizar valor sem resetar TTL:\n', c: GRN },
      { t: 'await redis.set(`cache:user:${userId}`, newData, { KEEPTTL: true })', c: GRN },
    ],
    why: 'Sem TTL, chaves de cache nunca expiram. Memória cresce até maxmemory, então eviction remove chaves imprevisíveis — cache importante pode ser descartado.',
  },
  {
    title: 'Distributed lock sem UUID no valor',
    badDesc: 'DEL sem verificar o valor pode liberar o lock adquirido por outro processo após TTL expirar',
    badCode: [
      { t: '// ❌ Lock sem UUID — race condition no release\n', c: RED },
      { t: "await redis.set('lock', 'locked', { NX: true, EX: 30 })\n", c: '#ef4444' },
      { t: '// ... processar (demora mais de 30s) ...\n', c: '#e2e8f0' },
      { t: "await redis.del('lock') // ❌ deleta lock de OUTRO processo!", c: '#ef4444' },
    ],
    goodDesc: 'UUID único identifica o holder; Lua script garante check-and-delete atômico',
    goodCode: [
      { t: '// ✅ UUID + Lua para release seguro\n', c: GRN },
      { t: 'const token = crypto.randomUUID()\n', c: '#e2e8f0' },
      { t: "await redis.set('lock', token, { NX: true, EX: 30 })\n", c: GRN },
      { t: '// Lua: GET == token → DEL (atômico)\n', c: GRN },
      { t: "await redis.eval(`if redis.call('GET',KEYS[1])==ARGV[1] then return redis.call('DEL',KEYS[1]) else return 0 end`, 1, 'lock', token)", c: GRN },
    ],
    why: 'Processo A: acquires lock (TTL 30s), trava, TTL expira. Processo B: adquire lock. Processo A: acorda e faz DEL — mata o lock de B. Com UUID, o DEL de A falha pois GET retorna UUID de B.',
  },
  {
    title: 'Multi-key em Redis Cluster sem hash tags',
    badDesc: 'MGET, MSET e MULTI/EXEC falham se as keys estiverem em hash slots diferentes',
    badCode: [
      { t: '// ❌ Keys em slots diferentes — CROSSSLOT error\n', c: RED },
      { t: "await redis.mget('user:1:profile', 'user:1:cart')\n", c: '#ef4444' },
      { t: '// ReplyError: CROSSSLOT Keys in request\n', c: RED },
      { t: "// don't hash to the same slot", c: '#e2e8f0' },
    ],
    goodDesc: 'Hash tags {tag} forçam todas as keys para o mesmo slot',
    goodCode: [
      { t: '// ✅ Hash tags — {} define a parte que determina o slot\n', c: GRN },
      { t: "await redis.mget('{user:1}:profile', '{user:1}:cart')\n", c: GRN },
      { t: '// Ambas ficam no slot de CRC16("user:1") % 16384\n', c: GRN },
      { t: '// MULTI/EXEC e Lua scripts também funcionam', c: GRN },
    ],
    why: 'No Redis Cluster, CRC16(key) % 16384 determina o shard. Keys em shards diferentes não podem ser acessadas atomicamente. Hash tags forçam colocação no mesmo shard.',
  },
]

// ── Dados: Quick Ref — Comandos ───────────────────────────────────────────────

const QUICK_REF_COLUMNS: QuickRefColumn[] = [
  {
    sections: [
      {
        title: 'String',
        entries: [
          { key: 'SET key val [EX s] [NX] [KEEPTTL]', value: 'Grava string com opções de TTL e condição' },
          { key: 'GET / GETEX / GETDEL', value: 'Lê, lê+atualiza TTL, lê+deleta' },
          { key: 'INCR / DECR / INCRBY', value: 'Incrementa/decrementa atomicamente' },
          { key: 'APPEND key val', value: 'Concatena ao valor existente' },
          { key: 'STRLEN key', value: 'Comprimento em bytes da string' },
        ],
      },
      {
        title: 'Hash',
        entries: [
          { key: 'HSET key f1 v1 [f2 v2...]', value: 'Grava um ou mais campos' },
          { key: 'HGET key field', value: 'Lê um campo (O(1))' },
          { key: 'HMGET key f1 f2...', value: 'Lê múltiplos campos de uma vez' },
          { key: 'HGETALL key', value: 'Todos os campos e valores (O(N))' },
          { key: 'HINCRBY / HINCRBYFLOAT', value: 'Incrementa campo numérico atomicamente' },
          { key: 'HDEL key field', value: 'Remove campo do hash' },
        ],
      },
      {
        title: 'List',
        entries: [
          { key: 'LPUSH / RPUSH key val...', value: 'Insere no início / final' },
          { key: 'LPOP / RPOP key [count]', value: 'Remove e retorna início / final' },
          { key: 'BRPOP key [key...] timeout', value: 'Pop bloqueante — aguarda elemento' },
          { key: 'LRANGE key start stop', value: 'Intervalo de elementos (0 a -1 = tudo)' },
          { key: 'LLEN key', value: 'Tamanho da lista' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Set',
        entries: [
          { key: 'SADD key member...', value: 'Adiciona membros únicos' },
          { key: 'SREM key member...', value: 'Remove membros' },
          { key: 'SMEMBERS key', value: 'Todos os membros (O(N))' },
          { key: 'SISMEMBER / SMISMEMBER', value: 'Verifica pertencimento (O(1))' },
          { key: 'SINTER / SUNION / SDIFF', value: 'Interseção, união, diferença' },
          { key: 'SCARD key', value: 'Tamanho do set' },
        ],
      },
      {
        title: 'Sorted Set',
        entries: [
          { key: 'ZADD key score member', value: 'Adiciona/atualiza membro com score' },
          { key: 'ZINCRBY key N member', value: 'Incrementa score atomicamente' },
          { key: 'ZRANK / ZREVRANK key m', value: 'Posição crescente / decrescente' },
          { key: 'ZRANGE / ZREVRANGE key s e', value: 'Membros por posição' },
          { key: 'ZRANGEBYSCORE key min max', value: 'Membros por intervalo de score' },
          { key: 'ZCARD / ZSCORE key [m]', value: 'Tamanho / score de um membro' },
        ],
      },
      {
        title: 'Stream',
        entries: [
          { key: 'XADD key * f1 v1...', value: 'Adiciona entrada (* = ID automático)' },
          { key: 'XREADGROUP GROUP g c COUNT N STREAMS k >', value: 'Lê novas mensagens para consumer' },
          { key: 'XACK key group id', value: 'Confirma processamento (remove da PEL)' },
          { key: 'XPENDING key group', value: 'Mensagens entregues mas não ackadas' },
          { key: 'XCLAIM key group c min-idle id', value: 'Transfere mensagem pendente para outro consumer' },
          { key: 'XRANGE / XREVRANGE key s e', value: 'Lê por intervalo de IDs' },
        ],
      },
    ],
  },
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Redis',
    stackLabel: 'Database · In-Memory',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'Redis',
    accentColor: C,
    stackLabel: 'Database · In-Memory',
    sections: {
      hooks: CHEATSHEET_HOOKS,
      depRows: [
        ['String', 'SET/GET/INCR — cache, contador, distributed lock'],
        ['Hash', 'HSET/HGET/HMGET — objeto, sessão, perfil'],
        ['List', 'LPUSH/RPOP/BRPOP — fila FIFO, stack, feed'],
        ['Sorted Set', 'ZADD/ZREVRANK — leaderboard, ranking, rate limit (sliding)'],
        ['Stream', 'XADD/XREADGROUP/XACK — fila durável com at-least-once'],
      ],
      rules: CHEATSHEET_RULES,
      performanceTips: [
        'SCAN ao invés de KEYS * — nunca bloqueie o Redis single-threaded',
        'SET sempre com TTL para dados de cache (EX ou KEEPTTL)',
        'Pipeline para lotes de comandos — 5-10× throughput sem round-trips',
        'EVALSHA ao invés de EVAL — pré-carregue scripts com SCRIPT LOAD',
        'Hash tags {tag} para multi-key atômico no Redis Cluster',
        'allkeys-lru para cache puro; volatile-lru para mix dados+cache',
      ],
      patterns: [
        {
          name: 'Distributed Lock',
          code: `// Adquirir
const token = crypto.randomUUID()
await redis.set('lock', token, { NX: true, EX: 30 })

// Liberar (Lua atômico)
const script = \`
  if redis.call('GET',KEYS[1])==ARGV[1]
  then return redis.call('DEL',KEYS[1])
  else return 0 end\`
await redis.eval(script, 1, 'lock', token)`,
          desc: 'NX para adquirir; UUID + Lua para release seguro',
        },
        {
          name: 'Rate Limiting — Sliding Window',
          code: `-- Lua script atômico
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])
redis.call('ZADD', KEYS[1], now, now)
redis.call('ZREMRANGEBYSCORE', KEYS[1], 0, now - window)
local count = redis.call('ZCARD', KEYS[1])
redis.call('EXPIRE', KEYS[1], window)
if count > limit then return 0 else return 1 end`,
          desc: 'Sliding window precisa com Lua para atomicidade',
        },
        {
          name: 'Cache-Aside',
          code: `// Read
const cached = await redis.get(\`cache:\${id}\`)
if (cached) return JSON.parse(cached)

// Miss — busca e armazena
const data = await db.find(id)
await redis.set(\`cache:\${id}\`, JSON.stringify(data), { EX: 300 })
return data

// Invalidação — DEL é mais seguro que SET
await redis.del(\`cache:\${id}\`)`,
          desc: 'DEL na invalidação — evita race condition com writers',
        },
      ],
      mentalModels: [
        'Estrutura → operação: List para fila, Sorted Set para ranking, Stream para eventos duráveis',
        'KEYS * = morte; SCAN = vida — em produção, sempre SCAN',
        'SET key val NX EX + UUID + Lua release = distributed lock correto',
        'allkeys-lru para cache puro; volatile-lru para mix; noeviction para dados críticos',
        'Sentinel = HA sem sharding; Cluster = HA + sharding horizontal',
      ],
    },
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'Redis',
    stackLabel: 'Database · In-Memory',
  }),
  antipatterns: () => buildAntipatternsPdf({
    antipatterns: ANTIPATTERNS,
    accentColor: C,
    skillName: 'Redis',
    stackLabel: 'Database · In-Memory',
  }),
  'quick-ref': () => buildQuickRefPdf({
    columns: QUICK_REF_COLUMNS,
    skillName: 'Redis',
    accentColor: C,
    stackLabel: 'Database · In-Memory',
    tagline: 'Comandos por estrutura de dados — String, Hash, List, Set, Sorted Set, Stream',
    version: '7.x',
  }),
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function RedisPdfs() {
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
      {open && <PdfModal card={open} onClose={() => setOpen(null)} builders={PDF_BUILDERS} />}
    </>
  )
}
