/* src/components/navigation/AppFooter.tsx */
import React from "react";
import { useBuilding } from "../../context/BuildingContext";

export default function AppFooter() {
  const { data } = useBuilding();

  return (
    <footer className="z-[10] bg-white backdrop-blur-sm border-t border-slate-200 p-4 shrink-0">
      <div className="flex justify-center items-center h-8"> 
        <img 
          src={data?.logo} 
          alt={data?.name}
          className="max-h-full w-auto object-contain py-1" 
        />
      </div>
    </footer>
  );
}