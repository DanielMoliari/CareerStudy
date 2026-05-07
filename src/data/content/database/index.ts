import type { SkillContentMap } from '@/types'
import postgresql from './postgresql/postgresql'
import explainAnalyze from './explain-analyze/explain-analyze'
import mvcc from './mvcc/mvcc'
import bTreeLsmTree from './b-tree-lsm-tree/b-tree-lsm-tree'
import redis from './redis/redis'
import elasticsearch from './elasticsearch/elasticsearch'
import pgvector from './pgvector'
import qdrant from './qdrant/qdrant'
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
