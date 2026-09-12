import { render, screen, fireEvent } from "@testing-library/react";
import { NotificationPrefs, loadPrefs } from "@components/NotificationPrefs";

describe("NotificationPrefs", () => {
  beforeEach(() => localStorage.clear());

  it("defaults order updates on and persists toggles", () => {
    expect(loadPrefs().orderUpdates).toBe(true);
    render(<NotificationPrefs />);
    const drop = screen.getByTestId("notify-priceDrops");
    expect(drop).not.toBeChecked();
    fireEvent.click(drop);
    expect(loadPrefs().priceDrops).toBe(true);
  });
});
