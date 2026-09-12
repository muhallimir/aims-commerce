import { render, screen } from "@testing-library/react";
import { ListingChecklist, checklistFor } from "@components/ListingChecklist";

describe("checklistFor", () => {
  it("counts a complete draft as ready", () => {
    const items = checklistFor({ name: "Cap", price: 20, category: "Hats", description: "A very fine cap indeed", countInStock: 5, image: "x.jpg" });
    expect(items.every((i) => i.done)).toBe(true);
  });

  it("flags an empty draft", () => {
    const items = checklistFor({ name: "", price: 0, category: "", description: "", countInStock: 0, image: "" });
    expect(items.some((i) => i.done)).toBe(false);
  });
});

describe("ListingChecklist", () => {
  it("shows live progress", () => {
    render(<ListingChecklist draft={{ name: "Cap", price: 0, category: "", description: "", countInStock: 0, image: "" }} />);
    expect(screen.getByTestId("listing-count")).toHaveTextContent("1/6");
  });
});
