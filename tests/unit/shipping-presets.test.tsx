import { render, screen, fireEvent } from "@testing-library/react";
import { ShippingPresets, loadPresets } from "@components/ShippingPresets";

describe("ShippingPresets", () => {
  beforeEach(() => localStorage.clear());

  it("saves and removes presets", () => {
    render(<ShippingPresets />);
    fireEvent.change(screen.getByTestId("preset-name"), { target: { value: "West" } });
    fireEvent.change(screen.getByTestId("preset-zone"), { target: { value: "CA-NV-OR" } });
    fireEvent.change(screen.getByTestId("preset-rate"), { target: { value: "7.5" } });
    fireEvent.click(screen.getByTestId("preset-add"));
    expect(loadPresets()).toHaveLength(1);
    expect(loadPresets()[0]).toMatchObject({ name: "West", rate: 7.5 });
    const id = loadPresets()[0].id;
    fireEvent.click(screen.getByTestId(`preset-remove-${id}`));
    expect(loadPresets()).toHaveLength(0);
  });
});
