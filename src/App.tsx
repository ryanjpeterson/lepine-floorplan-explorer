/* src/App.tsx */
import React, { lazy, Suspense } from "react";
import { useBuilding } from "./context/BuildingContext";
import MainLayout from "./components/MainLayout";
import ContentLoader from "./components/ContentLoader";

const BuildingStaticScreen = lazy(() => import("./screens/BuildingStaticScreen"));
const FloorplanSVGScreen = lazy(() => import("./screens/FloorplanSVGScreen"));

const App: React.FC = () => {
  const { loading, error, activeFloor } = useBuilding();

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

  return (
    <div className="h-full w-full overflow-hidden bg-slate-50 relative">
      {/* Default Background Image moved from FloorplanSVGScreen */}
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
        <Suspense 
          fallback={
            <ContentLoader label="Loading..." />
          }
        >
          {activeFloor ? (
            <MainLayout>
              <FloorplanSVGScreen />
            </MainLayout>
          ) : (
            <BuildingStaticScreen />
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default App;