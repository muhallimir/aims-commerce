import { render, screen } from "@testing-library/react";
import { FreeShippingBar } from "@components/FreeShippingBar";
import { shippingProgress } from "@lib/shippingProgress";

describe("shippingProgress", () => {
  it("measures the gap to free shipping", () => {
    expect(shippingProgress(20)).toMatchObject({ remaining: 30, percent: 40, unlocked: false });
    expect(shippingProgress(50).unlocked).toBe(true);
    expect(shippingProgress(120)).toMatchObject({ remaining: 0, percent: 100, unlocked: true });
  });
});

describe("FreeShippingBar", () => {
  it("nudges below the threshold and celebrates above", () => {
    render(<FreeShippingBar subtotal={20} />);
    expect(screen.getByTestId("free-shipping-text")).toHaveTextContent("$30.00 away");
    render(<FreeShippingBar subtotal={60} />);
    expect(screen.getAllByTestId("free-shipping-text")[1]).toHaveTextContent(/unlocked/i);
  });
});
