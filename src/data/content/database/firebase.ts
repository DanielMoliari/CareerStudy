import type { SkillContent } from '@/types'

const firebase: SkillContent = {
  tagline: "Plataforma Backend-as-a-Service do Google: Firestore, Auth, Storage, Functions.",
  why: "Firebase é escolha comum para MVPs e apps mobile. Saber quando ele é certo (velocidade, realtime, auth pronto) e quando é errado (queries complexas, custo, vendor lock-in) é o que diferencia uma arquitetura sólida.",
  gotchas: [
    "Firestore não suporta queries relacionais ou JOINs — você precisa desnormalizar dados ou fazer múltiplas queries na aplicação.",
    "Custo pode crescer exponencialmente — reads cobrados por documento, não por query. Um listener em coleção grande = muitos reads.",
    "Sem transações entre coleções diferentes sem Cloud Functions — lógica de negócio complexa vira código de aplicação frágil.",
    "Vendor lock-in severo — migrar de Firestore para outro banco é caro em tempo de engenharia. Abstraia o acesso a dados desde o início.",
    "Security Rules são poderosas mas difíceis de testar — use o Emulator Suite para testes locais antes de fazer deploy.",
  ],
}

export default firebase
