import type { SkillContentMap, SkillContent } from '@/types'
import frontend from './frontend'
import backend from './backend'
import database from './database'
import cloud from './cloud'
import devops from './devops'
import obs from './obs'
import ai from './ai'
import arch from './arch'
import cs from './cs'
import soft from './soft'
import sec from './sec'

export const SKILL_CONTENT: SkillContentMap = {
  ...frontend,
  ...backend,
  ...database,
  ...cloud,
  ...devops,
  ...obs,
  ...ai,
  ...arch,
  ...cs,
  ...soft,
  ...sec,
}

export function getSkillContent(slug: string): SkillContent | null {
  return SKILL_CONTENT[slug] ?? null
}

export function hasSkillContent(slug: string): boolean {
  return slug in SKILL_CONTENT
}

export default SKILL_CONTENT
