import React from "react";
import { X } from "lucide-react";

interface TourModalProps {
  isOpen: boolean;
  url: string | undefined;
  label: string | undefined;
  onClose: () => void;
}

export default function TourModal({ 
  isOpen, 
  url, 
  label, 
  onClose 
}: TourModalProps) {
  if (!url) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#fff]/95 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      }`}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/50 hover:text-white z-[100] p-2 bg-black/60 hover:bg-black/80 rounded-full transition-colors"
      >
        <X size={24} />
      </button>

      <div
        className={`w-full h-full flex flex-col transition-transform duration-500 ${
          isOpen ? "scale-100" : "scale-95"
        }`}
      >
        <div className="w-full h-full bg-black overflow-hidden shadow-2xl relative">
          {isOpen && (
            <iframe
              src={url}
              className="w-full h-full border-0"
              allow="xr-spatial-tracking; gyroscope; acceleration; fullscreen"
              allowFullScreen
              title={label || "Tour"}
            />
          )}
        </div>
      </div>
    </div>
  );
}