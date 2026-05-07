'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'
import { buildQuickRefPdf } from '@/components/pdfs/QuickRefPdf'
import type { QuickRefColumn } from '@/components/pdfs/QuickRefPdf'
import { buildCommandRefPdf } from '@/components/pdfs/CommandRefPdf'
import type { CommandEntry } from '@/components/pdfs/CommandRefPdf'

const C = '#5b9bd5'

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 12 perguntas de EXPLAIN ANALYZE mais cobradas em entrevista pleno/sênior',
    type: 'qa',
    pages: 9,
    description: 'Recuperação ativa: leitura sistemática do plano, por que planner ignora índice, pg_stat_statements vs EXPLAIN, Nested Loop catastrófico, Index Only Scan, Hash spill, lock contention, auto_explain — respostas em nível pleno/sênior.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'quick-ref',
    title: 'EXPLAIN Quick Ref',
    subtitle: 'A4 paisagem — sintaxe, campos de cada nó, sinais de alerta, tipos em 3 colunas',
    type: 'quick-ref',
    pages: 1,
    description: 'Cartão de bolso para o monitor: flags do EXPLAIN, formato cost/rows/width/loops/buffers, sinais vermelhos (Seq Scan, rows mismatch, Batches > 1, temp files), receituário de correção. Imprima e cole na mesa.',
    icon: '02',
    goal: 'Consulta rápida ao lado do explain.dalibo.com',
  },
  {
    id: 'commands',
    title: 'Comandos de diagnóstico',
    subtitle: 'Toolkit completo: EXPLAIN, pg_stat_statements, pg_stat_activity, auto_explain',
    type: 'commands',
    pages: 4,
    description: 'Referência por categoria: EXPLAIN com flags, queries de diagnóstico em pg_stat_*, comandos de manutenção (VACUUM, ANALYZE, CREATE STATISTICS), inspeção de locks e bloat, configuração de auto_explain.',
    icon: '03',
    goal: 'Toolkit operacional',
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'Anatomia do nó, tipos, sinais de alerta e receituário em uma referência densa',
    type: 'cheatsheet',
    pages: 2,
    description: 'Referência completa: campos cost/rows/actual/loops/buffers, tipos de nó (verde/amarelo/vermelho), receituário de correção (Seq Scan -> índice; rows errados -> ANALYZE; Hash spill -> work_mem), padrões de índice (parcial, INCLUDE, composto).',
    icon: '04',
    goal: 'Estudo aprofundado',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'TREB, ABRIR, SHIN, HSAN — fixação dos campos e sinais',
    type: 'mnemonics',
    pages: 2,
    description: 'Truques verbais para nunca esquecer: TREB (Type, Rows, Estimated, Buffers — campos críticos), ABRIR (flags ANALYZE, BUFFERS, FORMAT JSON, VERBOSE, SETTINGS), SHIN (tipos de scan), HSAN (sinais de alerta).',
    icon: '05',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'antipatterns',
    title: 'Antipatterns',
    subtitle: '6 erros mais frequentes ao ler/agir em planos EXPLAIN',
    type: 'antipatterns',
    pages: 4,
    description: 'Diff visual errado vs correto: comparar cost com ms, esquecer loops em Nested Loop, DELETE sem ROLLBACK, otimizar query errada (sem pg_stat_statements), esquecer VACUUM ANALYZE após CREATE INDEX, work_mem global alto.',
    icon: '06',
    goal: 'Aprender com erros operacionais',
  },
]

// ── Q&A ──────────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    q: 'Como você lê um plano EXPLAIN ANALYZE?',
    a: '<p>De <strong>dentro para fora</strong> — o nó mais indentado executa primeiro e alimenta o pai. O custo do pai inclui o custo dos filhos. O actual time do nó raiz é o tempo total da query.</p><p>Para cada nó verifico:</p><ol><li><strong>tipo</strong> — Seq Scan em tabela grande é sinal de alerta</li><li><strong>rows estimado vs actual rows</strong> — diferença de 10× indica estatísticas desatualizadas</li><li><strong>loops</strong> — em Nested Loops, multiply <code>actual time × loops</code> para o custo real</li><li><strong>Buffers</strong> — <code>shared read</code> alto indica cache miss</li></ol><p>Sinais que priorizo: Seq Scan com Filter removendo muitas linhas (falta índice), Hash Join com Batches &gt; 1 (spill para disco, precisa de mais work_mem), rows estimados completamente errados (rode VACUUM ANALYZE).</p>',
    tip: 'Descreva o processo sistematicamente: de dentro para fora, os 4 campos de cada nó, os 3 sinais de alerta. Isso demonstra processo, não só conhecimento pontual.',
    level: 'Pleno',
  },
  {
    q: 'Por que o planner escolheria Seq Scan quando existe um índice?',
    a: '<p>Vários motivos legítimos:</p><ol><li><strong>Filtro retorna muitas linhas</strong> — Index Scan faz random I/O por linha, Seq Scan é I/O sequencial. Para &gt; 10-15% das linhas, Seq Scan é mais rápido.</li><li><strong>Correlation baixa</strong> — dados fisicamente espalhados no disco fazem Index Scan ter I/O aleatório excessivo.</li><li><strong>Estatísticas desatualizadas</strong> — planner subestima ou superestima a seletividade e escolhe plano errado.</li></ol><p>Para diagnosticar: <code>SET enable_seqscan = off; EXPLAIN SELECT ...; RESET enable_seqscan;</code>. Se com índice forçado a query fica mais rápida, as estatísticas estão erradas — rode <code>VACUUM ANALYZE</code>. Se ainda assim Seq Scan é mais rápido, o índice realmente não ajuda para essa query.</p>',
    level: 'Senior',
    tip: 'O truque do enable_seqscan = off é o tipo de detalhe operacional que diferencia entrevistas — mostra que você já debugou planners no mundo real.',
  },
  {
    q: 'O que é pg_stat_statements e por que é mais útil que EXPLAIN isolado?',
    a: '<p>EXPLAIN analisa uma query em um momento específico. <strong>pg_stat_statements</strong> acumula estatísticas de todas as queries executadas ao longo do tempo: <code>calls</code>, <code>total_exec_time</code>, <code>mean_exec_time</code>, <code>stddev</code>, <code>rows</code>, cache hits/reads.</p><p>A diferença crítica: uma query de 500ms chamada 1× por dia custa 500ms/dia. Uma query de 10ms chamada 100.000×/dia custa 1.000.000ms = 17 minutos de CPU/dia. EXPLAIN nunca revelaria que a segunda é o problema real. pg_stat_statements sim — ela aparece no topo por <code>total_exec_time</code>.</p><p>Fluxo correto: pg_stat_statements para priorizar o que otimizar → EXPLAIN ANALYZE na query identificada para diagnosticar como otimizar. Sem pg_stat_statements, você opera às cegas sobre o impacto real.</p>',
    tip: 'Esse é o diferencial de quem trabalhou em produção. Mencionar o impacto de volume (calls × mean_time) vs latência isolada demonstra maturidade operacional.',
    level: 'Pleno',
  },
  {
    q: 'Como identificar e resolver um Nested Loop problemático?',
    a: '<p>No plano: o inner node mostra <code>loops=N</code> onde N é alto. O custo real = <code>actual time × loops</code>. Ex: inner com <code>actual time=2ms</code> e <code>loops=50000</code> = 100 segundos de execução, mesmo parecendo rápido isolado.</p><p>O Nested Loop é problemático quando: o outer retorna muitas linhas, e o inner não tem índice na join condition (vira Seq Scan × N_outer = catástrofe). O Nested Loop é ótimo quando: outer tem poucas linhas e inner usa Index Scan eficiente.</p><p>Diagnóstico e fix: <code>EXPLAIN (ANALYZE, BUFFERS)</code> mostrará o inner com loops alto. Fix: criar índice na coluna de join do inner. Se o outer retorna muitas linhas, o planner pode escolher Hash Join como alternativa — que é melhor para esse cenário.</p>',
    level: 'Senior',
    tip: 'O ponto que separa pleno de sênior: explicar que actual time é POR LOOP, não total. A multiplicação por loops é o erro mais comum de leitura.',
  },
  {
    q: 'Como você criaria um índice eficiente baseado em um plano EXPLAIN?',
    a: '<p>A análise do plano me diz exatamente o que criar:</p><ol><li>Se é Seq Scan com igualdade simples, B-Tree na coluna</li><li>Se são múltiplos filtros de igualdade juntos, índice composto na ordem mais seletiva primeiro</li><li>Se Filter remove quase tudo com um valor específico, índice parcial com WHERE</li><li>Se Index Scan está buscando heap para colunas extras, INCLUDE nessas colunas para Index Only Scan</li></ol><p>Após criar o índice, sempre: <code>VACUUM ANALYZE tabela;</code> para atualizar estatísticas — o planner precisa ver as estatísticas do novo índice. Depois verificar com <code>EXPLAIN (ANALYZE, BUFFERS)</code> se o índice é usado e se o plano melhorou de fato.</p>',
    level: 'Pleno',
    tip: 'Mencione INCLUDE para Index Only Scan e índices parciais — são padrões avançados que diferenciam quem só sabe B-Tree de quem entende o catálogo de índices do Postgres.',
  },
  {
    q: 'O que significa shared buffers hit e read em EXPLAIN BUFFERS?',
    a: '<p><strong>shared hit:</strong> páginas lidas do shared buffer pool (cache em memória do Postgres). Rápido — nanosegundos. <strong>shared read:</strong> páginas lidas do disco (cache miss). Lento — microsegundos a milissegundos dependendo do storage.</p><p>Hit ratio = <code>hit / (hit + read)</code>. Deve ser &gt; 99% em workloads OLTP normais. Hit ratio baixo indica: dataset maior que <code>shared_buffers</code>, working set não cabe em cache, ou acesso a dados frios (histórico raramente acessado).</p><p>Isso é crucial para diferenciar: query de 50ms com hit ratio 99% vai ser sempre 50ms. Query de 50ms com hit ratio 60% pode ser 500ms em produção quando o cache está frio (após restart, ou em horas de baixo uso). BUFFERS revela se o benchmark de EXPLAIN ANALYZE é representativo da produção.</p>',
    level: 'Pleno',
    tip: 'O ponto-chave: BUFFERS revela se o benchmark é representativo da produção. Cache frio em dev pode esconder problemas que aparecem após restart em produção.',
  },
  {
    q: 'O que é pg_hint_plan e quando usar?',
    a: '<p>pg_hint_plan é uma extensão que permite forçar o planner a usar um plano específico via hints em comentários SQL. Permite forçar:</p><ul><li>Tipo de scan (<code>/*+ SeqScan(t) */</code>, <code>/*+ IndexScan(t idx) */</code>)</li><li>Tipo de join (<code>/*+ HashJoin(t1 t2) */</code>, <code>/*+ NestLoop(t1 t2) */</code>)</li><li>Ordem de join (<code>/*+ Leading(t1 t2 t3) */</code>)</li></ul><p><strong>Quando usar:</strong> o planner continua escolhendo plano ruim mesmo após VACUUM ANALYZE e CREATE STATISTICS, você tem evidência via EXPLAIN ANALYZE de que outro plano é melhor, e a query é crítica o suficiente para justificar o override.</p><p>É um <strong>último recurso</strong> — primeiro esgote as soluções via estatísticas e índices. Hints se tornam dívida técnica: precisam ser revisados quando o schema ou a distribuição de dados muda.</p>',
    level: 'Senior',
    tip: 'Enfatize que hints são "último recurso" — bons engenheiros corrigem estatísticas antes de forçar planos. Mostra maturidade.',
  },
  {
    q: 'Como o EXPLAIN revela problemas de Hash Join com spill to disk?',
    a: '<p>No plano: o nó Hash mostra <code>Batches: N</code> onde N &gt; 1. Com BUFFERS, você vê <code>temp read=N written=N</code> — leituras e escritas em arquivo temporário (disco). Um Hash Join com Batches=8 usa ~8× mais I/O do que com Batches=1.</p><p>O Hash Join spill ocorre quando a hash table do inner não cabe em <code>work_mem</code>. Solução imediata: <code>SET work_mem = "256MB";</code> antes da query e verificar se Batches volta para 1. Mas cuidado: <code>work_mem × max_connections × sorts/hashes</code> pode exceder a RAM total.</p><p>Estratégia de produção: SET work_mem alto por sessão em queries específicas (via SET por usuário, por database, ou por transaction). Nunca aumente globalmente sem calcular o consumo máximo possível.</p>',
    level: 'Pleno',
    tip: 'O cálculo work_mem × max_connections × hashes_por_query é o que diferencia quem decora soluções de quem entende o trade-off real em produção.',
  },
  {
    q: 'Como diagnosticar rows estimados errados e corrigi-los?',
    a: '<p>Rows estimado muito diferente do actual rows é o sinal mais importante de problemas de planner. Causas:</p><ol><li><strong>ANALYZE desatualizado</strong> — tabela mudou muito desde o último ANALYZE, estatísticas não refletem a realidade.</li><li><strong>Distribuição não-uniforme</strong> — histograma padrão (100 buckets) não captura distribuições com muitos outliers.</li><li><strong>Correlação entre colunas</strong> — o planner não sabe que <code>WHERE status="ativo" AND regiao="SP"</code> é muito mais seletivo do que cada filtro isolado.</li></ol><p><strong>Soluções em ordem:</strong></p><ol><li><code>VACUUM ANALYZE</code> na tabela</li><li>Aumentar target de estatísticas: <code>ALTER TABLE t ALTER COLUMN c SET STATISTICS 500;</code></li><li><code>CREATE STATISTICS</code> para correlações entre colunas</li></ol><p>Verificar após cada passo com EXPLAIN ANALYZE se rows estimado melhorou.</p>',
    level: 'Senior',
    tip: 'CREATE STATISTICS para correlação entre colunas (PG10+) é o detalhe sênior — poucos candidatos sabem dele. Mostre que conhece esse recurso.',
  },
  {
    q: 'Qual a diferença entre Index Scan e Index Only Scan?',
    a: '<p><strong>Index Scan:</strong> usa o índice para encontrar os rowids das linhas relevantes, depois vai à heap (tabela principal) para buscar as colunas de output. Cada acesso à heap é random I/O potencial — o índice economiza a varredura completa mas ainda requer acesso à heap.</p><p><strong>Index Only Scan:</strong> todas as colunas necessárias para o output estão no índice — sem necessidade de acessar a heap. É o melhor caso possível. Requer que as colunas no SELECT e no WHERE estejam todas cobertas pelo índice (via INCLUDE ou como parte da chave do índice).</p><p>Para criar Index Only Scan: <code>CREATE INDEX ON pedidos(usuario_id, status) INCLUDE (total, criado_em)</code>. A query <code>SELECT total, criado_em FROM pedidos WHERE usuario_id = 42 AND status = "pago"</code> usará Index Only Scan sem tocar a heap.</p><p>O <strong>visibility map</strong> precisa estar atualizado (VACUUM faz isso) para Index Only Scan funcionar corretamente.</p>',
    level: 'Pleno',
    tip: 'Mencionar a dependência do visibility map (atualizado pelo VACUUM) mostra que você entende o mecanismo, não só decorou a sintaxe.',
  },
  {
    q: 'Como investigar lock contention que causa queries lentas?',
    a: '<p>Uma query "lenta" pode na verdade estar bloqueada esperando um lock. EXPLAIN ANALYZE de uma query individual não revela isso — você precisa olhar <code>pg_stat_activity</code> e <code>pg_locks</code> durante o problema.</p><p><strong>Diagnóstico em produção:</strong></p><pre>SELECT pid, pg_blocking_pids(pid) AS bloqueadores,\n       wait_event_type, wait_event, state, LEFT(query, 80)\nFROM pg_stat_activity\nWHERE wait_event_type IS NOT NULL;</pre><p>Mostra quem está esperando e quem está bloqueando. Use <code>pg_blocking_pids</code> para encontrar a cadeia.</p><p><strong>Soluções comuns:</strong> matar transações "idle in transaction" antigas (<code>SELECT pg_terminate_backend(pid)</code>), reduzir tempo de transação na aplicação, evitar DDL em horário de pico (ALTER TABLE precisa de AccessExclusiveLock), usar <code>SKIP LOCKED</code> para filas. Configurar <code>lock_timeout</code> e <code>statement_timeout</code> globalmente para evitar locks indefinidos.</p>',
    level: 'Senior',
    tip: 'Mencionar idle_in_transaction_session_timeout como configuração defensiva mostra que você pensa em proteção sistêmica, não só apagar incêndio.',
  },
  {
    q: 'Como o auto_explain pode ajudar em produção?',
    a: '<p><code>auto_explain</code> é uma extensão que loga automaticamente o plano EXPLAIN de queries que excedem um threshold de tempo. Útil para capturar queries problemáticas ocasionais que não estão presentes no momento em que você investiga.</p><p><strong>Configuração:</strong></p><ul><li><code>shared_preload_libraries = "auto_explain"</code></li><li><code>auto_explain.log_min_duration = "1s"</code> (loga queries &gt; 1s)</li><li><code>auto_explain.log_analyze = on</code> (inclui ANALYZE)</li><li><code>auto_explain.log_buffers = on</code></li><li><code>auto_explain.log_format = "json"</code></li></ul><p><strong>Cuidados:</strong> <code>log_analyze</code> adiciona overhead (mede tempos reais) — em workloads de altíssimo volume, considere <code>log_min_duration</code> alto. <code>log_format = "json"</code> facilita parsing automático com tools como pgBadger ou scripts customizados.</p><p>Não confunda com pg_stat_statements: auto_explain mostra o plano específico de cada execução, pg_stat_statements agrega métricas por padrão de query.</p>',
    level: 'Senior',
    tip: 'A distinção auto_explain (planos individuais) vs pg_stat_statements (agregados) é o tipo de detalhe que diferencia em entrevista de SRE/DBA sênior.',
  },
]

// ── Mnemônicos ────────────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'TREB — campos de cada nó',
    trick: 'Type, Rows, Estimated, Buffers',
    expansion: [
      ['T', 'Type — algoritmo (Seq, Index, Hash, Nested...)'],
      ['R', 'Rows — actual rows reais'],
      ['E', 'Estimated — rows estimado pelo planner (compare!)'],
      ['B', 'Buffers — shared hit vs read (cache vs disco)'],
    ],
    explanation: 'Os 4 elementos a inspecionar em cada nó do EXPLAIN. Type identifica o algoritmo. Rows reais. Estimated comparado com actual revela estatísticas. Buffers revela se o benchmark é representativo (cache vs disco).',
    example: 'Hash Join (Type) (cost=...) (actual rows=4987 (Rows) ...) — comparar com rows=4980 estimado (E). Buffers: shared hit=1240 read=4200 (B = hit ratio 23%, baixo).',
    why: 'Sem TREB você lê o plano sem método. Com TREB, cada nó recebe a mesma checagem sistemática. É o framework que transforma intuição em diagnóstico repetível.',
  },
  {
    label: 'ABRIR — flags do EXPLAIN',
    trick: 'ANALYZE, BUFFERS, FORMAT JSON, VERBOSE, SETTINGS',
    expansion: [
      ['A', 'ANALYZE — executa de verdade (cuidado com DML!)'],
      ['B', 'BUFFERS — cache hits vs leituras de disco'],
      ['F', 'FORMAT JSON — para visualizadores (dalibo, depesz)'],
      ['V', 'VERBOSE — colunas de output e schema'],
      ['S', 'SETTINGS — parâmetros não-default que afetam o plano (PG12+)'],
    ],
    explanation: 'A sequência canônica de flags. ANALYZE+BUFFERS sempre juntos para diagnóstico real. FORMAT JSON desbloqueia ferramentas externas. VERBOSE ajuda em planos complexos. SETTINGS revela parâmetros tunados que afetaram a escolha.',
    example: 'EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON, SETTINGS) SELECT ... — comando canônico para diagnóstico em entrevista ou produção.',
    why: 'Sem ABRIR, você usa só EXPLAIN ou EXPLAIN ANALYZE — perdendo informação crítica de cache (BUFFERS) e contexto de configuração (SETTINGS). Com ABRIR, você captura tudo numa execução.',
  },
  {
    label: 'SHIN — tipos de scan',
    trick: 'Seq Scan, Heap Scan (Bitmap), Index Scan, INdex Only Scan',
    expansion: [
      ['S', 'Seq Scan — lê tabela inteira'],
      ['H', 'Bitmap Heap Scan — combina índices, ordena por bloco'],
      ['I', 'Index Scan — usa índice + acessa heap'],
      ['IN', 'Index Only Scan — só índice, sem heap (melhor caso!)'],
    ],
    explanation: 'Os 4 tipos de leitura de dados, do menos seletivo ao mais eficiente. Seq Scan lê tudo. Bitmap combina múltiplos índices. Index Scan navega B-Tree e busca heap. Index Only Scan dispensa heap — INCLUDE e visibility map atualizado habilitam.',
    example: 'CREATE INDEX ON pedidos(user_id, status) INCLUDE (total) → SELECT total FROM pedidos WHERE user_id=42 → Index Only Scan (sem tocar heap).',
    why: 'Saber distinguir os 4 ajuda a escolher a estrutura certa de índice. Index Only Scan é o objetivo para queries OLTP críticas — economiza I/O da heap completamente.',
  },
  {
    label: 'HSAN — sinais de alerta no plano',
    trick: 'Hash spill, Seq inesperado, Actual-rows mismatch, Nested loop pesado',
    expansion: [
      ['H', 'Hash spill — Batches > 1 (work_mem insuficiente)'],
      ['S', 'Seq Scan inesperado — falta índice ou stats erradas'],
      ['A', 'Actual rows ≠ Estimated — VACUUM ANALYZE pendente'],
      ['N', 'Nested Loop pesado — inner loops alto sem índice'],
    ],
    explanation: 'Os 4 sinais que disparam ação imediata ao ler um plano. Cada um tem causa e correção canônica. Memorizar HSAN transforma diagnóstico em mecânico.',
    example: 'Vejo Hash com Batches: 8 → SET work_mem = "256MB". Vejo Seq Scan + 95% rows removed → CREATE INDEX. Vejo rows=10 actual=5000 → VACUUM ANALYZE. Vejo Nested Loop inner loops=10000 → CREATE INDEX na join key.',
    why: 'A maioria dos planos lentos cai num desses 4 padrões. HSAN é o checklist mental que cobre 80% dos casos em entrevista e em produção.',
  },
]

// ── Antipatterns ──────────────────────────────────────────────────────────────

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'Comparar cost (unidade) com tempo (ms)',
    badDesc: '"Cost de 1000 = 1 segundo, certo?" ERRADO. Cost é unidade relativa, não milissegundo.',
    badCode: [
      { t: 'EXPLAIN SELECT * FROM ...;\n', c: '#e2e8f0' },
      { t: '-- Hash Join (cost=45..980)\n', c: '#ef4444' },
      { t: '-- "vai levar ~1 segundo" <- ERRADO', c: '#ef4444' },
    ],
    goodDesc: 'Sempre EXPLAIN ANALYZE para tempo real. Cost só serve para comparar planos entre si.',
    goodCode: [
      { t: 'EXPLAIN ANALYZE SELECT * FROM ...;\n', c: '#22c55e' },
      { t: '-- Hash Join (cost=45..980)\n', c: '#e2e8f0' },
      { t: '-- (actual time=8.2..45.10 rows=4987)\n', c: '#22c55e' },
      { t: '-- Tempo real: 45ms, descoberto via ANALYZE', c: '#64748b' },
    ],
    why: 'Cost é unidade relativa baseada em seq_page_cost, random_page_cost e parâmetros de CPU. cost=1000 pode significar 1ms ou 10s dependendo do hardware. Só serve para comparar planos entre si. Para tempo real, sempre EXPLAIN ANALYZE.',
  },
  {
    title: 'Esquecer de multiplicar actual time × loops',
    badDesc: 'actual time é POR LOOP. Em Nested Loop, esquecer de multiplicar é o erro mais comum de leitura.',
    badCode: [
      { t: '-- Inner do Nested Loop:\n', c: '#64748b' },
      { t: '-> Index Scan on pedidos\n', c: '#e2e8f0' },
      { t: '   (actual time=0.5 rows=20 loops=10000)\n', c: '#ef4444' },
      { t: '-- "0.5ms é rapidíssimo!" <- ERRADO', c: '#ef4444' },
    ],
    goodDesc: 'O custo real é actual time × loops. 0.5ms × 10000 loops = 5 segundos.',
    goodCode: [
      { t: '-- Inner com loops alto = catástrofe:\n', c: '#64748b' },
      { t: '-> Index Scan on pedidos\n', c: '#e2e8f0' },
      { t: '   (actual time=0.5 rows=20 loops=10000)\n', c: '#22c55e' },
      { t: '-- 0.5ms × 10000 = 5 segundos REAIS\n', c: '#22c55e' },
      { t: '-- Fix: índice na join condition do inner', c: '#64748b' },
    ],
    why: 'actual time é POR LOOP, não total. Em Nested Loop, o inner pode ter time aparentemente baixo mas loops=N alto — multiplique para o tempo real. Um nó com time=0.5ms e loops=50000 = 25 segundos de execução. Erro de leitura mais comum no EXPLAIN.',
  },
  {
    title: 'EXPLAIN ANALYZE em DML sem transação',
    badDesc: 'EXPLAIN ANALYZE EXECUTA a query — em DELETE/UPDATE/INSERT modifica dados de verdade!',
    badCode: [
      { t: 'EXPLAIN ANALYZE DELETE FROM sessoes\n', c: '#ef4444' },
      { t: 'WHERE expira_em < now();\n', c: '#ef4444' },
      { t: '-- DELETOU DE VERDADE em produção!', c: '#ef4444' },
    ],
    goodDesc: 'BEGIN; ... ROLLBACK; envolvendo o EXPLAIN ANALYZE para testar com segurança.',
    goodCode: [
      { t: 'BEGIN;\n', c: '#22c55e' },
      { t: 'EXPLAIN ANALYZE DELETE FROM sessoes\n', c: '#e2e8f0' },
      { t: 'WHERE expira_em < now();\n', c: '#e2e8f0' },
      { t: 'ROLLBACK; -- desfaz a operação', c: '#22c55e' },
    ],
    why: 'EXPLAIN ANALYZE executa a query — em DML, modifica dados. Sempre envolva DML em BEGIN; ... ROLLBACK; para testar com segurança. Para SELECT é seguro mesmo sem transação.',
  },
  {
    title: 'Otimizar a query errada (sem pg_stat_statements)',
    badDesc: 'Otimizar a query que mais aparece no log, não a que mais custa em total_exec_time.',
    badCode: [
      { t: '-- Vejo essa lenta no log:\n', c: '#64748b' },
      { t: 'SELECT * FROM relatorio_mensal();  -- 500ms\n', c: '#ef4444' },
      { t: '-- Otimizo. Mas roda 1× por dia.\n', c: '#64748b' },
      { t: '-- Total: 500ms/dia. Impacto irrelevante.', c: '#ef4444' },
    ],
    goodDesc: 'pg_stat_statements ordenado por total_exec_time revela o impacto agregado real.',
    goodCode: [
      { t: 'SELECT query, calls, total_exec_time\n', c: '#22c55e' },
      { t: 'FROM pg_stat_statements\n', c: '#22c55e' },
      { t: 'ORDER BY total_exec_time DESC LIMIT 10;\n', c: '#22c55e' },
      { t: '-- Top: SELECT user — 10ms × 100k calls\n', c: '#64748b' },
      { t: '-- = 1000s/dia. ESSE é o que importa.', c: '#22c55e' },
    ],
    why: 'EXPLAIN ANALYZE diagnostica uma query isolada. pg_stat_statements revela impacto agregado (calls × mean_time). Sem ele, você otimiza pelo que aparece no log mas não pelo que custa. Sempre comece por pg_stat_statements para priorizar.',
  },
  {
    title: 'Esquecer VACUUM ANALYZE após CREATE INDEX',
    badDesc: 'O planner usa pg_statistic. Sem ANALYZE atualizado, ele não vê o novo índice.',
    badCode: [
      { t: 'CREATE INDEX ON pedidos(status);\n', c: '#e2e8f0' },
      { t: 'EXPLAIN SELECT * FROM pedidos\n', c: '#e2e8f0' },
      { t: " WHERE status = 'pago';\n", c: '#e2e8f0' },
      { t: '-- Seq Scan ainda?! <- estatísticas antigas', c: '#ef4444' },
    ],
    goodDesc: 'CREATE INDEX seguido de VACUUM ANALYZE para estatísticas refletirem o índice.',
    goodCode: [
      { t: 'CREATE INDEX ON pedidos(status);\n', c: '#e2e8f0' },
      { t: 'VACUUM ANALYZE pedidos;  -- atualiza pg_statistic\n', c: '#22c55e' },
      { t: 'EXPLAIN SELECT * FROM pedidos\n', c: '#e2e8f0' },
      { t: " WHERE status = 'pago';\n", c: '#e2e8f0' },
      { t: '-- Index Scan using pedidos_status_idx ✓', c: '#22c55e' },
    ],
    why: 'O planner usa pg_statistic para decidir entre índice e Seq Scan. Após criar índice, as estatísticas precisam refletir a presença dele — VACUUM ANALYZE atualiza. Sem isso, pode continuar escolhendo Seq Scan por desconhecimento das novas estatísticas.',
  },
  {
    title: 'Aumentar work_mem globalmente sem cálculo',
    badDesc: 'work_mem × max_connections × hashes_por_query é o consumo MÁXIMO. Pode causar OOM.',
    badCode: [
      { t: '# postgresql.conf:\n', c: '#64748b' },
      { t: "work_mem = '1GB'  # 'para ninguém spillar'\n", c: '#ef4444' },
      { t: 'max_connections = 200\n', c: '#e2e8f0' },
      { t: '# 1GB × 200 × 3 hashes = 600GB MÁXIMO!\n', c: '#ef4444' },
      { t: '# OOM em pico — banco trava', c: '#ef4444' },
    ],
    goodDesc: 'Global conservador, alto por sessão para queries específicas via SET.',
    goodCode: [
      { t: '# postgresql.conf:\n', c: '#64748b' },
      { t: "work_mem = '16MB'  # padrão sensato\n", c: '#22c55e' },
      { t: '# Por sessão para queries específicas:\n', c: '#64748b' },
      { t: "SET work_mem = '256MB';\n", c: '#22c55e' },
      { t: 'EXPLAIN ANALYZE SELECT ...;\n', c: '#e2e8f0' },
      { t: '-- ALTER USER analista SET work_mem = ...', c: '#64748b' },
    ],
    why: 'work_mem × max_connections × hashes_por_query é o consumo MÁXIMO possível. Aumentar globalmente pode causar OOM em pico. Aumente por sessão (SET), por usuário (ALTER USER) ou por database (ALTER DATABASE) para isolar.',
  },
]

// ── EXPLAIN Quick Ref ─────────────────────────────────────────────────────────

const QUICK_REF_COLUMNS: QuickRefColumn[] = [
  {
    sections: [
      {
        title: 'Sintaxe e flags',
        entries: [
          { key: 'EXPLAIN',                value: 'plano estimado, seguro para DML' },
          { key: 'EXPLAIN ANALYZE',        value: 'executa + tempos reais' },
          { key: 'EXPLAIN (ANALYZE, BUFFERS)', value: 'cache hits/reads — sempre use' },
          { key: 'FORMAT JSON',            value: 'para dalibo.com / depesz' },
          { key: 'VERBOSE',                value: 'colunas de output e schema' },
          { key: 'SETTINGS',               value: 'parâmetros tunados (PG12+)' },
          { key: 'BEGIN; ... ROLLBACK;',  value: 'safe wrap para DML' },
        ],
      },
      {
        title: 'Campos de cada nó',
        entries: [
          { key: 'cost=startup..total',    value: 'unidade RELATIVA, não ms' },
          { key: 'rows=N',                value: 'estimado pelo planner' },
          { key: 'width=N',               value: 'bytes médios por linha' },
          { key: 'actual time=X..Y',      value: 'ms POR LOOP (não total!)' },
          { key: 'actual rows=N',         value: 'real — compare com estimado' },
          { key: 'loops=N',               value: 'multiply time × loops!' },
          { key: 'shared hit=N',          value: 'páginas do cache' },
          { key: 'shared read=N',         value: 'páginas do disco' },
          { key: 'temp read/written',     value: 'spill p/ disco (ruim)' },
        ],
      },
      {
        title: 'Hint ratio (BUFFERS)',
        entries: [
          { key: '> 99%',                 value: 'excelente — cache quente' },
          { key: '> 95%',                 value: 'saudável' },
          { key: '50-95%',                value: 'investigar' },
          { key: '< 50%',                 value: 'crítico — cache frio ou small shared_buffers' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Tipos de nó (verde = bom)',
        entries: [
          { key: 'Index Only Scan',       value: 'melhor — sem heap', badge: '★', badgeColor: '#22c55e' },
          { key: 'Index Scan',            value: 'bom — filtros < 5%', badge: '✓', badgeColor: '#22c55e' },
          { key: 'Bitmap Heap Scan',      value: 'ok — múltiplos índices' },
          { key: 'Nested Loop',           value: 'ok — outer pequeno + inner indexado' },
          { key: 'Hash Join',             value: 'ok — sem ordenação prévia' },
          { key: 'Merge Join',            value: 'ótimo — ambos ordenados' },
          { key: 'Seq Scan',              value: 'ok em tabelas pequenas' },
          { key: 'Gather / Gather Merge', value: 'paralelismo (PG10+)' },
        ],
      },
      {
        title: 'Sinais de alerta (HSAN)',
        entries: [
          { key: 'Seq Scan + Filter alto', value: 'falta índice', badge: '⚠', badgeColor: '#ef4444' },
          { key: 'Rows Removed > 90%',     value: 'índice parcial?', badge: '⚠', badgeColor: '#ef4444' },
          { key: 'rows ≠ actual (10×)',   value: 'VACUUM ANALYZE', badge: '⚠', badgeColor: '#f59e0b' },
          { key: 'Nested Loop loops alto', value: 'índice na join key', badge: '⚠', badgeColor: '#f59e0b' },
          { key: 'Hash Batches > 1',       value: 'spill — work_mem', badge: '⚠', badgeColor: '#f59e0b' },
          { key: 'temp read/written',     value: 'work_mem ou Sort caro', badge: '⚠', badgeColor: '#f59e0b' },
          { key: 'shared read >> hit',    value: 'cache miss', badge: '⚠', badgeColor: '#38bdf8' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Receituário de correção',
        entries: [
          { key: 'Seq Scan indesejado',    value: 'CREATE INDEX + VACUUM ANALYZE' },
          { key: 'Filtro com 1 valor único', value: 'índice parcial: WHERE col = X' },
          { key: 'SELECT col1, col2',      value: 'INDEX ... INCLUDE (col1, col2)' },
          { key: 'Múltiplos AND',          value: 'composto, mais seletivo primeiro' },
          { key: 'rows estimado errado',   value: 'VACUUM ANALYZE tabela' },
          { key: 'Correlação entre cols',  value: 'CREATE STATISTICS (deps, mcv)' },
          { key: 'Nested Loop pesado',     value: 'CREATE INDEX na join key inner' },
          { key: 'Hash spill',             value: "SET work_mem = '256MB' p/ sessão" },
          { key: 'Cache miss alto',        value: 'shared_buffers ou pg_prewarm' },
          { key: 'Sort caro',              value: 'índice ordenado pela ORDER BY' },
        ],
      },
      {
        title: 'Toolkit operacional',
        entries: [
          { key: 'pg_stat_statements',     value: 'priorizar — top por total_exec_time' },
          { key: 'auto_explain',           value: 'logar planos > 1s automaticamente' },
          { key: 'pg_stat_activity',       value: 'queries em execução agora' },
          { key: 'pg_locks',               value: 'investigar lock contention' },
          { key: 'pg_blocking_pids(pid)',  value: 'cadeia de bloqueios' },
          { key: 'explain.dalibo.com',     value: 'visualizador interativo (FORMAT JSON)' },
          { key: 'explain.depesz.com',     value: 'anotações de cor por nó' },
        ],
      },
      {
        title: 'Forçar plano (debug)',
        entries: [
          { key: 'SET enable_seqscan = off',  value: 'força índice (debug only)' },
          { key: 'SET enable_nestloop = off', value: 'desativa Nested Loop' },
          { key: 'SET enable_hashjoin = off', value: 'desativa Hash Join' },
          { key: 'RESET enable_seqscan',     value: 'volta ao normal' },
          { key: 'pg_hint_plan',             value: 'extensão p/ hints permanentes' },
        ],
      },
    ],
  },
]

// ── Comandos de diagnóstico ──────────────────────────────────────────────────

const COMMANDS: CommandEntry[] = [
  {
    category: 'EXPLAIN — sintaxe',
    command: 'EXPLAIN <query>',
    description: 'Mostra o plano estimado SEM executar — seguro até em DELETE/UPDATE/INSERT.',
    example: "EXPLAIN SELECT * FROM pedidos WHERE usuario_id = 42;",
  },
  {
    category: 'EXPLAIN — sintaxe',
    command: 'EXPLAIN ANALYZE <query>',
    description: 'Executa a query e mede tempos reais. Para DML, envolver em BEGIN; ... ROLLBACK;',
    example: "EXPLAIN ANALYZE SELECT * FROM pedidos WHERE usuario_id = 42;",
    danger: true,
  },
  {
    category: 'EXPLAIN — sintaxe',
    command: 'EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON, VERBOSE)',
    description: 'Diagnóstico completo: tempos reais + cache hits + JSON para visualizadores + colunas de output.',
    flags: [
      { flag: 'ANALYZE',  description: 'executa + mede tempos' },
      { flag: 'BUFFERS',  description: 'shared hit/read/dirtied + temp' },
      { flag: 'FORMAT JSON', description: 'para explain.dalibo.com' },
      { flag: 'VERBOSE',  description: 'colunas de output e schema' },
      { flag: 'SETTINGS', description: 'parâmetros tunados (PG12+)' },
    ],
    example: "EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON, VERBOSE, SETTINGS)\n  SELECT u.nome, COUNT(*) FROM usuarios u JOIN pedidos p ON p.usuario_id = u.id\n  GROUP BY u.id, u.nome;",
  },
  {
    category: 'EXPLAIN — debug do planner',
    command: 'SET enable_seqscan = off',
    description: 'Força o planner a evitar Seq Scan — ferramenta de DEBUG. Compare o plano forçado com o original.',
    example: "SET enable_seqscan = off;\nEXPLAIN SELECT * FROM tabela WHERE col = 1;\nRESET enable_seqscan;",
  },
  {
    category: 'EXPLAIN — debug do planner',
    command: 'RESET enable_seqscan',
    description: 'Restaura o comportamento padrão do planner.',
    example: 'RESET enable_seqscan;\n-- ou: RESET ALL para resetar todos os parâmetros da sessão',
  },
  {
    category: 'pg_stat_statements — top queries',
    command: 'CREATE EXTENSION IF NOT EXISTS pg_stat_statements',
    description: 'Habilita a extensão. Requer shared_preload_libraries = "pg_stat_statements" no postgresql.conf + restart.',
    example: 'CREATE EXTENSION IF NOT EXISTS pg_stat_statements;',
  },
  {
    category: 'pg_stat_statements — top queries',
    command: 'Top 10 por total_exec_time',
    description: 'Identifica as queries de maior IMPACTO AGREGADO (calls × mean_time). É o que mais pesa no banco.',
    example: "SELECT LEFT(query, 100) AS query,\n       calls,\n       ROUND(total_exec_time / 1000, 1) AS total_segundos,\n       ROUND(mean_exec_time, 2) AS media_ms,\n       rows\nFROM pg_stat_statements\nORDER BY total_exec_time DESC\nLIMIT 10;",
  },
  {
    category: 'pg_stat_statements — top queries',
    command: 'Variação de latência (planner instável)',
    description: 'Queries com alta variação (stddev / mean alto) indicam planner instável — pode estar oscilando entre planos diferentes.',
    example: "SELECT LEFT(query, 80),\n       ROUND(mean_exec_time, 2) AS media_ms,\n       ROUND(stddev_exec_time / NULLIF(mean_exec_time, 0), 2) AS coef_variacao\nFROM pg_stat_statements\nWHERE calls > 100 AND mean_exec_time > 10\nORDER BY coef_variacao DESC LIMIT 10;",
  },
  {
    category: 'pg_stat_statements — top queries',
    command: 'Cache miss alto',
    description: 'Queries lendo muito disco — cache hit ratio baixo indica dataset frio ou shared_buffers pequeno.',
    example: "SELECT LEFT(query, 80), calls,\n       shared_blks_hit, shared_blks_read,\n       ROUND(100.0 * shared_blks_hit /\n         NULLIF(shared_blks_hit + shared_blks_read, 0), 1) AS hit_ratio\nFROM pg_stat_statements\nWHERE shared_blks_read > 1000\nORDER BY shared_blks_read DESC LIMIT 10;",
  },
  {
    category: 'Estatísticas e índices',
    command: 'VACUUM ANALYZE <tabela>',
    description: 'Limpa tuplas mortas E atualiza pg_statistic. Sempre rode após CREATE INDEX e após inserções massivas.',
    example: 'VACUUM ANALYZE pedidos;\n-- ou para todas as tabelas:\nVACUUM ANALYZE;',
  },
  {
    category: 'Estatísticas e índices',
    command: 'ALTER TABLE ... SET STATISTICS',
    description: 'Aumenta o sample de estatísticas para uma coluna específica (default 100, max 10000).',
    example: 'ALTER TABLE pedidos ALTER COLUMN status SET STATISTICS 1000;\nANALYZE pedidos;',
  },
  {
    category: 'Estatísticas e índices',
    command: 'CREATE STATISTICS — correlação',
    description: 'Postgres 10+. Ensina o planner sobre correlações entre colunas (dependencies, mcv, ndistinct).',
    example: 'CREATE STATISTICS s_status_regiao (dependencies, mcv)\n  ON status, regiao FROM pedidos;\nANALYZE pedidos;',
  },
  {
    category: 'Estatísticas e índices',
    command: 'CREATE INDEX — parcial',
    description: 'Índice menor e mais seletivo, criado apenas para um subset. Planner prefere quando o predicado bate.',
    example: "CREATE INDEX ON pedidos(criado_em)\n  WHERE status = 'pendente';\n-- usado por: SELECT ... WHERE status = 'pendente' ORDER BY criado_em",
  },
  {
    category: 'Estatísticas e índices',
    command: 'CREATE INDEX — INCLUDE',
    description: 'Índice coberto. Permite Index Only Scan: as colunas no SELECT estão no índice e não precisam ir à heap.',
    example: 'CREATE INDEX ON pedidos(usuario_id, status)\n  INCLUDE (total, criado_em);\n-- SELECT total, criado_em FROM pedidos WHERE usuario_id = 42 -> Index Only Scan',
  },
  {
    category: 'auto_explain — log automático',
    command: 'auto_explain — configuração',
    description: 'Loga automaticamente o plano EXPLAIN de queries que excedem threshold. Captura problemas ocasionais.',
    example: "# postgresql.conf:\nshared_preload_libraries = 'auto_explain'\nauto_explain.log_min_duration = '1s'\nauto_explain.log_analyze = on\nauto_explain.log_buffers = on\nauto_explain.log_format = 'json'",
  },
  {
    category: 'pg_stat_activity — sessões ativas',
    command: 'Sessões com lock contention',
    description: 'Identifica quem está bloqueando quem em produção. Use pg_blocking_pids para a cadeia.',
    example: "SELECT pid,\n       pg_blocking_pids(pid) AS bloqueadores,\n       wait_event_type, wait_event,\n       state, LEFT(query, 80)\nFROM pg_stat_activity\nWHERE wait_event_type IS NOT NULL;",
  },
  {
    category: 'pg_stat_activity — sessões ativas',
    command: 'Idle in transaction antigas',
    description: 'Transações abertas há tempos seguram locks. Em emergência, terminar para liberar.',
    example: "SELECT pid, state, age(now(), xact_start) AS aberta_ha, query\nFROM pg_stat_activity\nWHERE state = 'idle in transaction'\n  AND xact_start < now() - interval '5 minutes'\nORDER BY xact_start;\n-- terminar: SELECT pg_terminate_backend(pid);",
    danger: true,
  },
  {
    category: 'pg_stat_activity — sessões ativas',
    command: 'Configurar timeouts',
    description: 'Evita locks indefinidos. statement_timeout para queries, lock_timeout para esperas em locks.',
    example: "ALTER DATABASE production SET statement_timeout = '30s';\nALTER DATABASE production SET lock_timeout = '5s';\nALTER DATABASE production SET idle_in_transaction_session_timeout = '5min';",
  },
  {
    category: 'work_mem — controle por sessão',
    command: 'SET work_mem para a sessão',
    description: 'Aumenta work_mem apenas na sessão atual — evita OOM global. Ideal para queries pesadas pontuais.',
    example: "SET work_mem = '256MB';\nEXPLAIN (ANALYZE, BUFFERS) SELECT ...;\n-- volta ao default ao fechar a conexão",
  },
  {
    category: 'work_mem — controle por sessão',
    command: 'ALTER USER — por usuário',
    description: 'Persiste work_mem alto para um usuário específico (ex: analista, relatórios).',
    example: "ALTER USER analista SET work_mem = '512MB';\n-- vale para todas as sessões futuras desse usuário",
  },
  {
    category: 'Bloat e visibility',
    command: 'Diagnosticar dead tuples',
    description: 'Tabelas com muitos dead tuples = autovacuum atrasado. Index Only Scan degrada se visibility map sujo.',
    example: "SELECT relname, n_live_tup, n_dead_tup,\n       last_autovacuum, last_vacuum\nFROM pg_stat_user_tables\nORDER BY n_dead_tup DESC LIMIT 10;",
  },
  {
    category: 'Bloat e visibility',
    command: 'pg_prewarm — aquecer cache',
    description: 'Carrega tabela/índice em shared_buffers após restart. Útil em sistemas com cache crítico.',
    example: 'CREATE EXTENSION IF NOT EXISTS pg_prewarm;\nSELECT pg_prewarm(\'pedidos\');\nSELECT pg_prewarm(\'idx_pedidos_status\');',
  },
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'EXPLAIN ANALYZE',
    stackLabel: 'PostgreSQL · Performance',
  }),
  'quick-ref': () => buildQuickRefPdf({
    columns: QUICK_REF_COLUMNS,
    skillName: 'EXPLAIN ANALYZE — Quick Ref',
    accentColor: C,
    stackLabel: 'Cartão de bolso',
    tagline: 'Anatomia, sinais de alerta e correções em uma página A4',
    version: 'PG14+',
  }),
  commands: () => buildCommandRefPdf({
    commands: COMMANDS,
    skillName: 'EXPLAIN ANALYZE — Diagnóstico',
    accentColor: C,
    stackLabel: 'PostgreSQL · Toolkit',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'EXPLAIN ANALYZE',
    accentColor: C,
    stackLabel: 'PostgreSQL · Performance',
    sections: {
      hooks: [
        { name: 'EXPLAIN (sem ANALYZE)', sig: 'plano estimado, não executa', desc: 'Quando: testar plano de DML sem efeitos colaterais. Limitação: estimativas podem estar erradas — use ANALYZE para realidade.' },
        { name: 'EXPLAIN ANALYZE', sig: 'executa + tempos reais', desc: 'Quando: diagnóstico completo. CUIDADO em DML — sempre BEGIN; ... ROLLBACK; para DELETE/UPDATE/INSERT.' },
        { name: 'EXPLAIN (ANALYZE, BUFFERS)', sig: 'tempos + cache hits/reads', desc: 'Quando: diagnóstico de produção real. BUFFERS revela cache miss e spill — essencial para entender se o plano é representativo.' },
        { name: 'pg_stat_statements', sig: 'estatísticas agregadas de todas queries', desc: 'Quando: priorizar o que otimizar. EXPLAIN sozinho otimiza a query errada; pg_stat_statements revela impacto agregado real (calls × mean_time).' },
        { name: 'auto_explain', sig: 'log automático de planos lentos', desc: 'Quando: capturar problemas ocasionais em produção. Configurar log_min_duration = 1s e log_analyze = on. Cuidado com overhead em workloads de altíssimo volume.' },
        { name: 'CREATE STATISTICS', sig: 'estatísticas estendidas (PG10+)', desc: 'Quando: rows estimado errado por correlação entre colunas. WHERE status=X AND regiao=Y onde os dois são correlacionados — planner não sabe sem essa hint.' },
      ],
      depRows: [
        ['actual time', 'POR LOOP — multiplicar por loops para tempo real'],
        ['cost', 'unidade RELATIVA — não milissegundo'],
        ['rows estimado vs actual', 'diferença > 10× = VACUUM ANALYZE pendente'],
        ['Hash Batches', '> 1 = spill (work_mem)'],
        ['hit ratio (BUFFERS)', '> 99% saudável, < 50% crítico'],
        ['Rows Removed by Filter', '> 90% = falta índice ou índice parcial'],
      ],
      rules: [
        { ok: true, t: 'Sempre EXPLAIN (ANALYZE, BUFFERS) para diagnóstico real' },
        { ok: true, t: 'BEGIN; ... ROLLBACK; para EXPLAIN ANALYZE em DML' },
        { ok: true, t: 'pg_stat_statements para priorizar; EXPLAIN para diagnosticar' },
        { ok: true, t: 'VACUUM ANALYZE após CREATE INDEX' },
        { ok: true, t: 'work_mem alto por sessão (SET), não global' },
        { ok: true, t: 'Multiplicar actual time × loops sempre em Nested Loop' },
        { ok: false, t: 'NUNCA: confundir cost com milissegundo' },
        { ok: false, t: 'NUNCA: EXPLAIN ANALYZE DELETE/UPDATE sem transação' },
        { ok: false, t: 'NUNCA: aumentar work_mem global sem calcular máximo' },
      ],
      performanceTips: [
        'shared_buffers ideal: 25% da RAM (até 8GB; acima disso retornos decrescentes)',
        'work_mem default 4MB é baixo — 16-32MB global, alto por sessão',
        'effective_cache_size: estimativa para o planner (não aloca) — 75% da RAM',
        'random_page_cost = 1.1 em SSD (default 4.0 assume HDD)',
        'autovacuum_naptime: padrão 1min — em sistemas escrita-pesada, reduzir',
        'max_parallel_workers_per_gather = 2 default — aumentar se CPUs ociosas',
      ],
      patterns: [
        {
          name: 'Diagnóstico canônico',
          desc: 'Comando único que pega 90% dos sintomas',
          code: `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON, SETTINGS)
  SELECT u.nome, COUNT(p.id), SUM(p.total)
  FROM usuarios u
  JOIN pedidos p ON p.usuario_id = u.id
  WHERE u.ativo = true
  GROUP BY u.id, u.nome
  ORDER BY SUM(p.total) DESC LIMIT 10;

-- Cole o JSON em explain.dalibo.com para visualização anotada`,
        },
        {
          name: 'Top 10 queries por impacto',
          desc: 'pg_stat_statements — sempre comece aqui',
          code: `SELECT LEFT(query, 100) AS query,
       calls,
       ROUND(total_exec_time / 1000, 1) AS total_seg,
       ROUND(mean_exec_time, 2) AS media_ms,
       ROUND(stddev_exec_time, 2) AS stddev_ms,
       rows
FROM pg_stat_statements
WHERE query NOT LIKE '%pg_%'
ORDER BY total_exec_time DESC
LIMIT 10;

-- 1000s/dia >> 500ms/dia: priorize impacto agregado`,
        },
        {
          name: 'Índices canônicos por padrão de query',
          desc: 'O que criar baseado no plano observado',
          code: `-- 1) Igualdade simples (Seq Scan + Filter)
CREATE INDEX ON pedidos(status);

-- 2) Múltiplos AND (mais seletivo primeiro)
CREATE INDEX ON pedidos(usuario_id, status);

-- 3) Filtro com 1 valor único (índice parcial menor + mais seletivo)
CREATE INDEX ON pedidos(criado_em)
  WHERE status = 'pendente';

-- 4) Index Only Scan (cobre o SELECT)
CREATE INDEX ON pedidos(usuario_id, status)
  INCLUDE (total, criado_em);

-- 5) ORDER BY sem sort
CREATE INDEX ON pedidos(criado_em DESC);

-- SEMPRE depois:
VACUUM ANALYZE pedidos;`,
        },
        {
          name: 'Sessão para query analítica pesada',
          desc: 'work_mem + parallel + statistics target alto',
          code: `BEGIN;
  SET LOCAL work_mem = '512MB';
  SET LOCAL max_parallel_workers_per_gather = 4;

  EXPLAIN (ANALYZE, BUFFERS)
  SELECT date_trunc('day', criado_em) AS dia,
         COUNT(*), SUM(total)
  FROM pedidos
  WHERE criado_em > now() - interval '90 days'
  GROUP BY 1 ORDER BY 1;
COMMIT;
-- SET LOCAL volta automaticamente ao COMMIT/ROLLBACK`,
        },
      ],
      mentalModels: [
        'TREB: Type, Rows, Estimated, Buffers — checagem sistemática de cada nó',
        'ABRIR: ANALYZE, BUFFERS, FORMAT JSON, VERBOSE, SETTINGS — flags canônicas',
        'SHIN: Seq Scan, Heap (Bitmap), Index Scan, INdex Only Scan — do pior ao melhor',
        'HSAN: Hash spill, Seq inesperado, Actual mismatch, Nested loop pesado — sinais de alerta',
        'pg_stat_statements prioriza, EXPLAIN diagnostica — ordem correta',
        'cost é unidade RELATIVA, actual time é POR LOOP — duas armadilhas mais comuns',
        'Index Only Scan é o objetivo — cubra colunas com INCLUDE quando possível',
        'work_mem global baixo, alto por sessão — evita OOM mantendo flexibilidade',
      ],
    },
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'EXPLAIN ANALYZE',
    stackLabel: 'PostgreSQL · Performance',
  }),
  antipatterns: () => buildAntipatternsPdf({
    antipatterns: ANTIPATTERNS,
    accentColor: C,
    skillName: 'EXPLAIN ANALYZE',
    stackLabel: 'PostgreSQL · Performance',
  }),
}

export default function ExplainAnalyzePdfs() {
  const [open, setOpen] = useState<PdfCard | null>(null)
  const hero = PDF_CARDS[0]
  const rest = PDF_CARDS.slice(1)

  return (
    <>
      <HeroCard card={hero} accent={C} onOpen={() => setOpen(hero)} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 16 }}>
        {rest.map(c => (
          <CollectionCard key={c.id} card={c} accent={C} onOpen={() => setOpen(c)} />
        ))}
      </div>
      {open && (
        <PdfModal card={open} onClose={() => setOpen(null)} builders={PDF_BUILDERS} />
      )}
    </>
  )
}
