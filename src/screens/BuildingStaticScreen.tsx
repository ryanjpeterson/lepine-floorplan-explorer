/* src/screens/BuildingStaticScreen.tsx */
import { useBuilding } from "../context/BuildingContext";
import BuildingMap from "../components/BuildingMap";

export default function BuildingStaticScreen() {
  const { data, floors, selectFloor, activeView, setActiveViewId, activeViewId } = useBuilding();

  // If activeView is null because of the missing mapping above, this returns null (blank screen)
  if (!data || !activeView) return null;

  const BuildingInfo = () => {
    return (
      <div className="absolute top-8 left-8 z-[1000] bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white shadow-2xl max-w-md hidden md:block">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">{data.name}</h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {data.address}
        </p>
      </div>
    )
  }

  const ViewMenu = () => {
    return (
      <div className="absolute bottom-8 right-8 z-[1000] bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-white shadow-2xl flex flex-col gap-2">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mx-auto">
          View:
        </p>
        {data.config.views.map((view) => (
          <button
            key={view.id}
            onClick={() => setActiveViewId(view.id)}
            className={`px-5 py-2.5 rounded-xl font-bold transition-all text-xs lg:text-sm whitespace-nowrap cursor-pointer flex items-center justify-center ${
              activeViewId === view.id 
                ? "bg-[#518cb2] text-white shadow-lg scale-105" 
                : "bg-white text-slate-600 border border-slate-100 hover:bg-slate-50 hover:shadow-md"
            }`}
          >
            {view.label}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="h-full w-full relative">
      <BuildingInfo />

      <ViewMenu />
    
      <BuildingMap
        view={activeView}
        floors={floors}
        onSelect={(floor) => selectFloor(floor.id)}
      />
    </div>
  );
}