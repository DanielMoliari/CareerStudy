import type { SkillContentMap } from '@/types'
import systemDesign from './system-design/system-design'
import solid from './solid/solid'
import cleanArchitecture from './clean-architecture/clean-architecture'
import ddd from './ddd/ddd'
import microservices from './microservices/microservices'
import cqrs from './cqrs/cqrs'
import circuitBreakers from './circuit-breakers/circuit-breakers'
import rateLimiting from './rate-limiting/rate-limiting'
import tradeoffAnalysis from './tradeoff-analysis/tradeoff-analysis'
import eventDriven from './event-driven/event-driven'
import designPatterns from './design-patterns/design-patterns'
import dependencyInjection from './dependency-injection/dependency-injection'
import sharding from './sharding/sharding'
import chaosEngineering from './chaos-engineering/chaos-engineering'
import hmvc from './hmvc'
import mvc from './mvc'
import soa from './soa'
import repositoryPattern from './repository-pattern'
import multiTenant from './multi-tenant'
import cleanCode from './clean-code'
import codeReview from './code-review'

const arch: SkillContentMap = {
  'system-design': systemDesign,
  'solid': solid,
  'clean-architecture': cleanArchitecture,
  'ddd': ddd,
  'microservices': microservices,
  'cqrs': cqrs,
  'circuit-breakers': circuitBreakers,
  'rate-limiting': rateLimiting,
  'tradeoff-analysis': tradeoffAnalysis,
  'event-driven': eventDriven,
  'design-patterns': designPatterns,
  'dependency-injection': dependencyInjection,
  'sharding': sharding,
  'chaos-engineering': chaosEngineering,
  'hmvc': hmvc,
  'mvc': mvc,
  'soa': soa,
  'repository-pattern': repositoryPattern,
  'multi-tenant': multiTenant,
  'clean-code': cleanCode,
  'code-review': codeReview,
}

export default arch
