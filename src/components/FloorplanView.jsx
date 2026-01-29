// src/components/FloorplanView.jsx
import React, { useState } from "react";
import {
  ChevronUp,
  Map as MapIcon,
  LayoutGrid,
  Heart,
  ArrowLeft,
} from "lucide-react";
import { useBuilding } from "../context/BuildingContext";
import UnitMap from "./UnitMap";
import UnitGrid from "./UnitGrid";
import UnitFilters from "./UnitFilters";
import Sidebar from "./Sidebar";
import VirtualTourEmbed from "./VirtualTourEmbed";
import GalleryModal from "./GalleryModal";
import { UI_TRANSITIONS } from "../config/viewConfigs";

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

  if (!activeFloor) return null;

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-slate-50 font-['Jost']">
      <div className="flex-1 relative flex flex-col min-w-0">
        {/* Navigation Bar */}
        <div className="z-[1001] bg-white border-b border-slate-200 p-4">
          <div className="flex items-center justify-between gap-4">
            {/* FIX: Swapped position - Back button now on the Left */}
            <button
              onClick={goBackToBuilding}
              className="bg-[#102a43] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2"
            >
              <ArrowLeft size={14} /> Back to Building
            </button>

            {/* View Toggles now on the Right */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode("map")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === "map" ? "bg-white text-[#102a43] shadow-sm" : "text-slate-400"}`}
                >
                  <MapIcon size={14} /> Map
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === "grid" ? "bg-white text-[#102a43] shadow-sm" : "text-slate-400"}`}
                >
                  <LayoutGrid size={14} /> List
                </button>
              </div>

              {viewMode === "grid" && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setGridTab("all")}
                    className={`px-4 py-2 text-xs font-bold rounded-lg ${gridTab === "all" ? "bg-slate-100 text-[#102a43]" : "text-slate-400"}`}
                  >
                    All Units
                  </button>
                  <button
                    onClick={() => setGridTab("favorites")}
                    className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-2 ${gridTab === "favorites" ? "bg-rose-50 text-rose-600" : "text-slate-400"}`}
                  >
                    <Heart
                      size={12}
                      fill={gridTab === "favorites" ? "currentColor" : "none"}
                    />{" "}
                    Favorites ({favorites.length})
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Persistent Filters in Grid Mode */}
        {viewMode === "grid" && <UnitFilters />}

        <div className="flex-1 relative overflow-hidden flex flex-col">
          <div className="flex-1 relative overflow-y-auto no-scrollbar">
            {viewMode === "map" ? (
              <UnitMap
                config={activeFloor.config}
                units={activeFloor.units}
                vrTours={activeFloor.vrTours || []}
                activeUnitId={activeUnit?.id}
                onSelect={(unit) => selectUnit(unit.id)}
                onTourSelect={setActiveTour}
              />
            ) : (
              <div className="p-8">
                <UnitGrid />
              </div>
            )}
          </div>

          {viewMode === "map" && (
            /* FIX: Container uses pointer-events-none to prevent blocking the map */
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] flex flex-col items-center pointer-events-none">
              <div
                className={`${UI_TRANSITIONS} flex flex-col gap-1 bg-white p-1.5 rounded-2xl shadow-xl border border-slate-200 min-w-[160px] overflow-hidden pointer-events-auto ${
                  isFloorMenuOpen
                    ? "opacity-100 translate-y-0 max-h-[500px] mb-3"
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
                  className={`${UI_TRANSITIONS} ${isFloorMenuOpen ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          )}
        </div>
      </div>

      <Sidebar onOpenGallery={() => setIsGalleryOpen(true)} />

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
