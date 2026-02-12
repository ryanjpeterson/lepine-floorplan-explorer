import React, { useState } from "react";
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
  X,
  Eye,
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

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar px-6 lg:p-8">
      <div className="flex items-start justify-between mb-4">
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

      <div
        onClick={activeUnit.gallery && activeUnit.gallery.length > 0 ? onOpenGallery : undefined}
        className={`mb-4 relative rounded-xl overflow-hidden shadow-lg aspect-video ${activeUnit.gallery && activeUnit.gallery.length > 0 ? "cursor-pointer group" : ""}`}
      >
        <img
          src={activeUnit.image}
          alt={activeUnit.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {activeUnit.gallery && activeUnit.gallery.length > 0 && (
          <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white bg-[#102a43]/40 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
            <ImageIcon size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              View Gallery
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <a
          href={activeUnit.pdf}
          target="_blank"
          rel="noreferrer"
          className={`flex items-center justify-center gap-2 bg-[#102a43] text-white font-semibold p-4 rounded-xl hover:bg-[#1b3a5a] shadow-lg transition-all text-center ${
            !activeUnit.virtualTour ? "col-span-2" : "w-full"
          }`}
        >
          <Download size={18} className="shrink-0" /> 
          <span className="text-xs lg:text-sm">Download PDF</span>
        </a>

        {activeUnit.virtualTour && (
          <button
            onClick={() => setActiveTour(activeUnit.virtualTour || null)}
            className="w-full flex items-center justify-center gap-2 bg-white text-[#102a43] border-2 border-[#102a43] font-semibold p-4 rounded-xl hover:bg-slate-50 transition-all text-center cursor-pointer"
          >
            <Eye size={18} className="shrink-0" /> 
            <span className="text-xs lg:text-sm">Virtual Tour</span>
          </button>
        )}
      </div>



      <div className="space-y-6 mb-4">
        <div className="h-px w-full" />

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

        <div className="h-px bg-slate-100 w-full" />

        <div className="grid grid-cols-2 gap-y-4">
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