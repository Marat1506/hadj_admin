import { API } from "@/lib/api";

interface GuideCategory {
	id: number;
	title: string;
	iconUrl?: string;
}

interface CreateGuideCategoryData {
	title: string;
	iconUrl?: string;
	icon?: File;
}

interface UpdateGuideCategoryData {
	title?: string;
	iconUrl?: string;
	icon?: File;
}

class GuideCategoriesApiError extends Error {
	constructor(
		message: string,
		public status?: number
	) {
		super(message);
		this.name = "GuideCategoriesApiError";
	}
}

export const guideCategoriesApi = {
	async getAll(): Promise<GuideCategory[]> {
		try {
			const { data } = await API.get("/guide-categories");
			return data;
		} catch (error) {
			console.error("Error fetching guide categories:", error);
			throw new GuideCategoriesApiError("Failed to fetch guide categories", 500);
		}
	},

	async getById(id: number): Promise<GuideCategory> {
		try {
			const { data } = await API.get(`/guide-categories/${id}`);
			return data;
		} catch (error: any) {
			if (error.response?.status === 404) {
				throw new GuideCategoriesApiError("Guide category not found", 404);
			}
			console.error(`Error fetching guide category with id ${id}:`, error);
			throw new GuideCategoriesApiError("Failed to fetch guide category", 500);
		}
	},

	async create(categoryData: CreateGuideCategoryData): Promise<GuideCategory> {
		try {
			const formData = new FormData();
			formData.append("title", categoryData.title);
			if (categoryData.icon) {
				formData.append("icon", categoryData.icon);
			} else if (categoryData.iconUrl) {
				formData.append("iconUrl", categoryData.iconUrl);
			}
			
			const { data } = await API.post("/guide-categories", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return data;
		} catch (error: any) {
			if (error.response?.status === 400) {
				throw new GuideCategoriesApiError("Invalid category data", 400);
			}
			console.error("Error creating guide category:", error);
			throw new GuideCategoriesApiError("Failed to create guide category", 500);
		}
	},

	async update(id: number, updateData: UpdateGuideCategoryData): Promise<GuideCategory> {
		try {
			const formData = new FormData();
			if (updateData.title) {
				formData.append("title", updateData.title);
			}
			if (updateData.icon) {
				formData.append("icon", updateData.icon);
			} else if (updateData.iconUrl !== undefined) {
				formData.append("iconUrl", updateData.iconUrl);
			}
			
			const { data } = await API.patch(`/guide-categories/${id}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return data;
		} catch (error: any) {
			if (error.response?.status === 404) {
				throw new GuideCategoriesApiError("Guide category not found", 404);
			}
			if (error.response?.status === 400) {
				throw new GuideCategoriesApiError("Invalid category data", 400);
			}
			console.error(`Error updating guide category with id ${id}:`, error);
			throw new GuideCategoriesApiError("Failed to update guide category", 500);
		}
	},

	async delete(id: number): Promise<{ message: string }> {
		try {
			await API.delete(`/guide-categories/${id}`);
			return { message: "Guide category deleted successfully" };
		} catch (error: any) {
			if (error.response?.status === 404) {
				throw new GuideCategoriesApiError("Guide category not found", 404);
			}
			console.error(`Error deleting guide category with id ${id}:`, error);
			throw new GuideCategoriesApiError("Failed to delete guide category", 500);
		}
	},
};
