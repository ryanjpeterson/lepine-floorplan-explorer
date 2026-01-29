// src/components/UnitFilters.jsx
import React from "react";
import { useBuilding } from "../context/BuildingContext";
import { Filter, RotateCcw } from "lucide-react";

export default function UnitFilters() {
  const { filters, setFilters, allUnits } = useBuilding();

  // Find max sqft for the slider range
  const maxSqft = Math.max(...allUnits.map((u) => u.sqft || 0), 2000);

  const handleCheckboxChange = (feature) => {
    setFilters((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const resetFilters = () => {
    setFilters({
      beds: "All",
      baths: "All",
      status: "All",
      features: [],
      minSqft: 0,
      maxSqft: maxSqft,
    });
  };

  const featureList = [
    { key: "balcony", label: "Balcony" },
    { key: "tub", label: "Tub" },
    { key: "pantry", label: "Pantry" },
    { key: "terrace", label: "Terrace" },
    { key: "officeDen", label: "Office/Den" },
    { key: "walkInCloset", label: "Walk-in Closet" },
    { key: "barrierFree", label: "Barrier Free" },
    { key: "builtIns", label: "Built-ins" },
    { key: "juliet", label: "Juliet" },
    { key: "modelSuite", label: "Model Suite" },
  ];

  return (
    <div className="sticky top-0 z-[50] bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm p-4">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-6">
          {/* Numeric Dropdowns */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Beds
            </label>
            <select
              value={filters.beds}
              onChange={(e) => setFilters({ ...filters, beds: e.target.value })}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-[#102a43] focus:ring-2 focus:ring-[#102a43]/10 outline-none"
            >
              <option value="All">All Beds</option>
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n} Bed
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Baths
            </label>
            <select
              value={filters.baths}
              onChange={(e) =>
                setFilters({ ...filters, baths: e.target.value })
              }
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-[#102a43] focus:ring-2 focus:ring-[#102a43]/10 outline-none"
            >
              <option value="All">All Baths</option>
              {[1, 1.5, 2, 2.5, 3].map((n) => (
                <option key={n} value={n}>
                  {n} Bath
                </option>
              ))}
            </select>
          </div>

          {/* Range Slider for SQFT */}
          <div className="flex flex-col gap-1.5 min-w-[200px] flex-1">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Square Footage
              </label>
              <span className="text-[10px] font-bold text-[#102a43]">
                {filters.minSqft || 0} - {filters.maxSqft || maxSqft} sqft
              </span>
            </div>
            <input
              type="range"
              min="0"
              max={maxSqft}
              value={filters.maxSqft || maxSqft}
              onChange={(e) =>
                setFilters({ ...filters, maxSqft: parseInt(e.target.value) })
              }
              className="accent-[#102a43] h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <button
            onClick={resetFilters}
            className="flex items-center gap-2 text-slate-400 hover:text-rose-500 transition-colors text-xs font-bold py-2 px-3"
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>

        {/* Checkbox Features */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 border-t border-slate-100">
          {featureList.map((item) => (
            <label
              key={item.key}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.features.includes(item.key)}
                onChange={() => handleCheckboxChange(item.key)}
                className="w-4 h-4 rounded border-slate-300 text-[#102a43] focus:ring-[#102a43]"
              />
              <span className="text-xs font-medium text-slate-600 group-hover:text-[#102a43] transition-colors">
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
