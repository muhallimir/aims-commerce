import { buildDataExport } from "@components/DataExportCard";

describe("buildDataExport", () => {
  it("stamps and bundles profile plus orders", () => {
    const out = buildDataExport({ name: "Sam" }, [{ _id: "o1" }]);
    expect(out.profile).toEqual({ name: "Sam" });
    expect(out.orders).toEqual([{ _id: "o1" }]);
    expect(new Date(out.exportedAt).getTime()).not.toBeNaN();
  });
});
