'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import { buildQuickRefPdf } from '@/components/pdfs/QuickRefPdf'
import type { QuickRefColumn } from '@/components/pdfs/QuickRefPdf'
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'
import { buildComparativeRefPdf } from '@/components/pdfs/ComparativeRefPdf'
import type { CompOption, CompCriterion } from '@/components/pdfs/ComparativeRefPdf'

// ── Paleta OpenTelemetry ──────────────────────────────────────────────────────
const C = '#F5A800'

// ═══════════════════════════════════════════════════════════════════════════════
// PDF CARDS
// ═══════════════════════════════════════════════════════════════════════════════

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 15 perguntas mais cobradas em entrevista pleno/sênior',
    type: 'qa',
    pages: 9,
    description: 'Recuperação ativa em formato Q&A: traces vs metrics vs logs, W3C TraceContext, tail sampling com loadbalancing, propagação em filas, Semantic Conventions, exemplars, sidecar vs gateway, OTLP gRPC vs HTTP, instrumentação de DB e debugging do pipeline.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'Bootstrap Node.js/Python, span manual, propagação em filas, Collector YAML',
    type: 'cheatsheet',
    pages: 2,
    description: 'Referência densa: setup do SDK em Node.js e Python, span manual com Semantic Conventions, propagation.inject/extract para BullMQ/Kafka, YAML completo do Collector com tail_sampling e memory_limiter, regras críticas e atalhos mentais.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'quick-ref',
    title: 'Quick Ref — Semantic Conventions',
    subtitle: 'Atributos padronizados em A4 landscape (HTTP, DB, Messaging, RPC, Resource)',
    type: 'quick-ref',
    pages: 1,
    description: 'Os atributos OTel mais importantes em 3 colunas: HTTP (request.method, response.status_code, route), Database (system, statement, operation), Messaging (system, destination, kafka.message.key), RPC (system, grpc.status_code) e Resource (service.name, deployment.environment, k8s.pod.name).',
    icon: '03',
    goal: 'Referência de bolso',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'Os 8 erros que aparecem em code review de instrumentação OTel',
    type: 'antipatterns',
    pages: 3,
    description: 'Sem memory_limiter no Collector, head sampling para erros raros, propagação manual quebrada em filas, db.statement com PII, span.end() fora do finally, atributos com http.method (deprecado), service.name faltando, processors fora de ordem.',
    icon: '04',
    goal: 'Reconhecimento de padrão',
  },
  {
    id: 'comparative',
    title: 'Comparative — Sampling',
    subtitle: 'Head vs Tail vs ParentBased — qual escolher e por quê',
    type: 'comparative',
    pages: 3,
    description: 'Tabela comparativa: AlwaysOn, TraceIdRatioBased (head), Tail Sampling no Collector, ParentBased, e o caso especial AlwaysOff. Custo, captura de erros, complexidade operacional e cenários recomendados por volume e frequência de erros.',
    icon: '05',
    goal: 'Decisão arquitetural',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// DADOS — Q&A
// ═══════════════════════════════════════════════════════════════════════════════

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'Qual a diferença entre traces, metrics e logs? Como eles se complementam na prática?',
    a: '<p><strong>Traces:</strong> árvore de spans de uma requisição distribuída — latência por serviço, atributos, eventos. Responde &quot;onde foi lento e por quê?&quot;.</p><p><strong>Metrics:</strong> dados numéricos agregados ao longo do tempo (req/s, p99, error rate). Responde &quot;o sistema está saudável agora?&quot;.</p><p><strong>Logs:</strong> eventos discretos com contexto estruturado. Responde &quot;o que exatamente aconteceu?&quot;.</p><p>O fluxo prático: alerta dispara em métrica (error rate &gt; 1%) → trace_id da requisição problemática → trace mostra qual serviço está falhando → log com o stack trace exato. Sem os três correlacionados, debugging distribuído é cego.</p>',
    tip: 'Mencione a correlação pelos campos trace_id e span_id nos logs — isso mostra que você entende o dado prático, não só o conceito teórico.',
  },
  {
    level: 'Pleno',
    q: 'Por que usar OTel em vez do SDK proprietário de Datadog ou New Relic?',
    a: '<p><strong>Vendor lock-in:</strong> com OTel, você troca de backend sem mudar uma linha de código de instrumentação — só o YAML do Collector. <strong>Padrão da indústria:</strong> ferramentas OSS (Jaeger, Grafana Tempo) e SaaS (Datadog, Honeycomb, New Relic) suportam OTLP nativamente. <strong>API unificada:</strong> mesmo SDK para traces, metrics e logs em 10+ linguagens.</p><p><strong>Contra:</strong> agentes proprietários podem ter features extras (profiling contínuo, APM automático, live debugging, session replay). A escolha é flexibilidade de longo prazo com OTel vs. experiência out-of-the-box com agente proprietário.</p>',
    tip: 'Reconheça os trade-offs — entrevistador sênior espera nuance, não evangelismo cego. Diga quando um agente proprietário faz sentido.',
  },
  {
    level: 'Pleno',
    q: 'O que é o W3C TraceContext e como ele funciona na prática?',
    a: '<p>É o padrão de propagação de contexto de trace via headers HTTP. O header <code>traceparent</code> carrega: versão (00), trace_id (128-bit hex — mesmo em toda a requisição distribuída), parent_id (64-bit hex — span que originou a chamada) e flags (01 = sampled).</p><p>Cada serviço extrai o contexto do header recebido, cria um span filho com novo span_id, executa sua lógica, e injeta o traceparent atualizado no header das chamadas downstream. Resultado: um único trace_id conecta todos os spans de todos os serviços — no Jaeger/Tempo você vê a waterfall completa.</p><p><strong>Exemplo:</strong> <code>traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01</code></p>',
    tip: 'Descrever o que cada campo do traceparent significa impressiona — mostra que você leu a spec, não só usou a biblioteca.',
  },
  {
    level: 'Senior',
    q: 'Como você implementaria tail sampling no OTel Collector?',
    a: '<p>Tail sampling requer que o Collector veja todos os spans de uma trace antes de decidir.</p><p><strong>Configuração:</strong> usar o <code>tail_sampling</code> processor com policies — ex: capturar 100% de traces com status ERROR, 100% de traces com latência &gt; 1s, 10% do restante (probabilistic). O Collector mantém estado em memória (buffer de spans por trace_id) durante a janela de decisão (decision_wait, ex: 10s).</p><p><strong>Em produção com múltiplos Collectors:</strong> usar o <code>loadbalancingexporter</code> para rotear spans do mesmo trace_id para o mesmo Collector (consistent hashing por trace_id) — sem isso cada Collector vê só parte da trace e não consegue decidir corretamente.</p>',
    tip: 'A parte do roteamento por trace_id no load balancer é o que diferencia sênior — é onde a maioria erra em produção.',
  },
  {
    level: 'Senior',
    q: 'Como propagar contexto em sistemas de filas (BullMQ, Kafka)?',
    a: '<p>Em HTTP é automático via headers. Em filas, é manual porque não há protocolo padrão de headers.</p><p><strong>Ao publicar:</strong> injetar o contexto OTel nos dados do job com <code>propagation.inject(context.active(), carrier)</code>.</p><p><strong>Ao consumir:</strong> extrair com <code>propagation.extract(context.active(), carrier)</code> e executar dentro de <code>context.with(parentCtx, ...)</code>.</p><p>Sem isso, a trace quebra na fronteira da fila — produtor e consumidor aparecem como traces separadas sem link. SDKs OTel têm instrumentação automática para Kafka (<code>@opentelemetry/instrumentation-kafkajs</code>) que faz isso nos headers Kafka nativos.</p>',
    tip: 'Mostrar o código de inject/extract é melhor que descrever — memorize o padrão.',
  },
  {
    level: 'Pleno',
    q: 'O que são Semantic Conventions e por que são importantes?',
    a: '<p>São nomes padrão de atributos de spans definidos pela spec OTel: <code>http.request.method</code>, <code>http.response.status_code</code>, <code>db.system</code>, <code>db.statement</code>, <code>messaging.system</code>, <code>rpc.service</code>.</p><p><strong>Importância:</strong> ferramentas como Grafana Tempo, Jaeger e backends SaaS constroem dashboards e correlações com base nesses nomes. Se você usa <code>http.verb</code> em vez de <code>http.request.method</code>, perde correlação automática.</p><p>Também permite queries portáveis entre serviços em linguagens diferentes — &quot;mostre todas as queries de banco lentas&quot; funciona porque todos usam <code>db.statement</code>.</p>',
    tip: 'Cite a mudança http.method → http.request.method na spec 1.20+ — mostra que você acompanha evolução da spec.',
  },
  {
    level: 'Senior',
    q: 'Como você estruturaria a observabilidade de um serviço novo do zero com OTel?',
    a: '<ol><li>Instalar SDK + auto-instrumentação para o framework (Express, FastAPI)</li><li>Configurar Resource attributes: service.name, service.version, deployment.environment</li><li>Exportar via OTLP para o Collector</li><li>Criar spans manuais para operações de negócio críticas (processar pedido, autorizar pagamento) com atributos relevantes</li><li>Definir métricas de negócio: orders_total, payment_failures_total — não só as técnicas do auto-instr</li><li>Configurar sampling: AlwaysOn em dev, tail sampling em prod com 100% de erros</li><li>Validar Semantic Conventions nos atributos</li><li>Correlacionar logs com trace_id/span_id via SDK bridge</li></ol>',
    tip: 'Mostrar que você pensa em métricas de negócio e sampling — não só "liguei o auto-instr" — é o que diferencia pleno de sênior.',
  },
  {
    level: 'Senior',
    q: 'Qual a diferença entre head sampling e tail sampling? Quando usar cada um?',
    a: '<p><strong>Head sampling:</strong> decisão no início da requisição, antes de saber o resultado. Simples (sem estado), baixo overhead. Tipos: AlwaysOn, TraceIdRatioBased (ex: 10%). <strong>Problema:</strong> pode descartar traces de erros raros se o rate for baixo.</p><p><strong>Tail sampling:</strong> decisão após a trace completar — vê o resultado antes de decidir. Permite capturar 100% de erros e latências altas e amostrar o resto. <strong>Custo:</strong> estado em memória no Collector (buffer por trace_id), Collector stateful.</p><p><strong>Use head quando:</strong> volume é gerenciável e erros são frequentes. <strong>Use tail quando:</strong> erros são raros e você precisa capturá-los todos, ou quando o SLO depende de análise de outliers.</p>',
    tip: 'A linha "head para erros frequentes, tail para erros raros" é a heurística que diferencia quem usa de quem só ouviu falar.',
  },
  {
    level: 'Senior',
    q: 'O que são Exemplars no Prometheus e como se relacionam com OTel?',
    a: '<p><strong>Exemplar</strong> é um ponto específico num histogram Prometheus acompanhado do trace_id que causou aquele valor. Exemplo: <code>histogram_quantile</code> revela p99 de 2s — o exemplar aponta para o trace_id específico que demorou 2s.</p><p>No Grafana com Prometheus + Tempo configurados: clique no ponto do gráfico → abre o trace diretamente.</p><p><strong>Configuração:</strong> Prometheus 2.43+ com <code>--enable-feature=exemplar-storage</code>, SDK OTel emitindo exemplars (ativado por padrão quando há trace ativo), Grafana com data source do Tempo linkado ao Prometheus.</p>',
    tip: 'Exemplars é a feature que concretiza "métricas → trace em um clique" — mencioná-la mostra conhecimento avançado de observabilidade.',
  },
  {
    level: 'Senior',
    q: 'Como você evitaria que dados sensíveis (PII) vazem pela telemetria?',
    a: '<p><strong>Fontes de vazamento:</strong> db.statement (SQL com WHERE email=&apos;x&apos;), span attributes adicionados manualmente (user.email), logs com campos sensíveis.</p><p><strong>Defesa em camadas:</strong></p><ol><li>Educação do time: Semantic Conventions não incluem PII — user.id (opaque ID) é OK, user.email não</li><li>Attributes processor no Collector: <code>delete</code> keys específicas (user.email, http.request.header.authorization) antes de exportar</li><li>Redact de SQL: use <code>db.statement.sanitized</code> em vez de <code>db.statement</code> bruto para remover valores de parâmetros</li><li>Auditoria: scrape do endpoint /metrics do Collector para monitorar atributos exportados</li></ol>',
    tip: 'Defesa em camadas (não só uma solução) é o que entrevista sênior cobra — mostra raciocínio de segurança maduro.',
  },
  {
    level: 'Senior',
    q: 'Por que o memory_limiter é obrigatório no Collector e o que acontece sem ele?',
    a: '<p><strong>Sem memory_limiter:</strong> em picos de tráfego (ex: viral, DDoS, deploy com bug que gera muitos erros), o Collector acumula spans em memória sem limite. O processo ultrapassa o limite de RAM do pod/container e é morto pelo OOM killer. Todo o pipeline de telemetria para — você fica cego exatamente quando mais precisa de observabilidade.</p><p><strong>Com memory_limiter como primeiro processor:</strong> quando atinge o limite, o Collector começa a descartar dados novos (com backpressure para o SDK) em vez de morrer. Você perde alguns spans, mas o pipeline permanece vivo.</p><p><strong>Configure:</strong> limit_mib razoável (~70% do limit do pod), spike_limit_mib para picos, check_interval de 1s.</p>',
    tip: 'Explicar o que acontece com e sem — não só "é obrigatório porque sim" — demonstra entendimento operacional.',
  },
  {
    level: 'Senior',
    q: 'Como você debugaria spans que não estão chegando ao backend?',
    a: '<p>Diagnóstico em camadas:</p><ol><li><strong>SDK → Collector:</strong> adicione logging exporter no Collector (<code>verbosity: detailed</code>) — se os spans aparecem no stdout do Collector, o problema é no exporter</li><li><strong>Collector → backend:</strong> verifique logs do Collector por erros de conexão/autenticação no exporter</li><li><strong>SDK não instrumentado:</strong> verifique se o <code>require(\'instrument\')</code> está sendo chamado antes de qualquer outro require — em ESM use --require flag</li><li><strong>Sampling:</strong> verifique se a decisão de sampling está correta — adicione AlwaysOn temporariamente para debug</li><li><strong>Context propagation quebrada:</strong> use <code>curl -v</code> para inspecionar os headers traceparent nas chamadas entre serviços</li></ol>',
    tip: 'A ordem de diagnóstico (SDK → Collector → Backend) mostra mentalidade de debugging sistemático, não chute.',
  },
  {
    level: 'Pleno',
    q: 'Como o OTel SDK gera métricas além de traces?',
    a: '<p>O SDK OTel tem a Metrics API separada da Traces API.</p><p><strong>Tipos:</strong></p><ul><li><strong>Counter</strong> (add — só cresce, use rate() no PromQL)</li><li><strong>UpDownCounter</strong> (pode descer, ex: gauge de conexões)</li><li><strong>Histogram</strong> (record — distribui em buckets, use histogram_quantile)</li><li><strong>ObservableGauge</strong> (callback assíncrono para polling de valores, ex: tamanho de queue)</li></ul><p>Os três são exportados via OTLP pelo mesmo pipeline. <strong>Vantagem:</strong> um único SDK e uma única configuração de exporter para traces e métricas. Os <strong>exemplars</strong> conectam os dois: cada ponto do histogram pode carregar o trace_id do span ativo.</p>',
    tip: 'Mencionar exemplars como o link entre métrica e trace ativo demonstra entendimento de OTel além do básico.',
  },
  {
    level: 'Senior',
    q: 'Qual a diferença entre sidecar e gateway para o Collector? Quando usar cada um?',
    a: '<p><strong>Sidecar:</strong> um Collector por pod. Isolamento (falha de um pod não derruba coleta dos outros), menor latência (comunicação via loopback), mais simples de configurar. <strong>Gasto:</strong> memória por pod.</p><p><strong>Gateway:</strong> Collector centralizado. Permite tail sampling stateful (um Collector vê todos os spans de um trace), menos instâncias para operar. <strong>SPOF</strong> se não replicado.</p><p><strong>Híbrido (mais comum em produção):</strong> sidecar faz coleta local e batching, gateway central faz tail sampling com consistent hashing por trace_id. O sidecar usa <code>loadbalancingexporter</code> para rotear para o gateway certo.</p>',
    tip: 'O padrão híbrido (sidecar + gateway) é a resposta sênior — mostra que você opera em escala real.',
  },
  {
    level: 'Pleno',
    q: 'O que é o OTLP e quais as diferenças entre gRPC e HTTP?',
    a: '<p><strong>OTLP (OpenTelemetry Protocol):</strong> protocolo binário (protobuf) para transmissão de telemetria. Substituiu formatos proprietários (Jaeger Thrift, Zipkin JSON).</p><p><strong>gRPC (porta 4317):</strong> streaming bidirecional, compressão nativa, multiplexação de conexões — melhor para alta frequência de spans.</p><p><strong>HTTP/1.1 (porta 4318):</strong> mais compatível com proxies, firewalls e service meshes que não entendem gRPC. Mais fácil de debugar com curl. Ambos suportam compressão gzip.</p><p><strong>Escolha:</strong> gRPC em ambientes internos, HTTP quando há proxy/API gateway na frente.</p>',
    tip: 'Citar as portas (4317 e 4318) mostra que você opera, não só leu. Maioria troca as portas em entrevista.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// DADOS — Quick Ref (Semantic Conventions, A4 landscape, 3 colunas)
// ═══════════════════════════════════════════════════════════════════════════════

const QUICK_REF: QuickRefColumn[] = [
  {
    sections: [
      {
        title: 'HTTP — server e client',
        entries: [
          { key: 'http.request.method',          value: 'POST, GET, PUT, DELETE',                   badge: 'novo', badgeColor: '#4ade80' },
          { key: 'http.method',                  value: 'DEPRECATED — usar http.request.method',     badge: 'old',  badgeColor: '#ef4444' },
          { key: 'http.response.status_code',    value: '200, 404, 500 — atributo numérico' },
          { key: 'http.route',                   value: '/users/{id} — normalizado, NÃO o path real' },
          { key: 'url.path',                     value: '/api/orders/123 — só path, sem query' },
          { key: 'url.full',                     value: 'URL completa (CUIDADO com PII em query)' },
          { key: 'http.request.body.size',       value: 'Tamanho em bytes do request' },
          { key: 'http.response.body.size',      value: 'Tamanho em bytes da resposta' },
          { key: 'user_agent.original',          value: 'User-Agent header (normalizar quando possível)' },
        ],
      },
      {
        title: 'Resource — todos os spans',
        entries: [
          { key: 'service.name',          value: 'OBRIGATÓRIO — sem isso vira "unknown_service"', badge: 'req', badgeColor: '#ef4444' },
          { key: 'service.version',       value: '1.4.2 — versão semantic do release' },
          { key: 'service.namespace',     value: 'team-x, production — agrupa serviços' },
          { key: 'deployment.environment',value: 'production, staging, development' },
          { key: 'host.name',             value: 'ip-10-0-1-23 — preenchido pelo detector' },
          { key: 'k8s.pod.name',          value: 'order-7f8d-abc — auto pelo K8s detector' },
          { key: 'k8s.namespace.name',    value: 'production — namespace do pod' },
          { key: 'k8s.container.name',    value: 'app — nome do container no pod' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Database — pg, mysql, redis, mongo',
        entries: [
          { key: 'db.system',          value: 'postgresql, mysql, mongodb, redis, elasticsearch' },
          { key: 'db.operation',       value: 'SELECT, INSERT, UPDATE, DELETE — agregação útil' },
          { key: 'db.statement',       value: 'SQL completa — CUIDADO com PII em WHERE',        badge: 'PII', badgeColor: '#ef4444' },
          { key: 'db.name',            value: 'orders, users — nome do database' },
          { key: 'db.collection.name', value: 'pedidos, users — tabela ou coleção' },
          { key: 'db.connection_string', value: 'postgres://host:5432/db (sem credentials)' },
          { key: 'db.user',            value: 'app_user — usuário da conexão' },
        ],
      },
      {
        title: 'RPC / gRPC',
        entries: [
          { key: 'rpc.system',           value: 'grpc, java_rmi, dotnet_wcf' },
          { key: 'rpc.service',          value: 'OrderService — nome do service .proto' },
          { key: 'rpc.method',           value: 'CreateOrder — método chamado' },
          { key: 'rpc.grpc.status_code', value: '0=OK, 4=DEADLINE, 14=UNAVAIL', badge: 'enum' },
        ],
      },
      {
        title: 'Exception',
        entries: [
          { key: 'exception.type',        value: 'TimeoutError, NullPointerException' },
          { key: 'exception.message',     value: 'Stripe API timeout after 5s' },
          { key: 'exception.stacktrace',  value: 'Stack trace formatada (multi-line)' },
          { key: 'span.recordException()', value: 'API que preenche os 3 acima',                badge: 'api', badgeColor: '#4ade80' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Messaging — Kafka, Rabbit, SQS',
        entries: [
          { key: 'messaging.system',           value: 'kafka, rabbitmq, aws_sqs, gcp_pubsub' },
          { key: 'messaging.operation',        value: 'publish, receive, process' },
          { key: 'messaging.destination.name', value: 'order.created — topic/queue/exchange' },
          { key: 'messaging.destination.kind', value: 'topic, queue, exchange' },
          { key: 'messaging.kafka.message.key',value: 'order_8420 — chave de partição' },
          { key: 'messaging.kafka.partition',  value: '3 — partição lida/escrita' },
          { key: 'messaging.message.id',       value: 'msg_abc123 — ID da mensagem' },
        ],
      },
      {
        title: 'TraceContext — propagação',
        entries: [
          { key: 'traceparent header',   value: '00-{trace_id}-{span_id}-{flags}',           badge: 'W3C', badgeColor: '#F5A800' },
          { key: 'tracestate header',    value: 'Vendor metadata opcional (key=value)' },
          { key: 'baggage header',       value: 'Atributos propagados — userId=42, tier=pro' },
          { key: 'flags=01',             value: 'Sampled — coletar este trace' },
          { key: 'flags=00',             value: 'NOT sampled — descartar' },
        ],
      },
      {
        title: 'OTLP — endpoints',
        entries: [
          { key: 'gRPC',  value: ':4317 — streaming, compressão nativa, multiplex' },
          { key: 'HTTP',  value: ':4318 — proxy/firewall friendly, debug com curl' },
          { key: 'env',   value: 'OTEL_EXPORTER_OTLP_ENDPOINT — URL base' },
          { key: 'env',   value: 'OTEL_EXPORTER_OTLP_HEADERS — auth, tenant' },
          { key: 'env',   value: 'OTEL_SERVICE_NAME — service.name resource attr' },
        ],
      },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// DADOS — Anti-patterns
// ═══════════════════════════════════════════════════════════════════════════════

const ANTI_PATTERNS: AntiPatternItem[] = [
  {
    title: 'Collector sem memory_limiter',
    badDesc: 'Collector sem memory_limiter. Em pico de tráfego o pod vai a OOM e mata todo o pipeline de telemetria.',
    badCode: [
      { t: 'processors:\n  batch:\n    send_batch_size: 1000\n  ', c: '#94a3b8' },
      { t: '# memory_limiter ausente — vai cair em OOM', c: '#ef4444' },
    ],
    goodDesc: 'memory_limiter SEMPRE como primeiro processor. Define limite e ativa backpressure antes do OOM.',
    goodCode: [
      { t: 'processors:\n  ', c: '#94a3b8' },
      { t: 'memory_limiter:        # OBRIGATORIO, primeiro\n    limit_mib: 512\n    check_interval: 1s\n    spike_limit_mib: 128\n', c: '#4ade80' },
      { t: '  batch:\n    send_batch_size: 1000', c: '#94a3b8' },
    ],
    why: 'Sem memory_limiter, picos de tráfego (viral, DDoS, deploy com bug que gera muitos erros) acumulam spans em memória sem limite. O processo ultrapassa RAM do pod e é morto pelo OOM killer. Todo pipeline de telemetria para — você fica cego exatamente quando mais precisa.',
  },
  {
    title: 'Head sampling para erros raros',
    badDesc: 'TraceIdRatioBased(0.01) com 0.1% de error rate = 99% dos traces de erro são descartados.',
    badCode: [
      { t: 'sdk = NodeSDK({\n  ', c: '#94a3b8' },
      { t: 'sampler: new TraceIdRatioBasedSampler(0.01)  // 1%', c: '#ef4444' },
      { t: '\n})', c: '#94a3b8' },
    ],
    goodDesc: 'Tail sampling no Collector com policy de erro 100% + amostra geral. Coleta todos erros mesmo amostrando o resto.',
    goodCode: [
      { t: 'tail_sampling:\n  decision_wait: 10s\n  policies:\n    - ', c: '#94a3b8' },
      { t: 'name: errors\n      type: status_code\n      status_code: { status_codes: [ERROR] }   # 100%', c: '#4ade80' },
      { t: '\n    - name: latency\n      type: latency\n      latency: { threshold_ms: 1000 }\n    - ', c: '#94a3b8' },
      { t: 'name: rest\n      type: probabilistic\n      probabilistic: { sampling_percentage: 5 }', c: '#86efac' },
    ],
    why: 'Head sampling decide ANTES de saber o resultado. Se erros são raros, a maioria das traces de erro é descartada por sorte. Tail sampling guarda spans até o trace fechar e decide com base no resultado — captura 100% dos erros amostrando o tráfego normal.',
  },
  {
    title: 'Propagação manual quebrada em filas',
    badDesc: 'Producer publica sem injetar contexto. Consumer cria trace novo — produtor e consumidor viram traces separadas.',
    badCode: [
      { t: '// producer\n', c: '#94a3b8' },
      { t: 'await queue.add("processar", pedido)  // sem traceparent', c: '#ef4444' },
      { t: '\n\n// consumer\nnew Worker("pedidos", async job => {\n  ', c: '#94a3b8' },
      { t: 'await processar(job.data)            // span sem parent', c: '#ef4444' },
      { t: '\n})', c: '#94a3b8' },
    ],
    goodDesc: 'Inject no produtor, extract no consumidor com context.with — span do consumer vira filho do produtor.',
    goodCode: [
      { t: '// producer\nconst carrier = {}\n', c: '#94a3b8' },
      { t: 'propagation.inject(context.active(), carrier)', c: '#4ade80' },
      { t: '\nawait queue.add("processar", { ...pedido, _otel: carrier })\n\n// consumer\nnew Worker("pedidos", async job => {\n  ', c: '#94a3b8' },
      { t: 'const ctx = propagation.extract(context.active(), job.data._otel)\n  return context.with(ctx, () => processar(job.data))', c: '#4ade80' },
      { t: '\n})', c: '#94a3b8' },
    ],
    why: 'Em HTTP a propagação é automática via headers. Em filas (BullMQ, Kafka, RabbitMQ) é manual — sem inject/extract o trace quebra na fronteira da fila. Producer e consumer aparecem como traces separadas, impossibilita correlação end-to-end.',
  },
  {
    title: 'db.statement com PII',
    badDesc: 'Auto-instrumentação grava SQL completo com valores. WHERE email=&apos;x@y.com&apos; vaza para o backend.',
    badCode: [
      { t: '// span gerado pelo instrumentor de pg\n', c: '#94a3b8' },
      { t: 'db.statement = "SELECT * FROM users WHERE email = \'paciente@hospital.com\' AND cpf = \'12345678900\'"', c: '#ef4444' },
    ],
    goodDesc: 'attributes processor no Collector remove ou sanitiza atributos sensíveis antes de exportar.',
    goodCode: [
      { t: 'processors:\n  ', c: '#94a3b8' },
      { t: 'attributes/redact:\n    actions:\n      - key: db.statement\n        action: hash       # ou: delete\n      - key: user.email\n        action: delete\n      - key: http.request.header.authorization\n        action: delete', c: '#4ade80' },
    ],
    why: 'db.statement é fonte clássica de vazamento de PII. Queries parametrizadas mostram só o template, mas SQL com valores inline (raro mas existe) vaza email, CPF, senha. Defesa em camadas: queries parametrizadas no app + attributes processor no Collector + auditoria periódica.',
  },
  {
    title: 'span.end() fora do finally',
    badDesc: 'Quando o código lança exceção antes de end(), o span fica aberto para sempre. Vaza memória e nunca aparece no backend.',
    badCode: [
      { t: 'const span = tracer.startSpan("op")\n', c: '#94a3b8' },
      { t: 'await processar(data)            // se lançar, span nunca fecha\nspan.end()', c: '#ef4444' },
    ],
    goodDesc: 'Sempre try/finally, OU use startActiveSpan com callback (auto-end via tipo de retorno).',
    goodCode: [
      { t: '// opção 1 — try/finally\nconst span = tracer.startSpan("op")\n', c: '#94a3b8' },
      { t: 'try { await processar(data) }\nfinally { span.end() }', c: '#4ade80' },
      { t: '\n\n// opção 2 — startActiveSpan (recomendado)\n', c: '#94a3b8' },
      { t: 'tracer.startActiveSpan("op", async span => {\n  try { return await processar(data) }\n  finally { span.end() }\n})', c: '#86efac' },
    ],
    why: 'Span sem end() não é exportado pelo BatchSpanProcessor — ele só envia spans terminados. Em código que lança exceções com frequência, isso vaza memória do SDK e perde rastreamento de exatamente os casos que mais importam (os com erro).',
  },
  {
    title: 'Atributo http.method (deprecated)',
    badDesc: 'Spec OTel 1.20+ renomeou atributos HTTP. Backend modernos correlacionam pelo nome novo.',
    badCode: [
      { t: 'span.setAttribute(', c: '#94a3b8' },
      { t: '"http.method", "POST"', c: '#ef4444' },
      { t: ')\nspan.setAttribute(', c: '#94a3b8' },
      { t: '"http.status_code", 503', c: '#ef4444' },
      { t: ')', c: '#94a3b8' },
    ],
    goodDesc: 'Use os nomes novos da spec 1.20+: http.request.method, http.response.status_code.',
    goodCode: [
      { t: 'span.setAttribute(', c: '#94a3b8' },
      { t: '"http.request.method", "POST"', c: '#4ade80' },
      { t: ')\nspan.setAttribute(', c: '#94a3b8' },
      { t: '"http.response.status_code", 503', c: '#4ade80' },
      { t: ')', c: '#94a3b8' },
    ],
    why: 'Semantic Conventions evoluem com a spec. http.method virou http.request.method na 1.20+. Grafana Tempo, Jaeger e backends SaaS constroem dashboards e correlações com base nos nomes — usar o antigo perde correlação automática. Auto-instrumentações modernas já usam os novos.',
  },
  {
    title: 'service.name faltando',
    badDesc: 'Sem Resource attribute service.name, telemetria vai pra "unknown_service" no backend. Impossível filtrar.',
    badCode: [
      { t: 'sdk = NodeSDK({\n  // ', c: '#94a3b8' },
      { t: 'resource ausente — service.name = "unknown_service"', c: '#ef4444' },
      { t: '\n  traceExporter: new OTLPTraceExporter()\n})', c: '#94a3b8' },
    ],
    goodDesc: 'Resource attributes obrigatórios: service.name, service.version, deployment.environment.',
    goodCode: [
      { t: 'sdk = NodeSDK({\n  ', c: '#94a3b8' },
      { t: 'resource: new Resource({\n    [SRA.SERVICE_NAME]: "order-service",\n    [SRA.SERVICE_VERSION]: "1.4.2",\n    [SRA.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV,\n  })', c: '#4ade80' },
      { t: ',\n  traceExporter: new OTLPTraceExporter()\n})', c: '#94a3b8' },
    ],
    why: 'service.name é o filtro principal em todo backend de tracing. Sem ele tudo cai em "unknown_service" e o trace fica órfão. service.version permite correlacionar regressões a deploys. deployment.environment separa prod/staging/dev — sem ele, dev pollui telemetria de prod.',
  },
  {
    title: 'Processors do Collector fora de ordem',
    badDesc: 'batch antes de tail_sampling. Sampling decide trace por trace mas batch já agrupou — decisão fica errada.',
    badCode: [
      { t: 'service:\n  pipelines:\n    traces:\n      processors: [memory_limiter, ', c: '#94a3b8' },
      { t: 'batch, tail_sampling', c: '#ef4444' },
      { t: ']', c: '#94a3b8' },
    ],
    goodDesc: 'Ordem correta: memory_limiter -> attributes (redact PII) -> tail_sampling -> batch.',
    goodCode: [
      { t: 'service:\n  pipelines:\n    traces:\n      processors: [', c: '#94a3b8' },
      { t: 'memory_limiter, attributes, tail_sampling, batch', c: '#4ade80' },
      { t: ']', c: '#94a3b8' },
    ],
    why: 'Ordem em pipeline do Collector é sequencial — cada processor recebe a saída do anterior. memory_limiter PRIMEIRO (controle de RAM), attributes ANTES de tail_sampling (sampling pode usar atributos), batch SEMPRE no fim (agrupa só o que sobrou). Erro de ordem faz o Collector descartar dados sem avisar.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// DADOS — Comparative (Sampling strategies)
// ═══════════════════════════════════════════════════════════════════════════════

const COMP_OPTIONS: CompOption[] = [
  { name: 'AlwaysOn',          color: '#4ade80' },
  { name: 'TraceIdRatioBased', color: '#38bdf8' },
  { name: 'ParentBased',       color: '#a78bfa' },
  { name: 'Tail Sampling',     color: '#f59e0b' },
  { name: 'AlwaysOff',         color: '#94a3b8' },
]

const COMP_CRITERIA: CompCriterion[] = [
  {
    criterion: 'Onde decide',
    category: 'Comportamento',
    values: {
      'AlwaysOn':          'No SDK, na entrada do trace — sempre amostra',
      'TraceIdRatioBased': 'No SDK, na entrada — % por hash do trace_id',
      'ParentBased':       'No SDK, respeita decisão upstream (do parent span)',
      'Tail Sampling':     'No Collector, APÓS o trace fechar — vê o resultado',
      'AlwaysOff':         'No SDK, na entrada — nunca amostra',
    },
  },
  {
    criterion: 'Captura de erros raros',
    category: 'Eficácia',
    values: {
      'AlwaysOn':          '100% — nunca perde erro',
      'TraceIdRatioBased': 'Proporcional ao % — perde maioria se erro for raro',
      'ParentBased':       'Depende do upstream — herda decisão',
      'Tail Sampling':     '100% (com policy de status_code=ERROR)',
      'AlwaysOff':         '0% — descarta tudo',
    },
    winner: 'Tail Sampling',
  },
  {
    criterion: 'Custo de storage',
    category: 'Custo',
    values: {
      'AlwaysOn':          'Alto — 100% dos traces armazenados',
      'TraceIdRatioBased': 'Baixo (com %low) — descarte estatístico simples',
      'ParentBased':       'Variável — depende da decisão upstream',
      'Tail Sampling':     'Baixo — decisão inteligente, só importantes',
      'AlwaysOff':         'Zero — não armazena nada',
    },
    winner: 'Tail Sampling',
  },
  {
    criterion: 'Custo de memória (Collector)',
    category: 'Custo',
    values: {
      'AlwaysOn':          'Baixo — sem buffer, passa direto',
      'TraceIdRatioBased': 'Baixo — decisão estateless',
      'ParentBased':       'Baixo — só lê parent context',
      'Tail Sampling':     'Alto — buffer de spans por trace_id durante decision_wait',
      'AlwaysOff':         'Zero — não há nada para processar',
    },
  },
  {
    criterion: 'Complexidade operacional',
    category: 'Operação',
    values: {
      'AlwaysOn':          'Mínima — uma linha no SDK',
      'TraceIdRatioBased': 'Mínima — uma linha + uma constante',
      'ParentBased':       'Baixa — composição com outro sampler',
      'Tail Sampling':     'Alta — requer Collector stateful + load balancer com hash',
      'AlwaysOff':         'Mínima — desliga tracing',
    },
    winner: 'AlwaysOn',
  },
  {
    criterion: 'Comportamento em multi-Collector',
    category: 'Operação',
    values: {
      'AlwaysOn':          'OK — qualquer Collector aceita',
      'TraceIdRatioBased': 'OK — decisão por hash determinística',
      'ParentBased':       'OK — só propaga decisão',
      'Tail Sampling':     'EXIGE loadbalancingexporter (consistent hash por trace_id)',
      'AlwaysOff':         'OK — descarta em qualquer um',
    },
  },
  {
    criterion: 'Decision_wait (latência)',
    category: 'Latência',
    values: {
      'AlwaysOn':          'Zero — decisão imediata',
      'TraceIdRatioBased': 'Zero',
      'ParentBased':       'Zero',
      'Tail Sampling':     '5-30s (decision_wait) — span fica em buffer',
      'AlwaysOff':         'Zero',
    },
  },
  {
    criterion: 'Service Graph metrics',
    category: 'Capacidades',
    values: {
      'AlwaysOn':          'Baseado em 100% — métricas exatas',
      'TraceIdRatioBased': 'Baseado em amostra — métricas estimadas',
      'ParentBased':       'Variável',
      'Tail Sampling':     'Service Graph processor pode rodar ANTES do sampling',
      'AlwaysOff':         'Sem dados',
    },
  },
  {
    criterion: 'Quando usar',
    category: 'Decisão',
    values: {
      'AlwaysOn':          'Dev/staging, volume baixo, debugging',
      'TraceIdRatioBased': 'Volume médio, erros frequentes (>1%), simplicidade',
      'ParentBased':       'Microservices — coerência entre serviços',
      'Tail Sampling':     'Volume alto + erros raros + budget para ops',
      'AlwaysOff':         'Desligar tracing num serviço sem mexer no código',
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// BUILDERS
// ═══════════════════════════════════════════════════════════════════════════════

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'OpenTelemetry',
    stackLabel: 'Observabilidade — CNCF Standard',
  }),

  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'OpenTelemetry',
    accentColor: C,
    stackLabel: 'Observabilidade — Standard CNCF',
    sections: {
      hooks: [
        { name: 'NodeSDK',                    sig: 'new NodeSDK({ resource, traceExporter, instrumentations })', desc: 'Quando: bootstrap Node.js. Carregar antes de qualquer require do app. Use --require ./instrument.js.' },
        { name: 'tracer.startActiveSpan()',   sig: 'tracer.startActiveSpan("name", async span => {...span.end()})', desc: 'Quando: span manual de operação de negócio. SEMPRE end() no finally.' },
        { name: 'span.setAttribute()',        sig: 'span.setAttribute("user.id", id)',                            desc: 'Quando: enriquecer span com contexto. Siga Semantic Conventions (http.request.method, db.system).' },
        { name: 'span.recordException()',     sig: 'span.recordException(err); span.setStatus({code: ERROR})',     desc: 'Quando: capturar erro. Preenche exception.type/message/stacktrace. Combine com setStatus.' },
        { name: 'propagation.inject()',       sig: 'propagation.inject(context.active(), carrier)',                desc: 'Quando: producer de fila — injeta traceparent nos dados do job para o consumer extrair.' },
        { name: 'propagation.extract()',      sig: 'propagation.extract(context.active(), carrier)',               desc: 'Quando: consumer de fila — extrai contexto e usa context.with(ctx, fn) para criar span filho.' },
      ],
      depRows: [
        ['Resource — service.name',         'OBRIGATÓRIO. Sem isso, telemetria vai pra "unknown_service"'],
        ['Resource — k8s.*',                'Use K8s resource detector — preenche k8s.pod.name automático'],
        ['Sampler — dev',                    'AlwaysOn — capture 100% para debugging completo'],
        ['Sampler — prod',                   'Tail sampling no Collector com policy de erro 100%'],
        ['Exporter — interno',               'OTLP gRPC :4317 — streaming, multiplex, baixa latência'],
        ['Exporter — atrás de proxy',        'OTLP HTTP :4318 — friendly com firewall/service mesh'],
        ['Processor — primeiro',             'memory_limiter SEMPRE — sem ele OOM mata o Collector'],
        ['Processor — último',               'batch SEMPRE — agrupa antes de exportar'],
      ],
      rules: [
        { ok: true,  t: 'Bootstrap do SDK ANTES de qualquer require/import do app (use --require flag)' },
        { ok: true,  t: 'Resource attributes: service.name, service.version, deployment.environment obrigatórios' },
        { ok: true,  t: 'span.end() SEMPRE no finally — sem isso span vaza memória e nunca exporta' },
        { ok: true,  t: 'Use Semantic Conventions modernas: http.request.method (não http.method)' },
        { ok: true,  t: 'memory_limiter como PRIMEIRO processor do Collector — obrigatório em prod' },
        { ok: false, t: 'NUNCA atributos com PII — db.statement bruto, user.email, request body raw' },
        { ok: false, t: 'NUNCA head sampling para erros raros — perde a maioria dos traces que importam' },
        { ok: false, t: 'NUNCA esqueça inject/extract em filas — trace quebra na fronteira' },
      ],
      performanceTips: [
        'BatchSpanProcessor (default em prod) reduz conexões — agrega spans em batches de 512 antes de exportar',
        'Tail sampling em multi-Collector EXIGE loadbalancingexporter com consistent hash por trace_id',
        'Auto-instrumentação cobre 90% dos casos — manualmente instrumente só operações de negócio críticas',
        'Use opentelemetry-instrumentation-kafkajs (não manual) — propaga traceparent via headers Kafka nativos',
        'Service Graph processor no Collector gera métricas RED por par de serviços a partir dos traces',
        'OTLP gRPC com compressão gzip reduz egress — use compression: gzip no exporter',
      ],
      patterns: [
        { name: 'try/finally em span manual', code: 'try { ... span.setStatus({code:OK}) }\ncatch (e) { span.recordException(e); span.setStatus({code:ERROR}); throw }\nfinally { span.end() }', desc: 'Padrão obrigatório para spans manuais — garante end() mesmo em exceção e marca status corretamente.' },
        { name: 'Propagação em fila',          code: '// producer\npropagation.inject(context.active(), job)\n// consumer\nconst ctx = propagation.extract(...)\ncontext.with(ctx, () => process(...))', desc: 'Sem isso, trace quebra. Padrão deve estar em todo wrapper de fila do projeto.' },
        { name: 'Resource detection',          code: 'new Resource({\n  [SRA.SERVICE_NAME]: "api",\n  [SRA.SERVICE_VERSION]: pkg.version,\n  [SRA.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV\n})', desc: 'Use SRA = SemanticResourceAttributes — evita typo nos nomes.' },
        { name: 'Tail sampling — erros',       code: 'policies:\n  - { type: status_code, status_code: { status_codes: [ERROR] } }\n  - { type: latency, latency: { threshold_ms: 1000 } }\n  - { type: probabilistic, probabilistic: { sampling_percentage: 5 } }', desc: 'Capture 100% de erros + 100% de slow + 5% do resto. Padrão SRE.' },
      ],
      mentalModels: [
        'OTel é a API; o backend (Tempo, Jaeger, Datadog) é só o destino — você troca o destino sem mexer em código',
        'TraceID é o mesmo em TODOS os serviços; SpanID é único por span; ParentSpanID forma a árvore',
        'Auto-instr cobre frameworks; spans manuais cobrem operações de negócio. Você precisa dos dois',
        'memory_limiter é o "fusível" do Collector — sem ele, OOM cega toda a observabilidade exatamente em pico de tráfego',
        'Tail sampling vê o resultado antes de decidir — única forma sã de capturar 100% de erros raros',
      ],
    },
  }),

  'quick-ref': () => buildQuickRefPdf({
    columns: QUICK_REF,
    skillName: 'OpenTelemetry',
    accentColor: C,
    stackLabel: 'OTel · Semantic Conventions',
    tagline: 'Os atributos padronizados que todo backend OTel entende',
  }),

  antipatterns: () => buildAntipatternsPdf({
    antipatterns: ANTI_PATTERNS,
    accentColor: C,
    skillName: 'OpenTelemetry',
    stackLabel: 'Observabilidade — CNCF Standard',
  }),

  comparative: () => buildComparativeRefPdf({
    options: COMP_OPTIONS,
    criteria: COMP_CRITERIA,
    skillName: 'OpenTelemetry — Estratégias de Sampling',
    accentColor: C,
    stackLabel: 'Sampling — Head, Tail, Parent',
    scenarios: [
      { scenario: 'Desenvolvimento e staging',                                recommendation: 'AlwaysOn',          reason: 'Volume gerenciável, debugging completo. Em dev nunca trace amostrado — sempre 100%.' },
      { scenario: 'Volume médio (100-10k/s) com erros frequentes (>1%)',     recommendation: 'TraceIdRatioBased', reason: 'Head sampling estateless, simples. 10% ainda capta amostra representativa de erros.' },
      { scenario: 'Microservices com propagação cross-team',                  recommendation: 'ParentBased',       reason: 'Coerência entre serviços — trace iniciado em A respeita decisão upstream em todos os hops.' },
      { scenario: 'Volume alto + erros raros (<0.1%) + budget para ops',     recommendation: 'Tail Sampling',     reason: 'Captura 100% de erros + slow + amostra do resto. Custo: Collector stateful com loadbalancing.' },
      { scenario: 'Desligar tracing num serviço pontualmente',                recommendation: 'AlwaysOff',         reason: 'Sem mexer em código — desativa via env var ou config. Útil em troubleshooting de overhead.' },
    ],
  }),
}

// ═══════════════════════════════════════════════════════════════════════════════
// Componente principal
// ═══════════════════════════════════════════════════════════════════════════════

export default function OpentelemetryPdfs() {
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
