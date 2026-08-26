import api from './api';
import { AxiosResponse } from 'axios';
import { AddToCartPayload, UpdateCartItemPayload, UserCartResponse } from '@/types/cart.interface';

type CartResponseData = UserCartResponse & {
  data?: UserCartResponse;
};

export const userCart = {
  index: (locale: string): Promise<AxiosResponse<CartResponseData>> =>
    api.get('/user/cart', {
      params: { local: locale },
    }),
  store: (data: AddToCartPayload): Promise<AxiosResponse> =>
    api.post('/user/cart', data),
  update: (id: string | number, data: UpdateCartItemPayload): Promise<AxiosResponse> =>
    api.post(`/user/cart/${id}`, data),
  destroy: (id: string | number): Promise<AxiosResponse> =>
    api.delete(`/user/cart/${id}`),
  clear: (): Promise<AxiosResponse> =>
    api.delete('/user/cart/clear'),
};
