import { render, screen, fireEvent } from "@testing-library/react";
import { EmptyCartPicks, topPicks } from "@components/EmptyCartPicks";

jest.mock("react-redux", () => ({ useDispatch: () => jest.fn() }));

describe("topPicks", () => {
  it("returns the three highest-rated", () => {
    const list = [
      { _id: "a", rating: 3 },
      { _id: "b", rating: 5 },
      { _id: "c", rating: 4 },
      { _id: "d", rating: 4.5 },
    ];
    expect(topPicks(list).map((p) => p._id)).toEqual(["b", "d", "c"]);
  });
});

describe("EmptyCartPicks", () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ _id: "b", name: "Boot", price: 80, rating: 5 }],
    });
  });
  afterEach(() => {
    delete (global as any).fetch;
  });

  it("renders picks with add buttons", async () => {
    render(<EmptyCartPicks />);
    expect(await screen.findByTestId("empty-cart-picks")).toBeVisible();
    expect(screen.getByTestId("top-pick-b")).toHaveTextContent("Boot");
    fireEvent.click(screen.getByTestId("top-pick-add-b"));
  });
});
