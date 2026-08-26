import api from './api';
import { AxiosResponse } from 'axios';

export const citiesAdmin = {
  getCities: (
    locale: string,
    params?: { page?: number; search?: string }
  ): Promise<AxiosResponse> =>
    api.get('/admin/cities', {
      headers: { 'Accept-Language': locale },
      params,
    }),

  getCitiesList: (locale: string): Promise<AxiosResponse> =>
    api.get('/admin/zones/list', {
      headers: { 'Accept-Language': locale },
    }),

  getCity: (id: string | number, locale: string): Promise<AxiosResponse> =>
    api.get(`/admin/cities/${id}`, {
      headers: { 'Accept-Language': locale },
    }),

  addCity: (data: unknown): Promise<AxiosResponse> =>
    api.post('/admin/cities', data),

  updateCity: (id: string | number, data: unknown): Promise<AxiosResponse> =>
    api.post(`/admin/cities/${id}`, data),

  deleteCity: (id: string | number): Promise<AxiosResponse> =>
    api.delete(`/admin/cities/${id}`),

  changeCityStatus: (id: string | number, status: boolean): Promise<AxiosResponse> =>
    api.post(`/admin/cities/${id}/change-status`, { status: status ? '1' : '0' }),
};
