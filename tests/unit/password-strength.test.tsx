import { render, screen } from "@testing-library/react";
import { PasswordStrength, scorePassword } from "@components/PasswordStrength";

describe("scorePassword", () => {
  it("grades from weak to strong", () => {
    expect(scorePassword("abc")).toBe(0);
    expect(scorePassword("abcdefgh")).toBe(1);
    expect(scorePassword("Abcdef12")).toBe(3);
    expect(scorePassword("Abcdef12!xyz")).toBe(4);
  });
});

describe("PasswordStrength", () => {
  it("stays hidden when empty and praises strong input", () => {
    const { container } = render(<PasswordStrength password="" />);
    expect(container.querySelector('[data-testid="password-strength"]')).toBeNull();
    render(<PasswordStrength password="Abcdef12!xyz" />);
    expect(screen.getByTestId("password-strength-label")).toHaveTextContent(/strong/i);
  });
});
