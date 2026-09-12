import { render, screen } from "@testing-library/react";
import { SeoPreview, seoAdvice, slugifySeo } from "@components/SeoPreview";

describe("seoAdvice", () => {
  it("warns on empty, long and thin copy", () => {
    expect(seoAdvice("", "").warnings).toContain("Add a product name first.");
    expect(seoAdvice("x".repeat(61), "y".repeat(200)).warnings).toHaveLength(2);
    expect(seoAdvice("Sneaker", "Nice.").warnings).toContain("Flesh the description out past 50 characters.");
    expect(slugifySeo("Red Sneaker 2!")).toBe("red-sneaker-2");
  });
});

describe("SeoPreview", () => {
  it("mirrors typing into the snippet", () => {
    render(<SeoPreview title="" description="" />);
    expect(screen.getByTestId("seo-url")).toHaveTextContent(/product$/);
  });

  it("flags an overlong title", () => {
    render(<SeoPreview title={"x".repeat(61)} description={"y".repeat(100)} />);
    expect(screen.getByTestId("seo-warning")).toHaveTextContent(/truncates past 60/);
  });
});
