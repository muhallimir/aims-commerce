import { filterByRole, roleOf } from "@lib/roleFilter";

describe("roleFilter", () => {
  const users = [
    { name: "Ada", isAdmin: true },
    { name: "Selma", isSeller: true },
    { name: "Sam" },
  ];

  it("classifies admin over seller", () => {
    expect(roleOf({ isAdmin: true, isSeller: true })).toBe("admin");
    expect(roleOf({})).toBe("customer");
  });

  it("filters each role", () => {
    expect(filterByRole(users, "all")).toHaveLength(3);
    expect(filterByRole(users, "admin").map((u) => u.name)).toEqual(["Ada"]);
    expect(filterByRole(users, "seller").map((u) => u.name)).toEqual(["Selma"]);
    expect(filterByRole(users, "customer").map((u) => u.name)).toEqual(["Sam"]);
  });
});
