/* src/screens/BuildingStaticScreen.tsx */
import { useBuilding } from "../context/BuildingContext";
import BuildingMap from "../components/BuildingMap";
import PageShell from "../components/layout/PageShell";

export default function BuildingStaticScreen() {
  const { data, floors, selectFloor } = useBuilding();

  if (!data) return null;

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

        <BuildingMap
          config={data.config}
          floors={floors}
          onSelect={(floor) => selectFloor(floor.id)}
        />
      </div>
  );
};