/* src/screens/BuildingGallery.tsx */
import React, { useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Virtual } from "swiper/modules";
import { useBuilding } from "../context/BuildingContext";
import GalleryModal from "../components/GalleryModal";
import PageShell from "../components/layout/PageShell";
import HomeButton from "../components/navigation/HomeButton";
import ViewToggles from "../components/navigation/ViewToggles";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/virtual";

export default function BuildingGallery() {
  const { buildingGallery, amenitiesData } = useBuilding();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  // Combine both arrays into one unified list for the gallery grid and modal slider
  const combinedItems = useMemo(() => [
    ...buildingGallery,
    ...amenitiesData
  ], [buildingGallery, amenitiesData]);

  // Extract just the image strings for the GalleryModal component
  const images = combinedItems.map(item => item.image);

  const GalleryCard = ({ item, index }: { item: any; index: number }) => (
    <div 
      onClick={() => setSelectedImageIndex(index)}
      className="group relative aspect-video bg-slate-200 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100"
    >
      <img 
        src={item.image} 
        alt={item.label || item.id} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* Overlay is now opacity-100 by default */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#102a43]/80 via-transparent to-transparent opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
        {/* Label is now positioned without translation by default */}
        <p className="text-white font-bold text-lg transition-transform duration-300">
          {item.label || item.id}
        </p>
      </div>
    </div>
  );

  return (
   <>
     <PageShell
      headerLeft={<HomeButton />}
      headerRight={<ViewToggles />}
    >
      <div className="w-full h-full overflow-y-auto p-4 lg:p-8 bg-white/30 backdrop-blur-sm no-scrollbar">
        <style>{`
          .swiper-pagination-bullet-active { background: #102a43 !important; }
          .swiper-pagination-bullet { opacity: 0.3; }
          .gallery-swiper { padding-bottom: 60px !important; }
          .gallery-swiper .swiper-pagination { bottom: 0px !important; }
        `}</style>

        <div className="max-w-[2400px] mx-auto">
          {/* Unified Desktop Grid */}
          <div className="hidden lg:grid gap-6 grid-cols-[repeat(auto-fill,minmax(min(100%,400px),1fr))]">
            {combinedItems.map((item, index) => (
              <GalleryCard key={`${item.id}-${index}`} item={item} index={index} />
            ))}
          </div>

          {/* Unified Mobile Swiper */}
          <div className="block lg:hidden">
            <Swiper 
              modules={[Pagination, Virtual]} 
              spaceBetween={16} 
              slidesPerView={1.1} 
              centeredSlides 
              virtual 
              pagination={{ clickable: true }} 
              className="gallery-swiper"
            >
              {combinedItems.map((item, index) => (
                <SwiperSlide key={`${item.id}-${index}`} virtualIndex={index}>
                  <GalleryCard item={item} index={index} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </PageShell>

    {/* Modal opens the images array at the index corresponding to the unified grid */}
    <GalleryModal 
        isOpen={selectedImageIndex !== null}
        images={images}
        initialIndex={selectedImageIndex ?? 0}
        onClose={() => setSelectedImageIndex(null)}
    />
   </>
  );
}