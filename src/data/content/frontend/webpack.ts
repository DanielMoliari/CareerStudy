import type { SkillContent } from '@/types'

const webpack: SkillContent = {
    tagline: "Bundler JavaScript — empacota módulos, assets e dependências para produção.",
    why: "Webpack ainda domina em projetos legados e em configurações que Vite não cobre (micro-frontends complexos, module federation). Entender a configuração é necessário para debugging de build.",
    gotchas: [
      "Webpack 5 Module Federation permite compartilhar código entre apps em runtime — não confunda com sharing em monorepo (compile-time).",
      "Configurações erradas de source maps podem vazar código-fonte em produção. Use hidden-source-map para produção.",
      "Plugins e loaders têm ordem de execução específica — loaders rodam de baixo para cima, plugins em hooks do ciclo de build.",
    ],
}

export default webpack
