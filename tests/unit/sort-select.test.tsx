import { render, screen, fireEvent } from "@testing-library/react";
import { SortSelect } from "@components/SortSelect";

describe("SortSelect", () => {
  it("emits the picked sort key", async () => {
    const onChange = jest.fn();
    render(<SortSelect value="featured" onChange={onChange} />);
    fireEvent.mouseDown(screen.getByRole("button", { name: "Sort by" }));
    fireEvent.click(await screen.findByText("Price: low to high"));
    expect(onChange).toHaveBeenCalledWith("price-asc");
  });
});
