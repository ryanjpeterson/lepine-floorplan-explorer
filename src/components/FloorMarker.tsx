import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import { Floor } from "../types/building";

interface FloorMarkerProps {
  floor: Floor;
  onSelect: (floor: Floor) => void;
}

export default function FloorMarker({ floor, onSelect }: FloorMarkerProps) {
  const centerPoint = floor.center;
  
  if (!centerPoint) return null;

  const position: [number, number] = [centerPoint[1], centerPoint[0]];

  const pulseIcon = L.divIcon({
    className: "relative",
    html: `
      <div class="marker-pulse-container">
        <div class="marker-pulse-ring"></div>
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