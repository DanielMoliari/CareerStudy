import type { SkillContent } from '@/types'

const apacheThrift: SkillContent = {
  tagline: "Framework RPC polyglota do Facebook para comunicação eficiente entre serviços.",
  why: "Thrift aparece em sistemas de grande escala legados. Conhecimento de valor em contextos com microserviços heterogêneos.",
  gotchas: [
    "Thrift não tem discovery de serviço nativo — precisa de solução externa.",
    "Schema evolution mais rígida que Protobuf — campos obrigatórios causam incompatibilidade.",
  ],
}

export default apacheThrift
