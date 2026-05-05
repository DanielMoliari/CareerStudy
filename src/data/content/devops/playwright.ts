import type { SkillContent } from '@/types'

const playwright: SkillContent = {
  tagline: "Framework E2E moderno da Microsoft — browser real controlado por API, com auto-waiting embutido e zero flakiness de timing.",
  why: "Playwright virou o padrão de E2E moderno, substituindo Cypress em muitos times. Sênior precisa montar suite estável (sem flakiness), com Page Object Model, fixtures, auth reuso via storageState, network mock e integrar em CI com sharding. Saber a hierarquia de locators e por que auto-waiting funciona diferencia quem realmente usa de quem apenas leu a doc.",
  prerequisite: "JavaScript/TypeScript (async/await), noções de DOM (seletores, accessibility tree), conceitos de CI/CD (pipeline, artifacts). Ter usado algum framework de testes (Jest, Vitest) ajuda a entender a estrutura test/expect.",
  summary: "Playwright roda testes em Chromium, Firefox e WebKit com a mesma API. O diferencial central é o auto-waiting: toda ação (click, fill, navigate) aguarda automaticamente o elemento estar visible, enabled e stable antes de agir — sem sleeps artificiais. Cada teste roda em um browser context isolado (cookies, localStorage, cache separados), o que garante isolamento total sem custo de novo browser. O storageState permite reusar autenticação entre testes: login uma vez no globalSetup, salva state em arquivo, cada teste começa autenticado. O Trace Viewer grava screenshots, snapshots de DOM, network e console de cada passo — debug de flake em CI vira trivial. Para CI, sharding divide a suite entre N máquinas em paralelo. A abordagem de locators prioriza semântica (role, label, text, testId) sobre CSS frágil.",
  howToStudy: "<strong>30 minutos antes de entrevista?</strong> Revise a hierarquia de locators (role &gt; label &gt; text &gt; testId &gt; CSS), o padrão storageState para auth e a diferença de auto-waiting vs Selenium/Cypress. <strong>Fim de semana?</strong> Escreva testes para uma aplicação real: login com storageState, Page Object Model para uma página de formulário e um teste de API com request context. <strong>Uma semana?</strong> Monte uma suite completa em CI com GitHub Actions, sharding entre 4 runners, upload de trace como artifact e relatório HTML.",
  diagrams: [
    {
      title: "Arquitetura do Playwright — como o test runner controla o browser",
      html: `<style>
.pw1-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.pw1-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(46,173,51,.5);display:inline}
.pw1-tip:hover .pw1-tb{display:block}
.pw1-tb{display:none;position:absolute;bottom:calc(100%+8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:230px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.pw1-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.pw1-box{background:#1e293b;border:1.5px solid #334155;border-radius:10px;padding:11px 14px;text-align:center}
.pw1-box.hl{border-color:rgba(46,173,51,.5);background:rgba(46,173,51,.06)}
.pw1-arr{color:#334155;font-size:18px;text-align:center;padding:4px 0}
.pw1-label{font-size:9px;color:#2EAD33;letter-spacing:.1em;font-weight:700;margin-bottom:4px;text-transform:uppercase}
.pw1-name{font-size:11px;color:#e2e8f0;font-weight:600;margin-bottom:3px}
.pw1-desc{font-size:10px;color:#475569;line-height:1.4}
.pw1-badge{font-size:8px;padding:2px 7px;border-radius:10px;font-weight:600;display:inline-block;margin-top:5px}
</style>
<div class="pw1-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Arquitetura Playwright — do test runner ao DOM</p>
<p style="color:#475569;font-size:10px;margin:0 0 16px">Passe o mouse nos termos <span style="border-bottom:1px dashed rgba(46,173,51,.5)">sublinhados</span></p>
<div style="display:flex;gap:8px;align-items:stretch">
  <div class="pw1-box" style="flex:1">
    <div class="pw1-label">Test Runner</div>
    <div class="pw1-name"><span class="pw1-tip">playwright-test<span class="pw1-tb">O test runner do Playwright (@playwright/test). Lê playwright.config.ts, descobre os arquivos .spec.ts e distribui testes entre workers em paralelo. Cada worker é um processo Node separado.</span></span></div>
    <div class="pw1-desc">Lê config, distribui testes entre workers, coleta resultados</div>
    <span class="pw1-badge" style="background:rgba(46,173,51,.1);color:#2EAD33;border:1px solid rgba(46,173,51,.3)">Node.js process</span>
  </div>
  <div style="display:flex;align-items:center;color:#334155;font-size:20px">→</div>
  <div class="pw1-box" style="flex:1">
    <div class="pw1-label">Browser Process</div>
    <div class="pw1-name"><span class="pw1-tip">Chromium/Firefox/WebKit<span class="pw1-tb">Playwright instala browsers próprios (não usa os do sistema) para garantir versão consistente. Os browsers ficam em ~/.cache/ms-playwright/. Em CI, instale com npx playwright install --with-deps.</span></span></div>
    <div class="pw1-desc">Browser real instalado pelo Playwright, versão fixa e determinística</div>
    <span class="pw1-badge" style="background:rgba(250,204,21,.08);color:#facc15;border:1px solid rgba(250,204,21,.2)">browser binário</span>
  </div>
  <div style="display:flex;align-items:center;color:#334155;font-size:20px">→</div>
  <div class="pw1-box hl" style="flex:1">
    <div class="pw1-label">BrowserContext</div>
    <div class="pw1-name"><span class="pw1-tip">Contexto isolado<span class="pw1-tb">Cada teste cria um novo BrowserContext automaticamente — cookies, localStorage, cache, service workers são isolados. É como uma janela anônima dedicada por teste. Rápido: não recria o processo browser, só o estado.</span></span></div>
    <div class="pw1-desc">Isolamento por teste: cookies, localStorage, rede separados</div>
    <span class="pw1-badge" style="background:rgba(46,173,51,.1);color:#2EAD33;border:1px solid rgba(46,173,51,.3)">por teste</span>
  </div>
  <div style="display:flex;align-items:center;color:#334155;font-size:20px">→</div>
  <div class="pw1-box" style="flex:1">
    <div class="pw1-label">Page + Locators</div>
    <div class="pw1-name"><span class="pw1-tip">page.getByRole<span class="pw1-tb">Locators são lazy: não buscam o elemento na hora da criação — só buscam quando uma ação é executada (click, fill, expect). Isso habilita o auto-waiting: Playwright tenta até o elemento existir e estar interagível.</span></span></div>
    <div class="pw1-desc">page.getByRole / getByLabel / getByText — auto-wait embutido</div>
    <span class="pw1-badge" style="background:rgba(96,165,250,.08);color:#60a5fa;border:1px solid rgba(96,165,250,.2)">CDP/WebSocket</span>
  </div>
</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px;padding-top:12px;border-top:1px solid #1e293b">
  <div style="background:#1e293b;border-radius:8px;padding:9px 11px">
    <div style="font-size:10px;color:#2EAD33;font-weight:700;margin-bottom:4px">Auto-waiting — como funciona</div>
    <div style="font-size:9px;color:#475569;line-height:1.7">1. Localiza o elemento no DOM<br>2. Aguarda: visible + enabled + stable (sem animação)<br>3. Rola para deixar visível se necessário<br>4. Executa a ação (click, fill, etc.)<br>Timeout padrão: 30s configurável por ação</div>
  </div>
  <div style="background:#1e293b;border-radius:8px;padding:9px 11px">
    <div style="font-size:10px;color:#ef4444;font-weight:700;margin-bottom:4px">Anti-patterns de timing</div>
    <div style="font-size:9px;color:#475569;line-height:1.7">❌ page.waitForTimeout(2000) — sleep arbitrário<br>❌ await page.click() sem esperar navegação<br>✓ await page.waitForURL('/dashboard')<br>✓ await expect(locator).toBeVisible()<br>✓ await page.waitForLoadState('networkidle')</div>
  </div>
</div>
</div>`,
      caption: "O Playwright controla browsers reais via CDP (Chromium) ou protocolos nativos (Firefox, WebKit). O BrowserContext é criado e destruído por teste — isolamento rápido sem overhead de processo.",
    },
    {
      title: "Page Object Model — estrutura de diretórios e padrão de fixtures",
      html: `<style>
.pw2-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.pw2-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(46,173,51,.5);display:inline}
.pw2-tip:hover .pw2-tb{display:block}
.pw2-tb{display:none;position:absolute;bottom:calc(100%+8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:230px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.pw2-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.pw2-dir{background:#0d1829;border:1px solid #1e293b;border-radius:8px;padding:12px 14px;font-size:10px;color:#64748b;line-height:1.9;flex:1}
.pw2-file{color:#94a3b8}
.pw2-page{color:#2EAD33}
.pw2-fix{color:#60a5fa}
.pw2-test{color:#facc15}
.pw2-cm{color:#334155}
.pw2-code{background:#1e293b;border-radius:8px;padding:12px 14px;font-size:10px;color:#64748b;line-height:1.7;flex:1}
</style>
<div class="pw2-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Page Object Model — estrutura recomendada</p>
<p style="color:#475569;font-size:10px;margin:0 0 16px">POM encapsula seletores e ações — os testes ficam limpos e legíveis</p>
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div class="pw2-dir">
    <div style="color:#2EAD33;font-weight:700;margin-bottom:8px;font-size:11px">Estrutura de diretórios</div>
    tests/<br>
    &nbsp;&nbsp;<span class="pw2-page">pages/</span>             <span class="pw2-cm">← Page Objects</span><br>
    &nbsp;&nbsp;&nbsp;&nbsp;<span class="pw2-page">login.page.ts</span><br>
    &nbsp;&nbsp;&nbsp;&nbsp;<span class="pw2-page">dashboard.page.ts</span><br>
    &nbsp;&nbsp;&nbsp;&nbsp;<span class="pw2-page">checkout.page.ts</span><br>
    &nbsp;&nbsp;<span class="pw2-fix">fixtures/</span>          <span class="pw2-cm">← setup compartilhado</span><br>
    &nbsp;&nbsp;&nbsp;&nbsp;<span class="pw2-fix">test.fixtures.ts</span><br>
    &nbsp;&nbsp;<span class="pw2-test">e2e/</span>               <span class="pw2-cm">← specs por feature</span><br>
    &nbsp;&nbsp;&nbsp;&nbsp;<span class="pw2-test">login.spec.ts</span><br>
    &nbsp;&nbsp;&nbsp;&nbsp;<span class="pw2-test">checkout.spec.ts</span><br>
    &nbsp;&nbsp;<span class="pw2-file">auth/</span><br>
    &nbsp;&nbsp;&nbsp;&nbsp;<span class="pw2-file">auth.json</span>      <span class="pw2-cm">← storageState</span><br>
    playwright.config.ts<br>
    global-setup.ts
  </div>
  <div class="pw2-code" style="flex:2">
    <div style="color:#2EAD33;font-weight:700;margin-bottom:8px;font-size:11px">login.page.ts — Page Object</div>
    <span style="color:#60a5fa">import</span> { type Page, type Locator } <span style="color:#60a5fa">from</span> <span style="color:#4ade80">'@playwright/test'</span><br><br>
    <span style="color:#60a5fa">export class</span> <span style="color:#e2e8f0">LoginPage</span> {<br>
    &nbsp;&nbsp;<span class="pw2-tip">private<span class="pw2-tb">Locators são privados — o teste não acessa seletores diretamente. Isso centraliza mudanças: se o botão mudar de role, só o Page Object muda.</span></span> <span style="color:#e2e8f0">emailInput</span>: <span style="color:#60a5fa">Locator</span><br>
    &nbsp;&nbsp;<span style="color:#60a5fa">private</span> <span style="color:#e2e8f0">passwordInput</span>: <span style="color:#60a5fa">Locator</span><br>
    &nbsp;&nbsp;<span style="color:#60a5fa">private</span> <span style="color:#e2e8f0">submitBtn</span>: <span style="color:#60a5fa">Locator</span><br><br>
    &nbsp;&nbsp;<span style="color:#60a5fa">constructor</span>(<span style="color:#60a5fa">private</span> page: <span style="color:#60a5fa">Page</span>) {<br>
    &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#60a5fa">this</span>.emailInput = page.<span class="pw2-tip">getByLabel<span class="pw2-tb">Locators semânticos são preferidos: getByLabel usa o label HTML associado ao input — resiliente a refactoring visual. Se o label sumir, o teste quebra por razão correta (accessibility regression).</span></span>(<span style="color:#4ade80">'Email'</span>)<br>
    &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#60a5fa">this</span>.passwordInput = page.getByLabel(<span style="color:#4ade80">'Senha'</span>)<br>
    &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#60a5fa">this</span>.submitBtn = page.getByRole(<span style="color:#4ade80">'button'</span>, { name: <span style="color:#4ade80">'Entrar'</span> })<br>
    &nbsp;&nbsp;}<br><br>
    &nbsp;&nbsp;<span style="color:#60a5fa">async</span> goto() { <span style="color:#60a5fa">await this</span>.page.goto(<span style="color:#4ade80">'/login'</span>) }<br><br>
    &nbsp;&nbsp;<span style="color:#60a5fa">async</span> login(email: <span style="color:#60a5fa">string</span>, pw: <span style="color:#60a5fa">string</span>) {<br>
    &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#60a5fa">await this</span>.emailInput.fill(email)<br>
    &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#60a5fa">await this</span>.passwordInput.fill(pw)<br>
    &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#60a5fa">await this</span>.submitBtn.click()<br>
    &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#60a5fa">await this</span>.page.waitForURL(<span style="color:#4ade80">'/dashboard'</span>)<br>
    &nbsp;&nbsp;}<br>
    }
  </div>
</div>
<div style="background:#1e293b;border-radius:8px;padding:10px 12px;margin-top:12px;font-size:10px;color:#475569;line-height:1.6">
  <span style="color:#e2e8f0;font-weight:600">Princípio do POM:</span> o spec descreve <em>o que</em> testar. O Page Object descreve <em>como</em> interagir. Se o seletor mudar, só o Page Object muda — todos os specs continuam passando sem tocar em um.
</div>
</div>`,
      caption: "Page Object Model centraliza seletores e interações por página. O spec fica legível como documentação. Mudanças visuais exigem atualização em um único lugar.",
    },
    {
      title: "Pipeline CI com Playwright — do checkout ao artifact de trace",
      html: `<style>
.pw3-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.pw3-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(46,173,51,.5);display:inline}
.pw3-tip:hover .pw3-tb{display:block}
.pw3-tb{display:none;position:absolute;bottom:calc(100%+8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:230px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.pw3-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.pw3-step{background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:9px 12px;flex:1;min-width:90px}
.pw3-step-title{font-size:9px;color:#2EAD33;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:5px}
.pw3-step-body{font-size:9px;color:#475569;line-height:1.5}
.pw3-arr{color:#334155;font-size:20px;display:flex;align-items:center;flex-shrink:0}
.pw3-yaml{background:#0d1829;border:1px solid #1e293b;border-radius:8px;padding:12px 14px;font-size:9.5px;color:#64748b;line-height:1.9}
.pw3-kw{color:#2EAD33}
.pw3-str{color:#4ade80}
.pw3-cm{color:#334155}
</style>
<div class="pw3-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Pipeline CI Playwright — GitHub Actions com sharding</p>
<p style="color:#475569;font-size:10px;margin:0 0 14px">Suite de 40min dividida em 4 shards paralelos → ~12min total</p>
<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:16px">
  <div class="pw3-step">
    <div class="pw3-step-title">① checkout</div>
    <div class="pw3-step-body">actions/checkout@v4<br>código da aplicação</div>
  </div>
  <div class="pw3-arr">→</div>
  <div class="pw3-step">
    <div class="pw3-step-title">② setup node</div>
    <div class="pw3-step-body">Node 20 LTS<br>cache: npm</div>
  </div>
  <div class="pw3-arr">→</div>
  <div class="pw3-step">
    <div class="pw3-step-title">③ <span class="pw3-tip">cache browsers<span class="pw3-tb">Os browsers do Playwright (~400MB) ficam em ~/.cache/ms-playwright. Cacheá-los reduz o setup de 2min para 15s em runs subsequentes. A chave inclui a versão do @playwright/test para invalidar quando atualizar.</span></span></div>
    <div class="pw3-step-body">key: playwright-<br>$&#123;&#123; hashFiles('**/package-lock.json') &#125;&#125;</div>
  </div>
  <div class="pw3-arr">→</div>
  <div class="pw3-step">
    <div class="pw3-step-title">④ install</div>
    <div class="pw3-step-body">npm ci<br>playwright install --with-deps</div>
  </div>
  <div class="pw3-arr">→</div>
  <div class="pw3-step" style="border-color:rgba(46,173,51,.4);background:rgba(46,173,51,.05)">
    <div class="pw3-step-title" style="color:#2EAD33">⑤ test (shard)</div>
    <div class="pw3-step-body">--shard=$&#123;&#123; matrix.shardIndex &#125;&#125;/<br>$&#123;&#123; matrix.shardTotal &#125;&#125;<br>--trace on-first-retry</div>
  </div>
  <div class="pw3-arr">→</div>
  <div class="pw3-step">
    <div class="pw3-step-title">⑥ upload trace</div>
    <div class="pw3-step-body">actions/upload-artifact<br>playwright-report/<br>test-results/</div>
  </div>
</div>
<div class="pw3-yaml">
  <span class="pw3-cm"># .github/workflows/playwright.yml (trecho)</span><br>
  <span class="pw3-kw">jobs</span>:<br>
  &nbsp;&nbsp;<span class="pw3-kw">test</span>:<br>
  &nbsp;&nbsp;&nbsp;&nbsp;<span class="pw3-kw">strategy</span>:<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="pw3-kw">matrix</span>:<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="pw3-kw">shardIndex</span>: [1, 2, 3, 4]<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="pw3-kw">shardTotal</span>: [4]<br>
  &nbsp;&nbsp;&nbsp;&nbsp;<span class="pw3-kw">steps</span>:<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="pw3-kw">- uses</span>: <span class="pw3-str">actions/cache@v4</span><br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="pw3-kw">with</span>:<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="pw3-kw">path</span>: <span class="pw3-str">~/.cache/ms-playwright</span><br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="pw3-kw">key</span>: <span class="pw3-str">playwright-$&#123;&#123; hashFiles('**/package-lock.json') &#125;&#125;</span><br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="pw3-kw">- run</span>: <span class="pw3-str">npx playwright test --shard=$&#123;&#123; matrix.shardIndex &#125;&#125;/$&#123;&#123; matrix.shardTotal &#125;&#125;</span><br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="pw3-kw">- uses</span>: <span class="pw3-str">actions/upload-artifact@v4</span><br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="pw3-kw">if</span>: <span class="pw3-str">always()</span>  <span class="pw3-cm"># upload mesmo se falhar</span><br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="pw3-kw">with</span>:<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="pw3-kw">name</span>: <span class="pw3-str">playwright-report-$&#123;&#123; matrix.shardIndex &#125;&#125;</span><br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="pw3-kw">path</span>: <span class="pw3-str">playwright-report/</span>
</div>
</div>`,
      caption: "Com sharding em 4 runners paralelos, uma suite de 40min cai para ~12min. O trace é sempre enviado como artifact — inclusive em falha — para debug imediato no Trace Viewer.",
    },
  ],
  keypoints: [
    { title: "Auto-waiting — como funciona internamente", body: "Toda action (click, fill, navigate) usa um loop de retry até o elemento estar: visible (no DOM e com visibility != hidden), enabled (não disabled), stable (sem animação em curso) e dentro do viewport. O timeout padrão é 30s por ação, configurável globalmente ou por call. Você quase nunca precisa de waitFor explícito — se precisar, é sinal de que a condição deveria ser modelada como assertion.", code: `// ✓ Auto-wait: Playwright espera botão aparecer
await page.getByRole('button', { name: 'Enviar' }).click()

// ✓ Expect com retry automático (polling por até 5s)
await expect(page.getByText('Pedido criado')).toBeVisible()

// ✗ Anti-pattern: sleep arbitrário
await page.waitForTimeout(2000)  // nunca use isto

// ✓ Para navegação: espere a URL
await page.waitForURL('/confirmacao')` },
    { title: "Hierarquia de locators — prioridade RLTC", body: "Playwright recomenda locators por ordem de preferência: Role (getByRole) → Label (getByLabel) → Text (getByText) → TestId (getByTestId) → CSS/XPath (último recurso). Locators semânticos são resilientes a refactoring visual — se a estrutura mudar mas o comportamento continuar igual, o teste continua passando.", code: `// 1. Role (ARIA) — melhor opção
page.getByRole('button', { name: 'Submeter' })
page.getByRole('textbox', { name: 'Email' })

// 2. Label — para inputs de formulário
page.getByLabel('Endereço de e-mail')

// 3. Text — para conteúdo estático
page.getByText('Bem-vindo, Ana')

// 4. TestId — quando semântica não está disponível
page.getByTestId('submit-button')  // data-testid="submit-button"

// 5. CSS/XPath — último recurso, frágil
page.locator('.btn-primary')       // evite` },
    { title: "storageState — reusar autenticação entre testes", body: "Login é caro: abre página, preenche form, espera redirect. Com storageState, você loga uma vez no globalSetup, salva cookies/localStorage em auth.json, e cada teste começa já autenticado em milissegundos. Para múltiplos perfis (admin, user, guest), gere arquivos separados e use via fixture baseada em role.", code: `// global-setup.ts
import { chromium, type FullConfig } from '@playwright/test'

export default async function globalSetup(config: FullConfig) {
const browser = await chromium.launch()
const page = await browser.newPage()
await page.goto('https://app.example.com/login')
await page.getByLabel('Email').fill('admin@example.com')
await page.getByLabel('Senha').fill('secret')
await page.getByRole('button', { name: 'Entrar' }).click()
await page.waitForURL('/dashboard')
// Salva cookies + localStorage — todo teste reusa
await page.context().storageState({ path: 'auth/auth.json' })
await browser.close()
}

// playwright.config.ts
export default defineConfig({
globalSetup: './global-setup',
use: { storageState: 'auth/auth.json' },
})` },
    { title: "Fixtures — setup/teardown compartilhado entre testes", body: "Fixtures extendem o test base do Playwright com setup e teardown automáticos. São injetadas por parâmetro de nome — Playwright instancia na hora certa. Fixtures de 'scope: worker' rodam uma vez por worker (banco, servidor). Fixtures de 'scope: test' rodam por teste (Page Object, dados).", code: `// tests/fixtures/test.fixtures.ts
import { test as base } from '@playwright/test'
import { LoginPage } from '../pages/login.page'

type Fixtures = { loginPage: LoginPage }

export const test = base.extend<Fixtures>({
loginPage: async ({ page }, use) => {
  const lp = new LoginPage(page)
  await lp.goto()
  await use(lp)        // disponível durante o teste
  // cleanup automático após o teste se necessário
},
})

// tests/e2e/login.spec.ts — limpo, sem setup boilerplate
import { test, expect } from '../fixtures/test.fixtures'

test('login com credenciais válidas', async ({ loginPage, page }) => {
await loginPage.login('user@example.com', 'senha123')
await expect(page).toHaveURL('/dashboard')
})` },
    { title: "Network mocking — page.route()", body: "Intercepte requisições para testar cenários difíceis de reproduzir: erro 500 da API, timeout, resposta lenta, dados específicos. page.route() captura antes de chegar ao servidor. Útil para isolar o frontend de instabilidade do backend em testes E2E.", code: `// Mock de erro 500 na API
await page.route('**/api/orders', route =>
route.fulfill({ status: 500, body: JSON.stringify({ error: 'Internal Server Error' }) })
)

// Mock de resposta customizada
await page.route('**/api/users/me', route =>
route.fulfill({
  status: 200,
  contentType: 'application/json',
  body: JSON.stringify({ id: '1', name: 'Ana', role: 'admin' }),
})
)

// Mock de delay (testar loading states)
await page.route('**/api/products', async route => {
await new Promise(r => setTimeout(r, 3000))  // 3s de delay
await route.continue()
})

// Esperar que uma request aconteça
const responsePromise = page.waitForResponse('**/api/orders')
await page.getByRole('button', { name: 'Criar pedido' }).click()
const response = await responsePromise
expect(response.status()).toBe(201)` },
    { title: "Trace Viewer — debug de flakiness em CI", body: "Com --trace on-first-retry, o Playwright grava um trace completo na primeira falha: screenshots por passo, snapshots de DOM, network requests, console logs. Você baixa o artifact de CI e abre localmente em npx playwright show-trace trace.zip. Debug de flake remoto vira trivial.", code: `# playwright.config.ts
use: { trace: 'on-first-retry' }

# Executar com trace sempre (dev)
npx playwright test --trace on

# Abrir trace localmente
npx playwright show-trace test-results/my-test/trace.zip

# O Trace Viewer mostra:
# - Timeline dos passos
# - Screenshot antes/depois de cada ação
# - Network waterfall
# - Console e erros
# - DOM snapshot interativo (explore o HTML do momento exato da falha)` },
    { title: "Testes de API com request context", body: "Playwright inclui APIRequestContext para testar endpoints REST sem abrir browser. Compartilha cookies/auth com o browser context — perfeito para setup de dados de teste via API antes de um teste E2E.", code: `import { test, expect } from '@playwright/test'

test('criar e verificar pedido via API', async ({ request }) => {
// Login via API
const loginResponse = await request.post('/api/auth/login', {
  data: { email: 'user@example.com', password: 'senha' },
})
expect(loginResponse.ok()).toBeTruthy()

// Criar pedido via API
const createResponse = await request.post('/api/orders', {
  data: { productId: 'prod-1', quantity: 2 },
})
expect(createResponse.status()).toBe(201)
const order = await createResponse.json()
expect(order).toMatchObject({ status: 'pending', quantity: 2 })

// Verificar na UI que o pedido aparece
// (mesma sessão autenticada — cookies compartilhados)
})` },
    { title: "Configuração de produção — playwright.config.ts", body: "A configuração central do Playwright define projetos (browsers), retries, workers, timeout, reporter e uso global. Projetos permitem testar a mesma suite em múltiplos browsers com um único comando.", code: `import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
testDir: './tests/e2e',
timeout: 30_000,           // timeout por teste
retries: process.env.CI ? 2 : 0,  // 2 retries em CI, 0 local
workers: process.env.CI ? 1 : undefined,  // 1 em CI (por shard), auto local
reporter: [['html'], ['github']],

use: {
  baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
  trace: 'on-first-retry',
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
},

projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  { name: 'mobile',   use: { ...devices['Pixel 7'] } },
],

// Sobe o servidor local antes dos testes
webServer: {
  command: 'npm run start',
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
},
})` },
  ],
  gotchas: [
    "Seletores CSS encadeados e nth-child quebram a cada refactor visual. Sempre prefira getByRole, getByLabel, getByText ou getByTestId — eles testam comportamento, não estrutura HTML.",
    "Compartilhar estado entre testes (via variáveis de módulo ou banco sem cleanup) cria dependência de ordem e flakiness. Cada teste deve criar seus próprios dados ou usar fixtures isoladas.",
    "page.waitForTimeout(N) é anti-pattern — assina flakiness em CI mais lento. Substitua por assertions com auto-retry: await expect(locator).toBeVisible().",
    "Esquecer de configurar retries: 2 em CI. Testes E2E têm flakiness inerente de rede e ambiente. Com retries, falhas ocasionais não quebram o pipeline.",
    "Instalar browsers em cada CI run sem cache — 400MB baixados a cada push. Cache de ~/.cache/ms-playwright com a versão do pacote como chave reduz para 15 segundos.",
    "Usar page.click() em link que causa navegação sem waitForURL — race condition: próxima ação executa antes da nova página carregar. Sempre aguarde a URL ou um elemento da nova página.",
    "Rodar E2E para tudo inverte a pirâmide de testes — CI de 30 minutos. E2E é para fluxos críticos de ponta a ponta. Validação de campo de formulário deve ser teste unitário.",
    "Não limpar dados de teste — staging fica com estado sujo entre runs, causando falhas aleatórias. Use teardown fixture ou APIs de reset de dados de teste.",
    "Testar em apenas um browser — bugs de compatibilidade em WebKit/Firefox chegam em produção. Configure pelo menos chromium + webkit no projeto.",
  ],
  interview: [
    {
      q: "Playwright vs Cypress vs Selenium — quando escolher cada?",
      level: "pleno",
      a: "<p><strong>Playwright</strong>: multi-browser real (Chromium, Firefox, WebKit nativos), auto-wait embutido, multi-tab/popup/iframe, API testing integrada, sharding nativo, trace viewer, suporte TS/Python/Java/.NET. Melhor escolha em 2025-2026 para projetos novos.</p><p><strong>Cypress</strong>: DX excelente (UI runner com time-travel debug), comunidade enorme, plugins maduros. Limitações históricas: só Chromium-based (Component Testing suporta mais). Escolha quando a suite já existe e está madura.</p><p><strong>Selenium</strong>: legado, suporte a browsers antigos, Java enterprise. Evite em projetos novos — auto-wait rudimentar, mais frágil, lento.</p>",
      tip: "Demonstre que conhece os três mas tem opinião clara sobre o contexto certo para cada. Nunca diga 'Playwright é sempre melhor' — Cypress faz sentido onde a suite já existe.",
    },
    {
      q: "Como funciona o auto-waiting do Playwright internamente?",
      level: "pleno",
      a: "<p>Auto-waiting não é um sleep — é um loop de ações com condições específicas. Quando você chama <code>locator.click()</code>, o Playwright verifica em loop (polling) se o elemento satisfaz todas as condições: <strong>attached</strong> (existe no DOM), <strong>visible</strong> (não hidden, não opacity 0), <strong>enabled</strong> (não disabled), <strong>stable</strong> (sem animação CSS/JS em curso) e <strong>receives events</strong> (não coberto por overlay).</p><p>Cada condição tem retry até o timeout da ação (padrão 30s). Assim, um elemento que aparece após uma animação de 800ms é encontrado sem wait explícito.</p><p>Para assertions (<code>expect(locator).toBeVisible()</code>), o polling é de 100ms até o timeout de assertion (padrão 5s).</p>",
      tip: "A resposta que diferencia sênior: explique que locators são lazy — não buscam o elemento na criação, apenas na hora da ação. Isso habilita o auto-wait mesmo quando o elemento ainda não existe no DOM.",
    },
    {
      q: "Como você reutiliza autenticação entre testes sem logar centenas de vezes?",
      level: "pleno",
      a: "<p>Com <strong>storageState</strong>. No <code>globalSetup</code>, você faz login uma vez com Chromium, salva o estado de autenticação (cookies + localStorage) em um arquivo JSON via <code>context.storageState({ path: 'auth.json' })</code>. No <code>playwright.config.ts</code>, configura <code>use: { storageState: 'auth.json' }</code> — cada teste começa com a sessão já autenticada.</p><p>Para múltiplos roles (admin, user, guest), gere um arquivo por role no globalSetup. No spec, use <code>test.use({ storageState: 'auth/admin.json' })</code> no describe específico.</p><p>Se a sessão expira, adicione o globalSetup ao CI como step separado que regenera o arquivo antes de rodar os testes.</p>",
      tip: "Mencione o caso de múltiplos roles e como isolá-los por describe — isso demonstra experiência real com suites grandes.",
    },
    {
      q: "O que é Page Object Model e por que usar em Playwright?",
      level: "pleno",
      a: "<p>POM é um padrão que encapsula seletores e interações com uma página em uma classe separada. O spec descreve <em>o que</em> testar; o Page Object descreve <em>como</em> interagir.</p><p>Benefícios: (1) mudanças visuais atualizam apenas o Page Object — todos os specs passam sem alteração; (2) specs ficam legíveis como documentação; (3) reutilização — LoginPage.login() é chamada em qualquer spec que precisa de auth.</p><p>Em Playwright, Page Objects recebem a instância de <code>Page</code> no construtor e definem os locators no <code>constructor</code>. Locators são criados com métodos semânticos (getByRole, getByLabel) e ficam privados — o spec não acessa seletores diretamente.</p>",
    },
    {
      q: "Como lidar com testes flaky em CI?",
      level: "senior",
      a: "<p>Abordagem em camadas:</p><ul><li><strong>Configurar retries</strong>: <code>retries: 2</code> em CI. Falha isolada é retentada automaticamente. Com <code>trace: 'on-first-retry'</code>, o trace só é gravado quando falha — sem overhead no happy path.</li><li><strong>Eliminar waitForTimeout</strong>: substitua por assertions com auto-retry (<code>expect(locator).toBeVisible()</code>) ou <code>waitForURL</code>.</li><li><strong>Isolar estado</strong>: testes não devem compartilhar estado via DB ou variáveis globais. Fixtures criam e limpam dados por teste.</li><li><strong>Trace Viewer</strong>: baixe o artifact de CI, abra com <code>npx playwright show-trace</code>. O DOM snapshot no exato momento da falha revela o problema.</li><li><strong>Análise de padrão</strong>: se sempre falha no mesmo step, o problema é race condition. Se aleatório, é isolamento de estado. Use <code>--repeat-each=5</code> localmente para reproduzir.</li></ul>",
      tip: "Mencione que o primeiro passo é usar o Trace Viewer — sem ele, debugar flake em CI é cego. A combinação retries + trace on-first-retry + artifact upload é o setup padrão de produção.",
    },
    {
      q: "Como você faria sharding em CI para paralelizar a suite?",
      level: "senior",
      a: "<p>Sharding divide o conjunto de testes entre N runners paralelos. No GitHub Actions, use <code>strategy.matrix</code> com shardIndex de 1 a N. Cada runner executa <code>npx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}</code>.</p><p>O Playwright distribui os testes automaticamente entre os shards — você não precisa configurar quais testes vão para qual shard.</p><p>Para consolidar o relatório HTML dos N shards em um único, use <code>npx playwright merge-reports</code> após todos os runners terminarem (job separado com dependência nos N jobs).</p><p>Regra prática: 1 shard a cada 5-8 minutos de suite. Suite de 40min → 4-8 shards → ~8min total no CI.</p>",
      tip: "Mencione o merge-reports no job final — entrevistadores avançados sabem que isso existe e demonstra que você realmente implementou em produção.",
    },
    {
      q: "Como testar interações com janelas popup, iframes e múltiplas abas?",
      level: "senior",
      a: "<p><strong>Nova aba</strong>: aguarde o evento 'popup' no contexto antes do click que a abre.<br><code>const [newPage] = await Promise.all([context.waitForEvent('page'), page.click('a[target=_blank]')])</code></p><p><strong>Popup</strong>: mesma abordagem — <code>waitForEvent('page')</code> captura a popup. Para diálogos do sistema (alert, confirm), use <code>page.on('dialog', dialog => dialog.accept())</code>.</p><p><strong>Iframe</strong>: obtenha o FrameLocator via <code>page.frameLocator('iframe[title=\"pagamento\"]')</code>. A partir daí, use locators normalmente dentro do frame: <code>frame.getByLabel('Número do cartão').fill('...')</code>.</p><p>Diferencial do Playwright sobre Cypress: suporta iframes e múltiplas abas nativamente — Cypress historicamente não suportava.</p>",
    },
    {
      q: "O que é APIRequestContext e como usar em testes Playwright?",
      level: "pleno",
      a: "<p>APIRequestContext é o cliente HTTP integrado ao Playwright. Compartilha cookies/sessão com o browser context, o que permite misturar chamadas de API com ações de UI na mesma sessão autenticada.</p><p>Usos típicos: (1) criar dados de teste via API antes de um teste de UI — mais rápido que navegar pelo fluxo completo; (2) verificar via API o efeito de uma ação de UI; (3) testar endpoints REST diretamente sem browser.</p><p>A fixture <code>request</code> já está disponível nos testes. Para setup com autenticação via API (sem UI), crie um novo context com <code>playwright.request.newContext({ baseURL, extraHTTPHeaders })</code>.</p>",
    },
    {
      q: "Como implementar visual testing (screenshot comparison) com Playwright?",
      level: "senior",
      a: "<p>Playwright suporta snapshot testing nativo via <code>expect(page).toHaveScreenshot('nome.png')</code>. Na primeira execução, o screenshot é gravado como baseline. Nas seguintes, é comparado pixel a pixel com threshold configurável.</p><p>Desafios: (1) screenshots diferem por SO e fontes — rode sempre no mesmo ambiente (Docker em CI); (2) conteúdo dinâmico (datas, avatares, animações) causa diff falso — use <code>mask: [locator]</code> para mascarar regiões dinâmicas; (3) baseline precisa ser atualizada quando o design muda intencionalmente — <code>npx playwright test --update-snapshots</code>.</p><p>Para visual testing em escala, considere Argos CI ou Percy — integram com Playwright e têm comparação visual inteligente com histórico.</p>",
      tip: "Mencionar os 3 desafios (SO, conteúdo dinâmico, atualização intencional) e a solução de cada demonstra experiência real — não apenas leitura da documentação.",
    },
    {
      q: "Como você estruturaria fixtures para testes que precisam de dados no banco?",
      level: "senior",
      a: "<p>Fixture com scope 'worker' para a conexão com banco (única por worker), e scope 'test' para criação e limpeza de dados por teste.</p><pre><code>export const test = base.extend({\n  db: [async ({}, use) => {\n    const conn = await createConnection()\n    await use(conn)\n    await conn.close()\n  }, { scope: 'worker' }],\n\n  testUser: async ({ db, request }, use) => {\n    const user = await db.users.create({ email: `test-${Date.now()}@example.com` })\n    await use(user)\n    await db.users.delete({ id: user.id })  // cleanup\n  },\n})</code></pre><p>Cada teste recebe um usuário fresco e isolado — sem estado compartilhado entre testes. O timestamp no email garante unicidade mesmo em runners paralelos.</p>",
    },
    {
      q: "Como você configuraria playwright.config.ts para um projeto de produção?",
      level: "pleno",
      a: "<p>Configuração de produção inclui: <strong>retries: 2 em CI, 0 local</strong>; <strong>trace: on-first-retry</strong> (só grava em falha); <strong>screenshot e video: only-on-failure</strong>; <strong>baseURL via variável de ambiente</strong> (staging vs produção); <strong>projetos</strong> para múltiplos browsers e mobile; <strong>webServer</strong> para subir o servidor local em dev; <strong>globalSetup</strong> para auth.</p><p>Para reporters: HTML reporter para inspeção local, GitHub reporter para anotações no PR, e JSON reporter para integrar com ferramentas de análise.</p>",
    },
    {
      q: "Como testar WebSocket ou Server-Sent Events com Playwright?",
      level: "senior",
      a: "<p><strong>WebSocket</strong>: use <code>page.waitForEvent('websocket')</code> para capturar a conexão WS. A partir daí, ouça eventos via <code>ws.on('framereceived', ...)</code> e verifique os payloads. Para testar o comportamento em UI, apenas acione a ação que dispara o WS e faça assertions na UI após receber a mensagem.</p><p><strong>Server-Sent Events</strong>: abordagem mais simples — acione o evento que inicia o SSE, aguarde o elemento na UI atualizar via <code>expect(locator).toHaveText('mensagem esperada')</code>. Para interceptar os eventos SSE brutos, use <code>page.route</code> com um handler customizado que captura o stream.</p>",
    },
    {
      q: "Qual a diferença entre locator e elementHandle em Playwright?",
      level: "pleno",
      a: "<p><strong>Locator</strong> (recomendado): é uma descrição lazy de como encontrar o elemento. Não resolve imediatamente — apenas quando uma ação ou assertion é executada. Habilita auto-waiting. Sincronizado automaticamente com mudanças do DOM.</p><p><strong>ElementHandle</strong> (legado): é uma referência direta ao elemento em um momento específico do DOM. Se o DOM é re-renderizado (React, Vue), o handle pode ficar obsoleto (stale element). Não tem auto-waiting automático.</p><p>Sempre prefira Locator. ElementHandle existe por compatibilidade histórica com Puppeteer.</p>",
      tip: "A diferença lazy vs eager é o que justifica o auto-waiting dos locators. Esse detalhe demonstra compreensão da arquitetura.",
    },
    {
      q: "Como você testaria um fluxo de pagamento que envolve redirecionamento para gateway externo?",
      level: "senior",
      a: "<p>Duas estratégias:</p><p><strong>1. Mock da chamada de API</strong>: <code>page.route('**/api/checkout/**', route => route.fulfill({ body: JSON.stringify({ redirectUrl: '/mock-payment' }) }))</code>. Redirecione para uma página de pagamento mockada que você controla. Testa o fluxo do frontend sem depender do gateway externo — ideal para CI.</p><p><strong>2. Sandbox do gateway</strong>: use as credenciais de sandbox (Stripe test mode, Mercado Pago sandbox). Mais realista, mas depende de rede externa e pode ser instável em CI. Use apenas em testes de staging, não de PR.</p><p>Regra: E2E com gateways reais em ambiente de staging scheduled (noturno). E2E com mocks em CI de PR — mais rápido e estável.</p>",
    },
    {
      q: "Como garantir que seus testes Playwright são acessíveis (a11y)?",
      level: "pleno",
      a: "<p>Playwright integra com axe-core via <code>@axe-core/playwright</code>. Adicione uma assertion de acessibilidade em pages críticas:</p><pre><code>import AxeBuilder from '@axe-core/playwright'\n\ntest('home page tem zero violações de acessibilidade', async ({ page }) => {\n  await page.goto('/')\n  const results = await new AxeBuilder({ page }).analyze()\n  expect(results.violations).toEqual([])\n})</code></pre><p>Benefício duplo: locators semânticos (getByRole, getByLabel) já garantem que o HTML é acessível — se o button não tem role ou o input não tem label, o locator falha antes do axe.</p>",
    },
    {
      q: "Como você organizaria o projeto de testes para um time grande?",
      level: "senior",
      a: "<p>Estrutura por feature (não por tipo de teste): <code>tests/checkout/</code>, <code>tests/auth/</code>, <code>tests/catalog/</code>. Cada feature tem seu Page Object, fixtures e specs juntos.</p><p>Fixtures compartilhadas em <code>tests/shared/fixtures.ts</code>. Page Objects base com funcionalidade comum (header, nav) em <code>tests/shared/pages/</code>.</p><p>Para teams grandes: testes de cada time ficam em seu diretório. CI por PR roda apenas os testes do diretório afetado (filtragem por caminho) — mais rápido. Suite completa roda em staging.</p>",
    },
    {
      q: "O que é soft assertion e quando usar?",
      level: "pleno",
      a: "<p>Soft assertion (<code>expect.soft()</code>) não interrompe o teste quando falha — acumula os erros e reporta todos no final. Diferente da assertion normal que aborta imediatamente na primeira falha.</p><p>Uso: quando você quer validar múltiplos campos de um formulário ou múltiplos elementos de uma página e deseja saber <em>todos</em> os problemas de uma vez, não apenas o primeiro.</p><pre><code>await expect.soft(page.getByLabel('Nome')).toHaveValue('Ana')\nawait expect.soft(page.getByLabel('Email')).toHaveValue('ana@example.com')\nawait expect.soft(page.getByTestId('status')).toHaveText('ativo')\n// Se qualquer soft assertion falhou, o teste falha aqui com todos os erros\nexpect(test.info().errors).toHaveLength(0)</code></pre>",
    },
    {
      q: "Como você depura um teste Playwright que está falhando apenas em CI?",
      level: "senior",
      a: "<p>Passo a passo:</p><ul><li><strong>Trace Viewer</strong>: baixe o artifact <code>playwright-report</code>, abra com <code>npx playwright show-trace</code>. O DOM snapshot no momento da falha mostra o estado exato da página.</li><li><strong>Videos e screenshots</strong>: configure <code>video: 'retain-on-failure'</code> e <code>screenshot: 'only-on-failure'</code>.</li><li><strong>Reproduzir o ambiente de CI localmente</strong>: <code>docker run -it --rm -v $(pwd):/work mcr.microsoft.com/playwright:v1.45.0-focal bash</code>. Isso elimina diferenças de SO e fontes.</li><li><strong>Aumentar verbosidade</strong>: <code>DEBUG=pw:api npx playwright test</code> para ver todos os chamadas de API internas.</li><li><strong>Identificar flake de timing</strong>: <code>--repeat-each=5</code> localmente para forçar a falha.</li></ul>",
      tip: "Mencionar o container Docker do Playwright para reproduzir CI localmente demonstra experiência de produção real.",
    },
    {
      q: "Como integrar Playwright com relatórios e dashboards?",
      level: "pleno",
      a: "<p>Playwright tem reporters nativos: <strong>HTML</strong> (relatório visual completo), <strong>JSON</strong> (para processar programaticamente), <strong>JUnit</strong> (para integração com Azure DevOps, Jenkins), <strong>GitHub</strong> (anotações de PR com falhas inline).</p><p>Para histórico de tendência (flakiness rate, duração por teste), exporte o JSON e envie para um banco de dados. Ferramentas dedicadas: <strong>Allure</strong> (relatório rico com histórico), <strong>Argos CI</strong> (visual regression com histórico), <strong>Currents.dev</strong> (orquestração e analytics de E2E).</p>",
    },
    {
      q: "Qual a diferença entre test.beforeAll, test.beforeEach e fixtures?",
      level: "pleno",
      a: "<p><strong>beforeAll</strong>: roda uma vez antes de todos os testes no describe. Sem isolamento — se um teste modifica o estado criado no beforeAll, afeta os outros. Use para setup caro e estático (criar dados que nenhum teste modifica).</p><p><strong>beforeEach</strong>: roda antes de cada teste. Bom para reset de estado entre testes. Não é reutilizável entre arquivos.</p><p><strong>Fixtures</strong>: a forma moderna e recomendada. São injetadas por nome, têm cleanup automático via <code>use()</code>, têm scope configurável (test, worker) e são reutilizáveis entre specs via import. Fixtures compostas (fixture que usa outra fixture) são poderosas para configurar contextos complexos.</p>",
    },
  ],
  mnemonics: [
    {
      label: "RLTC — hierarquia de locators",
      trick: "Role → Label → Text → TestId → CSS",
      explanation: "R = getByRole (ARIA, melhor opção). L = getByLabel (inputs de formulário). T = getByText (conteúdo estático). C = CSS/XPath (último recurso, frágil). Quanto mais semântico, mais resiliente ao refactoring visual.",
    },
    {
      label: "AVS — condições do auto-wait",
      trick: "Attached → Visible → Stable",
      explanation: "A = Attached no DOM (existe). V = Visible (não hidden, não opacity 0). S = Stable (sem animação em curso, não se movendo). O Playwright verifica as 3 condições antes de qualquer ação. Sem flake de timing quando você segue a hierarquia.",
    },
    {
      label: "RRUSC — pipeline CI completo",
      trick: "Retry → Report → Upload → Shard → Cache",
      explanation: "Retry: 2 em CI. Report: HTML + GitHub. Upload: artifact always(). Shard: divide runners por shardIndex/shardTotal. Cache: ~/.cache/ms-playwright pela versão do pacote. Os 5 elementos de um CI robusto com Playwright.",
    },
  ],
  cheatsheet: {
    title: "Playwright — Locators, Assertions e Configuração",
    html: `<style>
.pwcs-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:20px}
.pwcs-h{font-size:9px;color:#2EAD33;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin:16px 0 8px;padding-top:12px;border-top:1px solid #1e293b}
.pwcs-h:first-child{margin-top:0;padding-top:0;border-top:none}
.pwcs-t{width:100%;border-collapse:collapse;margin-bottom:4px}
.pwcs-t td{border-bottom:1px solid #1e293b;padding:7px 10px;font-size:10px;vertical-align:top}
.pwcs-t tr:last-child td{border-bottom:none}
.pwcs-t td:first-child{color:#94a3b8;white-space:nowrap;padding-right:14px;min-width:200px}
.pwcs-t td:last-child{color:#64748b;line-height:1.5}
.pwcs-code{color:#2EAD33;background:rgba(46,173,51,.1);padding:1px 5px;border-radius:3px;font-size:9px}
.pwcs-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:4px}
.pwcs-card{background:#1e293b;border-radius:6px;padding:8px 10px}
.pwcs-card-title{font-size:9px;color:#94a3b8;font-weight:700;margin-bottom:4px}
.pwcs-card-body{font-size:9px;color:#475569;line-height:1.6}
</style>
<div class="pwcs-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 16px;font-weight:600">Playwright — Cheatsheet</p>

<div class="pwcs-h">Locators — hierarquia RLTC</div>
<table class="pwcs-t">
  <tr><td><span class="pwcs-code">page.getByRole('button', {name})</span></td><td>Melhor opção. Usa accessibility tree. Resiliente a refactoring visual.</td></tr>
  <tr><td><span class="pwcs-code">page.getByLabel('Email')</span></td><td>Para inputs com label associado. Testa acessibilidade implicitamente.</td></tr>
  <tr><td><span class="pwcs-code">page.getByText('Bem-vindo')</span></td><td>Para texto estático. Use exact: true para match exato.</td></tr>
  <tr><td><span class="pwcs-code">page.getByTestId('submit-btn')</span></td><td>data-testid no elemento. Quando semântica não está disponível.</td></tr>
  <tr><td><span class="pwcs-code">page.getByPlaceholder('Digite...')</span></td><td>Fallback para inputs sem label visível.</td></tr>
  <tr><td><span class="pwcs-code">page.locator('.css-class')</span></td><td>Último recurso. Frágil. Evite nth-child e seletores encadeados.</td></tr>
  <tr><td><span class="pwcs-code">locator.filter({ hasText })</span></td><td>Filtra locator por texto filho. Útil em listas.</td></tr>
  <tr><td><span class="pwcs-code">page.frameLocator('iframe')</span></td><td>Acessa conteúdo dentro de iframe.</td></tr>
</table>

<div class="pwcs-h">Assertions — expect() com auto-retry</div>
<table class="pwcs-t">
  <tr><td><span class="pwcs-code">expect(locator).toBeVisible()</span></td><td>Elemento visível no DOM. Retry por até 5s.</td></tr>
  <tr><td><span class="pwcs-code">expect(locator).toHaveText('...')</span></td><td>Texto exato ou substring. Retry automático.</td></tr>
  <tr><td><span class="pwcs-code">expect(locator).toHaveValue('...')</span></td><td>Valor de input. Útil após fill.</td></tr>
  <tr><td><span class="pwcs-code">expect(locator).toBeEnabled()</span></td><td>Botão habilitado. Oposto: toBeDisabled().</td></tr>
  <tr><td><span class="pwcs-code">expect(page).toHaveURL('/dashboard')</span></td><td>URL atual. Aceita string ou regex.</td></tr>
  <tr><td><span class="pwcs-code">expect(page).toHaveTitle('...')</span></td><td>Title da página.</td></tr>
  <tr><td><span class="pwcs-code">expect(locator).toHaveScreenshot('snap.png')</span></td><td>Visual regression. Cria baseline na primeira run.</td></tr>
  <tr><td><span class="pwcs-code">expect.soft(locator).toBeVisible()</span></td><td>Não aborta na falha — acumula erros e reporta todos.</td></tr>
</table>

<div class="pwcs-h">Ações de página</div>
<table class="pwcs-t">
  <tr><td><span class="pwcs-code">page.goto('/path')</span></td><td>Navega. Aguarda networkidle por padrão.</td></tr>
  <tr><td><span class="pwcs-code">locator.click()</span></td><td>Clica. Auto-wait: attached, visible, stable, enabled.</td></tr>
  <tr><td><span class="pwcs-code">locator.fill('texto')</span></td><td>Limpa e digita. Para inputs.</td></tr>
  <tr><td><span class="pwcs-code">locator.selectOption('valor')</span></td><td>Select/dropdown. Aceita value, label ou index.</td></tr>
  <tr><td><span class="pwcs-code">locator.check() / uncheck()</span></td><td>Checkbox e radio.</td></tr>
  <tr><td><span class="pwcs-code">page.keyboard.press('Enter')</span></td><td>Teclas especiais.</td></tr>
  <tr><td><span class="pwcs-code">page.waitForURL('/url')</span></td><td>Aguarda navegação para URL. Use após click em links.</td></tr>
  <tr><td><span class="pwcs-code">page.waitForLoadState('networkidle')</span></td><td>Aguarda requisições pararem. Para SPAs.</td></tr>
</table>

<div class="pwcs-h">Network e API</div>
<div class="pwcs-grid">
  <div class="pwcs-card">
    <div class="pwcs-card-title">Mock de request</div>
    <div class="pwcs-card-body">page.route('**/api/**', route => route.fulfill({ status: 200, body: '...' }))<br>route.abort() — simula falha de rede<br>route.continue() — passa para o servidor real</div>
  </div>
  <div class="pwcs-card">
    <div class="pwcs-card-title">Capturar request</div>
    <div class="pwcs-card-body">const [req] = await Promise.all([<br>&nbsp;&nbsp;page.waitForRequest('**/api/orders'),<br>&nbsp;&nbsp;page.click('Criar pedido'),<br>])<br>expect(req.method()).toBe('POST')</div>
  </div>
  <div class="pwcs-card">
    <div class="pwcs-card-title">APIRequestContext</div>
    <div class="pwcs-card-body">test('...', async ({ request }) => {<br>&nbsp;&nbsp;const r = await request.post('/api/users', { data: {...} })<br>&nbsp;&nbsp;expect(r.ok()).toBeTruthy()<br>})</div>
  </div>
  <div class="pwcs-card">
    <div class="pwcs-card-title">Multi-tab</div>
    <div class="pwcs-card-body">const [popup] = await Promise.all([<br>&nbsp;&nbsp;context.waitForEvent('page'),<br>&nbsp;&nbsp;page.click('a[target=_blank]'),<br>])<br>await popup.waitForLoadState()</div>
  </div>
</div>
</div>`,
  },
  mindmap: {
    title: "Playwright — mapa de conceitos",
    html: `<style>
.pwmm-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.pwmm-center{background:rgba(46,173,51,.15);border:2px solid #2EAD33;border-radius:12px;padding:12px 20px;display:inline-block;font-size:13px;color:#2EAD33;font-weight:700;text-align:center;white-space:nowrap}
.pwmm-branch{background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:8px 12px;font-size:10px;color:#94a3b8;cursor:default;transition:border-color .2s}
.pwmm-branch:hover{border-color:rgba(46,173,51,.5);color:#e2e8f0}
.pwmm-leaf{font-size:9px;color:#475569;padding:2px 0;line-height:1.4}
</style>
<div class="pwmm-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 18px;font-weight:600">Playwright — mapa mental</p>
<div style="display:grid;grid-template-columns:1fr auto 1fr;gap:12px;align-items:center">
  <div style="display:flex;flex-direction:column;gap:8px">
    <div class="pwmm-branch">
      <div style="font-weight:700;margin-bottom:4px;color:#2EAD33">Locators</div>
      <div class="pwmm-leaf">Hierarquia RLTC: Role → Label → Text → TestId → CSS</div>
      <div class="pwmm-leaf">Lazy: resolve apenas na ação (habilita auto-wait)</div>
      <div class="pwmm-leaf">filter({ hasText }), nth(0), locator.locator()</div>
    </div>
    <div class="pwmm-branch">
      <div style="font-weight:700;margin-bottom:4px;color:#2EAD33">Autenticação</div>
      <div class="pwmm-leaf">storageState: login uma vez no globalSetup</div>
      <div class="pwmm-leaf">auth.json: cookies + localStorage por role</div>
      <div class="pwmm-leaf">test.use({ storageState: 'admin.json' })</div>
    </div>
    <div class="pwmm-branch">
      <div style="font-weight:700;margin-bottom:4px;color:#2EAD33">Page Object Model</div>
      <div class="pwmm-leaf">Classe por página com locators privados</div>
      <div class="pwmm-leaf">Métodos de ação: login(), submit(), navigate()</div>
      <div class="pwmm-leaf">Spec limpo: descreve o que, POM descreve o como</div>
    </div>
  </div>
  <div style="display:flex;flex-direction:column;align-items:center;gap:4px">
    <div class="pwmm-center">Playwright</div>
    <div style="font-size:9px;color:#475569;text-align:center;margin-top:4px">Browser real + auto-waiting<br>zero flakiness de timing</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:8px">
    <div class="pwmm-branch">
      <div style="font-weight:700;margin-bottom:4px;color:#2EAD33">CI/CD</div>
      <div class="pwmm-leaf">Sharding: --shard=1/4 → 4× mais rápido</div>
      <div class="pwmm-leaf">Cache: ~/.cache/ms-playwright por versão</div>
      <div class="pwmm-leaf">Trace artifact: if: always()</div>
    </div>
    <div class="pwmm-branch">
      <div style="font-weight:700;margin-bottom:4px;color:#2EAD33">Debug</div>
      <div class="pwmm-leaf">Trace Viewer: DOM snapshot + network + console</div>
      <div class="pwmm-leaf">--headed: abre o browser visualmente</div>
      <div class="pwmm-leaf">--repeat-each=5: força reprodução de flake</div>
    </div>
    <div class="pwmm-branch">
      <div style="font-weight:700;margin-bottom:4px;color:#2EAD33">Network</div>
      <div class="pwmm-leaf">page.route(): mock, abort, continue</div>
      <div class="pwmm-leaf">APIRequestContext: testes de API sem browser</div>
      <div class="pwmm-leaf">waitForResponse / waitForRequest</div>
    </div>
  </div>
</div>
</div>`,
  },
  exercises: [
    {
      level: "iniciante",
      title: "Teste de login com storageState e Page Object Model",
      description: "Crie um globalSetup que faz login via Playwright e salva o storageState em auth/auth.json. Crie uma classe LoginPage com métodos goto() e login(email, password). Escreva 3 specs: (1) login com credenciais válidas → redireciona para /dashboard; (2) login com senha errada → exibe mensagem de erro; (3) acesso a /dashboard sem auth → redireciona para /login. O spec 3 deve usar um BrowserContext limpo (sem storageState). Configure playwright.config.ts para usar o storageState por padrão e o webServer para subir a aplicação.",
      concepts: ["storageState", "globalSetup", "Page Object Model", "BrowserContext", "webServer", "configuração"],
      hint: "Para o spec sem auth, sobrescreva o storageState do teste específico: test.use({ storageState: { cookies: [], origins: [] } }). Isso cria um contexto limpo sem autenticação mesmo que o config global tenha storageState definido.",
      relatedKeypoints: [2, 3],
    },
    {
      level: "intermediario",
      title: "Page Object Model completo para página de formulário",
      description: "Implemente uma CheckoutPage com todos os campos do formulário de checkout como locators privados. Escreva métodos: fillShipping(data), fillPayment(data), submit(), getOrderConfirmation(). Use network mocking (page.route) para interceptar POST /api/orders e verificar o payload enviado. Escreva specs para: (1) checkout completo com sucesso; (2) pagamento rejeitado (mock de resposta de erro); (3) validação de campos obrigatórios (submeter formulário vazio). Use soft assertions para verificar múltiplos campos de erro ao mesmo tempo.",
      concepts: ["Page Object Model", "page.route", "soft assertions", "fixtures", "form validation"],
      hint: "Para capturar o payload da request: const [req] = await Promise.all([page.waitForRequest('**/api/orders'), checkoutPage.submit()]). Então req.postDataJSON() retorna o body como objeto JavaScript. Use expect.soft() em cada campo de erro para ver todos os problemas de uma vez.",
      relatedKeypoints: [1, 4, 5],
    },
    {
      level: "senior",
      title: "Suite CI com sharding, visual testing e relatório consolidado",
      description: "Configure uma suite completa de CI no GitHub Actions com: (1) 4 shards paralelos via matrix strategy; (2) cache de browsers por versão do @playwright/test; (3) visual testing em 3 páginas críticas com expect(page).toHaveScreenshot() — use máscara para regiões dinâmicas; (4) upload de artifacts (trace + screenshots + report) com if: always(); (5) job de merge-reports que consolida os 4 shards em um único relatório HTML e publica como GitHub Pages. Adicione um teste de API em APIRequestContext para o endpoint POST /api/orders. Documente como atualizar os snapshots visuais quando o design mudar intencionalmente.",
      concepts: ["GitHub Actions matrix", "sharding", "visual testing", "toHaveScreenshot", "merge-reports", "cache", "APIRequestContext"],
      hint: "O job de merge-reports precisa de needs: [test] e deve baixar todos os N artifacts com actions/download-artifact antes de rodar npx playwright merge-reports --reporter html ./all-blobs. Para cache dos browsers, use a chave: playwright-${{ hashFiles('**/package-lock.json') }} — ela invalida automaticamente quando você atualiza o Playwright.",
      relatedKeypoints: [6, 7],
    },
  ],
  videos: [
    { title: "Playwright Full Course for Beginners", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=wawbt1cATsk", topic: "introdução completa", note: "Cobertura completa: locators, assertions, POM, fixtures e CI. Melhor ponto de partida." },
    { title: "Playwright vs Cypress — The Real Comparison", channel: "Fireship", url: "https://www.youtube.com/watch?v=rMKlFdkPEsY", topic: "comparação", note: "Análise imparcial dos dois frameworks com casos de uso concretos para cada." },
    { title: "Playwright Page Object Model Tutorial", channel: "Arjun Menon (QA Automation)", url: "https://www.youtube.com/watch?v=UDNi5f-5-wA", topic: "Page Object Model", note: "Implementação step-by-step de POM com TypeScript e fixtures." },
    { title: "Playwright in CI/CD with GitHub Actions", channel: "Microsoft Developer", url: "https://www.youtube.com/watch?v=sN2ph-SgCX4", topic: "CI/CD", note: "Setup oficial da Microsoft: sharding, cache, trace artifact e relatório HTML." },
    { title: "Playwright Visual Testing", channel: "Colby Fayock", url: "https://www.youtube.com/watch?v=G6zP2Bx_XU4", topic: "visual regression", note: "Visual testing com toHaveScreenshot, masks para conteúdo dinâmico e CI integration." },
  ],
  resources: [
    { title: "Playwright Documentation", url: "https://playwright.dev/", kind: "docs" },
    { title: "Best Practices — Playwright docs", url: "https://playwright.dev/docs/best-practices", kind: "docs" },
    { title: "Trace Viewer", url: "https://playwright.dev/docs/trace-viewer", kind: "docs" },
    { title: "API Testing com Playwright", url: "https://playwright.dev/docs/api-testing", kind: "docs" },
    { title: "Auth — storageState docs", url: "https://playwright.dev/docs/auth", kind: "docs" },
    { title: "CI/CD com Playwright (GitHub Actions)", url: "https://playwright.dev/docs/ci-intro", kind: "docs" },
    { title: "Page Object Model — guia oficial", url: "https://playwright.dev/docs/pom", kind: "docs" },
    { title: "Visual Comparisons — docs", url: "https://playwright.dev/docs/screenshots#visual-comparisons", kind: "docs" },
  ],
  codeExamples: [
    {
      title: "playwright.config.ts de produção completo",
      description: "Configuração com projetos multi-browser, storageState global, retries, trace e webServer.",
      language: "typescript",
      code: `import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
testDir: './tests/e2e',
timeout: 30_000,
expect: { timeout: 5_000 },          // timeout de assertions
fullyParallel: true,
retries: process.env.CI ? 2 : 0,    // 2 retries em CI, 0 local
workers: process.env.CI ? 1 : undefined,

reporter: [
  ['html', { open: 'never' }],       // relatório HTML local
  ['github'],                         // anotações no PR
],

use: {
  baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
  storageState: 'auth/auth.json',    // autenticação global
  trace: 'on-first-retry',           // trace só em falha
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  actionTimeout: 10_000,
},

projects: [
  // Setup de auth: roda antes de todos os testes autenticados
  { name: 'setup', testMatch: /global\\.setup\\.ts/ },

  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
    dependencies: ['setup'],
  },
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
    dependencies: ['setup'],
  },
  {
    name: 'webkit',
    use: { ...devices['Desktop Safari'] },
    dependencies: ['setup'],
  },
  {
    name: 'mobile-chrome',
    use: { ...devices['Pixel 7'] },
    dependencies: ['setup'],
  },
  // Testes de API não precisam de auth nem de browser
  { name: 'api', testMatch: /.*\\.api\\.spec\\.ts/ },
],

webServer: {
  command: 'npm run start',
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
  timeout: 120_000,
},
})`,
    },
    {
      title: "Page Object Model com fixtures tipadas",
      description: "LoginPage, DashboardPage e fixture que injeta os Page Objects nos testes automaticamente.",
      language: "typescript",
      code: `// tests/pages/login.page.ts
import { type Page, type Locator } from '@playwright/test'

export class LoginPage {
private emailInput: Locator
private passwordInput: Locator
private submitBtn: Locator
private errorMessage: Locator

constructor(private page: Page) {
  this.emailInput    = page.getByLabel('E-mail')
  this.passwordInput = page.getByLabel('Senha')
  this.submitBtn     = page.getByRole('button', { name: 'Entrar' })
  this.errorMessage  = page.getByTestId('login-error')
}

async goto() { await this.page.goto('/login') }

async login(email: string, password: string) {
  await this.emailInput.fill(email)
  await this.passwordInput.fill(password)
  await this.submitBtn.click()
}

async loginAndWaitForDashboard(email: string, password: string) {
  await this.login(email, password)
  await this.page.waitForURL('/dashboard')
}

async getErrorMessage() {
  return this.errorMessage.textContent()
}
}

// tests/fixtures/test.fixtures.ts
import { test as base } from '@playwright/test'
import { LoginPage } from '../pages/login.page'

type Fixtures = {
loginPage: LoginPage
authenticatedPage: Page  // página já autenticada
}

export const test = base.extend<Fixtures>({
loginPage: async ({ page }, use) => {
  const lp = new LoginPage(page)
  await lp.goto()
  await use(lp)
},

authenticatedPage: async ({ page }, use) => {
  // storageState já aplicado pelo config — começa autenticado
  await page.goto('/dashboard')
  await expect(page).toHaveURL('/dashboard')
  await use(page)
},
})

export { expect } from '@playwright/test'

// tests/e2e/login.spec.ts
import { test, expect } from '../fixtures/test.fixtures'

test.describe('Login', () => {
test('credenciais válidas redirecionam para /dashboard', async ({ loginPage, page }) => {
  await loginPage.loginAndWaitForDashboard('user@example.com', 'senha123')
  await expect(page).toHaveURL('/dashboard')
  await expect(page.getByRole('heading', { name: 'Olá, usuário!' })).toBeVisible()
})

test('senha errada exibe mensagem de erro', async ({ loginPage }) => {
  await loginPage.login('user@example.com', 'senha-errada')
  const error = await loginPage.getErrorMessage()
  expect(error).toContain('Credenciais inválidas')
})

test('sem auth redireciona para /login', async ({ browser }) => {
  // Cria contexto limpo, sem storageState
  const ctx = await browser.newContext({ storageState: { cookies: [], origins: [] } })
  const page = await ctx.newPage()
  await page.goto('/dashboard')
  await expect(page).toHaveURL('/login')
  await ctx.close()
})
})`,
    },
    {
      title: "Testes de API com APIRequestContext e mock de rede",
      description: "Teste de endpoint REST, mock de resposta de erro e captura de request para verificar payload.",
      language: "typescript",
      code: `import { test, expect } from '@playwright/test'

// Teste de API direta (sem browser)
test.describe('Orders API', () => {
test('criar pedido retorna 201 com dados corretos', async ({ request }) => {
  const response = await request.post('/api/orders', {
    data: {
      productId: 'prod-abc123',
      quantity: 2,
      shippingAddress: { street: 'Rua das Flores, 100', city: 'São Paulo' },
    },
  })

  expect(response.status()).toBe(201)
  const order = await response.json()
  expect(order).toMatchObject({
    status: 'pending',
    quantity: 2,
    productId: 'prod-abc123',
  })
  expect(order.id).toBeTruthy()
})

test('input inválido retorna 422', async ({ request }) => {
  const response = await request.post('/api/orders', {
    data: { quantity: -1 },  // quantity negativo é inválido
  })
  expect(response.status()).toBe(422)
  const error = await response.json()
  expect(error.errors).toContainEqual(
    expect.objectContaining({ field: 'quantity' })
  )
})
})

// Teste de UI com mock de rede
test('exibe mensagem de erro quando API retorna 500', async ({ page }) => {
// Intercepta ANTES de navegar
await page.route('**/api/orders', route =>
  route.fulfill({
    status: 500,
    contentType: 'application/json',
    body: JSON.stringify({ error: 'Internal Server Error' }),
  })
)

await page.goto('/checkout')
await page.getByRole('button', { name: 'Finalizar pedido' }).click()

await expect(page.getByTestId('error-banner')).toBeVisible()
await expect(page.getByTestId('error-banner')).toHaveText(/algo deu errado/i)
})

// Capturar e verificar payload da request
test('checkout envia payload correto para a API', async ({ page }) => {
await page.goto('/checkout')
await page.getByLabel('Nome').fill('Ana Silva')
await page.getByLabel('CEP').fill('01310-100')

// Aguarda a request em paralelo com o submit
const [request] = await Promise.all([
  page.waitForRequest(req =>
    req.url().includes('/api/orders') && req.method() === 'POST'
  ),
  page.getByRole('button', { name: 'Finalizar pedido' }).click(),
])

const payload = request.postDataJSON()
expect(payload).toMatchObject({
  customer: { name: 'Ana Silva' },
  shipping: { zipCode: '01310-100' },
})
})`,
    },
  ],
}

export default playwright
