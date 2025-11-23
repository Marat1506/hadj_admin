"use client";

import * as React from "react";

import { guideSubcategoriesApi } from "@/lib/guide-subcategories-api";

interface GuideSubcategory {
	id: number;
	title: string;
	description?: string;
	image?: string;
	categoryId: number;
}

export function useGuideSubcategories(categoryId?: number) {
	const [items, setItems] = React.useState<GuideSubcategory[]>([]);
	const [isLoading, setIsLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);

	const fetchItems = React.useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const data = categoryId
				? await guideSubcategoriesApi.getByCategoryId(categoryId)
				: await guideSubcategoriesApi.getAll();
			setItems(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to fetch guide subcategories");
			console.error("Error fetching guide subcategories:", err);
		} finally {
			setIsLoading(false);
		}
	}, [categoryId]);

	const createItem = React.useCallback(async (data: any) => {
		setIsLoading(true);
		setError(null);
		try {
			const newItem = await guideSubcategoriesApi.create(data);
			setItems((prev) => [...prev, newItem]);
			return newItem;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to create guide subcategory";
			setError(errorMessage);
			console.error("Error creating guide subcategory:", err);
			throw new Error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const updateItem = React.useCallback(async (id: number, data: any) => {
		setIsLoading(true);
		setError(null);
		try {
			const updatedItem = await guideSubcategoriesApi.update(id, data);
			setItems((prev) => prev.map((item) => (item.id === id ? updatedItem : item)));
			return updatedItem;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to update guide subcategory";
			setError(errorMessage);
			console.error("Error updating guide subcategory:", err);
			throw new Error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const deleteItem = React.useCallback(async (id: number) => {
		setIsLoading(true);
		setError(null);
		try {
			await guideSubcategoriesApi.delete(id);
			setItems((prev) => prev.filter((item) => item.id !== id));
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to delete guide subcategory";
			setError(errorMessage);
			console.error("Error deleting guide subcategory:", err);
			throw new Error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, []);

	React.useEffect(() => {
		fetchItems();
	}, [fetchItems]);

	return {
		items,
		isLoading,
		error,
		fetchItems,
		createItem,
		updateItem,
		deleteItem,
	};
}
