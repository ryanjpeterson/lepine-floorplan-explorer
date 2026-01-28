import React, { useState, useEffect, useMemo } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useParams,
  useLocation,
  Navigate,
} from "react-router-dom";
import BuildingView from "./components/BuildingView";
import FloorplanView from "./components/FloorplanView";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/data/building.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load building data");
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => console.error(err));
  }, []);

  if (!data)
    return (
      <div className="h-screen w-screen flex items-center justify-center font-bold">
        Loading...
      </div>
    );

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-50">
      <Routes>
        <Route path="/" element={<BuildingView data={data} />} />
        <Route
          path="/floor/:floorId"
          element={<FloorViewWrapper data={data} />}
        />
        <Route
          path="/floor/:floorId/unit/:unitId"
          element={<FloorViewWrapper data={data} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function FloorViewWrapper({ data }) {
  const { floorId, unitId } = useParams();
  const navigate = useNavigate();

  const activeFloor = useMemo(
    () => data.config.floors.find((f) => f.id === floorId),
    [data, floorId],
  );

  const activeUnit = useMemo(() => {
    if (!activeFloor) return null;
    return (
      activeFloor.units.find((u) => String(u.id) === unitId) ||
      activeFloor.units[0]
    );
  }, [activeFloor, unitId]);

  if (!activeFloor) return <Navigate to="/" replace />;

  return (
    <FloorplanView
      data={data}
      activeFloor={activeFloor}
      activeUnit={activeUnit}
      onUnitSelect={(u) => navigate(`/floor/${floorId}/unit/${u.id}`)}
      onFloorChange={(f) => navigate(`/floor/${f.id}`)}
      onBack={() => navigate("/")}
    />
  );
}

export default App;
