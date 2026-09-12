import { render, screen, fireEvent } from "@testing-library/react";
import { ReorderButton } from "@components/ReorderButton";

const ITEMS = [
  { product: "p1", name: "Cap", qty: 2, price: 20 },
  { product: "p2", name: "Socks", qty: 1, price: 5 },
];

describe("ReorderButton", () => {
  it("counts units and hands items back once", () => {
    const onReorder = jest.fn();
    render(<ReorderButton items={ITEMS} onReorder={onReorder} />);
    const btn = screen.getByTestId("reorder-button");
    expect(btn).toHaveTextContent("Buy again (3)");
    fireEvent.click(btn);
    expect(onReorder).toHaveBeenCalledWith(ITEMS);
    expect(btn).toHaveTextContent("Added to cart");
    expect(btn).toBeDisabled();
  });

  it("stays disabled with nothing to reorder", () => {
    render(<ReorderButton items={[]} onReorder={() => {}} />);
    expect(screen.getByTestId("reorder-button")).toBeDisabled();
  });
});
