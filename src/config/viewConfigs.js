// src/config/viewConfig.js
import { BACKGROUND_FILL } from "./mapStyles";

export const MAP_VIEW_SETTINGS = {
  debug: false,
  animationDuration: 0.5,
  defaultBackground: BACKGROUND_FILL,

  // Building View: Static "Cover" background
  building: {
    fitType: "cover",
    zoomControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    touchZoom: false,
    minZoomOffset: 0,
    maxZoomOffset: 0,
    padding: [0, 0],
  },

  // Floorplan View: Interactive "Contain" SVG
  floorplan: {
    fitType: "contain",
    zoomControl: true,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: true,
    touchZoom: true,
    minZoomOffset: -1, // Locks zoom-out to show full SVG
    maxZoomOffset: 1, // Allows deep zooming into units
    padding: [0, 0],
  },
};

export const UI_TRANSITIONS = "transition-all duration-200";
