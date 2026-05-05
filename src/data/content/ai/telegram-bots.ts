import type { SkillContent } from '@/types'

const telegramBots: SkillContent = {
    tagline: 'Bots no Telegram via HTTP API — mensagens, comandos, teclados e pagamentos.',
    why: 'Canal de entrega com 900M+ usuários ativos. Custo zero de infraestrutura de notificação. Útil para alertas de produção, automações internas e produtos B2C.',
    gotchas: [
      'Webhook exige HTTPS com certificado válido — use ngrok em dev ou Cloudflare Tunnel.',
      'Rate limit da API: 30 mensagens/segundo por bot, 20/minuto por chat — implemente fila.',
      'Mensagens com Markdown V2 exigem escape de caracteres especiais (`.`, `!`, `-`) — fácil de quebrar.',
      'Bot não pode iniciar conversa com usuário que não o iniciou primeiro — limitação by design.',
    ],
    summary: 'A Bot API do Telegram é REST pura: você registra webhook ou usa long polling. Libs populares: python-telegram-bot (Python), Grammy e Telegraf (TypeScript/Node). Suporta botões inline, teclados personalizados, mídia, pagamentos (Telegram Stars) e webhooks de atualização.',
    resources: [
      { title: 'Telegram Bot API docs', url: 'https://core.telegram.org/bots/api', kind: 'docs' },
      { title: 'Grammy (TS/Node)', url: 'https://grammy.dev/', kind: 'docs' },
      { title: 'python-telegram-bot', url: 'https://python-telegram-bot.org/', kind: 'docs' },
    ],
  }

export default telegramBots
