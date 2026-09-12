import { render, screen, fireEvent } from "@testing-library/react";
import { CampaignCreator, makeCampaignCode, campaignPreview } from "@components/CampaignCreator";

describe("campaign helpers", () => {
  it("codes and previews read right", () => {
    expect(makeCampaignCode(20)).toMatch(/^SAVE20-[A-Z0-9]{4}$/);
    expect(campaignPreview(20, "2026-12-25")).toContain("20% off everything");
  });
});

describe("CampaignCreator", () => {
  it("regenerates the code on demand", () => {
    render(<CampaignCreator />);
    const before = screen.getByTestId("campaign-code").textContent;
    fireEvent.click(screen.getByTestId("campaign-regen"));
    const after = screen.getByTestId("campaign-code").textContent;
    expect(before).toMatch(/^SAVE20-/);
    expect(after).toMatch(/^SAVE20-/);
    expect(screen.getByTestId("campaign-text")).toHaveTextContent(/20% off/);
  });
});
