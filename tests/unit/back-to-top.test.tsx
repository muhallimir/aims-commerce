import { render, screen, fireEvent } from "@testing-library/react";
import { BackToTop } from "@components/BackToTop";

describe("BackToTop", () => {
  it("hides at top, shows after scrolling, jumps home", () => {
    const scrollTo = jest.fn();
    Object.defineProperty(window, "scrollTo", { value: scrollTo, writable: true });
    render(<BackToTop />);
    expect(screen.queryByTestId("back-to-top")).not.toBeVisible();
    fireEvent.scroll(window, { target: { scrollY: 800 } });
    Object.defineProperty(window, "scrollY", { value: 800, writable: true });
    fireEvent.scroll(window);
    expect(screen.getByTestId("back-to-top")).toBeVisible();
    fireEvent.click(screen.getByTestId("back-to-top"));
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
