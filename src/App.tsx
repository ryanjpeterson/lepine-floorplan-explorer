import React from "react";
import { useBuilding } from "./context/BuildingContext";
import BuildingView from "./screens/BuildingView";
import FloorplanView from "./screens/FloorplanView";

const App: React.FC = () => {
  const { loading, error, activeFloor } = useBuilding();

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
      {activeFloor ? <FloorplanView /> : <BuildingView />}
    </div>
  );
};

export default App;