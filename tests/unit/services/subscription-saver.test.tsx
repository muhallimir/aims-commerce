import { subscriptionPlan } from "@lib/services/subscription-saver"

describe("subscriptionPlan", () => {
  it("applies 5 percent off for weekly interval", () => {
    const p = subscriptionPlan(10, 2, 2)
    expect(p.perDelivery).toBeCloseTo(19, 2)
    expect(p.savingsVsOneOff).toBeGreaterThan(0)
  })
  it("applies 10 percent off for monthly interval", () => {
    const p = subscriptionPlan(10, 2, 4)
    expect(p.perDelivery).toBeCloseTo(18, 2)
    expect(p.annualTotal).toBeCloseTo(234, 0)
  })
})
