import React from "react";
import { MapContainer, ImageOverlay } from "react-leaflet";
import L from "leaflet";
import MapController from "./MapController";
import UnitPolygon from "./UnitPolygon";
import VirtualTourPolygon from "./VirtualTourPolygon";
import RecenterControl from "./RecenterControl";
import { MAP_VIEW_SETTINGS } from "../config/viewConfigs";
// 1. Import your custom types
import { Unit, VRTour } from "../types/building";
import "leaflet/dist/leaflet.css";

// 2. Define an interface for the props to resolve errors 7031
interface UnitMapProps {
  config: {
    height: number;
    width: number;
    url: string;
  };
  units: Unit[];
  vrTours: VRTour[];
  activeUnitId: string | undefined;
  onSelect: (unit: Unit) => void;
  onTourSelect: (tour: VRTour) => void;
}

export default function UnitMap({
  config,
  units,
  vrTours,
  activeUnitId,
  onSelect,
  onTourSelect,
}: UnitMapProps) {
  // 3. Explicitly type bounds as LatLngBoundsExpression to resolve error 2322
  const bounds: L.LatLngBoundsExpression = [
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
      fadeAnimation={false}
      zoomAnimation={false}
      markerZoomAnimation={false}
      {...settings}
    >
      <ImageOverlay url={config.url} bounds={bounds} />
      <MapController
        mode="floorplan"
        bounds={bounds}
        imageWidth={config.width}
        imageHeight={config.height}
      />
      {/* 4. Type the .map parameters to resolve errors 7006 */}
      {units.map((unit: Unit) => (
        <UnitPolygon
          key={unit.id}
          unit={unit}
          isActive={activeUnitId === unit.id}
          onSelect={onSelect}
        />
      ))}
      {vrTours.map((tour: VRTour) => (
        <VirtualTourPolygon 
          key={tour.id} 
          tour={tour} 
          onSelect={onTourSelect} 
        />
      ))}
      <RecenterControl bounds={bounds} padding={settings.padding} />
    </MapContainer>
  );
}