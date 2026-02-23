export interface Tour {
  url: string;
  label: string;
}

export interface FloorConfig {
  url: string;
  width: number;
  height: number;
}

export interface Unit {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  pdf: string;
  description: string;
  numOfBeds: number;
  numOfBaths: number;
  status: string;
  sqft: number;
  gallery: string[];
  floorId: string;
  floorName: string;
  virtualTour?: Tour;
  [key: string]: any; 
}

export interface Floor {
  id: string;
  name: string;
  config: FloorConfig;
  units: Unit[];
  label: string;
  center: [number, number];
}

export interface BuildingData {
  name: string;
  logo: string;
  address: string;
  config: {
    url: string;
    width: number;
    height: number;
    floors: Floor[];
    modelUrl?: string;
  };
}

export interface Filters {
  beds: string;
  baths: string;
  status: string;
  features: string[];
  minSqft: number;
  maxSqft: number;
}