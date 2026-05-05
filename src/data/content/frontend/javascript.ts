import type { SkillContent } from '@/types'

const javascript: SkillContent = {
    tagline: "A linguagem da web — base de todo frontend e backend Node.js.",
    why: "TypeScript compila para JavaScript. Entender o runtime JS (event loop, closures, prototype chain) é necessário para depurar bugs que TypeScript não previne.",
    gotchas: [
      "== faz coerção de tipo implícita (null == undefined é true). Sempre use ===.",
      "var tem function scope e hoisting. Prefira const e let que têm block scope.",
      "this muda de acordo com como a função é chamada — não onde foi definida. Arrow functions capturam o this léxico do escopo externo.",
      "JSON.parse/stringify não serializa undefined, funções ou circular refs — lança silenciosamente ou retorna undefined.",
      "0.1 + 0.2 !== 0.3 — floating point. Para dinheiro, use inteiros (centavos) ou Intl.NumberFormat.",
    ],
}

export default javascript
