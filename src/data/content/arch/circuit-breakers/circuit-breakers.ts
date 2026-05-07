import type { SkillContent } from '@/types'

const circuitBreakers: SkillContent = {
  tagline: 'Parar de chamar dependência quebrada antes que ela leve seu sistema junto.',
  why: 'Resiliência e tema obrigatório em entrevista sênior. Circuit breaker mostra que você pensa em failure mode, cascading failure e como sistema se recupera. Quem nunca implementou ou configurou de verdade tropeça em pergunta básica de half-open.',
  summary: 'Circuit breaker é padrão de resiliência que monitora chamadas a uma dependência e, quando taxa de erro/latência cruza limiar, abre o circuito — para de chamar e falha rápido (fail-fast). Após timeout, vai pra half-open: deixa passar algumas chamadas pra testar; se passarem, fecha e volta ao normal; se falharem, abre de novo. Evita cascading failure (cliente travado em timeout puxa todos os threads, sistema todo cai). Padrão crítico em sistemas distribuídos com dependência externa.',
  keypoints: [
    { title: 'Três estados', body: 'Closed (chamadas passam, monitora falhas), Open (rejeita imediatamente, falha rápido), Half-open (passa N chamadas de teste, decide se fecha ou abre de novo).' },
    { title: 'Cascading failure', body: 'Sem breaker, dependência lenta amarra threads do cliente. Pool esgota. Cliente fica unresponsive. Outros serviços chamando ele também caem. Cascata. Breaker corta no início.' },
    { title: 'Limiares de abertura', body: 'Por taxa de erro (ex: 50% em janela de 1min), por contagem absoluta, por latência P99. Janela deslizante é melhor que contador simples — evita reabrir/fechar oscilando.' },
    { title: 'Timeout no half-open', body: 'Tempo de espera antes de tentar half-open define velocidade de recuperação. Curto demais = oscilação. Longo demais = degradação prolongada. Típico: 30s–2min com backoff exponencial.' },
    { title: 'Fallback', body: 'Quando breaker abre, o que você devolve? Cache stale, default, mensagem amigável, queue pra processar depois. Sem fallback, breaker só adianta o erro — não melhora UX.' },
    { title: 'Bulkhead pattern', body: 'Complementa breaker: pools de thread/conexão isolados por dependência. Falha em serviço A não consome thread de chamada pra serviço B. Hystrix popularizou esse combo.' },
    { title: 'Bibliotecas', body: 'Resilience4j (Java/Kotlin), Polly (.NET), opossum (Node), gobreaker (Go). Service mesh (Istio, Linkerd) faz no nível de proxy sem mudar código.' },
  ],
  gotchas: [
    'Breaker sem fallback útil — usuário ainda vê erro, você só falhou mais rápido. Defina experiência degradada.',
    'Limiar muito sensível — 1 falha abre o circuito, sistema fica oscilando. Use janela deslizante com volume mínimo.',
    'Esquecer timeout da chamada subjacente — se request HTTP não tem timeout, breaker nunca conta como falha porque request fica pendurado para sempre.',
    'Aplicar breaker em chamada local (DB pool, cache local) — não é o caso de uso. Breaker é para dependência remota com risco de ficar lenta/cair.',
    'Estado do breaker em memória local em serviço com 100 instâncias — cada uma decide separadamente. Para decisão global, breaker no service mesh ou centralizado.',
    'Não monitorar estado do breaker — se está OPEN há 10 minutos, precisa alerta. Sem métrica de estado, você não sabe que o sistema está degradado.',
  ],

  interview: [
    {
      level: 'pleno',
      q: 'Quais são os três estados do circuit breaker e como a transição entre eles funciona?',
      a: '<p>O circuit breaker possui três estados:</p><ul><li><strong>CLOSED</strong>: chamadas passam normalmente. O breaker monitora taxa de erros em janela deslizante. Se a taxa ultrapassar o limiar (ex: 50%), transita para OPEN.</li><li><strong>OPEN</strong>: chamadas são rejeitadas imediatamente (fail-fast) sem tocar na dependência. Após o <code>resetTimeout</code> (ex: 30s), transita para HALF_OPEN.</li><li><strong>HALF_OPEN</strong>: permite N chamadas de teste. Se passarem, volta para CLOSED. Se falharem, volta para OPEN (com backoff opcional).</li></ul><p>A janela deslizante com <strong>volume mínimo</strong> (ex: pelo menos 20 chamadas) evita abertura com poucos dados.</p>',
      tip: 'Mencione a janela deslizante e o volume mínimo — candidatos que omitem isso ainda pensam em contador simples.',
    },
    {
      level: 'pleno',
      q: 'O que é cascading failure e como o circuit breaker previne?',
      a: '<p><strong>Cascading failure</strong> ocorre quando uma dependência lenta ou indisponível esgota recursos do cliente, tornando-o indisponível para seus próprios clientes, propagando a falha em cascata.</p><p>Exemplo: Serviço A chama B com timeout de 30s. Sem breaker, A enche o thread pool esperando B. Outros serviços que chamam A ficam na fila. Em segundos, toda a pilha cai.</p><p>O breaker previne ao <strong>rejeitar imediatamente</strong> (OPEN state) sem consumir thread/socket. A falha fica contida na borda do serviço, não se propaga upstream.</p>',
      tip: 'Use o exemplo concreto de thread pool exhaustion — é o mecanismo exato que torna a cascata possível.',
    },
    {
      level: 'pleno',
      q: 'Qual a diferença entre circuit breaker e retry? São concorrentes?',
      a: '<p>São <strong>complementares</strong>, não alternativos. Cada um resolve um problema diferente:</p><ul><li><strong>Retry</strong>: resolve falha <em>transiente</em> (network blip, deploy momentâneo). A dependência está OK, só teve instabilidade pontual.</li><li><strong>Circuit breaker</strong>: resolve falha <em>sustentada</em> (serviço fora do ar por minutos/horas).</li></ul><p>Retry <strong>sem</strong> breaker é perigoso: dependência lenta + retry = amplifica carga exponencialmente (<em>retry storm</em>). O padrão correto é <strong>retry com backoff exponencial + jitter</strong> dentro de um breaker. Quando o breaker abre, para de fazer retry.</p>',
      tip: 'O ponto forte aqui é mencionar o retry storm — mostra que você entende os efeitos sistêmicos, não só o padrão isolado.',
    },
    {
      level: 'pleno',
      q: 'O que é o padrão bulkhead e como ele complementa o circuit breaker?',
      a: '<p><strong>Bulkhead</strong> (anteparo de navio) isola pools de recursos por dependência. Em vez de um thread pool compartilhado para todas as chamadas externas, cada dependência tem seu próprio pool limitado.</p><p>Complementa o breaker porque: o breaker evita chamadas quando a dependência está ruim, mas <em>antes</em> do breaker abrir, threads ainda podem ser consumidas. Com bulkhead, falha em serviço A consome no máximo N threads do pool A — o pool do serviço B permanece disponível.</p><p>Implementação: <code>ThreadPoolBulkhead</code> no Resilience4j, <code>semaphore</code> isolation ou <code>thread</code> isolation no Hystrix.</p>',
      tip: 'Hystrix foi o primeiro a popularizar bulkhead + breaker juntos — citar isso demonstra conhecimento histórico relevante.',
    },
    {
      level: 'pleno',
      q: 'Quais métricas você expõe para um circuit breaker em produção?',
      a: '<p>As métricas essenciais são:</p><ul><li><code>circuit_breaker_state</code>: 0=CLOSED, 1=OPEN, 2=HALF_OPEN — alarme quando OPEN.</li><li><code>circuit_breaker_calls_total</code>: total de chamadas, por outcome (success/failure/rejected/timeout).</li><li><code>circuit_breaker_failure_rate</code>: taxa atual de falha na janela — tendência antes de abrir.</li><li><code>circuit_breaker_slow_call_rate</code>: taxa de chamadas lentas (acima do threshold de latência).</li><li><code>circuit_breaker_state_transitions_total</code>: número de transições — oscilação alta indica threshold mal calibrado.</li></ul><p>No Resilience4j, esses são expostos nativamente via Micrometer/Prometheus.</p>',
      tip: 'Mencionar a métrica de slow_call_rate diferencia — muitos breakers não só contam erros mas também chamadas lentas.',
    },
    {
      level: 'senior',
      q: 'Como você desenha um circuit breaker do zero?',
      a: '<p>Três estados: <code>CLOSED</code>, <code>OPEN</code>, <code>HALF_OPEN</code>. Em CLOSED, mantenho contador de sucesso/falha em <strong>janela deslizante</strong> (ex: 60s) com volume mínimo (ex: 20 calls) pra evitar abrir com pouco dado.</p><p>Quando taxa de falha &gt; limiar (ex: 50%), vai pra OPEN. Em OPEN, rejeita rápido por <code>resetTimeout</code> (ex: 30s). Após isso, HALF_OPEN libera N calls de teste; se passar, CLOSED; se falhar, OPEN de novo com backoff exponencial.</p><p>Adiciono <strong>fallback</strong>: cache stale, default, queue. E observability: metric por estado, alerta quando abre. Implemento via strategy/decorator sobre o client HTTP.</p>',
      tip: 'Descrever a arquitetura como decorator/strategy mostra que você sabe aplicar sem acoplamento ao código de negócio.',
    },
    {
      level: 'senior',
      q: 'Como o breaker se comporta quando você tem 100 instâncias do mesmo serviço?',
      a: '<p>Cada instância tem estado próprio em memória. Algumas podem estar OPEN, outras CLOSED, dependendo do que cada uma observou. Isso é <strong>aceitável</strong> — o comportamento converge porque todas veem a mesma dependência degradada.</p><p>Para decisão global (ex: tirar uma dependência inteira do roteamento), uso <strong>service mesh</strong> (Istio, Linkerd) que decide no proxy de forma centralizada, ou um registro centralizado (Redis com TTL). Porém, centralizar adiciona ponto único de falha — analiso o tradeoff antes de implementar.</p><p>Na prática, breaker distribuído por instância é suficiente para 95% dos casos.</p>',
      tip: 'A resposta sobre service mesh mostra maturidade — você sabe quando o breaker em código não é a solução certa.',
    },
    {
      level: 'senior',
      q: 'Como você testa um circuit breaker em produção?',
      a: '<p><strong>Chaos engineering</strong>: injeto latência/erro na dependência (toxiproxy, fault injection no service mesh) e observo se breaker abre, se fallback funciona, se sistema mantém disponibilidade. Sem teste, você só sabe se funciona quando incidente real acontece.</p><p>Em CI: teste de integração com mock que retorna erro/timeout e <code>assert</code> no estado do breaker após N chamadas. Verifico também que o fallback retorna dado correto.</p><p><strong>Game day</strong> trimestral pra simular falha de dependência crítica em ambiente staging com tráfego realista.</p>',
      tip: 'Citar toxiproxy e game day mostra prática real, não só teoria de livro.',
    },
    {
      level: 'senior',
      q: 'Quando NÃO usar circuit breaker?',
      a: '<p>Em chamadas <strong>locais e rápidas</strong> (cache em memória, computação pura) — overhead não vale. Em fluxo <strong>fire-and-forget</strong> via fila, a fila já absorve falha — breaker não agrega.</p><p>Em <strong>fluxo crítico sem fallback aceitável</strong> (ex: autorização de pagamento em tempo real), abrir o circuito pode ser pior que aguardar com timeout curto — a solução correta é escalar ou redundar a dependência, não falhar rápido para o cliente final.</p><p>Também evito breaker em sistema monolítico sem dependência externa — é complexidade desnecessária.</p>',
      tip: 'A ressalva sobre pagamento diferencia — mostra que você não aplica padrão cegamente.',
    },
    {
      level: 'senior',
      q: 'Como o Resilience4j configura e monitora um circuit breaker em comparação com o Hystrix?',
      a: '<p><strong>Hystrix</strong> (legado, em manutenção): configuração via annotations (<code>@HystrixCommand</code>), thread pool isolation padrão. Dashboard próprio (Hystrix Dashboard + Turbine). Limitação: alto overhead de thread, não suporta coroutines.</p><p><strong>Resilience4j</strong> (moderno): configuração via código fluente ou YAML (<code>application.yml</code>). Integra nativamente com Micrometer, Spring Boot Actuator, exposição Prometheus. Suporta janela deslizante por <strong>contagem</strong> ou por <strong>tempo</strong>, threshold de chamadas lentas (<code>slowCallRateThreshold</code> + <code>slowCallDurationThreshold</code>), e composição com outros padrões (retry, ratelimiter, bulkhead) via <code>Decorators</code>.</p><p>Para projetos novos, Resilience4j é o caminho — Hystrix foi sunset em 2018.</p>',
      tip: 'Mencionar slowCallRateThreshold mostra que você leu a documentação além do básico.',
    },
    {
      level: 'senior',
      q: 'Explique a estratégia de fallback progressivo com circuit breaker.',
      a: '<p>Fallback progressivo (<em>graceful degradation</em>) tem camadas ordenadas do melhor para o pior:</p><ol><li><strong>Cache quente</strong>: retorna dado recente do Redis/memória — melhor UX, dado pode estar levemente desatualizado.</li><li><strong>Cache frio</strong>: dado de horas/dias atrás — ainda útil para muitos casos.</li><li><strong>Default estático</strong>: resposta padrão do negócio (ex: preço médio, lista vazia com mensagem).</li><li><strong>Queue assíncrona</strong>: registra a ação para processar quando serviço voltar.</li><li><strong>Erro explícito amigável</strong>: última opção — informa o usuário com mensagem clara e ETA.</li></ol><p>O fallback é configurado no breaker via <code>.fallbackMethod()</code> no Resilience4j ou como catch no <code>executeWithFallback</code>.</p>',
      tip: 'A hierarquia de fallback mostra pensamento de produto, não só técnico — você pensa no impacto ao usuário.',
    },
    {
      level: 'senior',
      q: 'Como circuit breaker interage com service mesh (Istio/Linkerd)?',
      a: '<p>Service mesh implementa circuit breaker no <strong>plano de dados</strong> (sidecar proxy Envoy), independente do código da aplicação. Configurado via <code>DestinationRule</code> no Istio:</p><p><code>outlierDetection: consecutiveGatewayErrors: 5, interval: 10s, baseEjectionTime: 30s</code> — ejeta um endpoint do pool de balanceamento quando excede erros consecutivos.</p><p><strong>Vantagens sobre breaker em código</strong>: sem dependência de biblioteca, funciona para qualquer linguagem, decisão baseada em observações de todas as instâncias (não apenas local).</p><p><strong>Limitação</strong>: não suporta lógica de fallback complexa (cache, resposta default) — apenas rejeição. Para fallback rico, ainda precisa de breaker na aplicação combinado com o mesh.</p>',
      tip: 'Saber que Istio usa outlier detection (não exatamente os três estados clássicos) demonstra profundidade real.',
    },
    {
      level: 'senior',
      q: 'Como você calibra os parâmetros do circuit breaker para um serviço crítico?',
      a: '<p>Calibração baseada em dados reais:</p><ol><li><strong>Taxa base de erro</strong>: monitore por 2 semanas antes de ativar. Se taxa normal é 1%, defina threshold em 10-15% — margem de 10x sobre baseline.</li><li><strong>Latência P99</strong>: se P99 normal é 200ms, configure <code>slowCallDurationThreshold</code> em 1-2s (5-10x).</li><li><strong>Volume mínimo</strong>: pelo menos 20-30 chamadas na janela antes de avaliar — evita abrir por amostra pequena.</li><li><strong>resetTimeout</strong>: comece com 30s, ajuste baseado em tempo médio de recovery da dependência (olhe post-mortems).</li><li><strong>Iteração</strong>: deploy em produção, observe métricas por 1 semana, ajuste. Evite otimização prematura de parâmetros.</li></ol>',
      tip: 'A abordagem baseada em baseline de 2 semanas mostra experiência com produção real — você não chuta parâmetros.',
    },
    {
      level: 'senior',
      q: 'Como implementar circuit breaker em Node.js com NestJS usando opossum?',
      a: '<p>Instale <code>opossum</code> e crie um provider reutilizável:</p><pre><code>@Injectable()\nexport class PaymentService {\n  private breaker: CircuitBreaker\n\n  constructor(private http: HttpService) {\n    this.breaker = new CircuitBreaker(\n      (data: PaymentDto) =&gt; this.http.post(\'/pay\', data).toPromise(),\n      { timeout: 3000, errorThresholdPercentage: 50,\n        resetTimeout: 30000, volumeThreshold: 10 }\n    )\n    this.breaker.fallback(() =&gt; ({ status: \'queued\' }))\n    this.breaker.on(\'open\', () =&gt; this.logger.warn(\'Circuit OPEN\'))\n  }\n\n  async charge(data: PaymentDto) {\n    return this.breaker.fire(data)\n  }\n}</code></pre><p>Exponha métricas via <code>breaker.stats</code> para Prometheus. Para injeção limpa, crie um <code>CircuitBreakerModule</code> que registra breachers como providers nomeados.</p>',
      tip: 'Mostrar o evento open com logger e o fallback ao mesmo tempo demonstra que você pensa em observability junto com resiliência.',
    },
    {
      level: 'pleno',
      q: 'Qual a diferença entre window por contagem e window por tempo no Resilience4j?',
      a: '<p><strong>COUNT_BASED</strong>: avalia as últimas N chamadas (ex: últimas 100). Simples, mas pode ser enganosa em baixo tráfego — 100 chamadas podem representar 1 hora ou 1 segundo.</p><p><strong>TIME_BASED</strong>: avalia chamadas dentro de uma janela de tempo fixa (ex: últimos 60s). Mais representativo de "o que está acontecendo agora", mas requer tráfego constante para ter dados suficientes.</p><p>Configuração no Resilience4j:</p><pre><code>CircuitBreakerConfig.custom()\n  .slidingWindowType(SlidingWindowType.TIME_BASED)\n  .slidingWindowSize(60) // 60 segundos\n  .minimumNumberOfCalls(20)\n  .build()</code></pre><p>Para serviços com tráfego irregular (batch jobs, cron), prefira COUNT_BASED.</p>',
      tip: 'A ressalva sobre tráfego irregular com COUNT_BASED mostra que você pensa no caso de uso real.',
    },
    {
      level: 'pleno',
      q: 'O que acontece com mensagens em fila quando o circuit breaker está OPEN?',
      a: '<p>Depende da arquitetura. Se o breaker está na camada que <strong>consome</strong> da fila e chama uma dependência externa:</p><ul><li>Consumer para de processar (ou processa mais devagar via backpressure).</li><li>Mensagens acumulam na fila — importante ter <strong>capacidade de backpressure</strong> configurada.</li><li>Após breaker fechar (CLOSED), consumer retoma e processa backlog.</li></ul><p>Se o breaker está na camada de <strong>publicação</strong>: use <strong>outbox pattern</strong> — grave na tabela outbox antes do breaker. O relay publica quando a dependência voltar.</p><p>Sem gerenciamento de backpressure, fila cresce indefinidamente durante OPEN e pode causar OOM ou latência explosiva quando breaker fecha.</p>',
      tip: 'Conectar breaker com outbox pattern e backpressure é resposta de arquiteto, não só de dev.',
    },
    {
      level: 'senior',
      q: 'Como você garante que o circuit breaker não mascara bugs legítimos que precisam de atenção?',
      a: '<p>O breaker pode criar falsa sensação de segurança: sistema "funciona" (fallback entrega resposta) mas na verdade está com falha real. Estratégias para evitar:</p><ul><li><strong>Alerta imediato</strong> quando breaker entra em OPEN — pagerduty/opsgenie, não só dashboard.</li><li><strong>SLO tracking</strong>: o fallback conta como degradação no SLO, não como sucesso. Se fallback serviu 5% dos requests, isso vai para o error budget.</li><li><strong>Log enriquecido</strong>: toda resposta de fallback inclui header/campo indicando que veio de fallback (para frontend saber e mostrar UI diferente, e para análise pós-incidente).</li><li><strong>Dashboards distintos</strong>: "disponibilidade real" vs "disponibilidade com fallback".</li></ul>',
      tip: 'Conectar fallback com SLO/error budget mostra maturidade de engenharia de confiabilidade.',
    },
    {
      level: 'senior',
      q: 'Como circuit breaker + retry + timeout formam uma estratégia de resiliência coesa?',
      a: '<p>Os três formam camadas complementares (pattern: <em>resilience chain</em>):</p><ol><li><strong>Timeout</strong>: limite de quanto tempo uma chamada pode levar. Primeira linha — sem timeout, thread fica presa.</li><li><strong>Retry com backoff exponencial + jitter</strong>: tenta novamente após falha transiente. Jitter evita thundering herd.</li><li><strong>Circuit breaker</strong>: monitora saúde da dependência. Se muitos retries falham, abre o circuito para parar de tentar e aplicar fallback.</li></ol><p>Ordem de aplicação (decorator pattern): <code>CB.decorate(retry.decorate(timeout.decorate(httpCall)))</code>. O breaker é o mais externo — decide se vale tentar. Retry é interno — tenta algumas vezes. Timeout é o mais interno — define limite por tentativa.</p>',
      tip: 'A ordem dos decorators é crucial e muitos erram — breaker mais externo, timeout mais interno.',
    },
    {
      level: 'senior',
      q: 'Como você implementa testes de circuit breaker em ambiente de CI?',
      a: '<p>Estratégia em dois níveis:</p><p><strong>Teste unitário</strong>: mock da dependência que injeta falhas programaticamente. Valida transições de estado:</p><pre><code>// 10 chamadas com 60% de erro → breaker deve abrir\nfor (let i = 0; i &lt; 10; i++) {\n  if (i % 5 === 0) mockService.rejectWith(new Error())\n  else mockService.resolve(\'ok\')\n  await breaker.fire()\n}\nexpect(breaker.opened).toBe(true)</code></pre><p><strong>Teste de integração</strong>: toxiproxy ou WireMock para simular latência e erros HTTP reais. Valida fallback retorna dado correto, métricas são emitidas, logs incluem estado do breaker.</p><p>Ambos no pipeline — unitário em segundos, integração em minutos mas em branch CI.</p>',
      tip: 'Mostrar código de teste com loop de injeção de erros é muito mais convincente do que descrever abstratamente.',
    },
    {
      level: 'senior',
      q: 'O que é o padrão "trip wire" e como ele diferencia de circuit breaker clássico?',
      a: '<p><strong>Trip wire</strong> é uma variação onde o breaker abre com base em <strong>latência</strong> (não apenas erros). Mesmo que a dependência responda 200 OK, se P99 > threshold, o circuito abre.</p><p>Useful quando: a dependência está lenta mas não retornando erro (ex: DB com lock contention retornando resultados corretos após 10s). Sem trip wire por latência, o breaker clássico não detecta degradação.</p><p>No Resilience4j, configurado via <code>slowCallRateThreshold</code> + <code>slowCallDurationThreshold</code>:</p><pre><code>CircuitBreakerConfig.custom()\n  .slowCallRateThreshold(80f) // 80% de chamadas lentas → abre\n  .slowCallDurationThreshold(Duration.ofSeconds(2))\n  .build()</code></pre>',
      tip: 'Trip wire por latência é a feature que separa uso avançado de uso básico — poucos candidatos conhecem.',
    },
    {
      level: 'senior',
      q: 'Como você lida com circuit breaker em arquitetura de microserviços com GraphQL (múltiplos resolvers)?',
      a: '<p>Em GraphQL, cada resolver pode chamar um serviço diferente. O desafio: um breaker OPEN em um resolver não deve quebrar a query inteira se os outros campos ainda podem ser resolvidos.</p><p>Estratégia:</p><ul><li><strong>Breaker por resolver/dependência</strong>, não por query inteira.</li><li>Resolver com breaker OPEN retorna <code>null</code> + adiciona erro em <code>errors[]</code> da resposta GraphQL (partial success).</li><li>Schema define quais campos são <code>nullable</code> (degradação tolerada) vs <code>non-null</code> (crítico — falha toda a query se breaker abre).</li><li>DataLoader + breaker: breaker envolve o batch function do DataLoader, não chamadas individuais.</li></ul>',
      tip: 'Conectar nullable/non-null do GraphQL schema com degradação tolerada é detalhe de arquiteto que poucos pensam.',
    },
  ],

  diagrams: [
    {
      title: 'Máquina de Estados do Circuit Breaker',
      caption: 'Transições entre CLOSED, OPEN e HALF_OPEN com limiares e timeouts',
      html: `
<style>
.cb-diagram { font-family: 'JetBrains Mono', monospace; background: #0f1117; padding: 24px; border-radius: 12px; color: #e2e8f0; }
.cb-states { display: flex; justify-content: space-around; align-items: center; margin: 16px 0; flex-wrap: wrap; gap: 12px; }
.cb-state { border-radius: 50%; width: 110px; height: 110px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; border: 3px solid; }
.cb-closed { background: #052e16; border-color: #22c55e; color: #86efac; }
.cb-open { background: #2d0000; border-color: #ef4444; color: #fca5a5; }
.cb-half { background: #1a1500; border-color: #f59e0b; color: #fcd34d; }
.cb-arrow { font-size: 14px; color: #64748b; text-align: center; padding: 4px 8px; background: #1e2233; border-radius: 6px; font-size: 10px; max-width: 120px; }
.cb-label { font-size: 10px; margin-top: 4px; opacity: 0.8; }
.cb-row { display: flex; align-items: center; gap: 8px; justify-content: center; margin: 8px 0; flex-wrap: wrap; }
.cb-detail { background: #1e2233; border-radius: 8px; padding: 12px; margin-top: 16px; font-size: 11px; }
.cb-detail-row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #2d3748; }
.cb-badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 10px; }
.cb-badge-g { background: #052e16; color: #86efac; }
.cb-badge-r { background: #2d0000; color: #fca5a5; }
.cb-badge-y { background: #1a1500; color: #fcd34d; }
</style>
<div class="cb-diagram">
  <div class="cb-states">
    <div class="cb-state cb-closed">CLOSED<div class="cb-label">Normal</div></div>
    <div style="display:flex;flex-direction:column;gap:8px;align-items:center">
      <div class="cb-arrow">→ taxa erro &gt; 50% →</div>
      <div class="cb-arrow">← N probes OK ←</div>
    </div>
    <div class="cb-state cb-half">HALF<br>OPEN<div class="cb-label">Testando</div></div>
    <div style="display:flex;flex-direction:column;gap:8px;align-items:center">
      <div class="cb-arrow">→ resetTimeout →</div>
      <div class="cb-arrow">← probe falha ←</div>
    </div>
    <div class="cb-state cb-open">OPEN<div class="cb-label">Rejeitando</div></div>
  </div>
  <div class="cb-detail">
    <div class="cb-detail-row"><span>Estado</span><span>Comportamento</span><span>Saída</span></div>
    <div class="cb-detail-row"><span><span class="cb-badge cb-badge-g">CLOSED</span></span><span>Monitora janela deslizante</span><span>Resposta real</span></div>
    <div class="cb-detail-row"><span><span class="cb-badge cb-badge-r">OPEN</span></span><span>Rejeita imediatamente</span><span>Fallback / erro</span></div>
    <div class="cb-detail-row"><span><span class="cb-badge cb-badge-y">HALF_OPEN</span></span><span>N probes passam</span><span>Real ou fallback</span></div>
  </div>
</div>`,
    },
    {
      title: 'Cascading Failure: sem vs com Circuit Breaker',
      caption: 'Por que uma dependência lenta derruba o sistema sem breaker',
      html: `
<style>
.cb2-diagram { font-family: 'JetBrains Mono', monospace; background: #0f1117; padding: 24px; border-radius: 12px; color: #e2e8f0; }
.cb2-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.cb2-col { background: #1e2233; border-radius: 8px; padding: 12px; }
.cb2-title { font-weight: 700; font-size: 12px; margin-bottom: 10px; text-align: center; padding: 4px; border-radius: 4px; }
.cb2-bad { background: #2d0000; color: #fca5a5; }
.cb2-good { background: #052e16; color: #86efac; }
.cb2-svc { display: flex; align-items: center; gap: 8px; padding: 6px; border-radius: 4px; margin: 4px 0; font-size: 11px; }
.cb2-svc-dead { background: #2d0000; border: 1px solid #ef4444; }
.cb2-svc-ok { background: #052e16; border: 1px solid #22c55e; }
.cb2-svc-warn { background: #1a1500; border: 1px solid #f59e0b; }
.cb2-arrow { text-align: center; color: #64748b; font-size: 16px; margin: 2px 0; }
.cb2-dot { width: 8px; height: 8px; border-radius: 50%; }
.cb2-dot-r { background: #ef4444; }
.cb2-dot-g { background: #22c55e; }
.cb2-dot-y { background: #f59e0b; }
.cb2-note { font-size: 10px; color: #64748b; margin-top: 8px; text-align: center; }
</style>
<div class="cb2-diagram">
  <div class="cb2-cols">
    <div class="cb2-col">
      <div class="cb2-title cb2-bad">Sem Circuit Breaker</div>
      <div class="cb2-svc cb2-dead"><div class="cb2-dot cb2-dot-r"></div>Serviço C (lento, 30s)</div>
      <div class="cb2-arrow">↑ threads presas</div>
      <div class="cb2-svc cb2-dead"><div class="cb2-dot cb2-dot-r"></div>Serviço B (thread pool esgotado)</div>
      <div class="cb2-arrow">↑ sem resposta</div>
      <div class="cb2-svc cb2-dead"><div class="cb2-dot cb2-dot-r"></div>Serviço A (cascata)</div>
      <div class="cb2-arrow">↑ timeout</div>
      <div class="cb2-svc cb2-dead"><div class="cb2-dot cb2-dot-r"></div>Cliente (503)</div>
      <div class="cb2-note">1 serviço derruba todos</div>
    </div>
    <div class="cb2-col">
      <div class="cb2-title cb2-good">Com Circuit Breaker</div>
      <div class="cb2-svc cb2-dead"><div class="cb2-dot cb2-dot-r"></div>Serviço C (lento/fora)</div>
      <div class="cb2-arrow">↑ breaker OPEN</div>
      <div class="cb2-svc cb2-warn"><div class="cb2-dot cb2-dot-y"></div>Serviço B (fallback: cache)</div>
      <div class="cb2-arrow">↑ resposta rápida</div>
      <div class="cb2-svc cb2-ok"><div class="cb2-dot cb2-dot-g"></div>Serviço A (normal)</div>
      <div class="cb2-arrow">↑ 200 OK</div>
      <div class="cb2-svc cb2-ok"><div class="cb2-dot cb2-dot-g"></div>Cliente (resposta degradada)</div>
      <div class="cb2-note">Falha contida na borda</div>
    </div>
  </div>
</div>`,
    },
    {
      title: 'Bulkhead + Circuit Breaker: Isolamento de Recursos',
      caption: 'Como pools separados evitam que falha em A afete B',
      html: `
<style>
.cb3-diagram { font-family: 'JetBrains Mono', monospace; background: #0f1117; padding: 24px; border-radius: 12px; color: #e2e8f0; }
.cb3-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 12px; }
.cb3-pool { background: #1e2233; border-radius: 8px; padding: 12px; border: 2px solid; }
.cb3-pool-r { border-color: #ef4444; }
.cb3-pool-g { border-color: #22c55e; }
.cb3-pool-title { font-size: 11px; font-weight: 700; margin-bottom: 8px; }
.cb3-threads { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px; }
.cb3-thread { width: 18px; height: 18px; border-radius: 3px; font-size: 8px; display: flex; align-items: center; justify-content: center; }
.cb3-thread-busy { background: #ef4444; }
.cb3-thread-free { background: #22c55e; }
.cb3-breaker { text-align: center; font-size: 10px; padding: 3px; border-radius: 4px; margin-top: 4px; }
.cb3-breaker-open { background: #2d0000; color: #fca5a5; }
.cb3-breaker-closed { background: #052e16; color: #86efac; }
.cb3-center { text-align: center; margin-bottom: 12px; }
.cb3-svc { background: #2d3748; border-radius: 6px; padding: 8px 16px; display: inline-block; font-size: 12px; }
.cb3-legend { display: flex; gap: 12px; margin-top: 12px; font-size: 10px; }
.cb3-leg-item { display: flex; align-items: center; gap: 4px; }
.cb3-dot { width: 10px; height: 10px; border-radius: 2px; }
</style>
<div class="cb3-diagram">
  <div class="cb3-center"><div class="cb3-svc">Meu Serviço</div></div>
  <div class="cb3-grid">
    <div class="cb3-pool cb3-pool-r">
      <div class="cb3-pool-title">Pool A → Pagamentos (10 threads)</div>
      <div class="cb3-threads">
        <div class="cb3-thread cb3-thread-busy">B</div>
        <div class="cb3-thread cb3-thread-busy">B</div>
        <div class="cb3-thread cb3-thread-busy">B</div>
        <div class="cb3-thread cb3-thread-busy">B</div>
        <div class="cb3-thread cb3-thread-busy">B</div>
        <div class="cb3-thread cb3-thread-busy">B</div>
        <div class="cb3-thread cb3-thread-busy">B</div>
        <div class="cb3-thread cb3-thread-busy">B</div>
        <div class="cb3-thread cb3-thread-busy">B</div>
        <div class="cb3-thread cb3-thread-busy">B</div>
      </div>
      <div class="cb3-breaker cb3-breaker-open">CB: OPEN (falhou)</div>
    </div>
    <div class="cb3-pool cb3-pool-g">
      <div class="cb3-pool-title">Pool B → Catálogo (10 threads)</div>
      <div class="cb3-threads">
        <div class="cb3-thread cb3-thread-busy">B</div>
        <div class="cb3-thread cb3-thread-busy">B</div>
        <div class="cb3-thread cb3-thread-free">F</div>
        <div class="cb3-thread cb3-thread-free">F</div>
        <div class="cb3-thread cb3-thread-free">F</div>
        <div class="cb3-thread cb3-thread-free">F</div>
        <div class="cb3-thread cb3-thread-free">F</div>
        <div class="cb3-thread cb3-thread-free">F</div>
        <div class="cb3-thread cb3-thread-free">F</div>
        <div class="cb3-thread cb3-thread-free">F</div>
      </div>
      <div class="cb3-breaker cb3-breaker-closed">CB: CLOSED (ok)</div>
    </div>
  </div>
  <div class="cb3-legend">
    <div class="cb3-leg-item"><div class="cb3-dot" style="background:#ef4444"></div>Ocupada</div>
    <div class="cb3-leg-item"><div class="cb3-dot" style="background:#22c55e"></div>Livre</div>
    <div class="cb3-leg-item" style="color:#64748b">Pool A esgotado não afeta Pool B</div>
  </div>
</div>`,
    },
  ],

  cheatsheet: {
    title: 'Circuit Breaker — Cheat Sheet',
    html: `
<style>
.cb-cs { font-family: 'JetBrains Mono', monospace; background: #0f1117; color: #e2e8f0; padding: 20px; border-radius: 12px; font-size: 11px; }
.cb-cs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.cb-cs-section { background: #1e2233; border-radius: 8px; padding: 12px; }
.cb-cs-h { font-weight: 700; font-size: 12px; margin-bottom: 8px; color: #ef4444; border-bottom: 1px solid #2d3748; padding-bottom: 4px; }
.cb-cs-row { display: flex; justify-content: space-between; padding: 3px 0; border-bottom: 1px solid #2d3748; }
.cb-cs-key { color: #94a3b8; }
.cb-cs-val { color: #e2e8f0; font-weight: 600; }
.cb-cs-tag { display: inline-block; padding: 1px 6px; border-radius: 3px; font-size: 10px; margin-top: 3px; }
.cb-cs-tag-g { background: #052e16; color: #86efac; }
.cb-cs-tag-r { background: #2d0000; color: #fca5a5; }
.cb-cs-tag-y { background: #1a1500; color: #fcd34d; }
.cb-cs-code { background: #0d1117; padding: 6px 8px; border-radius: 4px; margin-top: 6px; font-size: 10px; color: #a78bfa; white-space: pre; overflow-x: auto; }
</style>
<div class="cb-cs">
  <div class="cb-cs-grid">
    <div class="cb-cs-section">
      <div class="cb-cs-h">Estados</div>
      <div class="cb-cs-row"><span class="cb-cs-key">CLOSED</span><span><span class="cb-cs-tag cb-cs-tag-g">Normal</span></span></div>
      <div class="cb-cs-row"><span class="cb-cs-key">OPEN</span><span><span class="cb-cs-tag cb-cs-tag-r">Fail-fast</span></span></div>
      <div class="cb-cs-row"><span class="cb-cs-key">HALF_OPEN</span><span><span class="cb-cs-tag cb-cs-tag-y">Testando</span></span></div>
      <div class="cb-cs-h" style="margin-top:12px">Parâmetros chave</div>
      <div class="cb-cs-row"><span class="cb-cs-key">failureRateThreshold</span><span class="cb-cs-val">50%</span></div>
      <div class="cb-cs-row"><span class="cb-cs-key">slowCallRateThreshold</span><span class="cb-cs-val">80%</span></div>
      <div class="cb-cs-row"><span class="cb-cs-key">slowCallDuration</span><span class="cb-cs-val">2s</span></div>
      <div class="cb-cs-row"><span class="cb-cs-key">minimumCalls</span><span class="cb-cs-val">20</span></div>
      <div class="cb-cs-row"><span class="cb-cs-key">resetTimeout</span><span class="cb-cs-val">30s</span></div>
      <div class="cb-cs-row"><span class="cb-cs-key">halfOpenPermitted</span><span class="cb-cs-val">5</span></div>
    </div>
    <div class="cb-cs-section">
      <div class="cb-cs-h">Bibliotecas</div>
      <div class="cb-cs-row"><span class="cb-cs-key">Java/Kotlin</span><span class="cb-cs-val">Resilience4j</span></div>
      <div class="cb-cs-row"><span class="cb-cs-key">.NET</span><span class="cb-cs-val">Polly</span></div>
      <div class="cb-cs-row"><span class="cb-cs-key">Node.js</span><span class="cb-cs-val">opossum</span></div>
      <div class="cb-cs-row"><span class="cb-cs-key">Go</span><span class="cb-cs-val">gobreaker</span></div>
      <div class="cb-cs-row"><span class="cb-cs-key">Proxy/mesh</span><span class="cb-cs-val">Istio/Envoy</span></div>
      <div class="cb-cs-h" style="margin-top:12px">Padrões combinados</div>
      <div class="cb-cs-row"><span class="cb-cs-key">+ Retry</span><span class="cb-cs-val">backoff + jitter</span></div>
      <div class="cb-cs-row"><span class="cb-cs-key">+ Timeout</span><span class="cb-cs-val">por chamada</span></div>
      <div class="cb-cs-row"><span class="cb-cs-key">+ Bulkhead</span><span class="cb-cs-val">pool isolado</span></div>
      <div class="cb-cs-row"><span class="cb-cs-key">+ Fallback</span><span class="cb-cs-val">cache / default</span></div>
    </div>
    <div class="cb-cs-section" style="grid-column:1/-1">
      <div class="cb-cs-h">Resilience4j — Configuração mínima</div>
      <div class="cb-cs-code">CircuitBreakerConfig config = CircuitBreakerConfig.custom()
  .slidingWindowType(TIME_BASED).slidingWindowSize(60)
  .minimumNumberOfCalls(20).failureRateThreshold(50)
  .slowCallRateThreshold(80).slowCallDurationThreshold(Duration.ofSeconds(2))
  .waitDurationInOpenState(Duration.ofSeconds(30))
  .permittedNumberOfCallsInHalfOpenState(5)
  .build();</div>
    </div>
  </div>
</div>`,
  },

  mindmap: {
    title: 'Circuit Breaker — Mind Map',
    html: `
<style>
.cb-mm { font-family: 'Space Grotesk', sans-serif; background: #0f1117; color: #e2e8f0; padding: 24px; border-radius: 12px; }
.cb-mm-center { text-align: center; margin-bottom: 20px; }
.cb-mm-node { display: inline-block; background: #ef4444; color: #fff; padding: 8px 20px; border-radius: 20px; font-weight: 700; font-size: 14px; }
.cb-mm-branches { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.cb-mm-branch { background: #1e2233; border-radius: 8px; padding: 12px; border-top: 3px solid; }
.cb-mm-branch-title { font-size: 12px; font-weight: 700; margin-bottom: 8px; }
.cb-mm-item { font-size: 11px; color: #94a3b8; padding: 3px 0; padding-left: 8px; border-left: 2px solid; margin: 2px 0; }
</style>
<div class="cb-mm">
  <div class="cb-mm-center"><div class="cb-mm-node">Circuit Breaker</div></div>
  <div class="cb-mm-branches">
    <div class="cb-mm-branch" style="border-color:#22c55e">
      <div class="cb-mm-branch-title" style="color:#22c55e">Estados</div>
      <div class="cb-mm-item" style="border-color:#22c55e">CLOSED — normal, monitora</div>
      <div class="cb-mm-item" style="border-color:#22c55e">OPEN — rejeita, fail-fast</div>
      <div class="cb-mm-item" style="border-color:#22c55e">HALF_OPEN — testa recovery</div>
    </div>
    <div class="cb-mm-branch" style="border-color:#f59e0b">
      <div class="cb-mm-branch-title" style="color:#f59e0b">Limiares</div>
      <div class="cb-mm-item" style="border-color:#f59e0b">failure rate threshold</div>
      <div class="cb-mm-item" style="border-color:#f59e0b">slow call rate threshold</div>
      <div class="cb-mm-item" style="border-color:#f59e0b">minimum call volume</div>
      <div class="cb-mm-item" style="border-color:#f59e0b">janela deslizante</div>
    </div>
    <div class="cb-mm-branch" style="border-color:#ef4444">
      <div class="cb-mm-branch-title" style="color:#ef4444">Fallback</div>
      <div class="cb-mm-item" style="border-color:#ef4444">cache quente (Redis)</div>
      <div class="cb-mm-item" style="border-color:#ef4444">default estático</div>
      <div class="cb-mm-item" style="border-color:#ef4444">queue assíncrona</div>
      <div class="cb-mm-item" style="border-color:#ef4444">erro amigável</div>
    </div>
    <div class="cb-mm-branch" style="border-color:#a78bfa">
      <div class="cb-mm-branch-title" style="color:#a78bfa">Padrões combinados</div>
      <div class="cb-mm-item" style="border-color:#a78bfa">Retry + backoff + jitter</div>
      <div class="cb-mm-item" style="border-color:#a78bfa">Timeout por chamada</div>
      <div class="cb-mm-item" style="border-color:#a78bfa">Bulkhead (pool isolado)</div>
    </div>
    <div class="cb-mm-branch" style="border-color:#38bdf8">
      <div class="cb-mm-branch-title" style="color:#38bdf8">Implementações</div>
      <div class="cb-mm-item" style="border-color:#38bdf8">Resilience4j (Java)</div>
      <div class="cb-mm-item" style="border-color:#38bdf8">Polly (.NET)</div>
      <div class="cb-mm-item" style="border-color:#38bdf8">opossum (Node)</div>
      <div class="cb-mm-item" style="border-color:#38bdf8">Istio OutlierDetection</div>
    </div>
    <div class="cb-mm-branch" style="border-color:#f472b6">
      <div class="cb-mm-branch-title" style="color:#f472b6">Observability</div>
      <div class="cb-mm-item" style="border-color:#f472b6">metric: estado atual</div>
      <div class="cb-mm-item" style="border-color:#f472b6">alerta quando OPEN</div>
      <div class="cb-mm-item" style="border-color:#f472b6">failure_rate em janela</div>
      <div class="cb-mm-item" style="border-color:#f472b6">slow_call_rate</div>
    </div>
  </div>
</div>`,
  },

  mnemonics: [
    {
      label: 'CHOF — estados em ordem',
      trick: 'Closed Has Open Flow',
      explanation: 'Closed (normal), Half-open (testando), Open (falhando). A ordem de recuperação é: Open → Half-open → Closed. "Closed Has Open Flow" lembra os três estados e que o objetivo é voltar ao Closed.',
    },
    {
      label: 'RTV — parâmetros chave',
      trick: 'Rate, Timeout, Volume',
      explanation: 'Os três parâmetros essenciais de qualquer breaker: Rate (taxa de erro threshold), Timeout (resetTimeout — quanto tempo fica OPEN), Volume (minimum calls — quantas chamadas antes de avaliar). Se você lembrar RTV, configura qualquer biblioteca.',
    },
    {
      label: 'FBM — camadas de resiliência',
      trick: 'Fail-fast, Backoff, Monitor',
      explanation: 'A cadeia correta: Timeout (falha rápido por chamada), Retry com Backoff exponencial (tenta algumas vezes), Breaker que Monitora e para quando a dependência está ruim. FBM = a ordem correta dos decorators: breaker envolve retry, retry envolve timeout.',
    },
    {
      label: 'OSCILA — sinal de threshold ruim',
      trick: 'O Serviço Cicla Indefinidamente Ligando e Abrindo',
      explanation: 'Quando o breaker fica abrindo e fechando rapidamente (oscilando), é sinal de threshold muito sensível, volume mínimo muito baixo, ou resetTimeout muito curto. OSCILA = diagnóstico imediato de calibração errada.',
    },
  ],

  exercises: [
    {
      level: 'iniciante',
      title: 'Implementar circuit breaker simples com opossum',
      description: 'Crie um serviço Node.js que chama uma API externa (httpbin.org/delay ou similar). Envolva a chamada com opossum configurando failureThreshold: 50%, resetTimeout: 10s, timeout: 3s. Implemente um fallback que retorna dados em cache. Simule falhas desativando o endpoint e observe o breaker abrir após N falhas.',
      concepts: ['estados do breaker', 'fallback', 'opossum', 'timeout'],
      hint: 'Use o evento breaker.on("open") para logar quando o circuito abre e breaker.on("close") para quando fecha.',
    },
    {
      level: 'intermediario',
      title: 'Circuit breaker com janela deslizante e métricas Prometheus',
      description: 'Implemente no Resilience4j (ou opossum) um breaker com janela por tempo (60s), minimum calls 20, failure threshold 50%, slow call threshold 80%/2s. Exponha as métricas via Micrometer/Prometheus. Crie um dashboard Grafana com: estado atual, failure_rate, slow_call_rate, transitions_total. Escreva testes de integração que validam as transições de estado.',
      concepts: ['janela deslizante', 'slow call threshold', 'Resilience4j', 'Prometheus', 'Micrometer'],
    },
    {
      level: 'intermediario',
      title: 'Cadeia: Timeout → Retry → Circuit Breaker',
      description: 'Implemente a cadeia completa de resiliência: timeout de 500ms por chamada, retry com backoff exponencial (100ms, 200ms, 400ms) e jitter, breaker com volume mínimo de 10 e threshold 50%. Escreva testes que validam: (1) falha transiente → retry resolve, (2) falha sustentada → breaker abre após N chamadas, (3) breaker OPEN → retry não é executado (economia de recursos).',
      concepts: ['retry', 'backoff exponencial', 'jitter', 'decorators', 'composição de padrões'],
      hint: 'No Resilience4j: Decorators.ofSupplier(() -> call).withCircuitBreaker(cb).withRetry(retry).withBulkhead(bh)',
    },
    {
      level: 'senior',
      title: 'Chaos engineering: validar breaker em ambiente staging',
      description: 'Use toxiproxy para injetar latência (2s, 4s, 8s) e erros (10%, 30%, 60%, 80%) numa dependência de forma progressiva. Valide que o breaker abre no threshold correto, que o fallback retorna dado coerente, que o sistema mantém disponibilidade > 99% mesmo com dependência 80% degradada, e que o breaker fecha automaticamente após recovery. Documente um runbook de incidente baseado nos experimentos.',
      concepts: ['chaos engineering', 'toxiproxy', 'fault injection', 'availability', 'runbook'],
    },
  ],

  codeExamples: [
    {
      title: 'Circuit Breaker com opossum em NestJS',
      language: 'typescript',
      code: `import CircuitBreaker from 'opossum'
import { Injectable, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name)
  private breaker: CircuitBreaker

  constructor(private readonly http: HttpService) {
    this.breaker = new CircuitBreaker(
      async (payload: Record<string, unknown>) => {
        const res = await firstValueFrom(
          this.http.post('https://payments.internal/charge', payload)
        )
        return res.data
      },
      {
        timeout: 3000,              // 3s por chamada
        errorThresholdPercentage: 50, // abre com 50% de erros
        resetTimeout: 30000,          // tenta HALF_OPEN após 30s
        volumeThreshold: 10,          // mínimo 10 calls na janela
        rollingCountTimeout: 60000,   // janela de 60s
      }
    )

    // Fallback: retorna cache ou default
    this.breaker.fallback(async () => ({
      status: 'queued',
      message: 'Pagamento em processamento — você será notificado.',
    }))

    // Observability
    this.breaker.on('open', () =>
      this.logger.warn('Circuit OPEN — pagamentos em fallback')
    )
    this.breaker.on('halfOpen', () =>
      this.logger.log('Circuit HALF_OPEN — testando recovery')
    )
    this.breaker.on('close', () =>
      this.logger.log('Circuit CLOSED — pagamentos normalizados')
    )
    this.breaker.on('fallback', (result) =>
      this.logger.debug('Fallback acionado', result)
    )
  }

  async charge(payload: Record<string, unknown>) {
    return this.breaker.fire(payload)
  }

  // Métricas para Prometheus
  getStats() {
    return this.breaker.stats
  }
}`,
    },
    {
      title: 'Circuit Breaker com Resilience4j — Java',
      language: 'java',
      code: `import io.github.resilience4j.circuitbreaker.*;
import io.github.resilience4j.retry.*;
import io.github.resilience4j.decorators.Decorators;
import java.time.Duration;
import java.util.function.Supplier;

public class PaymentClient {

    private final CircuitBreaker circuitBreaker;
    private final Retry retry;

    public PaymentClient() {
        // Configuração do Circuit Breaker
        CircuitBreakerConfig cbConfig = CircuitBreakerConfig.custom()
            .slidingWindowType(CircuitBreakerConfig.SlidingWindowType.TIME_BASED)
            .slidingWindowSize(60)               // janela de 60s
            .minimumNumberOfCalls(20)            // mínimo para avaliar
            .failureRateThreshold(50f)           // 50% de erro → abre
            .slowCallRateThreshold(80f)          // 80% lentas → abre
            .slowCallDurationThreshold(Duration.ofSeconds(2))
            .waitDurationInOpenState(Duration.ofSeconds(30))
            .permittedNumberOfCallsInHalfOpenState(5)
            .recordExceptions(IOException.class, TimeoutException.class)
            .build();

        this.circuitBreaker = CircuitBreaker.of("payments", cbConfig);

        // Métricas automáticas via Micrometer
        CircuitBreakerMetrics.ofCircuitBreaker(circuitBreaker)
            .bindTo(meterRegistry);

        // Retry com backoff exponencial + jitter
        RetryConfig retryConfig = RetryConfig.custom()
            .maxAttempts(3)
            .waitDuration(Duration.ofMillis(100))
            .intervalFunction(IntervalFunction.ofExponentialRandomBackoff(100, 2, 0.5))
            .retryExceptions(IOException.class)
            .build();
        this.retry = Retry.of("payments-retry", retryConfig);

        // Listener de estado
        circuitBreaker.getEventPublisher()
            .onStateTransition(e ->
                log.warn("CB {} → {}", e.getStateTransition().getFromState(),
                         e.getStateTransition().getToState()));
    }

    public PaymentResponse charge(PaymentRequest request) {
        Supplier<PaymentResponse> supplier = Decorators
            .ofSupplier(() -> httpClient.post("/charge", request))
            .withCircuitBreaker(circuitBreaker)
            .withRetry(retry)
            .withFallback(
                List.of(CallNotPermittedException.class, IOException.class),
                ex -> new PaymentResponse("queued", "Em processamento")
            )
            .decorate();

        return supplier.get();
    }
}`,
    },
    {
      title: 'Teste de Circuit Breaker — estados e transições',
      language: 'typescript',
      code: `import CircuitBreaker from 'opossum'
import { describe, it, expect, beforeEach } from 'vitest'

describe('Circuit Breaker — state transitions', () => {
  let breaker: CircuitBreaker
  let callCount = 0

  const flakeyAction = async () => {
    callCount++
    // Simula 60% de falhas
    if (callCount % 5 < 3) throw new Error('Service unavailable')
    return { ok: true }
  }

  beforeEach(() => {
    callCount = 0
    breaker = new CircuitBreaker(flakeyAction, {
      errorThresholdPercentage: 50,
      resetTimeout: 100,       // 100ms para teste rápido
      volumeThreshold: 5,      // abre após 5 chamadas
    })
    breaker.fallback(() => ({ status: 'fallback' }))
  })

  it('deve iniciar CLOSED', () => {
    expect(breaker.closed).toBe(true)
  })

  it('deve abrir após threshold de erros', async () => {
    // 10 chamadas com 60% de erro
    const results = await Promise.allSettled(
      Array.from({ length: 10 }, () => breaker.fire().catch(() => null))
    )

    expect(breaker.opened).toBe(true)
  })

  it('deve usar fallback quando OPEN', async () => {
    // Força abertura
    for (let i = 0; i < 10; i++) {
      await breaker.fire().catch(() => null)
    }
    expect(breaker.opened).toBe(true)

    // Próxima chamada deve retornar fallback
    const result = await breaker.fire()
    expect(result).toEqual({ status: 'fallback' })
  })

  it('deve transitar para CLOSED após recovery', async () => {
    // Abre o breaker
    for (let i = 0; i < 10; i++) {
      await breaker.fire().catch(() => null)
    }
    expect(breaker.opened).toBe(true)

    // Aguarda resetTimeout (100ms no teste)
    await new Promise(r => setTimeout(r, 150))
    expect(breaker.halfOpen).toBe(true)

    // Simula calls bem-sucedidas no HALF_OPEN
    callCount = 999 // força success na flakeyAction (999 % 5 = 4 → success)
    await breaker.fire()
    await breaker.fire()

    expect(breaker.closed).toBe(true)
  })
})`,
    },
  ],

  videos: [
    {
      title: 'Circuit Breaker Pattern Explained',
      channel: 'ByteByteGo',
      url: 'https://www.youtube.com/watch?v=ADHjzgD3xw4',
      topic: 'Visão geral com animações do padrão',
    },
    {
      title: 'Resilience4j Circuit Breaker — Full Tutorial',
      channel: 'Java Brains',
      url: 'https://www.youtube.com/watch?v=6-DEFD3mH7c',
      topic: 'Implementação prática com Spring Boot',
    },
    {
      title: 'Hystrix — Netflix Circuit Breaker (clássico)',
      channel: 'InfoQ',
      url: 'https://www.youtube.com/watch?v=R2NyKaUtM5s',
      topic: 'Palestra original da Netflix sobre o design do Hystrix',
    },
    {
      title: 'Bulkhead and Circuit Breaker Patterns for Resilient Microservices',
      channel: 'Devoxx',
      url: 'https://www.youtube.com/watch?v=sLc9r3BPfKA',
      topic: 'Bulkhead + CB juntos, caso real',
    },
    {
      title: 'Chaos Engineering: Building Confidence in System Behavior',
      channel: 'GOTO Conferences',
      url: 'https://www.youtube.com/watch?v=qDZeB6q3TS4',
      topic: 'Como testar circuit breakers com chaos engineering',
    },
  ],

  resources: [
    { title: 'Release It! — Michael Nygard', url: 'https://pragprog.com/titles/mnee2/release-it-second-edition/', kind: 'livro' },
    { title: 'Martin Fowler — CircuitBreaker', url: 'https://martinfowler.com/bliki/CircuitBreaker.html', kind: 'artigo' },
    { title: 'Resilience4j — Circuit Breaker docs', url: 'https://resilience4j.readme.io/docs/circuitbreaker', kind: 'docs' },
    { title: 'Hystrix wiki (legado mas didático)', url: 'https://github.com/Netflix/Hystrix/wiki', kind: 'docs' },
    { title: 'AWS — Timeouts, Retries and Backoff with Jitter', url: 'https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/', kind: 'artigo' },
    { title: 'opossum — Node.js Circuit Breaker', url: 'https://nodeshift.dev/opossum/', kind: 'docs' },
    { title: 'Microsoft — Circuit Breaker Pattern', url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker', kind: 'docs' },
    { title: 'Chaos Toolkit — Fault Injection', url: 'https://chaostoolkit.org/', kind: 'pratica' },
  ],

  diagram: 'circuit-breaker',
}

export default circuitBreakers
