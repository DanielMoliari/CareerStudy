import type { SkillContent } from '@/types'

const html: SkillContent = {
    tagline: "Linguagem de marcação que estrutura o conteúdo da web com semântica.",
    why: "HTML semântico correto é a base de acessibilidade, SEO e compatibilidade. Muitos erros de a11y vêm de HTML não-semântico.",
    gotchas: [
      "Usar div/span para tudo perde semântica. Use nav, main, article, section, header, footer, h1-h6, button, input, label.",
      "label sem for/htmlFor (ou sem input como filho) não conecta ao input — click no label não foca o campo.",
      "Imagens sem alt são inacessíveis para leitores de tela. alt='' para decorativas, alt descritivo para informativas.",
      "tabindex='0' torna elemento focável via teclado. tabindex='-1' remove do fluxo de Tab mas permite foco programático.",
    ],
}

export default html
