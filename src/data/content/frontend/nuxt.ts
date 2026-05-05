import type { SkillContent } from '@/types'

const nuxt: SkillContent = {
    tagline: "Meta-framework Vue com SSR, SSG, file-based routing e módulos do ecossistema.",
    why: "Nuxt é para Vue o que Next.js é para React. Se você trabalha com Vue em produção, conhecer Nuxt é obrigatório.",
    summary: "Nuxt 3 é o meta-framework Vue 3 com: routing baseado em arquivo, SSR/SSG/ISR, auto-imports de composables e components, módulos (image, auth, content, pwa), Nitro (engine de server), DevTools integrado.",
    keypoints: [
      { title: "Auto-imports", body: "Nuxt importa automaticamente composables de ~/composables/, components de ~/components/, utils de ~/utils/. Sem necessidade de import manual — convenção de arquivo substitui import explícito." },
      { title: "Rendering modes", body: "Universal (SSR default), SPA (sem server), SSG (pré-render), Hybrid (por rota com routeRules). Configure no nuxt.config.ts.", code: `// nuxt.config.ts — hybrid rendering por rota
routeRules: {
  '/':          { prerender: true },   // SSG
  '/dashboard': { ssr: false },        // SPA
  '/blog/**':   { isr: 3600 },         // ISR a cada 1h
}` },
      { title: "Módulos", body: "@nuxt/image (otimização automática), @nuxtjs/color-mode (dark mode), @nuxt/content (CMS baseado em arquivo), nuxt-auth-utils. Ecossistema extenso em nuxt.com/modules." },
      { title: "Nitro", body: "Server engine do Nuxt. Suporta múltiplos deployment targets: Node, Vercel, Netlify, Cloudflare Workers, Deno. server/api/ cria endpoints automaticamente com tipagem." },
    ],
    interview: [
      {
        q: "O que são auto-imports do Nuxt e qual o tradeoff?",
        a: "<p>Nuxt escaneia arquivos em ~/composables/, ~/components/, ~/utils/ e os importa automaticamente em qualquer arquivo — sem declaração de import. Composables como useRoute(), useState(), useFetch() também são auto-importados do core do Nuxt.</p><p>Vantagem: menos boilerplate, DX mais rápida. Tradeoff: novos devs não sabem de onde vem uma função sem conhecer a convenção. IDEs precisam de suporte para autocomplete funcionar. Configure imports explicitamente em projetos grandes se preferir rastreabilidade.</p>",
        level: "pleno",
      },
      {
        q: "Quais são os modos de rendering do Nuxt 3?",
        a: "<p><strong>Universal (SSR)</strong>: padrão. HTML gerado no servidor por request. Bom para SEO e dados personalizados.</p><p><strong>SSG</strong>: páginas pré-renderizadas em build time. Mais rápido, serve de CDN.</p><p><strong>SPA</strong>: sem server rendering — HTML vazio, Vue roda no browser. Para apps internos sem SEO.</p><p><strong>Hybrid (ISR/routeRules)</strong>: diferentes modos por rota no mesmo projeto. Home pode ser SSG, dashboard SPA, blog ISR. Configurado em routeRules do nuxt.config.ts.</p>",
        level: "pleno",
      },
      {
        q: "O que é Nitro e por que ele importa?",
        a: "<p>Nitro é o server engine do Nuxt 3 — responsável por compilar e servir o código do servidor. Suporta múltiplos targets de deploy: Node.js tradicional, Vercel Edge Functions, Netlify Functions, Cloudflare Workers, Deno. Isso significa que o mesmo código Nuxt pode ser deployado em qualquer plataforma sem mudança.</p><p>server/api/ cria endpoints automaticamente: um arquivo server/api/users.get.ts gera GET /api/users. Tipagem end-to-end com useFetch no cliente.</p>",
        level: "senior",
      },
      {
        q: "Como o Nuxt se compara ao Next.js para quem conhece React?",
        a: "<p>São equivalentes funcionalmente: meta-framework com SSR/SSG, routing baseado em arquivo, API routes. Diferenças práticas: Nuxt usa Vue (Composition API, templates) ao invés de React (JSX). Auto-imports do Nuxt são mais agressivos que o Next.js. Nitro vs Next.js server são abordagens diferentes de deployment flexibility. Módulos Nuxt vs plugins Next.js têm ecossistemas separados.</p><p>Para quem já sabe Next.js: curva de aprendizado é a Vue + convenções Nuxt, não o conceito de SSR/SSG.</p>",
        level: "senior",
      },
    ],
    gotchas: [
      "Auto-imports podem confundir novos devs no codebase — a origem de uma função não é óbvia sem conhecer as convenções de pasta.",
      "SSR requer que composables sejam SSR-safe: sem acesso a window, document, localStorage no top-level. Use onMounted() ou process.client para código browser-only.",
    ],
    resources: [
      { title: "Nuxt 3 docs", url: "https://nuxt.com/docs", kind: "docs" },
      { title: "Nuxt modules", url: "https://nuxt.com/modules", kind: "docs" },
    ],
}

export default nuxt
