# Lépine Floorplan Explorer

A modern full-stack application for exploring building floorplans with interactive maps, unit details, and virtual tours.

## Architecture

This project is split into two main parts:

```
lepine-floorplan-explorer/
├── frontend/          # React + Vite + TypeScript frontend
├── backend/           # Strapi CMS + PostgreSQL backend
├── docker-compose.yml # Docker orchestration for all services
└── README.md
```

### Frontend

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **UI Library**: TailwindCSS
- **Mapping**: Leaflet + React Leaflet
- **Routing**: React Router v7

The frontend is a headless template that fetches all data from the Strapi backend API.

### Backend

- **CMS**: Strapi v5 (TypeScript)
- **Database**: PostgreSQL 16
- **Features**:
  - RESTful API
  - Admin panel for content management
  - Role-based access control
  - Multi-building support

## Content Structure

### Data Models

1. **Building**
   - name, address, config (image dimensions/URL)
   - One-to-many relationship with Floors

2. **Floor**
   - floorId, name, polygon coordinates, config
   - Belongs to a Building
   - One-to-many relationship with Units and VR Tours

3. **Unit**
   - All property details (size, beds, baths, amenities)
   - Status (Available, Leased, On Hold, Reserved)
   - Pricing, images, PDF floorplans
   - Polygon coordinates for interactive map
   - Belongs to a Floor

4. **VR Tour**
   - Virtual tour links for floors
   - Position coordinates on floorplan
   - Belongs to a Floor

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- Docker and Docker Compose (recommended)
- PostgreSQL 16 (if not using Docker)

### Quick Start with Docker

1. Start all services (PostgreSQL, Backend, Frontend):

```bash
docker-compose up -d
```

2. Access the applications:
   - Frontend: http://localhost:5173
   - Strapi Admin: http://localhost:1337/admin
   - Strapi API: http://localhost:1337/api

3. Create your first Strapi admin user at http://localhost:1337/admin

4. Import existing building data:

```bash
cd backend
npm run strapi script scripts/import-building-data.ts
```

### Manual Setup (Without Docker)

#### Backend Setup

1. Start PostgreSQL (ensure it's running on port 5432)

2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Configure environment variables in `backend/.env`:

```env
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=lepine_floorplan
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi
```

4. Start the Strapi backend:

```bash
npm run develop
```

5. Create admin user at http://localhost:1337/admin

6. Import initial data:

```bash
npm run strapi script scripts/import-building-data.ts
```

7. Configure API permissions:
   - Go to Settings → Users & Permissions → Roles → Public
   - Enable `find` and `findOne` for Building, Floor, Unit, and VR Tour

#### Frontend Setup

1. Install frontend dependencies:

```bash
cd frontend
npm install
```

2. Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:1337
```

3. Start the frontend dev server:

```bash
npm run dev
```

4. Access at http://localhost:5173

## Managing Content

### Strapi Admin Panel

Access the Strapi admin panel at http://localhost:1337/admin to:

- Add/edit/delete buildings
- Manage floors and units
- Update pricing and availability
- Upload images and documents
- Configure VR tour links

### Quick Content Updates

To update unit availability or pricing:

1. Go to Strapi Admin → Content Manager → Units
2. Find the unit you want to update
3. Change status (Available/Leased/On Hold/Reserved)
4. Update price if needed
5. Save and publish

The changes will be immediately reflected on the frontend.

## API Endpoints

All endpoints are available at `http://localhost:1337/api`:

- `GET /api/buildings` - List all buildings
- `GET /api/buildings/:id` - Get building details with floors
- `GET /api/floors` - List all floors
- `GET /api/floors/:id` - Get floor details with units
- `GET /api/units` - List all units (with filters)
- `GET /api/units/:id` - Get unit details
- `GET /api/vr-tours` - List all VR tours

### Populating Relations

To include related data, use the `populate` query parameter:

```
GET /api/buildings?populate[floors][populate]=units
GET /api/floors/:id?populate=units,vrTours
```

## Development

### Frontend Development

```bash
cd frontend
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend Development

```bash
cd backend
npm run develop  # Start with auto-reload
npm run build    # Build admin panel
npm run start    # Production mode
```

## Production Deployment

### Environment Variables

Configure these for production:

**Backend (.env)**:
```env
NODE_ENV=production
HOST=0.0.0.0
PORT=1337
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://user:pass@host:5432/dbname
APP_KEYS=generate-secure-keys
API_TOKEN_SALT=generate-secure-salt
ADMIN_JWT_SECRET=generate-secure-secret
TRANSFER_TOKEN_SALT=generate-secure-salt
ENCRYPTION_KEY=generate-secure-key
```

**Frontend (.env)**:
```env
VITE_API_URL=https://your-backend-domain.com
```

### Build Steps

1. Build backend:
```bash
cd backend
npm run build
```

2. Build frontend:
```bash
cd frontend
npm run build
# Output in frontend/dist/
```

3. Deploy using your preferred hosting platform (Vercel, Netlify, AWS, etc.)

## Multi-Building Support

The architecture supports multiple buildings:

1. Add new buildings via Strapi admin
2. Create floors and units for each building
3. Frontend can display different buildings based on route or selection
4. Each building maintains its own floors, units, and VR tours

## Troubleshooting

### Database Connection Issues

If Strapi can't connect to PostgreSQL:
- Ensure PostgreSQL is running
- Check credentials in `backend/.env`
- Verify database exists: `psql -U strapi -d lepine_floorplan`

### Frontend API Errors

If frontend can't fetch data:
- Ensure backend is running on port 1337
- Check API permissions in Strapi admin (Public role)
- Verify `VITE_API_URL` in frontend `.env`

### Import Script Fails

If data import fails:
- Ensure Strapi is running
- Check that content types are created (should auto-create on first run)
- Verify `building.json` exists in `frontend/public/data/`

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

Proprietary - All rights reserved
