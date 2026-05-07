import type { SkillContentMap } from '@/types'
import owaspTop10 from './owasp-top-10/owasp-top-10'
import owaspApiTop10 from './owasp-api-top-10/owasp-api-top-10'
import threatModeling from './threat-modeling'
import sastSemgrep from './sast-semgrep'
import dastZap from './dast-zap'
import snykDependabot from './snyk-dependabot'
import secretsManagement from './secrets-management'
import gitleaks from './gitleaks'

const sec: SkillContentMap = {
  'owasp-top-10': owaspTop10,
  'owasp-api-top-10': owaspApiTop10,
  'threat-modeling': threatModeling,
  'sast-semgrep': sastSemgrep,
  'dast-zap': dastZap,
  'snyk-dependabot': snykDependabot,
  'secrets-management': secretsManagement,
  'gitleaks': gitleaks,
}

export default sec
