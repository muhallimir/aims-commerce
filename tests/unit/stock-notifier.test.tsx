import { render, screen, fireEvent } from "@testing-library/react";
import { StockNotifier, isValidEmail } from "@components/StockNotifier";

describe("StockNotifier helpers", () => {
  it("validates emails", () => {
    expect(isValidEmail("sam@example.com")).toBe(true);
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });
});

describe("StockNotifier", () => {
  beforeEach(() => localStorage.clear());

  it("rejects bad emails and confirms good ones", () => {
    render(<StockNotifier productId="p1" productName="Sneaker" />);
    fireEvent.click(screen.getByTestId("stock-notifier-submit"));
    expect(screen.getByText(/valid email/i)).toBeVisible();
    fireEvent.change(screen.getByTestId("stock-notifier-email"), { target: { value: "sam@example.com" } });
    fireEvent.click(screen.getByTestId("stock-notifier-submit"));
    expect(screen.getByTestId("stock-notifier-done")).toHaveTextContent(/back/);
    expect(JSON.parse(localStorage.getItem("aims-stock-alerts") ?? "[]")).toEqual([
      { productId: "p1", email: "sam@example.com" },
    ]);
  });
});
