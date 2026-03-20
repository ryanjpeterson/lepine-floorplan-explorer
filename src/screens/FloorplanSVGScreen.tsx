/* src/screens/FloorplanSVGScreen.tsx */
import { useState, useCallback, lazy, Suspense } from "react";
import { useBuilding } from "../context/BuildingContext";
import UnitMap from "../components/UnitMap";
import UnitGrid from "../components/UnitGrid";
import UnitFilters from "../components/UnitFilters";
import UnitModal from "../components/UnitModal"; 
import CommercialGrid from "../components/CommercialGrid";
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
  const { activeFloor, activeUnit, selectUnit, viewMode, gridTab, activeTour, setActiveTour, amenitiesData } = useBuilding();

  const [galleryState, setGalleryState] = useState<{ isOpen: boolean; images: string[]; activeIndex: number }>({
    isOpen: false,
    images: [],
    activeIndex: 0
  });

  const handleUnitSelect = useCallback((id: string) => {
    selectUnit(id);
  }, [selectUnit]);

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

  const isFavoritesActive = gridTab === "favorites";
  const isGroundFloor = activeFloor.id === "0";

  return (
    <PageShell
      headerLeft={<HomeButton />}
      headerCenter={!isFavoritesActive && <FloorSelector />}
      headerRight={<ViewToggles />}
    >
      <div className="flex flex-col h-full w-full overflow-hidden relative">
        <div className="flex-1 relative flex flex-col min-w-0 h-full z-10">
          {/* Hide filters on Ground Floor directory */}
          {viewMode === "grid" && !isFavoritesActive && !isGroundFloor && <UnitFilters />}

          <div className="flex-1 relative overflow-hidden flex flex-col min-h-0">
            <div className="flex-1 relative overflow-hidden">
              {isFavoritesActive ? (
                <FavouritesView onSelectUnit={handleUnitSelect} />
              ) : viewMode === "map" ? (
                isGroundFloor ? (
                  <CommercialGrid onSelectUnit={handleUnitSelect} />
                ) : (
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
                )
              ) : viewMode === "3d" ? (
                <>
                  <div className="absolute inset-0 bg-cover bg-center blur-sm scale-110" style={{ backgroundImage: 'url(/sky.jpg)' }} />
                  <Suspense fallback={<ContentLoader label="Loading 3D Engine..." />}>
                    <ObjView />
                  </Suspense>
                </>
              ) : (
                /* Grid View: Always show the residential UnitGrid */
                <div className="h-full overflow-y-auto no-scrollbar py-4 lg:p-8">
                  <UnitGrid onSelectUnit={handleUnitSelect} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Universal Detail Modal (Replacement for Sidebar/Drawer) */}
        {activeUnit && (
          <UnitModal onOpenGallery={handleOpenUnitGallery} />
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