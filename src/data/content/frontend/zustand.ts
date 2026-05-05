import type { SkillContent } from '@/types'

const zustand: SkillContent = {
    tagline: "Gerenciamento de estado global minimalista para React — sem boilerplate.",
    why: "Zustand virou o padrão de fato para estado global em projetos React modernos, substituindo Redux na maioria dos casos. API simples, sem Provider, sem actions/reducers — só uma store com hooks.",
    summary: "Zustand é uma biblioteca de gerenciamento de estado baseada em hooks, com API mínima: create() define a store com estado e ações em um único objeto. Sem Provider obrigatório, sem actions/reducers/dispatch. O componente subscreve apenas ao slice que usa — re-renders seletivos automáticos.",
    keypoints: [
      { title: "create() — store minimalista", body: "Uma store é uma função create() que recebe set e get e retorna estado + ações. Sem Provider — funciona fora de componentes também.", code: `const useStore = create<State>((set) => ({
  count: 0,
  inc: () => set((s) => ({ count: s.count + 1 })),
  reset: () => set({ count: 0 }),
}))` },
      { title: "Seleção e re-renders", body: "Use seletores para assinar apenas o que o componente precisa. Sem seletor, o componente re-renderiza em qualquer mudança da store.", code: `// Apenas re-renderiza quando count muda:
const count = useStore((s) => s.count)
// Re-renderiza em QUALQUER mudança (evite):
const store = useStore()` },
      { title: "Slice pattern", body: "Para stores grandes, divida em slices: funções que recebem set/get e retornam um pedaço do estado. Combine no create() principal.", code: `const useStore = create<State>()((...args) => ({
  ...createCountSlice(...args),
  ...createUserSlice(...args),
}))` },
      { title: "Middleware", body: "Zustand tem middleware componível: persist (localStorage/sessionStorage), devtools (Redux DevTools), immer (estado mutável com immer). Compose com pipe.", code: `const useStore = create<State>()(
  persist(devtools(immer((set) => ({
    count: 0,
    inc: () => set((s) => { s.count++ }), // immer: mutação direta
  }))), { name: 'my-store' })
)` },
    ],
    interview: [
      { q: "Por que usar Zustand em vez de Redux?", a: "<p>Zustand tem 1/10 do boilerplate. Sem actions, reducers, dispatch, combineReducers, connect(). Uma store = um objeto com estado e funções. Sem Provider obrigatório. Re-renders seletivos automáticos com seletores.</p><p>Redux faz sentido em: projetos muito grandes com muitos devs (convenções rígidas), quando você precisa de time-travel debugging avançado ou ecossistema Redux extenso.</p><p>Zustand é suficiente para 90% dos casos e mais ergonômico.</p>", level: "pleno" },
      { q: "Como evitar re-renders desnecessários com Zustand?", a: "<p>Use seletores — funções que extraem apenas o slice que o componente precisa. Zustand usa igualdade referencial (===) por padrão para decidir se re-renderiza.</p><p>Para objetos derivados, use useShallow() do Zustand ou forneça um comparador customizado como segundo argumento do hook.</p>", tip: "Citar useShallow mostra que você foi além do tutorial básico.", level: "pleno" },
      { q: "Quando usar useState vs Zustand?", a: "<p><strong>useState</strong>: estado local de UI — form input, loading local, modal aberto. Não precisa ser compartilhado entre componentes não-relacionados.</p><p><strong>Zustand</strong>: estado que múltiplos componentes distantes precisam acessar/modificar — autenticação, carrinho, tema, dados de servidor que você quer cachear localmente.</p><p>Regra: comece com useState, extrai para Zustand quando props drilling fica profundo ou quando componentes não-relacionados precisam do mesmo estado.</p>", level: "pleno" },
      { q: "Como persistir estado do Zustand no localStorage?", a: "<p>Middleware <code>persist</code> do Zustand: envolve o create() e salva/restaura automaticamente do localStorage (ou qualquer storage configurado).</p><pre><code>const useStore = create(persist(\n  (set) => ({ token: null, setToken: (t) => set({ token: t }) }),\n  { name: 'auth-store', partialize: (s) => ({ token: s.token }) }\n))</code></pre><p>partialize define quais campos persistir — bom para não salvar estado efêmero.</p>", level: "pleno" },
    ],
    gotchas: [
      "Sem seletor, o componente re-renderiza em qualquer mudança da store — mesmo que o campo usado não tenha mudado.",
      "Objetos retornados por seletor precisam de comparação shallow para evitar re-renders. Use useShallow() do pacote zustand/shallow.",
      "Middleware deve ser aplicado de dentro para fora: persist(devtools(immer(fn))). Ordem errada causa bugs silenciosos.",
    ],
    resources: [
      { title: "Zustand docs", url: "https://docs.pmnd.rs/zustand/getting-started/introduction", kind: "docs" },
      { title: "Zustand — Slices pattern", url: "https://docs.pmnd.rs/zustand/guides/slices-pattern", kind: "docs" },
    ],
}

export default zustand
