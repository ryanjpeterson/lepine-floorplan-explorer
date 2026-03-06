/* src/utils/buildingData.ts */

import { BuildingData, Unit } from "../types/building";

/**
 * Fetches and transforms building data from static JSON assets.
 */
export async function fetchBuildingData(basePath: string): Promise<BuildingData> {
  const [configRes, screensRes, unitsRes] = await Promise.all([
    fetch(`${basePath}/data/config.json`),
    fetch(`${basePath}/data/screens.json`),
    fetch(`${basePath}/data/units.json`)
  ]);

  if (!configRes.ok || !screensRes.ok || !unitsRes.ok) {
    throw new Error("Failed to load building configuration files");
  }

  const configJson = await configRes.json();
  const screensJson = await screensRes.json();
  const unitsArray: Unit[] = await unitsRes.json();

  const unitsWithFloorContext = unitsArray.map(unit => {
    const floorId = unit.id.length >= 3 ? unit.id.charAt(0) : "0";
    const floorObj = screensJson.floors.find((f: any) => f.id === floorId);
    return {
      ...unit,
      floorId: floorId,
      floorName: floorObj ? floorObj.name : `Floor ${floorId}`
    };
  }).sort((a, b) => 
    a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' })
  );;

  const reconstructedFloors = screensJson.floors.map((floor: any) => ({
    ...floor,
    units: unitsWithFloorContext.filter(u => u.floorId === floor.id)
  }));

  return {
    name: configJson.name,
    logo: configJson.logo,
    address: configJson.address,
    portalId: configJson.portalId,
    formId: configJson.formId,
    config: {
      views: screensJson.views || [],
      floors: reconstructedFloors,
      modelUrl: configJson.modelUrl,
      camera: configJson.camera
    }
  };
}

export function getSqftRange(units: Unit[]) {
  if (units.length === 0) return { min: 0, max: 0 };
  const sqfts = units.map((u) => u.sqft || 0);
  return {
    min: Math.min(...sqfts),
    max: Math.max(...sqfts)
  };
}