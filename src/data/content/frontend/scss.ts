import type { SkillContent } from '@/types'

const scss: SkillContent = {
    tagline: "Superset de CSS com variáveis, nesting, mixins e funções — compila para CSS.",
    why: "SCSS ainda aparece em codebases legados e em alguns design systems. Conhecer variáveis, mixins e @use é necessário para manutenção.",
    gotchas: [
      "@import está deprecated em favor de @use e @forward. @use tem namespace automático — variáveis de outro arquivo precisam de prefixo.",
      "Nesting excessivo (mais de 3 níveis) gera especificidade alta demais e CSS difícil de sobrescrever.",
      "Variáveis SCSS ($var) são compile-time. CSS custom properties (--var) são runtime — permitem mudança dinâmica com JS. Para temas dinâmicos, prefira CSS custom properties.",
    ],
}

export default scss
