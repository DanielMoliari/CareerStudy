import type { SkillContent } from '@/types'

const rateLimiting: SkillContent = {
  tagline: 'Limitar taxa de requests pra proteger sistema, fairness e custo de downstream.',
  why: 'Rate limiting cai em entrevista de API design e segurança. Senior precisa explicar algoritmos (token bucket, leaky bucket, sliding window), onde aplicar (gateway, app, DB) e o tradeoff entre precisão e simplicidade.',
  summary: 'Rate limiting controla quantas operações um cliente/usuário pode fazer numa janela. Protege contra abuso, DDoS, bug em loop, e custo descontrolado de downstream pago por chamada (LLM, SMS, geocoder). Algoritmos comuns: token bucket (permite burst), leaky bucket (taxa constante), fixed window (simples mas tem efeito de borda), sliding window (preciso, mais caro). Em sistema distribuido, contador centralizado em Redis e padrão. Resposta tipica: HTTP 429 com header Retry-After.',
  keypoints: [
    { title: 'Token Bucket', body: 'Bucket com N tokens, request consome 1, refill a taxa fixa. Permite burst até o tamanho do bucket. Algoritmo mais comum em API pública (GitHub, Stripe, AWS).' },
    { title: 'Leaky Bucket', body: 'Fila com vazao constante. Suaviza trafego. Bom pra proteger downstream que não tolera spike. Diferente do token bucket: não permite burst.' },
    { title: 'Fixed Window', body: 'Conta requests em janelas fixas (ex: 100/min, reset a cada minuto cheio). Simples, mas tem <strong>efeito de borda</strong>: 200 requests no segundo 59 + 200 no segundo 61 passa pelo limite real.' },
    { title: 'Sliding Window', body: 'Janela deslizante por timestamp. Preciso, sem efeito de borda. Custo: armazenar timestamps ou usar log + contador (sliding window log/counter). Redis com sorted set resolve.' },
    { title: 'Onde aplicar', body: 'API Gateway (CloudFront, Kong, Envoy) pega antes do app — protege todo o stack. Por usuário/IP/API key, com regras diferentes por endpoint. Também dentro do app pra limites de negocio.' },
    { title: 'Distributed limiting', body: 'Em serviço com N instâncias, contador local não funciona. Usa Redis com INCR + EXPIRE, ou Lua script atômico. Tradeoff: latência de rede + ponto de dependência.' },
    { title: 'Resposta padrão', body: 'HTTP 429 Too Many Requests com header <code>Retry-After</code> e <code>X-RateLimit-Remaining</code>. Cliente bem comportado respeita; bot ignora. Sempre logue pra detectar abuso.' },
  ],
  gotchas: [
    'Limitar só por IP — NAT corporativo manda 1000 usuários pelo mesmo IP, você bloqueia geral. Combine com user/api key.',
    'Fixed window com borda — trivial pra atacante explorar. Sliding window vale a pena em endpoint sensível.',
    'Limit muito apertado em endpoint legitimo — quebra cliente bom. Monitore taxa de 429 e ajuste.',
    'Esquecer de limitar endpoint caro (export, search full-text) — atacante derruba sistema com poucos requests.',
    'Limit em memória local com auto-scaling — capacidade real e N x limite. Use Redis pra centralizar.',
    'Não retornar Retry-After — cliente bem feito retry imediato e amplifica problema.',
  ],
  interview: [
    { q: 'Tradeoff: token bucket vs sliding window?', a: '<p><strong>Token bucket</strong>: simples, eficiente, permite burst controlado. Ótimo pra API pública onde burst pontual e ok. Estado: 2 números (tokens, last refill).</p><p><strong>Sliding window</strong>: mais preciso, sem efeito de borda, ideal pra proteção rigorosa (login attempts, payment). Custo: armazena timestamps ou usa contador composto. Mais caro em memória/CPU.</p><p>Padrão que sigo: token bucket pra API geral, sliding window pra endpoint crítico (login, write financeiro).</p>' },
    { q: 'Como você implementaria rate limit distribuido?', a: '<p>Redis com Lua script atômico. Chave por <code>user:endpoint</code>, valor com tokens + timestamp. Lua garante atomicidade do check+decrement sem race condition. TTL na chave evita memória infinita.</p><p>Pra escala alta: shard de Redis por user id, ou rate limiter dedicado (Envoy ratelimit service). Em latência ultra baixa, fallback local com sync periódico ao Redis (perde precisão mas tolera Redis fora).</p>' },
    { q: 'Onde você aplica rate limit no stack?', a: '<p>Em camadas:</p><ul><li><strong>Edge/CDN</strong>: bloqueia DDoS volumetrico antes de bater no app</li><li><strong>API Gateway</strong>: limite por API key/usuário, configurável sem deploy</li><li><strong>App</strong>: limites de negócio (ex: max 10 transferencias/h)</li><li><strong>Downstream protection</strong>: no client de serviço interno, pra não DDoSar dependência</li></ul><p>Camadas múltiplas custam pouco e somam proteção. Senior não confia em uma camada só.</p>' },
    { q: 'Quando NÃO usar rate limit?', a: '<p>Em endpoint <strong>interno trusted</strong> com volume previsivel — adiciona latência e ponto de falha sem ganho. Em fila já com backpressure (consumidor controla taxa) — fila já resolve.</p><p>Também evito em <strong>MVP</strong> sem trafego — over-engineering. Começo com WAF básico no edge e adiciono limite quando ve abuso real ou custo de downstream subindo.</p>' },
    { q: 'Como diferenciar rate limit por usuário, IP e API key?', a: '<p>Camadas com proposito diferente:</p><ul><li><strong>IP</strong>: protege contra ataque automatizado anonimo. Falso positivo em NAT/VPN.</li><li><strong>User</strong>: fairness e abuso de conta. Precisa de auth.</li><li><strong>API key</strong>: monetizacao e tier (free/pro). Limite por plano.</li></ul><p>Aplica os tres simultaneamente com limites diferentes. Endpoint de login limita por IP+username pra impedir credential stuffing. Endpoint de search limita por user.</p>' },
  ],
  resources: [
    { title: 'System Design Primer — Rate Limiter', url: 'https://github.com/donnemartin/system-design-primer#rate-limiter', kind: 'docs' },
    { title: 'Stripe — Designing rate limiters', url: 'https://stripe.com/blog/rate-limiters', kind: 'artigo' },
    { title: 'Cloudflare — How we built rate limiting', url: 'https://blog.cloudflare.com/counting-things-a-lot-of-different-things/', kind: 'artigo' },
    { title: 'AWS Builders Library — Throttling', url: 'https://aws.amazon.com/builders-library/using-load-shedding-to-avoid-overload/', kind: 'artigo' },
    { title: 'Hussein Nasser — Rate Limiting', url: 'https://www.youtube.com/watch?v=mhUQe4BKZXs', kind: 'video' },
  ],
}

export default rateLimiting
