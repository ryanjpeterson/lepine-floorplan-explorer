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
import ContentLoader from "../components/ContentLoader";
import PageShell from "../components/layout/PageShell";
import HomeButton from "../components/navigation/HomeButton";
import FloorSelector from "../components/navigation/FloorSelector";
import ViewToggles from "../components/navigation/ViewToggles";
import { Unit } from "../types/building";

const ObjView = lazy(() => import("./Building3DScreen"));

export default function FloorplanSVGScreen() {
  const { activeFloor, activeUnit, selectUnit, viewMode, gridTab, activeTour, setActiveTour, isDesktop, amenitiesData } = useBuilding();

  const [galleryState, setGalleryState] = useState<{ isOpen: boolean; images: string[]; activeIndex: number }>({
    isOpen: false,
    images: [],
    activeIndex: 0
  });

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(false);

  useEffect(() => { setIsMobileSidebarOpen(false); }, [activeFloor?.id]);

  const handleUnitSelect = useCallback((id: string) => {
    selectUnit(id);
    setIsDesktopSidebarOpen(true);
    if (!isDesktop) setIsMobileSidebarOpen(true);
  }, [selectUnit, isDesktop]);

  const handleAmenitySelect = useCallback((id: string) => {
    const index = amenitiesData.findIndex(a => a.id === id);
    if (index !== -1) {
      setGalleryState({
        isOpen: true,
        images: amenitiesData.map(a => a.image),
        activeIndex: index
      });
    }
  }, [amenitiesData]);

  const handleOpenUnitGallery = useCallback(() => {
    if (activeUnit?.gallery) {
      setGalleryState({
        isOpen: true,
        images: activeUnit.gallery,
        activeIndex: 0
      });
    }
  }, [activeUnit]);

  if (!activeFloor) return null;

  const hasUnits = activeFloor.units && activeFloor.units.length > 0;
  const isFavoritesActive = gridTab === "favorites";

  return (
    <PageShell
      headerLeft={<HomeButton />}
      headerCenter={viewMode === "map" && !isFavoritesActive && <FloorSelector />}
      headerRight={<ViewToggles />}
    >
      <div className="flex flex-col lg:flex-row h-full w-full overflow-hidden relative">
        <div className="flex-1 relative flex flex-col min-w-0 h-full z-10">
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
                    amenities={amenitiesData}
                    activeId={activeUnit?.id}
                    onSelect={(unit: Unit) => handleUnitSelect(unit.id)}
                    onAmenitySelect={handleAmenitySelect}
                  />
                </div>
              ) : viewMode === "3d" ? (
                <>
                  <div className="absolute inset-0 bg-cover bg-center blur-sm scale-110" style={{ backgroundImage: 'url(/sky.jpg)' }} />
                  <Suspense fallback={<ContentLoader label="Loading 3D Engine..." />}>
                    <ObjView />
                  </Suspense>
                </>
              ) : (
                <div className="h-full overflow-y-auto no-scrollbar py-4 lg:p-8">
                  <UnitGrid onSelectUnit={handleUnitSelect} />
                </div>
              )}
            </div>
          </div>
        </div>

        {hasUnits && viewMode !== "3d" && (
          <div className="relative z-20">
            <UnitSidebar onOpenGallery={handleOpenUnitGallery} />
            <UnitDrawer isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} onOpenGallery={handleOpenUnitGallery} />
          </div>
        )}

        <TourModal isOpen={!!activeTour} url={activeTour || ""} label="Virtual Tour" onClose={() => setActiveTour(null)} />

        <GalleryModal
          isOpen={galleryState.isOpen}
          images={galleryState.images}
          initialIndex={galleryState.activeIndex}
          onClose={() => setGalleryState(prev => ({ ...prev, isOpen: false }))}
        />
      </div>
    </PageShell>
  );
}