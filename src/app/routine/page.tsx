'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import { ALL_SKILLS, SKILL_BY_NAME, SKILL_BY_SLUG, iconUrl } from '@/data/skills'
import { useProgress, STATE_COLORS } from '@/hooks/useProgress'
import type { ProgressState } from '@/types'

/* ─── Data ─── */
const CAT_COLORS: Record<string, string> = {
  frontend: '#60a5fa', backend: '#34d399', database: '#fbbf24',
  cloud: '#f97316',    devops: '#a78bfa',  obs: '#22d3ee',
  ai: '#ef4444',       arch: '#f472b6',    cs: '#38bdf8',
  sec: '#facc15',      soft: '#94a3b8',
}
const CAT_LABEL: Record<string, string> = {
  frontend: 'frontend', backend: 'backend', database: 'database',
  cloud: 'cloud', devops: 'devops', obs: 'observabilidade',
  ai: 'ai & llm', arch: 'arquitetura', cs: 'fundamentos cs',
  sec: 'segurança', soft: 'soft skills',
}
const TYPE_META: Record<string, { label: string; color: string; dot: string }> = {
  teoria:  { label: 'teoria',  color: '#f59e0b', dot: '📖' },
  pratica: { label: 'prática', color: '#3b82f6', dot: '⌨️' },
  revisao: { label: 'revisão', color: '#a78bfa', dot: '🔄' },
  system:  { label: 'system',  color: '#ef4444', dot: '🏗' },
  leitura: { label: 'leitura', color: '#22c55e', dot: '📄' },
}

type Block = { time: string; end: string; type: string; cat: string; skills: string[] }
type Day   = { day: string; short: string; blocks: Block[] }

// Semana 1 — atual (fundamentos CS + bases frontend/backend)
// Pré-requisitos de tudo: Big-O → Algoritmos, TCP/IP → TLS → HTTP, Event Loop → Node
const WEEK: Day[] = [
  { day: 'Segunda', short: 'Seg', blocks: [
    { time: '07:00', end: '08:00', type: 'teoria', cat: 'cs',       skills: ['Big-O', 'Algoritmos & DS'] },
    { time: '20:00', end: '21:00', type: 'teoria', cat: 'cs',       skills: ['Event Loop', 'Memory Management'] },
  ]},
  { day: 'Terça', short: 'Ter', blocks: [
    { time: '07:00', end: '08:00', type: 'teoria', cat: 'cs',       skills: ['TCP/IP & DNS', 'TLS / HTTPS'] },
    { time: '20:00', end: '21:00', type: 'teoria', cat: 'cs',       skills: ['HTTP/2 & HTTP/3', 'Processos & Threads'] },
  ]},
  { day: 'Quarta', short: 'Qua', blocks: [
    { time: '07:00', end: '08:00', type: 'teoria', cat: 'cs',       skills: ['CAP Theorem', 'B-tree & LSM-tree'] },
    { time: '20:00', end: '21:00', type: 'teoria', cat: 'cs',       skills: ['Dynamic Programming'] },
  ]},
  { day: 'Quinta', short: 'Qui', blocks: [
    { time: '07:00', end: '08:00', type: 'teoria', cat: 'database', skills: ['MVCC', 'EXPLAIN ANALYZE'] },
    { time: '20:00', end: '21:00', type: 'pratica', cat: 'database', skills: ['PostgreSQL'] },
  ]},
  { day: 'Sexta', short: 'Sex', blocks: [
    { time: '07:00', end: '08:00', type: 'teoria', cat: 'arch',     skills: ['SOLID', 'Dependency Injection'] },
    { time: '20:00', end: '21:00', type: 'leitura', cat: 'sec',     skills: ['OWASP Top 10', 'Threat Modeling'] },
  ]},
  { day: 'Sábado', short: 'Sáb', blocks: [
    { time: '09:00', end: '10:30', type: 'system', cat: 'arch',     skills: ['System Design', 'Tradeoff Analysis'] },
    { time: '10:30', end: '11:30', type: 'pratica', cat: 'cs',      skills: ['Algoritmos & DS'] },
    { time: '15:00', end: '16:00', type: 'revisao', cat: 'mix',     skills: ['(revisão: Big-O, TCP/IP, SOLID)'] },
  ]},
  { day: 'Domingo', short: 'Dom', blocks: [
    { time: '10:00', end: '11:00', type: 'leitura', cat: 'cs',      skills: ['Consistent Hashing', 'Raft / Paxos'] },
    { time: '11:00', end: '11:30', type: 'leitura', cat: 'cs',      skills: ['CRDTs'] },
  ]},
]

// Semanas futuras — plano completo de 8 semanas para cobrir as 80 skills em ordem de dependência
type WeekPlan = {
  n: number
  title: string
  theme: string
  focus: string
  days: Day[]
}

const FUTURE_WEEKS: WeekPlan[] = [
  {
    n: 2, title: 'Node.js, Backend core & Linux',
    theme: 'backend + devops',
    focus: 'Node depende de Event Loop ✓ · Linux desbloqueia Docker, AWS, Prometheus',
    days: [
      { day: 'Segunda', short: 'Seg', blocks: [
        { time: '07:00', end: '08:00', type: 'teoria', cat: 'backend', skills: ['Node.js', 'Concurrency'] },
        { time: '20:00', end: '21:00', type: 'pratica', cat: 'backend', skills: ['Node.js'] },
      ]},
      { day: 'Terça', short: 'Ter', blocks: [
        { time: '07:00', end: '08:00', type: 'teoria', cat: 'devops', skills: ['Linux'] },
        { time: '20:00', end: '21:00', type: 'pratica', cat: 'devops', skills: ['Linux'] },
      ]},
      { day: 'Quarta', short: 'Qua', blocks: [
        { time: '07:00', end: '08:00', type: 'teoria', cat: 'backend', skills: ['JWT', 'OWASP API Top 10'] },
        { time: '20:00', end: '21:00', type: 'teoria', cat: 'backend', skills: ['Rate Limiting'] },
      ]},
      { day: 'Quinta', short: 'Qui', blocks: [
        { time: '07:00', end: '08:00', type: 'teoria', cat: 'database', skills: ['Redis'] },
        { time: '20:00', end: '21:00', type: 'pratica', cat: 'database', skills: ['Redis'] },
      ]},
      { day: 'Sexta', short: 'Sex', blocks: [
        { time: '07:00', end: '08:00', type: 'teoria', cat: 'devops', skills: ['TDD', 'Playwright'] },
        { time: '20:00', end: '21:00', type: 'leitura', cat: 'devops', skills: ['GitHub Actions'] },
      ]},
      { day: 'Sábado', short: 'Sáb', blocks: [
        { time: '09:00', end: '10:30', type: 'system', cat: 'arch', skills: ['System Design'] },
        { time: '10:30', end: '11:30', type: 'pratica', cat: 'devops', skills: ['Linux', 'GitHub Actions'] },
        { time: '15:00', end: '16:00', type: 'revisao', cat: 'mix', skills: ['(revisão: Node.js, Redis, TDD)'] },
      ]},
      { day: 'Domingo', short: 'Dom', blocks: [
        { time: '10:00', end: '11:00', type: 'leitura', cat: 'backend', skills: ['Caching Strategies'] },
        { time: '11:00', end: '11:30', type: 'leitura', cat: 'soft', skills: ['Inglês'] },
      ]},
    ],
  },
  {
    n: 3, title: 'Docker, Cloud AWS & Observabilidade',
    theme: 'cloud + devops + obs',
    focus: 'Docker depende de Linux ✓ · AWS desbloqueia EC2, S3, Lambda, RDS, IAM, VPC, Terraform',
    days: [
      { day: 'Segunda', short: 'Seg', blocks: [
        { time: '07:00', end: '08:00', type: 'teoria', cat: 'devops', skills: ['Docker Compose'] },
        { time: '20:00', end: '21:00', type: 'pratica', cat: 'devops', skills: ['Docker Compose'] },
      ]},
      { day: 'Terça', short: 'Ter', blocks: [
        { time: '07:00', end: '08:00', type: 'teoria', cat: 'cloud', skills: ['AWS', 'IAM'] },
        { time: '20:00', end: '21:00', type: 'teoria', cat: 'cloud', skills: ['VPC', 'EC2'] },
      ]},
      { day: 'Quarta', short: 'Qua', blocks: [
        { time: '07:00', end: '08:00', type: 'teoria', cat: 'cloud', skills: ['S3', 'Lambda'] },
        { time: '20:00', end: '21:00', type: 'teoria', cat: 'cloud', skills: ['RDS', 'Terraform'] },
      ]},
      { day: 'Quinta', short: 'Qui', blocks: [
        { time: '07:00', end: '08:00', type: 'teoria', cat: 'obs', skills: ['Prometheus', 'Grafana'] },
        { time: '20:00', end: '21:00', type: 'teoria', cat: 'obs', skills: ['OpenTelemetry', 'SLIs / SLOs / SLAs'] },
      ]},
      { day: 'Sexta', short: 'Sex', blocks: [
        { time: '07:00', end: '08:00', type: 'teoria', cat: 'devops', skills: ['Kubernetes'] },
        { time: '20:00', end: '21:00', type: 'leitura', cat: 'sec', skills: ['Threat Modeling'] },
      ]},
      { day: 'Sábado', short: 'Sáb', blocks: [
        { time: '09:00', end: '10:30', type: 'system', cat: 'arch', skills: ['System Design'] },
        { time: '10:30', end: '11:30', type: 'pratica', cat: 'cloud', skills: ['AWS', 'Terraform'] },
        { time: '15:00', end: '16:00', type: 'revisao', cat: 'mix', skills: ['(revisão: Docker, AWS, Prometheus)'] },
      ]},
      { day: 'Domingo', short: 'Dom', blocks: [
        { time: '10:00', end: '11:00', type: 'leitura', cat: 'cloud', skills: ['IAM', 'VPC'] },
        { time: '11:00', end: '11:30', type: 'leitura', cat: 'soft', skills: ['Inglês'] },
      ]},
    ],
  },
  {
    n: 4, title: 'Arquitetura: Clean, DDD, CQRS, Microservices',
    theme: 'arch + backend',
    focus: 'Clean depende de SOLID ✓ · DDD depende de Clean ✓ · CQRS depende de DDD + Event-Driven',
    days: [
      { day: 'Segunda', short: 'Seg', blocks: [
        { time: '07:00', end: '08:00', type: 'teoria', cat: 'arch', skills: ['Clean Architecture'] },
        { time: '20:00', end: '21:00', type: 'teoria', cat: 'arch', skills: ['DDD'] },
      ]},
      { day: 'Terça', short: 'Ter', blocks: [
        { time: '07:00', end: '08:00', type: 'teoria', cat: 'arch', skills: ['Event-Driven', 'CQRS'] },
        { time: '20:00', end: '21:00', type: 'teoria', cat: 'arch', skills: ['Microservices'] },
      ]},
      { day: 'Quarta', short: 'Qua', blocks: [
        { time: '07:00', end: '08:00', type: 'teoria', cat: 'arch', skills: ['Circuit Breakers', 'Design Patterns'] },
        { time: '20:00', end: '21:00', type: 'teoria', cat: 'backend', skills: ['Apache Kafka'] },
      ]},
      { day: 'Quinta', short: 'Qui', blocks: [
        { time: '07:00', end: '08:00', type: 'teoria', cat: 'arch', skills: ['Chaos Engineering'] },
        { time: '20:00', end: '21:00', type: 'teoria', cat: 'backend', skills: ['NestJS'] },
      ]},
      { day: 'Sexta', short: 'Sex', blocks: [
        { time: '07:00', end: '08:00', type: 'teoria', cat: 'database', skills: ['Sharding', 'Consistent Hashing'] },
        { time: '20:00', end: '21:00', type: 'leitura', cat: 'database', skills: ['Elasticsearch', 'Raft / Paxos'] },
      ]},
      { day: 'Sábado', short: 'Sáb', blocks: [
        { time: '09:00', end: '10:30', type: 'system', cat: 'arch', skills: ['Microservices', 'CQRS'] },
        { time: '10:30', end: '11:30', type: 'pratica', cat: 'arch', skills: ['Clean Architecture', 'DDD'] },
        { time: '15:00', end: '16:00', type: 'revisao', cat: 'mix', skills: ['(revisão: Event-Driven, Kafka, Circuit Breakers)'] },
      ]},
      { day: 'Domingo', short: 'Dom', blocks: [
        { time: '10:00', end: '11:00', type: 'leitura', cat: 'arch', skills: ['CRDTs', 'Chaos Engineering'] },
        { time: '11:00', end: '11:30', type: 'leitura', cat: 'soft', skills: ['Inglês'] },
      ]},
    ],
  },
  {
    n: 5, title: 'Frontend moderno: React ecosystem',
    theme: 'frontend',
    focus: 'React Query, tRPC, Server Components, Tailwind, Design Systems, Web Vitals, Accessibility',
    days: [
      { day: 'Segunda', short: 'Seg', blocks: [
        { time: '07:00', end: '08:00', type: 'teoria', cat: 'frontend', skills: ['React Query', 'Server Components (RSC)'] },
        { time: '20:00', end: '21:00', type: 'pratica', cat: 'frontend', skills: ['Next.js', 'tRPC'] },
      ]},
      { day: 'Terça', short: 'Ter', blocks: [
        { time: '07:00', end: '08:00', type: 'teoria', cat: 'frontend', skills: ['Tailwind CSS', 'Design Systems'] },
        { time: '20:00', end: '21:00', type: 'pratica', cat: 'frontend', skills: ['Tailwind CSS'] },
      ]},
      { day: 'Quarta', short: 'Qua', blocks: [
        { time: '07:00', end: '08:00', type: 'teoria', cat: 'frontend', skills: ['Web Vitals', 'Accessibility (a11y)'] },
        { time: '20:00', end: '21:00', type: 'pratica', cat: 'frontend', skills: ['Accessibility (a11y)'] },
      ]},
      { day: 'Quinta', short: 'Qui', blocks: [
        { time: '07:00', end: '08:00', type: 'teoria', cat: 'backend', skills: ['Prisma', 'PostgreSQL'] },
        { time: '20:00', end: '21:00', type: 'pratica', cat: 'backend', skills: ['Prisma'] },
      ]},
      { day: 'Sexta', short: 'Sex', blocks: [
        { time: '07:00', end: '08:00', type: 'teoria', cat: 'devops', skills: ['Playwright', 'TDD'] },
        { time: '20:00', end: '21:00', type: 'leitura', cat: 'frontend', skills: ['Web Vitals'] },
      ]},
      { day: 'Sábado', short: 'Sáb', blocks: [
        { time: '09:00', end: '10:30', type: 'system', cat: 'arch', skills: ['System Design'] },
        { time: '10:30', end: '11:30', type: 'pratica', cat: 'frontend', skills: ['Server Components (RSC)', 'tRPC'] },
        { time: '15:00', end: '16:00', type: 'revisao', cat: 'mix', skills: ['(revisão: React Query, Tailwind, Prisma)'] },
      ]},
      { day: 'Domingo', short: 'Dom', blocks: [
        { time: '10:00', end: '11:00', type: 'leitura', cat: 'frontend', skills: ['Design Systems', 'Accessibility (a11y)'] },
        { time: '11:00', end: '11:30', type: 'leitura', cat: 'soft', skills: ['Inglês'] },
      ]},
    ],
  },
  {
    n: 6, title: 'AI & LLM core',
    theme: 'ai',
    focus: 'Prompt Engineering → RAG → Agentic → MCP → LangGraph · Fine-tuning (LoRA) via Hugging Face',
    days: [
      { day: 'Segunda', short: 'Seg', blocks: [
        { time: '07:00', end: '08:00', type: 'teoria', cat: 'ai', skills: ['Prompt Engineering', 'AI Guardrails'] },
        { time: '20:00', end: '21:00', type: 'teoria', cat: 'ai', skills: ['RAG', 'RAGAS'] },
      ]},
      { day: 'Terça', short: 'Ter', blocks: [
        { time: '07:00', end: '08:00', type: 'teoria', cat: 'ai', skills: ['Agentic Workflows', 'Function Calling'] },
        { time: '20:00', end: '21:00', type: 'teoria', cat: 'ai', skills: ['MCP', 'LangGraph'] },
      ]},
      { day: 'Quarta', short: 'Qua', blocks: [
        { time: '07:00', end: '08:00', type: 'teoria', cat: 'ai', skills: ['Anthropic SDK', 'OpenAI SDK'] },
        { time: '20:00', end: '21:00', type: 'pratica', cat: 'ai', skills: ['RAG', 'Anthropic SDK'] },
      ]},
      { day: 'Quinta', short: 'Qui', blocks: [
        { time: '07:00', end: '08:00', type: 'teoria', cat: 'ai', skills: ['Hugging Face', 'Fine-tuning (LoRA)'] },
        { time: '20:00', end: '21:00', type: 'teoria', cat: 'ai', skills: ['LLMOps'] },
      ]},
      { day: 'Sexta', short: 'Sex', blocks: [
        { time: '07:00', end: '08:00', type: 'teoria', cat: 'database', skills: ['Qdrant', 'HNSW / IVF'] },
        { time: '20:00', end: '21:00', type: 'leitura', cat: 'ai', skills: ['AI Guardrails', 'LLMOps'] },
      ]},
      { day: 'Sábado', short: 'Sáb', blocks: [
        { time: '09:00', end: '10:30', type: 'system', cat: 'arch', skills: ['System Design'] },
        { time: '10:30', end: '11:30', type: 'pratica', cat: 'ai', skills: ['MCP', 'LangGraph'] },
        { time: '15:00', end: '16:00', type: 'revisao', cat: 'mix', skills: ['(revisão: RAG, Agentic, Fine-tuning)'] },
      ]},
      { day: 'Domingo', short: 'Dom', blocks: [
        { time: '10:00', end: '11:00', type: 'leitura', cat: 'ai', skills: ['Hugging Face', 'Qdrant'] },
        { time: '11:00', end: '11:30', type: 'leitura', cat: 'soft', skills: ['Inglês'] },
      ]},
    ],
  },
  {
    n: 7, title: 'Database avançado & Backend específico',
    theme: 'database + backend',
    focus: 'PostgreSQL avançado, Elasticsearch, sharding, Prisma em prática, Grafana / Prometheus real',
    days: [
      { day: 'Segunda', short: 'Seg', blocks: [
        { time: '07:00', end: '08:00', type: 'teoria', cat: 'database', skills: ['EXPLAIN ANALYZE', 'PostgreSQL'] },
        { time: '20:00', end: '21:00', type: 'pratica', cat: 'database', skills: ['EXPLAIN ANALYZE'] },
      ]},
      { day: 'Terça', short: 'Ter', blocks: [
        { time: '07:00', end: '08:00', type: 'teoria', cat: 'database', skills: ['Elasticsearch', 'Qdrant'] },
        { time: '20:00', end: '21:00', type: 'teoria', cat: 'database', skills: ['Sharding', 'B-tree & LSM-tree'] },
      ]},
      { day: 'Quarta', short: 'Qua', blocks: [
        { time: '07:00', end: '08:00', type: 'teoria', cat: 'obs', skills: ['Grafana', 'Prometheus'] },
        { time: '20:00', end: '21:00', type: 'pratica', cat: 'obs', skills: ['Grafana', 'OpenTelemetry'] },
      ]},
      { day: 'Quinta', short: 'Qui', blocks: [
        { time: '07:00', end: '08:00', type: 'teoria', cat: 'backend', skills: ['NestJS', 'Prisma'] },
        { time: '20:00', end: '21:00', type: 'pratica', cat: 'backend', skills: ['NestJS'] },
      ]},
      { day: 'Sexta', short: 'Sex', blocks: [
        { time: '07:00', end: '08:00', type: 'teoria', cat: 'sec', skills: ['OWASP API Top 10', 'Threat Modeling'] },
        { time: '20:00', end: '21:00', type: 'leitura', cat: 'arch', skills: ['Chaos Engineering'] },
      ]},
      { day: 'Sábado', short: 'Sáb', blocks: [
        { time: '09:00', end: '10:30', type: 'system', cat: 'arch', skills: ['System Design'] },
        { time: '10:30', end: '11:30', type: 'pratica', cat: 'database', skills: ['PostgreSQL', 'Redis'] },
        { time: '15:00', end: '16:00', type: 'revisao', cat: 'mix', skills: ['(revisão: Elasticsearch, Grafana, NestJS)'] },
      ]},
      { day: 'Domingo', short: 'Dom', blocks: [
        { time: '10:00', end: '11:00', type: 'leitura', cat: 'database', skills: ['MVCC', 'Raft / Paxos'] },
        { time: '11:00', end: '11:30', type: 'leitura', cat: 'soft', skills: ['Inglês'] },
      ]},
    ],
  },
  {
    n: 8, title: 'Consolidação & revisão geral',
    theme: 'mix',
    focus: 'Fechar gaps, revisão spaced repetition de tudo, system design livre, inglês técnico',
    days: [
      { day: 'Segunda', short: 'Seg', blocks: [
        { time: '07:00', end: '08:00', type: 'revisao', cat: 'cs', skills: ['Algoritmos & DS', 'Dynamic Programming'] },
        { time: '20:00', end: '21:00', type: 'revisao', cat: 'arch', skills: ['Clean Architecture', 'DDD'] },
      ]},
      { day: 'Terça', short: 'Ter', blocks: [
        { time: '07:00', end: '08:00', type: 'revisao', cat: 'cloud', skills: ['AWS', 'Terraform', 'Kubernetes'] },
        { time: '20:00', end: '21:00', type: 'revisao', cat: 'ai', skills: ['RAG', 'MCP', 'LangGraph'] },
      ]},
      { day: 'Quarta', short: 'Qua', blocks: [
        { time: '07:00', end: '08:00', type: 'revisao', cat: 'database', skills: ['PostgreSQL', 'Redis', 'Elasticsearch'] },
        { time: '20:00', end: '21:00', type: 'revisao', cat: 'sec', skills: ['OWASP Top 10', 'OWASP API Top 10'] },
      ]},
      { day: 'Quinta', short: 'Qui', blocks: [
        { time: '07:00', end: '08:00', type: 'revisao', cat: 'frontend', skills: ['Server Components (RSC)', 'Web Vitals'] },
        { time: '20:00', end: '21:00', type: 'revisao', cat: 'obs', skills: ['OpenTelemetry', 'SLIs / SLOs / SLAs'] },
      ]},
      { day: 'Sexta', short: 'Sex', blocks: [
        { time: '07:00', end: '08:00', type: 'revisao', cat: 'arch', skills: ['Microservices', 'CQRS', 'Circuit Breakers'] },
        { time: '20:00', end: '21:00', type: 'leitura', cat: 'soft', skills: ['Inglês'] },
      ]},
      { day: 'Sábado', short: 'Sáb', blocks: [
        { time: '09:00', end: '10:30', type: 'system', cat: 'arch', skills: ['System Design', 'Tradeoff Analysis'] },
        { time: '10:30', end: '11:30', type: 'revisao', cat: 'mix', skills: ['(skills marcadas como revisar)'] },
        { time: '15:00', end: '16:00', type: 'revisao', cat: 'mix', skills: ['(revisão geral livre)'] },
      ]},
      { day: 'Domingo', short: 'Dom', blocks: [
        { time: '10:00', end: '11:00', type: 'leitura', cat: 'cs', skills: ['Consistent Hashing', 'CRDTs'] },
        { time: '11:00', end: '11:30', type: 'leitura', cat: 'soft', skills: ['Inglês'] },
      ]},
    ],
  },
]

const PRINCIPIOS = [
  { n: '01', h: 'Pequeno e diário', p: 'Sessão de 60–90min consistente bate maratona de 4h no sábado. A curva de esquecimento (Ebbinghaus) preda quem estuda em rajadas.' },
  { n: '02', h: 'Teoria → exemplo → defender', p: 'Cada P1 passa por três camadas: leu o conceito, escreveu um exemplo próprio, conseguiu explicar em voz alta sem consultar.' },
  { n: '03', h: 'Spaced repetition', p: 'Revisita o que estudou em 3 dias, 1 semana e 1 mês. O sistema sugere automaticamente baseado no updatedAt.' },
  { n: '04', h: 'System design 1×/semana', p: 'Sábado de manhã, 1h, 1 problema. Trace requisitos, calcule capacity, desenhe, justifique tradeoffs em texto.' },
  { n: '05', h: 'Pomodoro 25/5 ou Flowtime 50/10', p: 'Pomodoro pro foco protegido. Flowtime quando o tema pede imersão mais longa (system design, debug de conceito).' },
  { n: '06', h: 'Feynman test', p: 'Sempre escrever resumo próprio depois de estudar. Se não consegue explicar simples, não entendeu — volta pra fonte.' },
]

type RitualItem = { time: string; title: string; body: string }
const RITUAL: RitualItem[] = [
  { time: '5min',  title: 'Preview', body: 'Abre a skill no painel, lê o tagline e os três primeiros bullets de "conceitos-chave". Define em uma frase: "hoje vou entender X". Sem isso, você vagueia.' },
  { time: '60min', title: 'Teoria com fonte boa', body: 'Hierarquia de fonte: docs oficiais primeiro, artigos técnicos (Hussein Nasser, Marc Brooker, AWS Builder Library), vídeo apenas se conceito for visual (event loop, MVCC), livro pra deep dive de fim de semana.' },
  { time: '10min', title: 'Resumo próprio (Feynman)', body: 'Escreve nas Notas da skill como se estivesse explicando pra um júnior. Sem copiar da fonte. Se travar, voltou faltando entendimento — anota a dúvida.' },
  { time: '5min',  title: 'Marca dúvida e próximo passo', body: 'Lista 1–3 perguntas que ficaram. Marca o estado da skill (lendo / praticando / domino). Se for revisar, agenda mentalmente pra dali 3 dias.' },
]

type IVWeek = { n: string; title: string; focus: string; desc: string; skills: string[] }
const IV_WEEKS: IVWeek[] = [
  { n: '01', title: 'Fundamentos & contrato HTTP', focus: 'cai em 9 de 10 entrevistas', desc: 'Sem fundamentos sólidos a entrevista vira chute. Saber explicar como um pacote sai do navegador até o banco é meio caminho pra qualquer pergunta de sênior.', skills: ['Algoritmos & DS', 'Big-O', 'Dynamic Programming', 'TCP/IP & DNS', 'TLS / HTTPS', 'HTTP/2 & HTTP/3', 'REST APIs', 'System Design', 'Tradeoff Analysis'] },
  { n: '02', title: 'Persistência, cache e concorrência', focus: 'separa pleno de sênior', desc: 'PostgreSQL profundo, padrões de cache (cache-aside, write-through), event loop e concorrência em Node. São os tópicos que mais geram pergunta de follow-up.', skills: ['PostgreSQL', 'MVCC', 'B-tree & LSM-tree', 'EXPLAIN ANALYZE', 'Caching Strategies', 'Redis', 'Concurrency', 'Event Loop', 'CAP Theorem'] },
  { n: '03', title: 'Arquitetura, mensageria e patterns', focus: 'pergunta de design tomando café', desc: 'Como você defenderia essa arquitetura? SOLID, Clean, DDD, CQRS, microservices, eventos, kafka. Tem que conseguir desenhar e justificar tradeoffs.', skills: ['SOLID', 'Clean Architecture', 'DDD', 'CQRS', 'Microservices', 'Event-Driven', 'Apache Kafka', 'Circuit Breakers', 'Rate Limiting', 'Design Patterns'] },
  { n: '04', title: 'Cloud, observabilidade, security e AI', focus: 'fechar tudo + temas quentes 2026', desc: 'AWS core (IAM/VPC/S3/Lambda), pilares de observabilidade, OWASP e os tópicos hot de AI moderno (RAG, MCP, Agentic). Assunto que cai e poucos sabem direito.', skills: ['AWS', 'IAM', 'VPC', 'S3', 'Lambda', 'OpenTelemetry', 'Prometheus', 'SLIs / SLOs / SLAs', 'OWASP Top 10', 'OWASP API Top 10', 'RAG', 'Function Calling', 'Agentic Workflows', 'MCP'] },
]

/* ─── Helpers ─── */
const DAY_MS = 24 * 60 * 60 * 1000
const STORAGE_KEY = 'careerstudy.progress.v1'
const CHECK_KEY = 'careerstudy.routine.checks.v1'

type StoreEntry = { state: ProgressState; updatedAt: number; notes?: string }
type Store = Record<string, StoreEntry>

function loadStore(): Store {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
}
function loadChecks(): Record<string, boolean> {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem(CHECK_KEY) || '{}') } catch { return {} }
}
function saveChecks(c: Record<string, boolean>) {
  try { localStorage.setItem(CHECK_KEY, JSON.stringify(c)) } catch {}
}

function ageHuman(ageMs: number): string {
  const d = Math.floor(ageMs / DAY_MS)
  if (d < 1) return 'hoje'
  if (d === 1) return '1 dia atrás'
  if (d < 7) return `${d} dias atrás`
  const w = Math.floor(d / 7)
  if (w === 1) return '1 semana atrás'
  if (d < 30) return `${w} semanas atrás`
  return `${Math.floor(d / 30)} meses atrás`
}

type Suggestion = { tag: 'praticar' | 'revisar'; text: string }
function suggestionFor(state: ProgressState, ageDays: number): Suggestion | null {
  if (state === 'lendo'      && ageDays >= 3)  return { tag: 'praticar', text: 'tempo de praticar' }
  if (state === 'praticando' && ageDays >= 7)  return { tag: 'revisar',  text: 'revisitar pra fixar' }
  if (state === 'domino'     && ageDays >= 30) return { tag: 'revisar',  text: 'revisão de manutenção' }
  if (state === 'revisar')                     return { tag: 'revisar',  text: 'na fila de revisão' }
  return null
}

/* ─── Small components ─── */
function SkillChip({ name, checked, onCheck }: { name: string; checked: boolean; onCheck: () => void }) {
  if (name.startsWith('(')) {
    return <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'var(--fg-dim)', fontStyle: 'italic' }}>{name}</span>
  }
  const s = SKILL_BY_NAME[name]
  const url = s ? iconUrl(s.name) : null
  const href = s ? `/skill/${s.slug}` : null

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {/* Checkbox */}
      <button
        onClick={e => { e.preventDefault(); e.stopPropagation(); onCheck() }}
        title={checked ? 'Desmarcar' : 'Marcar como feito hoje'}
        style={{
          width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${checked ? 'var(--scarlet)' : 'var(--line)'}`,
          background: checked ? 'var(--scarlet)' : 'transparent',
          cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all .15s', padding: 0,
        }}
      >
        {checked && <span style={{ color: '#fff', fontSize: 9, lineHeight: 1, fontWeight: 700 }}>✓</span>}
      </button>

      {/* Skill link or plain text */}
      {href ? (
        <Link href={href} style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontFamily: "'JetBrains Mono',monospace", fontSize: 12,
          color: checked ? 'var(--fg-dim)' : 'var(--fg)',
          textDecoration: checked ? 'line-through' : 'none',
          textDecorationColor: 'var(--fg-dim)',
          transition: 'color .15s',
        }}
          onMouseEnter={e => { if (!checked) e.currentTarget.style.color = 'var(--scarlet)' }}
          onMouseLeave={e => { e.currentTarget.style.color = checked ? 'var(--fg-dim)' : 'var(--fg)' }}
        >
          {url && <img src={url} alt="" style={{ width: 12, height: 12, flexShrink: 0, opacity: checked ? 0.4 : 1 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />}
          {name}
        </Link>
      ) : (
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: 'var(--fg-dim)' }}>{name}</span>
      )}
    </div>
  )
}

function RitualAccordion({ item }: { item: RitualItem }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ background: 'var(--bg-card)', border: `1px solid ${open ? 'var(--scarlet)' : 'var(--line)'}`, borderRadius: 10, overflow: 'hidden', transition: 'border-color .15s' }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: '100%', cursor: 'pointer', padding: '13px 18px', background: 'transparent', border: 'none', fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 12, color: 'var(--fg)', textAlign: 'left' }}>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--scarlet)', background: 'var(--scarlet-soft)', padding: '3px 8px', borderRadius: 5, letterSpacing: '.08em', flexShrink: 0 }}>{item.time}</span>
        {item.title}
        <span style={{ marginLeft: 'auto', color: open ? 'var(--scarlet)' : 'var(--fg-dim)', fontFamily: "'JetBrains Mono',monospace", fontSize: 10, transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .2s, color .2s' }}>▶</span>
      </button>
      {open && <div style={{ padding: '10px 18px 16px', fontSize: 13, color: 'var(--fg-mute)', lineHeight: 1.7, borderTop: '1px solid var(--line)' }}>{item.body}</div>}
    </div>
  )
}

/* ─── Main page ─── */
export default function RoutinePage() {
  const [mode, setModeState] = useState<'routine' | 'roadmap'>('routine')
  const [checks, setChecks] = useState<Record<string, boolean>>({})
  const [reviewItems, setReviewItems] = useState<Array<{
    slug: string; name: string; state: ProgressState; ageMs: number; sugg: Suggestion
  }>>([])
  const { mounted } = useProgress(ALL_SKILLS)

  const [todayIdx, setTodayIdx] = useState<number | null>(null)

  useEffect(() => {
    const d = new Date().getDay()
    setTodayIdx(d === 0 ? 6 : d - 1)
    const saved = localStorage.getItem('careerstudy.routine.mode')
    if (saved === 'roadmap') setModeState('roadmap')
    setChecks(loadChecks())
  }, [])

  function setMode(m: 'routine' | 'roadmap') {
    setModeState(m)
    try { localStorage.setItem('careerstudy.routine.mode', m) } catch {}
  }

  const handleCheck = useCallback((rawKey: string) => {
    setChecks(prev => {
      let next: Record<string, boolean>
      if (rawKey.endsWith('__clear')) {
        // This key format means clear — but we handle clear differently below
        return prev
      }
      next = { ...prev, [rawKey]: !prev[rawKey] }
      saveChecks(next)
      return next
    })
  }, [])

  // Clear all checks for a day
  const handleClearDay = useCallback((di: number) => {
    setChecks(prev => {
      const next = { ...prev }
      WEEK[di].blocks.forEach(b => b.skills.forEach(n => { delete next[`${di}-${n}`] }))
      saveChecks(next)
      return next
    })
  }, [])

  useEffect(() => {
    function compute() {
      const store = loadStore()
      const now = Date.now()
      const stateRank: Record<string, number> = { revisar: 0, praticando: 1, lendo: 2, domino: 3 }
      const items: typeof reviewItems = []
      for (const [slug, data] of Object.entries(store)) {
        const skill = SKILL_BY_SLUG[slug]
        if (!skill) continue
        const ageMs = now - (data.updatedAt || now)
        const sugg = suggestionFor(data.state, Math.floor(ageMs / DAY_MS))
        if (!sugg) continue
        items.push({ slug, name: skill.name, state: data.state, ageMs, sugg })
      }
      items.sort((a, b) => {
        const r = (stateRank[a.state] ?? 9) - (stateRank[b.state] ?? 9)
        return r !== 0 ? r : b.ageMs - a.ageMs
      })
      setReviewItems(items)
    }
    if (mounted) compute()
    const handler = () => { if (mounted) compute() }
    window.addEventListener('progress-change', handler)
    return () => window.removeEventListener('progress-change', handler)
  }, [mounted])

  // Patch clear handler into WeekAgenda via a wrapper
  const handleCheckOrClear = useCallback((rawKey: string) => {
    if (rawKey.endsWith('__clear')) return
    handleCheck(rawKey)
  }, [handleCheck])

  return (
    <>
      <Nav />
      <div className="shell">

        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg,rgba(239,68,68,.06),rgba(168,85,247,.04))', border: '1px solid var(--scarlet-soft)', borderRadius: 16, padding: '26px 30px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 90% 10%,rgba(239,68,68,.14),transparent 55%)', pointerEvents: 'none' }} />
          <p className="hdr-label"><span className="ln" /> rotina de estudo</p>
          <h1>Cadência <em style={{ color: 'var(--scarlet)', fontStyle: 'normal' }}>realista</em>.</h1>
          <p className="desc" style={{ marginBottom: 0, maxWidth: 680 }}>
            60–90min/dia bem usados batem 4h no fim de semana. Foco em P1, rotação por categoria, checks de progresso diário.
          </p>
        </div>

        {/* Mode toggle */}
        <div style={{ display: 'flex', gap: 6, background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 12, padding: 5, marginBottom: 28, position: 'sticky', top: 80, zIndex: 30, backdropFilter: 'blur(10px)' }}>
          {(['routine', 'roadmap'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: '10px 16px', border: 'none', borderRadius: 8, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '.04em', cursor: 'pointer', transition: 'all .15s', background: mode === m ? 'var(--scarlet)' : 'transparent', color: mode === m ? '#fff' : 'var(--fg-mute)', boxShadow: mode === m ? '0 4px 14px rgba(239,68,68,.25)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              {m === 'routine'
                ? <>Semana atual <span style={{ fontSize: 9, opacity: .7, letterSpacing: '.1em' }}>com checks diários</span></>
                : <>Roadmap 8 semanas <span style={{ fontSize: 9, opacity: .7, letterSpacing: '.1em' }}>80 skills em ordem</span></>}
            </button>
          ))}
        </div>

        {/* ── SEMANA ATUAL ── */}
        {mode === 'routine' && (
          <>
            {/* Weekly agenda */}
            <section style={{ marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 16 }}>
                <p className="hdr-label" style={{ margin: 0 }}><span className="ln" /> semana 1 · fundamentos cs + bases</p>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--fg-dim)' }}>clique no dia para expandir · marque ✓ conforme avança</span>
              </div>
              <WeekAgendaWithClear todayIdx={todayIdx} checks={checks} onCheck={handleCheckOrClear} onClear={handleClearDay} />
            </section>

            {/* Philosophy */}
            <section style={{ marginBottom: 40 }}>
              <p className="hdr-label"><span className="ln" /> filosofia</p>
              <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>
                {PRINCIPIOS.map(p => (
                  <div key={p.n} style={{ background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 12, padding: '16px 18px', transition: 'border-color .2s,transform .2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--line-2)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.transform = 'none' }}
                  >
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: 'var(--scarlet)', letterSpacing: '.12em', marginBottom: 6 }}>{p.n}</div>
                    <h4 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 5, lineHeight: 1.3 }}>{p.h}</h4>
                    <p style={{ fontSize: 12, color: 'var(--fg-mute)', lineHeight: 1.6, margin: 0 }}>{p.p}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Ritual */}
            <section style={{ marginBottom: 40 }}>
              <p className="hdr-label"><span className="ln" /> ritual de 80min</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {RITUAL.map(r => <RitualAccordion key={r.title} item={r} />)}
              </div>
            </section>

            {/* Spaced repetition */}
            <section style={{ marginBottom: 48 }}>
              <p className="hdr-label"><span className="ln" /> spaced repetition · sugestões de revisão</p>
              <p className="desc" style={{ marginBottom: 14, maxWidth: 680 }}>
                Baseado no <code style={{ background: 'var(--bg-elev)', padding: '2px 5px', borderRadius: 4, fontFamily: "'JetBrains Mono',monospace", fontSize: '.9em', color: 'var(--scarlet)' }}>updatedAt</code> de cada skill. Revisitar em 3 dias / 1 semana / 1 mês mantém o conhecimento vivo.
              </p>
              {!mounted ? (
                <div style={{ background: 'var(--bg-card)', border: '1px dashed var(--line)', borderRadius: 12, padding: 32, textAlign: 'center', color: 'var(--fg-dim)', fontSize: 13 }}>Carregando...</div>
              ) : reviewItems.length === 0 ? (
                <div style={{ background: 'var(--bg-card)', border: '1px dashed var(--line)', borderRadius: 12, padding: 32, textAlign: 'center', color: 'var(--fg-dim)', fontSize: 13 }}>
                  <p style={{ marginBottom: 6 }}><strong style={{ color: 'var(--fg)' }}>Nada pra revisar agora.</strong></p>
                  <p style={{ fontSize: 12 }}>Marca skills como <code style={{ background: 'var(--bg-elev)', padding: '1px 5px', borderRadius: 4, color: 'var(--amber)', fontFamily: "'JetBrains Mono',monospace" }}>lendo</code> ou <code style={{ background: 'var(--bg-elev)', padding: '1px 5px', borderRadius: 4, color: 'var(--blue)', fontFamily: "'JetBrains Mono',monospace" }}>praticando</code> no painel da skill — aparecem aqui quando passarem do limite.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {reviewItems.map(it => {
                    const url = iconUrl(it.name)
                    const stColor = STATE_COLORS[it.state]
                    const isRev = it.sugg.tag === 'revisar'
                    return (
                      <Link key={it.slug} href={`/skill/${it.slug}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 10, transition: 'border-color .15s', textDecoration: 'none' }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--scarlet-soft)')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line)')}
                      >
                        {url && <img src={url} alt="" style={{ width: 16, height: 16, flexShrink: 0 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />}
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, flex: 1, color: 'var(--fg)' }}>{it.name}</span>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, padding: '2px 6px', borderRadius: 4, letterSpacing: '.08em', textTransform: 'uppercase', background: stColor + '22', color: stColor }}>{it.state}</span>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--fg-dim)', minWidth: 80, textAlign: 'right' }}>{ageHuman(it.ageMs)}</span>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', color: isRev ? 'var(--violet)' : 'var(--blue)' }}>→ {it.sugg.text}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </section>
          </>
        )}

        {/* ── ROADMAP 8 SEMANAS ── */}
        {mode === 'roadmap' && (
          <>
            {/* Timeline strip */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
              {[{ n: 1, title: 'CS + Bases', cats: ['cs','database','arch','sec'] }, ...FUTURE_WEEKS.map(w => ({ n: w.n, title: w.title.split(' ')[0] + '…', cats: Array.from(new Set(w.days.flatMap(d => d.blocks.map(b => b.cat)))).filter(c => c !== 'mix') }))].map(w => (
                <div key={w.n} style={{ flexShrink: 0, background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 10, padding: '10px 14px', minWidth: 110 }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: 'var(--scarlet)', letterSpacing: '.14em', marginBottom: 5 }}>SEM {w.n}</div>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, fontWeight: 600, color: 'var(--fg)', marginBottom: 6, lineHeight: 1.2 }}>{w.title}</div>
                  <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    {w.cats.slice(0,4).map(c => <span key={c} style={{ width: 8, height: 8, borderRadius: 2, background: CAT_COLORS[c] ?? '#666', display: 'inline-block' }} />)}
                  </div>
                </div>
              ))}
            </div>

            <section style={{ marginBottom: 48 }}>
              <p className="hdr-label"><span className="ln" /> roadmap · 8 semanas · 80 skills em ordem de dependência</p>
              <p className="desc" style={{ marginBottom: 20, maxWidth: 720 }}>
                Ordenado por grafo de pré-requisitos: o que desbloqueia mais vem primeiro. Skills P1 têm prioridade absoluta dentro de cada semana.
              </p>

              {/* Semana 1 — atual */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: '#fff', background: 'var(--scarlet)', padding: '3px 10px', borderRadius: 5, letterSpacing: '.12em' }}>SEM 1 · ATUAL</span>
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 700, color: 'var(--fg)' }}>Fundamentos CS + Bases</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--fg-dim)' }}>Big-O → Algoritmos → TCP/IP → TLS → Event Loop → CAP → MVCC → SOLID</span>
                </div>
                <WeekAgendaWithClear todayIdx={todayIdx} checks={checks} onCheck={handleCheckOrClear} onClear={handleClearDay} />
              </div>

              {/* Semanas 2–8 */}
              {FUTURE_WEEKS.map(w => (
                <FutureWeekCard key={w.n} week={w} />
              ))}
            </section>
          </>
        )}

      </div>

      <style>{`
        @keyframes pulse {
          0%   { box-shadow: 0 0 0 0 rgba(239,68,68,.6); }
          70%  { box-shadow: 0 0 0 10px rgba(239,68,68,0); }
          100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
        }
      `}</style>
    </>
  )
}

/* ─── FutureWeekCard — read-only collapsible card for semanas 2–8 ─── */
function FutureWeekCard({ week }: { week: WeekPlan }) {
  const [expanded, setExpanded] = useState<number | null>(null)

  const allCats = Array.from(new Set(week.days.flatMap(d => d.blocks.map(b => b.cat)))).filter(c => c !== 'mix')

  return (
    <div style={{ marginBottom: 12, background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden' }}>
      {/* Week header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line)', background: 'rgba(255,255,255,.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: 'var(--fg-dim)', background: 'var(--bg-elev)', padding: '3px 10px', borderRadius: 5, letterSpacing: '.12em', flexShrink: 0 }}>
            SEM {week.n}
          </span>
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 700, color: 'var(--fg)', flex: 1 }}>{week.title}</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {allCats.slice(0, 5).map(c => (
              <span key={c} style={{ width: 8, height: 8, borderRadius: 2, background: CAT_COLORS[c] ?? '#666', display: 'inline-block' }} />
            ))}
          </div>
        </div>
        <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--fg-dim)', margin: '8px 0 0', lineHeight: 1.5 }}>{week.focus}</p>
      </div>

      {/* Days accordion */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {week.days.map((day, di) => {
          const isOpen = expanded === di
          const allSkills = day.blocks.flatMap(b => b.skills.filter(n => !n.startsWith('(')))
          return (
            <div key={day.day} style={{ borderBottom: di < week.days.length - 1 ? '1px solid var(--line)' : undefined }}>
              <button
                onClick={() => setExpanded(isOpen ? null : di)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px', border: 'none', background: isOpen ? 'rgba(255,255,255,.025)' : 'transparent', cursor: 'pointer', textAlign: 'left' }}
              >
                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, fontWeight: 600, color: 'var(--fg)', width: 72, flexShrink: 0 }}>{day.short}</span>
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  {day.blocks.map((b, i) => (
                    <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: b.cat === 'mix' ? '#94a3b8' : (CAT_COLORS[b.cat] ?? '#94a3b8'), display: 'inline-block' }} />
                  ))}
                </div>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--fg-mute)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {allSkills.join(' · ')}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--fg-dim)', transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform .2s', flexShrink: 0 }}>▶</span>
              </button>

              {isOpen && (
                <div style={{ padding: '12px 20px 16px', borderTop: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {day.blocks.map((b, bi) => {
                    const catColor = b.cat === 'mix' ? '#94a3b8' : (CAT_COLORS[b.cat] ?? '#94a3b8')
                    const tm = TYPE_META[b.type]
                    return (
                      <div key={bi} style={{ display: 'flex', gap: 14 }}>
                        <div style={{ width: 76, flexShrink: 0 }}>
                          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'var(--fg)', fontWeight: 600 }}>{b.time}</div>
                          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: 'var(--fg-dim)', marginTop: 1 }}>até {b.end}</div>
                          <span style={{ display: 'inline-block', marginTop: 6, fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: tm?.color, background: tm ? tm.color + '18' : 'transparent', padding: '2px 6px', borderRadius: 3, letterSpacing: '.1em', textTransform: 'uppercase' }}>{tm?.label ?? b.type}</span>
                        </div>
                        <div style={{ width: 2, background: catColor, borderRadius: 1, flexShrink: 0, minHeight: 50 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: catColor, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8 }}>{CAT_LABEL[b.cat] ?? b.cat}</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {b.skills.map(name => {
                              if (name.startsWith('(')) {
                                return <span key={name} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'var(--fg-dim)', fontStyle: 'italic' }}>{name}</span>
                              }
                              const s = SKILL_BY_NAME[name]
                              const url = s ? iconUrl(s.name) : null
                              const href = s ? `/skill/${s.slug}` : null
                              return href ? (
                                <Link key={name} href={href} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: 'var(--fg)', textDecoration: 'none' }}
                                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--scarlet)' }}
                                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--fg)' }}
                                >
                                  {url && <img src={url} alt="" style={{ width: 12, height: 12, flexShrink: 0 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />}
                                  {name}
                                </Link>
                              ) : (
                                <span key={name} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: 'var(--fg-mute)' }}>{name}</span>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── WeekAgenda wrapper that passes onClear properly ─── */
function WeekAgendaWithClear({ todayIdx, checks, onCheck, onClear }: {
  todayIdx: number | null
  checks: Record<string, boolean>
  onCheck: (key: string) => void
  onClear: (di: number) => void
}) {
  const [expanded, setExpanded] = useState<number | null>(null)

  // Open today's accordion once todayIdx is known client-side
  useEffect(() => {
    if (todayIdx !== null) setExpanded(prev => prev === null ? todayIdx : prev)
  }, [todayIdx])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {WEEK.map((day, di) => {
        const isToday = todayIdx !== null && di === todayIdx
        const isOpen = expanded === di
        const totalSkills = day.blocks.reduce((s, b) => s + b.skills.filter(n => !n.startsWith('(')).length, 0)
        const doneSkills  = day.blocks.reduce((s, b) => s + b.skills.filter(n => !n.startsWith('(') && !!checks[`${di}-${n}`]).length, 0)
        const progress = totalSkills > 0 ? doneSkills / totalSkills : 0

        return (
          <div key={day.day} style={{ background: 'var(--bg-card)', border: `1px solid ${isToday ? 'rgba(239,68,68,.45)' : isOpen ? 'var(--line-2)' : 'var(--line)'}`, borderRadius: 12, overflow: 'hidden', transition: 'border-color .15s', boxShadow: isToday ? '0 0 0 1px rgba(239,68,68,.08)' : undefined }}>

            {/* Header row */}
            <button onClick={() => setExpanded(isOpen ? null : di)} style={{ width: '100%', display: 'flex', alignItems: 'stretch', padding: 0, border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}>
              {isToday && <div style={{ width: 3, background: 'var(--scarlet)', flexShrink: 0 }} />}

              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 14, padding: '13px 18px' }}>
                {/* Day */}
                <div style={{ width: 76, flexShrink: 0 }}>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, fontWeight: 700, color: isToday ? 'var(--scarlet)' : 'var(--fg)', lineHeight: 1 }}>{day.day}</div>
                  {isToday && <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: 'rgba(239,68,68,.7)', letterSpacing: '.1em', marginTop: 3 }}>hoje</div>}
                </div>

                {/* Category dots */}
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  {day.blocks.map((b, i) => (
                    <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: b.cat === 'mix' ? '#94a3b8' : (CAT_COLORS[b.cat] ?? '#94a3b8') }} />
                  ))}
                </div>

                {/* Block summary */}
                <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 6, overflow: 'hidden' }}>
                  {day.blocks.map((b, bi) => {
                    const tm = TYPE_META[b.type]
                    const skillsText = b.skills.filter(n => !n.startsWith('(')).join(', ')
                    return (
                      <div key={bi} style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 0 }}>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: 'var(--fg-dim)' }}>{b.time}</span>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: tm?.color, background: tm ? tm.color + '1a' : 'transparent', padding: '1px 5px', borderRadius: 3, letterSpacing: '.08em', textTransform: 'uppercase', flexShrink: 0 }}>{tm?.label ?? b.type}</span>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--fg-mute)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{skillsText}</span>
                      </div>
                    )
                  })}
                </div>

                {/* Progress bar */}
                {totalSkills > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
                    <div style={{ width: 44, height: 3, background: 'var(--bg-card-2)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${progress * 100}%`, height: '100%', background: progress === 1 ? '#22c55e' : 'var(--scarlet)', transition: 'width .3s', borderRadius: 2 }} />
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: 'var(--fg-dim)', whiteSpace: 'nowrap' }}>{doneSkills}/{totalSkills}</span>
                  </div>
                )}

                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--fg-dim)', transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform .2s', flexShrink: 0 }}>▶</span>
              </div>
            </button>

            {/* Expanded detail */}
            {isOpen && (
              <div style={{ borderTop: '1px solid var(--line)', padding: '16px 20px 18px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {day.blocks.map((b, bi) => {
                  const catColor = b.cat === 'mix' ? '#94a3b8' : (CAT_COLORS[b.cat] ?? '#94a3b8')
                  const tm = TYPE_META[b.type]
                  return (
                    <div key={bi} style={{ display: 'flex', gap: 16 }}>
                      {/* Time info */}
                      <div style={{ width: 76, flexShrink: 0 }}>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: isToday ? 'var(--scarlet)' : 'var(--fg)', fontWeight: 600 }}>{b.time}</div>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: 'var(--fg-dim)', marginTop: 1 }}>até {b.end}</div>
                        <span style={{ display: 'inline-block', marginTop: 7, fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: tm?.color, background: tm ? tm.color + '18' : 'transparent', padding: '2px 6px', borderRadius: 3, letterSpacing: '.1em', textTransform: 'uppercase' }}>{tm?.label ?? b.type}</span>
                      </div>

                      {/* Color bar */}
                      <div style={{ width: 2, background: catColor, borderRadius: 1, flexShrink: 0, minHeight: 60 }} />

                      {/* Skills */}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: catColor, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10 }}>{CAT_LABEL[b.cat] ?? b.cat}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {b.skills.map(name => (
                            <SkillChip
                              key={name}
                              name={name}
                              checked={!!checks[`${di}-${name}`]}
                              onCheck={() => onCheck(`${di}-${name}`)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}

                {doneSkills > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={() => onClear(di)} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: 'var(--fg-dim)', background: 'transparent', border: '1px solid var(--line)', borderRadius: 5, padding: '4px 10px', cursor: 'pointer', letterSpacing: '.06em' }}>
                      limpar checks do dia
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
