import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ShareButton, buildShareText } from "@components/ShareButton";

describe("ShareButton", () => {
  it("builds the share text", () => {
    expect(buildShareText("Sneaker", "https://x/p/1")).toBe("Sneaker — https://x/p/1");
  });

  it("copies the link and confirms", async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    delete (navigator as any).share;
    render(<ShareButton name="Sneaker" />);
    fireEvent.click(screen.getByTestId("share-button"));
    await waitFor(() => expect(writeText).toHaveBeenCalled());
    expect(await screen.findByTestId("share-confirm")).toBeVisible();
  });
});
