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

// ── Paleta MVCC (Postgres tones) ──────────────────────────────────────────────
const C = '#5b9bd5'

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas em entrevista de Postgres MVCC',
    type: 'qa',
    pages: 9,
    description: 'Recuperação ativa: 20 perguntas sobre MVCC — xmin/xmax, snapshots, isolation levels, VACUUM, bloat, XID wraparound, Serializable + retry, HOT updates, comparação com InnoDB/Oracle. Nível pleno e sênior, com dica de apresentação.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'Comandos, queries de diagnóstico e configurações em uma página',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referência densa: queries para inspecionar xmin/xmax, isolation levels, VACUUM commands, autovacuum por tabela, monitoring de bloat e XID wraparound, row locks (FOR UPDATE / SKIP LOCKED). Tudo que você precisa em produção.',
    icon: '02',
    goal: 'Consulta rápida em produção',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Truques para memorizar conceitos abstratos do MVCC',
    type: 'mnemonics',
    pages: 3,
    description: 'XX (xmin/xmax), RRS (isolation levels), VAFR (operações do VACUUM), BLW (emergências). Conceitos abstratos do MVCC viram âncoras verbais — fáceis de lembrar antes da entrevista.',
    icon: '03',
    goal: 'Memorização cognitiva',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'Os 5 erros operacionais mais comuns — e graves',
    type: 'antipatterns',
    pages: 3,
    description: 'O que NÃO fazer: long-running TX sem timeout, autovacuum default em tabelas de alta escrita, não monitorar XID wraparound, Read Committed em relatórios multi-query, Serializable sem retry. Cada um já causou outage de produção.',
    icon: '04',
    goal: 'Reconhecimento de risco',
  },
]

// ── Dados: Q&A ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'Como o MVCC funciona no PostgreSQL?',
    a: 'MVCC mantém múltiplas versões de cada linha. Cada tupla tem xmin (XID que criou) e xmax (XID que deletou/atualizou). Uma transação tira um snapshot ao iniciar e enxerga apenas tuplas onde xmin foi commitado antes do snapshot E xmax é nulo ou não commitado. Resultado: leituras nunca esperam escritas.',
    tip: 'Mencionar que UPDATE não é in-place — cria nova versão e marca xmax na antiga — mostra que você entende a consequência operacional (dead tuples, VACUUM).',
  },
  {
    level: 'Pleno',
    q: 'Por que VACUUM é crítico no Postgres?',
    a: 'Sem VACUUM: (1) Table bloat — dead tuples acumulam, I/O cresce. (2) Index bloat — entries para tuplas mortas, cache ineficiente. (3) Estatísticas desatualizadas, planner escolhe mal. (4) XID wraparound — emergência catastrófica se age(datfrozenxid) chegar a ~2B.',
    tip: 'A resposta excelente conecta: long-running TX → bloqueia VACUUM → bloat acumula → wraparound se prolongado.',
  },
  {
    level: 'Pleno',
    q: 'Diferença entre Read Committed, Repeatable Read e Serializable?',
    a: 'Read Committed (default): novo snapshot a cada statement — vê commits durante a TX, permite non-repeatable read. Repeatable Read: snapshot fixo no BEGIN — todas leituras veem mesmo estado, previne phantom (Postgres é mais forte que padrão SQL). Serializable: snapshot + SSI tracking — detecta write skew, aborta com 40001, requer retry.',
    tip: 'Postgres não tem Read Uncommitted — mapeado para Read Committed. Citar isso mostra conhecimento profundo.',
  },
  {
    level: 'Pleno',
    q: 'Como monitorar dead tuples e bloat?',
    a: 'pg_stat_user_tables expõe n_live_tup, n_dead_tup, last_autovacuum por tabela. Razão dead/(live+dead) > 20% em tabela de alta escrita = alerta. pgstattuple (extension) mede bloat real em bytes. Verificar last_autovacuum — se não rodou nas últimas horas em tabela de muita escrita, autovacuum mal configurado.',
    tip: 'A query padrão de bloat é candidata frequente em entrevistas — saber escrever de cabeça é diferencial.',
  },
  {
    level: 'Pleno',
    q: 'Qual o impacto de uma transação aberta por horas?',
    a: 'Mantém o oldest_xmin baixo. VACUUM não pode remover dead tuples com xmax >= esse oldest_xmin — bloat acumula. Em 6 horas com 1000 UPDATEs/s, ~21M dead tuples. Também segura row-level locks que podem bloquear outras TX. Prevenção: idle_in_transaction_session_timeout = "30min".',
    tip: 'Conectar long-running TX → bloat → degradação de performance demonstra entendimento operacional real.',
  },
  {
    level: 'Pleno',
    q: 'Como configurar autovacuum corretamente?',
    a: 'Default scale_factor=0.2 (20%) é conservador — bom para tabelas pequenas, ruim para tabelas grandes. Configure POR TABELA via ALTER TABLE SET (autovacuum_vacuum_scale_factor = 0.01, autovacuum_vacuum_threshold = 100, autovacuum_vacuum_cost_delay = 2). Nunca altere global — afeta todas.',
    tip: 'O ponto-chave é "por tabela individual". Quem altera global degrada performance de tabelas tranquilas.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona o snapshot na prática?',
    a: 'No início (ou primeiro statement em RR), o Postgres captura: xmin (menor XID ativo), xmax (próximo XID), xip_list (XIDs ativos). Visibilidade de uma tupla: xmin foi commitado antes do snapshot E (xmax é null OU não commitado antes do snapshot). Read Committed captura novo a cada statement; Repeatable Read mantém o mesmo.',
    tip: 'pg_current_snapshot() expõe o snapshot — útil para debug e para mostrar conhecimento das primitivas internas.',
  },
  {
    level: 'Pleno',
    q: 'O que é dead tuple e quando é removida?',
    a: 'Dead tuple é uma versão de linha cujo xmax foi commitado e está abaixo do oldest_xmin do banco — nenhuma transação pode mais precisar dela. Continua no disco até VACUUM rodar. VACUUM marca o espaço como reutilizável (mas não devolve ao OS). Para devolver ao OS: VACUUM FULL (com lock) ou pg_repack (sem lock).',
    tip: 'A distinção "marca livre" vs "devolve ao OS" é o ponto fino. Quase ninguém lembra que VACUUM regular não diminui o arquivo.',
  },
  {
    level: 'Pleno',
    q: 'Como inspecionar xmin e xmax de uma linha?',
    a: 'São pseudo-colunas — basta SELECT xmin, xmax, * FROM tabela. xmin = TX que criou. xmax = TX que deletou/atualizou (0 se viva). Combine com txid_current() para correlacionar com sua TX e com pg_stat_activity para ver quem é cada XID.',
    tip: 'Em entrevistas, demonstrar isso ao vivo (em psql) é impactante. Decorar a query é o mínimo.',
  },
  {
    level: 'Pleno',
    q: 'Quais locks o MVCC NÃO elimina?',
    a: 'MVCC elimina locks readers vs writers. NÃO elimina: (1) writer vs writer na mesma linha — segundo UPDATE espera o primeiro. (2) DDL (ALTER TABLE) precisa lock exclusivo. (3) SELECT FOR UPDATE/SHARE explícitos. (4) Constraint validation. Use pg_locks + pg_stat_activity para diagnóstico de contenção.',
    tip: 'Confundir MVCC com "ausência total de locks" é erro comum. A resposta correta delimita o que é solucionado e o que não é.',
  },
  {
    level: 'Senior',
    q: 'O que é write skew e como Serializable resolve?',
    a: 'Duas TX leem dados sobrepostos, decidem com base, ambas escrevem produzindo estado impossível serial. Ex: regra "pelo menos 1 médico ativo" — TX1 e TX2 ambas veem 2 ativos, ambas decidem desativar — resultado 0. Repeatable Read não detecta. Serializable usa SSI: rastreia rw-conflicts, aborta uma TX com SQLSTATE 40001 — app DEVE ter retry.',
    tip: 'Ter exemplo concreto (plantão médico, saldo, vagas) diferencia memorização de compreensão real.',
  },
  {
    level: 'Senior',
    q: 'O que é XID wraparound e por que é emergência?',
    a: 'XIDs são 32-bit — circulam após ~4B. Postgres usa espaço circular: ~2B "no passado" (visíveis), ~2B "no futuro" (invisíveis). Se age(datfrozenxid) chegar a ~2B, tuplas antigas viram "futuro" — invisíveis incorretamente. Banco entra em modo read-only de emergência. Prevenção: VACUUM FREEZE substitui xmin antigo por FrozenXID (sempre visível). Monitor: SELECT max(age(datfrozenxid)) FROM pg_database.',
    tip: 'Mencionar que recovery requer single-user mode + VACUUM FREEZE manual mostra conhecimento operacional. Não é só teoria — é runbook.',
  },
  {
    level: 'Senior',
    q: 'Como implementar retry para Serializable?',
    a: 'Loop com try/catch detectando SQLSTATE 40001 e 40P01 (deadlock). Em catch: ROLLBACK + sleep com backoff exponencial + jitter + retry da TX INTEIRA (não só do último statement). Limite máximo de retries (ex: 5). CRÍTICO: o retry envolve toda a transação — qualquer estado computado fora dela deve ser recalculado dentro.',
    tip: 'O ponto "retry da TX inteira, não só do último statement" é onde implementações erram. Mencionar isso explicitamente é diferencial.',
  },
  {
    level: 'Senior',
    q: 'pg_repack vs VACUUM FULL — quando preferir?',
    a: 'VACUUM FULL: reescreve tabela em novo arquivo, devolve espaço ao OS, mas requer AccessExclusiveLock — bloqueia tudo. Para tabela 100GB, pode durar horas. pg_repack: cria tabela temp, copia dados, captura mudanças via trigger, faz swap atômico com lock breve (ms). Online, sem downtime. Use pg_repack em produção com tabelas grandes; VACUUM FULL só em janela de manutenção.',
    tip: 'Mencionar que pg_repack precisa de PK ou índice único, e que aumenta uso de disco temporariamente, mostra entendimento prático.',
  },
  {
    level: 'Senior',
    q: 'O que é HOT update?',
    a: 'Heap-Only Tuple: UPDATE que (1) não modifica colunas indexadas E (2) tem espaço livre na mesma página. A nova versão fica na mesma página E os índices NÃO são atualizados — continuam apontando para a tupla original (HOT chain head). Resultado: sem write amplification de índice, menos bloat de índice, VACUUM mais leve. Aumentar HOT ratio: configurar FILLFACTOR para deixar espaço por página.',
    tip: 'A query SELECT n_tup_upd, n_tup_hot_upd FROM pg_stat_user_tables mede HOT ratio — citar essa query mostra que você sabe medir, não só explicar.',
  },
  {
    level: 'Senior',
    q: 'Diferença de implementação MVCC: Postgres vs InnoDB vs Oracle?',
    a: 'Postgres: versões IN-PLACE na heap — cria nova tupla, marca antiga. Sem bloat na tabela é impossível, exige VACUUM. InnoDB (MySQL): tabela tem só versão atual, versões antigas vão para undo log. Sem bloat na tabela, mas long-running TX inflam o undo log. Oracle: undo tablespace dedicado + SCN global. Erro clássico "snapshot too old" quando undo é reciclado durante query longa.',
    tip: 'Mencionar "snapshot too old" do Oracle e o impacto em cada banco mostra entendimento sistêmico — não só de Postgres.',
  },
  {
    level: 'Senior',
    q: 'Como funciona SELECT FOR UPDATE SKIP LOCKED?',
    a: 'SKIP LOCKED faz a query pular linhas já lockadas por outras TX em vez de esperar. Implementa fila distribuída elegantemente: 5 workers concorrentes pegam 5 jobs DIFERENTES, cada um faz UPDATE marcando como "processing", commita, processa fora da TX, depois marca "done". Sem deadlocks, sem contenção. Padrão usado por Sidekiq, Celery, GoodJob.',
    tip: 'Citar bibliotecas conhecidas (Sidekiq, Celery) mostra que você reconhece o padrão na prática, não só na docs.',
  },
  {
    level: 'Senior',
    q: 'Quais modos de SELECT FOR UPDATE existem?',
    a: 'FOR UPDATE: lock exclusivo. FOR NO KEY UPDATE: exclusivo mas permite FOR KEY SHARE concorrente (útil ao atualizar colunas não-FK). FOR SHARE: lock compartilhado, bloqueia UPDATE/DELETE mas permite múltiplos FOR SHARE. FOR KEY SHARE: o mais fraco — usado internamente pelo Postgres para validação de FK. Modificadores: NOWAIT (erro imediato), SKIP LOCKED (pula).',
    tip: 'Saber a diferença entre FOR UPDATE e FOR NO KEY UPDATE é detalhe sênior — reduz contenção entre UPDATEs e INSERTs em tabelas filhas.',
  },
  {
    level: 'Senior',
    q: 'Como monitorar e prevenir XID wraparound?',
    a: 'Coleta a cada 5min: SELECT datname, age(datfrozenxid) FROM pg_database. Alertas: > 500M = WARNING; > 1.5B = CRITICAL; > 1.8B = EMERGENCY. Prevenção: autovacuum bem configurado (vacuum_freeze_max_age default 200M ativa freeze automático). Em emergência: VACUUM FREEZE manual em janela de manutenção. Se já em read-only: postgres --single (single-user mode) + VACUUM FREEZE.',
    tip: 'Ter um runbook por nível (warning/critical/emergency) mostra mentalidade operacional — não só ler logs e reagir.',
  },
  {
    level: 'Senior',
    q: 'Quando o snapshot é capturado em RR — no BEGIN literal?',
    a: 'NÃO é no BEGIN literal — é no PRIMEIRO comando que requer snapshot (geralmente SELECT, UPDATE, DELETE, INSERT). BEGIN sozinho não captura. Implicação prática: você pode fazer BEGIN, esperar 5 segundos, depois SELECT — o snapshot reflete o estado de 5s depois do BEGIN. Em alta concorrência, isso pode mudar o que você vê.',
    tip: 'Esse é o detalhe que pega quem decorou a documentação. Saber que o snapshot é diferido até o primeiro statement diferencia conhecimento profundo.',
  },
]

// ── Dados: Cheatsheet ─────────────────────────────────────────────────────────

const CHEATSHEET_HOOKS: HookItem[] = [
  { name: 'SELECT xmin, xmax, *',           sig: 'FROM tabela WHERE id=1',                                 desc: 'Inspecionar versões de tupla' },
  { name: 'txid_current()',                 sig: 'SELECT txid_current()',                                  desc: 'XID da TX atual' },
  { name: 'pg_current_snapshot()',          sig: "SELECT pg_current_snapshot() -- 'xmin:xmax:xips'",        desc: 'Snapshot atual' },
  { name: 'pg_visible_in_snapshot()',       sig: 'pg_visible_in_snapshot(xid, snapshot)',                  desc: 'Visibilidade de XID em snapshot' },
  { name: 'BEGIN ISOLATION LEVEL',          sig: 'READ COMMITTED | REPEATABLE READ | SERIALIZABLE',         desc: 'Setar isolation level' },
  { name: 'VACUUM tabela',                  sig: 'VACUUM tabela; -- marca espaço livre',                    desc: 'Limpeza básica' },
  { name: 'VACUUM ANALYZE tabela',          sig: 'VACUUM ANALYZE tabela; -- + estatísticas',                desc: 'Limpeza + estatísticas' },
  { name: 'VACUUM FREEZE tabela',           sig: 'VACUUM FREEZE tabela; -- congela tuplas antigas',         desc: 'Prevenir XID wraparound' },
  { name: 'VACUUM FULL tabela',             sig: 'VACUUM FULL tabela; -- LOCK EXCLUSIVO!',                  desc: 'Reescreve tabela (bloqueia)' },
  { name: 'pg_repack -d db -t tabela',      sig: 'shell: pg_repack -d meudb -t pedidos -j 4',               desc: 'Reescreve sem lock (extension)' },
  { name: 'ALTER TABLE SET autovacuum',     sig: 'autovacuum_vacuum_scale_factor = 0.01',                   desc: 'Configurar autovacuum por tabela' },
  { name: 'pg_stat_user_tables',            sig: 'SELECT n_live_tup, n_dead_tup, last_autovacuum FROM ...', desc: 'Bloat e último VACUUM' },
  { name: 'pgstattuple(tabela)',            sig: 'SELECT * FROM pgstattuple(\'tabela\') -- extension',       desc: 'Bloat real em bytes' },
  { name: 'pg_stat_activity',               sig: 'WHERE state = \'idle in transaction\'',                    desc: 'Long-running TX' },
  { name: 'age(datfrozenxid)',              sig: 'SELECT age(datfrozenxid) FROM pg_database',                desc: 'Risco de XID wraparound' },
  { name: 'SELECT FOR UPDATE',              sig: '... FOR UPDATE -- lock exclusivo na linha',                desc: 'Lock para UPDATE' },
  { name: 'SELECT FOR NO KEY UPDATE',       sig: '... FOR NO KEY UPDATE',                                    desc: 'Mais permissivo (FK)' },
  { name: 'SELECT FOR SHARE',               sig: '... FOR SHARE -- lock compartilhado',                      desc: 'Múltiplas TX podem segurar' },
  { name: 'SELECT FOR UPDATE SKIP LOCKED',  sig: '... FOR UPDATE SKIP LOCKED LIMIT 1',                       desc: 'Fila distribuída — pula lockados' },
  { name: 'SELECT FOR UPDATE NOWAIT',       sig: '... FOR UPDATE NOWAIT',                                    desc: 'Erro imediato se lockado' },
  { name: 'pg_try_advisory_lock(hash)',     sig: 'SELECT pg_try_advisory_lock(hashtext(\'job:sync\'))',      desc: 'Advisory lock app-level' },
  { name: 'idle_in_transaction_timeout',    sig: "SET idle_in_transaction_session_timeout = '30min'",        desc: 'Encerra conexão idle in TX' },
  { name: 'statement_timeout',              sig: "SET statement_timeout = '5min'",                           desc: 'Encerra query lenta' },
  { name: 'lock_timeout',                   sig: "SET lock_timeout = '10s'",                                 desc: 'Encerra espera por lock' },
  { name: 'pg_locks',                       sig: 'SELECT * FROM pg_locks WHERE NOT granted',                 desc: 'Ver locks aguardando' },
  { name: 'vacuum_freeze_max_age',          sig: 'postgresql.conf: vacuum_freeze_max_age = 150000000',       desc: 'Triggera autofreeze mais cedo' },
]

const CHEATSHEET_RULES: RuleItem[] = [
  { ok: true,  t: 'Read Committed: 90% das aplicações ficam aqui. Default é correto para CRUD.' },
  { ok: true,  t: 'Repeatable Read: relatórios e exports — múltiplas queries com snapshot consistente.' },
  { ok: true,  t: 'Serializable + retry da TX inteira: lógica com write skew (plantão, contagem crítica).' },
  { ok: true,  t: 'Configurar autovacuum POR TABELA (ALTER TABLE SET) — nunca alterar global.' },
  { ok: true,  t: 'Monitorar age(datfrozenxid) com alertas em 500M (warn) e 1.5B (critical).' },
  { ok: true,  t: 'idle_in_transaction_session_timeout obrigatório em produção (30min recomendado).' },
  { ok: true,  t: 'pg_repack para limpar bloat em produção — sem lock exclusivo.' },
  { ok: true,  t: 'FILLFACTOR < 100 em tabelas com muito UPDATE — habilita HOT updates.' },
  { ok: false, t: 'Nunca: long-running TX sem timeout. Bloqueia VACUUM, causa bloat exponencial.' },
  { ok: false, t: 'Nunca: VACUUM FULL em tabela grande em produção (lock exclusivo). Use pg_repack.' },
  { ok: false, t: 'Nunca: Serializable sem retry pattern. App quebra aleatoriamente em alta concorrência.' },
  { ok: false, t: 'Nunca: ignorar n_dead_tup > 20% em tabela de alta escrita. Investigar autovacuum.' },
]

// ── Dados: Mnemônicos ─────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'Campos de visibilidade — XX',
    trick: 'X-min, X-max',
    expansion: [
      ['xmin', 'XID que CRIOU a tupla (nasceu)'],
      ['xmax', 'XID que DELETOU ou atualizou (morreu/vai morrer)'],
    ],
    explanation: 'Os 2 campos invisíveis em cada tupla que controlam toda a visibilidade no MVCC. Tupla é visível para TX T se: xmin commitado antes do snapshot de T E xmax é nulo ou não commitado antes do snapshot.',
    example: 'INSERT  → xmin=TX, xmax=0 (viva)\nUPDATE  → cria nova xmin=TX,xmax=0 + marca antiga xmax=TX\nDELETE  → marca xmax=TX (continua no disco até VACUUM)',
    why: 'Toda decisão de visibilidade do MVCC desce a essa regra simples. Saber dizer xmin/xmax de cabeça é a fundação para entender qualquer outro tópico.',
  },
  {
    label: 'Isolation levels — RRS',
    trick: 'R-ead committed, R-epeatable read, S-erializable',
    expansion: [
      ['Read Committed', 'Snapshot por statement (default). Permite non-repeatable read e write skew.'],
      ['Repeatable Read', 'Snapshot fixo no BEGIN. Postgres previne phantom também.'],
      ['Serializable', 'SSI tracking. Detecta write skew, aborta com 40001. Requer retry.'],
    ],
    explanation: 'Os 3 níveis disponíveis no Postgres (não tem Read Uncommitted — mapeado para Read Committed). Cada um previne um conjunto crescente de anomalias com custo crescente.',
    example: 'CRUD normal       → Read Committed (default)\nRelatórios        → Repeatable Read\nWrite skew real   → Serializable + retry',
    why: 'Escolher o isolation level certo é decisão arquitetural — afeta corretude, performance e complexidade da app (retry pattern necessário em Serializable).',
  },
  {
    label: 'Operações do VACUUM — VAFR',
    trick: 'V-isibility, A-nalyze, F-ree space, R-emove dead',
    expansion: [
      ['Visibility map', 'Marca páginas all-visible para Index Only Scan eficiente'],
      ['Analyze stats', 'VACUUM ANALYZE atualiza pg_statistic para o planner'],
      ['Free space', 'Marca espaço de dead tuples como reutilizável (mas não devolve ao OS)'],
      ['Remove dead', 'Limpa tuplas com xmax < oldest_xmin'],
    ],
    explanation: 'Os 4 trabalhos que o VACUUM regular faz. VACUUM FREEZE adiciona um quinto: congelar tuplas antigas (xmin → FrozenXID) para prevenir XID wraparound.',
    example: 'VACUUM tabela         → V + F + R\nVACUUM ANALYZE tabela → V + A + F + R\nVACUUM FREEZE tabela  → V + F + R + Freeze',
    why: 'Saber exatamente o que cada modo do VACUUM faz é o que diferencia DBA de "alguém que sabe que VACUUM existe".',
  },
  {
    label: 'Emergências operacionais — BLW',
    trick: 'B-loat, L-ong-running TX, W-raparound',
    expansion: [
      ['Bloat', 'Dead tuples acumuladas. I/O cresce, índices incham, cache ineficiente.'],
      ['Long-running TX', 'Bloqueia VACUUM ao manter oldest_xmin baixo. Causa bloat acelerado.'],
      ['Wraparound', 'age(datfrozenxid) próximo de 2B força modo read-only de emergência.'],
    ],
    explanation: 'As 3 crises clássicas do MVCC mal gerenciado, conectadas em cadeia: long-running TX causa bloat, bloat e long-running TX impedem freeze, ausência de freeze leva a wraparound.',
    example: 'Sintoma: queries lentas progressivamente\n→ Verificar n_dead_tup (bloat)\n→ Verificar pg_stat_activity (long-running TX)\n→ Verificar age(datfrozenxid) (wraparound)',
    why: 'Ter um modelo mental conectado das 3 crises permite diagnóstico rápido em produção. Quase sempre uma puxa as outras.',
  },
  {
    label: 'Modos de FOR UPDATE — UNSK',
    trick: 'U-pdate, N-o key update, S-hare, K-ey share',
    expansion: [
      ['FOR UPDATE', 'Lock exclusivo. Bloqueia UPDATE/DELETE/SELECT FOR UPDATE/SHARE de outras TX.'],
      ['FOR NO KEY UPDATE', 'Exclusivo mas permite FOR KEY SHARE concorrente (FK validation).'],
      ['FOR SHARE', 'Compartilhado. Múltiplas TX podem segurar. Bloqueia UPDATE/DELETE.'],
      ['FOR KEY SHARE', 'Mais fraco. Usado pelo Postgres internamente para FK validation.'],
    ],
    explanation: 'Os 4 modos de lock explícito em SELECT, do mais forte (UPDATE) ao mais fraco (KEY SHARE). Modificadores: NOWAIT (erro imediato), SKIP LOCKED (pula).',
    example: '-- Fila distribuída sem deadlock:\nSELECT id FROM jobs\nWHERE status = \'pendente\'\nFOR UPDATE SKIP LOCKED LIMIT 1',
    why: 'SKIP LOCKED é o pattern para fila distribuída usado por Sidekiq, Celery, GoodJob. Saber os 4 modos diferencia quem usa locks ad-hoc de quem desenha sistemas concorrentes.',
  },
]

// ── Dados: Anti-patterns ──────────────────────────────────────────────────────

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'Long-running transaction sem timeout',
    badDesc: 'TX aberta por horas — bloqueia VACUUM, causa bloat exponencial',
    badCode: [
      { t: 'BEGIN;', c: '#ef4444' },
      { t: 'SELECT * FROM grande_tabela;', c: '#ef4444' },
      { t: '-- ... processa em memória 6h ...', c: '#ef4444' },
      { t: 'COMMIT; -- ou pior, idle in transaction', c: '#ef4444' },
    ],
    goodDesc: 'idle_in_transaction_session_timeout + processar em batches curtos',
    goodCode: [
      { t: "-- postgresql.conf:", c: '#4ade80' },
      { t: "idle_in_transaction_session_timeout = '30min'", c: '#4ade80' },
      { t: '-- Aplicação processa em batches:', c: '#4ade80' },
      { t: 'for batch in fetch_batches(1000):', c: '#4ade80' },
      { t: '  BEGIN; UPDATE ...; COMMIT;  -- TX curta', c: '#4ade80' },
    ],
    why: 'TX longa segura oldest_xmin baixo. VACUUM não pode remover dead tuples mais novas — bloat acumula descontroladamente em tabelas de alta escrita.',
  },
  {
    title: 'Autovacuum default em tabela de alta escrita',
    badDesc: 'scale_factor 0.2 (20%) — tabela 100M precisa acumular 20M dead tuples',
    badCode: [
      { t: '-- Default global:', c: '#94a3b8' },
      { t: 'autovacuum_vacuum_scale_factor = 0.2', c: '#ef4444' },
      { t: '-- Em tabela 100M, autovacuum só roda', c: '#ef4444' },
      { t: '-- após 20M dead tuples — bloat severo', c: '#ef4444' },
    ],
    goodDesc: 'Configurar POR TABELA com scale_factor agressivo',
    goodCode: [
      { t: 'ALTER TABLE pedidos SET (', c: '#4ade80' },
      { t: '  autovacuum_vacuum_scale_factor = 0.01,', c: '#4ade80' },
      { t: '  autovacuum_vacuum_threshold = 100,', c: '#4ade80' },
      { t: '  autovacuum_vacuum_cost_delay = 2', c: '#4ade80' },
      { t: ');', c: '#4ade80' },
    ],
    why: 'Default é conservador (correto para tabelas pequenas). Para tabelas de alta escrita, configure individualmente com scale_factor 0.01. Nunca altere global — degrada tabelas tranquilas.',
  },
  {
    title: 'Não monitorar XID wraparound',
    badDesc: 'Descobre quando o banco já está read-only — outage de horas',
    badCode: [
      { t: '-- Sem monitoring de age(datfrozenxid)', c: '#ef4444' },
      { t: '-- Logs do Postgres:', c: '#94a3b8' },
      { t: 'WARNING: must vacuum within 1M transactions', c: '#ef4444' },
      { t: 'ERROR: not accepting commands to avoid wraparound', c: '#ef4444' },
    ],
    goodDesc: 'Coleta a cada 5min + alertas em 500M/1.5B/1.8B',
    goodCode: [
      { t: '-- Query de monitoring:', c: '#4ade80' },
      { t: 'SELECT datname, age(datfrozenxid) AS xid_age', c: '#4ade80' },
      { t: 'FROM pg_database;', c: '#4ade80' },
      { t: '-- Alertas:', c: '#94a3b8' },
      { t: '-- > 500M  → WARNING (autovacuum mais agressivo)', c: '#4ade80' },
      { t: '-- > 1.5B  → CRITICAL (VACUUM FREEZE manual)', c: '#4ade80' },
      { t: '-- > 1.8B  → EMERGENCY (single-user mode)', c: '#4ade80' },
    ],
    why: 'XID wraparound é a emergência mais séria do Postgres. Sem monitoring, descobre quando já é tarde — banco read-only, downtime planejado obrigatório. Monitor proativamente.',
  },
  {
    title: 'Read Committed em relatório multi-query',
    badDesc: '3 queries no mesmo relatório com snapshots diferentes — inconsistente',
    badCode: [
      { t: 'BEGIN;  -- default Read Committed', c: '#ef4444' },
      { t: 'SELECT SUM(total) FROM pedidos WHERE mes=1;', c: '#ef4444' },
      { t: '-- 1M  (snapshot A)', c: '#94a3b8' },
      { t: 'SELECT AVG(ticket) FROM pedidos WHERE mes=1;', c: '#ef4444' },
      { t: '-- 500 (snapshot B — outro estado!)', c: '#94a3b8' },
      { t: 'SELECT COUNT(*) FROM pedidos WHERE mes=1;', c: '#ef4444' },
      { t: '-- 2010 (snapshot C — outro ainda)', c: '#94a3b8' },
      { t: 'COMMIT;  -- 1M / 2010 ≠ 500: incoerente!', c: '#ef4444' },
    ],
    goodDesc: 'Repeatable Read — snapshot fixo durante todo relatório',
    goodCode: [
      { t: 'BEGIN ISOLATION LEVEL REPEATABLE READ;', c: '#4ade80' },
      { t: 'SELECT SUM(total) FROM pedidos WHERE mes=1;', c: '#4ade80' },
      { t: 'SELECT AVG(ticket) FROM pedidos WHERE mes=1;', c: '#4ade80' },
      { t: 'SELECT COUNT(*) FROM pedidos WHERE mes=1;', c: '#4ade80' },
      { t: '-- Todas no mesmo snapshot — matemamente coerente', c: '#4ade80' },
      { t: 'COMMIT;', c: '#4ade80' },
    ],
    why: 'Read Committed captura novo snapshot a cada statement. Em relatórios multi-query, valores podem mudar entre queries — somas e médias ficam inconsistentes. Use RR para qualquer TX que faz múltiplas leituras precisando de consistência.',
  },
  {
    title: 'Serializable sem retry na aplicação',
    badDesc: 'Erro 40001 não tratado — operação falha aleatoriamente em produção',
    badCode: [
      { t: '// Lógica que requer Serializable', c: '#94a3b8' },
      { t: 'await db.query("BEGIN ISOLATION LEVEL SERIALIZABLE")', c: '#ef4444' },
      { t: 'await operacao(db)', c: '#ef4444' },
      { t: 'await db.query("COMMIT")', c: '#ef4444' },
      { t: '// Erro 40001 vaza para o usuário', c: '#ef4444' },
    ],
    goodDesc: 'Loop de retry com backoff exponencial e jitter',
    goodCode: [
      { t: 'async function withRetry(op, max = 5) {', c: '#4ade80' },
      { t: '  for (let i = 0; i < max; i++) {', c: '#4ade80' },
      { t: '    try {', c: '#4ade80' },
      { t: '      await db.query("BEGIN ISOLATION LEVEL SERIALIZABLE")', c: '#4ade80' },
      { t: '      await op(db)', c: '#4ade80' },
      { t: '      await db.query("COMMIT"); return', c: '#4ade80' },
      { t: '    } catch (e) {', c: '#4ade80' },
      { t: '      await db.query("ROLLBACK")', c: '#4ade80' },
      { t: '      if (e.code !== "40001" || i === max - 1) throw e', c: '#4ade80' },
      { t: '      await sleep(Math.min(50 * 2**i + Math.random() * 50, 5000))', c: '#4ade80' },
      { t: '    } } }', c: '#4ade80' },
    ],
    why: 'SSI aborta com 40001 quando detecta conflito — comportamento ESPERADO, não erro. App DEVE retry da TX INTEIRA (não só do último statement) com backoff exponencial. Sem retry, falha aleatória em alta concorrência.',
  },
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'MVCC PostgreSQL',
    stackLabel: 'Database / Concorrência',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'MVCC PostgreSQL',
    accentColor: C,
    stackLabel: 'Database / Concorrência',
    sections: {
      hooks: CHEATSHEET_HOOKS,
      depRows: [],
      rules: CHEATSHEET_RULES,
      performanceTips: [],
      patterns: [],
      mentalModels: [],
    },
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'MVCC PostgreSQL',
    stackLabel: 'Database / Concorrência',
  }),
  antipatterns: () => buildAntipatternsPdf({
    skillName: 'MVCC PostgreSQL',
    accentColor: C,
    stackLabel: 'Database / Concorrência',
    antipatterns: ANTIPATTERNS,
  }),
}

// ── Componente ────────────────────────────────────────────────────────────────

export default function MvccPdfs() {
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
