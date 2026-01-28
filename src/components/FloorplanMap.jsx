// src/components/FloorplanMap.jsx
import React, { useEffect } from "react";
import {
  MapContainer,
  ImageOverlay,
  Polygon,
  ZoomControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { POLYGON_STYLES } from "../config/mapStyles";
import { MAP_VIEW_SETTINGS } from "../config/viewConfigs";
import "leaflet/dist/leaflet.css";

function MapController({ bounds }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !bounds) return;

    const fitImage = () => {
      map.invalidateSize();

      // Use 'inside: true' or no padding to force the image to touch the edges.
      // If you want it even tighter, you can calculate the aspect ratio
      // and manually set a zoom level, but fitBounds is usually best.
      map.fitBounds(bounds, {
        padding: [0, 0], // Removes the "progress" zoom-out you're seeing
        animate: true,
        duration: 0.5,
      });
    };

    fitImage();
    window.addEventListener("resize", fitImage);
    return () => window.removeEventListener("resize", fitImage);
  }, [map, bounds]);

  return null;
}

export default function FloorplanMap({
  mode,
  config,
  items,
  activeId,
  onSelect,
}) {
  // Use dimensions from BUILDING_CONFIG or Floor config
  const bounds = [
    [0, 0],
    [config.height, config.width],
  ];

  const paddingFactor = 0;
  const outerBounds = [
    [-config.height * paddingFactor, -config.width * paddingFactor],
    [config.height * (1 + paddingFactor), config.width * (1 + paddingFactor)],
  ];

  return (
    <MapContainer
      crs={L.CRS.Simple}
      bounds={bounds}
      // Change maxBounds to outerBounds to allow zooming out beyond the image edges
      maxBounds={outerBounds}
      maxBoundsViscosity={0.5} // Lower viscosity makes it feel less "stuck"
      minZoom={-1} // Ensure minZoom is low enough to scale down large images
      attributionControl={false}
      zoomControl={false}
      className="h-full w-full bg-[#f8fafc]"
    >
      <ZoomControl position="topleft" />
      <ImageOverlay url={config.url} bounds={bounds} />

      {/* This component handles the automatic fitting logic */}
      <MapController bounds={bounds} />

      {items.map((item) => {
        const isActive = activeId === item.id;
        const baseStyle = isActive
          ? POLYGON_STYLES.active
          : POLYGON_STYLES.inactive;

        return (
          <Polygon
            key={item.id}
            positions={item.polygon}
            pathOptions={baseStyle}
            eventHandlers={{
              click: (e) => {
                L.DomEvent.stopPropagation(e);
                onSelect(item);
              },
              mouseover: (e) => e.target.setStyle(POLYGON_STYLES.hover),
              mouseout: (e) => e.target.setStyle(baseStyle),
            }}
          />
        );
      })}
    </MapContainer>
  );
}
