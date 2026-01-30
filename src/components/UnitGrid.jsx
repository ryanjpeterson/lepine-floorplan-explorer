// src/components/UnitGrid.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { useBuilding } from "../context/BuildingContext";
import { Heart, ArrowRight, Maximize, Bed, Bath } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function UnitGrid({ onSelectUnit }) {
  const { filteredUnits, activeUnit, favorites, toggleFavorite } =
    useBuilding();

  const attributeIcons = {
    sqft: { label: "sqft", icon: Maximize },
    numOfBeds: { label: "Beds", icon: Bed },
    numOfBaths: { label: "Baths", icon: Bath },
  };

  const UnitCard = ({ unit }) => {
    if (!unit) return null;
    const isFav = favorites.includes(unit.id);
    const isActive = activeUnit?.id === unit.id;

    return (
      <div
        onClick={() => onSelectUnit(unit.id)}
        className={`group bg-white rounded-2xl overflow-hidden border-2 transition-all cursor-pointer h-full flex flex-col shadow-xl ${
          isActive
            ? "border-[#102a43]"
            : "border-transparent hover:border-slate-200"
        }`}
      >
        {/* Responsive Aspect Ratio with a 300px height ceiling */}
        <div className="relative overflow-hidden max-h-[12rem]">
          <img
            src={unit.image}
            alt={unit.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(unit.id);
            }}
            className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all ${
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

          {/* Attributes layout mirrored from Sidebar */}
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
                      {unit[key]}
                    </p>
                    <p className="text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest truncate">
                      {Config.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="mt-auto w-full py-3 rounded-xl bg-slate-50 text-[#102a43] text-[10px] sm:text-xs font-bold group-hover:bg-[#102a43] group-hover:text-white transition-all flex items-center justify-center gap-2">
            View Details <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  };

  if (filteredUnits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <p className="text-lg font-medium">No units match your filters</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <style>
        {`
          .swiper-pagination-bullet-active {
            background: #102a43 !important;
          }
          .swiper-pagination-bullet {
            opacity: 0.3;
          }
          .unit-swiper {
            padding-bottom: 60px !important;
            overflow: visible !important;
          }
          .unit-swiper .swiper-pagination {
            bottom: 0px !important;
          }
        `}
      </style>

      {/* Swiper Layout: Active below 1024px (lg) */}
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
              <UnitCard unit={unit} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Grid Layout: Active at and above 1024px (lg) */}
      <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {filteredUnits.map((unit) => (
          <UnitCard key={unit.id} unit={unit} />
        ))}
      </div>
    </div>
  );
}
