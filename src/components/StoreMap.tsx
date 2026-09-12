import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const HQ: [number, number] = [1.3521, 103.8198];

const pin = L.divIcon({
  className: "",
  html: `<div style="background:#1565c0;width:22px;height:22px;border-radius:50%;border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

/** Real store map: HQ pin on OpenStreetMap tiles. */
export function StoreMap() {
  return (
    <MapContainer
      center={HQ}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: 280, width: "100%", borderRadius: 8 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={HQ} icon={pin}>
        <Popup>AIMS flagship store · 10:00 – 21:00 daily</Popup>
      </Marker>
    </MapContainer>
  );
}
