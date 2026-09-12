import { templateCsv } from "@components/CsvTemplateCard";

describe("templateCsv", () => {
  it("emits headers plus one example row", () => {
    const lines = templateCsv().split("\n");
    expect(lines[0]).toBe("id,name,price,category,stock,brand");
    expect(lines[1]).toContain("Example Sneaker");
  });
});
