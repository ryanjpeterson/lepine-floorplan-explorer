import React, { useState, useEffect } from "react";
import BuildingView from "./components/BuildingView";
import FloorplanView from "./components/FloorplanView";
import GalleryModal from "./components/GalleryModal";
import { BUILDING_CONFIG } from "./config/floorplans";

function App() {
  // Initialize state from URL params if they exist
  const [view, setView] = useState(() => {
    return (
      new URLSearchParams(window.location.search).get("screen") || "building"
    );
  });

  const [activeFloor, setActiveFloor] = useState(() => {
    const floorId = new URLSearchParams(window.location.search).get("floor");
    return BUILDING_CONFIG.floors.find((f) => f.id === floorId) || null;
  });

  const [activeUnit, setActiveUnit] = useState(() => {
    const unitId = new URLSearchParams(window.location.search).get("unit");
    if (!activeFloor) return null;
    return activeFloor.units.find((u) => String(u.id) === unitId) || null;
  });

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("screen", view);
    if (activeFloor) params.set("floor", activeFloor.id);
    if (activeUnit) params.set("unit", activeUnit.id);

    const newRelativePathQuery =
      window.location.pathname + "?" + params.toString();
    window.history.replaceState(null, "", newRelativePathQuery);
  }, [view, activeFloor, activeUnit]);

  const handleFloorSelect = (floor) => {
    setActiveFloor(floor);
    setView("floorplan");
    if (floor.units?.length > 0) {
      setActiveUnit(floor.units[0]);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-50">
      {view === "building" ? (
        <BuildingView onFloorSelect={handleFloorSelect} />
      ) : (
        <FloorplanView
          activeFloor={activeFloor}
          activeUnit={activeUnit}
          onUnitSelect={setActiveUnit}
          onFloorChange={handleFloorSelect}
          onBack={() => {
            setView("building");
            setActiveFloor(null);
            setActiveUnit(null);
          }}
          onOpenGallery={() => setIsGalleryOpen(true)}
        />
      )}

      <GalleryModal
        isOpen={isGalleryOpen}
        images={activeUnit?.gallery}
        onClose={() => setIsGalleryOpen(false)}
      />
    </div>
  );
}

export default App;
