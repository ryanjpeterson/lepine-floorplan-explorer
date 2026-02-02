# Migration Guide: From Static JSON to Strapi Backend

This guide will help you transition from using the static `building.json` file to the new Strapi-powered backend.

## Overview of Changes

### Before
- Single `building.json` file in `public/data/`
- Data changes required editing JSON manually
- No admin interface
- Single building only

### After
- Strapi CMS with admin panel
- PostgreSQL database
- RESTful API
- Support for multiple buildings
- Easy content management UI

## Step-by-Step Migration

### 1. Start the Backend

First, start PostgreSQL and Strapi:

```bash
# Option A: Using Docker (Recommended)
docker-compose up -d postgres backend

# Option B: Manual setup
# Ensure PostgreSQL is running, then:
cd backend
npm install
npm run develop
```

### 2. Create Admin User

1. Go to http://localhost:1337/admin
2. Create your admin account
3. You'll be redirected to the Strapi dashboard

### 3. Import Existing Data

Run the import script to migrate data from `building.json`:

```bash
cd backend
npm run import-data
```

This will create:
- 1 Building entry
- 7 Floor entries
- All Unit entries
- All VR Tour entries

### 4. Configure API Permissions

To allow the frontend to access the data:

1. Go to **Settings** → **Users & Permissions** → **Roles** → **Public**
2. Enable the following permissions:
   - **Building**: `find`, `findOne`
   - **Floor**: `find`, `findOne`
   - **Unit**: `find`, `findOne`
   - **VR-tour**: `find`, `findOne`
3. Click **Save**

### 5. Update Frontend Code

The frontend needs to be updated to fetch data from Strapi instead of the static JSON file. Here's how:

#### Option A: Use the New API Service

Import and use the pre-built API service:

```typescript
import { api } from '@/services/api';

// In your component or context
const fetchBuildingData = async () => {
  try {
    // Get building with all floors, units, and VR tours
    const buildings = await api.buildings.getAll();
    const building = buildings[0]; // Get first building

    // Or get by ID
    const building = await api.buildings.getById(1);

    // The data structure is similar to the old building.json
    console.log(building);
  } catch (error) {
    console.error('Error fetching building data:', error);
  }
};
```

#### Option B: Manual Fetch

```typescript
const fetchBuildingData = async () => {
  const response = await fetch(
    'http://localhost:1337/api/buildings?populate[floors][populate]=units,vrTours'
  );
  const { data } = await response.json();

  // Transform Strapi format to match old structure
  const building = {
    id: data[0].id,
    ...data[0].attributes,
  };
};
```

### 6. Update BuildingContext

If you're using a context provider, update it to fetch from Strapi:

```typescript
// frontend/src/context/BuildingContext.tsx

import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/services/api';

export const BuildingContext = createContext<any>(null);

export const BuildingProvider = ({ children }) => {
  const [building, setBuilding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const buildings = await api.buildings.getAll();
        setBuilding(buildings[0]); // Use first building
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <BuildingContext.Provider value={{ building, loading, error }}>
      {children}
    </BuildingContext.Provider>
  );
};
```

### 7. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Access at http://localhost:5173

## Data Structure Comparison

### Old Structure (building.json)
```json
{
  "name": "1642 Lépine Blvd",
  "address": "Ottawa, Ontario",
  "config": { "width": 3840, "height": 2160, "url": "/assets/building.jpg" },
  "config": {
    "floors": [
      {
        "id": "1",
        "name": "1st Floor",
        "units": [...]
      }
    ]
  }
}
```

### New Structure (Strapi API Response)
```json
{
  "data": {
    "id": 1,
    "attributes": {
      "name": "1642 Lépine Blvd",
      "address": "Ottawa, Ontario",
      "config": { "width": 3840, "height": 2160, "url": "/assets/building.jpg" },
      "floors": {
        "data": [
          {
            "id": 1,
            "attributes": {
              "floorId": "1",
              "name": "1st Floor",
              "units": { "data": [...] }
            }
          }
        ]
      }
    }
  }
}
```

The API service in `frontend/src/services/api.ts` automatically flattens this structure for easier use.

## Managing Content

### Adding a New Unit

1. Go to **Content Manager** → **Unit** → **Create new entry**
2. Fill in all fields:
   - Unit ID (e.g., "108")
   - Title (e.g., "Unit 108")
   - Type, Model, Size, Beds, Baths
   - Amenities (checkboxes)
   - Status (dropdown)
   - Polygon coordinates
   - Select the Floor
3. Click **Save** then **Publish**

### Updating Unit Status/Pricing

1. Go to **Content Manager** → **Unit**
2. Find and click the unit to edit
3. Update fields (status, price, etc.)
4. Click **Save** then **Publish**

Changes are immediately available via the API!

### Adding a New Building

1. Go to **Content Manager** → **Building** → **Create new entry**
2. Enter building details
3. Create floors for the building
4. Add units to each floor
5. Publish everything

## Testing the Integration

### Test API Endpoints

```bash
# Get all buildings
curl http://localhost:1337/api/buildings?populate=*

# Get units with filters
curl "http://localhost:1337/api/units?filters[status][$eq]=Available"

# Get specific floor with units
curl http://localhost:1337/api/floors/1?populate=units,vrTours
```

### Verify Frontend

1. Open http://localhost:5173
2. Check browser console for errors
3. Verify building map loads
4. Check that units display correctly
5. Test filtering and unit details

## Rollback (If Needed)

If you need to temporarily rollback to the old JSON-based system:

1. Update your BuildingContext to use the static import again:
```typescript
import buildingData from '../public/data/building.json';
```

2. The original `building.json` file is still in `frontend/public/data/`

## Troubleshooting

### "Cannot connect to database"
- Check PostgreSQL is running
- Verify credentials in `backend/.env`
- Ensure database `lepine_floorplan` exists

### "API returns 403 Forbidden"
- Check API permissions in Strapi admin
- Public role must have `find` and `findOne` enabled

### "No data returned from API"
- Ensure you ran the import script
- Check data exists in Strapi admin panel
- Verify API URL in frontend `.env`

### "CORS errors in browser"
- Strapi should allow localhost by default
- Check `backend/config/middlewares.ts` if issues persist

## Next Steps

1. Remove static `building.json` references from frontend code
2. Update any hardcoded URLs to use environment variables
3. Set up staging/production environments
4. Configure proper authentication for admin panel
5. Set up automated backups for PostgreSQL database

## Questions?

Refer to the main README.md for detailed documentation, or check:
- [Strapi Documentation](https://docs.strapi.io)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
