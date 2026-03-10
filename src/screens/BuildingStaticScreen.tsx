/* src/screens/BuildingStaticScreen.tsx */
import { useBuilding } from "../context/BuildingContext";
import BuildingMap from "../components/BuildingMap";

export default function BuildingStaticScreen() {
  const { data, floors, selectFloor, activeView, setActiveViewId, activeViewId } = useBuilding();

  if (!data || !activeView) return null;

  const BuildingInfo = () => {
    return (
      <div className="relative lg:absolute lg:top-8 lg:left-8 lg:z-[1000] bg-white lg:bg-white/80 lg:backdrop-blur-md p-6 lg:rounded-2xl lg:border-white border-b lg:border border-slate-100 shadow-xl lg:shadow-2xl lg:max-w-md shrink-0">
        <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-2">{data.name}</h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {data.address}
        </p>
      </div>
    )
  }

  const ViewMenu = () => {
    return (
      <div className="relative lg:absolute lg:top-8 lg:right-8 lg:z-[1000] bg-white lg:bg-white/80 lg:backdrop-blur-md p-4 lg:rounded-2xl lg:border-white border-b lg:border border-slate-100 shadow-xl lg:shadow-2xl lg:max-w-md shrink-0 flex flex-col align-center gap-2">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mx-auto">
          View:
        </p>
        <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-1 no-scrollbar">
          {data.config.views.map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveViewId(view.id)}
              className={`px-5 py-2.5 rounded-xl font-bold transition-all text-xs lg:text-sm whitespace-nowrap cursor-pointer flex items-center justify-center flex-1 lg:flex-none ${
                activeViewId === view.id 
                  ? "bg-[#518cb2] text-white shadow-lg scale-105" 
                  : "bg-white text-slate-600 border border-slate-100 hover:bg-slate-50 hover:shadow-md"
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:block h-full w-full relative overflow-hidden">
      <BuildingInfo />

      {/* flex-1 and min-h-0 prevents the map from expanding beyond the screen height */}
      <div className="flex-1 min-h-0 w-full lg:h-full lg:absolute lg:inset-0">
        <BuildingMap
          view={activeView}
          floors={floors}
          onSelect={(floor) => selectFloor(floor.id)}
        />
      </div>

      <ViewMenu />
    </div>
  );
}