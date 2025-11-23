import { API } from './api';

export const usersApi = {
  async findMe(): Promise<any> {
    const response = await API.get('/users/findMe');
    return response.data;
  },

  async update(data: any): Promise<any> {
    const response = await API.put('/users/update', data);
    return response.data;
  },

  async resetPassword(data: { oldPassword: string; newPassword: string }): Promise<any> {
    const response = await API.post('/users/resetPassword', data);
    return response.data;
  },

  async findAll(): Promise<any> {
    const response = await API.get('/users/findAll');
    return response.data;
  },
};