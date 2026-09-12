export type ExceptionType = "weather" | "customs" | "address" | "carrier" | "none"

export interface ExceptionResult {
  type: ExceptionType
  confidence: number
}

const KEYWORDS: { type: ExceptionType; words: string[] }[] = [
  { type: "weather", words: ["weather", "storm", "rain", "snow", "hurricane", "blizzard", "fog", "flood"] },
  { type: "customs", words: ["customs", "duty", "border", "clearance", "import"] },
  {
    type: "address",
    words: ["address", "apt", "suite", "zip", "postcode", "undeliverable", "recipient", "door"],
  },
  {
    type: "carrier",
    words: ["carrier", "truck", "depot", "hub", "driver", "vehicle", "breakdown"],
  },
]

export function classifyException(note: string): ExceptionResult {
  const lower = note.toLowerCase()
  for (const group of KEYWORDS) {
    if (group.words.some((w) => lower.includes(w))) return { type: group.type, confidence: 0.9 }
  }
  return { type: "none", confidence: 0 }
}
