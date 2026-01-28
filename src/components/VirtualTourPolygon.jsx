import React from "react";
import { Marker } from "react-leaflet";
import L from "leaflet";

const tourIcon = L.divIcon({
  html: `
    <div style="
      background-color: #102a43;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid white;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    </div>
  `,
  className: "virtual-tour-marker",
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

export default function VirtualTourPolygon({ tour, onSelect }) {
  return (
    <Marker
      position={tour.position}
      icon={tourIcon}
      eventHandlers={{
        click: (e) => {
          L.DomEvent.stopPropagation(e);
          if (typeof onSelect === "function") onSelect(tour);
        },
      }}
    />
  );
}
