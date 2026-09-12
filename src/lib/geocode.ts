export interface GeocodeResult {
  lat: number;
  lng: number;
  label: string;
}

/**
 * Forward-geocode a free-text address via LocationIQ (key already in env).
 * Returns null when the key is missing or the lookup fails, so callers
 * can fall back to a degraded UI instead of a fake map pin.
 */
export async function geocodeAddress(query: string): Promise<GeocodeResult | null> {
  const key = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY;
  const q = query.trim();
  if (!key || !q) return null;
  try {
    const res = await fetch(
      `https://us1.locationiq.com/v1/search?key=${key}&q=${encodeURIComponent(q)}&format=json&limit=1`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const first = Array.isArray(data) ? data[0] : null;
    if (!first || isNaN(Number(first.lat)) || isNaN(Number(first.lon))) return null;
    return { lat: Number(first.lat), lng: Number(first.lon), label: first.display_name ?? q };
  } catch {
    return null;
  }
}
