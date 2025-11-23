'use client';

import * as React from 'react';
import { servicesApi } from '@/lib/services-api';

interface ServiceItem {
  id: number;
  cityId: number;
  title: string;
  description?: string;
  type: string;
  city?: {
    id: number;
    name: string;
  };
  objects?: Array<{
    id: number;
    title: string;
    latitude?: number;
    longitude?: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface CreateServiceData {
  cityId: number;
  title: string;
  description?: string;
  type: string;
}

interface UpdateServiceData {
  title?: string;
  description?: string;
  type?: string;
  cityId?: number;
}

export function useServices() {
  const [items, setItems] = React.useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchItems = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await servicesApi.getAll();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch services');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createItem = React.useCallback(async (data: CreateServiceData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newItem = await servicesApi.create(data);
      setItems(prev => [...prev, newItem]);
      return newItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create service');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateItem = React.useCallback(async (id: number, data: UpdateServiceData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedItem = await servicesApi.update(id, data);
      setItems(prev => prev.map(item => item.id === id ? updatedItem : item));
      return updatedItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update service');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteItem = React.useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await servicesApi.delete(id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete service');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getItem = React.useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const item = await servicesApi.getById(id);
      return item;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch service');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getByCity = React.useCallback(async (cityId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await servicesApi.getByCity(cityId);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch services by city');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getByType = React.useCallback(async (type: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await servicesApi.getByType(type);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch services by type');
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
    getByCity,
    getByType,
  };
} 