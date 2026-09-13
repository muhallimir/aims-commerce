import { render, screen, fireEvent } from "@testing-library/react";
import { CompareTray, CompareCategoryGuard, canCompare, groupOf } from "@components/CompareTray";

const A = { id: "a", name: "Alpha", price: 100, rating: 4, inStock: true };
const B = { id: "b", name: "Beta", price: 80, rating: 3, inStock: false };

describe("canCompare", () => {
  const laptop = { id: "a", name: "A", price: 1, inStock: true, category: "Electronics" };
  const gpu = { id: "b", name: "B", price: 2, inStock: true, category: "Gaming" };
  const shirt = { id: "c", name: "C", price: 3, inStock: true, category: "Shirts" };

  it("groups tech together", () => {
    expect(groupOf("Electronics")).toBe("tech");
    expect(groupOf("Gaming")).toBe("tech");
    expect(groupOf("Shirts")).toBe("apparel");
  });

  it("allows empty trays and same families", () => {
    expect(canCompare([], laptop)).toEqual({ ok: true });
    expect(canCompare([laptop], gpu)).toEqual({ ok: true });
  });

  it("blocks tech versus apparel with the family name", () => {
    expect(canCompare([laptop], shirt)).toEqual({ ok: false, trayCategory: "tech" });
  });
});

describe("CompareCategoryGuard", () => {
  it("offers switch or keep", () => {
    const onSwitch = jest.fn();
    const onKeep = jest.fn();
    render(<CompareCategoryGuard trayCategory="tech" nextCategory="apparel" onSwitch={onSwitch} onKeep={onKeep} />);
    expect(screen.getByTestId("compare-guard-text")).toHaveTextContent(/within a family/i);
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
