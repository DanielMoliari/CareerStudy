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
import { ProgressionMap } from '@/components/visuals/ProgressionMap'
import type { ProgressionLevel } from '@/components/visuals/ProgressionMap'

// ── Paleta Rate Limiting ──────────────────────────────────────────────────────
const C      = '#ef4444'   // vermelho — throttling/bloqueio
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#4ade80'
const AMB    = '#f59e0b'
const SKY    = '#38bdf8'
const PRP    = '#a78bfa'
const RED    = '#ef4444'

void LINE; void FG; void SKY; void PRP

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Algoritmos de Rate Limiting comparados (ComparisonTable)
// 4 algoritmos × 6 critérios — impossível comunicar isso em texto sem tabela
// ═══════════════════════════════════════════════════════════════════════════════

const ALG_OPTIONS: ComparisonOption[] = [
  { id: 'token',   label: 'Token Bucket',          sublabel: 'burst permitido',     color: C },
  { id: 'leaky',   label: 'Leaky Bucket',           sublabel: 'taxa constante',      color: AMB },
  { id: 'fixed',   label: 'Fixed Window',           sublabel: 'simples, borda perigosa', color: FGMUTE },
  { id: 'sliding', label: 'Sliding Window Counter', sublabel: 'preciso, O(1)',        color: GRN },
]

const ALG_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'burst',
    label: 'Permite Burst',
    category: 'Comportamento',
    description: 'Se requests acumulados podem ser usados em rajada quando o sistema ficou ocioso',
    values: {
      token:   { rating: 'excellent', note: 'Acumula tokens até capacidade N — burst controlado ✓' },
      leaky:   { rating: 'poor',      note: 'Fila com saída constante — sem burst, nunca' },
      fixed:   { rating: 'fair',      note: 'Burst até o limite no início da janela apenas' },
      sliding: { rating: 'good',      note: 'Burst suavizado — janela deslizante reduz pico' },
    },
  },
  {
    id: 'edge-effect',
    label: 'Efeito de Borda',
    category: 'Precisão',
    description: 'Risco de 2× o limite de requests nas bordas da janela de tempo',
    values: {
      token:   { rating: 'excellent', note: 'Sem janelas fixas — sem efeito de borda' },
      leaky:   { rating: 'excellent', note: 'Taxa constante elimina qualquer efeito de borda' },
      fixed:   { rating: 'poor',      note: 'CRÍTICO: 100 req no seg 59 + 100 no seg 61 = 200 em 2s' },
      sliding: { rating: 'excellent', note: 'Interpolação entre janelas elimina o efeito de borda' },
    },
  },
  {
    id: 'memory',
    label: 'Uso de Memória',
    category: 'Eficiência',
    description: 'Quanto estado é mantido por usuário/chave',
    values: {
      token:   { rating: 'excellent', note: 'O(1) — apenas {tokens, last_refill} por chave' },
      leaky:   { rating: 'fair',      note: 'O(queue) — fila pode crescer se chegada > saída' },
      fixed:   { rating: 'excellent', note: 'O(1) — apenas 1 contador por janela' },
      sliding: { rating: 'excellent', note: 'O(1) — 2 contadores + fração, sem timestamps' },
    },
  },
  {
    id: 'complexity',
    label: 'Complexidade de Implementação',
    category: 'Eficiência',
    description: 'Dificuldade de implementar corretamente em sistema distribuído',
    values: {
      token:   { rating: 'good',      note: 'Médio — lazy refill é elegante, TTL no Redis precisa atenção' },
      leaky:   { rating: 'fair',      note: 'Médio-alto — fila com rate de saída requer sincronização' },
      fixed:   { rating: 'excellent', note: 'INCR + EXPIRE no Redis — mais simples de todos' },
      sliding: { rating: 'good',      note: 'Dois buckets + interpolação — mais complexo que fixed' },
    },
  },
  {
    id: 'accuracy',
    label: 'Precisão do Limite',
    category: 'Precisão',
    description: 'Quão próximo do limite configurado o algoritmo efetivamente opera',
    values: {
      token:   { rating: 'good',      note: 'Preciso — mas burst pode atingir 2× em janelas curtas' },
      leaky:   { rating: 'excellent', note: 'Máxima precisão — taxa de saída absolutamente controlada' },
      fixed:   { rating: 'fair',      note: 'Impreciso — efeito de borda permite 2× o limite' },
      sliding: { rating: 'excellent', note: 'Erro máximo &lt; 0.003% (Cloudflare mediu em produção)' },
    },
  },
  {
    id: 'production',
    label: 'Uso em Produção',
    category: 'Ecossistema',
    description: 'Quais sistemas conhecidos usam este algoritmo',
    values: {
      token:   { rating: 'excellent', note: 'GitHub, Stripe, AWS API Gateway — padrão para APIs públicas' },
      leaky:   { rating: 'good',      note: 'Nginx ngx_stream_limit_conn, proteção de sistemas frágeis' },
      fixed:   { rating: 'fair',      note: 'Redis INCR básico — adequado para MVPs e endpoints não-críticos' },
      sliding: { rating: 'excellent', note: 'Cloudflare, Kong, Envoy ratelimit service — padrão de mercado' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Qual algoritmo usar? (DecisionTree)
// Árvore de decisão — a pergunta "qual usar?" é naturalmente uma decisão binária
// ═══════════════════════════════════════════════════════════════════════════════

const DT_ROOT: DTNode = {
  id: 'root',
  question: 'O que você está protegendo?',
  color: C,
  children: [
    { label: 'API pública com clientes legítimos', nodeId: 'public-api', color: C },
    { label: 'Sistema interno / downstream frágil', nodeId: 'internal', color: AMB },
    { label: 'Endpoint crítico de segurança (login, pagamento)', nodeId: 'critical', color: RED },
  ],
}

const DT_NODES: Record<string, DTNode> = {
  'public-api': {
    id: 'public-api',
    question: 'Clientes podem ter burst legítimo (uso normal mas intenso)?',
    color: C,
    children: [
      { label: 'Sim — burst faz parte do uso normal', nodeId: 'token-bucket', color: GRN },
      { label: 'Não — preciso de taxa absolutamente uniforme', nodeId: 'sliding-counter', color: GRN },
    ],
  },
  'internal': {
    id: 'internal',
    question: 'O downstream aguenta variações de taxa?',
    color: AMB,
    children: [
      { label: 'Não — downstream é frágil, precisa de taxa constante', nodeId: 'leaky-bucket', color: GRN },
      { label: 'Sim — só precisa de proteção básica', nodeId: 'fixed-window-ok', color: GRN },
    ],
  },
  'critical': {
    id: 'critical',
    question: 'É endpoint de autenticação (login, reset senha)?',
    color: RED,
    children: [
      { label: 'Sim — autenticação', nodeId: 'sliding-ip-user', color: GRN },
      { label: 'Não — financeiro / write crítico', nodeId: 'sliding-counter-strict', color: GRN },
    ],
  },
  'token-bucket': {
    id: 'token-bucket',
    recommendation: 'Token Bucket',
    detail: 'Burst permitido. Estado mínimo (tokens + last_refill). GitHub, Stripe, AWS usam. Lazy refill sem timer. Capacidade controla pico máximo.',
    color: GRN,
    icon: '🪣',
  },
  'sliding-counter': {
    id: 'sliding-counter',
    recommendation: 'Sliding Window Counter',
    detail: 'Sem efeito de borda. O(1) memória. Erro &lt; 0.003% (Cloudflare). 2 contadores + interpolação. Ideal para APIs em escala.',
    color: GRN,
    icon: '📊',
  },
  'leaky-bucket': {
    id: 'leaky-bucket',
    recommendation: 'Leaky Bucket',
    detail: 'Taxa de saída absolutamente constante — downstream nunca vê spike. Fila amortece picos de entrada. Use quando o downstream não tolera variação.',
    color: GRN,
    icon: '🪣',
  },
  'fixed-window-ok': {
    id: 'fixed-window-ok',
    recommendation: 'Fixed Window (com consciência do risco)',
    detail: 'INCR + EXPIRE no Redis — simplicidade máxima. Efeito de borda permite 2× o limite. Aceitável em endpoints internos não-críticos ou MVPs.',
    color: AMB,
    icon: '🪟',
  },
  'sliding-ip-user': {
    id: 'sliding-ip-user',
    recommendation: 'Sliding Window + Limite por IP e Username',
    detail: 'Limite duplo: por IP (bloqueia automação) E por username (impede credential stuffing). IP sozinho falha em NAT. Username sozinho permite enumerar. Combinação é a defesa correta.',
    color: GRN,
    icon: '🔒',
  },
  'sliding-counter-strict': {
    id: 'sliding-counter-strict',
    recommendation: 'Sliding Window Counter + Idempotency Key',
    detail: 'Sliding window sem efeito de borda + idempotency key para evitar replay de operação financeira. Redis Lua atômico. Rate limit mais estrito (ex: 5 transações/h).',
    color: GRN,
    icon: '💳',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Anti-patterns (AntiPatternsGallery)
// Os erros têm código concreto — diff errado/certo ensina melhor que descrição
// ═══════════════════════════════════════════════════════════════════════════════

type CodeLine = { text: string; color?: string }[]

const ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'Rate limit por IP apenas (quebra em NAT corporativo)',
    wrong: [
      [{ text: '// ❌ Limitar só por IP', color: C }],
      [{ text: 'const key = `rl:${req.ip}`' }],
      [{ text: '// NAT corporativo: 1000 usuários com o mesmo IP', color: C }],
      [{ text: '// Um usuário faz 100 requests → todos os 999 outros são bloqueados', color: C }],
      [{ text: 'if (await isRateLimited(key, 100)) return res.status(429).json({error: "limited"})' }],
    ] as CodeLine[],
    right: [
      [{ text: '// ✅ Camadas: IP (bot) + usuário autenticado (fairness)', color: GRN }],
      [{ text: 'const ipKey   = `rl:ip:${req.ip}`' }],
      [{ text: 'const userKey = `rl:user:${req.user?.id ?? req.ip}`' }],
      [{ text: '// IP: limite alto (500/min) — bloqueia automação' }],
      [{ text: '// Usuário: limite real (100/min) — fairness por conta' }],
      [{ text: 'if (await isRateLimited(ipKey, 500) || await isRateLimited(userKey, 100))' }],
      [{ text: '  return res.status(429).json({error: "rate limited"})' }],
    ] as CodeLine[],
    why: 'IP sozinho causa falso positivo em NAT — bloqueia todos os usuários de um escritório por culpa de um. Camada dupla (IP para automação + usuário para fairness) resolve sem falsos positivos.',
  },
  {
    title: 'Contador local com múltiplos pods (limite ilusório)',
    wrong: [
      [{ text: '// ❌ Map local — não funciona com auto-scaling', color: C }],
      [{ text: 'const counters = new Map<string, number>()' }],
      [{ text: '' }],
      [{ text: 'function isLimited(userId: string, limit = 100): boolean {' }],
      [{ text: '  const count = (counters.get(userId) ?? 0) + 1', color: C }],
      [{ text: '  counters.set(userId, count)' }],
      [{ text: '  return count > limit' }],
      [{ text: '}' }],
      [{ text: '// Com 10 pods: usuário pode fazer 10 × 100 = 1000 requests!', color: C }],
    ] as CodeLine[],
    right: [
      [{ text: '// ✅ Redis centralizado — funciona com N pods', color: GRN }],
      [{ text: 'async function isLimited(userId: string, limit = 100, ttl = 60) {' }],
      [{ text: '  const key = `rl:${userId}:${Math.floor(Date.now() / (ttl * 1000))}`' }],
      [{ text: '  // Lua atômico: INCR + EXPIRE inseparáveis', color: GRN }],
      [{ text: '  const count = await redis.eval(LUA_SCRIPT, 1, key, ttl) as number' }],
      [{ text: '  return count > limit' }],
      [{ text: '}' }],
      [{ text: '// 10 pods → mesmo contador Redis → limite real mantido', color: GRN }],
    ] as CodeLine[],
    why: 'Contador local por pod faz o limite real ser N × limite configurado onde N é o número de instâncias. Com auto-scaling (10 pods), limite de 100/min vira 1000/min efetivo.',
  },
  {
    title: '429 sem Retry-After (amplifica o problema)',
    wrong: [
      [{ text: '// ❌ 429 sem Retry-After', color: C }],
      [{ text: 'if (isLimited) {' }],
      [{ text: '  return res.status(429).json({', color: C }],
      [{ text: '    error: "Too Many Requests"', color: C }],
      [{ text: '  })' }],
      [{ text: '}' }],
      [{ text: '' }],
      [{ text: '// Cliente bem-feito recebe 429 sem saber quando tentar' }],
      [{ text: '// Resultado: retry loop imediato → amplifica o problema', color: C }],
    ] as CodeLine[],
    right: [
      [{ text: '// ✅ 429 com todos os headers RFC 6585', color: GRN }],
      [{ text: 'if (isLimited) {' }],
      [{ text: '  const resetAt = (windowId + 1) * windowSec' }],
      [{ text: '  res.setHeader("Retry-After", windowSec)', color: GRN }],
      [{ text: '  res.setHeader("X-RateLimit-Limit", limit)', color: GRN }],
      [{ text: '  res.setHeader("X-RateLimit-Remaining", 0)', color: GRN }],
      [{ text: '  res.setHeader("X-RateLimit-Reset", resetAt)', color: GRN }],
      [{ text: '  return res.status(429).json({' }],
      [{ text: '    error: "Too Many Requests",' }],
      [{ text: '    retryAfter: windowSec', color: GRN }],
      [{ text: '  })' }],
      [{ text: '}' }],
    ] as CodeLine[],
    why: 'Sem Retry-After, um cliente que implementa retry automático vai disparar requests a cada falha imediatamente. Em vez de proteger o servidor, você criou um amplificador de carga.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Progression Map: Jornada de domínio de rate limiting
// ═══════════════════════════════════════════════════════════════════════════════

const RL_PROGRESSION: ProgressionLevel[] = [
  {
    id: 'junior',
    name: 'Júnior',
    label: 'Fundamentos',
    emoji: '🌱',
    concepts: [
      { name: '429 Too Many Requests', tip: 'Status code para rate limit excedido — com Retry-After obrigatório' },
      { name: 'Limitar por IP', tip: 'Primeira linha de proteção — mas falha em NAT corporativo/VPN' },
      { name: 'Janela de tempo', tip: '100 requests/minuto — o conceito básico de limite por janela' },
      { name: 'Headers de rate limit', tip: 'X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset' },
    ],
  },
  {
    id: 'pleno',
    name: 'Pleno',
    label: 'Algoritmos',
    emoji: '⚙️',
    concepts: [
      { name: 'Token Bucket vs Leaky Bucket', tip: 'Token permite burst. Leaky garante taxa constante. Propósitos diferentes.' },
      { name: 'Fixed Window — efeito de borda', tip: '2× o limite nas bordas da janela — atacante explora isso' },
      { name: 'Redis INCR + EXPIRE', tip: 'Contador centralizado — funciona com N pods sem contador local' },
      { name: 'Limitar por usuário autenticado', tip: 'Fairness real — IP falha em NAT, usuário garante por conta' },
      { name: 'Limitar endpoint caro', tip: 'Export, search, PDF gen — endpoints caros precisam de limite mais estrito' },
    ],
  },
  {
    id: 'senior',
    name: 'Sênior',
    label: 'Distribuído',
    emoji: '🏗️',
    concepts: [
      { name: 'Lua script atômico no Redis', tip: 'INCR + EXPIRE inseparáveis — evita race condition entre pods' },
      { name: 'Sliding Window Counter', tip: '2 contadores + interpolação — O(1) memória, sem efeito de borda' },
      { name: 'Rate limit por tokens (LLM)', tip: 'Custo variável — INCRBY com tokens consumidos, não contagem de requests' },
      { name: 'Fail-Open vs Fail-Closed', tip: 'Redis offline: permitir tudo (disponibilidade) ou negar tudo (segurança)' },
      { name: 'Rate limit L7 com HTTP/2', tip: 'Rate limit por conexão TCP não funciona — HTTP/2 tem N streams por TCP' },
    ],
  },
  {
    id: 'especialista',
    name: 'Especialista',
    label: 'Escala e Resiliência',
    emoji: '🔬',
    concepts: [
      { name: 'Redis Cluster com sharding por user_id', tip: 'Distribui carga do rate limiter — evita hotspot numa shard' },
      { name: 'Cache local + sync periódico', tip: 'Aproximado mas evita latência de rede em requests críticos de performance' },
      { name: 'Rate limit + Circuit Breaker juntos', tip: 'Rate limit na entrada. Circuit breaker na saída para downstream.' },
      { name: 'GraphQL query complexity', tip: 'Rate limit por custo de query, não por número — queries têm custo variável' },
      { name: 'Monitoramento e ajuste contínuo', tip: 'P99 de requests por usuário, taxa de 429, top offenders — ajuste com dados' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// Componente principal
// ═══════════════════════════════════════════════════════════════════════════════

export default function RateLimitingVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'algorithm-comparison',
      title: 'Algoritmos Comparados',
      subtitle: 'Token Bucket, Leaky Bucket, Fixed Window, Sliding Counter — 6 critérios',
      accent: C,
      component: (
        <ComparisonTable
          options={ALG_OPTIONS}
          criteria={ALG_CRITERIA}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'decision-tree',
      title: 'Qual Algoritmo Usar?',
      subtitle: 'Árvore de decisão baseada no que você está protegendo',
      accent: AMB,
      component: (
        <DecisionTree
          root={DT_ROOT}
          nodes={DT_NODES}
          accentColor={AMB}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns Críticos',
      subtitle: 'Os 3 erros que fazem rate limiting não funcionar em produção',
      accent: C,
      component: (
        <AntiPatternsGallery
          patterns={ANTIPATTERNS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'progression',
      title: 'Jornada de Domínio',
      subtitle: 'Do 429 básico ao rate limiter resiliente em escala — o que cada nível sabe',
      accent: GRN,
      component: (
        <ProgressionMap
          levels={RL_PROGRESSION}
          accentColor={GRN}
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
