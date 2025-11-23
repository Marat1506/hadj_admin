import { API } from "@/lib/api";

export interface ChecklistItem {
	id: number;
	userId?: number;
	title: string;
	description?: string;
	category: string;
	priority: "low" | "medium" | "high" | "critical";
	isCompleted: boolean;
	completedAt?: string | null;
	dueDate?: string | null;
	order?: number;
	isActive?: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export interface CreateChecklistData {
	title: string;
	description?: string;
	category: string;
	priority?: "low" | "medium" | "high" | "critical";
	dueDate?: string;
	order?: number;
}

export interface UpdateChecklistData {
	title?: string;
	description?: string;
	category?: string;
	priority?: "low" | "medium" | "high" | "critical";
	isCompleted?: boolean;
	dueDate?: string;
	order?: number;
}

export interface ChecklistStats {
	total: number;
	completed: number;
	pending: number;
	overdue: number;
	byCategory: Record<string, number>;
	byPriority: Record<string, number>;
}

class ChecklistApiError extends Error {
	constructor(
		message: string,
		public status?: number
	) {
		super(message);
		this.name = "ChecklistApiError";
	}
}

export const checklistApi = {
	async getAll(includeCompleted = true): Promise<ChecklistItem[]> {
		try {
			const { data } = await API.get(`/checklist?includeCompleted=${includeCompleted}`);
			return data;
		} catch (error) {
			console.error("Error fetching checklists items:", error);
			throw new ChecklistApiError("Failed to fetch checklists items", 500);
		}
	},

	async getById(id: number): Promise<ChecklistItem> {
		try {
			const { data } = await API.get(`/checklist/${id}`);
			return data;
		} catch (error: any) {
			if (error.response?.status === 404) {
				throw new ChecklistApiError("Checklist item not found", 404);
			}
			console.error(`Error fetching checklist item with id ${id}:`, error);
			throw new ChecklistApiError("Failed to fetch checklists item", 500);
		}
	},

	async create(checklistData: CreateChecklistData): Promise<ChecklistItem> {
		try {
			const { data } = await API.post("/checklist", checklistData);
			return data;
		} catch (error: any) {
			console.error("Error creating checklists item:", error);
			if (error.response?.status === 400) {
				throw new ChecklistApiError("Invalid checklists data", 400);
			}
			throw new ChecklistApiError("Failed to create checklists item", 500);
		}
	},

	async update(id: number, checklistData: UpdateChecklistData): Promise<ChecklistItem> {
		try {
			const { data } = await API.patch(`/checklist/${id}`, checklistData);
			return data;
		} catch (error: any) {
			if (error.response?.status === 404) {
				throw new ChecklistApiError("Checklist item not found", 404);
			}
			console.error(`Error updating checklist item with id ${id}:`, error);
			throw new ChecklistApiError("Failed to update checklists item", 500);
		}
	},

	async toggle(id: number): Promise<ChecklistItem> {
		try {
			const { data } = await API.patch(`/checklist/${id}/toggle`);
			return data;
		} catch (error: any) {
			if (error.response?.status === 404) {
				throw new ChecklistApiError("Checklist item not found", 404);
			}
			console.error(`Error toggling checklist item with id ${id}:`, error);
			throw new ChecklistApiError("Failed to toggle checklists item", 500);
		}
	},

	async delete(id: number): Promise<{ message: string }> {
		try {
			const { data } = await API.delete(`/checklist/${id}`);
			return data;
		} catch (error: any) {
			if (error.response?.status === 404) {
				throw new ChecklistApiError("Checklist item not found", 404);
			}
			console.error(`Error deleting checklist item with id ${id}:`, error);
			throw new ChecklistApiError("Failed to delete checklists item", 500);
		}
	},

	async getStats(): Promise<ChecklistStats> {
		try {
			const { data } = await API.get("/checklist/stats");
			return data;
		} catch (error) {
			console.error("Error fetching checklists stats:", error);
			throw new ChecklistApiError("Failed to fetch checklists stats", 500);
		}
	},
};
