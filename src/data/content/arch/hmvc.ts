import type { SkillContent } from '@/types'

const hmvc: SkillContent = {
  tagline: 'Hierarquia de triads MVC — módulos que encapsulam sua própria pilha de controle, visão e modelo.',
  why: 'HMVC aparece em codebases PHP legados (Kohana, CodeIgniter com módulos) e em discussões de modularização. Saber o que diferencia de MVC puro ajuda a entender modularidade e a ler código de sistema existente.',
  gotchas: [
    'Confundir HMVC com MVC simples — a hierarquia permite que um controller chame outro controller internamente, o que em MVC normal é anti-pattern.',
    'Usar HMVC como desculpa para criar acoplamento entre módulos via chamadas internas — o ponto é encapsulamento, não canal interno livre.',
    'Escolher HMVC em projeto moderno — em 2025, arquitetura modular com DDD/bounded contexts e injeção de dependência entrega os mesmos benefícios com mais clareza e testabilidade.',
  ],
}

export default hmvc
