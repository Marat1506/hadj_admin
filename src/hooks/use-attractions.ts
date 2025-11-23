'use client';

import * as React from 'react';
import { attractionsApi } from '@/lib/attractions-api';

interface AttractionItem {
  id: number;
  title: string;
  description: string;
  cover: string;
  additionalInformation?: string;
  location?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export function useAttractions() {
  const [items, setItems] = React.useState<AttractionItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchItems = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await attractionsApi.getAll();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить достопримечательности');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createItem = React.useCallback(
    async (data: any) => {
      setIsLoading(true);
      setError(null);
      try {
        const newItem = await attractionsApi.create(data);
        await fetchItems();
        return newItem;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Не удалось создать достопримечательность');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchItems]
  );

  const updateItem = React.useCallback(
    async (id: number, data: any) => {
      setIsLoading(true);
      setError(null);
      try {
        const updatedItem = await attractionsApi.update(id, data);
        await fetchItems();
        return updatedItem;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Не удалось обновить достопримечательность');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchItems]
  );

  const deleteItem = React.useCallback(
    async (id: number) => {
      setIsLoading(true);
      setError(null);
      try {
        await attractionsApi.delete(id);
        await fetchItems();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Не удалось удалить достопримечательность');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchItems]
  );

  const getItem = React.useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      return await attractionsApi.getById(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить достопримечательность');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { items, isLoading, error, fetchItems, createItem, updateItem, deleteItem, getItem };
}
