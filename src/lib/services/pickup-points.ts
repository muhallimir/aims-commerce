export interface GeoPoint {
  lat: number
  lng: number
}

export interface PickupPoint extends GeoPoint {
  id: string
  name: string
  hours: string
}

export interface RankedPickup extends PickupPoint {
  distanceKm: number
  etaMin: number
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}

export function haversineKm(a: GeoPoint, b: GeoPoint): number {
  const R = 6371
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const s =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  return 2 * R * Math.asin(Math.sqrt(Math.max(0, Math.min(1, s))))
}

export function rankPickups(user: GeoPoint, points: PickupPoint[]): RankedPickup[] {
  return points
    .map((p) => {
      const raw = haversineKm(user, { lat: p.lat, lng: p.lng })
      const distanceKm = Math.round(raw * 100) / 100
      return { ...p, distanceKm, etaMin: Math.round(distanceKm * 12) }
    })
    .sort((a, b) => a.distanceKm - b.distanceKm)
}
