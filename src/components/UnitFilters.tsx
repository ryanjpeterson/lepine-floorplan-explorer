import React, { useState } from "react";
import { useBuilding } from "../context/BuildingContext";
import {
  Filter,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { Unit } from "../types/building";

export default function UnitFilters() {
  const { filters, setFilters, allUnits, gridTab, clearFavorites } =
    useBuilding();
  const [isExpanded, setIsExpanded] = useState(false);

  const unitSqfts = allUnits.map((u: Unit) => u.sqft || 0);
  const minSqftLimit = unitSqfts.length > 0 ? Math.min(...unitSqfts) : 0;
  const maxSqftLimit = unitSqfts.length > 0 ? Math.max(...unitSqfts) : 5000;

  const handleCheckboxChange = (feature: string) => {
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
      minSqft: minSqftLimit,
      maxSqft: maxSqftLimit,
    });
  };

  const featureList = [
    { key: "balcony", label: "Balcony" },
    { key: "tub", label: "Tub" },
    { key: "pantry", label: "Pantry" },
    { key: "terrace", label: "Terrace" },
    { key: "office", label: "Office" },
    { key: "walkInCloset", label: "Walk-in Closet" },
    { key: "barrierFree", label: "Barrier Free" },
    { key: "builtIns", label: "Built-ins" },
    { key: "juliet", label: "Juliet" },
    { key: "modelSuite", label: "Model Suite" },
  ];

  return (
    <div className="bg-white border-b border-slate-200 shrink-0 relative z-[1001]">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2 text-[#102a43]">
          <Filter size={18} />
          <span className="text-sm font-bold">Filters</span>
        </div>
        <div className="flex items-center gap-2">
          {gridTab === "favorites" && (
            <button
              onClick={clearFavorites}
              className="flex items-center gap-2 px-3 py-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all text-xs font-bold mr-2 cursor-pointer"
            >
              <Trash2 size={16} />
              <span className="hidden sm:inline">Clear All</span>
            </button>
          )}
          <button
            onClick={resetFilters}
            className="p-2 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
          >
            <RotateCcw size={18} />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      <div
        className={`${
          isExpanded
            ? "max-h-[600px] opacity-100 pb-8 border-b border-slate-200 shadow-2xl"
            : "max-h-0 opacity-0 pointer-events-none"
        } absolute top-full left-0 w-full z-[1002] bg-white overflow-y-auto transition-all duration-300 ease-in-out px-4 lg:px-8 no-scrollbar`}
      >
        <div className="flex flex-col gap-8 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-end gap-6 lg:gap-8">
            <div className="flex flex-col gap-1.5 min-w-[120px]">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Beds
              </label>
              <select
                value={filters.beds}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFilters({ ...filters, beds: e.target.value })
                }
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-[#102a43] focus:ring-2 focus:ring-[#102a43]/10 outline-none cursor-pointer"
              >
                <option value="All">All Beds</option>
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n} Bed
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5 min-w-[120px]">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Baths
              </label>
              <select
                value={filters.baths}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFilters({ ...filters, baths: e.target.value })
                }
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-[#102a43] focus:ring-2 focus:ring-[#102a43]/10 outline-none cursor-pointer"
              >
                <option value="All">All Baths</option>
                {[1, 1.5, 2, 2.5, 3].map((n) => (
                  <option key={n} value={n}>
                    {n} Bath
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5 min-w-[200px] flex-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Square Footage
                </label>
                <span className="text-[10px] font-bold text-[#102a43]">
                  {filters.minSqft} - {filters.maxSqft} sqft
                </span>
              </div>
              <input
                type="range"
                min={minSqftLimit}
                max={maxSqftLimit}
                value={filters.maxSqft || maxSqftLimit}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFilters({ ...filters, maxSqft: parseInt(e.target.value) })
                }
                className="accent-[#102a43] h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <button
              onClick={resetFilters}
              className="hidden lg:flex items-center gap-2 text-slate-400 hover:text-rose-500 transition-colors text-xs font-bold py-2 px-4 cursor-pointer"
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>

          <div className="space-y-3 pt-6 border-t border-slate-100">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Amenities & Features
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {featureList.map((item) => (
                <label
                  key={item.key}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.features.includes(item.key)}
                      onChange={() => handleCheckboxChange(item.key)}
                      className="peer appearance-none w-5 h-5 border-2 border-slate-200 rounded-md checked:bg-[#102a43] checked:border-[#102a43] transition-all cursor-pointer"
                    />
                    <svg
                      className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-slate-600 group-hover:text-[#102a43] transition-colors">
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}