import api from './api';
import { AxiosResponse } from 'axios';

export const usersAdmin = {
  getUsers: (
    locale: string,
    params?: { page?: number; search?: string; active?: boolean }
  ): Promise<AxiosResponse> =>
    api.get('/admin/users', {
      headers: { 'Accept-Language': locale },
      params,
    }),

  getUsersList: (locale: string): Promise<AxiosResponse> =>
    api.get('/admin/users/list', {
      headers: { 'Accept-Language': locale },
    }),

  getUser: (id: string | number, locale: string): Promise<AxiosResponse> =>
    api.get(`/admin/users/${id}`, {
      headers: { 'Accept-Language': locale },
    }),

  addUser: (data: unknown): Promise<AxiosResponse> =>
    api.post('/admin/users', data),

  updateUser: (id: string | number, data: unknown): Promise<AxiosResponse> =>
    api.post(`/admin/users/${id}`, data),

  deleteUser: (id: string | number): Promise<AxiosResponse> =>
    api.delete(`/admin/users/${id}`),

  changeUserStatus: (id: string | number, active: boolean): Promise<AxiosResponse> =>
    api.post(`/admin/users/${id}/change-status`, { active }),
};
