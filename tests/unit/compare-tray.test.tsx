import { render, screen, fireEvent } from "@testing-library/react";
import { CompareTray } from "@components/CompareTray";

const A = { id: "a", name: "Alpha", price: 100, rating: 4, inStock: true };
const B = { id: "b", name: "Beta", price: 80, rating: 3, inStock: false };

describe("CompareTray", () => {
  it("hides when empty and gates compare below two", () => {
    const { container, rerender } = render(<CompareTray items={[]} onToggle={() => {}} onClear={() => {}} />);
    expect(container.querySelector('[data-testid="compare-tray"]')).toBeNull();
    rerender(<CompareTray items={[A]} onToggle={() => {}} onClear={() => {}} />);
    expect(screen.getByTestId("compare-open")).toBeDisabled();
  });

  it("opens the side-by-side table with best price bold", () => {
    const onClear = jest.fn();
    render(<CompareTray items={[A, B]} onToggle={() => {}} onClear={onClear} />);
    expect(screen.getByTestId("compare-count")).toHaveTextContent("2 to compare");
    fireEvent.click(screen.getByTestId("compare-open"));
    expect(screen.getByTestId("compare-head-a")).toHaveTextContent("Alpha");
    expect(screen.getByTestId("compare-cell-price-1")).toHaveStyle({ fontWeight: "700" });
    fireEvent.click(screen.getByTestId("compare-clear"));
    expect(onClear).toHaveBeenCalled();
  });
});
