'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import type { HookItem, RuleItem } from '@/components/pdfs/CheatsheetPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'
import { buildComparativeRefPdf } from '@/components/pdfs/ComparativeRefPdf'
import type { CompOption, CompCriterion, CompScenario } from '@/components/pdfs/ComparativeRefPdf'

// ── Paleta Vue ─────────────────────────────────────────────────────────────────
const C = '#4FC08D'

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas em entrevista',
    type: 'qa',
    pages: 9,
    description: 'Recuperação ativa: 20 perguntas de Vue 3 — reatividade por Proxy, ref vs reactive, watch vs watchEffect, Composition API, composables, Pinia, Vue Router, TypeScript com defineProps, Suspense, slots e anti-patterns. Nível pleno e sênior.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'Composition API + Diretivas + Lifecycle + script setup',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referência densa: todas as primitivas de reatividade, diretivas de template, lifecycle hooks, macros de script setup (defineProps, defineEmits, defineExpose), v-model customizado e patterns de composable.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'RCWP, MIOCBU e SSDIE para gravar Vue 3',
    type: 'mnemonics',
    pages: 2,
    description: 'Três mnemônicos: RCWP para as primitivas de reatividade, MIOCBU para os lifecycle hooks em ordem e SSDIE para as diretivas essenciais. Associações que grudam e funcionam em entrevista.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'O que não fazer no Vue 3 — e por quê',
    type: 'antipatterns',
    pages: 3,
    description: 'Os 7 anti-patterns mais comuns: mutar prop, v-if+v-for, desestruturar reactive, watch sem immediate, provide com primitivo, v-for sem :key estável e computed com efeitos colaterais.',
    icon: '04',
    goal: 'Reconhecimento de padrão',
  },
  {
    id: 'comparative',
    title: 'Composition API vs Options API',
    subtitle: 'Tabela de equivalências para migração e entrevista',
    type: 'comparative',
    pages: 2,
    description: 'Tabela de equivalências completa: cada conceito do Options API (data, computed, watch, mounted, mixins, Vuex) com o equivalente em Composition API, pontuação por critério e cenários recomendados.',
    icon: '05',
    goal: 'Referência de migração',
  },
]

// ── Dados: Q&A ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'Qual a diferença entre ref() e reactive()?',
    a: 'ref(): envolve qualquer valor (primitivo ou objeto) em container reativo, acesso via .value. reactive(): Proxy direto sobre objeto, sem .value. Gotcha: reactive() perde reatividade ao desestruturar — os primitivos extraídos não são Proxies. Convenção: prefira ref() para tudo — mais consistente.',
    tip: 'O problema de desestruturação do reactive() é o ponto que mais pega em entrevista. Quem leu superficialmente não menciona.',
  },
  {
    level: 'Senior',
    q: 'Como funciona o sistema de reatividade Vue 3 internamente?',
    a: 'Vue 3 usa Proxy ES6 para interceptar acesso (get) e mutação (set). Durante execução de computed/watchEffect, qualquer acesso a propriedade reativa chama track() — registrando o efeito como dependente. Quando muda, trigger() notifica todos os efeitos. Rastreamento automático de dependências, sem array de deps manual como React.',
    tip: 'Citar track() e trigger() e comparar com React (sem array de deps) mostra domínio do mecanismo, não só da API.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre watch() e watchEffect()?',
    a: 'watchEffect(): rastreia automaticamente, executa imediatamente no mount, sem acesso ao valor anterior. watch(): observa fontes explícitas, lazy por padrão (não roda ao montar), tem acesso ao oldValue. Use watch para controle fino ou quando precisa do valor anterior; watchEffect para sync simples.',
    tip: 'A confusão entre os dois é a origem de muitos bugs. Demonstrar que você sabe quando cada um executa é o que o entrevistador quer.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre v-if e v-show?',
    a: 'v-if: remove o elemento do DOM quando false — componentes são destruídos (hooks chamados). v-show: aplica display:none — mantém no DOM, preserva estado. Use v-if para elementos que raramente mudam ou custo alto de inicialização. Use v-show para toggle frequente onde preservar estado importa.',
    tip: 'Mencionar que v-if chama os lifecycle hooks (mounted/unmounted) demonstra entendimento além da sintaxe.',
  },
  {
    level: 'Pleno',
    q: 'O que são composables e por que são melhores que mixins?',
    a: 'Composables: funções que encapsulam lógica stateful reutilizável com Composition API (prefixo "use"). Vantagens sobre mixins: origem explícita (não há this.count misterioso), sem colisão de nomes, composição direta, fácil de testar isoladamente. Cada composable registra seu próprio cleanup no onUnmounted.',
    tip: 'A comparação com mixins do Vue 2 e por que composables são superiores mostra conhecimento da evolução do ecossistema.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona provide/inject no Vue 3?',
    a: 'provide(key, value) disponibiliza um valor para toda a subárvore de descendentes. inject(key) consome em qualquer descendente, sem prop drilling. Use InjectionKey (Symbol tipado) para type safety. Passe refs (não primitivos) para que o injetado seja reativo quando o provedor muda.',
    tip: 'A distinção "estado global = Pinia, contexto local = provide/inject" mostra que você sabe escolher a ferramenta certa.',
  },
  {
    level: 'Pleno',
    q: 'Como Vue se compara ao React?',
    a: 'Reatividade: Vue rastreia automaticamente (Proxy), React exige deps explícitas. Templates vs JSX: Vue usa templates HTML com diretivas; React usa JSX. Mutabilidade: Vue permite mutar diretamente; React exige imutabilidade. Two-way: Vue tem v-model; React é unidirecional. Vue tem menos boilerplate para casos simples; React é mais previsível em equipes grandes.',
    tip: 'Não diga que um é melhor. Foque em tradeoffs reais — é o que sênior faz.',
  },
  {
    level: 'Pleno',
    q: 'O que são Options API e Composition API?',
    a: 'Options API (Vue 2 e 3): organiza por tipo de opção — data(), methods, computed. Lógica relacionada fica espalhada. Composition API (Vue 3): organiza por funcionalidade — toda lógica de "contador" fica junta. Melhor TypeScript, melhor reutilização via composables, melhor tree-shaking. Options API ainda é suportada em Vue 3 — não é deprecated.',
    tip: 'Dizer que Options API ainda é válida em Vue 3 mostra maturidade — não demonize o legado.',
  },
  {
    level: 'Senior',
    q: 'Como você tiparia props e emits com TypeScript?',
    a: 'Sintaxe genérica de defineProps: defineProps<{ title: string; count?: number }>() — TypeScript diretamente, sem objeto runtime. withDefaults() para valores padrão. defineEmits<{ update: [value: number]; close: [] }>() — argumentos tipados. Esta sintaxe é exclusiva de script setup.',
    tip: 'A sintaxe genérica vs objeto runtime é a diferença entre type safety completo e inferência parcial. Mostre que você conhece ambas.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona o lifecycle com Composition API?',
    a: 'setup() roda antes de tudo (equivale ao created). Hooks: onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted. Não há equivalente de created — setup() cumpre esse papel. onServerPrefetch existe para SSR (Nuxt) — aguarda Promises antes de renderizar HTML.',
    tip: 'Mencionar que setup() substitui o created e que onServerPrefetch existe para SSR mostra abrangência.',
  },
  {
    level: 'Senior',
    q: 'O que são slots e qual a diferença de scoped slot?',
    a: 'Slot padrão: filho recebe conteúdo via <slot /> (como children do React). Named slots: múltiplos slots nomeados com v-slot:name. Scoped slots: filho expõe dados para o conteúdo do slot — pai pode usar esses dados. Permite o pattern renderless component: filho gerencia lógica, pai controla o visual.',
    tip: 'Scoped slots são o equivalente Vue do render props do React. Dar exemplo de renderless component está no nível sênior.',
  },
  {
    level: 'Pleno',
    q: 'Como compartilha estado global em Vue 3?',
    a: 'Pinia: solução oficial (substitui Vuex). defineStore() com state (refs), getters (computed) e actions. Totalmente tipado, sem módulos aninhados, DevTools integrado. Alternativa para estado simples: composable com refs no escopo do módulo (singleton). Evite Vuex em projetos novos.',
    tip: 'Mencionar que Pinia é a substituição oficial do Vuex e mostrar que composables-singleton existem demonstra maturidade.',
  },
  {
    level: 'Pleno',
    q: 'Como autenticar rotas com Vue Router?',
    a: 'router.beforeEach() global: acessa meta.requiresAuth e redireciona se não autenticado. Retornar objeto de rota redireciona, retornar undefined deixa passar. Combine com Pinia store para ler estado de autenticação. beforeEnter por rota para guards específicos.',
    tip: 'Mostrar a sintaxe de redirect com query string (redirect: to.fullPath) demonstra que você já implementou login redirect real.',
  },
  {
    level: 'Senior',
    q: 'Como funciona o sistema de reatividade Vue 3 internamente (track/trigger)?',
    a: 'ref() cria objeto { value } com getter (chama track) e setter (chama trigger). reactive() cria Proxy profundo. computed() é efeito especial que cacheia e só reavalia quando deps mudam. A granularidade é por propriedade — apenas efeitos que acessaram uma propriedade são notificados quando ela muda.',
    tip: 'Detalhar a diferença de Vue 2 (Object.defineProperty, sem detecção de novas props) vs Vue 3 (Proxy, sem limitações) é sempre bem-vindo.',
  },
  {
    level: 'Senior',
    q: 'Como implementar composable com cleanup adequado?',
    a: 'Lifecycle hooks em composables só funcionam quando chamados durante setup(). Use onMounted/onUnmounted dentro do composable — são chamados automaticamente no componente que usa o composable. watchEffect retorna stop function para cleanup granular. Nunca chame hooks dentro de setTimeout ou callbacks assíncronos.',
    tip: 'Mostrar que hooks de composable só funcionam em setup() — e explicar por quê — diferencia quem realmente usa composables.',
  },
  {
    level: 'Senior',
    q: 'O que é Suspense no Vue 3?',
    a: '<Suspense> renderiza #fallback enquanto filho assíncrono resolve. Funciona com defineAsyncComponent() (lazy load de JS via import dinâmico) ou async setup() (dados assíncronos). Permite loading state declarativo sem flags isLoading. Vue suporta Suspense aninhado. Em Nuxt 3: integrado automaticamente com pages e useFetch.',
    tip: 'Diferenciar defineAsyncComponent (lazy load de bundle) de async setup (dados) mostra que você entende os dois casos de uso.',
  },
  {
    level: 'Senior',
    q: 'Como otimizar performance em listas longas?',
    a: 'v-memo (3.2+): memoiza subárvore — re-renderiza só quando deps especificadas mudam. v-once: estático, nunca re-renderiza. Virtual scrolling (vue-virtual-scroller): só renderiza itens no viewport. KeepAlive: preserva estado ao trocar entre componentes (tabs, rotas). computed() para derivações em vez de expressões no template.',
    tip: 'v-memo é o recurso mais subutilizado. Mencioná-lo junto a virtual scrolling mostra que você conhece o kit completo.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona v-model em componentes customizados?',
    a: 'v-model em componente é açúcar para :modelValue + @update:modelValue. O filho declara prop modelValue e emite update:modelValue. Vue 3 permite múltiplos v-model: v-model:title e v-model:content em um componente. Modificadores customizados são possíveis via modelModifiers.',
    tip: 'Mostrar que v-model:name cria prop name e emit update:name demonstra entendimento do sistema de bindings.',
  },
  {
    level: 'Senior',
    q: 'Qual a diferença entre provide/inject e Pinia?',
    a: 'provide/inject: DI de contexto local — tema de painel específico, instância de serviço restrita a parte da UI. Estado que pertence a uma subárvore. Pinia: estado global da aplicação — compartilhado entre rotas e componentes distantes, com DevTools, persistência, ações assíncronas. Pinia para estado de aplicação; provide/inject para contexto de componente.',
    tip: 'A distinção precisa entre escopo local e global é o que demonstra pensamento arquitetural.',
  },
  {
    level: 'Pleno',
    q: 'Quais são os principais anti-patterns do Vue?',
    a: '1. Mutar prop (use emit). 2. v-if+v-for no mesmo elemento (use computed para filtrar). 3. Desestruturar reactive() (use toRefs ou ref). 4. watch lazy sem immediate (dados não carregam no mount). 5. provide() com primitivo (injetado não é reativo). 6. v-for sem :key ou com index (quebra reconciliação). 7. computed com efeitos colaterais (use watch).',
    tip: 'Listar todos os 7 com o fix específico para cada um demonstra experiência real, não só leitura de docs.',
  },
]

// ── Dados: Cheatsheet ─────────────────────────────────────────────────────────

const CHEATSHEET_HOOKS: HookItem[] = [
  { name: 'ref(value)',                  sig: 'Ref<T>',                                         desc: 'Reativo — acessar com .value' },
  { name: 'reactive(obj)',               sig: 'Proxy<T>',                                       desc: 'Objeto reativo — sem .value' },
  { name: 'computed(() => expr)',        sig: 'ComputedRef<T>',                                 desc: 'Valor derivado, cacheado, lazy' },
  { name: 'watch(src, cb, opts?)',       sig: '(newVal, oldVal) => void',                       desc: 'Observer explícito, lazy por padrão' },
  { name: 'watchEffect(fn)',             sig: '() => void',                                     desc: 'Observer automático, imediato' },
  { name: 'toRefs(reactive)',            sig: 'ToRefs<T>',                                      desc: 'Desestruturar reactive com segurança' },
  { name: 'onMounted(fn)',               sig: '() => void',                                     desc: 'DOM disponível — fetch, DOM refs' },
  { name: 'onUnmounted(fn)',             sig: '() => void',                                     desc: 'Cleanup — timers, listeners, ws' },
  { name: 'provide(key, value)',         sig: 'InjectionKey<T>',                               desc: 'Injetar valor na subárvore' },
  { name: 'inject(key)',                 sig: 'T | undefined',                                  desc: 'Consumir valor injetado' },
  { name: 'defineProps<{ ... }>()',      sig: 'Readonly<Props>',                               desc: 'Props TypeScript em script setup' },
  { name: 'defineEmits<{ ... }>()',      sig: 'EmitFn',                                        desc: 'Emits tipados em script setup' },
  { name: 'defineExpose({ ... })',       sig: 'void',                                          desc: 'Expor métodos ao componente pai' },
]

const CHEATSHEET_RULES: RuleItem[] = [
  { ok: true,  t: 'ref() vs reactive(): Prefira ref() para tudo. reactive() perde reatividade ao desestruturar.' },
  { ok: false, t: 'watch lazy: watch() não roda ao montar. Use { immediate: true } ou watchEffect().' },
  { ok: false, t: 'Mutar prop: Props são readonly — emita evento (update:modelValue) para comunicar ao pai.' },
  { ok: true,  t: 'v-for :key: Sempre use IDs estáveis, nunca index em listas que podem ser reordenadas.' },
  { ok: false, t: 'v-if + v-for: Nunca no mesmo elemento — filtre com computed() antes de v-for.' },
  { ok: false, t: 'provide() reativo: Passe ref, não valor primitivo — primitivos não são reativos após inject.' },
  { ok: false, t: 'Composable cleanup: Lifecycle hooks em composables só funcionam dentro de setup(). Nunca em callbacks.' },
  { ok: true,  t: 'TypeScript props: Use syntax genérica defineProps<{}>() — não objeto runtime. Mais type-safe.' },
]

// ── Dados: Mnemônicos ─────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'Primitivas de reatividade — RCWP',
    trick: 'R-C-W-P',
    expansion: [
      ['R', 'Ref — ref(value), reativo, acessa com .value'],
      ['C', 'Computed — ComputedRef<T>, derivado, cacheado, lazy'],
      ['W', 'Watch/watchEffect — efeitos colaterais, observa mudanças'],
      ['P', 'Proxy — como reactive() funciona internamente no Vue 3'],
    ],
    explanation: '"Reatividade Com Watch e Proxy" — cada letra é uma primitiva usada todo dia em Composition API.',
    example: 'const count = ref(0)\nconst double = computed(() => count.value * 2)\nwatch(count, (n) => console.log(n))',
    why: 'Confundir ref() com reactive() é a causa nº 1 de bugs de reatividade. RCWP é o mapa mental das primitivas.',
  },
  {
    label: 'Lifecycle hooks em ordem — MIOCBU',
    trick: 'M-I-O-C-B-U',
    expansion: [
      ['M', 'onMounted — DOM disponível, fetch inicial, DOM refs'],
      ['I', 'onUpdated — após re-render (cuidado com loops)'],
      ['O', 'onUnmounted — cleanup: timers, listeners, WebSocket'],
      ['C', 'onBeforeMount — antes de montar (raro, setup() cobre)'],
      ['B', 'onBeforeUpdate — antes de re-render (raro)'],
      ['U', 'onBeforeUnmount — último momento antes de destruir'],
    ],
    explanation: '"Montei, Ia Ocupar, Comecei Bem, Usarei depois" — hooks do mais ao menos frequente no dia a dia.',
    example: 'onMounted(() => fetchData())\nonUnmounted(() => clearInterval(timer))',
    why: 'onMounted e onUnmounted são 80% dos casos. Decorar a ordem evita colocar lógica no hook errado.',
  },
  {
    label: 'Diretivas essenciais — SSDIE',
    trick: 'S-S-D-I-E',
    expansion: [
      ['S', 'v-Show — toggle display:none, DOM sempre presente'],
      ['S', 'v-if / v-elSe — remove/recria o DOM, condicional real'],
      ['D', 'v-for com :key — renderização de listas com ID estável'],
      ['I', 'v-If booleano — falsy remove o elemento inteiro do DOM'],
      ['E', 'v-on / @Emit — bind de eventos nativos e customizados'],
    ],
    explanation: '"Show, Show, Display, If, Emit" — as 5 diretivas/patterns que aparecem em todo componente Vue.',
    example: '<span v-show="ok">rápido</span>\n<div v-if="logado">privado</div>\n<li v-for="i in items" :key="i.id">',
    why: 'v-show preserva o DOM (bom para toggle frequente). v-if destrói (bom para conteúdo raramente visível).',
  },
  {
    label: 'Comunicação entre componentes — PESI',
    trick: 'P-E-S-I',
    expansion: [
      ['P', 'Props — pai passa dados para filho (unidirecional)'],
      ['E', 'Emit — filho notifica pai via evento tipado'],
      ['S', 'Slots — pai injeta conteúdo HTML no slot do filho'],
      ['I', 'Inject/provide — qualquer profundidade, sem prop drilling'],
    ],
    explanation: '"PESI" soa como "PESCI" — cada letra é um mecanismo de comunicação em ordem crescente de complexidade.',
    example: "defineProps<{ title: string }>()\ndefineEmits<{ submit: [data: Form] }>()\nprovide('theme', ref('dark'))",
    why: 'Props + Emit cobrem 90% dos casos. Provide/inject é o escape hatch para árvores profundas sem Pinia.',
  },
]

// ── Dados: Anti-patterns ──────────────────────────────────────────────────────

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'Mutar prop diretamente',
    badDesc: 'Props são readonly — mutação direta gera warning e quebra fluxo',
    badCode: [
      { t:'const props = defineProps<{ count: number }>()', c:'#94a3b8' },
      { t:'props.count++  // Warning: mutating prop!', c:'#ef4444' },
    ],
    goodDesc: 'Emitir evento — o pai decide se e como atualizar o valor',
    goodCode: [
      { t:'const emit = defineEmits<{ update: [n: number] }>()', c:'#4ade80' },
      { t:"emit('update', props.count + 1)  // pai decide", c:'#4ade80' },
    ],
    why: 'Props são readonly. Mutar quebra o fluxo unidirecional e torna o estado difícil de rastrear.',
  },
  {
    title: 'v-if e v-for no mesmo elemento',
    badDesc: 'v-if avaliado antes de v-for em Vue 3 — acesso a variável de iteração falha',
    badCode: [
      { t:'<li v-for="item in items"', c:'#94a3b8' },
      { t:'    v-if="item.active"', c:'#ef4444' },
      { t:'    :key="item.id">', c:'#94a3b8' },
    ],
    goodDesc: 'Filtrar com computed() antes do v-for — sem mistura de diretivas',
    goodCode: [
      { t:'// Filtre com computed() primeiro:', c:'#94a3b8' },
      { t:'const active = computed(() => items.filter(i => i.active))', c:'#4ade80' },
      { t:'<li v-for="item in active" :key="item.id">', c:'#4ade80' },
    ],
    why: 'v-if e v-for têm precedência diferente em Vue 2 e 3 — comportamento confuso. Filtre com computed antes.',
  },
  {
    title: 'Desestruturar reactive()',
    badDesc: 'Desestruturação extrai primitivos sem Proxy — reatividade perdida',
    badCode: [
      { t:'const state = reactive({ count: 0 })', c:'#94a3b8' },
      { t:'const { count } = state  // não é reativo!', c:'#ef4444' },
    ],
    goodDesc: 'toRefs() preserva reatividade, ou usar ref() desde o início',
    goodCode: [
      { t:'const { count } = toRefs(state)  // OK', c:'#4ade80' },
      { t:'// Ou prefira ref() desde o início:', c:'#94a3b8' },
      { t:'const count = ref(0)  // sem problema', c:'#4ade80' },
    ],
    why: 'Desestruturar reactive() extrai primitivos sem Proxy — reatividade perdida silenciosamente.',
  },
  {
    title: 'watch() sem immediate — dados não carregam ao montar',
    badDesc: 'watch() é lazy — não executa ao montar, dados ficam vazios',
    badCode: [
      { t:'watch(userId, async (id) => {', c:'#ef4444' },
      { t:'  user.value = await fetchUser(id)', c:'#ef4444' },
      { t:'})  // lazy — não roda ao montar!', c:'#ef4444' },
    ],
    goodDesc: 'Usar { immediate: true } ou watchEffect para execução imediata',
    goodCode: [
      { t:'watch(userId, fetchUser, { immediate: true })', c:'#4ade80' },
      { t:'// ou:', c:'#94a3b8' },
      { t:'watchEffect(() => fetchUser(userId.value))', c:'#4ade80' },
    ],
    why: 'watch() é lazy — não executa no mount. Use immediate: true ou watchEffect para carregar dados ao montar.',
  },
  {
    title: 'provide() com valor primitivo',
    badDesc: 'provide() com .value cria cópia estática — inject não atualiza',
    badCode: [
      { t:'const theme = ref("dark")', c:'#94a3b8' },
      { t:'provide(ThemeKey, theme.value)  // cópia estática!', c:'#ef4444' },
    ],
    goodDesc: 'Passar a ref inteira — inject recebe Ref<T> reativo',
    goodCode: [
      { t:'const theme = ref("dark")', c:'#94a3b8' },
      { t:'provide(ThemeKey, theme)  // ref reativa', c:'#4ade80' },
      { t:'const theme = inject(ThemeKey)  // Ref<string>', c:'#4ade80' },
    ],
    why: 'provide() com primitivo cria cópia estática — o descendente não atualiza. Sempre passe a ref inteira.',
  },
  {
    title: 'v-for sem :key estável (ou com index)',
    badDesc: 'Sem key ou com index, Vue reutiliza elementos errados ao reordenar',
    badCode: [
      { t:'<li v-for="item in items">  // sem key!', c:'#ef4444' },
      { t:'<li v-for="(item, i) in items" :key="i">  // index como key', c:'#ef4444' },
    ],
    goodDesc: 'Usar ID estável do domínio — nunca index de array',
    goodCode: [
      { t:'<li v-for="item in items" :key="item.id">', c:'#4ade80' },
      { t:'// item.id: estável, único — nunca index', c:'#4ade80' },
    ],
    why: 'Sem key ou com index como key, Vue reutiliza elementos errados ao reordenar — estado interno (input, animação) fica no item errado.',
  },
  {
    title: 'computed() com efeitos colaterais',
    badDesc: 'computed() não é puro — efeito colateral executado de forma imprevisível',
    badCode: [
      { t:'const title = computed(() => {', c:'#ef4444' },
      { t:'  document.title = name.value  // efeito colateral!', c:'#ef4444' },
      { t:'  return name.value', c:'#ef4444' },
      { t:'})', c:'#ef4444' },
    ],
    goodDesc: 'computed() puro + watchEffect() para efeitos colaterais',
    goodCode: [
      { t:'const title = computed(() => name.value)  // puro', c:'#4ade80' },
      { t:'watchEffect(() => {', c:'#4ade80' },
      { t:'  document.title = name.value  // efeito colateral aqui', c:'#4ade80' },
      { t:'})', c:'#4ade80' },
    ],
    why: 'computed() deve ser uma função pura. Efeitos colaterais em computed causam comportamento inesperado e não são executados deterministicamente.',
  },
]

// ── Dados: Comparative — Composition API vs Options API ──────────────────────

const COMP_OPTIONS: CompOption[] = [
  { name: 'Options API', color: '#64748b' },
  { name: 'Composition API', color: C },
]

const COMP_CRITERIA: CompCriterion[] = [
  {
    criterion: 'Estado reativo',
    category: 'Reatividade',
    values: {
      'Options API': 'data() { return { count: 0 } }',
      'Composition API': 'const count = ref(0)  // acessa: count.value',
    },
    winner: 'Composition API',
  },
  {
    criterion: 'Valor derivado',
    category: 'Reatividade',
    values: {
      'Options API': 'computed: { double() { return this.count * 2 } }',
      'Composition API': 'const double = computed(() => count.value * 2)',
    },
    winner: 'Composition API',
  },
  {
    criterion: 'Observar mudanças',
    category: 'Reatividade',
    values: {
      'Options API': 'watch: { count(newVal) { ... } }',
      'Composition API': 'watch(count, (n, o) => { ... })  // ou watchEffect',
    },
    winner: 'Composition API',
  },
  {
    criterion: 'Hooks de lifecycle',
    category: 'Lifecycle',
    values: {
      'Options API': 'mounted() { ... }  /  beforeUnmount() { ... }',
      'Composition API': 'onMounted(() => { ... })  /  onUnmounted(() => { ... })',
    },
    winner: 'Composition API',
  },
  {
    criterion: 'Reutilização de lógica',
    category: 'Composição',
    values: {
      'Options API': 'Mixins — colisão de nomes, origem opaca, sem TypeScript',
      'Composition API': 'Composables (use*) — explícitos, tipados, composáveis',
    },
    winner: 'Composition API',
  },
  {
    criterion: 'Tipagem de props',
    category: 'TypeScript',
    values: {
      'Options API': 'props: { title: { type: String, required: true } }',
      'Composition API': 'defineProps<{ title: string; count?: number }>()',
    },
    winner: 'Composition API',
  },
  {
    criterion: 'Tipagem de emits',
    category: 'TypeScript',
    values: {
      'Options API': "emits: ['update']  // sem tipo nos argumentos",
      'Composition API': "defineEmits<{ update: [value: number] }>()",
    },
    winner: 'Composition API',
  },
  {
    criterion: 'Estado global',
    category: 'Ecossistema',
    values: {
      'Options API': 'Vuex — mutations, actions, modules aninhados',
      'Composition API': 'Pinia — defineStore(), sem mutations, tipado',
    },
    winner: 'Composition API',
  },
  {
    criterion: 'Legibilidade para iniciantes',
    category: 'DX',
    values: {
      'Options API': 'Estrutura familiar (data/methods/computed separados)',
      'Composition API': 'Lógica agrupada por funcionalidade — mais verboso no início',
    },
    winner: 'Options API',
  },
  {
    criterion: 'Compatibilidade Vue 2',
    category: 'Migração',
    values: {
      'Options API': 'Nativa — mesma sintaxe em Vue 2 e Vue 3',
      'Composition API': 'Exclusiva do Vue 3 (exceto com @vue/composition-api plugin)',
    },
    winner: 'Options API',
  },
]

const COMP_SCENARIOS: CompScenario[] = [
  {
    scenario: 'Projeto novo com TypeScript',
    recommendation: 'Composition API',
    reason: 'Inferência de tipos completa com defineProps/defineEmits genéricos. Composables são naturalmente tipados.',
  },
  {
    scenario: 'Migração de Vue 2 incremental',
    recommendation: 'Options API',
    reason: 'Manter consistência com a base existente. Vue 3 suporta Options API 100% — não é deprecated.',
  },
  {
    scenario: 'Lógica complexa reutilizável',
    recommendation: 'Composition API',
    reason: 'Composables agrupam toda a lógica relacionada (estado + lifecycle + cleanup) em um arquivo testável.',
  },
  {
    scenario: 'Componente simples de UI (sem lógica)',
    recommendation: 'Options API',
    reason: 'Para componentes puramente de template sem estado complexo, Options API é mais concisa e legível.',
  },
  {
    scenario: 'Equipe nova em Vue',
    recommendation: 'Composition API',
    reason: 'É o futuro do ecossistema Vue. A documentação oficial prioriza Composition API. Melhor investimento.',
  },
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Vue 3',
    stackLabel: 'Frontend / Framework',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'Vue 3',
    accentColor: C,
    stackLabel: 'Frontend / Framework',
    sections: {
      hooks: CHEATSHEET_HOOKS,
      depRows: [],
      rules: CHEATSHEET_RULES,
      performanceTips: [],
      patterns: [],
      mentalModels: [],
    },
  }),
  mnemonics: () => buildMnemonicsPdf({
    skillName: 'Vue 3',
    accentColor: C,
    stackLabel: 'Frontend / Framework',
    mnemonics: MNEMONICS,
  }),
  antipatterns: () => buildAntipatternsPdf({
    skillName: 'Vue 3',
    accentColor: C,
    stackLabel: 'Frontend / Framework',
    antipatterns: ANTIPATTERNS,
  }),
  comparative: () => buildComparativeRefPdf({
    skillName: 'Vue 3',
    accentColor: C,
    stackLabel: 'Frontend / Framework',
    coverTitle: 'Composition API vs Options API',
    options: COMP_OPTIONS,
    criteria: COMP_CRITERIA,
    scenarios: COMP_SCENARIOS,
  }),
}

// ── Componente ────────────────────────────────────────────────────────────────

export default function VuePdfs() {
  const [open, setOpen] = useState<PdfCard | null>(null)
  const hero = PDF_CARDS[0]
  const rest = PDF_CARDS.slice(1)

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
