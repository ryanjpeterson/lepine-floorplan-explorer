
import React, { memo, useState } from "react";
import { Heart, ArrowRight, Maximize, Bed, Bath, LucideIcon } from "lucide-react";
import { Unit } from "../types/building";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/virtual";

interface UnitCardProps {
  unit: Unit;
  isActive: boolean;
  isFav: boolean;
  toggleFavorite: (id: string) => void;
  onSelectUnit: (id: string) => void;
  isDesktop: boolean;
}

const attributeIcons: Record<string, { label: string; icon: LucideIcon }> = {
  sqft: { label: "sqft", icon: Maximize },
  numOfBeds: { label: "Bed", icon: Bed },
  numOfBaths: { label: "Bath", icon: Bath },
};

export default memo(function UnitCard({
  unit,
  isActive,
  isFav,
  toggleFavorite,
  onSelectUnit,
  isDesktop,
}: UnitCardProps){
    const [isPulsing, setIsPulsing] = useState(false);

    if (!unit) return null;

    const handleFavorite = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isFav) {
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 500);
      }
      toggleFavorite(unit.id);
    };

    const handleCardClick = () => {
      if (isDesktop) {
        onSelectUnit(unit.id);
      }
    };

    return (
      <div
        onClick={handleCardClick}
        className={`group bg-white rounded-2xl overflow-hidden border-2 transition-all h-full flex flex-col shadow-xl ${
          isDesktop ? "cursor-pointer" : ""
        } ${
          isActive
            ? "border-[#102a43]"
            : "border-transparent hover:border-slate-200"
        } hover:-translate-y-1`}
      >
        <div className="relative overflow-hidden max-h-[12rem] aspect-video">
          <img
            src={unit.image}
            alt={unit.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <button
            onClick={handleFavorite}
            className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer z-10 ${
              isPulsing ? "animate-fav-pulse" : ""
            } ${
              isFav
                ? "bg-rose-500 text-white"
                : "bg-white/80 text-slate-400 hover:text-rose-500"
            }`}
          >
            <Heart size={16} fill={isFav ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="p-5 sm:p-6 flex-1 flex flex-col">
          <div className="mb-4 sm:mb-6">
            <h4 className="text-base sm:text-lg font-bold text-slate-900 truncate">
              {unit.title}
            </h4>
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {unit.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap justify-between gap-2 mb-6 sm:mb-8">
            {["sqft", "numOfBeds", "numOfBaths"].map((key) => {
              const Config = attributeIcons[key];
              return (
                <div key={key} className="flex items-center gap-2">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400 shrink-0">
                    <Config.icon size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] sm:text-xs font-bold text-slate-900 leading-none">
                      {(unit as any)[key]}
                    </p>
                    <p className="text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest truncate">
                      {Config.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={(e: React.MouseEvent) => {
              if (!isDesktop) {
                onSelectUnit(unit.id);
              }
            }}
            className="mt-auto w-full py-3 rounded-xl bg-slate-50 text-[#102a43] text-[10px] sm:text-xs font-bold hover:bg-[#102a43] hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            View Details <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  }
);