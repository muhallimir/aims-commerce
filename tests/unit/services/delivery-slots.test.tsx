import { availableSlots, bookSlot } from "@lib/services/delivery-slots"

describe("delivery-slots", () => {
  it("filters out full slots", () => {
    const res = availableSlots([
      { slot: "9-11", cap: 2, booked: 2 },
      { slot: "11-13", cap: 2, booked: 1 },
    ])
    expect(res).toEqual([{ slot: "11-13", left: 1 }])
  })

  it("books a slot and throws when full or unknown", () => {
    expect(bookSlot([{ slot: "9-11", cap: 2, booked: 1 }], "9-11").booked).toBe(2)
    expect(() => bookSlot([{ slot: "9-11", cap: 1, booked: 1 }], "9-11")).toThrow()
    expect(() => bookSlot([], "nope")).toThrow()
  })
})
