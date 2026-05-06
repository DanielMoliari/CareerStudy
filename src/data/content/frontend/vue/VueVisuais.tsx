'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { FeaturesCarousel } from '@/components/visuals/FeaturesCarousel'
import type { Feature } from '@/components/visuals/FeaturesCarousel'
import { HookTimeline } from '@/components/visuals/HookTimeline'
import type { TimelinePhase } from '@/components/visuals/HookTimeline'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { CodeStepper } from '@/components/visuals/CodeStepper'
import type { CodeStepperScenario } from '@/components/visuals/CodeStepper'
import { StateMachineExplorer } from '@/components/visuals/StateMachineExplorer'
import type { SMState, SMTransition } from '@/components/visuals/StateMachineExplorer'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'

// ── Paleta Vue ────────────────────────────────────────────────────────────────
const C      = '#4FC08D'   // Vue green
const SEC    = '#2d9c6e'   // secondary
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#4ade80'
const RED    = '#ef4444'
const AMB    = '#f59e0b'
const PRP    = '#a78bfa'
const SKY    = '#38bdf8'
const GOLD   = '#fbbf24'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Composition API vs Options API (FeaturesCarousel)
// ═══════════════════════════════════════════════════════════════════════════════

const API_FEATURES: Feature[] = [
  {
    tag: 'Estado',
    name: 'Declaração de estado reativo',
    color: C,
    beforeLabel: 'Options API',
    afterLabel: 'Composition API',
    before: `export default {
  data() {
    return {
      count: 0,
      name: 'Vue',
    }
  },
}`,
    after: `import { ref } from 'vue'

const count = ref(0)
const name = ref('Vue')
// acessar: count.value`,
    desc: 'Options API usa data() retornando objeto. Composition API usa ref() — mais explícito e funciona com TypeScript sem conversão.',
  },
  {
    tag: 'Computed',
    name: 'Valores derivados',
    color: SEC,
    beforeLabel: 'Options API',
    afterLabel: 'Composition API',
    before: `export default {
  data() { return { count: 0 } },
  computed: {
    double() {
      return this.count * 2
    },
  },
}`,
    after: `import { ref, computed } from 'vue'

const count = ref(0)
const double = computed(
  () => count.value * 2
)`,
    desc: 'computed() é lazy e cacheado — só reavalia quando as dependências mudam. Sem this — mais previsível e testável.',
  },
  {
    tag: 'Watch',
    name: 'Observar mudanças',
    color: C,
    beforeLabel: 'Options API',
    afterLabel: 'Composition API',
    before: `export default {
  data() { return { query: '' } },
  watch: {
    query(newVal, oldVal) {
      this.search(newVal)
    },
  },
}`,
    after: `import { ref, watch } from 'vue'

const query = ref('')
watch(query, (newVal, oldVal) => {
  search(newVal)
})
// ou watchEffect para automático:
// watchEffect(() => search(query.value))`,
    desc: 'watch() é lazy por padrão (não roda ao montar). watchEffect() rastreia dependências automaticamente e executa imediatamente.',
  },
  {
    tag: 'Lifecycle',
    name: 'Hooks de ciclo de vida',
    color: SEC,
    beforeLabel: 'Options API',
    afterLabel: 'Composition API',
    before: `export default {
  mounted() {
    this.fetchData()
  },
  beforeUnmount() {
    clearInterval(this.timer)
  },
}`,
    after: `import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  fetchData()
})
onUnmounted(() => {
  clearInterval(timer)
})`,
    desc: 'Hooks do ciclo de vida são funções chamadas dentro do setup(). Podem ser usados em composables — cada composable registra seu próprio cleanup.',
  },
  {
    tag: 'Composables',
    name: 'Reutilização de lógica',
    color: C,
    beforeLabel: 'Options API (Mixins)',
    afterLabel: 'Composition API (Composable)',
    before: `// Mixin — origem opaca, colisão de nomes
const CounterMixin = {
  data() { return { count: 0 } },
  methods: {
    increment() { this.count++ },
  },
}`,
    after: `// Composable — origem explícita, sem colisão
export function useCounter(init = 0) {
  const count = ref(init)
  const increment = () => count.value++
  return { count, increment }
}
// Uso:
const { count, increment } = useCounter()`,
    desc: 'Composables eliminam os problemas dos mixins: origem explícita de cada propriedade, sem colisão de nomes, composição direta.',
  },
  {
    tag: 'TypeScript',
    name: 'Tipagem de props e emits',
    color: SEC,
    beforeLabel: 'Options API',
    afterLabel: 'script setup + TypeScript',
    before: `export default defineComponent({
  props: {
    title: { type: String, required: true },
    count: { type: Number, default: 0 },
  },
  emits: ['update'],
})`,
    after: `const props = withDefaults(
  defineProps<{
    title: string
    count?: number
  }>(),
  { count: 0 }
)
const emit = defineEmits<{
  update: [value: number]
}>()`,
    desc: 'A sintaxe genérica de defineProps/defineEmits usa TypeScript diretamente — sem objeto de runtime, com autocomplete e verificação de tipos completa.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Ciclo de vida Vue 3 (HookTimeline)
// ═══════════════════════════════════════════════════════════════════════════════

const LIFECYCLE_PHASES: TimelinePhase[] = [
  {
    id: 'setup',
    emoji: '⚙️',
    name: 'setup()',
    color: C,
    short: 'Inicialização',
    detail: 'O setup() roda antes de qualquer hook de lifecycle. É equivalente ao created + beforeCreate do Options API. Aqui você declara estado reativo, computed, watch e registra lifecycle hooks. Sem acesso ao DOM ainda.',
    code: [
      [{ text: 'import', color: PRP }, { text: ' { ref, computed, onMounted } ', color: FG }, { text: 'from', color: PRP }, { text: " 'vue'", color: AMB }],
      [{ text: 'const', color: PRP }, { text: ' count ', color: FG }, { text: '=', color: SKY }, { text: ' ref(0)', color: C }],
      [{ text: 'const', color: PRP }, { text: ' double ', color: FG }, { text: '=', color: SKY }, { text: ' computed(() => count.value * 2)', color: C }],
    ],
  },
  {
    id: 'beforeMount',
    emoji: '🔧',
    name: 'onBeforeMount',
    color: AMB,
    short: 'Pré-montagem',
    detail: 'O template foi compilado e o virtual DOM está pronto, mas ainda não foi inserido no DOM real. Último momento antes do primeiro render. Raramente usado — prefira onMounted para acessar o DOM.',
    code: [
      [{ text: 'onBeforeMount', color: AMB }, { text: '(() => {', color: FG }],
      [{ text: '  // template compilado, DOM ainda não existe', color: FGMUTE }],
      [{ text: '  // useRaramente — prefira onMounted', color: FGMUTE }],
      [{ text: '})', color: FG }],
    ],
  },
  {
    id: 'mounted',
    emoji: '✅',
    name: 'onMounted',
    color: GRN,
    short: 'Montado',
    detail: 'O componente foi inserido no DOM. Aqui você pode acessar elementos do DOM (via template refs), inicializar bibliotecas de terceiros (charts, maps), fazer a primeira chamada de API, configurar event listeners externos.',
    code: [
      [{ text: 'onMounted', color: GRN }, { text: '(async () => {', color: FG }],
      [{ text: '  // DOM disponível — acessar refs', color: FGMUTE }],
      [{ text: '  ', color: FG }, { text: 'await', color: PRP }, { text: ' fetchData()', color: C }],
      [{ text: '  chart.init(canvasRef.value)', color: FGMUTE }],
      [{ text: '})', color: FG }],
    ],
  },
  {
    id: 'updated',
    emoji: '🔄',
    name: 'onUpdated',
    color: SKY,
    short: 'Atualizado',
    detail: 'O componente re-renderizou por mudança de estado ou prop. O DOM está atualizado. Cuidado: modificar estado aqui pode causar loop infinito. Prefira computed ou watch para derivar estado de estado.',
    code: [
      [{ text: 'onUpdated', color: SKY }, { text: '(() => {', color: FG }],
      [{ text: '  // DOM atualizado após re-render', color: FGMUTE }],
      [{ text: '  // ⚠️ NÃO modifique estado aqui!', color: RED }],
      [{ text: '  // Use computed/watch em vez disso', color: FGMUTE }],
      [{ text: '})', color: FG }],
    ],
  },
  {
    id: 'beforeUnmount',
    emoji: '🧹',
    name: 'onBeforeUnmount',
    color: AMB,
    short: 'Pré-desmontagem',
    detail: 'O componente ainda está completamente funcional e no DOM. Último momento para cancelar operações pendentes antes que o cleanup comece. Útil para cancelar requisições ou salvar estado.',
    code: [
      [{ text: 'onBeforeUnmount', color: AMB }, { text: '(() => {', color: FG }],
      [{ text: '  controller.abort() ', color: FGMUTE }, { text: '// cancelar fetch', color: FGMUTE }],
      [{ text: '  saveState(currentState.value)', color: FGMUTE }],
      [{ text: '})', color: FG }],
    ],
  },
  {
    id: 'unmounted',
    emoji: '🗑️',
    name: 'onUnmounted',
    color: RED,
    short: 'Desmontado',
    detail: 'O componente foi removido do DOM. Limpe todos os recursos: event listeners externos, timers, subscriptions, WebSocket connections. Composables devem registrar seu cleanup aqui — é chamado automaticamente quando o componente que usa o composable é desmontado.',
    code: [
      [{ text: 'onUnmounted', color: RED }, { text: '(() => {', color: FG }],
      [{ text: '  clearInterval(timer)', color: GRN }],
      [{ text: '  window.removeEventListener(', color: GRN }, { text: "'resize'", color: AMB }, { text: ', handler)', color: GRN }],
      [{ text: '  ws.close()', color: GRN }],
      [{ text: '})', color: FG }],
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Sistema de reatividade (StateMachineExplorer)
// ═══════════════════════════════════════════════════════════════════════════════

const REACTIVITY_STATES: SMState[] = [
  { id: 'raw',      label: 'Valor raw',     description: 'Valor JavaScript comum. Mudanças não são detectadas. Primitivos (number, string, boolean) ou objetos simples sem reatividade.', color: FGMUTE, isInitial: true },
  { id: 'ref',      label: 'ref()',         description: 'Wrapper reativo para qualquer valor. Acesso via .value em JS, auto-unwrap no template. Funciona com primitivos e objetos. A forma mais recomendada para Composition API.', color: C },
  { id: 'reactive', label: 'reactive()',    description: 'Proxy reativo sobre objeto. Acesso direto sem .value. Gotcha: perde reatividade ao desestruturar. Prefira ref() para evitar armadilhas.', color: SEC },
  { id: 'computed', label: 'computed()',    description: 'Valor derivado cacheado. Só reavalia quando dependências mudam. Lazy por natureza — não roda se não for acessado. Nunca deve ter efeitos colaterais.', color: GRN },
  { id: 'watch',    label: 'watch()',       description: 'Observer explícito com lazy por padrão. Tem acesso ao valor anterior e novo. Use quando precisa do oldValue ou controle fino de quando rodar.', color: AMB },
  { id: 'effect',   label: 'watchEffect()', description: 'Observer automático — rastreia todas as dependências acessadas. Executa imediatamente no mount. Sem acesso ao valor anterior. Ideal para sync simples com efeitos colaterais.', color: PRP },
]

const REACTIVITY_TRANSITIONS: SMTransition[] = [
  { from: 'raw',      to: 'ref',      event: 'ref(valor)',       code: "const x = ref(0)  // x.value = 0" },
  { from: 'raw',      to: 'reactive', event: 'reactive(obj)',    code: "const s = reactive({ x: 0 })" },
  { from: 'ref',      to: 'computed', event: 'computed(getter)', code: "const double = computed(() => x.value * 2)" },
  { from: 'reactive', to: 'computed', event: 'computed(getter)', code: "const sum = computed(() => s.x + s.y)" },
  { from: 'ref',      to: 'watch',    event: 'watch(ref, cb)',   code: "watch(x, (newVal, oldVal) => { })", guard: 'lazy por padrão' },
  { from: 'ref',      to: 'effect',   event: 'watchEffect(fn)',  code: "watchEffect(() => { console.log(x.value) })", guard: 'executa imediatamente' },
  { from: 'reactive', to: 'watch',    event: 'watch(() => s.x)', code: "watch(() => s.x, cb)" },
  { from: 'computed', to: 'watch',    event: 'watch(computed)',  code: "watch(double, cb)" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Sistema de componentes (LayerStack)
// ═══════════════════════════════════════════════════════════════════════════════

const COMPONENT_LAYERS: Layer[] = [
  {
    id: 'props',
    label: 'Props',
    sublabel: 'Dados do pai para o filho — fluxo descendente',
    description: 'Props são readonly — o filho não pode mutar diretamente. Com script setup e TypeScript: defineProps<{ title: string }>() usando genérico. withDefaults() para valores padrão. Violação: mutar uma prop causa warning e cria problemas de rastreabilidade.',
    code: 'const props = withDefaults(defineProps<{ count?: number }>(), { count: 0 })',
    color: C,
    icon: '⬇️',
    examples: ['String, Number, Boolean', 'Array, Object', 'Function (callback)', 'Slot (via slot prop)'],
  },
  {
    id: 'emits',
    label: 'Emits',
    sublabel: 'Eventos do filho para o pai — fluxo ascendente',
    description: 'O filho comunica mudanças ao pai via eventos. Com defineEmits<{ change: [value: number] }>, o TypeScript verifica os argumentos do emit. Evite emitir eventos sem tipagem — use a sintaxe genérica para type safety.',
    code: "const emit = defineEmits<{ change: [value: number]; close: [] }>()\nemit('change', 42)",
    color: SEC,
    icon: '⬆️',
    examples: ['update:modelValue (v-model)', 'click, submit, change', 'item:select, form:submit'],
  },
  {
    id: 'slots',
    label: 'Slots',
    sublabel: 'Conteúdo injetado pelo pai — inversão de controle',
    description: 'Slots permitem que o pai injete conteúdo JSX dentro do filho. Slot padrão: <slot />. Named slots: <slot name="header" />. Scoped slots: <slot :item="item" /> — pai recebe dados do filho (renderless component pattern).',
    code: '// Filho:\n<slot :item="currentItem" :index="idx" />\n// Pai:\n<MyList v-slot="{ item, index }">{{ item.name }}</MyList>',
    color: GRN,
    icon: '🎰',
    examples: ['Slot padrão (children)', 'Named slots (header, footer)', 'Scoped slots (renderless)'],
  },
  {
    id: 'provide-inject',
    label: 'provide / inject',
    sublabel: 'Comunicação sem prop drilling — qualquer profundidade',
    description: 'Alternativa ao prop drilling para dados que precisam chegar a componentes profundamente aninhados. Use InjectionKey (Symbol tipado) para type safety. Passe refs (não primitivos) para que o injetado seja reativo quando o provedor muda.',
    code: "// Pai:\nconst theme = ref('dark')\nprovide(ThemeKey, theme)\n// Descendente:\nconst theme = inject(ThemeKey)  // Ref<string>",
    color: AMB,
    icon: '💉',
    examples: ['Tema (dark/light)', 'Locale/i18n', 'Instância de serviço', 'Configuração de formulário'],
  },
  {
    id: 'pinia',
    label: 'Pinia (estado global)',
    sublabel: 'Estado compartilhado entre rotas e componentes distantes',
    description: 'Pinia é a solução oficial de estado global — substitui Vuex. defineStore() com Composition API: ref/computed/actions diretamente. Reativo, com DevTools, sem módulos aninhados. Use quando provide/inject não é suficiente (estado de aplicação, não de componente).',
    code: "export const useStore = defineStore('main', () => {\n  const count = ref(0)\n  const double = computed(() => count.value * 2)\n  function increment() { count.value++ }\n  return { count, double, increment }\n})",
    color: PRP,
    icon: '🍍',
    examples: ['Auth store (usuário atual)', 'Cart store (e-commerce)', 'UI store (sidebar, modal)'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Vue Router (DecisionTree)
// ═══════════════════════════════════════════════════════════════════════════════

const ROUTER_ROOT: DTNode = {
  id: 'root',
  question: 'Qual aspecto do Vue Router você precisa configurar?',
  children: [
    { label: 'Proteger rota (auth)', nodeId: 'guard', color: RED },
    { label: 'Rota com dados assíncronos', nodeId: 'async', color: AMB },
    { label: 'Lazy loading de componente', nodeId: 'lazy', color: C },
    { label: 'Rota aninhada (layout)', nodeId: 'nested', color: GRN },
  ],
}

const ROUTER_NODES: Record<string, DTNode> = {
  guard: {
    id: 'guard',
    question: 'Onde aplicar o guard de autenticação?',
    children: [
      { label: 'Todas as rotas protegidas', nodeId: 'global-guard', color: RED },
      { label: 'Rota específica', nodeId: 'route-guard', color: AMB },
    ],
  },
  'global-guard': {
    id: 'global-guard',
    recommendation: 'router.beforeEach()',
    detail: "router.beforeEach(async (to) => {\n  const auth = useAuthStore()\n  if (to.meta.requiresAuth && !auth.isLoggedIn) {\n    return { name: 'login', query: { redirect: to.fullPath } }\n  }\n})\n\n// Na rota:\n{ path: '/admin', meta: { requiresAuth: true } }",
    color: RED,
  },
  'route-guard': {
    id: 'route-guard',
    recommendation: 'beforeEnter na rota',
    detail: "{\n  path: '/admin',\n  component: AdminPage,\n  beforeEnter: (to) => {\n    if (!isAdmin()) return '/forbidden'\n  }\n}",
    color: AMB,
  },
  async: {
    id: 'async',
    question: 'Quando buscar os dados?',
    children: [
      { label: 'Antes de navegar (bloqueia)', nodeId: 'before-nav', color: C },
      { label: 'Depois de montar (skeleton)', nodeId: 'after-mount', color: GRN },
    ],
  },
  'before-nav': {
    id: 'before-nav',
    recommendation: 'beforeEnter + Pinia action',
    detail: "// Guard busca dados antes de navegar:\nbeforeEnter: async (to) => {\n  await useStore().fetchItem(to.params.id)\n  // se falhar: return '/not-found'\n}\n// Componente usa dados já prontos do store.",
    color: C,
  },
  'after-mount': {
    id: 'after-mount',
    recommendation: 'onMounted + loading state',
    detail: "// Componente busca dados ao montar:\nconst item = ref(null)\nconst loading = ref(true)\nonMounted(async () => {\n  item.value = await fetchItem(route.params.id)\n  loading.value = false\n})\n// Template mostra skeleton enquanto loading",
    color: GRN,
  },
  lazy: {
    id: 'lazy',
    recommendation: 'Importação dinâmica no component',
    detail: "// Lazy loading — bundle separado por rota:\n{\n  path: '/dashboard',\n  component: () => import('./DashboardPage.vue')\n}\n// Com chunk name para debugging:\ncomponent: () => import(/* webpackChunkName: 'dashboard' */ './DashboardPage.vue')\n// Vite gera chunk automaticamente",
    color: C,
  },
  nested: {
    id: 'nested',
    recommendation: 'children[] + <RouterView> aninhado',
    detail: "// Router:\n{\n  path: '/admin',\n  component: AdminLayout,  // tem <RouterView />\n  children: [\n    { path: 'users', component: UsersPage },\n    { path: 'settings', component: SettingsPage },\n  ]\n}\n// AdminLayout.vue:\n<template>\n  <Sidebar />\n  <RouterView />  <!-- filho renderiza aqui -->\n</template>",
    color: GRN,
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Pinia store passo a passo (CodeStepper)
// ═══════════════════════════════════════════════════════════════════════════════

const PINIA_SCENARIO: CodeStepperScenario = {
  id: 'pinia-store',
  label: 'Counter Store com Pinia',
  language: 'typescript',
  code: `// stores/counter.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  // State
  const count = ref(0)
  const history = ref<number[]>([])

  // Getters (computed)
  const double = computed(() => count.value * 2)
  const isPositive = computed(() => count.value > 0)

  // Actions
  function increment() {
    history.value.push(count.value)
    count.value++
  }

  async function fetchInitialCount() {
    const res = await fetch('/api/counter')
    count.value = await res.json()
  }

  function $reset() {
    count.value = 0
    history.value = []
  }

  return { count, history, double, isPositive, increment, fetchInitialCount, $reset }
})

// Componente.vue (script setup):
const store = useCounterStore()
store.increment()
console.log(store.double)  // reativo`,
  steps: [
    {
      lineStart: 1,
      lineEnd: 4,
      title: 'Importar Pinia e Composition API',
      explanation: 'defineStore() recebe um ID único ("counter") e uma função de setup. O ID é usado pelo DevTools para identificar a store. A função de setup usa ref/computed/funções normais — é idêntica ao script setup de um componente.',
      memory: { 'store ID': '"counter"', 'padrão': 'Composition API (não Options)' },
    },
    {
      lineStart: 6,
      lineEnd: 7,
      title: 'State — refs reativos',
      explanation: 'State em Pinia Composition API são simplesmente refs. Totalmente tipados, reativos. Diferença do Vuex: sem mutations — você muta diretamente em actions. Sem módulos aninhados — stores independentes e composáveis.',
      memory: { 'count': 'ref(0)', 'history': 'ref<number[]>([])' },
    },
    {
      lineStart: 9,
      lineEnd: 11,
      title: 'Getters — computed derivados',
      explanation: 'Getters são computed(). Cacheados automaticamente — só recalculam quando as dependências mudam. Podem acessar outros getters da mesma store ou de outras stores. Evite lógica com efeitos colaterais em getters.',
      memory: { 'double': 'computed — cacheado', 'isPositive': 'computed — cacheado' },
    },
    {
      lineStart: 13,
      lineEnd: 22,
      title: 'Actions — funções síncronas e assíncronas',
      explanation: 'Actions são funções normais — síncronas ou async. Sem necessidade de commits ou dispatches como no Vuex. Mutam state diretamente. Actions podem chamar outras actions ou stores. $reset() é uma convenção para restaurar o estado inicial.',
      memory: { 'increment': 'síncrona', 'fetchInitialCount': 'async', '$reset': 'convenção de reset' },
    },
    {
      lineStart: 24,
      lineEnd: 24,
      title: 'Retornar tudo que o componente pode acessar',
      explanation: 'O return define a interface pública da store — o que os componentes podem acessar. State, getters e actions são todos retornados juntos. Não expor o que é interno à store.',
      output: 'Store criada e disponível em qualquer componente com useCounterStore()',
    },
    {
      lineStart: 27,
      lineEnd: 29,
      title: 'Consumir a store no componente',
      explanation: 'useCounterStore() retorna a store reativa. Acessar propriedades é reativo (store.double atualiza o template). Chamar actions é direto. Para desestruturar e manter reatividade: use storeToRefs(store) para state e getters.',
      memory: { 'store.count': 'reativo', 'store.double': 'reativo (computed)', 'store.increment()': 'action' },
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — Vue 2 vs Vue 3 (ComparisonTable)
// ═══════════════════════════════════════════════════════════════════════════════

const VUE_VERSIONS: ComparisonOption[] = [
  { id: 'vue2', label: 'Vue 2', sublabel: 'Options API / Legado', color: '#64748b' },
  { id: 'vue3', label: 'Vue 3', sublabel: 'Composition API / Atual', color: C },
]

const VERSION_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'reactivity',
    label: 'Sistema de reatividade',
    category: 'Core',
    description: 'Mecanismo de detecção de mudanças',
    values: {
      vue2: { rating: 'fair',      note: 'Object.defineProperty — não detecta adição de propriedades' },
      vue3: { rating: 'excellent', note: 'Proxy ES6 — detecta qualquer acesso/mutação' },
    },
  },
  {
    id: 'typescript',
    label: 'Suporte a TypeScript',
    category: 'DX',
    description: 'Integração nativa com TypeScript',
    values: {
      vue2: { rating: 'fair',      note: 'Vue.extend() — inferência de tipos limitada' },
      vue3: { rating: 'excellent', note: 'defineProps genérico, refs tipados, Volar' },
    },
  },
  {
    id: 'composition',
    label: 'Reutilização de lógica',
    category: 'DX',
    description: 'Como encapsular e reutilizar lógica stateful',
    values: {
      vue2: { rating: 'fair',  note: 'Mixins — colisão de nomes, origem opaca' },
      vue3: { rating: 'excellent', note: 'Composables — explícitos, composáveis, testáveis' },
    },
  },
  {
    id: 'performance',
    label: 'Performance de renderização',
    category: 'Performance',
    description: 'Velocidade de re-render e tamanho do bundle',
    values: {
      vue2: { rating: 'good', note: 'Virtual DOM — OK para a maioria dos casos' },
      vue3: { rating: 'excellent', note: 'VDOM otimizado + compiler hints + tree-shakable' },
    },
  },
  {
    id: 'bundle',
    label: 'Tamanho do bundle',
    category: 'Performance',
    description: 'Tamanho mínimo do runtime',
    values: {
      vue2: { rating: 'good', note: '~23 KB min+gzip — monolítico' },
      vue3: { rating: 'excellent', note: '~10 KB min+gzip — tree-shakable' },
    },
  },
  {
    id: 'fragments',
    label: 'Múltiplos root elements',
    category: 'Template',
    description: 'Template pode ter mais de um elemento raiz',
    values: {
      vue2: { rating: 'poor',      note: 'Um elemento raiz obrigatório' },
      vue3: { rating: 'excellent', note: 'Fragments — múltiplos roots nativos' },
    },
  },
  {
    id: 'teleport',
    label: 'Teleport / Portal',
    category: 'Template',
    description: 'Renderizar em outro lugar do DOM',
    values: {
      vue2: { rating: 'poor', note: 'Não nativo — biblioteca externa' },
      vue3: { rating: 'excellent', note: '<Teleport to="#modals"> — nativo' },
    },
  },
  {
    id: 'state',
    label: 'Gerenciamento de estado',
    category: 'Ecossistema',
    description: 'Solução oficial recomendada',
    values: {
      vue2: { rating: 'fair',      note: 'Vuex 3 — boilerplate, módulos aninhados' },
      vue3: { rating: 'excellent', note: 'Pinia — simples, tipado, sem mutations' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 8 — Anti-patterns Vue (AntiPatternsGallery)
// ═══════════════════════════════════════════════════════════════════════════════

const VUE_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'Mutar prop diretamente',
    wrong: [
      [{ text: 'const props = defineProps<{ count: number }>()', color: FGMUTE }],
      [{ text: '// Mutação direta da prop — ERRO!', color: RED }],
      [{ text: 'function increment() {', color: FGMUTE }],
      [{ text: '  props.count++', color: RED }, { text: '  // Warning: prop mutation', color: RED }],
      [{ text: '}', color: FGMUTE }],
    ],
    right: [
      [{ text: 'const props = defineProps<{ count: number }>()', color: FGMUTE }],
      [{ text: 'const emit = defineEmits<{ update: [value: number] }>()', color: GRN }],
      [{ text: 'function increment() {', color: FGMUTE }],
      [{ text: "  emit('update', props.count + 1)", color: GRN }, { text: '  // pai decide', color: GRN }],
      [{ text: '}', color: FGMUTE }],
    ],
    why: 'Props são readonly — o filho não tem autoridade para mudar. Emita evento e deixe o pai decidir. Mutação direta quebra o fluxo de dados unidirecional e causa bugs difíceis de rastrear.',
  },
  {
    title: 'v-if e v-for no mesmo elemento',
    wrong: [
      [{ text: '<template>', color: FGMUTE }],
      [{ text: '  <li v-for="item in items" v-if="item.active"', color: RED }],
      [{ text: '    :key="item.id">', color: RED }],
      [{ text: '  <!-- v-for sempre cria todos os itens -->', color: RED }],
      [{ text: '  </li>', color: FGMUTE }],
      [{ text: '</template>', color: FGMUTE }],
    ],
    right: [
      [{ text: '<template>', color: FGMUTE }],
      [{ text: '  <template v-for="item in items" :key="item.id">', color: GRN }],
      [{ text: '    <li v-if="item.active">{{ item.name }}</li>', color: GRN }],
      [{ text: '  </template>', color: GRN }],
      [{ text: '  <!-- ou: const activeItems = computed(() => items.filter(i => i.active)) -->', color: GRN }],
      [{ text: '</template>', color: FGMUTE }],
    ],
    why: 'v-for tem prioridade maior que v-if em Vue 2, menor em Vue 3 — comportamento confuso. Separe sempre. Melhor ainda: filtre com computed() antes de renderizar.',
  },
  {
    title: 'Desestruturar reactive() — perde reatividade',
    wrong: [
      [{ text: 'const state = reactive({ count: 0, name: "Vue" })', color: FGMUTE }],
      [{ text: '// Desestruturar quebra a reatividade!', color: RED }],
      [{ text: 'const { count, name } = state', color: RED }],
      [{ text: '// count e name são primitivos agora', color: RED }, { text: ' — não reativos', color: RED }],
    ],
    right: [
      [{ text: 'const state = reactive({ count: 0, name: "Vue" })', color: FGMUTE }],
      [{ text: '// Opção 1: toRefs()', color: GRN }],
      [{ text: 'const { count, name } = toRefs(state)', color: GRN }],
      [{ text: '// Opção 2: use ref() desde o início (melhor)', color: GRN }],
      [{ text: 'const count = ref(0)', color: GRN }],
      [{ text: 'const name = ref("Vue")', color: GRN }],
    ],
    why: 'reactive() cria um Proxy. Desestruturar extrai os valores primitivos sem o Proxy — a reatividade é perdida silenciosamente. Use toRefs() ou prefira ref() para tudo.',
  },
  {
    title: 'watch() esquecendo o immediate para roda no mount',
    wrong: [
      [{ text: 'const userId = ref(route.params.id)', color: FGMUTE }],
      [{ text: '// Bug: não carrega dados ao montar!', color: RED }],
      [{ text: 'watch(userId, async (id) => {', color: RED }],
      [{ text: '  user.value = await fetchUser(id)', color: RED }],
      [{ text: '})', color: RED }],
      [{ text: '// watch é lazy — só roda quando userId MUDA', color: RED }],
    ],
    right: [
      [{ text: 'const userId = ref(route.params.id)', color: FGMUTE }],
      [{ text: '// Opção 1: immediate: true', color: GRN }],
      [{ text: 'watch(userId, async (id) => {', color: GRN }],
      [{ text: '  user.value = await fetchUser(id)', color: GRN }],
      [{ text: '}, { immediate: true })', color: GRN }],
      [{ text: '// Opção 2: watchEffect (automático)', color: GRN }],
      [{ text: 'watchEffect(async () => { user.value = await fetchUser(userId.value) })', color: GRN }],
    ],
    why: 'watch() é lazy por padrão — não roda ao montar. Sem immediate: true, os dados nunca são carregados na primeira renderização.',
  },
  {
    title: 'provide() com valor primitivo — perde reatividade',
    wrong: [
      [{ text: '// Pai:', color: FGMUTE }],
      [{ text: 'const theme = ref("dark")', color: FGMUTE }],
      [{ text: '// Errado: passa o valor, não a ref', color: RED }],
      [{ text: 'provide(ThemeKey, theme.value)', color: RED }],
      [{ text: '// Filho recebe "dark" estático — sem reatividade', color: RED }],
    ],
    right: [
      [{ text: '// Pai:', color: FGMUTE }],
      [{ text: 'const theme = ref("dark")', color: FGMUTE }],
      [{ text: '// Correto: passa a ref inteira', color: GRN }],
      [{ text: 'provide(ThemeKey, theme)', color: GRN }],
      [{ text: '// Filho usa inject:', color: FGMUTE }],
      [{ text: 'const theme = inject(ThemeKey)  // Ref<string>', color: GRN }],
    ],
    why: 'provide() com primitivo cria uma cópia estática. O descendente não atualiza quando o pai muda o valor. Passe sempre a ref completa.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export default function VueVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'options-vs-composition',
      title: 'Composition API vs Options API',
      subtitle: 'Estado, computed, watch, lifecycle e TypeScript — before/after',
      accent: C,
      component: (
        <FeaturesCarousel
          features={API_FEATURES}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'lifecycle',
      title: 'Ciclo de vida Vue 3',
      subtitle: 'setup → onBeforeMount → onMounted → onUpdated → onUnmounted',
      accent: GRN,
      component: (
        <HookTimeline
          phases={LIFECYCLE_PHASES}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'reactivity',
      title: 'Sistema de reatividade',
      subtitle: 'ref, reactive, computed, watch e watchEffect — como se relacionam',
      accent: SEC,
      component: (
        <StateMachineExplorer
          states={REACTIVITY_STATES}
          transitions={REACTIVITY_TRANSITIONS}
          initialState="raw"
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'component-system',
      title: 'Sistema de componentes',
      subtitle: 'props, emits, slots, provide/inject e Pinia — comunicação entre componentes',
      accent: AMB,
      component: (
        <LayerStack
          layers={COMPONENT_LAYERS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'vue-router',
      title: 'Vue Router — decisões de configuração',
      subtitle: 'Guards, dados assíncronos, lazy loading e rotas aninhadas',
      accent: SKY,
      component: (
        <DecisionTree
          root={ROUTER_ROOT}
          nodes={ROUTER_NODES}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'pinia',
      title: 'Pinia store passo a passo',
      subtitle: 'defineStore, state, getters, actions e consumo no componente',
      accent: PRP,
      component: (
        <CodeStepper
          scenarios={[PINIA_SCENARIO]}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'vue2-vs-vue3',
      title: 'Vue 2 vs Vue 3',
      subtitle: 'Reatividade, TypeScript, performance, Pinia vs Vuex e novos recursos',
      accent: GOLD,
      component: (
        <ComparisonTable
          options={VUE_VERSIONS}
          criteria={VERSION_CRITERIA}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns Vue',
      subtitle: 'Mutação de prop, v-if+v-for, reactive desestruturado, watch lazy, provide primitivo',
      accent: RED,
      component: (
        <AntiPatternsGallery
          patterns={VUE_ANTIPATTERNS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
  ]

  // suppress unused warnings
  void LINE; void FG; void FGMUTE; void PRP; void SKY; void AMB; void RED; void GRN; void SEC; void GOLD; void CARD

  return (
    <VisuaisShell
      visuals={visuals}
      active={active}
      onChange={setActive}
    />
  )
}
