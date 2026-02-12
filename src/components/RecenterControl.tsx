import React from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

interface RecenterControlProps {
  bounds: L.LatLngBoundsExpression;
  padding: L.PointExpression;
}

export default function RecenterControl({ bounds, padding }: RecenterControlProps) {
  const map = useMap();

  return (
    <div
      className="leaflet-top leaflet-right"
      style={{ marginTop: "1rem", marginRight: "10px", zIndex: 1000 }}
    >
      <button
        onClick={() => map.fitBounds(bounds, { padding })}
        className="flex items-center gap-3 bg-white text-[#102a43] px-4 py-2 rounded-xl shadow-xl border border-slate-200 hover:bg-slate-50 pointer-events-auto cursor-pointer font-semibold font-['Jost']"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
        Recenter
      </button>
    </div>
  );
}