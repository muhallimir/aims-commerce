import { render, screen, fireEvent } from "@testing-library/react";
import { OrdersCsvButton, ordersToCsv } from "@components/OrdersCsvButton";

describe("ordersToCsv", () => {
  it("serializes headers and quoted rows", () => {
    const csv = ordersToCsv([
      { _id: "o1", createdAt: "2026-09-01", user: { name: 'Sam "Speedy", Jr' }, totalPrice: 45, isPaid: true, isDelivered: false },
    ]);
    const lines = csv.split("\n");
    expect(lines[0]).toBe("id,date,customer,total,paid,delivered");
    expect(lines[1]).toContain('"Sam ""Speedy"", Jr"');
  });
});

describe("OrdersCsvButton", () => {
  it("disables on empty and downloads otherwise", () => {
    const { rerender } = render(<OrdersCsvButton orders={[]} />);
    expect(screen.getByTestId("orders-csv")).toBeDisabled();
    (URL as any).createObjectURL = jest.fn(() => "blob:fake");
    (URL as any).revokeObjectURL = jest.fn();
    const click = jest.fn();
    HTMLAnchorElement.prototype.click = click;
    rerender(<OrdersCsvButton orders={[{ _id: "o1", createdAt: "x", totalPrice: 1, isPaid: true, isDelivered: false }]} />);
    fireEvent.click(screen.getByTestId("orders-csv"));
    expect(click).toHaveBeenCalled();
  });
});
