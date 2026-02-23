/* src/utils/buildingData.ts */

import { BuildingData, Unit, Floor } from "../types/building";

/**
 * Fetches and transforms building data from static JSON assets.
 * Reconstructs the building hierarchy by mapping units to floors.
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

  // Map units to their floor context based on ID convention
  const unitsWithFloorContext = unitsArray.map(unit => {
    const floorId = unit.id.length >= 3 ? unit.id.charAt(0) : "0";
    const floorObj = screensJson.floors.find((f: any) => f.id === floorId);
    
    return {
      ...unit,
      floorId: floorId,
      floorName: floorObj ? floorObj.name : `Floor ${floorId}`
    };
  });

  // Reconstruct floors with their associated units
  const reconstructedFloors = screensJson.floors.map((floor: any) => ({
    ...floor,
    units: unitsWithFloorContext.filter(u => u.floorId === floor.id)
  }));

  return {
    ...configJson,
    config: {
      url: screensJson.url,
      width: screensJson.width,
      height: screensJson.height,
      floors: reconstructedFloors
    }
  };
}

/**
 * Calculates the minimum and maximum square footage from a list of units.
 */
export function getSqftRange(units: Unit[]) {
  if (units.length === 0) return { min: 0, max: 0 };
  const sqfts = units.map((u) => u.sqft || 0);
  return {
    min: Math.min(...sqfts),
    max: Math.max(...sqfts)
  };
}