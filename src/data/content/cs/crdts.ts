import type { SkillContent } from "@/types"

const crdts: SkillContent = {
    tagline: "Estruturas de dados que mergeiam automaticamente entre replicas — sem coordenacao.",
    why: "Base de apps colaborativos (Figma, Linear, Notion offline). Senior precisa explicar trade-off vs OT, tipos de CRDT, e quando NÃO usar.",
    summary: "CRDT (Conflict-free Replicated Data Type) é uma estrutura onde merge é associativo, comutativo e idempotente — qualquer ordem de operações converge pro mesmo estado. Permite replicas operarem offline e mergiarem sem conflito. Tipos: state-based (CvRDT) e operation-based (CmRDT). Trade-off: convergencia automática custa metadata e semantica restrita.",
    keypoints: [
      { title: "Propriedades", body: "Merge associativo, comutativo, idempotente (ACI). Garante convergencia eventual sem coordenacao central." },
      { title: "G-Counter", body: "Counter só cresce. Cada replica tem contador próprio; merge = max por replica + sum. Útil pra likes, views." },
      { title: "PN-Counter", body: "G-Counter pra positivo + outro pra negativo. Merge = max por replica em cada. Permite increment e decrement." },
      { title: "G-Set", body: "Set só add. Merge = union. Sem remove." },
      { title: "2P-Set", body: "G-Set + tombstone set. Add/remove, mas item removido não volta." },
      { title: "OR-Set (Observed-Remove)", body: "Add com unique tag; remove só tira tags observados. Permite re-add. Mais complexo, mais útil." },
      { title: "Yjs / Automerge", body: "Libs de CRDT pra docs colaborativos. Yjs é padrão em editors (Notion-like). Automerge é JSON-like." },
      { title: "Vector clocks / version vectors", body: "Metadata pra detectar concurrency. Cada replica incrementa seu contador a cada update. Merge usa pra ordenar." },
    ],
    gotchas: [
      "CRDT cresce metadata indefinidamente sem garbage collection (tombstones em OR-Set).",
      "Achar que CRDT serve pra qualquer estrutura — semantica é restrita (counter, set, list, json específico).",
      "Comparar CRDT com OT (Operational Transform) sem entender — OT exige server central; CRDT é peer-to-peer.",
      "Esquecer que LWW (Last-Write-Wins) com timestamp é CRDT mas perde dados em concorrência.",
      "Implementar do zero — use Yjs, Automerge, Loro. Bug em CRDT é sutil.",
      "Performance: alguns CRDTs (state-based) tem merge O(n).",
    ],
    interview: [
      { q: "Por que CRDTs?", a: "<p>Permitem replicas operarem offline e mergerar automaticamente sem coordenacao central — convergencia eventual garantida pelas propriedades algebricas (associativo, comutativo, idempotente).</p><p>Casos: editores colaborativos, apps mobile offline-first, multi-region eventual consistency.</p>" },
      { q: "CRDT vs OT (Operational Transform)?", a: "<p><strong>OT</strong>: usado por Google Docs. Operações são transformadas em função do estado. Funciona com server central que serializa e transforma.</p><p><strong>CRDT</strong>: estruturas onde merge é sempre seguro. Não precisa server central. Peer-to-peer ou multi-server.</p><p>OT é mais maduro mas exige central. CRDT é padrão novo (Figma, Linear).</p>" },
      { q: "Como funciona G-Counter?", a: "<p>Counter só cresce. Cada réplica tem array de contadores (um por réplica). Increment local incrementa só o seu.</p><p>Merge: max por replica. Read: sum.</p><p>Ex: replica A tem [3,0,0]; B tem [0,2,0]. Após merge ambos têm [3,2,0]; read = 5.</p>" },
      { q: "CRDT cresce metadata pra sempre?", a: "<p>Em alguns casos sim. OR-Set acumula tombstones. Yjs tem garbage collection com snapshot. Trade-off: economiza memória vs perde história.</p><p>Mitigar: snapshots periódicos com agreement, GC de tombstones antigos com vector clock min.</p>" },
      { q: "Quando NÃO usar CRDT?", a: "<ul><li>Operações que exigem invariante global (saldo não negativo, estoque exato).</li><li>Estruturas complexas sem CRDT pronto (relacional).</li><li>Latência crítica em single-primary suficiente.</li><li>Time pequeno sem expertise — CRDTs são sutis.</li></ul>" },
      { q: "Como funciona Yjs?", a: "<p>Yjs implementa CRDT pra documentos: arrays, maps, texto, XML. Cada operação tem ID único (clock + clientID). Merge é determinista.</p><p>Suporta peer-to-peer (WebRTC, y-webrtc) e server-based (y-websocket). Usado em editores Tiptap, Slate, Monaco. Provavelmente roda nos seus apps colaborativos favoritos.</p>" },
    ],
    resources: [
      { title: "Martin Kleppmann — CRDTs talk", url: "https://www.youtube.com/watch?v=B5NULPSiOGw", kind: "video" },
      { title: "Designing Data-Intensive Applications (Kleppmann)", url: "https://dataintensive.net/", kind: "livro" },
      { title: "CRDT.tech", url: "https://crdt.tech/", kind: "docs" },
      { title: "Yjs docs", url: "https://docs.yjs.dev/", kind: "docs" },
      { title: "Automerge docs", url: "https://automerge.org/", kind: "docs" },
      { title: "Shapiro et al — A comprehensive study of CRDTs", url: "https://hal.inria.fr/inria-00555588/document", kind: "artigo" },
    ],
  }

export default crdts
