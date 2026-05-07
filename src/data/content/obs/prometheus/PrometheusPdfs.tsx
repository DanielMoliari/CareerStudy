'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'
import { buildQuickRefPdf } from '@/components/pdfs/QuickRefPdf'
import type { QuickRefColumn } from '@/components/pdfs/QuickRefPdf'
import { buildMindmapPdf } from '@/components/pdfs/MindmapPdf'
import type { MindmapCategory } from '@/components/pdfs/MindmapPdf'

const C = '#E6522C'

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 15 perguntas de Prometheus mais cobradas em entrevista pleno/sênior',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: CHiGS, alta cardinalidade, multi-window burn rate, RED/USE, recording rules, Pushgateway, Thanos vs Mimir, irate vs rate — respostas em nível pleno/sênior com dicas de resposta.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'quick-ref',
    title: 'PromQL Quick Ref',
    subtitle: 'A4 paisagem — funções, agregações, alertas e padrões em 3 colunas',
    type: 'quick-ref',
    pages: 1,
    description: 'Cartão de bolso ultra-denso para o monitor: rate/irate/increase, histogram_quantile, sum by/without, absent, predict_linear, multi-window burn rate, RED/USE PromQL, dicas de instrumentação. Imprima e cole na mesa.',
    icon: '02',
    goal: 'Consulta rápida no terminal',
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'PromQL completo, tipos de métrica, alerta canônico e instrumentação Node.js',
    type: 'cheatsheet',
    pages: 2,
    description: 'Referência densa: CHiGS detalhado, regras de rate window, exemplo completo de PrometheusRule, multi-window burn rate, instrumentação prom-client em Node.js, mental models e armadilhas.',
    icon: '03',
    goal: 'Estudo aprofundado',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'CHiGS, RED·USE, multi-window AND — fixação cognitiva',
    type: 'mnemonics',
    pages: 2,
    description: 'Truques verbais para nunca mais errar tipo de métrica nem framework de alerta. CHiGS para PromQL, RED·USE para alvos de monitoramento, multi-window AND para alerting de SLO.',
    icon: '04',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'antipatterns',
    title: 'Antipatterns',
    subtitle: 'Os 6 erros mais frequentes em Prometheus em produção',
    type: 'antipatterns',
    pages: 4,
    description: 'Diff visual errado vs correto: Summary em vez de Histogram, alerta sem `for`, rate com janela curta, Counter decrementando, alta cardinalidade com user_id, alertar em CPU em vez de sintoma.',
    icon: '05',
    goal: 'Aprender com erros',
  },
  {
    id: 'mindmap',
    title: 'Mindmap',
    subtitle: 'Ecossistema Prometheus completo organizado por categorias',
    type: 'mindmap',
    pages: 2,
    description: 'Visão de ecossistema: tipos de métrica, PromQL, alerting, storage (Thanos, Mimir), exporters, service discovery, instrumentação. Inclui checklist de revisão pré-entrevista.',
    icon: '06',
    goal: 'Visão de ecossistema',
  },
]

// ── Q&A ──────────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    q: 'Como você calcularia o p99 de latência com Prometheus?',
    a: '<p>Instrumentar com <strong>Histogram</strong> (não Summary — Summary não permite agregação entre instâncias). Definir buckets baseados no SLA: se o SLA é 500ms, inclua buckets <code>[0.05, 0.1, 0.25, 0.5, 1, 2.5, 5]</code> segundos — o bucket imediatamente acima do SLA precisa estar presente para capturar violações sem extrapolação.</p><p>A query: <code>histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service))</code>. O <code>by (le)</code> é obrigatório — sem ele a query retorna erro. O <code>by (service)</code> permite ver o p99 por serviço.</p>',
    tip: 'Mencionar os buckets e o motivo do "le" no by() diferencia quem usou de quem só sabe a teoria.',
    level: 'Pleno',
  },
  {
    q: 'Qual a diferença entre Counter e Gauge? Dê exemplos concretos.',
    a: '<p><strong>Counter:</strong> valor monotonicamente crescente, nunca diminui em runtime (exceto reset de processo). Use <code>rate()</code> para análise. Exemplos: <code>http_requests_total</code>, <code>errors_total</code>, <code>bytes_sent_total</code>, <code>pagamentos_processados_total</code>.</p><p><strong>Gauge:</strong> representa estado atual, pode subir e descer. Use diretamente ou com <code>avg_over_time()</code>. Exemplos: <code>connections_active</code>, <code>memory_used_bytes</code>, <code>queue_depth</code>, <code>cpu_temperature</code>, <code>goroutines_active</code>.</p><p>Erro comum: usar Gauge para o que deveria ser Counter (ex: "taxa de pedidos por minuto" armazenada como Gauge em vez de <code>pedidos_total</code> Counter) — perde a capacidade de calcular taxa histórica com <code>rate()</code>.</p>',
    tip: 'Dar exemplos de negócio (pedidos, pagamentos) em vez de só exemplos técnicos (requests, bytes) mostra que você pensa como engenheiro de produto.',
    level: 'Pleno',
  },
  {
    q: 'O que é alta cardinalidade e por que destrói o Prometheus?',
    a: '<p>Cardinalidade = número de séries temporais únicas = produto de valores únicos de todas as labels de uma métrica. Exemplo: 100 services × 10 methods × 50 status codes = 50.000 séries para uma métrica.</p><p>Labels problemáticas: <code>user_id</code> (10M usuários = 10M séries por métrica), <code>request_id</code> (infinito), IP de cliente, URL completa com query params variáveis. O TSDB do Prometheus mantém cada série em memória (head chunks) e em disco — alta cardinalidade explode memória, CPU de ingestion e tempo de query.</p><p><strong>Regra prática:</strong> nunca mais que ~1000 valores únicos por label.</p>',
    tip: 'Quantificar o produto das cardinalidades (100 × 10 × 50 = 50.000) impressiona mais que dizer abstratamente "evite alta cardinalidade".',
    level: 'Senior',
  },
  {
    q: 'Explique o mnemônico CHiGS e como ele guia a escolha de PromQL.',
    a: '<p><strong>CHiGS</strong> = Counter→<code>rate()</code>, Histogram→<code>histogram_quantile()</code>, Gauge→direto, Summary→evitar.</p><ul><li><strong>Counter</strong> é cumulativo e só cresce — <code>rate()</code> converte o acumulado em taxa por segundo e corrige resets automáticos.</li><li><strong>Histogram</strong> distribui valores em buckets — <code>histogram_quantile()</code> calcula percentis no servidor, permitindo agregar instâncias.</li><li><strong>Gauge</strong> representa estado atual — use direto (ou <code>avg_over_time</code> para suavizar).</li><li><strong>Summary</strong> já calculou percentis no cliente — use diretamente, mas nunca tente <code>sum()</code> de percentis entre instâncias (matematicamente inválido).</li></ul>',
    level: 'Pleno',
    tip: 'CHiGS é o mnemônico mais útil de Prometheus — sempre o mencione para mostrar maturidade conceitual.',
  },
  {
    q: 'O que é multi-window burn rate e por que é superior a um threshold simples?',
    a: '<p>Threshold simples (ex: error rate > 1% em 5m) tem dois problemas: muito sensível a spikes curtos (falso positivo) ou muito lento para detectar degradação gradual (false negative).</p><p>Multi-window burn rate resolve com duas janelas: <strong>curta (1h)</strong> detecta problemas sérios rápido, <strong>longa (6h)</strong> confirma que não é spike. Burn rate: taxa real / taxa esperada. Burn rate 14 com SLO 99,9% = budget mensal esgota em ~2 dias.</p><p><strong>Alerta crítico</strong> dispara apenas quando AMBAS as janelas excedem o threshold — reduz falsos positivos sem atrasar alertas reais.</p>',
    tip: 'Calcular "budget esgota em X dias" com o número concreto (burn rate 14 = 2 dias para SLO 99,9%) impressiona em entrevistas de SRE.',
    level: 'Senior',
  },
  {
    q: 'Como você escalaria Prometheus para múltiplos clusters Kubernetes?',
    a: '<p>Prometheus local não escala para multi-cluster — sem replicação, sem query federada, retenção limitada. Opções:</p><ul><li><strong>Thanos</strong>: sidecar por cluster envia blocos para object storage (S3/GCS), Thanos Query agrega e deduplica.</li><li><strong>Grafana Mimir</strong>: compatível com Prometheus <code>remote_write</code> API, horizontalmente escalável, multi-tenant, desenvolvido pela Grafana Labs.</li></ul><p><strong>Abordagem prática com Thanos</strong>: kube-prometheus-stack em cada cluster com Thanos sidecar habilitado, Thanos Query centralizado fora dos clusters, Thanos Store Gateway para acesso a dados históricos no object storage.</p>',
    level: 'Senior',
    tip: 'Mencionar Mimir como alternativa moderna mostra que você acompanha o ecossistema, não está preso a Thanos.',
  },
  {
    q: 'O que são recording rules e qual a convenção de nomenclatura correta?',
    a: '<p>Recording rules pré-computam expressões PromQL e salvam o resultado como nova série temporal, avaliadas periodicamente (padrão 1m). Use para:</p><ul><li>Dashboards que repetem a mesma query cara (recording rule torna instantânea)</li><li>SLIs derivados de counters (<code>sli:http_availability:ratio30d</code>)</li><li>Alertas sobre queries complexas (mais eficiente)</li></ul><p>Convenção da comunidade: <code>level:metric:operation</code> — ex: <code>job:http_requests:rate5m</code> (agregado por job, métrica http_requests, janela 5m), <code>service:error_rate:ratio5m</code>. O nível indica a granularidade de agregação: cluster &gt; service &gt; job &gt; instance.</p>',
    tip: 'Mencionar a convenção de nomenclatura e explicar o que cada parte significa mostra que você conhece práticas de operação profissional.',
    level: 'Pleno',
  },
  {
    q: 'Como você estruturaria alertas para evitar alert fatigue?',
    a: '<ol><li>Use <code>for:</code> de 2m a 10m — spikes momentâneos não disparam.</li><li>Alerte sobre <strong>sintomas</strong> (error rate, latência), não causas (CPU 90%) — CPU alta pode não afetar o usuário.</li><li>Multi-window burn rate para SLOs — reduz falsos positivos.</li><li>Grouping no Alertmanager: 10 pods com erro = 1 notificação, não 10.</li><li>Inhibition: se ServiceDown dispara, inibe alertas de ErrorRate do mesmo serviço.</li><li><code>severity=page</code> (PagerDuty) apenas para violações de SLO reais.</li><li>Dead man\'s switch: alerta que dispara se o Prometheus sumir.</li><li>Revisão mensal de alertas silenciados — se silenciado &gt; 30 dias, o alerta não tem valor.</li></ol>',
    level: 'Senior',
    tip: 'A frase "alerte em sintomas, não em causas" é o princípio de SRE que mais separa pleno de sênior.',
  },
  {
    q: 'Qual a diferença entre irate() e rate()? Quando usar cada um?',
    a: '<p><strong>rate(counter[5m])</strong>: média da taxa ao longo da janela inteira, suaviza variações. Requer intervalo &gt; 4× o scrape_interval (scrape 15s → mínimo 60s). Ideal para dashboards e maioria dos alertas.</p><p><strong>irate(counter[5m])</strong>: taxa calculada a partir apenas dos últimos 2 pontos da janela — muito mais reativo a mudanças súbitas. Use irate para: alertas de spike instantâneo (ex: erro súbito de 100% por 30s), debugging de comportamento momentâneo. Evite irate em dashboards de tendência — muito ruidoso.</p><p>A janela em <code>irate</code> serve só para encontrar os pontos (lookback), não para média.</p>',
    level: 'Senior',
    tip: 'Mencione a regra do "range >= 4x scrape_interval" para mostrar que entende o detalhe operacional do rate().',
  },
  {
    q: 'O que é o Pushgateway e quando você o usaria?',
    a: '<p>Pushgateway é um intermediário que recebe métricas por <strong>push</strong> e as expõe para o Prometheus scrapar. Criado para batch jobs, cron jobs e funções que terminam antes do próximo scrape do Prometheus.</p><p><strong>Como funciona:</strong> o job envia métricas (<code>POST /metrics/job/nome</code>) ao terminar, o Prometheus faz scrape do Pushgateway normalmente. <strong>Cuidado:</strong> métricas persistem no Pushgateway mesmo após o job terminar — precisam ser deletadas manualmente (<code>DELETE /metrics/job/nome</code>).</p><p><strong>Não use para serviços de longa duração</strong> — use o scraping normal. Para múltiplos pods/workers, use grouping keys (job + instance) para evitar conflito.</p>',
    tip: 'Mencionar que métricas "ficam" no Pushgateway após o job terminar é o gotcha mais importante — mostra experiência operacional.',
    level: 'Pleno',
  },
  {
    q: 'Como diagnosticaria uma "cardinality explosion" em produção?',
    a: '<p><strong>Sintomas:</strong> Prometheus com alta memória (&gt; 2-4GB para poucas séries), queries lentas, TSDB crescendo &gt; 1GB/dia.</p><p><strong>Diagnóstico:</strong></p><ol><li>Prometheus <code>/tsdb-status</code> → mostra top 10 métricas com mais séries.</li><li><code>/api/v1/label/nome_label/values</code> → conta valores únicos de uma label específica.</li><li>Grafana: painel de series cardinality.</li></ol><p><strong>Mitigação:</strong> <code>relabel_configs</code> no scraping para dropar labels problemáticas antes de salvar (<code>action: drop</code>). Recording rules para pré-agregar e eliminar dimensões de alta cardinalidade. Se for uma label adicionada recentemente por deploy: rollback ou remove a label urgente.</p>',
    level: 'Senior',
    tip: 'Diferenciar diagnóstico (/tsdb-status) de mitigação (relabel_configs) mostra que você sabe operar Prometheus em produção, não só configurar.',
  },
  {
    q: 'Como os frameworks RED e USE se complementam para alertas?',
    a: '<p><strong>RED (para serviços HTTP/gRPC):</strong> Rate (req/s), Errors (taxa de 5xx), Duration (latência p99). Cobre o que o usuário sente diretamente.</p><p><strong>USE (para recursos de infraestrutura):</strong> Utilization (% de uso de CPU, disco), Saturation (fila de tarefas, run queue), Errors (erros de hardware, I/O). Cobre o que pode causar degradação.</p><p><strong>Estratégia:</strong> alerte APENAS em RED — são sintomas. Investigue a causa raiz com USE — CPU, memória, I/O. Nunca acorde alguém às 3h por CPU 90% sem evidência de impacto no usuário (latência alta ou error rate).</p>',
    level: 'Pleno',
    tip: 'A frase canônica "alerte em sintomas, investigue em causas" mostra que você entendeu o princípio do SRE Workbook.',
  },
  {
    q: 'Como funcionam as inhibition rules do Alertmanager?',
    a: '<p>Inhibition rules evitam alertas secundários (sintomas) quando a causa raiz já está alertada. Exemplo: se <code>ServiceDown</code> está firing para <code>service=\'pagamentos\'</code>, inibe <code>ErrorRateAlto</code> e <code>LatenciaAlta</code> do mesmo serviço — você já sabe que está down, as outras métricas são consequência óbvia.</p><p><strong>Configuração:</strong> <code>source_matchers</code> (a causa raiz), <code>target_matchers</code> (os alertas a suprimir), <code>equal</code> (labels que devem coincidir, ex: service).</p><p>Sem inhibition: um cluster down gera 50 alertas simultâneos — com inhibition: 1 alerta de ServiceDown + silêncio nos demais.</p>',
    tip: 'Dar o exemplo concreto (cluster down = 50 alertas → 1 com inhibition) torna a explicação muito mais concreta.',
    level: 'Senior',
  },
  {
    q: 'Por que Summary não pode ser agregado entre instâncias?',
    a: '<p>Summary calcula percentis dentro do processo cliente antes de expor no <code>/metrics</code>. O p99 de uma instância é calculado independentemente das outras.</p><p>Matematicamente, você não pode combinar percentis pré-calculados: <code>p99(A) + p99(B) / 2 ≠ p99(A+B)</code>. Para calcular o p99 global de 5 pods com Summary, você precisaria do dado bruto de todas as requisições — que já foi descartado após o cálculo do percentil.</p><p>Histogram resolve isso: os buckets são contadores acumulativos que podem ser somados entre instâncias, e então <code>histogram_quantile()</code> calcula o percentil correto sobre o conjunto agregado.</p>',
    level: 'Senior',
    tip: 'Citar o argumento matemático (p99(A) + p99(B) / 2 ≠ p99(A+B)) impressiona — não é só "não funciona", é por que não pode funcionar.',
  },
  {
    q: 'Como configuraria alertas para os Four Golden Signals?',
    a: '<p>Four Golden Signals do Google SRE:</p><ol><li><strong>Latência:</strong> <code>histogram_quantile(0.99, ...)</code> &gt; SLA — alertar em p99 acima do SLO.</li><li><strong>Tráfego:</strong> <code>sum(rate(requests_total[5m]))</code> — baseline, não alertar diretamente (queda pode ser alerta).</li><li><strong>Erros:</strong> <code>sum(rate(errors[5m]))/sum(rate(requests[5m])) &gt; 0.01</code> — alerta crítico em taxa de erro acima do error budget.</li><li><strong>Saturação:</strong> utilização de CPU, memória, disco, filas — alertar em saturação alta com <code>predict_linear</code> para antecipar esgotamento.</li></ol><p>Os quatro juntos cobrem praticamente todos os problemas que afetam usuários.</p>',
    level: 'Senior',
    tip: 'Mencione que "queda de tráfego pode ser alerta" — alertar em queda de RPS detecta quando o load balancer está mandando tráfego para o lugar errado.',
  },
]

// ── Mnemônicos ────────────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'CHiGS — tipos de métrica e PromQL',
    trick: 'Counter → rate(), Histogram → histogram_quantile(), Gauge → direto, Summary → evitar',
    expansion: [
      ['C', 'Counter → rate()'],
      ['Hi', 'Histogram → histogram_quantile()'],
      ['G', 'Gauge → direto'],
      ['S', 'Summary → evitar'],
    ],
    explanation: 'Cada tipo de métrica tem uma função PromQL natural. Counter acumula → rate() dá a taxa. Histogram distribui em buckets → histogram_quantile() dá percentil agregável. Gauge é estado atual → use direto ou avg_over_time(). Summary já calculou no cliente → leia diretamente, mas nunca tente sum() de percentis entre instâncias (matematicamente inválido).',
    example: 'Latência: nunca use Summary; sempre Histogram com buckets baseados no SLA. Conexões ativas: Gauge (sobe e desce). Pedidos processados: Counter (sempre cresce, use rate(pedidos_total[5m])).',
    why: 'Errar o tipo de métrica produz análises completamente erradas. rate() num Gauge não faz sentido semântico. sum() num Summary entre instâncias retorna um número sem significado matemático.',
  },
  {
    label: 'RED · USE — o que monitorar e o que alertar',
    trick: 'RED para serviços (Rate, Errors, Duration). USE para recursos (Utilization, Saturation, Errors).',
    expansion: [
      ['R', 'Rate — req/s'],
      ['E', 'Errors — taxa de 5xx'],
      ['D', 'Duration — latência p99'],
      ['U', 'Utilization — % de uso'],
      ['S', 'Saturation — fila/backlog'],
      ['E', 'Errors — falhas de hardware'],
    ],
    explanation: 'RED cobre o que o usuário sente — alvos de alertas. USE cobre causas de infraestrutura — alvos de investigação após alerta de RED. Nunca alerte em USE sem correlação com RED.',
    example: 'Alerta válido: error_rate > 1% em 5m (RED). Alerta inválido: cpu > 90% em 5m (USE) — pode ser comportamento normal de sistema otimizado e não afeta usuário.',
    why: 'Alertar em causas (CPU, memória) sem evidência de impacto no usuário gera alert fatigue. Use o RED para acordar SRE; use o USE para diagnosticar a causa raiz.',
  },
  {
    label: 'Multi-window AND — janela curta E longa',
    trick: 'Janela curta detecta, janela longa confirma. Alerta só quando AMBAS excedem o threshold.',
    expansion: [
      ['1h', 'janela curta — detecta rápido'],
      ['AND', 'condição precisa valer nos dois'],
      ['6h', 'janela longa — confirma tendência'],
    ],
    explanation: 'Uma janela de 1h dispara rápido mas pode ser spike momentâneo (falso positivo). Uma janela de 6h confirma que é tendência sustentada. Exigir ambas (AND) reduz falsos positivos sem atrasar alertas reais.',
    example: 'Spike de 5min no deploy: 1h captura (25× burn), mas 6h dilui (2.8×) → multi-window AND não dispara → sem falso alarme. Incidente real: ambas as janelas mostram burn alto → page imediato.',
    why: 'Single-window 1h gera falsos positivos em qualquer spike de deploy. Single-window 6h demora demais para detectar incidente sério. AND das duas é o melhor dos mundos — rapidez + precisão.',
  },
  {
    label: '14·6·3·1 — os 4 alertas do SRE Workbook',
    trick: 'Burn rate 14× → 2 dias, 6× → 5 dias, 3× → 10 dias, 1× → 30 dias',
    expansion: [
      ['14×', 'page crítico (esgota em 2 dias)'],
      ['6×', 'page lento (esgota em 5 dias)'],
      ['3×', 'ticket urgente (esgota em 10 dias)'],
      ['1×', 'ticket info (esgota no mês exato)'],
    ],
    explanation: 'Quatro burn rates cobrem todos os horizontes de esgotamento de error budget. Cada um tem um par de janelas (curta + longa) e severity diferente.',
    example: 'SLO 99.9% (budget 0.1%): error rate de 1.4% = burn 14× = page crítico (esgota mês em 2 dias). Error rate de 0.6% = burn 6× = page mais lento. Error rate de 0.3% = burn 3× = ticket urgente.',
    why: 'A cobertura completa em todas as escalas de tempo evita que degradação lenta passe despercebida e que spikes curtos gerem falsos positivos. É o modelo canônico do SRE Workbook do Google.',
  },
]

// ── Antipatterns ──────────────────────────────────────────────────────────────

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'Summary em vez de Histogram para latência',
    badDesc: 'Summary calcula percentil no cliente — não permite agregar p99 entre instâncias.',
    badCode: [
      { t: 'const latency = new Summary({\n', c: '#e2e8f0' },
      { t: "  name: 'http_duration_seconds',\n", c: '#ef4444' },
      { t: '  percentiles: [0.5, 0.95, 0.99],\n', c: '#ef4444' },
      { t: '})\n', c: '#e2e8f0' },
      { t: '// p99 dos pods não pode ser somado!', c: '#64748b' },
    ],
    goodDesc: 'Histogram com buckets cumulativos permite agregar via histogram_quantile().',
    goodCode: [
      { t: 'const latency = new Histogram({\n', c: '#e2e8f0' },
      { t: "  name: 'http_duration_seconds',\n", c: '#22c55e' },
      { t: '  buckets: [0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],\n', c: '#22c55e' },
      { t: '})\n', c: '#e2e8f0' },
      { t: '// histogram_quantile agrega entre pods', c: '#64748b' },
    ],
    why: 'Você não pode somar percentis pré-calculados — matematicamente p99(A)+p99(B)/2 ≠ p99(A+B). Histogram tem buckets cumulativos que podem ser somados entre instâncias antes do cálculo do percentil. Sempre Histogram para latência distribuída.',
  },
  {
    title: 'Alerta sem cláusula for',
    badDesc: 'Sem for: o alerta dispara em qualquer spike momentâneo (1 minuto).',
    badCode: [
      { t: '- alert: ErrorRateAlto\n', c: '#ef4444' },
      { t: '  expr: rate(errors_total[5m]) > 0.01\n', c: '#e2e8f0' },
      { t: '  # SEM for: dispara em qualquer pico\n', c: '#64748b' },
      { t: '  labels: { severity: critical }', c: '#e2e8f0' },
    ],
    goodDesc: 'Com for: o alerta exige que a condição persista — filtra spikes momentâneos.',
    goodCode: [
      { t: '- alert: ErrorRateAlto\n', c: '#22c55e' },
      { t: '  expr: rate(errors_total[5m]) > 0.01\n', c: '#e2e8f0' },
      { t: '  for: 5m   # condição precisa persistir\n', c: '#22c55e' },
      { t: '  labels: { severity: critical }', c: '#e2e8f0' },
    ],
    why: 'Spikes momentâneos sem for: geram alert fatigue em menos de uma semana. Use for: de 2-10min dependendo da urgência. Para SLOs, multi-window burn rate é ainda melhor — janela curta E longa precisam concordar.',
  },
  {
    title: 'rate() com janela menor que 4× scrape_interval',
    badDesc: 'Janela menor que 4× scrape_interval gera NaN ou taxas instáveis.',
    badCode: [
      { t: '# scrape_interval = 15s\n', c: '#64748b' },
      { t: 'rate(http_requests_total[30s])\n', c: '#ef4444' },
      { t: '# 30s / 15s = 2 pontos -> instável', c: '#64748b' },
    ],
    goodDesc: 'Janela ≥ 4× scrape_interval garante taxa estável.',
    goodCode: [
      { t: '# Regra: range >= 4x scrape_interval\n', c: '#64748b' },
      { t: 'rate(http_requests_total[1m])    # mínimo\n', c: '#22c55e' },
      { t: 'rate(http_requests_total[5m])    # ideal', c: '#22c55e' },
    ],
    why: 'rate() precisa de pelo menos 4 pontos para calcular taxa estável. Com scrape_interval de 15s, janela mínima é 60s. Janelas menores produzem NaN ou taxas instáveis pois o Prometheus não consegue interpolar com confiança.',
  },
  {
    title: 'Counter que decrementa',
    badDesc: 'Counter só cresce. Decrementar quebra rate() e produz valores negativos.',
    badCode: [
      { t: 'const sessions = new Counter({ name: "active_sessions" })\n', c: '#ef4444' },
      { t: 'sessions.inc()  // login\n', c: '#e2e8f0' },
      { t: 'sessions.dec()  // ERRO: Counter não decrementa', c: '#ef4444' },
    ],
    goodDesc: 'Estado atual = Gauge. Sobe e desce normalmente.',
    goodCode: [
      { t: 'const sessions = new Gauge({ name: "active_sessions" })\n', c: '#22c55e' },
      { t: 'sessions.inc()  // login\n', c: '#e2e8f0' },
      { t: 'sessions.dec()  // logout — Gauge sobe e desce', c: '#22c55e' },
    ],
    why: 'Counter só cresce em runtime (só reseta no restart do processo, e o Prometheus detecta o reset). Se a métrica pode diminuir naturalmente (sessões ativas, conexões abertas, tamanho da fila), é um Gauge — não Counter.',
  },
  {
    title: 'Alta cardinalidade com user_id como label',
    badDesc: '10M usuários únicos = 10M séries temporais por métrica. TSDB explode.',
    badCode: [
      { t: 'http_requests.inc({\n', c: '#e2e8f0' },
      { t: '  method: req.method,\n', c: '#e2e8f0' },
      { t: '  user_id: req.user.id,    // PROIBIDO\n', c: '#ef4444' },
      { t: '  request_id: req.id,      // PROIBIDO\n', c: '#ef4444' },
      { t: '})', c: '#e2e8f0' },
    ],
    goodDesc: 'Labels com baixa cardinalidade (< 1000 valores únicos cada).',
    goodCode: [
      { t: 'http_requests.inc({\n', c: '#e2e8f0' },
      { t: '  method: req.method,\n', c: '#22c55e' },
      { t: '  status: String(res.statusCode),\n', c: '#22c55e' },
      { t: '  route: req.route.path,   // template, não path real\n', c: '#22c55e' },
      { t: '})\n', c: '#e2e8f0' },
      { t: '// user_id, request_id -> logs/traces, não métricas', c: '#64748b' },
    ],
    why: 'Cada combinação única de labels é uma série no TSDB (~3KB de RAM). user_id com 10M valores destrói o Prometheus. Para identificadores únicos, use logs estruturados ou traces — eles são otimizados para alta cardinalidade.',
  },
  {
    title: 'Alertar em CPU/memória em vez de sintoma',
    badDesc: 'CPU 90% pode ser comportamento normal — acorda SRE sem evidência de impacto.',
    badCode: [
      { t: '- alert: CPUAlta\n', c: '#ef4444' },
      { t: '  expr: cpu_usage > 0.9\n', c: '#e2e8f0' },
      { t: '  for: 5m\n', c: '#e2e8f0' },
      { t: '  # Acorda SRE às 3h sem evidência de UX', c: '#64748b' },
    ],
    goodDesc: 'Alerte em sintomas (RED). Use CPU/memória para diagnosticar a causa.',
    goodCode: [
      { t: '- alert: SLOBurnRateCritico\n', c: '#22c55e' },
      { t: '  expr: |\n', c: '#e2e8f0' },
      { t: '    sli:availability:rate1h < (1 - 14*0.001) and\n', c: '#22c55e' },
      { t: '    sli:availability:rate6h < (1 - 14*0.001)\n', c: '#22c55e' },
      { t: '  for: 2m\n', c: '#e2e8f0' },
      { t: '  # CPU/memória só para investigar causa', c: '#64748b' },
    ],
    why: 'Alerte em sintomas (error rate, latência, burn rate de SLO) — o que o usuário sente. Use métricas USE (CPU, memória, disco) para diagnóstico após o alerta de RED disparar. Nunca acorde alguém pelo USE sem RED correlato.',
  },
]

// ── PromQL Quick Ref (A4 paisagem, 3 colunas) ────────────────────────────────

const QUICK_REF_COLUMNS: QuickRefColumn[] = [
  {
    sections: [
      {
        title: 'Counters — taxa',
        entries: [
          { key: 'rate(c[5m])',    value: 'taxa/s média na janela; corrige resets' },
          { key: 'irate(c[5m])',   value: 'taxa instantânea (últimos 2 pts); reativo' },
          { key: 'increase(c[1h])', value: 'total acumulado na janela; corrige resets' },
          { key: 'resets(c[30m])', value: 'qtde de resets do counter no período' },
          { key: 'min range',      value: 'janela ≥ 4× scrape_interval' },
        ],
      },
      {
        title: 'Histogram — percentis',
        entries: [
          { key: 'histogram_quantile(.99, ...)', value: 'percentil agregável' },
          { key: 'sum(rate(b[5m])) by (le, svc)', value: 'sempre by (le)' },
          { key: 'buckets',        value: 'inclua bucket logo acima do SLO' },
          { key: 'native v2 (>=2.40)', value: 'rate() direto, sem _bucket' },
        ],
      },
      {
        title: 'Agregação',
        entries: [
          { key: 'sum by (svc)',    value: 'agrega POR labels' },
          { key: 'sum without (i)', value: 'agrega EXCETO labels' },
          { key: 'topk(5, m)',      value: 'top 5 séries' },
          { key: 'bottomk(5, m)',   value: 'bottom 5 séries' },
          { key: 'avg/min/max/count', value: 'agregadores básicos' },
          { key: 'group by (svc)',  value: 'mantém apenas labels listadas' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Detecção e predição',
        entries: [
          { key: 'absent(up{job="api"})',   value: 'série sumiu — alerta robusto' },
          { key: 'predict_linear(d[6h], 4*3600)', value: 'previsão linear (em 4h)' },
          { key: 'changes(c[1h])',          value: 'qtde de mudanças do valor' },
          { key: 'deriv(g[10m])',           value: 'derivada de gauge' },
          { key: 'time()',                  value: 'unix timestamp atual' },
          { key: 'vector(0)',               value: 'instant vector com valor 0' },
        ],
      },
      {
        title: 'Operadores e modificadores',
        entries: [
          { key: 'metric @ 1700000000', value: 'valor em timestamp específico' },
          { key: 'metric offset 1h',    value: 'valor 1h atrás' },
          { key: 'and / or / unless',   value: 'set operators entre vetores' },
          { key: 'on(svc) / ignoring',  value: 'matching por labels' },
          { key: 'group_left/right',    value: 'many-to-one joins' },
        ],
      },
      {
        title: 'Selectors',
        entries: [
          { key: '{job="api"}',     value: 'igualdade exata' },
          { key: '{status=~"5.."}', value: 'regex match' },
          { key: '{env!~"prod.*"}', value: 'regex não-match' },
          { key: '{__name__=~"x"}',  value: 'match no nome da métrica' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Alerts canônicos',
        entries: [
          { key: 'for: 5m',                value: 'condição persiste antes de disparar' },
          { key: 'severity: critical',      value: 'page (PagerDuty)' },
          { key: 'severity: warning',       value: 'ticket / Slack' },
          { key: 'runbook_url',            value: 'sempre incluir nas annotations' },
          { key: '{{ $value | humanizePct }}', value: 'formatar valor na anotação' },
        ],
      },
      {
        title: 'Multi-window burn rate (SLO 99.9%)',
        entries: [
          { key: '14× / 1h+5m',    value: 'page crítico (esgota em 2 dias)' },
          { key: '6× / 6h+30m',   value: 'page lento (esgota em 5 dias)' },
          { key: '3× / 1d+2h',    value: 'ticket urgente (10 dias)' },
          { key: '1× / 3d+6h',    value: 'ticket info (mês exato)' },
        ],
      },
      {
        title: 'RED / USE',
        entries: [
          { key: 'Rate',      value: 'sum(rate(req[5m])) by (svc)' },
          { key: 'Errors',    value: 'rate(req{status=~"5.."}[5m])/total' },
          { key: 'Duration',  value: 'histogram_quantile(.99, ...)' },
          { key: 'Util CPU',  value: '1 - rate(cpu{mode="idle"}[5m])' },
          { key: 'Saturation', value: 'queue_depth / queue_capacity' },
        ],
      },
      {
        title: 'Recording rules',
        entries: [
          { key: 'level:metric:operation', value: 'convenção de nome' },
          { key: 'job:http_errors:rate5m', value: 'agregado por job' },
          { key: 'sli:availability:ratio30d', value: 'SLI rolling 30d' },
        ],
      },
    ],
  },
]

// ── Mindmap ───────────────────────────────────────────────────────────────────

const MINDMAP_CATEGORIES: MindmapCategory[] = [
  {
    label: 'Tipos de métrica (CHiGS)',
    color: '#E6522C',
    items: [
      { t: 'Counter', k: true },
      { t: 'Histogram', k: true },
      { t: 'Gauge', k: true },
      { t: 'Summary (evitar)', a: true },
      { t: 'rate()', k: true },
      { t: 'histogram_quantile()', k: true },
      { t: 'native histograms (v2.40+)', a: true },
    ],
  },
  {
    label: 'PromQL',
    color: '#c084fc',
    items: [
      { t: 'instant vector', k: true },
      { t: 'range vector', k: true },
      { t: 'rate vs irate vs increase', k: true },
      { t: 'sum by / without', k: true },
      { t: 'topk / bottomk' },
      { t: 'absent()', k: true },
      { t: 'predict_linear()', a: true },
      { t: 'offset / @ modifier', a: true },
      { t: 'group_left/right', a: true },
      { t: 'label_replace()', a: true },
    ],
  },
  {
    label: 'Coleta e descoberta',
    color: '#38bdf8',
    items: [
      { t: 'pull model (/metrics)', k: true },
      { t: 'scrape_interval (15s)', k: true },
      { t: 'kubernetes_sd_config', k: true },
      { t: 'relabel_configs', k: true },
      { t: 'OpenMetrics format' },
      { t: 'Pushgateway (jobs curtos)', a: true },
      { t: 'exporters (node, blackbox, etc)' },
    ],
  },
  {
    label: 'Alerting',
    color: '#ef4444',
    items: [
      { t: 'alerting rules + for:', k: true },
      { t: 'Alertmanager: routing', k: true },
      { t: 'grouping', k: true },
      { t: 'inhibition', a: true },
      { t: 'silencing' },
      { t: 'multi-window burn rate', a: true },
      { t: '14·6·3·1', a: true },
      { t: 'PagerDuty / Slack / OpsGenie' },
      { t: 'dead man\'s switch', a: true },
    ],
  },
  {
    label: 'Storage e escala',
    color: '#22c55e',
    items: [
      { t: 'TSDB local (15d)', k: true },
      { t: 'remote_write', a: true },
      { t: 'Thanos sidecar + S3', a: true },
      { t: 'Grafana Mimir (multi-tenant)', a: true },
      { t: 'recording rules', k: true },
      { t: 'WAL + head + blocks 2h' },
      { t: 'compaction' },
    ],
  },
  {
    label: 'Frameworks',
    color: '#fbbf24',
    items: [
      { t: 'RED (servicos)', k: true },
      { t: 'USE (recursos)', k: true },
      { t: 'Four Golden Signals', k: true },
      { t: 'SLO + error budget', a: true },
      { t: 'cardinality budget', a: true },
    ],
  },
]

const MINDMAP_CHECKLIST = [
  'Sei explicar o que cada tipo de métrica representa (CHiGS) e qual PromQL usar para cada',
  'Sei calcular p99 com Histogram (incluindo o by (le) obrigatório)',
  'Sei explicar por que Summary não agrega entre instâncias',
  'Sei identificar e mitigar alta cardinalidade (relabel_configs, recording rules)',
  'Sei estruturar alertas com for: e severity (RED em vez de USE)',
  'Sei configurar multi-window burn rate alerts (1h AND 6h)',
  'Sei explicar grouping, inhibition e silencing no Alertmanager',
  'Sei quando usar Thanos vs Grafana Mimir vs Prometheus local',
  'Sei diferenciar rate() vs irate() e sei a regra do 4× scrape_interval',
  'Sei usar Pushgateway para batch jobs e seu gotcha (não deleta automático)',
  'Sei aplicar a convenção level:metric:operation em recording rules',
  'Sei calcular error budget e burn rate para um SLO específico',
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Prometheus',
    stackLabel: 'Observabilidade · CNCF',
  }),
  'quick-ref': () => buildQuickRefPdf({
    columns: QUICK_REF_COLUMNS,
    skillName: 'Prometheus — PromQL Quick Ref',
    accentColor: C,
    stackLabel: 'Cartão de bolso',
    tagline: 'PromQL e padrões de alerting em uma página A4',
    version: 'v2.x',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'Prometheus',
    accentColor: C,
    stackLabel: 'Observabilidade · CNCF',
    sections: {
      hooks: [
        { name: 'Counter', sig: 'monotonicamente crescente — só sobe', desc: 'Use para totais acumulados (requests, errors, bytes). Análise: rate() para taxa, increase() para total na janela. NUNCA decremente — se sobe e desce, é Gauge.' },
        { name: 'Histogram', sig: 'buckets cumulativos + sum + count', desc: 'Use para latência e tamanho de resposta. Inclua bucket logo acima do SLO. histogram_quantile(0.99, sum(rate(b[5m])) by (le, svc)) para p99 agregável entre instâncias.' },
        { name: 'Gauge', sig: 'sobe e desce — estado atual', desc: 'Use para estado instantâneo (memória, conexões, fila). Análise: direto ou avg_over_time(). Não use rate() em Gauge — não faz sentido semântico.' },
        { name: 'Summary', sig: 'percentis pré-calculados no cliente', desc: 'EVITE — não pode ser agregado entre instâncias (matematicamente p99(A)+p99(B)/2 ≠ p99(A+B)). Sempre prefira Histogram para latência distribuída.' },
        { name: 'Recording Rule', sig: 'level:metric:operation', desc: 'Pré-computa expressão PromQL como nova série. Use para queries caras em dashboards, SLIs derivados de counters, alertas sobre queries complexas. Avaliada periodicamente (1m default).' },
        { name: 'Alerting Rule + for:', sig: 'expr + for: + labels + annotations', desc: 'Sempre use for: de 2-10min para evitar alert fatigue. severity=critical para page, warning para ticket. Inclua runbook_url nas annotations — facilita resposta a incidentes.' },
      ],
      depRows: [
        ['rate window', '≥ 4× scrape_interval (scrape 15s → 60s mínimo)'],
        ['cardinalidade', '< 1000 valores únicos por label'],
        ['Histogram bucket', 'logo acima do SLO (SLO 500ms → bucket 0.5, 1.0)'],
        ['scrape_interval', '15s default — base de todos os ranges'],
        ['evaluation_interval', '1m default — frequência de recording/alerting rules'],
        ['retention local', '15 dias default — long-term via Thanos/Mimir'],
      ],
      rules: [
        { ok: true, t: 'Histogram para latência (não Summary) — agregável entre pods' },
        { ok: true, t: 'rate() em Counter, histogram_quantile() em Histogram, direto em Gauge' },
        { ok: true, t: 'sempre for: nos alertas — 2-10min dependendo da urgência' },
        { ok: true, t: 'alertar em sintomas (RED), investigar em recursos (USE)' },
        { ok: true, t: 'multi-window burn rate AND para SLOs' },
        { ok: true, t: 'recording rules para queries caras repetidas + SLIs' },
        { ok: false, t: 'NUNCA: user_id, request_id, IP, URL completa como label' },
        { ok: false, t: 'NUNCA: Counter que decrementa em runtime' },
        { ok: false, t: 'NUNCA: rate() com janela < 4× scrape_interval' },
      ],
      performanceTips: [
        'Cardinalidade alta = morte do Prometheus. ~3KB de RAM por série. 1M de séries = 3GB só de head chunks.',
        'Histogram com bucket fora do SLO faz histogram_quantile() extrapolar — p99 incorreto.',
        'Recording rules pré-computam queries caras. Dashboards consultam séries pré-computadas em vez de recalcular.',
        'Local Prometheus retém 15 dias. Para histórico longo: Thanos sidecar + S3 ou Grafana Mimir.',
        'remote_write tem backpressure via WAL — Prometheus não perde samples se o backend ficar lento.',
        'auto_explain equivalente: auto_label_drop via relabel_configs antes do TSDB.',
      ],
      patterns: [
        {
          name: 'PrometheusRule completa (Kubernetes)',
          desc: 'CRD do kube-prometheus-stack — operator injeta automaticamente',
          code: `apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: api-rules
  namespace: monitoring
  labels: { prometheus: kube-prometheus }
spec:
  groups:
  - name: api.recording
    interval: 30s
    rules:
    - record: job:http_errors:rate5m
      expr: sum(rate(http_requests_total{status=~"5.."}[5m])) by (job)
    - record: job:http_total:rate5m
      expr: sum(rate(http_requests_total[5m])) by (job)
    - record: job:error_rate:ratio5m
      expr: job:http_errors:rate5m / job:http_total:rate5m
  - name: api.alerts
    rules:
    - alert: ErrorRateAlto
      expr: job:error_rate:ratio5m > 0.01
      for: 5m
      labels: { severity: critical, team: backend }
      annotations:
        summary: "{{ $labels.job }}: {{ $value | humanizePercentage }} de erros"
        runbook_url: https://runbooks/error-rate`,
        },
        {
          name: 'Multi-window burn rate (SLO 99.9%)',
          desc: 'Janela curta E longa — elimina falsos positivos sem atrasar alertas reais',
          code: `- alert: SLOBurnRateCritico
  expr: |
    (
      sum(rate(http_requests_total{status=~"5.."}[1h]))
      / sum(rate(http_requests_total[1h])) > (14 * 0.001)
    ) and (
      sum(rate(http_requests_total{status=~"5.."}[6h]))
      / sum(rate(http_requests_total[6h])) > (14 * 0.001)
    )
  for: 2m
  labels: { severity: critical, slo: availability }`,
        },
        {
          name: 'Instrumentação prom-client (Node.js)',
          desc: 'Endpoint /metrics + Counter, Histogram, Gauge canônicos',
          code: `import { Registry, Counter, Histogram, Gauge } from 'prom-client'
import express from 'express'

const registry = new Registry()

const pedidosCriados = new Counter({
  name: 'pedidos_criados_total',
  help: 'Total de pedidos criados',
  labelNames: ['status', 'metodo_pagamento'],
  registers: [registry],
})

const latenciaPagamento = new Histogram({
  name: 'pagamento_latencia_seconds',
  help: 'Latência do processamento de pagamento',
  labelNames: ['gateway'],
  buckets: [0.05, 0.1, 0.25, 0.5, 1, 2, 5],
  registers: [registry],
})

const filaSize = new Gauge({
  name: 'fila_pedidos_tamanho',
  help: 'Pedidos na fila aguardando processamento',
  registers: [registry],
})

app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', registry.contentType)
  res.send(await registry.metrics())
})`,
        },
      ],
      mentalModels: [
        'CHiGS: Counter→rate(), Histogram→quantile(), Gauge→direto, Summary→evitar',
        'RED para serviços (sintoma), USE para recursos (causa) — alerte em RED, investigue em USE',
        'Multi-window AND: janela curta detecta, janela longa confirma — reduz falsos positivos',
        'Cardinalidade = produto dos valores únicos de labels — < 1000 por label, ideal',
        'Pull model: scrape detecta serviço down (scrape falha = inacessível). Push só para jobs curtos via Pushgateway',
        'Recording rules = "índice" de queries caras. Mesmo papel de view materializada em SQL',
        'Local Prometheus = 15 dias. Multi-cluster + retenção longa = Thanos ou Mimir',
        'Alertar em CPU sem correlato com error rate é alert fatigue garantido',
      ],
    },
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'Prometheus',
    stackLabel: 'Observabilidade · CNCF',
  }),
  antipatterns: () => buildAntipatternsPdf({
    antipatterns: ANTIPATTERNS,
    accentColor: C,
    skillName: 'Prometheus',
    stackLabel: 'Observabilidade · CNCF',
  }),
  mindmap: () => buildMindmapPdf({
    categories: MINDMAP_CATEGORIES,
    checklist: MINDMAP_CHECKLIST,
    accentColor: C,
    skillName: 'Prometheus',
    stackLabel: 'Observabilidade · CNCF',
    mapTitle: 'Ecossistema Prometheus',
    mapDesc: 'Tópicos essenciais (k) e avançados (a) para entrevista pleno/sênior',
    checklistTitle: 'Checklist de revisão pré-entrevista',
    checklistDesc: 'Marque cada item que você consegue explicar sem consultar — 100% antes de entrevista',
  }),
}

export default function PrometheusPdfs() {
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
