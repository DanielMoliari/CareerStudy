import type { SkillContent } from "@/types"

const slisSlosSlas: SkillContent = {
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
      {
        title: "Toil — o inimigo da escala",
        body: "Toil é trabalho manual, repetitivo, sem valor duradouro que cresce linearmente com o volume do sistema. Exemplos: executar deploys manualmente, responder alertas ruidosos toda semana, rotacionar certificados na mão. SRE deve manter toil < 50% do tempo — acima disso não sobra tempo para engenharia de confiabilidade. Error budget policy ajuda: quando budget está sendo consumido por toil (incidentes repetitivos), a sprint de reliability se torna obrigatória.",
      },
      {
        title: "Quatro alertas SRE Workbook — 14·6·3·1",
        body: "O SRE Workbook define 4 alertas de burn rate que cobrem todos os horizontes: Page rápido (burn rate 14× em janela 1h+5m — esgota em 2 dias), Page lento (6× em 6h+30m — esgota em 5 dias), Ticket urgente (3× em 24h+2h — esgota em 10 dias), Ticket longo (1× em 3d+6h — consumo exato). Juntos, eles detectam tanto picos agudos quanto degradação gradual invisível. Memorize: 14·6·3·1.",
        code: `# Os 4 alertas do SRE Workbook (SLO 99,9%)
# Cada par combina janela curta E longa (multi-window AND)

# 1. Page — rápido (esgota em ~2 dias)
burn_1h  > 14 * 0.001  AND  burn_5m  > 14 * 0.001

# 2. Page — lento (esgota em ~5 dias)
burn_6h  > 6  * 0.001  AND  burn_30m > 6  * 0.001

# 3. Ticket — urgente (esgota em ~10 dias)
burn_1d  > 3  * 0.001  AND  burn_2h  > 3  * 0.001

# 4. Ticket — longo (consumo na taxa esperada)
burn_3d  > 1  * 0.001  AND  burn_6h  > 1  * 0.001`,
      },
      {
        title: "SLI de latência versus SLI de disponibilidade",
        body: "Disponibilidade mede se o serviço respondeu (status != 5xx). Latência mede se respondeu dentro do tempo aceitável. Para muitos produtos, latência é mais importante: um checkout que responde em 8s é 'disponível' mas causa abandono. Bons SLIs de latência usam proporção de requests dentro do bucket: (requests < 500ms) / total — não média nem p99 bruto (ambos são SLIs ruins, não proporções). Synthetic monitoring (checks externos) captura latência de rede + DNS + TLS — muito mais próximo do que o usuário sente do que métricas server-side.",
      },
    ],
    diagrams: [
      {
        title: "Matemática do SLO — noves e downtime permitido por ano",
        html: `<style>
.slm-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.slm-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(230,82,44,.4);display:inline}
.slm-tip:hover .slm-tb{display:block}
.slm-tb{display:none;position:absolute;bottom:calc(100%+8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:230px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.8)}
.slm-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.slm-row{display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid #1e293b}
.slm-row:last-child{border-bottom:none}
.slm-slo{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;width:60px;flex-shrink:0}
.slm-bar{flex:1;height:12px;border-radius:6px;background:#1e293b;overflow:hidden;position:relative}
.slm-fill{height:100%;border-radius:6px}
.slm-down{font-family:'JetBrains Mono',monospace;font-size:11px;width:120px;flex-shrink:0;text-align:right;color:#64748b}
.slm-note{font-size:9px;color:#475569;margin-left:6px;white-space:nowrap}
@keyframes slm-grow{from{width:0}to{width:var(--w)}}
</style>
<div class="slm-wrap">
  <p style="font-size:12px;font-weight:600;margin:0 0 4px;color:#E6522C">Matemática do SLO — noves e downtime permitido por ano</p>
  <p style="font-size:10px;color:#475569;margin:0 0 14px">Passe o mouse nos <span style="border-bottom:1px dashed rgba(230,82,44,.4)">termos</span>. Cada nove a mais reduz 10× o downtime permitido.</p>

  <!-- Header -->
  <div style="display:flex;align-items:center;gap:8px;padding:6px 0;margin-bottom:4px">
    <div style="width:60px;font-size:8px;color:#475569;letter-spacing:.1em;text-transform:uppercase;flex-shrink:0">SLO</div>
    <div style="flex:1;font-size:8px;color:#475569;letter-spacing:.1em;text-transform:uppercase">error budget anual</div>
    <div style="width:120px;font-size:8px;color:#475569;letter-spacing:.1em;text-transform:uppercase;text-align:right">downtime/ano</div>
  </div>

  <div class="slm-row">
    <div class="slm-slo" style="color:#4ade80">
      <span class="slm-tip">99%<span class="slm-tb">Um nove: 1% de margem. Típico para sistemas internos não críticos. 87,6 horas de downtime anual — dá pra ter 3 dias de manutenção por mês.</span></span>
    </div>
    <div class="slm-bar"><div class="slm-fill" style="width:80%;background:linear-gradient(90deg,#4ade80,#22c55e)"></div></div>
    <div class="slm-down">87h 36m <span class="slm-note">3,65 dias</span></div>
  </div>

  <div class="slm-row">
    <div class="slm-slo" style="color:#a3e635">
      <span class="slm-tip">99,5%<span class="slm-tb">Um nove e meio: comum como SLO inicial de APIs importantes. 43,8 horas/ano = ~2 dias de downtime tolerado. Bom ponto de partida antes de ter dados históricos reais.</span></span>
    </div>
    <div class="slm-bar"><div class="slm-fill" style="width:60%;background:linear-gradient(90deg,#a3e635,#84cc16)"></div></div>
    <div class="slm-down">43h 50m <span class="slm-note">1,83 dias</span></div>
  </div>

  <div class="slm-row">
    <div class="slm-slo" style="color:#fbbf24">
      <span class="slm-tip">99,9%<span class="slm-tb">Três noves: padrão de mercado para serviços de produção. 8,76 horas/ano = apenas 43,8 minutos/mês. Cada deploy com problema pode consumir 5–10% do budget mensal.</span></span>
    </div>
    <div class="slm-bar"><div class="slm-fill" style="width:40%;background:linear-gradient(90deg,#fbbf24,#f59e0b)"></div></div>
    <div class="slm-down">
      <span class="slm-tip" style="color:#fbbf24">8h 45m<span class="slm-tb">Traduz para 43,8 minutos por mês. Burn rate 14 = você esgota esses 43,8 min em apenas 3 dias de degradação contínua.</span></span>
      <span class="slm-note">≈ 44 min/mês</span>
    </div>
  </div>

  <div class="slm-row">
    <div class="slm-slo" style="color:#f97316">
      <span class="slm-tip">99,95%<span class="slm-tb">Três noves e meio: entre três e quatro noves. Exige processos de deploy muito maduros — blue/green, feature flags, automação de rollback. Aproximadamente 4,4h/ano.</span></span>
    </div>
    <div class="slm-bar"><div class="slm-fill" style="width:25%;background:linear-gradient(90deg,#f97316,#ea580c)"></div></div>
    <div class="slm-down">4h 22m <span class="slm-note">≈ 22 min/mês</span></div>
  </div>

  <div class="slm-row">
    <div class="slm-slo" style="color:#ef4444">
      <span class="slm-tip">99,99%<span class="slm-tb">Quatro noves: apenas 52 minutos no ano inteiro. Requer redundância geográfica, zero downtime deployments, chaos engineering e on-call 24/7 muito eficiente. Típico de plataformas de pagamento.</span></span>
    </div>
    <div class="slm-bar"><div class="slm-fill" style="width:12%;background:linear-gradient(90deg,#ef4444,#dc2626)"></div></div>
    <div class="slm-down">52m 35s <span class="slm-note">≈ 4,3 min/mês</span></div>
  </div>

  <div class="slm-row">
    <div class="slm-slo" style="color:#dc2626">
      <span class="slm-tip">99,999%<span class="slm-tb">Cinco noves: menos de 6 minutos por ano. Praticamente impossível de manter em software convencional. Apenas hardware especializado e sistemas com redundância múltipla conseguem. Custo é exponencialmente maior.</span></span>
    </div>
    <div class="slm-bar"><div class="slm-fill" style="width:4%;background:linear-gradient(90deg,#dc2626,#b91c1c)"></div></div>
    <div class="slm-down">5m 15s <span class="slm-note">≈ 26 seg/mês</span></div>
  </div>

  <!-- SLO vs SLA -->
  <div style="margin-top:14px;background:#1e293b;border-radius:8px;padding:12px 14px;border:1px solid rgba(230,82,44,.2)">
    <div style="font-size:9px;color:#E6522C;font-weight:600;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px">Hierarquia de rigor: SLO interno &gt; SLA externo</div>
    <div style="display:flex;align-items:center;gap:6px;font-size:11px;color:#94a3b8;flex-wrap:wrap">
      <div style="background:#0f172a;border:1.5px solid rgba(230,82,44,.5);border-radius:6px;padding:6px 12px;text-align:center">
        <div style="font-size:9px;color:#64748b;margin-bottom:2px">SLO interno</div>
        <div style="color:#E6522C;font-weight:700;font-family:'JetBrains Mono',monospace">99,95%</div>
        <div style="font-size:9px;color:#64748b;margin-top:2px">engenharia age aqui</div>
      </div>
      <div style="color:#334155;font-size:18px">⊃</div>
      <div style="background:#0f172a;border:1.5px solid rgba(251,191,36,.4);border-radius:6px;padding:6px 12px;text-align:center">
        <div style="font-size:9px;color:#64748b;margin-bottom:2px">SLA com cliente</div>
        <div style="color:#fbbf24;font-weight:700;font-family:'JetBrains Mono',monospace">99,9%</div>
        <div style="font-size:9px;color:#64748b;margin-top:2px">contrato + penalidade</div>
      </div>
      <div style="font-size:10px;color:#64748b;flex:1;min-width:120px;line-height:1.5">
        O buffer entre SLO e SLA é a margem de segurança. Se o SLO for violado, você ainda não violou o contrato — tempo para agir.
      </div>
    </div>
  </div>
</div>`,
        caption: "Cada nove a mais reduz 10× o downtime permitido. Assinar um SLA de 99,9% com SLO interno de 99,9% não deixa margem — qualquer incidente vira violação contratual.",
      },
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
        a: "Ação imediata: verificar se o incidente ainda está ativo e conter. Com 80% consumido: 1. Ativar error budget policy — comunicar ao time de produto que qualquer novo deploy precisa passar por revisão extra. 2. Exigir feature flags em todas as mudanças de código para rollback imediato. 3. Priorizar automação de rollback e baterias de smoke test no deploy pipeline. 4. Revisão post-mortem blameless do incidente que consumiu o budget. 5. Se o SLO é sistematicamente inatingível: revisar o SLO (pode estar muito apertado para o estado atual do sistema) em vez de fingir que o número é correto.",
        tip: "Mencionar revisão de SLO quando inatingível mostra maturidade — SLO não é número sagrado.",
        level: "senior",
      },
      {
        q: "Qual a diferença entre alerta baseado em sintoma e alerta baseado em causa?",
        a: "Alerta baseado em sintoma: o que o usuário está sentindo — error rate alto, p99 de latência violado, SLO burn rate acima do threshold. É o que você deve usar para acordar alguém às 3h. Alerta baseado em causa: CPU alta, disco cheio, memória chegando ao limite. Útil para antecipar problemas mas não para acordar o plantão — CPU a 90% pode não estar afetando o usuário. A estratégia correta: page em sintoma (error rate > SLO), ticket em causa (disco em 80%). Se você acorda o time com 'CPU alta' sem impacto no usuário, gera alert fatigue que faz as pessoas ignorarem alertas — incluindo os urgentes. SLO-based alerting é a formalização de 'alerte no sintoma'.",
        tip: "A distinção sintoma vs. causa é o núcleo do Google SRE alerting philosophy — mencionar que você aplica isso em prática diferencia.",
        level: "pleno",
      },
      {
        q: "O que é toil e como SRE mede e limita?",
        a: "Toil é trabalho manual, repetitivo, tático, sem valor duradouro que escala linearmente com o volume do sistema. Exemplos: responder alertas ruidosos manualmente toda semana, fazer deploy na mão, rotacionar certificados com script manual que alguém precisa executar. Não é toil: projetar automação de deploy (escala sub-linearly), criar runbooks (tem valor duradouro), refatorar para reduzir incidentes (reduz futuro toil). SRE deve manter toil abaixo de 50% do tempo. Como medir: log tempo gasto em cada atividade, classifique como toil ou engineering. Como eliminar: automatize o que dispara alerta ruidoso, escreva runbook que seja o último — depois automatize o runbook. Error budget policy indiretamente controla toil: incidentes repetitivos que consomem budget disparam sprint de reliability para eliminar a causa.",
        tip: "Definir com exemplo do que É e do que NÃO É toil mostra que você entendeu a nuance — é um erro comum classificar qualquer trabalho operacional como toil.",
        level: "senior",
      },
      {
        q: "Como você calcularia o burn rate e o tempo restante de error budget?",
        a: "Burn rate = (taxa atual de erro) / (taxa de erro permitida pelo SLO). Com SLO de 99,9%, a taxa de erro permitida é 0,1% (0,001). Se a taxa atual de erro é 1,4% (0,014), o burn rate é 0,014 / 0,001 = 14. Tempo até esgotar o budget: se o burn rate é 14 e o budget é mensal (30 dias), você esgota em 30 / 14 ≈ 2,1 dias. Para saber o budget restante: (budget_total - budget_consumido) / taxa_de_consumo_atual. Em PromQL: job:sli_errors:ratio_rate1h > (14 * 0.001) é o alerta crítico. A beleza do burn rate é ser agnóstico a janela: burn rate 1 é sustentável por definição; qualquer coisa acima de 1 está consumindo o budget; acima de 14 exige ação imediata.",
        tip: "Fazer o cálculo em voz alta (0,014/0,001=14, 30/14=2,1 dias) em entrevista prova que você não só decorou o conceito — você opera com ele.",
        level: "senior",
      },
      {
        q: "O que é SLO de latência e por que proporção de requests é melhor que p99?",
        a: "SLI de latência como proporção: (requests completadas em < 500ms) / total. SLI de latência como p99: o valor bruto do 99º percentil. O problema do p99 bruto como SLI é que não é uma proporção — você não consegue calcular error budget de forma consistente com o budget de disponibilidade. A proporção resolve isso: se seu SLO é '95% das requests em < 500ms', o error budget é 5% de requests que podem exceder 500ms — direto e comparável. Outro problema do p99 bruto: não agrega entre instâncias (Summary não agrega). Use histogram: proportion = requests_no_bucket_500ms / total_requests. Synthetic monitoring complementa: mede a latência que o usuário realmente experimenta, incluindo rede, DNS, TLS — muito mais honesto que métrica server-side.",
        tip: "A explicação de 'por que proporção e não p99 bruto' é a parte que separa quem leu o SRE Book de quem apenas usou Prometheus.",
        level: "senior",
      },
      {
        q: "Como você explica error budget para um time de produto não técnico?",
        a: "Analogia de cartão de crédito: o time tem um 'cartão de crédito de confiabilidade' com um limite mensal. Cada incidente, deploy problemático ou manutenção debita desse cartão. Quando o limite está cheio, o time tem liberdade para lançar features, fazer experimentos e deploys arriscados — está 'pagando com confiabilidade acumulada'. Quando o cartão está no limite, o time precisa 'pagar a fatura' antes de fazer mais gastos — sprint de reliability. Isso transforma a conversa: em vez de SRE dizendo 'não pode fazer deploy', a conversa é 'vocês têm X% de budget restante — esse deploy arrisca esgotar? Qual o plano de rollback?'. O budget torna o tradeoff velocidade vs. confiabilidade explícito, mensurável e compartilhado entre produto e engenharia.",
        tip: "A analogia de cartão de crédito é a que mais funciona na prática com product managers — usar em entrevista mostra que você consegue comunicar conceitos técnicos para stakeholders não técnicos.",
        level: "pleno",
      },
      {
        q: "Como calcular o error budget restante em minutos dado um SLO de 99,9% em janela de 30 dias?",
        a: "<p><strong>Passo 1 — budget total:</strong> 100% − 99,9% = 0,1% de margem. Em 30 dias = 30 × 24 × 60 = 43.200 minutos. Budget total = 0,001 × 43.200 = 43,2 minutos.</p><p><strong>Passo 2 — budget consumido:</strong> meça o SLI real na janela. Se o SLI ficou em 99,85%, o erro real foi 0,15%. Consumido = (0,15% − 0%) × 43.200... não: consumido = (1 − SLI_real) × janela_minutos = 0,0015 × 43.200 = 64,8 minutos.</p><p><strong>Passo 3 — budget restante:</strong> 43,2 − 64,8 = −21,6 minutos → SLO violado.</p><p><strong>Em PromQL:</strong></p><pre style='font-size:9px;color:#94a3b8;background:#1e293b;padding:8px;border-radius:4px;margin-top:6px'># Budget restante em %\n(0.999 - (1 - sli:availability:ratio_30d)) / 0.001 * 100</pre>",
        tip: "Fazer o cálculo passo a passo em voz alta — 0,1% × 43.200 min = 43,2 min — é o que diferencia quem opera SLOs de quem apenas conhece o conceito.",
        level: "senior",
      },
      {
        q: "Explique a fórmula de burn rate e o que significa burn rate 14 em termos de tempo até esgotar o budget.",
        a: "<p><strong>Fórmula:</strong> burn_rate = taxa_erro_atual / taxa_erro_permitida_pelo_SLO.</p><p>Com SLO 99,9%: taxa permitida = 0,001. Se taxa atual = 0,014 (1,4% de erro), então burn_rate = 0,014 / 0,001 = <strong>14</strong>.</p><p><strong>Interpretação:</strong> burn rate 14 significa que você está consumindo o error budget 14× mais rápido do que o esperado. Budget mensal de 30 dias será esgotado em 30 / 14 ≈ 2,1 dias.</p><p><strong>Multi-window:</strong> o SRE Workbook recomenda pares de janelas com AND lógico para evitar falsos positivos:<ul><li>Burn rate 14 × 1h AND burn rate 14 × 5min → page crítico (esgota em 2 dias)</li><li>Burn rate 6 × 6h AND burn rate 6 × 30min → page (esgota em 5 dias)</li><li>Burn rate 3 × 1d AND burn rate 3 × 2h → ticket urgente (esgota em 10 dias)</li><li>Burn rate 1 × 3d AND burn rate 1 × 6h → ticket longo (consumo no ritmo normal)</li></ul></p>",
        tip: "O número mágico 14 vem de: 30 dias / 2 dias = 15; arredondado para 14 com margem. Saber de onde vem o número impressiona em entrevista.",
        level: "senior",
      },
      {
        q: "O que são CUJs (Critical User Journeys) e como mapeá-los em SLIs?",
        a: "<p>CUJ é uma jornada completa que o usuário percorre para atingir um objetivo de negócio. Não é um endpoint isolado — é o fluxo inteiro: login → busca → adicionar ao carrinho → checkout → confirmação de pagamento.</p><p><strong>Por que importa para SLIs:</strong> um SLI de 'API /checkout 200' pode estar verde enquanto o CUJ de checkout está degradado por timeout no serviço de pagamento. O SLI deve medir o que o usuário sente, não o que o servidor reporta.</p><p><strong>Como mapear:</strong><ol><li>Liste os 3–5 CUJs mais críticos com o time de produto (o que o usuário paga para fazer?).</li><li>Para cada CUJ, identifique os serviços envolvidos.</li><li>Defina SLI no ponto mais próximo do usuário — idealmente client-side (RUM) ou synthetic monitoring.</li><li>SLI de CUJ = (jornadas completadas com sucesso e dentro do SLA de latência) / total de tentativas de jornada.</li></ol></p><p><strong>Armadilha comum:</strong> criar SLIs por serviço isolado em vez de por CUJ. Um sistema com 10 microserviços cada um com 99,9% de disponibilidade pode ter CUJ com disponibilidade de 99,9%^10 ≈ 99%.</p>",
        level: "senior",
        tip: "A armadilha da multiplicação de disponibilidades (99,9%^10) é o argumento mais forte para SLIs baseados em CUJ — use em entrevista.",
      },
      {
        q: "Qual a diferença entre synthetic monitoring e real user monitoring (RUM) e quando usar cada um?",
        a: "<p><strong>Synthetic monitoring:</strong> executa scripts automatizados de fora do sistema em intervalos regulares — simula o usuário. Exemplos: Blackbox Exporter do Prometheus, Datadog Synthetics, Pingdom. Vantagens: detecta problemas antes que usuários reais os vejam; funciona mesmo com tráfego zero; controle total do cenário. Desvantagem: não capta variabilidade real de usuários (geografia, dispositivo, rede).</p><p><strong>Real User Monitoring (RUM):</strong> coleta dados de usuários reais via JavaScript no browser ou SDK mobile. Exemplos: Datadog RUM, New Relic Browser, OpenTelemetry browser SDK. Vantagem: dado real de produção — percentis de latência que o usuário de São Paulo em 4G experimenta. Desvantagem: precisa de tráfego para ter dados; mais ruidoso.</p><p><strong>Estratégia combinada:</strong> synthetic para SLI de disponibilidade e alerta precoce (SLO-based alerting), RUM para entender experiência real e calibrar thresholds de SLO. Se synthetic está verde mas RUM mostra degradação → problema de CDN ou regional.</p>",
        level: "pleno",
      },
      {
        q: "Com qual frequência revisar SLOs e o que analisar em cada revisão?",
        a: "<p><strong>Cadência recomendada (Google SRE Workbook):</strong></p><ul><li><strong>Semanal:</strong> operacional — budget consumido na semana, incidentes, burn rate atual. Equipe de plantão + SRE. Ação: ajustar deploys se budget baixo.</li><li><strong>Mensal:</strong> tático — budget consumido no mês, tendências de SLI, comparar com mês anterior. SRE + liderança técnica. Ação: priorizar itens de reliability se tendência negativa.</li><li><strong>Trimestral:</strong> estratégico — o SLO ainda reflete o que o usuário precisa? O target é atingível? O SLA deve ser ajustado? Produto + engenharia + negócio. Ação: revisar targets, renegociar SLAs, definir OKRs de confiabilidade.</li></ul><p><strong>Sinais de que o SLO precisa de ajuste:</strong> sistematicamente violado sem incidentes (target muito agressivo), nunca violado e budget sempre cheio (target conservador demais — oportunidade de aumentar velocity), CUJ mudou (novo fluxo crítico não coberto).</p>",
        level: "pleno",
        tip: "Dizer 'SLO é revisado trimestralmente com produto e negócio' demonstra que você trata SLO como processo vivo — não número gravado em pedra.",
      },
      {
        q: "O que acontece quando o error budget é completamente esgotado?",
        a: "<p>Quando o error budget chega a zero (ou negativo), a error budget policy entra em vigor com impacto direto no roadmap:</p><ol><li><strong>Feature freeze imediata:</strong> nenhum novo deploy de produto sem aprovação explícita do SRE. Mudanças de infraestrutura de emergência podem continuar.</li><li><strong>Sprint de reliability obrigatório:</strong> o time para as features planejadas e dedica o sprint inteiro a reduzir toil, corrigir causas raiz de incidentes, melhorar runbooks e automação.</li><li><strong>Revisão post-mortem blameless:</strong> análise detalhada de todos os incidentes que consumiram o budget — qual % foi deployment, qual foi falha de infraestrutura, qual foi bug de produto.</li><li><strong>Revisão do SLO:</strong> se o budget é esgotado consistentemente mês a mês, o SLO pode estar acima da capacidade real do sistema. É mais honesto ajustar o SLO do que fingir que o target é atingível.</li></ol><p><strong>Por que isso funciona na prática:</strong> sem error budget policy, SRE vira 'polícia de operações' que diz 'não'. Com policy, é o próprio budget que diz 'não' — baseado em dados. A conversa muda de interpessoal para objetiva.</p>",
        level: "pleno",
      },
      {
        q: "Quais são os quatro tipos de SLI definidos pelo Google SRE Book?",
        a: "<p>O SRE Book categoriza SLIs em quatro tipos segundo a natureza do serviço:</p><ol><li><strong>Request-based (availability e latência):</strong> proporção de bons requests. Bom para APIs, serviços síncronos. Ex: (requests 2xx e < 500ms) / total requests.</li><li><strong>Window-based (uptime):</strong> proporção de janelas de tempo onde o serviço estava disponível. Ex: minutos com error rate < 0,1% / total de minutos. Útil quando o serviço é avaliado por períodos de disponibilidade contínua.</li><li><strong>Time-sliced (pipeline e batch):</strong> para sistemas de processamento — proporção de runs completadas com sucesso e dentro do prazo. Ex: jobs de ETL completados em < 1h / total de jobs agendados.</li><li><strong>User-journey (CUJ-based):</strong> proporção de jornadas de usuário completadas com sucesso. A mais alinhada com experiência real mas mais complexa de medir — requer instrumentação de ponta a ponta ou synthetic monitoring de fluxo completo.</li></ol><p><strong>Qual escolher:</strong> comece com request-based (mais fácil de instrumentar com Prometheus). Evolua para CUJ quando tiver múltiplos serviços e precisar refletir experiência real.</p>",
        level: "senior",
        tip: "Poucos candidatos sabem os 4 tipos formais. Nomear 'window-based' e 'time-sliced' — além de request-based — diferencia quem leu o SRE Book de quem leu artigos.",
      },
      {
        q: "Como você diferencia um SLI de disponibilidade de um SLI de latência, e quando usar cada um?",
        a: "<p>Os dois tipos medem dimensões distintas da experiência do usuário:</p><ul><li><strong>SLI de disponibilidade:</strong> proporção de requisições que obtiveram resposta bem-sucedida — (requests com status 2xx ou 3xx) / total de requests. Mede se o serviço <em>respondeu</em>. Use quando falha = erro visível ao usuário (HTTP 5xx, timeout, conexão recusada).</li><li><strong>SLI de latência:</strong> proporção de requisições servidas abaixo de um threshold — ex.: (requests com duração &lt; 300ms) / total. Mede se o serviço respondeu <em>dentro do tempo aceitável</em>. Use quando lentidão = experiência degradada mesmo sem erro explícito.</li></ul><p><strong>Quando combinar:</strong> os dois podem ser combinados em um SLO com lógica AND — um multi-SLI SLO. Exemplo para serviço de pagamento:</p><ul><li>Disponibilidade ≥ 99,95% (requests 2xx e 3xx / total)</li><li>Latência: p95 &lt; 500ms — ou seja, ≥ 95% das requests concluídas em &lt; 500ms</li></ul><p>Se qualquer um dos dois for violado, o SLO é violado. Isso reflete a realidade: um checkout que responde em 8 segundos é tecnicamente 'disponível' mas causa abandono — o SLI de latência captura o que o de disponibilidade não vê.</p>",
        tip: "Entrevista comum: 'como você escolhe o threshold de latência?' — resposta: analise a distribuição histórica, escolha p95 ou p99, e verifique correlação com NPS/satisfação do usuário.",
        level: "pleno",
      },
      {
        q: "O que é toil no contexto de SRE, como quantificá-lo, e qual o nível máximo aceitável segundo o Google SRE Book?",
        a: "<p><strong>Definição formal (SRE Book):</strong> toil é trabalho que possui todas as características a seguir: manual, repetitivo, automatizável, tático (sem valor duradouro) e que escala linearmente com o crescimento do serviço. Basta uma característica estar ausente para não ser toil.</p><p><strong>Exemplos de toil:</strong></p><ul><li>Rotacionar certificados TLS executando script manualmente toda semana</li><li>Responder alerta de disco cheio reiniciando serviço na mão</li><li>Fazer deploy por SSH em vez de pipeline automatizado</li><li>Responder pager que deveria auto-resolver via runbook automatizado</li></ul><p><strong>Exemplos do que NÃO é toil:</strong></p><ul><li>Escrever automação de deploy (elimina toil futuro — valor duradouro)</li><li>Criar runbooks bem estruturados (reduz tempo de resposta a incidentes)</li><li>Refatorar sistema para reduzir incidentes (escala sub-linearmente)</li></ul><p><strong>Como quantificar:</strong> registre tempo gasto em cada atividade operacional e classifique como toil ou trabalho de engenharia. Ferramentas: tickets de on-call, logs de interrupções, planilha de time-tracking semanal. Calcule: toil_% = horas_toil / horas_totais × 100.</p><p><strong>Limite máximo segundo o Google SRE Book: 50% do tempo.</strong> Acima disso, o time não tem capacidade de fazer engenharia de confiabilidade — fica preso no ciclo operacional sem reduzir a causa raiz. Quando toil &gt; 50%, a solução é sprint de reliability ou contratação, não aceitar como normal.</p>",
        tip: "Pergunta de entrevista sênior: 'como você decide o que automatizar primeiro?' — resposta: frequência × tempo por incidente × impacto no usuário.",
        level: "senior",
      },
    ],
    videos: [
      { title: "Google SRE — Art of SLOs Workshop", channel: "Google Cloud Tech", url: "https://www.youtube.com/watch?v=E3ReKuJ8ewA", topic: "Workshop completo de definição e implementação de SLOs", note: "Material oficial do Google SRE — cobre CUJs, SLI design, error budget policy e multi-window alerting" },
      { title: "Liz Fong-Jones — Implementing SLOs in Practice", channel: "Honeycomb", url: "https://www.youtube.com/watch?v=bkX2CGHAkfk", topic: "SLIs e SLOs na perspectiva de observabilidade moderna", note: "Liz Fong-Jones (ex-Google SRE) explica como integrar SLOs com traces e observabilidade baseada em eventos" },
      { title: "Alex Hidalgo — Implementing Service Level Objectives", channel: "USENIX", url: "https://www.youtube.com/watch?v=tEylFyxbDLE", topic: "Palestra baseada no livro 'Implementing SLOs' (O'Reilly)", note: "Autor do livro explica a jornada de definir SLOs em organizações reais, incluindo armadilhas e resistência cultural" },
      { title: "SREcon — SLO Best Practices at Scale", channel: "USENIX SREcon", url: "https://www.youtube.com/watch?v=R14bpSYNsXQ", topic: "SLOs em escala: multi-produto, multi-time, multi-região", note: "Discussão prática de como grandes organizações estruturam SLO programs, error budget policies e revisões trimestrais" },
    ],
    codeExamples: [
      {
        title: "Prometheus: SLI de latência com histogram + recording rules",
        language: "yaml",
        description: "Recording rules para calcular SLI de latência (proporção de requests < 500ms), error budget restante e burn rate em janelas de 1h, 6h e 30d.",
        code: `# prometheus/rules/slo-latencia.yml
groups:
  - name: slo_latencia_recording_rules
    interval: 30s
    rules:
      # SLI de latência: proporção de requests abaixo de 500ms (janela 5m — para alertas rápidos)
      - record: job:sli_latency_good:rate5m
        expr: |
          sum(rate(http_request_duration_seconds_bucket{le="0.5", job="meu-servico"}[5m]))

      - record: job:sli_latency_total:rate5m
        expr: |
          sum(rate(http_request_duration_seconds_count{job="meu-servico"}[5m]))

      - record: job:sli_latency_ratio:rate5m
        expr: |
          job:sli_latency_good:rate5m / job:sli_latency_total:rate5m

      # SLI de latência em janela longa (30d rolling) para cálculo de error budget
      - record: job:sli_latency_ratio:rate30d
        expr: |
          sum(rate(http_request_duration_seconds_bucket{le="0.5", job="meu-servico"}[30d]))
          /
          sum(rate(http_request_duration_seconds_count{job="meu-servico"}[30d]))

      # Error budget restante em % (SLO target: 99,5% das requests < 500ms)
      # Se ratio = 0.994, error = 0.006; permitido = 0.005 → negativo (violado)
      - record: job:slo_error_budget_remaining:ratio
        expr: |
          (0.995 - (1 - job:sli_latency_ratio:rate30d)) / (1 - 0.995) * 100

      # Burn rate em janela de 1h (para multi-window alerting)
      - record: job:sli_latency_error:rate1h
        expr: |
          1 - (
            sum(rate(http_request_duration_seconds_bucket{le="0.5", job="meu-servico"}[1h]))
            /
            sum(rate(http_request_duration_seconds_count{job="meu-servico"}[1h]))
          )

      - record: job:sli_latency_burn_rate:rate1h
        expr: |
          job:sli_latency_error:rate1h / (1 - 0.995)

      # Burn rate em janela de 6h
      - record: job:sli_latency_burn_rate:rate6h
        expr: |
          (1 - (
            sum(rate(http_request_duration_seconds_bucket{le="0.5", job="meu-servico"}[6h]))
            /
            sum(rate(http_request_duration_seconds_count{job="meu-servico"}[6h]))
          )) / (1 - 0.995)`,
      },
      {
        title: "Alertmanager: multi-window burn rate alerts",
        language: "yaml",
        description: "PrometheusRule com os 4 alertas multi-window do SRE Workbook: page crítico (burn 14×), page (burn 6×), ticket urgente (burn 3×), ticket longo (burn 1×). Distinção entre page e ticket via severity.",
        code: `# prometheus/rules/slo-alerts.yml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: slo-multiwindow-burn-rate
  namespace: monitoring
  labels:
    release: kube-prometheus-stack
spec:
  groups:
    - name: slo.burn_rate.alerts
      rules:
        # ── ALERTA 1: Page crítico — burn rate 14× (esgota em ~2 dias) ──────────
        # Janelas: 1h (curta) AND 5m (confirmação) — detecta degradação severa rápida
        - alert: SloBurnRateCritical
          expr: |
            (
              job:sli_latency_burn_rate:rate1h > 14
            ) and (
              job:sli_latency_burn_rate:rate5m > 14
            )
          for: 2m
          labels:
            severity: critical
            action: page
            slo: latencia-p99-500ms
          annotations:
            summary: "SLO burn rate crítico — error budget esgota em ~2 dias"
            description: |
              Burn rate de {{ $value | humanize }}× nas últimas 1h.
              Error budget mensal será esgotado em aproximadamente {{ div 720 $value | humanize }} horas.
            runbook_url: "https://wiki.empresa.com/runbooks/slo-burn-rate-critical"

        # ── ALERTA 2: Page — burn rate 6× (esgota em ~5 dias) ──────────────────
        # Janelas: 6h (curta) AND 30m (confirmação)
        - alert: SloBurnRatePage
          expr: |
            (
              job:sli_latency_burn_rate:rate6h > 6
            ) and (
              job:sli_latency_burn_rate:rate30m > 6
            )
          for: 15m
          labels:
            severity: critical
            action: page
            slo: latencia-p99-500ms
          annotations:
            summary: "SLO burn rate alto — error budget esgota em ~5 dias"
            description: "Burn rate de {{ $value | humanize }}× nas últimas 6h."
            runbook_url: "https://wiki.empresa.com/runbooks/slo-burn-rate-page"

        # ── ALERTA 3: Ticket urgente — burn rate 3× (esgota em ~10 dias) ────────
        # Janelas: 1d AND 2h
        - alert: SloBurnRateTicketUrgent
          expr: |
            (
              job:sli_latency_burn_rate:rate1d > 3
            ) and (
              job:sli_latency_burn_rate:rate2h > 3
            )
          for: 1h
          labels:
            severity: warning
            action: ticket
            slo: latencia-p99-500ms
          annotations:
            summary: "SLO burn rate moderado — criar ticket de reliability"
            description: "Burn rate de {{ $value | humanize }}× nas últimas 24h. Error budget esgota em ~10 dias."

        # ── ALERTA 4: Ticket longo — burn rate 1× (consumo no ritmo exato do SLO)
        # Janelas: 3d AND 6h — detecta degradação gradual e lenta
        - alert: SloBurnRateTicketSlow
          expr: |
            (
              job:sli_latency_burn_rate:rate3d > 1
            ) and (
              job:sli_latency_burn_rate:rate6h > 1
            )
          for: 3h
          labels:
            severity: info
            action: ticket
            slo: latencia-p99-500ms
          annotations:
            summary: "SLO consumindo budget no ritmo exato — investigar tendência"
            description: "Burn rate de {{ $value | humanize }}× nos últimos 3 dias. Nenhuma ação urgente, mas investigar antes do próximo ciclo."`,
      },
      {
        title: "SLO definition as code (OpenSLO)",
        language: "yaml",
        description: "Definição de SLOs usando a especificação OpenSLO — formato agnóstico de vendor que pode ser convertido para Prometheus rules, Datadog SLOs ou Nobl9.",
        code: `# openslo/slos/checkout-service.yaml
# OpenSLO v1 — https://openslo.com/
# Converta para Prometheus rules com: sloth generate -i slos/checkout-service.yaml

apiVersion: openslo/v1
kind: Service
metadata:
  name: checkout-service
  displayName: "Serviço de Checkout"
  annotations:
    team: "plataforma-pagamentos"
    squad: "checkout"
spec:
  description: "Serviço responsável pelo fluxo de pagamento e confirmação de pedidos"

---
apiVersion: openslo/v1
kind: SLI
metadata:
  name: checkout-availability
  displayName: "Disponibilidade do Checkout"
spec:
  description: "Proporção de requisições de checkout completadas com sucesso (status < 500)"
  ratioMetric:
    counter: true
    good:
      metricSource:
        type: Prometheus
        spec:
          query: sum(rate(http_requests_total{job="checkout-service", status!~"5.."}[{{.Window}}]))
    total:
      metricSource:
        type: Prometheus
        spec:
          query: sum(rate(http_requests_total{job="checkout-service"}[{{.Window}}]))

---
apiVersion: openslo/v1
kind: SLI
metadata:
  name: checkout-latency
  displayName: "Latência do Checkout (p95 < 1s)"
spec:
  description: "Proporção de requisições de checkout respondidas em menos de 1 segundo"
  ratioMetric:
    counter: true
    good:
      metricSource:
        type: Prometheus
        spec:
          query: sum(rate(http_request_duration_seconds_bucket{job="checkout-service", le="1.0"}[{{.Window}}]))
    total:
      metricSource:
        type: Prometheus
        spec:
          query: sum(rate(http_request_duration_seconds_count{job="checkout-service"}[{{.Window}}]))

---
apiVersion: openslo/v1
kind: SLO
metadata:
  name: checkout-slo-availability
  displayName: "SLO de Disponibilidade — Checkout"
spec:
  description: "99,9% das requisições de checkout concluídas com sucesso em janela de 30 dias"
  service: checkout-service
  sli:
    metadata:
      name: checkout-availability
  timeWindow:
    - duration: 30d
      isRolling: true
  budgetingMethod: Occurrences
  objectives:
    - displayName: "Alta disponibilidade"
      target: 0.999
  alertPolicies:
    - metadata:
        name: checkout-burn-rate-policy

---
apiVersion: openslo/v1
kind: AlertPolicy
metadata:
  name: checkout-burn-rate-policy
  displayName: "Política de Burn Rate — Checkout"
spec:
  description: "Multi-window alerting seguindo SRE Workbook 14·6·3·1"
  alertWhenNoData: false
  alertWhenResolved: true
  conditions:
    - kind: AlertCondition
      metadata:
        name: burn-rate-critical
      spec:
        description: "Burn rate 14× — esgota budget em 2 dias"
        severity: critical
        condition:
          kind: BurnRate
          threshold: 14
          lookbackWindow: 1h
          alertAfter: 2m
    - kind: AlertCondition
      metadata:
        name: burn-rate-warning
      spec:
        description: "Burn rate 6× — esgota budget em 5 dias"
        severity: warning
        condition:
          kind: BurnRate
          threshold: 6
          lookbackWindow: 6h
          alertAfter: 15m`,
      },
    ],
    mnemonics: [
      {
        label: "SLI-SLO-SLA — do menor para o maior",
        trick: "Indicator → Objective → Agreement (IOA: do interno ao externo)",
        explanation: "SLI é a métrica (o que medimos), SLO é a meta interna (o que perseguimos), SLA é o contrato externo (o que prometemos). Sempre nessa ordem de rigor: SLO mais restritivo que SLA — a diferença é o buffer de segurança antes da violação contratual.",
      },
      {
        label: "Burn rate 14·6·3·1 — os 4 alertas do SRE Workbook",
        trick: "14=2 dias, 6=5 dias, 3=10 dias, 1=consumo exato",
        explanation: "Quatro alertas cobrindo todos os horizontes temporais: 14× (page imediato, esgota em 2 dias), 6× (page secundário, 5 dias), 3× (ticket urgente, 10 dias), 1× (ticket longo, consumo normal). Cada par usa multi-window AND: janela curta detecta, janela longa confirma.",
      },
      {
        label: "SLI bom — PROP (PROPorção de bons eventos)",
        trick: "SLI = bons / total — sempre uma proporção, nunca uma média ou percentil bruto",
        explanation: "SLI válido: (requests com status < 500) / total, (requests < 500ms) / total. SLI inválido: CPU%, memória%, p99 bruto (não é proporção, não dá para calcular error budget). A regra PROP garante que o SLI pode ser integrado ao cálculo de error budget de forma consistente.",
      },
    ],
    resources: [
      { title: "Google SRE Book — SLOs", url: "https://sre.google/sre-book/service-level-objectives/", kind: "livro" },
      { title: "Google SRE Workbook — Implementing SLOs", url: "https://sre.google/workbook/implementing-slos/", kind: "docs" },
      { title: "Google SRE Workbook — Alerting on SLOs (multi-window)", url: "https://sre.google/workbook/alerting-on-slos/", kind: "docs" },
      { title: "Alex Ewerlof — SLO guide", url: "https://alexewerlof.substack.com/", kind: "artigo" },
      { title: "Google — Art of SLOs workshop", url: "https://sre.google/resources/practices-and-processes/art-of-slos/", kind: "pratica" },
      { title: "SLO adoption study — Nobl9", url: "https://nobl9.com/resources/slo-adoption-study/", kind: "artigo" },
    ],
    cheatsheet: {
      title: "SLI/SLO/SLA — referência rápida",
      html: `<style>
.slo1-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:20px}
.slo1-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.slo1-card{background:#1e293b;border-radius:8px;padding:13px;border-left:3px solid #22c55e}
.slo1-card.slo1-slo{border-left-color:#3b82f6}
.slo1-card.slo1-sla{border-left-color:#a855f7}
.slo1-card.slo1-budget{border-left-color:#f59e0b}
.slo1-card.slo1-burn{border-left-color:#ef4444}
.slo1-card.slo1-full{grid-column:1/-1;border-left-color:#06b6d4}
.slo1-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px;color:#22c55e}
.slo1-card.slo1-slo .slo1-title{color:#3b82f6}
.slo1-card.slo1-sla .slo1-title{color:#a855f7}
.slo1-card.slo1-budget .slo1-title{color:#f59e0b}
.slo1-card.slo1-burn .slo1-title{color:#ef4444}
.slo1-card.slo1-full .slo1-title{color:#06b6d4}
.slo1-row{font-size:10px;color:#94a3b8;line-height:1.7;padding:2px 0;border-bottom:1px solid rgba(51,65,85,.4)}
.slo1-row:last-child{border-bottom:none}
.slo1-row code{color:#67e8f9;background:rgba(103,232,249,.08);padding:1px 4px;border-radius:3px;font-size:9.5px}
.slo1-hl{color:#e2e8f0;font-weight:600}
</style>
<div class="slo1-wrap">
  <p style="color:#e2e8f0;font-size:12px;margin:0 0 14px;font-weight:600">SLI / SLO / SLA — referência rápida</p>
  <div class="slo1-grid">
    <div class="slo1-card">
      <div class="slo1-title">SLI — Indicador</div>
      <div class="slo1-row"><span class="slo1-hl">Definição:</span> proporção de bons eventos / total</div>
      <div class="slo1-row"><code>SLI = bons / total</code> — sempre uma razão</div>
      <div class="slo1-row">Disponibilidade: <code>requests_ok / requests_total</code></div>
      <div class="slo1-row">Latência: <code>requests_&lt;500ms / total</code></div>
      <div class="slo1-row">Durabilidade: <code>objetos_intactos / total</code></div>
      <div class="slo1-row">Throughput: <code>tasks_ok / tasks_total</code></div>
      <div class="slo1-row"><span style="color:#f59e0b">Ruim:</span> CPU%, memória% (não é proporção)</div>
    </div>
    <div class="slo1-card slo1-slo">
      <div class="slo1-title">SLO — Objetivo</div>
      <div class="slo1-row"><span class="slo1-hl">Definição:</span> meta interna para o SLI em janela</div>
      <div class="slo1-row">Ex: 99,9% de requests ok em 30 dias</div>
      <div class="slo1-row">Ex: 95% de requests &lt; 500ms em 7 dias</div>
      <div class="slo1-row">Janelas típicas: 7d, 30d, rolling window</div>
      <div class="slo1-row">Deve ser <span class="slo1-hl">mais restritivo</span> que o SLA</div>
      <div class="slo1-row">Comece conservador → aperte com dados históricos</div>
    </div>
    <div class="slo1-card slo1-sla">
      <div class="slo1-title">SLA — Acordo</div>
      <div class="slo1-row"><span class="slo1-hl">Definição:</span> contrato externo com penalidades</div>
      <div class="slo1-row">99,9% = 8,7h downtime/ano = 43,8 min/mês</div>
      <div class="slo1-row">99,95% = 4,4h downtime/ano = 21,9 min/mês</div>
      <div class="slo1-row">99,99% = 52 min downtime/ano = 4,4 min/mês</div>
      <div class="slo1-row">Violação → créditos, reembolso, impacto legal</div>
      <div class="slo1-row">SLA sempre mais frouxo que SLO interno</div>
    </div>
    <div class="slo1-card slo1-budget">
      <div class="slo1-title">Error Budget</div>
      <div class="slo1-row"><code>budget = 100% − SLO_target</code></div>
      <div class="slo1-row">SLO 99,9% → budget 0,1% → ~43 min/mês</div>
      <div class="slo1-row">Budget cheio → velocity máxima (deploys, experimentos)</div>
      <div class="slo1-row">Budget 50% → revisão de deploy pipeline</div>
      <div class="slo1-row">Budget 90% → feature freeze</div>
      <div class="slo1-row">Budget esgotado → sprint de reliability obrigatório</div>
    </div>
    <div class="slo1-card slo1-burn">
      <div class="slo1-title">Burn Rate</div>
      <div class="slo1-row"><code>burn_rate = erro_atual / erro_permitido</code></div>
      <div class="slo1-row">SLO 99,9%: erro_permitido = 0,001</div>
      <div class="slo1-row"><span class="slo1-hl">14×</span> → esgota em 2 dias → page imediato</div>
      <div class="slo1-row"><span class="slo1-hl">6×</span> → esgota em 5 dias → page</div>
      <div class="slo1-row"><span class="slo1-hl">3×</span> → esgota em 10 dias → ticket urgente</div>
      <div class="slo1-row"><span class="slo1-hl">1×</span> → consumo normal → ticket longo</div>
    </div>
    <div class="slo1-card slo1-full">
      <div class="slo1-title">Multi-window Alerting — os 4 alertas (SRE Workbook)</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0">
        <div>
          <div class="slo1-row"><code>burn_1h &gt; 14 × 0,001  AND  burn_5m &gt; 14 × 0,001</code> → <span class="slo1-hl">page</span></div>
          <div class="slo1-row"><code>burn_6h &gt; 6  × 0,001  AND  burn_30m &gt; 6  × 0,001</code> → <span class="slo1-hl">page</span></div>
        </div>
        <div>
          <div class="slo1-row"><code>burn_1d &gt; 3  × 0,001  AND  burn_2h &gt; 3  × 0,001</code> → ticket urgente</div>
          <div class="slo1-row"><code>burn_3d &gt; 1  × 0,001  AND  burn_6h &gt; 1  × 0,001</code> → ticket longo</div>
        </div>
      </div>
    </div>
  </div>
</div>`,
      caption: "Memorize 14·6·3·1 para os burn rates e as proporções de downtime: 99,9% = 43 min/mês, 99,99% = 4,4 min/mês.",
    },
    mindmap: {
      title: "SLIs/SLOs/SLAs — mapa mental",
      html: `<style>
.slo2-wrap{display:flex;flex-direction:column;align-items:center;background:#0a0a0a;padding:2rem;border-radius:1rem;font-family:sans-serif}
.slo2-center{background:#ef4444;color:#fff;padding:.75rem 1.5rem;border-radius:.5rem;font-weight:700;font-size:1.1rem;margin-bottom:1.5rem}
.slo2-branches{display:flex;flex-wrap:wrap;gap:1rem;justify-content:center}
.slo2-branch{background:#1a1a1a;border-radius:.75rem;padding:1rem;min-width:180px;max-width:220px}
.slo2-node{font-weight:600;margin-bottom:.5rem;font-size:.9rem}
.slo2-items{display:flex;flex-direction:column;gap:.25rem}
.slo2-item{color:#ccc;font-size:.8rem;padding:.15rem .3rem;border-left:2px solid #333}
</style>
<div class="slo2-wrap">
  <div class="slo2-center">SLIs / SLOs / SLAs</div>
  <div class="slo2-branches">
    <div class="slo2-branch">
      <div class="slo2-node" style="color:#22c55e">SLI — Métricas</div>
      <div class="slo2-items">
        <span class="slo2-item">Latência (p50, p95, p99)</span>
        <span class="slo2-item">Disponibilidade (error rate)</span>
        <span class="slo2-item">Throughput (req/s)</span>
        <span class="slo2-item">Durabilidade (objetos intactos)</span>
        <span class="slo2-item">Sempre uma proporção: ok/total</span>
      </div>
    </div>
    <div class="slo2-branch">
      <div class="slo2-node" style="color:#3b82f6">SLO — Objetivos</div>
      <div class="slo2-items">
        <span class="slo2-item">Targets internos (ex: 99,9%)</span>
        <span class="slo2-item">Error budget = 100% − SLO</span>
        <span class="slo2-item">Burn rate e consumo</span>
        <span class="slo2-item">Alerting on budget consumption</span>
        <span class="slo2-item">Feature freeze ao esgotar</span>
      </div>
    </div>
    <div class="slo2-branch">
      <div class="slo2-node" style="color:#a855f7">SLA — Contrato</div>
      <div class="slo2-items">
        <span class="slo2-item">Contrato externo com cliente</span>
        <span class="slo2-item">Penalidades por violação</span>
        <span class="slo2-item">Uptime: 99,9% = 8,7h/ano</span>
        <span class="slo2-item">Sempre mais frouxo que SLO</span>
        <span class="slo2-item">Margem de segurança interna</span>
      </div>
    </div>
    <div class="slo2-branch">
      <div class="slo2-node" style="color:#f59e0b">Error Budget</div>
      <div class="slo2-items">
        <span class="slo2-item">Policy: 50% → revisão</span>
        <span class="slo2-item">90% → feature freeze</span>
        <span class="slo2-item">0% → sprint reliability</span>
        <span class="slo2-item">Burn rate 14·6·3·1</span>
        <span class="slo2-item">Multi-window AND alerting</span>
      </div>
    </div>
    <div class="slo2-branch">
      <div class="slo2-node" style="color:#06b6d4">Ferramentas</div>
      <div class="slo2-items">
        <span class="slo2-item">Prometheus + PromQL</span>
        <span class="slo2-item">Grafana dashboards</span>
        <span class="slo2-item">Google SRE Workbook</span>
        <span class="slo2-item">OpenSLO (spec aberto)</span>
        <span class="slo2-item">Nobl9 / Sloth</span>
      </div>
    </div>
  </div>
</div>`,
      caption: "SLI mede, SLO objetiva internamente, SLA compromete externamente. Error budget é o recurso que conecta confiabilidade com velocidade de entrega.",
    },
  }

export default slisSlosSlas


