import type { SkillContent } from '@/types'

const styledComponents: SkillContent = {
    tagline: "CSS-in-JS que usa template literals para estilizar componentes React com escopo automático.",
    why: "Styled-components ainda aparece em muitas codebases React. Com a ascensão de Tailwind e o movimento para zero-runtime CSS, está perdendo adoção — mas é necessário para manutenção.",
    gotchas: [
      "CSS-in-JS em runtime tem custo: serialização de estilos, injeção de <style> tags, re-serialização em SSR. Em apps com muitos componentes, impacta performance.",
      "Styled-components cria novas classes a cada render quando props mudam — certifique-se de que os estilos dinâmicos sejam mínimos.",
      "Com React Server Components (Next.js App Router), CSS-in-JS tradicional não funciona sem configuração extra — estilos são gerados em runtime no cliente.",
    ],
}

export default styledComponents
