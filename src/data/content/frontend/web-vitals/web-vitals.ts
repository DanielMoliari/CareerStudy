import type { SkillContent } from '@/types'

const webVitals: SkillContent = {
  tagline: "Métricas do Google para medir UX real: LCP, INP, CLS — Core Web Vitals.",
  why: "Web Vitals afetam ranking SEO e percepção de qualidade. Sênior precisa saber o que cada métrica mede, o que causa regressão e como corrigir — e a diferença entre lab data e field data.",
  summary: "Core Web Vitals são 3 métricas do Google: LCP (Largest Contentful Paint) — velocidade de carregamento percebida, INP (Interaction to Next Paint) — responsividade a interações, CLS (Cumulative Layout Shift) — estabilidade visual. Medidos por field data (usuários reais via CrUX) e lab data (Lighthouse, PageSpeed Insights). INP substituiu FID em março de 2024.",

  keypoints: [
    { title: "LCP — Largest Contentful Paint", body: "Tempo até o maior elemento visível (imagem hero, bloco de texto) ser renderizado. Ideal ≤2.5s. Causas de LCP ruim: render-blocking CSS/JS, servidor lento, imagem grande sem preload, sem CDN. Fix: preload LCP image com <link rel=preload>, otimize TTFB com CDN, converta imagens para WebP/AVIF." },
    { title: "INP — Interaction to Next Paint", body: "Latência da interação mais lenta durante toda a visita (P98). Substitui FID desde março 2024. Ideal ≤200ms. Causas: long tasks no main thread, JS pesado sincronizado, rendering caro após interação. Fix: quebrar long tasks com scheduler.yield(), usar web workers para cálculo pesado, deferir scripts não críticos." },
    { title: "CLS — Cumulative Layout Shift", body: "Soma de shifts inesperados de layout durante a visita. Ideal ≤0.1. Causas: imagens sem dimensão definida, ads ou embeds injetados dinamicamente, fontes web com fallback diferente (FOUT). Fix: sempre defina width/height em imagens, reserve espaço para embeds com min-height, use font-display: optional para fontes críticas." },
    { title: "Lab data vs field data", body: "Lab data (Lighthouse, WebPageTest): condições controladas, reproduzível, bom para debugging. Field data (CrUX via PageSpeed Insights, Search Console): usuários reais com dispositivos e conexões variados. Google usa field data para ranking. Ter boa pontuação no Lighthouse não garante bons Core Web Vitals em produção." },
    { title: "Ferramentas e monitoramento", body: "PageSpeed Insights: field + lab data por URL. Lighthouse: lab data local ou CI. CrUX (Chrome UX Report): field data agregado por origem. web-vitals JS library: medição em produção com envio para analytics. Vercel Speed Insights, DataDog RUM: monitoramento contínuo." },
  ],

  interview: [
    {
      q: "O que são Core Web Vitals e por que importam para um dev frontend?",
      a: "<p>Core Web Vitals são 3 métricas que medem a experiência do usuário em produção: <strong>LCP</strong> (velocidade de carregamento percebida), <strong>INP</strong> (responsividade a interações) e <strong>CLS</strong> (estabilidade visual).</p><p>Importam porque: (1) são fatores de ranking no Google desde 2021 — performance ruim penaliza SEO; (2) refletem problemas reais de UX que causam abandono; (3) são responsabilidade direta do frontend — imagens, fonts, JS pesado, layout instável.</p>",
      tip: "Conectar cada métrica a uma causa que você controla como dev (LCP → imagem sem preload, CLS → imagem sem dimensão) mostra que você entende além das definições.",
      level: "pleno",
    },
    {
      q: "O que causa LCP ruim e como corrigir?",
      a: "<p>Causas mais comuns:<ul><li><strong>Imagem hero sem preload</strong> — o browser descobre a imagem tarde, após parsear HTML e CSS. Fix: <code>&lt;link rel=preload as=image href=hero.webp&gt;</code></li><li><strong>TTFB alto</strong> — servidor lento ou sem CDN. Fix: CDN + cache de resposta</li><li><strong>Imagem não otimizada</strong> — formato JPEG/PNG pesado. Fix: WebP/AVIF + <code>loading=eager</code> no elemento LCP</li><li><strong>Render-blocking scripts no head</strong>. Fix: defer ou async em scripts não críticos</li></ul></p>",
      tip: "Preload do LCP element é a correção mais impactante e menos conhecida. Mencionar isso primeiro mostra que você vai além do óbvio.",
      level: "pleno",
    },
    {
      q: "Por que INP substituiu FID como Core Web Vital?",
      a: "<p><strong>FID</strong> (First Input Delay) media apenas a latência da <em>primeira</em> interação do usuário. <strong>INP</strong> mede a latência da interação mais lenta durante <em>toda a visita</em> (P98).</p><p>INP é mais representativo porque: apps interativos têm muitas interações; usuários percebem lentidão em qualquer momento da sessão; FID era fácil de passar mesmo com interações lentas subsequentes. INP se tornou Core Web Vital oficial em março de 2024.</p>",
      tip: "Mencionar o P98 (percentil 98) é o detalhe que distingue quem realmente estudou INP de quem apenas leu o título.",
      level: "senior",
    },
    {
      q: "O que causa CLS e como você evita em um app React?",
      a: "<p>CLS acontece quando elementos se movem sem interação do usuário. Causas em React:<ul><li><strong>Imagens sem dimensão</strong> — browser não reserva espaço. Fix: defina <code>width/height</code> ou <code>aspect-ratio</code></li><li><strong>Conteúdo assíncrono</strong> empurrando layout. Fix: skeleton com tamanho fixo</li><li><strong>FOUT de fontes web</strong> — texto reflow quando fonte carrega. Fix: <code>font-display: optional</code> ou preload da fonte</li><li><strong>Anúncios ou embeds injetados</strong>. Fix: reserve espaço com <code>min-height</code></li></ul>Next.js Image component resolve automaticamente CLS para imagens.</p>",
      tip: "Citar o Next.js Image como solução automática para CLS mostra que você conhece o ecossistema, não só o problema.",
      level: "pleno",
    },
    {
      q: "Qual a diferença entre lab data e field data?",
      a: "<p><strong>Lab data</strong> (Lighthouse, WebPageTest): condições controladas, conexão simulada, zero usuários reais. Reproduzível — bom para debugging e CI. Não necessariamente representa produção.</p><p><strong>Field data</strong> (CrUX): dados reais de usuários Chrome coletados anonimamente. Inclui variação de dispositivos, conexões, geografias. O Google usa field data para ranking — não lab data.</p><p>Prática: use Lighthouse para identificar problemas e medir regressões em CI. Monitore field data via Search Console e RUM em produção.</p>",
      tip: "A pegadinha frequente: excelente score no Lighthouse local não garante bons CWV no Search Console. Explicar isso revela maturidade.",
      level: "senior",
    },
    {
      q: "Como você monitoraria Core Web Vitals em produção?",
      a: "<p>Abordagem em camadas:<ul><li><strong>web-vitals JS library</strong>: captura LCP, INP, CLS reais de cada usuário e envia para analytics (GA4, Datadog, endpoint próprio)</li><li><strong>Google Search Console</strong>: field data agregado por grupos de URLs — gratuito, delay de 28 dias</li><li><strong>Vercel Speed Insights ou Datadog RUM</strong>: dashboards com percentis por rota em tempo real</li><li><strong>CI com Lighthouse</strong>: bloquear PR se performance regredir abaixo de threshold</li></ul></p>",
      tip: "Mostrar a camada CI (bloquear merge se Lighthouse cair) é o diferencial de sênior — não só medir, mas prevenir regressão.",
      level: "senior",
    },
    {
      q: "Como o LCP é calculado pelo browser?",
      a: "<p>O browser rastreia todos os elementos candidatos a LCP durante o carregamento: <strong>imagens</strong> (<code>&lt;img&gt;</code>, background-image via CSS, <code>&lt;image&gt;</code> em SVG), <strong>blocos de texto</strong> e vídeos com poster. O candidato com maior área visível no viewport no momento em que o usuário interage pela primeira vez (ou a página termina de carregar) é reportado como LCP.</p><p>Importante: o LCP pode mudar durante o carregamento — uma imagem grande que carrega depois pode substituir um bloco de texto anterior como LCP final.</p>",
      tip: "Explicar que o LCP pode mudar durante o carregamento é um detalhe que poucos mencionam e impressiona entrevistadores sênior.",
      level: "senior",
    },
    {
      q: "O que é TTFB e como ele afeta LCP?",
      a: "<p><strong>TTFB</strong> (Time to First Byte) é o tempo desde a requisição até o primeiro byte da resposta do servidor. É a fundação do LCP — um TTFB alto impede que o browser comece a parsear HTML e descobrir recursos.</p><p>Meta ideal: TTFB ≤600ms. Causas de TTFB alto: servidor sem cache, banco lento, sem CDN, cold start de serverless. Fix: CDN para assets estáticos, cache de resposta de API, edge functions para SSR próximo ao usuário.</p>",
      tip: "TTFB é frequentemente ignorado por devs que focam só em otimização de assets. Mencionar que um TTFB alto torna inútil qualquer preload mostra pensamento sistêmico.",
      level: "pleno",
    },
    {
      q: "O que são long tasks e como elas afetam INP?",
      a: "<p>Long tasks são tarefas no main thread que bloqueiam o browser por mais de <strong>50ms</strong>. Durante uma long task, o browser não pode processar eventos do usuário (cliques, teclado) — causando INP alto.</p><p>Como identificar: Chrome DevTools Performance tab mostra long tasks em vermelho. Causas: parsing de JS pesado, operações DOM caras, cálculos síncronos.</p><p>Fix:<ul><li><code>scheduler.yield()</code>: cede o main thread de volta ao browser periodicamente</li><li>Web Workers: move cálculos pesados para thread separada</li><li>Code splitting: reduz JS parseado no carregamento inicial</li></ul></p>",
      tip: "Demonstrar conhecimento sobre scheduler.yield() (API nova) posiciona você na vanguarda das otimizações de INP.",
      level: "senior",
    },
    {
      q: "Como usar a biblioteca web-vitals para medir em produção?",
      a: "<p>A biblioteca <code>web-vitals</code> expõe callbacks para cada métrica:</p><pre><code>import { onCLS, onINP, onLCP } from 'web-vitals'\n\nfunction sendToAnalytics(metric) {\n  fetch('/api/vitals', {\n    method: 'POST',\n    body: JSON.stringify(metric),\n  })\n}\n\nonCLS(sendToAnalytics)\nonINP(sendToAnalytics)\nonLCP(sendToAnalytics)</code></pre><p>O callback recebe <code>{ name, value, delta, id, rating }</code> onde <code>rating</code> é 'good', 'needs-improvement' ou 'poor'. Integração com GA4: usar <code>gtag('event', metric.name, { value, metric_id: metric.id })</code>.</p>",
      tip: "Mostrar o shape exato do objeto métrica (name, value, delta, rating) demonstra uso prático real — não só conhecimento teórico.",
      level: "pleno",
    },
    {
      q: "O que é CrUX e como o Google o usa para ranking?",
      a: "<p><strong>CrUX</strong> (Chrome UX Report) é um dataset público com field data coletado anonimamente de usuários reais do Chrome. Inclui métricas de performance por URL e por origem, segmentado por tipo de dispositivo e conexão.</p><p>O Google usa CrUX para calcular os Core Web Vitals de uma página no Search Console e no Page Experience signal de ranking. Para que uma URL apareça no CrUX, ela precisa ter volume suficiente de visitas (threshold não divulgado, ~1000 visitas/28 dias).</p><p>Implicação: sites com pouco tráfego podem não ter dados suficientes no CrUX e são avaliados com base na origem inteira.</p>",
      tip: "O detalhe de que o Google avalia por URL ou, se não houver dados suficientes, por origem é algo que muitos não sabem e que aparece em auditorias de SEO.",
      level: "senior",
    },
    {
      q: "Como o Next.js ajuda com Core Web Vitals automaticamente?",
      a: "<p>Next.js tem otimizações automáticas para cada CWV:<ul><li><strong>LCP</strong>: <code>next/image</code> com <code>priority</code> prop injeta <code>&lt;link rel=preload&gt;</code> automaticamente; serve WebP/AVIF; lazy loading por padrão para imagens below-the-fold</li><li><strong>CLS</strong>: <code>next/image</code> reserva espaço via <code>width/height</code> ou <code>fill</code> — sem layout shift; <code>next/font</code> usa <code>font-display: optional</code> e elimina FOUT</li><li><strong>INP</strong>: RSC reduz JS enviado ao cliente; Partial Prerendering e streaming reduzem hydration cost</li></ul>Além disso, <code>next/script</code> permite controlar o loading de scripts externos com <code>strategy</code> (beforeInteractive, afterInteractive, lazyOnload).</p>",
      tip: "Conectar cada componente do Next.js (next/image, next/font, next/script) à métrica específica que otimiza é exatamente o que entrevistadores de vagas Next.js querem ouvir.",
      level: "senior",
    },
    {
      q: "Como você otimizaria o LCP de uma página com muitas imagens acima da dobra?",
      a: "<p>Estratégia para LCP com múltiplas imagens:<ul><li>Identificar o candidato LCP real (usar Chrome DevTools → Performance → LCP screenshot)</li><li>Aplicar <code>loading=eager</code> e <code>fetchpriority=high</code> no elemento LCP — todos os outros recebem <code>loading=lazy</code></li><li>Preload explícito: <code>&lt;link rel=preload as=image href=hero.webp&gt;</code></li><li>Servir formato moderno: WebP/AVIF com fallback <code>&lt;picture&gt;</code></li><li>Usar CDN com edge caching — reduz TTFB do asset</li><li>Responsive images: <code>srcset</code> e <code>sizes</code> para servir o tamanho certo por dispositivo</li></ul></p>",
      tip: "O atributo fetchpriority=high é a hint mais poderosa para LCP e ainda é pouco conhecido — mencionar isso destaca o candidato.",
      level: "senior",
    },
    {
      q: "O que é Total Blocking Time e como se relaciona com INP?",
      a: "<p><strong>TBT</strong> (Total Blocking Time) é uma métrica de lab data que mede o tempo total de bloqueio do main thread entre FCP e TTI. Não é um Core Web Vital, mas é um forte proxy para INP em condições de lab (onde INP não pode ser medido sem interação real do usuário).</p><p>Relação: TBT alto correlaciona com INP alto. Um TBT &lt;200ms em Lighthouse sugere INP provavelmente bom em produção. Portanto, otimizar TBT no Lighthouse é uma estratégia válida para melhorar INP em field data.</p>",
      tip: "Entender que TBT é proxy para INP em lab data é um insight de sênior que conecta métricas de ferramentas de debug com métricas de produção.",
      level: "senior",
    },
    {
      q: "Como o CLS é calculado? O que é session window?",
      a: "<p>O CLS não soma <em>todos</em> os shifts da visita — usa o conceito de <strong>session window</strong>: uma janela de tempo onde shifts acontecem próximos uns dos outros (menos de 1 segundo entre shifts, janela máxima de 5 segundos). O CLS final é o valor da session window com maior soma.</p><p>Cada shift individual é calculado como: <code>impact_fraction × distance_fraction</code>, onde impact_fraction é a fração do viewport afetada e distance_fraction é a maior distância relativa que qualquer elemento percorreu.</p><p>Shifts causados por interação do usuário (scroll, click) não contam — apenas shifts inesperados.</p>",
      tip: "O cálculo com session windows é a parte mais técnica do CLS. Mencionar isso — mesmo sem a fórmula exata — demonstra que você leu a especificação.",
      level: "senior",
    },
    {
      q: "Como você abordaria um problema de INP alto em uma lista com filtros?",
      a: "<p>Diagnóstico e fix para INP alto em lista interativa:<ul><li><strong>DevTools</strong>: Performance panel → gravar interação → identificar long task causada pelo evento handler</li><li><strong>Causa comum</strong>: re-render de lista inteira após mudança de filtro — DOM update caro</li><li><strong>Fix 1</strong>: virtualizar a lista com react-window ou @tanstack/virtual — renderiza só os itens visíveis</li><li><strong>Fix 2</strong>: useDeferredValue para adiar atualização de lista enquanto UI responde imediatamente ao input</li><li><strong>Fix 3</strong>: debounce no input para reduzir frequência de re-renders</li><li><strong>Fix 4</strong>: mover filtro para Web Worker se o cálculo for custoso</li></ul></p>",
      tip: "Citar useDeferredValue (React 18) especificamente para INP é o link que conecta conhecimento de React a performance — exatamente o que entrevistadores de frontend sênior querem.",
      level: "senior",
    },
    {
      q: "O que é font-display e qual valor usar para evitar CLS?",
      a: "<p><code>font-display</code> controla como fontes web se comportam enquanto carregam:<ul><li><code>auto</code>: comportamento do browser (geralmente block)</li><li><code>block</code>: texto invisível até fonte carregar (FOIT)</li><li><code>swap</code>: texto visível com fallback imediatamente, depois troca (FOUT — causa CLS)</li><li><code>fallback</code>: pequeno período invisível, depois fallback permanente se fonte demorar</li><li><code>optional</code>: usa a fonte só se já estiver no cache — <strong>melhor para CLS</strong></li></ul>Para zero CLS com fontes: <code>font-display: optional</code> + preload da fonte. Next.js font usa <code>size-adjust</code> CSS para fazer o fallback ter as mesmas métricas da fonte final — eliminando o reflow.</p>",
      tip: "Explicar size-adjust como a técnica do Next.js para font CLS zero é exatamente o tipo de detalhe que diferencia senioridade em frontend.",
      level: "senior",
    },
    {
      q: "Como você configura o Lighthouse em CI para prevenir regressões?",
      a: "<p>Configuração de Lighthouse CI (<code>lighthouseci</code>):<ul><li>Instalar: <code>npm install -g @lhci/cli</code></li><li>Arquivo <code>lighthouserc.js</code> com assertions por categoria e por métrica específica</li><li>No pipeline (GitHub Actions): <code>lhci autorun</code> após build — faz upload de resultados e compara com baseline</li><li>Configurar <code>assert.assertions</code>: <code>'categories:performance': ['warn', { minScore: 0.9 }]</code></li><li>Integração com PR: comentário automático com scores e comparação de regressão</li></ul>Alternativa: Vercel integra Lighthouse automaticamente em cada deploy preview.</p>",
      tip: "Mostrar que você já rodou LHCI em CI (não só Lighthouse local) é a diferença entre quem estudou performance e quem praticou em produção.",
      level: "senior",
    },
    {
      q: "O que é Partial Prerendering e como afeta Core Web Vitals?",
      a: "<p><strong>Partial Prerendering</strong> (PPR) é uma funcionalidade experimental do Next.js 14+ que combina SSG e SSR na mesma rota: o shell estático da página é gerado em build time e servido imediatamente do CDN (melhorando LCP e TTFB), enquanto partes dinâmicas são streamadas conforme ficam prontas.</p><p>Impacto em CWV: o usuário vê o shell (header, layout, texto estático) quase instantaneamente — LCP melhora. O conteúdo dinâmico (dados personalizados) chega via streaming sem bloquear a exibição inicial.</p>",
      tip: "PPR é uma feature de corte em 2024/2025. Mencioná-la em contexto de CWV mostra que você acompanha o ecossistema e não só a teoria.",
      level: "senior",
    },
    {
      q: "Como diferenciar um problema de LCP causado por servidor vs causado por cliente?",
      a: "<p>Usar o waterfall do DevTools Network + Performance panel:<ul><li><strong>Problema de servidor (TTFB alto)</strong>: a barra de request do HTML no Network demora para responder. Solução: CDN, cache, edge rendering</li><li><strong>Problema de rede</strong>: a resposta é rápida mas o download demora — imagem muito grande, sem CDN para assets</li><li><strong>Problema de render-blocking</strong>: TTFB ok, mas LCP demora porque CSS ou scripts bloqueiam o browser de renderizar. Identificar scripts no <code>&lt;head&gt;</code> sem <code>defer/async</code></li><li><strong>Problema de late discovery</strong>: imagem LCP está em CSS ou JS — browser só a descobre após parsear esses recursos. Fix: preload</li></ul></p>",
      tip: "A distinção entre TTFB lento vs late discovery do LCP element é o tipo de diagnóstico prático que demonstra experiência real com debugging de performance.",
      level: "senior",
    },
    {
      q: "O que são as Other Web Vitals (métricas auxiliares) e quando usá-las?",
      a: "<p>Além dos 3 Core Web Vitals, o Google define métricas auxiliares úteis para diagnóstico:<ul><li><strong>FCP</strong> (First Contentful Paint): primeiro conteúdo visível. Bom proxy de TTFB + render-blocking. Meta: ≤1.8s</li><li><strong>TTFB</strong>: fundação de tudo. Meta: ≤800ms</li><li><strong>TTI</strong> (Time to Interactive): quando a página se torna totalmente interativa. Útil para SPAs pesadas</li><li><strong>TBT</strong>: proxy de INP em lab data</li></ul>FCP e TTFB são os primeiros a olhar quando LCP está ruim — o problema geralmente está em uma delas.</p>",
      tip: "Entender que FCP e TTFB são métricas de diagnóstico (não de ranking) enquanto LCP, INP e CLS são as que o Google usa para SEO separa quem estuda de quem pratica.",
      level: "pleno",
    },
    {
      q: "Como você explicaria CLS para um designer que está causando shifts com animações?",
      a: "<p>Animações causam CLS quando movem elementos usando propriedades que trigram layout: <code>top</code>, <code>left</code>, <code>width</code>, <code>height</code>, <code>margin</code>, <code>padding</code>. O browser recalcula o layout inteiro (layout thrashing), e se outros elementos se deslocam, o CLS aumenta.</p><p>Solução: usar apenas <code>transform</code> e <code>opacity</code> para animações — essas propriedades são processadas na GPU sem recalcular layout, portanto <strong>não causam CLS</strong>. Exemplo: ao invés de animar <code>left: 0 → left: 100px</code>, usar <code>transform: translateX(0) → transform: translateX(100px)</code>.</p>",
      tip: "Explicar a diferença entre propriedades de layout vs composite-only (transform/opacity) é o fundamento de animações sem CLS — e uma ótima resposta para perguntas de colaboração com designers.",
      level: "pleno",
    },
  ],

  diagrams: [
    {
      title: "Core Web Vitals — métricas, limites e causas",
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
  <p style="color:#475569;font-size:10px;margin:0 0 16px">Passe o mouse nos termos sublinhados</p>
  <div style="display:flex;gap:10px;margin-bottom:12px">
    <div class="wv-card">
      <div style="font-size:10px;color:#4ade80;font-weight:700;text-transform:uppercase;letter-spacing:.06em">LCP</div>
      <div style="font-size:11px;color:#94a3b8;margin:4px 0">Largest Contentful Paint</div>
      <div class="wv-bar">
        <div style="width:42%;background:#4ade80"></div>
        <div style="width:25%;background:#fb923c"></div>
        <div style="width:33%;background:#ef4444"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:9px;color:#475569"><span style="color:#4ade80">≤2.5s</span><span style="color:#fb923c">≤4s</span><span style="color:#ef4444">&gt;4s</span></div>
      <div style="font-size:10px;color:#64748b;margin-top:8px;line-height:1.6"><span class="wv-tip">Maior elemento<span class="wv-tb">Imagem hero, bloco de texto ou vídeo com poster. Rastreado durante carregamento — pode mudar.</span></span> visível renderizado.<br><strong style="color:#e2e8f0">Fix:</strong> preload, CDN, WebP, fetchpriority</div>
    </div>
    <div class="wv-card">
      <div style="font-size:10px;color:#38bdf8;font-weight:700;text-transform:uppercase;letter-spacing:.06em">INP</div>
      <div style="font-size:11px;color:#94a3b8;margin:4px 0">Interaction to Next Paint</div>
      <div class="wv-bar">
        <div style="width:50%;background:#4ade80"></div>
        <div style="width:25%;background:#fb923c"></div>
        <div style="width:25%;background:#ef4444"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:9px;color:#475569"><span style="color:#4ade80">≤200ms</span><span style="color:#fb923c">≤500ms</span><span style="color:#ef4444">&gt;500ms</span></div>
      <div style="font-size:10px;color:#64748b;margin-top:8px;line-height:1.6"><span class="wv-tip">P98 da visita<span class="wv-tb">Percentil 98 de todas as interações (cliques, teclado, toque). Substituiu FID em março 2024.</span></span> — interação mais lenta.<br><strong style="color:#e2e8f0">Fix:</strong> scheduler.yield(), web workers, code split</div>
    </div>
    <div class="wv-card">
      <div style="font-size:10px;color:#fb923c;font-weight:700;text-transform:uppercase;letter-spacing:.06em">CLS</div>
      <div style="font-size:11px;color:#94a3b8;margin:4px 0">Cumulative Layout Shift</div>
      <div class="wv-bar">
        <div style="width:40%;background:#4ade80"></div>
        <div style="width:25%;background:#fb923c"></div>
        <div style="width:35%;background:#ef4444"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:9px;color:#475569"><span style="color:#4ade80">≤0.1</span><span style="color:#fb923c">≤0.25</span><span style="color:#ef4444">&gt;0.25</span></div>
      <div style="font-size:10px;color:#64748b;margin-top:8px;line-height:1.6"><span class="wv-tip">Session window<span class="wv-tb">Maior janela de shifts próximos (≤1s entre shifts, máx 5s de janela). Shifts por interação do usuário não contam.</span></span> de shifts de layout.<br><strong style="color:#e2e8f0">Fix:</strong> width/height em imgs, skeletons, font-display</div>
    </div>
  </div>
  <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:10px 14px;font-size:11px;color:#475569;line-height:1.8">
    <strong style="color:#94a3b8">Field data vs lab:</strong> Google usa dados reais de usuários Chrome (CrUX) para ranking — não Lighthouse. Lighthouse bom no lab não garante Core Web Vitals bons em produção.
  </div>
</div>`,
      caption: "LCP = velocidade de carregamento percebida, INP = responsividade (substituiu FID em 2024), CLS = estabilidade visual. Google usa field data real para ranking.",
    },
    {
      title: "Fluxo de diagnóstico — por onde começar quando CWV está ruim",
      html: `<style>
.wv2-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.wv2-step{display:flex;gap:12px;margin-bottom:10px;align-items:flex-start}
.wv2-num{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;margin-top:2px}
.wv2-box{background:#1e293b;border-radius:8px;padding:10px 14px;flex:1;border:1px solid #334155}
.wv2-title{font-size:11px;font-weight:700;color:#e2e8f0;margin-bottom:4px}
.wv2-body{font-size:10px;color:#64748b;line-height:1.6}
.wv2-tag{display:inline-block;font-size:9px;padding:1px 6px;border-radius:3px;font-weight:600;margin-right:4px}
</style>
<div class="wv2-wrap">
  <p style="color:#e2e8f0;font-size:12px;font-weight:700;margin:0 0 16px">Diagnóstico de Core Web Vitals — sequência</p>
  <div class="wv2-step">
    <div class="wv2-num" style="background:#1c3a2a;color:#4ade80">1</div>
    <div class="wv2-box">
      <div class="wv2-title">Search Console → Core Web Vitals report</div>
      <div class="wv2-body">Veja quais URLs estão em "Poor" e "Needs Improvement". Agrupa por issue para priorizar. Este é field data real — é o que o Google usa para ranking.</div>
    </div>
  </div>
  <div class="wv2-step">
    <div class="wv2-num" style="background:#0c2a3a;color:#38bdf8">2</div>
    <div class="wv2-box">
      <div class="wv2-title">PageSpeed Insights → identificar métrica problemática</div>
      <div class="wv2-body">Combina field data (CrUX) e lab data (Lighthouse). Mostra qual métrica está falhando e quais oportunidades o Lighthouse sugere. Use a URL específica — não só a origin.</div>
    </div>
  </div>
  <div class="wv2-step">
    <div class="wv2-num" style="background:#2a1a0a;color:#fb923c">3</div>
    <div class="wv2-box">
      <div class="wv2-title">Chrome DevTools → reproduzir e diagnosticar</div>
      <div class="wv2-body"><span class="wv2-tag" style="background:#1c3a2a;color:#4ade80">LCP</span> Performance panel → LCP screenshot → identifica o elemento e a causa do delay<br><span class="wv2-tag" style="background:#0c2a3a;color:#38bdf8">INP</span> Performance panel → gravar interação → identificar long task no handler<br><span class="wv2-tag" style="background:#2a1a0a;color:#fb923c">CLS</span> Layout Shift regions no Performance panel ou PerformanceObserver</div>
    </div>
  </div>
  <div class="wv2-step">
    <div class="wv2-num" style="background:#1e293b;color:#e2e8f0">4</div>
    <div class="wv2-box">
      <div class="wv2-title">Fix → medir novamente → CI</div>
      <div class="wv2-body">Aplique o fix, valide no Lighthouse local. Configure LHCI (Lighthouse CI) no pipeline para bloquear PRs com regressão. Monitore field data via web-vitals library + analytics.</div>
    </div>
  </div>
</div>`,
      caption: "Fluxo: Search Console (field data por URL) → PageSpeed Insights (lab + field) → DevTools (debug específico) → fix → CI prevention.",
    },
    {
      title: "Cheatsheet — causas e fixes dos 3 Core Web Vitals",
      html: `<style>
.wv3-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.wv3-row{display:grid;grid-template-columns:100px 1fr 1fr;gap:8px;margin-bottom:8px;align-items:start}
.wv3-hdr{font-size:9px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:.08em;padding-bottom:6px;border-bottom:1px solid #334155}
.wv3-metric{background:#1e293b;border-radius:6px;padding:8px 10px;font-size:11px;font-weight:700}
.wv3-cell{background:#1e293b;border-radius:6px;padding:8px 10px;font-size:10px;color:#64748b;line-height:1.6}
.wv3-code{background:#0a0f1a;border-radius:4px;padding:2px 5px;font-family:'JetBrains Mono',monospace;font-size:9px;color:#e2e8f0}
</style>
<div class="wv3-wrap">
  <p style="color:#e2e8f0;font-size:12px;font-weight:700;margin:0 0 12px">Causas × Fixes — Core Web Vitals</p>
  <div class="wv3-row">
    <div class="wv3-hdr">Métrica</div>
    <div class="wv3-hdr">Causas principais</div>
    <div class="wv3-hdr">Fixes diretos</div>
  </div>
  <div class="wv3-row">
    <div class="wv3-metric" style="color:#4ade80">LCP<br><span style="font-size:9px;color:#475569">≤2.5s</span></div>
    <div class="wv3-cell">TTFB alto (servidor/CDN); imagem hero sem preload; render-blocking CSS/JS; imagem pesada (JPEG/PNG); late discovery em CSS</div>
    <div class="wv3-cell"><span class="wv3-code">rel=preload as=image</span><br><span class="wv3-code">fetchpriority=high</span><br>CDN + cache de resposta<br>WebP/AVIF com <span class="wv3-code">&lt;picture&gt;</span><br>Remover JS sync do head</div>
  </div>
  <div class="wv3-row">
    <div class="wv3-metric" style="color:#38bdf8">INP<br><span style="font-size:9px;color:#475569">≤200ms</span></div>
    <div class="wv3-cell">Long tasks (&gt;50ms); JS pesado no handler; re-render de lista inteira; terceiros síncronos; layout thrashing</div>
    <div class="wv3-cell"><span class="wv3-code">scheduler.yield()</span><br>Web Workers<br><span class="wv3-code">useDeferredValue</span><br>Virtualização de lista<br>Debounce em inputs</div>
  </div>
  <div class="wv3-row">
    <div class="wv3-metric" style="color:#fb923c">CLS<br><span style="font-size:9px;color:#475569">≤0.1</span></div>
    <div class="wv3-cell">Imagens sem width/height; fontes com FOUT (swap); conteúdo async empurrando layout; ads injetados; animações com top/left</div>
    <div class="wv3-cell"><span class="wv3-code">width height</span> em imgs<br><span class="wv3-code">font-display: optional</span><br>Skeleton com tamanho fixo<br><span class="wv3-code">min-height</span> para embeds<br><span class="wv3-code">transform</span> em animações</div>
  </div>
</div>`,
      caption: "Referência rápida: causas e fixes para cada Core Web Vital. Memorize a associação causa → fix para responder perguntas de entrevista com concretude.",
    },
  ],

  mnemonics: [
    {
      label: "LIC — as 3 métricas Core",
      trick: "LIC: Loading, Interactivity, Cumulative",
      explanation: "L = LCP (Loading percebido — maior elemento visível), I = INP (Interactivity — responsividade a interações), C = CLS (Cumulative layout shift — estabilidade). LIC cobre a experiência do usuário de cima a baixo.",
    },
    {
      label: "FiX para LCP — PCW",
      trick: "PCW: Preload, CDN, WebP",
      explanation: "Os 3 fixes mais impactantes para LCP em ordem de prioridade: P = Preload da imagem LCP com rel=preload + fetchpriority=high; C = CDN para reduzir TTFB; W = WebP/AVIF para reduzir tamanho do asset. Aplique nessa ordem.",
    },
    {
      label: "CLS zero — SFS",
      trick: "SFS: Size, Font, Skeleton",
      explanation: "Três práticas que eliminam CLS: S = Size sempre definido em imagens (width/height ou aspect-ratio); F = Font com font-display:optional para evitar FOUT; S = Skeleton com tamanho fixo para conteúdo assíncrono. SFS = Sem Layout Shift.",
    },
    {
      label: "INP vs FID — visita inteira",
      trick: "INP = Todas as interações, FID = Primeira",
      explanation: "FID media só a primeira interação e foi substituído. INP mede o P98 de TODAS as interações durante toda a visita. Se o usuário clica 100 vezes e 2 interações são lentas, INP é o valor dessas 2 — independente da primeira interação ser rápida.",
    },
    {
      label: "Lab vs Field — rankings",
      trick: "Lighthouse é Lab, Google usa Field",
      explanation: "Lighthouse e WebPageTest são lab data: condições controladas, sem usuários reais. CrUX e Search Console são field data: usuários reais do Chrome. O Google usa FIELD data para ranking SEO. Ter 100 no Lighthouse não garante Core Web Vitals aprovados no Search Console.",
    },
  ],

  cheatsheet: {
    title: "Core Web Vitals — Cheatsheet completo",
    html: `<style>
.wv-cs{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:20px;color:#e2e8f0}
.wv-cs-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:10px}
.wv-cs-col{background:#1e293b;border-radius:8px;padding:12px}
.wv-cs-h{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid #334155}
.wv-cs-row{font-size:10px;color:#94a3b8;margin-bottom:4px;display:flex;gap:6px;align-items:baseline}
.wv-cs-k{color:#e2e8f0;font-weight:600;flex-shrink:0;min-width:60px}
.wv-cs-code{background:#0a0f1a;border-radius:3px;padding:1px 5px;font-size:9px;font-family:'JetBrains Mono',monospace;color:#e2e8f0}
.wv-cs-good{color:#4ade80}.wv-cs-warn{color:#fb923c}.wv-cs-bad{color:#ef4444}
</style>
<div class="wv-cs">
  <div style="font-size:13px;font-weight:700;margin-bottom:12px">Core Web Vitals — Referência Rápida</div>
  <div class="wv-cs-grid">
    <div class="wv-cs-col">
      <div class="wv-cs-h" style="color:#4ade80">LCP — Largest Contentful Paint</div>
      <div class="wv-cs-row"><span class="wv-cs-k wv-cs-good">Bom</span> ≤2.5s</div>
      <div class="wv-cs-row"><span class="wv-cs-k wv-cs-warn">Médio</span> ≤4s</div>
      <div class="wv-cs-row"><span class="wv-cs-k wv-cs-bad">Ruim</span> &gt;4s</div>
      <div style="margin-top:8px;font-size:10px;color:#475569;font-weight:600">Causas</div>
      <div class="wv-cs-row"><span style="color:#64748b">·</span> TTFB alto (sem CDN)</div>
      <div class="wv-cs-row"><span style="color:#64748b">·</span> Imagem hero sem preload</div>
      <div class="wv-cs-row"><span style="color:#64748b">·</span> Render-blocking CSS/JS</div>
      <div class="wv-cs-row"><span style="color:#64748b">·</span> Imagem pesada (JPEG)</div>
      <div style="margin-top:8px;font-size:10px;color:#475569;font-weight:600">Fixes</div>
      <div class="wv-cs-row"><span class="wv-cs-code">rel=preload as=image</span></div>
      <div class="wv-cs-row"><span class="wv-cs-code">fetchpriority=high</span></div>
      <div class="wv-cs-row"><span style="color:#64748b">·</span> CDN + cache</div>
      <div class="wv-cs-row"><span style="color:#64748b">·</span> WebP / AVIF</div>
      <div class="wv-cs-row"><span style="color:#64748b">·</span> next/image priority</div>
    </div>
    <div class="wv-cs-col">
      <div class="wv-cs-h" style="color:#38bdf8">INP — Interaction to Next Paint</div>
      <div class="wv-cs-row"><span class="wv-cs-k wv-cs-good">Bom</span> ≤200ms</div>
      <div class="wv-cs-row"><span class="wv-cs-k wv-cs-warn">Médio</span> ≤500ms</div>
      <div class="wv-cs-row"><span class="wv-cs-k wv-cs-bad">Ruim</span> &gt;500ms</div>
      <div style="margin-top:8px;font-size:10px;color:#475569;font-weight:600">Causas</div>
      <div class="wv-cs-row"><span style="color:#64748b">·</span> Long tasks (&gt;50ms)</div>
      <div class="wv-cs-row"><span style="color:#64748b">·</span> JS pesado no handler</div>
      <div class="wv-cs-row"><span style="color:#64748b">·</span> Re-render de lista inteira</div>
      <div class="wv-cs-row"><span style="color:#64748b">·</span> Layout thrashing</div>
      <div style="margin-top:8px;font-size:10px;color:#475569;font-weight:600">Fixes</div>
      <div class="wv-cs-row"><span class="wv-cs-code">scheduler.yield()</span></div>
      <div class="wv-cs-row"><span style="color:#64748b">·</span> Web Workers</div>
      <div class="wv-cs-row"><span class="wv-cs-code">useDeferredValue</span></div>
      <div class="wv-cs-row"><span style="color:#64748b">·</span> Virtualização de lista</div>
      <div class="wv-cs-row"><span style="color:#64748b">·</span> Debounce em inputs</div>
    </div>
    <div class="wv-cs-col">
      <div class="wv-cs-h" style="color:#fb923c">CLS — Cumulative Layout Shift</div>
      <div class="wv-cs-row"><span class="wv-cs-k wv-cs-good">Bom</span> ≤0.1</div>
      <div class="wv-cs-row"><span class="wv-cs-k wv-cs-warn">Médio</span> ≤0.25</div>
      <div class="wv-cs-row"><span class="wv-cs-k wv-cs-bad">Ruim</span> &gt;0.25</div>
      <div style="margin-top:8px;font-size:10px;color:#475569;font-weight:600">Causas</div>
      <div class="wv-cs-row"><span style="color:#64748b">·</span> Imgs sem width/height</div>
      <div class="wv-cs-row"><span style="color:#64748b">·</span> Fontes FOUT (swap)</div>
      <div class="wv-cs-row"><span style="color:#64748b">·</span> Conteúdo async</div>
      <div class="wv-cs-row"><span style="color:#64748b">·</span> Animações top/left</div>
      <div style="margin-top:8px;font-size:10px;color:#475569;font-weight:600">Fixes</div>
      <div class="wv-cs-row"><span class="wv-cs-code">width height</span> em imgs</div>
      <div class="wv-cs-row"><span class="wv-cs-code">font-display: optional</span></div>
      <div class="wv-cs-row"><span style="color:#64748b">·</span> Skeleton com tamanho fixo</div>
      <div class="wv-cs-row"><span class="wv-cs-code">transform</span> em animações</div>
    </div>
  </div>
  <div style="background:#1e293b;border-radius:8px;padding:10px 14px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
    <div style="font-size:10px;color:#64748b"><strong style="color:#94a3b8">Ferramentas lab:</strong> Lighthouse, WebPageTest, Chrome DevTools</div>
    <div style="font-size:10px;color:#64748b"><strong style="color:#94a3b8">Ferramentas field:</strong> Search Console, PageSpeed Insights, CrUX, web-vitals lib</div>
    <div style="font-size:10px;color:#64748b"><strong style="color:#94a3b8">CI:</strong> LHCI (@lhci/cli), Vercel Speed Insights, Datadog RUM</div>
  </div>
</div>`,
    caption: "Referência densa: limites bom/médio/ruim, causas e fixes para LCP, INP e CLS, mais ferramentas de lab e field.",
  },

  mindmap: {
    title: "Core Web Vitals — Mapa Mental",
    html: `<style>
.wv-mm{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.wv-mm-center{background:#22c55e;color:#052e16;border-radius:10px;padding:8px 18px;font-size:13px;font-weight:700;text-align:center;margin:0 auto 20px;width:fit-content}
.wv-mm-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
.wv-mm-branch{background:#1e293b;border-radius:8px;padding:12px;border-top:3px solid}
.wv-mm-title{font-size:11px;font-weight:700;margin-bottom:8px}
.wv-mm-item{font-size:10px;color:#64748b;margin-bottom:4px;padding-left:10px;position:relative}
.wv-mm-item::before{content:'·';position:absolute;left:0;color:#475569}
.wv-mm-sub{font-size:9px;color:#475569;margin-left:10px;padding-left:8px;position:relative}
.wv-mm-sub::before{content:'→';position:absolute;left:0;color:#334155}
</style>
<div class="wv-mm">
  <div class="wv-mm-center">Core Web Vitals</div>
  <div class="wv-mm-grid">
    <div class="wv-mm-branch" style="border-color:#4ade80">
      <div class="wv-mm-title" style="color:#4ade80">LCP — Loading</div>
      <div class="wv-mm-item">Meta: ≤2.5s</div>
      <div class="wv-mm-item">Elementos candidatos</div>
      <div class="wv-mm-sub">img, background-image, text block</div>
      <div class="wv-mm-item">Causas</div>
      <div class="wv-mm-sub">TTFB, render-blocking, sem preload</div>
      <div class="wv-mm-item">Fixes</div>
      <div class="wv-mm-sub">preload + fetchpriority=high</div>
      <div class="wv-mm-sub">CDN + cache de resposta</div>
      <div class="wv-mm-sub">WebP/AVIF + srcset</div>
    </div>
    <div class="wv-mm-branch" style="border-color:#38bdf8">
      <div class="wv-mm-title" style="color:#38bdf8">INP — Interactivity</div>
      <div class="wv-mm-item">Meta: ≤200ms (P98)</div>
      <div class="wv-mm-item">Substituiu FID (março 2024)</div>
      <div class="wv-mm-item">Causas</div>
      <div class="wv-mm-sub">Long tasks &gt;50ms</div>
      <div class="wv-mm-sub">JS pesado no main thread</div>
      <div class="wv-mm-item">Fixes</div>
      <div class="wv-mm-sub">scheduler.yield()</div>
      <div class="wv-mm-sub">Web Workers</div>
      <div class="wv-mm-sub">useDeferredValue (React 18)</div>
    </div>
    <div class="wv-mm-branch" style="border-color:#fb923c">
      <div class="wv-mm-title" style="color:#fb923c">CLS — Stability</div>
      <div class="wv-mm-item">Meta: ≤0.1 (session window)</div>
      <div class="wv-mm-item">Não conta shifts por interação</div>
      <div class="wv-mm-item">Causas</div>
      <div class="wv-mm-sub">Imgs sem dimensão</div>
      <div class="wv-mm-sub">FOUT de fontes web</div>
      <div class="wv-mm-sub">Conteúdo async empurrando</div>
      <div class="wv-mm-item">Fixes</div>
      <div class="wv-mm-sub">font-display: optional</div>
      <div class="wv-mm-sub">Skeleton com tamanho fixo</div>
    </div>
    <div class="wv-mm-branch" style="border-color:#94a3b8">
      <div class="wv-mm-title" style="color:#94a3b8">Ferramentas de Lab</div>
      <div class="wv-mm-item">Lighthouse (local + CI)</div>
      <div class="wv-mm-item">WebPageTest</div>
      <div class="wv-mm-item">Chrome DevTools Performance</div>
      <div class="wv-mm-item">LHCI — Lighthouse CI</div>
      <div class="wv-mm-sub">Bloqueia PR com regressão</div>
    </div>
    <div class="wv-mm-branch" style="border-color:#a78bfa">
      <div class="wv-mm-title" style="color:#a78bfa">Field Data / Produção</div>
      <div class="wv-mm-item">CrUX — Chrome UX Report</div>
      <div class="wv-mm-item">Search Console CWV report</div>
      <div class="wv-mm-item">PageSpeed Insights</div>
      <div class="wv-mm-item">web-vitals library</div>
      <div class="wv-mm-sub">onLCP, onINP, onCLS callbacks</div>
      <div class="wv-mm-item">Vercel Speed Insights</div>
    </div>
    <div class="wv-mm-branch" style="border-color:#22c55e">
      <div class="wv-mm-title" style="color:#22c55e">Next.js automático</div>
      <div class="wv-mm-item">next/image</div>
      <div class="wv-mm-sub">priority prop → preload LCP</div>
      <div class="wv-mm-sub">WebP/AVIF automático</div>
      <div class="wv-mm-sub">width/height → zero CLS</div>
      <div class="wv-mm-item">next/font</div>
      <div class="wv-mm-sub">font-display: optional</div>
      <div class="wv-mm-sub">size-adjust → zero FOUT</div>
      <div class="wv-mm-item">next/script strategy</div>
    </div>
  </div>
</div>`,
    caption: "Mapa mental completo: LCP (loading), INP (interactividade), CLS (estabilidade), ferramentas de lab, field data e otimizações automáticas do Next.js.",
  },

  exercises: [
    {
      level: "iniciante",
      title: "Auditar uma página pública com PageSpeed Insights",
      description: "Escolha uma página pública (e-commerce, blog, portfólio). Acesse https://pagespeed.web.dev/ e analise os resultados. Identifique qual Core Web Vital está com pior pontuação. Leia as 'Opportunities' sugeridas pelo Lighthouse e escreva um plano de 3 ações para melhorar o LCP.",
      concepts: ["LCP", "CLS", "INP", "lab data", "field data", "PageSpeed Insights"],
    },
    {
      level: "intermediario",
      title: "Instrumentar web-vitals em um projeto Next.js",
      description: "Em um projeto Next.js existente ou de demo, instale a biblioteca `web-vitals`. Crie um arquivo `instrumentation.ts` ou modifique `_app.tsx` para capturar LCP, INP e CLS. Envie as métricas para o console ou para um endpoint `/api/vitals`. Verifique que os valores aparecem ao navegar pela aplicação. Bônus: integrar com Vercel Speed Insights ou GA4.",
      concepts: ["web-vitals library", "onLCP", "onINP", "onCLS", "field data", "RUM", "Next.js"],
    },
    {
      level: "intermediario",
      title: "Corrigir CLS causado por imagens sem dimensão",
      description: "Crie uma página HTML com 5 imagens sem atributos width/height carregadas de URLs externas. Abra o Chrome DevTools, grave uma sessão Performance e observe o CLS. Adicione width/height ou aspect-ratio nas imagens. Grave novamente e compare o CLS. Documente o valor antes e depois.",
      concepts: ["CLS", "layout shift", "imagens sem dimensão", "aspect-ratio", "Chrome DevTools"],
    },
    {
      level: "senior",
      title: "Otimizar INP em uma lista filtrada com React",
      description: "Crie um componente React com uma lista de 1000 itens e um input de filtro. Meça o INP usando a biblioteca web-vitals ao filtrar. Identifique a long task no DevTools Performance. Aplique useDeferredValue para separar a atualização do input da atualização da lista. Compare o INP antes e depois. Como bônus, implemente virtualização com @tanstack/virtual.",
      concepts: ["INP", "long tasks", "useDeferredValue", "virtualização", "React 18", "scheduler.yield"],
    },
    {
      level: "senior",
      title: "Configurar Lighthouse CI no GitHub Actions",
      description: "Configure um workflow GitHub Actions que: (1) faz build do projeto, (2) sobe um servidor local, (3) roda LHCI com `lhci autorun`, (4) falha o workflow se performance cair abaixo de 0.85. Use `lighthouserc.js` com assertions. Configure upload de resultados para o LHCI server ou Vercel. Adicione comentário automático no PR com os scores.",
      concepts: ["Lighthouse CI", "LHCI", "GitHub Actions", "CI/CD", "performance budget", "regressão de performance"],
    },
  ],

  codeExamples: [
    {
      title: "Preload do elemento LCP e fetchpriority",
      language: "html",
      code: `<!-- 1. Preload explícito no <head> — browser descobre a imagem cedo -->
<link rel="preload" as="image" href="/hero.webp" fetchpriority="high">

<!-- 2. Elemento LCP com loading=eager e fetchpriority=high -->
<img
  src="/hero.webp"
  alt="Hero banner"
  width="1200"
  height="600"
  loading="eager"
  fetchpriority="high"
/>

<!-- 3. Todos os outros elementos below-the-fold: lazy -->
<img src="/product.webp" alt="Produto" width="300" height="300" loading="lazy" />

<!-- 4. Em Next.js — priority prop faz preload automaticamente -->
import Image from 'next/image'
<Image src="/hero.webp" alt="Hero" width={1200} height={600} priority />`,
    },
    {
      title: "Instrumentar Core Web Vitals em produção",
      language: "typescript",
      code: `// lib/vitals.ts
import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from 'web-vitals'

function sendToAnalytics(metric: Metric) {
  // Envia para endpoint próprio
  navigator.sendBeacon('/api/vitals', JSON.stringify({
    name: metric.name,          // 'LCP' | 'INP' | 'CLS' | 'FCP' | 'TTFB'
    value: metric.value,        // ms para LCP/INP, score para CLS
    delta: metric.delta,        // variação desde última coleta
    id: metric.id,              // identificador único da sessão
    rating: metric.rating,      // 'good' | 'needs-improvement' | 'poor'
  }))
}

// Registrar todos os CWV + métricas auxiliares
export function registerVitals() {
  onCLS(sendToAnalytics)
  onINP(sendToAnalytics)
  onLCP(sendToAnalytics)
  onFCP(sendToAnalytics)   // auxiliar — diagnóstico de LCP
  onTTFB(sendToAnalytics)  // auxiliar — diagnóstico de TTFB
}

// app/layout.tsx (Next.js) — chamar no carregamento
'use client'
import { useEffect } from 'react'
import { registerVitals } from '@/lib/vitals'

export function ClientSetup() {
  useEffect(() => { registerVitals() }, [])
  return null
}`,
    },
    {
      title: "Corrigir INP com useDeferredValue e scheduler.yield()",
      language: "typescript",
      code: `// Problema: filtrar lista grande bloqueia o main thread → INP alto
'use client'
import { useState, useDeferredValue, useMemo } from 'react'

const ITEMS = Array.from({ length: 5000 }, (_, i) => ({
  id: i,
  name: \`Item \${i}\`,
}))

export function FilterList() {
  const [query, setQuery] = useState('')
  // useDeferredValue: o input atualiza imediatamente (baixo INP)
  // a lista atualiza quando o browser tiver tempo livre
  const deferred = useDeferredValue(query)

  const filtered = useMemo(
    () => ITEMS.filter(item => item.name.includes(deferred)),
    [deferred]
  )

  return (
    <>
      {/* Input responde imediatamente — INP baixo */}
      <input value={query} onChange={e => setQuery(e.target.value)} />
      {/* Lista pode estar um frame atrasada — sem bloquear o main thread */}
      <ul>
        {filtered.map(item => <li key={item.id}>{item.name}</li>)}
      </ul>
    </>
  )
}

// Para long tasks mais severas — scheduler.yield() cede o main thread
async function processLargeDataset(data: number[]) {
  const results: number[] = []
  for (let i = 0; i < data.length; i++) {
    results.push(data[i] * 2)
    // A cada 50 itens, cede o main thread para o browser processar eventos
    if (i % 50 === 0) {
      await scheduler.yield() // disponível no Chrome 115+
    }
  }
  return results
}`,
    },
    {
      title: "Lighthouserc — configuração de CI com assertions",
      language: "javascript",
      code: `// lighthouserc.js — coloque na raiz do projeto
/** @type {import('@lhci/cli').LighthouseConfig} */
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/', 'http://localhost:3000/about'],
      startServerCommand: 'npm run start',
      numberOfRuns: 3, // média de 3 runs para reduzir variabilidade
    },
    assert: {
      assertions: {
        // Core Web Vitals — scores do Lighthouse como proxy
        'categories:performance': ['warn', { minScore: 0.85 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],

        // Métricas específicas — lhci suporta LCP, CLS, TBT (proxy INP)
        'first-contentful-paint': ['warn', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 200 }],
      },
    },
    upload: {
      // Upload para Vercel (gratuito) ou LHCI server próprio
      target: 'temporary-public-storage',
    },
  },
}`,
    },
  ],

  videos: [
    {
      title: "Web Vitals — Full Course by Google",
      channel: "Google Chrome Developers",
      url: "https://www.youtube.com/watch?v=AQqFZ5t8uNc",
      topic: "Core Web Vitals overview",
    },
    {
      title: "Optimize LCP — Google I/O 2023",
      channel: "Google Chrome Developers",
      url: "https://www.youtube.com/watch?v=fWoI9DXmpdk",
      topic: "LCP otimização",
    },
    {
      title: "INP — Interaction to Next Paint Explained",
      channel: "Google Chrome Developers",
      url: "https://www.youtube.com/watch?v=KZ1kxzsJZ5g",
      topic: "INP e long tasks",
    },
    {
      title: "Cumulative Layout Shift in Depth",
      channel: "Google Chrome Developers",
      url: "https://www.youtube.com/watch?v=zIJuY-JCjqw",
      topic: "CLS causas e fixes",
    },
    {
      title: "Lighthouse CI — Automating Performance Budgets",
      channel: "Google Chrome Developers",
      url: "https://www.youtube.com/watch?v=4kLTBHCP0YA",
      topic: "LHCI em pipelines CI",
    },
  ],

  resources: [
    { title: "web.dev — Core Web Vitals", url: "https://web.dev/vitals/", kind: "docs" },
    { title: "web.dev — LCP guide completo", url: "https://web.dev/articles/lcp", kind: "docs" },
    { title: "web.dev — INP guide completo", url: "https://web.dev/articles/inp", kind: "docs" },
    { title: "web.dev — CLS guide completo", url: "https://web.dev/articles/cls", kind: "docs" },
    { title: "PageSpeed Insights", url: "https://pagespeed.web.dev/", kind: "pratica" },
    { title: "Chrome UX Report (CrUX)", url: "https://developer.chrome.com/docs/crux/", kind: "docs" },
    { title: "web-vitals npm library", url: "https://github.com/GoogleChrome/web-vitals", kind: "docs" },
    { title: "Lighthouse CI — @lhci/cli", url: "https://github.com/GoogleChrome/lighthouse-ci", kind: "pratica" },
    { title: "Chrome DevTools — Performance panel", url: "https://developer.chrome.com/docs/devtools/performance/", kind: "docs" },
    { title: "Next.js — Optimizing Images", url: "https://nextjs.org/docs/app/building-your-application/optimizing/images", kind: "docs" },
  ],

  gotchas: [
    "Medir só em lab (Lighthouse) não equivale a field data real. Usuários têm conexões e dispositivos piores — Lighthouse rodando em máquina rápida é otimista.",
    "LCP em SPA pode ser alto porque o browser precisa baixar e executar JS antes de renderizar o conteúdo principal. SSR resolve isso.",
    "CLS afeta acessibilidade: conteúdo se move enquanto o usuário está lendo ou prestes a clicar — cliques vão para o elemento errado.",
    "INP mede P98 — não a média. Se 2 em 100 interações são lentas, INP reflete essas 2, mesmo que as outras 98 sejam rápidas.",
    "font-display: swap parece boa ideia (texto visível logo), mas causa FOUT e CLS. Prefira optional com preload para zero CLS.",
    "fetchpriority=high no LCP image é diferente de loading=eager. Um controla a prioridade de fetch, o outro evita lazy loading. Use ambos no LCP element.",
  ],
}

export default webVitals
