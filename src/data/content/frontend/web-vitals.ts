import type { SkillContent } from '@/types'

const webVitals: SkillContent = {
    tagline: "Métricas do Google para medir UX real: LCP, INP, CLS — Core Web Vitals.",
    why: "Web Vitals afetam ranking SEO e percepção de qualidade. Sênior precisa saber o que cada métrica mede, o que causa regressão e como corrigir — e a diferença entre lab data e field data.",
    summary: "Core Web Vitals são 3 métricas do Google: LCP (Largest Contentful Paint) — velocidade de carregamento percebida, INP (Interaction to Next Paint) — responsividade a interações, CLS (Cumulative Layout Shift) — estabilidade visual. Medidos por field data (usuários reais via CrUX) e lab data (Lighthouse, PageSpeed Insights). INP substituiu FID em março de 2024.",
    keypoints: [
      { title: "LCP — Largest Contentful Paint", body: "Tempo até o maior elemento visível (imagem hero, bloco de texto) ser renderizado. Ideal < 2.5s. Causas de LCP ruim: render-blocking CSS/JS, servidor lento, imagem grande sem preload, sem CDN. Fix: preload LCP image com <link rel=preload>, otimize TTFB com CDN, converta imagens para WebP/AVIF." },
      { title: "INP — Interaction to Next Paint", body: "Latência da interação mais lenta durante toda a visita (P98). Substitui FID desde março 2024. Ideal < 200ms. Causas: long tasks no main thread, JS pesado sincronizado, rendering caro após interação. Fix: quebrar long tasks com scheduler.yield(), usar web workers para cálculo pesado, deferir scripts não críticos." },
      { title: "CLS — Cumulative Layout Shift", body: "Soma de shifts inesperados de layout durante a visita. Ideal < 0.1. Causas: imagens sem dimensão definida, ads ou embeds injetados dinamicamente, fontes web com fallback diferente (FOUT). Fix: sempre defina width/height em imagens, reserve espaço para embeds com min-height, use font-display: optional para fontes críticas." },
      { title: "Lab data vs field data", body: "Lab data (Lighthouse, WebPageTest): condições controladas, reproduzível, bom para debugging. Field data (CrUX via PageSpeed Insights, Search Console): usuários reais com dispositivos e conexões variados. Google usa field data para ranking. Ter boa pontuação no Lighthouse não garante bons Core Web Vitals em produção." },
      { title: "Ferramentas e monitoramento", body: "PageSpeed Insights: field + lab data por URL. Lighthouse: lab data local ou CI. CrUX (Chrome UX Report): field data agregado por origem. web-vitals JS library: medição em produção com envio para analytics. Vercel Speed Insights, DataDog RUM: monitoramento contínuo." },
    ],
    interview: [
      {
        q: "O que são Core Web Vitals e por que importam para um dev frontend?",
        a: "<p>Core Web Vitals são 3 métricas que medem a experiência do usuário em produção: LCP (velocidade de carregamento percebida), INP (responsividade a interações), CLS (estabilidade visual).</p><p>Importam porque: (1) são fatores de ranking no Google desde 2021 — performance ruim penaliza SEO; (2) refletem problemas reais de UX que causam abandono; (3) são responsabilidade direta do frontend — imagens, fonts, JS pesado, layout instável.</p>",
        tip: "Conectar cada métrica a uma causa que você controla como dev (LCP → imagem sem preload, CLS → imagem sem dimensão) mostra que você entende além das definições.",
        level: "pleno",
      },
      {
        q: "O que causa LCP ruim e como corrigir?",
        a: "<p>Causas mais comuns: (1) Imagem hero sem preload — o browser descobre a imagem tarde, após parsear HTML e CSS. Fix: <code>&lt;link rel=preload as=image href=hero.webp&gt;</code>. (2) TTFB alto — servidor lento ou sem CDN. Fix: CDN + cache de resposta. (3) Imagem não otimizada — formato JPEG/PNG pesado. Fix: WebP/AVIF + <code>&lt;img loading=eager&gt;</code> no LCP. (4) Render-blocking scripts no head. Fix: defer ou async em scripts não críticos.</p>",
        tip: "Preload do LCP element é a correção mais impactante e menos conhecida. Mencionar isso primeiro mostra que você vai além do óbvio.",
        level: "pleno",
      },
      {
        q: "Por que INP substituiu FID como Core Web Vital?",
        a: "<p>FID (First Input Delay) media apenas a latência da primeira interação do usuário com a página. INP (Interaction to Next Paint) mede a latência da interação mais lenta durante toda a visita (P98).</p><p>INP é mais representativo porque: apps interativos têm muitas interações, não apenas a primeira; usuários percebem lentidão em qualquer momento da sessão; FID era muito fácil de passar mesmo em apps com interações lentas subsequentes.</p>",
        level: "senior",
      },
      {
        q: "O que causa CLS e como você evita em um app React?",
        a: "<p>CLS acontece quando elementos se movem sem interação do usuário. Causas React: (1) Imagens sem dimensão — o browser não reserva espaço, conteúdo pula quando a imagem carrega. Fix: sempre defina width/height ou use aspect-ratio. (2) Conteúdo carregado assincronamente (dados de API) que empurra conteúdo existente. Fix: skeleton com tamanho fixo. (3) Fontes web — FOUT faz texto reflow. Fix: font-display: optional ou preload da fonte. (4) Next.js Image component resolve automaticamente LCP e CLS para imagens.</p>",
        tip: "Citar o Next.js Image como solução automática para CLS mostra que você conhece o ecossistema, não só o problema.",
        level: "pleno",
      },
      {
        q: "Qual a diferença entre lab data e field data?",
        a: "<p><strong>Lab data</strong> (Lighthouse, WebPageTest): condições controladas, conexão simulada, zero usuários reais. Reproduzível — bom para debugging e CI. Não necessariamente representa produção.</p><p><strong>Field data</strong> (CrUX): dados reais de usuários Chrome coletados anonimamente. Inclui variação de dispositivos, conexões, geografias. O Google usa field data para ranking — não lab data.</p><p>Prática: use Lighthouse para identificar problemas e medir regressões em CI. Monitore field data via Search Console e RUM (Real User Monitoring) em produção.</p>",
        level: "senior",
      },
      {
        q: "Como você monitoraria Core Web Vitals em produção?",
        a: "<p>Abordagem em camadas: (1) <strong>web-vitals JS library</strong>: instala um listener que captura LCP, INP, CLS reais de cada usuário e envia para seu analytics (GA4, Datadog, endpoint próprio). (2) <strong>Google Search Console</strong>: field data agregado por grupos de URLs — gratuito, mas com delay. (3) <strong>Vercel Speed Insights ou Datadog RUM</strong>: dashboards em tempo real com percentis por rota. (4) <strong>CI com Lighthouse</strong>: bloquear PR se performance regredir abaixo de threshold.</p>",
        tip: "Mostrar a camada CI (bloquear merge se Lighthouse cair) é o diferencial de sênior — não só medir, mas prevenir regressão.",
        level: "senior",
      },
    ],
    diagrams: [
      {
        title: "Core Web Vitals — o que cada métrica mede e os limites",
        html: `<style>
.wv-diag{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.wv-card{background:#1e293b;border-radius:10px;padding:14px 16px;flex:1;border:1.5px solid #334155}
.wv-bar{height:8px;border-radius:4px;margin:10px 0 6px;overflow:hidden;display:flex}
.wv-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(255,255,255,.2);display:inline}
.wv-tip:hover .wv-tb{display:block}
.wv-tb{display:none;position:absolute;bottom:calc(100%+8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:200px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.wv-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
</style>
<div class="wv-diag">
  <p style="color:#e2e8f0;font-size:12px;font-weight:700;margin:0 0 4px">Core Web Vitals — métricas e limites</p>
  <p style="color:#475569;font-size:10px;margin:0 0 16px">Passe o mouse nos termos <span style="border-bottom:1px dashed rgba(255,255,255,.2)">sublinhados</span></p>
  <div style="display:flex;gap:10px;margin-bottom:12px">
    <div class="wv-card">
      <div style="font-size:10px;color:#4ade80;font-weight:700;text-transform:uppercase;letter-spacing:.06em">LCP</div>
      <div style="font-size:11px;color:#94a3b8;margin:4px 0">Largest Contentful Paint</div>
      <div class="wv-bar">
        <div style="width:42%;background:#4ade80"></div>
        <div style="width:25%;background:#fb923c"></div>
        <div style="width:33%;background:#ef4444"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:9px;color:#475569"><span style="color:#4ade80">≤2.5s</span><span style="color:#fb923c">≤4s</span><span style="color:#ef4444">>4s</span></div>
      <div style="font-size:10px;color:#64748b;margin-top:8px;line-height:1.6"><span class="wv-tip">Maior elemento<span class="wv-tb">Geralmente a imagem hero ou o maior bloco de texto acima da dobra. O browser rastreia e reporta quando este elemento é pintado.</span></span> visível renderizado.<br><strong style="color:#e2e8f0">Fix:</strong> preload, CDN, WebP</div>
    </div>
    <div class="wv-card">
      <div style="font-size:10px;color:#38bdf8;font-weight:700;text-transform:uppercase;letter-spacing:.06em">INP</div>
      <div style="font-size:11px;color:#94a3b8;margin:4px 0">Interaction to Next Paint</div>
      <div class="wv-bar">
        <div style="width:50%;background:#4ade80"></div>
        <div style="width:25%;background:#fb923c"></div>
        <div style="width:25%;background:#ef4444"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:9px;color:#475569"><span style="color:#4ade80">≤200ms</span><span style="color:#fb923c">≤500ms</span><span style="color:#ef4444">>500ms</span></div>
      <div style="font-size:10px;color:#64748b;margin-top:8px;line-height:1.6"><span class="wv-tip">Interação mais lenta<span class="wv-tb">P98 de todas as interações (cliques, teclado, toque) durante a visita. Substitui FID desde março 2024.</span></span> da visita inteira.<br><strong style="color:#e2e8f0">Fix:</strong> quebrar long tasks, web workers</div>
    </div>
    <div class="wv-card">
      <div style="font-size:10px;color:#fb923c;font-weight:700;text-transform:uppercase;letter-spacing:.06em">CLS</div>
      <div style="font-size:11px;color:#94a3b8;margin:4px 0">Cumulative Layout Shift</div>
      <div class="wv-bar">
        <div style="width:40%;background:#4ade80"></div>
        <div style="width:25%;background:#fb923c"></div>
        <div style="width:35%;background:#ef4444"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:9px;color:#475569"><span style="color:#4ade80">≤0.1</span><span style="color:#fb923c">≤0.25</span><span style="color:#ef4444">>0.25</span></div>
      <div style="font-size:10px;color:#64748b;margin-top:8px;line-height:1.6"><span class="wv-tip">Shifts de layout<span class="wv-tb">Calculado como área do shift × distância percorrida / área do viewport. Soma acumulada de todos os shifts inesperados.</span></span> acumulados na visita.<br><strong style="color:#e2e8f0">Fix:</strong> dimensões em imagens, skeletons</div>
    </div>
  </div>
  <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:10px 14px;font-size:11px;color:#475569;line-height:1.8">
    <strong style="color:#94a3b8">Field data vs lab:</strong> Google usa dados reais de usuários Chrome (CrUX) para ranking — não Lighthouse. Lighthouse bom no lab não garante Core Web Vitals bons em produção.
  </div>
</div>`,
        caption: "LCP = velocidade de carregamento percebida, INP = responsividade (substituiu FID em 2024), CLS = estabilidade visual. Google usa field data real para ranking.",
      },
    ],
    gotchas: [
      "Medir só em lab (Lighthouse) não equivale a field data real. Usuários têm conexões e dispositivos piores — Lighthouse rodando em máquina rápida é otimista.",
      "LCP em SPA pode ser alto porque o browser precisa baixar e executar JS antes de renderizar o conteúdo principal.",
      "CLS afeta acessibilidade: conteúdo se move enquanto o usuário está lendo ou prestes a clicar — cliques vão para o elemento errado.",
    ],
    resources: [
      { title: "web.dev — Core Web Vitals", url: "https://web.dev/vitals/", kind: "docs" },
      { title: "Chrome DevTools — Performance", url: "https://developer.chrome.com/docs/devtools/performance/", kind: "docs" },
      { title: "PageSpeed Insights", url: "https://pagespeed.web.dev/", kind: "pratica" },
    ],
}

export default webVitals
