import React from "react";
import { Info } from "lucide-react";
import { useBuilding } from "../context/BuildingContext";
import UnitDetails from "./UnitDetails";

interface UnitSidebarProps {
  onOpenGallery: () => void;
}

export default function UnitSidebar({ 
  onOpenGallery 
}: UnitSidebarProps) {
  const { activeUnit } = useBuilding();

  return (
    <div
      className="hidden lg:flex flex-col h-full z-1002 relative w-[420px]"
    >
      {/* Content Container */}
      <div className="flex-1 flex flex-col bg-white border-l border-slate-100 shadow-xl overflow-hidden h-full">
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
    </div>
  );
}