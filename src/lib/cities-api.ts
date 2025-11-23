const API_BASE_URL = 'http://localhost:3000/cities';

interface CityItem {
  id: number;
  name: string;
  services?: Array<{
    id: number;
    title: string;
    type: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface CreateCityData {
  name: string;
}

interface UpdateCityData {
  name?: string;
}

class CitiesApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'CitiesApiError';
  }
}

// Mock implementation for development/demo purposes
export const citiesApi = {
  async getAll(): Promise<CityItem[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data
    return [
      {
        id: 1,
        name: "Тбилиси",
        services: [
          {
            id: 1,
            title: "Отели Тбилиси",
            type: "hotel"
          },
          {
            id: 2,
            title: "Рестораны Тбилиси",
            type: "restaurant"
          },
          {
            id: 3,
            title: "Достопримечательности Тбилиси",
            type: "attraction"
          }
        ],
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      },
      {
        id: 2,
        name: "Батуми",
        services: [
          {
            id: 4,
            title: "Отели Батуми",
            type: "hotel"
          },
          {
            id: 5,
            title: "Рестораны Батуми",
            type: "restaurant"
          }
        ],
        createdAt: "2024-01-02T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z"
      },
      {
        id: 3,
        name: "Кутаиси",
        services: [
          {
            id: 6,
            title: "Отели Кутаиси",
            type: "hotel"
          },
          {
            id: 7,
            title: "Транспорт Кутаиси",
            type: "transport"
          }
        ],
        createdAt: "2024-01-03T00:00:00.000Z",
        updatedAt: "2024-01-03T00:00:00.000Z"
      },
      {
        id: 4,
        name: "Зугдиди",
        services: [
          {
            id: 8,
            title: "Отели Зугдиди",
            type: "hotel"
          }
        ],
        createdAt: "2024-01-04T00:00:00.000Z",
        updatedAt: "2024-01-04T00:00:00.000Z"
      },
      {
        id: 5,
        name: "Гори",
        services: [
          {
            id: 9,
            title: "Отели Гори",
            type: "hotel"
          },
          {
            id: 10,
            title: "Развлечения Гори",
            type: "entertainment"
          }
        ],
        createdAt: "2024-01-05T00:00:00.000Z",
        updatedAt: "2024-01-05T00:00:00.000Z"
      }
    ];
  },

  async getById(id: number): Promise<CityItem> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mockItems = [
      {
        id: 1,
        name: "Тбилиси",
        services: [
          {
            id: 1,
            title: "Отели Тбилиси",
            description: "Лучшие отели города",
            type: "hotel",
            objects: [
              {
                id: 1,
                title: "Hilton Tbilisi",
                latitude: 41.7151,
                longitude: 44.8271
              },
              {
                id: 2,
                title: "Marriott Tbilisi",
                latitude: 41.7200,
                longitude: 44.7800
              }
            ]
          },
          {
            id: 2,
            title: "Рестораны Тбилиси",
            description: "Лучшие рестораны",
            type: "restaurant",
            objects: [
              {
                id: 3,
                title: "Restaurant A",
                latitude: 41.7250,
                longitude: 44.7900
              }
            ]
          }
        ],
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      },
      {
        id: 2,
        name: "Батуми",
        services: [
          {
            id: 4,
            title: "Отели Батуми",
            description: "Лучшие отели города",
            type: "hotel",
            objects: [
              {
                id: 4,
                title: "Sheraton Batumi",
                latitude: 41.6500,
                longitude: 41.6400
              }
            ]
          }
        ],
        createdAt: "2024-01-02T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z"
      }
    ];
    
    const item = mockItems.find(item => item.id === id);
    if (!item) {
      throw new CitiesApiError('City not found', 404);
    }
    
    return item;
  },

  async create(data: CreateCityData): Promise<CityItem> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newItem: CityItem = {
      id: Date.now(),
      name: data.name,
      services: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return newItem;
  },

  async update(id: number, data: UpdateCityData): Promise<CityItem> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedItem: CityItem = {
      id,
      name: data.name || "Updated City",
      services: [],
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: new Date().toISOString(),
    };
    
    return updatedItem;
  },

  async delete(id: number): Promise<{ message: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { message: "City deleted successfully" };
  },
}; 