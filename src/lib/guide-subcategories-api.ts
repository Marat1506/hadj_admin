import { API } from "@/lib/api";

interface GuideSubcategory {
	id: number;
	title: string;
	description?: string;
	image?: string;
	categoryId: number;
}

interface CreateGuideSubcategoryData {
	title: string;
	description?: string;
	image?: string;
	imageFile?: File;
	categoryId: number;
}

interface UpdateGuideSubcategoryData {
	title?: string;
	description?: string;
	image?: string;
	imageFile?: File;
	categoryId?: number;
}

class GuideSubcategoriesApiError extends Error {
	constructor(
		message: string,
		public status?: number
	) {
		super(message);
		this.name = "GuideSubcategoriesApiError";
	}
}

export const guideSubcategoriesApi = {
	async getAll(): Promise<GuideSubcategory[]> {
		try {
			const { data } = await API.get("/guide-subcategories");
			return data;
		} catch (error) {
			console.error("Error fetching guide subcategories:", error);
			throw new GuideSubcategoriesApiError("Failed to fetch guide subcategories", 500);
		}
	},

	async getByCategoryId(categoryId: number): Promise<GuideSubcategory[]> {
		try {
			const { data } = await API.get(`/guide-subcategories?categoryId=${categoryId}`);
			return data;
		} catch (error) {
			console.error(`Error fetching guide subcategories for category ${categoryId}:`, error);
			throw new GuideSubcategoriesApiError("Failed to fetch guide subcategories", 500);
		}
	},

	async getById(id: number): Promise<GuideSubcategory> {
		try {
			const { data } = await API.get(`/guide-subcategories/${id}`);
			return data;
		} catch (error: any) {
			if (error.response?.status === 404) {
				throw new GuideSubcategoriesApiError("Guide subcategory not found", 404);
			}
			console.error(`Error fetching guide subcategory with id ${id}:`, error);
			throw new GuideSubcategoriesApiError("Failed to fetch guide subcategory", 500);
		}
	},

	async create(subcategoryData: CreateGuideSubcategoryData): Promise<GuideSubcategory> {
		try {
			const formData = new FormData();
			formData.append("title", subcategoryData.title);
			formData.append("categoryId", subcategoryData.categoryId.toString());
			formData.append("description", subcategoryData.description || "");
			if (subcategoryData.imageFile) {
				formData.append("image", subcategoryData.imageFile);
			} else if (subcategoryData.image) {
				formData.append("image", subcategoryData.image);
			}

			const { data } = await API.post("/guide-subcategories", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return data;
		} catch (error: any) {
			if (error.response?.status === 400) {
				console.error("Validation error details:", error.response?.data);
				throw new GuideSubcategoriesApiError(
					`Invalid subcategory data: ${JSON.stringify(error.response?.data?.message || error.response?.data)}`,
					400
				);
			}
			console.error("Error creating guide subcategory:", error);
			throw new GuideSubcategoriesApiError("Failed to create guide subcategory", 500);
		}
	},

	async update(id: number, updateData: UpdateGuideSubcategoryData): Promise<GuideSubcategory> {
		try {
			const formData = new FormData();
			if (updateData.title) {
				formData.append("title", updateData.title);
			}
			if (updateData.categoryId) {
				formData.append("categoryId", updateData.categoryId.toString());
			}
			if (updateData.description !== undefined) {
				formData.append("description", updateData.description);
			}
			if (updateData.imageFile) {
				formData.append("image", updateData.imageFile);
			} else if (updateData.image !== undefined) {
				formData.append("image", updateData.image);
			}

			const { data } = await API.patch(`/guide-subcategories/${id}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return data;
		} catch (error: any) {
			if (error.response?.status === 404) {
				throw new GuideSubcategoriesApiError("Guide subcategory not found", 404);
			}
			if (error.response?.status === 400) {
				throw new GuideSubcategoriesApiError("Invalid subcategory data", 400);
			}
			console.error(`Error updating guide subcategory with id ${id}:`, error);
			throw new GuideSubcategoriesApiError("Failed to update guide subcategory", 500);
		}
	},

	async delete(id: number): Promise<{ message: string }> {
		try {
			await API.delete(`/guide-subcategories/${id}`);
			return { message: "Guide subcategory deleted successfully" };
		} catch (error: any) {
			if (error.response?.status === 404) {
				throw new GuideSubcategoriesApiError("Guide subcategory not found", 404);
			}
			console.error(`Error deleting guide subcategory with id ${id}:`, error);
			throw new GuideSubcategoriesApiError("Failed to delete guide subcategory", 500);
		}
	},
};
