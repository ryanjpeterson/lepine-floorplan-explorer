import React from "react";
import { useBuilding } from "../context/BuildingContext";
import { MapPin, Globe, Eye, Info } from "lucide-react";

interface CommercialGridProps {
  onSelectUnit: (id: string) => void;
}

export default function CommercialGrid({ onSelectUnit }: CommercialGridProps) {
  const { commercialData } = useBuilding();

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/30 overflow-hidden animate-fade-in">
      {/* Scrollable Container with same padding as UnitGrid */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        {/* Same responsive grid layout as residential grid */}
        <div className="grid gap-2 lg:gap-4 grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] max-w-[2400px] mx-auto overflow-visible">
          {commercialData.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectUnit(item.id)}
              className="group bg-white rounded-2xl overflow-hidden border-2 border-transparent hover:border-slate-200 transition-all h-full flex flex-col shadow-xl hover:-translate-y-1 cursor-pointer"
            >
              {/* Image Container matching UnitCard style */}
              <div className="relative overflow-hidden max-h-[12rem] aspect-video bg-slate-50 flex items-center justify-center">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Info size={48} className="opacity-20" />
                  </div>
                )}
              </div>

              {/* Content Area with same padding as UnitCard (p-5 sm:p-6) */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col">
                <div className="mb-4 sm:mb-6">
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                    {item.name}
                  </h4>
                </div>

                <div className="flex-1">
                  <p className="text-sm text-slate-500 mb-6 line-clamp-3 leading-relaxed italic">
                    {item.description}
                  </p>
                </div>

                {/* Footer matching card styling */}
                <div className="pt-6 border-t border-slate-50 mt-auto flex justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin size={14} />
                    <span className="text-xs font-medium">{item.id}</span>
                  </div>
                  {item.website && (
                    <a
                      href={item.website}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-[#102a43] hover:underline"
                    >
                      <Globe size={14} />
                      <span className="text-xs font-bold uppercase tracking-wider font-bold">
                        Website
                      </span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}