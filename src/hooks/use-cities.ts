'use client';

import * as React from 'react';
import { citiesApi } from '@/lib/cities-api';

interface CityItem {
  id: number;
  name: string;
  services?: Array<{
    id: number;
    title: string;
    type: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface CreateCityData {
  name: string;
}

interface UpdateCityData {
  name?: string;
}

export function useCities() {
  const [items, setItems] = React.useState<CityItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchItems = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await citiesApi.getAll();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cities');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createItem = React.useCallback(async (data: CreateCityData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newItem = await citiesApi.create(data);
      setItems(prev => [...prev, newItem]);
      return newItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create city');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateItem = React.useCallback(async (id: number, data: UpdateCityData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedItem = await citiesApi.update(id, data);
      setItems(prev => prev.map(item => item.id === id ? updatedItem : item));
      return updatedItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update city');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteItem = React.useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await citiesApi.delete(id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete city');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getItem = React.useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const item = await citiesApi.getById(id);
      return item;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch city');
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