import api from './api';
import { AxiosResponse } from 'axios';

export const zonesAdmin = {
  getZones: (
    locale: string,
    params?: { page?: number; search?: string }
  ): Promise<AxiosResponse> =>
    api.get('/admin/zones', {
      headers: { 'Accept-Language': locale },
      params,
    }),

  getZonesList: (locale: string): Promise<AxiosResponse> =>
    api.get('/admin/zones/list', {
      headers: { 'Accept-Language': locale },
    }),

  getZone: (id: string | number, locale: string): Promise<AxiosResponse> =>
    api.get(`/admin/zones/${id}`, {
      headers: { 'Accept-Language': locale },
    }),

  addZone: (data: unknown): Promise<AxiosResponse> =>
    api.post('/admin/zones', data),

  updateZone: (id: string | number, data: unknown): Promise<AxiosResponse> =>
    api.post(`/admin/zones/${id}`, data),

  deleteZone: (id: string | number): Promise<AxiosResponse> =>
    api.delete(`/admin/zones/${id}`),

  changeZoneStatus: (id: string | number, status: boolean): Promise<AxiosResponse> =>
    api.post(`/admin/zones/${id}/change-status`, { status: status ? '1' : '0' }),
};
