import type { SkillContent } from '@/types'

const socketIo: SkillContent = {
  tagline: "Biblioteca WebSocket com fallback, rooms, namespaces e auto-reconexão.",
  why: "Socket.IO simplifica WebSocket com features de alto nível. Ainda muito usado em projetos Node.js com real-time.",
  gotchas: [
    "Overhead de protocolo vs WebSocket puro — Socket.IO usa seu próprio protocolo em cima de WS.",
    "Sticky sessions necessárias sem Redis adapter — usuários em servidores diferentes não trocam mensagens.",
    "Cliente Socket.IO não conecta com servidor WS puro — protocolos incompatíveis.",
  ],
}

export default socketIo
