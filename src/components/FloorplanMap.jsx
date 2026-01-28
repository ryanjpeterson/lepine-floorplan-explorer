import React, { useEffect } from "react";
import { MapContainer, ImageOverlay, useMap } from "react-leaflet";
import L from "leaflet";
import FloorPolygon from "./FloorPolygon";
import UnitPolygon from "./UnitPolygon";
import VirtualTourPolygon from "./VirtualTourPolygon";
import { MAP_VIEW_SETTINGS } from "../config/viewConfigs";
import "leaflet/dist/leaflet.css";

function MapController({ items, bounds, imageWidth, imageHeight }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const handleSizing = () => {
      map.invalidateSize();
      const container = map.getContainer();

      // 1. Calculate zooms for both dimensions
      const zoomW = Math.log2(container.offsetWidth / imageWidth);
      const zoomH = Math.log2(container.offsetHeight / imageHeight);

      /** * MIMIC object-fit: cover
       * Using Math.max ensures the image fills the container entirely.
       * One dimension will fit perfectly, while the other overflows (cropped).
       */
      const coverZoom = Math.max(zoomW, zoomH);

      // 2. Calculate polygon-specific zoom if items exist
      let targetZoom = coverZoom;
      let targetCenter = [imageHeight / 2, imageWidth / 2];

      const allPoints = items?.flatMap((item) => item.polygon) || [];

      if (allPoints.length > 0) {
        const polygonBounds = L.latLngBounds(allPoints);
        const paddedBounds = polygonBounds.pad(0.15);

        // We take the higher of the cover zoom or the polygon fit zoom
        // to ensure we stay "zoomed in"
        const polyZoom = map.getBoundsZoom(paddedBounds);
        targetZoom = Math.max(coverZoom, polyZoom);
        targetCenter = polygonBounds.getCenter();
      }

      // 3. Apply constraints
      map.setMinZoom(coverZoom); // Prevents zooming out to see white space
      map.setMaxZoom(targetZoom + 1);

      map.setView(targetCenter, targetZoom, {
        animate: true,
        duration: MAP_VIEW_SETTINGS.animationDuration,
      });
    };

    handleSizing();
    window.addEventListener("resize", handleSizing);
    return () => window.removeEventListener("resize", handleSizing);
  }, [map, items, bounds, imageWidth, imageHeight]);

  return null;
}

export default function FloorplanMap({
  mode,
  config,
  items,
  vrTours = [],
  activeId,
  onSelect,
  onTourSelect,
}) {
  const bounds = [
    [0, 0],
    [config.height, config.width],
  ];

  return (
    <MapContainer
      crs={L.CRS.Simple}
      zoomControl={true}
      scrollWheelZoom={true} // Re-enabled so user can adjust the "cover" view
      doubleClickZoom={false}
      touchZoom={true}
      maxZoom={-2}
      dragging={true}
      attributionControl={false}
      className="h-full w-full"
      style={{ background: MAP_VIEW_SETTINGS.defaultBackground }}
    >
      <ImageOverlay url={config.url} bounds={bounds} />

      <MapController
        items={items}
        bounds={bounds}
        imageWidth={config.width}
        imageHeight={config.height}
      />

      {mode === "building" &&
        items.map((floor) => (
          <FloorPolygon key={floor.id} floor={floor} onSelect={onSelect} />
        ))}

      {mode === "floorplan" && (
        <>
          {items.map((unit) => (
            <UnitPolygon
              key={unit.id}
              unit={unit}
              isActive={activeId === unit.id}
              onSelect={onSelect}
            />
          ))}
          {vrTours.map((tour) => (
            <VirtualTourPolygon
              key={tour.id}
              tour={tour}
              onSelect={onTourSelect}
            />
          ))}
        </>
      )}
    </MapContainer>
  );
}
