import { render, screen, fireEvent } from "@testing-library/react";
import { QuickViewDialog } from "@components/QuickViewDialog";

const P = { _id: "p1", name: "Sneaker", price: 50, description: "Runs great.", countInStock: 3 };

describe("QuickViewDialog", () => {
  it("stays shut without a product", () => {
    render(<QuickViewDialog product={null} onClose={() => {}} onAdd={() => {}} onDetails={() => {}} />);
    expect(screen.queryByTestId("quick-view-dialog")).toBeNull();
  });

  it("shows price, adds to cart and navigates to details", () => {
    const onAdd = jest.fn();
    const onDetails = jest.fn();
    const onClose = jest.fn();
    render(<QuickViewDialog product={P} onClose={onClose} onAdd={onAdd} onDetails={onDetails} />);
    expect(screen.getByTestId("quick-view-price").textContent).toBe("$50.00");
    fireEvent.click(screen.getByTestId("quick-view-add"));
    expect(onAdd).toHaveBeenCalledWith(P);
    expect(screen.getByTestId("quick-view-added")).toBeVisible();
    fireEvent.click(screen.getByTestId("quick-view-details"));
    expect(onDetails).toHaveBeenCalledWith(P);
  });
});
