import type { SkillContent } from '@/types'

const explainAnalyze: SkillContent = {
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
}

export default explainAnalyze
