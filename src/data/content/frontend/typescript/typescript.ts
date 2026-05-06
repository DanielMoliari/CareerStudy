import type { SkillContent } from '@/types'

const typescript: SkillContent = {
    tagline: "JavaScript com tipos estáticos — padrão atual de qualquer codebase profissional.",
    why: "TypeScript é pré-requisito em praticamente toda vaga frontend e backend sênior. Além de evitar bugs em tempo de desenvolvimento, serve como documentação viva do código. Saber usar generics, utility types, narrowing e os recursos avançados do sistema de tipos diferencia sênior de pleno em entrevistas técnicas. O ecossistema inteiro (React, Next.js, NestJS, Prisma, tRPC, Zod) assume TypeScript como padrão.",
    prerequisite: "JavaScript ES6+ (arrow functions, destructuring, spread, promises, async/await, módulos). Entender closures, prototype chain e o event loop ajuda muito a entender onde os tipos têm valor.",
    summary: "TypeScript adiciona tipos estáticos opcionais ao JavaScript, compilando para JS puro. O sistema de tipos é estrutural (duck typing), não nominal — se dois objetos têm a mesma forma, são compatíveis. Tipos são apagados em runtime; TypeScript só existe em tempo de desenvolvimento. O compilador tem inferência sofisticada que elimina a necessidade de anotar tudo manualmente — bons projetos TypeScript têm menos anotações explícitas do que os iniciantes esperariam. A partir do TS 4.x, recursos como template literal types, satisfies operator, const assertions e variadic tuple types ampliam o que é possível expressar no sistema de tipos. O modo strict ativa strictNullChecks (null e undefined são tipos distintos), noImplicitAny, strictFunctionTypes e outros — em projetos novos, sempre ative strict: true no tsconfig.",
    howToStudy: "<strong>Modelo mental central:</strong> TypeScript é uma <em>linguagem de conjuntos</em> — tipos são conjuntos de valores. string é o conjunto de todas as strings. 'ok' é o conjunto com apenas um elemento. Union (A|B) é a união dos conjuntos. Intersection (A&B) é a interseção. never é o conjunto vazio. unknown é o conjunto de todos os valores.<br><br><strong>Sequência recomendada:</strong><ol><li>Domine os 5 pilares: narrowing, generics, utility types, conditional types, mapped types.</li><li>Leia o TypeScript Handbook completo — não é longo e cobre tudo que importa.</li><li>Pratique em Type Challenges (easy → medium). Cada exercício força você a pensar em tipos como transformações.</li><li>Configure strict: true num projeto real e corrija todos os erros — é o melhor aprendizado.</li></ol>",
    diagrams: [
      {
        title: "Sistema de tipos TypeScript — hierarquia, narrowing e fluxo de inferência",
        html: `<style>
.ts-diag{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.ts-box{border-radius:8px;padding:10px 16px;font-size:11px;text-align:center;border:1.5px solid}
.ts-top{background:#1e3a5c;border-color:#3178C6;color:#93c5fd;font-weight:700}
.ts-mid{background:#1e293b;border-color:#334155;color:#94a3b8}
.ts-bot{background:#0f172a;border-color:#1e293b;color:#475569}
.ts-arrow{color:#3178C6;text-align:center;font-size:16px;line-height:1}
.ts-label{font-size:9px;color:#3178C6;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px}
.ts-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(49,120,198,.5);display:inline}
.ts-tip:hover .ts-tb{display:block}
.ts-tb{display:none;position:absolute;bottom:calc(100%+8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:220px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.ts-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
@keyframes ts-narrow{0%,100%{background:#1e3a5c;border-color:#3178C6}50%{background:#1e4a2a;border-color:#4ade80}}
.ts-narrow-anim{animation:ts-narrow 2.5s ease-in-out infinite;border-radius:6px;padding:6px 12px;font-size:11px;border:1.5px solid;display:inline-block;margin-top:4px}
</style>
<div class="ts-diag">
  <p style="color:#93c5fd;font-size:12px;font-weight:700;margin:0 0 4px">Hierarquia de tipos TypeScript</p>
  <p style="color:#475569;font-size:10px;margin:0 0 18px">Passe o mouse nos termos <span style="border-bottom:1px dashed rgba(49,120,198,.5)">sublinhados</span></p>
  <div style="display:flex;flex-direction:column;gap:8px;max-width:520px;margin:0 auto">
    <div class="ts-label">Topo — supertipo de tudo</div>
    <div style="display:flex;gap:8px">
      <div class="ts-box ts-top" style="flex:1"><span class="ts-tip">unknown<span class="ts-tb">Supertipo de todos os tipos. Você não pode operar sem narrowing. Versão segura de any — force quem usa a verificar antes. Use em catch clauses, JSON.parse, APIs externas.</span></span></div>
      <div class="ts-box ts-top" style="flex:1"><span class="ts-tip">any<span class="ts-tb">Opt-out do sistema de tipos. Silencia todos os erros. Use com extrema moderação — basicamente você sai do TypeScript e volta para JS puro.</span></span></div>
    </div>
    <div class="ts-arrow">↓ assignable to</div>
    <div class="ts-label">Primitivos e objetos</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <div class="ts-box ts-mid" style="flex:1 0 80px">string</div>
      <div class="ts-box ts-mid" style="flex:1 0 80px">number</div>
      <div class="ts-box ts-mid" style="flex:1 0 80px">boolean</div>
      <div class="ts-box ts-mid" style="flex:1 0 80px">object</div>
      <div class="ts-box ts-mid" style="flex:1 0 80px">symbol</div>
      <div class="ts-box ts-mid" style="flex:1 0 80px">bigint</div>
    </div>
    <div class="ts-arrow">↓ assignable to</div>
    <div class="ts-label">Tipos literais (valores específicos)</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <div class="ts-box ts-mid" style="flex:1 0 80px">'ok' | 'error'</div>
      <div class="ts-box ts-mid" style="flex:1 0 80px">1 | 2 | 3</div>
      <div class="ts-box ts-mid" style="flex:1 0 80px">true</div>
    </div>
    <div class="ts-arrow">↓ assignable to</div>
    <div class="ts-label">Fundo — subtipo de tudo</div>
    <div style="display:flex;gap:8px">
      <div class="ts-box ts-bot" style="flex:1"><span class="ts-tip">never<span class="ts-tb">Tipo vazio — nenhum valor pode ser never. Representa código inalcançável. Útil para exaustividade em switch: se chegou aqui é bug. Aparece em conditional types quando a condição nunca é satisfeita.</span></span></div>
      <div class="ts-box ts-bot" style="flex:1"><span class="ts-tip">null / undefined<span class="ts-tb">Com strictNullChecks: tipos distintos, não atribuíveis a outros. Sem strict: se comportam como any em atribuição — ative sempre strict: true.</span></span></div>
    </div>
    <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px 16px;margin-top:8px">
      <div style="font-size:9px;color:#3178C6;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px">Narrowing — o compilador afina o tipo em branches</div>
      <div style="font-size:11px;color:#64748b;line-height:2">
        <span style="color:#7c3aed">function</span> f(x: <span style="color:#93c5fd">string | number</span>) {<br>
        &nbsp;&nbsp;<span style="color:#7c3aed">if</span> (<span style="color:#7c3aed">typeof</span> x === <span style="color:#4ade80">'string'</span>) {<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#475569">// x é </span><span class="ts-narrow-anim" style="color:#4ade80">string</span><span style="color:#475569"> aqui</span><br>
        &nbsp;&nbsp;}<br>
        &nbsp;&nbsp;<span style="color:#475569">// x é </span><span class="ts-narrow-anim" style="color:#93c5fd;animation-delay:.8s">number</span><span style="color:#475569"> aqui</span><br>
        }
      </div>
    </div>
    <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:10px 14px;margin-top:4px;font-size:11px;color:#94a3b8;line-height:1.7">
      <strong style="color:#3178C6">Regra de ouro:</strong> TypeScript é <span class="ts-tip">estrutural<span class="ts-tb">Forma importa, nome não. { x: number } satisfaz Point mesmo sem herança explícita. Diferente de Java/C# que são nominais — nome da classe importa.</span></span>, não nominal. Tipos são apagados em runtime — só existem no compilador.
    </div>
  </div>
</div>`,
        caption: "unknown força narrowing; any desliga o compilador. never = conjunto vazio = código inalcançável. Estrutural = forma importa, nome não. Tipos só existem em compile-time.",
      },
      {
        title: "Utility Types — transformações do sistema de tipos",
        html: `<style>
.tsu-diag{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.tsu-card{background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:10px 14px;font-size:10.5px}
.tsu-name{color:#3178C6;font-weight:700;font-size:12px;margin-bottom:6px}
.tsu-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(49,120,198,.4);display:inline}
.tsu-tip:hover .tsu-tb{display:block}
.tsu-tb{display:none;position:absolute;bottom:calc(100%+6px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:8px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:220px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.tsu-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:4px solid transparent;border-top-color:#334155}
</style>
<div class="tsu-diag">
  <p style="color:#93c5fd;font-size:12px;font-weight:700;margin:0 0 4px">Utility Types — os mais cobrados em entrevista</p>
  <p style="color:#475569;font-size:10px;margin:0 0 16px">Passe o mouse nos termos <span style="border-bottom:1px dashed rgba(49,120,198,.4)">sublinhados</span></p>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
    <div class="tsu-card">
      <div class="tsu-name">Partial&lt;T&gt;</div>
      <div style="color:#94a3b8;line-height:1.7">Torna todos os campos <span class="tsu-tip">opcionais<span class="tsu-tb">Útil para parâmetros de update: não precisa enviar todos os campos no PATCH.</span></span>.<br><code style="color:#4ade80">type Update = Partial&lt;User&gt;</code><br><code style="color:#475569">// { name?: string; age?: number }</code></div>
    </div>
    <div class="tsu-card">
      <div class="tsu-name">Required&lt;T&gt;</div>
      <div style="color:#94a3b8;line-height:1.7">Torna todos os campos <span class="tsu-tip">obrigatórios<span class="tsu-tb">Inverso de Partial. Útil após transformar um tipo com muitos opcionais.</span></span>.<br><code style="color:#4ade80">type Full = Required&lt;Config&gt;</code><br><code style="color:#475569">// todos os ? removidos</code></div>
    </div>
    <div class="tsu-card">
      <div class="tsu-name">Pick&lt;T, K&gt;</div>
      <div style="color:#94a3b8;line-height:1.7">Seleciona um <span class="tsu-tip">subconjunto<span class="tsu-tb">K é um union de chaves de T. Útil para DTOs e props de componente.</span></span> de campos.<br><code style="color:#4ade80">type Preview = Pick&lt;Post, 'id'|'title'&gt;</code></div>
    </div>
    <div class="tsu-card">
      <div class="tsu-name">Omit&lt;T, K&gt;</div>
      <div style="color:#94a3b8;line-height:1.7">Remove campos <span class="tsu-tip">específicos<span class="tsu-tb">Inverso de Pick. Útil para remover id ao criar (POST sem id gerado pelo banco).</span></span> do tipo.<br><code style="color:#4ade80">type Create = Omit&lt;User, 'id'|'createdAt'&gt;</code></div>
    </div>
    <div class="tsu-card">
      <div class="tsu-name">Record&lt;K, V&gt;</div>
      <div style="color:#94a3b8;line-height:1.7">Cria <span class="tsu-tip">mapa tipado<span class="tsu-tb">K é o tipo das chaves, V dos valores. Mais seguro que { [key: string]: V }.</span></span> de K para V.<br><code style="color:#4ade80">type Labels = Record&lt;'ok'|'err', string&gt;</code></div>
    </div>
    <div class="tsu-card">
      <div class="tsu-name">ReturnType&lt;F&gt;</div>
      <div style="color:#94a3b8;line-height:1.7">Extrai o tipo de <span class="tsu-tip">retorno<span class="tsu-tb">Útil para tipar variáveis sem duplicar o tipo de retorno da função.</span></span> de uma função.<br><code style="color:#4ade80">type R = ReturnType&lt;typeof getUser&gt;</code><br><code style="color:#475569">// User | null</code></div>
    </div>
    <div class="tsu-card">
      <div class="tsu-name">Awaited&lt;T&gt;</div>
      <div style="color:#94a3b8;line-height:1.7">Extrai o tipo de dentro de uma <span class="tsu-tip">Promise<span class="tsu-tb">Awaited&lt;Promise&lt;User&gt;&gt; = User. Recursivo: Awaited&lt;Promise&lt;Promise&lt;string&gt;&gt;&gt; = string.</span></span>.<br><code style="color:#4ade80">type U = Awaited&lt;Promise&lt;User&gt;&gt;</code><br><code style="color:#475569">// User</code></div>
    </div>
    <div class="tsu-card">
      <div class="tsu-name">NonNullable&lt;T&gt;</div>
      <div style="color:#94a3b8;line-height:1.7">Remove <span class="tsu-tip">null e undefined<span class="tsu-tb">NonNullable&lt;string | null | undefined&gt; = string. Útil após validações.</span></span> do tipo.<br><code style="color:#4ade80">type S = NonNullable&lt;string | null&gt;</code><br><code style="color:#475569">// string</code></div>
    </div>
  </div>
</div>`,
        caption: "Utility types são transformações do sistema de tipos. Partial+Pick+Omit cobrem 80% dos casos de CRUD tipado. Memorize os 8 acima — todos caem em entrevista.",
      },
    ],
    keypoints: [
      {
        title: "Structural typing — forma importa, nome não",
        body: "TypeScript usa tipagem estrutural: se um objeto tem as propriedades necessárias, ele é do tipo — independente de qual classe ou função o criou. Diferente de Java/C# (nominal). Isso permite flexibilidade mas pode surpreender: dois tipos incompatíveis por nome podem ser atribuíveis entre si se a estrutura for compatível.",
        code: `interface Point { x: number; y: number }
// p tem mais propriedades mas é compatível com Point:
const p = { x: 1, y: 2, z: 3 }
const q: Point = p // ✓ ok — estrutura compatível

// Mas literais de objeto têm excess property checking:
const r: Point = { x: 1, y: 2, z: 3 } // ✗ erro direto no literal`,
      },
      {
        title: "Discriminated union — estado exclusivo tipado",
        body: "Union com um campo discriminador literal é o padrão mais poderoso para modelar estados que não podem coexistir. O compilador sabe exatamente quais campos existem em cada branch. Preferido para modelar respostas de API, estados de máquina, mensagens.",
        code: `type ApiResult<T> =
  | { status: 'ok';      data: T }
  | { status: 'error';   message: string }
  | { status: 'loading' }

function handle<T>(r: ApiResult<T>) {
  switch (r.status) {
    case 'ok':      return r.data     // T — TypeScript sabe
    case 'error':   return r.message  // string
    case 'loading': return null
    // TypeScript avisa se você esquecer um case
  }
}`,
      },
      {
        title: "Generics — reutilizar lógica com type safety",
        body: "Funções e tipos parametrizados por tipo. Permite reusar lógica mantendo type safety. Constraints (T extends X) limitam o que T pode ser. Inferência automática evita anotação na maioria dos casos — TypeScript infere T pelo argumento passado.",
        code: `// Inferência automática — T = number, não precisa anotar
function first<T>(arr: T[]): T | undefined { return arr[0] }
const n = first([1, 2, 3]) // n: number | undefined

// Constraint: T deve ter a propriedade id
function byId<T extends { id: string }>(items: T[], id: string) {
  return items.find(item => item.id === id)
}

// Generic com múltiplos parâmetros:
function merge<A, B>(a: A, b: B): A & B {
  return { ...a, ...b } as A & B
}`,
      },
      {
        title: "Type narrowing — afunilando unions com segurança",
        body: "TypeScript afina o tipo dentro de branches condicionais. Formas disponíveis: typeof (primitivos), instanceof (classes), in (propriedades de objeto), type predicates (x is Type para narrowing customizado), asserts (lança se condição falsa), discriminated union (campo literal).",
        code: `// typeof — primitivos
function fmt(val: string | number) {
  if (typeof val === 'string') return val.toUpperCase() // string
  return val.toFixed(2)  // number
}

// in — presença de propriedade
function area(shape: Circle | Square) {
  if ('radius' in shape) return Math.PI * shape.radius ** 2
  return shape.side ** 2
}

// Type predicate — narrowing customizado
function isUser(x: unknown): x is User {
  return typeof x === 'object' && x !== null && 'id' in x
}`,
      },
      {
        title: "Utility types na prática — transformando tipos existentes",
        body: "Os utility types built-in são transformações do sistema de tipos. Na prática: Partial para updates, Pick/Omit para DTOs, Record para mapas, ReturnType/Parameters para tipar em função de funções existentes, Awaited para extrair tipos de Promises.",
        code: `type User = { id: string; name: string; email: string; role: 'admin'|'user' }

// CRUD tipado com uma fonte de verdade:
type CreateUser = Omit<User, 'id'>                          // POST — sem id
type UpdateUser = Partial<Pick<User, 'name' | 'email'>>    // PATCH — opcionais
type UserPreview = Pick<User, 'id' | 'name'>               // GET list — campos mínimos

// Tipar em função de funções existentes:
async function getUser(id: string): Promise<User | null> { /* ... */ return null }
type GetUserReturn = Awaited<ReturnType<typeof getUser>>   // User | null`,
      },
      {
        title: "Template literal types — strings no sistema de tipos",
        body: "Manipula strings no nível de tipo. Permite derivar tipos de strings: eventos a partir de nomes de campo, rotas, chaves de CSS. Intrinsic string manipulation types: Uppercase, Lowercase, Capitalize, Uncapitalize. Usado em tRPC, Prisma e bibliotecas que fazem inferência de API.",
        code: `type Field = 'name' | 'email' | 'age'
type Getter = \`get\${Capitalize<Field>}\`
// 'getName' | 'getEmail' | 'getAge'

// EventMap derivado de nomes de campo:
type EventName<T extends string> = \`on\${Capitalize<T>}\`
type ButtonEvents = EventName<'click' | 'focus'>
// 'onClick' | 'onFocus'

// Extração de parâmetros de rota:
type Route = '/users/:id/posts/:postId'
type RouteParams<T extends string> =
  T extends \`\${string}:\${infer P}/\${infer Rest}\`
    ? P | RouteParams<\`/\${Rest}\`>
    : T extends \`\${string}:\${infer P}\` ? P : never
// RouteParams<Route> = 'id' | 'postId'`,
      },
      {
        title: "Conditional types e infer — tipos que dependem de condições",
        body: "Tipos que dependem de condições: T extends U ? X : Y. Com infer, extrai partes do tipo em tempo de compilação. São a base dos utility types built-in como ReturnType, Parameters, Awaited e InstanceType. Distribuição automática sobre unions quando T é genérico.",
        code: `// infer — extraindo partes do tipo
type ReturnType<F> = F extends (...args: any[]) => infer R ? R : never
type Unwrap<T>     = T extends Promise<infer U> ? U : T
type ArrayItem<T>  = T extends Array<infer U> ? U : T

type A = Unwrap<Promise<string>>  // string
type B = Unwrap<number>           // number (não é Promise)

// Distribuição automática sobre unions:
type IsString<T> = T extends string ? true : false
type R = IsString<string | number>  // true | false (distribui)`,
      },
      {
        title: "Mapped types — transformando todos os campos de um tipo",
        body: "Mapped types iteram sobre chaves de um tipo e transformam cada uma. São a implementação de Partial, Required, Readonly e Record. Com 'as' pode remapear chaves. Com + e - modifica modificadores (opcional, readonly).",
        code: `// Readonly manual (o que Readonly<T> faz):
type MyReadonly<T> = { readonly [K in keyof T]: T[K] }

// Remapeamento de chaves com 'as':
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K]
}
// Getters<{ name: string }> = { getName: () => string }

// Remover ? (Required manual):
type MyRequired<T> = { [K in keyof T]-?: T[K] }`,
      },
      {
        title: "Satisfies operator — validar sem perder literais",
        body: "O operador satisfies (TS 4.9) valida que um valor é compatível com um tipo sem alterar o tipo inferido para o declarado. Preserva literais e tipos específicos enquanto garante conformidade com a interface.",
        code: `type Config = { theme: 'dark' | 'light'; size: number }

// Com anotação: tema fica 'dark' | 'light' — perde o literal
const cfg1: Config = { theme: 'dark', size: 16 }
cfg1.theme  // 'dark' | 'light'

// Com satisfies: tema fica 'dark' — mantém o literal
const cfg2 = { theme: 'dark', size: 16 } satisfies Config
cfg2.theme  // 'dark' (literal preservado + validação de Config)`,
      },
      {
        title: "interface vs type — quando usar cada um",
        body: "A diferença prática: interfaces suportam declaration merging (declarar duas vezes o mesmo nome faz merge dos campos — útil para augmentar tipos de libs de terceiros). Types são mais expressivos: suportam union, intersection, conditional, template literal, mapped types. Convenção moderna: type para quase tudo; interface para contratos de objetos públicos que outros precisam estender.",
        code: `// Declaration merging (só interface) — augmentar lib de terceiros:
declare module 'express' {
  interface Request { userId: string } // adiciona campo ao Request do Express
}

// Type é mais expressivo — union, conditional, template literal:
type Shape = Circle | Square | Triangle // union — não dá em interface
type EventName = \`on\${string}\`          // template literal — não dá em interface`,
      },
    ],
    cheatsheet: {
      title: "TypeScript — Utility Types e Recursos Essenciais",
      html: `<style>
.tsc-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.tsc-section{margin-bottom:18px}
.tsc-title{font-size:9px;color:#3178C6;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:10px;padding-bottom:4px;border-bottom:1px solid #1e293b}
.tsc-table{width:100%;border-collapse:collapse;font-size:10.5px}
.tsc-table th{color:#475569;font-weight:500;text-align:left;padding:4px 8px;border-bottom:1px solid #1e293b}
.tsc-table td{padding:5px 8px;border-bottom:1px solid #0f172a;vertical-align:top}
.tsc-table tr:hover td{background:#1e293b}
.tsc-name{color:#93c5fd}
.tsc-code{color:#4ade80;font-size:10px}
.tsc-note{color:#475569;font-size:10px}
</style>
<div class="tsc-wrap">
  <p style="color:#93c5fd;font-size:12px;font-weight:700;margin:0 0 18px">TypeScript — Referência Rápida</p>
  <div class="tsc-section">
    <div class="tsc-title">Utility Types essenciais</div>
    <table class="tsc-table">
      <tr><th>Tipo</th><th>O que faz</th><th>Caso de uso</th></tr>
      <tr><td class="tsc-name">Partial&lt;T&gt;</td><td style="color:#94a3b8">Todos os campos opcionais</td><td class="tsc-note">Parâmetro de update (PATCH)</td></tr>
      <tr><td class="tsc-name">Required&lt;T&gt;</td><td style="color:#94a3b8">Todos obrigatórios</td><td class="tsc-note">Após aplicar Partial</td></tr>
      <tr><td class="tsc-name">Readonly&lt;T&gt;</td><td style="color:#94a3b8">Todos readonly</td><td class="tsc-note">Imutabilidade em runtime</td></tr>
      <tr><td class="tsc-name">Pick&lt;T, K&gt;</td><td style="color:#94a3b8">Seleciona campos</td><td class="tsc-note">DTOs, preview objects</td></tr>
      <tr><td class="tsc-name">Omit&lt;T, K&gt;</td><td style="color:#94a3b8">Remove campos</td><td class="tsc-note">Criar sem id (POST)</td></tr>
      <tr><td class="tsc-name">Record&lt;K, V&gt;</td><td style="color:#94a3b8">Mapa K → V</td><td class="tsc-note">Lookup tables, configs</td></tr>
      <tr><td class="tsc-name">Exclude&lt;T, U&gt;</td><td style="color:#94a3b8">Remove membros da union</td><td class="tsc-note">Filtrar valores de union</td></tr>
      <tr><td class="tsc-name">Extract&lt;T, U&gt;</td><td style="color:#94a3b8">Mantém membros da union</td><td class="tsc-note">Filtrar tipos específicos</td></tr>
      <tr><td class="tsc-name">ReturnType&lt;F&gt;</td><td style="color:#94a3b8">Tipo de retorno da função</td><td class="tsc-note">Tipar sem duplicar</td></tr>
      <tr><td class="tsc-name">Parameters&lt;F&gt;</td><td style="color:#94a3b8">Tuple de parâmetros</td><td class="tsc-note">Wrappers de função</td></tr>
      <tr><td class="tsc-name">Awaited&lt;T&gt;</td><td style="color:#94a3b8">Desembrulha Promise</td><td class="tsc-note">Tipo de resposta async</td></tr>
      <tr><td class="tsc-name">NonNullable&lt;T&gt;</td><td style="color:#94a3b8">Remove null/undefined</td><td class="tsc-note">Após validação</td></tr>
    </table>
  </div>
  <div class="tsc-section">
    <div class="tsc-title">Narrowing — formas disponíveis</div>
    <table class="tsc-table">
      <tr><th>Técnica</th><th>Uso</th></tr>
      <tr><td class="tsc-name">typeof x === 'string'</td><td style="color:#94a3b8">Primitivos: string, number, boolean, symbol, bigint, function, undefined</td></tr>
      <tr><td class="tsc-name">x instanceof Classe</td><td style="color:#94a3b8">Instâncias de classe / construtores</td></tr>
      <tr><td class="tsc-name">'prop' in x</td><td style="color:#94a3b8">Presença de propriedade no objeto</td></tr>
      <tr><td class="tsc-name">x is Type (predicate)</td><td style="color:#94a3b8">Narrowing customizado em função</td></tr>
      <tr><td class="tsc-name">asserts x is Type</td><td style="color:#94a3b8">Lança se condição falsa — testes, validações</td></tr>
      <tr><td class="tsc-name">discriminated union</td><td style="color:#94a3b8">Campo literal que distingue membros (status, type, kind)</td></tr>
    </table>
  </div>
  <div class="tsc-section">
    <div class="tsc-title">Modificadores de tipo</div>
    <table class="tsc-table">
      <tr><th>Sintaxe</th><th>Efeito</th></tr>
      <tr><td class="tsc-code">T | U</td><td style="color:#94a3b8">Union — valor é T ou U</td></tr>
      <tr><td class="tsc-code">T & U</td><td style="color:#94a3b8">Intersection — valor é T e U</td></tr>
      <tr><td class="tsc-code">T extends U ? X : Y</td><td style="color:#94a3b8">Conditional type</td></tr>
      <tr><td class="tsc-code">T extends U ? infer R : never</td><td style="color:#94a3b8">Extrai tipo com infer</td></tr>
      <tr><td class="tsc-code">keyof T</td><td style="color:#94a3b8">Union das chaves de T</td></tr>
      <tr><td class="tsc-code">T[K]</td><td style="color:#94a3b8">Tipo do campo K em T (indexed access)</td></tr>
      <tr><td class="tsc-code">{ [K in keyof T]: T[K] }</td><td style="color:#94a3b8">Mapped type — itera campos</td></tr>
      <tr><td class="tsc-code">val satisfies T</td><td style="color:#94a3b8">Valida sem alterar tipo inferido (TS 4.9)</td></tr>
    </table>
  </div>
  <div class="tsc-section">
    <div class="tsc-title">tsconfig — opções críticas</div>
    <table class="tsc-table">
      <tr><th>Opção</th><th>Por que ativar</th></tr>
      <tr><td class="tsc-name">strict: true</td><td style="color:#94a3b8">Ativa strictNullChecks + noImplicitAny + mais — sempre ative</td></tr>
      <tr><td class="tsc-name">noUncheckedIndexedAccess</td><td style="color:#94a3b8">arr[i] retorna T | undefined — evita runtime errors</td></tr>
      <tr><td class="tsc-name">exactOptionalPropertyTypes</td><td style="color:#94a3b8">Distingue undefined explícito de campo ausente</td></tr>
      <tr><td class="tsc-name">moduleResolution: bundler</td><td style="color:#94a3b8">Para projetos com Vite/Next.js — resolve ESM corretamente</td></tr>
    </table>
  </div>
</div>`,
    },
    gotchas: [
      "Usar 'any' como atalho destrói o valor do TypeScript — o erro que você evitou hoje vai aparecer em produção amanhã. Prefira 'unknown' e faça narrowing.",
      "Asserção de tipo (as Type) ignora o compilador. Use type predicates (x is Type) quando possível — eles realmente verificam o tipo.",
      "Non-null assertion (!) suprime o erro mas não torna o código seguro. Se o valor pode ser null em runtime, o bug persiste silenciosamente.",
      "Enum gera código JavaScript em runtime e tem comportamentos sutis com reverse mapping numérico. Prefira union de string literals: type Direction = 'left' | 'right'.",
      "Desestruturar um tipo literal apaga os literais: const { status } = { status: 'ok' as const } — a const assertion precisa estar no objeto todo ou usar 'as const satisfies'.",
      "strictNullChecks desligado torna null e undefined atribuíveis a qualquer tipo — ative strict: true em projetos novos, sempre.",
      "Object.keys(obj) retorna string[], não (keyof typeof obj)[] — TypeScript não estreita porque em runtime podem existir mais chaves. Use (Object.keys(obj) as (keyof typeof obj)[]) explicitamente.",
      "Spread de tipo intersection ({ ...a, ...b } as A & B) não verifica conflito de tipos — se A e B têm campo com tipos incompatíveis, você tem um bug silencioso.",
    ],
    interview: [
      {
        q: "Qual a diferença entre 'unknown' e 'any'?",
        a: "<p><strong>any</strong>: desativa a verificação de tipos. Você pode fazer qualquer operação sem erro. Essencialmente sai do TypeScript — qualquer coisa é válida.</p><p><strong>unknown</strong>: o tipo pode ser qualquer coisa, mas você não pode usar sem primeiro narrowar. É o tipo seguro para valores de origem desconhecida: JSON.parse, catch clause, respostas de API externas.</p><p>Regra prática: use unknown quando receber dados externos e force o chamador a ser responsável pelo narrowing antes de usar. any abdica dessa responsabilidade.</p>",
        tip: "Diga 'unknown força o chamador a verificar antes de usar, any desabilita toda verificação'. Mostrar que você sabe a diferença prática com um exemplo real (catch clause) vale muito em entrevista.",
        level: "pleno",
      },
      {
        q: "Como você tiparia uma função que retorna tipos diferentes baseado no input?",
        a: "<p>Dois caminhos: function overloads ou conditional types.</p><p><strong>Function overloads</strong>: declare assinaturas múltiplas antes da implementação. A implementação usa any/unknown mas não é visível externamente — chamadores veem apenas as assinaturas tipadas.</p><pre><code>function process(x: string): string\nfunction process(x: number): number\nfunction process(x: string | number): string | number {\n  return typeof x === 'string' ? x.toUpperCase() : x * 2\n}</code></pre><p><strong>Conditional types</strong>: mais composíveis, mas mais complexos. Use quando o tipo de retorno depende de um parâmetro genérico.</p>",
        tip: "Mencione que overloads têm uma implementação única que não é visível externamente — a maioria dos devs não sabe disso e é um diferencial claro.",
        level: "senior",
      },
      {
        q: "O que é o operador 'satisfies' (TS 4.9) e quando usá-lo?",
        a: "<p>satisfies valida que um valor é compatível com um tipo <em>sem alterar o tipo inferido</em>. Com anotação de tipo (:Type), o tipo do valor é ampliado para o declarado — você perde precisão. Com satisfies, o tipo inferido é preservado e a validação acontece.</p><pre><code>// Com anotação: theme fica 'dark' | 'light'\nconst cfg: Config = { theme: 'dark', size: 16 }\ncfg.theme // 'dark' | 'light'\n\n// Com satisfies: theme fica 'dark' (literal preservado)\nconst cfg = { theme: 'dark', size: 16 } satisfies Config\ncfg.theme // 'dark'</code></pre><p>Muito útil em objetos de configuração e mapas onde você quer tanto validação quanto autocomplete preciso.</p>",
        tip: "Boa pergunta para diferenciar quem acompanha changelogs de quem não acompanha. Mostre o exemplo concreto com/sem satisfies e explique o tradeoff.",
        level: "senior",
      },
      {
        q: "Como funciona type narrowing? Cite todas as formas disponíveis.",
        a: "<p>Narrowing é o processo do compilador de afinar o tipo dentro de um branch condicional baseado em verificações de tipo.</p><ul><li><strong>typeof</strong>: primitivos — 'string', 'number', 'boolean', 'symbol', 'bigint', 'function', 'undefined'</li><li><strong>instanceof</strong>: instâncias de classe/construtores</li><li><strong>in</strong>: presença de propriedade no objeto</li><li><strong>type predicates</strong>: função retornando <code>x is Type</code> — narrowing customizado totalmente controlado</li><li><strong>asserts</strong>: <code>asserts x is Type</code> — lança se condição falsa, útil em testes e validações de entrada</li><li><strong>discriminated union</strong>: campo literal (status, kind, type) que distingue membros — mais poderoso e mais seguro</li><li><strong>truthiness narrowing</strong>: <code>if (x)</code> remove null/undefined/0/'' do tipo</li></ul>",
        tip: "Discriminated union é o mais cobrado em entrevista sênior — mostre o exemplo com status: 'ok' | 'error' e explique por que é o padrão preferido para estados exclusivos.",
        level: "pleno",
      },
      {
        q: "Quais utility types você usa no dia a dia e quando?",
        a: "<p><strong>Partial&lt;T&gt;</strong>: parâmetros de update onde nem todo campo é obrigatório (PATCH). <strong>Required&lt;T&gt;</strong>: forçar completude após aplicar Partial. <strong>Pick/Omit</strong>: criar DTOs e subconjuntos de tipo sem duplicar. <strong>Record&lt;K,V&gt;</strong>: lookup tables e configs tipadas. <strong>ReturnType/Parameters</strong>: tipar em função do que uma função retorna/recebe — sem duplicar o tipo. <strong>Awaited&lt;T&gt;</strong>: extrair o tipo de dentro de uma Promise. <strong>NonNullable&lt;T&gt;</strong>: após validação, remover null/undefined.</p><p>Caso real: type CreateUser = Omit&lt;User, 'id' | 'createdAt'&gt;, type UpdateUser = Partial&lt;Pick&lt;User, 'name' | 'email'&gt;&gt; — uma fonte de verdade (User) gera todos os tipos derivados.</p>",
        tip: "Mencione casos de uso reais (DTO de update com Partial+Pick, config com Record, inferência de retorno com ReturnType) — mostra que você usa no dia a dia, não só sabe que existe.",
        level: "pleno",
      },
      {
        q: "O que são conditional types e como você os usa na prática com infer?",
        a: "<p>Conditional types: <code>T extends U ? X : Y</code>. O poder real vem com <code>infer</code>, que extrai partes do tipo em compile-time.</p><pre><code>// Extrair tipo de retorno (o que ReturnType faz):\ntype ReturnType&lt;F&gt; = F extends (...args: any[]) => infer R ? R : never\n\n// Desembrulhar Promise (o que Awaited faz):\ntype Unwrap&lt;T&gt; = T extends Promise&lt;infer U&gt; ? U : T\n\n// Extrair primeiro item de tuple:\ntype Head&lt;T extends any[]&gt; = T extends [infer H, ...any[]] ? H : never</code></pre><p>Casos reais: DeepReadonly, extração de tipos de respostas de API, tipos condicionais baseados em flags de configuração.</p>",
        tip: "A maioria sabe que conditional types existem mas não sabe usar infer. Mostrar um exemplo com infer é o diferencial claro de sênior nessa pergunta.",
        level: "senior",
      },
      {
        q: "Quando usar 'interface' vs 'type alias'?",
        a: "<p>A diferença principal prática: interfaces suportam <strong>declaration merging</strong> — declarar o mesmo nome duas vezes faz merge dos campos. Isso é essencial para augmentar tipos de bibliotecas de terceiros (adicionar campo ao Request do Express, ao Window, ao processo).</p><p>Types são mais expressivos: suportam union, intersection, conditional types, template literal types, mapped types. Interfaces são mais simples e têm mensagens de erro mais legíveis.</p><p>Convenção atual (recomendada pelo time TypeScript): use <code>type</code> para a maioria dos casos. Reserve <code>interface</code> para objetos que precisam de declaration merging ou que você quer que outros estendam via extends.</p>",
        tip: "Declaration merging é o ponto que mais pega em entrevista — dê o exemplo concreto de augmentar o Express Request. Isso mostra que você já precisou disso de verdade.",
        level: "pleno",
      },
      {
        q: "O que são mapped types e como você os usa para criar utility types customizados?",
        a: "<p>Mapped types iteram sobre as chaves de um tipo e transformam cada uma: <code>{ [K in keyof T]: T[K] }</code>. São a base de Partial, Required, Readonly e Record.</p><p>Com 'as' você remapeia chaves. Com + e - modifica modificadores (? para opcional, readonly).</p><pre><code>// Criar getters a partir de campos:\ntype Getters&lt;T&gt; = {\n  [K in keyof T as `get${Capitalize&lt;string & K&gt;}`]: () => T[K]\n}\n// Getters&lt;{ name: string }&gt; = { getName: () => string }\n\n// DeepReadonly:\ntype DeepReadonly&lt;T&gt; = {\n  readonly [K in keyof T]: T[K] extends object ? DeepReadonly&lt;T[K]&gt; : T[K]\n}</code></pre>",
        tip: "Mostrar DeepReadonly ou Getters com remapeamento de chave é o que diferencia quem realmente entende mapped types de quem só sabe usar os utility types prontos.",
        level: "senior",
      },
      {
        q: "Como você configuraria o tsconfig para um projeto Next.js moderno?",
        a: "<p>Configuração essencial: <strong>strict: true</strong> (ativa todos os checks críticos), <strong>target: ES2017+</strong> (compatibilidade com navegadores modernos), <strong>moduleResolution: bundler</strong> (para Vite/Next.js — resolve ESM corretamente), <strong>paths</strong> (aliases de importação, ex: @/* para src/*). Opcionais mas recomendados: <strong>noUncheckedIndexedAccess: true</strong> (arr[i] retorna T | undefined — evita runtime errors), <strong>exactOptionalPropertyTypes: true</strong> (distingue undefined explícito de campo ausente).</p><p>Evite: <strong>skipLibCheck: true</strong> silenciosamente ignora erros em node_modules — só use se tiver conflitos irresolvíveis. <strong>esModuleInterop</strong> é necessário para importar libs CommonJS como default imports.</p>",
        level: "senior",
      },
      {
        q: "Como funcionam discriminated unions e como fazer exhaustive check com never?",
        a: "<p>Discriminated unions usam um campo literal (discriminant) para distinguir membros de uma union. TypeScript afina o tipo em cada branch do switch/if baseado nesse campo.</p><pre><code>type Result&lt;T&gt; =\n  | { status: 'ok'; data: T }\n  | { status: 'error'; message: string; code: number }\n  | { status: 'loading' }\n\nfunction handle&lt;T&gt;(r: Result&lt;T&gt;): string {\n  switch (r.status) {\n    case 'ok':      return String(r.data)\n    case 'error':   return r.message\n    case 'loading': return 'Carregando...'\n    default:\n      // never aqui — se adicionar novo membro sem tratar, erro de compilação\n      const _exhaustive: never = r\n      throw new Error(_exhaustive)\n  }\n}</code></pre><p>A variável <code>_exhaustive: never</code> é o exhaustive check: se o switch não cobre todos os casos, o tipo de <code>r</code> no default não será <code>never</code> — TypeScript reclama. Isso garante que você nunca esqueça de tratar um novo estado adicionado à union.</p>",
        tip: "Mostrar o pattern de <code>const _exhaustive: never = r</code> é o diferencial que separa quem usa TypeScript de forma mecânica de quem domina o sistema de tipos.",
        level: "senior",
      },
      {
        q: "Como funciona o operador infer em conditional types? Dê um exemplo real.",
        a: "<p><code>infer</code> declara uma variável de tipo dentro de uma condição de conditional type — o TypeScript extrai e captura o tipo que casou com aquela posição. É o mecanismo por trás de <code>ReturnType</code>, <code>Awaited</code> e <code>Parameters</code>.</p><pre><code>// Como ReturnType é implementado internamente:\ntype MyReturnType&lt;F&gt; = F extends (...args: any[]) =&gt; infer R ? R : never\n\n// Desembrulhar Promise:\ntype Unwrap&lt;T&gt; = T extends Promise&lt;infer U&gt; ? Unwrap&lt;U&gt; : T\n// Unwrap&lt;Promise&lt;Promise&lt;string&gt;&gt;&gt; = string\n\n// Extrair tipo do primeiro argumento:\ntype FirstArg&lt;F&gt; = F extends (first: infer A, ...rest: any[]) =&gt; any ? A : never\n\n// Extrair tipo de item de array:\ntype ItemOf&lt;A&gt; = A extends Array&lt;infer I&gt; ? I : never\n// ItemOf&lt;string[]&gt; = string</code></pre><p>O ponto chave: <code>infer</code> só pode aparecer na posição covariante de um conditional type (lado direito do <code>extends</code>). Posições diferentes capturam lados diferentes (input vs output).</p>",
        tip: "Mostre pelo menos dois exemplos de infer em contextos diferentes (função e Promise). Quem só sabe que exists mas não sabe usar fica explícito na entrevista.",
        level: "senior",
      },
      {
        q: "O que são template literal types e quais são seus casos de uso reais?",
        a: "<p>Template literal types constroem tipos de string compondo literais e outras string types, como template literals em JS mas em tempo de compilação.</p><pre><code>type EventName = 'click' | 'focus' | 'blur'\ntype HandlerName = `on${Capitalize&lt;EventName&gt;}`\n// = 'onClick' | 'onFocus' | 'onBlur'\n\n// Tipagem de caminhos de objeto (dot notation):\ntype Paths&lt;T, Prefix extends string = ''&gt; = {\n  [K in keyof T]: T[K] extends object\n    ? Paths&lt;T[K], `${Prefix}${K &amp; string}.`&gt;\n    : `${Prefix}${K &amp; string}`\n}[keyof T]\n\n// Inferência de parâmetros de rota:\ntype ExtractParams&lt;S extends string&gt; =\n  S extends `${string}:${infer P}/${infer Rest}`\n    ? P | ExtractParams&lt;Rest&gt;\n    : S extends `${string}:${infer P}`\n      ? P : never\n// ExtractParams&lt;'/user/:id/post/:slug'&gt; = 'id' | 'slug'</code></pre><p>Casos reais: tipagem de eventos com prefixo (on, emit, handle), tipo-safe router params, geração de getter/setter a partir de campos, CSS-in-JS com classes tipadas.</p>",
        tip: "A combinação template literal + infer para extrair parâmetros de rota é o exemplo que mais impressiona — mostra criatividade no sistema de tipos.",
        level: "senior",
      },
      {
        q: "Qual a diferença entre o operador satisfies, anotação de tipo (:) e as?",
        a: "<p>Três formas de relacionar valor e tipo, com garantias muito diferentes:</p><ul><li><strong>Anotação <code>: Type</code></strong>: o tipo inferido do valor é ampliado para o tipo declarado. Você perde a precisão dos literais. <code>const cfg: Config = { mode: 'dark' }</code> → <code>cfg.mode</code> é <code>string</code>, não <code>'dark'</code>.</li><li><strong><code>satisfies</code></strong>: valida que o valor satisfaz o tipo, mas preserva o tipo inferido. <code>const cfg = { mode: 'dark' } satisfies Config</code> → <code>cfg.mode</code> ainda é <code>'dark'</code>. Melhor dos dois mundos: validação + precisão.</li><li><strong><code>as Type</code></strong>: type assertion — você diz ao compilador qual é o tipo, sem verificação real. Perigoso: <code>const x = {} as Config</code> não causa erro mesmo com campos faltando. Use apenas quando você tem certeza que o compilador está errado (e.g., narrowing que ele não consegue inferir).</li></ul><p>Regra: prefira anotação para contratos de API/exportações, <code>satisfies</code> para objetos de configuração onde você quer autocomplete preciso, <code>as</code> apenas como último recurso.</p>",
        tip: "A pergunta quase sempre aparece em contexto de 'quando usar satisfies vs :'. Mostrar o exemplo concreto do tipo preservado vs ampliado ganha pontos.",
        level: "senior",
      },
      {
        q: "O que é variância em generics? Como TypeScript lida com covariância e contravariância?",
        a: "<p>Variância descreve como a compatibilidade de tipos compostos se relaciona com a compatibilidade dos tipos que eles contêm.</p><ul><li><strong>Covariante</strong>: <code>Array&lt;Cat&gt;</code> é subtipo de <code>Array&lt;Animal&gt;</code> se <code>Cat</code> for subtipo de <code>Animal</code>. Posições de saída (retorno de função) são covariantes.</li><li><strong>Contravariante</strong>: <code>(x: Animal) =&gt; void</code> é subtipo de <code>(x: Cat) =&gt; void</code> — a direção se inverte. Posições de entrada (parâmetros) são contravariantes.</li><li><strong>Invariante</strong>: nenhuma das duas. Mutable containers geralmente são invariantes — se <code>Array</code> fosse covariante em saída e contravariante em entrada, inserir um <code>Animal</code> em <code>Array&lt;Cat&gt;</code> causaria runtime error.</li></ul><pre><code>// TypeScript usa strictFunctionTypes para contravariance em callbacks:\ntype Handler&lt;T&gt; = (event: T) =&gt; void\nconst animalHandler: Handler&lt;Animal&gt; = (a) =&gt; a.breathe()\nconst catHandler: Handler&lt;Cat&gt; = animalHandler // ✓ (contravariante)\n// const animalHandler: Handler&lt;Animal&gt; = catHandler // ✗</code></pre><p>TypeScript verifica isso com <code>strictFunctionTypes</code> (ativo em strict). Entender variância explica erros sutis ao compor callbacks e generics em libs complexas.</p>",
        tip: "Poucas pessoas sabem variância em TS. Mencionar 'strictFunctionTypes' e dar o exemplo de callbacks inversamente compatíveis é diferencial sênior claro.",
        level: "senior",
      },
      {
        q: "O que é declaration merging e quando é útil (e quando é armadilha)?",
        a: "<p>Declaration merging: quando TypeScript vê duas declarações com o mesmo nome no mesmo escopo, ele as mescla em uma única definição. Funciona com interfaces, namespaces e em combinações específicas (interface + class, namespace + function, namespace + enum).</p><p><strong>Casos úteis:</strong></p><ul><li><strong>Augmentar tipos de biblioteca</strong>: adicionar campos ao <code>Request</code> do Express sem fork da tipagem. <pre><code>// types/express.d.ts\ndeclare namespace Express {\n  interface Request { user?: AuthUser }\n}</code></pre></li><li><strong>Augmentar módulos de terceiros</strong>: adicionar propriedade ao <code>Window</code>, ao <code>process.env</code>.</li><li><strong>Estender interfaces de UI libs</strong>: adicionar variantes a tokens de design system.</li></ul><p><strong>Armadilhas:</strong></p><ul><li>Merge acidental de interfaces em módulos diferentes (nome coincide)</li><li>Ordenação de declarações pode importar em casos de circularidade</li><li>Com <code>type</code> alias, não existe merge — erro de compilação se redeclarar</li></ul>",
        tip: "O caso de augmentar Express Request é o mais pedido em entrevista. Se você trabalhou com Node.js/Express e não sabe isso, parece que nunca adicionou dados ao request no middleware.",
        level: "pleno",
      },
      {
        q: "Qual a diferença entre const assertions e as const? Quando usar cada?",
        a: "<p>São a mesma feature — <code>as const</code> é a sintaxe de type assertion para const assertion. Eles fazem três coisas:</p><ol><li>Literais são preservados como tipos literais (não alargados para string/number/boolean)</li><li>Arrays viram readonly tuples</li><li>Propriedades de objetos ficam readonly e com tipos literais precisos</li></ol><pre><code>const colors = ['red', 'green', 'blue'] as const\n// type: readonly ['red', 'green', 'blue']\n// Sem as const: string[]\n\nconst config = { env: 'production', port: 3000 } as const\n// type: { readonly env: 'production'; readonly port: 3000 }\n// Sem as const: { env: string; port: number }\n\n// Uso clássico: enum-like sem enum\nconst ROLES = ['admin', 'user', 'guest'] as const\ntype Role = typeof ROLES[number] // 'admin' | 'user' | 'guest'</code></pre><p>Use quando quer preservar literais para criar union types, para routing config tipado, para objetos de constantes que funcionam como enums.</p>",
        tip: "O pattern <code>typeof ARRAY[number]</code> para gerar union type a partir de array com <code>as const</code> é um dos truques mais úteis e frequentemente pedidos.",
        level: "pleno",
      },
      {
        q: "Qual a diferença entre type guards customizados (is) e assertion functions (asserts)?",
        a: "<p>Ambos ensinam o TypeScript a fazer narrowing, mas com comportamentos diferentes após a chamada:</p><p><strong>Type guard (<code>x is Type</code>)</strong>: retorna boolean. Se <code>true</code>, o TypeScript afina o tipo no branch <code>if</code>. O código após o <code>if</code> ainda considera o tipo original.</p><pre><code>function isUser(x: unknown): x is User {\n  return typeof x === 'object' && x !== null && 'id' in x\n}\n\nif (isUser(data)) {\n  console.log(data.id) // TypeScript sabe que é User aqui\n}</code></pre><p><strong>Assertion function (<code>asserts x is Type</code>)</strong>: lança se a condição falha, nunca retorna nada útil. <em>Após</em> a chamada (se não lançou), o TypeScript afina o tipo permanentemente no escopo restante — sem precisar de <code>if</code>.</p><pre><code>function assertUser(x: unknown): asserts x is User {\n  if (!isUser(x)) throw new Error('Não é um User')\n}\n\nassertUser(data)\nconsole.log(data.id) // TypeScript sabe que é User a partir daqui</code></pre><p>Use type guard quando o código precisa dos dois branches (é User / não é User). Use assertion quando o fluxo deve abortar se o tipo não bater — validação de entrada, asserções em testes.</p>",
        tip: "Assertion functions são pouco conhecidas. Mostrar a diferença comportamental (após a chamada vs dentro do if) é o diferencial.",
        level: "senior",
      },
      {
        q: "O que acontece quando TypeScript compila para runtime? O que some e o que permanece?",
        a: "<p>TypeScript é apagado completamente pelo compilador — todo o sistema de tipos não existe em runtime. Especificamente:</p><p><strong>O que some (type erasure):</strong></p><ul><li>Anotações de tipo: <code>: string</code>, <code>: User</code>, <code>: Array&lt;T&gt;</code> — todas apagadas</li><li>Declarações de interface e type alias — não existem em runtime</li><li>Generics — apagados (TS não faz reificação como Java)</li><li>Modificadores de acesso em classes (private, protected) — só compile-time</li><li>Declarações de namespace (se não emitem JS)</li></ul><p><strong>O que permanece (emite JS):</strong></p><ul><li>Classes — emitem como funções construtoras ou classes ES6</li><li>Enums — emitem como objetos JS (exceto <code>const enum</code> que é inlinado)</li><li>Decorators — emitem como chamadas de função (precisam de <code>experimentalDecorators</code>)</li><li>Namespaces com código — emitem como IIFEs</li></ul><p>Implicação prática: você não pode fazer <code>typeof x === 'MyInterface'</code> em runtime — interfaces não existem. Use type guards com verificações de propriedades ou <code>instanceof</code> com classes reais.</p>",
        tip: "A pergunta sobre 'o que some' é clássica para verificar se o dev entende a natureza de TypeScript como layer de compilação, não uma linguagem de runtime.",
        level: "pleno",
      },
      {
        q: "Qual a diferença real entre interface e type alias nos casos onde divergem?",
        a: "<p>Na prática, são equivalentes para a maioria dos objetos. As diferenças reais são:</p><p><strong>Onde divergem:</strong></p><ul><li><strong>Declaration merging</strong>: apenas <code>interface</code> suporta. Declarar dois <code>type</code> com o mesmo nome é erro. Declarar duas <code>interface</code> com o mesmo nome as mescla — essencial para augmentar tipos de bibliotecas.</li><li><strong>Expressividade</strong>: <code>type</code> suporta union (<code>A | B</code>), intersection (<code>A &amp; B</code>), conditional types, mapped types, template literal types — <code>interface</code> não suporta esses recursos diretamente.</li><li><strong>Extends vs intersection</strong>: <code>interface C extends A, B</code> faz merge ordenado e detecta conflitos em tempo de compilação. <code>type C = A &amp; B</code> faz intersection silenciosa — campos conflitantes viram <code>never</code>.</li><li><strong>Mensagens de erro</strong>: interfaces geralmente produzem mensagens mais legíveis porque o TypeScript as exibe pelo nome, não expandidas.</li><li><strong>Performance</strong>: interfaces são ligeiramente mais rápidas de checar em codebases muito grandes (o compilador cacheia verificações de interfaces).</li></ul><p>Convenção atual: use <code>type</code> por padrão para expressividade. Use <code>interface</code> quando você quer declaration merging ou quando escreve uma biblioteca que outros vão estender com <code>extends</code>.</p>",
        tip: "O ponto de conflito em intersection (<code>A &amp; B</code> com campos conflitantes virando <code>never</code>) versus <code>extends</code> que detecta conflito explicitamente é o diferencial mais valioso dessa resposta.",
        level: "pleno",
      },
      {
        q: "Como você tiparia funções genéricas com constraints e quando isso é necessário?",
        a: "<p>Generics com <code>extends</code> adicionam restrições ao que pode ser passado como tipo, preservando a inferência sem aceitar qualquer coisa.</p><pre><code>// Sem constraint — T pode ser qualquer coisa, inclusive number\nfunction first&lt;T&gt;(arr: T[]): T | undefined {\n  return arr[0]\n}\n\n// Com constraint — T deve ter ao menos { id: string }\nfunction findById&lt;T extends { id: string }&gt;(items: T[], id: string): T | undefined {\n  return items.find(item =&gt; item.id === id)\n}\n// findById([{ id: '1', name: 'Ana' }], '1') — T inferido como { id: string; name: string }\n\n// Constraint com keyof — K deve ser chave de T\nfunction pick&lt;T, K extends keyof T&gt;(obj: T, keys: K[]): Pick&lt;T, K&gt; {\n  return Object.fromEntries(keys.map(k =&gt; [k, obj[k]])) as Pick&lt;T, K&gt;\n}\n\n// Constraint múltipla\nfunction merge&lt;A extends object, B extends object&gt;(a: A, b: B): A &amp; B {\n  return { ...a, ...b }\n}</code></pre><p>Quando usar: sempre que o tipo genérico precisa ter garantias estruturais mínimas para o código interno funcionar corretamente. Sem constraint, o TypeScript não sabe que <code>T</code> tem <code>.id</code> — dá erro de acesso. Com constraint, você preserva a inferência do tipo exato enquanto garante o contrato mínimo.</p>",
        tip: "O padrão <code>K extends keyof T</code> é o mais pedido em entrevista de TypeScript avançado — aparece em utils como pick, omit, get path. Mostrar um exemplo real demonstra domínio de generics.",
        level: "senior",
      },
    ],
    mnemonics: [
      {
        trick: "UNCLE",
        label: "Quando NÃO anotar tipo explicitamente",
        explanation: "U = União inferida automaticamente. N = Nenhuma anotação quando TS já sabe (variáveis inicializadas, retornos simples). C = Const assertions para literais. L = Literais preservados com satisfies. E = Evite any — prefira unknown. Regra: só anote quando TS não consegue inferir sozinho ou quando a anotação serve como documentação de contrato.",
      },
      {
        trick: "SPNaIF",
        label: "Formas de narrowing em ordem de uso",
        explanation: "S = typeof (strings/numbers/booleans). P = Predicate (x is Type). N = 'in' (propriedade no objeto). a = asserts (testa + lança). I = instanceof (classes). F = Field literal (discriminated union). Lembre como 'Super Predicate Narrows and Illuminates Features'.",
      },
      {
        trick: "PRORE-RAP",
        label: "Utility types essenciais em ordem CRUD",
        explanation: "P = Partial (update / PATCH). R = Required (forçar completude). O = Omit (criar sem campos gerados). R = Readonly (imutabilidade). E = Extract / Exclude (filtrar unions). R = ReturnType (tipar retorno de função). A = Awaited (desembrulhar Promise). P = Parameters (tipar argumentos). Leia como 'PRO-RE-RAP' e lembre: cada letra é um utility type.",
      },
    ],
    exercises: [
      {
        level: "iniciante",
        title: "Tipar um CRUD de usuários com utility types",
        description: "Crie o tipo User com campos id, name, email, role e createdAt. A partir de User, derive CreateUser (sem id e createdAt), UpdateUser (só name e email, todos opcionais) e UserPreview (só id e name). Use apenas Omit, Pick e Partial — sem duplicar campos.",
        concepts: ["Omit", "Pick", "Partial", "utility types"],
        hint: "Uma fonte de verdade (User) deve gerar todos os outros tipos sem repetir definições.",
      },
      {
        level: "intermediario",
        title: "Implementar DeepReadonly e DeepPartial com mapped types",
        description: "Implemente DeepReadonly<T> que torna todos os campos e subobjectos readonly recursivamente. Em seguida, implemente DeepPartial<T> que torna todos os campos e subcampos opcionais. Teste com um objeto aninhado: { user: { name: string; address: { city: string } } }.",
        concepts: ["mapped types", "conditional types", "recursão de tipos", "keyof"],
        hint: "Use T[K] extends object ? ... : T[K] para decidir quando recursão é necessária. Tenha cuidado com arrays e datas.",
      },
      {
        level: "senior",
        title: "Type-safe event emitter com template literal types",
        description: "Implemente um EventEmitter genérico onde: (1) os eventos são definidos como um mapa (EventMap), (2) on() aceita apenas chaves válidas do mapa, (3) o callback recebe o payload do tipo correto para aquele evento. Use conditional types e keyof para fazer tudo type-safe sem precisar de cast.",
        concepts: ["generics", "keyof", "indexed access", "conditional types", "template literal types"],
        hint: "O tipo do segundo argumento de on() deve ser inferido do EventMap usando EventMap[K]. Considere usar overloads ou distribuição de generics.",
      },
    ],
    videos: [
      { title: "TypeScript Course for Beginners", channel: "Academind", url: "", topic: "Fundamentos de TypeScript do zero" },
      { title: "No More Wasted Time on TypeScript", channel: "Matt Pocock", url: "", topic: "Recursos avançados — generics, conditional types, utility types" },
      { title: "TypeScript — The Full Course", channel: "Fireship", url: "", topic: "Visão geral rápida e densa de todo o sistema de tipos" },
      { title: "Advanced TypeScript Patterns", channel: "Jack Herrington", url: "", topic: "Padrões reais em codebases React com TypeScript avançado" },
      { title: "TypeScript Satisfies Operator", channel: "Matt Pocock", url: "", topic: "Operador satisfies em profundidade" },
    ],
    codeExamples: [
      {
        title: "Discriminated union para modelar estados de API",
        description: "Padrão mais seguro para modelar respostas de API com TypeScript — garante exaustividade em switch.",
        language: "typescript",
        code: `type ApiResult<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error';   message: string; code: number }

function renderResult<T>(result: ApiResult<T>): string {
  switch (result.status) {
    case 'idle':    return 'Aguardando...'
    case 'loading': return 'Carregando...'
    case 'success': return \`Dados: \${JSON.stringify(result.data)}\`
    case 'error':   return \`Erro \${result.code}: \${result.message}\`
    // TypeScript avisa se você esquecer um case
  }
}

// Exhaustiveness check com never:
function assertNever(x: never): never {
  throw new Error(\`Caso não tratado: \${JSON.stringify(x)}\`)
}`,
      },
      {
        title: "Builder pattern com generics e fluent API type-safe",
        description: "Como encadear métodos mantendo type safety — padrão útil para query builders, construtores de configuração e pipelines.",
        language: "typescript",
        code: `class QueryBuilder<T extends object> {
  private filters: Partial<T> = {}
  private _limit = 100

  where<K extends keyof T>(key: K, value: T[K]): this {
    this.filters[key] = value
    return this
  }

  limit(n: number): this {
    this._limit = n
    return this
  }

  build(): { filters: Partial<T>; limit: number } {
    return { filters: this.filters, limit: this._limit }
  }
}

interface User { id: string; name: string; role: 'admin' | 'user' }

const query = new QueryBuilder<User>()
  .where('role', 'admin')   // OK — 'admin' é válido para role
  .where('name', 'Ana')     // OK — string para name
  // .where('name', 123)    // ERRO — number não é string
  .limit(10)
  .build()`,
      },
      {
        title: "Utility types customizados — DeepPartial e PickByValue",
        description: "Exemplos de utility types avançados que você pode precisar criar quando os built-ins não são suficientes.",
        language: "typescript",
        code: `// DeepPartial — torna todos os campos recursivamente opcionais
type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T

// PickByValue — seleciona campos pelo tipo do valor
type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K]
}

// Exemplo:
interface Config {
  host: string
  port: number
  debug: boolean
  timeout: number
}

type StringFields  = PickByValue<Config, string>   // { host: string }
type NumberFields  = PickByValue<Config, number>   // { port: number; timeout: number }

// Paths aninhados para formulários (padrão React Hook Form):
type Paths<T, Prefix extends string = ''> = {
  [K in keyof T]: T[K] extends object
    ? Paths<T[K], \`\${Prefix}\${string & K}.\`>
    : \`\${Prefix}\${string & K}\`
}[keyof T]

type UserPaths = Paths<{ name: string; address: { city: string } }>
// 'name' | 'address.city'`,
      },
    ],
    resources: [
      { title: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html", kind: "docs" },
      { title: "Total TypeScript (Matt Pocock)", url: "https://www.totaltypescript.com/", kind: "curso" },
      { title: "TypeScript Playground", url: "https://www.typescriptlang.org/play", kind: "pratica" },
      { title: "Type Challenges", url: "https://github.com/type-challenges/type-challenges", kind: "pratica" },
      { title: "TypeScript Deep Dive (Basarat)", url: "https://basarat.gitbook.io/typescript/", kind: "livro" },
      { title: "TypeScript Release Notes", url: "https://www.typescriptlang.org/docs/handbook/release-notes/overview.html", kind: "docs" },
      { title: "DefinitelyTyped", url: "https://github.com/DefinitelyTyped/DefinitelyTyped", kind: "pratica" },
    ],
    mindmap: {
      title: "TypeScript — Mapa mental do sistema de tipos",
      html: `<style>
.tsm-wrap{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:24px;color:#e2e8f0}
.tsm-center{background:#1e3a5c;border:2px solid #3178C6;border-radius:10px;padding:10px 18px;text-align:center;font-weight:700;font-size:13px;color:#93c5fd;display:inline-block}
.tsm-branch{display:flex;flex-direction:column;gap:6px}
.tsm-node{background:#1e293b;border:1.5px solid #334155;border-radius:7px;padding:6px 12px;font-size:11px;color:#94a3b8;cursor:default}
.tsm-node:hover{border-color:#3178C6;color:#93c5fd}
.tsm-label{font-size:9px;color:#3178C6;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:6px}
.tsm-grid{display:grid;grid-template-columns:1fr auto 1fr;gap:16px;align-items:start}
.tsm-col{display:flex;flex-direction:column;gap:12px}
.tsm-center-col{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px}
</style>
<div class="tsm-wrap">
  <p style="color:#93c5fd;font-size:12px;font-weight:700;margin:0 0 20px">TypeScript — Mapa de Conceitos</p>
  <div class="tsm-grid">
    <div class="tsm-col">
      <div>
        <div class="tsm-label">Hierarquia de tipos</div>
        <div class="tsm-branch">
          <div class="tsm-node">unknown — supertipo seguro</div>
          <div class="tsm-node">any — opt-out do sistema</div>
          <div class="tsm-node">Primitivos: string, number, boolean</div>
          <div class="tsm-node">Literais: 'ok', 42, true</div>
          <div class="tsm-node">never — conjunto vazio</div>
        </div>
      </div>
      <div>
        <div class="tsm-label">Narrowing</div>
        <div class="tsm-branch">
          <div class="tsm-node">typeof → primitivos</div>
          <div class="tsm-node">instanceof → classes</div>
          <div class="tsm-node">'prop' in x → objetos</div>
          <div class="tsm-node">x is Type → predicates</div>
          <div class="tsm-node">Discriminated union</div>
        </div>
      </div>
      <div>
        <div class="tsm-label">Interface vs type</div>
        <div class="tsm-branch">
          <div class="tsm-node">interface: declaration merging</div>
          <div class="tsm-node">type: union, intersection, conditional</div>
          <div class="tsm-node">Prefira type na maioria dos casos</div>
        </div>
      </div>
    </div>
    <div class="tsm-center-col">
      <div class="tsm-center">TypeScript<br><span style="font-size:10px;opacity:.7">Sistema de tipos</span></div>
      <div style="height:2px;width:2px;background:#3178C6;border-radius:50%"></div>
    </div>
    <div class="tsm-col">
      <div>
        <div class="tsm-label">Utility types</div>
        <div class="tsm-branch">
          <div class="tsm-node">Partial / Required / Readonly</div>
          <div class="tsm-node">Pick / Omit / Record</div>
          <div class="tsm-node">Extract / Exclude / NonNullable</div>
          <div class="tsm-node">ReturnType / Parameters / Awaited</div>
        </div>
      </div>
      <div>
        <div class="tsm-label">Tipos avançados</div>
        <div class="tsm-branch">
          <div class="tsm-node">Generics com constraints</div>
          <div class="tsm-node">Conditional types + infer</div>
          <div class="tsm-node">Mapped types + keyof</div>
          <div class="tsm-node">Template literal types</div>
          <div class="tsm-node">satisfies operator</div>
        </div>
      </div>
      <div>
        <div class="tsm-label">tsconfig essencial</div>
        <div class="tsm-branch">
          <div class="tsm-node">strict: true — sempre ative</div>
          <div class="tsm-node">moduleResolution: bundler</div>
          <div class="tsm-node">noUncheckedIndexedAccess</div>
          <div class="tsm-node">paths — aliases de importação</div>
        </div>
      </div>
    </div>
  </div>
</div>`,
      caption: "Visão geral do sistema de tipos TypeScript — da hierarquia básica (unknown → never) aos tipos avançados (generics, conditional, mapped).",
    },
}

export default typescript
