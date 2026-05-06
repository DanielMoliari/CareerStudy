'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import type { HookItem, RuleItem } from '@/components/pdfs/CheatsheetPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'
import { buildMindmapPdf } from '@/components/pdfs/MindmapPdf'
import type { MindmapCategory } from '@/components/pdfs/MindmapPdf'
import { buildRecipeBookPdf } from '@/components/pdfs/RecipeBookPdf'
import type { Recipe } from '@/components/pdfs/RecipeBookPdf'
import { buildCommandRefPdf } from '@/components/pdfs/CommandRefPdf'
import type { CommandEntry } from '@/components/pdfs/CommandRefPdf'

// ── Paleta TypeORM ────────────────────────────────────────────────────────────────
const C      = '#E83E8C'  // TypeORM pink/magenta
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'

void FG; void FGMUTE

// ── Metadados dos PDFs ────────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas em entrevista TypeORM',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: 20 perguntas de TypeORM — DataMapper vs ActiveRecord, N+1 problem, migrations em produção, transações, soft delete, QueryBuilder, relações, herança de tabelas, connection pooling, TypeORM 0.3 breaking changes — com resposta estruturada para nível pleno e sênior.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'Decorators, QueryBuilder API e CLI numa página',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referência densa: todos os decorators de entidade e relação, QueryBuilder API fluente, operadores find(), CLI de migrations e as regras críticas. Tudo que você precisa checar sem abrir documentação.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Os 5 truques que grudam TypeORM na memória',
    type: 'mnemonics',
    pages: 2,
    description: 'FK fica no Many, @JoinTable no owner, Sync destrói Migration protege, EM dentro da transação e o mnemônico de migrations. Associações que fixam os pontos mais cobrados em entrevista.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'Os 8 erros mais comuns com TypeORM',
    type: 'antipatterns',
    pages: 3,
    description: 'synchronize em produção, N+1 silencioso, SQL injection no QueryBuilder, repositório fora de transação, editar migration aplicada, eager loading em lista, relação circular no JSON e QueryRunner sem release. Com código errado x correto.',
    icon: '04',
    goal: 'Reconhecimento de padrão',
  },
  {
    id: 'mindmap',
    title: 'Mind Map',
    subtitle: 'TypeORM do zero ao sênior em uma folha',
    type: 'mindmap',
    pages: 2,
    description: 'Mapa mental completo com 9 categorias (DataSource, Entities, Relations, Repository, QueryBuilder, Migrations, Transações, Hooks, NestJS) e checklist de 10 perguntas para auto-avaliar o domínio antes de entrevistas.',
    icon: '05',
    goal: 'Mapeamento mental',
  },
  {
    id: 'recipes',
    title: 'Recipe Book',
    subtitle: '8 receitas práticas para o dia a dia com TypeORM',
    type: 'recipes',
    pages: 6,
    description: 'Receitas prontas para os casos mais comuns: transação com EntityManager, paginação cursor-based, soft delete com restore, custom repository, full-text search Postgres, multi-database, índice parcial para soft delete único, locking pessimista. Cada receita com passos, código e armadilhas.',
    icon: '06',
    goal: 'Implementação rápida',
  },
  {
    id: 'migrations-cli',
    title: 'Migrations CLI',
    subtitle: 'Todos os comandos typeorm migration com flags e exemplos',
    type: 'migrations-cli',
    pages: 4,
    description: 'Referência completa do CLI typeorm: migration:generate, run, revert, show, create — com flags, exemplos e SQL gerado. Comandos destrutivos sinalizados. Fluxo seguro do generate ao deploy em produção.',
    icon: '07',
    goal: 'Consulta de comandos',
  },
]

const TYPE_COLOR: Partial<Record<PdfType, string>> = {
  qa:                '#a78bfa',
  cheatsheet:        C,
  mnemonics:         '#4ade80',
  antipatterns:      '#ef4444',
  mindmap:           '#f59e0b',
  recipes:           '#38bdf8',
  'migrations-cli':  '#fbbf24',
}

void TYPE_COLOR

// ── Dados: Q&A ────────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Senior',
    q: 'Qual a diferença entre ActiveRecord e DataMapper no TypeORM?',
    a: 'ActiveRecord: entidade herda BaseEntity com métodos estáticos de query (User.findOne, User.save). DataMapper: entidade é POJO puro, repositório separado gerencia persistência.',
    bullets: [
      'ActiveRecord: menos boilerplate, mas difícil de mockar (métodos estáticos) e viola DDD.',
      'DataMapper: repositório é injetável via DI, permite mock limpo em testes unitários.',
      'NestJS usa DataMapper por padrão: @InjectRepository(User) private repo: Repository<User>.',
    ],
    tip: 'Explique o impacto em testabilidade: ActiveRecord exige mock estático (trabalhoso), DataMapper injeta mock no construtor — 5 linhas de setup.',
  },
  {
    level: 'Pleno',
    q: 'Por que nunca usar synchronize: true em produção?',
    a: 'TypeORM com synchronize: true compara o schema com as entidades a cada inicialização e emite DDL automaticamente — incluindo DROP COLUMN, DROP INDEX, ALTER TABLE.',
    bullets: [
      'Um @Column removido por acidente dropa a coluna de produção sem confirmação nem recovery.',
      'Solução: workflow de migration — generate, revisar SQL, commit, CI/CD executa migration:run.',
      'Só synchronize: true em desenvolvimento local ou ambiente de testes isolado.',
    ],
    tip: 'Descreva o cenário de catástrofe: remoção acidental de @Column + deploy = DROP COLUMN em produção. Isso convence qualquer entrevistador.',
  },
  {
    level: 'Pleno',
    q: 'Como identificar e resolver o problema N+1 no TypeORM?',
    a: 'N+1: 1 query para listar N itens + N queries para acessar a relação de cada item. Com N=100 posts e author acessado no loop = 101 queries onde 1 bastaria.',
    bullets: [
      'Identificar: logging: true no DataSource — observe múltiplos SELECT no console.',
      'Resolver com find(): relations: { author: true, tags: true }.',
      'Resolver com QueryBuilder: .leftJoinAndSelect("post.author", "author").',
    ],
    tip: 'Cite o número concreto: N=100 → 101 queries vs 1. O impacto em ms é o que convence o entrevistador da gravidade.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona o soft delete com @DeleteDateColumn?',
    a: 'Adicione @DeleteDateColumn() deletedAt: Date | null na entidade. softDelete() preenche deletedAt em vez de emitir DELETE. TypeORM filtra automaticamente registros com deletedAt != null.',
    bullets: [
      'repo.softDelete(id) — emite UPDATE SET deletedAt = NOW().',
      'repo.restore(id) — limpa deletedAt (reativa o registro).',
      'Armadilha: índice unique em email + soft delete permite re-cadastro do mesmo email.',
    ],
    tip: 'Mencione a armadilha do índice único — email UNIQUE + soft delete precisa de índice parcial (WHERE deletedAt IS NULL) para rejeitar duplicatas apenas em registros ativos.',
  },
  {
    level: 'Pleno',
    q: 'Como prevenir SQL injection no QueryBuilder?',
    a: 'Nunca use template literal no where. Use sempre parâmetros nomeados — TypeORM passa o valor como parâmetro parametrizado ao driver, sem interpolação.',
    bullets: [
      'ERRADO: .where(`post.authorId = ${userId}`) — SQL injection direto.',
      'CORRETO: .where("post.authorId = :id", { id: userId }) — parametrizado.',
      'Para arrays: .where("post.id IN (:...ids)", { ids: [1,2,3] }) — sintaxe :...spread.',
    ],
    tip: 'Demonstre a sintaxe :...spread para arrays — a maioria dos candidatos não conhece e é cobrada em testes técnicos.',
  },
  {
    level: 'Senior',
    q: 'Como estruturar transações no NestJS com TypeORM?',
    a: 'Injete DataSource e use dataSource.transaction(async em => {...}). O EntityManager "em" do callback deve ser usado para TODAS as operações — não o repositório injetado.',
    bullets: [
      'dataSource.transaction() → rollback automático em qualquer exceção.',
      'QueryRunner manual: createQueryRunner + startTransaction + commit/rollback + release.',
      'ARMADILHA: usar o repositório injetado dentro do callback — ele opera fora da transação!',
    ],
    tip: 'A pegadinha clássica: usar this.userRepo.save() dentro de dataSource.transaction(). O repo injetado opera com sua própria conexão — fora da transação.',
  },
  {
    level: 'Senior',
    q: 'Qual o risco de editar uma migration já aplicada em produção?',
    a: 'TypeORM rastreia migrations pela tabela "migrations" no banco. Uma migration editada não é reexecutada (já está marcada) — a mudança de código nunca vai para o banco.',
    bullets: [
      'O histórico fica inconsistente: outros ambientes executarão a versão editada como nova.',
      'Regra: migration aplicada é IMUTÁVEL. Crie uma nova migration de correção.',
      'Para reverter: migration:revert executa o método down() da última migration.',
    ],
    tip: 'Explique o mecanismo: tabela "migrations" no banco armazena timestamp + nome. Isso torna as migrations idempotentes — e por isso imutáveis após aplicadas.',
  },
  {
    level: 'Senior',
    q: 'Como evitar circular reference ao serializar entidades TypeORM para JSON?',
    a: 'Post → author → posts → author... é um loop infinito ao serializar. Estratégias: @Exclude() no lado inverso, DTOs explícitos (preferido) ou serialization groups.',
    bullets: [
      'class-transformer: @Exclude() no campo inverso + ClassSerializerInterceptor no NestJS.',
      'DTOs explícitos: mapeie entidade → DTO no serviço, nunca serialize entidade diretamente.',
      'DTOs são o melhor: eliminam o problema na raiz + controlam campos sensíveis (senha, tokens).',
    ],
    tip: 'Argumente por DTOs como solução definitiva: além de resolver circular reference, evita vazar campos sensíveis (senha, tokens de reset) que existem na entidade.',
  },
  {
    level: 'Pleno',
    q: 'Quando usar QueryBuilder vs find() com FindOptions?',
    a: 'Use find() para CRUD simples, filtros diretos, relações simples e paginação básica. Use QueryBuilder para múltiplos JOINs condicionais, subqueries, GROUP BY, SELECT parcial e operações bulk.',
    bullets: [
      'find(): legível, menos verboso, suficiente para 80% dos casos.',
      'QueryBuilder: JOINs dinâmicos, subqueries, HAVING, SELECT de colunas específicas.',
      'getManyAndCount() retorna [T[], number] em uma query — indispensável para paginação.',
    ],
    tip: 'Dê um exemplo concreto: buscar posts por autor + tag + status = find() ok. Buscar posts com contagem de comentários filtrada por popularidade = QueryBuilder.',
  },
  {
    level: 'Senior',
    q: 'Como configurar TypeORM para múltiplos bancos no NestJS?',
    a: 'Use múltiplos TypeOrmModule.forRoot() com name distinto. Ao registrar entidades e injetar repositórios, especifique o nome da conexão como segundo argumento.',
    bullets: [
      'forRoot({ name: "reporting", type: "postgres", ... }) — segunda conexão nomeada.',
      'TypeOrmModule.forFeature([Report], "reporting") — registra entidade na conexão certa.',
      '@InjectRepository(Report, "reporting") — injeta repositório da conexão correta.',
    ],
    tip: 'O detalhe que faz a diferença: passar o nome como segundo argumento em forFeature E em @InjectRepository. Esquecer um deles resulta em erro de DI difícil de debugar.',
  },
  {
    level: 'Senior',
    q: 'Explique o padrão Custom Repository no TypeORM 0.3.',
    a: 'Em TypeORM 0.3, @EntityRepository foi removido. O padrão correto é criar uma classe @Injectable que injeta Repository<T> padrão e adiciona métodos de domínio.',
    bullets: [
      '@EntityRepository(User) era o padrão 0.2 — deprecated em 0.3.',
      'TypeORM 0.3: classe @Injectable com @InjectRepository(User) no construtor.',
      'Vantagem: encapsula QueryBuilder raw, serviço fica limpo, mock da classe inteira é trivial.',
    ],
    tip: 'Mencione que @EntityRepository ainda aparece em muitos tutoriais — candidatos que sabem que foi removido em 0.3 demonstram estar atualizados.',
  },
  {
    level: 'Senior',
    q: 'Como testar serviços NestJS que dependem de repositórios TypeORM?',
    a: 'Duas abordagens: mock manual com jest.fn() (unit tests rápidos sem banco) ou SQLite em memória (integration tests com persistência real).',
    bullets: [
      'Mock: overrideProvider(getRepositoryToken(User)).useValue({ findOne: jest.fn(), save: jest.fn() }).',
      'SQLite: TypeOrmModule.forRoot({ type: "sqlite", database: ":memory:", synchronize: true }).',
      'getRepositoryToken() é o helper do NestJS para obter o token de DI do repositório.',
    ],
    tip: 'Mencione getRepositoryToken() especificamente — é o ponto que muitos candidatos desconhecem e é a chave para mockar repositórios corretamente no NestJS.',
  },
  {
    level: 'Senior',
    q: 'Como gerenciar migrations em Kubernetes com múltiplas instâncias?',
    a: 'O risco: múltiplas pods tentando rodar migration:run simultaneamente. O padrão recomendado é separar a responsabilidade com Init Container ou CI/CD job dedicado.',
    bullets: [
      'Init Container: roda migration:run antes de qualquer pod de aplicação subir.',
      'CI/CD job separado: migration:run como step dedicado antes do deploy.',
      'Nunca deixe múltiplas instâncias tentarem migrations sem mecanismo de lock.',
    ],
    tip: 'Init Container é a resposta sênior — é simples, determinístico e segue 12-factor app (separação de build/release/run). Mostra maturidade em deployment.',
  },
  {
    level: 'Pleno',
    q: 'Explique os hooks de ciclo de vida das entidades TypeORM.',
    a: '@BeforeInsert, @AfterInsert, @BeforeUpdate, @AfterUpdate, @BeforeRemove, @AfterLoad — executam automaticamente em eventos de persistência da entidade.',
    bullets: [
      '@BeforeInsert + @BeforeUpdate: hash de senha, normalização de email, geração de slug.',
      '@AfterInsert: envio de e-mail de boas-vindas, log de auditoria.',
      'Cuidado: AfterLoad não suporta async — TypeORM não awaita. Use Subscriber para casos assíncronos.',
    ],
    tip: 'Mencione a limitação do AfterLoad (não async) — é uma armadilha real que candidatos sênior devem conhecer. Use Subscriber externo para lógica assíncrona pós-load.',
  },
  {
    level: 'Senior',
    q: 'Qual a diferença entre Subscribers e Entity Listeners?',
    a: 'Entity Listeners: decorators na própria entidade — simples, acoplados. Subscribers: classes separadas que implementam EntitySubscriberInterface, podem observar múltiplas entidades.',
    bullets: [
      'Listeners: bons para lógica sempre ligada à entidade (hash senha, slug).',
      'Subscribers: cross-cutting concerns — auditoria, publicação de domain events, cache.',
      'Subscribers têm acesso a event.manager e event.queryRunner — podem fazer queries na mesma transação.',
    ],
    tip: 'Use a analogia: Listener é para lógica de entidade (coesa), Subscriber é para lógica de infra (transversal). Subscriber é mais testável e desacoplado da entidade.',
  },
  {
    level: 'Senior',
    q: 'Como escalar o connection pool do TypeORM em produção?',
    a: 'Configure o pool via extra.max no DataSource. Com múltiplas instâncias, cada pod mantém seu pool — o total de conexões ao banco pode exceder max_connections do PostgreSQL.',
    bullets: [
      'DataSource extra: { max: 20, min: 5, idleTimeoutMillis: 30000 }.',
      '10 pods × max:20 = 200 conexões. PostgreSQL default max_connections: 100.',
      'Solução para escala: PgBouncer como connection pooler externo em transaction mode.',
    ],
    tip: 'PgBouncer é a resposta completa para produção com múltiplas instâncias. Candidatos que não mencionam pooler externo deixam uma gap de conhecimento de infra.',
  },
  {
    level: 'Pleno',
    q: 'Quais os principais breaking changes do TypeORM 0.3 vs 0.2?',
    a: 'TypeORM 0.3 removeu APIs legadas. Os breaking changes mais impactantes: getConnection() removido, createConnection() deprecated, @EntityRepository deprecated, e find() com where plano deprecated.',
    bullets: [
      'getConnection() → injete DataSource diretamente.',
      '@EntityRepository(User) → classe @Injectable com @InjectRepository(User).',
      'findOne(id) → findOneBy({ id }) ou findOne({ where: { id } }).',
    ],
    tip: 'Citar @EntityRepository como deprecated é o ponto-chave — gerou muita dor de migração em projetos legados NestJS e ainda aparece em muitos tutoriais desatualizados.',
  },
  {
    level: 'Senior',
    q: 'Como implementar paginação cursor-based com TypeORM?',
    a: 'Cursor-based usa um ponteiro (id ou createdAt) para buscar a próxima página diretamente, sem skip. Performance constante independente do offset, sem duplicatas em inserts concorrentes.',
    bullets: [
      'Simples: WHERE id > :cursor ORDER BY id ASC TAKE pageSize.',
      'Ordenação por campo não-único: WHERE (createdAt, id) < (:createdAt, :id) com índice composto.',
      'Offset-based (skip/take) degrada em grandes datasets — o banco faz skip físico de N registros.',
    ],
    tip: 'Diferencie os casos de uso: cursor-based para feeds e grandes datasets, offset para admin panels onde é necessário ir direto à página N.',
  },
  {
    level: 'Senior',
    q: 'Explique herança de tabelas no TypeORM: STI vs CTI.',
    a: 'STI (Single Table Inheritance): todas as subclasses numa única tabela com coluna discriminadora. CTI (Concrete Table Inheritance): cada subclasse tem sua própria tabela.',
    bullets: [
      'STI: @TableInheritance + @ChildEntity(). Queries simples, sem JOINs. Colunas extras são NULL para outras subclasses.',
      'CTI: cada subclasse tem tabela própria. Sem NULLs, mas UNION ALL para queries polimórficas.',
      'STI quando subclasses são similares. CTI quando têm estruturas muito diferentes.',
    ],
    tip: 'O detalhe que diferencia: no STI, colunas das subclasses são always nullable no banco — essa NULL density é o trade-off central vs CTI.',
  },
  {
    level: 'Pleno',
    q: 'Como configurar índices compostos com TypeORM?',
    a: '@Index() em nível de classe com array de colunas cria índice composto. O TypeORM gera o índice na migration. Use para colunas frequentemente usadas juntas em WHERE e ORDER BY.',
    bullets: [
      '@Entity() @Index(["firstName", "lastName"]) export class User — índice composto.',
      '@Index(["email"], { unique: true }) — índice único composto.',
      'Soft delete + unique: índice parcial WHERE deleted_at IS NULL resolve re-cadastro após deleção.',
    ],
    tip: 'Mencione índice parcial para soft delete: CREATE UNIQUE INDEX idx_email ON users (email) WHERE deleted_at IS NULL. Resolve o problema de re-cadastro após soft delete.',
  },
]

// ── Dados: CheatSheet ─────────────────────────────────────────────────────────────

const DECORATORS: HookItem[] = [
  { name: '@Entity()',                sig: "@Entity('nome_tabela')",                       desc: 'Marca a classe como tabela. Nome customizado opcional.' },
  { name: '@PrimaryGeneratedColumn', sig: "@PrimaryGeneratedColumn('uuid')",              desc: 'PK auto-increment (int) ou UUID v4.' },
  { name: '@Column()',               sig: "@Column({ type, nullable, unique, default })", desc: 'Coluna da tabela. Suporta todas as opções do banco.' },
  { name: '@CreateDateColumn()',     sig: '@CreateDateColumn()',                           desc: 'Timestamp automático na criação. TypeORM insere.' },
  { name: '@UpdateDateColumn()',     sig: '@UpdateDateColumn()',                           desc: 'Timestamp auto-atualizado no save().' },
  { name: '@DeleteDateColumn()',     sig: '@DeleteDateColumn()',                           desc: 'Soft delete: preenche em softDelete(), filtra automaticamente.' },
  { name: '@Index()',                sig: "@Index(['col1', 'col2'])",                     desc: 'Índice simples ou composto (array em nível de classe).' },
  { name: '@Unique()',               sig: "@Unique(['col1', 'col2'])",                    desc: 'Constraint unique. Composto quando array.' },
]

const RELATIONS: HookItem[] = [
  { name: '@ManyToOne()',      sig: '@ManyToOne(() => User, u => u.posts)',      desc: 'FK nesta entidade. TypeORM cria coluna userId automaticamente.' },
  { name: '@OneToMany()',      sig: '@OneToMany(() => Post, p => p.user)',       desc: 'Sem FK aqui. Precisa do 2º argumento (função inversa).' },
  { name: '@OneToOne()',       sig: '@OneToOne(() => Profile) @JoinColumn()',    desc: '@JoinColumn obrigatório — define qual lado tem a FK.' },
  { name: '@ManyToMany()',     sig: '@ManyToMany(() => Tag) @JoinTable()',       desc: '@JoinTable obrigatório no lado owner (cria tabela intermediária).' },
  { name: '{ eager: true }',  sig: "@OneToMany(..., { eager: true })",          desc: 'Carrega sempre. Perigoso em listas grandes — gera queries enormes.' },
  { name: '{ cascade }',      sig: "@ManyToOne(..., { cascade: true })",        desc: 'save/remove em cascata. Risco de remoção acidental.' },
  { name: '{ onDelete }',     sig: "@ManyToOne(..., { onDelete: 'CASCADE' })",  desc: 'FK constraint no banco. Diferente de cascade (app-level).' },
  { name: 'relations:{}',     sig: "repo.find({ relations: { posts: true } })", desc: 'Carregamento explícito por query. Forma preferida.' },
]

const TYPEORM_RULES: RuleItem[] = [
  { ok: false, t: 'NUNCA synchronize: true em produção — use migrations com revisão de SQL.' },
  { ok: false, t: 'NUNCA interpolar strings no QueryBuilder — use parâmetros :named.' },
  { ok: false, t: 'NUNCA usar repositório injetado dentro de dataSource.transaction().' },
  { ok: false, t: 'NUNCA editar migration já aplicada — crie uma nova de correção.' },
  { ok: true,  t: 'SEMPRE usar try/finally com qr.release() no QueryRunner manual.' },
  { ok: true,  t: 'SEMPRE declarar relações explicitamente em cada query (lazy explícito).' },
  { ok: true,  t: 'SEMPRE revisar o SQL gerado pelo migration:generate antes de aplicar.' },
  { ok: true,  t: 'SEMPRE usar DataMapper (POJO + repositório) no NestJS enterprise.' },
]

// ── Dados: Mnemônicos ─────────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'FK fica no Many',
    trick: 'ManyToOne = Muitos TÊM a chave do Um',
    expansion: [['Many', 'Lado que tem a FK'], ['ToOne', 'Aponta para o Um (pai)']],
    explanation: 'O lado @ManyToOne sempre tem a coluna FK no banco. O @OneToMany do outro lado não gera coluna — é só navegação virtual.',
    example: 'Post.authorId (FK) — Post tem @ManyToOne para User',
    why: 'Regra #1 de relações. Se errar o lado da FK, o schema fica errado silenciosamente.',
  },
  {
    label: '@JoinTable no owner',
    trick: 'Quem @JoinTable PAGA a tabela intermediária',
    expansion: [['@JoinTable', 'Owner da relação ManyToMany'], ['paga', 'Cria a tabela de junção']],
    explanation: 'Em @ManyToMany, o lado com @JoinTable é o owner e cria a tabela de junção. Apenas um lado deve ter @JoinTable.',
    example: 'Post tem @ManyToMany + @JoinTable → cria post_tags_tag',
    why: 'Se esquecer @JoinTable, a tabela intermediária não é criada e o ManyToMany não funciona.',
  },
  {
    label: 'Sync destrói, Migration protege',
    trick: 'synchronize: DESTRUIÇÃO · migration: PROTEÇÃO',
    expansion: [['synchronize: true', 'DDL automático, pode DROP'], ['migration', 'Revisão + histórico + rollback']],
    explanation: 'synchronize: true é para prototipagem local. Qualquer ambiente com dados reais exige migrations com revisão humana.',
    example: 'Deletou @Column + deploy = DROP COLUMN em produção sem confirmação',
    why: 'A regra mais importante do TypeORM em produção. Um erro aqui pode destruir dados irreversivelmente.',
  },
  {
    label: 'EM dentro da transação',
    trick: 'Dentro da transação, usa o EM — não o repo injetado',
    expansion: [['EM', 'EntityManager do callback da transação'], ['repo injetado', 'Conexão separada — fora da tx']],
    explanation: 'Dentro de dataSource.transaction(async em => ...), use o EntityManager "em" do callback. O repositório injetado opera com sua própria conexão.',
    example: 'em.save(User, user) ← correto. this.userRepo.save(user) ← fora da transação.',
    why: 'A pegadinha mais comum com transações TypeORM. O código funciona mas não tem atomicidade real.',
  },
  {
    label: 'Migration IMUTÁVEL',
    trick: 'Migration aplicada = pedra. Quer mudar: nova pedra.',
    expansion: [['imutável', 'Não edite após aplicar'], ['nova pedra', 'Crie nova migration de correção']],
    explanation: 'TypeORM rastreia pelo timestamp+nome. Uma migration editada não é reexecutada — outros ambientes executarão a versão editada como nova.',
    example: 'Errou SQL em migration aplicada → crie AddFixPhone1710000000002',
    why: 'Editar migration aplicada quebra a consistência entre ambientes (dev, staging, prod) de forma silenciosa.',
  },
]

// ── Dados: Anti-patterns ──────────────────────────────────────────────────────────

const RED_T = '#f87171'
const GRN_T = '#4ade80'

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'synchronize: true em produção',
    badDesc: 'DDL automático a cada inicialização — inclui DROP COLUMN',
    badCode: [
      { t: 'new DataSource({\n  synchronize: ' }, { t: 'true', c: RED_T }, { t: ', // ← dropa colunas!\n})\n// @Column deletado → DROP COLUMN imediato' },
    ],
    goodDesc: 'synchronize: false + workflow de migrations com revisão',
    goodCode: [
      { t: 'new DataSource({\n  synchronize: ' }, { t: 'false', c: GRN_T }, { t: ',\n  migrations: [' }, { t: "'src/migrations/*.ts'", c: GRN_T }, { t: '],\n})' },
    ],
    why: 'synchronize:true emite DDL automático incluindo DROP COLUMN. Uma remoção acidental de @Column em código dropa dados de produção sem confirmação.',
  },
  {
    title: 'SQL injection no QueryBuilder',
    badDesc: 'Template literal interpola diretamente no SQL',
    badCode: [
      { t: '.where(' }, { t: '`post.userId = ${userId}`', c: RED_T }, { t: ')\n// → WHERE post.userId = 1 OR 1=1\n// → retorna TODOS os registros!' },
    ],
    goodDesc: 'Parâmetros :named — TypeORM usa prepared statements',
    goodCode: [
      { t: '.where(' }, { t: "'post.userId = :id'", c: GRN_T }, { t: ", { id: userId })\n// Arrays: .where('id IN (:...ids)', { ids })\n// → WHERE post.userId = $1" },
    ],
    why: 'Parâmetros nomeados são passados ao driver como prepared statement — o banco nunca vê o valor bruto. Template literal é SQL injection direto.',
  },
  {
    title: 'Repositório injetado dentro da transação',
    badDesc: 'this.userRepo opera com conexão própria — fora da transação',
    badCode: [
      { t: 'dataSource.transaction(async (em) => {\n  await ' }, { t: 'this.userRepo', c: RED_T }, { t: '.save(user) // ← fora da tx!\n  // se próxima op falhar: inconsistente\n})' },
    ],
    goodDesc: 'EntityManager do callback — participa da transação',
    goodCode: [
      { t: 'dataSource.transaction(async (' }, { t: 'em', c: GRN_T }, { t: ') => {\n  await ' }, { t: 'em', c: GRN_T }, { t: '.save(User, user)\n  await ' }, { t: 'em', c: GRN_T }, { t: '.save(Profile, p)\n  // rollback automático em exceção\n})' },
    ],
    why: 'O repositório injetado usa sua própria conexão do pool — fora da transação. Dentro de transaction(), use apenas o EntityManager passado como argumento.',
  },
  {
    title: 'N+1 — relação não carregada no loop',
    badDesc: 'Acessar relação não carregada em loop gera N queries extras',
    badCode: [
      { t: 'const posts = await postRepo.find()\nfor (const p of posts) {\n  console.log(' }, { t: 'p.author.name', c: RED_T }, { t: ') // ← SELECT user por iteração\n  // 100 posts = ' }, { t: '101 queries', c: RED_T }, { t: '!\n}' },
    ],
    goodDesc: 'relations: {} no find() — 1 query com LEFT JOIN',
    goodCode: [
      { t: 'const posts = await postRepo.find({\n  relations: { ' }, { t: 'author: true', c: GRN_T }, { t: " }\n})\nfor (const p of posts) {\n  console.log(p.author.name) // já carregado\n}  // Total: " }, { t: '1 query', c: GRN_T },
    ],
    why: 'N+1 é o bug de performance mais comum com ORMs. 100 posts → 101 queries vs 1. Declare sempre o que carregar explicitamente.',
  },
  {
    title: 'QueryRunner sem release() no finally',
    badDesc: 'Conexão fica aberta no pool — pool exhaustion gradual',
    badCode: [
      { t: 'const qr = dataSource.createQueryRunner()\nawait qr.startTransaction()\ntry {\n  await qr.manager.save(Entity, data)\n  await qr.commitTransaction()\n} catch (e) { await qr.rollbackTransaction() }\n// ' }, { t: 'sem qr.release()! Conexão vaza do pool', c: RED_T },
    ],
    goodDesc: 'try/finally garante release() sempre — mesmo em exceção',
    goodCode: [
      { t: 'const qr = dataSource.createQueryRunner()\ntry {\n  await qr.startTransaction()\n  await qr.manager.save(Entity, data)\n  await qr.commitTransaction()\n} catch (e) { await qr.rollbackTransaction(); throw e\n} finally { await ' }, { t: 'qr.release()', c: GRN_T }, { t: ' }' },
    ],
    why: 'QueryRunner sem release() mantém a conexão aberta no pool. Com N chamadas, o pool esgota e novas queries ficam em fila. Sempre use try/finally.',
  },
  {
    title: 'Editar migration já aplicada',
    badDesc: 'TypeORM não reexecuta — outros ambientes ficam inconsistentes',
    badCode: [
      { t: '// Já executada em produção — ' }, { t: 'NUNCA edite!', c: RED_T }, { t: '\nexport class AddPhone123 implements MigrationInterface {\n  async up(qr) {\n    // ← ' }, { t: 'editou aqui depois de aplicar', c: RED_T }, { t: '\n    // Banco: nunca vê a mudança\n  }\n}' },
    ],
    goodDesc: 'Criar nova migration de correção — imutabilidade garantida',
    goodCode: [
      { t: '// ' }, { t: 'NOVA migration — nunca edite a anterior!', c: GRN_T }, { t: '\nexport class FixPhone456 implements MigrationInterface {\n  async up(qr) { /* implementação correta */ }\n  async down(qr) { /* rollback obrigatório */ }\n}' },
    ],
    why: 'Migration aplicada é imutável. TypeORM rastreia pelo timestamp+nome. Editá-la não afeta o banco já migrado, mas quebra a consistência entre ambientes.',
  },
  {
    title: 'eager: true em relação de lista',
    badDesc: 'Carrega SEMPRE — pode multiplicar por N o resultado',
    badCode: [
      { t: '@OneToMany(() => Post, p => p.author, { ' }, { t: 'eager: true', c: RED_T }, { t: ' })\nposts: Post[]  // carrega em TODA query de User\n// 100 usuários = carrega todos os posts de cada um!' },
    ],
    goodDesc: 'Lazy (padrão) + carregamento explícito por query',
    goodCode: [
      { t: '@OneToMany(() => Post, p => p.author)\nposts: Post[]  // lazy — nada carrega sozinho\n\n// Carregue explicitamente quando precisar:\nrepo.findOne({ where: { id },\n  relations: { ' }, { t: 'posts: true', c: GRN_T }, { t: ' } })' },
    ],
    why: 'eager: true pode transformar uma listagem de usuários numa query com 10.000 linhas. Seja explícito sobre o que carregar em cada query.',
  },
  {
    title: 'Relação circular ao serializar para JSON',
    badDesc: 'Post → author → posts → author → ... loop infinito',
    badCode: [
      { t: '// Post.author (User) → User.posts → Post...\n// res.json(post) ou JSON.stringify(post)\n// → ' }, { t: 'Error: circular JSON structure', c: RED_T }, { t: '\n// ou stack overflow silencioso' },
    ],
    goodDesc: 'DTO explícito — entidade nunca sai da camada de dados',
    goodCode: [
      { t: 'async findPost(id: number): Promise<PostDto> {\n  const p = await repo.findOne({ where: { id },\n    relations: { author: true } })\n  return { id: p.id, title: p.title,\n    ' }, { t: 'authorName: p.author.name', c: GRN_T }, { t: ' } // sem circular\n}' },
    ],
    why: 'DTOs explícitos eliminam circular reference na raiz, controlam campos expostos e evitam vazar dados sensíveis (senha, tokens de reset) que existem na entidade.',
  },
]

// ── Dados: Mindmap ────────────────────────────────────────────────────────────────

const MINDMAP_CATEGORIES: MindmapCategory[] = [
  { label: 'DATASOURCE', color: C, items: [
    { t: 'new DataSource(config)', k: true }, { t: 'type, url, entities' }, { t: 'migrations array' },
    { t: 'synchronize: false', k: true }, { t: 'logging em dev' }, { t: 'pool (extra.max)' }, { t: 'Múltiplos DataSources', a: true },
  ]},
  { label: 'ENTITIES',   color: C, items: [
    { t: '@Entity()', k: true }, { t: '@Column()', k: true }, { t: '@PrimaryGeneratedColumn', k: true },
    { t: '@CreateDateColumn' }, { t: '@DeleteDateColumn' }, { t: '@Index, @Unique' },
    { t: 'reflect-metadata', a: true }, { t: 'Herança STI/CTI', a: true },
  ]},
  { label: 'RELATIONS',  color: C, items: [
    { t: '@ManyToOne', k: true }, { t: '@OneToMany', k: true }, { t: '@ManyToMany + @JoinTable', k: true },
    { t: '@OneToOne + @JoinColumn' }, { t: 'FK lado Many' }, { t: 'eager vs lazy' },
    { t: 'cascade, onDelete', a: true }, { t: 'N+1 → join explícito', a: true },
  ]},
  { label: 'REPOSITORY', color: C, items: [
    { t: 'find, findOne', k: true }, { t: 'save, insert', k: true }, { t: 'softDelete, restore', k: true },
    { t: 'count, exists' }, { t: 'where operadores' }, { t: 'Like, In, IsNull, Between' },
    { t: 'Custom Repository', a: true }, { t: 'withDeleted', a: true },
  ]},
  { label: 'QUERYBUILDER', color: C, items: [
    { t: 'createQueryBuilder', k: true }, { t: 'leftJoinAndSelect', k: true }, { t: ':params nomeados', k: true },
    { t: 'where, andWhere' }, { t: 'orderBy, take, skip' }, { t: 'getMany, getManyAndCount' },
    { t: 'subqueries', a: true }, { t: ':...spread para arrays', a: true },
  ]},
  { label: 'MIGRATIONS', color: C, items: [
    { t: 'migration:generate', k: true }, { t: 'migration:run', k: true }, { t: 'migration:revert', k: true },
    { t: 'migration:show' }, { t: 'up() e down()' }, { t: 'tabela migrations no banco' },
    { t: 'Imutável após aplicar', a: true }, { t: 'Init Container (k8s)', a: true },
  ]},
  { label: 'TRANSAÇÕES', color: C, items: [
    { t: 'dataSource.transaction()', k: true }, { t: 'EntityManager (em)', k: true }, { t: 'rollback automático', k: true },
    { t: 'QueryRunner manual' }, { t: 'startTransaction' }, { t: 'commit/rollback' },
    { t: 'release() no finally', a: true }, { t: 'Pessimistic lock', a: true },
  ]},
  { label: 'HOOKS',      color: C, items: [
    { t: '@BeforeInsert', k: true }, { t: '@BeforeUpdate', k: true }, { t: '@AfterLoad' },
    { t: '@AfterInsert' }, { t: '@AfterUpdate' }, { t: '@BeforeRemove' },
    { t: 'Subscribers externos', a: true }, { t: 'EntitySubscriberInterface', a: true },
  ]},
  { label: 'NESTJS',     color: C, items: [
    { t: 'TypeOrmModule.forRoot()', k: true }, { t: 'forFeature([Entity])', k: true }, { t: '@InjectRepository()', k: true },
    { t: 'autoLoadEntities: true' }, { t: 'DataSource injection' }, { t: 'forRootAsync' },
    { t: 'overrideProvider() — testes', a: true }, { t: 'getRepositoryToken()', a: true },
  ]},
]

const MINDMAP_CHECKLIST: string[] = [
  'Diferença DataMapper vs ActiveRecord — impacto em testabilidade.',
  'Por que synchronize: false em produção? Qual o risco concreto?',
  'Como a FK é definida em cada tipo de relação (@ManyToOne, @OneToOne, @ManyToMany)?',
  'Como detectar N+1? Como resolver com find() e com QueryBuilder?',
  'Quando usar QueryBuilder vs find()? Qual o threshold?',
  'Como estruturar transação com rollback automático no NestJS?',
  'Workflow completo de migrations do generate ao production.',
  'Como funciona soft delete? Qual a armadilha do índice unique?',
  'Como configurar TypeORM no NestJS? Qual a diferença de forRoot vs forFeature?',
  'Como prevenir SQL injection no QueryBuilder? Sintaxe para arrays.',
]

// ── Dados: Recipe Book ────────────────────────────────────────────────────────────

const RECIPES: Recipe[] = [
  {
    title: 'Transação atômica com EntityManager',
    category: 'Transações',
    goal: 'Executar múltiplas operações de banco com rollback automático em qualquer exceção, sem cair na pegadinha de usar o repositório injetado.',
    ingredients: [
      'DataSource injetado via @InjectDataSource()',
      'Operações que precisam ser atômicas (transferência, criação multi-tabela)',
      'NestJS com TypeORM 0.3+',
    ],
    steps: [
      {
        title: 'Injete o DataSource no serviço',
        description: 'Sempre injete o DataSource — não confie só nos repositórios injetados.',
        code: `@Injectable()
export class WalletService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}
}`,
      },
      {
        title: 'Use dataSource.transaction com callback',
        description: 'O callback recebe um EntityManager dedicado da transação. Use APENAS este "em" para todas as operações.',
        code: `await this.dataSource.transaction(async (em) => {
  const from = await em.findOneOrFail(Wallet, {
    where: { userId: fromId },
    lock: { mode: 'pessimistic_write' },
  })
  const to = await em.findOneOrFail(Wallet, {
    where: { userId: toId },
    lock: { mode: 'pessimistic_write' },
  })

  if (from.balance < amount) throw new Error('Saldo insuficiente')

  from.balance -= amount
  to.balance += amount

  await em.save([from, to])
})`,
      },
      {
        title: 'Registre auditoria dentro da mesma transação',
        description: 'Tudo dentro do callback compartilha a transação. Se o save da auditoria falhar, a transferência é desfeita.',
        code: `await em.save(em.create(AuditLog, {
  action: 'transfer', fromId, toId, amount,
}))`,
      },
    ],
    pitfalls: [
      'NUNCA use this.userRepo dentro do callback — o repositório injetado opera fora da transação.',
      'Não use synchronize:true em produção — sempre migrations.',
      'Locking pessimista pode causar deadlock — sempre adquira locks na mesma ordem.',
    ],
  },
  {
    title: 'Paginação cursor-based para feeds',
    category: 'Performance',
    goal: 'Paginar grandes datasets com performance constante, sem o degrade do skip/take em offsets grandes.',
    ingredients: [
      'Coluna ordenável (id, createdAt) com índice',
      'QueryBuilder',
      'Postgres ou MySQL',
    ],
    steps: [
      {
        title: 'Crie índice composto no banco (createdAt, id)',
        description: 'Necessário se a ordenação não for por coluna única — garante O(log N) na leitura do cursor.',
        code: `// migration
await qr.createIndex('post', new TableIndex({
  name: 'IDX_post_createdAt_id',
  columnNames: ['createdAt', 'id'],
}))`,
      },
      {
        title: 'Implemente o método com cursor composto',
        description: 'Use uma comparação tupla (createdAt, id) para evitar duplicatas em createdAt iguais.',
        code: `async listFeed(cursor?: { createdAt: Date; id: string }, limit = 20) {
  const qb = this.repo.createQueryBuilder('p')
    .orderBy('p.createdAt', 'DESC')
    .addOrderBy('p.id', 'DESC')
    .take(limit + 1) // +1 para detectar próxima página

  if (cursor) {
    qb.where(
      '(p.createdAt, p.id) < (:createdAt, :id)',
      { createdAt: cursor.createdAt, id: cursor.id },
    )
  }
  const rows = await qb.getMany()
  const hasNext = rows.length > limit
  const items = hasNext ? rows.slice(0, limit) : rows
  const nextCursor = hasNext
    ? { createdAt: items[items.length - 1].createdAt, id: items[items.length - 1].id }
    : null
  return { items, nextCursor }
}`,
      },
    ],
    variations: [
      'Para ordenação por coluna única (id auto-increment): use simples WHERE id < :cursor.',
      'Para "encoded cursor" use Buffer.from(JSON.stringify(cursor)).toString("base64") — esconde o formato do cliente.',
    ],
    pitfalls: [
      'skip/take degrada O(N) — banco faz scan físico de N registros ao pular.',
      'Sem índice composto, o cursor leva a sequential scan em tabelas grandes.',
      'Cursor stateful (em sessão) é frágil — sempre use cursor stateless via parâmetros.',
    ],
  },
  {
    title: 'Soft delete com restore e listagem de deletados',
    category: 'Repository',
    goal: 'Implementar deleção lógica com possibilidade de restauração e listagem de registros deletados.',
    ingredients: [
      '@DeleteDateColumn na entidade',
      'Repository injetado',
    ],
    steps: [
      {
        title: 'Adicione @DeleteDateColumn na entidade',
        description: 'TypeORM passa a filtrar deletados em todas as queries automaticamente.',
        code: `@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid') id: string
  @Column() title: string
  @DeleteDateColumn() deletedAt: Date | null
}`,
      },
      {
        title: 'Implemente os métodos no service',
        description: 'softDelete preenche deletedAt; restore limpa; withDeleted: true inclui ambos.',
        code: `async softRemove(id: string)   { return this.repo.softDelete(id) }
async restore(id: string)      { return this.repo.restore(id) }
async findAll(opts?: { withDeleted?: boolean }) {
  return this.repo.find({ withDeleted: opts?.withDeleted })
}
async findDeletedAfter(d: Date) {
  return this.repo.createQueryBuilder('p')
    .withDeleted()
    .where('p.deletedAt > :d', { d })
    .getMany()
}`,
      },
    ],
    pitfalls: [
      'Coluna UNIQUE + soft delete bloqueia re-cadastro do mesmo email após delete — use índice parcial WHERE deleted_at IS NULL.',
      '@BeforeRemove NÃO dispara em softDelete() — só em remove(entity).',
      'repo.delete() é DELETE direto — nunca soft. Use sempre softDelete() para deleção lógica.',
    ],
  },
  {
    title: 'Custom Repository encapsulando queries de domínio',
    category: 'Repository',
    goal: 'Encapsular QueryBuilder dentro de um repositório customizado (TypeORM 0.3) para que o serviço fique limpo.',
    ingredients: [
      '@EntityRepository (deprecated em 0.3) substituído por @Injectable + @InjectRepository',
      'NestJS module com forFeature',
    ],
    steps: [
      {
        title: 'Crie classe @Injectable que injeta Repository<T>',
        description: 'Sem @EntityRepository — apenas wrapper @Injectable do NestJS.',
        code: `@Injectable()
export class PostRepository {
  constructor(
    @InjectRepository(Post)
    private readonly repo: Repository<Post>,
  ) {}

  async findPublishedByAuthor(authorId: string, page: number, size = 20) {
    return this.repo.createQueryBuilder('post')
      .leftJoinAndSelect('post.tags', 'tag')
      .where('post.authorId = :authorId', { authorId })
      .andWhere('post.publishedAt IS NOT NULL')
      .orderBy('post.publishedAt', 'DESC')
      .take(size).skip((page - 1) * size)
      .getManyAndCount()
  }

  async findTrending(hours: number, limit: number) {
    return this.repo.createQueryBuilder('post')
      .where("post.publishedAt > NOW() - INTERVAL ':h hours'", { h: hours })
      .orderBy('post.views', 'DESC')
      .take(limit).getMany()
  }
}`,
      },
      {
        title: 'Registre como provider e injete no service',
        description: 'O service não toca em QueryBuilder direto — só chama métodos do repositório.',
        code: `@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  providers: [PostService, PostRepository],
  exports: [PostService],
})
export class PostModule {}

@Injectable()
export class PostService {
  constructor(private readonly repo: PostRepository) {}
  // service fica limpo — sem QueryBuilder raw
}`,
      },
    ],
    variations: [
      'Para testes: mocke a classe inteira via overrideProvider(PostRepository).useValue(mock).',
      'Para múltiplas conexões: passe o nome em @InjectRepository(Post, "reporting").',
    ],
    pitfalls: [
      '@EntityRepository foi removido em TypeORM 0.3 — use @Injectable.',
      'Nunca exponha QueryBuilder vazando da função — sempre retorne entidades ou DTOs.',
    ],
  },
  {
    title: 'Full-text search com PostgreSQL e índice GIN',
    category: 'Performance',
    goal: 'Implementar busca textual eficiente em milhões de registros usando tsvector e índice GIN.',
    ingredients: [
      'PostgreSQL com extensão pg_trgm (opcional)',
      'Migration para coluna gerada e índice',
      'QueryBuilder com raw where',
    ],
    steps: [
      {
        title: 'Migration: adicione coluna search_vector e índice GIN',
        description: 'Coluna GENERATED é mantida pelo banco automaticamente em todo INSERT/UPDATE.',
        code: `await qr.query(\`
  ALTER TABLE post
  ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('portuguese', title || ' ' || coalesce(body, ''))
  ) STORED
\`)
await qr.query(\`
  CREATE INDEX idx_post_search ON post USING GIN(search_vector)
\`)`,
      },
      {
        title: 'Use plainto_tsquery no QueryBuilder',
        description: 'plainto_tsquery aceita texto livre do usuário sem precisar parsear.',
        code: `async search(query: string, limit = 20) {
  return this.repo.createQueryBuilder('post')
    .where("post.search_vector @@ plainto_tsquery('portuguese', :q)", { q: query })
    .orderBy("ts_rank(post.search_vector, plainto_tsquery('portuguese', :q))", 'DESC')
    .take(limit)
    .getMany()
}`,
      },
    ],
    pitfalls: [
      'Sem índice GIN, o full-text scan é O(N) — inviável em tabelas grandes.',
      'to_tsquery espera operadores (& | !) — use plainto_tsquery para texto livre.',
      'Idiomas devem corresponder à configuração ("portuguese", "english") — mistura quebra a busca.',
    ],
  },
  {
    title: 'Múltiplos DataSources no NestJS',
    category: 'Configuração',
    goal: 'Configurar conexão com banco principal + read replica + ClickHouse de analytics no mesmo app.',
    ingredients: [
      '3 DataSources distintos com nomes únicos',
      'Entidades organizadas por banco',
    ],
    steps: [
      {
        title: 'Registre múltiplos forRoot com nome distinto',
        description: 'Sem nome, conflita. Cada DataSource precisa de identificador único.',
        code: `@Module({
  imports: [
    TypeOrmModule.forRoot({ /* default */ }),
    TypeOrmModule.forRoot({ name: 'reporting', type: 'postgres', /* ... */ }),
    TypeOrmModule.forRoot({ name: 'analytics', type: 'clickhouse', /* ... */ }),
  ],
})`,
      },
      {
        title: 'forFeature com nome em cada módulo',
        description: 'Especifique o DataSource no segundo argumento de forFeature.',
        code: `@Module({
  imports: [
    TypeOrmModule.forFeature([User, Post]),                  // default
    TypeOrmModule.forFeature([Report], 'reporting'),
    TypeOrmModule.forFeature([Event], 'analytics'),
  ],
})`,
      },
      {
        title: 'Injete repositórios da conexão correta',
        description: 'Sem o segundo argumento em @InjectRepository, vai pro DataSource default e quebra.',
        code: `@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report, 'reporting')
    private readonly reportRepo: Repository<Report>,
  ) {}
}`,
      },
    ],
    pitfalls: [
      'Transações NÃO cruzam DataSources — para atomicidade entre bancos use saga ou outbox.',
      'Esquecer o nome em forFeature OU em @InjectRepository: erro de DI difícil de debugar.',
      'Migrations precisam ser executadas POR DataSource — cada um tem sua tabela "migrations".',
    ],
  },
  {
    title: 'Índice parcial para soft delete + UNIQUE',
    category: 'Schema',
    goal: 'Permitir re-cadastro de email após soft delete sem violar UNIQUE constraint.',
    ingredients: [
      'PostgreSQL (suporte a partial index)',
      'Migration com query raw',
    ],
    steps: [
      {
        title: 'Remova o UNIQUE do @Column',
        description: 'O UNIQUE da coluna bloquearia re-cadastro mesmo de registros soft-deleted.',
        code: `@Entity()
export class User {
  @Column() // SEM { unique: true }
  email: string

  @DeleteDateColumn()
  deletedAt: Date | null
}`,
      },
      {
        title: 'Migration: crie índice único parcial WHERE deleted_at IS NULL',
        description: 'O UNIQUE só vale para registros ativos — registros deletados podem ter email duplicado.',
        code: `await qr.query(\`
  CREATE UNIQUE INDEX idx_user_email_active
  ON "user"(email)
  WHERE deleted_at IS NULL
\`)`,
      },
    ],
    pitfalls: [
      'MySQL não suporta partial index nativamente — use coluna virtual ou trigger.',
      'Esse índice não é detectado pelo migration:generate — sempre escreva migration manual.',
      'Aplicações antigas com UNIQUE simples + soft delete: a primeira pessoa a deletar a conta "trava" o email para sempre.',
    ],
  },
  {
    title: 'Locking pessimista para evitar race conditions',
    category: 'Concorrência',
    goal: 'Garantir que duas requisições simultâneas não ultrapassem o saldo de uma carteira.',
    ingredients: [
      'Postgres ou MySQL (suporte a SELECT FOR UPDATE)',
      'Operação dentro de transação',
    ],
    steps: [
      {
        title: 'Use lock pessimistic_write dentro da transação',
        description: 'SELECT FOR UPDATE bloqueia a linha até o COMMIT — outras transações esperam.',
        code: `await this.dataSource.transaction(async (em) => {
  const wallet = await em.findOneOrFail(Wallet, {
    where: { id: walletId },
    lock: { mode: 'pessimistic_write' },
  })

  if (wallet.balance < amount) {
    throw new Error('Saldo insuficiente')
  }

  wallet.balance -= amount
  await em.save(wallet)
})`,
      },
      {
        title: 'Considere optimistic locking quando concorrência for baixa',
        description: 'Versão na linha — se conflito, TypeORM lança OptimisticLockVersionMismatchError.',
        code: `@Entity()
export class Wallet {
  @VersionColumn() version: number  // TypeORM gerencia
}

await em.findOneOrFail(Wallet, {
  where: { id }, lock: { mode: 'optimistic', version: 3 },
})`,
      },
    ],
    pitfalls: [
      'Locks pessimistas em ordem inconsistente entre transações = deadlock. Sempre adquira locks na mesma ordem (ex: por id ASC).',
      'Optimistic locking precisa que o cliente envie a version atual — não funciona em fluxos onde o cliente não conhece a versão.',
      'Lock fora de transação não tem efeito — TypeORM exige transação para locks pessimistas.',
    ],
  },
]

// ── Dados: Migrations CLI ─────────────────────────────────────────────────────────

const MIGRATIONS_COMMANDS: CommandEntry[] = [
  {
    category: 'Geração',
    command: 'typeorm migration:generate',
    description: 'Compara o schema atual do banco com as entidades TypeScript e gera uma migration com o diff em SQL. Não executa nada — só cria o arquivo.',
    flags: [
      { flag: '-d <path>', description: 'Caminho do DataSource (obrigatório).' },
      { flag: '<output>', description: 'Caminho de saída da migration (sem timestamp — TypeORM adiciona).' },
      { flag: '-p, --pretty', description: 'Formata o SQL gerado para múltiplas linhas legíveis.' },
      { flag: '--dr, --dry-run', description: 'Mostra o SQL sem criar o arquivo (apenas inspeção).' },
    ],
    example: 'npx typeorm migration:generate -d src/data-source.ts src/migrations/AddUserPhone',
    output: 'Created: src/migrations/1710000000001-AddUserPhone.ts',
  },
  {
    category: 'Geração',
    command: 'typeorm migration:create',
    description: 'Cria uma migration vazia com timestamp — você implementa up() e down() manualmente. Use para mudanças que generate não detecta (índice parcial, dados, função SQL).',
    flags: [
      { flag: '<output>', description: 'Caminho da migration. NÃO precisa de DataSource (não inspeciona o banco).' },
    ],
    example: 'npx typeorm migration:create src/migrations/AddPartialIndex',
    output: 'Created empty migration: src/migrations/1710000000002-AddPartialIndex.ts',
  },
  {
    category: 'Execução',
    command: 'typeorm migration:run',
    description: 'Aplica todas as migrations pendentes em ordem cronológica (timestamp). Idempotente — só executa migrations que não estão na tabela "migrations" do banco.',
    flags: [
      { flag: '-d <path>', description: 'Caminho do DataSource (obrigatório).' },
      { flag: '-t, --transaction <mode>', description: 'all (default), each (uma transação por migration), none (sem transação).' },
      { flag: '--fake', description: 'Marca como aplicada sem executar SQL. Use apenas para sincronizar histórico em ambientes legados.' },
    ],
    example: 'npx typeorm migration:run -d src/data-source.ts',
    output: '1 migrations are already loaded in the database. New migrations: AddUserPhone1710000000001',
  },
  {
    category: 'Execução',
    command: 'typeorm migration:revert',
    description: 'Executa o método down() da ÚLTIMA migration aplicada. Para reverter N migrations, execute N vezes.',
    danger: true,
    flags: [
      { flag: '-d <path>', description: 'Caminho do DataSource (obrigatório).' },
      { flag: '-t, --transaction <mode>', description: 'all, each, none — mesmo da migration:run.' },
    ],
    example: 'npx typeorm migration:revert -d src/data-source.ts',
    output: 'Reverted: AddUserPhone1710000000001',
  },
  {
    category: 'Inspeção',
    command: 'typeorm migration:show',
    description: 'Lista todas as migrations e seu status: [X] aplicada, [ ] pendente. Não executa nada.',
    flags: [
      { flag: '-d <path>', description: 'Caminho do DataSource (obrigatório).' },
    ],
    example: 'npx typeorm migration:show -d src/data-source.ts',
    output: '[X] CreateUsers1709000000000\n[X] AddUserPhone1710000000001\n[ ] AddPartialIndex1710000000002',
  },
  {
    category: 'Schema',
    command: 'typeorm schema:sync',
    description: 'Equivalente a synchronize:true via CLI. Compara entidades com schema do banco e emite ALTER/DROP/CREATE automaticamente. NUNCA use em produção.',
    danger: true,
    flags: [
      { flag: '-d <path>', description: 'Caminho do DataSource (obrigatório).' },
    ],
    example: 'npx typeorm schema:sync -d src/data-source.ts',
    output: 'Schema synchronization will execute following sql queries: ALTER TABLE...',
  },
  {
    category: 'Schema',
    command: 'typeorm schema:drop',
    description: 'Apaga TODO o schema (todas as tabelas, índices, funções) do banco configurado no DataSource. Operação destrutiva irreversível sem backup.',
    danger: true,
    flags: [
      { flag: '-d <path>', description: 'Caminho do DataSource (obrigatório).' },
    ],
    example: 'npx typeorm schema:drop -d src/data-source.ts',
    output: 'Schema drop has been completed.',
  },
  {
    category: 'Inspeção',
    command: 'typeorm query',
    description: 'Executa uma query SQL arbitrária via DataSource configurado. Útil para debug rápido sem abrir psql ou cliente externo.',
    flags: [
      { flag: '-d <path>', description: 'Caminho do DataSource (obrigatório).' },
      { flag: '<query>', description: 'String SQL a executar (use aspas para escape).' },
    ],
    example: `npx typeorm query -d src/data-source.ts "SELECT COUNT(*) FROM users WHERE deleted_at IS NULL"`,
    output: '[ { count: "1247" } ]',
  },
  {
    category: 'Cache',
    command: 'typeorm cache:clear',
    description: 'Limpa o cache de queries do TypeORM (quando configurado com cache:true no DataSource). Não afeta queries sem cache.',
    flags: [
      { flag: '-d <path>', description: 'Caminho do DataSource (obrigatório).' },
    ],
    example: 'npx typeorm cache:clear -d src/data-source.ts',
    output: 'Cache was successfully cleared',
  },
  {
    category: 'Workflow seguro',
    command: '# fluxo do generate ao deploy',
    description: 'Sequência canônica: alterar entidade → generate → revisar SQL → commit migration + entidade JUNTOS → testar em staging → deploy executa migration:run antes de subir pods.',
    example: `# 1. Local — gere a migration
npx typeorm migration:generate -d src/data-source.ts src/migrations/AddCol

# 2. Revise o arquivo gerado — veja o SQL
# 3. Commit atomico (entidade + migration)
git add src/entities/user.ts src/migrations/*-AddCol.ts
git commit -m "feat(user): add column"

# 4. Staging
npx typeorm migration:run -d dist/data-source.js
# 5. Verifique migration:show — deve aparecer [X]
# 6. Deploy CI/CD: init container roda migration:run`,
  },
]

// ── Registry de Builders ──────────────────────────────────────────────────────────

const PDF_BUILDERS: Record<string, PdfBuilderFn> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'TypeORM',
    stackLabel: 'TypeORM 0.3 / NestJS',
    badgeLabel: 'Q&A Review',
    coverTitle: 'As 20 perguntas mais cobradas em entrevista TypeORM',
    coverSubtitle: 'Respostas estruturadas para nível pleno e sênior. Use para revisão ativa: leia a pergunta, tente responder de cabeça, depois confira.',
  }),

  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'TypeORM',
    accentColor: C,
    stackLabel: 'TypeORM 0.3 / NestJS',
    coverTitle: 'Decorators, QueryBuilder API, CLI e regras numa página',
    coverSubtitle: 'Referência densa: todos os decorators de entidade e relação, QueryBuilder API, operadores find() e as regras críticas de TypeORM.',
    sections: {
      hooks: DECORATORS,
      hooksExtra: RELATIONS,
      depRows: [],
      rules: TYPEORM_RULES,
      performanceTips: [
        'Nunca eager: true em relações de lista — carregue explicitamente com relations: {}.',
        'Use getManyAndCount() para paginação em vez de duas queries separadas.',
        'Índices compostos em colunas usadas juntas em WHERE + ORDER BY.',
        'Connection pool: extra.max ajustado ao número de CPUs e instâncias.',
        'PgBouncer para múltiplas instâncias — evita exceder max_connections do Postgres.',
      ],
      patterns: [
        { name: 'DataMapper', code: '@InjectRepository(User) private repo: Repository<User>', desc: 'Repositório injetável e mockável. Entidade é POJO. Padrão NestJS.' },
        { name: 'Custom Repository', code: '@Injectable() class UserRepo { constructor(@InjectRepository(User) private repo) {} }', desc: 'Encapsula queries de domínio. Serviço fica limpo de QueryBuilder raw.' },
        { name: 'Transaction callback', code: 'dataSource.transaction(async em => { await em.save(...) })', desc: 'Rollback automático em exceção. Use "em" do callback — não o repo injetado.' },
      ],
      mentalModels: [
        'FK sempre no lado @ManyToOne (lado Many). @OneToMany não cria coluna.',
        'synchronize: false em produção. Sempre. Sem exceção.',
        'Migration aplicada = imutável. Crie nova para corrigir.',
        'QueryBuilder: parâmetros :named SEMPRE. Nunca template literal.',
        'Transação: use EntityManager do callback, não repositório injetado.',
      ],
    },
  }),

  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'TypeORM',
    stackLabel: 'TypeORM 0.3 / NestJS',
    coverTitle: 'Os 5 truques que grudam TypeORM na memória',
    coverSubtitle: 'Associações verbais para FK, @JoinTable, synchronize, transação com EM e imutabilidade de migrations. Repita em voz alta — ancora melhor que ler.',
  }),

  antipatterns: () => buildAntipatternsPdf({
    antipatterns: ANTIPATTERNS,
    accentColor: C,
    skillName: 'TypeORM',
    stackLabel: 'TypeORM 0.3 / NestJS',
    coverTitle: 'Os 8 erros mais comuns com TypeORM',
    coverSubtitle: 'Cada anti-pattern com código errado x correto e a explicação técnica. Reconhecimento de padrão é mais rápido que pensar do zero em entrevistas.',
  }),

  mindmap: () => buildMindmapPdf({
    categories: MINDMAP_CATEGORIES,
    checklist: MINDMAP_CHECKLIST,
    accentColor: C,
    skillName: 'TypeORM',
    stackLabel: 'TypeORM 0.3 / NestJS',
    coverTitle: 'TypeORM do zero ao sênior em uma folha',
    coverSubtitle: '9 categorias do ecossistema TypeORM e checklist de 10 perguntas para auto-avaliar o domínio antes de uma entrevista backend.',
  }),

  recipes: () => buildRecipeBookPdf({
    recipes: RECIPES,
    accentColor: C,
    skillName: 'TypeORM',
    stackLabel: 'TypeORM 0.3 / NestJS',
    coverTitle: '8 receitas TypeORM para o dia a dia',
    coverSubtitle: 'Transação atômica, paginação cursor-based, soft delete + restore, custom repository, full-text search, multi-database, índice parcial e locking pessimista. Cada receita com ingredientes, passos e armadilhas.',
  }),

  'migrations-cli': () => buildCommandRefPdf({
    commands: MIGRATIONS_COMMANDS,
    accentColor: C,
    skillName: 'TypeORM',
    stackLabel: 'TypeORM 0.3 / NestJS',
    coverTitle: 'Referência completa do CLI typeorm',
    coverSubtitle: 'Todos os comandos: migration:generate, run, revert, show, create — com flags, exemplos e SQL gerado. Comandos destrutivos sinalizados. Inclui o fluxo seguro do generate ao deploy.',
  }),
}

// ── Main Export ───────────────────────────────────────────────────────────────────

export default function TypeormPdfs() {
  const [open, setOpen] = useState<PdfCard | null>(null)

  const featured = PDF_CARDS.find(c => c.featured)
  const collection = PDF_CARDS.filter(c => !c.featured)

  return (
    <div style={{ fontFamily: "'JetBrains Mono',monospace" }}>
      {/* Cabeçalho */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
          <p style={{ color: FG, fontSize: 16, fontWeight: 800, margin: 0, letterSpacing: 0.3 }}>TypeORM — Guias de bolso</p>
          <span style={{ color: C, fontSize: 11, padding: '3px 9px', borderRadius: 999, background: `${C}15`, border: `1px solid ${C}44`, fontWeight: 700 }}>
            7 PDFs · 30 páginas
          </span>
        </div>
        <p style={{ color: FGMUTE, fontSize: 12, margin: 0, lineHeight: 1.65, maxWidth: 720 }}>
          Artefatos de revisão cognitiva e referência prática para o dia a dia com TypeORM. Cada PDF é pensado para um objetivo: recuperação ativa, consulta rápida, memória de longo prazo, reconhecimento de padrão, mapeamento mental, implementação rápida e referência de comandos do CLI.
        </p>
      </div>

      {/* Hero Card */}
      {featured && (
        <HeroCard
          card={featured}
          onOpen={() => setOpen(featured)}
          accent={C}
        />
      )}

      {/* Collection Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
        {collection.map(card => (
          <CollectionCard
            key={card.id}
            card={card}
            onOpen={() => setOpen(card)}
            accent={C}
          />
        ))}
      </div>

      {/* Modal */}
      {open && (
        <PdfModal
          card={open}
          onClose={() => setOpen(null)}
          builders={PDF_BUILDERS}
          accent={C}
        />
      )}
    </div>
  )
}
