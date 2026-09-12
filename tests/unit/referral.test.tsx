import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ReferralCard, referralCodeFor } from "@components/ReferralCard";

jest.mock("react-redux", () => ({
  useSelector: (fn: any) => fn({ user: { userInfo: { _id: "abc-123" } } }),
}));

describe("referralCodeFor", () => {
  it("builds a stable personal code", () => {
    expect(referralCodeFor("abc-123")).toBe("AIMS-ABC123-10");
    expect(referralCodeFor(undefined)).toBe("AIMS-GUEST-10");
  });
});

describe("ReferralCard", () => {
  it("copies the personal link", async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(<ReferralCard />);
    expect(screen.getByTestId("referral-link-input")).toHaveDisplayValue(/AIMS-ABC123-10/);
    fireEvent.click(screen.getByTestId("referral-copy"));
    await waitFor(() => expect(writeText).toHaveBeenCalled());
    expect(screen.getByTestId("referral-done")).toBeVisible();
  });
});
