import React, { useState, useRef } from "react";
import { Info } from "lucide-react";
import { useBuilding } from "../context/BuildingContext";
import UnitDetails from "./UnitDetails";

export default function UnitDrawer({ isOpen, onClose, onOpenGallery }) {
  const { activeUnit } = useBuilding();
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);

  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    const deltaY = e.touches[0].clientY - startY.current;
    if (deltaY > 0) setDragOffset(deltaY);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (dragOffset > 100) onClose();
    setDragOffset(0);
  };

  return (
    <div
      className={`lg:hidden fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
      onClick={onClose}
    >
      <div
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] max-h-[90vh] flex flex-col transition-transform ${isDragging ? "duration-0" : "duration-500 ease-out"} ${isOpen ? "translate-y-0" : "translate-y-full"}`}
        style={{
          transform: isOpen
            ? `translateY(${dragOffset}px)`
            : "translateY(100%)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-full py-4 cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto" />
        </div>

        {activeUnit ? (
          <UnitDetails onOpenGallery={onOpenGallery} onClose={onClose} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
            <Info size={48} className="mb-4 opacity-20" />
            <p className="text-sm font-medium">Select a unit to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
