import type { SkillContent } from '@/types'

const mvcc: SkillContent = {
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
}

export default mvcc
