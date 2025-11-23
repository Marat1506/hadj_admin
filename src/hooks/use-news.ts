'use client';

import * as React from 'react';
import { newsApi } from '@/lib/news-api';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  additionalInformation?: string;
  cover: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useNews() {
  const [items, setItems] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchItems = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await newsApi.getAll();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить новостные статьи.');
      console.error('Error fetching news items:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createItem = React.useCallback(async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const newItem = await newsApi.create(data);
      await fetchItems();
      return newItem;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось создать новостную статью';
      setError(errorMessage);
      console.error('Error creating news item:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [fetchItems]);

  const updateItem = React.useCallback(async (id: number, data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedItem = await newsApi.update(id, data);
      await fetchItems();
      return updatedItem;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось обновить новостную статью';
      setError(errorMessage);
      console.error('Error updating news item:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [fetchItems]);

  const deleteItem = React.useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await newsApi.delete(id);
      await fetchItems();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось удалить новостную статью';
      setError(errorMessage);
      console.error('Error deleting news item:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [fetchItems]);

  const getItem = React.useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const item = await newsApi.getById(id);
      return item;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось загрузить новостную статью';
      setError(errorMessage);
      console.error('Error fetching news item:', err);
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
