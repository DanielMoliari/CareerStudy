import type { SkillContent } from '@/types'

const vue: SkillContent = {
    tagline: "Framework JavaScript progressivo para construir interfaces com sistema reativo baseado em Proxy.",
    why: "Vue é amplamente adotado no mercado brasileiro e europeu. Composition API (Vue 3) alinha Vue com padrões modernos de hooks. Saber Vue abre vagas onde React não domina — e saber comparar os dois em entrevista é diferencial real.",
    prerequisite: "JavaScript ES6+ (arrow functions, destructuring, spread, módulos, Promises, async/await). HTML e CSS básicos. Entender o conceito de componente e eventos do DOM facilita muito a curva inicial.",
    summary: "Vue é um framework JavaScript progressivo com sistema de reatividade baseado em Proxy (Vue 3). Tem Composition API (similar a React hooks, mas com reatividade automática) e Options API (legado, Vue 2). Template syntax com diretivas declarativas (v-if, v-for, v-model). Ecossistema maduro: Pinia (estado global), Vue Router, Nuxt (meta-framework), Vite (build). O grande diferencial do Vue em relação ao React é a reatividade automática: você muta o estado diretamente e o Vue rastreia quais partes do template dependem de quê, atualizando só o necessário. Isso resulta em menos boilerplate para casos simples, mas exige entender o modelo de Proxy para não quebrar a reatividade.",
    howToStudy: "<strong>Modelo mental central:</strong> <code>setup()</code> é o coração — tudo que você retorna de setup está disponível no template. refs são reativos, computed é derivado (memorizado), watch observa efeitos colaterais. Composition API = hooks React, mas com rastreamento automático de dependências.<br><br><strong>Sequência recomendada:</strong><ol><li>Comece pela Composition API com <code>&lt;script setup&gt;</code> — ignore Options API por enquanto (é legado).</li><li>Entenda ref vs reactive, e por que desestruturar reactive quebra reatividade.</li><li>Aprenda as diretivas (v-if, v-for, v-model) e o ciclo de vida (onMounted, onUnmounted).</li><li>Construa um pequeno app: todo list com Pinia, Vue Router e Composition API.</li><li>Depois: composables, provide/inject, Teleport, watchEffect vs watch.</li></ol><br><strong>Em 30 minutos:</strong> Leia o tutorial oficial (vuejs.org/tutorial) — é interativo e cobre ref, template, v-if, v-for, eventos e formulários.<br><strong>Em um fim de semana:</strong> Faça o tutorial completo + crie um app CRUD com Pinia e Vue Router.<br><strong>Em uma semana:</strong> Nuxt 3 (meta-framework), composables avançados, TypeScript com defineProps, testes com Vitest.",
    diagrams: [
      {
        title: "Sistema de reatividade Vue 3 — Proxy rastreando dependências automaticamente",
        html: `<style>
.vue-diag{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.vue-box{background:#1e293b;border-radius:8px;padding:10px 14px;border:1.5px solid #334155;font-size:11px}
.vue-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(65,184,131,.4);display:inline}
.vue-tip:hover .vue-tb{display:block}
.vue-tb{display:none;position:absolute;bottom:calc(100%+8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:220px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.vue-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
@keyframes vue-pulse{0%,100%{opacity:.3}50%{opacity:1}}
.vue-flow-dot{animation:vue-pulse 1.6s ease-in-out infinite}
.vue-flow-dot:nth-child(2){animation-delay:.3s}
.vue-flow-dot:nth-child(3){animation-delay:.6s}
</style>
<div class="vue-diag">
  <p style="color:#41b883;font-size:12px;font-weight:700;margin:0 0 4px">Vue 3 — reatividade por Proxy</p>
  <p style="color:#475569;font-size:10px;margin:0 0 18px">Passe o mouse nos termos <span style="border-bottom:1px dashed rgba(65,184,131,.4)">sublinhados</span></p>
  <div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:12px">
    <div class="vue-box" style="flex:1">
      <div style="font-size:9px;color:#41b883;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px">1 — Você define estado</div>
      <div style="color:#94a3b8;line-height:2">
        <span style="color:#7c3aed">const</span> state = <span class="vue-tip">reactive<span class="vue-tb">reactive() envolve o objeto num Proxy. Qualquer acesso (get) registra a dependência. Qualquer mutação (set) notifica os efeitos que dependem dela.</span></span>({ count: 0 })<br>
        <span style="color:#7c3aed">const</span> double = <span class="vue-tip">computed<span class="vue-tb">computed() cria um valor derivado. Roda automaticamente quando suas dependências mudam — e só então.</span></span>(() =&gt; state.count * 2)<br>
        <span style="color:#7c3aed">function</span> inc() { <span class="vue-tip">state.count++<span class="vue-tb">Mutação direta! Vue intercepta via Proxy setter e notifica os efeitos que dependem de state.count.</span></span> }
      </div>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:0 6px;padding-top:24px">
      <span class="vue-flow-dot" style="color:#41b883;font-size:14px">▶</span>
      <span class="vue-flow-dot" style="color:#41b883;font-size:14px">▶</span>
      <span class="vue-flow-dot" style="color:#41b883;font-size:14px">▶</span>
    </div>
    <div class="vue-box" style="flex:1">
      <div style="font-size:9px;color:#35495e;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px;color:#a8b3cf">2 — Template usa o estado</div>
      <div style="color:#94a3b8;line-height:2">
        &lt;<span style="color:#41b883">template</span>&gt;<br>
        &nbsp;&lt;p&gt;{{ <span class="vue-tip">state.count<span class="vue-tb">Ao renderizar, Vue registra state.count como dependência deste nó de template. Quando count muda, só este nó é atualizado.</span></span> }}&lt;/p&gt;<br>
        &nbsp;&lt;p&gt;{{ double }}&lt;/p&gt;<br>
        &nbsp;&lt;button <span class="vue-tip">@click<span class="vue-tb">Açúcar para v-on:click. Chama inc(), que muta state.count, que dispara re-render seletivo.</span></span>="inc"&gt;+&lt;/button&gt;<br>
        &lt;/<span style="color:#41b883">template</span>&gt;
      </div>
    </div>
  </div>
  <div style="background:#1e293b;border:1px solid #1a3a2a;border-radius:8px;padding:12px 16px">
    <div style="font-size:9px;color:#41b883;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px">Diferença-chave: Vue vs React</div>
    <div style="display:flex;gap:10px">
      <div style="flex:1;font-size:11px;color:#94a3b8;line-height:1.7">
        <strong style="color:#41b883">Vue</strong>: rastreia dependências <em>automaticamente</em> via Proxy. Sem array de deps. Só o que mudou re-renderiza.
      </div>
      <div style="flex:1;font-size:11px;color:#94a3b8;line-height:1.7">
        <strong style="color:#61DAFB">React</strong>: você declara deps explicitamente (useEffect([dep])). Imutabilidade — criar novo objeto para mudar.
      </div>
    </div>
  </div>
</div>`,
        caption: "Vue usa Proxy para rastrear dependências automaticamente — sem array de deps como no React. Só o que realmente mudou dispara re-render.",
      },
    ],
    keypoints: [
      { title: "Composition API e script setup", body: "Vue 3 introduziu Composition API: ref(), reactive(), computed(), watch(), onMounted() e outros. <script setup> é a sintaxe moderna — elimina o return manual e o componente fica mais conciso. Similar a React hooks em estrutura mas diferente em mecanismo: Vue rastreia dependências automaticamente por Proxy, sem array de deps manual.", code: `<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const count = ref(0)
const double = computed(() => count.value * 2)

function inc() { count.value++ }

onMounted(() => {
  console.log('componente montado, count =', count.value)
})
</script>

<template>
  <button @click="inc">{{ count }} × 2 = {{ double }}</button>
</template>` },
      { title: "Sistema de reatividade com Proxy", body: "Vue 3 usa Proxy JavaScript para interceptar acesso e mutação de propriedades. Quando um computed ou watchEffect roda, qualquer acesso a propriedade reativa registra uma dependência. Quando muda, Vue re-executa só o que depende dela. O gotcha crítico: desestruturar reactive() quebra a reatividade porque os valores primitivos extraídos não são mais Proxies.", code: `const state = reactive({ count: 0, name: 'Vue' })

// ✗ QUEBRA reatividade — count é number puro:
const { count } = state

// ✓ CORRETO — use toRefs para manter reatividade:
const { count } = toRefs(state) // count.value é reativo

// ✓ OU use ref() desde o início (mais simples):
const count = ref(0) // sem problema de desestruturação` },
      { title: "ref() vs reactive()", body: "ref() cria um wrapper reativo para qualquer valor (primitivo ou objeto). Acesso via .value em JS, auto-unwrap no template. reactive() cria um objeto Proxy — acesso direto sem .value, mas perde reatividade ao desestruturar. Convenção atual: prefira ref() para tudo — é mais consistente.", code: `const n = ref(0)         // n.value em JS, {{n}} no template
const nome = ref('Vue')  // funciona com primitivos

const obj = reactive({ x: 1, y: 2 }) // obj.x — sem .value
// Mas: const { x } = obj  →  x não é reativo!

// shallowRef e shallowReactive para performance:
const big = shallowRef({ items: [] }) // só .value é reativo, não .value.items` },
      { title: "watch vs watchEffect", body: "watch() observa uma ou mais fontes explícitas e recebe o valor anterior — lazy por padrão (não roda ao montar). watchEffect() rastreia automaticamente todas as dependências acessadas dentro dele e roda imediatamente. Use watch quando precisar do valor anterior ou querer controle fino; watchEffect para efeitos que simplesmente reagem a estado.", code: `// watch — explícito, lazy, tem oldVal:
watch(count, (newVal, oldVal) => {
  console.log('mudou de', oldVal, 'para', newVal)
})
watch(count, callback, { immediate: true }) // roda no mount

// watchEffect — automático, imediato:
watchEffect(() => {
  // qualquer ref acessada aqui vira dependência
  document.title = \`Contagem: \${count.value}\`
})` },
      { title: "v-model e two-way binding", body: "v-model em input é açúcar para :value + @input. Em componentes customizados: prop modelValue + emit('update:modelValue', val). Vue 3 permite múltiplos v-model em um único componente com modificadores.", code: `<!-- equivalente: -->
<input :value="name" @input="name = $event.target.value" />
<input v-model="name" />

<!-- Componente com v-model (script setup): -->
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

<!-- Uso com múltiplos v-model: -->
<MeuInput v-model:title="titulo" v-model:content="conteudo" />` },
      { title: "Diretivas essenciais", body: "v-if/v-else: renderização condicional — remove do DOM. v-show: display:none — mantém no DOM. v-for com :key obrigatório. v-bind (ou :) para atributos dinâmicos. v-on (ou @) para eventos. v-memo para memoização de sublistas (performance).", code: `<template>
  <!-- v-if remove do DOM; v-show aplica display:none -->
  <Modal v-if="isOpen" />
  <Tooltip v-show="hovered" />

  <!-- v-for com key estável (não use index!) -->
  <li v-for="item in items" :key="item.id">{{ item.name }}</li>

  <!-- v-bind shorthand -->
  <img :src="url" :alt="desc" />

  <!-- v-on shorthand + modificadores -->
  <form @submit.prevent="handleSubmit">
    <input @keyup.enter="confirm" />
  </form>
</template>` },
      { title: "defineProps e defineEmits com TypeScript", body: "Com script setup, use defineProps e defineEmits (macros de compilador — não precisam de import). Props são readonly. withDefaults fornece valores padrão. defineExpose expõe métodos para o componente pai via template ref.", code: `// Props com TypeScript genérico:
const props = withDefaults(
  defineProps<{ title: string; count?: number; disabled?: boolean }>(),
  { count: 0, disabled: false }
)

// Emits tipados:
const emit = defineEmits<{
  change: [value: number]
  close: []
}>()

// Expor para o pai:
defineExpose({ focus, reset })` },
      { title: "provide e inject — comunicação sem props drilling", body: "provide/inject é o equivalente ao React Context. O componente pai fornece um valor com provide(); componentes descendentes (em qualquer profundidade) consomem com inject(). Use InjectionKey para type safety.", code: `// Pai — define e fornece:
import { provide, ref } from 'vue'
import type { InjectionKey, Ref } from 'vue'

export const ThemeKey: InjectionKey<Ref<'dark' | 'light'>> = Symbol('theme')

const theme = ref<'dark' | 'light'>('dark')
provide(ThemeKey, theme)

// Descendente — consome:
import { inject } from 'vue'
const theme = inject(ThemeKey)  // Ref<'dark' | 'light'>
// Com default:
const theme = inject(ThemeKey, ref('light'))` },
      { title: "Pinia — estado global moderno", body: "Pinia substituiu Vuex como solução oficial de estado global. defineStore() cria uma store com state, getters (computed) e actions. Totalmente tipado, sem módulos aninhados, DevTools integrado. Suporta tanto Options API quanto Composition API em stores.", code: `// stores/counter.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const double = computed(() => count.value * 2)

  function increment() { count.value++ }
  async function fetchAndReset() {
    await api.reset()
    count.value = 0
  }

  return { count, double, increment, fetchAndReset }
})

// Componente:
const store = useCounterStore()
store.increment()` },
    ],
    gotchas: [
      "reactive() perde reatividade quando desestruturado diretamente. Use toRefs() para converter para refs individuais reativos, ou prefira ref() desde o início.",
      "v-for sem :key ou com index como key quebra o estado interno de componentes quando a lista é reordenada. Use IDs únicos estáveis — nunca index se a lista pode ser reordenada.",
      "watch() é lazy por padrão — não roda na montagem. Use watchEffect() para rodar imediatamente, ou { immediate: true } no watch. Confundir os dois causa bugs sutis.",
      "Classes dinâmicas: :class aceita objeto (true/false) ou array. String direta funciona, mas interpolação não é reactiva: use :class ao invés de class com template string.",
      "Componentes são case-sensitive em script setup mas templates HTML (não-SFC) são case-insensitive. Use PascalCase em JS e kebab-case no template para compatibilidade máxima.",
      "v-model em componente customizado usa modelValue como nome de prop por padrão. Se a prop se chamar outra coisa, use v-model:nomeDaProp — e declare o emit correspondente.",
      "provide/inject não é reativo por padrão se você passar um valor primitivo. Envolva em ref() ou reactive() para que o injetado atualize quando o provedor muda.",
      "Computed é lazy e cacheado — não deve ter efeitos colaterais. Se você precisa de efeito colateral baseado em estado reativo, use watch ou watchEffect.",
      "Lifecycle hooks em composables devem ser chamados de forma síncrona dentro do setup() — não dentro de setTimeout ou fetch callbacks. Caso contrário, não serão registrados no componente.",
    ],
    interview: [
      {
        q: "Qual a diferença entre ref() e reactive() no Vue 3?",
        a: "<p><strong>ref()</strong>: envolve qualquer valor (primitivo ou objeto) em um container reativo. Acesso via .value em JavaScript, auto-unwrap no template. Funciona com primitivos (strings, numbers) — reactive() não funciona com primitivos.</p><p><strong>reactive()</strong>: transforma um objeto em Proxy reativo diretamente. Acesso sem .value. Problema: perde reatividade quando desestruturado — os valores extraídos são primitivos sem ligação ao Proxy.</p><p>Convenção moderna com Composition API: prefira ref() para tudo — é mais consistente e funciona com toRefs() quando necessário. Evita o gotcha de desestruturação.</p>",
        tip: "Citar o problema de desestruturação do reactive() é o ponto que mais pega em entrevista. Quem só leu a docs superficialmente não menciona.",
        level: "pleno",
      },
      {
        q: "Como funciona o sistema de reatividade do Vue 3?",
        a: "<p>Vue 3 usa JavaScript Proxy para interceptar acesso (get) e mutação (set) de propriedades. Quando um computed ou watchEffect roda, qualquer acesso a propriedade reativa registra uma dependência. Quando essa propriedade muda, Vue re-executa os efeitos que dependem dela.</p><p>É diferente do React: Vue rastreia dependências automaticamente por acesso, sem array de deps manual. A granularidade é por propriedade — só o que realmente mudou dispara re-render. Vue 2 usava Object.defineProperty (com limitações: não detectava adição de propriedades ou mudanças em array por índice). Vue 3 com Proxy não tem essas limitações.</p>",
        tip: "Comparar com o React (sem array de deps, rastreamento automático) e mencionar a limitação do Vue 2 mostra que você entende a evolução do framework, não só a API atual.",
        level: "senior",
      },
      {
        q: "Qual a diferença entre v-if e v-show?",
        a: "<p><strong>v-if</strong>: remove o elemento do DOM completamente quando false. Componentes dentro são destruídos (lifecycle hooks chamados). Custo alto na alternância, mas zero custo quando false — nada está no DOM.</p><p><strong>v-show</strong>: aplica display:none — elemento permanece no DOM. Componente mantém estado. Custo baixo na alternância, mas custo inicial sempre presente.</p><p>Use v-if para elementos que raramente mudam ou que têm custo alto de inicialização (vídeo, mapa, componente complexo). Use v-show para toggle frequente (menu, drawer, tooltip) onde quer preservar estado e animação suave.</p>",
        level: "pleno",
      },
      {
        q: "Como você compartilha estado global em Vue 3?",
        a: "<p><strong>Pinia</strong> é a solução oficial (substituiu Vuex). Define stores com defineStore(). Stores são reativas, têm state, getters (computed) e actions. Fácil de usar com Composition API — useStore() direto no setup. Totalmente tipado, sem módulos aninhados, DevTools integrado.</p><p><strong>Composables</strong> com ref/reactive no escopo do módulo: para estado simples compartilhado entre poucos componentes, um composable com refs exportados funciona bem sem Pinia — o estado é singleton por módulo.</p><p>Evite Vuex em projetos novos Vue 3 — Pinia tem melhor DX, TypeScript support e API muito mais simples.</p>",
        tip: "Mencionar que Pinia é a substituição oficial do Vuex e que o próprio time Vue recomenda mostra que você está atualizado. Diferenciar de composables-singleton para estado simples mostra maturidade.",
        level: "pleno",
      },
      {
        q: "Qual a diferença entre watch e watchEffect no Vue 3?",
        a: "<p><strong>watch()</strong>: observa fontes explícitas (ref, reactive, computed, ou array deles). Recebe valor anterior e novo. Lazy por padrão (não roda na montagem — use immediate: true). Mais controle.</p><p><strong>watchEffect()</strong>: rastreia automaticamente todas as dependências acessadas dentro da função. Roda imediatamente no mount. Sem acesso ao valor anterior.</p><p>Use watch quando precisa do oldValue, quando quer ser explícito sobre o que observa, ou quando quer lazy execution. Use watchEffect para efeitos que simplesmente sincronizam estado com algo externo (título da página, local storage, chamadas de API simples).</p>",
        tip: "A confusão entre os dois é a origem de muitos bugs em Vue — quem sabe a diferença precisa e pratica Composition API de verdade.",
        level: "pleno",
      },
      {
        q: "Como Vue se compara ao React em termos de modelo mental?",
        a: "<p><strong>Reatividade</strong>: Vue rastreia dependências automaticamente (Proxy) — sem array de deps. React requer deps explícitas em hooks e imutabilidade.</p><p><strong>Templates vs JSX</strong>: Vue usa templates HTML com diretivas (mais familiar para devs HTML). React usa JSX (mais expressivo, JavaScript puro, sem aprender diretivas).</p><p><strong>Mutabilidade</strong>: Vue permite mutar estado diretamente (reactive.prop = valor). React exige criar novo objeto/array.</p><p><strong>Dois-way binding</strong>: Vue tem v-model. React é unidirecional por padrão.</p><p>Vue tem menos boilerplate para casos simples. React é mais previsível e escala melhor em equipes grandes — imutabilidade torna o fluxo de dados explícito. Vue 3 com TypeScript encurtou a distância, mas a filosofia de mutabilidade controlada vs imutabilidade permanece a diferença central.</p>",
        tip: "Em entrevista, evite dizer que um é melhor. Foque nos tradeoffs reais — é o que sênior faz.",
        level: "senior",
      },
      {
        q: "O que são composables no Vue 3?",
        a: "<p>Composables são funções que encapsulam lógica stateful reutilizável usando Composition API — equivalente exato dos React custom hooks. Convenção: nome começa com 'use'.</p><pre><code>// useCounter.ts\nexport function useCounter(initial = 0) {\n  const count = ref(initial)\n  const double = computed(() => count.value * 2)\n  function increment() { count.value++ }\n  function decrement() { count.value-- }\n  return { count, double, increment, decrement }\n}</code></pre><p>Vantagens sobre mixins (Vue 2): sem colisão de nomes (cada composable retorna um objeto nomeado), origem clara de cada propriedade, composição explícita, fácil de testar isoladamente.</p>",
        tip: "Mencionar a comparação com mixins do Vue 2 e por que composables são superiores é diferencial — mostra conhecimento da evolução do ecossistema.",
        level: "pleno",
      },
      {
        q: "Como funciona provide/inject no Vue 3 e quando usar?",
        a: "<p>provide/inject é o mecanismo de injeção de dependência do Vue — equivalente ao React Context. O ancestral fornece com provide(key, value); descendentes consomem com inject(key). Não precisa passar por props intermediárias (evita prop drilling).</p><p>Para type safety: use InjectionKey (Symbol tipado) — evita erros de chave e dá autocomplete no inject. Passe refs, não valores primitivos, se quiser que o injetado seja reativo.</p><p>Use para: temas, locale, instâncias de serviço compartilhadas, configurações de componentes que precisam chegar a componentes profundamente aninhados. Não abuse — Pinia é melhor para estado global complexo.</p>",
        level: "senior",
      },
      {
        q: "O que são Options API e Composition API e quando usar cada uma?",
        a: "<p><strong>Options API</strong> (Vue 2 e Vue 3): organiza código por tipo de opção — data(), methods, computed, watch, lifecycle hooks. Familiar e estruturado. Dificuldade: lógica relacionada fica espalhada em múltiplas seções.</p><p><strong>Composition API</strong> (Vue 3): organiza por funcionalidade — toda a lógica de 'contador' fica junta, independente de ser data/método/computed. Melhor reutilização via composables. TypeScript-first. script setup é a forma moderna.</p><p>Recomendação: use Composition API com script setup em todos os projetos novos. Migre gradualmente codebases existentes. Options API ainda é totalmente suportada e válida em Vue 3 — não é deprecated.</p>",
        tip: "Dizer que Options API ainda é válida em Vue 3 (não deprecated) mostra que você não demoniza o legado — e que entende que migração deve ser gradual.",
        level: "pleno",
      },
      {
        q: "Como você tiparia props e emits com TypeScript em script setup?",
        a: "<p>Com a syntax genérica de defineProps e defineEmits:</p><pre><code>// Props com default via withDefaults:\nconst props = withDefaults(\n  defineProps&lt;{\n    title: string\n    count?: number\n    variant?: 'primary' | 'ghost'\n  }&gt;(),\n  { count: 0, variant: 'primary' }\n)\n\n// Emits tipados:\nconst emit = defineEmits&lt;{\n  update: [value: number]\n  close: []\n  'item:select': [id: string, item: Item]\n}&gt;()</code></pre><p>Essa sintaxe é exclusiva de script setup — usa genéricos de TypeScript diretamente, sem passar um objeto runtime. Vue compila para os validators corretos automaticamente.</p>",
        tip: "A sintaxe genérica (defineProps<{...}>()) é o padrão TypeScript moderno. Quem usa a sintaxe de objeto (defineProps({ title: String })) está no modo runtime sem type safety — mostre que sabe a diferença.",
        level: "senior",
      },
      {
        q: "Como funciona o lifecycle de componentes Vue 3 com Composition API?",
        a: "<p>Lifecycle hooks em Composition API são funções registradas dentro do setup(): onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted. Equivalentes ao created/mounted/destroyed do Options API.</p><p>Não existe equivalente de created em Composition API — o próprio setup() corre antes da montagem, como se fosse o created.</p><p>Ordem de execução: setup() → onBeforeMount → DOM montado → onMounted → [atualizações] → onBeforeUpdate → onUpdated → [remoção] → onBeforeUnmount → onUnmounted.</p><p>onServerPrefetch existe para SSR (Nuxt) — roda apenas no servidor e aguarda Promises antes de renderizar o HTML.</p>",
        level: "pleno",
      },
      {
        q: "O que são slots no Vue e qual a diferença de slot nomeado e scoped slot?",
        a: "<p><strong>Slot padrão</strong>: o filho recebe conteúdo do pai via &lt;slot&gt;. Equivalente a children no React.</p><p><strong>Named slots</strong>: múltiplos slots nomeados — &lt;slot name='header'&gt; — o pai distribui conteúdo via v-slot:header.</p><p><strong>Scoped slots</strong>: o componente filho expõe dados para o conteúdo do slot — o pai pode usar esses dados ao passar o conteúdo. Permite o padrão 'renderless component' onde o filho gerencia lógica e o pai controla o visual.</p><pre><code>&lt;!-- Filho expõe item --&gt;\n&lt;slot :item='item' :index='index'&gt;&lt;/slot&gt;\n\n&lt;!-- Pai consume --&gt;\n&lt;MyList v-slot='{ item, index }'&gt;\n  &lt;strong&gt;{{ index }}: {{ item.name }}&lt;/strong&gt;\n&lt;/MyList&gt;</code></pre>",
        tip: "Scoped slots são o equivalente Vue do render props do React. Quem sabe isso e consegue dar exemplo de renderless component está claramente no nível sênior.",
        level: "senior",
      },
      {
        q: "Como você gerenciaria uma lista longa com performance no Vue?",
        a: "<p>Técnicas em ordem de impacto: (1) <strong>v-memo</strong>: memoiza um subárvore de template — só re-renderiza quando as dependências especificadas mudam, similar ao React.memo. (2) <strong>KeepAlive</strong>: preserva o estado de componentes filhos ao trocar entre eles (tabs, rotas) — sem destruir e recriar. (3) <strong>Virtualização</strong>: vue-virtual-scroller ou @tanstack/vue-virtual para listas com milhares de itens — só renderiza o que está no viewport. (4) <strong>computed para derivações</strong>: nunca compute em template diretamente se a operação for cara.</p>",
        level: "senior",
      },
      {
        q: "Como você autenticaria rotas com Vue Router?",
        a: "<p>Navigation guards do Vue Router: router.beforeEach() global, ou meta + beforeEnter por rota, ou in-component guards (onBeforeRouteLeave para confirmação de saída).</p><pre><code>router.beforeEach(async (to, from) => {\n  const auth = useAuthStore()\n  if (to.meta.requiresAuth && !auth.isLoggedIn) {\n    return { name: 'login', query: { redirect: to.fullPath } }\n  }\n})</code></pre><p>Defina meta.requiresAuth nas rotas protegidas. Combine com Pinia para ler o estado de autenticação no guard. Retornar um objeto de rota redireciona, retornar true ou void deixa passar.</p>",
        level: "pleno",
      },
      {
        q: "Como funciona o sistema de reatividade do Vue 3 internamente?",
        a: "<p>Vue 3 usa <strong>Proxy ES6</strong> para interceptar acessos e mutações de propriedades. Quando um efeito (watchEffect, computed, ou render function) executa, qualquer leitura de propriedade reativa chama <code>track()</code> — registrando o efeito como dependente. Quando a propriedade é escrita, <code>trigger()</code> notifica todos os efeitos registrados para re-executar.</p><p><strong>ref()</strong> cria um objeto <code>{ value }</code> com getter/setter que chama <code>track()</code> no get e <code>trigger()</code> no set. <strong>reactive()</strong> cria um Proxy profundo sobre o objeto inteiro. <strong>computed()</strong> é um efeito especial que cacheia o resultado e só reavalia quando suas dependências mudam. A granularidade é por propriedade — apenas os efeitos que acessaram uma propriedade são renotificados quando ela muda.</p>",
        tip: "Detalhar track() e trigger() mostra que você entende o mecanismo, não só a API. A diferença de Vue 2 (Object.defineProperty, sem detecção de novas propriedades) vs Vue 3 (Proxy, sem limitações) é sempre bem-vinda.",
        level: "senior",
      },
      {
        q: "Qual a diferença entre watch e watchEffect no Vue 3?",
        a: "<p><strong>watchEffect</strong>: rastreia dependências <em>automaticamente</em> ao executar a função — qualquer ref ou reactive acessado dentro dela vira dependência. Executa imediatamente na montagem. Sem acesso ao valor anterior. Ideal para efeitos simples que precisam de reatividade automática (sincronizar localStorage, chamar API quando filtros mudam).</p><p><strong>watch</strong>: observa <em>fontes explícitas</em> (ref, reactive, computed, getter ou array deles). Tem acesso ao valor anterior e ao novo. <em>Lazy</em> por padrão (não roda na montagem — use <code>immediate: true</code>). Mais controle sobre quando executar. Use quando precisa do valor anterior ou quer evitar execução imediata.</p>",
        tip: "A confusão entre os dois está na origem de muitos bugs. Demonstrar que você sabe quando um roda imediatamente e qual tem oldValue é o ponto que a maioria erra.",
        level: "senior",
      },
      {
        q: "Como provide/inject funciona e quando preferir sobre Pinia?",
        a: "<p><code>provide(key, value)</code> disponibiliza um valor para toda a subárvore de componentes descendentes. <code>inject(key)</code> consome esse valor em qualquer descendente, sem prop drilling. Use <code>InjectionKey</code> (Symbol tipado) para type safety.</p><p><strong>Quando preferir provide/inject:</strong> dados de escopo local — tema de um painel específico, instância de um serviço restrita a uma parte da UI, configuração de um componente pai para seus filhos. É DI (dependency injection) de contexto local.<br><strong>Quando preferir Pinia:</strong> estado global da aplicação, shared entre rotas e componentes distantes, que precisa de DevTools, persistência, ações assíncronas e tipagem centralizada. Pinia é melhor para estado de aplicação; provide/inject para contexto de componente.</p>",
        tip: "A distinção 'estado global = Pinia, contexto local = provide/inject' mostra que você sabe escolher a ferramenta certa, não só usar ambas.",
        level: "senior",
      },
      {
        q: "Como implementar um composable reutilizável com cleanup adequado?",
        a: "<p>Composable é uma função que usa Composition API para encapsular lógica stateful reutilizável. Para cleanup, registre <code>onUnmounted</code> dentro do composable — ele só funciona quando chamado durante <code>setup()</code> (ou <code>&lt;script setup&gt;</code>).</p><pre><code>export function useEventListener(target: EventTarget, event: string, cb: EventListener) {\n  onMounted(() => target.addEventListener(event, cb))\n  onUnmounted(() => target.removeEventListener(event, cb))\n}\n\nexport function useAbortableFetch(url: string) {\n  const controller = new AbortController()\n  onUnmounted(() => controller.abort())\n  // ... fetch com controller.signal\n}</code></pre><p>watchEffect retorna uma stop function — guardá-la e chamá-la no cleanup é outra abordagem para effects que precisam de controle granular fora do lifecycle do componente.</p>",
        tip: "Mostrar que lifecycle hooks de composables só funcionam dentro de setup() — e o porquê — diferencia quem realmente usa composables de quem apenas leu a documentação.",
        level: "senior",
      },
      {
        q: "O que é Suspense no Vue 3 e como usar com async components?",
        a: "<p><code>&lt;Suspense&gt;</code> renderiza o slot <code>#fallback</code> enquanto um componente filho assíncrono resolve. O componente filho pode ser assíncrono de duas formas: definido com <code>defineAsyncComponent()</code> (lazy load via import dinâmico) ou ter um <code>async setup()</code> que retorna uma Promise.</p><pre><code>&lt;Suspense&gt;\n  &lt;template #default&gt;&lt;AsyncComponent /&gt;&lt;/template&gt;\n  &lt;template #fallback&gt;&lt;LoadingSpinner /&gt;&lt;/template&gt;\n&lt;/Suspense&gt;</code></pre><p>Permite code splitting com loading state declarativo — sem precisar de flags isLoading manuais no componente pai. Vue 3 suporta <code>&lt;Suspense&gt;</code> aninhado: cada nível exibe seu próprio fallback enquanto resolve. Em Nuxt 3, Suspense é integrado automaticamente com as pages e o <code>useFetch</code>.</p>",
        tip: "Diferenciar defineAsyncComponent (lazy load de JS) de async setup (dados assíncronos) mostra que você entende os dois casos de uso do Suspense.",
        level: "senior",
      },
      {
        q: "Como otimizar performance em listas longas no Vue 3?",
        a: "<p><strong>v-memo</strong> (Vue 3.2+): memoiza um subárvore de template baseado em dependências explícitas — similar ao <code>React.memo</code>. <code>v-memo=\"[item.id, item.selected]\"</code> faz o nó re-renderizar apenas quando essas dependências mudam, ignorando outras mudanças de estado. Ideal para listas grandes onde cada item tem estado complexo mas muda raramente.</p><p><strong>v-once</strong>: renderiza o elemento ou componente uma única vez — nunca re-renderiza. Para conteúdo verdadeiramente estático dentro de uma lista dinâmica.</p><p><strong>Virtual scrolling</strong>: para listas com 1.000+ itens, use <code>vue-virtual-scroller</code> ou <code>@tanstack/vue-virtual</code> — apenas os itens visíveis no viewport são renderizados, o restante é substituído por espaço vazio. Reduz o número de nós no DOM de 10.000 para ~20–30.</p><p><strong>KeepAlive</strong>: para componentes que alternam visibilidade (abas, rotas) — preserva o estado e o DOM sem destruir e recriar.</p>",
        tip: "v-memo é o recurso de performance mais subutilizado do Vue 3. Mencioná-lo junto a virtual scrolling e KeepAlive mostra domínio do kit de otimização completo.",
        level: "senior",
      },
    ],
    mnemonics: [
      {
        trick: "RCWP",
        label: "As primitivas de reatividade do Vue 3",
        explanation: "R = Ref (ref() — qualquer valor, acessa com .value). C = Computed (computed() — derivado, memorizado). W = Watch/watchEffect (observar efeitos colaterais). P = Proxy (como reactive() funciona internamente). Lembre como 'Reatividade Com Watch e Proxy'. Cada letra é uma primitive da Composition API que você usará todos os dias.",
      },
      {
        trick: "MIOCBU",
        label: "Lifecycle hooks Vue 3 em ordem",
        explanation: "M = onMounted (DOM disponível). I = onUpdated (após re-render). O = onUnmounted (limpeza). C = onBeforeMount (antes do DOM). B = onBeforeUpdate (antes do re-render). U = onBeforeUnmount (antes de destruir). Leia como 'Montei, Ia Ocupar, Comecei Bem, Usarei depois' — cada letra é um hook em ordem aproximada de uso mais frequente.",
      },
      {
        trick: "SSDIE",
        label: "Diretivas Vue essenciais",
        explanation: "S = v-show (display:none, mantém DOM). S = v-if/v-else (remove do DOM). D = v-for com :key (listas). I = v-if condição booleana. E = emit + defineEmits (comunicação filho→pai). Leia como 'Show, Show, Display, If, Emit' — as 5 diretivas/patterns que aparecem em todo componente Vue.",
      },
    ],
    cheatsheet: {
      title: "Vue 3 — Referência Rápida: Composition API, Diretivas e Lifecycle",
      html: `<style>
.vue-cs{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.vue-cs-sec{margin-bottom:18px}
.vue-cs-title{font-size:9px;color:#41b883;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:10px;padding-bottom:4px;border-bottom:1px solid #1e293b}
.vue-cs-table{width:100%;border-collapse:collapse;font-size:10.5px}
.vue-cs-table th{color:#475569;font-weight:500;text-align:left;padding:4px 8px;border-bottom:1px solid #1e293b}
.vue-cs-table td{padding:5px 8px;border-bottom:1px solid #0f172a;vertical-align:top}
.vue-cs-table tr:hover td{background:#1e293b}
.vue-cs-name{color:#41b883}
.vue-cs-code{color:#94a3b8;font-size:10px}
.vue-cs-note{color:#475569;font-size:10px}
</style>
<div class="vue-cs">
  <p style="color:#41b883;font-size:12px;font-weight:700;margin:0 0 18px">Vue 3 — Referência Rápida</p>
  <div class="vue-cs-sec">
    <div class="vue-cs-title">Primitivas de reatividade</div>
    <table class="vue-cs-table">
      <tr><th>API</th><th>O que faz</th><th>Quando usar</th></tr>
      <tr><td class="vue-cs-name">ref(value)</td><td class="vue-cs-code">Reativo com .value</td><td class="vue-cs-note">Primitivos e qualquer valor — preferido</td></tr>
      <tr><td class="vue-cs-name">reactive(obj)</td><td class="vue-cs-code">Proxy reativo (sem .value)</td><td class="vue-cs-note">Objetos complexos — cuidado ao desestruturar</td></tr>
      <tr><td class="vue-cs-name">computed(() => expr)</td><td class="vue-cs-code">Valor derivado, cacheado</td><td class="vue-cs-note">Valores derivados de estado reativo</td></tr>
      <tr><td class="vue-cs-name">watch(src, cb)</td><td class="vue-cs-code">Observa fonte explícita</td><td class="vue-cs-note">Quando precisa de oldVal ou lazy</td></tr>
      <tr><td class="vue-cs-name">watchEffect(fn)</td><td class="vue-cs-code">Rastreia automaticamente</td><td class="vue-cs-note">Efeitos que reagem a deps automáticas</td></tr>
      <tr><td class="vue-cs-name">toRefs(reactive)</td><td class="vue-cs-code">Converte reactive em refs</td><td class="vue-cs-note">Para desestruturar reactive com segurança</td></tr>
      <tr><td class="vue-cs-name">readonly(ref)</td><td class="vue-cs-code">Versão somente-leitura</td><td class="vue-cs-note">Expor estado sem permitir mutação externa</td></tr>
    </table>
  </div>
  <div class="vue-cs-sec">
    <div class="vue-cs-title">Diretivas de template</div>
    <table class="vue-cs-table">
      <tr><th>Diretiva</th><th>Uso</th></tr>
      <tr><td class="vue-cs-name">v-if / v-else-if / v-else</td><td class="vue-cs-code">Renderização condicional — remove do DOM</td></tr>
      <tr><td class="vue-cs-name">v-show</td><td class="vue-cs-code">display:none — mantém no DOM</td></tr>
      <tr><td class="vue-cs-name">v-for="item in items" :key</td><td class="vue-cs-code">Lista — :key com ID estável obrigatório</td></tr>
      <tr><td class="vue-cs-name">v-model</td><td class="vue-cs-code">Two-way binding em input/componente</td></tr>
      <tr><td class="vue-cs-name">:attr ou v-bind:attr</td><td class="vue-cs-code">Binding de atributo dinâmico</td></tr>
      <tr><td class="vue-cs-name">@event ou v-on:event</td><td class="vue-cs-code">Event listener</td></tr>
      <tr><td class="vue-cs-name">@click.prevent / .stop / .once</td><td class="vue-cs-code">Modificadores de evento</td></tr>
      <tr><td class="vue-cs-name">v-memo="[dep1, dep2]"</td><td class="vue-cs-code">Memoiza subárvore — performance</td></tr>
    </table>
  </div>
  <div class="vue-cs-sec">
    <div class="vue-cs-title">Lifecycle hooks (Composition API)</div>
    <table class="vue-cs-table">
      <tr><th>Hook</th><th>Quando roda</th></tr>
      <tr><td class="vue-cs-name">setup()</td><td class="vue-cs-code">Antes de tudo — equivale ao created</td></tr>
      <tr><td class="vue-cs-name">onBeforeMount</td><td class="vue-cs-code">Antes do DOM ser inserido</td></tr>
      <tr><td class="vue-cs-name">onMounted</td><td class="vue-cs-code">DOM disponível — fetch, refs de DOM</td></tr>
      <tr><td class="vue-cs-name">onBeforeUpdate</td><td class="vue-cs-code">Antes de re-render por mudança reativa</td></tr>
      <tr><td class="vue-cs-name">onUpdated</td><td class="vue-cs-code">Após re-render — DOM atualizado</td></tr>
      <tr><td class="vue-cs-name">onBeforeUnmount</td><td class="vue-cs-code">Antes de destruir — cancel subscriptions</td></tr>
      <tr><td class="vue-cs-name">onUnmounted</td><td class="vue-cs-code">Componente destruído — cleanup</td></tr>
    </table>
  </div>
  <div class="vue-cs-sec">
    <div class="vue-cs-title">script setup — macros de compilador</div>
    <table class="vue-cs-table">
      <tr><th>Macro</th><th>O que faz</th></tr>
      <tr><td class="vue-cs-name">defineProps&lt;{ ... }&gt;()</td><td class="vue-cs-code">Declara props com TypeScript</td></tr>
      <tr><td class="vue-cs-name">withDefaults(defineProps(), {})</td><td class="vue-cs-code">Props com valores padrão</td></tr>
      <tr><td class="vue-cs-name">defineEmits&lt;{ ev: [arg] }&gt;()</td><td class="vue-cs-code">Declara eventos emitidos</td></tr>
      <tr><td class="vue-cs-name">defineExpose({ method })</td><td class="vue-cs-code">Expõe para refs de template pai</td></tr>
      <tr><td class="vue-cs-name">defineOptions({ name })</td><td class="vue-cs-code">Define opções do componente</td></tr>
    </table>
  </div>
</div>`,
    },
    mindmap: {
      title: "Vue 3 — Mapa mental da Composition API",
      html: `<style>
.vue-mm{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:24px;color:#e2e8f0}
.vue-mm-center{background:#1a3a2a;border:2px solid #41b883;border-radius:10px;padding:10px 18px;text-align:center;font-weight:700;font-size:13px;color:#41b883;display:inline-block}
.vue-mm-node{background:#1e293b;border:1.5px solid #334155;border-radius:7px;padding:6px 12px;font-size:11px;color:#94a3b8;cursor:default;margin-bottom:5px}
.vue-mm-node:hover{border-color:#41b883;color:#e2e8f0}
.vue-mm-label{font-size:9px;color:#41b883;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:6px}
.vue-mm-grid{display:grid;grid-template-columns:1fr auto 1fr;gap:16px;align-items:start}
.vue-mm-col{display:flex;flex-direction:column;gap:12px}
</style>
<div class="vue-mm">
  <p style="color:#41b883;font-size:12px;font-weight:700;margin:0 0 20px">Vue 3 — Mapa de Conceitos</p>
  <div class="vue-mm-grid">
    <div class="vue-mm-col">
      <div>
        <div class="vue-mm-label">Reatividade</div>
        <div class="vue-mm-node">ref() — primitivos e objetos</div>
        <div class="vue-mm-node">reactive() — objetos Proxy</div>
        <div class="vue-mm-node">computed() — derivado, cacheado</div>
        <div class="vue-mm-node">watch / watchEffect</div>
        <div class="vue-mm-node">toRefs() — desestruturar seguro</div>
      </div>
      <div>
        <div class="vue-mm-label">Diretivas de template</div>
        <div class="vue-mm-node">v-if/v-show — condicional</div>
        <div class="vue-mm-node">v-for + :key — listas</div>
        <div class="vue-mm-node">v-model — two-way</div>
        <div class="vue-mm-node">:bind / @on — atributos e eventos</div>
        <div class="vue-mm-node">v-memo — performance</div>
      </div>
      <div>
        <div class="vue-mm-label">Composição de componentes</div>
        <div class="vue-mm-node">defineProps / defineEmits</div>
        <div class="vue-mm-node">slots / scoped slots</div>
        <div class="vue-mm-node">Teleport — portais</div>
        <div class="vue-mm-node">KeepAlive — preservar estado</div>
      </div>
    </div>
    <div style="display:flex;align-items:center;justify-content:center">
      <div class="vue-mm-center">Vue 3<br><span style="font-size:10px;opacity:.7">Composition API</span></div>
    </div>
    <div class="vue-mm-col">
      <div>
        <div class="vue-mm-label">Compartilhar estado</div>
        <div class="vue-mm-node">Pinia — estado global (Vuex moderno)</div>
        <div class="vue-mm-node">provide / inject — sem prop drilling</div>
        <div class="vue-mm-node">Composables — lógica reutilizável</div>
      </div>
      <div>
        <div class="vue-mm-label">Lifecycle (Composition API)</div>
        <div class="vue-mm-node">onMounted — DOM disponível</div>
        <div class="vue-mm-node">onUpdated — após re-render</div>
        <div class="vue-mm-node">onUnmounted — cleanup</div>
        <div class="vue-mm-node">onServerPrefetch — SSR (Nuxt)</div>
      </div>
      <div>
        <div class="vue-mm-label">Ecossistema</div>
        <div class="vue-mm-node">Vue Router — roteamento SPA</div>
        <div class="vue-mm-node">Nuxt 3 — meta-framework SSR</div>
        <div class="vue-mm-node">Vite — build tool padrão</div>
        <div class="vue-mm-node">Vitest — testes unitários</div>
      </div>
    </div>
  </div>
</div>`,
      caption: "Visão geral do Vue 3 — da reatividade (ref/reactive/computed) ao ecossistema (Pinia, Vue Router, Nuxt).",
    },
    exercises: [
      {
        level: "iniciante",
        title: "Todo list com Composition API",
        description: "Crie um componente de lista de tarefas com Vue 3 script setup. Use ref() para o array de tarefas e o input de texto. Implemente adicionar tarefa (Enter ou botão), marcar como concluída (toggle), e remover. Use v-for com :key estável (ID), v-model no input, e computed para contar tarefas pendentes.",
        concepts: ["ref", "computed", "v-for", "v-model", "script setup", "defineProps"],
        hint: "Use um contador incremental para gerar IDs estáveis. computed(() => tasks.value.filter(t => !t.done).length) conta as pendentes.",
      },
      {
        level: "intermediario",
        title: "Composable useLocalStorage reativo",
        description: "Crie um composable useLocalStorage<T>(key, defaultValue) que sincroniza um ref com o localStorage automaticamente. O valor deve ser reativo — qualquer mudança no ref deve salvar no storage, e ao inicializar deve ler o valor salvo. Teste com um componente de preferências do usuário (tema, idioma).",
        concepts: ["composables", "ref", "watch", "localStorage", "TypeScript generics"],
        hint: "Use watch(valor, novoValor => localStorage.setItem(key, JSON.stringify(novoValor)), { deep: true }) para persistir. Inicialize com JSON.parse(localStorage.getItem(key)) ?? defaultValue.",
      },
      {
        level: "senior",
        title: "Store Pinia com otimistic updates e rollback",
        description: "Implemente uma store Pinia para gerenciar posts com: state reativo, action para criar post com optimistic update (adiciona ao array antes da resposta do servidor), rollback automático em caso de erro da API, e loading/error state granular por operação. Crie um componente que usa a store e exibe estado de cada post individualmente.",
        concepts: ["Pinia", "optimistic updates", "error handling", "computed", "async actions"],
        hint: "Adicione o post com id temporário (UUID no cliente) e uma flag 'pending: true'. Em caso de erro, use store.$patch para remover o post adicionado. onError no catch do try/catch.",
      },
    ],
    videos: [
      { title: "Vue 3 Crash Course", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=VeNfHj6MhgA", topic: "Vue 3 com Composition API do zero" },
      { title: "Vue 3 Tutorial for Beginners", channel: "The Net Ninja", url: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9hYYGbV60Vq3IXYNfDk8At1", topic: "Série completa Vue 3 passo a passo" },
      { title: "Pinia Crash Course", channel: "Vue Mastery", url: "https://www.youtube.com/watch?v=JGC7aAC-3y8", topic: "Estado global com Pinia em Vue 3" },
      { title: "Vue 3 Composition API — Advanced Patterns", channel: "VueConf", url: "", topic: "Composables avançados, provide/inject, renderless components" },
      { title: "Nuxt 3 Crash Course", channel: "Traversy Media", url: "", topic: "Nuxt 3 com App Router e SSR" },
    ],
    codeExamples: [
      {
        title: "Composable useFetch — data fetching reativo",
        description: "Padrão de composable para data fetching com loading, error e dados — equivalente ao useSWR/useQuery do React.",
        code: `// composables/useFetch.ts
import { ref, watchEffect, toValue, type MaybeRefOrGetter } from 'vue'

export function useFetch<T>(url: MaybeRefOrGetter<string>) {
  const data = ref<T | null>(null)
  const error = ref<string | null>(null)
  const loading = ref(false)

  watchEffect(async () => {
    // toValue desembrulha ref, getter ou valor diretamente
    const resolvedUrl = toValue(url)
    if (!resolvedUrl) return

    loading.value = true
    error.value = null

    try {
      const res = await fetch(resolvedUrl)
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
      data.value = await res.json()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro desconhecido'
    } finally {
      loading.value = false
    }
  })

  return { data, error, loading }
}

// Uso em componente:
// const userId = ref('1')
// const { data: user, loading } = useFetch(() => \`/api/users/\${userId.value}\`)
// Quando userId muda, o fetch é re-executado automaticamente`,
        language: "typescript",
      },
      {
        title: "Componente com defineProps e defineEmits tipados",
        description: "Componente de formulário completo com TypeScript, props validadas e emits tipados.",
        code: `<!-- SearchInput.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'

// Props com TypeScript — sem import necessário
const props = withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
    minLength?: number
    disabled?: boolean
  }>(),
  { placeholder: 'Buscar...', minLength: 0, disabled: false }
)

// Emits tipados
const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [query: string]
  clear: []
}>()

const inputRef = ref<HTMLInputElement | null>(null)

const isEmpty = computed(() => props.modelValue.trim().length === 0)
const isValid = computed(() => props.modelValue.trim().length >= props.minLength)

function handleInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  emit('update:modelValue', value)
}

function handleSearch() {
  if (isValid.value) {
    emit('search', props.modelValue.trim())
  }
}

function clear() {
  emit('update:modelValue', '')
  emit('clear')
  inputRef.value?.focus()
}

// Expõe focus() para o componente pai
defineExpose({ focus: () => inputRef.value?.focus() })
</script>

<template>
  <div :class="['search-wrapper', { disabled }]">
    <input
      ref="inputRef"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="handleInput"
      @keyup.enter="handleSearch"
    />
    <button v-if="!isEmpty" @click="clear" aria-label="Limpar">×</button>
    <button @click="handleSearch" :disabled="!isValid">Buscar</button>
  </div>
</template>`,
        language: "vue",
      },
      {
        title: "Pinia store com async actions e error handling",
        description: "Store completa de posts com CRUD, loading granular e optimistic updates.",
        code: `// stores/posts.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Post {
  id: string
  title: string
  content: string
  pending?: boolean
}

export const usePostsStore = defineStore('posts', () => {
  const posts = ref<Post[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const publishedPosts = computed(() =>
    posts.value.filter(p => !p.pending)
  )

  async function fetchPosts() {
    loading.value = true
    error.value = null
    try {
      const res = await fetch('/api/posts')
      posts.value = await res.json()
    } catch (err) {
      error.value = 'Falha ao carregar posts'
    } finally {
      loading.value = false
    }
  }

  async function createPost(data: Omit<Post, 'id'>) {
    // Optimistic update
    const tempId = crypto.randomUUID()
    const optimistic: Post = { ...data, id: tempId, pending: true }
    posts.value.push(optimistic)

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      })
      const created: Post = await res.json()
      // Substitui o otimista pelo real
      const idx = posts.value.findIndex(p => p.id === tempId)
      if (idx !== -1) posts.value[idx] = created
    } catch {
      // Rollback
      posts.value = posts.value.filter(p => p.id !== tempId)
      error.value = 'Falha ao criar post'
    }
  }

  return { posts, publishedPosts, loading, error, fetchPosts, createPost }
})`,
        language: "typescript",
      },
    ],
    resources: [
      { title: "Vue 3 docs — guia oficial", url: "https://vuejs.org/guide/introduction.html", kind: "docs" },
      { title: "Vue 3 Tutorial interativo", url: "https://vuejs.org/tutorial/", kind: "pratica" },
      { title: "Pinia docs", url: "https://pinia.vuejs.org/", kind: "docs" },
      { title: "Vue Router docs", url: "https://router.vuejs.org/", kind: "docs" },
      { title: "Nuxt 3 docs", url: "https://nuxt.com/docs", kind: "docs" },
      { title: "Vue Use — composables prontos", url: "https://vueuse.org/", kind: "pratica" },
      { title: "Vue Mastery — cursos oficiais", url: "https://www.vuemastery.com/", kind: "curso" },
    ],
}

export default vue
