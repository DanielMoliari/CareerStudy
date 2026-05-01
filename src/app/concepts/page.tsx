'use client'

import { useState, useCallback } from 'react'
import Nav from '@/components/Nav'

function speak(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  speechSynthesis.cancel()
  const utt = new SpeechSynthesisUtterance(text)
  utt.lang = 'pt-BR'
  utt.rate = 1.05
  speechSynthesis.speak(utt)
}

const EXPLANATIONS: Record<string, string> = {
  'event-loop': "Event loop é um loop que verifica se a stack tá vazia e, quando está, drena toda a microtask queue antes de pegar uma macrotask. Por isso Promise.then sempre roda antes de setTimeout zero.",
  'cap-theorem': "CAP theorem. Em um sistema distribuído com partição de rede, você escolhe entre consistência e disponibilidade. Partition tolerance não é opcional. Postgres com réplicas síncronas é CP, Cassandra é AP, DynamoDB é tunable.",
  'mvcc': "MVCC, multi version concurrency control. Cada update cria uma nova versão da linha. Cada transação recebe um snapshot e só enxerga versões commitadas antes dele. Leitores não bloqueiam escritores.",
  'btree-lsm': "B-tree faz update no lugar e é ótimo pra leitura, mas page splits doem em writes random. LSM-tree faz append-only, escreve sequencial rápido, mas paga com compaction e write amplification. Bloom filter ajuda na leitura.",
  'tls-handshake': "TLS handshake. Cliente manda Client Hello, servidor responde com cert e key share, deriva chave compartilhada via ECDHE. TLS 1 ponto 3 faz isso em 1 RTT, com perfect forward secrecy garantido.",
  'http-versions': "HTTP 1 ponto 1 trava no nível de aplicação. HTTP 2 multiplexa em uma TCP, mas perda de pacote trava todos os streams. HTTP 3 sobre QUIC e UDP da streams realmente independentes e zero RTT em retomada.",
  'rag': "RAG. Pega query, gera embedding, busca top K no vector DB, reranqueia com cross encoder, monta prompt com contexto e manda pro LLM. Pegadinhas: chunking, lost in the middle, recall ruim sem rerank.",
  'circuit-breaker': "Circuit breaker. Três estados, closed, open e half open. N falhas em janela abre o circuito, fail fast. Após timeout vai pra half open, deixa um trial, ok volta a closed, falha volta a open.",
  'consistent-hashing': "Consistent hashing mapeia nós e chaves no mesmo anel. Cada chave vai pro próximo nó no horário. Adicionar no afeta apenas 1 sobre N das chaves. Virtual nodes evitam hot spots.",
  'osi': "OSI tem 7 camadas teoricas, TCP IP usa 4. L7 application, L6 presentation, L4 transport com TCP UDP, L3 network com IP, L2 data link com MAC, L1 físico. Cada uma encapsula a de cima.",
  'cqrs': "CQRS separa lado de escrita de lado de leitura. Event sourcing salva eventos em vez de estado. Combinados, você escreve no aggregate, persiste eventos, projeta read models otimizados. Eventually consistent.",
  'jwt': "JWT tem header ponto payload ponto signature. Header diz o algoritmo. Payload tem claims em base 64 não criptografado. Signature é HMAC ou RSA. Pegadinhas: alg none, confusão HS RS, e não dá pra revogar fácil.",
}

const EL_STEPS = [
  { info: 'Código: <code>console.log(1); setTimeout(()=>log(4),0); Promise.resolve().then(()=>log(3)); console.log(2)</code>. Clique pra começar.', stack:[] as string[], micro:[] as string[], macro:[] as string[], note:'aguardando' },
  { info: '<strong>console.log(1)</strong> entra na stack, executa, imprime <code>1</code>, sai.', stack:['log(1)'], micro:[], macro:[], note:'log(1) ✓ saiu' },
  { info: '<strong>setTimeout(cb, 0)</strong> agenda callback. Web API gerencia. Quando termina, vai pra macrotask queue.', stack:['setTimeout(cb,0)'], micro:[], macro:['log(4)'], note:'agendou cb em macro' },
  { info: '<strong>Promise.resolve().then(cb)</strong> resolve imediato e adiciona <code>cb</code> na microtask queue.', stack:['Promise.then(cb)'], micro:['log(3)'], macro:['log(4)'], note:'agendou cb em micro' },
  { info: '<strong>console.log(2)</strong> entra, imprime <code>2</code>, sai. Stack vai zerar.', stack:['log(2)'], micro:['log(3)'], macro:['log(4)'], note:'log(2) ✓' },
  { info: 'Stack vazia! Event loop drena <strong>toda</strong> a microtask queue antes de tocar em macro.', stack:[], micro:['log(3)'], macro:['log(4)'], note:'stack vazia, vai pra micro' },
  { info: 'Microtask <code>log(3)</code> roda. Imprime <code>3</code>. Continua drenando até microtask queue vazia.', stack:['log(3)'], micro:[], macro:['log(4)'], note:'log(3) ✓ — microtask' },
  { info: 'Microtasks zeradas. Agora pega 1 (só 1!) macrotask.', stack:[], micro:[], macro:['log(4)'], note:'pega 1 macrotask' },
  { info: 'Macrotask <code>log(4)</code> roda. Imprime <code>4</code>. Saida final: <code>1 2 3 4</code>.', stack:['log(4)'], micro:[], macro:[], note:'log(4) ✓ — concluido' },
]

const MVCC_INFO = [
  'Começo do tempo. Linha id=1 tem versão v1: name=Ana, criada pela transação xmin=100.',
  'v1 já existe. Nada acontece.',
  'Tx A começa, pega snapshot t1. Vai poder ler só o que foi commitado antes.',
  'Tx B começa DEPOIS. Faz UPDATE: cria v2 (name=Bia, xmin=101). v1 fica marcada com xmax=101 mas continua ali — não é overwrite.',
  'Tx A faz SELECT. Decide qual versão ler: v1 é visível (xmin=100, comitada antes do snapshot). v2 não (xmin=101, ainda não commitou). Le <strong>Ana</strong>.',
  'Tx B da COMMIT. v2 agora é oficial pra futuras transações — mas A já tem seu snapshot.',
  'Tx A repete o SELECT. Snapshot dela não mudou! Continua vendo v1 = <strong>Ana</strong>. Isso é <strong>repeatable read</strong> de graça pelo MVCC.',
]

const TLS_INFO: Record<number, string> = {
  1: '<strong>ClientHello.</strong> Lista de versões TLS suportadas, lista de cipher suites, random de 32 bytes, e em TLS 1.3 já vai um KeyShare ECDHE. SNI (server name indication) também vai aqui.',
  2: '<strong>ServerHello.</strong> Servidor escolhe versão e cipher suite, manda seu random e seu KeyShare. Junto vai o <code>Certificate</code> assinado pela CA.',
  3: '<strong>Cliente válida o cert</strong> contra root stores, checa SAN e CN. Também usa o KeyShare do servidor + seu KeyShare pra derivar a <code>shared secret</code> via ECDHE.',
  4: '<strong>ChangeCipherSpec + Finished.</strong> Cliente confirma que daqui pra frente vai falar cifrado. Manda Finished, que é um HMAC sobre todo o handshake — protege contra downgrade attack.',
  5: '<strong>Server Finished.</strong> Servidor confirma a mesma coisa, fechando a negociação. Após isso, ambos tem a mesma chave simétrica derivada.',
  6: '<strong>Application Data cifrado.</strong> AES-GCM ou ChaCha20-Poly1305 (AEAD). Cada record carrega seu nonce e MAC.',
}

const CH_COLORS = ['var(--scarlet)', 'var(--blue)', 'var(--green)', 'var(--violet)', 'var(--amber)', '#14b8a6', '#ec4899']
const CH_CX = 440, CH_CY = 220, CH_R = 170

type ChNode = { angle: number; name: string }
type ChKey = { angle: number; label: string }

function chOwner(keyAngle: number, nodes: ChNode[]) {
  const sorted = [...nodes].sort((a, b) => a.angle - b.angle)
  for (const n of sorted) if (n.angle >= keyAngle) return n
  return sorted[0]
}

export default function ConceptsPage() {
  // Per-diagram step state
  const [elStep, setElStep] = useState(0)
  const [mvccStep, setMvccStep] = useState(0)
  const [capMode, setCapMode] = useState<string | null>(null)
  const [tlsInfo, setTlsInfo] = useState<string>('Clique numa das mensagens acima pra ver o que ela carrega.')
  const [ragActive, setRagActive] = useState<number | null>(null)
  const [cbState, setCbState] = useState<'CLOSED'|'OPEN'|'HALF-OPEN'>('CLOSED')
  const [cbFail, setCbFail] = useState(0)
  const [cbInfo, setCbInfo] = useState('Use os botões pra simular: 3 falhas seguidas <strong>abrem</strong> o circuit. Depois do timeout vai pra HALF-OPEN. Um request OK la fecha de volta.')
  const [chNodes, setChNodes] = useState<ChNode[]>([{angle:30,name:'A'},{angle:150,name:'B'},{angle:270,name:'C'}])
  const [chKeys, setChKeys] = useState<ChKey[]>([{angle:80,label:'k1'},{angle:110,label:'k2'},{angle:200,label:'k3'},{angle:240,label:'k4'},{angle:320,label:'k5'}])
  const [chInfo, setChInfo] = useState('Comece com 3 nós. Adiciona um quarto e veja quantas chaves precisaram ser realocadas.')
  const [osiInfo, setOsiInfo] = useState('Clique numa camada pra ver o que acontece nela.')
  const [osiActive, setOsiActive] = useState<number|null>(null)

  // CB simulation
  const cbSimulate = useCallback((action: 'ok'|'fail'|'timeout') => {
    setCbState(prev => {
      let next = prev
      if (prev === 'CLOSED') {
        if (action === 'ok') { setCbFail(0); setCbInfo('<strong>OK em CLOSED.</strong> Resetou contador de falhas.'); }
        else if (action === 'fail') {
          setCbFail(f => {
            const nf = f + 1
            if (nf >= 3) { next = 'OPEN'; setCbInfo('<strong>3 falhas — abriu o circuito!</strong> Todos requests são rejeitados.') }
            else setCbInfo(`<strong>Falha em CLOSED.</strong> Falhas: ${nf}/3.`)
            return nf
          })
        } else { setCbInfo('Timeout não se aplica em CLOSED.') }
      } else if (prev === 'OPEN') {
        if (action === 'timeout') { next = 'HALF-OPEN'; setCbInfo('<strong>Timeout passou — vai pra HALF-OPEN.</strong> Vai deixar 1 trial passar.') }
        else setCbInfo('<strong>OPEN — request rejeitado sem chamar o serviço.</strong> Avance timeout pra tentar half-open.')
      } else if (prev === 'HALF-OPEN') {
        if (action === 'ok') { next = 'CLOSED'; setCbFail(0); setCbInfo('<strong>Trial OK — fecha o circuito!</strong>') }
        else if (action === 'fail') { next = 'OPEN'; setCbInfo('<strong>Trial falhou — volta pra OPEN.</strong>') }
        else setCbInfo('Em HALF-OPEN espera um trial.')
      }
      return next
    })
  }, [])

  // CH add/remove
  const chAddNode = () => {
    if (chNodes.length >= 7) { setChInfo('<strong>Máx 7 nós.</strong>'); return }
    const newAngle = Math.floor(Math.random() * 360)
    const letter = String.fromCharCode(65 + chNodes.length)
    const before = chKeys.map(k => chOwner(k.angle, chNodes).name)
    const newNodes = [...chNodes, { angle: newAngle, name: letter }]
    const after = chKeys.map(k => chOwner(k.angle, newNodes).name)
    const moved = before.filter((b, i) => b !== after[i]).length
    setChNodes(newNodes)
    setChInfo(`<strong>Adicionou no ${letter}.</strong> ${moved} de ${chKeys.length} chaves migraram.`)
  }
  const chRemoveNode = () => {
    if (chNodes.length <= 2) { setChInfo('<strong>Mín 2 nós.</strong>'); return }
    const removed = chNodes[chNodes.length - 1]
    const newNodes = chNodes.slice(0, -1)
    const before = chKeys.map(k => chOwner(k.angle, chNodes).name)
    const after = chKeys.map(k => chOwner(k.angle, newNodes).name)
    const moved = before.filter((b, i) => b !== after[i]).length
    setChNodes(newNodes)
    setChInfo(`<strong>Removeu no ${removed.name}.</strong> ${moved} de ${chKeys.length} chaves migraram.`)
  }
  const chAddKey = () => {
    if (chKeys.length >= 12) { setChInfo('<strong>Max 12 chaves.</strong>'); return }
    const newAngle = Math.floor(Math.random() * 360)
    const label = 'k' + (chKeys.length + 1)
    const newKeys = [...chKeys, { angle: newAngle, label }]
    const owner = chOwner(newAngle, chNodes)
    setChKeys(newKeys)
    setChInfo(`<strong>Adicionou ${label}.</strong> Caiu em ${Math.round(newAngle)}deg, vai pro no: <code>${owner.name}</code>.`)
  }
  const chReset = () => {
    setChNodes([{angle:30,name:'A'},{angle:150,name:'B'},{angle:270,name:'C'}])
    setChKeys([{angle:80,label:'k1'},{angle:110,label:'k2'},{angle:200,label:'k3'},{angle:240,label:'k4'},{angle:320,label:'k5'}])
    setChInfo('Comece com 3 nós. Adiciona um quarto e veja quantas chaves precisaram ser realocadas.')
  }

  const elS = EL_STEPS[elStep]

  const sBox = (st: string) => ({
    background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 12, padding: '26px 28px', marginBottom: 28, scrollMarginTop: 160,
  } as React.CSSProperties)

  const cardInfo = (html: string) => (
    <div style={{ marginTop: 14, background: 'var(--bg-elev)', border: '1px dashed rgba(255,255,255,.10)', borderRadius: 8, padding: '14px 18px', fontSize: 13.5, color: 'var(--fg-mute)', lineHeight: 1.7 }}
      dangerouslySetInnerHTML={{ __html: html }} />
  )

  const explain = (html: string) => (
    <p style={{ color: 'var(--fg)', fontSize: 14.5, lineHeight: 1.75, background: 'var(--bg-card-2)', borderLeft: '2px solid var(--scarlet)', padding: '14px 18px', borderRadius: '0 8px 8px 0', marginTop: 14 }}
      dangerouslySetInnerHTML={{ __html: html }} />
  )

  const svgWrap = (children: React.ReactNode) => (
    <div style={{ background: 'var(--bg-card-2)', border: '1px solid var(--line)', borderRadius: 10, padding: 18, marginBottom: 14, overflow: 'hidden' }}>
      {children}
    </div>
  )

  const svgTextStyle = { fontFamily: 'JetBrains Mono, monospace' }
  const svgHStyle = { fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }
  const svgBoxStyle = { fill: '#15151c', stroke: 'rgba(255,255,255,.08)', strokeWidth: 1 }

  return (
    <>
      <Nav />
      <div className="shell-wide">

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, rgba(239,68,68,.06), rgba(59,130,246,.05))', border: '1px solid rgba(239,68,68,.15)', borderRadius: 16, padding: '32px 36px', marginBottom: 28, position: 'relative', overflow: 'hidden' }}>
        <p className="hdr-label"><span className="ln" /> conceitos visuais</p>
        <h1>Conceitos <em>visuais</em></h1>
        <p className="desc" style={{ marginBottom: 0, maxWidth: 780 }}>
          Diagramas interativos pra entender e defender em entrevista. Clique nos elementos, avance passo a passo, ouça a explicação em português.
        </p>
      </div>

      {/* TOC */}
      <div style={{ background: 'rgba(17,17,24,.9)', border: '1px solid var(--line)', borderRadius: 12, padding: '18px 22px', marginBottom: 32, position: 'sticky', top: 78, zIndex: 30, backdropFilter: 'blur(12px)' }}>
        <h4 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--scarlet)', letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 10 }}>índice — pula pro diagrama</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {[
            ['event-loop','01','event loop'],['cap-theorem','02','CAP theorem'],['mvcc','03','MVCC'],
            ['btree-lsm','04','B-tree vs LSM'],['tls-handshake','05','TLS handshake'],
            ['http-versions','06','HTTP/1 vs 2 vs 3'],['rag','07','RAG pipeline'],
            ['circuit-breaker','08','circuit breaker'],['consistent-hashing','09','consistent hashing'],
            ['osi','10','OSI / TCP-IP'],['cqrs','11','CQRS + ES'],['jwt','12','JWT'],
          ].map(([id, num, label]) => (
            <a key={id} href={`#${id}`} style={{ padding: '5px 11px', borderRadius: 6, background: 'var(--bg-card-2)', border: '1px solid var(--line)', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--fg-mute)', transition: 'all .15s', textDecoration: 'none' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--scarlet)'; (e.currentTarget as HTMLElement).style.color = 'var(--scarlet)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--line)'; (e.currentTarget as HTMLElement).style.color = 'var(--fg-mute)' }}
            >
              <span style={{ color: 'var(--fg-dim)', marginRight: 4, fontSize: 9 }}>{num}</span>{label}
            </a>
          ))}
        </div>
      </div>

      {/* ===== 01 EVENT LOOP ===== */}
      <div className="card concept" id="event-loop" style={sBox('el')}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 18, marginBottom: 6, flexWrap: 'wrap' }}>
          <div>
            <h2>01. Event Loop</h2>
            <p style={{ color: 'var(--fg-mute)', fontSize: 14, marginBottom: 0 }}>Como JavaScript faz uma só thread parecer concorrente — call stack, microtask queue e macrotask queue dançando juntos.</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="tag p1">P1</span>
            <button className="btn" onClick={() => speak(EXPLANATIONS['event-loop'])}>ouvir</button>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--fg-dim)', marginBottom: 14 }}>
          <span><span style={{ background: '#3b82f6', width: 10, height: 10, borderRadius: 3, display: 'inline-block', marginRight: 6 }} />call stack</span>
          <span><span style={{ background: '#a855f7', width: 10, height: 10, borderRadius: 3, display: 'inline-block', marginRight: 6 }} />microtasks</span>
          <span><span style={{ background: '#eab308', width: 10, height: 10, borderRadius: 3, display: 'inline-block', marginRight: 6 }} />macrotasks</span>
          <span><span style={{ background: '#22c55e', width: 10, height: 10, borderRadius: 3, display: 'inline-block', marginRight: 6 }} />em execução</span>
        </div>
        {svgWrap(
          <svg viewBox="0 0 880 380" style={{ width: '100%', maxWidth: '100%', height: 'auto', display: 'block' }} xmlns="http://www.w3.org/2000/svg">
            <text x="120" y="30" textAnchor="middle" style={{ ...svgHStyle, fill: 'var(--fg)', fontSize: 14 }}>CALL STACK</text>
            <rect x="40" y="50" width="160" height="220" style={svgBoxStyle} rx="6"/>
            {elS.stack.map((item, i) => {
              const y = 240 - i * 30
              const color = i === elS.stack.length - 1 ? 'var(--green)' : 'var(--blue)'
              return (
                <g key={i}>
                  <rect x="55" y={y} width="130" height="22" fill="rgba(59,130,246,.1)" stroke={color} rx="4"/>
                  <text x="120" y={y+15} textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg)' }}>{item}</text>
                </g>
              )
            })}
            <circle cx="440" cy="190" r="65" fill="none" stroke="var(--scarlet)" strokeWidth="2" strokeDasharray="4 4" opacity=".55"/>
            <text x="440" y="186" textAnchor="middle" style={{ ...svgHStyle, fill: 'var(--fg)', fontSize: 13 }}>EVENT</text>
            <text x="440" y="204" textAnchor="middle" style={{ ...svgHStyle, fill: 'var(--scarlet)', fontSize: 13 }}>LOOP</text>
            <path d="M 440 125 A 65 65 0 0 1 505 190" stroke="var(--scarlet)" strokeWidth="2" fill="none"/>
            <polygon points="505,190 500,184 510,184" fill="var(--scarlet)"/>
            <text x="700" y="30" textAnchor="middle" style={{ ...svgHStyle, fill: 'var(--fg)', fontSize: 13 }}>MICROTASK QUEUE</text>
            <text x="700" y="46" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-dim)' }}>Promise.then • queueMicrotask</text>
            <rect x="560" y="60" width="280" height="60" style={svgBoxStyle} rx="6" stroke="rgba(168,85,247,.35)"/>
            {elS.micro.map((item, i) => (
              <g key={i}>
                <rect x={575 + i*92} y="78" width="88" height="22" fill="rgba(168,85,247,.1)" stroke="var(--violet)" rx="4"/>
                <text x={619 + i*92} y="93" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg)' }}>{item}</text>
              </g>
            ))}
            <text x="700" y="170" textAnchor="middle" style={{ ...svgHStyle, fill: 'var(--fg)', fontSize: 13 }}>MACROTASK QUEUE</text>
            <text x="700" y="186" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-dim)' }}>setTimeout • IO • setInterval</text>
            <rect x="560" y="200" width="280" height="60" style={svgBoxStyle} rx="6" stroke="rgba(234,179,8,.35)"/>
            {elS.macro.map((item, i) => (
              <g key={i}>
                <rect x={575 + i*92} y="218" width="88" height="22" fill="rgba(234,179,8,.1)" stroke="var(--amber)" rx="4"/>
                <text x={619 + i*92} y="233" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg)' }}>{item}</text>
              </g>
            ))}
            <text x="700" y="300" textAnchor="middle" style={{ ...svgHStyle, fill: 'var(--fg)', fontSize: 13 }}>WEB APIs / libuv</text>
            <rect x="560" y="310" width="280" height="50" style={svgBoxStyle} rx="6" stroke="rgba(59,130,246,.35)"/>
            <text x="700" y="338" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 11, fill: 'var(--fg-mute)' }}>timers, fs, network, etc.</text>
            <path d="M 200 160 L 380 160" stroke="var(--fg-dim)" strokeWidth="1.5" fill="none"/>
            <polygon points="380,160 372,156 372,164" fill="var(--fg-dim)"/>
            <text x="290" y="153" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-dim)' }}>vazio?</text>
            <path d="M 555 90 L 510 160" stroke="var(--violet)" strokeWidth="1.5" fill="none"/>
            <polygon points="510,160 514,153 519,160" fill="var(--violet)"/>
            <text x="510" y="115" style={{ ...svgTextStyle, fontSize: 9, fill: 'var(--violet)' }}>drena tudo</text>
            <path d="M 555 230 L 510 215" stroke="var(--amber)" strokeWidth="1.5" fill="none"/>
            <polygon points="510,215 519,212 514,221" fill="var(--amber)"/>
            <text x="510" y="245" style={{ ...svgTextStyle, fontSize: 9, fill: 'var(--amber)' }}>1 por tick</text>
            <text x="440" y="370" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 11, fill: 'var(--fg-dim)' }}>
              passo atual: <tspan fill="var(--scarlet)">{elS.note}</tspan>
            </text>
          </svg>
        )}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          <button className="btn primary" onClick={() => setElStep(s => (s + 1) % EL_STEPS.length)}>próximo passo →</button>
          <button className="btn ghost" onClick={() => setElStep(0)}>resetar</button>
          <span style={{ display: 'inline-block', padding: '6px 12px', background: 'var(--bg-elev)', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--fg-mute)', borderRadius: 6, marginLeft: 8 }}>passo {elStep} / 8</span>
        </div>
        {cardInfo(elS.info)}
        {explain('O event loop é um loop infinito que só faz uma coisa: <code>se a stack tá vazia, pega próximo task</code>. A pegadinha está na ordem das filas. Toda vez que a stack esvazia, ele <strong>drena 100%</strong> da microtask queue antes de tocar em qualquer macrotask. Por isso <code>Promise.then</code> sempre roda antes de <code>setTimeout(..., 0)</code>.')}
      </div>

      {/* ===== 02 CAP ===== */}
      <div className="card concept" id="cap-theorem" style={sBox('cap')}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 18, marginBottom: 6, flexWrap: 'wrap' }}>
          <div>
            <h2>02. CAP Theorem</h2>
            <p style={{ color: 'var(--fg-mute)', fontSize: 14, marginBottom: 0 }}>Em uma partição de rede, você escolha consistencia OU disponibilidade.</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="tag p1">P1</span>
            <button className="btn" onClick={() => speak(EXPLANATIONS['cap-theorem'])}>ouvir</button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
          {(['CP','AP','CA'] as const).map(k => (
            <button key={k} className={`btn${capMode === k ? ' primary' : ''}`} onClick={() => setCapMode(capMode === k ? null : k)}>
              {k === 'CP' ? 'CP — consistência + tolerância' : k === 'AP' ? 'AP — disponibilidade + tolerância' : 'CA — só sem rede particionada'}
            </button>
          ))}
          <button className="btn ghost" onClick={() => setCapMode(null)}>limpar</button>
        </div>
        {svgWrap(
          <svg viewBox="0 0 800 440" style={{ width: '100%', maxWidth: '100%', height: 'auto', display: 'block' }} xmlns="http://www.w3.org/2000/svg">
            <polygon points="400,60 130,400 670,400" fill="rgba(239,68,68,.04)" stroke="rgba(255,255,255,.1)" strokeWidth="1.5"/>
            <line x1="400" y1="60" x2="670" y2="400" stroke={capMode === 'CP' ? 'var(--scarlet)' : 'rgba(255,255,255,.1)'} strokeWidth={capMode === 'CP' ? 4 : 3}/>
            <line x1="130" y1="400" x2="670" y2="400" stroke={capMode === 'AP' ? 'var(--scarlet)' : 'rgba(255,255,255,.1)'} strokeWidth={capMode === 'AP' ? 4 : 3}/>
            <line x1="400" y1="60" x2="130" y2="400" stroke={capMode === 'CA' ? 'var(--scarlet)' : 'rgba(255,255,255,.1)'} strokeWidth={capMode === 'CA' ? 4 : 3}/>
            <circle cx="400" cy="60" r="36" fill="var(--bg-card-2)" stroke="var(--scarlet)" strokeWidth="2"/>
            <text x="400" y="68" textAnchor="middle" style={{ ...svgHStyle, fill: 'var(--scarlet)', fontSize: 22 }}>C</text>
            <text x="400" y="32" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 12, fontWeight: 700, fill: 'var(--fg)' }}>CONSISTENCY</text>
            <circle cx="130" cy="400" r="36" fill="var(--bg-card-2)" stroke="var(--blue)" strokeWidth="2"/>
            <text x="130" y="408" textAnchor="middle" style={{ ...svgHStyle, fill: 'var(--blue)', fontSize: 22 }}>A</text>
            <text x="130" y="436" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 12, fontWeight: 700, fill: 'var(--fg)' }}>AVAILABILITY</text>
            <circle cx="670" cy="400" r="36" fill="var(--bg-card-2)" stroke="var(--green)" strokeWidth="2"/>
            <text x="670" y="408" textAnchor="middle" style={{ ...svgHStyle, fill: 'var(--green)', fontSize: 22 }}>P</text>
            <text x="670" y="436" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 12, fontWeight: 700, fill: 'var(--fg)' }}>PARTITION TOLERANCE</text>
            <g opacity={capMode === 'CP' ? 1 : 0} style={{ transition: 'opacity .2s' }}>
              <rect x="430" y="200" width="220" height="90" style={svgBoxStyle} rx="6" stroke="var(--scarlet)"/>
              <text x="540" y="222" textAnchor="middle" style={{ ...svgHStyle, fill: 'var(--scarlet)', fontSize: 12 }}>CP — escolhe consistencia</text>
              <text x="540" y="244" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 11, fill: 'var(--fg-mute)' }}>PostgreSQL (sync replicas)</text>
              <text x="540" y="262" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 11, fill: 'var(--fg-mute)' }}>MongoDB (majority)</text>
              <text x="540" y="280" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 11, fill: 'var(--fg-mute)' }}>HBase, Zookeeper, etcd</text>
            </g>
            <g opacity={capMode === 'AP' ? 1 : 0} style={{ transition: 'opacity .2s' }}>
              <rect x="290" y="320" width="220" height="80" style={svgBoxStyle} rx="6" stroke="var(--blue)"/>
              <text x="400" y="342" textAnchor="middle" style={{ ...svgHStyle, fill: 'var(--blue)', fontSize: 12 }}>AP — escolhe disponibilidade</text>
              <text x="400" y="364" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 11, fill: 'var(--fg-mute)' }}>Cassandra, DynamoDB</text>
              <text x="400" y="382" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 11, fill: 'var(--fg-mute)' }}>CouchDB, Riak</text>
            </g>
            <g opacity={capMode === 'CA' ? 1 : 0} style={{ transition: 'opacity .2s' }}>
              <rect x="160" y="200" width="220" height="80" style={svgBoxStyle} rx="6" stroke="var(--amber)"/>
              <text x="270" y="222" textAnchor="middle" style={{ ...svgHStyle, fill: 'var(--amber)', fontSize: 12 }}>CA — só single-node</text>
              <text x="270" y="244" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 11, fill: 'var(--fg-mute)' }}>RDBMS clássico (1 máquina)</text>
              <text x="270" y="262" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 11, fill: 'var(--fg-mute)' }}>SQLite local</text>
            </g>
          </svg>
        )}
        {cardInfo(capMode === 'CP' ? '<strong>CP.</strong> Sob partição, prefere recusar request a servir dado stale. Financeiro, locking distribuído, leader election.' : capMode === 'AP' ? '<strong>AP.</strong> Sempre responde, mesmo com dado desatualizado. Carrinho de compra, social feeds.' : capMode === 'CA' ? '<strong>CA.</strong> Só existe sem rede particionada — single-node. Distribuído não tem como.' : 'Clique numa das opções acima pra ver quais bancos ficam em cada lado.')}
        {explain('Brewer disse: dado um <code>network partition</code>, você só pode escolher 2 de 3. Como <strong>P</strong> não é opcional em sistema distribuído, a escolha real é entre <strong>C ou A</strong>. PostgreSQL com réplicas síncronas escolhe C. Cassandra escolhe A. DynamoDB é <strong>tunable</strong>. PACELC estende: mesmo sem partição, tradeoff entre <code>Latency</code> e <code>Consistency</code>.')}
      </div>

      {/* ===== 03 MVCC ===== */}
      <div className="card concept" id="mvcc" style={sBox('mvcc')}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 18, marginBottom: 6, flexWrap: 'wrap' }}>
          <div>
            <h2>03. MVCC (Postgres)</h2>
            <p style={{ color: 'var(--fg-mute)', fontSize: 14, marginBottom: 0 }}>Como dois clientes leem e escrevem a mesma tabela ao mesmo tempo sem travar nada.</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="tag p1">P1</span>
            <button className="btn" onClick={() => speak(EXPLANATIONS['mvcc'])}>ouvir</button>
          </div>
        </div>
        {svgWrap(
          <svg viewBox="0 0 880 360" style={{ width: '100%', maxWidth: '100%', height: 'auto', display: 'block' }} xmlns="http://www.w3.org/2000/svg">
            <line x1="60" y1="60" x2="820" y2="60" stroke="var(--fg-dim)" strokeWidth="1"/>
            <text x="60" y="48" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-dim)' }}>tempo →</text>
            <text x="40" y="120" textAnchor="end" style={{ ...svgHStyle, fill: 'var(--blue)', fontSize: 13 }}>Tx A</text>
            <line x1="60" y1="120" x2="820" y2="120" stroke="rgba(59,130,246,.3)" strokeWidth="1" strokeDasharray="2 4"/>
            <text x="40" y="200" textAnchor="end" style={{ ...svgHStyle, fill: 'var(--violet)', fontSize: 13 }}>Tx B</text>
            <line x1="60" y1="200" x2="820" y2="200" stroke="rgba(168,85,247,.3)" strokeWidth="1" strokeDasharray="2 4"/>
            <text x="40" y="290" textAnchor="end" style={{ ...svgHStyle, fill: 'var(--scarlet)', fontSize: 13 }}>linha id=1</text>
            <line x1="60" y1="290" x2="820" y2="290" stroke="rgba(239,68,68,.3)" strokeWidth="1" strokeDasharray="2 4"/>
            {mvccStep >= 1 && <g>
              <circle cx="150" cy="290" r="12" fill="var(--bg-card-2)" stroke="var(--scarlet)" strokeWidth="2"/>
              <text x="150" y="294" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-mute)' }} textAnchor="middle">v1</text>
              <text x="150" y="320" style={{ ...svgTextStyle, fontSize: 9, fill: 'var(--fg-mute)' }} textAnchor="middle">name=Ana</text>
              <text x="150" y="332" style={{ ...svgTextStyle, fontSize: 9, fill: 'var(--fg-mute)' }} textAnchor="middle">xmin=100</text>
            </g>}
            {mvccStep >= 2 && <g>
              <circle cx="270" cy="120" r="10" fill="var(--blue)"/>
              <text x="270" y="100" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--blue)' }} textAnchor="middle">BEGIN A (snap=t1)</text>
              <line x1="270" y1="130" x2="270" y2="282" stroke="var(--blue)" strokeDasharray="3 3" opacity=".5"/>
            </g>}
            {mvccStep >= 3 && <g>
              <circle cx="380" cy="200" r="10" fill="var(--violet)"/>
              <text x="380" y="226" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--violet)' }} textAnchor="middle">BEGIN B</text>
              <text x="380" y="186" style={{ ...svgTextStyle, fontSize: 9, fill: 'var(--violet)' }} textAnchor="middle">UPDATE name=Bia</text>
              <line x1="380" y1="210" x2="380" y2="282" stroke="var(--violet)" strokeDasharray="3 3" opacity=".5"/>
              <circle cx="380" cy="290" r="12" fill="var(--bg-card-2)" stroke="var(--violet)" strokeWidth="2"/>
              <text x="380" y="294" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-mute)' }} textAnchor="middle">v2</text>
              <text x="380" y="320" style={{ ...svgTextStyle, fontSize: 9, fill: 'var(--fg-mute)' }} textAnchor="middle">name=Bia</text>
              <text x="380" y="332" style={{ ...svgTextStyle, fontSize: 9, fill: 'var(--fg-mute)' }} textAnchor="middle">xmin=101</text>
            </g>}
            {mvccStep >= 4 && <g>
              <circle cx="500" cy="120" r="10" fill="var(--blue)"/>
              <text x="500" y="100" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--blue)' }} textAnchor="middle">SELECT por A</text>
              <text x="500" y="142" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--green)' }} textAnchor="middle">le v1: Ana ✓</text>
            </g>}
            {mvccStep >= 5 && <g>
              <circle cx="620" cy="200" r="10" fill="var(--violet)"/>
              <text x="620" y="186" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--violet)' }} textAnchor="middle">COMMIT B</text>
              <text x="620" y="222" style={{ ...svgTextStyle, fontSize: 9, fill: 'var(--violet)' }} textAnchor="middle">v2 visível pra futuras</text>
            </g>}
            {mvccStep >= 6 && <g>
              <circle cx="730" cy="120" r="10" fill="var(--blue)"/>
              <text x="730" y="100" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--blue)' }} textAnchor="middle">SELECT por A novamente</text>
              <text x="730" y="142" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--green)' }} textAnchor="middle">ainda Ana ✓ (snapshot)</text>
            </g>}
            <text x="440" y="20" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-dim)' }}>passo: <tspan fill="var(--scarlet)">{mvccStep}</tspan> / 6</text>
          </svg>
        )}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          <button className="btn primary" onClick={() => setMvccStep(s => Math.min(6, s + 1))}>próximo passo →</button>
          <button className="btn ghost" onClick={() => setMvccStep(0)}>resetar</button>
        </div>
        {cardInfo(MVCC_INFO[mvccStep] || '')}
        {explain('MVCC = <strong>Multi-Version Concurrency Control</strong>. Em vez de bloquear leitores enquanto alguem escreve, o Postgres mantem múltiplas versões da mesma linha. Cada tupla tem <code>xmin</code> (transação que criou) e <code>xmax</code> (transação que deletou). Resultado: <code>readers não bloqueiam writers</code>. O custo é o lixo que o <code>VACUUM</code> precisa limpar.')}
      </div>

      {/* ===== 04 B-TREE vs LSM ===== */}
      <div className="card concept" id="btree-lsm" style={sBox('btree')}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 18, marginBottom: 6, flexWrap: 'wrap' }}>
          <div>
            <h2>04. B-tree vs LSM-tree</h2>
            <p style={{ color: 'var(--fg-mute)', fontSize: 14, marginBottom: 0 }}>Duas filosofias opostas pra indexar dados em disco.</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="tag p1">P1</span>
            <button className="btn" onClick={() => speak(EXPLANATIONS['btree-lsm'])}>ouvir</button>
          </div>
        </div>
        {svgWrap(
          <svg viewBox="0 0 880 380" style={{ width: '100%', maxWidth: '100%', height: 'auto', display: 'block' }} xmlns="http://www.w3.org/2000/svg">
            <text x="220" y="28" textAnchor="middle" style={{ ...svgHStyle, fill: 'var(--blue)', fontSize: 14 }}>B-TREE (Postgres, MySQL, SQLite)</text>
            <text x="220" y="46" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-dim)' }}>in-place update • leitura O(log n)</text>
            <rect x="160" y="65" width="120" height="34" style={svgBoxStyle} rx="4" stroke="var(--blue)"/>
            <text x="220" y="86" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 11, fill: 'var(--fg)' }}>[ 25 | 50 | 75 ]</text>
            <rect x="60" y="135" width="90" height="30" style={svgBoxStyle} rx="4" stroke="var(--blue)"/><text x="105" y="155" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-mute)' }}>[10|20]</text>
            <rect x="170" y="135" width="90" height="30" style={svgBoxStyle} rx="4" stroke="var(--blue)"/><text x="215" y="155" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-mute)' }}>[30|40]</text>
            <rect x="280" y="135" width="90" height="30" style={svgBoxStyle} rx="4" stroke="var(--blue)"/><text x="325" y="155" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-mute)' }}>[60|70]</text>
            <path d="M 200 99 L 105 135" stroke="var(--fg-dim)" strokeWidth="1.5" fill="none"/>
            <path d="M 220 99 L 215 135" stroke="var(--fg-dim)" strokeWidth="1.5" fill="none"/>
            <path d="M 250 99 L 325 135" stroke="var(--fg-dim)" strokeWidth="1.5" fill="none"/>
            {([[40,200,56,28,'5,8'],[100,200,56,28,'15,18'],[170,200,56,28,'28,29'],[230,200,56,28,'45,48'],[300,200,56,28,'65,68'],[360,200,56,28,'80,95']] as [number,number,number,number,string][]).map(([x,y,w,h,t],i)=>(
              <g key={i}><rect x={x} y={y} width={w} height={h} style={svgBoxStyle} rx="3" stroke="var(--blue)"/><text x={x+w/2} y={y+18} textAnchor="middle" style={{ ...svgTextStyle, fontSize: 9, fill: 'var(--fg-mute)' }}>{t}</text></g>
            ))}
            <text x="220" y="270" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--amber)' }}>INSERT em página cheia → page split</text>
            <text x="220" y="306" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--green)' }}>leitura: 3 page reads (O(log n)) ✓</text>
            <line x1="450" y1="50" x2="450" y2="360" stroke="rgba(255,255,255,.1)" strokeDasharray="3 3"/>
            <text x="660" y="28" textAnchor="middle" style={{ ...svgHStyle, fill: 'var(--green)', fontSize: 14 }}>LSM-TREE (Cassandra, RocksDB)</text>
            <text x="660" y="46" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-dim)' }}>append-only • escrita rápida</text>
            <rect x="500" y="65" width="320" height="40" fill="rgba(168,85,247,.06)" stroke="var(--violet)" strokeWidth="1.5" rx="4"/>
            <text x="660" y="80" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--violet)' }}>MEMTABLE (RAM, sorted)</text>
            <text x="660" y="98" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-mute)' }}>[10, 25, 30, 47, 60]</text>
            <path d="M 660 110 L 660 130" stroke="var(--violet)" strokeWidth="1.5" fill="none"/><text x="690" y="124" style={{ ...svgTextStyle, fontSize: 9, fill: 'var(--violet)' }}>flush</text>
            <rect x="500" y="135" width="100" height="30" fill="rgba(34,197,94,.06)" stroke="var(--green)" rx="4"/><text x="550" y="154" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--green)' }}>SST L0a</text>
            <rect x="610" y="135" width="100" height="30" fill="rgba(34,197,94,.06)" stroke="var(--green)" rx="4"/><text x="660" y="154" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--green)' }}>SST L0b</text>
            <rect x="720" y="135" width="100" height="30" fill="rgba(34,197,94,.06)" stroke="var(--green)" rx="4"/><text x="770" y="154" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--green)' }}>SST L0c</text>
            <path d="M 660 168 L 660 195" stroke="var(--amber)" strokeWidth="1.5" fill="none"/><text x="700" y="184" style={{ ...svgTextStyle, fontSize: 9, fill: 'var(--amber)' }}>compaction</text>
            <rect x="510" y="200" width="300" height="30" fill="rgba(34,197,94,.06)" stroke="var(--green)" rx="4"/><text x="660" y="219" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--green)' }}>SST L1 (merged + dedup)</text>
            <rect x="490" y="240" width="340" height="22" fill="rgba(34,197,94,.04)" stroke="var(--green)" rx="4" opacity=".7"/><text x="660" y="255" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--green)' }}>SST L2 (maior, mais antigo)</text>
            <text x="660" y="290" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--scarlet)' }}>write amp ALTA (compaction)</text>
            <text x="660" y="306" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--green)' }}>writes sequenciais (rapidissimo) ✓</text>
            <text x="660" y="322" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-mute)' }}>bloom filter mitiga leitura</text>
          </svg>
        )}
        {cardInfo('<strong>Regra de bolso:</strong> read-heavy + dados que mudam em lugares aleatorios → B-tree. Write-heavy + time-séries ou logs → LSM.')}
        {explain('<strong>B-tree</strong> e in-place: cada UPDATE reescreve a página onde a chave mora. Bom pra leitura (3-4 IOs até o leaf). <strong>LSM</strong> nunca escreve in-place: tudo vai pra um <code>memtable</code> em RAM e, quando enche, flusha pra um SSTable imutável. Isso da escritas <strong>sequenciais</strong>. O preco e <strong>write amplification</strong> durante compaction. Bloom filters ajudam a pular SSTables sem a chave.')}
      </div>

      {/* ===== 05 TLS ===== */}
      <div className="card concept" id="tls-handshake" style={sBox('tls')}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 18, marginBottom: 6, flexWrap: 'wrap' }}>
          <div>
            <h2>05. TLS Handshake</h2>
            <p style={{ color: 'var(--fg-mute)', fontSize: 14, marginBottom: 0 }}>A dancinha entre cliente e servidor pra concordar numa chave secreta sem ninguem no meio descobrir.</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="tag p1">P1</span>
            <button className="btn" onClick={() => speak(EXPLANATIONS['tls-handshake'])}>ouvir</button>
          </div>
        </div>
        {svgWrap(
          <svg viewBox="0 0 880 480" style={{ width: '100%', maxWidth: '100%', height: 'auto', display: 'block' }} xmlns="http://www.w3.org/2000/svg">
            <text x="170" y="30" style={{ ...svgHStyle, fill: 'var(--fg)', fontSize: 14 }} textAnchor="middle">CLIENTE</text>
            <text x="710" y="30" style={{ ...svgHStyle, fill: 'var(--fg)', fontSize: 14 }} textAnchor="middle">SERVIDOR</text>
            <line x1="170" y1="50" x2="170" y2="450" stroke="var(--blue)" strokeWidth="2"/>
            <line x1="710" y1="50" x2="710" y2="450" stroke="var(--green)" strokeWidth="2"/>
            {[
              [80, '1. ClientHello (versions, ciphers, random)', true, 1],
              [130, '2. ServerHello + Certificate + KeyShare + Random', false, 2],
              [220, '4. ClientKeyShare + ChangeCipherSpec + Finished', true, 4],
              [270, '5. Finished (HMAC do handshake)', false, 5],
            ].map(([y, label, leftToRight, step]: any) => (
              <g key={step} style={{ cursor: 'pointer' }} onClick={() => setTlsInfo(TLS_INFO[step] || '')}>
                <line x1={leftToRight ? 170 : 710} y1={y} x2={leftToRight ? 710 : 170} y2={y} stroke="var(--scarlet)" strokeWidth="1.5"/>
                <polygon points={leftToRight ? `710,${y} 700,${y-5} 700,${y+5}` : `170,${y} 180,${y-5} 180,${y+5}`} fill="var(--scarlet)"/>
                <rect x="280" y={y-18} width={step === 2 ? 400 : 320} height="22" fill="var(--bg-card)" stroke="rgba(239,68,68,.3)" rx="4"/>
                <text x="440" y={y-2} textAnchor="middle" style={{ ...svgTextStyle, fontSize: 11, fill: 'var(--scarlet)' }}>{label}</text>
              </g>
            ))}
            <g style={{ cursor: 'pointer' }} onClick={() => setTlsInfo(TLS_INFO[3] || '')}>
              <rect x="50" y="155" width="240" height="38" fill="rgba(59,130,246,.05)" stroke="var(--blue)" rx="4"/>
              <text x="170" y="172" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--blue)' }}>3. válida cert na CA chain</text>
              <text x="170" y="186" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--blue)' }}>deriva shared secret (ECDHE)</text>
            </g>
            <g style={{ cursor: 'pointer' }} onClick={() => setTlsInfo(TLS_INFO[6] || '')}>
              <line x1="170" y1="330" x2="710" y2="330" stroke="var(--green)" strokeWidth="2"/>
              <polygon points="710,330 700,325 700,335" fill="var(--green)"/>
              <line x1="710" y1="360" x2="170" y2="360" stroke="var(--green)" strokeWidth="2"/>
              <polygon points="170,360 180,355 180,365" fill="var(--green)"/>
              <rect x="280" y="305" width="320" height="22" fill="rgba(34,197,94,.08)" stroke="var(--green)" rx="4"/>
              <text x="440" y="321" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 11, fill: 'var(--green)' }}>6. Application Data (cifrado AES-GCM)</text>
            </g>
            <rect x="100" y="400" width="680" height="40" fill="rgba(239,68,68,.04)" stroke="rgba(239,68,68,.3)" rx="6"/>
            <text x="440" y="420" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 11, fill: 'var(--scarlet)' }}>TLS 1.3: 1-RTT (vs 2-RTT do TLS 1.2). 0-RTT com session ticket no resume.</text>
            <text x="440" y="434" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-dim)' }}>PFS via ECDHE • AEAD ciphers obrigatorias • RSA key exchange removido</text>
          </svg>
        )}
        {cardInfo(tlsInfo)}
        {explain('O TLS handshake resolve dois problemas: <strong>autenticar</strong> que você realmente está falando com o servidor e <strong>derivar uma chave simétrica</strong> compartilhada sem expor segredo. Em TLS 1.3 isso virou <code>1-RTT</code>. <strong>PFS (Perfect Forward Secrecy)</strong> garante que mesmo se a chave privada do servidor vazar amanhã, sessões antigas continuam ilegíveis — cada handshake usa keypair efemero.')}
      </div>

      {/* ===== 06 HTTP versions ===== */}
      <div className="card concept" id="http-versions" style={sBox('http')}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 18, marginBottom: 6, flexWrap: 'wrap' }}>
          <div>
            <h2>06. HTTP/1.1 vs HTTP/2 vs HTTP/3</h2>
            <p style={{ color: 'var(--fg-mute)', fontSize: 14, marginBottom: 0 }}>A evolucao do head-of-line blocking.</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="tag p2">P2</span>
            <button className="btn" onClick={() => speak(EXPLANATIONS['http-versions'])}>ouvir</button>
          </div>
        </div>
        {svgWrap(
          <svg viewBox="0 0 880 360" style={{ width: '100%', maxWidth: '100%', height: 'auto', display: 'block' }} xmlns="http://www.w3.org/2000/svg">
            <text x="146" y="28" textAnchor="middle" style={{ ...svgHStyle, fill: 'var(--scarlet)', fontSize: 13 }}>HTTP/1.1</text>
            <text x="146" y="46" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 9, fill: 'var(--fg-dim)' }}>1 conexão TCP por request</text>
            <line x1="40" y1="80" x2="252" y2="80" stroke="var(--fg-dim)" strokeWidth="1.5"/>
            {([[50,90,'conn 1',1],[100,90,null,.6],[150,90,null,.4],[50,125,'conn 2',.7],[100,125,null,.4],[50,160,'conn 3',.5]] as [number,number,string|null,number][]).map(([x,y,lbl,op],i)=>(
              <g key={i}>
                {lbl && <text x="20" y={y+10} style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-dim)' }}>{lbl}</text>}
                <rect x={x} y={y} width="40" height="14" fill={`rgba(239,68,68,${op})`} rx="2"/>
              </g>
            ))}
            <text x="146" y="220" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-mute)' }}>HOL no nível de aplicação</text>
            <text x="146" y="236" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-mute)' }}>browser limita 6 conn/host</text>
            <line x1="290" y1="20" x2="290" y2="340" stroke="rgba(255,255,255,.1)" strokeDasharray="3 3"/>
            <text x="436" y="28" textAnchor="middle" style={{ ...svgHStyle, fill: 'var(--amber)', fontSize: 13 }}>HTTP/2</text>
            <text x="436" y="46" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 9, fill: 'var(--fg-dim)' }}>multiplexing em 1 conexão TCP</text>
            <line x1="320" y1="100" x2="552" y2="100" stroke="var(--fg-dim)" strokeWidth="1.5"/>
            <text x="304" y="120" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-dim)' }}>1 TCP</text>
            {[['var(--blue)',330],['var(--violet)',354],['var(--green)',378],['var(--blue)',402],['var(--amber)',426],['var(--violet)',450],['var(--green)',474]].map(([c,x],i)=>(
              <rect key={i} x={x} y="110" width="20" height="12" fill={c as string} rx="2"/>
            ))}
            <text x="436" y="160" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-mute)' }}>streams paralelos, HPACK</text>
            <text x="436" y="220" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--scarlet)' }}>HOL no TCP ainda existe!</text>
            <line x1="580" y1="20" x2="580" y2="340" stroke="rgba(255,255,255,.1)" strokeDasharray="3 3"/>
            <text x="730" y="28" textAnchor="middle" style={{ ...svgHStyle, fill: 'var(--green)', fontSize: 13 }}>HTTP/3 (QUIC sobre UDP)</text>
            <text x="730" y="46" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 9, fill: 'var(--fg-dim)' }}>multiplexing real, sem HOL no transporte</text>
            <line x1="610" y1="100" x2="850" y2="100" stroke="var(--fg-dim)" strokeWidth="1.5"/>
            <text x="592" y="120" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-dim)' }}>1 UDP</text>
            {[['var(--blue)',620],['var(--violet)',644],['var(--green)',668],['var(--blue)',692,true],['var(--amber)',716],['var(--violet)',740],['var(--green)',764]].map(([c,x,dashed],i)=>(
              <rect key={i} x={x as number} y="110" width="20" height="12" fill={c as string} rx="2" stroke={dashed ? 'var(--scarlet)' : 'none'} strokeDasharray={dashed ? '2 2' : undefined}/>
            ))}
            <text x="730" y="160" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--green)' }}>streams independentes ✓</text>
            <text x="730" y="176" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-mute)' }}>handshake QUIC + TLS 1.3 = 0-RTT</text>
            <rect x="40" y="290" width="800" height="50" fill="rgba(34,197,94,.04)" stroke="var(--green)" rx="6"/>
            <text x="60" y="310" style={{ ...svgTextStyle, fontSize: 11, fill: 'var(--fg)', fontWeight: 700 }}>Tradeoff:</text>
            <text x="60" y="328" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-mute)' }}>H1.1 simples • H2 acelera mas TCP HOL te machuca em redes ruins • H3 resolve mas precisa UDP open</text>
          </svg>
        )}
        {explain('Cada versão tenta matar o <strong>head-of-line blocking</strong>. HTTP/1.1 trava no nível da aplicação. HTTP/2 multiplexa, mas como tudo passa por 1 socket TCP, perda de pacote trava todo mundo. HTTP/3 mudou pra UDP e implementa controle de fluxo em user space. Bonus do QUIC: <code>connection ID</code> independe de IP — você migra de wifi pra 4G sem dropar a conexão.')}
      </div>

      {/* ===== 07 RAG ===== */}
      <div className="card concept" id="rag" style={sBox('rag')}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 18, marginBottom: 6, flexWrap: 'wrap' }}>
          <div>
            <h2>07. RAG Pipeline</h2>
            <p style={{ color: 'var(--fg-mute)', fontSize: 14, marginBottom: 0 }}>Como dar memória pro LLM sem retreinar — busca semantica + prompt augmentation.</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="tag p1">P1</span>
            <button className="btn" onClick={() => speak(EXPLANATIONS['rag'])}>ouvir</button>
          </div>
        </div>
        {svgWrap(
          <svg viewBox="0 0 880 280" style={{ width: '100%', maxWidth: '100%', height: 'auto', display: 'block' }} xmlns="http://www.w3.org/2000/svg">
            {[
              {x:20,y:100,w:110,c:'var(--scarlet)',title:'Query',sub:'"como voar?"',idx:0},
              {x:170,y:100,w:110,c:'var(--blue)',title:'Embed',sub:'[0.21, -0.4...]',idx:1},
              {x:320,y:100,w:120,c:'var(--violet)',title:'Vector DB',sub:'top-K kNN',idx:2},
              {x:480,y:100,w:110,c:'var(--amber)',title:'Rerank',sub:'cross-encoder',idx:3},
              {x:630,y:100,w:110,c:'var(--green)',title:'Augment',sub:'build prompt',idx:4},
              {x:780,y:100,w:80,c:'var(--scarlet)',title:'LLM',sub:'resposta',idx:5},
            ].map(({x,y,w,c,title,sub,idx}) => (
              <g key={idx} style={{ cursor: 'pointer' }} onClick={() => setRagActive(ragActive === idx ? null : idx)}>
                <rect x={x} y={y} width={w} height="60" style={svgBoxStyle} rx="8" stroke={ragActive === idx ? 'var(--scarlet)' : c} strokeWidth={ragActive === idx ? 2 : 1}/>
                <text x={x+w/2} y={y+25} textAnchor="middle" style={{ ...svgHStyle, fill: 'var(--fg)', fontSize: 11 }}>{title}</text>
                <text x={x+w/2} y={y+43} textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-mute)' }}>{sub}</text>
              </g>
            ))}
            {[[130,130,165,130],[280,130,315,130],[440,130,475,130],[590,130,625,130],[740,130,775,130]].map(([x1,y1,x2,y2],i)=>(
              <g key={i}><path d={`M ${x1} ${y1} L ${x2} ${y2}`} stroke="var(--fg-dim)" strokeWidth="1.5" fill="none"/><polygon points={`${x2},${y2} ${x2-7},${y2-3} ${x2-7},${y2+3}`} fill="var(--fg-dim)"/></g>
            ))}
            <text x="380" y="40" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 11, fill: 'var(--fg-dim)' }}>— pipeline offline (indexacao) —</text>
            <rect x="170" y="50" width="100" height="32" fill="rgba(168,85,247,.05)" stroke="var(--violet)" rx="4"/>
            <text x="220" y="70" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--violet)' }}>docs → chunks</text>
            <path d="M 270 66 L 310 78" stroke="var(--violet)" strokeWidth="1.5" fill="none"/>
            <rect x="320" y="50" width="120" height="32" fill="rgba(168,85,247,.05)" stroke="var(--violet)" rx="4"/>
            <text x="380" y="70" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--violet)' }}>embed e indexa</text>
            <path d="M 380 82 L 380 100" stroke="var(--violet)" strokeWidth="1.5" fill="none"/>
            <text x="440" y="220" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 11, fill: 'var(--fg)' }}>Clique em cada caixa pra abrir o detalhe</text>
          </svg>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
          {[
            {idx:0,title:'Query',body:'Pergunta do usuário chega em texto natural. Pode ser reescrita (HyDE, query expansion) antes de seguir.'},
            {idx:1,title:'Embed',body:'Modelo de embedding transforma texto em vetor de 768/1536/3072 dims. Mesmo modelo usado offline pra indexar precisa ser usado online pra buscar.'},
            {idx:2,title:'Vector DB — kNN',body:'Busca top-K vetores mais próximos por cosine/dot. ANN (HNSW, IVF) trocando recall por latência. Pinecone, pgvector, Qdrant, Chroma.'},
            {idx:3,title:'Rerank',body:'Cross-encoder reordena os candidatos com modelo mais caro mas mais preciso. K=50 → top 5. Faz diferença real em qualidade.'},
            {idx:4,title:'Augment',body:'Monta prompt: system + contexto recuperado + pergunta. Cuidado com lost in the middle e tokens.'},
            {idx:5,title:'LLM',body:'Geracao final com citation. Considere streaming, fallback se nada relevante, e logging pra avaliação.'},
          ].map(({idx,title,body}) => (
            <div key={idx}
              onClick={() => setRagActive(ragActive === idx ? null : idx)}
              style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '12px 16px', background: ragActive === idx ? 'rgba(239,68,68,.05)' : 'var(--bg-card-2)', border: `1px solid ${ragActive === idx ? 'var(--scarlet)' : 'var(--line)'}`, borderRadius: 8, cursor: 'pointer', transition: 'all .15s' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: ragActive === idx ? 'var(--scarlet)' : 'rgba(239,68,68,.15)', color: ragActive === idx ? '#fff' : 'var(--scarlet)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{idx+1}</div>
              <div><h5 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, marginBottom: 4 }}>{title}</h5><p style={{ fontSize: 12.5, color: 'var(--fg-mute)', lineHeight: 1.55 }}>{body}</p></div>
            </div>
          ))}
        </div>
        {explain('RAG (<strong>Retrieval-Augmented Generation</strong>) e o jeito padrão de injetar conhecimento privado num LLM sem fine-tuning. As pegadinhas reais: <strong>chunking</strong> (muito grande perde precisão, muito pequeno perde contexto), <strong>recall ruim</strong> (use rerank!), <strong>lost in the middle</strong> (LLM ignora meio do contexto).')}
      </div>

      {/* ===== 08 CIRCUIT BREAKER ===== */}
      <div className="card concept" id="circuit-breaker" style={sBox('cb')}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 18, marginBottom: 6, flexWrap: 'wrap' }}>
          <div>
            <h2>08. Circuit Breaker</h2>
            <p style={{ color: 'var(--fg-mute)', fontSize: 14, marginBottom: 0 }}>Pare de mandar request pra um serviço que já sabemos que ta caido.</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="tag p1">P1</span>
            <button className="btn" onClick={() => speak(EXPLANATIONS['circuit-breaker'])}>ouvir</button>
          </div>
        </div>
        {svgWrap(
          <svg viewBox="0 0 880 360" style={{ width: '100%', maxWidth: '100%', height: 'auto', display: 'block' }} xmlns="http://www.w3.org/2000/svg">
            <circle cx="170" cy="150" r="64" fill="rgba(34,197,94,.08)" stroke={cbState==='CLOSED'?'var(--green)':'rgba(34,197,94,.4)'} strokeWidth={cbState==='CLOSED'?2.5:1.5}/>
            <text x="170" y="148" textAnchor="middle" style={{ ...svgHStyle, fill: 'var(--green)', fontSize: 14 }}>CLOSED</text>
            <text x="170" y="166" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-mute)' }}>deixa passar</text>
            <circle cx="710" cy="150" r="64" fill="rgba(239,68,68,.08)" stroke={cbState==='OPEN'?'var(--scarlet)':'rgba(239,68,68,.4)'} strokeWidth={cbState==='OPEN'?2.5:1.5}/>
            <text x="710" y="148" textAnchor="middle" style={{ ...svgHStyle, fill: 'var(--scarlet)', fontSize: 14 }}>OPEN</text>
            <text x="710" y="166" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-mute)' }}>fail fast</text>
            <circle cx="440" cy="150" r="64" fill="rgba(234,179,8,.08)" stroke={cbState==='HALF-OPEN'?'var(--amber)':'rgba(234,179,8,.4)'} strokeWidth={cbState==='HALF-OPEN'?2.5:1.5}/>
            <text x="440" y="146" textAnchor="middle" style={{ ...svgHStyle, fill: 'var(--amber)', fontSize: 13 }}>HALF-OPEN</text>
            <text x="440" y="164" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-mute)' }}>trial run</text>
            <path d="M 234 130 Q 320 60 440 95" stroke="var(--scarlet)" strokeWidth="2" fill="none"/>
            <polygon points="438,95 432,90 432,100" fill="var(--scarlet)"/>
            <text x="320" y="64" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--scarlet)' }}>N falhas em janela</text>
            <path d="M 504 130 Q 580 60 670 95" stroke="var(--scarlet)" strokeWidth="2" fill="none"/>
            <polygon points="668,95 662,90 662,100" fill="var(--scarlet)"/>
            <text x="590" y="64" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--scarlet)' }}>trial falhou</text>
            <path d="M 646 165 Q 580 240 504 195" stroke="var(--green)" strokeWidth="2" fill="none"/>
            <polygon points="506,196 514,192 510,202" fill="var(--green)"/>
            <text x="585" y="232" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--amber)' }}>timeout passou</text>
            <path d="M 376 175 Q 290 240 230 200" stroke="var(--green)" strokeWidth="2" fill="none"/>
            <polygon points="232,200 238,196 234,206" fill="var(--green)"/>
            <text x="310" y="232" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--green)' }}>trial ok</text>
            {[
              {x:30,y:270,c:'var(--green)',title:'CLOSED',lines:['requests passam normalmente','conta falhas em sliding window','se erro_pct > threshold → OPEN']},
              {x:305,y:270,c:'var(--amber)',title:'HALF-OPEN',lines:['deixa N requests trial passarem','todos ok? volta CLOSED','algum falhou? volta OPEN']},
              {x:580,y:270,c:'var(--scarlet)',title:'OPEN',lines:['rejeita request sem chamar','retorna fallback ou erro 503','após timeout → HALF-OPEN']},
            ].map(({x,y,c,title,lines})=>(
              <g key={title}>
                <rect x={x} y={y} width="270" height="80" fill={`rgba(0,0,0,.2)`} stroke={c} rx="6"/>
                <text x={x+135} y={y+20} textAnchor="middle" style={{ ...svgHStyle, fill: c, fontSize: 11 }}>{title}</text>
                {lines.map((l,i)=><text key={i} x={x+20} y={y+36+i*14} style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-mute)' }}>{l}</text>)}
              </g>
            ))}
          </svg>
        )}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          <button className="btn" onClick={() => cbSimulate('ok')}>request OK</button>
          <button className="btn" onClick={() => cbSimulate('fail')}>request FALHA</button>
          <button className="btn" onClick={() => cbSimulate('timeout')}>avancar timeout</button>
          <button className="btn ghost" onClick={() => { setCbState('CLOSED'); setCbFail(0); setCbInfo('Use os botões pra simular.') }}>reset</button>
          <span style={{ display: 'inline-block', padding: '6px 12px', background: 'var(--bg-elev)', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--fg-mute)', borderRadius: 6 }}>
            estado: <strong>{cbState}</strong> · falhas: {cbFail}/3
          </span>
        </div>
        {cardInfo(cbInfo)}
        {explain('Circuit breaker evita o cenario clássico de cascading failure: serviço downstream caiu, cada request trava no timeout, sua thread pool esgota. A maquina de 3 estados — <code>CLOSED → OPEN → HALF-OPEN → CLOSED</code> — desacopla o caller do callee. Combinado com <strong>bulkheads</strong>, <strong>timeout</strong> agressivo e <strong>fallback</strong> sensato, te da resiliencia.')}
      </div>

      {/* ===== 09 CONSISTENT HASHING ===== */}
      <div className="card concept" id="consistent-hashing" style={sBox('ch')}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 18, marginBottom: 6, flexWrap: 'wrap' }}>
          <div>
            <h2>09. Consistent Hashing</h2>
            <p style={{ color: 'var(--fg-mute)', fontSize: 14, marginBottom: 0 }}>Adicionar/remover servidor sem reorganizar 100% das chaves.</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="tag p2">P2</span>
            <button className="btn" onClick={() => speak(EXPLANATIONS['consistent-hashing'])}>ouvir</button>
          </div>
        </div>
        {svgWrap(
          <svg viewBox="0 0 880 440" style={{ width: '100%', maxWidth: '100%', height: 'auto', display: 'block' }} xmlns="http://www.w3.org/2000/svg">
            <circle cx={CH_CX} cy={CH_CY} r={CH_R} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="2" strokeDasharray="3 3"/>
            <text x={CH_CX} y="36" textAnchor="middle" style={{ ...svgHStyle, fill: 'var(--scarlet)', fontSize: 12 }}>hash ring (0 - 2^32)</text>
            {chNodes.map((n, i) => {
              const r = (n.angle - 90) * Math.PI / 180
              const x = CH_CX + CH_R * Math.cos(r)
              const y = CH_CY + CH_R * Math.sin(r)
              const color = CH_COLORS[i % CH_COLORS.length]
              const lx = CH_CX + (CH_R + 26) * Math.cos(r)
              const ly = CH_CY + (CH_R + 26) * Math.sin(r) + 4
              return (
                <g key={n.name}>
                  <circle cx={x} cy={y} r="14" fill={color} stroke="var(--bg)" strokeWidth="3"/>
                  <text x={x} y={y+5} textAnchor="middle" style={{ ...svgTextStyle, fontSize: 12, fontWeight: 700, fill: '#fff' }}>{n.name}</text>
                  <text x={lx} y={ly} textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: color }}>node {n.name}</text>
                </g>
              )
            })}
            {chKeys.map((k) => {
              const r = (k.angle - 90) * Math.PI / 180
              const x = CH_CX + (CH_R - 24) * Math.cos(r)
              const y = CH_CY + (CH_R - 24) * Math.sin(r)
              const owner = chOwner(k.angle, chNodes)
              const ownerIdx = chNodes.findIndex(n => n.name === owner.name)
              const color = CH_COLORS[ownerIdx % CH_COLORS.length]
              const ownerR = (owner.angle - 90) * Math.PI / 180
              const ox = CH_CX + CH_R * Math.cos(ownerR)
              const oy = CH_CY + CH_R * Math.sin(ownerR)
              return (
                <g key={k.label}>
                  <circle cx={x} cy={y} r="6" fill={color} opacity=".9"/>
                  <text x={x} y={y-10} textAnchor="middle" style={{ ...svgTextStyle, fontSize: 9, fill: color }}>{k.label}</text>
                  <line x1={x} y1={y} x2={ox} y2={oy} stroke={color} strokeWidth="1" opacity=".4" strokeDasharray="2 3"/>
                </g>
              )
            })}
            <rect x="40" y="370" width="800" height="56" fill="var(--bg-elev)" stroke="var(--line)" rx="6"/>
            <text x="60" y="390" style={{ ...svgTextStyle, fontSize: 11, fill: 'var(--fg)', fontWeight: 700 }}>como funciona:</text>
            <text x="60" y="408" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-mute)' }}>cada chave hash(K) cai num ponto do ring → vai pro próximo no no sentido horario</text>
            <text x="60" y="422" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-mute)' }}>add/remove nó afeta só as chaves entre o nó anterior e o novo (≈ 1/N reshuffle)</text>
          </svg>
        )}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          <button className="btn" onClick={chAddNode}>+ add node</button>
          <button className="btn" onClick={chRemoveNode}>− remove node</button>
          <button className="btn" onClick={chAddKey}>+ add key</button>
          <button className="btn ghost" onClick={chReset}>reset</button>
          <span style={{ display: 'inline-block', padding: '6px 12px', background: 'var(--bg-elev)', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--fg-mute)', borderRadius: 6 }}>nos: {chNodes.length} · chaves: {chKeys.length}</span>
        </div>
        {cardInfo(chInfo)}
        {explain('Hash modular ingênuo (<code>node = hash(k) % N</code>) é um pesadelo: muda N de 4 pra 5 e <strong>quase 100% das chaves</strong> trocam de nó. Consistent hashing mapeia tanto nos quanto chaves no mesmo anel circular. Adicionar um nó afeta apenas <strong>1/N</strong> das chaves. <strong>Virtual nodes</strong> — cada servidor físico tem 100-200 pontos no ring — distribuem a carga melhor.')}
      </div>

      {/* ===== 10 OSI ===== */}
      <div className="card concept" id="osi" style={sBox('osi')}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 18, marginBottom: 6, flexWrap: 'wrap' }}>
          <div>
            <h2>10. OSI / TCP-IP Layers</h2>
            <p style={{ color: 'var(--fg-mute)', fontSize: 14, marginBottom: 0 }}>O mapa quando o entrevistador pergunta "o que acontece quando você digita google.com".</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="tag p2">P2</span>
            <button className="btn" onClick={() => speak(EXPLANATIONS['osi'])}>ouvir</button>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            {n:7,name:'Application',desc:'aplicações — onde seu código mora',proto:'HTTP, gRPC, DNS, SMTP',info:'L7: HTTP, gRPC, DNS, SMTP. Aplicações falando umas com as outras. E aqui que mora seu código. Cookies, headers, JSON.'},
            {n:6,name:'Presentation',desc:'serializa, comprime, criptografa',proto:'TLS, JSON, protobuf',info:'L6: serialização e cripto. Dados viram JSON, protobuf, ASCII. TLS no modelo clássico. Compressao gzip.'},
            {n:5,name:'Session',desc:'gerencia sessão entre apps',proto:'NetBIOS, RPC',info:'L5: gerencia sessões. Em prática, quase não aparece — TCP já faz a maior parte.'},
            {n:4,name:'Transport',desc:'end-to-end, portas, confiabilidade',proto:'TCP, UDP, QUIC',info:'L4: end-to-end. TCP da entrega confiável ordenada. UDP não da garantia mas e rápido. QUIC sentou aqui. Porta = endereco do processo.'},
            {n:3,name:'Network',desc:'roteia entre redes diferentes',proto:'IP, ICMP, BGP',info:'L3: roteamento. IP escolhe caminho entre redes diferentes. Routers operam aqui. ICMP (ping) e L3.'},
            {n:2,name:'Data Link',desc:'frames entre nodes do mesmo link',proto:'Ethernet, ARP, MAC',info:'L2: enderecamento dentro do mesmo segmento. MAC address. Switch e device L2. ARP traduz IP→MAC.'},
            {n:1,name:'Physical',desc:'bits virando sinal eletrico/luz',proto:'cabo, fibra, wifi',info:'L1: bits viram sinal. Cabo, ondas wifi, fibra. Voltagens, frequências, modulacao.'},
          ].map(layer => (
            <div key={layer.n}
              onClick={() => { setOsiInfo(layer.info); setOsiActive(layer.n) }}
              style={{ display: 'grid', gridTemplateColumns: '50px 1.2fr 2fr 1.2fr', gap: 12, alignItems: 'center', padding: '10px 14px', background: osiActive === layer.n ? 'rgba(239,68,68,.06)' : 'var(--bg-card-2)', border: `1px solid ${osiActive === layer.n ? 'var(--scarlet)' : 'var(--line)'}`, borderRadius: 8, cursor: 'pointer', transition: 'all .15s', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>
              <div style={{ textAlign: 'center', color: 'var(--scarlet)', fontWeight: 700, fontSize: 14 }}>L{layer.n}</div>
              <div style={{ color: 'var(--fg)', fontWeight: 600 }}>{layer.name}</div>
              <div style={{ color: 'var(--fg-mute)', fontSize: 11.5 }}>{layer.desc}</div>
              <div style={{ color: 'var(--blue)', fontSize: 11 }}>{layer.proto}</div>
            </div>
          ))}
        </div>
        {cardInfo(osiInfo)}
        {explain('OSI tem 7 camadas no modelo teorico. <strong>TCP/IP real</strong> agrupa em 4. A regra mental: cada camada de baixo encapsula a de cima — HTTP virou bytes, bytes viraram TCP segments, segments viraram IP packets. Saber em qual camada cada problema acontece (timeout = L4, certificado errado = L6, 500 = L7) diferencia debugging amador de profissional.')}
      </div>

      {/* ===== 11 CQRS ===== */}
      <div className="card concept" id="cqrs" style={sBox('cqrs')}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 18, marginBottom: 6, flexWrap: 'wrap' }}>
          <div>
            <h2>11. CQRS + Event Sourcing</h2>
            <p style={{ color: 'var(--fg-mute)', fontSize: 14, marginBottom: 0 }}>Separa command (escrita) de query (leitura), e em vez de salvar estado, salva os eventos.</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="tag p1">P1</span>
            <button className="btn" onClick={() => speak(EXPLANATIONS['cqrs'])}>ouvir</button>
          </div>
        </div>
        {svgWrap(
          <svg viewBox="0 0 880 400" style={{ width: '100%', maxWidth: '100%', height: 'auto', display: 'block' }} xmlns="http://www.w3.org/2000/svg">
            <rect x="30" y="170" width="100" height="60" style={svgBoxStyle} rx="8"/>
            <text x="80" y="200" textAnchor="middle" style={{ ...svgHStyle, fill: 'var(--fg)', fontSize: 13 }}>Client</text>
            <text x="80" y="218" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-mute)' }}>UI / API</text>
            <path d="M 130 185 L 250 110" stroke="var(--scarlet)" strokeWidth="2" fill="none"/>
            <polygon points="250,110 242,109 246,118" fill="var(--scarlet)"/>
            <text x="190" y="135" style={{ ...svgTextStyle, fontSize: 11, fill: 'var(--scarlet)' }}>Command</text>
            <path d="M 250 290 L 130 215" stroke="var(--green)" strokeWidth="2" fill="none"/>
            <polygon points="130,215 138,214 134,224" fill="var(--green)"/>
            <text x="184" y="270" style={{ ...svgTextStyle, fontSize: 11, fill: 'var(--green)' }}>Query response</text>
            <rect x="250" y="60" width="170" height="80" fill="rgba(239,68,68,.05)" stroke="var(--scarlet)" rx="8"/>
            <text x="335" y="84" textAnchor="middle" style={{ ...svgHStyle, fill: 'var(--scarlet)', fontSize: 13 }}>COMMAND SIDE</text>
            <text x="335" y="104" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-mute)' }}>aggregate válida</text>
            <text x="335" y="120" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-mute)' }}>aplica regras de negocio</text>
            <text x="335" y="134" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-mute)' }}>emite event</text>
            <path d="M 420 100 L 470 100" stroke="var(--scarlet)" strokeWidth="1.5" fill="none"/>
            <polygon points="470,100 462,96 462,104" fill="var(--scarlet)"/>
            <rect x="470" y="60" width="180" height="80" fill="rgba(168,85,247,.05)" stroke="var(--violet)" rx="8"/>
            <text x="560" y="84" textAnchor="middle" style={{ ...svgHStyle, fill: 'var(--violet)', fontSize: 13 }}>EVENT STORE</text>
            <text x="560" y="102" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-mute)' }}>[Created, Renamed,</text>
            <text x="560" y="116" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-mute)' }}>Activated, Deactivated...]</text>
            <text x="560" y="130" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-mute)' }}>append-only • imutável</text>
            <path d="M 560 140 L 560 175 L 380 175 L 380 140" stroke="var(--violet)" strokeWidth="1.5" fill="none" strokeDasharray="3 3"/>
            <text x="430" y="170" style={{ ...svgTextStyle, fontSize: 9, fill: 'var(--violet)' }}>replay → aggregate state</text>
            <path d="M 650 100 L 700 100" stroke="var(--violet)" strokeWidth="1.5" fill="none"/>
            <polygon points="700,100 692,96 692,104" fill="var(--violet)"/>
            <rect x="700" y="60" width="160" height="80" fill="rgba(59,130,246,.05)" stroke="var(--blue)" rx="8"/>
            <text x="780" y="84" textAnchor="middle" style={{ ...svgHStyle, fill: 'var(--blue)', fontSize: 12 }}>PROJECTOR</text>
            <text x="780" y="104" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-mute)' }}>consome eventos</text>
            <text x="780" y="118" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-mute)' }}>atualiza read models</text>
            <text x="780" y="132" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-mute)' }}>async, eventually consistent</text>
            <path d="M 780 140 L 780 200" stroke="var(--blue)" strokeWidth="1.5" fill="none"/>
            <polygon points="780,200 776,192 784,192" fill="var(--blue)"/>
            <rect x="630" y="200" width="100" height="50" fill="rgba(34,197,94,.05)" stroke="var(--green)" rx="6"/>
            <text x="680" y="220" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 11, fill: 'var(--green)' }}>Read Model 1</text>
            <text x="680" y="236" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 9, fill: 'var(--fg-mute)' }}>Postgres view</text>
            <rect x="745" y="200" width="100" height="50" fill="rgba(34,197,94,.05)" stroke="var(--green)" rx="6"/>
            <text x="795" y="220" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 11, fill: 'var(--green)' }}>Read Model 2</text>
            <text x="795" y="236" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 9, fill: 'var(--fg-mute)' }}>Elasticsearch</text>
            <path d="M 250 320 L 700 320" stroke="var(--green)" strokeWidth="1.5" fill="none"/>
            <polygon points="250,320 258,316 258,324" fill="var(--green)"/>
            <path d="M 700 320 L 700 250" stroke="var(--green)" strokeWidth="1.5" fill="none"/>
            <rect x="250" y="270" width="220" height="80" fill="rgba(34,197,94,.05)" stroke="var(--green)" rx="8"/>
            <text x="360" y="294" textAnchor="middle" style={{ ...svgHStyle, fill: 'var(--green)', fontSize: 13 }}>QUERY SIDE</text>
            <text x="360" y="312" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-mute)' }}>le do read model otimizado</text>
            <text x="360" y="326" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-mute)' }}>scaling independente</text>
            <text x="360" y="340" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-mute)' }}>denormalizado, rapidao</text>
          </svg>
        )}
        {cardInfo('<strong>Event Sourcing</strong> = source of truth é o log de eventos. <strong>CQRS</strong> = comandos vão num modelo, queries em outro. Frequentemente usados juntos, mas são independentes.')}
        {explain('<strong>CQRS</strong> separa o lado de escrita do lado de leitura. Você pode usar Postgres pra command, Elasticsearch + Redis pra query, atualizando via eventos. <strong>Event Sourcing</strong> vai mais fundo: em vez de gravar o <em>estado atual</em>, você grava cada <em>evento</em> que mudou o estado. Beneficio brutal: <strong>auditoria total</strong>, <strong>time travel</strong>. Custo: complexidade real, eventually consistent, schema evolution dos eventos e dor.')}
      </div>

      {/* ===== 12 JWT ===== */}
      <div className="card concept" id="jwt" style={sBox('jwt')}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 18, marginBottom: 6, flexWrap: 'wrap' }}>
          <div>
            <h2>12. JWT — JSON Web Token</h2>
            <p style={{ color: 'var(--fg-mute)', fontSize: 14, marginBottom: 0 }}>Three dots, three pieces — header, payload, signature. Stateless auth no formato canonico.</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="tag p2">P2</span>
            <button className="btn" onClick={() => speak(EXPLANATIONS['jwt'])}>ouvir</button>
          </div>
        </div>
        {svgWrap(
          <svg viewBox="0 0 880 200" style={{ width: '100%', maxWidth: '100%', height: 'auto', display: 'block' }} xmlns="http://www.w3.org/2000/svg">
            <text x="440" y="30" textAnchor="middle" style={{ ...svgHStyle, fill: 'var(--fg)', fontSize: 13 }}>JWT compacto (3 partes separadas por ponto)</text>
            <rect x="30" y="60" width="240" height="50" fill="rgba(239,68,68,.06)" stroke="var(--scarlet)" rx="6"/>
            <text x="150" y="80" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--scarlet)' }}>header (base64url)</text>
            <text x="150" y="100" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>eyJhbGciOiJIUzI1NiJ9</text>
            <text x="285" y="92" textAnchor="middle" style={{ ...svgHStyle, fill: 'var(--fg-dim)', fontSize: 22 }}>.</text>
            <rect x="300" y="60" width="280" height="50" fill="rgba(168,85,247,.06)" stroke="var(--violet)" rx="6"/>
            <text x="440" y="80" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--violet)' }}>payload (base64url)</text>
            <text x="440" y="100" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 11 }}>eyJzdWIiOiIxMjMiLCJleHAiOjE3MDB9</text>
            <text x="595" y="92" textAnchor="middle" style={{ ...svgHStyle, fill: 'var(--fg-dim)', fontSize: 22 }}>.</text>
            <rect x="610" y="60" width="240" height="50" fill="rgba(34,197,94,.06)" stroke="var(--green)" rx="6"/>
            <text x="730" y="80" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--green)' }}>signature (HMAC ou RSA)</text>
            <text x="730" y="100" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 11 }}>SflKxwRJSMeKKF2QT4...</text>
            <text x="440" y="150" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 11, fill: 'var(--fg)' }}>Verificação:</text>
            <text x="440" y="170" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 11, fill: 'var(--fg-mute)' }}>HMAC( base64url(header) + &quot;.&quot; + base64url(payload), <tspan fill="var(--scarlet)">secret</tspan> ) === signature ?</text>
            <text x="440" y="188" textAnchor="middle" style={{ ...svgTextStyle, fontSize: 10, fill: 'var(--fg-dim)' }}>+ válida exp, iss, aud, nbf</text>
          </svg>
        )}
        {[
          { cls: 'header', title: 'HEADER', pre: `{\n  "alg": "HS256",\n  "typ": "JWT"\n}`, color: 'var(--scarlet)', bg: 'rgba(239,68,68,.08)', border: 'rgba(239,68,68,.4)' },
          { cls: 'payload', title: 'PAYLOAD (claims)', pre: `{\n  "sub": "1234567890",\n  "name": "Daniel",\n  "iat": 1716239022,\n  "exp": 1716242622,\n  "iss": "https://auth.x",\n  "aud": "api.x"\n}`, color: 'var(--violet)', bg: 'rgba(168,85,247,.08)', border: 'rgba(168,85,247,.4)' },
          { cls: 'signature', title: 'SIGNATURE', pre: `HMACSHA256(\n  base64UrlEncode(header) + "." +\n  base64UrlEncode(payload),\n  SECRET_KEY\n)`, color: 'var(--green)', bg: 'rgba(34,197,94,.08)', border: 'rgba(34,197,94,.4)' },
        ].map(p => (
          <div key={p.cls} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, padding: '10px 14px', borderRadius: 8, border: `1px solid ${p.border}`, background: p.bg, wordBreak: 'break-all', marginBottom: 10 }}>
            <h5 style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--fg-dim)', marginBottom: 6 }}>{p.title}</h5>
            <pre style={{ marginTop: 6, fontSize: 12, color: 'var(--fg)', whiteSpace: 'pre-wrap' }}>{p.pre}</pre>
          </div>
        ))}
        {cardInfo('<strong>Atenção:</strong> payload é só base64 — <code>não é criptografado</code>. Quem tiver o token le tudo. Se precisa esconder dado, use JWE ou não bote no JWT.')}
        {explain('JWT é stateless: o servidor não guarda sessão. Cliente manda <code>Authorization: Bearer eyJhbGc...</code>, server válida assinatura. Desvantagens reais: <strong>não da pra revogar</strong> fácil, <strong>algoritmo "none"</strong> e CVE clássico (sempre valide alg explicitamente), confusão <strong>HS vs RS</strong>, e <strong>payload visível</strong> — qualquer um faz <code>atob(token.split(".")[1])</code>.')}
      </div>

    </div>
    </>
  )
}
