// src/components/BuildingMap.tsx
import React, { useEffect } from "react";
import { MapContainer, ImageOverlay, useMap } from "react-leaflet";
import L from "leaflet";
import MapController from "./MapController";
import FloorMarker from "./FloorMarker";
import { MAP_VIEW_SETTINGS } from "../config/viewConfigs";
import { Floor } from "../types/building";
import "leaflet/dist/leaflet.css";

import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

interface BuildingMapProps {
  config: { url: string; width: number; height: number; };
  floors: Floor[];
  onSelect: (floor: Floor) => void;
}

const DebugControls = () => {
  const map = useMap();
  const isDebug = MAP_VIEW_SETTINGS.debug;

  useEffect(() => {
    if (!isDebug) return;

    const pmMap = map as any;
    if (pmMap.pm) {
      pmMap.pm.addControls({
        position: "topleft",
        drawMarker: true,
        drawPolygon: true,
        editMode: true,
        dragMode: true,
        removalMode: true,
      });
    }

    const logCoords = (layer: any, action: string) => {
      if (layer instanceof L.Marker) {
        const latLng = layer.getLatLng();
        console.log(`%c[${action}] Center Coord:`, "color: #00dbb5; font-weight: bold;");
        console.log(`"center": [${Math.round(latLng.lng)}, ${Math.round(latLng.lat)}],`);
        return;
      }
    };

    map.on("pm:create", (e) => logCoords(e.layer, "CREATED"));
    return () => { if (pmMap.pm) pmMap.pm.removeControls(); };
  }, [map, isDebug]);

  return null;
};

const BuildingMap: React.FC<BuildingMapProps> = ({ config, floors, onSelect }) => {
  const bounds: L.LatLngBoundsExpression = [[0, 0], [config.height, config.width]];
  const settings = MAP_VIEW_SETTINGS.building;

  return (
    <MapContainer
      crs={L.CRS.Simple}
      className="h-full w-full"
      style={{ background: MAP_VIEW_SETTINGS.defaultBackground }}
      {...settings}
    >
      <DebugControls />
      <ImageOverlay url={config.url} bounds={bounds} />
      <MapController mode="building" bounds={bounds} imageWidth={config.width} imageHeight={config.height} />
      {floors.map((floor) => (
        <FloorMarker key={floor.id} floor={floor} onSelect={onSelect} />
      ))}
    </MapContainer>
  );
};

export default BuildingMap;