import { render, screen, fireEvent } from "@testing-library/react";
import { CategoryChips } from "@components/CategoryChips";

describe("CategoryChips", () => {
  it("hides when there is nothing to filter", () => {
    const { container } = render(<CategoryChips categories={["All"]} value="All" onChange={() => {}} />);
    expect(container.querySelector('[data-testid="category-chips"]')).toBeNull();
  });

  it("emits the picked category", () => {
    const onChange = jest.fn();
    render(<CategoryChips categories={["All", "Shirts"]} value="All" onChange={onChange} />);
    fireEvent.click(screen.getByTestId("category-chip-Shirts"));
    expect(onChange).toHaveBeenCalledWith("Shirts");
  });
});
