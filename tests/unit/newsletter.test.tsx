import { render, screen, fireEvent } from "@testing-library/react";
import { NewsletterSignup, isNewsletterEmail } from "@components/NewsletterSignup";

describe("isNewsletterEmail", () => {
  it("accepts real emails only", () => {
    expect(isNewsletterEmail("sam@example.com")).toBe(true);
    expect(isNewsletterEmail("sam@x")).toBe(false);
  });
});

describe("NewsletterSignup", () => {
  beforeEach(() => localStorage.clear());

  it("rejects junk and confirms signup", () => {
    render(<NewsletterSignup />);
    fireEvent.click(screen.getByTestId("newsletter-submit"));
    expect(screen.getByText(/valid email/i)).toBeVisible();
    fireEvent.change(screen.getByTestId("newsletter-email"), { target: { value: "sam@example.com" } });
    fireEvent.click(screen.getByTestId("newsletter-submit"));
    expect(screen.getByTestId("newsletter-done")).toHaveTextContent(/friday/i);
  });
});
