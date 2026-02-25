/* src/components/navigation/ViewToggles.tsx */
import React from "react";
import { Map as MapIcon, LayoutGrid, Box, Heart } from "lucide-react";
import { useBuilding } from "../../context/BuildingContext";

const DISABLE_3D = import.meta.env.VITE_DISABLE_3D === "true";

export default function ViewToggles() {
  const {
    viewMode,
    setViewMode,
    gridTab,
    setGridTab,
    favorites,
    previousViewMode,
  } = useBuilding();

  const isFavoritesActive = gridTab === "favorites";
  const favoritesCount = favorites.length;

  return (
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
  );
}