import type { SkillContent } from '@/types'

const secretsManagement: SkillContent = {
    tagline: 'Gestão segura de segredos — nunca hardcodar, rotacionar automaticamente, auditar acesso.',
    why: 'Segredos hardcodados (chaves de API, senhas de banco, tokens) no código fonte são uma das causas mais comuns de incidentes de segurança em produção. Saber usar AWS Secrets Manager, HashiCorp Vault ou Doppler, e integrar rotação automática de segredos, é diferencial imediato em posições de backend e DevOps.',
    summary: 'Secrets management cobre o ciclo de vida completo de segredos: geração, armazenamento, distribuição, rotação e revogação. O princípio fundamental é que segredos nunca devem estar em código fonte, variáveis de ambiente de build, ou logs. As ferramentas de secrets manager (AWS Secrets Manager, HashiCorp Vault, Doppler) centralizam o armazenamento com criptografia em repouso e em trânsito, auditoria de acesso (quem acessou qual segredo, quando), e rotação automática. Em CI/CD, os segredos são injetados como variáveis de ambiente em runtime — nunca commitados no repositório.',
    keypoints: [
      {
        title: 'Tipos de segredos e onde vão',
        body: 'Database credentials: AWS Secrets Manager ou Vault com rotação automática. API keys de terceiros: Doppler ou 1Password Secrets Automation. JWT secrets e encryption keys: gerados com alta entropia, rotacionados periodicamente, nunca em .env commitado. Chaves SSH e certificados TLS: gerenciados por ferramentas de PKI (Vault PKI, AWS ACM).',
        code: `// Buscar segredo do AWS Secrets Manager em runtime
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager'

const client = new SecretsManagerClient({ region: 'us-east-1' })

async function getDbCredentials() {
  const cmd = new GetSecretValueCommand({ SecretId: 'prod/myapp/db' })
  const secret = await client.send(cmd)
  return JSON.parse(secret.SecretString!) as { username: string; password: string }
}
// Credenciais nunca ficam em variáveis de ambiente — buscadas em runtime`,
      },
      {
        title: 'Rotação automática de segredos',
        body: 'Segredos não rotacionados são um risco crescente: se vazarem, ficam válidos indefinidamente. AWS Secrets Manager suporta rotação automática com Lambda — a cada N dias, uma Lambda gera nova senha no banco, atualiza o segredo no Secrets Manager, e a aplicação busca o novo valor na próxima chamada. O padrão é manter o segredo anterior válido por um período de "grace" para zero-downtime rotation.',
      },
      {
        title: 'GitHub Secrets para CI/CD',
        body: 'GitHub Actions criptografa segredos em repouso e os injeta como variáveis de ambiente apenas durante a execução. Nunca imprimir segredos em logs (GitHub mascara automaticamente, mas é uma garantia frágil). Usar OIDC (OpenID Connect) para autenticar pipelines com AWS sem segredo algum — o token é temporário e gerado automaticamente.',
        code: `# GitHub Actions com OIDC para AWS — zero secrets no repositório
- name: Configure AWS credentials via OIDC
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: arn:aws:iam::123456789:role/github-actions-deploy
    aws-region: us-east-1
# Nenhuma AWS_ACCESS_KEY ou AWS_SECRET_KEY hardcodada — token temporário via OIDC`,
      },
    ],
    interview: [
      {
        q: 'Como você garantiria que nenhuma chave de API seja commitada no repositório?',
        a: 'Três camadas: (1) pré-commit hook com gitleaks ou git-secrets para bloquear commits com padrões de segredos antes de chegarem ao repositório; (2) SAST com regras de hardcoded secrets (Semgrep tem p/secrets) no CI para detectar o que escapou do pre-commit; (3) GitHub Secret Scanning (nativo no GitHub) que varre commits históricos e futuros automaticamente. Se um segredo vazar: revogar imediatamente (não basta deletar o commit — o histórico git é imutável e pode ter sido clonado); rotar; auditoria de acesso para avaliar impacto.',
        tip: 'A ordem importa: bloquear no pre-commit é mais barato que detectar no CI, que é mais barato que detectar em produção.',
        level: 'pleno',
      },
      {
        q: 'Qual a diferença entre .env local e um secrets manager? Quando usar cada um?',
        a: '.env local: para desenvolvimento local, nunca commitado (no .gitignore), valores de desenvolvimento (banco local, API keys de sandbox). Secrets manager (AWS Secrets Manager, Vault, Doppler): para produção e staging — criptografia em repouso, auditoria de acesso, rotação automática, ACL por ambiente e serviço. A distinção crítica: .env em produção é uma antipattern porque fica em disco, não tem auditoria de acesso, e é difícil de rotacionar. Em produção, variáveis de ambiente devem ser injetadas pela plataforma (ECS task definition, Kubernetes Secret, etc.) a partir de um secrets manager — nunca um arquivo .env no servidor.',
        level: 'pleno',
      },
      {
        q: 'O que é OIDC e como elimina segredos hardcodados em pipelines de CI/CD?',
        a: 'OIDC (OpenID Connect) é um protocolo de identidade federada. No contexto de CI/CD: GitHub Actions pode se autenticar na AWS apresentando um token JWT temporário assinado pelo GitHub. A AWS verifica a assinatura e, se o token for válido e corresponder a uma IAM role configurada, retorna credenciais temporárias (STS). O resultado: nenhuma AWS_ACCESS_KEY ou AWS_SECRET_KEY no repositório. As credenciais duram minutos (tempo do job), não são armazenadas em nenhum lugar, e a permissão é controlada pela IAM role. GCP e Azure têm implementações equivalentes de Workload Identity Federation.',
        level: 'senior',
      },
      {
        q: 'Como funciona a rotação automática de segredos com zero downtime?',
        a: 'O padrão de rotação com zero downtime tem 4 fases: (1) Create new — gerar nova credencial no sistema de destino (ex: nova senha no banco); (2) Test — verificar que a nova credencial funciona; (3) Set current — atualizar o segredo no secrets manager para a nova credencial; (4) Finalize — revogar a credencial antiga após um período de "grace" (ex: 15 min) para que instâncias em execução com a credencial antiga possam renovar sem erro. O AWS Secrets Manager com Lambda faz esse ciclo nativamente para RDS. A aplicação, ao receber um erro de autenticação de banco, deve tentar renovar o segredo e reconectar — circuit breaker com refresh de credenciais.',
        level: 'senior',
      },
    ],
    gotchas: [
      'Deletar um commit com segredo não remove do histórico git — o git é imutável. O segredo permanece em git reflog, forks, e qualquer clone já feito. Revogar é sempre o primeiro passo.',
      '.env em produção (arquivo físico no servidor) não tem auditoria de acesso — qualquer pessoa com shell no servidor lê. Usar variáveis injetadas pela plataforma.',
      'Segredos em variáveis de ambiente podem vazar via /proc/pid/environ, stack traces que dumpeiam o ambiente, ou logs de debugging. Minimizar o número de segredos no ambiente de runtime.',
      'Rotação de segredos sem atualizar todas as instâncias simultaneamente causa falha de autenticação intermitente — o padrão de "grace period" com credencial dupla durante a transição é essencial.',
    ],
    resources: [
      { title: 'AWS Secrets Manager — Guia de boas práticas', url: 'https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html', kind: 'docs' },
      { title: 'HashiCorp Vault — Documentação', url: 'https://developer.hashicorp.com/vault/docs', kind: 'docs' },
    ],
  }

export default secretsManagement
