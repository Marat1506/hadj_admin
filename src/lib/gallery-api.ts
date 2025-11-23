import { API } from '@/lib/api';

export interface GalleryItem {
  id: number;
  mediaType: 'image' | 'video';
  title?: string;
  description?: string;
  mediaUrl: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGalleryItemData {
  mediaType: 'image' | 'video';
  title?: string;
  description?: string;
  photo?: File;
  videoUrl?: string;
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const { data } = await API.get('/gallery');
  return data;
}

export async function createGalleryItem(data: CreateGalleryItemData): Promise<GalleryItem> {
  const formData = new FormData();
  
  formData.append('mediaType', data.mediaType);
  if (data.title) formData.append('title', data.title);
  if (data.description) formData.append('description', data.description);
  
  if (data.mediaType === 'image' && data.photo) {
    formData.append('photo', data.photo);
  } else if (data.mediaType === 'video' && data.videoUrl) {
    formData.append('videoUrl', data.videoUrl);
  }

  const { data: responseData } = await API.post('/gallery', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return responseData;
}

export async function updateGalleryItem(
  id: number,
  data: Partial<CreateGalleryItemData>,
): Promise<GalleryItem> {
  const formData = new FormData();

  if (data.title !== undefined) formData.append('title', data.title);
  if (data.description !== undefined) formData.append('description', data.description);
  if (data.photo) formData.append('photo', data.photo);
  if (data.videoUrl) formData.append('videoUrl', data.videoUrl);

  const { data: responseData } = await API.put(`/gallery/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return responseData;
}

export async function deleteGalleryItem(id: number): Promise<void> {
  await API.delete(`/gallery/${id}`);
}
