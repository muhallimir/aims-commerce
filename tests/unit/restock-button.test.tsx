import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RestockButton, RESTOCK_QTY } from "@components/RestockButton";

describe("RestockButton", () => {
  it("adds a fixed batch through the caller", async () => {
    const onRestock = jest.fn().mockResolvedValue({});
    render(<RestockButton productId="sp1" current={2} onRestock={onRestock} />);
    expect(screen.getByTestId("restock-sp1")).toHaveTextContent(`+${RESTOCK_QTY}`);
    fireEvent.click(screen.getByTestId("restock-sp1"));
    await waitFor(() => expect(onRestock).toHaveBeenCalledWith("sp1", 12));
  });
});
