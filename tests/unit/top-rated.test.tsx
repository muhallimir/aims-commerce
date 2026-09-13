import { render, screen, fireEvent } from "@testing-library/react";
import { TopRatedSpotlight, topRated } from "@components/TopRatedSpotlight";

describe("topRated", () => {
  it("picks the highest-rated in-stock product with real reviews", () => {
    const list = [
      { _id: "a", name: "A", rating: 5, numReviews: 0, countInStock: 3 },
      { _id: "b", name: "B", rating: 4, numReviews: 10, countInStock: 3 },
      { _id: "c", name: "C", rating: 4.5, numReviews: 2, countInStock: 2 },
    ];
    expect(topRated(list)?._id).toBe("c");
    expect(topRated([])).toBeNull();
  });

  it("hides when nothing has reviews", () => {
    expect(topRated([{ _id: "a", rating: 5, numReviews: 0, countInStock: 3 }])).toBeNull();
  });

  it("breaks rating ties by review count", () => {
    const list = [
      { _id: "a", rating: 4.5, numReviews: 3, countInStock: 3 },
      { _id: "b", rating: 4.5, numReviews: 30, countInStock: 3 },
    ];
    expect(topRated(list)?._id).toBe("b");
  });
});

describe("TopRatedSpotlight", () => {
  it("reads snake_case counts too", () => {
    expect(topRated([{ _id: "s", rating: 4, num_reviews: 7, count_in_stock: 2 }])?._id).toBe("s");
  });

  it("opens the winner on tap", () => {
    const onOpen = jest.fn();
    render(<TopRatedSpotlight products={[{ _id: "c", name: "C", rating: 4.5, numReviews: 6, countInStock: 2 }]} onOpen={onOpen} />);
    expect(screen.getByTestId("top-rated-name")).toHaveTextContent("C");
    fireEvent.click(screen.getByTestId("top-rated-open"));
    expect(onOpen).toHaveBeenCalledWith("c");
  });
});
