"use client";

import * as React from "react";

import { guideCategoriesApi } from "@/lib/guide-categories-api";

interface GuideCategory {
	id: number;
	title: string;
	iconUrl?: string;
}

export function useGuideCategories() {
	const [items, setItems] = React.useState<GuideCategory[]>([]);
	const [isLoading, setIsLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);

	const fetchItems = React.useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const data = await guideCategoriesApi.getAll();
			setItems(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to fetch guide categories");
			console.error("Error fetching guide categories:", err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const createItem = React.useCallback(async (data: any) => {
		setIsLoading(true);
		setError(null);
		try {
			const newItem = await guideCategoriesApi.create(data);
			setItems((prev) => [...prev, newItem]);
			return newItem;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to create guide category";
			setError(errorMessage);
			console.error("Error creating guide category:", err);
			throw new Error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const updateItem = React.useCallback(async (id: number, data: any) => {
		setIsLoading(true);
		setError(null);
		try {
			const updatedItem = await guideCategoriesApi.update(id, data);
			setItems((prev) => prev.map((item) => (item.id === id ? updatedItem : item)));
			return updatedItem;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to update guide category";
			setError(errorMessage);
			console.error("Error updating guide category:", err);
			throw new Error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const deleteItem = React.useCallback(async (id: number) => {
		setIsLoading(true);
		setError(null);
		try {
			await guideCategoriesApi.delete(id);
			setItems((prev) => prev.filter((item) => item.id !== id));
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to delete guide category";
			setError(errorMessage);
			console.error("Error deleting guide category:", err);
			throw new Error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const getItem = React.useCallback(async (id: number) => {
		setIsLoading(true);
		setError(null);
		try {
			return await guideCategoriesApi.getById(id);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to fetch guide category";
			setError(errorMessage);
			console.error("Error fetching guide category:", err);
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
		getItem,
	};
}
