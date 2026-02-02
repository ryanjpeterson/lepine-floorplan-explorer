import React, { memo } from "react";
import { Polygon, Tooltip } from "react-leaflet";
import L from "leaflet";
import { POLYGON_STYLES } from "../config/mapStyles";
// 1. Import the Unit type to resolve implicit 'any' and property access errors
import { Unit } from "../types/building";

// 2. Define an interface for the component props to solve errors 2339
interface UnitPolygonProps {
  unit: Unit;
  isActive: boolean;
  onSelect: (unit: Unit) => void;
}

// 3. Apply the interface to React.memo to ensure properties exist on the destructured object
const UnitPolygon = memo<UnitPolygonProps>(({ unit, isActive, onSelect }) => {
  const currentStyle = isActive
    ? POLYGON_STYLES.active
    : POLYGON_STYLES.inactive;

  return (
    <Polygon
      positions={unit.polygon} // 4. unit.polygon is now correctly typed
      pathOptions={currentStyle}
      eventHandlers={{
        click: (e: L.LeafletMouseEvent) => {
          L.DomEvent.stopPropagation(e);
          onSelect(unit);
        },
        // 5. Explicitly typing event parameters as a best practice
        mouseover: (e: L.LeafletMouseEvent) => e.target.setStyle(POLYGON_STYLES.hover),
        mouseout: (e: L.LeafletMouseEvent) => e.target.setStyle(currentStyle),
      }}
    >
      <Tooltip permanent direction="center" className="polygon-label">
        {unit.title}
      </Tooltip>
    </Polygon>
  );
});

export default UnitPolygon;