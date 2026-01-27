import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";

export default function GalleryModal({ isOpen, images, onClose }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);

  if (!isOpen || !images) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#0f172a]/95 backdrop-blur-md flex flex-col items-center justify-center transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/50 hover:text-white z-[100] p-2 hover:bg-white/10 rounded-full transition-colors"
      >
        <X size={24} />
      </button>

      {/* Main Container with padding at the bottom for the indicator */}
      <div className="w-full h-full flex flex-col items-center justify-center pb-20">
        <Swiper
          modules={[Navigation]}
          loop={true}
          grabCursor={true} // Enables the "hand" icon and grabbing feel
          speed={400} // Faster speed for better swiping feel
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(s) => setActiveIndex(s.realIndex)}
          className="w-full h-full"
        >
          {images.map((src, i) => (
            <SwiperSlide
              key={i}
              className="flex items-center justify-center h-full w-full"
            >
              <div className="flex items-center justify-center w-full h-full p-4 md:p-12">
                <img
                  src={src}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  alt={`Gallery image ${i + 1}`}
                  /* Removed pointer-events-none to ensure swiping works on the image itself */
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Arrows */}
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/10 text-white p-5 rounded-full z-50 transition-all border border-white/10 hover:bg-white/20 active:scale-95 hidden md:flex"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/10 text-white p-5 rounded-full z-50 transition-all border border-white/10 hover:bg-white/20 active:scale-95 hidden md:flex"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Gallery Counter - Positioned outside the Swiper container to prevent overlap */}
      <div className="absolute bottom-10 px-5 py-2 bg-black/60 text-white rounded-full text-xs font-bold tracking-widest border border-white/10 z-[100]">
        {activeIndex + 1} / {images.length}
      </div>
    </div>
  );
}
