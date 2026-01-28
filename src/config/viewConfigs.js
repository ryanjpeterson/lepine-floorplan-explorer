import { BACKGROUND_FILL } from "./mapStyles";

export const MAP_VIEW_SETTINGS = {
  debug: import.meta.env.VITE_DEBUG === "true",
  animationDuration: 0.5,
  defaultBackground: BACKGROUND_FILL,

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

  floorplan: {
    fitType: "contain",
    zoomControl: true,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: true,
    touchZoom: true,
    minZoomOffset: -1,
    maxZoomOffset: 1,
    padding: [0, 0],
  },
};

export const UI_TRANSITIONS = "transition-all duration-200";
