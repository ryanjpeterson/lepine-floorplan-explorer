import React from "react";
import {
  Download,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";

export default function Sidebar({
  unit,
  onNext,
  onPrev,
  currentIndex,
  total,
  onOpenGallery,
}) {
  const availableClass = "bg-emerald-50 text-emerald-700 border-emerald-100";
  const leasedClass = "bg-rose-50 text-rose-700 border-rose-100";

  return (
    <div
      id="sidebar"
      className="flex-1 w-full flex flex-col bg-white shadow-2xl z-20 md:w-[420px] md:flex-none md:h-full md:border-l border-slate-100 min-h-0 relative"
    >
      <div className="hidden md:block px-8 py-6 border-b border-slate-100 bg-white/95 backdrop-blur-sm sticky top-0 z-30">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          1581 Lépine Blvd
        </h2>
      </div>

      <div
        id="sidebar-content"
        className="flex-1 overflow-y-auto relative h-full no-scrollbar"
      >
        {!unit ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
            <div className="p-4 bg-slate-50 rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-slate-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-500">
              Select a unit on the map
            </p>
          </div>
        ) : (
          <div className="animate-fade-in flex flex-col h-full relative">
            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col">
              <div className="shrink-0 mb-4 md:mb-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-none md:leading-tight">
                    {unit.title}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2 py-1 md:px-3 md:py-1.5 rounded-md text-[10px] md:text-[11px] font-bold tracking-wide uppercase shadow-sm border ${unit.available ? availableClass : leasedClass}`}
                  >
                    {unit.available ? "Available" : "Leased"}
                  </span>
                </div>
              </div>

              {/* Grid-based container: Gallery button is a fixed square on mobile */}
              <div className="grid grid-cols-[100px_1fr] md:flex md:flex-col gap-3 md:gap-6 mb-6">
                <div
                  onClick={onOpenGallery}
                  className="w-[100px] h-[100px] md:w-full md:h-auto md:aspect-video relative group overflow-hidden rounded-xl md:rounded-2xl shadow-soft cursor-pointer bg-slate-100 shrink-0"
                >
                  <img
                    src={unit.img}
                    alt={unit.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 md:bg-gradient-to-t md:from-black/60 md:via-transparent md:to-transparent md:opacity-60 md:group-hover:opacity-80 transition-opacity"></div>

                  <div className="hidden md:flex absolute bottom-4 left-4 right-4 justify-between items-end">
                    <div className="text-white">
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">
                        Gallery
                      </p>
                      <p className="text-sm font-semibold flex items-center gap-2">
                        <ImageIcon size={14} /> View {unit.gallery?.length || 0}{" "}
                        Photos
                      </p>
                    </div>
                  </div>
                  <div className="md:hidden absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-white" />
                  </div>
                </div>

                {/* Statistics: Flex shrink enabled to prevent overflow */}
                <div className="flex flex-col gap-2 md:grid md:grid-cols-2 md:gap-3 shrink min-w-0">
                  <div className="px-3 py-2 md:py-4 rounded-xl border border-slate-100 bg-white shadow-sm flex flex-col justify-center shrink min-w-0">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">
                      Area
                    </p>
                    <p className="text-sm md:text-lg font-bold truncate">
                      {unit.sqft.toLocaleString()}{" "}
                      <span className="text-[10px] font-normal">sqft</span>
                    </p>
                  </div>
                  <div className="px-3 py-2 md:py-4 rounded-xl border border-slate-100 bg-white shadow-sm flex flex-col justify-center shrink min-w-0">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">
                      Layout
                    </p>
                    <p className="text-sm md:text-lg font-bold truncate">
                      {unit.beds}bd / {unit.baths}ba
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-500 leading-relaxed mb-8">
                {unit.description}
              </p>

              <div className="mt-auto">
                <a
                  href="/assets/floorplan.pdf"
                  target="_blank"
                  className="w-full flex items-center justify-center gap-2 bg-[#102a43] hover:bg-slate-800 text-white font-semibold py-4 rounded-full transition-all duration-300 shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Download size={18} /> Download Floorplan
                </a>
              </div>
            </div>

            <div className="shrink-0 bg-white/95 flex items-center justify-between px-8 py-6 z-10">
              <button
                onClick={onPrev}
                className="group flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-[#102a43] transition-colors"
              >
                <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />{" "}
                Prev
              </button>
              <span className="text-xs font-bold text-slate-300 tracking-widest uppercase">
                {currentIndex + 1} / {total}
              </span>
              <button
                onClick={onNext}
                className="group flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-[#102a43] transition-colors"
              >
                Next{" "}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
