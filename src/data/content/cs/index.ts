import type { SkillContentMap } from "@/types"
import algoritmoDs from "./algoritmos-ds/algoritmos-ds"
import bigO from "./big-o/big-o"
import dynamicProgramming from "./dynamic-programming/dynamic-programming"
import grafos from "./grafos"
import tcpIpDns from "./tcp-ip-dns/tcp-ip-dns"
import tlsHttps from "./tls-https/tls-https"
import eventLoop from "./event-loop/event-loop"
import memoryManagement from "./memory-management"
import capTheorem from "./cap-theorem/cap-theorem"
import http2Http3 from "./http-2-http-3/http-2-http-3"
import processosThreads from "./processos-threads"
import raftPaxos from "./raft-paxos"
import crdts from "./crdts"
import consistentHashing from "./consistent-hashing/consistent-hashing"

const cs: SkillContentMap = {
  "algoritmos-ds": algoritmoDs,
  "big-o": bigO,
  "dynamic-programming": dynamicProgramming,
  "grafos": grafos,
  "tcp-ip-dns": tcpIpDns,
  "tls-https": tlsHttps,
  "event-loop": eventLoop,
  "memory-management": memoryManagement,
  "cap-theorem": capTheorem,
  "http-2-http-3": http2Http3,
  "processos-threads": processosThreads,
  "raft-paxos": raftPaxos,
  "crdts": crdts,
  "consistent-hashing": consistentHashing,
}

export default cs
