import React, { memo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { useBuilding } from "../context/BuildingContext";
import { Heart, ArrowRight, Maximize, Bed, Bath, LucideIcon } from "lucide-react";
import { Unit } from "../types/building";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

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
  numOfBeds: { label: "Beds", icon: Bed },
  numOfBaths: { label: "Baths", icon: Bath },
};

const UnitCard = memo<UnitCardProps>(
  ({ unit, isActive, isFav, toggleFavorite, onSelectUnit, isDesktop }) => {
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
        }`}
      >
        <div className="relative overflow-hidden max-h-[12rem] aspect-video md:aspect-square lg:aspect-square xl:aspect-video">
          <img
            src={unit.image}
            alt={unit.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <button
            onClick={handleFavorite}
            className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
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
              {unit.model}
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

export default function UnitGrid({ onSelectUnit }: { onSelectUnit: (id: string) => void }) {
  const { filteredUnits, activeUnit, favorites, toggleFavorite, gridTab } = useBuilding();

  if (filteredUnits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-slate-400">
        <p className="text-lg font-medium">
          {gridTab === "favorites"
            ? "You have not selected any favourites"
            : "No units match your filters"}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <style>{`
        .swiper-pagination-bullet-active { background: #102a43 !important; }
        .swiper-pagination-bullet { opacity: 0.3; }
        .unit-swiper { padding-bottom: 60px !important; overflow: visible !important; }
        .unit-swiper .swiper-pagination { bottom: 0px !important; }
      `}</style>

      {/* Mobile Swiper Section */}
      <div className="block lg:hidden">
        <Swiper
          modules={[Pagination, Navigation]}
          spaceBetween={16}
          slidesPerView={1.15}
          centeredSlides={true}
          pagination={{ clickable: true }}
          className="unit-swiper !px-4"
          breakpoints={{
            480: { slidesPerView: 1.4 },
            640: { slidesPerView: 1.8 },
            768: { slidesPerView: 2.2, centeredSlides: false },
          }}
        >
          {filteredUnits.map((unit) => (
            <SwiperSlide key={unit.id} className="h-auto">
              <UnitCard
                unit={unit}
                isActive={activeUnit?.id === unit.id}
                isFav={favorites.includes(unit.id)}
                toggleFavorite={toggleFavorite}
                onSelectUnit={onSelectUnit}
                isDesktop={false}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop Grid Section */}
      <div className="hidden lg:block">
        <div className="grid gap-6 lg:gap-8 grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] max-w-[2400px] mx-auto">
          {filteredUnits.map((unit) => (
            <UnitCard
              key={unit.id}
              unit={unit}
              isActive={activeUnit?.id === unit.id}
              isFav={favorites.includes(unit.id)}
              toggleFavorite={toggleFavorite}
              onSelectUnit={onSelectUnit}
              isDesktop={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
}