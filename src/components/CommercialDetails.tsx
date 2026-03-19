import React from "react";
import { useBuilding } from "../context/BuildingContext";
import { ExternalLink } from "lucide-react";

export default function CommercialDetails() {
  const { commercialData } = useBuilding();

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">Ground Floor</h2>
        <p className="text-slate-500 text-sm">Explore storefronts at your doorstep!</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        {/* Updated to a grid of two */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-8">
          {commercialData.map((item) => (
            <div key={item.id} className="group cursor-pointer">
              <div className="relative aspect-square mb-3 overflow-hidden rounded-xl bg-slate-100 shadow-sm transition-shadow hover:shadow-md">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-slate-900 leading-tight truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">{item.id}</p>
                </div>
                {item.website && (
                  <a 
                    href={item.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="shrink-0 p-1.5 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-900 hover:text-white transition-all"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}