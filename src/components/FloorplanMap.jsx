import React, { useEffect } from "react";
import { MapContainer, ImageOverlay, useMap } from "react-leaflet";
import L from "leaflet";
import MapController from "./MapController";
import FloorPolygon from "./FloorPolygon";
import UnitPolygon from "./UnitPolygon";
import VirtualTourPolygon from "./VirtualTourPolygon";
import { MAP_VIEW_SETTINGS } from "../config/viewConfigs";

// Import Geoman
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import "leaflet/dist/leaflet.css";

/**
 * RecenterControl: Positioned bottom-right with Jost font styling.
 */
function RecenterControl({ bounds, padding }) {
  const map = useMap();
  return (
    <div
      className="leaflet-bottom leaflet-right"
      style={{ marginBottom: "20px", marginRight: "10px", zIndex: 1000 }}
    >
      <button
        onClick={() => map.fitBounds(bounds, { padding })}
        className="bg-white p-2 rounded shadow-md hover:bg-gray-100 flex items-center gap-2 text-sm font-bold border border-gray-200 transition-colors"
        style={{
          pointerEvents: "auto",
          fontFamily: "'Jost', sans-serif",
          color: "#102a43",
        }}
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

/**
 * GeomanManager: Internal component to handle Geoman initialization logic
 * and coordinate logging for debugging.
 */
function GeomanManager() {
  const map = useMap();

  useEffect(() => {
    if (!map || !MAP_VIEW_SETTINGS.debug) return;

    // Initialize Geoman controls
    map.pm.addControls({
      position: "topright",
      drawMarker: false,
      drawPolyline: false,
      drawRectangle: true, // Useful for quick unit boxes
      drawPolygon: true,
      drawCircle: false,
      drawCircleMarker: false,
      editMode: true,
      dragMode: true,
      cutPolygon: false,
      removalMode: true,
    });

    // Event listener for when a polygon is edited or finished
    map.on("pm:edit", (e) => {
      const layer = e.layer;
      if (layer instanceof L.Polygon) {
        const coords = layer
          .getLatLngs()[0]
          .map((latlng) => [Math.round(latlng.lat), Math.round(latlng.lng)]);
        console.log("Updated Polygon (Edit):", JSON.stringify(coords));
      }
    });

    // Event listener for a newly created polygon
    map.on("pm:create", (e) => {
      const layer = e.layer;
      const coords = layer
        .getLatLngs()[0]
        .map((latlng) => [Math.round(latlng.lat), Math.round(latlng.lng)]);
      console.log("New Polygon Created:", JSON.stringify(coords));
    });

    return () => {
      if (map.pm) map.pm.removeControls();
    };
  }, [map]);

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

  const viewSettings = MAP_VIEW_SETTINGS[mode];

  return (
    <div className="h-full w-full relative overflow-hidden">
      {/* Debug Info Overlay */}
      {MAP_VIEW_SETTINGS.debug && (
        <div className="absolute top-4 left-4 z-[2000] bg-black/80 text-white p-3 rounded text-[10px] font-mono pointer-events-none border border-emerald-500/50">
          <p className="font-bold border-b border-white/20 mb-1 pb-1 text-emerald-400">
            GEOMAN DEBUG ENABLED
          </p>
          <p>Mode: {mode}</p>
          <p>Active ID: {activeId || "None"}</p>
          <p className="mt-2 text-slate-400 italic">
            1. Click the 'Edit' icon in top-right
          </p>
          <p>2. Drag vertex points</p>
          <p>3. Check Browser Console for [Y, X] coords</p>
        </div>
      )}

      <MapContainer
        key={mode}
        crs={L.CRS.Simple}
        className="h-full w-full"
        style={{ background: MAP_VIEW_SETTINGS.defaultBackground }}
        attributionControl={false}
        zoomControl={viewSettings.zoomControl}
        dragging={viewSettings.dragging}
        scrollWheelZoom={viewSettings.scrollWheelZoom}
        doubleClickZoom={viewSettings.doubleClickZoom}
        touchZoom={viewSettings.touchZoom}
      >
        <ImageOverlay url={config.url} bounds={bounds} />

        <MapController
          mode={mode}
          bounds={bounds}
          imageWidth={config.width}
          imageHeight={config.height}
        />

        {/* Handles Geoman Toolbar and Edit Events */}
        <GeomanManager />

        {/* Layer 1: Floor selections for Building mode */}
        {mode === "building" &&
          items.map((floor) => (
            <FloorPolygon key={floor.id} floor={floor} onSelect={onSelect} />
          ))}

        {/* Layer 2: Units for Floorplan mode */}
        {mode === "floorplan" &&
          items.map((unit) => (
            <UnitPolygon
              key={unit.id}
              unit={unit}
              isActive={activeId === unit.id}
              onSelect={onSelect}
            />
          ))}

        {/* Layer 3: Virtual Tours & Controls */}
        {mode === "floorplan" && (
          <>
            {vrTours.map((tour) => (
              <VirtualTourPolygon
                key={tour.id}
                tour={tour}
                onSelect={onTourSelect}
              />
            ))}
            <RecenterControl bounds={bounds} padding={viewSettings.padding} />
          </>
        )}
      </MapContainer>
    </div>
  );
}
