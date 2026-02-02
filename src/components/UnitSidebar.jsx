import React from "react";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { useBuilding } from "../context/BuildingContext";
import UnitDetails from "./UnitDetails";

export default function UnitSidebar({ isOpen, onToggle, onOpenGallery }) {
  const { activeUnit } = useBuilding();

  return (
    <div
      className={`hidden lg:flex flex-col bg-white border-l border-slate-100 h-full shadow-xl z-20 overflow-hidden transition-all duration-500 relative ${isOpen ? "w-[420px]" : "w-0 border-l-0"}`}
    >
      <button
        onClick={onToggle}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full bg-white border border-slate-200 p-2 rounded-l-xl shadow-md text-[#102a43] hover:bg-slate-50 z-30"
      >
        {isOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      <div className="min-w-[420px] h-full flex flex-col">
        {activeUnit ? (
          <UnitDetails onOpenGallery={onOpenGallery} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 h-full">
            <Info size={48} className="mb-4 opacity-20" />
            <p className="text-sm font-medium">Select a unit to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
