// src/components/Sidebar.jsx
import React, { useState, useRef } from "react";
import {
  Heart,
  Download,
  Image as ImageIcon,
  Maximize,
  Bed,
  Bath,
  DoorOpen,
  Waves,
  Utensils,
  Trees,
  Monitor,
  Shirt,
  Accessibility,
  Hammer,
  Wind,
  Sparkles,
  Info,
  X,
} from "lucide-react";
import { useBuilding } from "../context/BuildingContext";

export default function Sidebar({ onOpenGallery, isOpen, onClose }) {
  const { activeUnit, favorites, toggleFavorite } = useBuilding();

  // Drag-to-close state for mobile/tablet bottom sheet
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);

  const attributeIcons = {
    sqft: { label: "sqft", icon: Maximize },
    numOfBeds: { label: "Beds", icon: Bed },
    numOfBaths: { label: "Baths", icon: Bath },
    balcony: { label: "Balcony", icon: DoorOpen },
    tub: { label: "Tub", icon: Waves },
    pantry: { label: "Pantry", icon: Utensils },
    terrace: { label: "Terrace", icon: Trees },
    officeDen: { label: "Office/Den", icon: Monitor },
    walkInCloset: { label: "Walk-in Closet", icon: Shirt },
    barrierFree: { label: "Barrier Free", icon: Accessibility },
    builtIns: { label: "Built-ins", icon: Hammer },
    juliet: { label: "Juliet Balcony", icon: Wind },
    modelSuite: { label: "Model Suite", icon: Sparkles },
  };

  // Touch Handlers for Mobile Dragging
  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY.current;
    if (deltaY > 0) {
      setDragOffset(deltaY);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (dragOffset > 100) {
      onClose();
    }
    setDragOffset(0);
  };

  const Content = () => (
    <div className="flex-1 overflow-y-auto no-scrollbar p-6 lg:p-8">
      {activeUnit ? (
        <>
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-xl lg:text-2xl font-bold text-slate-900 leading-tight">
                {activeUnit.title}
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                {activeUnit.model}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFavorite(activeUnit.id)}
                className={`p-2 rounded-full transition-colors ${
                  favorites.includes(activeUnit.id)
                    ? "text-rose-500 bg-rose-50"
                    : "text-slate-300 hover:bg-slate-50"
                }`}
              >
                <Heart
                  size={22}
                  fill={
                    favorites.includes(activeUnit.id) ? "currentColor" : "none"
                  }
                />
              </button>
              <button
                onClick={onClose}
                className="lg:hidden p-2 text-slate-400 hover:bg-slate-50 rounded-full"
              >
                <X size={22} />
              </button>
            </div>
          </div>

          <div
            onClick={activeUnit.gallery?.length > 0 ? onOpenGallery : undefined}
            className={`mb-8 relative rounded-2xl overflow-hidden shadow-lg aspect-video ${
              activeUnit.gallery?.length > 0 ? "cursor-pointer group" : ""
            }`}
          >
            <img
              src={activeUnit.image}
              alt={activeUnit.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {activeUnit.gallery?.length > 0 && (
              <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                <ImageIcon size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  View Gallery
                </span>
              </div>
            )}
          </div>

          <div className="space-y-6 mb-8">
            <div className="flex flex-wrap justify-between gap-4">
              {["sqft", "numOfBeds", "numOfBaths"].map((key) => {
                const Config = attributeIcons[key];
                return (
                  <div key={key} className="flex items-center gap-2">
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                      <Config.icon size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 leading-none">
                        {activeUnit[key]}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">
                        {Config.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="h-px bg-slate-100 w-full" />
            <div className="grid grid-cols-2 gap-y-4">
              {Object.entries(attributeIcons)
                .filter(
                  ([key]) =>
                    typeof activeUnit[key] === "boolean" && activeUnit[key],
                )
                .map(([key, config]) => (
                  <div
                    key={key}
                    className="flex items-center gap-2 text-slate-600"
                  >
                    <config.icon size={14} className="text-[#102a43]" />
                    <span className="text-xs font-medium">{config.label}</span>
                  </div>
                ))}
            </div>
            <div className="h-px bg-slate-100 w-full" />
            <p className="text-sm text-slate-500 leading-relaxed italic">
              "{activeUnit.description}"
            </p>
          </div>

          <a
            href={activeUnit.pdf}
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#102a43] text-white font-semibold py-4 rounded-full hover:bg-[#1b3a5a] shadow-lg transition-all"
          >
            <Download size={18} /> Download Floorplan
          </a>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 h-full">
          <Info size={48} className="mb-4 opacity-20" />
          <p className="text-sm font-medium">Select a unit to view details</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar - Transitions in at 1024px */}
      <div className="hidden lg:flex flex-col w-[420px] bg-white border-l border-slate-100 h-full shadow-xl z-20 overflow-hidden">
        <Content />
      </div>

      {/* Mobile/Tablet Bottom Sheet - Active below 1024px */}
      <div
        className={`lg:hidden fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={onClose}
      >
        <div
          className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] max-h-[90vh] flex flex-col transition-transform ${
            isDragging ? "duration-0" : "duration-500 ease-out"
          } ${isOpen ? "translate-y-0" : "translate-y-full"}`}
          style={{
            transform: isOpen
              ? `translateY(${dragOffset}px)`
              : "translateY(100%)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag Handle Area */}
          <div
            className="w-full py-4 cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto" />
          </div>

          <Content />
        </div>
      </div>
    </>
  );
}
