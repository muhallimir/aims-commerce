import Cookies from "js-cookie";
import { authHeaders, apiFetch } from "@lib/authFetch";

describe("authFetch", () => {
  beforeEach(() => {
    Cookies.remove("token");
  });

  it("sends no auth header when signed out", () => {
    expect(authHeaders()).toEqual({});
  });

  it("forwards the cookie token as a Bearer header", () => {
    Cookies.set("token", "test-jwt");
    expect(authHeaders()).toEqual({ Authorization: "Bearer test-jwt" });
  });

  it("apiFetch attaches headers to the request", async () => {
    Cookies.set("token", "abc123");
    const fake = jest.fn().mockResolvedValue({ ok: true });
    (global as any).fetch = fake;
    await apiFetch("/api/orders/mine");
    expect(fake).toHaveBeenCalledWith(
      "/api/orders/mine",
      expect.objectContaining({ headers: { Authorization: "Bearer abc123" } })
    );
    delete (global as any).fetch;
  });
});
