import { useBuilding } from "../context/BuildingContext";
import { Info, MapPin, Globe } from "lucide-react";

export default function CommercialGrid() {
  const { commercialData } = useBuilding();

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/30 overflow-hidden animate-fade-in">
      <div className="flex-1 overflow-y-auto py-4 lg:p-8">
        <div className="grid gap-2 lg:gap-4 grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] max-w-[2400px] mx-auto overflow-visible">
          {commercialData.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl overflow-hidden border-2 border-transparent hover:border-slate-200 transition-all h-full flex flex-col shadow-xl hover:-translate-y-1"
            >
              <div className="relative overflow-hidden max-h-[12rem] aspect-video">
                <img
                  src={item.image}
                  alt={item.id}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-5 sm:p-6 flex-1 flex flex-col">
                <div className="mb-4 sm:mb-6">
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#102a43] transition-colors truncate">
                    {item.name}
                  </h4>
                </div>

                <p className="text-sm text-slate-500 mb-6 line-clamp-3 leading-relaxed italic">
                  {item.description}
                </p>

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