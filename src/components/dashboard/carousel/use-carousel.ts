'use client';

import * as React from 'react';
import { carouselApi } from '@/lib/carousel-api';

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
  image: File;
}

interface UpdateCarouselData {
  title?: string;
  link?: string;
  image?: File;
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
      setError(err instanceof Error ? err.message : 'Failed to fetch carousel items');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createItem = React.useCallback(async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const newItem = await carouselApi.create(data);
      setItems(prev => [...prev, newItem]);
      return newItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create carousel item');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateItem = React.useCallback(async (id: number, data: UpdateCarouselData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedItem = await carouselApi.update(id, data);
      setItems(prev => prev.map(item => item.id === id ? updatedItem : item));
      return updatedItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update carousel item');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteItem = React.useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await carouselApi.delete(id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete carousel item');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getItem = React.useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const item = await carouselApi.getById(id);
      return item;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch carousel item');
      throw err;
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
