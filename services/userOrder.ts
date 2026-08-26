import api from './api';
import { AxiosResponse } from 'axios';

export const userOrder = {
  lists: (locale: string): Promise<AxiosResponse> =>
    api.get('/user/orders/lists', {
      params: { local: locale },
    }),

  makeOrder: (data: FormData): Promise<AxiosResponse> =>
    api.post('/user/orders/make', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  orderHistory: (locale: string, page: number = 1): Promise<AxiosResponse> =>
    api.get('/user/orders', {
      params: { local: locale, page },
    }),

  orderDetails: (id: string, locale: string): Promise<AxiosResponse> =>
    api.get(`/user/orders/${id}`, {
      params: { local: locale },
    }),
};
