import type { SkillContent } from '@/types'

const pm2: SkillContent = {
  tagline: "Process manager para Node.js — mantém app rodando em prod com cluster e zero-downtime reload.",
  why: "PM2 é o padrão de fato pra rodar Node.js em servidor sem orquestrador. Aparece em ambiente de VPS, EC2 sem K8s, projetos menores. Senior sabe a diferença entre PM2 e Docker/K8s, e quando cada um faz sentido.",
  gotchas: [
    "pm2 start app.js reinicia com a versão antiga se você não rodar pm2 reload após deploy. Use pm2 reload --update-env para garantir vars de ambiente atualizadas.",
    "PM2 cluster mode divide a porta entre workers via IPC — não funciona com WebSocket sticky session sem load balancer configurado corretamente.",
    "pm2 save + pm2 startup é necessário para sobreviver a reboot. Sem isso, server reinicia e a app não volta.",
    "Logs acumulam em ~/.pm2/logs sem rotação. Configure log_date_format e max_size no ecosystem.config.js ou use logrotate.",
  ],
  resources: [
    { title: "PM2 Documentation", url: "https://pm2.keymetrics.io/docs/", kind: "docs" },
  ],
}

export default pm2
