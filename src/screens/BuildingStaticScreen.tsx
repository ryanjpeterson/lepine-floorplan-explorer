/* src/screens/BuildingStaticScreen.tsx */
import { useBuilding } from "../context/BuildingContext";
import BuildingMap from "../components/BuildingMap";

export default function BuildingStaticScreen() {
  const { data, floors, selectFloor, activeView, setActiveViewId, activeViewId } = useBuilding();

  // If activeView is null because of the missing mapping above, this returns null (blank screen)
  if (!data || !activeView) return null;

  return (
    <div className="h-full w-full relative">
      <div className="absolute top-8 left-8 z-[1000] bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white shadow-2xl max-w-md hidden md:block">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">{data.name}</h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
          {data.address}
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          Select a floor on the building to view available units and floorplans.
        </p>
      </div>

      {/* View Switching Buttons */}
      <div className="absolute bottom-8 right-8 z-[1000] flex flex-col gap-2">
        {data.config.views.map((view) => (
          <button
            key={view.id}
            onClick={() => setActiveViewId(view.id)}
            className={`px-4 py-2 rounded-lg font-bold transition-all shadow-lg ${
              activeViewId === view.id 
                ? "bg-[#518cb2] text-white" 
                : "bg-white text-slate-600 hover:bg-white"
            }`}
          >
            {view.label}
          </button>
        ))}
      </div>

      <BuildingMap
        view={activeView}
        floors={floors}
        onSelect={(floor) => selectFloor(floor.id)}
      />
    </div>
  );
}