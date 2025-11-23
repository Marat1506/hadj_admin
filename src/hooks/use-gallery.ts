import { useState, useEffect, useCallback } from 'react';
import {
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  GalleryItem,
  CreateGalleryItemData,
} from '@/lib/gallery-api';

export function useGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getGalleryItems();
      setItems(data);
      setError(null);
    } catch (err) {
      setError('Не удалось загрузить галерею');
      console.error('Error fetching gallery items:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const createItem = async (data: CreateGalleryItemData) => {
    try {
      await createGalleryItem(data);
      await fetchItems();
    } catch (err) {
      console.error('Error creating gallery item:', err);
      throw err;
    }
  };

  const updateItem = async (id: number, data: Partial<CreateGalleryItemData>) => {
    try {
      await updateGalleryItem(id, data);
      await fetchItems();
    } catch (err) {
      console.error('Error updating gallery item:', err);
      throw err;
    }
  };

  const deleteItem = async (id: number) => {
    try {
      await deleteGalleryItem(id);
      await fetchItems();
    } catch (err) {
      console.error('Error deleting gallery item:', err);
      throw err;
    }
  };

  return {
    items,
    isLoading,
    error,
    createItem,
    updateItem,
    deleteItem,
    refetch: fetchItems,
  };
}
