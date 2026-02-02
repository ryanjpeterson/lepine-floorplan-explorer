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
  // Index signature to allow dynamic feature filtering and resolve TS7053
  [key: string]: any; 
}

// Exported to resolve TS2305 in UnitMap and VirtualTourPolygon
export interface VRTour {
  id: string;
  label: string;
  url: string;
  position: [number, number];
}

export interface Floor {
  id: string;
  name: string;
  config: {
    url: string;
    width: number;
    height: number;
  };
  units: Unit[];
  vrTours?: VRTour[];
  polygon: [number, number][];
}

export interface BuildingData {
  name: string;
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