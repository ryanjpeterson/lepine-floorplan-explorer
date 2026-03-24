/* src/screens/FavouriteUnitsScreen.tsx */
import { useEffect } from "react";
import { useBuilding } from "../context/BuildingContext";
import { Unit } from "../types/building";
import UnitGrid from "../components/UnitGrid";
import { Trash2 } from "lucide-react";
import PageShell from "../components/layout/PageShell";
import HomeButton from "../components/navigation/HomeButton";
import ViewToggles from "../components/navigation/ViewToggles";

export default function FavouriteUnitsScreen({ onSelectUnit }: { onSelectUnit: (id: string) => void }) {
  const { 
    favorites, 
    allUnits, 
    setGridTab, 
    previousViewMode, 
    setViewMode,
    clearFavorites 
  } = useBuilding();

  const allFavoritedUnits = allUnits.filter((u: Unit) => favorites.includes(u.id));

  useEffect(() => {
    if (favorites.length === 0) {
      setGridTab("all");
      setViewMode(previousViewMode || "map");
    }
  }, [favorites.length, setGridTab, setViewMode, previousViewMode]);

  return (
    <PageShell
      headerLeft={<HomeButton />}
      headerRight={<ViewToggles />}
    >
      <div className="flex flex-col h-full bg-white/30 backdrop-blur-sm">
        <div className="bg-white border-b border-slate-200 p-4 flex justify-between items-center shrink-0">
          <h2 className="text-sm font-bold text-[#102a43] uppercase tracking-wider">My Favourites</h2>
          <button
            onClick={clearFavorites}
            className="flex items-center gap-2 px-3 py-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all text-xs font-bold cursor-pointer"
          >
            <Trash2 size={16} />
            Clear All
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar py-4 lg:p-8">
          {allFavoritedUnits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40 text-[#102a43]">
              <p className="text-lg font-medium">You have not selected any favourites!</p>
            </div>
          ) : (
            <UnitGrid onSelectUnit={onSelectUnit} unitsOverride={allFavoritedUnits} />
          )}
        </div>
      </div>
    </PageShell>
  );
}