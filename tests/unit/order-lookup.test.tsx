import { render, screen, fireEvent } from "@testing-library/react";
import { OrderLookup, orderDetailPath } from "@components/OrderLookup";

const mockPush = jest.fn();
jest.mock("next/router", () => ({ useRouter: () => ({ push: mockPush }) }));

describe("orderDetailPath", () => {
  it("trims into the admin detail route", () => {
    expect(orderDetailPath("  abc123 ")).toBe("/admin/orders/abc123");
  });
});

describe("OrderLookup", () => {
  beforeEach(() => mockPush.mockClear());

  it("gates short input and navigates on submit", () => {
    render(<OrderLookup />);
    expect(screen.getByTestId("order-lookup-go")).toBeDisabled();
    fireEvent.change(screen.getByTestId("order-lookup-input"), { target: { value: "abc123" } });
    fireEvent.click(screen.getByTestId("order-lookup-go"));
    expect(mockPush).toHaveBeenCalledWith("/admin/orders/abc123");
  });
});
