import React from "react";
import { X } from "lucide-react";

export default function VirtualTourEmbed({ isOpen, url, label, onClose }) {
  if (!isOpen || !url) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#0f172a]/95 backdrop-blur-md flex flex-col items-center justify-center transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/50 hover:text-white z-[100] p-2 hover:bg-white/10 rounded-full transition-colors"
      >
        <X size={24} />
      </button>

      <div className="w-full h-full flex flex-col p-4 md:p-12">
        <div className="w-full h-full bg-black rounded-xl overflow-hidden shadow-2xl relative">
          <iframe
            src={url}
            className="w-full h-full border-0"
            allow="xr-spatial-tracking; gyroscope; acceleration; fullscreen"
            allowFullScreen
            title={label || "Virtual Tour"}
          />
        </div>
      </div>

      <div className="absolute bottom-10 px-6 py-2 bg-black/60 text-white rounded-full text-xs font-bold tracking-widest border border-white/10 z-[100] uppercase">
        Virtual Tour: {label}
      </div>
    </div>
  );
}
