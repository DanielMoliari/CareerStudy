import type { SkillContent } from '@/types'

const zod: SkillContent = {
    tagline: "Schema validation TypeScript-first com inferência de tipo automática.",
    why: "Zod se tornou padrão para validação de input em TypeScript. Integra com React Hook Form, tRPC, Prisma, OpenAI structured outputs. Saber criar schemas compostos, transformações e usar .parse vs .safeParse é básico para sênior.",
    summary: "Zod é uma biblioteca de schema declaration e validation TypeScript-first. Você define o schema uma vez e Zod infere o tipo TypeScript automaticamente (z.infer<typeof schema>). Funciona em runtime para validar dados externos (forms, APIs, env vars).",
    keypoints: [
      { title: "Schema declaration", body: "z.string(), z.number(), z.boolean(), z.object({}), z.array(), z.union(), z.enum(), z.literal(). Métodos encadeados: .min(), .max(), .email(), .optional(), .nullable(), .default().", code: `const userSchema = z.object({
  name:  z.string().min(2).max(100),
  email: z.string().email(),
  age:   z.number().int().min(18).optional(),
  role:  z.enum(['admin', 'user']).default('user'),
})` },
      { title: "z.infer", body: "Extrai o tipo TypeScript do schema: type User = z.infer<typeof userSchema>. Elimina duplicação entre runtime validation e tipos TS. Uma fonte de verdade para schema e tipo.", code: `const userSchema = z.object({ name: z.string(), age: z.number() })
type User = z.infer<typeof userSchema>
// { name: string; age: number }` },
      { title: ".parse vs .safeParse", body: ".parse lança ZodError se inválido. .safeParse retorna { success, data } ou { success: false, error } sem lançar. Use .safeParse em contextos onde você trata o erro (Server Actions, API handlers).", code: `// safeParse — não lança
const result = schema.safeParse(input)
if (!result.success) {
  const errors = result.error.flatten().fieldErrors
  return { error: errors }
}
const data = result.data // tipado corretamente` },
      { title: "Transformações", body: ".transform() converte o valor após validação. .preprocess() converte antes. Útil para coercion (string para number, string para Date). z.coerce.number() faz coercion automática.", code: `const dateSchema = z.string().transform(s => new Date(s))
const numSchema  = z.coerce.number() // '42' → 42

const trimmed = z.string().transform(s => s.trim().toLowerCase())` },
      { title: "Composição de schemas", body: ".extend(), .merge(), .pick(), .omit(), .partial() manipulam schemas existentes. Permite reutilizar schemas base e derivar variações sem duplicação.", code: `const base = z.object({ id: z.string(), name: z.string() })
const create = base.omit({ id: true })  // sem id no POST
const update = base.partial()           // todos opcionais no PATCH` },
    ],
    interview: [
      {
        q: "Qual a diferença entre .parse() e .safeParse()?",
        a: "<p><strong>.parse()</strong>: lança ZodError se o input for inválido. Use em contextos onde falha deve parar a execução (inicialização de app, validação de env vars).</p><p><strong>.safeParse()</strong>: retorna <code>{ success: true, data }</code> ou <code>{ success: false, error }</code> sem lançar. Use quando você quer tratar o erro programaticamente — Server Actions, API handlers, formulários.</p><p>Regra prática: safeParse em runtime com input do usuário, parse em startup com configuração interna.</p>",
        tip: "Mostrar o caso de uso de validação de env vars com parse() (app falha no startup com erro claro) é diferencial real.",
        level: "pleno",
      },
      {
        q: "Como Zod elimina duplicação entre schema e tipos TypeScript?",
        a: "<p>Sem Zod: você declara o tipo TypeScript e escreve validação separada — duas fontes de verdade que podem divergir. Com Zod: declare o schema uma vez e use z.infer<typeof schema> para extrair o tipo automaticamente. O tipo é gerado a partir do schema, nunca o contrário.</p><p>Isso garante que se você mudar o schema (adicionar um campo obrigatório), o tipo TypeScript muda junto e o compilador aponta onde o código precisa ser atualizado.</p>",
        level: "pleno",
      },
      {
        q: "Como você valida variáveis de ambiente com Zod?",
        a: "<p>Padrão comum em projetos Next.js: crie um arquivo env.ts que valida process.env com um schema Zod no startup.</p><pre><code>const envSchema = z.object({\n  DATABASE_URL: z.string().url(),\n  NEXTAUTH_SECRET: z.string().min(32),\n  NODE_ENV: z.enum(['development', 'production', 'test']),\n})\nexport const env = envSchema.parse(process.env)</code></pre><p>Se uma variável obrigatória faltar, o app falha no startup com mensagem clara — não em produção com comportamento imprevisível.</p>",
        tip: "Validação de env vars é um dos casos de uso mais práticos de Zod. Quem usa isso em produção claramente entende o valor real.",
        level: "pleno",
      },
      {
        q: "O que são transformações em Zod e quando usá-las?",
        a: "<p>.transform() converte o valor validado para outro formato. .preprocess() converte antes da validação (coercion). z.coerce.* faz coercion automática (string → number, string → Date).</p><p>Casos reais: campos de data que chegam como string ISO precisam virar Date; campos numéricos em query params chegam como string; campos de texto precisam de trim/lowercase antes de salvar.</p>",
        level: "pleno",
      },
      {
        q: "Como compor schemas Zod para criar variações (create vs update)?",
        a: "<p>Zod tem métodos de composição: .pick() seleciona campos, .omit() exclui, .partial() torna todos opcionais, .required() torna todos obrigatórios, .extend() adiciona campos, .merge() combina dois schemas.</p><p>Padrão CRUD: um schema base com todos os campos, create omite id (gerado pelo banco), update usa partial (nem todo campo obrigatório em PATCH).</p>",
        tip: "Mostrar o padrão base → create/update com omit e partial demonstra uso real — não apenas conhecimento da API.",
        level: "pleno",
      },
      {
        q: "Como usar Zod com React Hook Form?",
        a: "<p>Instale @hookform/resolvers. Use zodResolver(schema) como resolver do useForm. O RHF usa o schema para validação e inferência de tipos dos campos automaticamente.</p><pre><code>const form = useForm&lt;z.infer&lt;typeof formSchema&gt;&gt;({\n  resolver: zodResolver(formSchema),\n  defaultValues: { email: '', name: '' },\n})</code></pre><p>Com isso, type safety do campo, validação automática e mensagens de erro do schema sem código manual.</p>",
        level: "pleno",
      },
    ],
    diagrams: [
      {
        title: "Zod — uma fonte de verdade para schema e tipo",
        html: `<style>
.zod-diag{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.zod-box{background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:12px 16px;font-size:11px}
.zod-bad{border-color:#ef4444;background:#1e0f0f}
.zod-good{border-color:#4ade80;background:#0f1e13}
.zod-label{font-size:9px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:8px}
</style>
<div class="zod-diag">
  <p style="color:#e2e8f0;font-size:12px;font-weight:700;margin:0 0 16px">Zod — uma fonte de verdade, dois benefícios</p>
  <div style="display:flex;gap:12px;margin-bottom:12px">
    <div class="zod-box zod-bad" style="flex:1">
      <div class="zod-label" style="color:#ef4444">Sem Zod — duas fontes de verdade</div>
      <div style="color:#94a3b8;line-height:2">
        <span style="color:#475569">// tipo TypeScript</span><br>
        <span style="color:#7c3aed">type</span> User = { name: <span style="color:#38bdf8">string</span>; age: <span style="color:#38bdf8">number</span> }<br><br>
        <span style="color:#475569">// validação separada (pode divergir!)</span><br>
        <span style="color:#7c3aed">if</span> (<span style="color:#7c3aed">typeof</span> body.name !== <span style="color:#4ade80">'string'</span>) ...<br>
        <span style="color:#7c3aed">if</span> (<span style="color:#7c3aed">typeof</span> body.age  !== <span style="color:#4ade80">'number'</span>) ...
      </div>
    </div>
    <div class="zod-box zod-good" style="flex:1">
      <div class="zod-label" style="color:#4ade80">Com Zod — uma fonte de verdade</div>
      <div style="color:#94a3b8;line-height:2">
        <span style="color:#475569">// schema = validação + tipo</span><br>
        <span style="color:#7c3aed">const</span> userSchema = z.object({<br>
        &nbsp; name: z.string(),<br>
        &nbsp; age:  z.number(),<br>
        })<br>
        <span style="color:#7c3aed">type</span> User = z.<span style="color:#4ade80">infer</span>&lt;<span style="color:#7c3aed">typeof</span> userSchema&gt;
      </div>
    </div>
  </div>
  <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:10px 14px;font-size:11px;color:#475569;line-height:1.8">
    <strong style="color:#94a3b8">Fluxo:</strong> schema → .parse(input) em runtime valida os dados → z.infer extrai o tipo em compile-time → sem divergência possível entre validação e tipo.
  </div>
</div>`,
        caption: "Schema Zod = validação em runtime + tipo TypeScript automaticamente. Mudar o schema atualiza o tipo — o compilador aponta onde o código quebra.",
      },
    ],
    gotchas: [
      "ZodError tem formato verbose. Use .flatten() ou .formErrors para mensagens amigáveis em formulários.",
      ".optional() é diferente de .nullable(): optional = pode ser undefined; nullable = pode ser null. Para ambos: .nullish().",
      "Zod valida apenas em runtime. O tipo TypeScript inferido é apenas compile-time — não garante nada sem o .parse().",
    ],
    resources: [
      { title: "Zod docs", url: "https://zod.dev/", kind: "docs" },
      { title: "Total TypeScript — Zod tutorial", url: "https://www.totaltypescript.com/tutorials/zod", kind: "curso" },
    ],
}

export default zod
