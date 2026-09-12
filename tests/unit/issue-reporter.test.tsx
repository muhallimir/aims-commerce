import { render, screen, fireEvent } from "@testing-library/react";
import { IssueReporter, makeRef } from "@components/IssueReporter";

describe("makeRef", () => {
  it("derives a readable reference from the order", () => {
    expect(makeRef("64f2abcd1234")).toMatch(/^SUP-64F2AB-/);
  });
});

describe("IssueReporter", () => {
  it("files a damage report and returns a reference", () => {
    render(<IssueReporter orderId="64f2abcd1234" />);
    fireEvent.click(screen.getByTestId("issue-open"));
    fireEvent.mouseDown(screen.getByRole("button", { name: "What happened" }));
    fireEvent.click(screen.getByRole("option", { name: "Late delivery" }));
    fireEvent.click(screen.getByTestId("issue-submit"));
    expect(screen.getByTestId("issue-ref")).toHaveTextContent(/SUP-64F2AB-/);
  });
});
