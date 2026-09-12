export interface LatLng {
  lat: number
  lng: number
}

export interface RoutePosition extends LatLng {
  segmentIndex: number
}

function clamp01(t: number): number {
  if (!Number.isFinite(t)) return 0
  if (t < 0) return 0
  if (t > 1) return 1
  return t
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}

export function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const s =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  return 2 * R * Math.asin(Math.sqrt(Math.max(0, Math.min(1, s))))
}

function segmentLengths(points: LatLng[]): number[] {
  const lens: number[] = []
  for (let i = 0; i < points.length - 1; i += 1) {
    lens.push(haversineKm(points[i], points[i + 1]))
  }
  return lens
}

export function interpolateRoute(points: LatLng[], t: number): RoutePosition {
  if (points.length === 0) throw new Error("interpolateRoute: need at least one point")
  if (points.length === 1) return { lat: points[0].lat, lng: points[0].lng, segmentIndex: 0 }
  const clamped = clamp01(t)
  const lens = segmentLengths(points)
  const total = lens.reduce((sum, l) => sum + l, 0)
  if (total === 0) return { lat: points[0].lat, lng: points[0].lng, segmentIndex: 0 }
  if (clamped <= 0) return { lat: points[0].lat, lng: points[0].lng, segmentIndex: 0 }
  if (clamped >= 1) {
    const last = points[points.length - 1]
    return { lat: last.lat, lng: last.lng, segmentIndex: points.length - 2 }
  }
  const target = clamped * total
  let acc = 0
  for (let i = 0; i < lens.length; i += 1) {
    const len = lens[i]
    if (acc + len >= target) {
      const frac = len === 0 ? 0 : (target - acc) / len
      return {
        lat: points[i].lat + (points[i + 1].lat - points[i].lat) * frac,
        lng: points[i].lng + (points[i + 1].lng - points[i].lng) * frac,
        segmentIndex: i,
      }
    }
    acc += len
  }
  const last = points[points.length - 1]
  return { lat: last.lat, lng: last.lng, segmentIndex: points.length - 2 }
}

export function routeProgress(points: LatLng[], t: number): number {
  if (points.length === 0) throw new Error("routeProgress: need at least one point")
  return Math.round(clamp01(t) * 100)
}
