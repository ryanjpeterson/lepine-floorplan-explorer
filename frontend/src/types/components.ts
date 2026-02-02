import { Floor, Unit, BuildingData } from "./building";

export interface BuildingMapProps {
  config: any; // Ideally refine this based on your building.json schema
  floors: Floor[];
  onSelect: (floor: Floor) => void;
}

export interface UnitCardProps {
  unit: Unit;
  isActive: boolean;
  isFav: boolean;
  toggleFavorite: (id: string) => void;
  onSelectUnit: (id: string) => void;
  isDesktop: boolean;
}