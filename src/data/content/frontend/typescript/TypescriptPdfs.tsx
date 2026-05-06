'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import type { HookItem, PatternItem, DepRow, RuleItem } from '@/components/pdfs/CheatsheetPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'
import { buildComparativeRefPdf } from '@/components/pdfs/ComparativeRefPdf'
import type { CompOption, CompCriterion, CompScenario } from '@/components/pdfs/ComparativeRefPdf'
import { buildPatternsPdf } from '@/components/pdfs/PatternsPdf'
import type { DesignPattern } from '@/components/pdfs/PatternsPdf'
import { buildCommandRefPdf } from '@/components/pdfs/CommandRefPdf'
import type { CommandEntry } from '@/components/pdfs/CommandRefPdf'
import { buildErrorRefPdf } from '@/components/pdfs/ErrorRefPdf'
import type { ErrorEntry } from '@/components/pdfs/ErrorRefPdf'

// ── Paleta TypeScript ────────────────────────────────────────────────────────────
const C      = '#3178C6'
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const MUTE   = '#475569'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'

void BG; void CARD; void LINE; void MUTE; void FG; void FGMUTE

// ── Metadados dos PDFs ────────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas em entrevista',
    type: 'qa',
    pages: 9,
    description: 'Recuperação ativa: 20 perguntas de TypeScript — unknown vs any, narrowing, generics com constraints, utility types, conditional types com infer, satisfies, template literal types, mapped types, declaration merging, variância e branded types — com resposta estruturada para nível pleno e sênior.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'Tipos, narrowing e operadores em uma referência',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referência densa: tipos primitivos e especiais, formas de narrowing, operadores e modificadores de tipo (keyof, indexed access, satisfies, as const), padrões mentais e atalhos. Para checar rapidamente sem abrir documentação.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'utility',
    title: 'Utility Types Reference',
    subtitle: 'Os 12 utility types com sintaxe, caso de uso e exemplo',
    type: 'comparative',
    pages: 3,
    description: 'Folha de referência específica para os utility types do TypeScript. Cada um com sintaxe canônica, caso de uso real (CRUD, DTOs, transformações) e o cenário onde brilha. Tabela comparativa de Partial vs Pick vs Omit vs Record e quando preferir cada um.',
    icon: '03',
    goal: 'Domínio de utility types',
  },
  {
    id: 'generics',
    title: 'Guia de Generics',
    subtitle: 'Da função simples ao infer recursivo',
    type: 'patterns',
    pages: 4,
    description: 'Progressão completa de generics em TypeScript: simples (T preserva tipo), com constraint (T extends), com keyof (K extends keyof T), conditional (T extends U ? X : Y), infer (extrair tipos), distributive (sobre unions) e recursivo (variadic, deep transformations). Cada nível com exemplo real e quando aplicar.',
    icon: '04',
    goal: 'Domínio progressivo',
  },
  {
    id: 'tsconfig',
    title: 'tsconfig Reference',
    subtitle: 'Todas as flags que importam, com explicação',
    type: 'commands',
    pages: 4,
    description: 'Referência das flags de tsconfig.json organizadas por categoria: strict mode (strictNullChecks, noImplicitAny, etc.), module resolution, emit, JSX, paths e flags avançadas (noUncheckedIndexedAccess, exactOptionalPropertyTypes, isolatedModules, verbatimModuleSyntax). Cada flag com o que faz, quando ativar e impacto no código.',
    icon: '05',
    goal: 'Configuração precisa',
  },
  {
    id: 'errors',
    title: 'Erros Comuns do tsc',
    subtitle: 'TS2322, TS2339, TS2741 e outros — como ler e corrigir',
    type: 'errors',
    pages: 4,
    description: 'Os erros mais frequentes do compilador TypeScript com causa, solução e código antes/depois. TS2322 (não-atribuível), TS2339 (propriedade não existe), TS2345 (argumento incompatível), TS2741 (campo faltando), TS2769 (overload sem match), TS2589 (recursão infinita) e mais. Diagnóstico rápido para acelerar code review.',
    icon: '06',
    goal: 'Diagnóstico rápido',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'O que não fazer — e por quê',
    type: 'antipatterns',
    pages: 3,
    description: 'Os 8 anti-patterns mais comuns: any em vez de unknown, type assertion sem narrowing, @ts-ignore como solução, enum numérico vs union string, interface vazia, non-null assertion (!), generic desnecessário e object vs Record. Com código errado x correto.',
    icon: '07',
    goal: 'Reconhecimento de padrão',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Os 5 truques que grudam na memória',
    type: 'mnemonics',
    pages: 2,
    description: 'PURE para generics, SCAN para narrowing, TOP para utility types essenciais, UNCLE para quando NÃO anotar e UAN para escolher entre unknown/any/never. Associações verbais que ancoram melhor que ler.',
    icon: '08',
    goal: 'Memória de longo prazo',
  },
]

const TYPE_COLOR: Partial<Record<PdfType, string>> = {
  qa:           '#a78bfa',
  cheatsheet:   C,
  comparative:  '#38bdf8',
  patterns:     '#4ade80',
  commands:     '#fbbf24',
  errors:       '#f87171',
  antipatterns: '#ef4444',
  mnemonics:    '#a3e635',
}

void TYPE_COLOR

// ── Dados: Q&A ────────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: "Qual a diferença entre 'unknown' e 'any'?",
    a: 'any desliga toda verificação de tipos — você pode fazer qualquer operação sem erro, basicamente sai do TypeScript. unknown aceita qualquer valor mas força narrowing antes de usar — é o tipo seguro para JSON.parse, catch clause e respostas de API externas.',
    bullets: [
      'unknown obriga o chamador a verificar antes de usar (typeof, instanceof, type predicate).',
      'any aceita qualquer operação sem erro — bug aparece só em runtime.',
      'Regra prática: receba unknown em boundaries, narrowe antes de processar.',
    ],
    tip: "Diga 'unknown força o chamador a verificar antes de usar, any desabilita toda verificação'. Mostrar a diferença prática com um exemplo real (catch clause) vale muito em entrevista.",
  },
  {
    level: 'Pleno',
    q: 'Como funciona structural typing no TypeScript?',
    a: 'TypeScript usa structural typing — duck typing formal. Se um objeto tem as propriedades exigidas, ele é compatível com o tipo, mesmo sem herança ou implements explícito. É o oposto de Java/C# que são nominais (o nome da classe importa).',
    bullets: [
      '{ x: 10, y: 20 } satisfaz Point sem precisar dizer que é Point.',
      'Permite tipar bibliotecas existentes sem reescrever — mocks são triviais.',
      'Branded types (intersection com marcador) recriam comportamento nominal quando necessário.',
    ],
    tip: 'Mencionar branded types como solução para "preciso de identidade nominal em TS" é o diferencial sênior. Cite o padrão type UserId = string & { __brand: "UserId" }.',
  },
  {
    level: 'Pleno',
    q: 'O que é type narrowing e quais são as formas de fazer?',
    a: 'Narrowing é o processo do compilador de afinar o tipo dentro de um branch condicional baseado em verificações. Sete formas principais: typeof (primitivos), instanceof (classes), in (propriedade no objeto), type predicates (x is Type), asserts (asserts x is Type), discriminated union (campo literal) e truthiness narrowing.',
    bullets: [
      'typeof: para primitivos — string, number, boolean, function, undefined.',
      'instanceof: para instâncias de classe — Date, Error, classes customizadas.',
      'in: para verificar presença de propriedade — útil em polymorphic types.',
      'Type predicate (x is Type): função que retorna boolean e ensina o compilador.',
      'Discriminated union: campo literal (status, kind, type) que distingue membros.',
    ],
    tip: 'Discriminated union é o mais cobrado em entrevista sênior — mostre o exemplo com status: "ok" | "error" e explique por que é o padrão preferido para estados exclusivos.',
  },
  {
    level: 'Senior',
    q: 'Como funcionam generics com constraints?',
    a: 'Generics com extends adicionam restrições ao que pode ser passado como tipo, preservando a inferência sem aceitar qualquer coisa. T extends { id: string } garante que T tem ao menos a propriedade id, mas não limita a apenas isso — você preserva a forma completa do tipo passado.',
    bullets: [
      'function findById<T extends { id: string }>(items: T[], id: string): T | undefined.',
      'K extends keyof T é o padrão para pick, omit e get path — type-safe key access.',
      'Constraints são contratos mínimos, não tetos máximos — a forma completa é preservada.',
      'Sem constraint, item.id daria erro porque T pode ser qualquer coisa.',
    ],
    tip: 'O padrão K extends keyof T é o mais pedido em entrevista — aparece em utils como pick, omit, getPath. Mostrar um exemplo real demonstra domínio de generics.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre interface e type alias?',
    a: 'Para a maioria dos casos são equivalentes. As diferenças reais: interfaces suportam declaration merging (essencial para augmentar tipos de bibliotecas), types são mais expressivos (union, intersection, conditional, mapped, template literal), interfaces têm mensagens de erro mais legíveis e ligeiramente mais performance em codebases gigantes.',
    bullets: [
      'Declaration merging: só interface — declarar duas vezes faz merge dos campos.',
      'Union, intersection, conditional, mapped: só type alias suporta.',
      'Convenção: use type por padrão; reserve interface para merging ou APIs públicas extensíveis.',
      'A & B vira never em conflitos silenciosos; interface C extends A, B detecta em compile.',
    ],
    tip: 'Declaration merging é o ponto que mais pega em entrevista — dê o exemplo concreto de augmentar o Express Request. Isso mostra que você já precisou disso de verdade.',
  },
  {
    level: 'Senior',
    q: 'O que é infer e quando usar?',
    a: 'infer declara uma variável de tipo dentro de um conditional type — o TypeScript extrai e captura o tipo que casou com aquela posição. É o mecanismo por trás de ReturnType, Awaited e Parameters. Permite escrever utility types que extraem partes de um tipo composto.',
    bullets: [
      'type ReturnType<F> = F extends (...args: any[]) => infer R ? R : never.',
      'type Unwrap<T> = T extends Promise<infer U> ? Unwrap<U> : T — desembrulha Promises.',
      'type Head<T> = T extends [infer H, ...any[]] ? H : never — primeiro item de tuple.',
      'infer só pode aparecer no lado direito do extends (posição covariante).',
    ],
    tip: 'A maioria sabe que conditional types existem mas não sabe usar infer. Mostrar um exemplo com infer é o diferencial claro de sênior nessa pergunta.',
  },
  {
    level: 'Senior',
    q: 'Como funciona o satisfies operator?',
    a: 'satisfies (TS 4.9) valida que um valor é compatível com um tipo SEM alterar o tipo inferido. Com anotação :Type, o tipo do valor é ampliado para o declarado — você perde precisão dos literais. Com satisfies, o tipo inferido é preservado e a validação acontece — melhor dos dois mundos.',
    bullets: [
      'Anotação: const cfg: Config = { mode: "dark" } → cfg.mode é string.',
      'Satisfies: const cfg = { mode: "dark" } satisfies Config → cfg.mode é "dark".',
      'Útil em objetos de configuração e mapas onde você quer validação + autocomplete preciso.',
      'Diferente de "as": satisfies VERIFICA, "as" só promete (sem checagem real).',
    ],
    tip: 'Boa pergunta para diferenciar quem acompanha changelogs de quem não acompanha. Mostre o exemplo concreto com/sem satisfies e explique o tradeoff de tipo preservado vs ampliado.',
  },
  {
    level: 'Senior',
    q: 'O que são template literal types?',
    a: 'Template literal types constroem tipos de string compondo literais e outras string types, como template literals em JS mas em tempo de compilação. Permitem tipagem de eventos com prefixo (onClick, onFocus), parser de URL params, geração de getter/setter a partir de campos e CSS-in-JS com classes tipadas.',
    bullets: [
      'type EventName = `on${Capitalize<"click" | "focus">}` → "onClick" | "onFocus".',
      'Combinar com infer extrai params: ExtractParams<"/user/:id"> → "id".',
      'Capitalize, Uppercase, Lowercase, Uncapitalize são utility types built-in.',
      'Útil para tipagem type-safe de routers, eventos e geradores de chave.',
    ],
    tip: 'A combinação template literal + infer para extrair parâmetros de rota é o exemplo que mais impressiona — mostra criatividade no sistema de tipos.',
  },
  {
    level: 'Senior',
    q: 'Quando usar Mapped Types?',
    a: 'Mapped types iteram sobre as chaves de um tipo e transformam cada uma: { [K in keyof T]: T[K] }. São a base de Partial, Required, Readonly e Record. Use quando precisa derivar um tipo a partir de outro — adicionar/remover modificadores (?, readonly), remapear chaves com "as" ou transformar valores.',
    bullets: [
      'type Getters<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] }.',
      'type DeepReadonly<T> = { readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K] }.',
      '+? e -? adicionam/removem opcionalidade. +readonly e -readonly idem para imutabilidade.',
      'as remapeia chaves — útil para criar APIs derivadas (handlers, getters, setters).',
    ],
    tip: 'Mostrar DeepReadonly ou Getters com remapeamento de chave (as) é o que diferencia quem realmente entende mapped types de quem só sabe usar os utility types prontos.',
  },
  {
    level: 'Senior',
    q: 'Como tipar corretamente uma função overload?',
    a: 'Function overloads declaram assinaturas múltiplas antes da implementação. A implementação usa um tipo amplo (any/unknown) mas não é visível externamente — chamadores veem apenas as assinaturas tipadas. Útil quando o tipo de retorno depende do tipo do argumento de forma não capturável por generic simples.',
    bullets: [
      'Declare assinaturas em ordem do mais específico para o mais geral.',
      'A última declaração é a implementação real — não pode ser chamada externamente.',
      'Conditional types com infer geralmente são mais composíveis que overloads.',
      'TypeScript escolhe a primeira assinatura compatível na ordem declarada.',
    ],
    tip: 'Mencione que overloads têm uma implementação única que não é visível externamente — a maioria dos devs não sabe disso e é um diferencial claro.',
  },
  {
    level: 'Senior',
    q: 'O que são branded types e phantom types?',
    a: 'Branded types simulam identidade nominal em sistema estrutural. Você intersecta um tipo base com um marcador único: type UserId = string & { __brand: "UserId" }. Strings comuns não são UserId — você precisa de uma factory function que faz cast. Phantom types são variáveis de tipo que não aparecem no valor mas garantem invariantes em compile-time.',
    bullets: [
      'type UserId = string & { __brand: "UserId" } — não confunde com OrderId.',
      'Útil em IDs, moedas (BRL vs USD), unidades (Meters vs Feet).',
      'Phantom: type Validated<T> = T & { __validated: true } — só passa em validação.',
      'Custo zero em runtime — branding é só estrutura de tipos.',
    ],
    tip: 'Branded types são pouco conhecidos. Mostrar o caso real (UserId vs OrderId, BRL vs USD) demonstra que você pensa em invariantes em compile-time.',
  },
  {
    level: 'Senior',
    q: 'Como funciona distributive conditional types?',
    a: 'Quando o tipo do lado esquerdo de extends é uma union "naked" (não envolvido em [T] ou Array<T>), o conditional type distribui sobre cada membro da union. Exclude e Extract usam isso. Para evitar distribuição, envolva em tupla: [T] extends [U] desliga a distribuição.',
    bullets: [
      'type Exclude<T, U> = T extends U ? never : T — distribui sobre cada membro.',
      'Exclude<"a" | "b" | "c", "a"> avalia ("a" extends "a" ? never : "a") | ... = "b" | "c".',
      'Para não distribuir: [T] extends [U] — força avaliação como tupla unitária.',
      'Útil para criar utility types que opera membro a membro de uma union.',
    ],
    tip: 'A maioria dos devs não sabe que conditional types distribuem por padrão. Mencionar o truque [T] extends [U] para desligar distribuição mostra domínio profundo.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre Awaited<T> e Promise<T>?',
    a: 'Promise<T> é o tipo de uma Promise pendente que vai resolver com T. Awaited<T> é o tipo final após desembrulhar — equivalente ao que await retorna. Awaited<Promise<string>> é string. Awaited<Promise<Promise<string>>> também é string (desembrulha Promises aninhadas).',
    bullets: [
      'Promise<T>: tipo da Promise em si — o objeto que tem .then().',
      'Awaited<T>: tipo do valor após await — funciona recursivamente.',
      'ReturnType<typeof asyncFn> retorna Promise<X>; Awaited<ReturnType<typeof asyncFn>> retorna X.',
      'TS 4.5+ adicionou Awaited como built-in — antes você implementava manualmente.',
    ],
    tip: 'A combinação Awaited<ReturnType<typeof fn>> para extrair o tipo final de uma async function é o padrão mais útil dia a dia. Mostre esse exemplo.',
  },
  {
    level: 'Pleno',
    q: 'Por que evitar enum numérico?',
    a: 'Enum numérico gera código JS extra (objeto bidirecional com chaves e valores), os números 0/1/2 não dizem nada no debug e não são serializáveis de forma legível em logs/APIs. Union de strings literais é zero-overhead, debug-friendly e funciona com discriminated unions automaticamente.',
    bullets: [
      'enum Status { Idle, Loading } gera objeto JS — bundle cresce desnecessariamente.',
      'Status.Loading === 1 — sem semântica em logs e mensagens de erro.',
      'type Status = "idle" | "loading" tem zero overhead, é serializável e narrowing.',
      'const enum inlina os valores em compile, mas tem outras pegadinhas (isolatedModules).',
    ],
    tip: 'Citar isolatedModules + const enum como armadilha mostra que você lida com bundlers (esbuild, swc) que não suportam const enum por padrão.',
  },
  {
    level: 'Senior',
    q: 'Como fazer deep readonly em TypeScript?',
    a: 'Use mapped type recursivo: type DeepReadonly<T> = { readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K] }. Cuidado com casos especiais — Date, RegExp, Map, Set não são "objetos puros" e geralmente devem ser tratados como folhas.',
    bullets: [
      'Recursão via T[K] extends object ? DeepReadonly<T[K]> : T[K].',
      'Trate Date, Map, Set, RegExp, arrays como folhas — não recursar.',
      'Variant DeepReadonlyArray: T extends Array<infer U> ? ReadonlyArray<DeepReadonly<U>> : ...',
      'Em runtime, DeepReadonly não bloqueia mutação — só compile-time. Use Object.freeze para runtime.',
    ],
    tip: 'Mencionar que DeepReadonly NÃO previne mutação em runtime (só compile-time) é um detalhe que muitos esquecem — separe os dois universos na resposta.',
  },
  {
    level: 'Pleno',
    q: 'O que é const assertion e quando usar?',
    a: 'const assertion (as const) faz três coisas: literais são preservados como tipos literais (não alargados para string/number/boolean), arrays viram readonly tuples e propriedades de objetos ficam readonly com tipos literais precisos. Útil para preservar precisão em configurações, criar union types a partir de arrays e tuples imutáveis.',
    bullets: [
      'const cfg = { env: "prod" } as const → { readonly env: "prod" } (não string).',
      'const ROLES = ["admin", "user"] as const → readonly ["admin", "user"].',
      'type Role = typeof ROLES[number] → "admin" | "user" — gera union do array.',
      'Útil em routing config, mapas de constantes, satisfies + as const.',
    ],
    tip: 'O pattern typeof ARRAY[number] para gerar union type a partir de array com as const é um dos truques mais úteis e frequentemente pedidos.',
  },
  {
    level: 'Pleno',
    q: 'Como tipar um evento DOM corretamente?',
    a: 'Use os tipos específicos do DOM: MouseEvent<HTMLButtonElement>, ChangeEvent<HTMLInputElement>, KeyboardEvent<HTMLDivElement>. O genérico carrega o tipo do elemento em event.currentTarget. Para handlers em React, use os tipos sintéticos: React.MouseEvent, React.ChangeEvent, React.FormEvent.',
    bullets: [
      'onClick: (e: React.MouseEvent<HTMLButtonElement>) => void — currentTarget tipado.',
      'onChange em input: React.ChangeEvent<HTMLInputElement> — e.target.value é string.',
      'onSubmit em form: React.FormEvent<HTMLFormElement> — chame e.preventDefault().',
      'Eventos DOM nativos (não-React): use Event, MouseEvent, KeyboardEvent diretamente.',
    ],
    tip: 'Mencionar a diferença entre target e currentTarget (target pode ser elemento filho) é o detalhe que separa quem só copia tipos de quem entende eventos no DOM.',
  },
  {
    level: 'Senior',
    q: 'O que é declaration merging?',
    a: 'Quando TypeScript vê duas declarações com o mesmo nome no mesmo escopo, ele as mescla em uma única definição. Funciona com interfaces, namespaces e em combinações específicas (interface + class, namespace + function). É o mecanismo para augmentar tipos de bibliotecas de terceiros sem fork.',
    bullets: [
      'Augmentar Express Request: interface Request { user?: AuthUser } adiciona campo.',
      'Augmentar Window: declare global { interface Window { myApp: App } }.',
      'process.env: declare namespace NodeJS { interface ProcessEnv { API_URL: string } }.',
      'Type aliases NÃO suportam merging — declarar duas vezes é erro.',
    ],
    tip: 'O caso de augmentar Express Request é o mais pedido em entrevista. Se você trabalhou com Node.js/Express e não sabe isso, parece que nunca adicionou dados ao request no middleware.',
  },
  {
    level: 'Pleno',
    q: 'Como usar Extract e Exclude para manipular unions?',
    a: 'Exclude<T, U> remove de T os membros atribuíveis a U — útil para "todos os Roles exceto admin". Extract<T, U> faz o oposto: mantém apenas os membros compatíveis. Ambos funcionam por distributive conditional types — operam membro a membro da union.',
    bullets: [
      'type NonAdmin = Exclude<"admin" | "user" | "guest", "admin"> → "user" | "guest".',
      'type Strings = Extract<string | number | boolean, string> → string.',
      'NonNullable<T> = Exclude<T, null | undefined> — remove nulls de uma union.',
      'Extract com objetos exige cuidado — usa atribuibilidade estrutural completa.',
    ],
    tip: 'Mostrar que NonNullable é implementado como Exclude<T, null | undefined> faz o entrevistador ver que você entende a composição entre utility types.',
  },
  {
    level: 'Senior',
    q: 'Qual a diferença entre satisfies e type assertion (as)?',
    a: 'satisfies VERIFICA que o valor é compatível com o tipo — preserva o tipo inferido para uso posterior. as PROMETE ao compilador que o valor é do tipo, sem verificação real — perigoso se você estiver errado. Em projetos sérios, prefira satisfies sempre que possível; reserve as para casos onde o compilador realmente não consegue inferir.',
    bullets: [
      'satisfies: validação + preserva tipo inferido — best of both worlds.',
      'as: promessa não verificada — útil quando você sabe mais que o compilador.',
      'satisfies é seguro mesmo em refactors — se o tipo mudar, erro de compilação.',
      'as silencia bugs em runtime — { } as Config compila mesmo com campos faltando.',
    ],
    tip: 'A pergunta quase sempre aparece em contexto de "quando usar satisfies vs as". Mostrar o exemplo concreto de as escondendo bugs em runtime ganha pontos.',
  },
]

// ── Dados: CheatSheet ─────────────────────────────────────────────────────────────

const PRIMITIVES: HookItem[] = [
  { name: 'string',     sig: 'let nome: string',                  desc: 'Texto. Métodos: toUpperCase, split, includes, startsWith. Use template literals.' },
  { name: 'number',     sig: 'let n: number',                     desc: 'Inteiros e decimais (todos float64). NaN, Infinity. Sem distinção int/float.' },
  { name: 'boolean',    sig: 'let ok: boolean',                   desc: 'true ou false. Cuidado com truthy/falsy em narrowing — truthiness narrowing remove null e ""' },
  { name: 'bigint',     sig: 'let big: bigint = 100n',            desc: 'Inteiros arbitrariamente grandes. Sufixo n. Não mistura com number.' },
  { name: 'symbol',     sig: 'let s: symbol = Symbol("id")',      desc: 'Identificador único. Útil para chaves de objeto e branded types.' },
  { name: 'null',       sig: 'let x: null = null',                desc: 'Ausência intencional. Com strict, é tipo distinto não-atribuível.' },
  { name: 'undefined',  sig: 'let x: undefined',                  desc: 'Não inicializado. Com strict, é tipo distinto não-atribuível.' },
  { name: 'void',       sig: 'function f(): void',                desc: 'Função que não retorna valor útil. Diferente de undefined.' },
]

const SPECIAL_TYPES: HookItem[] = [
  { name: 'unknown',    sig: 'let x: unknown',                    desc: 'Topo do sistema. Aceita tudo, exige narrowing antes de usar. Versão segura de any.' },
  { name: 'any',        sig: 'let x: any',                        desc: 'Opt-out do sistema de tipos. Use só em migrações ou últimos recursos.' },
  { name: 'never',      sig: 'function fail(): never',            desc: 'Conjunto vazio. Funções que sempre lançam ou loop infinito. Exhaustive check em switch.' },
  { name: 'object',     sig: 'let o: object',                     desc: 'Não-primitivo. Sem index signature — prefira Record<string, unknown>.' },
  { name: 'tuple',      sig: 'let t: [string, number]',           desc: 'Array com posição e tipo fixos. Use as const para readonly tuples.' },
  { name: 'literal',    sig: 'type Status = "ok" | "error"',      desc: 'Valor específico como tipo. Base de discriminated unions.' },
]

const NARROWING_ROWS: DepRow[] = [
  ['typeof',           'Para primitivos: typeof x === "string" | "number" | "boolean" | "function" | "undefined".'],
  ['instanceof',       'Para classes: x instanceof Date | Error. Funciona com qualquer construtor.'],
  ['in',               'Para presença de propriedade: "id" in obj — útil em polymorphic types.'],
  ['type predicate',   'function isUser(x): x is User { return ... } — narrowing manual com lógica custom.'],
  ['asserts',          'function assertUser(x): asserts x is User — narra após chamada (se não lançou).'],
  ['discriminated',    'Switch em campo literal: switch (r.status) — narrowing automático em cada case.'],
  ['truthiness',       'if (x) — remove null, undefined, 0, "", false do tipo da union.'],
  ['equality',         'if (x === "ok") — narrowing por igualdade com literal.'],
]

const TSCONFIG_RULES: RuleItem[] = [
  { ok: true,  t: 'strict: true — ativa todos os checks críticos (strictNullChecks, noImplicitAny, etc.)' },
  { ok: true,  t: 'target: ES2017+ — compatibilidade com browsers modernos e Node.js' },
  { ok: true,  t: 'moduleResolution: "bundler" — resolve ESM corretamente para Vite/Next.js modernos' },
  { ok: true,  t: 'noUncheckedIndexedAccess: true — arr[i] retorna T | undefined (evita runtime errors)' },
  { ok: true,  t: 'paths — aliases de importação (@/* para src/*) — limpa imports profundos' },
  { ok: true,  t: 'esModuleInterop: true — necessário para importar libs CommonJS como default imports' },
  { ok: false, t: 'skipLibCheck: true — silencia erros em node_modules; só use se houver conflitos irresolvíveis' },
  { ok: false, t: 'any implícito — sempre prefira unknown e force narrowing explícito' },
]

const TS_TIPS: string[] = [
  'satisfies preserva o tipo inferido — prefira a anotação :Type quando quer autocomplete preciso.',
  'as const transforma literais em tipos literais e arrays em readonly tuples — combo com typeof.',
  'unknown é a porta de entrada segura — use em catch, JSON.parse e respostas de API externas.',
  'Discriminated union > múltiplos types separados — narrowing automático em switch é gold.',
  'Generic constraints (T extends ...) garantem contratos mínimos sem perder a forma completa.',
  'Type predicates (x is T) > type assertion (as T) — guards verificam, assertions só prometem.',
  'Augmente bibliotecas via declaration merging em vez de @ts-ignore — solução estrutural.',
  'noUncheckedIndexedAccess elimina uma classe inteira de bugs (acesso a array fora dos limites).',
]

const TS_PATTERNS: PatternItem[] = [
  { name: 'Discriminated Union',  code: 'type R = { kind: "ok"; data: T } | { kind: "err"; msg: string }', desc: 'Estados exclusivos com narrowing automático em switch.' },
  { name: 'Branded Type',         code: 'type UserId = string & { __brand: "UserId" }',                    desc: 'Identidade nominal sobre tipo estrutural — evita confundir IDs.' },
  { name: 'Builder Pattern',      code: 'where<K extends keyof T>(k: K, v: T[K]): this { ... }',           desc: 'Fluent API tipada com keyof + this return.' },
  { name: 'Type-safe Pick',       code: 'function pick<T, K extends keyof T>(o: T, ks: K[]): Pick<T, K>',  desc: 'Helper genérico que preserva o tipo dos valores.' },
  { name: 'Const Assertion',      code: 'const ROLES = ["admin", "user"] as const',                        desc: 'Gera tipo literal preciso. type Role = typeof ROLES[number].' },
  { name: 'Schema + Tipos',       code: 'const Schema = z.object({...}); type T = z.infer<typeof Schema>',  desc: 'Zod gera tipo TS a partir do schema runtime — uma fonte de verdade.' },
]

const TS_MENTAL_MODELS: string[] = [
  'Tipos são conjuntos de valores — string é o conjunto de todas as strings; "ok" é um conjunto de um.',
  'unknown é o universo (todos os valores); never é o vazio (nenhum valor).',
  'Estrutural > nominal — se tem a forma, é compatível. Sem precisar de extends ou implements.',
  'Tipos são apagados em runtime — não tente typeof MyInterface, use type guards.',
  'satisfies = anotação :T mantendo o tipo inferido — autocomplete não se perde.',
  'Generic é uma função no nível dos tipos — recebe tipo, retorna tipo.',
  'Conditional + infer = pattern matching no sistema de tipos.',
]

// ── Dados: Utility Types Reference (ComparativeRefPdf) ──────────────────────────

const UTILITY_OPTIONS: CompOption[] = [
  { name: 'Partial',  color: '#38bdf8' },
  { name: 'Required', color: '#4ade80' },
  { name: 'Pick',     color: '#fbbf24' },
  { name: 'Omit',     color: '#f87171' },
  { name: 'Readonly', color: '#a78bfa' },
  { name: 'Record',   color: '#f472b6' },
]

const UTILITY_CRITERIA: CompCriterion[] = [
  {
    category: 'Forma de aplicação',
    criterion: 'O que faz com os campos',
    values: {
      Partial:  'Adiciona ?',
      Required: 'Remove ?',
      Pick:     'Mantém K',
      Omit:     'Remove K',
      Readonly: 'Adiciona readonly',
      Record:   'Cria { K: V }',
    },
  },
  {
    category: 'Forma de aplicação',
    criterion: 'Modifica modificadores',
    values: {
      Partial:  'sim (+?)',
      Required: 'sim (-?)',
      Pick:     'não',
      Omit:     'não',
      Readonly: 'sim (+readonly)',
      Record:   'não',
    },
  },
  {
    category: 'Caso de uso CRUD',
    criterion: 'Tipo de Create (sem id, sem timestamps)',
    values: {
      Partial:  '—',
      Required: '—',
      Pick:     'às vezes',
      Omit:     'sim ★',
      Readonly: '—',
      Record:   '—',
    },
    winner: 'Omit',
  },
  {
    category: 'Caso de uso CRUD',
    criterion: 'Tipo de Update (PATCH parcial)',
    values: {
      Partial:  'sim ★',
      Required: '—',
      Pick:     'combina com Partial',
      Omit:     '—',
      Readonly: '—',
      Record:   '—',
    },
    winner: 'Partial',
  },
  {
    category: 'Caso de uso CRUD',
    criterion: 'DTO de listagem (preview, só campos mínimos)',
    values: {
      Partial:  '—',
      Required: '—',
      Pick:     'sim ★',
      Omit:     'às vezes',
      Readonly: '—',
      Record:   '—',
    },
    winner: 'Pick',
  },
  {
    category: 'Caso de uso CRUD',
    criterion: 'Lookup table (mapa por chave conhecida)',
    values: {
      Partial:  '—',
      Required: '—',
      Pick:     '—',
      Omit:     '—',
      Readonly: '—',
      Record:   'sim ★',
    },
    winner: 'Record',
  },
  {
    category: 'Caso de uso CRUD',
    criterion: 'Estado imutável (Redux, store)',
    values: {
      Partial:  '—',
      Required: '—',
      Pick:     '—',
      Omit:     '—',
      Readonly: 'sim ★',
      Record:   '—',
    },
    winner: 'Readonly',
  },
  {
    category: 'Implementação interna',
    criterion: 'Sintaxe canônica',
    values: {
      Partial:  '{ [K in keyof T]?: T[K] }',
      Required: '{ [K in keyof T]-?: T[K] }',
      Pick:     '{ [K in K_]: T[K] }',
      Omit:     'Pick<T, Exclude<keyof T, K>>',
      Readonly: '{ readonly [K in keyof T]: T[K] }',
      Record:   '{ [P in K]: V }',
    },
  },
  {
    category: 'Cuidados',
    criterion: 'Recursivo automaticamente',
    values: {
      Partial:  'não',
      Required: 'não',
      Pick:     'não',
      Omit:     'não',
      Readonly: 'não',
      Record:   'não',
    },
  },
  {
    category: 'Cuidados',
    criterion: 'Atua em runtime',
    values: {
      Partial:  'não',
      Required: 'não',
      Pick:     'não',
      Omit:     'não',
      Readonly: 'não',
      Record:   'não',
    },
  },
]

const UTILITY_SCENARIOS: CompScenario[] = [
  {
    scenario: 'Você precisa modelar o body de um PATCH /users/:id onde nem todo campo é obrigatório.',
    recommendation: 'Partial<Pick<User, "name" | "email">>',
    reason: 'Pick filtra os campos editáveis (não permite mudar id ou createdAt), Partial torna todos opcionais para que o cliente envie só o que mudou.',
  },
  {
    scenario: 'Modelar o body de POST /users — sem id e sem timestamps gerados pelo banco.',
    recommendation: 'Omit<User, "id" | "createdAt" | "updatedAt">',
    reason: 'Omit remove os campos que o banco preenche. Mais legível que listar todos os campos manualmente.',
  },
  {
    scenario: 'Tabela de permissões por role: cada role tem array de permissões.',
    recommendation: 'Record<Role, Permission[]>',
    reason: 'Record cria um mapa tipado onde as chaves são exatamente os valores de Role e os valores são listas tipadas. TypeScript verifica que você cobriu todas as roles.',
  },
  {
    scenario: 'Garantir que um objeto de configuração nunca seja mutado por engano em código consumidor.',
    recommendation: 'Readonly<Config> + Object.freeze',
    reason: 'Readonly previne mutação em compile-time. Object.freeze protege em runtime. Combine ambos para garantia total.',
  },
  {
    scenario: 'Você tem um tipo com muitos campos opcionais e quer forçar todos a estarem presentes em um contexto específico.',
    recommendation: 'Required<Config>',
    reason: 'Inverte a opcionalidade — útil após validação ou quando a entidade é totalmente carregada (vs partial em criação).',
  },
  {
    scenario: 'Componente de preview que só mostra id e título de um post.',
    recommendation: 'Pick<Post, "id" | "title">',
    reason: 'Pick gera um subconjunto exato. Se Post mudar (campos novos), o preview não é afetado — uma fonte de verdade.',
  },
]

// ── Dados: Generics Guide (PatternsPdf) ──────────────────────────────────────────

const GENERICS_PATTERNS: DesignPattern[] = [
  {
    name: 'Generic simples — preservar tipo',
    category: 'Nível 1 — Fundação',
    intent: 'Função que opera sobre qualquer tipo mas precisa preservar o tipo do argumento no retorno. Sem generic, retorna any e perde a informação.',
    whenToUse: [
      'Funções utilitárias que operam sobre containers genéricos (arrays, maps).',
      'Helpers que pegam valor e devolvem valor transformado mantendo o tipo.',
      'Wrappers de bibliotecas onde o tipo de saída depende do tipo de entrada.',
    ],
    whenToAvoid: [
      'Quando T não aparece em mais de um lugar com significado — generic supérfluo.',
      'Quando o tipo é totalmente conhecido — use o tipo concreto.',
    ],
    participants: ['T (parâmetro de tipo)', 'Argumento de entrada', 'Tipo de retorno relacionado a T'],
    code: `function first<T>(arr: T[]): T | undefined {
  return arr[0]
}

const n = first([1, 2, 3])     // n: number | undefined
const s = first(['a', 'b'])    // s: string | undefined
// SEM generic: retornaria any — type safety perdida.`,
    realWorldExample: 'Usado em quase toda lib utilitária: lodash _.first, R.head, Array.prototype.find, hooks customizados que aceitam valor genérico.',
  },
  {
    name: 'Constraint via extends',
    category: 'Nível 2 — Constraints',
    intent: 'Forçar o tipo genérico a ter ao menos uma forma mínima. Permite acessar propriedades de T sem perder a forma completa do tipo passado.',
    whenToUse: [
      'Quando o código interno precisa acessar campos específicos de T (item.id, x.length).',
      'Para garantir contratos mínimos em utility functions de domínio (entidades com id).',
      'Para filtrar tipos aceitos sem usar união explícita.',
    ],
    whenToAvoid: [
      'Como teto máximo — constraints são pisos (mínimo), não tetos.',
      'Quando você só precisa de uma propriedade — considere usar tipo concreto.',
    ],
    participants: ['T (parâmetro genérico)', 'Tipo de constraint (lado direito de extends)', 'Forma resultante (T preserva campos extras)'],
    code: `function findById<T extends { id: string }>(
  items: T[],
  id: string
): T | undefined {
  return items.find(item => item.id === id)
}

const users = [{ id: '1', name: 'Ana', age: 30 }]
const u = findById(users, '1')
// u é { id: string; name: string; age: number } | undefined
// Forma COMPLETA preservada — não só { id: string }.`,
    realWorldExample: 'Repositórios genéricos em ORMs (TypeORM Repository<T extends BaseEntity>), hooks de identificação (useFindById), validators que aceitam qualquer entidade com discriminator.',
  },
  {
    name: 'keyof T — type-safe key access',
    category: 'Nível 2 — Constraints',
    intent: 'Restringir um parâmetro a ser uma chave válida de outro tipo genérico. Pattern fundamental em pick, omit, get path e setters tipados.',
    whenToUse: [
      'Helpers que recebem um nome de campo e devolvem o valor desse campo.',
      'Pick/Omit customizados com lógica adicional.',
      'Object getters/setters que devem funcionar em qualquer entidade.',
    ],
    whenToAvoid: [
      'Quando as chaves são fixas e conhecidas — use a união literal direta.',
      'Em loops genéricos sem garantia — TypeScript pode não conseguir narrowar K[i].',
    ],
    participants: ['T (objeto)', 'K extends keyof T (chave válida)', 'T[K] (tipo do valor — indexed access)'],
    code: `function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

interface User { id: string; name: string; age: number }
const user: User = { id: '1', name: 'Ana', age: 30 }

const id   = getProp(user, 'id')   // id: string
const age  = getProp(user, 'age')  // age: number
// getProp(user, 'invalid')        // erro de compilação`,
    realWorldExample: 'Pick<T, K>, Omit<T, K>, lodash _.get, react-hook-form register("fieldName"), Prisma where: { name: ... }.',
  },
  {
    name: 'Conditional types — T extends U ? X : Y',
    category: 'Nível 3 — Conditional',
    intent: 'Tipo cuja forma depende de uma condição. Permite ramificação no nível dos tipos: "se T é função, retorne X; senão Y". É a base de utility types como ReturnType.',
    whenToUse: [
      'Quando o tipo de saída depende da forma do tipo de entrada.',
      'Para criar utility types customizados (IsArray, IfFunction, NonEmpty).',
      'Para distribuir transformações sobre membros de uma união (com cuidado).',
    ],
    whenToAvoid: [
      'Quando uma anotação direta resolve — conditional types complicam diagnóstico.',
      'Em casos onde overloads de função são mais legíveis.',
    ],
    participants: ['Tipo a testar (lado esquerdo de extends)', 'Tipo da condição (lado direito)', 'Branches X e Y'],
    code: `type IsArray<T> = T extends unknown[] ? true : false

type A = IsArray<string[]>   // true
type B = IsArray<number>     // false
type C = IsArray<readonly string[]>  // true

// Caso composto:
type Stringify<T> = T extends string ? T : T extends number ? \`\${T}\` : never
type S1 = Stringify<'hello'>  // 'hello'
type S2 = Stringify<42>       // '42'
type S3 = Stringify<boolean>  // never`,
    realWorldExample: 'Implementação interna de Exclude<T, U>, Extract<T, U>, NonNullable<T>. Em libs como zod (z.infer), tRPC (router type inference), Prisma (where types).',
  },
  {
    name: 'infer — extrair partes do tipo',
    category: 'Nível 4 — infer',
    intent: 'Capturar uma parte do tipo dentro de um conditional type usando uma variável de tipo "anônima". É como um capture group em regex, mas no nível dos tipos.',
    whenToUse: [
      'Para extrair tipo de retorno de função (ReturnType).',
      'Para desembrulhar containers genéricos (Promise<T>, Array<T>, Map<K,V>).',
      'Para parser de strings via template literal types + infer.',
    ],
    whenToAvoid: [
      'Quando o tipo já está acessível via indexed access (ex: Foo["bar"]).',
      'Em casos simples — anotação direta é mais legível.',
    ],
    participants: ['Conditional type (T extends ...)', 'infer R (variável capturada)', 'Branches que usam ou não a captura'],
    code: `// ReturnType implementado manualmente:
type ReturnType<F> = F extends (...args: any[]) => infer R ? R : never

type R1 = ReturnType<() => string>           // string
type R2 = ReturnType<(x: number) => User>    // User

// Desembrulhar Promises (recursivo):
type Unwrap<T> = T extends Promise<infer U> ? Unwrap<U> : T
type R3 = Unwrap<Promise<Promise<number>>>   // number

// Extrair primeiro argumento:
type FirstArg<F> = F extends (a: infer A, ...rest: any[]) => any ? A : never
type R4 = FirstArg<(x: string, y: number) => void>  // string`,
    realWorldExample: 'Built-ins ReturnType, Parameters, Awaited, InstanceType. Usado pesadamente em react-query (data type inference), tRPC e zod.',
  },
  {
    name: 'Distributive conditional types',
    category: 'Nível 4 — infer',
    intent: 'Quando T é "naked" (sozinho no lado esquerdo de extends) e é uma união, o conditional type DISTRIBUI sobre cada membro. É o segredo de Exclude e Extract.',
    whenToUse: [
      'Para operar membro a membro em uma união (filtrar, transformar).',
      'Para implementar Exclude/Extract customizados com lógica adicional.',
      'Para gerar união de tipos transformados a partir de uma união base.',
    ],
    whenToAvoid: [
      'Quando você quer tratar a união como um todo — use [T] extends [U] para desligar.',
      'Quando a recursão sobre cada membro estoura o limite do compilador.',
    ],
    participants: ['Union type T', 'extends U (condição)', 'Distribuição implícita sobre cada membro'],
    code: `// Distribui automaticamente:
type ToArray<T> = T extends any ? T[] : never
type R1 = ToArray<string | number>
// = string[] | number[]   ← NÃO é (string | number)[]

// Para desligar a distribuição: envolva em tupla.
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never
type R2 = ToArrayNonDist<string | number>  // (string | number)[]

// Implementação interna de Exclude:
type Exclude<T, U> = T extends U ? never : T
type R3 = Exclude<'a' | 'b' | 'c', 'a'>  // 'b' | 'c'
// Distribuição: ('a' extends 'a' ? never : 'a')
//             | ('b' extends 'a' ? never : 'b')
//             | ('c' extends 'a' ? never : 'c')
//             = never | 'b' | 'c' = 'b' | 'c'`,
    realWorldExample: 'Built-ins Exclude, Extract, NonNullable. Em tRPC para gerar tipos de procedure por path. Em Prisma para gerar where types por campo.',
  },
  {
    name: 'Variadic tuple types — composição de funções',
    category: 'Nível 5 — Avançado',
    intent: 'Manipular tuples genéricas com spread (...). Permite tipar concat, curry, compose e funções variádicas com type safety total — feature de TS 4.0.',
    whenToUse: [
      'Para tipar funções variádicas (concat, compose, pipe).',
      'Para preservar a ordem e quantidade de elementos em arrays tipados.',
      'Para construir tipos derivados de listas heterogêneas.',
    ],
    whenToAvoid: [
      'Quando uma assinatura simples basta — variadic tuples complicam a leitura.',
      'Em codebases que precisam suportar TS < 4.0.',
    ],
    participants: ['Tuple genérica T extends any[]', 'Spread em posição de tipo (...)', 'Outra tuple ou tipo concreto'],
    code: `// Concat de duas tuples:
type Concat<A extends any[], B extends any[]> = [...A, ...B]
type R1 = Concat<[1, 2], ['a', 'b']>  // [1, 2, 'a', 'b']

// Tipar compose de funções (right-to-left):
type Compose<F, G> =
  F extends (x: infer FA) => infer FR
    ? G extends (y: FR) => infer GR
      ? (x: FA) => GR
      : never
    : never

// First/Last/Tail genéricos sobre tuples:
type Head<T extends any[]> = T extends [infer H, ...any[]] ? H : never
type Tail<T extends any[]> = T extends [any, ...infer R] ? R : never
type R2 = Head<[1, 2, 3]>  // 1
type R3 = Tail<[1, 2, 3]>  // [2, 3]`,
    realWorldExample: 'Bibliotecas de FP (fp-ts, ts-toolbelt, hotscript), tipagem de Express middleware (req, res, next, ...rest), routers tipados.',
  },
  {
    name: 'Mapped types + key remapping (as)',
    category: 'Nível 5 — Avançado',
    intent: 'Iterar sobre as chaves de um tipo e transformar cada uma — tanto o nome (com as) quanto o tipo do valor. É o mecanismo por trás de TODOS os utility types built-in.',
    whenToUse: [
      'Para criar utility types customizados (Getters, Setters, EventHandlers).',
      'Para remapear nomes de campo (snake_case ↔ camelCase em tipos).',
      'Para filtrar campos por tipo do valor (StringKeysOnly, RequiredKeys).',
    ],
    whenToAvoid: [
      'Quando um utility built-in resolve — Partial, Required, Readonly já cobrem 80%.',
      'Em casos onde o resultado é mais difícil de ler que o explícito.',
    ],
    participants: ['Tipo origem T', 'K in keyof T (iteração)', 'as <expr> (remapping)', 'T[K] (valor)'],
    code: `// Gerar getters a partir dos campos:
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K]
}

interface User { id: string; name: string; age: number }
type UserGetters = Getters<User>
// {
//   getId:   () => string
//   getName: () => string
//   getAge:  () => number
// }

// Filtrar chaves por tipo do valor:
type StringKeysOnly<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K]
}
type S = StringKeysOnly<{ a: string; b: number; c: string }>
// { a: string; c: string }`,
    realWorldExample: 'react-hook-form Path<T>, Mongoose query builders, Prisma select types, frameworks que geram APIs derivadas (tRPC).',
  },
  {
    name: 'Branded types — identidade nominal',
    category: 'Nível 5 — Avançado',
    intent: 'Recriar identidade nominal (nome importa, não só forma) sobre o sistema estrutural do TypeScript. Útil para diferenciar IDs estruturalmente iguais (UserId vs OrderId, ambos são string).',
    whenToUse: [
      'IDs de domínio que não devem ser confundidos (UserId, OrderId, ProductId).',
      'Unidades (Meters vs Feet, Celsius vs Fahrenheit, Cents vs Dollars).',
      'Valores que passaram por validação (Email, ValidatedInput, SafeURL).',
    ],
    whenToAvoid: [
      'Quando a forma estrutural já é suficiente — branding é overhead conceitual.',
      'Em projetos pequenos onde não há risco real de confusão.',
    ],
    participants: ['Tipo base (string, number)', 'Brand marker (intersection com símbolo único)', 'Factory function que faz o cast seguro'],
    code: `// Brand com tipo string:
declare const brand: unique symbol
type Brand<T, B> = T & { readonly [brand]: B }

type UserId  = Brand<string, 'UserId'>
type OrderId = Brand<string, 'OrderId'>

// Factories (única forma de criar):
function toUserId(s: string): UserId {
  if (!/^u_/.test(s)) throw new Error('UserId inválido')
  return s as UserId
}
function toOrderId(s: string): OrderId {
  if (!/^o_/.test(s)) throw new Error('OrderId inválido')
  return s as OrderId
}

// Em uso:
function fetchUser(id: UserId): User { /* ... */ return { } as User }
const uid = toUserId('u_123')
fetchUser(uid)              // ok
// fetchUser('u_123')       // erro: string não é UserId
// fetchUser(toOrderId('o_1'))  // erro: OrderId não é UserId`,
    realWorldExample: 'Effect-ts (Brand module), zod (z.brand), domínios DDD com VOs tipados, sistemas financeiros onde Cents != Dollars é crítico.',
  },
]

// ── Dados: tsconfig Reference (CommandRefPdf) ──────────────────────────────────

const TSCONFIG_FLAGS: CommandEntry[] = [
  // Strict mode
  {
    category: 'Strict Mode',
    command: '"strict": true',
    description: 'Ativa todos os checks rigorosos de uma vez. Inclui strictNullChecks, noImplicitAny, strictFunctionTypes, strictBindCallApply, strictPropertyInitialization, alwaysStrict, useUnknownInCatchVariables. Sempre ative em projetos novos.',
    flags: [
      { flag: 'strictNullChecks',          description: 'null e undefined são tipos distintos, não atribuíveis a outros (mais importante).' },
      { flag: 'noImplicitAny',             description: 'Parâmetros sem tipo explícito viram erro em vez de any silencioso.' },
      { flag: 'strictFunctionTypes',       description: 'Verifica contravariância de parâmetros de função (callbacks).' },
      { flag: 'strictBindCallApply',       description: 'bind/call/apply verificam tipo dos argumentos.' },
      { flag: 'strictPropertyInitialization', description: 'Campos de classe sem default ou atribuição em construtor viram erro.' },
      { flag: 'useUnknownInCatchVariables', description: 'catch (e) — e é unknown, força narrowing antes de usar.' },
    ],
    example: '{\n  "compilerOptions": {\n    "strict": true\n  }\n}',
  },
  {
    category: 'Strict Mode',
    command: '"noUncheckedIndexedAccess": true',
    description: 'Acesso indexado (arr[i], obj[key]) retorna T | undefined. Elimina uma classe inteira de bugs onde você assumiu que o item existia. Recomendado em projetos novos.',
    example: 'const arr: number[] = [1, 2, 3]\nconst x = arr[10]  // x: number | undefined (sem essa flag, x: number)',
  },
  {
    category: 'Strict Mode',
    command: '"exactOptionalPropertyTypes": true',
    description: 'Distingue { x: undefined } de { } — campos opcionais não podem receber undefined explicitamente, apenas serem omitidos. Mais rigoroso, evita bugs sutis em validação.',
    example: 'type T = { name?: string }\nconst a: T = { }              // ok\nconst b: T = { name: undefined }  // erro com a flag',
  },
  {
    category: 'Strict Mode',
    command: '"noImplicitReturns": true',
    description: 'Todas as branches de uma função devem ter return explícito (ou nenhuma, para void). Previne bugs de retorno esquecido em early returns.',
    example: 'function f(x: number) {\n  if (x > 0) return "pos"\n  // erro: branch sem return\n}',
  },

  // Module resolution
  {
    category: 'Module Resolution',
    command: '"moduleResolution": "bundler"',
    description: 'Estratégia recomendada para projetos com Vite, Next.js ou esbuild. Resolve ESM corretamente, suporta exports/imports condicionais do package.json, lida com extensões opcionais.',
    flags: [
      { flag: 'node',     description: 'Algoritmo legado do Node (CommonJS). Use só em projetos antigos.' },
      { flag: 'node16',   description: 'Algoritmo do Node 16+ com suporte a ESM nativo. Use em backends Node modernos.' },
      { flag: 'nodenext', description: 'Igual ao node16, mas tracking de futuras versões. Para libs publicadas.' },
      { flag: 'bundler',  description: 'TS 5.0+. Para Vite/Next/esbuild — o bundler resolve, TS só checa.' },
    ],
    example: '"moduleResolution": "bundler"  // Vite, Next.js, esbuild\n"moduleResolution": "node16"   // Node.js puro com ESM',
  },
  {
    category: 'Module Resolution',
    command: '"module": "ESNext"',
    description: 'Como o TS emite módulos. ESNext deixa imports/exports nativos para o bundler resolver. CommonJS gera require/module.exports. Em frontend moderno, sempre ESNext.',
    flags: [
      { flag: 'ESNext',   description: 'Deixa import/export nativos. Para bundlers (Vite, Webpack, esbuild).' },
      { flag: 'CommonJS', description: 'Emite require/module.exports. Para Node.js sem ESM.' },
      { flag: 'NodeNext', description: 'Híbrido — usa import/export ou require dependendo do package.json.' },
    ],
    example: '"module": "ESNext"     // frontend, libs ESM\n"module": "CommonJS"   // backend Node legacy',
  },
  {
    category: 'Module Resolution',
    command: '"paths": { "@/*": ["./src/*"] }',
    description: 'Aliases de importação. Permite escrever import { x } from "@/utils" em vez de "../../../../utils". Vital em projetos grandes. Requer baseUrl ou ser combinado com plugins do bundler.',
    example: '"baseUrl": ".",\n"paths": {\n  "@/*": ["./src/*"],\n  "@components/*": ["./src/components/*"]\n}',
  },
  {
    category: 'Module Resolution',
    command: '"baseUrl": "."',
    description: 'Base para resolução de paths não-relativos. Combinado com paths, permite imports limpos. Em "bundler" moduleResolution, paths funciona sem baseUrl explícito.',
    example: '"baseUrl": "./src"  // imports a partir de src/',
  },

  // Emit
  {
    category: 'Emit',
    command: '"target": "ES2022"',
    description: 'Versão do ECMAScript que o TS deve emitir. ES2022 cobre features modernas (top-level await, error.cause, .at(), Object.hasOwn). Para libs publicadas, considere ES2017/2020 para compatibilidade.',
    flags: [
      { flag: 'ES5',     description: 'IE11 (não recomendado em 2024+).' },
      { flag: 'ES2017',  description: 'async/await nativo. Compatibilidade ampla.' },
      { flag: 'ES2020',  description: '?.optional chaining, ??nullish coalescing, BigInt.' },
      { flag: 'ES2022',  description: 'Top-level await, .at(), Object.hasOwn, error.cause.' },
      { flag: 'ESNext',  description: 'Última versão suportada. Para apps internos.' },
    ],
    example: '"target": "ES2022"  // apps modernos\n"target": "ES2017"  // libs amplamente compatíveis',
  },
  {
    category: 'Emit',
    command: '"declaration": true',
    description: 'Gera arquivos .d.ts (type definitions) ao lado dos .js. Essencial para libs publicadas no npm. Consumidores ganham tipos sem precisar instalar @types/foo.',
    example: '"declaration": true,\n"declarationMap": true   // source maps para .d.ts (go-to-definition pula para o source)',
  },
  {
    category: 'Emit',
    command: '"outDir": "./dist"',
    description: 'Diretório onde o tsc emite os arquivos compilados. Mantém src/ limpo e dist/ versionável separadamente. Sempre adicione dist/ ao .gitignore.',
    example: '"outDir": "./dist",\n"rootDir": "./src"   // garante que src é a raiz lógica',
  },
  {
    category: 'Emit',
    command: '"isolatedModules": true',
    description: 'Cada arquivo é compilado isoladamente (sem cross-file analysis). Necessário para bundlers que processam um arquivo por vez (esbuild, swc, Babel). Bloqueia algumas features (const enum, namespace export).',
    example: '"isolatedModules": true   // necessário para Vite, Next.js, esbuild',
  },
  {
    category: 'Emit',
    command: '"verbatimModuleSyntax": true',
    description: 'TS 5.0+. Substitui importsNotUsedAsValues + preserveValueImports. Imports tipo-only ficam separados (import type), runtime imports preservados como escritos. Mais previsível para bundlers.',
    example: 'import type { Foo } from "./types"   // apagado em runtime\nimport { bar } from "./util"          // preservado',
  },

  // JSX (React)
  {
    category: 'JSX',
    command: '"jsx": "preserve"',
    description: 'Como tratar JSX. preserve emite .jsx para o bundler processar (Vite, Next.js fazem isso). react-jsx (TS 4.1+) emite chamadas ao novo runtime do React 17+.',
    flags: [
      { flag: 'preserve',     description: 'Emite .jsx para bundler. Para Next.js, Vite (deixa Babel/SWC processar).' },
      { flag: 'react',        description: 'Emite React.createElement. Modo legado.' },
      { flag: 'react-jsx',    description: 'TS 4.1+. Usa o novo JSX transform (sem precisar import React).' },
      { flag: 'react-jsxdev', description: 'Variante do react-jsx para development.' },
    ],
    example: '"jsx": "preserve"   // Next.js\n"jsx": "react-jsx"  // CRA, Vite com novo runtime',
  },

  // Interop
  {
    category: 'Interop',
    command: '"esModuleInterop": true',
    description: 'Permite import default de módulos CommonJS sem casting. Sem essa flag, você precisa import * as x. Praticamente sempre ative — é convenção moderna.',
    example: '// Com esModuleInterop:\nimport React from "react"  // ok\n\n// Sem:\nimport * as React from "react"',
  },
  {
    category: 'Interop',
    command: '"skipLibCheck": true',
    description: 'Pula verificação de arquivos .d.ts em node_modules. Acelera builds drasticamente. Risco: type errors em libs externas passam despercebidos. Para apps, ative; para libs, desligue.',
    example: '"skipLibCheck": true   // apps (recomendado por velocidade)\n"skipLibCheck": false  // libs publicadas (rigor maior)',
  },
  {
    category: 'Interop',
    command: '"allowJs": true',
    description: 'Permite que arquivos .js sejam parte do projeto TS. Útil em migrações graduais de JS → TS. Combinado com checkJs, valida JSDoc em arquivos JS.',
    example: '"allowJs": true,\n"checkJs": true   // valida JSDoc em .js',
    danger: false,
  },

  // Performance
  {
    category: 'Performance',
    command: '"incremental": true',
    description: 'Salva informação de build entre execuções (.tsbuildinfo). Builds subsequentes são MUITO mais rápidos (apenas arquivos mudados são recompilados). Combine com composite + project references.',
    example: '"incremental": true,\n"tsBuildInfoFile": "./.tsbuildinfo"',
  },
  {
    category: 'Performance',
    command: '"composite": true',
    description: 'Habilita project references — divide um monorepo em sub-projetos com builds independentes. Cada projeto compila isolado e referência outros. Acelera CI em codebases grandes.',
    example: '// tsconfig.json (raiz)\n"references": [\n  { "path": "./packages/core" },\n  { "path": "./packages/api" }\n]',
  },
]

// ── Dados: TS Errors Reference (ErrorRefPdf) ───────────────────────────────────

const TS_ERRORS: ErrorEntry[] = [
  {
    category: 'Atribuição (Assignment)',
    title: 'TS2322 — Type X is not assignable to type Y',
    errorMessage: "Type 'string' is not assignable to type 'number'.",
    cause: 'Você está atribuindo um valor a uma variável/campo de tipo incompatível. O erro mais comum do TypeScript. Pode acontecer com tipos primitivos, objetos com campos divergentes, ou unions com membros que não se intersectam.',
    solution: 'Verifique a fonte do tipo errado. Quase nunca a solução é cast (as) — corrija a raiz: ajuste a anotação, complete o objeto ou narrowe a union antes da atribuição.',
    code: {
      broken: `let n: number = 0
n = "10"  // TS2322: string não é number

interface User { id: string }
const u: User = { id: 123 }  // TS2322: number não é string`,
      fixed: `let n: number = 0
n = Number("10")  // explicit conversion

interface User { id: string }
const u: User = { id: "123" }`,
    },
    severity: 'critical',
    relatedErrors: ['TS2345', 'TS2741'],
  },
  {
    category: 'Atribuição (Assignment)',
    title: 'TS2345 — Argument of type X is not assignable to parameter of type Y',
    errorMessage: "Argument of type 'string | undefined' is not assignable to parameter of type 'string'.",
    cause: 'Você está passando um argumento que pode ser de tipo mais amplo que o parâmetro espera. Comum quando passa-se um valor que pode ser undefined para uma função que exige string definida.',
    solution: 'Narrowe o argumento antes de passar (if, ??, !), ou ajuste a assinatura da função para aceitar o tipo amplo. Evite ! a menos que você comprove o invariante.',
    code: {
      broken: `function greet(name: string) { return \`Hello \${name}\` }
const user: { name?: string } = {}
greet(user.name)  // TS2345: name é string | undefined`,
      fixed: `function greet(name: string) { return \`Hello \${name}\` }
const user: { name?: string } = {}
if (user.name) greet(user.name)            // narrowing
greet(user.name ?? 'Anônimo')              // default
greet(user.name!)                          // assertion (use só se garantido)`,
    },
    severity: 'critical',
    relatedErrors: ['TS2322'],
  },
  {
    category: 'Atribuição (Assignment)',
    title: 'TS2741 — Property X is missing in type Y',
    errorMessage: "Property 'email' is missing in type '{ id: string; name: string; }' but required in type 'User'.",
    cause: 'Você criou um objeto que falta um campo obrigatório do tipo declarado. Geralmente acontece quando se esquece um campo durante refatoração ou ao criar um literal incompleto.',
    solution: 'Adicione o campo faltando. Se o campo é genuinamente opcional, marque-o com ? na interface. Se está sendo gerado em outro lugar, use Omit<User, "campo"> no contexto correto.',
    code: {
      broken: `interface User { id: string; name: string; email: string }
const u: User = { id: '1', name: 'Ana' }  // TS2741: email faltando`,
      fixed: `interface User { id: string; name: string; email: string }
const u: User = { id: '1', name: 'Ana', email: 'ana@x.com' }
// ou: marque email como opcional → email?: string`,
    },
    severity: 'critical',
    relatedErrors: ['TS2322'],
  },

  {
    category: 'Acesso (Property Access)',
    title: 'TS2339 — Property X does not exist on type Y',
    errorMessage: "Property 'foo' does not exist on type 'string'.",
    cause: 'Você está acessando uma propriedade que não existe no tipo. Pode ser typo, união sem narrowing (acessando antes de discriminar), ou tentativa de acessar campo de tipo unknown/any sem narrowing.',
    solution: 'Verifique typo. Se for union, narrowe antes do acesso. Se for unknown, use type guard ou assertion verificada. Evite resolver com as any — é tapar o sol com a peneira.',
    code: {
      broken: `function process(x: string | number) {
  return x.toUpperCase()  // TS2339: number não tem toUpperCase
}

const data: unknown = JSON.parse(input)
data.id  // TS2339: unknown não tem id`,
      fixed: `function process(x: string | number) {
  if (typeof x === 'string') return x.toUpperCase()
  return x.toFixed(2)  // narrowed para number
}

function isUser(x: unknown): x is { id: string } {
  return typeof x === 'object' && x !== null && 'id' in x
}
const data: unknown = JSON.parse(input)
if (isUser(data)) data.id  // ok`,
    },
    severity: 'critical',
    relatedErrors: ['TS2367', 'TS2532'],
  },
  {
    category: 'Acesso (Property Access)',
    title: 'TS2532 — Object is possibly undefined',
    errorMessage: "Object is possibly 'undefined'.",
    cause: 'Você está acessando uma propriedade ou método de uma referência que pode ser undefined. Aparece com strictNullChecks ativo (parte de strict). Comum em arr.find(), arr[i] (com noUncheckedIndexedAccess), maps e fields opcionais.',
    solution: 'Use optional chaining (?.), narrowing com if, nullish coalescing (??) ou non-null assertion (!) se você comprovou que não é nulo. Em arrays com índices, prefira find/filter ou checagem explícita.',
    code: {
      broken: `const arr = [1, 2, 3]
const item = arr.find(x => x > 5)
console.log(item.toFixed(2))  // TS2532: item pode ser undefined`,
      fixed: `const arr = [1, 2, 3]
const item = arr.find(x => x > 5)
if (item !== undefined) console.log(item.toFixed(2))  // narrowing
console.log(item?.toFixed(2) ?? 'sem item')           // optional chaining
console.log(item!.toFixed(2))                         // assertion (só se comprovado)`,
    },
    severity: 'warning',
    relatedErrors: ['TS18048'],
  },
  {
    category: 'Acesso (Property Access)',
    title: 'TS18048 — X is possibly undefined',
    errorMessage: "'foo' is possibly 'undefined'.",
    cause: 'Variante moderna do TS2532, com mensagem mais específica. Geralmente aparece em destructuring, retorno de função opcional, ou acessos encadeados onde TypeScript não pode garantir presença.',
    solution: 'Mesma estratégia de TS2532: narrowing, ?., ?? ou !. Em codebases novos, considere ativar exactOptionalPropertyTypes para mais rigor.',
    code: {
      broken: `function getEnv(key: string): string | undefined { return process.env[key] }
const apiUrl = getEnv('API_URL')
fetch(apiUrl)  // TS18048: apiUrl pode ser undefined`,
      fixed: `function getEnv(key: string): string | undefined { return process.env[key] }
const apiUrl = getEnv('API_URL') ?? 'http://localhost'
fetch(apiUrl)`,
    },
    severity: 'warning',
    relatedErrors: ['TS2532'],
  },

  {
    category: 'Generics',
    title: 'TS2589 — Type instantiation is excessively deep and possibly infinite',
    errorMessage: 'Type instantiation is excessively deep and possibly infinite.',
    cause: 'Um tipo recursivo (DeepReadonly, DeepPartial, type-level ops) está se expandindo além do limite do compilador (50 níveis por padrão). Pode ser recursão infinita (bug) ou estrutura genuinamente profunda.',
    solution: 'Adicione condição de parada explícita no recursivo. Use tail-recursion (T extends ... ? ... : T) em vez de recursão aninhada. Em casos extremos, divida o tipo em duas etapas.',
    code: {
      broken: `// Recursão sem proteção:
type Flat<T> = T extends Array<infer U> ? Flat<U> : T
type X = Flat<number[][][][][][][]>  // TS2589`,
      fixed: `// Com profundidade limitada:
type Flat<T, D extends number = 5> = D extends 0
  ? T
  : T extends Array<infer U>
    ? Flat<U, Prev<D>>
    : T

// Ou condição explícita:
type Flat2<T> = T extends ReadonlyArray<infer U> ? Flat2<U> : T  // tail-recursive`,
    },
    severity: 'critical',
    relatedErrors: ['TS2321'],
  },
  {
    category: 'Generics',
    title: 'TS2769 — No overload matches this call',
    errorMessage: 'No overload matches this call. Overload 1 of 3, ... Overload 2 of 3, ...',
    cause: 'Você está chamando uma função com overloads e nenhuma das assinaturas combina exatamente com seus argumentos. Cada overload é tentado em ordem; se nenhuma casa, este erro aparece com a lista de tentativas.',
    solution: 'Leia a primeira overload na mensagem — geralmente é a mais usada. Ajuste seu argumento para casar. Se está usando libs (RxJS, jQuery), confira docs da função — overloads costumam ter ordens específicas de argumento.',
    code: {
      broken: `function fetch2(url: string): Promise<Response>
function fetch2(url: string, init: RequestInit): Promise<Response>
function fetch2(url: string, init?: RequestInit): Promise<Response> { /* ... */ return null as any }

fetch2()  // TS2769: nenhuma overload aceita zero argumentos`,
      fixed: `fetch2('/api/users')                         // ok — overload 1
fetch2('/api/users', { method: 'POST' })     // ok — overload 2`,
    },
    severity: 'critical',
    relatedErrors: ['TS2345'],
  },
  {
    category: 'Generics',
    title: 'TS2344 — Type X does not satisfy the constraint Y',
    errorMessage: "Type 'string' does not satisfy the constraint '{ id: string }'.",
    cause: 'Você está passando um argumento de tipo a um generic com constraint, mas o tipo passado não satisfaz a restrição. Comum em utility types customizados ou ao usar libs com generics restritivos.',
    solution: 'Ajuste o tipo passado para satisfazer a constraint. Se a constraint é forte demais, considere relaxá-la. Se você não controla o generic, encontre uma forma de moldar seu tipo.',
    code: {
      broken: `function findById<T extends { id: string }>(items: T[], id: string) {
  return items.find(i => i.id === id)
}
findById<string>([], 'x')  // TS2344: string não tem id`,
      fixed: `findById<{ id: string; name: string }>([{ id: '1', name: 'Ana' }], '1')`,
    },
    severity: 'critical',
    relatedErrors: ['TS2345'],
  },

  {
    category: 'Módulos & Imports',
    title: 'TS2304 — Cannot find name X',
    errorMessage: "Cannot find name 'fetch'.",
    cause: 'O símbolo (variável, função, tipo) não foi importado, ou as types globais necessárias não estão disponíveis. Comum com APIs do browser em projetos Node, ou vice-versa.',
    solution: 'Importe o símbolo se for de outro módulo. Adicione "lib": ["DOM"] em tsconfig se for API de browser. Para Node, instale @types/node. Se for tipo seu, verifique se está exportado.',
    code: {
      broken: `// tsconfig sem lib: ["DOM"]
const res = await fetch('/api')  // TS2304: Cannot find name 'fetch'`,
      fixed: `// tsconfig.json:
// "lib": ["ES2022", "DOM"]
const res = await fetch('/api')   // ok com lib DOM
// ou: import fetch from 'node-fetch'`,
    },
    severity: 'critical',
    relatedErrors: ['TS2305', 'TS7016'],
  },
  {
    category: 'Módulos & Imports',
    title: 'TS2307 — Cannot find module X',
    errorMessage: "Cannot find module 'foo' or its corresponding type declarations.",
    cause: 'O caminho do import não resolve. Pode ser typo, biblioteca não instalada, ou falta de declaração de tipos (@types/foo). Também pode ocorrer com aliases de paths mal configurados.',
    solution: 'Verifique se a lib está instalada (npm i foo). Para libs sem types, instale @types/foo ou crie um declare module "foo" em src/global.d.ts. Confira tsconfig paths e baseUrl.',
    code: {
      broken: `import x from 'lodash'  // TS2307 se @types/lodash não instalado`,
      fixed: `// terminal:
// npm i lodash @types/lodash

import x from 'lodash'   // ok

// ou para libs sem types:
// src/global.d.ts:
// declare module 'untyped-lib'`,
    },
    severity: 'critical',
    relatedErrors: ['TS7016'],
  },
  {
    category: 'Módulos & Imports',
    title: 'TS1259 — Module X can only be default-imported using esModuleInterop',
    errorMessage: "Module 'fs' can only be default-imported using the 'esModuleInterop' flag.",
    cause: 'Você está fazendo default import de um módulo CommonJS sem ter esModuleInterop ativo. CommonJS exporta um objeto, não um valor default — TypeScript exige a flag para fazer a interop.',
    solution: 'Ative "esModuleInterop": true em tsconfig.json. Esta é convenção moderna — quase todos os projetos têm. Alternativamente, use import * as ou import { x } where applicable.',
    code: {
      broken: `// tsconfig sem esModuleInterop
import fs from 'fs'  // TS1259`,
      fixed: `// tsconfig.json:
// "esModuleInterop": true
import fs from 'fs'  // ok`,
    },
    severity: 'warning',
    relatedErrors: ['TS2307'],
  },

  {
    category: 'Tipos Avançados',
    title: 'TS2367 — This comparison appears to be unintentional',
    errorMessage: "This comparison appears to be unintentional because the types 'string' and '\"admin\"' have no overlap.",
    cause: 'Você está comparando dois tipos que não têm overlap — não há valor que satisfaça ambos. Geralmente indica typo em literal ou narrowing já realizado anteriormente.',
    solution: 'Verifique se o literal está correto. Se o tipo já foi narrowed para excluir aquele caso, remova a comparação inalcançável. Em discriminated unions, garanta que está testando o discriminant correto.',
    code: {
      broken: `function check(role: 'admin' | 'user') {
  if (role === 'super')  // TS2367: 'super' nunca casa
    console.log('super')
}`,
      fixed: `function check(role: 'admin' | 'user' | 'super') {
  if (role === 'super')  // ok agora
    console.log('super')
}`,
    },
    severity: 'warning',
    relatedErrors: ['TS2339'],
  },
  {
    category: 'Tipos Avançados',
    title: 'TS2540 — Cannot assign to X because it is a read-only property',
    errorMessage: "Cannot assign to 'id' because it is a read-only property.",
    cause: 'Você está tentando mutar um campo marcado como readonly. Pode ser explícito (readonly id) ou implícito via Readonly<T>, as const, ou returnedTypes de hooks/state que tipam o retorno como imutável.',
    solution: 'Crie um novo objeto em vez de mutar (spread + override). Se o readonly não faz sentido, remova a marcação. Em Redux/Zustand, sempre use estado imutável — readonly é a convenção certa.',
    code: {
      broken: `interface User { readonly id: string; name: string }
const u: User = { id: '1', name: 'Ana' }
u.id = '2'  // TS2540: id é readonly`,
      fixed: `// Crie novo objeto:
const u2: User = { ...u, id: '2' }   // ok

// Ou: Object.assign({}, u, { id: '2' })
// Ou: structured clone se for deep update`,
    },
    severity: 'warning',
    relatedErrors: ['TS2542'],
  },
  {
    category: 'Tipos Avançados',
    title: 'TS2418 — Type of computed property name must be of type X',
    errorMessage: "Type of computed property's value is 'string | number', which is not assignable to type 'string | number | symbol'.",
    cause: 'Você está usando uma chave computada em um literal de objeto, mas o tipo da chave não é assignable a string | number | symbol (os tipos válidos para chaves de objeto JS).',
    solution: 'Garanta que a expressão da chave seja string, number ou symbol. Se está vindo de uma união, narrowe antes; se é unknown, valide antes de usar como chave.',
    code: {
      broken: `function makeMap(key: string | string[]) {
  return { [key]: 1 }  // TS2418 se key for unknown union complexa
}`,
      fixed: `function makeMap(key: string | string[]) {
  if (Array.isArray(key)) return { [key[0]]: 1 }
  return { [key]: 1 }  // narrowing
}`,
    },
    severity: 'warning',
  },

  {
    category: 'Configuração',
    title: 'TS5023 — Unknown compiler option X',
    errorMessage: "Unknown compiler option 'foo'.",
    cause: 'Você escreveu uma flag de tsconfig que não existe ou foi removida na versão atual do TypeScript. Pode ser typo, flag obsoleta, ou flag de versão futura usada em versão antiga.',
    solution: 'Verifique a documentação oficial em typescriptlang.org/tsconfig. Confirme a versão do TS instalada (npx tsc --version). Flags obsoletas em versões novas devem ser removidas.',
    code: {
      broken: `// tsconfig.json:
{
  "compilerOptions": {
    "strick": true   // typo: TS5023: Unknown 'strick'
  }
}`,
      fixed: `{
  "compilerOptions": {
    "strict": true   // ok
  }
}`,
    },
    severity: 'info',
  },
  {
    category: 'Configuração',
    title: 'TS6133 — X is declared but its value is never read',
    errorMessage: "'foo' is declared but its value is never read.",
    cause: 'Você importou ou declarou algo que não é usado. Aparece com noUnusedLocals ou noUnusedParameters ativos. Em geral é warning útil para limpar código morto.',
    solution: 'Remova o código não usado. Em casos de parâmetros que devem existir por contrato (callbacks com assinatura fixa), prefixe com _ (_unused) ou desligue a flag para arquivo específico via @ts-ignore.',
    code: {
      broken: `// noUnusedLocals: true
import { foo, bar } from './util'
console.log(foo)  // TS6133 em bar`,
      fixed: `import { foo } from './util'  // remove bar

// Ou para parâmetros:
function handler(_event: Event, data: Data) { /* só usa data */ }`,
    },
    severity: 'info',
  },
]

// ── Dados: Mnemônicos ─────────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'Generics — pilares do design',
    trick: 'PURE',
    expansion: [
      ['P', 'Paramétrico — recebe tipo como parâmetro, não fixa antecipadamente'],
      ['U', 'Utilizável em múltiplos contextos sem perder type safety'],
      ['R', 'Reutilizável em libs, hooks e utils — uma definição, vários usos'],
      ['E', 'Extensível via constraints (T extends ...) — contratos mínimos'],
    ],
    explanation: 'Generics existem para preservar a relação entre tipos de entrada e saída. Sem generic, function first(arr: any[]) perde o tipo. Com generic, function first<T>(arr: T[]): T | undefined preserva. Constraints adicionam garantias mínimas sem fixar a forma exata.',
    example: '// Sem generic\nfunction first(arr: any[]): any\n\n// Com generic\nfunction first<T>(arr: T[]): T | undefined\n\n// Com constraint\nfunction findById<T extends { id: string }>(items: T[], id: string)',
    why: 'O acrônimo PURE captura os 4 propósitos do generic. Sempre que escrever uma função utilitária, pergunte: vou perder informação de tipo? Se sim, generic é a resposta.',
  },
  {
    label: 'Narrowing — formas de afinar tipo',
    trick: 'SCAN',
    expansion: [
      ['S', 'typeof Strings/numbers/booleans — para primitivos'],
      ['C', 'instanceof Class — para instâncias de classe (Date, Error)'],
      ['A', 'AssertioN — type predicate (x is T) ou asserts function'],
      ['N', 'iN — propriedade no objeto ("id" in obj) ou discriminated union'],
    ],
    explanation: 'Narrowing é o coração do sistema de tipos do TypeScript. SCAN cobre as 4 formas principais: typeof para primitivos, instanceof para classes, predicates/asserts para lógica custom e in/discriminated para presença de campo. Sempre que receber unknown ou union, faça SCAN.',
    example: 'if (typeof x === "string") {} // S\nif (x instanceof Date) {} // C\nif (isUser(x)) {} // A — predicate\nif ("id" in obj) {} // N',
    why: 'Reduzir 7+ formas de narrowing a 4 letras dá ferramenta de diagnóstico rápida. Quando não compila, pergunte: qual SCAN aplicar aqui?',
  },
  {
    label: 'Utility types — top 3 essenciais',
    trick: 'TOP',
    expansion: [
      ['T', 'Type derivation — Partial, Required, Readonly transformam um tipo'],
      ['O', 'Omit — remove campos para criar Create/Update DTOs'],
      ['P', 'Pick — seleciona campos específicos (Preview, ListItem)'],
    ],
    explanation: 'Os utility types do dia a dia caem em três categorias. Type derivation muda modificadores (?, readonly) sem alterar campos. Omit remove campos. Pick seleciona. Junte com Partial/Required para gerar todos os DTOs a partir de uma única fonte de verdade.',
    example: 'type User = { id: string; name: string; email: string }\ntype Create = Omit<User, "id">\ntype Update = Partial<Pick<User, "name" | "email">>\ntype Preview = Pick<User, "id" | "name">',
    why: 'TOP é o atalho mental para "como gero meus DTOs sem duplicar". Em qualquer entidade, pense em CRUD e aplique a combinação certa.',
  },
  {
    label: 'unknown vs any vs never',
    trick: 'UAN',
    expansion: [
      ['U', 'Unknown — aceita tudo, exige verificação (uso correto)'],
      ['A', 'Any — desliga checks (uso emergencial, não habitual)'],
      ['N', 'Never — nada cabe (exhaustive check, throw)'],
    ],
    explanation: 'A regra: receba unknown, evite any, use never em exhaustive checks. Unknown é o universo seguro — aceita tudo mas força narrowing. Any é o opt-out total — só em migrações ou último recurso. Never é o vazio — útil em switch sem default tratado.',
    example: 'function parse(s: string): unknown { return JSON.parse(s) } // ✓\nfunction parseAny(s: string): any { ... } // ✗\nfunction _check(x: never): never { throw new Error() } // exhaustive',
    why: 'Memorizar UAN como hierarquia (segurança decrescente: unknown > never > any) elimina a confusão clássica entre os três e evita bugs silenciosos.',
  },
  {
    label: 'Quando NÃO anotar tipo',
    trick: 'UNCLE',
    expansion: [
      ['U', 'União inferida automaticamente — let s = "ok" | "error" não precisa anotar'],
      ['N', 'Nenhuma anotação quando TS já sabe — variáveis inicializadas, retornos simples'],
      ['C', 'Const assertions para literais — as const preserva precisão'],
      ['L', 'Literais preservados com satisfies — validar sem alargar'],
      ['E', 'Evite any — prefira unknown como fallback'],
    ],
    explanation: 'Bons projetos TypeScript têm menos anotações do que iniciantes esperam. Anote apenas quando o TS não consegue inferir (parâmetros de função, contratos de API) ou quando a anotação é documentação intencional. Confie na inferência.',
    example: 'const nome = "Daniel"          // string — não precisa anotar\nfunction dobra(n: number) {     // anote params\n  return n * 2                  // retorno inferido\n}',
    why: 'UNCLE evita o anti-pattern de anotar tudo. Anotação demais polui o código e duplica informação. Cada letra do mnemônico cobre uma situação onde inferência é melhor que anotação.',
  },
]

// ── Dados: Anti-patterns ──────────────────────────────────────────────────────────

const KW  = '#f87171'   // keywords erradas — red
const KWG = '#4ade80'   // keywords corretas — green
const STR = '#fcd34d'   // strings
const FN  = '#93c5fd'   // funções

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'any em vez de unknown',
    badDesc: 'Receber any em uma função desliga toda verificação. data.foo.bar() compila mas crasha em runtime se o objeto não tiver essa estrutura.',
    badCode: [
      { t: 'function', c: KW }, { t: ' parse(s: ' }, { t: 'string', c: KW }, { t: '): ' }, { t: 'any', c: KW }, { t: ' { return JSON.parse(s) }\n' },
      { t: 'const', c: KW }, { t: ' data = parse(input)\n' },
      { t: 'data.foo.bar() ', c: KW }, { t: '// crash em runtime se data não tiver foo', c: '#94a3b8' },
    ],
    goodDesc: 'unknown aceita qualquer valor mas força narrowing antes de usar. Combine com type predicate ou schema (zod) para validar de verdade.',
    goodCode: [
      { t: 'function', c: KWG }, { t: ' parse(s: ' }, { t: 'string', c: KWG }, { t: '): ' }, { t: 'unknown', c: KWG }, { t: ' { return JSON.parse(s) }\n' },
      { t: 'const', c: KWG }, { t: ' data = parse(input)\n' },
      { t: 'if (', c: KWG }, { t: 'isUser', c: FN }, { t: '(data)) data.foo() ', c: KWG }, { t: '// narrowed', c: '#94a3b8' },
    ],
    why: 'any apaga toda informação de tipo — qualquer operação compila mas pode crashar em runtime. unknown obriga verificação explícita. Em boundaries (fetch, JSON.parse, catch, postMessage), sempre comece com unknown e narrowe antes de usar.',
  },
  {
    title: 'Type assertion sem verificação',
    badDesc: 'as User é uma promessa não verificada — TypeScript confia em você sem checar. Se data não for User na realidade, o erro vai aparecer só em runtime.',
    badCode: [
      { t: 'function', c: KW }, { t: ' processar(data: ' }, { t: 'unknown', c: KW }, { t: ') {\n' },
      { t: '  const', c: KW }, { t: ' user = data ' }, { t: 'as', c: KW }, { t: ' User\n' },
      { t: '  return user.name.toUpperCase() ', c: KW }, { t: '// crash se data inválido', c: '#94a3b8' },
      { t: '}\n' },
    ],
    goodDesc: 'Type predicate (x is User) verifica a forma de verdade e dá narrowing real. O compilador sabe que dentro do if x é seguro.',
    goodCode: [
      { t: 'function', c: KWG }, { t: ' isUser(x: ' }, { t: 'unknown', c: KWG }, { t: '): x ' }, { t: 'is', c: KWG }, { t: ' User {\n' },
      { t: '  return ', c: KWG }, { t: 'typeof', c: KWG }, { t: ' x === ' }, { t: '"object"', c: STR }, { t: ' && x !== ' }, { t: 'null', c: KWG }, { t: ' && ' }, { t: '"name"', c: STR }, { t: ' in x\n' },
      { t: '}\n' },
      { t: 'if (', c: KWG }, { t: 'isUser', c: FN }, { t: '(data)) data.name.toUpperCase() ', c: KWG }, { t: '// seguro', c: '#94a3b8' },
    ],
    why: 'Type assertion (as) é apenas uma promessa ao compilador — ele aceita sem verificar. Se a forma real diverge, bug em runtime. Type predicates fazem a verificação real e dão narrowing legítimo.',
  },
  {
    title: '@ts-ignore como solução',
    badDesc: '@ts-ignore silencia o erro mas não corrige nada — o problema continua, só fica invisível. Após semanas, ninguém sabe por que aquela linha tem comentário.',
    badCode: [
      { t: '// erro: Property "user" does not exist on Request\n', c: '#94a3b8' },
      { t: '// @ts-ignore\n', c: KW },
      { t: 'req.user.id ', c: KW }, { t: '// silencia mas não resolve', c: '#94a3b8' },
    ],
    goodDesc: 'Augmente o tipo via declaration merging. Funciona com Express Request, Window, process.env, qualquer namespace.',
    goodCode: [
      { t: '// types/express.d.ts\n', c: '#94a3b8' },
      { t: 'declare', c: KWG }, { t: ' namespace ', c: KWG }, { t: 'Express', c: FN }, { t: ' {\n' },
      { t: '  interface', c: KWG }, { t: ' Request { user?: AuthUser }\n' },
      { t: '}\n' },
      { t: 'req.user?.id ', c: KWG }, { t: '// tipado de verdade', c: '#94a3b8' },
    ],
    why: '@ts-ignore mascara problemas em vez de resolvê-los. Declaration merging é a solução estrutural — você adiciona o que falta no tipo da biblioteca sem fork. Se o tipo mudar, o erro reaparece.',
  },
  {
    title: 'enum numérico em vez de union',
    badDesc: 'enum numérico gera código JS extra (objeto bidirecional) e os valores 0/1/2 não dizem nada em logs ou debug. Status.Loading === 1 não tem semântica.',
    badCode: [
      { t: 'enum', c: KW }, { t: ' Status { Idle, Loading, Success, Error }\n' },
      { t: 'log(Status.Loading) ', c: KW }, { t: '// imprime: 1', c: '#94a3b8' },
      { t: '// + objeto JS extra no bundle\n', c: '#94a3b8' },
    ],
    goodDesc: 'Union de strings literais tem zero overhead, é serializável, debug-friendly e funciona com discriminated unions automaticamente.',
    goodCode: [
      { t: 'type', c: KWG }, { t: ' Status = ' }, { t: '"idle"', c: STR }, { t: ' | ' }, { t: '"loading"', c: STR }, { t: ' | ' }, { t: '"success"', c: STR }, { t: ' | ' }, { t: '"error"', c: STR }, { t: '\n' },
      { t: 'log("loading") ', c: KWG }, { t: '// imprime: loading', c: '#94a3b8' },
      { t: '// zero JS extra, narrowing automático\n', c: '#94a3b8' },
    ],
    why: 'Enum numérico cria runtime overhead e perde semântica. Union de strings preserva o nome em runtime, gera narrowing automático em switch e não cresce o bundle. Use const enum apenas se tiver constraints específicas (e cuidado com isolatedModules).',
  },
  {
    title: 'Interface vazia { }',
    badDesc: 'Interface vazia ou {} aceita qualquer coisa não-nula — primitivos, funções, arrays. Quase nunca é o que você quer e elimina type safety silenciosamente.',
    badCode: [
      { t: 'interface', c: KW }, { t: ' Empty {}\n' },
      { t: 'function', c: KW }, { t: ' fn(x: Empty) {}\n' },
      { t: 'fn(', c: KW }, { t: '42', c: STR }, { t: ')        ', c: KW }, { t: '// passa', c: '#94a3b8' },
      { t: 'fn(', c: KW }, { t: '"texto"', c: STR }, { t: ')   ', c: KW }, { t: '// passa', c: '#94a3b8' },
    ],
    goodDesc: 'Use Record<string, unknown> para objetos genéricos com chaves string ou unknown se você quer aceitar qualquer valor de forma segura.',
    goodCode: [
      { t: 'type', c: KWG }, { t: ' AnyObject = Record<' }, { t: 'string', c: KWG }, { t: ', ' }, { t: 'unknown', c: KWG }, { t: '>\n' },
      { t: 'function', c: KWG }, { t: ' fn(x: AnyObject) {\n' },
      { t: '  for (', c: KWG }, { t: 'const', c: KWG }, { t: ' k ' }, { t: 'in', c: KWG }, { t: ' x) log(x[k]) ', c: KWG }, { t: '// ok', c: '#94a3b8' },
      { t: '}\n' },
    ],
    why: '{} significa "qualquer não-nulo" no TypeScript — e isso inclui primitivos, funções, números. Você perde garantias estruturais. Record<string, unknown> diz "objeto com chaves string" e dá index signature útil.',
  },
  {
    title: 'Non-null assertion (!) abusivo',
    badDesc: 'O operador ! diz "confie em mim, não é null" sem verificação. Se você está errado, crash em runtime. Acumular ! no código é sinal de tipos mal modelados.',
    badCode: [
      { t: 'const', c: KW }, { t: ' user = users.find(u => u.id === id)\n' },
      { t: 'log(user', c: KW }, { t: '!', c: KW }, { t: '.email', c: KW }, { t: '!', c: KW }, { t: '.toLowerCase()) ', c: KW }, { t: '// crash possível', c: '#94a3b8' },
    ],
    goodDesc: 'Faça narrowing real com if. Trate o caso null/undefined explicitamente — UX melhor (mensagem de erro, fallback) e zero risco de crash.',
    goodCode: [
      { t: 'const', c: KWG }, { t: ' user = users.find(u => u.id === id)\n' },
      { t: 'if (!user) ', c: KWG }, { t: 'throw', c: KWG }, { t: ' ' }, { t: 'new', c: KWG }, { t: ' Error(' }, { t: '"User não encontrado"', c: STR }, { t: ')\n' },
      { t: 'if (!user.email) ', c: KWG }, { t: 'return', c: KWG }, { t: ' ' }, { t: 'null', c: KWG }, { t: '\n' },
      { t: 'log(user.email.toLowerCase()) ', c: KWG }, { t: '// seguro', c: '#94a3b8' },
    ],
    why: '! desliga checagem de null/undefined sem garantia real. Em vez disso, narrowe explicitamente — você ganha melhor UX (pode logar erro ou retornar fallback) e elimina uma classe de runtime errors. Reserve ! para casos onde você comprovadamente garantiu (e.g., ref após mount).',
  },
  {
    title: 'Generic desnecessário',
    badDesc: 'function id<T>(x: T): T parece flexível, mas é exatamente igual a function id(x: unknown): unknown — a relação entre input e output só importa se você USA T. Adicionar T sem motivo polui a assinatura.',
    badCode: [
      { t: 'function', c: KW }, { t: ' log<' }, { t: 'T', c: KW }, { t: '>(x: T): ' }, { t: 'void', c: KW }, { t: ' {\n' },
      { t: '  console.log(x)\n' },
      { t: '}\n' },
      { t: '// T nunca é usado em retorno — generic supérfluo', c: '#94a3b8' },
    ],
    goodDesc: 'Use generic apenas quando há relação real entre tipos. Se T só aparece no parâmetro, use unknown ou um tipo concreto.',
    goodCode: [
      { t: 'function', c: KWG }, { t: ' log(x: ' }, { t: 'unknown', c: KWG }, { t: '): ' }, { t: 'void', c: KWG }, { t: ' {\n' },
      { t: '  console.log(x)\n' },
      { t: '}\n' },
      { t: '// generic legítimo:\n', c: '#94a3b8' },
      { t: 'function', c: KWG }, { t: ' first<' }, { t: 'T', c: KWG }, { t: '>(arr: T[]): T | ' }, { t: 'undefined', c: KWG }, { t: ' { return arr[0] }\n' },
    ],
    why: 'Generic existe para preservar a relação entre tipos. Se T não aparece em mais de um lugar com significado, é só ruído na assinatura. Pergunte: se eu remover o generic, perco informação de tipo? Se não, não use generic.',
  },
  {
    title: 'object em vez de Record',
    badDesc: 'object (lowercase) só garante "não-primitivo" — sem index signature. Você não consegue iterar nem acessar propriedades por chave dinâmica.',
    badCode: [
      { t: 'function', c: KW }, { t: ' logKeys(o: ' }, { t: 'object', c: KW }, { t: ') {\n' },
      { t: '  for (', c: KW }, { t: 'const', c: KW }, { t: ' k ' }, { t: 'in', c: KW }, { t: ' o) {\n' },
      { t: '    console.log(o[', c: KW }, { t: 'k', c: KW }, { t: ']) ', c: KW }, { t: '// erro: index signature', c: '#94a3b8' },
      { t: '  }\n' },
      { t: '}\n' },
    ],
    goodDesc: 'Use Record<string, unknown> para objetos com chaves string e valores desconhecidos. Index signature está presente — iteração e acesso dinâmico funcionam.',
    goodCode: [
      { t: 'function', c: KWG }, { t: ' logKeys(o: Record<' }, { t: 'string', c: KWG }, { t: ', ' }, { t: 'unknown', c: KWG }, { t: '>) {\n' },
      { t: '  for (', c: KWG }, { t: 'const', c: KWG }, { t: ' k ' }, { t: 'in', c: KWG }, { t: ' o) {\n' },
      { t: '    console.log(o[k]) ', c: KWG }, { t: '// ok — index signature presente', c: '#94a3b8' },
      { t: '  }\n' },
      { t: '}\n' },
    ],
    why: 'object é um "bottom" útil quase nunca — só garante que não é primitivo. Record<string, unknown> diz "objeto com chaves string e valores não verificados" — útil para logging, serialização e iteração genérica.',
  },
]

// ── Registry de Builders ──────────────────────────────────────────────────────────

const PDF_BUILDERS: Record<string, PdfBuilderFn> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'TypeScript',
    stackLabel: 'TypeScript 5.x',
    badgeLabel: 'Q&A Review',
    coverTitle: 'As 20 perguntas mais cobradas em entrevista TypeScript',
    coverSubtitle: 'Respostas estruturadas para nível pleno e sênior. Use para revisão ativa: leia a pergunta, tente responder de cabeça, depois confira.',
  }),

  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'TypeScript',
    accentColor: C,
    stackLabel: 'TypeScript 5.x',
    coverTitle: 'Tipos, narrowing, modificadores e padrões em uma referência',
    coverSubtitle: 'Referência densa em poucas páginas. Tipos primitivos, especiais, formas de narrowing, padrões e modelos mentais — tudo o que você precisa checar rapidamente.',
    sections: {
      hooks: PRIMITIVES,
      hooksExtra: SPECIAL_TYPES,
      depRows: NARROWING_ROWS,
      rules: TSCONFIG_RULES,
      performanceTips: TS_TIPS,
      patterns: TS_PATTERNS,
      mentalModels: TS_MENTAL_MODELS,
    },
  }),

  utility: () => buildComparativeRefPdf({
    options: UTILITY_OPTIONS,
    criteria: UTILITY_CRITERIA,
    scenarios: UTILITY_SCENARIOS,
    skillName: 'TypeScript',
    accentColor: C,
    stackLabel: 'TypeScript 5.x',
    coverTitle: 'Utility Types — Referência Comparativa',
  }),

  generics: () => buildPatternsPdf({
    patterns: GENERICS_PATTERNS,
    skillName: 'TypeScript',
    accentColor: C,
    stackLabel: 'TypeScript 5.x',
    coverTitle: 'Guia de Generics — do simples ao infer recursivo',
  }),

  tsconfig: () => buildCommandRefPdf({
    commands: TSCONFIG_FLAGS,
    skillName: 'TypeScript',
    accentColor: C,
    stackLabel: 'TypeScript 5.x',
    coverTitle: 'tsconfig.json — Referência completa de flags',
    coverSubtitle: 'Todas as flags que importam organizadas por categoria: strict mode, module resolution, emit, JSX, interop e performance. Cada flag com explicação, quando ativar e impacto.',
  }),

  errors: () => buildErrorRefPdf({
    errors: TS_ERRORS,
    skillName: 'TypeScript',
    accentColor: C,
    stackLabel: 'TypeScript 5.x',
    coverTitle: 'Erros do Compilador TypeScript — Diagnóstico Rápido',
  }),

  antipatterns: () => buildAntipatternsPdf({
    antipatterns: ANTIPATTERNS,
    accentColor: C,
    skillName: 'TypeScript',
    stackLabel: 'TypeScript 5.x',
    coverTitle: 'Os 8 erros que aparecem em code review de TypeScript',
    coverSubtitle: 'Cada anti-pattern com código errado x correto e a explicação técnica de por que quebra type safety. Reconhecimento de padrão é mais rápido que pensar do zero.',
  }),

  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'TypeScript',
    stackLabel: 'TypeScript 5.x',
    coverTitle: 'Os 5 truques que grudam TypeScript na memória',
    coverSubtitle: 'Associações verbais e visuais para generics (PURE), narrowing (SCAN), utility types (TOP), unknown/any/never (UAN) e quando NÃO anotar (UNCLE). Repita em voz alta — ancora melhor que ler.',
  }),
}

// ── Main Export ───────────────────────────────────────────────────────────────────

export default function TypescriptPdfs() {
  const [open, setOpen] = useState<PdfCard | null>(null)

  const featured = PDF_CARDS.find(c => c.featured)
  const collection = PDF_CARDS.filter(c => !c.featured)

  return (
    <div style={{ fontFamily: "'JetBrains Mono',monospace" }}>
      {/* Cabeçalho */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
          <p style={{ color: FG, fontSize: 16, fontWeight: 800, margin: 0, letterSpacing: 0.3 }}>TypeScript — Guias de bolso</p>
          <span style={{ color: C, fontSize: 11, padding: '3px 9px', borderRadius: 999, background: `${C}15`, border: `1px solid ${C}44`, fontWeight: 700 }}>
            {PDF_CARDS.length} PDFs · {PDF_CARDS.reduce((acc, c) => acc + c.pages, 0)} páginas
          </span>
        </div>
        <p style={{ color: FGMUTE, fontSize: 12, margin: 0, lineHeight: 1.65, maxWidth: 720 }}>
          Artefatos de revisão cognitiva específicos para TypeScript. Cada PDF cobre um aspecto único do sistema de tipos — utility types, generics progressivos, flags de tsconfig, erros do compilador, anti-patterns. Pensados para download offline e estudo focado.
        </p>
      </div>

      {/* Seção: Destaque */}
      {featured && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 10, color: C, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', fontFamily: "'JetBrains Mono',monospace" }}>
              Destaque
            </span>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${C}55, transparent)` }} />
          </div>
          <HeroCard card={featured} onOpen={() => setOpen(featured)} accent={C} />
        </div>
      )}

      {/* Seção: Coleção */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 10, color: C, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase' }}>
            Coleção · {collection.length} PDFs
          </span>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${C}55, transparent)` }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {collection.map(card => (
            <CollectionCard key={card.id} card={card} onOpen={() => setOpen(card)} accent={C} />
          ))}
        </div>
      </div>

      {open && <PdfModal card={open} onClose={() => setOpen(null)} builders={PDF_BUILDERS} />}
    </div>
  )
}
