import type { SkillContentMap } from "@/types"
import opentelemetry from "./opentelemetry"
import prometheus from "./prometheus"
import grafana from "./grafana"
import slisSlosSlas from "./slis-slos-slas/slis-slos-slas"

const obs: SkillContentMap = {
  "opentelemetry": opentelemetry,
  "prometheus": prometheus,
  "grafana": grafana,
  "slis-slos-slas": slisSlosSlas,
}

export default obs
