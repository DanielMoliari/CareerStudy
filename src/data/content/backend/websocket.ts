import type { SkillContent } from '@/types'

const websocket: SkillContent = {
  tagline: "Protocolo de comunicação bidirecional persistente sobre TCP para real-time.",
  why: "WebSocket é a base de chat, notificações, jogos e dashboards em tempo real. Sênior precisa saber lifecycle, escalabilidade horizontal e alternativas (SSE, Long Polling).",
  summary: "WebSocket é um protocolo de comunicação full-duplex persistente, iniciado via upgrade de HTTP. Após handshake, conexão TCP permanece aberta para troca de frames bidirecional. Latência muito menor que polling. Desafios em escala: estado de conexão em N servidores (use Redis pub/sub ou sticky sessions), reconexão, heartbeat, autenticação de conexão.",
  keypoints: [
    { title: "Handshake", body: "Cliente envia HTTP com Upgrade: websocket. Servidor responde 101 Switching Protocols. A partir daí, protocolo WebSocket sobre TCP." },
    { title: "Frames", body: "Dados enviados em frames (text, binary, ping, pong, close). Fragmentação automática para mensagens grandes." },
    { title: "Heartbeat", body: "Ping/pong para detectar conexão morta. Cliente ou servidor envia ping; outro responde pong. Timeout sem pong = fechar conexão." },
    { title: "Escalabilidade horizontal", body: "Conexões são stateful — um servidor mantém lista dos sockets conectados. Em N servidores, precisa de pub/sub (Redis) para broadcast, ou sticky sessions (load balancer direciona usuário pro mesmo servidor)." },
    { title: "Autenticação", body: "WebSocket não tem headers após handshake. Autentique no handshake (query param com token, ou cookie). Ou primeira mensagem após conexão é o auth token." },
    { title: "Socket.IO", body: "Lib popular que usa WebSocket com fallback para long polling. Adiciona rooms, namespaces, auto-reconexão, ack de mensagem. Overhead vs WS puro." },
    { title: "SSE vs WebSocket", body: "SSE (Server-Sent Events): unidirecional servidor→cliente, sobre HTTP/2, auto-reconexão nativa, mais simples. WebSocket: bidirecional, mais complexo. Use SSE para notificações/feed; WebSocket para interação real-time." },
  ],
  gotchas: [
    "Sem heartbeat — conexão morta não é detectada, recurso vazado no servidor.",
    "Autenticação fraca no handshake — qualquer um conecta.",
    "N servidores sem Redis pub/sub — mensagem entregue só para usuários no mesmo servidor.",
    "Sem rate limiting de mensagens — cliente inunda servidor.",
    "Memory leak: conexão fechada sem cleanup de event listeners e rooms.",
  ],
  interview: [
    { q: "Como escalaria WebSocket horizontalmente?", a: "<p>Em múltiplos servidores, conexão fica em um único servidor. Para broadcast ou mensagem entre usuários em servidores diferentes: Redis pub/sub. Servidor A publica mensagem, todos servidores assinam e repassam para seus sockets conectados.</p><p>Alternativa: sticky sessions (LB envia usuário sempre para o mesmo servidor). Simples mas vulnerável a restart.</p>" },
    { q: "WebSocket vs SSE — quando usar cada?", a: "<p>SSE: notificações, feed, progresso de operação — dados fluem do servidor para o cliente. HTTP/2 nativo, auto-reconexão, mais simples de implementar e escalar.</p><p>WebSocket: chat, jogos, colaboração em tempo real — cliente também envia dados frequentemente. Latência menor, full-duplex.</p><p>Para a maioria das notificações de app, SSE é mais simples e suficiente.</p>" },
  ],
  resources: [
    { title: "MDN — WebSockets API", url: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API", kind: "docs" },
    { title: "Socket.IO docs", url: "https://socket.io/docs/v4/", kind: "docs" },
  ],
}

export default websocket
