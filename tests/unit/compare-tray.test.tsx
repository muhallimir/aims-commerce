import { render, screen, fireEvent } from "@testing-library/react";
import { CompareTray, CompareCategoryGuard, canCompare } from "@components/CompareTray";

const A = { id: "a", name: "Alpha", price: 100, rating: 4, inStock: true };
const B = { id: "b", name: "Beta", price: 80, rating: 3, inStock: false };

describe("canCompare", () => {
  const phone = { id: "a", name: "A", price: 1, inStock: true, category: "Electronics" };
  const shirt = { id: "b", name: "B", price: 2, inStock: true, category: "Shirts" };

  it("allows empty trays and same categories", () => {
    expect(canCompare([], phone)).toEqual({ ok: true });
    expect(canCompare([phone], { ...phone, id: "c" })).toEqual({ ok: true });
  });

  it("blocks cross-category picks with the tray name", () => {
    expect(canCompare([phone], shirt)).toEqual({ ok: false, trayCategory: "Electronics" });
  });
});

describe("CompareCategoryGuard", () => {
  it("offers switch or keep", () => {
    const onSwitch = jest.fn();
    const onKeep = jest.fn();
    render(<CompareCategoryGuard trayCategory="Electronics" nextCategory="Shirts" onSwitch={onSwitch} onKeep={onKeep} />);
    expect(screen.getByTestId("compare-guard-text")).toHaveTextContent(/within a category/i);
    fireEvent.click(screen.getByTestId("compare-guard-switch"));
    expect(onSwitch).toHaveBeenCalled();
  });
});

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
