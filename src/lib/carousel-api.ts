import { API } from "@/lib/api";

interface CarouselItem {
	id: number;
	title: string;
	link?: string;
	image: string;
	createdAt: string;
	updatedAt: string;
}

interface CreateCarouselData {
	title: string;
	link?: string;
	photo: File;
}

interface UpdateCarouselData {
	title?: string;
	link?: string;
	image?: File;
}

class CarouselApiError extends Error {
	constructor(
		message: string,
		public status?: number
	) {
		super(message);
		this.name = "CarouselApiError";
	}
}

export const carouselApi = {
	async getAll(): Promise<CarouselItem[]> {
		try {
			// Добавляем timestamp для предотвращения кэширования
			const { data } = await API.get("/carousel", {
				params: { _t: Date.now() }
			});
			return data;
		} catch (error) {
			console.error("Error fetching carousel data:", error);
			throw new CarouselApiError("Failed to fetch carousel items", 500);
		}
	},

	async getById(id: number): Promise<CarouselItem> {
		try {
			const { data } = await API.get(`/carousel/${id}`);
			return data;
		} catch (error: any) {
			if (error.response?.status === 404) {
				throw new CarouselApiError("Carousel item not found", 404);
			}
			console.error(`Error fetching carousel item with id ${id}:`, error);
			throw new CarouselApiError("Failed to fetch carousel item", 500);
		}
	},

	async create(dataCarousel: CreateCarouselData): Promise<CarouselItem> {
		const formData = new FormData();
		formData.append("title", dataCarousel.title);

		if (dataCarousel.link) {
			formData.append("link", dataCarousel.link);
		}

		if (dataCarousel.photo) {
			formData.append("photo", dataCarousel.photo);
		}

		try {
			const { data } = await API.post("/carousel", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return data;
		} catch (error) {
			console.error("Error creating carousel:", error);
			throw new CarouselApiError("Failed to create carousel item", 500);
		}
	},

	async update(id: number, updateData: UpdateCarouselData): Promise<CarouselItem> {
		const formData = new FormData();

		if (updateData.title) {
			formData.append("title", updateData.title);
		}

		if (updateData.link !== undefined) {
			formData.append("link", updateData.link || "");
		}

		if (updateData.image) {
			formData.append("photo", updateData.image);
		}

		try {
			const { data } = await API.put(`/carousel/${id}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return data;
		} catch (error: any) {
			if (error.response?.status === 404) {
				throw new CarouselApiError("Carousel item not found", 404);
			}
			console.error(`Error updating carousel item with id ${id}:`, error);
			throw new CarouselApiError("Failed to update carousel item", 500);
		}
	},

	async delete(id: number): Promise<{ message: string }> {
		try {
			await API.delete(`/carousel/${id}`);
			return { message: "Carousel item deleted successfully" };
		} catch (error: any) {
			if (error.response?.status === 404) {
				throw new CarouselApiError("Carousel item not found", 404);
			}
			console.error(`Error deleting carousel item with id ${id}:`, error);
			throw new CarouselApiError("Failed to delete carousel item", 500);
		}
	},

	getImageUrl(filename: string): string {
		return `${API.defaults.baseURL}/carousel/image/${filename}`;
	},
};
