'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ConceptCarousel } from '@/components/visuals/ConceptCarousel'
import type { Slide } from '@/components/visuals/ConceptCarousel'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { CardCarousel } from '@/components/visuals/CardCarousel'
import type { CarouselCard } from '@/components/visuals/CardCarousel'
import { HookTimeline } from '@/components/visuals/HookTimeline'
import type { TimelinePhase } from '@/components/visuals/HookTimeline'
import { DiffViewer } from '@/components/visuals/DiffViewer'
import type { DiffExample } from '@/components/visuals/DiffViewer'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'

// ── Paleta TypeORM ────────────────────────────────────────────────────────────────
const C      = '#E83E8C'   // TypeORM pink/magenta
const BG     = '#0f1117'
const CARD   = '#1a1f2e'
const CARD2  = '#222840'
const LINE   = '#2d3448'
const MUTE   = '#475569'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const RED    = '#ef4444'
const GRN    = '#4ade80'
const AMB    = '#f59e0b'
const SKY    = '#38bdf8'
const PRP    = '#a78bfa'
const GOLD   = '#fbbf24'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Como o TypeORM Funciona (Conceitos fundamentais)
// ═══════════════════════════════════════════════════════════════════════════════

function IllustrationDataSource() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'center', height: 190 }}>
      <div style={{ background: BG, border: `1px solid ${C}40`, borderRadius: 10, padding: 14, fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, lineHeight: 1.8 }}>
        <div style={{ color: MUTE, marginBottom: 4, fontSize: 9 }}>data-source.ts</div>
        <div><span style={{ color: PRP }}>new</span> <span style={{ color: AMB }}>DataSource</span>{'({'}</div>
        <div style={{ paddingLeft: 12 }}><span style={{ color: SKY }}>type</span>: <span style={{ color: GRN }}>'postgres'</span>,</div>
        <div style={{ paddingLeft: 12 }}><span style={{ color: SKY }}>url</span>: <span style={{ color: GRN }}>process.env.DB_URL</span>,</div>
        <div style={{ paddingLeft: 12 }}><span style={{ color: SKY }}>entities</span>: [User],</div>
        <div style={{ paddingLeft: 12 }}><span style={{ color: C }}>synchronize</span>: <span style={{ color: RED }}>false</span>,</div>
        <div>{'}'}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 2, height: 60, background: `linear-gradient(to bottom, ${C}, ${SKY})`, borderRadius: 1 }} />
        <div style={{ fontSize: 10, color: FGMUTE, textAlign: 'center', width: 60 }}>connection pool</div>
        <div style={{ width: 2, height: 60, background: `linear-gradient(to bottom, ${SKY}, ${GRN})`, borderRadius: 1 }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ background: BG, border: `1px solid ${GRN}50`, borderRadius: 8, padding: 10, textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: GRN, fontWeight: 700, marginBottom: 2 }}>PostgreSQL</div>
          <div style={{ fontSize: 9, color: MUTE }}>banco de dados</div>
        </div>
        <div style={{ background: BG, border: `1px solid ${SKY}50`, borderRadius: 8, padding: 10, textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: SKY, fontWeight: 700, marginBottom: 2 }}>Repository</div>
          <div style={{ fontSize: 9, color: MUTE }}>getRepository(User)</div>
        </div>
      </div>
    </div>
  )
}

function IllustrationEntity() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'center', height: 190 }}>
      <div style={{ background: BG, border: `1px solid ${AMB}40`, borderRadius: 10, padding: 14, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, lineHeight: 1.8 }}>
        <div style={{ color: MUTE, fontSize: 9, marginBottom: 4 }}>user.entity.ts</div>
        <div><span style={{ color: C }}>@Entity</span>()</div>
        <div><span style={{ color: PRP }}>class</span> <span style={{ color: AMB }}>User</span> {'{'}</div>
        <div style={{ paddingLeft: 12 }}><span style={{ color: C }}>@PrimaryGeneratedColumn</span>(<span style={{ color: GRN }}>'uuid'</span>)</div>
        <div style={{ paddingLeft: 12 }}>id: <span style={{ color: SKY }}>string</span></div>
        <div style={{ paddingLeft: 12 }}><span style={{ color: C }}>@Column</span>({'{'} <span style={{ color: SKY }}>unique</span>: <span style={{ color: RED }}>true</span> {'}'})</div>
        <div style={{ paddingLeft: 12 }}>email: <span style={{ color: SKY }}>string</span></div>
        <div>{'}'}</div>
      </div>
      <div style={{ fontSize: 22, color: AMB }}>→</div>
      <div style={{ background: BG, border: `1px solid ${GRN}50`, borderRadius: 10, padding: 14, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, lineHeight: 1.8 }}>
        <div style={{ color: MUTE, fontSize: 9, marginBottom: 4 }}>SQL gerado</div>
        <div style={{ color: GOLD }}>CREATE TABLE</div>
        <div style={{ color: FG }}>  users {'('}</div>
        <div style={{ color: FG }}>    id UUID PK,</div>
        <div style={{ color: GRN }}>    email VARCHAR UNIQUE,</div>
        <div style={{ color: FGMUTE }}>    created_at TS,</div>
        <div style={{ color: FG }}>  {')'}</div>
      </div>
    </div>
  )
}

function IllustrationRepository() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'center', height: 190 }}>
      <div style={{ background: BG, border: `1px solid ${SKY}40`, borderRadius: 10, padding: 14, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, lineHeight: 1.8 }}>
        <div style={{ color: MUTE, fontSize: 9, marginBottom: 4 }}>user.service.ts</div>
        <div><span style={{ color: C }}>@Injectable</span>()</div>
        <div><span style={{ color: PRP }}>class</span> <span style={{ color: AMB }}>UserService</span> {'{'}</div>
        <div style={{ paddingLeft: 12 }}><span style={{ color: PRP }}>constructor</span>(</div>
        <div style={{ paddingLeft: 20 }}><span style={{ color: C }}>@InjectRepository</span>(User)</div>
        <div style={{ paddingLeft: 20 }}><span style={{ color: PRP }}>private</span> repo: <span style={{ color: SKY }}>Repository&lt;User&gt;</span></div>
        <div style={{ paddingLeft: 12 }}>) {'{}'}</div>
        <div>{'}'}</div>
      </div>
      <div style={{ fontSize: 22, color: SKY }}>→</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {['find()', 'findOne()', 'save()', 'softDelete()', 'createQueryBuilder()'].map(m => (
          <div key={m} style={{ background: BG, border: `1px solid ${SKY}30`, borderRadius: 6, padding: '5px 10px', fontSize: 10, color: SKY, fontFamily: "'JetBrains Mono', monospace" }}>
            repo.{m}
          </div>
        ))}
      </div>
    </div>
  )
}

const CONCEITOS_SLIDES: Slide[] = [
  {
    title: 'DataSource — a conexão com o banco',
    paragraphs: [
      'DataSource é o ponto de entrada do TypeORM: configura a conexão, o pool, as entidades e as migrations.',
      'Deve ser criado uma única vez e compartilhado. Em NestJS: TypeOrmModule.forRoot() faz isso automaticamente.',
      'Nunca use synchronize: true em produção — ele emite DDL automático incluindo DROP COLUMN.',
    ],
    gradient: [C, PRP],
    illustration: <IllustrationDataSource />,
  },
  {
    title: 'Entity — mapeamento de classe para tabela',
    paragraphs: [
      '@Entity() declara que a classe representa uma tabela. Decorators mapeiam propriedades para colunas com type safety via reflect-metadata.',
      '@PrimaryGeneratedColumn() cria uma chave primária auto-increment. Use ("uuid") para UUID v4.',
      '@CreateDateColumn, @UpdateDateColumn e @DeleteDateColumn são timestamps gerenciados automaticamente pelo TypeORM.',
    ],
    gradient: [AMB, GOLD],
    illustration: <IllustrationEntity />,
  },
  {
    title: 'Repository — interface para o banco',
    paragraphs: [
      'Repository<T> é a interface tipada para interagir com as entidades: find, save, delete, createQueryBuilder.',
      'No NestJS com DataMapper, o repositório é injetado via @InjectRepository(Entity) — pode ser mockado em testes.',
      'Custom Repository: classe @Injectable que injeta o Repository<T> e adiciona métodos com nomes de domínio.',
    ],
    gradient: [SKY, C],
    illustration: <IllustrationRepository />,
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Relações (Explorer interativo)
// ═══════════════════════════════════════════════════════════════════════════════

const RELATIONS_CARDS: CarouselCard[] = [
  {
    name: '@ManyToOne',
    signature: '@ManyToOne(() => User, u => u.posts)',
    emoji: 'N→1',
    color: SKY,
    use: [
      'Post → User: muitos posts pertencem a um autor.',
      'FK fica NESTA entidade (lado Many): TypeORM cria coluna userId.',
      'É o mais comum — toda relação N:1 usa @ManyToOne no lado filho.',
    ],
    dontUse: 'Não use quando a relação é 1:1 — use @OneToOne com @JoinColumn.',
    difficulty: 1,
  },
  {
    name: '@OneToMany',
    signature: '@OneToMany(() => Post, p => p.user)',
    emoji: '1→N',
    color: GRN,
    use: [
      'User → Post[]: um autor tem muitos posts.',
      'Sem FK aqui — FK está no Post (@ManyToOne). Precisa do 2º argumento (função inversa).',
      'Sem @OneToMany, você ainda pode buscar posts por userId — mas não navegar user.posts.',
    ],
    dontUse: 'Não declare @OneToMany sem o @ManyToOne correspondente na outra entidade — TypeORM exige a relação inversa.',
    difficulty: 1,
  },
  {
    name: '@OneToOne',
    signature: '@OneToOne(() => Profile) @JoinColumn()',
    emoji: '1:1',
    color: AMB,
    use: [
      'User → Profile: cada usuário tem exatamente um perfil.',
      '@JoinColumn() OBRIGATÓRIO — define qual lado tem a FK.',
      'O lado com @JoinColumn é o "owner" e tem a FK no banco.',
    ],
    dontUse: 'Não esqueça @JoinColumn — sem ele TypeORM não sabe qual lado tem a FK e gera erro de schema.',
    difficulty: 2,
  },
  {
    name: '@ManyToMany + @JoinTable',
    signature: '@ManyToMany(() => Tag) @JoinTable()',
    emoji: 'N:M',
    color: C,
    use: [
      'Post ↔ Tag: um post tem muitas tags, uma tag pertence a muitos posts.',
      '@JoinTable() OBRIGATÓRIO no lado owner — cria a tabela intermediária post_tags_tag.',
      'Apenas um lado deve ter @JoinTable — o outro declara @ManyToMany com a função inversa.',
    ],
    dontUse: 'Não declare @JoinTable nos dois lados — TypeORM criaria duas tabelas intermediárias.',
    difficulty: 2,
  },
  {
    name: 'eager vs lazy loading',
    signature: '{ eager: true } vs relations: { posts: true }',
    emoji: 'load',
    color: PRP,
    use: [
      'Lazy (padrão): relação NÃO é carregada automaticamente. Declare o que quer em cada query.',
      'Explícito: repo.find({ relations: { posts: true } }) ou leftJoinAndSelect no QB.',
      'eager: true só em relações pequenas e sempre necessárias (ex: Role em User).',
    ],
    dontUse: 'Não use eager: true em relações de lista grande — pode multiplicar por N o tamanho do resultado e gerar queries enormes.',
    difficulty: 2,
  },
  {
    name: 'cascade e onDelete',
    signature: '{ cascade: true } vs { onDelete: "CASCADE" }',
    emoji: 'del',
    color: RED,
    use: [
      'cascade: true (app-level): TypeORM propaga save/remove para a relação.',
      'onDelete: "CASCADE" (banco-level): FK constraint — banco deleta automaticamente.',
      'Escolha um ou outro. Nunca os dois ao mesmo tempo para evitar comportamento duplo.',
    ],
    dontUse: 'Cuidado com cascade: true em @ManyToMany — pode deletar entidades que pertencem a outros registros.',
    difficulty: 3,
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — QueryBuilder (Simulador código TS → SQL)
// ═══════════════════════════════════════════════════════════════════════════════

function QueryBuilderSimulator() {
  const examples = [
    {
      id: 'basic',
      label: 'Query básica com JOIN',
      ts: `const posts = await postRepo
  .createQueryBuilder('post')
  .leftJoinAndSelect('post.author', 'author')
  .where('post.published = :pub', { pub: true })
  .orderBy('post.createdAt', 'DESC')
  .take(10)
  .getMany()`,
      sql: `SELECT post.*, author.*
FROM post
LEFT JOIN users author ON author.id = post.author_id
WHERE post.published = $1
ORDER BY post.created_at DESC
LIMIT 10`,
      note: 'leftJoinAndSelect carrega a relação author. Parâmetros :named → $1 (nunca interpolados)',
    },
    {
      id: 'paginate',
      label: 'Paginação com total',
      ts: `const [posts, total] = await postRepo
  .createQueryBuilder('post')
  .leftJoinAndSelect('post.author', 'a')
  .where('a.active = :active', { active: true })
  .andWhere('post.publishedAt IS NOT NULL')
  .orderBy('post.publishedAt', 'DESC')
  .take(pageSize)
  .skip((page - 1) * pageSize)
  .getManyAndCount()`,
      sql: `SELECT post.*, a.*, COUNT(*) OVER()
FROM post
LEFT JOIN users a ON a.id = post.author_id
WHERE a.active = $1
  AND post.published_at IS NOT NULL
ORDER BY post.published_at DESC
LIMIT $2 OFFSET $3`,
      note: 'getManyAndCount() → [Post[], number] em uma query. Indispensável para paginação com total.',
    },
    {
      id: 'subquery',
      label: 'Subquery',
      ts: `const sub = postRepo
  .createQueryBuilder('p')
  .select('p.authorId')
  .where('p.views > :min', { min: 100 })

const authors = await userRepo
  .createQueryBuilder('u')
  .where(\`u.id IN (\${sub.getQuery()})\`)
  .setParameters(sub.getParameters())
  .getMany()`,
      sql: `SELECT u.*
FROM users u
WHERE u.id IN (
  SELECT p.author_id
  FROM post p
  WHERE p.views > $1
)`,
      note: 'setParameters() propaga os params da subquery para a query externa — evita conflito de nomes.',
    },
    {
      id: 'injection',
      label: 'SQL injection — errado vs correto',
      ts: `// ERRADO — vulnerável a SQL injection!
.where(\`post.userId = \${userId}\`)

// CORRETO — parâmetro nomeado
.where('post.userId = :id', { id: userId })

// Arrays — sintaxe :...spread
.where('post.id IN (:...ids)', { ids: [1,2,3] })
// → WHERE post.id IN ($1, $2, $3)`,
      sql: `-- ERRADO (userId = "1 OR 1=1"):
WHERE post.user_id = 1 OR 1=1
-- → retorna TODOS os registros!

-- CORRETO:
WHERE post.user_id = $1
-- $1 = valor parametrizado pelo driver`,
      note: 'TypeORM com parâmetros nomeados usa prepared statements — o banco nunca vê o valor bruto.',
    },
  ]

  const [active, setActive] = useState(0)
  const ex = examples[active]

  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: C, letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>
          QueryBuilder — TypeScript → SQL
        </div>
        <div style={{ fontSize: 12, color: FGMUTE, marginBottom: 16 }}>
          Selecione um exemplo para ver o TypeScript e o SQL equivalente gerado
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
          {examples.map((e, i) => (
            <button key={e.id} onClick={() => setActive(i)} style={{
              padding: '6px 12px', borderRadius: 6, border: `1px solid ${active === i ? C : LINE}`,
              background: active === i ? `${C}18` : 'transparent', color: active === i ? C : FGMUTE,
              cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', fontWeight: active === i ? 600 : 400,
            }}>
              {e.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <div style={{ fontSize: 9, color: SKY, letterSpacing: '.1em', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase' }}>TypeScript</div>
          <pre style={{
            background: BG, border: `1px solid ${SKY}40`, borderRadius: 8,
            padding: 14, fontSize: 10.5, lineHeight: 1.8, color: FGMUTE,
            margin: 0, overflowX: 'auto', whiteSpace: 'pre',
          }}>
            {ex.ts}
          </pre>
        </div>
        <div>
          <div style={{ fontSize: 9, color: AMB, letterSpacing: '.1em', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase' }}>SQL gerado</div>
          <pre style={{
            background: BG, border: `1px solid ${AMB}40`, borderRadius: 8,
            padding: 14, fontSize: 10.5, lineHeight: 1.8, color: GOLD,
            margin: 0, overflowX: 'auto', whiteSpace: 'pre',
          }}>
            {ex.sql}
          </pre>
        </div>
      </div>

      {ex.note && (
        <div style={{ marginTop: 12, background: `${C}12`, border: `1px solid ${C}30`, borderRadius: 8, padding: '10px 14px', fontSize: 11, color: FGMUTE, lineHeight: 1.6 }}>
          <span style={{ color: C, fontWeight: 700 }}>Nota: </span>{ex.note}
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Migration Lifecycle (Timeline interativo)
// ═══════════════════════════════════════════════════════════════════════════════

function MigrationTimeline() {
  const [active, setActive] = useState(0)

  const steps = [
    {
      num: '01', label: 'Alterar entidade', color: SKY,
      cmd: null,
      desc: 'Modifique a entidade TypeScript: adicione @Column, crie nova @Entity, mude tipo de coluna, adicione @Index.',
      code: `// user.entity.ts — adicione o novo campo
@Column({ nullable: true })
phone: string | null  // ← nova coluna`,
      warn: null,
    },
    {
      num: '02', label: 'Gerar migration', color: AMB,
      cmd: 'npx typeorm migration:generate -d src/data-source.ts src/migrations/AddUserPhone',
      desc: 'TypeORM compara as entidades com o schema atual do banco e gera o SQL de diff automaticamente.',
      code: `// src/migrations/AddUserPhone1710000000001.ts
export class AddUserPhone1710000000001 implements MigrationInterface {
  async up(qr: QueryRunner) {
    await qr.addColumn('users', new TableColumn({
      name: 'phone', type: 'varchar', isNullable: true,
    }))
  }
  async down(qr: QueryRunner) {
    await qr.dropColumn('users', 'phone')
  }
}`,
      warn: null,
    },
    {
      num: '03', label: 'Revisar SQL', color: GOLD,
      cmd: null,
      desc: 'OBRIGATÓRIO: revise o SQL gerado na migration antes de commitar. TypeORM pode gerar ALTER TABLE inesperados.',
      code: `// Verificar:
// ✓ ALTER TABLE adiciona coluna correta?
// ✓ Há DROP COLUMN inesperado?
// ✓ Tipos estão corretos para o banco?
// ✓ down() faz rollback corretamente?

// NUNCA edite uma migration após aplicá-la!
// Imutável após executar em qualquer ambiente.`,
      warn: 'Nunca edite após aplicar — crie uma nova migration de correção.',
    },
    {
      num: '04', label: 'Commitar', color: GRN,
      cmd: 'git add src/migrations/AddUserPhone1710000000001.ts src/entities/user.entity.ts',
      desc: 'A migration deve ser commitada junto com a mudança de entidade. Ambos formam um par — nunca versionados separados.',
      code: `// Commit atômico — entidade + migration juntos
git commit -m "feat(user): add phone column

- user.entity.ts: @Column phone nullable
- migration: AddUserPhone1710000000001"`,
      warn: null,
    },
    {
      num: '05', label: 'Testar em staging', color: C,
      cmd: 'npx typeorm migration:run -d src/data-source.ts',
      desc: 'Execute migration:run em staging ANTES da produção. Verifique se o SQL executou sem erros e se a aplicação funciona.',
      code: `// Verificar após migration:run:
// ✓ migration:show mostra como "applied"
// ✓ Coluna existe no banco
// ✓ App funciona sem erros
// ✓ Testar migration:revert (down()) funciona

npx typeorm migration:show -d src/data-source.ts`,
      warn: null,
    },
    {
      num: '06', label: 'Deploy em produção', color: PRP,
      cmd: 'npx typeorm migration:run -d src/data-source.ts',
      desc: 'CI/CD executa migration:run como step antes do deploy. TypeORM aplica apenas as migrations ainda não registradas.',
      code: `# .github/workflows/deploy.yml
- name: Run migrations
  run: npx typeorm migration:run -d dist/data-source.js

- name: Deploy app
  run: kubectl rollout restart deployment/app`,
      warn: null,
    },
    {
      num: 'RV', label: 'Rollback', color: RED,
      cmd: 'npx typeorm migration:revert -d src/data-source.ts',
      desc: 'migration:revert executa o método down() da última migration aplicada. Use em emergências. Execute quantas vezes for necessário para voltar N versões.',
      code: `// Revert executa down() da última migration:
// ALTER TABLE users DROP COLUMN phone

// Para reverter N migrations:
npx typeorm migration:revert -d src/data-source.ts
npx typeorm migration:revert -d src/data-source.ts
// (executar N vezes)`,
      warn: 'down() precisa estar implementado corretamente. Migrations sem down() bloqueiam o rollback de emergência.',
    },
  ]

  const step = steps[active]

  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: C, letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>
          Migration Lifecycle
        </div>
        <div style={{ fontSize: 12, color: FGMUTE, marginBottom: 16 }}>
          Clique em cada etapa para ver o comando e o código correspondente
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' as const }}>
          {steps.map((s, i) => (
            <button key={s.num} onClick={() => setActive(i)} style={{
              padding: '6px 12px', borderRadius: 6,
              border: `1px solid ${active === i ? s.color : LINE}`,
              background: active === i ? `${s.color}18` : 'transparent',
              color: active === i ? s.color : FGMUTE,
              cursor: 'pointer', fontSize: 11, fontFamily: 'inherit',
              fontWeight: active === i ? 700 : 400,
            }}>
              {s.num} {s.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: BG, border: `1px solid ${step.color}40`, borderTop: `2px solid ${step.color}`, borderRadius: 8, padding: 16 }}>
        <div style={{ fontSize: 12, color: FG, fontWeight: 600, marginBottom: 6 }}>{step.label}</div>
        <div style={{ fontSize: 11, color: FGMUTE, marginBottom: 12, lineHeight: 1.6 }}>{step.desc}</div>

        {step.cmd && (
          <div style={{ background: `${step.color}10`, border: `1px solid ${step.color}30`, borderRadius: 6, padding: '8px 12px', marginBottom: 12, fontSize: 11, color: step.color }}>
            $ {step.cmd}
          </div>
        )}

        <pre style={{
          background: CARD2, border: `1px solid ${LINE}`, borderRadius: 8,
          padding: 12, fontSize: 10.5, lineHeight: 1.8, color: FGMUTE,
          margin: 0, overflowX: 'auto', whiteSpace: 'pre',
        }}>
          {step.code}
        </pre>

        {step.warn && (
          <div style={{ marginTop: 10, background: `${RED}10`, border: `1px solid ${RED}30`, borderRadius: 6, padding: '8px 12px', fontSize: 11, color: RED, lineHeight: 1.5 }}>
            Aviso: {step.warn}
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — N+1 Problem (Visualizador antes/depois)
// ═══════════════════════════════════════════════════════════════════════════════

const N1_DIFFS: DiffExample[] = [
  {
    id: 'n1-loop',
    label: 'N+1 no loop',
    description: 'Acessar relação não carregada dentro de um loop gera uma query por iteração',
    beforeLabel: 'Com N+1 (ruim)',
    afterLabel: 'Com join explícito (bom)',
    before: `const posts = await postRepo.find()
// 1 query: SELECT * FROM post

for (const post of posts) {
  console.log(post.author.name)
  // ← ACESSA RELAÇÃO NÃO CARREGADA
  // → SELECT * FROM user WHERE id=1
  // → SELECT * FROM user WHERE id=2
  // → SELECT * FROM user WHERE id=N
  // 100 posts = 101 queries!
}`,
    after: `const posts = await postRepo.find({
  relations: { author: true },
})
// 1 query com LEFT JOIN automático

for (const post of posts) {
  console.log(post.author.name)
  // author já carregado — sem query extra
}
// Total: 1 query para qualquer N`,
    explanation: 'N+1 é o bug de performance mais comum com ORMs. 100 posts → 101 queries (cada uma com round-trip ao banco). Com join: sempre 1 query.',
    tags: ['performance', 'relations', 'N+1'],
  },
  {
    id: 'n1-graphql',
    label: 'N+1 em GraphQL',
    description: 'GraphQL resolvers independentes podem disparar uma query por campo resolvido',
    beforeLabel: 'Sem DataLoader (N+1)',
    afterLabel: 'Com DataLoader (batch)',
    before: `// Resolver de Post.author
// Chamado N vezes — uma por post!
@ResolveField('author')
async author(@Parent() post: Post) {
  // ← chamado 100x para 100 posts
  return this.userRepo.findOne({
    where: { id: post.authorId },
  })
  // 100 posts = 100 queries SELECT user!
}`,
    after: `// DataLoader agrupa IDs no mesmo tick
@ResolveField('author')
async author(@Parent() post: Post) {
  return this.userLoader.load(post.authorId)
  // DataLoader acumula: [1, 2, 3, ...N]
  // Emite UMA query: WHERE id IN (1,2,3...N)
  // Distribui resultados de volta
}

// Loader: nova instância por request!
create() { return new DataLoader(batchFn) }`,
    explanation: 'DataLoader usa batching: acumula todos os IDs requisitados no mesmo tick do event loop e emite uma única query IN(...). Nova instância por request evita cache cross-user.',
    tags: ['graphql', 'dataloader', 'N+1'],
  },
  {
    id: 'eager',
    label: 'eager:true vs lazy explícito',
    description: 'eager:true carrega sempre — pode gerar queries enormes desnecessariamente',
    beforeLabel: 'eager:true (perigoso)',
    afterLabel: 'lazy explícito (seguro)',
    before: `@Entity()
export class User {
  @OneToMany(
    () => Post,
    post => post.author,
    { eager: true }  // ← carrega SEMPRE
  )
  posts: Post[]
}

// userRepo.find() para 100 usuários
// → carrega TODOS os posts de cada um
// → pode retornar 10.000 linhas
// → query imensa para listar usuários`,
    after: `@Entity()
export class User {
  @OneToMany(() => Post, post => post.author)
  posts: Post[]  // lazy por padrão
}

// Carregue explicitamente quando precisar:
const userWithPosts = await userRepo.findOne({
  where: { id },
  relations: { posts: true }, // só aqui
})

// Listagem simples de usuários — sem posts:
const users = await userRepo.find()
// query limpa, sem overhead`,
    explanation: 'Lazy explícito dá controle: você decide em cada query o que carregar. eager:true pode transformar uma listagem de usuários numa query com 10.000 linhas.',
    tags: ['performance', 'eager', 'lazy'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Anti-patterns (Galeria)
// ═══════════════════════════════════════════════════════════════════════════════

const ANTIPATTERNS_GALLERY: AntiPattern[] = [
  {
    title: 'synchronize: true em produção',
    wrong: [
      [{ text: 'new DataSource({' }],
      [{ text: '  synchronize: ', color: RED }, { text: 'true', color: RED }, { text: ' // ← dropa colunas!' }],
      [{ text: '})' }],
      [{ text: '// @Column deletado → DROP COLUMN imediato' }],
    ],
    right: [
      [{ text: 'new DataSource({' }],
      [{ text: '  synchronize: ', color: GRN }, { text: 'false', color: GRN }, { text: ',  // sempre' }],
      [{ text: '  migrations: [', color: GRN }, { text: "'src/migrations/*.ts'", color: GRN }, { text: '],' }],
      [{ text: '})' }],
    ],
    why: 'synchronize:true emite DDL automático incluindo DROP COLUMN. Uma remoção acidental de @Column em código dropa dados de produção sem confirmação.',
  },
  {
    title: 'SQL injection no QueryBuilder',
    wrong: [
      [{ text: '.where(' }, { text: '`post.userId = ${userId}`', color: RED }, { text: ')' }],
      [{ text: '// userId = "1 OR 1=1"' }],
      [{ text: '// → WHERE post.userId = 1 OR 1=1' }],
      [{ text: '// → retorna TUDO!' }],
    ],
    right: [
      [{ text: '.where(' }, { text: "'post.userId = :id'", color: GRN }, { text: ", { id: userId })" }],
      [{ text: '// Parâmetro tipado → driver SQL' }],
      [{ text: '// → WHERE post.userId = $1' }],
      [{ text: '// $1 = valor seguro, nunca interpolado' }],
    ],
    why: 'Parâmetros nomeados são passados ao driver como prepared statement — o valor nunca entra no SQL. Template literal é vulnerabilidade direta de SQL injection.',
  },
  {
    title: 'Repositório injetado dentro da transação',
    wrong: [
      [{ text: 'dataSource.transaction(async (em) => {' }],
      [{ text: '  await ', color: RED }, { text: 'this.userRepo', color: RED }, { text: '.save(user)' }],
      [{ text: '  // ← opera FORA da transação!' }],
      [{ text: '  // se próxima op falhar: inconsistente' }],
      [{ text: '})' }],
    ],
    right: [
      [{ text: 'dataSource.transaction(async (em) => {' }],
      [{ text: '  await ', color: GRN }, { text: 'em', color: GRN }, { text: '.save(User, user)' }],
      [{ text: '  await ', color: GRN }, { text: 'em', color: GRN }, { text: '.save(Profile, profile)' }],
      [{ text: '  // em = EntityManager da transação' }],
      [{ text: '  // rollback automático em exceção' }],
      [{ text: '})' }],
    ],
    why: 'O repositório injetado usa sua própria conexão do pool — fora da transação. Dentro de transaction(), use apenas o EntityManager (em) passado como argumento.',
  },
  {
    title: 'N+1 — relação no loop',
    wrong: [
      [{ text: 'const posts = await postRepo.find()' }],
      [{ text: 'for (const p of posts) {' }],
      [{ text: '  console.log(', color: RED }, { text: 'p.author.name', color: RED }, { text: ')' }],
      [{ text: '  // ← SELECT user WHERE id=? por iteração' }],
      [{ text: '  // 100 posts = 101 queries!' }],
      [{ text: '}' }],
    ],
    right: [
      [{ text: 'const posts = await postRepo.find({' }],
      [{ text: '  relations: { ', color: GRN }, { text: 'author: true', color: GRN }, { text: ' }' }],
      [{ text: '})' }],
      [{ text: 'for (const p of posts) {' }],
      [{ text: '  console.log(p.author.name)' }],
      [{ text: '  // author já carregado — 1 query total' }],
      [{ text: '}' }],
    ],
    why: 'Acessar relação não carregada dentro de loop gera uma query por iteração. Com N=100: 101 queries. Com join explícito: sempre 1.',
  },
  {
    title: 'QueryRunner sem release()',
    wrong: [
      [{ text: 'const qr = dataSource.createQueryRunner()' }],
      [{ text: 'await qr.connect()' }],
      [{ text: 'await qr.startTransaction()' }],
      [{ text: 'await qr.manager.save(Entity, data)' }],
      [{ text: 'await qr.commitTransaction()' }],
      [{ text: '// ← sem qr.release()! Conexão vaza do pool', color: RED }],
    ],
    right: [
      [{ text: 'const qr = dataSource.createQueryRunner()' }],
      [{ text: 'await qr.connect(); await qr.startTransaction()' }],
      [{ text: 'try {' }],
      [{ text: '  await qr.manager.save(Entity, data)' }],
      [{ text: '  await qr.commitTransaction()' }],
      [{ text: '} catch (e) { await qr.rollbackTransaction(); throw e }' }],
      [{ text: 'finally { await ', color: GRN }, { text: 'qr.release()', color: GRN }, { text: ' }' }],
    ],
    why: 'QueryRunner sem release() mantém a conexão aberta no pool. Com N chamadas, o pool esgota e novas queries ficam em fila. Sempre use try/finally.',
  },
  {
    title: 'Editar migration já aplicada',
    wrong: [
      [{ text: '// Migration já executada em produção!' }],
      [{ text: 'export class AddPhone123 implements MigrationInterface {' }],
      [{ text: '  async up(qr: QueryRunner) {' }],
      [{ text: '    // ← você editou aqui depois de aplicar', color: RED }],
      [{ text: '    // TypeORM não reexecuta — já está na tabela migrations' }],
      [{ text: '    // Outros ambientes executarão versão EDITADA como nova' }],
      [{ text: '  }' }],
    ],
    right: [
      [{ text: '// CRIE uma nova migration para a correção!' }],
      [{ text: 'export class FixPhone456 implements MigrationInterface {' }],
      [{ text: '  async up(qr: QueryRunner) {' }],
      [{ text: '    // ← implementação correta aqui', color: GRN }],
      [{ text: '  }' }],
      [{ text: '  async down(qr: QueryRunner) {' }],
      [{ text: '    // ← rollback obrigatório!', color: GRN }],
      [{ text: '  }' }],
    ],
    why: 'Migration aplicada é imutável. TypeORM rastreia pelo timestamp+nome na tabela migrations. Editá-la não afeta o banco já migrado, mas quebra a consistência entre ambientes.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — Decorators (Carrossel)
// ═══════════════════════════════════════════════════════════════════════════════

const DECORATORS_CARDS: CarouselCard[] = [
  {
    name: '@Entity()',
    signature: "@Entity('nome_tabela')",
    emoji: 'DB',
    color: C,
    use: [
      'Marca a classe como tabela no banco.',
      'Nome da tabela é inferido do nome da classe (snake_case) ou passado como argumento.',
      '@Entity("tb_users") → tabela tb_users. Sem argumento → users.',
    ],
    dontUse: 'Não esqueça de importar reflect-metadata no entry point da aplicação — sem ele, os decorators não inferem tipos automaticamente.',
    difficulty: 1,
  },
  {
    name: '@Column()',
    signature: "@Column({ type, nullable, unique, default, length, name })",
    emoji: 'col',
    color: SKY,
    use: [
      'Mapeia propriedade para coluna. Todas as opções do banco são suportadas.',
      '{ select: false } exclui coluna em find() — útil para senha.',
      '{ name: "email_address" } para nome de coluna diferente do campo.',
    ],
    dontUse: 'Não use @Column em propriedades não-primitivas sem @OneToOne/@ManyToOne — TypeORM não sabe como serializar objetos para colunas.',
    difficulty: 1,
  },
  {
    name: '@Index()',
    signature: "@Index(['col1', 'col2'])",
    emoji: 'idx',
    color: GRN,
    use: [
      'Índice simples: na propriedade. Índice composto: array em nível de classe.',
      '@Index(["email"], { unique: true }) → constraint única composta.',
      'TypeORM gera o CREATE INDEX na migration automaticamente.',
    ],
    dontUse: 'Não adicione @Index em toda coluna — índices têm custo de write (INSERT/UPDATE). Indexe apenas colunas frequentes em WHERE, JOIN e ORDER BY.',
    difficulty: 2,
  },
  {
    name: '@DeleteDateColumn()',
    signature: '@DeleteDateColumn()',
    emoji: 'del',
    color: RED,
    use: [
      'Ativa soft delete na entidade: softDelete() preenche este campo.',
      'Todas as queries filtram automaticamente registros com deletedAt != null.',
      'restore(id) limpa deletedAt. find({ withDeleted: true }) inclui deletados.',
    ],
    dontUse: 'Cuidado com @Unique em colunas junto de soft delete — email UNIQUE bloqueia re-cadastro após deleção. Use índice parcial WHERE deleted_at IS NULL no banco.',
    difficulty: 2,
  },
  {
    name: '@BeforeInsert()',
    signature: '@BeforeInsert() / @BeforeUpdate()',
    emoji: 'hook',
    color: AMB,
    use: [
      'Executa método da entidade antes de INSERT ou UPDATE.',
      'Perfeito para: hash de senha, geração de slug, normalização de email.',
      'Pode ser async — TypeORM awaita antes de continuar.',
    ],
    dontUse: 'Não use @AfterLoad() com async — TypeORM não awaita o AfterLoad. Para lógica assíncrona pós-load, use Subscriber externo com afterLoad().',
    difficulty: 2,
  },
  {
    name: '@TableInheritance()',
    signature: "@TableInheritance({ column: { name: 'type' } })",
    emoji: 'STI',
    color: PRP,
    use: [
      'Single Table Inheritance: todas as subclasses numa única tabela com coluna discriminadora.',
      'Subclasses com @ChildEntity("car") são filtradas automaticamente por type = "car".',
      'Melhor quando subclasses são similares (poucas colunas extras).',
    ],
    dontUse: 'Não use STI quando subclasses têm estruturas muito diferentes — haverá muitas colunas NULL. Prefira CTI (tabelas separadas) ou composition.',
    difficulty: 3,
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 8 — Entity Lifecycle (Timeline dos hooks)
// ═══════════════════════════════════════════════════════════════════════════════

const ENTITY_LIFECYCLE_PHASES: TimelinePhase[] = [
  {
    id: 'new',
    emoji: '·',
    name: 'new',
    color: SKY,
    short: 'Objeto cru em memória',
    detail: 'Instância criada via new ou repo.create(). Não rastreada pelo EntityManager. Sem id ainda. Nenhum hook disparou — TypeORM nem sabe que ela existe.',
    code: [
      [{ text: '// Recém-instanciada — apenas memória', color: MUTE }],
      [{ text: 'const', color: PRP }, { text: ' user = ' }, { text: 'new', color: PRP }, { text: ' User()' }],
      [{ text: 'user.email = ' }, { text: "'ana@x.com'", color: GRN }],
      [{ text: 'user.password = ' }, { text: "'senha123'", color: GRN }],
      [{ text: '// id: undefined · createdAt: undefined', color: MUTE }],
    ],
  },
  {
    id: 'before-insert',
    emoji: '+',
    name: '@BeforeInsert',
    color: AMB,
    short: 'Antes do INSERT',
    detail: 'Disparado quando você chama save() em uma entidade SEM id (nova). Use para hash de senha, normalização de e-mail, geração de slug. Pode ser async — TypeORM awaita antes de emitir o INSERT. Multiplos métodos podem ter @BeforeInsert na mesma entidade.',
    code: [
      [{ text: '@Entity()', color: C }],
      [{ text: 'export', color: PRP }, { text: ' ' }, { text: 'class', color: PRP }, { text: ' User {' }],
      [{ text: '  @BeforeInsert()', color: C }],
      [{ text: '  async ', color: PRP }, { text: 'hashPassword() {' }],
      [{ text: '    this.password = ' }, { text: 'await', color: PRP }, { text: ' bcrypt.hash(' }],
      [{ text: '      this.password, ' }, { text: '12', color: SKY }, { text: ')' }],
      [{ text: '  }' }],
      [{ text: '  @BeforeInsert()', color: C }],
      [{ text: '  ' }, { text: 'normalizeEmail() {' }],
      [{ text: '    this.email = this.email.toLowerCase().trim()' }],
      [{ text: '  }' }],
      [{ text: '}' }],
    ],
  },
  {
    id: 'after-insert',
    emoji: '!',
    name: '@AfterInsert',
    color: GRN,
    short: 'Depois do INSERT',
    detail: 'Após o INSERT bem-sucedido. A entidade já tem id (gerado pelo banco) e timestamps preenchidos. Use para enviar e-mail de boas-vindas, log de auditoria, publicar domain event. Erros aqui NÃO fazem rollback do INSERT — a transação já comitou.',
    code: [
      [{ text: '@AfterInsert()', color: C }],
      [{ text: 'async ', color: PRP }, { text: 'sendWelcomeEmail() {' }],
      [{ text: '  ' }, { text: '// id já populado pelo banco', color: MUTE }],
      [{ text: '  ' }, { text: 'await', color: PRP }, { text: ' mailer.send({' }],
      [{ text: '    to: this.email,' }],
      [{ text: '    template: ' }, { text: "'welcome'", color: GRN }, { text: ',' }],
      [{ text: '    data: { id: this.id }' }],
      [{ text: '  })' }],
      [{ text: '}' }],
      [{ text: '// Atenção: exceção aqui não desfaz INSERT.', color: RED }],
      [{ text: '// Para atomicidade: use Subscriber + tx.', color: RED }],
    ],
  },
  {
    id: 'after-load',
    emoji: '↻',
    name: '@AfterLoad',
    color: PRP,
    short: 'Após SELECT',
    detail: 'Disparado toda vez que TypeORM hidrata a entidade do banco — em find, findOne, leftJoinAndSelect. Use para computar campos derivados (idade a partir de birthdate, fullName). ATENÇÃO: NÃO suporta async — TypeORM ignora o await. Para lógica assíncrona pós-load, use Subscriber externo.',
    code: [
      [{ text: '@AfterLoad()', color: C }],
      [{ text: 'computeFullName() {' }],
      [{ text: '  ' }, { text: 'this', color: PRP }, { text: '.fullName = ' }],
      [{ text: '    `${' }, { text: 'this', color: PRP }, { text: '.firstName} ${' }, { text: 'this', color: PRP }, { text: '.lastName}`' }],
      [{ text: '}' }],
      [{ text: '' }],
      [{ text: '// ARMADILHA — async é ignorado!', color: RED }],
      [{ text: '@AfterLoad()', color: C }],
      [{ text: 'async', color: PRP }, { text: ' loadAvatar() { ' }],
      [{ text: '  ' }, { text: '// TypeORM não awaita — uso errado', color: RED }],
      [{ text: '}' }],
    ],
  },
  {
    id: 'before-update',
    emoji: '~',
    name: '@BeforeUpdate',
    color: GOLD,
    short: 'Antes do UPDATE',
    detail: 'Disparado quando save() é chamado em entidade COM id (já persistida). NÃO dispara em UPDATE via QueryBuilder ou repo.update() direto — só quando o save() compara estados e gera o UPDATE. Útil para re-hash de senha alterada ou regeneração de slug ao mudar título.',
    code: [
      [{ text: '@BeforeUpdate()', color: C }],
      [{ text: 'async ', color: PRP }, { text: 'rehashPasswordIfChanged() {' }],
      [{ text: '  ' }, { text: 'if', color: PRP }, { text: ' (' }, { text: 'this', color: PRP }, { text: '.password &&' }],
      [{ text: '      !' }, { text: 'this', color: PRP }, { text: '.password.startsWith(' }, { text: "'$2b$'", color: GRN }, { text: ')) {' }],
      [{ text: '    ' }, { text: 'this', color: PRP }, { text: '.password = ' }, { text: 'await', color: PRP }, { text: ' bcrypt.hash(...)' }],
      [{ text: '  }' }],
      [{ text: '}' }],
      [{ text: '' }],
      [{ text: '// ATENÇÃO: NÃO dispara em', color: RED }],
      [{ text: '// repo.update(id, {...}) ou QueryBuilder', color: RED }],
    ],
  },
  {
    id: 'before-remove',
    emoji: '×',
    name: '@BeforeRemove',
    color: RED,
    short: 'Antes do DELETE',
    detail: 'Disparado em repo.remove(entity) — o método que deleta uma entidade carregada. Útil para verificações finais (FK manual, integridade referencial em apps sem CASCADE). NÃO dispara em repo.delete(id) (que é direto via QueryBuilder) nem em softDelete().',
    code: [
      [{ text: '@BeforeRemove()', color: C }],
      [{ text: 'verifyNoOrders() {' }],
      [{ text: '  ' }, { text: 'if', color: PRP }, { text: ' (' }, { text: 'this', color: PRP }, { text: '.orders?.length > ' }, { text: '0', color: SKY }, { text: ') {' }],
      [{ text: '    ' }, { text: 'throw new', color: PRP }, { text: ' ' }, { text: 'Error', color: AMB }, { text: '(' }, { text: "'Usuário tem pedidos ativos'", color: GRN }, { text: ')' }],
      [{ text: '  }' }],
      [{ text: '}' }],
      [{ text: '' }],
      [{ text: '// ARMADILHA: não dispara em', color: RED }],
      [{ text: '// repo.delete(id) — só em remove(entity)', color: RED }],
      [{ text: '// e nem em repo.softDelete(id)', color: RED }],
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 9 — Repository vs EntityManager vs DataSource (Comparação de APIs)
// ═══════════════════════════════════════════════════════════════════════════════

const API_OPTIONS: ComparisonOption[] = [
  { id: 'datasource',     label: 'DataSource',     sublabel: 'Conexão raiz',          color: C },
  { id: 'entitymanager',  label: 'EntityManager',  sublabel: 'Operações multi-entidade', color: SKY },
  { id: 'repository',     label: 'Repository<T>',  sublabel: 'API tipada por entidade',  color: GRN },
]

const API_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'inicializacao',
    label: 'Inicializa o pool de conexões',
    category: 'ciclo de vida',
    description: 'Apenas o DataSource gerencia o pool. EM e Repository são derivados — nunca os instancie do zero.',
    values: {
      datasource:    { rating: 'excellent', note: 'new DataSource(cfg).initialize() abre o pool' },
      entitymanager: { rating: 'na',        note: 'derivado do DataSource — não inicializa' },
      repository:    { rating: 'na',        note: 'derivado do EntityManager — não inicializa' },
    },
  },
  {
    id: 'crud-simples',
    label: 'CRUD simples por entidade (find, save, delete)',
    category: 'uso típico',
    description: 'Para operações cotidianas em UMA entidade, Repository é a melhor abstração: tipado e fácil de injetar.',
    values: {
      datasource:    { rating: 'fair',      note: 'verboso: ds.getRepository(User).find()' },
      entitymanager: { rating: 'good',      note: 'em.find(User, ...) — exige passar a classe' },
      repository:    { rating: 'excellent', note: 'repo.find() — tipado e direto' },
    },
  },
  {
    id: 'multi-entidade',
    label: 'Operações que cruzam múltiplas entidades',
    category: 'uso típico',
    description: 'EntityManager é ideal quando uma única operação precisa de várias entidades — ex: dentro de uma transação.',
    values: {
      datasource:    { rating: 'fair',      note: 'precisa pegar repository por entidade' },
      entitymanager: { rating: 'excellent', note: 'em.save(User, u); em.save(Profile, p)' },
      repository:    { rating: 'poor',      note: 'limitado a UMA entidade por instância' },
    },
  },
  {
    id: 'transacoes',
    label: 'Participar de transação atômica',
    category: 'transações',
    description: 'Dentro de dataSource.transaction(async em => {...}) use SOMENTE o "em" do callback. Nunca o repositório injetado — ele opera fora da transação.',
    values: {
      datasource:    { rating: 'excellent', note: 'ds.transaction(async em => ...) é o entry point' },
      entitymanager: { rating: 'excellent', note: 'em do callback é o EntityManager da transação' },
      repository:    { rating: 'poor',      note: 'repo injetado opera fora da tx — pegadinha clássica' },
    },
  },
  {
    id: 'queryrunner',
    label: 'Acesso ao QueryRunner (SQL raw, savepoints)',
    category: 'transações',
    description: 'QueryRunner é a camada mais baixa: controle explícito de transação, savepoints, raw query e DDL. Só é obtido via DataSource.',
    values: {
      datasource:    { rating: 'excellent', note: 'ds.createQueryRunner() — único caminho' },
      entitymanager: { rating: 'fair',      note: 'em.queryRunner existe quando vem de tx' },
      repository:    { rating: 'na',        note: 'sem acesso direto ao QueryRunner' },
    },
  },
  {
    id: 'di-nestjs',
    label: 'Injetável via DI no NestJS',
    category: 'NestJS',
    description: 'Repository é o padrão DataMapper do NestJS — injete via @InjectRepository(Entity).',
    values: {
      datasource:    { rating: 'good',      note: '@InjectDataSource() — para tx e QueryRunner' },
      entitymanager: { rating: 'fair',      note: '@InjectEntityManager() existe mas raro' },
      repository:    { rating: 'excellent', note: '@InjectRepository(User) — padrão do NestJS' },
    },
  },
  {
    id: 'mock-testes',
    label: 'Facilidade de mock em testes unitários',
    category: 'testes',
    description: 'Repository é trivial de mockar via overrideProvider(getRepositoryToken(Entity)). EM e DataSource têm superfície maior — mock é mais trabalhoso.',
    values: {
      datasource:    { rating: 'poor',      note: 'API enorme — mock raramente compensa' },
      entitymanager: { rating: 'fair',      note: 'mock parcial dos métodos usados' },
      repository:    { rating: 'excellent', note: 'jest.fn() nos métodos do repositório' },
    },
  },
  {
    id: 'migrations',
    label: 'Executar migrations / DDL',
    category: 'schema',
    description: 'Migrations são executadas via DataSource.runMigrations() ou CLI. EntityManager e Repository não têm essa responsabilidade.',
    values: {
      datasource:    { rating: 'excellent', note: 'ds.runMigrations() / migration:run' },
      entitymanager: { rating: 'na',        note: 'sem responsabilidade sobre schema' },
      repository:    { rating: 'na',        note: 'sem responsabilidade sobre schema' },
    },
  },
  {
    id: 'querybuilder',
    label: 'Criar QueryBuilder fluente',
    category: 'queries',
    description: 'Os três caminhos retornam QueryBuilder, mas Repository já fixa a entidade — menos repetição.',
    values: {
      datasource:    { rating: 'good',      note: 'ds.createQueryBuilder(User, "u")' },
      entitymanager: { rating: 'good',      note: 'em.createQueryBuilder(User, "u")' },
      repository:    { rating: 'excellent', note: 'repo.createQueryBuilder("u") — entidade implícita' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUALS DEFINITION
// ═══════════════════════════════════════════════════════════════════════════════

export default function TypeormVisuais() {
  const [active, setActive] = useState(0)

  const VISUALS: VisualDef[] = [
    {
      id: 'conceitos',
      title: 'Como Funciona',
      subtitle: 'DataSource, Entity e Repository — os 3 pilares',
      accent: C,
      component: (
        <ConceptCarousel
          slides={CONCEITOS_SLIDES}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          label="VISUAL 01 — CONCEITOS FUNDAMENTAIS"
          heading="Como o TypeORM Funciona"
          description="Três pilares do TypeORM: DataSource (conexão), Entity (mapeamento), Repository (interface). Clique nas setas para navegar."
        />
      ),
    },
    {
      id: 'relacoes',
      title: 'Relações',
      subtitle: 'Explorer interativo de @OneToMany, @ManyToMany e mais',
      accent: SKY,
      component: (
        <CardCarousel
          cards={RELATIONS_CARDS}
          bgColor={BG}
          accentColor={SKY}
          label="VISUAL 02 — RELAÇÕES"
          heading="Relações TypeORM"
          description="Clique nos tipos de relação para ver os decorators, quando usar e as armadilhas. A FK sempre fica no lado Many."
          useLabel="QUANDO USAR"
          dontUseLabel="ARMADILHA"
        />
      ),
    },
    {
      id: 'querybuilder',
      title: 'QueryBuilder',
      subtitle: 'Código TypeScript → SQL gerado equivalente',
      accent: AMB,
      component: <QueryBuilderSimulator />,
    },
    {
      id: 'migrations',
      title: 'Migrations',
      subtitle: 'Timeline do generate ao production deploy',
      accent: GRN,
      component: <MigrationTimeline />,
    },
    {
      id: 'n1-problem',
      title: 'N+1 Problem',
      subtitle: 'Visualizador antes/depois com diff de código',
      accent: RED,
      component: (
        <DiffViewer
          examples={N1_DIFFS}
          accentColor={RED}
          bgColor={BG}
          cardColor={CARD}
          title="N+1 Problem — antes e depois"
          description="O problema de performance mais comum em ORMs. Selecione o cenário para ver o diff entre código problemático e a solução."
        />
      ),
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns',
      subtitle: 'Galeria dos 6 erros mais comuns com TypeORM',
      accent: C,
      component: (
        <AntiPatternsGallery
          patterns={ANTIPATTERNS_GALLERY}
          accentColor={C}
          bgColor={BG}
          errorColor={RED}
          successColor={GRN}
          label="VISUAL 06 — ANTI-PATTERNS"
          heading="Anti-patterns TypeORM"
          description="Os 6 erros mais comuns com TypeORM — com código errado x correto e explicação técnica."
          wrongLabel="✗ ERRADO"
          rightLabel="✓ CORRETO"
          whyLabel="Por que é um problema:"
        />
      ),
    },
    {
      id: 'decorators',
      title: 'Decorators',
      subtitle: 'Carrossel dos principais decorators com exemplos',
      accent: PRP,
      component: (
        <CardCarousel
          cards={DECORATORS_CARDS}
          bgColor={BG}
          accentColor={PRP}
          label="VISUAL 07 — DECORATORS"
          heading="Decorators TypeORM"
          description="Os principais decorators TypeORM: quando usar, como configurar e as armadilhas. Navegue pelos cards."
          useLabel="COMO USAR"
          dontUseLabel="CUIDADO"
        />
      ),
    },
    {
      id: 'lifecycle',
      title: 'Entity Lifecycle',
      subtitle: 'Hooks @BeforeInsert, @AfterLoad e quando cada um dispara',
      accent: GOLD,
      component: (
        <HookTimeline
          phases={ENTITY_LIFECYCLE_PHASES}
          accentColor={GOLD}
          bgColor={BG}
          label="VISUAL 08 — ENTITY LIFECYCLE"
          heading="Ciclo de vida da entidade TypeORM"
          description="Quando cada lifecycle hook dispara: do new() em memória ao DELETE final. Clique em cada fase para ver o código e as armadilhas."
          defaultActive="before-insert"
        />
      ),
    },
    {
      id: 'apis',
      title: 'APIs de persistência',
      subtitle: 'Repository × EntityManager × DataSource — quando usar cada um',
      accent: SKY,
      component: (
        <ComparisonTable
          options={API_OPTIONS}
          criteria={API_CRITERIA}
          accentColor={SKY}
          bgColor={BG}
          cardColor={CARD}
          title="Repository × EntityManager × DataSource"
          description="TypeORM expõe três APIs de persistência em camadas diferentes. Cada linha mostra qual delas é a melhor escolha para cada situação — DataSource gerencia o pool, EntityManager cruza entidades, Repository é o atalho tipado para CRUD."
          highlightBest
        />
      ),
    },
  ]

  return (
    <VisuaisShell
      visuals={VISUALS}
      active={active}
      onChange={setActive}
    />
  )
}
