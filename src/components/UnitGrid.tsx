import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Virtual } from "swiper/modules";
import { useBuilding } from "../context/BuildingContext";
import { Unit } from "../types/building";
import UnitCard from "./UnitCard";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/virtual";

interface UnitGridProps {
  onSelectUnit: (id: string) => void;
  unitsOverride?: Unit[];
}

export default function UnitGrid({ onSelectUnit, unitsOverride }: UnitGridProps) {
  const { filteredUnits, activeUnit, favorites, toggleFavorite, gridTab } = useBuilding();

  const unitsToDisplay = unitsOverride || filteredUnits;

  if (unitsToDisplay.length === 0) {
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
        .unit-swiper { padding-bottom: 60px !important; }
        .unit-swiper .swiper-pagination { bottom: 0px !important; }
      `}</style>

      {/* Mobile Swiper Section */}
      <div className="block lg:hidden">
        <Swiper
          modules={[Pagination, Navigation, Virtual]}
          spaceBetween={16}
          slidesPerView={1.25}
          centeredSlides={true}
          virtual
          pagination={{ clickable: true, dynamicBullets: true }}
          className="unit-swiper !px-4"
          breakpoints={{
            768: { slidesPerView: 2, centeredSlides: false },
          }}
        >
          {unitsToDisplay.map((unit, index) => (
            <SwiperSlide key={unit.id} virtualIndex={index} className="h-auto">
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
      <div className="hidden lg:block py-4"> {/* Margin at top and bottom */}
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] max-w-[2400px] mx-auto overflow-visible px-2">
          {unitsToDisplay.map((unit, index) => (
              <UnitCard
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