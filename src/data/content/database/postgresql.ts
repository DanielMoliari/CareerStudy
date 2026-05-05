import type { SkillContent } from '@/types'

const postgresql: SkillContent = {
  tagline: "Banco relacional open-source líder: ACID, JSONB, extensões e escala vertical impressionante.",
  why: "Postgres é o banco default de produto moderno. Sênior precisa dominar MVCC, todos os tipos de índice, EXPLAIN ANALYZE, particionamento, connection pooling, JSONB, CTEs, window functions e saber exatamente quando sair do Postgres. É o banco mais frequentemente cobrado em entrevistas de backend pleno/sênior no Brasil e no mundo.",
  prerequisite: "SQL básico (SELECT, INSERT, UPDATE, DELETE, JOIN, GROUP BY), conceitos de ACID, noção de índice como estrutura de aceleração de busca. Não precisa saber administração de banco antes — esses conceitos são construídos aqui.",
  summary: "PostgreSQL é o SGBD open-source mais avançado do mundo. Suporta ACID completo, tipos avançados (JSONB, arrays, ranges, geometria, enums), extensibilidade via extensões (pgvector, PostGIS, TimescaleDB, pg_trgm), replicação lógica, particionamento nativo, full-text search integrado e performance que aguenta TBs com os índices certos.\n\nO coração do Postgres é o MVCC: cada transação vê um snapshot consistente sem bloquear outras transações. Isso significa que leituras não bloqueiam escritas e vice-versa — fundamental para sistemas concorrentes. O preço do MVCC é a necessidade de VACUUM para limpar versões mortas (dead tuples).\n\nO query planner é extremamente sofisticado: usa estatísticas de distribuição de dados (pg_statistic) para escolher o plano ótimo entre Seq Scan, Index Scan, Bitmap Heap Scan, Nested Loop, Hash Join, Merge Join. EXPLAIN ANALYZE revela o plano escolhido e os tempos reais.\n\nExtensões são o grande diferencial: pgvector para embeddings e RAG, PostGIS para dados geoespaciais, TimescaleDB para séries temporais, pg_trgm para LIKE rápido e full-text, pg_partman para particionamento automatizado, pg_repack para desfragmentação sem lock. O Postgres funciona como plataforma, não só como banco.",
  howToStudy: "<strong>30 minutos antes de entrevista?</strong> Revise os 3 diagramas, varra os gotchas e treine as Q&As de nível pleno. Se sobrar tempo, passe pelas de sênior.<br><br><strong>Fim de semana?</strong> Leia todos os keypoints com um psql aberto ao lado — reproduza cada snippet. Execute EXPLAIN ANALYZE em queries reais para ver os planos. Depois resolva os exercícios de iniciante.<br><br><strong>Uma semana?</strong> Siga a sequência completa. Ao terminar os keypoints e exercícios, configure um Postgres local com pg_stat_statements ativo e analise queries reais do seu projeto atual.",
  diagrams: [
    {
      title: "Arquitetura do PostgreSQL — processos e memória",
      html: `<style>
.pgarch-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.pgarch-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(51,103,145,.7);display:inline}
.pgarch-tip:hover .pgarch-tb{display:block}
.pgarch-tb{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:230px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.pgarch-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.pgarch-proc{background:#1e293b;border:1.5px solid #336791;border-radius:8px;padding:10px 14px;font-size:11px}
.pgarch-proc-title{color:#5b9bd5;font-weight:700;font-size:12px;margin-bottom:4px}
.pgarch-mem{background:#0d1117;border:1.5px solid #334155;border-radius:8px;padding:10px 14px;font-size:11px;color:#64748b}
.pgarch-mem-title{color:#94a3b8;font-weight:700;font-size:11px;margin-bottom:4px}
@keyframes pgarch-pulse{0%,100%{opacity:.6}50%{opacity:1}}
.pgarch-active{animation:pgarch-pulse 2s ease-in-out infinite}
</style>
<div class="pgarch-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Arquitetura do PostgreSQL — processos e memória</p>
<p style="color:#475569;font-size:10px;margin:0 0 18px">Passe o mouse nos termos <span style="border-bottom:1px dashed rgba(51,103,145,.7)">sublinhados</span> para ver detalhes</p>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
  <div class="pgarch-proc">
    <div class="pgarch-proc-title"><span class="pgarch-tip">Postmaster<span class="pgarch-tb">Processo pai principal. Escuta conexões TCP na porta 5432. Para cada nova conexão, faz fork() de um Backend Process. Monitora filhos e reinicia se falham.</span></span></div>
    <div style="color:#64748b;font-size:10px;line-height:1.5">PID 1 do Postgres<br>Accept + fork de backends</div>
  </div>
  <div class="pgarch-proc">
    <div class="pgarch-proc-title"><span class="pgarch-tip">Backend Process<span class="pgarch-tb">Um processo por conexão de cliente. Parse → Plan → Execute da query. Lê/escreve no Shared Buffer Pool. Grava WAL antes de modificar dados (Write-Ahead Logging). Processo isolado — crash não derruba outros.</span></span></div>
    <div style="color:#64748b;font-size:10px;line-height:1.5">1 por conexão de cliente<br>Parse → Plan → Execute</div>
  </div>
  <div class="pgarch-proc">
    <div class="pgarch-proc-title"><span class="pgarch-tip">WAL Writer<span class="pgarch-tb">Escreve registros do WAL (Write-Ahead Log) em disco periodicamente. WAL é gravado ANTES dos dados — garante durabilidade. Em caso de crash, o recovery replaya o WAL para reconstruir o estado consistente.</span></span></div>
    <div style="color:#64748b;font-size:10px;line-height:1.5">Grava WAL em disco<br>Durabilidade pré-commit</div>
  </div>
  <div class="pgarch-proc">
    <div class="pgarch-proc-title"><span class="pgarch-tip">Checkpointer<span class="pgarch-tb">Periodicamente força todos os dirty pages (modificados no buffer pool) para disco. Garante que recovery após crash não precise replayar WAL muito antigo. Frequência controlada por checkpoint_timeout e max_wal_size.</span></span></div>
    <div style="color:#64748b;font-size:10px;line-height:1.5">Flush de dirty pages<br>Limita WAL replay no crash</div>
  </div>
  <div class="pgarch-proc">
    <div class="pgarch-proc-title"><span class="pgarch-tip">BGWriter<span class="pgarch-tb">Background Writer — escreve páginas sujas do buffer pool em disco proativamente, antes que o backend precise de espaço urgente. Reduz a latência dos backends ao evitar que eles precisem fazer I/O síncronos para liberar buffers.</span></span></div>
    <div style="color:#64748b;font-size:10px;line-height:1.5">Escrita background de buffers<br>Reduz latência do backend</div>
  </div>
  <div class="pgarch-proc">
    <div class="pgarch-proc-title"><span class="pgarch-tip">Autovacuum<span class="pgarch-tb">Roda VACUUM e ANALYZE automaticamente nas tabelas que acumularam dead tuples ou estatísticas desatualizadas. Lançadores (autovacuum launcher) coordenam workers. Configurável por tabela com storage parameters. Crítico para saúde do banco.</span></span></div>
    <div style="color:#64748b;font-size:10px;line-height:1.5">VACUUM + ANALYZE automáticos<br>Coleta de lixo do MVCC</div>
  </div>
</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
  <div class="pgarch-mem">
    <div class="pgarch-mem-title"><span class="pgarch-tip">Shared Buffer Pool<span class="pgarch-tb">Cache de páginas de disco compartilhado entre todos os backends. Tamanho controlado por shared_buffers (padrão 128MB, recomendado 25% da RAM). Hit ratio deve ser > 99% em workloads OLTP normais — verificar via pg_statio_user_tables.</span></span></div>
    <div style="font-size:10px;line-height:1.5">Cache de páginas em memória<br><span style="color:#336791">shared_buffers</span> (default 128MB)</div>
  </div>
  <div class="pgarch-mem">
    <div class="pgarch-mem-title"><span class="pgarch-tip">WAL Buffer<span class="pgarch-tb">Buffer em memória para os registros de WAL antes de serem escritos em disco. Pequeno (wal_buffers, default 64KB auto). Na prática, o WAL é sempre durável porque o commit faz fsync do WAL buffer para o WAL file antes de confirmar.</span></span></div>
    <div style="font-size:10px;line-height:1.5">Buffer do WAL antes do fsync<br><span style="color:#336791">wal_buffers</span> (auto)</div>
  </div>
  <div class="pgarch-mem">
    <div class="pgarch-mem-title"><span class="pgarch-tip">Work Mem<span class="pgarch-tb">Memória por operação de Sort ou Hash (não por query total). Uma query pode ter múltiplos nodes Sort e Hash — cada um usa até work_mem. Com muitos backends concorrentes, o consumo total pode ser work_mem × sorts × backends. Aumentar resolve Hash Join spill to disk.</span></span></div>
    <div style="font-size:10px;line-height:1.5">Por Sort/Hash por backend<br><span style="color:#336791">work_mem</span> (default 4MB)</div>
  </div>
  <div class="pgarch-mem">
    <div class="pgarch-mem-title"><span class="pgarch-tip">Maintenance Work Mem<span class="pgarch-tb">Memória para operações de manutenção: VACUUM, CREATE INDEX, ALTER TABLE. Pode ser muito maior que work_mem sem risco — só uma operação de manutenção por vez normalmente. Valores maiores aceleram drasticamente o CREATE INDEX.</span></span></div>
    <div style="font-size:10px;line-height:1.5">Para VACUUM e CREATE INDEX<br><span style="color:#336791">maintenance_work_mem</span></div>
  </div>
</div>
<div style="background:#1e293b;border-radius:8px;padding:12px 14px;font-size:11px;color:#64748b;border:1px solid #1e3a5f">
  <span style="color:#5b9bd5;font-weight:700">Fluxo de uma query:</span> Cliente conecta → Postmaster faz fork → Backend recebe query → Parser + Planner → Executor lê Shared Buffers (cache hit) ou disco (cache miss) → Resultado retorna ao cliente. Se é escrita: WAL gravado primeiro (durabilidade), depois shared buffer atualizado (dirty page), BGWriter/Checkpointer persistem em disco assincronamente.
</div>
</div>`,
      caption: "O Postgres usa processos (não threads) por conexão. Isso garante isolamento — um backend travado não derruba outros. O custo é overhead de fork e memória por processo, daí a necessidade de connection pooling.",
    },
    {
      title: "Tipos de índice no PostgreSQL — quando usar cada um",
      html: `<style>
.pgidx-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.pgidx-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(51,103,145,.7);display:inline}
.pgidx-tip:hover .pgidx-tb{display:block}
.pgidx-tb{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:230px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.pgidx-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.pgidx-card{background:#1e293b;border-radius:10px;padding:14px;border-left:3px solid}
.pgidx-name{font-size:13px;font-weight:700;margin-bottom:6px}
.pgidx-badge{display:inline-block;font-size:9px;padding:2px 7px;border-radius:4px;margin-bottom:8px;font-weight:600;letter-spacing:.05em}
.pgidx-row{display:flex;gap:6px;margin-top:4px;flex-wrap:wrap}
.pgidx-tag{background:#0f172a;border:1px solid #334155;border-radius:4px;padding:3px 8px;font-size:10px;color:#64748b}
.pgidx-good{color:#22c55e}
.pgidx-warn{color:#f59e0b}
.pgidx-bad{color:#ef4444}
</style>
<div class="pgidx-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Tipos de índice no PostgreSQL — quando usar cada um</p>
<p style="color:#475569;font-size:10px;margin:0 0 16px">Passe o mouse nos nomes de índice para ver detalhes internos</p>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
  <div class="pgidx-card" style="border-color:#5b9bd5">
    <div class="pgidx-name" style="color:#5b9bd5"><span class="pgidx-tip">B-Tree<span class="pgidx-tb">Árvore B+ balanceada. Folhas duplamente ligadas (excelente para range scan). Suporta igualdade, range (&lt;, &gt;, BETWEEN), prefix LIKE ('abc%'), IS NULL, ORDER BY. Default do CREATE INDEX. Funciona com a maioria dos tipos de dado.</span></span></div>
    <div class="pgidx-badge" style="background:rgba(91,155,213,.15);color:#5b9bd5">DEFAULT — use como ponto de partida</div>
    <div class="pgidx-row">
      <span class="pgidx-tag">igualdade =</span>
      <span class="pgidx-tag">range &lt; &gt; BETWEEN</span>
      <span class="pgidx-tag">ORDER BY</span>
      <span class="pgidx-tag">prefix LIKE 'abc%'</span>
      <span class="pgidx-tag">IS NULL</span>
    </div>
    <div style="margin-top:8px;font-size:10px;color:#475569">Ex: índice em created_at, user_id, status</div>
  </div>
  <div class="pgidx-card" style="border-color:#a855f7">
    <div class="pgidx-name" style="color:#a855f7"><span class="pgidx-tip">GIN — Generalized Inverted Index<span class="pgidx-tb">Índice invertido: mapeia cada elemento/chave para os documentos que o contêm. Ideal para dados que são "coleções": arrays, JSONB, vetores de full-text (tsvector). Mais lento para escrever, mais rápido para busca em qualquer chave do conjunto.</span></span></div>
    <div class="pgidx-badge" style="background:rgba(168,85,247,.15);color:#a855f7">Para JSONB, arrays, full-text</div>
    <div class="pgidx-row">
      <span class="pgidx-tag">JSONB @&gt; {}</span>
      <span class="pgidx-tag">arrays &amp;&amp; @&gt;</span>
      <span class="pgidx-tag">tsvector @@</span>
      <span class="pgidx-tag">pg_trgm LIKE '%abc%'</span>
    </div>
    <div style="margin-top:8px;font-size:10px;color:#475569">Ex: CREATE INDEX ON produtos USING gin(atributos)</div>
  </div>
  <div class="pgidx-card" style="border-color:#22c55e">
    <div class="pgidx-name" style="color:#22c55e"><span class="pgidx-tip">GiST — Generalized Search Tree<span class="pgidx-tb">Framework extensível para índices de tipos complexos. Suporta geometria (PostGIS), range types, full-text. Permite sobreposição de valores — diferente do B-Tree que só compara igualdade/ordem simples. Base para índices de proximidade geoespacial.</span></span></div>
    <div class="pgidx-badge" style="background:rgba(34,197,94,.15);color:#22c55e">Geometria, ranges, tipos customizados</div>
    <div class="pgidx-row">
      <span class="pgidx-tag">PostGIS ST_DWithin</span>
      <span class="pgidx-tag">tsrange &amp;&amp;</span>
      <span class="pgidx-tag">tsvector @@</span>
      <span class="pgidx-tag">proximidade</span>
    </div>
    <div style="margin-top:8px;font-size:10px;color:#475569">Ex: busca de lojas em raio de 5km</div>
  </div>
  <div class="pgidx-card" style="border-color:#f59e0b">
    <div class="pgidx-name" style="color:#f59e0b"><span class="pgidx-tip">BRIN — Block Range Index<span class="pgidx-tb">Armazena min/max por bloco físico da tabela. Minúsculo (poucos KB mesmo em tabelas de TB). Só funciona se os dados estão fisicamente ordenados na tabela — correlação entre valor e posição física deve ser alta. Ideal para timestamps em tabelas append-only.</span></span></div>
    <div class="pgidx-badge" style="background:rgba(245,158,11,.15);color:#f59e0b">Tabelas grandes, append-only, ordenadas</div>
    <div class="pgidx-row">
      <span class="pgidx-tag">created_at em logs</span>
      <span class="pgidx-tag">sensor readings</span>
      <span class="pgidx-tag">IDs sequenciais</span>
    </div>
    <div style="margin-top:8px;font-size:10px;color:#475569">Tamanho: ~1000x menor que B-Tree equivalente</div>
  </div>
  <div class="pgidx-card" style="border-color:#ef4444">
    <div class="pgidx-name" style="color:#ef4444"><span class="pgidx-tip">Hash<span class="pgidx-tb">Hash table de chave → ponteiro. Suporta SOMENTE igualdade exata (=). Mais rápido que B-Tree para igualdade em chaves muito longas (strings grandes). Não suporta range, ORDER BY, prefix LIKE. Antes do Postgres 10 não era WAL-logged (arriscado). Uso raramente justificado.</span></span></div>
    <div class="pgidx-badge" style="background:rgba(239,68,68,.15);color:#ef4444">Só igualdade exata — raramente necessário</div>
    <div class="pgidx-row">
      <span class="pgidx-tag">somente =</span>
      <span class="pgidx-tag">chaves muito longas</span>
    </div>
    <div style="margin-top:8px;font-size:10px;color:#475569">Na dúvida: use B-Tree (suporta tudo)</div>
  </div>
  <div class="pgidx-card" style="border-color:#64748b">
    <div class="pgidx-name" style="color:#94a3b8">Índices especiais</div>
    <div class="pgidx-badge" style="background:rgba(100,116,139,.15);color:#64748b">Parcial + Expressão + Coberto</div>
    <div style="font-size:10px;color:#64748b;line-height:1.7;margin-top:6px">
      <span class="pgidx-tip" style="border-color:rgba(100,116,139,.5)">Parcial<span class="pgidx-tb">WHERE no CREATE INDEX. Índice só cobre linhas que satisfazem o predicado — muito menor e mais seletivo. Ex: CREATE INDEX ON pedidos(status) WHERE status != 'concluido' (só pedidos ativos)</span></span>: WHERE status = 'ativo'<br>
      <span class="pgidx-tip" style="border-color:rgba(100,116,139,.5)">Expressão<span class="pgidx-tb">Índice no resultado de uma função ou expressão, não na coluna bruta. Ex: CREATE INDEX ON users(lower(email)) — queries com lower(email) = 'abc@x.com' usam o índice.</span></span>: lower(email)<br>
      <span class="pgidx-tip" style="border-color:rgba(100,116,139,.5)">Coberto (INCLUDE)<span class="pgidx-tb">INCLUDE adiciona colunas extras ao índice sem indexá-las — Index Only Scan pode retornar esses campos sem ir à heap. Ex: CREATE INDEX ON orders(user_id) INCLUDE (status, total) — SELECT status, total FROM orders WHERE user_id = X não toca a heap.</span></span>: INCLUDE (col1, col2)
    </div>
  </div>
</div>
<div style="background:#1e293b;border-radius:8px;padding:12px 14px;font-size:11px;color:#64748b;border:1px solid #1e3a5f;line-height:1.7">
  <span style="color:#5b9bd5;font-weight:700">Regra de ouro:</span> comece sempre com B-Tree. Use GIN para JSONB/arrays/full-text. Use BRIN para tabelas de log com timestamp natural. Índice parcial é o truque mais subestimado — reduz tamanho e aumenta seletividade. INCLUDE transforma um Index Scan num Index Only Scan (sem acesso à heap).
</div>
</div>`,
      caption: "A escolha do tipo de índice pode ser a diferença entre uma query de 10ms e 10 segundos. Na maioria dos casos B-Tree resolve, mas conhecer os outros evita erros clássicos como usar B-Tree em JSONB.",
    },
    {
      title: "Write path no PostgreSQL — do INSERT ao disco",
      html: `<style>
.pgwp-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.pgwp-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(51,103,145,.7);display:inline}
.pgwp-tip:hover .pgwp-tb{display:block}
.pgwp-tb{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:230px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.pgwp-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
@keyframes pgwp-flow{0%{opacity:0;transform:translateX(-8px)}100%{opacity:1;transform:translateX(0)}}
.pgwp-step{background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:10px 14px;animation:pgwp-flow .4s ease forwards}
.pgwp-step-title{font-size:11px;font-weight:700;margin-bottom:4px}
.pgwp-arr{color:#336791;font-size:16px;text-align:center;padding:3px 0}
.pgwp-commit{background:rgba(34,197,94,.08);border-color:rgba(34,197,94,.4);border-radius:8px;padding:12px 14px;margin-top:10px}
.pgwp-async{background:rgba(245,158,11,.06);border-color:rgba(245,158,11,.3);border-radius:8px;padding:10px 14px;margin-top:8px;font-size:10px}
</style>
<div class="pgwp-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Write path — do INSERT ao disco</p>
<p style="color:#475569;font-size:10px;margin:0 0 16px">A sequência exata que o Postgres segue para garantir durabilidade</p>
<div style="display:grid;grid-template-columns:1fr 28px 1fr;gap:0;align-items:center">
  <div>
    <div class="pgwp-step" style="border-color:#5b9bd5">
      <div class="pgwp-step-title" style="color:#5b9bd5">① Cliente envia INSERT</div>
      <div style="font-size:10px;color:#475569;line-height:1.5">Backend recebe a query. Parser valida sintaxe. Planner descobre que é insert simples. Executor executa.</div>
    </div>
    <div class="pgwp-arr">↓</div>
    <div class="pgwp-step" style="border-color:#f59e0b">
      <div class="pgwp-step-title" style="color:#f59e0b">② <span class="pgwp-tip">WAL record gerado<span class="pgwp-tb">Write-Ahead Log: log das mudanças que serão aplicadas. O WAL record descreve o que foi feito (ex: "inseriu tupla com xmin=500 na página 42"). É gravado no WAL Buffer em memória primeiro.</span></span></div>
      <div style="font-size:10px;color:#475569;line-height:1.5">Registro da operação criado em memória (WAL buffer). LSN (Log Sequence Number) atribuído — posição única no WAL.</div>
    </div>
    <div class="pgwp-arr">↓</div>
    <div class="pgwp-step" style="border-color:#a855f7">
      <div class="pgwp-step-title" style="color:#a855f7">③ <span class="pgwp-tip">Shared Buffer atualizado<span class="pgwp-tb">A página de dados é modificada no Shared Buffer Pool (memória compartilhada). A tupla recebe xmin = XID atual, xmax = 0. Página marcada como "dirty" (precisa ser escrita em disco).</span></span></div>
      <div style="font-size:10px;color:#475569;line-height:1.5">Tupla inserida na página em memória. xmin = XID da transação. Página vira "dirty page".</div>
    </div>
  </div>
  <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:4px">
    <div style="width:2px;flex:1;background:linear-gradient(#5b9bd5,#22c55e);border-radius:2px"></div>
  </div>
  <div>
    <div class="pgwp-commit" style="border:1.5px solid rgba(34,197,94,.4)">
      <div style="color:#22c55e;font-weight:700;font-size:12px;margin-bottom:8px">④ COMMIT — o momento crítico</div>
      <div style="font-size:10px;color:#64748b;line-height:1.7">
        <span class="pgwp-tip" style="border-color:rgba(34,197,94,.5)">WAL fsync<span class="pgwp-tb">fsync() garante que os WAL records chegaram ao meio físico (disco/SSD) — não ficaram em cache do SO ou do hardware. Sem fsync, um crash antes do flush perde a transação. synchronous_commit=off desabilita isso (perda possível no crash, mas muito mais rápido).</span></span> — WAL chega ao disco<br>
        XID marcado como <span class="pgwp-tip" style="border-color:rgba(34,197,94,.5)">committed<span class="pgwp-tb">O pg_xact (antes pg_clog) é atualizado com o status "committed" para este XID. A partir daqui, outras transações podem enxergar esta tupla (dependendo do isolation level). Dados estão seguros mesmo que o Postgres caia agora — o WAL permite replay.</span></span><br>
        Resposta "OK" ao cliente<br>
        <span style="color:#22c55e;font-weight:600">Dado é durável a partir daqui</span>
      </div>
    </div>
    <div class="pgwp-async" style="border:1.5px solid rgba(245,158,11,.3)">
      <div style="color:#f59e0b;font-weight:700;font-size:11px;margin-bottom:6px">⑤ Assincrono — após o commit</div>
      <div style="font-size:10px;color:#64748b;line-height:1.7">
        <span class="pgwp-tip" style="border-color:rgba(245,158,11,.5)">BGWriter<span class="pgwp-tb">Escreve dirty pages do shared buffer pool para o data file em disco. Faz isso proativamente em segundo plano. Se o buffer pool ficar cheio antes, o backend é forçado a escrever ele mesmo (checkpoint urgente).</span></span> escreve dirty pages para data files<br>
        <span class="pgwp-tip" style="border-color:rgba(245,158,11,.5)">Checkpointer<span class="pgwp-tb">Periodicamente força todos os dirty buffers para disco e avança o ponto de checkpoint no WAL. Após o checkpoint, o WAL anterior pode ser reutilizado. Recovery após crash só precisa replayar WAL desde o último checkpoint.</span></span> avança ponto de checkpoint<br>
        WAL antigo pode ser reciclado
      </div>
    </div>
  </div>
</div>
<div style="background:#1e293b;border-radius:8px;padding:10px 14px;margin-top:12px;font-size:10px;color:#64748b;border:1px solid #1e3a5f;line-height:1.7">
  <span style="color:#5b9bd5;font-weight:700">Por que WAL primeiro?</span> Se o Postgres gravar dados antes do WAL e travar no meio, o estado no disco é inconsistente — sem como saber o que foi aplicado. Com WAL-first: mesmo que os data files estejam desatualizados, o recovery replaya o WAL do último checkpoint até o fim, garantindo consistência. Isso é a base do ACID — especificamente do D (Durability).
</div>
</div>`,
      caption: "O commit só responde ao cliente após o WAL chegar ao disco (fsync). Os dados em si podem estar só na memória nesse momento — o WAL é suficiente para recuperação em caso de crash.",
    },
  ],
  keypoints: [
    {
      title: "DDL essencial — criar tabelas com constraints corretas",
      body: "Constraints são validadas pelo banco — nunca dependa só da aplicação para integridade. NOT NULL, UNIQUE, CHECK, FOREIGN KEY, DEFAULT e GENERATED são aplicados pelo Postgres antes de qualquer dado ser persistido. Nomeie suas constraints para facilitar mensagens de erro na aplicação.",
      code: `-- Tabela bem modelada com constraints explícitas
CREATE TABLE pedidos (
id          BIGSERIAL PRIMARY KEY,
usuario_id  BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
status      TEXT NOT NULL CHECK (status IN ('pendente','pago','cancelado'))
              DEFAULT 'pendente',
total       NUMERIC(12,2) NOT NULL CHECK (total >= 0),
metadata    JSONB NOT NULL DEFAULT '{}',
criado_em   TIMESTAMPTZ NOT NULL DEFAULT now(),
atualizado  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índice na FK (Postgres não cria automaticamente!)
CREATE INDEX ON pedidos(usuario_id);
-- Índice parcial para pedidos ativos (evita indexar concluídos)
CREATE INDEX ON pedidos(criado_em) WHERE status = 'pendente';`,
    },
    {
      title: "UPSERT com INSERT ON CONFLICT",
      body: "INSERT ON CONFLICT é a forma idiomática de fazer UPSERT no Postgres. Evita race condition do padrão SELECT-then-INSERT (que pode duplicar em concorrência). ON CONFLICT DO NOTHING ignora silenciosamente. ON CONFLICT DO UPDATE permite atualizar campos específicos. Pode referenciar a nova linha com EXCLUDED.",
      code: `-- UPSERT: insert ou update se já existe (por email único)
INSERT INTO usuarios (email, nome, ultimo_login)
VALUES ('joao@ex.com', 'João', now())
ON CONFLICT (email)
DO UPDATE SET
nome = EXCLUDED.nome,
ultimo_login = now(),
versao = usuarios.versao + 1
WHERE usuarios.ultimo_login < now() - INTERVAL '1 hour';

-- DO NOTHING: ignora silenciosamente se já existe
INSERT INTO tags (nome)
VALUES ('postgresql'), ('database')
ON CONFLICT (nome) DO NOTHING
RETURNING id, nome;`,
    },
    {
      title: "CTEs — Common Table Expressions",
      body: "CTEs (WITH) tornam queries complexas legíveis ao dar nomes intermediários a subresultados. CTEs básicas são otimizadas pelo planner como subqueries. CTEs recursivas (WITH RECURSIVE) permitem consultar hierarquias como árvores e grafos. CTEs de escrita (INSERT/UPDATE/DELETE dentro de WITH) permitem operações encadeadas atômicas.",
      code: `-- CTE simples: total por usuário com rank
WITH totais AS (
SELECT usuario_id, SUM(total) AS soma
FROM pedidos WHERE status = 'pago'
GROUP BY usuario_id
),
ranking AS (
SELECT *, RANK() OVER (ORDER BY soma DESC) AS pos
FROM totais
)
SELECT u.nome, r.soma, r.pos
FROM ranking r JOIN usuarios u ON u.id = r.usuario_id
WHERE r.pos <= 10;

-- CTE recursiva: hierarquia de categorias
WITH RECURSIVE arvore AS (
SELECT id, nome, pai_id, 0 AS nivel FROM categorias WHERE pai_id IS NULL
UNION ALL
SELECT c.id, c.nome, c.pai_id, a.nivel + 1
FROM categorias c JOIN arvore a ON c.pai_id = a.id
)
SELECT * FROM arvore ORDER BY nivel, nome;`,
    },
    {
      title: "Window functions — analytics sem GROUP BY",
      body: "Window functions calculam sobre um conjunto de linhas relacionadas à linha atual sem colapsar o resultado (diferente de GROUP BY). A cláusula OVER define a janela: PARTITION BY (grupos), ORDER BY (ordem dentro do grupo), ROWS/RANGE (limites da janela). ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, FIRST_VALUE, LAST_VALUE, NTILE, SUM/AVG cumulativos.",
      code: `-- ROW_NUMBER: paginação estável sem OFFSET
SELECT * FROM (
SELECT id, nome, criado_em,
  ROW_NUMBER() OVER (ORDER BY criado_em DESC, id DESC) AS rn
FROM produtos
) t WHERE rn BETWEEN 21 AND 40;

-- LAG/LEAD: variação dia a dia
SELECT
data,
receita,
LAG(receita) OVER (ORDER BY data) AS ontem,
receita - LAG(receita) OVER (ORDER BY data) AS variacao,
ROUND(100.0 * (receita - LAG(receita) OVER (ORDER BY data))
      / NULLIF(LAG(receita) OVER (ORDER BY data), 0), 1) AS pct
FROM metricas_diarias ORDER BY data;

-- PARTITION BY: ranking dentro de categoria
SELECT categoria, produto, preco,
RANK() OVER (PARTITION BY categoria ORDER BY preco DESC) AS rank_cat
FROM produtos;`,
    },
    {
      title: "JSONB — schema flexível com queries poderosas",
      body: "JSONB armazena JSON em formato binário decompostando para acesso eficiente a campos. Operadores: -> (campo como JSON), ->> (campo como texto), @> (contém), ? (chave existe), #> (caminho). GIN index no campo JSONB inteiro acelera @> e ?. Índice de expressão em campo específico acelera consultas repetidas.",
      code: `-- Operadores JSONB
SELECT
dados->>'nome'                   AS nome,      -- texto
dados->'endereco'->>'cidade'     AS cidade,    -- nested
dados#>>'{contato,telefone}'     AS telefone,  -- path array
dados @> '{"plano":"pro"}'       AS eh_pro,    -- contém
dados ? 'cpf'                    AS tem_cpf    -- chave existe
FROM clientes;

-- GIN index para @> e ?
CREATE INDEX ON clientes USING gin(dados);

-- Índice de expressão para campo consultado frequentemente
CREATE INDEX ON clientes((dados->>'email'));
SELECT * FROM clientes WHERE dados->>'email' = 'a@b.com'; -- usa o índice

-- JSONB_SET para atualizar campo específico sem sobrescrever tudo
UPDATE clientes
SET dados = jsonb_set(dados, '{plano}', '"enterprise"', true)
WHERE id = 42;`,
    },
    {
      title: "EXPLAIN ANALYZE — ler e interpretar planos",
      body: "EXPLAIN mostra o plano estimado. EXPLAIN (ANALYZE, BUFFERS) executa e mostra tempos reais e cache hits. Leia de dentro para fora: o nó mais indentado executa primeiro. Procure: Seq Scan em tabela grande com filtro seletivo (falta índice), rows estimados muito diferentes dos reais (rode ANALYZE), Nested Loop com loops altos (falta índice no inner), Hash Join com spill to disk (aumente work_mem).",
      code: `-- Flags do EXPLAIN
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT) -- diagnóstico padrão
SELECT * FROM pedidos p
JOIN usuarios u ON u.id = p.usuario_id
WHERE p.status = 'pendente' AND p.criado_em > now() - INTERVAL '7 days';

-- O que procurar no output:
-- Seq Scan on pedidos (cost=0..45000 rows=50000 ...)
--   Filter: (status = 'pendente')
--   Rows Removed by Filter: 48000  ← 96% filtrados = índice parcial resolve
--
-- actual rows=4987 vs rows=200 ← estimativa errada, rode ANALYZE
--
-- Buffers: shared hit=1200 read=3800  ← read alto = cache miss, aumentar shared_buffers

-- FORMAT JSON: para usar com explain.dalibo.com
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT ...`,
    },
    {
      title: "VACUUM, bloat e manutenção",
      body: "MVCC não apaga dados fisicamente — só marca xmax. Dead tuples acumulam até VACUUM limpar. AUTOVACUUM roda automaticamente mas pode estar mal configurado em tabelas de alta escrita. Monitore bloat via pgstattuple ou queries em pg_stat_user_tables. VACUUM FULL devolve espaço ao OS mas bloqueia a tabela — use pg_repack em produção.",
      code: `-- Verificar status do autovacuum por tabela
SELECT relname,
n_live_tup, n_dead_tup,
ROUND(100.0 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0), 1) AS pct_dead,
last_autovacuum, last_autoanalyze
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC LIMIT 20;

-- Forçar VACUUM ANALYZE em tabela específica (não bloqueia)
VACUUM ANALYZE pedidos;

-- Ajuste fino por tabela (alta escrita → autovacuum mais agressivo)
ALTER TABLE eventos SET (
autovacuum_vacuum_scale_factor = 0.01,  -- padrão: 0.2
autovacuum_analyze_scale_factor = 0.01  -- padrão: 0.1
);

-- XID wraparound: verificar risco
SELECT datname, age(datfrozenxid) AS xid_age,
2^31 - age(datfrozenxid) AS xids_restantes
FROM pg_database ORDER BY xid_age DESC;`,
    },
    {
      title: "Connection pooling com PgBouncer",
      body: "Postgres usa um processo por conexão — ~10MB de RAM cada. Mais de 200 conexões simultâneas degrada performance (context switching, memória). PgBouncer faz proxy de conexões: aplicação conecta ao PgBouncer (leve), PgBouncer reutiliza um pool pequeno de conexões reais ao Postgres. Modos: session (1 conexão Postgres por sessão), transaction (compartilha entre transactions — mais eficiente, não suporta prepared statements stateful), statement.",
      code: `-- pgbouncer.ini: configuração básica
[databases]
meuapp = host=localhost port=5432 dbname=meuapp

[pgbouncer]
pool_mode = transaction      -- mais eficiente, mas sem prepared statements
max_client_conn = 10000      -- conexões da aplicação (leve, só TCP)
default_pool_size = 25       -- conexões reais ao Postgres por database/user
min_pool_size = 5
reserve_pool_size = 5
reserve_pool_timeout = 3

-- Verificar conexões no Postgres (o que o banco realmente vê)
SELECT count(*), state, wait_event_type, wait_event
FROM pg_stat_activity
WHERE datname = 'meuapp'
GROUP BY state, wait_event_type, wait_event;

-- Regra geral: max_connections no Postgres = max_pool_size × n_workers + 10`,
    },
    {
      title: "Pagination com cursor — escalável além do OFFSET",
      body: "OFFSET n é O(n): Postgres precisa buscar e descartar n linhas antes de retornar. Na página 1000 com 20 items, são 20.000 linhas varridas. Cursor-based pagination usa a última chave vista como âncora — a query sempre usa o índice diretamente, sem scan completo. Requer coluna ordenável e estável (id, created_at + id como tiebreaker).",
      code: `-- OFFSET: cresce em O(n) — lento em páginas profundas
SELECT * FROM posts ORDER BY criado_em DESC LIMIT 20 OFFSET 10000; -- varre 10020 linhas!

-- Cursor-based: sempre O(log n) via índice
-- Primeira página
SELECT id, titulo, criado_em FROM posts
ORDER BY criado_em DESC, id DESC LIMIT 20;

-- Próximas páginas (cursor = {criado_em, id} da última linha)
SELECT id, titulo, criado_em FROM posts
WHERE (criado_em, id) < ($1_criado_em, $1_id)  -- valores do cursor
ORDER BY criado_em DESC, id DESC LIMIT 20;

-- Índice que cobre essa query
CREATE INDEX ON posts(criado_em DESC, id DESC);

-- INCLUDE para Index Only Scan (sem acesso à heap)
CREATE INDEX ON posts(criado_em DESC, id DESC) INCLUDE (titulo);`,
    },
    {
      title: "Advisory locks — coordenação sem tabela de locks",
      body: "Advisory locks são locks gerenciados pelo Postgres mas com semântica definida pela aplicação. Perfeitos para tarefas de background que não devem rodar em paralelo (cron jobs, processamento de fila). Não bloqueiam tabelas. pg_try_advisory_lock não bloqueia — retorna false se lock não disponível. Liberados automaticamente ao fim da sessão.",
      code: `-- Tenta adquirir lock; se já está em uso, retorna false
-- Ideal para garantir que só 1 worker roda por vez
DO $$
BEGIN
IF pg_try_advisory_lock(12345) THEN
  -- só 1 processo executa isso por vez
  PERFORM processar_fila_pendente();
  PERFORM pg_advisory_unlock(12345);
ELSE
  RAISE NOTICE 'Outro worker já está processando';
END IF;
END $$;

-- Lock por transação (liberado no COMMIT/ROLLBACK)
SELECT pg_advisory_xact_lock(hashtext('job:importacao'));
-- Faz o trabalho aqui...
-- Lock liberado automaticamente no COMMIT

-- Verificar locks ativos
SELECT pid, granted, classid, objid, mode
FROM pg_locks WHERE locktype = 'advisory';`,
    },
    {
      title: "Replicação — streaming e lógica",
      body: "Streaming replication (física): réplica recebe WAL continuamente do primary, aplica, fica como hot standby (read-only). Logical replication: replica dados por tabela via protocolo lógico — permite versões diferentes do Postgres, filtrar tabelas, e CDC (Change Data Capture). pg_stat_replication monitora lag.",
      code: `-- Verificar lag de replicação no primary
SELECT
client_addr,
state,
sent_lsn,
write_lsn,
flush_lsn,
replay_lsn,
pg_size_pretty(
  pg_wal_lsn_diff(sent_lsn, replay_lsn)
) AS lag_bytes,
write_lag, flush_lag, replay_lag
FROM pg_stat_replication;

-- Logical replication: publicar tabela específica
CREATE PUBLICATION minha_pub FOR TABLE pedidos, usuarios;

-- Na réplica: assinar a publicação
CREATE SUBSCRIPTION minha_sub
CONNECTION 'host=primary dbname=app user=repl'
PUBLICATION minha_pub;`,
    },
    {
      title: "pg_stat_statements — encontrar queries lentas em produção",
      body: "pg_stat_statements acumula estatísticas de todas as queries executadas: calls, total_time, mean_time, rows, cache hit ratio. É a ferramenta correta para identificar o que realmente custa no banco em produção — não queries lentas isoladas, mas queries medianas chamadas milhares de vezes. Necessário habilitar no postgresql.conf.",
      code: `-- Habilitar (requer restart do Postgres)
-- postgresql.conf: shared_preload_libraries = 'pg_stat_statements'
CREATE EXTENSION pg_stat_statements;

-- Top 10 queries por tempo total (impacto real no banco)
SELECT
LEFT(query, 80) AS query_curta,
calls,
ROUND(total_exec_time::numeric, 1) AS total_ms,
ROUND(mean_exec_time::numeric, 2) AS media_ms,
ROUND(stddev_exec_time::numeric, 2) AS stddev_ms,
rows
FROM pg_stat_statements
ORDER BY total_exec_time DESC LIMIT 10;

-- Queries com maior variação (inconsistentes = problema de planner)
SELECT LEFT(query, 80), calls, ROUND(mean_exec_time::numeric, 2),
ROUND(stddev_exec_time::numeric, 2),
ROUND(stddev_exec_time / NULLIF(mean_exec_time, 0), 2) AS cv
FROM pg_stat_statements
WHERE calls > 100
ORDER BY cv DESC LIMIT 10;

-- Reset (útil após tuning)
SELECT pg_stat_statements_reset();`,
    },
    {
      title: "Particionamento — tabelas gigantes",
      body: "Particionamento divide uma tabela lógica em partições físicas. O planner usa partition pruning para eliminar partições irrelevantes na cláusula WHERE. Tipos: RANGE (por data/id), LIST (por valor discreto), HASH (distribuição uniforme). Benefícios: queries mais rápidas (menos dados varridos), DELETE de partições antigas muito mais rápido que DELETE de linhas.",
      code: `-- Particionamento por range de data
CREATE TABLE eventos (
id        BIGSERIAL,
tipo      TEXT NOT NULL,
payload   JSONB NOT NULL,
criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
) PARTITION BY RANGE (criado_em);

-- Criar partições (automatize com pg_partman)
CREATE TABLE eventos_2025_01
PARTITION OF eventos FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
CREATE TABLE eventos_2025_02
PARTITION OF eventos FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

-- Índices são por partição
CREATE INDEX ON eventos_2025_01(tipo);
CREATE INDEX ON eventos_2025_02(tipo);

-- Verificar partition pruning
EXPLAIN SELECT * FROM eventos
WHERE criado_em BETWEEN '2025-01-15' AND '2025-01-31';
-- Deve mostrar só eventos_2025_01, não todas as partições

-- Deletar dados antigos: 1000x mais rápido que DELETE
DROP TABLE eventos_2024_01;  -- ou DETACH + DROP`,
    },
    {
      title: "Full-text search integrado",
      body: "Postgres tem full-text search nativo sem precisar de Elasticsearch. tsvector é o documento indexado. tsquery é a busca. to_tsvector tokeniza e normaliza. GIN index em tsvector é muito rápido. Para LIKE '%termo%' (busca por substring), use pg_trgm com GIN index — funciona com qualquer string sem tokenização.",
      code: `-- Full-text search com tsvector + tsquery
-- Coluna gerada para não recalcular sempre
ALTER TABLE artigos ADD COLUMN busca_ts tsvector
GENERATED ALWAYS AS (
  to_tsvector('portuguese',
    coalesce(titulo, '') || ' ' || coalesce(conteudo, ''))
) STORED;

CREATE INDEX ON artigos USING gin(busca_ts);

-- Busca com ranking por relevância
SELECT titulo, ts_rank(busca_ts, query) AS relevancia
FROM artigos, to_tsquery('portuguese', 'postgresql & índice') query
WHERE busca_ts @@ query
ORDER BY relevancia DESC LIMIT 10;

-- LIKE '%abc%' rápido com pg_trgm
CREATE EXTENSION pg_trgm;
CREATE INDEX ON produtos USING gin(nome gin_trgm_ops);
SELECT * FROM produtos WHERE nome ILIKE '%notebook%'; -- usa o índice`,
    },
  ],
  cheatsheet: {
    title: "PostgreSQL — cheatsheet de sobrevivência",
    html: `<style>
.pgcs-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:20px}
.pgcs-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.pgcs-section{background:#1e293b;border-radius:8px;padding:14px;border-left:3px solid #336791}
.pgcs-section-title{color:#5b9bd5;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px}
.pgcs-item{font-size:11px;color:#64748b;line-height:1.7;padding:3px 0;border-bottom:1px solid rgba(51,65,85,.4)}
.pgcs-item:last-child{border-bottom:none}
.pgcs-item code{color:#93c5fd;background:rgba(147,197,253,.08);padding:1px 5px;border-radius:3px;font-size:10px}
.pgcs-kw{color:#a78bfa}
.pgcs-val{color:#34d399}
.pgcs-warn{color:#f59e0b}
.pgcs-full{grid-column:1/-1}
</style>
<div class="pgcs-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 14px;font-weight:600">PostgreSQL — cheatsheet de sobrevivência</p>
<div class="pgcs-grid">
  <div class="pgcs-section">
    <div class="pgcs-section-title">DDL rápido</div>
    <div class="pgcs-item"><code>CREATE TABLE t (id BIGSERIAL PK, ...)</code> — tabela com PK auto</div>
    <div class="pgcs-item"><code>CREATE INDEX ON t(col)</code> — B-Tree</div>
    <div class="pgcs-item"><code>CREATE INDEX ON t USING gin(jsonb_col)</code> — GIN</div>
    <div class="pgcs-item"><code>CREATE INDEX ON t(col) WHERE predicate</code> — parcial</div>
    <div class="pgcs-item"><code>CREATE INDEX ON t(col) INCLUDE (c2,c3)</code> — coberto</div>
    <div class="pgcs-item"><code>ALTER TABLE t ADD COLUMN c TEXT DEFAULT 'x'</code></div>
    <div class="pgcs-item"><code>ALTER TABLE t DROP COLUMN c</code></div>
    <div class="pgcs-item"><code>ALTER TABLE t ADD CONSTRAINT ck CHECK (n > 0)</code></div>
  </div>
  <div class="pgcs-section">
    <div class="pgcs-section-title">EXPLAIN flags</div>
    <div class="pgcs-item"><code>EXPLAIN SELECT ...</code> — plano estimado</div>
    <div class="pgcs-item"><code>EXPLAIN ANALYZE ...</code> — executa + tempos reais</div>
    <div class="pgcs-item"><code>EXPLAIN (ANALYZE, BUFFERS) ...</code> — + cache hits/misses</div>
    <div class="pgcs-item"><code>EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) ...</code> — para visualizadores</div>
    <div class="pgcs-item"><code class="pgcs-warn">BEGIN; EXPLAIN ANALYZE DELETE ...; ROLLBACK;</code> — seguro para DML</div>
    <div class="pgcs-item"><code>VACUUM ANALYZE tabela;</code> — atualiza stats antes de EXPLAIN</div>
    <div class="pgcs-item"><code>SET enable_seqscan = off;</code> — força uso de índice (debug)</div>
  </div>
  <div class="pgcs-section">
    <div class="pgcs-section-title">JSONB operadores</div>
    <div class="pgcs-item"><code>dados->'chave'</code> — retorna JSON</div>
    <div class="pgcs-item"><code>dados->>'chave'</code> — retorna TEXT</div>
    <div class="pgcs-item"><code>dados#>'{a,b}'</code> — caminho como JSON</div>
    <div class="pgcs-item"><code>dados#>>'{a,b}'</code> — caminho como TEXT</div>
    <div class="pgcs-item"><code>dados @> '{"k":"v"}'</code> — contém (usa GIN)</div>
    <div class="pgcs-item"><code>dados ? 'chave'</code> — chave existe (usa GIN)</div>
    <div class="pgcs-item"><code>jsonb_set(dados, '{k}', '"v"')</code> — atualizar campo</div>
    <div class="pgcs-item"><code>dados || '{"k":"v"}'</code> — merge shallow</div>
    <div class="pgcs-item"><code>dados - 'chave'</code> — remover campo</div>
  </div>
  <div class="pgcs-section">
    <div class="pgcs-section-title">Window functions</div>
    <div class="pgcs-item"><code>ROW_NUMBER() OVER (ORDER BY col)</code></div>
    <div class="pgcs-item"><code>RANK() OVER (ORDER BY col)</code> — pula posições em empate</div>
    <div class="pgcs-item"><code>DENSE_RANK() OVER (ORDER BY col)</code> — sem pular</div>
    <div class="pgcs-item"><code>LAG(col, 1) OVER (ORDER BY data)</code> — linha anterior</div>
    <div class="pgcs-item"><code>LEAD(col, 1) OVER (ORDER BY data)</code> — próxima linha</div>
    <div class="pgcs-item"><code>SUM(val) OVER (PARTITION BY grp ORDER BY data)</code> — cumulativo</div>
    <div class="pgcs-item"><code>NTILE(4) OVER (ORDER BY col)</code> — quartis</div>
    <div class="pgcs-item"><code>FIRST_VALUE(col) OVER w</code> / <code>LAST_VALUE(col) OVER w</code></div>
  </div>
  <div class="pgcs-section pgcs-full">
    <div class="pgcs-section-title">Monitoramento e manutenção</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0">
      <div>
        <div class="pgcs-item"><code>pg_stat_activity</code> — conexões e queries ativas</div>
        <div class="pgcs-item"><code>pg_stat_user_tables</code> — seq scans, live/dead tuples</div>
        <div class="pgcs-item"><code>pg_stat_user_indexes</code> — uso de cada índice</div>
        <div class="pgcs-item"><code>pg_statio_user_tables</code> — heap hits/reads (cache ratio)</div>
        <div class="pgcs-item"><code>pg_locks</code> — locks ativos por tipo e relação</div>
        <div class="pgcs-item"><code>pg_stat_replication</code> — lag de réplicas</div>
      </div>
      <div>
        <div class="pgcs-item"><code>VACUUM ANALYZE tabela;</code> — limpar + atualizar stats</div>
        <div class="pgcs-item"><code>VACUUM FULL tabela;</code> — compactar (lock exclusivo!)</div>
        <div class="pgcs-item"><code>REINDEX TABLE tabela;</code> — reconstruir índices</div>
        <div class="pgcs-item"><code>SELECT pg_size_pretty(pg_total_relation_size('t'))</code></div>
        <div class="pgcs-item"><code>SELECT pg_size_pretty(pg_indexes_size('t'))</code></div>
        <div class="pgcs-item"><code>SELECT age(datfrozenxid) FROM pg_database</code> — risco de XID wrap</div>
      </div>
    </div>
  </div>
</div>
</div>`,
    caption: "Guarda este cheatsheet. EXPLAIN + pg_stat_statements + autovacuum bem configurado resolvem 90% dos problemas de performance em produção.",
  },
  gotchas: [
    "SELECT * em produção: puxa todas as colunas — mesmo JSONB gigante e blobs que você não precisa. Torna Index Only Scan impossível. Sempre liste colunas explicitamente em queries de produção.",
    "LIKE '%termo%' não usa B-Tree — varra a tabela inteira. Solução: pg_trgm com GIN index. 'abc%' (prefix) usa B-Tree normalmente. '%abc%' (infix) precisa de pg_trgm.",
    "VACUUM desabilitado ou mal configurado: table bloat cresce indefinidamente, XID wraparound causa emergency shutdown do banco (modo read-only de emergência). Monitore n_dead_tup e last_autovacuum em pg_stat_user_tables.",
    "Conexões sem pool: Postgres usa ~10MB de RAM por conexão e tem overhead de fork(). Com 500 conexões sem pool, você desperdiça 5GB de RAM e sofre context switching. Use PgBouncer em transaction mode.",
    "N+1 em ORM: buscar lista de items (1 query) e depois buscar relacionamentos de cada item individualmente (N queries). Solução: JOIN ou eager loading. Identifique com pg_stat_statements (muitas chamadas ao mesmo padrão de query).",
    "NOT IN com NULL: NOT IN (SELECT ...) retorna 0 linhas se a subquery contém qualquer NULL — comportamento contra-intuitivo. Use NOT EXISTS ou LEFT JOIN ... WHERE right.id IS NULL.",
    "Índice em coluna de baixa cardinalidade (boolean, status com 3 valores): B-Tree retorna muitas linhas — seq scan pode ser mais rápido. Índice parcial resolve: CREATE INDEX ON t(col) WHERE status = 'ativo'.",
    "TRUNCATE não dispara ON DELETE triggers. Se você tem foreign keys com ON DELETE CASCADE ou triggers de auditoria, use DELETE em vez de TRUNCATE.",
    "UPDATE frequente cria dead tuples: MVCC gera uma nova versão da linha a cada UPDATE. Em tabelas com >100 updates/segundo, o autovacuum padrão pode não dar conta. Ajuste autovacuum_vacuum_scale_factor por tabela.",
    "Falta de índice na FK: Postgres não cria índice automaticamente na coluna de foreign key (ao contrário do MySQL). Se você faz JOINs ou deletes em cascata, crie o índice manualmente.",
  ],
  interview: [
    {
      q: "Como funciona o MVCC no PostgreSQL?",
      level: "pleno",
      a: "<p>MVCC (Multi-Version Concurrency Control) permite que leituras e escritas concorrentes aconteçam sem bloquear umas às outras. Cada linha (tupla) tem dois campos de controle: <strong>xmin</strong> (XID da transação que criou) e <strong>xmax</strong> (XID da transação que deletou/sobrescreveu).</p><p>Quando uma transação começa, ela captura um <strong>snapshot</strong>: lista de transações ativas naquele momento. Uma tupla é visível para a transação se: xmin foi committed antes do snapshot, e xmax é nulo ou não foi committed antes do snapshot.</p><p>Consequência: UPDATE não sobrescreve — cria uma nova versão com novo xmin, e marca xmax na versão anterior. DELETE só marca xmax. As versões antigas (dead tuples) ficam no disco até o <strong>VACUUM</strong> limpar.</p>",
      tip: "Sempre mencione que VACUUM é necessário por causa do MVCC. E que long-running transactions bloqueiam o VACUUM de remover dead tuples. Isso é o que separa quem conhece teoria de quem trabalhou em produção.",
    },
    {
      q: "Qual a diferença entre B-Tree, GIN, GiST e BRIN? Quando usar cada um?",
      level: "pleno",
      a: "<p><strong>B-Tree</strong>: padrão. Use para igualdade, range, ORDER BY, prefix LIKE. Funciona com quase todo tipo de dado. É a escolha certa em 90% dos casos.</p><p><strong>GIN</strong> (Generalized Inverted Index): para dados que são coleções — JSONB, arrays, tsvector (full-text). Mapeia cada elemento para os documentos que o contêm. Mais lento para escrever, mais rápido para buscar em qualquer elemento. Use com o operador @> (contém).</p><p><strong>GiST</strong>: para tipos complexos — geometria (PostGIS), range types. Suporta operações de sobreposição e proximidade. Base dos índices geoespaciais.</p><p><strong>BRIN</strong>: Block Range Index. Armazena min/max por bloco físico. Minúsculo (KB), mas só funciona se os dados têm alta correlação com ordem física — ex: timestamps em tabelas append-only (logs). Para tabelas de TB com timestamps sequenciais, BRIN é muito mais eficiente que B-Tree em espaço.</p>",
      tip: "Mencione índice parcial e índice de expressão como complementos importantes. E que INCLUDE transforma Index Scan em Index Only Scan — evita acesso à heap.",
    },
    {
      q: "O que é XID wraparound e como prevenir?",
      level: "senior",
      a: "<p>Transaction IDs (XIDs) são inteiros de 32 bits — o Postgres usa apenas ~2 bilhões de valores 'no futuro' da perspectiva de cada transação (espaço de endereçamento circular de 4 bilhões). Quando o contador se aproxima do limite, o Postgres precisa 'congelar' tuplas antigas para que não fiquem invisíveis.</p><p>Se o <strong>VACUUM</strong> não rodar com frequência suficiente para congelar tuplas antigas, o Postgres entra em modo de emergência (<code>vacuum_freeze_min_age</code> e <code>vacuum_freeze_table_age</code> controlam isso). O sinal de alarme é quando <code>age(datfrozenxid)</code> em pg_database se aproxima de 2 bilhões — o banco para de aceitar escritas e exige VACUUM FREEZE manual.</p><p>Prevenção: autovacuum bem configurado, monitorar <code>SELECT max(age(datfrozenxid)) FROM pg_database</code>, alertar quando > 500M.</p>",
    },
    {
      q: "Como você diagnosticaria uma query lenta em produção?",
      level: "pleno",
      a: "<p>Processo em camadas:</p><p><strong>1. pg_stat_statements</strong>: encontrar as queries com maior total_exec_time — não as mais lentas individualmente, mas as que mais pesam no banco por volume × latência.</p><p><strong>2. EXPLAIN (ANALYZE, BUFFERS)</strong> na query problemática: procuro Seq Scan em tabela grande com filtro seletivo (falta índice), rows estimados ≫ reais (rode ANALYZE), Nested Loop com loops altos (falta índice no inner), Hash Join com spill to disk (aumente work_mem).</p><p><strong>3. Verificar autovacuum</strong>: estatísticas desatualizadas fazem o planner escolher planos ruins — ANALYZE na tabela pode resolver instantaneamente.</p><p><strong>4. pg_stat_activity</strong>: verificar se há lock waits contribuindo para a lentidão percebida — a query pode estar bloqueada, não lenta.</p>",
    },
    {
      q: "Quando usar JSONB vs tabela normalizada?",
      level: "senior",
      a: "<p>Use <strong>tabela normalizada</strong> quando: o schema é estável e bem definido, você faz queries em colunas específicas frequentemente, precisa de integridade referencial (FK), ou faz aggregations (GROUP BY, SUM) nesses campos.</p><p>Use <strong>JSONB</strong> quando: o schema varia por registro (configurações de usuário, atributos de produto de categorias diferentes), você armazena dados externos sem necessidade de queries em todos os campos, ou quando a flexibilidade de schema é mais valiosa que a performance de queries estruturadas.</p><p>A armadilha: usar JSONB como escape de modelagem preguiçosa, depois precisar de queries em campos JSON e não ter como indexar eficientemente sem um índice de expressão por campo. O híbrido correto: colunas normalizadas para campos consultados frequentemente + JSONB para atributos extras/variáveis.</p>",
    },
    {
      q: "Como funciona connection pooling? Por que PgBouncer é necessário?",
      level: "pleno",
      a: "<p>Postgres usa um <strong>processo por conexão</strong> (~10MB de RAM + overhead de fork). Com 500 conexões simultâneas, você usa 5GB só de RAM de overhead, além de context switching entre processos. O max_connections padrão é 100; aumentar sem cuidado degrada performance.</p><p><strong>PgBouncer</strong> opera como proxy: a aplicação mantém um pool grande de conexões ao PgBouncer (que são leves — só TCP), e o PgBouncer mantém um pool pequeno de conexões reais ao Postgres.</p><p>Modos: <strong>session</strong> (1 conexão Postgres por sessão da aplicação — pouca economia), <strong>transaction</strong> (compartilha conexão entre transações — excelente multiplexação, mas não suporta prepared statements stateful, SET por sessão), <strong>statement</strong> (por statement, raro).</p><p>Transaction mode é o mais eficiente: 1000 conexões de aplicação podem usar 25 conexões reais ao Postgres, pois a maioria fica idle entre requests.</p>",
    },
    {
      q: "O que são índices parciais e quando usar?",
      level: "pleno",
      a: "<p>Índice parcial inclui apenas as linhas que satisfazem um predicado: <code>CREATE INDEX ON pedidos(criado_em) WHERE status = 'pendente'</code>. O índice é muito menor (só indexa pedidos pendentes, não todos os concluídos), mais seletivo (todas as linhas no índice são relevantes), e mais fácil de manter (menos atualizações).</p><p>Use quando: uma fração pequena das linhas é frequentemente consultada (ex: pedidos ativos em uma tabela com 99% concluídos), você tem uma coluna booleana ou enum com muitas variações de apenas um valor (ex: deleted = false), ou você quer índice composto mas só para um subconjunto específico.</p><p>A query precisa ter o predicado correspondente para o índice ser usado pelo planner — não é mágico, o planner verifica a compatibilidade.</p>",
    },
    {
      q: "Quando você sairia do Postgres?",
      level: "senior",
      a: "<p>Postgres aguenta muito mais do que as pessoas acham. Antes de migrar, considere: particionamento (>100M linhas por tabela), read replicas, connection pooling, índices corretos, autovacuum bem configurado, e pgvector para embeddings.</p><p>Contextos onde migrar faz sentido: <strong>Write throughput > 100k TPS sustentado</strong> com latência crítica → Cassandra ou DynamoDB (LSM-Tree, sem MVCC overhead). <strong>Dados de grafo com traversals complexos</strong> (6+ hops) → Neo4j (Cypher + index-free adjacency). <strong>Time series densa com 1M+ pontos/segundo</strong> → InfluxDB ou TimescaleDB (sobre Postgres, mas com engine otimizada). <strong>Busca full-text com relevance tuning complexo e facets</strong> → Elasticsearch. <strong>Escala geográfica multi-região</strong> → CockroachDB ou Spanner (Postgres wire protocol, mas distribuído).</p>",
      tip: "A resposta errada é 'Postgres não escala'. A certa é mostrar que você conhece os limites reais e as alternativas certas para cada problema específico.",
    },
    {
      q: "Como o query planner decide entre Seq Scan e Index Scan?",
      level: "senior",
      a: "<p>O planner usa <strong>estatísticas</strong> coletadas pelo ANALYZE: histograma de distribuição de valores, número de linhas, correlation (correlação entre valor e posição física). Ele estima o custo de cada plano baseado em: páginas a ler, I/O aleatório vs sequencial, CPU, etc.</p><p>Seq Scan vence quando: a query retorna uma fração grande da tabela (>5-20%), ou o Index Scan teria muito I/O aleatório (correlation baixa). Index Scan vence quando: filtro é seletivo (< 1-5% das linhas), e/ou a coluna tem boa correlation com posição física.</p><p>Sinais de problema: <code>SET enable_seqscan = off</code> + EXPLAIN — se o plano muda para Index Scan e fica mais rápido, o problema é estatísticas desatualizadas (rode ANALYZE). Se Seq Scan é realmente mais rápido, o índice pode estar mal escolhido ou a query não é seletiva o suficiente.</p>",
    },
    {
      q: "Como CTEs recursivas funcionam?",
      level: "senior",
      a: "<p>CTEs recursivas (<code>WITH RECURSIVE</code>) têm duas partes: o caso base (SELECT inicial sem referência a si mesma) e o caso recursivo (SELECT que referencia o nome da CTE). O Postgres executa: (1) o caso base, produzindo as linhas iniciais; (2) o caso recursivo com as linhas anteriores como input; (3) repete até o caso recursivo retornar 0 linhas.</p><p>UNION ALL acumula todas as linhas. UNION elimina duplicatas (mais lento). Use para hierarquias (categorias pai/filho, org charts), grafos (caminhos), geração de sequências.</p><p>Cuidado: sem condição de parada, loop infinito. Sempre inclua uma cláusula WHERE ou limite de profundidade: <code>WHERE nivel &lt; 10</code>. Para grafos com ciclos, controle os visitados com array de IDs acumulado.</p>",
    },
    {
      q: "Qual a diferença entre VACUUM e VACUUM FULL?",
      level: "pleno",
      a: "<p><strong>VACUUM</strong>: remove dead tuples, marca espaço como reutilizável dentro da tabela, atualiza o visibility map, avança o oldest_xmin. <em>Não</em> devolve espaço ao OS — o arquivo de tabela não diminui. Não requer lock exclusivo (ShareUpdateExclusiveLock — permite SELECT, INSERT, UPDATE, DELETE concorrentes). Roda pelo autovacuum.</p><p><strong>VACUUM FULL</strong>: reescreve a tabela inteira em um novo arquivo, devolvendo espaço ao OS. Requer <code>AccessExclusiveLock</code> — bloqueia <em>toda</em> operação na tabela durante o processo. Para tabelas grandes, pode durar horas.</p><p>Em produção: use <strong>pg_repack</strong> para o equivalente ao VACUUM FULL sem lock exclusivo — ele cria a tabela nova em background e faz swapping atômico no final. Só então o VACUUM FULL pode ser considerado em janelas de manutenção.</p>",
    },
    {
      q: "Como funciona particionamento no Postgres? Quando usar?",
      level: "senior",
      a: "<p>Particionamento divide uma tabela lógica em múltiplas tabelas físicas (partições). O planner usa <strong>partition pruning</strong>: analisa o WHERE clause e elimina partições que não podem conter as linhas relevantes — sem nem acessar esses arquivos. Tipos: RANGE (por intervalo, ex: data), LIST (por valores discretos, ex: país), HASH (distribuição uniforme por hash).</p><p>Use quando: a tabela tem >50-100M linhas e queries frequentes filtram por uma coluna específica (ex: created_at para logs), ou você precisa de estratégia de retenção (DROP TABLE da partição é 1000x mais rápido que DELETE de linhas).</p><p>Limitações: índices são por partição, não globais. UNIQUE e PK devem incluir a coluna de partição. FK referenciando a tabela particionada tem limitações. Para automatizar criação de partições, use pg_partman.</p>",
    },
    {
      q: "O que é EXPLAIN BUFFERS e por que usar?",
      level: "pleno",
      a: "<p><code>EXPLAIN (ANALYZE, BUFFERS)</code> mostra para cada nó do plano: <strong>shared hit</strong> (páginas lidas do shared buffer pool — cache do Postgres) e <strong>shared read</strong> (páginas lidas do disco — cache miss). A distinção é crítica: uma query que executa em 50ms com tudo em cache pode levar 5 segundos quando os dados estão no disco (cold start ou grande working set).</p><p>Caso de uso típico: você vê que uma query é rápida no ambiente de dev mas lenta em produção. BUFFERS revela que em dev o dado está todo em cache (small dataset), em produção tem muitos cache misses porque a tabela é 100x maior que o shared_buffers.</p><p>Também útil para identificar: índices não usados (zero hits = índice existe mas não é usado), tabelas auxiliares esquecidas que fazem muitas leituras, e oportunidades de aumentar shared_buffers para melhorar o hit ratio.</p>",
    },
    {
      q: "Como implementar busca full-text eficiente no Postgres?",
      level: "pleno",
      a: "<p>O Postgres tem full-text search nativo via <strong>tsvector</strong> + <strong>tsquery</strong>. O fluxo: (1) Converter texto para tsvector (tokenização, stemming, remoção de stop words, por idioma); (2) Criar GIN index na coluna tsvector; (3) Buscar com <code>@@</code> e ordenar por relevância via ts_rank.</p><p>Otimização: coluna tsvector GENERATED STORED evita recalcular em cada query. Dicionários de idioma (portuguese) fazem stemming correto — 'correr' e 'correndo' matcham a mesma busca.</p><p>Para LIKE '%abc%' (substring search sem tokenização): use <code>pg_trgm</code> com GIN index usando <code>gin_trgm_ops</code>. Mais lento que tsvector para buscas longas, mas suporta qualquer string sem pré-processamento.</p><p>Quando ir para Elasticsearch: corpus > 50M documentos, relevance tuning com sinais externos (clicks, conversão), facets complexos, highlight de múltiplos campos, boost dinâmico por regras de negócio.</p>",
    },
    {
      q: "Como pagination com cursor funciona e por que é melhor que OFFSET?",
      level: "pleno",
      a: "<p><code>OFFSET n</code> é O(n): o Postgres executa a query completa e descarta as primeiras n linhas. Na página 1000 com 20 items por página, são 20.000 linhas buscadas, só 20 retornadas. Isso escala pessimamente — página 100 é 200x mais lenta que página 1.</p><p>Cursor-based pagination usa a última chave da página anterior como âncora: <code>WHERE (created_at, id) &lt; ($last_created_at, $last_id) ORDER BY created_at DESC, id DESC LIMIT 20</code>. O índice em (created_at DESC, id DESC) é usado diretamente — O(log n) independente da página.</p><p>Limitações do cursor: não suporta 'ir para página X' diretamente, a ordenação precisa ser determinística (por isso o id como tiebreaker). Para paginação com acesso aleatório a páginas, keyset é mais difícil — uma alternativa é materialize a ordenação em uma coluna numérica.</p>",
    },
    {
      q: "Como funciona o WAL (Write-Ahead Log) e por que ele é fundamental para durabilidade?",
      level: "senior",
      a: "<p>O WAL é o log de mudanças que o Postgres escreve ANTES de modificar os arquivos de dados. Cada operação que altera dados (INSERT, UPDATE, DELETE, DDL) gera um registro WAL com LSN (Log Sequence Number) único. No COMMIT, o Postgres faz fsync do WAL — só então responde OK ao cliente. Os arquivos de dados podem ser atualizados depois, assincronamente.</p><p>Por que isso garante durabilidade: se o servidor cair imediatamente após o COMMIT, o WAL está em disco. No restart, o recovery replaya o WAL desde o último checkpoint — reconstruindo o estado consistente. Os dirty pages no buffer pool que não foram flushados são reconstruídos a partir do WAL.</p><p>Configurações importantes: <code>synchronous_commit = on</code> (default) garante fsync no commit. <code>synchronous_commit = off</code> torna commit muito mais rápido mas perde transações dos últimos ms em caso de crash. <code>max_wal_size</code> limita o tamanho do WAL antes de forçar checkpoint. <code>wal_compression = on</code> reduz tamanho do WAL em 30-60%.</p>",
      tip: "Mencione que o WAL também é a base para replicação física (streaming) e PITR (Point-in-Time Recovery via archive de WAL).",
    },
    {
      q: "DDL é transacional no Postgres? Como isso ajuda em migrations?",
      level: "senior",
      a: "<p>Sim — Postgres tem <strong>transactional DDL</strong>: CREATE TABLE, ALTER TABLE, DROP TABLE, CREATE INDEX (não CONCURRENTLY) podem ser envolvidos em BEGIN/COMMIT/ROLLBACK. Se a transação falha, todas as mudanças de schema são revertidas.</p><p>Isso muda completamente o jogo de migrations: você pode rodar 10 ALTER TABLE em sequência dentro de uma transação. Se o último falhar, todos os anteriores são revertidos — schema fica consistente. Sem transactional DDL (MySQL pré-8.0), uma migration parcialmente aplicada deixa o banco em estado inconsistente.</p><p>Limitação importante: <strong>CREATE INDEX CONCURRENTLY</strong> não pode rodar em transação — porque ele precisa fazer commits intermediários para não bloquear writes. Por isso ferramentas como pg_repack, pg_partman e algumas migrations usam DDL fora de transação. Em produção, prefira CONCURRENTLY para criação de índices em tabelas grandes.</p>",
    },
    {
      q: "Quando usar materialized views vs views regulares?",
      level: "pleno",
      a: "<p><strong>View regular</strong>: query salva, executada toda vez que você consulta a view. Sem custo de armazenamento, sem custo de manutenção. Bom para encapsular complexidade ou aplicar segurança via row-level security.</p><p><strong>Materialized view</strong>: resultado da query armazenado em disco como uma tabela. Consultas são instantâneas (apenas SELECT em uma tabela). Custo: precisa ser refreshed (REFRESH MATERIALIZED VIEW) para refletir mudanças nas tabelas-base. Pode ter índices próprios.</p><p>Quando usar materialized: dashboards e relatórios que rodam queries pesadas frequentemente, agregações que mudam pouco (totais diários atualizados de hora em hora). Use <code>REFRESH MATERIALIZED VIEW CONCURRENTLY</code> para atualizar sem bloquear leituras (requer índice UNIQUE).</p><p>Antipattern: usar materialized view onde uma tabela com triggers de manutenção seria melhor — triggers atualizam incrementalmente, REFRESH recalcula tudo. Para grandes datasets com mudanças frequentes, considerar TimescaleDB continuous aggregates ou tabelas agregadas mantidas via triggers.</p>",
    },
    {
      q: "Diferença entre hot standby e warm standby? Como usar read replicas no Postgres?",
      level: "senior",
      a: "<p><strong>Warm standby</strong>: réplica recebe WAL files (via archive ou streaming) e replaya, mas não aceita queries. Está pronta para failover mas não serve carga. Modo legado, raramente usado hoje.</p><p><strong>Hot standby</strong>: réplica recebe WAL via streaming replication, replaya em tempo real e aceita queries READ-ONLY simultaneamente. É a configuração padrão para read replicas no Postgres moderno.</p><p>Configuração: no primary, <code>wal_level = replica</code> e <code>max_wal_senders</code>. Na réplica: <code>standby.signal</code> + <code>primary_conninfo</code> apontando para o primary, <code>hot_standby = on</code>. Usar <code>pg_basebackup</code> para clonar inicialmente.</p><p>Cuidado com query conflicts: queries longas na réplica podem ser canceladas pelo replay do WAL (recovery wins). Configurar <code>max_standby_streaming_delay</code> para tolerar atraso. <code>hot_standby_feedback = on</code> evita cancelamentos mas pode causar bloat no primary.</p><p>Para roteamento na aplicação: PgBouncer não roteia automaticamente — usar Pgpool-II, HAProxy com health checks, ou lógica de aplicação (escritas no primary, leituras na réplica). Atenção a replication lag — leituras imediatamente após escrita podem retornar dados velhos.</p>",
    },
    {
      q: "Como funciona logical replication e quando preferir sobre streaming?",
      level: "senior",
      a: "<p><strong>Streaming replication</strong> (física) replica blocos de WAL — cópia byte a byte. Réplica é idêntica ao primary: mesmo schema, mesmas versões. Não permite filtrar tabelas ou ter schemas diferentes.</p><p><strong>Logical replication</strong> replica via protocolo lógico: envia INSERT/UPDATE/DELETE como operações estruturadas. Permite: replicar apenas algumas tabelas, replicar entre versões diferentes do Postgres (upgrade major), schemas diferentes na réplica, multi-master setups, e CDC (Change Data Capture) para fora do Postgres.</p><p>Setup: no publisher, <code>CREATE PUBLICATION pub_name FOR TABLE t1, t2;</code>. No subscriber, <code>CREATE SUBSCRIPTION sub_name CONNECTION '...' PUBLICATION pub_name;</code>. Suporta replicação seletiva e adição/remoção de tabelas a quente.</p><p>Quando preferir logical: upgrade major version sem downtime, sincronizar dados para data warehouse, replicar subset de tabelas, ou setup ativo-ativo (com cuidado em conflict resolution). Quando preferir streaming: replica completa para HA/DR, performance máxima, baixa latência.</p>",
    },
    {
      q: "Como otimizar o uso de memória do Postgres em produção?",
      level: "senior",
      a: "<p>Os parâmetros de memória críticos: <code>shared_buffers</code> (cache compartilhado, recomendado 25% da RAM, máximo 40%), <code>work_mem</code> (memória por operação Sort/Hash, default 4MB — aumentar para 16-64MB em workloads analíticos), <code>maintenance_work_mem</code> (para VACUUM e CREATE INDEX, pode ser 256MB-2GB sem risco), <code>effective_cache_size</code> (estimativa do cache total disponível incluindo OS, ajuda o planner — 50-75% da RAM).</p><p>Cuidado com work_mem: cada query pode usar work_mem múltiplas vezes (cada Sort, cada Hash). Com 100 conexões concorrentes e 3 hashes por query, o consumo máximo é work_mem × 100 × 3 = pode estourar a RAM. Use SET work_mem por sessão para queries específicas em vez de aumentar globalmente.</p><p>Monitoramento: <code>pg_statio_user_tables</code> mostra hit ratio (idealmente >99%). <code>EXPLAIN (ANALYZE, BUFFERS)</code> revela cache misses por query. <code>pg_buffercache</code> extension mostra o que está no shared buffer pool. Se hit ratio é baixo e shared_buffers já está em 25% da RAM, o working set é maior que a RAM disponível — cache do OS ajuda mas chegamos no limite vertical.</p>",
    },
  ],
  mnemonics: [
    {
      label: "ACID",
      trick: "Atomicidade, Consistência, Isolamento, Durabilidade",
      explanation: "As 4 garantias clássicas de transações relacionais. Atomicidade = tudo ou nada (BEGIN/COMMIT/ROLLBACK). Consistência = invariantes do schema preservadas (constraints, FK). Isolamento = transações concorrentes não interferem entre si (controlado por isolation level + MVCC). Durabilidade = após COMMIT, dado sobrevive a crash (garantida pelo WAL fsync). O Postgres entrega ACID completo no padrão.",
    },
    {
      label: "BGGSH — tipos de índice",
      trick: "B-Tree, GIN, GiST, SP-GiST, Hash, BRIN",
      explanation: "Os 6 tipos de índice nativos. B-Tree é default e resolve 90% dos casos. GIN para coleções (JSONB, arrays, full-text). GiST para tipos complexos (geometria, ranges). SP-GiST para dados particionáveis (quad-tree, k-d tree). Hash só para igualdade (raro). BRIN para tabelas grandes append-only com correlação física (timestamps em logs).",
    },
    {
      label: "VEAR — leitura de plano EXPLAIN",
      trick: "Verificar tipo, Estimado vs actual, Acompanhar loops, Reading buffers",
      explanation: "A sequência de inspeção de cada nó do EXPLAIN. (V) Tipo do nó: Seq Scan em tabela grande é alerta. (E) rows estimado vs actual: diferença grande indica estatísticas desatualizadas. (A) loops: actual time × loops = custo real em Nested Loop. (R) Buffers: shared hit vs read = cache vs disco.",
    },
    {
      label: "VAW — pré-flight de migration",
      trick: "VACUUM ANALYZE antes de Window de produção",
      explanation: "Antes de qualquer migration ou criação de índice em produção, sempre rode VACUUM ANALYZE na tabela alvo. Garante que estatísticas estão atualizadas, dead tuples removidas e o planner vê a tabela em estado limpo. Sem isso, a estimativa de tempo da operação pode estar completamente errada.",
    },
  ],
  exercises: [
    {
      level: "iniciante",
      title: "Modelar um e-commerce simples com constraints",
      description: "Crie tabelas usuarios, produtos, pedidos e itens_pedido. Cada pedido tem N itens. Use BIGSERIAL como PK, NOT NULL, CHECK constraints para preço positivo, FK com ON DELETE RESTRICT para pedidos e ON DELETE CASCADE para itens. Adicione um índice em pedidos(usuario_id) e em pedidos(criado_em) WHERE status = 'pendente' (parcial).",
      concepts: ["DDL", "constraints", "FK", "índice parcial"],
      hint: "Comece pelos campos sem dependência (usuarios, produtos), depois adicione pedidos referenciando usuarios, depois itens_pedido referenciando pedidos e produtos. Lembre de usar TIMESTAMPTZ (não TIMESTAMP) e DEFAULT now() para datas de criação.",
    },
    {
      level: "intermediario",
      title: "Diagnosticar e corrigir uma query lenta",
      description: "Você recebe a query: SELECT u.nome, COUNT(p.id), SUM(p.total) FROM usuarios u LEFT JOIN pedidos p ON p.usuario_id = u.id WHERE u.criado_em > now() - interval '30 days' GROUP BY u.id, u.nome ORDER BY SUM(p.total) DESC LIMIT 50. Está lenta em produção (5 segundos). Use EXPLAIN (ANALYZE, BUFFERS) para identificar o gargalo, proponha índices, valide com EXPLAIN novamente.",
      concepts: ["EXPLAIN ANALYZE", "índices compostos", "JOIN", "agregação"],
      hint: "Procure Seq Scan em tabela grande ou Hash Join com spill (Batches > 1). Considere índice em usuarios(criado_em) ou índice composto em pedidos(usuario_id, total). Após criar índices, rode VACUUM ANALYZE nas duas tabelas antes do EXPLAIN final.",
    },
    {
      level: "intermediario",
      title: "Implementar paginação cursor-based",
      description: "Em uma tabela posts(id BIGSERIAL, titulo TEXT, autor_id BIGINT, criado_em TIMESTAMPTZ), implemente paginação cursor-based ordenada por criado_em DESC. A primeira página retorna os 20 mais recentes. Páginas seguintes recebem o cursor (criado_em + id da última linha) e retornam os próximos 20. Crie o índice correto. Compare com OFFSET tradicional para a página 100.",
      concepts: ["paginação", "cursor", "tuple comparison", "índice composto"],
      hint: "Use a comparação de tupla: WHERE (criado_em, id) < ($cursor_data, $cursor_id) ORDER BY criado_em DESC, id DESC LIMIT 20. O índice precisa ser CREATE INDEX ON posts(criado_em DESC, id DESC). Considere INCLUDE (titulo, autor_id) para Index Only Scan.",
    },
    {
      level: "senior",
      title: "Configurar autovacuum agressivo para tabela de eventos",
      description: "Você tem uma tabela eventos com 500M linhas e ~10.000 INSERTs/segundo. O autovacuum padrão está deixando bloat acumular (40% dead tuples). Configure parâmetros de autovacuum específicos para esta tabela. Adicione monitoramento via pg_stat_user_tables e crie um alerta para quando pct_dead > 15%.",
      concepts: ["autovacuum", "MVCC", "bloat", "monitoramento"],
      hint: "ALTER TABLE eventos SET (autovacuum_vacuum_scale_factor = 0.01, autovacuum_vacuum_threshold = 1000, autovacuum_analyze_scale_factor = 0.005). Para queries de monitoramento: SELECT em pg_stat_user_tables com cálculo de pct_dead. Considere também idle_in_transaction_session_timeout no postgresql.conf para evitar transações longas bloqueando o vacuum.",
    },
    {
      level: "senior",
      title: "Particionar tabela de logs por mês com pg_partman",
      description: "Migre uma tabela de logs (1B linhas, crescendo 50M/mês) para particionamento por RANGE em criado_em. Use pg_partman para automatizar criação de partições futuras (próximos 6 meses) e detach + drop de partições com mais de 12 meses. Implemente sem downtime. Valide partition pruning com EXPLAIN em queries comuns.",
      concepts: ["particionamento", "pg_partman", "partition pruning", "retenção"],
      hint: "Estratégia sem downtime: criar tabela particionada nova com schema idêntico, usar logical replication ou trigger para sincronizar enquanto faz cópia em background, swap atômico ao final. Para pg_partman: SELECT partman.create_parent('public.logs', 'criado_em', 'native', 'monthly'). Configurar retenção via partman.part_config (retention = '12 months', retention_keep_table = false).",
    },
  ],
  resources: [
    { title: "PostgreSQL docs", url: "https://www.postgresql.org/docs/", kind: "docs" },
    { title: "EXPLAIN Glossary — pgMustard", url: "https://www.pgmustard.com/docs/explain", kind: "docs" },
    { title: "explain.dalibo.com — visualizador de EXPLAIN", url: "https://explain.dalibo.com/", kind: "pratica" },
    { title: "Use the Index, Luke — índices em profundidade", url: "https://use-the-index-luke.com/", kind: "livro" },
    { title: "The Art of PostgreSQL", url: "https://theartofpostgresql.com/", kind: "livro" },
    { title: "Postgres Weekly", url: "https://postgresweekly.com/", kind: "artigo" },
    { title: "pg_activity — monitoramento em tempo real", url: "https://github.com/dalibo/pg_activity", kind: "pratica" },
    { title: "PostgreSQL Wiki — Performance Optimization", url: "https://wiki.postgresql.org/wiki/Performance_Optimization", kind: "docs" },
    { title: "PostgreSQL Internals — Suzuki", url: "https://www.interdb.jp/pg/", kind: "livro" },
    { title: "pgBadger — analisador de logs", url: "https://github.com/darold/pgbadger", kind: "pratica" },
  ],
  videos: [
    { title: "PostgreSQL Internals: MVCC, WAL, and VACUUM Deep Dive", channel: "Hussein Nasser", url: "https://www.youtube.com/watch?v=N3M5RU2VBRI", topic: "Como o MVCC funciona por dentro: xmin/xmax, snapshots, dead tuples e VACUUM" },
    { title: "CMU 15-445 Lecture — PostgreSQL Storage & Buffer Pool", channel: "CMU Database Group", url: "https://www.youtube.com/watch?v=1D81vXw2T_w", topic: "Armazenamento físico, buffer pool e gerenciamento de páginas no PostgreSQL" },
    { title: "PostgreSQL Query Planner and EXPLAIN ANALYZE Masterclass", channel: "Hussein Nasser", url: "https://www.youtube.com/watch?v=BHwzDmr6d7s", topic: "Como o query planner escolhe planos: estatísticas, custos, Seq Scan vs Index Scan" },
    { title: "PostgreSQL Partitioning, Indexing & Performance at Scale", channel: "PGConf.EU", url: "https://www.youtube.com/watch?v=FvEmPAFqe4I", topic: "Particionamento RANGE/LIST/HASH, partition pruning e performance em tabelas com bilhões de linhas" },
    { title: "Row-Level Security and Multi-Tenant PostgreSQL", channel: "Citus Data / Microsoft", url: "https://www.youtube.com/watch?v=sdpM3VKFRG4", topic: "RLS na prática: políticas, current_user, multi-tenant SaaS sem vazamento de dados" },
  ],
  codeExamples: [
    {
      title: "CTE + Window Functions — running total, rank e lag/lead",
      description: "Padrões avançados de window function: total acumulado por categoria, ranking com empate, variação entre períodos",
      language: "sql",
      code: `-- ① Running total (soma acumulada) de vendas por data
WITH vendas_diarias AS (
SELECT
  data_venda::date                        AS dia,
  SUM(valor)                              AS total_dia
FROM pedidos
WHERE data_venda >= NOW() - INTERVAL '90 days'
GROUP BY 1
)
SELECT
dia,
total_dia,
SUM(total_dia) OVER (
  ORDER BY dia
  ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
)                                         AS running_total,
ROUND(AVG(total_dia) OVER (
  ORDER BY dia
  ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
), 2)                                     AS media_7_dias
FROM vendas_diarias
ORDER BY dia;

-- ② RANK vs DENSE_RANK vs ROW_NUMBER
SELECT
nome,
pontuacao,
RANK()        OVER (ORDER BY pontuacao DESC) AS rank_com_gaps,
DENSE_RANK()  OVER (ORDER BY pontuacao DESC) AS rank_sem_gaps,
ROW_NUMBER()  OVER (ORDER BY pontuacao DESC) AS numero_unico
FROM jogadores;
-- RANK: 1,2,2,4  (pula 3 após empate)
-- DENSE_RANK: 1,2,2,3  (não pula)
-- ROW_NUMBER: sempre único, ordem arbitrária em empates

-- ③ LAG/LEAD — variação em relação ao período anterior/seguinte
SELECT
mes,
receita,
LAG(receita)  OVER (ORDER BY mes)           AS receita_mes_anterior,
LEAD(receita) OVER (ORDER BY mes)           AS receita_mes_seguinte,
ROUND(
  100.0 * (receita - LAG(receita) OVER (ORDER BY mes))
          / NULLIF(LAG(receita) OVER (ORDER BY mes), 0),
  1
)                                           AS variacao_pct
FROM receita_mensal
ORDER BY mes;

-- ④ PARTITION BY — rank dentro de cada categoria
SELECT
categoria,
produto,
preco,
RANK() OVER (PARTITION BY categoria ORDER BY preco DESC) AS rank_na_categoria
FROM produtos
WHERE rank_na_categoria <= 3;  -- erro! window function não pode estar no WHERE
-- Use CTE ou subquery:
WITH ranked AS (
SELECT categoria, produto, preco,
  RANK() OVER (PARTITION BY categoria ORDER BY preco DESC) AS rnk
FROM produtos
)
SELECT * FROM ranked WHERE rnk <= 3;`,
    },
    {
      title: "EXPLAIN ANALYZE — diagnóstico completo de query lenta com otimização",
      description: "Fluxo real: query problemática → leitura do plano → criação de índice → comparação antes/depois",
      language: "sql",
      code: `-- CENÁRIO: tabela pedidos (10M linhas), query lenta em produção
-- pedidos(id, usuario_id, status, criado_em, total, items JSONB)

-- ① ANTES: query sem índice — Seq Scan em 10M linhas
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT p.id, p.total, u.nome
FROM pedidos p
JOIN usuarios u ON u.id = p.usuario_id
WHERE p.status = 'pendente'
AND p.criado_em >= NOW() - INTERVAL '7 days'
ORDER BY p.criado_em DESC
LIMIT 50;

/*  PLANO RUIM (exemplo):
  Limit  (cost=285432.18..285432.31 rows=50) (actual time=4821.3..4821.4 rows=50)
    -> Sort  (cost=285432.18..285482.18) (actual time=4821.3..4821.3 rows=50)
         Sort Key: p.criado_em DESC
         -> Hash Join  (cost=8420.00..284121.00) (actual time=312.1..4790.2 rows=4230)
              -> Seq Scan on pedidos p  (cost=0..245000) (actual time=0.1..4120.4 rows=4230)
                   Filter: (status = 'pendente' AND criado_em >= ...)
                   Rows Removed by Filter: 9995770  <-- leu 10M, retornou 4230
              Buffers: shared hit=12 read=44210   <-- 44K páginas do disco!
  Planning Time: 2.4 ms
  Execution Time: 4822.1 ms   <-- 4.8 SEGUNDOS
*/

-- ② DIAGNÓSTICO: o que procurar no plano
--    • Seq Scan em tabela grande com Filter removendo muitas linhas → precisa de índice
--    • rows estimado muito diferente de actual → ANALYZE desatualizado
--    • Buffers: shared read alto → cache miss, working set maior que shared_buffers
--    • Sort sem "Index Scan Backward" → falta índice na coluna de ordenação

-- ③ SOLUÇÃO: índice composto (status + criado_em) cobre o filtro E a ordenação
CREATE INDEX CONCURRENTLY idx_pedidos_status_criado
ON pedidos (status, criado_em DESC)
WHERE status IN ('pendente', 'processando');  -- índice parcial: menor, mais rápido

-- Atualizar estatísticas após criação do índice
ANALYZE pedidos;

-- ④ DEPOIS: mesmo query — agora usa Index Scan
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT p.id, p.total, u.nome
FROM pedidos p
JOIN usuarios u ON u.id = p.usuario_id
WHERE p.status = 'pendente'
AND p.criado_em >= NOW() - INTERVAL '7 days'
ORDER BY p.criado_em DESC
LIMIT 50;

/*  PLANO BOM:
  Limit  (cost=0.56..312.14 rows=50) (actual time=0.9..3.2 rows=50)
    -> Nested Loop  (cost=0.56..26212.14) (actual time=0.9..3.1 rows=50)
         -> Index Scan Backward on pedidos p
              using idx_pedidos_status_criado  (actual time=0.5..1.8 rows=50)
              Index Cond: (status = 'pendente' AND criado_em >= ...)
              Buffers: shared hit=58   <-- 58 páginas vs 44K antes
         -> Index Scan on usuarios u  (actual time=0.03..0.03 rows=1)
  Execution Time: 3.4 ms   <-- de 4.8s para 3.4ms: 1400× mais rápido
*/

-- ⑤ MONITORAR queries lentas em produção (pg_stat_statements)
SELECT
LEFT(query, 80)                     AS query_resumo,
calls,
ROUND(total_exec_time::numeric, 0)  AS total_ms,
ROUND(mean_exec_time::numeric, 1)   AS media_ms,
ROUND(stddev_exec_time::numeric, 1) AS desvio_ms,
rows
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;`,
    },
    {
      title: "Row-Level Security (RLS) — multi-tenant SaaS sem vazamento de dados",
      description: "Configuração completa de RLS: políticas por tenant, current_setting, bypass para admin, teste de isolamento",
      language: "sql",
      code: `-- OBJETIVO: usuários só veem dados do próprio tenant (organização)
--            sem necessidade de WHERE tenant_id = $1 em cada query

-- ① Estrutura da tabela multi-tenant
CREATE TABLE projetos (
id          BIGSERIAL PRIMARY KEY,
tenant_id   UUID        NOT NULL,
nome        TEXT        NOT NULL,
descricao   TEXT,
criado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ON projetos (tenant_id);  -- essencial: RLS filtra por tenant_id

-- ② Ativar RLS na tabela
ALTER TABLE projetos ENABLE ROW LEVEL SECURITY;

-- Por padrão, com RLS ativo, o dono da tabela (superuser) ainda vê tudo.
-- Para forçar RLS até para o dono: FORCE ROW LEVEL SECURITY
ALTER TABLE projetos FORCE ROW LEVEL SECURITY;

-- ③ Política de isolamento: usuário só vê linhas do próprio tenant
--    current_setting('app.current_tenant_id') é definido pela aplicação
--    via SET app.current_tenant_id = '...' antes de cada query
CREATE POLICY tenant_isolamento ON projetos
USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- ④ Política separada para INSERT (garante que novos registros
--    pertencem ao tenant correto — evita que app defina tenant_id errado)
CREATE POLICY tenant_insert ON projetos
AS RESTRICTIVE
FOR INSERT
WITH CHECK (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- ⑤ Papel de admin que bypassa RLS (para migrações, suporte, analytics)
CREATE ROLE admin_interno;
ALTER TABLE projetos OWNER TO admin_interno;  -- owner bypassa por padrão
-- OU: BYPASSRLS em nível de role (cuidado — amplo)
-- ALTER ROLE admin_interno BYPASSRLS;

-- ⑥ Como a aplicação usa (Node.js / TypeScript com pg)
--
--  import { Pool } from 'pg'
--  const pool = new Pool({ ... })
--
--  async function getProjetosTenant(tenantId: string) {
--    const client = await pool.connect()
--    try {
--      // Definir o tenant ANTES de qualquer query
--      await client.query(
--        "SELECT set_config('app.current_tenant_id', $1, true)",
--        [tenantId]
--      )
--      // Agora todas as queries nesta conexão são filtradas pelo tenant
--      const { rows } = await client.query(
--        'SELECT * FROM projetos ORDER BY criado_em DESC'
--        // sem WHERE tenant_id — RLS faz isso automaticamente
--      )
--      return rows
--    } finally {
--      client.release()
--    }
--  }

-- ⑦ TESTE DE ISOLAMENTO — verificar que tenant B não vê dados do tenant A
DO $$
DECLARE
tenant_a UUID := gen_random_uuid();
tenant_b UUID := gen_random_uuid();
cnt INT;
BEGIN
-- Inserir dados para tenant A
PERFORM set_config('app.current_tenant_id', tenant_a::text, true);
INSERT INTO projetos (tenant_id, nome) VALUES (tenant_a, 'Projeto do Tenant A');

-- Mudar para tenant B — não deve ver os dados de A
PERFORM set_config('app.current_tenant_id', tenant_b::text, true);
SELECT COUNT(*) INTO cnt FROM projetos;
ASSERT cnt = 0, 'FALHA: Tenant B está vendo dados do Tenant A!';

RAISE NOTICE 'Isolamento OK: tenant B vê % projetos (esperado: 0)', cnt;
END;
$$;

-- ⑧ MONITORAR políticas ativas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'projetos';`,
    },
  ],
  mindmap: {
    title: "PostgreSQL — mapa mental",
    html: `<style>
.pg1-wrap{display:flex;flex-direction:column;align-items:center;background:#0a0a0a;padding:2rem;border-radius:1rem;font-family:sans-serif}
.pg1-center{background:#336791;color:#fff;padding:.75rem 1.5rem;border-radius:.5rem;font-weight:700;font-size:1.1rem;margin-bottom:1.5rem}
.pg1-branches{display:flex;flex-wrap:wrap;gap:1rem;justify-content:center}
.pg1-branch{background:#1a1a1a;border-radius:.75rem;padding:1rem;min-width:180px;max-width:220px}
.pg1-node{font-weight:600;margin-bottom:.5rem;font-size:.9rem}
.pg1-items{display:flex;flex-direction:column;gap:.25rem}
.pg1-item{color:#ccc;font-size:.8rem;padding:.15rem .3rem;border-left:2px solid #333}
</style>
<div class="pg1-wrap">
<div class="pg1-center">PostgreSQL</div>
<div class="pg1-branches">
  <div class="pg1-branch">
    <div class="pg1-node" style="color:#3b82f6">MVCC &amp; Transações</div>
    <div class="pg1-items">
      <span class="pg1-item">ACID: Atomicidade, Consistência, Isolamento, Durabilidade</span>
      <span class="pg1-item">xmin / xmax por tupla</span>
      <span class="pg1-item">Dead tuples → VACUUM</span>
      <span class="pg1-item">Isolation levels (RC, RR, Serializable)</span>
      <span class="pg1-item">XID wraparound: monitorar age()</span>
    </div>
  </div>
  <div class="pg1-branch">
    <div class="pg1-node" style="color:#22c55e">Índices</div>
    <div class="pg1-items">
      <span class="pg1-item">B-Tree: padrão, igualdade e range</span>
      <span class="pg1-item">GIN: JSONB, arrays, full-text</span>
      <span class="pg1-item">GiST: geometria, ranges</span>
      <span class="pg1-item">BRIN: tabelas append-only grandes</span>
      <span class="pg1-item">Parcial: WHERE condition</span>
      <span class="pg1-item">INCLUDE: Index Only Scan</span>
    </div>
  </div>
  <div class="pg1-branch">
    <div class="pg1-node" style="color:#a855f7">EXPLAIN &amp; Performance</div>
    <div class="pg1-items">
      <span class="pg1-item">EXPLAIN (ANALYZE, BUFFERS)</span>
      <span class="pg1-item">Seq Scan vs Index Scan</span>
      <span class="pg1-item">Rows estimados vs reais</span>
      <span class="pg1-item">pg_stat_statements</span>
      <span class="pg1-item">VACUUM ANALYZE pré-migration</span>
    </div>
  </div>
  <div class="pg1-branch">
    <div class="pg1-node" style="color:#f59e0b">Tipos &amp; Queries</div>
    <div class="pg1-items">
      <span class="pg1-item">JSONB: operadores @&gt;, ?, #&gt;&gt;</span>
      <span class="pg1-item">Window functions: ROW_NUMBER, LAG</span>
      <span class="pg1-item">CTEs recursivas: WITH RECURSIVE</span>
      <span class="pg1-item">Full-text: tsvector + tsquery + GIN</span>
      <span class="pg1-item">Cursor pagination vs OFFSET</span>
    </div>
  </div>
  <div class="pg1-branch">
    <div class="pg1-node" style="color:#06b6d4">Escalabilidade</div>
    <div class="pg1-items">
      <span class="pg1-item">Particionamento: RANGE, LIST, HASH</span>
      <span class="pg1-item">Read replicas (hot standby)</span>
      <span class="pg1-item">Logical replication / CDC</span>
      <span class="pg1-item">PgBouncer: connection pooling</span>
      <span class="pg1-item">pg_partman: automação de partições</span>
    </div>
  </div>
  <div class="pg1-branch">
    <div class="pg1-node" style="color:#ec4899">WAL &amp; Durabilidade</div>
    <div class="pg1-items">
      <span class="pg1-item">WAL antes de dados (fsync no commit)</span>
      <span class="pg1-item">Checkpoint: dirty pages → disco</span>
      <span class="pg1-item">Streaming replication</span>
      <span class="pg1-item">PITR: archive de WAL</span>
      <span class="pg1-item">synchronous_commit configurável</span>
    </div>
  </div>
</div>
</div>`,
    caption: "PostgreSQL entrega ACID completo, índices variados e escalabilidade via particionamento e replicação. Domine EXPLAIN ANALYZE e pg_stat_statements para performance.",
  },
}

export default postgresql
