// src/config/viewConfigs.ts
import L, { PointExpression } from "leaflet";
import { BACKGROUND_FILL } from "./mapStyles";

export const MAP_VIEW_SETTINGS = {
  debug: import.meta.env.VITE_DEBUG === "true",
  animationDuration: 0,
  defaultBackground: BACKGROUND_FILL,

  // Shared MapContainer props moved from UnitMap.tsx
  mapDefaults: {
    crs: L.CRS.Simple,
    attributionControl: false,
    keyboard: false,
    fadeAnimation: false,
    zoomAnimation: false,
    markerZoomAnimation: false,
    maxBoundsViscosity: 1.0, // Ensures the map doesn't "bounce" outside of bounds
    zoomSnap: 0,              // Allows for precise fractional zoom levels
  },

  building: {
    fitType: "cover",
    zoomControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    touchZoom: false,
    minZoomOffset: 0,
    maxZoomOffset: 0,
    padding: [0, 0] as PointExpression,

    mobile: {
      fitType: "contain",
      padding: [0, 0] as PointExpression,
    }
  },

  floorplan: {
    fitType: "contain", // Mandatory to fit SVG in both dimensions
    zoomControl: true,
    dragging: true,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    touchZoom: true,
    zoom: 0,
    minZoomOffset: -0.5,    // Locks minimum zoom to the "fitted" size
    maxZoomOffset: 1,  // Prevents excessive zooming in
        padding: [50, 50] as PointExpression, 

    mobile: {
      minZoomOffset: -1,
      maxZoomOffset: 1,
      padding: [0, 0] as PointExpression,
      zoomControl: true,
      dragging: true,
      scrollWheelZoom: false,
      doubleClickZoom: true,

    }
  },
};

export const UI_TRANSITIONS = "transition-all duration-200";