import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import { Floor } from "../types/building";

interface FloorMarkerProps {
  floor: Floor;
  center?: [number, number]; // Receive specific coordinate
  onSelect: (floor: Floor) => void;
}

export default function FloorMarker({ floor, center, onSelect }: FloorMarkerProps) {
  if (!center) return null;
  const position: [number, number] = [center[1], center[0]];

  const pulseIcon = L.divIcon({
    className: "relative",
    html: `
      <div class="marker-pulse-container">
        <div class="marker-pulse-ring" data-kind="${floor.label}"></div>
        <div class="marker-pulse-dot">
          ${floor?.label}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  return (
    <Marker
      position={position}
      icon={pulseIcon}
      eventHandlers={{
        click: (e) => {
          L.DomEvent.stopPropagation(e);
          onSelect(floor);
        },
      }}
    />
  );
}