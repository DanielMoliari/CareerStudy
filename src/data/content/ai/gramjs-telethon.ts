import type { SkillContent } from '@/types'

const gramjsTelethon: SkillContent = {
    tagline: 'Clients MTProto para Telegram — acesso como usuário, não como bot.',
    why: 'Scraping de canais, automação de conta, leitura de grupos privados e coleta de dados são casos que a Bot API não cobre. gramJS (Node) e Telethon (Python) são os padrões.',
    gotchas: [
      'Usar conta pessoal em automação agressiva leva a ban permanente — use conta dedicada e delays humanos.',
      'MTProto requer autenticação de duas etapas (2FA) e telefone real — não tem como contornar.',
      'Sessions devem ser persistidas (arquivo .session) — perder a session força re-auth com código SMS.',
      'Flood wait errors (FloodWaitError) devem ser respeitados — ignorar causa escalada de ban.',
    ],
    summary: 'Telethon (Python) e gramJS (TypeScript/Node) implementam o protocolo MTProto do Telegram, que é o mesmo que o app oficial usa. Permite ler mensagens de grupos/canais como usuário, enviar em nome do usuário, baixar mídia e escutar eventos em tempo real. Muito mais poderoso que a Bot API, mas exige conta real e uso responsável.',
    resources: [
      { title: 'Telethon docs', url: 'https://docs.telethon.dev/', kind: 'docs' },
      { title: 'gramJS (GitHub)', url: 'https://github.com/gram-js/gramjs', kind: 'docs' },
      { title: 'Telegram MTProto docs', url: 'https://core.telegram.org/mtproto', kind: 'docs' },
    ],
  }

export default gramjsTelethon
