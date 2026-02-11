export interface Tour {
  url: string;
  label: string;
}

export interface AmenityTour extends Tour {
  id: string;
  position: [number, number];
}

export interface FloorConfig {
  url: string;
  width: number;
  height: number;
}

export interface Unit {
  id: string;
  title: string;
  model: string;
  image: string;
  pdf: string;
  description: string;
  numOfBeds: number;
  numOfBaths: number;
  status: string;
  sqft: number;
  polygon: [number, number][];
  gallery: string[];
  floorId: string;
  floorName: string;
  virtualTour?: Tour;
  [key: string]: any; 
}

export interface Floor {
  id: string;
  name: string;
  config: FloorConfig; // Use the interface here
  units: Unit[];
  amenityTours?: AmenityTour[];
  polygon: [number, number][];
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