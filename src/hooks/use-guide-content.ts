import { useState, useEffect } from 'react';
import { guideContentApi } from '@/lib/guide-content-api';

export function useGuideContent() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const data = await guideContentApi.findAll();
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch guide content:', error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createItem = async (data: any) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    if (data.article) {
      formData.append('article', data.article);
    }
    formData.append('categoryId', data.categoryId.toString());
    formData.append('subcategoryId', data.subcategoryId.toString());
    formData.append('mediaType', data.mediaType);
    
    if (data.media) {
      formData.append('media', data.media);
    }
    
    const result = await guideContentApi.create(formData);
    await fetchItems();
    return result;
  };

  const updateItem = async (id: number, data: any) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    if (data.article) {
      formData.append('article', data.article);
    }
    formData.append('categoryId', data.categoryId.toString());
    formData.append('subcategoryId', data.subcategoryId.toString());
    formData.append('mediaType', data.mediaType);
    
    if (data.media) {
      formData.append('media', data.media);
    }
    
    const result = await guideContentApi.update(id, formData);
    await fetchItems();
    return result;
  };

  const deleteItem = async (id: number) => {
    await guideContentApi.delete(id);
    await fetchItems();
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    isLoading,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  };
}