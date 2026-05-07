import type { SkillContent } from "@/types"

const grafana: SkillContent = {
    tagline: "Plataforma de visualização e alerta para métricas, logs e traces — UI central da observabilidade moderna.",
    why: "Grafana é o frontend padrão de praticamente toda stack de observabilidade open source. Saber criar dashboards úteis (não bonitos por bonito), configurar alerting com notification policies, operar o LGTM stack (Loki, Grafana, Tempo, Mimir) e correlacionar métricas → traces → logs via exemplars e trace_id é diferencial decisivo em vagas de SRE, DevOps e backend sênior. Quem domina Grafana resolve incidentes em minutos; quem só sabe abrir dashboard fica horas adivinhando. Empresas BR (iFood, Nubank, Mercado Livre) usam LGTM em produção massiva — saber o trade-off vs. Datadog/New Relic é argumento de arquitetura em entrevistas.",
    prerequisite: "Prometheus básico (para entender data sources de métricas, scraping, PromQL com rate/histogram_quantile/sum by). Conceito de série temporal e percentil (p50, p99). YAML (provisioning). Para LGTM completo: noções de OpenTelemetry, distributed tracing (trace_id, span) e log structured (JSON com campos consistentes). Não precisa ser expert em nenhum, mas precisa entender por que p99 é diferente de média antes de Grafana fazer sentido.",
    summary: "Grafana é a UI de observabilidade open source de fato. Conecta a 60+ data sources (Prometheus, Loki, Tempo, Mimir, Elasticsearch, CloudWatch, InfluxDB, PostgreSQL, MySQL, Datadog, etc.) e gera dashboards com painéis (time series, stat, gauge, table, heatmap, logs, traces, node graph). A versão moderna trouxe Grafana Alerting unificado, substituindo o legacy alerting — agora alertas funcionam com qualquer data source, não só Prometheus.\n\nO LGTM Stack é a suite open source completa da Grafana Labs: Loki (logs indexando só labels, ~10x mais barato que Elasticsearch), Grafana (UI), Tempo (traces armazenados em object storage sem índice de atributos), Mimir (Prometheus escalável horizontalmente, multi-tenant, retenção longa). Alternativa direta ao Datadog/New Relic com custo de infraestrutura — mas exige time pra operar. Para times pequenos, Grafana Cloud (SaaS) entrega o stack gerenciado.\n\nExemplars são a feature que separa observabilidade básica de moderna: um ponto no gráfico de p99 leva direto ao trace específico daquele spike. Sem exemplars, você adivinha qual trace causou a latência alta. Com exemplars, é um clique. Requer Prometheus com OpenMetrics + Tempo + correlação via trace_id.\n\nVariables (templating) transformam dashboards estáticos em ferramentas: $env, $service, $namespace populados via label_values() viram dropdowns que filtram todos os painéis simultaneamente. Dashboard sem variables é dashboard hardcoded — não escala em times grandes.\n\nA prática moderna é dashboards-as-code: JSON do dashboard versionado em Git, provisionado via Terraform (grafana provider) ou Helm (kube-prometheus-stack). Mudanças passam por code review como qualquer código de produção.",
    howToStudy: "<strong>Tem 30 minutos antes de entrevista?</strong> Fique na aba <em>Do zero à entrevista</em> — revise o LGTM stack (diagrama 1), os tipos de painel, o conceito de exemplar e treine as Q&As de <strong>nível pleno</strong> em voz alta. Se sobrar tempo, leia gotchas e resposta de Grafana Cloud vs. self-hosted.<br><br><strong>Tem um fim de semana?</strong> Suba Grafana + Prometheus + Loki localmente via docker-compose. Crie um dashboard com 4 painéis (RED metrics: rate, errors, duration), adicione $service como variable, configure um alerta no Slack via webhook. Em seguida, percorra os keypoints em ordem com a UI aberta — reproduza cada exemplo.<br><br><strong>Tem uma semana?</strong> Implemente a stack completa (Loki + Tempo + Mimir + Grafana), instrumente um app em Node.js com OpenTelemetry, gere exemplars no Prometheus, configure correlação trace ↔ log via trace_id e construa um dashboard de SLO com error budget e burn rate. Versione o JSON em Git. Treine todas as Q&As de nível sênior — especialmente sobre dashboard-as-code e multi-tenancy.",
    keypoints: [
      {
        title: "Data sources — a abstração que conecta tudo",
        body: "Grafana não armazena dados — ele consulta. Cada data source é um plugin que traduz queries (PromQL, LogQL, TraceQL, SQL) para o backend correto. Built-in: Prometheus, Loki, Tempo, Mimir, Elasticsearch, InfluxDB, PostgreSQL, MySQL, CloudWatch, Azure Monitor, Google Cloud Monitoring, Tempo, Jaeger. Um painel pode misturar data sources com a query de tipo 'Mixed' — ex: linha de métricas do Prometheus + anotações de eventos do PostgreSQL no mesmo gráfico. Default data source é o ponto comum de erro: queries copiadas entre dashboards quebram silenciosamente quando o default difere.",
        code: `# datasources.yaml (provisioning)
apiVersion: 1
datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    jsonData:
      timeInterval: "15s"
      exemplarTraceIdDestinations:
        - name: trace_id
          datasourceUid: tempo

  - name: Loki
    type: loki
    url: http://loki:3100
    jsonData:
      derivedFields:
        - name: trace_id
          matcherRegex: 'trace_id=(\\w+)'
          url: '$\${__value.raw}'
          datasourceUid: tempo

  - name: Tempo
    type: tempo
    uid: tempo
    url: http://tempo:3200
    jsonData:
      tracesToLogsV2:
        datasourceUid: loki
        tags: ['service.name']`,
      },
      {
        title: "Tipos de painel — escolher errado é a primeira gotcha",
        body: "Time series (linha): séries temporais — uso 80% dos casos. Stat: valor único agora (uptime%, requests/s atuais) com sparkline. Gauge/Bar gauge: valor vs. threshold visual (semáforo). Table: dados tabulares com filtros, ordenação, transformations. Heatmap: distribuição ao longo do tempo — ideal para histogram_quantile() de latência por bucket. Logs: stream do Loki com regex highlighting. Traces: visualização do Tempo (waterfall). Node Graph: topologia de serviços via traces. State timeline: estados discretos (up/down/degraded). Status history: bandas coloridas por janela. Pie/Bar chart: NÃO use para séries temporais — use para snapshot atual de proporções. Geomap: dados georreferenciados.",
      },
      {
        title: "Variables (templating) — dashboard reutilizável",
        body: "Variables são dropdowns que filtram todos os painéis simultaneamente. Tipos: Query (popula via PromQL/LogQL — ex: label_values(up, service) lista todos os services existentes), Custom (lista fixa de valores), Constant (valor fixo invisível, útil em provisioning), Datasource (dropdown que troca a fonte do dashboard inteiro), Interval (janela de tempo: 1m,5m,1h), Text box (input livre), Ad hoc filters (filtros aplicados a todas as queries automaticamente). Chaining é o que escala: $namespace filtra options de $service via {namespace='$namespace'}. Multi-value: variável aceita múltiplas seleções — use {service=~'$service'} (regex match) em vez de {service='$service'} (exact match).",
        code: `# Variable $namespace (Query type)
label_values(kube_namespace_created, namespace)

# Variable $service depende de $namespace (chaining)
label_values(up{namespace=~"$namespace"}, service)

# Uso no painel — multi-value safe
sum by (status) (
  rate(http_requests_total{
    namespace=~"$namespace",
    service=~"$service"
  }[5m])
)

# Repeating panels — gera 1 painel por valor de $service
# Painel options → Repeat options → Repeat by variable: service`,
      },
      {
        title: "Grafana Alerting — unificado pós v9",
        body: "Substituiu o legacy alerting. Funciona com qualquer data source (Prometheus, Loki, Elasticsearch, CloudWatch — não só Prometheus). Estrutura: Alert rule (avaliação periódica de query + condição) → Alert state (Normal, Pending, Firing, NoData, Error) → Notification policy (routing por labels) → Contact point (Slack, PagerDuty, OpsGenie, email, webhook). For: tempo mínimo que a condição deve persistir antes de virar Firing — evita flapping. Group by, group wait, group interval: agrupam alertas similares numa notificação. Mute timings: silenciar em horário (manutenção). Silences: silenciar por matcher de labels temporariamente.",
        code: `# alert-rule.yaml (provisioning)
apiVersion: 1
groups:
  - name: api-slo
    interval: 1m
    rules:
      - uid: api-error-rate-burn
        title: API Error Rate — fast burn
        condition: C
        data:
          - refId: A
            datasourceUid: prometheus
            model:
              expr: |
                sum(rate(http_requests_total{status=~"5..",service="api"}[1h]))
                /
                sum(rate(http_requests_total{service="api"}[1h]))
          - refId: C
            datasourceUid: __expr__
            model:
              type: threshold
              expression: A
              conditions:
                - evaluator: {params: [0.0144], type: gt}
        for: 2m
        labels:
          severity: critical
          team: platform
        annotations:
          summary: 'Error budget burn rate > 14x for {{$labels.service}}'
          runbook_url: https://runbooks.example/slo-burn`,
      },
      {
        title: "Loki — logs por labels (não por conteúdo)",
        body: "Sistema de logs do LGTM. Indexa APENAS labels (service, env, pod, level), não o conteúdo. Resultado: ~10x mais barato que Elasticsearch para o mesmo volume. Trade-off: busca full-text faz scan dos chunks (mais lenta), mas funciona. LogQL = PromQL para logs. Sintaxe: {seletor de stream} |= 'filtro de linha' | parser | filtro de label. Operadores: |= (contém), != (não contém), |~ (regex match), !~ (regex non-match). Parsers: | json (extrai campos JSON), | logfmt (key=val), | pattern (template), | regexp. Cardinalidade explode se você usar campos dinâmicos como label (user_id, request_id) — coloca isso no conteúdo do log, NUNCA como label do Loki.",
        code: `# LogQL — operadores essenciais

# 1. Logs de erro da API em prod
{service="api", env="prod", level="error"}

# 2. Filtro de conteúdo + parse JSON
{service="api"} | json | status_code >= 500

# 3. Métrica derivada: rate de erros por endpoint
sum by (endpoint) (
  rate({service="api"} | json | level="error" [5m])
)

# 4. Correlação com trace via trace_id
{service="api"} | json | trace_id="4bf92f3577b34da6a3ce929d0e0e4736"

# 5. P99 de latência extraída de logs (campo duration_ms)
quantile_over_time(0.99,
  {service="api"} | json | unwrap duration_ms [5m]
) by (endpoint)

# ANTI-PATTERN: explosão de cardinalidade
# {service="api", user_id="12345"}  ← NUNCA: user_id como label
# Use no conteúdo: log.info({user_id: 12345}, 'request')`,
      },
      {
        title: "Tempo — traces em object storage",
        body: "Backend de traces distribuídos da Grafana Labs. Ingestão via OTLP (recomendado), Jaeger, Zipkin, OpenCensus. Armazena spans em object storage (S3, GCS, Azure Blob). Filosofia: sem índice de atributos — busca direta por trace_id é rápida e barata, busca por atributo (status=error, duration > 1s) usa TraceQL e é mais lenta. Trade-off vs. Jaeger: Tempo é ~10x mais barato (S3 vs. Elasticsearch) mas tem busca menos rica. Para casos onde você sempre tem trace_id (logs correlacionados, exemplars), Tempo brilha. Para discovery exploratório de spans lentos sem trace_id, Jaeger ainda vence.",
        code: `# TraceQL — query language do Tempo

# 1. Trace específico (busca direta — rápida)
{ trace:id = "4bf92f3577b34da6a3ce929d0e0e4736" }

# 2. Spans com erro de um serviço
{ resource.service.name = "checkout" && status = error }

# 3. Spans HTTP lentos (> 1s)
{ span.http.method = "POST" && duration > 1s }

# 4. Trace que tem span com erro E span de DB > 500ms
{ status = error } && { span.db.system = "postgresql" && duration > 500ms }

# 5. Aggregations (Tempo 2.x)
{ resource.service.name = "api" } | rate() by (span.http.route)
{ resource.service.name = "api" } | quantile_over_time(duration, .99) by (span.http.route)`,
      },
      {
        title: "Mimir — Prometheus escalável e multi-tenant",
        body: "Backend de métricas do LGTM. API 100% compatível com Prometheus (você troca o endpoint do Grafana e funciona). Diferenças: escala horizontal (ingester, querier, store-gateway, compactor separados), multi-tenant nativo (header X-Scope-OrgID isola dados por time/cliente), retenção longa em object storage (anos), querying eficiente sobre dados antigos. Substitui Thanos/Cortex (na verdade, Mimir é fork do Cortex). Use quando: múltiplos clusters Prometheus para federar, retenção > 90 dias, multi-tenancy real (SaaS B2B). Para 1 cluster pequeno com retenção curta, Prometheus puro basta.",
      },
      {
        title: "Exemplars — métrica → trace específico",
        body: "Feature mais poderosa da observabilidade moderna. Exemplar é um trace_id anexado a um data point da métrica — ex: ponto p99 às 14h32 traz o trace_id da requisição que causou aquele percentil. No Grafana, exemplars aparecem como diamantes coloridos no gráfico; clique abre o trace no Tempo. Requer: aplicação instrumentada com OTel emitindo exemplars (geralmente automático em histogram), Prometheus com OpenMetrics ativado (--enable-feature=exemplar-storage), data source do Prometheus configurado com exemplarTraceIdDestinations apontando para Tempo. Sem exemplars, debugar p99 alto = adivinhar entre milhares de traces. Com exemplars, é 1 clique.",
        code: `# 1. Aplicação Node.js — exemplars automáticos via OTel SDK
import { metrics } from '@opentelemetry/api'
const histogram = metrics.getMeter('app').createHistogram('http_request_duration')
// trace_id atual é injetado automaticamente como exemplar

# 2. Prometheus config — habilitar exemplar storage
# prometheus --enable-feature=exemplar-storage
# scrape_configs:
#   - job_name: 'app'
#     scrape_protocols: [OpenMetricsText1.0.0]

# 3. Grafana data source (Prometheus)
# Configurations → Data sources → Prometheus → Exemplars
# Internal link: enabled
# URL: $\${__value.raw}
# Label name: trace_id
# Data source: Tempo

# 4. PromQL com exemplars no painel
histogram_quantile(0.99,
  sum by (le) (rate(http_request_duration_bucket[5m]))
)
# Painel options → "Exemplars" → ativar`,
      },
      {
        title: "Annotations — eventos no contexto do gráfico",
        body: "Linhas verticais ou regiões em painéis marcando eventos: deploys, incidentes, releases, manutenção. Tipos: built-in (Grafana cria — alerts firing), query-based (busca no data source — ex: query no PostgreSQL de tabela deployments), tag-based (filtra annotations existentes). Sem annotations de deploy, gráfico de erro spike vira mistério: foi deploy? foi tráfego? foi degradação de DB? Com annotation, é óbvio: linha vertical na hora do deploy + spike imediato = causa identificada em segundos.",
        code: `# Annotation query (PostgreSQL data source)
SELECT
  deployed_at AS time,
  service || ' v' || version AS text,
  ARRAY['deploy', service, env] AS tags
FROM deployments
WHERE $__timeFilter(deployed_at)
  AND env = '$env'

# Annotation query (Loki — annotations de eventos de Kubernetes)
{job="kubernetes-events"} |= "Deployment"
| json
| line_format "{{.message}}"

# Em código: webhook de CI/CD chama API do Grafana
POST /api/annotations
{
  "dashboardUID": "checkout",
  "panelId": 3,
  "time": 1730390400000,
  "tags": ["deploy", "v2.4.1"],
  "text": "Deploy v2.4.1 — checkout-service"
}`,
      },
      {
        title: "Dashboard-as-code — JSON em Git, provisioning e Terraform",
        body: "Prática moderna: dashboards são código versionado, não artefatos da UI. Workflow: edit no Grafana (sandbox) → export JSON → commit em Git → CI valida sintaxe → provisioning sincroniza prod. Provisioning via filesystem: arquivos JSON em /etc/grafana/provisioning/dashboards/ + dashboard providers config. Provisioning via Terraform: grafana_dashboard resource com jsonencode(file('checkout.json')). Provisioning via Helm: kube-prometheus-stack inclui dashboards como ConfigMaps. Vantagem: code review de mudanças, rollback via git revert, prevenção de dashboards perdidos por exclusão acidental. Grafonnet (Jsonnet) gera JSON a partir de código com loops e DRY.",
        code: `# Terraform — dashboard versionado
resource "grafana_dashboard" "checkout" {
  config_json = file("\${path.module}/dashboards/checkout.json")
  folder      = grafana_folder.platform.id
  overwrite   = true
}

resource "grafana_folder" "platform" {
  title = "Platform"
}

# Provisioning via filesystem (dashboards.yaml)
apiVersion: 1
providers:
  - name: 'platform'
    folder: 'Platform'
    type: file
    disableDeletion: true
    allowUiUpdates: false  # bloqueia edição via UI em prod
    options:
      path: /etc/grafana/provisioning/dashboards/platform

# Helm values (kube-prometheus-stack)
grafana:
  dashboardsConfigMaps:
    - configMapName: custom-dashboards
      fileName: checkout-slo.json`,
      },
      {
        title: "Grafana OnCall — gerenciamento de plantão integrado",
        body: "Produto da Grafana Labs (open source + Cloud) para incident management. Substitui PagerDuty/OpsGenie integrado ao stack. Schedules (rotação de plantão), escalation chains (notifica primeiro, depois secundário, depois manager), routing por labels do alerta (severity=critical → page imediato; severity=warning → ticket no horário comercial). Integra com Slack (criação automática de canal por incidente), webhook in/out, calendar (Google/iCal). Para times pequenos com plantão simples, OnCall basta. Para times grandes com runbooks complexos e auditoria SOC2, PagerDuty ainda lidera.",
      },
      {
        title: "RBAC — permissões em times grandes",
        body: "Grafana Enterprise/Cloud tem RBAC granular: roles (Admin, Editor, Viewer) + permissions específicas (datasources:read, dashboards:write em folder X). Teams agrupam usuários e recebem permissions em folders. Padrão recomendado: cada squad tem 1 folder + 1 team com Edit no folder; Admin global limitado a SREs; Viewer geral para todos os engenheiros (transparência). Service accounts substituem API keys (deprecated) — para automação (provisioning, CI/CD). LDAP/SAML/OAuth (Google, GitHub, Okta) para SSO.",
      },
      {
        title: "Recording rules — pré-computação de queries pesadas",
        body: "Prática essencial em dashboards de SLO/burn rate. Em vez de cada refresh do dashboard executar histogram_quantile() sobre 30 dias de dados (caro), Prometheus pré-computa a métrica derivada a cada 1 minuto e salva como nova série. Dashboard consulta a série pré-computada (instantâneo). Convenção de nome: nivel:metrica:operacao (ex: job:http_requests:error_rate_5m). Implementação via PrometheusRule (Kubernetes) ou rules.yml (vanilla). Mimir/Cortex também suporta rules separadas por tenant.",
        code: `# recording-rules.yaml
groups:
  - name: api-slo
    interval: 30s
    rules:
      - record: job:http_requests:rate_5m
        expr: |
          sum by (job, status) (
            rate(http_requests_total[5m])
          )

      - record: job:http_request_duration_seconds:p99_5m
        expr: |
          histogram_quantile(0.99,
            sum by (job, le) (
              rate(http_request_duration_seconds_bucket[5m])
            )
          )

      - record: job:sli_errors:ratio_rate_5m
        expr: |
          sum by (job) (rate(http_requests_total{status=~"5.."}[5m]))
          /
          sum by (job) (rate(http_requests_total[5m]))

      - record: job:sli_errors:ratio_rate_1h
        expr: |
          sum by (job) (rate(http_requests_total{status=~"5.."}[1h]))
          /
          sum by (job) (rate(http_requests_total[1h]))`,
      },
      {
        title: "Faro — Real User Monitoring (RUM) no LGTM",
        body: "SDK frontend da Grafana para coleta de métricas, logs e traces do navegador real do usuário. Captura Core Web Vitals (LCP, INP, CLS), erros JS, navegação SPA, sessões. Envia via OTel para o stack LGTM — mesma UI que backend. Diferencial: correlação browser → backend via trace propagation (W3C traceparent). Você vê uma sessão lenta de usuário, clica num span de fetch, vai pro trace backend, identifica o query SQL lento. Alternativa open source ao Datadog RUM/New Relic Browser. Para sites simples, Web Vitals + Sentry basta. Para SPA complexo com debugging E2E, Faro vale.",
      },
    ],
    diagrams: [
      {
        title: "LGTM Stack — coleta, armazenamento e correlação visual",
        html: `<style>
.graf-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.graf-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(244,104,0,.4);display:inline}
.graf-tip:hover .graf-tb{display:block}
.graf-tb{display:none;position:absolute;bottom:calc(100%+8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:230px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.8)}
.graf-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.graf-card{background:#1e293b;border-radius:10px;padding:12px;border:1.5px solid #334155;position:relative}
.graf-ltr{font-size:22px;font-weight:900;margin-bottom:2px;line-height:1}
.graf-name{font-size:10.5px;font-weight:700;margin-bottom:4px}
.graf-desc{font-size:9.5px;color:#64748b;line-height:1.45}
.graf-pill{display:inline-block;font-size:8.5px;padding:2px 7px;border-radius:10px;background:#0f172a;border:1px solid #334155;color:#94a3b8;margin-top:6px;margin-right:3px;font-family:'JetBrains Mono',monospace}
.graf-pulse{display:inline-block;width:6px;height:6px;border-radius:50%;background:#F46800;animation:graf-pulse 1.4s ease-in-out infinite;margin-right:6px}
@keyframes graf-pulse{0%,100%{opacity:.4;transform:scale(.85)}50%{opacity:1;transform:scale(1.1)}}
</style>
<div class="graf-wrap">
  <p style="font-size:12px;font-weight:600;margin:0 0 4px;color:#F46800">LGTM Stack — coleta, armazenamento, correlação</p>
  <p style="font-size:10px;color:#475569;margin:0 0 16px">Passe o mouse nos <span style="border-bottom:1px dashed rgba(244,104,0,.4)">termos sublinhados</span>. As 3 camadas: app → backends → UI única.</p>

  <div style="background:#1e293b;border-radius:8px;padding:10px 13px;margin-bottom:12px;border:1px solid #334155">
    <div style="font-size:9px;color:#94a3b8;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px;font-weight:600">① Suas aplicações instrumentadas</div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <span class="graf-pill"><span class="graf-tip">OTLP traces<span class="graf-tb">OpenTelemetry Protocol — formato padronizado para enviar traces ao Tempo. Substitui Jaeger/Zipkin protocols.</span></span></span>
      <span class="graf-pill"><span class="graf-tip">/metrics<span class="graf-tb">Endpoint HTTP em texto plano que Prometheus/Mimir scrapeiam a cada 15s. Formato OpenMetrics suporta exemplars.</span></span></span>
      <span class="graf-pill"><span class="graf-tip">logs JSON stdout<span class="graf-tb">Logs estruturados com trace_id incluído. Promtail/Alloy coleta de containers e envia ao Loki.</span></span></span>
      <span class="graf-pill"><span class="graf-tip">profiles<span class="graf-tb">Pyroscope (parte do LGTM expandido) coleta CPU/memory profiles continuamente. P de "Pyroscope" é o quinto pilar moderno.</span></span></span>
    </div>
  </div>

  <div style="font-size:9px;color:#94a3b8;letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px;font-weight:600;padding-left:2px">② Backends de armazenamento</div>
  <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:12px">

    <div class="graf-card" style="border-color:rgba(255,204,0,.35)">
      <div class="graf-ltr" style="color:#ffcc00">L</div>
      <div class="graf-name" style="color:#ffcc00">Loki — Logs</div>
      <div class="graf-desc">
        <span class="graf-tip">Indexa só labels<span class="graf-tb">{service, env, pod, level} — não o conteúdo. Resultado: ~10x mais barato que Elasticsearch para o mesmo volume.</span></span>. LogQL. Object storage (S3).
      </div>
      <div style="margin-top:6px"><span class="graf-pill" style="color:#ffcc00">LogQL</span><span class="graf-pill">S3/GCS</span></div>
    </div>

    <div class="graf-card" style="border-color:rgba(244,104,0,.35)">
      <div class="graf-ltr" style="color:#F46800">G</div>
      <div class="graf-name" style="color:#F46800">Grafana — UI</div>
      <div class="graf-desc">
        <span class="graf-tip">Não armazena dados<span class="graf-tb">Grafana é apenas a UI. Cada query vai para o data source correspondente. Você pode trocar Loki por Elasticsearch sem mudar a UI.</span></span>. Dashboards, alertas, exploração, RBAC.
      </div>
      <div style="margin-top:6px"><span class="graf-pill" style="color:#F46800">Dashboards</span><span class="graf-pill">Alerting</span></div>
    </div>

    <div class="graf-card" style="border-color:rgba(99,179,237,.35)">
      <div class="graf-ltr" style="color:#63b3ed">T</div>
      <div class="graf-name" style="color:#63b3ed">Tempo — Traces</div>
      <div class="graf-desc">
        <span class="graf-tip">Sem índice de atributos<span class="graf-tb">Busca por trace_id é instantânea (lookup direto em S3). Busca por atributo (status=error) usa TraceQL — mais lenta mas funciona.</span></span>. OTLP/Jaeger/Zipkin. Object storage.
      </div>
      <div style="margin-top:6px"><span class="graf-pill" style="color:#63b3ed">TraceQL</span><span class="graf-pill">OTLP</span></div>
    </div>

    <div class="graf-card" style="border-color:rgba(230,82,44,.35)">
      <div class="graf-ltr" style="color:#E6522C">M</div>
      <div class="graf-name" style="color:#E6522C">Mimir — Métricas</div>
      <div class="graf-desc">
        <span class="graf-tip">Prometheus escalável<span class="graf-tb">API 100% compatível com Prometheus. Escala horizontal, multi-tenant via X-Scope-OrgID, retenção em S3 (anos). Substitui Cortex/Thanos.</span></span>. PromQL, multi-tenant.
      </div>
      <div style="margin-top:6px"><span class="graf-pill" style="color:#E6522C">PromQL</span><span class="graf-pill">multi-tenant</span></div>
    </div>
  </div>

  <div style="background:#1e293b;border-radius:8px;padding:12px 14px;border:1px solid rgba(244,104,0,.25)">
    <div style="font-size:9px;color:#F46800;font-weight:600;letter-spacing:.1em;text-transform:uppercase;margin-bottom:10px">③ Fluxo de investigação — alerta ao log em 4 cliques</div>

    <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;font-size:10px;margin-bottom:10px">
      <div style="background:#0f172a;border:1px solid rgba(230,82,44,.4);border-radius:6px;padding:6px 10px;color:#E6522C;display:flex;align-items:center"><span class="graf-pulse"></span>1. alerta dispara</div>
      <span style="color:#475569;font-size:14px">→</span>
      <div style="background:#0f172a;border:1px solid rgba(244,104,0,.4);border-radius:6px;padding:6px 10px;color:#F46800">2. dashboard SLO</div>
      <span style="color:#475569;font-size:14px">→</span>
      <div style="background:#0f172a;border:1px solid rgba(99,179,237,.4);border-radius:6px;padding:6px 10px;color:#63b3ed">
        <span class="graf-tip">3. exemplar → trace<span class="graf-tb">Diamante no gráfico de p99 leva diretamente ao trace específico que causou o spike. 1 clique, sem busca manual.</span></span>
      </div>
      <span style="color:#475569;font-size:14px">→</span>
      <div style="background:#0f172a;border:1px solid rgba(255,204,0,.4);border-radius:6px;padding:6px 10px;color:#ffcc00">4. logs do span</div>
    </div>

    <div style="font-size:9.5px;color:#64748b;line-height:1.7;background:#0d1421;border-radius:6px;padding:9px 11px">
      <div style="margin-bottom:4px"><strong style="color:#E6522C">Mimir → Tempo</strong>: <span class="graf-tip">exemplars<span class="graf-tb">trace_id anexado a um data point de histogram. Prometheus + OpenMetrics + exemplarTraceIdDestinations no datasource.</span></span> linkam o ponto da métrica ao trace exato.</div>
      <div style="margin-bottom:4px"><strong style="color:#63b3ed">Tempo → Loki</strong>: <span class="graf-tip">tracesToLogs<span class="graf-tb">Configuração no datasource Tempo: dado um span, abre Loki com filter {service.name=...} no intervalo do span. Logs do span aparecem instantaneamente.</span></span> abre logs filtrados pelo trace_id do span.</div>
      <div><strong style="color:#ffcc00">Loki → Tempo</strong>: <span class="graf-tip">derivedFields<span class="graf-tb">Regex no datasource Loki captura trace_id no conteúdo do log e cria link clicável para Tempo.</span></span> regex extrai trace_id de logs e cria link reverso.</div>
    </div>
  </div>
</div>`,
        caption: "LGTM resolve observabilidade completa com custo 5–10x menor que Datadog/New Relic, mas exige time pra operar. Grafana Cloud gerencia o stack — vale para times pequenos. A correlação trace ↔ log ↔ métrica é o que diferencia o stack moderno do legacy.",
      },
      {
        title: "Anatomia de um dashboard — variables, painéis e alerting rules",
        html: `<style>
.gdb-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.gdb-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(244,104,0,.4);display:inline}
.gdb-tip:hover .gdb-tb{display:block}
.gdb-tb{display:none;position:absolute;bottom:calc(100%+8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:220px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.8)}
.gdb-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.gdb-bar{background:#1e293b;border:1px solid #334155;border-radius:6px;padding:6px 10px;display:flex;align-items:center;gap:8px;font-size:10px;color:#94a3b8;flex-wrap:wrap}
.gdb-var{background:#0f172a;border:1px solid rgba(244,104,0,.3);color:#F46800;padding:3px 8px;border-radius:4px;font-family:'JetBrains Mono',monospace;font-size:9.5px;cursor:pointer;transition:all .2s}
.gdb-var:hover{background:rgba(244,104,0,.1)}
.gdb-panel{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:10px}
.gdb-ptype{font-size:8.5px;color:#94a3b8;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;display:flex;justify-content:space-between}
.gdb-ptitle{font-size:10.5px;color:#e2e8f0;font-weight:600;margin-bottom:8px}
.gdb-q{font-family:'JetBrains Mono',monospace;font-size:9px;color:#475569;background:#0d1421;border-radius:4px;padding:5px 7px;margin-bottom:8px;line-height:1.5;overflow-x:auto;white-space:nowrap}
@keyframes gdb-blink{0%,100%{opacity:.65}50%{opacity:1}}
.gdb-firing{animation:gdb-blink 1.2s ease-in-out infinite}
</style>
<div class="gdb-wrap">
  <p style="font-size:12px;font-weight:600;margin:0 0 4px;color:#F46800">Anatomia de um dashboard de checkout</p>
  <p style="font-size:10px;color:#475569;margin:0 0 14px">Top: variables (templating). Meio: painéis com PromQL. Bottom: alert rule conectada.</p>

  <div class="gdb-bar" style="margin-bottom:10px">
    <span style="font-size:8px;color:#475569;letter-spacing:.1em;text-transform:uppercase;font-weight:600">Variables</span>
    <span class="gdb-tip gdb-var">$env <span style="opacity:.5">▾</span> prod
      <span class="gdb-tb">Custom variable: prod, staging, dev. Define qual ambiente os painéis mostram. Sem ele, dashboard fica hardcoded.</span>
    </span>
    <span class="gdb-tip gdb-var">$service <span style="opacity:.5">▾</span> checkout
      <span class="gdb-tb">Query variable: label_values(up{env="$env"}, service). Populada dinamicamente — quando novo service sobe, aparece automaticamente.</span>
    </span>
    <span class="gdb-tip gdb-var">$interval <span style="opacity:.5">▾</span> 5m
      <span class="gdb-tb">Interval variable: 1m, 5m, 1h. Usada nas queries como rate(...[$interval]) — janela de cálculo configurável.</span>
    </span>
    <span style="margin-left:auto;font-size:9px;color:#64748b">↻ refresh: 30s</span>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px">

    <div class="gdb-panel">
      <div class="gdb-ptype"><span>Stat</span><span style="color:#4ade80">●</span></div>
      <div class="gdb-ptitle">Availability 30d</div>
      <div class="gdb-q">1 - sum(rate(...5..[30d]))<br>/sum(rate(...[30d]))</div>
      <div style="font-size:24px;color:#4ade80;font-weight:900;text-align:center;line-height:1">99.94%</div>
      <div style="font-size:8.5px;color:#64748b;text-align:center;margin-top:3px">SLO: 99.9% <span style="color:#4ade80">✓</span></div>
    </div>

    <div class="gdb-panel">
      <div class="gdb-ptype"><span>Time series</span><span style="color:#F46800">●</span></div>
      <div class="gdb-ptitle">P99 latency</div>
      <div class="gdb-q">histogram_quantile(0.99, ...)</div>
      <svg viewBox="0 0 100 36" preserveAspectRatio="none" width="100%" height="40" style="display:block">
        <defs><linearGradient id="gdb-lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#F46800" stop-opacity=".4"/><stop offset="100%" stop-color="#F46800" stop-opacity="0"/></linearGradient></defs>
        <polygon points="0,28 10,26 20,24 30,22 40,12 50,8 60,18 70,22 80,20 90,24 100,26 100,36 0,36" fill="url(#gdb-lg)"/>
        <polyline points="0,28 10,26 20,24 30,22 40,12 50,8 60,18 70,22 80,20 90,24 100,26" stroke="#F46800" stroke-width="1.5" fill="none"/>
        <circle cx="40" cy="12" r="2.5" fill="#fbbf24" stroke="#0f172a" stroke-width=".5"/>
        <circle cx="50" cy="8" r="2.5" fill="#fbbf24" stroke="#0f172a" stroke-width=".5"/>
      </svg>
      <div style="font-size:8px;color:#fbbf24;text-align:right;margin-top:2px">◆ <span class="gdb-tip">exemplars<span class="gdb-tb">Diamantes amarelos linkam pontos do gráfico ao trace específico no Tempo. Clique abre o trace.</span></span></div>
    </div>

    <div class="gdb-panel">
      <div class="gdb-ptype"><span>Heatmap</span><span style="color:#c084fc">●</span></div>
      <div class="gdb-ptitle">Latency distribution</div>
      <div class="gdb-q">histogram_bucket por le</div>
      <svg viewBox="0 0 100 36" preserveAspectRatio="none" width="100%" height="40">
        <rect x="0" y="0" width="20" height="6" fill="#c084fc" opacity=".15"/>
        <rect x="20" y="0" width="20" height="6" fill="#c084fc" opacity=".25"/>
        <rect x="40" y="0" width="20" height="6" fill="#c084fc" opacity=".4"/>
        <rect x="60" y="0" width="20" height="6" fill="#c084fc" opacity=".5"/>
        <rect x="80" y="0" width="20" height="6" fill="#c084fc" opacity=".55"/>
        <rect x="0" y="6" width="20" height="6" fill="#c084fc" opacity=".3"/>
        <rect x="20" y="6" width="20" height="6" fill="#c084fc" opacity=".5"/>
        <rect x="40" y="6" width="20" height="6" fill="#c084fc" opacity=".7"/>
        <rect x="60" y="6" width="20" height="6" fill="#c084fc" opacity=".85"/>
        <rect x="80" y="6" width="20" height="6" fill="#c084fc" opacity="1"/>
        <rect x="0" y="12" width="20" height="6" fill="#c084fc" opacity=".4"/>
        <rect x="20" y="12" width="20" height="6" fill="#c084fc" opacity=".55"/>
        <rect x="40" y="12" width="20" height="6" fill="#c084fc" opacity=".75"/>
        <rect x="60" y="12" width="20" height="6" fill="#c084fc" opacity=".6"/>
        <rect x="80" y="12" width="20" height="6" fill="#c084fc" opacity=".7"/>
        <rect x="0" y="18" width="20" height="6" fill="#c084fc" opacity=".2"/>
        <rect x="20" y="18" width="20" height="6" fill="#c084fc" opacity=".3"/>
        <rect x="40" y="18" width="20" height="6" fill="#c084fc" opacity=".5"/>
        <rect x="60" y="18" width="20" height="6" fill="#c084fc" opacity=".4"/>
        <rect x="80" y="18" width="20" height="6" fill="#c084fc" opacity=".5"/>
      </svg>
      <div style="font-size:8px;color:#64748b;text-align:right;margin-top:2px">linhas: le buckets</div>
    </div>

    <div class="gdb-panel">
      <div class="gdb-ptype"><span>Table</span><span style="color:#60a5fa">●</span></div>
      <div class="gdb-ptitle">Top endpoints by error rate</div>
      <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:#94a3b8">
        <div style="display:flex;justify-content:space-between;border-bottom:1px solid #334155;padding-bottom:2px;margin-bottom:3px;font-size:8px;color:#475569">endpoint &nbsp; rate &nbsp; err%</div>
        <div style="display:flex;justify-content:space-between;padding:1px 0">/pay &nbsp;&nbsp;&nbsp;&nbsp; <span style="color:#ef4444">2.3%</span></div>
        <div style="display:flex;justify-content:space-between;padding:1px 0">/cart &nbsp;&nbsp;&nbsp;&nbsp; <span style="color:#fbbf24">0.8%</span></div>
        <div style="display:flex;justify-content:space-between;padding:1px 0">/auth &nbsp;&nbsp;&nbsp;&nbsp; <span style="color:#4ade80">0.1%</span></div>
      </div>
    </div>

    <div class="gdb-panel">
      <div class="gdb-ptype"><span>Gauge</span><span style="color:#fbbf24">●</span></div>
      <div class="gdb-ptitle">Error budget remaining</div>
      <svg viewBox="0 0 100 36" width="100%" height="48" style="display:block">
        <path d="M 10,30 A 30,30 0 0,1 90,30" stroke="#1e293b" stroke-width="6" fill="none"/>
        <path d="M 10,30 A 30,30 0 0,1 65,8" stroke="#fbbf24" stroke-width="6" fill="none" stroke-linecap="round"/>
        <text x="50" y="28" text-anchor="middle" font-size="11" font-weight="bold" fill="#fbbf24">62%</text>
      </svg>
      <div style="font-size:8.5px;color:#64748b;text-align:center;margin-top:-4px">~26 min restantes</div>
    </div>

    <div class="gdb-panel">
      <div class="gdb-ptype"><span>Logs</span><span style="color:#ffcc00">●</span></div>
      <div class="gdb-ptitle">Recent errors (Loki)</div>
      <div class="gdb-q">{service="$service"} | json | level="error"</div>
      <div style="font-family:'JetBrains Mono',monospace;font-size:8.5px;color:#64748b;line-height:1.5;background:#0d1421;border-radius:4px;padding:5px 7px">
        <div><span style="color:#475569">14:32</span> <span style="color:#ef4444">ERR</span> payment timeout</div>
        <div><span style="color:#475569">14:31</span> <span style="color:#ef4444">ERR</span> stripe 5xx</div>
        <div><span style="color:#475569">14:29</span> <span style="color:#fbbf24">WARN</span> retry</div>
      </div>
    </div>
  </div>

  <div style="background:#1a0a0a;border:1px solid rgba(239,68,68,.4);border-radius:8px;padding:12px 14px">
    <div style="font-size:9px;color:#ef4444;font-weight:600;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px;display:flex;align-items:center;gap:6px">
      <span class="gdb-firing" style="width:7px;height:7px;border-radius:50%;background:#ef4444;display:inline-block"></span>
      Alert rule conectada — Multi-window burn rate
    </div>
    <div style="font-family:'JetBrains Mono',monospace;font-size:9.5px;color:#94a3b8;line-height:1.6;background:#0d1421;border-radius:5px;padding:8px 10px">
      <span style="color:#7c3aed">expr</span>: <span class="gdb-tip" style="color:#fbbf24">burn_rate_1h<span class="gdb-tb">Taxa atual de consumo do error budget na última 1h. Se 14, esgota o budget mensal em 2 dias.</span></span> &gt; 14 <span style="color:#ef4444">AND</span> burn_rate_6h &gt; 14<br>
      <span style="color:#7c3aed">for</span>: 2m &nbsp;&nbsp; <span style="color:#7c3aed">labels</span>: severity=critical, team=platform<br>
      <span style="color:#7c3aed">routes to</span>: <span style="color:#94a3b8">contact_point</span> = <span class="gdb-tip" style="color:#F46800">slack-platform-oncall<span class="gdb-tb">Notification policy roteia por labels (team=platform, severity=critical) para o contact point correto. Mute timings em janela de manutenção.</span></span>
    </div>
  </div>
</div>`,
        caption: "Dashboard moderno tem 3 camadas: variables (dropdown filtra tudo), painéis (cada um com query e tipo apropriado), alert rule (mesma query do painel vira alerta). JSON desse dashboard fica em Git, provisionado via Terraform.",
      },
      {
        title: "Workflow de investigação — alerta no Slack ao log corrigido",
        html: `<style>
.gw-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.gw-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(244,104,0,.4);display:inline}
.gw-tip:hover .gw-tb{display:block}
.gw-tb{display:none;position:absolute;bottom:calc(100%+8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:230px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.8)}
.gw-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.gw-step{display:flex;gap:12px;align-items:flex-start;padding:12px;background:#1e293b;border:1px solid #334155;border-radius:8px;margin-bottom:8px;position:relative}
.gw-num{width:26px;height:26px;border-radius:50%;background:#0f172a;border:1.5px solid #F46800;color:#F46800;font-weight:700;display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0;font-family:'JetBrains Mono',monospace}
.gw-time{font-size:8px;color:#475569;font-family:'JetBrains Mono',monospace;letter-spacing:.05em;margin-bottom:3px;text-transform:uppercase}
.gw-title{font-size:11px;color:#e2e8f0;font-weight:600;margin-bottom:4px}
.gw-desc{font-size:10px;color:#64748b;line-height:1.55}
.gw-code{font-family:'JetBrains Mono',monospace;font-size:9px;background:#0d1421;border-radius:4px;padding:5px 7px;margin-top:5px;color:#94a3b8;line-height:1.5;border:1px solid #1e293b}
@keyframes gw-blink{0%,100%{background:rgba(239,68,68,.08);border-color:rgba(239,68,68,.3)}50%{background:rgba(239,68,68,.18);border-color:rgba(239,68,68,.55)}}
.gw-active{animation:gw-blink 1.4s ease-in-out infinite}
</style>
<div class="gw-wrap">
  <p style="font-size:12px;font-weight:600;margin:0 0 4px;color:#F46800">Workflow de investigação — incidente real, do alerta à correção</p>
  <p style="font-size:10px;color:#475569;margin:0 0 16px">Cenário: SLO da checkout-api violando. 14h32, sexta-feira.</p>

  <div class="gw-step gw-active" style="border-color:rgba(239,68,68,.3)">
    <div class="gw-num" style="border-color:#ef4444;color:#ef4444">1</div>
    <div style="flex:1">
      <div class="gw-time">14:32:12 — Slack #platform-oncall</div>
      <div class="gw-title" style="color:#ef4444">Alerta: checkout-api error budget burn rate &gt; 14×</div>
      <div class="gw-desc">Notification policy do Grafana Alerting roteou por <span class="gw-tip">labels<span class="gw-tb">labels: {team=platform, service=checkout, severity=critical} match com a notification policy → contact_point = slack-platform-oncall.</span></span> (team=platform, severity=critical). Link direto para o dashboard SLO no alerta.</div>
      <div class="gw-code"><span style="color:#ef4444">[FIRING]</span> burn_rate_1h=18.4 burn_rate_6h=14.7 service=checkout<br><span style="color:#475569">→ runbook: https://runbooks/checkout-burn</span></div>
    </div>
  </div>

  <div class="gw-step">
    <div class="gw-num">2</div>
    <div style="flex:1">
      <div class="gw-time">14:32:45 — Dashboard SLO checkout</div>
      <div class="gw-title">Dashboard mostra spike de p99 e error rate</div>
      <div class="gw-desc">Painel <span class="gw-tip">Availability<span class="gw-tb">Stat panel: 1 - sum(rate(http_requests_total{status=~"5..",service="checkout"}[5m])) / sum(rate(http_requests_total{service="checkout"}[5m])). Caiu de 99.95% para 97.8%.</span></span> caiu de 99.95% para 97.8%. P99 latency saltou de 280ms para 4.2s. Error budget restante: 12% (era 67% pela manhã). Annotation vertical no gráfico marca <strong style="color:#F46800">deploy v2.4.1 às 14:28</strong>.</div>
      <div class="gw-code"><span style="color:#F46800">annotation</span>: deploy checkout v2.4.1 (14:28) — 4 min antes do alerta</div>
    </div>
  </div>

  <div class="gw-step">
    <div class="gw-num">3</div>
    <div style="flex:1">
      <div class="gw-time">14:33:20 — Exemplar → Tempo</div>
      <div class="gw-title">Clique no exemplar do spike de p99 → trace específico</div>
      <div class="gw-desc">Diamante amarelo no painel de p99 às 14:32:08. Clique abre o <span class="gw-tip">trace no Tempo<span class="gw-tb">trace_id=4bf92f3577b34da6a3ce929d0e0e4736 — request real do usuário que demorou 4.1s. Waterfall mostra cada span e duração.</span></span>. Waterfall: span HTTP /pay → span Stripe call (3.8s, status=error). Tag http.status_code=503.</div>
      <div class="gw-code"><span style="color:#63b3ed">trace_id</span>: 4bf92f...4736 (4.1s total)<br>&nbsp;&nbsp;├─ POST /pay (4.1s) <span style="color:#fbbf24">slow</span><br>&nbsp;&nbsp;│ &nbsp;└─ stripe.charge (3.8s) <span style="color:#ef4444">ERROR 503</span></div>
    </div>
  </div>

  <div class="gw-step">
    <div class="gw-num">4</div>
    <div style="flex:1">
      <div class="gw-time">14:34:05 — Trace → Loki</div>
      <div class="gw-title">Botão "View logs" no span → logs filtrados pelo trace_id</div>
      <div class="gw-desc">Configuração <span class="gw-tip">tracesToLogsV2<span class="gw-tb">No datasource Tempo: tracesToLogsV2 → datasourceUid: loki, tags: [service.name]. Auto-cria query LogQL com filter pelo span.</span></span> abre Loki com query <code style="color:#ffcc00">{service="checkout"} | json | trace_id="4bf92f..."</code>. Logs mostram 8 retries para Stripe, todos com timeout de 5s, e finalmente "stripe API returning 503 — possible regional outage".</div>
      <div class="gw-code"><span style="color:#ef4444">14:32:08</span> ERR stripe API 503 (attempt 8/8) trace_id=4bf92f...<br><span style="color:#fbbf24">14:32:03</span> WARN retry stripe.charge after 503</div>
    </div>
  </div>

  <div class="gw-step">
    <div class="gw-num">5</div>
    <div style="flex:1">
      <div class="gw-time">14:35:00 — Diagnóstico</div>
      <div class="gw-title">Causa identificada: Stripe outage regional + circuit breaker desativado no v2.4.1</div>
      <div class="gw-desc">Cross-reference: deploy v2.4.1 desativou circuit breaker para "simplificar". Combinado com outage da Stripe na região, retries cascateiam e saturam pool de conexões. <span class="gw-tip">Status page da Stripe<span class="gw-tb">Annotation query no PostgreSQL ou integração com statuspage.io aparece como linha vertical no dashboard.</span></span> confirma incidente regional.</div>
    </div>
  </div>

  <div class="gw-step" style="border-color:rgba(74,222,128,.3)">
    <div class="gw-num" style="border-color:#4ade80;color:#4ade80">6</div>
    <div style="flex:1">
      <div class="gw-time">14:38:30 — Mitigação e postmortem</div>
      <div class="gw-title" style="color:#4ade80">Rollback v2.4.1 → v2.4.0 → métricas voltam ao normal em 90s</div>
      <div class="gw-desc">Rollback automático via feature flag de circuit breaker. Annotation de rollback aparece no dashboard. Error rate volta a 0.3% em 90s. Postmortem agendado: ação 1 = circuit breaker volta como obrigatório, ação 2 = chaos test simulando outage de upstream antes de deploy. Error budget consumido: ~3% — ainda há margem para experimentação na próxima sprint.</div>
      <div class="gw-code" style="border-color:rgba(74,222,128,.2);color:#4ade80">availability 30d: 99.93% (SLO 99.9% ✓) — budget restante: 9%</div>
    </div>
  </div>

  <div style="margin-top:14px;background:#0d1421;border-left:3px solid #F46800;border-radius:4px;padding:10px 14px;font-size:10px;color:#94a3b8;line-height:1.6">
    <strong style="color:#F46800">Tempo total: ~6 min do alerta ao rollback.</strong> Sem LGTM stack: você abriria 3 sistemas separados, copiaria timestamps manualmente, faria grep em logs por chute. Com correlação trace ↔ log ↔ métrica, é workflow linear.
  </div>
</div>`,
        caption: "Esse workflow é o que justifica o investimento em LGTM. A correlação automática (exemplars, tracesToLogs, derivedFields) substitui horas de copy-paste de timestamps por cliques.",
      },
    ],
    cheatsheet: {
      title: "Grafana — Cheat Sheet (PromQL/LogQL/TraceQL + alerting)",
      html: `<style>
.gcs-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.gcs-card{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:11px 13px}
.gcs-name{color:#F46800;font-size:11px;font-weight:700;margin-bottom:4px}
.gcs-sig{font-size:9.5px;color:#fbbf24;margin-bottom:6px;line-height:1.5;font-family:'JetBrains Mono',monospace}
.gcs-desc{color:#64748b;font-size:10px;line-height:1.5}
.gcs-head{font-size:9px;color:#64748b;letter-spacing:.14em;text-transform:uppercase;margin:14px 0 8px;padding-bottom:6px;border-bottom:1px solid rgba(244,104,0,.2)}
</style>
<div style="font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:20px">
  <p style="color:#F46800;font-size:11px;font-weight:700;margin:0 0 14px;letter-spacing:.06em">GRAFANA — CHEAT SHEET</p>

  <div class="gcs-head">PROMQL ESSENCIAL</div>
  <div class="gcs-grid">
    <div class="gcs-card">
      <div class="gcs-name">rate()</div>
      <div class="gcs-sig">rate(metric_total[5m])</div>
      <div class="gcs-desc">Taxa de counter por segundo. SEMPRE em counters — nunca sum() direto. Janela típica: 5m.</div>
    </div>
    <div class="gcs-card">
      <div class="gcs-name">histogram_quantile()</div>
      <div class="gcs-sig">histogram_quantile(0.99,<br>&nbsp;sum by (le)(rate(..._bucket[5m])))</div>
      <div class="gcs-desc">P99 de latência. Sum BY le antes — agrega entre instâncias.</div>
    </div>
    <div class="gcs-card">
      <div class="gcs-name">sum by (label)</div>
      <div class="gcs-sig">sum by (status) (rate(...[5m]))</div>
      <div class="gcs-desc">Agrega mantendo dimensão. without (instance) também serve.</div>
    </div>
    <div class="gcs-card">
      <div class="gcs-name">increase()</div>
      <div class="gcs-sig">increase(errors_total[1h])</div>
      <div class="gcs-desc">Total absoluto na janela. Use para alertas tipo "X erros em 5m".</div>
    </div>
  </div>

  <div class="gcs-head">LOGQL ESSENCIAL</div>
  <div class="gcs-grid">
    <div class="gcs-card">
      <div class="gcs-name">Stream selector</div>
      <div class="gcs-sig">{service="api", env="prod"}</div>
      <div class="gcs-desc">Filtro por labels (indexado, rápido). Operadores: =, !=, =~ (regex), !~.</div>
    </div>
    <div class="gcs-card">
      <div class="gcs-name">Line filter</div>
      <div class="gcs-sig">{...} |= "ERROR" != "health"</div>
      <div class="gcs-desc">|= contém · != não contém · |~ regex · !~ não-regex. Aplicado após seletor.</div>
    </div>
    <div class="gcs-card">
      <div class="gcs-name">Parsers</div>
      <div class="gcs-sig">{...} | json | logfmt | pattern</div>
      <div class="gcs-desc">Extrai campos. json: {"a":1} → label a=1. logfmt: a=1 b=2 → labels.</div>
    </div>
    <div class="gcs-card">
      <div class="gcs-name">Métrica de log</div>
      <div class="gcs-sig">rate({...} |= "ERROR" [5m])</div>
      <div class="gcs-desc">Conta linhas por segundo. quantile_over_time usa unwrap field.</div>
    </div>
  </div>

  <div class="gcs-head">TRACEQL ESSENCIAL</div>
  <div class="gcs-grid">
    <div class="gcs-card">
      <div class="gcs-name">Trace por ID</div>
      <div class="gcs-sig">{ trace:id = "4bf9..." }</div>
      <div class="gcs-desc">Lookup direto em S3 — instantâneo. Vem de logs ou exemplars.</div>
    </div>
    <div class="gcs-card">
      <div class="gcs-name">Span por atributo</div>
      <div class="gcs-sig">{ resource.service.name = "api"<br>&nbsp;&amp;&amp; status = error }</div>
      <div class="gcs-desc">Spans de erro num serviço. Mais lento que trace:id.</div>
    </div>
    <div class="gcs-card">
      <div class="gcs-name">Spans lentos</div>
      <div class="gcs-sig">{ duration &gt; 1s &amp;&amp;<br>&nbsp;span.http.method = "POST" }</div>
      <div class="gcs-desc">POST mais lentos que 1s. Combine com service.name para focar.</div>
    </div>
    <div class="gcs-card">
      <div class="gcs-name">Aggregations</div>
      <div class="gcs-sig">{...} | rate() by (route)</div>
      <div class="gcs-desc">Tempo 2.x: agregações sobre traces. Substitui métricas em alguns casos.</div>
    </div>
  </div>

  <div class="gcs-head">PANEL OPTIONS — TIME SERIES</div>
  <div class="gcs-grid">
    <div class="gcs-card">
      <div class="gcs-name">Legend</div>
      <div class="gcs-sig">Override label: {{status}}</div>
      <div class="gcs-desc">Display name: {{label}} interpola label da query. Sem isso, vira string ilegível.</div>
    </div>
    <div class="gcs-card">
      <div class="gcs-name">Standard options</div>
      <div class="gcs-sig">Unit: percentunit / s / bytes</div>
      <div class="gcs-desc">Formato do eixo Y. Errar = "0.999" em vez de "99.9%". Min/max também aqui.</div>
    </div>
    <div class="gcs-card">
      <div class="gcs-name">Thresholds</div>
      <div class="gcs-sig">red: &gt; 0.01<br>yellow: &gt; 0.005</div>
      <div class="gcs-desc">Linhas/cores quando valor cruza. Funciona em stat, gauge, time series.</div>
    </div>
    <div class="gcs-card">
      <div class="gcs-name">Transformations</div>
      <div class="gcs-sig">Reduce, Group by, Join</div>
      <div class="gcs-desc">Manipula dados após query. Útil para tables: join de 2 queries por label comum.</div>
    </div>
  </div>

  <div class="gcs-head">ALERT STATE MACHINE</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
    <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:11px 13px">
      <div style="font-size:10px;color:#4ade80;font-weight:700;margin-bottom:6px">Estados</div>
      <div style="font-size:10px;color:#64748b;line-height:1.7">
        <span style="color:#4ade80">●</span> Normal — query OK<br>
        <span style="color:#fbbf24">●</span> Pending — condição true há &lt; for<br>
        <span style="color:#ef4444">●</span> Firing — condição true há ≥ for<br>
        <span style="color:#94a3b8">●</span> NoData — sem dados<br>
        <span style="color:#94a3b8">●</span> Error — query falhou
      </div>
    </div>
    <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:11px 13px">
      <div style="font-size:10px;color:#F46800;font-weight:700;margin-bottom:6px">Routing</div>
      <div style="font-size:10px;color:#64748b;line-height:1.7">
        labels (severity, team) →<br>
        notification policy match →<br>
        contact point (Slack/PD) →<br>
        + group_by, group_wait,<br>
        &nbsp;&nbsp;mute_timings, silences
      </div>
    </div>
  </div>
</div>`,
    },
    gotchas: [
      "Dashboard hardcoded sem variables — só serve para 1 ambiente/serviço. Sempre comece com $env e $service mesmo em dashboards simples — custa nada e escala depois.",
      "50 painéis num mesmo dashboard — ninguém olha mais que 8. Divida em overview (top-level RED metrics) + drill-down (1 por serviço). Dashboards lentos são dashboards inúteis.",
      "Sem annotations de deploy — quando spike aparece, ninguém sabe se foi deploy, tráfego ou DB. Annotation de deploy via webhook do CI resolve em 5 min de implementação.",
      "Alertas sem escalation policy — alerta vai pro Slack, ninguém vê às 3h, incidente escala. Configure escalation chain (primeiro on-call → secundário em 5min → manager em 15min).",
      "Provisioning ausente — dashboards criados pela UI somem quando alguém deleta acidentalmente. Sempre versione JSON em Git e provisione via Terraform/Helm.",
      "Datasource credentials em plain text no dashboard JSON — quando exporta JSON com auth, vaza credencial. Use service accounts e secret manager (Vault, K8s Secret).",
      "Loki com user_id, request_id ou trace_id como label — explosão de cardinalidade. Esses campos vão no conteúdo do log (JSON), nunca como label do Loki. Labels devem ter cardinalidade baixa (service, env, level).",
      "Exemplars 'não funcionam' — esquecimento típico: --enable-feature=exemplar-storage no Prometheus + scrape_protocols com OpenMetrics + exemplarTraceIdDestinations no datasource. Os 3 são obrigatórios.",
      "Permissões 'editor para todos' — qualquer um deleta dashboard de produção. Use folders + teams: editores só em folders do próprio time, viewer no resto.",
      "Tempo configurado mas sem retenção — traces acumulam em S3 indefinidamente. Configure compactor.block_retention (ex: 720h = 30d) e tail_sampling para reduzir volume.",
      "Recording rules ausentes em dashboards de SLO — cada refresh recalcula histogram_quantile sobre 30d. Pré-compute via PrometheusRule e o dashboard fica instantâneo.",
      "Grafana Cloud free tier estourado em produção — limites de 10k séries / 50GB logs / 50GB traces. Acima disso vira pesadelo de billing. Compare custo vs. self-hosted antes de comprometer.",
    ],
    interview: [
      {
        q: "Como você criaria um dashboard de SLO no Grafana?",
        a: "Variables: $service (Query type — label_values), $env. Painéis: 1) Stat de Availability 30d — 1 - sum(rate(http_requests_total{status=~'5..'}[30d])) / sum(rate(http_requests_total[30d])) com unit percentunit e threshold em vermelho abaixo do SLO. 2) Time series de p99 latency com histogram_quantile e exemplars ativados. 3) Gauge de Error Budget restante — (slo - actual_error_rate) / (1 - slo) * 100. 4) Time series de Burn Rate em multi-window (1h e 6h). 5) Table com top endpoints por error rate. 6) Logs panel do Loki filtrado por level=error. Alert rule conectada: multi-window burn rate > 14× em 1h E 6h → severity=critical → Slack do on-call. Annotations de deploy via webhook do CI. JSON versionado em Git, provisionado via Terraform.",
        tip: "Mencionar multi-window burn rate, exemplars e versionamento via Terraform mostra que você opera Grafana em produção real, não só montou dashboard pra brincar.",
        level: "senior",
      },
      {
        q: "Quando usar Loki vs. Elasticsearch para logs?",
        a: "Loki: indexa só labels (service, env, level), conteúdo fica em chunks no S3. Custo ~10x menor para o mesmo volume. Integrado nativamente com Grafana, Prometheus e Tempo (correlação trace ↔ log via trace_id é nativa). Trade-off: busca full-text é scan de chunks — mais lenta. Elasticsearch: indexa tudo, busca full-text rápida e rica (facets, aggregations, fuzzy match), ecossistema maduro (Kibana, Logstash, Beats). Trade-off: caro de operar, escala difícil. Regra prática: se 80% das buscas são por service+env+level (caso comum em SRE), Loki vence. Se você precisa de busca textual frequente em milhões de logs (ex: SIEM, security analytics), Elasticsearch ainda lidera. Em times com OpenTelemetry e Prometheus, Loki é o caminho natural.",
        tip: "Trade-off real de custo + caso de uso (SRE vs. SIEM) diferencia de quem só leu o readme.",
        level: "pleno",
      },
      {
        q: "O que são Exemplars e como funcionam end-to-end?",
        a: "Exemplar = trace_id anexado a um data point de métrica histogram. Pipeline: 1) App instrumentada com OTel SDK emite histogram (http_request_duration). Quando registra um observation, OTel injeta automaticamente o trace_id atual como exemplar. 2) Prometheus scrapa o /metrics com OpenMetrics format e --enable-feature=exemplar-storage — exemplars são armazenados junto da série. 3) Grafana datasource Prometheus tem exemplarTraceIdDestinations apontando para Tempo. 4) No painel de p99, ativa Exemplars — diamantes amarelos aparecem nos pontos. 5) Clique no diamante abre o trace específico no Tempo. Sem exemplars: você vê p99 alto às 14:32 e adivinha entre 50k traces qual foi. Com exemplars: 1 clique. Configuração tem 4 partes (app + prom flag + scrape protocol + datasource) — esquecer qualquer uma e exemplars 'não funcionam' silenciosamente.",
        tip: "Listar os 4 pontos de configuração mostra que você implementou de verdade — quem só leu cita só 'tem exemplar' e não sabe por que não aparece.",
        level: "senior",
      },
      {
        q: "Grafana Alerting (unified) vs. Alertmanager — quando usar cada um?",
        a: "Grafana Alerting (unified, pós v9): UI integrada, funciona com qualquer data source (Prometheus, Loki, Elasticsearch, CloudWatch, SQL). Centraliza alerting com notification policies, mute timings e silences na mesma UI. Melhor para: ambientes com múltiplos data sources, times que já vivem no Grafana, alerting baseado em logs (LogQL) ou queries SQL. Alertmanager: maduro, configuração via YAML versionável (config-as-code natural), integração nativa com PrometheusRule do kube-prometheus-stack, routing complexo via labels com regex. Melhor para: ambientes Kubernetes-centric com kube-prometheus-stack, times que querem alerting separado da UI, multi-cluster com Alertmanager federation. Em prática, muitos times rodam ambos: Alertmanager para alertas Prometheus core (infra K8s), Grafana Alerting para alertas de aplicação (logs Loki, queries SQL).",
        level: "senior",
      },
      {
        q: "O que é LogQL e como difere de PromQL?",
        a: "LogQL é a linguagem de query do Loki, inspirada em PromQL mas para logs. Estrutura: {seletor de stream} |= 'filtro de linha' | parser | filtro de label. Operadores de linha: |= contém, != não contém, |~ regex, !~ não-regex. Parsers: json, logfmt, pattern, regexp. Diferença chave: PromQL retorna séries numéricas (vetores); LogQL retorna log streams OU métricas derivadas. Métricas: rate({...} |= 'error' [5m]) conta erros/s, quantile_over_time(0.99, {...} | json | unwrap duration_ms [5m]) calcula p99 de campo extraído. Limitação: LogQL é mais lento que PromQL para métricas — Prometheus pré-agrega; Loki escaneia chunks. Use logs para SLI quando não tem métrica equivalente. Quando tem métrica, sempre prefira PromQL.",
        level: "pleno",
      },
      {
        q: "Como organizar dashboards Grafana num time grande (50+ engenheiros)?",
        a: "1) Folders por domínio: Platform, Services, Business, Infrastructure. 2) Naming convention: '[serviço] — Visão Geral', '[serviço] — Detalhes', '[serviço] — On-call'. 3) Dashboard de on-call por squad com top 5 métricas pinadas. 4) Variables obrigatórias: $env, $service. 5) Versionamento: JSON em Git + Terraform/Helm provisioning. allowUiUpdates: false em prod (edição via UI bloqueada — só via PR). 6) RBAC: cada squad tem 1 team com Editor no próprio folder, Viewer no resto. SREs com Admin global. 7) Library panels para componentes reusados (ex: painel padrão de RED metrics). 8) Code review de dashboard JSON como qualquer código. 9) Alerting unificado num folder Alerts/ — alertas como código. 10) Documentação: cada dashboard tem painel Markdown no topo explicando para quem é e como usar.",
        tip: "Mencionar allowUiUpdates: false e library panels mostra maturidade — a maioria não chega lá.",
        level: "senior",
      },
      {
        q: "Grafana Cloud vs. self-hosted LGTM — como decidir?",
        a: "Grafana Cloud: SaaS gerenciado com free tier generoso (10k séries, 50GB logs/traces). Vantagem: zero operação, upgrades automáticos, escala automática, integração OnCall + IRM nativa. Trade-off: custo escala rápido — acima do free tier, com volume real (1M séries, 1TB logs), pode chegar a USD 5-15k/mês. Vendor lock-in via dashboards/alertas (mas tudo é exportável). Self-hosted LGTM: custo de infra (S3 + EKS) ~5-10x menor que Cloud equivalente em volume alto. Trade-off: precisa de 1-2 engenheiros dedicados a operar. Decisão: time pequeno (< 20 engs) ou volume baixo → Cloud. Time grande (> 50 engs), volume alto, requisitos de compliance (dados não saem da região) → self-hosted. Híbrido também é comum: free tier do Cloud para staging e dev, self-hosted para prod.",
        tip: "Dar números concretos (10k séries, USD 5-15k/mês, 5-10x mais barato) impressiona em entrevista de senior/staff.",
        level: "senior",
      },
      {
        q: "O que é Grafana OnCall e quando substituir PagerDuty por ele?",
        a: "Grafana OnCall é o produto de incident management da Grafana Labs (open source + Cloud). Schedules de plantão, escalation chains, routing por labels, integração nativa com Slack (cria canal por incidente, status updates), integração com webhook in/out (recebe alertas do Alertmanager/Grafana Alerting; envia para qualquer destino). Diferencial: integrado ao Grafana — alerta vai direto pro OnCall, runbook é link no alerta, postmortem fica anexado à incident page. Quando substituir PagerDuty: time pequeno-médio com plantão simples, custo de PagerDuty incomoda (USD 21-65/user/mês), já vive no LGTM stack. Quando NÃO substituir: empresa grande com auditoria SOC2 rígida, runbooks complexos com dependências entre serviços, integração com sistemas legacy proprietários. Para 80% dos times BR, OnCall basta.",
        level: "senior",
      },
      {
        q: "Tempo vs. Jaeger — qual escolher para tracing?",
        a: "Tempo: backend da Grafana Labs, otimizado para custo. Armazena spans em object storage (S3) sem índice de atributos. Busca por trace_id é instantânea (lookup direto). Busca por atributo (TraceQL) é mais lenta — escaneia blocos. Custo ~10x menor que Jaeger+Elasticsearch. Integração nativa com Grafana, Loki (tracesToLogsV2), Prometheus (exemplars). Jaeger: open source da Uber/CNCF, mais maduro. Backend tradicional Cassandra ou Elasticsearch — índice rico de atributos, busca exploratória rápida. UI própria mais polida em alguns casos de discovery. Decisão: workflow já tem trace_id (vem de logs ou exemplars) → Tempo brilha. Workflow é discovery exploratório de spans lentos sem trace_id pré-conhecido → Jaeger ainda vence em UX. Em prática, com logs estruturados emitindo trace_id e exemplars no Prometheus, Tempo cobre 95% dos casos por uma fração do custo.",
        tip: "Mencionar 'workflow já tem trace_id vs. discovery exploratório' é a faca cirúrgica — quem só conhece superficialmente diz 'Tempo é mais barato e ponto'.",
        level: "senior",
      },
      {
        q: "Como fazer dashboard-as-code corretamente?",
        a: "Workflow: 1) Engenheiro edita dashboard via UI (sandbox em folder Editing/). 2) Export JSON via API (curl /api/dashboards/uid/X). 3) Commit em repo Git com PR. 4) CI valida sintaxe com jsonnet/json schema. 5) Merge dispara Terraform/Helm que provisiona em prod (allowUiUpdates: false em prod — edição via UI bloqueada). Ferramentas: Terraform com grafana provider (grafana_dashboard resource), Helm com kube-prometheus-stack (dashboards via ConfigMap), Grafonnet (Jsonnet) para gerar JSON com loops e DRY (1 template → N dashboards por serviço). Vantagens: code review, rollback via git revert, prevenção de dashboards perdidos, reuso entre serviços via Grafonnet. Anti-pattern: editor via UI em prod sem provisioning — dashboard some quando alguém deleta acidentalmente.",
        level: "senior",
      },
      {
        q: "Como configurar multi-tenancy no LGTM?",
        a: "Mimir, Loki e Tempo aceitam header X-Scope-OrgID que isola dados por tenant. Implementação: 1) Reverse proxy (Nginx, Envoy, Traefik) que adiciona X-Scope-OrgID baseado em auth (JWT, mTLS, API key). 2) Cada tenant escreve e lê só seus dados — não há query cross-tenant por padrão. 3) Grafana Enterprise/Cloud tem orgs/stacks — cada org é um tenant com datasources separados. 4) RBAC + folders no Grafana isola dashboards. Casos de uso: SaaS B2B (cliente A não vê dados do cliente B), holding com múltiplas empresas (BU1 não vê BU2), platform team com self-service (cada squad é um tenant com cota de séries/logs). Anti-pattern: 'multi-tenancy' via labels (service=tenant_a) — sem isolamento real, query bug expõe dados cross-tenant. Use header tenant nativo.",
        level: "senior",
      },
      {
        q: "Como provisionar datasources e dashboards em Kubernetes via Helm?",
        a: "Use kube-prometheus-stack (operator-style). Datasources: values.yaml → grafana.additionalDataSources (lista YAML). Dashboards: 1) ConfigMap com label grafana_dashboard=1 — operator monta automático. 2) ou grafana.dashboards inline no values. 3) ou grafana.dashboardsConfigMaps referenciando. Sidecar (grafana-sc-dashboard) monitora ConfigMaps com a label e cria dashboards no Grafana via API. Vantagens: GitOps natural (ArgoCD/Flux sincroniza), namespacing por team via label, rollback via Helm. Workflow: dev edita dashboard, exporta JSON, commit no chart Helm do squad, ArgoCD detecta, sidecar pega novo ConfigMap, dashboard atualiza. allowUiUpdates: false impede divergência.",
        level: "senior",
      },
      {
        q: "Como o Grafana Alerting v2 (unified) funciona internamente — Alert Rules vs Contact Points vs Notification Policies vs Silences vs Inhibitions?",
        a: "<p>Hierarquia completa, na ordem de avaliação:</p><ol><li><strong>Alert Rule</strong>: query periódica (data → expression → condition → state). State machine: <code>Normal → Pending → Firing</code> (com <code>for: 2m</code>) e estados degenerados <code>NoData</code>, <code>Error</code>. Cada rule produz uma ou mais <em>alert instances</em> (uma por série retornada).</li><li><strong>Notification Policy</strong> (árvore de roteamento): cada alerta percorre a árvore por <em>matchers</em> (labels). Primeiro match vence (a menos que <code>continue: true</code>). Define <code>group_by</code>, <code>group_wait</code> (tempo de espera antes da primeira notificação), <code>group_interval</code> (entre notificações do mesmo grupo) e <code>repeat_interval</code>.</li><li><strong>Contact Point</strong>: destino concreto (Slack webhook, PagerDuty integration key, email SMTP, OpsGenie). Política aponta para um contact point por nome.</li><li><strong>Mute Timing</strong>: janela de tempo recorrente (cron-like) onde notificações são suprimidas (manutenção das 02h-04h dom). Aplicado na policy.</li><li><strong>Silence</strong>: matcher temporário (criado via UI/API com TTL) que bloqueia notificações de alertas que casam — usado em incident response.</li><li><strong>Inhibition Rule</strong>: alerta A firing suprime alerta B se ambos têm labels <code>equal</code>. Ex: <code>ServiceDown</code> firing inibe <code>ErrorRateAlto</code> do mesmo service — você já sabe que está down.</li></ol><p>Internamente, o Grafana Alerting embute o código do Alertmanager (mesmo motor de routing) — só a UI muda. Em HA, multiple replicas usam <code>ha_peers</code> (gossip) para coordenar deduplicação.</p>",
        tip: "Saber que internamente é Alertmanager embutido é o que diferencia — quem operou o legacy reconhece imediatamente o YAML similar.",
        level: "senior",
      },
      {
        q: "Variables no Grafana — quais são os tipos, como uma variável alimenta outra (chaining) e como se usa em PromQL com $var?",
        a: "<p>Tipos:</p><ul><li><strong>Query</strong>: popula via query no datasource. PromQL: <code>label_values(up, service)</code> retorna todos os values da label service. LogQL, SQL, etc também funcionam.</li><li><strong>Custom</strong>: lista fixa <code>prod, staging, dev</code>.</li><li><strong>Constant</strong>: valor invisível para o usuário, útil em provisioning (define datacenter por dashboard).</li><li><strong>Datasource</strong>: dropdown que troca a fonte do dashboard inteiro — útil para o mesmo dashboard servir prod e staging com Prometheus diferentes.</li><li><strong>Interval</strong>: <code>1m, 5m, 1h</code> — usado como <code>rate(metric[$__interval])</code> ou <code>rate(metric[$interval])</code>.</li><li><strong>Text box</strong>: input livre (filtro ad-hoc).</li><li><strong>Ad hoc filters</strong>: filtros <code>key=value</code> aplicados a TODAS as queries automaticamente.</li></ul><p><strong>Chaining</strong>: variável B usa <code>$A</code> na sua query. Quando A muda, B é recalculada. Ex: <code>$namespace</code> (Query: <code>label_values(kube_pod_info, namespace)</code>) → <code>$service</code> depende de <code>$namespace</code>: <code>label_values(up{namespace=~\"$namespace\"}, service)</code>. Selecionar namespace=production faz $service repopular só com services daquele namespace.</p><p><strong>Uso em PromQL</strong>: sempre prefira regex match para suportar multi-value. <code>{service=~\"$service\"}</code> funciona tanto com 1 valor (<code>checkout</code>) quanto múltiplos (<code>checkout|api|auth</code> — Grafana junta com pipe). <code>{service=\"$service\"}</code> (exact match) quebra com multi-value. Variáveis especiais: <code>$__interval</code> (auto-calculado por Grafana baseado no time range), <code>$__rate_interval</code> (mínimo de 4× scrape interval — recomendado para rate()).</p>",
        tip: "A diferença entre =~ e = com multi-value é gotcha clássico — quem só copiou query do StackOverflow descobre na prática quando dashboard quebra ao selecionar 2 services.",
        level: "senior",
      },
      {
        q: "Grafana Tempo vs Jaeger vs Zipkin — por que Tempo com TraceQL é diferente, e como integra com Loki/Prometheus via exemplars?",
        a: "<p><strong>Jaeger</strong>: backend tradicional (Cassandra/Elasticsearch) com índice rico de atributos. Busca por <em>service+operation+duration+tags</em> é rápida. UI madura para discovery exploratório (encontrar trace lento sem ter trace_id). Custo: storage caro (Elasticsearch escala mal e cobra caro).</p><p><strong>Zipkin</strong>: histórico, cliente Twitter. Modelo de dados mais simples. Hoje legado — quase todo mundo migrou para OTLP+Tempo/Jaeger.</p><p><strong>Tempo</strong>: filosofia oposta — <em>nenhum índice de atributos</em>. Apenas trace_id é indexado. Spans armazenados em object storage (S3/GCS) em formato Parquet. Resultado: 10-20× mais barato que Jaeger+ES. Trade-off: busca por atributo (TraceQL) escaneia blocos — mais lenta mas funciona.</p><p><strong>TraceQL</strong>: linguagem própria do Tempo, similar a PromQL para traces. <code>{ resource.service.name = \"checkout\" && status = error && duration > 1s }</code>. Suporta agregações (Tempo 2.x): <code>{ ... } | rate() by (span.http.route)</code>, <code>quantile_over_time(duration, .99)</code>. Permite gerar métricas a partir de traces.</p><p><strong>Integração com Prometheus via exemplars</strong>: app emite histogram com trace_id anexado (OTel SDK faz isso automaticamente quando há span ativo). Prometheus armazena exemplar junto da série (precisa de <code>--enable-feature=exemplar-storage</code> e <code>scrape_protocols: [OpenMetricsText1.0.0]</code>). Datasource Prometheus tem <code>exemplarTraceIdDestinations</code> apontando para Tempo. No painel, diamantes amarelos aparecem nos pontos do gráfico — clique abre o trace.</p><p><strong>Integração com Loki</strong>: <code>tracesToLogsV2</code> no datasource Tempo usa <code>service.name</code> do span para filtrar Loki <code>{service=\"checkout\"} | trace_id=\"...\"</code>. Logs do span aparecem instantaneamente.</p><p><strong>Decisão</strong>: workflow tem trace_id (vem de logs com trace_id incluso ou de exemplars) → Tempo cobre 95% por fração do custo. Discovery exploratório puro (encontrar spans lentos sem nenhuma pista) → Jaeger ainda vence em UX.</p>",
        tip: "A frase 'workflow com trace_id pré-conhecido vs discovery sem pistas' é a diferenciação cirúrgica que mostra que você operou ambos em produção.",
        level: "senior",
      },
      {
        q: "Provisioning as code — dashboard JSON model, datasource YAML, como evitar config drift em ambientes múltiplos?",
        a: "<p><strong>Camadas de provisioning</strong>:</p><ol><li><strong>Datasources YAML</strong> em <code>/etc/grafana/provisioning/datasources/</code>: cada arquivo declara datasources com <code>name</code>, <code>type</code>, <code>url</code>, <code>jsonData</code>. <code>editable: false</code> impede edição via UI.</li><li><strong>Dashboard providers YAML</strong> em <code>/etc/grafana/provisioning/dashboards/</code>: aponta para diretórios de JSON. <code>allowUiUpdates: false</code> e <code>disableDeletion: true</code> blindam contra mudanças via UI.</li><li><strong>Dashboard JSON</strong>: o modelo completo (panels, queries, variables, annotations) versionado em Git.</li><li><strong>Alerting YAML</strong>: rules, contact points, notification policies, mute timings, templates — tudo declarativo.</li><li><strong>Plugins, orgs, users, teams, RBAC</strong> — também via provisioning files.</li></ol><p><strong>Ferramentas</strong>: Terraform com <code>grafana/grafana</code> provider (resources <code>grafana_dashboard</code>, <code>grafana_data_source</code>, <code>grafana_folder</code>, <code>grafana_team</code>, <code>grafana_alert_rule</code>). Helm <code>kube-prometheus-stack</code> que provisiona via ConfigMaps e sidecar. Grafonnet (Jsonnet) para gerar JSON com loops e DRY.</p><p><strong>Anti-drift</strong>: 1) <code>allowUiUpdates: false</code> em prod — qualquer mudança volta na próxima sincronização. 2) Dashboard JSON tem <code>uid</code> determinístico — mesmo dashboard em prod e staging. 3) Variables como <code>$env, $datasource</code> — um único JSON serve múltiplos ambientes. 4) GitOps (ArgoCD/Flux) — divergências detectadas automaticamente. 5) <code>terraform plan</code> em CI mostra qualquer drift. 6) Folder <code>Editing/</code> separado para sandbox — engineers editam ali, exportam JSON, abrem PR.</p><p><strong>Anti-pattern</strong>: dashboard editado via UI em prod sem PR — some quando alguém deleta acidentalmente, e ninguém sabe quem mudou o quê.</p>",
        level: "senior",
      },
      {
        q: "Unified alerting vs legacy alerting — quais as diferenças arquiteturais, como migrar e o que são multi-dimensional alerts?",
        a: "<p><strong>Legacy alerting</strong> (Grafana ≤8): cada alert era um painel especial num dashboard. Avaliação acontecia no Grafana, mas estado ficava acoplado ao dashboard. Limitações: 1) só funcionava com Prometheus/Graphite/InfluxDB (não Loki, Elasticsearch, SQL). 2) Um alert por painel — escala terrível. 3) Sem multi-dimensional (1 alert = 1 série). 4) Notification channels separados de routing (sem grouping/inhibition).</p><p><strong>Unified alerting</strong> (Grafana 9+): mesmo motor que Alertmanager (embutido no Grafana). 1) Funciona com qualquer datasource — alert sobre logs Loki, query SQL, CloudWatch. 2) <em>Multi-dimensional</em>: uma rule com <code>sum by (service) (rate(errors[5m])) > 0.01</code> gera 1 alert instance por valor de service — você obtém um <em>folder</em> de alerts com mesma rule, um por série. 3) Routing via notification policies (árvore com matchers, group_by, mute timings). 4) Silences, inhibitions, grouping nativos.</p><p><strong>Migração</strong>: <code>grafana-cli admin reset-admin-password</code>... brincadeira. Grafana 9+ tem migrador automático: legacy alerts ficam num folder <code>Migrated</code>, contact points e notification policies são gerados a partir dos legacy notification channels. Mas o resultado raramente é ideal — a maioria dos times <em>refaz</em> os alerts em unified com SLO-based design (multi-window burn rate em vez de threshold simples).</p><p><strong>Multi-dimensional na prática</strong>: rule única <code>error_rate by (service, env) > 0.01 for: 5m</code> gera N alerts (um por par service-env). Notification policy roteia: <code>severity=critical AND env=prod</code> → PagerDuty; <code>env=staging</code> → Slack-warnings. Sem multi-dimensional, você criaria 1 rule por service.</p>",
        tip: "A frase 'um folder de alerts a partir de uma única rule' é como Grafana descreve oficialmente — saber isso mostra leitura da spec.",
        level: "senior",
      },
      {
        q: "Grafana Mimir vs Thanos — quando usar cada para long-term Prometheus storage?",
        a: "<p><strong>Thanos</strong>: arquitetura de sidecar. Cada Prometheus tem um <em>Thanos sidecar</em> que sobe os blocos TSDB (a cada 2h) para object storage (S3/GCS). Componentes: Sidecar (upload + StoreAPI), Store Gateway (lê blocos do S3), Compactor (compacta blocos antigos), Querier (federação), Ruler (recording/alerting rules globais). Vantagens: incremental — você adiciona Thanos a Prometheus existentes sem mudar nada na ingestion. Multi-cluster federation com deduplicação de réplicas via labels (<code>replica</code>). Maturidade alta, comunidade grande.</p><p><strong>Mimir</strong> (Grafana Labs, fork do Cortex): arquitetura de serviços separados que substitui o Prometheus inteiro. Componentes: Distributor (recebe via remote_write), Ingester (TSDB em memória + WAL), Store Gateway, Querier, Compactor, Ruler. Multi-tenant nativo via header <code>X-Scope-OrgID</code>. Horizontalmente escalável (cada componente escala independente). Performance superior do Cortex (otimizações da Grafana Labs). API 100% compatível com Prometheus.</p><p><strong>Decisão</strong>:</p><ul><li><strong>Já tem Prometheus em vários clusters e quer adicionar long-term storage incrementalmente</strong> → Thanos (mínimo esforço).</li><li><strong>Greenfield, multi-tenant SaaS, ou substituir Prometheus completo por backend escalável</strong> → Mimir (arquitetura mais limpa, ops mais previsível em escala).</li><li><strong>Volume muito alto (10M+ active series, milhões de samples/s)</strong> → Mimir vence em performance e custo de operação.</li><li><strong>Times pequenos sem ops dedicado</strong> → Grafana Cloud (Mimir managed) ou Prometheus puro com retention de 30-90 dias basta.</li></ul><p>Cortex foi descontinuado pela CNCF em favor de Mimir — quem ainda usa Cortex deve migrar.</p>",
        level: "senior",
      },
      {
        q: "Como exemplars funcionam — link Prometheus metric → Tempo trace, e como configurar no scrape config?",
        a: `<p><strong>O que é</strong>: exemplar é um <em>data point específico</em> de um histogram que carrega o trace_id da request que produziu aquele valor. Quando o app registra <code>histogram.observe(0.345)</code> dentro de um span ativo, OTel/prom-client anexa <code>trace_id</code> ao bucket onde 0.345 caiu.</p><p><strong>Pipeline completo (4 etapas — todas obrigatórias)</strong>:</p><ol><li><strong>App emite</strong>: SDK OTel ou prom-client moderno injeta automaticamente o trace_id ativo no exemplar. No formato OpenMetrics, aparece como:<br><code># histogram_bucket{le="0.5"} 1234 # {trace_id="4bf9..."} 0.345 1730390400</code><br>(o <code># {...}</code> após o valor é o exemplar).</li><li><strong>Prometheus armazena</strong>: precisa do flag <code>--enable-feature=exemplar-storage</code>. Sem ele, exemplars são parseados mas descartados.</li><li><strong>Scrape config</strong>: <code>scrape_protocols: [OpenMetricsText1.0.0, PrometheusText0.0.4]</code> — OpenMetrics primeiro porque só ele tem exemplar syntax. Sem isso, app pode emitir mas Prometheus pede formato antigo e perde exemplars.</li><li><strong>Datasource Grafana</strong>: <code>exemplarTraceIdDestinations</code> mapeia o label do exemplar (ex: <code>trace_id</code>) para o datasource Tempo. URL template gera link clicável.</li></ol><pre><code>scrape_configs:
  - job_name: 'app'
    scrape_protocols: [OpenMetricsText1.0.0]
    static_configs:
      - targets: ['app:8080']

# datasource Prometheus (provisioning)
jsonData:
  exemplarTraceIdDestinations:
    - name: trace_id
      datasourceUid: tempo</code></pre><p><strong>UI</strong>: no painel de p99 com histogram, ative <em>Exemplars: enabled</em>. Diamantes amarelos aparecem nos pontos. Clique → trace abre no Tempo.</p><p><strong>Debug se 'não aparece'</strong>: 1) cURL do <code>/metrics</code> do app — tem <code># {trace_id=...}</code> nas linhas? 2) Prometheus <code>/api/v1/query_exemplars?query=...</code> retorna dados? 3) Datasource tem <code>exemplarTraceIdDestinations</code>? 4) Painel tem Exemplars ativado? Cada ponto que falhar bloqueia silenciosamente.</p>`,
        tip: "Os 4 pontos de configuração separam quem implementou de quem só leu a feature page — esquecimento de qualquer um faz parecer 'bug do Grafana'.",
        level: "senior",
      },
      {
        q: "Como você debugaria um dashboard Grafana lento (refresh demora 30s+)?",
        a: "<p>Diagnóstico em camadas:</p><ol><li><strong>Network tab do browser</strong>: identifique qual <code>POST /api/ds/query</code> demora. O tempo gasto está no Prometheus/Loki, não no Grafana.</li><li><strong>Query Inspector</strong> (cada painel → Inspect → Stats): mostra <em>Query time</em>, <em>Series count</em>, <em>Data points</em>. Series > 10k = problema de cardinalidade. Query time > 5s = query precisa de recording rule.</li><li><strong>Prometheus <code>/api/v1/query_range</code></strong> com timestamp explícito + <code>--data-urlencode</code> permite reproduzir fora do Grafana.</li><li><strong>Causas comuns</strong>: histogram_quantile sobre 30 dias (precisa recording rule pré-computado), <code>rate()</code> sem <code>$__rate_interval</code>, queries sem <code>by()</code> retornando milhares de séries, painel mostrando <code>Top 100</code> mas a query traz tudo.</li></ol><p><strong>Soluções</strong>:</p><ul><li><strong>Recording rules</strong>: <code>job:sli_errors:ratio_rate5m</code> pré-computado a cada 1m. Painel consulta a rule (instantâneo).</li><li><strong>Reduzir cardinalidade</strong>: <code>topk(10, ...)</code> ou <code>sum by (service)</code> em vez de manter <code>pod, container, instance</code>.</li><li><strong>Time range razoável</strong>: dashboard padrão em 6h, não 30d. Se precisa de 30d, é dashboard de SLO com recording rules.</li><li><strong>Cache no Grafana</strong>: query cache (Enterprise/Cloud) deduplica queries idênticas em painéis múltiplos.</li><li><strong>Datasource</strong> com <code>queryTimeout: 60s</code> e <code>httpMethod: POST</code> (POST permite body maior — queries longas funcionam).</li></ul><p><strong>Mimir/Thanos</strong>: query splitting + sharding paralelizam queries grandes. <code>split_queries_by_interval: 24h</code> divide query de 7d em 7 sub-queries paralelas.</p>",
        tip: "Mencionar Query Inspector + recording rule como solução padrão mostra que você debugou esse problema em produção.",
        level: "senior",
      },
    ],
    videos: [
      {
        title: "Intro to Grafana — Get Started in 30 Minutes",
        channel: "Grafana",
        url: "https://www.youtube.com/watch?v=Ufem35X2j1Y",
        topic: "Onboarding oficial: dashboards, datasources, variables e alerting",
        note: "Workshop curto da Grafana Labs com instrutor — bom para fundamentos antes de mergulhar no LGTM stack.",
      },
      {
        title: "GrafanaCONline: The LGTM Stack — Logs, Metrics, Traces and More",
        channel: "Grafana",
        url: "https://www.youtube.com/watch?v=AkPfn8WdLxg",
        topic: "Visão completa do LGTM (Loki, Grafana, Tempo, Mimir) com correlação trace ↔ log ↔ métrica",
        note: "Demonstra ao vivo exemplars, tracesToLogs e derivedFields — o exato workflow de investigação que cai em entrevista.",
      },
      {
        title: "Grafana Alerting Deep Dive — Unified Alerting in Grafana 9+",
        channel: "Grafana",
        url: "https://www.youtube.com/watch?v=fM63lqUFZuY",
        topic: "Alert rules, contact points, notification policies, silences, inhibitions, mute timings",
        note: "Cobre toda a hierarquia em ordem — base obrigatória para qualquer Q&A sobre Grafana Alerting v2.",
      },
      {
        title: "Dashboards as Code with Grafana, Terraform and Grafonnet",
        channel: "Grafana",
        url: "https://www.youtube.com/watch?v=dPxnFHmd0Lg",
        topic: "JSON model, Terraform provider, Grafonnet (Jsonnet) e GitOps",
        note: "Mostra workflow real de provisioning em produção — referência para a Q&A de dashboard-as-code.",
      },
      {
        title: "SLO-based Alerting with Grafana and Prometheus — Multi-Window Burn Rate",
        channel: "Grafana",
        url: "https://www.youtube.com/watch?v=tk-q9C7gz0s",
        topic: "Implementação prática do SRE Workbook: burn rate 14·6·3·1, recording rules, error budget",
        note: "Conecta SLO methodology à implementação concreta no Grafana — material denso e alto valor.",
      },
    ],
    mindmap: {
      title: "Grafana — ecossistema completo (LGTM stack)",
      html: `<style>
.gmm-wrap{font-family:'Space Grotesk',sans-serif;background:#0a0a0a;border-radius:12px;padding:22px;color:#e2e8f0}
.gmm-center{background:linear-gradient(135deg,#F46800,#dc2626);color:#fff;padding:.85rem 1.6rem;border-radius:.6rem;font-weight:700;font-size:1.05rem;text-align:center;margin:0 auto 1.4rem;display:inline-block}
.gmm-row{display:flex;flex-wrap:wrap;gap:.85rem;justify-content:center;margin-bottom:.85rem}
.gmm-branch{background:#111827;border-radius:.7rem;padding:.85rem 1rem;min-width:200px;max-width:240px;border-left:3px solid #334155}
.gmm-node{font-weight:700;margin-bottom:.45rem;font-size:.85rem;letter-spacing:.02em}
.gmm-items{display:flex;flex-direction:column;gap:.18rem}
.gmm-item{color:#94a3b8;font-size:.74rem;padding:.1rem .25rem;border-left:1.5px solid #1f2937;line-height:1.45}
.gmm-pill{display:inline-block;font-size:.65rem;font-family:'JetBrains Mono',monospace;background:rgba(244,104,0,.1);color:#F46800;padding:.05rem .35rem;border-radius:3px;margin-left:.2rem}
</style>
<div class="gmm-wrap" style="text-align:center">
  <div class="gmm-center">Grafana — UI de observabilidade</div>
  <div style="text-align:left">
    <div class="gmm-row">
      <div class="gmm-branch" style="border-left-color:#F46800">
        <div class="gmm-node" style="color:#F46800">Data Sources</div>
        <div class="gmm-items">
          <span class="gmm-item">Prometheus / Mimir <span class="gmm-pill">PromQL</span></span>
          <span class="gmm-item">Loki <span class="gmm-pill">LogQL</span></span>
          <span class="gmm-item">Tempo / Jaeger <span class="gmm-pill">TraceQL</span></span>
          <span class="gmm-item">InfluxDB / Graphite</span>
          <span class="gmm-item">Elasticsearch / OpenSearch</span>
          <span class="gmm-item">PostgreSQL / MySQL / MSSQL</span>
          <span class="gmm-item">CloudWatch / Azure / GCP</span>
          <span class="gmm-item">Mixed (multi-source num painel)</span>
        </div>
      </div>
      <div class="gmm-branch" style="border-left-color:#fbbf24">
        <div class="gmm-node" style="color:#fbbf24">Visualization</div>
        <div class="gmm-items">
          <span class="gmm-item">Time series · Stat · Gauge</span>
          <span class="gmm-item">Heatmap · Histogram</span>
          <span class="gmm-item">Table · Logs · Traces</span>
          <span class="gmm-item">Node Graph · Geomap</span>
          <span class="gmm-item">State timeline · Status history</span>
          <span class="gmm-item">Transformations · Overrides</span>
          <span class="gmm-item">Thresholds · Field options</span>
        </div>
      </div>
      <div class="gmm-branch" style="border-left-color:#22d3ee">
        <div class="gmm-node" style="color:#22d3ee">Dashboards</div>
        <div class="gmm-items">
          <span class="gmm-item">Variables (query, custom, interval, ds)</span>
          <span class="gmm-item">Annotations (deploys, eventos)</span>
          <span class="gmm-item">Links (drill-down entre dashboards)</span>
          <span class="gmm-item">Repeating panels (por variable)</span>
          <span class="gmm-item">Library panels (componentes reusáveis)</span>
          <span class="gmm-item">Sharing · Snapshots · Embed</span>
          <span class="gmm-item">JSON model versionável</span>
        </div>
      </div>
    </div>
    <div class="gmm-row">
      <div class="gmm-branch" style="border-left-color:#ef4444">
        <div class="gmm-node" style="color:#ef4444">Alerting (unified)</div>
        <div class="gmm-items">
          <span class="gmm-item">Alert rules (multi-dimensional)</span>
          <span class="gmm-item">Contact points (Slack/PD/email)</span>
          <span class="gmm-item">Notification policies (routing)</span>
          <span class="gmm-item">Silences (matchers temporários)</span>
          <span class="gmm-item">Inhibitions (suprimir secundários)</span>
          <span class="gmm-item">Mute timings (manutenção)</span>
          <span class="gmm-item">State machine: Normal/Pending/Firing</span>
        </div>
      </div>
      <div class="gmm-branch" style="border-left-color:#a855f7">
        <div class="gmm-node" style="color:#a855f7">Grafana Stack (LGTM)</div>
        <div class="gmm-items">
          <span class="gmm-item">Loki — logs (indexa só labels)</span>
          <span class="gmm-item">Grafana — UI (não armazena nada)</span>
          <span class="gmm-item">Tempo — traces (object storage)</span>
          <span class="gmm-item">Mimir — métricas escaláveis</span>
          <span class="gmm-item">Pyroscope — profiles contínuos</span>
          <span class="gmm-item">Beyla — eBPF auto-instrumentation</span>
          <span class="gmm-item">Faro — RUM (browser telemetry)</span>
        </div>
      </div>
      <div class="gmm-branch" style="border-left-color:#4ade80">
        <div class="gmm-node" style="color:#4ade80">Provisioning / IaC</div>
        <div class="gmm-items">
          <span class="gmm-item">Datasources YAML</span>
          <span class="gmm-item">Dashboards JSON em Git</span>
          <span class="gmm-item">Terraform (grafana provider)</span>
          <span class="gmm-item">Helm (kube-prometheus-stack)</span>
          <span class="gmm-item">Grafonnet (Jsonnet — DRY)</span>
          <span class="gmm-item">allowUiUpdates: false em prod</span>
          <span class="gmm-item">GitOps (ArgoCD/Flux)</span>
        </div>
      </div>
    </div>
    <div class="gmm-row">
      <div class="gmm-branch" style="border-left-color:#fb7185">
        <div class="gmm-node" style="color:#fb7185">Correlação (LGTM)</div>
        <div class="gmm-items">
          <span class="gmm-item">Exemplars — métrica → trace</span>
          <span class="gmm-item">tracesToLogsV2 — trace → logs</span>
          <span class="gmm-item">derivedFields — log → trace</span>
          <span class="gmm-item">tracesToMetrics — trace → métrica</span>
          <span class="gmm-item">Service Graph (node graph auto)</span>
          <span class="gmm-item">trace_id em todos os sinais</span>
        </div>
      </div>
      <div class="gmm-branch" style="border-left-color:#60a5fa">
        <div class="gmm-node" style="color:#60a5fa">Enterprise / Cloud</div>
        <div class="gmm-items">
          <span class="gmm-item">RBAC granular (folders/teams)</span>
          <span class="gmm-item">SSO (SAML, LDAP, OAuth, Okta)</span>
          <span class="gmm-item">Reporting (PDF agendado)</span>
          <span class="gmm-item">OnCall (incident management)</span>
          <span class="gmm-item">IRM · SLO · k6 (load testing)</span>
          <span class="gmm-item">Multi-tenancy (X-Scope-OrgID)</span>
          <span class="gmm-item">Query caching · Recorded queries</span>
        </div>
      </div>
      <div class="gmm-branch" style="border-left-color:#94a3b8">
        <div class="gmm-node" style="color:#94a3b8">Plugins · Extensões</div>
        <div class="gmm-items">
          <span class="gmm-item">App plugins (Synthetic, k6)</span>
          <span class="gmm-item">Panel plugins (custom viz)</span>
          <span class="gmm-item">Datasource plugins (custom)</span>
          <span class="gmm-item">Catalog público (300+)</span>
          <span class="gmm-item">Dev kit para criar plugins</span>
        </div>
      </div>
    </div>
  </div>
</div>`,
      caption: "Grafana é UI + ecossistema. O LGTM stack cobre logs/métricas/traces/profiles, Provisioning blinda contra config drift, Alerting unified centraliza routing, e Correlação (exemplars + tracesToLogs) é o que diferencia observabilidade moderna de dashboards isolados.",
    },
    exercises: [
      {
        level: 'iniciante',
        title: "Suba a stack LGTM local com docker-compose e crie 1 dashboard",
        description: "Suba docker-compose com: Grafana, Prometheus, Loki, Tempo, OTel Collector. Instrumente um app Node.js simples (Express + endpoint /hello) com prom-client (métrica http_requests_total) e Pino (logs JSON com trace_id). Configure Grafana com 3 datasources: Prometheus, Loki, Tempo. Crie dashboard com 4 painéis: 1) rate de requests por status, 2) p99 latency com histogram_quantile, 3) logs do Loki filtrados por level=error, 4) traces do Tempo recentes. Adicione variable $service.",
        concepts: ["docker-compose", "datasources", "PromQL básico", "LogQL básico", "variables", "panel types"],
        hint: "Use a imagem grafana/grafana:latest e prom/prometheus:latest. Para datasources via env, use GF_INSTALL_PLUGINS e provisioning em /etc/grafana/provisioning/datasources/. O OTel Collector recebe via OTLP e exporta para Tempo (otlphttp) e Prometheus (prometheusremotewrite).",
        relatedKeypoints: [0, 1, 2],
      },
      {
        level: 'intermediario',
        title: "Configure exemplars de ponta a ponta e correlacione p99 → trace → log",
        description: "Partindo do exercício anterior, ative exemplars: 1) flag --enable-feature=exemplar-storage no Prometheus, 2) scrape_protocols: [OpenMetricsText1.0.0] no scrape_config, 3) exemplarTraceIdDestinations no datasource Prometheus apontando para Tempo, 4) tracesToLogsV2 no datasource Tempo apontando para Loki. Instrumente o app com OpenTelemetry SDK (não só prom-client) — histogram precisa emitir trace_id como exemplar. Em seguida: gere tráfego com latência variada (sleep aleatório), abra o painel de p99, clique num diamante de exemplar — confirme que abre o trace no Tempo — clique em 'View logs' — confirme que abre Loki filtrado pelo trace_id.",
        concepts: ["exemplars", "OpenMetrics", "tracesToLogsV2", "derivedFields", "OpenTelemetry SDK", "trace propagation"],
        hint: "Se exemplars não aparecem: verifique no /metrics do app que tem '# HELP ...' e linhas com '# {trace_id=\"...\"} value timestamp'. Se está vazio, o SDK não tá injetando — confira que você usa otel-sdk-node, não só prom-client puro.",
        relatedKeypoints: [7, 5, 4],
      },
      {
        level: 'intermediario',
        title: "Versione um dashboard via Terraform com grafana provider",
        description: "Crie um repositório Terraform que provisiona: 1) folder 'Platform', 2) team 'platform-squad' com Editor no folder, 3) datasource Prometheus, 4) dashboard checkout-slo (JSON exportado do exercício anterior) via grafana_dashboard. Implemente CI (GitHub Actions) que roda terraform fmt, validate e plan em PRs. Configure no Grafana allowUiUpdates: false — qualquer mudança de dashboard tem que vir por PR. Bonus: use grafana_folder_permission para dar Viewer ao team 'all-engineers'.",
        concepts: ["Terraform", "grafana provider", "RBAC", "folders/teams", "GitOps", "allowUiUpdates"],
        hint: "Use o provider grafana/grafana (não terraform-provider-grafana antigo). API key via service account (admin com role Editor). Para JSON do dashboard, use file('dashboards/checkout.json') para manter o JSON separado e legível.",
        relatedKeypoints: [9, 11],
      },
      {
        level: 'senior',
        title: "Implemente alerting de SLO com multi-window burn rate completo",
        description: "Defina SLO de 99.9% para o app do exercício 1. Crie recording rules em PrometheusRule: job:sli_errors:ratio_rate_5m, ratio_rate_1h, ratio_rate_6h, ratio_rate_3d. Crie 4 alert rules em Grafana Alerting: 1) Page (1h+5m, burn rate 14×), 2) Page (6h+30m, burn rate 6×), 3) Ticket (24h+2h, burn rate 3×), 4) Ticket (3d+6h, burn rate 1×). Configure notification policy: severity=critical → Slack #oncall imediato; severity=warning → Jira (via webhook) no horário comercial. Configure mute timing 'maintenance' das 02h-04h dom. Teste com chaos: derrube o app por 5 min e confirme que só o alerta correto dispara (page de 1h, não os outros).",
        concepts: ["multi-window burn rate", "recording rules", "notification policies", "mute timings", "chaos testing", "SLO methodology"],
        hint: "Burn rate threshold com SLO 99.9%: 14× → erro_rate > 0.0144. Multi-window AND: a janela curta (1h) detecta cedo, a janela longa (6h) confirma que não é spike — alert só firing quando ambas excedem. Use SRE workbook como referência.",
        relatedKeypoints: [3, 12],
      },
      {
        level: 'senior',
        title: "Construa dashboard de RED metrics + USE method com Grafonnet",
        description: "Refatore o dashboard manual em Grafonnet (Jsonnet): defina template que gera dashboard padrão por serviço com painéis RED (Rate, Errors, Duration) e USE (Utilization, Saturation, Errors) para K8s pod. O template aceita parâmetros (service_name, namespace, slo_target). Gere dashboards para 5 serviços fictícios via loop em Jsonnet. Compile (jsonnet eval) para JSON, provisione via Terraform. Bonus: adicione library panel para o painel de SLO budget — reutilizado entre dashboards. Confirme que mudar o library panel atualiza todos os dashboards que o usam.",
        concepts: ["Grafonnet", "Jsonnet", "library panels", "RED metrics", "USE method", "DRY em dashboards"],
        hint: "Grafonnet 2.x usa jsonnet-libs/grafonnet — instale via jsonnet-bundler (jb init && jb install github.com/grafana/grafonnet). Comece com o exemplo do README, adapte. Library panel cria-se via UI uma vez, depois é referenciado por UID nos dashboards Grafonnet.",
        relatedKeypoints: [9, 1],
      },
    ],
    codeExamples: [
      {
        title: "datasources.yaml — provisioning completo do LGTM com correlação",
        description: "Configura Prometheus, Loki e Tempo com correlação automática: exemplars, tracesToLogs, derivedFields. Cole em /etc/grafana/provisioning/datasources/.",
        language: "yaml",
        code: `apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    jsonData:
      timeInterval: "15s"
      # Exemplars: clica em ponto da métrica → abre trace no Tempo
      exemplarTraceIdDestinations:
        - name: trace_id
          datasourceUid: tempo

  - name: Loki
    type: loki
    access: proxy
    url: http://loki:3100
    jsonData:
      # Logs com trace_id viram link clicável → Tempo
      derivedFields:
        - name: TraceID
          matcherRegex: 'trace_id=(\\w+)'
          url: '$\${__value.raw}'
          datasourceUid: tempo

  - name: Tempo
    type: tempo
    access: proxy
    url: http://tempo:3200
    uid: tempo
    jsonData:
      # Span no Tempo → botão "View logs" abre Loki filtrado
      tracesToLogsV2:
        datasourceUid: loki
        tags:
          - key: 'service.name'
            value: 'service'
        filterByTraceID: true
        filterBySpanID: false
      # Span → métricas do serviço (RED)
      tracesToMetrics:
        datasourceUid: prometheus
        tags:
          - key: 'service.name'
            value: 'service'
        queries:
          - name: 'Sample query'
            query: 'sum by (status) (rate(http_requests_total{$$__tags}[5m]))'
      # Service Graph (node graph automático)
      serviceMap:
        datasourceUid: prometheus
      nodeGraph:
        enabled: true`,
      },
      {
        title: "PrometheusRule — recording rules + multi-window alerts para SLO 99.9%",
        description: "Recording rules pré-computam SLI em múltiplas janelas. Alert rules implementam multi-window burn rate do SRE Workbook.",
        language: "yaml",
        code: `apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: api-slo
  labels:
    prometheus: kube-prometheus
spec:
  groups:
    - name: api-sli-recording
      interval: 30s
      rules:
        - record: job:sli_errors:ratio_rate5m
          expr: |
            sum by (job) (rate(http_requests_total{job="api",status=~"5.."}[5m]))
            /
            sum by (job) (rate(http_requests_total{job="api"}[5m]))

        - record: job:sli_errors:ratio_rate1h
          expr: |
            sum by (job) (rate(http_requests_total{job="api",status=~"5.."}[1h]))
            /
            sum by (job) (rate(http_requests_total{job="api"}[1h]))

        - record: job:sli_errors:ratio_rate6h
          expr: |
            sum by (job) (rate(http_requests_total{job="api",status=~"5.."}[6h]))
            /
            sum by (job) (rate(http_requests_total{job="api"}[6h]))

    - name: api-slo-burn-rate
      rules:
        # Page — burn rate 14x em 1h+5m AND 6h+30m
        - alert: APIErrorBudgetBurn_Critical
          expr: |
            (
              job:sli_errors:ratio_rate5m{job="api"} > (14.4 * 0.001)
              and
              job:sli_errors:ratio_rate1h{job="api"} > (14.4 * 0.001)
            )
          for: 2m
          labels:
            severity: critical
            team: platform
          annotations:
            summary: 'API error budget burn rate alto — esgota em ~2 dias'
            runbook_url: https://runbooks.example/api-burn-rate`,
      },
      {
        title: "Webhook de annotation — marcar deploys no Grafana via CI/CD",
        description: "Script bash chamado pelo CI após deploy bem-sucedido. Cria annotation linkada ao dashboard SLO do serviço.",
        language: "bash",
        code: `#!/usr/bin/env bash
set -euo pipefail

SERVICE="\${SERVICE:-checkout}"
VERSION="\${VERSION:-$(git rev-parse --short HEAD)}"
ENV="\${ENV:-prod}"
DASHBOARD_UID="\${DASHBOARD_UID:-checkout-slo}"

GRAFANA_URL="\${GRAFANA_URL:?GRAFANA_URL is required}"
GRAFANA_API_KEY="\${GRAFANA_API_KEY:?GRAFANA_API_KEY is required}"

NOW_MS=$(($(date +%s) * 1000))

curl -sS -X POST "\${GRAFANA_URL}/api/annotations" \\
  -H "Authorization: Bearer \${GRAFANA_API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d "{
    \\"dashboardUID\\": \\"\${DASHBOARD_UID}\\",
    \\"time\\": \${NOW_MS},
    \\"tags\\": [\\"deploy\\", \\"\${SERVICE}\\", \\"\${ENV}\\", \\"v\${VERSION}\\"],
    \\"text\\": \\"Deploy \${SERVICE} v\${VERSION} em \${ENV}\\"
  }"

echo "OK: annotation criada para \${SERVICE} v\${VERSION}"`,
      },
      {
        title: "Terraform — dashboard versionado + folder + RBAC com team",
        description: "Provisiona dashboard de checkout em folder Platform com permissões corretas: time platform tem Editor, todos os engenheiros têm Viewer.",
        language: "hcl",
        code: `terraform {
  required_providers {
    grafana = {
      source  = "grafana/grafana"
      version = "~> 3.0"
    }
  }
}

provider "grafana" {
  url  = var.grafana_url
  auth = var.grafana_api_key
}

resource "grafana_folder" "platform" {
  title = "Platform"
}

resource "grafana_team" "platform_squad" {
  name  = "platform-squad"
  email = "platform@example.com"
}

resource "grafana_dashboard" "checkout_slo" {
  folder      = grafana_folder.platform.uid
  config_json = file("dashboards/checkout-slo.json")
  overwrite   = true
}

resource "grafana_folder_permission" "platform_perms" {
  folder_uid = grafana_folder.platform.uid

  permissions {
    team_id    = grafana_team.platform_squad.id
    permission = "Edit"
  }

  permissions {
    role       = "Viewer"
    permission = "View"
  }
}

variable "grafana_url" { type = string }
variable "grafana_api_key" {
  type      = string
  sensitive = true
}`,
      },
    ],
    mnemonics: [
      {
        label: "LGTM — os 4 pilares da observabilidade open source",
        trick: "Loki · Grafana · Tempo · Mimir",
        explanation: "Memorize na ordem L-G-T-M (sigla do stack): Loki (logs, indexa só labels), Grafana (UI, não armazena nada), Tempo (traces sem índice de atributos), Mimir (métricas Prometheus escalável). Adicione P de Pyroscope (profiles) para LGTMP — stack moderno com 5 pilares de telemetria.",
      },
      {
        label: "RED metrics — 3 perguntas para qualquer serviço HTTP",
        trick: "R-E-D · Rate, Errors, Duration",
        explanation: "Para qualquer dashboard de serviço: Rate (rate(requests_total[5m])), Errors (rate(requests_total{status=~'5..'}[5m])), Duration (histogram_quantile(0.99, ...)). Esses 3 painéis cobrem 80% dos casos de SLO. Para infra (CPU, disk), use USE: Utilization, Saturation, Errors. RED para serviços, USE para recursos.",
      },
      {
        label: "Cardinalidade no Loki — labels têm que ser baixas",
        trick: "BOX (Baixa cardinalidade Or eXplosão)",
        explanation: "Labels do Loki devem ter cardinalidade baixa: service, env, level, pod (centenas). Cardinalidade alta = explosão de chunks pequenos = performance ruim e custo alto. NUNCA como label: user_id, request_id, trace_id, query_string. Esses ficam no conteúdo do log (JSON estruturado). Mesma regra do Prometheus, mas mais crítica no Loki.",
      },
      {
        label: "Multi-window burn rate — 14·6·3·1",
        trick: "14·6·3·1 — janelas curtas para alarmes urgentes, longas para tendências",
        explanation: "SRE Workbook: 4 alertas combinando janelas e burn rates. Page: 14× em 1h+5m (esgota em 2d), 6× em 6h+30m. Ticket: 3× em 24h+2h, 1× em 3d+6h. Janela curta detecta rápido; janela longa confirma que não é spike. Multi-window AND elimina falsos positivos sem atrasar alertas reais. Memorizar 14·6·3·1 dá vantagem em entrevista de senior SRE.",
      },
    ],
    resources: [
      { title: "Grafana docs (oficial)", url: "https://grafana.com/docs/grafana/latest/", kind: "docs" },
      { title: "Grafana Play — sandbox público interativo", url: "https://play.grafana.org/", kind: "pratica" },
      { title: "Loki docs — LogQL completo", url: "https://grafana.com/docs/loki/latest/query/", kind: "docs" },
      { title: "Tempo docs — TraceQL", url: "https://grafana.com/docs/tempo/latest/traceql/", kind: "docs" },
      { title: "Mimir docs — multi-tenant Prometheus", url: "https://grafana.com/docs/mimir/latest/", kind: "docs" },
      { title: "Grafana provider (Terraform)", url: "https://registry.terraform.io/providers/grafana/grafana/latest/docs", kind: "docs" },
      { title: "Grafonnet — Jsonnet library", url: "https://github.com/grafana/grafonnet", kind: "docs" },
      { title: "kube-prometheus-stack (Helm)", url: "https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack", kind: "pratica" },
      { title: "SRE Workbook — Alerting on SLOs (multi-window)", url: "https://sre.google/workbook/alerting-on-slos/", kind: "livro" },
      { title: "Grafana Labs YouTube — GrafanaCONline", url: "https://www.youtube.com/@Grafana", kind: "video" },
      { title: "Awesome Grafana — listas curadas", url: "https://github.com/zuchka/awesome-grafana", kind: "artigo" },
    ],
  }

export default grafana
