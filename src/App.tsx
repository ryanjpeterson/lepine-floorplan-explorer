/* src/App.tsx */

import React, { lazy, Suspense } from "react";
import { useBuilding } from "./context/BuildingContext";
import ContentLoader from "./components/ContentLoader";
import HubSpotModal from "./components/HubSpotModal";
import TourModal from "./components/TourModal";

// Lazy load screens for better initial performance
const BuildingStaticScreen = lazy(() => import("./screens/BuildingStaticScreen"));
const FloorplanSVGScreen = lazy(() => import("./screens/FloorplanSVGScreen"));
const BuildingGallery = lazy(() => import("./screens/BuildingGallery"));

const App: React.FC = () => {
  const { loading, error, activeFloor, activeTour, setActiveTour, viewMode } = useBuilding();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <ContentLoader label="Loading Building Data" />
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

  /**
   * Screen Routing Logic:
   * 1. If viewMode is 'gallery', show the full-screen building gallery.
   * 2. If an activeFloor is selected, show the interactive floorplan exploration.
   * 3. Default to the building overview map (Home).
   */
  const renderActiveScreen = () => {
    if (viewMode === "gallery") {
      return <BuildingGallery />;
    }
    
    if (activeFloor) {
      return <FloorplanSVGScreen />;
    }

    return <BuildingStaticScreen />;
  };

  return (
    <div className="h-full w-full overflow-hidden bg-slate-50 relative">
      {/* Shared background aesthetic across all screens */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: 'url("/assets/carresaintlouis/bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          filter: 'grayscale(100%) blur(10px)',
          transform: 'scale(1.05)'
        }}
      />

      <div className="relative z-10 h-full w-full">
        <Suspense fallback={<ContentLoader label="Loading Screen..." />}>
          {renderActiveScreen()}
        </Suspense>
      </div>

      <HubSpotModal />
      
      <TourModal 
        isOpen={!!activeTour}
        url={activeTour || ""} 
        label="Virtual Tour"
        onClose={() => setActiveTour(null)}
      />
    </div>
  );
};

export default App;