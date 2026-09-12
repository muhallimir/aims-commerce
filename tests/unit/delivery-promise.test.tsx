import { render, screen } from "@testing-library/react";
import { DeliveryPromise, arrivalFor, cutoffCountdown } from "@components/DeliveryPromise";

describe("DeliveryPromise helpers", () => {
  it("lands on a weekday three business days out", () => {
    // Monday 10am -> Thursday (skips no weekends in between)
    const arrives = arrivalFor(new Date("2026-09-14T10:00:00"));
    expect(arrives.getDay()).not.toBe(0);
    expect(arrives.getDay()).not.toBe(6);
  });

  it("counts down to the 2pm cutoff", () => {
    expect(cutoffCountdown(new Date("2026-09-14T10:00:00"))).toBe("4h 0m");
    expect(cutoffCountdown(new Date("2026-09-14T15:00:00"))).toContain("m");
  });
});

describe("DeliveryPromise", () => {
  it("renders the promise line", () => {
    render(<DeliveryPromise now={new Date("2026-09-14T10:00:00")} />);
    expect(screen.getByTestId("delivery-promise").textContent).toMatch(/Order within 4h 0m, get it by/);
  });
});
