import type { SkillContentMap } from "@/types"

export default {
  "opentelemetry": {
    tagline: "Padrão aberto para instrumentação: traces, metrics e logs em qualquer stack.",
    why: "OpenTelemetry virou o padrão de observabilidade em 2024–2025. Saber instrumentar, propagar contexto e exportar para backends (Jaeger, Datadog, Honeycomb) é diferencial em vaga sênior. Times que adotam OTel eliminam vendor lock-in e padronizam toda a telemetria numa API única. Entender o Collector, tail sampling e W3C TraceContext é o que separa quem 'ligou o auto-instr' de quem realmente opera observabilidade em produção.",
    prerequisite: "Entender o básico de HTTP, chamadas de serviço distribuído e o conceito de latência. Ter visto Prometheus ou Jaeger antes ajuda, mas não é obrigatório. Conhecimento de YAML para configurar o Collector.",
    summary: "OpenTelemetry (OTel) é um projeto CNCF que unifica a coleta de sinais de observabilidade: traces (rastreamento distribuído), metrics (contadores, gauges, histogramas) e logs. Fornece SDKs para 10+ linguagens, o protocolo OTLP, e o Collector como agente/gateway. Substitui Jaeger client, Prometheus client e similares com uma API única vendor-neutral.\n\nO fluxo básico: você instrumenta o código com o SDK (manualmente ou via auto-instrumentação), os sinais são exportados via OTLP para o Collector, que processa (filtra, enriquece, faz sampling) e repassa ao backend de escolha (Jaeger, Grafana Tempo, Datadog, Honeycomb).\n\nContext propagation é o coração dos traces distribuídos: o trace_id e span_id viajam nos headers HTTP (W3C TraceContext), permitindo reconstituir a jornada de uma requisição através de dezenas de serviços. Sem propagação correta, o trace quebra na fronteira de qualquer serviço.\n\nSampling é crítico em produção: coletar 100% das traces é caro. Head sampling decide na entrada da requisição; tail sampling no Collector decide após ver a trace completa — ideal para capturar todas as falhas e amostrar o resto.",
    howToStudy: "<strong>Tem 30 minutos antes de uma entrevista?</strong> Leia o modelo mental (diagrama 1), os gotchas e as Q&As de nível pleno. Treine em voz alta explicando a diferença entre trace, span e log, e o que é propagação de contexto.<br><br><strong>Tem um fim de semana?</strong> Leia os keypoints em ordem, reproduza os snippets de auto-instrumentação e manual, explore o diagrama de propagação de contexto e o pipeline do Collector. Monte um serviço Node.js simples com OTel SDK e exporte para Jaeger local.<br><br><strong>Tem uma semana?</strong> Configure um OTel Collector completo com tail sampling stateful, implemente propagação em BullMQ, e escreva spans manuais com Semantic Conventions corretas.",
    diagrams: [
      {
        title: "Arquitetura OTel completa — SDK → Collector → backends",
        html: `<style>
.otel1-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.otel1-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(245,168,0,.4);display:inline}
.otel1-tip:hover .otel1-tb{display:block}
.otel1-tb{display:none;position:absolute;bottom:calc(100%+8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:220px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.8)}
.otel1-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.otel1-box{background:#1e293b;border-radius:10px;padding:12px 14px;border:1.5px solid #334155}
.otel1-lbl{font-size:9px;letter-spacing:.1em;text-transform:uppercase;margin-bottom:5px;font-weight:600}
.otel1-pill{display:inline-block;font-size:9px;padding:2px 8px;border-radius:20px;font-weight:600;margin:2px 1px}
.otel1-arrow{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;flex-shrink:0}
@keyframes otel1-flow{0%{opacity:0;transform:translateX(-6px)}30%{opacity:1}70%{opacity:1}100%{opacity:0;transform:translateX(6px)}}
.otel1-dot{width:7px;height:7px;border-radius:50%;background:#f5a800;animation:otel1-flow 1.5s ease-in-out infinite}
.otel1-dot:nth-child(2){animation-delay:.35s}
.otel1-dot:nth-child(3){animation-delay:.7s}
</style>
<div class="otel1-wrap">
  <p style="font-size:12px;font-weight:600;margin:0 0 4px;color:#f5a800">Arquitetura OTel — SDK → Collector → Backends</p>
  <p style="font-size:10px;color:#475569;margin:0 0 18px">Passe o mouse nos termos <span style="border-bottom:1px dashed rgba(245,168,0,.4)">sublinhados</span> para ver detalhes</p>

  <div style="display:flex;align-items:stretch;gap:8px;flex-wrap:wrap">

    <!-- Coluna 1: Serviços -->
    <div style="display:flex;flex-direction:column;gap:8px;min-width:150px;flex:1">
      <div style="font-size:9px;color:#f5a800;letter-spacing:.1em;font-weight:600;text-transform:uppercase;margin-bottom:2px">① APLICAÇÃO</div>
      <div class="otel1-box" style="border-color:rgba(245,168,0,.35)">
        <div class="otel1-lbl" style="color:#f5a800">SDK Node.js</div>
        <div style="display:flex;flex-direction:column;gap:4px;margin-top:4px">
          <span class="otel1-pill" style="background:rgba(245,168,0,.12);color:#f5a800">
            <span class="otel1-tip">auto-instr<span class="otel1-tb">Auto-instrumentação via @opentelemetry/auto-instrumentations-node: injeta spans em Express, http, axios, pg, redis sem mudar código. Usa require() hook para monkey-patch em runtime.</span></span>
          </span>
          <span class="otel1-pill" style="background:rgba(245,168,0,.06);color:#fbbf24">
            <span class="otel1-tip">manual spans<span class="otel1-tb">tracer.startActiveSpan('processar-pedido', span => { span.setAttribute(...); span.end() }). Use para operações de negócio críticas que a auto-instrumentação não cobre.</span></span>
          </span>
          <span class="otel1-pill" style="background:rgba(245,168,0,.06);color:#fbbf24">
            <span class="otel1-tip">resource attrs<span class="otel1-tb">Metadados do processo: service.name, service.version, deployment.environment. Aparecem em todos os spans — permitem filtrar por serviço no backend.</span></span>
          </span>
        </div>
      </div>
      <div class="otel1-box" style="border-color:rgba(245,168,0,.2);opacity:.8">
        <div class="otel1-lbl" style="color:#f5a800">SDK Python</div>
        <div style="font-size:10px;color:#64748b;margin-top:4px">opentelemetry-distro + FastAPI, SQLAlchemy instrumentors</div>
      </div>
    </div>

    <!-- Seta OTLP -->
    <div class="otel1-arrow" style="padding:0 4px">
      <div class="otel1-dot"></div>
      <div class="otel1-dot"></div>
      <div class="otel1-dot"></div>
      <div style="font-size:8px;color:#f5a800;margin-top:3px;text-align:center">OTLP<br>gRPC/HTTP</div>
    </div>

    <!-- Coluna 2: Collector -->
    <div style="min-width:160px;flex:1.2">
      <div style="font-size:9px;color:#f5a800;letter-spacing:.1em;font-weight:600;text-transform:uppercase;margin-bottom:6px">② COLLECTOR</div>
      <div class="otel1-box" style="border-color:rgba(245,168,0,.5)">
        <div style="display:flex;flex-direction:column;gap:6px">
          <div style="background:rgba(59,130,246,.1);border:1px solid rgba(59,130,246,.25);border-radius:6px;padding:8px 10px">
            <div style="font-size:9px;color:#93c5fd;font-weight:600;letter-spacing:.08em;margin-bottom:4px">RECEIVERS</div>
            <div style="display:flex;gap:4px;flex-wrap:wrap">
              <span class="otel1-pill" style="background:rgba(59,130,246,.1);color:#93c5fd">
                <span class="otel1-tip">otlp<span class="otel1-tb">Recebe OTLP via gRPC (4317) e HTTP (4318). Principal receiver — todos os SDKs modernos usam OTLP.</span></span>
              </span>
              <span class="otel1-pill" style="background:rgba(59,130,246,.1);color:#93c5fd">
                <span class="otel1-tip">prometheus<span class="otel1-tb">Faz scrape de endpoints /metrics existentes. Útil para migração gradual — mantém exporters Prometheus enquanto migra para OTLP.</span></span>
              </span>
              <span class="otel1-pill" style="background:rgba(59,130,246,.1);color:#93c5fd">
                <span class="otel1-tip">jaeger<span class="otel1-tb">Recebe spans no formato Jaeger (Thrift, Proto). Para compatibilidade com clientes legados.</span></span>
              </span>
            </div>
          </div>
          <div style="background:rgba(168,85,247,.1);border:1px solid rgba(168,85,247,.25);border-radius:6px;padding:8px 10px">
            <div style="font-size:9px;color:#d8b4fe;font-weight:600;letter-spacing:.08em;margin-bottom:4px">PROCESSORS</div>
            <div style="display:flex;gap:4px;flex-wrap:wrap">
              <span class="otel1-pill" style="background:rgba(168,85,247,.1);color:#d8b4fe">
                <span class="otel1-tip">memory_limiter<span class="otel1-tb">CRÍTICO: limita uso de memória do Collector. Sem ele, um pico de tráfego causa OOM e derruba o Collector inteiro. Configure sempre como primeiro processor.</span></span>
              </span>
              <span class="otel1-pill" style="background:rgba(168,85,247,.1);color:#d8b4fe">
                <span class="otel1-tip">batch<span class="otel1-tb">Agrupa spans em lotes antes de exportar. Reduz conexões e melhora throughput. Configure send_batch_size e timeout.</span></span>
              </span>
              <span class="otel1-pill" style="background:rgba(168,85,247,.1);color:#d8b4fe">
                <span class="otel1-tip">tail_sampling<span class="otel1-tb">Guarda todos os spans de uma trace em memória e decide ao final — permite capturar 100% de erros mesmo amostrando apenas 1% do tráfego normal.</span></span>
              </span>
              <span class="otel1-pill" style="background:rgba(168,85,247,.1);color:#d8b4fe">
                <span class="otel1-tip">attributes<span class="otel1-tb">Adiciona, remove ou transforma atributos. Útil para redact de PII: delete user.email antes de exportar ao backend externo.</span></span>
              </span>
            </div>
          </div>
          <div style="background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.25);border-radius:6px;padding:8px 10px">
            <div style="font-size:9px;color:#86efac;font-weight:600;letter-spacing:.08em;margin-bottom:4px">EXPORTERS</div>
            <div style="display:flex;gap:4px;flex-wrap:wrap">
              <span class="otel1-pill" style="background:rgba(34,197,94,.1);color:#86efac">otlp → Tempo</span>
              <span class="otel1-pill" style="background:rgba(34,197,94,.1);color:#86efac">prometheus</span>
              <span class="otel1-pill" style="background:rgba(34,197,94,.1);color:#86efac">loki</span>
              <span class="otel1-pill" style="background:rgba(34,197,94,.1);color:#86efac">
                <span class="otel1-tip">datadog<span class="otel1-tb">Exporta para Datadog sem agente proprietário. Vendor-neutral: você pode trocar por honeycomb/newrelic mudando só o exporter no YAML do Collector.</span></span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Seta para backends -->
    <div class="otel1-arrow" style="padding:0 4px">
      <div class="otel1-dot"></div>
      <div class="otel1-dot"></div>
      <div class="otel1-dot"></div>
    </div>

    <!-- Coluna 3: Backends -->
    <div style="min-width:120px;flex:0.8">
      <div style="font-size:9px;color:#f5a800;letter-spacing:.1em;font-weight:600;text-transform:uppercase;margin-bottom:6px">③ BACKENDS</div>
      <div style="display:flex;flex-direction:column;gap:6px">
        <div class="otel1-box" style="border-color:rgba(147,197,253,.3);padding:8px 12px">
          <div style="font-size:9px;color:#93c5fd;font-weight:700">TRACES</div>
          <div style="font-size:11px;color:#e2e8f0;margin-top:3px">Grafana Tempo</div>
          <div style="font-size:9px;color:#475569;margin-top:2px">Jaeger</div>
        </div>
        <div class="otel1-box" style="border-color:rgba(134,239,172,.3);padding:8px 12px">
          <div style="font-size:9px;color:#86efac;font-weight:700">METRICS</div>
          <div style="font-size:11px;color:#e2e8f0;margin-top:3px">Prometheus</div>
          <div style="font-size:9px;color:#475569;margin-top:2px">Grafana Mimir</div>
        </div>
        <div class="otel1-box" style="border-color:rgba(253,230,138,.3);padding:8px 12px">
          <div style="font-size:9px;color:#fde68a;font-weight:700">LOGS</div>
          <div style="font-size:11px;color:#e2e8f0;margin-top:3px">Grafana Loki</div>
          <div style="font-size:9px;color:#475569;margin-top:2px">Elasticsearch</div>
        </div>
      </div>
    </div>
  </div>

  <div style="margin-top:16px;background:#1e293b;border-radius:8px;padding:12px 14px;border:1px solid rgba(245,168,0,.2)">
    <div style="font-size:9px;color:#f5a800;font-weight:600;letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px">Por que o Collector importa?</div>
    <div style="display:flex;gap:12px;flex-wrap:wrap">
      <div style="font-size:11px;color:#94a3b8;line-height:1.6;flex:1;min-width:200px">
        <strong style="color:#e2e8f0">Sem Collector:</strong> cada serviço exporta diretamente pro backend. Mudar de Jaeger para Tempo = mudar código em todos os serviços.
      </div>
      <div style="font-size:11px;color:#94a3b8;line-height:1.6;flex:1;min-width:200px">
        <strong style="color:#e2e8f0">Com Collector:</strong> mude só o YAML do Collector. Adicione sampling, PII redaction e múltiplos exporters sem tocar nas aplicações.
      </div>
    </div>
  </div>
</div>`,
        caption: "O Collector é o coração da arquitetura OTel: desacopla instrumentação de backend, permite múltiplos exporters, sampling centralizado e enriquecimento de atributos sem mudar código de aplicação. memory_limiter é obrigatório — sem ele o Collector vai a OOM.",
      },
      {
        title: "Propagação de contexto em microserviços — waterfall de trace distribuído",
        html: `<style>
.otel2-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.otel2-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(245,168,0,.4);display:inline}
.otel2-tip:hover .otel2-tb{display:block}
.otel2-tb{display:none;position:absolute;bottom:calc(100%+8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:220px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.8)}
.otel2-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.otel2-span{border-radius:4px;height:22px;display:flex;align-items:center;padding:0 8px;font-size:10px;font-weight:600;position:relative;cursor:default}
.otel2-span:hover .otel2-tb{display:block}
@keyframes otel2-req{0%{width:0;opacity:0}60%{opacity:1}100%{width:100%;opacity:.7}}
.otel2-req-line{height:2px;background:linear-gradient(90deg,#f5a800,#fbbf24);border-radius:2px;animation:otel2-req 1.8s ease-in-out infinite}
</style>
<div class="otel2-wrap">
  <p style="font-size:12px;font-weight:600;margin:0 0 4px;color:#f5a800">Propagação de contexto — waterfall de trace distribuído</p>
  <p style="font-size:10px;color:#475569;margin:0 0 18px">Como um trace_id viaja de serviço em serviço e monta a visão end-to-end</p>

  <!-- Header traceparent -->
  <div style="background:#1e293b;border-radius:8px;padding:12px 14px;margin-bottom:16px;border:1px solid rgba(245,168,0,.3)">
    <div style="font-size:9px;color:#f5a800;font-weight:600;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px">W3C TraceContext — header que viaja em cada requisição HTTP</div>
    <div style="font-family:'JetBrains Mono',monospace;font-size:11px;line-height:2">
      <span style="color:#94a3b8">traceparent: </span>
      <span class="otel2-tip" style="color:#f5a800">00<span class="otel2-tb">Versão do formato W3C TraceContext. Sempre 00 na versão atual.</span></span>
      <span style="color:#475569">-</span>
      <span class="otel2-tip" style="color:#fbbf24">4bf92f3577b34da6a3ce929d0e0e4736<span class="otel2-tb">trace_id: 128 bits (16 bytes) em hex. Único para toda a requisição distribuída. O mesmo trace_id aparece em todos os spans de todos os serviços.</span></span>
      <span style="color:#475569">-</span>
      <span class="otel2-tip" style="color:#86efac">00f067aa0ba902b7<span class="otel2-tb">parent_id (span_id): 64 bits. ID do span que enviou a requisição. O serviço receptor cria um filho desse span.</span></span>
      <span style="color:#475569">-</span>
      <span class="otel2-tip" style="color:#93c5fd">01<span class="otel2-tb">flags: 01 = sampled (esse trace deve ser coletado). 00 = não amostrado. O receptor deve honrar a decisão de sampling do iniciador.</span></span>
    </div>
  </div>

  <!-- Animação de request flow -->
  <div style="margin-bottom:16px">
    <div style="font-size:9px;color:#64748b;margin-bottom:6px;letter-spacing:.08em">REQUISIÇÃO ENTRANDO NO SISTEMA</div>
    <div class="otel2-req-line" style="width:100%"></div>
  </div>

  <!-- Waterfall -->
  <div style="display:flex;flex-direction:column;gap:4px;margin-bottom:16px">
    <!-- Linha de tempo -->
    <div style="display:flex;align-items:center;margin-bottom:8px">
      <div style="width:100px;flex-shrink:0"></div>
      <div style="flex:1;display:flex;justify-content:space-between;font-size:9px;color:#334155">
        <span>0ms</span><span>50ms</span><span>100ms</span><span>150ms</span><span>200ms</span>
      </div>
    </div>

    <!-- API Gateway — root span -->
    <div style="display:flex;align-items:center;gap:8px">
      <div style="width:100px;flex-shrink:0;font-size:10px;color:#e2e8f0;text-align:right">API Gateway</div>
      <div style="flex:1;position:relative">
        <div class="otel2-span otel2-tip" style="background:rgba(245,168,0,.2);border:1px solid rgba(245,168,0,.5);color:#f5a800;width:100%">
          <span class="otel2-tb">Span raiz (root span): cria o trace_id, gera o primeiro span_id. Propaga traceparent para todos os serviços downstream.</span>
          span: gateway.route [200ms]
        </div>
      </div>
    </div>

    <!-- Auth service -->
    <div style="display:flex;align-items:center;gap:8px">
      <div style="width:100px;flex-shrink:0;font-size:10px;color:#e2e8f0;text-align:right">Auth Service</div>
      <div style="flex:1;position:relative">
        <div class="otel2-span otel2-tip" style="background:rgba(147,197,253,.15);border:1px solid rgba(147,197,253,.4);color:#93c5fd;width:30%;margin-left:0%">
          <span class="otel2-tb">Child span: recebe traceparent do Gateway, extrai trace_id + parent_id. Cria novo span_id para este serviço. Autentica o token JWT — 30ms.</span>
          auth.validate [30ms]
        </div>
      </div>
    </div>

    <!-- Order service -->
    <div style="display:flex;align-items:center;gap:8px">
      <div style="width:100px;flex-shrink:0;font-size:10px;color:#e2e8f0;text-align:right">Order Service</div>
      <div style="flex:1;position:relative">
        <div class="otel2-span otel2-tip" style="background:rgba(134,239,172,.15);border:1px solid rgba(134,239,172,.4);color:#86efac;width:70%;margin-left:20%">
          <span class="otel2-tb">Child span do Gateway. Processa o pedido — 140ms. Cria spans filhos para cada operação interna (DB, cache).</span>
          order.process [140ms]
        </div>
      </div>
    </div>

    <!-- DB query dentro do order service -->
    <div style="display:flex;align-items:center;gap:8px">
      <div style="width:100px;flex-shrink:0;font-size:10px;color:#94a3b8;text-align:right;font-style:italic">  └ Postgres</div>
      <div style="flex:1;position:relative">
        <div class="otel2-span otel2-tip" style="background:rgba(251,191,36,.1);border:1px solid rgba(251,191,36,.3);color:#fbbf24;width:25%;margin-left:35%">
          <span class="otel2-tb">Span filho do Order Service — gerado automaticamente pelo instrumentor do pg. db.system=postgresql, db.statement=SELECT... Latência de banco: 50ms.</span>
          db.query [50ms]
        </div>
      </div>
    </div>

    <!-- Inventory service -->
    <div style="display:flex;align-items:center;gap:8px">
      <div style="width:100px;flex-shrink:0;font-size:10px;color:#e2e8f0;text-align:right">Inventory Svc</div>
      <div style="flex:1;position:relative">
        <div class="otel2-span otel2-tip" style="background:rgba(216,180,254,.15);border:1px solid rgba(216,180,254,.4);color:#d8b4fe;width:35%;margin-left:55%">
          <span class="otel2-tb">Child span do Order Service — chamada síncrona para verificar estoque. 70ms. O traceparent é injetado automaticamente no header HTTP.</span>
          inventory.check [70ms]
        </div>
      </div>
    </div>
  </div>

  <!-- Legenda trace_id compartilhado -->
  <div style="background:#1e293b;border-radius:8px;padding:12px 14px;border:1px solid rgba(245,168,0,.2)">
    <div style="font-size:9px;color:#f5a800;font-weight:600;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px">O que torna isso possível</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div style="font-size:11px;color:#94a3b8;line-height:1.6">
        <strong style="color:#e2e8f0">Mesmo trace_id</strong> em todos os 5 spans. No Jaeger/Tempo, você pesquisa por trace_id e vê a waterfall completa.
      </div>
      <div style="font-size:11px;color:#94a3b8;line-height:1.6">
        <strong style="color:#ef4444">Sem propagação</strong> (ex.: fila sem header): o trace quebra. Você vê o produtor e o consumidor como traces separadas — impossível correlacionar.
      </div>
    </div>
  </div>
</div>`,
        caption: "O traceparent carrega trace_id + span_id em cada hop. Cada serviço extrai, cria filho e injeta de volta. Resultado: waterfall completo de toda a requisição distribuída num único trace_id.",
      },
      {
        title: "Pipeline do Collector — receivers, processors, exporters em detalhe",
        html: `<style>
.otel3-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.otel3-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(245,168,0,.4);display:inline}
.otel3-tip:hover .otel3-tb{display:block}
.otel3-tb{display:none;position:absolute;bottom:calc(100%+8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:230px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.8)}
.otel3-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.otel3-comp{background:#1e293b;border-radius:8px;padding:10px 12px;border:1.5px solid #334155;margin-bottom:8px}
.otel3-badge{display:inline-block;font-size:9px;padding:2px 8px;border-radius:20px;font-weight:600;margin:2px 1px}
@keyframes otel3-pulse{0%,100%{opacity:.4}50%{opacity:1}}
.otel3-flow-dot{width:6px;height:6px;border-radius:50%;display:inline-block;animation:otel3-pulse 1.2s ease-in-out infinite}
</style>
<div class="otel3-wrap">
  <p style="font-size:12px;font-weight:600;margin:0 0 4px;color:#f5a800">OTel Collector — pipeline completo com YAML</p>
  <p style="font-size:10px;color:#475569;margin:0 0 16px">Cada bloco do YAML correspondendo a uma função real no pipeline</p>

  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:14px">

    <!-- Receivers -->
    <div>
      <div style="font-size:9px;color:#93c5fd;font-weight:600;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px">
        <span class="otel3-flow-dot" style="background:#93c5fd;margin-right:4px"></span>RECEIVERS
      </div>
      <div class="otel3-comp" style="border-color:rgba(147,197,253,.3)">
        <div style="font-size:10px;color:#93c5fd;font-weight:600;margin-bottom:6px">
          <span class="otel3-tip">otlp<span class="otel3-tb">Principal receiver. Aceita traces, metrics e logs via gRPC (porta 4317) e HTTP (4318). Todos os SDKs OTel modernos exportam nesse formato.</span></span>
        </div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#64748b;line-height:1.7">
          protocols:<br>&nbsp;grpc:<br>&nbsp;&nbsp;endpoint: 0.0.0.0:4317<br>&nbsp;http:<br>&nbsp;&nbsp;endpoint: 0.0.0.0:4318
        </div>
      </div>
      <div class="otel3-comp" style="border-color:rgba(147,197,253,.2)">
        <div style="font-size:10px;color:#93c5fd;font-weight:600;margin-bottom:4px">
          <span class="otel3-tip">prometheus<span class="otel3-tb">Faz scrape de /metrics no estilo Prometheus. Útil para aplicações que ainda não migraram para OTLP — o Collector faz a ponte.</span></span>
        </div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#64748b;line-height:1.7">
          config:<br>&nbsp;scrape_configs:<br>&nbsp;&nbsp;- job_name: legado<br>&nbsp;&nbsp;&nbsp;&nbsp;targets: [app:8080]
        </div>
      </div>
    </div>

    <!-- Processors -->
    <div>
      <div style="font-size:9px;color:#d8b4fe;font-weight:600;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px">
        <span class="otel3-flow-dot" style="background:#d8b4fe;margin-right:4px"></span>PROCESSORS
      </div>
      <div class="otel3-comp" style="border-color:rgba(239,68,68,.4)">
        <div style="font-size:10px;color:#ef4444;font-weight:700;margin-bottom:4px">
          <span class="otel3-tip">memory_limiter ①<span class="otel3-tb">DEVE ser o primeiro processor. Define limite de RAM. Quando atingido, começa a descartar dados em vez de travar. Sem isso: OOM mata o Collector e você perde telemetria por completo.</span></span>
        </div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#64748b;line-height:1.7">
          limit_mib: 512<br>check_interval: 1s<br>spike_limit_mib: 128
        </div>
      </div>
      <div class="otel3-comp" style="border-color:rgba(168,85,247,.3)">
        <div style="font-size:10px;color:#d8b4fe;font-weight:600;margin-bottom:4px">
          <span class="otel3-tip">batch ②<span class="otel3-tb">Acumula spans e os envia em lotes. Reduz conexões ao backend de ~1/span para ~1/batch. Melhora throughput e reduz custo de rede.</span></span>
        </div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#64748b;line-height:1.7">
          send_batch_size: 1000<br>timeout: 10s
        </div>
      </div>
      <div class="otel3-comp" style="border-color:rgba(168,85,247,.2)">
        <div style="font-size:10px;color:#d8b4fe;font-weight:600;margin-bottom:4px">
          <span class="otel3-tip">tail_sampling ③<span class="otel3-tb">Aguarda a trace completar (decision_wait) e avalia policies: erro (100% captura), latência alta (100%), rest (10%). Requer um Collector por trace_id — use load balancer com consistent hash.</span></span>
        </div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#64748b;line-height:1.7">
          decision_wait: 10s<br>policies:<br>&nbsp;- status_code: ERROR<br>&nbsp;- latency: 1000ms<br>&nbsp;- rate: 0.1
        </div>
      </div>
    </div>

    <!-- Exporters -->
    <div>
      <div style="font-size:9px;color:#86efac;font-weight:600;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px">
        <span class="otel3-flow-dot" style="background:#86efac;margin-right:4px"></span>EXPORTERS
      </div>
      <div class="otel3-comp" style="border-color:rgba(134,239,172,.3)">
        <div style="font-size:10px;color:#86efac;font-weight:600;margin-bottom:4px">
          <span class="otel3-tip">otlphttp → Tempo<span class="otel3-tb">Envia traces para Grafana Tempo via OTLP HTTP. Tempo armazena sem índice — consultas por trace_id são instantâneas via chunk lookup.</span></span>
        </div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#64748b;line-height:1.7">
          endpoint: http://tempo:4318<br>tls:<br>&nbsp;insecure: true
        </div>
      </div>
      <div class="otel3-comp" style="border-color:rgba(134,239,172,.2)">
        <div style="font-size:10px;color:#86efac;font-weight:600;margin-bottom:4px">
          <span class="otel3-tip">prometheusremotewrite<span class="otel3-tb">Envia metrics para Prometheus ou Mimir via remote_write. Converte métricas OTel para o formato Prometheus automaticamente.</span></span>
        </div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#64748b;line-height:1.7">
          endpoint: http://prometheus/<br>&nbsp;&nbsp;&nbsp;&nbsp;api/v1/write
        </div>
      </div>
      <div class="otel3-comp" style="border-color:rgba(134,239,172,.2)">
        <div style="font-size:10px;color:#86efac;font-weight:600;margin-bottom:4px">
          <span class="otel3-tip">loki<span class="otel3-tb">Envia logs para Grafana Loki. Correlação automática: trace_id no log vira link para o trace no Tempo — clique no Grafana e vai direto para o trace.</span></span>
        </div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#64748b;line-height:1.7">
          endpoint: http://loki:3100/loki<br>&nbsp;&nbsp;/api/v1/push
        </div>
      </div>
    </div>
  </div>

  <!-- Service pipeline -->
  <div style="background:#1e293b;border-radius:8px;padding:12px 14px;border:1px solid rgba(245,168,0,.2)">
    <div style="font-size:9px;color:#f5a800;font-weight:600;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px">service: pipelines — conectando os blocos</div>
    <div style="font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.9;color:#64748b">
      traces:<br>
      &nbsp;&nbsp;receivers: [<span style="color:#93c5fd">otlp</span>]<br>
      &nbsp;&nbsp;processors: [<span style="color:#ef4444">memory_limiter</span>, <span style="color:#d8b4fe">tail_sampling</span>, <span style="color:#d8b4fe">batch</span>]<br>
      &nbsp;&nbsp;exporters: [<span style="color:#86efac">otlphttp/tempo</span>]<br>
      metrics:<br>
      &nbsp;&nbsp;receivers: [<span style="color:#93c5fd">otlp</span>, <span style="color:#93c5fd">prometheus</span>]<br>
      &nbsp;&nbsp;processors: [<span style="color:#ef4444">memory_limiter</span>, <span style="color:#d8b4fe">batch</span>]<br>
      &nbsp;&nbsp;exporters: [<span style="color:#86efac">prometheusremotewrite</span>]
    </div>
  </div>
</div>`,
        caption: "memory_limiter sempre primeiro, batch sempre próximo ao fim, tail_sampling entre os dois. A ordem dos processors é sequencial — um erro de ordem pode fazer o Collector descartar dados sem avisar.",
      },
    ],
    cheatsheet: {
      title: "OpenTelemetry — cheatsheet de configuração",
      html: `<style>
.otelcs-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.otelcs-sec{margin-bottom:18px}
.otelcs-title{font-size:9px;color:#f5a800;font-weight:600;letter-spacing:.12em;text-transform:uppercase;margin-bottom:10px;padding-bottom:5px;border-bottom:1px solid rgba(245,168,0,.2)}
.otelcs-code{background:#1e293b;border-radius:8px;padding:12px 14px;font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.9;color:#94a3b8;overflow-x:auto}
.otelcs-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
</style>
<div class="otelcs-wrap">
  <p style="font-size:13px;font-weight:700;margin:0 0 18px;color:#f5a800">OpenTelemetry — cheatsheet completo</p>

  <div class="otelcs-sec">
    <div class="otelcs-title">Auto-instrumentação Node.js — bootstrap mínimo</div>
    <div class="otelcs-code"><span style="color:#64748b">// instrument.ts — importar ANTES de qualquer outro módulo</span>
<span style="color:#7c3aed">import</span> { NodeSDK } <span style="color:#7c3aed">from</span> <span style="color:#86efac">'@opentelemetry/sdk-node'</span>
<span style="color:#7c3aed">import</span> { getNodeAutoInstrumentations } <span style="color:#7c3aed">from</span> <span style="color:#86efac">'@opentelemetry/auto-instrumentations-node'</span>
<span style="color:#7c3aed">import</span> { OTLPTraceExporter } <span style="color:#7c3aed">from</span> <span style="color:#86efac">'@opentelemetry/exporter-trace-otlp-grpc'</span>
<span style="color:#7c3aed">import</span> { Resource } <span style="color:#7c3aed">from</span> <span style="color:#86efac">'@opentelemetry/resources'</span>
<span style="color:#7c3aed">import</span> { SemanticResourceAttributes <span style="color:#7c3aed">as</span> SRA } <span style="color:#7c3aed">from</span> <span style="color:#86efac">'@opentelemetry/semantic-conventions'</span>

<span style="color:#7c3aed">const</span> sdk = <span style="color:#7c3aed">new</span> NodeSDK({
  resource: <span style="color:#7c3aed">new</span> Resource({
    [SRA.SERVICE_NAME]: <span style="color:#86efac">'order-service'</span>,
    [SRA.SERVICE_VERSION]: <span style="color:#86efac">'1.4.2'</span>,
    [SRA.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV,
  }),
  traceExporter: <span style="color:#7c3aed">new</span> OTLPTraceExporter({
    url: <span style="color:#86efac">'grpc://otel-collector:4317'</span>,
  }),
  instrumentations: [getNodeAutoInstrumentations()],
})
sdk.start()</div>
  </div>

  <div class="otelcs-grid">
    <div class="otelcs-sec">
      <div class="otelcs-title">Span manual com atributos corretos</div>
      <div class="otelcs-code"><span style="color:#7c3aed">import</span> { trace, SpanStatusCode } <span style="color:#7c3aed">from</span> <span style="color:#86efac">'@opentelemetry/api'</span>

<span style="color:#7c3aed">const</span> tracer = trace.getTracer(<span style="color:#86efac">'order-service'</span>, <span style="color:#86efac">'1.0'</span>)

<span style="color:#7c3aed">async function</span> criarPedido(pedido: Pedido) {
  <span style="color:#7c3aed">return</span> tracer.startActiveSpan(
    <span style="color:#86efac">'pedido.criar'</span>,
    <span style="color:#7c3aed">async</span> (span) => {
      span.setAttributes({
        <span style="color:#86efac">'pedido.id'</span>: pedido.id,
        <span style="color:#86efac">'pedido.valor'</span>: pedido.total,
        <span style="color:#86efac">'pedido.itens'</span>: pedido.items.length,
      })
      <span style="color:#7c3aed">try</span> {
        <span style="color:#7c3aed">const</span> res = <span style="color:#7c3aed">await</span> db.pedidos.insert(pedido)
        span.setStatus({ code: SpanStatusCode.OK })
        <span style="color:#7c3aed">return</span> res
      } <span style="color:#7c3aed">catch</span> (err) {
        span.recordException(err <span style="color:#7c3aed">as</span> Error)
        span.setStatus({ code: SpanStatusCode.ERROR, message: (err <span style="color:#7c3aed">as</span> Error).message })
        <span style="color:#7c3aed">throw</span> err
      } <span style="color:#7c3aed">finally</span> {
        span.end() <span style="color:#64748b">// SEMPRE no finally</span>
      }
    }
  )
}</div>
    </div>

    <div class="otelcs-sec">
      <div class="otelcs-title">Auto-instrumentação Python</div>
      <div class="otelcs-code"><span style="color:#64748b"># pip install opentelemetry-distro opentelemetry-exporter-otlp
# opentelemetry-bootstrap -a install</span>

<span style="color:#7c3aed">from</span> opentelemetry <span style="color:#7c3aed">import</span> trace
<span style="color:#7c3aed">from</span> opentelemetry.sdk.trace <span style="color:#7c3aed">import</span> TracerProvider
<span style="color:#7c3aed">from</span> opentelemetry.sdk.trace.export <span style="color:#7c3aed">import</span> BatchSpanProcessor
<span style="color:#7c3aed">from</span> opentelemetry.exporter.otlp.proto.grpc.trace_exporter <span style="color:#7c3aed">import</span> OTLPSpanExporter
<span style="color:#7c3aed">from</span> opentelemetry.sdk.resources <span style="color:#7c3aed">import</span> Resource

provider = TracerProvider(
    resource=Resource.create({
        <span style="color:#86efac">"service.name"</span>: <span style="color:#86efac">"payment-service"</span>,
        <span style="color:#86efac">"service.version"</span>: <span style="color:#86efac">"2.1.0"</span>,
    })
)
provider.add_span_processor(
    BatchSpanProcessor(OTLPSpanExporter(
        endpoint=<span style="color:#86efac">"http://otel-collector:4317"</span>,
        insecure=True
    ))
)
trace.set_tracer_provider(provider)

<span style="color:#64748b"># Uso manual</span>
tracer = trace.get_tracer(<span style="color:#86efac">"payment-service"</span>)
<span style="color:#7c3aed">with</span> tracer.start_as_current_span(<span style="color:#86efac">"pagamento.processar"</span>) <span style="color:#7c3aed">as</span> span:
    span.set_attribute(<span style="color:#86efac">"pagamento.valor"</span>, valor)
    processar()</div>
    </div>
  </div>

  <div class="otelcs-sec">
    <div class="otelcs-title">Propagação em BullMQ / filas</div>
    <div class="otelcs-code"><span style="color:#7c3aed">import</span> { context, propagation, trace } <span style="color:#7c3aed">from</span> <span style="color:#86efac">'@opentelemetry/api'</span>
<span style="color:#7c3aed">import</span> { Queue, Worker } <span style="color:#7c3aed">from</span> <span style="color:#86efac">'bullmq'</span>

<span style="color:#64748b">// PRODUTOR — injetar contexto nos dados do job</span>
<span style="color:#7c3aed">async function</span> publicarPedido(pedido: Pedido) {
  <span style="color:#7c3aed">return</span> tracer.startActiveSpan(<span style="color:#86efac">'pedido.publicar'</span>, <span style="color:#7c3aed">async</span> (span) => {
    <span style="color:#7c3aed">const</span> carrier: Record&lt;string, string&gt; = {}
    propagation.inject(context.active(), carrier) <span style="color:#64748b">// injeta traceparent no carrier</span>
    <span style="color:#7c3aed">await</span> queue.add(<span style="color:#86efac">'processar-pedido'</span>, {
      ...pedido,
      _otelContext: carrier, <span style="color:#64748b">// viaja junto com os dados</span>
    })
    span.end()
  })
}

<span style="color:#64748b">// CONSUMIDOR — extrair contexto e criar filho</span>
<span style="color:#7c3aed">new</span> Worker(<span style="color:#86efac">'pedidos'</span>, <span style="color:#7c3aed">async</span> (job) => {
  <span style="color:#7c3aed">const</span> parentCtx = propagation.extract(context.active(), job.data._otelContext)
  <span style="color:#7c3aed">return</span> context.with(parentCtx, () =>
    tracer.startActiveSpan(<span style="color:#86efac">'pedido.consumir'</span>, <span style="color:#7c3aed">async</span> (span) => {
      <span style="color:#64748b">// este span é filho do span do produtor — trace continua!</span>
      span.setAttribute(<span style="color:#86efac">'job.id'</span>, job.id ?? <span style="color:#86efac">''</span>)
      <span style="color:#7c3aed">await</span> processarPedido(job.data)
      span.end()
    })
  )
})</div>
  </div>

  <div class="otelcs-sec">
    <div class="otelcs-title">Collector YAML — config completa para produção</div>
    <div class="otelcs-code">receivers:
  otlp:
    protocols:
      grpc: { endpoint: 0.0.0.0:4317 }
      http: { endpoint: 0.0.0.0:4318 }

processors:
  memory_limiter:         <span style="color:#64748b"># SEMPRE primeiro</span>
    limit_mib: 512
    check_interval: 1s
  tail_sampling:
    decision_wait: 10s
    num_traces: 100000
    policies:
      - name: erros
        type: status_code
        status_code: { status_codes: [ERROR] }
      - name: lento
        type: latency
        latency: { threshold_ms: 1000 }
      - name: amostra-geral
        type: probabilistic
        probabilistic: { sampling_percentage: 10 }
  batch:                  <span style="color:#64748b"># SEMPRE após sampling</span>
    send_batch_size: 1000
    timeout: 10s
  attributes:
    actions:
      - key: user.email   <span style="color:#64748b"># PII redaction</span>
        action: delete

exporters:
  otlphttp/tempo:
    endpoint: http://tempo:4318
  prometheusremotewrite:
    endpoint: http://prometheus:9090/api/v1/write
  loki:
    endpoint: http://loki:3100/loki/api/v1/push

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [memory_limiter, tail_sampling, batch]
      exporters: [otlphttp/tempo]
    metrics:
      receivers: [otlp]
      processors: [memory_limiter, batch]
      exporters: [prometheusremotewrite]
    logs:
      receivers: [otlp]
      processors: [memory_limiter, attributes, batch]
      exporters: [loki]</div>
  </div>
</div>`,
      caption: "Guia de referência rápida: bootstrap Node.js, span manual, propagação em filas e YAML completo do Collector.",
    },
    keypoints: [
      {
        title: "Três pilares da observabilidade",
        body: "Traces: span tree de uma requisição distribuída (latência por serviço, atributos, eventos). Metrics: dados numéricos agregados (counters, gauges, histogramas) ao longo do tempo. Logs: eventos discretos com contexto estruturado (trace_id, span_id correlacionados). Os três se complementam: alerta em métrica → trace para diagnóstico → log para detalhe. OTel unifica os três numa API única com correlação automática via trace_id.",
      },
      {
        title: "SDK e auto-instrumentação",
        body: "SDK disponível para Node, Python, Go, Java, .NET, PHP, Ruby, Rust, Swift. Auto-instrumentação (zero-code): injeta instrumentação em frameworks populares (Express, FastAPI, gRPC, Django, SQLAlchemy) sem modificar código. Usa require() hook (Node) ou sitecustomize.py (Python) para monkey-patch em runtime. Instrumentação manual via Tracer API para spans de negócio que a auto-instr não cobre.",
        code: `// Node.js — span manual com Semantic Conventions corretas
import { trace, SpanStatusCode } from '@opentelemetry/api'
const tracer = trace.getTracer('order-service', '1.0')

async function processarPedido(id: string) {
  return tracer.startActiveSpan('pedido.processar', async (span) => {
    // Semantic Convention: http.method, db.system, etc.
    span.setAttributes({
      'pedido.id': id,
      'pedido.ambiente': process.env.NODE_ENV ?? 'dev',
    })
    try {
      const res = await db.pedidos.find(id)
      span.setStatus({ code: SpanStatusCode.OK })
      return res
    } catch (err) {
      span.recordException(err as Error)
      span.setStatus({ code: SpanStatusCode.ERROR })
      throw err
    } finally {
      span.end() // SEMPRE no finally — garante que o span fecha mesmo em erro
    }
  })
}`,
      },
      {
        title: "Collector — agente, gateway e pipeline",
        body: "Agente standalone que recebe telemetria (OTLP, Jaeger, Zipkin, Prometheus scrape), processa (sampling, enriquecimento, filtragem, PII redaction) e exporta para backend. Pode rodar como sidecar (um por pod) ou gateway (centralizado). Desacopla código da aplicação do backend de destino — troca de backend = mudança no YAML do Collector, não no código.",
        code: `# Collector YAML mínimo para desenvolvimento
receivers:
  otlp:
    protocols:
      grpc: { endpoint: 0.0.0.0:4317 }
processors:
  memory_limiter:   # OBRIGATÓRIO — evita OOM
    limit_mib: 256
    check_interval: 1s
  batch:
    send_batch_size: 512
exporters:
  otlphttp/tempo:
    endpoint: http://tempo:4318
service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [memory_limiter, batch]
      exporters: [otlphttp/tempo]`,
      },
      {
        title: "Context Propagation — W3C TraceContext",
        body: "Trace context propagado via headers HTTP. W3C TraceContext (padrão): traceparent (versão + trace_id 128-bit + parent_id 64-bit + flags) e tracestate (metadados vendor-specific opcionais). B3 (Zipkin): alternativa mais antiga, dois headers (X-B3-TraceId, X-B3-SpanId). Em filas (Kafka, RabbitMQ, BullMQ): propagar via message attributes manualmente — sem isso o trace quebra na fronteira da fila.",
        code: `// traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
//              [v] [---------- trace_id 128-bit -------] [parent 64-bit] [flags]
// flags: 01 = sampled, 00 = não amostrado

// Injetar contexto manualmente (ex: para Redis, filas)
import { propagation, context } from '@opentelemetry/api'
const carrier: Record<string, string> = {}
propagation.inject(context.active(), carrier)
// carrier = { traceparent: '00-4bf92f...', tracestate: '' }

// Extrair contexto (consumidor)
const parentCtx = propagation.extract(context.active(), carrier)
context.with(parentCtx, () => {
  tracer.startActiveSpan('processar', span => { /* filho do produtor */ span.end() })
})`,
      },
      {
        title: "Sampling — head vs tail",
        body: "Head sampling: decisão no início da requisição antes de saber o resultado. Tipos: AlwaysOn (dev), AlwaysOff, TraceIdRatioBased (ex: 10%). Simples, sem estado, mas descarta traces de erros raros. Tail sampling no Collector: mantém todos os spans em memória por trace_id, decide após a trace completar. Permite capturar 100% de erros e amostrar o resto. Requer Collector stateful — com múltiplas instâncias, use load balancer com consistent hashing por trace_id.",
      },
      {
        title: "Semantic Conventions",
        body: "Nomes padrão de atributos de spans definidos pela spec OTel: http.request.method (antes http.method), http.response.status_code, db.system, db.statement, messaging.system, messaging.operation, rpc.service. Permitem queries pré-construídas e dashboards portáveis entre serviços e linguagens. Backends como Grafana Tempo e Jaeger constroem correlações automáticas com base nesses nomes.",
      },
      {
        title: "OTLP — protocolo de transporte",
        body: "OpenTelemetry Protocol: formato binário (protobuf) sobre gRPC (porta 4317) ou HTTP (4318). Substitui formatos proprietários. Suportado nativamente por todos os backends modernos (Datadog, Honeycomb, New Relic, Grafana Cloud). Compressão gzip disponível. gRPC oferece streaming; HTTP é mais simples para ambientes com proxy/firewall.",
      },
      {
        title: "Resource attributes — identidade do serviço",
        body: "Metadados estáticos do processo que aparecem em todos os spans: service.name (obrigatório), service.version, service.namespace, deployment.environment, host.name, k8s.pod.name. Permitem filtrar por serviço no backend. Resource é configurado uma vez no SDK — não em cada span. Em Kubernetes, use o K8s resource detector para preencher automaticamente k8s.*, host.*.",
      },
      {
        title: "Exemplars — link entre métrica e trace",
        body: "Exemplar é um ponto específico numa métrica (histogram) acompanhado do trace_id que causou aquele valor. Permite: no Grafana, clicar num ponto alto no gráfico de p99 e saltar direto para o trace que causou aquela latência. Requer: Prometheus 2.43+ com feature flag enable-feature=exemplar-storage, SDK OTel configurado para enviar exemplars, Grafana com Prometheus + Tempo configurados.",
        code: `# PromQL para ver exemplars de um histogram
# No Grafana: enable "Exemplars" no painel de time series
# O Prometheus armazena trace_id + valor de cada exemplar
# Exibe como pontos sobre o gráfico — clique → trace no Tempo`,
      },
      {
        title: "Instrumentação de banco de dados",
        body: "Auto-instrumentação cobre pg (PostgreSQL), mysql2, mongodb, redis, @prisma/client automaticamente. Gera spans com db.system, db.operation, db.statement (query SQL completa — atenção com PII). Para queries lentas: o span tem a duração exata — sem precisar de slow query log. Cuidado: db.statement pode vazar dados sensíveis (WHERE user.email = '...'). Use o attributes processor no Collector para redact.",
      },
      {
        title: "Métricas com OTel SDK",
        body: "OTel SDK também emite métricas além de traces. Tipos: Counter (add()), UpDownCounter (pode descer), Histogram (record()), ObservableGauge (polling). Exemplo: counter de pedidos processados por status. Exportados via OTLP para o Collector que repassa ao Prometheus. Permite ter traces e métricas com um único SDK e único pipeline.",
        code: `import { metrics } from '@opentelemetry/api'
const meter = metrics.getMeter('order-service', '1.0')

// Counter — soma cumulativa, use rate() no PromQL
const pedidosCriados = meter.createCounter('pedidos.criados.total', {
  description: 'Total de pedidos criados',
})

// Histogram — distribui valores em buckets
const latenciaPagamento = meter.createHistogram('pagamento.latencia', {
  description: 'Latência do processamento de pagamento',
  unit: 'ms',
})

// Uso
pedidosCriados.add(1, { 'pedido.status': 'aprovado' })
latenciaPagamento.record(235, { 'gateway': 'stripe' })`,
      },
      {
        title: "Logs estruturados com correlação",
        body: "OTel SDK injeta automaticamente trace_id e span_id nos logs estruturados quando você usa o log bridge do SDK. Com Pino (Node.js): configure o OTelBridgeHandler — cada log ganha { trace_id, span_id, trace_flags }. Resultado: no Grafana, de um log você abre o trace associado. Sem essa correlação, logs e traces são ilhas isoladas.",
        code: `import { logs, SeverityNumber } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-grpc'

// O SDK injeta trace_id/span_id em cada log automaticamente
// Pino + OTel bridge:
import pino from 'pino'
// configure pino com opentelemetry-pino-transport
// cada log.info({ msg }) vai incluir trace_id do span ativo`,
      },
      {
        title: "Collector: modo sidecar vs gateway",
        body: "Sidecar: um Collector por pod. Vantagem: isolamento (falha de um pod não afeta os outros), menor latência (loopback). Desvantagem: mais recursos (memória por pod). Gateway: um Collector centralizado. Vantagem: tail sampling stateful (vê todos os spans de uma trace), menos instâncias para gerenciar. Desvantagem: SPOF se não replicado. Híbrido: sidecar coleta e faz batching, gateway central faz tail sampling.",
      },
      {
        title: "Debugging do pipeline OTel",
        body: "Problemas comuns: 1) Spans não chegam ao backend — adicione o exporter 'logging' no Collector para ver o que está recebendo. 2) trace_id não propaga — verifique headers com curl -v e procure traceparent. 3) Spans com nome genérico 'HTTP GET' — configure url.sanitization para remover query strings variáveis. 4) Collector consumindo muita memória — ajuste memory_limiter e tail_sampling num_traces.",
        code: `# Exporter de debug — adicione ao Collector em dev
exporters:
  logging:
    verbosity: detailed    # imprime cada span no stdout
    sampling_initial: 2
    sampling_thereafter: 500

service:
  pipelines:
    traces:
      exporters: [otlphttp/tempo, logging]  # ambos em paralelo`,
      },
    ],
    gotchas: [
      "Instrumentar sem sampling em produção de alta carga — 100% de traces de 10k req/s = milhões de spans por minuto. Custo de storage explode. Configure tail sampling no Collector com políticas de erro + latência + amostra geral.",
      "Head sampling descarta erros raros — se você usa TraceIdRatioBased(0.01) e tem 0.1% de errors, a maioria das traces de erro é descartada. Use tail sampling para garantir 100% de captura de erros.",
      "Context propagation quebra na fronteira de filas — BullMQ, Kafka, RabbitMQ não propagam traceparent automaticamente. Você precisa injetar/extrair manualmente via propagation.inject/extract nos dados do job.",
      "Span attributes com PII — db.statement pode conter WHERE user.email = 'x@y.com'. user.id como atributo pode ser OK, mas email, CPF, senha nunca. Use o attributes processor no Collector para delete antes de exportar.",
      "Collector sem memory_limiter — em picos de tráfego, o Collector fica sem memória e é morto pelo OOM killer. Todo o pipeline de telemetria para. memory_limiter é o primeiro processor obrigatório em produção.",
      "Múltiplos Collectors com tail sampling sem consistent hashing — spans de um mesmo trace_id chegam em Collectors diferentes. Cada um vê só parte da trace e não consegue tomar decisão de sampling. Use loadbalancingexporter com consistent hash por trace_id.",
      "Semantic Conventions desatualizadas — http.method virou http.request.method na spec 1.20+. Se você usa o nome antigo, backends como Grafana Tempo podem não correlacionar automaticamente. Fique atento às versões da spec.",
      "span.end() fora do finally — se o código lança exceção antes de end(), o span fica aberto para sempre. Sempre use try/finally ou startActiveSpan com callback (que fecha automaticamente).",
    ],
    mnemonics: [
      {
        label: "TRACO — os sinais OTel",
        trick: "TRAço = TRAces + meCrics + lOgs",
        explanation: "Os três pilares da observabilidade no OTel. Traces para latência distribuída, Métricas para agregados numéricos, Logs para eventos discretos.",
      },
      {
        label: "RIPE — pipeline do Collector",
        trick: "Receivers → Ingesta → Processors → Exporters",
        explanation: "Ordem obrigatória no Collector: receivers recebem, processors transformam/filtram (memory_limiter SEMPRE primeiro), exporters enviam para backends.",
      },
      {
        label: "HEAD vs TAIL",
        trick: "HEAD decide no início (simples, sem estado). TAIL decide no final (sabe o resultado, custoso).",
        explanation: "Head sampling é estateless e barato mas pode perder erros raros. Tail sampling captura 100% dos erros mas precisa de memória para guardar a trace completa antes de decidir.",
      },
    ],
    interview: [
      {
        q: "Qual a diferença entre traces, metrics e logs? Como eles se complementam na prática?",
        a: "Traces: árvore de spans de uma requisição distribuída — latência por serviço, atributos, eventos. Responde 'onde foi lento e por quê?'. Metrics: dados numéricos agregados ao longo do tempo (req/s, p99, error rate). Responde 'o sistema está saudável agora?'. Logs: eventos discretos com contexto estruturado. Responde 'o que exatamente aconteceu?'. O fluxo prático: alerta dispara em métrica (error rate > 1%) → trace_id da requisição problemática → trace mostra qual serviço está falhando → log com o stack trace exato. Sem os três correlacionados, debugging distribuído é cego.",
        tip: "Mencione a correlação pelos campos trace_id e span_id nos logs — isso mostra que você entende o dado prático, não só o conceito teórico.",
        level: "pleno",
      },
      {
        q: "Por que usar OTel em vez do SDK proprietário de Datadog ou New Relic?",
        a: "Vendor lock-in: com OTel, você troca de backend sem mudar uma linha de código de instrumentação — só o YAML do Collector. Padrão da indústria: ferramentas OSS (Jaeger, Grafana Tempo) e SaaS (Datadog, Honeycomb, New Relic) suportam OTLP nativamente. API unificada: mesmo SDK para traces, metrics e logs em 10+ linguagens. Contra: agentes proprietários podem ter features extras (profiling contínuo, APM automático, live debugging, session replay). A escolha é flexibilidade de longo prazo com OTel vs. experiência out-of-the-box com agente proprietário.",
        tip: "Reconheça os trade-offs — entrevistador sênior espera nuance, não evangelismo cego. Diga quando um agente proprietário faz sentido.",
        level: "pleno",
      },
      {
        q: "O que é o W3C TraceContext e como ele funciona na prática?",
        a: "É o padrão de propagação de contexto de trace via headers HTTP. O header traceparent carrega: versão (00), trace_id (128-bit hex — mesmo em toda a requisição distribuída), parent_id (64-bit hex — span que originou a chamada) e flags (01 = sampled). Cada serviço extrai o contexto do header recebido, cria um span filho com novo span_id, executa sua lógica, e injeta o traceparent atualizado no header das chamadas downstream. Resultado: um único trace_id conecta todos os spans de todos os serviços — no Jaeger/Tempo você vê a waterfall completa.",
        tip: "Descrever o que cada campo do traceparent significa impressiona — mostra que você leu a spec, não só usou a biblioteca.",
        level: "pleno",
      },
      {
        q: "Como você implementaria tail sampling no OTel Collector?",
        a: "Tail sampling requer que o Collector veja todos os spans de uma trace antes de decidir. Configuração: usar o tail_sampling processor com policies — ex: capturar 100% de traces com status ERROR, 100% de traces com latência > 1s, 10% do restante (probabilistic). O Collector mantém estado em memória (buffer de spans por trace_id) durante a janela de decisão (decision_wait, ex: 10s). Em produção com múltiplos Collectors, usar o loadbalancingexporter para rotear spans do mesmo trace_id para o mesmo Collector (consistent hashing por trace_id) — sem isso cada Collector vê só parte da trace e não consegue decidir corretamente.",
        tip: "A parte do roteamento por trace_id no load balancer é o que diferencia sênior — é onde a maioria erra em produção.",
        level: "senior",
      },
      {
        q: "Como propagar contexto em sistemas de filas (BullMQ, Kafka)?",
        a: "Em HTTP é automático via headers. Em filas, é manual porque não há protocolo padrão de headers. Ao publicar: injetar o contexto OTel nos dados do job com propagation.inject(context.active(), carrier). Ao consumir: extrair com propagation.extract(context.active(), carrier) e executar dentro de context.with(parentCtx, ...). Sem isso, a trace quebra na fronteira da fila — produtor e consumidor aparecem como traces separadas sem link. SDKs OTel têm instrumentação automática para Kafka (@opentelemetry/instrumentation-kafkajs) que faz isso nos headers Kafka nativos.",
        tip: "Mostrar o código de inject/extract é melhor que descrever — memorize o padrão.",
        level: "senior",
      },
      {
        q: "O que são Semantic Conventions e por que são importantes?",
        a: "São nomes padrão de atributos de spans definidos pela spec OTel: http.request.method, http.response.status_code, db.system, db.statement, messaging.system, rpc.service. Importância: ferramentas como Grafana Tempo, Jaeger e backends SaaS constroem dashboards e correlações com base nesses nomes. Se você usa http.verb em vez de http.request.method, perde correlação automática. Também permite queries portáveis entre serviços em linguagens diferentes — 'mostre todas as queries de banco lentas' funciona porque todos usam db.statement.",
        level: "pleno",
      },
      {
        q: "Como você estruturaria a observabilidade de um serviço novo do zero com OTel?",
        a: "1. Instalar SDK + auto-instrumentação para o framework (Express, FastAPI). 2. Configurar Resource attributes: service.name, service.version, deployment.environment. 3. Exportar via OTLP para o Collector. 4. Criar spans manuais para operações de negócio críticas (processar pedido, autorizar pagamento) com atributos relevantes. 5. Definir métricas de negócio: orders_total, payment_failures_total — não só as técnicas do auto-instr. 6. Configurar sampling: AlwaysOn em dev, tail sampling em prod com 100% de erros. 7. Validar Semantic Conventions nos atributos. 8. Correlacionar logs com trace_id/span_id via SDK bridge.",
        tip: "Mostrar que você pensa em métricas de negócio e sampling — não só 'liguei o auto-instr' — é o que diferencia pleno de sênior.",
        level: "senior",
      },
      {
        q: "Qual a diferença entre head sampling e tail sampling? Quando usar cada um?",
        a: "Head sampling: decisão no início da requisição, antes de saber o resultado. Simples (sem estado), baixo overhead. Tipos: AlwaysOn, TraceIdRatioBased (ex: 10%). Problema: pode descartar traces de erros raros se o rate for baixo. Tail sampling: decisão após a trace completar — vê o resultado antes de decidir. Permite capturar 100% de erros e latências altas e amostrar o resto. Custo: estado em memória no Collector (buffer por trace_id), Collector stateful. Use head quando: volume é gerenciável e erros são frequentes. Use tail quando: erros são raros e você precisa capturá-los todos, ou quando o SLO depende de análise de outliers.",
        level: "senior",
      },
      {
        q: "O que são Exemplars no Prometheus e como se relacionam com OTel?",
        a: "Exemplar é um ponto específico num histogram Prometheus acompanhado do trace_id que causou aquele valor. Exemplo: histogram_quantile revela p99 de 2s — o exemplar aponta para o trace_id específico que demorou 2s. No Grafana com Prometheus + Tempo configurados: clique no ponto do gráfico → abre o trace diretamente. Configuração: Prometheus 2.43+ com --enable-feature=exemplar-storage, SDK OTel emitindo exemplars (ativado por padrão quando há trace ativo), Grafana com data source do Tempo linkado ao Prometheus.",
        tip: "Exemplars é a feature que concretiza 'métricas → trace em um clique' — mencioná-la mostra conhecimento avançado de observabilidade.",
        level: "senior",
      },
      {
        q: "Como você evitaria que dados sensíveis (PII) vazem pela telemetria?",
        a: "Fontes de vazamento: db.statement (SQL com WHERE email='x'), span attributes adicionados manualmente (user.email), logs com campos sensíveis. Defesa em camadas: 1) Educação do time: Semantic Conventions não incluem PII — user.id (opaque ID) é OK, user.email não. 2) Attributes processor no Collector: delete keys específicas (user.email, http.request.header.authorization) antes de exportar. 3) Redact de SQL: use db.statement.sanitized em vez de db.statement bruto para remover valores de parâmetros. 4) Auditoria: scrape do endpoint /metrics do Collector para monitorar atributos exportados.",
        level: "senior",
      },
      {
        q: "Por que o memory_limiter é obrigatório no Collector e o que acontece sem ele?",
        a: "Sem memory_limiter: em picos de tráfego (ex: viral, DDoS, deploy com bug que gera muitos erros), o Collector acumula spans em memória sem limite. O processo ultrapassa o limite de RAM do pod/container e é morto pelo OOM killer. Todo o pipeline de telemetria para — você fica cego exatamente quando mais precisa de observabilidade. Com memory_limiter como primeiro processor: quando atinge o limite, o Collector começa a descartar dados novos (com backpressure para o SDK) em vez de morrer. Você perde alguns spans, mas o pipeline permanece vivo. Configure: limit_mib razoável, spike_limit_mib para picos, check_interval de 1s.",
        tip: "Explicar o que acontece com e sem — não só 'é obrigatório porque sim' — demonstra entendimento operacional.",
        level: "senior",
      },
      {
        q: "Como você debugaria spans que não estão chegando ao backend?",
        a: "Diagnóstico em camadas: 1) SDK → Collector: adicione logging exporter no Collector (verbosity: detailed) — se os spans aparecem no stdout do Collector, o problema é no exporter. 2) Collector → backend: verifique logs do Collector por erros de conexão/autenticação no exporter. 3) SDK não instrumentado: verifique se o require('instrument') está sendo chamado antes de qualquer outro require — em ESM use --require flag. 4) Sampling: verifique se a decisão de sampling está correta — adicione AlwaysOn temporariamente para debug. 5) Context propagation quebrada: use curl -v para inspecionar os headers traceparent nas chamadas entre serviços.",
        level: "senior",
      },
      {
        q: "Como o OTel SDK gera métricas além de traces?",
        a: "O SDK OTel tem a Metrics API separada da Traces API. Tipos: Counter (add — só cresce, use rate() no PromQL), UpDownCounter (pode descer, ex: gauge de conexões), Histogram (record — distribui em buckets, use histogram_quantile), ObservableGauge (callback assíncrono para polling de valores, ex: tamanho de queue). Os três são exportados via OTLP pelo mesmo pipeline. Vantagem: um único SDK e uma única configuração de exporter para traces e métricas. Os exemplars conectam os dois: cada ponto do histogram pode carregar o trace_id do span ativo.",
        level: "pleno",
      },
      {
        q: "Qual a diferença entre sidecar e gateway para o Collector? Quando usar cada um?",
        a: "Sidecar: um Collector por pod. Isolamento (falha de um pod não derruba coleta dos outros), menor latência (comunicação via loopback), mais simples de configurar. Gasto: memória por pod. Gateway: Collector centralizado. Permite tail sampling stateful (um Collector vê todos os spans de um trace), menos instâncias para operar. SPOF se não replicado. Híbrido (mais comum em produção): sidecar faz coleta local e batching, gateway central faz tail sampling com consistent hashing por trace_id. O sidecar usa loadbalancingexporter para rotear para o gateway certo.",
        level: "senior",
      },
      {
        q: "O que é o OTLP e quais as diferenças entre gRPC e HTTP?",
        a: "OTLP (OpenTelemetry Protocol): protocolo binário (protobuf) para transmissão de telemetria. Substituiu formatos proprietários (Jaeger Thrift, Zipkin JSON). gRPC (porta 4317): streaming bidirecional, compressão nativa, multiplexação de conexões — melhor para alta frequência de spans. HTTP/1.1 (porta 4318): mais compatível com proxies, firewalls e service meshes que não entendem gRPC. Mais fácil de debugar com curl. Ambos suportam compressão gzip. Escolha: gRPC em ambientes internos, HTTP quando há proxy/API gateway na frente.",
        level: "pleno",
      },
    ],
    resources: [
      { title: "OpenTelemetry docs", url: "https://opentelemetry.io/docs/", kind: "docs" },
      { title: "OTel Collector docs", url: "https://opentelemetry.io/docs/collector/", kind: "docs" },
      { title: "W3C TraceContext spec", url: "https://www.w3.org/TR/trace-context/", kind: "docs" },
      { title: "Honeycomb — OTel guide", url: "https://docs.honeycomb.io/send-data/opentelemetry/", kind: "docs" },
      { title: "OTel demo app (microserviços completos)", url: "https://opentelemetry.io/docs/demo/", kind: "pratica" },
      { title: "Grafana — LGTM stack tutorial", url: "https://grafana.com/docs/grafana/latest/getting-started/", kind: "docs" },
      { title: "Charity Majors — Observability Engineering (livro)", url: "https://www.oreilly.com/library/view/observability-engineering/9781492076438/", kind: "livro" },
    ],
  },

  "prometheus": {
    tagline: "Monitoramento de séries temporais com pull model, PromQL e alertas — padrão cloud-native.",
    why: "Prometheus é o padrão de monitoramento em Kubernetes e cloud-native. PromQL, scraping model e alerting com Alertmanager são esperados em qualquer vaga sênior backend/DevOps. Entender os quatro tipos de métrica, alta cardinalidade e SLO-based alerting com multi-window burn rate é o que separa quem usa de quem sabe operar em produção.",
    prerequisite: "Entender o conceito de série temporal e métricas básicas. Familiaridade com Kubernetes e YAML ajuda para configurar scraping e PrometheusRules. Conhecer o conceito de percentil (p50, p99) é essencial para entender Histogram.",
    summary: "Prometheus é um sistema de monitoramento open source (CNCF) que coleta métricas via pull (scraping de endpoints /metrics). Armazena em TSDB local com compressão eficiente. PromQL é a linguagem funcional para consultas de séries temporais. Alertmanager faz routing, deduplicação e silencing de alertas.\n\nO modelo de dados é simples mas poderoso: cada série temporal é identificada por um nome de métrica e um conjunto de labels (chave=valor). Ex: http_requests_total{method='GET', status='200', service='api'}. Labels são dimensões de filtragem e agregação. Alta cardinalidade (muitos valores únicos) é o maior problema operacional.\n\nPromQL tem funções críticas: rate() para calcular taxa de counters, histogram_quantile() para percentis de latência, sum/avg/max by() para agregação, absent() para alertar em ausência de dados. Recording rules pré-computam queries caras.\n\nEm produção, Prometheus local não é suficiente para long-term storage. Thanos, Cortex ou Grafana Mimir estendem com multi-cluster, deduplicação e retenção longa.",
    howToStudy: "<strong>Tem 30 minutos?</strong> Leia os quatro tipos de métrica (diagrama 1), o mnemônico CHiGS e as Q&As de nível pleno. Saiba explicar por que Counter precisa de rate(), por que Summary não agrega e o que é alta cardinalidade.<br><br><strong>Tem um fim de semana?</strong> Percorra todos os keypoints com o Prometheus local (docker-compose), exponha um endpoint /metrics em Node.js, escreva queries PromQL para rate, histogram_quantile e absent. Configure uma PrometheusRule simples.<br><br><strong>Tem uma semana?</strong> Implemente SLO-based alerting com multi-window burn rate, configure recording rules para um dashboard, e integre Alertmanager com roteamento por severity.",
    diagrams: [
      {
        title: "Os quatro tipos de métrica — comportamento, gráfico e PromQL correto",
        html: `<style>
.pm1-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.pm1-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(230,82,44,.4);display:inline}
.pm1-tip:hover .pm1-tb{display:block}
.pm1-tb{display:none;position:absolute;bottom:calc(100%+8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:230px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.8)}
.pm1-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.pm1-card{background:#1e293b;border-radius:10px;padding:14px;border:1.5px solid #334155;flex:1;min-width:150px}
.pm1-type{font-size:12px;font-weight:700;letter-spacing:.04em;margin-bottom:2px}
.pm1-subtitle{font-size:9px;color:#64748b;margin-bottom:8px;letter-spacing:.06em;text-transform:uppercase}
.pm1-chart{height:48px;margin:8px 0;background:#0f172a;border-radius:6px;overflow:hidden;display:flex;align-items:flex-end}
.pm1-badge{font-size:9px;padding:2px 8px;border-radius:20px;font-weight:600;display:inline-block;margin-top:8px}
.pm1-pql{font-family:'JetBrains Mono',monospace;font-size:10px;background:#0f172a;border-radius:5px;padding:6px 8px;margin-top:6px;color:#64748b;line-height:1.6}
</style>
<div class="pm1-wrap">
  <p style="font-size:12px;font-weight:600;margin:0 0 4px;color:#E6522C">Os quatro tipos de métrica — comportamento e PromQL correto</p>
  <p style="font-size:10px;color:#475569;margin:0 0 18px">Passe o mouse nos <span style="border-bottom:1px dashed rgba(230,82,44,.4)">termos sublinhados</span>. Escolha errada de tipo = análise incorreta.</p>

  <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px">

    <!-- Counter -->
    <div class="pm1-card" style="border-color:rgba(230,82,44,.45)">
      <div class="pm1-type" style="color:#E6522C">Counter</div>
      <div class="pm1-subtitle">só cresce — monotônico</div>
      <div class="pm1-chart">
        <svg viewBox="0 0 100 48" preserveAspectRatio="none" width="100%" height="100%">
          <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#E6522C" stop-opacity=".3"/><stop offset="100%" stop-color="#E6522C" stop-opacity="0"/></linearGradient></defs>
          <polygon points="0,46 12,42 22,38 30,30 40,22 50,16 60,11 70,6 80,3 90,1 100,0 100,48 0,48" fill="url(#cg)"/>
          <polyline points="0,46 12,42 22,38 30,30 40,22 50,16 60,11 70,6 80,3 90,1 100,0" stroke="#E6522C" stroke-width="2" fill="none"/>
          <!-- Reset spike -->
          <polyline points="60,11 65,46 70,6" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,2" fill="none"/>
          <text x="61" y="44" font-size="6" fill="#ef4444" font-family="monospace">reset</text>
        </svg>
      </div>
      <div style="font-size:10px;color:#64748b;line-height:1.6">
        <span class="pm1-tip">Reseta<span class="pm1-tb">Quando o processo reinicia, o counter volta a 0. O Prometheus detecta o reset e rate() compensa automaticamente — você não vê o "buraco" no gráfico de taxa.</span></span> quando processo reinicia. <span class="pm1-tip">Nunca diminui<span class="pm1-tb">Se um valor diminui em runtime (ex: um "counter" de sessões ativas), você precisa de um Gauge, não Counter. Counter com decremento é modelagem incorreta.</span></span> em runtime.
      </div>
      <div class="pm1-pql">
        <span style="color:#E6522C">rate</span>(requests_total[5m])<br>
        <span style="color:#E6522C">increase</span>(errors_total[1h])<br>
        <span style="color:#64748b">// NUNCA: sum() direto</span>
      </div>
      <div class="pm1-badge" style="background:rgba(230,82,44,.15);color:#E6522C">http_requests_total, errors_total, bytes_sent_total</div>
    </div>

    <!-- Gauge -->
    <div class="pm1-card" style="border-color:rgba(96,165,250,.45)">
      <div class="pm1-type" style="color:#60a5fa">Gauge</div>
      <div class="pm1-subtitle">sobe e desce — estado atual</div>
      <div class="pm1-chart">
        <svg viewBox="0 0 100 48" preserveAspectRatio="none" width="100%" height="100%">
          <defs><linearGradient id="gg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#60a5fa" stop-opacity=".2"/><stop offset="100%" stop-color="#60a5fa" stop-opacity="0"/></linearGradient></defs>
          <polygon points="0,24 12,14 22,30 32,18 42,34 52,12 62,28 72,10 82,26 92,20 100,22 100,48 0,48" fill="url(#gg)"/>
          <polyline points="0,24 12,14 22,30 32,18 42,34 52,12 62,28 72,10 82,26 92,20 100,22" stroke="#60a5fa" stroke-width="2" fill="none"/>
        </svg>
      </div>
      <div style="font-size:10px;color:#64748b;line-height:1.6">
        Representa <span class="pm1-tip">estado atual<span class="pm1-tb">Exemplos: conexões abertas agora, memória usada agora, temperatura atual do servidor, tamanho da fila agora. O valor instantâneo é o que importa.</span></span>. Use <span class="pm1-tip">diretamente<span class="pm1-tb">Não use rate() num Gauge — não faz sentido semântico. Use avg_over_time() para suavizar, max_over_time() para pico, ou o valor puro para dashboards em tempo real.</span></span> ou com avg_over_time().
      </div>
      <div class="pm1-pql">
        memory_used_bytes<br>
        <span style="color:#60a5fa">avg_over_time</span>(queue_depth[5m])<br>
        <span style="color:#60a5fa">max_over_time</span>(connections[1h])
      </div>
      <div class="pm1-badge" style="background:rgba(96,165,250,.15);color:#60a5fa">memory_bytes, connections_active, queue_depth</div>
    </div>

    <!-- Histogram -->
    <div class="pm1-card" style="border-color:rgba(192,132,252,.45)">
      <div class="pm1-type" style="color:#c084fc">Histogram</div>
      <div class="pm1-subtitle">buckets cumulativos + sum + count</div>
      <div class="pm1-chart">
        <svg viewBox="0 0 100 48" preserveAspectRatio="none" width="100%" height="100%">
          <rect x="2" y="36" width="13" height="12" fill="#c084fc" rx="1" opacity=".95"/>
          <rect x="17" y="20" width="13" height="28" fill="#c084fc" rx="1" opacity=".9"/>
          <rect x="32" y="6" width="13" height="42" fill="#c084fc" rx="1" opacity=".9"/>
          <rect x="47" y="18" width="13" height="30" fill="#c084fc" rx="1" opacity=".75"/>
          <rect x="62" y="30" width="13" height="18" fill="#c084fc" rx="1" opacity=".55"/>
          <rect x="77" y="38" width="13" height="10" fill="#c084fc" rx="1" opacity=".35"/>
          <rect x="92" y="43" width="7" height="5" fill="#c084fc" rx="1" opacity=".2"/>
          <text x="2" y="12" font-size="6" fill="#c084fc" font-family="monospace" opacity=".7">le=0.05</text>
          <text x="32" y="4" font-size="6" fill="#c084fc" font-family="monospace" opacity=".9">le=0.1</text>
          <text x="62" y="28" font-size="6" fill="#c084fc" font-family="monospace" opacity=".7">le=0.5</text>
          <text x="77" y="35" font-size="6" fill="#c084fc" font-family="monospace" opacity=".5">le=1</text>
        </svg>
      </div>
      <div style="font-size:10px;color:#64748b;line-height:1.6">
        <span class="pm1-tip">Buckets cumulativos<span class="pm1-tb">le="0.1" significa "requisições que completaram em até 100ms". Cada bucket é cumulativo — le="0.5" inclui tudo que está em le="0.1" também. O bucket le="+Inf" = count total.</span></span>. Use <span class="pm1-tip">histogram_quantile()<span class="pm1-tb">Calcula percentil no servidor, não no cliente. Fundamental: pode agregar histogramas de múltiplas instâncias. summary não permite isso — por isso Histogram é preferível.</span></span> para percentis agregáveis.
      </div>
      <div class="pm1-pql">
        <span style="color:#c084fc">histogram_quantile</span>(0.99,<br>
        &nbsp;&nbsp;<span style="color:#c084fc">sum</span>(<span style="color:#c084fc">rate</span>(duration_bucket[5m]))<br>
        &nbsp;&nbsp;by (le, service))
      </div>
      <div class="pm1-badge" style="background:rgba(192,132,252,.15);color:#c084fc">request_duration_seconds, response_size_bytes</div>
    </div>

    <!-- Summary -->
    <div class="pm1-card" style="border-color:rgba(234,179,8,.35)">
      <div class="pm1-type" style="color:#fbbf24">Summary</div>
      <div class="pm1-subtitle">percentis pré-calculados no cliente</div>
      <div class="pm1-chart" style="display:flex;align-items:center;justify-content:space-around;padding:4px">
        <div style="text-align:center;background:#1e293b;border-radius:6px;padding:6px 10px">
          <div style="font-size:8px;color:#64748b">p50</div>
          <div style="font-size:16px;color:#fbbf24;font-weight:700">43ms</div>
        </div>
        <div style="text-align:center;background:#1e293b;border-radius:6px;padding:6px 10px">
          <div style="font-size:8px;color:#64748b">p95</div>
          <div style="font-size:16px;color:#fbbf24;font-weight:700">390ms</div>
        </div>
        <div style="text-align:center;background:#1e293b;border-radius:6px;padding:6px 10px">
          <div style="font-size:8px;color:#64748b">p99</div>
          <div style="font-size:16px;color:#fbbf24;font-weight:700">820ms</div>
        </div>
      </div>
      <div style="font-size:10px;color:#64748b;line-height:1.6">
        Calculado <span class="pm1-tip">no processo cliente<span class="pm1-tb">O percentil é calculado dentro da aplicação antes de ser exposto no /metrics. Vantagem: sem overhead de query no Prometheus. Desvantagem crítica: não pode ser agregado entre instâncias — p99 do pod A + p99 do pod B != p99 global.</span></span>. <span style="color:#ef4444">Não agrega entre instâncias</span>.
      </div>
      <div class="pm1-pql">
        <span style="color:#64748b">// use diretamente — sem rate()</span><br>
        http_request_duration_seconds{quantile="0.99"}<br>
        <span style="color:#ef4444">// NÃO funciona: sum() de Summary</span>
      </div>
      <div class="pm1-badge" style="background:rgba(234,179,8,.12);color:#fbbf24">prefira Histogram — evite Summary</div>
    </div>
  </div>

  <div style="background:#1e293b;border-radius:8px;padding:12px 16px;border:1px solid rgba(230,82,44,.25)">
    <div style="font-size:9px;color:#E6522C;font-weight:600;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px">Mnemônico: CHiGS — a regra de qual PromQL usar</div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px">
      <div style="background:#0f172a;border-radius:6px;padding:8px;text-align:center">
        <div style="font-size:14px;font-weight:700;color:#E6522C">C</div>
        <div style="font-size:9px;color:#64748b;margin-top:3px">Counter → rate()</div>
      </div>
      <div style="background:#0f172a;border-radius:6px;padding:8px;text-align:center">
        <div style="font-size:14px;font-weight:700;color:#c084fc">Hi</div>
        <div style="font-size:9px;color:#64748b;margin-top:3px">Histogram → quantile()</div>
      </div>
      <div style="background:#0f172a;border-radius:6px;padding:8px;text-align:center">
        <div style="font-size:14px;font-weight:700;color:#60a5fa">G</div>
        <div style="font-size:9px;color:#64748b;margin-top:3px">Gauge → direto</div>
      </div>
      <div style="background:#0f172a;border-radius:6px;padding:8px;text-align:center">
        <div style="font-size:14px;font-weight:700;color:#fbbf24">S</div>
        <div style="font-size:9px;color:#64748b;margin-top:3px">Summary → evitar</div>
      </div>
    </div>
  </div>
</div>`,
        caption: "CHiGS: Counter→rate(), Histogram→histogram_quantile(), Gauge→direto, Summary→evitar. Errar o tipo de métrica produz análises completamente erradas — rate() num Gauge não faz sentido semântico.",
      },
      {
        title: "Alert routing no Alertmanager — grouping, inhibition e silencing",
        html: `<style>
.pm2-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.pm2-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(230,82,44,.4);display:inline}
.pm2-tip:hover .pm2-tb{display:block}
.pm2-tb{display:none;position:absolute;bottom:calc(100%+8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:230px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.8)}
.pm2-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.pm2-box{background:#1e293b;border-radius:10px;padding:12px 14px;border:1.5px solid #334155}
.pm2-node{background:#0f172a;border-radius:8px;padding:8px 12px;border:1px solid #334155;text-align:center;font-size:11px}
.pm2-arr{color:#334155;font-size:14px;display:flex;align-items:center;flex-shrink:0}
@keyframes pm2-alert{0%,100%{background:rgba(239,68,68,.08);border-color:rgba(239,68,68,.3)}50%{background:rgba(239,68,68,.18);border-color:rgba(239,68,68,.6)}}
.pm2-firing{animation:pm2-alert 2s ease-in-out infinite;border-radius:6px;padding:3px 8px;font-size:10px;font-weight:600;color:#ef4444;display:inline-block}
</style>
<div class="pm2-wrap">
  <p style="font-size:12px;font-weight:600;margin:0 0 4px;color:#E6522C">Alert Routing — Prometheus → Alertmanager → Receivers</p>
  <p style="font-size:10px;color:#475569;margin:0 0 18px">Passe o mouse nos termos sublinhados para ver detalhes</p>

  <!-- Fluxo principal -->
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:18px;flex-wrap:wrap">

    <!-- Prometheus -->
    <div class="pm2-box" style="border-color:rgba(230,82,44,.4);min-width:140px;text-align:center">
      <div style="font-size:9px;color:#E6522C;font-weight:600;letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px">Prometheus</div>
      <div style="font-size:11px;color:#e2e8f0;margin-bottom:6px">Avalia PrometheusRules</div>
      <div class="pm2-firing">FIRING: ErrorRateAlto</div>
      <div class="pm2-firing" style="animation-delay:.5s;margin-top:4px">FIRING: MemoryAlta</div>
      <div class="pm2-firing" style="animation-delay:1s;margin-top:4px">FIRING: ServiceDown</div>
    </div>

    <div class="pm2-arr">→</div>

    <!-- Alertmanager -->
    <div class="pm2-box" style="border-color:rgba(245,168,0,.5);min-width:180px">
      <div style="font-size:9px;color:#f5a800;font-weight:600;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px">Alertmanager</div>

      <div style="display:flex;flex-direction:column;gap:6px">
        <div style="background:#0f172a;border-radius:6px;padding:8px 10px;border:1px solid rgba(59,130,246,.3)">
          <div style="font-size:9px;color:#93c5fd;font-weight:600;margin-bottom:4px">
            <span class="pm2-tip">Grouping<span class="pm2-tb">Agrupa alertas do mesmo serviço em uma única notificação. Sem grouping: 10 pods com erro = 10 notificações separadas. Com grouping by [service, alertname]: 1 notificação com resumo.</span></span>
          </div>
          <div style="font-size:10px;color:#64748b;line-height:1.5">group_by: [service, severity]<br>group_wait: 30s → 1 notif/grupo</div>
        </div>

        <div style="background:#0f172a;border-radius:6px;padding:8px 10px;border:1px solid rgba(168,85,247,.3)">
          <div style="font-size:9px;color:#d8b4fe;font-weight:600;margin-bottom:4px">
            <span class="pm2-tip">Inhibition<span class="pm2-tb">Se ServiceDown está firing, inibe ErrorRateAlto e MemoryAlta do mesmo serviço — você já sabe que está down, as outras métricas são consequência. Evita ruído de alertas sintomáticos quando a causa raiz já foi alertada.</span></span>
          </div>
          <div style="font-size:10px;color:#64748b;line-height:1.5">ServiceDown inibe outros alertas<br>do mesmo service=X</div>
        </div>

        <div style="background:#0f172a;border-radius:6px;padding:8px 10px;border:1px solid rgba(34,197,94,.3)">
          <div style="font-size:9px;color:#86efac;font-weight:600;margin-bottom:4px">
            <span class="pm2-tip">Silencing<span class="pm2-tb">Silencia alertas durante janelas planejadas: deployments, manutenção, testes de carga. Criado via UI do Alertmanager ou amtool CLI. Silences têm validade — expiram automaticamente.</span></span>
          </div>
          <div style="font-size:10px;color:#64748b;line-height:1.5">Silence durante deploy<br>matchers: [env="staging"]</div>
        </div>

        <div style="background:#0f172a;border-radius:6px;padding:8px 10px;border:1px solid rgba(245,168,0,.3)">
          <div style="font-size:9px;color:#f5a800;font-weight:600;margin-bottom:4px">
            <span class="pm2-tip">Routing<span class="pm2-tb">Arvore de roteamento: receiver padrão (slack) + rotas específicas por severity (critical → PagerDuty), service (payments → payments-team-slack). Cada rota tem seu receiver e configurações de agrupamento.</span></span>
          </div>
          <div style="font-size:10px;color:#64748b;line-height:1.5">severity=critical → PagerDuty<br>severity=warning → Slack</div>
        </div>
      </div>
    </div>

    <div class="pm2-arr">→</div>

    <!-- Receivers -->
    <div style="display:flex;flex-direction:column;gap:6px;min-width:120px">
      <div style="font-size:9px;color:#E6522C;font-weight:600;letter-spacing:.1em;text-transform:uppercase;margin-bottom:2px">Receivers</div>
      <div class="pm2-node" style="border-color:rgba(239,68,68,.4);color:#ef4444">PagerDuty<br><span style="font-size:9px;color:#64748b">critical — acorda SRE</span></div>
      <div class="pm2-node" style="border-color:rgba(74,222,128,.3);color:#4ade80">Slack<br><span style="font-size:9px;color:#64748b">#alerts-warning</span></div>
      <div class="pm2-node" style="border-color:rgba(147,197,253,.3);color:#93c5fd">OpsGenie<br><span style="font-size:9px;color:#64748b">on-call rotation</span></div>
      <div class="pm2-node" style="border-color:#334155;color:#64748b">Email<br><span style="font-size:9px;color:#475569">info apenas</span></div>
    </div>
  </div>

  <!-- Config exemplo -->
  <div style="background:#1e293b;border-radius:8px;padding:12px 14px;border:1px solid rgba(230,82,44,.2)">
    <div style="font-size:9px;color:#E6522C;font-weight:600;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px">Alertmanager config — routing tree</div>
    <div style="font-family:'JetBrains Mono',monospace;font-size:10px;line-height:1.9;color:#64748b">
      route:<br>
      &nbsp;&nbsp;receiver: <span style="color:#86efac">slack-geral</span><br>
      &nbsp;&nbsp;group_by: [service, alertname]<br>
      &nbsp;&nbsp;group_wait: <span style="color:#fbbf24">30s</span>&nbsp;&nbsp;&nbsp;<span style="color:#475569"># aguarda agrupamento</span><br>
      &nbsp;&nbsp;group_interval: <span style="color:#fbbf24">5m</span>&nbsp;<span style="color:#475569"># novas notif do grupo</span><br>
      &nbsp;&nbsp;repeat_interval: <span style="color:#fbbf24">4h</span>&nbsp;<span style="color:#475569"># re-notifica se ainda firing</span><br>
      &nbsp;&nbsp;routes:<br>
      &nbsp;&nbsp;&nbsp;&nbsp;- matchers: [severity="critical"]<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;receiver: <span style="color:#ef4444">pagerduty</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;continue: false<br>
      inhibit_rules:<br>
      &nbsp;&nbsp;- source_matchers: [alertname="ServiceDown"]<br>
      &nbsp;&nbsp;&nbsp;&nbsp;target_matchers: [severity="warning"]<br>
      &nbsp;&nbsp;&nbsp;&nbsp;equal: [service]
    </div>
  </div>
</div>`,
        caption: "Grouping evita spam de notificações. Inhibition evita alertas consequência quando a causa raiz já está alertada. Silencing gerencia janelas de manutenção. Routing direciona a pessoa certa na hora certa.",
      },
      {
        title: "Recording rules e alerting rules — do PromQL ao PrometheusRule em Kubernetes",
        html: `<style>
.pm3-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.pm3-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(230,82,44,.4);display:inline}
.pm3-tip:hover .pm3-tb{display:block}
.pm3-tb{display:none;position:absolute;bottom:calc(100%+8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:230px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.8)}
.pm3-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.pm3-box{background:#1e293b;border-radius:8px;padding:12px 14px;border:1.5px solid #334155;margin-bottom:10px}
.pm3-code{font-family:'JetBrains Mono',monospace;font-size:10px;line-height:1.9;color:#64748b;background:#0f172a;border-radius:6px;padding:10px 12px;margin-top:8px}
</style>
<div class="pm3-wrap">
  <p style="font-size:12px;font-weight:600;margin:0 0 4px;color:#E6522C">Recording rules + alerting rules + PrometheusRule no Kubernetes</p>
  <p style="font-size:10px;color:#475569;margin:0 0 16px">Passe o mouse nos <span style="border-bottom:1px dashed rgba(230,82,44,.4)">termos sublinhados</span></p>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">

    <!-- Recording Rules -->
    <div>
      <div class="pm3-box" style="border-color:rgba(147,197,253,.4)">
        <div style="font-size:11px;color:#93c5fd;font-weight:700;margin-bottom:4px">
          <span class="pm3-tip">Recording Rules<span class="pm3-tb">Pré-computam expressões PromQL e salvam como nova série temporal. Avaliadas periodicamente (padrão 1 minuto). A nova série tem nome customizado — dashboards e alertas consultam a série pré-computada em vez da query cara.</span></span>
        </div>
        <div style="font-size:10px;color:#64748b;line-height:1.6;margin-bottom:8px">Transformam queries lentas em séries prontas para dashboard instantâneo.</div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
          <div style="background:#0f172a;border-radius:5px;padding:6px 10px;font-size:10px;color:#94a3b8;font-family:monospace;flex:1;text-align:center">query cara<br>(2s de execução)</div>
          <span style="color:#334155;font-size:14px">→</span>
          <div style="background:rgba(147,197,253,.1);border:1px solid rgba(147,197,253,.3);border-radius:5px;padding:6px 10px;font-size:10px;color:#93c5fd;font-family:monospace;flex:1;text-align:center">série pré-computada<br>(instantânea)</div>
        </div>
        <div class="pm3-code">
          <span style="color:#475569">- record:</span> <span style="color:#93c5fd">job:http_errors:rate5m</span><br>
          &nbsp;&nbsp;<span style="color:#475569">expr:</span> <span style="color:#e2e8f0">sum(rate(http_requests_total<br>
          &nbsp;&nbsp;&nbsp;&nbsp;{status=~"5.."}[5m])) by (job)</span><br><br>
          <span style="color:#475569">- record:</span> <span style="color:#93c5fd">job:http_total:rate5m</span><br>
          &nbsp;&nbsp;<span style="color:#475569">expr:</span> <span style="color:#e2e8f0">sum(rate(http_requests_total[5m]))<br>
          &nbsp;&nbsp;&nbsp;&nbsp;by (job)</span><br><br>
          <span style="color:#475569">- record:</span> <span style="color:#93c5fd">job:error_rate:ratio5m</span><br>
          &nbsp;&nbsp;<span style="color:#475569">expr:</span> <span style="color:#e2e8f0">job:http_errors:rate5m<br>
          &nbsp;&nbsp;&nbsp;&nbsp;/ job:http_total:rate5m</span>
        </div>
        <div style="font-size:10px;color:#64748b;margin-top:8px;line-height:1.5">
          Convenção: <span class="pm3-tip">level:metric:operation<span class="pm3-tb">Nomeclatura padrão da comunidade: job:http_requests:rate5m. O "level" (job, service, cluster) indica a granularidade de agregação. "metric" é o nome da métrica original. "operation" é o que foi feito (rate5m, ratio).</span></span>
        </div>
      </div>
    </div>

    <!-- Alerting Rules -->
    <div>
      <div class="pm3-box" style="border-color:rgba(239,68,68,.4)">
        <div style="font-size:11px;color:#ef4444;font-weight:700;margin-bottom:4px">
          <span class="pm3-tip">Alerting Rules<span class="pm3-tb">Definem condições de alerta via PromQL. O Prometheus avalia periodicamente — quando a expressão retorna resultados por mais tempo que "for:", o alerta vai para o Alertmanager.</span></span>
        </div>
        <div style="font-size:10px;color:#64748b;line-height:1.6;margin-bottom:8px">Disparam quando condição persiste por "for:" — evita alertas de spikes momentâneos.</div>
        <div class="pm3-code">
          <span style="color:#475569">- alert:</span> <span style="color:#ef4444">ErrorRateAlto</span><br>
          &nbsp;&nbsp;<span style="color:#475569">expr:</span> <span style="color:#e2e8f0">job:error_rate:ratio5m > 0.01</span><br>
          &nbsp;&nbsp;<span class="pm3-tip" style="color:#fbbf24">for: 5m<span class="pm3-tb">Tempo que a condição precisa ser verdadeira continuamente antes de disparar. Sem "for:", dispara em cada avaliação (geralmente a cada 1m), gerando spam em spikes.</span></span><br>
          &nbsp;&nbsp;<span style="color:#475569">labels:</span><br>
          &nbsp;&nbsp;&nbsp;&nbsp;severity: <span style="color:#ef4444">critical</span><br>
          &nbsp;&nbsp;&nbsp;&nbsp;team: backend<br>
          &nbsp;&nbsp;<span style="color:#475569">annotations:</span><br>
          &nbsp;&nbsp;&nbsp;&nbsp;summary: <span style="color:#86efac">"{{ $labels.job }}: error rate {{ $value | humanizePercentage }}"</span><br>
          &nbsp;&nbsp;&nbsp;&nbsp;runbook_url: <span style="color:#93c5fd">https://runbooks/error-rate</span><br><br>
          <span style="color:#475569">- alert:</span> <span style="color:#fbbf24">ServicoSumiu</span><br>
          &nbsp;&nbsp;<span style="color:#475569">expr:</span> <span class="pm3-tip" style="color:#e2e8f0">absent(up{job="api"} == 1)<span class="pm3-tb">absent() retorna 1 quando a série não existe. Usa-se para alertar quando um serviço para de existir (sem scrape = série some do TSDB). Mais confiável que up == 0.</span></span><br>
          &nbsp;&nbsp;<span style="color:#fbbf24">for: 2m</span>
        </div>
      </div>
    </div>
  </div>

  <!-- PrometheusRule Kubernetes -->
  <div class="pm3-box" style="border-color:rgba(134,239,172,.35)">
    <div style="font-size:11px;color:#86efac;font-weight:700;margin-bottom:6px">
      <span class="pm3-tip">PrometheusRule — CRD no Kubernetes<span class="pm3-tb">Custom Resource Definition do kube-prometheus-stack (prometheus-operator). O operator monitora PrometheusRules e injeta automaticamente no Prometheus. Sem CRD, você edita configmaps manualmente — muito mais trabalhoso.</span></span>
    </div>
    <div class="pm3-code">
      apiVersion: <span style="color:#86efac">monitoring.coreos.com/v1</span><br>
      kind: <span style="color:#86efac">PrometheusRule</span><br>
      metadata:<br>
      &nbsp;&nbsp;name: api-rules<br>
      &nbsp;&nbsp;namespace: monitoring<br>
      &nbsp;&nbsp;labels: { prometheus: kube-prometheus }  <span style="color:#475569"># selector do prometheus-operator</span><br>
      spec:<br>
      &nbsp;&nbsp;groups:<br>
      &nbsp;&nbsp;- name: api.recording<br>
      &nbsp;&nbsp;&nbsp;&nbsp;interval: <span style="color:#fbbf24">30s</span>  <span style="color:#475569"># avalia a cada 30s (padrão 1m)</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;rules:<br>
      &nbsp;&nbsp;&nbsp;&nbsp;- record: job:error_rate:ratio5m<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;expr: <span style="color:#93c5fd">job:http_errors:rate5m / job:http_total:rate5m</span><br>
      &nbsp;&nbsp;- name: api.alerts<br>
      &nbsp;&nbsp;&nbsp;&nbsp;rules:<br>
      &nbsp;&nbsp;&nbsp;&nbsp;- alert: ErrorRateAlto<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;expr: <span style="color:#93c5fd">job:error_rate:ratio5m > 0.01</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;for: <span style="color:#fbbf24">5m</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;labels: { severity: critical }
    </div>
  </div>
</div>`,
        caption: "Recording rules primeiro, alerting rules sobre elas. O PrometheusRule é o CRD do kube-prometheus-stack — o operator injeta automaticamente sem reiniciar o Prometheus. Sempre inclua runbook_url nas annotations — facilita resposta a incidentes.",
      },
    ],
    cheatsheet: {
      title: "PromQL — cheatsheet essencial",
      html: `<style>
.promcs-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.promcs-sec{margin-bottom:18px}
.promcs-title{font-size:9px;color:#E6522C;font-weight:600;letter-spacing:.12em;text-transform:uppercase;margin-bottom:10px;padding-bottom:5px;border-bottom:1px solid rgba(230,82,44,.2)}
.promcs-code{background:#1e293b;border-radius:8px;padding:12px 14px;font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.9;color:#94a3b8}
.promcs-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.promcs-fn{color:#E6522C;font-weight:600}
.promcs-kw{color:#c084fc}
.promcs-str{color:#86efac}
.promcs-cm{color:#475569}
</style>
<div class="promcs-wrap">
  <p style="font-size:13px;font-weight:700;margin:0 0 18px;color:#E6522C">PromQL — cheatsheet completo</p>

  <div class="promcs-grid">
    <div class="promcs-sec">
      <div class="promcs-title">Funções de rate — counters</div>
      <div class="promcs-code">
        <span class="promcs-cm"># rate: taxa/s, suavizada, corrige resets</span><br>
        <span class="promcs-fn">rate</span>(http_requests_total[<span class="promcs-str">5m</span>])<br><br>
        <span class="promcs-cm"># irate: taxa instantânea (últimos 2 pontos)</span><br>
        <span class="promcs-cm"># mais reativo — bom para alertas de spike</span><br>
        <span class="promcs-fn">irate</span>(http_requests_total[<span class="promcs-str">5m</span>])<br><br>
        <span class="promcs-cm"># increase: total acumulado na janela</span><br>
        <span class="promcs-cm"># corrige resets — use para "erros na última hora"</span><br>
        <span class="promcs-fn">increase</span>(errors_total[<span class="promcs-str">1h</span>])<br><br>
        <span class="promcs-cm"># REGRA: intervalo > 4x scrape_interval</span><br>
        <span class="promcs-cm"># scrape=15s → range mínimo 60s</span>
      </div>
    </div>

    <div class="promcs-sec">
      <div class="promcs-title">Histogram — percentis</div>
      <div class="promcs-code">
        <span class="promcs-cm"># p99 de latência — padrão de mercado</span><br>
        <span class="promcs-fn">histogram_quantile</span>(0.99,<br>
        &nbsp;&nbsp;<span class="promcs-fn">sum</span>(<span class="promcs-fn">rate</span>(<br>
        &nbsp;&nbsp;&nbsp;&nbsp;http_request_duration_seconds_bucket[<span class="promcs-str">5m</span>]<br>
        &nbsp;&nbsp;)) <span class="promcs-kw">by</span> (le, service)<br>
        )<br><br>
        <span class="promcs-cm"># nativa v2 (Prometheus 2.40+, Histograms nativos)</span><br>
        <span class="promcs-fn">histogram_quantile</span>(0.99,<br>
        &nbsp;&nbsp;<span class="promcs-fn">rate</span>(http_request_duration_seconds[<span class="promcs-str">5m</span>])<br>
        )
      </div>
    </div>

    <div class="promcs-sec">
      <div class="promcs-title">Agregação e filtragem</div>
      <div class="promcs-code">
        <span class="promcs-cm"># sum by — agregar por labels</span><br>
        <span class="promcs-fn">sum</span>(<span class="promcs-fn">rate</span>(requests_total[<span class="promcs-str">5m</span>])) <span class="promcs-kw">by</span> (service)<br><br>
        <span class="promcs-cm"># without — agregar exceto algumas labels</span><br>
        <span class="promcs-fn">sum</span>(metric) <span class="promcs-kw">without</span> (instance, pod)<br><br>
        <span class="promcs-cm"># topk/bottomk — top N séries</span><br>
        <span class="promcs-fn">topk</span>(5, <span class="promcs-fn">rate</span>(errors_total[<span class="promcs-str">5m</span>]))<br><br>
        <span class="promcs-cm"># label_replace — renomear label</span><br>
        <span class="promcs-fn">label_replace</span>(metric, <span class="promcs-str">"svc"</span>, <span class="promcs-str">"$1"</span>, <span class="promcs-str">"service"</span>, <span class="promcs-str">"(.*)"</span>)
      </div>
    </div>

    <div class="promcs-sec">
      <div class="promcs-title">Alertas e detecção de ausência</div>
      <div class="promcs-code">
        <span class="promcs-cm"># absent — alerta quando série some</span><br>
        <span class="promcs-fn">absent</span>(up{job=<span class="promcs-str">"api"</span>} == 1)<br><br>
        <span class="promcs-cm"># predict_linear — prever esgotamento</span><br>
        <span class="promcs-cm"># "disco vai acabar em 4h?"</span><br>
        <span class="promcs-fn">predict_linear</span>(node_filesystem_free_bytes[<span class="promcs-str">6h</span>], 4*3600) &lt; 0<br><br>
        <span class="promcs-cm"># changes — quantas vezes o valor mudou</span><br>
        <span class="promcs-fn">changes</span>(config_reloads_total[<span class="promcs-str">1h</span>]) > 3<br><br>
        <span class="promcs-cm"># resets — contador de resets de counter</span><br>
        <span class="promcs-fn">resets</span>(http_requests_total[<span class="promcs-str">30m</span>]) > 0
      </div>
    </div>
  </div>

  <div class="promcs-sec">
    <div class="promcs-title">SLO-based alerting — multi-window burn rate</div>
    <div class="promcs-code">
<span class="promcs-cm"># SLO: 99.9% de requests bem-sucedidos em 30 dias</span>
<span class="promcs-cm"># Error budget: 0.1% = 43.2 min/mês</span>
<span class="promcs-cm"># Burn rate 14 = esgota o budget em ~2 dias</span>

<span class="promcs-cm"># Janela curta (1h) — detecta problemas sérios rápido</span>
<span class="promcs-fn">sum</span>(<span class="promcs-fn">rate</span>(http_requests_total{status=~<span class="promcs-str">"5.."</span>}[<span class="promcs-str">1h</span>]))
/ <span class="promcs-fn">sum</span>(<span class="promcs-fn">rate</span>(http_requests_total[<span class="promcs-str">1h</span>])) > <span class="promcs-str">14</span> * 0.001

<span class="promcs-cm"># Janela longa (6h) — confirma que não é spike momentâneo</span>
<span class="promcs-fn">sum</span>(<span class="promcs-fn">rate</span>(http_requests_total{status=~<span class="promcs-str">"5.."</span>}[<span class="promcs-str">6h</span>]))
/ <span class="promcs-fn">sum</span>(<span class="promcs-fn">rate</span>(http_requests_total[<span class="promcs-str">6h</span>])) > <span class="promcs-str">14</span> * 0.001

<span class="promcs-cm"># Alerta dispara só quando AMBAS as janelas excedem o threshold</span>
<span class="promcs-cm"># Reduz falsos positivos sem atrasar alertas reais</span>
    </div>
  </div>

  <div class="promcs-sec">
    <div class="promcs-title">Exporter customizado em Node.js</div>
    <div class="promcs-code">
<span class="promcs-cm">// npm install prom-client</span>
<span class="promcs-kw">import</span> { Registry, Counter, Histogram, Gauge } <span class="promcs-kw">from</span> <span class="promcs-str">'prom-client'</span>
<span class="promcs-kw">import express</span> <span class="promcs-kw">from</span> <span class="promcs-str">'express'</span>

<span class="promcs-kw">const</span> registry = <span class="promcs-kw">new</span> Registry()

<span class="promcs-kw">const</span> pedidosCriados = <span class="promcs-kw">new</span> Counter({
  name: <span class="promcs-str">'pedidos_criados_total'</span>,
  help: <span class="promcs-str">'Total de pedidos criados'</span>,
  labelNames: [<span class="promcs-str">'status'</span>, <span class="promcs-str">'metodo_pagamento'</span>],
  registers: [registry],
})

<span class="promcs-kw">const</span> latenciaPagamento = <span class="promcs-kw">new</span> Histogram({
  name: <span class="promcs-str">'pagamento_latencia_seconds'</span>,
  help: <span class="promcs-str">'Latência do processamento de pagamento'</span>,
  labelNames: [<span class="promcs-str">'gateway'</span>],
  buckets: [0.05, 0.1, 0.25, 0.5, 1, 2, 5], <span class="promcs-cm">// baseado no SLA</span>
  registers: [registry],
})

<span class="promcs-kw">const</span> filaSize = <span class="promcs-kw">new</span> Gauge({
  name: <span class="promcs-str">'fila_pedidos_tamanho'</span>,
  help: <span class="promcs-str">'Número de pedidos na fila aguardando processamento'</span>,
  registers: [registry],
})

<span class="promcs-cm">// Endpoint /metrics para scraping</span>
app.get(<span class="promcs-str">'/metrics'</span>, <span class="promcs-kw">async</span> (req, res) => {
  res.set(<span class="promcs-str">'Content-Type'</span>, registry.contentType)
  res.send(<span class="promcs-kw">await</span> registry.metrics())
})

<span class="promcs-cm">// Instrumentar o código</span>
<span class="promcs-kw">async function</span> processarPagamento(pedido: Pedido) {
  <span class="promcs-kw">const</span> end = latenciaPagamento.startTimer({ gateway: pedido.gateway })
  <span class="promcs-kw">try</span> {
    <span class="promcs-kw">const</span> res = <span class="promcs-kw">await</span> stripe.charge(pedido)
    pedidosCriados.inc({ status: <span class="promcs-str">'aprovado'</span>, metodo_pagamento: pedido.gateway })
    <span class="promcs-kw">return</span> res
  } <span class="promcs-kw">catch</span> (err) {
    pedidosCriados.inc({ status: <span class="promcs-str">'recusado'</span>, metodo_pagamento: pedido.gateway })
    <span class="promcs-kw">throw</span> err
  } <span class="promcs-kw">finally</span> {
    end() <span class="promcs-cm">// registra a latência no histogram</span>
  }
}
    </div>
  </div>
</div>`,
      caption: "Referência rápida de PromQL: rate vs irate, histogram_quantile, absent, predict_linear, multi-window burn rate e exporter customizado em Node.js.",
    },
    keypoints: [
      {
        title: "Pull model — scraping de endpoints /metrics",
        body: "Prometheus faz scrape de endpoints /metrics dos serviços periodicamente (padrão 15s). Serviços expõem métricas em formato texto Prometheus (OpenMetrics). Vantagem do pull: mais simples de detectar serviço down (scrape falhou = inacessível), sem necessidade do serviço saber onde está o Prometheus. Desvantagem: serviços de curta duração (jobs, lambdas) não têm tempo de ser scrapeados — use Pushgateway para esses casos.",
        code: `# Exemplo de /metrics em formato Prometheus (texto simples)
# HELP http_requests_total Total de requisições HTTP
# TYPE http_requests_total counter
http_requests_total{method="GET",status="200",handler="/api/users"} 1234
http_requests_total{method="POST",status="500",handler="/api/orders"} 7

# HELP http_request_duration_seconds Latência das requisições
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{le="0.1"} 900
http_request_duration_seconds_bucket{le="0.5"} 1100
http_request_duration_seconds_bucket{le="+Inf"} 1234
http_request_duration_seconds_sum 185.3
http_request_duration_seconds_count 1234

# HELP connections_active Conexões TCP ativas
# TYPE connections_active gauge
connections_active 42`,
      },
      {
        title: "Quatro tipos de métrica — CHiGS",
        body: "Counter (C): só cresce, use rate(). Histogram (Hi): distribui em buckets, use histogram_quantile() — é a escolha para latência e tamanho de resposta. Gauge (G): sobe e desce, use diretamente ou avg_over_time(). Summary (S): percentis pré-calculados no cliente, não agrega entre instâncias — evite. Mnemônico: CHiGS.",
      },
      {
        title: "PromQL — funções essenciais",
        body: "rate(counter[5m]): taxa/s suavizada, corrige resets. irate(counter[5m]): taxa instantânea dos últimos 2 pontos — mais reativo, bom para alertas de pico. increase(counter[1h]): total acumulado na janela. histogram_quantile(0.99, sum(rate(bucket[5m])) by (le)): p99 agregado entre instâncias. absent(up == 1): alerta quando série some. predict_linear(gauge[6h], 4*3600) < 0: prevê esgotamento de disco.",
        code: `# Taxa de erros 5xx por serviço
sum(rate(http_requests_total{status=~"5.."}[5m])) by (service)
/ sum(rate(http_requests_total[5m])) by (service)

# p99 de latência (histogram)
histogram_quantile(0.99,
  sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service)
)

# Top 5 serviços com mais erros
topk(5, sum(rate(errors_total[5m])) by (service))

# Disco acaba em 4 horas?
predict_linear(node_filesystem_free_bytes{mountpoint="/"}[6h], 4*3600) < 0

# Serviço desapareceu (sem scrape)
absent(up{job="api-pagamentos"} == 1)`,
      },
      {
        title: "Labels e cardinalidade — o maior perigo",
        body: "Labels são dimensões da métrica: {method='GET', status='200', service='api'}. Cada combinação única de labels cria uma nova série temporal no TSDB. Alta cardinalidade explode memória e CPU. Labels proibidas: user_id, request_id, IP de cliente, session_id, URL completa com path params. Labels ideais: service, method (GET/POST), status_code (200/404/500), environment. Regra: < 1000 valores únicos por label.",
      },
      {
        title: "Alertmanager — routing, grouping e inhibition",
        body: "Recebe alertas do Prometheus, faz deduplicação, grouping (agrupa alertas do mesmo serviço em uma notificação), silencing (manutenção planejada), routing para receivers (PagerDuty para critical, Slack para warning). Inhibition: se ServiceDown dispara, inibe alertas de ErrorRate e Memory do mesmo serviço — você já sabe que está down.",
        code: `# PrometheusRule — alerting rule completa
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
spec:
  groups:
  - name: api.alerts
    rules:
    - alert: ErrorRateAlto
      expr: |
        sum(rate(http_requests_total{status=~"5.."}[5m])) by (service)
        / sum(rate(http_requests_total[5m])) by (service) > 0.01
      for: 5m          # aguarda 5min antes de disparar (evita spikes)
      labels:
        severity: critical
      annotations:
        summary: "{{ $labels.service }}: {{ $value | humanizePercentage }} de erros"
        runbook_url: "https://runbooks/error-rate-alto"`,
      },
      {
        title: "Recording rules — performance e SLIs",
        body: "Pré-computam expressões PromQL e salvam como nova série temporal (avaliadas a cada 1m por padrão). Use quando: 1) Dashboard usa a mesma query cara repetidamente. 2) Alerta sobre query complexa — alerte sobre a recording rule. 3) Calcular SLI (disponibilidade, latência) de counters brutos. Convenção de nomenclatura: level:metric:operation, ex: job:error_rate:ratio5m.",
      },
      {
        title: "SLO-based alerting — multi-window burn rate",
        body: "Multi-window burn rate usa duas janelas de tempo: curta (1h) para detectar problemas sérios rápido, longa (6h) para confirmar que não é spike. Burn rate = taxa real de consumo do error budget / taxa esperada. Burn rate 14 = esgota o budget mensal em 2 dias. Alerta crítico dispara quando ambas as janelas excedem o threshold — reduz falsos positivos sem atrasar alertas reais.",
        code: `# SLO 99.9% → error budget 0.1% → burn rate 14 ≈ budget acaba em 2 dias
# Alerta crítico: burn rate > 14 nas últimas 1h E 6h

- alert: SLOBurnRateCritico
  expr: |
    (
      sum(rate(http_requests_total{status=~"5.."}[1h]))
      / sum(rate(http_requests_total[1h])) > (14 * 0.001)
    ) and (
      sum(rate(http_requests_total{status=~"5.."}[6h]))
      / sum(rate(http_requests_total[6h])) > (14 * 0.001)
    )
  for: 2m
  labels:
    severity: critical
    slo: availability`,
      },
      {
        title: "Service discovery — Kubernetes e além",
        body: "Service discovery descobre targets dinamicamente sem hardcoding de IPs. Em Kubernetes: kubernetes_sd_config (endpoints, pods, nodes, services). Annotation-based: adicione prometheus.io/scrape: 'true' e prometheus.io/port: '8080' no pod para ser scrapeado automaticamente. Outros: EC2, Consul, DNS. relabel_configs transforma metadata do Kubernetes em labels do Prometheus.",
      },
      {
        title: "Long-term storage — Thanos e Grafana Mimir",
        body: "Prometheus local: retenção padrão 15 dias, sem replicação, sem multi-cluster. Para escala: Thanos (sidecar por cluster + object storage S3/GCS, query federado, deduplicação de réplicas), Grafana Mimir (horizontalmente escalável, multi-tenant, compatível com Prometheus API). Abordagem prática: kube-prometheus-stack com Thanos sidecar por cluster, Thanos Query centralizado, retenção longa em object storage barato.",
      },
      {
        title: "Pushgateway — para jobs de curta duração",
        body: "Pull model não funciona para batch jobs, cron jobs ou lambdas — o job termina antes do próximo scrape. Pushgateway recebe métricas por push e as expõe para o Prometheus scrapin. Limitação: métricas ficam no Pushgateway mesmo após o job terminar — precisam ser deletadas manualmente. Use para: batch jobs, CI/CD pipelines, scripts de migração. Não use para serviços de longa duração.",
        code: `# Push de métrica para Pushgateway
# (em Node.js com prom-client)
import { Pushgateway } from 'prom-client'
const gateway = new Pushgateway('http://pushgateway:9091')

// Push com grouping key (identifica o job)
await gateway.push({ jobName: 'batch-cobranca', groupings: { instance: 'job-1' } })

# curl para apagar métricas após o job
curl -X DELETE http://pushgateway:9091/metrics/job/batch-cobranca/instance/job-1`,
      },
      {
        title: "RED e USE — frameworks de métricas para alertas",
        body: "RED (para serviços HTTP): Rate (req/s), Errors (taxa de erro), Duration (latência/percentil). Cobre o que o usuário sente. USE (para recursos de infraestrutura): Utilization (% de uso), Saturation (fila/backlog), Errors. Cobre o que pode causar problema. Estratégia: alertar em RED (sintoma que o usuário sente) e investigar com USE (diagnóstico de causa raiz). Nunca alerte só em CPU/memória sem correlacionar com sintomas.",
        code: `# RED — Rate, Errors, Duration
# Rate: req/s
sum(rate(http_requests_total[5m])) by (service)
# Errors: taxa de erro
sum(rate(http_requests_total{status=~"5.."}[5m])) by (service)
/ sum(rate(http_requests_total[5m])) by (service)
# Duration: p99
histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))

# USE — Utilization, Saturation, Errors
# CPU utilization
1 - avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) by (instance)
# Memory saturation (% usada)
1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes`,
      },
      {
        title: "irate vs rate — quando usar cada um",
        body: "rate(counter[5m]): média da taxa ao longo da janela, suaviza variações — ideal para dashboards e alertas. irate(counter[5m]): taxa dos últimos 2 pontos — mais reativo a picos súbitos, menos estável. Use irate quando: alerta precisa detectar picos instantâneos (ex: spike de 100% de CPU por 15s). Use rate quando: queira ver a tendência estável. Em janelas curtas (< 1m) irate pode ser muito ruidoso.",
      },
      {
        title: "Cardinality explosion — diagnóstico e mitigação",
        body: "Sintomas: Prometheus com alta memória (> 2GB), queries lentas, TSDB crescendo exponencialmente. Diagnóstico: /api/v1/label/__name__/values para contar séries, TSDB status page (/tsdb-status) mostra as 10 métricas com mais séries. Mitigação: remova labels de alta cardinalidade, use relabel_configs para dropar ou agregá-las no scraping, ou configure recording rules para pré-agregar.",
      },
    ],
    mnemonics: [
      {
        label: "CHiGS — tipos de métrica e PromQL",
        trick: "Counter → rate(), Histogram → quantile(), Gauge → direto, Summary → evitar",
        explanation: "Cada tipo tem uma função PromQL natural. Counter acumula → rate() dá a taxa. Histogram distribui → histogram_quantile() dá percentil. Gauge é estado atual → use direto. Summary já calculou → leia diretamente, mas não tente agregar.",
      },
      {
        label: "RED e USE — o que monitorar",
        trick: "RED para serviços (Rate, Errors, Duration). USE para recursos (Utilization, Saturation, Errors).",
        explanation: "Alerte em RED — são sintomas que o usuário sente. Investigue com USE — são causas de infraestrutura. Nunca alerte só em CPU sem correlacionar com latência ou taxa de erro.",
      },
      {
        label: "Multi-window: curta AND longa",
        trick: "Janela curta detecta, janela longa confirma. Alerta só quando AMBAS excedem o threshold.",
        explanation: "Uma janela de 1h dispara rápido mas pode ser spike. Uma janela de 6h confirma que é tendência. Exigir ambas reduz falsos positivos sem atrasar alertas reais.",
      },
    ],
    gotchas: [
      "Labels com alta cardinalidade (user_id, request_id, IP, URL completa) — cada valor único é uma nova série no TSDB. 1 milhão de usuários = 1 milhão de séries. O Prometheus degrada exponencialmente — queries ficam lentas e a memória explode.",
      "Histogram com buckets errados para o SLA — se o SLA é 500ms mas o bucket máximo é 0.25, o p99 é extrapolado incorretamente. Sempre inclua um bucket um pouco acima do threshold de SLA (ex: SLA 500ms → bucket 0.5, 1.0).",
      "rate() com janela menor que 4x o scrape_interval — com scrape de 15s, o mínimo é 60s. Janela menor resulta em taxa calculada sobre apenas 1-2 pontos, produzindo NaN ou valores instáveis.",
      "Summary em vez de Histogram para latência com múltiplas instâncias — Summary calcula percentil no cliente. Você não consegue fazer sum() dos p99s de 5 pods e obter o p99 global. Use Histogram sempre.",
      "Alerta sem cláusula for — sem for: 5m, o alerta dispara na primeira avaliação (1 minuto) em qualquer spike momentâneo. Alert fatigue em menos de uma semana. Sempre use for: de 2m a 10m dependendo da urgência.",
      "Counter decrementando — se o valor de uma métrica pode diminuir em runtime, é um Gauge, não Counter. Um Counter com decremento faz rate() produzir valores negativos e erros de análise.",
      "Prometheus local para long-term storage — retenção padrão de 15 dias. Dados históricos para análise de capacidade, post-mortems e tendências de longo prazo exigem Thanos ou Grafana Mimir.",
      "Alert fatigue por alertes em causas (CPU, memória) em vez de sintomas (error rate, latência) — CPU a 90% pode não afetar o usuário em nada. Alerte em error rate e p99 de latência — o que o usuário sente — e use CPU/memória para diagnóstico.",
    ],
    interview: [
      {
        q: "Como você calcularia o p99 de latência com Prometheus?",
        a: "Instrumentar com Histogram (não Summary — Summary não permite agregação entre instâncias). Definir buckets baseados no SLA: se o SLA é 500ms, inclua buckets [0.05, 0.1, 0.25, 0.5, 1, 2.5, 5] segundos — o bucket imediatamente acima do SLA precisa estar presente para capturar violações sem extrapolação. A query: histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service)). O by (le) é obrigatório — sem ele a query retorna erro. O by (service) permite ver o p99 por serviço.",
        tip: "Mencionar os buckets e o motivo do 'le' no by() diferencia quem usou de quem só sabe a teoria.",
        level: "pleno",
      },
      {
        q: "Qual a diferença entre Counter e Gauge? Dê exemplos concretos.",
        a: "Counter: valor monotonicamente crescente, nunca diminui em runtime (exceto reset de processo). Use rate() para análise. Exemplos: http_requests_total, errors_total, bytes_sent_total, pagamentos_processados_total. Gauge: representa estado atual, pode subir e descer. Use diretamente ou com avg_over_time(). Exemplos: connections_active, memory_used_bytes, queue_depth, cpu_temperature, goroutines_active. Erro comum: usar Gauge para o que deveria ser Counter (ex: 'taxa de pedidos por minuto' armazenada como Gauge em vez de pedidos_total Counter) — perde a capacidade de calcular taxa histórica com rate().",
        tip: "Dar exemplos de negócio (pedidos, pagamentos) em vez de só exemplos técnicos (requests, bytes) mostra que você pensa como engenheiro de produto.",
        level: "pleno",
      },
      {
        q: "O que é alta cardinalidade e por que destrói o Prometheus?",
        a: "Cardinalidade = número de séries temporais únicas = produto de valores únicos de todas as labels de uma métrica. Exemplo: 100 services × 10 methods × 50 status codes = 50.000 séries para uma métrica. Labels problemáticas: user_id (10M usuários = 10M séries por métrica), request_id (infinito), IP de cliente, URL completa com query params variáveis. O TSDB do Prometheus mantém cada série em memória (head chunks) e em disco — alta cardinalidade explode memória, CPU de ingestion e tempo de query. Regra prática: nunca mais que ~1000 valores únicos por label.",
        tip: "Quantificar o produto das cardinalidades (100 × 10 × 50 = 50.000) impressiona mais que dizer abstratamente 'evite alta cardinalidade'.",
        level: "senior",
      },
      {
        q: "Explique o mnemônico CHiGS e como ele guia a escolha de PromQL.",
        a: "CHiGS = Counter→rate(), Histogram→histogram_quantile(), Gauge→direto, Summary→evitar. Counter é cumulativo e só cresce — rate() converte o acumulado em taxa por segundo e corrige resets automáticos. Histogram distribui valores em buckets — histogram_quantile() calcula percentis no servidor, permitindo agregar instâncias. Gauge representa estado atual — use direto (ou avg_over_time para suavizar). Summary já calculou percentis no cliente — use diretamente, mas nunca tente sum() de percentis entre instâncias (matematicamente inválido).",
        level: "pleno",
      },
      {
        q: "O que é multi-window burn rate e por que é superior a um threshold simples?",
        a: "Threshold simples (ex: error rate > 1% em 5m) tem dois problemas: muito sensível a spikes curtos (falso positivo) ou muito lento para detectar degradação gradual (false negative). Multi-window burn rate resolve com duas janelas: curta (1h) detecta problemas sérios rápido, longa (6h) confirma que não é spike. Burn rate: taxa real / taxa esperada. Burn rate 14 com SLO 99.9% = budget mensal esgota em ~2 dias. Alerta crítico dispara apenas quando AMBAS as janelas excedem o threshold — reduz falsos positivos sem atrasar alertas reais.",
        tip: "Calcular 'budget esgota em X dias' com o número concreto (burn rate 14 = 2 dias para SLO 99.9%) impressiona em entrevistas de SRE.",
        level: "senior",
      },
      {
        q: "Como você escalaria Prometheus para múltiplos clusters Kubernetes?",
        a: "Prometheus local não escala para multi-cluster — sem replicação, sem query federada, retenção limitada. Opções: Thanos — sidecar por cluster envia blocos para object storage (S3/GCS), Thanos Query agrega e deduplica. Grafana Mimir — compatível com Prometheus remote_write API, horizontalmente escalável, multi-tenant, desenvolvido pela Grafana Labs. Abordagem prática com Thanos: kube-prometheus-stack em cada cluster com Thanos sidecar habilitado, Thanos Query centralizado fora dos clusters, Thanos Store Gateway para acesso a dados históricos no object storage.",
        level: "senior",
      },
      {
        q: "O que são recording rules e qual a convenção de nomenclatura correta?",
        a: "Recording rules pré-computam expressões PromQL e salvam o resultado como nova série temporal, avaliadas periodicamente (padrão 1m). Use para: dashboards que repetem a mesma query cara (recording rule torna instantânea), SLIs derivados de counters (sli:http_availability:ratio30d), alertas sobre queries complexas (mais eficiente). Convenção da comunidade: level:metric:operation — ex: job:http_requests:rate5m (agregado por job, métrica http_requests, janela 5m), service:error_rate:ratio5m. O nível indica a granularidade de agregação: cluster > service > job > instance.",
        tip: "Mencionar a convenção de nomenclatura e explicar o que cada parte significa mostra que você conhece práticas de operação profissional.",
        level: "pleno",
      },
      {
        q: "Como você estruturaria alertas para evitar alert fatigue?",
        a: "1. Use for: de 2m a 10m — spikes momentâneos não disparam. 2. Alerte sobre sintomas (error rate, latência), não causas (CPU 90%) — CPU alta pode não afetar o usuário. 3. Multi-window burn rate para SLOs — reduz falsos positivos. 4. Grouping no Alertmanager: 10 pods com erro = 1 notificação, não 10. 5. Inhibition: se ServiceDown dispara, inibe alertas de ErrorRate do mesmo serviço. 6. severity=page (PagerDuty) apenas para violações de SLO reais. 7. Dead man's switch: alerta que dispara se o Prometheus sumir. 8. Revisão mensal de alertas silenciados — se silenciado > 30 dias, o alerta não tem valor.",
        level: "senior",
      },
      {
        q: "Qual a diferença entre irate() e rate()? Quando usar cada um?",
        a: "rate(counter[5m]): média da taxa ao longo da janela inteira, suaviza variações. Requer intervalo > 4x o scrape_interval (scrape 15s → mínimo 60s). Ideal para dashboards e maioria dos alertas. irate(counter[5m]): taxa calculada a partir apenas dos últimos 2 pontos da janela — muito mais reativo a mudanças súbitas. Use irate para: alertas de spike instantâneo (ex: erro sudden de 100% por 30s), debugging de comportamento momentâneo. Evite irate em dashboards de tendência — muito ruidoso. A janela em irate serve só para encontrar os pontos (lookback), não para média.",
        level: "senior",
      },
      {
        q: "O que é o Pushgateway e quando você o usaria?",
        a: "Pushgateway é um intermediário que recebe métricas por push e as expõe para o Prometheus scrapar. Criado para: batch jobs, cron jobs e funções que terminam antes do próximo scrape do Prometheus. Como funciona: o job envia métricas (POST /metrics/job/nome) ao terminar, o Prometheus faz scrape do Pushgateway normalmente. Cuidado: métricas persistem no Pushgateway mesmo após o job terminar — precisam ser deletadas manualmente (DELETE /metrics/job/nome). Não use para serviços de longa duração — use o scraping normal. Para múltiplos pods/workers, use grouping keys (job + instance) para evitar conflito.",
        tip: "Mencionar que métricas 'ficam' no Pushgateway após o job terminar é o gotcha mais importante — mostra experiência operacional.",
        level: "pleno",
      },
      {
        q: "Como você diagnosticaria uma 'cardinality explosion' em produção?",
        a: "Sintomas: Prometheus com alta memória (> 2-4GB para poucas séries), queries lentas, TSDB crescendo > 1GB/dia. Diagnóstico: 1) Prometheus /tsdb-status → mostra top 10 métricas com mais séries. 2) /api/v1/label/nome_label/values → conta valores únicos de uma label específica. 3) Grafana: painel de series cardinality. Mitigação: relabel_configs no scraping para dropar labels problemáticas antes de salvar (drop action). Recording rules para pré-agregar e eliminar dimensões de alta cardinalidade. Se for uma label adicionada recentemente por deploy: rollback ou remove a label urgente.",
        level: "senior",
      },
      {
        q: "Como os frameworks RED e USE se complementam para alertas?",
        a: "RED (para serviços HTTP/gRPC): Rate (req/s), Errors (taxa de 5xx), Duration (latência p99). Cobre o que o usuário sente diretamente. USE (para recursos de infraestrutura): Utilization (% de uso de CPU, disco), Saturation (fila de tarefas, run queue), Errors (erros de hardware, I/O). Cobre o que pode causar degradação. Estratégia: alerte APENAS em RED — são sintomas. Investigue a causa raiz com USE — CPU, memória, I/O. Nunca acorde alguém às 3h por CPU 90% sem evidência de impacto no usuário (latência alta ou error rate).",
        level: "pleno",
      },
      {
        q: "Como funcionam as inhibition rules do Alertmanager?",
        a: "Inhibition rules evitam alertas secundários (sintomas) quando a causa raiz já está alertada. Exemplo: se ServiceDown está firing para service='pagamentos', inibe ErrorRateAlto e LatenciaAlta do mesmo serviço — você já sabe que está down, as outras métricas são consequência óbvia. Configuração: source_matchers (a causa raiz), target_matchers (os alertas a suprimir), equal (labels que devem coincidir, ex: service). Sem inhibition: um cluster down gera 50 alertas simultâneos — com inhibition: 1 alerta de ServiceDown + silêncio nos demais.",
        tip: "Dar o exemplo concreto (cluster down = 50 alertas → 1 com inhibition) torna a explicação muito mais concreta.",
        level: "senior",
      },
      {
        q: "Por que Summary não pode ser agregado entre instâncias?",
        a: "Summary calcula percentis dentro do processo cliente antes de expor no /metrics. O p99 de uma instância é calculado independentemente das outras. Matematicamente, você não pode combinar percentis pré-calculados: p99(A) + p99(B) / 2 ≠ p99(A+B). Para calcular o p99 global de 5 pods com Summary, você precisaria do dado bruto de todas as requisições — que já foi descartado após o cálculo do percentil. Histogram resolve isso: os buckets são contadores acumulativos que podem ser somados entre instâncias, e então histogram_quantile() calcula o percentil correto sobre o conjunto agregado.",
        level: "senior",
      },
      {
        q: "Como você configuraria alertas para os quatro sinais de ouro (Four Golden Signals)?",
        a: "Four Golden Signals do Google SRE: 1) Latência: histogram_quantile(0.99, ...) > SLA — alertar em p99 acima do SLO. 2) Tráfego: sum(rate(requests_total[5m])) — baseline, não alertar diretamente (queda pode ser alerta). 3) Erros: sum(rate(errors[5m]))/sum(rate(requests[5m])) > 0.01 — alerta crítico em taxa de erro acima do error budget. 4) Saturação: utilização de CPU, memória, disco, filas — alertar em saturação alta com predict_linear para antecipar esgotamento. Os quatro juntos cobrem praticamente todos os problemas que afetam usuários.",
        level: "senior",
      },
    ],
    resources: [
      { title: "Prometheus docs", url: "https://prometheus.io/docs/", kind: "docs" },
      { title: "PromQL cheat sheet — ProMLabs", url: "https://promlabs.com/promql-cheat-sheet/", kind: "docs" },
      { title: "Robust Perception — Prometheus blog", url: "https://www.robustperception.io/blog", kind: "artigo" },
      { title: "Thanos docs", url: "https://thanos.io/tip/thanos/getting-started.md/", kind: "docs" },
      { title: "Google SRE Book — Monitoring", url: "https://sre.google/sre-book/monitoring-distributed-systems/", kind: "livro" },
      { title: "Grafana Mimir docs", url: "https://grafana.com/docs/mimir/latest/", kind: "docs" },
      { title: "prom-client (Node.js)", url: "https://github.com/siimon/prom-client", kind: "docs" },
    ],
  },

  "grafana": {
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
    ],
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
  },

  "slis-slos-slas": {
    tagline: "Framework de confiabilidade: definir o que medir, a meta e o compromisso com o cliente.",
    why: "SLI/SLO/SLA é a linguagem de engenharia de confiabilidade e a base do Google SRE. Sênior precisa saber definir SLOs bons, calcular error budget, implementar multi-window alerting e tomar decisão de feature freeze com base em dados — não em intuição.",
    prerequisite: "Entender métricas básicas de sistema (error rate, latência, disponibilidade) e ter familiaridade com Prometheus ou similar. O Google SRE Book é a fonte primária.",
    summary: "SLI (Service Level Indicator) é a métrica que mede confiabilidade: proporção de bons eventos sobre total. Ex: (requisições com status < 500) / (total de requisições). SLO (Service Level Objective) é a meta interna para o SLI — ex: 99,9% das requisições com sucesso em janela de 30 dias. SLA (Service Level Agreement) é o contrato externo com penalidades.\n\nError budget = 100% - SLO target. Com SLO de 99,9%, o budget mensal é 0,1% de 30 dias ≈ 43 minutos de downtime. O budget é o recurso que o time consome fazendo deploys, experimentos e manutenção. Quando o budget acaba, features param — é a política que transforma SRE de 'polícia de operações' em 'parceiro de negócio'.\n\nMulti-window alerting resolve o problema de alertas muito sensíveis (1 spike → alerta falso) ou muito lentos (degradação lenta passa despercebida). Duas janelas — curta (1h) e longa (6h) — combinadas com burn rate eliminam os dois extremos.\n\nBurn rate = quantas vezes mais rápido o budget está sendo consumido do que o esperado. Burn rate 1 = consumindo exatamente na velocidade do SLO. Burn rate 14 = você vai esgotar o budget mensal em 2 dias.",
    keypoints: [
      {
        title: "SLI — o que medir",
        body: "Métrica quantitativa de confiabilidade. Sempre uma proporção: bons eventos / total de eventos. Exemplos: (requests 2xx ou 3xx) / total requests, (requests < 200ms) / total, (uptime em minutos) / total minutos. SLIs ruins: CPU usage, memory usage (métricas de recurso, não de experiência do usuário). SLI deve refletir o que o usuário sente.",
        code: `# SLI de disponibilidade — PromQL
sum(rate(http_requests_total{status!~"5.."}[30d]))
/
sum(rate(http_requests_total[30d]))

# SLI de latência — proporção de requests rápidas
sum(rate(http_request_duration_seconds_bucket{le="0.5"}[30d]))
/
sum(rate(http_request_duration_seconds_count[30d]))`,
      },
      {
        title: "SLO — a meta interna",
        body: "Meta para o SLI em janela de tempo. Ex: 99,9% de requests com sucesso nos últimos 30 dias. Mais apertado = menos error budget = menos espaço para mudanças. Recomendação: comece conservador (99,5%), meça o real histórico, aperte gradualmente. SLO deve ser mais rigoroso que o SLA (margem de segurança).",
      },
      {
        title: "Error Budget — recurso para inovação",
        body: "100% - SLO target. Com SLO de 99,9% em 30 dias = ~43 minutos de downtime tolerados. Budget é consumido por: incidentes, deploys com problema, manutenção. Budget restante = licença para velocity: deploys arriscados, experimentos, refatoração. Budget zerado = feature freeze + sprint de reliability.",
        code: `# Error budget restante — PromQL
# Budget total no mês: 30d × 0.001 = 43.2 minutos = 2592 segundos
# Budget consumido:
(1 - sli:availability:ratio_30d) * 30 * 24 * 60 * 60
# Budget restante em %:
(slo:target - (1 - sli:availability:ratio_30d)) / (1 - slo:target) * 100`,
      },
      {
        title: "SLA — o compromisso externo",
        body: "Contrato legal com cliente, com penalidades por violação (créditos, reembolso). Sempre mais frouxo que o SLO interno (margem de segurança). Você só assina SLA de 99,9% se seu SLO interno é 99,95% ou mais. Violação de SLA = processo legal + reputação — muito diferente de violação de SLO.",
      },
      {
        title: "Multi-window alerting e burn rate",
        body: "Alerta em janela curta (1h) E janela longa (6h ou 1d) com burn rate threshold. Burn rate = taxa de consumo / taxa esperada. Burn rate 14 em 1h E burn rate 14 em 6h → alerta crítico (page). Burn rate 6 em 6h E burn rate 6 em 3d → alerta warning (ticket). Elimina falsos positivos de spikes e detecta degradação lenta.",
        code: `# Multi-window burn rate — alerta crítico
# Consome o budget mensal em 2 dias (burn rate 14)
expr: |
  (
    job:sli_errors:rate1h > (14 * (1 - 0.999))
  ) and (
    job:sli_errors:rate6h > (14 * (1 - 0.999))
  )
for: 2m
labels:
  severity: critical  # page`,
      },
      {
        title: "Error budget policy",
        body: "Política formal que define ações quando o budget atinge thresholds: budget 50% consumido → revisão de práticas de deploy. Budget 90% consumido → feature freeze, foco em reliability. Budget esgotado → sprint de reliability obrigatório, revisão de SLO se impossível de manter. Sem policy, SLO vira métrica de vaidade sem ação.",
      },
    ],
    diagrams: [
      {
        title: "SLI → SLO → Error Budget → Decisão",
        html: `<style>
.slo-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.slo-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(79,134,198,.4);display:inline}
.slo-tip:hover .slo-tb{display:block}
.slo-tb{display:none;position:absolute;bottom:calc(100%+8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:220px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.8)}
.slo-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.slo-card{background:#1e293b;border-radius:10px;padding:14px;border:1.5px solid #334155}
.slo-acr{font-size:22px;font-weight:900;margin-bottom:4px}
.slo-name{font-size:11px;font-weight:700;margin-bottom:6px}
.slo-desc{font-size:10px;color:#64748b;line-height:1.5}

.slo-budget-bar{height:20px;border-radius:10px;background:#1e293b;overflow:hidden;position:relative;margin:8px 0}
.slo-budget-fill{height:100%;border-radius:10px;transition:width .5s ease}

@keyframes slo-blink{0%,100%{opacity:.6}50%{opacity:1}}
.slo-alert{animation:slo-blink 1.2s ease-in-out infinite}
</style>
<div class="slo-wrap">
  <p style="font-size:12px;font-weight:600;margin:0 0 4px;color:#4F86C6">SLI → SLO → Error Budget → Decisão</p>
  <p style="font-size:10px;color:#475569;margin:0 0 18px">Do que medir ao que fazer — o ciclo de confiabilidade</p>

  <!-- Linha SLI → SLO → SLA -->
  <div style="display:flex;gap:8px;margin-bottom:16px;align-items:stretch;flex-wrap:wrap">

    <div class="slo-card" style="border-color:rgba(79,134,198,.4);flex:1;min-width:100px">
      <div class="slo-acr" style="color:#4F86C6">SLI</div>
      <div class="slo-name" style="color:#93c5fd">Indicator</div>
      <div class="slo-desc">
        <span class="slo-tip">O que medir<span class="slo-tb">Proporção de bons eventos: (requests 2xx) / total. Sempre reflete experiência do usuário, não recurso do sistema (não CPU, não memória).</span></span>.
        Proporção: bons / total.
      </div>
      <div style="margin-top:8px;background:#0f172a;border-radius:6px;padding:6px 8px;font-family:'JetBrains Mono',monospace;font-size:10px;color:#93c5fd">0.9986 (98,86%)</div>
    </div>

    <div style="display:flex;align-items:center;color:#334155;font-size:20px;padding:0 2px">→</div>

    <div class="slo-card" style="border-color:rgba(74,222,128,.4);flex:1;min-width:100px">
      <div class="slo-acr" style="color:#4ade80">SLO</div>
      <div class="slo-name" style="color:#86efac">Objective</div>
      <div class="slo-desc">
        <span class="slo-tip">A meta interna<span class="slo-tb">Definida pelo time de engenharia. Mais rigorosa que o SLA — é a linha interna que, se violada, ativa a error budget policy.</span></span>.
        Meta: 99,9% em 30d.
      </div>
      <div style="margin-top:8px;background:#0f172a;border-radius:6px;padding:6px 8px;font-family:'JetBrains Mono',monospace;font-size:10px;color:#86efac">meta: 0.999</div>
    </div>

    <div style="display:flex;align-items:center;color:#334155;font-size:20px;padding:0 2px">→</div>

    <div class="slo-card" style="border-color:rgba(251,191,36,.4);flex:1;min-width:100px">
      <div class="slo-acr" style="color:#fbbf24">SLA</div>
      <div class="slo-name" style="color:#fde68a">Agreement</div>
      <div class="slo-desc">
        <span class="slo-tip">Contrato externo<span class="slo-tb">Com penalidades legais. Sempre mais frouxo que o SLO — a margem entre SLO e SLA é o buffer de segurança antes da violação contratual.</span></span>.
        Com clientes, com penalidades.
      </div>
      <div style="margin-top:8px;background:#0f172a;border-radius:6px;padding:6px 8px;font-family:'JetBrains Mono',monospace;font-size:10px;color:#fde68a">contrato: 99,5%</div>
    </div>
  </div>

  <!-- Error budget visual -->
  <div class="slo-card" style="margin-bottom:14px">
    <div style="font-size:9px;color:#4F86C6;font-weight:600;letter-spacing:.1em;text-transform:uppercase;margin-bottom:10px">Error Budget — recurso para velocidade</div>

    <div style="display:flex;justify-content:space-between;font-size:10px;color:#64748b;margin-bottom:4px">
      <span>Budget total: <span style="color:#94a3b8">~43 min/mês</span> (SLO 99,9%)</span>
      <span id="slo-pct">67% restante</span>
    </div>
    <div class="slo-budget-bar">
      <div class="slo-budget-fill" id="slo-fill" style="width:67%;background:linear-gradient(90deg,#4ade80,#22c55e)"></div>
    </div>

    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">
      <button onclick="(function(){var f=document.getElementById('slo-fill'),p=document.getElementById('slo-pct'),d=document.getElementById('slo-dec');var v=Math.max(0,parseInt(f.style.width)-20);f.style.width=v+'%';f.style.background=v>50?'linear-gradient(90deg,#4ade80,#22c55e)':v>20?'linear-gradient(90deg,#fbbf24,#f59e0b)':'linear-gradient(90deg,#ef4444,#dc2626)';p.textContent=v+'% restante';if(v<=0){d.style.display='flex'}else{d.style.display='none'}})()" style="background:#1e293b;border:1px solid #ef4444;border-radius:6px;color:#f87171;font-size:9px;padding:5px 10px;cursor:pointer;font-family:inherit">🔥 Simular incidente (−20%)</button>
      <button onclick="(function(){var f=document.getElementById('slo-fill'),p=document.getElementById('slo-pct'),d=document.getElementById('slo-dec');f.style.width='67%';f.style.background='linear-gradient(90deg,#4ade80,#22c55e)';p.textContent='67% restante';d.style.display='none'})()" style="background:#1e293b;border:1px solid #334155;border-radius:6px;color:#64748b;font-size:9px;padding:5px 10px;cursor:pointer;font-family:inherit">↺ Reset</button>
    </div>

    <div id="slo-dec" style="display:none;margin-top:10px;background:#1a0a0a;border:1px solid rgba(239,68,68,.4);border-radius:8px;padding:10px 14px;align-items:center;gap:10px">
      <span class="slo-alert" style="font-size:16px">🚨</span>
      <div>
        <div style="font-size:10px;font-weight:600;color:#ef4444">Budget esgotado — feature freeze ativo</div>
        <div style="font-size:10px;color:#64748b;margin-top:3px">Sprint de reliability obrigatório. Nenhum deploy de feature até budget recuperado.</div>
      </div>
    </div>
  </div>

  <!-- Multi-window -->
  <div class="slo-card" style="border-color:rgba(79,134,198,.3)">
    <div style="font-size:9px;color:#4F86C6;font-weight:600;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px">Multi-window burn rate alerting</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
      <div style="background:#0f172a;border-radius:6px;padding:8px;border:1px solid rgba(239,68,68,.3)">
        <div style="font-size:9px;color:#ef4444;font-weight:600;margin-bottom:4px">🔴 CRÍTICO (page)</div>
        <div style="font-size:10px;color:#64748b;line-height:1.5">
          <span class="slo-tip">burn rate &gt; 14×<span class="slo-tb">Consumindo 14x mais rápido que o esperado. Com SLO 99,9%, esgota o budget mensal em 2 dias. Precisa de resposta imediata.</span></span> em 1h<br>
          <span style="color:#475569">E</span> burn rate &gt; 14× em 6h
        </div>
      </div>
      <div style="background:#0f172a;border-radius:6px;padding:8px;border:1px solid rgba(251,191,36,.3)">
        <div style="font-size:9px;color:#fbbf24;font-weight:600;margin-bottom:4px">🟡 WARNING (ticket)</div>
        <div style="font-size:10px;color:#64748b;line-height:1.5">
          <span class="slo-tip">burn rate &gt; 6×<span class="slo-tb">Consumindo 6x mais rápido. Com SLO 99,9%, esgota o budget em ~5 dias. Requer atenção mas não acorda ninguém às 3h.</span></span> em 6h<br>
          <span style="color:#475569">E</span> burn rate &gt; 6× em 3d
        </div>
      </div>
    </div>
  </div>
</div>`,
        caption: "O error budget é o contrato entre o time de produto e o time de SRE: enquanto houver budget, o time tem autonomia para inovar. Quando o budget acaba, confiabilidade vira prioridade absoluta.",
      },
    ],
    gotchas: [
      "SLO de 100% — impossível de manter em sistemas reais. Paralisa inovação e cria cultura de medo de deploys. Todo sistema tem downtime.",
      "SLI que não reflete experiência do usuário — uptime do health check interno não significa que o usuário consegue usar a feature. Meça a jornada real.",
      "Janela de SLO muito curta (1h ou 1d) — muito ruidosa, gera muitos alertas falsos. Janela de 30 dias é o padrão — estável e representativa.",
      "SLA igual ao SLO — sem margem de segurança. Você assina SLA de 99,9% com SLO de 99,9% e qualquer violação de SLO vira violação contratual.",
      "Sem error budget policy formal — SLO vira métrica de vaidade sem ação associada. A política é o que transforma o número em decisão.",
      "Alertas de SLO com janela única — falsos positivos de spikes curtos ou alertas atrasados para degradação lenta. Use multi-window burn rate.",
      "SLI medido do lado do servidor — latência medida no servidor não inclui rede, DNS, TLS. Meça do lado do cliente (synthetic monitoring) para capturar a experiência real.",
    ],
    interview: [
      {
        q: "Qual a diferença entre SLI, SLO e SLA? Dê um exemplo concreto.",
        a: "SLI: a métrica que mede qualidade. Ex: proporção de requisições de checkout concluídas com sucesso (sem status 5xx). SLO: a meta interna para esse SLI. Ex: 99,9% das requisições de checkout com sucesso em 30 dias. SLA: o contrato com o cliente, com penalidades. Ex: garantimos 99,5% de disponibilidade mensal — violação gera crédito de 10% na fatura. A hierarquia: SLO (99,9%) é mais rigoroso que o SLA (99,5%) — a diferença é o buffer. Se o SLO for violado, a equipe já age antes de atingir o SLA.",
        tip: "Dar um exemplo de negócio concreto (checkout, não 'a API') mostra pensamento orientado ao usuário.",
        level: "pleno",
      },
      {
        q: "Como você definiria SLOs para um serviço novo?",
        a: "1. Identifique o que importa para o usuário: completar uma compra, carregar o feed, enviar mensagem. 2. Defina SLIs que medem isso: taxa de sucesso de checkout, p99 de carregamento de feed. 3. Se há histórico: olhe os últimos 30-90 dias e defina SLO levemente abaixo do pior período (não do melhor). 4. Se não há histórico: comece conservador (99,5%) e aperte gradualmente. 5. Defina error budget policy: o que acontece quando o budget acaba? 6. Implemente alertas multi-window com burn rate. 7. Revise trimestralmente com dados reais.",
        tip: "Mencionar revisão trimestral e histórico mostra que você pensa em SLO como processo vivo, não número fixo.",
        level: "pleno",
      },
      {
        q: "O que é multi-window burn rate e por que é melhor que um threshold simples?",
        a: "Threshold simples (ex: error rate > 1% nos últimos 5 minutos) tem dois problemas: muito sensível a spikes curtos (falso positivo) ou muito lento para degradação gradual (false negative). Multi-window burn rate resolve isso com duas janelas: curta (1h) detecta problemas sérios rápido, longa (6h) confirma que não é spike. Burn rate: taxa real de consumo / taxa esperada pelo SLO. Burn rate 14 significa que você vai esgotar o budget mensal em 2 dias. Alerta crítico só dispara quando ambas as janelas excedem o threshold — reduz falsos positivos sem atrasar alertas reais.",
        tip: "Explicar o cálculo de 'budget esgotado em X dias' com o número concreto impressiona.",
        level: "senior",
      },
      {
        q: "Como o error budget guia decisões de engenharia?",
        a: "Budget cheio: time tem liberdade total — deploys arriscados, experimentos, refatoração, feature flags. Budget 50% consumido: mais atenção ao deploy pipeline, feature flags obrigatórias em mudanças grandes. Budget 90% consumido: feature freeze, revisão de práticas de deploy, sprint de reliability em paralelo. Budget esgotado: tudo para, sprint de reliability obrigatório, revisão do SLO se impossível de manter. Isso transforma SRE de 'polícia de operações' em 'parceiro de negócio' — a conversa é sobre custo/benefício de velocidade vs. confiabilidade, com números concretos em vez de intuição.",
        level: "senior",
      },
      {
        q: "Qual SLI você escolheria para medir a confiabilidade de uma API de pagamento?",
        a: "SLI primário: taxa de sucesso das transações — (transações concluídas com sucesso) / (total de tentativas de transação). Inclui retries do cliente? Depende do contrato com o usuário. SLI secundário: latência — proporção de transações concluídas em < 3s (threshold de abandono de usuário). Métricas a evitar como SLI: CPU do servidor (não reflete experiência), health check (o endpoint pode estar up mas a transação falhar). Instrumentar do lado do serviço (não do cliente) para o SLI de disponibilidade. Synthetic monitoring para medir latência real (end-to-end com rede).",
        tip: "Questionar 'do ponto de vista de quem medimos' diferencia quem entende SRE de quem só sabe configurar Prometheus.",
        level: "senior",
      },
      {
        q: "Como você responderia a um incidente onde o error budget está 80% consumido?",
        a: "Ação imediata: verificar se o incidente ainda está ativo e conter. Com 80% consumido: 1. Ativar error budget policy — comunicar ao time de produto que qualquer novo deploy precisa passar por revisão extra. 2. Exigir feature flags em todas as mudanças de código para rollback imediato. 3. Priorizar automação de rollback e batermas de smoke test no deploy pipeline. 4. Revisão post-mortem blameless do incidente que consumiu o budget. 5. Se o SLO é sistematicamente inatingível: revisar o SLO (pode estar muito apertado para o estado atual do sistema) em vez de fingir que o número é correto.",
        tip: "Mencionar revisão de SLO quando inatingível mostra maturidade — SLO não é número sagrado.",
        level: "senior",
      },
    ],
    resources: [
      { title: "Google SRE Book — SLOs", url: "https://sre.google/sre-book/service-level-objectives/", kind: "livro" },
      { title: "Google SRE Workbook — Implementing SLOs", url: "https://sre.google/workbook/implementing-slos/", kind: "docs" },
      { title: "Alex Ewerlof — SLO guide", url: "https://alexewerlof.substack.com/", kind: "artigo" },
      { title: "Google — Art of SLOs workshop", url: "https://sre.google/resources/practices-and-processes/art-of-slos/", kind: "pratica" },
    ],
  },
} satisfies SkillContentMap
