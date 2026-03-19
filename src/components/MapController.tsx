/* src/components/MapController.tsx */
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { MAP_VIEW_SETTINGS } from "../config/viewConfigs";
import { useBuilding } from "../context/BuildingContext";

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
  const { isDesktop } = useBuilding();

  useEffect(() => {
    const handleSizing = () => {
      const baseConfig = (MAP_VIEW_SETTINGS as any)[mode];
      if (!map || !baseConfig) return;

      // Breakpoint matching the layout shift in BuildingStaticScreen.tsx
      const isStackedLayout = !isDesktop;
      
      // Merge mobile/tablet overrides if they exist for this mode
      const config = isStackedLayout && baseConfig.mobile 
        ? { ...baseConfig, ...baseConfig.mobile } 
        : baseConfig;

      // Ensure Leaflet recalculates the container size
      map.invalidateSize({ animate: false });
      const container = map.getContainer();

      if (config.fitType === "cover") {
        // Standard 'cover' logic (typically for desktop building view)
        const zoomW = Math.log2(container.offsetWidth / imageWidth);
        const zoomH = Math.log2(container.offsetHeight / imageHeight);
        const coverZoom = Math.max(zoomW, zoomH);

        map.setView([imageHeight / 2, imageWidth / 2], coverZoom, { animate: false });
        map.setMinZoom(coverZoom + config.minZoomOffset);
        map.setMaxZoom(coverZoom + config.maxZoomOffset);
      } else {
        // Logic for 'contain' or width-fitting scenarios
        if (isStackedLayout && mode === 'building') {
          // Special logic: Always fit the building map width below 1024px
          // Calculate zoom needed to make image width equal container width
          const widthZoom = Math.log2(container.offsetWidth / imageWidth);
          
          // Map must be centered. Calculate center of image in CRS coordinates.
          // Origin [0,0] is at bottom-left in L.CRS.Simple.
          const center: L.LatLngExpression = [imageHeight / 2, imageWidth / 2];

          // Set view with the calculated width zoom and center
          map.setView(center, widthZoom, { animate: false });
          
          // Set min/max zoom relative to this fixed width zoom level
          map.setMinZoom(widthZoom + config.minZoomOffset);
          map.setMaxZoom(widthZoom + config.maxZoomOffset);
        } else {
          // Standard 'contain' logic: fits entire image (width & height) within container
          map.fitBounds(bounds, { 
            padding: config.padding, 
            animate: false 
          });
          
          const fitZoom = map.getBoundsZoom(bounds);
          
          map.setZoom(fitZoom, { animate: false });
          map.setMinZoom(fitZoom + config.minZoomOffset);
          map.setMaxZoom(fitZoom + config.maxZoomOffset);
        }
      }
    };

    // Initial sizing
    handleSizing();
    
    // Slight delay to allow layout shifts/render to settle
    const timer = setTimeout(handleSizing, 60);
    
    window.addEventListener("resize", handleSizing);

    return () => {
      window.removeEventListener("resize", handleSizing);
      clearTimeout(timer);
    };
  }, [map, mode, bounds, imageWidth, imageHeight]);

  return null;
};

export default MapController;