import React from "react";
import { PanelRightClose, PanelRightOpen, Info } from "lucide-react";
import { useBuilding } from "../context/BuildingContext";
import UnitDetails from "./UnitDetails";

interface UnitSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onOpenGallery: () => void;
}

export default function UnitSidebar({ 
  isOpen, 
  onToggle, 
  onOpenGallery 
}: UnitSidebarProps) {
  const { activeUnit } = useBuilding();

  return (
    <div
      className={`hidden lg:flex flex-col h-full z-20 transition-all duration-500 relative ${
        isOpen ? "w-[420px]" : "w-0"
      }`}
    >
      {/* Toggle Button - positioned to stay accessible when sidebar is collapsed */}
      <button
        onClick={onToggle}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full bg-white border border-slate-200 p-2 rounded-l-xl shadow-md text-[#102a43] hover:bg-slate-50 z-1002"
      >
        {isOpen ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
      </button>

      {/* Content Container */}
      <div className={`flex-1 flex flex-col bg-white border-l border-slate-100 shadow-xl overflow-hidden h-full transition-all duration-500 ${!isOpen && 'border-l-0 shadow-none'}`}>
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