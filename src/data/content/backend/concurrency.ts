import type { SkillContent } from '@/types'

const concurrency: SkillContent = {
  tagline: "Gerenciar execução paralela/concorrente: race conditions, deadlocks, atomicidade.",
  why: "Concurrency bugs são os mais dificeis de debugar em produção. Senior precisa saber race condition, locks otimistas vs pessimistas, e como Node/Go/Java diferem no modelo.",
  summary: "Concorrência e sobre múltiplas tarefas progredindo ao mesmo tempo (podem ser em threads diferentes ou via multiplexacao). Paralelismo e execução simultanea em múltiplos cores. Problemas clássicos: race condition (estado compartilhado sem sincronização), deadlock (duas threads esperando uma pela outra), starvation (thread nunca agendada). Soluções: mutex, semaforo, lock otimista (versão/timestamp), MVCC no banco.",
  keypoints: [
    { title: "Race condition", body: "Dois processos/threads leem e modificam mesmo estado sem sincronização. Resultado depende de timing. Ex: saldo bancario lido em paralelo antes do update." },
    { title: "Mutex / Lock", body: "Exclusão mútua: só uma thread executa seção crítica. Mutex binário. Semáforo conta até N. Em banco: SELECT FOR UPDATE (lock pessimista)." },
    { title: "Lock otimista", body: "Não bloqueia no read. No update, verifica se version/timestamp mudou. Se sim, rejeita e retenta. Menos contenção; bom para leitura pesada, escrita esporadica." },
    { title: "Lock pessimista", body: "Bloqueia recurso no read (SELECT FOR UPDATE). Garante consistencia ao custo de throughput. Bom para escrita frequente no mesmo recurso." },
    { title: "Deadlock", body: "A espera B liberar recurso, B espera A. Sistema trava. Banco detecta e mata uma das transações. Prevencao: adquirir locks sempre na mesma ordem." },
    { title: "Node.js e concorrência", body: "Single-threaded: sem race condition em memória para I/O (event loop). Mas race condition existe em lógica assíncrona (ler-modificar-escrever com await no meio)." },
    { title: "Atomic operations", body: "Operações indiviseis: incremento atômico no Redis (INCR), CAS (Compare-And-Swap) em hardware, transação de banco. Não ha estado intermediário visível." },
  ],
  gotchas: [
    "await no meio de ler-modificar-escrever em Node.js -- outro request pode interromper entre await. Use transação de banco ou Redis MULTI/EXEC.",
    "Lock otimista sem retry -- usuário recebe erro, deveria retentar silenciosamente.",
    "SELECT FOR UPDATE sem índice -- lock de tabela inteira ao inves de linha.",
    "Deadlock ciclico ignorado -- banco mata transação, app não retenta, usuário ve erro 500.",
    "Mutex em JavaScript (worker_threads) -- Atomics.wait bloqueia worker, não event loop.",
  ],
  interview: [
    { q: "Como você prevenira double-spend em transferencia bancaria?", a: "<p>Banco: SELECT FOR UPDATE nas duas contas dentro de uma transação. Garante lock pessimista. Sempre lock na mesma ordem (menor id primeiro) para evitar deadlock.</p><p>Alternativa: lock otimista com campo version. Update falha se version mudou; retenta com backoff.</p><p>Redis: MULTI/EXEC com WATCH para lock otimista em cache.</p>" },
    { q: "Race condition em Node.js -- como acontece se é single-threaded?", a: "<p>Node é single-threaded por V8, mas não por I/O. Entre dois awaits, outro microtask pode rodar. Ex:</p><pre>const saldo = await getBalance(); // await aqui\n// outro request roda e debita aqui\nawait debit(saldo - valor); // opera sobre saldo stale</pre><p>Solução: transação de banco atômica ou Redis MULTI/EXEC. Não dependa de memória para estado crítico.</p>" },
  ],
  resources: [
    { title: "DDIA -- Chapter 7 (Transactions)", url: "https://dataintensive.net/", kind: "livro" },
    { title: "Java Concurrency in Practice", url: "https://jcip.net/", kind: "livro" },
  ],
}

export default concurrency
