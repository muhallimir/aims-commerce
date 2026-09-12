export type TimelineStepKey =
  | "created"
  | "paid"
  | "processing"
  | "shipped"
  | "out-for-delivery"
  | "delivered"

export type TimelineStepState = "done" | "current" | "todo"

export interface TimelineStep {
  key: TimelineStepKey
  label: string
  state: TimelineStepState
  at: string | null
}

export interface Timeline {
  steps: TimelineStep[]
  percent: number
}

export const TIMELINE_KEYS: TimelineStepKey[] = [
  "created",
  "paid",
  "processing",
  "shipped",
  "out-for-delivery",
  "delivered",
]

const LABELS: Record<TimelineStepKey, string> = {
  created: "Created",
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  "out-for-delivery": "Out for delivery",
  delivered: "Delivered",
}

export function buildTimeline(current: TimelineStepKey): Timeline {
  const idx = TIMELINE_KEYS.indexOf(current)
  if (idx < 0) throw new Error("buildTimeline: unknown current step")
  const steps: TimelineStep[] = TIMELINE_KEYS.map((key, i) => ({
    key,
    label: LABELS[key],
    state: i < idx ? "done" : i === idx ? "current" : "todo",
    at: null,
  }))
  const percent = Math.round((idx / (TIMELINE_KEYS.length - 1)) * 100)
  return { steps, percent }
}
