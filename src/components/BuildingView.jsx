import React from "react";
import FloorplanMap from "./FloorplanMap";
import { BUILDING_CONFIG } from "../config/floorplans";

export default function BuildingView({ onFloorSelect }) {
  return (
    <div className="h-full w-full relative">
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl border border-slate-200 pointer-events-none">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight text-center">
          1581 Lépine Blvd
          <span className="block text-xs text-slate-500 font-medium uppercase tracking-widest mt-1">
            Select a Floor
          </span>
        </h1>
      </div>

      <FloorplanMap
        mode="building"
        config={BUILDING_CONFIG}
        items={BUILDING_CONFIG.floors}
        onSelect={onFloorSelect}
      />
    </div>
  );
}
