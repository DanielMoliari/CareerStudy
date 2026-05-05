import type { SkillContent } from '@/types'

const bullmq: SkillContent = {
  tagline: "Fila de jobs Redis-based para Node.js — processamento assíncrono, retry, prioridade.",
  why: "Processamento assíncrono com filas é padrão em qualquer sistema de produção. BullMQ é o padrão no ecossistema Node/NestJS para jobs, agendamento e workflows.",
  summary: "BullMQ é uma biblioteca Node.js para filas de jobs e mensagens baseada em Redis. Permite desacoplar trabalho pesado ou não-crítico do path crítico de uma request HTTP: envio de email, geração de relatório, processamento de imagem, integração com terceiros. Suporta retry com backoff, prioridade, jobs atrasados, rate limiting de workers, e workflows (parent-child jobs).",
  keypoints: [
    { title: "Queue e Worker", body: "Queue: publica jobs. Worker: consome e processa. Um worker pode ter N concurrency. Múltiplos workers escalam horizontalmente." },
    { title: "Job options", body: "attempts: quantas tentativas em caso de falha. backoff: delay entre tentativas (fixed, exponential). delay: tempo antes de processar. priority: 1 (alta) a N (baixa)." },
    { title: "Events e monitoramento", body: "Queue e Worker emitem eventos: completed, failed, progress, stalled. Integra com Bull Board (UI) para monitorar filas em tempo real." },
    { title: "Repeated jobs (cron)", body: "addJob com repeat: { pattern: '0 * * * *' } para jobs recorrentes. Substitui cron jobs externos para tarefas que precisam de retry e visibilidade." },
    { title: "Fluxos (parent-child)", body: "Job pai cria jobs filhos. Pai só completa quando todos os filhos completam. Útil para workflows paralelos com dependência." },
    { title: "NestJS integration", body: "@nestjs/bullmq adiciona módulo com DI. @Processor() e @OnWorkerEvent() para workers declarativos. Injeção de qualquer provider no worker." },
  ],
  gotchas: [
    "Redis sem persistência (appendonly no) — jobs perdidos em restart do Redis.",
    "Worker sem concurrency configurada — processa 1 job por vez. Configure concurrency baseado no trabalho (I/O: alto, CPU: igual ao número de cores).",
    "Sem dead letter queue — jobs que falham todas as tentativas somem silenciosamente. Monitore o evento 'failed'.",
    "Job muito grande no payload — Redis tem limite de memória. Para arquivos grandes, armazene no S3 e passe só a referência no job.",
    "Worker sem graceful shutdown — jobs em processamento interrompidos em deploy. Use worker.close() no SIGTERM.",
  ],
  interview: [
    { q: "Por que usar fila em vez de processar direto no request handler?", a: "<p>Desacopla latência: o handler responde 202 Accepted imediatamente e o trabalho acontece em background. O usuário não espera o email ser enviado ou o PDF gerado.</p><p>Resiliência: se o job falha (terceiro fora, timeout), retry automático. Sem fila, o erro vai para o usuário e não há retry.</p><p>Escalabilidade: workers podem escalar independentemente do servidor HTTP.</p>" },
    { q: "Como garantiria que um job crítico não se perde?", a: "<p>Redis com persistência habilitada (appendonly yes + AOF). Attempts e backoff configurados no job. Monitor de jobs 'failed' com alerta. Dead letter queue para jobs que esgotaram tentativas.</p><p>Para crítico demais para depender de Redis: considere transactional outbox — persiste o job no banco na mesma transação do negócio, e um worker lê do banco para enfileirar no BullMQ.</p>", level: "senior" },
  ],
  resources: [
    { title: "BullMQ docs", url: "https://docs.bullmq.io/", kind: "docs" },
    { title: "Bull Board (UI)", url: "https://github.com/felixmosh/bull-board", kind: "pratica" },
  ],
}

export default bullmq
