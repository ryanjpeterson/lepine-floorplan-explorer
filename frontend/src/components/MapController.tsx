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
  const config = (MAP_VIEW_SETTINGS as any)[mode];

  useEffect(() => {
    if (!map || !config) return;

    const handleSizing = () => {
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
        map.fitBounds(bounds, { padding: config.padding, animate: false });
        const minZoom = map.getBoundsZoom(bounds);
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
  }, [map, mode, bounds, imageWidth, imageHeight, config]);

  return null;
};

export default MapController;