import type { SkillContent } from '@/types'

const vite: SkillContent = {
    tagline: "Build tool moderna para frontend: dev server instantâneo com HMR e build otimizado via Rollup.",
    why: "Vite substituiu Webpack como padrão em projetos Vue, React e Svelte. Saber configurar plugins, lidar com env vars e entender o modelo de transformação é básico.",
    summary: "Vite usa ES modules nativos no dev server (sem bundling durante dev — arquivos são transformados sob demanda). Em produção, usa Rollup para bundle otimizado. HMR ultra-rápido. Suporta React, Vue, Svelte, Lit e mais via plugins.",
    keypoints: [
      { title: "Dev server com ESM nativo", body: "Dev server serve arquivos como ES modules nativos. O navegador faz os imports e Vite transforma cada arquivo ao ser pedido (TypeScript, JSX, CSS). Sem bundle em dev = startup em < 1s independente do tamanho do projeto." },
      { title: "HMR (Hot Module Replacement)", body: "Vite atualiza apenas o módulo alterado no browser sem reload de página. Mais preciso e rápido que webpack-dev-server porque só o arquivo editado é re-processado." },
      { title: "Rollup em produção", body: "Build de produção usa Rollup: tree-shaking, code-splitting automático, minificação. Saída bem otimizada. Differe do dev server — é um bundler tradicional, não ESM nativo.", code: `// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: { vendor: ['react', 'react-dom'] },
      },
    },
  },
})` },
      { title: "Plugins", body: "@vitejs/plugin-react (JSX + Fast Refresh), @vitejs/plugin-vue (SFC + HMR). Ecossistema extenso. Compatível com plugins Rollup — o mesmo plugin funciona em dev e build." },
      { title: "Env vars", body: "Arquivos .env, .env.local, .env.production. Apenas variáveis com prefixo VITE_ são expostas ao cliente. Acesso via import.meta.env.VITE_API_URL (não process.env).", code: `// .env
VITE_API_URL=https://api.exemplo.com
SECRET_KEY=nao-exposta  # sem VITE_ = só no server

// código cliente:
const url = import.meta.env.VITE_API_URL` },
    ],
    interview: [
      {
        q: "Por que o Vite é mais rápido que o Webpack no dev server?",
        a: "<p>Webpack empacota todos os módulos em um bundle antes de servir. Em projetos grandes, isso leva dezenas de segundos. Vite não faz bundle em dev: serve arquivos como ES modules nativos e transforma cada arquivo individualmente ao ser requisitado pelo browser. O startup é praticamente instantâneo independente do tamanho do projeto.</p><p>HMR também é mais rápido: Vite invalida apenas o módulo editado, não propaga para dependências desnecessariamente.</p>",
        tip: "A distinção 'sem bundle em dev' vs 'bundle completo no Webpack' é o coração da resposta. Mencionar isso diretamente mostra que você entende o mecanismo.",
        level: "pleno",
      },
      {
        q: "Qual a diferença entre o dev server e o build de produção do Vite?",
        a: "<p><strong>Dev server</strong>: arquivos servidos como ES modules nativos, sem bundle, transformação sob demanda. Usa esbuild para transformações rápidas de TypeScript e JSX.</p><p><strong>Build de produção</strong>: usa Rollup como bundler — gera chunks otimizados, tree-shaking, minificação, code-splitting. O resultado é um bundle tradicional otimizado para produção.</p><p>Consequência: comportamento pode diferir entre dev e prod. Sempre teste com vite preview antes de deploiar — simula o build de produção servido localmente.</p>",
        tip: "Mencionar o vite preview como passo de validação antes do deploy mostra prática real, não só conhecimento teórico.",
        level: "pleno",
      },
      {
        q: "Como variáveis de ambiente funcionam no Vite?",
        a: "<p>Vite lê arquivos .env, .env.local, .env.[mode] (ex: .env.production). Apenas variáveis com prefixo VITE_ são injetadas no bundle do cliente — as outras ficam acessíveis apenas no servidor/build script.</p><p>Acesso no código: import.meta.env.VITE_NOME (não process.env). TypeScript: declare interface ImportMetaEnv em vite-env.d.ts para autocomplete.</p>",
        level: "pleno",
      },
      {
        q: "Como você configuraria Vite para um projeto com múltiplos entry points ou micro-frontends?",
        a: "<p>Via rollupOptions.input: especifique múltiplos entry points como objeto. Cada entry gera seu próprio bundle. Para micro-frontends com Module Federation: use o plugin vite-plugin-federation (equivalente ao Webpack 5 Module Federation).</p><p>Para bibliotecas publicáveis: modo lib do Vite (build.lib) gera CJS + ESM automaticamente com externals configurados — sem incluir React/Vue no bundle da lib.</p>",
        level: "senior",
      },
    ],
    gotchas: [
      "Dynamic imports com variáveis (import('./' + file)) podem não funcionar corretamente — Vite tem limitações com globs dinâmicos. Use import.meta.glob para importação dinâmica de arquivos.",
      "Diferença de comportamento dev/prod: dev usa ESM nativo (mais permissivo), prod usa Rollup (mais estrito). Teste sempre com vite preview antes de deploiar.",
    ],
    resources: [
      { title: "Vite docs", url: "https://vitejs.dev/guide/", kind: "docs" },
      { title: "Vite plugins", url: "https://vitejs.dev/plugins/", kind: "docs" },
    ],
}

export default vite
