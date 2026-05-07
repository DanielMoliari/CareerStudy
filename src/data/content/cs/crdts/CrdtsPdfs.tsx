'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import type { HookItem, RuleItem } from '@/components/pdfs/CheatsheetPdf'

// ── Paleta CRDTs ──────────────────────────────────────────────────────────────
const C = '#8b5cf6'  // roxo — NUNCA omitir, default seria cyan React

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas sobre CRDTs em entrevista',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: propriedades ACI, G-Counter, PN-Counter, OR-Set, CRDT vs OT, Yjs, Automerge, quando NÃO usar, limitações fundamentais, integração com event sourcing — tudo que entrevistadores de sistemas distribuídos realmente perguntam.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'Tipos, merge functions, bibliotecas e limitações numa página',
    type: 'cheatsheet',
    pages: 2,
    description: 'Referência densa: todas as operações e merge functions por tipo de CRDT (G-Counter, PN-Counter, G-Set, 2P-Set, OR-Set, LWW-Register), comparação CRDT vs OT, bibliotecas por caso de uso e limitações fundamentais.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Os 4 truques que grudam CRDTs na memória',
    type: 'mnemonics',
    pages: 2,
    description: 'ACI (as três propriedades), GSO (hierarquia de sets), P2P sem coordenação mas sem invariante, e LWW = Loses Work Willingly. Âncoras cognitivas para entrevistas de sistemas distribuídos.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
]

// ── Dados: Q&A ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'O que é um CRDT e por que ele garante convergência sem coordenação?',
    a: 'CRDT (Conflict-free Replicated Data Type) é uma estrutura projetada matematicamente para que qualquer conjunto de operações, em qualquer ordem, produza o mesmo estado final. Convergência sem coordenação vem das três propriedades: <strong>Associativo</strong> (agrupamento não importa), <strong>Comutativo</strong> (ordem de chegada não importa), <strong>Idempotente</strong> (receber duas vezes = receber uma). Juntas (ACI), garantem convergência sem servidor central.',
    tip: 'Mencione as três propriedades (ACI) pelo nome. Isso demonstra base matemática, não só uso prático.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre CvRDT (state-based) e CmRDT (operation-based)?',
    a: '<strong>CvRDT (state-based)</strong>: envia estado completo. Merge combina dois estados. Robusto — funciona em redes não-confiáveis (idempotência garante re-envio seguro). Custo: estados podem ser grandes. <strong>CmRDT (op-based)</strong>: envia apenas a operação ("+1 de replica X"). Mais eficiente. Exige canal com causal ordering e at-least-once delivery.',
    tip: 'Diferença prática: state-based funciona com broadcast simples; op-based precisa de canal mais sofisticado. Yjs é essencialmente op-based com YATA algorithm.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona um G-Counter?',
    a: 'Counter que só cresce. Cada réplica mantém array de contadores — um slot por réplica. <strong>Increment</strong>: replica X incrementa só seu slot (counter[X]++). <strong>Merge</strong>: max(A[i], B[i]) por slot. <strong>Read</strong>: sum(counter[0..n]). Exemplo: A=[3,0,0] e B=[0,2,0]. Após merge: [3,2,0]. Read = 5.',
    tip: 'Descreva o array de vetores e mostre o exemplo numérico. Entrevistadores de sistemas distribuídos adoram quando você vai ao mecanismo interno.',
  },
  {
    level: 'Pleno',
    q: 'O que é um OR-Set e por que é mais útil que 2P-Set?',
    a: '<strong>2P-Set</strong>: G-Set de adds + G-Set de tombstones. Remove permanente — sem re-add. Tombstones crescem. <strong>OR-Set</strong>: each add gera tag única (UUID). Remove especifica as tags observadas no momento. Re-add cria novas tags — item "volta". Semântica: add concurrent com remove → add wins. Usado em Riak KV.',
    tip: 'Mencione "add wins" em operações concorrentes — é a decisão de design que define o comportamento e que aparece em entrevistas.',
  },
  {
    level: 'Pleno',
    q: 'CRDT vs OT (Operational Transform) — quando usar cada um?',
    a: '<strong>OT</strong>: servidor central serializa e transforma operações. Maduro (Google Docs), undo/redo rico, texto formatado complexo. Contras: sem servidor central, não funciona offline. <strong>CRDT</strong>: sem servidor central, peer-to-peer, offline-first. Contras: metadata cresce, semântica mais restrita. Regra: editor de texto com servidor → OT. App offline-first, multi-região → CRDT.',
    tip: 'Frase que diferencia: "OT exige servidor para serializar; CRDT é peer-to-peer por natureza". Figma migrou de OT para CRDT (Yjs).',
  },
  {
    level: 'Pleno',
    q: 'Como vector clocks funcionam com CRDTs?',
    a: 'Vector clock mapeia replicaId → contador. Cada réplica incrementa seu slot a cada evento produzido. Ao receber mensagem: merge local[i] = max(local[i], V[i]). Para comparar: A precede causalmente B se todos A[i] ≤ B[i] (e pelo menos um é estritamente menor). Em CRDTs: detecta operações já recebidas (idempotência em CmRDT) e determina causalidade para ordenação.',
    tip: 'Diferença entre vector clock e version vector: mesma estrutura, propósito diferente. Vector clock = causalidade; version vector = detecção de conflito. Muitos usam como sinônimos.',
  },
  {
    level: 'Pleno',
    q: 'O que é LWW (Last-Write-Wins) e por que é problemático?',
    a: 'LWW-Register: valor + timestamp. Merge = maior timestamp vence. É tecnicamente um CRDT. Problema: clock skew em sistemas distribuídos pode fazer updates recentes parecerem mais antigos. Perde dados silenciosamente em edição concurrent — apenas um sobrevive sem erro. Funciona quando "último update é correto" (status online/offline), não em colaboração real.',
    tip: 'LWW é CRDT matematicamente, mas considerado "CRDT perigoso". Demonstrar essa nuance mostra profundidade.',
  },
  {
    level: 'Pleno',
    q: 'Quais bibliotecas CRDT você usaria em produção?',
    a: '<strong>Yjs</strong>: editor colaborativo em tempo real, YATA algorithm, bindings para TipTap/ProseMirror/Monaco, WebRTC e WebSocket. <strong>Automerge 2.0</strong>: JSON genérico, Rust+WASM, histórico completo de operações. <strong>Loro</strong>: Rust, WASM, resolve tree move (problema difícil), alta performance. <strong>Riak DT</strong>: CRDT nativo no banco.',
    tip: 'Mencionar Loro (2023) demonstra que você acompanha o estado da arte. Tree move — mover nó em árvore sem criar ciclo — é avanço recente.',
  },
  {
    level: 'Senior',
    q: 'Quando NÃO usar CRDT?',
    a: 'Situações fundamentalmente incompatíveis: (1) <strong>Invariantes globais</strong> — saldo ≥ 0, estoque exato. CRDT não pode garantir sem coordenação. (2) Operações cross-entidade — dependem de estado de outra entidade. (3) Single-primary suficiente — se latência é aceitável, CRDT adiciona complexidade desnecessária. (4) Time pequeno sem expertise — bugs em CRDT são sutis. (5) Relacional com JOINs.',
    tip: 'Invariantes globais é o limite fundamental. É consequência do CAP theorem: disponibilidade + partição = você não pode garantir restrições globais.',
  },
  {
    level: 'Senior',
    q: 'Como o problema de crescimento de metadata é resolvido?',
    a: 'Três estratégias: (1) <strong>Snapshots periódicos</strong> — todos os peers concordam via vector clock, operações anteriores descartadas. Yjs usa y-indexeddb com snapshots. (2) <strong>Vector clock minimum</strong> — tombstones removidos quando todos os peers confirmaram o update. (3) <strong>Compactação de histórico</strong> — Automerge permite squash. Trade-off: GC agressivo economiza memória mas clientes muito atrasados podem não conseguir sincronizar.',
    tip: 'O dilema do GC: você precisa que todos os participantes confirmem para descartar. Mas peer que sumiu para sempre deixa metadata presa. Sistemas reais têm TTL para peers inativos.',
  },
  {
    level: 'Senior',
    q: 'Como Yjs funciona internamente?',
    a: 'Yjs usa algoritmo YATA (Yet Another Transformation Approach). Cada operação tem ID único {client, clock}. Texto é lista de itens, cada um com ID e referência ao predecessor/successor. Conflitos de inserção: resolvidos deterministicamente pelo ID do cliente. Delete: tombstone (posição preservada para ordering). Suporta YText, YArray, YMap, YXmlElement. GC via snapshot agreement. Transportes: y-websocket, y-webrtc, y-indexeddb.',
    tip: 'Mencionar bindings específicos (TipTap, ProseMirror) demonstra que você já integrou ou pesquisou profundamente.',
  },
  {
    level: 'Senior',
    q: 'Qual a diferença entre CRDT, eventual consistency e Strong Eventual Consistency?',
    a: '<strong>Eventual consistency</strong>: garante convergência eventual se operações pararem — pode haver múltiplos estados finais dependendo da ordem. <strong>Strong Eventual Consistency (SEC)</strong>: duas réplicas com o mesmo conjunto de updates têm o mesmo estado — garantia determinística. <strong>CRDT</strong>: estrutura concreta que implementa SEC por propriedade matemática (ACI). Hierarquia: CRDT ⊂ SEC ⊂ Eventual Consistency.',
    tip: 'SEC foi cunhado por Shapiro et al. em 2011 — mesmo paper que formalizou CRDTs. Citar a origem impressiona em entrevistas técnicas avançadas.',
  },
  {
    level: 'Senior',
    q: 'Como implementar contador de likes com CRDT em multi-região?',
    a: 'Design usando PN-Counter: vetores P[] e N[] por região. Like → P[thisRegion]++. Unlike → N[thisRegion]++. Merge: max(P[i]) e max(N[i]) por região. Read: sum(P) - sum(N). Replicação: gossip periódico entre regiões. Trade-offs: leitura local (zero latência), escrita local (zero coordenação), eventual consistency (contagens ligeiramente diferentes entre regiões por segundos), metadata O(n) onde n = número de regiões.',
    tip: 'Mencione que o contador pode ficar negativo se N > P — PN-Counter padrão não garante ≥ 0 sem coordenação. Para isso, você precisaria de algo mais.',
  },
  {
    level: 'Senior',
    q: 'Como CRDTs se integram com event sourcing?',
    a: 'Integração natural: operações CmRDT são eventos imutáveis no event store. Re-aplicar em qualquer ordem produz o mesmo estado. O read model é projeção do merge de todos os eventos CRDT. Réplicas sincronizam compartilhando o log — causal ordering garantido pelo log, simplificando CmRDT. Kafka + CRDT: consumidores em partições diferentes mergeiam sem coordenação. Cuidado: operações devem ser comutativas.',
    tip: 'A combinação aparece em sistemas como Linear. Mencionar a limitação de comutatividade demonstra pensamento crítico.',
  },
  {
    level: 'Senior',
    q: 'Quais são as limitações fundamentais de CRDTs que nunca podem ser superadas?',
    a: '(1) <strong>Invariantes globais</strong>: impossível garantir "saldo ≥ 0" em todas as réplicas sem coordenação. (2) <strong>Semântica restrita</strong>: só estruturas com operações comutativas são implementáveis. (3) <strong>Trade-off de metadata</strong>: GC seguro sem coordenação é impossível — você precisa de consenso para descartar. (4) <strong>Complexidade</strong>: cada nova estrutura precisa ser provada correta matematicamente. Raiz: CAP theorem — disponibilidade + partição = eventual consistency, e CRDT é o melhor possível nesse quadrante.',
    tip: 'Esta pergunta separa quem entendeu de quem memorizou. Apontar o CAP theorem como raiz é a resposta correta.',
  },
  {
    level: 'Senior',
    q: 'Como você testaria a corretude de uma implementação CRDT?',
    a: '(1) <strong>Property-based testing</strong>: fast-check gerando operações aleatórias em ordens aleatórias, verificando que merge produz o mesmo resultado. Testa as três propriedades ACI automaticamente. (2) <strong>Testes de concorrência</strong>: múltiplas réplicas em paralelo com atrasos aleatórios, verificando convergência. (3) <strong>Testes de tombstone e GC</strong>: elementos removidos não ressurgem após merge. Framework recomendado: Jepsen para testes de banco de dados.',
    tip: 'Mencionar property-based testing (não só unitários) demonstra sofisticação. CRDTs com bugs passam em testes simples mas falham em ordens específicas de operação.',
  },
  {
    level: 'Senior',
    q: 'Automerge vs Yjs — quando escolher cada um?',
    a: '<strong>Yjs</strong>: YATA algorithm, foco em performance e editores de texto, bindings oficiais para ProseMirror/TipTap/Slate/Monaco, GC de tombstones. <strong>Automerge 2.0</strong>: Rust+WASM, histórico completo de operações (travel no tempo), JSON genérico (array, object, text, number), mais expressivo para estruturas complexas. Escolha: editor de texto → Yjs. JSON genérico ou histórico completo → Automerge.',
    tip: 'Automerge em Rust/WASM é o estado da arte para CRDT multi-linguagem. Pode ser usado em qualquer linguagem via WASM.',
  },
  {
    level: 'Senior',
    q: 'Como CRDTs são usados em bancos de dados distribuídos?',
    a: '<strong>Riak KV</strong>: pioneiro — CRDT nativos (PN-Counter, OR-Set, Map, Flag). Substituiu LWW por semântica clara. <strong>Redis Enterprise</strong>: Active-Active multi-região com G-Counter, PN-Counter, OR-Set nativos. <strong>AntidoteDB</strong>: banco de pesquisa focado em CRDTs com suporte a transações. Integração: EventSourcing com operações CRDT como eventos; Kafka com consumers usando CRDT state para merge sem coordenação.',
    tip: 'Mencionar Riak mostra que você conhece a história. Foi o primeiro banco a popularizar CRDTs em produção (2012). Redis Enterprise CRDT é diferencial para candidatos de infra.',
  },
  {
    level: 'Pleno',
    q: 'Como você apresentaria CRDTs para um time que nunca trabalhou com consistência eventual?',
    a: 'Três etapas: (1) O problema concreto — edição colaborativa offline. Faça visceral antes da teoria. (2) Intuição antes da matemática — "pense em contador de likes: somo meus + seus, junto tudo, resultado correto independente da ordem." Mostre G-Counter visualmente antes de vetores. (3) Ferramentas prontas — Yjs com TipTap em 30 linhas antes de explicar YATA. Educação progressiva: use lib → entenda estrutura → entenda algoritmo.',
    tip: 'Esta pergunta avalia comunicação técnica. "Começo pela intuição, não pela matemática" é o sinal de quem ensina bem.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona o PN-Counter e onde usaria?',
    a: 'Dois vetores: P[] para incrementos e N[] para decrementos, um slot por réplica. Increment: P[thisReplica]++. Decrement: N[thisReplica]++. Merge: max(P[i]) e max(N[i]) separadamente. Read: sum(P) - sum(N). Casos de uso: score de post (upvote/downvote), rating de produto, métricas que podem subir e descer. Limitação: sem coordenação, não garante valor ≥ 0.',
    tip: 'A limitação "não garante ≥ 0" é o que diferencia G-Counter/PN-Counter de um sistema de saldo bancário. Invariantes globais exigem coordenação.',
  },
  {
    level: 'Pleno',
    q: 'O que é o algoritmo YATA do Yjs?',
    a: 'YATA (Yet Another Transformation Approach) é o algoritmo de CRDT do Yjs para texto colaborativo. Cada inserção tem ID único {clientID, clock}. Ao inserir entre dois elementos, o novo elemento referencia o predecessor e successor desejados. Se duas inserções concorrentes querem o mesmo slot: desambiguação determinística pelo clientID (lexicográfico ou numérico). O resultado é sempre o mesmo independente da ordem de chegada — propriedade ACI satisfeita.',
    tip: 'YATA difere de algoritmos anteriores (RGA, LSEQ) por ser mais simples de implementar corretamente. Mencionar a comparação demonstra que você conhece a literatura.',
  },
]

// ── Dados: Mnemônicos ─────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'ACI — As Três Propriedades que Garantem Convergência',
    trick: 'ACI: Associativo, Comutativo, Idempotente',
    expansion: [
      { letter: 'A', meaning: 'Associativo', detail: 'merge(A, merge(B,C)) = merge(merge(A,B),C) — agrupamento não importa' },
      { letter: 'C', meaning: 'Comutativo', detail: 'merge(A,B) = merge(B,A) — ordem de chegada não importa' },
      { letter: 'I', meaning: 'Idempotente', detail: 'merge(A,A) = A — receber duas vezes não muda nada' },
    ],
    anchor: 'ACI = as três propriedades que transformam estrutura em CRDT',
  },
  {
    label: 'GSO — Hierarquia dos Sets CRDT',
    trick: 'GSO: G-Set → 2P-Set → OR-Set (do simples ao poderoso)',
    expansion: [
      { letter: 'G', meaning: 'G-Set', detail: 'Só add, merge = union. Mais simples e sem tombstones' },
      { letter: 'S', meaning: '2P-Set (Simple)', detail: 'Add e remove permanente. Tombstones crescem. Sem re-add' },
      { letter: 'O', meaning: 'OR-Set (Observed-Remove)', detail: 'Add, remove e re-add. UUID tags. Add concurrent wins. Mais expressivo' },
    ],
    anchor: 'GSO = vai crescendo em poder mas também em metadata',
  },
  {
    label: '"P2P sem conflito, mas sem invariante"',
    trick: 'CRDT = convergência P2P sem coordenação, MAS sem invariantes globais',
    expansion: [
      { letter: 'P', meaning: 'Peer-to-peer', detail: 'Réplicas convergem sem servidor central — por propriedade matemática (ACI)' },
      { letter: 'S', meaning: 'Sem coordenação', detail: 'Sem lock, sem consenso, sem servidor central para merge' },
      { letter: 'I', meaning: 'Invariante impossível', detail: '"Saldo ≥ 0" exige coordenação — é o limite fundamental do CRDT' },
    ],
    anchor: 'CRDT resolve a convergência mas não resolve a coordenação — limites diferentes',
  },
  {
    label: 'LWW — Last-Write-Wins Perde Dados',
    trick: 'LWW = Loses Work Willingly (perde trabalho voluntariamente)',
    expansion: [
      { letter: 'L', meaning: 'Last', detail: 'Maior timestamp vence — decisão arbitrária em concorrência' },
      { letter: 'W', meaning: 'Write', detail: 'Escrita silenciosa — o update perdido não gera erro, só desaparece' },
      { letter: 'W', meaning: 'Wins', detail: 'Ganha o que tem maior timestamp — mas clock skew pode inverter a ordem real' },
    ],
    anchor: 'LWW = tecnicamente CRDT, mas semanticamente perigoso. Use Yjs ou Automerge.',
  },
]

// ── Dados: Cheatsheet ─────────────────────────────────────────────────────────

const CS_HOOKS: HookItem[] = [
  { name: 'G-Counter', signature: 'merge = max(v[i]); read = sum', when: 'Likes, views, métricas', note: 'Só incrementa' },
  { name: 'PN-Counter', signature: 'P[] + N[]; read = sum(P) - sum(N)', when: 'Score, rating', note: 'Sem garantia ≥ 0' },
  { name: 'G-Set', signature: 'merge = union; add apenas', when: 'Tags imutáveis, whitelist', note: 'Sem remove' },
  { name: '2P-Set', signature: 'union(adds) \\ union(removes)', when: 'Delete permanente', note: 'Sem re-add' },
  { name: 'OR-Set', signature: 'add → UUID tag; remove → tags observadas', when: 'Listas colaborativas', note: 'Re-add ok; add wins' },
  { name: 'LWW-Register', signature: 'merge = max(timestamp)', when: 'Status, config simples', note: 'Perde dados em concorrência' },
  { name: 'Yjs', signature: 'YATA algorithm; YText, YArray, YMap', when: 'Editor colaborativo', note: 'TipTap, ProseMirror, Monaco' },
  { name: 'Automerge', signature: 'JSON CRDT; Rust+WASM; event log', when: 'JSON genérico, histórico', note: 'Multi-linguagem via WASM' },
]

const CS_RULES: RuleItem[] = [
  { rule: 'ACI = convergência sem coordenação', reason: 'Associativo + Comutativo + Idempotente = qualquer ordem de operações produz o mesmo estado' },
  { rule: 'CRDT não garante invariantes globais', reason: 'Saldo ≥ 0, estoque exato — exigem coordenação. Limite fundamental, não limitação da implementação' },
  { rule: 'Não implemente CRDT do zero', reason: 'Use Yjs, Automerge, Loro. Bugs em CRDT são sutis e difíceis de testar sem property-based testing' },
  { rule: 'LWW perde dados em concorrência', reason: 'Tecnicamente é CRDT mas semanticamente perigoso. Clock skew pode descartar updates recentes' },
  { rule: 'CRDT vs OT: P2P vs servidor central', reason: 'CRDT é offline-first nativo; OT exige servidor para transformar operações. Figma migrou de OT para CRDT' },
  { rule: 'Tombstones crescem sem GC', reason: 'OR-Set e 2P-Set acumulam tombstones. Snapshot periódico (com agreement) é necessário para GC seguro' },
  { rule: 'OR-Set: add concurrent wins', reason: 'Quando add e remove acontecem ao mesmo tempo offline, o add sobrevive. Decisão de design, não bug' },
]

// ── Builders de PDF ──────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'CRDTs',
    stackLabel: 'CS / Sistemas Distribuídos',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    hooks: CS_HOOKS,
    rules: CS_RULES,
    accentColor: C,
    skillName: 'CRDTs',
    stackLabel: 'CS / Sistemas Distribuídos',
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'CRDTs',
    stackLabel: 'CS / Sistemas Distribuídos',
  }),
}

// ── Componente ────────────────────────────────────────────────────────────────

export default function CrdtsPdfs() {
  const [open, setOpen] = useState<PdfCard | null>(null)
  const hero = PDF_CARDS[0]
  const rest = PDF_CARDS.slice(1)
  return (
    <>
      <HeroCard card={hero} accent={C} onClick={() => setOpen(hero)} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 16 }}>
        {rest.map(c => (
          <CollectionCard key={c.id} card={c} accent={C} onClick={() => setOpen(c)} />
        ))}
      </div>
      {open && <PdfModal card={open} onClose={() => setOpen(null)} builders={PDF_BUILDERS} />}
    </>
  )
}
