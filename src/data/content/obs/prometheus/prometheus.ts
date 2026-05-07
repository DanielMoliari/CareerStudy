import type { SkillContent } from "@/types"

const prometheus: SkillContent = {
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
  }

export default prometheus
