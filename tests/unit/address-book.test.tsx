import { render, screen, fireEvent } from "@testing-library/react";
import { AddressBook, loadBook } from "@components/AddressBook";

jest.mock("next/router", () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock("react-redux", () => ({ useDispatch: () => jest.fn() }));

describe("AddressBook", () => {
  beforeEach(() => localStorage.clear());

  it("requires the essentials and saves the rest", () => {
    render(<AddressBook />);
    fireEvent.click(screen.getByTestId("address-add"));
    expect(screen.getByTestId("address-error")).toBeVisible();
    fireEvent.change(screen.getByTestId("address-field-label"), { target: { value: "Home" } });
    fireEvent.change(screen.getByTestId("address-field-fullName"), { target: { value: "Sam" } });
    fireEvent.change(screen.getByTestId("address-field-address"), { target: { value: "1 Main St" } });
    fireEvent.change(screen.getByTestId("address-field-city"), { target: { value: "NYC" } });
    fireEvent.click(screen.getByTestId("address-add"));
    expect(loadBook()).toHaveLength(1);
    expect(loadBook()[0]).toMatchObject({ label: "Home", city: "NYC" });
  });
});
