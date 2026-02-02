import React from "react";
import { Polygon, Tooltip } from "react-leaflet";
import L from "leaflet";
import { POLYGON_STYLES } from "../config/mapStyles";
// 1. Import the Floor type to define the prop structure
import { Floor } from "../types/building";

// 2. Define an interface for the component props
interface FloorPolygonProps {
  floor: Floor;
  onSelect: (floor: Floor) => void;
}

export default function FloorPolygon({ floor, onSelect }: FloorPolygonProps) {
  return (
    <Polygon
      positions={floor.polygon} // positions is now typed through the Floor interface
      pathOptions={POLYGON_STYLES.inactive}
      eventHandlers={{
        click: (e: L.LeafletMouseEvent) => {
          L.DomEvent.stopPropagation(e);
          if (typeof onSelect === "function") {
            onSelect(floor);
          } else {
            console.error("onSelect is not a function in FloorPolygon");
          }
        },
        // 3. Explicitly type event parameters to prevent internal 'any' errors
        mouseover: (e: L.LeafletMouseEvent) => e.target.setStyle(POLYGON_STYLES.hover),
        mouseout: (e: L.LeafletMouseEvent) => e.target.setStyle(POLYGON_STYLES.inactive),
      }}
    >
      <Tooltip permanent direction="center" className="polygon-label">
        {floor.name}
      </Tooltip>
    </Polygon>
  );
}