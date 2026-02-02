import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import { BuildingData, Floor, Unit, Filters } from "../types/building";

interface BuildingContextType {
  data: BuildingData | null;
  loading: boolean;
  error: string | null;
  activeFloor: Floor | null;
  activeUnit: Unit | null;
  allUnits: Unit[];
  filteredUnits: Unit[];
  floors: Floor[];
  favorites: string[];
  gridTab: string;
  viewMode: string;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  setGridTab: (tab: string) => void;
  setViewMode: (mode: string) => void;
  selectFloor: (id: string) => void;
  selectUnit: (unitId: string) => void;
  toggleFavorite: (id: string) => void;
  clearFavorites: () => void;
  goBackToBuilding: () => void;
  activeTour: any;
  setActiveTour: (tour: any) => void;
}

const BuildingContext = createContext<BuildingContextType | undefined>(undefined);

export function BuildingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<BuildingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFloorId, setActiveFloorId] = useState<string | null>(null);
  const [activeUnitId, setActiveUnitId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState("map");
  const [gridTab, setGridTab] = useState("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeTour, setActiveTour] = useState<any>(null);

  const [filters, setFilters] = useState<Filters>({
    beds: "All",
    baths: "All",
    status: "All",
    features: [],
    minSqft: 0,
    maxSqft: 0,
  });

  useEffect(() => {
    fetch("/data/building.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load building data");
        return res.json();
      })
      .then((json: BuildingData) => {
        setData(json);
        const allUnits = json.config.floors.flatMap((f) => f.units);
        if (allUnits.length > 0) {
          const sqfts = allUnits.map((u) => u.sqft || 0);
          setFilters((prev) => ({
            ...prev,
            minSqft: Math.min(...sqfts),
            maxSqft: Math.max(...sqfts),
          }));
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const floors = useMemo(() => data?.config?.floors || [], [data]);

  const allUnits = useMemo((): Unit[] => {
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
        filters.baths === "All" || unit.numOfBaths === parseFloat(filters.baths);
      const matchStatus =
        filters.status === "All" || unit.status === filters.status;
      const matchSqft =
        unit.sqft >= filters.minSqft && unit.sqft <= filters.maxSqft;

      // Fixes TS7053 indexing error
      const matchFeatures = filters.features.every((f) => unit[f as keyof Unit] === true);

      return matchBeds && matchBaths && matchStatus && matchFeatures && matchSqft;
    });
  }, [allUnits, filters, favorites, gridTab]);

  const selectFloor = useCallback((id: string) => {
    setActiveFloorId(id);
    const floor = floors.find((f) => f.id === id);
    // Automatically select the first unit of the floor
    if (floor && floor.units.length > 0) {
      setActiveUnitId(floor.units[0].id);
    }
    setViewMode("map");
  }, [floors]);

  const handleUnitSelect = useCallback((unitId: string) => {
    const unitData = allUnits.find((u) => u.id === unitId);
    if (unitData) {
      setActiveFloorId(unitData.floorId);
      setActiveUnitId(unitId);
    }
  }, [allUnits]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  }, []);

  const clearFavorites = useCallback(() => setFavorites([]), []);

  const goBackToBuilding = useCallback(() => {
    setActiveFloorId(null);
    setActiveUnitId(null);
  }, []);

  const value = useMemo(
    () => ({
      data,
      loading,
      error,
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
      toggleFavorite,
      clearFavorites,
      goBackToBuilding,
      activeTour,
      setActiveTour,
    }),
    [data, loading, error, activeFloor, activeUnit, allUnits, filteredUnits, floors, favorites, gridTab, viewMode, filters, handleUnitSelect, selectFloor, toggleFavorite, clearFavorites, goBackToBuilding, activeTour],
  );

  return (
    <BuildingContext.Provider value={value}>
      {children}
    </BuildingContext.Provider>
  );
}

export const useBuilding = () => {
  const context = useContext(BuildingContext);
  if (!context) throw new Error("useBuilding must be used within a BuildingProvider");
  return context;
};