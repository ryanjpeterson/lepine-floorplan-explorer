/**
 * Import building data from JSON file into Strapi
 * Run with: npm run strapi script scripts/import-building-data.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const buildingData = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../../frontend/public/data/building.json'),
    'utf-8'
  )
);

export default async ({ strapi }) => {
  console.log('Starting data import...');

  try {
    // Create Building
    const building = await strapi.entityService.create('api::building.building', {
      data: {
        name: buildingData.name,
        address: buildingData.address,
        config: buildingData.config,
        publishedAt: new Date(),
      },
    });

    console.log(`Created building: ${building.name}`);

    // Create Floors, Units, and VR Tours
    for (const floorData of buildingData.config.floors) {
      const floor = await strapi.entityService.create('api::floor.floor', {
        data: {
          floorId: floorData.id,
          name: floorData.name,
          polygon: floorData.polygon,
          config: floorData.config,
          building: building.id,
          publishedAt: new Date(),
        },
      });

      console.log(`Created floor: ${floor.name}`);

      // Create VR Tours for this floor
      if (floorData.vrTours) {
        for (const vrTourData of floorData.vrTours) {
          const vrTour = await strapi.entityService.create('api::vr-tour.vr-tour', {
            data: {
              tourId: vrTourData.id,
              label: vrTourData.label,
              position: vrTourData.position,
              url: vrTourData.url,
              floor: floor.id,
              publishedAt: new Date(),
            },
          });

          console.log(`  Created VR tour: ${vrTour.label}`);
        }
      }

      // Create Units for this floor
      if (floorData.units) {
        for (const unitData of floorData.units) {
          const unit = await strapi.entityService.create('api::unit.unit', {
            data: {
              unitId: unitData.unitId,
              title: unitData.title,
              type: unitData.type,
              model: unitData.model,
              sqft: unitData.sqft,
              numOfBeds: unitData.numOfBeds,
              numOfBaths: unitData.numOfBaths,
              balcony: unitData.balcony,
              tub: unitData.tub,
              pantry: unitData.pantry,
              terrace: unitData.terrace,
              officeDen: unitData.officeDen,
              walkInCloset: unitData.walkInCloset,
              barrierFree: unitData.barrierFree,
              builtIns: unitData.builtIns,
              juliet: unitData.juliet,
              modelSuite: unitData.modelSuite,
              isFeatured: unitData.isFeatured,
              image: unitData.image,
              gallery: unitData.gallery,
              pdf: unitData.pdf,
              property: unitData.property,
              status: unitData.status,
              onHoldExpires: unitData.onHoldExpires,
              polygon: unitData.polygon,
              description: unitData.description,
              floor: floor.id,
              publishedAt: new Date(),
            },
          });

          console.log(`  Created unit: ${unit.title}`);
        }
      }
    }

    console.log('Data import completed successfully!');
  } catch (error) {
    console.error('Error importing data:', error);
    throw error;
  }
};
