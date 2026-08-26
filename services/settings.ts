import api from './api';
import { AxiosResponse } from 'axios';
import { StoreSettings } from '@/types/settings.interface';

export const settingsAdmin = {
  getSettings: (locale: string): Promise<AxiosResponse<StoreSettings>> =>
    api.get('/admin/settings', {
      headers: { 'Accept-Language': locale },
    }),
  updateSettings: (locale: string, data: FormData): Promise<AxiosResponse<StoreSettings>> =>
    api.post('/admin/settings', data, {
      headers: { 'Accept-Language': locale },
    }),
};
