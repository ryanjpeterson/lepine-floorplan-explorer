import React, { useState } from "react";
import { ChevronUp } from "lucide-react";
import UnitMap from "./UnitMap";
import Sidebar from "./Sidebar";
import VirtualTourEmbed from "./VirtualTourEmbed";
import GalleryModal from "./GalleryModal";
import { UI_TRANSITIONS } from "../config/viewConfigs";

export default function FloorplanView({
  data, // Contains building name and address from building.json
  activeFloor,
  activeUnit,
  onUnitSelect,
  onFloorChange,
  onBack,
}) {
  const [isFloorMenuOpen, setIsFloorMenuOpen] = useState(false);
  const [activeTour, setActiveTour] = useState(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  if (!activeFloor || !activeFloor.units) return null;

  const currentIndex = activeFloor.units.findIndex(
    (u) => u.id === activeUnit?.id,
  );

  const navigateUnit = (dir) => {
    const units = activeFloor.units;
    let nextIndex = currentIndex + dir;
    if (nextIndex >= units.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = units.length - 1;
    onUnitSelect(units[nextIndex]);
  };

  return (
    <div className="flex flex-col md:flex-row h-full w-full">
      <div className="flex-1 relative z-0">
        <button
          onClick={onBack}
          className="absolute bottom-8 left-8 z-[1000] bg-white px-4 py-2 rounded-lg shadow-xl hover:bg-slate-100 font-bold text-slate-700 transition-colors border border-slate-200"
        >
          ← Back
        </button>

        <div className="absolute top-8 right-8 z-[1000] bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white shadow-2xl max-w-xs hidden md:block">
          <p className="text-xs font-bold text-slate-400 uppercase mb-2">
            Navigation
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Click on a unit to see details or use the navigation arrows in the
            sidebar. Click the floor number below to switch levels.
          </p>
        </div>

        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] flex flex-col items-center ${isFloorMenuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        >
          <div
            className={`${UI_TRANSITIONS} mb-3 flex flex-col gap-1 bg-white p-1.5 rounded-2xl shadow-xl border border-slate-200 min-w-[160px] ${isFloorMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {data.config.floors.map((floor) => (
              <button
                key={floor.id}
                onClick={() => {
                  onFloorChange(floor);
                  setIsFloorMenuOpen(false);
                }}
                className={`px-4 py-2.5 rounded-xl text-left text-sm font-medium ${UI_TRANSITIONS} ${activeFloor?.id === floor.id ? "bg-[#102a43] text-white" : "text-slate-600 hover:bg-slate-100"}`}
              >
                {floor.name}
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsFloorMenuOpen(!isFloorMenuOpen)}
            className="pointer-events-auto flex items-center gap-3 bg-white text-[#102a43] px-6 py-3 rounded-xl shadow-xl border border-slate-200 hover:bg-slate-50 transition-all"
          >
            <span className="text-sm font-bold">{activeFloor.name}</span>
            <ChevronUp
              size={18}
              className={`${UI_TRANSITIONS} ${isFloorMenuOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        <UnitMap
          config={activeFloor.config}
          units={activeFloor.units}
          vrTours={activeFloor.vrTours || []}
          activeUnitId={activeUnit?.id}
          onSelect={onUnitSelect}
          onTourSelect={setActiveTour}
        />
      </div>

      <Sidebar
        unit={activeUnit}
        onNext={() => navigateUnit(1)}
        onPrev={() => navigateUnit(-1)}
        currentIndex={currentIndex}
        total={activeFloor.units.length}
        onOpenGallery={() => setIsGalleryOpen(true)}
        buildingName={data.name} // Pass dynamic name
        buildingAddress={data.address} // Pass dynamic address
      />

      <VirtualTourEmbed
        isOpen={!!activeTour}
        url={activeTour?.url}
        label={activeTour?.label}
        onClose={() => setActiveTour(null)}
      />
      <GalleryModal
        isOpen={isGalleryOpen}
        images={activeUnit?.gallery}
        onClose={() => setIsGalleryOpen(false)}
      />
    </div>
  );
}
