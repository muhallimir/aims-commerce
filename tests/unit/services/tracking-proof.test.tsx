import { validateProof } from "@lib/services/tracking-proof"

describe("tracking-proof", () => {
  it("passes when all required evidence is present", () => {
    const res = validateProof({
      photoUrl: "https://cdn.test/p.jpg",
      signature: true,
      pin: "1234",
      required: ["photo", "signature", "pin"],
    })
    expect(res.ok).toBe(true)
    expect(res.missing).toEqual([])
  })

  it("lists missing items", () => {
    const res = validateProof({ required: ["photo", "signature"] })
    expect(res.ok).toBe(false)
    expect(res.missing).toEqual(["photo", "signature"])
  })
})
