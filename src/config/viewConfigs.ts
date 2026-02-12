// src/config/viewConfigs.ts
import { PointExpression } from "leaflet";
import { BACKGROUND_FILL } from "./mapStyles";

export const MAP_VIEW_SETTINGS = {
  debug: import.meta.env.VITE_DEBUG === "true",
  animationDuration: 0,
  defaultBackground: BACKGROUND_FILL,

  building: {
    // Desktop Defaults
    fitType: "cover",
    zoomControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    touchZoom: false,
    minZoomOffset: 0,
    maxZoomOffset: 0,
    padding: [0, 0] as PointExpression,

    // Mobile Overrides
    mobile: {
      fitType: "contain",
      padding: [0, 0] as PointExpression, // No padding to ensure it fits perfectly edge-to-edge
    }
  },

  floorplan: {
    fitType: "contain",
    zoomControl: true,
    dragging: true,
    scrollWheelZoom: true,
    doubleClickZoom: true,
    touchZoom: true,
    minZoomOffset: 0,
    maxZoomOffset: 2,
    padding: [20, 20] as PointExpression,

    mobile: {
      minZoomOffset: -1,
      maxZoomOffset: 1,
    }
  },
};

export const UI_TRANSITIONS = "transition-all duration-200";