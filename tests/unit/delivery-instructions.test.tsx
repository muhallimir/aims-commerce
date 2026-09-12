import { render, screen, fireEvent } from "@testing-library/react";
import { DeliveryInstructions, loadNote } from "@components/DeliveryInstructions";

describe("DeliveryInstructions", () => {
  beforeEach(() => localStorage.clear());

  it("saves the note and previews the courier view", () => {
    render(<DeliveryInstructions />);
    fireEvent.change(screen.getByTestId("delivery-note-input"), { target: { value: "Gate 4410" } });
    expect(loadNote()).toBe("Gate 4410");
    expect(screen.getByTestId("delivery-note-preview")).toHaveTextContent(/gate 4410/i);
  });
});
