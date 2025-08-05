type EntropyState = "low" | "high"
type TimeVector = "past" | "present" | "future"
type Lineage = 1 | 2 // Physical or Spiritual

type SeedVector = {
  lineage: Lineage
  phase: number // 1 to 14
  time: TimeVector
  entropy: EntropyState
  content: string // expression or action
}