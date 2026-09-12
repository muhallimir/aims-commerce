import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BoughtTogether, pickPair } from "@components/BoughtTogether";

describe("pickPair", () => {
  it("skips the current product", () => {
    expect(pickPair([{ _id: "a" }, { _id: "b" }], "a")).toEqual({ _id: "b" });
    expect(pickPair([{ _id: "a" }], "a")).toBeNull();
    expect(pickPair([], "a")).toBeNull();
  });
});

describe("BoughtTogether", () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ _id: "p1", name: "Cap", price: 20 }, { _id: "p2", name: "Sneaker", price: 50 }],
    });
  });
  afterEach(() => {
    delete (global as any).fetch;
  });

  it("pairs, totals and adds both", async () => {
    const onAddBoth = jest.fn();
    render(<BoughtTogether productId="p2" category="shoes" price={50} onAddBoth={onAddBoth} />);
    expect(await screen.findByTestId("bought-together")).toBeVisible();
    expect(screen.getByTestId("bought-together-pair")).toHaveTextContent("Cap");
    expect(screen.getByTestId("bought-together-total")).toHaveTextContent("$70.00");
    fireEvent.click(screen.getByTestId("bought-together-add"));
    expect(onAddBoth).toHaveBeenCalledWith("p1");
    expect(screen.getByTestId("bought-together-added")).toBeVisible();
  });
});
