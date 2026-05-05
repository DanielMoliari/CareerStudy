import type { SkillContentMap } from '@/types'
import postgresql from './postgresql'
import explainAnalyze from './explain-analyze'
import mvcc from './mvcc'
import bTreeLsmTree from './b-tree-lsm-tree'
import redis from './redis'
import elasticsearch from './elasticsearch'
import pgvector from './pgvector'
import qdrant from './qdrant'
import mysql from './mysql'
import mariadb from './mariadb'
import sqlite from './sqlite'
import firebase from './firebase'

const database: SkillContentMap = {
  'postgresql': postgresql,
  'explain-analyze': explainAnalyze,
  'mvcc': mvcc,
  'b-tree-lsm-tree': bTreeLsmTree,
  'redis': redis,
  'elasticsearch': elasticsearch,
  'pgvector': pgvector,
  'qdrant': qdrant,
  'mysql': mysql,
  'mariadb': mariadb,
  'sqlite': sqlite,
  'firebase': firebase,
}

export default database
