/* src/components/UnitDetails.tsx */

import React, { useState } from "react";
import {
  Heart,
  Download,
  Image as ImageIcon,
  Maximize,
  Bed,
  Bath,
  DoorOpen,
  Toilet,
  Utensils,
  Trees,
  Monitor,
  Shirt,
  Accessibility,
  Archive,
  Wind,
  X,
  Eye,
  Sparkle,
  LucideIcon
} from "lucide-react";
import { useBuilding } from "../context/BuildingContext";
import { Unit } from "../types/building";

interface UnitDetailsProps {
  onOpenGallery: () => void;
  onClose?: () => void;
}

interface AttributeIconConfig {
  label: string;
  icon: LucideIcon;
}

const attributeIcons: Record<string, AttributeIconConfig> = {
  sqft: { label: "sqft", icon: Maximize },
  numOfBeds: { label: "Beds", icon: Bed },
  numOfBaths: { label: "Baths", icon: Toilet },
  balcony: { label: "Balcony", icon: DoorOpen },
  tub: { label: "Tub", icon: Bath },
  pantry: { label: "Pantry", icon: Utensils },
  terrace: { label: "Terrace", icon: Trees },
  office: { label: "Office", icon: Monitor },
  walkInCloset: { label: "Walk-in Closet", icon: Shirt },
  barrierFree: { label: "Barrier Free", icon: Accessibility },
  builtIns: { label: "Built-ins", icon: Archive },
  juliet: { label: "Juliet Balcony", icon: Wind },
  powderRoom: { label: "Powder Room", icon: Sparkle },
};

export default function UnitDetails({ onOpenGallery, onClose }: UnitDetailsProps) {
  const { activeUnit, favorites, toggleFavorite, setActiveTour } = useBuilding();
  const [isPulsing, setIsPulsing] = useState(false);

  if (!activeUnit) return null;

  const handleFavoriteClick = () => {
    if (!favorites.includes(activeUnit.id)) {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 500);
    }
    toggleFavorite(activeUnit.id);
  };

  const hasGallery = activeUnit.gallery && activeUnit.gallery.length > 0;

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar px-6 lg:p-8">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl lg:text-2xl font-bold text-slate-900 leading-tight">
            {activeUnit.title}
          </h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            {activeUnit.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleFavoriteClick}
            className={`cursor-pointer p-2 rounded-full transition-all ${
              isPulsing ? "animate-fav-pulse bg-rose-50" : ""
            } ${favorites.includes(activeUnit.id) ? "text-rose-500 bg-rose-50" : "text-slate-300 hover:bg-slate-50"}`}
          >
            <Heart
              size={22}
              fill={favorites.includes(activeUnit.id) ? "currentColor" : "none"}
            />
          </button>
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-slate-400 hover:bg-slate-50 rounded-full cursor-pointer"
          >
            <X size={22} />
          </button>
        </div>
      </div>

      {/* Main Layout Wrapper: Row layout only between 700px and 1024px */}
      <div className="flex flex-col [@media(min-width:700px)_and_(max-width:1023px)]:flex-row lg:flex-col gap-6 mb-6">
        
        {/* Image/Gallery Section */}
        <div
          onClick={hasGallery ? onOpenGallery : undefined}
          className={`relative rounded-xl overflow-hidden shadow-lg aspect-video 
            [@media(min-width:700px)_and_(max-width:1023px)]:aspect-auto [@media(min-width:700px)_and_(max-width:1023px)]:w-1/2 flex-shrink-0 
            ${hasGallery ? "cursor-pointer group" : ""}`}
        >
          <img
            src={activeUnit.image}
            alt={activeUnit.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {hasGallery && (
            <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white bg-[#102a43]/40 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 z-10">
              <ImageIcon size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                View Gallery
              </span>
            </div>
          )}
        </div>

        {/* Info Column (Actions, Core Stats, & Amenities in 700-1024 range) */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="grid grid-cols-2 [@media(min-width:700px)_and_(max-width:1023px)]:grid-cols-1 gap-3">
            <a
              href={activeUnit.pdf}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center justify-center gap-2 bg-[#102a43] text-white font-semibold p-4 rounded-xl hover:bg-[#1b3a5a] shadow-lg transition-all text-center ${
                !activeUnit.virtualTour ? "col-span-2" : ""
              }`}
            >
              <Download size={18} className="shrink-0" /> 
              <span className="text-xs">Download PDF</span>
            </a>

            {activeUnit.virtualTour && (
              <button
                onClick={() => setActiveTour(activeUnit.virtualTour || null)}
                className="w-full flex items-center justify-center gap-2 bg-white text-[#102a43] border-2 border-[#102a43] font-semibold p-4 rounded-xl hover:bg-slate-50 transition-all text-center cursor-pointer"
              >
                <Eye size={18} className="shrink-0" /> 
                <span className="text-xs">Virtual Tour</span>
              </button>
            )}
          </div>

          {/* Core Stats: Icons returned to the left of text */}
          <div className="flex flex-wrap justify-between gap-4 py-4 border-y border-slate-100">
            {["sqft", "numOfBeds", "numOfBaths"].map((key) => {
              const Config = attributeIcons[key];
              return (
                <div key={key} className="flex items-center gap-2">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                    <Config.icon size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-none">
                      {activeUnit[key as keyof Unit]}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">
                      {Config.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AMENITIES: Only displayed in this column for the 700-1024 range */}
          <div className="hidden [@media(min-width:700px)_and_(max-width:1023px)]:grid grid-cols-2 gap-y-3 pt-2">
            {Object.entries(attributeIcons)
              .filter(
                ([key]) =>
                  typeof activeUnit[key as keyof Unit] === "boolean" && activeUnit[key as keyof Unit],
              )
              .map(([key, config]) => (
                <div key={key} className="flex items-center gap-2 text-slate-600">
                  <config.icon size={14} className="text-[#102a43]" />
                  <span className="text-[10px] font-medium">{config.label}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Description & Bottom Amenities Section */}
      <div className="space-y-6 mb-8">
        {/* Default Amenities: Hidden in the 700-1024 range */}
        <div className="[@media(min-width:700px)_and_(max-width:1023px)]:hidden grid grid-cols-2 gap-y-4">
          {Object.entries(attributeIcons)
            .filter(
              ([key]) =>
                typeof activeUnit[key as keyof Unit] === "boolean" && activeUnit[key as keyof Unit],
            )
            .map(([key, config]) => (
              <div key={key} className="flex items-center gap-2 text-slate-600">
                <config.icon size={14} className="text-[#102a43]" />
                <span className="text-xs font-medium">{config.label}</span>
              </div>
            ))}
        </div>

        <div className="h-px bg-slate-100 w-full" />
        <p className="text-sm text-slate-500 leading-relaxed">
          {activeUnit.description}
        </p>
      </div>
    </div>
  );
}