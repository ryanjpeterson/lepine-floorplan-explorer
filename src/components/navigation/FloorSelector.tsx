/* src/components/navigation/FloorSelector.tsx */
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useBuilding } from "../../context/BuildingContext";

export default function FloorSelector() {
  const { activeFloor, floors, selectFloor } = useBuilding();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!activeFloor) return null;

  return (
    <div className="relative flex flex-col items-center">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center gap-2 bg-white text-[#102a43] px-3 py-2 rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 cursor-pointer"
      >
        <span className="text-xs lg:text-sm font-bold whitespace-nowrap">{activeFloor.name}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${isMenuOpen ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 transition-all duration-300 flex flex-col gap-1 bg-white p-1.5 rounded-2xl shadow-xl border border-slate-200 min-w-[160px] overflow-hidden z-[1002] mt-2 ${
          isMenuOpen
            ? "opacity-100 translate-y-0 max-h-[40vh] overflow-y-auto"
            : "opacity-0 -translate-y-4 max-h-0 pointer-events-none"
        }`}
      >
        {floors.map((floor: any) => (
          <button
            key={floor.id}
            onClick={() => {
              selectFloor(floor.id);
              setIsMenuOpen(false);
            }}
            className={`p-2 rounded-xl text-left text-sm font-medium cursor-pointer ${
              activeFloor.id === floor.id
                ? "bg-[#102a43] text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {floor.name}
          </button>
        ))}
      </div>
    </div>
  );
}