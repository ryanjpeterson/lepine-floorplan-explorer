// src/components/FloorplanView.jsx
import React, { useState, useEffect } from "react";
import {
  ChevronUp,
  Map as MapIcon,
  LayoutGrid,
  Heart,
  ArrowLeft,
  Info,
} from "lucide-react";
import { useBuilding } from "../context/BuildingContext";
import UnitMap from "./UnitMap";
import UnitGrid from "./UnitGrid";
import UnitFilters from "./UnitFilters";
import Sidebar from "./Sidebar";
import VirtualTourEmbed from "./VirtualTourEmbed";
import GalleryModal from "./GalleryModal";

export default function FloorplanView() {
  const {
    activeFloor,
    activeUnit,
    selectFloor,
    selectUnit,
    viewMode,
    setViewMode,
    gridTab,
    setGridTab,
    favorites,
    floors,
    goBackToBuilding,
    activeTour,
    setActiveTour,
  } = useBuilding();

  const [isFloorMenuOpen, setIsFloorMenuOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Sync mobile sidebar state with unit selection changes
  useEffect(() => {
    if (activeUnit && window.innerWidth < 768) {
      setIsMobileSidebarOpen(true);
    }
  }, [activeUnit]);

  if (!activeFloor) return null;

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-slate-50 font-['Jost']">
      <div className="flex-1 relative flex flex-col min-w-0 h-full">
        {/* Navigation Bar */}
        <div className="z-[1001] bg-white border-b border-slate-200 p-4 shrink-0">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={goBackToBuilding}
              className="bg-[#102a43] text-white px-4 md:px-5 py-2.5 rounded-xl font-bold text-[10px] md:text-xs transition-all flex items-center gap-2"
            >
              <ArrowLeft size={14} /> Back
            </button>

            <div className="flex items-center gap-3 md:gap-6">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode("map")}
                  className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-[10px] md:text-xs font-bold transition-all ${viewMode === "map" ? "bg-white text-[#102a43] shadow-sm" : "text-slate-400"}`}
                >
                  <MapIcon size={14} />{" "}
                  <span className="hidden sm:inline">Map</span>
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-[10px] md:text-xs font-bold transition-all ${viewMode === "grid" ? "bg-white text-[#102a43] shadow-sm" : "text-slate-400"}`}
                >
                  <LayoutGrid size={14} />{" "}
                  <span className="hidden sm:inline">List</span>
                </button>
              </div>

              {viewMode === "grid" && (
                <button
                  onClick={() =>
                    setGridTab(gridTab === "all" ? "favorites" : "all")
                  }
                  className={`p-2.5 rounded-xl flex items-center gap-2 transition-all ${gridTab === "favorites" ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-400"}`}
                >
                  <Heart
                    size={16}
                    fill={gridTab === "favorites" ? "currentColor" : "none"}
                  />
                  <span className="text-[10px] font-bold hidden sm:inline">
                    {favorites.length}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {viewMode === "grid" && <UnitFilters />}

        <div className="flex-1 relative overflow-hidden flex flex-col min-h-0">
          <div className="flex-1 relative overflow-y-auto no-scrollbar">
            {viewMode === "map" ? (
              <UnitMap
                config={activeFloor.config}
                units={activeFloor.units}
                vrTours={activeFloor.vrTours || []}
                activeUnitId={activeUnit?.id}
                onSelect={(unit) => {
                  selectUnit(unit.id);
                  // Explicitly open popup on polygon click for mobile
                  if (window.innerWidth < 768) {
                    setIsMobileSidebarOpen(true);
                  }
                }}
                onTourSelect={setActiveTour}
              />
            ) : (
              <div className="p-4 md:p-8">
                <UnitGrid />
              </div>
            )}
          </div>

          {/* Floating Info Button for Mobile Map (Manual Trigger) */}
          {viewMode === "map" && activeUnit && (
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden absolute top-4 right-4 z-[1000] bg-white text-[#102a43] p-3 rounded-full shadow-2xl border border-slate-100"
            >
              <Info size={20} />
            </button>
          )}

          {/* Floor Selection Menu */}
          {viewMode === "map" && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] flex flex-col items-center pointer-events-none w-full px-4">
              <div
                className={`transition-all duration-300 flex flex-col gap-1 bg-white p-1.5 rounded-2xl shadow-xl border border-slate-200 min-w-[160px] overflow-hidden pointer-events-auto ${
                  isFloorMenuOpen
                    ? "opacity-100 translate-y-0 max-h-[40vh] overflow-y-auto mb-3"
                    : "opacity-0 translate-y-4 max-h-0 mb-0"
                }`}
              >
                {floors.map((floor) => (
                  <button
                    key={floor.id}
                    onClick={() => {
                      selectFloor(floor.id);
                      setIsFloorMenuOpen(false);
                    }}
                    className={`px-4 py-2.5 rounded-xl text-left text-sm font-medium ${activeFloor.id === floor.id ? "bg-[#102a43] text-white" : "text-slate-600 hover:bg-slate-100"}`}
                  >
                    {floor.name}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setIsFloorMenuOpen(!isFloorMenuOpen)}
                className="flex items-center gap-3 bg-white text-[#102a43] px-6 py-3 rounded-xl shadow-xl border border-slate-200 hover:bg-slate-50 pointer-events-auto"
              >
                <span className="text-sm font-bold">{activeFloor.name}</span>
                <ChevronUp
                  size={18}
                  className={`transition-transform duration-300 ${isFloorMenuOpen ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          )}
        </div>
      </div>

      <Sidebar
        onOpenGallery={() => setIsGalleryOpen(true)}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <VirtualTourEmbed
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
