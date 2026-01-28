import React from "react";
import { useNavigate } from "react-router-dom";
import BuildingMap from "./BuildingMap";

export default function BuildingView({ data }) {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full relative">
      <div className="absolute top-8 left-8 z-[1000] bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white shadow-2xl max-w-md hidden md:block">
        <h1 className="text-4xl font-bold text-slate-800 drop-shadow-sm mb-2">
          {data.name} {/* Dynamic value from JSON */}
        </h1>

        <p className="text-xs font-bold text-slate-400 uppercase mb-2">
          {data.address}
        </p>

        <p className="text-sm text-slate-600 leading-relaxed">
          Select a floor on the building to view available units and floorplans.
        </p>
      </div>

      <BuildingMap
        config={data.config}
        floors={data.config.floors}
        onSelect={(floor) => navigate(`/floor/${floor.id}`)}
      />
    </div>
  );
}
