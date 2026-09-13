import { render, screen } from "@testing-library/react";
import { ArrivalEstimate, arrivalLabel } from "@components/ArrivalEstimate";

describe("arrivalLabel", () => {
  it("lands on a weekday", () => {
    const label = arrivalLabel("2026-09-14T10:00:00Z");
    expect(label).toMatch(/^[A-Z][a-z]{2}, [A-Z][a-z]{2} \d{1,2}$/);
  });

  it("blanks on garbage input", () => {
    expect(arrivalLabel("nope")).toBe("");
  });
});

describe("ArrivalEstimate", () => {
  it("hides for delivered orders", () => {
    const { container } = render(<ArrivalEstimate createdAt="2026-09-14T10:00:00Z" isDelivered />);
    expect(container.querySelector('[data-testid="arrival-estimate"]')).toBeNull();
  });

  it("shows for orders on the road", () => {
    render(<ArrivalEstimate createdAt="2026-09-14T10:00:00Z" isDelivered={false} />);
    expect(screen.getByTestId("arrival-estimate")).toHaveTextContent(/arriving around/i);
  });
});
