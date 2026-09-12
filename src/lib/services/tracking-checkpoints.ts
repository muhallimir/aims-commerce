export interface CheckpointEvent {
  code: string
  at: string
}

export interface CheckpointStatus {
  next: string | null
  done: number
  remaining: string[]
}

export function nextCheckpoint(history: CheckpointEvent[], plan: string[]): CheckpointStatus {
  const seen = new Set(history.map((h) => h.code))
  const remaining = plan.filter((code) => !seen.has(code))
  const done = plan.length - remaining.length
  return { next: remaining.length > 0 ? remaining[0] : null, done, remaining }
}
