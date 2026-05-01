import type { SkillContentMap } from "@/types"

const data: SkillContentMap = {

  // ─── P1 ──────────────────────────────────────────────────────────────────

  "postgresql": {
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
  },

  "explain-analyze": {
    tagline: "Ferramenta de análise de plano de execução do Postgres — diagnóstico cirúrgico de queries lentas.",
    why: "EXPLAIN ANALYZE é a ferramenta mais importante para performance tuning em Postgres. Sem ela, otimização é chute no escuro. Saber ler um plano de execução — identificar Seq Scan evitável, rows estimados errados, Nested Loop com outer grande, Hash Join com spill — é competência essencial de qualquer backend pleno que usa Postgres.",
    prerequisite: "PostgreSQL básico (saber escrever SELECT com JOIN e WHERE), noção de índice. Recomendado ter lido a skill postgresql antes desta.",
    summary: "EXPLAIN mostra o plano de execução que o query planner escolheu — antes de executar. EXPLAIN ANALYZE executa a query e sobrepõe os tempos reais ao plano estimado. EXPLAIN (ANALYZE, BUFFERS) adiciona informação de cache hits e misses — essencial para distinguir query lenta de query com cache cold.\n\nO plano é uma árvore de nós. Cada nó tem: tipo (Seq Scan, Index Scan, Hash Join...), cost estimado (startup..total), rows estimados, width (bytes por linha). Com ANALYZE: actual time, rows reais, loops.\n\nRegra de leitura: de dentro para fora — o nó mais indentado executa primeiro. O custo do pai inclui o custo dos filhos. O sinal mais importante é rows estimados vs reais: uma diferença de 10x significa que o planner está trabalhando com estatísticas erradas e vai escolher planos ruins repetidamente para essa query.\n\nO pipeline completo: query → parser (AST) → rewriter (views, rules) → planner (gera e avalia múltiplos planos) → executor (executa o melhor). EXPLAIN intercepta após o planner, antes da execução. EXPLAIN ANALYZE roda o executor e mede.",
    diagrams: [
      {
        title: "Anatomia de um nó EXPLAIN — o que cada campo significa",
        html: `<style>
.exan-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.exan-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(91,155,213,.6);display:inline}
.exan-tip:hover .exan-tb{display:block}
.exan-tb{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:240px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.exan-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.exan-plan{background:#0d1117;border:1px solid #1e3a5f;border-radius:8px;padding:16px;font-size:12px;line-height:2;color:#64748b}
.exan-node-type{color:#5b9bd5;font-weight:700}
.exan-cost{color:#f59e0b}
.exan-rows{color:#a78bfa}
.exan-actual-t{color:#34d399}
.exan-actual-r{color:#22c55e}
.exan-filter{color:#ef4444}
.exan-buf{color:#60a5fa}
.exan-anno{background:#1e293b;border-left:3px solid;border-radius:0 6px 6px 0;padding:6px 12px;margin:6px 0;font-size:10px;color:#64748b;line-height:1.5}
</style>
<div class="exan-wrap">
  <p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Anatomia de um nó EXPLAIN — o que cada campo significa</p>
  <p style="color:#475569;font-size:10px;margin:0 0 16px">Passe o mouse nos termos sublinhados para ver detalhes</p>
  <div class="exan-plan">
    <div>
      <span class="exan-node-type"><span class="exan-tip">Hash Join<span class="exan-tb">Tipo do nó: operação que este nó executa. Pode ser Seq Scan, Index Scan, Index Only Scan, Bitmap Heap Scan, Nested Loop, Hash Join, Merge Join, Sort, Aggregate, Limit, etc. Determina o algoritmo usado.</span></span></span>
      <span class="exan-tip" style="border-color:rgba(245,158,11,.5)"><span class="exan-cost">(cost=<span class="exan-tip" style="border-color:rgba(245,158,11,.5)">45.2<span class="exan-tb">Custo de startup: unidades de custo para retornar a PRIMEIRA linha. Alto em Hash Join (precisa construir hash table antes de retornar qualquer linha). Baixo em Index Scan (pode retornar primeira linha rapidamente).</span></span>..<span class="exan-tip" style="border-color:rgba(245,158,11,.5)">980.5<span class="exan-tb">Custo total: unidades de custo para retornar TODAS as linhas. Não são milissegundos — são unidades relativas baseadas em seq_page_cost, random_page_cost, cpu_tuple_cost, etc. Servem para comparar planos entre si, não medir tempo absoluto.</span></span>)</span><span class="exan-tb">O custo é estimado pelo planner usando estatísticas e parâmetros de custo configuráveis. Custo do pai INCLUI custo dos filhos.</span></span>
      <span class="exan-rows"><span class="exan-tip" style="border-color:rgba(167,139,250,.5)">rows=4980<span class="exan-tb">Estimativa de linhas que este nó retornará. O planner calcula com base em estatísticas de distribuição (histogramas, n_distinct, correlation). Quando rows estimado difere muito do actual rows: estatísticas desatualizadas — rode ANALYZE.</span></span></span>
      <span style="color:#475569">width=<span class="exan-tip" style="border-color:rgba(71,85,105,.5)">72<span class="exan-tb">Tamanho médio em bytes de cada linha retornada por este nó. Útil para estimar memória necessária para Sort e Hash Join (work_mem precisa conter rows × width bytes para evitar spill to disk).</span></span></span>
    </div>
    <div>
      <span style="color:#334155">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
      <span class="exan-actual-t"><span class="exan-tip" style="border-color:rgba(52,211,153,.5)">(actual time=<span class="exan-tip" style="border-color:rgba(52,211,153,.5)">8.2<span class="exan-tb">Tempo real de startup: milissegundos até retornar a primeira linha. Disponível APENAS com EXPLAIN ANALYZE (executa a query de verdade). Compare com cost startup para ver se as estimativas são razoáveis.</span></span>..<span class="exan-tip" style="border-color:rgba(52,211,153,.5)">45.1<span class="exan-tb">Tempo real total: milissegundos para retornar TODAS as linhas deste nó. Se este é o nó raiz, é o tempo total da query. Multiplicar por loops para o tempo real de nós internos em Nested Loops.</span></span></span><span class="exan-tb">Tempo real de execução — só aparece com EXPLAIN ANALYZE. Formato: startup..total em milissegundos.</span></span>
      <span class="exan-actual-r"><span class="exan-tip" style="border-color:rgba(34,197,94,.5)">rows=4987<span class="exan-tb">Linhas reais retornadas pelo nó. Compare com rows estimado. Se a diferença for > 5-10x, o planner tem estatísticas erradas e está escolhendo planos subótimos. Solução: VACUUM ANALYZE na tabela.</span></span></span>
      <span class="exan-tip" style="border-color:rgba(100,116,139,.5)">loops=<span class="exan-tip" style="border-color:rgba(100,116,139,.5)">1<span class="exan-tb">Quantas vezes este nó foi executado. Sempre 1 para nós externos. Em Nested Loop, o inner node tem loops=N onde N é o número de linhas do outer. ATENÇÃO: actual time é POR loop — multiplique por loops para o tempo total do nó. Nested Loop com inner loops=50000 pode ser devastador.</span></span><span class="exan-tb">Número de vezes que o nó foi invocado. Critical em Nested Loops: custo total = actual_time × loops. Um nó inner com time=0.5ms e loops=100000 = 50 segundos de execução, mesmo parecendo rápido isolado.</span></span>)
    </div>
    <div>
      <span style="color:#334155">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
      <span class="exan-buf"><span class="exan-tip" style="border-color:rgba(96,165,250,.5)">Buffers: shared hit=<span class="exan-tip" style="border-color:rgba(96,165,250,.5)">1240<span class="exan-tb">Páginas de 8KB lidas do shared buffer pool (cache em memória). Hit = dado estava em cache — rápido. Ratio ideal: hit/(hit+read) > 99% em OLTP. Se hit ratio for baixo, o dataset é maior que shared_buffers ou as queries acessam dados frios.</span></span> read=<span class="exan-tip" style="border-color:rgba(96,165,250,.5)">4200<span class="exan-tb">Páginas lidas do disco (cache miss). Cada página lida do disco custa muito mais que do cache (random I/O vs memória). read alto indica: dataset maior que shared_buffers, índice não cacheado, ou working set muito grande. Aumentar shared_buffers pode reduzir drasticamente.</span></span><span class="exan-tb">Informação de buffer (cache) — só aparece com EXPLAIN (ANALYZE, BUFFERS). shared hit = do cache. shared read = do disco. dirty = escritas. dirtied = páginas que foram modificadas.</span></span>
    </div>
    <div>
      <span style="color:#334155">&nbsp;&nbsp;→ </span>
      <span style="color:#22c55e">Index Scan</span>
      <span style="color:#475569"> on pedidos</span>
      <span style="color:#f59e0b">(cost=0.4..60.3 rows=1000 width=64)</span>
    </div>
    <div>
      <span style="color:#334155">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
      <span style="color:#34d399">(actual time=0.1..3.2 rows=998 loops=1)</span>
      <span style="color:#475569"> — estimativa boa</span>
    </div>
    <div>
      <span style="color:#334155">&nbsp;&nbsp;→ </span>
      <span class="exan-filter"><span class="exan-tip" style="border-color:rgba(239,68,68,.5)">Seq Scan<span class="exan-tb">Seq Scan = leitura sequencial de toda a tabela. Bom quando retorna >10-20% das linhas (sequential I/O é eficiente). RUIM quando filtro é seletivo — indica falta de índice ou estatísticas erradas que impedem o planner de usar o índice existente.</span></span></span>
      <span style="color:#475569"> on usuarios</span>
      <span style="color:#f59e0b">(cost=0..800.0 rows=50000 width=64)</span>
    </div>
    <div>
      <span style="color:#334155">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
      <span style="color:#34d399">(actual time=0..180.4 rows=50000 loops=1)</span>
    </div>
    <div>
      <span style="color:#334155">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
      <span class="exan-filter"><span class="exan-tip" style="border-color:rgba(239,68,68,.5)">Filter: (status = 'ativo') Rows Removed by Filter: 47800<span class="exan-tb">Filter aparece após Seq Scan: o banco leu TODAS as 50000 linhas e descartou 47800 — só 2200 passaram. Este é o sinal mais claro de que falta índice ou que um índice parcial (WHERE status = 'ativo') resolveria elegantemente.</span></span></span>
    </div>
  </div>
  <div class="exan-anno" style="border-color:#ef4444;margin-top:12px">
    Diagnóstico: Seq Scan em usuarios com 47800 linhas descartadas. Correto: <code>CREATE INDEX ON usuarios(status)</code> ou índice parcial <code>WHERE status = 'ativo'</code>. Rode VACUUM ANALYZE primeiro para garantir que o planner veja o novo índice com estatísticas corretas.
  </div>
  <div class="exan-anno" style="border-color:#5b9bd5">
    Regra de ouro: leia de DENTRO para FORA — o nó mais indentado (mais à direita) executa primeiro e alimenta o pai. O custo do pai já inclui o custo dos filhos. O tempo total da query é o actual time do nó raiz (topo).
  </div>
</div>`,
        caption: "Domine a leitura de um nó e você lê qualquer plano. Os campos críticos: tipo do nó (o algoritmo), rows estimado vs actual (sinal de estatísticas erradas), loops (multiplica o custo em Nested Loops), e buffers read (disco vs cache).",
      },
      {
        title: "Tipos de nó — quando cada um aparece e o que investigar",
        html: `<style>
.exnt-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.exnt-card{background:#1e293b;border-radius:8px;padding:12px 14px;border-left:3px solid;margin-bottom:10px}
.exnt-name{font-size:12px;font-weight:700;margin-bottom:4px}
.exnt-when{font-size:10px;color:#64748b;line-height:1.5;margin-bottom:4px}
.exnt-warn{font-size:10px;color:#f59e0b;line-height:1.5}
.exnt-ok{font-size:10px;color:#22c55e;line-height:1.5}
.exnt-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
</style>
<div class="exnt-wrap">
  <p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Tipos de nó — quando cada um aparece</p>
  <p style="color:#475569;font-size:10px;margin:0 0 16px">Verde = normalmente bom. Amarelo = investigar contexto. Vermelho = investigar sempre em tabelas grandes.</p>
  <div class="exnt-grid">
    <div class="exnt-card" style="border-color:#ef4444">
      <div class="exnt-name" style="color:#ef4444">Seq Scan</div>
      <div class="exnt-when">Lê a tabela inteira sequencialmente.</div>
      <div class="exnt-ok">Bom: tabela pequena (&lt;1000 linhas), filtro retorna &gt;15% das linhas, sem índice necessário.</div>
      <div class="exnt-warn">Ruim: tabela grande com Filter removendo muitas linhas. Sinal: falta índice ou estatísticas erradas (rows estimado muito diferente do real).</div>
      <div style="font-size:10px;color:#475569;margin-top:4px">Fix: CREATE INDEX na coluna do filtro. Ou VACUUM ANALYZE se índice já existe mas planner ignora.</div>
    </div>
    <div class="exnt-card" style="border-color:#22c55e">
      <div class="exnt-name" style="color:#22c55e">Index Scan</div>
      <div class="exnt-when">Navega no B-Tree, busca linhas na heap (random I/O por linha).</div>
      <div class="exnt-ok">Excelente para filtros seletivos (&lt;5% das linhas). O caminho feliz.</div>
      <div class="exnt-warn">Pode ser pior que Seq Scan se correlation baixa (dados fisicamente espalhados) + muitas linhas retornadas.</div>
      <div style="font-size:10px;color:#475569;margin-top:4px">Index Only Scan é ainda melhor: sem acesso à heap. Requer INCLUDE ou colunas no índice.</div>
    </div>
    <div class="exnt-card" style="border-color:#60a5fa">
      <div class="exnt-name" style="color:#60a5fa">Bitmap Heap Scan</div>
      <div class="exnt-when">Coleta rowids via índice(s), ordena por bloco físico, lê heap em ordem sequencial.</div>
      <div class="exnt-ok">Bom quando múltiplos índices são combinados (BitmapAnd/BitmapOr) ou quando Index Scan teria I/O aleatório excessivo.</div>
      <div class="exnt-warn">Lossy quando work_mem é insuficiente: resultado menos preciso, recheck necessário na heap (Recheck Cond aparece no plano).</div>
      <div style="font-size:10px;color:#475569;margin-top:4px">Aparece com Bitmap Index Scan filho que alimenta o Bitmap Heap Scan pai.</div>
    </div>
    <div class="exnt-card" style="border-color:#f59e0b">
      <div class="exnt-name" style="color:#f59e0b">Nested Loop</div>
      <div class="exnt-when">Para cada linha do outer, executa o inner. O inner tem loops=N (N = linhas do outer).</div>
      <div class="exnt-ok">Excelente quando outer tem poucas linhas e inner tem Index Scan rápido.</div>
      <div class="exnt-warn">Catastrófico quando outer tem muitas linhas e inner é Seq Scan. Custo real = inner_cost × N_outer.</div>
      <div style="font-size:10px;color:#475569;margin-top:4px">Fix: índice na join condition do inner. Se outer retorna muitas linhas, Hash Join pode ser melhor.</div>
    </div>
    <div class="exnt-card" style="border-color:#a78bfa">
      <div class="exnt-name" style="color:#a78bfa">Hash Join</div>
      <div class="exnt-when">Constrói hash table do inner (menor), faz probe com cada linha do outer.</div>
      <div class="exnt-ok">Bom para joins grandes sem índice. Parallelizável. Predizível em custo.</div>
      <div class="exnt-warn">Spill to disk quando hash table &gt; work_mem. "Batches: N" no plano indica spill — aumente work_mem para a sessão.</div>
      <div style="font-size:10px;color:#475569;margin-top:4px">Requer startup cost alto (constrói hash primeiro). Pior para queries onde só as primeiras linhas importam (com LIMIT).</div>
    </div>
    <div class="exnt-card" style="border-color:#34d399">
      <div class="exnt-name" style="color:#34d399">Merge Join</div>
      <div class="exnt-when">Percorre dois inputs já ordenados em paralelo (como zipper).</div>
      <div class="exnt-ok">Excelente quando ambos os lados já estão ordenados (Index Scan com mesma chave). Zero overhead de hash.</div>
      <div class="exnt-warn">Requer Sort explícito se inputs não estão ordenados — pode piorar se Sort for caro.</div>
      <div style="font-size:10px;color:#475569;margin-top:4px">Bom para grandes tabelas com índice na join key. Preferido pelo planner em range joins.</div>
    </div>
  </div>
  <div style="background:#1e293b;border-radius:8px;padding:10px 14px;margin-top:4px;font-size:10px;color:#64748b;line-height:1.7;border:1px solid #1e3a5f">
    <span style="color:#5b9bd5;font-weight:700">Fluxo de decisão do planner para joins:</span> outer pequeno + inner indexado → Nested Loop. Tabelas grandes sem índice → Hash Join. Ambos ordenados pelo mesmo campo → Merge Join. O planner estima e escolhe o de menor custo com base nas estatísticas.
  </div>
</div>`,
        caption: "Cada tipo de nó tem um caso ideal e um antipadrão. Saber reconhecer um Nested Loop com outer grande ou um Hash Join com spill é o que transforma um EXPLAIN em um plano de ação.",
      },
      {
        title: "Pipeline da query — onde o EXPLAIN intercepta",
        html: `<style>
.expipe-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.expipe-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(91,155,213,.6);display:inline}
.expipe-tip:hover .expipe-tb{display:block}
.expipe-tb{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:230px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.expipe-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.expipe-stage{background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:11px 14px;text-align:center;min-width:90px}
.expipe-stage-title{font-size:11px;font-weight:700;margin-bottom:4px}
.expipe-stage-desc{font-size:9px;color:#475569;line-height:1.5}
.expipe-arr{color:#336791;font-size:16px;padding:0 4px;display:flex;align-items:center}
.expipe-intercept{background:rgba(239,68,68,.08);border:1.5px solid rgba(239,68,68,.4);border-radius:8px;padding:10px 14px;font-size:11px;color:#fca5a5;text-align:center;margin-top:14px}
.expipe-box{background:#1e293b;border-radius:8px;padding:10px 14px;margin-top:10px;font-size:11px;color:#64748b;line-height:1.7;border:1px solid #1e3a5f}
</style>
<div class="expipe-wrap">
  <p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Pipeline da query — onde o EXPLAIN intercepta</p>
  <p style="color:#475569;font-size:10px;margin:0 0 16px">Da string SQL até os dados retornados ao cliente</p>
  <div style="display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:0;margin-bottom:14px">
    <div class="expipe-stage" style="border-color:#5b9bd5">
      <div class="expipe-stage-title" style="color:#5b9bd5"><span class="expipe-tip">Parser<span class="expipe-tb">Transforma a string SQL em uma AST (Abstract Syntax Tree). Verifica sintaxe — SELECT sem FROM, parênteses não fechados, palavras reservadas erradas. Erros aqui: "syntax error at or near". Não acessa metadados do banco ainda.</span></span></div>
      <div class="expipe-stage-desc">SQL → AST<br>Valida sintaxe</div>
    </div>
    <div class="expipe-arr">→</div>
    <div class="expipe-stage" style="border-color:#a78bfa">
      <div class="expipe-stage-title" style="color:#a78bfa"><span class="expipe-tip">Rewriter<span class="expipe-tb">Aplica regras de reescrita: expande views (substitui a referência à view pelo SELECT da view), aplica row-level security (adiciona WHERE clauses), processa rules (CREATE RULE). Você raramente vê esse estágio explicitamente — mas é por isso que views não têm overhead fixo de chamada de função.</span></span></div>
      <div class="expipe-stage-desc">Expande views<br>Aplica RLS/rules</div>
    </div>
    <div class="expipe-arr">→</div>
    <div class="expipe-stage" style="border-color:#f59e0b;background:rgba(245,158,11,.06)">
      <div class="expipe-stage-title" style="color:#f59e0b"><span class="expipe-tip">Planner<span class="expipe-tb">O coração da inteligência do Postgres. Gera múltiplos planos alternativos para a query (diferentes ordens de join, diferentes índices, diferentes algoritmos). Estima o custo de cada plano usando estatísticas (pg_statistic). Escolhe o de menor custo estimado. EXPLAIN mostra o que o planner escolheu.</span></span></div>
      <div class="expipe-stage-desc">Gera planos<br>Estima custo<br>Escolhe o melhor</div>
    </div>
    <div class="expipe-arr">→</div>
    <div class="expipe-stage" style="border-color:#22c55e;background:rgba(34,197,94,.06)">
      <div class="expipe-stage-title" style="color:#22c55e"><span class="expipe-tip">Executor<span class="expipe-tb">Executa o plano escolhido pelo planner. Lê dados do shared buffer pool ou disco. Aplica filtros, joins, sorts. Retorna linhas ao cliente. EXPLAIN ANALYZE mede o tempo real de cada nó nesta fase. O executor é o único estágio que toca dados reais.</span></span></div>
      <div class="expipe-stage-desc">Executa o plano<br>Lê dados reais<br>Retorna resultado</div>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
    <div class="expipe-intercept">
      <div style="font-weight:700;margin-bottom:4px">EXPLAIN (sem ANALYZE)</div>
      <div style="font-size:10px;color:#94a3b8;line-height:1.5">Intercepta após o Planner, antes do Executor. Mostra o plano com custos ESTIMADOS. Não executa a query — seguro para DELETE/UPDATE/INSERT.</div>
      <div style="font-size:10px;color:#fca5a5;margin-top:4px;font-weight:600">Apenas estimativas — pode estar errado!</div>
    </div>
    <div style="background:rgba(34,197,94,.06);border:1.5px solid rgba(34,197,94,.3);border-radius:8px;padding:10px 14px;font-size:11px;color:#86efac;text-align:center">
      <div style="font-weight:700;margin-bottom:4px">EXPLAIN ANALYZE</div>
      <div style="font-size:10px;color:#94a3b8;line-height:1.5">Deixa o Executor rodar e mede cada nó. Mostra plano + tempos reais + rows reais + loops. Executa a query — use BEGIN/ROLLBACK para DML.</div>
      <div style="font-size:10px;color:#86efac;margin-top:4px;font-weight:600">Realidade — o diagnóstico correto.</div>
    </div>
  </div>
  <div class="expipe-box">
    <span style="color:#5b9bd5;font-weight:700">Por que EXPLAIN (sem ANALYZE) pode enganar:</span> o planner estima 100 linhas mas o executor encontra 100.000. O plano escolhido pelo planner (baseado em 100) pode ser ótimo para 100 linhas mas terrível para 100.000. EXPLAIN ANALYZE revela essa discrepância. Sempre use ANALYZE para diagnóstico real.
  </div>
</div>`,
        caption: "O planner escolhe o plano baseado em estimativas — pode estar errado. O executor é a realidade. EXPLAIN ANALYZE é a ponte entre a estimativa do planner e o que realmente aconteceu.",
      },
    ],
    keypoints: [
      {
        title: "Sintaxe completa do EXPLAIN e o que cada flag revela",
        body: "EXPLAIN tem várias opções que revelam informações diferentes. ANALYZE executa a query e mostra tempos reais. BUFFERS mostra cache hits e misses. VERBOSE adiciona informação extra sobre colunas e schema. FORMAT JSON habilita parsers de visualização como explain.dalibo.com. Use sempre em combinação para diagnóstico completo.",
        code: `-- Diagnóstico padrão: plano estimado (seguro, sem executar)
EXPLAIN SELECT * FROM pedidos WHERE usuario_id = 42;

-- Diagnóstico real: executa + tempos (use em SELECT)
EXPLAIN ANALYZE SELECT * FROM pedidos WHERE usuario_id = 42;

-- Diagnóstico completo: + buffer hits/misses
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM pedidos WHERE usuario_id = 42;

-- Para visualizadores (explain.dalibo.com, depesz.com)
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) SELECT ...;

-- SEGURO para DML — envolver em transação e reverter
BEGIN;
EXPLAIN ANALYZE DELETE FROM sessoes WHERE expira_em < now();
ROLLBACK;

-- VERBOSE: mostra colunas de output de cada nó e schema
EXPLAIN (ANALYZE, BUFFERS, VERBOSE) SELECT ...;`,
      },
      {
        title: "Sinais de alerta — o que procurar primeiro",
        body: "Existe uma sequência de sinais que você deve verificar em ordem de gravidade ao ler um plano. Aprenda esses padrões e o diagnóstico vira mecânico: cada sinal tem uma causa provável e uma solução padrão.",
        code: `-- SINAL 1: Seq Scan em tabela grande com Filter removendo muitas linhas
-- Seq Scan on pedidos (cost=0..45000 rows=50000)
--   Filter: (status = 'pendente')
--   Rows Removed by Filter: 49800  ← 99,6% descartados
-- Fix: CREATE INDEX ON pedidos(status); ou índice parcial

-- SINAL 2: rows estimados vs reais muito diferentes
-- (cost=... rows=100 ...)          ← planner estima 100
-- (actual time=... rows=98420 ...) ← realidade: 98k linhas!
-- Fix: VACUUM ANALYZE pedidos; para atualizar estatísticas

-- SINAL 3: Nested Loop com inner loops alto
-- Nested Loop (loops=1)
--   -> Seq Scan on usuarios (loops=1, rows=10000)  ← outer
--   -> Seq Scan on pedidos  (loops=10000)           ← catástrofe!
-- actual time por loop = 5ms; total = 5ms × 10000 = 50 segundos
-- Fix: CREATE INDEX ON pedidos(usuario_id);

-- SINAL 4: Hash Join com Batches > 1 (spill to disk)
-- Hash (actual rows=500000 loops=1)
--   Buckets: 32768  Batches: 8  Memory Usage: 4096kB ← spill!
-- Fix: SET work_mem = '256MB'; para esta sessão`,
      },
      {
        title: "Rows estimados vs reais — o sinal mais importante",
        body: "A diferença entre rows estimados (pelo planner) e rows reais (pelo executor) é o sinal mais importante do EXPLAIN ANALYZE. Quando o planner estima 100 e o executor encontra 100.000, o plano escolhido pode ser completamente errado. A causa usual é estatísticas desatualizadas. VACUUM ANALYZE atualiza. CREATE STATISTICS ajuda com correlações entre colunas.",
        code: `-- Diagnóstico de estatísticas desatualizadas
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM pedidos
WHERE status = 'pendente' AND usuario_id = 42;

-- Se plano mostrar: rows=1 mas actual rows=5000
-- O planner subestimou a seletividade da combinação de filtros

-- Solução 1: atualizar estatísticas
VACUUM ANALYZE pedidos;

-- Solução 2: aumentar sample para colunas correlacionadas
ALTER TABLE pedidos ALTER COLUMN status
  SET STATISTICS 500;  -- default é 100; max é 10000
ANALYZE pedidos;

-- Solução 3: estatísticas de correlação entre colunas (Postgres 10+)
CREATE STATISTICS pedidos_status_usuario
  ON status, usuario_id FROM pedidos;
ANALYZE pedidos;

-- Verificar o que o planner sabe sobre uma coluna
SELECT * FROM pg_stats WHERE tablename = 'pedidos' AND attname = 'status';`,
      },
      {
        title: "Identificar Seq Scan evitável e criar índice certo",
        body: "Nem todo Seq Scan é problema — tabelas pequenas e queries que retornam muitas linhas devem usar Seq Scan. O Seq Scan evitável é aquele em tabela grande com Filter descartando a maioria das linhas. O índice certo depende do tipo de filtro: igualdade (B-Tree simples), múltiplos valores (B-Tree composto ou parcial), JSONB (GIN), range em tabela de log (BRIN).",
        code: `-- ANTES: Seq Scan com Filter removendo 98% das linhas
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, total FROM pedidos
WHERE usuario_id = 42 AND status = 'pago';
-- Seq Scan on pedidos  (rows=500000)
--   Filter: (usuario_id = 42 AND status = 'pago')
--   Rows Removed by Filter: 498750

-- SOLUÇÃO 1: índice composto (mais seletivo)
CREATE INDEX ON pedidos(usuario_id, status);

-- SOLUÇÃO 2: índice parcial (se status é raramente 'pago')
CREATE INDEX ON pedidos(usuario_id) WHERE status = 'pago';

-- SOLUÇÃO 3: INCLUDE para Index Only Scan (sem ir à heap)
CREATE INDEX ON pedidos(usuario_id, status) INCLUDE (total, criado_em);
-- SELECT id, total, criado_em FROM pedidos WHERE usuario_id = 42 AND status = 'pago'
-- agora usa Index Only Scan — não toca a heap

-- Verificar se índice está sendo usado após criação
VACUUM ANALYZE pedidos;  -- atualizar stats
EXPLAIN (ANALYZE, BUFFERS) SELECT ...;  -- verificar plano`,
      },
      {
        title: "Identificar e resolver Hash Join com spill",
        body: "Hash Join constrói uma hash table do lado menor do join. Se a hash table não cabe em work_mem, faz spill para disco (Batches > 1). Performance cai drasticamente — I/O de disco em vez de memória. Soluções: aumentar work_mem para a sessão, ou reordenar o join para que o lado menor seja realmente menor.",
        code: `-- Identificar Hash Join com spill no plano
EXPLAIN (ANALYZE, BUFFERS)
SELECT u.nome, COUNT(p.id), SUM(p.total)
FROM usuarios u
JOIN pedidos p ON p.usuario_id = u.id
GROUP BY u.id, u.nome;

-- Plano problemático:
-- Hash (actual rows=2000000 loops=1)
--   Buckets: 32768  Batches: 16  Memory Usage: 4096kB  ← Batches > 1 = spill!
--   Buffers: shared read=50000 temp read=8000 written=8000  ← temp = disco

-- Solução 1: aumentar work_mem para a sessão
SET work_mem = '256MB';
EXPLAIN (ANALYZE, BUFFERS) SELECT ...;  -- verificar se Batches volta para 1

-- Solução 2: verificar se join pode ser reescrito
-- com filtros que reduzam o tamanho antes do join

-- Solução 3 (global, cuidado): aumentar work_mem no postgresql.conf
-- work_mem = 64MB  (padrão é 4MB, muito baixo para joins grandes)
-- Atenção: work_mem × max_connections = memória máxima possível`,
      },
      {
        title: "pg_stat_statements — priorizar o que otimizar",
        body: "EXPLAIN analisa uma query isolada em um momento. pg_stat_statements acumula estatísticas de todas as queries ao longo do tempo. A combinação é poderosa: pg_stat_statements para descobrir o que otimizar (maior impacto total), EXPLAIN ANALYZE para diagnosticar como otimizar. Sem pg_stat_statements, você pode estar otimizando a query que mais aparece no log mas não a que mais custa.",
        code: `-- Habilitar (requer restart): shared_preload_libraries = 'pg_stat_statements'
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Top 10 queries por custo total (o que mais pesa no banco)
SELECT
  LEFT(query, 100) AS query,
  calls,
  ROUND(total_exec_time / 1000, 1) AS total_segundos,
  ROUND(mean_exec_time, 2) AS media_ms,
  ROUND(stddev_exec_time, 2) AS stddev_ms,
  rows
FROM pg_stat_statements
ORDER BY total_exec_time DESC LIMIT 10;

-- Queries com maior variação de latência (inconsistentes = planner instável)
SELECT LEFT(query, 80),
  ROUND(mean_exec_time, 2) AS media_ms,
  ROUND(stddev_exec_time / NULLIF(mean_exec_time, 0), 2) AS coef_variacao
FROM pg_stat_statements
WHERE calls > 100 AND mean_exec_time > 10
ORDER BY coef_variacao DESC LIMIT 10;

-- Queries com cache miss alto (lendo muito disco)
SELECT LEFT(query, 80), calls,
  shared_blks_hit, shared_blks_read,
  ROUND(100.0 * shared_blks_hit /
    NULLIF(shared_blks_hit + shared_blks_read, 0), 1) AS hit_ratio
FROM pg_stat_statements
WHERE shared_blks_read > 1000
ORDER BY shared_blks_read DESC LIMIT 10;`,
      },
      {
        title: "Índice parcial — criar índice que o planner realmente usa",
        body: "Um índice pode existir mas o planner escolher Seq Scan. Causas: estatísticas desatualizadas, índice não seletivo, ou a query não matcha o índice. Índice parcial (com WHERE) cria um índice menor e mais seletivo. O planner prefere índices parciais quando o predicado da query é compatível com o predicado do índice.",
        code: `-- Problema: planner ignora índice existente
CREATE INDEX ON pedidos(status);  -- existe
EXPLAIN SELECT * FROM pedidos WHERE status = 'pendente';
-- Resultado: Seq Scan!  ← planner achou Seq Scan mais barato

-- Por que? status tem poucos valores distintos — B-Tree em coluna
-- de baixa cardinalidade pode ser ignorado

-- Diagnóstico: ver o que acontece sem Seq Scan
SET enable_seqscan = off;
EXPLAIN SELECT * FROM pedidos WHERE status = 'pendente';
-- Agora usa índice. É mais rápido? Se sim, estatísticas estão erradas
VACUUM ANALYZE pedidos;
RESET enable_seqscan;
EXPLAIN SELECT * FROM pedidos WHERE status = 'pendente';

-- Solução definitiva: índice parcial (só os 'pendente')
DROP INDEX IF EXISTS pedidos_status_idx;
CREATE INDEX ON pedidos(criado_em) WHERE status = 'pendente';
-- Índice muito menor (só 2% das linhas), muito seletivo
-- O planner prefere este índice para queries com WHERE status = 'pendente'`,
      },
    ],
    cheatsheet: {
      title: "EXPLAIN ANALYZE — cheatsheet de diagnóstico",
      html: `<style>
.excs-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:20px}
.excs-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.excs-section{background:#1e293b;border-radius:8px;padding:14px;border-left:3px solid #5b9bd5}
.excs-section-title{color:#5b9bd5;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px}
.excs-item{font-size:11px;color:#64748b;line-height:1.7;padding:3px 0;border-bottom:1px solid rgba(51,65,85,.4)}
.excs-item:last-child{border-bottom:none}
.excs-item code{color:#93c5fd;background:rgba(147,197,253,.08);padding:1px 5px;border-radius:3px;font-size:10px}
.excs-full{grid-column:1/-1}
.excs-bad{color:#ef4444}
.excs-good{color:#22c55e}
.excs-warn{color:#f59e0b}
</style>
<div class="excs-wrap">
  <p style="color:#e2e8f0;font-size:12px;margin:0 0 14px;font-weight:600">EXPLAIN ANALYZE — cheatsheet de diagnóstico</p>
  <div class="excs-grid">
    <div class="excs-section">
      <div class="excs-section-title">Sintaxe e flags</div>
      <div class="excs-item"><code>EXPLAIN SELECT ...</code> — plano estimado, seguro para DML</div>
      <div class="excs-item"><code>EXPLAIN ANALYZE SELECT ...</code> — executa + tempos reais</div>
      <div class="excs-item"><code>EXPLAIN (ANALYZE, BUFFERS) ...</code> — + cache hits/reads</div>
      <div class="excs-item"><code>EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) ...</code> — para visualizadores</div>
      <div class="excs-item"><code>EXPLAIN (ANALYZE, BUFFERS, VERBOSE) ...</code> — colunas de output</div>
      <div class="excs-item"><code>BEGIN; EXPLAIN ANALYZE DELETE ...; ROLLBACK;</code> — seguro para DML</div>
      <div class="excs-item"><code>SET enable_seqscan = off;</code> — debug: força índice</div>
      <div class="excs-item"><code>RESET enable_seqscan;</code> — restaurar comportamento normal</div>
    </div>
    <div class="excs-section">
      <div class="excs-section-title">Campos de cada nó</div>
      <div class="excs-item"><code>cost=startup..total</code> — unidades relativas, não ms</div>
      <div class="excs-item"><code>rows=N</code> — linhas estimadas pelo planner</div>
      <div class="excs-item"><code>width=N</code> — bytes médios por linha</div>
      <div class="excs-item"><code>actual time=X..Y</code> — ms (startup..total) por loop</div>
      <div class="excs-item"><code>actual rows=N</code> — linhas reais (compare com estimado)</div>
      <div class="excs-item"><code>loops=N</code> — vezes que o nó executou (custo real = time × loops)</div>
      <div class="excs-item"><code>shared hit=N read=N</code> — cache hits vs leituras de disco</div>
      <div class="excs-item"><code>temp read=N written=N</code> — spill para disco (ruim)</div>
    </div>
    <div class="excs-section">
      <div class="excs-section-title">Sinais de alerta</div>
      <div class="excs-item"><span class="excs-bad">Seq Scan</span> em tabela grande + Filter com muitas linhas removidas</div>
      <div class="excs-item"><span class="excs-bad">rows estimado ≫ actual rows</span> — rode VACUUM ANALYZE</div>
      <div class="excs-item"><span class="excs-bad">rows estimado ≪ actual rows</span> — plano escolhido pode ser errado</div>
      <div class="excs-item"><span class="excs-bad">Nested Loop</span> com inner loops muito alto (N × custo_inner)</div>
      <div class="excs-item"><span class="excs-bad">Hash Batches &gt; 1</span> — spill para disco, aumente work_mem</div>
      <div class="excs-item"><span class="excs-bad">temp read/written alto</span> — Sort ou Hash com spill</div>
      <div class="excs-item"><span class="excs-bad">shared read alto</span> — cache miss, dataset &gt; shared_buffers</div>
    </div>
    <div class="excs-section">
      <div class="excs-section-title">Tipos de nó: quando é bom</div>
      <div class="excs-item"><span class="excs-good">Index Only Scan</span> — melhor possível, sem heap access</div>
      <div class="excs-item"><span class="excs-good">Index Scan</span> — bom para filtros seletivos (&lt;5% das linhas)</div>
      <div class="excs-warn">Bitmap Heap Scan</span> — ok com múltiplos índices</div>
      <div class="excs-item"><span class="excs-warn">Seq Scan</span> — ok em tabelas pequenas ou retorno &gt;15%</div>
      <div class="excs-item"><span class="excs-good">Nested Loop</span> — ótimo com inner indexado e outer pequeno</div>
      <div class="excs-item"><span class="excs-good">Merge Join</span> — ótimo quando ambos inputs já ordenados</div>
      <div class="excs-item"><span class="excs-warn">Hash Join</span> — bom sem índice, ruim com spill</div>
    </div>
    <div class="excs-section excs-full">
      <div class="excs-section-title">Receituário de diagnóstico</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0">
        <div>
          <div class="excs-item">Seq Scan indesejado → <code>VACUUM ANALYZE</code> + criar índice</div>
          <div class="excs-item">Rows errados → <code>VACUUM ANALYZE tabela</code> + <code>CREATE STATISTICS</code></div>
          <div class="excs-item">Hash Join spill → <code>SET work_mem = '256MB';</code></div>
          <div class="excs-item">Nested Loop com outer grande → índice na join condition do inner</div>
        </div>
        <div>
          <div class="excs-item">Planner ignora índice → <code>SET enable_seqscan = off</code> para debug</div>
          <div class="excs-item">Índice não seletivo → índice parcial com WHERE</div>
          <div class="excs-item">Cache miss alto → aumentar <code>shared_buffers</code></div>
          <div class="excs-item">Sort caro → índice coberto com a ordem certa</div>
        </div>
      </div>
    </div>
  </div>
</div>`,
      caption: "Tenha este cheatsheet aberto ao lado do explain.dalibo.com. A combinação de visualizador + cheatsheet de sinais transforma qualquer plano em diagnóstico acionável em 2 minutos.",
    },
    gotchas: [
      "EXPLAIN sem ANALYZE mostra apenas estimativas — pode estar completamente errado. Nunca tome decisão de otimização baseado só em EXPLAIN sem ANALYZE. A query precisa executar para revelar o comportamento real.",
      "EXPLAIN ANALYZE em DELETE/UPDATE/INSERT sem transação executa a operação de verdade! Sempre envolva em BEGIN; EXPLAIN ANALYZE ...; ROLLBACK; para testar DML com segurança.",
      "Cost não é milissegundo: é unidade relativa baseada em seq_page_cost, random_page_cost e parâmetros de CPU. Só serve para comparar planos entre si. cost=1000 pode significar 1ms ou 10 segundos dependendo do hardware.",
      "loops=N no inner do Nested Loop: actual time é POR loop, não total. Um nó com actual time=0.5ms e loops=50000 = 25 segundos reais de execução. Sempre multiplique.",
      "Rows estimado correto não garante plano correto: a correlação entre colunas também importa. WHERE status = 'ativo' AND regiao = 'SP' pode ser muito mais seletiva que cada filtro isolado. Use CREATE STATISTICS para ensinar o planner sobre correlações.",
      "EXPLAIN ANALYZE roda a query duas vezes internamente para algumas operações (por causa do Postgres planning mode). Para queries muito lentas, use EXPLAIN com SET enable_seqscan = off para debug sem executar.",
      "Hash Join Batches > 1 significa spill para disco — work_mem insuficiente. A solução não é sempre aumentar work_mem globalmente: work_mem × max_connections × sorts_por_query pode exceder a RAM do servidor. Aumente por sessão para queries específicas.",
    ],
    interview: [
      {
        q: "Como você lê um plano EXPLAIN ANALYZE?",
        level: "pleno",
        a: "<p>De <strong>dentro para fora</strong> — o nó mais indentado executa primeiro e alimenta o pai. O custo do pai inclui o custo dos filhos. O actual time do nó raiz é o tempo total da query.</p><p>Para cada nó verifico: (1) <strong>tipo</strong> — Seq Scan em tabela grande é sinal de alerta; (2) <strong>rows estimado vs actual rows</strong> — diferença de 10x indica estatísticas desatualizadas; (3) <strong>loops</strong> — em Nested Loops, multiply actual time × loops para o custo real; (4) <strong>Buffers</strong> — shared read alto indica cache miss.</p><p>Sinais que priorizo: Seq Scan com Filter removendo muitas linhas (falta índice), Hash Join com Batches > 1 (spill para disco, precisa de mais work_mem), rows estimados completamente errados (rode VACUUM ANALYZE).</p>",
        tip: "Descreva o processo sistematicamente: de dentro para fora, os 4 campos de cada nó, os 3 sinais de alerta. Isso demonstra processo, não só conhecimento pontual.",
      },
      {
        q: "Por que o planner escolheria Seq Scan quando existe um índice?",
        level: "senior",
        a: "<p>Vários motivos legítimos: (1) <strong>filtro retorna muitas linhas</strong> — Index Scan faz random I/O por linha, Seq Scan é I/O sequencial. Para >10-15% das linhas, Seq Scan é mais rápido; (2) <strong>correlation baixa</strong> — dados físicamente espalhados no disco fazem Index Scan ter I/O aleatório excessivo; (3) <strong>estatísticas desatualizadas</strong> — planner subestima ou superestima a seletividade e escolhe plano errado.</p><p>Para diagnosticar: <code>SET enable_seqscan = off; EXPLAIN SELECT ...; RESET enable_seqscan;</code>. Se com índice forçado a query fica mais rápida, as estatísticas estão erradas — rode <code>VACUUM ANALYZE</code>. Se ainda assim Seq Scan é mais rápido, o índice realmente não ajuda para essa query.</p>",
      },
      {
        q: "O que é pg_stat_statements e por que é mais útil que EXPLAIN isolado?",
        level: "pleno",
        a: "<p>EXPLAIN analisa uma query em um momento específico. <strong>pg_stat_statements</strong> acumula estatísticas de todas as queries executadas ao longo do tempo: calls, total_exec_time, mean_exec_time, stddev, rows, cache hits/reads.</p><p>A diferença crítica: uma query de 500ms chamada 1 vez por dia custa 500ms/dia. Uma query de 10ms chamada 100.000 vezes/dia custa 1.000.000ms = 17 minutos de CPU/dia. EXPLAIN nunca revelaria que a segunda é o problema real. pg_stat_statements sim — ela aparece no topo por total_exec_time.</p><p>Fluxo correto: pg_stat_statements para priorizar o que otimizar → EXPLAIN ANALYZE na query identificada para diagnosticar como otimizar. Sem pg_stat_statements, você opera às cegas sobre o impacto real.</p>",
        tip: "Esse é o diferencial de quem trabalhou em produção. Mencionar o impacto de volume (calls × mean_time) vs latência isolada demonstra maturidade operacional.",
      },
      {
        q: "Como identificar e resolver um Nested Loop problemático?",
        level: "senior",
        a: "<p>No plano: o inner node mostra loops=N onde N é alto. O custo real = actual time × loops. Ex: inner com actual time=2ms e loops=50000 = 100 segundos de execução, mesmo parecendo rápido isolado.</p><p>O Nested Loop é problemático quando: o outer retorna muitas linhas, e o inner não tem índice na join condition (vira Seq Scan × N_outer = catástrofe). O Nested Loop é ótimo quando: outer tem poucas linhas e inner usa Index Scan eficiente.</p><p>Diagnóstico e fix: <code>EXPLAIN (ANALYZE, BUFFERS)</code> mostrará o inner com loops alto. Fix: criar índice na coluna de join do inner. Se o outer retorna muitas linhas, o planner pode escolher Hash Join como alternativa — que é melhor para esse cenário.</p>",
      },
      {
        q: "Como você criaria um índice eficiente baseado em um plano EXPLAIN?",
        level: "pleno",
        a: "<p>A análise do plano me diz exatamente o que criar: (1) se é Seq Scan com igualdade simples, B-Tree na coluna; (2) se são múltiplos filtros de igualdade juntos, índice composto na ordem mais seletiva primeiro; (3) se Filter remove quase tudo com um valor específico, índice parcial com WHERE; (4) se Index Scan está buscando heap para colunas extras, INCLUDE nessas colunas para Index Only Scan.</p><p>Após criar o índice, sempre: <code>VACUUM ANALYZE tabela;</code> para atualizar estatísticas — o planner precisa ver as estatísticas do novo índice. Depois verificar com EXPLAIN (ANALYZE, BUFFERS) se o índice é usado e se o plano melhorou de fato.</p>",
      },
      {
        q: "O que significa shared buffers hit e read em EXPLAIN BUFFERS?",
        level: "pleno",
        a: "<p><strong>shared hit</strong>: páginas lidas do shared buffer pool (cache em memória do Postgres). Rápido — nanosegundos. <strong>shared read</strong>: páginas lidas do disco (cache miss). Lento — microsegundos a milissegundos dependendo do storage.</p><p>Hit ratio = hit / (hit + read). Deve ser >99% em workloads OLTP normais. Hit ratio baixo indica: dataset maior que shared_buffers, working set não cabe em cache, ou acesso a dados frios (histórico raramente acessado).</p><p>Isso é crucial para diferenciar: query de 50ms com hit ratio 99% vai ser sempre 50ms. Query de 50ms com hit ratio 60% pode ser 500ms em produção quando o cache está frio (após restart, ou em horas de baixo uso). BUFFERS revela se o benchmark de EXPLAIN ANALYZE é representativo da produção.</p>",
      },
      {
        q: "O que é pg_hint_plan e quando usar?",
        level: "senior",
        a: "<p>pg_hint_plan é uma extensão que permite forçar o planner a usar um plano específico via hints em comentários SQL. Permite forçar: tipo de scan (<code>/*+ SeqScan(t) */</code>, <code>/*+ IndexScan(t idx) */</code>), tipo de join (<code>/*+ HashJoin(t1 t2) */</code>, <code>/*+ NestLoop(t1 t2) */</code>), ordem de join (<code>/*+ Leading(t1 t2 t3) */</code>).</p><p>Quando usar: o planner continua escolhendo plano ruim mesmo após VACUUM ANALYZE e CREATE STATISTICS, você tem evidência via EXPLAIN ANALYZE de que outro plano é melhor, e a query é crítica o suficiente para justificar o override. É um último recurso — primeiro esgote as soluções via estatísticas e índices. Hints se tornam dívida técnica: precisam ser revisados quando o schema ou a distribuição de dados muda.</p>",
      },
      {
        q: "Como o EXPLAIN revela problemas de Hash Join com spill to disk?",
        level: "pleno",
        a: "<p>No plano: o nó Hash mostra <code>Batches: N</code> onde N > 1. Com BUFFERS, você vê <code>temp read=N written=N</code> — leituras e escritas em arquivo temporário (disco). Um Hash Join com Batches=8 usa ~8× mais I/O do que com Batches=1.</p><p>O Hash Join spill ocorre quando a hash table do inner não cabe em work_mem. Solução imediata: <code>SET work_mem = '256MB';</code> antes da query e verificar se Batches volta para 1. Mas cuidado: work_mem × max_connections × sorts/hashes pode exceder a RAM total.</p><p>Estratégia de produção: SET work_mem alto por sessão em queries específicas (via SET por usuário, por database, ou por transaction). Nunca aumente globalmente sem calcular o consumo máximo possível.</p>",
      },
      {
        q: "Como diagnosticar rows estimados errados e corrigi-los?",
        level: "senior",
        a: "<p>Rows estimado muito diferente do actual rows é o sinal mais importante de problemas de planner. Causas: (1) <strong>ANALYZE desatualizado</strong> — tabela mudou muito desde o último ANALYZE, estatísticas não refletem a realidade; (2) <strong>distribuição não-uniforme</strong> — histograma padrão (100 buckets) não captura distribuições com muitos outliers; (3) <strong>correlação entre colunas</strong> — o planner não sabe que WHERE status='ativo' AND regiao='SP' é muito mais seletivo do que cada filtro isolado.</p><p>Soluções em ordem: (1) VACUUM ANALYZE na tabela; (2) aumentar target de estatísticas: <code>ALTER TABLE t ALTER COLUMN c SET STATISTICS 500;</code>; (3) CREATE STATISTICS para correlações entre colunas. Verificar após cada passo com EXPLAIN ANALYZE se rows estimado melhorou.</p>",
      },
      {
        q: "Qual a diferença entre Index Scan e Index Only Scan?",
        level: "pleno",
        a: "<p><strong>Index Scan</strong>: usa o índice para encontrar os rowids das linhas relevantes, depois vai à heap (tabela principal) para buscar as colunas de output. Cada acesso à heap é random I/O potencial — o índice economiza a varredura completa mas ainda requer acesso à heap.</p><p><strong>Index Only Scan</strong>: todas as colunas necessárias para o output estão no índice — sem necessidade de acessar a heap. É o melhor caso possível. Requer que as colunas no SELECT e no WHERE estejam todas cobertas pelo índice (via INCLUDE ou como parte da chave do índice).</p><p>Para criar Index Only Scan: <code>CREATE INDEX ON pedidos(usuario_id, status) INCLUDE (total, criado_em)</code>. A query <code>SELECT total, criado_em FROM pedidos WHERE usuario_id = 42 AND status = 'pago'</code> usará Index Only Scan sem tocar a heap. O visibility map precisa estar atualizado (VACUUM faz isso) para Index Only Scan funcionar corretamente.</p>",
      },
      {
        q: "Como investigar lock contention que causa queries lentas?",
        level: "senior",
        a: "<p>Uma query 'lenta' pode na verdade estar bloqueada esperando um lock. EXPLAIN ANALYZE de uma query individual não revela isso — você precisa olhar pg_stat_activity e pg_locks durante o problema.</p><p>Diagnóstico em produção: <code>SELECT pid, pg_blocking_pids(pid) AS bloqueadores, wait_event_type, wait_event, state, LEFT(query, 80) FROM pg_stat_activity WHERE wait_event_type IS NOT NULL;</code>. Mostra quem está esperando e quem está bloqueando. Use <code>pg_blocking_pids</code> para encontrar a cadeia.</p><p>Soluções comuns: matar transações 'idle in transaction' antigas (<code>SELECT pg_terminate_backend(pid)</code>), reduzir tempo de transação na aplicação, evitar DDL em horário de pico (ALTER TABLE precisa de AccessExclusiveLock), usar SKIP LOCKED para filas. Configurar <code>lock_timeout</code> e <code>statement_timeout</code> globalmente para evitar locks indefinidos.</p>",
      },
      {
        q: "Como o auto_explain pode ajudar em produção?",
        level: "senior",
        a: "<p>auto_explain é uma extensão que loga automaticamente o plano EXPLAIN de queries que excedem um threshold de tempo. Útil para capturar queries problemáticas ocasionais que não estão presentes no momento em que você investiga.</p><p>Configuração: no postgresql.conf, <code>shared_preload_libraries = 'auto_explain'</code>, <code>auto_explain.log_min_duration = '1s'</code> (loga queries > 1s), <code>auto_explain.log_analyze = on</code> (inclui ANALYZE), <code>auto_explain.log_buffers = on</code>, <code>auto_explain.log_format = 'json'</code>.</p><p>Cuidados: log_analyze adiciona overhead (mede tempos reais) — em workloads de altíssimo volume, considere log_min_duration alto. log_format = 'json' facilita parsing automático com tools como pgBadger ou scripts customizados. Não confunda com pg_stat_statements: auto_explain mostra o plano específico de cada execução, pg_stat_statements agrega métricas por padrão de query.</p>",
      },
    ],
    mnemonics: [
      {
        label: "TREB — campos de cada nó",
        trick: "Type, Rows, Estimated, Buffers",
        explanation: "Os 4 elementos a inspecionar em cada nó do EXPLAIN. Type: o algoritmo (Seq Scan, Index Scan, Hash Join...). Rows: linhas reais retornadas. Estimated: comparado com rows reais — diferença grande = estatísticas erradas. Buffers: shared hit (cache) vs read (disco) — revela se o benchmark é representativo.",
      },
      {
        label: "ABRIR — flags do EXPLAIN",
        trick: "ANALYZE, BUFFERS, FORMAT JSON, VERBOSE, SETTINGS",
        explanation: "Sequência de flags úteis. ANALYZE: executa de verdade. BUFFERS: cache hits/misses. FORMAT JSON: para parsers e visualizadores. VERBOSE: mostra colunas de output e schema. SETTINGS: lista parâmetros não-default que podem afetar o plano (Postgres 12+).",
      },
      {
        label: "SHIN — tipos de scan",
        trick: "Seq Scan, Heap Scan (Bitmap), Index Scan, INdex Only Scan",
        explanation: "Os 4 tipos de leitura de dados, do menos seletivo ao mais eficiente. Seq Scan: lê tabela inteira. Bitmap Heap Scan: combina índices, ordena por bloco. Index Scan: usa índice + acessa heap. Index Only Scan: usa índice apenas, sem heap — o melhor caso. INCLUDE habilita Index Only Scan.",
      },
      {
        label: "HSAN — sinais de alerta",
        trick: "Hash spill, Seq inesperado, Acto-rows mismatch, Nested loop pesado",
        explanation: "Os 4 sinais que disparam ação imediata. Hash spill (Batches > 1): aumentar work_mem. Seq Scan inesperado: criar índice ou rodar VACUUM ANALYZE. Actual rows muito diferente do estimated: estatísticas desatualizadas. Nested Loop com loops alto: índice na join condition do inner.",
      },
    ],
    exercises: [
      {
        level: "iniciante",
        title: "Identificar Seq Scan evitável e propor índice",
        description: "Você tem uma tabela usuarios(id, email, status, criado_em) com 1M linhas. A query SELECT * FROM usuarios WHERE status = 'ativo' ORDER BY criado_em DESC LIMIT 20 está fazendo Seq Scan. Use EXPLAIN ANALYZE para confirmar. Proponha um índice e valide com EXPLAIN novamente que o plano mudou para Index Scan.",
        concepts: ["EXPLAIN ANALYZE", "Seq Scan", "índice composto"],
        hint: "Comece com EXPLAIN (ANALYZE, BUFFERS) SELECT ... — observe Filter e Rows Removed by Filter. Crie CREATE INDEX ON usuarios(status, criado_em DESC). Rode VACUUM ANALYZE usuarios e re-execute EXPLAIN para ver Index Scan.",
      },
      {
        level: "intermediario",
        title: "Diagnosticar Hash Join com spill",
        description: "Uma query de relatório com JOIN entre dois milhões de linhas está demorando 30 segundos. EXPLAIN (ANALYZE, BUFFERS) mostra 'Batches: 16' no Hash node e 'temp written=8000' no Buffers. Identifique o problema. Proponha duas soluções: uma local (SET) e outra estrutural.",
        concepts: ["Hash Join", "spill to disk", "work_mem", "temp files"],
        hint: "Batches > 1 = hash table não cabe em work_mem, spill para disco temporário. Solução local: SET work_mem = '256MB' antes da query. Solução estrutural: aumentar work_mem no postgresql.conf (calcular com cuidado: work_mem × max_connections × hashes_por_query) ou reescrever query para reduzir o lado menor do join via filtros prévios.",
      },
      {
        level: "intermediario",
        title: "Comparar Index Scan vs Index Only Scan",
        description: "Em uma tabela pedidos(id, usuario_id, status, total, criado_em), crie um índice em (usuario_id, status). Execute SELECT total FROM pedidos WHERE usuario_id = 42 AND status = 'pago' e observe Index Scan. Modifique o índice para INCLUDE (total) e re-execute. Compare os Buffers em cada caso.",
        concepts: ["Index Scan", "Index Only Scan", "INCLUDE", "visibility map"],
        hint: "DROP INDEX e CREATE INDEX ... INCLUDE (total). VACUUM pedidos para atualizar visibility map. Compare 'shared hit' antes (precisa ir à heap) e depois (Index Only Scan, sem heap access). Em tabelas grandes a diferença pode ser 5-10x em latência.",
      },
      {
        level: "senior",
        title: "Investigar query com rows estimados drasticamente errados",
        description: "Uma query com filtro composto está lenta. EXPLAIN ANALYZE mostra rows=10 estimado mas actual rows=50000. Use a sequência completa de diagnóstico: VACUUM ANALYZE, aumentar STATISTICS target, criar CREATE STATISTICS para correlação entre colunas. Documente cada passo e o impacto em rows estimado.",
        concepts: ["estatísticas", "ANALYZE", "extended statistics", "planner"],
        hint: "Passo 1: VACUUM ANALYZE tabela; re-EXPLAIN. Se ainda errado, passo 2: ALTER TABLE ALTER COLUMN col SET STATISTICS 1000; ANALYZE; re-EXPLAIN. Se ainda errado (correlação entre 2 colunas), passo 3: CREATE STATISTICS s_correl (dependencies, mcv) ON col1, col2 FROM tabela; ANALYZE; re-EXPLAIN. Cada passo deve mostrar rows estimado convergindo para o actual.",
      },
    ],
    resources: [
      { title: "explain.dalibo.com — visualizador interativo", url: "https://explain.dalibo.com/", kind: "pratica" },
      { title: "depesz EXPLAIN — anotações por nó", url: "https://explain.depesz.com/", kind: "pratica" },
      { title: "pgMustard — dicas automáticas no EXPLAIN", url: "https://www.pgmustard.com/docs/explain", kind: "docs" },
      { title: "PostgreSQL — EXPLAIN docs oficiais", url: "https://www.postgresql.org/docs/current/sql-explain.html", kind: "docs" },
      { title: "Use the Index, Luke — capítulo EXPLAIN", url: "https://use-the-index-luke.com/sql/explain-plan", kind: "livro" },
      { title: "auto_explain — log automático em produção", url: "https://www.postgresql.org/docs/current/auto-explain.html", kind: "docs" },
      { title: "pg_hint_plan — forçar planos específicos", url: "https://github.com/ossc-db/pg_hint_plan", kind: "docs" },
      { title: "PostgreSQL planner internals — Tom Lane", url: "https://www.pgcon.org/2011/schedule/attachments/188_Planner.pdf", kind: "artigo" },
    ],
  },

  "mvcc": {
    tagline: "Multi-Version Concurrency Control — como o Postgres garante isolamento sem locks excessivos.",
    why: "MVCC é o mecanismo central que torna o Postgres um banco de produção — leitura concorrente sem bloquear escrita, e vice-versa. Entender xmin/xmax, snapshots, dead tuples e VACUUM é o que distingue quem opera Postgres de quem só usa. É pergunta frequente em entrevistas sênior que envolvem Postgres, e é a base para entender isolation levels e table bloat.",
    prerequisite: "PostgreSQL básico, o que são transações (BEGIN/COMMIT/ROLLBACK), o que são índices. Recomendado: ter lido a skill postgresql antes.",
    summary: "MVCC (Multi-Version Concurrency Control) é a estratégia que o Postgres usa para permitir concorrência sem o uso extensivo de locks. A ideia central: em vez de bloquear uma linha quando ela é lida, o banco mantém múltiplas versões da linha e cada transação enxerga a versão correta para o momento em que ela começou.\n\nCada tupla (linha) tem dois campos de controle invisíveis: xmin (XID da transação que a criou) e xmax (XID da transação que a deletou ou substituiu por uma nova versão). Uma transação vê uma tupla se: xmin foi commitado antes do seu snapshot, e xmax ainda não foi commitado (ou é nulo).\n\nInsert cria tupla com xmin=TX_atual, xmax=0. Update cria nova tupla com xmin=TX_atual e marca xmax=TX_atual na versão antiga. Delete só marca xmax=TX_atual — a linha continua no disco. O espaço só é recuperado quando o VACUUM roda e remove as dead tuples (tuplas com xmax menor que o oldest transaction em execução).\n\nO isolation level controla o momento em que o snapshot é capturado: Read Committed captura novo snapshot a cada statement (vê commits recentes), Repeatable Read captura snapshot no BEGIN (estado fixo da transação), Serializable detecta conflitos de serialização via SSI.\n\nO grande risco operacional do MVCC é o table bloat: dead tuples acumuladas por VACUUM mal configurado ou long-running transactions. O segundo risco é XID wraparound: se o banco executar ~2 bilhões de transações sem VACUUM congelar tuplas antigas, entra em modo de emergência (read-only).",
    diagrams: [
      {
        title: "Versões de tupla — como INSERT, UPDATE e DELETE funcionam",
        html: `<style>
.mvcc-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.mvcc-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(51,103,145,.7);display:inline}
.mvcc-tip:hover .mvcc-tb{display:block}
.mvcc-tb{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:240px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.mvcc-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.mvcc-tx{display:grid;grid-template-columns:110px 1fr;gap:10px;align-items:center;margin-bottom:12px}
.mvcc-txlabel{font-size:11px;color:#64748b;text-align:right;padding-right:10px;line-height:1.5}
.mvcc-txnum{font-size:13px;font-weight:700}
.mvcc-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.mvcc-tuple{border-radius:6px;padding:9px 12px;font-size:11px;border:1.5px solid;line-height:1.5}
.mvcc-live{background:#162a16;border-color:#22c55e;color:#86efac}
.mvcc-dead{background:#1a1a1a;border-color:#334155;color:#475569;opacity:.7}
.mvcc-new{background:#1e2a40;border-color:#5b9bd5;color:#93c5fd}
.mvcc-del{background:#2a1616;border-color:#ef4444;color:#fca5a5}
.mvcc-arr{color:#5b9bd5;font-size:16px;align-self:center}
.mvcc-badge{display:inline-block;font-size:9px;padding:2px 6px;border-radius:3px;font-weight:700;letter-spacing:.04em;margin-bottom:4px}
.mvcc-badge-ins{background:rgba(34,197,94,.2);color:#22c55e}
.mvcc-badge-upd{background:rgba(91,155,213,.2);color:#5b9bd5}
.mvcc-badge-del{background:rgba(239,68,68,.2);color:#ef4444}
.mvcc-badge-vac{background:rgba(167,139,250,.2);color:#a78bfa}
@keyframes mvcc-pulse{0%,100%{opacity:.5}50%{opacity:1}}
.mvcc-dead-anim{animation:mvcc-pulse 2s ease-in-out infinite}
</style>
<div class="mvcc-wrap">
  <p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Versões de tupla — xmin, xmax e visibilidade</p>
  <p style="color:#475569;font-size:10px;margin:0 0 18px">Passe o mouse nos termos <span style="border-bottom:1px dashed rgba(51,103,145,.7)">sublinhados</span> para detalhes</p>

  <div class="mvcc-tx">
    <div class="mvcc-txlabel"><div class="mvcc-txnum" style="color:#22c55e">TX #100</div>INSERT</div>
    <div class="mvcc-row">
      <div class="mvcc-tuple mvcc-live">
        <div class="mvcc-badge mvcc-badge-ins">LIVE</div><br>
        <span class="mvcc-tip" style="border-color:rgba(34,197,94,.5)">xmin<span class="mvcc-tb">Transaction ID que criou esta tupla. Uma tupla é visível para transações cujo snapshot é posterior ao commit de xmin. Transações com snapshot anterior ao commit de xmin não enxergam esta tupla.</span></span>=<span style="color:#22c55e">100</span>
        &nbsp;
        <span class="mvcc-tip" style="border-color:rgba(34,197,94,.5)">xmax<span class="mvcc-tb">Transaction ID que deletou ou sobrescreveu esta tupla. Quando é 0 (ou null), a tupla ainda está viva — nenhuma transação a removeu. Uma transação que vê esta tupla verifica: xmax=0 ou xmax não committed = tupla ainda válida para mim.</span></span>=<span style="color:#22c55e">0</span><br>
        email = "a@b.com"
      </div>
      <div style="font-size:10px;color:#22c55e;align-self:center">← ativa</div>
    </div>
  </div>

  <div class="mvcc-tx">
    <div class="mvcc-txlabel"><div class="mvcc-txnum" style="color:#5b9bd5">TX #150</div>UPDATE</div>
    <div class="mvcc-row">
      <div class="mvcc-tuple mvcc-dead mvcc-dead-anim">
        <div class="mvcc-badge" style="background:rgba(100,116,139,.2);color:#64748b">DEAD TUPLE</div><br>
        xmin=<span style="color:#64748b">100</span>
        &nbsp;
        <span class="mvcc-tip" style="border-color:rgba(100,116,139,.5)">xmax<span class="mvcc-tb">xmax foi preenchido pela TX #150 no UPDATE. Esta versão antiga agora é invisível para transações com snapshot após o commit da TX #150. Ela continua no disco — o VACUUM ainda não a removeu. É o que chamamos de "dead tuple".</span></span>=<span style="color:#ef4444">150</span><br>
        email = "a@b.com"
      </div>
      <div class="mvcc-arr">→</div>
      <div class="mvcc-tuple mvcc-new">
        <div class="mvcc-badge mvcc-badge-upd">NOVA VERSÃO</div><br>
        <span class="mvcc-tip" style="border-color:rgba(91,155,213,.5)">xmin<span class="mvcc-tb">A nova versão recebe xmin=150 (XID da transação que fez o UPDATE). Após o commit da TX #150, transações com snapshot posterior enxergarão esta versão — e não mais a anterior com xmax=150.</span></span>=<span style="color:#5b9bd5">150</span>
        &nbsp;xmax=<span style="color:#5b9bd5">0</span><br>
        email = "novo@b.com"
      </div>
      <div style="font-size:10px;color:#5b9bd5;align-self:center">← ativa</div>
    </div>
  </div>

  <div class="mvcc-tx">
    <div class="mvcc-txlabel"><div class="mvcc-txnum" style="color:#ef4444">TX #200</div>DELETE</div>
    <div class="mvcc-row">
      <div class="mvcc-tuple mvcc-del">
        <div class="mvcc-badge mvcc-badge-del">DELETED</div><br>
        xmin=<span style="color:#5b9bd5">150</span>
        &nbsp;
        <span class="mvcc-tip" style="border-color:rgba(239,68,68,.5)">xmax<span class="mvcc-tb">DELETE só marca xmax=200. A linha ainda existe fisicamente no disco. Ela se torna invisível para transações com snapshot após o commit da TX #200. Mas ocupa espaço até o VACUUM ser executado e remover esta dead tuple.</span></span>=<span style="color:#ef4444">200</span><br>
        email = "novo@b.com"
      </div>
      <div style="font-size:10px;color:#ef4444;align-self:center">← dead tuple<br>(ainda no disco)</div>
    </div>
  </div>

  <div class="mvcc-tx">
    <div class="mvcc-txlabel"><div class="mvcc-txnum" style="color:#a78bfa">VACUUM</div>limpeza</div>
    <div class="mvcc-row">
      <div style="background:#1e293b;border:1.5px solid #a78bfa;border-radius:6px;padding:10px 14px;font-size:11px;color:#c4b5fd;max-width:350px;line-height:1.6">
        <div class="mvcc-badge mvcc-badge-vac" style="margin-bottom:6px">VACUUM</div><br>
        Remove dead tuples com xmax &lt; <span class="mvcc-tip" style="border-color:rgba(167,139,250,.5)">oldest_xmin<span class="mvcc-tb">oldest_xmin é o XID da transação mais antiga ainda ativa no banco. O VACUUM só pode remover dead tuples com xmax menor que isso — porque transações mais antigas podem ainda estar vendo aquelas versões. Long-running transactions bloqueiam o VACUUM ao manter um oldest_xmin baixo.</span></span>.<br>
        Libera espaço para reuso na mesma página.<br>
        Atualiza <span class="mvcc-tip" style="border-color:rgba(167,139,250,.5)">visibility map<span class="mvcc-tb">Mapa de bits que marca páginas onde TODAS as tuplas são visíveis para todas as transações. Permite Index Only Scan pular o acesso à heap para verificar visibilidade — grande ganho de performance. VACUUM o atualiza.</span></span> para Index Only Scan eficiente.<br>
        Congela tuplas antigas para <span class="mvcc-tip" style="border-color:rgba(167,139,250,.5)">prevenir XID wraparound<span class="mvcc-tb">Tuplas congeladas recebem xmin=FrozenXID — são visíveis para todas as transações independente de snapshot. Isso previne que o XID counter circular "alcance" tuplas antigas e as torne incorretamente invisíveis. Tuplas precisam ser congeladas antes que age(xmin) alcance ~2 bilhões.</span></span>.
      </div>
    </div>
  </div>

  <div style="background:#1e293b;border-radius:8px;padding:10px 14px;margin-top:4px;font-size:10px;color:#64748b;border:1px solid #1e3a5f;line-height:1.7">
    <span style="color:#5b9bd5;font-weight:700">Por que readers não bloqueiam writers:</span> uma transação de leitura enxerga a versão da linha que existia quando ela começou (via snapshot). Se outra transação atualiza a linha no meio da leitura, a leitora continua vendo a versão antiga — sem precisar de lock. O escritor cria uma nova versão com novo xmin. Ambos operam sem se bloquear.
  </div>
</div>`,
        caption: "A regra de ouro: INSERT cria tupla (xmin=TX), UPDATE cria nova versão + marca xmax na antiga, DELETE só marca xmax. O espaço nunca é devolvido imediatamente — o VACUUM é responsável por isso. Dead tuples acumulam até o VACUUM rodar.",
      },
      {
        title: "Níveis de isolamento — anomalias que cada nível previne",
        html: `<style>
.mviso-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.mviso-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(51,103,145,.7);display:inline}
.mviso-tip:hover .mviso-tb{display:block}
.mviso-tb{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:240px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.mviso-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.mviso-table{width:100%;border-collapse:collapse;font-size:11px;margin-bottom:14px}
.mviso-table th{background:#1e293b;color:#64748b;padding:8px 10px;text-align:left;font-weight:600;font-size:10px;letter-spacing:.05em}
.mviso-table td{padding:8px 10px;border-top:1px solid #1e293b;vertical-align:middle}
.mviso-level{font-weight:700;font-size:12px}
.mviso-yes{color:#22c55e;text-align:center}
.mviso-no{color:#ef4444;text-align:center}
.mviso-partial{color:#f59e0b;text-align:center}
.mviso-scenario{background:#1e293b;border-radius:8px;padding:12px 14px;margin-bottom:10px}
.mviso-scenario-title{font-size:11px;font-weight:700;margin-bottom:6px}
.mviso-code{font-size:10px;color:#64748b;line-height:1.7}
.mviso-rc{border-color:#5b9bd5;background:rgba(91,155,213,.06)}
.mviso-rr{border-color:#22c55e;background:rgba(34,197,94,.06)}
.mviso-ser{border-color:#f59e0b;background:rgba(245,158,11,.06)}
</style>
<div class="mviso-wrap">
  <p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Níveis de isolamento — anomalias que cada nível previne</p>
  <p style="color:#475569;font-size:10px;margin:0 0 16px">O padrão SQL define anomalias — cada nível previne um subconjunto delas. Passe o mouse nos nomes para detalhes.</p>
  <table class="mviso-table">
    <tr>
      <th>Nível</th>
      <th><span class="mviso-tip">Dirty Read<span class="mviso-tb">Ler dados de uma transação que ainda não foi commitada — que pode ser revertida. Ex: TX1 inseriu mas não commitou; TX2 lê e vê o dado; TX1 faz ROLLBACK — TX2 trabalhou com dado que nunca existiu. PostgreSQL nunca permite isso em nenhum nível.</span></span></th>
      <th><span class="mviso-tip">Non-Repeatable Read<span class="mviso-tb">Ler o mesmo dado duas vezes na mesma transação e obter valores diferentes. TX1 lê saldo=100; TX2 atualiza para 200 e commita; TX1 lê novamente e vê 200. O dado "mudou" durante a transação. Problemático para relatórios que fazem múltiplas leituras do mesmo dado.</span></span></th>
      <th><span class="mviso-tip">Phantom Read<span class="mviso-tb">Busca por critério retorna conjunto diferente de linhas em duas execuções. TX1 conta pedidos com status='pendente': 10 linhas; TX2 insere novo pedido pendente e commita; TX1 conta novamente: 11 linhas. Uma linha "fantasma" apareceu.</span></span></th>
      <th><span class="mviso-tip">Serialization Anomaly<span class="mviso-tb">Write skew: TX1 e TX2 leem o mesmo dado, ambas decidem escrever baseado no que leram, e o resultado seria impossível se executadas serialmente. Ex: sistema de plantão — TX1 e TX2 verificam que há 2 médicos de plantão, ambas decidem sair → 0 médicos de plantão, estado inválido.</span></span></th>
      <th>Snapshot capturado</th>
    </tr>
    <tr>
      <td><div class="mviso-level" style="color:#5b9bd5">Read Committed</div><div style="font-size:9px;color:#475569;margin-top:2px">DEFAULT do Postgres</div></td>
      <td class="mviso-yes">✓ previne</td>
      <td class="mviso-no">✗ possível</td>
      <td class="mviso-no">✗ possível</td>
      <td class="mviso-no">✗ possível</td>
      <td style="font-size:10px;color:#64748b">A cada statement</td>
    </tr>
    <tr>
      <td><div class="mviso-level" style="color:#22c55e">Repeatable Read</div><div style="font-size:9px;color:#475569;margin-top:2px">SET TRANSACTION ISOLATION LEVEL REPEATABLE READ</div></td>
      <td class="mviso-yes">✓ previne</td>
      <td class="mviso-yes">✓ previne</td>
      <td class="mviso-yes">✓ previne*</td>
      <td class="mviso-no">✗ possível</td>
      <td style="font-size:10px;color:#64748b">No BEGIN da transação</td>
    </tr>
    <tr>
      <td><div class="mviso-level" style="color:#f59e0b">Serializable</div><div style="font-size:9px;color:#475569;margin-top:2px">SET TRANSACTION ISOLATION LEVEL SERIALIZABLE</div></td>
      <td class="mviso-yes">✓ previne</td>
      <td class="mviso-yes">✓ previne</td>
      <td class="mviso-yes">✓ previne</td>
      <td class="mviso-yes">✓ previne (com retry)</td>
      <td style="font-size:10px;color:#64748b">No BEGIN + SSI tracking</td>
    </tr>
  </table>
  <div style="font-size:9px;color:#475569;margin-bottom:14px">* Postgres implementa Repeatable Read com snapshot completo — previne phantom reads também, diferente do padrão SQL que só exige prevenir non-repeatable reads.</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
    <div class="mviso-scenario" style="border-left:3px solid #ef4444">
      <div class="mviso-scenario-title" style="color:#ef4444">Non-Repeatable Read — problema em relatórios</div>
      <div class="mviso-code">
        -- Sessão 1 (Read Committed)<br>
        BEGIN;<br>
        SELECT saldo FROM contas WHERE id=1;<br>
        -- retorna: 1000<br>
        <br>
        -- Sessão 2 (concurrent)<br>
        UPDATE contas SET saldo=2000 WHERE id=1;<br>
        COMMIT;<br>
        <br>
        -- Sessão 1 (ainda na mesma TX)<br>
        SELECT saldo FROM contas WHERE id=1;<br>
        -- retorna: 2000  ← dado mudou!<br>
        COMMIT;<br>
        <span style="color:#ef4444">-- Fix: use REPEATABLE READ para relatórios</span>
      </div>
    </div>
    <div class="mviso-scenario" style="border-left:3px solid #f59e0b">
      <div class="mviso-scenario-title" style="color:#f59e0b">Write Skew — precisa de Serializable</div>
      <div class="mviso-code">
        -- Regra: pelo menos 1 médico de plantão<br>
        -- TX1 e TX2 simultâneas:<br>
        BEGIN; -- ambas, Repeatable Read<br>
        <br>
        SELECT COUNT(*) FROM plantao<br>
        WHERE ativo = true;<br>
        -- ambas veem: 2 médicos<br>
        <br>
        -- ambas decidem que podem sair<br>
        UPDATE plantao SET ativo=false<br>
        WHERE medico_id = [meu_id];<br>
        COMMIT; -- ambas commitam!<br>
        <br>
        <span style="color:#ef4444">-- Resultado: 0 médicos de plantão!</span><br>
        <span style="color:#22c55e">-- Fix: SERIALIZABLE detecta e aborta 1 TX</span>
      </div>
    </div>
  </div>
  <div style="background:#1e293b;border-radius:8px;padding:10px 14px;margin-top:10px;font-size:10px;color:#64748b;border:1px solid #1e3a5f;line-height:1.7">
    <span style="color:#5b9bd5;font-weight:700">Regra prática:</span> use <strong style="color:#5b9bd5">Read Committed</strong> (default) para operações normais de aplicação. Use <strong style="color:#22c55e">Repeatable Read</strong> para relatórios, exports e operações que leem o mesmo dado múltiplas vezes. Use <strong style="color:#f59e0b">Serializable</strong> quando a lógica de negócio exige ausência de write skew — com retry em caso de serialization failure.
  </div>
</div>`,
        caption: "O nível de isolamento não é sobre performance — é sobre corretude. Read Committed é rápido mas tem buracos. Serializable é correto mas exige retry. Repeatable Read é o meio-termo mais útil para relatórios e operações de leitura consistente.",
      },
      {
        title: "VACUUM e dead tuples — bloat, limpeza e XID wraparound",
        html: `<style>
.mvvac-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.mvvac-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(51,103,145,.7);display:inline}
.mvvac-tip:hover .mvvac-tb{display:block}
.mvvac-tb{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:240px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.mvvac-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.mvvac-page{background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:12px;display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px}
.mvvac-page-title{width:100%;font-size:9px;color:#475569;margin-bottom:6px;text-transform:uppercase;letter-spacing:.08em}
.mvvac-block{width:26px;height:26px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700}
.mvvac-live{background:#162a16;border:1px solid #22c55e;color:#22c55e}
.mvvac-dead{background:#2a1a1a;border:1px solid #ef4444;color:#ef4444}
.mvvac-free{background:#1e293b;border:1px solid #334155;color:#334155}
.mvvac-frozen{background:#16223a;border:1px solid #5b9bd5;color:#5b9bd5}
.mvvac-legend{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:14px}
.mvvac-leg{display:flex;align-items:center;gap:5px;font-size:10px;color:#64748b}
.mvvac-dot{width:10px;height:10px;border-radius:2px}
@keyframes mvvac-blink{0%,100%{opacity:1}50%{opacity:.4}}
.mvvac-blink{animation:mvvac-blink 1.5s ease-in-out infinite}
.mvvac-stat{background:#1e293b;border-radius:6px;padding:8px 12px;font-size:11px}
.mvvac-stat-title{font-size:9px;color:#475569;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
.mvvac-meter{height:8px;border-radius:4px;background:#334155;margin-top:4px;overflow:hidden}
.mvvac-meter-fill{height:100%;border-radius:4px;transition:width .3s}
</style>
<div class="mvvac-wrap">
  <p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">VACUUM — dead tuples, bloat e XID wraparound</p>
  <p style="color:#475569;font-size:10px;margin:0 0 14px">Visualização de página de dados antes e depois do VACUUM</p>

  <div class="mvvac-legend">
    <div class="mvvac-leg"><div class="mvvac-dot" style="background:#162a16;border:1px solid #22c55e"></div>tupla viva</div>
    <div class="mvvac-leg"><div class="mvvac-dot" style="background:#2a1a1a;border:1px solid #ef4444"></div>dead tuple</div>
    <div class="mvvac-leg"><div class="mvvac-dot" style="background:#1e293b;border:1px solid #334155"></div>espaço livre</div>
    <div class="mvvac-leg"><div class="mvvac-dot" style="background:#16223a;border:1px solid #5b9bd5"></div>tupla congelada</div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 28px 1fr;gap:8px;align-items:center;margin-bottom:16px">
    <div>
      <div style="font-size:10px;color:#ef4444;font-weight:600;margin-bottom:6px">Antes do VACUUM — bloat acumulado</div>
      <div class="mvvac-page">
        <div class="mvvac-page-title">Página 1 (8KB)</div>
        <div class="mvvac-block mvvac-live">L</div>
        <div class="mvvac-block mvvac-dead mvvac-blink">D</div>
        <div class="mvvac-block mvvac-dead mvvac-blink">D</div>
        <div class="mvvac-block mvvac-live">L</div>
        <div class="mvvac-block mvvac-dead mvvac-blink">D</div>
        <div class="mvvac-block mvvac-live">L</div>
        <div class="mvvac-block mvvac-dead mvvac-blink">D</div>
        <div class="mvvac-block mvvac-live">L</div>
        <div class="mvvac-block mvvac-dead mvvac-blink">D</div>
        <div class="mvvac-block mvvac-dead mvvac-blink">D</div>
        <div class="mvvac-block mvvac-live">L</div>
        <div class="mvvac-block mvvac-dead mvvac-blink">D</div>
      </div>
      <div style="font-size:10px;color:#64748b">4 vivas / 8 dead (67% bloat)<br>Mais I/O, índices maiores, cache menor</div>
    </div>
    <div style="text-align:center">
      <div style="font-size:20px;color:#a78bfa">→</div>
      <div style="font-size:9px;color:#a78bfa;font-weight:700">VACUUM</div>
    </div>
    <div>
      <div style="font-size:10px;color:#22c55e;font-weight:600;margin-bottom:6px">Após VACUUM — espaço recuperado</div>
      <div class="mvvac-page">
        <div class="mvvac-page-title">Página 1 (8KB)</div>
        <div class="mvvac-block mvvac-frozen">F</div>
        <div class="mvvac-block mvvac-frozen">F</div>
        <div class="mvvac-block mvvac-live">L</div>
        <div class="mvvac-block mvvac-live">L</div>
        <div class="mvvac-block mvvac-free"></div>
        <div class="mvvac-block mvvac-free"></div>
        <div class="mvvac-block mvvac-free"></div>
        <div class="mvvac-block mvvac-free"></div>
        <div class="mvvac-block mvvac-free"></div>
        <div class="mvvac-block mvvac-free"></div>
        <div class="mvvac-block mvvac-free"></div>
        <div class="mvvac-block mvvac-free"></div>
      </div>
      <div style="font-size:10px;color:#64748b">4 vivas, 0 dead, 8 slots livres<br>Espaço reutilizável por novos INSERTs</div>
    </div>
  </div>

  <div style="background:#1e293b;border-radius:8px;padding:12px 14px;margin-bottom:14px;border:1.5px solid rgba(239,68,68,.3)">
    <div style="color:#ef4444;font-size:11px;font-weight:700;margin-bottom:8px">XID wraparound — o risco operacional mais sério</div>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
      <div style="flex:1">
        <div class="mvvac-stat">
          <div class="mvvac-stat-title">age(datfrozenxid) — risco de wraparound</div>
          <div style="color:#22c55e;font-size:12px;font-weight:700">150M transações</div>
          <div class="mvvac-meter"><div class="mvvac-meter-fill" style="width:7%;background:#22c55e"></div></div>
          <div style="font-size:9px;color:#475569;margin-top:2px">Seguro — muito espaço restante</div>
        </div>
      </div>
      <div style="flex:1">
        <div class="mvvac-stat">
          <div class="mvvac-stat-title">age(datfrozenxid) — risco de wraparound</div>
          <div style="color:#ef4444;font-size:12px;font-weight:700">1.8B transações</div>
          <div class="mvvac-meter"><div class="mvvac-meter-fill" style="width:90%;background:#ef4444"></div></div>
          <div style="font-size:9px;color:#ef4444;margin-top:2px">EMERGÊNCIA — autovacuum aggressive</div>
        </div>
      </div>
    </div>
    <div style="font-size:10px;color:#64748b;line-height:1.7">
      <span class="mvvac-tip" style="border-color:rgba(239,68,68,.5)">XID wraparound<span class="mvvac-tb">Transaction IDs (XIDs) são contadores de 32 bits — ~4 bilhões de valores. O Postgres usa espaço circular de ~2 bilhões de XIDs "no futuro". Se age(datfrozenxid) se aproximar de 2 bilhões sem que VACUUM congele as tuplas antigas, o banco entra em modo read-only de emergência para prevenir corrupção de dados.</span></span>: acontece quando tuplas antigas não são congeladas a tempo. Postgres pode entrar em modo read-only para se proteger.<br>
      <strong style="color:#f59e0b">Monitorar:</strong> <code>SELECT max(age(datfrozenxid)) FROM pg_database;</code><br>
      <strong style="color:#22c55e">Alertar quando:</strong> age > 500.000.000 (500M). Emergência quando > 1.800.000.000 (1.8B).<br>
      <strong style="color:#22c55e">Prevenir:</strong> autovacuum bem configurado + VACUUM FREEZE periódico em databases de alta atividade.
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
    <div style="background:#1e293b;border-radius:8px;padding:10px 14px;font-size:10px;color:#64748b;border-left:3px solid #f59e0b;line-height:1.7">
      <div style="color:#f59e0b;font-weight:700;margin-bottom:4px">Long-running transaction bloqueando VACUUM</div>
      O VACUUM não pode remover dead tuples com xmax &gt;= oldest_xmin. Uma transação aberta há 6 horas congela o oldest_xmin no valor de 6 horas atrás. Todas as dead tuples criadas nas últimas 6 horas ficam no disco — indefinidamente.<br>
      <strong style="color:#f59e0b">Fix:</strong> idle_in_transaction_session_timeout = '1h' no postgresql.conf. Monitorar: <code>pg_stat_activity WHERE state = 'idle in transaction'</code>
    </div>
    <div style="background:#1e293b;border-radius:8px;padding:10px 14px;font-size:10px;color:#64748b;border-left:3px solid #a78bfa;line-height:1.7">
      <div style="color:#a78bfa;font-weight:700;margin-bottom:4px">VACUUM vs VACUUM FULL vs pg_repack</div>
      <strong>VACUUM:</strong> remove dead tuples, marca espaço livre para reuso. Sem lock exclusivo. Não devolve espaço ao OS.<br>
      <strong>VACUUM FULL:</strong> reescreve tabela inteira, devolve ao OS. Lock exclusivo — bloqueia tudo.<br>
      <strong>pg_repack:</strong> equivalente ao VACUUM FULL sem lock exclusivo. Use em produção quando houver bloat severo e a tabela não pode ser bloqueada.
    </div>
  </div>
</div>`,
        caption: "O VACUUM não devolve espaço ao OS — marca como reutilizável dentro da tabela. Para devolver ao OS use VACUUM FULL (com lock) ou pg_repack (sem lock). Monitore age(datfrozenxid) — é o indicador do risco de XID wraparound, a emergência operacional mais séria do Postgres.",
      },
    ],
    keypoints: [
      {
        title: "Como o snapshot funciona na prática",
        body: "Ao iniciar uma transação (ou statement, em Read Committed), o Postgres captura um snapshot: lista de XIDs ativos naquele momento. Uma tupla é visível se xmin foi commitado antes do snapshot E xmax é nulo ou não foi commitado antes do snapshot. Isso garante consistência sem locks de leitura.",
        code: `-- Demonstração: duas sessões concorrentes
-- Sessão 1:
BEGIN;
SELECT txid_current();  -- retorna: 500
-- Snapshot capturado aqui em Read Committed

-- Sessão 2 (ao mesmo tempo):
BEGIN;
UPDATE produtos SET preco = 200 WHERE id = 1;
COMMIT;  -- commita XID 501

-- Sessão 1 (Read Committed — captura novo snapshot por statement):
SELECT preco FROM produtos WHERE id = 1;
-- retorna: 200  ← vê o commit da sessão 2 (novo snapshot)

-- Se Sessão 1 fosse REPEATABLE READ:
-- SELECT preco FROM produtos WHERE id = 1;
-- retornaria: 150  ← snapshot fixo no BEGIN, não vê TX 501`,
      },
      {
        title: "Como monitorar dead tuples e bloat",
        body: "pg_stat_user_tables expõe n_live_tup e n_dead_tup por tabela. Alta razão de dead tuples indica VACUUM mal configurado ou long-running transactions bloqueando a limpeza. Monitore proativamente para evitar bloat severo que requer VACUUM FULL ou pg_repack.",
        code: `-- Top tabelas com mais dead tuples
SELECT
  schemaname, relname,
  n_live_tup, n_dead_tup,
  ROUND(100.0 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0), 1) AS pct_dead,
  last_vacuum, last_autovacuum,
  last_analyze, last_autoanalyze
FROM pg_stat_user_tables
WHERE n_dead_tup > 1000
ORDER BY n_dead_tup DESC LIMIT 20;

-- Verificar long-running transactions (bloqueiam VACUUM)
SELECT pid, now() - pg_stat_activity.query_start AS duracao,
  state, wait_event_type, wait_event,
  LEFT(query, 80) AS query
FROM pg_stat_activity
WHERE state != 'idle'
  AND query_start < now() - INTERVAL '5 minutes'
ORDER BY duracao DESC;

-- Verificar oldest transaction (determina o horizon do VACUUM)
SELECT pid, xact_start, now() - xact_start AS duracao,
  state, left(query, 60) AS query
FROM pg_stat_activity
WHERE xact_start IS NOT NULL
ORDER BY xact_start ASC LIMIT 5;`,
      },
      {
        title: "Configurar autovacuum agressivo por tabela",
        body: "O autovacuum padrão é conservador — configurado para tabelas de tamanho médio com escrita moderada. Tabelas de alta escrita precisam de autovacuum mais agressivo configurado individualmente via storage parameters. Não altere os parâmetros globais — eles afetam todas as tabelas.",
        code: `-- Configuração padrão (muito conservadora para tabelas de alta escrita)
-- autovacuum_vacuum_scale_factor = 0.2  → vacuuma quando 20% das linhas são dead
-- autovacuum_analyze_scale_factor = 0.1 → analisa quando 10% mudaram

-- Para tabelas de alta escrita: configurar individualmente
ALTER TABLE eventos SET (
  autovacuum_vacuum_scale_factor = 0.01,   -- vacuuma com 1% de dead tuples
  autovacuum_vacuum_threshold = 100,       -- mínimo de dead tuples para triggear
  autovacuum_analyze_scale_factor = 0.01,  -- analisa com 1% de mudanças
  autovacuum_vacuum_cost_delay = 2         -- ms de delay entre operações (default 20ms)
);

-- Para tabelas muito grandes, usar threshold absoluto em vez de percentual
ALTER TABLE logs SET (
  autovacuum_vacuum_scale_factor = 0.0,    -- desabilitar percentual
  autovacuum_vacuum_threshold = 10000      -- triggear com 10k dead tuples absolutas
);

-- Verificar configurações por tabela
SELECT relname, reloptions FROM pg_class WHERE relname = 'eventos';`,
      },
      {
        title: "Escolher o isolation level correto para o caso de uso",
        body: "A maioria das aplicações nunca precisa mudar o isolation level. Read Committed resolve para operações CRUD normais. Repeatable Read resolve para relatórios e exports. Serializable é para lógica de negócio crítica com write skew — e requer retry na aplicação.",
        code: `-- Read Committed (default): ok para CRUD normal
BEGIN;
UPDATE saldo SET valor = valor - 100 WHERE conta_id = 1;
UPDATE saldo SET valor = valor + 100 WHERE conta_id = 2;
COMMIT;

-- Repeatable Read: relatório consistente com múltiplas leituras
BEGIN ISOLATION LEVEL REPEATABLE READ;
-- Todas as queries desta transação veem o mesmo snapshot
SELECT SUM(total) FROM pedidos WHERE mes = '2025-01';
SELECT AVG(ticket) FROM pedidos WHERE mes = '2025-01';
-- Ambas veem o mesmo estado — sem discrepância
COMMIT;

-- Serializable: lógica com write skew (ex: plantão médico)
BEGIN ISOLATION LEVEL SERIALIZABLE;
SELECT COUNT(*) FROM plantao WHERE ativo = true;
-- Decide baseado no resultado acima
UPDATE plantao SET ativo = false WHERE medico_id = 42;
COMMIT;  -- pode falhar com: "ERROR: could not serialize access"
-- Aplicação DEVE fazer retry em serialization failures
-- Código de erro: 40001 (serialization_failure)`,
      },
      {
        title: "Monitorar XID wraparound e agir preventivamente",
        body: "XID wraparound é a emergência operacional mais séria do Postgres. O banco entra em modo read-only quando age(datfrozenxid) se aproxima do limite. O VACUUM freeze é a prevenção. Monitore e alerte continuamente.",
        code: `-- Verificar risco de XID wraparound
SELECT datname,
  age(datfrozenxid) AS xid_age,
  2000000000 - age(datfrozenxid) AS xids_restantes,
  CASE
    WHEN age(datfrozenxid) > 1500000000 THEN 'EMERGÊNCIA'
    WHEN age(datfrozenxid) > 1000000000 THEN 'ATENÇÃO'
    WHEN age(datfrozenxid) > 500000000  THEN 'MONITORAR'
    ELSE 'OK'
  END AS status
FROM pg_database
ORDER BY xid_age DESC;

-- Verificar tabelas com tuplas mais antigas (as que mais precisam de freeze)
SELECT schemaname, relname,
  greatest(age(relfrozenxid), age(relminmxid)) AS max_age,
  pg_size_pretty(pg_total_relation_size(oid)) AS tamanho
FROM pg_class
WHERE relkind = 'r'
ORDER BY max_age DESC LIMIT 10;

-- Forçar freeze preventivo (em janela de manutenção)
VACUUM FREEZE VERBOSE pedidos;

-- Configuração preventiva: vacuum_freeze_max_age (default 200M)
-- Decrementar para tabelas que crescem rápido:
-- vacuum_freeze_max_age = 150000000  -- forçar freeze mais cedo`,
      },
      {
        title: "Locks que o MVCC não elimina",
        body: "MVCC elimina a necessidade de locks de leitura, mas locks de escrita ainda existem. UPDATE na mesma linha aguarda. DDL (ALTER TABLE) precisa de lock exclusivo. Advisory locks são para coordenação a nível de aplicação. Identificar e resolver lock waits é parte do diagnóstico de produção.",
        code: `-- Visualizar locks ativos e quem está bloqueando quem
SELECT
  blocked_locks.pid AS pid_bloqueado,
  blocking_locks.pid AS pid_bloqueador,
  blocked_activity.query AS query_bloqueada,
  blocking_activity.query AS query_bloqueadora,
  blocked_activity.wait_event_type,
  blocked_activity.wait_event
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity
  ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks
  ON blocking_locks.locktype = blocked_locks.locktype
  AND blocking_locks.relation IS NOT DISTINCT FROM blocked_locks.relation
  AND blocking_locks.granted = true
  AND blocked_locks.granted = false
JOIN pg_catalog.pg_stat_activity blocking_activity
  ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;

-- Advisory lock para coordenar workers sem tabela de locks
-- (só um worker processa por vez, outros passam sem bloquear)
SELECT pg_try_advisory_lock(hashtext('job:sync-usuarios'));
-- true → adquiriu, pode prosseguir
-- false → outro worker está rodando, pule esta vez`,
      },
    ],
    gotchas: [
      "Long-running transactions bloqueiam o VACUUM: o VACUUM não remove dead tuples com xmax >= xmin da transação mais antiga ativa. Uma conexão 'idle in transaction' de 6 horas pode acumular gigabytes de bloat. Configure idle_in_transaction_session_timeout = '30min' no postgresql.conf.",
      "Autovacuum muito conservador por padrão: o scale_factor de 20% significa que uma tabela de 100M linhas só é varrida quando acumula 20M dead tuples. Para tabelas de alta escrita, configure autovacuum_vacuum_scale_factor = 0.01 por tabela individualmente.",
      "XID wraparound não monitorado: o banco entra em modo read-only de emergência sem aviso se age(datfrozenxid) alcançar ~2 bilhões. Adicione alertas no Prometheus/Datadog para xid_age > 500M. Uma vez em modo de emergência, é necessário VACUUM FREEZE com acesso exclusivo para recuperar.",
      "TRUNCATE vs DELETE em transações: TRUNCATE em tabelas com FK ou triggers pode ser surpreendente. DELETE gera dead tuples que precisam de VACUUM; TRUNCATE recria a tabela do zero (muito mais rápido para limpar tabelas grandes, mas não dispara row-level triggers).",
      "Read Committed permite non-repeatable reads: em relatórios que fazem múltiplos SELECTs na mesma transação, valores podem mudar entre leituras. Se você soma totais em duas queries separadas, o resultado pode ser inconsistente. Use REPEATABLE READ para relatórios.",
      "MVCC não elimina lock contention em writes: se duas transações tentam UPDATE na mesma linha, a segunda aguarda a primeira terminar (row-level lock). MVCC ajuda leitores, não elimina contention entre escritores na mesma linha.",
      "Não monitorar table bloat: índices também incham (index bloat) com dead tuples. Um índice pode ser 3x maior que o necessário, consumindo cache e aumentando I/O. Use pgstattuple para medir bloat real de tabelas e índices.",
    ],
    interview: [
      {
        q: "Como o MVCC funciona no PostgreSQL? Por que leitores não bloqueiam escritores?",
        level: "pleno",
        a: "<p>O MVCC mantém múltiplas versões de cada linha. Cada tupla tem <strong>xmin</strong> (XID da transação que a criou) e <strong>xmax</strong> (XID da transação que a deletou ou substituiu).</p><p>Quando uma transação começa, captura um <strong>snapshot</strong>: estado dos XIDs ativos naquele momento. Uma tupla é visível se xmin foi commitado antes do snapshot E xmax é nulo ou não commitado. Isso significa que uma leitura nunca precisa esperar uma escrita — ela simplesmente lê a versão anterior da linha.</p><p>Da mesma forma, uma escrita não bloqueia leitoras — cria uma nova versão da linha com novo xmin. A leitora que já tem snapshot continua vendo a versão antiga via xmax da versão nova.</p>",
        tip: "Mencione que UPDATE não é update in-place: cria nova versão + marca xmax na antiga. Isso implica dead tuples, que implica VACUUM. Quem entende essa cadeia demonstra conhecimento operacional real.",
      },
      {
        q: "Por que VACUUM é crítico? O que acontece sem ele?",
        level: "pleno",
        a: "<p>O MVCC deixa versões antigas (dead tuples) no disco após UPDATE e DELETE. Sem VACUUM, elas se acumulam:</p><p><strong>1. Table bloat</strong>: arquivos de dados crescem indefinidamente. Mais I/O por query (mais páginas para varrer), índices maiores, shared buffer pool menos eficiente (mais cache misses).</p><p><strong>2. XID wraparound</strong>: XIDs são de 32 bits. O Postgres precisa 'congelar' tuplas antigas para que o contador circular não as torne invisíveis. Sem VACUUM freeze, quando age(datfrozenxid) alcança ~2 bilhões, o banco entra em modo read-only de emergência. Isso é uma crise de produção real.</p><p><strong>3. Estatísticas desatualizadas</strong>: VACUUM ANALYZE atualiza pg_statistic. Sem isso, o query planner usa estatísticas velhas e escolhe planos ruins.</p>",
        tip: "A resposta boa menciona os três problemas. A resposta excelente adiciona: long-running transactions bloqueiam o VACUUM ao manter o oldest_xmin baixo — daí a importância de idle_in_transaction_session_timeout.",
      },
      {
        q: "Qual o impacto de uma transação aberta por horas no PostgreSQL?",
        level: "senior",
        a: "<p>Uma long-running transaction mantém o oldest_xmin baixo. O VACUUM não pode remover dead tuples com xmax >= xmin dessa transação — porque se ele removesse, a transação longa poderia tentar ler uma versão que não existe mais.</p><p>Consequência prática: tabelas de alta escrita acumulam bloat indefinidamente enquanto a transação estiver aberta. Em 6 horas, uma tabela com 1000 updates/segundo pode acumular 21 milhões de dead tuples.</p><p>Além do bloat: a transação longa pode segurar row-level locks que bloqueiam outras operações, e DDL como ALTER TABLE fica aguardando o lock exclusivo.</p><p>Prevenção: <code>idle_in_transaction_session_timeout = '30min'</code> no postgresql.conf. Monitorar <code>pg_stat_activity WHERE state = 'idle in transaction'</code> com alertas.</p>",
      },
      {
        q: "Qual a diferença entre os níveis de isolamento no Postgres?",
        level: "pleno",
        a: "<p><strong>Read Committed</strong> (default): captura novo snapshot a cada statement. Vê commits de outras transações durante a transação. Tem non-repeatable reads: o mesmo SELECT pode retornar valores diferentes em dois momentos da mesma transação.</p><p><strong>Repeatable Read</strong>: captura snapshot no BEGIN e mantém fixo até o COMMIT. Todas as leituras da transação veem o mesmo estado. Bom para relatórios e exports. O Postgres implementa prevendo phantom reads também (diferente do padrão SQL).</p><p><strong>Serializable</strong>: além do snapshot fixo, usa SSI (Serializable Snapshot Isolation) para detectar write skew — quando duas transações leem e escrevem de forma que seria impossível em execução serial. Se conflito detectado, aborta uma transação com serialization_failure (40001). A aplicação deve ter retry.</p>",
      },
      {
        q: "O que é write skew e como o Serializable resolve?",
        level: "senior",
        a: "<p>Write skew é uma anomalia onde duas transações leem dados sobrepostos, cada uma verifica uma condição, e ambas escrevem baseando-se no que leram — produzindo um estado que seria impossível se executadas serialmente.</p><p>Exemplo clássico: sistema de plantão médico com regra de pelo menos 1 médico ativo. TX1 e TX2 ambas verificam que há 2 médicos ativos — ambas decidem que podem se desativar. Ambas escrevem. Resultado: 0 médicos. Impossível se serial (uma veria que a outra já se desativou).</p><p>Repeatable Read não resolve: ele vê um snapshot consistente, mas não detecta que a condição na qual a decisão foi tomada mudou. Serializable detecta a dependência de leitura-escrita entre as duas transações e aborta uma com serialization_failure. A aplicação faz retry — a segunda transação vê o estado correto e toma a decisão correta.</p>",
        tip: "Ter um exemplo concreto (médicos de plantão, saldo de conta, contagem de vagas) é o que diferencia resposta memorizada de compreensão real.",
      },
      {
        q: "Como você monitoraria e preveniria table bloat em produção?",
        level: "senior",
        a: "<p>Monitoramento: <code>pg_stat_user_tables</code> expõe n_live_tup e n_dead_tup. Razão dead/(live+dead) > 20% em tabela de alta escrita é sinal de alerta. pgstattuple dá bloat real (bytes desperdiçados). Verifico também last_autovacuum — se não rodou nas últimas horas em tabela de alta escrita, o autovacuum está mal configurado.</p><p>Configuração: por tabela individual via <code>ALTER TABLE ... SET (autovacuum_vacuum_scale_factor = 0.01)</code>. Nunca mudo os parâmetros globais — afetam todas as tabelas.</p><p>Prevenção de emergência: <code>idle_in_transaction_session_timeout</code> para encerrar conexões presas. <code>statement_timeout</code> para queries longas. Monitorar long-running transactions em pg_stat_activity.</p><p>Quando há bloat severo: pg_repack faz o equivalente ao VACUUM FULL sem lock exclusivo — preferível em produção sobre VACUUM FULL que bloqueia a tabela inteira.</p>",
      },
      {
        q: "O que é XID wraparound? Por que é uma emergência?",
        level: "senior",
        a: "<p>XIDs (Transaction IDs) são inteiros de 32 bits — ~4 bilhões de valores. O Postgres usa um espaço circular: do ponto de vista de qualquer transação, ~2 bilhões de XIDs estão 'no passado' (visíveis) e ~2 bilhões 'no futuro' (invisíveis). Quando o contador circular dá a volta, XIDs antigos que estavam 'no passado' ficam 'no futuro' — as tuplas se tornam invisíveis.</p><p>Para prevenir isso, o VACUUM 'congela' tuplas antigas: substitui xmin pelo FrozenXID especial, que é considerado visível para todas as transações. Tuplas congeladas nunca se tornam invisíveis.</p><p>Se o autovacuum não congelar a tempo, o Postgres entra em modo read-only de emergência quando age(datfrozenxid) alcança ~2 bilhões. A única saída é VACUUM FREEZE manual com acesso exclusivo — uma crise de produção real.</p><p>Prevenção: monitorar <code>SELECT max(age(datfrozenxid)) FROM pg_database</code> e alertar quando > 500M. Autovacuum bem configurado é a primeira linha de defesa.</p>",
      },
      {
        q: "Como implementar retry para transações Serializable na aplicação?",
        level: "senior",
        a: "<p>Transações Serializable podem falhar com <code>serialization_failure</code> (código SQLSTATE 40001) quando o SSI detecta conflito. A aplicação precisa detectar e fazer retry completo da transação — não apenas do último statement.</p><p>Padrão de implementação: (1) detectar o erro 40001 no exception handler; (2) fazer rollback completo; (3) retry da transação inteira (com backoff se muitos retries); (4) limite máximo de retries para evitar loop infinito.</p><p>Em Node.js/Prisma: o cliente da transação recebe o erro — o código que gerencia a transação faz retry do bloco inteiro. Em Python/SQLAlchemy: session.rollback() + retry do bloco begin/commit. A regra crítica: o retry precisa ser da transação completa desde o BEGIN, não só do comando que falhou. Qualquer estado acumulado antes do BEGIN precisa ser descartado e recalculado.</p>",
      },
      {
        q: "Como o VACUUM FREEZE difere do VACUUM regular?",
        level: "senior",
        a: "<p><strong>VACUUM regular</strong>: remove dead tuples (xmax < oldest_xmin), marca espaço como reutilizável, atualiza visibility map e pg_statistic. Não altera tuplas vivas.</p><p><strong>VACUUM FREEZE</strong>: além do VACUUM regular, itera sobre tuplas vivas com xmin antigo e 'congela' elas — substitui xmin por FrozenXID (especial, visível para todas as transações). Isso avança o relfrozenxid da tabela e o datfrozenxid do banco, reduzindo o risco de XID wraparound.</p><p>O autovacuum ativa o modo freeze automaticamente quando age(relfrozenxid) > vacuum_freeze_max_age (padrão 200M). Para forçar manualmente: <code>VACUUM FREEZE VERBOSE tabela</code>. Para todo o banco: <code>vacuumdb --freeze --all</code>. Necessário em janelas de manutenção quando age(datfrozenxid) > 1.5B.</p>",
      },
      {
        q: "Como funciona o pg_repack e por que preferi-lo ao VACUUM FULL?",
        level: "senior",
        a: "<p><strong>VACUUM FULL</strong>: reescreve a tabela em um novo arquivo, devolvendo espaço ao OS. Requer AccessExclusiveLock — bloqueia SELECT, INSERT, UPDATE, DELETE. Para tabelas grandes, pode durar horas com a tabela completamente bloqueada.</p><p><strong>pg_repack</strong>: replica a tabela para uma nova estrutura em background. Usa trigger para capturar changes enquanto copia. No final, faz swap atômico com lock muito breve (milissegundos). A tabela permanece acessível durante quase todo o processo.</p><p>Processo: (1) cria tabela temporária com mesma estrutura; (2) copia dados em bulk; (3) instala trigger na original para replicar changes incrementais; (4) aplica changes acumulados; (5) lock breve para swap atômico. A extensão pg_repack precisa ser instalada: <code>CREATE EXTENSION pg_repack</code>.</p><p>Quando usar: bloat severo (&gt;50% de espaço desperdiçado), tabela crítica que não pode ser bloqueada, janela de manutenção indisponível.</p>",
      },
      {
        q: "Como o MVCC se compara ao 2PL (Two-Phase Locking) usado por outros bancos?",
        level: "senior",
        a: "<p><strong>2PL (Two-Phase Locking)</strong>: cada leitura adquire shared lock, cada escrita adquire exclusive lock. Locks só são liberados no commit. Garantia: serializability completo se locks forem adquiridos em ordem (strict 2PL). Problema: leituras bloqueiam escritas e vice-versa — alta contenção em workloads concorrentes.</p><p><strong>MVCC</strong>: leituras nunca esperam escritas (e vice-versa). Cada transação vê seu próprio snapshot. Custo: armazenamento de múltiplas versões + necessidade de garbage collection (VACUUM). Bancos modernos (Postgres, Oracle, SQL Server desde 2005) usam MVCC.</p><p>Tradeoff prático: MVCC é melhor para workloads com leituras frequentes e escritas concorrentes (a maioria das aplicações). 2PL pode ser mais simples para sistemas com poucas transações concorrentes ou onde a sobrecarga de versionamento é proibitiva. Bancos como SQLite usam 2PL para simplicidade.</p><p>Detalhe importante: Postgres usa MVCC para readers, mas writers ainda adquirem row-level locks para escrever. UPDATE em mesma linha bloqueia. SELECT FOR UPDATE adquire lock para impedir UPDATE concorrente. MVCC não elimina toda contenção — só a entre readers e writers.</p>",
      },
      {
        q: "O que é HOT update no Postgres e quando ele acontece?",
        level: "senior",
        a: "<p><strong>HOT (Heap-Only Tuple) update</strong> é uma otimização do Postgres: quando um UPDATE não modifica colunas indexadas E há espaço livre na mesma página, a nova versão da tupla é criada na mesma página, sem precisar atualizar os índices. Isso reduz drasticamente a write amplification de UPDATEs.</p><p>Condições para HOT update: (1) nenhuma coluna indexada foi modificada; (2) há espaço livre na mesma página da tupla original; (3) o tipo de índice permite (B-Tree sim, alguns índices não). Os índices apontam para a tupla original (HOT chain head), e o Postgres segue a chain para encontrar a versão atual.</p><p>Por que importa: tabela com muitos UPDATEs em colunas não-indexadas + fillfactor configurado para deixar espaço (FILLFACTOR 80) = HOT updates frequentes = menos bloat de índice = menos VACUUM necessário.</p><p>Verificar HOT updates: <code>SELECT relname, n_tup_upd, n_tup_hot_upd FROM pg_stat_user_tables ORDER BY n_tup_hot_upd DESC;</code>. Quanto maior a razão hot_upd/upd, melhor.</p>",
      },
      {
        q: "O que são tuple lock vs row-level lock no Postgres?",
        level: "senior",
        a: "<p>Postgres usa locks em diferentes granularidades. <strong>Tuple lock</strong> é o mais fino: aplicado a uma tupla específica (versão de linha) durante UPDATE, DELETE ou SELECT FOR UPDATE. Outras transações que tentem modificar a mesma tupla aguardam.</p><p>Modos de tuple lock: <strong>FOR UPDATE</strong> (exclusive — para UPDATE/DELETE), <strong>FOR NO KEY UPDATE</strong> (mais permissivo, permite outras tx fazerem SELECT FOR KEY SHARE), <strong>FOR SHARE</strong> (compartilhado — múltiplas tx podem segurar), <strong>FOR KEY SHARE</strong> (apenas FK references).</p><p>Pattern útil: <code>SELECT ... FOR UPDATE SKIP LOCKED</code> implementa fila distribuída — workers concorrentes pegam jobs diferentes sem se bloquear. Cada worker pula jobs já lockados por outros workers e processa só os disponíveis. Usado por sistemas como Sidekiq, Celery, GoodJob.</p><p>Cuidado: SELECT FOR UPDATE em transação longa bloqueia outras transações indefinidamente. Combine com <code>statement_timeout</code> e <code>lock_timeout</code> para garantir liberação.</p>",
      },
    ],
    mnemonics: [
      {
        label: "XX — campos de visibilidade",
        trick: "Xmin, Xmax",
        explanation: "Os 2 campos invisíveis em cada tupla que controlam visibilidade. xmin: XID que criou a tupla. xmax: XID que deletou ou substituiu. Tupla é visível para a transação T se xmin foi committed antes do snapshot de T E xmax é nulo ou não foi committed antes do snapshot. Toda decisão de visibilidade do MVCC desce a essa regra.",
      },
      {
        label: "RRS — níveis de isolamento Postgres",
        trick: "Read committed, Repeatable read, Serializable",
        explanation: "Os 3 níveis disponíveis (Postgres não tem Read Uncommitted — é mapeado para Read Committed). RC: snapshot por statement, default. RR: snapshot fixo no BEGIN, evita non-repeatable read e phantom (Postgres é mais forte que padrão SQL). Serializable: SSI detecta write skew, requer retry da aplicação em serialization_failure.",
      },
      {
        label: "VAFR — operações do VACUUM",
        trick: "Visibility map, Analyze stats, Free space, Remove dead",
        explanation: "Os 4 trabalhos que o VACUUM faz. Visibility map: marca páginas all-visible para Index Only Scan. Analyze stats: VACUUM ANALYZE atualiza pg_statistic para o planner. Free space: marca espaço de dead tuples como reutilizável. Remove dead: limpa tuplas com xmax < oldest_xmin. VACUUM FREEZE adiciona um quinto: congela tuplas antigas para prevenir XID wraparound.",
      },
      {
        label: "BLW — emergências operacionais",
        trick: "Bloat, Long-running transaction, Wraparound",
        explanation: "As 3 crises operacionais clássicas do MVCC mal gerenciado. Bloat: dead tuples acumuladas degradam performance. Long-running transaction: bloqueia VACUUM ao manter oldest_xmin baixo. Wraparound: age(datfrozenxid) próximo de 2B força modo read-only de emergência. Os 3 estão conectados — long-running TX causa bloat e impede freeze, levando a wraparound.",
      },
    ],
    exercises: [
      {
        level: "iniciante",
        title: "Visualizar xmin e xmax de tuplas",
        description: "Em uma tabela de teste, faça INSERT, UPDATE e DELETE de uma linha em transações separadas. Use SELECT xmin, xmax, * FROM tabela em uma sessão paralela com isolation level Read Committed e Repeatable Read. Observe como cada nível enxerga as versões diferentemente.",
        concepts: ["MVCC", "xmin", "xmax", "snapshot", "isolation level"],
        hint: "Postgres expõe xmin e xmax como pseudo-colunas. CREATE TABLE teste(id INT, valor TEXT). Sessão 1: BEGIN; INSERT INTO teste VALUES (1, 'a'); -- não commit. Sessão 2: SELECT xmin, xmax, * FROM teste; -- não vê a linha. Sessão 1: COMMIT. Sessão 2: SELECT — agora vê com xmin = XID da Sessão 1.",
      },
      {
        level: "intermediario",
        title: "Diagnosticar e resolver bloat severo",
        description: "Você tem uma tabela pedidos com 100M linhas e 40% de dead tuples (descobertos via pg_stat_user_tables). Investigue a causa: rode query para detectar long-running transactions, verifique se autovacuum está rodando, calcule bloat exato com pgstattuple. Aplique correção sem downtime.",
        concepts: ["bloat", "autovacuum", "pgstattuple", "pg_repack"],
        hint: "Diagnóstico: SELECT * FROM pg_stat_activity WHERE state = 'idle in transaction' AND query_start < now() - interval '1 hour' — se há resultados, terminar com pg_terminate_backend. Verificar last_autovacuum em pg_stat_user_tables. CREATE EXTENSION pgstattuple; SELECT * FROM pgstattuple('pedidos'). Para correção: ALTER TABLE pedidos SET (autovacuum_vacuum_scale_factor = 0.01); pg_repack para limpeza imediata sem lock exclusivo.",
      },
      {
        level: "intermediario",
        title: "Implementar fila distribuída com SELECT FOR UPDATE SKIP LOCKED",
        description: "Crie uma tabela de jobs (id, payload JSONB, status, criado_em). Implemente um worker que pega o próximo job disponível usando SELECT FOR UPDATE SKIP LOCKED, processa, e commita o resultado. Demonstre com 5 workers concorrentes que cada job é processado exatamente uma vez sem deadlocks.",
        concepts: ["row locks", "SKIP LOCKED", "filas", "concorrência"],
        hint: "Padrão: BEGIN; SELECT id, payload FROM jobs WHERE status = 'pendente' ORDER BY criado_em LIMIT 1 FOR UPDATE SKIP LOCKED; UPDATE jobs SET status = 'processando' WHERE id = $1; -- processa; UPDATE jobs SET status = 'concluido', resultado = $2 WHERE id = $1; COMMIT. SKIP LOCKED faz workers pegarem jobs diferentes sem esperar uns aos outros. Adicione índice em (status, criado_em) WHERE status = 'pendente' (parcial).",
      },
      {
        level: "senior",
        title: "Implementar retry para Serializable transactions",
        description: "Um sistema de plantão médico exige Serializable isolation para evitar write skew (regra: pelo menos 1 médico ativo). Implemente em pseudo-código (Node.js, Python, Go ou similar) o padrão de retry para serialization_failure (40001). Inclua: detecção do erro, rollback completo, retry com backoff exponencial, limite máximo de tentativas, log de cada retry para observabilidade.",
        concepts: ["Serializable", "SSI", "retry pattern", "write skew"],
        hint: "Estrutura: function withSerializableRetry(operation, maxRetries = 5) { for (let i = 0; i < maxRetries; i++) { try { await client.query('BEGIN ISOLATION LEVEL SERIALIZABLE'); await operation(client); await client.query('COMMIT'); return; } catch (err) { await client.query('ROLLBACK'); if (err.code !== '40001' || i === maxRetries - 1) throw err; await sleep(Math.min(100 * 2 ** i, 5000)); } } }. Importante: o retry envolve a transação INTEIRA, não só o último statement. Qualquer estado acumulado fora da transação precisa ser recalculado.",
      },
      {
        level: "senior",
        title: "Monitorar e alertar XID wraparound",
        description: "Implemente um sistema de monitoramento que: (1) coleta age(datfrozenxid) por database em intervalos de 5 minutos; (2) emite alerta WARNING quando age > 500M; (3) emite alerta CRITICAL quando age > 1.5B; (4) inclui dashboard com tabelas que mais precisam de freeze. Documente o runbook de resposta para cada alerta.",
        concepts: ["XID wraparound", "monitoramento", "VACUUM FREEZE", "runbook"],
        hint: "Coleta: SELECT datname, age(datfrozenxid) AS xid_age FROM pg_database — exportar para Prometheus via postgres_exporter ou pg_stat_monitor. Para tabelas: SELECT relname, age(relfrozenxid) FROM pg_class WHERE relkind='r' ORDER BY age(relfrozenxid) DESC LIMIT 20. Runbook WARNING: aumentar agressividade do autovacuum nas tabelas mais antigas. Runbook CRITICAL: VACUUM FREEZE manual em janela de manutenção, considerar redução de vacuum_freeze_max_age. Runbook EMERGENCY (banco read-only): VACUUM FREEZE com acesso single-user mode.",
      },
    ],
    resources: [
      { title: "PostgreSQL — MVCC docs oficiais", url: "https://www.postgresql.org/docs/current/mvcc.html", kind: "docs" },
      { title: "PostgreSQL — Routine Vacuuming", url: "https://www.postgresql.org/docs/current/routine-vacuuming.html", kind: "docs" },
      { title: "depesz — VACUUM explained", url: "https://www.depesz.com/2013/12/11/waiting-for-9-4-vacuuming-freezing/", kind: "artigo" },
      { title: "Cybertec — Table bloat diagnosis", url: "https://www.cybertec-postgresql.com/en/detecting-table-bloat/", kind: "artigo" },
      { title: "pg_repack docs", url: "https://github.com/reorg/pg_repack", kind: "docs" },
      { title: "PostgreSQL Internals — MVCC chapter", url: "https://www.interdb.jp/pg/pgsql05.html", kind: "livro" },
      { title: "Designing Data-Intensive Applications — capítulo 7 (transactions)", url: "https://dataintensive.net/", kind: "livro" },
      { title: "Postgres SSI — paper original", url: "https://drkp.net/papers/ssi-vldb12.pdf", kind: "artigo" },
      { title: "pgstattuple — bloat real", url: "https://www.postgresql.org/docs/current/pgstattuple.html", kind: "docs" },
    ],
  },

  "b-tree-lsm-tree": {
    tagline: "Estruturas de índice: B-Tree (leitura otimizada) vs LSM-Tree (escrita otimizada).",
    why: "B-Tree é o padrão em Postgres/MySQL. LSM-Tree é o segredo de RocksDB, Cassandra, LevelDB. Saber o tradeoff explica por que esses bancos existem e quando usar cada um.",
    summary: "B-Tree é uma árvore balanceada auto-ajustável. Nós têm múltiplas chaves; busca O(log n), insert/update O(log n) com rebalanceamento in-place. Excelente para leitura, update frequente é caro (random I/O). LSM-Tree (Log-Structured Merge Tree) escreve em memtable (sequencial), faz flush para SSTables imutáveis, compacta em background. Escrita O(1) amortizado; leitura mais cara (múltiplos SSTables).\n\nBloom filters são o enabler da leitura eficiente em LSM: dizem 'definitivamente não está aqui' com 100% de precisão (zero false negatives), evitando I/O desnecessário na maioria das leituras miss. A compactação periódica reduz o número de SSTables, melhorando leitura ao custo de write amplification.",
    keypoints: [
      { title: "B-Tree: estrutura", body: "Árvore de altura O(log n). Cada nó tem M chaves e M+1 filhos. Folhas são doubly-linked para range scan. Postgres usa variante B+ Tree (dados só nas folhas, melhora range scan)." },
      { title: "B-Tree: tradeoffs", body: "Leitura: muito boa (busca pontual, range). Update: bom mas random write no disco (write amplification). Fragmentação e VACUUM/reindex necessários com tempo." },
      { title: "LSM-Tree: estrutura", body: "Writes vão para memtable (in-memory, ordenada). Quando cheia, flush imutável para SSTable em disco. Múltiplas SSTables por nível. Compactação periódica mescla e ordena." },
      { title: "LSM-Tree: tradeoffs", body: "Escrita: excelente (sequencial, baixa latência). Leitura: mais cara (verifica múltiplas SSTables). Bloom filter otimiza: 'essa chave existe neste SSTable?' com alta precisão e custo mínimo." },
      { title: "Bloom Filter", body: "Estrutura probabilística: diz 'definitivamente não está aqui' (false negative impossível) ou 'provavelmente está aqui' (false positive possível). Economiza I/O em LSM evitando leitura de SSTables desnecessárias." },
      { title: "Compactação", body: "LSM-Tree tem write amplification na compactação (dado escrito várias vezes). Strategies: size-tiered (Cassandra default, menos I/O de compactação) vs leveled (RocksDB default, menos read amplification)." },
      { title: "Uso em bancos", body: "B-Tree: Postgres, MySQL (InnoDB), SQLite. LSM-Tree: RocksDB (base do MyRocks, TiKV, PebbleDB), Cassandra, HBase, LevelDB, InfluxDB." },
    ],
    diagrams: [
      {
        title: "B-Tree vs LSM-Tree: fluxo de escrita e leitura",
        html: `<style>
  .bt-wrap { font-family: 'Space Grotesk', sans-serif; background: #0f172a; color: #e2e8f0; padding: 24px; border-radius: 12px; }
  .bt-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .bt-col { background: #0d1117; border-radius: 10px; padding: 16px; border: 1.5px solid; }
  .bt-pg { border-color: #4169E1; }
  .bt-lsm { border-color: #DC382D; }
  .bt-head { font-size: 13px; font-weight: 700; margin-bottom: 12px; text-align: center; }
  .bt-pg .bt-head { color: #4169E1; }
  .bt-lsm .bt-head { color: #DC382D; }
  .bt-step { display: flex; align-items: flex-start; gap: 8px; margin: 6px 0; font-size: 12px; color: #94a3b8; line-height: 1.4; }
  .bt-num { font-weight: 700; min-width: 16px; }
  .bt-pg .bt-num { color: #4169E1; }
  .bt-lsm .bt-num { color: #DC382D; }
  .bt-bar { margin-top: 12px; display: flex; gap: 4px; align-items: center; font-size: 11px; }
  .bt-label { color: #64748b; min-width: 60px; }
  .bt-fill { height: 8px; border-radius: 4px; }
  .bt-section { margin-top: 20px; }
  .bt-title { color: #4d9fcf; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; text-align: center; }
  .bt-table { width: 100%; border-collapse: collapse; font-size: 12px; }
  .bt-table th { background: #1e293b; color: #64748b; padding: 6px 10px; text-align: left; font-weight: 600; }
  .bt-table td { padding: 6px 10px; border-top: 1px solid #1e293b; color: #94a3b8; }
  .bt-table td:first-child { color: #e2e8f0; font-weight: 600; }
  .good { color: #22c55e !important; }
  .bad { color: #ef4444 !important; }
  .mid { color: #f59e0b !important; }
</style>
<div class="bt-wrap">
  <div class="bt-grid">
    <div class="bt-col bt-pg">
      <div class="bt-head">B-Tree (Postgres, MySQL)</div>
      <div class="bt-step"><span class="bt-num">W</span><span>Write → navega a árvore até o nó folha → modifica in-place → rebalanceia se necessário (random I/O)</span></div>
      <div class="bt-step"><span class="bt-num">R</span><span>Read → traversal O(log n) → lê folha → done (1 lookup)</span></div>
      <div class="bt-bar"><span class="bt-label">Escrita</span><div class="bt-fill" style="width:55%;background:#f59e0b"></div><span style="color:#f59e0b;font-size:11px;margin-left:4px">média</span></div>
      <div class="bt-bar"><span class="bt-label">Leitura</span><div class="bt-fill" style="width:90%;background:#22c55e"></div><span style="color:#22c55e;font-size:11px;margin-left:4px">excelente</span></div>
    </div>
    <div class="bt-col bt-lsm">
      <div class="bt-head">LSM-Tree (RocksDB, Cassandra)</div>
      <div class="bt-step"><span class="bt-num">W</span><span>Write → memtable (RAM, sequencial) → flush → SSTable imutável → compactação em background</span></div>
      <div class="bt-step"><span class="bt-num">R</span><span>Read → memtable → SSTable L0 → L1 → ... (Bloom filter elimina leituras desnecessárias)</span></div>
      <div class="bt-bar"><span class="bt-label">Escrita</span><div class="bt-fill" style="width:95%;background:#22c55e"></div><span style="color:#22c55e;font-size:11px;margin-left:4px">excelente</span></div>
      <div class="bt-bar"><span class="bt-label">Leitura</span><div class="bt-fill" style="width:60%;background:#f59e0b"></div><span style="color:#f59e0b;font-size:11px;margin-left:4px">boa*</span></div>
    </div>
  </div>
  <div class="bt-section">
    <div class="bt-title">Comparativo rápido</div>
    <table class="bt-table">
      <tr><th>Aspecto</th><th>B-Tree</th><th>LSM-Tree</th></tr>
      <tr><td>Write latência</td><td class="mid">média (random I/O)</td><td class="good">baixa (sequencial)</td></tr>
      <tr><td>Read pontual</td><td class="good">excelente (1 lookup)</td><td class="mid">boa (bloom filter)</td></tr>
      <tr><td>Range scan</td><td class="good">excelente (linked leaves)</td><td class="mid">razoável</td></tr>
      <tr><td>Espaço em disco</td><td class="mid">fragmentação com tempo</td><td class="bad">write amplification</td></tr>
      <tr><td>Use when</td><td>leitura > escrita</td><td>escrita intensa</td></tr>
    </table>
  </div>
</div>`,
        caption: "* Bloom filters tornam a leitura em LSM muito mais eficiente: evitam verificar SSTables que certamente não têm a chave.",
      },
    ],
    gotchas: [
      "LSM-Tree não tem vantagem em leitura — múltiplos SSTable lookups são mais lentos que B-Tree para ponto único sem bloom filter bem calibrado.",
      "Compactação do LSM consome I/O — em carga pesada, compactação compete com queries. Monitore compaction lag no RocksDB/Cassandra.",
      "B-Tree com muitos updates em hot row — fragmentação e bloat. FILLFACTOR menor (ex: 70) deixa espaço para updates in-place.",
      "Bloom filter com false positive rate alto — ajuste bits per key para balancear memória vs precisão (mais bits = menos false positives).",
    ],
    interview: [
      {
        q: "Por que Cassandra usa LSM-Tree?",
        a: "<p>Cassandra é otimizado para escrita intensiva em escala. LSM-Tree escreve sequencialmente em disco (muito mais rápido que random write do B-Tree), depois compacta em background. Para workloads onde escrita domina e leitura pode ter um pouco mais de latência, LSM-Tree vence claramente.</p><p>A imutabilidade das SSTables também facilita replicação e compressão. Cassandra não tem UPDATE in-place — escrita sempre é append, e a reconciliação acontece na compactação com tombstones e timestamps.</p>",
        level: "senior",
      },
      {
        q: "Quando B-Tree é melhor que LSM-Tree?",
        a: "<p>Leitura pesada e update frequente: B-Tree tem melhor latência de leitura pontual (uma árvore vs múltiplos SSTables). Range scan: B-Tree tem doubly-linked leaves, muito eficiente para ORDER BY com LIMIT.</p><p>LSM-Tree brilha em write-heavy workloads onde throughput de escrita é crítico e pode-se tolerar reads ligeiramente mais lentos. Também é melhor para SSDs — I/O sequencial é muito mais rápido que random em NVMe.</p>",
        tip: "Mencionar que SSDs mudam o cálculo (random I/O em SSD não é tão pior que sequencial) demonstra profundidade.",
        level: "senior",
      },
      {
        q: "O que é write amplification e onde ocorre?",
        a: "<p>Write amplification é a razão entre bytes escritos em disco e bytes de dados de entrada. Em B-Tree: ~2-5x (escreve o dado e atualiza metadados do índice). Em LSM-Tree: ~10-30x porque o dado é escrito na memtable, no flush inicial e em cada nível de compactação.</p><p>Leveled compaction (RocksDB) tem write amplification maior que size-tiered (Cassandra default) mas read amplification muito menor — é o tradeoff de compaction strategy.</p>",
        level: "senior",
      },
      {
        q: "Como Bloom filter ajuda na leitura de LSM-Tree?",
        a: "<p>Bloom filter é uma estrutura probabilística que responde 'esta chave definitivamente não está neste SSTable' ou 'esta chave provavelmente está aqui'. False negatives são impossíveis — se o filter diz não está, a chave com certeza não está e não precisa abrir o SSTable.</p><p>Isso transforma read miss de O(n) SSTables para O(1) na maioria dos casos. O tamanho do filter (bits per key) controla a taxa de false positives. RocksDB e Cassandra configuram bits por chave para balancear memória vs eficiência.</p>",
        level: "senior",
      },
    ],
    resources: [
      { title: "DDIA — Chapter 3 (Storage Engines)", url: "https://dataintensive.net/", kind: "livro" },
      { title: "RocksDB — Compaction explained", url: "https://github.com/facebook/rocksdb/wiki/Compaction", kind: "docs" },
    ],
  },

  // ─── P2 ──────────────────────────────────────────────────────────────────

  "redis": {
    tagline: "Store in-memory chave-valor: cache, filas, pub/sub, rate limiting, session, leaderboard.",
    why: "Redis é onipresente em stack de produção. Saber estruturas de dados, persistência, cluster e patterns (cache-aside, pub/sub, Lua scripting) é essencial para qualquer backend.",
    summary: "Redis é um store in-memory que suporta múltiplas estruturas de dados: string, hash, list, set, sorted set, stream, HyperLogLog, bitmap, geoespacial. Latência sub-milissegundo em leituras. Persistência via RDB (snapshot) ou AOF (append-only log). Cluster para sharding horizontal. Sentinel para HA. Redis Stack adiciona JSON, search e time séries.\n\nO modelo single-threaded do Redis garante atomicidade de comandos individuais sem locks. Para operações compostas, use MULTI/EXEC (transação otimista com WATCH) ou Lua scripts — que executam atomicamente. Evite operações O(N) como KEYS *, SMEMBERS em sets grandes ou LRANGE em lists longas.",
    keypoints: [
      { title: "Estruturas de dados", body: "String (KV simples, contadores), Hash (objeto), List (LPUSH/RPOP — fila ou stack), Set (conjunto único), Sorted Set (ranking por score), Stream (log de eventos, consumer groups)." },
      { title: "Atomicidade e Lua", body: "Comandos individuais são atômicos. MULTI/EXEC para transação otimista com WATCH. Lua scripts executam atomicamente (melhor para lógica complexa que precisa de múltiplos comandos atômicos)." },
      { title: "Persistência", body: "RDB: snapshot periódico. Compacto, rápido para restore, pode perder dados entre snapshots. AOF: log de cada operação. Mais durável, arquivo maior. Hybrid: RDB + AOF para melhor dos dois mundos." },
      { title: "Eviction policies", body: "allkeys-lru, volatile-lru, allkeys-random, noeviction. Define o que acontece quando memória fica cheia. Para cache puro: allkeys-lru. Para mix de dados persistentes e cache: volatile-lru." },
      { title: "Pub/Sub", body: "PUBLISH channel message. SUBSCRIBE channel. Mensagens não persistidas — subscriber offline perde. Para persistência e consumer groups, use Stream com XADD/XREADGROUP." },
      { title: "Redis Cluster", body: "16.384 hash slots distribuídos entre masters. Cada master tem réplicas. Client faz MOVED redirect para slot correto. Sem suporte a multi-key em slots diferentes sem hash tags." },
      { title: "Patterns", body: "Cache-aside, session store, rate limiter (INCR + EXPIRE), distributed lock (SET key NX EX), leaderboard (Sorted Set ZADD/ZRANK), job queue (List ou Stream), pub/sub event bus." },
    ],
    gotchas: [
      "Sem persistência configurada — restart perde tudo. Configure RDB ou AOF conforme SLA de perda de dados.",
      "KEYS * em produção — O(N), bloqueia Redis single-threaded por segundos em instâncias grandes. Use SCAN com cursor.",
      "SET sem TTL para cache — memória cresce indefinidamente até atingir maxmemory e ativar eviction.",
      "Multi-key operation no Cluster — keys em slots diferentes falham. Use hash tags {user}:profile, {user}:cart para garantir mesmo slot.",
      "Lua script longo — bloqueia Redis. Mantenha scripts atômicos e rápidos; não faça loops com muitas iterações.",
      "Pub/Sub sem subscriber — mensagem perdida silenciosamente. Use Stream para durabilidade e replay.",
    ],
    interview: [
      {
        q: "Como implementaria distributed lock com Redis?",
        a: "<p>SET lock_key unique_value NX EX 30 — atomic check-and-set com TTL. NX garante que só um cliente adquire. TTL evita deadlock se cliente morrer sem liberar o lock.</p><p>Release: Lua script que verifica se value ainda é o meu antes de DEL (evita liberar lock de outro cliente que adquiriu após TTL expirar).</p><p>Para produção com alta disponibilidade: Redlock (algoritmo oficial) com N instâncias Redis ímpares — lock adquirido quando maioria confirma. Protege contra falha de uma instância.</p>",
        level: "senior",
      },
      {
        q: "Diferença entre List e Stream para fila de tarefas?",
        a: "<p>List (LPUSH/BRPOP): simples, baixa latência, sem consumer groups, sem ack, sem replay. Mensagem consumida é removida — se o consumer morrer, mensagem perde.</p><p>Stream: consumer groups com ack explícito (XACK), replay de mensagens, histórico configurável, múltiplos consumers em paralelo por group, pending entries list para rastrear não-ackadas. Para filas de produção com garantias de entrega, Stream é superior. Para filas simples com baixo risco de perda, List é suficiente e mais simples.</p>",
        level: "pleno",
      },
      {
        q: "Como implementaria rate limiting com Redis?",
        a: "<p>Sliding window com Sorted Set: ZADD key timestamp timestamp, ZREMRANGEBYSCORE key 0 (now-window), ZCARD key para contar requests na janela. Atômico via Lua script.</p><p>Fixed window mais simples: INCR key:minute, EXPIRE key:minute 60. Risco de burst na virada do minuto. Token bucket: mais sofisticado, Lua script com HGET/HSET para tokens e timestamp do último refill.</p>",
        level: "senior",
      },
      {
        q: "O que é Redis Cluster e quais as limitações?",
        a: "<p>Redis Cluster distribui 16.384 hash slots entre múltiplos masters. Cada key mapeia para um slot via CRC16. Client redireciona para o master correto via MOVED redirect.</p><p>Limitações: (1) multi-key commands exigem que todas as keys estejam no mesmo slot — use hash tags {tag}; (2) sem cross-slot transactions; (3) SCAN itera um nó por vez; (4) pub/sub não propaga entre nós. Para sharding sem essas limitações, Redis com client-side sharding ou proxies como Twemproxy são alternativas.</p>",
        level: "senior",
      },
    ],
    resources: [
      { title: "Redis docs", url: "https://redis.io/docs/", kind: "docs" },
      { title: "Redis University", url: "https://university.redis.com/", kind: "curso" },
      { title: "Redis — Data Types Introduction", url: "https://redis.io/docs/data-types/", kind: "docs" },
    ],
  },

  "elasticsearch": {
    tagline: "Motor de busca e analytics distribuído baseado em Lucene.",
    why: "Elasticsearch (e OpenSearch) é o padrão para busca full-text e analytics de logs. Sênior precisa saber inverted index, mappings, aggregations e quando não usar Elastic.",
    summary: "Elasticsearch é um motor de busca distribuído construído sobre Lucene. Armazena documentos JSON em índices. Busca full-text via inverted index, relevance scoring (BM25), aggregations para analytics em tempo real. Horizontalmente escalável com sharding e réplicas. Kibana para visualização. ELK Stack (Elasticsearch, Logstash, Kibana) para logs.\n\nA distinção mais importante para autoria de conteúdo é entre campos text e keyword: text passa pelo analyzer (tokenização, lowercase, stemming) e serve para busca full-text; keyword não é analisado e serve para filtros, sorts e aggregations exatas. Confundir os dois é a fonte de 80% dos bugs de mapeamento.",
    keypoints: [
      { title: "Inverted index", body: "Mapa de termo → lista de documentos que o contêm. Core do Lucene. Permite busca full-text O(1) para termos exatos. Analyzer tokeniza e normaliza texto (lowercase, stemming, stop words)." },
      { title: "Mappings", body: "Schema do índice. Define tipos de campo (text, keyword, date, number, geo_point). text: analisado, para busca full-text. keyword: não analisado, para filtro/sort/aggregation exato." },
      { title: "Analyzers", body: "Pipeline de tokenização: character filter → tokenizer → token filter. Standard analyzer: lowercase + tokenização por whitespace/pontuação. Custom analyzers para línguas ou domínios específicos (pt_BR stemmer)." },
      { title: "Relevance scoring", body: "BM25 (default desde ES 5): mede TF-IDF com normalização por tamanho de documento. Score mais alto = mais relevante. Boost por campo, function_score para customizar (ex: score × freshness)." },
      { title: "Aggregations", body: "Bucket (group by: terms, date_histogram, range), Metric (sum, avg, max, percentiles), Pipeline (cumulativo, derivativo). Permite analytics em tempo real sobre os dados indexados sem ETL separado." },
      { title: "Sharding e réplicas", body: "Índice dividido em N shards (distribuição de dados). Cada shard tem M réplicas (HA e read scaling). Primary shard recebe escrita; réplica pode servir leitura. Shard count é fixo no momento de criação." },
      { title: "Near real-time", body: "Indexação não é imediata: documento vai para buffer, refresh periódico (default 1s) cria novo segmento Lucene. Após refresh, documento aparece em buscas. Para indexação em lote, aumente o refresh_interval." },
    ],
    gotchas: [
      "Dynamic mapping com campos desconhecidos — campo numérico indexado como text não é agregável. Defina mappings explicitamente antes de indexar.",
      "Shard count fixo no momento de criação — mudar requer reindex completo. Pense bem antes de criar (regra geral: 20-40GB por shard).",
      "Query em campo text para filtro exato — use keyword. text passa por analyzer (lowercase etc.), keyword não.",
      "Aggregation em campo text sem fielddata — desabilitado por default (consome muita memória). Use keyword ou .keyword subfield.",
      "Split brain com número par de master-eligible nodes — sempre use 3 nodes para quorum correto. Par = possibilidade de dois grupos pensando ser o master.",
      "Index per day sem ILM — acumulam índices indefinidamente. Configure Index Lifecycle Management (hot-warm-cold-delete).",
    ],
    interview: [
      {
        q: "Como funciona a busca full-text no Elasticsearch?",
        a: "<p>Query passa pelo mesmo analyzer que indexou: tokenização, lowercase, stemming. Termos resultantes buscados no inverted index. Para cada documento que contém os termos, calcula score BM25 (frequência do termo, raridade do termo no corpus, tamanho do documento).</p><p>Documentos retornados ordenados por score. Bool query combina must (obrigatório, afeta score), should (opcional, boost no score), filter (obrigatório, não afeta score, é cacheado — use para filtros). Must Not para exclusão.</p>",
        level: "pleno",
      },
      {
        q: "Quando NÃO usar Elasticsearch?",
        a: "<p>Source of truth para dados transacionais — ES não tem ACID. Use como projeção secundária dos dados primários (sincronize via CDC ou event driven).</p><p>Dados pequenos — Postgres com pg_trgm ou full-text search nativo resolve sem a complexidade operacional de ES.</p><p>Quando latência de indexação (near real-time, ~1s) é problema — ES não é para dados em tempo real strict.</p><p>Quando precisa de JOINs complexos — ES é desnormalizado por natureza, JOINs são via nested objects ou parent-child com custo alto.</p>",
        level: "senior",
      },
      {
        q: "Como você implementaria busca com relevance tuning?",
        a: "<p>Multi-match query com boost por campo: title^3, description^1, tags^2. BM25 calcula score base; boost multiplica. function_score adiciona sinais externos: freshness (decay), popularidade, score de negócio.</p><p>Para relevance tuning iterativo: ES Learning to Rank com features (clicks, conversão) ou simplesmente testar com explain API para entender como cada documento recebeu seu score. Logging de queries e resultados para análise offline.</p>",
        level: "senior",
      },
      {
        q: "O que é Index Lifecycle Management (ILM)?",
        a: "<p>ILM automatiza a gestão de índices ao longo do tempo através de fases: hot (escrita e leitura intensas), warm (leitura, menos recursos), cold (acesso raro, comprimido), delete (expiração).</p><p>Para logs e time-series, padrão típico: índice novo por dia/semana, rollover quando atingir tamanho ou idade, move para warm após X dias, delete após Y dias. Evita crescimento indefinido e otimiza custos de hardware.</p>",
        level: "senior",
      },
    ],
    resources: [
      { title: "Elasticsearch docs", url: "https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html", kind: "docs" },
      { title: "Elasticsearch — The Definitive Guide", url: "https://www.elastic.co/guide/en/elasticsearch/guide/current/index.html", kind: "livro" },
    ],
  },

  "pgvector": {
    tagline: "Extensão Postgres para armazenar e buscar vetores (embeddings) com ANN.",
    why: "pgvector permite fazer RAG e semantic search sem um vector DB separado. Integra com Postgres existente. Saber os índices (IVFFlat, HNSW) e quando sair do Postgres para Qdrant/Pinecone é diferencial em stack AI.",
    summary: "pgvector adiciona o tipo vector ao Postgres, operadores de distância (cosine, L2, inner product) e índices ANN: IVFFlat (inverted file, menor RAM) e HNSW (melhor recall, mais RAM). Permite busca semântica sobre embeddings de texto/imagem diretamente no Postgres, combinando com filtros relacionais.\n\nA principal vantagem é a simplicidade operacional: sem banco adicional, transações ACID incluindo vetores, filtros SQL nativo. A limitação é escala — acima de ~10M vetores, HNSW em RAM se torna proibitivo e bancos especializados como Qdrant ou Pinecone são mais eficientes.",
    keypoints: [
      { title: "Tipo vector", body: "Coluna vector(1536) para embedding OpenAI text-embedding-3-small. Suporta dimensões de 1 a 16.000. Operadores: <-> (L2), <=> (cosine), <#> (inner product negativo)." },
      { title: "IVFFlat index", body: "Particiona vetores em N listas via k-means. Busca compara query com centroids, pega top K listas, busca dentro delas. Menor RAM que HNSW. Parâmetros: lists (clusters), probes (quantas listas buscar em query)." },
      { title: "HNSW index", body: "Grafo hierárquico de navegabilidade. Melhor recall e latência que IVFFlat. Mais RAM (todos os vetores ficam no grafo). Parâmetros: m (conexões por nó), ef_construction (construção), ef_search (busca). Disponível desde pgvector 0.5." },
      { title: "Hybrid search", body: "Combina busca vetorial com filtros SQL: SELECT ... ORDER BY embedding <=> $1 WHERE category = 'X' LIMIT 10. Pré-filtro muito seletivo pode degradar ANN — pgvector cai para seq scan em alguns casos." },
      { title: "Distâncias", body: "Cosine similarity para embeddings de texto (normaliza por magnitude, bom para comparação semântica). L2 para embeddings geométricos. Inner product para modelos que maximizam produto interno (ada-002 da OpenAI)." },
      { title: "Quando sair do Postgres", body: "Bilhões de vetores: HNSW em RAM inviável. Filtros complexos frequentes: Qdrant tem HNSW filterable nativo. Multitenancy: Qdrant tem collections isoladas. Mas até ~10M vetores, pgvector resolve bem." },
    ],
    gotchas: [
      "Vetores não normalizados com cosine similarity — resultado errado. Normalize ao inserir ou use l2_normalize().",
      "IVFFlat sem ANALYZE após carga inicial — statistics erradas, planner pode escolher seq scan.",
      "HNSW com m muito alto — RAM explode. Default m=16 é bom ponto de partida (cada vetor = m * 2 ponteiros).",
      "SELECT sem LIMIT em tabela grande — retorna todos os vetores com scores, sem index pruning eficiente.",
      "Índice não usado com WHERE clause muito seletiva — pré-filtro pode fazer pgvector cair para seq scan. Verifique com EXPLAIN.",
    ],
    interview: [
      {
        q: "Quando usaria pgvector vs Qdrant?",
        a: "<p>pgvector: já tem Postgres na stack, volume moderado (<10M vetores), quer combinar busca vetorial com queries relacionais (JOINs, transações), quer simplicidade operacional.</p><p>Qdrant: volume grande (100M+), filtros complexos e frequentes, performance de busca crítica com SLA de latência, multitenancy por collection, payload filtering nativo eficiente.</p><p>Estratégia: comece com pgvector. Migre quando precisar — a API de busca vetorial é similar o suficiente para abstração.</p>",
        level: "pleno",
      },
      {
        q: "Como implementaria RAG com pgvector?",
        a: "<p>1. Chunk documentos (500–1000 tokens com overlap de 100). 2. Gera embeddings (OpenAI text-embedding-3-small ou similar). 3. Armazena em tabela: id, content TEXT, embedding vector(1536), metadata JSONB, source TEXT. 4. Cria HNSW index: CREATE INDEX ON docs USING hnsw(embedding vector_cosine_ops). 5. Query: gera embedding da pergunta, faz SELECT content ORDER BY embedding <=> $1 LIMIT 5. 6. Passa chunks recuperados como contexto para o LLM.</p>",
        tip: "Mencionar overlap de chunks e o armazenamento de metadata para filtragem contextual demonstra experiência prática.",
        level: "pleno",
      },
      {
        q: "Qual a diferença entre IVFFlat e HNSW?",
        a: "<p>IVFFlat: divide vetores em N clusters (lists). Query busca em top-K clusters (probes). Menor RAM (armazena apenas centroids + índice compacto). Recall depende de probes — mais probes = melhor recall, mais lento. Requer carga inicial para treinar k-means (bom para bulk insert).</p><p>HNSW: grafo hierárquico onde cada nó conecta a M vizinhos em múltiplas camadas. Busca navega do topo ao fundo. Melhor recall com mesma latência que IVFFlat. Mais RAM (grafo completo em memória). Mais rápido para inserts incrementais. Escolha HNSW para produção com volume moderado.</p>",
        level: "senior",
      },
    ],
    resources: [
      { title: "pgvector GitHub", url: "https://github.com/pgvector/pgvector", kind: "docs" },
      { title: "Supabase — pgvector guide", url: "https://supabase.com/docs/guides/ai/vector-columns", kind: "docs" },
    ],
  },

  "qdrant": {
    tagline: "Vector database de alta performance: HNSW filterable, payload indexing, multitenancy.",
    why: "Qdrant é uma das melhores opções para vector DB em produção. Saber quando usar sobre pgvector, como configurar coleções e filtros, é diferencial em stack AI.",
    summary: "Qdrant é um vector database escrito em Rust, otimizado para busca ANN com filtros. Suporta HNSW com filtros (filterable HNSW), payload indexing (índices em metadados), named vectors (múltiplos vetores por ponto), sparse vectors (para hybrid search BM25 + denso), collections, snapshots e API REST/gRPC.\n\nO principal diferencial do Qdrant sobre soluções como pgvector é o filterable HNSW: durante a construção do índice, o grafo é consciente dos filtros mais comuns, permitindo busca vetorial filtrada sem o custo de pre/post-filtering que degrada recall ou precision.",
    keypoints: [
      { title: "Collections", body: "Unidade de organização. Cada collection tem sua configuração de vetor (dimensão, métrica de distância). Isolamento completo entre collections — boa para multitenancy por cliente." },
      { title: "Points", body: "Unidade de dado: id + vector(s) + payload (metadados JSON). Payload é indexável e filtrável. Suporta upsert atômico." },
      { title: "Filterable HNSW", body: "Qdrant constrói HNSW consciente dos filtros. Para filtros seletivos, atravessa subgrafo relevante. Evita o problema de pre-filter (quebra HNSW) ou post-filter (pode retornar menos que k)." },
      { title: "Payload indexing", body: "Índices em campos do payload (keyword, integer, float, geo). Melhora performance de filtros em busca híbrida. Sem índice, filtro é brute-force." },
      { title: "Named vectors", body: "Um ponto pode ter múltiplos vetores nomeados (ex: title_embedding e body_embedding). Busca em cada um independentemente ou com fusão de scores." },
      { title: "Sparse vectors", body: "Suporte a sparse vectors (BM25, SPLADE). Combinado com dense vectors = hybrid search com Reciprocal Rank Fusion. Melhor recall que só dense em domínios especializados com jargão técnico." },
      { title: "Configuração de coleção", body: "vectors: { size: 1536, distance: Cosine }. hnsw_config: { m: 16, ef_construct: 100 }. quantization_config para comprimir vetores (scalar int8 = 4x menos RAM, recall ~99%)." },
    ],
    gotchas: [
      "Collection sem payload index para filtros frequentes — performance ruim em filtros seletivos (brute-force scan).",
      "m muito alto em HNSW — RAM e tempo de build explodem. Default 16 é bom; aumente para 32 apenas com recall comprovadamente melhor.",
      "Quantização agressiva (binary) — recall cai muito. Scalar (int8) é equilíbrio melhor: 4x menos RAM, recall quase igual.",
      "Sem snapshot/backup — vector DB é estado crítico. Configure snapshots periódicos via API de snapshots do Qdrant.",
      "Payload com chaves dinâmicas — impossível indexar tudo antecipadamente. Pense no schema de payload antes de definir a collection.",
    ],
    interview: [
      {
        q: "Como Qdrant resolve busca com filtros eficientemente?",
        a: "<p>Filterable HNSW: durante a construção do índice, Qdrant é consciente dos filtros mais comuns e constrói o grafo de forma que o traversal possa ser guiado por filtros.</p><p>Durante busca com filtro, em vez de pré-filtrar (quebra o grafo HNSW, destrói o recall) ou pós-filtrar (pode retornar menos que k resultados), Qdrant navega no subgrafo de pontos que satisfazem o filtro. Resultado: recall alto com filtros seletivos sem overhead.</p>",
        level: "senior",
      },
      {
        q: "Quando hybrid search (sparse + dense) é necessário?",
        a: "<p>Dense vectors (embeddings) são bons para similaridade semântica mas podem falhar em matching exato de termos raros: nomes próprios, códigos, jargão técnico, SKUs, IDs. 'iPhone 15 Pro Max 256GB' pode ter score baixo contra 'smartphone Apple 2023' semanticamente, mas exact match é o correto.</p><p>Sparse vectors (BM25, SPLADE) são bons para matching de termos exatos. Combinar via Reciprocal Rank Fusion ou score linear melhora recall em domínios especializados. Qdrant suporta nativamente com query de named vectors.</p>",
        level: "senior",
      },
      {
        q: "Qual a diferença entre Qdrant e pgvector?",
        a: "<p>pgvector: integrado ao Postgres (mesma transação, ACID, JOINs SQL), operacionalmente simples, bom até ~10M vetores. Filtros via SQL mas sem HNSW filterable — filtros muito seletivos degradam performance.</p><p>Qdrant: vector DB dedicado, filterable HNSW nativo, payload indexing, sparse vectors, quantização, collections isoladas. Melhor em escala, filtros complexos, multitenancy. Mais complexidade operacional — servidor adicional, API própria.</p>",
        level: "pleno",
      },
      {
        q: "O que é quantização de vetores e qual o impacto?",
        a: "<p>Quantização reduz a precisão dos floats do vetor para representação menor. Scalar quantization (int8): 4x menos RAM que float32, recall típico > 99%, speedup na busca. Binary quantization: 32x menos RAM, recall pode cair para 90–95%.</p><p>Qdrant suporta quantização por collection com rescoring: busca com vetor quantizado para candidatos, re-rank com vetor original nos top-K. Boa estratégia para manter recall alto com menos RAM.</p>",
        level: "senior",
      },
    ],
    resources: [
      { title: "Qdrant docs", url: "https://qdrant.tech/documentation/", kind: "docs" },
      { title: "Qdrant — Filterable HNSW", url: "https://qdrant.tech/articles/filtrable-hnsw/", kind: "artigo" },
    ],
  },

  // ─── P3 ──────────────────────────────────────────────────────────────────

  "mysql": {
    tagline: "Banco relacional mais usado do mundo — legado robusto, InnoDB, replicação e MySQL 8.",
    why: "MySQL é base de inúmeros sistemas legados e ainda é adotado em novos projetos. Entender suas diferenças em relação ao Postgres e os gotchas do InnoDB evita surpresas em migração ou manutenção.",
    gotchas: [
      "ENUM e SET: alterações de schema em tabelas grandes requerem ALTER TABLE com lock — use VARCHAR + constraint de aplicação para colunas que mudam.",
      "Charset padrão histórico é latin1 — sempre especifique CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci para suporte completo a Unicode (emojis incluídos).",
      "SELECT sem ORDER BY com LIMIT — ordem de retorno não garantida no MySQL (ao contrário do Postgres que também não garante mas é mais consistente na prática).",
      "InnoDB tem row-level locking mas gap locks podem causar deadlocks inesperados em INSERTs concorrentes em ranges.",
      "ONLY_FULL_GROUP_BY desabilitado em versões antigas — permite GROUP BY com colunas não agregadas, resultado não determinístico.",
    ],
    summary: "MySQL usa InnoDB como engine default desde 5.5 (ACID, row-level locking, FK, MVCC). MySQL 8 trouxe window functions, CTEs, roles e JSON nativo. Diferenças chave vs Postgres: sem suporte a arrays, JSONB mais limitado (JSON), sem herança de tabela, tipos de dados menos ricos. Mas replicação é madura, ferramentas de DBA abundantes e performance para workloads read-heavy é sólida.",
  },

  "mariadb": {
    tagline: "Fork do MySQL com features extras, open-source 100% e compatível na maioria dos casos.",
    why: "MariaDB é drop-in replacement para MySQL em muitos casos mas com divergências crescentes. Saber as diferenças evita surpresas ao migrar.",
    gotchas: [
      "MariaDB e MySQL divergiram significativamente a partir da versão 10.x — nem toda feature do MySQL 8 existe no MariaDB e vice-versa.",
      "Columnstore engine (para analytics) é exclusivo do MariaDB — não existe no MySQL.",
      "JSON no MariaDB é implementado como LONGTEXT com funções, não tipo nativo binário como no MySQL 8+ — performance diferente em queries JSON.",
      "Replicação MySQL → MariaDB geralmente funciona; MariaDB → MySQL pode ter incompatibilidades em versões novas.",
    ],
  },

  "sqlite": {
    tagline: "Banco embarcado, serverless, zero-config — perfeito para apps locais, testes e edge.",
    why: "SQLite é o banco mais instalado do mundo (browsers, mobile, apps desktop, IoT). Para testes locais e apps edge/WASM é a escolha natural. Entender suas limitações evita uso inadequado.",
    gotchas: [
      "Sem concorrência de escrita — apenas um writer por vez (WAL mode melhora, mas não elimina). Para múltiplos escritores concorrentes, use Postgres.",
      "Type affinity, não type enforcement — você pode inserir texto em coluna INTEGER sem erro. Validação deve ser na aplicação.",
      "Sem ALTER TABLE completo — não suporta DROP COLUMN, RENAME COLUMN (antes do 3.25) ou ADD CONSTRAINT. Requer recriar a tabela.",
      "Arquivo de banco pode corromper com crash sem WAL mode habilitado — sempre use PRAGMA journal_mode=WAL em produção.",
    ],
    summary: "SQLite armazena tudo em um arquivo. Sem servidor, sem configuração, ACID com WAL mode. Ideal para: testes (in-memory :memory:), apps desktop (Electron, Tauri), mobile (iOS/Android via native bindings), edge computing e WASM (sql.js, wa-sqlite). Não use para: múltiplos escritores concorrentes, dados compartilhados entre múltiplos processos em rede, replicação.",
  },

  "firebase": {
    tagline: "Plataforma Backend-as-a-Service do Google: Firestore, Auth, Storage, Functions.",
    why: "Firebase é escolha comum para MVPs e apps mobile. Saber quando ele é certo (velocidade, realtime, auth pronto) e quando é errado (queries complexas, custo, vendor lock-in) é o que diferencia uma arquitetura sólida.",
    gotchas: [
      "Firestore não suporta queries relacionais ou JOINs — você precisa desnormalizar dados ou fazer múltiplas queries na aplicação.",
      "Custo pode crescer exponencialmente — reads cobrados por documento, não por query. Um listener em coleção grande = muitos reads.",
      "Sem transações entre coleções diferentes sem Cloud Functions — lógica de negócio complexa vira código de aplicação frágil.",
      "Vendor lock-in severo — migrar de Firestore para outro banco é caro em tempo de engenharia. Abstraia o acesso a dados desde o início.",
      "Security Rules são poderosas mas difíceis de testar — use o Emulator Suite para testes locais antes de fazer deploy.",
    ],
  },
}

export default data
