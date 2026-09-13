import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DuplicateButton, duplicatePayload } from "@components/DuplicateButton";

describe("duplicatePayload", () => {
  it("copies fields, renames and zeroes stock", () => {
    expect(
      duplicatePayload({ name: "Cap", price: 20, countInStock: 5, brand: "A" })
    ).toMatchObject({ name: "Cap (Copy)", price: 20, countInStock: 0, brand: "A" });
  });
});

describe("DuplicateButton", () => {
  it("duplicates once and confirms", async () => {
    const onDuplicate = jest.fn().mockResolvedValue({});
    render(<DuplicateButton product={{ name: "Cap" }} onDuplicate={onDuplicate} />);
    fireEvent.click(screen.getByTestId("duplicate-button"));
    await waitFor(() => expect(onDuplicate).toHaveBeenCalledWith(expect.objectContaining({ name: "Cap (Copy)" })));
    expect(await screen.findByText("Duplicated")).toBeVisible();
  });
});
