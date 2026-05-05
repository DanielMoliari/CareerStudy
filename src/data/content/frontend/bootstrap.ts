import type { SkillContent } from '@/types'

const bootstrap: SkillContent = {
    tagline: "Framework CSS com grid, componentes e utilitários — padrão legado.",
    why: "Bootstrap ainda está em incontáveis projetos legados. Entender o grid system e como sobrescrever estilos é necessário para manutenção.",
    gotchas: [
      "Bootstrap 5 removeu jQuery — não misture com código que depende de jQuery Bootstrap 4.",
      "Sobrescrever Bootstrap via !important cria cascata de !important difícil de gerenciar. Use variáveis SCSS antes de compilar.",
      "O grid de 12 colunas ainda é útil, mas para layouts modernos, CSS Grid nativo é mais poderoso e sem overhead de classes.",
    ],
}

export default bootstrap
