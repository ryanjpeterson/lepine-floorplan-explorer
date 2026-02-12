import React, { useEffect } from "react";
import { useBuilding } from "./context/BuildingContext";
import BuildingView from "./components/BuildingView";
import FloorplanView from "./components/FloorplanView";

const App: React.FC = () => {
  const { loading, error, activeFloor, floors, selectFloor } = useBuilding();

  useEffect(() => {
    // 1024px is the 'lg' breakpoint used in FloorplanView
    const MOBILE_BREAKPOINT = 1024;

    const checkMobileView = () => {
      const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
      
      // If we are on mobile and no floor is currently active, set the default
      if (isMobile && !activeFloor && floors.length > 0) {
        // Find the 2nd floor specifically
        // We check by name or ID depending on your building.json structure
        const secondFloor = floors.find(f => 
          f.name.toLowerCase().includes("2nd") || f.id === "floor-2"
        );

        // Fallback to the first available floor if '2nd Floor' isn't found
        const defaultFloorId = secondFloor ? secondFloor.id : floors[0].id;
        selectFloor(defaultFloorId);
      }
    };

    // Run check on initial load
    checkMobileView();

    // Listen for window resize to handle orientation changes or desktop resizing
    window.addEventListener("resize", checkMobileView);
    
    // Cleanup event listener on unmount
    return () => window.removeEventListener("resize", checkMobileView);
  }, [activeFloor, floors, selectFloor]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center font-bold">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
        <p className="text-slate-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-slate-800 text-white rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-50">
      {/* activeFloor is managed by the useEffect for mobile, 
          while desktop requires manual selection to show FloorplanView */}
      {activeFloor ? <FloorplanView /> : <BuildingView />}
    </div>
  );
};

export default App;