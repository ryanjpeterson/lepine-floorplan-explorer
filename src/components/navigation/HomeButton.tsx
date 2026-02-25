/* src/components/navigation/HomeButton.tsx */
import React from "react";
import { Home } from "lucide-react";
import { useBuilding } from "../../context/BuildingContext";

export default function HomeButton() {
  const { goBackToBuilding } = useBuilding();

  return (
    <button
      onClick={goBackToBuilding}
      className="flex bg-[#102a43] text-white px-4 py-2 rounded-xl font-bold text-xs transition-all items-center gap-2 whitespace-nowrap cursor-pointer hover:bg-[#1a3a5a]"
    >
      <Home size={14} /> Home
    </button>
  );
}