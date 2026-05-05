import type { SkillContent } from '@/types'

const designPatterns: SkillContent = {
  tagline: 'Soluções recorrentes pra problemas de design — vocabulario comum entre devs.',
  why: 'Design patterns aparecem em entrevista de código e arquitetura. Senior precisa saber QUANDO usar (raro) e quando o pattern vira overkill ou anti-pattern. Decorar GoF não basta — entrevistador testa aplicação em problema real.',
  summary: 'Design patterns (Gang of Four e descendentes) são soluções reusaveis pra problemas comuns de design OO. Tres categorias: criacionais (Factory, Singleton, Builder), estruturais (Adapter, Decorator, Facade, Proxy), comportamentais (Strategy, Observer, Command, State). Útil como vocabulario de design — falar "Strategy" comunica em uma palavra. Risco: aplicar pattern por aplicar, complica código simples. Aplicar bem reduz complexidade; aplicar mal aumenta.',
  keypoints: [
    { title: 'Strategy', body: 'Define familia de algoritmos intercambiaveis. Use quando ha múltiplas formas de fazer a mesma coisa (calcular frete, validar pagamento). Evita if/switch gigante.' },
    { title: 'Factory / Abstract Factory', body: 'Encapsula criação de objetos. Útil quando criação e complexa, depende de configuração, ou precisa abstrair tipo concreto. Em DI moderno, container resolve maior parte do caso.' },
    { title: 'Decorator', body: 'Adiciona comportamento sem modificar a classe (logging, caching, retry em handler HTTP). Combina via composição. Express middleware e exemplo clássico.' },
    { title: 'Observer / Pub-Sub', body: 'Objeto notifica observadores em mudança. Base de event-driven, UI reativa, hooks. Cuidado com leak (esquecer de remover observer).' },
    { title: 'Adapter', body: 'Traduz interface entre dois sistemas. Útil pra integrar lib legada, API externa, biblioteca com interface diferente da que você quer. Em DDD, e o anti-corruption layer.' },
    { title: 'Singleton', body: 'Uma instância global. Famoso anti-pattern em código testável — esconde dependência, dificulta mock. DI container substitui melhor. Use só pra recurso realmente único (logger, config).' },
    { title: 'Repository', body: 'Abstrai persistência, expoe coleção de aggregates. Permite trocar storage e testar com mock. Padrão em DDD e Clean Architecture.' },
  ],
  gotchas: [
    'Aplicar pattern por aplicar — Factory pra criar objeto trivial, Strategy com uma só estratégia, Observer pra um listener só. Indireção sem ganho.',
    'Singleton em todo lugar — vira global state escondido, dificulta teste, gera bug em concorrência.',
    'Confundir pattern com framework — Repository e padrão, não precisa de generic class enorme.',
    'Combinar 5 patterns numa classe pra parecer "limpo" — Factory que retorna Builder que cria Strategy via Adapter. Codigo vira labirinto.',
    'Ignorar idiomas da linguagem — em JS funcional, closures resolvem sem precisar Strategy formal. Em Go, interface implícita simplifica muito.',
  ],
  interview: [
    { q: 'Quando você escolhe Strategy vs simples if/else?', a: '<p>Uso <strong>if/else</strong> quando: ramos são 2-3, raramente mudam, e não tem comportamento complexo em cada um. Código simples ganha.</p><p>Vou pra <strong>Strategy</strong> quando: há vários algoritmos (5+), eles são adicionados/trocados frequentemente, ou cada um tem complexidade significativa (e merece arquivo próprio). Strategy permite OCP — adicionar novo algoritmo sem mexer nos existentes.</p><p>Red flag: criar Strategy com uma só implementação "antecipando o futuro" é overkill especulativo.</p>' },
    { q: 'Singleton e anti-pattern?', a: '<p>Quase sempre, em código de aplicação. Esconde dependência (a classe usa, mas não declara), dificulta teste (mock e difícil), causa bug em concorrência, vira global state mascarado.</p><p>DI container faz o trabalho melhor: cria uma instância, injeta onde precisa, mantem testavel. <strong>Excecoes legitimas</strong>: logger global, config readonly carregado uma vez. Mesmo nesses casos, abstracao + injecao em vez de Singleton clássico e mais limpo.</p>' },
    { q: 'Como Decorator se compara a herança?', a: '<p><strong>Herança</strong> adiciona comportamento estaticamente em compile-time. Rigida, gera explosao de subclasses se você quer combinar features (LoggingAndCachingAndRetryingHandler).</p><p><strong>Decorator</strong> adiciona em runtime via composição. Combina livremente: <code>logging(caching(retry(handler)))</code>. Cada decorator tem responsabilidade única (SRP) e você pluga conforme precisa.</p><p>HTTP middleware (Express, Koa, Nest interceptor) e Decorator pattern aplicado.</p>' },
    { q: 'Tradeoff: Repository pattern vs ORM direto?', a: '<p><strong>ORM direto</strong> (Prisma, TypeORM no service): rápido, menos código, ótimo pra CRUD simples. Custo: regra de query espalha, troca de ORM e dolorosa, mock de teste e complicado.</p><p><strong>Repository pattern</strong>: abstrai persistência, domínio não depende de ORM, teste mocka fácil. Custo: boilerplate, risco de virar DAO disfarcado com 50 métodos custom.</p><p>Em CRUD simples, ORM direto. Em domínio rico (DDD), Repository encapsula bem o aggregate. Misturar nas camadas certas e o equilibrio.</p>' },
    { q: 'Que pattern você considera overrated?', a: '<p><strong>Singleton</strong> (anti-pattern em maior parte dos casos) e <strong>Visitor</strong> (raramente legivel, geralmente substituido melhor por pattern matching ou polimorfismo simples).</p><p>Também desconfio de <strong>uso excessivo de Factory</strong> em projeto Node/TS moderno — DI container e closure resolvem sem cerimonia. Pattern e ferramenta — usar com moderacao e contexto.</p>' },
  ],
  resources: [
    { title: 'Design Patterns (GoF — Gamma et al.)', url: 'https://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612', kind: 'livro' },
    { title: 'Refactoring Guru — Patterns', url: 'https://refactoring.guru/design-patterns', kind: 'docs' },
    { title: 'Patterns of Enterprise Application Architecture (Fowler)', url: 'https://martinfowler.com/eaaCatalog/', kind: 'livro' },
    { title: 'Head First Design Patterns', url: 'https://www.oreilly.com/library/view/head-first-design/9781492077992/', kind: 'livro' },
    { title: 'Sourcemaking — Design Patterns', url: 'https://sourcemaking.com/design_patterns', kind: 'docs' },
  ],
}

export default designPatterns
