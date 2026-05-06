'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildQuickRefPdf } from '@/components/pdfs/QuickRefPdf'
import type { QuickRefColumn } from '@/components/pdfs/QuickRefPdf'
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import type { RuleItem } from '@/components/pdfs/CheatsheetPdf'

// RuleItem = { ok: boolean; t: string }

// ── Paleta Playwright ─────────────────────────────────────────────────────────
const C = '#2ECC71'

// ── Cards de PDF ──────────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'quick-ref',
    title: 'Quick Reference',
    subtitle: 'Locators, assertions e CLI num cartão A4',
    type: 'quick-ref',
    pages: 1,
    description: 'Cartão A4 landscape com 3 colunas: hierarquia RLTC de locators com exemplos, assertions com auto-retry, e comandos CLI com flags essenciais (--shard, --trace, --ui, --debug). O que você precisa consultar enquanto escreve testes.',
    icon: '01',
    goal: 'Consulta rápida',
    featured: true,
  },
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas em entrevista',
    type: 'qa',
    pages: 9,
    description: 'Recuperação ativa: 20 perguntas nível pleno/sênior cobrindo auto-wait, locators, storageState, Page Object Model, fixtures, network mocking, sharding, Trace Viewer, visual testing e comparação com Cypress/Selenium. Respostas com profundidade de entrevista.',
    icon: '02',
    goal: 'Recuperação ativa',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'O que cria flakiness — e como eliminar',
    type: 'antipatterns',
    pages: 3,
    description: 'Os 6 anti-patterns de testes E2E que destroem a confiabilidade da suite: waitForTimeout, seletores CSS frágeis, testes interdependentes, login repetido, testes sem retries em CI e pirâmide de testes invertida. Código errado × correto com explicação.',
    icon: '03',
    goal: 'Reconhecimento de padrão',
  },
  {
    id: 'cheatsheet',
    title: 'Cheatsheet de Locators',
    subtitle: 'Hierarquia RLTC com exemplos reais e armadilhas',
    type: 'cheatsheet',
    pages: 2,
    description: 'Referência completa de todos os locators: getByRole com roles ARIA, getByLabel, getByText, getByTestId, getByPlaceholder, locator filter e encadeamento. Com exemplos reais e quando NÃO usar cada um.',
    icon: '04',
    goal: 'Consulta rápida',
  },
]

// ── Dados — Quick Reference ───────────────────────────────────────────────────

const QR_COLUMNS: QuickRefColumn[] = [
  {
    sections: [
      {
        title: 'Hierarquia de Locators RLTC',
        entries: [
          { key: 'page.getByRole(role, { name })', value: '① Melhor opção — ARIA role semântico', badge: '★ preferido', badgeColor: '#2ECC71' },
          { key: 'page.getByLabel(text)', value: '② Para inputs com label associado' },
          { key: 'page.getByText(text)', value: '③ Para conteúdo textual visível' },
          { key: 'page.getByTestId(id)', value: '④ data-testid quando sem semântica', badge: 'data-testid', badgeColor: '#f59e0b' },
          { key: 'page.getByPlaceholder(text)', value: '⑤ Fallback — placeholder não é acessível' },
          { key: 'page.locator(".css")', value: '⑥ Último recurso — frágil', badge: '⚠ evitar', badgeColor: '#ef4444' },
          { key: 'locator.filter({ hasText })', value: 'Filtra locator por texto filho' },
          { key: 'locator.nth(0)', value: 'Pega o N-ésimo elemento do locator' },
          { key: 'page.frameLocator("iframe")', value: 'Acessa conteúdo dentro de iframe' },
        ],
      },
      {
        title: 'Assertions (com auto-retry)',
        entries: [
          { key: 'expect(locator).toBeVisible()', value: 'Visível no DOM — retry 5s' },
          { key: 'expect(locator).toHaveText("...")', value: 'Texto exato ou substring' },
          { key: 'expect(locator).toHaveValue("...")', value: 'Valor de input após fill' },
          { key: 'expect(locator).toBeEnabled()', value: 'Não disabled. Oposto: toBeDisabled()' },
          { key: 'expect(locator).toHaveCount(N)', value: 'Lista com N elementos' },
          { key: 'expect(page).toHaveURL("/path")', value: 'URL atual (string ou regex)' },
          { key: 'expect(page).toHaveTitle("...")', value: 'Title da página' },
          { key: 'expect(page).toHaveScreenshot("snap.png")', value: 'Visual regression — baseline' },
          { key: 'expect.soft(locator).toBeVisible()', value: 'Não aborta — acumula erros' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Ações de página',
        entries: [
          { key: 'page.goto("/path")', value: 'Navega. Auto-wait: networkidle' },
          { key: 'locator.click()', value: 'Clica. Auto-wait: attached+visible+stable+enabled' },
          { key: 'locator.fill("texto")', value: 'Limpa e digita no input' },
          { key: 'locator.selectOption("value")', value: 'Select dropdown por value/label' },
          { key: 'locator.check() / uncheck()', value: 'Checkbox e radio' },
          { key: 'locator.hover()', value: 'Hover para revelar tooltips/menus' },
          { key: 'locator.press("Enter")', value: 'Tecla especial no elemento focado' },
          { key: 'page.keyboard.press("Tab")', value: 'Tecla global (não em elemento)' },
          { key: 'page.waitForURL("/url")', value: 'Aguarda navegação — usar após click em link' },
          { key: 'page.waitForLoadState("networkidle")', value: 'Aguarda requests pararem (SPAs)' },
        ],
      },
      {
        title: 'storageState e autenticação',
        entries: [
          { key: 'context.storageState({ path: "auth.json" })', value: 'Salva cookies+localStorage' },
          { key: 'use: { storageState: "auth.json" }', value: 'Carrega em todos os testes (config)', badge: '★ essencial', badgeColor: '#2ECC71' },
          { key: 'test.use({ storageState: "admin.json" })', value: 'Sobrescreve por describe/teste' },
          { key: 'globalSetup: "./global-setup"', value: 'Script que roda antes de todos os testes' },
          { key: '{ cookies: [], origins: [] }', value: 'Context limpo sem auth (override)' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Network e API',
        entries: [
          { key: 'page.route("**/api/**", fn)', value: 'Intercepta requests por padrão glob' },
          { key: 'route.fulfill({ status, body })', value: 'Retorna resposta mockada' },
          { key: 'route.abort()', value: 'Simula falha de rede' },
          { key: 'route.continue()', value: 'Passa a request para o servidor real' },
          { key: 'page.waitForResponse("**/orders")', value: 'Aguarda response por URL' },
          { key: 'page.waitForRequest(fn)', value: 'Captura request por predicado' },
          { key: 'request.post("/api/orders", { data })', value: 'API call sem browser (fixture request)' },
        ],
      },
      {
        title: 'CLI — execução e debug',
        entries: [
          { key: 'npx playwright test', value: 'Roda todos os testes' },
          { key: 'npx playwright test --headed', value: 'Abre browser visualmente' },
          { key: 'npx playwright test --ui', value: 'UI mode interativo com time-travel' },
          { key: 'npx playwright test --debug', value: 'Abre Playwright Inspector' },
          { key: 'npx playwright test --trace on', value: 'Grava trace de todos os testes' },
          { key: '--shard=1/4', value: 'Shard 1 de 4 para CI paralelo', badge: '★ CI', badgeColor: '#2ECC71' },
          { key: 'npx playwright show-trace trace.zip', value: 'Abre Trace Viewer localmente' },
          { key: 'npx playwright merge-reports ./blobs', value: 'Consolida N shards em 1 relatório' },
          { key: '--repeat-each=5', value: 'Roda cada teste 5x — reproduz flakiness' },
          { key: 'npx playwright install --with-deps', value: 'Instala browsers + dependências do SO' },
        ],
      },
    ],
  },
]

// ── Dados — Q&A ───────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'Como funciona o auto-waiting do Playwright — o que ele espera antes de agir?',
    a: 'Auto-waiting não é sleep — é um loop de polling com condições específicas. Para qualquer ação (click, fill, press), Playwright verifica em loop: (1) attached — existe no DOM; (2) visible — visibility != hidden, opacity != 0, display != none; (3) stable — sem animação CSS/JS em curso, não se movendo; (4) enabled — não disabled; (5) receives events — não coberto por overlay. Cada condição tem retry até o timeout da ação (padrão 30s). Para assertions (expect(locator).toBeVisible()), o polling é de 100ms até timeout de 5s. A chave: locators são lazy — não buscam o elemento na criação, apenas na hora da ação. Isso habilita o auto-wait mesmo quando o elemento ainda não existe no DOM.',
    tip: 'A resposta que diferencia sênior: explique que locators são lazy (não eager como ElementHandle). Isso é o que habilita o auto-wait — o locator descreve COMO achar, não ONDE está agora.',
  },
  {
    level: 'Pleno',
    q: 'Qual a hierarquia de locators e por que preferir role sobre CSS?',
    a: 'Hierarquia RLTC (do mais para o menos robusto): (1) getByRole — usa a accessibility tree ARIA. Resiliente a qualquer mudança visual — enquanto o comportamento semântico existir, o teste passa; (2) getByLabel — inputs com label associado. Valida acessibilidade implicitamente; (3) getByText — conteúdo textual visível. Cuidado com texto dinâmico; (4) getByTestId — data-testid quando não há semântica disponível. Estável mas polui o HTML; (5) CSS/XPath — último recurso. Frágil: nth-child, classes de framework, IDs gerados. Por que preferir role: um teste com getByRole(\'button\', { name: \'Enviar\' }) passa se o botão for um &lt;button&gt;, &lt;a role=button&gt; ou &lt;div role=button&gt; — o comportamento semântico é o que importa, não a implementação HTML.',
    tip: 'Mencione que locators semânticos testam comportamento, não estrutura. Se a estrutura HTML muda mas o comportamento continua, o teste passa. Isso é o que queremos testar.',
  },
  {
    level: 'Pleno',
    q: 'Como reutilizar autenticação entre testes com storageState?',
    a: 'storageState serializa cookies e localStorage em um arquivo JSON após autenticação. No globalSetup, faça login uma vez e salve: context.storageState({ path: "auth/auth.json" }). No playwright.config.ts, configure use: { storageState: "auth/auth.json" } — todos os testes começam com a sessão carregada, sem requests de login. Para múltiplos roles (admin, user, guest), gere um arquivo por role no globalSetup. Em specs específicos, sobrescreva com test.use({ storageState: "auth/admin.json" }). Para testes sem auth, use context limpo: test.use({ storageState: { cookies: [], origins: [] } }).',
    tip: 'Mencione o caso de múltiplos roles e o override por describe — isso demonstra experiência com suites grandes onde diferentes specs precisam de contextos de auth diferentes.',
  },
  {
    level: 'Pleno',
    q: 'O que é Page Object Model e como implementar com Playwright?',
    a: 'POM encapsula seletores e ações de uma página em uma classe. O spec descreve O QUE testar, o Page Object descreve COMO interagir. Implementação: classe com locators privados criados no construtor (page.getByRole, page.getByLabel — nunca CSS), e métodos que representam ações do usuário (login(email, pw), submit(), getError()). O spec injeta o Page Object via fixture e chama métodos de alto nível. Benefícios: mudança visual atualiza apenas o Page Object — todos os specs passam sem tocar em um; specs legíveis como documentação; reutilização entre specs. Locators no construtor são criados uma vez e reusados — não recriam a busca a cada chamada.',
    tip: 'O diferencial: locators no construtor são lazy (Playwright Locator é preguiçoso). Criá-los no construtor NÃO causa busca prematura — a busca acontece apenas na ação. Isso é melhor que Selenium onde getElement* buscava imediatamente.',
  },
  {
    level: 'Pleno',
    q: 'Como funcionam as fixtures do Playwright e qual a diferença de beforeEach?',
    a: 'Fixtures estendem o test base via test.extend({}). São injetadas por nome — o Playwright instancia automaticamente quando o nome aparece como parâmetro. Diferenças de beforeEach: (1) reutilizáveis entre arquivos via import, (2) têm scope configurável (test vs worker), (3) cleanup automático via yield/await use(), (4) composíveis — uma fixture pode depender de outra. Scope test: instanciada e destruída por teste (Page Objects, dados de teste). Scope worker: instanciada por worker, compartilhada entre todos os testes do worker (conexão com banco, servidor). beforeEach é arquivo-local e não tem cleanup automático. Fixtures são a forma moderna — preferir sobre beforeEach para qualquer setup que precisa ser reutilizado.',
    tip: 'A composição de fixtures é poderosa: fixture testUser pode depender de fixture db que depende de fixture dbConnection. O Playwright instancia na ordem correta automaticamente.',
  },
  {
    level: 'Senior',
    q: 'Como lidar com testes flaky em produção?',
    a: 'Abordagem em camadas: (1) retries: 2 em CI com trace: "on-first-retry" — falha isolada é retentada, trace gravado apenas em falha; (2) eliminar waitForTimeout — substituir por assertions com auto-retry ou waitForURL; (3) isolamento de estado — testes que compartilham estado via banco ou variáveis globais criam flakiness de ordem. Fixtures criam e limpam por teste; (4) Trace Viewer — baixe o artifact, abra com npx playwright show-trace. DOM snapshot no momento da falha mostra o estado exato; (5) análise de padrão — se sempre falha no mesmo step, é race condition. Se aleatório, é isolamento; (6) --repeat-each=5 localmente para reproduzir o flake; (7) container Docker do Playwright (mcr.microsoft.com/playwright) para reproduzir o ambiente de CI.',
    tip: 'Mencionar o container Docker como técnica de reprodução demonstra experiência real. Muitos flakes "só em CI" são causados por diferença de SO/fontes — o container elimina essa variável.',
  },
  {
    level: 'Senior',
    q: 'Como configurar sharding no GitHub Actions para paralelizar a suite?',
    a: 'Sharding divide a suite entre N runners em paralelo. No GitHub Actions, use strategy.matrix: shardIndex: [1, 2, 3, 4] e shardTotal: [4]. Cada runner executa npx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}. O Playwright distribui testes automaticamente — sem configuração de quais testes vão para qual shard. Para consolidar os N relatórios: job separado com needs: [test], downloads todos os artifacts, executa npx playwright merge-reports --reporter html ./all-blobs. Publique o relatório como GitHub Pages. Regra prática: 1 shard a cada 5-8 minutos de suite. Suite de 40min → 4-8 shards → ~8min.',
    tip: 'Mencionar o merge-reports em job separado é o diferencial — entrevistadores avançados sabem que o relatório fragmentado é a dor de quem implementou sharding pela primeira vez.',
  },
  {
    level: 'Senior',
    q: 'Como testar interações com iframes, múltiplas abas e popups?',
    a: 'Nova aba/popup: aguarde o evento "page" no contexto ANTES do click que a abre: const [newPage] = await Promise.all([context.waitForEvent("page"), page.click("a[target=_blank]")]). Para diálogos do sistema (alert, confirm): page.on("dialog", d =&gt; d.accept()). Para iframes: page.frameLocator(\'iframe[title="pagamento"]\') retorna um FrameLocator — use locators normalmente dentro dele: frame.getByLabel("Número do cartão").fill("..."). FrameLocator também tem auto-wait — espera o iframe estar presente. Diferencial do Playwright: suporte nativo a iframes e multi-tab sem plugins ou workarounds — Cypress historicamente não suportava ambos.',
    tip: 'A comparação explícita com Cypress (que não suportava nativamente) é um diferencial na resposta — demonstra que você conhece as limitações históricas das ferramentas.',
  },
  {
    level: 'Pleno',
    q: 'O que é APIRequestContext e quando usar em vez de testes de UI?',
    a: 'APIRequestContext é o cliente HTTP integrado ao Playwright. Compartilha cookies/sessão com o browser context — mesma sessão autenticada. Usos: (1) criar dados de teste via API antes do teste de UI — mais rápido que navegar pelo fluxo completo de criação; (2) verificar via API o efeito de uma ação de UI — mais direta que navegar para uma tela de confirmação; (3) testar endpoints REST diretamente sem browser. A fixture request está disponível por padrão. Para setup de auth via API (sem UI), use playwright.request.newContext({ baseURL, extraHTTPHeaders }). Princípio: use API para setup/teardown e UI para o fluxo que você quer testar — misturar reduz tempo de execução dramaticamente.',
    tip: 'A resposta que demonstra maturidade: "use API para criar o estado, use UI para testar o comportamento que você quer validar". Não use E2E para testar tudo via UI — é lento e frágil.',
  },
  {
    level: 'Senior',
    q: 'Como implementar visual testing (screenshot comparison) com Playwright?',
    a: 'expect(page).toHaveScreenshot("nome.png") cria baseline na primeira execução e compara pixel a pixel nas seguintes. Desafios: (1) screenshots diferem por SO e fontes — sempre use o mesmo ambiente (Docker com a imagem oficial do Playwright em CI); (2) conteúdo dinâmico (datas, avatares, animações) causa diff falso — use mask: [locator] para mascarar regiões dinâmicas; (3) baseline desatualizada após mudança intencional de design — npx playwright test --update-snapshots. Para visual testing em escala: Argos CI ou Percy têm comparação inteligente com histórico de divergências.',
    tip: 'Os 3 desafios (SO, conteúdo dinâmico, atualização intencional) com solução de cada — resposta que demonstra experiência prática, não só leitura de docs.',
  },
  {
    level: 'Senior',
    q: 'Como estruturar fixtures para testes que precisam de dados no banco?',
    a: 'Fixture dbConnection com scope worker (conexão única por worker), fixture testUser com scope test (criação e limpeza por teste). Exemplo: db fixture cria a conexão no setup e fecha no teardown (após yield). testUser fixture usa db para criar usuário com email único (timestamp para evitar conflito em paralelo), yield o usuário, e deleta no teardown. Cada teste recebe um usuário fresco e isolado. O timestamp no email garante unicidade mesmo em runners paralelos (4 workers criando usuários simultaneamente). Para dados mais complexos, use fixture factory — função que cria objetos com valores default que o teste pode sobrescrever.',
    tip: 'O timestamp no email para unicidade em paralelo é um detalhe prático que demonstra experiência real com suites paralelas — muitos não pensam nisso até ter conflito de primary key em CI.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre Locator e ElementHandle?',
    a: 'Locator (recomendado): descrição lazy de como encontrar o elemento. Não resolve imediatamente — apenas quando uma ação ou assertion é executada. Habilita auto-waiting porque o Playwright pode retentар a busca. Sincronizado com mudanças do DOM — se o elemento é removido e recriado (React re-render), o locator encontra o novo elemento. ElementHandle (legado): referência direta ao elemento em um momento específico do DOM. Se o DOM é re-renderizado, o handle fica obsoleto (stale element reference — mesmo erro do Selenium). Sem auto-waiting automático. Existe por compatibilidade com Puppeteer. Sempre use Locator. ElementHandle é necessário apenas para APIs muito baixo nível (evaluate com referencias de elemento).',
    tip: 'A analogia com Selenium (stale element reference) resoa com entrevistadores que migraram de Selenium — é o bug mais comum que as pessoas lembram do Selenium.',
  },
  {
    level: 'Senior',
    q: 'Como depurar um teste que falha apenas em CI?',
    a: 'Processo passo a passo: (1) Trace Viewer — baixe o artifact playwright-report, abra com npx playwright show-trace. DOM snapshot + screenshots + network no exato momento da falha; (2) video: "retain-on-failure" e screenshot: "only-on-failure" no config — artifacts visuais do CI; (3) Container Docker — docker run -it mcr.microsoft.com/playwright:v1.45.0-focal para reproduzir o ambiente de CI localmente. Elimina diferença de SO e fontes; (4) DEBUG=pw:api npx playwright test para log detalhado de todas as chamadas internas; (5) --repeat-each=5 localmente para forçar reprodução de flakiness; (6) headless: false localmente para ver o browser executar o teste.',
    tip: 'O container Docker do Playwright é o segredo para "só falha em CI" — o ambiente Docker é idêntico ao que o CI usa. Isso resolve 80% dos flakes de ambiente.',
  },
  {
    level: 'Pleno',
    q: 'Como usar soft assertions e quando preferi-las sobre assertions normais?',
    a: 'expect.soft() não interrompe o teste quando falha — acumula os erros e reporta todos no final. Assertion normal aborta imediatamente na primeira falha. Quando usar soft: validar múltiplos campos de um formulário ou múltiplos elementos de uma página de uma só vez — você quer saber TODOS os problemas, não apenas o primeiro. Exemplo: soft assertion em cada campo de erro de validação de formulário — o report mostra quais campos falharam simultaneamente. Não use soft para assertions do fluxo principal — se a URL está errada, o resto do teste não faz sentido e deve abortar.',
    tip: 'A regra de quando NÃO usar é o que diferencia: soft é para assertions de estado final paralelo, não para assertions que bloqueiam o fluxo.',
  },
  {
    level: 'Senior',
    q: 'Como testar WebSockets com Playwright?',
    a: 'Para capturar a conexão WS: const ws = await page.waitForEvent("websocket"). A partir daí, ouça mensagens recebidas: ws.on("framereceived", frame =&gt; { payload = frame.payload }). Para testar via UI (comportamento esperado), acione a ação que dispara a mensagem WS e faça assertion na UI após ela ser processada: await expect(page.getByTestId("live-status")).toHaveText("Online"). Isso é mais robusto — testa o comportamento real do usuário. Para interceptar/mockar WebSocket, use page.routeWebSocket() (disponível a partir de Playwright 1.48) — permite interceptar e retornar payloads customizados para testar cenários difíceis de reproduzir.',
    tip: 'Mencionar page.routeWebSocket() (API nova) demonstra que você acompanha as releases do Playwright. A abordagem de testar via UI (não via payload raw) é mais resiliente.',
  },
  {
    level: 'Senior',
    q: 'Como integrar accessibility testing com Playwright?',
    a: 'Playwright integra com axe-core via @axe-core/playwright. Adicione assertion de acessibilidade em pages críticas: const results = await new AxeBuilder({ page }).analyze(); expect(results.violations).toEqual([]). Benefício duplo: locators semânticos (getByRole, getByLabel) já exigem HTML semântico — se o button não tem role ou o input não tem label, o locator falha. Isso transforma cada teste em um smoke test de acessibilidade. Para ser mais específico: AxeBuilder.include(".main-content") para testar uma seção; .exclude(".legacy-widget") para excluir componentes knowingly inaccessible; .withRules(["wcag2a"]) para focar em nível específico.',
    tip: 'O argumento do "benefício duplo" é poderoso: locators semânticos como testes de acessibilidade implícitos. Isso é algo que o entrevistador dificilmente sabe se você não mencionou.',
  },
  {
    level: 'Pleno',
    q: 'Como configurar playwright.config.ts para um projeto em produção?',
    a: 'Configuração de produção: retries: 2 em CI, 0 local (process.env.CI); trace: "on-first-retry" (só grava em falha); screenshot e video: "only-on-failure"; baseURL via env var para staging vs produção; projetos para múltiplos browsers (chromium, firefox, webkit, mobile); webServer para subir o servidor local em dev; globalSetup para auth; reporters HTML + GitHub (anotações no PR). Para CI: workers: 1 por shard (o paralelismo vem do sharding entre machines, não de workers por machine). fullyParallel: true para executar specs em paralelo dentro de um worker. actionTimeout: 10s por ação (mais restrito que o default de 30s).',
    tip: 'A distinção entre workers por machine vs sharding entre machines é o que demonstra experiência real com CI — muitos confundem os dois e não entendem por que workers: 1 é recomendado por shard.',
  },
  {
    level: 'Senior',
    q: 'Como você testaria um fluxo de pagamento com redirecionamento para gateway externo?',
    a: 'Duas estratégias: (1) Mock da API de checkout — page.route("**/api/checkout/**", route =&gt; route.fulfill({ body: JSON.stringify({ redirectUrl: "/mock-payment" }) })). Redirecione para uma página de pagamento que você controla. Testa o fluxo completo do frontend sem dependência de rede externa — ideal para CI de PR; (2) Sandbox do gateway — credenciais de test mode do Stripe/MercadoPago. Mais realista mas depende de rede externa e pode ser instável. Use apenas em testes de staging scheduled (noturno). Regra: E2E com mocks em CI de PR (rápido, estável), E2E com sandbox em staging scheduled (realista, lento). Nunca chame APIs reais de pagamento em CI regular.',
    tip: 'A separação clara entre "CI de PR com mock" vs "staging scheduled com sandbox" demonstra maturidade de arquitetura de testes — você não sacrifica estabilidade por realismo no CI principal.',
  },
  {
    level: 'Pleno',
    q: 'Como usar network mocking para testar estados difíceis de reproduzir?',
    a: 'page.route(pattern, handler) captura requisições antes de chegarem ao servidor. Três handlers: (1) route.fulfill({ status, contentType, body }) — retorna resposta mockada; (2) route.abort() — simula falha de rede ou timeout; (3) route.continue() — passa para o servidor real (útil para interceptar e modificar parcialmente). Para delay: await new Promise(r =&gt; setTimeout(r, 3000)); await route.continue() — testa loading states. Para capturar o payload enviado: const [req] = await Promise.all([page.waitForRequest("**/api/orders"), page.click("Finalizar")]); req.postDataJSON(). Padrões: "**/api/**" (glob), /api\\/orders/ (regex), ou função predicado (req =&gt; req.url().includes("/orders")).',
    tip: 'Mostrar os três handlers (fulfill, abort, continue) e o uso de delay para loading states demonstra que você conhece a API completamente — não só o caso básico de mock de resposta.',
  },
  {
    level: 'Senior',
    q: 'Como organizar testes Playwright para um time grande com múltiplos squads?',
    a: 'Estrutura por feature, não por tipo: tests/checkout/, tests/auth/, tests/catalog/. Cada feature tem Page Objects, fixtures e specs no mesmo diretório. Fixtures compartilhadas em tests/shared/fixtures.ts. Page Objects base (header, navigation) em tests/shared/pages/. Para times grandes: testes de cada squad no seu diretório — CI de PR roda apenas os testes do diretório afetado via --grep ou path filter. Suite completa roda em staging. RBAC de ambientes: apenas o pipeline de staging pode rodar testes contra produção-like environment. Para qualidade: runs scheduled noturnas rodam a suite completa em todos os browsers — falhas são reportadas no canal de eng, não bloqueiam PRs.',
    tip: 'A separação entre "CI de PR roda afetados" vs "schedule noturna roda tudo" é arquitetura de testes madura — PRs ficam rápidos, cobertura completa não é sacrificada.',
  },
  {
    level: 'Pleno',
    q: 'O que é o Trace Viewer e como usar para debug?',
    a: 'Trace Viewer é a ferramenta de debug do Playwright. Quando trace está ativo (trace: "on-first-retry" no config), grava: screenshots antes/depois de cada ação, snapshots de DOM (HTML/CSS interativo do momento exato), waterfall de network com payloads, console logs e erros. Para abrir: npx playwright show-trace test-results/meu-teste/trace.zip. Ou online: trace.playwright.dev. No CI: faça upload do playwright-report como artifact com if: always() — disponível mesmo quando os testes falham. Debug de flakiness: abra o trace, vá para o step que falhou, inspecione o DOM snapshot — o elemento estava presente? Estava em outro estado? O erro de rede aconteceu antes?',
    tip: 'Mencionar trace.playwright.dev como alternativa online ao CLI é útil — compartilhar um link do trace com o time sem precisar que todos tenham Playwright instalado.',
  },
]

// ── Dados — Anti-patterns ─────────────────────────────────────────────────────

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'waitForTimeout — sleep que cria flakiness',
    badDesc: 'Sleep arbitrário de N milissegundos — insuficiente em CI lento, desperdiçador em CI rápido.',
    badCode: [
      { t: '// Dormindo 2s esperando o modal aparecer', c: '#ef4444' },
      { t: '\nawait page.waitForTimeout(2000)', c: '#ef4444' },
      { t: '\nawait page.getByRole("button", { name: "Confirmar" }).click()' },
    ],
    goodDesc: 'Auto-wait embutido nas actions — Playwright espera o elemento estar pronto automaticamente.',
    goodCode: [
      { t: '// Auto-wait: Playwright espera o modal + botão estarem prontos', c: '#4ade80' },
      { t: '\nawait page.getByRole("button", { name: "Confirmar" }).click()', c: '#4ade80' },
      { t: '\n// Para navegação:', c: '#475569' },
      { t: '\nawait page.waitForURL("/confirmacao")', c: '#4ade80' },
    ],
    why: 'waitForTimeout é flaky por natureza: 2s pode não ser suficiente em CI com carga, e desperdiça tempo quando o elemento aparece em 200ms. O auto-wait do Playwright é adaptativo — aguarda exatamente o necessário.',
  },
  {
    title: 'Seletores CSS frágeis e encadeados',
    badDesc: 'Seletores CSS acoplados à estrutura HTML interna — qualquer refactoring visual quebra o teste.',
    badCode: [
      { t: '// Qualquer mudança de classe ou estrutura HTML:', c: '#ef4444' },
      { t: '\npage.locator(".card > div:nth-child(2) > .btn-primary")', c: '#ef4444' },
      { t: '\npage.locator("#root > div > form > button")', c: '#ef4444' },
    ],
    goodCode: [
      { t: '// Semântico — resiliente a qualquer refactoring visual:', c: '#4ade80' },
      { t: '\npage.getByRole("button", { name: "Enviar formulário" })', c: '#4ade80' },
      { t: '\n// Se não tem semântica:', c: '#475569' },
      { t: '\npage.getByTestId("form-submit-btn")', c: '#4ade80' },
    ],
    goodDesc: 'Locator semântico — testa comportamento, não estrutura HTML interna.',
    why: 'CSS seletores testam implementação, não comportamento. getByRole("button", { name: "Enviar" }) passa se o elemento for button, a[role=button] ou div[role=button] — qualquer implementação com semântica correta.',
  },
  {
    title: 'Testes interdependentes com estado compartilhado',
    badDesc: 'Variável global que vaza estado entre testes — flakiness em paralelo, impossível de debugar.',
    badCode: [
      { t: 'let orderId: string  // estado global entre testes', c: '#ef4444' },
      { t: '\ntest("criar pedido", async () => {', c: '#ef4444' },
      { t: '\n  orderId = await createOrder()  // vaza estado', c: '#ef4444' },
      { t: '\n})', c: '#ef4444' },
      { t: '\ntest("verificar pedido", async () => {', c: '#ef4444' },
      { t: '\n  await page.goto(`/orders/${orderId}`)  // depende do anterior', c: '#ef4444' },
      { t: '\n})', c: '#ef4444' },
    ],
    goodCode: [
      { t: '// Fixture cria e limpa dados por teste:', c: '#4ade80' },
      { t: '\ntest("verificar pedido", async ({ page, testOrder }) => {', c: '#4ade80' },
      { t: '\n  await page.goto(`/orders/${testOrder.id}`)', c: '#4ade80' },
      { t: '\n  // testOrder criado antes do teste, destruído depois', c: '#475569' },
      { t: '\n})', c: '#4ade80' },
    ],
    goodDesc: 'Fixture com scope test — cria dados isolados por teste, cleanup automático.',
    why: 'Testes interdependentes falham aleatoriamente em execução paralela (ordem não garantida). Cada teste deve ser hermético — fixtures com scope: "test" garantem isolamento e cleanup automáticos.',
  },
  {
    title: 'Login em cada teste sem storageState',
    badDesc: 'Login via UI repetido em beforeEach — multiplica o tempo da suite pela quantidade de testes.',
    badCode: [
      { t: 'test.beforeEach(async ({ page }) => {', c: '#ef4444' },
      { t: '\n  await page.goto("/login")', c: '#ef4444' },
      { t: '\n  await page.getByLabel("Email").fill("user@example.com")', c: '#ef4444' },
      { t: '\n  await page.getByLabel("Senha").fill("senha123")', c: '#ef4444' },
      { t: '\n  await page.getByRole("button", { name: "Entrar" }).click()', c: '#ef4444' },
      { t: '\n  await page.waitForURL("/dashboard")  // ~800ms por teste', c: '#ef4444' },
      { t: '\n})', c: '#ef4444' },
    ],
    goodCode: [
      { t: '// globalSetup.ts: login UMA vez', c: '#475569' },
      { t: '\nawait context.storageState({ path: "auth/auth.json" })', c: '#4ade80' },
      { t: '\n// playwright.config.ts: aplica a todos os testes', c: '#475569' },
      { t: '\nuse: { storageState: "auth/auth.json" }', c: '#4ade80' },
      { t: '\n// Cada teste começa autenticado em <5ms (sem request)', c: '#4ade80' },
    ],
    goodDesc: 'storageState no globalSetup — login feito uma vez, todos os testes reusam a sessão.',
    why: 'Login via UI por teste: 50 testes × 800ms = 40s só de login. storageState: 50 testes × 5ms = 0.25s. Para suites de 200 testes, a diferença é 2.5 minutos vs 1 segundo de overhead de auth.',
  },
  {
    title: 'Sem retries em CI — zero tolerância a flakiness de ambiente',
    badDesc: 'retries: 0 em CI — qualquer instabilidade de rede ou race condition falha o build.',
    badCode: [
      { t: '// playwright.config.ts', c: '#ef4444' },
      { t: '\nexport default defineConfig({', c: '#ef4444' },
      { t: '\n  retries: 0,  // zero tolerância — build quebra em qualquer flake', c: '#ef4444' },
      { t: '\n  use: { trace: "on" },  // trace sempre — overhead desnecessário', c: '#ef4444' },
      { t: '\n})', c: '#ef4444' },
    ],
    goodCode: [
      { t: '// playwright.config.ts', c: '#475569' },
      { t: '\nexport default defineConfig({', c: '#4ade80' },
      { t: '\n  retries: process.env.CI ? 2 : 0,', c: '#4ade80' },
      { t: '\n  use: { trace: "on-first-retry" },  // só grava em falha', c: '#4ade80' },
      { t: '\n  // video e screenshot: only-on-failure', c: '#475569' },
      { t: '\n})', c: '#4ade80' },
    ],
    goodDesc: 'retries: 2 em CI com trace only-on-first-retry — sem overhead no happy path, trace disponível quando importa.',
    why: 'Testes E2E têm flakiness inerente de rede e timing de CI. retries: 2 absorve falhas ocasionais sem comprometer a integridade (3 falhas consecutivas indica bug real). trace: on-first-retry evita overhead de gravação em todos os testes.',
  },
  {
    title: 'Pirâmide de testes invertida — E2E para tudo',
    badDesc: 'Testar validação de campo, lógica de negócio e estados via E2E — suite de 2 horas.',
    badCode: [
      { t: '// Testando validação de email via E2E (deveria ser unitário)', c: '#ef4444' },
      { t: '\ntest("email inválido", async ({ page }) => {', c: '#ef4444' },
      { t: '\n  await page.goto("/register")  // abre browser inteiro', c: '#ef4444' },
      { t: '\n  await page.getByLabel("Email").fill("invalido")  // para isso:', c: '#ef4444' },
      { t: '\n  await page.getByRole("button", { name: "Cadastrar" }).click()', c: '#ef4444' },
      { t: '\n  await expect(page.getByText("Email inválido")).toBeVisible()', c: '#ef4444' },
      { t: '\n})', c: '#ef4444' },
    ],
    goodCode: [
      { t: '// Unitário (Jest/Vitest) para lógica de validação', c: '#4ade80' },
      { t: '\ntest("validateEmail rejeita formato inválido", () => {', c: '#4ade80' },
      { t: '\n  expect(validateEmail("invalido")).toBe(false)  // <1ms', c: '#4ade80' },
      { t: '\n})', c: '#4ade80' },
      { t: '\n// E2E apenas para o happy path do fluxo completo de cadastro', c: '#475569' },
      { t: '\n// Regra: UI E2E só para fluxos críticos ponta-a-ponta', c: '#4ade80' },
    ],
    goodDesc: 'Pirâmide correta: unitários para lógica, integração para componentes, E2E para fluxos críticos.',
    why: 'E2E para validação de campo cria suite de 2h que quebra por qualquer mudança visual. Unitários testam lógica em <1ms. E2E é para fluxos críticos ponta-a-ponta que não podem ser testados de outra forma — login, checkout, publicação.',
  },
]

// ── Dados — Cheatsheet (locators detalhados) ──────────────────────────────────
// Usando rules de RuleItem para cada locator como "regra de uso"

const LOCATOR_RULES: RuleItem[] = [
  { ok: true,  t: 'getByRole(role, opts) — prioridade máxima. Roles: button, link, textbox, checkbox, radio, combobox, heading, img, listitem, dialog. Atributo name faz match com accessible name (label, aria-label, texto visível).' },
  { ok: true,  t: 'getByLabel(text) — para inputs com label associado (for=, aria-label, aria-labelledby). Teste implícito de acessibilidade: se não tem label, o locator falha — adicione o label.' },
  { ok: true,  t: 'getByText(text, { exact? }) — exact: true para match exato, false (default) para substring. Para elementos com muito texto, use filter({ hasText }) combinado com outro locator.' },
  { ok: true,  t: 'getByTestId(id) — usa data-testid por padrão. Configurável via testIdAttribute no config. Estável mas polui o HTML — use só quando semântica não existe.' },
  { ok: true,  t: 'getByPlaceholder(text) — fallback para inputs sem label. Placeholder não é semanticamente acessível. Prefira adicionar label e usar getByLabel.' },
  { ok: true,  t: 'locator.filter({ hasText, has }) — filtra locator resultante. Ex: page.getByRole("listitem").filter({ hasText: "Banana" }) pega o item da lista que contém "Banana".' },
  { ok: true,  t: 'locator.nth(index) — pega o N-ésimo match (zero-indexed). Evite — nth(2) é frágil se a lista muda de ordem. Prefira filter para identificar por conteúdo.' },
  { ok: true,  t: 'page.frameLocator(selector) — FrameLocator para conteúdo de iframes. Suporta todos os locators internamente com auto-wait. Ex: page.frameLocator("iframe").getByLabel("Número do cartão").' },
  { ok: true,  t: 'Encadeamento: locator.locator(outro) — restringe busca ao escopo. Ex: page.getByRole("dialog").getByRole("button", { name: "Confirmar" }) busca o botão apenas dentro do dialog.' },
  { ok: false, t: 'NUNCA usar: nth-child, seletores de classe de framework (class-xyz-123), IDs gerados, XPath com //, combinações profundas de seletores CSS. Qualquer refactoring visual quebra o teste.' },
]

export default function PlaywrightPdfs() {
  const [open, setOpen] = useState<PdfCard | null>(null)

  const hero = PDF_CARDS[0]
  const rest = PDF_CARDS.slice(1)

  const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
    'quick-ref': () => buildQuickRefPdf({
      columns: QR_COLUMNS,
      skillName: 'Playwright',
      accentColor: C,
      stackLabel: 'Testes E2E',
      tagline: 'Locators RLTC + auto-wait + storageState + sharding',
      version: '1.x',
    }),
    qa: () => buildQAReviewPdf({
      qa: QAS,
      accentColor: C,
      skillName: 'Playwright',
      stackLabel: 'Testes E2E',
    }),
    antipatterns: () => buildAntipatternsPdf({
      antipatterns: ANTIPATTERNS,
      accentColor: C,
      skillName: 'Playwright',
      stackLabel: 'Testes E2E',
    }),
    cheatsheet: () => buildCheatsheetPdf({
      skillName: 'Playwright',
      accentColor: C,
      stackLabel: 'Testes E2E',
      sections: {
        hooks: [],
        depRows: [],
        rules: LOCATOR_RULES,
        performanceTips: [
          'storageState: login uma vez, todos os testes reusam (de 800ms para 5ms por teste)',
          'APIRequestContext: crie dados via API no setup — não navegue pelo UI para criar pré-condições',
          'Sharding: --shard=N/total divide a suite entre máquinas — 40min → 10min em 4 runners',
          'fullyParallel: true no config — specs rodam em paralelo dentro do mesmo worker',
          'Cache de browsers no CI: ~/.cache/ms-playwright com key por versão do pacote — 2min → 15s',
          'trace: on-first-retry — zero overhead no happy path, trace disponível só quando falha',
          'workers: 1 por shard (paralelismo entre machines, não dentro da machine em CI)',
        ],
        patterns: [],
        mentalModels: [],
      },
    }),
  }

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
