import { render, screen, fireEvent } from "@testing-library/react";
import { ProductImageMagnifier } from "@components/ProductImageMagnifier";

function mockMatchMedia(matches: boolean) {
  (window as any).matchMedia = () => ({
    matches,
    media: "",
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

describe("ProductImageMagnifier", () => {
  it("renders the product image", () => {
    mockMatchMedia(false);
    render(<ProductImageMagnifier src="/uploads/a.png" alt="Test product" testId="mag" />);
    expect(screen.getByTestId("mag-image")).toHaveAttribute("alt", "Test product");
  });

  it("shows lens and zoom pane on hover in pane mode, tap opens viewer", () => {
    mockMatchMedia(true);
    const onTap = jest.fn();
    render(
      <ProductImageMagnifier src="/uploads/a.png" alt="Test product" mode="pane" onTap={onTap} testId="mag" />
    );
    expect(screen.queryByTestId("mag-lens")).toBeNull();
    fireEvent.mouseEnter(screen.getByTestId("mag"));
    expect(screen.getByTestId("mag-lens")).toBeVisible();
    expect(screen.getByTestId("mag-zoom")).toBeVisible();
    fireEvent.click(screen.getByTestId("mag"));
    expect(onTap).toHaveBeenCalledTimes(1);
    fireEvent.mouseLeave(screen.getByTestId("mag"));
    expect(screen.queryByTestId("mag-lens")).toBeNull();
  });

  it("zooms inside the frame in inner mode", () => {
    mockMatchMedia(true);
    render(<ProductImageMagnifier src="/uploads/a.png" alt="Test product" mode="inner" testId="mag" />);
    fireEvent.mouseEnter(screen.getByTestId("mag"));
    expect(screen.getByTestId("mag-image")).toHaveStyle("transform: scale(2.8)");
    expect(screen.queryByTestId("mag-zoom")).toBeNull();
  });
});
