/* src/screens/FloorplanSVGScreen.tsx */

import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { useBuilding } from "../context/BuildingContext";
import UnitMap from "../components/UnitMap";
import UnitGrid from "../components/UnitGrid";
import UnitFilters from "../components/UnitFilters";
import UnitSidebar from "../components/UnitSidebar";
import UnitDrawer from "../components/UnitDrawer";
import TourModal from "../components/TourModal";
import GalleryModal from "../components/GalleryModal";
import FavouritesView from "./FavouriteUnitsScreen";
import { Unit } from "../types/building";

// Lazy load the heavy 3D view to improve initial load performance
const ObjView = lazy(() => import("./Building3DScreen"));

export default function FloorplanSVGScreen() {
  const {
    data,
    activeFloor,
    activeUnit,
    selectUnit,
    viewMode,
    gridTab,
    favorites,
    activeTour,
    setActiveTour,
  } = useBuilding();

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(false);
  const [recenterTrigger, setRecenterTrigger] = useState(0);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [activeFloor?.id]);

  if (!activeFloor) return null;

  const hasUnits = activeFloor.units && activeFloor.units.length > 0;
  const isFavoritesActive = gridTab === "favorites";

  const handleUnitSelect = useCallback(
    (id: string) => {
      const wasClosed = !isDesktopSidebarOpen;
      selectUnit(id);
      setIsDesktopSidebarOpen(true);
      
      if (window.innerWidth < 1024) {
        setIsMobileSidebarOpen(true);
      }
      
      if (wasClosed) {
        setTimeout(() => {
          setRecenterTrigger((prev) => prev + 1);
        }, 500);
      }
    },
    [selectUnit, isDesktopSidebarOpen],
  );

  const bgImageUrl = data?.config?.url;

  return (
    <div className="flex flex-col lg:flex-row h-full w-full overflow-hidden relative font-['Jost']">
      {/* Screen-specific blurred background */}
      {bgImageUrl && (
        <div 
          className="absolute inset-0 z-0 pointer-events-none opacity-25"
          style={{
            backgroundImage: `url(${bgImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'grayscale(100%) blur(10px)',
            transform: 'scale(1.05)'
          }}
        />
      )}

      <div className="flex-1 relative flex flex-col min-w-0 h-full z-10">
        {/* Filters only show in List view */}
        {viewMode === "grid" && !isFavoritesActive && <UnitFilters />}

        <div className="flex-1 relative overflow-hidden flex flex-col min-h-0">
          <div className="flex-1 relative overflow-hidden">
            {isFavoritesActive ? (
              <FavouritesView onSelectUnit={handleUnitSelect} />
            ) : viewMode === "map" ? (
              <div className="h-full relative overflow-y-auto no-scrollbar">
                <UnitMap
                  config={activeFloor.config}
                  units={activeFloor.units}
                  activeId={activeUnit?.id}
                  onSelect={(unit: Unit) => handleUnitSelect(unit.id)}
                />
              </div>
            ) : viewMode === "3d" ? (
              <Suspense 
                fallback={
                  <div className="h-full w-full flex items-center justify-center bg-slate-900 text-white font-bold">
                    Loading 3D Engine...
                  </div>
                }
              >
                <ObjView />
              </Suspense>
            ) : (
              <div className="h-full overflow-y-auto no-scrollbar py-4 lg:p-8">
                <UnitGrid onSelectUnit={handleUnitSelect} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Unit details overlays */}
      {hasUnits && viewMode !== "3d" && (
        <div className="relative z-20">
          <UnitSidebar onOpenGallery={() => setIsGalleryOpen(true)} />
          <UnitDrawer
            isOpen={isMobileSidebarOpen}
            onClose={() => setIsMobileSidebarOpen(false)}
            onOpenGallery={() => setIsGalleryOpen(true)}
          />
        </div>
      )}

      <TourModal
        isOpen={!!activeTour}
        url={activeTour?.url}
        label={activeTour?.label}
        onClose={() => setActiveTour(null)}
      />
      <GalleryModal
        isOpen={isGalleryOpen}
        images={activeUnit?.gallery}
        onClose={() => setIsGalleryOpen(false)}
      />
    </div>
  );
}