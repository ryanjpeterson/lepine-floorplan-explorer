// src/components/Sidebar.jsx
import React from "react";
import {
  Download,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  MapPin,
  Maximize,
  Bed,
  Bath,
  Banknote,
  Home,
  DoorOpen,
  Waves,
  Utensils,
  Trees,
  Monitor,
  Shirt,
  Accessibility,
  Hammer,
  Wind,
  Sparkles,
} from "lucide-react";
import { useBuilding } from "../context/BuildingContext";

export default function Sidebar({
  unit,
  onNext,
  onPrev,
  currentIndex,
  total,
  onOpenGallery,
}) {
  const { data } = useBuilding();

  // Color mapping for the status enumeration
  const statusStyles = {
    Available: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Leased: "bg-rose-50 text-rose-700 border-rose-100",
    "On Hold": "bg-amber-50 text-amber-700 border-amber-100",
  };

  const currentStatusClass =
    statusStyles[unit?.status] || statusStyles["Available"];
  const hasGallery = unit?.gallery && unit.gallery.length > 0;

  // Icon mapping for boolean and special attributes
  const attributeIcons = {
    sqft: { label: "sqft", icon: Maximize },
    numOfBeds: { label: "Beds", icon: Bed },
    numOfBaths: { label: "Baths", icon: Bath },
    balcony: { label: "Balcony", icon: DoorOpen },
    tub: { label: "Tub", icon: Waves },
    pantry: { label: "Pantry", icon: Utensils },
    terrace: { label: "Terrace", icon: Trees },
    officeDen: { label: "Office/Den", icon: Monitor },
    walkInCloset: { label: "Walk-in Closet", icon: Shirt },
    barrierFree: { label: "Barrier Free", icon: Accessibility },
    builtIns: { label: "Built-ins", icon: Hammer },
    juliet: { label: "Juliet Balcony", icon: Wind },
    modelSuite: { label: "Model Suite", icon: Sparkles },
  };

  return (
    <div className="flex-1 w-full flex flex-col bg-white shadow-xl z-20 md:w-[420px] md:flex-none md:h-full md:border-l border-slate-100 min-h-0 relative">
      <div className="hidden md:block px-8 py-6 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          {data?.name}
        </h2>
        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 flex items-center gap-1">
          <MapPin size={10} /> {data?.address}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {!unit ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
            <p className="text-sm font-medium">Select a unit on the map</p>
          </div>
        ) : (
          <div className="animate-fade-in flex flex-col h-full">
            <div className="flex-1 p-4 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 leading-tight">
                    {unit.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {unit.model} — {unit.type}
                  </p>
                </div>
                <span
                  className={`px-3 py-1.5 rounded-md text-[11px] font-bold uppercase border ${currentStatusClass}`}
                >
                  {unit.status}
                </span>
              </div>

              {/* Gallery Trigger Image */}
              <div
                onClick={hasGallery ? onOpenGallery : undefined}
                className={`mb-8 relative rounded-2xl overflow-hidden shadow-lg aspect-video bg-slate-100 ${hasGallery ? "cursor-pointer group" : ""}`}
              >
                <img
                  src={unit.image}
                  alt={unit.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {hasGallery && (
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ImageIcon size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      View Gallery
                    </span>
                  </div>
                )}
              </div>

              {/* Dynamic Attribute Section */}
              <div className="space-y-6 mb-8">
                {/* Core Specs List */}
                <div className="flex flex-wrap justify-between gap-4">
                  {[
                    { key: "sqft", val: unit.sqft },
                    { key: "numOfBeds", val: unit.numOfBeds },
                    { key: "numOfBaths", val: unit.numOfBaths },
                  ].map((spec) => {
                    const Config = attributeIcons[spec.key];
                    if (!spec.val) return null;
                    return (
                      <div key={spec.key} className="flex items-center gap-2">
                        <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                          <Config.icon size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 leading-none">
                            {Config.prefix}
                            {spec.val}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                            {Config.label}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="h-px bg-slate-100 w-full" />

                {/* Boolean Features List */}
                <div className="grid grid-cols-2 gap-y-4">
                  {Object.entries(attributeIcons)
                    .filter(
                      ([key, config]) =>
                        typeof unit[key] === "boolean" && unit[key] === true,
                    )
                    .map(([key, config]) => (
                      <div
                        key={key}
                        className="flex items-center gap-2 text-slate-600"
                      >
                        <config.icon size={14} className="text-[#102a43]" />
                        <span className="text-xs font-medium">
                          {config.label}
                        </span>
                      </div>
                    ))}
                </div>

                <div className="h-px bg-slate-100 w-full" />

                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-2 tracking-widest">
                    Description
                  </p>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {unit.description}
                  </p>
                </div>
              </div>

              <a
                href={unit.pdf || "/assets/floorplan.pdf"}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#102a43] text-white font-semibold py-4 rounded-full hover:bg-[#1b3a5a] transition-colors shadow-lg shadow-[#102a43]/20"
              >
                <Download size={18} /> Download Floorplan
              </a>
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between px-8 py-6 border-t border-slate-50 bg-white sticky bottom-0">
              <button
                onClick={onPrev}
                className="text-sm font-semibold text-slate-400 hover:text-[#102a43] transition-colors flex items-center gap-1"
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                {currentIndex + 1} / {total}
              </span>
              <button
                onClick={onNext}
                className="text-sm font-semibold text-slate-400 hover:text-[#102a43] transition-colors flex items-center gap-1"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
