import React, { useState } from "react";
import {
  Heart,
  Download,
  Image as ImageIcon,
  Maximize,
  Bed,
  DoorOpen,
  Toilet,
  Trees,
  Monitor,
  Shirt,
  Accessibility,
  X,
  Eye,
  Sparkle,
  Mail,
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
  numOfBeds: { label: "Bed", icon: Bed },
  numOfBaths: { label: "Bath", icon: Toilet },
  balcony: { label: "Balcony", icon: DoorOpen },
  terrace: { label: "Terrace", icon: Trees },
  office: { label: "Office", icon: Monitor },
  walkInCloset: { label: "Walk-In Closet", icon: Shirt },
  barrierFree: { label: "Barrier Free", icon: Accessibility },
  powderRoom: { label: "Powder Room", icon: Sparkle },
};

export default function UnitDetails({ onOpenGallery, onClose }: UnitDetailsProps) {
  const { activeUnit, favorites, toggleFavorite, setActiveTour, setIsHubSpotOpen } = useBuilding();
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
      {/* Revised Header Section */}
      <div className="flex items-start justify-between py-4">
        <div className="flex items-center gap-3">
          {/* Favorite icon moved to the left of the unit name */}
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
          <div>
            <h3 className="text-xl lg:text-2xl font-bold text-slate-900 leading-tight">
              {activeUnit.title}
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              {activeUnit.subtitle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* New Contact Icon in previous favorite location */}
          <button
            onClick={() => setIsHubSpotOpen(true)}
            className="p-2 text-slate-300 hover:text-[#102a43] hover:bg-slate-50 rounded-full cursor-pointer transition-colors"
            title="Contact Us"
          >
            <Mail size={22} />
          </button>
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-slate-400 hover:bg-slate-50 rounded-full cursor-pointer"
          >
            <X size={22} />
          </button>
        </div>
      </div>

      <div className="flex flex-col [@media(min-width:700px)_and_(max-width:1023px)]:flex-row lg:flex-col gap-6 mb-6">
        <div
          onClick={hasGallery ? onOpenGallery : undefined}
          className={`relative rounded-xl overflow-hidden shadow-lg aspect-video 
            [@media(min-width:700px)_and_(max-width:1023px)]:aspect-auto [@media(min-width:700px)_and_(max-width:1023px)]:w-1/2 flex-shrink-0 
            ${hasGallery ? "cursor-pointer group" : ""}`}
        >
          {activeUnit.image ? (
            <img
              src={activeUnit.image}
              alt={activeUnit.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : activeUnit.pdf ? (
            <iframe
              src={`${activeUnit.pdf}`}
              title={`${activeUnit.title} Floorplan`}
              className="w-full h-full border-none pointer-events-none overflow-hidden"
            />
          ) : (
            <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300">
              <ImageIcon size={48} className="opacity-20" />
            </div>
          )}

          {hasGallery && (
            <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white bg-[#102a43]/40 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 z-10">
              <ImageIcon size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                View Gallery
              </span>
            </div>
          )}
        </div>

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
        </div>
      </div>

      <div className="space-y-6 mb-8">
        <div className="[@media(min-width:700px)_and_(max-width:1023px)]:hidden grid grid-cols-2 gap-y-4">
          {Object.entries(attributeIcons)
            .filter(([key]) => typeof activeUnit[key as keyof Unit] === "boolean" && activeUnit[key as keyof Unit])
            .map(([key, config]) => (
              <div key={key} className="flex items-center gap-2 text-slate-600">
                <config.icon size={14} className="text-[#102a43]" />
                <span className="text-xs font-medium">{config.label}</span>
              </div>
            ))}
        </div>
        <div className="h-px bg-slate-100 w-full" />
        <p className="text-sm text-slate-500 leading-relaxed">
          {activeUnit.description ? activeUnit.description : activeUnit.subtitle}
        </p>
      </div>
    </div>
  );
}