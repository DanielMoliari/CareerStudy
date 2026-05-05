import type { SkillContent } from '@/types'

const multiTenant: SkillContent = {
  tagline: 'Uma instalação de software atendendo múltiplos clientes (tenants) com isolamento de dados.',
  why: 'Multi-tenancy é tema central em SaaS. Entrevistador de vaga backend/arquitetura espera que você explique os três modelos de isolamento e saiba escolher com base em requisito de segurança, custo e compliance.',
  summary: 'Multi-tenancy significa que múltiplos clientes (tenants) compartilham a mesma infraestrutura com isolamento lógico ou físico de dados. Três estratégias de banco: (1) banco separado por tenant — isolamento máximo, custo alto de operação; (2) schema separado por tenant — bom equilíbrio, migrations por schema; (3) tabela compartilhada com coluna tenant_id — custo mínimo, risco de vazamento de dados se query esquecer filtro. A escolha depende de: regulação (HIPAA, GDPR exigem isolamento maior), número de tenants, tamanho do dado, e custo operacional aceitável.',
  gotchas: [
    'Esquecer o filtro de tenant_id em uma query — no modelo de tabela compartilhada, um bug expõe dados de outro cliente. Row-level security no banco (Postgres RLS) mitiga.',
    'Migrations em schema separado por tenant — rodar migration em 500 schemas em paralelo precisa de orquestração cuidadosa (locks, order, rollback).',
    'Subestimar custo operacional de banco por tenant — 1.000 tenants = 1.000 bancos de dados, conexões, backups, e monitoramento separados.',
    'Cross-tenant analytics — relatório consolidado de todos os tenants em modelo isolado exige ETL/data warehouse separado, não query direta.',
  ],
}

export default multiTenant
