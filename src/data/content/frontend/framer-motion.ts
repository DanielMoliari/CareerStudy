import type { SkillContent } from '@/types'

const framerMotion: SkillContent = {
    tagline: "Biblioteca de animação declarativa para React com gesture support e layout animations.",
    why: "Framer Motion é o padrão de animação em projetos React profissionais. API declarativa, animações de layout automáticas e suporte a gestos tornam possível animações que seriam complexas com CSS puro.",
    summary: "Framer Motion permite animar componentes React com uma API declarativa: props animate, initial, exit em um componente <motion.div>. Suporta animações de layout (AnimatePresence, layout prop), gestos (drag, hover, tap), variants para estados e orchestration. Lida com animações complexas que CSS sozinho não resolve bem.",
    keypoints: [
      { title: "motion.* e props de animação", body: "Qualquer elemento HTML tem um equivalente motion.*. Props: initial (estado inicial), animate (estado alvo), exit (ao sair do DOM), transition (configuração de física/timing).", code: `<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
/>` },
      { title: "AnimatePresence", body: "Permite animar componentes ao serem removidos do DOM (exit animation). Sem AnimatePresence, o exit nunca roda porque React remove imediatamente.", code: `<AnimatePresence>
  {isVisible && (
    <motion.div key="modal" exit={{ opacity: 0 }}>
      Conteúdo
    </motion.div>
  )}
</AnimatePresence>` },
      { title: "layout prop e animações de layout", body: "A prop layout faz o componente animar automaticamente quando sua posição/tamanho muda no DOM. Resolve animações de reordenação de lista, expansão de card — sem calcular posições manualmente.", code: `<motion.div layout>
  {/* Anima automaticamente quando tamanho/posição muda */}
</motion.div>` },
      { title: "Variants", body: "Variants definem estados nomeados de animação. Propagam automaticamente para filhos — o pai orquestra sem código extra nos filhos.", code: `const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}
const item = { hidden: { y: 20 }, show: { y: 0 } }
<motion.ul variants={container} initial="hidden" animate="show">
  <motion.li variants={item} />
</motion.ul>` },
    ],
    interview: [
      { q: "Por que precisamos de AnimatePresence para animações de saída?", a: "<p>React remove componentes do DOM imediatamente quando o estado muda para false. AnimatePresence intercepta essa remoção e espera o exit animation completar antes de remover. Sem ele, a animação de saída nunca acontece.</p>", level: "pleno" },
      { q: "O que faz a prop 'layout' do Framer Motion?", a: "<p>layout faz o componente medir sua posição e tamanho antes e depois de uma atualização de layout. Se mudou, anima automaticamente entre as duas posições usando a técnica FLIP (First, Last, Invert, Play). Resolve animações de reordenação sem cálculos manuais.</p>", tip: "Citar FLIP mostra que você entende a técnica por baixo, não só a prop.", level: "senior" },
      { q: "Quando usar Framer Motion vs CSS animations?", a: "<p>CSS: animações simples e repetitivas, sem lógica de estado (hover, spinner, skeleton). Mais performático, sem bundle.</p><p>Framer Motion: animações condicionais baseadas em estado React, animações de entrada/saída, reordenação de listas, gestos (drag), orchestration entre componentes. Quando CSS sozinho exigiria JS para calcular posições ou sequenciar.</p>", level: "pleno" },
      { q: "Como variants propagam para componentes filhos?", a: "<p>Quando um componente pai tem variants e muda para um estado nomeado (ex: 'show'), os filhos com variants recebem automaticamente o mesmo nome de estado — sem precisar de prop animate nos filhos. O pai orquestra via staggerChildren, delayChildren no transition. Isso permite animar listas com efeito cascata com código mínimo.</p>", level: "senior" },
    ],
    gotchas: [
      "AnimatePresence precisa de key única no filho para detectar entrada/saída corretamente. Sem key estável, pode não animar.",
      "layout prop em conjunto com position: fixed ou absoluto pode causar animações incorretas — use layoutId para shared element transitions entre componentes separados.",
      "Framer Motion adiciona ~50KB ao bundle. Para animações simples, CSS é mais performático. Use Framer apenas quando o ganho de UX justifica.",
    ],
    resources: [
      { title: "Framer Motion docs", url: "https://www.framer.com/motion/", kind: "docs" },
      { title: "Framer Motion — Examples", url: "https://www.framer.com/motion/examples/", kind: "pratica" },
    ],
}

export default framerMotion
