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
  virtualTour?: string;
  [key: string]: any; 
}

export interface Amenity {
  id: string;
  image: string;
}

export interface Floor {
  id: string;
  name: string;
  config: FloorConfig;
  units: Unit[];
  label: string;
  centers: Record<string, [number, number]>; // View-specific coordinates
}

export interface BuildingView {
  id: string;
  label: string;
  url: string;
  width: number;
  height: number;
}

export interface CameraConfig {
  position: [number, number, number];
  minDistance: number;
  maxDistance: number;
}

export interface BuildingData {
  name: string;
  logo: string;
  address: string;
  portalId?: string;
  formId?: string;
  config: {
    views: BuildingView[];
    floors: Floor[];
    modelUrl?: string;
    camera?: CameraConfig;
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

export interface CommercialItem {
  id: string;
  name: string;
  description: string;
  image: string;
  website: string | null;
}