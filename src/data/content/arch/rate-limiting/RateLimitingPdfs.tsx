'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildQuickRefPdf } from '@/components/pdfs/QuickRefPdf'
import type { QuickRefColumn } from '@/components/pdfs/QuickRefPdf'

// ── Paleta Rate Limiting ──────────────────────────────────────────────────────
const C = '#ef4444'  // vermelho — throttling/bloqueio

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 18 perguntas de rate limiting mais cobradas em entrevista pleno/sênior',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: algoritmos (token bucket vs leaky vs sliding window), implementação distribuída com Redis Lua, onde aplicar no stack, headers RFC 6585, rate limit por tokens para LLM, interação com HTTP/2, Circuit Breaker vs Rate Limit e todos os cenários que entrevistadores realmente perguntam.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'quick-ref',
    title: 'Quick Reference',
    subtitle: 'Algoritmos, Redis Lua, headers RFC 6585 e antipadrões — cartão de bolso',
    type: 'quick-ref',
    pages: 1,
    description: 'Comparação de 4 algoritmos por 5 critérios, Lua script atômico completo, todos os headers RFC 6585, antipadrões críticos e quando usar cada algoritmo. Ideal para revisar antes de entrevista de system design.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Os 5 truques que grudam rate limiting na memória',
    type: 'mnemonics',
    pages: 2,
    description: 'TFSS para os 4 algoritmos, por que 429 sem Retry-After amplifica o problema, INCR atômico no Redis, camadas Edge→Gateway→App→Client e Fail-Open vs Fail-Closed — cada um com âncora verbal memorável.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
]

// ── Dados: Q&A ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'Qual a diferença entre token bucket e leaky bucket?',
    a: '<strong>Token Bucket</strong>: bucket com capacidade N. Tokens chegam a taxa fixa r/seg. Request consome 1 token. Permite burst — se sistema ocioso, acumula tokens até N e pode processar pico. Estado: {tokens, last_refill} = O(1). Ideal para APIs públicas que lidam com burst legítimo. <strong>Leaky Bucket</strong>: fila com saída constante Q req/seg. Independente do ritmo de chegada, saída é absolutamente uniforme. Sem burst. Ideal para proteger downstream frágil. Analogia: Token=conta bancária (acumula), Leaky=torneira (fluxo constante).',
    tip: 'Token Bucket=burst para APIs públicas. Leaky Bucket=proteção de sistema frágil. A escolha depende do que você está protegendo, não do que prefere.',
  },
  {
    level: 'Senior',
    q: 'Como implementar rate limiting distribuído sem race condition?',
    a: 'Problema: N pods com contador local = N × limite real. Solução: Redis com Lua script atômico. Lua em Redis é single-threaded — INCR + EXPIRE são inseparáveis, sem interleaving de outros comandos. O script: INCR a chave, se count==1 então EXPIRE(windowSec). Retorna count. App verifica count vs limite. Chave: "rl:{userId}:{endpoint}:{windowId}". TTL garante que chaves antigas expiram automaticamente.',
    tip: 'Lua no Redis é a resposta-chave. Explique que atomicidade é a propriedade necessária e que INCR sozinho sem EXPIRE cria vazamento de memória.',
  },
  {
    level: 'Senior',
    q: 'Explique o Sliding Window Counter e por que é melhor que Fixed Window e Sliding Log.',
    a: '<strong>Fixed Window</strong>: O(1), mas efeito de borda perigoso — 2× o limite em 2 segundos na borda. <strong>Sliding Window Log</strong>: preciso, sem borda, mas O(n) memória — 1000 req/min = 1000 timestamps por usuário. <strong>Sliding Window Counter</strong>: híbrido elegante. Mantém 2 contadores (janela atual + anterior). Estimativa: prev × (1 − fração_da_janela_atual) + current. Erro máximo &lt; 0.003% (Cloudflare mediu). O(1) memória, sem timestamps. Algoritmo que Cloudflare, Kong e Envoy usam em produção.',
    tip: 'A fórmula de interpolação (prev × fração_restante) é o que poucos candidatos conhecem. Demonstra estudo da implementação real.',
  },
  {
    level: 'Pleno',
    q: 'Onde no stack você aplica rate limiting e por quê em cada camada?',
    a: '<strong>Edge/CDN</strong>: DDoS volumétrico antes de atingir o app — latência zero para backend. <strong>API Gateway</strong>: por API key/rota, configurável sem deploy (Kong, Envoy, AWS API GW). <strong>App</strong>: limites de negócio que gateway não tem contexto (max 10 transferências/h). <strong>Client downstream</strong>: protege dependência interna — não DDoSar seu próprio banco ou LLM. Múltiplas camadas têm custo mínimo e somam proteção. Sênior não confia em uma camada só.',
    tip: 'Rate limit no client downstream é o diferencial sênior — a maioria só pensa em proteger a entrada, não em proteger dependências.',
  },
  {
    level: 'Pleno',
    q: 'Quais headers HTTP você inclui na resposta de 429?',
    a: 'Headers obrigatórios (RFC 6585): <strong>Retry-After</strong> — segundos até poder tentar (sem isso, cliente em loop de retry amplifica o problema). <strong>X-RateLimit-Limit</strong> — cota total. <strong>X-RateLimit-Remaining</strong> — requests restantes. <strong>X-RateLimit-Reset</strong> — epoch UTC do próximo reset. Importante: incluir Remaining e Limit em TODA resposta (não só no 429) — cliente adapta ritmo antes de ser bloqueado. Dashboard de uso amigável vs "429 surprise".',
    tip: 'Retry-After como obrigatório no 429 é o detalhe de RFC que demonstra conhecimento além do básico. Sem ele, você criou um amplificador de carga.',
  },
  {
    level: 'Senior',
    q: 'Como limitar uma API de LLM onde cada request tem custo variável?',
    a: 'Rate limit por request não escala — uma query de 10 tokens custa 100× menos que 1000 tokens. Solução: rate limit por tokens. Redis INCRBY com tokens consumidos: INCRBY rl:{userId} tokens_usados. Dois limites simultâneos: requests/min (proteção contra abuso) e tokens/dia (controle de custo). Headers: X-Tokens-Used, X-Tokens-Remaining, X-Tokens-Reset. Estimativa pré-request: se possível, verificar cota antes de enviar ao modelo. OpenAI e Anthropic usam exatamente esse modelo.',
    tip: 'Rate limit por unidade de custo (tokens, créditos, bytes) em vez de requests é o padrão emergente em APIs de IA.',
  },
  {
    level: 'Senior',
    q: 'Como rate limiting interage com HTTP/2?',
    a: 'HTTP/1.1: 1 TCP ≈ 1 request ativo. Rate limit por conexão TCP ≈ rate limit por request. HTTP/2: 1 TCP = centenas de streams simultâneos. Rate limit por conexão TCP = ilusório — client HTTP/2 faz 100 requests em 1 TCP, rate limiter conta apenas 1. Solução: rate limit em L7 (camada de aplicação), contando cada request HTTP (stream) individualmente. nginx limit_req, Envoy ratelimit service, @nestjs/throttler fazem isso. L4 load balancers não conseguem — só veem conexões TCP.',
    tip: 'L4 vs L7 para rate limit com HTTP/2 é o cross-concern que entrevistadores sênior adoram. Demonstra que você pensa em sistemas, não em componentes isolados.',
  },
  {
    level: 'Senior',
    q: 'Qual é a diferença entre rate limiting e circuit breaker?',
    a: '<strong>Rate Limiter</strong>: controla taxa de entrada no servidor. "Aceito no máximo N req/min de você." Decisão pré-determinada por política. Protege o servidor. <strong>Circuit Breaker</strong>: controla chamadas de saída do cliente para serviço externo. "Se X% das chamadas falharem, paro de chamar por Y segundos." Adaptativo, baseado na saúde do sistema. Protege o caller. No mesmo serviço: rate limit na entrada (protege o serviço), circuit breaker na saída (protege o serviço de esperar por dependência degradada).',
    tip: 'Servidor vs cliente (rate limit=protetor do servidor, circuit breaker=protetor do caller) é a estrutura mental que resolve qualquer pergunta de combinação desses padrões.',
  },
  {
    level: 'Pleno',
    q: 'Como diferenciar rate limit por IP, usuário e API key?',
    a: '<strong>IP</strong>: protege contra ataque automatizado anônimo. Falso positivo em NAT/VPN — pode bloquear centenas de usuários legítimos. <strong>Usuário autenticado</strong>: fairness por conta, requer auth. <strong>API key</strong>: monetização e tiers (free/pro/enterprise). Aplicação em camadas: endpoint de login limita por IP + username (impede credential stuffing — só IP é fácil de contornar com IP pool, só username permite enumerar). Endpoint de API limita por API key.',
    tip: 'Login: IP + username combinados é a defesa correta. Saber por que cada dimensão sozinha falha demonstra pensamento adversarial.',
  },
  {
    level: 'Senior',
    q: 'Como você garantiria resiliência quando o Redis do rate limiter fica indisponível?',
    a: 'Definir política explícita de falha antes de acontecer. <strong>Fail-Open</strong>: permite todas as requests quando Redis offline — máxima disponibilidade, sem proteção. Padrão para APIs públicas onde uptime é crítico. <strong>Fail-Closed</strong>: nega todas as requests — máxima proteção, sistema efetivamente offline. Para endpoints de segurança críticos (pagamento). <strong>Fallback local</strong>: rate limit em memória com limite mais conservador (50% do normal) quando Redis cai. Circuit breaker em torno do Redis para evitar tentativas quando sabidamente offline.',
    tip: 'Fail-Open vs Fail-Closed deve ser decisão explícita documentada — não comportamento emergente de um bug. "O que acontece quando Redis cai?" é a pergunta que avalia senioridade real.',
  },
  {
    level: 'Pleno',
    q: 'Por que o Fixed Window tem "efeito de borda" e qual o risco?',
    a: 'Fixed Window conta requests em janelas fixas que resetam no mesmo segundo (ex: cada minuto cheio). O problema: 100 requests nos últimos 2 segundos de uma janela + 100 requests nos primeiros 2 segundos da próxima = 200 requests em 4 segundos passando pelo limite de 100/min. Atacante que conhece o timing pode explorar: burst no segundo 58, espera o reset, novo burst no segundo 1 da próxima janela. O sistema vê ambos como "100 requests" mas é 200 em 4 segundos.',
    tip: 'O efeito de borda é explorado intencionalmente, não acidental. Mencionar o attack pattern demonstra pensamento adversarial.',
  },
  {
    level: 'Senior',
    q: 'Como você monitoraria rate limiting em produção para detectar problemas?',
    a: 'Três métricas críticas: <strong>Taxa de 429 por endpoint e cliente</strong> — aumento súbito indica bug em cliente, ataque ou limite muito apertado. Prometheus: http_responses_total{status="429"}. <strong>Distribuição de requests por cliente</strong> — P99 sempre no limite = limite inadequado. <strong>Top offenders</strong> — distinguir abuso de cliente com volume legítimo. Processo: monitore 2-4 semanas antes de ajustar, aumente limites gradualmente, avise clientes com 30-90 dias de antecedência antes de reduzir (breaking change para integrações).',
    tip: 'Avisar antes de reduzir limite demonstra experiência de API pública — reduzir sem aviso quebra integrações de terceiros em produção.',
  },
  {
    level: 'Pleno',
    q: 'Como implementar rate limiting em NestJS com Redis para múltiplos pods?',
    a: 'ThrottlerModule.forRootAsync com ThrottlerStorageRedisService: importa ConfigModule, useFactory recebe ConfigService e retorna {throttlers: [{ttl, limit}], storage: new ThrottlerStorageRedisService(redisUrl)}. Globalmente: {provide: APP_GUARD, useClass: ThrottlerGuard}. Por rota: @Throttle({default: {limit, ttl}}). Sem Redis storage, cada pod tem contador local — K pods × limite = limite real efetivo, proteção ilusória em auto-scaling.',
    tip: 'ThrottlerStorageRedisService é o detalhe que faz funcionar em produção. Sem ele, o throttler NestJS é inútil com múltiplos pods.',
  },
  {
    level: 'Senior',
    q: 'Quando você NÃO usaria rate limiting?',
    a: 'Três cenários onde rate limit adiciona complexidade sem ganho: <strong>Endpoint interno trusted</strong> com volume previsível entre serviços controlados — adiciona latência (Redis round-trip) e ponto de falha. <strong>Sistema com backpressure adequado</strong> — fila com consumidor controlando taxa já garante que downstream não satura. Rate limit seria redundante. <strong>MVP sem tráfego</strong> — over-engineering. Começa com WAF básico no edge, adiciona quando vê abuso real nos logs.',
    tip: '"Quando não usar" demonstra maturidade. Candidatos que defendem rate limit em todo lugar nunca operaram sistema em produção.',
  },
  {
    level: 'Senior',
    q: 'Como proteger endpoint de webhook recebido contra replay attacks?',
    a: 'Dois problemas distintos: rate limit (volume) e replay (idempotência). Para replay: verificar assinatura HMAC (Stripe usa X-Stripe-Signature). Extrair event_id único do body. Redis SETNX: "webhook:processed:{event_id}" com TTL 24h. Retorna 1 na primeira vez (processar), 0 se replay (retornar 200 sem processar — para não acionar retry do remetente). Rate limit por IP do remetente previne DoS com event_ids artificialmente novos.',
    tip: 'Retornar 200 mesmo em replay (não 409) é o detalhe operacional crucial — resposta de erro aciona retry automático do remetente e amplifica o problema.',
  },
  {
    level: 'Pleno',
    q: 'O que é load shedding e como difere de rate limiting?',
    a: '<strong>Rate Limiting</strong>: controla taxa por cliente/identidade. Baseado em política pré-definida. "Você pode fazer 100 req/min." <strong>Load Shedding</strong>: rejeita requests quando sistema está sobrecarregado. Baseado em saúde do sistema, adaptativo. "Estou com 95% de CPU — vou rejeitar requests de baixa prioridade." Load shedding monitora health (CPU, latência P99, queue size) e rejeita quando acima do threshold. 503 Service Unavailable, não 429. Complementares: rate limit protege contra clientes individuais, load shedding protege o sistema contra sobrecarga agregada.',
    tip: 'A AWS Builders Library tem artigo excelente sobre load shedding. São complementares, não alternativos — demonstra visão de sistemas distribuídos.',
  },
  {
    level: 'Senior',
    q: 'Como rate limiting funciona para GraphQL onde queries têm custo variável?',
    a: 'GraphQL: 1 request HTTP pode custar de 1 a 1000× dependendo da query. Rate limit por request HTTP é insuficiente. Soluções: <strong>Query complexity analysis</strong>: calcular custo antes de executar — custo = nós × profundidade × multiplicadores de conexão. Rejeitar se acima do threshold. <strong>Depth limit</strong>: máximo de aninhamento (ex: 10 níveis) — previne queries O(N^depth). <strong>Field-level limits</strong>: campos caros (search, aggregate) têm cota própria. <strong>Persisted queries</strong>: somente queries pré-aprovadas com custo conhecido.',
    tip: 'Query complexity analysis é o que Shopify e GitHub usam em suas APIs GraphQL. Problema específico de GraphQL que não existe em REST.',
  },
  {
    level: 'Senior',
    q: 'Como garantir que o próprio rate limiter não vire gargalo em alta escala?',
    a: 'O rate limiter adiciona 1-2ms de latência por Redis round-trip. Em 100k req/s isso importa. Soluções: <strong>Redis Cluster com sharding por user_id hash</strong> — distribui carga, evita hotspot. <strong>Cache local com sync periódico</strong> — verifica Redis a cada N requests ou a cada segundo, não por request. Perde precisão mas mantém P99 baixo. <strong>Rate limiter externo</strong> — Envoy ratelimit service, Kong, Cloudflare Workers processam antes de chegar ao app. Fail-Open quando Redis offline: não deixar o rate limiter derrubar o serviço que deveria proteger.',
    tip: 'Cache local com sync periódico (aproximado mas escalável) vs Redis central (preciso mas latência) é o trade-off fundamental de escala.',
  },
  {
    level: 'Pleno',
    q: 'Qual é o algoritmo de Token Bucket com lazy refill e por que é elegante?',
    a: 'Lazy refill calcula tokens no momento da chamada — sem timer ou setInterval. Na função consume(userId): busca bucket do Map. Calcula elapsed = (now - last_refill) / 1000. Tokens = min(CAPACITY, tokens + elapsed × RATE). Atualiza last_refill = now. Se tokens &lt; 1 retorna false. Decrementa tokens. Elegância: 2 números por chave (tokens, last_refill), sem background work, sem timer, sem leak de memória em picos, sem drift de timer. Refill é calculado on-demand com precisão matemática.',
    tip: 'Lazy refill sem timer é a implementação elegante que demonstra entendimento de como o algoritmo funciona internamente. A maioria implementa com setInterval — o lazy é mais correto.',
  },
]

// ── Dados: Quick Reference ────────────────────────────────────────────────────

const QUICK_REF_COLUMNS: QuickRefColumn[] = [
  {
    sections: [
      {
        title: 'Algoritmos Comparados',
        entries: [
          { key: 'Token Bucket',    value: 'burst ✓, O(1), APIs públicas (GitHub, Stripe)', badge: 'padrão', badgeColor: '#ef4444' },
          { key: 'Leaky Bucket',    value: 'taxa constante, sem burst, downstream frágil' },
          { key: 'Fixed Window',    value: 'O(1), efeito de borda 2× CRÍTICO', badge: 'cuidado', badgeColor: '#f59e0b' },
          { key: 'Sliding Counter', value: 'preciso O(1), erro &lt;0.003%, produção', badge: 'melhor', badgeColor: '#4ade80' },
        ],
      },
      {
        title: 'Redis — Lua Script Atômico',
        entries: [
          { key: 'INCR key',            value: 'Incrementa e retorna count' },
          { key: 'if count == 1',        value: 'Primeira request da janela' },
          { key: 'EXPIRE key windowSec', value: 'Define TTL (sem isso, memory leak)' },
          { key: 'Chave',               value: 'rl:{userId}:{endpoint}:{windowId}' },
          { key: 'windowId',            value: 'floor(epoch / windowSec)' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Headers RFC 6585 (429)',
        entries: [
          { key: 'Retry-After',          value: 'Seg até próxima tentativa (OBRIGATÓRIO)', badge: '!', badgeColor: '#ef4444' },
          { key: 'X-RateLimit-Limit',    value: 'Cota total da janela' },
          { key: 'X-RateLimit-Remaining', value: 'Requests restantes' },
          { key: 'X-RateLimit-Reset',    value: 'Epoch UTC do próximo reset' },
          { key: 'Status',               value: '429 Too Many Requests' },
        ],
      },
      {
        title: 'Antipadrões Críticos',
        entries: [
          { key: '✗ IP apenas',          value: 'NAT: 1000 usuários no mesmo IP', badge: 'ruim', badgeColor: '#ef4444' },
          { key: '✗ Contador local',     value: 'N pods × limite = limite real', badge: 'ruim', badgeColor: '#ef4444' },
          { key: '✗ Sem Retry-After',    value: 'Cliente em loop amplifica carga', badge: 'ruim', badgeColor: '#ef4444' },
          { key: '✗ Fixed Window crítico', value: 'Efeito de borda explorável', badge: 'ruim', badgeColor: '#ef4444' },
          { key: '✗ Rate limit TCP c/ H2', value: 'HTTP/2: N streams por conexão', badge: 'ruim', badgeColor: '#ef4444' },
          { key: '✓ Redis Lua + Fail-Open', value: 'Atômico + disponibilidade', badge: 'ok', badgeColor: '#4ade80' },
        ],
      },
    ],
  },
]

// ── Dados: Mnemônicos ─────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'TFSS — 4 algoritmos em ordem de complexidade',
    trick: 'Token, Fixed, Sliding (log), Sliding (counter)',
    expansion: [
      ['Token Bucket',   'Burst permitido, estado simples — APIs públicas'],
      ['Fixed Window',   'Simples, mas borda perigosa 2×'],
      ['Sliding Log',    'Preciso, caro em memória O(n)'],
      ['Sliding Counter', 'Preciso E eficiente O(1) — melhor para produção'],
    ],
    explanation: 'A ordem vai da mais permissiva para a mais refinada. Na prática: Token para APIs públicas, Sliding Counter para produção séria em escala.',
    example: 'Cloudflare usa Sliding Counter. GitHub usa Token Bucket. Fixed Window só em MVPs.',
    why: 'Saber o nome e a ordem dos 4 algoritmos é o básico esperado em qualquer entrevista de system design que envolva rate limiting.',
  },
  {
    label: '429 sem Retry-After = DDoS involuntário',
    trick: 'Sem Retry-After → cliente em loop → você criou o problema que queria evitar',
    expansion: [
      ['Com Retry-After',    'Cliente espera N segundos → 1 tentativa depois → sem sobrecarga'],
      ['Sem Retry-After',    'Cliente bem-feito faz retry imediato em loop → amplifica carga'],
      ['RFC 6585',           'Retry-After é obrigatório na resposta 429 — não opcional'],
    ],
    explanation: 'O propósito do rate limiter é reduzir carga. Sem Retry-After, você transforma clientes bem-comportados em geradores de carga.',
    example: 'SDK do Stripe e da Anthropic lê Retry-After e aguarda antes de tentar. Sem ele, SDK faz retry imediato.',
    why: 'É o bug mais silencioso de rate limiting — o sistema parece funcionar mas amplifica exatamente o problema que deveria resolver.',
  },
  {
    label: 'N pods × limite local = N × limite real',
    trick: 'Local × N = real. Só Redis centraliza.',
    expansion: [
      ['1 pod',    'Contador local correto — 100 req/min'],
      ['10 pods',  'Sem Redis: cada pod tem 100 → usuário faz 1000 req/min'],
      ['Redis Lua', 'INCR atômico compartilhado → 100 req/min real entre todos os pods'],
    ],
    explanation: 'Auto-scaling multiplica o limite local pelo número de instâncias. A proteção é ilusória. Redis resolve porque é um estado centralizado compartilhado.',
    example: '10 pods no ECS com limit_req local: usuário que distribui requests entre pods passa 1000/min sem acionar 429.',
    why: 'É o erro mais comum em sistemas com auto-scaling. Parece funcionar em dev (1 pod) mas falha completamente em produção.',
  },
  {
    label: 'Camadas: Edge → Gateway → App → Client (mais cedo = mais barato)',
    trick: 'Quanto mais cedo rejeitar, menos processamento desperdiçado',
    expansion: [
      ['Edge/CDN',   'Rejeita DDoS antes de qualquer processamento no backend'],
      ['API Gateway', 'Rejeita por key/rota antes do app logic'],
      ['App',        'Rejeita com contexto de negócio (já chegou ao processo)'],
      ['Client down', 'Evita custo na dependência (mais tardio, mais caro já aconteceu)'],
    ],
    explanation: 'Cada camada mais interna custa mais caro quando rejeita — mais processamento já foi feito. Camadas múltiplas somam proteção com custo incremental mínimo.',
    example: 'CDN rejeita 1M DDoS requests → Gateway rejeita 10k requests de API key inválida → App rejeita 100 requests acima do limite de negócio.',
    why: 'A progressão do custo de rejeição por camada é a estrutura mental para justificar múltiplas camadas de proteção.',
  },
  {
    label: 'Fail-Open = disponibilidade. Fail-Closed = segurança.',
    trick: 'Redis cai: a API deve morrer junto ou sobreviver sem proteção?',
    expansion: [
      ['Fail-Open',   'Redis offline → permite tudo → disponibilidade máxima, sem proteção'],
      ['Fail-Closed', 'Redis offline → nega tudo → segurança máxima, sistema offline'],
      ['Fallback',    'Redis offline → rate limit local com 50% do limite → meio-termo'],
    ],
    explanation: 'Não há resposta certa universal — depende do endpoint. Endpoint de leitura pública: Fail-Open. Endpoint de pagamento: Fail-Closed. API geral: fallback local.',
    example: 'Rate limiter de login: Fail-Closed (Redis offline = sem login = credential stuffing impossível). Rate limiter de search: Fail-Open (Redis offline = todos pesquisam).',
    why: 'A decisão de Fail-Open vs Fail-Closed deve ser explícita e documentada. Pergunta que aparece em revisões de incident e entrevistas de infra.',
  },
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Rate Limiting',
    stackLabel: 'Arquitetura · APIs',
  }),
  'quick-ref': () => buildQuickRefPdf({
    columns: QUICK_REF_COLUMNS,
    skillName: 'Rate Limiting',
    accentColor: C,
    stackLabel: 'Arquitetura · APIs',
    tagline: 'Algoritmos, Redis Lua, headers RFC 6585 e antipadrões',
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'Rate Limiting',
    stackLabel: 'Arquitetura · APIs',
  }),
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function RateLimitingPdfs() {
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
