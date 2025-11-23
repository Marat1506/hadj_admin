'use client';

import * as React from 'react';
import { checklistApi } from '@/lib/checklist-api';

export interface ChecklistItem {
  id: number;
  userId?: number;
  title: string;
  description?: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
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
  priority?: 'low' | 'medium' | 'high' | 'critical';
  isCompleted?: boolean;
  dueDate?: string;
  order?: number;
}

export function useChecklists() {
  const [items, setItems] = React.useState<ChecklistItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchItems = React.useCallback(async (includeCompleted = true) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await checklistApi.getAll(includeCompleted);
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch checklists');
      console.error('Error fetching checklists:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createItem = React.useCallback(async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const newItem = await checklistApi.create(data);
      await fetchItems();
      return newItem;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create checklist item';
      setError(errorMessage);
      console.error('Error creating checklist:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [fetchItems]);

  const updateItem = React.useCallback(async (id: number, data: UpdateChecklistData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedItem = await checklistApi.update(id, data);
      await fetchItems();
      return updatedItem;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update checklist item';
      setError(errorMessage);
      console.error('Error updating checklist:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [fetchItems]);

  const toggleItem = React.useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedItem = await checklistApi.toggle(id);
      await fetchItems();
      return updatedItem;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle checklist item';
      setError(errorMessage);
      console.error('Error toggling checklist:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [fetchItems]);

  const deleteItem = React.useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await checklistApi.delete(id);
      await fetchItems();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete checklist item';
      setError(errorMessage);
      console.error('Error deleting checklist:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [fetchItems]);

  const getStats = React.useCallback(async () => {
    try {
      const stats = await checklistApi.getStats();
      return stats;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch checklists stats');
      throw err;
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
    toggleItem,
    deleteItem,
    getStats,
  };
}
