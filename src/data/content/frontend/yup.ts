import type { SkillContent } from '@/types'

const yup: SkillContent = {
    tagline: "Schema validation JavaScript com API fluente — par natural do Formik.",
    why: "Yup é o validador padrão com Formik e ainda aparece em muitas codebases. Em projetos novos com TypeScript, Zod é preferível (inferência de tipo melhor). Entender Yup é necessário para manutenção.",
    summary: "Yup é uma biblioteca de schema validation com API fluente e encadeada. Define regras com yup.object(), yup.string().email().required(), yup.number().min(). Assíncrono por padrão. Integra com Formik via validationSchema.",
    keypoints: [
      { title: "Schema declaration", body: "yup.object() define shape do objeto. yup.string(), yup.number(), yup.boolean(), yup.array(), yup.date(). Métodos encadeados: .required(), .min(), .max(), .email(), .url(), .matches().", code: `const schema = yup.object({
  name: yup.string().required('Nome obrigatório').min(2),
  age: yup.number().min(18, 'Maior de 18').required(),
  email: yup.string().email('E-mail inválido').required(),
})` },
      { title: "when() — validação condicional", body: "when() condiciona validação baseada em outros campos do schema.", code: `cpf: yup.string().when('tipo', {
  is: 'pessoa_fisica',
  then: (s) => s.required(),
  otherwise: (s) => s.optional(),
})` },
      { title: "Yup vs Zod", body: "Yup: API fluente, assíncrono, mais maduro. Não gera tipos TypeScript automaticamente — precisa de InferType. Zod: TypeScript-first, inferência automática com z.infer, melhor DX em TS. Em projetos TS novos, prefira Zod." },
    ],
    interview: [
      { q: "Qual a diferença entre Yup e Zod?", a: "<p>Yup é mais antigo, assíncrono por padrão e tem API fluente. Para extrair tipos TypeScript, usa yup.InferType — funciona mas é menos ergonômico. Zod é TypeScript-first: o tipo é inferido automaticamente com z.infer, não há duplicação entre schema e tipo. Em projetos TypeScript modernos, Zod é a escolha padrão. Yup ainda aparece em codebases existentes com Formik.</p>", level: "pleno" },
      { q: "Como fazer validação condicional com Yup?", a: "<p>Use when(campo, { is: valor, then: schema, otherwise: schema }). O campo pode ser uma string (nome de outro campo no objeto) ou array de nomes. then e otherwise recebem uma função que modifica o schema para a condição.</p>", level: "pleno" },
      { q: "Por que yup.string().required() aceita string vazia?", a: "<p>Por design: required() em Yup verifica apenas que o valor não é null nem undefined — string vazia ('') passa pela validação. Para rejeitar strings vazias, combine: yup.string().required('Obrigatório').min(1, 'Não pode ser vazio'). Esse é um dos gotchas mais comuns em Yup e o motivo pelo qual Zod tem comportamento diferente (required implica não-vazio em strings).</p>", tip: "Citar esse comportamento contraintuitivo mostra que você usou Yup em produção e encontrou o problema real.", level: "pleno" },
      { q: "Como extrair tipos TypeScript de um schema Yup?", a: "<p>Use yup.InferType<typeof schema>: define o schema com yup.object() e extrai o tipo com InferType. Funciona mas tem limitações: campos com .transform() podem produzir tipos incorretos porque Yup não rastreia transformações no sistema de tipos. Para TypeScript-first com inferência precisa de transformações, Zod é superior.</p>", level: "pleno" },
    ],
    gotchas: [
      "yup.required() não bloqueia string vazia — use .min(1) também se quiser rejeitar ''. String vazia passa por required.",
      "Validações são assíncronas por padrão. Em ambientes síncronos, use schema.validateSync().",
      "Yup não infere tipos TypeScript automaticamente como Zod. Use yup.InferType<typeof schema> explicitamente.",
    ],
    resources: [
      { title: "Yup docs", url: "https://github.com/jquense/yup", kind: "docs" },
    ],
}

export default yup
