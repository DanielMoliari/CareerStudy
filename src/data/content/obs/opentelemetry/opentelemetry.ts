import type { SkillContent } from "@/types"

const opentelemetry: SkillContent = {
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
      {
        q: "Diferença entre auto-instrumentation e manual instrumentation — quando cada uma é suficiente, e quando precisam coexistir?",
        a: "<p><strong>Auto-instrumentation</strong>: o SDK monkey-patches bibliotecas conhecidas (HTTP client/server, drivers de DB, brokers de fila) em runtime. Em Node.js: <code>@opentelemetry/auto-instrumentations-node</code> via <code>--require ./instrument.js</code>. Em Java/Python: agente Java/byte-code injection. Captura: requests HTTP de entrada/saída, queries SQL, chamadas Redis, mensagens Kafka — sem mudar uma linha de código de aplicação.</p><p><strong>Manual instrumentation</strong>: você cria spans com <code>tracer.startActiveSpan('nome.operacao', span =&gt; { ... })</code> e adiciona atributos relevantes. Necessário para operações de <em>negócio</em> que a auto-instr não conhece: 'autorizar pagamento', 'calcular frete', 'validar regra fiscal'.</p><p><strong>Quando auto basta</strong>: serviço CRUD simples — request entra, faz query, responde. Auto captura toda a latência relevante.</p><p><strong>Quando precisa manual</strong>: 1) operações de negócio dentro de um único request HTTP que você quer separar (auth → validate → calculate → persist) — auto vê 1 span de 200ms, manual decompõe em 4 spans nomeados. 2) processamento assíncrono em filas — auto-instr de Kafka/BullMQ existe mas atributos de negócio (<code>order.id</code>, <code>customer.tier</code>) precisam ser adicionados manualmente. 3) batch jobs e cron — sem request HTTP de origem, auto não cria span raiz.</p><p><strong>Coexistência (caso real)</strong>: auto-instr cobre HTTP/DB/Redis/Kafka. Manual adiciona spans para operações de domínio + atributos de negócio em spans existentes (<code>const span = trace.getActiveSpan(); span?.setAttribute('order.value', 1234)</code>). 90% dos times produtivos usam <em>ambos</em> — auto para infra, manual para domínio.</p>",
        tip: "A frase 'auto para infra, manual para domínio' captura a divisão prática — entrevistador sênior reconhece quem operou em produção.",
        level: "senior",
      },
      {
        q: "Context propagation em profundidade — W3C TraceContext vs B3, como o baggage funciona, o que acontece quando um serviço não propaga?",
        a: "<p><strong>W3C TraceContext</strong>: padrão moderno (2020). Dois headers:</p><ul><li><code>traceparent: 00-{trace_id 128b}-{parent_id 64b}-{flags 8b}</code> — versão, trace_id, span_id do parent, flags (01 = sampled).</li><li><code>tracestate: vendor=opaque-data,other-vendor=...</code> — campo opaco para metadata específica de vendor (ex: AWS X-Ray adiciona seu request_id aqui).</li></ul><p><strong>B3 (Zipkin)</strong>: padrão legado. Múltiplos headers separados: <code>X-B3-TraceId</code>, <code>X-B3-SpanId</code>, <code>X-B3-ParentSpanId</code>, <code>X-B3-Sampled</code>. Variante <em>B3 single header</em>: <code>b3: {trace_id}-{span_id}-{sampled}-{parent_id}</code>. Ainda comum em ambientes Istio/Envoy.</p><p><strong>Baggage</strong> (header separado: <code>baggage: user.tier=premium,region=us-east</code>): metadata <em>de aplicação</em> que viaja entre serviços <em>independente</em> de spans. Use para: enriquecer todos os spans downstream com info do usuário sem precisar passar parâmetro em toda chamada. Cuidado: baggage vai em TODO request — não coloque PII (LGPD/GDPR) e mantenha pequeno (limite recomendado 8KB).</p><p><strong>Compatibilidade</strong>: SDK OTel suporta múltiplos propagators simultaneamente. <code>OTEL_PROPAGATORS=tracecontext,baggage,b3</code> faz o SDK ler/escrever ambos — útil em migração quando alguns serviços ainda emitem B3.</p><p><strong>Quando um serviço não propaga</strong> (ex: middleware antigo em Java sem instrumentação): <em>o trace quebra naquele ponto</em>. Spans antes e depois aparecem como <strong>traces separados</strong> no Jaeger/Tempo — você vê <code>gateway → middleware</code> como trace A, <code>middleware → backend</code> como trace B, sem link entre eles. Diagnóstico: <code>curl -v http://middleware/req</code> e procure traceparent na request <em>e</em> response. Se entra mas não sai, o middleware não propaga. Mitigação: instrumentar o middleware ou colocar um proxy (Envoy) que injeta o header.</p>",
        tip: "Mencionar baggage E o ponto sobre PII (LGPD) mostra rigor de produção — quem só leu doc fala 'baggage propaga metadata' sem trade-offs.",
        level: "senior",
      },
      {
        q: "OTel Collector — receiver → processor → exporter pipeline em detalhe (batch processor, memory_limiter, sampling, dimensionamento)?",
        a: "<p><strong>Pipeline sequencial</strong>: dado chega no receiver → passa por cada processor na ordem → vai para todos os exporters. <em>Ordem importa</em>.</p><p><strong>memory_limiter (sempre primeiro)</strong>: monitora RSS do processo. Quando atinge <code>limit_mib</code>, ativa <em>backpressure</em> (responde gRPC com <code>RESOURCE_EXHAUSTED</code> — SDKs com retry vão fazer backoff). Sem ele: pico de tráfego → OOM kill → você fica cego. Configuração: <code>limit_mib: 2000</code>, <code>spike_limit_mib: 400</code>, <code>check_interval: 1s</code>.</p><p><strong>tail_sampling (no meio)</strong>: bufferiza spans por <code>decision_wait</code> (default 30s) agrupados por trace_id. Após decision_wait sem novos spans, avalia policies em ordem. <em>Multiple policies em OR</em>: any-policy match → trace é mantido. Custos: <code>num_traces × avg_spans × avg_span_size</code> em memória. Para 100k traces × 10 spans × 1KB = 1GB. Se Collector tem múltiplas réplicas, use <code>loadbalancingexporter</code> com consistent hash por trace_id antes do tail sampling — senão cada réplica vê só parte da trace e descarta tudo.</p><p><strong>batch (próximo do fim)</strong>: agrupa spans antes de exportar. Reduz overhead de TLS/gRPC ~10×. <code>send_batch_size: 8192</code>, <code>timeout: 5s</code>, <code>send_batch_max_size: 10000</code> (limite hard pra evitar batch gigante em pico).</p><p><strong>attributes/transform (qualquer lugar)</strong>: para PII redaction, faça <em>antes</em> de exportar. <code>delete</code> de <code>http.request.header.authorization</code>, <code>db.statement</code> sanitization.</p><p><strong>Dimensionamento</strong>: regra prática — 1 vCPU + 1GB RAM por 10k spans/s. Para 100k spans/s: 10 vCPU, 10GB RAM, 3+ réplicas. Métricas internas do Collector (<code>otelcol_exporter_send_failed_spans</code>, <code>otelcol_processor_dropped_spans</code>) são essenciais — exporte para Prometheus e alerte.</p><p><strong>Pipelines paralelos</strong>: pipelines traces, metrics, logs são independentes. Cada um roda em goroutines separadas. Você pode ter <code>traces/jaeger</code> e <code>traces/tempo</code> em paralelo (mesmo dado, dois destinos) durante migração.</p>",
        level: "senior",
      },
      {
        q: "Sampling strategies — head-based (TraceIdRatioBased, ParentBased) vs tail-based (no Collector). O que cada um sacrifica?",
        a: "<p><strong>Head-based</strong> — decisão tomada no SDK no início do trace, antes de saber o resultado. Estado: zero (estateless). Custo: zero overhead.</p><ul><li><code>AlwaysOn</code> / <code>AlwaysOff</code>: 100% ou 0%. Use AlwaysOn em dev, AlwaysOff só para emergência (Collector caído).</li><li><code>TraceIdRatioBased(0.1)</code>: 10% baseado em hash do trace_id. Determinístico — mesmo trace_id sempre dá mesma decisão (consistente entre serviços).</li><li><code>ParentBased</code>: respeita decisão do parent (flag <code>sampled</code> no traceparent). Default recomendado: <code>ParentBased(root: TraceIdRatioBased(0.1))</code> — root decide, downstream segue.</li></ul><p><strong>Sacrifício do head-based</strong>: erros raros são descartados. Se você sampleia 1% e tem 0.1% de erros, captura ~0.001% das traces de erro — pode passar dias sem ver nenhum erro. Não há informação de resultado para pesar a decisão.</p><p><strong>Tail-based (no Collector)</strong> — decisão tomada após a trace completar, com policies que veem o resultado.</p><ul><li><code>status_code: ERROR</code>: 100% das traces com pelo menos um span com erro.</li><li><code>latency: threshold_ms: 1000</code>: 100% das traces lentas.</li><li><code>probabilistic: 0.1</code>: 10% do restante (traces normais).</li><li><code>string_attribute: key=tier, values=[premium]</code>: 100% das traces de usuários premium.</li><li><code>composite</code>: combinações com OR/AND.</li></ul><p><strong>Sacrifício do tail-based</strong>: 1) <em>Custo de memória</em>: bufferiza todos os spans até decisão (1-30s × volume). 2) <em>Coordenação</em>: múltiplos Collectors precisam ver os mesmos trace_ids — exige <code>loadbalancingexporter</code> com consistent hash, mais 1 hop de latência. 3) <em>Latência de visibilidade</em>: trace só aparece no backend após <code>decision_wait</code> (~10-30s). 4) <em>Operação mais complexa</em>: dimensionar memory_limiter + num_traces corretamente.</p><p><strong>Decisão</strong>: produção com SLO real e erros raros = tail-based. Dev/staging = AlwaysOn. Volume baixo (< 1k spans/s) = head-based 10-50% basta — barato e simples.</p>",
        level: "senior",
      },
      {
        q: "Semantic Conventions — por que padronizar http.method vs http.request.method, o que muda entre versões e como evitar breaking changes?",
        a: "<p><strong>Semantic Conventions</strong>: spec da OTel que define nomes <em>canônicos</em> de atributos por domínio (HTTP, DB, RPC, messaging, FaaS). <em>Por que importa</em>: backends (Tempo, Jaeger, Datadog) constroem dashboards, correlação automática e service maps a partir desses nomes. Se você usa <code>http.verb</code> em vez de <code>http.request.method</code>, perde Service Graph automático e queries 'show all DB queries' não acham seus spans.</p><p><strong>Versionamento</strong>:</p><ul><li><strong>1.20 → 1.21</strong>: <code>http.method → http.request.method</code>, <code>http.status_code → http.response.status_code</code>, <code>net.peer.name → server.address</code>. Mudança grande.</li><li><strong>1.21 → 1.23</strong>: estabilizou HTTP. Estabilizou DB conventions com <code>db.system.name</code>.</li><li><strong>Em estabilidade contínua</strong>: messaging, FaaS, GenAI (LLM observability é nova).</li></ul><p><strong>Como o SDK lida</strong>: cada versão de auto-instrumentation está vinculada a uma versão de spec. <code>@opentelemetry/instrumentation-http@0.50.0</code> emite no formato 1.23. Update da lib = mudança de atributos no backend = quebra de queries no Grafana se você buscava por <code>http.method</code>.</p><p><strong>Estratégias para evitar quebras</strong>:</p><ol><li><strong>Pin de versão</strong>: <code>@opentelemetry/instrumentation-http: 0.45.0</code> em <code>package.json</code> + <code>resolutions</code> no monorepo. Update consciente.</li><li><strong>Dual emission</strong>: SDKs OTel modernos suportam <code>OTEL_SEMCONV_STABILITY_OPT_IN=http/dup</code> que emite <em>ambos</em> os formatos por um período de transição. Backends recebem old e new — você atualiza queries com calma.</li><li><strong>Transform processor no Collector</strong>: rename atributos antigos para novos (ou vice-versa) centralizadamente. Suas apps emitem qualquer coisa, Collector normaliza.</li><li><strong>Validação em CI</strong>: lint que checa custom spans usam SemConv (lib <code>@opentelemetry/semantic-conventions</code> exporta constantes — use <code>SemanticAttributes.HTTP_REQUEST_METHOD</code> em vez de string).</li></ol><p><strong>Custom attributes</strong>: para domínio próprio, use namespace (<code>order.id</code>, <code>order.value</code>, <code>order.customer.tier</code>) — nunca confunda com namespaces oficiais (<code>http.*</code>, <code>db.*</code>).</p>",
        tip: "Mencionar OTEL_SEMCONV_STABILITY_OPT_IN=http/dup mostra que você lidou com migração de versão em produção — gotcha que cai em 80% dos updates.",
        level: "senior",
      },
      {
        q: "Resource attributes vs span attributes — o que vai em Resource (service.name, host.name) vs o que vai no span?",
        a: "<p><strong>Resource attributes</strong>: <em>identidade</em> do produtor de telemetria. Imutáveis durante a vida do processo. Aplicados a TODOS os spans/metrics/logs daquele processo. Configurados na inicialização do SDK e <em>não</em> mudam por request.</p><ul><li><code>service.name</code>: nome do serviço (obrigatório). Define o nó no Service Graph.</li><li><code>service.version</code>: versão do build (correlaciona com deploys).</li><li><code>service.instance.id</code>: pod ID, hostname, UUID.</li><li><code>deployment.environment</code>: prod, staging, dev.</li><li><code>host.name</code>, <code>host.arch</code>, <code>os.type</code>: ambiente.</li><li><code>k8s.namespace.name</code>, <code>k8s.pod.name</code>, <code>k8s.deployment.name</code>: detectados via <code>k8sattributesprocessor</code> no Collector.</li><li><code>cloud.provider</code>, <code>cloud.region</code>, <code>cloud.availability_zone</code>: AWS/GCP/Azure.</li></ul><p><strong>Span attributes</strong>: <em>contexto da operação específica</em>. Variam por request.</p><ul><li><code>http.request.method=POST</code>, <code>http.response.status_code=200</code>, <code>url.path=/api/orders</code>.</li><li><code>db.system=postgresql</code>, <code>db.statement</code> (sanitized).</li><li><code>order.id=12345</code>, <code>order.value=199.90</code>, <code>customer.tier=premium</code> — atributos de domínio.</li></ul><p><strong>Por que separar</strong>: 1) <em>Eficiência de storage</em>: backends armazenam Resource UMA vez por processo. Se você colocar <code>service.name</code> em todo span, infla o storage 10×. 2) <em>Indexação</em>: backends indexam Resource para queries rápidas (<code>resource.service.name=checkout</code> é o filtro mais comum). Span attributes são indexados parcialmente.</p><p><strong>Anti-pattern</strong>: setar <code>service.name</code> via span attribute (<code>span.setAttribute('service.name', '...')</code>) — não vira Resource, fica como atributo do span e backends não correlacionam corretamente. Sempre via SDK init: <code>new Resource({[ATTR_SERVICE_NAME]: 'checkout'})</code>.</p><p><strong>Detection automática</strong>: <code>opentelemetry-resource-detector-aws</code>, <code>-gcp</code>, <code>-container</code> populam Resource com metadados do ambiente sem você configurar. Em K8s, <code>k8sattributesprocessor</code> no Collector enriquece Resource com pod/namespace/deployment a partir do K8s API.</p>",
        level: "senior",
      },
      {
        q: "Como correlacionar traces, metrics e logs — trace_id em logs, exemplars em metrics, e como o Grafana une tudo?",
        a: "<p>O <strong>trace_id</strong> é a <em>chave universal</em> que conecta os 3 sinais.</p><p><strong>Logs ↔ Traces</strong>:</p><ol><li>Logger (Pino, Winston, Logback, structlog) é configurado com OTel log bridge. Quando há span ativo, o bridge injeta <code>trace_id</code> e <code>span_id</code> no JSON do log.</li><li>Em Loki, configure <code>derivedFields</code> no datasource: regex <code>trace_id=(\\w+)</code> captura o valor → cria link clicável que abre o trace no Tempo.</li><li>Em Tempo, configure <code>tracesToLogsV2</code> no datasource: pega <code>service.name</code> + intervalo do span → query LogQL <code>{service=\"X\"} | trace_id=\"Y\"</code>.</li><li>Resultado: do log você abre o trace; do span você abre os logs daquele span.</li></ol><p><strong>Metrics ↔ Traces (exemplars)</strong>:</p><ol><li>SDK OTel injeta automaticamente <code>trace_id</code> no histogram bucket onde a observação caiu (formato OpenMetrics).</li><li>Prometheus armazena com <code>--enable-feature=exemplar-storage</code>.</li><li>Datasource Prometheus tem <code>exemplarTraceIdDestinations: [{name: trace_id, datasourceUid: tempo}]</code>.</li><li>No painel: ative Exemplars. Diamantes amarelos = traces específicos. Clique → trace abre.</li></ol><p><strong>Logs ↔ Metrics</strong>: indireto via trace_id ou via service.name + timestamp. Loki também consegue gerar métricas de logs (<code>rate({service=\"x\"} |= \"error\" [5m])</code>) — mas isso é métrica derivada de log, não correlação.</p><p><strong>Pipeline completo</strong>:</p><ol><li>App instrumentada com OTel SDK: traces + metrics + logs com <em>mesmo</em> trace_id quando houver span ativo.</li><li>Collector exporta: traces → Tempo, metrics → Prometheus/Mimir, logs → Loki.</li><li>Grafana datasources configurados com correlações cruzadas (4 links: Tempo↔Loki, Tempo↔Prom, Loki↔Tempo, Prom→Tempo).</li><li>Workflow real: alerta dispara em métrica → exemplar leva ao trace específico → tracesToLogs abre logs daquele span → diagnóstico em 4 cliques, ~3 minutos.</li></ol><p><strong>Sem essa correlação</strong>: você abre 3 sistemas separados, copia timestamps manualmente, faz grep em logs por chute. 30+ minutos para identificar a causa de um spike.</p>",
        tip: "A frase '4 cliques, 3 minutos' contra '30+ minutos' quantifica o ROI da correlação — argumento de arquitetura em entrevista de senior.",
        level: "senior",
      },
    ],
    codeExamples: [
      {
        title: "instrument.ts — Setup completo de SDK Node.js (TracerProvider + MeterProvider + LoggerProvider + OTLP + auto-instrumentation)",
        description: "Bootstrap único que configura os 3 sinais (traces, metrics, logs) com OTLP gRPC para Collector e auto-instrumentation completa. Importe ANTES de qualquer outro módulo — em ESM use --import, em CJS use --require.",
        language: "typescript",
        code: `// instrument.ts — bootstrap único de OTel
import { NodeSDK } from '@opentelemetry/sdk-node'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-grpc'
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs'
import { resourceFromAttributes } from '@opentelemetry/resources'
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
  ATTR_DEPLOYMENT_ENVIRONMENT_NAME,
} from '@opentelemetry/semantic-conventions/incubating'

const collectorUrl = process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://otel-collector:4317'

const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME ?? 'checkout-api',
  [ATTR_SERVICE_VERSION]: process.env.SERVICE_VERSION ?? '0.0.0',
  [ATTR_DEPLOYMENT_ENVIRONMENT_NAME]: process.env.NODE_ENV ?? 'development',
  'service.instance.id': process.env.HOSTNAME ?? 'local',
})

const sdk = new NodeSDK({
  resource,
  traceExporter: new OTLPTraceExporter({ url: collectorUrl }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({ url: collectorUrl }),
    exportIntervalMillis: 30_000,
  }),
  logRecordProcessors: [
    new BatchLogRecordProcessor(new OTLPLogExporter({ url: collectorUrl })),
  ],
  instrumentations: [
    getNodeAutoInstrumentations({
      // desligue instrumentações ruidosas — fs gera 1000s de spans
      '@opentelemetry/instrumentation-fs': { enabled: false },
      '@opentelemetry/instrumentation-http': {
        // ignora health checks e probes
        ignoreIncomingRequestHook: req => /^\\/(health|ready|metrics)/.test(req.url ?? ''),
      },
    }),
  ],
})

// Inicia ANTES de tudo — auto-instr precisa interceptar require()
sdk.start()

// Shutdown gracioso — não perca spans no SIGTERM
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('OTel SDK shutdown OK'))
    .catch((err) => console.error('OTel SDK shutdown error', err))
    .finally(() => process.exit(0))
})

// Uso (em outro arquivo): node --require ./instrument.js src/server.js
// ou ESM: node --import ./instrument.js src/server.js`,
      },
      {
        title: "Manual span — atributos de negócio, eventos, status e propagação HTTP via headers",
        description: "Span manual cobrindo as 3 dimensões: atributos (estado), eventos (timeline), status (resultado). Inclui propagação manual via headers para chamadas downstream — útil quando auto-instr não cobre o cliente HTTP usado.",
        language: "typescript",
        code: `import { trace, context, propagation, SpanStatusCode, SpanKind } from '@opentelemetry/api'

const tracer = trace.getTracer('checkout', '1.4.2')

// 1) Span manual com atributos de domínio + eventos + status
export async function autorizarPagamento(pedido: Pedido) {
  return tracer.startActiveSpan(
    'pagamento.autorizar',
    {
      kind: SpanKind.INTERNAL,
      attributes: {
        // Custom domain attributes — namespace 'order'/'payment'
        'order.id': pedido.id,
        'order.value': pedido.total,
        'order.currency': pedido.moeda,
        'customer.tier': pedido.cliente.tier,
        'payment.gateway': 'stripe',
      },
    },
    async (span) => {
      try {
        // 2) Eventos = pontos no tempo dentro do span
        span.addEvent('validation.start')
        await validar(pedido)
        span.addEvent('validation.success')

        span.addEvent('gateway.call.start')
        const result = await chamarGatewayComContexto(pedido)
        span.addEvent('gateway.call.success', { 'gateway.response_id': result.id })

        // 3) Atributos podem ser adicionados depois
        span.setAttribute('payment.authorization_id', result.authId)
        span.setStatus({ code: SpanStatusCode.OK })

        return result
      } catch (err) {
        // recordException + ERROR status — Tempo/Jaeger destacam visualmente
        span.recordException(err as Error)
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: (err as Error).message,
        })
        throw err
      } finally {
        span.end()  // SEMPRE no finally — sem isso, span fica aberto pra sempre
      }
    }
  )
}

// 4) Propagação manual via HTTP headers (quando auto-instr não cobre o cliente)
async function chamarGatewayComContexto(pedido: Pedido) {
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    'x-idempotency-key': pedido.id,
  }

  // Injeta traceparent + tracestate + baggage no headers
  propagation.inject(context.active(), headers)

  return fetch('https://gateway.example/charge', {
    method: 'POST',
    headers,
    body: JSON.stringify(pedido),
  }).then(r => r.json())
}

// 5) Acessar span ativo de qualquer lugar (ex: middleware adicionar atributos)
export function tagUserOnActiveSpan(user: User) {
  const span = trace.getActiveSpan()
  // Sempre valide — pode estar fora de span (cron, startup)
  span?.setAttributes({
    'user.id': user.id,
    'user.tier': user.tier,
    // NUNCA: 'user.email' (PII), 'user.password' (jamais)
  })
}`,
      },
      {
        title: "otel-collector.yaml — Pipeline produção: receivers, memory_limiter, tail_sampling, batch, attributes (PII redaction), múltiplos exporters",
        description: "Configuração completa de produção: 3 pipelines (traces, metrics, logs), tail sampling com 4 policies, redaction de PII, exemplars, exportação para Tempo + Mimir + Loki + Jaeger (durante migração).",
        language: "yaml",
        code: `# otel-collector.yaml — production-grade
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
        max_recv_msg_size_mib: 16
      http:
        endpoint: 0.0.0.0:4318
        cors:
          allowed_origins: ["https://app.example.com"]

  # Migração: receba também Jaeger Thrift de clientes legados
  jaeger:
    protocols:
      thrift_http:
        endpoint: 0.0.0.0:14268

processors:
  # SEMPRE primeiro — sem ele, OOM mata o Collector em pico
  memory_limiter:
    check_interval: 1s
    limit_mib: 2000
    spike_limit_mib: 400

  # Enriquece com K8s metadata (pod, namespace, deployment)
  k8sattributes:
    auth_type: serviceAccount
    extract:
      metadata: [k8s.namespace.name, k8s.pod.name, k8s.deployment.name]

  # Tail sampling — 4 policies em OR (any match = keep)
  tail_sampling:
    decision_wait: 10s
    num_traces: 50000
    expected_new_traces_per_sec: 1000
    policies:
      - name: keep-errors
        type: status_code
        status_code: { status_codes: [ERROR] }
      - name: keep-slow
        type: latency
        latency: { threshold_ms: 1000 }
      - name: keep-premium-users
        type: string_attribute
        string_attribute:
          key: customer.tier
          values: [premium, enterprise]
      - name: probabilistic-rest
        type: probabilistic
        probabilistic: { sampling_percentage: 5 }

  # PII redaction — antes de exportar
  attributes/redact:
    actions:
      - key: http.request.header.authorization
        action: delete
      - key: http.request.header.cookie
        action: delete
      - key: user.email
        action: delete
      - key: db.statement
        action: hash  # mantém valor mas hashea — útil para correlação sem vazar SQL

  # Sempre próximo do fim — agrupa para reduzir overhead de gRPC/TLS
  batch:
    send_batch_size: 8192
    send_batch_max_size: 10000
    timeout: 5s

exporters:
  # Traces para Tempo
  otlphttp/tempo:
    endpoint: http://tempo:4318
    tls: { insecure: true }

  # Migração: também envie para Jaeger durante transição (apaga depois)
  otlp/jaeger:
    endpoint: jaeger-collector:4317
    tls: { insecure: true }

  # Metrics → Mimir (compatible com Prometheus remote_write)
  prometheusremotewrite:
    endpoint: http://mimir-distributor:9009/api/v1/push
    headers:
      X-Scope-OrgID: tenant-prod
    resource_to_telemetry_conversion: { enabled: true }
    # Habilita exemplars no remote_write — link p99 ↔ trace
    send_exemplars: true

  # Logs → Loki
  loki:
    endpoint: http://loki:3100/loki/api/v1/push

  # Debug em dev — descomente quando precisar
  # debug:
  #   verbosity: detailed
  #   sampling_initial: 5
  #   sampling_thereafter: 1000

extensions:
  health_check: { endpoint: 0.0.0.0:13133 }
  pprof: { endpoint: 0.0.0.0:1777 }
  zpages: { endpoint: 0.0.0.0:55679 }

service:
  extensions: [health_check, pprof, zpages]
  pipelines:
    traces:
      receivers: [otlp, jaeger]
      processors: [memory_limiter, k8sattributes, tail_sampling, attributes/redact, batch]
      exporters: [otlphttp/tempo, otlp/jaeger]

    metrics:
      receivers: [otlp]
      processors: [memory_limiter, k8sattributes, batch]
      exporters: [prometheusremotewrite]

    logs:
      receivers: [otlp]
      processors: [memory_limiter, k8sattributes, attributes/redact, batch]
      exporters: [loki]

  telemetry:
    metrics:
      level: detailed
      address: 0.0.0.0:8888  # /metrics do próprio Collector — monitore!
    logs:
      level: info`,
      },
      {
        title: "BullMQ — propagação de contexto manual em filas (producer + consumer)",
        description: "Filas não propagam traceparent automaticamente. Producer injeta o contexto nos dados do job; consumer extrai e cria span filho. Sem isso, o trace quebra na fronteira da fila.",
        language: "typescript",
        code: `import { trace, context, propagation, SpanKind } from '@opentelemetry/api'
import { Queue, Worker } from 'bullmq'

const tracer = trace.getTracer('order-worker', '1.0')
const queue = new Queue('pedidos', { connection: { host: 'redis' } })

// PRODUCER — injeta contexto OTel nos dados do job
export async function publicarPedido(pedido: Pedido) {
  return tracer.startActiveSpan(
    'pedido.publicar',
    { kind: SpanKind.PRODUCER, attributes: { 'messaging.system': 'redis', 'messaging.destination.name': 'pedidos' } },
    async (span) => {
      const carrier: Record<string, string> = {}
      // Injeta traceparent + tracestate + baggage no carrier
      propagation.inject(context.active(), carrier)

      await queue.add('processar-pedido', {
        ...pedido,
        _otelContext: carrier,  // viaja junto com os dados do job
      })

      span.setAttribute('messaging.message.id', pedido.id)
      span.end()
    }
  )
}

// CONSUMER — extrai contexto e cria span filho
new Worker(
  'pedidos',
  async (job) => {
    // Extrai o contexto do produtor
    const parentCtx = propagation.extract(
      context.active(),
      job.data._otelContext ?? {}
    )

    // Roda o handler dentro do contexto extraído
    return context.with(parentCtx, () =>
      tracer.startActiveSpan(
        'pedido.consumir',
        { kind: SpanKind.CONSUMER, attributes: { 'messaging.system': 'redis', 'job.id': job.id ?? '' } },
        async (span) => {
          try {
            // Este span tem o MESMO trace_id do produtor — waterfall ininterrupto
            await processarPedido(job.data)
            span.end()
          } catch (err) {
            span.recordException(err as Error)
            span.setStatus({ code: 2, message: (err as Error).message })
            span.end()
            throw err
          }
        }
      )
    )
  },
  { connection: { host: 'redis' }, concurrency: 5 }
)

async function processarPedido(p: Pedido) {
  // ...
}`,
      },
    ],
    videos: [
      {
        title: "OpenTelemetry Tutorial — Distributed Tracing",
        channel: "Honeycomb",
        url: "https://www.youtube.com/watch?v=r8UvWSX3KA8",
        topic: "Fundamentos de tracing distribuído com OTel — spans, context propagation, atributos",
        note: "Liz Fong-Jones (ex-Google SRE, Honeycomb) explica os conceitos do zero. Bom ponto de partida antes de mergulhar no Collector.",
      },
      {
        title: "OpenTelemetry Collector Deep Dive — receivers, processors, exporters",
        channel: "CNCF",
        url: "https://www.youtube.com/watch?v=PiIWGT7XU8s",
        topic: "Arquitetura do Collector: pipelines, tail sampling, memory_limiter, dimensionamento",
        note: "Material denso da KubeCon — cobre os trade-offs de produção que caem em entrevista de SRE/Platform.",
      },
      {
        title: "Auto-Instrumentation in Node.js with OpenTelemetry",
        channel: "OpenTelemetry",
        url: "https://www.youtube.com/watch?v=ZspRq4nq0xI",
        topic: "Bootstrap de SDK, auto-instrumentations-node, debugging de spans não chegando ao backend",
        note: "Walkthrough oficial — útil para entender o que a auto-instr cobre e onde manual é necessária.",
      },
      {
        title: "Tail Sampling at Scale — Lessons from Production",
        channel: "OpenTelemetry",
        url: "https://www.youtube.com/watch?v=DT7vqkSlj0g",
        topic: "Implementação real de tail sampling com loadbalancingexporter, consistent hashing por trace_id",
        note: "Caso real de produção com múltiplos Collectors — exatamente o cenário da Q&A de tail sampling.",
      },
      {
        title: "OpenTelemetry Logs — The Third Signal",
        channel: "OpenTelemetry",
        url: "https://www.youtube.com/watch?v=k9LB1Ol0lHs",
        topic: "Log signal no OTel, log bridge para Pino/Winston/Logback, correlação trace_id em logs",
        note: "Explica como o LogRecord se diferencia de Span e como o bridge injeta trace_id automaticamente.",
      },
    ],
    mindmap: {
      title: "OpenTelemetry — ecossistema completo (signals · API · Collector · backends)",
      html: `<style>
.otmm-wrap{font-family:'Space Grotesk',sans-serif;background:#0a0a0a;border-radius:12px;padding:22px;color:#e2e8f0}
.otmm-center{background:linear-gradient(135deg,#f5a800,#dc2626);color:#fff;padding:.85rem 1.6rem;border-radius:.6rem;font-weight:700;font-size:1.05rem;text-align:center;margin:0 auto 1.4rem;display:inline-block}
.otmm-row{display:flex;flex-wrap:wrap;gap:.85rem;justify-content:center;margin-bottom:.85rem}
.otmm-branch{background:#111827;border-radius:.7rem;padding:.85rem 1rem;min-width:200px;max-width:240px;border-left:3px solid #334155}
.otmm-node{font-weight:700;margin-bottom:.45rem;font-size:.85rem;letter-spacing:.02em}
.otmm-items{display:flex;flex-direction:column;gap:.18rem}
.otmm-item{color:#94a3b8;font-size:.74rem;padding:.1rem .25rem;border-left:1.5px solid #1f2937;line-height:1.45}
.otmm-pill{display:inline-block;font-size:.65rem;font-family:'JetBrains Mono',monospace;background:rgba(245,168,0,.1);color:#f5a800;padding:.05rem .35rem;border-radius:3px;margin-left:.2rem}
</style>
<div class="otmm-wrap" style="text-align:center">
  <div class="otmm-center">OpenTelemetry — observabilidade vendor-neutral</div>
  <div style="text-align:left">
    <div class="otmm-row">
      <div class="otmm-branch" style="border-left-color:#f5a800">
        <div class="otmm-node" style="color:#f5a800">Signals</div>
        <div class="otmm-items">
          <span class="otmm-item">Traces — spans &amp; waterfall</span>
          <span class="otmm-item">Metrics — counter/gauge/histogram</span>
          <span class="otmm-item">Logs — eventos discretos</span>
          <span class="otmm-item">Profiles (continuous, GA 2025)</span>
          <span class="otmm-item">Baggage — metadata cross-service</span>
          <span class="otmm-item">Resource — identidade do processo</span>
          <span class="otmm-item">Events — pontos dentro do span</span>
        </div>
      </div>
      <div class="otmm-branch" style="border-left-color:#fbbf24">
        <div class="otmm-node" style="color:#fbbf24">API &amp; SDK</div>
        <div class="otmm-items">
          <span class="otmm-item">TracerProvider · Tracer · Span</span>
          <span class="otmm-item">MeterProvider · Meter · Instrument</span>
          <span class="otmm-item">LoggerProvider · Logger · LogRecord</span>
          <span class="otmm-item">Context · ContextManager</span>
          <span class="otmm-item">Propagator · TextMapPropagator</span>
          <span class="otmm-item">SpanProcessor (Batch/Simple)</span>
          <span class="otmm-item">Exporter (OTLP/Console/Custom)</span>
          <span class="otmm-item">10+ linguagens (TS/Go/Python/Java/...)</span>
        </div>
      </div>
      <div class="otmm-branch" style="border-left-color:#22d3ee">
        <div class="otmm-node" style="color:#22d3ee">Instrumentation</div>
        <div class="otmm-items">
          <span class="otmm-item">Auto — runtime monkey-patch</span>
          <span class="otmm-item">Library — packages oficiais (HTTP/DB/...)</span>
          <span class="otmm-item">Manual — startActiveSpan + atributos</span>
          <span class="otmm-item">Zero-code (Java agent, Python distro)</span>
          <span class="otmm-item">eBPF (Beyla, Pixie) — sem SDK</span>
          <span class="otmm-item">Web (browser SDK, navegador)</span>
        </div>
      </div>
    </div>
    <div class="otmm-row">
      <div class="otmm-branch" style="border-left-color:#a855f7">
        <div class="otmm-node" style="color:#a855f7">Collector</div>
        <div class="otmm-items">
          <span class="otmm-item">Receivers (OTLP/Prom/Jaeger/Zipkin)</span>
          <span class="otmm-item">Processors (memory_limiter ① / batch)</span>
          <span class="otmm-item">tail_sampling · k8sattributes · transform</span>
          <span class="otmm-item">Exporters (OTLP/Tempo/Prom/Loki)</span>
          <span class="otmm-item">Pipelines (traces · metrics · logs)</span>
          <span class="otmm-item">Modos: Agent (sidecar) · Gateway</span>
          <span class="otmm-item">loadbalancingexporter (consistent hash)</span>
          <span class="otmm-item">Distros: contrib · core · custom</span>
        </div>
      </div>
      <div class="otmm-branch" style="border-left-color:#ef4444">
        <div class="otmm-node" style="color:#ef4444">Propagation</div>
        <div class="otmm-items">
          <span class="otmm-item">W3C TraceContext (traceparent)</span>
          <span class="otmm-item">tracestate (vendor opaque)</span>
          <span class="otmm-item">B3 (Zipkin legado, single/multi)</span>
          <span class="otmm-item">Baggage (key=value cross-service)</span>
          <span class="otmm-item">AWS X-Amzn-Trace-Id</span>
          <span class="otmm-item">Jaeger uber-trace-id</span>
          <span class="otmm-item">OTEL_PROPAGATORS (composite)</span>
        </div>
      </div>
      <div class="otmm-branch" style="border-left-color:#4ade80">
        <div class="otmm-node" style="color:#4ade80">Sampling</div>
        <div class="otmm-items">
          <span class="otmm-item">Head: AlwaysOn / AlwaysOff</span>
          <span class="otmm-item">Head: TraceIdRatioBased(p)</span>
          <span class="otmm-item">Head: ParentBased (default rec.)</span>
          <span class="otmm-item">Tail (no Collector) — status/latency</span>
          <span class="otmm-item">Tail: probabilistic / composite</span>
          <span class="otmm-item">Tail: string_attribute (premium users)</span>
          <span class="otmm-item">Decision: head + tail combinados</span>
        </div>
      </div>
    </div>
    <div class="otmm-row">
      <div class="otmm-branch" style="border-left-color:#fb7185">
        <div class="otmm-node" style="color:#fb7185">Semantic Conventions</div>
        <div class="otmm-items">
          <span class="otmm-item">HTTP — http.request.method · url.path</span>
          <span class="otmm-item">DB — db.system · db.statement</span>
          <span class="otmm-item">RPC — rpc.service · rpc.method</span>
          <span class="otmm-item">Messaging — messaging.system/destination</span>
          <span class="otmm-item">FaaS — faas.invocation_id</span>
          <span class="otmm-item">K8s — k8s.namespace/pod/deployment</span>
          <span class="otmm-item">Cloud — cloud.provider/region</span>
          <span class="otmm-item">GenAI — gen_ai.* (LLM observability)</span>
        </div>
      </div>
      <div class="otmm-branch" style="border-left-color:#60a5fa">
        <div class="otmm-node" style="color:#60a5fa">OTLP Protocol</div>
        <div class="otmm-items">
          <span class="otmm-item">Protobuf binário (canonical)</span>
          <span class="otmm-item">gRPC — porta 4317 (streaming)</span>
          <span class="otmm-item">HTTP — porta 4318 (compat)</span>
          <span class="otmm-item">Compressão gzip nativa</span>
          <span class="otmm-item">TLS · mTLS · Bearer auth</span>
          <span class="otmm-item">Retry com exponential backoff</span>
        </div>
      </div>
      <div class="otmm-branch" style="border-left-color:#94a3b8">
        <div class="otmm-node" style="color:#94a3b8">Backends</div>
        <div class="otmm-items">
          <span class="otmm-item">Traces — Jaeger · Tempo · Zipkin</span>
          <span class="otmm-item">Metrics — Prometheus · Mimir · Cortex</span>
          <span class="otmm-item">Logs — Loki · Elasticsearch · Splunk</span>
          <span class="otmm-item">SaaS — Datadog · Honeycomb · NR</span>
          <span class="otmm-item">SaaS — Grafana Cloud · Lightstep</span>
          <span class="otmm-item">All-in-one — SigNoz · Uptrace</span>
        </div>
      </div>
    </div>
  </div>
</div>`,
      caption: "OTel é API + SDK + Collector + protocolo. O ponto chave: vendor-neutral. Você instrumenta uma vez, troca de backend mudando só o YAML do Collector. Semantic Conventions são o que torna correlação possível entre ferramentas.",
    },
    exercises: [
      {
        level: 'iniciante',
        title: "Suba uma stack OTel local e instrumente um app Node.js Express",
        description: "Use docker-compose com Jaeger (all-in-one) ou Tempo + Grafana. Crie um Express com 2 endpoints (/health, /pedido) que faz uma query no Postgres. Instrumente com auto-instrumentation usando o instrument.ts do codeExample 1. Confirme que os spans aparecem no Jaeger UI com service.name, http.request.method, db.system corretos. Adicione resource attributes service.version e deployment.environment.",
        concepts: ["docker-compose", "auto-instrumentation", "OTLP exporter", "resource attributes", "Jaeger/Tempo UI"],
        hint: "Em ESM use 'node --import ./instrument.js src/server.js' (não --require). Se spans não aparecem: confirme que OTEL_EXPORTER_OTLP_ENDPOINT está configurado e que o Collector/Jaeger está rodando antes do app subir.",
        relatedKeypoints: [0, 1],
      },
      {
        level: 'intermediario',
        title: "Adicione spans manuais com atributos de negócio + propagação em fila BullMQ",
        description: "Estenda o exercício anterior: crie endpoint /checkout que enfileira um job BullMQ. Producer cria span 'checkout.criar' com atributos order.id, order.value, customer.tier, e injeta contexto OTel no job. Worker consumer extrai contexto, cria span filho 'pedido.processar' com kind=CONSUMER, e simula processamento (DB + chamada externa fake). Confirme no Jaeger que producer e consumer aparecem como UM trace (não dois separados). Use o codeExample 4 como referência.",
        concepts: ["manual spans", "domain attributes", "BullMQ", "context propagation manual", "SpanKind producer/consumer"],
        hint: "Sem propagation.inject/extract o trace quebra. Confirme que job.data tem campo _otelContext após enfileirar (console.log do job). No worker, antes de criar span, faça propagation.extract e context.with — fora do context.with, novos spans são root, não filhos.",
        relatedKeypoints: [1, 2],
      },
      {
        level: 'intermediario',
        title: "Configure Collector com tail sampling preservando 100% dos erros",
        description: "Substitua o exporter direto Jaeger por OTel Collector. Configure receiver OTLP, processors memory_limiter + tail_sampling + batch, exporter otlphttp para Tempo. Tail sampling com 3 policies: keep-errors (status_code ERROR), keep-slow (latency > 500ms), probabilistic 5%. Use o codeExample 3 como base. Gere tráfego: 100 requests OK, 5 lentos (sleep 1s), 5 com erro (throw). Confirme no Tempo que TODOS os 10 (lentos+erros) aparecem mas só ~5 dos 100 OK.",
        concepts: ["OTel Collector", "memory_limiter", "tail_sampling policies", "decision_wait", "OTLP HTTP"],
        hint: "decision_wait padrão é 30s — se você gera tráfego rápido, espere antes de checar. Se TODOS aparecem (não só os filtrados), sua policy está errada — confira se status_code policy usa { status_codes: [ERROR] } com array, e probabilistic é a última (avaliada por último).",
        relatedKeypoints: [3, 4],
      },
      {
        level: 'senior',
        title: "Implemente correlação completa traces ↔ logs ↔ metrics no LGTM",
        description: "Stack completo: app + OTel Collector + Tempo + Loki + Prometheus + Grafana. App emite traces (auto-instr), métricas (histogram com buckets, exemplars automáticos via OTel SDK) e logs estruturados (Pino + opentelemetry-instrumentation-pino que injeta trace_id). Configure: Prometheus com --enable-feature=exemplar-storage e scrape_protocols OpenMetrics. Datasource Tempo com tracesToLogsV2 → Loki. Datasource Loki com derivedFields para trace_id. Datasource Prometheus com exemplarTraceIdDestinations. Validação: gere request lento, abra painel p99, clique no exemplar, abre trace, clique 'View logs', vê logs filtrados pelo trace_id. Os 3 sinais conectados.",
        concepts: ["exemplars", "tracesToLogsV2", "derivedFields", "OpenMetrics", "Pino bridge", "correlação 3 sinais"],
        hint: "Se exemplars não aparecem: confira /metrics do app (linhas com '# {trace_id=\"...\"}'), depois Prometheus /api/v1/query_exemplars, depois datasource. Cada ponto que falhar bloqueia silenciosamente. Logs sem trace_id: confirme que pino-instrumentation está ativada e que log é emitido dentro de span ativo (try/finally com span.end no final).",
        relatedKeypoints: [0, 1, 5],
      },
      {
        level: 'senior',
        title: "Migre uma app de OTLP HTTP simples para Collector com loadbalancing + múltiplos Collectors stateful",
        description: "Cenário: você tem 1 Collector com tail sampling. Quer escalar para 3 réplicas. Sem coordenação, cada Collector vê só ~1/3 dos spans de cada trace e descarta tudo (decisão errada). Solução: 2 camadas — frontend Collectors (sem tail sampling, usam loadbalancingexporter com consistent hash por trace_id) e backend Collectors (com tail sampling). Configure no docker-compose ou k8s: 2 frontend + 3 backend. Valide com app que cria traces de 5+ services — confirme que cada trace_id é roteado SEMPRE para o mesmo backend Collector e que tail sampling decide corretamente (todos os spans do trace chegam no mesmo Collector). Adicione metrics do próprio Collector (otelcol_processor_dropped_spans, otelcol_loadbalancer_backend_*) e crie alerta.",
        concepts: ["loadbalancingexporter", "consistent hashing por trace_id", "Collector multi-tier", "Collector self-monitoring"],
        hint: "loadbalancingexporter precisa do route_key: traceID. Backends devem expor OTLP gRPC. Use DNS service discovery do k8s (resolver: dns) para o load balancer descobrir os backends. Métrica otelcol_processor_dropped_spans > 0 indica memory_limiter ativo — aumente recursos.",
        relatedKeypoints: [3],
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
  }

export default opentelemetry
