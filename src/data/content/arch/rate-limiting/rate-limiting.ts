import type { SkillContent } from '@/types'

const rateLimiting: SkillContent = {
  tagline: 'Limitar taxa de requests para proteger sistema, garantir fairness e controlar custo de downstream.',
  why: 'Rate limiting cai em entrevista de API design e segurança. Sênior precisa explicar os algoritmos (token bucket, leaky bucket, sliding window), onde aplicar no stack (gateway, app, DB), tradeoffs de precisão vs custo e distribuição em sistemas com N instâncias.',
  summary: 'Rate limiting controla quantas operações um cliente/usuário pode fazer numa janela de tempo. Protege contra abuso, DDoS, bug em loop e custo descontrolado de downstream pago por chamada (LLM, SMS, geocoder). Algoritmos principais: token bucket (permite burst), leaky bucket (taxa constante), fixed window (simples, efeito de borda), sliding window log (preciso, mais caro), sliding window counter (híbrido eficiente). Em sistema distribuído, Redis com Lua script atômico é o padrão. Resposta HTTP padrão: 429 com Retry-After.',
  keypoints: [
    { title: 'Token Bucket', body: 'Bucket com N tokens. Cada request consome 1. Tokens reabastecidos a taxa fixa (r tokens/seg). Permite burst até capacidade do bucket. Estado: {tokens, last_refill}. Algoritmo mais usado em APIs públicas (GitHub, Stripe, AWS). Simples, eficiente e tolerante a pico legítimo.' },
    { title: 'Leaky Bucket', body: 'Fila com vazão constante de Q requests/seg. Suaviza tráfego irregulares. Bom para proteger downstream que não tolera spike (ex: banco legacy). Diferença crucial: não permite burst — taxa é absolutamente constante.' },
    { title: 'Fixed Window', body: 'Conta requests em janela fixa (ex: 100/min, reset a cada minuto cheio). Simples e eficiente — apenas um contador. Efeito de borda crítico: 100 requests no segundo 59 + 100 no segundo 61 = 200 requests em 2 segundos passando pelo limite de 100/min.' },
    { title: 'Sliding Window Log', body: 'Armazena timestamp de cada request. Janela deslizante: descarta timestamps mais antigos que a janela. Preciso, sem efeito de borda. Custo: O(requests na janela) em memória. Implementado em Redis com sorted set.' },
    { title: 'Sliding Window Counter', body: 'Híbrido eficiente: dois contadores de janela fixa (atual e anterior) + interpolação. Aproxima sliding window com custo O(1) em memória. Erro máximo é pequeno na prática. Cloudflare usa esse algoritmo em escala.' },
    { title: 'Onde aplicar', body: 'API Gateway (CloudFront, Kong, Envoy) antes do app — protege todo o stack. Por usuário/IP/API key com regras diferentes por endpoint. Dentro do app para limites de negócio (ex: 10 transferências/h). No cliente de serviço interno para não derrubar dependência downstream.' },
    { title: 'Distributed Rate Limiting', body: 'Em serviço com N instâncias, contador local × N = limite real muito maior. Solução: Redis com INCR + EXPIRE ou Lua script atômico para check+decrement sem race condition. Tradeoff: latência de rede extra (1-2ms) + ponto de dependência do Redis.' },
    { title: 'Resposta padrão', body: 'HTTP 429 Too Many Requests. Headers: Retry-After (quando pode tentar de novo), X-RateLimit-Limit (limite), X-RateLimit-Remaining (restante), X-RateLimit-Reset (epoch do reset). Cliente bem-comportado respeita; bot ignora. Sempre logue para detectar padrões.' },
  ],
  gotchas: [
    'Limitar só por IP — NAT corporativo manda 1000 usuários pelo mesmo IP; você bloqueia todos. Combine IP + user/api-key.',
    'Fixed window com efeito de borda — atacante explora timing: 100 requests no fim de uma janela + 100 no início da próxima = 200 requests em 2s.',
    'Contador local com auto-scaling — K pods × limite = limite real muito maior. Use Redis para centralizar.',
    'Limite muito apertado em endpoint legítimo — quebra cliente bom. Monitore taxa de 429 e ajuste com dados reais.',
    'Esquecer de limitar endpoint caro (export, search full-text, PDF gen) — atacante derruba com poucos requests.',
    'Não retornar Retry-After — cliente bem-feito faz retry imediato em loop e amplifica exatamente o problema que você quer evitar.',
    'Rate limit em L4 (conexão TCP) com HTTP/2 — HTTP/2 multiplexa N requests numa conexão TCP, burla rate limit por conexão.',
    '0-RTT no QUIC em endpoint com rate limit — request replayado pode consumir quota antes de ser detectado.',
  ],
  interview: [
    {
      level: 'pleno',
      q: 'Qual a diferença entre token bucket e leaky bucket?',
      a: '<p><strong>Token Bucket</strong>: bucket com capacidade N. Tokens chegam a taxa fixa r/seg. Request consome 1 token. Se bucket cheio e token não usado, tokens acumulam até N. Permite burst controlado — se o sistema ficou ocioso, acumula tokens e pode processar um pico legítimo.</p><p><strong>Leaky Bucket</strong>: fila com saída constante de Q requests/seg. Independente do ritmo de chegada, a saída é sempre uniforme. Não permite burst — taxa é absolutamente constante. Ideal para proteger downstream que não tolera variação.</p><p>Analogia: Token Bucket é conta bancária (acumula saldo, pode gastar em uma vez). Leaky Bucket é torneira (fluxo constante, não importa a pressão).</p>',
      tip: 'Token Bucket permite burst = API pública que lida com clientes legítimos que às vezes precisam de pico. Leaky Bucket = proteção de sistema frágil downstream. A escolha depende do que você está protegendo.',
    },
    {
      level: 'senior',
      q: 'Como implementar rate limiting distribuído sem race condition?',
      a: '<p>Problema: com N instâncias, cada pod tem seu contador local — limite real é N × limite configurado.</p><p><strong>Solução Redis com Lua script atômico</strong>:</p><pre>local key = KEYS[1]\nlocal limit = tonumber(ARGV[1])\nlocal window = tonumber(ARGV[2])\nlocal now = tonumber(ARGV[3])\nlocal count = redis.call("INCR", key)\nif count == 1 then\n  redis.call("EXPIRE", key, window)\nend\nreturn count</pre><p>Lua no Redis é atômico por design — INCR + EXPIRE não pode ser interrompido entre as duas operações (sem race condition). Alternativa: <code>SET NX + EXPIRE</code> com WATCH/MULTI/EXEC, mas Lua é mais limpa.</p><p>Para escala muito alta: shard Redis por hash do user_id, ou use Redis Cluster com consistent hashing. Rate limiter dedicado como Envoy ratelimit service.</p>',
      tip: 'Lua no Redis é a resposta-chave — explique que atomicidade é a propriedade necessária e que INCR sozinho sem EXPIRE cria vazamento de memória. Dois detalhes que separam quem implementou na prática.',
    },
    {
      level: 'senior',
      q: 'Explique o sliding window counter e por que é melhor que fixed window ou sliding window log.',
      a: '<p><strong>Fixed Window</strong>: simples, O(1) memória, mas efeito de borda perigoso — 2× o limite em segundos na borda da janela.</p><p><strong>Sliding Window Log</strong>: preciso, sem efeito de borda, mas O(requests) em memória — 1000 requests/min = 1000 timestamps por usuário. Não escala bem.</p><p><strong>Sliding Window Counter</strong> (híbrido):</p><ul><li>Mantém apenas 2 contadores: janela atual + janela anterior.</li><li>Estima requests na janela atual = contador_anterior × (1 - fração_da_janela_atual_passada) + contador_atual.</li><li>Erro máximo: ~0.003% na pior configuração (Cloudflare mediu isso).</li><li>Custo: O(1) memória por usuário, independente de taxa.</li></ul><p>É o algoritmo que Cloudflare, Kong e a maioria dos gateways modernos usam em produção.</p>',
      tip: 'A fórmula de interpolação (contador_anterior × fração_restante) é o que poucos candidatos conhecem. Demonstra estudo da implementação real, não só do conceito teórico.',
    },
    {
      level: 'pleno',
      q: 'Onde no stack você aplica rate limiting e por quê?',
      a: '<p>Em camadas, cada uma com propósito diferente:</p><ul><li><strong>Edge/CDN</strong>: bloqueia DDoS volumétrico antes de atingir o app. Latência zero para o backend. CloudFront, Cloudflare WAF.</li><li><strong>API Gateway</strong>: limite por API key/usuário/rota, configurável sem deploy. Kong, AWS API Gateway, Envoy.</li><li><strong>App</strong>: limites de negócio (ex: max 10 transferências/h, max 3 tentativas de login). Contexto de negócio que o gateway não tem.</li><li><strong>Client de serviço downstream</strong>: protege dependência interna — não DDoSar seu próprio banco ou serviço legado. Circuit breaker + rate limit.</li></ul><p>Camadas múltiplas têm custo mínimo e somam proteção. Sênior não confia em uma camada só — o gateway pode falhar, o CDN pode ser bypassado.</p>',
      tip: 'Mencionar rate limit no client de serviço downstream é o diferencial sênior — a maioria pensa só em proteger API pública, não em proteger dependências internas.',
    },
    {
      level: 'pleno',
      q: 'Como você diferencia rate limit por usuário, IP e API key? Quando usar cada um?',
      a: '<p>Cada dimensão tem propósito diferente:</p><ul><li><strong>IP</strong>: protege contra ataque automatizado anônimo. Falso positivo em NAT corporativo/VPN — pode bloquear centenas de usuários legítimos. Use como primeira linha, não como único mecanismo.</li><li><strong>Usuário autenticado</strong>: fairness e proteção contra abuso de conta. Requer autenticação — não funciona antes do login. Permite limites diferentes por tier (free/pro).</li><li><strong>API Key</strong>: monetização e tiers de serviço. Cada key tem sua cota. Permite limitar integração de parceiro sem afetar outros.</li></ul><p>Aplicação em camadas: endpoint de login limita por IP + username para impedir credential stuffing. Endpoint de search limita por usuário autenticado. Endpoint de API pública limita por API key.</p>',
      tip: 'Limitar login por IP + username é o detalhe de segurança que mostra experiência real — só IP é fácil de contornar com pool de IPs, só username permite enumeração.',
    },
    {
      level: 'senior',
      q: 'Quando você NÃO usaria rate limiting?',
      a: '<p>Três cenários onde rate limit adiciona complexidade sem ganho real:</p><ul><li><strong>Endpoint interno confiável</strong> com volume previsível entre serviços controlados — adiciona latência de rede (Redis round-trip) e ponto de falha.</li><li><strong>Sistema com backpressure adequado</strong> — fila com consumidor controlando taxa já garante que o downstream não vai ser sobrecarregado. Rate limit seria redundante.</li><li><strong>MVP sem tráfego real</strong> — over-engineering. Comece com WAF básico no edge, adicione rate limit quando observar abuso real nos logs.</li></ul><p>Também evito rate limit em pipelines de processamento de batch interno — a natureza do batch já é um fluxo controlado.</p>',
      tip: 'A resposta "quando não usar" demonstra maturidade. Candidatos que defendem rate limit em todo lugar mostram que nunca tiveram que operar um sistema em produção.',
    },
    {
      level: 'senior',
      q: 'Como você implementaria rate limit para uma API de LLM onde cada request tem custo variável?',
      a: '<p>Rate limit por request conta não escala — uma query simples (10 tokens) custa 100× menos que uma query complexa (1000 tokens). Soluções:</p><ul><li><strong>Rate limit por tokens</strong>: ao invés de contar requests, conta tokens consumidos. <code>INCRBY key tokens_usados</code> no Redis. Resposta inclui tokens usados e saldo restante.</li><li><strong>Rate limit em duas dimensões</strong>: requests/min (proteção) + tokens/dia (custo). Client respeita ambos.</li><li><strong>Estimativa pré-request</strong>: se der para estimar tokens antes de processar (via tamanho do prompt), verifica cota antes de enviar ao modelo.</li></ul><p>Headers de resposta: <code>X-Tokens-Used: 342</code>, <code>X-Tokens-Remaining: 9658</code>, <code>X-Tokens-Reset: 1735689600</code>. OpenAI e Anthropic usam exatamente esse modelo.</p>',
      tip: 'Rate limit por unidade de custo (tokens, créditos, bytes) em vez de por request é o padrão emergente em APIs de IA. Quem conhece demonstra experiência com APIs modernas.',
    },
    {
      level: 'pleno',
      q: 'Quais headers HTTP você inclui na resposta de rate limit e por quê?',
      a: '<p>Headers padrão (RFC 6585 + convenção de mercado):</p><ul><li><strong>X-RateLimit-Limit</strong>: cota total da janela (ex: 100).</li><li><strong>X-RateLimit-Remaining</strong>: requests restantes (ex: 47).</li><li><strong>X-RateLimit-Reset</strong>: epoch UTC do próximo reset (ex: 1735689600). Client calcula quando pode tentar.</li><li><strong>Retry-After</strong>: segundos até poder tentar (obrigatório em 429, RFC 6585). Sem isso, client bem-feito faz retry imediato e amplifica o problema.</li></ul><p>Sempre incluir Remaining e Limit em todas as respostas (não só no 429) — permite que o cliente adapte seu ritmo antes de ser bloqueado. Dashboard de uso é mais amigável que "429 surprise".</p>',
      tip: 'Retry-After como obrigatório no 429 é o detalhe de RFC que demonstra conhecimento além do básico. Mencionar que client sem Retry-After amplifica o problema conecta rate limit com circuit breaker.',
    },
    {
      level: 'senior',
      q: 'Como rate limiting interage com HTTP/2 e por que limit por conexão TCP não funciona?',
      a: '<p>HTTP/1.1: 1 conexão TCP ≈ 1 request ativo. Rate limit por conexão TCP ≈ rate limit por request.</p><p>HTTP/2: 1 conexão TCP = centenas de streams simultâneos. Um client HTTP/2 que abre uma conexão pode disparar 100 requests em paralelo na mesma TCP. Rate limit por conexão = 1 contagem para 100 requests = inútil.</p><p>Solução: rate limit deve operar em <strong>L7 (camada de aplicação)</strong>, contando cada request HTTP individualmente — não conexões TCP. nginx <code>limit_req</code> conta requests. Envoy rate limit service conta por request. L4 load balancers não conseguem fazer isso — só veem conexões TCP.</p>',
      tip: 'A distinção L4 vs L7 para rate limit com HTTP/2 é exatamente o tipo de pergunta de cross-concern que entrevistadores sênior adoram — conecta dois conceitos que parecem separados.',
    },
    {
      level: 'senior',
      q: 'Como você monitoraria e ajustaria os limites de rate limit em produção?',
      a: '<p>Três áreas de monitoramento:</p><ul><li><strong>Taxa de 429s por endpoint e por cliente</strong>: aumento súbito de 429 pode indicar bug no cliente, ataque ou limite muito apertado. Prometheus: <code>http_responses_total{status="429"}</code>.</li><li><strong>Distribuição de requests por cliente</strong>: P50/P95/P99 de requests/janela por usuário. Se P99 está sempre no limite, o limite está errado para esses clientes.</li><li><strong>Top offenders</strong>: quais usuários/IPs geram mais 429. Distinguir abuso de cliente com volume legítimo.</li></ul><p>Ajuste de limites: comece conservador, observe 2-4 semanas, aumente gradualmente. Use Feature Flags para ajustar por tier sem deploy. Avise clientes antes de reduzir limites (breaking change para integrações).</p>',
      tip: 'Alertar antes de ajustar para baixo demonstra experiência de API pública — reduzir cota sem aviso quebra integrações de terceiros que já estão em produção.',
    },
    {
      level: 'pleno',
      q: 'Como implementar rate limit em NestJS com Redis para múltiplos pods?',
      a: '<p>Use <code>@nestjs/throttler</code> com Redis storage:</p><code>ThrottlerModule.forRootAsync({<br>  imports: [ConfigModule],<br>  useFactory: (cfg: ConfigService) => ({<br>    throttlers: [{ ttl: 60000, limit: 100 }],<br>    storage: new ThrottlerStorageRedisService(cfg.get("REDIS_URL")),<br>  }),<br>  inject: [ConfigService],<br>})</code><p>Globalmente: <code>{ provide: APP_GUARD, useClass: ThrottlerGuard }</code>. Por rota: <code>@Throttle({ default: { limit: 10, ttl: 60000 } })</code>. Para endpoint de login com limite mais estrito: <code>@SkipThrottle()</code> no controller geral e <code>@Throttle</code> específico.</p><p>Sem Redis storage, cada pod tem seu próprio contador — K pods × limite = limite real efetivo, inútil para proteção real.</p>',
      tip: 'ThrottlerStorageRedisService é o detalhe que faz o throttler NestJS funcionar em produção com múltiplos pods. Sem isso, a proteção é ilusória em auto-scaling.',
    },
    {
      level: 'senior',
      q: 'Como você protegeria um endpoint de webhook recebido contra replay attacks com rate limiting?',
      a: '<p>Webhooks recebidos têm dois problemas distintos:</p><ul><li><strong>Rate limit clássico</strong>: limitar requests por IP/remetente para não saturar processamento interno.</li><li><strong>Replay attack</strong>: mesma requisição enviada múltiplas vezes (intencional ou por retry do remetente).</li></ul><p>Solução combinada:</p><ol><li>Verificar assinatura HMAC do webhook (Stripe usa <code>X-Stripe-Signature</code>).</li><li>Extrair <code>event_id</code> único do body.</li><li><code>SETNX webhook:processed:{event_id} 1 EX 86400</code> no Redis — retorna 1 se primeira vez, 0 se replay.</li><li>Se replay: retornar 200 (para não acionar retry do remetente) mas não processar.</li></ol><p>Rate limit complementar por IP do remetente previne DoS com event_ids novos gerados artificialmente.</p>',
      tip: 'SETNX como idempotência de webhook é o padrão que Stripe, GitHub e Slack recomendam. Retornar 200 mesmo em replay (para não acionar retry) é o detalhe operacional crucial.',
    },
    {
      level: 'senior',
      q: 'Qual é o algoritmo de rate limit mais eficiente para implementar em memória local (sem Redis)?',
      a: '<p>Para rate limit local (single process), sem rede:</p><p><strong>Token Bucket com lazy refill</strong>: não usa timer/setInterval. Calcula tokens na hora da request:</p><code>function consume(key: string): boolean {\n  const now = Date.now()\n  const bucket = state.get(key) ?? { tokens: CAPACITY, lastRefill: now }\n  const elapsed = (now - bucket.lastRefill) / 1000\n  bucket.tokens = Math.min(CAPACITY, bucket.tokens + elapsed * RATE)\n  bucket.lastRefill = now\n  if (bucket.tokens < 1) return false\n  bucket.tokens -= 1\n  state.set(key, bucket)\n  return true\n}</code><p>Estado: 2 números (tokens, lastRefill) por chave. Refill calculado on-demand — sem timers, sem background work. Limpeza de chaves antigas: use Map com LRU ou varredura periódica.</p>',
      tip: 'Lazy refill sem timer é a implementação elegante que demonstra entendimento de como o algoritmo funciona internamente. A maioria descreve token bucket com timer — o lazy é mais correto.',
    },
    {
      level: 'pleno',
      q: 'O que é load shedding e como difere de rate limiting?',
      a: '<p><strong>Rate Limiting</strong>: controla taxa por cliente/usuário. Baseado em identidade. "Você pode fazer 100 requests/min." Decisão pré-determinada por política.</p><p><strong>Load Shedding</strong>: rejeita requests quando o sistema está sobrecarregado. Baseado em saúde do sistema. Adaptativo. "Estou com 95% de CPU — vou rejeitar requests de baixa prioridade."</p><p>Funcionamento do load shedding:</p><ul><li>Monitor de saúde: CPU, latência P99, queue size.</li><li>Quando acima do threshold: rejeitar requests de baixa prioridade (503 Service Unavailable).</li><li>Prioridade pode ser definida por tier de usuário, tipo de endpoint ou custom header.</li></ul><p>Na prática: rate limit protege contra clientes individuais. Load shedding protege o sistema todo contra sobrecarga agregada. Ambos são complementares.</p>',
      tip: 'A AWS Builders Library tem um artigo excelente sobre load shedding. Citar que são complementares (não alternativos) demonstra visão de sistemas distribuídos.',
    },
    {
      level: 'senior',
      q: 'Como você testaria que seu rate limiter funciona corretamente em produção com múltiplas instâncias?',
      a: '<p>Testes em múltiplas camadas:</p><ul><li><strong>Unitário</strong>: mock do Redis, verificar que INCR e EXPIRE são chamados corretamente, e que 429 é retornado quando count excede o limite. Cobrir race condition com requisições paralelas em teste.</li><li><strong>Integração</strong>: Redis real (Docker ou Testcontainers), disparar N requests simultâneos e verificar que exatamente limit deles passaram e o resto recebeu 429.</li><li><strong>Chaos/carga</strong>: com K instâncias do serviço rodando, disparar M requests paralelos e verificar que a contagem total é <= limit (não K × limit).</li><li><strong>Chaos: Redis fora</strong>: se Redis cai, qual é o comportamento? Fail-open (permite tudo) ou fail-closed (nega tudo)? Definir explicitamente e testar.</li></ul><p>Ferramenta: k6 ou Gatling para carga. Redis Sentinel ou Cluster para alta disponibilidade do rate limiter.</p>',
      tip: 'O cenário de Redis fora é o que diferencia a resposta sênior — o rate limiter tem que ter política explícita de falha. Fail-open é padrão para disponibilidade, fail-closed para segurança.',
    },
    {
      level: 'senior',
      q: 'Como o Circuit Breaker se relaciona com rate limiting e quando usar cada um?',
      a: '<p>São padrões complementares com propósitos diferentes:</p><p><strong>Rate Limiter</strong>: controla taxa de entrada. Aplicado no servidor que recebe requests. "Aceito no máximo N requests/min de você." Protege o servidor.</p><p><strong>Circuit Breaker</strong>: controla chamadas de saída. Aplicado no cliente que chama serviços externos. "Se X% das chamadas falharem, paro de chamar por Y segundos." Protege o caller de esperar por um serviço degradado.</p><p>Juntos no mesmo serviço:</p><ul><li>Rate limiter na entrada: controla o que o serviço aceita.</li><li>Circuit breaker na saída: controla como o serviço chama dependências.</li></ul><p>Exemplo: serviço de pagamento limita requests de clientes (rate limit) e usa circuit breaker para chamadas ao Stripe (circuit breaker). Se Stripe está lento, o circuit breaker abre e o serviço falha rápido em vez de esperar timeout.</p>',
      tip: 'A distinção servidor vs cliente (rate limit = protetor do servidor; circuit breaker = protetor do caller) é a estrutura mental que resolve qualquer pergunta de combinação desses padrões.',
    },
    {
      level: 'pleno',
      q: 'Como comunicar limites de rate para usuários de uma API pública?',
      a: '<p>Três camadas de comunicação:</p><ul><li><strong>Documentação</strong>: limits por endpoint na docs da API. Tabela com tier (free/pro/enterprise), limits, janela e como calcular o reset. Stripe e GitHub fazem isso exemplarmente.</li><li><strong>Headers em toda resposta</strong> (não só no 429): X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset. Permite que SDKs implementem backoff automático antes de ser bloqueado.</li><li><strong>SDK com retry automático</strong>: SDKs oficiais devem implementar exponential backoff ao receber 429, usando Retry-After. Usuário nunca precisa implementar isso manualmente.</li></ul><p>Comunicação de mudanças: aviso com 30-90 dias de antecedência antes de reduzir limites. Versioning de limites similar a versioning de API — mudança breaking para integrações em produção.</p>',
      tip: 'SDKs com retry automático baseado em Retry-After é o padrão que as melhores APIs (Stripe, Twilio) adotam. Demonstra visão de DX (Developer Experience) além da implementação técnica.',
    },
    {
      level: 'senior',
      q: 'Qual é o impacto de rate limiting em APIs GraphQL onde uma query pode ter custo muito variável?',
      a: '<p>GraphQL tem o problema inverso de REST: uma única query HTTP pode buscar dados de 20 tabelas ou de 1 — ambos chegam como 1 request no rate limiter clássico.</p><p>Soluções específicas para GraphQL:</p><ul><li><strong>Query complexity analysis</strong>: antes de executar, calcular custo estimado da query. Rejeitar se acima de threshold. GraphQL-cost-analysis faz isso estaticamente. Custo = nós × profundidade × multiplicadores de conexão.</li><li><strong>Query depth limit</strong>: limitar profundidade máxima de aninhamento (ex: 10 níveis). Previne queries que explodem O(N^depth).</li><li><strong>Field-level rate limiting</strong>: campos caros (ex: search, aggregate) têm sua própria cota. Usar directives customizados.</li><li><strong>Persisted queries</strong>: somente queries pré-aprovadas são executadas. Rate limit por query ID, que tem custo conhecido.</li></ul>',
      tip: 'Query complexity analysis com custo estimado é o que Shopify e GitHub usam em suas APIs GraphQL. É um problema específico de GraphQL que não existe em REST.',
    },
    {
      level: 'pleno',
      q: 'Como você faria rate limiting para um endpoint de streaming de dados (Server-Sent Events ou WebSocket)?',
      a: '<p>Streaming tem características diferentes de request/response:</p><ul><li>Uma conexão pode durar horas — não faz sentido limitar conexões da mesma forma que requests.</li><li>O volume pode ser medido em mensagens enviadas ou bytes transferidos, não em requests.</li></ul><p>Abordagens:</p><ul><li><strong>Rate limit na conexão</strong>: limite de conexões simultâneas por usuário (ex: 5 streams abertos por user). Simples e eficaz para uso anormal.</li><li><strong>Rate limit em mensagens enviadas</strong>: para SSE/WS onde o client faz perguntas, limitar mensagens por janela.</li><li><strong>Bandwidth throttling</strong>: para streaming de mídia, limitar bytes/seg enviados — nginx <code>limit_rate</code> para download, trickle para upload.</li><li><strong>Heartbeat + token</strong>: server envia token renovado periodicamente via stream; client inclui token nas mensagens. Permite revogar acesso sem fechar conexão.</li></ul>',
      tip: 'Conexões simultâneas em vez de requests por janela é a mudança conceitual chave para streaming. A maioria dos candidatos tenta aplicar rate limit de REST em WebSocket diretamente.',
    },
    {
      level: 'senior',
      q: 'Como você garantiria que o rate limiter em si não se torne um gargalo em alta escala?',
      a: '<p>O rate limiter pode se tornar o bottleneck se não for projetado para escala:</p><ul><li><strong>Redis como ponto único</strong>: use Redis Sentinel (HA) ou Redis Cluster (escala horizontal). Shard por hash do user_id para distribuir carga.</li><li><strong>Latência do Redis round-trip</strong>: rate limiter adiciona 1-2ms por request. Em volume muito alto (100k req/s), isso importa. Solução: cache local com sync periódico ao Redis — perde precisão exata mas mantém P99 baixo.</li><li><strong>Fallback quando Redis está indisponível</strong>: definir política explícita. Fail-open (permite tudo) é padrão para disponibilidade. Fail-closed para endpoints críticos de segurança.</li><li><strong>Rate limiter externo</strong>: Envoy ratelimit service, Kong, CloudFlare Workers — processa rate limit antes de chegar ao app. O app nunca vê a carga de requests rejeitados.</li></ul>',
      tip: 'Cache local com sync periódico (aproximado mas escalável) vs Redis central (preciso mas latência) é o trade-off fundamental. Cloudflare publica como resolveram isso com sliding window counter.',
    },
  ],
  diagrams: [
    {
      title: "Algoritmos de Rate Limiting — Comparação Visual",
      html: `<style>
.rl-alg { font-family: 'Space Grotesk', sans-serif; background: #0f172a; color: #e2e8f0; padding: 24px; border-radius: 12px; }
.rl-alg-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
.rl-alg-card { background: #1e293b; border-radius: 10px; padding: 16px; border-top: 3px solid var(--c); }
.rl-alg-card h3 { font-size: 13px; color: var(--c); margin: 0 0 10px; }
.rl-timeline { display: flex; gap: 4px; margin-bottom: 12px; align-items: flex-end; height: 60px; }
.rl-bar { border-radius: 3px 3px 0 0; background: var(--c); min-width: 16px; opacity: 0.85; transition: all 0.2s; position: relative; }
.rl-bar-denied { background: #ef4444 !important; opacity: 0.6; }
.rl-bar-burst { opacity: 1; }
.rl-meta { font-size: 10px; }
.rl-meta-row { display: flex; justify-content: space-between; gap: 8px; margin-bottom: 4px; }
.rl-key { color: #94a3b8; }
.rl-val { }
.rl-tag { display: inline-block; padding: 1px 5px; border-radius: 3px; font-size: 9px; }
.rl-ok { background: #14532d; color: #4ade80; }
.rl-bad { background: #450a0a; color: #f87171; }
.rl-warn { background: #451a03; color: #fb923c; }
</style>
<div class="rl-alg">
  <div class="rl-alg-grid">
    <div class="rl-alg-card" style="--c:#ef4444">
      <h3>Token Bucket</h3>
      <div class="rl-timeline">
        <div class="rl-bar rl-bar-burst" style="height:55px;--c:#ef4444" title="burst: 5 requests"></div>
        <div class="rl-bar rl-bar-burst" style="height:55px;--c:#ef4444"></div>
        <div class="rl-bar rl-bar-burst" style="height:55px;--c:#ef4444"></div>
        <div class="rl-bar rl-bar-burst" style="height:40px;--c:#ef4444"></div>
        <div class="rl-bar" style="height:15px;--c:#ef4444"></div>
        <div class="rl-bar" style="height:15px;--c:#ef4444"></div>
        <div class="rl-bar rl-bar-denied" style="height:8px" title="negado"></div>
        <div class="rl-bar" style="height:20px;--c:#ef4444" title="tokens reabastecidos"></div>
        <div class="rl-bar" style="height:20px;--c:#ef4444"></div>
      </div>
      <div class="rl-meta">
        <div class="rl-meta-row"><span class="rl-key">Estado</span><span>{tokens, last_refill}</span></div>
        <div class="rl-meta-row"><span class="rl-key">Burst</span><span><span class="rl-ok">permite</span> até capacidade</span></div>
        <div class="rl-meta-row"><span class="rl-key">Uso</span><span>APIs públicas (GitHub, Stripe)</span></div>
        <div class="rl-meta-row"><span class="rl-key">Memória</span><span>O(1) por usuário</span></div>
      </div>
    </div>
    <div class="rl-alg-card" style="--c:#f59e0b">
      <h3>Leaky Bucket</h3>
      <div class="rl-timeline">
        <div class="rl-bar" style="height:20px;--c:#f59e0b"></div>
        <div class="rl-bar" style="height:20px;--c:#f59e0b"></div>
        <div class="rl-bar" style="height:20px;--c:#f59e0b"></div>
        <div class="rl-bar" style="height:20px;--c:#f59e0b"></div>
        <div class="rl-bar" style="height:20px;--c:#f59e0b"></div>
        <div class="rl-bar" style="height:20px;--c:#f59e0b"></div>
        <div class="rl-bar" style="height:20px;--c:#f59e0b"></div>
        <div class="rl-bar" style="height:20px;--c:#f59e0b"></div>
        <div class="rl-bar" style="height:20px;--c:#f59e0b"></div>
      </div>
      <div class="rl-meta">
        <div class="rl-meta-row"><span class="rl-key">Estado</span><span>fila + tamanho</span></div>
        <div class="rl-meta-row"><span class="rl-key">Burst</span><span><span class="rl-bad">não permite</span> — taxa constante</span></div>
        <div class="rl-meta-row"><span class="rl-key">Uso</span><span>Proteger downstream frágil</span></div>
        <div class="rl-meta-row"><span class="rl-key">Memória</span><span>O(queue) por usuário</span></div>
      </div>
    </div>
    <div class="rl-alg-card" style="--c:#94a3b8">
      <h3>Fixed Window</h3>
      <div class="rl-timeline">
        <div class="rl-bar" style="height:30px;--c:#94a3b8"></div>
        <div class="rl-bar" style="height:30px;--c:#94a3b8"></div>
        <div class="rl-bar" style="height:30px;--c:#94a3b8"></div>
        <div style="width:2px;background:#334155;height:60px;flex-shrink:0" title="reset de janela"></div>
        <div class="rl-bar" style="height:50px;--c:#ef4444;opacity:0.5" title="borda: muitas requests antes do reset"></div>
        <div class="rl-bar" style="height:50px;--c:#ef4444;opacity:0.5" title="borda: muitas requests logo após o reset"></div>
        <div style="width:2px;background:#334155;height:60px;flex-shrink:0"></div>
        <div class="rl-bar" style="height:20px;--c:#94a3b8"></div>
        <div class="rl-bar" style="height:20px;--c:#94a3b8"></div>
      </div>
      <div class="rl-meta">
        <div class="rl-meta-row"><span class="rl-key">Estado</span><span>1 contador por janela</span></div>
        <div class="rl-meta-row"><span class="rl-key">Efeito de borda</span><span><span class="rl-bad">2× limite na borda</span></span></div>
        <div class="rl-meta-row"><span class="rl-key">Memória</span><span>O(1) — o mais simples</span></div>
        <div class="rl-meta-row"><span class="rl-key">Uso</span><span>Endpoints não-críticos</span></div>
      </div>
    </div>
    <div class="rl-alg-card" style="--c:#4ade80">
      <h3>Sliding Window Counter</h3>
      <div class="rl-timeline">
        <div class="rl-bar" style="height:25px;--c:#4ade80;opacity:0.5" title="janela anterior (peso decrescente)"></div>
        <div class="rl-bar" style="height:30px;--c:#4ade80;opacity:0.6"></div>
        <div class="rl-bar" style="height:32px;--c:#4ade80;opacity:0.7"></div>
        <div class="rl-bar" style="height:35px;--c:#4ade80;opacity:0.8"></div>
        <div class="rl-bar" style="height:38px;--c:#4ade80;opacity:0.9"></div>
        <div class="rl-bar" style="height:40px;--c:#4ade80"></div>
        <div class="rl-bar" style="height:40px;--c:#4ade80"></div>
        <div class="rl-bar rl-bar-denied" style="height:40px"></div>
        <div class="rl-bar rl-bar-denied" style="height:40px"></div>
      </div>
      <div class="rl-meta">
        <div class="rl-meta-row"><span class="rl-key">Estado</span><span>2 contadores + fração</span></div>
        <div class="rl-meta-row"><span class="rl-key">Precisão</span><span><span class="rl-ok">alta</span> (erro &lt; 0.003%)</span></div>
        <div class="rl-meta-row"><span class="rl-key">Memória</span><span>O(1) — escalável</span></div>
        <div class="rl-meta-row"><span class="rl-key">Uso</span><span>Cloudflare, Kong em produção</span></div>
      </div>
    </div>
  </div>
</div>`,
      caption: "Token Bucket permite burst. Leaky Bucket garante taxa constante. Fixed Window tem efeito de borda. Sliding Window Counter combina precisão com eficiência O(1).",
    },
    {
      title: "Distributed Rate Limiting com Redis — Fluxo e Race Condition",
      html: `<style>
.rl-redis { font-family: 'JetBrains Mono', monospace; background: #0f172a; color: #e2e8f0; padding: 24px; border-radius: 12px; }
.rl-redis h3 { font-size: 13px; color: #ef4444; margin: 0 0 16px; }
.rl-redis-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.rl-pod { background: #1e293b; border-radius: 8px; padding: 14px; }
.rl-pod h4 { font-size: 11px; color: #94a3b8; margin: 0 0 10px; }
.rl-step { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 11px; }
.rl-step-num { background: #ef4444; color: #fff; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 9px; flex-shrink: 0; }
.rl-step-num.ok { background: #4ade80; color: #000; }
.rl-step-num.warn { background: #f59e0b; color: #000; }
.rl-code { background: #0f172a; border-radius: 4px; padding: 3px 6px; color: #06b6d4; font-size: 10px; }
.rl-arrow { color: #ef4444; font-size: 18px; text-align: center; margin: 8px 0; }
.rl-result-bad { background: #450a0a; border: 1px solid #ef4444; border-radius: 6px; padding: 8px 12px; font-size: 11px; color: #f87171; margin-top: 10px; }
.rl-result-ok { background: #14532d; border: 1px solid #4ade80; border-radius: 6px; padding: 8px 12px; font-size: 11px; color: #4ade80; margin-top: 10px; }
</style>
<div class="rl-redis">
  <div class="rl-redis-row">
    <div class="rl-pod">
      <h4>Problema: GET + SET sem atomicidade</h4>
      <div class="rl-step">
        <div class="rl-step-num">1</div>
        <span>Pod A: <span class="rl-code">GET rl:user:123</span> → 99</span>
      </div>
      <div class="rl-step">
        <div class="rl-step-num">2</div>
        <span>Pod B: <span class="rl-code">GET rl:user:123</span> → 99</span>
      </div>
      <div class="rl-step">
        <div class="rl-step-num">3</div>
        <span>Pod A: 99 &lt; 100, permite → <span class="rl-code">SET 100</span></span>
      </div>
      <div class="rl-step">
        <div class="rl-step-num">4</div>
        <span>Pod B: 99 &lt; 100, permite → <span class="rl-code">SET 100</span></span>
      </div>
      <div class="rl-result-bad">Race condition: request 101 passou! GET+SET não é atômico. Dois pods veem o mesmo valor e ambos permitem.</div>
    </div>
    <div class="rl-pod">
      <h4>Solução: Lua script atômico no Redis</h4>
      <div class="rl-step">
        <div class="rl-step-num ok">1</div>
        <span>Pod A envia Lua script para Redis</span>
      </div>
      <div class="rl-step">
        <div class="rl-step-num ok">2</div>
        <span>Redis executa atomicamente: <span class="rl-code">INCR key</span></span>
      </div>
      <div class="rl-step">
        <div class="rl-step-num ok">3</div>
        <span>Se count == 1: <span class="rl-code">EXPIRE key 60</span></span>
      </div>
      <div class="rl-step">
        <div class="rl-step-num ok">4</div>
        <span>Retorna count → app decide allow/deny</span>
      </div>
      <div class="rl-step">
        <div class="rl-step-num warn">5</div>
        <span>Pod B envia script — Redis processa depois. Sem interleaving.</span>
      </div>
      <div class="rl-result-ok">Lua em Redis é single-threaded e atômico. Nenhum outro comando é executado entre INCR e EXPIRE. Race condition impossível.</div>
    </div>
  </div>
</div>`,
      caption: "GET+SET sem atomicidade permite race condition. Lua script no Redis garante atomicidade de INCR+EXPIRE — padrão para rate limiting distribuído.",
    },
    {
      title: "Rate Limiting em Camadas do Stack",
      html: `<style>
.rl-stack { font-family: 'Space Grotesk', sans-serif; background: #0f172a; color: #e2e8f0; padding: 24px; border-radius: 12px; }
.rl-stack h3 { font-size: 13px; color: #ef4444; margin: 0 0 16px; }
.rl-layer { display: flex; align-items: stretch; gap: 12px; margin-bottom: 10px; }
.rl-layer-box { flex: 1; background: #1e293b; border-radius: 8px; padding: 12px; border-left: 4px solid var(--c); }
.rl-layer-box h4 { font-size: 11px; color: var(--c); margin: 0 0 6px; }
.rl-layer-box p { font-size: 10px; color: #94a3b8; margin: 0 0 4px; }
.rl-layer-meta { font-size: 9px; display: flex; gap: 6px; flex-wrap: wrap; margin-top: 6px; }
.rl-badge { padding: 1px 6px; border-radius: 4px; }
.rl-arrow-layer { display: flex; align-items: center; justify-content: center; font-size: 20px; color: #334155; flex-shrink: 0; width: 20px; }
.rl-flow { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; font-size: 10px; }
</style>
<div class="rl-stack">
  <div class="rl-layer">
    <div class="rl-layer-box" style="--c:#f59e0b">
      <h4>Edge / CDN</h4>
      <p>Cloudflare, AWS CloudFront, Fastly</p>
      <div class="rl-flow">→ Bloqueia DDoS volumétrico antes de chegar ao app</div>
      <div class="rl-flow">→ Rate limit por IP, ASN, país, device fingerprint</div>
      <div class="rl-layer-meta">
        <span class="rl-badge" style="background:#451a03;color:#fb923c">Latência: 0ms para app</span>
        <span class="rl-badge" style="background:#1e3a5f;color:#38bdf8">Resposta: 403/429 no edge</span>
      </div>
    </div>
  </div>
  <div class="rl-layer">
    <div class="rl-layer-box" style="--c:#ef4444">
      <h4>API Gateway</h4>
      <p>Kong, AWS API Gateway, Envoy, nginx</p>
      <div class="rl-flow">→ Rate limit por API key, tenant, rota</div>
      <div class="rl-flow">→ Configurável sem deploy — dashboard ou IaC</div>
      <div class="rl-layer-meta">
        <span class="rl-badge" style="background:#1c1c1c;color:#94a3b8">Limites por plano: free/pro/enterprise</span>
        <span class="rl-badge" style="background:#14532d;color:#4ade80">Sliding window nativo</span>
      </div>
    </div>
  </div>
  <div class="rl-layer">
    <div class="rl-layer-box" style="--c:#a78bfa">
      <h4>App (middleware)</h4>
      <p>@nestjs/throttler, express-rate-limit + Redis</p>
      <div class="rl-flow">→ Limites de negócio: max 10 transferências/h</div>
      <div class="rl-flow">→ Contexto de usuário autenticado disponível aqui</div>
      <div class="rl-layer-meta">
        <span class="rl-badge" style="background:#2d1b69;color:#a78bfa">Redis para estado compartilhado</span>
        <span class="rl-badge" style="background:#451a03;color:#fb923c">Lua script = sem race condition</span>
      </div>
    </div>
  </div>
  <div class="rl-layer">
    <div class="rl-layer-box" style="--c:#4ade80">
      <h4>Client de serviço downstream</h4>
      <p>SDK interno, circuit breaker, retry</p>
      <div class="rl-flow">→ Protege dependência interna (DB, LLM, SMS, geocoder)</div>
      <div class="rl-flow">→ Exponential backoff + jitter em retry</div>
      <div class="rl-layer-meta">
        <span class="rl-badge" style="background:#14532d;color:#4ade80">Evita DDoS no próprio sistema</span>
        <span class="rl-badge" style="background:#1e3a5f;color:#38bdf8">Combina com circuit breaker</span>
      </div>
    </div>
  </div>
</div>`,
      caption: "Rate limiting em camadas: CDN bloqueia volumétrico, Gateway controla por API key, App aplica regras de negócio, Client protege dependências downstream.",
    },
  ],
  mnemonics: [
    {
      label: "TFSS — os 4 algoritmos em ordem de complexidade",
      trick: "Token, Fixed, Sliding (log), Sliding (counter)",
      explanation: "Token Bucket: burst permitido, estado simples. Fixed Window: simples mas borda perigosa. Sliding Window Log: preciso, caro em memória O(n). Sliding Window Counter: preciso E eficiente O(1). A ordem é da mais permissiva para a mais refinada. Na prática: Token para APIs; Sliding Counter para produção séria.",
    },
    {
      label: "429 precisa de Retry-After SEMPRE",
      trick: "429 sem Retry-After = DDoS involuntário",
      explanation: "Cliente bem-feito que recebe 429 sem Retry-After vai fazer retry imediato em loop — exatamente o oposto do que você quer. Com Retry-After: cliente espera N segundos e tenta de novo uma vez. Sem: cliente dispara centenas de retries por segundo, amplificando o problema que o rate limit deveria resolver.",
    },
    {
      label: "Local × Distribuído: INCR atomicamente",
      trick: "N pods × limite local = N × limite real",
      explanation: "Com 10 pods e limite local de 100/min: qualquer client pode fazer 1000 requests/min — 1 por pod. A solução é sempre Redis com INCR atômico. Lua script garante que check e increment são inseparáveis. EXPIRE no primeiro INCR evita vazamento de memória.",
    },
    {
      label: "Edge, Gateway, App, Client — camadas do menor ao maior custo de reject",
      trick: "Quanto mais cedo rejeitar, mais barato é",
      explanation: "Edge/CDN: reject antes de gerar qualquer custo no backend — processamento zero. Gateway: reject antes do app logic. App: reject com contexto de usuário, mas o request chegou ao processo. Client downstream: previne custo na dependência mas o seu serviço já processou. Cada camada mais interna que rejeita custou mais caro.",
    },
    {
      label: "Fail-Open vs Fail-Closed para rate limiter offline",
      trick: "Segurança → Fail-Closed. Disponibilidade → Fail-Open.",
      explanation: "Se o Redis do rate limiter cair: Fail-Open = permite todas as requests (máxima disponibilidade, zero proteção). Fail-Closed = nega todas as requests (máxima proteção, sistema offline). Para APIs públicas: Fail-Open com alerta. Para endpoint de pagamento: Fail-Closed ou failover para rate limit local conservador.",
    },
  ],
  cheatsheet: {
    title: "Rate Limiting — Cheatsheet",
    html: `<style>
.rl-cs { font-family: 'JetBrains Mono', monospace; background: #0f172a; color: #e2e8f0; padding: 20px; border-radius: 10px; font-size: 11px; }
.rl-cs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.rl-cs-section { background: #1e293b; border-radius: 8px; padding: 12px; }
.rl-cs-section h3 { font-size: 11px; color: #ef4444; margin: 0 0 10px; border-bottom: 1px solid #334155; padding-bottom: 6px; }
.rl-cs-row { display: flex; gap: 8px; margin-bottom: 5px; }
.rl-cs-key { color: #94a3b8; min-width: 120px; flex-shrink: 0; }
.rl-cs-val { color: #e2e8f0; }
.rl-tag { display: inline-block; padding: 1px 5px; border-radius: 3px; font-size: 9px; }
.rl-ok { background: #14532d; color: #4ade80; }
.rl-bad { background: #450a0a; color: #f87171; }
.rl-warn { background: #451a03; color: #fb923c; }
pre { background: #0f172a; border-radius: 4px; padding: 8px; font-size: 9px; color: #06b6d4; margin: 6px 0 0; overflow-x: auto; }
</style>
<div class="rl-cs">
  <div class="rl-cs-grid">
    <div class="rl-cs-section">
      <h3>Algoritmos — Comparação</h3>
      <div class="rl-cs-row"><span class="rl-cs-key">Token Bucket</span><span class="rl-cs-val">burst ✓, O(1), APIs públicas</span></div>
      <div class="rl-cs-row"><span class="rl-cs-key">Leaky Bucket</span><span class="rl-cs-val">taxa constante, sem burst</span></div>
      <div class="rl-cs-row"><span class="rl-cs-key">Fixed Window</span><span class="rl-cs-val">O(1), efeito de borda 2×</span></div>
      <div class="rl-cs-row"><span class="rl-cs-key">Sliding Log</span><span class="rl-cs-val">preciso, O(n) memória</span></div>
      <div class="rl-cs-row"><span class="rl-cs-key">Sliding Counter</span><span class="rl-cs-val">preciso, O(1), produção ✓</span></div>
    </div>
    <div class="rl-cs-section">
      <h3>Headers Padrão (RFC 6585)</h3>
      <div class="rl-cs-row"><span class="rl-cs-key">X-RateLimit-Limit</span><span class="rl-cs-val">cota total da janela</span></div>
      <div class="rl-cs-row"><span class="rl-cs-key">X-RateLimit-Remaining</span><span class="rl-cs-val">requests restantes</span></div>
      <div class="rl-cs-row"><span class="rl-cs-key">X-RateLimit-Reset</span><span class="rl-cs-val">epoch do próximo reset</span></div>
      <div class="rl-cs-row"><span class="rl-cs-key">Retry-After</span><span class="rl-cs-val">seg até poder tentar (429)</span></div>
      <div class="rl-cs-row"><span class="rl-cs-key">Status</span><span class="rl-cs-val">429 Too Many Requests</span></div>
    </div>
    <div class="rl-cs-section">
      <h3>Redis — Lua Atômico</h3>
      <pre>local count = redis.call("INCR", KEYS[1])
if count == 1 then
  redis.call("EXPIRE", KEYS[1], ARGV[1])
end
return count
-- Key: "rl:userId:windowId"
-- ARGV[1]: TTL em segundos</pre>
    </div>
    <div class="rl-cs-section">
      <h3>Antipadrões</h3>
      <div style="margin-bottom:4px"><span class="rl-tag rl-bad">ruim</span> Rate limit por IP apenas (NAT)</div>
      <div style="margin-bottom:4px"><span class="rl-tag rl-bad">ruim</span> Contador local com N pods</div>
      <div style="margin-bottom:4px"><span class="rl-tag rl-bad">ruim</span> 429 sem Retry-After (amplifica)</div>
      <div style="margin-bottom:4px"><span class="rl-tag rl-bad">ruim</span> Fixed Window em endpoint crítico</div>
      <div style="margin-bottom:4px"><span class="rl-tag rl-bad">ruim</span> Rate limit TCP com HTTP/2</div>
      <div style="margin-bottom:4px"><span class="rl-tag rl-ok">ok</span> Redis Lua + Fail-Open policy</div>
      <div style="margin-bottom:4px"><span class="rl-tag rl-ok">ok</span> Sliding Counter para produção</div>
    </div>
  </div>
</div>`,
  },
  mindmap: {
    title: "Rate Limiting — Mapa Mental",
    html: `<style>
.rl-mm { font-family: 'Space Grotesk', sans-serif; background: #0f172a; color: #e2e8f0; padding: 24px; border-radius: 12px; }
.rl-mm-center { text-align: center; font-size: 16px; font-weight: bold; color: #ef4444; margin-bottom: 24px; padding: 12px; background: #450a0a; border-radius: 8px; }
.rl-mm-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.rl-mm-card { background: #1e293b; border-radius: 8px; padding: 12px; border-left: 3px solid var(--c); }
.rl-mm-card h4 { font-size: 11px; color: var(--c); margin: 0 0 8px; }
.rl-mm-item { font-size: 10px; color: #e2e8f0; margin-bottom: 4px; padding-left: 10px; position: relative; }
.rl-mm-item::before { content: '→'; position: absolute; left: 0; color: var(--c); }
.rl-mm-item.key { font-weight: bold; }
</style>
<div class="rl-mm">
  <div class="rl-mm-center">Rate Limiting — Proteção, Fairness e Custo</div>
  <div class="rl-mm-grid">
    <div class="rl-mm-card" style="--c:#ef4444">
      <h4>Algoritmos</h4>
      <div class="rl-mm-item key">Token Bucket — burst, O(1)</div>
      <div class="rl-mm-item">Leaky Bucket — taxa constante</div>
      <div class="rl-mm-item">Fixed Window — simples, borda perigosa</div>
      <div class="rl-mm-item key">Sliding Counter — preciso, O(1), produção</div>
      <div class="rl-mm-item">Sliding Log — preciso, O(n) memória</div>
    </div>
    <div class="rl-mm-card" style="--c:#f59e0b">
      <h4>Onde Aplicar</h4>
      <div class="rl-mm-item">CDN/Edge — DDoS volumétrico</div>
      <div class="rl-mm-item key">API Gateway — por key/rota/tenant</div>
      <div class="rl-mm-item">App — regras de negócio</div>
      <div class="rl-mm-item">Client downstream — protege dependência</div>
      <div class="rl-mm-item">Login — por IP + username</div>
    </div>
    <div class="rl-mm-card" style="--c:#4ade80">
      <h4>Distribuído</h4>
      <div class="rl-mm-item key">Redis + Lua script atômico</div>
      <div class="rl-mm-item">INCR + EXPIRE (se count == 1)</div>
      <div class="rl-mm-item">Key: "rl:userId:windowId"</div>
      <div class="rl-mm-item">Fail-Open (disponib.) vs Fail-Closed (seg.)</div>
      <div class="rl-mm-item">Redis Cluster para alta escala</div>
    </div>
    <div class="rl-mm-card" style="--c:#a78bfa">
      <h4>Dimensões de Limite</h4>
      <div class="rl-mm-item">Por IP — contra anônimos</div>
      <div class="rl-mm-item">Por usuário — fairness</div>
      <div class="rl-mm-item">Por API key — monetização</div>
      <div class="rl-mm-item">Por tokens (LLM) — custo variável</div>
      <div class="rl-mm-item">Por endpoint — proteger o caro</div>
    </div>
    <div class="rl-mm-card" style="--c:#38bdf8">
      <h4>Resposta HTTP</h4>
      <div class="rl-mm-item key">429 Too Many Requests</div>
      <div class="rl-mm-item key">Retry-After (obrigatório)</div>
      <div class="rl-mm-item">X-RateLimit-Limit</div>
      <div class="rl-mm-item">X-RateLimit-Remaining</div>
      <div class="rl-mm-item">X-RateLimit-Reset (epoch)</div>
    </div>
    <div class="rl-mm-card" style="--c:#f87171">
      <h4>Armadilhas</h4>
      <div class="rl-mm-item key">IP apenas → NAT bloqueia geral</div>
      <div class="rl-mm-item key">Local c/ N pods → N × limite real</div>
      <div class="rl-mm-item">Sem Retry-After → cliente em loop</div>
      <div class="rl-mm-item">Fixed Window em endpoint crítico</div>
      <div class="rl-mm-item">Rate limit TCP c/ HTTP/2</div>
    </div>
  </div>
</div>`,
  },
  exercises: [
    {
      level: "iniciante",
      title: "Implementar Token Bucket em memória (single process)",
      description: "Implemente um rate limiter com algoritmo de token bucket em TypeScript/Node.js usando apenas um Map em memória. A função consume(userId: string): boolean deve retornar true se permitido ou false se bloqueado. Use lazy refill (calcula tokens no momento da chamada, sem setInterval). Escreva testes que provam: burst de N requests passa, burst de N+1 falha, após 1 segundo de espera novos tokens estão disponíveis.",
      concepts: ["token-bucket", "lazy-refill", "rate-limiting-algoritmo", "typescript"],
    },
    {
      level: "intermediario",
      title: "Rate limiter distribuído com Redis e Lua script",
      description: "Implemente um middleware Express que usa Redis com Lua script para rate limiting distribuído. A chave deve ser user:endpoint:window_id. Teste que o limite funciona corretamente mesmo com chamadas paralelas (use Promise.all com 200 requests simultâneos e verifique que exatamente 100 passaram). Implemente todos os headers RFC 6585 (Retry-After, X-RateLimit-*). Use ioredis para a conexão Redis.",
      concepts: ["redis", "lua-script", "atomicidade", "distributed-rate-limit", "rfc-6585"],
    },
    {
      level: "intermediario",
      title: "Sliding Window Counter com dois buckets",
      description: "Implemente o algoritmo Sliding Window Counter: mantenha dois contadores (janela atual e anterior) no Redis. A fórmula: requests_estimados = contador_anterior × (1 - fração_da_janela_atual_passada) + contador_atual. Compare a precisão com Fixed Window injetando requests no timing exato da borda da janela e meça a diferença de requests permitidos.",
      concepts: ["sliding-window-counter", "fixed-window", "redis", "algoritmo-rate-limit"],
    },
    {
      level: "senior",
      title: "Rate limiter por custo de tokens para API de LLM",
      description: "Construa um rate limiter que conta tokens consumidos (não requests) para uma API que integra com OpenAI. Use INCRBY no Redis com o número de tokens da response. Implemente dois limites simultâneos: requests/min (proteção) e tokens/dia (custo). O header X-Tokens-Used deve aparecer em todas as respostas. Se tokens/dia exceder, retornar 429 com mensagem diferente de requests/min. Escreva testes que cobrem os dois cenários de bloqueio.",
      concepts: ["token-cost-rate-limit", "redis", "incrby", "llm-api", "multi-dimension-limits"],
    },
    {
      level: "senior",
      title: "Rate limiter resiliente com fallback local",
      description: "Implemente um rate limiter que usa Redis como primary e cai para rate limit local (em memória, com limite mais conservador) quando o Redis está indisponível. Simule a queda do Redis com um mock que lança erros aleatórios. O sistema deve: (1) logar quando muda para fallback, (2) usar limite local mais restrito (50% do limite normal), (3) voltar para Redis automaticamente quando ele se recupera. Adicione um circuit breaker em torno do Redis para evitar tentativas quando sabidamente offline.",
      concepts: ["fallback-local", "circuit-breaker", "redis-resiliencia", "fail-open", "graceful-degradation"],
    },
  ],
  codeExamples: [
    {
      title: "Token Bucket com lazy refill — sem setInterval",
      language: "typescript",
      code: `interface Bucket {
  tokens: number
  lastRefillAt: number
}

const CAPACITY = 10  // tokens máximos no bucket
const RATE = 2       // tokens adicionados por segundo
const buckets = new Map<string, Bucket>()

/**
 * Lazy refill: calcula tokens apenas no momento de consumo.
 * Não precisa de timer ou processo de background.
 * Thread-safe dentro de um único processo Node.js.
 */
export function consume(userId: string): boolean {
  const now = Date.now()
  const bucket = buckets.get(userId) ?? {
    tokens: CAPACITY,
    lastRefillAt: now,
  }

  // Calcula quantos tokens foram reabastecidos desde o último uso
  const elapsedSeconds = (now - bucket.lastRefillAt) / 1000
  const refilled = elapsedSeconds * RATE
  bucket.tokens = Math.min(CAPACITY, bucket.tokens + refilled)
  bucket.lastRefillAt = now

  if (bucket.tokens < 1) {
    buckets.set(userId, bucket)
    return false // bloqueado
  }

  bucket.tokens -= 1
  buckets.set(userId, bucket)
  return true // permitido
}

// Limpeza periódica de buckets inativos (>1h)
setInterval(() => {
  const threshold = Date.now() - 3_600_000
  for (const [key, b] of buckets) {
    if (b.lastRefillAt < threshold) buckets.delete(key)
  }
}, 60_000)`,
    },
    {
      title: "Redis Lua script atômico — sem race condition",
      language: "typescript",
      code: `import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL!)

const RATE_LIMIT_SCRIPT = \`
local key    = KEYS[1]
local limit  = tonumber(ARGV[1])
local window = tonumber(ARGV[2])  -- segundos

local count = redis.call("INCR", key)
if count == 1 then
  redis.call("EXPIRE", key, window)
end
return count
\`

interface RateLimitResult {
  allowed: boolean
  count: number
  remaining: number
  resetAt: number
}

export async function checkRateLimit(
  userId: string,
  endpoint: string,
  limit = 100,
  windowSec = 60
): Promise<RateLimitResult> {
  // Janela: floor(epoch / windowSec) — muda a cada 'windowSec' segundos
  const windowId = Math.floor(Date.now() / (windowSec * 1000))
  const key = \`rl:\${userId}:\${endpoint}:\${windowId}\`

  // Lua garante atomicidade: INCR + EXPIRE são inseparáveis
  const count = (await redis.eval(
    RATE_LIMIT_SCRIPT,
    1,        // número de KEYS
    key,      // KEYS[1]
    limit,    // ARGV[1]
    windowSec // ARGV[2]
  )) as number

  const resetAt = (windowId + 1) * windowSec

  return {
    allowed: count <= limit,
    count,
    remaining: Math.max(0, limit - count),
    resetAt,
  }
}

// Middleware Express
import type { Request, Response, NextFunction } from 'express'

export function rateLimitMiddleware(limit: number, windowSec: number) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as { id: string } | undefined)?.id ?? req.ip ?? 'anon'
    const endpoint = req.path.replace(/\\/[0-9a-f-]+/g, '/:id') // normaliza IDs

    const result = await checkRateLimit(userId, endpoint, limit, windowSec)

    res.setHeader('X-RateLimit-Limit', limit)
    res.setHeader('X-RateLimit-Remaining', result.remaining)
    res.setHeader('X-RateLimit-Reset', result.resetAt)

    if (!result.allowed) {
      res.setHeader('Retry-After', windowSec)
      return res.status(429).json({
        error: 'Too Many Requests',
        retryAfter: windowSec,
        resetAt: new Date(result.resetAt * 1000).toISOString(),
      })
    }

    next()
  }
}`,
    },
    {
      title: "Rate limiter resiliente com fallback local quando Redis indisponível",
      language: "typescript",
      code: `import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL!, {
  enableOfflineQueue: false,  // não acumula comandos se offline
  connectTimeout: 500,
  commandTimeout: 100,
  lazyConnect: true,
})

// Estado do circuit breaker para o Redis
let redisHealthy = true
let lastRedisErrorAt = 0
const CIRCUIT_OPEN_MS = 10_000  // 10s sem tentar o Redis

// Fallback local: limite mais conservador (50% do normal)
const localCounters = new Map<string, { count: number; expiresAt: number }>()

async function checkWithRedis(key: string, limit: number, windowSec: number): Promise<number> {
  const count = (await redis.eval(
    \`local c = redis.call("INCR", KEYS[1])
     if c == 1 then redis.call("EXPIRE", KEYS[1], ARGV[1]) end
     return c\`,
    1, key, windowSec
  )) as number
  redisHealthy = true
  return count
}

function checkLocal(key: string, limit: number, windowSec: number): number {
  const now = Date.now()
  const entry = localCounters.get(key)

  if (!entry || entry.expiresAt < now) {
    localCounters.set(key, { count: 1, expiresAt: now + windowSec * 1000 })
    return 1
  }

  entry.count++
  return entry.count
}

export async function checkRateLimit(
  userId: string,
  limit: number,
  windowSec = 60
): Promise<{ allowed: boolean; source: 'redis' | 'local' }> {
  const key = \`rl:\${userId}:\${Math.floor(Date.now() / (windowSec * 1000))}\`
  const now = Date.now()

  // Circuit breaker: se Redis falhou recentemente, usar local
  if (!redisHealthy && now - lastRedisErrorAt < CIRCUIT_OPEN_MS) {
    const localLimit = Math.floor(limit * 0.5)  // 50% mais conservador
    const count = checkLocal(key, localLimit, windowSec)
    return { allowed: count <= localLimit, source: 'local' }
  }

  try {
    const count = await checkWithRedis(key, limit, windowSec)
    return { allowed: count <= limit, source: 'redis' }
  } catch {
    // Redis falhou — ativa circuit breaker e usa fallback local
    redisHealthy = false
    lastRedisErrorAt = now
    console.warn('[RateLimit] Redis indisponível, usando fallback local (50% do limite)')

    const localLimit = Math.floor(limit * 0.5)
    const count = checkLocal(key, localLimit, windowSec)
    return { allowed: count <= localLimit, source: 'local' }
  }
}`,
    },
  ],
  videos: [
    {
      title: "System Design: Rate Limiting",
      channel: "ByteByteGo",
      url: "https://www.youtube.com/watch?v=FU4WlwfS3G0",
      topic: "Algoritmos e design de rate limiter",
    },
    {
      title: "Rate Limiting in Distributed Systems",
      channel: "Hussein Nasser",
      url: "https://www.youtube.com/watch?v=mhUQe4BKZXs",
      topic: "Implementação com Redis em sistemas distribuídos",
    },
    {
      title: "Token Bucket and Leaky Bucket Algorithms Explained",
      channel: "TechDummies",
      url: "https://www.youtube.com/watch?v=0CQcSXNxP30",
      topic: "Token Bucket vs Leaky Bucket com animação",
    },
    {
      title: "Building a Rate Limiter in Node.js with Redis",
      channel: "Traversy Media",
      url: "https://www.youtube.com/watch?v=MHFEQSSf-Xg",
      topic: "Implementação prática Node.js + Redis",
    },
    {
      title: "Designing a Rate Limiter — System Design Interview",
      channel: "Gaurav Sen",
      url: "https://www.youtube.com/watch?v=xrizarXJgC8",
      topic: "Rate limiter para entrevista de sistema",
    },
  ],
  resources: [
    { title: 'System Design Primer — Rate Limiter', url: 'https://github.com/donnemartin/system-design-primer#rate-limiter', kind: 'docs' },
    { title: 'Stripe — Designing robust and predictable APIs with idempotency', url: 'https://stripe.com/blog/idempotency', kind: 'artigo' },
    { title: 'Stripe — Rate limiters design', url: 'https://stripe.com/blog/rate-limiters', kind: 'artigo' },
    { title: 'Cloudflare — Counting things: a lot of different things (sliding window counter)', url: 'https://blog.cloudflare.com/counting-things-a-lot-of-different-things/', kind: 'artigo' },
    { title: 'AWS Builders Library — Throttling and load shedding', url: 'https://aws.amazon.com/builders-library/using-load-shedding-to-avoid-overload/', kind: 'artigo' },
    { title: 'Redis documentation — INCR, EXPIRE, Lua scripting', url: 'https://redis.io/docs/manual/programmability/lua-api/', kind: 'docs' },
    { title: 'RFC 6585 — Additional HTTP Status Codes (429)', url: 'https://datatracker.ietf.org/doc/html/rfc6585', kind: 'docs' },
    { title: 'Kong — Rate Limiting Best Practices', url: 'https://docs.konghq.com/hub/kong-inc/rate-limiting/', kind: 'docs' },
  ],
}

export default rateLimiting
