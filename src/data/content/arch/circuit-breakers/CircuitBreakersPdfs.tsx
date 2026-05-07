'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildQuickRefPdf } from '@/components/pdfs/QuickRefPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'

// ── Paleta Circuit Breakers ───────────────────────────────────────────────────
const C    = '#f97316'  // orange — NUNCA omitir
const GRN  = '#22c55e'
const RED  = '#ef4444'
const AMB  = '#f59e0b'
const PRP  = '#a78bfa'
const SKY  = '#38bdf8'

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas sobre Circuit Breaker em entrevista sênior',
    type: 'qa',
    pages: 10,
    description: 'Perguntas de nível pleno e sênior: estados e transições, cascading failure, retry storm, bulkhead, calibração de parâmetros, Resilience4j vs Hystrix, fallback progressivo, chaos engineering e testes em CI. Respostas com HTML rico e dicas de apresentação.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'quick-ref',
    title: 'Quick Reference',
    subtitle: 'Estados, parâmetros, bibliotecas e padrões em uma página',
    type: 'quick-ref',
    pages: 2,
    description: 'Referência densa: três estados com comportamento e saída, parâmetros chave (failureRate, slowCall, resetTimeout, minimumCalls), bibliotecas por linguagem, padrões combinados e Resilience4j config mínima.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Os 4 truques que grudam Circuit Breaker na memória',
    type: 'mnemonics',
    pages: 2,
    description: 'CHOF (estados em ordem), RTV (parâmetros chave), FBM (cadeia de resiliência correta) e OSCILA (diagnóstico de threshold mal calibrado). Com explicações e exemplos de aplicação.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'Os 4 erros que arruínam circuit breakers em produção',
    type: 'antipatterns',
    pages: 3,
    description: 'Breaker sem fallback útil, limiar muito sensível (oscilação), request sem timeout subjacente e estado em memória com múltiplas instâncias. Com código wrong/right e explicação do impacto.',
    icon: '04',
    goal: 'Reconhecimento de padrão',
  },
]

// ── Dados: Q&A ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'Quais são os três estados do circuit breaker e como as transições funcionam?',
    a: '<strong>CLOSED</strong>: chamadas passam normalmente. Monitora em janela deslizante. Se failureRate > threshold (ex: 50%) <em>e</em> minimumCalls atingido (ex: 20), abre. <strong>OPEN</strong>: rejeita imediatamente (fail-fast). Após resetTimeout (ex: 30s), vai para HALF_OPEN. <strong>HALF_OPEN</strong>: N probe calls (ex: 5). Se passarem → CLOSED. Se qualquer falhar → OPEN novamente. Janela deslizante com volume mínimo evita abertura por amostra pequena.',
    tip: 'Mencione a janela deslizante e o volume mínimo. Candidatos que omitem pensam em contador simples, não janela. Isso diferencia pleno de sênior.',
  },
  {
    level: 'Pleno',
    q: 'O que é cascading failure e como o circuit breaker previne?',
    a: 'Dependência lenta → threads do cliente presas aguardando → thread pool esgotado → cliente fica unresponsive → outros serviços que chamam o cliente também caem. A cascata se propaga upstream. O breaker previne ao <strong>rejeitar imediatamente em OPEN</strong> sem consumir thread. A falha fica contida na borda — não se propaga para upstream.',
    tip: 'Use o exemplo de thread pool exhaustion. É o mecanismo exato que torna a cascata possível. Quem explica o mecanismo físico demonstra entendimento real.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre circuit breaker e retry? São concorrentes?',
    a: 'São <strong>complementares</strong>. Retry resolve falha <em>transiente</em> (network blip, instabilidade pontual). Breaker resolve falha <em>sustentada</em> (serviço fora por minutos). Retry sem breaker = retry storm: dependência lenta + retry amplifica carga exponencialmente. Padrão correto: retry com backoff exponencial + jitter DENTRO do breaker. Quando breaker abre, para de fazer retry automaticamente.',
    tip: 'Mencionar retry storm é o ponto forte. Demonstra que você entende efeitos sistêmicos, não só padrões isolados.',
  },
  {
    level: 'Pleno',
    q: 'O que é bulkhead e como complementa o circuit breaker?',
    a: 'Bulkhead isola pools de recursos por dependência. Cada dependência tem seu próprio pool de threads/semáforo. Falha em serviço A consome no máximo N threads do pool A — pool B permanece disponível. Complementa o breaker porque: breaker evita chamadas quando serviço está ruim, mas ANTES do breaker abrir, threads ainda são consumidas. Com bulkhead, o raio de impacto é limitado mesmo antes do breaker agir. Hystrix popularizou bulkhead + breaker juntos.',
    tip: 'Citar Hystrix como quem popularizou o combo demonstra conhecimento histórico. ThreadPoolBulkhead vs SemaphoreBulkhead é detalhe que diferencia.',
  },
  {
    level: 'Pleno',
    q: 'Quais métricas você expõe para um circuit breaker em produção?',
    a: '<code>circuit_breaker_state</code> (0=CLOSED, 1=OPEN, 2=HALF_OPEN) — alerte quando OPEN. <code>circuit_breaker_failure_rate</code> — tendência antes de abrir. <code>circuit_breaker_slow_call_rate</code> — trip wire por latência. <code>circuit_breaker_calls_total</code> por outcome (success/failure/rejected/timeout). <code>circuit_breaker_state_transitions_total</code> — oscilação alta indica threshold mal calibrado. Resilience4j expõe via Micrometer automaticamente.',
    tip: 'Mencionar slow_call_rate diferencia muito. A maioria cita só failure_rate. Trip wire por latência é feature avançada que poucos conhecem.',
  },
  {
    level: 'Senior',
    q: 'Como você calibra os parâmetros de um circuit breaker para serviço crítico?',
    a: 'Calibração baseada em dados: (1) Monitor 2 semanas antes de ativar → taxa base de erro. Se baseline = 1%, threshold = 10-15% (margem 10x). (2) P99 normal = 200ms → slowCallDuration = 1-2s (5-10x). (3) minimumNumberOfCalls ≥ 20-30 para evitar amostra pequena. (4) resetTimeout = baseado em tempo médio de recovery de post-mortems (não chutar). (5) Deploy → observa 1 semana → ajusta. Evite otimização prematura de parâmetros.',
    tip: 'A abordagem de 2 semanas de baseline mostra experiência com produção real. Candidatos que chutam parâmetros nunca calibraram em produção.',
  },
  {
    level: 'Senior',
    q: 'Qual a diferença entre window por contagem e por tempo no Resilience4j?',
    a: '<strong>COUNT_BASED</strong>: avalia as últimas N chamadas (ex: 100). Simples, mas pode ser enganosa em baixo tráfego — 100 chamadas podem representar 1h ou 1s. <strong>TIME_BASED</strong>: avalia chamadas nos últimos N segundos (ex: 60s). Mais representativo de "agora", mas requer tráfego constante para ter dados. Regra: tráfego irregular (cron, batch) → COUNT_BASED. Serviço com tráfego constante → TIME_BASED.',
    tip: 'A ressalva sobre tráfego irregular é o detalhe de produção. Maioria usa TIME_BASED sem pensar no caso de serviço batch.',
  },
  {
    level: 'Senior',
    q: 'Como circuit breaker + retry + timeout formam cadeia de resiliência coesa?',
    a: 'Ordem de decorators (mais externo para mais interno): <strong>Circuit Breaker → Retry → Timeout → HTTP Call</strong>. Timeout: limite por chamada individual. Retry: tenta após falha transiente com backoff. Breaker: monitora saúde — se muitos retries falham, abre e para de tentar. Breaker mais externo decide se vale tentar; timeout mais interno define limite por tentativa. Em Resilience4j: <code>Decorators.ofSupplier(call).withCircuitBreaker(cb).withRetry(retry)</code>.',
    tip: 'A ordem dos decorators é o ponto que mais candidatos erram. Breaker mais externo é a resposta crítica — demonstra entendimento arquitetural.',
  },
  {
    level: 'Senior',
    q: 'Como o breaker se comporta com 100 instâncias do serviço?',
    a: 'Cada instância tem estado próprio em memória — algumas podem estar OPEN, outras CLOSED. É <strong>aceitável</strong> na maioria dos casos — convergem porque todas veem a mesma dependência degradada. Para decisão global coordenada: use <strong>service mesh</strong> (Istio outlier detection no sidecar Envoy) que decide baseado em observações de todas as instâncias, ou Redis centralizado com TTL. Centralizar adiciona ponto único de falha — analise o tradeoff. 95% dos casos: breaker por instância suficiente.',
    tip: 'Mencionar service mesh como solução para decisão global mostra maturidade. A ressalva de ponto único de falha no Redis centralizado é o que candidatos esquecem.',
  },
  {
    level: 'Senior',
    q: 'Como você testa circuit breaker em ambiente de CI e em produção?',
    a: '<strong>Unitário em CI</strong>: mock que injeta falhas, assert no estado do breaker após N chamadas. Valida transições CLOSED→OPEN→HALF_OPEN→CLOSED. <strong>Integração</strong>: toxiproxy ou WireMock para simular latência e erros reais. Valida fallback correto + métricas emitidas. <strong>Produção (chaos engineering)</strong>: injeta latência progressiva (2s, 4s, 8s) em staging com tráfego realista. Valida que breaker abre no threshold correto, fallback funciona, sistema mantém disponibilidade > 99%. Game day trimestral para simular falha de dependência crítica.',
    tip: 'Citar toxiproxy e game day demonstra experiência prática com chaos engineering, não só teoria. É o que diferencia candidato que leu sobre de quem praticou.',
  },
]

// ── Dados: Quick Reference ────────────────────────────────────────────────────

const QUICK_REF_DATA = {
  columns: [
    {
      sections: [
        {
          title: 'Estados',
          entries: [
            { key: 'CLOSED', value: 'Normal — chamadas passam, monitora', badge: 'Normal', badgeColor: GRN },
            { key: 'OPEN', value: 'Fail-fast — rejeita imediatamente', badge: 'Falha', badgeColor: RED },
            { key: 'HALF_OPEN', value: 'Testando — N probes passam → CLOSED', badge: 'Teste', badgeColor: AMB },
          ],
        },
        {
          title: 'Parâmetros Chave',
          entries: [
            { key: 'failureRateThreshold', value: '50% — taxa de erro para abrir', badge: 'Rate', badgeColor: C },
            { key: 'slowCallRateThreshold', value: '80% — taxa de lentas para abrir', badge: 'Latência', badgeColor: AMB },
            { key: 'slowCallDurationThreshold', value: '2s — define "chamada lenta"', badge: 'Tempo', badgeColor: SKY },
            { key: 'minimumNumberOfCalls', value: '20 — amostra mínima na janela', badge: 'Volume', badgeColor: PRP },
            { key: 'waitDurationInOpenState', value: '30s — tempo em OPEN antes de HALF_OPEN', badge: 'Reset', badgeColor: C },
            { key: 'permittedCallsInHalfOpen', value: '5 — probes em HALF_OPEN', badge: 'Probes', badgeColor: GRN },
          ],
        },
      ],
    },
    {
      sections: [
        {
          title: 'Bibliotecas por Linguagem',
          entries: [
            { key: 'Java / Kotlin', value: 'Resilience4j', badge: 'Recomendado', badgeColor: GRN },
            { key: '.NET / C#', value: 'Polly', badge: 'Maduro', badgeColor: SKY },
            { key: 'Node.js', value: 'opossum', badge: 'Leve', badgeColor: AMB },
            { key: 'Go', value: 'gobreaker', badge: 'Simples', badgeColor: PRP },
            { key: 'Service Mesh', value: 'Istio outlier detection', badge: 'Zero código', badgeColor: '#38bdf8' },
            { key: 'Python', value: 'pybreaker', badge: 'Community', badgeColor: '#94a3b8' },
          ],
        },
        {
          title: 'Padrões Combinados',
          entries: [
            { key: 'Timeout', value: 'Mais interno — limita latência por chamada', badge: 'Layer 1', badgeColor: SKY },
            { key: 'Retry + Jitter', value: 'Resolve falha transiente', badge: 'Layer 2', badgeColor: AMB },
            { key: 'Circuit Breaker', value: 'Mais externo — monitora saúde', badge: 'Layer 3', badgeColor: C },
            { key: 'Bulkhead', value: 'Pool isolado por dependência', badge: 'Paralelo', badgeColor: PRP },
            { key: 'Fallback', value: 'Cache → default → queue → erro', badge: 'UX', badgeColor: GRN },
          ],
        },
      ],
    },
  ],
}

// ── Dados: Mnemônicos ─────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'CHOF — estados em ordem de recuperação',
    trick: 'Closed Has Open Flow',
    expansion: [
      ['Closed', 'Estado normal — chamadas passam'],
      ['Has', '(Half-open) — estado de teste'],
      ['Open', 'Fail-fast — rejeita tudo'],
      ['Flow', 'O objetivo: recuperar o fluxo (→ Closed)'],
    ],
    explanation: 'Os três estados e a direção de recuperação: OPEN → HALF_OPEN → CLOSED. "Closed Has Open Flow" lembra os três estados e que o objetivo é sempre retornar ao Closed.',
    example: 'CLOSED (normal) → [failureRate > 50%] → OPEN → [30s] → HALF_OPEN → [5 probes OK] → CLOSED',
    why: 'A sequência de estados é A pergunta de entrevista sobre circuit breaker. Saber de cor é obrigatório.',
  },
  {
    label: 'RTV — os três parâmetros essenciais',
    trick: 'Rate, Timeout, Volume',
    expansion: [
      ['R = Rate', 'failureRateThreshold — taxa de erro para abrir (ex: 50%)'],
      ['T = Timeout', 'waitDurationInOpenState — quanto fica OPEN (ex: 30s)'],
      ['V = Volume', 'minimumNumberOfCalls — amostra mínima (ex: 20)'],
    ],
    explanation: 'Se você lembrar RTV, consegue configurar qualquer biblioteca de circuit breaker. São os três parâmetros sem os quais o breaker não funciona corretamente.',
    example: 'failureRate=50%, resetTimeout=30s, minimumCalls=20 → configuração básica funcional',
    why: 'Em entrevista, ao falar de calibração, mostrar que você conhece os três parâmetros essenciais demonstra que você já configurou em produção.',
  },
  {
    label: 'FBM — ordem correta dos decorators de resiliência',
    trick: 'Fail-fast, Backoff, Monitor',
    expansion: [
      ['F = Fail-fast', 'Timeout por chamada — mais interno'],
      ['B = Backoff', 'Retry com backoff exponencial + jitter — camada do meio'],
      ['M = Monitor', 'Circuit Breaker monitora saúde — mais externo'],
    ],
    explanation: 'A ordem de composição: CB.decorate(retry.decorate(timeout.decorate(call))). FBM = a sequência do mais interno para o mais externo. Inverter a ordem quebra o comportamento.',
    example: 'Breaker mais externo decide se vale tentar. Retry no meio tenta algumas vezes. Timeout no mais interno define limite por tentativa.',
    why: 'A ordem dos decorators é o que mais candidatos erram. FBM fixa a ordem correta de fora para dentro.',
  },
  {
    label: 'OSCILA — diagnóstico de threshold mal calibrado',
    trick: 'O Serviço Cicla Indefinidamente Ligando e Abrindo',
    expansion: [
      ['Sintoma', 'Breaker abre e fecha rapidamente (oscilando)'],
      ['Causa 1', 'failureRateThreshold muito baixo'],
      ['Causa 2', 'minimumNumberOfCalls muito baixo'],
      ['Causa 3', 'waitDurationInOpenState muito curto'],
      ['Fix', 'Aumentar mínimo de chamadas + threshold + reset timeout'],
    ],
    explanation: 'Quando o breaker fica oscillando (abrindo e fechando rapidamente), OSCILA é o diagnóstico: threshold sensível demais, amostra pequena demais ou reset muito rápido.',
    example: 'minimumCalls=1 + failureRate=10% → 1 falha abre o circuito → feita 1 probe → falha → abre de novo → cicla',
    why: 'Oscilação é o sintoma mais comum de configuração errada em produção. Identificar rapidamente economiza horas de debugging.',
  },
]

// ── Dados: Anti-patterns ──────────────────────────────────────────────────────

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'Breaker sem fallback — falha mais rápido, não melhor',
    badDesc: 'Breaker abre mas não tem resposta alternativa — usuário recebe erro igual, só mais rápido',
    badCode: [
      { t: 'const breaker = new CircuitBreaker(callService, {\n', c: '#e2e8f0' },
      { t: '  errorThresholdPercentage: 50,\n', c: '#e2e8f0' },
      { t: '  resetTimeout: 30000\n', c: '#e2e8f0' },
      { t: '})\n\n', c: '#e2e8f0' },
      { t: '// ❌ sem fallback configurado\n', c: RED },
      { t: '// OPEN → lança OpenCircuitError\n', c: RED },
      { t: '// Usuário vê 500 — pior que antes\n', c: RED },
    ],
    goodDesc: 'Fallback progressivo: cache → default → fila → erro amigável',
    goodCode: [
      { t: '// ✅ Fallback progressivo\n', c: GRN },
      { t: 'breaker.fallback(async () => {\n', c: '#e2e8f0' },
      { t: '  const cached = ', c: '#e2e8f0' }, { t: 'await redis.get("key")\n', c: GRN },
      { t: '  if (cached) return JSON.parse(cached)\n', c: GRN },
      { t: '  return { status: "degraded", data: DEFAULT_RESPONSE }\n', c: AMB },
      { t: '})\n', c: '#e2e8f0' },
      { t: 'breaker.on("open", () => logger.warn("CB OPEN"))\n', c: GRN },
    ],
    why: 'Sem fallback, o breaker apenas muda o tipo do erro. Com fallback, o sistema tem graceful degradation — experiência reduzida, mas funcional.',
  },
  {
    title: 'Limiar muito sensível — breaker oscilando',
    badDesc: 'threshold tão baixo que 1-2 falhas abrem o circuito, causando oscilação constante',
    badCode: [
      { t: 'CircuitBreakerConfig.custom()\n', c: '#e2e8f0' },
      { t: '  .minimumNumberOfCalls(1)    // ❌ abre com 1 falha\n', c: RED },
      { t: '  .failureRateThreshold(10f)  // ❌ sensível demais\n', c: RED },
      { t: '  .waitDurationInOpenState(   // ❌ reseta muito rápido\n', c: RED },
      { t: '     Duration.ofSeconds(1))\n', c: RED },
      { t: '// Resultado: oscila 100x por minuto\n', c: RED },
    ],
    goodDesc: 'Baseado em baseline de 2 semanas: taxa normal × 10x, mínimo 20 calls, reset >= 30s',
    goodCode: [
      { t: 'CircuitBreakerConfig.custom()\n', c: '#e2e8f0' },
      { t: '  .minimumNumberOfCalls(20)   // ✅ amostra mínima\n', c: GRN },
      { t: '  .failureRateThreshold(50f)  // ✅ 10x sobre baseline 5%\n', c: GRN },
      { t: '  .waitDurationInOpenState(   // ✅ tempo de recovery real\n', c: GRN },
      { t: '     Duration.ofSeconds(30))\n', c: GRN },
      { t: '  .build()\n', c: '#e2e8f0' },
    ],
    why: 'Threshold mal calibrado causa oscilação — breaker abre e fecha rapidamente, criando ruído nas métricas e falsa sensação de problema. Sempre base-lie primeiro.',
  },
  {
    title: 'HTTP client sem timeout — breaker nunca conta a falha',
    badDesc: 'Request sem timeout fica pendurado indefinidamente — breaker não vê o erro',
    badCode: [
      { t: '// ❌ axios sem timeout\n', c: RED },
      { t: 'const res = await axios.get("http://slow-svc/api")\n', c: RED },
      { t: '// Se slow-svc travar:\n', c: RED },
      { t: '// request fica pendurado para sempre\n', c: RED },
      { t: '// thread presa, breaker nunca registra erro\n', c: RED },
      { t: '// breaker em CLOSED para sempre = inútil\n', c: RED },
    ],
    goodDesc: 'Timeout no cliente HTTP E no breaker — dois níveis de proteção',
    goodCode: [
      { t: '// ✅ Timeout em duas camadas\n', c: GRN },
      { t: 'const res = await axios.get("http://slow-svc/api", {\n', c: '#e2e8f0' },
      { t: '  timeout: 3000  // 3s — timeout por chamada\n', c: GRN },
      { t: '})\n\n', c: '#e2e8f0' },
      { t: '// ✅ Breaker também tem timeout\n', c: GRN },
      { t: 'new CircuitBreaker(fn, { timeout: 3000 })\n', c: GRN },
    ],
    why: 'Sem timeout, o request nunca termina → breaker nunca registra falha → nunca abre. Timeout é pré-requisito para o breaker funcionar.',
  },
  {
    title: 'Sem monitoramento do estado do breaker',
    badDesc: 'Breaker em OPEN há 10 minutos — ninguém sabe, sistema está degradado silenciosamente',
    badCode: [
      { t: 'const breaker = new CircuitBreaker(fn, options)\n', c: '#e2e8f0' },
      { t: '// ❌ sem eventos configurados\n', c: RED },
      { t: '// ❌ sem métricas Prometheus\n', c: RED },
      { t: '// ❌ sem alarme quando OPEN\n', c: RED },
      { t: '\n// Sistema em OPEN por 30min\n', c: RED },
      { t: '// Todos recebem fallback\n', c: RED },
      { t: '// Ninguém sabe\n', c: RED },
    ],
    goodDesc: 'Eventos, métricas e alarme imediato quando breaker abre',
    goodCode: [
      { t: '// ✅ Observabilidade completa\n', c: GRN },
      { t: 'breaker.on("open", () => {\n', c: GRN },
      { t: '  logger.warn("CB OPEN — pagamentos em fallback")\n', c: GRN },
      { t: '  metrics.gauge("cb.state", 1) // alerta PagerDuty\n', c: GRN },
      { t: '})\n', c: '#e2e8f0' },
      { t: 'breaker.on("close", () => metrics.gauge("cb.state", 0))\n', c: GRN },
      { t: '// SLO: fallback conta como degradação, não sucesso\n', c: AMB },
    ],
    why: 'Sem métricas e alarme, o breaker em OPEN é invisível. O sistema parece funcionando (fallback entrega resposta) mas está degradado. Connectar ao SLO tracking é fundamental.',
  },
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Circuit Breakers',
    stackLabel: 'Arquitetura · Resiliência',
  }),
  'quick-ref': () => buildQuickRefPdf({
    columns: QUICK_REF_DATA.columns,
    skillName: 'Circuit Breakers',
    accentColor: C,
    stackLabel: 'Arquitetura · Resiliência',
    tagline: 'Falhar rápido para evitar cascading failure',
    version: 'Resilience4j 2.x · opossum 8.x · Polly 8.x',
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'Circuit Breakers',
    stackLabel: 'Arquitetura · Resiliência',
  }),
  antipatterns: () => buildAntipatternsPdf({
    antipatterns: ANTIPATTERNS,
    accentColor: C,
    skillName: 'Circuit Breakers',
    stackLabel: 'Arquitetura · Resiliência',
  }),
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function CircuitBreakersPdfs() {
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
