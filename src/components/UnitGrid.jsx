// src/components/UnitGrid.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { useBuilding } from "../context/BuildingContext";
import { Heart, Maximize, Bed, Bath, ArrowRight } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function UnitGrid() {
  const { filteredUnits, selectUnit, activeUnit, favorites, toggleFavorite } =
    useBuilding();

  const UnitCard = ({ unit }) => {
    const isFav = favorites.includes(unit.id);
    const isActive = activeUnit?.id === unit.id;

    return (
      <div
        onClick={() => selectUnit(unit.id)}
        className={`group bg-white rounded-3xl overflow-hidden border-2 transition-all cursor-pointer h-full flex flex-col ${
          isActive
            ? "border-[#102a43] shadow-xl"
            : "border-transparent hover:border-slate-200 shadow-sm"
        }`}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
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

        <div className="p-6 flex-1 flex flex-col">
          <div className="mb-4">
            <h4 className="text-lg font-bold text-slate-900">{unit.title}</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {unit.model}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 mb-6">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900">
                {unit.sqft}
              </span>
              <span className="text-[8px] font-bold text-slate-400 uppercase">
                Sqft
              </span>
            </div>
            <div className="w-px h-8 bg-slate-100" />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900">
                {unit.numOfBeds}
              </span>
              <span className="text-[8px] font-bold text-slate-400 uppercase">
                Beds
              </span>
            </div>
            <div className="w-px h-8 bg-slate-100" />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900">
                {unit.numOfBaths}
              </span>
              <span className="text-[8px] font-bold text-slate-400 uppercase">
                Baths
              </span>
            </div>
          </div>

          <button className="mt-auto w-full py-3 rounded-xl bg-slate-50 text-[#102a43] text-xs font-bold group-hover:bg-[#102a43] group-hover:text-white transition-all flex items-center justify-center gap-2">
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
      {/* Mobile/Small Slider View: Triggers on mobile or when few items exist */}
      <div className="block lg:hidden">
        <Swiper
          modules={[Pagination, Navigation]}
          spaceBetween={20}
          slidesPerView={1.2}
          centeredSlides={true}
          pagination={{ clickable: true }}
          className="pb-12 !px-4"
          breakpoints={{
            640: { slidesPerView: 2, centeredSlides: false },
          }}
        >
          {filteredUnits.map((unit) => (
            <SwiperSlide key={unit.id}>
              <UnitCard unit={unit} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop Grid View */}
      <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredUnits.map((unit) => (
          <UnitCard key={unit.id} unit={unit} />
        ))}
      </div>
    </div>
  );
}
