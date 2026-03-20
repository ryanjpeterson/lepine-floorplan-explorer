/* src/components/UnitModal.tsx */
import React, { useState, useRef, useEffect } from "react";
import {
  Heart,
  Download,
  Image as ImageIcon,
  Maximize,
  Bed,
  Toilet,
  DoorOpen,
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

interface UnitModalProps {
  onOpenGallery: () => void;
}

const attributeIcons: Record<string, { label: string; icon: LucideIcon }> = {
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

export default function UnitModal({ onOpenGallery }: UnitModalProps) {
  const { activeUnit, favorites, toggleFavorite, setActiveTour, setIsHubSpotOpen, selectUnit } = useBuilding();
  const [isPulsing, setIsPulsing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClose = () => selectUnit("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      handleClose();
    }
  };

  if (!activeUnit) return null;

  const handleFavoriteClick = () => {
    if (activeUnit && !favorites.includes(activeUnit.id)) {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 500);
    }
    if (activeUnit) toggleFavorite(activeUnit.id);
  };

  const hasGallery = activeUnit?.gallery && activeUnit.gallery.length > 0;

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-[#fff]/50 backdrop-blur-md flex items-center justify-center p-4 lg:p-8 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <button 
        onClick={handleClose} 
        className="absolute top-6 right-6 text-white/50 hover:text-white z-[100] p-2 bg-[#102a43]/60 hover:bg-[#102a43]/80 rounded-full transition-colors"
      >
        <X size={24} />
      </button>

      <div 
        ref={modalRef}
        className="bg-white w-full max-w-6xl h-full max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row animate-scale-in"
      >
        {/* Left Side: Image/Media */}
        <div className="w-full lg:w-3/5 h-[40vh] lg:h-full relative bg-slate-50 border-r border-slate-100">
           <div 
            onClick={hasGallery ? onOpenGallery : undefined}
            className={`w-full h-full relative p-6 lg:p-12 flex items-center justify-center ${hasGallery ? 'cursor-pointer group' : ''}`}
           >
            {activeUnit.image ? (
              <img 
                src={activeUnit.image} 
                alt={activeUnit.title} 
                className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-105" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <ImageIcon size={64} className="opacity-20" />
              </div>
            )}
            
            {hasGallery && (
              <div className="absolute bottom-6 left-6 flex items-center gap-2 text-white bg-[#102a43]/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 z-10">
                <ImageIcon size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">View Gallery</span>
              </div>
            )}
           </div>
        </div>

        {/* Right Side: Data */}
        <div className="w-full lg:w-2/5 h-full flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 lg:p-10 no-scrollbar">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleFavoriteClick}
                  className={`p-2.5 rounded-full transition-all ${isPulsing ? "animate-fav-pulse bg-rose-50" : ""} ${favorites.includes(activeUnit.id) ? "text-rose-500 bg-rose-50" : "text-slate-300 hover:bg-slate-50"}`}
                >
                  <Heart size={24} fill={favorites.includes(activeUnit.id) ? "currentColor" : "none"} />
                </button>
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 leading-tight">{activeUnit.title}</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{activeUnit.subtitle}</p>
                </div>
              </div>
              <button
                onClick={() => setIsHubSpotOpen(true)}
                className="p-2.5 text-slate-300 hover:text-[#102a43] hover:bg-slate-50 rounded-full transition-colors"
                title="Contact Us"
              >
                <Mail size={24} />
              </button>
            </div>

            <div className="flex flex-wrap justify-between gap-4 py-6 border-y border-slate-100 mb-8">
              {["sqft", "numOfBeds", "numOfBaths"].map((key) => {
                const Config = attributeIcons[key];
                return (
                  <div key={key} className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400">
                      <Config.icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-none">{activeUnit[key as keyof Unit]}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">{Config.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <a
                href={activeUnit.pdf}
                target="_blank"
                rel="noreferrer"
                className={`flex items-center justify-center gap-2 bg-[#102a43] text-white font-bold py-4 rounded-xl hover:bg-[#1b3a5a] shadow-lg transition-all ${
                  !activeUnit.virtualTour ? "col-span-2" : ""
                }`}
              >
                <Download size={18} />
                <span className="text-xs uppercase tracking-wider">Download PDF</span>
              </a>
              {activeUnit.virtualTour && (
                <button
                  onClick={() => setActiveTour(activeUnit.virtualTour || null)}
                  className="flex items-center justify-center gap-2 bg-white text-[#102a43] border-2 border-[#102a43] font-bold py-4 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <Eye size={18} />
                  <span className="text-xs uppercase tracking-wider">Tour</span>
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-y-4">
                {Object.entries(attributeIcons)
                  .filter(([key]) => typeof activeUnit[key as keyof Unit] === "boolean" && activeUnit[key as keyof Unit])
                  .map(([key, config]) => (
                    <div key={key} className="flex items-center gap-2 text-slate-600">
                      <config.icon size={16} className="text-[#102a43]" />
                      <span className="text-xs font-semibold">{config.label}</span>
                    </div>
                  ))}
              </div>
              <div className="h-px bg-slate-100 w-full" />
              <p className="text-sm text-slate-500 leading-relaxed italic">
                {activeUnit.description || activeUnit.subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}