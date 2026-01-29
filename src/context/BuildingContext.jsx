// src/context/BuildingContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";

const BuildingContext = createContext();

export function BuildingProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFloorId, setActiveFloorId] = useState(null);
  const [activeUnitId, setActiveUnitId] = useState(null);

  const [viewMode, setViewMode] = useState("map");
  const [gridTab, setGridTab] = useState("all");
  const [favorites, setFavorites] = useState([]);
  const [activeTour, setActiveTour] = useState(null);

  const [filters, setFilters] = useState({
    beds: "All",
    baths: "All",
    status: "All",
    features: [],
    minSqft: 0,
    maxSqft: 5000, // Initial high bound
  });

  useEffect(() => {
    fetch("/data/building.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load building data");
        return res.json();
      })
      .then((json) => {
        setData(json);
        // FIX: Removed initial floor selection to default to BuildingView
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const floors = useMemo(() => data?.config?.floors || [], [data]);

  const allUnits = useMemo(() => {
    return floors.flatMap((floor) =>
      floor.units.map((unit) => ({
        ...unit,
        floorName: floor.name,
        floorId: floor.id,
      })),
    );
  }, [floors]);

  const activeFloor = useMemo(
    () => floors.find((f) => f.id === activeFloorId) || null,
    [floors, activeFloorId],
  );
  const activeUnit = useMemo(
    () => allUnits.find((u) => u.id === activeUnitId) || null,
    [allUnits, activeUnitId],
  );

  const filteredUnits = useMemo(() => {
    const baseSet =
      gridTab === "favorites"
        ? allUnits.filter((u) => favorites.includes(u.id))
        : allUnits;

    return baseSet.filter((unit) => {
      const matchBeds =
        filters.beds === "All" || unit.numOfBeds === parseInt(filters.beds);
      const matchBaths =
        filters.baths === "All" ||
        unit.numOfBaths === parseFloat(filters.baths);
      const matchStatus =
        filters.status === "All" || unit.status === filters.status;
      const matchSqft =
        unit.sqft >= filters.minSqft && unit.sqft <= filters.maxSqft;
      const matchFeatures = filters.features.every((f) => unit[f] === true);

      return (
        matchBeds && matchBaths && matchStatus && matchFeatures && matchSqft
      );
    });
  }, [allUnits, filters, favorites, gridTab]);

  const selectFloor = (id) => {
    const floor = floors.find((f) => f.id === id);
    setActiveFloorId(id);
    // FIX: Default to the first unit of the floor for persistent sidebar
    if (floor && floor.units.length > 0) {
      setActiveUnitId(floor.units[0].id);
    }
    setViewMode("map");
  };

  const handleUnitSelect = (unitId) => {
    const unitData = allUnits.find((u) => u.id === unitId);
    if (unitData) {
      setActiveFloorId(unitData.floorId);
      setActiveUnitId(unitId);
    }
  };

  const value = {
    data,
    loading,
    activeFloor,
    activeUnit,
    allUnits,
    filteredUnits,
    floors,
    favorites,
    gridTab,
    viewMode,
    filters,
    setFilters,
    setGridTab,
    setViewMode,
    selectFloor,
    selectUnit: handleUnitSelect,
    toggleFavorite: (id) =>
      setFavorites((prev) =>
        prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
      ),
    goBackToBuilding: () => {
      setActiveFloorId(null);
      setActiveUnitId(null);
    },
    activeTour,
    setActiveTour,
  };

  return (
    <BuildingContext.Provider value={value}>
      {children}
    </BuildingContext.Provider>
  );
}

export const useBuilding = () => {
  const context = useContext(BuildingContext);
  if (!context)
    throw new Error("useBuilding must be used within a BuildingProvider");
  return context;
};
