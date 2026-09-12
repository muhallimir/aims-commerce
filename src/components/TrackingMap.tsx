import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";

export interface TrackingMapProps {
  origin: { lat: number; lng: number; label: string };
  destination: { lat: number; lng: number; label: string } | null;
  /** 0..1 courier progress along the route */
  progress: number;
}

function dot(color: string, size = 18): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<div style="background:${color};width:${size}px;height:${size}px;border-radius:50%;border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 1) map.fitBounds(points, { padding: [40, 40] });
    else if (points.length === 1) map.setView(points[0], 11);
  }, [map, points]);
  return null;
}

/**
 * Real OpenStreetMap parcel map. Origin is our warehouse, destination is
 * the geocoded shipping address, courier marker interpolates by progress.
 */
export function TrackingMap({ origin, destination, progress }: TrackingMapProps) {
  const t = Math.min(1, Math.max(0, progress));
  const dest = destination ?? origin;
  const courier: [number, number] = [
    origin.lat + (dest.lat - origin.lat) * t,
    origin.lng + (dest.lng - origin.lng) * t,
  ];
  const line: [number, number][] = [
    [origin.lat, origin.lng],
    [courier[0], courier[1]],
  ];
  const full: [number, number][] = [
    [origin.lat, origin.lng],
    [dest.lat, dest.lng],
  ];

  return (
    <MapContainer
      data-testid="tracking-map"
      center={[origin.lat, origin.lng]}
      zoom={5}
      scrollWheelZoom={false}
      style={{ height: 320, width: "100%", borderRadius: 8 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[origin.lat, origin.lng]} icon={dot("#2e7d32")} />
      {destination && (
        <>
          <Polyline positions={full} pathOptions={{ color: "#9db89a", weight: 5, dashArray: "8 8" }} />
          <Polyline positions={line} pathOptions={{ color: "#2e7d32", weight: 5 }} />
          <Marker position={[dest.lat, dest.lng]} icon={dot("#1565c0")} />
        </>
      )}
      <Marker position={courier} icon={dot("#ff6f00", 22)} />
      <FitBounds points={destination ? full : [[origin.lat, origin.lng]]} />
    </MapContainer>
  );
}
