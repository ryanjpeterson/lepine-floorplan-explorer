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
    const fitImageToScreen = () => {
      map.invalidateSize();
      map.fitBounds(bounds, {
        padding: MAP_VIEW_SETTINGS.fitBoundsPadding,
        animate: true,
        duration: MAP_VIEW_SETTINGS.animationDuration,
      });
    };
    fitImageToScreen();
    window.addEventListener("resize", fitImageToScreen);
    return () => window.removeEventListener("resize", fitImageToScreen);
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
  const bounds = [
    [0, 0],
    [config.height, config.width],
  ];

  return (
    <MapContainer
      crs={L.CRS.Simple}
      bounds={bounds}
      maxBounds={bounds}
      maxBoundsViscosity={MAP_VIEW_SETTINGS.maxBoundsViscosity}
      attributionControl={false}
      zoomControl={false}
      className={`h-full w-full bg-[${MAP_VIEW_SETTINGS.defaultBackground}]`}
    >
      <ZoomControl position="topleft" />
      <ImageOverlay url={config.url} bounds={bounds} />
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
              mouseover: (e) => {
                e.target.setStyle(POLYGON_STYLES.hover);
              },
              mouseout: (e) => {
                e.target.setStyle(baseStyle);
              },
            }}
          />
        );
      })}
    </MapContainer>
  );
}
