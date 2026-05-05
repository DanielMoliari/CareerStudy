import type { SkillContentMap } from "@/types"
import ingles from "./ingles"
import technicalWriting from "./technical-writing"
import adrsRfcs from "./adrs-rfcs"
import espanhol from "./espanhol"
import comunicacao from "./comunicacao"
import lideranca from "./lideranca"

const soft: SkillContentMap = {
  "ingles": ingles,
  "technical-writing": technicalWriting,
  "adrs-rfcs": adrsRfcs,
  "espanhol": espanhol,
  "comunicacao": comunicacao,
  "lideranca": lideranca,
}

export default soft
