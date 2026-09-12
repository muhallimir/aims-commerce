import { render, screen, fireEvent } from "@testing-library/react";
import { GiftOptionsPanel, loadGift } from "@components/GiftOptionsPanel";

describe("GiftOptionsPanel", () => {
  beforeEach(() => localStorage.clear());

  it("starts empty and persists wrap plus message", () => {
    expect(loadGift()).toEqual({ wrap: false, message: "" });
    render(<GiftOptionsPanel />);
    fireEvent.click(screen.getByTestId("gift-wrap-toggle"));
    fireEvent.change(screen.getByTestId("gift-message"), { target: { value: "Happy birthday!" } });
    expect(screen.getByTestId("gift-summary")).toHaveTextContent(/happy birthday/i);
    expect(loadGift()).toEqual({ wrap: true, message: "Happy birthday!" });
  });
});
