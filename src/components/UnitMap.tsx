// src/components/UnitMap.tsx
import React, { useEffect } from "react";
import { MapContainer, ImageOverlay, useMap } from "react-leaflet";
import L from "leaflet";
import MapController from "./MapController";
import UnitPolygon from "./UnitPolygon";
import AmenityTourMarker from "./AmenityTourMarker"; 
import RecenterControl from "./RecenterControl";
import { MAP_VIEW_SETTINGS } from "../config/viewConfigs";
import { Unit, AmenityTour, Tour, FloorConfig } from "../types/building";
import "leaflet/dist/leaflet.css";

import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

interface UnitMapProps {
  config: FloorConfig;
  units: Unit[];
  amenityTours: AmenityTour[];
  activeId: string | undefined;
  onSelect: (unit: Unit) => void;
  onTourSelect: (tour: Tour) => void;
  recenterTrigger?: number;
}

// Logic to re-fit the SVG whenever the window size changes
function ResizeHandler({ bounds, padding }: { bounds: L.LatLngBoundsExpression, padding: L.PointExpression }) {
  const map = useMap();

  useEffect(() => {
    const handleResize = () => {
      map.invalidateSize(); // Invalidate size to pick up new container dimensions
      map.fitBounds(bounds, { padding, animate: false }); // Fit to new screen size
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial call to fit on mount

    return () => window.removeEventListener("resize", handleResize);
  }, [map, bounds, padding]);

  return null;
}

function AutoRecenter({ trigger, bounds, padding }: { trigger: number; bounds: L.LatLngBoundsExpression; padding: L.PointExpression }) {
  const map = useMap();
  useEffect(() => {
    if (trigger > 0) {
      map.invalidateSize();
      map.fitBounds(bounds, { padding, animate: true });
    }
  }, [trigger, map, bounds, padding]);
  return null;
}

const formatCoordinates = (latLngs: any[]): number[][] => {
  const ring = Array.isArray(latLngs[0]) ? latLngs[0] : latLngs;
  return ring.map((pt: any) => [Math.round(pt.lng), Math.round(pt.lat)]);
};

const DebugControls = () => {
  const map = useMap();
  const isDebug = MAP_VIEW_SETTINGS.debug;

  useEffect(() => {
    if (!isDebug) return;
    const pmMap = map as any;
    if (pmMap.pm) {
      pmMap.pm.addControls({
        position: "topleft",
        drawPolygon: true,
        drawRectangle: true,
        editMode: true,
        dragMode: true,
        cutPolygon: true,
        removalMode: true,
        drawCircle: false,
        drawCircleMarker: false,
        drawText: false,
        drawMarker: false,
        drawPolyline: false,
        rotateMode: false,
      });
    }

    const logCoords = (layer: any, action: string) => {
      if (layer.getLatLngs) {
        const latLngs = layer.getLatLngs();
        const formattedPoints = formatCoordinates(latLngs);
        console.log(`%c[${action}] JSON Format:`, "color: #00dbb5; font-weight: bold;");
        console.log(`"polygon": ${JSON.stringify(formattedPoints, null, 2)},`);
      }
    };

    const handleCreate = (e: any) => {
      const layer = e.layer;
      logCoords(layer, "CREATED");
      layer.on("pm:edit", () => logCoords(layer, "EDITED"));
      layer.on("pm:dragend", () => logCoords(layer, "DRAGGED"));
      layer.on("pm:cut", () => logCoords(layer, "CUT"));
    };

    map.on("pm:create", handleCreate);
    return () => {
      if (pmMap.pm) pmMap.pm.removeControls();
      map.off("pm:create", handleCreate);
    };
  }, [map, isDebug]);

  return null;
};

export default function UnitMap({
  config,
  units,
  amenityTours,
  activeId,
  onSelect,
  onTourSelect,
  recenterTrigger = 0,
}: UnitMapProps) {
  const bounds: L.LatLngBoundsExpression = [
    [0, 0],
    [config.height, config.width],
  ];
  
  const settings = MAP_VIEW_SETTINGS.floorplan;
  const mapDefaults = MAP_VIEW_SETTINGS.mapDefaults;

  return (
    <div className="w-full h-full relative">
      <MapContainer
        className="h-full w-full"
        style={{ background: MAP_VIEW_SETTINGS.defaultBackground }}
        maxBounds={bounds} // Restricts user from panning the SVG off-screen
        {...mapDefaults}   // Common settings like zoomSnap
        {...settings}      // Floorplan specific settings
      >
        <DebugControls />
        <AutoRecenter trigger={recenterTrigger} bounds={bounds} padding={settings.padding} />
        
        {/* Handles the automatic screen fitting */}
        <ResizeHandler bounds={bounds} padding={settings.padding} />

        <ImageOverlay url={config.url} bounds={bounds} />
        <MapController
          mode="floorplan"
          bounds={bounds}
          imageWidth={config.width}
          imageHeight={config.height}
        />

        {units.map((unit: Unit) => (
          <UnitPolygon
            key={unit.id}
            unit={unit}
            isActive={activeId === unit.id}
            onSelect={onSelect}
          />
        ))}

        {amenityTours.map((tour: AmenityTour) => (
          <AmenityTourMarker 
            key={tour.id} 
            tour={tour} 
            onSelect={onTourSelect} 
          />
        ))}

        <RecenterControl bounds={bounds} padding={settings.padding} />
      </MapContainer>
    </div>
  );
}