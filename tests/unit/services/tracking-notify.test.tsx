import { notificationPlan } from "@lib/services/tracking-notify"

describe("tracking-notify", () => {
  it("maps out-for-delivery to sms and push on a tight cadence", () => {
    const res = notificationPlan("out-for-delivery")
    expect(res.channels).toEqual(["sms", "push"])
    expect(res.cadenceMinutes).toBe(60)
  })

  it("falls back to email for unknown statuses", () => {
    const res = notificationPlan("mystery-status")
    expect(res.channels).toEqual(["email"])
    expect(res.template).toBe("status-update")
  })
})
