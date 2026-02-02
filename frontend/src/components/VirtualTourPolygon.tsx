import React, { memo } from "react";
import { Marker } from "react-leaflet";
import L from "leaflet";
// 1. Import the VRTour type to resolve property access errors
import { VRTour } from "../types/building";

const tourIcon = L.divIcon({
  html: `<div style="background-color: #102a43; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 15px rgba(0,0,0,0.3);"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg></div>`,
  className: "virtual-tour-marker",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// 2. Define an interface for the component props to solve errors 2339
interface VirtualTourPolygonProps {
  tour: VRTour;
  onSelect: (tour: VRTour) => void;
}

// 3. Apply the interface to React.memo to ensure props exist on the destructured object
const VirtualTourPolygon = memo<VirtualTourPolygonProps>(({ tour, onSelect }) => {
  return (
    <Marker
      position={tour.position} // 4. tour.position is now correctly typed
      icon={tourIcon} //
      zIndexOffset={1000} //
      eventHandlers={{
        click: (e: L.LeafletMouseEvent) => {
          L.DomEvent.stopPropagation(e); //
          if (typeof onSelect === "function") onSelect(tour); //
        },
      }}
    />
  );
});

export default VirtualTourPolygon;