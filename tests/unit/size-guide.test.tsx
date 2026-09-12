import { render, screen, fireEvent } from "@testing-library/react";
import { SizeGuide, needsSizeGuide } from "@components/SizeGuide";

describe("needsSizeGuide", () => {
  it("matches apparel and skips electronics", () => {
    expect(needsSizeGuide("Shirts")).toBe(true);
    expect(needsSizeGuide("Gaming")).toBe(false);
    expect(needsSizeGuide(undefined)).toBe(false);
  });
});

describe("SizeGuide", () => {
  it("opens the measurement table", () => {
    render(<SizeGuide category="Pants" />);
    fireEvent.click(screen.getByTestId("size-guide-open"));
    expect(screen.getByTestId("size-guide-dialog")).toBeVisible();
    expect(screen.getByText("Chest")).toBeVisible();
  });

  it("stays hidden off apparel", () => {
    const { container } = render(<SizeGuide category="Electronics" />);
    expect(container).toBeEmptyDOMElement();
  });
});
