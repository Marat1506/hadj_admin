import { API } from "@/lib/api";

const API_BASE_URL = "http://localhost:3000";

interface CityItem {
	id: number;
	name: string;
	createdAt: string;
	updatedAt: string;
}

interface ServiceItem {
	id: number;
	cityId: number;
	title: any;
	description?: string;
	type: string;
	createdAt: string;
	updatedAt: string;
}

interface ObjectItem {
	id: number;
	serviceId: number;
	title: string;
	latitude?: number;
	longitude?: number;
	createdAt: string;
	updatedAt: string;
}

interface AddressItem {
	id: number;
	objectId: number;
	title: string;
	address: string;
	phone?: string;
	email?: string;
	website?: string;
	description?: string;
	createdAt: string;
	updatedAt: string;
}

interface CreateCityData {
	name: string;
}

interface UpdateCityData {
	name?: string;
}

interface CreateServiceData {
	cityId: number;
	title?: string;
	description?: string;
	type: string;
}

interface UpdateServiceData {
	title?: string;
	description?: string;
	type?: string;
	cityId?: number;
}

interface CreateObjectData {
	serviceId: number;
	title: string;
	latitude?: number;
	longitude?: number;
}

interface UpdateObjectData {
	title?: string;
	latitude?: number;
	longitude?: number;
	serviceId?: number;
}

interface CreateAddressData {
	objectId: number;
	title: string;
	address: string;
	phone?: string;
	email?: string;
	website?: string;
	description?: string;
}

interface UpdateAddressData {
	title?: string;
	address?: string;
	phone?: string;
	email?: string;
	website?: string;
	description?: string;
	objectId?: number;
}

class NavigationApiError extends Error {
	constructor(
		message: string,
		public status?: number
	) {
		super(message);
		this.name = "NavigationApiError";
	}
}

// Mock implementation for development/demo purposes
export const navigationApi = {
	// Cities
	async getCities() {
		try {
			const { data } = await API.get("/cities");
			return data;
		} catch (error) {
			console.error("Error fetching city data:", error);
		}
	},

	async createCity(newsData: CreateCityData) {
		try {
			const { data } = await API.post("/cities", newsData);
			return data;
		} catch (error: any) {
			console.error("Error creating city:", error);
		}
	},

	async updateCity(id: number, payload: any) {
		try {
			const { data } = await API.patch(`/cities/${id}`, payload, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return data;
		} catch (error: any) {
			console.error(`Error updating city item with id ${id}:`, error);
		}
	},

	async deleteCity(id: number) {
		try {
			const { data } = await API.delete(`/cities/${id}`);
			return data;
		} catch (error: any) {
			console.error(`Error deleting city item with id ${id}:`, error);
		}
	},

	// Services
	async getServicesByCity(cityId: number | string) {
		try {
			const { data } = await API.get(`/services/city/${cityId}`);
			return data;
		} catch (error: any) {
			console.error("Error service:", error);
		}
	},

  async getServicesById(id: number | string) {
		try {
			const { data } = await API.get(`/services/${id}`);
			return data;
		} catch (error: any) {
			console.error("Error service:", error);
		}
	},

	async createService(payload: CreateServiceData) {
		try {
			const { data } = await API.post("/services", payload);
			return data;
		} catch (error: any) {
			console.error("Error creating service:", error);
		}
	},

	async updateService(id: number, payload: UpdateServiceData) {
		try {
			const { data } = await API.patch(`/services/${id}`, payload);
			return data;
		} catch (error: any) {
			console.error("Error updating service:", error);
		}
	},

	async deleteService(id: number) {
		try {
			const { data } = await API.delete(`/services/${id}`);
			return data;
		} catch (error: any) {
			console.error("Error deleteing service:", error);
		}
	},

	// Objects
	async getObjectsByService(serviceId: number | string) {
		try {
			const { data } = await API.get(`/objects/service/${serviceId}`);
			return data;
		} catch (error: any) {
			console.error("Error creating service:", error);
		}
	},

	async createObject(payload: CreateObjectData) {
    try {
      const { data } = await API.post("/objects", payload);
      return data;
    } catch (error: any) {
      console.error("Error creating object:", error);
    }
	},

	async updateObject(id: number, payload: UpdateObjectData) {
    try {
      const { data } = await API.patch(`/objects/${id}`, payload);
      return data;
    } catch (error: any) {
      console.error("Error updating object:", error);
    }
	},

	async deleteObject(id: number) {
    try {
      const { data } = await API.delete(`/objects/${id}`);
      return data;
    } catch (error: any) {
      console.error("Error deleteing service:", error);
    }
	},

	// Addresses
	async getAddresses(): Promise<AddressItem[]> {
		await new Promise((resolve) => setTimeout(resolve, 500));

		return [
			{
				id: 1,
				objectId: 1,
				title: "Главный офис Hilton",
				address: "ул. Тависуплеба, 1, Тбилиси, Грузия",
				phone: "+995 32 123 4567",
				email: "info@hilton-tbilisi.ge",
				website: "https://hilton-tbilisi.ge",
				description: "Главный офис отеля Hilton в центре Тбилиси",
				createdAt: "2024-01-01T00:00:00.000Z",
				updatedAt: "2024-01-01T00:00:00.000Z",
			},
			{
				id: 2,
				objectId: 1,
				title: "Филиал Hilton - Аэропорт",
				address: "Тбилисский международный аэропорт, Тбилиси, Грузия",
				phone: "+995 32 123 4568",
				email: "airport@hilton-tbilisi.ge",
				website: "https://hilton-tbilisi-airport.ge",
				description: "Филиал отеля Hilton в аэропорту Тбилиси",
				createdAt: "2024-01-01T00:00:00.000Z",
				updatedAt: "2024-01-01T00:00:00.000Z",
			},
			{
				id: 3,
				objectId: 2,
				title: "Marriott Tbilisi - Центр",
				address: "пр. Руставели, 13, Тбилиси, Грузия",
				phone: "+995 32 234 5678",
				email: "info@marriott-tbilisi.ge",
				website: "https://marriott-tbilisi.ge",
				description: "Отель Marriott в центре Тбилиси на проспекте Руставели",
				createdAt: "2024-01-01T00:00:00.000Z",
				updatedAt: "2024-01-01T00:00:00.000Z",
			},
			{
				id: 4,
				objectId: 3,
				title: "Restaurant A - Старый город",
				address: "ул. Шавтели, 5, Тбилиси, Грузия",
				phone: "+995 32 345 6789",
				email: "info@restaurant-a.ge",
				website: "https://restaurant-a.ge",
				description: "Ресторан в историческом центре Тбилиси",
				createdAt: "2024-01-01T00:00:00.000Z",
				updatedAt: "2024-01-01T00:00:00.000Z",
			},
			{
				id: 5,
				objectId: 5,
				title: "Sheraton Batumi - Набережная",
				address: "ул. Ниношвили, 28, Батуми, Грузия",
				phone: "+995 422 123 456",
				email: "info@sheraton-batumi.ge",
				website: "https://sheraton-batumi.ge",
				description: "Отель Sheraton на набережной Батуми",
				createdAt: "2024-01-02T00:00:00.000Z",
				updatedAt: "2024-01-02T00:00:00.000Z",
			},
		];
	},

	async createAddress(data: CreateAddressData): Promise<AddressItem> {
		await new Promise((resolve) => setTimeout(resolve, 1000));

		const newAddress: AddressItem = {
			id: Date.now(),
			objectId: data.objectId,
			title: data.title,
			address: data.address,
			phone: data.phone,
			email: data.email,
			website: data.website,
			description: data.description,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		console.log("Address created:", newAddress);

		return newAddress;
	},

	async updateAddress(id: number, data: UpdateAddressData): Promise<AddressItem> {
		await new Promise((resolve) => setTimeout(resolve, 1000));

		const updatedAddress: AddressItem = {
			id,
			objectId: data.objectId || 1,
			title: data.title || "Updated Address",
			address: data.address || "Updated Address",
			phone: data.phone,
			email: data.email,
			website: data.website,
			description: data.description,
			createdAt: "2024-01-01T00:00:00.000Z",
			updatedAt: new Date().toISOString(),
		};

		console.log("Address updated:", updatedAddress);

		return updatedAddress;
	},

	async deleteAddress(id: number): Promise<{ message: string }> {
		await new Promise((resolve) => setTimeout(resolve, 500));
		return { message: "Address deleted successfully" };
	},
};
