import { render, screen } from "@testing-library/react";
import { BreadcrumbTrail } from "@components/BreadcrumbTrail";

describe("BreadcrumbTrail", () => {
  it("links every level but the current page", () => {
    render(<BreadcrumbTrail items={[{ label: "Store", href: "/store" }, { label: "Shirts" }]} />);
    expect(screen.getByTestId("breadcrumb-0")).toHaveAttribute("href", "/store");
    expect(screen.getByTestId("breadcrumb-1")).toHaveTextContent("Shirts");
    expect(screen.getByTestId("breadcrumb-1").tagName).toBe("P");
  });
});
