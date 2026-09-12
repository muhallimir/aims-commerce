import { render, screen } from "@testing-library/react";
import { FraudHint } from "@components/FraudHint";

describe("FraudHint", () => {
  it("scores a small order low", () => {
    render(<FraudHint total={100} />);
    expect(screen.getByTestId("fraud-score")).toHaveTextContent("5/100 (low)");
  });

  it("flags a high-value order", () => {
    render(<FraudHint total={1500} />);
    expect(screen.getByTestId("fraud-flag")).toHaveTextContent(/high order value/i);
  });
});
