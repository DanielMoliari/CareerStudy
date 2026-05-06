'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { CardCarousel } from '@/components/visuals/CardCarousel'
import type { CarouselCard } from '@/components/visuals/CardCarousel'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { CodeStepper } from '@/components/visuals/CodeStepper'
import type { CodeStepperScenario } from '@/components/visuals/CodeStepper'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { SequenceDiagram } from '@/components/visuals/SequenceDiagram'
import type { SeqActor, SeqMessage } from '@/components/visuals/SequenceDiagram'

// ── Paleta Playwright ─────────────────────────────────────────────────────────
const C      = '#2ECC71'   // verde Playwright
const C2     = '#27ae60'   // verde secundário
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#4ade80'
const AMB    = '#f59e0b'
const RED    = '#ef4444'
const BLU    = '#60a5fa'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Hierarquia Browser → Context → Page
// LayerStack: três camadas com o que cada uma isola
// ═══════════════════════════════════════════════════════════════════════════════

const BROWSER_LAYERS: Layer[] = [
  {
    id: 'browser',
    label: 'Browser Process',
    sublabel: 'chromium / firefox / webkit — um processo por worker',
    description: 'O processo do browser instalado pelo Playwright (~400MB em ~/.cache/ms-playwright). Um worker do test runner usa um único processo de browser. Lançar um novo browser é caro (1-2s) — por isso o browser é compartilhado entre testes do mesmo worker. Em CI, configure cache do diretório para não baixar a cada push.',
    code: 'const browser = await chromium.launch()\n// Um processo por worker do test runner\n// Reutilizado entre testes via BrowserContext',
    color: BLU,
    examples: ['chromium.launch()', 'firefox.launch()', 'webkit.launch()'],
  },
  {
    id: 'context',
    label: 'BrowserContext',
    sublabel: 'isolamento por teste — cookies, localStorage, rede separados',
    description: 'O BrowserContext é o nível de isolamento real. Cada teste recebe um contexto novo automaticamente — como uma janela anônima dedicada. Cookies, localStorage, cache e service workers são completamente isolados. Criar um contexto é rápido (milissegundos) porque não recria o processo browser. Para reusar autenticação, salve o contexto com storageState e carregue no próximo teste.',
    code: 'const context = await browser.newContext({\n  storageState: "auth/auth.json",  // auth reusada\n})\n// Isolado: cookies, localStorage, service workers',
    color: C,
    examples: ['browser.newContext()', 'storageState: "auth.json"', 'bypassCSP', 'viewport'],
  },
  {
    id: 'page',
    label: 'Page + Locators',
    sublabel: 'uma aba — locators são lazy e habilitam auto-wait',
    description: 'A Page representa uma aba do browser. Locators são descritores lazy — não buscam o elemento na criação, apenas quando uma ação é executada (click, fill, expect). Isso habilita o auto-wait: Playwright tenta em loop até o elemento estar attached, visible, stable e enabled. Um contexto pode ter múltiplas pages (abas). Para iframes, use page.frameLocator().',
    code: 'const page = await context.newPage()\n// Locator lazy — não busca agora, busca ao agir:\nconst btn = page.getByRole("button", { name: "Enviar" })\nawait btn.click()  // ← auto-wait aqui',
    color: C2,
    examples: ['page.getByRole()', 'page.getByLabel()', 'page.frameLocator()', 'context.waitForEvent("page")'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Hierarquia de locators RLTC
// CardCarousel: cada locator com signature, quando usar e quando não usar
// ═══════════════════════════════════════════════════════════════════════════════

const LOCATOR_CARDS: CarouselCard[] = [
  {
    name: 'getByRole',
    signature: 'page.getByRole(role, { name?, exact? })',
    emoji: '♿',
    color: C,
    use: [
      'Botões, links, inputs, selects, checkboxes com ARIA role',
      'Quando o elemento tem semântica HTML correta',
      'Melhor opção — resiliente a refactoring visual',
      'Testa a acessibilidade implicitamente',
    ],
    dontUse: 'Elementos sem role semântico ou com role customizado via aria-role complexo',
    difficulty: 1,
  },
  {
    name: 'getByLabel',
    signature: 'page.getByLabel(text, { exact? })',
    emoji: '🏷️',
    color: C2,
    use: [
      'Inputs de formulário com <label> associado',
      'aria-label e aria-labelledby também funcionam',
      'Valida que o input tem label (accessibility check implícito)',
      'Prefira sobre getByPlaceholder — placeholder não é acessível',
    ],
    dontUse: 'Inputs sem label visível ou programático — adicione o label primeiro',
    difficulty: 1,
  },
  {
    name: 'getByText',
    signature: 'page.getByText(text, { exact? })',
    emoji: '📝',
    color: BLU,
    use: [
      'Parágrafos, spans, divs com texto visível',
      'Headings, labels de seção, mensagens de erro',
      'exact: false (default) para substring match',
      'Bom para assertions de conteúdo dinâmico',
    ],
    dontUse: 'Texto que muda frequentemente ou é gerado dinamicamente (datas, IDs) — cria flakiness',
    difficulty: 1,
  },
  {
    name: 'getByTestId',
    signature: 'page.getByTestId(id)',
    emoji: '🔬',
    color: AMB,
    use: [
      'Quando nenhum locator semântico está disponível',
      'Elementos complexos sem role natural (gráficos, drag areas)',
      'Estável mesmo com refactoring visual completo',
      'Usar data-testid="nome" no elemento HTML',
    ],
    dontUse: 'Como primeira escolha — polui o HTML com atributos de teste. Use apenas quando semântica não existe',
    difficulty: 2,
  },
  {
    name: 'getByPlaceholder',
    signature: 'page.getByPlaceholder(text)',
    emoji: '💬',
    color: FGMUTE,
    use: [
      'Inputs onde o placeholder é o único identificador disponível',
      'Fallback quando não há label associado',
    ],
    dontUse: 'Como padrão — placeholder não é semanticamente correto para acessibilidade. Prefira adicionar um label ao input e usar getByLabel',
    difficulty: 2,
  },
  {
    name: 'locator (CSS/XPath)',
    signature: 'page.locator(".css-selector")',
    emoji: '🔧',
    color: RED,
    use: [
      'Último recurso absoluto — quando nenhuma outra opção existe',
      'Evite completamente se possível',
    ],
    dontUse: 'Seletores com nth-child, seletores encadeados profundos, IDs gerados dinamicamente. Qualquer refactoring visual quebra o teste',
    difficulty: 3,
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Anti-patterns de testes E2E
// AntiPatternsGallery
// ═══════════════════════════════════════════════════════════════════════════════

const PW_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'waitForTimeout — sleep arbitrário',
    wrong: [
      [{ text: '// ❌ Sleep de 2 segundos — flaky em CI lento', color: RED }],
      [{ text: 'await page.waitForTimeout(2000)', color: RED }],
      [{ text: 'await page.click("#submit-btn")' }],
    ],
    right: [
      [{ text: '// ✓ Auto-wait embutido — Playwright espera o elemento', color: GRN }],
      [{ text: 'await page.getByRole("button", { name: "Enviar" }).click()', color: GRN }],
      [{ text: '' }],
      [{ text: '// ✓ Para navegação após click:', color: GRN }],
      [{ text: 'await page.waitForURL("/dashboard")', color: GRN }],
      [{ text: '' }],
      [{ text: '// ✓ Para elemento que aparece assincronamente:', color: GRN }],
      [{ text: 'await expect(page.getByText("Pedido criado")).toBeVisible()', color: GRN }],
    ],
    why: 'waitForTimeout cria flakiness: em CI mais lento, 2s podem não ser suficientes; em máquinas rápidas, 2s desperdiçam tempo. O auto-wait do Playwright é adaptativo — espera o necessário, nunca mais.',
  },
  {
    title: 'Seletores CSS frágeis encadeados',
    wrong: [
      [{ text: '// ❌ Qualquer refactoring visual quebra o teste', color: RED }],
      [{ text: 'page.locator(".card-list > div:nth-child(3) > .btn-primary")', color: RED }],
      [{ text: '// ❌ ID gerado pelo framework:', color: RED }],
      [{ text: 'page.locator("#app > div > form > button")', color: RED }],
    ],
    right: [
      [{ text: '// ✓ Semântico — resiliente a qualquer refactoring visual', color: GRN }],
      [{ text: 'page.getByRole("button", { name: "Finalizar pedido" })', color: GRN }],
      [{ text: '' }],
      [{ text: '// ✓ Quando semântica não existe — data-testid', color: GRN }],
      [{ text: 'page.getByTestId("checkout-submit-btn")', color: GRN }],
    ],
    why: 'Seletores CSS acoplam o teste à estrutura HTML interna. Uma mudança de div para section, adição de wrapper, ou renomeação de classe quebra dezenas de testes sem nenhuma mudança de comportamento.',
  },
  {
    title: 'Testes interdependentes (estado compartilhado)',
    wrong: [
      [{ text: '// ❌ Teste B depende de dados criados pelo Teste A', color: RED }],
      [{ text: "let userId: string  // variável global compartilhada", color: RED }],
      [{ text: '' }],
      [{ text: 'test("A: criar usuário", async ({ page }) => {', color: RED }],
      [{ text: '  userId = await createUser()  // estado vazado', color: RED }],
      [{ text: '})', color: RED }],
      [{ text: 'test("B: editar usuário", async ({ page }) => {', color: RED }],
      [{ text: '  await editUser(userId)  // depende do Teste A', color: RED }],
      [{ text: '})', color: RED }],
    ],
    right: [
      [{ text: '// ✓ Cada teste cria seus próprios dados via fixture', color: GRN }],
      [{ text: 'test("editar usuário", async ({ page, testUser }) => {', color: GRN }],
      [{ text: '  // testUser criado e destruído por esta fixture', color: GRN }],
      [{ text: '  await page.goto(`/users/${testUser.id}/edit`)', color: GRN }],
      [{ text: '  // ... teste independente, pode rodar em qualquer ordem', color: GRN }],
      [{ text: '})', color: GRN }],
    ],
    why: 'Testes interdependentes falham aleatoriamente em paralelo (ordem não garantida) e são difíceis de debugar. Cada teste deve ser hermético — criar e limpar seus próprios dados. Fixtures com scope: "test" garantem isso automaticamente.',
  },
  {
    title: 'Login em cada teste (sem storageState)',
    wrong: [
      [{ text: '// ❌ Login via UI em cada um dos 50 testes', color: RED }],
      [{ text: 'test.beforeEach(async ({ page }) => {', color: RED }],
      [{ text: '  await page.goto("/login")', color: RED }],
      [{ text: '  await page.getByLabel("Email").fill("user@example.com")', color: RED }],
      [{ text: '  await page.getByLabel("Senha").fill("senha123")', color: RED }],
      [{ text: '  await page.getByRole("button", { name: "Entrar" }).click()', color: RED }],
      [{ text: '  await page.waitForURL("/dashboard")', color: RED }],
      [{ text: '})', color: RED }],
    ],
    right: [
      [{ text: '// ✓ Login uma vez no globalSetup, reusa em todos:', color: GRN }],
      [{ text: '// global-setup.ts', color: FGMUTE }],
      [{ text: 'await page.context().storageState({ path: "auth/auth.json" })', color: GRN }],
      [{ text: '' }],
      [{ text: '// playwright.config.ts — aplica a TODOS os testes:', color: FGMUTE }],
      [{ text: 'use: { storageState: "auth/auth.json" }', color: GRN }],
    ],
    why: 'Login via UI por teste multiplica o tempo por 50 (ou 200). storageState serializa cookies e localStorage após um único login no globalSetup — cada teste começa autenticado em milissegundos, sem tráfego de rede.',
  },
  {
    title: 'Verificar tudo via UI (sem APIRequestContext)',
    wrong: [
      [{ text: '// ❌ Criar dados de teste navegando pelo UI completo', color: RED }],
      [{ text: 'test("compra aparece no histórico", async ({ page }) => {', color: RED }],
      [{ text: '  await page.goto("/products")', color: RED }],
      [{ text: '  await page.getByText("Notebook").click()  // 3 passos só para', color: RED }],
      [{ text: '  await page.getByRole("button", { name: "Comprar" }).click()  // criar', color: RED }],
      [{ text: '  await page.goto("/checkout")  // um pedido', color: RED }],
      [{ text: '  // ... 10 steps de formulário...', color: RED }],
      [{ text: '})', color: RED }],
    ],
    right: [
      [{ text: '// ✓ Criar dados via API — testar apenas o que importa', color: GRN }],
      [{ text: 'test("compra aparece no histórico", async ({ page, request }) => {', color: GRN }],
      [{ text: '  // Cria o pedido via API (compartilha a sessão autenticada)', color: FGMUTE }],
      [{ text: '  const order = await request.post("/api/orders", { data: {...} })', color: GRN }],
      [{ text: '  // Testa APENAS a exibição do histórico:', color: FGMUTE }],
      [{ text: '  await page.goto("/orders")', color: GRN }],
      [{ text: '  await expect(page.getByText(order.id)).toBeVisible()', color: GRN }],
      [{ text: '})', color: GRN }],
    ],
    why: 'Testes E2E são para validar comportamento end-to-end de fluxos críticos, não para navegar por todas as telas para criar setup. Use a API para criar dados de teste — mais rápido, mais estável e testa somente o que você quer testar.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Playwright vs Cypress vs Selenium
// ComparisonTable
// ═══════════════════════════════════════════════════════════════════════════════

const E2E_OPTIONS: ComparisonOption[] = [
  { id: 'pw',  label: 'Playwright',  sublabel: 'Microsoft, 2020', color: C },
  { id: 'cy',  label: 'Cypress',     sublabel: 'Cypress.io, 2018', color: '#69D3A7' },
  { id: 'sel', label: 'Selenium',    sublabel: 'OSS, 2004',        color: '#43B02A' },
]

const E2E_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'browsers',
    label: 'Browsers suportados',
    category: 'Cobertura',
    description: 'Chromium, Firefox e WebKit (Safari) com a mesma API',
    values: {
      pw:  { rating: 'excellent', note: 'Chromium + Firefox + WebKit nativos com mesma API' },
      cy:  { rating: 'good',      note: 'Chromium-based (Chrome/Edge/Brave). Firefox experimental. Sem Safari real.' },
      sel: { rating: 'excellent', note: 'Qualquer browser via WebDriver — IE, Safari, Chrome' },
    },
  },
  {
    id: 'auto-wait',
    label: 'Auto-wait / zero flakiness',
    category: 'Confiabilidade',
    description: 'Esperar automaticamente que elementos estejam prontos antes de agir',
    values: {
      pw:  { rating: 'excellent', note: 'Auto-wait nativo em toda ação. Loop até attached+visible+stable+enabled.' },
      cy:  { rating: 'good',      note: 'Retry automático em comandos e assertions. Baseado em timeout configurável.' },
      sel: { rating: 'fair',      note: 'Explicit waits manuais obrigatórios (WebDriverWait, ExpectedConditions). Frágil.' },
    },
  },
  {
    id: 'multi-tab',
    label: 'Multi-tab, iframes e popups',
    category: 'Capacidades',
    description: 'Interagir com múltiplas abas, iframes e janelas popup no mesmo teste',
    values: {
      pw:  { rating: 'excellent', note: 'Nativo: context.waitForEvent("page"), page.frameLocator(). Zero configuração.' },
      cy:  { rating: 'poor',      note: 'Historicamente não suportado. cy.origin() parcialmente. Iframes limitados.' },
      sel: { rating: 'good',      note: 'window handles e switchTo().frame() funcionam mas são verbosos.' },
    },
  },
  {
    id: 'network',
    label: 'Interceptação de rede',
    category: 'Capacidades',
    description: 'Mock, stub e spy em requisições HTTP',
    values: {
      pw:  { rating: 'excellent', note: 'page.route() com fulfill/abort/continue. Request patterns com glob.' },
      cy:  { rating: 'excellent', note: 'cy.intercept() muito poderoso e ergonômico. Ponto forte do Cypress.' },
      sel: { rating: 'poor',      note: 'Não nativo — requer proxy externo (BrowserMob, mitmproxy).' },
    },
  },
  {
    id: 'paralelo',
    label: 'Paralelismo e sharding',
    category: 'Performance',
    description: 'Dividir a suite entre múltiplos workers ou máquinas',
    values: {
      pw:  { rating: 'excellent', note: 'Sharding nativo com --shard=N/total. Merge-reports para consolidar.' },
      cy:  { rating: 'good',      note: 'Cypress Cloud pago. Localmente limitado sem Dashboard.' },
      sel: { rating: 'good',      note: 'Selenium Grid distribui entre nós. Configuração complexa.' },
    },
  },
  {
    id: 'debug',
    label: 'Ferramentas de debug',
    category: 'DX',
    description: 'Experiência de debugging de testes falhando',
    values: {
      pw:  { rating: 'excellent', note: 'Trace Viewer: DOM snapshot + screenshots + network. --ui mode interativo.' },
      cy:  { rating: 'excellent', note: 'Time-travel debug com screenshots de cada passo no UI runner. Excelente DX.' },
      sel: { rating: 'fair',      note: 'Sem ferramenta nativa de debug visual. Requer setup externo.' },
    },
  },
  {
    id: 'api-test',
    label: 'Testes de API integrados',
    category: 'Capacidades',
    description: 'Cliente HTTP integrado que compartilha sessão com o browser',
    values: {
      pw:  { rating: 'excellent', note: 'APIRequestContext nativo. Compartilha cookies com o browser context.' },
      cy:  { rating: 'good',      note: 'cy.request() integrado. Sem compartilhamento automático de sessão.' },
      sel: { rating: 'poor',      note: 'Não tem — requer biblioteca HTTP separada (RestAssured, requests).' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Evolução de teste cru para Page Object Model
// CodeStepper: ver a refatoração passo a passo
// ═══════════════════════════════════════════════════════════════════════════════

const POM_SCENARIOS: CodeStepperScenario[] = [
  {
    id: 'raw',
    label: 'Teste cru — sem POM',
    code: `// login.spec.ts — 3 specs que precisam de login
import { test, expect } from '@playwright/test'

test('login válido', async ({ page }) => {
  await page.goto('/login')
  await page.locator('#email-input').fill('user@example.com')
  await page.locator('#password-input').fill('senha123')
  await page.locator('.submit-btn').click()
  await page.waitForURL('/dashboard')
  expect(page.url()).toContain('/dashboard')
})

test('login inválido', async ({ page }) => {
  await page.goto('/login')
  await page.locator('#email-input').fill('errado@example.com')
  await page.locator('#password-input').fill('errada')
  await page.locator('.submit-btn').click()
  // Seletor duplicado — manutenção problemática
  expect(await page.locator('.error-msg').textContent())
    .toContain('Credenciais inválidas')
})`,
    steps: [
      {
        lineStart: 1,
        lineEnd: 10,
        title: 'Seletores CSS espalhados em todo o spec',
        explanation: 'Três problemas: (1) #email-input, #password-input e .submit-btn duplicados em cada spec — se o HTML mudar, precisa alterar em todos os lugares; (2) seletores CSS frágeis — qualquer refactoring de classe ou ID quebra os testes; (3) specs verbosos — difícil ler o que o teste está verificando.',
        output: 'Código funcional mas frágil: 3 specs × 5 selectors = 15 pontos de falha em manutenção',
      },
      {
        lineStart: 13,
        lineEnd: 22,
        title: 'Duplicação explodindo com mais specs',
        explanation: 'O segundo teste copia os mesmos seletores. Com 10 specs de login, são 50 seletores para manter. Se o botão de submit mudar de .submit-btn para #login-btn, você atualiza em 10 lugares diferentes — e provavelmente esquece 2.',
        output: 'Cada novo spec duplica os seletores → O(n) de manutenção onde n = número de specs',
      },
    ],
  },
  {
    id: 'pom',
    label: 'Com Page Object Model',
    code: `// pages/login.page.ts — Page Object
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

  async getError() { return this.errorMessage.textContent() }
}

// login.spec.ts — limpo e legível
test('login válido', async ({ loginPage, page }) => {
  await loginPage.login('user@example.com', 'senha123')
  await expect(page).toHaveURL('/dashboard')
})

test('login inválido', async ({ loginPage }) => {
  await loginPage.login('errado@example.com', 'errada')
  expect(await loginPage.getError()).toContain('Credenciais inválidas')
})`,
    steps: [
      {
        lineStart: 1,
        lineEnd: 16,
        title: 'LoginPage encapsula seletores e ações',
        explanation: 'Todos os seletores estão em um único lugar — e agora são semânticos (getByLabel, getByRole) em vez de CSS frágil. Se o botão mudar de texto, você atualiza em UM lugar. O construtor recebe a Page — o Page Object não tem conhecimento de fixtures ou test runner.',
      },
      {
        lineStart: 18,
        lineEnd: 25,
        title: 'Métodos descrevem ações de usuário',
        explanation: 'loginPage.login() é um método de negócio que esconde a implementação técnica (fill, click, waitForURL). O spec lê como documentação: "faça login com essas credenciais". Quando a UI muda, você atualiza apenas o método — todos os specs continuam sem mudança.',
      },
      {
        lineStart: 28,
        lineEnd: 36,
        title: 'Specs limpos e legíveis como documentação',
        explanation: 'O spec agora descreve O QUE está sendo testado, não COMO. Uma linha por ação, uma assertion clara. Sem seletor visível. Se o formulário de login sofrer um refactoring completo, apenas login.page.ts precisa de atualização — os dois specs continuam intactos.',
        output: 'Princípio do POM: specs descrevem comportamento, Page Objects descrevem interação',
      },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — storageState: fluxo de autenticação reusada
// SequenceDiagram: globalSetup salva auth, cada teste carrega
// ═══════════════════════════════════════════════════════════════════════════════

const AUTH_ACTORS: SeqActor[] = [
  { id: 'runner',  label: 'Test Runner',    color: FGMUTE },
  { id: 'setup',   label: 'globalSetup',    color: AMB },
  { id: 'browser', label: 'Browser',        color: BLU },
  { id: 'app',     label: 'Aplicação',      color: C },
  { id: 'test',    label: 'Teste (N vezes)', color: C2 },
]

const AUTH_MESSAGES: SeqMessage[] = [
  { from: 'runner',  to: 'setup',   label: 'executa globalSetup.ts',       type: 'sync' },
  { from: 'setup',   to: 'browser', label: 'chromium.launch()',             type: 'sync' },
  { from: 'setup',   to: 'app',     label: 'page.goto("/login")',           type: 'sync' },
  { from: 'setup',   to: 'app',     label: 'fill email + fill senha + click Entrar', type: 'sync',
    note: 'Login UI feito uma única vez por run' },
  { from: 'app',     to: 'browser', label: 'Set-Cookie: session=abc... (resposta)',     type: 'return' },
  { from: 'setup',   to: 'setup',   label: 'context.storageState({ path: "auth/auth.json" })', type: 'sync',
    note: 'Serializa cookies + localStorage em arquivo JSON' },
  { from: 'setup',   to: 'browser', label: 'browser.close()',               type: 'sync' },
  { from: 'setup',   to: 'runner',  label: 'globalSetup concluído',         type: 'return' },
  { from: 'runner',  to: 'test',    label: 'inicia teste com storageState carregado', type: 'create',
    note: 'playwright.config: use: { storageState: "auth/auth.json" }' },
  { from: 'test',    to: 'browser', label: 'newContext({ storageState: "auth/auth.json" })', type: 'sync' },
  { from: 'test',    to: 'app',     label: 'page.goto("/dashboard")',       type: 'sync' },
  { from: 'app',     to: 'test',    label: '200 OK — já autenticado (cookie reconhecido)', type: 'return',
    note: 'Zero requests de login — milissegundos, não segundos' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// Componente principal
// ═══════════════════════════════════════════════════════════════════════════════

export default function PlaywrightVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'hierarquia-browser',
      title: 'Browser → Context → Page',
      subtitle: 'O que cada camada isola e por que o BrowserContext é o nível de isolamento por teste',
      accent: C,
      component: (
        <LayerStack
          layers={BROWSER_LAYERS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'hierarquia-locators',
      title: 'Hierarquia de Locators RLTC',
      subtitle: 'Role → Label → Text → TestId → CSS — como escolher o locator certo para cada situação',
      accent: C,
      component: (
        <CardCarousel
          cards={LOCATOR_CARDS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns de E2E',
      subtitle: 'Os 5 erros que criam flakiness, dependências e testes lentos — e como corrigi-los',
      accent: RED,
      component: (
        <AntiPatternsGallery
          patterns={PW_ANTIPATTERNS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'comparativo-e2e',
      title: 'Playwright vs Cypress vs Selenium',
      subtitle: 'Comparativo objetivo por critérios — quando escolher cada ferramenta',
      accent: C,
      component: (
        <ComparisonTable
          options={E2E_OPTIONS}
          criteria={E2E_CRITERIA}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'page-object-model',
      title: 'Evolução para Page Object Model',
      subtitle: 'Ver passo a passo como teste cru vira POM — o antes e depois com explicação de cada decisão',
      accent: C2,
      component: (
        <CodeStepper
          scenarios={POM_SCENARIOS}
          accentColor={C2}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'storage-state-auth',
      title: 'storageState — autenticação reusada',
      subtitle: 'Como o globalSetup faz login uma vez e todos os testes começam autenticados',
      accent: AMB,
      component: (
        <SequenceDiagram
          actors={AUTH_ACTORS}
          messages={AUTH_MESSAGES}
          accentColor={AMB}
          bgColor={BG}
          title="Fluxo storageState"
          description="Login feito uma vez no globalSetup — cookies/localStorage serializados em auth.json. Cada teste carrega o arquivo em vez de fazer login via UI."
        />
      ),
    },
  ]

  return (
    <VisuaisShell
      visuals={visuals}
      active={active}
      onChange={setActive}
    />
  )
}
