import type { SkillContent } from '@/types'

const typeorm: SkillContent = {
  tagline: "ORM TypeScript/JS com ActiveRecord e DataMapper, forte integração com NestJS.",
  why: "TypeORM ainda domina em stack NestJS enterprise. Saber migrations, relations lazy/eager, QueryBuilder e os gotchas de N+1 é esperado em vaga backend TS sênior. Entender a diferença entre DataMapper e ActiveRecord e por que um é preferível em DDD diferencia pleno de sênior em entrevistas técnicas.",
  prerequisite: "TypeScript com decorators e reflect-metadata, SQL básico (JOIN, FK, índices), conceito de ORM e mapeamento objeto-relacional.",
  summary: "TypeORM suporta dois patterns: ActiveRecord (entidade herda BaseEntity e tem métodos de query estáticos) e DataMapper (repositório separado, entidade é POJO com decorators). Decorators TypeScript mapeiam entidades para tabelas com type safety via reflect-metadata. Suporta PostgreSQL, MySQL, SQLite, MongoDB. Integrado nativamente no NestJS. Pontos críticos: gerenciamento de migrations (nunca synchronize em produção), relations com carga explícita para evitar N+1, QueryBuilder para queries complexas, transações para atomicidade.",
  diagrams: [
    {
      title: "DataMapper vs ActiveRecord — dois caminhos, um banco",
      html: `<style>
.tor-dv-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.tor-dv-card{background:#1e293b;border:1.5px solid #334155;border-radius:10px;padding:14px 16px}
.tor-dv-label{font-size:9px;letter-spacing:.1em;text-transform:uppercase;margin-bottom:10px;font-weight:600}
.tor-dv-code{font-size:10.5px;line-height:2;color:#94a3b8}
.tor-dv-kw{color:#7c3aed}
.tor-dv-dec{color:#E83524}
.tor-dv-str{color:#4ade80}
.tor-dv-cmt{color:#475569}
.tor-dv-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(100,116,139,.5)}
.tor-dv-tip:hover .tor-dv-tb{display:block}
.tor-dv-tb{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:220px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.tor-dv-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
@keyframes tor-dv-pulse{0%,100%{border-color:#334155}50%{border-color:#E83524}}
</style>
<div class="tor-dv-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">DataMapper vs ActiveRecord — dois caminhos para o mesmo banco</p>
<p style="color:#475569;font-size:10px;margin:0 0 18px">Passe o mouse nos termos <span style="border-bottom:1px dashed rgba(100,116,139,.5)">sublinhados</span></p>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
  <div class="tor-dv-card">
    <div class="tor-dv-label" style="color:#f59e0b">ActiveRecord</div>
    <div class="tor-dv-code">
      <span class="tor-dv-kw">@Entity</span>()<br>
      <span class="tor-dv-kw">class</span> <span style="color:#61DAFB">User</span> <span class="tor-dv-kw">extends</span> <span class="tor-dv-tip">BaseEntity<span class="tor-dv-tb">Herdar BaseEntity adiciona métodos estáticos como findOne, find, save, remove diretamente na classe da entidade.</span></span> {<br>
      &nbsp;<span class="tor-dv-dec">@PrimaryGeneratedColumn</span>()<br>
      &nbsp;id: <span style="color:#61DAFB">number</span><br>
      &nbsp;<span class="tor-dv-dec">@Column</span>()<br>
      &nbsp;name: <span style="color:#61DAFB">string</span><br>
      }<br><br>
      <span class="tor-dv-cmt">// uso direto na entidade</span><br>
      <span class="tor-dv-kw">const</span> u = <span class="tor-dv-kw">await</span> User.<span class="tor-dv-tip">findOne<span class="tor-dv-tb">Método estático que vem da herança de BaseEntity. Fácil de usar mas difícil de mockar em testes — você teria que mockar a classe estática.</span></span>({ where: { id } })<br>
      <span class="tor-dv-kw">await</span> u.<span class="tor-dv-tip">save<span class="tor-dv-tb">Salva o estado atual da instância no banco. Faz INSERT se novo, UPDATE se já existe. Conveniente mas acopla a entidade ao banco.</span></span>()
    </div>
    <div style="margin-top:10px;padding:8px;background:#0f172a;border-radius:6px;font-size:9px;color:#64748b;line-height:1.6">
      <span style="color:#f59e0b">✓</span> Menos boilerplate<br>
      <span style="color:#ef4444">✗</span> Difícil de mockar<br>
      <span style="color:#ef4444">✗</span> Acopla domínio ao banco
    </div>
  </div>
  <div class="tor-dv-card" style="border-color:rgba(232,53,36,.3)">
    <div class="tor-dv-label" style="color:#E83524">DataMapper (preferido)</div>
    <div class="tor-dv-code">
      <span class="tor-dv-kw">@Entity</span>()<br>
      <span class="tor-dv-kw">class</span> <span style="color:#61DAFB">User</span> { <span class="tor-dv-cmt">// POJO puro</span><br>
      &nbsp;<span class="tor-dv-dec">@PrimaryGeneratedColumn</span>()<br>
      &nbsp;id: <span style="color:#61DAFB">number</span><br>
      &nbsp;<span class="tor-dv-dec">@Column</span>()<br>
      &nbsp;name: <span style="color:#61DAFB">string</span><br>
      }<br><br>
      <span class="tor-dv-cmt">// queries via repositório</span><br>
      <span class="tor-dv-kw">const</span> repo = ds.<span class="tor-dv-tip">getRepository<span class="tor-dv-tb">O DataSource (conexão com o banco) expõe getRepository<T>() que retorna um repositório tipado para a entidade. Pode ser injetado via DI no NestJS.</span></span>(User)<br>
      <span class="tor-dv-kw">const</span> u = <span class="tor-dv-kw">await</span> repo.findOne({ where: { id } })<br>
      <span class="tor-dv-kw">await</span> repo.<span class="tor-dv-tip">save<span class="tor-dv-tb">O repositório faz o trabalho de persistência — a entidade User não sabe nada sobre o banco. Isso permite injetar um mock de repositório nos testes sem tocar no banco.</span></span>(u)
    </div>
    <div style="margin-top:10px;padding:8px;background:#0f172a;border-radius:6px;font-size:9px;color:#64748b;line-height:1.6">
      <span style="color:#4ade80">✓</span> Repositório mockável em testes<br>
      <span style="color:#4ade80">✓</span> Entidade é POJO, ideal pra DDD<br>
      <span style="color:#4ade80">✓</span> Injeção de dependência limpa
    </div>
  </div>
</div>
<div style="background:#1e293b;border-radius:8px;padding:12px 14px;border:1px solid #1e3a5f">
  <div style="font-size:9px;color:#3b82f6;letter-spacing:.1em;font-weight:600;margin-bottom:6px;text-transform:uppercase">No NestJS — DataMapper com injeção de dependência</div>
  <div style="font-size:10.5px;line-height:2;color:#94a3b8">
    <span class="tor-dv-dec">@Injectable</span>()<br>
    <span class="tor-dv-kw">class</span> <span style="color:#61DAFB">UserService</span> {<br>
    &nbsp;<span class="tor-dv-kw">constructor</span>(<span class="tor-dv-dec">@InjectRepository</span>(User) <span class="tor-dv-kw">private</span> repo: Repository&lt;User&gt;) {}<br>
    &nbsp;<span class="tor-dv-kw">async</span> findById(id: <span style="color:#61DAFB">number</span>) { <span class="tor-dv-kw">return</span> <span class="tor-dv-kw">this</span>.repo.findOne({ where: { id } }) }<br>
    }
  </div>
  <p style="font-size:11px;color:#475569;margin:8px 0 0;line-height:1.6">O repositório é injetado — em testes, você injeta um mock. Sem banco. Sem acoplamento.</p>
</div>
</div>`,
      caption: "DataMapper é preferido em projetos profissionais porque a entidade permanece POJO puro (ideal para DDD), o repositório é injetável e mockável, e a lógica de negócio não fica acoplada à persistência.",
    },
    {
      title: "Ciclo de vida de uma entidade — do new ao banco",
      html: `<style>
.tor-lc-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.tor-lc-step{background:#1e293b;border:1.5px solid #334155;border-radius:10px;padding:12px 14px;flex:1;min-width:0}
.tor-lc-num{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0;margin-bottom:8px}
.tor-lc-title{font-size:11px;font-weight:700;margin-bottom:4px}
.tor-lc-body{font-size:9.5px;color:#64748b;line-height:1.6}
.tor-lc-code{font-size:10px;color:#94a3b8;line-height:1.8;margin-top:6px}
.tor-lc-arr{color:#334155;font-size:20px;align-self:center;flex-shrink:0;padding:0 4px}
@keyframes tor-lc-glow{0%,100%{border-color:#334155}50%{border-color:#E83524;box-shadow:0 0 8px rgba(232,53,36,.2)}}
.tor-lc-active{animation:tor-lc-glow 2.4s ease-in-out infinite}
</style>
<div class="tor-lc-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Ciclo de vida de uma entidade TypeORM</p>
<p style="color:#475569;font-size:10px;margin:0 0 18px">Do objeto em memória até o banco — e o que acontece em cada etapa</p>
<div style="display:flex;gap:6px;align-items:stretch;margin-bottom:16px;flex-wrap:wrap">
  <div class="tor-lc-step">
    <div class="tor-lc-num" style="background:rgba(97,218,251,.15);color:#61DAFB">1</div>
    <div class="tor-lc-title" style="color:#61DAFB">new</div>
    <div class="tor-lc-body">Objeto criado em memória. Não rastreado pelo EntityManager ainda. Sem ID.</div>
    <div class="tor-lc-code">
      <span style="color:#7c3aed">const</span> u = <span style="color:#7c3aed">new</span> User()<br>
      u.name = <span style="color:#4ade80">'Ana'</span><br>
      <span style="color:#475569">// id: undefined</span>
    </div>
  </div>
  <div class="tor-lc-arr">→</div>
  <div class="tor-lc-step tor-lc-active">
    <div class="tor-lc-num" style="background:rgba(232,53,36,.15);color:#E83524">2</div>
    <div class="tor-lc-title" style="color:#E83524">persist</div>
    <div class="tor-lc-body">EntityManager rastreia o objeto. Ainda não foi ao banco — só está na Unit of Work.</div>
    <div class="tor-lc-code">
      em.persist(u)<br>
      <span style="color:#475569">// ou repo.create({name})</span><br>
      <span style="color:#475569">// id: ainda undefined</span>
    </div>
  </div>
  <div class="tor-lc-arr">→</div>
  <div class="tor-lc-step">
    <div class="tor-lc-num" style="background:rgba(74,222,128,.15);color:#4ade80">3</div>
    <div class="tor-lc-title" style="color:#4ade80">save / flush</div>
    <div class="tor-lc-body">TypeORM emite SQL: INSERT se novo, UPDATE se modificado. Hooks @BeforeInsert e @AfterInsert disparam.</div>
    <div class="tor-lc-code">
      <span style="color:#7c3aed">await</span> repo.save(u)<br>
      <span style="color:#475569">// → INSERT INTO user...</span><br>
      <span style="color:#475569">// id: 42 (gerado pelo banco)</span>
    </div>
  </div>
  <div class="tor-lc-arr">→</div>
  <div class="tor-lc-step">
    <div class="tor-lc-num" style="background:rgba(59,130,246,.15);color:#3b82f6">4</div>
    <div class="tor-lc-title" style="color:#3b82f6">managed</div>
    <div class="tor-lc-body">Entidade gerenciada: mudanças são rastreadas. Flush automático em transações.</div>
    <div class="tor-lc-code">
      u.name = <span style="color:#4ade80">'Ana P.'</span><br>
      <span style="color:#7c3aed">await</span> repo.save(u)<br>
      <span style="color:#475569">// → UPDATE user SET name=...</span>
    </div>
  </div>
  <div class="tor-lc-arr">→</div>
  <div class="tor-lc-step">
    <div class="tor-lc-num" style="background:rgba(100,116,139,.15);color:#64748b">5</div>
    <div class="tor-lc-title" style="color:#64748b">removed</div>
    <div class="tor-lc-body">Removido do banco. Hard delete ou soft delete (@SoftDelete) com DeletedAt.</div>
    <div class="tor-lc-code">
      <span style="color:#7c3aed">await</span> repo.remove(u)<br>
      <span style="color:#475569">// → DELETE FROM user...</span><br>
      <span style="color:#475569">// ou softDelete por slug</span>
    </div>
  </div>
</div>
<div style="background:#1e293b;border-radius:8px;padding:12px 14px;border:1px solid #1e3a5f">
  <div style="font-size:9px;color:#E83524;letter-spacing:.1em;font-weight:600;margin-bottom:8px;text-transform:uppercase">Hooks de ciclo de vida disponíveis</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:10px;color:#94a3b8;line-height:1.8">
    <div><span style="color:#E83524">@BeforeInsert</span> — hash de senha, slug<br><span style="color:#E83524">@AfterInsert</span> — log, envio de e-mail<br><span style="color:#E83524">@BeforeUpdate</span> — updatedAt manual</div>
    <div><span style="color:#E83524">@AfterUpdate</span> — invalidar cache<br><span style="color:#E83524">@BeforeRemove</span> — verificar FKs<br><span style="color:#E83524">@AfterLoad</span> — transformar dados</div>
  </div>
</div>
</div>`,
      caption: "O fluxo new → persist → save/flush → managed é o modelo mental central. Hooks de ciclo de vida permitem adicionar lógica cross-cutting (auditoria, hashing, cache) sem poluir a camada de serviço.",
    },
    {
      title: "Tipos de relação — FK visual e decorators",
      html: `<style>
.tor-rel-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.tor-rel-box{background:#1e293b;border:1.5px solid #334155;border-radius:10px;padding:12px 14px}
.tor-rel-entity{background:#0f172a;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:10.5px;line-height:1.8;color:#94a3b8}
.tor-rel-entity-title{font-size:11px;font-weight:700;margin-bottom:6px}
.tor-rel-fk{color:#E83524;font-weight:600}
.tor-rel-dec{color:#f59e0b}
.tor-rel-kw{color:#7c3aed}
.tor-rel-arr{color:#475569;font-size:12px}
.tor-rel-badge{display:inline-block;padding:2px 7px;border-radius:4px;font-size:9px;font-weight:600;margin-bottom:8px}
</style>
<div class="tor-rel-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Tipos de relação TypeORM com FK visual</p>
<p style="color:#475569;font-size:10px;margin:0 0 18px">A FK sempre fica no lado Many — a seta aponta de quem possui a FK</p>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">

  <div class="tor-rel-box">
    <span class="tor-rel-badge" style="background:rgba(97,218,251,.12);color:#61DAFB">ManyToOne / OneToMany</span>
    <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
      <div class="tor-rel-entity" style="flex:1">
        <div class="tor-rel-entity-title" style="color:#61DAFB">Post</div>
        <span class="tor-rel-fk">userId</span> (FK)<br>
        <span class="tor-rel-dec">@ManyToOne</span>(() =&gt; User)
      </div>
      <div style="text-align:center;font-size:11px;color:#475569">N:1<br>←→</div>
      <div class="tor-rel-entity" style="flex:1">
        <div class="tor-rel-entity-title" style="color:#61DAFB">User</div>
        <span class="tor-rel-dec">@OneToMany</span>(() =&gt; Post, p =&gt; p.user)<br>
        posts: Post[]
      </div>
    </div>
    <div style="font-size:9px;color:#475569;line-height:1.6">FK fica em Post (lado Many). @JoinColumn desnecessário — TypeORM infere. Inverse relation é obrigatória para navegação bidirecional.</div>
  </div>

  <div class="tor-rel-box">
    <span class="tor-rel-badge" style="background:rgba(232,53,36,.12);color:#E83524">ManyToMany</span>
    <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
      <div class="tor-rel-entity" style="flex:1">
        <div class="tor-rel-entity-title" style="color:#61DAFB">Post</div>
        <span class="tor-rel-dec">@ManyToMany</span>(() =&gt; Tag)<br>
        <span class="tor-rel-dec">@JoinTable</span>()<br>
        tags: Tag[]
      </div>
      <div style="text-align:center;font-size:11px;color:#475569">N:M<br>↔</div>
      <div class="tor-rel-entity" style="flex:1">
        <div class="tor-rel-entity-title" style="color:#61DAFB">Tag</div>
        <span class="tor-rel-dec">@ManyToMany</span>(() =&gt; Post, p =&gt; p.tags)<br>
        posts: Post[]
      </div>
    </div>
    <div style="font-size:9px;color:#475569;line-height:1.6"><span style="color:#E83524">@JoinTable obrigatório</span> no lado owner (Post). TypeORM cria tabela intermediária post_tags_tag automaticamente.</div>
  </div>

  <div class="tor-rel-box">
    <span class="tor-rel-badge" style="background:rgba(74,222,128,.12);color:#4ade80">OneToOne</span>
    <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
      <div class="tor-rel-entity" style="flex:1">
        <div class="tor-rel-entity-title" style="color:#61DAFB">User</div>
        <span class="tor-rel-dec">@OneToOne</span>(() =&gt; Profile)<br>
        <span class="tor-rel-dec">@JoinColumn</span>()<br>
        <span class="tor-rel-fk">profileId</span> (FK)
      </div>
      <div style="text-align:center;font-size:11px;color:#475569">1:1<br>→</div>
      <div class="tor-rel-entity" style="flex:1">
        <div class="tor-rel-entity-title" style="color:#61DAFB">Profile</div>
        <span class="tor-rel-dec">@OneToOne</span>(() =&gt; User, u =&gt; u.profile)<br>
        user: User
      </div>
    </div>
    <div style="font-size:9px;color:#475569;line-height:1.6"><span style="color:#4ade80">@JoinColumn obrigatório</span> em OneToOne — define qual lado tem a FK. O lado com @JoinColumn é o owner.</div>
  </div>

  <div class="tor-rel-box">
    <span class="tor-rel-badge" style="background:rgba(245,158,11,.12);color:#f59e0b">Eager vs Lazy Loading</span>
    <div class="tor-rel-entity" style="margin-bottom:8px">
      <span class="tor-rel-dec">@OneToMany</span>(() =&gt; Post, p =&gt; p.user, { <span style="color:#f59e0b">eager: true</span> })<br>
      <span style="color:#475569">// carrega SEMPRE com o User — cuidado em listas grandes</span><br><br>
      <span class="tor-rel-dec">@OneToMany</span>(() =&gt; Post, ...)<br>
      <span style="color:#475569">// lazy por padrão: use relations:['posts'] ou join explícito</span><br>
      repo.find({ relations: { posts: <span style="color:#61DAFB">true</span> } })
    </div>
    <div style="font-size:9px;color:#475569;line-height:1.6">Prefira lazy explícito — eager:true pode gerar queries enormes desnecessárias. Seja explícito no que carregar em cada query.</div>
  </div>

</div>
</div>`,
      caption: "Regra de ouro das relações: a FK sempre fica no lado Many. Em ManyToMany, @JoinTable deve ficar no lado owner. Em OneToOne, @JoinColumn define quem tem a FK. Nunca esqueça a relation inversa — TypeORM precisa dela para navegação bidirecional.",
    },
  ],
  cheatsheet: {
    title: "TypeORM — Decorators e comandos essenciais",
    html: `<style>
.tor-cs-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.tor-cs-section{margin-bottom:18px}
.tor-cs-title{font-size:9px;letter-spacing:.1em;text-transform:uppercase;font-weight:600;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #1e293b}
.tor-cs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px}
.tor-cs-item{background:#1e293b;border-radius:8px;padding:10px 12px}
.tor-cs-dec{color:#E83524;font-size:10.5px;font-weight:600}
.tor-cs-desc{color:#64748b;font-size:9.5px;margin-top:3px;line-height:1.5}
.tor-cs-code{font-size:10px;color:#94a3b8;background:#0f172a;border-radius:6px;padding:8px 10px;margin-top:8px;line-height:1.8}
.tor-cs-kw{color:#7c3aed}
.tor-cs-str{color:#4ade80}
.tor-cs-cmt{color:#475569}
</style>
<div class="tor-cs-wrap">
<p style="color:#e2e8f0;font-size:13px;margin:0 0 18px;font-weight:600">TypeORM — Decorators, QueryBuilder e CLI</p>

<div class="tor-cs-section">
  <div class="tor-cs-title" style="color:#E83524">Decorators de entidade</div>
  <div class="tor-cs-grid">
    <div class="tor-cs-item"><div class="tor-cs-dec">@Entity()</div><div class="tor-cs-desc">Marca a classe como tabela. Aceita nome customizado: @Entity('tb_users')</div></div>
    <div class="tor-cs-item"><div class="tor-cs-dec">@PrimaryGeneratedColumn()</div><div class="tor-cs-desc">Chave primária auto-increment (int) ou 'uuid' para UUID v4</div></div>
    <div class="tor-cs-item"><div class="tor-cs-dec">@Column()</div><div class="tor-cs-desc">Coluna. Opções: type, nullable, unique, default, length, name</div></div>
    <div class="tor-cs-item"><div class="tor-cs-dec">@CreateDateColumn()</div><div class="tor-cs-desc">Timestamp automático na criação. TypeORM insere, você não precisa setar</div></div>
    <div class="tor-cs-item"><div class="tor-cs-dec">@UpdateDateColumn()</div><div class="tor-cs-desc">Timestamp atualizado automaticamente no save()</div></div>
    <div class="tor-cs-item"><div class="tor-cs-dec">@DeleteDateColumn()</div><div class="tor-cs-desc">Soft delete: preenche este campo em softDelete(), filtra automaticamente</div></div>
    <div class="tor-cs-item"><div class="tor-cs-dec">@Index()</div><div class="tor-cs-desc">Índice na coluna. @Index(['col1','col2']) para índice composto</div></div>
    <div class="tor-cs-item"><div class="tor-cs-dec">@Unique()</div><div class="tor-cs-desc">Constraint unique. Pode ser em nível de classe para unique composto</div></div>
  </div>
</div>

<div class="tor-cs-section">
  <div class="tor-cs-title" style="color:#f59e0b">Decorators de relação</div>
  <div class="tor-cs-grid">
    <div class="tor-cs-item"><div class="tor-cs-dec">@ManyToOne(() =&gt; User)</div><div class="tor-cs-desc">FK nesta entidade. TypeORM cria coluna userId automaticamente</div></div>
    <div class="tor-cs-item"><div class="tor-cs-dec">@OneToMany(() =&gt; Post, p =&gt; p.user)</div><div class="tor-cs-desc">Sem FK aqui — FK está no Post. Sempre precisa do 2º argumento (inverse)</div></div>
    <div class="tor-cs-item"><div class="tor-cs-dec">@ManyToMany(() =&gt; Tag)</div><div class="tor-cs-desc">Relação N:M. Precisa de @JoinTable no lado owner</div></div>
    <div class="tor-cs-item"><div class="tor-cs-dec">@JoinTable()</div><div class="tor-cs-desc">Define tabela intermediária. Só no lado owner do ManyToMany</div></div>
    <div class="tor-cs-item"><div class="tor-cs-dec">@JoinColumn()</div><div class="tor-cs-desc">Obrigatório em OneToOne para definir qual lado tem a FK</div></div>
    <div class="tor-cs-item"><div class="tor-cs-dec">{ eager: true }</div><div class="tor-cs-desc">Carrega relação sempre. Use com cuidado — pode gerar queries gigantes</div></div>
    <div class="tor-cs-item"><div class="tor-cs-dec">{ cascade: true }</div><div class="tor-cs-desc">save/remove em cascata para a relação. Risco de remoção acidental</div></div>
    <div class="tor-cs-item"><div class="tor-cs-dec">{ onDelete: 'CASCADE' }</div><div class="tor-cs-desc">Constraint de FK no banco. Diferente de cascade do TypeORM (app-level)</div></div>
  </div>
</div>

<div class="tor-cs-section">
  <div class="tor-cs-title" style="color:#4ade80">QueryBuilder — queries complexas</div>
  <div class="tor-cs-code">
    <span class="tor-cs-kw">const</span> posts = <span class="tor-cs-kw">await</span> repo<br>
    &nbsp;.createQueryBuilder(<span class="tor-cs-str">'post'</span>)<br>
    &nbsp;.leftJoinAndSelect(<span class="tor-cs-str">'post.author'</span>, <span class="tor-cs-str">'author'</span>) <span class="tor-cs-cmt">// carrega relação</span><br>
    &nbsp;.leftJoinAndSelect(<span class="tor-cs-str">'post.tags'</span>, <span class="tor-cs-str">'tag'</span>)<br>
    &nbsp;.where(<span class="tor-cs-str">'post.published = :pub'</span>, { pub: <span style="color:#61DAFB">true</span> }) <span class="tor-cs-cmt">// NUNCA interpole strings</span><br>
    &nbsp;.andWhere(<span class="tor-cs-str">'author.active = :active'</span>, { active: <span style="color:#61DAFB">true</span> })<br>
    &nbsp;.orderBy(<span class="tor-cs-str">'post.createdAt'</span>, <span class="tor-cs-str">'DESC'</span>)<br>
    &nbsp;.take(<span style="color:#61DAFB">10</span>).skip(<span style="color:#61DAFB">0</span>)<br>
    &nbsp;.getMany()
  </div>
</div>

<div class="tor-cs-section">
  <div class="tor-cs-title" style="color:#61DAFB">Transações e soft delete</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
    <div class="tor-cs-code">
      <span class="tor-cs-cmt">// transação com callback</span><br>
      <span class="tor-cs-kw">await</span> dataSource.transaction(<span class="tor-cs-kw">async</span> em =&gt; {<br>
      &nbsp;<span class="tor-cs-kw">await</span> em.save(User, newUser)<br>
      &nbsp;<span class="tor-cs-kw">await</span> em.save(Profile, profile)<br>
      &nbsp;<span class="tor-cs-cmt">// rollback automático se exceção</span><br>
      })
    </div>
    <div class="tor-cs-code">
      <span class="tor-cs-cmt">// soft delete com @DeleteDateColumn</span><br>
      <span class="tor-cs-kw">await</span> repo.softDelete(id)<br>
      <span class="tor-cs-cmt">// consulta inclui deletados:</span><br>
      repo.find({ withDeleted: <span style="color:#61DAFB">true</span> })<br>
      <span class="tor-cs-cmt">// restaurar:</span><br>
      <span class="tor-cs-kw">await</span> repo.restore(id)
    </div>
  </div>
</div>

<div class="tor-cs-section" style="margin-bottom:0">
  <div class="tor-cs-title" style="color:#94a3b8">CLI de migrations</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
    <div class="tor-cs-code">
      <span style="color:#4ade80"># gera migration do diff</span><br>
      npx typeorm migration:generate -d src/data-source.ts src/migrations/AddUserIndex<br><br>
      <span style="color:#4ade80"># aplica migrations pendentes</span><br>
      npx typeorm migration:run -d src/data-source.ts
    </div>
    <div class="tor-cs-code">
      <span style="color:#4ade80"># reverte última migration</span><br>
      npx typeorm migration:revert -d src/data-source.ts<br><br>
      <span style="color:#4ade80"># lista migrations e status</span><br>
      npx typeorm migration:show -d src/data-source.ts
    </div>
  </div>
</div>
</div>`,
    caption: "Referência rápida de todos os decorators críticos, QueryBuilder seguro (com parâmetros :named) e CLI de migrations. Salve este cheatsheet para revisar antes de entrevistas.",
  },
  keypoints: [
    {
      title: "Entidade e decorators básicos",
      body: "@Entity() marca a classe como tabela. @PrimaryGeneratedColumn() para ID auto-increment (int) ou @PrimaryGeneratedColumn('uuid') para UUID. @Column() mapeia propriedade para coluna — aceita opções como type, nullable, unique, default. reflect-metadata (importado no entry point) é obrigatório para TypeORM inferir tipos automaticamente dos type annotations TypeScript.",
      code: `import { Entity, PrimaryGeneratedColumn, Column,
CreateDateColumn, UpdateDateColumn, Index } from 'typeorm'

@Entity('users')
export class User {
@PrimaryGeneratedColumn('uuid')
id: string

@Column({ unique: true })
@Index()
email: string

@Column({ nullable: true })
name: string | null

@CreateDateColumn()   // TypeORM insere automaticamente
createdAt: Date

@UpdateDateColumn()   // TypeORM atualiza no save()
updatedAt: Date
}`,
    },
    {
      title: "DataMapper vs ActiveRecord — escolha certa",
      body: "DataMapper (preferido): entidade é POJO com decorators, repositório separado gerencia queries. Vantagem: repositório é injetável e mockável em testes. ActiveRecord: entidade herda BaseEntity e tem métodos estáticos. Conveniente para projetos pequenos, mas dificulta testes e viola DDD (entidade não deve saber sobre persistência). Em NestJS, sempre use DataMapper com @InjectRepository.",
      code: `// DataMapper — preferido em projetos profissionais
@Injectable()
class UserService {
constructor(
  @InjectRepository(User)
  private userRepo: Repository<User>
) {}

async findActive(): Promise<User[]> {
  return this.userRepo.find({
    where: { active: true },
    order: { createdAt: 'DESC' },
  })
}

async create(dto: CreateUserDto): Promise<User> {
  const user = this.userRepo.create(dto)   // cria instância
  return this.userRepo.save(user)          // persiste
}
}`,
    },
    {
      title: "Relations — @OneToMany, @ManyToOne, @ManyToMany",
      body: "A FK sempre fica no lado Many (@ManyToOne cria coluna FK automaticamente). @OneToMany não cria coluna — ele só define a navegação inversa. @ManyToMany exige @JoinTable no lado owner. @OneToOne exige @JoinColumn para definir qual lado tem a FK. Sempre defina a relação inversa (2º argumento dos decorators) — TypeORM precisa dela para joins e navegação bidirecional.",
      code: `@Entity()
export class Post {
@PrimaryGeneratedColumn()
id: number

// FK userId fica aqui — lado Many
@ManyToOne(() => User, user => user.posts, { nullable: false })
author: User

// ManyToMany — Post é o owner (@JoinTable obrigatório)
@ManyToMany(() => Tag, tag => tag.posts)
@JoinTable()           // cria post_tags_tag automaticamente
tags: Tag[]
}

@Entity()
export class User {
// Sem FK aqui — apenas navegação inversa
@OneToMany(() => Post, post => post.author)
posts: Post[]
}`,
    },
    {
      title: "Eager vs Lazy loading — carregue só o necessário",
      body: "Por padrão, relações não são carregadas (lazy). Você deve ser explícito em cada query sobre o que precisa. eager: true carrega sempre — perigoso em listas grandes pois multiplica o tamanho do resultado. A forma correta é usar relations: { ... } no find() ou leftJoinAndSelect no QueryBuilder. Isso garante controle e evita surpresas de performance.",
      code: `// RUIM — eager: true carrega posts em TODA query de User
@OneToMany(() => Post, p => p.author, { eager: true })
posts: Post[]

// BOM — carrega só quando necessário
const userComPosts = await userRepo.findOne({
where: { id: userId },
relations: { posts: true }  // explícito por query
})

// BOM — QueryBuilder para queries mais complexas
const result = await postRepo
.createQueryBuilder('post')
.leftJoinAndSelect('post.author', 'author')
.leftJoinAndSelect('post.tags', 'tag')
.where('post.id = :id', { id: postId })
.getOne()`,
    },
    {
      title: "QueryBuilder — controle total sobre SQL",
      body: "QueryBuilder oferece API fluente para construir queries complexas: múltiplos JOINs, subqueries, HAVING, GROUP BY, paginação. É mais verboso que find(), mas indispensável quando find options não são suficientes. Regra crítica: NUNCA use interpolação de string em where() — use sempre parâmetros nomeados (:param) para prevenir SQL injection.",
      code: `// Paginação com contagem total (lista + total em uma única query)
const [posts, total] = await postRepo
.createQueryBuilder('post')
.leftJoinAndSelect('post.author', 'a')
.where('a.active = :active', { active: true })
.andWhere('post.publishedAt IS NOT NULL')
.orderBy('post.publishedAt', 'DESC')
.take(pageSize)
.skip(page * pageSize)
.getManyAndCount()   // retorna [Post[], number]

// Subquery
const subQuery = postRepo
.createQueryBuilder('p')
.select('p.authorId')
.where('p.views > :min', { min: 100 })

const activeAuthors = await userRepo
.createQueryBuilder('u')
.where(\`u.id IN (\${subQuery.getQuery()})\`)
.setParameters(subQuery.getParameters())
.getMany()`,
    },
    {
      title: "Migrations — workflow seguro para produção",
      body: "Nunca use synchronize: true em produção — TypeORM emite ALTER/DROP automaticamente sem confirmação, podendo destruir dados. O workflow correto: (1) mude a entidade no código; (2) gere a migration com migration:generate; (3) revise o SQL gerado; (4) faça commit da migration junto com o código; (5) aplique com migration:run em CI/CD. Migrations são idempotentes — executadas apenas uma vez.",
      code: `// data-source.ts — configuração do DataSource
export const AppDataSource = new DataSource({
type: 'postgres',
url: process.env.DATABASE_URL,
entities: [User, Post, Tag],
migrations: ['src/migrations/*.ts'],
// NUNCA synchronize: true em produção!
synchronize: false,
logging: process.env.NODE_ENV === 'development',
})

// migration gerada pelo CLI (nunca edite após aplicar)
export class AddUserIndex1710000000000 implements MigrationInterface {
async up(qr: QueryRunner): Promise<void> {
  await qr.createIndex('users', new TableIndex({
    name: 'IDX_users_email',
    columnNames: ['email'],
  }))
}
async down(qr: QueryRunner): Promise<void> {
  await qr.dropIndex('users', 'IDX_users_email')
}
}`,
    },
    {
      title: "Transações — atomicidade de operações",
      body: "Transações garantem que múltiplas operações de banco sejam atômicas — ou todas acontecem, ou nenhuma. TypeORM oferece duas formas: dataSource.transaction() com callback (mais simples, rollback automático em exceção) e QueryRunner manual para casos avançados (transações distribuídas, rollback parcial). Em NestJS com NestJS-Typeorm, injete DataSource e use transaction().",
      code: `// Forma simples — rollback automático em exceção
async transferCredits(fromId: number, toId: number, amount: number) {
return this.dataSource.transaction(async (em) => {
  const from = await em.findOneOrFail(User, { where: { id: fromId } })
  const to = await em.findOneOrFail(User, { where: { id: toId } })

  if (from.credits < amount) throw new Error('Saldo insuficiente')

  from.credits -= amount
  to.credits += amount

  await em.save(from)
  await em.save(to)
  // se lançar exceção aqui → rollback automático das duas operações
})
}

// QueryRunner manual — mais controle
const qr = this.dataSource.createQueryRunner()
await qr.connect()
await qr.startTransaction()
try {
await qr.manager.save(entity)
await qr.commitTransaction()
} catch (err) {
await qr.rollbackTransaction()
throw err
} finally {
await qr.release()
}`,
    },
    {
      title: "Soft delete — remoção lógica",
      body: "@DeleteDateColumn ativa soft delete: ao chamar softDelete(), TypeORM preenche deletedAt ao invés de emitir DELETE SQL. Queries subsequentes filtram registros com deletedAt automaticamente. Para incluir deletados, passe withDeleted: true. Para restaurar, use restore(). Soft delete é preferível em sistemas onde auditoria e histórico são importantes.",
      code: `@Entity()
export class Post {
@PrimaryGeneratedColumn()
id: number

@Column()
title: string

@DeleteDateColumn()  // null = ativo, timestamp = deletado
deletedAt: Date | null
}

// Soft delete — emite UPDATE post SET deletedAt = NOW()
await postRepo.softDelete(postId)

// Restore — limpa deletedAt
await postRepo.restore(postId)

// Consulta padrão — filtra deletados automaticamente
const posts = await postRepo.find()  // só ativos

// Incluir deletados
const todos = await postRepo.find({ withDeleted: true })`,
    },
    {
      title: "@Index e otimização de queries",
      body: "@Index() cria índice simples na coluna. Para índice composto, passe array em nível de classe. @Unique() adiciona constraint de unicidade. Índices são críticos para colunas usadas em WHERE, JOIN e ORDER BY frequentes. TypeORM gera os índices nas migrations automaticamente.",
      code: `// Índice simples na coluna
@Column()
@Index()
email: string

// Índice composto — em nível de classe
@Entity()
@Index(['firstName', 'lastName'])
@Index(['email'], { unique: true })
export class User {
@Column() firstName: string
@Column() lastName: string
@Column() email: string
}

// Verificar o SQL gerado na migration:
// CREATE INDEX IDX_users_firstName_lastName ON users (firstName, lastName)
// CREATE UNIQUE INDEX IDX_users_email ON users (email)`,
    },
    {
      title: "Hooks de ciclo de vida",
      body: "@BeforeInsert, @AfterInsert, @BeforeUpdate, @AfterUpdate, @BeforeRemove, @AfterLoad — executam automaticamente. Úteis para hashear senha antes de inserir, gerar slug, invalidar cache, auditar mudanças. O método deve ser um método da entidade (não async no AfterLoad — TypeORM não awaita).",
      code: `import { BeforeInsert, BeforeUpdate } from 'typeorm'
import * as bcrypt from 'bcrypt'

@Entity()
export class User {
@Column()
password: string   // armazenado como hash

@BeforeInsert()
@BeforeUpdate()
async hashPassword() {
  if (this.password && !this.password.startsWith('$2b$')) {
    this.password = await bcrypt.hash(this.password, 12)
  }
}

@BeforeInsert()
generateSlug() {
  this.slug = this.name.toLowerCase().replace(/\s+/g, '-')
}
}`,
    },
    {
      title: "find() options — queries simples",
      body: "Para queries simples, find() e findOne() com FindOptionsWhere são mais legíveis que QueryBuilder. Suportam where com operadores (Like, Between, In, Not, IsNull), relations para carregamento, order para ordenação, take/skip para paginação. Para queries complexas com múltiplos JOINs ou subqueries, mude para QueryBuilder.",
      code: `import { Like, In, IsNull, Between } from 'typeorm'

// Busca com operadores
const users = await userRepo.find({
where: [
  { email: Like('%@empresa.com') },      // OR
  { role: In(['admin', 'moderator']) },   // OR
],
relations: { posts: true },
order: { createdAt: 'DESC' },
take: 10,
skip: 0,
})

// Null check
await userRepo.find({ where: { deletedAt: IsNull() } })

// Range
await postRepo.find({
where: { views: Between(100, 1000) },
})`,
    },
    {
      title: "Integração NestJS — módulo TypeORM",
      body: "No NestJS, configure TypeOrmModule.forRoot() no AppModule para a conexão global e TypeOrmModule.forFeature([Entity]) em cada módulo de domínio para registrar repositórios. Use @InjectRepository(Entity) para injetar o repositório no serviço. Para testes, use TypeOrmModule.forFeature() com SQLite em memória ou repositories mockados via overrideProvider.",
      code: `// app.module.ts
@Module({
imports: [
  TypeOrmModule.forRoot({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    autoLoadEntities: true,  // registra entidades do forFeature automaticamente
    synchronize: false,
    logging: process.env.NODE_ENV !== 'production',
  }),
],
})
export class AppModule {}

// user.module.ts
@Module({
imports: [TypeOrmModule.forFeature([User, Post])],
providers: [UserService, UserRepository],
exports: [UserService],
})
export class UserModule {}`,
    },
    {
      title: "Custom Repository — encapsulando queries de domínio",
      body: "Custom Repository permite encapsular queries específicas do domínio em vez de espalhá-las pelos serviços. No TypeORM 0.3+, crie uma classe anotada com @Injectable() que injeta o repositório base. Isso facilita testes (mock da classe inteira), reutilização e leitura — o serviço chama métodos com nomes de domínio, não QueryBuilder raw.",
      code: `@Injectable()
export class PostRepository {
constructor(
  @InjectRepository(Post)
  private readonly repo: Repository<Post>
) {}

async findPublishedByAuthor(authorId: number, page: number): Promise<[Post[], number]> {
  return this.repo
    .createQueryBuilder('post')
    .leftJoinAndSelect('post.tags', 'tag')
    .where('post.authorId = :authorId', { authorId })
    .andWhere('post.publishedAt IS NOT NULL')
    .orderBy('post.publishedAt', 'DESC')
    .take(10)
    .skip(page * 10)
    .getManyAndCount()
}

async countByStatus(authorId: number) {
  return this.repo.count({ where: { authorId } })
}
}`,
    },
  ],
  gotchas: [
    "synchronize: true em produção remove colunas ao deletar @Column da entidade. Sem confirmação. Sem recovery se não há backup. Nunca use em produção — use migrations.",
    "N+1 sem join explícito: ao iterar posts e acessar post.author dentro do loop, TypeORM emite uma query SELECT por iteração. Solução: carregar a relação no find() com relations ou no QueryBuilder com leftJoinAndSelect.",
    "Relação circular sem lazy loading: @ManyToOne + @OneToMany entre A e B podem gerar loop ao serializar para JSON (toJSON infinito). Solução: @Exclude() no lado inverse, classToPlain do class-transformer, ou serialization groups.",
    "Migration sem teste em staging: um diff de schema inesperado (renome de tabela, drop de índice) pode ser catastrófico em produção. Sempre execute migration:run em staging primeiro e revise o SQL gerado na migration antes de commitar.",
    "@ManyToMany sem @JoinTable do lado owner: TypeORM não cria a tabela intermediária. Erro silencioso — apenas uma das duas entidades deve ter @JoinTable.",
    "QueryBuilder com string interpolada: .where(\`post.authorId = ${userId}\`) é SQL injection. Use sempre .where('post.authorId = :id', { id: userId }).",
    "entity.save() fora de transação em operações críticas: se a segunda save() falhar depois da primeira, o banco fica em estado inconsistente. Envolva operações interdependentes em dataSource.transaction().",
    "Repositório injetado com escopo incorreto no NestJS: repositórios são singletons. Se você usa request-scoped providers que dependem de repositórios, o escopo pode não se propagar corretamente — use DataSource diretamente em providers request-scoped.",
  ],
  interview: [
    {
      q: "Qual a diferença entre ActiveRecord e DataMapper no TypeORM?",
      level: "senior",
      a: "<p><strong>ActiveRecord</strong>: entidade herda BaseEntity e tem métodos estáticos (User.findOne(), User.save()). Simples, menos código. Desvantagens: difícil de mockar em testes (métodos estáticos), viola DDD (entidade sabe sobre persistência), acoplamento forte à camada de banco.</p><p><strong>DataMapper</strong>: entidade é POJO com decorators, sem herança. Repositório separado faz todas as queries. Vantagens: repositório é uma dependência injetável e mockável (<code>overrideProvider</code> no NestJS), entidade permanece pura para lógica de domínio, segue separação de responsabilidades. Preferido em projetos enterprise e DDD.</p><p>No NestJS, DataMapper é o padrão: <code>@InjectRepository(User) private repo: Repository&lt;User&gt;</code>.</p>",
      tip: "Explique que a escolha impacta testabilidade: com ActiveRecord, mockar User.findOne() estático é trabalhoso. Com DataMapper, injeta um mock do repositório no construtor — setup de teste em 5 linhas.",
    },
    {
      q: "Como você identificaria e resolveria N+1 no TypeORM?",
      a: "<p><strong>Identificar</strong>: habilite logging: true no DataSource em desenvolvimento. Veja quantas queries SELECT aparecem para uma listagem — se for N+1 (uma por item), você encontrou o problema. Ferramentas: pgBadger, slow query log, APM (Datadog, New Relic).</p><p><strong>Resolver</strong>:</p><ul><li>No find(): <code>relations: { author: true, tags: true }</code></li><li>No QueryBuilder: <code>.leftJoinAndSelect('post.author', 'a')</code></li><li>Para contagens: <code>.loadRelationCountAndMap()</code> ao invés de carregar entidades inteiras</li></ul><p><strong>Caso avançado</strong>: em GraphQL com TypeORM, DataLoader agrupa IDs e faz uma única query IN(...).</p>",
    },
    {
      q: "Por que nunca usar synchronize: true em produção?",
      a: "<p>TypeORM com synchronize: true compara o schema de entidades com o banco real em cada inicialização e emite SQL automaticamente para sincronizar — incluindo ALTER TABLE, DROP COLUMN, DROP INDEX. Um @Column removido por acidente em código dropa a coluna de produção imediatamente e sem confirmação, resultando em perda de dados.</p><p><strong>Alternativa segura</strong>: workflow de migration: (1) altere a entidade; (2) <code>migration:generate</code> gera o SQL de diff; (3) revise o SQL; (4) commite; (5) CI/CD executa <code>migration:run</code>. Isso garante revisão, histórico versionado em git, possibilidade de rollback e deploy coordenado com o código.</p>",
    },
    {
      q: "Como implementaria soft delete com TypeORM?",
      a: "<p>Adicione <code>@DeleteDateColumn() deletedAt: Date | null</code> na entidade. TypeORM filtra automaticamente registros com deletedAt preenchido em todas as queries (WHERE deletedAt IS NULL implícito).</p><p>Operações: <code>repo.softDelete(id)</code> preenche deletedAt. <code>repo.restore(id)</code> limpa. <code>repo.find({ withDeleted: true })</code> inclui deletados. <code>repo.findOne({ where: { id }, withDeleted: true })</code> para buscar um deletado específico.</p><p>Vantagem sobre hard delete: dados ficam no banco para auditoria, relatórios, recuperação acidental. Desvantagem: precisa gerenciar índices únicos (email unique + deletedAt = pode re-cadastrar mesmo email após delete).</p>",
    },
    {
      q: "Como previne SQL injection no QueryBuilder?",
      a: "<p>Nunca use interpolação de string: <code>.where(\`userId = ${userId}\`)</code> é vulnerável.</p><p>Use sempre parâmetros nomeados: <code>.where('post.authorId = :id', { id: userId })</code>. O TypeORM passa o valor como parâmetro parametrizado ao driver do banco — o valor nunca é interpolado no SQL.</p><p>Para arrays: <code>.where('post.id IN (:...ids)', { ids: [1,2,3] })</code>. A sintaxe <code>:...param</code> expande o array corretamente.</p><p>O mesmo princípio vale para find() com <code>where: { id: userId }</code> — TypeORM usa queries parametrizadas internamente.</p>",
    },
    {
      q: "Como estruturaria transações no NestJS com TypeORM?",
      a: "<p>Injeção de DataSource no serviço e uso de <code>dataSource.transaction(async em => { ... })</code>. O EntityManager dentro do callback deve ser usado para todas as operações — não o repositório injetado, que opera fora da transação.</p><p>Para rollback automático: qualquer exceção dentro do callback faz rollback. Para rollback manual ou savepoints: use QueryRunner com <code>startTransaction()</code>, <code>commitTransaction()</code>, <code>rollbackTransaction()</code>.</p><p>Antipadrão: executar operações independentes (<code>repoA.save()</code> e depois <code>repoB.save()</code>) fora de uma transação — se a segunda falhar, a primeira já foi commitada e o banco fica inconsistente.</p>",
      level: "senior",
    },
    {
      q: "Como funcionam as migrations no TypeORM? Qual o risco de editar uma migration já aplicada?",
      a: "<p>TypeORM rastreia migrations aplicadas na tabela <code>migrations</code> do banco, armazenando o nome da classe e timestamp. Ao rodar <code>migration:run</code>, executa apenas as migrations ainda não registradas nessa tabela.</p><p>Editar uma migration já aplicada é catastrófico: o TypeORM não vai reexecutá-la (já está marcada como aplicada), então a mudança de código nunca vai para o banco. Além disso, o histórico fica inconsistente — outro desenvolvedor ou outro ambiente vai executar a versão editada como se fosse nova.</p><p>Regra: migration aplicada é imutável. Se errou, crie uma nova migration de correção (<code>migration:generate</code> ou manual). Para reverter: <code>migration:revert</code> executa o método <code>down()</code> da última migration.</p>",
    },
    {
      q: "Como você faria para evitar circular relation ao serializar entidades TypeORM para JSON?",
      a: "<p>O problema: Post tem @ManyToOne para User, User tem @OneToMany para Post. Serializar Post incluirá User, que incluirá posts, que incluirão o User novamente — loop infinito (stack overflow ou JSON circular reference error).</p><p><strong>Soluções</strong>:</p><ul><li><strong>class-transformer com @Exclude()</strong>: marque o lado inverso com <code>@Exclude()</code> e use <code>instanceToPlain(entity)</code> ao serializar. Padrão com NestJS ClassSerializerInterceptor.</li><li><strong>DTOs explícitos</strong>: nunca serialize a entidade diretamente — mapeie para DTO no serviço. A entidade nunca sai da camada de dados.</li><li><strong>Serialization Groups</strong>: @Expose({ groups: ['detail'] }) permite controlar campos por contexto.</li></ul><p>Preferido: DTOs — elimina o problema na raiz e dá controle total sobre o contrato da API.</p>",
      level: "senior",
    },
    {
      q: "Quando usar QueryBuilder vs find() com FindOptions?",
      a: "<p>Use <code>find()</code> para: queries simples de CRUD, filtros diretos em colunas da entidade, carregamento de relações simples, paginação básica. Mais legível e menos verboso.</p><p>Use <strong>QueryBuilder</strong> para: múltiplos JOINs condicionais, subqueries, GROUP BY + HAVING, SELECT parcial de colunas, queries que misturam dados de várias entidades sem carregar todas as relações, operações bulk (UPDATE com WHERE complexo).</p><p>Regra prática: se você precisaria de mais de 3 condições aninhadas no where de find() ou precisaria de um JOIN não direto entre entidades, mude para QueryBuilder. A verbosidade extra compensa na clareza da intent da query.</p>",
    },
    {
      q: "Como configuraria TypeORM para múltiplos bancos de dados no mesmo NestJS?",
      a: "<p>Use múltiplos DataSources com nomes distintos. No NestJS: <code>TypeOrmModule.forRoot({ name: 'reporting', ... })</code> para o segundo banco. Ao injetar repositórios, especifique a conexão: <code>TypeOrmModule.forFeature([Report], 'reporting')</code> e <code>@InjectRepository(Report, 'reporting')</code> no serviço.</p><p>Cenário comum: banco principal PostgreSQL para dados transacionais + read replica para queries pesadas + ClickHouse para analytics. Cada DataSource tem seu pool de conexões independente.</p><p>Cuidado: transações não cruzam DataSources — para operações que precisam de atomicidade entre bancos diferentes, use saga pattern ou compensação manual.</p>",
      level: "senior",
    },
    {
      q: "O que é N+1 e por que ele é mais perigoso em GraphQL do que em REST?",
      a: "<p>N+1: ao listar N itens e acessar uma relação em cada um, o ORM emite 1 query para a lista + N queries para as relações = N+1 queries totais. Com N=1000, são 1001 queries onde 1 bastaria.</p><p>Em REST, você controla exatamente o que carregar em cada endpoint — pode fazer o join na query do endpoint e resolver na origem. Em GraphQL, resolvers são funções independentes por campo: o resolver de <code>author</code> dentro de <code>Post</code> não sabe quantos posts estão sendo resolvidos simultaneamente. Cada chamada ao resolver dispara uma query individual.</p><p>Solução: <strong>DataLoader</strong> — acumula todos os IDs de author requisitados no mesmo tick do event loop, emite uma única query <code>WHERE id IN (...)</code> e distribui os resultados de volta para cada resolver. Instância nova por request para evitar cache entre usuários.</p>",
      level: "senior",
    },
  ],
  mnemonics: [
    {
      label: "FK fica no Many",
      trick: "ManyToOne = Muitos têm a chave do Um",
      explanation: "O lado Many (@ManyToOne) é sempre quem tem a FK no banco. O lado One (@OneToMany) não tem coluna extra — só é uma referência virtual de navegação.",
    },
    {
      label: "@JoinTable no owner",
      trick: "Quem @JoinTable paga a tabela intermediária",
      explanation: "Em @ManyToMany, o lado que declara @JoinTable é o owner da relação e quem 'paga' pela tabela de junção. Se esquecer, a tabela não é criada.",
    },
    {
      label: "synchronize false em produção",
      trick: "Sync destrói, Migration protege",
      explanation: "synchronize: true é para desenvolvimento rápido e prototipagem. Em qualquer ambiente com dados reais, use migrations — elas têm review, histórico e rollback.",
    },
  ],
  resources: [
    { title: "TypeORM docs", url: "https://typeorm.io/", kind: "docs" },
    { title: "NestJS + TypeORM", url: "https://docs.nestjs.com/techniques/database", kind: "docs" },
    { title: "TypeORM Relations Guide", url: "https://typeorm.io/relations", kind: "docs" },
    { title: "TypeORM Migrations", url: "https://typeorm.io/migrations", kind: "docs" },
  ],
}

export default typeorm
