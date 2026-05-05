import type { SkillContent } from '@/types'

const axios: SkillContent = {
    tagline: "Cliente HTTP com interceptors, cancelamento e transformação automática de JSON.",
    why: "Axios ainda é onipresente em codebases que não usam React Query ou SWR. Saber configurar instâncias com interceptors é necessário.",
    gotchas: [
      "Axios considera qualquer status 2xx como sucesso. 400 e 500 são erros que vão para o catch. fetch() nativo não faz isso — retorna resolved mesmo para 404.",
      "Interceptors de response são globais — cuidado ao adicionar múltiplos ou não remover ao desmontar componentes.",
      "Cancelamento com AbortController é mais moderno que CancelToken (deprecated). Use signal: controller.signal.",
    ],
}

export default axios
