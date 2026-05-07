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

// ── Paleta Grafana ────────────────────────────────────────────────────────────
const C = '#F46800'

// ═══════════════════════════════════════════════════════════════════════════════
// PDF CARDS
// ═══════════════════════════════════════════════════════════════════════════════

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 12 perguntas de Grafana mais cobradas em entrevista pleno/sênior',
    type: 'qa',
    pages: 8,
    description: 'Recuperação ativa em formato Q&A: SLO dashboards, exemplars end-to-end, Loki vs Elasticsearch, Tempo vs Jaeger, Cloud vs self-hosted, dashboard-as-code, multi-tenancy, OnCall e mais. Nível pleno e sênior, com dica de apresentação para cada resposta.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'PromQL, LogQL, TraceQL e Alerting — referência densa em duas páginas',
    type: 'cheatsheet',
    pages: 2,
    description: 'Funções essenciais de PromQL (rate, histogram_quantile, sum by, increase), LogQL (stream selector, line filter, parsers, métricas de log), TraceQL (trace:id, atributos, duration, multi-span), tipos de painel, regras de alerting e atalhos mentais.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'quick-ref',
    title: 'Quick Ref',
    subtitle: 'Cartão A4 landscape — queries Grafana em 3 colunas',
    type: 'quick-ref',
    pages: 1,
    description: 'PromQL essencial, LogQL essencial e TraceQL essencial em 3 colunas — para imprimir e deixar na mesa. Cada query com sintaxe, badge da janela típica e armadilha comum.',
    icon: '03',
    goal: 'Referência de bolso',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'Os 8 erros que aparecem em code review de dashboards Grafana',
    type: 'antipatterns',
    pages: 3,
    description: 'Dashboard hardcoded sem variables, 50 painéis num dashboard, sem annotations de deploy, sem provisioning (some quando deletado), credentials no JSON, user_id como label do Loki, exemplars sem todas as 4 configs, datasource default trocado silenciosamente.',
    icon: '04',
    goal: 'Reconhecimento de padrão',
  },
  {
    id: 'comparative',
    title: 'Comparative',
    subtitle: 'Grafana Cloud vs Self-hosted LGTM — decisão de arquitetura',
    type: 'comparative',
    pages: 3,
    description: 'Comparação objetiva: Cloud (free tier + paid) vs Self-hosted full vs Híbrido. Custo em escala, operação, compliance, RBAC, retenção, multi-tenancy. Cenários recomendados por tamanho de time e volume.',
    icon: '05',
    goal: 'Decisão arquitetural',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// DADOS — Q&A
// ═══════════════════════════════════════════════════════════════════════════════

const QAS: QAItem[] = [
  {
    level: 'Senior',
    q: 'Como você criaria um dashboard de SLO no Grafana?',
    a: '<p><strong>Variables:</strong> <code>$service</code> (Query type — label_values), <code>$env</code>.</p><p><strong>Painéis:</strong></p><ul><li>Stat de Availability 30d — <code>1 - sum(rate(http_requests_total{status=~"5.."}[30d])) / sum(rate(http_requests_total[30d]))</code> com unit percentunit e threshold em vermelho abaixo do SLO</li><li>Time series de p99 latency com histogram_quantile e exemplars ativados</li><li>Gauge de Error Budget restante — <code>(slo - actual_error_rate) / (1 - slo) * 100</code></li><li>Time series de Burn Rate em multi-window (1h e 6h)</li><li>Table com top endpoints por error rate</li><li>Logs panel do Loki filtrado por level=error</li></ul><p><strong>Alert rule conectada:</strong> multi-window burn rate &gt; 14× em 1h E 6h → severity=critical → Slack do on-call. Annotations de deploy via webhook do CI. JSON versionado em Git, provisionado via Terraform.</p>',
    tip: 'Mencionar multi-window burn rate, exemplars e versionamento via Terraform mostra que você opera Grafana em produção real, não só montou dashboard pra brincar.',
  },
  {
    level: 'Pleno',
    q: 'Quando usar Loki vs. Elasticsearch para logs?',
    a: '<p><strong>Loki:</strong> indexa só labels (service, env, level), conteúdo fica em chunks no S3. Custo ~10x menor para o mesmo volume. Integrado nativamente com Grafana, Prometheus e Tempo (correlação trace ↔ log via trace_id é nativa). Trade-off: busca full-text é scan de chunks — mais lenta.</p><p><strong>Elasticsearch:</strong> indexa tudo, busca full-text rápida e rica (facets, aggregations, fuzzy match), ecossistema maduro (Kibana, Logstash, Beats). Trade-off: caro de operar, escala difícil.</p><p><strong>Regra prática:</strong> se 80% das buscas são por service+env+level (caso comum em SRE), Loki vence. Se você precisa de busca textual frequente em milhões de logs (ex: SIEM, security analytics), Elasticsearch ainda lidera. Em times com OpenTelemetry e Prometheus, Loki é o caminho natural.</p>',
    tip: 'Trade-off real de custo + caso de uso (SRE vs. SIEM) diferencia de quem só leu o readme.',
  },
  {
    level: 'Senior',
    q: 'O que são Exemplars e como funcionam end-to-end?',
    a: '<p><strong>Exemplar = trace_id anexado a um data point de métrica histogram.</strong></p><p><strong>Pipeline:</strong></p><ol><li>App instrumentada com OTel SDK emite histogram (http_request_duration). Quando registra um observation, OTel injeta automaticamente o trace_id atual como exemplar</li><li>Prometheus scrapa o /metrics com OpenMetrics format e <code>--enable-feature=exemplar-storage</code> — exemplars são armazenados junto da série</li><li>Grafana datasource Prometheus tem <code>exemplarTraceIdDestinations</code> apontando para Tempo</li><li>No painel de p99, ativa Exemplars — diamantes amarelos aparecem nos pontos</li><li>Clique no diamante abre o trace específico no Tempo</li></ol><p>Sem exemplars: você vê p99 alto às 14:32 e adivinha entre 50k traces qual foi. Com exemplars: 1 clique. Configuração tem 4 partes (app + prom flag + scrape protocol + datasource) — esquecer qualquer uma e exemplars "não funcionam" silenciosamente.</p>',
    tip: 'Listar os 4 pontos de configuração mostra que você implementou de verdade — quem só leu cita só "tem exemplar" e não sabe por que não aparece.',
  },
  {
    level: 'Senior',
    q: 'Grafana Alerting (unified) vs. Alertmanager — quando usar cada um?',
    a: '<p><strong>Grafana Alerting (unified, pós v9):</strong> UI integrada, funciona com qualquer data source (Prometheus, Loki, Elasticsearch, CloudWatch, SQL). Centraliza alerting com notification policies, mute timings e silences na mesma UI. Melhor para: ambientes com múltiplos data sources, times que já vivem no Grafana, alerting baseado em logs (LogQL) ou queries SQL.</p><p><strong>Alertmanager:</strong> maduro, configuração via YAML versionável (config-as-code natural), integração nativa com PrometheusRule do kube-prometheus-stack, routing complexo via labels com regex. Melhor para: ambientes Kubernetes-centric com kube-prometheus-stack, times que querem alerting separado da UI, multi-cluster com Alertmanager federation.</p><p>Em prática, muitos times rodam ambos: Alertmanager para alertas Prometheus core (infra K8s), Grafana Alerting para alertas de aplicação (logs Loki, queries SQL).</p>',
    tip: 'Mostre que NÃO precisa escolher um só — rodar os dois para casos diferentes é a resposta sênior.',
  },
  {
    level: 'Pleno',
    q: 'O que é LogQL e como difere de PromQL?',
    a: '<p>LogQL é a linguagem de query do Loki, inspirada em PromQL mas para logs. <strong>Estrutura:</strong> <code>{seletor de stream} |= \'filtro de linha\' | parser | filtro de label</code>.</p><p><strong>Operadores de linha:</strong> <code>|=</code> contém, <code>!=</code> não contém, <code>|~</code> regex, <code>!~</code> não-regex.</p><p><strong>Parsers:</strong> json, logfmt, pattern, regexp.</p><p><strong>Diferença chave:</strong> PromQL retorna séries numéricas (vetores); LogQL retorna log streams OU métricas derivadas. <strong>Métricas:</strong> <code>rate({...} |= \'error\' [5m])</code> conta erros/s; <code>quantile_over_time(0.99, {...} | json | unwrap duration_ms [5m])</code> calcula p99 de campo extraído.</p><p><strong>Limitação:</strong> LogQL é mais lento que PromQL para métricas — Prometheus pré-agrega; Loki escaneia chunks. Use logs para SLI quando não tem métrica equivalente. Quando tem métrica, sempre prefira PromQL.</p>',
    tip: 'A frase "use logs para SLI quando não tem métrica equivalente" demonstra raciocínio de custo/benefício, não só conhecimento de sintaxe.',
  },
  {
    level: 'Senior',
    q: 'Como organizar dashboards Grafana num time grande (50+ engenheiros)?',
    a: '<ol><li><strong>Folders por domínio:</strong> Platform, Services, Business, Infrastructure</li><li><strong>Naming convention:</strong> "[serviço] — Visão Geral", "[serviço] — Detalhes", "[serviço] — On-call"</li><li><strong>Dashboard de on-call por squad</strong> com top 5 métricas pinadas</li><li><strong>Variables obrigatórias:</strong> $env, $service em todos</li><li><strong>Versionamento:</strong> JSON em Git + Terraform/Helm provisioning. <code>allowUiUpdates: false</code> em prod (edição via UI bloqueada — só via PR)</li><li><strong>RBAC:</strong> cada squad tem 1 team com Editor no próprio folder, Viewer no resto. SREs com Admin global</li><li><strong>Library panels</strong> para componentes reusados (ex: painel padrão de RED metrics)</li><li><strong>Code review de dashboard JSON</strong> como qualquer código</li><li><strong>Alerting unificado</strong> num folder Alerts/ — alertas como código</li><li><strong>Documentação:</strong> cada dashboard tem painel Markdown no topo explicando para quem é</li></ol>',
    tip: 'Mencionar allowUiUpdates: false e library panels mostra maturidade — a maioria não chega lá.',
  },
  {
    level: 'Senior',
    q: 'Grafana Cloud vs. self-hosted LGTM — como decidir?',
    a: '<p><strong>Grafana Cloud:</strong> SaaS gerenciado com free tier generoso (10k séries, 50GB logs/traces). Vantagem: zero operação, upgrades automáticos, escala automática, integração OnCall + IRM nativa. <strong>Trade-off:</strong> custo escala rápido — acima do free tier, com volume real (1M séries, 1TB logs), pode chegar a USD 5-15k/mês.</p><p><strong>Self-hosted LGTM:</strong> custo de infra (S3 + EKS) ~5-10x menor que Cloud equivalente em volume alto. Trade-off: precisa de 1-2 engenheiros dedicados a operar.</p><p><strong>Decisão:</strong></p><ul><li>Time pequeno (&lt; 20 engs) ou volume baixo → <strong>Cloud</strong></li><li>Time grande (&gt; 50 engs), volume alto, requisitos de compliance (dados não saem da região) → <strong>self-hosted</strong></li><li>Híbrido também é comum: free tier do Cloud para staging e dev, self-hosted para prod</li></ul>',
    tip: 'Dar números concretos (10k séries, USD 5-15k/mês, 5-10x mais barato) impressiona em entrevista de senior/staff.',
  },
  {
    level: 'Senior',
    q: 'O que é Grafana OnCall e quando substituir PagerDuty por ele?',
    a: '<p><strong>Grafana OnCall:</strong> produto de incident management da Grafana Labs (open source + Cloud). Schedules de plantão, escalation chains, routing por labels, integração nativa com Slack (cria canal por incidente, status updates), integração com webhook in/out.</p><p><strong>Diferencial:</strong> integrado ao Grafana — alerta vai direto pro OnCall, runbook é link no alerta, postmortem fica anexado à incident page.</p><p><strong>Quando substituir PagerDuty:</strong> time pequeno-médio com plantão simples, custo de PagerDuty incomoda (USD 21-65/user/mês), já vive no LGTM stack.</p><p><strong>Quando NÃO substituir:</strong> empresa grande com auditoria SOC2 rígida, runbooks complexos com dependências entre serviços, integração com sistemas legacy proprietários. Para 80% dos times BR, OnCall basta.</p>',
    tip: 'Citar o preço PagerDuty (USD 21-65/user/mês) mostra que você fez análise de custo, não opinião.',
  },
  {
    level: 'Senior',
    q: 'Tempo vs. Jaeger — qual escolher para tracing?',
    a: '<p><strong>Tempo:</strong> backend da Grafana Labs, otimizado para custo. Armazena spans em object storage (S3) sem índice de atributos. Busca por trace_id é instantânea (lookup direto). Busca por atributo (TraceQL) é mais lenta — escaneia blocos. Custo ~10x menor que Jaeger+Elasticsearch. Integração nativa com Grafana, Loki (tracesToLogsV2), Prometheus (exemplars).</p><p><strong>Jaeger:</strong> open source da Uber/CNCF, mais maduro. Backend tradicional Cassandra ou Elasticsearch — índice rico de atributos, busca exploratória rápida. UI própria mais polida em alguns casos de discovery.</p><p><strong>Decisão:</strong></p><ul><li>Workflow já tem trace_id (vem de logs ou exemplars) → <strong>Tempo</strong> brilha</li><li>Workflow é discovery exploratório de spans lentos sem trace_id pré-conhecido → <strong>Jaeger</strong> ainda vence em UX</li></ul><p>Em prática, com logs estruturados emitindo trace_id e exemplars no Prometheus, Tempo cobre 95% dos casos por uma fração do custo.</p>',
    tip: 'Mencionar "workflow já tem trace_id vs. discovery exploratório" é a faca cirúrgica — quem só conhece superficialmente diz "Tempo é mais barato e ponto".',
  },
  {
    level: 'Senior',
    q: 'Como fazer dashboard-as-code corretamente?',
    a: '<p><strong>Workflow:</strong></p><ol><li>Engenheiro edita dashboard via UI (sandbox em folder Editing/)</li><li>Export JSON via API (<code>curl /api/dashboards/uid/X</code>)</li><li>Commit em repo Git com PR</li><li>CI valida sintaxe com jsonnet/json schema</li><li>Merge dispara Terraform/Helm que provisiona em prod (<code>allowUiUpdates: false</code> em prod)</li></ol><p><strong>Ferramentas:</strong> Terraform com grafana provider (<code>grafana_dashboard</code> resource), Helm com kube-prometheus-stack (dashboards via ConfigMap), Grafonnet (Jsonnet) para gerar JSON com loops e DRY (1 template → N dashboards por serviço).</p><p><strong>Vantagens:</strong> code review, rollback via git revert, prevenção de dashboards perdidos, reuso entre serviços via Grafonnet.</p><p><strong>Anti-pattern:</strong> editor via UI em prod sem provisioning — dashboard some quando alguém deleta acidentalmente.</p>',
    tip: 'Citar Grafonnet diferencia: a maioria sabe Terraform mas Grafonnet é o que escala em times com 50+ dashboards.',
  },
  {
    level: 'Senior',
    q: 'Como configurar multi-tenancy no LGTM?',
    a: '<p>Mimir, Loki e Tempo aceitam header <code>X-Scope-OrgID</code> que isola dados por tenant. <strong>Implementação:</strong></p><ol><li>Reverse proxy (Nginx, Envoy, Traefik) que adiciona <code>X-Scope-OrgID</code> baseado em auth (JWT, mTLS, API key)</li><li>Cada tenant escreve e lê só seus dados — não há query cross-tenant por padrão</li><li>Grafana Enterprise/Cloud tem orgs/stacks — cada org é um tenant com datasources separados</li><li>RBAC + folders no Grafana isola dashboards</li></ol><p><strong>Casos de uso:</strong> SaaS B2B (cliente A não vê dados do cliente B), holding com múltiplas empresas (BU1 não vê BU2), platform team com self-service (cada squad é um tenant com cota de séries/logs).</p><p><strong>Anti-pattern:</strong> "multi-tenancy" via labels (<code>service=tenant_a</code>) — sem isolamento real, query bug expõe dados cross-tenant. Use header tenant nativo.</p>',
    tip: 'O anti-pattern de "multi-tenancy via label" é comum em times que tentam implementar barato — citar isso mostra experiência operacional real.',
  },
  {
    level: 'Senior',
    q: 'Como provisionar datasources e dashboards em Kubernetes via Helm?',
    a: '<p>Use kube-prometheus-stack (operator-style).</p><p><strong>Datasources:</strong> values.yaml → <code>grafana.additionalDataSources</code> (lista YAML).</p><p><strong>Dashboards:</strong></p><ol><li>ConfigMap com label <code>grafana_dashboard=1</code> — operator monta automático</li><li>ou <code>grafana.dashboards</code> inline no values</li><li>ou <code>grafana.dashboardsConfigMaps</code> referenciando</li></ol><p>Sidecar (grafana-sc-dashboard) monitora ConfigMaps com a label e cria dashboards no Grafana via API.</p><p><strong>Vantagens:</strong> GitOps natural (ArgoCD/Flux sincroniza), namespacing por team via label, rollback via Helm.</p><p><strong>Workflow:</strong> dev edita dashboard, exporta JSON, commit no chart Helm do squad, ArgoCD detecta, sidecar pega novo ConfigMap, dashboard atualiza. <code>allowUiUpdates: false</code> impede divergência.</p>',
    tip: 'O workflow ArgoCD → ConfigMap → sidecar é o padrão de fato em times K8s — descrever a cadeia mostra fluência operacional.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// DADOS — Quick Ref (3 colunas A4 landscape)
// ═══════════════════════════════════════════════════════════════════════════════

const QUICK_REF: QuickRefColumn[] = [
  {
    sections: [
      {
        title: 'PromQL — Métricas',
        entries: [
          { key: 'rate(m[5m])',                value: 'Taxa por seg de counter — base de SLI', badge: 'counter', badgeColor: '#F46800' },
          { key: 'increase(m[1h])',            value: 'Total absoluto na janela — alertas',    badge: 'counter', badgeColor: '#F46800' },
          { key: 'sum by (l) (...)',           value: 'Agrega mantendo a label l',              badge: 'agg' },
          { key: 'sum without (l)',            value: 'Agrega descartando só a label l',        badge: 'agg' },
          { key: 'histogram_quantile(0.99,…)', value: 'P99 — sum by (le) ANTES',                badge: 'p99', badgeColor: '#fbbf24' },
          { key: 'avg_over_time(m[5m])',       value: 'Média de gauge — não usar em counter',   badge: 'gauge' },
          { key: 'max_over_time(m[1h])',       value: 'Máximo na janela',                       badge: 'gauge' },
          { key: 'topk(5, ...)',               value: 'Top N séries por valor',                 badge: 'select' },
        ],
      },
      {
        title: 'PromQL — SLO patterns',
        entries: [
          { key: 'availability_30d',  value: '1 - sum(rate(req{5..}[30d])) / sum(rate(req[30d]))' },
          { key: 'error_rate',        value: 'sum(rate(req{5..}[5m])) / sum(rate(req[5m]))' },
          { key: 'burn_rate_1h',      value: 'error_rate_1h / (1 - slo_target)' },
          { key: 'recording rule',    value: 'job:sli:rate5m — pré-computa histograma' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'LogQL — Logs (Loki)',
        entries: [
          { key: '{s="api",e="prod"}',         value: 'Stream selector — APENAS labels',            badge: 'fast', badgeColor: '#4ade80' },
          { key: '|= "ERROR"',                 value: 'Line filter contém — case-sensitive',         badge: 'filter' },
          { key: '!= "health"',                value: 'Line filter não contém' },
          { key: '|~ "(?i)err"',               value: 'Regex match — flag (?i) para insensitive',    badge: 'regex' },
          { key: '| json',                     value: 'Parser JSON — extrai campos como labels',     badge: 'parse' },
          { key: '| logfmt',                   value: 'Parser logfmt — key=value',                   badge: 'parse' },
          { key: '| pattern "<ip> <code>"',    value: 'Parser de template posicional',                badge: 'parse' },
          { key: 'rate({...} |= "ERR" [5m])',  value: 'Métrica derivada — erros/s',                  badge: 'metric' },
          { key: 'quantile_over_time(0.99,…)', value: 'P99 de unwrap field numérico',                badge: 'metric' },
        ],
      },
      {
        title: 'Cardinality — REGRA',
        entries: [
          { key: 'OK como label',  value: 'service, env, level, namespace, pod' },
          { key: 'NUNCA label',    value: 'user_id, request_id, trace_id, ip, email',     badge: 'banido', badgeColor: '#ef4444' },
          { key: 'onde colocar',   value: 'No conteúdo do log (JSON), nunca como label' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'TraceQL — Traces (Tempo)',
        entries: [
          { key: '{ trace:id = "..." }',         value: 'Lookup direto — instantâneo',               badge: 'fast', badgeColor: '#4ade80' },
          { key: 'resource.service.name',        value: 'Atributo de Resource — semantic conv',       badge: 'attr' },
          { key: 'span.http.method',             value: 'Atributo do span — http.method, db.*',       badge: 'attr' },
          { key: 'duration > 1s',                value: 'Filtro por latência — 1ms, 1s, 1m',         badge: 'filter' },
          { key: 'status = error',               value: 'Spans com erro',                            badge: 'filter' },
          { key: '{...} && {...}',               value: 'Multi-span — spans diferentes do mesmo trace', badge: 'multi' },
          { key: '{...} | rate() by (route)',    value: 'Aggregations sobre traces (Tempo 2.x)',     badge: 'agg' },
        ],
      },
      {
        title: 'Alerting — estados',
        entries: [
          { key: 'Normal',  value: 'Query OK, condição falsa', badge: 'OK',  badgeColor: '#4ade80' },
          { key: 'Pending', value: 'Condição true há < for',   badge: 'wait', badgeColor: '#fbbf24' },
          { key: 'Firing',  value: 'Condição true há ≥ for',    badge: 'page', badgeColor: '#ef4444' },
          { key: 'NoData',  value: 'Sem datapoints',           badge: 'gap',  badgeColor: '#94a3b8' },
          { key: 'Error',   value: 'Query falhou (datasource)', badge: 'err',  badgeColor: '#a78bfa' },
        ],
      },
      {
        title: 'Painel — qual usar',
        entries: [
          { key: 'time series', value: 'Métrica no tempo — 80% dos casos' },
          { key: 'stat',        value: 'Valor único agora (avail %, qps)' },
          { key: 'gauge',       value: 'Valor vs threshold visual' },
          { key: 'heatmap',     value: 'histogram_quantile por bucket' },
          { key: 'table',       value: 'Top N (topk + transformations)' },
          { key: 'logs',        value: 'Stream Loki com filter highlight' },
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
    title: 'Dashboard hardcoded sem variables',
    badDesc: 'Painel com filtro fixo no PromQL. Dashboard só serve para 1 ambiente/serviço.',
    badCode: [
      { t: 'sum(rate(http_requests_total{', c: '#94a3b8' },
      { t: 'env="prod", service="checkout"', c: '#ef4444' },
      { t: '}[5m]))', c: '#94a3b8' },
    ],
    goodDesc: 'Variables $env e $service tornam o dashboard reutilizável. Multi-value safe com regex match.',
    goodCode: [
      { t: 'sum(rate(http_requests_total{', c: '#94a3b8' },
      { t: 'env="$env", service=~"$service"', c: '#4ade80' },
      { t: '}[5m]))', c: '#94a3b8' },
    ],
    why: 'Sem variables o dashboard precisa ser duplicado para cada ambiente. Times com 10 serviços viram 30 dashboards. Com $env e $service, 1 dashboard cobre tudo. Multi-value: =~ (regex) em vez de = (exact) — Grafana injeta "a|b|c" como regex.',
  },
  {
    title: 'Loki com user_id ou trace_id como label',
    badDesc: 'Cardinalidade explode. Loki cria uma série por valor único de label — milhões de séries para milhões de usuários.',
    badCode: [
      { t: '{', c: '#94a3b8' },
      { t: 'service="api", user_id="12345", trace_id="4bf92f..."', c: '#ef4444' },
      { t: '}', c: '#94a3b8' },
    ],
    goodDesc: 'Labels só com baixa cardinalidade. Campos dinâmicos vão no conteúdo do log.',
    goodCode: [
      { t: '{', c: '#94a3b8' },
      { t: 'service="api", env="prod", level="error"', c: '#4ade80' },
      { t: '} | json | ', c: '#94a3b8' },
      { t: 'user_id="12345"', c: '#86efac' },
    ],
    why: 'Loki indexa labels — cardinalidade alta destrói performance e custo. Regra: labels devem ter dezenas de valores, não milhões. user_id, request_id, trace_id, IP no conteúdo (JSON parser) extrai como pseudo-label só na query, sem indexar.',
  },
  {
    title: 'Sem provisioning — dashboard via UI em prod',
    badDesc: 'Dashboard criado clicando na UI. Sem versionamento. Some quando alguém deleta acidentalmente.',
    badCode: [
      { t: '# UI New Dashboard -> Save -> ', c: '#94a3b8' },
      { t: 'pronto', c: '#ef4444' },
      { t: '\n# Sem Git, sem Terraform, sem rollback', c: '#94a3b8' },
    ],
    goodDesc: 'JSON em Git, provisioning via Terraform, allowUiUpdates: false em prod.',
    goodCode: [
      { t: 'resource "grafana_dashboard" "checkout" {\n  config_json = file(', c: '#94a3b8' },
      { t: '"dashboards/checkout.json"', c: '#4ade80' },
      { t: ')\n  folder      = grafana_folder.platform.id\n}', c: '#94a3b8' },
    ],
    why: 'Editor da UI em prod sem provisioning é desastre esperando para acontecer. Dashboard de SLO da empresa pode ser deletado num clique acidental. Versionar JSON em Git permite code review, rollback via git revert e reuso entre ambientes (Grafonnet).',
  },
  {
    title: '50 painéis num único dashboard',
    badDesc: 'Dashboard "completo" com tudo na mesma página. Renderização lenta, ninguém olha mais que 8 painéis.',
    badCode: [
      { t: '# checkout-everything.json', c: '#94a3b8' },
      { t: '\n# 50 panels, 30s+ para carregar, 200+ queries Prometheus', c: '#ef4444' },
    ],
    goodDesc: 'Overview (top-level RED metrics, 6-8 painéis) + drill-down dashboards (1 por subdomínio com link).',
    goodCode: [
      { t: '# checkout-overview.json (8 panels)', c: '#4ade80' },
      { t: '\n# checkout-database.json (link do overview)\n# checkout-stripe.json (link do overview)', c: '#94a3b8' },
    ],
    why: 'Dashboards lentos são dashboards inúteis. Cada query é round-trip ao Prometheus — 50 painéis em refresh de 30s = 100 queries/min só desse dashboard. Ainda pior: ninguém consegue escanear 50 painéis num incidente. Overview com 6-8 e drill-down focado é o padrão de SRE maduro.',
  },
  {
    title: 'Sem annotations de deploy',
    badDesc: 'Spike no gráfico de error rate sem contexto. "Foi deploy? Foi tráfego? Foi DB?" — ninguém sabe.',
    badCode: [
      { t: '# Painel com gráfico de erros\n# Spike às 14:32 — ', c: '#94a3b8' },
      { t: 'sem nenhuma marcação visual', c: '#ef4444' },
    ],
    goodDesc: 'Webhook do CI/CD chama API do Grafana ao final do deploy — annotation aparece como linha vertical.',
    goodCode: [
      { t: 'curl -X POST $GRAFANA/api/annotations \\\n  -d \'{"dashboardUID":"checkout","tags":["deploy","v2.4.1"],\n        "text":"Deploy v2.4.1 — checkout-service",\n        "time":', c: '#94a3b8' },
      { t: "$(date +%s)000", c: '#4ade80' },
      { t: '}\'', c: '#94a3b8' },
    ],
    why: 'Annotation de deploy é a feature de menor esforço com maior valor em incidentes. 5 minutos para implementar via webhook do CI; reduz MTTD em incidentes pós-deploy de horas para segundos. Linha vertical no gráfico = causa óbvia.',
  },
  {
    title: 'Exemplars "não funcionam"',
    badDesc: 'Configuração parcial. Exemplars exigem 4 partes alinhadas — esquecer qualquer uma e nada aparece.',
    badCode: [
      { t: '# Só ativou exemplarTraceIdDestinations no datasource\n# E ', c: '#94a3b8' },
      { t: 'esqueceu --enable-feature=exemplar-storage no Prometheus', c: '#ef4444' },
    ],
    goodDesc: 'As 4 partes obrigatórias: app emite exemplars, Prometheus com flag e OpenMetrics, datasource configurado, painel com Exemplars ativados.',
    goodCode: [
      { t: '# 1. Prometheus\n  --enable-feature=exemplar-storage\n', c: '#4ade80' },
      { t: '# 2. scrape_protocols: [OpenMetricsText1.0.0]\n', c: '#86efac' },
      { t: '# 3. datasource Prometheus\n  exemplarTraceIdDestinations: [{name: trace_id, datasourceUid: tempo}]\n', c: '#4ade80' },
      { t: '# 4. painel options -> Exemplars: ON', c: '#86efac' },
    ],
    why: 'Cada uma das 4 etapas é silenciosa quando falha — não há erro visível, exemplars simplesmente não aparecem. Decoração visual que sai cara: 1 hora de debug por configuração. Verifique no /metrics do app que tem # {trace_id="..."} value timestamp em cada bucket de histogram.',
  },
  {
    title: 'Datasource credentials no JSON',
    badDesc: 'Export de JSON com credenciais embutidas. Commit no Git vaza secret.',
    badCode: [
      { t: '"datasource": {\n  "type": "prometheus",\n  "url": "https://...",\n  ', c: '#94a3b8' },
      { t: '"basicAuthPassword": "supersecret123"', c: '#ef4444' },
      { t: '\n}', c: '#94a3b8' },
    ],
    goodDesc: 'Datasource provisionado separadamente via Terraform/Helm com secret manager. Dashboard JSON referencia só o uid.',
    goodCode: [
      { t: '"datasource": {\n  "type": "prometheus",\n  ', c: '#94a3b8' },
      { t: '"uid": "prometheus"', c: '#4ade80' },
      { t: '\n}\n# Credentials em ', c: '#94a3b8' },
      { t: 'Vault / AWS Secrets / K8s Secret', c: '#86efac' },
    ],
    why: 'Service accounts substituíram API keys justamente para evitar credenciais em JSON. Dashboards devem referenciar datasource só por uid. Credenciais ficam em secret manager (Vault, K8s Secret) e o Grafana pega via env var. Auditoria SOC2/PCI exige isso.',
  },
  {
    title: 'Default datasource trocado silenciosamente',
    badDesc: 'Query sem datasource explícito — usa o default. Default muda no provisioning, queries quebram em todos os dashboards.',
    badCode: [
      { t: '"targets": [{\n  "expr": "rate(http_requests_total[5m])"\n  // ', c: '#94a3b8' },
      { t: 'sem campo "datasource" — usa o default', c: '#ef4444' },
      { t: '\n}]', c: '#94a3b8' },
    ],
    goodDesc: 'Sempre especifique o datasource explicitamente em cada query — por uid (recomendado) ou pelo nome.',
    goodCode: [
      { t: '"targets": [{\n  ', c: '#94a3b8' },
      { t: '"datasource": {"type": "prometheus", "uid": "prometheus"}', c: '#4ade80' },
      { t: ',\n  "expr": "rate(http_requests_total[5m])"\n}]', c: '#94a3b8' },
    ],
    why: 'Default datasource é açúcar perigoso — quebra em silêncio quando muda. Em produção, todas as queries devem referenciar uid explícito. Provisioning via Terraform: defina o uid manualmente (ex: "prometheus", "loki") para que dashboards sobrevivam recriações.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// DADOS — Comparative (Cloud vs Self-host vs Hybrid)
// ═══════════════════════════════════════════════════════════════════════════════

const COMP_OPTIONS: CompOption[] = [
  { name: 'Grafana Cloud',        color: '#F46800' },
  { name: 'Self-hosted LGTM',     color: '#4ade80' },
  { name: 'Híbrido',              color: '#38bdf8' },
]

const COMP_CRITERIA: CompCriterion[] = [
  {
    criterion: 'Custo inicial',
    category: 'Financeiro',
    values: {
      'Grafana Cloud':    'Free tier (10k séries, 50GB logs/traces). USD 0 para times pequenos',
      'Self-hosted LGTM': 'Infra (S3 + EKS) + 1-2 SREs (USD 15-30k/mês em pessoas)',
      'Híbrido':          'Cloud free para staging/dev + self-host para prod',
    },
  },
  {
    criterion: 'Custo em escala (1M séries, 1TB logs)',
    category: 'Financeiro',
    values: {
      'Grafana Cloud':    'USD 5-15k/mês — escala rápido com volume',
      'Self-hosted LGTM': 'USD 1-3k/mês de infra — 5-10x mais barato',
      'Híbrido':          'Self-host paga o volume pesado de prod',
      winner: 'Self-hosted LGTM',
    },
    winner: 'Self-hosted LGTM',
  },
  {
    criterion: 'Operação',
    category: 'Operacional',
    values: {
      'Grafana Cloud':    'Zero — upgrades, scale, SLA da Grafana Labs',
      'Self-hosted LGTM': 'Alta — patching, certificados, scaling, debug do Mimir',
      'Híbrido':          'Média — só prod precisa de operação real',
    },
    winner: 'Grafana Cloud',
  },
  {
    criterion: 'Time-to-value',
    category: 'Operacional',
    values: {
      'Grafana Cloud':    'Minutos — signup, conectar app, ver dados',
      'Self-hosted LGTM': 'Semanas-meses — setup + tuning de retention/sharding',
      'Híbrido':          'Cloud rápido pra dev; self-host gradual em prod',
    },
    winner: 'Grafana Cloud',
  },
  {
    criterion: 'Compliance (dados na região)',
    category: 'Governança',
    values: {
      'Grafana Cloud':    'Multi-região mas dados saem da empresa',
      'Self-hosted LGTM': 'Dados nunca saem do seu cloud account',
      'Híbrido':          'Prod self-hosted (compliance); dev Cloud (sem dados sensíveis)',
    },
    winner: 'Self-hosted LGTM',
  },
  {
    criterion: 'Multi-tenancy',
    category: 'Governança',
    values: {
      'Grafana Cloud':    'Stacks (orgs) — natural mas paga por stack',
      'Self-hosted LGTM': 'Mimir/Loki/Tempo X-Scope-OrgID — controle total',
      'Híbrido':          'Multi-tenant em prod self-host; dev compartilhado em Cloud',
    },
  },
  {
    criterion: 'RBAC granular',
    category: 'Governança',
    values: {
      'Grafana Cloud':    'Pro/Advanced tier — RBAC enterprise nativo',
      'Self-hosted LGTM': 'Open source: básico. Enterprise: granular completo',
      'Híbrido':          'Igual à opção escolhida em cada lado',
    },
  },
  {
    criterion: 'Retenção de dados',
    category: 'Capacidades',
    values: {
      'Grafana Cloud':    'Configurável até anos — paga pelo armazenamento',
      'Self-hosted LGTM': 'Anos via S3 — barato para dados antigos',
      'Híbrido':          'Self-host para retenção longa; Cloud para janela curta',
    },
    winner: 'Self-hosted LGTM',
  },
  {
    criterion: 'OnCall / IRM integrado',
    category: 'Capacidades',
    values: {
      'Grafana Cloud':    'OnCall + IRM nativos, integração com Slack/PagerDuty',
      'Self-hosted LGTM': 'OnCall self-hosted (Open source) — funciona, menos polido',
      'Híbrido':          'Cloud OnCall mesmo em setup self-host de telemetria',
    },
    winner: 'Grafana Cloud',
  },
  {
    criterion: 'Risco de vendor lock-in',
    category: 'Risco',
    values: {
      'Grafana Cloud':    'Médio — dashboards/alertas exportáveis, dados não',
      'Self-hosted LGTM': 'Baixo — você controla tudo, exit é mover S3',
      'Híbrido':          'Médio — partes em Cloud têm lock-in',
    },
    winner: 'Self-hosted LGTM',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// BUILDERS
// ═══════════════════════════════════════════════════════════════════════════════

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Grafana',
    stackLabel: 'Observabilidade — LGTM Stack',
  }),

  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'Grafana',
    accentColor: C,
    stackLabel: 'Observabilidade — Grafana + LGTM',
    sections: {
      hooks: [
        { name: 'rate()',                sig: 'rate(metric_total[5m])',                              desc: 'Quando: counters de eventos (req, errors). Janela: 5m padrão. Evitar: aplicar em gauge.' },
        { name: 'histogram_quantile()',  sig: 'histogram_quantile(0.99, sum by (le)(rate(_bucket[5m])))', desc: 'Quando: P95/P99 de latência. Sempre sum BY le ANTES. Evitar: sem agregar entre instâncias.' },
        { name: 'sum by (label)',        sig: 'sum by (status) (rate(...[5m]))',                     desc: 'Quando: agregar mantendo dimensão. Evitar: sum sem by, perde toda dimensionalidade.' },
        { name: 'increase()',            sig: 'increase(errors_total[1h])',                          desc: 'Quando: alerta tipo "X erros em 5m". Evitar: usar em gauge, só counter.' },
        { name: 'topk(N, expr)',         sig: 'topk(5, sum by (endpoint)(rate(req[5m])))',           desc: 'Quando: tabela de top N (endpoints, services). Evitar: em time series — vira gráfico ilegível.' },
        { name: 'avg_over_time()',       sig: 'avg_over_time(cpu_usage[5m])',                        desc: 'Quando: média de gauge na janela. Evitar: usar em counter (use rate).' },
      ],
      depRows: [
        ['LogQL — selector', '{service="api", env="prod"} — só labels, NUNCA user_id'],
        ['LogQL — line',     '|= contém · != não-contém · |~ regex · !~ não-regex'],
        ['LogQL — parser',   '| json · | logfmt · | pattern · | regexp'],
        ['LogQL — métrica',  'rate({...} |= "ERR" [5m]) — vira métrica do log'],
        ['TraceQL — id',     '{ trace:id = "..." } — lookup direto, mais rápido'],
        ['TraceQL — attr',   '{ resource.service.name = "..." && status = error }'],
        ['TraceQL — multi',  '{...} && {...} — spans diferentes do mesmo trace'],
      ],
      rules: [
        { ok: true,  t: 'Sempre defina o datasource por uid em cada query (não use default)' },
        { ok: true,  t: '$env e $service como variables obrigatórias em todo dashboard' },
        { ok: true,  t: 'Multi-value variable: usar =~"$service" (regex) em vez de ="$service"' },
        { ok: true,  t: 'allowUiUpdates: false em prod — edição via UI bloqueada, só PR' },
        { ok: true,  t: 'JSON em Git, provisioning via Terraform/Helm' },
        { ok: false, t: 'NUNCA labels com cardinalidade alta no Loki (user_id, trace_id, IP)' },
        { ok: false, t: 'NUNCA dashboard com 50+ painéis — divida em overview + drill-down' },
        { ok: false, t: 'NUNCA credentials no JSON do dashboard exportado' },
      ],
      performanceTips: [
        'Recording rules pré-computam histogram_quantile sobre janelas longas — dashboard de SLO fica instantâneo',
        'Tempo é ~10x mais barato que Jaeger+ES; Loki ~10x mais barato que ES; Mimir escala horizontal além de Prometheus',
        'Exemplars: 4 configs obrigatórias — flag Prometheus, scrape_protocols OpenMetrics, exemplarTraceIdDestinations no datasource, painel ativado',
        'memory_limiter SEMPRE primeiro processor do OTel Collector — sem ele OOM mata o Collector e cega a observabilidade',
        'Library panels reusam definição entre dashboards — atualizar uma vez propaga para todos',
        'Annotation de deploy via webhook do CI = 5 min para implementar, reduz MTTD em incidentes pós-deploy drasticamente',
      ],
      patterns: [
        { name: 'SLO Dashboard', code: 'stat avail + stat budget + ts burn-rate + ts p99 + table top errors + logs', desc: 'Padrão de dashboard SRE: 6 painéis enxutos cobrem 95% dos casos.' },
        { name: 'RED Metrics',    code: 'Rate (req/s) + Errors (5xx %) + Duration (p99)',                              desc: 'Trio canônico de SLI por serviço. RED em time series com $service variable.' },
        { name: 'Multi-window burn rate', code: 'page: rate1h > 14*budget AND rate6h > 14*budget',                   desc: 'Alerta sem flapping nem detecção tardia. AND elimina spike.' },
        { name: 'Dashboard-as-code', code: 'UI sandbox -> JSON export -> PR -> Terraform -> prod (allowUiUpdates: false)', desc: 'Workflow padrão de times maduros. Library panels e Grafonnet aceleram.' },
      ],
      mentalModels: [
        'Grafana NÃO armazena dados — é só UI. Cada datasource é um plugin que traduz query para o backend',
        'LGTM = Loki (logs por label) + Grafana (UI) + Tempo (traces sem índice) + Mimir (Prometheus escalável)',
        'Exemplars conectam métrica a trace específico em 1 clique — feature mais valiosa da observabilidade moderna',
        'Sem error budget policy + multi-window burn rate, SLO vira métrica de vaidade',
        'Ordem do alerta: Normal -> Pending (aguarda for) -> Firing (notifica) -> Normal (Resolved). For evita flapping',
      ],
    },
  }),

  'quick-ref': () => buildQuickRefPdf({
    columns: QUICK_REF,
    skillName: 'Grafana',
    accentColor: C,
    stackLabel: 'Observabilidade · LGTM',
    tagline: 'PromQL · LogQL · TraceQL · Alerting · Painéis — referência de bolso',
  }),

  antipatterns: () => buildAntipatternsPdf({
    antipatterns: ANTI_PATTERNS,
    accentColor: C,
    skillName: 'Grafana',
    stackLabel: 'Observabilidade — LGTM Stack',
  }),

  comparative: () => buildComparativeRefPdf({
    options: COMP_OPTIONS,
    criteria: COMP_CRITERIA,
    skillName: 'Grafana Cloud vs Self-hosted LGTM vs Híbrido',
    accentColor: C,
    stackLabel: 'Decisão arquitetural de observabilidade',
    scenarios: [
      { scenario: 'Startup com 5-15 engenheiros, volume baixo',          recommendation: 'Grafana Cloud (Free tier)',  reason: 'Free tier cobre tudo. Zero operação para focar no produto. Migra depois se estourar.' },
      { scenario: 'Scale-up com 20-50 engs e USD 500-2k/mês de budget',  recommendation: 'Grafana Cloud (Pro tier)',   reason: 'Cloud Pro é mais barato que ter 1 SRE dedicado a operar LGTM. Compra produtividade.' },
      { scenario: 'Time médio com K8s + 1-2 SREs, volume estourando free', recommendation: 'Self-hosted LGTM (kube-prometheus-stack)', reason: 'Em volume médio-alto, self-host é 5-10x mais barato. Operação viável com SREs existentes.' },
      { scenario: 'Empresa grande com 50+ engs, SOC2/dados na região',  recommendation: 'Self-hosted LGTM com Mimir multi-tenant + Enterprise', reason: 'Compliance exige self-host. Mimir multi-tenant isola por BU. Enterprise para RBAC granular.' },
      { scenario: 'Empresa com prod regulada e dev/staging livres',     recommendation: 'Híbrido: Cloud free para dev/staging + self-host prod', reason: 'Equipes de produto têm acesso instantâneo em dev sem ticket de SRE. Prod controlada self-hosted.' },
    ],
  }),
}

// ═══════════════════════════════════════════════════════════════════════════════
// Componente principal
// ═══════════════════════════════════════════════════════════════════════════════

export default function GrafanaPdfs() {
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
