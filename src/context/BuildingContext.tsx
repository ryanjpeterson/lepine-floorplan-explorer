/* src/context/BuildingContext.tsx */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import { BuildingData, Floor, Unit, Filters, Tour } from "../types/building";
import { fetchBuildingData, getSqftRange } from "../utils/buildingData";

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
  previousViewMode: string;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  setGridTab: (tab: string) => void;
  setViewMode: (mode: string) => void;
  selectFloor: (id: string) => void;
  selectUnit: (id: string) => void;
  toggleFavorite: (id: string) => void;
  clearFavorites: () => void;
  goBackToBuilding: () => void;
  activeTour: Tour | null;
  setActiveTour: (tour: Tour | null) => void;
}

const BuildingContext = createContext<BuildingContextType | undefined>(undefined);

export function BuildingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<BuildingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFloorId, setActiveFloorId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null); 
  const [viewMode, setViewModeState] = useState("map");
  const [previousViewMode, setPreviousViewMode] = useState("map");
  const [gridTab, setGridTabState] = useState("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeTour, setActiveTour] = useState<Tour | null>(null);

  const [filters, setFilters] = useState<Filters>({
    beds: "All",
    baths: "All",
    status: "All",
    features: [],
    minSqft: 0,
    maxSqft: 0,
  });

  const setViewMode = useCallback((mode: string) => {
    setViewModeState(mode);
  }, []);

  const setGridTab = useCallback((tab: string) => {
    setGridTabState((prevTab) => {
      if (tab === "favorites" && prevTab !== "favorites") {
        setPreviousViewMode(viewMode);
      }
      return tab;
    });
  }, [viewMode]);

  useEffect(() => {
    const initApp = async () => {
      try {
        const buildingData = await fetchBuildingData("/assets/carresaintlouis");
        setData(buildingData);

        // Set initial filter ranges based on loaded units
        const allUnits = buildingData.config.floors.flatMap(f => f.units);
        const { min, max } = getSqftRange(allUnits);
        setFilters(prev => ({ ...prev, minSqft: min, maxSqft: max }));
        
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    initApp();
  }, []);

  const floors = useMemo(() => data?.config?.floors || [], [data]);

  const allUnits = useMemo((): Unit[] => {
    return floors.flatMap((floor) => floor.units);
  }, [floors]);

  const activeFloor = useMemo(
    () => floors.find((f) => f.id === activeFloorId) || null,
    [floors, activeFloorId],
  );

  const activeUnit = useMemo(
    () => allUnits.find((u) => u.id === activeId) || null,
    [allUnits, activeId],
  );

  const filteredUnits = useMemo(() => {
    return allUnits.filter((unit) => {
      const matchBeds = filters.beds === "All" || unit.numOfBeds === parseInt(filters.beds);
      const matchBaths = filters.baths === "All" || unit.numOfBaths === parseFloat(filters.baths);
      const matchStatus = filters.status === "All" || unit.status === filters.status;
      const matchSqft = unit.sqft >= filters.minSqft && unit.sqft <= filters.maxSqft;
      const matchFeatures = filters.features.every((f) => unit[f as keyof Unit] === true);

      return matchBeds && matchBaths && matchStatus && matchFeatures && matchSqft;
    });
  }, [allUnits, filters]);

  const selectFloor = useCallback((id: string) => {
    setActiveFloorId(id);
    const floor = floors.find((f) => f.id === id);
    if (floor && floor.units.length > 0) {
      setActiveId(floor.units[0].id);
    }
    setViewMode("map");
  }, [floors, setViewMode]);

  const handleUnitSelect = useCallback((id: string) => { 
    const unitData = allUnits.find((u) => u.id === id);
    if (unitData) {
      setActiveFloorId(unitData.floorId);
      setActiveId(id);
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
    setActiveId(null);
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
      previousViewMode,
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
    [data, loading, error, activeFloor, activeUnit, allUnits, filteredUnits, floors, favorites, gridTab, viewMode, previousViewMode, filters, handleUnitSelect, selectFloor, toggleFavorite, clearFavorites, goBackToBuilding, activeTour, setViewMode, setGridTab],
  );

  return <BuildingContext.Provider value={value}>{children}</BuildingContext.Provider>;
}

export const useBuilding = () => {
  const context = useContext(BuildingContext);
  if (!context) throw new Error("useBuilding must be used within a BuildingProvider");
  return context;
};