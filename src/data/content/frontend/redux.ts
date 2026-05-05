import type { SkillContent } from '@/types'

const redux: SkillContent = {
    tagline: "Gerenciamento de estado global previsível com fluxo unidirecional — padrão legado em React.",
    why: "Redux ainda existe em muitas codebases grandes. Entender o modelo mental (actions, reducers, store) e Redux Toolkit (RTK) é necessário para manutenção e migração. Em projetos novos, prefira Zustand ou Jotai.",
    summary: "Redux implementa o padrão Flux: estado global em uma store imutável, modificado apenas via actions (objetos com type) processadas por reducers (funções puras). Redux Toolkit (RTK) reduz o boilerplate com createSlice, createAsyncThunk e immer embutido. React-Redux conecta a store com hooks useSelector e useDispatch.",
    keypoints: [
      { title: "Fluxo unidirecional", body: "UI → dispatch(action) → reducer(state, action) → novo estado → UI. Previsível e debugável. Cada mudança de estado é rastreável." },
      { title: "Redux Toolkit (RTK)", body: "createSlice gera actions e reducer juntos. Immer embutido permite 'mutação' no reducer (na verdade produz novo objeto imutável). createAsyncThunk para async.", code: `const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value++ }, // immer
    reset: (state) => { state.value = 0 },
  },
})` },
      { title: "useSelector e useDispatch", body: "useSelector subscreve ao slice da store. Memoizado — re-renderiza só quando o valor selecionado muda. useDispatch retorna dispatch para enviar actions." },
      { title: "RTK Query", body: "RTK Query é o módulo de data fetching do RTK — similar ao React Query. Gera hooks (useGetUsersQuery, useCreateUserMutation) a partir de endpoints declarados. Integrado com Redux DevTools." },
    ],
    interview: [
      { q: "Por que Redux caiu em desuso nos projetos novos?", a: "<p>Redux exige muito boilerplate mesmo com RTK: actions, reducers, selectors, Provider, configuração de middleware. Para estado assíncrono, Redux não tem resposta nativa boa — precisa de thunks ou sagas.</p><p>Alternativas modernas resolvem casos específicos melhor: React Query/SWR para estado de servidor, Zustand/Jotai para estado global simples, Context para estado de tema/auth. Redux ainda faz sentido em apps muito grandes onde convenções rígidas são vantagem.</p>", level: "pleno" },
      { q: "Qual a diferença entre actions, reducers e store no Redux?", a: "<p><strong>Action</strong>: objeto puro descrevendo o que aconteceu — { type: 'counter/increment', payload: 1 }. Não contém lógica.</p><p><strong>Reducer</strong>: função pura (state, action) => novoState. Toda lógica de transformação fica aqui. Deve ser sem side effects.</p><p><strong>Store</strong>: contém o estado global. Expõe dispatch(), getState() e subscribe(). Uma por aplicação.</p>", level: "pleno" },
      { q: "Como Redux Toolkit simplifica o Redux?", a: "<p>RTK elimina boilerplate com: createSlice (actions + reducer em um objeto), configureStore (middleware padrão incluído), createAsyncThunk (async actions com pending/fulfilled/rejected automáticos), immer embutido (mutação no reducer). Reduz 60-70% do código em relação ao Redux vanilla.</p>", level: "pleno" },
      { q: "Como você migraria uma codebase de Redux para Zustand?", a: "<p>Abordagem incremental: (1) Identifique slices independentes. (2) Crie store Zustand equivalente com mesmos campos e ações. (3) Migre componentes slice por slice — React-Redux e Zustand coexistem. (4) Remova Redux quando todos os slices migrados.</p><p>Pontos de atenção: middleware customizado (logger, analytics) precisa ser reimplementado; RTK Query migra para React Query; DevTools do Redux não funcionam com Zustand (mas Zustand tem próprio middleware devtools).</p>", tip: "Migração incremental é a resposta que mostra maturidade — sênior nunca propõe big bang rewrite.", level: "senior" },
    ],
    gotchas: [
      "Selector sem memoização em useSelector recalcula a cada render mesmo sem mudança no slice relevante. Use createSelector (reselect) para selectors derivados.",
      "Colocar dados não-serializáveis na store (funções, Promises, instâncias de classe) quebra Redux DevTools e persistência.",
      "Redux puro não tem solução nativa para async — thunks são boilerplate e sagas têm curva alta. RTK Query ou React Query são melhores para dados de servidor.",
    ],
    resources: [
      { title: "Redux Toolkit docs", url: "https://redux-toolkit.js.org/", kind: "docs" },
      { title: "Redux DevTools Extension", url: "https://github.com/reduxjs/redux-devtools", kind: "pratica" },
    ],
}

export default redux
