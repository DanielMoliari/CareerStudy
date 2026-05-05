import type { SkillContent } from '@/types'

const codeReview: SkillContent = {
  tagline: 'Revisão sistemática de código antes do merge — qualidade, conhecimento e coesão de time.',
  why: 'Code review é habilidade de liderança técnica. Senior que revisa bem eleva o time, distribui conhecimento e previne débito técnico. Saber o que revisar (e o que não revisar) é diferencial em cargo sênior+.',
  summary: 'Code review serve a três propósitos: qualidade (bugs, segurança, performance), difusão de conhecimento (todos entendem o que está sendo mergeado) e coesão de design (decisões de arquitetura chegam ao time antes de virar débito). O que revisar: corretude, testes, clareza, segurança, performance em hot path, compatibilidade de API. O que NÃO bloquear: estilo de formatação (linter resolve), preferência pessoal de nome sem critério objetivo, micro-otimização especulativa. Feedback bom é específico, explica o porquê, separa blocking de sugestão, e nunca é pessoal.',
  gotchas: [
    'Revisar estilo que o linter deveria pegar — bloquear PR por indentação é ruído que desgasta quem revisou e quem recebeu. Automatize.',
    'Comentário de review vago — "isso pode ser melhorado" sem dizer como ou por quê gera frustração. Seja específico e objetivo.',
    'PR gigante de 2.000 linhas — revisor não consegue entender o contexto completo. Limite de PR é responsabilidade de quem abre, não de quem revisa.',
    'Ego de reviewer — rejeitar código correto porque "eu faria diferente" sem critério técnico é bloqueio desnecessário. Diferencie preferência de problema real.',
  ],
}

export default codeReview
