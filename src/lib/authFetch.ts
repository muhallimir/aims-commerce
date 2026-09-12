import Cookies from "js-cookie";

/** App auth convention: JWT in the `token` cookie, Bearer header out. */
export function authHeaders(): HeadersInit {
  const token = Cookies.get("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Same-origin API fetch with the auth header attached when signed in. */
export function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  return fetch(input, {
    ...init,
    headers: { ...authHeaders(), ...(init?.headers ?? {}) },
  });
}
