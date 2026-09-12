import { render, screen } from "@testing-library/react";
import { OrderTimeline, stageStates } from "@components/OrderTimeline";

describe("stageStates", () => {
  it("walks placed -> paid -> shipped -> delivered", () => {
    expect(stageStates(false, false)).toEqual(["done", "current", "todo", "todo"]);
    expect(stageStates(true, false)).toEqual(["done", "done", "current", "todo"]);
    expect(stageStates(true, true)).toEqual(["done", "done", "done", "current"]);
  });
});

describe("OrderTimeline", () => {
  it("marks the courier stage current on a paid order", () => {
    render(<OrderTimeline isPaid isDelivered={false} />);
    expect(screen.getByTestId("order-stage-2")).toHaveAttribute("data-state", "current");
    expect(screen.getByTestId("order-timeline")).toHaveTextContent(/on its way/i);
  });
});
