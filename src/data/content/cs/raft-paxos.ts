import type { SkillContent } from "@/types"

const raftPaxos: SkillContent = {
    tagline: "Algoritmos de consenso distribuido: como N nodes concordam num valor com falhas.",
    why: "Base de etcd, Consul, CockroachDB, MongoDB. Em entrevista de system design, mostrar que você entende quorum, log replication e leader election é diferencial.",
    summary: "Consenso distribuido garante que N nodes concordam em sequência de operações mesmo com falha de minoria. Paxos é o clássico (Lamport), notoriamente difícil. Raft (Stanford 2014) foi desenhado pra ser entendivel — leader election + log replication. Quorum (maioria) é chave: com 2f+1 nodes tolera f falhas. Usado em qualquer DB distribuido moderno com strong consistency.",
    keypoints: [
      { title: "Quorum", body: "Maioria. Com 2f+1 nodes tolera f falhas. 3 nodes -> tolera 1; 5 -> tolera 2. Toda decisão precisa do quorum concordar." },
      { title: "Raft — leader election", body: "Um node é leader. Recebe writes, replica pra followers. Se leader cai, followers fazem eleicao (votam em quem tem log mais novo)." },
      { title: "Raft — log replication", body: "Leader appendlog, replica pra followers, commitam apenas quando maioria confirmou. Followers aplicam em ordem." },
      { title: "Raft — safety", body: "Term number monotonic. Eleição com term maior inválida leader antigo. Garante que só um leader por term." },
      { title: "Paxos básico", body: "Roles: proposer, acceptor, learner. Two phases: prepare (gain promise), accept (commit value). Multi-Paxos otimiza pra leader." },
      { title: "Raft vs Paxos", body: "Raft é mais fácil de entender e implementar. Paxos é mais flexível mas notoriamente difícil. Em prática, todo mundo usa Raft." },
      { title: "Implementacoes", body: "etcd (Raft em Go), Consul, CockroachDB, MongoDB (proprietario), Tigris, Spanner (Paxos)." },
      { title: "Limitações", body: "Quorum exige maioria viva — em partição, lado minoritario não opera. Latência >= 1 RTT pra majoria. Não escala write linearmente." },
    ],
    gotchas: [
      "Achar que 2 nodes é tolerante — precisa quorum, 2 não tem maioria sem ambos.",
      "Cluster par (4, 6 nodes) — fica em split-brain mais fácil que impar. Sempre use 3, 5, 7.",
      "Esquecer que leader pode ficar isolado e ainda achar que é leader (need lease + pre-vote em Raft).",
      "Confiar só em Raft sem snapshot — log cresce indefinido, recovery fica lento.",
      "Comparar latência de write entre Raft (consenso) e single primary — Raft sempre paga 1 RTT extra.",
      "Implementar Raft do zero — é fácil errar edge case. Use lib (hashicorp/raft, etcd/raft).",
    ],
    interview: [
      { q: "O que é quorum e por que importa?", a: "<p>Maioria simples (mais que metade). Com 2f+1 nodes, tolera f falhas: ainda sobra maioria.</p><p>Por que: garante que duas decisões não podem ser tomadas em \"lados\" diferentes (qualquer dois quorums se cruzam em pelo menos um node, que pode rejeitar a segunda).</p>" },
      { q: "Resuma Raft em uma frase", a: "<p>Algoritmo de consenso baseado em <strong>leader election</strong> + <strong>log replication</strong>: um leader único por term recebe writes, replica pra followers, commita quando maioria confirmou. Se leader cai, eleicao em term novo.</p>" },
      { q: "O que acontece se a partição isola o leader?", a: "<p>Lado da partição com leader não tem quorum -> não consegue commitar novas entries. Lado com maioria elege novo leader (term maior).</p><p>Quando partição cura: leader antigo ve term maior, vira follower. Reverte uncommitted entries. Sistema são novamente.</p>" },
      { q: "Por que clusters Raft são impares (3, 5, 7)?", a: "<p>4 nodes precisam de quorum 3 (mesmo que 5). Você paga overhead de mais um node sem ganhar tolerancia. Pior: chance de split-brain em 2x2 igual.</p><p>3 tolera 1 falha; 5 tolera 2; 7 tolera 3. Sweet spot: 3 ou 5 pra maioria dos casos.</p>" },
      { q: "Como Raft lida com leader que ficou isolado mas ainda acha que é leader?", a: "<p>Risco: leader antigo aceita reads stale. Mitigação:</p><ul><li><strong>Lease</strong>: leader periodicamente renova lease com followers. Sem heartbeat, não serve reads.</li><li><strong>Read index</strong>: pra read consistente, leader pergunta majoria se ainda é leader antes de responder.</li><li><strong>Pre-vote</strong>: candidato confirma com maioria antes de incrementar term, evitando disrupcao desnecessaria.</li></ul>" },
      { q: "Quando NÃO usar Raft?", a: "<ul><li>Sistemas que tolera eventual consistency (Cassandra, DynamoDB).</li><li>Workload write-heavy single-primary serve melhor.</li><li>Geo-distribuido com latência alta — Raft penaliza muito (1 RTT por commit). Considere Paxos com flexibility ou CRDTs.</li></ul>" },
    ],
    resources: [
      { title: "Raft paper (Ongaro, Ousterhout)", url: "https://raft.github.io/raft.pdf", kind: "artigo" },
      { title: "raft.github.io — visualization", url: "https://raft.github.io/", kind: "pratica" },
      { title: "The Secret Lives of Data — Raft", url: "http://thesecretlivesofdata.com/raft/", kind: "pratica" },
      { title: "MIT 6.824 — lectures", url: "https://pdos.csail.mit.edu/6.824/", kind: "curso" },
      { title: "Designing Data-Intensive Applications (Kleppmann)", url: "https://dataintensive.net/", kind: "livro" },
      { title: "Paxos Made Simple (Lamport)", url: "https://lamport.azurewebsites.net/pubs/paxos-simple.pdf", kind: "artigo" },
    ],
  }

export default raftPaxos
