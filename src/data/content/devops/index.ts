import type { SkillContentMap } from '@/types'
import docker from './docker'
import dockerCompose from './docker-compose'
import githubActions from './github-actions'
import tdd from './tdd'
import playwright from './playwright'
import kubernetes from './kubernetes'
import linux from './linux'
import nginx from './nginx'
import gitlabCiCd from './gitlab-ci-cd'
import jest from './jest'
import vitest from './vitest'
import turborepo from './turborepo'
import featureFlags from './feature-flags'
import k6LoadTesting from './k6-load-testing'
import git from './git'
import pm2 from './pm2'
import github from './github'
import gitlab from './gitlab'
import azureDevops from './azure-devops'
import gitflow from './gitflow'
import phpunit from './phpunit'
import pest from './pest'
import cypress from './cypress'
import sonarqube from './sonarqube'
import nx from './nx'
import scrum from './scrum'
import kanban from './kanban'
import vsCode from './vs-code'
import cursor from './cursor'
import figma from './figma'

const devops: SkillContentMap = {
  'docker': docker,
  'docker-compose': dockerCompose,
  'github-actions': githubActions,
  'tdd': tdd,
  'playwright': playwright,
  'kubernetes': kubernetes,
  'linux': linux,
  'nginx': nginx,
  'gitlab-ci-cd': gitlabCiCd,
  'jest': jest,
  'vitest': vitest,
  'turborepo': turborepo,
  'feature-flags': featureFlags,
  'k6-load-testing': k6LoadTesting,
  'git': git,
  'pm2': pm2,
  'github': github,
  'gitlab': gitlab,
  'azure-devops': azureDevops,
  'gitflow': gitflow,
  'phpunit': phpunit,
  'pest': pest,
  'cypress': cypress,
  'sonarqube': sonarqube,
  'nx': nx,
  'scrum': scrum,
  'kanban': kanban,
  'vs-code': vsCode,
  'cursor': cursor,
  'figma': figma,
}

export default devops
