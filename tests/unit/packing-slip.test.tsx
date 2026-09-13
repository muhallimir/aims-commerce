import { render, screen, fireEvent } from "@testing-library/react";
import { PackingSlip, slipLines } from "@components/PackingSlip";

const ORDER = {
  _id: "order-abc123",
  orderItems: [{ name: "Cap", qty: 2, price: 20 }],
  totalPrice: 45,
  shippingAddress: { fullName: "Sam", address: "1 Main", city: "NYC", postalCode: "10001", country: "US" },
};

describe("slipLines", () => {
  it("formats pick lines with extended prices", () => {
    expect(slipLines(ORDER)).toEqual(["2 × Cap — $40.00"]);
  });
});

describe("PackingSlip", () => {
  it("opens the slip with totals and address", () => {
    render(<PackingSlip order={ORDER} />);
    fireEvent.click(screen.getByTestId("packing-open-order-abc123"));
    expect(screen.getByTestId("packing-body")).toHaveTextContent("Total: $45.00");
    expect(screen.getByTestId("packing-body")).toHaveTextContent(/ship to: sam/i);
  });
});
