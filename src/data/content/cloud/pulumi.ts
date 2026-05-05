import type { SkillContent } from '@/types'

const pulumi: SkillContent = {
  tagline: "IaC com linguagens de programação reais (TypeScript, Python, Go) em vez de YAML/HCL.",
  why: "Pulumi é alternativa crescente ao Terraform, especialmente em times TypeScript. Saber quando a expressividade de uma linguagem real resolve o que HCL não consegue expressar é diferencial em arquitetura de plataforma.",
  summary: "Pulumi permite definir infraestrutura como código em TypeScript, Python, Go e .NET. Reutiliza providers do Terraform via Pulumi Terraform Bridge. State gerenciado pelo Pulumi Cloud (SaaS) ou self-hosted (S3, Azure Blob, GCS). Vantagem sobre Terraform: lógica real (loops, condicionais, abstrações com tipos), testes com Jest/pytest, Automation API para plataformas de self-service. Desvantagem: ecossistema menor, comunidade menor.",
  keypoints: [
    { title: "Linguagens suportadas", body: "TypeScript/JavaScript, Python, Go, .NET, Java, YAML (casos simples). Mesmo provider que Terraform em muitos casos via Pulumi Terraform Bridge. Nativos: AWS, Azure, GCP têm providers próprios (pulumi-aws, pulumi-azure-native, pulumi-gcp)." },
    { title: "Stack", body: "Equivalente ao workspace do Terraform. Cada stack tem seu state independente (dev, staging, prod). pulumi up aplica mudanças, pulumi preview mostra o diff sem aplicar, pulumi destroy remove todos os recursos da stack." },
    { title: "ComponentResource", body: "Classes que agrupam recursos em abstrações reutilizáveis — equivalente aos módulos do Terraform, mas com toda a expressividade da linguagem. Encapsula padrões (ex: VpcComponent, EcsServiceComponent) com tipos TypeScript, validações e lógica real." },
    { title: "Secrets", body: "Config secrets criptografados no state. pulumi config set --secret DB_PASSWORD. Integra nativamente com AWS Secrets Manager, HashiCorp Vault, Azure Key Vault. Valores secretos não aparecem em plaintext no state ou nos logs." },
    { title: "Automation API", body: "Biblioteca que permite controlar Pulumi programaticamente (sem CLI). Permite criar plataformas de self-service de infraestrutura: um endpoint HTTP que provisiona stacks sob demanda. Base para Internal Developer Platforms." },
    { title: "Testing", body: "Unit tests com mocks (sem provisionar infra real) — testa a lógica de ComponentResources. Integration tests com pulumi preview e stacks efêmeras em CI. Policy as Code (CrossGuard) para guardrails: verificar se todos os recursos têm tags, se buckets S3 são privados, etc." },
  ],
  gotchas: [
    "Código arbitrário roda durante pulumi up — side effects (chamadas de API, escrita em disco) executam durante o preview. Isole lógica com Output.apply para evitar execução prematura.",
    "State inconsistente é difícil de recuperar — como no Terraform, state corrompido exige intervenção manual. Use backend remoto e não interrompa aplys.",
    "Pulumi Cloud (SaaS) vs self-hosted — self-hosted requer gerenciar o backend de state e a criptografia de secrets manualmente.",
    "Bridge providers podem ter lag em relação ao provider Terraform original — novos recursos da AWS podem demorar a chegar. Verifique antes de migrar.",
  ],
  interview: [
    { q: "Quando Pulumi é melhor que Terraform?", a: "<p>Quando você precisa de lógica que HCL não expressa bem: loops sobre listas dinâmicas de recursos, condicionais complexas baseadas em outputs de API, abstrações com herança e composição.</p><p>Times TypeScript podem reutilizar tipos, funções utilitárias e validações entre o código da aplicação e o da infraestrutura. Testes de infra com Jest sem ferramentas externas. Automation API para plataformas de self-service que provisionam stacks dinamicamente.</p>", level: "pleno" },
    { q: "Como Pulumi gerencia state em comparação ao Terraform?", a: "<p>Mesmo conceito: state é o mapeamento entre o código e os recursos reais na cloud. Pulumi usa os mesmos backends: Pulumi Cloud (SaaS com UI e histórico), S3, Azure Blob, GCS (self-hosted).</p><p>Diferença principal: secrets no state são criptografados nativamente (Pulumi Cloud gerencia as chaves, ou você fornece uma chave própria). No Terraform, valores sensíveis ficam em plaintext no state a menos que você use sensitive=true (que só oculta no output, não criptografa no arquivo).</p>", level: "pleno" },
    { q: "O que é a Automation API e quando faz sentido usar?", a: "<p>Automation API é um SDK que expõe as operações do Pulumi (up, preview, destroy, refresh, config) como funções de biblioteca, sem depender do CLI. Permite integrar Pulumi em aplicações Node.js, Python, Go ou .NET.</p><p>Casos de uso: Internal Developer Platform onde um endpoint HTTP provisiona uma stack por tenant; pipeline de testes que cria e destrói infraestrutura efêmera por PR; sistemas de orquestração que precisam de IaC programático sem shell exec.</p>", level: "senior" },
    { q: "Como testaria código Pulumi antes de provisionar infra real?", a: "<p><strong>Unit tests com mocks:</strong> Pulumi SDK permite mockar todos os recursos — o código TypeScript/Python roda, mas nenhuma chamada real à AWS acontece. Testa a lógica dos ComponentResources (nomes, tags, configurações derivadas).</p><p><strong>pulumi preview:</strong> calcula o diff contra o state atual sem aplicar. Integrado no CI — qualquer mudança gera um preview comentado no PR.</p><p><strong>Stacks efêmeras:</strong> CI cria uma stack temporária (ex: pr-123), aplica, roda testes de integração, destrói. Confirma que a infra funciona de ponta a ponta.</p><p><strong>CrossGuard (Policy as Code):</strong> políticas que rodam no preview e bloqueiam recursos não conformes (bucket S3 público, instância sem tag de custo, etc.).</p>", level: "senior" },
  ],
  resources: [
    { title: "Pulumi docs", url: "https://www.pulumi.com/docs/", kind: "docs" },
    { title: "Pulumi vs Terraform", url: "https://www.pulumi.com/docs/intro/vs/terraform/", kind: "artigo" },
    { title: "Pulumi Automation API", url: "https://www.pulumi.com/docs/using-pulumi/automation-api/", kind: "docs" },
  ],
}


export default pulumi
