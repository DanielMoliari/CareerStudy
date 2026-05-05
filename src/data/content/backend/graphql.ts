import type { SkillContent } from '@/types'

const graphql: SkillContent = {
  tagline: "Query language para APIs: o cliente descreve exatamente os dados que precisa, sem over/under-fetching.",
  why: "GraphQL é amplamente usado em empresas de produto com frontend rico (mobile + web). Saber schema design, resolver chain, N+1 com DataLoader, subscriptions e os tradeoffs vs REST é obrigatório em vaga sênior. Entender o ciclo de execução de uma query, como o DataLoader funciona internamente e como proteger a API diferencia sênior de pleno em entrevistas técnicas.",
  prerequisite: "HTTP e REST APIs (verbos, status codes), JavaScript/TypeScript async/await, conceitos de banco de dados relacional (relações, JOINs). Entender por que N+1 é um problema de banco de dados torna o DataLoader muito mais fácil de compreender.",
  summary: "GraphQL é uma query language (e runtime de execução) onde o cliente descreve a forma exata do dado que precisa. O servidor expõe um schema tipado com tipos, queries, mutations e subscriptions. O executor recebe a query, valida contra o schema e percorre a árvore de resolvers campo a campo. Cada resolver recebe (parent, args, context, info) e retorna o valor do campo. O grande desafio de produção é o N+1: um resolver de lista dispara N queries individuais para um campo relacionado. A solução padrão é DataLoader — agrupa IDs do mesmo tick em um batch, resolve com uma query e distribui os resultados. Outros tópicos críticos: depth/complexity limiting, introspection desabilitada em produção, persisted queries, e o tradeoff schema-first vs code-first.",
  howToStudy: "<strong>30 minutos antes de entrevista?</strong> Foque nos diagramas do N+1 e no ciclo de query. Treine as Q&As de nível pleno em voz alta. <strong>Fim de semana?</strong> Leia os keypoints em ordem, reproduza o setup Apollo Server + DataLoader no editor, depois os exercícios. <strong>Uma semana?</strong> Implemente uma API GraphQL completa com subscriptions e persisted queries. As Q&As de nível sênior devem ser respondidas sem consultar.",
  diagrams: [
    {
      title: "Ciclo de execução de uma query GraphQL — do cliente ao resolver chain",
      html: `<style>
.gql-cyc-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.gql-cyc-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(100,116,139,.5);display:inline}
.gql-cyc-tip:hover .gql-cyc-tb{display:block}
.gql-cyc-tb{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:220px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.gql-cyc-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.gql-step{background:#1e293b;border:1.5px solid #334155;border-radius:10px;padding:12px 14px;flex:1;min-width:0}
.gql-arr{color:#334155;font-size:18px;align-self:center;flex-shrink:0}
</style>
<div class="gql-cyc-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Ciclo de execução de uma query GraphQL</p>
<p style="color:#475569;font-size:10px;margin:0 0 18px">Passe o mouse nos termos <span style="border-bottom:1px dashed rgba(100,116,139,.5)">sublinhados</span></p>
<div style="display:flex;gap:6px;align-items:stretch;margin-bottom:14px">
  <div class="gql-step" style="border-color:rgba(225,0,152,.3)">
    <div style="font-size:9px;color:#E10098;letter-spacing:.1em;margin-bottom:8px;font-weight:700">① CLIENTE</div>
    <div style="font-size:10.5px;color:#94a3b8;line-height:1.8">
      <span class="gql-cyc-tip">query<span class="gql-cyc-tb">Documento GraphQL enviado no body do POST. Descreve exatamente quais campos quer — o servidor nunca retorna mais do que foi pedido.</span></span> GetUser {<br>
      &nbsp;user(id: "1") {<br>
      &nbsp;&nbsp;<span class="gql-cyc-tip">name<span class="gql-cyc-tb">Cada campo pedido será executado pelo resolver correspondente. Se o cliente não pede 'email', o resolver de email nunca roda.</span></span><br>
      &nbsp;&nbsp;posts { title }<br>
      &nbsp;}<br>
      }
    </div>
  </div>
  <div class="gql-arr">→</div>
  <div class="gql-step">
    <div style="font-size:9px;color:#a78bfa;letter-spacing:.1em;margin-bottom:8px;font-weight:700">② PARSE</div>
    <div style="font-size:10px;color:#64748b;line-height:1.7">
      <span class="gql-cyc-tip">Lexer + Parser<span class="gql-cyc-tb">Converte o texto da query em uma AST (Abstract Syntax Tree). Erros de sintaxe retornam imediatamente antes de validação ou execução.</span></span> converte em <strong style="color:#94a3b8">AST</strong>. Erros de sintaxe param aqui.
    </div>
  </div>
  <div class="gql-arr">→</div>
  <div class="gql-step">
    <div style="font-size:9px;color:#fbbf24;letter-spacing:.1em;margin-bottom:8px;font-weight:700">③ VALIDATE</div>
    <div style="font-size:10px;color:#64748b;line-height:1.7">
      AST verificada contra o <span class="gql-cyc-tip">schema<span class="gql-cyc-tb">Validação semântica: campo 'name' existe em User? Argumento 'id' tem tipo correto? Se não passa, retorna errors[] sem executar resolver algum. Depth/complexity limit são aplicados aqui.</span></span>. Campos inexistentes → erro antes de qualquer resolver.
    </div>
  </div>
  <div class="gql-arr">→</div>
  <div class="gql-step" style="border-color:rgba(74,222,128,.3)">
    <div style="font-size:9px;color:#4ade80;letter-spacing:.1em;margin-bottom:8px;font-weight:700">④ EXECUTE</div>
    <div style="font-size:10px;color:#64748b;line-height:1.7">
      GraphQL percorre a AST <span class="gql-cyc-tip">campo a campo<span class="gql-cyc-tb">O executor inicia pelo resolver raiz (Query.user), usa o valor retornado como 'parent' para os resolvers filhos (User.name, User.posts). A cadeia continua recursivamente.</span></span>, chamando o resolver de cada campo com o valor do pai como primeiro argumento.
    </div>
  </div>
</div>
<div style="background:#1e293b;border-radius:8px;padding:14px 16px;border:1px solid #1e3a5f">
  <div style="font-size:9px;color:#E10098;letter-spacing:.1em;font-weight:600;margin-bottom:10px;text-transform:uppercase">Resolver chain — como os valores fluem</div>
  <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
    <div style="background:#0f172a;border:1px solid rgba(225,0,152,.3);border-radius:6px;padding:8px 12px;font-size:10px">
      <div style="color:#E10098;font-weight:700;margin-bottom:3px">Query.user</div>
      <div style="color:#475569">parent: null<br>args: {id:'1'}<br>→ UserObj</div>
    </div>
    <span style="color:#334155;font-size:18px">→</span>
    <div style="background:#0f172a;border:1px solid #334155;border-radius:6px;padding:8px 12px;font-size:10px">
      <div style="color:#94a3b8;font-weight:700;margin-bottom:3px">User.name</div>
      <div style="color:#475569">parent: UserObj<br>→ 'Ana'</div>
    </div>
    <span style="color:#334155;font-size:18px">→</span>
    <div style="background:#0f172a;border:1px solid #334155;border-radius:6px;padding:8px 12px;font-size:10px">
      <div style="color:#94a3b8;font-weight:700;margin-bottom:3px">User.posts</div>
      <div style="color:#475569">parent: UserObj<br>→ Post[]</div>
    </div>
    <span style="color:#334155;font-size:18px">→</span>
    <div style="background:#0f172a;border:1px solid #334155;border-radius:6px;padding:8px 12px;font-size:10px">
      <div style="color:#94a3b8;font-weight:700;margin-bottom:3px">Post.title</div>
      <div style="color:#475569">parent: PostObj<br>→ string</div>
    </div>
  </div>
  <p style="font-size:11px;color:#475569;margin:10px 0 0;line-height:1.6">Cada resolver recebe <code style="color:#E10098">(parent, args, context, info)</code>. O <strong style="color:#94a3b8">parent</strong> é o valor retornado pelo resolver do campo pai. O <strong style="color:#94a3b8">context</strong> é compartilhado por todos os resolvers do request (DataLoader, auth).</p>
</div>
</div>`,
      caption: "A execução GraphQL é uma travessia da árvore de campos: cada nó chama seu resolver com o valor do pai como argumento. Entender esse fluxo explica por que o N+1 existe e como o DataLoader o resolve.",
    },
    {
      title: "N+1 sem DataLoader vs com DataLoader — a diferença visual",
      html: `<style>
.gql-n1-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
@keyframes gql-n1-bad{0%,100%{background:rgba(239,68,68,.06);border-color:rgba(239,68,68,.25)}50%{background:rgba(239,68,68,.14);border-color:rgba(239,68,68,.5)}}
@keyframes gql-n1-good{0%,100%{background:rgba(74,222,128,.05);border-color:rgba(74,222,128,.2)}50%{background:rgba(74,222,128,.12);border-color:rgba(74,222,128,.45)}}
.gql-n1-bad{animation:gql-n1-bad 2.5s ease-in-out infinite;border:1px solid;border-radius:6px;padding:7px 11px;font-size:10px;color:#ef4444}
.gql-n1-good{animation:gql-n1-good 2.5s ease-in-out infinite;border:1px solid;border-radius:6px;padding:7px 11px;font-size:10px;color:#4ade80}
.gql-n1-q{background:#1e293b;border-radius:4px;padding:4px 8px;font-size:9.5px;color:#94a3b8;margin:3px 0;border-left:3px solid}
</style>
<div class="gql-n1-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">N+1 problem — sem DataLoader vs com DataLoader</p>
<p style="color:#475569;font-size:10px;margin:0 0 16px">Query: posts { title author { name } } com 5 posts</p>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
  <div>
    <div class="gql-n1-bad" style="margin-bottom:10px">❌ SEM DataLoader — N+1 queries</div>
    <div style="font-size:10px;color:#64748b;margin-bottom:8px;line-height:1.6">Resolver <code style="color:#ef4444">Post.author</code> roda para cada post separadamente:</div>
    <div class="gql-n1-q" style="border-color:#4ade80;color:#4ade80">SELECT * FROM posts LIMIT 5</div>
    <div style="font-size:9px;color:#475569;margin:4px 0 4px 8px">↳ 5 posts → resolver roda 5×:</div>
    <div class="gql-n1-q" style="border-color:#ef4444">SELECT * FROM users WHERE id = 1</div>
    <div class="gql-n1-q" style="border-color:#ef4444">SELECT * FROM users WHERE id = 2</div>
    <div class="gql-n1-q" style="border-color:#ef4444">SELECT * FROM users WHERE id = 3</div>
    <div class="gql-n1-q" style="border-color:#ef4444">SELECT * FROM users WHERE id = 4</div>
    <div class="gql-n1-q" style="border-color:#ef4444">SELECT * FROM users WHERE id = 5</div>
    <div style="background:#1e293b;border-radius:6px;padding:8px 10px;margin-top:8px;font-size:10px;color:#ef4444;font-weight:700">Total: 6 queries (1 + N)</div>
    <div style="font-size:9px;color:#475569;margin-top:4px;line-height:1.5">Com 100 posts → 101 queries.<br>Com 1000 posts → 1001 queries.</div>
  </div>
  <div>
    <div class="gql-n1-good" style="margin-bottom:10px">✓ COM DataLoader — 2 queries sempre</div>
    <div style="font-size:10px;color:#64748b;margin-bottom:8px;line-height:1.6">DataLoader acumula todos os IDs do mesmo <strong style="color:#94a3b8">tick</strong> do event loop:</div>
    <div class="gql-n1-q" style="border-color:#4ade80;color:#4ade80">SELECT * FROM posts LIMIT 5</div>
    <div style="font-size:9px;color:#475569;margin:4px 0 4px 8px">↳ DataLoader coleta: ids = [1,2,3,4,5]</div>
    <div class="gql-n1-q" style="border-color:#4ade80;color:#4ade80">SELECT * FROM users<br>&nbsp;WHERE id IN (1,2,3,4,5)</div>
    <div style="font-size:9px;color:#475569;margin:4px 0 4px 8px">↳ DataLoader distribui por ID</div>
    <div style="background:#1e293b;border-radius:6px;padding:8px 10px;margin-top:8px;font-size:10px;color:#4ade80;font-weight:700">Total: 2 queries (sempre)</div>
    <div style="font-size:9px;color:#475569;margin-top:4px;line-height:1.5">Com 100 posts → ainda 2 queries.<br>Com 1000 posts → ainda 2 queries.</div>
  </div>
</div>
<div style="background:#1e293b;border-radius:8px;padding:12px 14px;margin-top:14px;border:1px solid #1e3a5f">
  <div style="font-size:9px;color:#E10098;letter-spacing:.1em;font-weight:600;margin-bottom:8px;text-transform:uppercase">Como o DataLoader funciona internamente</div>
  <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
    <div style="background:#0f172a;border:1px solid #334155;border-radius:5px;padding:6px 10px;font-size:10px;color:#94a3b8">
      <div style="color:#E10098;font-size:9px;margin-bottom:2px">mesmo tick</div>
      loader.load(1)<br>loader.load(2)<br>loader.load(3)…
    </div>
    <span style="color:#334155">→</span>
    <div style="background:#0f172a;border:1px solid #334155;border-radius:5px;padding:6px 10px;font-size:10px;color:#94a3b8">
      <div style="color:#fbbf24;font-size:9px;margin-bottom:2px">próximo tick</div>
      batchFn([1,2,3,…])
    </div>
    <span style="color:#334155">→</span>
    <div style="background:#0f172a;border:1px solid #334155;border-radius:5px;padding:6px 10px;font-size:10px;color:#94a3b8">
      <div style="color:#4ade80;font-size:9px;margin-bottom:2px">resolve</div>
      Map{1→user, 2→user…}<br>Promises resolvidas
    </div>
  </div>
  <p style="font-size:10px;color:#475569;margin:8px 0 0;line-height:1.6"><strong style="color:#94a3b8">Regra de ouro:</strong> crie uma nova instância de DataLoader por request (no context) — nunca global, pois o cache seria compartilhado entre usuários.</p>
</div>
</div>`,
      caption: "O N+1 é o problema número 1 de performance em GraphQL. DataLoader resolve com batching no tick do event loop: todos os loads do mesmo ciclo são agrupados em um único batch. Sempre 2 queries independente do tamanho da lista.",
    },
    {
      title: "Schema types — SDL completo com Query, Mutation, Subscription, enums, scalars e directives",
      html: `<style>
.gql-sch-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.gql-sch-box{background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:11px 14px}
.gql-sch-kw{color:#E10098}
.gql-sch-type{color:#61DAFB}
.gql-sch-scalar{color:#4ade80}
.gql-sch-enum{color:#fbbf24}
.gql-sch-dir{color:#a78bfa}
.gql-sch-cm{color:#475569}
</style>
<div class="gql-sch-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Schema types — SDL e hierarquia de tipos</p>
<p style="color:#475569;font-size:10px;margin:0 0 16px">Query → Mutation → Subscription → custom types → scalars → enums</p>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
  <div>
    <div style="font-size:9px;color:#E10098;letter-spacing:.1em;font-weight:700;margin-bottom:6px;text-transform:uppercase">Entry points de operação</div>
    <div class="gql-sch-box" style="font-size:10.5px;line-height:2;color:#94a3b8">
      <span class="gql-sch-kw">type</span> <span class="gql-sch-type">Query</span> {<br>
      &nbsp;user(id: <span class="gql-sch-scalar">ID!</span>): <span class="gql-sch-type">User</span><br>
      &nbsp;posts(filter: <span class="gql-sch-type">PostFilter</span>): [<span class="gql-sch-type">Post</span>!]!<br>
      }<br>
      <span class="gql-sch-kw">type</span> <span class="gql-sch-type">Mutation</span> {<br>
      &nbsp;createPost(input: <span class="gql-sch-type">CreatePostInput</span>!): <span class="gql-sch-type">Post</span>!<br>
      &nbsp;deletePost(id: <span class="gql-sch-scalar">ID!</span>): <span class="gql-sch-scalar">Boolean</span>!<br>
      }<br>
      <span class="gql-sch-kw">type</span> <span class="gql-sch-type">Subscription</span> {<br>
      &nbsp;postCreated: <span class="gql-sch-type">Post</span>!<br>
      }
    </div>
  </div>
  <div>
    <div style="font-size:9px;color:#61DAFB;letter-spacing:.1em;font-weight:700;margin-bottom:6px;text-transform:uppercase">Tipos customizados e input</div>
    <div class="gql-sch-box" style="font-size:10.5px;line-height:2;color:#94a3b8">
      <span class="gql-sch-kw">type</span> <span class="gql-sch-type">Post</span> {<br>
      &nbsp;id: <span class="gql-sch-scalar">ID!</span><br>
      &nbsp;title: <span class="gql-sch-scalar">String!</span><br>
      &nbsp;status: <span class="gql-sch-type">PostStatus</span>!<br>
      &nbsp;author: <span class="gql-sch-type">User</span>!<br>
      }<br>
      <span class="gql-sch-kw">input</span> <span class="gql-sch-type">CreatePostInput</span> {<br>
      &nbsp;title: <span class="gql-sch-scalar">String!</span><br>
      &nbsp;authorId: <span class="gql-sch-scalar">ID!</span><br>
      }<br>
      <span class="gql-sch-kw">input</span> <span class="gql-sch-type">PostFilter</span> {<br>
      &nbsp;status: <span class="gql-sch-type">PostStatus</span><br>
      }
    </div>
  </div>
  <div>
    <div style="font-size:9px;color:#fbbf24;letter-spacing:.1em;font-weight:700;margin-bottom:6px;text-transform:uppercase">Enum, scalar e directive</div>
    <div class="gql-sch-box" style="font-size:10.5px;line-height:2;color:#94a3b8">
      <span class="gql-sch-kw">enum</span> <span class="gql-sch-enum">PostStatus</span> {<br>
      &nbsp;DRAFT  PUBLISHED  ARCHIVED<br>
      }<br>
      <span class="gql-sch-kw">scalar</span> <span class="gql-sch-scalar">DateTime</span><br>
      <span class="gql-sch-kw">scalar</span> <span class="gql-sch-scalar">JSON</span><br>
      <span class="gql-sch-dir">directive</span> <span class="gql-sch-dir">@auth</span>(role: <span class="gql-sch-scalar">String</span>) <span class="gql-sch-kw">on</span> FIELD_DEFINITION
    </div>
  </div>
  <div>
    <div style="font-size:9px;color:#a78bfa;letter-spacing:.1em;font-weight:700;margin-bottom:6px;text-transform:uppercase">Fragment e variables</div>
    <div class="gql-sch-box" style="font-size:10.5px;line-height:2;color:#94a3b8">
      <span class="gql-sch-cm"># Fragment — reutiliza campos</span><br>
      <span class="gql-sch-kw">fragment</span> <span class="gql-sch-type">PostFields</span> <span class="gql-sch-kw">on</span> Post {<br>
      &nbsp;id title status<br>
      }<br>
      <span class="gql-sch-cm"># Query com variable tipada</span><br>
      <span class="gql-sch-kw">query</span> GetPost(<span style="color:#a78bfa">$id</span>: <span class="gql-sch-scalar">ID!</span>) {<br>
      &nbsp;post(id: <span style="color:#a78bfa">$id</span>) { ...<span class="gql-sch-type">PostFields</span> }<br>
      }
    </div>
  </div>
</div>
<div style="background:#1e293b;border-radius:8px;padding:10px 14px;border:1px solid #1e3a5f">
  <div style="font-size:10px;color:#64748b;line-height:1.8">
    <span class="gql-sch-type">Query | Mutation | Subscription</span> → campos → <span class="gql-sch-type">custom types</span> (type / input) → <span class="gql-sch-scalar">Scalars</span> (String, Int, Float, Boolean, ID, custom) → <span class="gql-sch-enum">Enums</span><br>
    <span class="gql-sch-dir">Directives</span> anotam campos/tipos com comportamento extra (<code>@deprecated</code>, <code>@auth</code>, <code>@cacheControl</code>). <strong style="color:#94a3b8">!</strong> = non-null (obrigatório).
  </div>
</div>
</div>`,
      caption: "O schema é o contrato da API. Query são leituras, Mutation escrita, Subscription tempo real. input types são como o 'request body' do REST. Scalars customizados (DateTime, JSON) permitem tipos que o GraphQL não tem nativamente.",
    },
  ],
  keypoints: [
    {
      title: "Schema e SDL — o contrato da API",
      body: "SDL (Schema Definition Language) define o schema GraphQL. type descreve entidades retornadas pelo servidor. input descreve argumentos enviados pelo cliente para mutations. enum lista valores válidos. scalar representa tipos primitivos — built-in: String, Int, Float, Boolean, ID; customizados: DateTime, JSON, UUID. directive anota o schema com comportamento extra (@deprecated, @auth). O schema é imutável para o cliente — é o contrato compartilhado entre frontend e backend.",
      code: `type Query {
user(id: ID!): User
posts(status: PostStatus, limit: Int = 10): [Post!]!
}
type Mutation {
createPost(input: CreatePostInput!): Post!
}
type User {
id: ID!
name: String!
posts: [Post!]!
createdAt: DateTime!  # scalar customizado
}
input CreatePostInput {
title: String!
authorId: ID!
status: PostStatus = DRAFT
}
enum PostStatus { DRAFT  PUBLISHED  ARCHIVED }
scalar DateTime
directive @auth(role: String!) on FIELD_DEFINITION`,
    },
    {
      title: "Resolvers — (parent, args, context, info)",
      body: "Resolver é a função que retorna o valor de um campo. 4 argumentos: parent (valor do resolver pai — a cadeia), args (argumentos passados pelo cliente), context (objeto compartilhado por todos os resolvers do request — DataLoader, auth, db), info (metadados da query). Resolver padrão: se não definido para campo simples, GraphQL retorna parent[fieldName] automaticamente. Você só precisa definir resolvers onde há lógica ou o nome do campo não bate com a propriedade.",
      code: `const resolvers = {
Query: {
  user: async (_, { id }, { db }) => db.users.findById(id),
  posts: async (_, { status, limit }, { db }) =>
    db.posts.findMany({ where: { status }, take: limit }),
},
Mutation: {
  createPost: async (_, { input }, { db, user }) => {
    if (!user) throw new GraphQLError('Não autenticado', {
      extensions: { code: 'UNAUTHENTICATED' },
    })
    return db.posts.create({ data: input })
  },
},
User: {
  // parent = objeto User retornado por Query.user
  // sem DataLoader = N+1 em lista
  posts: (parent, _, { dataloaders }) =>
    dataloaders.postsByUserId.load(parent.id),
},
}`,
    },
    {
      title: "DataLoader — batch e cache para eliminar N+1",
      body: "DataLoader funciona em dois passos: (1) loader.load(id) não executa — registra o id em um buffer; (2) no próximo tick do event loop, batchFn é chamada com todos os IDs acumulados de uma vez, faz uma única query e retorna array de resultados na mesma ordem dos IDs. DataLoader também faz cache por request: load(id) chamado duas vezes retorna o mesmo resultado sem ir ao banco. Regra crítica: instância nova por request no context — nunca singleton.",
      code: `import DataLoader from 'dataloader'

// batchFn deve retornar resultados na MESMA ORDEM dos ids
async function batchUsers(ids: readonly string[], prisma: PrismaClient) {
const users = await prisma.user.findMany({ where: { id: { in: [...ids] } } })
const byId = new Map(users.map(u => [u.id, u]))
// Map garante a ordem correta dos IDs
return ids.map(id => byId.get(id) ?? new Error(\`User \${id} não encontrado\`))
}

// Criar por request — no Apollo context function
function createContext({ prisma }: { prisma: PrismaClient }) {
return {
  prisma,
  dataloaders: {
    // Nova instância por request = cache isolado por request
    users: new DataLoader((ids: readonly string[]) =>
      batchUsers(ids, prisma)
    ),
  },
}
}

// No resolver — load() acumula no tick, batch roda uma vez
const resolvers = {
Post: {
  author: (post, _, { dataloaders }) =>
    dataloaders.users.load(post.authorId),
},
}`,
    },
    {
      title: "Subscriptions com Redis PubSub",
      body: "Subscriptions entregam dados em tempo real via WebSocket. O servidor publica eventos em um canal (PubSub.publish) e o cliente está subscrito nesse canal. Em escala horizontal, use Redis PubSub para que qualquer instância do servidor possa publicar e todos os servidores recebam o evento para encaminhar aos clientes conectados. PubSub in-memory funciona apenas em dev (instância única).",
      code: `import { RedisPubSub } from 'graphql-redis-subscriptions'
import Redis from 'ioredis'

const pubsub = new RedisPubSub({
publisher: new Redis({ host: process.env.REDIS_HOST }),
subscriber: new Redis({ host: process.env.REDIS_HOST }),
})

const POST_CREATED = 'POST_CREATED'

const resolvers = {
Mutation: {
  createPost: async (_, { input }, { db }) => {
    const post = await db.posts.create({ data: input })
    await pubsub.publish(POST_CREATED, { postCreated: post })
    return post
  },
},
Subscription: {
  postCreated: {
    subscribe: () => pubsub.asyncIterator([POST_CREATED]),
  },
},
}`,
    },
    {
      title: "Segurança — depth limit, complexity, introspection, persisted queries",
      body: "Uma API GraphQL sem limitações é vulnerável: queries aninhadas infinitas causam recursão; queries de alta complexidade derrubam o banco. Medidas: (1) depth limiting — rejeita queries com aninhamento acima de N níveis; (2) complexity limiting — cada campo tem custo, query acima do limite é rejeitada antes de executar; (3) introspection desabilitada em produção; (4) persisted queries — só aceita hashes de queries pré-aprovadas; (5) rate limiting por operação/usuário.",
      code: `import depthLimit from 'graphql-depth-limit'
import { createComplexityLimitRule } from 'graphql-validation-complexity'

const server = new ApolloServer({
typeDefs,
resolvers,
validationRules: [
  depthLimit(7),                        // max 7 níveis
  createComplexityLimitRule(1000, {      // max 1000 pontos
    scalarCost: 1,
    objectCost: 10,
    listFactor: 10,
  }),
],
introspection: process.env.NODE_ENV !== 'production',
})`,
    },
    {
      title: "Context e autenticação — verificação centralizada",
      body: "O context é criado uma vez por request e passado para todos os resolvers. Autenticação deve acontecer na função de context — não dentro de cada resolver. Coloque no context: usuário autenticado (extraído do JWT), conexão de banco, instâncias de DataLoader (criadas por request). Nunca crie DataLoader dentro do resolver (criaria um loader por chamada, sem batching).",
      code: `const { url } = await startStandaloneServer(server, {
context: async ({ req }) => {
  const token = req.headers.authorization?.split(' ')[1]
  let user = null
  if (token) {
    try { user = jwt.verify(token, process.env.JWT_SECRET) }
    catch { /* token inválido — user permanece null */ }
  }
  return {
    user,           // null se não autenticado
    prisma,
    dataloaders: createDataLoaders(prisma),  // nova instância por request
  }
},
})`,
    },
    {
      title: "Error handling — HTTP 200 sempre, erros em errors[]",
      body: "GraphQL sempre retorna HTTP 200, mesmo em caso de erro de negócio. Erros ficam no array errors[] do response body. Isso significa que monitoramento baseado em status code HTTP não funciona — monitore o array errors[]. Use GraphQLError com extensions.code para categorizar: UNAUTHENTICATED, FORBIDDEN, NOT_FOUND, VALIDATION_ERROR. Nunca retorne null em mutation sem incluir o erro correspondente.",
      code: `// GraphQLError com extensions — padrão Apollo
throw new GraphQLError('Post não encontrado', {
extensions: {
  code: 'NOT_FOUND',
  postId: id,
},
})

// Response — HTTP 200, erro em errors[]
// { "data": { "post": null },
//   "errors": [{ "message": "Post não encontrado",
//                "extensions": { "code": "NOT_FOUND" },
//                "path": ["post"] }] }`,
    },
    {
      title: "Code-first vs schema-first — quando usar cada",
      body: "Schema-first: você escreve SDL manualmente (.graphql) e implementa resolvers correspondentes. Explícito e legível, mas pode desincronizar com TypeScript. Code-first: decorators TypeScript geram o schema automaticamente (TypeGraphQL, NestJS @nestjs/graphql). Vantagem: schema sempre sincronizado com os tipos TS, sem duplicação. Desvantagem: a abstração pode esconder o SDL real. Em NestJS, code-first é o padrão recomendado.",
      code: `// Code-first com TypeGraphQL
@ObjectType()
class Post {
@Field(() => ID) id: string
@Field() title: string
@Field(() => PostStatus) status: PostStatus
}

@Resolver(() => Post)
class PostResolver {
@Query(() => [Post])
async posts(@Ctx() { prisma }: Context): Promise<Post[]> {
  return prisma.post.findMany()
}

@Mutation(() => Post)
@Authorized('ADMIN')
async createPost(
  @Arg('input') input: CreatePostInput,
  @Ctx() { prisma }: Context,
): Promise<Post> {
  return prisma.post.create({ data: input })
}
}`,
    },
    {
      title: "Apollo Federation — schema distribuído entre microserviços",
      body: "Federation permite que múltiplos serviços GraphQL contribuam para um schema unificado. Cada serviço usa @key para declarar a entidade que 'possui' e pode estender tipos de outros serviços. O Apollo Router compõe os schemas e roteia queries. Ideal para microserviços onde o frontend deve enxergar um único endpoint GraphQL sem saber de quantos serviços os dados vêm.",
      code: `# Serviço de usuários — dono de User
type User @key(fields: "id") {
id: ID!
name: String!
}

# Serviço de posts — estende User com posts
extend type User @key(fields: "id") {
id: ID! @external
posts: [Post!]!
}

# Resolver de referência — permite ao Router reconstituir User
const resolvers = {
User: {
  __resolveReference: ({ id }, { prisma }) =>
    prisma.user.findUnique({ where: { id } }),
  posts: ({ id }, _, { prisma }) =>
    prisma.post.findMany({ where: { authorId: id } }),
},
}`,
    },
    {
      title: "Persisted queries — segurança e performance",
      body: "Persisted queries (APQ) substituem o texto da query pelo hash SHA256. O cliente envia o hash; se o servidor não o conhece, cliente reenvia com a query completa. Em produção: configure o servidor para aceitar apenas hashes pré-registrados (trusted documents), bloqueando queries arbitrárias — incluindo tentativas de exploração de depth/complexity.",
      code: `// Apollo Client — APQ automático
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries'
import { sha256 } from 'crypto-hash'

const link = createPersistedQueryLink({ sha256 }).concat(httpLink)

// Apollo Server — somente queries pré-registradas em produção
import { ApolloServerPluginPersistedQueries } from '@apollo/server/plugin/persistedQueries'

const server = new ApolloServer({
plugins: [
  ApolloServerPluginPersistedQueries({
    allowUnpersistedOperation: process.env.NODE_ENV !== 'production',
  }),
],
})`,
    },
    {
      title: "Setup Apollo Server completo — configuração de produção",
      body: "Apollo Server v4 é a implementação de referência. O setup básico: typeDefs (schema SDL), resolvers, plugins e função de context. Para produção: desabilite introspection, desabilite o sandbox, formate erros removendo stack traces, adicione plugins de logging.",
      code: `import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled'

const server = new ApolloServer({
typeDefs,
resolvers,
plugins: [
  process.env.NODE_ENV === 'production'
    ? ApolloServerPluginLandingPageDisabled()
    : ApolloServerPluginLandingPageLocalDefault(),
],
introspection: process.env.NODE_ENV !== 'production',
formatError: (formattedError) => {
  if (process.env.NODE_ENV === 'production') {
    // Remove stack traces em produção
    return { message: formattedError.message, extensions: formattedError.extensions }
  }
  return formattedError
},
})

const { url } = await startStandaloneServer(server, {
listen: { port: 4000 },
context: async ({ req }) => ({
  user: extractUser(req),
  prisma,
  dataloaders: createDataLoaders(prisma),
}),
})`,
    },
    {
      title: "N+1 alternativas — join no resolver pai",
      body: "DataLoader é a solução mais elegante para N+1, mas quando você sempre vai precisar de um campo relacionado, pode fazer JOIN no resolver pai — isso evita o N+1 sem DataLoader, sacrificando a granularidade do GraphQL (carrega sempre, mesmo que o cliente não peça). DataLoader para campos opcionais pedidos às vezes; JOIN no pai para relações sempre pedidas.",
      code: `// Opção 1: DataLoader (granular, recomendado na maioria dos casos)
Post: {
author: (post, _, { dataloaders }) =>
  dataloaders.users.load(post.authorId),  // batch automático
}

// Opção 2: JOIN no resolver pai (sempre carrega, mais simples)
Query: {
posts: async (_, __, { prisma }) =>
  prisma.post.findMany({
    include: { author: true },  // author sempre vem junto
  }),
}
Post: {
author: (post) => post.author,  // usa o que já veio do JOIN
}`,
    },
    {
      title: "Estrutura de projeto escalável — separar por domínio",
      body: "Em projetos grandes, separar resolvers e typeDefs por domínio. Usar @graphql-tools/merge para combinar schemas e resolvers de múltiplos arquivos. DataLoaders centralizados em uma função createDataLoaders(prisma) chamada no context.",
      code: `// resolvers/user.ts — só resolvers de User
export const userResolvers = {
Query: { user, users },
Mutation: { createUser, updateUser },
User: { posts, orders },
}

// resolvers/post.ts — só resolvers de Post
export const postResolvers = {
Query: { post, posts },
Mutation: { createPost },
Post: { author },
}

// resolvers/index.ts — merge
import { mergeResolvers } from '@graphql-tools/merge'
export const resolvers = mergeResolvers([userResolvers, postResolvers])

// typeDefs/index.ts — merge de SDL
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'
export const typeDefs = mergeTypeDefs(loadFilesSync('./src/**/*.graphql'))`,
    },
  ],
  cheatsheet: {
    title: "GraphQL — Cheat Sheet SDL + Resolvers + DataLoader",
    html: `<style>
.gql-cs-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:20px}
.gql-cs-card{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px 14px}
.gql-cs-head{font-size:9px;color:#64748b;letter-spacing:.14em;text-transform:uppercase;margin:14px 0 8px;padding-bottom:5px;border-bottom:1px solid #1e3a5f}
.gql-cs-kw{color:#E10098}
.gql-cs-type{color:#61DAFB}
.gql-cs-sc{color:#4ade80}
.gql-cs-en{color:#fbbf24}
.gql-cs-cm{color:#475569}
.gql-cs-label{font-size:10px;font-weight:700;margin-bottom:5px}
.gql-cs-body{font-size:9.5px;color:#64748b;line-height:1.55}
.gql-cs-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
</style>
<div class="gql-cs-wrap">
<p style="color:#e2e8f0;font-size:11px;font-weight:700;margin:0 0 14px;letter-spacing:.06em">GRAPHQL — CHEAT SHEET</p>
<div class="gql-cs-head">SDL — DEFINIÇÃO DE SCHEMA</div>
<div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px 14px;font-size:10px;line-height:2;color:#94a3b8;margin-bottom:8px">
  <span class="gql-cs-kw">type</span> <span class="gql-cs-type">Query</span> { user(id: <span class="gql-cs-sc">ID!</span>): <span class="gql-cs-type">User</span>  posts: [<span class="gql-cs-type">Post</span>!]! }<br>
  <span class="gql-cs-kw">type</span> <span class="gql-cs-type">Mutation</span> { createUser(input: <span class="gql-cs-type">CreateUserInput</span>!): <span class="gql-cs-type">User</span>! }<br>
  <span class="gql-cs-kw">type</span> <span class="gql-cs-type">Subscription</span> { userCreated: <span class="gql-cs-type">User</span>! }<br>
  <span class="gql-cs-kw">type</span> <span class="gql-cs-type">User</span> { id: <span class="gql-cs-sc">ID!</span>  name: <span class="gql-cs-sc">String!</span>  role: <span class="gql-cs-en">Role</span>  posts: [<span class="gql-cs-type">Post</span>!]! }<br>
  <span class="gql-cs-kw">input</span> <span class="gql-cs-type">CreateUserInput</span> { name: <span class="gql-cs-sc">String!</span>  email: <span class="gql-cs-sc">String!</span> }<br>
  <span class="gql-cs-kw">enum</span> <span class="gql-cs-en">Role</span> { ADMIN  USER  GUEST }<br>
  <span class="gql-cs-kw">scalar</span> <span class="gql-cs-sc">DateTime</span>  <span style="color:#a78bfa">directive</span> <span style="color:#a78bfa">@auth</span>(role: <span class="gql-cs-sc">String!</span>) <span class="gql-cs-kw">on</span> FIELD_DEFINITION
</div>
<div class="gql-cs-head">RESOLVERS — ASSINATURA E PADRÕES</div>
<div class="gql-cs-grid" style="margin-bottom:8px">
  <div class="gql-cs-card">
    <div class="gql-cs-label" style="color:#E10098">4 args — PACI</div>
    <div style="font-size:10px;line-height:1.9;color:#94a3b8">
      field: (<span style="color:#E10098">P</span>arent,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span style="color:#61DAFB">A</span>rgs,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span style="color:#4ade80">C</span>ontext,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span style="color:#fbbf24">I</span>nfo) =&gt; valor
    </div>
  </div>
  <div class="gql-cs-card">
    <div class="gql-cs-label" style="color:#4ade80">DataLoader — obrigatório</div>
    <div style="font-size:10px;line-height:1.9;color:#94a3b8">
      Post: {<br>
      &nbsp;author: (p, _, { dl }) =&gt;<br>
      &nbsp;&nbsp;dl.users.load(p.authorId)<br>
      }
    </div>
  </div>
  <div class="gql-cs-card">
    <div class="gql-cs-label" style="color:#fbbf24">Subscription</div>
    <div style="font-size:10px;line-height:1.9;color:#94a3b8">
      postCreated: {<br>
      &nbsp;subscribe: () =&gt;<br>
      &nbsp;&nbsp;pubsub.asyncIterator([<br>
      &nbsp;&nbsp;&nbsp;'POST_CREATED'])<br>
      }
    </div>
  </div>
  <div class="gql-cs-card">
    <div class="gql-cs-label" style="color:#ef4444">Erro GraphQL</div>
    <div style="font-size:10px;line-height:1.9;color:#94a3b8">
      <span class="gql-cs-kw">throw new</span> GraphQLError(<br>
      &nbsp;'msg', { extensions: {<br>
      &nbsp;&nbsp;code: 'NOT_FOUND'<br>
      &nbsp;}})<br>
      <span class="gql-cs-cm">// HTTP 200, erro em errors[]</span>
    </div>
  </div>
</div>
<div class="gql-cs-head">DATALOADER — SETUP OBRIGATÓRIO</div>
<div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px 14px;font-size:10px;line-height:1.9;color:#94a3b8;margin-bottom:8px">
  <span class="gql-cs-kw">new</span> DataLoader(<span class="gql-cs-kw">async</span> (ids) =&gt; {<br>
  &nbsp;&nbsp;<span class="gql-cs-kw">const</span> rows = <span class="gql-cs-kw">await</span> db.findMany({ where: { id: { in: [...ids] } } })<br>
  &nbsp;&nbsp;<span class="gql-cs-kw">const</span> map = <span class="gql-cs-kw">new</span> Map(rows.map(r =&gt; [r.id, r]))<br>
  &nbsp;&nbsp;<span class="gql-cs-kw">return</span> ids.map(id =&gt; map.get(id)) <span class="gql-cs-cm">// MESMA ordem dos ids</span><br>
  }) <span class="gql-cs-cm">// Nova instância por request — nunca global</span>
</div>
<div class="gql-cs-head">SEGURANÇA — CHECKLIST DE PRODUÇÃO</div>
<div class="gql-cs-grid">
  <div class="gql-cs-card">
    <div class="gql-cs-label" style="color:#ef4444">Nunca em produção</div>
    <div class="gql-cs-body">❌ introspection: true<br>❌ sem depthLimit<br>❌ sem complexityLimit<br>❌ DataLoader singleton</div>
  </div>
  <div class="gql-cs-card">
    <div class="gql-cs-label" style="color:#4ade80">Sempre em produção</div>
    <div class="gql-cs-body">✓ depthLimit(7)<br>✓ complexityLimit(1000)<br>✓ persisted queries<br>✓ rate limit por operação</div>
  </div>
</div>
</div>`,
  },
  gotchas: [
    "N+1 sem DataLoader: o resolver de campo relacionado (Post.author) executa uma query para cada item da lista. Com 100 posts são 101 queries. DataLoader com batchFn resolve para 2 queries independente do tamanho — obrigatório em produção.",
    "DataLoader singleton (instância global): se você cria o DataLoader fora da função de context, o cache é compartilhado entre requests e usuários diferentes. Crie sempre uma instância nova no context por request.",
    "Introspection em produção: permite que qualquer pessoa mapeie todo o schema, descubra tipos, campos e argumentos. Desabilite com introspection: false no Apollo Server em produção.",
    "Sem depth/complexity limit: uma query aninhada como { users { posts { comments { author { posts { ... } } } } } } pode causar JOINs exponenciais. Implemente depthLimit e complexityLimit como validationRules antes de ir para produção.",
    "Mutation retornando null sem erro explícito: GraphQL sempre retorna HTTP 200. Se um campo de mutation retorna null (tipo nullable), o cliente não sabe se foi intencional ou falha silenciosa. Use campos non-null (!) ou lance GraphQLError.",
    "batchFn retornando resultados fora de ordem: DataLoader exige que batchFn retorne resultados na exata mesma ordem dos IDs recebidos. Se usar findMany com IN(), o banco não garante ordem — use um Map keyed por ID para ordenar corretamente.",
    "Overfetching no resolver pai para evitar N+1: carregar sempre todos os campos relacionados com JOIN mesmo quando o cliente não pediu sacrifica a granularidade do GraphQL. DataLoader mantém a granularidade sem o N+1.",
    "Erro de negócio lançado como Error nativo: o Apollo converte Error em resposta de erro mas perde o extensions.code. Use sempre GraphQLError para que o cliente possa tratar erros categorizados (UNAUTHENTICATED vs NOT_FOUND).",
  ],
  interview: [
    {
      q: "Como o ciclo de execução de uma query GraphQL funciona? Quais as fases?",
      level: "senior",
      a: "<p>Uma query GraphQL passa por três fases antes de retornar dados:</p><ol><li><strong>Parse</strong>: o texto é convertido em AST pelo lexer + parser. Erros de sintaxe retornam imediatamente.</li><li><strong>Validate</strong>: a AST é verificada semanticamente contra o schema. Campos inexistentes, argumentos com tipo errado — todos geram erros antes de um único resolver ser chamado. É aqui que depth limit e complexity limit entram.</li><li><strong>Execute</strong>: o executor percorre a AST campo a campo, chamando o resolver de cada campo com o valor do pai como primeiro argumento (parent). Começa nos campos de Query/Mutation/Subscription e desce recursivamente.</li></ol><p>Cada resolver recebe <code>(parent, args, context, info)</code>. O context é compartilhado por todos os resolvers do mesmo request.</p>",
      tip: "Mencionar PVEX (Parse → Validate → Execute) mostra que você conhece a separação de fases. O ponto chave: validate roda antes de execute — consultas maliciosas são rejeitadas sem tocar no banco se depth/complexity limit estiverem configurados.",
    },
    {
      q: "Explique o problema N+1 em GraphQL e como o DataLoader resolve. Como funciona internamente?",
      level: "senior",
      a: "<p>O <strong>N+1</strong> surge porque GraphQL executa resolvers campo a campo. Com 100 posts e resolver <code>Post.author</code> que faz <code>db.users.findById(post.authorId)</code>, o resultado é 1 + 100 = 101 queries.</p><p><strong>DataLoader</strong> resolve com batching assíncrono:</p><ol><li><code>loader.load(id)</code> não executa — registra o ID no buffer e retorna uma Promise.</li><li>No <em>próximo tick do event loop</em>, a <code>batchFn</code> é chamada com todos os IDs acumulados. Você faz uma única query <code>WHERE id IN (...)</code> e retorna array na mesma ordem dos IDs.</li></ol><p><strong>Regra crítica 1:</strong> a <code>batchFn</code> deve retornar resultados na <strong>mesma ordem</strong> dos IDs recebidos — use Map keyed por ID.</p><p><strong>Regra crítica 2:</strong> crie nova instância de DataLoader por request no context — nunca singleton, o cache interno vazaria entre usuários.</p>",
      tip: "A maioria menciona 'DataLoader faz batch'. O que diferencia sênior é explicar o mecanismo interno: buffer no tick + batchFn no próximo tick. E a armadilha da ordenação da batchFn.",
    },
    {
      q: "GraphQL vs REST — quando usar cada? E quando usar BFF?",
      level: "pleno",
      a: "<p><strong>REST:</strong> API pública consumida por terceiros, caching HTTP nativo, operações simples CRUD onde overfetching não é problema, equipes que já dominam REST.</p><p><strong>GraphQL:</strong> múltiplos clientes com necessidades diferentes (mobile precisa menos campos que web), schema como contrato forte entre times, federation de microserviços com schema unificado.</p><p><strong>BFF (Backend for Frontend):</strong> um padrão que combina os dois — REST internamente entre microserviços (contratos simples, performance) e GraphQL na borda para os clientes. O BFF GraphQL agrega serviços REST e expõe flexibilidade sem expor a complexidade interna.</p>",
    },
    {
      q: "Como você protegeria uma API GraphQL em produção?",
      level: "senior",
      a: "<p>Checklist em ordem de prioridade:</p><ol><li><strong>Desabilitar introspection:</strong> <code>introspection: false</code> em produção. Sem isso, qualquer pessoa mapeia o schema completo.</li><li><strong>Depth limiting:</strong> <code>depthLimit(7)</code> como validationRule. Previne queries aninhadas recursivas.</li><li><strong>Complexity limiting:</strong> cada campo tem custo. Rejeita queries custosas antes de executar.</li><li><strong>Rate limiting por operação:</strong> limitar por IP e usuário autenticado.</li><li><strong>Persisted queries:</strong> em produção, aceitar apenas hashes de queries pré-registradas — bloqueia queries arbitrárias.</li><li><strong>Auth no context:</strong> verificar JWT uma vez antes de qualquer resolver.</li></ol>",
      tip: "Listar na ordem certa importa. Persisted queries é o nível avançado que diferencia quem operou GraphQL em produção.",
    },
    {
      q: "O que é Apollo Federation e quando usar?",
      level: "senior",
      a: "<p>Federation permite que múltiplos serviços GraphQL independentes contribuam para um schema unificado acessado por um único endpoint (Apollo Router).</p><p><strong>Como funciona:</strong> cada serviço declara os tipos que 'possui' com <code>@key</code> e pode estender tipos de outros serviços. O Router planeja quais subgraphs consultar para cada campo e agrega os resultados.</p><p><strong>Quando usar:</strong> microserviços onde o frontend deve ver um único schema sem saber de quantos serviços os dados vêm.</p><p><strong>Quando NÃO usar:</strong> monolitos, times pequenos, quando a complexidade operacional não se justifica. Federation adiciona latência de rede entre subgraphs e complexidade de deployment.</p>",
    },
    {
      q: "Por que GraphQL sempre retorna HTTP 200? Quais os problemas para monitoramento?",
      level: "pleno",
      a: "<p>GraphQL usa um único endpoint POST. Sucesso parcial é possível — parte dos dados pode resolver enquanto outro campo falha. Por isso HTTP 200 é retornado mesmo em erro, com erros em <code>errors[]</code> e dados em <code>data[]</code>.</p><p><strong>Problemas para monitoramento:</strong> alertas de error rate baseados em HTTP ficam cegos, load balancers que rotam em erros HTTP não funcionam como esperado.</p><p><strong>Soluções:</strong> instrumentar plugin no Apollo Server que monitora o array <code>errors[]</code> e emite métricas; usar Apollo Studio; categorizar com <code>extensions.code</code> para diferenciar erros de cliente (UNAUTHENTICATED — não alertar) de servidor (INTERNAL_SERVER_ERROR — alertar).</p>",
    },
    {
      q: "Qual a diferença entre schema-first e code-first? Quando usar cada?",
      level: "pleno",
      a: "<p><strong>Schema-first:</strong> SDL escrito manualmente em arquivos .graphql. Explícito e legível, bom como contrato entre times. Pode desincronizar com TypeScript — use GraphQL Code Generator para gerar tipos TS a partir do SDL.</p><p><strong>Code-first:</strong> decorators TypeScript geram o SDL automaticamente (TypeGraphQL, NestJS). Schema sempre sincronizado, sem duplicação, autocompletion. A abstração pode esconder o SDL real.</p><p><strong>Quando usar:</strong> code-first para NestJS e times TypeScript-centric. Schema-first quando o SDL é o documento de contrato entre times distintos ou em projetos multilinguagem.</p>",
    },
    {
      q: "Como funciona o context no GraphQL? Quais as boas práticas?",
      level: "pleno",
      a: "<p>O context é criado uma vez por request e passado como terceiro argumento para todos os resolvers daquele request.</p><p><strong>O que colocar no context:</strong></p><ul><li><strong>Usuário autenticado:</strong> extraído e verificado do JWT uma vez na função de context</li><li><strong>Conexão de banco:</strong> instância Prisma ou pool</li><li><strong>DataLoaders:</strong> criados por request aqui — nunca dentro do resolver</li></ul><p><strong>Boas práticas:</strong> autenticação no context (erros de auth antes de qualquer resolver), context imutável durante o request, tipagem em TypeScript para autocompletion.</p>",
    },
    {
      q: "Explique subscriptions em GraphQL. Quais os desafios de escala horizontal?",
      level: "senior",
      a: "<p>Subscriptions entregam dados em tempo real via WebSocket. O cliente subscreve → servidor registra no PubSub → Mutation publica evento → servidor envia via WebSocket.</p><p><strong>Desafio de escala horizontal:</strong> WebSockets são stateful — o cliente está conectado a um servidor específico. Se o evento é publicado pela instância B, a instância A (onde o cliente está) não sabe.</p><p><strong>Solução: Redis PubSub</strong> — toda instância publica no Redis e assina o Redis. Quando uma instância publica, o Redis entrega para todas as instâncias, que repassam para os WebSockets conectados nelas.</p><p><strong>Custo operacional:</strong> WebSockets são conexões persistentes — cada cliente conectado consome recursos. Implemente heartbeat e timeout para conexões inativas.</p>",
    },
    {
      q: "O que são persisted queries e por que são importantes para segurança?",
      level: "senior",
      a: "<p>Persisted queries (APQ) substituem o texto da query pelo hash SHA256.</p><p><strong>Fluxo:</strong> cliente envia hash → servidor não conhece → cliente reenvia com query completa → servidor armazena e processa.</p><p><strong>Por que são importantes para segurança:</strong> em produção, configure o servidor para aceitar <strong>apenas hashes pré-registrados</strong> (trusted documents). Isso bloqueia queries arbitrárias — incluindo exploração de depth/complexity por atores maliciosos.</p><p><strong>Benefícios adicionais:</strong> payload reduzido (hash vs texto completo), GET cacheável por CDN, análise de uso (o servidor sabe exatamente quais queries o frontend usa, facilitando deprecação segura).</p>",
      tip: "O ponto chave é 'trusted documents em produção'. Não basta saber que APQ existe — a implicação de segurança é o que diferencia sênior.",
    },
    {
      q: "Qual a diferença entre type e input em GraphQL? Por que não posso usar type como argumento?",
      level: "pleno",
      a: "<p><strong>type:</strong> descreve objetos retornados pelo servidor. Pode ter campos com resolvers, relações circulares, campos computados. É o 'output type'.</p><p><strong>input:</strong> descreve argumentos enviados pelo cliente. Só pode ter scalars, enums ou outros inputs. É o 'input type'.</p><p><strong>Por que não usar type como argumento?</strong> Tipos de output podem ter campos computados (resolvers) e comportamentos que não fazem sentido como input. Se GraphQL permitisse misturar, criaria ambiguidade e dificultaria validação.</p><p>Na prática: sempre crie um <code>CreateUserInput</code> separado do <code>User</code> type — o que o cliente envia para criar (name, email) é diferente do que o servidor retorna (id, createdAt).</p>",
    },
    {
      q: "Como estruturar resolvers em projeto GraphQL grande?",
      level: "senior",
      a: "<p><strong>1. Separar por domínio:</strong> cada arquivo contém os resolvers do seu domínio (userResolvers, postResolvers) e são combinados com <code>mergeResolvers</code> do @graphql-tools/merge.</p><p><strong>2. SDL separado por arquivo:</strong> <code>loadFilesSync</code> + <code>mergeTypeDefs</code> para combinar schemas de múltiplos arquivos .graphql.</p><p><strong>3. DataLoaders centralizados:</strong> função <code>createDataLoaders(prisma)</code> chamada no context — cada loader disponível via <code>context.dataloaders.users.load(id)</code>.</p><p><strong>4. Auth declarativo com graphql-shield:</strong> regras por tipo/campo de forma declarativa em vez de <code>if (!user)</code> repetido em cada resolver.</p>",
    },
    {
      q: "Como implementar soft delete em GraphQL sem vazar dados deletados?",
      level: "senior",
      a: "<p><strong>3 camadas de proteção:</strong></p><p><strong>1. Filtro no banco em todos os resolvers:</strong> <code>where: { deletedAt: null }</code>. Se esquecer em um resolver, os dados aparecem.</p><p><strong>2. Middleware centralizado (Prisma Extension):</strong> adicionar o filtro automaticamente em todas as queries do modelo — sem depender de cada resolver lembrar.</p><pre><code>const prisma = basePrisma.$extends({\n  query: {\n    user: {\n      async findMany({ args, query }) {\n        args.where = { ...args.where, deletedAt: null }\n        return query(args)\n      },\n    },\n  },\n})</code></pre><p><strong>3. deletedAt não exposto no schema GraphQL:</strong> campo interno de soft delete não precisa aparecer no type User — o cliente não precisa saber desse detalhe de implementação.</p>",
    },
    {
      q: "O que é o problema N+1 no GraphQL e por que acontece?",
      a: "<p>O N+1 surge porque GraphQL executa resolvers campo a campo de forma independente. Quando uma query retorna uma lista de N itens e cada item dispara 1 query adicional para buscar dados relacionados, o total é 1 (lista) + N (relacionamentos) = N+1 queries.</p><p>Exemplo clássico: <code>{ posts { title author { name } } }</code> com 100 posts — 1 query busca os posts, depois o resolver <code>Post.author</code> é chamado 100 vezes, cada um fazendo <code>SELECT * FROM users WHERE id = ?</code> individualmente. O banco recebe 101 queries em vez de 2.</p><p>Acontece porque resolvers são funções independentes e não têm visibilidade de quantas outras instâncias do mesmo resolver vão executar no mesmo request. É o principal problema de performance em APIs GraphQL.</p>",
      tip: "Dar o exemplo concreto com o número de queries (1 + N = N+1) e explicar por que acontece arquiteturalmente é o que o entrevistador quer ouvir antes de falar de DataLoader.",
      level: "pleno",
    },
    {
      q: "O que é DataLoader e como resolve o N+1?",
      a: "<p>DataLoader agrupa (batcha) e cacheia chamadas ao banco dentro de um mesmo tick do Event Loop. Em vez de 100 queries <code>SELECT * FROM users WHERE id = X</code> individuais, executa 1 única query <code>SELECT * FROM users WHERE id IN (1, 2, ..., 100)</code>.</p><p><strong>Como funciona:</strong> <code>loader.load(id)</code> não executa imediatamente — registra o ID no buffer e retorna uma Promise. No próximo tick do Event Loop, a <code>batchFn</code> é chamada com todos os IDs acumulados. Você executa 1 query e retorna os resultados <em>na mesma ordem dos IDs recebidos</em> (use um Map keyed por ID para reordenar).</p><p><strong>Regra de ouro:</strong> crie uma nova instância de DataLoader por request no context — nunca use singleton global. O cache interno do DataLoader vaza dados entre usuários se compartilhado.</p>",
      tip: "A ordem da batchFn (deve retornar na mesma ordem dos IDs) e a instância por request (nunca singleton) são os dois pontos que separam quem implementou de quem apenas ouviu falar.",
      level: "pleno",
    },
    {
      q: "Qual a diferença entre SDL-first e Code-first no GraphQL?",
      a: "<p><strong>SDL-first:</strong> você escreve o schema em arquivos <code>.graphql</code> usando a GraphQL Schema Definition Language e depois implementa resolvers que devem casar com o schema definido. Vantagem: schema é explícito, legível, agnóstico de linguagem, facilita colaboração entre times. Desvantagem: schema e resolvers ficam em lugares separados — fácil ter discrepância.</p><p><strong>Code-first:</strong> você define o schema via código TypeScript (TypeGraphQL com decorators, ou Pothos com builders) e o SDL é gerado automaticamente. Vantagem: inferência de tipos nativa — schema e resolvers estão no mesmo lugar, TypeScript garante consistência. Desvantagem: curva maior, schema gerado pode ser menos legível.</p><p>Em times com frontend e backend separados, SDL-first facilita colaboração (o schema é o contrato). Em projetos TypeScript onde um time controla tudo, code-first tem DX superior.</p>",
      tip: "Apresentar o tradeoff colaboração (SDL-first) vs type safety integrada (code-first) em vez de declarar um vencedor demonstra maturidade arquitetural.",
      level: "senior",
    },
    {
      q: "Como funciona o cache normalizado do Apollo Client e por que é poderoso?",
      a: "<p>O Apollo Client InMemoryCache normaliza todos os objetos recebidos por <code>__typename + id</code> em um store flat. Se dois campos diferentes retornam o mesmo objeto (ex: <code>post.author</code> em uma query e <code>user</code> em outra, mesmo ID), Apollo mantém apenas <em>uma referência</em> no store — atualizar em um lugar atualiza automaticamente em todos os componentes que usam aquele objeto.</p><p>Isso elimina inconsistências de UI onde o mesmo usuário aparece com dados diferentes em partes distintas da tela. <code>typePolicies</code> permite customizar: como objetos são normalizados (keyFields customizados), como campos paginados são merged (merge functions para infinite scroll), e campos que nunca devem ser normalizados (read functions).</p>",
      tip: "Explicar que normalização = uma referência no store = consistência automática entre componentes é o insight central. Quem só sabe usar useQuery não entende por que o Apollo é diferente de um fetch simples.",
      level: "senior",
    },
    {
      q: "O que são persisted queries e por que usar em produção?",
      a: "<p>Em vez de enviar a query GraphQL completa no body de cada request, o cliente envia apenas um <strong>hash</strong> da query (calculado em build time). O servidor recebe o hash, busca a query completa em um registro (arquivo local, CDN ou banco) e executa.</p><p><strong>Benefícios:</strong> requests menores (30–90% de redução no payload), requests cacheáveis via GET (o hash é estável entre execuções), e <strong>segurança</strong>: o servidor pode rejeitar qualquer query não registrada — prevenindo introspection abusiva, queries maliciosas e ataques de complexidade. Em produção com <code>allowUnpersistedOperation: false</code>, apenas queries conhecidas e pré-aprovadas são executadas.</p>",
      tip: "O benefício de segurança (only known queries accepted) é frequentemente negligenciado. Mencioná-lo junto aos benefícios de performance situa sua resposta no nível de arquitetura de produção.",
      level: "senior",
    },
    {
      q: "Como implementar subscriptions no GraphQL?",
      a: "<p>Subscriptions usam WebSocket (ou SSE) em vez de HTTP. O resolver de subscription retorna um <code>AsyncIterator</code> — o executor do GraphQL consome eventos do iterator e os entrega ao cliente conectado.</p><p><strong>Setup com graphql-ws:</strong> no servidor, use <code>graphql-ws</code> como transporte WebSocket (o legado <code>subscriptions-transport-ws</code> está deprecated). O resolver define <code>subscribe</code> (retorna AsyncIterator do PubSub) e <code>resolve</code> (transforma o evento). Use PubSub in-memory em desenvolvimento e Redis PubSub em produção (múltiplas instâncias).</p><p><strong>No cliente (Apollo):</strong> <code>useSubscription</code> conecta via WebSocket e atualiza o cache automaticamente. Sempre limpe a subscription ao desmontar o componente — subscriptions ativas consomem recursos no servidor.</p>",
      tip: "Mencionar graphql-ws vs o legado subscriptions-transport-ws, e a necessidade de Redis PubSub em produção com múltiplas instâncias, mostra que você pensou em escalabilidade.",
      level: "senior",
    },
    {
      q: "Como lidar com erros parciais no GraphQL (partial success)?",
      a: "<p>GraphQL permite retornar dados parciais com erros simultaneamente — comportamento fundamentalmente diferente de REST, onde a resposta é 200 (sucesso total) ou 4xx/5xx (falha total). Em GraphQL, um campo pode ser <code>null</code> com um erro no array <code>errors</code> enquanto outros campos retornam dados normalmente.</p><p><strong>No servidor:</strong> use <code>formatError</code> para sanitizar erros antes de enviar ao cliente — nunca exponha stack traces em produção. Use <code>extensions.code</code> para categorizar erros (<code>UNAUTHENTICATED</code>, <code>FORBIDDEN</code>, <code>NOT_FOUND</code>) de forma que o cliente possa tratar programaticamente.</p><p><strong>No cliente:</strong> sempre verifique tanto <code>data</code> quanto <code>errors</code> na resposta — um erro em um campo não significa que toda a resposta falhou. Apollo Client propaga erros parciais via <code>errorPolicy: 'all'</code>.</p>",
      tip: "O comportamento de partial success é o que mais surpreende devs vindos de REST. Explicar que status 200 com errors[] é normal em GraphQL — e como tratar no cliente — demonstra experiência real.",
      level: "senior",
    },
  ],
  mnemonics: [
    {
      label: "PVEX — ciclo da query",
      trick: "Parse → Validate → EXecute",
      explanation: "Toda query passa por essas 3 fases nessa ordem. Validate roda contra o schema antes de qualquer resolver ser chamado. Execute percorre a AST campo a campo.",
    },
    {
      label: "PACI — argumentos do resolver",
      trick: "Parent, Args, Context, Info",
      explanation: "Os 4 argumentos de qualquer resolver, sempre nessa ordem. Parent é o valor do resolver pai. Args são os argumentos do cliente. Context é compartilhado por todo o request. Info raramente usado no dia a dia.",
    },
    {
      label: "DataLoader: acumula no tick, batch no próximo",
      trick: "load() acumula → próximo tick → batchFn([ids]) → 1 query",
      explanation: "load() não vai ao banco imediatamente — registra o ID no buffer. No próximo tick do event loop, a batchFn é chamada com todos os IDs. Uma query para todos.",
    },
  ],
  codeExamples: [
    {
      title: "Setup completo Apollo Server 4 + Prisma + DataLoader",
      description: "Stack mínima de produção: schema SDL, resolvers, context com DataLoaders criados por request, error handling tipado.",
      code: `import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { GraphQLError } from 'graphql'
import { PrismaClient } from '@prisma/client'
import DataLoader from 'dataloader'
import depthLimit from 'graphql-depth-limit'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

interface Context {
prisma: PrismaClient
user: { id: string; role: string } | null
loaders: ReturnType<typeof createLoaders>
}

function createLoaders(prisma: PrismaClient) {
return {
  usersById: new DataLoader<string, User | Error>(async (ids) => {
    const rows = await prisma.user.findMany({ where: { id: { in: [...ids] } } })
    const byId = new Map(rows.map(u => [u.id, u]))
    return ids.map(id => byId.get(id) ?? new Error(\`User \${id} não encontrado\`))
  }),
  postsByAuthorId: new DataLoader<string, Post[]>(async (authorIds) => {
    const rows = await prisma.post.findMany({
      where: { authorId: { in: [...authorIds] } },
    })
    const byAuthor = new Map<string, Post[]>()
    for (const id of authorIds) byAuthor.set(id, [])
    for (const post of rows) byAuthor.get(post.authorId)!.push(post)
    return authorIds.map(id => byAuthor.get(id) ?? [])
  }),
}
}

const typeDefs = \`#graphql
type Query { user(id: ID!): User  posts: [Post!]! }
type Mutation { createPost(input: CreatePostInput!): Post! }
type User { id: ID!  name: String!  posts: [Post!]! }
type Post { id: ID!  title: String!  author: User! }
input CreatePostInput { title: String!  authorId: ID! }
\`

const resolvers = {
Query: {
  user: (_: unknown, { id }: { id: string }, { loaders }: Context) =>
    loaders.usersById.load(id),
  posts: (_: unknown, __: unknown, { prisma }: Context) =>
    prisma.post.findMany(),
},
Mutation: {
  createPost: async (_: unknown, { input }: any, { prisma, user }: Context) => {
    if (!user) throw new GraphQLError('Não autenticado', {
      extensions: { code: 'UNAUTHENTICATED', http: { status: 401 } },
    })
    return prisma.post.create({ data: input })
  },
},
User: {
  posts: (parent: User, _: unknown, { loaders }: Context) =>
    loaders.postsByAuthorId.load(parent.id),
},
Post: {
  author: (parent: Post, _: unknown, { loaders }: Context) =>
    loaders.usersById.load(parent.authorId),
},
}

const server = new ApolloServer<Context>({
typeDefs,
resolvers,
validationRules: [depthLimit(7)],
introspection: process.env.NODE_ENV !== 'production',
formatError: (err) => {
  if (process.env.NODE_ENV === 'production') {
    return { message: err.message, extensions: { code: err.extensions?.code } }
  }
  return err
},
})

const { url } = await startStandaloneServer(server, {
listen: { port: 4000 },
context: async ({ req }): Promise<Context> => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  let user = null
  try {
    if (token) user = jwt.verify(token, process.env.JWT_SECRET!) as Context['user']
  } catch { /* token inválido */ }
  return { prisma, user, loaders: createLoaders(prisma) }
},
})
console.log(\`Servidor pronto em \${url}\`)`,
      language: "typescript",
    },
    {
      title: "Subscription com Redis PubSub e graphql-ws",
      description: "Subscriptions que escalam horizontalmente: Redis distribui eventos entre instâncias do servidor, qualquer instância pode publicar.",
      code: `import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import Redis from 'ioredis'

const pubsub = new RedisPubSub({
publisher: new Redis(process.env.REDIS_URL!),
subscriber: new Redis(process.env.REDIS_URL!),
})

const POST_CREATED = 'POST_CREATED'
const POST_UPDATED = (id: string) => \`POST_UPDATED:\${id}\`

const typeDefs = \`#graphql
type Subscription {
  postCreated: Post!
  postUpdated(id: ID!): Post!
}
type Mutation {
  createPost(input: CreatePostInput!): Post!
  updatePost(id: ID!, input: UpdatePostInput!): Post!
}
\`

const resolvers = {
Mutation: {
  createPost: async (_: unknown, { input }: any, { prisma }: Context) => {
    const post = await prisma.post.create({ data: input })
    // Publica em canal global
    await pubsub.publish(POST_CREATED, { postCreated: post })
    return post
  },
  updatePost: async (_: unknown, { id, input }: any, { prisma }: Context) => {
    const post = await prisma.post.update({ where: { id }, data: input })
    // Publica em canal específico do recurso
    await pubsub.publish(POST_UPDATED(id), { postUpdated: post })
    return post
  },
},
Subscription: {
  postCreated: {
    subscribe: () => pubsub.asyncIterator([POST_CREATED]),
  },
  postUpdated: {
    // Cliente passa id como variável → subscribe filtrado
    subscribe: (_: unknown, { id }: { id: string }) =>
      pubsub.asyncIterator([POST_UPDATED(id)]),
  },
},
}

const schema = makeExecutableSchema({ typeDefs, resolvers })
const httpServer = createServer()
const wsServer = new WebSocketServer({ server: httpServer, path: '/graphql' })
useServer({ schema, context: async () => ({ prisma, pubsub }) }, wsServer)

httpServer.listen(4000)`,
      language: "typescript",
    },
    {
      title: "Apollo Federation — subgraph de Posts estendendo User",
      description: "Como um subgraph estende um tipo de outro subgraph com @key e __resolveReference. O Apollo Router compõe os schemas e roteia queries automaticamente.",
      code: `// === Subgraph: users-service ===
const userTypeDefs = \`#graphql
type User @key(fields: "id") {
  id: ID!
  name: String!
  email: String!
}
type Query {
  user(id: ID!): User
  me: User
}
\`

const userResolvers = {
Query: {
  user: (_, { id }, { prisma }) => prisma.user.findUnique({ where: { id } }),
  me: (_, __, { user }) => user,
},
User: {
  // Permite ao Router reconstituir um User dado seu id
  __resolveReference: ({ id }, { prisma }) =>
    prisma.user.findUnique({ where: { id } }),
},
}

// === Subgraph: posts-service ===
const postTypeDefs = \`#graphql
type Post @key(fields: "id") {
  id: ID!
  title: String!
  authorId: ID!
  # Estende User adicionando posts — User é dono de id
  author: User!
}
extend type User @key(fields: "id") {
  id: ID! @external
  posts: [Post!]!
}
type Query { post(id: ID!): Post  posts: [Post!]! }
\`

const postResolvers = {
Query: {
  post: (_, { id }, { prisma }) => prisma.post.findUnique({ where: { id } }),
  posts: (_, __, { prisma }) => prisma.post.findMany(),
},
Post: {
  __resolveReference: ({ id }, { prisma }) =>
    prisma.post.findUnique({ where: { id } }),
  // O Router preenche User com {id} — basta retornar a referência
  author: (post) => ({ __typename: 'User', id: post.authorId }),
},
User: {
  posts: (user, _, { prisma }) =>
    prisma.post.findMany({ where: { authorId: user.id } }),
},
}

// === Apollo Router (config) ===
// rover supergraph compose --config supergraph.yaml > supergraph.graphql
// router --supergraph supergraph.graphql --listen 0.0.0.0:4000`,
      language: "typescript",
    },
    {
      title: "graphql-shield — autorização declarativa por campo",
      description: "Em vez de espalhar if (!user) em todos os resolvers, declare regras de autorização como middleware GraphQL — testável e auditável.",
      code: `import { shield, rule, allow, deny } from 'graphql-shield'
import { applyMiddleware } from 'graphql-middleware'
import { makeExecutableSchema } from '@graphql-tools/schema'

// Regras reutilizáveis — cada uma é uma função que retorna boolean ou Error
const isAuthenticated = rule({ cache: 'contextual' })(
async (_, __, { user }) => user !== null || new Error('Não autenticado')
)

const isAdmin = rule({ cache: 'contextual' })(
async (_, __, { user }) => user?.role === 'ADMIN' || new Error('Sem permissão')
)

const isOwner = rule({ cache: 'strict' })(
async (parent, _, { user }) =>
  parent.authorId === user?.id || new Error('Não é o autor')
)

// Aplicação por tipo/campo — fica óbvio o que cada campo exige
const permissions = shield({
Query: {
  '*': allow,                       // queries públicas por padrão
  me: isAuthenticated,
  adminStats: isAdmin,
},
Mutation: {
  '*': isAuthenticated,             // qualquer mutation exige login
  deleteUser: isAdmin,
  deletePost: isOwner,              // só o autor pode deletar
},
}, {
fallbackError: 'Sem permissão',
allowExternalErrors: true,
})

const schema = applyMiddleware(
makeExecutableSchema({ typeDefs, resolvers }),
permissions,
)

// Resolvers ficam limpos — sem if (!user) em cada um
const resolvers = {
Mutation: {
  deletePost: async (_, { id }, { prisma }) =>
    prisma.post.delete({ where: { id } }),  // shield já validou
},
}`,
      language: "typescript",
    },
  ],
  exercises: [
    {
      level: 'iniciante',
      title: "Schema-first GraphQL com Apollo Server — User e Post",
      description: "Construa uma API GraphQL básica com Apollo Server 4. Defina o schema SDL com tipos User e Post, suas relações (User tem posts: [Post!]!, Post tem author: User!) e queries (user(id), users, post(id), posts). Use dados em memória (arrays). Implemente resolvers para todos os campos. Teste no Apollo Sandbox enviando queries que aninhem user → posts → author.",
      concepts: ["schema SDL", "resolvers", "Apollo Server", "tipos relacionados", "queries aninhadas"],
      hint: "Para os campos Post.author e User.posts, defina resolvers explícitos: User.posts = parent => posts.filter(p => p.authorId === parent.id). Não use mock de banco — array em memória basta para entender o fluxo.",
      relatedKeypoints: [1, 2],
    },
    {
      level: 'intermediario',
      title: "Eliminar N+1 com DataLoader — antes e depois",
      description: "Comece com a API do exercício anterior usando Prisma (ou um SQLite simples). Implemente o resolver Post.author de forma ingênua (db.user.findUnique para cada post) e logue todas as queries. Envie a query { posts { title author { name } } } com 50 posts e conte: deve gerar 51 queries. Agora implemente DataLoader: crie createLoaders(prisma) chamado na função de context, refatore o resolver Post.author para usar loaders.users.load(post.authorId). Confirme que agora são apenas 2 queries no log. Demonstre por escrito a regra crítica da batchFn: ela DEVE retornar resultados na mesma ordem dos IDs.",
      concepts: ["N+1 problem", "DataLoader", "batchFn", "context por request", "Prisma"],
      hint: "Para logar queries no Prisma: const prisma = new PrismaClient({ log: ['query'] }). Na batchFn use Map: const byId = new Map(rows.map(r => [r.id, r])); return ids.map(id => byId.get(id) ?? null). Nunca crie o DataLoader fora da função de context — instância nova por request é regra de ouro.",
      relatedKeypoints: [3, 12],
    },
    {
      level: 'intermediario',
      title: "Subscriptions com graphql-ws — chat em tempo real",
      description: "Implemente uma subscription messageAdded(roomId: ID!): Message! que entrega mensagens em tempo real para clientes conectados em uma sala específica. Use graphql-ws como transporte WebSocket (não use as subscriptions deprecated do Apollo Server). Mutation sendMessage(roomId, text) deve persistir em memória e publicar no canal correto. Teste com dois clientes (duas abas) — mensagens enviadas em uma aparecem instantaneamente na outra.",
      concepts: ["subscriptions", "WebSocket", "graphql-ws", "PubSub", "filtragem por argumento"],
      hint: "Use PubSub in-memory para começar (graphql-subscriptions). O canal de cada sala deve ser nomeado: \`MESSAGE_ADDED:\${roomId}\`. No subscribe da subscription: pubsub.asyncIterator([\`MESSAGE_ADDED:\${args.roomId}\`]). Migre para Redis PubSub quando precisar de múltiplas instâncias.",
      relatedKeypoints: [4],
    },
    {
      level: 'senior',
      title: "API GraphQL pronta para produção — segurança completa",
      description: "Construa uma API GraphQL pronta para produção com TODAS as proteções: (1) introspection desabilitada em produção; (2) depth limit de 7 níveis; (3) complexity limit com graphql-validation-complexity ou graphql-cost-analysis; (4) persisted queries com lista de hashes pré-aprovados em produção; (5) rate limiting por IP e por usuário autenticado; (6) error masking — erros internos não vazam stack traces; (7) graphql-shield para autorização declarativa; (8) timeout por request; (9) métricas Prometheus para taxa de erro e latência. Documente cada proteção, por que existe e como testar que está funcionando.",
      concepts: ["security hardening", "depth limit", "complexity limit", "persisted queries", "rate limiting", "error masking", "graphql-shield", "observabilidade"],
      hint: "Para testar depth limit: envie uma query aninhada de 8 níveis e confirme que recebe erro antes de qualquer resolver rodar. Para complexity: defina custos customizados com @cost directive ou estimateComplexity. Para persisted queries em produção: use trusted documents (allowUnpersistedOperation: false). Métricas: instrumente via plugin do Apollo Server (requestDidStart hook).",
      relatedKeypoints: [5, 10],
    },
    {
      level: 'senior',
      title: "Migração REST → GraphQL Federation — 3 microserviços",
      description: "Você tem 3 APIs REST: users-service, posts-service, comments-service. Migre para Apollo Federation: cada serviço se torna um subgraph com seu schema GraphQL próprio. User é definido em users-service e estendido em posts-service (campo posts) e em comments-service (campo comments). Configure o Apollo Router para compor os 3 subgraphs. Demonstre uma query única no Router que aninha user → posts → comments — ela deve internamente chamar os 3 subgraphs corretamente. Documente os tradeoffs: latência de rede entre subgraphs vs simplicidade de schema único.",
      concepts: ["Apollo Federation", "subgraph", "@key", "__resolveReference", "Apollo Router", "schema composition"],
      hint: "Use rover supergraph compose para gerar o supergraph.graphql a partir dos 3 subgraph schemas. Para entender o roteamento: o Router faz query plan — descomprime mostrando quais campos de quais subgraphs serão chamados em cada etapa. Cada subgraph deve implementar __resolveReference para os tipos que estende.",
      relatedKeypoints: [9],
    },
  ],
  videos: [
    { title: "GraphQL Explained in 100 Seconds", channel: "Fireship", url: "https://www.youtube.com/watch?v=eIQh02xuVw4", topic: "visão geral", note: "2 minutos para o modelo mental antes de aprofundar." },
    { title: "GraphQL + DataLoader Tutorial", channel: "Academind", url: "https://www.youtube.com/results?search_query=graphql+dataloader+n+1+academind", topic: "DataLoader / N+1", note: "Explicação visual do problema e solução com DataLoader." },
    { title: "Apollo Server 4 — Full Setup", channel: "The Net Ninja", url: "https://www.youtube.com/results?search_query=apollo+server+4+full+course+net+ninja", topic: "Apollo Server", note: "Setup completo: schema, resolvers, context, autenticação." },
    { title: "GraphQL Federation Explained", channel: "Apollo GraphQL", url: "https://www.youtube.com/results?search_query=apollo+federation+explained", topic: "Federation", note: "Como múltiplos subgraphs compõem um schema unificado via Apollo Router." },
    { title: "GraphQL Security — How to Protect Your API", channel: "The Guild", url: "https://www.youtube.com/results?search_query=graphql+security+depth+limit+complexity", topic: "Segurança", note: "Depth limit, complexity, persisted queries — checklist de produção." },
    { title: "Schema-first vs Code-first GraphQL", channel: "Ben Awad", url: "https://www.youtube.com/results?search_query=graphql+schema+first+vs+code+first+ben+awad", topic: "Arquitetura", note: "Comparativo prático com TypeGraphQL e Pothos." },
  ],
  resources: [
    { title: "graphql.org — Learn", url: "https://graphql.org/learn/", kind: "docs" },
    { title: "DataLoader (GitHub)", url: "https://github.com/graphql/dataloader", kind: "docs" },
    { title: "The Guild — GraphQL Tools", url: "https://the-guild.dev/graphql/tools", kind: "docs" },
    { title: "Apollo Server v4 Docs", url: "https://www.apollographql.com/docs/apollo-server/", kind: "docs" },
    { title: "How to GraphQL — Tutorial completo", url: "https://www.howtographql.com/", kind: "curso" },
    { title: "Apollo Federation Docs", url: "https://www.apollographql.com/docs/federation/", kind: "docs" },
    { title: "graphql-ws — WebSocket transport", url: "https://github.com/enisdenjo/graphql-ws", kind: "docs" },
    { title: "graphql-shield — autorização declarativa", url: "https://the-guild.dev/graphql/shield", kind: "docs" },
    { title: "Pothos — code-first schema builder", url: "https://pothos-graphql.dev/", kind: "docs" },
    { title: "Production Ready GraphQL — Marc-André Giroux", url: "https://book.productionreadygraphql.com/", kind: "livro" },
    { title: "Persisted Queries — Apollo guide", url: "https://www.apollographql.com/docs/apollo-server/performance/apq/", kind: "artigo" },
    { title: "graphql-depth-limit", url: "https://github.com/graphile/depth-limit", kind: "docs" },
  ],
  mindmap: {
    title: "GraphQL — mapa de conceitos",
    html: `<style>
.gqlm-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.gqlm-center{background:rgba(225,0,152,.15);border:2px solid #E10098;border-radius:12px;padding:12px 20px;display:inline-block;font-size:13px;color:#E10098;font-weight:700;text-align:center;white-space:nowrap}
.gqlm-branch{background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:8px 12px;font-size:10px;color:#94a3b8;cursor:default;transition:border-color .2s}
.gqlm-branch:hover{border-color:rgba(225,0,152,.5);color:#e2e8f0}
.gqlm-leaf{font-size:9px;color:#475569;padding:2px 0;line-height:1.4}
</style>
<div class="gqlm-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 18px;font-weight:600">GraphQL — mapa mental</p>
<div style="display:grid;grid-template-columns:1fr auto 1fr;gap:12px;align-items:center">
  <div style="display:flex;flex-direction:column;gap:8px">
    <div class="gqlm-branch">
      <div style="font-weight:700;margin-bottom:4px;color:#E10098">Schema</div>
      <div class="gqlm-leaf">SDL: type, input, enum, scalar, directive</div>
      <div class="gqlm-leaf">Query | Mutation | Subscription</div>
      <div class="gqlm-leaf">Schema-first vs Code-first (TypeGraphQL, Pothos)</div>
    </div>
    <div class="gqlm-branch">
      <div style="font-weight:700;margin-bottom:4px;color:#E10098">Resolvers</div>
      <div class="gqlm-leaf">(parent, args, context, info)</div>
      <div class="gqlm-leaf">Resolver chain — pai alimenta filho</div>
      <div class="gqlm-leaf">Default resolver: parent[fieldName]</div>
    </div>
    <div class="gqlm-branch">
      <div style="font-weight:700;margin-bottom:4px;color:#E10098">N+1 / DataLoader</div>
      <div class="gqlm-leaf">Batching por tick do event loop</div>
      <div class="gqlm-leaf">Cache por request (nunca global)</div>
      <div class="gqlm-leaf">batchFn: IDs → mesma ordem de resultados</div>
    </div>
  </div>
  <div style="display:flex;flex-direction:column;align-items:center;gap:4px">
    <div class="gqlm-center">GraphQL</div>
    <div style="font-size:9px;color:#475569;text-align:center;margin-top:4px">Cliente declara o que precisa<br>Servidor resolve via resolvers</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:8px">
    <div class="gqlm-branch">
      <div style="font-weight:700;margin-bottom:4px;color:#E10098">Segurança</div>
      <div class="gqlm-leaf">Depth limit (máx 7 níveis)</div>
      <div class="gqlm-leaf">Complexity limit (custo por campo)</div>
      <div class="gqlm-leaf">Persisted queries + introspection off em prod</div>
    </div>
    <div class="gqlm-branch">
      <div style="font-weight:700;margin-bottom:4px;color:#E10098">Subscriptions</div>
      <div class="gqlm-leaf">WebSocket via graphql-ws</div>
      <div class="gqlm-leaf">PubSub: in-memory (dev) | Redis (prod)</div>
      <div class="gqlm-leaf">Filter por argumento (roomId, userId)</div>
    </div>
    <div class="gqlm-branch">
      <div style="font-weight:700;margin-bottom:4px;color:#E10098">Federation</div>
      <div class="gqlm-leaf">Subgraphs com @key + __resolveReference</div>
      <div class="gqlm-leaf">Apollo Router compõe schemas</div>
      <div class="gqlm-leaf">Schema stitching (alternativa mais simples)</div>
    </div>
  </div>
</div>
<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:14px;padding-top:12px;border-top:1px solid #1e293b">
  <div style="background:#1e293b;border-radius:6px;padding:8px 10px;font-size:9px;color:#475569">
    <div style="color:#E10098;font-weight:700;margin-bottom:3px">REST vs GraphQL</div>
    REST: over-fetch, under-fetch, N endpoints<br>
    GraphQL: 1 endpoint, cliente controla shape<br>
    Usar REST quando: simple CRUD, cache HTTP, third-party
  </div>
  <div style="background:#1e293b;border-radius:6px;padding:8px 10px;font-size:9px;color:#475569">
    <div style="color:#E10098;font-weight:700;margin-bottom:3px">Caching</div>
    HTTP cache não funciona em POST<br>
    Apollo Client: normalized cache por __typename+id<br>
    CDN: persisted queries (GET) ou APQ
  </div>
  <div style="background:#1e293b;border-radius:6px;padding:8px 10px;font-size:9px;color:#475569">
    <div style="color:#E10098;font-weight:700;margin-bottom:3px">Erros</div>
    Status 200 mesmo com erro parcial<br>
    { data: {...}, errors: [...] } — partial success<br>
    Nunca expor stack trace — use extensions.code
  </div>
</div>
</div>`,
  },
}

export default graphql
