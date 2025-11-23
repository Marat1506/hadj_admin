interface ServiceItem {
  id: number;
  cityId: number;
  title: string;
  description?: string;
  type: string;
  city?: {
    id: number;
    name: string;
  };
  objects?: Array<{
    id: number;
    title: string;
    latitude?: number;
    longitude?: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface CreateServiceData {
  cityId: number;
  title: string;
  description?: string;
  type: string;
}

interface UpdateServiceData {
  title?: string;
  description?: string;
  type?: string;
  cityId?: number;
}

class ServicesApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ServicesApiError';
  }
}

// Mock implementation for development/demo purposes
export const servicesApi = {
  async getAll(): Promise<ServiceItem[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return mock data
    return [
      {
        id: 1,
        cityId: 1,
        title: "Отели Тбилиси",
        description: "Лучшие отели города",
        type: "hotel",
        city: {
          id: 1,
          name: "Тбилиси"
        },
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
        ],
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      },
      {
        id: 2,
        cityId: 1,
        title: "Рестораны Тбилиси",
        description: "Лучшие рестораны",
        type: "restaurant",
        city: {
          id: 1,
          name: "Тбилиси"
        },
        objects: [
          {
            id: 3,
            title: "Restaurant A",
            latitude: 41.7250,
            longitude: 44.7900
          }
        ],
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      },
      {
        id: 3,
        cityId: 1,
        title: "Достопримечательности Тбилиси",
        description: "Интересные места города",
        type: "attraction",
        city: {
          id: 1,
          name: "Тбилиси"
        },
        objects: [
          {
            id: 4,
            title: "Old Town",
            latitude: 41.7151,
            longitude: 44.8271
          }
        ],
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      },
      {
        id: 4,
        cityId: 2,
        title: "Отели Батуми",
        description: "Лучшие отели города",
        type: "hotel",
        city: {
          id: 2,
          name: "Батуми"
        },
        objects: [
          {
            id: 5,
            title: "Sheraton Batumi",
            latitude: 41.6500,
            longitude: 41.6400
          }
        ],
        createdAt: "2024-01-02T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z"
      },
      {
        id: 5,
        cityId: 2,
        title: "Рестораны Батуми",
        description: "Лучшие рестораны",
        type: "restaurant",
        city: {
          id: 2,
          name: "Батуми"
        },
        objects: [
          {
            id: 6,
            title: "Restaurant B",
            latitude: 41.6550,
            longitude: 41.6450
          }
        ],
        createdAt: "2024-01-02T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z"
      },
      {
        id: 6,
        cityId: 3,
        title: "Отели Кутаиси",
        description: "Лучшие отели города",
        type: "hotel",
        city: {
          id: 3,
          name: "Кутаиси"
        },
        objects: [
          {
            id: 7,
            title: "Hotel Kutaisi",
            latitude: 42.2700,
            longitude: 42.7000
          }
        ],
        createdAt: "2024-01-03T00:00:00.000Z",
        updatedAt: "2024-01-03T00:00:00.000Z"
      },
      {
        id: 7,
        cityId: 3,
        title: "Транспорт Кутаиси",
        description: "Общественный транспорт",
        type: "transport",
        city: {
          id: 3,
          name: "Кутаиси"
        },
        objects: [
          {
            id: 8,
            title: "Bus Station",
            latitude: 42.2750,
            longitude: 42.7050
          }
        ],
        createdAt: "2024-01-03T00:00:00.000Z",
        updatedAt: "2024-01-03T00:00:00.000Z"
      }
    ];
  },

  async getById(id: number): Promise<ServiceItem> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const mockItems = [
      {
        id: 1,
        cityId: 1,
        title: "Отели Тбилиси",
        description: "Лучшие отели города",
        type: "hotel",
        city: {
          id: 1,
          name: "Тбилиси"
        },
        objects: [
          {
            id: 1,
            title: "Hilton Tbilisi",
            latitude: 41.7151,
            longitude: 44.8271
          }
        ],
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      }
    ];

    const item = mockItems.find(item => item.id === id);
    if (!item) {
      throw new ServicesApiError('Service not found', 404);
    }

    return item;
  },

  async getByCity(cityId: number): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const allServices = [
      {
        id: 1,
        cityId: 1,
        title: "Отели Тбилиси",
        description: "Лучшие отели города",
        type: "hotel",
        objects: [
          {
            id: 1,
            title: "Hilton Tbilisi",
            latitude: 41.7151,
            longitude: 44.8271
          }
        ]
      },
      {
        id: 2,
        cityId: 1,
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
    ];

    return allServices.filter(service => service.cityId === cityId);
  },

  async getByType(type: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const allServices = [
      {
        id: 1,
        cityId: 1,
        title: "Отели Тбилиси",
        description: "Лучшие отели города",
        type: "hotel",
        city: {
          id: 1,
          name: "Тбилиси"
        },
        objects: [
          {
            id: 1,
            title: "Hilton Tbilisi",
            latitude: 41.7151,
            longitude: 44.8271
          }
        ]
      },
      {
        id: 4,
        cityId: 2,
        title: "Отели Батуми",
        description: "Лучшие отели города",
        type: "hotel",
        city: {
          id: 2,
          name: "Батуми"
        },
        objects: [
          {
            id: 5,
            title: "Sheraton Batumi",
            latitude: 41.6500,
            longitude: 41.6400
          }
        ]
      }
    ];

    return allServices.filter(service => service.type === type);
  },

  async create(data: CreateServiceData): Promise<ServiceItem> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newItem: ServiceItem = {
      id: Date.now(),
      cityId: data.cityId,
      title: data.title,
      description: data.description,
      type: data.type,
      city: {
        id: data.cityId,
        name: "Mock City"
      },
      objects: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return newItem;
  },

  async update(id: number, data: UpdateServiceData): Promise<ServiceItem> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const updatedItem: ServiceItem = {
      id,
      cityId: data.cityId || 1,
      title: data.title || "Updated Service",
      description: data.description,
      type: data.type || "other",
      city: {
        id: data.cityId || 1,
        name: "Mock City"
      },
      objects: [],
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: new Date().toISOString(),
    };

    return updatedItem;
  },

  async delete(id: number): Promise<{ message: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { message: "Service deleted successfully" };
  },
};
