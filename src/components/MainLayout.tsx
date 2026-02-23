/* src/components/MainLayout.tsx */
import React, { ReactNode, useState } from "react";
import { ArrowLeft, Map as MapIcon, LayoutGrid, Box, Heart, ChevronDown } from "lucide-react";
import { useBuilding } from "../context/BuildingContext";

interface MainLayoutProps {
  children: ReactNode;
}

const DISABLE_3D = import.meta.env.VITE_DISABLE_3D === "true";

const FloorDropdown = ({ activeFloor, floors, selectFloor }: any) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

export default function MainLayout({ children }: MainLayoutProps) {
  const {
    data,
    activeFloor,
    viewMode,
    setViewMode,
    floors,
    selectFloor,
    goBackToBuilding,
    gridTab,
    setGridTab,
    favorites,
    previousViewMode,
  } = useBuilding();

  if (!activeFloor) return null;

  const isFavoritesActive = gridTab === "favorites";
  const favoritesCount = favorites.length;

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-slate-50 font-['Jost']">
      {/* Internal App Header */}
      <header className="z-[1001] bg-white backdrop-blur-sm border-b border-slate-200 p-3 shrink-0">
        <div className="flex items-center justify-between gap-2 h-10 max-w-[1920px] mx-auto w-full">
          {/* Back Button */}
          <div className="flex-1 flex justify-start">
            <button
              onClick={goBackToBuilding}
              className="flex bg-[#102a43] text-white px-4 py-2 rounded-xl font-bold text-xs transition-all items-center gap-2 whitespace-nowrap cursor-pointer hover:bg-[#1a3a5a]"
            >
              <ArrowLeft size={14} /> Back
            </button>
          </div>

          {/* Floor Selector */}
          <div className="flex-shrink-0 min-w-[40px]">
            {viewMode === "map" && !isFavoritesActive && (
              <FloorDropdown 
                activeFloor={activeFloor}
                floors={floors}
                selectFloor={selectFloor}
              />
            )}
          </div>

          {/* View Toggles */}
          <div className="flex-1 flex justify-end">
            <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl">
              <button
                onClick={() => { setGridTab("all"); setViewMode("map"); }}
                className={`flex items-center gap-1.5 px-2 lg:px-3 py-1.5 rounded-lg text-[10px] lg:text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "map" && !isFavoritesActive 
                    ? "bg-white text-[#102a43] shadow-sm border border-slate-200" 
                    : "text-slate-400 border border-transparent"
                }`}
              >
                <MapIcon size={14} /> <span className="hidden xs:inline">Map</span>
              </button>
              
              <button
                onClick={() => { setGridTab("all"); setViewMode("grid"); }}
                className={`flex items-center gap-1.5 px-2 lg:px-3 py-1.5 rounded-lg text-[10px] lg:text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "grid" && !isFavoritesActive 
                    ? "bg-white text-[#102a43] shadow-sm border border-slate-200" 
                    : "text-slate-400 border border-transparent"
                }`}
              >
                <LayoutGrid size={14} /> <span className="hidden xs:inline">List</span>
              </button>

              {!DISABLE_3D && (
                <button
                  onClick={() => { setGridTab("all"); setViewMode("3d"); }}
                  className={`flex items-center gap-1.5 px-2 lg:px-3 py-1.5 rounded-lg text-[10px] lg:text-xs font-bold transition-all cursor-pointer ${
                    viewMode === "3d" && !isFavoritesActive 
                      ? "bg-white text-[#102a43] shadow-sm border border-slate-200" 
                      : "text-slate-400 border border-transparent"
                  }`}
                >
                  <Box size={14} /> <span className="hidden xs:inline">3D</span>
                </button>
              )}

              <button
                disabled={favoritesCount === 0}
                onClick={() => isFavoritesActive 
                  ? (setGridTab("all"), setViewMode(previousViewMode || "grid")) 
                  : setGridTab("favorites")
                }
                className={`flex items-center gap-1.5 px-2 lg:px-3 py-1.5 rounded-lg text-[10px] lg:text-xs font-bold transition-all border ${
                  favoritesCount === 0 
                    ? "bg-transparent text-slate-300 border-transparent cursor-not-allowed" 
                    : isFavoritesActive 
                    ? "bg-rose-600 text-white border-rose-600 shadow-sm" 
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 shadow-sm"
                }`}
              >
                <Heart size={14} fill={isFavoritesActive ? "currentColor" : "none"} />
                <span className="hidden sm:inline">({favoritesCount})</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Internal Content */}
      <main className="flex-1 relative overflow-hidden">
        {children}
      </main>

      {/* Persistent internal footer */}
      <footer className="z-[1001] bg-white backdrop-blur-sm border-t border-slate-200 p-4 shrink-0">
        <div className="flex justify-center items-center h-8"> 
          <img 
            src={data?.logo} 
            alt={data?.name}
            className="max-h-full w-auto object-contain py-1" 
          />
        </div>
      </footer>
    </div>
  );
}