import React, { useState, useRef, useEffect } from "react";
import type { Swiper as SwiperClass } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";

interface GalleryModalProps {
  isOpen: boolean;
  images: string[] | undefined;
  onClose: () => void;
  initialIndex?: number;
}

export default function GalleryModal({ isOpen, images, onClose, initialIndex = 0 }: GalleryModalProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const swiperRef = useRef<SwiperClass | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") swiperRef.current?.slideNext();
      if (e.key === "ArrowLeft") swiperRef.current?.slidePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Sync state if initialIndex changes while open
  useEffect(() => {
    setActiveIndex(initialIndex);
  }, [initialIndex, isOpen]);

  if (!isOpen || !images) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#fff]/50 backdrop-blur-md flex flex-col items-center justify-center">
      <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white z-[100] p-2 bg-[#102a43]/60 hover:bg-[#102a43]/80 rounded-full">
        <X size={24} />
      </button>

      <div className="w-full h-full flex flex-col items-center justify-center pb-20">
        <Swiper
          key={`${images.join(',')}-${initialIndex}`} // Force re-init on change
          modules={[Navigation]}
          initialSlide={initialIndex}
          loop={false}
          speed={400}
          onSwiper={(s: SwiperClass) => (swiperRef.current = s)}
          onSlideChange={(s: SwiperClass) => setActiveIndex(s.activeIndex)}
          className="w-full h-full"
        >
          {images.map((src: string, i: number) => (
            <SwiperSlide key={i} className="flex items-center justify-center h-full w-full">
              <div className="flex items-center justify-center w-full h-full p-4 md:p-12">
                <img src={src} className="max-w-full max-h-full object-contain rounded-lg shadow-xl" alt={`Gallery item ${i + 1}`} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        <button onClick={() => swiperRef.current?.slidePrev()} className="absolute left-8 top-1/2 -translate-y-1/2 bg-[#102a43]/60 text-white p-4 rounded-full z-50 hover:bg-[#102a43]/80 hidden md:flex">
          <ChevronLeft size={24} />
        </button>
        <button onClick={() => swiperRef.current?.slideNext()} className="absolute right-8 top-1/2 -translate-y-1/2 bg-[#102a43]/60 text-white p-4 rounded-full z-50 hover:bg-[#102a43]/80 hidden md:flex">
          <ChevronRight size={24} />
        </button>
      </div>
      
      <div className="absolute bottom-10 px-4 py-2 bg-[#102a43]/60 text-white rounded-xl text-xs font-bold tracking-widest border border-white/10">
        {activeIndex + 1} / {images.length}
      </div>
    </div>
  );
}