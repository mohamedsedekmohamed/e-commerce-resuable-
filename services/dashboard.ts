import api from './api';
import { AxiosResponse } from 'axios';

export const dashboardAdmin = {
  getStats: (): Promise<AxiosResponse> =>
    api.get('/admin/home'),
};
