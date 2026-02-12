import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { MAP_VIEW_SETTINGS } from "../config/viewConfigs";

interface MapControllerProps {
  mode: "building" | "floorplan";
  bounds: L.LatLngBoundsExpression;
  imageWidth: number;
  imageHeight: number;
}

const MapController: React.FC<MapControllerProps> = ({
  mode,
  bounds,
  imageWidth,
  imageHeight,
}) => {
  const map = useMap();

  useEffect(() => {
    const handleSizing = () => {
      const baseConfig = (MAP_VIEW_SETTINGS as any)[mode];
      if (!map || !baseConfig) return;

      // Detect mobile (standard 768px breakpoint)
      const isMobile = window.innerWidth < 768;
      
      // Merge mobile overrides if they exist for this mode
      const config = isMobile && baseConfig.mobile 
        ? { ...baseConfig, ...baseConfig.mobile } 
        : baseConfig;

      map.invalidateSize({ animate: false });
      const container = map.getContainer();

      if (config.fitType === "cover") {
        const zoomW = Math.log2(container.offsetWidth / imageWidth);
        const zoomH = Math.log2(container.offsetHeight / imageHeight);
        const coverZoom = Math.max(zoomW, zoomH);

        map.setView([imageHeight / 2, imageWidth / 2], coverZoom, { animate: false });
        map.setMinZoom(coverZoom + config.minZoomOffset);
        map.setMaxZoom(coverZoom + config.maxZoomOffset);
      } else {
        // Fits the floorplan SVG within the viewport
        map.fitBounds(bounds, { padding: config.padding, animate: false });
        const minZoom = map.getBoundsZoom(bounds);
        
        // Applies the -1 (zoom out further) or +1 (zoom in less) offsets on mobile
        map.setMinZoom(minZoom + config.minZoomOffset);
        map.setMaxZoom(minZoom + config.maxZoomOffset);
      }
    };

    handleSizing();
    const timer = setTimeout(handleSizing, 100);
    window.addEventListener("resize", handleSizing);

    return () => {
      window.removeEventListener("resize", handleSizing);
      clearTimeout(timer);
    };
  }, [map, mode, bounds, imageWidth, imageHeight]);

  return null;
};

export default MapController;