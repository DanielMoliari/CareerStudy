import type { SkillContent } from '@/types'

const dependencyInjection: SkillContent = {
  tagline: 'Injetar dependência em vez de instanciar — habilita teste, troca e desacoplamento.',
  why: 'DI e básico em vaga senior. Entrevistador testa se você entende o ponto (inversao de controle, testabilidade) ou se decorou framework (Nest, Spring). Aplicar mal vira XML hell ou container magico que ninguem entende.',
  summary: 'Dependency Injection e técnica onde dependências são injetadas (via construtor, setter, ou framework) em vez de instanciadas dentro da classe. Implementa o princípio de Inversao de Controle (IoC). Beneficio: teste isolado com mock, troca de impl sem mexer no consumidor, configuração centralizada. Tres formas: constructor (preferida), setter, interface. Container de DI (Spring, Nest, InversifyJS) automatiza wiring em projetos grandes. Pequeno demais, manual já resolve.',
  keypoints: [
    { title: 'IoC vs DI', body: 'IoC e o princípio: o controle de criação/wiring sai da classe e vai pra fora. DI e a técnica específica: passar dependência. Outras formas de IoC: service locator, callbacks, plugins.' },
    { title: 'Constructor injection', body: 'Forma preferida. Dependências declaradas no construtor, classe nunca está sem elas, fica óbvio o que ela precisa. Imutabilidade ajuda concorrência.' },
    { title: 'Setter / Property injection', body: 'Útil quando dependência e opcional ou tem ciclo. Risco: classe pode ser usada antes de receber a dep — NPE em runtime. Use com moderacao.' },
    { title: 'DI Container', body: 'Framework que cria instâncias e resolve dependências automático (Spring, Nest, Inversify, Dagger). Útil em projeto grande. Pequeno demais, container vira complexidade injustificada.' },
    { title: 'Lifecycle / Scope', body: 'Singleton (uma instância), transient (nova a cada injecao), request-scoped (uma por request HTTP). Errar scope vira bug: state compartilhado entre requests.' },
    { title: 'Circular dependency', body: 'A precisa de B e B precisa de A — geralmente sinal de design ruim. Quebrar via interface intermediária, evento, ou repensar fronteira.' },
    { title: 'DI sem framework', body: 'Em projeto pequeno/medio, da pra fazer DI manual: composition root no main, instância tudo, passa pra baixo. Sem magica, sem reflection. Funciona até uns 50-100 classes.' },
  ],
  gotchas: [
    'Container magico sem entender — anotação + reflection + lifecycle vira caixa preta. Quando bug aparece, ninguem sabe debugar.',
    'Service Locator disfarcado — injetar container e pedir <code>container.get("X")</code> dentro. Esconde dependência, perde o ponto.',
    'Scope errado — service singleton com state mutável injetado em request handler = bug de concorrência.',
    'Construtor com 15 parametros — sintoma de SRP violado, classe faz coisas demais. DI revelou o problema, não causou.',
    'Mock pra tudo em teste — teste vira espelho da implementação, refatorar quebra teste sem bug real. Mock só dependência externa, dependência interna prefere objeto real (test double mais leve).',
  ],
  interview: [
    { q: 'Por que DI ajuda em teste?', a: '<p>Sem DI, classe instância dependência internamente (<code>new PostgresClient()</code>). Pra testar, você precisa subir Postgres ou monkey-patch — ambos ruim.</p><p>Com DI, você injeta dependência no construtor. No teste, passa um mock/fake (<code>new OrderService(fakeRepo, fakeNotifier)</code>) e testa lógica isolada em milissegundos. Isso e <strong>testabilidade arquitetural</strong> — design viabilizando teste, não teste forcando design.</p>' },
    { q: 'Tradeoff: DI manual vs container?', a: '<p><strong>Manual</strong>: composition root no main instância tudo e passa. Sem magica, debugavel, type-safe. Limite: em projeto com 200 classes, composition root vira gigante.</p><p><strong>Container</strong>: anotação + auto-wire. Escala bem em projeto grande, configura scope, plugins. Custo: curva, magica/reflection, debug mais difícil, configuração errada vira erro em runtime.</p><p>Regra: até 50-100 classes, manual ganha em simplicidade. Acima disso, container compensa.</p>' },
    { q: 'O que e Service Locator e por que e considerado anti-pattern?', a: '<p>Service Locator: registry global onde você pede dependência <code>locator.get(UserRepo)</code> dentro da classe. Parece DI, mas <strong>esconde a dependência</strong> — assinatura da classe não revela o que ela precisa.</p><p>Problemas: teste precisa configurar locator (mais setup), refactor e perigoso (compilador não pega), e você perde o checklist explícito de deps. Mark Seemann: <em>"Service Locator is an anti-pattern"</em>. DI por construtor e claramente superior.</p>' },
    { q: 'Quando DI vira overkill?', a: '<p>Em script pequeno, CLI simples, prototipo de fim de semana — instanciar direto e mais legivel. Também em código onde dependência e <strong>pura</strong> e sem efeito colateral (função utilitaria) — não precisa injetar Math.</p><p>E em <strong>código de framework</strong> que você não testa unitariamente — Express handler trivial não precisa de IoC container. YAGNI antes de DI.</p>' },
    { q: 'Como você evita ciclo de dependência?', a: '<p>Primeiro: ciclo geralmente e <strong>cheiro de design ruim</strong>. Investiga se as duas classes deveriam ser uma so, ou se ha um terceiro conceito escondido.</p><p>Técnicas: extrair interface comum que ambas dependem, usar evento (A pública, B consome — em vez de chamada direta), injecao por setter como último recurso (com risco de uso antes de set).</p><p>Container moderno (Nest, Spring) detecta ciclo em startup com mensagem clara — facilita refactor.</p>' },
  ],
  resources: [
    { title: 'Dependency Injection Principles, Practices, and Patterns (Seemann)', url: 'https://www.manning.com/books/dependency-injection-principles-practices-patterns', kind: 'livro' },
    { title: 'Martin Fowler — Inversion of Control', url: 'https://martinfowler.com/articles/injection.html', kind: 'artigo' },
    { title: 'NestJS Docs — Providers', url: 'https://docs.nestjs.com/providers', kind: 'docs' },
    { title: 'Spring Framework Reference', url: 'https://docs.spring.io/spring-framework/reference/core/beans.html', kind: 'docs' },
    { title: 'Mark Seemann — DI blog', url: 'https://blog.ploeh.dk/tags/#Dependency-Injection-ref', kind: 'artigo' },
  ],
}

export default dependencyInjection
