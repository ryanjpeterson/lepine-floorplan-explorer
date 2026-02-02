/**
 * API Service for communicating with Strapi backend
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';
const API_BASE = `${API_URL}/api`;

interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface StrapiEntity<T> {
  id: number;
  attributes: T;
}

/**
 * Generic fetch wrapper for Strapi API calls
 */
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Transform Strapi entity to flat structure
 */
function transformEntity<T>(entity: StrapiEntity<T>): T & { id: number } {
  return {
    id: entity.id,
    ...entity.attributes,
  };
}

/**
 * Transform array of Strapi entities
 */
function transformEntities<T>(
  entities: StrapiEntity<T>[]
): (T & { id: number })[] {
  return entities.map(transformEntity);
}

/**
 * Buildings API
 */
export const buildingsAPI = {
  /**
   * Get all buildings
   */
  async getAll() {
    const response = await fetchAPI<StrapiResponse<StrapiEntity<any>[]>>(
      '/buildings?populate[floors][populate]=units,vrTours'
    );
    return transformEntities(response.data);
  },

  /**
   * Get a single building by ID
   */
  async getById(id: number | string) {
    const response = await fetchAPI<StrapiResponse<StrapiEntity<any>>>(
      `/buildings/${id}?populate[floors][populate]=units,vrTours`
    );
    return transformEntity(response.data);
  },

  /**
   * Get a building by slug
   */
  async getBySlug(slug: string) {
    const response = await fetchAPI<StrapiResponse<StrapiEntity<any>[]>>(
      `/buildings?filters[slug][$eq]=${slug}&populate[floors][populate]=units,vrTours`
    );
    return response.data.length > 0 ? transformEntity(response.data[0]) : null;
  },
};

/**
 * Floors API
 */
export const floorsAPI = {
  /**
   * Get all floors
   */
  async getAll(buildingId?: number | string) {
    const filter = buildingId ? `?filters[building][id][$eq]=${buildingId}&` : '?';
    const response = await fetchAPI<StrapiResponse<StrapiEntity<any>[]>>(
      `/floors${filter}populate=units,vrTours`
    );
    return transformEntities(response.data);
  },

  /**
   * Get a single floor by ID
   */
  async getById(id: number | string) {
    const response = await fetchAPI<StrapiResponse<StrapiEntity<any>>>(
      `/floors/${id}?populate=units,vrTours`
    );
    return transformEntity(response.data);
  },
};

/**
 * Units API
 */
export const unitsAPI = {
  /**
   * Get all units
   */
  async getAll(filters?: {
    floorId?: number | string;
    status?: string;
    minBeds?: number;
    maxBeds?: number;
    minBaths?: number;
    maxBaths?: number;
    minSqft?: number;
    maxSqft?: number;
  }) {
    let query = '/units?';

    if (filters) {
      if (filters.floorId) {
        query += `filters[floor][id][$eq]=${filters.floorId}&`;
      }
      if (filters.status) {
        query += `filters[status][$eq]=${filters.status}&`;
      }
      if (filters.minBeds !== undefined) {
        query += `filters[numOfBeds][$gte]=${filters.minBeds}&`;
      }
      if (filters.maxBeds !== undefined) {
        query += `filters[numOfBeds][$lte]=${filters.maxBeds}&`;
      }
      if (filters.minBaths !== undefined) {
        query += `filters[numOfBaths][$gte]=${filters.minBaths}&`;
      }
      if (filters.maxBaths !== undefined) {
        query += `filters[numOfBaths][$lte]=${filters.maxBaths}&`;
      }
      if (filters.minSqft !== undefined) {
        query += `filters[sqft][$gte]=${filters.minSqft}&`;
      }
      if (filters.maxSqft !== undefined) {
        query += `filters[sqft][$lte]=${filters.maxSqft}&`;
      }
    }

    const response = await fetchAPI<StrapiResponse<StrapiEntity<any>[]>>(query);
    return transformEntities(response.data);
  },

  /**
   * Get a single unit by ID
   */
  async getById(id: number | string) {
    const response = await fetchAPI<StrapiResponse<StrapiEntity<any>>>(
      `/units/${id}`
    );
    return transformEntity(response.data);
  },

  /**
   * Get a unit by unitId
   */
  async getByUnitId(unitId: string) {
    const response = await fetchAPI<StrapiResponse<StrapiEntity<any>[]>>(
      `/units?filters[unitId][$eq]=${unitId}`
    );
    return response.data.length > 0 ? transformEntity(response.data[0]) : null;
  },
};

/**
 * VR Tours API
 */
export const vrToursAPI = {
  /**
   * Get all VR tours
   */
  async getAll(floorId?: number | string) {
    const filter = floorId ? `?filters[floor][id][$eq]=${floorId}` : '';
    const response = await fetchAPI<StrapiResponse<StrapiEntity<any>[]>>(
      `/vr-tours${filter}`
    );
    return transformEntities(response.data);
  },

  /**
   * Get a single VR tour by ID
   */
  async getById(id: number | string) {
    const response = await fetchAPI<StrapiResponse<StrapiEntity<any>>>(
      `/vr-tours/${id}`
    );
    return transformEntity(response.data);
  },
};

/**
 * Export all APIs as a single object
 */
export const api = {
  buildings: buildingsAPI,
  floors: floorsAPI,
  units: unitsAPI,
  vrTours: vrToursAPI,
};

export default api;
