import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronDown,
  Map as MapIcon,
  LayoutGrid,
  ArrowLeft,
} from "lucide-react";
import { useBuilding } from "../context/BuildingContext";
import UnitMap from "./UnitMap";
import UnitGrid from "./UnitGrid";
import UnitFilters from "./UnitFilters";
import UnitSidebar from "./UnitSidebar";
import UnitDrawer from "./UnitDrawer";
import TourModal from "./TourModal";
import GalleryModal from "./GalleryModal";
import { Unit } from "../types/building";

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
  } = useBuilding();

  const [isFloorMenuOpen, setIsFloorMenuOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(false);
  const [recenterTrigger, setRecenterTrigger] = useState(0);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [activeFloor?.id]);

  useEffect(() => {
    if (activeUnit && window.innerWidth < 1024) {
      setIsMobileSidebarOpen(true);
    }
  }, [activeUnit?.id]);

  if (!activeFloor) return null;

  const hasUnits = activeFloor.units && activeFloor.units.length > 0;

  const toggleSidebar = useCallback(() => {
    setIsDesktopSidebarOpen((prev) => !prev);
    setTimeout(() => {
      setRecenterTrigger((prev) => prev + 1);
    }, 500);
  }, []);

  const handleUnitSelect = useCallback(
    (id: string) => {
      const wasClosed = !isDesktopSidebarOpen;
      selectUnit(id);
      setIsDesktopSidebarOpen(true);
      
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
    <div className="flex flex-col lg:flex-row h-screen w-full overflow-hidden relative bg-slate-50 font-['Jost']">
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

      {/* Main Content */}
      <div className="flex-1 relative flex flex-col min-w-0 h-full z-10">
        
        {/* VIEW MODE: MAP - TOP OVERLAY (Floor Dropdown) */}
        {viewMode === "map" && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] flex flex-col items-center pointer-events-none w-full px-4">
            <button
              onClick={() => setIsFloorMenuOpen(!isFloorMenuOpen)}
              className="flex items-center gap-3 bg-white text-[#102a43] px-6 py-3 rounded-xl shadow-xl border border-slate-200 hover:bg-slate-50 pointer-events-auto"
            >
              <span className="text-sm font-bold">{activeFloor.name}</span>
              <ChevronDown
                size={18}
                className={`transition-transform duration-300 ${
                  isFloorMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`transition-all duration-300 flex flex-col gap-1 bg-white p-1.5 rounded-2xl shadow-xl border border-slate-200 min-w-[160px] overflow-hidden pointer-events-auto mt-3 ${
                isFloorMenuOpen
                  ? "opacity-100 translate-y-0 max-h-[40vh] overflow-y-auto"
                  : "opacity-0 -translate-y-4 max-h-0"
              }`}
            >
              {floors.map((floor) => (
                <button
                  key={floor.id}
                  onClick={() => {
                    selectFloor(floor.id);
                    setIsFloorMenuOpen(false);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-left text-sm font-medium ${
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
        )}

        {viewMode === "grid" && <UnitFilters />}

        {/* Central Viewport */}
        <div className="flex-1 relative overflow-hidden flex flex-col min-h-0">
          <div className="flex-1 relative overflow-y-auto no-scrollbar">
            {viewMode === "map" ? (
              <UnitMap
                config={activeFloor.config}
                units={activeFloor.units}
                amenityTours={activeFloor.amenityTours || []}
                activeId={activeUnit?.id}
                onSelect={(unit: Unit) => handleUnitSelect(unit.id)}
                onTourSelect={setActiveTour}
                recenterTrigger={recenterTrigger}
              />
            ) : (
              <div className="p-4 lg:p-8">
                <UnitGrid onSelectUnit={handleUnitSelect} />
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM NAVIGATION BAR */}
        <div className="z-[1001] bg-white/90 backdrop-blur-sm border-t border-slate-200 p-4 shrink-0">
          <div className="flex items-center justify-between gap-4 h-8"> 
            <div className="flex-1 flex justify-start">
              <button
                onClick={goBackToBuilding}
                className="bg-[#102a43] text-white px-4 lg:px-5 py-2.5 rounded-xl font-bold text-[10px] lg:text-xs transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <ArrowLeft size={14} /> Back
              </button>
            </div>

            <div className="flex-[2] flex justify-center items-center h-full min-w-0">
              <img 
                src={data?.logo} 
                alt={data?.name}
                className="max-h-full w-auto object-contain py-1" 
              />
            </div>

            <div className="flex-1 flex justify-end">
              <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode("map")}
                  className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg text-[10px] lg:text-xs font-bold transition-all ${viewMode === "map" ? "bg-white text-[#102a43] shadow-sm" : "text-slate-400"}`}
                >
                  <MapIcon size={14} /> Map
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg text-[10px] lg:text-xs font-bold transition-all ${viewMode === "grid" ? "bg-white text-[#102a43] shadow-sm" : "text-slate-400"}`}
                >
                  <LayoutGrid size={14} /> List
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {hasUnits && (
        <div className="relative z-20">
          <UnitSidebar
            onOpenGallery={() => setIsGalleryOpen(true)}
          />
          <UnitDrawer
            isOpen={isMobileSidebarOpen}
            onClose={() => setIsMobileSidebarOpen(false)}
            onOpenGallery={() => setIsGalleryOpen(true)}
          />
        </div>
      )}

      {/* Modals omitted for brevity */}
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