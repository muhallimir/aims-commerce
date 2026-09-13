import { render, screen, fireEvent } from "@testing-library/react";
import { SearchSuggestions, suggestionsFor } from "@components/SearchSuggestions";

describe("suggestionsFor", () => {
  const catalog = [{ name: "Red Sneaker" }, { name: "Blue Boot" }, { name: "Red Cap" }];

  it("matches substrings, dedupes and caps", () => {
    expect(suggestionsFor(catalog, "r")).toEqual([]);
    expect(suggestionsFor(catalog, "red")).toEqual(["Red Sneaker", "Red Cap"]);
    expect(suggestionsFor(catalog, "red", 1)).toEqual(["Red Sneaker"]);
  });
});

describe("SearchSuggestions", () => {
  it("picks a suggestion on tap", () => {
    const onPick = jest.fn();
    render(<SearchSuggestions products={[{ name: "Red Sneaker" }]} query="red" onPick={onPick} />);
    fireEvent.click(screen.getByTestId("suggest-Red Sneaker"));
    expect(onPick).toHaveBeenCalledWith("Red Sneaker");
  });
});
