import { render, screen, fireEvent } from "@testing-library/react";
import { TopRatedSpotlight, topRated } from "@components/TopRatedSpotlight";

describe("topRated", () => {
  it("picks the highest-rated in-stock product", () => {
    const list = [
      { _id: "a", name: "A", rating: 5, countInStock: 0 },
      { _id: "b", name: "B", rating: 4, countInStock: 3 },
      { _id: "c", name: "C", rating: 4.5, countInStock: 2 },
    ];
    expect(topRated(list)?._id).toBe("c");
    expect(topRated([])).toBeNull();
  });
});

describe("TopRatedSpotlight", () => {
  it("opens the winner on tap", () => {
    const onOpen = jest.fn();
    render(<TopRatedSpotlight products={[{ _id: "c", name: "C", rating: 4.5, countInStock: 2 }]} onOpen={onOpen} />);
    expect(screen.getByTestId("top-rated-name")).toHaveTextContent("C");
    fireEvent.click(screen.getByTestId("top-rated-open"));
    expect(onOpen).toHaveBeenCalledWith("c");
  });
});
