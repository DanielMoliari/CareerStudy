import type { SkillContent } from '@/types'

const circuitBreakers: SkillContent = {
  tagline: 'Parar de chamar dependência quebrada antes que ela leve seu sistema junto.',
  why: 'Resiliencia e tema obrigatório em entrevista senior. Circuit breaker mostra que você pensa em failure mode, cascading failure e como sistema se recupera. Quem nunca implementou ou configurou de verdade tropeca em pergunta básica de half-open.',
  summary: 'Circuit breaker e padrão de resiliencia que monitora chamadas a uma dependência e, quando taxa de erro/latência cruza limiar, abre o circuito — para de chamar e falha rápido (fail-fast). Após timeout, vai pra half-open: deixa passar algumas chamadas pra testar; se passarem, fecha e volta ao normal; se falharem, abre de novo. Evita cascading failure (cliente travado em timeout puxa todos os threads, sistema todo cai). Padrão crítico em sistemas distribuidos com dependência externa.',
  keypoints: [
    { title: 'Tres estados', body: 'Closed (chamadas passam, monitora falhas), Open (rejeita imediatamente, falha rápido), Half-open (passa N chamadas de teste, decide se fecha ou abre de novo).' },
    { title: 'Cascading failure', body: 'Sem breaker, dependência lenta amarra threads do cliente. Pool esgota. Cliente fica unresponsive. Outros serviços chamando ele também caem. Cascata. Breaker corta no inicio.' },
    { title: 'Limiares de abertura', body: 'Por taxa de erro (ex: 50% em janela de 1min), por contagem absoluta, por latência P99. Janela deslizante e melhor que contador simples — evita reabrir/fechar oscilando.' },
    { title: 'Timeout no half-open', body: 'Tempo de espera antes de tentar half-open define velocidade de recuperação. Curto demais = oscilacao. Longo demais = degradação prolongada. Tipico: 30s-2min com backoff exponencial.' },
    { title: 'Fallback', body: 'Quando breaker abre, o que você devolve? Cache stale, default, mensagem amigável, queue pra processar depois. Sem fallback, breaker só adianta o erro — não melhora UX.' },
    { title: 'Bulkhead pattern', body: 'Complementa breaker: pools de thread/conexão isolados por dependência. Falha em serviço A não consome thread de chamada pra serviço B. Hystrix populizou esse combo.' },
    { title: 'Bibliotecas', body: 'Resilience4j (Java/Kotlin), Polly (.NET), opossum (Node), gobreaker (Go). Service mesh (Istio, Linkerd) faz no nível de proxy sem mudar código.' },
  ],
  gotchas: [
    'Breaker sem fallback útil — usuário ainda vê erro, você só falhou mais rápido. Defina experiência degradada.',
    'Limiar muito sensível — 1 falha abre o circuito, sistema fica oscilando. Use janela deslizante com volume mínimo.',
    'Esquecer timeout da chamada subjacente — se request HTTP não tem timeout, breaker nunca conta como falha porque request fica pendurado pra sempre.',
    'Aplicar breaker em chamada local (DB pool, cache local) — não e o caso de uso. Breaker e pra dependência remota com risco de ficar lenta/cair.',
    'Estado do breaker em memória local em serviço com 100 instâncias — cada uma decide separadamente. Pra decisão global, breaker no service mesh ou centralizado.',
  ],
  interview: [
    { q: 'Como você desenha um circuit breaker do zero?', a: '<p>Tres estados: <code>CLOSED</code>, <code>OPEN</code>, <code>HALF_OPEN</code>. Em CLOSED, mantenho contador de sucesso/falha em <strong>janela deslizante</strong> (ex: 60s) com volume mínimo (ex: 20 calls) pra evitar abrir com pouco dado.</p><p>Quando taxa de falha > limiar (ex: 50%), vai pra OPEN. Em OPEN, rejeita rápido por <code>resetTimeout</code> (ex: 30s). Após isso, HALF_OPEN libera N calls de teste; se passar, CLOSED; se falhar, OPEN de novo com backoff.</p><p>Adiciono <strong>fallback</strong>: cache stale, default, queue. E observability: metric por estado, alerta quando abre.</p>' },
    { q: 'Tradeoff: circuit breaker vs retry?', a: '<p>São <strong>complementares</strong>, não alternativos. Retry resolve falha transiente (network blip, deploy momentaneo). Breaker resolve falha sustentada (serviço fora do ar).</p><p>Retry sem breaker e perigoso: dependência lenta + retry = amplifica carga, agrava o problema (retry storm). Padrão seguro: <strong>retry com backoff exponencial + jitter</strong>, dentro de um breaker. Breaker abre, para de tentar retry pra sempre.</p>' },
    { q: 'Quando NÃO usar circuit breaker?', a: '<p>Em chamadas <strong>locais e rápidas</strong> (cache em memória, computação pura) — overhead não vale. Em fluxo <strong>fire-and-forget</strong> via fila, fila já absorve falha — breaker não agrega.</p><p>Em <strong>fluxo crítico sem fallback aceitável</strong> (ex: autorização de pagamento), abrir circuito pode ser pior que esperar — preciso escalar capacidade ou redundar dependência, não só falhar rápido.</p>' },
    { q: 'Como o breaker se comporta quando você tem 100 instâncias do mesmo serviço?', a: '<p>Cada instância tem estado próprio em memória. Algumas podem estar OPEN, outras CLOSED, dependendo do que cada uma viu. Isso e <strong>aceitavel</strong> — comportamento converge porque todas veem a mesma dependência ruim.</p><p>Pra decisão global (ex: tirar dependência inteira do mapa), uso <strong>service mesh</strong> (Istio, Linkerd) que decide no proxy, ou registry central. Mas centralizar adiciona ponto de falha — análise tradeoff antes.</p>' },
    { q: 'Como você testa um circuit breaker em produção?', a: '<p>Chaos engineering: injeto latência/erro na dependência (toxiproxy, fault injection no service mesh) e observo se breaker abre, se fallback funciona, se sistema mantem disponibilidade. Sem teste, você só sabe se funciona quando incidente real acontece.</p><p>Em CI: teste de integração com mock que retorna erro/timeout e assert no estado do breaker. <strong>Game day</strong> trimestral pra simular falha de dependência crítica.</p>' },
  ],
  resources: [
    { title: 'Release It! (Michael Nygard)', url: 'https://pragprog.com/titles/mnee2/release-it-second-edition/', kind: 'livro' },
    { title: 'Martin Fowler — CircuitBreaker', url: 'https://martinfowler.com/bliki/CircuitBreaker.html', kind: 'artigo' },
    { title: 'Resilience4j docs', url: 'https://resilience4j.readme.io/docs/circuitbreaker', kind: 'docs' },
    { title: 'Hystrix wiki (legado mas didatico)', url: 'https://github.com/Netflix/Hystrix/wiki', kind: 'docs' },
    { title: 'AWS — Implementing Circuit Breaker', url: 'https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/', kind: 'artigo' },
  ],
  diagram: 'circuit-breaker'
}

export default circuitBreakers
