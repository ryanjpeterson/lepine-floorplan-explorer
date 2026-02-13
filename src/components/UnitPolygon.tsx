import React, { memo } from "react";
import { Polygon, Tooltip } from "react-leaflet";
import L from "leaflet";
import { POLYGON_STYLES } from "../config/mapStyles";
import { Unit } from "../types/building";

interface UnitPolygonProps {
  unit: Unit;
  isActive: boolean;
  onSelect: (unit: Unit) => void;
  positions: [number, number][];
}

const UnitPolygon = memo<UnitPolygonProps>(({ unit, isActive, onSelect, positions }) => {
  // If no matching ID was found in the SVG, do not render
  if (!positions || positions.length === 0) return null;

  const currentStyle = isActive ? POLYGON_STYLES.active : POLYGON_STYLES.inactive;

  return (
    <Polygon
      positions={positions}
      pathOptions={currentStyle}
      eventHandlers={{
        click: (e: L.LeafletMouseEvent) => {
          L.DomEvent.stopPropagation(e);
          onSelect(unit);
        },
        mouseover: (e: L.LeafletMouseEvent) => e.target.setStyle(POLYGON_STYLES.hover),
        mouseout: (e: L.LeafletMouseEvent) => e.target.setStyle(currentStyle),
      }}
    >
      <Tooltip permanent direction="center" className="polygon-label">
        {unit.id}
      </Tooltip>
    </Polygon>
  );
});

export default UnitPolygon;