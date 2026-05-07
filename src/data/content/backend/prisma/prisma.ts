import type { SkillContent } from '@/types'

const prisma: SkillContent = {
  tagline: "ORM Next-gen TypeScript: schema declarativo, Prisma Client tipado gerado, migrations declarativas.",
  why: "Prisma virou o ORM padrão para novos projetos Node/TypeScript em 2023-2025. Type-safety end-to-end (autocomplete dos campos, tipos de retorno corretos sem any) e migrations declarativas confiáveis são os diferenciais. Saber quando NÃO usar Prisma (edge runtime sem Accelerate, queries muito complexas, performance crítica em batch) e quando trocar por Drizzle ou TypeORM diferencia sênior de pleno em entrevistas técnicas. Em vagas remote internacionais, conhecer Prisma Accelerate (connection pooling) e Pulse (CDC em tempo real) é diferencial.",
  prerequisite: "TypeScript intermediário (generics, utility types — Prisma usa muito), SQL básico (SELECT, JOIN, WHERE, índices, transações), conceitos de banco relacional (chaves primárias, foreign keys, normalização). Node.js + ESM/CommonJS para configurar o projeto. Sem TypeScript você perde 80% do valor do Prisma — o cliente JavaScript funciona mas não tem autocomplete dos campos.",
  summary: "Prisma é composto de três peças: (1) <strong>Prisma Schema</strong> (schema.prisma) — fonte única de verdade do modelo de dados, declarado em uma DSL própria; (2) <strong>Prisma Client</strong> — biblioteca TypeScript gerada a partir do schema, com autocomplete e type inference total; (3) <strong>Prisma Migrate</strong> — gerador de migrations SQL a partir do diff entre schema atual e estado do banco. O fluxo é: você edita schema.prisma → roda prisma migrate dev → Prisma calcula o diff e gera SQL idempotente em prisma/migrations/ → aplica no banco e regenera o Client. Em produção, prisma migrate deploy aplica migrations já versionadas sem gerar novas. O Prisma Client expõe uma API fluent type-safe: findMany, findUnique, create, update, upsert, delete, com where, select, include, orderBy, take, skip — todos tipados dinamicamente. Suporta PostgreSQL, MySQL, SQLite, SQL Server, MongoDB e CockroachDB. Tradeoffs: queries muito complexas (CTE, window functions, agregações pesadas) caem em $queryRaw; em edge runtime exige Accelerate; performance em batch insert pode ficar atrás de Drizzle/SQL bruto.",
  howToStudy: "<strong>30 minutos antes de entrevista?</strong> Foque no diagrama do pipeline (schema → generate → migrate → client) e nas Q&As de nível pleno. Memorize a diferença entre <code>migrate dev</code> e <code>migrate deploy</code> e a regra: nunca <code>db push</code> em produção.<br><br><strong>Fim de semana?</strong> Crie um projeto novo, modele uma entidade com 3 relações (1-1, 1-N, N-N), gere o client e brinque com select/include aninhado no Prisma Studio. Faça os exercícios em ordem.<br><br><strong>Uma semana?</strong> Implemente soft delete com Prisma Extensions, transações interativas com $transaction, paginação por cursor, e configure Accelerate em um deploy real (Vercel + Neon). As Q&As de nível sênior devem ser respondidas sem consultar.",
  diagrams: [
    {
      title: "Pipeline Prisma — schema.prisma → generate → migrate → client tipado",
      html: `<style>
.prsm-pipe-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.prsm-pipe-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(100,116,139,.5);display:inline}
.prsm-pipe-tip:hover .prsm-pipe-tb{display:block}
.prsm-pipe-tb{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:230px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.prsm-pipe-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
@keyframes prsm-pipe-flow{0%{opacity:.2;transform:translateX(-8px)}50%{opacity:1;transform:translateX(0)}100%{opacity:.2;transform:translateX(8px)}}
.prsm-pipe-arr{font-size:18px;align-self:center;flex-shrink:0;animation:prsm-pipe-flow 2.4s ease-in-out infinite;color:#5A67D8}
.prsm-pipe-step{background:#1e293b;border:1.5px solid #334155;border-radius:10px;padding:12px 14px;flex:1;min-width:0}
.prsm-kw{color:#5A67D8}
.prsm-type{color:#61DAFB}
.prsm-attr{color:#a78bfa}
.prsm-cm{color:#475569}
</style>
<div class="prsm-pipe-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Pipeline Prisma — da DSL ao Client tipado</p>
<p style="color:#475569;font-size:10px;margin:0 0 18px">Passe o mouse nos termos <span style="border-bottom:1px dashed rgba(100,116,139,.5)">sublinhados</span></p>
<div style="display:flex;gap:6px;align-items:stretch;margin-bottom:14px">
  <div class="prsm-pipe-step" style="border-color:rgba(90,103,216,.35)">
    <div style="font-size:9px;color:#5A67D8;letter-spacing:.1em;margin-bottom:8px;font-weight:700">① SCHEMA.PRISMA</div>
    <div style="font-size:10px;color:#94a3b8;line-height:1.85">
      <span class="prsm-kw">model</span> <span class="prsm-type">User</span> {<br>
      &nbsp;<span class="prsm-pipe-tip">id<span class="prsm-pipe-tb">@id marca chave primária. @default(cuid()) gera ID único de 24 chars no insert se não passado.</span></span> <span style="color:#4ade80">String</span> <span class="prsm-attr">@id</span> <span class="prsm-attr">@default(cuid())</span><br>
      &nbsp;email <span style="color:#4ade80">String</span> <span class="prsm-attr">@unique</span><br>
      &nbsp;<span class="prsm-pipe-tip">posts<span class="prsm-pipe-tb">Relação 1:N inferida — Post deve ter authorId apontando aqui. Não vira coluna no banco; só metadado para o Client.</span></span> <span class="prsm-type">Post[]</span><br>
      }
    </div>
  </div>
  <div class="prsm-pipe-arr">→</div>
  <div class="prsm-pipe-step">
    <div style="font-size:9px;color:#fbbf24;letter-spacing:.1em;margin-bottom:8px;font-weight:700">② PRISMA GENERATE</div>
    <div style="font-size:10px;color:#64748b;line-height:1.7">
      Lê schema → gera <span class="prsm-pipe-tip">node_modules/<wbr>@prisma/client<span class="prsm-pipe-tb">Client gerado em pasta dentro de node_modules — não é uma lib npm comum, ela existe localmente após generate.</span></span> com tipos TypeScript completos.
    </div>
  </div>
  <div class="prsm-pipe-arr">→</div>
  <div class="prsm-pipe-step">
    <div style="font-size:9px;color:#a78bfa;letter-spacing:.1em;margin-bottom:8px;font-weight:700">③ PRISMA MIGRATE</div>
    <div style="font-size:10px;color:#64748b;line-height:1.7">
      Calcula <span class="prsm-pipe-tip">diff<span class="prsm-pipe-tb">Compara schema atual com migrations já aplicadas (não com banco direto) — gera SQL incremental em prisma/migrations/&lt;timestamp&gt;_name/migration.sql.</span></span> entre schema e banco → gera SQL versionado.
    </div>
  </div>
  <div class="prsm-pipe-arr">→</div>
  <div class="prsm-pipe-step" style="border-color:rgba(74,222,128,.35)">
    <div style="font-size:9px;color:#4ade80;letter-spacing:.1em;margin-bottom:8px;font-weight:700">④ APP USA O CLIENT</div>
    <div style="font-size:10px;color:#94a3b8;line-height:1.85">
      prisma.<span class="prsm-type">user</span>.findMany({<br>
      &nbsp;where: { email: <span class="prsm-cm">/* tipado! */</span> }<br>
      })
    </div>
  </div>
</div>
<div style="background:#1e293b;border-radius:8px;padding:14px 16px;border:1px solid #1e3a5f">
  <div style="font-size:9px;color:#5A67D8;letter-spacing:.1em;font-weight:600;margin-bottom:10px;text-transform:uppercase">Comandos por ambiente</div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
    <div style="background:#0f172a;border:1px solid rgba(90,103,216,.3);border-radius:6px;padding:8px 12px;font-size:10px">
      <div style="color:#5A67D8;font-weight:700;margin-bottom:4px">DEV</div>
      <div style="color:#94a3b8;line-height:1.7">prisma migrate dev<br><span style="color:#475569">// gera + aplica + regenera client</span></div>
    </div>
    <div style="background:#0f172a;border:1px solid rgba(74,222,128,.3);border-radius:6px;padding:8px 12px;font-size:10px">
      <div style="color:#4ade80;font-weight:700;margin-bottom:4px">PROD / CI</div>
      <div style="color:#94a3b8;line-height:1.7">prisma migrate deploy<br><span style="color:#475569">// só aplica versionadas</span></div>
    </div>
    <div style="background:#0f172a;border:1px solid rgba(239,68,68,.3);border-radius:6px;padding:8px 12px;font-size:10px">
      <div style="color:#ef4444;font-weight:700;margin-bottom:4px">PROTOTYPE</div>
      <div style="color:#94a3b8;line-height:1.7">prisma db push<br><span style="color:#475569">// sync sem migration — NUNCA prod</span></div>
    </div>
  </div>
  <p style="font-size:11px;color:#475569;margin:10px 0 0;line-height:1.6"><strong style="color:#94a3b8">Regra de ouro:</strong> <code style="color:#ef4444">db push</code> nunca em produção — pula histórico de migrations. Em CI/CD use sempre <code style="color:#4ade80">migrate deploy</code>.</p>
</div>
</div>`,
      caption: "Schema é fonte da verdade. generate produz o Client tipado. migrate gera SQL versionado em prisma/migrations/. Em dev: migrate dev faz tudo. Em produção: apenas migrate deploy aplica migrations já revisadas.",
    },
    {
      title: "Prisma Client API — fluent chain com TypeScript inference end-to-end",
      html: `<style>
.prsm-cli-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.prsm-cli-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(100,116,139,.5);display:inline}
.prsm-cli-tip:hover .prsm-cli-tb{display:block}
.prsm-cli-tb{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:240px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.prsm-cli-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
@keyframes prsm-cli-typed{0%,100%{background:rgba(90,103,216,.07);border-color:rgba(90,103,216,.25)}50%{background:rgba(90,103,216,.18);border-color:rgba(90,103,216,.55)}}
.prsm-cli-typed{animation:prsm-cli-typed 2.5s ease-in-out infinite;border:1px solid;border-radius:6px;padding:8px 11px}
.prsm-cli-step{background:#1e293b;border:1px solid #334155;border-radius:6px;padding:7px 11px;font-size:10px;color:#94a3b8;display:flex;align-items:center;gap:8px}
</style>
<div class="prsm-cli-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Prisma Client — fluent API com inferência TypeScript</p>
<p style="color:#475569;font-size:10px;margin:0 0 16px">Cada operador estreita o tipo do retorno automaticamente</p>
<div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:14px;margin-bottom:14px">
  <div style="font-size:9px;color:#5A67D8;letter-spacing:.1em;font-weight:700;margin-bottom:10px;text-transform:uppercase">Encadeamento típico — leitura granular</div>
  <div style="display:flex;flex-direction:column;gap:6px">
    <div class="prsm-cli-step">
      <span style="color:#5A67D8;font-weight:700;flex-shrink:0;width:80px">findMany</span>
      <span style="color:#475569;font-size:9px">→</span>
      <span><span class="prsm-cli-tip">Operação raiz<span class="prsm-cli-tb">findMany retorna array. findUnique retorna T|null. findFirst aceita where mais flexível mas retorna T|null.</span></span> — entry point por modelo. Sem args, retorna tudo.</span>
    </div>
    <div class="prsm-cli-step">
      <span style="color:#fbbf24;font-weight:700;flex-shrink:0;width:80px">where</span>
      <span style="color:#475569;font-size:9px">→</span>
      <span>Filtros tipados — <span class="prsm-cli-tip">{ status: 'PUBLISHED', authorId: 'x', AND, OR, NOT }<span class="prsm-cli-tb">where aceita operadores: equals, not, in, notIn, lt, lte, gt, gte, contains, startsWith, endsWith, AND/OR/NOT compostos.</span></span></span>
    </div>
    <div class="prsm-cli-step">
      <span style="color:#a78bfa;font-weight:700;flex-shrink:0;width:80px">select</span>
      <span style="color:#475569;font-size:9px">→</span>
      <span><span class="prsm-cli-tip">Escolhe campos — TYPE NARROWS<span class="prsm-cli-tb">Com select, o tipo de retorno deixa de ser User e vira { id: string; name: string } — só os campos pedidos. Inferência automática.</span></span> { id: true, name: true }</span>
    </div>
    <div class="prsm-cli-step">
      <span style="color:#a78bfa;font-weight:700;flex-shrink:0;width:80px">include</span>
      <span style="color:#475569;font-size:9px">→</span>
      <span>Carrega relações — { posts: true } ou aninhado { posts: { include: { comments: true } } }</span>
    </div>
    <div class="prsm-cli-step">
      <span style="color:#4ade80;font-weight:700;flex-shrink:0;width:80px">orderBy</span>
      <span style="color:#475569;font-size:9px">→</span>
      <span>{ createdAt: 'desc' } — array para múltiplas chaves: [{ status }, { createdAt }]</span>
    </div>
    <div class="prsm-cli-step">
      <span style="color:#ef4444;font-weight:700;flex-shrink:0;width:80px">take / skip</span>
      <span style="color:#475569;font-size:9px">→</span>
      <span><span class="prsm-cli-tip">Paginação<span class="prsm-cli-tb">take=limit, skip=offset. Para listas grandes prefira cursor-based: cursor: { id: lastId }, take: 20, skip: 1.</span></span> — take: 20, skip: 0 (offset) ou cursor: { id: lastId }</span>
    </div>
  </div>
</div>
<div class="prsm-cli-typed" style="margin-bottom:14px">
  <div style="font-size:9px;color:#5A67D8;letter-spacing:.1em;font-weight:700;margin-bottom:8px;text-transform:uppercase">Type inference em ação</div>
  <div style="font-size:10.5px;color:#94a3b8;line-height:2">
    <span style="color:#475569">const</span> posts = <span style="color:#5A67D8">await</span> prisma.post.findMany({<br>
    &nbsp;where: { status: <span style="color:#4ade80">'PUBLISHED'</span> },<br>
    &nbsp;<span style="color:#a78bfa">select</span>: { id: <span style="color:#4ade80">true</span>, title: <span style="color:#4ade80">true</span>, author: { select: { name: <span style="color:#4ade80">true</span> } } },<br>
    &nbsp;orderBy: { createdAt: <span style="color:#4ade80">'desc'</span> }, take: <span style="color:#fbbf24">10</span><br>
    })<br>
    <span style="color:#475569">// posts: { id: string; title: string; author: { name: string } }[]</span><br>
    <span style="color:#475569">// ↑ tipo inferido automaticamente — sem any, sem cast</span>
  </div>
</div>
<div style="background:#1e293b;border-radius:8px;padding:12px 14px;border:1px solid #1e3a5f">
  <div style="font-size:9px;color:#5A67D8;letter-spacing:.1em;font-weight:600;margin-bottom:8px;text-transform:uppercase">select vs include — escolha consciente</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
    <div style="font-size:10px;color:#94a3b8;line-height:1.7">
      <strong style="color:#a78bfa">select</strong> = whitelist de campos<br>
      Tipo retornado contém só o que pediu. Reduz payload de rede e memória.
    </div>
    <div style="font-size:10px;color:#94a3b8;line-height:1.7">
      <strong style="color:#a78bfa">include</strong> = todos os campos + relações<br>
      Adiciona relações sem omitir nada. Mais simples, mais pesado.
    </div>
  </div>
  <p style="font-size:10px;color:#475569;margin:8px 0 0;line-height:1.6"><strong style="color:#94a3b8">Não dá para usar os dois na mesma query</strong> — Prisma rejeita. Para combinar, use select aninhado em select.</p>
</div>
</div>`,
      caption: "A API do Prisma Client é fluente e totalmente type-safe. select estreita o tipo retornado, include adiciona relações. orderBy aceita array para ordenação multi-coluna. Para listas grandes, sempre prefira cursor-based pagination sobre offset (take/skip).",
    },
    {
      title: "Prisma vs TypeORM vs Drizzle — tradeoffs visuais",
      html: `<style>
.prsm-cmp-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.prsm-cmp-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(100,116,139,.5);display:inline}
.prsm-cmp-tip:hover .prsm-cmp-tb{display:block}
.prsm-cmp-tb{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:240px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.prsm-cmp-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.prsm-cmp-cell{padding:9px 10px;font-size:10px;border-bottom:1px solid #1e293b;line-height:1.5}
.prsm-cmp-good{color:#4ade80}
.prsm-cmp-mid{color:#fbbf24}
.prsm-cmp-bad{color:#ef4444}
.prsm-cmp-head{background:#1e293b;padding:11px 10px;font-size:10px;font-weight:700;letter-spacing:.06em;text-align:center;border-bottom:1.5px solid #334155}
</style>
<div class="prsm-cmp-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Prisma vs TypeORM vs Drizzle — tradeoffs práticos</p>
<p style="color:#475569;font-size:10px;margin:0 0 16px">3 ORMs maduros do ecossistema TypeScript em 2025</p>
<div style="background:#1e293b;border:1px solid #334155;border-radius:8px;overflow:hidden">
  <div style="display:grid;grid-template-columns:1.1fr 1fr 1fr 1fr">
    <div class="prsm-cmp-head" style="text-align:left;color:#94a3b8">Critério</div>
    <div class="prsm-cmp-head" style="color:#5A67D8">Prisma</div>
    <div class="prsm-cmp-head" style="color:#FE0902">TypeORM</div>
    <div class="prsm-cmp-head" style="color:#C5F74F">Drizzle</div>
    <div class="prsm-cmp-cell" style="color:#94a3b8;font-weight:600"><span class="prsm-cmp-tip">DX / autocomplete<span class="prsm-cmp-tb">Qualidade da experiência de desenvolvedor: autocomplete dos campos, mensagens de erro do compilador, IntelliSense aninhado.</span></span></div>
    <div class="prsm-cmp-cell prsm-cmp-good">Excelente — tipos profundos</div>
    <div class="prsm-cmp-cell prsm-cmp-mid">Bom com decorators</div>
    <div class="prsm-cmp-cell prsm-cmp-good">Excelente — SQL-shaped</div>
    <div class="prsm-cmp-cell" style="color:#94a3b8;font-weight:600">Schema</div>
    <div class="prsm-cmp-cell prsm-cmp-good">DSL própria (.prisma)</div>
    <div class="prsm-cmp-cell prsm-cmp-mid">Decorators TypeScript</div>
    <div class="prsm-cmp-cell prsm-cmp-good">TypeScript puro</div>
    <div class="prsm-cmp-cell" style="color:#94a3b8;font-weight:600">Migrations</div>
    <div class="prsm-cmp-cell prsm-cmp-good">prisma migrate (diff auto)</div>
    <div class="prsm-cmp-cell prsm-cmp-mid">CLI manual + sync (perigoso)</div>
    <div class="prsm-cmp-cell prsm-cmp-mid">drizzle-kit (mais novo)</div>
    <div class="prsm-cmp-cell" style="color:#94a3b8;font-weight:600"><span class="prsm-cmp-tip">Performance<span class="prsm-cmp-tb">Tempo de query end-to-end e memória do client gerado. Drizzle e raw SQL são mais rápidos por terem menos camadas.</span></span></div>
    <div class="prsm-cmp-cell prsm-cmp-mid">Boa, query engine em Rust</div>
    <div class="prsm-cmp-cell prsm-cmp-mid">Boa</div>
    <div class="prsm-cmp-cell prsm-cmp-good">Excelente — quase raw SQL</div>
    <div class="prsm-cmp-cell" style="color:#94a3b8;font-weight:600"><span class="prsm-cmp-tip">Edge runtime<span class="prsm-cmp-tb">Cloudflare Workers, Vercel Edge — runtime sem TCP nativo. Drizzle suporta nativo via HTTP drivers; Prisma exige Accelerate; TypeORM não suporta.</span></span></div>
    <div class="prsm-cmp-cell prsm-cmp-mid">Só com Accelerate</div>
    <div class="prsm-cmp-cell prsm-cmp-bad">Não suporta</div>
    <div class="prsm-cmp-cell prsm-cmp-good">Nativo (HTTP drivers)</div>
    <div class="prsm-cmp-cell" style="color:#94a3b8;font-weight:600">Raw SQL escape hatch</div>
    <div class="prsm-cmp-cell prsm-cmp-mid">$queryRaw / $executeRaw</div>
    <div class="prsm-cmp-cell prsm-cmp-good">QueryBuilder + raw fácil</div>
    <div class="prsm-cmp-cell prsm-cmp-good">SQL é cidadão de 1ª classe</div>
    <div class="prsm-cmp-cell" style="color:#94a3b8;font-weight:600">MongoDB</div>
    <div class="prsm-cmp-cell prsm-cmp-mid">Suporte limitado</div>
    <div class="prsm-cmp-cell prsm-cmp-good">Suporta</div>
    <div class="prsm-cmp-cell prsm-cmp-bad">Apenas SQL</div>
    <div class="prsm-cmp-cell" style="color:#94a3b8;font-weight:600">Maturidade ecossistema</div>
    <div class="prsm-cmp-cell prsm-cmp-good">Padrão de mercado 2024-25</div>
    <div class="prsm-cmp-cell prsm-cmp-good">Maduro mas legado</div>
    <div class="prsm-cmp-cell prsm-cmp-mid">Crescendo rápido</div>
    <div class="prsm-cmp-cell" style="color:#94a3b8;font-weight:600">Tamanho do bundle</div>
    <div class="prsm-cmp-cell prsm-cmp-bad">Pesado (~5MB query engine)</div>
    <div class="prsm-cmp-cell prsm-cmp-mid">Médio</div>
    <div class="prsm-cmp-cell prsm-cmp-good">Leve (sem engine)</div>
  </div>
</div>
<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:14px">
  <div style="background:#1e293b;border-radius:8px;padding:11px 13px;border:1px solid rgba(90,103,216,.3)">
    <div style="font-size:10px;color:#5A67D8;font-weight:700;margin-bottom:5px">Use Prisma se</div>
    <div style="font-size:9.5px;color:#94a3b8;line-height:1.6">Projeto novo, time TS-first, DX é prioridade, migrations declarativas, equipe não quer SQL bruto.</div>
  </div>
  <div style="background:#1e293b;border-radius:8px;padding:11px 13px;border:1px solid rgba(254,9,2,.3)">
    <div style="font-size:10px;color:#FE0902;font-weight:700;margin-bottom:5px">Use TypeORM se</div>
    <div style="font-size:9.5px;color:#94a3b8;line-height:1.6">Projeto NestJS legado, ActiveRecord pattern, MongoDB em mesmo ORM, equipe vinda de Java/Hibernate.</div>
  </div>
  <div style="background:#1e293b;border-radius:8px;padding:11px 13px;border:1px solid rgba(197,247,79,.3)">
    <div style="font-size:10px;color:#C5F74F;font-weight:700;margin-bottom:5px">Use Drizzle se</div>
    <div style="font-size:9.5px;color:#94a3b8;line-height:1.6">Edge runtime (Cloudflare/Vercel), performance crítica, time confortável com SQL, bundle pequeno importa.</div>
  </div>
</div>
</div>`,
      caption: "Prisma é o padrão para novos projetos Node/TS em 2024-2025. Drizzle vem ganhando espaço em edge e em equipes que preferem SQL-first. TypeORM ainda relevante em projetos NestJS antigos. Para edge runtime, Drizzle nativo ou Prisma com Accelerate.",
    },
  ],
  keypoints: [
    {
      title: "Prisma Schema — DSL declarativa, fonte da verdade",
      body: "schema.prisma é o arquivo central. Tem três blocos principais: datasource (conexão ao banco — provider postgresql/mysql/sqlite/mongodb e url do DATABASE_URL), generator (qual cliente gerar — geralmente prisma-client-js), e models (tabelas/coleções). Tipos nativos: String, Int, BigInt, Float, Decimal, Boolean, DateTime, Json, Bytes, e enums. Modificadores de campo: ? para opcional (nullable), [] para array. Atributos com @ (campo) ou @@ (model): @id, @unique, @default, @relation, @@index, @@unique, @@map.",
      code: `// schema.prisma
datasource db {
provider = "postgresql"
url      = env("DATABASE_URL")
}

generator client {
provider = "prisma-client-js"
}

model User {
id        String   @id @default(cuid())
email     String   @unique
name      String?  // opcional (nullable)
role      Role     @default(USER)
posts     Post[]   // 1:N — relação inversa
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
@@index([email])
@@map("users") // mapeia para tabela "users" no SQL
}

model Post {
id       String  @id @default(cuid())
title    String  @db.VarChar(255) // tipo SQL específico
content  String? @db.Text
status   PostStatus @default(DRAFT)
authorId String
author   User    @relation(fields: [authorId], references: [id], onDelete: Cascade)
tags     Tag[]   // N:N — Prisma cria join table implícita
metadata Json?
@@index([authorId, status])
}

model Tag {
id    String @id @default(cuid())
name  String @unique
posts Post[]
}

enum Role { ADMIN  USER  GUEST }
enum PostStatus { DRAFT  PUBLISHED  ARCHIVED }`,
    },
    {
      title: "Prisma Client — type inference end-to-end",
      body: "Após prisma generate, o Client gerado expõe um método para cada model: prisma.user, prisma.post. Cada um tem CRUD: findUnique (por chave única, retorna T|null), findFirst (por filtro flexível, retorna T|null), findMany (array), create, createMany, update, updateMany, upsert, delete, deleteMany, count, aggregate, groupBy. O ponto-chave: o tipo retornado se ajusta dinamicamente baseado em select/include — TypeScript infere automaticamente.",
      code: `import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Tipo inferido: User
const user = await prisma.user.findUnique({ where: { id: 'x' } })
//    ^? User | null

// Tipo inferido: { id: string; email: string }[]
const users = await prisma.user.findMany({
where: { role: 'ADMIN' },
select: { id: true, email: true },
})

// Tipo inferido com relação aninhada
const userWithPosts = await prisma.user.findUnique({
where: { id: 'x' },
include: { posts: { where: { status: 'PUBLISHED' } } },
})
//    ^? (User & { posts: Post[] }) | null

// Type helpers oficiais — extrair tipo de uma query
import { Prisma } from '@prisma/client'
type UserWithPosts = Prisma.UserGetPayload<{
include: { posts: true }
}>`,
    },
    {
      title: "Relations — 1:1, 1:N e N:N",
      body: "Prisma modela 3 tipos de relação. <strong>1:1</strong>: uma User tem um Profile, define-se com @relation e @unique no campo de FK. <strong>1:N</strong>: um User tem muitos Post — apenas o lado 'many' tem authorId; o lado 'one' tem array virtual. <strong>N:N</strong>: implícita (Prisma cria join table automaticamente — sem controle sobre colunas extras) ou explícita (você cria o model PostTag manualmente — necessário se quiser metadados como assignedAt). Sempre defina onDelete (Cascade, SetNull, Restrict, NoAction) para evitar comportamento inesperado.",
      code: `// 1:1 — User tem 1 Profile
model User {
id      String   @id
profile Profile?
}
model Profile {
id     String @id
bio    String
userId String @unique
user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// 1:N — User tem muitos Post
model User {
posts Post[]
}
model Post {
authorId String
author   User @relation(fields: [authorId], references: [id])
}

// N:N implícita — Prisma cria _PostToTag automaticamente
model Post { tags Tag[] }
model Tag  { posts Post[] }

// N:N explícita — quando precisa de campos extras
model PostTag {
postId    String
tagId     String
assignedAt DateTime @default(now())
assignedBy String
post      Post @relation(fields: [postId], references: [id])
tag       Tag  @relation(fields: [tagId], references: [id])
@@id([postId, tagId])
}`,
    },
    {
      title: "Migrations — diff declarativo e versionado",
      body: "Prisma Migrate gera SQL automaticamente comparando o schema atual com a última migration aplicada. <code>prisma migrate dev --name add_user_email</code> em desenvolvimento: gera <code>prisma/migrations/&lt;timestamp&gt;_add_user_email/migration.sql</code>, aplica no banco e regenera o Client. <code>prisma migrate deploy</code> em CI/CD: aplica migrations já versionadas em ordem, sem gerar novas — idempotente, seguro de rodar várias vezes. <code>prisma db push</code> sincroniza schema → banco SEM gerar migration (só para protótipos, NUNCA produção). Migrations já aplicadas são imutáveis — para alterar, crie uma nova migration que ajuste.",
      code: `# Workflow de desenvolvimento
$ npx prisma migrate dev --name add_post_status
# 1. Gera prisma/migrations/20250430123000_add_post_status/migration.sql
# 2. Aplica no banco de dev
# 3. Regenera @prisma/client com novos tipos

# Workflow de produção (CI/CD)
$ npx prisma migrate deploy
# Aplica todas as migrations pendentes em ordem
# NÃO gera novas — só aplica as versionadas

# Reset (apaga dados — só dev)
$ npx prisma migrate reset

# Status
$ npx prisma migrate status
# Mostra quais migrations estão aplicadas e quais pendentes

# Para refletir banco existente em schema (greenfield em DB legado)
$ npx prisma db pull   # introspect → atualiza schema.prisma`,
    },
    {
      title: "Transactions — sequencial, batch e interactive",
      body: "Prisma oferece 3 modos. <strong>Sequential ($transaction([])):</strong> array de operações executado atomicamente em ordem — todas commitam juntas ou todas revertem. Bom para múltiplos creates/updates independentes. <strong>Interactive ($transaction(async tx => {})):</strong> recebe callback com client transacional — você pode ler, decidir e escrever com lógica entre as operações. Use isolationLevel para Serializable/RepeatableRead. <strong>Atenção</strong>: timeout default é 5s (maxWait) + 5s (timeout); para transações longas configure <code>{ timeout: 30000 }</code>. Long-running transactions seguram conexão do pool — limite quando possível.",
      code: `// 1. Sequential — array atômico
const [user, post] = await prisma.$transaction([
prisma.user.create({ data: { email: 'a@b.com' } }),
prisma.post.create({ data: { title: 'Hello', authorId: 'x' } }),
])

// 2. Interactive — lógica entre operações
const result = await prisma.$transaction(async (tx) => {
const sender = await tx.account.findUniqueOrThrow({ where: { id: senderId } })
if (sender.balance < amount) throw new Error('Saldo insuficiente')

await tx.account.update({
  where: { id: senderId },
  data: { balance: { decrement: amount } },
})
await tx.account.update({
  where: { id: receiverId },
  data: { balance: { increment: amount } },
})
return tx.transfer.create({
  data: { senderId, receiverId, amount },
})
}, {
isolationLevel: 'Serializable',
timeout: 10000,  // 10s
})

// 3. Cuidado: NUNCA chame prisma (não tx) dentro do callback
//    Use sempre o "tx" recebido — caso contrário a operação roda fora da transação`,
    },
    {
      title: "Raw queries — $queryRaw e $executeRaw com Prisma.sql",
      body: "Para queries complexas (CTE, window functions, full-text search avançado, agregações específicas do banco) use raw queries. <code>$queryRaw</code> retorna linhas, <code>$executeRaw</code> retorna count de linhas afetadas. <strong>Sempre</strong> use template literals com <code>Prisma.sql</code> — interpolação direta com <code>$\\{var\\}</code> em string permite SQL injection. As variantes Unsafe (<code>$queryRawUnsafe</code>) só para casos onde o SQL é construído programaticamente — e mesmo assim valide tudo.",
      code: `import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ✓ SEGURO — Prisma.sql faz parametrização automática
const search = "robert'); DROP TABLE--"  // tentativa de injection
const users = await prisma.$queryRaw<User[]>\`
SELECT * FROM "User" WHERE name ILIKE \${\`%\${search}%\`}
\`
// Vira: SELECT * FROM "User" WHERE name ILIKE $1, com $1 = '%...%'

// ✓ Tipagem via generic — você declara o shape esperado
type Stats = { day: Date; count: bigint }
const stats = await prisma.$queryRaw<Stats[]>\`
SELECT DATE_TRUNC('day', "createdAt") AS day, COUNT(*) AS count
FROM "Post"
WHERE "createdAt" > NOW() - INTERVAL '30 days'
GROUP BY day
ORDER BY day DESC
\`

// ✓ Composição com Prisma.sql
const where = filterByStatus
? Prisma.sql\`WHERE status = \${'PUBLISHED'}\`
: Prisma.empty
const result = await prisma.$queryRaw\`SELECT * FROM "Post" \${where}\`

// ✗ PERIGOSO — interpolação direta = SQL injection
// const bad = await prisma.$queryRawUnsafe(\`SELECT * FROM User WHERE id = '\${userId}'\`)`,
    },
    {
      title: "Prisma Client Extensions — middleware moderno",
      body: "<code>$use</code> middleware está deprecated. Use <strong>Prisma Client Extensions</strong> ($extends) para soft delete, logging, multi-tenancy, row-level security, métricas. Extensions são compostáveis — você pode encadear várias com $extends. 4 tipos: <strong>model</strong> (adiciona métodos a modelos), <strong>client</strong> (métodos no client raiz), <strong>query</strong> (intercepta queries para modificar args/result), <strong>result</strong> (campos virtuais computados).",
      code: `import { PrismaClient } from '@prisma/client'

const basePrisma = new PrismaClient()

// 1. Soft delete via query extension — filtra deletedAt automaticamente
const prisma = basePrisma.$extends({
query: {
  user: {
    async findMany({ args, query }) {
      args.where = { ...args.where, deletedAt: null }
      return query(args)
    },
    async findUnique({ args, query }) {
      const result = await query(args)
      if (result?.deletedAt) return null
      return result
    },
  },
},
// 2. Método customizado no model
model: {
  user: {
    async softDelete(id: string) {
      return basePrisma.user.update({
        where: { id },
        data: { deletedAt: new Date() },
      })
    },
  },
},
// 3. Campo computado (result extension)
result: {
  user: {
    fullName: {
      needs: { firstName: true, lastName: true },
      compute: (user) => \`\${user.firstName} \${user.lastName}\`,
    },
  },
},
})

// Uso — soft delete e fullName aparecem como nativos
await prisma.user.softDelete('xyz')
const user = await prisma.user.findUnique({ where: { id: 'x' } })
console.log(user?.fullName)  // computado — tipado!`,
    },
    {
      title: "Cursor-based pagination — para listas grandes",
      body: "Offset pagination (skip/take) tem performance ruim em listas grandes — o banco precisa varrer todos os registros até o offset. Cursor-based é O(1): você passa o id do último item visto e pede os próximos N. Ideal para feeds infinitos. Combine cursor com orderBy estável (geralmente createdAt + id) para garantir ordem determinística.",
      code: `// Cursor pagination — performante em listas grandes
async function getPosts(cursor?: string, take = 20) {
return prisma.post.findMany({
  take,
  skip: cursor ? 1 : 0,           // pula o próprio cursor
  cursor: cursor ? { id: cursor } : undefined,
  orderBy: [
    { createdAt: 'desc' },
    { id: 'desc' },                // tiebreaker para ordem determinística
  ],
  where: { status: 'PUBLISHED' },
})
}

// Cliente:
const page1 = await getPosts()
const lastId = page1[page1.length - 1]?.id
const page2 = await getPosts(lastId)

// Offset pagination — só para listas pequenas / admin
async function getPostsByPage(page: number, perPage = 20) {
return prisma.post.findMany({
  skip: (page - 1) * perPage,
  take: perPage,
  orderBy: { createdAt: 'desc' },
})
// CUIDADO: skip: 100000 faz full scan até a posição 100k no banco
}`,
    },
    {
      title: "Upsert atômico — INSERT ou UPDATE em uma operação",
      body: "<code>upsert</code> faz INSERT se não existe, UPDATE se já existe — em uma única query atômica baseada em chave única. Evita race condition de findUnique → if/else → create/update. Os dois blocos (create e update) podem conter dados diferentes — útil em casos como 'criar usuário ou atualizar last login'.",
      code: `// Upsert clássico — chave única determina branch
const user = await prisma.user.upsert({
where: { email: 'ana@example.com' },         // chave de busca
create: {                                      // se não existe
  email: 'ana@example.com',
  name: 'Ana',
  role: 'USER',
},
update: {                                      // se existe
  lastLoginAt: new Date(),
},
})

// createMany com skipDuplicates — bulk upsert simplificado
await prisma.tag.createMany({
data: [
  { name: 'typescript' },
  { name: 'prisma' },
  { name: 'graphql' },
],
skipDuplicates: true, // não falha em conflict de @unique
})

// Bulk upsert real (sem skipDuplicates) — exige loop ou raw
for (const tag of tags) {
await prisma.tag.upsert({
  where: { name: tag.name },
  create: { name: tag.name },
  update: {},  // no-op
})
}`,
    },
    {
      title: "Singleton pattern em Next.js — evitar exhaustion de conexões",
      body: "Em desenvolvimento, hot reload do Next.js cria múltiplas instâncias de PrismaClient — cada uma abre um pool de conexões e em poucos minutos esgota o limite do banco (Postgres tipicamente 100). A solução é o singleton pattern: armazenar a instância em <code>globalThis</code> em dev. Em produção (build), Next.js cria uma única instância naturalmente.",
      code: `// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
log: process.env.NODE_ENV === 'development'
  ? ['query', 'error', 'warn']
  : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
globalForPrisma.prisma = prisma
}

// app/api/users/route.ts — sempre importe o singleton
import { prisma } from '@/lib/prisma'

export async function GET() {
const users = await prisma.user.findMany()
return Response.json(users)
}

// Em scripts CLI (não Next.js) — sempre $disconnect ao final
async function main() {
// ... operações
}
main()
.catch(console.error)
.finally(() => prisma.$disconnect())`,
    },
    {
      title: "Edge runtime — Prisma Accelerate é obrigatório",
      body: "Prisma Client tradicional usa TCP nativo (pg, mysql2) — não roda em edge runtimes (Cloudflare Workers, Vercel Edge). Para edge, use <strong>Prisma Accelerate</strong>: um proxy HTTP gerenciado pela Prisma que aceita queries via HTTP, conecta no banco via TCP, e devolve resultados. Bônus: connection pooling global (resolve cold start) e cache de queries com TTL configurável. Custa por query/cache — para apps high-traffic considerar custos.",
      code: `// schema.prisma — adiciona driverAdapters
generator client {
provider        = "prisma-client-js"
previewFeatures = ["driverAdapters"]
}

// Em edge route handler (Vercel Edge / Cloudflare)
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())

export const runtime = 'edge'

export async function GET() {
// Cache de 60s — distribuído globalmente
const posts = await prisma.post.findMany({
  cacheStrategy: { ttl: 60, swr: 30 },
})
return Response.json(posts)
}

// .env — DATABASE_URL agora aponta para Accelerate
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=..."
DIRECT_URL="postgresql://user:pass@host:5432/db"  // para migrate`,
    },
    {
      title: "Indexes e performance — @@index, @@unique e EXPLAIN",
      body: "Prisma não cria índices automaticamente além de chaves primárias e @unique. Para campos de filtro frequente, declare <code>@@index([field1, field2])</code>. Ordem importa — composto cobre prefixos: índice em [authorId, status] cobre WHERE authorId = X e WHERE authorId = X AND status = Y, mas NÃO WHERE status = Y. Para queries específicas, rode EXPLAIN ANALYZE no Postgres ou EXPLAIN no MySQL para verificar se o índice foi usado.",
      code: `model Post {
id        String     @id @default(cuid())
title     String
authorId  String
status    PostStatus
createdAt DateTime   @default(now())
views     Int        @default(0)

// Índice composto — ordem importa para query patterns
@@index([authorId, status])         // cobre filtro por author + status
@@index([status, createdAt(sort: Desc)]) // listagem por status ordenada
@@index([title])                     // busca por título
}

// Verificar uso do índice no Postgres
const result = await prisma.$queryRaw\`
EXPLAIN ANALYZE
SELECT * FROM "Post" WHERE "authorId" = 'x' AND status = 'PUBLISHED'
\`
// Procure por "Index Scan" — se aparecer "Seq Scan" o índice não foi usado

// Full-text search — Postgres only
model Post {
// ...
@@fulltext([title, content])  // requer previewFeatures = ["fullTextIndex"]
}

await prisma.post.findMany({
where: { title: { search: 'prisma & typescript' } },
})`,
    },
    {
      title: "JSON fields — query e tipagem",
      body: "Campos Json armazenam JSON nativo (Postgres jsonb, MySQL JSON). Prisma oferece operadores específicos para queries no JSON. Tipagem: por padrão Json é unknown — para tipar, use casting com Prisma.JsonObject ou tipos próprios; para safety completa, valide com Zod ou similar antes de usar.",
      code: `model Event {
id       String @id @default(cuid())
type     String
metadata Json   // Postgres jsonb
}

// Insert com tipo
await prisma.event.create({
data: {
  type: 'click',
  metadata: { url: '/home', userId: 'x', source: 'header' },
},
})

// Query operators no JSON (Postgres)
await prisma.event.findMany({
where: {
  metadata: {
    path: ['userId'],
    equals: 'x',
  },
},
})

// path nested
await prisma.event.findMany({
where: {
  metadata: {
    path: ['device', 'os'],
    string_contains: 'iOS',
  },
},
})

// Tipagem segura com Zod
import { z } from 'zod'
const EventMetadata = z.object({
url: z.string(),
userId: z.string(),
source: z.enum(['header', 'footer', 'modal']),
})

const event = await prisma.event.findUniqueOrThrow({ where: { id } })
const metadata = EventMetadata.parse(event.metadata)
//    ^? { url: string; userId: string; source: 'header' | 'footer' | 'modal' }`,
    },
  ],
  cheatsheet: {
    title: "Prisma — Cheat Sheet schema + client + migrations",
    html: `<style>
.prsm-cs-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:20px}
.prsm-cs-card{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px 14px}
.prsm-cs-head{font-size:9px;color:#64748b;letter-spacing:.14em;text-transform:uppercase;margin:14px 0 8px;padding-bottom:5px;border-bottom:1px solid #1e3a5f}
.prsm-cs-kw{color:#5A67D8}
.prsm-cs-attr{color:#a78bfa}
.prsm-cs-type{color:#4ade80}
.prsm-cs-cm{color:#475569}
.prsm-cs-label{font-size:10px;font-weight:700;margin-bottom:5px}
.prsm-cs-body{font-size:9.5px;color:#64748b;line-height:1.55}
.prsm-cs-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
</style>
<div class="prsm-cs-wrap">
<p style="color:#e2e8f0;font-size:11px;font-weight:700;margin:0 0 14px;letter-spacing:.06em">PRISMA — CHEAT SHEET</p>
<div class="prsm-cs-head">SCHEMA.PRISMA — DSL</div>
<div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px 14px;font-size:10px;line-height:1.95;color:#94a3b8;margin-bottom:8px">
  <span class="prsm-cs-kw">model</span> User {<br>
  &nbsp;&nbsp;id&nbsp;&nbsp;&nbsp;&nbsp;<span class="prsm-cs-type">String</span>&nbsp;&nbsp;<span class="prsm-cs-attr">@id @default(cuid())</span><br>
  &nbsp;&nbsp;email&nbsp;<span class="prsm-cs-type">String</span>&nbsp;&nbsp;<span class="prsm-cs-attr">@unique</span><br>
  &nbsp;&nbsp;name&nbsp;&nbsp;<span class="prsm-cs-type">String?</span>&nbsp;<span class="prsm-cs-cm">// opcional</span><br>
  &nbsp;&nbsp;posts&nbsp;<span class="prsm-cs-type">Post[]</span>&nbsp;<span class="prsm-cs-cm">// 1:N</span><br>
  &nbsp;&nbsp;createdAt <span class="prsm-cs-type">DateTime</span> <span class="prsm-cs-attr">@default(now())</span><br>
  &nbsp;&nbsp;updatedAt <span class="prsm-cs-type">DateTime</span> <span class="prsm-cs-attr">@updatedAt</span><br>
  &nbsp;&nbsp;<span class="prsm-cs-attr">@@index([email])</span><br>
  }
</div>
<div class="prsm-cs-head">TIPOS DE CAMPO</div>
<div class="prsm-cs-grid" style="margin-bottom:8px">
  <div class="prsm-cs-card">
    <div class="prsm-cs-label" style="color:#4ade80">Escalares</div>
    <div class="prsm-cs-body">String &middot; Int &middot; BigInt &middot; Float &middot; Decimal &middot; Boolean &middot; DateTime &middot; Json &middot; Bytes</div>
  </div>
  <div class="prsm-cs-card">
    <div class="prsm-cs-label" style="color:#a78bfa">Modificadores</div>
    <div class="prsm-cs-body">? = nullable<br>[] = array<br>@db.VarChar(255), @db.Text — tipo SQL</div>
  </div>
  <div class="prsm-cs-card">
    <div class="prsm-cs-label" style="color:#5A67D8">Atributos &#64;</div>
    <div class="prsm-cs-body">@id @unique @default<br>@relation @updatedAt @map</div>
  </div>
  <div class="prsm-cs-card">
    <div class="prsm-cs-label" style="color:#fbbf24">Atributos &#64;&#64;</div>
    <div class="prsm-cs-body">@@id @@unique @@index<br>@@map @@fulltext</div>
  </div>
</div>
<div class="prsm-cs-head">CLIENT — OPERAÇÕES CRUD</div>
<div class="prsm-cs-grid" style="margin-bottom:8px">
  <div class="prsm-cs-card">
    <div class="prsm-cs-label" style="color:#4ade80">Read</div>
    <div style="font-size:9.5px;color:#94a3b8;line-height:1.7">findUnique({ where })<br>findFirst({ where })<br>findMany({ where, select, include, orderBy, take, skip, cursor })</div>
  </div>
  <div class="prsm-cs-card">
    <div class="prsm-cs-label" style="color:#5A67D8">Write</div>
    <div style="font-size:9.5px;color:#94a3b8;line-height:1.7">create({ data })<br>createMany({ data, skipDuplicates })<br>update({ where, data })<br>upsert({ where, create, update })</div>
  </div>
  <div class="prsm-cs-card">
    <div class="prsm-cs-label" style="color:#ef4444">Delete</div>
    <div style="font-size:9.5px;color:#94a3b8;line-height:1.7">delete({ where })<br>deleteMany({ where })</div>
  </div>
  <div class="prsm-cs-card">
    <div class="prsm-cs-label" style="color:#fbbf24">Aggregate</div>
    <div style="font-size:9.5px;color:#94a3b8;line-height:1.7">count({ where })<br>aggregate({ _avg, _sum, _max })<br>groupBy({ by, having })</div>
  </div>
</div>
<div class="prsm-cs-head">CLI — COMANDOS ESSENCIAIS</div>
<div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px 14px;font-size:10px;line-height:1.85;color:#94a3b8;margin-bottom:8px">
  <span class="prsm-cs-cm"># Setup</span><br>
  npx prisma init<br>
  npx prisma generate <span class="prsm-cs-cm">// gera @prisma/client</span><br>
  <span class="prsm-cs-cm"># Migrations</span><br>
  npx prisma migrate dev --name &lt;name&gt; <span class="prsm-cs-cm">// dev: gera + aplica</span><br>
  npx prisma migrate deploy <span class="prsm-cs-cm">// prod/CI</span><br>
  npx prisma migrate reset <span class="prsm-cs-cm">// limpa banco (dev)</span><br>
  <span class="prsm-cs-cm"># Outros</span><br>
  npx prisma studio <span class="prsm-cs-cm">// GUI no browser</span><br>
  npx prisma db pull <span class="prsm-cs-cm">// introspect → schema.prisma</span><br>
  npx prisma db push <span class="prsm-cs-cm">// sync sem migration (NUNCA prod)</span>
</div>
<div class="prsm-cs-head">TRANSACTIONS &amp; RAW</div>
<div class="prsm-cs-grid">
  <div class="prsm-cs-card">
    <div class="prsm-cs-label" style="color:#5A67D8">$transaction</div>
    <div style="font-size:9.5px;color:#94a3b8;line-height:1.65">Sequential: <code>$transaction([op1, op2])</code><br>Interactive: <code>$transaction(async tx =&gt; {})</code><br>Opções: <code>{ isolationLevel, timeout }</code></div>
  </div>
  <div class="prsm-cs-card">
    <div class="prsm-cs-label" style="color:#ef4444">Raw SQL</div>
    <div style="font-size:9.5px;color:#94a3b8;line-height:1.65"><code>$queryRaw\`...\${var}\`</code> — parametrizado<br><code>$executeRaw\`UPDATE...\`</code> — count<br>NUNCA <code>Unsafe</code> com input do user</div>
  </div>
</div>
</div>`,
  },
  gotchas: [
    "<strong>db push em produção</strong> — pula histórico de migrations e impede rollback controlado. Use APENAS em prototipação. Em CI/CD sempre prisma migrate deploy com migrations versionadas.",
    "<strong>SELECT * implícito sem select/include explícito</strong> — findMany sem select carrega TODAS as colunas, incluindo Json e Text grandes. Em listas, especifique apenas os campos necessários para reduzir payload e tempo de query.",
    "<strong>N+1 com include profundamente aninhado</strong> — { posts: { include: { comments: { include: { author: true } } } } } pode gerar JOINs gigantes ou múltiplas queries. Teste com EXPLAIN; quando o include vai ficar repetido em várias queries, considere DataLoader na camada GraphQL.",
    "<strong>$disconnect() faltando em scripts CLI</strong> — sem disconnect, o processo Node não termina (conexões pendentes seguram event loop). Em servidores web (Next.js, Express) NÃO chame disconnect a cada request — só em scripts one-shot.",
    "<strong>Migrations editadas após aplicadas</strong> — Prisma marca migrations já aplicadas no banco (<code>_prisma_migrations</code>). Editar uma já aplicada quebra a integridade. Para corrigir: crie uma NOVA migration que ajuste; só faça <code>migrate resolve</code> em casos extremos.",
    "<strong>$queryRawUnsafe com input do usuário</strong> — interpolação de string permite SQL injection. Sempre use $queryRaw com template literal e <code>Prisma.sql</code> para composição condicional. Unsafe só para SQL gerado programaticamente sem input externo.",
    "<strong>Hot reload em Next.js sem singleton</strong> — cada hot reload cria nova PrismaClient → pool de conexões esgota em minutos. Use o pattern <code>globalThis.prisma ??= new PrismaClient()</code> em dev.",
    "<strong>Edge runtime sem Accelerate</strong> — Prisma Client padrão usa TCP nativo, não suportado em Cloudflare Workers / Vercel Edge. Importe de @prisma/client/edge + Accelerate, ou use Drizzle nativamente em edge.",
    "<strong>$transaction interativa com prisma global</strong> — chamar <code>prisma.user.update</code> (não <code>tx.user.update</code>) dentro do callback executa fora da transação. Sempre use o tx recebido.",
    "<strong>BigInt em JSON.stringify</strong> — Prisma retorna BigInt nativo, JSON.stringify lança erro. Em API responses, converta para string ou number antes de serializar.",
    "<strong>JSON typing como unknown</strong> — campos Json têm tipo Prisma.JsonValue (unknown-ish) — sem validação ao ler. Use Zod para validar ao consumir, ou cast tipado com cuidado.",
    "<strong>orderBy sem tiebreaker estável</strong> — orderBy: { createdAt: 'desc' } sem incluir id como segundo critério causa ordem indefinida quando dois registros têm o mesmo createdAt — quebra cursor pagination.",
  ],
  interview: [
    {
      q: "Quando você escolheria Prisma vs TypeORM vs Drizzle? Quais os tradeoffs?",
      level: "senior",
      a: "<p><strong>Prisma:</strong> projeto novo TypeScript-first, schema declarativo como fonte de verdade, type-safety end-to-end com inference profunda, migrations confiáveis com diff automático. Padrão de mercado em 2024-2025. Tradeoff: bundle pesado (~5MB query engine), edge runtime exige Accelerate, queries muito complexas caem em $queryRaw.</p><p><strong>TypeORM:</strong> projetos NestJS legados, ActiveRecord pattern, suporte MongoDB no mesmo ORM, equipe vinda de Java/Hibernate. Tradeoff: migrations manuais com sync perigoso em produção, decorators espalham metadata pelos models, comunidade migrando para Prisma.</p><p><strong>Drizzle:</strong> edge runtime nativo (Cloudflare/Vercel sem proxy), performance crítica, equipe confortável com SQL, bundle pequeno. Schema em TypeScript puro (sem DSL). Tradeoff: migrations e ecossistema mais novos, sem MongoDB.</p>",
      tip: "Mencionar Accelerate para edge é o que diferencia sênior. Se a entrevista é para vaga edge/serverless, conheça os 3.",
    },
    {
      q: "Como funciona o $transaction interativo? Quais cuidados em produção?",
      level: "senior",
      a: "<p><code>prisma.$transaction(async (tx) => {})</code> recebe um callback com um client transacional <code>tx</code>. Tudo feito com <code>tx</code> roda na mesma transação atômica — todas as ops commitam juntas ou todas revertem.</p><p><strong>Cuidados:</strong></p><ol><li><strong>Use sempre o tx</strong> recebido — chamar <code>prisma.user.update</code> (global) dentro do callback executa FORA da transação.</li><li><strong>Timeout default é 5s</strong> — para transações longas configure <code>{ timeout: 30000 }</code>.</li><li><strong>maxWait</strong> — tempo que Prisma espera para começar a transação se o pool está saturado.</li><li><strong>isolationLevel</strong> — Serializable previne phantom reads e write skew, mas reduz throughput. RepeatableRead é meio termo.</li><li><strong>Não chame APIs externas dentro</strong> — request HTTP de 2s segura conexão e reduz throughput drasticamente.</li><li><strong>Evite long-running</strong> — transação aberta segura row locks, causa contenção e potencial deadlock.</li></ol>",
      tip: "Saber que o callback usa o tx local (não o prisma global) é o gotcha mais comum. Mencionar isolation levels mostra profundidade.",
    },
    {
      q: "Como evitar N+1 em queries Prisma? Quando include é insuficiente?",
      level: "senior",
      a: "<p><strong>1. include / select aninhado</strong> resolve a maioria dos casos: Prisma faz JOIN ou múltiplas queries otimizadas internamente. <code>posts.findMany({ include: { author: true, comments: true } })</code> roda 3 queries (posts, authors WHERE IN, comments WHERE IN) — não N+1.</p><p><strong>2. Quando include é insuficiente:</strong></p><ul><li>Em GraphQL onde resolvers de campos são chamados independentemente — use <strong>DataLoader</strong> na camada GraphQL.</li><li>Quando você precisa de filtro condicional na relação que não cabe em include.</li><li>Aninhamento muito profundo (4+ níveis) — JOIN gigante fica lento; quebre em queries separadas.</li></ul><p><strong>3. Diagnóstico:</strong> ative <code>log: ['query']</code> e conte queries por request. Use EXPLAIN no SQL gerado para ver se índices foram usados.</p><p><strong>4. Prisma 5.x:</strong> introduziu <code>relationLoadStrategy: 'join'</code> para forçar JOIN único em vez de múltiplas queries — útil quando dados têm alta cardinalidade.</p>",
    },
    {
      q: "Explique como funciona o pipeline de migrations em Prisma. Diferença entre dev e deploy.",
      level: "pleno",
      a: "<p><strong>migrate dev</strong> — para desenvolvimento local. Faz 3 coisas: (1) compara schema.prisma com a última migration aplicada e gera SQL de diff em <code>prisma/migrations/&lt;timestamp&gt;_name/migration.sql</code>, (2) aplica no banco de dev, (3) regenera <code>@prisma/client</code> com novos tipos. Pode pedir reset se detectar drift.</p><p><strong>migrate deploy</strong> — para CI/CD e produção. Apenas aplica as migrations já versionadas em ordem cronológica. Não gera novas migrations, não regenera client (você roda <code>generate</code> no build), idempotente — rodar duas vezes não causa problema. Faz lock no banco para impedir aplicações simultâneas.</p><p><strong>Workflow correto:</strong> dev cria migration → revisa SQL gerado → commita → CI roda <code>migrate deploy</code> antes de deploy do app.</p><p><strong>db push</strong> sincroniza schema → banco SEM gerar migration. Só prototipação. Em produção é destrutivo: pula histórico, sem rollback controlado.</p>",
      tip: "Saber que migrations já aplicadas são imutáveis e que correções viram NOVAS migrations é o ponto que separa pleno de júnior.",
    },
    {
      q: "Como otimizar uma query Prisma que está lenta em produção?",
      level: "senior",
      a: "<p>Roteiro em ordem:</p><ol><li><strong>Reproduza com log:</strong> <code>new PrismaClient({ log: ['query'] })</code> e capture o SQL gerado.</li><li><strong>EXPLAIN ANALYZE no Postgres / EXPLAIN no MySQL:</strong> identifique se está fazendo Seq Scan (sem índice) ou Index Scan.</li><li><strong>Adicione @@index</strong> para os campos de filtro frequente. Composto cobre prefixos: <code>@@index([authorId, status])</code> cobre filtro por authorId sozinho ou authorId+status, mas NÃO status sozinho.</li><li><strong>Reduza payload com select/include explícito</strong> — não traga colunas Json e Text que não vai usar.</li><li><strong>Para listas grandes use cursor pagination</strong> — skip/take com offset alto faz o banco varrer N linhas até a posição.</li><li><strong>Evite include profundamente aninhado em listas</strong> — quebrar em queries separadas pode ser mais rápido que um JOIN gigante.</li><li><strong>Considere $queryRaw</strong> para queries com CTE, window functions ou agregações específicas do banco.</li><li><strong>Connection pooling:</strong> em serverless verifique se está usando PgBouncer ou Accelerate.</li></ol>",
    },
    {
      q: "Como rodar Prisma em edge runtime (Cloudflare Workers, Vercel Edge)?",
      level: "senior",
      a: "<p>O Prisma Client tradicional usa drivers TCP (pg, mysql2) que não funcionam em edge runtime — runtime sem suporte a TCP nativo. Duas estratégias:</p><p><strong>1. Prisma Accelerate (recomendado para Prisma):</strong></p><ul><li>Proxy HTTP gerenciado pela Prisma. Você importa de <code>@prisma/client/edge</code> e usa <code>$extends(withAccelerate())</code>.</li><li>O DATABASE_URL aponta para <code>prisma://accelerate.prisma-data.net/</code>; o DIRECT_URL (para migrations) aponta direto para o banco.</li><li>Ganhos: connection pooling global (resolve cold start), cache distribuído com TTL/SWR, suporte a edge.</li><li>Custos: por query, por miss de cache, e tier mensal.</li></ul><p><strong>2. Driver Adapters (preview):</strong> @prisma/adapter-neon, @prisma/adapter-planetscale — drivers HTTP nativos do banco. Mais barato que Accelerate mas amarra ao provider.</p><p><strong>Alternativa: Drizzle</strong> tem suporte edge nativo via http drivers, sem proxy intermediário — pode ser melhor escolha para apps edge-first.</p>",
      tip: "Mencionar que Accelerate é gerenciado e custa diferencia sênior. Saber que Drizzle é alternativa edge-nativa mostra horizonte.",
    },
    {
      q: "Como implementar soft delete em Prisma sem repetir filtros em todos os resolvers?",
      level: "senior",
      a: "<p><strong>Solução errada:</strong> adicionar <code>deletedAt: null</code> em cada findMany/findUnique — fácil esquecer e vazar dados deletados.</p><p><strong>Solução correta: Prisma Client Extension com query interception.</strong></p><pre><code>const prisma = basePrisma.$extends({\n  query: {\n    user: {\n      async findMany({ args, query }) {\n        args.where = { ...args.where, deletedAt: null }\n        return query(args)\n      },\n      async findUnique({ args, query }) {\n        const result = await query(args)\n        return result?.deletedAt ? null : result\n      },\n    },\n  },\n  model: {\n    user: {\n      async softDelete(id: string) {\n        return basePrisma.user.update({\n          where: { id }, data: { deletedAt: new Date() },\n        })\n      },\n    },\n  },\n})</code></pre><p>Isso garante que todas as queries de User filtram automaticamente — impossível esquecer. Para acesso de admin (ver deletados), use <code>basePrisma</code> diretamente.</p>",
    },
    {
      q: "Diferença entre upsert e createMany com skipDuplicates? Quando usar cada?",
      level: "pleno",
      a: "<p><strong>upsert</strong> (find + update OR create) — atômico para um registro. Você define lógica diferente em <code>create</code> e <code>update</code>:</p><pre><code>prisma.user.upsert({\n  where: { email: 'x' },\n  create: { email: 'x', name: 'Ana' },\n  update: { lastLoginAt: new Date() },\n})</code></pre><p>Use quando: precisa lógica diferenciada entre 'novo' e 'já existe' (ex: criar usuário ou atualizar last login).</p><p><strong>createMany com skipDuplicates</strong> — bulk insert ignorando conflitos de @unique. Não atualiza nada — só pula.</p><pre><code>prisma.tag.createMany({\n  data: [...tags],\n  skipDuplicates: true,\n})</code></pre><p>Use quando: bulk insert idempotente onde não interessa atualizar o existente (ex: seed de tags).</p><p><strong>Bulk upsert real</strong> não existe nativo — use loop de upsert ou raw SQL com ON CONFLICT (Postgres).</p>",
    },
    {
      q: "O que são Prisma Client Extensions? Quando usar?",
      level: "senior",
      a: "<p>Extensions ($extends) são a forma moderna e composável de estender o Prisma Client (substituem $use middleware deprecated). 4 tipos:</p><ol><li><strong>query:</strong> intercepta queries — modifica args antes de executar ou result depois. Casos: soft delete, multi-tenancy, row-level security, logging.</li><li><strong>model:</strong> adiciona métodos a um model. Caso: <code>prisma.user.softDelete(id)</code>, métodos de domínio que encapsulam lógica.</li><li><strong>client:</strong> adiciona métodos no client raiz. Caso: <code>prisma.$auditLog()</code>.</li><li><strong>result:</strong> adiciona campos virtuais computados. Caso: fullName que concatena firstName + lastName, sem ir no banco.</li></ol><p>São composáveis: encadeie vários $extends para adicionar features incrementais. Ao contrário de $use, extensions são tipadas — TypeScript reconhece os métodos adicionados.</p><p>Cuidado: query extensions interceptam apenas chamadas via Prisma Client — $queryRaw bypassa.</p>",
    },
    {
      q: "Como configurar Prisma em monorepo com múltiplos packages?",
      level: "senior",
      a: "<p><strong>Padrão recomendado:</strong> um package <code>packages/database</code> que contém schema.prisma, migrations e exporta o Prisma Client gerado.</p><pre><code>packages/database/\n  schema.prisma\n  migrations/\n  src/index.ts  // export { PrismaClient } from '@prisma/client'\n  package.json  // \"prisma generate\" no postinstall</code></pre><p><strong>Apps consumidores:</strong> <code>apps/web</code> e <code>apps/api</code> dependem do <code>@org/database</code> e importam o singleton já configurado.</p><p><strong>Cuidados:</strong></p><ul><li><strong>output customizado:</strong> <code>generator client { output = \"../node_modules/.prisma/client\" }</code> para que o gerado fique acessível por todos os packages do workspace.</li><li><strong>Singleton compartilhado:</strong> exporte uma única instância do Client com globalThis pattern para evitar múltiplos pools.</li><li><strong>postinstall:</strong> <code>\"postinstall\": \"prisma generate\"</code> no package.json garante que o Client é gerado após install em qualquer máquina/CI.</li><li><strong>Migrations só em um lugar:</strong> packages/database é o único que roda migrate deploy.</li></ul>",
    },
    {
      q: "Como debugar uma query Prisma lenta? Quais ferramentas?",
      level: "pleno",
      a: "<p><strong>1. Ative log de query:</strong></p><pre><code>new PrismaClient({\n  log: [\n    { level: 'query', emit: 'event' },\n    { level: 'warn', emit: 'event' },\n  ],\n})\nprisma.$on('query', (e) => {\n  if (e.duration > 100) console.log(e.query, e.params, e.duration + 'ms')\n})</code></pre><p><strong>2. Prisma Studio</strong> (<code>npx prisma studio</code>) — GUI para inspecionar dados.</p><p><strong>3. Database EXPLAIN:</strong> copie o SQL do log e rode EXPLAIN ANALYZE no Postgres / EXPLAIN no MySQL — verifique Index Scan vs Seq Scan, custos, rows estimadas vs reais.</p><p><strong>4. Métricas Prisma:</strong> <code>previewFeatures = [\"metrics\"]</code> — expõe métricas Prometheus de pool, queries em flight, durations.</p><p><strong>5. Prisma Pulse / Accelerate dashboard:</strong> em produção dão visão de queries reais, cache hit rate, latências por região.</p><p><strong>6. tracing:</strong> <code>previewFeatures = [\"tracing\"]</code> integra com OpenTelemetry — visualize traces de queries em Jaeger/Tempo.</p>",
    },
    {
      q: "O que são Prisma Pulse e Accelerate? Quais problemas resolvem?",
      level: "senior",
      a: "<p><strong>Prisma Accelerate:</strong> proxy HTTP + connection pooling global + cache distribuído. Resolve:</p><ul><li><strong>Cold start em serverless</strong> — cada Lambda nova abriria conexão TCP (300-500ms). Accelerate mantém pool quente globalmente.</li><li><strong>Edge runtime</strong> — workers sem TCP nativo só fazem HTTP.</li><li><strong>Cache</strong> — TTL e SWR (stale-while-revalidate) por query, distribuído em edge.</li></ul><p><strong>Prisma Pulse:</strong> Change Data Capture (CDC) gerenciado — você subscreve a mudanças em tabelas via stream. Resolve:</p><ul><li><strong>Real-time sem polling</strong> — em vez de SELECT a cada 5s, você recebe push quando algo muda.</li><li><strong>Substitui webhooks internos</strong> — qualquer INSERT/UPDATE/DELETE pode disparar lógica downstream sem precisar acoplar nas mutations.</li><li><strong>Casos:</strong> notificações push, sincronização cross-service, materialização de views, analytics em tempo real.</li></ul><p>Ambos são pagos — para apps high-traffic considerar custos. Alternativa Pulse: Postgres logical replication direto + biblioteca como pg-logical-replication.</p>",
    },
    {
      q: "Como o Prisma Client é gerado internamente? O que o generator faz?",
      level: "senior",
      a: "<p>O <code>prisma generate</code> roda um pipeline em três fases:</p><ol><li><strong>Parse do schema:</strong> <code>schema.prisma</code> é lido e convertido em uma DMMF (Data Model Meta Format) — uma representação JSON do schema com todos os models, fields, relações, enums e atributos.</li><li><strong>Geração de tipos TypeScript:</strong> a partir da DMMF, o generator gera <code>index.d.ts</code> dentro de <code>node_modules/.prisma/client</code> com tipos como <code>User</code>, <code>UserCreateInput</code>, <code>UserWhereInput</code>, <code>UserSelect</code>, <code>UserInclude</code>, e <code>UserGetPayload&lt;T&gt;</code> (este último faz a inferência dinâmica baseada em select/include).</li><li><strong>Geração do runtime:</strong> gera <code>index.js</code> que instancia uma engine Rust (Query Engine) embutida — um binário que recebe queries via JSON-RPC e devolve resultados parseados.</li></ol><p>Por isso o Client está em <code>node_modules/.prisma/client</code> (não <code>@prisma/client</code> direto) — é gerado localmente após install. O package <code>@prisma/client</code> é só um stub que re-exporta de <code>.prisma/client</code>. <strong>Esquecer de rodar generate</strong> em CI/Docker faz o app falhar com <code>@prisma/client did not initialize yet</code> — adicione <code>postinstall: prisma generate</code> no package.json.</p>",
      tip: "Mencionar a DMMF e o Query Engine em Rust diferencia sênior. O Query Engine é o motivo do bundle pesado e do problema em edge runtime.",
    },
    {
      q: "Qual a diferença entre nested writes, $transaction array e $transaction interactive?",
      level: "senior",
      a: "<p>São três formas de garantir atomicidade, com tradeoffs distintos:</p><ul><li><strong>Nested writes</strong> (<code>create: { posts: { create: [...] } }</code>): Prisma encapsula múltiplas inserções relacionadas em uma única transação implícita. Mais conciso, ideal para criar entidade + relações em uma única chamada. Limitação: só funciona em árvore de relações conhecidas em compile-time, não permite lógica condicional entre as ops.</li><li><strong>$transaction([op1, op2, op3])</strong> (sequential array): roda múltiplas Promise<Op> atomicamente. Cada op não vê o resultado da anterior — todas são preparadas antes e executadas em sequência. Bom para batch de operações independentes, sem ramo condicional.</li><li><strong>$transaction(async tx => {})</strong> (interactive): callback recebe um client transacional. Permite ler, decidir e escrever com lógica. Necessário sempre que a próxima operação depende do resultado da anterior (ex: validar saldo antes de debitar). <strong>Custo:</strong> segura conexão do pool durante toda a execução do callback — evite I/O externo dentro.</li></ul><p>Regra prática: <strong>nested write</strong> para criar uma árvore de objetos relacionados; <strong>array</strong> para batch independente; <strong>interactive</strong> quando há lógica de decisão. Em todos, a transação reverte tudo em caso de erro lançado.</p>",
    },
    {
      q: "Como Prisma se comporta em serverless? Por que connection pooling vira problema?",
      level: "senior",
      a: "<p>O modelo serverless rompe a premissa do pool tradicional: cada invocação Lambda/Vercel Function pode criar uma nova instância de PrismaClient → cada uma abre seu próprio pool TCP no Postgres → em pico de tráfego, 1000 invocações concorrentes = 1000 conexões TCP — o Postgres trava com <code>too many connections</code> (default 100).</p><p><strong>Soluções em ordem de adoção:</strong></p><ol><li><strong>PgBouncer/Supavisor em frente ao Postgres</strong> (modo transaction): o app conecta no PgBouncer, que multiplexa milhares de conexões em poucas conexões reais ao Postgres. Use <code>?pgbouncer=true</code> no DATABASE_URL para Prisma desabilitar prepared statements (incompatíveis com PgBouncer transaction mode).</li><li><strong>Prisma Accelerate:</strong> proxy HTTP gerenciado com pool global. Cada query vira HTTP — sem TCP. Bônus: cache distribuído com TTL/SWR.</li><li><strong>Limite de conexões por instância:</strong> <code>?connection_limit=1</code> em serverless para forçar uma conexão por Lambda (pequeno pool, mas previsível).</li></ol><p><strong>Cuidado adicional:</strong> em serverless, NÃO chame <code>$disconnect()</code> entre requests — Lambda reusa a instância (warm start). Disconnect só ao encerrar o processo (cold shutdown) ou em scripts CLI.</p>",
      tip: "Mencionar PgBouncer em transaction mode e o flag <code>pgbouncer=true</code> é diferencial. É o caminho mais comum em produção com Postgres self-hosted.",
    },
    {
      q: "Como fazer schema migration com zero downtime usando Prisma?",
      level: "senior",
      a: "<p>O padrão é <strong>expand-contract</strong> em três fases — nunca em uma migration só:</p><ol><li><strong>Expand (migration 1):</strong> adicione a nova estrutura sem remover a antiga. Ex: nova coluna <code>email_v2</code>, ou nova tabela. App ainda lê e escreve na antiga. Deploy do app em paralelo ainda funciona — a nova coluna é nullable ou tem default.</li><li><strong>Migrate data + dual-write (deploy de app):</strong> app começa a escrever em ambas as colunas. Backfill via job (raw SQL ou script) para popular a nova coluna nos registros antigos. Validar que <code>SELECT WHERE email_v2 IS NULL</code> retorna zero.</li><li><strong>Contract (migration 2):</strong> app passa a ler e escrever apenas na nova. Após validar em produção, drop da coluna antiga. Tempo entre fases: dias a semanas dependendo do tráfego.</li></ol><p><strong>Anti-patterns que causam downtime:</strong> renomear coluna em uma migration só (Prisma gera DROP + ADD — perde dados!), adicionar coluna NOT NULL sem default em tabela grande (lock prolongado), adicionar índice em tabela grande sem CONCURRENTLY (Prisma migrate deploy não usa CONCURRENTLY por default — pode ser necessário SQL manual).</p><p><strong>Para alterações destrutivas:</strong> edite o arquivo <code>migration.sql</code> antes de aplicar — Prisma gera o SQL mas você pode reescrever (ex: trocar DROP+ADD por RENAME).</p>",
    },
    {
      q: "Como a inferência de tipos do Prisma funciona com select/include aninhados?",
      level: "senior",
      a: "<p>O segredo está em dois utility types gerados: <code>Prisma.UserGetPayload&lt;T&gt;</code> e os tipos de validação <code>Prisma.UserSelect</code>, <code>Prisma.UserInclude</code>. Quando você chama <code>findMany({ select: { id: true, posts: { select: { title: true } } } })</code>, o TypeScript aplica:</p><ol><li>O argumento é validado contra <code>Prisma.UserFindManyArgs</code> — autocomplete dos campos.</li><li>O retorno é tipado como <code>Promise&lt;Prisma.UserGetPayload&lt;{ select: { id: true, posts: { select: { title: true } } } }&gt;[]&gt;</code>.</li><li><code>UserGetPayload</code> é uma <strong>conditional type</strong> que percorre o select/include recursivamente e constrói o tipo exato — <code>{ id: string; posts: { title: string }[] }</code>.</li></ol><p><strong>Como extrair tipos para usar em DTOs:</strong></p><pre><code>const userSelect = Prisma.validator&lt;Prisma.UserSelect&gt;()({\n  id: true, name: true, posts: { select: { title: true } },\n})\ntype UserDTO = Prisma.UserGetPayload&lt;{ select: typeof userSelect }&gt;</code></pre><p><code>Prisma.validator</code> garante que o objeto seja válido sem instanciar — útil para reutilizar selects entre query e tipo. Esse padrão é a base para repositórios type-safe e DTOs compartilhados entre back e front (via tRPC ou tipos exportados).</p>",
    },
    {
      q: "Quais os riscos do $queryRawUnsafe e quando ele é justificável?",
      level: "senior",
      a: "<p><code>$queryRawUnsafe(sql, ...params)</code> aceita uma string SQL pré-construída — sem template tag e sem parametrização automática como o <code>$queryRaw</code>. <strong>O risco:</strong> qualquer interpolação de input do usuário na string vira SQL injection. <code>$queryRawUnsafe(\`SELECT * FROM \"User\" WHERE name = '\${userInput}'\`)</code> é exatamente o caso clássico — <code>'; DROP TABLE \"User\"; --</code> destrói o banco.</p><p><strong>Quando é justificável:</strong></p><ul><li>Identificadores dinâmicos (nomes de tabela/coluna) que <code>$queryRaw</code> não suporta — template tag escapa apenas valores. Use uma whitelist rigorosa: <code>const allowed = ['name','email']; if (!allowed.includes(col)) throw...</code></li><li>SQL gerado programaticamente sem input externo (ex: ferramentas internas de admin).</li><li>Construção condicional complexa quando <code>Prisma.sql</code> + <code>Prisma.empty</code> + <code>Prisma.join</code> ficam ilegíveis.</li></ul><p><strong>Regra de ouro:</strong> 99% dos casos cabem em <code>$queryRaw\\`...\\${var}\\`</code> ou em composição com <code>Prisma.sql\\`WHERE ...\\${val}\\`</code>. Antes de usar Unsafe, pergunte: <em>existe uma alternativa parametrizada?</em> Se a resposta é sim, use ela. Se não, valide rigorosamente todo input com Zod ou whitelist antes de interpolar.</p>",
      tip: "Saber que template tags só escapam VALUES (não identificadores) e que isso é o motivo legítimo de Unsafe é o nível de profundidade esperado.",
    },
    {
      q: "Como testar código que usa Prisma sem depender de um banco real em cada teste?",
      level: "senior",
      a: "<p>Há três estratégias, em ordem crescente de fidelidade:</p><ol><li><strong>Mock do PrismaClient</strong> com <code>jest-mock-extended</code> ou <code>vitest-mock-extended</code>: <code>const prisma = mockDeep&lt;PrismaClient&gt;()</code> — injetável, retornos configuráveis. Rápido e isolado, mas não testa o SQL gerado nem o schema. Bom para testes de unidade de lógica de domínio.</li><li><strong>SQLite em memória</strong> com <code>file::memory:?cache=shared</code>: cada suíte cria um schema novo via <code>prisma migrate deploy</code>. Mais lento (segundos) mas testa queries reais. Limitação: SQLite não suporta tudo do Postgres (jsonb, full-text, arrays).</li><li><strong>Postgres real em Docker via testcontainers-node</strong>: cada suíte (ou cada teste) sobe um container Postgres efêmero, roda migrate deploy, executa testes, derruba. Lento (5-10s startup) mas máxima fidelidade. Use template database (<code>CREATE DATABASE test_X TEMPLATE prisma_template</code>) para resetar entre testes em milissegundos sem rodar migrations.</li></ol><p><strong>Padrão recomendado em produção:</strong> mocks para unit tests de domínio, testcontainers para integration tests. Em CI, paralelize com worker per test file usando databases isolados.</p>",
    },
    {
      q: "Como usar Prisma em arquitetura hexagonal/clean? Onde ele se encaixa?",
      level: "senior",
      a: "<p>Em arquitetura hexagonal, Prisma é um <strong>adapter de infraestrutura</strong> — fica na borda externa, nunca vaza para o domínio. O domínio define interfaces de repositório (<code>UserRepository</code>) e entidades puras; a camada de infraestrutura implementa essas interfaces com Prisma.</p><pre><code>// domain/user.ts — entidade pura, sem Prisma\nexport class User {\n  constructor(readonly id: string, readonly email: Email, ...) {}\n  // regras de negócio\n}\n// domain/user-repository.ts — porta\nexport interface UserRepository {\n  findById(id: string): Promise&lt;User | null&gt;\n  save(user: User): Promise&lt;void&gt;\n}\n// infra/prisma-user-repository.ts — adapter\nexport class PrismaUserRepository implements UserRepository {\n  constructor(private prisma: PrismaClient) {}\n  async findById(id: string) {\n    const row = await this.prisma.user.findUnique({ where: { id } })\n    return row ? this.toDomain(row) : null\n  }\n  private toDomain(row: PrismaUser): User { ... }\n}</code></pre><p><strong>Cuidados:</strong> não retorne tipos do Prisma do repositório — sempre converta para entidades de domínio. Não use <code>include</code> profundo — isso vaza estrutura de dados (tabelas, FKs) para o domínio. Em domain, trabalhe com aggregates carregados explicitamente. Para transações que abrangem múltiplos repositórios, use <strong>Unit of Work</strong>: passe o <code>tx</code> do <code>$transaction</code> para os repositórios via factory.</p>",
      tip: "O ponto crítico é não retornar tipos gerados pelo Prisma do repositório — converta para o domínio. Demonstrar isso revela maturidade arquitetural.",
    },
  ],
  mindmap: {
    title: "Mapa mental — ecossistema Prisma completo",
    html: `<style>
.prsm-mm-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.prsm-mm-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:8px}
.prsm-mm-card{background:#1e293b;border-radius:8px;padding:11px 13px;border-left:3px solid;font-size:10px;line-height:1.65}
.prsm-mm-title{font-size:11px;font-weight:700;margin-bottom:6px;display:flex;align-items:center;gap:6px}
.prsm-mm-bullet{color:#475569;display:block;margin:2px 0;padding-left:10px;position:relative}
.prsm-mm-bullet::before{content:'›';color:#5A67D8;position:absolute;left:0}
.prsm-mm-sub{color:#94a3b8;font-weight:600;margin:6px 0 3px;font-size:10px}
.prsm-mm-center{background:linear-gradient(135deg,#5A67D8 0%,#7c3aed 100%);border-radius:10px;padding:14px 18px;text-align:center;color:#fff;font-weight:700;font-size:13px;margin-bottom:14px;box-shadow:0 4px 12px rgba(90,103,216,.3)}
.prsm-mm-tag{display:inline-block;background:rgba(90,103,216,.15);color:#a5b4fc;font-size:9px;padding:1px 6px;border-radius:4px;margin-left:4px}
</style>
<div class="prsm-mm-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Mapa mental — ecossistema Prisma completo</p>
<p style="color:#475569;font-size:10px;margin:0 0 14px">Da DSL declarativa aos serviços gerenciados — visão de 360°</p>
<div class="prsm-mm-center">PRISMA ORM</div>
<div class="prsm-mm-grid">
  <div class="prsm-mm-card" style="border-color:#5A67D8">
    <div class="prsm-mm-title" style="color:#5A67D8">Schema Language <span class="prsm-mm-tag">.prisma</span></div>
    <div class="prsm-mm-sub">Blocos</div>
    <span class="prsm-mm-bullet">datasource — provider, url, shadowDatabaseUrl</span>
    <span class="prsm-mm-bullet">generator — client, output, previewFeatures</span>
    <span class="prsm-mm-bullet">model — tabelas e atributos</span>
    <span class="prsm-mm-bullet">enum — valores literais tipados</span>
    <div class="prsm-mm-sub">Tipos</div>
    <span class="prsm-mm-bullet">String, Int, BigInt, Float, Decimal</span>
    <span class="prsm-mm-bullet">Boolean, DateTime, Json, Bytes</span>
    <span class="prsm-mm-bullet">Modificadores: ? (nullable), [] (array)</span>
    <div class="prsm-mm-sub">Atributos</div>
    <span class="prsm-mm-bullet">@id, @unique, @default, @relation, @map, @updatedAt</span>
    <span class="prsm-mm-bullet">@@id, @@unique, @@index, @@map, @@fulltext</span>
    <span class="prsm-mm-bullet">@db.VarChar/Text/Decimal — tipos nativos SQL</span>
  </div>
  <div class="prsm-mm-card" style="border-color:#4ade80">
    <div class="prsm-mm-title" style="color:#4ade80">Client API <span class="prsm-mm-tag">@prisma/client</span></div>
    <div class="prsm-mm-sub">CRUD por model</div>
    <span class="prsm-mm-bullet">findUnique / findUniqueOrThrow / findFirst</span>
    <span class="prsm-mm-bullet">findMany — where, select, include, orderBy</span>
    <span class="prsm-mm-bullet">create / createMany (skipDuplicates)</span>
    <span class="prsm-mm-bullet">update / updateMany / upsert</span>
    <span class="prsm-mm-bullet">delete / deleteMany</span>
    <div class="prsm-mm-sub">Filtering</div>
    <span class="prsm-mm-bullet">equals, not, in, notIn, lt/lte/gt/gte</span>
    <span class="prsm-mm-bullet">contains, startsWith, endsWith (mode: insensitive)</span>
    <span class="prsm-mm-bullet">AND, OR, NOT compostos</span>
    <span class="prsm-mm-bullet">some, every, none — em relações</span>
    <div class="prsm-mm-sub">Aggregation</div>
    <span class="prsm-mm-bullet">count, aggregate (_avg, _sum, _max, _min)</span>
    <span class="prsm-mm-bullet">groupBy — by, _count, having</span>
    <div class="prsm-mm-sub">Pagination</div>
    <span class="prsm-mm-bullet">skip + take (offset)</span>
    <span class="prsm-mm-bullet">cursor + take (cursor-based — preferir em listas grandes)</span>
  </div>
  <div class="prsm-mm-card" style="border-color:#a78bfa">
    <div class="prsm-mm-title" style="color:#a78bfa">Migrations <span class="prsm-mm-tag">prisma migrate</span></div>
    <div class="prsm-mm-sub">Comandos</div>
    <span class="prsm-mm-bullet">migrate dev — gera + aplica + regenera client</span>
    <span class="prsm-mm-bullet">migrate deploy — só aplica (CI/CD, idempotente)</span>
    <span class="prsm-mm-bullet">migrate reset — apaga banco (só dev)</span>
    <span class="prsm-mm-bullet">migrate status — pendentes vs aplicadas</span>
    <span class="prsm-mm-bullet">migrate resolve — força marca como aplicada</span>
    <div class="prsm-mm-sub">Conceitos</div>
    <span class="prsm-mm-bullet">Shadow database — diff sem afetar produção</span>
    <span class="prsm-mm-bullet">Drift detection — schema ≠ banco real</span>
    <span class="prsm-mm-bullet">Expand-contract — zero downtime</span>
    <span class="prsm-mm-bullet">db push — sync sem migration (NUNCA prod)</span>
    <span class="prsm-mm-bullet">db pull — introspect banco existente</span>
  </div>
  <div class="prsm-mm-card" style="border-color:#fbbf24">
    <div class="prsm-mm-title" style="color:#fbbf24">Transactions</div>
    <span class="prsm-mm-bullet">Nested writes — árvore de creates relacionados</span>
    <span class="prsm-mm-bullet">$transaction([op1, op2]) — array atômico</span>
    <span class="prsm-mm-bullet">$transaction(async tx =&gt; {}) — interactive</span>
    <div class="prsm-mm-sub">Opções</div>
    <span class="prsm-mm-bullet">isolationLevel: ReadCommitted, RepeatableRead, Serializable</span>
    <span class="prsm-mm-bullet">timeout (default 5s) e maxWait</span>
    <div class="prsm-mm-sub">Pitfalls</div>
    <span class="prsm-mm-bullet">Sempre usar tx, NUNCA prisma global no callback</span>
    <span class="prsm-mm-bullet">Evitar I/O externo dentro (segura conexão)</span>
    <span class="prsm-mm-bullet">SELECT FOR UPDATE via $queryRaw para lock pessimista</span>
  </div>
  <div class="prsm-mm-card" style="border-color:#ef4444">
    <div class="prsm-mm-title" style="color:#ef4444">Extensions <span class="prsm-mm-tag">$extends</span></div>
    <span class="prsm-mm-bullet">query — intercepta args/result (soft delete, multi-tenancy)</span>
    <span class="prsm-mm-bullet">model — métodos customizados por model</span>
    <span class="prsm-mm-bullet">client — métodos no client raiz</span>
    <span class="prsm-mm-bullet">result — campos virtuais computados (needs + compute)</span>
    <div class="prsm-mm-sub">Features</div>
    <span class="prsm-mm-bullet">Composáveis — encadeia múltiplos $extends</span>
    <span class="prsm-mm-bullet">Type-safe — TypeScript reconhece adições</span>
    <span class="prsm-mm-bullet">Substituem $use middleware (deprecated)</span>
    <span class="prsm-mm-bullet">$allModels — aplicar a todos os models de uma vez</span>
  </div>
  <div class="prsm-mm-card" style="border-color:#22d3ee">
    <div class="prsm-mm-title" style="color:#22d3ee">Raw SQL</div>
    <span class="prsm-mm-bullet">$queryRaw — retorna linhas (template tag, parametrizado)</span>
    <span class="prsm-mm-bullet">$executeRaw — retorna count de linhas afetadas</span>
    <span class="prsm-mm-bullet">$queryRawUnsafe — string crua (SQL injection risk!)</span>
    <div class="prsm-mm-sub">Composição</div>
    <span class="prsm-mm-bullet">Prisma.sql — fragmentos parametrizados</span>
    <span class="prsm-mm-bullet">Prisma.empty — fragmento vazio</span>
    <span class="prsm-mm-bullet">Prisma.join — array → IN list</span>
    <div class="prsm-mm-sub">Casos</div>
    <span class="prsm-mm-bullet">CTE, window functions, full-text avançado</span>
    <span class="prsm-mm-bullet">UPSERT com ON CONFLICT (Postgres-only)</span>
    <span class="prsm-mm-bullet">Identificadores dinâmicos (whitelist obrigatória)</span>
  </div>
  <div class="prsm-mm-card" style="border-color:#f97316">
    <div class="prsm-mm-title" style="color:#f97316">Prisma Cloud</div>
    <div class="prsm-mm-sub">Accelerate</div>
    <span class="prsm-mm-bullet">Proxy HTTP — edge runtime nativo</span>
    <span class="prsm-mm-bullet">Connection pooling global</span>
    <span class="prsm-mm-bullet">Cache distribuído — TTL + SWR</span>
    <span class="prsm-mm-bullet">withAccelerate extension</span>
    <div class="prsm-mm-sub">Pulse</div>
    <span class="prsm-mm-bullet">Change Data Capture (CDC) gerenciado</span>
    <span class="prsm-mm-bullet">Subscribe a INSERT/UPDATE/DELETE em real-time</span>
    <span class="prsm-mm-bullet">Substitui webhooks internos e polling</span>
    <div class="prsm-mm-sub">Optimize (preview)</div>
    <span class="prsm-mm-bullet">Recomendações automáticas de índice e query</span>
  </div>
  <div class="prsm-mm-card" style="border-color:#ec4899">
    <div class="prsm-mm-title" style="color:#ec4899">Studio &amp; Tooling</div>
    <span class="prsm-mm-bullet">prisma studio — GUI no browser para inspecionar dados</span>
    <span class="prsm-mm-bullet">prisma format — formatador do schema.prisma</span>
    <span class="prsm-mm-bullet">prisma validate — checa schema sem gerar</span>
    <span class="prsm-mm-bullet">prisma db seed — script de seed configurado em package.json</span>
    <div class="prsm-mm-sub">Logging &amp; Debug</div>
    <span class="prsm-mm-bullet">log: ['query', 'error', 'warn']</span>
    <span class="prsm-mm-bullet">$on('query') — events com SQL e duration</span>
    <span class="prsm-mm-bullet">previewFeatures: 'metrics', 'tracing'</span>
  </div>
  <div class="prsm-mm-card" style="border-color:#14b8a6">
    <div class="prsm-mm-title" style="color:#14b8a6">Generators</div>
    <span class="prsm-mm-bullet">prisma-client-js — cliente padrão (Node + edge)</span>
    <span class="prsm-mm-bullet">zod-prisma-types — schemas Zod automáticos</span>
    <span class="prsm-mm-bullet">prisma-erd-generator — diagramas ER automáticos</span>
    <span class="prsm-mm-bullet">prisma-trpc-generator — routers tRPC</span>
    <span class="prsm-mm-bullet">prisma-dbml-generator — DBML para dbdiagram.io</span>
    <span class="prsm-mm-bullet">prisma-json-types-generator — tipa Json fields</span>
    <div class="prsm-mm-sub">Custom</div>
    <span class="prsm-mm-bullet">Qualquer ferramenta CLI pode receber a DMMF e gerar código</span>
  </div>
</div>
<div style="background:#1e293b;border-radius:8px;padding:12px 14px;margin-top:14px;font-size:10px;color:#64748b;line-height:1.7;border:1px solid #1e3a5f">
  <span style="color:#5A67D8;font-weight:700">Trilha sugerida:</span> domine schema language e CRUD básico → migrations dev/deploy → relations e nested writes → transactions interactive → extensions (soft delete, multi-tenancy) → Accelerate em edge → Pulse para real-time. Entrevistas plenas focam nos 4 primeiros; sêniors em todos.
</div>
</div>`,
    caption: "O ecossistema Prisma vai muito além do Client. Schema language declarativa, migrations versionadas, transactions com isolation levels, extensions composáveis, e os serviços gerenciados Accelerate (edge + cache) e Pulse (CDC) cobrem o ciclo completo de uma camada de dados moderna.",
  },
  codeExamples: [
    {
      title: "Schema completo — blog multi-tenant com soft delete e audit",
      description: "Schema realista de produção com 5 modelos, relações 1:1, 1:N e N:N, índices estratégicos, soft delete e timestamps.",
      code: `// schema.prisma
datasource db {
provider = "postgresql"
url      = env("DATABASE_URL")
}

generator client {
provider = "prisma-client-js"
previewFeatures = ["fullTextSearch", "fullTextIndex"]
}

model Tenant {
id        String   @id @default(cuid())
slug      String   @unique
name      String
users     User[]
posts     Post[]
createdAt DateTime @default(now())
@@map("tenants")
}

model User {
id          String    @id @default(cuid())
email       String    @unique
name        String
role        Role      @default(USER)
profile     Profile?               // 1:1
posts       Post[]                 // 1:N
comments    Comment[]              // 1:N
tenantId    String
tenant      Tenant    @relation(fields: [tenantId], references: [id])
createdAt   DateTime  @default(now())
updatedAt   DateTime  @updatedAt
deletedAt   DateTime?              // soft delete
@@index([tenantId, role])
@@index([deletedAt])              // queries de soft delete
@@map("users")
}

model Profile {
id     String  @id @default(cuid())
bio    String? @db.Text
avatar String?
userId String  @unique
user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Post {
id          String      @id @default(cuid())
slug        String
title       String      @db.VarChar(255)
content     String      @db.Text
status      PostStatus  @default(DRAFT)
publishedAt DateTime?
views       Int         @default(0)
metadata    Json?
authorId    String
author      User        @relation(fields: [authorId], references: [id])
tenantId    String
tenant      Tenant      @relation(fields: [tenantId], references: [id])
comments    Comment[]
tags        Tag[]                  // N:N implícita
createdAt   DateTime    @default(now())
updatedAt   DateTime    @updatedAt
deletedAt   DateTime?
@@unique([tenantId, slug])         // slug único por tenant
@@index([authorId, status, createdAt(sort: Desc)])
@@index([tenantId, status, publishedAt(sort: Desc)])
@@fulltext([title, content])
@@map("posts")
}

model Comment {
id        String   @id @default(cuid())
content   String   @db.Text
postId    String
post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
authorId  String
author    User     @relation(fields: [authorId], references: [id])
parentId  String?
parent    Comment? @relation("Replies", fields: [parentId], references: [id])
replies   Comment[] @relation("Replies")
createdAt DateTime @default(now())
@@index([postId, createdAt(sort: Desc)])
}

model Tag {
id    String @id @default(cuid())
name  String @unique
posts Post[]
}

enum Role        { ADMIN  EDITOR  USER }
enum PostStatus  { DRAFT  PUBLISHED  ARCHIVED }`,
      language: "prisma",
    },
    {
      title: "Repository pattern com Prisma + transactions interativas",
      description: "Encapsula lógica de domínio em métodos do repository. Transferência bancária com lock pessimista e rollback automático.",
      code: `// lib/repositories/account.ts
import { Prisma, PrismaClient } from '@prisma/client'

export class AccountRepository {
constructor(private prisma: PrismaClient) {}

async transfer(senderId: string, receiverId: string, amount: number) {
  return this.prisma.$transaction(async (tx) => {
    // 1. Lock pessimista nas duas contas — ordem determinística por id
    const [firstId, secondId] = [senderId, receiverId].sort()
    const accounts = await tx.$queryRaw<Account[]>\`
      SELECT * FROM "accounts"
      WHERE id IN (\${firstId}, \${secondId})
      FOR UPDATE
    \`

    const sender = accounts.find(a => a.id === senderId)!
    const receiver = accounts.find(a => a.id === receiverId)!

    // 2. Validações de domínio
    if (sender.balance < amount) {
      throw new InsufficientFundsError(sender.id, amount)
    }
    if (sender.frozen || receiver.frozen) {
      throw new AccountFrozenError()
    }

    // 3. Atualiza saldos atomicamente
    await tx.account.update({
      where: { id: senderId },
      data: { balance: { decrement: amount } },
    })
    await tx.account.update({
      where: { id: receiverId },
      data: { balance: { increment: amount } },
    })

    // 4. Audit trail dentro da mesma transação
    return tx.transfer.create({
      data: {
        senderId,
        receiverId,
        amount,
        status: 'COMPLETED',
      },
    })
  }, {
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    timeout: 10000,
    maxWait: 5000,
  })
}

async getBalance(accountId: string) {
  const result = await this.prisma.account.findUniqueOrThrow({
    where: { id: accountId },
    select: { balance: true, currency: true },
  })
  return result
}
}

export class InsufficientFundsError extends Error {
constructor(public accountId: string, public attempted: number) {
  super(\`Saldo insuficiente em \${accountId} para \${attempted}\`)
}
}
export class AccountFrozenError extends Error {
constructor() { super('Conta congelada') }
}`,
      language: "typescript",
    },
    {
      title: "Cursor pagination + filtros dinâmicos com Prisma + Zod",
      description: "Endpoint de feed com paginação por cursor, filtros opcionais validados, e tipagem inferida automaticamente.",
      code: `import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

const FeedQuery = z.object({
cursor: z.string().optional(),
take: z.number().int().min(1).max(100).default(20),
status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
authorId: z.string().optional(),
search: z.string().optional(),
tag: z.string().optional(),
})

export async function getFeed(input: z.infer<typeof FeedQuery>) {
const { cursor, take, status, authorId, search, tag } = FeedQuery.parse(input)

// Where construído condicionalmente — Prisma.PostWhereInput é tipado
const where: Prisma.PostWhereInput = {
  deletedAt: null,
  ...(status && { status }),
  ...(authorId && { authorId }),
  ...(tag && { tags: { some: { name: tag } } }),
  ...(search && {
    OR: [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ],
  }),
}

const posts = await prisma.post.findMany({
  where,
  take: take + 1,                    // pega 1 extra para detectar próxima página
  skip: cursor ? 1 : 0,
  cursor: cursor ? { id: cursor } : undefined,
  orderBy: [
    { publishedAt: 'desc' },
    { id: 'desc' },                  // tiebreaker estável
  ],
  select: {
    id: true,
    slug: true,
    title: true,
    publishedAt: true,
    author: {
      select: { id: true, name: true },
    },
    tags: {
      select: { name: true },
    },
    _count: {
      select: { comments: true },
    },
  },
})

// Detecta próxima página
const hasNextPage = posts.length > take
const items = hasNextPage ? posts.slice(0, take) : posts
const nextCursor = hasNextPage ? items[items.length - 1].id : null

return { items, nextCursor, hasNextPage }
}

// Tipo retornado é inferido automaticamente — sem any
type FeedResult = Awaited<ReturnType<typeof getFeed>>`,
      language: "typescript",
    },
    {
      title: "Multi-tenancy com Prisma Client Extension",
      description: "Garante isolamento por tenant em todas as queries automaticamente, sem precisar lembrar do filtro em cada chamada.",
      code: `import { PrismaClient } from '@prisma/client'

export function tenantedPrisma(basePrisma: PrismaClient, tenantId: string) {
return basePrisma.$extends({
  query: {
    // Aplica em todos os models que tenham tenantId
    $allModels: {
      async findMany({ model, args, query }) {
        if (modelHasTenantId(model)) {
          args.where = { ...args.where, tenantId }
        }
        return query(args)
      },
      async findFirst({ model, args, query }) {
        if (modelHasTenantId(model)) {
          args.where = { ...args.where, tenantId }
        }
        return query(args)
      },
      async findUnique({ model, args, query }) {
        const result = await query(args)
        if (modelHasTenantId(model) && result && (result as any).tenantId !== tenantId) {
          return null
        }
        return result
      },
      async create({ model, args, query }) {
        if (modelHasTenantId(model)) {
          args.data = { ...args.data, tenantId }
        }
        return query(args)
      },
      async update({ model, args, query }) {
        if (modelHasTenantId(model)) {
          args.where = { ...args.where, tenantId } as any
        }
        return query(args)
      },
      async delete({ model, args, query }) {
        if (modelHasTenantId(model)) {
          args.where = { ...args.where, tenantId } as any
        }
        return query(args)
      },
    },
  },
})
}

const TENANTED_MODELS = new Set(['User', 'Post', 'Comment'])
function modelHasTenantId(model: string) {
return TENANTED_MODELS.has(model)
}

// Uso — middleware Next.js cria client por request
import { prisma as basePrisma } from '@/lib/prisma'

export async function GET(req: Request) {
const tenantId = await getTenantIdFromRequest(req)
const prisma = tenantedPrisma(basePrisma, tenantId)

// Não precisa lembrar de filtrar — o extension faz por trás
const posts = await prisma.post.findMany()  // só posts do tenant
return Response.json(posts)
}`,
      language: "typescript",
    },
  ],
  exercises: [
    {
      level: 'iniciante',
      title: "Setup Prisma + SQLite e CRUD básico de Tasks",
      description: "Crie um projeto Node.js novo, instale prisma e @prisma/client, configure SQLite (sem Docker). Defina um model Task com id (cuid), title (String), done (Boolean default false), createdAt (DateTime default now). Rode prisma migrate dev para gerar a primeira migration. Implemente um pequeno script CLI que cria, lista, marca como feita e deleta tasks. Use o Prisma Studio (npx prisma studio) para ver os dados graficamente.",
      concepts: ["schema.prisma", "prisma generate", "prisma migrate dev", "Prisma Client CRUD", "Prisma Studio"],
      hint: "datasource db { provider = \"sqlite\" url = \"file:./dev.db\" }. Para o CRUD: prisma.task.create, prisma.task.findMany, prisma.task.update({ where, data }), prisma.task.delete. Sempre await prisma.$disconnect() ao final do script.",
      relatedKeypoints: [1, 2, 4],
    },
    {
      level: 'intermediario',
      title: "Modelagem de blog com relações e seed",
      description: "Modele um blog completo: User (1:1 com Profile, 1:N com Post, 1:N com Comment), Post (N:N com Tag), Comment (auto-relação parent/replies). Defina índices apropriados (@@index em campos de filtro frequente). Crie um arquivo prisma/seed.ts que insere dados de teste — 3 users, 5 posts, 10 comments, 5 tags. Configure o package.json para rodar seed automaticamente após migrate reset. Use queries com select aninhado para listar 'posts publicados com autor, tags e contagem de comentários' em uma única query.",
      concepts: ["relations 1:1, 1:N, N:N", "auto-relação", "@@index", "@@unique", "prisma db seed", "select aninhado"],
      hint: "Para seed: \"prisma\": { \"seed\": \"tsx prisma/seed.ts\" } no package.json. Para auto-relação Comment: parentId String? + parent Comment? @relation('Replies', ...) + replies Comment[] @relation('Replies'). Use _count em select para contar relações sem trazer todos os registros.",
      relatedKeypoints: [3, 1, 2],
    },
    {
      level: 'intermediario',
      title: "Soft delete via Prisma Client Extension",
      description: "Adicione um campo deletedAt DateTime? em todos os models que devem suportar soft delete. Implemente um Prisma Client Extension que: (1) intercepta findMany, findUnique e findFirst para filtrar deletedAt: null automaticamente; (2) adiciona método softDelete(id) em cada model afetado; (3) adiciona método restore(id) que zera o deletedAt. Escreva testes verificando que: registros com deletedAt setado não aparecem em findMany, mas aparecem se usar o basePrisma direto (acesso de admin).",
      concepts: ["Prisma Client Extensions", "$extends", "query interception", "$allModels", "model methods"],
      hint: "Use $extends({ query: { user: { findMany: async ({ args, query }) => { args.where = { ...args.where, deletedAt: null }; return query(args) } } } }). Para múltiplos models, use $allModels e checagem por nome. Cuidado: extensions interceptam apenas chamadas via Prisma Client — $queryRaw bypassa.",
      relatedKeypoints: [7, 11],
    },
    {
      level: 'senior',
      title: "Transferência bancária com $transaction interativo e isolation level",
      description: "Implemente uma função transfer(senderId, receiverId, amount) que faz transferência atômica entre contas. Requisitos: (1) usar $transaction interativo com isolationLevel Serializable; (2) lock pessimista das duas contas com SELECT FOR UPDATE (use $queryRaw); (3) lock sempre na mesma ordem (id menor primeiro) para evitar deadlock; (4) validar saldo suficiente e contas não congeladas; (5) registrar audit trail na mesma transação; (6) timeout de 10s. Escreva testes que reproduzam: transferência simples ok, saldo insuficiente, conta congelada, deadlock prevenido com 1000 transferências paralelas.",
      concepts: ["$transaction interactive", "isolationLevel Serializable", "SELECT FOR UPDATE", "$queryRaw", "deadlock prevention", "audit trail atômico"],
      hint: "const [firstId, secondId] = [senderId, receiverId].sort() — ordena para sempre adquirir locks na mesma ordem. await tx.$queryRaw\\`SELECT * FROM accounts WHERE id IN (\\${firstId}, \\${secondId}) FOR UPDATE\\`. NUNCA use o prisma global dentro do callback — sempre tx. Para teste de deadlock: rode 1000 transfer(A,B) e transfer(B,A) em paralelo com Promise.all.",
      relatedKeypoints: [5, 6],
    },
    {
      level: 'senior',
      title: "API Next.js edge com Prisma Accelerate",
      description: "Migre uma API Next.js existente que usa Prisma para rodar em edge runtime com Prisma Accelerate. Configure conta no Prisma Data Platform, troque o DATABASE_URL para o connection string do Accelerate, mantenha DIRECT_URL apontando para o banco real (necessário para migrate). Refatore os route handlers para usar @prisma/client/edge + withAccelerate. Adicione cacheStrategy nos endpoints de leitura pública (TTL 60s + SWR 30s). Compare a latência cold start antes (Node.js runtime) e depois (edge): meça com curl em uma região distante. Documente os custos por query no Accelerate dashboard.",
      concepts: ["edge runtime", "Prisma Accelerate", "withAccelerate", "cacheStrategy", "DIRECT_URL", "cold start"],
      hint: "export const runtime = 'edge' no route handler. const prisma = new PrismaClient().$extends(withAccelerate()). cacheStrategy: { ttl: 60, swr: 30 } — só funciona em queries de leitura. Para migrations continuar funcionando, configure DIRECT_URL no schema: directUrl = env(\"DIRECT_URL\"). Curl com -w para medir tempo: curl -w \"%{time_total}\\n\" -o /dev/null URL.",
      relatedKeypoints: [11, 9],
    },
  ],
  mnemonics: [
    {
      label: "PIPELINE — schema → generate → migrate → use",
      trick: "Schema → Generate → Migrate → Client",
      explanation: "Sempre nessa ordem. Edita schema.prisma, roda prisma migrate dev (que internamente faz o diff e gera + aplica + regenera o client). Em produção a sequência é diferente: prisma generate no build, prisma migrate deploy antes do app subir.",
    },
    {
      label: "DEV vs DEPLOY — duas faces do migrate",
      trick: "dev = gera + aplica + gera client · deploy = só aplica",
      explanation: "migrate dev é interativo, gera novas migrations, regenera client — nunca em produção. migrate deploy é idempotente, só aplica migrations já versionadas em ordem — esse é o comando do CI/CD. db push existe mas só para protótipos descartáveis.",
    },
    {
      label: "SELECT vs INCLUDE — whitelist vs blacklist",
      trick: "select = só os campos pedidos · include = tudo + relações",
      explanation: "select restringe — tipo retornado encolhe para conter só os campos pedidos. include adiciona relações sem omitir campos do tipo base. Não pode usar os dois na mesma query — para combinar, aninhe select dentro de select.",
    },
    {
      label: "TX — sempre use o tx, nunca o prisma global",
      trick: "$transaction(async (tx) => { use tx, NEVER prisma })",
      explanation: "Dentro do callback de $transaction interativo, qualquer chamada que use o prisma global (não o tx recebido) executa fora da transação. Isso é o erro número 1 de transações em Prisma e gera bugs sutis de consistência.",
    },
  ],
  videos: [
    { title: "Prisma in 100 Seconds", channel: "Fireship", url: "https://www.youtube.com/results?search_query=prisma+in+100+seconds+fireship", topic: "visão geral", note: "Modelo mental rápido antes de aprofundar." },
    { title: "Prisma Crash Course — Full Tutorial", channel: "Web Dev Simplified", url: "https://www.youtube.com/results?search_query=prisma+crash+course+web+dev+simplified", topic: "fundamentos", note: "Schema, Client e migrations em projeto realista." },
    { title: "Prisma Migrate — Production Workflow", channel: "Prisma", url: "https://www.youtube.com/results?search_query=prisma+migrate+production+workflow", topic: "migrations", note: "migrate dev vs deploy, CI/CD, edge cases." },
    { title: "Prisma Client Extensions Deep Dive", channel: "Prisma", url: "https://www.youtube.com/results?search_query=prisma+client+extensions", topic: "extensions", note: "Soft delete, multi-tenancy, computed fields." },
    { title: "Prisma vs Drizzle — Honest Comparison", channel: "Theo - t3.gg", url: "https://www.youtube.com/results?search_query=prisma+vs+drizzle+theo", topic: "comparativo", note: "Tradeoffs práticos, edge runtime, performance." },
    { title: "Prisma Accelerate Explained", channel: "Prisma", url: "https://www.youtube.com/results?search_query=prisma+accelerate+explained", topic: "Accelerate", note: "Edge runtime, connection pooling global, cache distribuído." },
  ],
  resources: [
    { title: "Prisma Docs — Getting Started", url: "https://www.prisma.io/docs/getting-started", kind: "docs" },
    { title: "Prisma Schema Reference", url: "https://www.prisma.io/docs/orm/reference/prisma-schema-reference", kind: "docs" },
    { title: "Prisma Client Reference", url: "https://www.prisma.io/docs/orm/reference/prisma-client-reference", kind: "docs" },
    { title: "Prisma Data Guide", url: "https://www.prisma.io/dataguide/", kind: "artigo" },
    { title: "Prisma Migrate — Production Guide", url: "https://www.prisma.io/docs/orm/prisma-migrate/getting-started", kind: "docs" },
    { title: "Prisma Client Extensions", url: "https://www.prisma.io/docs/orm/prisma-client/client-extensions", kind: "docs" },
    { title: "Prisma Accelerate", url: "https://www.prisma.io/docs/accelerate", kind: "docs" },
    { title: "Prisma Pulse — CDC", url: "https://www.prisma.io/docs/pulse", kind: "docs" },
    { title: "Drizzle ORM (alternativa)", url: "https://orm.drizzle.team/", kind: "docs" },
    { title: "Prisma Examples (GitHub)", url: "https://github.com/prisma/prisma-examples", kind: "pratica" },
    { title: "Prisma Best Practices — Vercel guide", url: "https://vercel.com/guides/nextjs-prisma-postgres", kind: "artigo" },
    { title: "Prisma Slack Community", url: "https://slack.prisma.io/", kind: "pratica" },
  ],
}

export default prisma
