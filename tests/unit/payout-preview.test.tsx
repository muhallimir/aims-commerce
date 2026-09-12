import { render, screen } from "@testing-library/react";
import { PayoutPreview } from "@components/PayoutPreview";

describe("PayoutPreview", () => {
  it("stays quiet with no orders", () => {
    const { container } = render(<PayoutPreview orders={[]} />);
    expect(container.querySelector('[data-testid="payout-preview"]')).toBeNull();
  });

  it("nets two orders after the marketplace fee", () => {
    render(<PayoutPreview orders={[{ _id: "o1", totalPrice: 100 }, { _id: "o2", totalPrice: 50 }]} />);
    expect(screen.getByTestId("payout-net")).toHaveTextContent("$135.00");
    expect(screen.getByTestId("payout-preview")).toHaveTextContent(/2 order\(s\)/);
  });
});
