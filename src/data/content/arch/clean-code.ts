import type { SkillContent } from '@/types'

const cleanCode: SkillContent = {
  tagline: 'Escrever código que humanos leem e entendem sem precisar de decifração.',
  why: 'Clean Code é a linguagem de code review. Saber articular por que um nome é ruim, por que uma função é grande demais, ou por que um comentário é ruído posiciona você como revisor sólido e comunicador técnico confiável.',
  gotchas: [
    'Levar Clean Code como lei — "função de uma linha só", "zero comentários nunca" são extremos. Uncle Bob explica princípios, não dogmas. Contexto manda.',
    'Renomear variáveis pra soar "clean" sem refatorar a lógica — código elegante com lógica ruim ainda é código ruim.',
    'Comentário como documentação de código obvio — o pior tipo. Bom comentário explica POR QUÊ, não O QUÊ. "i++" não precisa de comentário; uma decisão de negócio contraintuitiva precisa.',
    'Sacrificar performance por nome bonito em caminho crítico — em hot path, micro-otimização e nome informativo podem coexistir; profiler decide, não dogma.',
  ],
}

export default cleanCode
