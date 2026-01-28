import React from "react";
import { MapContainer, ImageOverlay } from "react-leaflet";
import L from "leaflet";
import MapController from "./MapController";
import FloorPolygon from "./FloorPolygon";
import { MAP_VIEW_SETTINGS } from "../config/viewConfigs";
import "leaflet/dist/leaflet.css";

export default function BuildingMap({ config, floors, onSelect }) {
  const bounds = [
    [0, 0],
    [config.height, config.width],
  ];
  const settings = MAP_VIEW_SETTINGS.building;

  return (
    <MapContainer
      crs={L.CRS.Simple}
      className="h-full w-full"
      style={{ background: MAP_VIEW_SETTINGS.defaultBackground }}
      attributionControl={false}
      keyboard={false}
      zoomControl={settings.zoomControl}
      dragging={settings.dragging}
      scrollWheelZoom={settings.scrollWheelZoom}
      doubleClickZoom={settings.doubleClickZoom}
      touchZoom={settings.touchZoom}
    >
      <ImageOverlay url={config.url} bounds={bounds} />
      <MapController
        mode="building"
        bounds={bounds}
        imageWidth={config.width}
        imageHeight={config.height}
      />

      {floors.map((floor) => (
        <FloorPolygon
          key={floor.id}
          floor={floor}
          onSelect={onSelect} // Passes the navigate function to the polygon
        />
      ))}
    </MapContainer>
  );
}
