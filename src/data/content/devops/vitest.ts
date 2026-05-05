import type { SkillContent } from '@/types'

const vitest: SkillContent = {
  tagline: "Test runner moderno baseado em Vite — rápido, ESM-first, API compatível com Jest.",
  why: "Vitest e o sucessor natural do Jest em projetos Vite/Next/SvelteKit/Vue. Senior precisa explicar por que e mais rápido (esbuild, workers, HMR de teste), config minima, e quando ainda escolher Jest.",
  summary: "Vitest reusa transform/resolve do Vite (esbuild + ESM nativo), o que da boot quase instantaneo e watch mode com hot reload de teste. API e quase 1:1 com Jest (describe/it/expect, vi.fn() em vez de jest.fn()). Recursos diferenciais: UI mode com browser dashboard, in-source testing (testes dentro do arquivo de source), browser mode (roda teste em browser real via Playwright/WebDriver), type testing (expectTypeOf), workspaces pra monorepo.",
  keypoints: [
    { title: "Vite-powered", body: "Reusa vite.config.ts, plugins, aliases, transforms. Se você já usa Vite no app, teste herda config. Boot em ms, watch incremental por arquivo afetado." },
    { title: "API compatível com Jest", body: "describe/it/expect identicos. vi substitui jest (vi.fn, vi.mock, vi.spyOn). Migração mecanica de codebase Jest e direta." },
    { title: "ESM nativo", body: "Sem hack de --experimental-vm-modules. import funciona, top-level await funciona, módulos dinâmicos funcionam." },
    { title: "In-source testing", body: "if (import.meta.vitest) { test(...) } dentro do arquivo de source. Stripped em build de prod. Ótimo pra utility functions." },
    { title: "Browser mode", body: "Roda teste em browser real via Playwright. Componente React/Vue testado em Chromium real, não JSDOM. Mais fiel pra interação de DOM." },
  ],
  gotchas: [
    "Esquecer globals: true em config — describe/it/expect não existem global, exige import. Time vindo de Jest estranha.",
    "Mocking de módulo não-hoisted — vi.mock precisa estar no topo (Vitest hoista, mas evite lógica antes).",
    "Browser mode adiciona setup pesado (Playwright) — vale só pra teste de componente.",
    "Vitest UI em CI — bonita pra dev, mas não roda em pipeline. Use vitest run --reporter=verbose em CI.",
  ],
  interview: [
    { q: "Por que Vitest é mais rápido que Jest?", a: "<p>Três motivos principais:</p><ul><li>esbuild/SWC faz transform de TS/JSX em ms; babel-jest faz em segundos</li><li>ESM nativo: sem CommonJS wrap e cache duplo de módulo</li><li>Vite dev server: arquivo só transforma quando muda, watch incremental, HMR de teste</li></ul><p>Em projeto medio: suite Jest de 30s vira Vitest de 3-5s.</p>" },
  ],
  resources: [
    { title: "Vitest Documentation", url: "https://vitest.dev/", kind: "docs" },
    { title: "Migrating from Jest", url: "https://vitest.dev/guide/migration.html", kind: "docs" },
    { title: "Vitest Browser Mode", url: "https://vitest.dev/guide/browser/", kind: "docs" },
  ],
}

export default vitest
