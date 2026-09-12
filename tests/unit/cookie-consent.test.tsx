import { render, screen, fireEvent } from "@testing-library/react";
import { CookieConsent, loadConsent } from "@components/CookieConsent";

describe("CookieConsent", () => {
  beforeEach(() => localStorage.clear());

  it("asks once and remembers essentials-only", () => {
    expect(loadConsent()).toBeNull();
    render(<CookieConsent />);
    expect(screen.getByTestId("cookie-consent")).toBeVisible();
    fireEvent.click(screen.getByTestId("cookie-decline"));
    expect(loadConsent()).toBe("declined");
    expect(screen.queryByTestId("cookie-consent")).toBeNull();
  });
});
