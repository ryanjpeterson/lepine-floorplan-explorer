/* src/components/FloorplanView.tsx */

import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronDown,
  Map as MapIcon,
  LayoutGrid,
  ArrowLeft,
  Heart,
} from "lucide-react";
import { useBuilding } from "../context/BuildingContext";
import UnitMap from "./UnitMap";
import UnitGrid from "./UnitGrid";
import UnitFilters from "./UnitFilters";
import UnitSidebar from "./UnitSidebar";
import UnitDrawer from "./UnitDrawer";
import TourModal from "./TourModal";
import GalleryModal from "./GalleryModal";
import FavouritesView from "./FavouritesView";
import { Unit } from "../types/building";

const FloorDropdown = ({ 
  activeFloor, 
  floors, 
  selectFloor, 
  isMenuOpen, 
  setIsMenuOpen 
}: any) => {
  return (
    <div className="relative flex flex-col items-center">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center gap-2 bg-white text-[#102a43] px-3 py-2 rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 cursor-pointer"
      >
        <span className="text-xs lg:text-sm font-bold whitespace-nowrap">{activeFloor.name}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${isMenuOpen ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 transition-all duration-300 flex flex-col gap-1 bg-white p-1.5 rounded-2xl shadow-xl border border-slate-200 min-w-[160px] overflow-hidden z-[1002] mt-2 ${
          isMenuOpen
            ? "opacity-100 translate-y-0 max-h-[40vh] overflow-y-auto"
            : "opacity-0 -translate-y-4 max-h-0 pointer-events-none"
        }`}
      >
        {floors.map((floor: any) => (
          <button
            key={floor.id}
            onClick={() => {
              selectFloor(floor.id);
              setIsMenuOpen(false);
            }}
            className={`p-2 rounded-xl text-left text-sm font-medium cursor-pointer ${
              activeFloor.id === floor.id
                ? "bg-[#102a43] text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {floor.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default function FloorplanView() {
  const {
    data,
    activeFloor,
    activeUnit,
    selectUnit,
    viewMode,
    setViewMode,
    floors,
    selectFloor,
    goBackToBuilding,
    activeTour,
    setActiveTour,
    gridTab,
    setGridTab,
    favorites,
    previousViewMode
  } = useBuilding();

  const [isFloorMenuOpen, setIsFloorMenuOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(false);
  const [recenterTrigger, setRecenterTrigger] = useState(0);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [activeFloor?.id]);

  if (!activeFloor) return null;

  const hasUnits = activeFloor.units && activeFloor.units.length > 0;
  const favoritesCount = favorites.length;
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
    <div className="flex flex-col lg:flex-row h-[100dvh] w-full overflow-hidden relative bg-slate-50 font-['Jost']">
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
        
        <div className="z-[1001] bg-white backdrop-blur-sm border-b border-slate-200 p-3 shrink-0">
          <div className="flex items-center justify-between gap-2 h-10">
            
            <div className="flex-1 flex justify-start items-center">
              <button
                onClick={goBackToBuilding}
                className="hidden lg:flex bg-[#102a43] text-white px-4 py-2 rounded-xl font-bold text-xs transition-all items-center gap-2 whitespace-nowrap cursor-pointer hover:bg-[#1a3a5a]"
              >
                <ArrowLeft size={14} /> Back
              </button>
            </div>

            <div className="flex-shrink-0 min-w-[40px]">
              {viewMode === "map" && !isFavoritesActive && (
                <FloorDropdown 
                  activeFloor={activeFloor}
                  floors={floors}
                  selectFloor={selectFloor}
                  isMenuOpen={isFloorMenuOpen}
                  setIsMenuOpen={setIsFloorMenuOpen}
                />
              )}
            </div>

            <div className="flex-1 flex justify-end">
              <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl">
                <button
                  onClick={() => {
                    setGridTab("all");
                    setViewMode("map");
                  }}
                  className={`flex items-center gap-1.5 px-2 lg:px-3 py-1.5 rounded-lg text-[10px] lg:text-xs font-bold transition-all cursor-pointer ${
                    viewMode === "map" && !isFavoritesActive 
                      ? "bg-white text-[#102a43] shadow-sm border border-slate-200" 
                      : "text-slate-400 border border-transparent"
                  }`}
                >
                  <MapIcon size={14} /> <span className="hidden xs:inline">Map</span>
                </button>
                
                <button
                  onClick={() => {
                    setGridTab("all");
                    setViewMode("grid");
                  }}
                  className={`flex items-center gap-1.5 px-2 lg:px-3 py-1.5 rounded-lg text-[10px] lg:text-xs font-bold transition-all cursor-pointer ${
                    viewMode === "grid" && !isFavoritesActive 
                      ? "bg-white text-[#102a43] shadow-sm border border-slate-200" 
                      : "text-slate-400 border border-transparent"
                  }`}
                >
                  <LayoutGrid size={14} /> <span className="hidden xs:inline">List</span>
                </button>

                <button
                  disabled={favoritesCount === 0}
                  onClick={() => {
                    if (isFavoritesActive) {
                      setGridTab("all");
                      setViewMode(previousViewMode || "grid");
                    } else {
                      setGridTab("favorites");
                    }
                  }}
                  className={`flex items-center gap-1.5 px-2 lg:px-3 py-1.5 rounded-lg text-[10px] lg:text-xs font-bold transition-all border ${
                    favoritesCount === 0
                      ? "bg-transparent text-slate-300 border-transparent cursor-not-allowed"
                      : isFavoritesActive
                      ? "bg-rose-600 text-white border-rose-600 cursor-pointer shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 cursor-pointer shadow-sm"
                  }`}
                >
                  <Heart size={14} fill={isFavoritesActive ? "currentColor" : "none"} />
                  <span className="hidden sm:inline">({favoritesCount})</span>
                </button>
              </div>
            </div>
          </div>
        </div>

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
            ) : (
              <div className="h-full overflow-y-auto no-scrollbar p-4 lg:p-8">
                <UnitGrid onSelectUnit={handleUnitSelect} />
              </div>
            )}
          </div>
        </div>

        <div className="z-[1001] bg-white backdrop-blur-sm border-t border-slate-200 p-4 shrink-0">
          <div className="flex justify-center items-center h-8"> 
            <img 
              src={data?.logo} 
              alt={data?.name}
              className="max-h-full w-auto object-contain py-1" 
            />
          </div>
        </div>
      </div>

      {hasUnits && (
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