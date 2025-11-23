import { API } from './api';

export const guideContentApi = {
  async findAll(): Promise<any[]> {
    const response = await API.get('/guide-content');
    return response.data;
  },

  async findOne(id: number): Promise<any> {
    const response = await API.get(`/guide-content/${id}`);
    return response.data;
  },

  async create(data: FormData): Promise<any> {
    const response = await API.post('/guide-content', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async update(id: number, data: FormData): Promise<any> {
    const response = await API.put(`/guide-content/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await API.delete(`/guide-content/${id}`);
  },
};