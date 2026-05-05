import type { SkillContent } from '@/types'

const jest: SkillContent = {
  tagline: "Test runner de JavaScript da Meta — padrão em projetos React e Node por anos.",
  why: "Jest dominou JS por uma decada. Mesmo com Vitest crescendo, Jest ainda está na maioria dos repos legados. Senior precisa configurar, mockar, debug, snapshot, e migrar pra Vitest quando faz sentido.",
  summary: "Jest e test runner + assertion + mocking integrado. Roda em Node, transforma TS/JSX via babel-jest ou ts-jest. Recursos: describe/it/expect familiar, matchers ricos (toEqual, toMatchObject, toThrow), mocks (jest.fn, jest.mock, automatic mocks de módulos), snapshots, coverage nativo via Istanbul, workers paralelos.",
  keypoints: [
    { title: "Estrutura básica", body: "describe agrupa, it/test roda, expect assert. beforeEach/afterEach pra setup/teardown isolado. beforeAll compartilha (cuidado com state)." },
    { title: "Mocking", body: "jest.fn() cria mock standalone. jest.mock('./module') auto-mocka todos exports. jest.spyOn(obj, 'method') espia sem substituir. mockImplementation customiza retorno." },
    { title: "Snapshots", body: "expect(component).toMatchSnapshot() grava na primeira vez, compara depois. Bom pra detectar mudança inesperada de UI/JSON. Ruim quando snapshot vira gigante e dev só faz -u sem revisar." },
    { title: "Coverage", body: "--coverage roda Istanbul, gera HTML. Threshold em config (coverageThreshold) bloqueia PR abaixo de %%. Cuidado: coverage alto != qualidade." },
  ],
  gotchas: [
    "jest.mock com path relativo — pega caminho do file que chama, não do que e mocked. Em monorepo gera bug.",
    "Esquecer jest.clearAllMocks() em beforeEach — mock de teste anterior vaza.",
    "Async sem await ou return — teste passa antes do assert rodar. Sempre await ou return na promise.",
    "Snapshot enorme (1000 linhas de JSON) — ninguem revisa, perde valor de assert.",
  ],
  interview: [
    { q: "Jest vs Vitest — vale migrar?", a: "<p>Vitest ganha: 5-10x mais rápido (esbuild + workers via vite), API quase compatível com Jest, ESM nativo, melhor DX (UI mode, watch incremental).</p><p>Jest ainda vale: ecossistema maior em React Native, projetos antigos onde migração não paga, integração com tools que só suportam Jest.</p><p>Em projeto novo (especialmente Vite/Next): Vitest. Em projeto Jest grande: migrar incremental.</p>" },
  ],
  resources: [
    { title: "Jest Documentation", url: "https://jestjs.io/", kind: "docs" },
    { title: "Testing Library", url: "https://testing-library.com/", kind: "docs" },
    { title: "MSW (Mock Service Worker)", url: "https://mswjs.io/", kind: "docs" },
  ],
}

export default jest
