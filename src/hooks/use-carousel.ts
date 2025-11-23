"use client";

import * as React from "react";

import { carouselApi } from "@/lib/carousel-api";

interface CarouselItem {
	id: number;
	title: string;
	link?: string;
	image: string;
	imageUrl?: string;
	createdAt: string;
	updatedAt: string;
}

export function useCarousel() {
	const [items, setItems] = React.useState<CarouselItem[]>([]);
	const [isLoading, setIsLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);

	const fetchItems = React.useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const data = await carouselApi.getAll();
			setItems(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to fetch carousel items");
			console.error("Error fetching carousel items:", err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const createItem = React.useCallback(async (data: any) => {
		setIsLoading(true);
		setError(null);
		try {
			const newItem = await carouselApi.create(data);
			setItems((prev) => [...prev, newItem]);
			return newItem;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to create carousel item";
			setError(errorMessage);
			console.error("Error creating carousel item:", err);
			throw new Error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const updateItem = React.useCallback(async (id: number, data: any) => {
		setIsLoading(true);
		setError(null);
		try {
			const updatedItem = await carouselApi.update(id, data);
			setItems((prev) => prev.map((item) => (item.id === id ? updatedItem : item)));
			return updatedItem;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to update carousel item";
			setError(errorMessage);
			console.error("Error updating carousel item:", err);
			throw new Error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const deleteItem = React.useCallback(async (id: number) => {
		setIsLoading(true);
		setError(null);
		try {
			await carouselApi.delete(id);
			setItems((prev) => prev.filter((item) => item.id !== id));
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to delete carousel item";
			setError(errorMessage);
			console.error("Error deleting carousel item:", err);
			throw new Error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const getItem = React.useCallback(async (id: number) => {
		setIsLoading(true);
		setError(null);
		try {
			return await carouselApi.getById(id);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to fetch carousel item";
			setError(errorMessage);
			console.error("Error fetching carousel item:", err);
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
