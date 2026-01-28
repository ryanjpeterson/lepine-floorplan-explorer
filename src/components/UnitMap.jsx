import React from "react";
import { MapContainer, ImageOverlay, useMap } from "react-leaflet";
import L from "leaflet";
import MapController from "./MapController";
import UnitPolygon from "./UnitPolygon";
import VirtualTourPolygon from "./VirtualTourPolygon";
import { MAP_VIEW_SETTINGS } from "../config/viewConfigs";
import "leaflet/dist/leaflet.css";

function RecenterControl({ bounds, padding }) {
  const map = useMap();
  return (
    <div
      className="leaflet-bottom leaflet-right"
      style={{ marginBottom: "20px", marginRight: "10px", zIndex: 1000 }}
    >
      <button
        onClick={() => map.fitBounds(bounds, { padding })}
        className="bg-white p-2 rounded shadow-md hover:bg-gray-100 flex items-center gap-2 text-sm font-bold border border-gray-200 transition-colors pointer-events-auto"
        style={{ fontFamily: "'Jost', sans-serif", color: "#102a43" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
        Recenter View
      </button>
    </div>
  );
}

export default function UnitMap({
  config,
  units,
  vrTours,
  activeUnitId,
  onSelect,
  onTourSelect,
}) {
  const bounds = [
    [0, 0],
    [config.height, config.width],
  ];
  const settings = MAP_VIEW_SETTINGS.floorplan;

  return (
    <MapContainer
      crs={L.CRS.Simple}
      className="h-full w-full"
      style={{ background: MAP_VIEW_SETTINGS.defaultBackground }}
      attributionControl={false}
      keyboard={false}
      {...settings}
    >
      <ImageOverlay url={config.url} bounds={bounds} />
      <MapController
        mode="floorplan"
        bounds={bounds}
        imageWidth={config.width}
        imageHeight={config.height}
      />

      {units.map((unit) => (
        <UnitPolygon
          key={unit.id}
          unit={unit}
          isActive={activeUnitId === unit.id}
          onSelect={onSelect}
        />
      ))}

      {vrTours.map((tour) => (
        <VirtualTourPolygon key={tour.id} tour={tour} onSelect={onTourSelect} />
      ))}

      <RecenterControl bounds={bounds} padding={settings.padding} />
    </MapContainer>
  );
}
