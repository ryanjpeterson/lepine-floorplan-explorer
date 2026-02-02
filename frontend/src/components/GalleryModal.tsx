import React, { useState, useRef, useEffect } from "react";
// 1. Import Swiper type from core to handle ref and event typing
import type { Swiper as SwiperClass } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";

// 2. Define an interface for the props to resolve errors 7031 (isOpen, images, onClose)
interface GalleryModalProps {
  isOpen: boolean;
  images: string[] | undefined;
  onClose: () => void;
}

export default function GalleryModal({ isOpen, images, onClose }: GalleryModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // 3. Provide the SwiperClass type to the ref to solve errors 2339 and 2322
  const swiperRef = useRef<SwiperClass | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // 4. Type the event parameter as KeyboardEvent to solve error 7006
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") swiperRef.current?.slideNext();
      if (e.key === "ArrowLeft") swiperRef.current?.slidePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !images) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0f172a]/95 backdrop-blur-md flex flex-col items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/50 hover:text-white z-[100] p-2 bg-white/10 hover:bg-white/20 rounded-full"
      >
        <X size={24} />
      </button>

      <div className="w-full h-full flex flex-col items-center justify-center pb-20">
        <Swiper
          modules={[Navigation]}
          loop={true}
          speed={400}
          // 5. Explicitly typing the swiper instance in callbacks
          onSwiper={(s: SwiperClass) => (swiperRef.current = s)}
          onSlideChange={(s: SwiperClass) => setActiveIndex(s.realIndex)}
          className="w-full h-full"
        >
          {/* 6. Type the .map parameters to solve errors 7006 (src, i) */}
          {images.map((src: string, i: number) => (
            <SwiperSlide
              key={i}
              className="flex items-center justify-center h-full w-full"
            >
              <div className="flex items-center justify-center w-full h-full p-4 md:p-12">
                <img
                  src={src}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-xl"
                  alt={`Gallery item ${i + 1}`}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/10 text-white p-5 rounded-full z-50 hover:bg-white/20 hidden md:flex"
        >
          <ChevronLeft size={24} />
        </button>
        
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/10 text-white p-5 rounded-full z-50 hover:bg-white/20 hidden md:flex"
        >
          <ChevronRight size={24} />
        </button>
      </div>
      
      <div className="absolute bottom-10 px-5 py-2 bg-black/60 text-white rounded-xl text-xs font-bold tracking-widest border border-white/10">
        {activeIndex + 1} / {images.length}
      </div>
    </div>
  );
}