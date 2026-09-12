export interface SignatureRuleResult {
  required: boolean
  reason: string
}

const HIGH_VALUE_CATEGORIES = ["electronics", "jewelry"]
const TOTAL_THRESHOLD = 500

export function signatureRule(orderTotal: number, category: string): SignatureRuleResult {
  if (!Number.isFinite(orderTotal)) throw new Error("signatureRule: invalid orderTotal")
  const normalized = category.trim().toLowerCase()
  if (orderTotal > TOTAL_THRESHOLD) {
    return { required: true, reason: "order total exceeds threshold" }
  }
  if (HIGH_VALUE_CATEGORIES.includes(normalized)) {
    return { required: true, reason: "high-value category" }
  }
  return { required: false, reason: "no signature required" }
}
