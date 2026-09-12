import { render, screen, fireEvent } from "@testing-library/react";
import { RefundPreview } from "@components/RefundPreview";

describe("RefundPreview", () => {
  it("stays hidden before delivery", () => {
    const { container } = render(<RefundPreview deliveredAt={null} total={100} />);
    expect(container.querySelector('[data-testid="refund-preview"]')).toBeNull();
  });

  it("approves sealed returns and prices them", () => {
    render(<RefundPreview deliveredAt={new Date().toISOString()} total={100} />);
    expect(screen.getByTestId("refund-verdict")).toHaveTextContent(/eligible/i);
    expect(screen.getByTestId("refund-verdict")).toHaveTextContent("$100.00");
  });

  it("reconsiders once the item is used", () => {
    render(<RefundPreview deliveredAt={new Date().toISOString()} total={100} />);
    fireEvent.mouseDown(screen.getByRole("button", { name: "Item condition" }));
    fireEvent.click(screen.getByRole("option", { name: "used" }));
    expect(screen.getByTestId("refund-verdict")).toHaveTextContent(/\$50\.00|not eligible/i);
  });
});
