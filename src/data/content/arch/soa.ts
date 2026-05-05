import type { SkillContent } from '@/types'

const soa: SkillContent = {
  tagline: 'Arquitetura Orientada a Serviços — serviços de granularidade maior compartilhando um ESB.',
  why: 'SOA é predecessor dos microservices e ainda aparece em enterprise legado (Java EE, SOAP/WS-*). Saber distinguir de microservices e de arquitetura orientada a eventos posiciona você bem em entrevistas de modernização.',
  gotchas: [
    'Confundir SOA com microservices — SOA tem serviços maiores (coarse-grained), geralmente um ESB central, e protocolo SOAP/XML; microservices são finos, sem ESB, e usam HTTP/gRPC/eventos.',
    'ESB como ponto central de lógica de negócio — o barramento vira gargalo de complexidade, impossível de testar e de versionar sem coordenação global.',
    'Migrar SOA para microservices sem limpar o coupling do ESB — você distribui o problema em vez de resolver.',
  ],
}

export default soa
